import { createStore } from "vuex";
import { createApp } from "vue";
import App from "./App.vue";
import storeModule from "./store/index";
import router from "./router";
import servicesPlugins from "./plugins";
import VueSignaturePad from "vue-signature-pad";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { IonicVue } from "@ionic/vue";
import StepProgress from "vue-step-progress";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import VueObserveVisibility from 'vue-observe-visibility'
import "@ionic/core/css/ionic.bundle.css";
import i18n from './i18n'
// inject vue barcode scanner
library.add(fas);
const store = createStore({ ...storeModule });
createApp(App).use(i18n)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("step", StepProgress)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(VueObserveVisibility)
  .use(servicesPlugins)
  .use(VueSignaturePad)
  .use(defineCustomElements)
  .use(StepProgress)
  .mount("#app");
