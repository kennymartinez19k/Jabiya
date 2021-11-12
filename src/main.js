import { createStore } from 'vuex'
import { createApp } from 'vue'
import App from './App.vue'
import storeModule  from './store/index'
import router from './router'
import {IonicVue} from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';

const store = createStore( {...storeModule})

createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store)
  .mount('#app')