import { resolveWebAppUrl, SCHEME, WEB_APP_URL } from './config';

describe('resolveWebAppUrl', () => {
  it('returns the localhost /home url for ios', () => {
    expect(resolveWebAppUrl('ios')).toBe(`${SCHEME}://localhost:3000/home`);
  });

  it('returns the 10.0.2.2 /home url for android', () => {
    expect(resolveWebAppUrl('android')).toBe(`${SCHEME}://10.0.2.2:3000/home`);
  });
});

describe('WEB_APP_URL', () => {
  // The jest react-native preset reports Platform.OS as 'ios'.
  it('resolves to the ios url under the test runtime', () => {
    expect(WEB_APP_URL).toBe(`${SCHEME}://localhost:3000/home`);
  });
});
