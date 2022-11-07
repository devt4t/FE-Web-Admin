import Vue from 'vue'
import Vuex from 'vuex'
import {version} from '../../package.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadingOverlay: false,
    loadingOverlayText: null,
    maintenanceOverlay: false,
    packageVersion: version || '0',
    theme: 'dark'
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
