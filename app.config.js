export default {
  name: 'penguin-mobile-autopass',
  slug: 'penguin-mobile-autopass',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'penguin-mobile-autopass',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.pederseo.penguinmobileautopass'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.pederseo.penguinmobileautopass'
  },
  web: {
    favicon: './assets/images/icon.png'
  },
  plugins: [
    'expo-router'
  ],
  experiments: {
    newArchEnabled: true
  }
} 