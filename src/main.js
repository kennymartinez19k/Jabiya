import { createStore } from 'vuex'
import { createApp } from 'vue'
import App from './App.vue'
import storeModule  from './store/index'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import {IonicVue} from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';
library.add(fas)
const store = createStore( {...storeModule})
createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon )
  .use(IonicVue)
  .use(router)
  .use(store)
  .mount('#app')