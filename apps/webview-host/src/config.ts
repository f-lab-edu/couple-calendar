import { Platform } from 'react-native';

const PORT = 3000;
// The web app has no root route; /home is the entry point.
const PATH = '/home';
// Local development only: the Metro dev server and emulators/simulators reach the
// host over the local network in cleartext, so http (not https) is intentional.
export const SCHEME = 'http';

// Production web app origin (deployed Next.js on GCP). MUST be HTTPS.
// TODO(deploy): replace with the live domain before shipping a release build,
// e.g. 'https://couple-calendar.woo-bottle.com'. Release builds load this URL;
// leaving the placeholder will load a non-existent host on testers' devices.
export const PROD_WEB_APP_ORIGIN = 'https://CHANGE-ME.example.com';

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
