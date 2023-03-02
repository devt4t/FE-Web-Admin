<template>
  <v-app id="Trees">
    <!-- Sidebar -->
    <v-navigation-drawer :width="'auto'" v-if="isLogin" v-model="drawer" :dark="$store.state.theme == 'dark'" app :class="`custom-sidebar ${$store.state.theme == 'dark' ? 'dark-bg-gradient' : 'light-bg-gradient'} rounded-xl ml-2 mt-2 elevation-5`" style="height: auto;max-height: 97.5vh;">
      <template v-slot:prepend>
        <v-list-item>
          <v-list-item-content class="text-center">
            <v-list-item-title
              style="font-weight: 550; font-size: 125%"
              class="fontall green--text--theme"
            >
              GEKO
            </v-list-item-title>
            <v-list-item-subtitle
              >Green Earth Kontrol</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-list color="transparent" rounded >
        <v-list-item color="#71AF34" :to="DashboardLink" link 
          :ripple="false">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item disabled 
          :ripple="false">
          <v-list-item-icon>
            <v-icon color="grey">mdi-comment-question</v-icon>
          </v-list-item-icon>

          <v-list-item-title>
            <v-badge content="Dev">
              FAQ
            </v-badge>
          </v-list-item-title>
        </v-list-item> -->
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
          color="#71AF34"
          class="fontall"
          :ripple="false"
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
            dense
            :ripple="false"
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

      <template v-slot:append>
        <div class="text-center pa-2">
          <v-btn :color="`${$store.state.theme == 'light' ? 'orange white--text' : 'orange--text white'} darken-2`" fab x-small class="mr-1" @click="$store.state.theme = 'light'">
            <v-icon>mdi-weather-sunny</v-icon>
          </v-btn>
          <v-btn color="red white--text" fab small class="" @click="logout()">
            <v-icon>mdi-power</v-icon>
          </v-btn>
          <v-btn :color="`${$store.state.theme == 'dark' ? 'blue' : 'blue--text'} darken-2`" fab x-small class="ml-1" @click="$store.state.theme = 'dark'">
            <v-icon>mdi-weather-night</v-icon>
          </v-btn>
        </div>
      </template>
      <!-- <h5
        class="text-center pb-2"
        style="color: #71AF34; font-weight: 550; font-size: 80%"
      >
        © Dev Trees4Trees
      </h5> -->
    </v-navigation-drawer>

    <!-- TopBar -->
    <v-app-bar :class="`${$store.state.theme == 'dark' ? 'dark-bg-gradient' : 'light-bg-gradient'} mx-2 ml-2 ml-lg-5 mt-2 rounded-pill`" :dark="$store.state.theme == 'dark'" v-if="isLogin" app>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        
      ></v-app-bar-nav-icon>

      <v-toolbar-title
        class="pl-1 fontall"
      >
        <a href="/" style="text-decoration: none;" :class="'green--text--theme'">
          Trees4Trees
        </a>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        {{ isFullScreen ? 'Close' : 'Go' }} FullScreen {{ isFullScreen ? '(esc)' : '' }}
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon color="gray darken-1" @click="toggleFullScreen">
            <v-icon v-if="isFullScreen">mdi-arrow-collapse-all</v-icon>
            <v-icon v-else>mdi-arrow-expand-all</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-menu offset-y rounded="xl">
        <template v-slot:activator="{ on }">
          <v-btn class="px-1 mr-1" text size="200" v-on="on" rounded>
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
              <v-icon x-large>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list rounded style="overflow: hidden !important">
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

    <!-- footer -->
    <v-app-bar v-if="isLogin" :class="`${$store.state.theme == 'dark' ? 'dark-bg-gradient' : 'light-bg-gradient'} mx-5 mr-3 mb-2 rounded-xl`" app dense bottom absolute :dark="$store.state.theme == 'dark'" >
      <v-col
        :class="`text-center green--text ${$store.state.theme == 'dark' ? 'text--lighten-4' : 'text--darken-1'}`"
        cols="12"
      >
        GEKOWeb v{{ $store.state.packageVersion }} © Trees4Trees
      </v-col>
    </v-app-bar>

    <!-- Main Content -->
    <v-main :class="`gradient-animate ${$store.state.theme}`">
      <div class="waves" v-if="$route.name !== 'Distribusi' || $store.state.User.role_name == 'FIELD COORDINATOR'">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      <router-view class="pb-4 pl-0 pl-lg-3" style="z-index: 1;position: relative"></router-view>
    </v-main>
    
    <!-- loading overlay -->
    <v-overlay :value="$store.state.loadingOverlay">
      <div class="d-flex flex-column align-center justify-center">
        <v-progress-circular
            indeterminate
            color="white"
            size="64"
            data-aos="zoom-in"
            data-aos-duration="1000"
        ></v-progress-circular>
        <p class="mt-2 mb-0" data-aos="zoom-in" data-aos-delay="200" data-aos-duration="800" v-if="$store.state.loadingOverlayText" v-html="$store.state.loadingOverlayText"></p>
      </div>
    </v-overlay>
    
    <!-- Maintenance Overlay -->
    <v-overlay :value="$store.state.maintenanceOverlay">
      <div class="d-flex flex-column align-center position-relative">
        <img class="rounded-xl" style="max-width: 100%;width: 550px;" :src="require('@/assets/maintenance.gif')" alt="" data-aos="zoom-in">
        <h4 class="white--text mt-3 position-absolute" style="position: absolute;bottom: 40px;" data-aos="zoom-in" data-aos-delay="200">GEKO Maintenance...
          <v-progress-circular
              indeterminate
              color="white"
              size="16"
          ></v-progress-circular>
        </h4>
      </div>
    </v-overlay>

    <!-- lightbox ~ image preview -->
    <vue-easy-lightbox
      :visible="$store.state.lightbox.show"
      :imgs="$store.state.lightbox.imgs"
      :index="$store.state.lightbox.index"
      @hide="() => { $store.state.lightbox.show = false; }"
    ></vue-easy-lightbox>
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
    isFullScreen: false
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
        var exceptionPage = ['SeedlingChangeRequest']
        const checkExceptionPage = exceptionPage.includes(this.$route.name)
        // console.log(this.$route.name);
        // console.log(itemroutecheck);
        if (rslt == true || checkExceptionPage) {
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
              } else if (valMenuItem.title === 'Material Organik') { 
                activitiesRearrange[4] = valMenuItem
              } else if (valMenuItem.title === 'Distribusi') { 
                activitiesRearrange[5] = valMenuItem
              } else if (valMenuItem.title === 'Realisasi Tanam') { 
                activitiesRearrange[6] = valMenuItem
              } else if (valMenuItem.title === 'Monitoring 2') { 
                activitiesRearrange[7] = valMenuItem
              }
            }
          })
          this.items[indexMenu].items = activitiesRearrange.filter(Object);
        }
      })
      this.listValMenu = this.User.list_val_menu;
      var name = this.User.name;
      const arrayname = name.split(" ");
      this.nameadmin = name;
      // this.nameadmin = this.User.name;
      this.statusadmin = this.User.role_name;
    }
  },
  mounted() {
  },
  watch: {
    'document.fullscreenElement': {
      handler(newVal) {
        console.log(newVal)
      }
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
    toggleFullScreen() {
      var elem = document.documentElement
      if (this.isFullScreen == false) {
        this.openFullscreen(elem)
      } else {
        this.closeFullscreen()
      }
    },
    /* View in fullscreen */
    openFullscreen(elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
      this.isFullScreen = true
    },
    /* Close fullscreen */
    closeFullscreen() {
      if (this.isFullScreen && document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
        }
      }
      this.isFullScreen = false
    }
  },
};
</script>
