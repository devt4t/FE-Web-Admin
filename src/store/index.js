import moment from 'moment/moment'
import Vue from 'vue'
import Vuex from 'vuex'
import {version} from '../../package.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lightbox: {
      imgs: '',
      index: 0,
      show: false,
    },
    loadingOverlay: false,
    loadingOverlayText: null,
    maintenanceOverlay: false,
    packageVersion: version || '0',
    theme: 'dark',
    programYear: {
      model: '2022',
      options: ['2021', '2022', '2023']
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
