import { createStore } from "vuex";
import { createApp } from "vue";
import App from "./App.vue";
import storeModule from "./store/index";
import router from "./router";
import servicesPlugins from "./plugins";
import VueSignaturePad from "vue-signature-pad";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faSignOutAlt, faArrowLeft, faHome, faArrowRight, faMapMarkerAlt, faBan, faCheckCircle, faEnvelope, faEye , faEyeSlash, faMinus, faPlus  } from "@fortawesome/free-solid-svg-icons";
import { IonicVue } from "@ionic/vue";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import VueObserveVisibility from 'vue-observe-visibility'
import Offline from 'offline-js'
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
library.add(faMinus, faPlus)
library.add(faArrowRight)
library.add(faHome)



Offline.options = {
  // Should we check the connection status immediatly on page load.
  checkOnLoad: true,

  // Should we monitor AJAX requests to help decide if we have a connection.
  interceptRequests: true,

  // Should we automatically retest periodically when the connection is down (set to false to disable).
  reconnect: {
    // How many seconds should we wait before rechecking.
    initialDelay: 3,

    // How long should we wait between retries.
    // delay: (1.5 * last delay, capped at 1 hour)
  },

  // Should we store and attempt to remake requests which fail while the connection is down.
  requests: true,

  // Should we show a snake game while the connection is down to keep the user entertained?
  // It's not included in the normal build, you should bring in js/snake.js in addition to
  // offline.min.js.
  game: false
}

const store = createStore({ ...storeModule });
createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(Offline)
  .use(VueObserveVisibility)
  .use(servicesPlugins)
  .use(VueSignaturePad)
  .use(defineCustomElements)
  .mount("#app");
