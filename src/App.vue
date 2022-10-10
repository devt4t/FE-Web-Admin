<template>
  <v-app id="Trees">
    <v-navigation-drawer :width="230" v-if="isLogin" v-model="drawer" dark app class="rounded-xl">
      <v-list-item>
        <v-list-item-content class="text-center">
          <v-list-item-title
            style="color: #71AF34; font-weight: 550; font-size: 125%"
            class="fontall"
          >
            GEKo
          </v-list-item-title>
          <v-list-item-subtitle style="color: #fff"
            >Green Earth Kontrol</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>

      <v-divider style="background-color: white !important"></v-divider>

      <v-list color="transparent" shaped>
        <v-list-item color="#00FFFF" :to="DashboardLink" link>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
          color="#00FFFF"
          class="fontall"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                class="itemparent"
                v-text="item.title"
              ></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            :to="child.to"
            link
          >
            <v-list-item-content>
              <v-list-item-title
                class="itemchild"
                v-text="child.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>

      <h5
        class="fontall footernav"
        style="color: #71AF34; font-weight: 550; font-size: 80%"
      >
        © Dev Trees4Trees
      </h5>
    </v-navigation-drawer>

    <v-app-bar class="mx-2 mt-2 rounded-xl" v-if="isLogin" app>
      <v-app-bar-nav-icon
        style="color: black"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title
        style="color: black; font-weight: bold"
        class="pl-1 fontall"
      >
        <a href="/" style="text-decoration: none; color: black">
          Trees4trees
        </a>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y open-on-hover>
        <template v-slot:activator="{ on }">
          <v-btn class="px-1 mr-1" text color="black" size="200" v-on="on">
            <div style="text-align: right" class="mr-2">
              <p style="font-weight: bold" class="font-weight-bolder mb-0">
                {{ nameadmin }}
              </p>
              <span class="d-none d-md-block" style="font-size: 9px">{{
                statusadmin
              }}</span>
              <!-- <span style="font-size: 9px">{{ statusadmin }}</span> -->
            </div>
            <v-avatar size="35">
              <v-icon x-large color="black">mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list rounded style="overflow-y: hidden !important">
          <v-list-item
            v-for="(item, index) in itemsprofile"
            :key="index"
            @click="selectSection(item)"
            color="primary"
          >
            <v-list-item-title
              ><v-icon small color="black">{{ item.icon }}</v-icon>
              {{ item.title }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main style="background-color: white" color="white lighten-1">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    drawer: null,
    nameadmin: "admin web",
    statusadmin: "admin web",
    DashboardLink: "/Dashboard",
    itemsprofile: [{ title: "Ganti Password" }, { title: "Logout" }],
    User: [],
    items: [],
    elevations: [6, 12, 18],
    BaseUrlGet: "",
    authtoken: "",
    listValMenu: [],
    logoutvalue: false,
  }),
  computed: {
    isLogin() {
      var itemroutecheck;
      // this.listValMenu;
      itemroutecheck = ["Home", "Dashboard", "Users", "GantiPassword"];

      if (this.listValMenu) {
        if (this.listValMenu.length > 0) {
          itemroutecheck = this.listValMenu;
          itemroutecheck.push('Dashboard')
        }

        var rslt = itemroutecheck.includes(this.$route.name);
        // console.log(this.$route.name);
        // console.log(itemroutecheck);
        if (rslt == true) {
          // console.log("comp=" + localStorage.getItem("token"));
          this.authtoken = localStorage.getItem("token");
          var authtokenval = this.authtoken;
          if (authtokenval != null) {
            var notspaceauthtoken = authtokenval.trim();
            // console.log(notspaceauthtoken.length);
            // console.log(this.authtoken);
            if (notspaceauthtoken.length > 0) {
              return this.$route.name != "Login";
            } else {
              console.log("auth 0");
              this.$router.push("/");
            }
          } else {
            console.log("auth null");
            this.$router.push("/");
          }
        } else {
          console.log("route false");
          this.authtoken = localStorage.getItem("token");
          var authtokenval = this.authtoken;
          if (authtokenval != null) {
            var notspaceauthtoken = authtokenval.trim();
            if (notspaceauthtoken.length > 0) {
              this.$router.push("/Dashboard");
              return this.$route.name != "Login";
            } else {
              console.log("auth 0");
              this.$router.push("/");
            }
          } else {
            console.log("auth null");
            console.log("logout system");
            if (this.logoutvalue == true) {
              this.logoutvalue = false;
              location.reload();
            } else if (this.$route.name == "Login") {
              console.log("page " + this.$route.name);
            } else {
              this.$router.push("/");
            }
          }
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("User");
        localStorage.removeItem("BaseUrlUpload");
        this.$router.push("/");
      }
    },
  },
  created() {
    this.authtoken = localStorage.getItem("token");
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.User = JSON.parse(localStorage.getItem("User"));
    if (this.User) {
      this.items = this.User.list_menu;
      this.items.forEach((valMenu, indexMenu) => {
        // rearrange activities list menu
        if (valMenu.title == 'Activities') {
          let activitiesRearrange = []
          valMenu.items.forEach((valMenuItem, indexMenuItem) => {
            if (activitiesRearrange.includes(valMenuItem) == false) {
              if (valMenuItem.title === 'Progression') {
                activitiesRearrange[0] = valMenuItem
              } else if (valMenuItem.title === 'Sosialisasi Tanam') {
                activitiesRearrange[1] = valMenuItem
              } else if (valMenuItem.title === 'Pelatihan Petani') { 
                activitiesRearrange[2] = valMenuItem
              } else if (valMenuItem.title === 'Lubang Tanam') { 
                activitiesRearrange[3] = valMenuItem
              } else if (valMenuItem.title === 'Realisasi Tanam') { 
                activitiesRearrange[4] = valMenuItem
              } else if (valMenuItem.title === 'Monitoring 2') { 
                activitiesRearrange[5] = valMenuItem
              }
            }
          })
          this.items[indexMenu].items = activitiesRearrange.filter(Object);
        }
      })
      this.listValMenu = this.User.list_val_menu;
      var name = this.User.name;
      const arrayname = name.split(" ");
      this.nameadmin = arrayname[0];
      // this.nameadmin = this.User.name;
      this.statusadmin = this.User.role_name;
    }
  },
  methods: {
    async cekLogout() {
      const datapost = {};
      // console.log(this.BaseUrlGet);
      // console.log(this.authtoken);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "Logout",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.status.code);
        if (response.data.data.status.code == 200) {
          localStorage.removeItem("token");
          localStorage.removeItem("User");
          localStorage.removeItem("BaseUrlUpload");
          this.$router.push("/");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("User");
          localStorage.removeItem("BaseUrlUpload");
          this.$router.push("/");
        }
      } catch (error) {
        // console.error(error.response);
        localStorage.removeItem("token");
        localStorage.removeItem("User");
        localStorage.removeItem("BaseUrlUpload");
        this.$router.push("/");
      }
    },

    logout() {
      // console.log("test");
      this.cekLogout();
    },

    selectSection(item) {
      switch (item.title) {
        case "Ganti Password":
          console.log("Ganti Password");
          this.$router.push("/GantiPassword");
          break;
        case "Logout":
          console.log("Logout");
          this.logout();
      }
    },
  },
};
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
