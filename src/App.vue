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
        <v-list-item color="#71AF34" :to="'/report-data'" link 
          :ripple="false"
          v-if="$store.state.User.role_group == 'IT' || $store.state.User.role_name == 'GIS STAFF'"
        >
          <v-list-item-icon>
            <v-icon>mdi-table-arrow-right</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Report Data</v-list-item-title>
        </v-list-item>
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
      <svg class="wave" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"
        v-if="$route.name !== 'Distribusi' || $store.state.User.role_name == 'FIELD COORDINATOR'">
        <defs>
          <linearGradient id="bg">
            <stop offset="0%" style="stop-color:rgba(255, 255, 255, 0.06)"></stop>
            <stop offset="50%" style="stop-color:rgba(255, 255, 255, 0.4)"></stop>
            <stop offset="100%" style="stop-color:rgba(255, 255, 255, 0.2)"></stop>
          </linearGradient>
          <path id="wave" fill="url(#bg)" d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
      s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z" />
        </defs>
        <g>
          <use xlink:href='#wave' opacity=".3">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="10s"
              calcMode="spline"
              values="270 230; -334 180; 270 230"
              keyTimes="0; .5; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite" />
          </use>
          <use xlink:href='#wave' opacity=".6">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="8s"
              calcMode="spline"
              values="-270 230;243 220;-270 230"
              keyTimes="0; .6; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite" />
          </use>
          <use xlink:href='#wave' opacty=".9">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="6s"
              calcMode="spline"
              values="0 230;-140 200;0 230"
              keyTimes="0; .4; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite" />
          </use>
        </g>
      </svg>
      <router-view class="pb-4 pl-0 pl-lg-3" style="z-index: 1;position: relative"></router-view>
    </v-main>
    
    <!-- loading overlay -->
    <v-overlay :value="$store.state.loadingOverlay">
      <div class="d-flex flex-column align-center justify-center">
        <!-- <v-progress-circular
            indeterminate
            color="white"
            size="64"
            data-aos="zoom-in"
            data-aos-duration="1000"
        ></v-progress-circular> -->
        <LottieAnimation
          ref="anim"
          :animationData="lottie.data.loading"
          :loop="true"
          style="height: 64px;"
        />
        <p class="mt-2 mb-0" data-aos="zoom-in" data-aos-delay="200" data-aos-duration="800" v-if="$store.state.loadingOverlayText" v-html="$store.state.loadingOverlayText"></p>
      </div>
    </v-overlay>
    
    <!-- Maintenance Overlay -->
    <v-overlay :value="$store.state.maintenanceOverlay">
      <div class="d-flex flex-column align-center position-relative">
        <!-- <img class="rounded-xl" style="max-width: 100%;width: 550px;" :src="require('@/assets/maintenance.gif')" alt="" data-aos="zoom-in"> -->
        <LottieAnimation
          ref="anim2"
          :animationData="lottie.data.maintenance"
          :loop="true"
          style="max-width: 550px;max-width: 100%;"
        />
        <v-btn rounded @click="$router.push('/')"><v-icon class="mr-1">mdi-view-dashboard</v-icon>Back to Dashboard</v-btn>
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
import treeAnimation from '@/assets/lottie/tree.json'
import maintenanceAnimation from '@/assets/lottie/maintenance.json'
import LottieAnimation from 'lottie-web-vue'

export default {
  components: {
    LottieAnimation
  },
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
    isFullScreen: false,
    lottie: {
      data: {
        loading: treeAnimation,
        maintenance: maintenanceAnimation
      }
    }
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
        var exceptionPage = [
          'SeedlingChangeRequest', 
          'GekoManual', 
          'ITPlayground', 
          'PermintaanTutupanLahan',
          'DaftarQRLahanRusak',
          'LihatTanggalDistribusi',
          'ReportData',
          'AdjustmentDataSostam',
        ]
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
              if (this.$route.name != 'GekoManual') {
                this.$router.push("/");
              }
            }
          } else {
            // console.log("auth null");
              if (this.$route.name != 'GekoManual') {
                this.$router.push("/");
              }
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
              this.$store.state.User = ''
            }
          } else {
            // console.log("auth null");
            // console.log("logout system");
            if (this.logoutvalue == true) {
              this.logoutvalue = false;
              location.reload();
            } else if (this.$route.name == "Login") {
              // console.log("page " + this.$route.name);
            } else {
              this.$router.push("/");
            }
          }
        }
      } else {
        if (this.$route.name != 'GekoManual') {
          localStorage.removeItem("token");
          localStorage.removeItem("User");
          localStorage.removeItem("BaseUrlUpload");
          this.$router.push("/");
        }
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
              if (valMenuItem.title === 'Progression') activitiesRearrange[0] = valMenuItem
              else if (valMenuItem.title === 'Scooping Visit') activitiesRearrange[1] = valMenuItem
              else if (valMenuItem.title === 'RRA & PRA') activitiesRearrange[2] = valMenuItem
              else if (valMenuItem.title === 'Sosialisasi Program') activitiesRearrange[3] = valMenuItem
              else if (valMenuItem.title === 'Sosialisasi Tanam') activitiesRearrange[4] = valMenuItem
              else if (valMenuItem.title === 'Pelatihan Petani') activitiesRearrange[5] = valMenuItem
              else if (valMenuItem.title === 'Lubang Tanam') activitiesRearrange[6] = valMenuItem
              else if (valMenuItem.title === 'Material Organik') activitiesRearrange[7] = valMenuItem
              else if (valMenuItem.title === 'Distribusi') activitiesRearrange[8] = valMenuItem
              else if (valMenuItem.title === 'Realisasi Tanam') activitiesRearrange[9] = valMenuItem
              else if (valMenuItem.title === 'Monitoring 2') activitiesRearrange[10] = valMenuItem
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
    },
    isLogin(val) {
      if (val != true) this.$store.state.User = '' 
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
