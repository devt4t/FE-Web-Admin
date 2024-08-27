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

  statusLahan(item, project) {
    if (project === "carbon") {
      const config = {
        unverified:
          !item.fc_complete_data && item.updated_gis.toLowerCase() === "belum",
        "gis-verified": item.updated_gis.toLowerCase() === "sudah",
        "fc-verified": item.approve == 1,
        verified: item.approve == 2,
        "force-majeure": item.approve == 3,
      };

      return config;
    }
  },
};

export default _global;
