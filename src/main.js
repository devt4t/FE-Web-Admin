import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { BootstrapVue } from "bootstrap-vue";
import VueGoogleCharts from "vue-google-charts";
import VueEasyLightbox from "vue-easy-lightbox";
import VueNumber from "vue-number-animation";
import AOS from "aos";
import "aos/dist/aos.css";
import Vue2Editor from "vue2-editor";
import { mdiAccount } from "@mdi/js";
import "./utils/index";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./assets/scss/global.scss";

import service from "@/utils/service.js";
import alert from "@/utils/alert.js";
import filter from "@/utils/filter.js";

import "@/utils/validation.js";
import GekoBaseCrud from "@/components/GekoBaseCrud";
import GekoInput from "@/components/GekoInput";
import { ValidationProvider, ValidationObserver } from "vee-validate";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  ShadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

AOS.init({
  duration: 1000,
});
Vue.use(VueGoogleCharts);

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

Vue.use(VueEasyLightbox);
Vue.use(VueNumber);
Vue.use(Vue2Editor);
Vue.use(mdiAccount);

//global function
Vue.prototype.$_alert = alert;
Vue.prototype.$_api = service;

//global component

Vue.component("geko-base-crud", GekoBaseCrud);
Vue.component("geko-input", GekoInput);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
new Vue({
  router,
  store,
  vuetify,

  filter: {
    filter,
  },
  render: (h) => h(App),
}).$mount("#app");
