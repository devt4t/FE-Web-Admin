import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { BootstrapVue } from 'bootstrap-vue'
import VueGoogleCharts from 'vue-google-charts'
import VueEasyLightbox from 'vue-easy-lightbox'
import VueNumber from 'vue-number-animation'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Vue2Editor from "vue2-editor";

import L from "leaflet";
import 'leaflet/dist/leaflet.css';
 

delete  L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
   iconRetinaUrl : require('leaflet/dist/images/marker-icon-2x.png'),
   iconUrl : require('leaflet/dist/images/marker-icon.png'),
   ShadowUrl : require('leaflet/dist/images/marker-shadow.png'),
})

AOS.init({
  duration: 1000
});
Vue.use(VueGoogleCharts)

Vue.config.productionTip = false
Vue.use(BootstrapVue)

Vue.use(VueEasyLightbox)
Vue.use(VueNumber)
Vue.use(Vue2Editor);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
