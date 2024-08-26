import _store from "../store/index";

const _global = {
  // isAllowed(permission) {
  //   if (!permission || !localStorage.getItem("User")) return false;
  //   if (permission == "template-allow-all") return true;

  //   const permissions = localStorage.getItem("permission")
  //     ? JSON.parse(localStorage.getItem("permission"))
  //     : _store.state.permission;

  //   if (!Array.isArray(permissions)) return false;
  //   if (permissions.includes(permission)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },

  //refactored
  // Refactored Vue.js 2 function

  isAllowed(permission) {
    if (!permission || !localStorage.getItem("User")) {
      return false;
    }

    if (permission === "template-allow-all") {
      return true;
    }

    const permissions = JSON.parse(
      localStorage.getItem("permission") ||
        JSON.stringify(_store.state.permission)
    );

    return Array.isArray(permissions) && permissions.includes(permission);
  },
};

export default _global;
