import { createStore } from "vuex";
import { createApp } from "vue";
import App from "./App.vue";
import storeModule from "./store/index";
import router from "./router";
import servicesPlugins from "./plugins";
import VueSignaturePad from "vue-signature-pad";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faSignOutAlt, faArrowLeft, faArrowRight, faMapMarkerAlt, faBan, faCheckCircle, faEnvelope, faEye , faEyeSlash  } from "@fortawesome/free-solid-svg-icons";
import { IonicVue } from "@ionic/vue";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import "@ionic/core/css/ionic.bundle.css";

library.add(faCheck);
library.add(faSignOutAlt);
library.add(faArrowLeft);
library.add(faMapMarkerAlt);
library.add(faBan);
library.add(faCheckCircle);
library.add(faEnvelope);
library.add(faEye);
library.add(faEyeSlash);
library.add(faArrowRight)
const store = createStore({ ...storeModule });
createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(servicesPlugins)
  .use(VueSignaturePad)
  .use(defineCustomElements)
  .mount("#app");
