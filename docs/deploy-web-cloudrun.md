# 웹앱(apps/web) GCP Cloud Run 배포 메모

couple-calendar 웹앱(Next.js)을 GCP Cloud Run에 올리기 위한 준비/절차. webview-host 릴리스
빌드가 이 배포 URL을 로드한다(`apps/webview-host/src/config.ts`의 `PROD_WEB_APP_ORIGIN`).

## 구성 개요
```
iOS webview-host (release) ─HTTPS─▶ Cloud Run: web (Next.js) ─/api 프록시─▶ Cloud Run: api (Spring Boot) ─▶ Supabase
```
- 웹앱은 `output: "standalone"`(next.config.ts) + `outputFileTracingRoot`(레포 루트)로 빌드 →
  pnpm 워크스페이스 의존성까지 추적한 자립 서버 번들 생성.
- 컨테이너 이미지는 `apps/web/Dockerfile`(빌드 컨텍스트 = **레포 루트**)로 만든다.

## 빌드 & 배포

빌드 컨텍스트는 반드시 레포 루트:

```bash
# 로컬 도커 검증
docker build -f apps/web/Dockerfile -t couple-calendar-web .
docker run --rm -p 3000:3000 --env-file apps/web/.env.production couple-calendar-web

# Cloud Run 배포 (레포 루트에서 실행; 위 Dockerfile 사용)
gcloud run deploy couple-calendar-web \
  --source . \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_MOCKING=disabled,API_BASE_URL=https://<api-url>,AUTH_COOKIE_NAME=cc-auth \
  --set-env-vars NEXT_PUBLIC_APPLE_CLIENT_ID=com.woobottle.couplecalendarWeb,NEXT_PUBLIC_APPLE_REDIRECT_URI=https://<web-domain>/login \
  --set-secrets SESSION_SECRET=couplecalendar-session-secret:latest
```

> 참고: `--source .`는 레포 루트에 Dockerfile이 있으면 그걸 쓴다. 이 Dockerfile은 `apps/web/`에
> 있으므로, Cloud Build 구성(cloudbuild.yaml) 또는 `gcloud builds submit --config`로 `-f apps/web/Dockerfile`을
> 지정하거나, 레포 루트로 심볼릭/복사해 사용한다. 가장 단순하게는 `docker build`로 이미지를 만들어
> Artifact Registry에 push 후 `gcloud run deploy --image`로 올린다.

## 필요한 환경변수
`apps/web/.env.production.example` 참고. 핵심:
- `API_BASE_URL` — 배포된 Kotlin API URL (서버 측 /api 프록시 대상)
- `NEXT_PUBLIC_API_MOCKING=disabled` — 프로덕션에서 MSW 끄기 (필수)
- `SESSION_SECRET` — 긴 랜덤 문자열 (Secret Manager 권장)
- `NEXT_PUBLIC_APPLE_CLIENT_ID` / `NEXT_PUBLIC_APPLE_REDIRECT_URI` — Apple 웹 로그인

## 배포 후 연동 체크리스트
- [ ] 커스텀 도메인 매핑 (예: `couple-calendar.woo-bottle.com`)
- [ ] Apple Developer **Services ID** redirect URI를 배포 도메인 `/login`으로 갱신
- [ ] `apps/webview-host/src/config.ts`의 `PROD_WEB_APP_ORIGIN`을 배포 도메인으로 교체
- [ ] iOS 빌드 번호 ↑ → archive → 업로드 (빌드 2)

## standalone을 안 쓰는 대안 (참고)
- 일반 도커(`next start` + 전체 node_modules): 동작은 같지만 이미지가 큼.
- Cloud Run 소스 배포(빌드팩): pnpm 워크스페이스에서 컨텍스트 잡기가 까다로워 비권장.
- 정적 export(`output: "export"`): **불가** — 서버 route handler(/api 프록시)·세션 암호화가 Node 서버 필요.
