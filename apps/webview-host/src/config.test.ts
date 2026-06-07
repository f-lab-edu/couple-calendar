import { Platform } from 'react-native';

import { resolveWebAppUrl, WEB_APP_URL } from './config';

describe('resolveWebAppUrl', () => {
  it('returns localhost:3000 for ios', () => {
    expect(resolveWebAppUrl('ios')).toBe('http://localhost:3000');
  });

  it('returns 10.0.2.2:3000 for android', () => {
    expect(resolveWebAppUrl('android')).toBe('http://10.0.2.2:3000');
  });
});

describe('WEB_APP_URL', () => {
  it('matches resolveWebAppUrl for the current platform', () => {
    expect(WEB_APP_URL).toBe(
      resolveWebAppUrl(Platform.OS as 'ios' | 'android'),
    );
  });
});
