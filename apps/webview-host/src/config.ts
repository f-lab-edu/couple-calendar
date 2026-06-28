import { Platform } from 'react-native';

const PORT = 3000;
// The web app has no root route; /home is the entry point.
const PATH = '/home';
// Local development only: the Metro dev server and emulators/simulators reach the
// host over the local network in cleartext, so http (not https) is intentional.
export const SCHEME = 'http';

// Production web app origin (deployed Next.js on GCP, fronted by CloudFront). MUST be HTTPS.
// Release builds load this URL; dev keeps localhost/10.0.2.2.
export const PROD_WEB_APP_ORIGIN = 'https://couple-calendar.woo-bottle.com';

export function resolveWebAppUrl(os: 'ios' | 'android'): string {
  // Release (TestFlight/App Store) builds load the deployed web app over HTTPS.
  if (!__DEV__) {
    return `${PROD_WEB_APP_ORIGIN}${PATH}`;
  }
  // Development: Android emulator reaches the host machine via 10.0.2.2.
  const host = os === 'android' ? '10.0.2.2' : 'localhost';
  return `${SCHEME}://${host}:${PORT}${PATH}`;
}

export const WEB_APP_URL: string = resolveWebAppUrl(
  Platform.OS as 'ios' | 'android',
);

// 웹 앱 배경색(globals.css 의 --bg-page). 네이티브 셸(루트 뷰·WebView 기본 배경·
// 로딩 화면)을 이 값으로 맞춰 로드/오버스크롤 시 흰색이 비치지 않게 한다.
export const WEB_BG_COLOR = '#0d0d0e';
