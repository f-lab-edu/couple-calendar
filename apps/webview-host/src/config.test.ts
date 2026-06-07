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
  // The jest react-native preset reports Platform.OS as 'ios'.
  it('resolves to the ios url under the test runtime', () => {
    expect(WEB_APP_URL).toBe('http://localhost:3000');
  });
});
