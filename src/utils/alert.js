import Vue from "vue";

const _alert = {
  error(err, title = null, text = null) {
    return Vue.swal({
      position: "center",
      icon: "error",
      title: title || "Error",
      text: text
        ? text
        : err.response
        ? err.response.data.message
        : err.data.message,
      toast: false,
      timer: 3000,
      showConfirmButton: false,
    });
  },
  success(
    title = null,
    text = null,
    position = "top-right",
    showConfirmButton = false,
    timer = 3000
  ) {
    return Vue.swal({
      position: position,
      icon: "success",
      title: title || text,
      // text: text,
      toast: position === "top-right",
      timer: timer,
      showConfirmButton: showConfirmButton,
    });
  },
  confirm(
    title = null,
    text = null,
    agree = null,
    disagree = null,
    deletePrompt = false
  ) {
    return Vue.swal({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: deletePrompt ? "#ff0000" : "#492C9E",
      cancelButtonColor: "#868e96",
      confirmButtonText: agree || "Ya, Lanjutkan",
      cancelButtonText: disagree || "Batalkan",
    });
  },
};

export default _alert;
