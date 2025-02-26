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
      _value = value ? moment(value).format("D MMMM YYYY"): '-';
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
    case "active-status":
      if (value == 0) {
        _value = "Non-Aktif";
      } else if (value === 1) {
        _value = "Aktif";
      } else if (value === "0") {
        _value = "Non-Aktif";
      } else if (value === "1") {
        _value = "Aktif";
      }
      break;

    case "simple-status":
      if (value == 0) {
        _value = "Belum Terverifikasi";
      } else if (value === 1) {
        _value = "Terverifikasi";
      }
      break;
    case "general-land-planting-hole-status":
      if (value == 0) {
        _value = "Silahkan Verifikasi Lahan Terlebih Dahulu";
      }else if (value === 1) {
        _value = "Belum Terverifikasi";
      }else if (value === 2) {
        _value = "Terverifikasi";
      }
      break;


    case "distribution-status-bast":
      if (value == 0) {
        _value = "Belum Cek BAST";
      } else if (value === 1) {
        _value = "Bibit Kurang";
      } else if (value === 2) {
        _value = "Bibit Lebih";
      } else if (value === 3) {
        _value = "Bibit Lengkap";
      }
      break;

    case "adjustment-status":
      if (value == 'non-adjustment') {
        _value = "Non Adjustment";
      } else if (value === 'adjustment') {
        _value = "Adjustmenr";
      }
      break;
    case "status-population":
      if (value == 0) {
        _value = "Belum / Tidak Terpopulasi";
      } else if (value === 1) {
        _value = "Terpopulasi";
      }
      break;
    case "capitalize":
      _value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      break;
    case "general-land-penlub-status":
      if (value == 0) {
        _value = "Belum Terdaftar";
      } else if (value > 0) {
        _value = "Terdaftar";
      }
      break;
    case "status-acceptance":
      _value = value === 0 ? "Belum Diterima" : "Sudah Diterima";
      break;
    case "status-allocation":
      _value = value === 0 ? "Belum Dialokasi" : "Sudah Dialokasi";
      break;
    default:
      _value = value;
      break;
  }


  return _value;
});
