<template>
  <v-card class="rounded-xl mt-4">
    <v-card-text class="pb-1">
      <div class="d-flex align-center mb-2">
          <v-badge content="Develop" color="warning"><v-icon>mdi-map</v-icon> Peta </v-badge>
          <v-divider class="ml-2"></v-divider>
          <v-autocomplete
            dense
            color="success"
            hide-details
            item-color="success"
            class="ml-2"
            :items="map_type.items"
            :label="map_type.label"
            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
            outlined
            rounded
            v-model="map_type.model"
            style="max-width: 250px;"
          ></v-autocomplete>
      </div>
      <v-card class="rounded-xl elevation-0 overflow-hidden mb-4" style="width: 100%">
        <v-card-text class="pa-0" style="position: relative;width: 100%">
            <!-- loading overlay -->
            <v-overlay v-if="maps.loading.show" absolute justify-center align-center>
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
            <div id="mapboxWrapper"
                data-aos="fade-down"
                class="overflow-hidden rounded-xl" style="position: relative;width: 100%"
            >
                <!-- map -->
                <div :id="`DashboardMapboxContainer`" :ref="'DashboardMapbox'" :key="'DashboardMap' + maps.key" 
                    style="height: 500px;width: 100%!important" class="rounded-xl overflow-hidden"></div>
            </div>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>
<script>
import axios from "axios"
import Swal from 'sweetalert2'

export default {
  data: () => ({
      map_type: {
        items: [
          'Wilayah Target',
          'Contoh Lahan'
        ],
        label: 'Data Map',
        model: 'Wilayah Target',
      },
      maps:{
          accessToken: '',
          mapStyle: '',
          model: null,
          attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
          center: [113.921300, -0.789300],
          // center: [39.826204, 21.422484],
          // center: [107.52657620636666, -7.0917231719],
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          legends: {
              model: ''
          },
          listMarker: [],
          loading: {
              show: false,
              text: 'Loading...'
          },
          zoom: 3,
          geojson: {},
          key: 9292183,
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
  }),
  watch: {
    'map_type.model': {
      async handler(val) {
        if (val == 'Wilayah Target') await this.initializeMapPolygon()
        if (val == 'Contoh Lahan') await this.initializeMapLahan()
      }
    }
  },
  async mounted() {
      this.maps.accessToken = this.$store.state.maps.accessToken
      this.maps.mapStyle = this.$store.state.maps.mapStyle
      await this.initializeMapPolygon()
      // this.map_type.model = 'Contoh Lahan'
      // await this.initializeMapLahan()
  },
  methods: {
      errorResponse(error) {
          console.log(error)
          if (error.response) {
              if (error.response.status) {
                  if (error.response.status == 401) {
                      localStorage.removeItem("token");
                      this.$router.push("/");
                  } else Swal.fire({
                      title: 'Error!',
                      text: `${error.response.message}`,
                      icon: 'error',
                      confirmButtonColor: '#f44336',
                  }) 
              } else Swal.fire({
                  title: 'Error!',
                  text: `${error.message}`,
                  icon: 'error',
                  confirmButtonColor: '#f44336',
              }) 
          }
      },
      // maps
      async initializeMapPolygon() {
          try {
              const mapOptions = this.maps
              mapOptions.loading.show = true
              // const markerCoordinates = [this.long, this.lat]
              mapboxgl.accessToken = mapOptions.accessToken
              if (!mapboxgl.supported()) {
                  Swal.fire({
                      title: 'Warning!',
                      text: `Your browser does not support Mapbox GL.`,
                      icon: 'error',
                      confirmButtonColor: '#f44336',
                  }) 
              } else if (true) {
                  mapOptions.loading.show = true
                  const layerStyle = mapOptions.layerStyle
                  const sourceId = this._utils.generateRandomString(5) + Date.now()
                  
                  let layerId = mapOptions.layerId
                  let hoveredStateId = this.maps.hoveredStateId;
                  layerStyle.fill.color = this._utils.getRandomColor()
                  mapOptions.loading.text = 'Getting polygon data...'
                  var runLayer = await omnivore.kml(`${this.$store.state.apiUrlImage}maps/testing/Unit_Management.kml`).on("ready", async function() {
                      const GeoJsonData = await runLayer.toGeoJSON()
                      await GeoJsonData.features.map((val, i) => { 
                          val.id = layerId += 1
                      })
                      // console.log(GeoJsonData)
                      if (GeoJsonData.features.length === 0) { 
                          mapOptions.loading.show = await false
                          await Swal.fire({
                              title: 'Error!',
                              text: `Polygon Features is 0.`,
                              icon: 'error',
                              confirmButtonColor: '#f44336',
                          }) 
                      } else {
                          mapOptions.loading.text = 'Initialize map...'
                          let map = await new mapboxgl.Map({
                              container: 'DashboardMapboxContainer', // container ID
                              style: mapOptions.mapStyle, // style URL
                              center: mapOptions.center,
                              zoom: mapOptions.zoom,
                              projection: 'globe'
                              // projection: 'equirectangular'
                          });
                          // console.log('map')
                          // disable map rotation using right click + drag
                          await map.dragRotate.disable();
                          // disable map rotation using touch rotation gesture
                          await map.touchZoomRotate.disableRotation();
                          // add fullscreen function
                          await map.addControl(new mapboxgl.FullscreenControl());
                          await map.on("load", async function() {
                              // add fog
                              await map.setFog({
                                  color: 'rgb(186, 210, 235)', // Lower atmosphere
                                  'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
                                  'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                                  'space-color': 'rgb(11, 11, 25)', // Background color
                                  'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
                              });
                              // Add zoom and rotation controls to the map.
                              await map.addControl(new mapboxgl.NavigationControl());
                              // Add a data source containing GeoJSON data.
                              await map.addSource(sourceId, {
                                  'type': 'geojson',
                                  'data': GeoJsonData
                              });
                              // Add a new layer to visualize the polygon.
                              await map.addLayer({
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
                              await map.addLayer({
                                  'id': `${sourceId}-outline`,
                                  'type': 'line',
                                  'source': sourceId,
                                  'layout': {},
                                  'paint': {
                                      'line-color': layerStyle.outline.color,
                                      'line-width': 2
                                  }
                              });
                              // Centering view
                              var center = turf.center(GeoJsonData);
                              const centerCoordinates = center.geometry.coordinates
                              // console.log(centerCoordinates)
                              await map.flyTo({
                                  center: [centerCoordinates[0], centerCoordinates[1]],
                                  zoom: 9,
                                  duration: 7 * 1000
                              });
                              const popup =  new mapboxgl.Popup({
                                closeButton: false,
                                closeOnClick: false
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
                      }
                  })
              }
          } catch (err) {this.errorResponse(err)} finally {
              this.maps.loading.show = false
          }
      },
      async initializeMapLahan() {
          try {
              let utils = this._utils
              let mapOptions = this.maps
              mapOptions.loading.show = true
              mapOptions.loading.text = 'Mengambil data lahan...'
              // const markerCoordinates = [this.long, this.lat]
              const resLahans = await axios.get(this.$store.getters.getApiUrl(`GetLahanAllAdmin?program_year=2022&typegetdata=all`), this.$store.state.apiConfig)
              let lahans = resLahans.data.data.result.data
              const randomSliceStart = Math.floor(Math.random() * (lahans.length - 50));
              lahans = lahans.slice(randomSliceStart, randomSliceStart + 50).map(val => {
                return {
                  ...val, 
                  long: val.location.split(' ')[1],
                  lat: val.location.split(' ')[0],
                }
              })
              console.log(lahans)
              mapboxgl.accessToken = mapOptions.accessToken
              if (!mapboxgl.supported()) {
                  Swal.fire({
                      title: 'Warning!',
                      text: `Your browser does not support Mapbox GL.`,
                      icon: 'error',
                      confirmButtonColor: '#f44336',
                  }) 
              } else if (true) {
                  mapOptions.loading.show = true
                  const layerStyle = mapOptions.layerStyle
                  const sourceId = this._utils.generateRandomString(5) + Date.now()
                  
                  layerStyle.fill.color = this._utils.getRandomColor()
                  mapOptions.loading.text = 'Getting polygon data...'
                  mapOptions.loading.text = 'Initialize map...'
                  let map = await new mapboxgl.Map({
                      container: 'DashboardMapboxContainer', // container ID
                      style: mapOptions.mapStyle, // style URL
                      center: mapOptions.center,
                      zoom: mapOptions.zoom,
                      projection: 'globe'
                      // projection: 'equirectangular'
                  });
                  // console.log('map')
                  await map.doubleClickZoom.disable()
                  // disable map rotation using right click + drag
                  await map.dragRotate.disable();
                  // disable map rotation using touch rotation gesture
                  await map.touchZoomRotate.disableRotation();
                  // add fullscreen function
                  await map.addControl(new mapboxgl.FullscreenControl());
                  await map.on("load", async function() {
                      // add fog
                      await map.setFog({
                          color: 'rgb(186, 210, 235)', // Lower atmosphere
                          'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
                          'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                          'space-color': 'rgb(11, 11, 25)', // Background color
                          'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
                      });
                      // Add zoom and rotation controls to the map.
                      await map.addControl(new mapboxgl.NavigationControl());
                      mapOptions.loading.show = await false
                      let marker = []
                      for (let lmarkerIndex = 0; lmarkerIndex < lahans.length; lmarkerIndex++) {
                        const markerCoordinates = [lahans[lmarkerIndex].long, lahans[lmarkerIndex].lat]
                        const popupContent = `
                            <table>
                                <tr>
                                    <td>Desa</td>
                                    <td>:</td>
                                    <td>${ lahans[lmarkerIndex].desa || '-' }</td>    
                                </tr>
                                <tr>
                                    <td>Petani</td>
                                    <td>:</td>
                                    <td>${ lahans[lmarkerIndex].petani || '-' }</td>    
                                </tr>
                                <tr>
                                    <td>Luas Lahan</td>
                                    <td>:</td>
                                    <td>${ utils.numberFormat(lahans[lmarkerIndex].luas_lahan) } m<sup>2</sup></td>    
                                </tr>
                                <tr>
                                    <td>Tipe Lahan</td>
                                    <td>:</td>
                                    <td>${ lahans[lmarkerIndex].lahan_type || '-' }</td>    
                                </tr>
                            </table>`
                        marker[lmarkerIndex] = new mapboxgl.Marker()
                        .setLngLat(markerCoordinates)
                        .setPopup(new mapboxgl.Popup().setHTML(popupContent))
                        .addTo(map);
                        marker[lmarkerIndex].getElement().addEventListener('dblclick', () => {
                          map.flyTo({
                            center: markerCoordinates,
                            zoom: 15,
                            duration: 3 * 1000
                          });
                        });
                      }
                  })
                  await map.flyTo({
                      center: [108.909203, -7.143859],
                      zoom: 6,
                      duration: 7 * 1000
                  });
              }
          } catch (err) {
            this.map_type.model = 'Wilayah Target'
            this.errorResponse(err)
          } finally {
              this.maps.loading.show = false
          }
      },
  }
}
</script>