<template>
    <v-row class="planting-soc-detail">
        <planting-soc-farmer-edit v-if="!loading" @success="getData()" :dataKey="farmerEditKey"
            :data="farmerEditData" />

        <planting-soc-farmer-create v-if="!loading" :dataKey="farmerCreateKey" :data="farmerCreateData"
            @success="getData()" />
        <v-col md="12">
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800"
                class="scooping-visit-detail-card mb-5">
                <v-card-title>
                    <v-icon large class="mr-2" @click="$router.go(-1)">mdi-arrow-left-circle</v-icon>
                    <h5 class="mb-0 pb-0">Detail Sosialisasi Tanam</h5>
                </v-card-title>

                <div class="card-body" v-if="data">

                    <v-row>
                        <v-col lg="7">
                            <div class="planting-soc-table-wrapper">
                                <table class="planting-soc-table">
                                    <tr>
                                        <td>No Sostam</td>
                                        <td>
                                            <span class="text-link d-block">#{{ data.soc_no }}</span>
                                            <span class="text-09-em">{{ data.soc_date | parse('date') }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Field Facilitator</td>
                                        <td>
                                            <span class="font-weight-400">{{ data.field_facilitator_name }}</span>
                                            <div class="d-flex flex-row">
                                                <span class="badge bg-light d-block">
                                                    {{ data.ff_no }}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Unit Management</td>
                                        <td>
                                            <span>{{ data.management_unit_name }}</span>
                                            <span class="d-block font-weight-300">{{ data.target_area_name }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Materi Pelatihan</td>
                                        <td>
                                            <span>{{ data.training_material_name }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Distribusi</td>
                                        <td>
                                            <div class="distribution-wrapper">
                                                <div class="distribution-start">
                                                    <v-icon>mdi-tanker-truck</v-icon>
                                                    <span class="d-block title">Nursery
                                                        <strong>{{ getNurseryLocation(data.nursery_location_id)
                                                            }}</strong></span>
                                                    <span class="badge bg-info distribution-seed">
                                                        <strong>{{ data.total_seed | parse('ts') }}</strong> bibit
                                                    </span>
                                                </div>

                                                <div class="distribution-progress">
                                                    <span class="line"></span>
                                                    <span class="date">{{ dateFormat(data.distribution_date, "D MMMM Y")
                                                    }}</span>
                                                </div>

                                                <div class="distribution-end">
                                                    <v-icon>mdi-map-marker-radius</v-icon>
                                                    <span class="d-block location">{{ data.distribution_location
                                                        }}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Foto Absensi</td>
                                        <td>
                                            <div class="d-flex flex-row image-list">
                                                <div class="image-item" v-if="data.absent"
                                                    @click="showLightbox(`${$_config.baseUrlUpload}/${data.absent}`, 0)"
                                                    v-bind:style="{ 'background-image': 'url(' + `${$_config.baseUrlUpload}/${data.absent}` + ')' }">
                                                </div>
                                                <div @click="showLightbox(`${$_config.baseUrlUpload}/${data.absent2}`, 0)"
                                                    class="image-item" v-if="data.absent2"
                                                    v-bind:style="{ 'background-image': 'url(' + `${$_config.baseUrlUpload}/${data.absent2}` + ')' }">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </v-col>

                        <v-col lg="5">
                            <div class="planting-soc-maps">
                                <h6 class="map-label mb-3">KOORDINAT LOKASI DISTRIBUSI</h6>

                                <div ref="mapContainer" id="mapContainer" class="map-container"
                                    style="width: 100%; height: 600px;"></div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-card>
        </v-col>

        <v-col md="12" v-if="!loading" class="d-none">
            <v-data-table :headers="headersFFDistribution" :items="farmers" :search="''"
                class="rounded-xl elevation-1 mx-3 pa-1 planting-soc-detail-farmer" :footer-props="{
                    showCurrentPage: false,
                    showFirstLastPage: false,
                }">
                <template v-slot:top>
                    <div class="geko-list-header mb-3 d-flex flex-row justify-content-between px-5 py-3 mt-1">
                        <div class="pr-5 mr-5">
                            <h4>Kalendar Distribusi</h4>
                        </div>


                    </div>
                </template>
            </v-data-table>
        </v-col>

        <v-col md="12" v-if="!loading">
            <v-data-table :headers="headers" :items="farmers" :search="''"
                class="rounded-xl elevation-1 mx-3 pa-1 planting-soc-detail-farmer" :footer-props="{
                    showCurrentPage: false,
                    showFirstLastPage: false,
                }">
                <template v-slot:top>
                    <div class="geko-list-header mb-3 d-flex flex-row justify-content-between px-5 py-3 mt-1">
                        <div class="pr-5 mr-5">
                            <h4>Petani</h4>
                        </div>

                        <div>

                            <v-btn variant="warning" v-if="$_sys.isAllowed('sosialisasi-tanam-update')"
                                @click="syncSeed()">
                                <v-icon>mdi-sync</v-icon>
                                <span>Sync Ulang Bibit</span>
                            </v-btn>

                            <v-btn variant="success" v-if="$_sys.isAllowed('sosialisasi-tanam-update')"
                                @click="openFarmerCreateModal()">
                                <v-icon>mdi-add</v-icon>
                                <span>Tambah Petani</span>
                            </v-btn>
                        </div>

                    </div>
                </template>

                <template v-slot:item.action="{ item, index }">
                    <div class="d-flex flex-col flex-column" v-if="!item.validation">
                        <v-btn v-if="$_sys.isAllowed('sosialisasi-tanam-update')" variant="warning" small
                            @click="openEditModal(item)">
                            <v-icon small>mdi-pencil</v-icon>
                            <span> Update Kehadiran</span>
                        </v-btn>
                    </div>
                </template>


                <template v-slot:item.index="{ item, index }">
                    <span>{{ index + 1 }}</span>
                </template>


                <template v-slot:item.form_no="{ item }">
                    <span class="text-link">#{{ item.form_no }}</span>
                </template>


                <template v-slot:item.farmer_no="{ item }">
                    <span class="d-block">{{ item.farmer_name }}</span>
                    <div class="d-flex flex-row">
                        <span class="badge bg-light">{{ item.farmer_no }}</span>
                    </div>
                </template>


                <template v-slot:item.lahan_no="{ item }">
                    <span class="d-block">{{ item.no_lahan }}</span>
                    <span class="badge bg-light">{{ item.no_document }}</span>
                </template>
                <template v-slot:item.planting_hole_date="{ item }">
                    <span class="d-block min-w-150px badge bg-primary">{{ dateFormat(item.planting_hole_date_start, "DD MMMM Y") }}</span>
                    <p class="text-center"> ~ </p> <span class="d-block min-w-150px badge bg-info">{{
                        dateFormat(item.planting_hole_date_end, "DD MMMM Y") }}</span>
                </template>
                <template v-slot:item.planting_date="{ item }">
                    <span class="d-block min-w-150px badge bg-primary">{{ dateFormat(item.planting_date_start, "DD MMMM Y") }}</span>
                    <p class="text-center">~ </p> <span class="d-block min-w-150px badge bg-info">{{
                        dateFormat(item.planting_date_end, "DD MMMM Y") }}</span>
                </template>
                <!-- <template v-slot:item.planting_hole_date_end="{ item }">
                    <span class="d-block"></span>
                </template> -->

                <template v-slot:item.seed_type="{ item }">
                    <div class="d-flex flex-col flex-column min-w-200px">
                        <ul class="p-0 m-0" style="padding: 0 !important">
                            <li class="seed-item d-flex flex-row align-items-center" v-for="(item, i) in item.seeds">
                                <v-icon class="text-success">mdi-tree</v-icon>
                                <span class="d-block">{{ item.tree_name }} </span>
                                <span class="d-block font-weight-bold"> : {{ item.total_seed | parse('ts') }}
                                    bibit</span>
                            </li>
                        </ul>
                    </div>
                </template>

                <template v-slot:item.seed_total="{ item }">
                    <span class="d-block min-w-100px font-weight-bold">
                        {{ item.total_seed_detail | parse('ts') }} bibit
                    </span>
                </template>

                <template v-slot:item.signature="{ item }">
                    <img v-if="item.signature" :src="`${$_config.baseUrlUpload}/${item.signature}`"
                        style="height: 30px;" />
                    <span v-else>-</span>
                </template>

                <template v-slot:item.attendance="{ item }">
                    <div class="d-flex flex-row">
                        <span class="badge" :class="{
                            'bg-success': item.attendance == 1,
                            'bg-danger': !item.attendance
                        }">{{ item.attendance ? 'Hadir' : 'Tidak Hadir' }}</span>
                    </div>
                </template>


            </v-data-table>
        </v-col>

    </v-row>
</template>


<script>
import moment from "moment";
import PlantingSocFarmerEdit from './PlantingSocFarmerEdit.vue';
import PlantingSocFarmerCreate from './PlantingSocFarmerCreate.vue';

export default {
    name: 'planting-soc-detail',
    components: {
        PlantingSocFarmerEdit,
        PlantingSocFarmerCreate
    },
    data() {
        return {
            data: null,
            ready: false,
            loading: false,
            farmers: [],
            farmerEditKey: 1,
            farmerEditData: null,
            headers: [

                {
                    text: "#",
                    key: "action",
                    value: "action",
                    class: "sticky-left",
                    sortable: false,
                },
                {
                    text: "No",
                    key: "index",
                    value: "index",
                    sortable: false,
                },
                {
                    text: "No. Form",
                    key: "form_no",
                    value: "form_no",
                    sortable: false,
                },
                {
                    text: "Petani",
                    key: "farmer_no",
                    value: "farmer_no",
                    sortable: false,
                },
                {
                    text: "Lahan",
                    key: "lahan_no",
                    value: "lahan_no",
                    sortable: false,
                },
                {
                    text: "Tanggal Penilikan Lubang",
                    key: "planting_hole_date",
                    value: "planting_hole_date",
                    sortable: false,
                },
                {
                    text: "Tanggal Penanaman",
                    key: "planting_date",
                    value: "planting_date",
                    sortable: false,
                },
                {
                    text: "Jenis Bibit",
                    key: "seed_type",
                    value: "seed_type",
                    sortable: false,
                },
                {
                    text: "Total Bibit",
                    key: "seed_total",
                    value: "seed_total",
                    sortable: false,
                },
                {
                    text: "Tanda Tangan Petani",
                    key: "signature",
                    value: "signature",
                    sortable: false,
                },
                {
                    text: "Kehadiran",
                    key: "attendance",
                    value: "attendance",
                    sortable: false,
                },
            ],
            headersFFDistribution: [

                {
                    text: "#",
                    key: "action",
                    value: "action",
                    class: "sticky-left",
                    sortable: false,
                },
                {
                    text: "No",
                    key: "index",
                    value: "index",
                    sortable: false,
                },
                {
                    text: "No. Form",
                    key: "form_no",
                    value: "form_no",
                    sortable: false,
                },
                {
                    text: "Petani",
                    key: "farmer_no",
                    value: "farmer_no",
                    sortable: false,
                },
                {
                    text: "Lahan",
                    key: "lahan_no",
                    value: "lahan_no",
                    sortable: false,
                },
                {
                    text: "Tanggal Penilikan Lubang",
                    key: "planting_hole_date",
                    value: "planting_hole_date",
                    sortable: false,
                },
                {
                    text: "Tanggal Penanaman",
                    key: "planting_date",
                    value: "planting_date",
                    sortable: false,
                },
                {
                    text: "Jenis Bibit",
                    key: "seed_type",
                    value: "seed_type",
                    sortable: false,
                },
                {
                    text: "Total Bibit",
                    key: "seed_total",
                    value: "seed_total",
                    sortable: false,
                },
                {
                    text: "Tanda Tangan Petani",
                    key: "signature",
                    value: "signature",
                    sortable: false,
                },
                {
                    text: "Kehadiran",
                    key: "attendance",
                    value: "attendance",
                    sortable: false,
                },
                {
                    id: "distribution_date",
                    label: "Waktu Distribusi",
                    methods: {
                        list: {
                            transform: "date",
                        },
                        detail: true,
                        filter: {
                            label: "Tanggal Distribusi",
                            validation: ["required"],
                            type: "daterange",
                            col_size: 6,
                            getter: "updated_at",
                            setter: "distribution_date",
                            icon: "calendar-edit",
                            main: true,
                        },
                    },
                },
            ],
            farmerCreateData: null,
            farmerCreateKey: 1,
            syncLoading: false
        }
    },
    mounted() {
        this.getData()
    },
    methods: {

        async syncSeed() {
            const isConfirmed = await this.$_alert.confirm('Sync Ulang Bibit', 'Apakah anda yakin akan melakukan sync ulang data bibit?', 'Ya', 'Tidak')
            if (!isConfirmed.isConfirmed) return

            try {
                this.syncLoading = true

                for (const farmer of this.farmers) {

                    await this.$_api.post('new-sostam/add-on/refresh-seed', {
                        form_no: farmer.form_no,
                        lahan_no: farmer.no_lahan,
                        program_year: this.$store.state.tmpProgramYear
                    })


                }
                this.$_alert.success("Data bibit berhasil di sinkron")
                this.syncLoading = false

            }

            catch {
                this.syncLoading = false
            }



        },
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs;

            if (index) this.$store.state.lightbox.index = index;
            else this.$store.state.lightbox.index = 0;

            this.$store.state.lightbox.show = true;
        },
        getNurseryLocation(nurseryLocationId) {
            const config = {
                1: 'Ciminyak',
                2: 'Soreang',
                3: 'Cirasea',
                4: 'Kebumen',
                5: 'Pati',
                6: 'SMG Testing',
                7: 'Semarang',
                8: 'Citanduy',
                9: 'Cidaun',
                10: 'Bali Barat',
            }

            try {
                return config[nurseryLocationId]
            }
            catch {
                return ''
            }
        },
        async getData() {
            try {
                if (this.loading) return;
                this.loading = true


                let response = await this.$_api.get('sostam/detail', {
                    soc_no: this.$route.query.soc_no,
                    program_year: this.$store.state.tmpProgramYear
                }).catch(() => false)

                if (!response) throw true

                let seedTotal = 0;
                for (const farmer of response.farmers.filter(d=>d.signature!=null)) {
                    seedTotal += farmer.total_seed
                    console.log(farmer.total_seed);
                }




                response.data.total_seed = seedTotal
                response.data.distribution_location = response.farmers[0].distribution_location
                response.data.distribution_coordinates = response.farmers[0].distribution_coordinates
                this.farmers = response.farmers
                console.log(this.farmers)

                const calendar = await this.$_api.get('new-sostam/detail/calendar-list', {
                    program_year: this.$store.state.tmpProgramYear,
                    nursery_location_id: response.data.nursery_location_id
                });

                console.log({ calendar })

                this.data = response.data
                this.loading = false
            }
            catch {
                this.loading = false
            }

        },


        async initializeMap() {
            mapboxgl.accessToken = this.$_config.mapBoxApi;
            let mapLatitude = -7.024947076120682
            let mapLongitude = 110.41467292861057
            try {
                let coord = this.farmers[0].distribution_coordinates;
                mapLatitude = coord.split(' ')[0]
                mapLongitude = coord.split(' ')[1]
            }
            catch { }
            this.maps = await new mapboxgl.Map({
                container: "mapContainer",
                style: this.$_config.mapBoxStyle,
                zoom: 12,
                projection: "globe",
                maxZoom: 100,
                preserveDrawingBuffer: true,
                center: [mapLongitude, mapLatitude],
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
                .setLngLat([mapLongitude, mapLatitude])
                .addTo(this.maps);
            // this.maps.on("click", (data) => {
            //     this.marker.setLngLat(data.lngLat);
            // });
        },
        openEditModal(item) {
            item.farmers_name = this.data.farmer_name
            item.field_facilitators_name = this.data.field_facilitator_name
            this.farmerEditData = item
            this.farmerEditKey += 1
        },

        openFarmerCreateModal() {
            let item = JSON.parse(JSON.stringify(this.data))
            item.farmers_name = this.data.farmer_name
            item.field_facilitators_name = this.data.field_facilitator_name
            item.ff_no = this.data.ff_no
            item.soc_no = this.data.soc_no
            this.farmerCreateData = item
            this.farmerCreateKey += 1
        },
        dateFormat(date, format) {
            return moment(date).format(format);
        },

    },
    watch: {
        data: {
            deep: true,
            handler(t) {
                if (t && !this.loading) {
                    setTimeout(() => {
                        this.initializeMap()
                    }, 2000);

                }
            }
        }
    }
}
</script>