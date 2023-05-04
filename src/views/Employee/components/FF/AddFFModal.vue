<template>
    <!-- Modal Add Edit -->
    <v-dialog v-model="showModal" max-width="1000px" content-class="rounded-xl" scrollable>
    <v-card>
        <v-card-title class="mb-1 headermodalstyle">
            <span class=""><v-icon color="white" class="mr-1">mdi-text-account</v-icon> Field Facilitator Form</span>
            <v-divider color="white" class="mx-2"></v-divider>
            <v-icon color="white" @click="() => showModal = false">mdi-close-circle</v-icon>
        </v-card-title>
        <v-card-text>
            <!-- MU TA DESA -->
            <div class="pb-2 d-flex align-center mt-4">
                <p class="mb-0"><v-icon class="mr-2">mdi-file-marker</v-icon>Area Kerja FF</p>
                <v-divider class="mx-2"></v-divider>
            </div>
            <v-row class="">
                <!-- Management Unit -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="mu_no"
                        :items="inputs.mu.items"
                        :label="inputs.mu.label"
                        :loading="inputs.mu.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.mu.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.mu.model"
                        @change="($val) => getOptions('ta', $val)"
                    ></v-autocomplete>
                </v-col>
                <!-- Target Area -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="area_code"
                        :items="inputs.ta.items"
                        :label="inputs.ta.label"
                        :loading="inputs.ta.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.ta.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.ta.model"
                        :disabled="!inputs.mu.model"
                        @change="($val) => getOptions('wa', $val)"
                    ></v-autocomplete>
                </v-col>
                <!-- Working Area / Desa -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="kode_desa"
                        :items="inputs.wa.items"
                        :label="inputs.wa.label"
                        :loading="inputs.wa.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.wa.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.wa.model"
                        :disabled="!inputs.ta.model"
                    ></v-autocomplete>
                </v-col>
            </v-row>
            <!-- PIC status (aktif/non) -->
            <div class="pb-2 d-flex align-center mt-4">
                <p class="mb-0"><v-icon class="mr-2">mdi-account-tie-hat</v-icon>PIC T4T (Field Coordinator)</p>
                <v-divider class="mx-2"></v-divider>
            </div>
            <v-row class="">
                <!-- FC -->
                <v-col cols="12" lg="8">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="nik"
                        :items="inputs.fc.items"
                        :label="inputs.fc.label"
                        :loading="inputs.fc.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.fc.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.fc.model"
                        @change="($val) => getOptions('ta', $val)"
                    ></v-autocomplete>
                </v-col>
                <!-- Status -->
                <v-col cols="12" lg="4">
                    <v-switch
                        v-model="inputs.is_active.model"
                        :label="`Status FF : ${inputs.is_active.model ? 'Aktif' : 'Non-Aktif'}`"
                        color="green"
                        class="mt-2"
                    ></v-switch>
                </v-col>
            </v-row>
            <!-- Foto nama gender religi -->
            <!-- Foto phone birth date -->
            <!-- Foto No Ktp Status kawin -->
            <div class="pb-2 d-flex align-center mt-4">
                <p class="mb-0"><v-icon class="mr-2">mdi-card-account-details</v-icon>Identitas FF</p>
                <v-divider class="mx-2"></v-divider>
            </div>
            <v-row class="">
                <v-col cols="12" lg="4">
                    Foto
                </v-col>
                <v-col cols="12" lg="8">
                    <v-row class="">
                        <!-- Nama FF -->
                        <v-col cols="12" lg="12">
                            <v-text-field
                                color="success"
                                dense
                                hide-details
                                :label="inputs.name.label"
                                :placeholder="inputs.name.placeholder"
                                :disabled="false"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                v-model="inputs.name.model"
                            ></v-text-field>
                        </v-col>
                        <!-- Phone -->
                        <v-col cols="12" lg="7">
                            <v-text-field
                                color="success"
                                dense
                                hide-details
                                :prefix="inputs.phone.prefix"
                                :label="inputs.phone.label"
                                :placeholder="inputs.name.placeholder"
                                :disabled="false"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                v-model="inputs.phone.model"
                            ></v-text-field>
                        </v-col>
                        <!-- Distribution Date Filter Field -->
                        <v-col cols="12" lg="5">
                            <v-menu 
                                rounded="xl"
                                transition="slide-x-transition"
                                bottom
                                min-width="100"
                                offset-y
                                :close-on-content-click="true"
                                v-model="inputs.birthDate.show"
                            >
                                <template v-slot:activator="{ on: menu, attrs }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <v-text-field
                                                dense
                                                color="green"
                                                class="mb-2 mb-lg-0"
                                                hide-details
                                                outlined
                                                label="Distribution Date"
                                                rounded
                                                v-bind="attrs"
                                                v-on="{...menu, ...tooltip}"
                                                readonly
                                                v-model="inputs.birthDate.modelShow"
                                                style="max-width: 250px"
                                            ></v-text-field>
                                        </template>
                                        <span>Klik untuk memunculkan tanggal</span>
                                    </v-tooltip>
                                </template>
                                <div class="rounded-xl pb-2 white">
                                    <v-overlay :value="inputs.birthDate.loading">
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
                                            v-model="inputs.birthDate.model"
                                            min="2022-11-24"
                                        ></v-date-picker>
                                    </div>
                                </div>
                            </v-menu>
                        </v-col>
                        <!-- NO KTP -->
                        <v-col cols="12" lg="7">
                            <v-text-field
                                color="success"
                                type="number"
                                dense
                                hide-details
                                max="9999999999999999"
                                :label="inputs.ktp.label"
                                :placeholder="inputs.ktp.placeholder"
                                :disabled="false"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                v-model="inputs.ktp.model"
                            ></v-text-field>
                        </v-col>
                        <!-- status kawin -->
                        <v-col cols="12" lg="5">
                            <v-autocomplete
                                color="success"
                                item-color="success"
                                placeholder="Pilih Satu"
                                hide-details
                                outlined
                                rounded
                                dense
                                :rules="[(v) => !!v || 'Field is required']"
                                item-text="name"
                                item-value="nik"
                                :items="inputs.marital.items"
                                :label="inputs.marital.label"
                                :loading="inputs.marital.loading"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                :no-data-text="inputs.marital.loading ? 'Loading...' : 'Tidak ada data.'"
                                v-model="inputs.marital.model"
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <!-- Domisili -->
            <div class="pb-2 d-flex align-center mt-4">
                <p class="mb-0"><v-icon class="mr-2">mdi-map-marker-radius</v-icon>Domisili FF</p>
                <v-divider class="mx-2"></v-divider>
            </div>
            <v-row class="">
                <!-- Province -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="province_code"
                        :items="inputs.province.items"
                        :label="inputs.province.label"
                        :loading="inputs.province.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.province.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.province.model"
                        @change="($val) => getOptions('region', $val)"
                    ></v-autocomplete>
                </v-col>
                <!-- Kota / Kabupaten -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="kabupaten_no"
                        :items="inputs.city.items"
                        :label="inputs.city.label"
                        :loading="inputs.city.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.city.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.city.model"
                        :disabled="!inputs.province.model"
                        @change="($val) => getOptions('district', $val)"
                    ></v-autocomplete>
                </v-col>
                <!-- Kecamatan -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="kode_kecamatan"
                        :items="inputs.district.items"
                        :label="inputs.district.label"
                        :loading="inputs.district.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.district.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.district.model"
                        :disabled="!inputs.city.model"
                        @change="($val) => getOptions('village', $val)"
                    ></v-autocomplete>
                </v-col>
                <!-- Desa -->
                <v-col cols="12" lg="4">
                    <v-autocomplete
                        color="success"
                        item-color="success"
                        placeholder="Pilih Satu"
                        hide-details
                        outlined
                        rounded
                        dense
                        :rules="[(v) => !!v || 'Field is required']"
                        item-text="name"
                        item-value="kode_desa"
                        :items="inputs.village.items"
                        :label="inputs.village.label"
                        :loading="inputs.village.loading"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        :no-data-text="inputs.village.loading ? 'Loading...' : 'Tidak ada data.'"
                        v-model="inputs.village.model"
                        :disabled="!inputs.district.model"
                    ></v-autocomplete>
                </v-col>
                <!-- Address detail -->
                <v-col cols="12" lg="4">
                    <v-text-field
                        color="success"
                        dense
                        hide-details
                        :label="inputs.address.label"
                        :placeholder="inputs.address.placeholder"
                        :disabled="false"
                        outlined
                        rounded
                        v-model="inputs.address.model"
                    ></v-text-field>
                </v-col>
                <!-- Postal Code -->
                <v-col cols="12" lg="4">
                    <v-text-field
                        color="success"
                        type="number"
                        min="11111"
                        max="99999"
                        dense
                        hide-details
                        :label="inputs.postalCode.label"
                        :placeholder="inputs.postalCode.placeholder"
                        :disabled="false"
                        outlined
                        rounded
                        v-model="inputs.postalCode.model"
                    ></v-text-field>
                </v-col>
            </v-row>
            <!-- Address Detail -->
            <!-- Bank Name Bank Account -->
            <!-- Auto add user account? -->
            <!-- ff name role -->
            <!-- user name email -->
            <!-- password ? default 123456 -->
        </v-card-text>
    </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: 0
        }
    },
    data: () => ({
        inputs: {
            // MU TA DESA
            mu: {
                label: 'Management Unit',
                model: '',
                items: [],
                loading: false,
            },
            ta: {
                label: 'Target Area',
                model: '',
                items: [],
                loading: false,
            },
            wa: {
                label: 'Working Area / Desa',
                model: '',
                items: [],
                loading: false
            },
            // FC
            fc: {
                label: 'Field Coordinator',
                model: '',
                items: [],
                loading: false
            },
            is_active: {model: true},
            // Foto nama gender religi
            photo: {},
            name: {
                label: 'Nama',
                model: '',
                placeholder: ''
            },
            // phone birth date
            phone: {
                label: 'Nomor HP',
                model: '',
                modelShow: '',
                prefix: '+62',
                placeholder: ''
            },
            birthDate: {
                loading: false,
                model: moment().format('Y-MM-DD'),
                modelShow: moment().format('DD MMMM Y'),
                show: false,
            },
            // KTP
            ktp: {
                label: 'No KTP',
                model: '',
                placeholder: 'isi dengan 16-digit angka'
            },
            // marital
            marital: {
                label: 'Status Perkawinan',
                model: '',
                items: [],
                loading: false
            },
            // domisili
            province: {
                label: 'Provinsi',
                model: '',
                items: [],
                loading: false,
            },
            city: {
                label: 'Kota / Kabupaten',
                model: '',
                items: [],
                loading: false,
            },
            district: {
                label: 'Kecamatan',
                model: '',
                items: [],
                loading: false,
            },
            village: {
                label: 'Desa',
                model: '',
                items: [],
                loading: false,
            },
            // address
            address: {
                label: 'Detail Alamat',
                model: '',
                placeholder: ''
            },
            // postal Code
            postalCode: {
                label: 'Kode POS',
                model: '',
                placeholder: ''
            },
        }
    }),
    computed: {
        showModal: {
            get: function () {
                if (this.id) {
                } else if (this.show) {
                    setTimeout(() => {
                        this.getOptions('mu')
                        this.getOptions('fc')
                    }, 300);
                }
                
                return this.show
            },
            set: function(newVal) {
                this.$emit('dialogAct', {name: 'addEditFF', status: newVal});
            }
        }
    },
    watch: {
        'inputs.phone.model': {
            handler(val) {
                this.inputs.phone.model = this._utils.formatPhoneNumber(val)
            }
        },
        'inputs.birthDate.model': {
            handler(val) {
                this.inputs.birthDate.modelShow = moment(val).format('DD MMMM Y')
            }
        }
    },
    methods: {
        async getOptions(type, id = null) {
            try {
                this.inputs[type].loading = true
                this.inputs[type].model = ''
                let url = ''
                if (type == 'mu') url = this.$store.getters.getApiUrl(`GetManagementUnit`)
                if (type == 'ta' && id) url = this.$store.getters.getApiUrl(`GetTargetArea?mu_no=${id}`)
                if (type == 'wa' && id) url = this.$store.getters.getApiUrl(`GetDesa?kode_ta=${id}`)
                if (type == 'fc') url = this.$store.getters.getApiUrl(`GetEmployeeAll?position_no=19`)

                if (url) {
                    const res = await axios.get(url, this.$store.state.apiConfig)
                    let data = []
                    if (type == 'fc') data = await res.data.data.result.data
                    else data = await res.data.data.result
                    this.inputs[type].items = await data.sort((a, b) => a.name.localeCompare(b.name))
                }
            } catch (err) {this.catchingError(err)} finally {
                // reset options data
                if (type == 'mu') {
                    this.inputs.ta.model = ''
                    this.inputs.ta.items = []
                }
                if (type == 'mu' || type == 'ta') {
                    this.inputs.wa.model = ''
                    this.inputs.wa.items = []
                }
                
                this.inputs[type].loading = false
            }
        },
        // utilities
        catchingError(error) {
            if (error.response) {
            if (typeof error.response.status != undefined) {
                if (error.response.status == 401) {
                    localStorage.removeItem("token")
                    this.$router.push("/")
                }
            }
            }
            console.log(error)
        },
    }
}
</script>