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
      _value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      break;
    case "no-empty":
      _value = [null, undefined, ""].includes(value) ? "-" : value;
      break;
    case "date":
      _value = moment(value).format("D MMMM YYYY");
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
      _value = value === 0 ? "Tidak Terverifikasi" : "Terverifikasi";
      break;
    case "active":
      _value = value == 0 ? "Tidak Aktif" : "Aktif";
      break;

    case "datetime":
      _value = moment(value).format("D MMMM YYY HH:mm:ss");
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

    default:
      _value = value;
      break;
  }

  return _value;
});
