import { createStore } from 'vuex'
import { createApp } from 'vue'
import App from './App.vue'
import storeModule  from './store/index'
import router from './router'
import servicesPlugins from './plugins'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import {IonicVue} from '@ionic/vue';
import StepProgress from 'vue-step-progress'

import '@ionic/core/css/ionic.bundle.css';
library.add(fas)
const store = createStore( {...storeModule})
createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon )
  .component('step', StepProgress)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(servicesPlugins)
  .use(StepProgress)
  .mount('#app')