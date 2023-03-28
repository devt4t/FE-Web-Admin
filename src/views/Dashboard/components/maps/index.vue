<template>
  <div>
    <v-card class="rounded-xl mt-3 overflow-hidden" data-aos="fade-up" data-aos-delay="1000">
      <v-card-title>
          <v-icon>mdi-map-legend</v-icon>
          <v-badge content="Develop" color="warning">Maps</v-badge>
          <v-divider class="mx-2"></v-divider>
          <small>
            {{ showMapsOptions }}
          </small>
      </v-card-title>
      <v-card-text style="position: relative;">
          <!-- loading overlay -->
          <v-overlay v-if="maps.loading.show" justify-center align-center>
              <div class="d-flex flex-column align-center justify-center">
                  <v-progress-circular
                      :size="80"
                      :width="7"
                      indeterminate
                      color="white"
                  >
                  </v-progress-circular>
                  <p class="mb-0 text-center mt-4">{{ maps.loading.text || 'Loading...' }}</p>
              </div>
          </v-overlay>
          <!-- MAPS -->
          <l-map
            ref="map"
            :zoom="maps.zoom"
            :center="maps.center"
            class="rounded-xl"
            @zoomend="handleZoomEnd"
            @move="handleMove"
            style="min-height: 300px; z-index: 1;resize: vertical;max-height: 500px;"
          >
            <l-tile-layer
                :url="maps.url"
                :attribution="maps.attribution"
            ></l-tile-layer>
            <!-- <l-control :position="'topright'">
              <div class="legend text-center white pa-2 pb-0 rounded-lg">
                <h5>Show Data</h5>
                <v-radio-group 
                  column
                  v-model="maps.legends.model"
                  class="my-0"
                >
                  <v-radio
                    :label="`Lahan`"
                    value="lahan"
                  ></v-radio>
                </v-radio-group>
              </div>
            </l-control> -->
            <l-marker
                v-for="star in maps.listMarker"
                :lat-lng="LatLng(star.latitude, star.longitude)"
                :key="star.name"
                @click="() => showPopup(star)"
            >
              <l-icon>
                <v-btn fab x-small class="elevation-0">
                  <v-icon color="brown darken-1">mdi-land-fields</v-icon>
                </v-btn>
              </l-icon>
              <l-popup>
                <h4>Lahan No : {{ star.lahan_no }}</h4>
                <h4>FF : {{ star.ff_name }}</h4>
                <h4>Petani : {{ star.farmer_name }}</h4>
                <h4>Luas Tanam : {{ star.planting_area }} m<sup>2</sup></h4>
                <h4>{{ star.longitude }},{{ star.latitude }}</h4>
              </l-popup>
            </l-marker>
          </l-map>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon, LControl } from "vue2-leaflet";
import axios from "axios";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon,
    LControl
  },
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    maps:{
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
      center: [-7.0667, 110.41667],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      legends: {
        model: ''
      },
      listMarker: [],
      loading: {
        show: false,
        text: 'Loading...'
      },
      zoom: 9
    },
    user() {
      return this.$store.state.User
    }
  }),
  computed: {
    showMapsOptions() {
      try {
        // get maps data every options changed
        this.maps.loading.show = true
        setTimeout(() => {
          this.getMapsData()
        }, 1000);
        // set return data
        const options = this.options
        const user = this.user()
        let message = options.programYear
        if (user.ff.ff) if (user.ff.ff != '-') {
          message += ` > ${user.ff.ff.length} FF`
        } else {
          const province = options.province.options.find(prov => prov.value == options.province.model)
          message += ` > ${province.text}`
        }
        return message 
      } catch (err) {
        this.catchingError(err)
      }
    }
  },
  async mounted() {
    this.getMapsData()
  },
  methods: {
    // maps
    async getMapsData() {
      try {
        this.maps.loading.show = true
        this.maps.loading.text = 'Getting maps data...'
        const params = new URLSearchParams({
          program_year: this.options.programYear,
          source: this.options.source.model,
          province: this.options.province.model
        })
        const user = this.user()
        if (user.ff.ff) if (user.ff.ff != '-') {
          params.set('ff', user.ff.ff.toString())
        }
        const url = this.$store.getters.getApiUrl(`GetDashboardMapData?${params}`)
        const listLahan = await axios.get(url, this.$store.state.apiConfig).then(res => {return res.data.list})
        this.maps.listMarker = listLahan
        if (listLahan.length > 0) this.maps.center = [listLahan[0].latitude, listLahan[0].longitude]
      } catch (err) {this.catchingError(err)} finally {
        this.maps.loading.show = false
        this.maps.loading.text = 'Loading...'
      }
    },
    // maps utilities
    handleZoomEnd() {
      const zoomLevel = this.$refs.map.mapObject.getZoom()
      console.log(`Map Zoom: ${zoomLevel}`)
      if (zoomLevel >= 9) {
      }
    },
    handleMove() {
      const center = this.$refs.map.mapObject.getCenter()
      console.log(`Map Center: ${center}`)
    },
    LatLng(lat, lng) {
      const array = [parseFloat(lat), parseFloat(lng)];
      return array;
    },
    showPopup(data) {
      // alert(data.farmer_name || '-')
    },
    // Utilities
    catchingError(error) {
        if (error.response) {
          if (typeof error.response.status != undefined) {
              if (error.response.status == 401) {
                  localStorage.removeItem("token")
                  this.$router.push("/")
              }
          }
        }
        console.log(error)
    },
  },
}
</script>