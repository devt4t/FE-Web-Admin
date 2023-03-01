<template>
  <div>
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      data-aos="fade-right"
      class="breadcrumbsmain"
      :items="[{
        text: 'Activities',
        disabled: true,
        href: 'breadcrumbs_dashboard',
      },{
        text: 'Monitoring 2',
        disabled: true,
        href: 'breadcrumbs_link_1',
      }]"
      divider=">"
      large
    ></v-breadcrumbs>
    <!-- trees preview component -->
    <trees-preview></trees-preview>

    <v-card v-if="false" elevation="5" class="pt-1 pb-0 px-2 mx-3 mt-0 mb-3" data-aos="fade-up" data-aos-delay="200">
      <v-card-text class="px-1">
        <v-row>
          <v-col
            class="px-2 py-1"
            cols="12"
            sm="3"
            md="3"
            style="text-align: center"
          >
            <v-btn
              dark
              class="mx-3 mt-1"
              @click="showFilterArea()"
              color="green"
              block
            >
              <v-icon class="mx-2" small>mdi-filter-variant</v-icon> Filter by
              Area
            </v-btn>
            <v-btn
              dark
              class="mx-3 mt-1"
              @click="showFilterEmployee()"
              color="green"
              block
            >
              <v-icon class="mx-2" small>mdi-image-filter-none</v-icon> Filter
              by Employee
            </v-btn>
            <div
              class="mr-3 mt-3 pt-2"
              style="
                border-style: solid;
                border-color: red;
                height: 150px;
                margin-left: 30px !important;
              "
            >
              <p># Titik Maps diambil dari maks 10 dari list Monitoring</p>
              <p># Klik Titik di Maps Untuk Melihat Detail Sederhana</p>
            </div>
          </v-col>
          <v-col
            class="px-3 py-1"
            cols="12"
            sm="9"
            md="9"
            style="text-align: center"
          >
            <l-map
              style="height: 300px; z-index: "
              :zoom="zoom"
              :center="center"
            >
              <l-tile-layer
                :url="url"
                :attribution="attribution"
              ></l-tile-layer>
              <!-- <l-marker :lat-lng="markerLatLng"></l-marker> -->
              <l-marker
                v-for="star in listMarker"
                :lat-lng="LatLng(star.latitude, star.longitude)"
                :key="star.name"
              >
                <l-popup>
                  <h4>Lahan No : {{ star.lahan_no }}</h4>
                  <h4>Petani : {{ star.nama_petani }}</h4>
                  <h4>Luas Tanam : {{ star.planting_area }} m<sup>2</sup></h4>
                  <h4>{{ star.longitude }},{{ star.latitude }}</h4>
                </l-popup>
              </l-marker>
            </l-map>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-data-table
      data-aos="fade-up"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-xl">
          <v-spacer class="d-none d-md-block"></v-spacer>
          <v-text-field
            dense
            outlined
            rounded
            color="green"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import TreesPreview from "./components/monitoring2/TreesPreview.vue";

export default {
  name: "Monitoring2",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    TreesPreview
},
  data: () => ({
    // maps setting
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 9,
    center: [-7.0667, 110.41667],
    markerLatLng: [-7.0667, 110.41667],
    listMarker: [
      {
        lahan_no: "Sol",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0667,
        latitude: 110.41667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0767,
        latitude: 110.45667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0787,
        latitude: 110.55667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0887,
        latitude: 110.65667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0967,
        latitude: 110.75667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0167,
        latitude: 110.85667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0267,
        latitude: 110.95667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0467,
        latitude: 110.15667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0567,
        latitude: 110.25667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0667,
        latitude: 110.35667,
      },
    ],
    // general setting
    authtoken: "",
    User: {},
    // snackbar
    snackbar: {
      color: '',
      show: false,
      timeout: 5000,
      text: ''
    }
  }),
  computed: {},

  async mounted() {
    this.User = this.$store.state.User
    // const taskForceEmails = this.$store.state.taskForceTeam.emails || []

    if (this.User.role_group != 'IT') {
      this.$store.state.maintenanceOverlay = true
    }
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false

    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },

  methods: {
    LatLng(lat, lng) {
      const array = [parseFloat(lat), parseFloat(lng)];
      //   console.log(array);
      return array;
    },
  },
};
</script>
