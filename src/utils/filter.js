import moment from "moment";
import Vue from "vue";

moment.locale("id");

Vue.filter("parse", (value, id) => {
  let _value = "";
  switch (id) {
    case "no-empty":
      _value = [null, undefined, ""].includes(value) ? "-" : value;
      break;
    case "date":
      _value = moment(value).format("D MMMM YYYY");
      break;

    case "datetime":
      _value = moment(value).format("D MMMM YYY HH:mm:ss");
      break;

    default:
      _value = value;
      break;
  }

  return _value;
});
