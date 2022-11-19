import moment from 'moment/moment'
import Vue from 'vue'
import Vuex from 'vuex'
import { version } from '../../package.json'
import { Arjasari, Ciminyak, Kebumen, Pati } from './nurseryTeam/listEmail'
import TaskForceEmail from './taskForceTeam/listEmail'

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
    },
    taskForceTeam: {
      emails: TaskForceEmail
    },
    nurseryTeam: {
      emails: {
        Arjasari: Arjasari || [],
        Ciminyak: Ciminyak || [],
        Kebumen: Kebumen || [],
        Pati: Pati || []
      }
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
