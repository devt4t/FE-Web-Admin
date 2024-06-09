import axios from "axios";
import _alert from "./alert";
import _util from "./";
import _config from "./config";
import router from "../router/index";
const env = axios.create({
  baseURL: _config.baseUrl,
});
env.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token") || null;
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

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
    console.log(error.response.data);
    if (error.response.status === 401) {
      _alert.error(null, "Sesi Kadaluarsa", "Silahkan login kembali");
      localStorage.clear();

      router.push({ name: "login" });
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.data &&
      error.response.data.data.result === "doesnt match data"
    ) {
      return;
    } else if (error.response.status === 422 || error.response.status === 400) {
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

  upload(endPoint, file) {
    const data = this.generateFormData(file);

    return axios
      .post(`${_config.baseUrlUpload}/${endPoint}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return `${response.data.data.new_name}`;
      })
      .catch((err) => {
        throw err.response;
      });
  },

  generateFormData(data) {
    let formData = new FormData();

    const objectArray = Object.entries(data);

    objectArray.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.map((item) => {
          formData.append(key + "[]", item);
        });
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  },
};

export default _service;
