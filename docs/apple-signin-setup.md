# Sign in with Apple — 설정 가이드 (코드 밖 작업)

웹/백엔드 **코드는 이미 완성**되어 있다. 실제 Apple 로그인이 동작하려면 아래 콘솔/환경변수 설정만 채우면 된다.

흐름: 웹(Apple JS SDK로 `id_token` 획득) → `POST /api/auth/apple` → 백엔드 `SupabaseAuthClient` → Supabase `/auth/v1/token?grant_type=id_token` (provider=apple). **Apple id_token 서명 검증은 Supabase가 대행**하므로 백엔드에 커스텀 JWKS 코드는 필요 없다.

---

## 1. Apple Developer (developer.apple.com)

1. **App ID** (이미 있으면 생략): Identifiers → App IDs → "Sign in with Apple" capability 활성화.
2. **Services ID 생성** — Identifiers → **Services IDs** → 새로 생성
   - Identifier 예: `com.couplecalendar.web` → 이 값이 웹 `NEXT_PUBLIC_APPLE_CLIENT_ID`.
   - "Sign in with Apple" 활성화 → Configure:
     - **Primary App ID**: 위 App ID 선택
     - **Domains**: 배포 도메인 (예: `app.couplecalendar.com`) — 로컬 테스트는 https 필요
     - **Return URLs**: `https://app.couplecalendar.com/login` (웹 `NEXT_PUBLIC_APPLE_REDIRECT_URI`와 정확히 일치)
3. **Key (.p8) 발급** — Keys → 새 Key → "Sign in with Apple" 체크 → App ID 연결 → 다운로드(.p8, **1회만 다운로드 가능**).
   - 메모: **Key ID**, **Team ID**(우상단), Services ID — Supabase 설정에 사용.

## 2. Supabase Dashboard (Authentication → Providers → Apple)

1. Apple provider **Enable**.
2. 입력값:
   - **Client IDs**: 위 Services ID (`com.couplecalendar.web`). 네이티브 앱도 쓰면 App ID도 콤마로 추가.
   - **Secret Key (for OAuth)**: Apple은 client_secret을 .p8로 서명한 JWT로 요구. Supabase는 보통 .p8 / Key ID / Team ID / Services ID를 넣으면 내부 생성하거나, 직접 생성한 client_secret JWT를 넣는다(대시보드 안내 따름).
3. Supabase 프로젝트의 **URL**과 **anon key** 확인 (Project Settings → API):
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY` → 백엔드 env.
   - Redirect/Callback이 필요하면 Supabase Auth URL Configuration에도 사이트 URL 등록.

## 3. 환경변수

### 웹 — `apps/web/.env.local` (gitignore됨, 직접 생성)
```bash
NEXT_PUBLIC_APPLE_CLIENT_ID=com.couplecalendar.web
NEXT_PUBLIC_APPLE_REDIRECT_URI=https://<배포도메인>/login
# 실 백엔드로 붙일 때는 MSW 끄기
NEXT_PUBLIC_API_MOCKING=disabled
NEXT_PUBLIC_API_BASE_URL=https://<api-도메인>
```
> 둘(`APPLE_CLIENT_ID`, `APPLE_REDIRECT_URI`)이 모두 있으면 로그인 페이지가 Apple JS SDK 경로로 동작, 없으면 dev 폴백 토큰(=MSW mock 전용).

### 백엔드 — 실행 환경에 export (Spring은 `.env` 자동 로드 안 함)
`application.yml`이 참조하는 값:
```bash
export SUPABASE_URL=https://<project-ref>.supabase.co
export SUPABASE_ANON_KEY=<anon-key>
export SUPABASE_SERVICE_KEY=<service-role-key>   # 필요 시
export SUPABASE_DB_HOST=...
export SUPABASE_DB_PORT=5432
export SUPABASE_DB_NAME=postgres
export SUPABASE_DB_USER=...
export SUPABASE_DB_PASSWORD=...
```
> IntelliJ Run Configuration의 Environment variables, 또는 `direnv`/CI Secrets로 주입.

## 4. 동작 확인

1. 백엔드: `SUPABASE_*` export 후 `GRADLE_OPTS="-Dorg.gradle.daemon=false" ./gradlew bootRun` (gradlew 따옴표 이슈 회피 — `docs` 참조).
2. 웹: `.env.local` 채우고 `NEXT_PUBLIC_API_MOCKING=disabled` 로 `pnpm dev`.
3. 로그인 페이지 "Apple로 계속하기" → 실제 Apple 팝업 → 성공 시 `coupleId` 유무로 `/home` 또는 `/onboarding` 라우팅.

## 미해결 정책 결정
- **accessToken 전달 방식**: 현재 세션 쿠키에 저장돼 있으나, 보호 API는 상대 URL+쿠키 가정이라 Bearer 미부착. 백엔드 `AuthFilter`가 Bearer를 요구하면 공통 fetcher에 토큰 주입 seam 추가 필요.
- **포트 불일치**: `application.yml` `server.port: 3000` vs 웹 `.env`의 `API_BASE_URL=:8080` — 실연동 시 통일 필요.
