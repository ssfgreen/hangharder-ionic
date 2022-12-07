import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hangharder.app',
  appName: 'hangharder',
  bundledWebRuntime: false,
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  },
  cordova: {},
  server: {
    url: 'http://192.168.1.176:3000'
  }
};

export default config;
