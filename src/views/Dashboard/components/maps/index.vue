<template>
  <div>
    <v-card class="rounded-xl mt-3 overflow-hidden">
      <v-card-title>
          <v-icon>mdi-map-legend</v-icon>
          <v-badge content="Develop" color="warning">Maps</v-badge>
          <v-divider class="mx-2"></v-divider>
          <small>
            {{ showMapsOptions  }}
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
          <div id="mapboxWrapper" class="overflow-hidden rounded-xl" style="position: relative;">
            <!-- popup -->
            <v-navigation-drawer
              v-model="maps.popup.model"
              floating
              absolute
              bottom
              temporary
              hide-overlay
              class="rounded-xl transparent d-flex align-stretch pa-3"
            >
              <v-card style="height: 100%;" class="rounded-xl">
                <v-card-title v-html="maps.popup.content.title">
                </v-card-title>
                <v-card-text v-html="maps.popup.content.description">
                </v-card-text>
              </v-card>
            </v-navigation-drawer>
            <!-- map -->
            <div id="mapbox" ref="mapbox" style="height: 600px;min-height: 300px;max-height: 600px;resize: vertical;" :key="maps.key" class="rounded-xl overflow-hidden"></div>
          </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import axios from "axios"

// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

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
      center: [107.52657620636666, -7.0917231719],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      legends: {
        model: ''
      },
      listMarker: [],
      loading: {
        show: false,
        text: 'Loading...'
      },
      zoom: 8,
      geojson: {},
      key: 111,
      layerId: 0,
      hoveredStateId: 0,
      layerStyle: {
        outline: {
          color: '#000000'
        },
        fill: {
          color: '#f06800'
        },
      },
      popup: {
        model: false,
        content: {
          title: '',
          description: ''
        }
      }
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
        }, 1000)
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
        return '-'
      }
    },
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
        this.maps.loading.show = true
        const options = this.maps
        this.maps.model = new mapboxgl.Map({
          container: 'mapbox', // container ID
          accessToken: this.$store.state.maps.accessToken,
          style: this.$store.state.maps.mapStyle, // style URL
          center: options.center,
          zoom: options.zoom,
          projection: 'globe'
        });
        const map = this.maps.model
        
        map.addControl(new mapboxgl.FullscreenControl());
        
        map.on('load', () => {
          // map.addSource('mapbox-dem', {
          //   'type': 'raster-dem',
          //   'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          //   'tileSize': 512,
          //   'maxzoom': 14
          // });
          // add the DEM source as a terrain layer with exaggerated height
          // map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
          map.setFog({
            color: 'rgb(186, 210, 235)', // Lower atmosphere
            'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
            'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
            'space-color': 'rgb(11, 11, 25)', // Background color
            'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
          });
          // Add zoom and rotation controls to the map.
          map.addControl(new mapboxgl.NavigationControl());
          map.flyTo({zoom: 10, duration: 12 * 1000})
        });
      } catch (err) {this.catchingError(err)} finally {
        this.maps.loading.show = false
      }
    },
    async getMapsData() {
      try {
        this.maps.loading.show = true
        this.maps.loading.text = 'Getting maps data...'
        const options = this.options;
        const user = this.user()
        const params = new URLSearchParams({
          program_year: options.programYear,
          source: options.source.model,
          province: options.province.model
        })
        if (user.ff.ff) if (user.ff.ff != '-') {
          params.set('ff', user.ff.ff.toString())
        }
        const url = this.$store.getters.getApiUrl(`GetDashboardMapData?${params}`)
        // const listLahan = await axios.get(url, this.$store.state.apiConfig).then(res => {return res.data.list})
        // this.maps.listMarker = listLahan
        // if (listLahan.length > 0) this.maps.center = [listLahan[0].latitude, listLahan[0].longitude]
        
        this.maps.loading.text = 'Getting polygon data...'
        await this.demoKMZ()
      } catch (err) {this.catchingError(err)} finally {
        this.maps.loading.show = false
        this.maps.loading.text = 'Loading...'
      }
    },
    // demo
    async demoKMZ() {
      try {
        const map = this.maps.model
        const layerStyle = this.maps.layerStyle
        const popupEl = this.maps.popup
        let layerId = this.maps.layerId
        let hoveredStateId = this.maps.hoveredStateId;

        const sourceId = this._utils.generateRandomString(5) + Date.now()
        console.log(sourceId)
        layerStyle.fill.color = this._utils.getRandomColor()

        const url = `${this.$store.state.apiUrlImage}maps/testing/Unit_Management.kml`
        var runLayer = await omnivore.kml(url).on("ready", function() {
          const GeoJsonData = runLayer.toGeoJSON()
          // console.log(GeoJsonData)
          GeoJsonData.features.map((val, i) => { 
            val.id = layerId += 1
           })
          map.on("load", function() {
            // Add a data source containing GeoJSON data.
            map.addSource(sourceId, {
              'type': 'geojson',
              'data': GeoJsonData
            });
            // Add a new layer to visualize the polygon.
            map.addLayer({
              'id': `${sourceId}-fills`,
              'type': 'fill',
              'source': sourceId, // reference the data source
              'layout': {},
              'paint': {
                'fill-color': layerStyle.fill.color, // blue color fill
                'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  0.1,
                  0.5
                ]
              }
            });
            // Add a black outline around the polygon.
            map.addLayer({
              'id': `${sourceId}-outline`,
              'type': 'line',
              'source': sourceId,
              'layout': {},
              'paint': {
                'line-color': layerStyle.outline.color,
                'line-width': 2
              }
            });
            // on click event
            map.on('click', `${sourceId}-fills`, (e) => {
              const coor = e.lngLat
              const mapZoom = map.getZoom()
              setTimeout(() => {
                popupEl.model = true;
              }, 300);
              // console.log(e)
              if (e.features.length > 0) { 
                const title = e.features[0].properties.name
                const description = e.features[0].properties.description
                setTimeout(() => {
                  popupEl.content.title = title
                  popupEl.content.description = description
                }, 300);
                map.flyTo({
                  center: [coor.lng, coor.lat],
                  zoom: mapZoom < 10 ? 10 : mapZoom,
                });
              }
            });
            // mousemove event
            map.on('mousemove', `${sourceId}-fills`, (e) => {
              const coor = e.lngLat
              if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                  map.setFeatureState(
                    { source: sourceId, id: hoveredStateId },
                    { hover: false }
                  );
                }
                hoveredStateId = e.features[0].id;
                map.setFeatureState(
                  { source: sourceId, id: hoveredStateId },
                  { hover: true }
                );
                if (hoveredStateId) {
                  map.getCanvas().style.cursor = 'pointer';
                  // popup
                  map.getCanvas().style.cursor = 'pointer';
                  // Copy coordinates array.
                  const coordinates = [coor.lng, coor.lat]
                  const description = e.features[0].properties.name;
                  // Ensure that if the map is zoomed out such that multiple
                  // copies of the feature are visible, the popup appears
                  // over the copy being pointed to.
                  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                  }
                  // Populate the popup and set its coordinates
                  // based on the feature found.
                  popup.setLngLat(coordinates).setHTML(description).addTo(map);
                }
              }
            });
            // mouseleave event
            map.on('mouseleave', `${sourceId}-fills`, () => {
              if (hoveredStateId !== null) {
                map.setFeatureState(
                  { source: sourceId, id: hoveredStateId },
                  { hover: false }
                );
              }
              hoveredStateId = null;
              map.getCanvas().style.cursor = '';
              
              popup.remove();
            });
          })
        });
      } catch (err) {this.catchingError(err)}
    },
    async getMapsDetail(properties) {
      alert(properties)
    },
    // Utilities
    catchingError(error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        this.$router.push("/");
      }
      console.log(error);
    },
  },
}
</script>