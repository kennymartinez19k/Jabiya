import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jabiya.app',
  appName: 'Jabiya',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    allowNavigation: [
      "http://preprod.flai.com.do:8756"
    ]
  }
};

export default config;
