<template>
    <div>
      <v-card class="rounded-xl elevation-0 overflow-hidden">
        <v-card-text class="pa-0" style="position: relative;">
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
                class="overflow-hidden rounded-xl" style="position: relative;"
            >
                <!-- Toolbar -->
                <div style="position: absolute;top: 10px;left: 10px;z-index: 2;">
                    <v-menu 
                        transition="slide-y-transition"
                        bottom
                        content-class="rounded-xl"
                    >
                        <template v-slot:activator="{attrs, on}">
                            <div v-bind="attrs" v-on="on">
                                <v-btn data-aos="zoom-in" data-aos-delay="500" fab small style="position: relative;z-index: 3;"><v-icon>mdi-layers-triple</v-icon></v-btn>
                                <v-chip v-if="layers.selected !== null" :key="layers.key" data-aos="fade-right" data-aos-delay="700" class="pl-7 white--text" style="transform: translateX(-20px);z-index: 2;cursor: pointer;background-color: #00000099;">{{ layers.items[layers.selected].text || '-' }} 
                                    <v-icon class="ml-1 white--text">{{ layers.items[layers.selected].icon }}</v-icon>
                                </v-chip>
                            </div>
                        </template>
                        <v-card>
                            <v-card-text class="pa-2">
                                <v-btn v-for="(layer, layIndex) in layers.items" :key="`layer${layIndex}`" text block rounded @click="() => layers.selected = layIndex">
                                    <v-icon class="mr-1">{{ layer.icon }}</v-icon> {{ layer.text }}
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-menu>
                </div>
                <!-- map -->
                <div id="mapboxContainer" ref="mapbox" :key="maps.key" style="height: 300px;width: 100%" class="rounded-xl overflow-hidden"></div>
                <div v-if="fileNotFound" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;" class="d-flex flex-column justify-center align-center grey lighten-3">
                    <v-icon size="60">mdi-file-document-remove</v-icon>
                    File data polygon tidak ditemukan
                </div>
            </div>
        </v-card-text>
      </v-card>
    </div>
</template>
<script>
import axios from "axios"

export default {
    props: {
        data: {
            type: Object,
            default: {
                village_polygon: null,
                dry_land_polygon: null,
                critical_land_polygon: null
            }
        }
    },
    data: () => ({
        maps:{
            model: null,
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
            center: [39.826204, 21.422484],
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
        layers: {
            selected: null,
            key: 229290021,
            items: [
                {
                    key: 'village_polygon', 
                    text: 'Desa', 
                    icon: 'mdi-home',
                    url: ''
                },
                {
                    key: 'critical_land_polygon', 
                    text: 'Lahan Kritis',
                    icon: 'mdi-land-fields',
                    url: ''
                },
                {
                    key: 'dry_land_polygon', 
                    text: 'Lahan Kering',
                    icon: 'mdi-land-plots-circle',
                    url: ''
                }
            ]
        }
    }),
    async mounted() {
        if (this.showPolygonData) {}
    },
    computed: {
        showPolygonData() {
            const data = this.data
            let exists = 0
            this.layers.selected = null
            
            if (data.village_polygon) {
                exists += 1
                this.layers.items[0].url = data.village_polygon
                this.layers.selected = 0
            } else this.layers.items[0].url = null
            if (data.critical_land_polygon) {
                exists += 1
                this.layers.items[1].url = data.critical_land_polygon
                if (exists === 1) this.layers.selected = 1
            } else this.layers.items[1].url = null
            if (data.dry_land_polygon) {
                exists += 1
                this.layers.items[2].url = data.dry_land_polygon
                if (exists === 1) this.layers.selected = 2
            } else this.layers.items[2].url = null
            return exists > 0 ? true : false
        },
        fileNotFound() {
            let selected = this.layers.selected
            if (this.showPolygonData == false) return true
            if (selected !== null) if (!this.layers.items[selected].url) return true
            return false
        }
    },
    watch: {
        'layers.selected': {
            async handler(val){
                this.layers.key += 1
                if (val !== null) await this.getPolygonData(val)
            }
        }
    },
    methods: {
        errorResponse(error) {
            console.log(error)
            if (error.response) {
                if (error.response.status) {
                if (error.response.status == 401) {
                    localStorage.removeItem("token");
                    this.$router.push("/");
                }
                }
            }
        },
        // maps
        async initializeMap() {
            try {
                this.maps.loading.show = true
                const options = this.maps
                if (!this.maps.model) {
                    this.maps.model = new mapboxgl.Map({
                        container: 'mapboxContainer', // container ID
                        accessToken: this.$store.state.maps.accessToken,
                        style: this.$store.state.maps.mapStyle, // style URL
                        center: options.center,
                        zoom: options.zoom,
                        projection: 'globe'
                    });
                }
                if (this.maps.model) {
                    const map = this.maps.model
                    map.on('load', () => {
                        map.addSource('mapbox-dem', {
                            'type': 'raster-dem',
                            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                            'tileSize': 512,
                            'maxzoom': 14
                        });
                        // add the DEM source as a terrain layer with exaggerated height
                        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
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
                }
            } catch (err) {this.errorResponse(err)} finally {
                this.maps.loading.show = false
            }
        },
        async getPolygonData(layIndex) {
            try {
                this.maps.model = null
                await this.initializeMap()
                this.maps.loading.show = true
                const layers = this.layers.items
                if (layers[layIndex].url && this.maps.model) {
                    console.log(layers[layIndex].url)
                    const url = `${this.$store.state.apiUrlImage}${layers[layIndex].url}`
                    const map = this.maps.model
                    let layerId = this.maps.layerId
                    const layerStyle = this.maps.layerStyle
                    const sourceId = this._utils.generateRandomString(5) + Date.now()
                    
                    layerStyle.fill.color = this._utils.getRandomColor()
                    var runLayer = await omnivore.kml(url).on("ready", function() {
                        const GeoJsonData = runLayer.toGeoJSON()
                        GeoJsonData.features.map((val, i) => { 
                            val.id = layerId += 1
                        })
                        console.log(GeoJsonData)
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
                            // Centering view
                            var center = turf.center(GeoJsonData);
                            const centerCoordinates = center.geometry.coordinates
                            // console.log(centerCoordinates)
                            map.flyTo({
                                center: [centerCoordinates[0], centerCoordinates[1]],
                                zoom: 9,
                                duration: 15 * 1000
                            });
                        })
                    })
                } else {
                    if (layers[layIndex].url) {
                        this.layers.selected = null
                        setTimeout(() => {
                            this.layers.selected = layIndex
                        }, 100);
                    }
                }
                setTimeout(() => {
                    this.maps.loading.show = false
                }, 500);
            } catch (err) {this.errorResponse(err)}
        }
    }
}
</script>