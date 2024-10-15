<template>
  <v-container class="mt-5 pl-3 pl-lg-6" fluid>
    <!-- Dialogs -->
    <f-f-detail
      :show="dialogs.ff_detail.show"
      :data="dialogs.ff_detail.data"
      @dialogActions="($val) => dialogActions($val)"
    ></f-f-detail>
    <f-c-detail
      :show="dialogs.fc_detail.show"
      :data="dialogs.fc_detail.data"
      @dialogActions="($val) => dialogActions($val)"
    ></f-c-detail>
    <u-m-detail
      :show="dialogs.um_detail.show"
      :data="dialogs.um_detail.data"
      @dialogActions="($val) => dialogActions($val)"
    ></u-m-detail>
    <!-- End:Dialogs -->

    <!-- Greetings -->
    <greetings class="mb-0" />
    <!-- End:Greetings -->

    <!-- Statistic -->
    <statistic />
    <!-- End:Statistic -->

    <!-- <div style="width: 300px;height: 300px;overflow: hidden;display: flex;justify-content: center;align-items: center;">
      <spline-viewer url="https://prod.spline.design/sDCa1WJtTdVGmbP7/scene.splinecode"></spline-viewer>
    </div> -->
    <!-- Jumlah Data -->
    <div v-if="false" data-aos="fade-down" data-aos-delay="350">
      <v-card class="mt-2 rounded-xl" :dark="$store.state.theme == 'dark'">
        <v-card-title>
          <v-icon class="mr-2">mdi-counter</v-icon>
          Jumlah Data
          <v-divider class="mx-2"></v-divider>
          <!-- program_year -->
          <v-select
            dense
            color="success"
            item-color="success"
            :menu-props="{
              rounded: 'xl',
              offsetY: true,
              transition: 'slide-y-transition',
              dark: $store.state.theme == 'dark',
            }"
            hide-details
            rounded
            v-model="options.programYear"
            :disabled="loading"
            :items="$store.state.programYear.options"
            label="Tahun Program"
            :rules="[(v) => !!v || 'Field is required']"
            outlined
            class="mt-2 mr-1"
            style="max-width: 175px"
            @change="initialize"
          ></v-select>
          <!-- mu_no -->
          <v-autocomplete
            v-if="options.mu_no.show"
            dense
            color="success"
            item-color="success"
            :menu-props="{
              rounded: 'xl',
              offsetY: true,
              transition: 'slide-y-transition',
              dark: $store.state.theme == 'dark',
            }"
            hide-details
            rounded
            item-text="name"
            item-value="mu_no"
            placeholder="Semua"
            v-model="options.mu_no.model"
            :items="options.mu_no.items"
            :disabled="loading"
            label="Management Unit"
            outlined
            clearable
            class="mt-2 ml-1"
            @change="initialize"
            style="max-width: 250px"
          ></v-autocomplete>
        </v-card-title>
        <v-card-text>
          <!-- Total Datas -->
          <v-row class="mt-0">
            <v-col
              v-for="n in 3"
              :key="`totalDatasDash${n}`"
              cols="12"
              md="4"
              class=""
            >
              <div
                data-aos="zoom-in"
                :data-aos-delay="totalData[`data${n}`].dataAosDelay + 700"
              >
                <v-card
                  class="rounded-xl shadow-lg"
                  @click="$router.push(totalData[`data${n}`].link)"
                >
                  <v-list-item three-line>
                    <v-list-item-avatar
                      data-aos="zoom-in"
                      data-aos-delay="800"
                      tile
                      size="80"
                      :color="totalData[`data${n}`].color"
                      class="rounded-circle"
                    >
                      <v-icon style="font-size: 35px !important" color="white">
                        {{ totalData[`data${n}`].icon }}
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="px-3">
                      <div class="mb-2">
                        <strong>{{ totalData[`data${n}`].Judul }}</strong>
                      </div>
                      <v-list-item-title class="text-h5 mb-1 font-weight-bold">
                        <number
                          v-if="loading == false"
                          :ref="totalData[`data${n}`].ref"
                          :key="totalData[`data${n}`].key"
                          :format="_utils.numberFormat"
                          :from="0"
                          :to="totalData[`data${n}`].Count"
                          :duration="1"
                          :delay="0"
                          easing="Power2.easeInOut"
                        />

                        <v-progress-circular
                          v-else
                          indeterminate
                          :color="totalData[`data${n}`].color"
                          size="27"
                        ></v-progress-circular>
                      </v-list-item-title>
                      <v-list-item-subtitle>{{
                        totalData[`data${n}`].sub
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </div>
            </v-col>

            <!--Total Petani dan Lahan -->
            <v-col
              v-for="n in 2"
              :key="`totalDatasDashbiarasdakjsd${n}`"
              cols="12"
              md="4"
              class=""
            >
              <div
                data-aos="zoom-in"
                :data-aos-delay="
                  totalData_petani_lahan[`data${n}`].dataAosDelay + 700
                "
              >
                <v-card
                  class="rounded-xl shadow-lg"
                  @click="$router.push(totalData_petani_lahan[`data${n}`].link)"
                >
                  <v-list-item three-line>
                    <v-list-item-avatar
                      data-aos="zoom-in"
                      data-aos-delay="800"
                      tile
                      size="80"
                      :color="totalData_petani_lahan[`data${n}`].color"
                      class="rounded-circle"
                    >
                      <v-icon style="font-size: 35px !important" color="white">
                        {{ totalData_petani_lahan[`data${n}`].icon }}
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="px-3">
                      <div class="mb-2">
                        <strong>{{
                          totalData_petani_lahan[`data${n}`].Judul
                        }}</strong>
                      </div>
                      <div class="mb-2" style="color: #1f9454">
                        Terverifikasi<v-icon class="mr-1" color="green"
                          >mdi-check</v-icon
                        >
                      </div>
                      <v-list-item-title>
                        <number
                          class="text-h5 mb-1 font-weight-bold"
                          v-if="loading == false"
                          :ref="totalData_petani_lahan[`data${n}`].ref"
                          :format="_utils.numberFormat"
                          :from="0"
                          :to="totalData_petani_lahan[`data${n}`].Count"
                          :duration="1"
                          :delay="0"
                          easing="Power2.easeInOut"
                        />
                        {{ totalData_petani_lahan[`data${n}`].openCase }}
                        <number
                          class="text-h6 mb-1 font-weight-bold"
                          v-if="loading == false"
                          :ref="totalData_petani_lahan[`data${n}`].ref"
                          :key="totalData_petani_lahan[`data${n}`].key"
                          :format="_utils.numberFormat"
                          :from="0"
                          :to="totalData_petani_lahan[`data${n}`].subCount"
                          :duration="1"
                          :delay="1"
                          easing="Power2.easeInOut"
                        />
                        <v-progress-circular
                          v-else
                          indeterminate
                          :color="totalData_petani_lahan[`data${n}`].color"
                          size="27"
                        ></v-progress-circular>
                        {{ totalData_petani_lahan[`data${n}`].closeCase }}
                      </v-list-item-title>
                      <v-list-item-subtitle>{{
                        totalData_petani_lahan[`data${n}`].sub
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </div>
            </v-col>

            <v-col cols="12" md="4" class="" v-if="getDetailSubordinateTitle">
              <div data-aos="zoom-in" :data-aos-delay="1400">
                <v-card
                  class="rounded-xl shadow-lg"
                  @click="dialogActions(true)"
                >
                  <v-list-item two-line>
                    <v-list-item-avatar
                      data-aos="zoom-in"
                      data-aos-delay="800"
                      tile
                      size="80"
                      :color="'blue'"
                      class="rounded-circle"
                    >
                      <v-icon style="font-size: 35px !important" color="white">
                        mdi-account-details
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="px-3">
                      <v-list-item-title class="text-h5 mb-1 font-weight-bold">
                        {{ getDetailSubordinateTitle }}
                      </v-list-item-title>
                      <v-list-item-subtitle> Detail </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Maps -->
    <DMap v-if="false" :options="options" data-aos="fade-up" />
    <!-- 360 View -->
    <tepview v-if="false"></tepview>
  </v-container>
</template>

<script>
import axios from "axios";
import LottieAnimation from "lottie-web-vue";

import plantingAnimation from "@/assets/lottie/planting.json";
import plant1 from "@/assets/lottie/plant-1.json";
import plant2 from "@/assets/lottie/plant-2.json";
import plant3 from "@/assets/lottie/plant-3.json";
import plant4 from "@/assets/lottie/plant-4.json";
import femaleWork from "@/assets/lottie/female-work.json";
import moneyTree from "@/assets/lottie/money-tree.json";
import DMap from "./components/maps";
import tepview from "@/views/Dashboard/components/360view";
import FFDetail from "@/views/Dashboard/components/dialogs/FFDetail";
import FCDetail from "@/views/Dashboard/components/dialogs/FCDetail";
import UMDetail from "./components/dialogs/UMDetail.vue";

export default {
  name: "Dashboard",
  components: {
    DMap,
    tepview,
    LottieAnimation,
    FFDetail,
    FCDetail,
    UMDetail,
    greetings: () => import("./components/greetings.vue"),
    statistic: () => import("./components/statistic.vue"),
  },
  data: () => ({
    config: {
      permission: {
        read: "dashboard-list",
      },
    },
    dialogs: {
      ff_detail: {
        show: false,
        data: null,
      },
      fc_detail: {
        show: false,
        data: null,
      },
      um_detail: {
        show: false,
        data: null,
      },
    },
    loading: false,
    lottie: {
      planting: moneyTree,
      key: 1101,
    },
    maps: {
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      listMarker: [],
      loading: {
        show: false,
        text: "Loading...",
      },
    },
    options: {
      programYear: "2022",
      mu_no: {
        disabled: false,
        show: true,
        model: "",
        items: [],
      },
      province: {
        disabled: false,
        show: true,
        model: "all",
        options: [
          {
            text: "All",
            value: "all",
          },
          {
            text: "Jawa Barat",
            value: "JB",
          },
          {
            text: "Jawa Tengah",
            value: "JT",
          },
        ],
      },
      source: {
        model: "Pendataan",
        options: [
          "Pendataan",
          "Sosialisasi Tanam",
          "Penilikan Lubang",
          "Distribusi",
          "Realisasi Tanam",
        ],
      },
    },
    time: {
      isMorning() {
        const hour = new Date().getHours();
        let time = "";
        if (hour < 12) time = "Pagi";
        if (hour >= 12 && hour < 15) time = "Siang";
        if (hour >= 15 && hour < 18) time = "Sore";
        if (hour >= 18 && hour < 24) time = "Malam";
        return `${time}`;
      },
      date: "",
      clock: "",
    },

    totalData_petani_lahan: {
      data1: {
        Judul: "Petani",
        Count: "0",
        openCase: "(Dari ",
        subCount: "0",
        closeCase: " )",
        link: "farmer-v2?view=list",
        icon: "mdi-nature-people",
        color: "orange",
        sub: "Orang",
        ref: "totalFarmerNumber",
        key: 321,
        dataAosDelay: 200,
      },
      data2: {
        Judul: "Lahan Petani",
        Count: "0",
        openCase: "(Dari ",
        subCount: "0",
        closeCase: " )",
        link: "lahan-v2?view=list",
        icon: "mdi-land-fields",
        color: "brown",
        sub: "Lahan",
        ref: "totalLahanNumber",
        key: 222,
        dataAosDelay: 300,
      },
    },
    totalData: {
      data1: {
        Judul: "Field Facilitator",
        Count: "0",
        link: "field-facilitator-v2?view=list",
        icon: "mdi-account",
        color: "blue",
        sub: "Orang",
        ref: "totalFFNumber",
        key: 123,
        dataAosDelay: 100,
      },
      // data2: {
      //   Judul: "Petani",
      //   Count: "0",
      //   subCount: "0",
      //   link: "Farmer",
      //   icon: 'mdi-nature-people',
      //   color: 'orange',
      //   sub: 'Orang',
      //   ref: 'totalFarmerNumber',
      //   key: 321,
      //   dataAosDelay: 200
      // },
      // data3: {
      //   Judul: "Lahan Petani",
      //   Count: "0",
      //   subCount: "0",
      //   link: "Lahan",
      //   icon: 'mdi-land-fields',
      //   color: 'brown',
      //   sub: 'Lahan',
      //   ref: 'totalLahanNumber',
      //   key: 222,
      //   dataAosDelay: 300
      // },
      data2: {
        Judul: "Lahan Umum",
        Count: "0",
        link: "Lahan",
        icon: "mdi-land-fields",
        color: "brown",
        sub: "Lahan",
        ref: "totalLahanNumber",
        key: 222,
        dataAosDelay: 200,
      },
      data3: {
        Judul: "Monitoring 1",
        Count: "0",
        link: "Dashboard",
        icon: "mdi-forest",
        color: "green",
        sub: "Pohon",
        ref: "totalPohonNumber",
        key: 111,
        dataAosDelay: 300,
      },
    },
    User: {},
  }),
  destroyed() {
    this.$store.state.maintenanceOverlay = false;
    this.$store.state.loadingOverlay = false;
    this.$store.state.loadingOverlayText = null;
  },
  computed: {
    femaleWork() {
      return femaleWork;
    },
    getDetailSubordinateTitle() {
      const user = this.$store.state.User;
      if (user.role_name == "FIELD COORDINATOR") return "Field Facilitator";
      if (user.role_name == "UNIT MANAGER") return "Field Coordinator";
      if (
        ["REGIONAL MANAGER", "PROGRAM MANAGER"].includes(user.role_name) ||
        user.role_group == "IT"
      )
        return "Unit Manager";
      return "";
    },
  },
  methods: {
    async dialogActions(show) {
      const user = this.User;
      let dialogName = "";
      let params = {
        programYear: this.options.programYear,
      };
      if (user.role_name == "FIELD COORDINATOR") {
        dialogName = "ff_detail";
        params.fcNo = user.employee_no;
        params.fcName = user.name;
      }
      if (user.role_name == "UNIT MANAGER") {
        dialogName = "fc_detail";
        params.umNo = user.employee_no;
        params.umName = user.name;
      }
      if (
        ["REGIONAL MANAGER", "PROGRAM MANAGER"].includes(user.role_name) ||
        user.role_group == "IT"
      ) {
        dialogName = "um_detail";
        params.rmNo = user.employee_no;
        params.rmName = user.name;
      }
      if (dialogName) {
        this.dialogs[dialogName].data = params;
        this.dialogs[dialogName].show = show;
      }
    },
    async getOptionsData(params) {
      let urlEndpoint = "";
      let items = [];

      if (params.type == "mu_no")
        urlEndpoint = `GetManagementUnit?program_year=${params.program_year}`;

      if (urlEndpoint) {
        console.log(this.$store.state.token);
        const url = this.$store.getters.getApiUrl(urlEndpoint);
        const res = await this.$_api.get("GetManagementUnit", {
          program_year: 2024,
        });

        items = res.data.result;

        if (items.length > 0) {
          if (["mu_no"].includes(params.type))
            items = items.sort((a, b) => a.name.localeCompare(b.name));
        }
      }

      return items;
    },
    async initialize() {
      try {
        this.loading = true;
        await this.setLottieDashboard(this.options.source.model);
        // get mu items
        this.options.mu_no.items = await this.getOptionsData({
          program_year: this.options.programYear,
          type: "mu_no",
        });
        let params = new URLSearchParams({
          program_year: this.options.programYear,
          province: this.options.province.model,
        });
        // if selected mu
        if (this.options.mu_no.model) {
          if (
            this.options.mu_no.items.find(
              (e) => e.mu_no == this.options.mu_no.model
            )
          )
            params.set("mu_no", this.options.mu_no.model);
          else this.options.mu_no.model = "";
        }
        // if user has ff
        if (this.User.ff.ff) {
          if (typeof this.User.ff.ff == "object")
            if (this.User.ff.ff.length > 0) {
              let userFF = [...this.User.ff.ff, this.User.email];
              params.set("ff", userFF.toString());
            }
        }
      } catch (error) {
        this.dataobject = [];
        this.catchingError(error);
      } finally {
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;
        this.loading = false;
      }
    },
    // Utilities
    catchingError(error) {
      if (error.response) {
        if (error.response.status) {
          if (error.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }
      }
      console.log(error);
    },
    dateTimeNow() {
      this.time.date = new Date().toLocaleDateString("ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setInterval(() => {
        this.time.clock = new Date().toLocaleTimeString("US");
      }, 100);
    },
    async setLottieDashboard(source) {
      if (source == "Penilikan Lubang") this.lottie.planting = await plant1;
      else this.lottie.planting = await moneyTree;

      this.lottie.key += 1;
    },
  },
  async mounted() {
    this.User = this.$store.state.User;
    this.options.programYear = this.$store.state.programYear.model;
    if (this.User.ff.ff.length > 0) this.options.mu_no.show = false;
    await this.dateTimeNow();
    await this.initialize();
    // this.$store.state.maintenanceOverlay = true
  },
};
</script>
