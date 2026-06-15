# WebView Host RN 앱 설계

날짜: 2026-06-07
대상: `apps/webview-host` (신규 워크스페이스)

## 목적

couple-calendar 웹앱(`apps/web`, Next.js)을 React Native WebView로 띄우는 호스트 앱.
WebView 풀링 오픈소스 라이브러리 `react-native-instant-webview`를 사용/도그푸딩한다.

## 결정 사항

| 항목 | 결정 | 비고 |
|------|------|------|
| 위치/형태 | `apps/` 하위 신규 워크스페이스 | 모노레포 turbo/pnpm 공유 |
| 프레임워크 | Bare RN (접근 A) | 라이브러리 네이티브 모듈 + autolinking 요구 |
| RN 버전 | 0.83.1 / React 19.2 | `apps/mobile`과 동일하게 정렬 |
| WebView 라이브러리 | `react-native-instant-webview@0.2.0` | peer: `react-native-webview` |
| 초기 콘텐츠 | couple-calendar 웹앱 | `localhost:3000` 기본값 |

## 구조

```
apps/webview-host/                 (name: @couple-calendar/webview-host)
├── App.tsx                # WebViewPoolProvider 루트 래핑 + WebViewScreen 렌더
├── src/
│   ├── config.ts          # WEB_APP_URL (플랫폼별 기본값)
│   └── WebViewScreen.tsx  # PooledWebView + 로딩/에러/pool-exhausted 처리
├── android/  ios/         # cli init 생성 네이티브 프로젝트
├── package.json           # RN 0.83.1, react 19.2
└── metro.config.js
```

## 핵심 동작

- `App.tsx`: `<WebViewPoolProvider config={{ poolSize: 3 }}>` 로 앱 루트 래핑.
- `WebViewScreen.tsx`: `<PooledWebView source={{ uri: WEB_APP_URL }} containerStyle={StyleSheet.absoluteFill} />`.
  - `onLoadEnd` 로딩 스피너 해제, `onError` 에러 표시, `onPoolExhausted` 경고 로깅(라이브러리가 일반 WebView로 자동 폴백).
- `config.ts`: Next.js 웹앱(`localhost:3000`) 대상.
  - `Platform.select`: iOS 시뮬레이터 `http://localhost:3000`, Android 에뮬레이터 `http://10.0.2.2:3000`.

## 네이티브 설정 (http 평문 로딩)

- iOS: `Info.plist` `NSAppTransportSecurity > NSAllowsLocalNetworking`.
- Android: `AndroidManifest.xml` `android:usesCleartextTraffic="true"` (또는 network-security-config).

## 의존성

- `react-native-webview` (peer)
- `react-native-instant-webview@0.2.0`

## 검증

1. `apps/web` dev 서버 실행 (`pnpm --filter @couple-calendar/web-next dev`).
2. `pnpm --filter @couple-calendar/webview-host ios` → 시뮬레이터에서 웹앱 로딩 확인.
