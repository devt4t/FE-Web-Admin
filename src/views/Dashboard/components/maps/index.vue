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
          <!-- Mapbox -->
          <div id="mapbox" ref="mapbox" style="height: 600px;min-height: 300px;max-height: 600px;resize: vertical;" :key="maps.key" class="rounded-xl overflow-hidden">
          </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import axios from "axios";

export default {
  components: {},
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    maps:{
      model: null,
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
      // center: [-7.081814, 107.75086],
      center: [107.75086, -7.081814],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      legends: {
        model: ''
      },
      listMarker: [],
      loading: {
        show: false,
        text: 'Loading...'
      },
      zoom: 10,
      geojson: {},
      key: 111
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
        if (user.ff.ff) if (user.ff.ff != '-') if (user.ff.ff.length > 0) {
          message += ` > ${user.ff.ff.length} FF`
        } else {
          const province = options.province.options.find(prov => prov.value == options.province.model)
          message += ` > ${province.text}`
        }
        return message 
      } catch (err) {
        this.catchingError(err)
      }
    },
    // geojson
    geoJsonOptions() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
    geoJsonStyleFunction() {
      const fillColor = '#00ff0022'; // important! need touch fillColor in computed for re-calculate when change fillColor
      return () => {
        return {
          weight: 2,
          color: "#0f0",
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: 1
        };
      };
    },
    onEachFeatureFunction() {
      // if (!this.enableTooltip) {
      //   return () => {};
      // }
      return (feature, layer) => {
        layer.bindTooltip(
            "<div>" +
            feature.properties.name +
            "</div>",
          { permanent: false, sticky: true }
        );
      };
    }
  },
  created() {
  },
  async mounted() {
    await this.initializeMap()
    await this.getMapsData()
  },
  methods: {
    // maps
    async initializeMap() {
      try {
        const options = this.maps
        this.maps.model = new mapboxgl.Map({
          container: 'mapbox', // container ID
          accessToken: this.$store.state.maps.accessToken,
          style: this.$store.state.maps.mapStyle, // style URL
          center: options.center,
          zoom: options.zoom,
          projection: 'globe'
        });
        this.maps.model.on('style.load', () => {
          this.maps.model.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });
          // add the DEM source as a terrain layer with exaggerated height
          this.maps.model.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
          this.maps.model.setFog({
            color: 'rgb(186, 210, 235)', // Lower atmosphere
            'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
            'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
            'space-color': 'rgb(11, 11, 25)', // Background color
            'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
          });
        });
      } catch (err) {this.catchingError(err)}
    },
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
        // const listLahan = await axios.get(url, this.$store.state.apiConfig).then(res => {return res.data.list})
        // this.maps.listMarker = listLahan
        // if (listLahan.length > 0) this.maps.center = [listLahan[0].latitude, listLahan[0].longitude]
        
        this.maps.loading.text = 'Getting polygon data...'
        // const geojsonUrl = "https://rawgit.com/gregoiredavid/france-geojson/master/regions/pays-de-la-loire/communes-pays-de-la-loire.geojson"
        // const geojsonUrl = "https://t4tadmin.kolaborasikproject.com/geojson/nor2.geojson"
        // // const geojsonUrl = "https://t4tadmin.kolaborasikproject.com/geojson/reals/SubDAS.geojson"
        // // const geojsonUrl = "https://t4tadmin.kolaborasikproject.com/geojson/reals/MU-Ciminyak-1.geojson"
        // const response = await fetch(geojsonUrl)
        // const data = await response.json();
        // // console.log(data)
        // this.maps.geojson = data;
        
        await this.demoGeoJson()
        // await this.demoKMZ()
      } catch (err) {this.catchingError(err)} finally {
        this.maps.loading.show = false
        this.maps.loading.text = 'Loading...'
      }
    },
    // demo
    async demoGeoJson() {
      try {
        const map = this.maps.model
        // const geojsonUrl = "https://t4tadmin.kolaborasikproject.com/geojson/nor2.geojson"
        const geojsonUrl = "https://t4tadmin.kolaborasikproject.com/geojson/reals/MU-Ciminyak-1.geojson"
        // const geojsonUrl = "https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson"
        const responseJson = await fetch(geojsonUrl)
        const dataJson = await responseJson.json();
        let code_id = 0
        await dataJson.features.map(val => {
          val.id = code_id += 1
        })
        console.log(dataJson)
        let hoveredStateId = null;
        
        // Add a data source containing GeoJSON data.
        await map.addSource('maine', {
          'type': 'geojson',
          'data': dataJson
        });
        // await map.flyTo({ center: [-100.486052, 37.830348]})
          
          // Add a new layer to visualize the polygon.
          await map.addLayer({
            'id': 'maine-fills',
            'type': 'fill',
            'source': 'maine', // reference the data source
            'layout': {},
            'paint': {
              'fill-color': '#0080ff', // blue color fill
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
              ]
            }
          });
          
          // Add a black outline around the polygon.
          await map.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'maine',
            'layout': {},
            'paint': {
              'line-color': '#000',
              'line-width': 2
              }
            });
              // Center the map on the coordinates of any clicked circle from the 'circle' layer.
              map.on('click', 'maine-fills', (e) => {
                const coor = e.lngLat
                console.log(coor)
                map.flyTo({
                  center: [coor.lng, coor.lat],
                  zoom: 10
                });
              });
            // When the user moves their mouse over the state-fill layer, we'll update the
            // feature state for the feature under the mouse.
            map.on('mousemove', 'maine-fills', (e) => {
              if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                  map.setFeatureState(
                    { source: 'maine', id: hoveredStateId },
                    { hover: false }
                  );
                }
                hoveredStateId = e.features[0].id;
                map.setFeatureState(
                  { source: 'maine', id: hoveredStateId },
                  { hover: true }
                );
                if (hoveredStateId) map.getCanvas().style.cursor = 'pointer';
              }
            });
            
            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
            map.on('mouseleave', 'maine-fills', () => {
              if (hoveredStateId !== null) {
                map.setFeatureState(
                  { source: 'maine', id: hoveredStateId },
                  { hover: false }
                );
              }
              hoveredStateId = null;
              map.getCanvas().style.cursor = '';
            });
      } catch (err) {this.catchingError(err)}
    },
    async demoKMZ() {
      try {
        const map = this.maps.model
        const url = "https://t4tadmin.kolaborasikproject.com/maps/testing/SUB-DAS.kml"
        // var tj = require('togeojson')
        //     DOMParser = require('xmldom').DOMParser;
        // var kml = new DOMParser().parseFromString(fs.readFileSync(url, 'utf8'));
        const kml = await axios.get(url).then(res => {return res.data})
        console.log(kml)
        console.log(omnivore.kml(kml))
        // var converted = togeojson.kml(kml);
        // console.log(converted)
        // var convertedWithStyles = tj.kml(kml, { styles: true });

      } catch (err) {this.catchingError(err)}
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