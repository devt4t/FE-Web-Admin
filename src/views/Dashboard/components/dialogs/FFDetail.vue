<template>
    <div>
        <FarmerLahanDetail :show="dialogs.farmer_lahan_detail.show" :data="dialogs.farmer_lahan_detail.data" @dialogActions="($val) => dialogActions($val)"/>
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
                    >
                        <template v-slot:item.index="{ index }">
                            <div>
                                {{ index + 1 }}
                            </div>
                        </template>
                        <template v-slot:item.action="{ index, item }">
                            <v-btn small rounded color="green white--text" class="pl-1"
                                @click="dialogActions(true, item)"
                            >
                                <v-icon class="mr-1">mdi-information</v-icon>
                                Detail
                            </v-btn>
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
export default {
    name: 'OldGEKOFFDetail',
    components: {
        FarmerLahanDetail
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
            }
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
        }
    },
};
</script>