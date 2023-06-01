<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="777"
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
                    <div class="d-flex flex-column justify-center align-center">
                        <v-progress-circular
                            :size="80"
                            :width="10"
                            indeterminate
                            color="white"
                        >
                        </v-progress-circular>
                        <p class="mt-2 mb-0">{{ loading.text }}</p>
                    </div>
                </v-overlay>
                <!-- SELECT VILLAGE -->
                <v-row class="ma-0 mx-5">
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0" style="font-size: 17px"><v-icon class="mr-2">mdi-city</v-icon>Lokasi Desa</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- Province -->
                    <v-col cols="12" sm="12" md="6" lg="6">
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
                    <v-col cols="12" sm="12" md="6" lg="6">
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
                    <v-col cols="12" sm="12" md="6" lg="6">
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
                    <v-col cols="12" sm="12" md="6" lg="6">
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
                <v-row class="ma-0 mx-lg-5">
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0" style="font-size: 17px"><v-icon class="mr-2">mdi-file-document</v-icon>Form Minat Petani</p>
                            <v-divider class="mx-2"></v-divider>
                            <v-switch
                                color="green"
                                v-model="inputs.interest.model"
                                inset
                                :label="`${inputs.interest.model ? 'Berminat' : 'Tidak Berminat'}`"
                            ></v-switch>
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <!-- nama petani -->
                        <v-text-field
                            dense
                            color="success"
                            hide-details
                            :label="inputs.name.label"
                            outlined
                            rounded
                            :placeholder="inputs.name.placeholder"
                            :readonly="inputs.name.readonly"
                            :suffix="inputs.name.suffix"
                            :type="inputs.name.type"
                            v-model="inputs.name.model"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs.name.labelIcon" class="mr-1">{{ inputs.name.labelIcon }}</v-icon>
                                {{ inputs.name.label }} 
                                <sup><v-icon v-if="inputs.name.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                            <template v-slot:append>
                                <div class="mt-1 ml-1" v-html="inputs.name.append"></div>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <!-- pelatihan -->
                        <v-autocomplete
                            dense
                            :multiple="inputs.farmer_training.multiple"
                            color="success"
                            hide-details
                            item-color="success"
                            :item-text="inputs.farmer_training.itemText"
                            :item-value="inputs.farmer_training.itemValue"
                            :items="inputs.farmer_training.items"
                            :label="inputs.farmer_training.label"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            outlined
                            rounded
                            :readonly="inputs.farmer_training.readonly"
                            v-model="inputs.farmer_training.model"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs.farmer_training.labelIcon" class="mr-1">{{ inputs.farmer_training.labelIcon }}</v-icon>
                                {{ inputs.farmer_training.label }} 
                                <sup><v-icon v-if="inputs.farmer_training.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                            <template v-slot:item="data">
                                <v-list-item-content>
                                    <v-list-item-title v-html="data.item[inputs.farmer_training.itemTitle]"></v-list-item-title>
                                    <v-list-item-subtitle v-if="inputs.farmer_training.itemSub">{{ data.item[inputs.farmer_training.itemSub] }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <!-- tree kayu -->
                        <v-autocomplete
                            :dense="inputs.kayu.dense"
                            :multiple="inputs.kayu.multiple"
                            :chips="inputs.kayu.chip"
                            color="success"
                            hide-details
                            item-color="success"
                            :item-text="inputs.kayu.itemText"
                            :item-value="inputs.kayu.itemValue"
                            :items="inputs.kayu.items"
                            :label="inputs.kayu.label"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            outlined
                            rounded
                            :readonly="inputs.kayu.readonly"
                            v-model="inputs.kayu.model"
                            :disabled="inputs.kayu.disabled"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs.kayu.labelIcon" class="mr-1">{{ inputs.kayu.labelIcon }}</v-icon>
                                {{ inputs.kayu.label }} 
                                <sup><v-icon v-if="inputs.kayu.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                            <template v-slot:item="data">
                                <v-list-item-content>
                                    <v-list-item-title v-html="data.item[inputs.kayu.itemTitle]"></v-list-item-title>
                                    <v-list-item-subtitle v-if="inputs.kayu.itemSub">{{ data.item[inputs.kayu.itemSub] }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <!-- tree mpts -->
                        <v-autocomplete
                            :dense="inputs.mpts.dense"
                            :multiple="inputs.mpts.multiple"
                            :chips="inputs.mpts.chip"
                            color="success"
                            hide-details
                            item-color="success"
                            :item-text="inputs.mpts.itemText"
                            :item-value="inputs.mpts.itemValue"
                            :items="inputs.mpts.items"
                            :label="inputs.mpts.label"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            outlined
                            rounded
                            :readonly="inputs.mpts.readonly"
                            v-model="inputs.mpts.model"
                            :disabled="inputs.mpts.disabled"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs.mpts.labelIcon" class="mr-1">{{ inputs.mpts.labelIcon }}</v-icon>
                                {{ inputs.mpts.label }} 
                                <sup><v-icon v-if="inputs.mpts.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                            <template v-slot:item="data">
                                <v-list-item-content>
                                    <v-list-item-title v-html="data.item[inputs.mpts.itemTitle]"></v-list-item-title>
                                    <v-list-item-subtitle v-if="inputs.mpts.itemSub">{{ data.item[inputs.mpts.itemSub] }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn 
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-100000" 
                    text rounded color="red" class="pl-2">
                    <v-icon class="mr-1">mdi-close-circle</v-icon>
                    Close
                </v-btn>
                <v-divider class="mx-2"></v-divider>
                <v-btn
                    data-aos="zoom-in"
                    data-aos-duration="700"
                    data-aos-offset="-100000" 
                    color="primary white--text"
                    class=""
                    rounded
                    :key="`saveButton${disableSave}`"
                    :disabled="disableSave"
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
import Swal from 'sweetalert2'

import formOptions from './JSON/FormOptions.json'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: null
        },
        programYear: {
            type: String,
            default: moment().format('YYYY')
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
                type: 'text',
                label: 'Provinsi',
                model: '',
                required: true,
                items: [],
                loading: false
            },
            regency: {
                type: 'text',
                label: 'Kabupaten / Kota',
                model: '',
                required: true,
                items: [],
                loading: false
            },
            district: {
                type: 'text',
                label: 'Kecamatan',
                model: '',
                required: true,
                items: [],
                loading: false
            },
            village: {
                type: 'text',
                items: [],
                label: 'Desa',
                required: true,
                model: '',
                loading: false
            },
            interest: {
                type: 'bool',
                model: false,
                required: true
            },
            name: {
                inputType: 'text-field',
                label: 'Nama Petani',
                labelIcon: 'mdi-account-tag',
                loading: false,
                model: null,
                placeholder: ``,
                required: true,
                readonly: false,
                suffix: '',
                type: 'text'
            },
            farmer_training: {
                type: 'text',
                chip: false,
                hideSelected: false,
                inputType: 'autocomplete',
                items: [],
                itemTitle: 'material_name',
                itemSub: 'material_no',
                itemText: 'material_name',
                itemValue: 'material_no',
                label: 'Materi Pelatihan',
                labelIcon: 'mdi-book-open-variant',
                lgView: 6,
                multiple: false,
                required: true,
                readonly: false,
            },
            kayu: {
                dense: false,
                disabled: false,
                type: 'array',
                chip: true,
                hideSelected: false,
                inputType: 'autocomplete',
                items: [],
                itemTitle: 'tree_name',
                itemSub: '',
                itemText: 'tree_name',
                itemValue: 'tree_code',
                label: 'KAYU',
                labelIcon: 'mdi-tree',
                lgView: 6,
                model: [],
                multiple: true,
                required: true,
                readonly: false,
            },
            mpts: {
                dense: false,
                disabled: false,
                type: 'array',
                chip: true,
                hideSelected: false,
                inputType: 'autocomplete',
                items: [],
                itemTitle: 'tree_name',
                itemSub: '',
                itemText: 'tree_name',
                itemValue: 'tree_code',
                label: 'MPTS',
                labelIcon: 'mdi-food-apple',
                lgView: 6,
                model: [],
                multiple: true,
                required: false,
                readonly: false,
            },
        },
        loading: {
            show: false,
            text: 'Loading...'
        },
        localConfig: {
            windowWidth: window.innerWidth,
            breakLayoutFrom: 1140,
            requiredInputIcon: 'mdi-star'
        },
    }),
    watch: {
        'inputs.kayu.model': {
            async handler(val, oldVal) {
                const kayu = val.length
                const mpts = this.inputs.mpts.model.length
                if ((kayu + mpts) > 3) {
                    const confirm = await Swal.fire({
                        title: 'Melebihi Batas!',
                        text: "Batas maksimal jumlah jenis adalah 3.",
                        icon: 'warning',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Okay'
                    })
                    this.inputs.kayu.model = oldVal
                }
            }
        },
        'inputs.mpts.model': {
            async handler(val, oldVal) {
                const mpts = val.length
                const kayu = this.inputs.kayu.model.length
                console.log(kayu)
                if (kayu === 0  && mpts > 2) {
                    const confirm = await Swal.fire({
                        title: 'Belum Pilih KAYU!',
                        text: "Minimal pilh 1 jenis kayu.",
                        icon: 'warning',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Okay'
                    })
                    this.inputs.mpts.model = oldVal
                }
                if ((kayu + mpts) > 3) {
                    const confirm = await Swal.fire({
                        title: 'Melebihi Batas!',
                        text: "Batas maksimal jumlah jenis adalah 3.",
                        icon: 'warning',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Okay'
                    })
                    this.inputs.mpts.model = oldVal
                }
            }
        }
    },
    computed: {
        showModal: {
            get: function () {
                if (this.show) {
                    this.inputs.program_year.model = this.programYear
                    this.getDefaultData()
                    if (this.id) {
                        this.getDetailData(this.id)
                    }
                }
                return this.show
            },
            set: function(newVal) {
                if (newVal) {
                } else this.$emit('action', {type: 'close', name: 'form'})
            }
        },
        disableSave() {
            let requiredEmpty = 0
            for (const [key, val] of Object.entries(this.inputs)) {
                if (val.required === true) {
                    if (val.type !== 'bool' && val.type !== 'array') if (!val.model) requiredEmpty += 1
                    if (val.type === 'array') if (val.model.length === 0) requiredEmpty += 1
                }
            }
            return requiredEmpty > 0 ? true : false
        },
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
    },
    methods: {
        async errorResponse(error) {
            console.log(error)
            if (error.response) {
                if (error.response.status) {
                    if (error.response.status == 401) {
                        const confirm = await Swal.fire({
                            title: 'Session Ended!',
                            text: "Please login again.",
                            icon: 'warning',
                            confirmButtonColor: '#2e7d32',
                            confirmButtonText: 'Okay'
                        })
                        if (confirm) {
                            localStorage.removeItem("token");
                            this.$router.push("/");
                        }
                    }
                }
            }
        },
        async getDefaultData() {
            try {
                this.loading.show = true
                this.loading.text = 'Getting list provinces...'
                await this.getOptionsData({type: 'province'})
                this.loading.text = 'Getting list materi pelatihan...'
                this.inputs.farmer_training.items = await this.callApiGet('GetTrainingMaterials')
                this.loading.text = 'Getting trees data...'
                const listTrees = await this.callApiGet('GetTreesAll')
                const kayu = await listTrees.data.filter(lt => lt.tree_category === 'Pohon_Kayu')
                const mpts = await listTrees.data.filter(lt => lt.tree_category === 'Pohon_Buah')
                this.inputs.kayu.items = kayu
                this.inputs.mpts.items = mpts
            } catch (err) {this.errorResponse(err)} finally {
                this.loading.show = false
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
        async callApiGet(url) {
            try {
                const response = await axios.get(this.$store.getters.getApiUrl(url), this.$store.state.apiConfig)
                if (response) {
                    const data = response.data.data.result
                    return data
                } else return null
            } catch (error) { this.errorResponse(error)}
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        }
    }
}
</script>