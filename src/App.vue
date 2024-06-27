<template>
  <v-app id="Trees">
    <!-- Sidebar -->
    <v-navigation-drawer
      :width="'auto'"
      v-if="$route.name !== 'Login'"
      v-model="drawer"
      :dark="$store.state.theme == 'dark'"
      app
      :class="`custom-sidebar ${
        $store.state.theme == 'dark' ? 'dark-bg-gradient' : 'light-bg-gradient'
      } rounded-xl ml-2 mt-2 elevation-5`"
      style="height: auto; max-height: 97.5vh"
    >
      <template v-slot:prepend>
        <!-- <v-list-item>
          <v-list-item-content class="text-center">
            <v-list-item-title
              style="font-weight: 550; font-size: 125%"
              class="fontall green--text--theme"
            >
              GEKO
            </v-list-item-title>
            <v-list-item-subtitle>Green Earth Kontrol</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item> -->

        <div class="sidebar-header">
          <img src="/images/GEKO_short.png" />

          <div class="d-flex flex-row sidebar-profile w-100">
            <div class="avatar">{{ avatarHelper($store.state.User.name) }}</div>
            <div class="d-flex flex-column sidebar-profile-name">
              <h6>{{ $store.state.User ? $store.state.User.name : "" }}</h6>
              <p class="mb-0 text-08-em">
                {{ $store.state.User ? $store.state.User.role_name : "" }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <div class="sidebar-menus">
        <div
          class="sidebar-menu-item"
          v-for="(group, i) in items"
          :key="`group-${i}`"
        >
          <button v-if="!Array.isArray(group.items)" class="sidebar-button">
            <v-icon>{{ group.icon }}</v-icon>
            <span>{{ group.title }}</span>
          </button>

          <p v-else class="sidebar-title mb-0">
            {{ group.title }}
          </p>
          <button
            v-for="(menu, j) in Array.isArray(group.items) ? group.items : []"
            class="sidebar-button"
            :key="`menu-side-${j}-${i}`"
            :class="{
              active: $route.path == menu.to,
            }"
            @click="
              $router.push({
                path: menu.to,
                query: {
                  view: 'list',
                },
              })
            "
          >
            <v-icon>{{
              $route.path == menu.to ? menu.icon : `${menu.icon}-outline`
            }}</v-icon>
            <span>{{ menu.title }}</span>
          </button>
        </div>
      </div>

      <v-list color="transparent" rounded v-if="false">
        <template v-for="item in items">
          <v-list-item
            v-if="!Array.isArray(item.items)"
            :key="item.title"
            :to="item.to"
            v-model="item.active"
            :prepend-icon="item.icon"
            link
          >
            <!-- <v-list-item-title>{{ item.title }}</v-list-item-title> -->
            <template>
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title style="font-size: 14px" v-text="item.title">
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
          <v-list-group
            v-else
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
              v-if="Array.isArray(item.items)"
              v-for="child in item.items"
              :key="child.title"
              :to="child.to"
              link
              dense
              :ripple="false"
            >
              <template>
                <v-list-item-content>
                  <v-list-item-title
                    class="itemchild"
                    v-text="child.title"
                  ></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-item>

            <!-- <template v-if="item.title == 'Activities'">
          <v-list-item-content color="#71AF34" 
            :ripple="false"
            v-if="$store.state.User.role_group == 'IT'"
          >
            <v-list-item-title>Monitoring</v-list-item-title>
          </v-list-item-content>
        </template> -->
          </v-list-group>
        </template>
        <!-- <v-list-item
          color="#71AF34"
          :to="'/report-data'"
          link
          :ripple="false"
          v-if="
            $store.state.User.role_group == 'IT' ||
            $store.state.User.role_name == 'GIS STAFF' ||
            $store.state.User.email == 'anto@trees4trees.org'
          "
        >
          <v-list-item-icon>
            <v-icon>mdi-table-arrow-right</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Report Data</v-list-item-title>
        </v-list-item> -->
      </v-list>

      <template v-slot:append v-if="false">
        <div class="text-center pa-2">
          <v-btn
            :color="`${
              $store.state.theme == 'light'
                ? 'orange white--text'
                : 'orange--text white'
            } darken-2`"
            fab
            x-small
            class="mr-1"
            @click="$store.state.theme = 'light'"
          >
            <v-icon>mdi-weather-sunny</v-icon>
          </v-btn>
          <v-btn color="red white--text" fab small class="" @click="logout()">
            <v-icon>mdi-power</v-icon>
          </v-btn>
          <v-btn
            :color="`${
              $store.state.theme == 'dark' ? 'blue' : 'blue--text'
            } darken-2`"
            fab
            x-small
            class="ml-1"
            @click="$store.state.theme = 'dark'"
          >
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

    <button class="toggle-button-mobile" v-if="$route.name !== 'Login'">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </button>
    <v-app-bar
      :class="`${
        $store.state.theme == 'dark' ? 'dark-bg-gradient' : 'light-bg-gradient'
      } mx-2 ml-2 ml-lg-5 mt-2 rounded-pill`"
      :dark="$store.state.theme == 'dark'"
      v-if="isLoggedIn"
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="pl-1 fontall">
        <a href="/" style="text-decoration: none" :class="'green--text--theme'">
          Trees4Trees
        </a>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        {{ isFullScreen ? "Close" : "Go" }} FullScreen
        {{ isFullScreen ? "(esc)" : "" }}
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            color="gray darken-1"
            @click="toggleFullScreen"
          >
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
    <v-app-bar
      v-if="isLoggedIn"
      :class="`${
        $store.state.theme == 'dark' ? 'dark-bg-gradient' : 'light-bg-gradient'
      } mx-5 mr-3 mb-2 rounded-xl`"
      app
      dense
      bottom
      absolute
      :dark="$store.state.theme == 'dark'"
    >
      <v-col
        :class="`text-center green--text ${
          $store.state.theme == 'dark' ? 'text--lighten-4' : 'text--darken-1'
        }`"
        cols="12"
      >
        GEKOWeb v{{ $store.state.packageVersion }} © Trees4Trees
      </v-col>
    </v-app-bar>

    <!-- Main Content -->
    <v-main
      :class="`gradient-animate ${$store.state.theme} ${
        isLoggedIn ? 'logged-in' : ''
      }`"
    >
      <svg
        class="wave"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        v-if="
          $route.name !== 'Distribusi' ||
          $store.state.User.role_name == 'FIELD COORDINATOR'
        "
      >
        <defs>
          <linearGradient id="bg">
            <stop
              offset="0%"
              style="stop-color: rgba(255, 255, 255, 0.06)"
            ></stop>
            <stop
              offset="50%"
              style="stop-color: rgba(255, 255, 255, 0.4)"
            ></stop>
            <stop
              offset="100%"
              style="stop-color: rgba(255, 255, 255, 0.2)"
            ></stop>
          </linearGradient>
          <path
            id="wave"
            fill="url(#bg)"
            d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
      s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
          />
        </defs>
        <g>
          <use xlink:href="#wave" opacity=".3">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="10s"
              calcMode="spline"
              values="270 230; -334 180; 270 230"
              keyTimes="0; .5; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
          <use xlink:href="#wave" opacity=".6">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="8s"
              calcMode="spline"
              values="-270 230;243 220;-270 230"
              keyTimes="0; .6; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
          <use xlink:href="#wave" opacty=".9">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="6s"
              calcMode="spline"
              values="0 230;-140 200;0 230"
              keyTimes="0; .4; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite"
            />
          </use>
        </g>
      </svg>
      <router-view
        class="pb-4 pl-0 pl-lg-3"
        style="z-index: 1; position: relative"
      ></router-view>
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
          style="height: 64px"
        />
        <p
          class="mt-2 mb-0"
          data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="800"
          v-if="$store.state.loadingOverlayText"
          v-html="$store.state.loadingOverlayText"
        ></p>
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
          style="max-width: 550px; max-width: 100%"
        />
        <v-btn rounded @click="$router.push('/')"
          ><v-icon class="mr-1">mdi-view-dashboard</v-icon>Back to
          Dashboard</v-btn
        >
      </div>
    </v-overlay>

    <!-- lightbox ~ image preview -->
    <vue-easy-lightbox
      :visible="$store.state.lightbox.show"
      :imgs="$store.state.lightbox.imgs"
      :index="$store.state.lightbox.index"
      @hide="
        () => {
          $store.state.lightbox.show = false;
        }
      "
    ></vue-easy-lightbox>
  </v-app>
</template>

<script>
import axios from "axios";
import treeAnimation from "@/assets/lottie/tree.json";
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import menus from "@/router/menu";
import router from "@/router/index";

export default {
  components: {
    LottieAnimation,
  },
  data: () => ({
    drawer: null,
    nameadmin: "admin web",
    statusadmin: "admin web",
    DashboardLink: "/Dashboard",
    itemsprofile: [{ title: "Ganti Password" }, { title: "Logout" }],
    User: [],
    items: [],
    isLoggedIn: null,
    elevations: [6, 12, 18],
    BaseUrlGet: "",
    authtoken: "",
    listValMenu: [],
    logoutvalue: false,
    isFullScreen: false,
    lottie: {
      data: {
        loading: treeAnimation,
        maintenance: maintenanceAnimation,
      },
    },
  }),
  mounted() {
    if (!this.$store.state.token && !localStorage.getItem("token")) {
      //not authorized
      this.$router.push("/");
      this.isLoggedIn = false;
      return;
    } else {
      this.buildConfig();
      this.isLoggedIn = true;
    }
  },
  watch: {
    "$store.state.token": {
      handler(v) {
        if (v) {
          this.isLoggedIn = true;
          this.buildConfig();
        } else {
          if (!localStorage.getItem("token")) {
            this.isLoggedIn = false;
          }
        }
      },
    },
  },
  methods: {
    avatarHelper(name) {
      if (name.split(" ").length > 1) {
        return name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0);
      } else if (name.split(" ").length > 0) {
        return `${name.charAt(0)}${name.charAt(1)}`;
      }
    },
    async buildConfig() {
      if (Array.isArray(this.items) && this.items.length > 0) return;
      //test
      if (!this.$store.state.User) return;
      if (!Array.isArray(this.$store.state.User.list_val_menu)) return;

      let listMenu = [];

      for (const menu of menus) {
        if (
          menu.permission == "ReportData" &&
          (this.$store.state.User.role != "13" ||
            this.$store.state.User.email !== "anto@trees4trees.org")
        ) {
          listMenu.push({
            title: menu.title,
            icon: menu.icon,
            to: menu.to,
          });

          router.addRoute({
            path: menu.to,
            name: menu.name,
            component: () => import(`@/views/${menu.component}.vue`),
          });

          continue;
        }
        if (!Array.isArray(menu.items)) {
          listMenu.push({
            title: menu.title,
            icon: menu.icon,
            to: menu.to,
          });

          if (this.$router.getRoutes().find((x) => x.name === menu.name)) {
            continue;
          }

          router.addRoute({
            path: menu.to,
            name: menu.name,
            component: () => import(`@/views/${menu.component}.vue`),
          });
        } else {
          //has submenu
          let _listMenuItem = {
            title: menu.title,
            icon: menu.icon,
            items: [],
          };

          for (const submenu of menu.items) {
            const isAllowed = this.$store.state.User.list_val_menu.includes(
              submenu.permission
            );
            if (!isAllowed) continue;

            if (!submenu.hide) {
              _listMenuItem.items.push({
                title: submenu.title,
                to: submenu.to,
                icon: submenu.icon,
              });
            }

            if (
              this.$router.getRoutes().find((x) => x.name === submenu.name) &&
              !submenu.prevent_route_validation
            ) {
              continue;
            }
            router.addRoute({
              path: submenu.to,
              name: submenu.name,
              component: () => import(`@/views/${submenu.component}.vue`),
            });
          }

          if (_listMenuItem.items.length > 0) {
            listMenu.push(_listMenuItem);
          }
        }
      }
      this.items = listMenu;
    },
    async cekLogout() {
      this.$store.commit("set", ["BaseUrlGet", "", true]);
      this.$store.commit("set", ["BaseUrlUpload", "", true]);
      this.$store.commit("set", ["BaseUrl", "", true]);
      this.$store.commit("set", ["BaseUrlPortal", "", true]);
      this.$store.commit("set", ["xAppKey_Portal", "", true]);

      this.$store.commit("set", ["ApiConfig", "", true]);

      this.$store.commit("set", ["token", "", true]);
      this.$store.commit("set", ["User", "", true]);
      this.$router.push("/");
    },

    logout() {
      this.cekLogout();
    },

    selectSection(item) {
      switch (item.title) {
        case "Ganti Password":
          this.$router.push("/GantiPassword");
          break;
        case "Logout":
          this.logout();
      }
    },
    toggleFullScreen() {
      var elem = document.documentElement;
      if (this.isFullScreen == false) {
        this.openFullscreen(elem);
      } else {
        this.closeFullscreen();
      }
    },
    /* View in fullscreen */
    openFullscreen(elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
      this.isFullScreen = true;
    },
    /* Close fullscreen */
    closeFullscreen() {
      if (this.isFullScreen && document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE11 */
          document.msExitFullscreen();
        }
      }
      this.isFullScreen = false;
    },
  },
};
</script>
