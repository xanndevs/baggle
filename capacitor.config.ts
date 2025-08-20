import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.xann.baggle',
  appName: 'baggle',
  webDir: 'build',
  plugins: {
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true
    },
    StatusBar: {
      overlaysWebView: false,
    }
  }
};

export default config;
