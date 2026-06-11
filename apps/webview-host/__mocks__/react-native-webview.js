// Manual mock for jest: the real WebView eagerly resolves the native
// RNCWebView TurboModule at import time, which is unavailable in the jest
// runtime. A plain View stand-in lets components that render a WebView mount.
const React = require('react');
const { View } = require('react-native');

const WebView = React.forwardRef((props, ref) =>
  React.createElement(View, { ...props, ref }),
);

module.exports = { WebView, default: WebView };
