#!/usr/bin/env bash
#
# 웹앱(Next.js) Cloud Run 배포 — 서울 리전, scale-to-zero.
# 모노레포라 빌드 컨텍스트는 레포 루트. apps/web/cloudbuild.yaml 로 이미지 빌드 후 배포한다.
#
# 사전 1회: gcloud auth login / config set project <ID> / 결제 활성화 / 아래 API enable
#   gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
#          artifactregistry.googleapis.com secretmanager.googleapis.com
#
# 사용 (레포 루트 기준 어디서든):
#   API_URL=https://...run.app ./apps/web/deploy-cloudrun.sh
#   # API_URL 미지정 시 couple-calendar-api 서비스에서 자동 조회.
#
# NEXT_PUBLIC_* 은 빌드 시점 인라인이라 빌드 인자로 전달. 도메인 확정 후 Apple 값 채워 재배포.
#   APPLE_CLIENT_ID=... APPLE_REDIRECT_URI=https://<domain>/login API_URL=... ./apps/web/deploy-cloudrun.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

REGION="${REGION:-asia-northeast3}"
SERVICE="${SERVICE:-couple-calendar-web}"
API_SERVICE="${API_SERVICE:-couple-calendar-api}"
AR_REPO="${AR_REPO:-cloud-run-source-deploy}"

PROJECT="$(gcloud config get-value project 2>/dev/null || true)"
[ -n "$PROJECT" ] || { echo "❌ GCP 프로젝트 미설정 → gcloud config set project <ID>"; exit 1; }

# --- 백엔드 API URL (미지정 시 자동 조회) ---
API_URL="${API_URL:-$(gcloud run services describe "$API_SERVICE" --region "$REGION" --format='value(status.url)' 2>/dev/null || true)}"
[ -n "$API_URL" ] || { echo "❌ API_URL 미확인 — API_URL=https://...run.app 로 지정하세요"; exit 1; }

# --- 빌드 인자(NEXT_PUBLIC_*) ---
NP_MOCKING="${NEXT_PUBLIC_API_MOCKING:-disabled}"
APPLE_CLIENT_ID="${APPLE_CLIENT_ID:-}"
APPLE_REDIRECT_URI="${APPLE_REDIRECT_URI:-}"

IMAGE="${REGION}-docker.pkg.dev/${PROJECT}/${AR_REPO}/${SERVICE}:latest"
echo "▶ project=$PROJECT region=$REGION service=$SERVICE"
echo "  API_BASE_URL=$API_URL  mocking=$NP_MOCKING  apple_client=${APPLE_CLIENT_ID:-(none)}"

# --- SESSION_SECRET: 없으면 랜덤 생성해 Secret Manager 등록 ---
SECRET_NAME="cc-web-session-secret"
if ! gcloud secrets describe "$SECRET_NAME" >/dev/null 2>&1; then
  gcloud secrets create "$SECRET_NAME" --replication-policy=automatic >/dev/null
  openssl rand -base64 48 | tr -d '\n' | gcloud secrets versions add "$SECRET_NAME" --data-file=- >/dev/null
  echo "  ✓ secret $SECRET_NAME 생성"
else
  echo "  ✓ secret $SECRET_NAME 재사용"
fi
PROJECT_NUM="$(gcloud projects describe "$PROJECT" --format='value(projectNumber)')"
RUNTIME_SA="${PROJECT_NUM}-compute@developer.gserviceaccount.com"
gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
  --member="serviceAccount:${RUNTIME_SA}" --role="roles/secretmanager.secretAccessor" >/dev/null
echo "  ✓ ${RUNTIME_SA} → secretAccessor"

# --- 이미지 빌드 (레포 루트 컨텍스트 + apps/web/Dockerfile) ---
echo "▶ Cloud Build (수 분 소요)…"
gcloud builds submit \
  --config apps/web/cloudbuild.yaml \
  --substitutions="_IMAGE=${IMAGE},_NEXT_PUBLIC_API_MOCKING=${NP_MOCKING},_NEXT_PUBLIC_APPLE_CLIENT_ID=${APPLE_CLIENT_ID},_NEXT_PUBLIC_APPLE_REDIRECT_URI=${APPLE_REDIRECT_URI}" \
  .

# --- 배포 ---
echo "▶ gcloud run deploy…"
gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars "API_BASE_URL=${API_URL},AUTH_COOKIE_NAME=cc-auth,NEXT_PUBLIC_API_MOCKING=${NP_MOCKING},NODE_ENV=production" \
  --set-secrets "SESSION_SECRET=${SECRET_NAME}:latest"

URL="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"
echo ""
echo "✅ 배포 완료: $URL"
echo "   웹 로드:   curl -I $URL/home"
echo "   API 프록시: curl $URL/api/health   (→ ${API_URL}/api/health)"
