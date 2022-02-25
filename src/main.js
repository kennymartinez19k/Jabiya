import { createStore } from "vuex";
import { createApp } from "vue";
import App from "./App.vue";
import storeModule from "./store/index";
import router from "./router";
import servicesPlugins from "./plugins";
import VueSignaturePad from "vue-signature-pad";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faSignOutAlt, faArrowLeft, faHome, faArrowRight, faMapMarkerAlt, faBan, faCheckCircle, faEnvelope, faEye , faEyeSlash, faMinus, faPlus, faRedoAlt, faTimes, faImages  } from "@fortawesome/free-solid-svg-icons";
import { IonicVue } from "@ionic/vue";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import VueObserveVisibility from 'vue-observe-visibility'
import "@ionic/core/css/ionic.bundle.css";
import { urlEnum } from './types'


library.add(faCheck);
library.add(faSignOutAlt);
library.add(faArrowLeft);
library.add(faMapMarkerAlt);
library.add(faBan);
library.add(faCheckCircle);
library.add(faEnvelope);
library.add(faEye);
library.add(faEyeSlash);
library.add(faMinus, faPlus)
library.add(faArrowRight)
library.add(faHome)
library.add(faRedoAlt)
library.add(faTimes)
library.add(faImages)

if(!(JSON.parse(localStorage.getItem('setting')))){
  let setting = {
    maps: false,
    url: urlEnum.production
  }
  localStorage.setItem('setting', JSON.stringify(setting))
}

const store = createStore({ ...storeModule });
createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(VueObserveVisibility)
  .use(servicesPlugins)
  .use(VueSignaturePad)
  .use(defineCustomElements)
  .mount("#app");

  defineCustomElements(window)