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
import "./assets/scss/geko-theme.scss";
import "vue-select/dist/vue-select.css";

import service from "@/utils/service.js";
import alert from "@/utils/alert.js";
import filter from "@/utils/filter.js";
import config from "@/utils/config.js";
import global from "@/utils/global.js";

import "@/utils/validation.js";
import GekoBaseCrud from "@/components/GekoBaseCrud";
import GekoInput from "@/components/GekoInput";
import { extend, ValidationProvider, ValidationObserver } from "vee-validate";
import vSelect from "vue-select";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
delete L.Icon.Default.prototype._getIconUrl;

extend("phone", {
  validate: (value) => {
    return new RegExp(/^(\+62|62|0)8[1-9][0-9]{6,9}$/).test(value);
  },
});
extend("decimal", {
  validate: (value, { decimals = "*", separator = "." } = {}) => {
    if (value === null || value === undefined || value === "") {
      return {
        valid: false,
      };
    }
    if (Number(decimals) === 0) {
      return {
        valid: /^-?\d*$/.test(value),
      };
    }
    const regexPart = decimals === "*" ? "+" : `{1,${decimals}}`;
    const regex = new RegExp(
      `^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`
    );

    return {
      valid: regex.test(value),
    };
  },
  message: "The {_field_} field must contain only decimal values",
});
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
Vue.prototype.$_config = config;
Vue.prototype.$_sys = global;
//global component
Vue.component("geko-select", vSelect);

Vue.component("geko-base-crud", GekoBaseCrud);
Vue.component("geko-input", GekoInput);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("date-picker", DatePicker);
new Vue({
  router,
  store,
  vuetify,

  filter: {
    filter,
  },
  render: (h) => h(App),
}).$mount("#app");
