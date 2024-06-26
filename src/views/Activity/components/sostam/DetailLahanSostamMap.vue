<template>
    <div>
      <div class="d-flex align-center mb-2">
          <p class="mb-0"><v-icon>mdi-map-marker</v-icon> Lokasi Distribusi</p>
          <v-divider class="ml-2"></v-divider>
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
                <div :id="`LahanDetailMapboxContainer${this.section}`" :ref="this.section + 'mapbox'" :key="this.section + maps.key" 
                    style="height: 300px;width: 100%!important" class="rounded-xl overflow-hidden"></div>
            </div>
        </v-card-text>
      </v-card>
    </div>
</template>
<script>
import axios from "axios"
import Swal from 'sweetalert2'

export default {
    props: {
        section: {
          type: String
        },
        long: {
            type: String,
            default: null
        },
        lat: {
          type: String,
          default: null
        },
        ff_no: {
            type: String,
            default: null
        }
    },
    data: () => ({
        maps:{
            accessToken: '',
            mapStyle: '',
            model: null,
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
            center: [107.61027079290722, -6.920020837413247],
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
    async mounted() {
        this.maps.loading.show = true
        this.maps.accessToken = this.$store.state.maps.accessToken
        this.maps.mapStyle = this.$store.state.maps.mapStyle
        await this.initializeMap()
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
        async initializeMap(layIndex) {
            try {
                const mapOptions = this.maps
                const markerCoordinates = [this.long, this.lat]
                console.log(markerCoordinates)
                mapboxgl.accessToken = mapOptions.accessToken
                if (!mapboxgl.supported()) {
                    Swal.fire({
                        title: 'Warning!',
                        text: `Your browser does not support Mapbox GL.`,
                        icon: 'error',
                        confirmButtonColor: '#f44336',
                    }) 
                } else if (markerCoordinates) {
                    mapOptions.loading.show = true
                    let layerId = mapOptions.layerId
                    const layerStyle = mapOptions.layerStyle
                    layerStyle.fill.color = this._utils.getRandomColor()
                    mapOptions.loading.text = 'Initialize map...'
                    let map = await new mapboxgl.Map({
                        container: `LahanDetailMapboxContainer${this.section}`, // container ID
                        style: mapOptions.mapStyle, // style URL
                        center: mapOptions.center,
                        zoom: mapOptions.zoom,
                        projection: 'globe'
                    });
                    await map.on("load", async function() {
                        // add fog
                        await map.setFog({
                            color: 'rgb(186, 210, 235)', // Lower atmosphere
                            'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
                            'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                            'space-color': 'rgb(11, 11, 25)', // Background color
                            'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
                        });
                        // add fullscreen function
                        await map.addControl(new mapboxgl.FullscreenControl());
                        // Add zoom and rotation controls to the map.
                        await map.addControl(new mapboxgl.NavigationControl());
                        const marker1 = new mapboxgl.Marker()
                        .setLngLat(markerCoordinates)
                        .addTo(map);
                        await map.flyTo({
                            center: markerCoordinates,
                            zoom: 9,
                            duration: 7 * 1000
                        });
                        mapOptions.loading.show = false
                    })
                }
            } catch (err) {
                this.errorResponse(err)
                this.maps.loading.show = false
            }
        },
    }
}
</script>