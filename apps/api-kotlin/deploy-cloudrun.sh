#!/usr/bin/env bash
#
# Cloud Run 배포 스크립트 (서울 리전, scale-to-zero)
#
# 사전 1회 준비 (이 스크립트 실행 전에 직접):
#   gcloud auth login
#   gcloud config set project <YOUR_PROJECT_ID>      # 결제 활성화된 프로젝트
#   gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
#          artifactregistry.googleapis.com secretmanager.googleapis.com
#
# 사용:
#   cd apps/api-kotlin && ./deploy-cloudrun.sh
#
# 시크릿(DB 비번/service key 등)은 .env.properties 에서 읽어 Secret Manager 로 올린다.
# 채팅/로그/이미지에 평문이 남지 않는다.

set -euo pipefail
cd "$(dirname "$0")"

REGION="${REGION:-asia-northeast3}"     # 서울
SERVICE="${SERVICE:-couple-calendar-api}"
ENV_FILE=".env.properties"

PROJECT="$(gcloud config get-value project 2>/dev/null || true)"
[ -n "$PROJECT" ] || { echo "❌ GCP 프로젝트 미설정 → gcloud config set project <ID>"; exit 1; }
[ -f "$ENV_FILE" ] || { echo "❌ $ENV_FILE 없음"; exit 1; }
echo "▶ project=$PROJECT  region=$REGION  service=$SERVICE"

# .env.properties 파싱 (KEY=VALUE, '#' 주석/빈 줄 무시)
get() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2-; }

DB_HOST="$(get SUPABASE_DB_HOST)"; DB_PORT="$(get SUPABASE_DB_PORT)"
DB_NAME="$(get SUPABASE_DB_NAME)"; DB_USER="$(get SUPABASE_DB_USER)"
DB_PASSWORD="$(get SUPABASE_DB_PASSWORD)"
SB_URL="$(get SUPABASE_URL)"; SB_ANON="$(get SUPABASE_ANON_KEY)"; SB_SVC="$(get SUPABASE_SERVICE_KEY)"

# --- 민감값 → Secret Manager (없으면 생성, 있으면 새 버전 추가) ---
ensure_secret() {
  local name="$1" val="$2"
  gcloud secrets describe "$name" >/dev/null 2>&1 \
    || gcloud secrets create "$name" --replication-policy=automatic >/dev/null
  printf '%s' "$val" | gcloud secrets versions add "$name" --data-file=- >/dev/null
  echo "  ✓ secret $name"
}
echo "▶ Secret Manager 등록"
ensure_secret cc-supabase-db-password "$DB_PASSWORD"
ensure_secret cc-supabase-anon-key    "$SB_ANON"
ensure_secret cc-supabase-service-key "$SB_SVC"

# --- Cloud Run 런타임 SA 에 secret 접근 권한 부여 ---
PROJECT_NUM="$(gcloud projects describe "$PROJECT" --format='value(projectNumber)')"
RUNTIME_SA="${PROJECT_NUM}-compute@developer.gserviceaccount.com"
for s in cc-supabase-db-password cc-supabase-anon-key cc-supabase-service-key; do
  gcloud secrets add-iam-policy-binding "$s" \
    --member="serviceAccount:${RUNTIME_SA}" \
    --role="roles/secretmanager.secretAccessor" >/dev/null
done
echo "  ✓ ${RUNTIME_SA} → secretAccessor"

# --- 배포 (--source 가 Dockerfile 로 Cloud Build → Artifact Registry → 배포) ---
echo "▶ gcloud run deploy (Cloud Build 빌드 포함, 수 분 소요)"
gcloud run deploy "$SERVICE" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars "SUPABASE_DB_HOST=${DB_HOST},SUPABASE_DB_PORT=${DB_PORT},SUPABASE_DB_NAME=${DB_NAME},SUPABASE_DB_USER=${DB_USER},SUPABASE_URL=${SB_URL}" \
  --set-secrets "SUPABASE_DB_PASSWORD=cc-supabase-db-password:latest,SUPABASE_ANON_KEY=cc-supabase-anon-key:latest,SUPABASE_SERVICE_KEY=cc-supabase-service-key:latest"

URL="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"
echo ""
echo "✅ 배포 완료: $URL"
echo "   헬스체크:  curl $URL/api/health"
