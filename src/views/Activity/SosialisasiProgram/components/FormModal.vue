<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="1200"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-account-heart</v-icon></v-btn> Form Minat Petani</span>
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
                            <p class="mb-0"><v-icon class="mr-2">mdi-city</v-icon>Lokasi Desa</p>
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
import formOptions from './JSON/FormOptions.json'

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
            address: {
                label: 'Address',
                model: '',
                loading: false
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
                items: formOptions.land_slope.sort(),
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
                model: '',
                loading: false
            },
            dry_land_polygon: {
                label: 'Polygon Lahan Kering *.kmz file',
                accept: '.kmz',
                model: '',
                loading: false
            },
            critical_land_polygon: {
                label: 'Polygon Lahan Kritis *.kmz file',
                accept: '.kmz',
                model: '',
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
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
        this.getOptionsData({type: 'province'})
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
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        }
    }
}
</script>