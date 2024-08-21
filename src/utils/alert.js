import Swal from "sweetalert2";

const _alert = {
  error(err, title = null, text = null) {
    let _text = "";
    try {
      _text = text ? text : err.data ? err.data.data.result : err.data.result;
    } catch {
      _text = "";
    }

    if (typeof err === "string" && !title) _text = err;
    return Swal.fire({
      title: title,
      icon: "error",
      text: _text,
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
    timer = 3000,
    html = false
  ) {
    return Swal.fire({
      position: position,
      icon: "success",
      title: title || text,
      text: position !== "top-right" && text && !html ? text : "",
      html: html && text ? text : "",
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
    return Swal.fire({
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
  loading(title, text) {
    Swal.fire({
      title: title,
      html: text,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      position: "top-right",
      toast: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },
};

export default _alert;
