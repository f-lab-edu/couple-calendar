module.exports = {
  preset: 'react-native',
  // These packages ship untranspiled TS/TSX via their "react-native" entry
  // field, so jest must transform them instead of ignoring node_modules.
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|@react-native-community|@react-navigation|react-native-instant-webview|react-native-webview|react-native-safe-area-context)/)',
  ],
};
