import axios from "axios";
import _alert from "./alert";
const env = axios.create({
  baseURL: "https://t4tapi.kolaborasikproject.com/api/",
});
env.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token") || null;
    config.headers["Content-Type"] = "application/json";

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

env.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status === 401) {
      // localStorage.clear();

      // router.push({ name: "login" });
      _alert.error(null, "Sesi Kadaluarsa", "Silahkan login kembali");
    } else if (error.response.status === 422 || error.response.status === 400) {
      console.log("err", error.response);
      _alert.error(error.response);
    } else if (error.response.status === 500) {
      _alert.error({}, "Error", "Terjadi kesalahan system");
    } else if (error.response.status === 404) {
      _alert.error(
        {},
        "Error",
        "Route tidak ditemukan, silahkan hubungi IT Support"
      );
    }
    return Promise.reject(error);
  }
);

const _service = {
  post(endPoint, data) {
    return env
      .post(`${endPoint}`, data)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.response;
      });
  },
  get(endPoint, param) {
    console.log("SERVICE GET CALLED");
    if (param && param.filters) {
      Object.assign(param, param.filters);
      delete param.filters;
    }
    if (param && param.page && param.limit) {
      param.offset = param.page > 1 ? (param.page - 1) * param.limit : 0;
    }
    return env
      .get(`${endPoint}`, { params: param })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log("err", err);
        throw err.response;
      });
  },
};

export default _service;
