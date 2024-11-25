<template>

    <v-dialog v-model="isOpen" width="75%">
        <template v-slot:default="{ isActive }" v-if="formData">
            <v-card>
                <v-card-title class="text-center"> Perbarui Koordinat Distribusi Sostam </v-card-title>
                <v-card-text>

                    <div v-if="maps">
                        <div class="geko-input" style="width: 100%; height: 70vh">
                            <div ref="mapContainer" id="mapContainer" class="map-container"
                                style="width: 100%; height: 70vh;"></div>
                        </div>

                        <div class="d-flex flex-row justify-content-center mt-3">
                            <v-btn variant="light" @click="isOpen = false">Batal</v-btn>
                            <v-btn variant="warning" @click="onSubmit">
                                <v-icon>mdi-maps</v-icon>
                                <span class="ml-1">Perbarui Koordinat</span>
                            </v-btn>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>

</template>

<script>
export default {
    name: 'planting-soc-farmer-edit',
    data() {
        return {
            isOpen: false,
            formData: null,
            loading: false,
            marker: null,

            maps: {
                center: [113.9213, -0.7893],
                zoom: 3,
                geojson: {},
                key: 111,
                layerId: 0,
                hoveredStateId: 0,
                layerStyle: {
                    outline: {
                        color: "#000000",
                    },
                    fill: {
                        color: "#f06800",
                    },
                },
                popup: {
                    model: false,
                    content: {
                        title: "",
                        description: "",
                    },
                },
            },
        }
    },
    props: {
        dataKey: {
            required: true,
            type: Number,
        },
        data: {
            required: false,
            default: null
        }
    },

    mounted() {

    },

    methods: {
        async onOpen() {
            try {

                this.isOpen = true;
                this.formData = this.data

                const farmerSample = await this.$_api.get('sostam/period/detail', {
                    limit: 1,
                    offset: 0,
                    ff_no: this.data.ff_no,
                    soc_no: this.data.soc_no,
                    program_year: this.$_config.programYear.model
                })
                    .catch(() => false)

                if (!farmerSample) throw "Data sostam tidak ditemukan"
                console.log('farmer', farmerSample);

                const distributionLocation = farmerSample.data.distribution_location
                const distributionCoordinate = farmerSample.data.distribution_coordinates ? farmerSample.data.distribution_coordinates.split(' ') : '110.41467292861057 -7.024947076120682'

                this.$set(this.formData, 'distribution_location', distributionLocation)
                this.$set(this.formData, 'latitude', parseFloat(distributionCoordinate[1]))
                this.$set(this.formData, 'longitude', parseFloat(distributionCoordinate[0]))

                this.initializeMap();
                this.loading = false

            }

            catch (err) {
                console.log('err', err);

                let errMessage = typeof err === 'string' ? err : 'An error occured'
                this.$_alert.error(errMessage)
            }


        },


        async initializeMap() {
            mapboxgl.accessToken = this.$_config.mapBoxApi;
            this.maps = await new mapboxgl.Map({
                container: "mapContainer",
                style: this.$_config.mapBoxStyle,
                zoom: 12,
                projection: "globe",
                maxZoom: 100,
                preserveDrawingBuffer: true,
                center: [this.formData.latitude || 110.41467292861057, this.formData.longitude || -7.024947076120682],
            });

            const geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
                showUserHeading: true,
            });
            await this.maps.dragRotate.disable();
            await this.maps.touchZoomRotate.disableRotation();
            await this.maps.addControl(new mapboxgl.FullscreenControl());
            await this.maps.addControl(new mapboxgl.NavigationControl());
            await this.maps.addControl(geolocate);

            this.marker = new mapboxgl.Marker({ color: "red", anchor: "center" })
                .setLngLat([this.formData.latitude, this.formData.longitude])
                .addTo(this.maps);
            this.maps.setCenter([this.formData.latitude, this.formData.longitude]);
            this.maps.on("click", (data) => {
                this.marker.setLngLat(data.lngLat);
            });
        },
        async onSubmit() {
            if (this.loading) return
            try {
                const updatePayload = {
                    distribution_location: this.formData.distribution_location,
                    distribution_coordinates: `${this.marker._lngLat.lat} ${this.marker._lngLat.lng}`,
                    soc_no: this.formData.soc_no
                }
                this.loading = true
                const updating = await this.$_api.post('sostam/coordinate/update', updatePayload)
                    .catch(() => false)

                if (!updating) {
                    throw "err"
                }

                this.$_alert.success("Koordinat data sostam berhasil diperbarui")
                this.$emit('success', true)
                this.isOpen = false
                this.formData = null
                this.loading = false
            }

            catch (err) {
                this.loading = false

            }
        }
    },


    watch: {
        dataKey(t) {
            if (t > 1) {
                this.onOpen()
            }
        },
    },
}
</script>