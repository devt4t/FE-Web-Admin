<template>
  <v-container class="mt-5 pl-5" fluid>
    <v-row style="margin-top: -15px">
      <v-col cols="12" md="12">
        <!-- <v-card>
          <v-alert show dismissible text color="#444941" class="fontall">
            Login Berhasil! Selamat datang di <strong>HRIS</strong>
          </v-alert>
        </v-card> -->
        <!-- <div>
          <v-alert
            type="success"
            border="left"
            color="#4199bb"
            dark
            class="fontall"
            dismissible
          >
            Login Berhasil! Selamat datang di Admin Management System
          </v-alert>
        </div> -->

        <v-card rounded="xl">
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
              <v-col cols="12" md="3" class="d-flex align-end">
                <v-avatar size="50" rounded class="elevation-1">
                  <v-icon
                    dark
                    style="font-size: 35px !important"
                    color="#444941"
                    >mdi-account-multiple
                  </v-icon>
                </v-avatar>
                <div class="ms-3">
                  <p class="itemparent mb-0">
                    {{ data1.Judul }}
                  </p>
                  <h3 class="fontall">
                    {{ data1.Count }}
                  </h3>
                </div>
              </v-col>

              <v-col cols="12" md="3" class="d-flex align-end">
                <v-avatar size="50" rounded class="elevation-1">
                  <v-icon style="font-size: 35px !important" color="#3353ee"
                    >mdi-image-filter-hdr</v-icon
                  >
                </v-avatar>
                <div class="ms-3">
                  <p class="itemparent mb-0">
                    {{ data2.Judul }}
                  </p>
                  <h3 class="fontall">
                    {{ data2.Count }}
                  </h3>
                </div>
              </v-col>

              <v-col cols="12" md="3" class="d-flex align-end">
                <v-avatar size="50" rounded class="elevation-1">
                  <v-icon style="font-size: 35px !important" color="#32c351"
                    >mdi-forest</v-icon
                  >
                </v-avatar>
                <div class="ms-3">
                  <p class="itemparent mb-0">
                    {{ data3.Judul }}
                  </p>
                  <h3 class="fontall">
                    {{ data3.Count }}
                  </h3>
                </div>
              </v-col>
              <v-col cols="3" class="d-none d-md-block">
                <v-row align="center" justify="center" class="mb-0">
                  <v-img
                    max-width="200"
                    src="/images/dashboard_logo.jpg"
                    style="margin-top: -50px"
                  ></v-img>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-3">
      <v-col class="px-1 py-1 mt-1" cols="12" sm="4" md="4">
        <v-card class="d-none d-md-block overflow-hidden" elevation="5" rounded="xl">
          <v-card-text class="py-1 px-1">
            <GChart
              type="ColumnChart"
              :data="chartDataColom1"
              :options="colomchartOptionsGoogle1"
            />
          </v-card-text>
        </v-card>

        <v-card class="d-sm-block d-md-none overflow-hidden" elevation="5" rounded="xl">
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
        <v-card class="d-none d-md-block overflow-hidden" elevation="5" rounded="xl">
          <v-card-text class="py-1 px-1">
            <GChart
              type="ColumnChart"
              :data="chartDataColom2"
              :options="colomchartOptionsGoogle2"
            />
          </v-card-text>
        </v-card>

        <v-card class="d-sm-block d-md-none overflow-hidden" elevation="5" rounded="xl">
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
        <v-card class="d-none d-md-block overflow-hidden" elevation="5" rounded="xl">
          <v-card-text class="py-1 px-1">
            <GChart
              type="ColumnChart"
              :data="chartDataColom3"
              :options="colomchartOptionsGoogle3"
            />
          </v-card-text>
        </v-card>

        <v-card class="d-sm-block d-md-none overflow-hidden" elevation="5" rounded="xl">
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
    isMorning() {
      return new Date().getHours() < 12 ? true : false;
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
  }),
  created() {
    this.authtoken = localStorage.getItem("token");
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.User = JSON.parse(localStorage.getItem("User"));
    if (this.User) {
      var name = this.User.name;
      this.fullnameadmin = name;
      const arrayname = name.split(" ");
      this.nameadmin = arrayname[0];
    }
    this.initialize();
  },
  methods: {
    async initialize() {
      this.loadtable = true;
      try {
        const response = await axios.get(this.BaseUrlGet + "Dashboard", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        if (response.data.length != 0) {
          // this.loadtable = false;
          this.greeting = response.data.data.result.greeting;
          this.day = response.data.data.result.day;
          this.date = response.data.data.result.dateformat;
          this.data1.Count = response.data.data.result.Getfarmer;
          this.data2.Count = response.data.data.result.Getlahan;
          this.data3.Count = response.data.data.result.Getpohon;
          this.chartDataColom1 = response.data.data.result.listarraytotalkayu;
          this.chartDataColom2 = response.data.data.result.listarraytotalmpts;
          this.chartDataColom3 = response.data.data.result.listarraytotalcrops;
          // this.chartData = response.data.data.result.listarraysales;
          // this.profils = response.data.data.result.listvalcust;
        } else {
          console.log("Kosong");
          this.loadtable = false;
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.loadtable = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.loadtable = false;
          this.dataobject = [];
        }
      }
    },
  },
};
</script>

