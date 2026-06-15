# WebView Host RN 앱 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** couple-calendar 웹앱(`apps/web`, Next.js@localhost:3000)을 `react-native-instant-webview` 풀링 라이브러리로 띄우는 Bare RN 호스트 앱 `apps/webview-host`를 만든다.

**Architecture:** `apps/mobile`과 동일한 RN 0.83.1 / React 19.2 Bare RN 앱을 신규 워크스페이스로 스캐폴드한다. `WebViewPoolProvider`로 루트를 감싸고 `PooledWebView`로 웹앱 URL을 로드한다. URL은 플랫폼별(iOS `localhost`, Android `10.0.2.2`)로 분기하고, http 평문 로딩을 위한 네이티브 설정을 추가한다.

**Tech Stack:** React Native 0.83.1, React 19.2, TypeScript, `react-native-webview`, `react-native-instant-webview@0.2.0`, pnpm workspace, Jest.

---

## 사전 참고

- 기존 `apps/mobile`(Bare RN 0.83.1)을 레퍼런스로 삼는다. 버전/툴체인 정렬 목적.
- 모노레포 루트 `package.json` workspaces: `apps/*` — 새 폴더는 자동 포함됨.
- 라이브러리 API: `WebViewPoolProvider config={{ poolSize }}`, `PooledWebView` (WebViewProps + `containerStyle` / `onPoolExhausted` / `onBorrowed` / `onReturned`). 풀 소진 시 일반 WebView로 자동 폴백.

---

### Task 1: RN 앱 스캐폴드

**Files:**
- Create: `apps/webview-host/` (cli init 산출물 전체)

**Step 1: RN 0.83.1 앱 생성**

루트 `apps/`에서 실행 (디렉터리 이름은 `webview-host`):

```bash
cd apps
npx @react-native-community/cli@20.0.0 init webviewhost --version 0.83.1 --directory webview-host --skip-install --title WebViewHost
```

- `--skip-install`: 의존성은 모노레포 루트 pnpm으로 일괄 설치하므로 스킵.
- 생성 후 `apps/webview-host/{App.tsx, package.json, android, ios, metro.config.js, index.js}` 확인.

**Step 2: 산출물 확인**

Run: `ls apps/webview-host`
Expected: `App.tsx package.json android ios index.js metro.config.js ...`

**Step 3: 앱 이름/버전 정렬**

`apps/webview-host/package.json` 의 `name`을 모노레포 규약에 맞춘다:

```json
{
  "name": "@couple-calendar/webview-host",
  "version": "0.0.1",
  "private": true
}
```

`react`/`react-native` 버전이 `apps/mobile`(react 19.2.0, react-native 0.83.1)과 일치하는지 확인하고 불일치 시 맞춘다.

**Step 4: Commit**

```bash
cd /Users/logan/Repository/wooBottle/mentoring/couple-calendar
git add apps/webview-host
git commit -m "feat(webview-host): scaffold bare RN 0.83.1 app"
```

---

### Task 2: 모노레포 통합 + 의존성 설치

**Files:**
- Modify: `apps/webview-host/package.json` (deps 추가)
- Verify: 루트 `pnpm-workspace.yaml` / `package.json` workspaces

**Step 1: WebView 의존성 추가**

`apps/webview-host/package.json` `dependencies`에 추가:

```json
"react-native-webview": "^13.16.0",
"react-native-instant-webview": "^0.2.0"
```

(`react-native-webview`는 instant-webview의 peer. 13.x 최신 호환 버전 사용.)

**Step 2: 루트에서 설치**

```bash
cd /Users/logan/Repository/wooBottle/mentoring/couple-calendar
pnpm install
```

Expected: `@couple-calendar/webview-host` 워크스페이스 인식, node_modules 링크 생성.

**Step 3: 설치 검증**

Run: `pnpm --filter @couple-calendar/webview-host exec node -e "require('react-native-instant-webview'); require('react-native-webview'); console.log('ok')"`
Expected: `ok`

**Step 4: Commit**

```bash
git add apps/webview-host/package.json pnpm-lock.yaml
git commit -m "feat(webview-host): add react-native-webview + instant-webview deps"
```

---

### Task 3: URL 설정 모듈 (config.ts) — TDD

**Files:**
- Create: `apps/webview-host/src/config.ts`
- Test: `apps/webview-host/src/config.test.ts`

**Step 1: 실패하는 테스트 작성**

`apps/webview-host/src/config.test.ts`:

```ts
import { Platform } from 'react-native';
import { resolveWebAppUrl } from './config';

describe('resolveWebAppUrl', () => {
  it('returns localhost on ios', () => {
    expect(resolveWebAppUrl('ios')).toBe('http://localhost:3000');
  });

  it('returns 10.0.2.2 on android', () => {
    expect(resolveWebAppUrl('android')).toBe('http://10.0.2.2:3000');
  });

  it('defaults WEB_APP_URL from current platform', () => {
    expect(WEB_APP_URL).toBe(resolveWebAppUrl(Platform.OS as 'ios' | 'android'));
  });
});

import { WEB_APP_URL } from './config';
```

**Step 2: 실패 확인**

Run: `pnpm --filter @couple-calendar/webview-host exec jest src/config.test.ts`
Expected: FAIL (`resolveWebAppUrl` not found)

**Step 3: 최소 구현**

`apps/webview-host/src/config.ts`:

```ts
import { Platform } from 'react-native';

const WEB_PORT = 3000;

/** 에뮬레이터에서 호스트의 Next.js dev 서버로 접근하는 URL. */
export function resolveWebAppUrl(os: 'ios' | 'android'): string {
  const host = os === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:${WEB_PORT}`;
}

export const WEB_APP_URL = resolveWebAppUrl(Platform.OS as 'ios' | 'android');
```

**Step 4: 통과 확인**

Run: `pnpm --filter @couple-calendar/webview-host exec jest src/config.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/webview-host/src/config.ts apps/webview-host/src/config.test.ts
git commit -m "feat(webview-host): platform-aware web app url config"
```

---

### Task 4: WebViewScreen 컴포넌트

**Files:**
- Create: `apps/webview-host/src/WebViewScreen.tsx`

**Step 1: 구현**

`apps/webview-host/src/WebViewScreen.tsx`:

```tsx
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PooledWebView } from 'react-native-instant-webview';
import { WEB_APP_URL } from './config';

export function WebViewScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <PooledWebView
        source={{ uri: WEB_APP_URL }}
        containerStyle={StyleSheet.absoluteFill}
        onLoadEnd={() => setLoading(false)}
        onError={() => setError(`Failed to load ${WEB_APP_URL}`)}
        onPoolExhausted={() => console.warn('[webview-host] pool exhausted, fell back to WebView')}
      />
      {loading && !error && (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" />
        </View>
      )}
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: { color: '#c00', padding: 16, textAlign: 'center' },
});
```

**Step 2: 타입체크**

Run: `pnpm --filter @couple-calendar/webview-host exec tsc --noEmit`
Expected: 에러 없음 (App.tsx에서 아직 미사용이어도 무방)

**Step 3: Commit**

```bash
git add apps/webview-host/src/WebViewScreen.tsx
git commit -m "feat(webview-host): WebViewScreen with loading/error states"
```

---

### Task 5: App.tsx — Provider 래핑

**Files:**
- Modify: `apps/webview-host/App.tsx`

**Step 1: 교체**

`apps/webview-host/App.tsx` 전체를 다음으로 교체:

```tsx
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { WebViewPoolProvider } from 'react-native-instant-webview';
import { WebViewScreen } from './src/WebViewScreen';

function App(): React.JSX.Element {
  return (
    <WebViewPoolProvider config={{ poolSize: 3 }}>
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" />
        <WebViewScreen />
      </SafeAreaView>
    </WebViewPoolProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
```

**Step 2: 타입체크**

Run: `pnpm --filter @couple-calendar/webview-host exec tsc --noEmit`
Expected: 에러 없음

**Step 3: Commit**

```bash
git add apps/webview-host/App.tsx
git commit -m "feat(webview-host): wrap app with WebViewPoolProvider"
```

---

### Task 6: 네이티브 평문(http) 로딩 설정

**Files:**
- Modify: `apps/webview-host/ios/webviewhost/Info.plist`
- Modify: `apps/webview-host/android/app/src/main/AndroidManifest.xml`

**Step 1: iOS — NSAllowsLocalNetworking**

`Info.plist` 의 `NSAppTransportSecurity` dict에 추가 (없으면 dict 생성):

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsLocalNetworking</key>
  <true/>
</dict>
```

> 주: RN 기본 템플릿은 `localhost` 예외(`NSExceptionDomains`)가 이미 있을 수 있음. 있으면 그대로 두고 `NSAllowsLocalNetworking`만 보강.

**Step 2: Android — usesCleartextTraffic**

`AndroidManifest.xml` 의 `<application ...>` 태그에 속성 추가:

```xml
<application
  ...
  android:usesCleartextTraffic="true">
```

> 주: RN debug 빌드는 `android/app/src/debug/AndroidManifest.xml`에 이미 cleartext가 있을 수 있음. release까지 필요하면 main에도 추가.

**Step 3: Commit**

```bash
git add apps/webview-host/ios apps/webview-host/android
git commit -m "feat(webview-host): allow cleartext http for local dev server"
```

---

### Task 7: iOS Pods 설치 + 실행 검증

**Files:** (변경 없음 — 빌드/실행 검증)

**Step 1: CocoaPods 설치**

```bash
cd apps/webview-host/ios
pod install
```

Expected: `react-native-webview`, `react-native-instant-webview` Pod 링크됨.

**Step 2: 웹앱 dev 서버 기동 (별도 터미널)**

```bash
pnpm --filter @couple-calendar/web-next dev
```

Expected: `localhost:3000` 에서 Next.js 서빙.

**Step 3: iOS 시뮬레이터 실행**

```bash
cd /Users/logan/Repository/wooBottle/mentoring/couple-calendar/apps/webview-host
pnpm ios
```

Expected: 시뮬레이터에서 앱 부팅 → WebView에 couple-calendar 웹앱 렌더 → 스피너 사라짐.

**Step 4: 검증 (@superpowers:verification-before-completion)**

- [ ] 앱이 크래시 없이 부팅
- [ ] WebView에 웹앱 화면이 보임 (빈 화면/에러 텍스트 아님)
- [ ] Metro 로그에 pool 관련 치명적 에러 없음

**Step 5: Commit (필요 시 Podfile.lock 등)**

```bash
git add apps/webview-host/ios/Podfile.lock
git commit -m "chore(webview-host): pod install"
```

---

## 완료 기준

- `apps/webview-host` 가 모노레포 워크스페이스로 인식되고 의존성 설치됨.
- iOS 시뮬레이터에서 `react-native-instant-webview`의 `PooledWebView`로 `apps/web`(localhost:3000)이 정상 로드됨.
- `config.test.ts` 통과, `tsc --noEmit` 클린.
