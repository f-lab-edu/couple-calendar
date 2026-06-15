import { Platform } from 'react-native';

const PORT = 3000;
// The web app has no root route; /home is the entry point.
const PATH = '/home';
// Local development only: the Metro dev server and emulators/simulators reach the
// host over the local network in cleartext, so http (not https) is intentional.
export const SCHEME = 'http';

export function resolveWebAppUrl(os: 'ios' | 'android'): string {
  // Android emulator reaches the host machine via 10.0.2.2.
  const host = os === 'android' ? '10.0.2.2' : 'localhost';
  return `${SCHEME}://${host}:${PORT}${PATH}`;
}

export const WEB_APP_URL: string = resolveWebAppUrl(
  Platform.OS as 'ios' | 'android',
);
