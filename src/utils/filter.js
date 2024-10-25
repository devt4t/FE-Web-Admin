import moment from "moment";
import Vue from "vue";

moment.locale("id");

Vue.filter("parse", (value, id) => {
  let _value = "";
  switch (id) {
    case "ts":
      if (!value) {
        _value = value;
        break;
      }

      const parts = value.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      _value = parts.join(",");

      break;
    case "no-empty":
      _value = [null, undefined, ""].includes(value) ? "-" : value;
      break;
    case "no-null":
      _value = [null, undefined, ""].includes(value) ? "0" : value;
      break;
    case "date":
      _value = moment(value).format("D MMMM YYYY");
      break;
    case "gender":
      _value =
        value === "male" ? "Laki-Laki" : value === "female" ? "Perempuan" : "-";
      break;

    case "status-scooping-visit":
      _value =
        value === "document_saving"
          ? "Pending"
          : value === "ready_to_submit"
          ? "GIS Review"
          : value === "submit_review"
          ? "Terverifikasi"
          : "Tidak Ada Status";
      break;

    case "status-potential":
      _value = value === 0 ? "Tidak Potensial" : "Potensial";
      break;

    case "status-verification":
      _value = value === 0 ? "Belum Diverifikasi" : "Terverifikasi";
      break;
    case "active":
      _value = value == 0 ? "Tidak Aktif" : "Aktif";
      break;

    case "datetime":
      _value = moment(value).format("D MMMM YYYY HH:mm:ss");
      break;

    case "border":
      if (value == "north") {
        _value = "Utara";
      } else if (value === "east") {
        _value = "Timur";
      } else if (value === "west") {
        _value = "Barat";
      } else if (value === "south") {
        _value = "Selatan";
      }
      break;

    case "idr":
      if (!["number", "string"].includes(typeof value)) _value = value;
      _value = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      })
        .format(value)
        .replace(/,/g, ".");
      break;

    case "lowercase":
      if (!value) _value = value;
      _value = value.toLowerCase();
    
    case "potential-vilage":
      if (value == 0) {
        _value = "Tidak Potensial";
      } else if (value === 1) {
        _value = "Belum Pengecekan";
      } else if (value === 2) {
        _value = "Potensial Carbon";
      } else if (value === 3) {
        _value = "Potensial Non-Carbon";
      } else if (value === 4) {
        _value = "Potensial Carbon & Non-Carbon";
      }
      break;

    default:
      _value = value;
      break;
  }


  return _value;
});
