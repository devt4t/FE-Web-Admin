<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="1200"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-document-edit</v-icon></v-btn> Scoping Visit Form</span>
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text class="pa-0">
                <!-- Loading -->
                <v-overlay absolute :value="loading.show">
                    <div class="d-flex flex-column"></div>
                    <v-progress-circular
                        :size="80"
                        :width="10"
                        indeterminate
                        color="white"
                    >
                    </v-progress-circular>
                    <p class="mt-2 mb-0">{{ loading.text }}</p>
                </v-overlay>
                <!-- SELECT VILLAGE -->
                <v-row class="ma-0 mx-5">
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-city</v-icon>Lokasi & Tangal Scoping</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- Province -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="province_code"
                            :items="inputs.province.items"
                            :label="inputs.province.label"
                            :loading="inputs.province.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.province.loading ? 'Loading...' : 'No Data'"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.province.model"
                            v-on:change="getOptionsData({type: 'regency'})"
                        ></v-autocomplete>
                    </v-col>
                    <!-- Regency -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kabupaten_no"
                            :items="inputs.regency.items"
                            :label="inputs.regency.label"
                            :loading="inputs.regency.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.regency.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.regency.model"
                            v-on:change="getOptionsData({type: 'district'})"
                        ></v-autocomplete>
                    </v-col>
                    <!-- District -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_kecamatan"
                            :items="inputs.district.items"
                            :label="inputs.district.label"
                            :loading="inputs.district.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.district.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.district.model"
                            v-on:change="getOptionsData({type: 'village'})"
                        ></v-autocomplete>
                    </v-col>
                    <!-- Village -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.village.items"
                            :label="inputs.village.label"
                            :loading="inputs.village.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.village.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.village.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- Tanggal Scoping -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-menu 
                            rounded="xl"
                            transition="slide-x-transition"
                            bottom
                            min-width="100"
                            offset-y
                            :close-on-content-click="true"
                            v-model="inputs.scoping_date.show"
                        >
                            <template v-slot:activator="{ on: menu, attrs }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-text-field
                                            dense
                                            color="green"
                                            class="mb-2 mb-lg-0 mr-0 mr-lg-2"
                                            hide-details
                                            outlined
                                            label="Scoping Date"
                                            rounded
                                            v-bind="attrs"
                                            v-on="{...menu, ...tooltip}"
                                            readonly
                                            v-model="inputs.scoping_date.modelShow"
                                        ></v-text-field>
                                    </template>
                                    <span>Klik untuk memunculkan datepicker</span>
                                </v-tooltip>
                            </template>
                            <div class="rounded-xl pb-2 white">
                                <v-overlay :value="inputs.scoping_date.loading">
                                    <div class="d-flex flex-column align-center justify-center">
                                        <v-progress-circular
                                            indeterminate
                                            color="white"
                                            size="64"
                                        ></v-progress-circular>
                                        <p class="mt-2 mb-0">Updating available dates...</p>
                                    </div>
                                </v-overlay>
                                <div class="d-flex flex-column align-center rounded-xl">
                                    <v-date-picker 
                                        color="green lighten-1 rounded-xl" 
                                        v-model="inputs.scoping_date.model"
                                        min="2022-11-24"
                                    ></v-date-picker>
                                </div>
                            </div>
                        </v-menu>
                    </v-col>
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-format-columns</v-icon>Scoping Visit Form</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- land_area -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-text-field
                            dense
                            color="success"
                            hide-details
                            :label="inputs.land_area.label"
                            :disabled="false"
                            outlined
                            rounded
                            type="number"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_area.model"
                        >
                            <template v-slot:append>
                                <div class="mt-1 ml-1">
                                    m<sup>2</sup>
                                </div>
                            </template>
                        </v-text-field>
                    </v-col>
                    <!-- land_type -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            dense
                            multiple
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.land_type.items"
                            :label="inputs.land_type.label"
                            :loading="inputs.land_type.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.land_type.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_type.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- land_slope -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.land_slope.items"
                            :label="inputs.land_slope.label"
                            :loading="inputs.land_slope.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.land_slope.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_slope.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- land_height -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            suffix="mdpl"
                            :items="inputs.land_height.items"
                            :label="inputs.land_height.label"
                            :loading="inputs.land_height.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.land_height.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_height.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- vegetation_density -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.vegetation_density.items"
                            :label="inputs.vegetation_density.label"
                            :loading="inputs.vegetation_density.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.vegetation_density.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.vegetation_density.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- water_source -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.water_source.items"
                            :label="inputs.water_source.label"
                            :loading="inputs.water_source.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.water_source.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.water_source.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- rainfall -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            suffix="mm"
                            :items="inputs.rainfall.items"
                            :label="inputs.rainfall.label"
                            :loading="inputs.rainfall.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.rainfall.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.rainfall.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- agroforestry_type -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.agroforestry_type.items"
                            :label="inputs.agroforestry_type.label"
                            :loading="inputs.agroforestry_type.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.agroforestry_type.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.agroforestry_type.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- government_place -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.government_place.items"
                            :label="inputs.government_place.label"
                            :loading="inputs.government_place.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.government_place.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.government_place.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- land_coverage -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.land_coverage.items"
                            :label="inputs.land_coverage.label"
                            :loading="inputs.land_coverage.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.land_coverage.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_coverage.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- electricity_source -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.electricity_source.items"
                            :label="inputs.electricity_source.label"
                            :loading="inputs.electricity_source.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.electricity_source.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.electricity_source.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- dry_land_area -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-text-field
                            dense
                            color="success"
                            hide-details
                            :label="inputs.dry_land_area.label"
                            :disabled="false"
                            outlined
                            rounded
                            type="number"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.dry_land_area.model"
                        >
                            <template v-slot:append>
                                <div class="mt-1 ml-1">
                                    m<sup>2</sup>
                                </div>
                            </template>
                        </v-text-field>
                    </v-col>
                    <!-- POLYGON INPUTS -->
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-map-marker-path</v-icon>Upload File Polygon</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- village_polygon -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-file-input
                            color="success"
                            dense
                            hide-details
                            outlined
                            rounded
                            show-size
                            prepend-icon="mdi-vector-polygon"
                            :accept="inputs.village_polygon.accept"
                            :disabled="false"
                            :label="inputs.village_polygon.label"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.village_polygon.model"
                        ></v-file-input>
                    </v-col>
                    <!-- dry_land_polygon -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-file-input
                            color="success"
                            dense
                            hide-details
                            outlined
                            rounded
                            show-size
                            prepend-icon="mdi-vector-polygon"
                            :accept="inputs.dry_land_polygon.accept"
                            :disabled="false"
                            :label="inputs.dry_land_polygon.label"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.dry_land_polygon.model"
                        ></v-file-input>
                    </v-col>
                    <!-- critical_land_polygon -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-file-input
                            color="success"
                            dense
                            hide-details
                            outlined
                            rounded
                            show-size
                            prepend-icon="mdi-vector-polygon"
                            :accept="inputs.critical_land_polygon.accept"
                            :disabled="false"
                            :label="inputs.critical_land_polygon.label"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.critical_land_polygon.model"
                        ></v-file-input>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn 
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-200" 
                    text rounded color="red" class="pl-2">
                    <v-icon class="mr-1">mdi-close-circle</v-icon>
                    Close
                </v-btn>
                <v-divider class="mx-2"></v-divider>
                <v-btn
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-200" 
                    color="primary white--text"
                    class=""
                    rounded
                    :key="`saveButton`"
                >
                    <v-icon class="mr-1">mdi-content-save</v-icon>
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import formOptions from '@/assets/json/rraPraOptions.json'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: '0'
        },
        programYear: {
            type: String,
            default: '0'
        }
    },
    data: () => ({
        inputs: {
            program_year: {
                model: '',
                required: true
            },
            // village location inputs
            province: {
                label: 'Provinsi',
                model: '',
                items: [],
                loading: false
            },
            regency: {
                label: 'Kabupaten / Kota',
                model: '',
                items: [],
                loading: false
            },
            district: {
                label: 'Kecamatan',
                model: '',
                items: [],
                loading: false
            },
            village: {
                items: [],
                label: 'Desa',
                model: '',
                loading: false
            },
            // scoping date
            scoping_date: {
                loading: false,
                model: moment().format('Y-MM-DD'),
                modelShow: moment().format('DD MMMM Y'),
                show: false,
            },
            // scoping visit inputs
            land_area: {
                label: 'Luas Desa',
                model: '',
                loading: false
            },
            land_type: {
                items: formOptions.land_type.sort(),
                label: 'Jenis Tanah',
                model: '',
                loading: false
            },
            land_slope: {
                items: formOptions.land_slope,
                label: 'Kelerengan Tanah',
                model: '',
                loading: false
            },
            land_height: {
                items: formOptions.land_height.sort(),
                label: 'Ketinggian Tanah',
                model: '',
                loading: false
            },
            vegetation_density: {
                items: formOptions.vegetation_density.sort(),
                label: 'Kerapatan Vegetasi',
                model: '',
                loading: false
            },
            water_source: {
                items: formOptions.water_source.sort(),
                label: 'Sumber Air',
                model: '',
                loading: false
            },
            rainfall: {
                items: formOptions.rainfall.sort(),
                label: 'Curah Hujan',
                model: '',
                loading: false
            },
            agroforestry_type: {
                items: formOptions.agroforestry_type.sort(),
                label: 'Tipe Agroforestry',
                model: '',
                loading: false
            },
            government_place: {
                items: formOptions.government_place.sort(),
                label: 'Tempat Pemerintahan',
                model: '',
                loading: false
            },
            land_coverage: {
                items: formOptions.land_coverage.sort(),
                label: 'Cakupan Lahan',
                model: '',
                loading: false
            },
            electricity_source: {
                items: formOptions.electricity_source.sort(),
                label: 'Sumber Listrik',
                model: '',
                loading: false
            },
            dry_land_area: {
                label: 'Luas Lahan Kering',
                model: '',
                loading: false
            },
            village_polygon: {
                label: 'Polygon Desa *.kmz file',
                accept: '.kmz',
                model: null,
                loading: false
            },
            dry_land_polygon: {
                label: 'Polygon Lahan Kering *.kmz file',
                accept: '.kmz',
                model: null,
                loading: false
            },
            critical_land_polygon: {
                label: 'Polygon Lahan Kritis *.kmz file',
                accept: '.kmz',
                model: null,
                loading: false
            },
        },
        loading: {
            show: false,
            text: 'Loading...'
        },
        localConfig: {
            windowWidth: window.innerWidth,
            breakLayoutFrom: 1140,
        },
    }),
    watch: {
        'inputs.scoping_date.model': {
            async handler(newVal) {
                this.inputs.scoping_date.modelShow = this._utils.dateFormat(newVal, 'DD MMMM Y')
            }
        }
    },
    computed: {
        showModal: {
            get: function () {
                return this.show
            },
            set: function(newVal) {
                if (newVal) {
                    this.inputs.program_year.model = this.programYear
                    if (this.id) {
                        this.getDetailData(this.id)
                    }
                } else this.$emit('action', {type: 'close', name: 'form'})
            }
        }
    },
    async mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
        await this.getOptionsData({type: 'province'})
        await this.getDummiesData()
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
        async getOptionsData(inputs) {
            try {
                // prepare for calling api
                let url = ''
                
                // set url
                if (inputs.type == 'province') url = 'GetProvince'
                else if (inputs.type == 'regency') url = 'GetKabupaten?province_code=' + this.inputs.province.model
                else if (inputs.type == 'district') url = 'GetKecamatan?kabupaten_no=' + this.inputs.regency.model
                else if (inputs.type == 'village') url = 'GetDesa?&kode_kecamatan=' + this.inputs.district.model

                this.$store.state.loadingOverlayText = `Getting ${inputs.type} datas...`

                // reset data 
                if (inputs.type == 'regency') {
                    this.inputs.district.model = ''
                    this.inputs.district.items = []
                } if (['regency', 'district'].includes(inputs.type)) { 
                    this.inputs.village.model = ''
                    this.inputs.village.items = []
                }
                if (url != '') {
                    url = this.$store.getters.getApiUrl(url) 

                    this.inputs[inputs.type].model = ''
                    this.inputs[inputs.type].loading = true
                    
                    // calling api
                    const res = await axios.get(url, this.$store.state.apiConfig)
                    this.inputs[inputs.type].items = res.data.data.result.sort((a, b) => a.name.localeCompare(b.name))
                }
            } catch (err) {
                this.errorResponse(err)
                this.inputs[inputs.type].items = []
            } finally {
                this.$store.state.loadingOverlayText = null
                this.inputs[inputs.type].loading = false
            }
        },
        async getDummiesData() {
            try {
                const province = 'JT'
                const regency = '33'
                const district = '33.74.15'
                const village = '33.74.15.1001'
                this.inputs.province.model = province
                await this.getOptionsData({type: 'regency', id: province})
                this.inputs.regency.model = regency
                await this.getOptionsData({type: 'district', id: regency})
                this.inputs.district.model = district
                await this.getOptionsData({type: 'village', id: district})
                this.inputs.village.model = village

                this.inputs.land_area.model = 200
                this.inputs.land_type.model = ['Aluvial', 'Entisol', 'Nitosol']
            } catch (err) {
                this.errorResponse(err)
            } finally {
            }
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        }
    }
}
</script>