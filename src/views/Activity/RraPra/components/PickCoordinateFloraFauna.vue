<template>
    <div>
        <v-dialog v-model="showModalPickCoordinate" content-class="rounded-xl mx-1" max-width="700" scrollable
            persistent>
            <v-card>
                <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                    <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon
                                color="grey darken-3">mdi-map-marker</v-icon></v-btn> Ambil Koordinat Lokasi
                        Habitat</span>
                    <v-icon color="white" class="ml-auto"
                        @click="showModalPickCoordinate = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text class="pa-2">
                    <!-- map -->
                    <div style="position: relative" v-if="showModalPickCoordinate">
                        <!-- loading overlay -->
                        <v-overlay v-if="maps.loading.show" absolute justify-center align-center class="rounded-xl">
                            <div class="d-flex flex-column align-center justify-center">
                                <v-progress-circular :size="80" :width="7" indeterminate color="white">
                                </v-progress-circular>
                                <p class="mb-0 text-center mt-4">{{ maps.loading.text || 'Loading...' }}</p>
                            </div>
                        </v-overlay>
                        <div id="mapboxPickCoordinateHabitatLocation" ref="mapbox-pick-coordinate-habitat-location"
                            :key="`maps-pick-coordinat-habitat-location-${showModalPickCoordinate}`"
                            style="height: 400px;width: 100%" class="rounded-xl overflow-hidden"></div>
                    </div>

                    <v-text-field color="green" dense outlined rounded :value="getLongLatData"
                        :disabled="maps.loading.show" label="Koordinat Distribusi (Long, Lat)"
                        :rules="[(v) => !!v || 'Field is required']" hide-details :readonly="false"
                        class="mt-3"></v-text-field>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn :disabled="this.maps.loading.show" rounded outlined color="green"
                        @click="saveCoordinate()"><v-icon>mdi-map-marker-check</v-icon> Simpan Titik Lokasi</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default: null
        },
    },
    data: () => ({
        maps: {
            accessToken: '',
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
            center: [113.921300, -0.789300],
            geojson: {},
            hoveredStateId: 0,
            key: 111,
            layerId: 0,
            layerStyle: {
                outline: {
                    color: '#000000'
                },
                fill: {
                    color: '#f06800'
                },
            },
            legends: {
                model: ''
            },
            listMarker: [],
            loading: {
                show: false,
                text: 'Loading...'
            },
            location: { lng: '', lat: '' },
            mapStyle: '',
            model: null,
            popup: {
                model: false,
                content: {
                    title: '',
                    description: ''
                }
            },
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 3,
        },
    }),
    methods: {
        async initializeMaps() {
            try {
                let mapOptions = this.maps
                mapOptions.loading.show = true
                mapOptions.loading.text = 'Initialize maps...'
                mapOptions.accessToken = this.$store.state.maps.accessToken
                mapboxgl.accessToken = mapOptions.accessToken
                const existingData = this.data.model
                if (existingData) {
                    const lng = existingData.split(', ')[0]
                    const lat = existingData.split(', ')[1]
                    mapOptions.center = [lng, lat]
                } else mapOptions.center = [113.921300, -0.789300]

                if (!mapboxgl.supported()) {
                    Swal.fire({
                        title: 'Warning!',
                        text: `Your browser does not support Mapbox GL.`,
                        icon: 'error',
                        confirmButtonColor: '#f44336',
                    })
                } else {
                    let map = await new mapboxgl.Map({
                        container: 'mapboxPickCoordinateHabitatLocation', // container ID
                        style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
                        center: mapOptions.center,
                        zoom: mapOptions.zoom,
                        projection: 'globe'
                        // projection: 'equirectangular'
                    });
                    // set geolocate for get current user location
                    const geolocate = new mapboxgl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true
                        },
                        // When active the map will receive updates to the device's location as it changes.
                        trackUserLocation: true,
                        // Draw an arrow next to the location dot to indicate which direction the device is heading.
                        showUserHeading: true
                    })
                    // Map on Load
                    await map.on("load", async function () {
                        // add fog
                        await map.setFog({
                            color: 'rgb(186, 210, 235)', // Lower atmosphere
                            'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
                            'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                            'space-color': 'rgb(11, 11, 25)', // Background color
                            'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
                        });
                        // Add Geocoder
                        map.addControl(
                            new MapboxGeocoder({
                                accessToken: mapboxgl.accessToken,
                                mapboxgl: mapboxgl
                            })
                        );
                        // add fullscreen function
                        await map.addControl(new mapboxgl.FullscreenControl());
                        // Add zoom and rotation controls to the map.
                        await map.addControl(new mapboxgl.NavigationControl());
                        // Add geolocate control to the map.
                        await map.addControl(geolocate);
                        mapOptions.location = { lng: mapOptions.center[0], lat: mapOptions.center[1] }
                        // set marker
                        const marker = new mapboxgl.Marker({
                            draggable: true
                        })
                            .setLngLat(mapOptions.center)
                            .addTo(map);
                        // Map on click
                        map.on('click', (e) => {
                            marker.setLngLat(e.lngLat)
                            showMarkerLngLat()
                        })
                        // show coordinates marker
                        // const coordinates = document.getElementById('coordinates');
                        function showMarkerLngLat() {
                            const lngLat = marker.getLngLat();
                            mapOptions.location = lngLat
                            // coordinates.style.display = 'block';
                            // coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
                        }
                        // geolocate event
                        geolocate.on('trackuserlocationstart', () => {
                            mapOptions.loading.show = true
                            mapOptions.loading.text = 'Mencari lokasi anda...'
                        });
                        geolocate.on('geolocate', async function (currentPosition) {
                            const lngLatCP = [currentPosition.coords.longitude, currentPosition.coords.latitude]
                            await marker.setLngLat(lngLatCP)
                            await showMarkerLngLat()
                            mapOptions.loading.show = false
                            mapOptions.loading.text = 'Loading...'
                        });
                        if (existingData) {
                            await map.flyTo({
                                center: mapOptions.center,
                                zoom: 15,
                                duration: 4 * 1000
                            })
                        }

                        mapOptions.loading.show = false
                    })
                }
            } catch (err) { console.log(err) } finally {
            }
        },
        async saveCoordinate() {
            const lngLat = this.maps.location
            this.$emit('action', { type: 'save', name: 'pick_coordinate', data: this.data, coordinate: lngLat })
        }
    },
    computed: {
        showModalPickCoordinate: {
            get: function () {
                if (this.show) {
                    this.maps.loading.show = true
                    setTimeout(() => {
                        this.initializeMaps()
                    }, 200);
                }
                return this.show
            },
            set: function (newVal) {
                if (newVal) {
                } else this.$emit('action', { type: 'close', name: 'pick_coordinate' })
            }
        },
        getLongLatData() {
            const maps = this.maps
            return `${maps.location.lng}, ${maps.location.lat}`
        }
    },
    mounted() {
    },
};
</script>