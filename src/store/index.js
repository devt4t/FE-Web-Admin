import moment from 'moment/moment'
import Vue from 'vue'
import Vuex from 'vuex'
import { version } from '../../package.json'
import JustLoadingLineModul from './scpecialEmails/JustLoadingLineModul'
import { Arjasari, Ciminyak, Kebumen, Pati } from './scpecialEmails/nurseryTeam'
import TaskForceEmail from './scpecialEmails/taskForceTeam'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiConfig: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    },
    apiUrl: localStorage.getItem('BaseUrlGet'),
    apiUrlImage: localStorage.getItem('BaseUrl'),
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
        Pati: Pati || [],
        JustLoadingLineModul: JustLoadingLineModul
      }
    },
    User: JSON.parse(localStorage.getItem('User')),
  },
  getters: {
    getApiUrl: (state) => (url) => {
      return state.apiUrl + url
    },
    getImageUrl: (state) => (url) => {
      return state.apiUrlImage + url
    },
    capitalizeFirstLetter: () => (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    numberFormat: () => (num) =>  {
        return new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 0
        }).format(num)
    },
    dateFormat: () => (date, format) => {
        return moment(date).format(format)
    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
