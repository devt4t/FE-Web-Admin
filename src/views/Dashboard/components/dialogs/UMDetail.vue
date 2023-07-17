<template>
    <div>
        <f-c-detail :show="dialogs.fc_detail.show" :data="dialogs.fc_detail.data" @dialogActions="($val) => dialogActions($val)"></f-c-detail>
        <v-dialog
            v-model="showModal"
            scrollable
            max-width="1000px"
            transition="dialog-transition"
            content-class="rounded-xl"
            >
            <v-card>
                <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                    <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Unit Manager
                    <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-row class="align-center ma-0 my-2">
                        <!-- RM: {{ data ? data.rmName || '-' : '-' }} -->
                        <v-divider class="mx-2"></v-divider>
                        <!-- program_year -->
                        <v-select
                            v-if="false"
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
                        :loading-text="table.loading.text"
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
                            <v-btn small rounded color="green white--text" class="pl-1"
                                @click="dialogActions(true, item)"
                            >
                                <v-icon class="mr-1">mdi-information</v-icon>
                                Detail FC
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

import FCDetail from '@/views/Dashboard/components/dialogs/FCDetail'

export default {
    name: 'OldGEKOUMDetail',
    components: {
        FCDetail
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
            fc_detail: {
                show:false,
                data: null
            },
        },
        options: {
            programYear: '',
        },
        table: {
            headers: [
                {text: 'No', value: 'index', width: 75},
                {text: 'ID Karyawan (GEKO)', value: 'nik'},
                {text: 'Nama UM', value: 'name'},
                {text: 'Email', value: 'email'},
                {text: 'NIK / No KTP', value: 'ktp_no'},
                {text: 'Total FC', value: 'total_fc'},
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
                if (this.show) {
                    this.options.programYear = this.data.programYear
                }
                return this.show
            },
            set: function(newVal) {
                if (!newVal) this.$emit('dialogActions', false)
            }
        },
        tableItems() {
            if (this.show && this.options.programYear) {
                this.getTableData({
                    program_year: this.options.programYear,
                    // manager_code: this.data.rmNo,
                    // manager_code: '04-0004',
                    position_no: 20 
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
                this.dialogs.fc_detail.data = {
                    umNo: item.nik,
                    umName: item.name,
                    programYear: this.options.programYear
                }
            }
            this.dialogs.fc_detail.show = show
        },
        async getTableData(getparams) {
            this.table.loading.show = true
            this.table.loading.text = 'Mengambil data...'
            const params = new URLSearchParams(getparams)
            const url = `GetEmployeeAll?${params}`
            const call = await axios.get(this.$store.getters.getApiUrl(url), this.$store.state.apiConfig)
            const data = call.data.data.result.data
            this.table.items = []
            if (data.length > 0) {
                data.sort((a, b) => a.name.localeCompare(b.name))
                this.table.loading.text = `Mengambil data UM 0 / ${data.length}`
                for (const[key, value] of Object.entries(data)) {
                    const fcparams = new URLSearchParams({
                        program_year: this.options.programYear,
                        manager_code: value.nik,
                        position: 19 
                    })
                    await axios.get(
                        this.$store.getters.getApiUrl(`GetEmployeebyManager?${fcparams}`),
                        this.$store.state.apiConfig
                    ).then((callFC) => {
                        value.total_fc = callFC.data.data.result.data.length
                    }).catch(() => {value.total_fc = 0})
                    if (value.email && value.total_fc > 0) this.table.items.push(value)
                    this.table.loading.text = `Mengambil data UM ${parseInt(key)+1} / ${data.length}`
                }
            }
            this.table.loading.show = false
        }
    },
};
</script>