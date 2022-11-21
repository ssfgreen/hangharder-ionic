import { CapacitorConfig } from '@capacitor/cli';

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
  cordova: {}
};

export default config;
