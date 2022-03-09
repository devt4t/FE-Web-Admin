<template>
  <v-app id="Trees">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Admin </v-list-item-title>
          <v-list-item-subtitle> System Management </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list color="transparent">
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            :to="child.to"
            link
          >
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Trees4Trees</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="logout()" text>
        Logout
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="grey lighten-1 pa-5">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      {
        icon: "mdi-account-group",
        items: [{ title: "Field Facilitator", to: "/Home" }],
        title: "Employee",
      },
      {
        icon: "mdi-database",
        active: false,
        items: [
          { title: "Farmer", to: "/Farmer" },
          { title: "Lahan", to: "/Lahan" },
          { title: "Trees", to: "/Trees" },
          { title: "Activity", to: "/Activity" },
        ],
        title: "Main Data",
      },
      {
        icon: "mdi-cogs",
        active: false,
        items: [
          { title: "Provinsi", to: "/Provinsi" },
          { title: "Kab/Kota", to: "/Kabupaten" },
          { title: "Kecamatan", to: "/Kecamatan" },
          { title: "Vilage", to: "/Vilage" },
          { title: "Management Unit", to: "/ManagementUnit" },
          { title: "Target Area", to: "/TargetArea" },
        ],
        title: "Utilities",
      },
      {
        icon: "mdi-account",
        items: [{ title: "Users", to: "/Users" }],
        title: "Users",
      },
    ],
    elevations: [6, 12, 18],
    BaseUrlGet: "",
  }),
  methods: {
    async cekLogout() {
      console.log(this.BaseUrlGet);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(this.BaseUrlGet + "Logout", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        console.log(response.data.data.status.code);
        if (response.data.data.status.code == 200) {
          localStorage.removeItem("token");
          localStorage.removeItem("BaseUrlGet");
          this.$router.push("/");
        } else {
        }
      } catch (error) {
        console.error(error.response);
      }
    },

    logout() {
      console.log("test");
      this.cekLogout();
    },
  },
};
</script>
