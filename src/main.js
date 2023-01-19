import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { BootstrapVue } from 'bootstrap-vue'
import VueGoogleCharts from 'vue-google-charts'
import VueEasyLightbox from 'vue-easy-lightbox'
import VueNumber from 'vue-number-animation'


import L from "leaflet";
import 'leaflet/dist/leaflet.css';
 

delete  L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
   iconRetinaUrl : require('leaflet/dist/images/marker-icon-2x.png'),
   iconUrl : require('leaflet/dist/images/marker-icon.png'),
   ShadowUrl : require('leaflet/dist/images/marker-shadow.png'),
})


Vue.use(VueGoogleCharts)

Vue.config.productionTip = false
Vue.use(BootstrapVue)

Vue.use(VueEasyLightbox)
Vue.use(VueNumber)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
