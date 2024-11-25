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

                        <!-- <tr>
                            <td>Realisasi Tanam</td>
                            <td>
                                <span>{{ dateFormat(data.planting_date_start, "DD MMMM Y")}} - {{
                                    dateFormat(data.planting_date_end, "DD MMMM Y")}}</span>
                            </td>
                        </tr> -->
                        <tr>
                            <td>Distribusi</td>
                            <td>
                                <div class="distribution-wrapper">
                                    <div class="distribution-start">
                                        <v-icon>mdi-tanker-truck</v-icon>
                                        <span class="d-block title">Nursery
                                            {{ getNurseryLocation(data.nursery_location_id) }}</span>
                                        <span class="d-block distribution-seed">
                                            {{ data.total_seed | parse('ts') }} bibit
                                        </span>
                                    </div>

                                    <div class="distribution-progress">
                                        <span class="line"></span>
                                        <span class="date">{{ dateFormat(data.distribution_date, "dddd, DD MMMM Y")
                                            }}</span>
                                    </div>

                                    <div class="distribution-end">
                                        <v-icon>mdi-map-marker-radius</v-icon>
                                        <span class="d-block location">{{ data.distribution_location }}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Foto Absensi</td>
                            <td>
                                <div class="d-flex flex-row image-list">
                                    <div class="image-item" v-if="data.absent"
                                        v-bind:style="{ 'background-image': 'url(' + `${$_config.baseUrlUpload}/${data.absent}` + ')' }">
                                    </div>
                                    <div class="image-item" v-if="data.absent2"
                                        v-bind:style="{ 'background-image': 'url(' + `${$_config.baseUrlUpload}/${data.absent}` + ')' }">
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </v-card>
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

                        <v-btn variant="success" @click="openFarmerCreateModal()">
                            <v-icon>mdi-add</v-icon>
                            <span>Tambah Petani</span>
                        </v-btn>

                    </div>
                </template>

                <template v-slot:item.action="{ item, index }">
                    <div class="d-flex flex-col flex-column">
                        <v-btn variant="warning" small @click="openEditModal(item)">
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
                        {{ item.total_seed | parse('ts') }} bibit
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
            farmerCreateData: null,
            farmerCreateKey: 1
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
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
                6: 'SMG Testing'
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
                for (const farmer of response.farmers) {
                    seedTotal += farmer.total_seed
                }

                response.data.total_seed = seedTotal
                response.data.distribution_location = response.farmers[0].distribution_location
                response.data.distribution_coordinates = response.farmers[0].distribution_coordinates
                this.farmers = response.farmers
                this.data = response.data
                this.loading = false

            }
            catch {
                this.loading = false
            }

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

    }
}
</script>