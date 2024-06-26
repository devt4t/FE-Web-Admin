import moment from "moment/moment";
import Vue from "vue";
import Vuex from "vuex";
import { version, version_date_time } from "../../package.json";
import JustLoadingLineModul from "./scpecialEmails/JustLoadingLineModul";
import {
  Cirasea,
  Ciminyak,
  Soreang,
  Kebumen,
  Pati,
} from "./scpecialEmails/nurseryTeam";
import TaskForceEmail from "./scpecialEmails/taskForceTeam";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiConfig: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
    tmpProjectPurpose: localStorage.getItem("tmpProjectPurpose"),
    apiUrl: localStorage.getItem("BaseUrlGet"),
    apiUrlImage: localStorage.getItem("BaseUrl"),
    lightbox: {
      imgs: "",
      index: 0,
      show: false,
    },
    loadingOverlay: false,
    loadingOverlayText: null,
    maintenanceOverlay: false,
    packageVersion: version || "0",
    packageVersionDateTime: version_date_time || "0",
    theme: "light",
    programYear: {
      model: "2024",
      options: ["2020", "2021", "2022", "2023", "2024"],
    },
    taskForceTeam: {
      emails: TaskForceEmail,
    },
    maps: {
      accessToken:
        "pk.eyJ1IjoiYmlsbGlvbmFpcmUwMjkiLCJhIjoiY2p3a3V5Zms5MHdzaTN5bnhxenFvcHFiNiJ9.jrcibCk1tIIShgL_mh7ipA",
      mapStyle: "mapbox://styles/mapbox/satellite-streets-v12",
    },
    nurseryTeam: {
      emails: {
        Cirasea: Cirasea || [],
        Ciminyak: Ciminyak || [],
        Soreang: Soreang || [],
        Kebumen: Kebumen || [],
        Pati: Pati || [],
        JustLoadingLineModul: JustLoadingLineModul,
      },
    },
    User: localStorage.getItem("User")
      ? JSON.parse(localStorage.getItem("User"))
      : "",
  },
  getters: {
    getApiUrl: (state) => (url) => {
      return state.apiUrl + url;
    },
    getImageUrl: (state) => (url) => {
      return state.apiUrlImage + url;
    },
    capitalizeFirstLetter: () => (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    ktpRules: (state) => (val) => {
      const ktpRegex = /^[0-9]{16}$/;
      const check = ktpRegex.test(val);
      return check;
    },
    numberFormat: () => (num) => {
      return new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 0,
      }).format(num);
    },
    dateFormat: () => (date, format) => {
      return moment(date).format(format);
    },
  },
  mutations: {
    set(state, [variable, value, saveLS = false]) {
      Vue.set(state, variable, value);
      if (saveLS)
        localStorage.setItem(
          variable,
          typeof value == "string" ? value : JSON.stringify(value)
        );
    },
  },
  actions: {},
  modules: {},
});
