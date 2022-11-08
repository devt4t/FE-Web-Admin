<template>
    <div>
        <!-- BreadCrumbs -->
        <v-breadcrumbs
            class="breadcrumbsmain"
            :items="breadcrumbs"
            divider=">"
            large
        ></v-breadcrumbs>

        <!-- DIALOG MODAL -->
        <!-- Create Data Modal -->
        <v-dialog
            v-model="dialogs.createData.show"
            content-class="rounded-xl"
            max-width="1200px"
            scrollable
            persistent
        >
            <v-card>
                <v-card-title class="mb-1 headermodalstyle rounded-xl">
                    <span class="">{{ dialogs.createData.title }}</span>
                    <v-icon color="red lighten-1" class="ml-auto" @click="dialogActions('createData', false)">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text class="pa-0">
                    <v-stepper class="rounded-xl" v-model="dialogs.createData.step">
                        <!-- Stepper Header -->
                        <v-stepper-header class="rounded-xl">
                            <v-stepper-step editable :complete="dialogs.createData.step > 1" step="1" color="success" class="rounded-xl">
                                Administration
                            </v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step editable :complete="dialogs.createData.step > 2" step="2" color="success" class="rounded-xl">
                                Locations & Period
                            </v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step editable :complete="dialogs.createData.step > 3" step="3" color="success" class="rounded-xl">
                                Photos
                            </v-stepper-step>
                        </v-stepper-header>
                        <!-- Stepper Content -->
                        <v-stepper-items>
                            <!-- Administration -->
                            <v-stepper-content step="1">
                                <v-row class="pt-2">
                                    <!-- Employee -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="nik"
                                            :items="inputs.employee.items"
                                            :label="inputs.employee.label"
                                            :loading="inputs.employee.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.employee.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.employee.model"
                                            :disabled="User.role_group != 'IT'"
                                        ></v-autocomplete>
                                    </v-col>
                                </v-row>
                            </v-stepper-content>
                            <v-stepper-content step="2">
                                <div class="pb-2 d-flex align-center">
                                    <p class="mb-0"><v-icon class="mr-2">mdi-map-marker</v-icon>Location</p>
                                    <v-divider class="mx-2"></v-divider>
                                </div>
                                <v-row class="">
                                    <!-- Province -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
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
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.village.model"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- Address -->
                                    <v-col cols="12" sm="12" md="12" lg="8">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.address.label"
                                            :loading="inputs.address.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.address.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.address.model"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <div class="py-2 d-flex align-center">
                                    <p class="mb-0"><v-icon class="mr-2">mdi-crosshairs-gps</v-icon>Coordinates</p>
                                    <v-divider class="mx-2"></v-divider>
                                </div>
                                <v-row>
                                    <!-- Latitude -->
                                    <v-col cols="12" sm="12" md="6" lg="6">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.latitude.label"
                                            :loading="inputs.latitude.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.latitude.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.latitude.model"
                                        ></v-text-field>
                                    </v-col>
                                    <!-- Longitude -->
                                    <v-col cols="12" sm="12" md="6" lg="6">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.longitude.label"
                                            :loading="inputs.longitude.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.longitude.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.longitude.model"
                                        ></v-text-field>
                                    </v-col>
                                    <!-- Check Location -->
                                    <v-col cols="12" class="px-10">
                                        <v-tooltip top class="rounded-xl" color="rounded-xl">
                                            Click for check coordinates in GoogleMaps
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn v-bind="attrs" v-on="on" color="info" rounded block :disabled="!inputs.longitude.model || !inputs.longitude.model" @click="openGoogleMap"> 
                                                    <v-icon class="mr-2">mdi-map-marker</v-icon>
                                                    Check Location
                                                </v-btn>
                                            </template>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-card-text>
                <v-card-actions class="ma-2">
                    <!-- Footer Button -->
                    <v-row>
                        <v-col cols="3">
                            <v-btn
                                class="mr-0 mr-md-1"
                                color="red"
                                rounded
                                elevation="1"
                                @click="close"
                                outlined
                            >
                                <v-icon class="d-none d-md-inline" left> mdi-close-circle-outline </v-icon>
                                <v-icon class="d-inline d-md-none" center> mdi-close-circle-outline </v-icon>
                                <span class="d-none d-md-inline-block"> 
                                    Cancel
                                </span>
                            </v-btn>
                        </v-col>
                        <v-col cols="6" align="center">
                            <v-btn
                                :disabled="e1 == 1"
                                elevation="1"
                                outlined
                                color="primary"
                                class="mr-1"
                                rounded
                                @click="stepperMove('-')"
                            >
                                <v-icon class="d-none d-md-inline" left> mdi-chevron-left-circle-outline </v-icon>
                                <v-icon class="d-inline d-md-none" center> mdi-chevron-left-circle-outline </v-icon>
                                <span class="d-none d-md-inline-block"> 
                                    Back
                                </span>
                            </v-btn>
                            <v-btn
                                class="ml-1"
                                elevation="1"
                                rounded
                                outlined
                                color="primary"
                                @click="stepperMove('+')"
                                :disabled="false"
                            >
                                <span class="d-none d-md-inline-block"> 
                                    Next
                                </span>
                                <v-icon class="d-none d-md-inline" right> mdi-chevron-right-circle-outline </v-icon>
                                <v-icon class="d-inline d-md-none" center> mdi-chevron-right-circle-outline </v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="3" align="end">
                            <v-btn
                                color="success"
                                elevation="1"
                                rounded
                                outlined
                                @click="() => {}"
                            >
                                <span class="d-none d-md-inline-block"> 
                                    Save
                                </span>
                                <v-icon class="d-none d-md-inline" right> mdi-checkbox-marked-circle-outline </v-icon>
                                <v-icon class="d-inline d-md-none" center> mdi-checkbox-marked-circle-outline </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- END: DIALOG MODAL -->
        <!-- Main Table -->
        <v-data-table
            class="rounded-xl elevation-6 mx-3 pa-1 mb-5"
            :headers="tables.lahan.headers"
            :items="tables.lahan.items"
            :loading="tables.lahan.loading"
        >
            <!-- Slot: Top -->
            <template v-slot:top>
                <v-row class="my-1 mx-2">
                    <v-col cols="12" class="d-flex justify-end">
                        <v-btn color="info" rounded @click="dialogActions('createData', true)">
                            <v-icon class="mr-1">mdi-plus-circle</v-icon>
                            Create Data
                        </v-btn>
                    </v-col>
                </v-row>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data: () => ({
        breadcrumbs: [
            {
                text: "Main Data",
                disabled: true,
                href: "breadcrumbs_dashboard",
            },
            {
                text: "Lahan Umum",
                disabled: true,
                href: "breadcrumbs_link_1",
            },
        ],
        dialogs: {
            createData: {
                show: false,
                title: 'Create Lahan Umum',
                step: 1,
            }
        },
        inputs: {
            address: {
                label: 'Address',
                model: '',
                loading: false
            },
            district: {
                label: 'District',
                model: '',
                items: [],
                loading: false
            },
            employee: {
                label: 'Employee',
                model: '',
                items: [],
                loading: false
            },
            latitude: {
                label: 'Latitude',
                model: '',
                loading: false
            },
            longitude: {
                label: 'Longitude',
                model: '',
                loading: false
            },
            province: {
                label: 'Province',
                model: '',
                items: [],
                loading: false
            },
            regency: {
                label: 'Regency',
                model: '',
                items: [],
                loading: false
            },
            village: {
                label: 'Village',
                model: '',
                items: [],
                loading: false
            },
        },
        tables: {
            lahan: {
                headers: [
                    {text: 'No', value: 'no'},
                    {text: 'Lahan No', value: 'lahan_no'},
                    {text: 'Desa', value: 'village'},
                    {text: 'FC', value: 'fc_name'},
                    {text: 'PIC', value: 'pic_lahan'},
                    {text: 'Luas Lahan', value: 'luas_lahan'},
                    {text: 'Tutupan', value: 'tutupan_lahan'},
                    {text: 'Pola Tanam', value: 'pattern_planting'},
                    {text: 'Tahun Program', value: 'created_at'},
                    {text: 'Status', value: 'is_verified'},
                    {text: 'Action', value: 'action', align: 'right'},
                ],
                items: [],
                loading: false
            }
        },
        User: {}
    }),
    mounted() {
        this.User = JSON.parse(localStorage.getItem('User'))
    },
    methods: {
        async dialogActions(dialog, show) {
            if (dialog == 'createData' && show == true) {
                this.$store.state.loadingOverlay = true
                await this.getOptionsData({type: 'province'})
                await this.getOptionsData({type: 'employee'})
                this.$store.state.loadingOverlay = false

                this.inputs.employee.model = this.User.employee_no
            } 

            this.dialogs[dialog].show = show
        },
        async getOptionsData(inputs) {
            // prepare for calling api
            const baseUrl = localStorage.getItem('BaseUrlGet')
            const token = localStorage.getItem('token')
            let url = ''
            
            // set url
            if (inputs.type == 'province') {
                url = 'GetProvince'
                this.$store.state.loadingOverlayText = 'Getting Province datas...'
            } else if (inputs.type == 'regency') {
                url = 'GetKabupaten?province_code=' + this.inputs.province.model
                this.$store.state.loadingOverlayText = 'Getting Regency datas...'
            } else if (inputs.type == 'district') {
                url = 'GetKecamatan?kabupaten_no=' + this.inputs.regency.model
                this.$store.state.loadingOverlayText = 'Getting District datas...'
            } else if (inputs.type == 'village') {
                url = 'GetDesa?&kode_kecamatan=' + this.inputs.district.model
                this.$store.state.loadingOverlayText = 'Getting Village datas...'
            } else if (inputs.type == 'employee') {
                url = 'GetEmployeeAll'
                this.$store.state.loadingOverlayText = 'Getting Employee datas...'
            }

            
            if (url != '') {
                url = baseUrl + url

                this.inputs[inputs.type].model = ''
                this.inputs[inputs.type].loading = true
                
                // calling api
                await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ` + token,
                    },
                }).then(res => {
                    if (inputs.type == 'employee') {
                        this.inputs[inputs.type].items = res.data.data.result.data
                    } else {
                        this.inputs[inputs.type].items = res.data.data.result
                    }
                }).catch(err => {
                    console.log(err.response)
                    this.forceLogout(err.response)
                    this.inputs[inputs.type].items = []
                }).finally(() => {
                    this.$store.state.loadingOverlayText = null
                    this.inputs[inputs.type].loading = false
                })
            }
        },
        // Utilities
        forceLogout(response) {
            if (response.status == 401) {
                localStorage.removeItem("token")
                this.$router.push("/")
            }
        },
        openGoogleMap() {
            window.open(`http://maps.google.co.id/maps?q=${this.inputs.latitude.model},${this.inputs.longitude.model}`)
        }
    }
}
</script>