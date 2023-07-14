<template>
    <div>
        <FarmerLahanDetail :show="dialogs.farmer_lahan_detail.show" :data="dialogs.farmer_lahan_detail.data" @dialogActions="($val) => dialogActions($val)"/>
        <AddFFModal
            :show="dialogs.addEditFF.show"
            :id="dialogs.addEditFF.id"
            :programYear="options.programYear"
            @dialogAct="dialogsAction($event)"
            @showSnackbar="showSnackbar($event.text, $event.color)"
            @swal="($v) => swalActions($v)"
            @refreshTable="initialize"
        />
        <v-dialog
            v-model="showModal"
            scrollable
            max-width="1200px"
            transition="dialog-transition"
            content-class="rounded-xl"
            >
            <v-card>
                <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                    <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Detail Field Facilitator
                    <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-row class="align-center ma-0 my-2">
                        FC: {{ data ? data.fcName || '-' : '-' }}
                        <v-divider class="mx-2"></v-divider>
                        <!-- program_year -->
                        <v-select
                            dense
                            color="success"
                            item-color="success"
                            :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition'}"
                            hide-details
                            rounded
                            v-model="options.programYear"
                            :disabled="table.loading.show"
                            :items="$store.state.programYear.options"
                            label="Program Year"
                            :rules="[(v) => !!v || 'Field is required']"
                            outlined
                            class="mt-2 mr-1"
                            style="max-width: 175px;"
                        ></v-select>
                    </v-row>
                    <v-data-table
                        v-if="tableItems"
                        :headers="table.headers"
                        :items="table.items"
                        class="elevation-1 rounded-xl"
                        :loading="table.loading.show"
                        :search="table.loading.search"
                        style="position: relative;"
                    >
                        <template v-slot:top>
                            <!-- Loading -->
                            <v-overlay absolute color="white" :value="table.loading.show">
                                <div class="d-flex flex-column justify-center align-center">
                                    <v-progress-circular
                                        :size="80"
                                        :width="10"
                                        indeterminate
                                        color="green"
                                    >
                                    </v-progress-circular>
                                    <p class="mt-2 mb-0 green--text text--darken-2">{{ table.loading.text }}</p>
                                </div>
                            </v-overlay>
                        </template>
                        <template v-slot:item.index="{ index }">
                            <div>
                                {{ index + 1 }}
                            </div>
                        </template>
                        <template v-slot:item.action="{ index, item }">
                            <div class="d-flex align-center ma-0">
                                <v-btn
                                    v-if="cuAccess"
                                    class="mr-1"
                                    rounded
                                    @click="editItem(item)"
                                    color="warning white--text"
                                    fab 
                                    x-small
                                >
                                    <v-icon class="mr-1" small color="white">
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                <v-btn small rounded color="green white--text" class="pl-1"
                                    @click="dialogActions(true, item)"
                                >
                                    <v-icon class="mr-1">mdi-information</v-icon>
                                    Detail
                                </v-btn>
                            </div>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Swal from 'sweetalert2'

import FarmerLahanDetail from '@/views/Dashboard/components/dialogs/FarmerLahanDetail'
import AddFFModal from '@/views/Employee/components/FF/AddFFModal'
export default {
    name: 'OldGEKOFFDetail',
    components: {
        FarmerLahanDetail,
        AddFFModal
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
            default: null,
        },
    },
    data: () => ({
        dialogs: {
            farmer_lahan_detail: {
                show:false,
                data: null
            },
            addEditFF: {
                show: false,
                id: "",
            },
        },
        options: {
            programYear: '',
        },
        table: {
            headers: [
                {text: 'No', value: 'index', width: 75},
                {text: 'FF No', value: 'ff_no'},
                {text: 'Nama FF', value: 'name'},
                {text: 'NIK / No KTP', value: 'ktp_no'},
                {text: 'MU', value: 'mu_name'},
                {text: 'TA', value: 'ta_name'},
                {text: 'Desa', value: 'desa_name'},
                {text: 'Total Petani', value: 'total_farmer'},
                {text: 'Total Lahan', value: 'total_lahan'},
                {text: '', value: 'action'},
            ],
            items: [],
            loading: {
                show: false,
                text: 'Loading...'
            },
            search: ''
        }
    }),
    computed: {
        showModal: {
            get: function () {
                if (this.show && this.data.fcNo && this.data.programYear) {
                    this.options.programYear = this.data.programYear
                }
                return this.show
            },
            set: function(newVal) {
                if (!newVal) this.$emit('dialogActions', false)
            }
        },
        tableItems() {
            if (this.show && this.data.fcNo && this.options.programYear) {
                this.getTableData({
                    program_year: this.options.programYear,
                    fc_no: this.data.fcNo
                })
            }
            return true
        },
        cuAccess() {
            const user = this.$store.state.User
            if (user.role_group == 'IT') return true
            if (user.role_name == 'UNIT MANAGER') return true
            return false
        }
    },
    mounted() {
        
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
                    if (error.response.status === 500 || error.response.status === 400) {
                        let errMessage = error.response.data.message
                        if (errMessage) if (errMessage.includes("Duplicate entry")) errMessage = 'Data sudah ada!' 
                        Swal.fire({
                            title: 'Error!',
                            text: `${errMessage || error.message}`,
                            icon: 'error',
                            confirmButtonColor: '#f44336',
                        })
                    }
                }
            }
        },
        async dialogActions(show, item = null) {
            const user = this.User
            if (item) {
                this.dialogs.farmer_lahan_detail.data = {
                    ...item,
                    programYear: this.options.programYear,
                    ffName: item.name
                }
            }
            this.dialogs.farmer_lahan_detail.show = show
        },
        dialogsAction(dialog) {
            this.dialogs[dialog.name].show = dialog.status;
            if (dialog.name == "changeFF" && dialog.status == false)
                this.dialogs[dialog.name].id = "";
        },
        async editItem(item) {
            this.dialogs.addEditFF.id = item.id.toString();
            this.dialogs.addEditFF.show = true;
        },
        async getTableData(getparams) {
            try {
                this.table.loading.show = true
                const params = new URLSearchParams(getparams)
                const url = `Dashboard/DetailFieldFacilitator?${params}`
                const call = await axios.get(this.$store.getters.getApiUrl(url), this.$store.state.apiConfig)
                const data = call.data
                console.log(data)
                this.table.items = data
            } catch (err) {this.errorResponse(err)} finally {
                this.table.loading.show = false
            }
        },
        initialize() {
            this.getTableData({
                program_year: this.options.programYear,
                fc_no: this.data.fcNo
            })
        },
        showSnackbar(text, color) {
            alert(text)
        },
        swalActions(val) {
            this.initialize();
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                showCloseButton: true,
                timer: 10000,
                timerProgressBar: true,
                didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });

            Toast.fire({
                icon: val.type,
                title: val.message,
            });
        },
    },
};
</script>