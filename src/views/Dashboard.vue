<template>
  <v-container class="mt-5 pl-3 pl-lg-6" fluid>
    <v-row style="margin-top: -15px">
      <v-col cols="12" md="12" data-aos="fade-down" >
        <v-card rounded="xl" :dark="$store.state.theme == 'dark'">
          <v-card-title class="fontall" v-if="isMorning()">
            Good Morning, {{ fullnameadmin }}</v-card-title
          >
          <v-card-title class="fontall" v-else>
            Good Afternoon, {{ fullnameadmin }}</v-card-title
          >
          <!-- <v-card-title>Good {{ greeting }}, {{ fullnameadmin }}</v-card-title> -->
          <v-card-subtitle>
            it's
            {{
              new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="9" class="d-flex flex-column flex-lg-row align-items-center justify-content-center">
                <v-select
                  dense
                  color="success"
                  item-color="success"
                  :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition', dark: $store.state.theme == 'dark'}"
                  hide-details
                  rounded
                  v-model="options.programYear"
                  :items="$store.state.programYear.options"
                  label="Program Year"
                  :rules="[(v) => !!v || 'Field is required']"
                  outlined
                  class="mt-2 mr-1"
                  style="max-width: 175px;"
                  @change="initialize"
                ></v-select>
                <v-autocomplete
                  dense
                  color="success"
                  item-color="success"
                  :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition', dark: $store.state.theme == 'dark'}"
                  hide-details
                  rounded
                  v-model="options.source.model"
                  :items="options.source.options"
                  label="Source Data"
                  :rules="[(v) => !!v || 'Field is required']"
                  outlined
                  class="mt-2 mx-1"
                  @change="initialize"
                ></v-autocomplete>
                <v-autocomplete
                  dense
                  color="success"
                  item-color="success"
                  :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition', dark: $store.state.theme == 'dark'}"
                  hide-details
                  rounded
                  v-model="options.province.model"
                  :items="options.province.options"
                  label="Province"
                  :rules="[(v) => !!v || 'Field is required']"
                  outlined
                  class="mt-2 ml-1"
                  @change="initialize"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3" class="d-none d-md-block">
                <v-row align="center" justify="center" class="mb-0">
                  <v-img
                    max-width="170px"
                    :src="require('@/assets/female-investors.gif')"
                    style="position: absolute;top: -10px;"
                  ></v-img>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="">
      <!-- TOGGLE BUTTON -->
      <v-col cols="12" md="3" class="">
        <v-card
          v-if="loading == false"
          data-aos="fade-down"
          data-aos-delay="300"
          class="rounded-xl shadow-lg overflow-hidden"
          @click="() => {}"
        >
          <v-list-item three-line>
            <v-list-item-content class="px-3">
              <div class="mb-2">
                Survival Rates
              </div>
              <v-list-item-title class="text-h5 mb-1 font-weight-bold">
                <number
                  ref="survivalRatesNumber"
                  animationPaused
                  :key="componentKeys.survivalRatesNumber"
                  :from="0"
                  :to="100"
                  :duration="5"
                  :delay="0"
                  easing="Power1.easeOut"/>%
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
            <img
              data-aos="zoom-in"
              data-aos-delay="700"
              style="max-width: 113px;"            
              :src="require('@/assets/plant.gif')"
            />
          </v-list-item>
        </v-card>
      </v-col>
      <!-- Total Petani -->
      <v-col cols="12" md="3" class="">
        <v-card
          v-if="loading == false"
          data-aos="fade-down"
          data-aos-delay="400"
          class="rounded-xl shadow-lg"
          @click="$router.push('Farmer')"
        >
          <v-list-item three-line>
            <v-list-item-content class="px-3">
              <div class="mb-2">
                {{ data1.Judul }}
              </div>
              <v-list-item-title class="text-h5 mb-1 font-weight-bold">
                <number
                  ref="totalFarmerNumber"
                  :key="componentKeys.totalFarmerNumber"
                  :format="numberFormat"
                  animationPaused
                  :from="0"
                  :to="data1.Count"
                  :duration="5"
                  :delay="0"
                  easing="Power2.easeInOut"/>
              </v-list-item-title>
              <v-list-item-subtitle>NIK</v-list-item-subtitle>
            </v-list-item-content>
  
            <v-list-item-avatar
              data-aos="zoom-in"
              data-aos-delay="800"
              tile
              size="80"
              color="grey darken-3"
              class="rounded-circle"
            >
              
            <v-icon
              style="font-size: 35px !important"
              color="white"
              >mdi-nature-people
            </v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
      <!-- Total Lahan -->
      <v-col cols="12" md="3" class="">
        <v-card
          v-if="loading == false"
          data-aos="fade-down"
          data-aos-delay="500"
          @click="$router.push('Lahan')"
          class="rounded-xl shadow-lg"
        >
          <v-list-item three-line>
            <v-list-item-content class="px-3">
              <div class="mb-2">
                {{ data2.Judul }}
              </div>
              <v-list-item-title class="text-h5 mb-1 font-weight-bold">
                <number
                  ref="totalLandNumber"
                  :key="componentKeys.totalLandNumber"
                  :format="numberFormat"
                  animationPaused
                  :from="0"
                  :to="data2.Count"
                  :duration="5"
                  :delay="0"
                  easing="Power2.easeInOut"/>
              </v-list-item-title>
              <v-list-item-subtitle>Lahan</v-list-item-subtitle>
            </v-list-item-content>
  
            <v-list-item-avatar
              data-aos="zoom-in"
              data-aos-delay="900"
              tile
              size="80"
              color="brown"
              class="rounded-circle"
            >
              
            <v-icon
              style="font-size: 35px !important"
              color="white"
              >mdi-land-fields
            </v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
      <!-- Total Pohon -->
      <v-col cols="12" md="3" class="">
        <v-card
          v-if="loading == false"
          class="rounded-xl shadow-lg"
          data-aos="fade-down"
          data-aos-delay="600"
        >
          <v-list-item three-line>
            <v-list-item-content class="px-3">
              <div class="mb-2">
                {{ data3.Judul }}
              </div>
              <v-list-item-title class="text-h5 mb-1 font-weight-bold">
                <number
                  ref="totalTreeNumber"
                  :key="componentKeys.totalTreeNumber"
                  :format="numberFormat"
                  animationPaused
                  :from="0"
                  :to="data3.Count"
                  :duration="5"
                  :delay="0"
                  easing="Power2.easeInOut"/>
              </v-list-item-title>
              <v-list-item-subtitle>Pohon</v-list-item-subtitle>
            </v-list-item-content>
  
            <v-list-item-avatar
              data-aos="zoom-in"
              data-aos-delay="1000"
              tile
              size="80"
              color="green darken-2"
              class="rounded-circle"
            >
              
            <v-icon
              style="font-size: 35px !important"
              color="white"
              >mdi-forest
            </v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-3">
      <v-col class="px-1 py-1 mt-1" cols="12" sm="4" md="4">
        <v-card 
          v-if="loading == false"
          data-aos="zoom-in"
          data-aos-delay="800" class="d-none d-md-inline-block overflow-hidden" elevation="5" rounded="xl">
          <v-card-text class="py-1 px-1">
            <GChart
              type="ColumnChart"
              :data="chartDataColom1"
              :options="colomchartOptionsGoogle1"
            />
          </v-card-text>
        </v-card>

        <v-card 
          v-if="loading == false"
          data-aos="zoom-in"
          data-aos-delay="800" class="d-sm-inline-block d-md-none overflow-hidden" elevation="5" rounded="xl">
          <v-card-text class="py-1 px-1">
            <GChart
              type="ColumnChart"
              :data="chartDataColom1"
              :options="colomchartOptionsGoogleMobile1"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="px-1 py-1 mt-1" cols="12" sm="4" md="4">
        <v-card
          v-if="loading == false"
          data-aos="zoom-in"
          data-aos-delay="900" class="d-none d-md-inline-block overflow-hidden" elevation="5" rounded="xl">
          <v-card-text class="py-1 px-1">
            <GChart
              type="ColumnChart"
              :data="chartDataColom2"
              :options="colomchartOptionsGoogle2"
            />
          </v-card-text>
        </v-card>

        <v-card
          v-if="loading == false"
          data-aos="zoom-in"
          data-aos-delay="900" class="d-sm-inline-block d-md-none overflow-hidden" elevation="5" rounded="xl">
          <v-card-text class="py-1 px-1">
            <GChart
              type="ColumnChart"
              :data="chartDataColom2"
              :options="colomchartOptionsGoogleMobile2"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="px-1 py-1 mt-1" cols="12" sm="4" md="4">
        <v-card
          v-if="loading == false"
          data-aos="zoom-in"
          data-aos-delay="1000" class="d-none d-md-inline-block overflow-hidden" elevation="5" rounded="xl">
          <v-card-text class="py-1 px-1">
            <GChart
              type="ColumnChart"
              :data="chartDataColom3"
              :options="colomchartOptionsGoogle3"
            />
          </v-card-text>
        </v-card>

        <v-card
          v-if="loading == false"
          data-aos="zoom-in"
          data-aos-delay="1000" class="d-sm-inline-block d-md-none overflow-hidden" elevation="5" rounded="xl">
          <v-card-text class="py-1 px-1">
            <GChart
              type="ColumnChart"
              :data="chartDataColom3"
              :options="colomchartOptionsGoogleMobile3"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

// import VueApexCharts from "vue-apexcharts";

const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "black"],
  ["purple", "violet"],
  ["#FF0", "#F0F", "#00c6ff"],
  ["#1feaea", "#ffd200", "#f72047"],
];

export default {
  name: "Dashboard",

  components: {
    // apexchart: VueApexCharts,
  },
  data: () => ({
    loading: false,
    isMorning() {
      return new Date().getHours() < 12 ? true : false;
    },
    componentKeys: {
      survivalRatesNumber: 42342345,
      totalFarmerNumber: 12335123,
      totalLandNumber: 142,
      totalTreeNumber: 5234,
    },
    greeting: "Morning",
    date: "01 December 2021",
    day: "Sunday",

    drawer: null,
    BaseUrlGet: "",
    authtoken: "",

    dialogDetailSales: false,
    dialogDetailSale: false,

    itemssale: [],
    itemssales: [],
    from_date_sales: "",
    to_date_sales: "",

    defaultItem: {
      code: "",
      nama: "",
      email: "",
      status: "",
      status_name: "",
    },

    data1: {
      Judul: "Total Petani",
      Count: "1",
      link: "/",
    },
    data2: {
      Judul: "Total Lahan",
      Count: "11",
      link: "/",
    },
    data3: {
      Judul: "Total Pohon",
      Count: "111",
      link: "/",
    },

    gradientDirection: "top",
    gradients,
    gradient: gradients[10],
    labelsSparkline: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "August",
      "Sept",
      "Okt",
      "Nop",
      "Dec",
    ],
    valueSparkline: [350, 200, 410, 390, 310, 460, 250, 240, 0, 0, 0, 0],
    srcimage: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
    datacollection: null,
    namaAdmin: "Nama Admin",

    chartDataColom1: [
      ["Tempat", "Total"],
      ["Oktober", 1000],
      ["November", 1100],
      ["Desember", 1160],
      ["Januari", 1160],
      ["Februari", 1160],
    ],
    chartDataColom2: [
      ["Tempat", "Total"],
      ["Oktober", 1000],
      ["November", 1100],
      ["Desember", 1160],
      ["Januari", 1160],
      ["Februari", 1160],
    ],
    chartDataColom3: [
      ["Tempat", "Total"],
      ["Oktober", 1000],
      ["November", 1100],
      ["Desember", 1160],
      ["Januari", 1160],
      ["Februari", 1160],
    ],
    colomchartOptionsGoogle1: {
      title: "Pohon Kayu",
      // pieHole: 0.4,
      // is3D: true,
      legend: "none",
      pieSliceText: "label",
      width: $(window).width() * 0.25,
      height: $(window).height() * 0.45,
    },
    colomchartOptionsGoogleMobile1: {
      title: "Pohon Kayu",
      // pieHole: 0.4,
      // is3D: true,
      legend: "none",
      pieSliceText: "label",
    },
    colomchartOptionsGoogle2: {
      title: "Pohon MPTS",
      // pieHole: 0.4,
      // is3D: true,
      legend: "none",
      pieSliceText: "label",
      width: $(window).width() * 0.25,
      height: $(window).height() * 0.45,
    },
    colomchartOptionsGoogleMobile2: {
      title: "Pohon MPTS",
      // pieHole: 0.4,
      // is3D: true,
      legend: "none",
      pieSliceText: "label",
    },
    colomchartOptionsGoogle3: {
      title: "CROPS",
      // pieHole: 0.4,
      // is3D: true,
      legend: "none",
      pieSliceText: "label",
      width: $(window).width() * 0.25,
      height: $(window).height() * 0.45,
    },
    colomchartOptionsGoogleMobile3: {
      title: "CROPS",
      // pieHole: 0.4,
      // is3D: true,
      legend: "none",
      pieSliceText: "label",
    },

    fullnameadmin: "",
    nameadmin: "",

    options: {
      programYear: '',
      province: {
        model: 'all',
        options: [
          { 
            text: 'All',
            value: 'all'
          },
          { 
            text: 'Jawa Barat',
            value: 'JB'
          }, 
          { 
            text: 'Jawa Tengah',
            value: 'JT'
          }]
      },
      source: {
        model: 'Sosialisasi Tanam',
        options: ['Sosialisasi Tanam', 'Penilikan Lubang', 'Distribusi', 'Realisasi Tanam']
      },
    },
    SR: {
      show: false
    }
  }),
  mounted() {
    this.authtoken = localStorage.getItem("token")
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet")
    this.User = JSON.parse(localStorage.getItem("User"))
    this.options.programYear = this.$store.state.programYear.model
    if (this.User) {
      var name = this.User.name
      this.fullnameadmin = name
      const arrayname = name.split(" ")
      this.nameadmin = arrayname[0]
    }
    this.initialize();
    this.$store.state.maintenanceOverlay = false
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false
    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },
  methods: {
    async initialize() {
      this.loading = true;
      this.$store.state.loadingOverlayText = 'Loading...'
      this.$store.state.loadingOverlay = true
      try {
        const response = await axios.get(this.BaseUrlGet + "Dashboard", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        })

        this.$store.state.loadingOverlayText = `Getting datas from ${this.options.source.model}...`
        const totalData = await axios.get(this.$store.getters.getApiUrl(`GekoDashboardAll?${new URLSearchParams({
          program_year: this.options.programYear,
          source: this.options.source.model,
          province: this.options.province.model
        })}`), this.$store.state.apiConfig)
        // console.log(totalData)
        if (response.data.length != 0 && totalData.data) {
          // this.loading = false;
          // console.log(response.data.data.result)
          this.greeting = response.data.data.result.greeting
          this.day = response.data.data.result.day
          this.date = response.data.data.result.dateformat
          this.data1.Count = totalData.data.data.result.total.farmer
          this.data2.Count = totalData.data.data.result.total.land_total
          this.data3.Count = totalData.data.data.result.total.trees
          this.chartDataColom1 = response.data.data.result.listarraytotalkayu
          this.chartDataColom2 = response.data.data.result.listarraytotalmpts
          this.chartDataColom3 = response.data.data.result.listarraytotalcrops
          this.startNumberAnimation()
          // this.chartData = response.data.data.result.listarraysales;
          // this.profils = response.data.data.result.listvalcust;
        } else {
          console.log("Kosong");
          this.loading = false
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.loading = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.loading = false;
          this.dataobject = [];
        }
      } finally {
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
          this.loading = false
      }
    },
    async startNumberAnimation () {
      this.componentKeys.survivalRatesNumber += 1
      this.componentKeys.totalFarmerNumber += 1
      this.componentKeys.totalLandNumber += 1
      this.componentKeys.totalTreeNumber += 1
      await setTimeout(() => {
        this.$refs.survivalRatesNumber.play()
        this.$refs.totalFarmerNumber.play()
        this.$refs.totalLandNumber.play()
        this.$refs.totalTreeNumber.play()
      }, 100)
    },
    numberFormat(num) {
        return new Intl.NumberFormat('id-ID', {
          maximumFractionDigits: 0
        }).format(num)
    },
  },
};
</script>

