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
            content-class="rounded-xl"
            fullscreen
            transition="dialog-bottom-transition"
            v-model="dialogs.createData.show"
            scrollable
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
                                Coordinate & Period
                            </v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step editable :complete="dialogs.createData.step > 3" step="3" color="success" class="rounded-xl">
                                Photos
                            </v-stepper-step>
                        </v-stepper-header>
                        <!-- Stepper Content -->
                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <v-row class="pt-2">
                                    <!-- MU -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="mu_no"
                                            :items="options.MU.items"
                                            :label="options.MU.label"
                                            :loading="options.MU.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="options.MU.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="options.MU.model"
                                            v-on:change="getOptionsData({type: 'TA'})"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- TA -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="area_code"
                                            :items="options.TA.items"
                                            :label="options.TA.label"
                                            :loading="options.TA.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="options.TA.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="options.TA.model"
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
                                            :items="options.village.items"
                                            :label="options.village.label"
                                            :loading="options.village.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="options.village.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="options.village.model"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- Employee -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="nik"
                                            :items="options.employee.items"
                                            :label="options.employee.label"
                                            :loading="options.employee.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="options.employee.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="options.employee.model"
                                            :disabled="User.role_group != 'IT'"
                                        ></v-autocomplete>
                                    </v-col>
                                </v-row>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-card-text>
                <v-card-actions class="">
                    <v-row>
                        <v-col>
                            <v-btn>Back</v-btn>
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
        options: {
            MU: {
                label: 'Management Unit',
                model: '',
                items: [],
                loading: false
            },
            TA: {
                label: 'Target Area',
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
            employee: {
                label: 'Employee',
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
                await this.getOptionsData({type: 'MU'})
                await this.getOptionsData({type: 'employee'})
                this.$store.state.loadingOverlay = false

                this.options.employee.model = this.User.employee_no
            } 

            this.dialogs[dialog].show = show
        },
        async getOptionsData(options) {
            // prepare for calling api
            const baseUrl = localStorage.getItem('BaseUrlGet')
            const token = localStorage.getItem('token')
            let url = ''
            
            // set url
            if (options.type == 'MU') {
                url = 'GetManagementUnit'
                this.$store.state.loadingOverlayText = 'Getting Management Unit datas...'
            } else if (options.type == 'TA') {
                url = 'GetTargetArea?mu_no=' + options.mu_no
                this.$store.state.loadingOverlayText = 'Getting Management Unit datas...'
            } else if (options.type == 'village') {
                url = 'GetDesa?&kode_ta=' + options.ta_no
                this.$store.state.loadingOverlayText = 'Getting Village datas...'
            } else if (options.type == 'employee') {
                url = 'GetEmployeeAll'
                this.$store.state.loadingOverlayText = 'Getting Employee datas...'
            }

            
            if (url != '') {
                url = baseUrl + url

                this.options[options.type].model = ''
                this.options[options.type].loading = true
                
                // calling api
                await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ` + token,
                    },
                }).then(res => {
                    if (options.type == 'employee') {
                        this.options[options.type].items = res.data.data.result.data
                    } else {
                        this.options[options.type].items = res.data.data.result
                    }
                }).catch(err => {
                    console.log(err.response)
                    this.forceLogout(err.response)
                }).finally(() => {
                    this.$store.state.loadingOverlayText = null
                    this.options[options.type].loading = false
                })
            }
        },
        // Utilities
        forceLogout(response) {
            if (response.status == 401) {
                localStorage.removeItem("token")
                this.$router.push("/")
            }
        }
    }
}
</script>