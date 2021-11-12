import { createApp } from 'vue'
import App from './App.vue';

import {IonicVue} from '@ionic/vue';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';

createApp(App)
  .use(IonicVue)
  .mount('#app')
