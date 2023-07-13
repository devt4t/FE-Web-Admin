<template>
    <v-dialog
        v-model="showModal"
        scrollable
        max-width="1400px"
        transition="dialog-transition"
        content-class="rounded-xl"
        >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text" v-if="data">
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> List Petani & Lahan FF
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text>
                <v-row class="align-center ma-0 my-2">
                    FF: {{ data ? data.ffName || '-' : '-' }}
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
                <table
                    id="tableForExportLahanPetaniDashboard"
                    border="1"
                    style="border-collapse: collapse;display: none;"
                >
                    <tr>
                        <th :colspan="table.headers.length">Tahun Program: {{ options.programYear }}</th>
                    </tr>
                    <tr>
                        <th :colspan="table.headers.length">Data Petani & Lahan FF {{ data ? data.ffName || '-' : '-' }}</th>
                    </tr>
                    <tr>
                        <td :colspan="table.headers.length">Export Time: {{ Date() }}</td>
                    </tr>
                    <tr>
                        <th v-for="header in table.headers" :key="`tableForExportLahanPetaniDashboard${header.value}`">
                            {{ header.text }}
                            <div v-if="header.value == 'land_area'">(m<sup>2</sup>)</div>
                            <div v-if="header.value == 'tutupan_lahan'">(%)</div>
                        </th>
                    </tr>
                    <tr v-for="(tableData, tableDataIndex) in tableItemsData" :key="`itemtableForExportLahanPetaniDashboard${tableDataIndex}`">
                        <th v-for="(itemTable, itemTableIndex) in table.headers" :key="`tableItemForExportLahanPetaniDashboard${itemTable.value}`">
                            <span v-if="itemTable.value == 'farmer_nik'">
                                '
                            </span>
                            <span v-if="itemTable.value == 'index'">
                                {{ tableDataIndex + 1 }}
                            </span>
                            <span v-else-if="itemTable.value == 'farmer_status'">
                                {{ tableData[itemTable.value] == 0 || tableData[itemTable.value] == 1 ? (tableData[itemTable.value] == 1 ? 'Terverifikasi' : 'Belum Verifikasi') : 'Belum Ada Data' }}
                            </span>
                            <span v-else-if="itemTable.value == 'lahan_approve'">
                                <span v-if="tableData.lahan_complete == 0 || (tableData.jenis_bibit && tableData.jenis_bibit.length == 0)">
                                    Belum Lengkap
                                </span>
                                <span v-else>
                                    {{ tableData[itemTable.value] == 0 || tableData[itemTable.value] == 1 ? (tableData[itemTable.value] == 1 ? 'Terverifikasi' : 'Belum Verifikasi') : 'Belum Ada Data' }}
                                </span>
                            </span>
                            <span v-else-if="itemTable.value == 'jenis_bibit'">
                                {{ tableData[itemTable.value] ? tableData[itemTable.value].toString() : '' }}
                            </span>
                            <span v-else>
                                {{ tableData[itemTable.value] }}
                            </span>
                        </th>
                    </tr>
                </table>
                <v-data-table
                    v-if="tableItems"
                    :headers="table.headers"
                    :items="tableItemsData"
                    class="elevation-1 rounded-xl"
                    :loading="table.loading.show"
                    :search="table.loading.search"
                    hide-default-footer
                    :items-per-page="-1"
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
                    <template v-slot:header.farmer_status>
                        Status Petani 
                        <v-menu
                            rounded="xl"
                            bottom
                            left
                            offset-y
                            transition="slide-y-transition"
                            :close-on-content-click="false"
                            content-class="rounded-xl">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :disabled="table.loading.show" v-bind="attrs" v-on="on" fab color="orange white--text" class="ml-1" x-small><v-icon>mdi-filter</v-icon></v-btn>
                            </template>
                            <v-card class="pa-2">
                            <v-card-text class="pa-0">
                                <v-select
                                color="success"
                                item-color="success"
                                :items="['Semua', 'Belum Verifikasi', 'Terverifikasi']"
                                :disabled="table.loading.show"
                                v-model="table.filters.farmer_status"
                                outlined
                                dense
                                hide-details
                                :menu-props="{
                                    bottom: true,
                                    offsetY: true,
                                    rounded: 'xl',
                                    transition: 'slide-y-transition',
                                }"
                                rounded
                                label="Filter Status"
                                ></v-select>
                            </v-card-text>
                            </v-card>
                        </v-menu>
                    </template>
                    <template v-slot:header.lahan_approve>
                        Status Petani 
                        <v-menu
                            rounded="xl"
                            bottom
                            left
                            offset-y
                            transition="slide-y-transition"
                            :close-on-content-click="false"
                            content-class="rounded-xl">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :disabled="table.loading.show" v-bind="attrs" v-on="on" fab color="orange white--text" class="ml-1" x-small><v-icon>mdi-filter</v-icon></v-btn>
                            </template>
                            <v-card class="pa-2">
                            <v-card-text class="pa-0">
                                <v-select
                                color="success"
                                item-color="success"
                                :items="['Semua', 'Belum Ada Data', 'Belum Lengkap', 'Belum Verifikasi', 'Terverifikasi']"
                                :disabled="table.loading.show"
                                v-model="table.filters.lahan_approve"
                                outlined
                                dense
                                hide-details
                                :menu-props="{
                                    bottom: true,
                                    offsetY: true,
                                    rounded: 'xl',
                                    transition: 'slide-y-transition',
                                }"
                                rounded
                                label="Filter Status"
                                ></v-select>
                            </v-card-text>
                            </v-card>
                        </v-menu>
                    </template>
                    <template v-slot:item.index="{ index }">
                        <div>
                            {{ index + 1 }}
                        </div>
                    </template>
                    <template v-slot:item.farmer_status="{ item }">
                        <v-chip :color="`${item.farmer_status ? 'green' : 'orange'} white--text`" class="pl-0">
                            <v-icon class="mx-1">mdi-{{ item.farmer_status ? 'check' : 'close' }}-circle</v-icon>{{ item.farmer_status ? 'Terverifikasi' : 'Belum Verifikasi' }}
                        </v-chip>
                    </template>
                    <template v-slot:item.lahan_approve="{ item }">
                        <v-chip v-if="!item.lahan_no" :color="`red white--text`" class="pl-0">
                            <v-icon class="mx-1">mdi-close-circle</v-icon>Belum Ada Data
                        </v-chip>
                        <v-chip v-else-if="item.lahan_complete == 0 || item.jenis_bibit.length == 0" :color="`red white--text`" class="pl-0">
                            <v-icon class="mx-1">mdi-close-circle</v-icon>Belum Lengkap
                        </v-chip>
                        <v-chip v-else :color="`${item.lahan_approve && item.jenis_bibit.length > 0 ? 'green' : 'orange'} white--text`" class="pl-0">
                            <v-icon class="mx-1">mdi-{{ item.lahan_approve && item.jenis_bibit.length > 0 ? 'check' : 'close' }}-circle</v-icon>{{ item.lahan_approve && item.jenis_bibit.length > 0 ? 'Terverifikasi' : 'Belum Verifikasi' }}
                        </v-chip>
                    </template>
                    <template v-slot:item.land_area="{ item }">
                        <div>
                            {{ _utils.numberFormat(item.land_area) }} m<sup>2</sup>
                        </div>
                    </template>
                    <template v-slot:item.tutupan_lahan="{ item }">
                        <div>
                            {{ item.tutupan_lahan }}%
                        </div>
                    </template>
                    <template v-slot:item.action="{ index, item }">
                        <v-btn small rounded color="green white--text" class="pl-1"
                            @click="modalActions(true, item.ff_no)"
                        >
                            <v-icon class="mr-1">mdi-information</v-icon>
                            Detail
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
            <v-card-actions class="justify-center align-center">
                <v-btn :disabled="table.loading.show" color="green white--text" rounded @click="downloadExcel()"><v-icon class="mr-1">mdi-microsoft-excel</v-icon> Unduh Excel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Swal from 'sweetalert2'

export default {
    name: 'OldGEKOFarmerLahanDetail',
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
        options: {
            programYear: '',
        },
        table: {
            filters: {
                farmer_status: 'Semua',
                lahan_approve: 'Semua',
            },
            headers: [
                {text: 'No', value: 'index', width: 75},
                {text: 'Desa', value: 'desa_name'},
                {text: 'Kode FF', value: 'ff_no'},
                {text: 'Nama FF', value: 'ff_name'},
                {text: 'Status Petani', value: 'farmer_status', sortable: false},
                {text: 'Kode Petani', value: 'farmer_no'},
                {text: 'Nama Petani', value: 'farmer_name'},
                {text: 'NIK Petani', value: 'farmer_nik'},
                {text: 'Status Lahan', value: 'lahan_approve', sortable: false},
                {text: 'Kode Lahan', value: 'lahan_no'},
                {text: 'Luas Lahan', value: 'land_area'},
                {text: 'Pola Tanam', value: 'opsi_pola_tanam'},
                {text: 'Tutupan Lahan', value: 'tutupan_lahan'},
                {text: 'Jenis Bibit', value: 'jenis_bibit'},
                {text: 'Total KAYU', value: 'pohon_kayu'},
                {text: 'Total MPTS', value: 'pohon_mpts'},
            ],
            items: [],
            items_raw: [],
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
                if (this.show && this.data.ff_no && this.data.programYear) {
                    this.options.programYear = this.data.programYear
                }
                return this.show
            },
            set: function(newVal) {
                if (!newVal) this.$emit('dialogActions', false)
            }
        },
        tableItems() {
            if (this.show && this.data.ff_no && this.options.programYear) {
                this.getTableData({
                    program_year: this.options.programYear,
                    ff_no: this.data.ff_no
                })
            }
            return true
        },
        tableItemsData() {
            let raw = this.table.items_raw
            const filFarStat = this.table.filters.farmer_status
            if (filFarStat) if (filFarStat != 'Semua') {
                raw = raw.filter(n => filFarStat == 'Terverifikasi' ? n.farmer_status == 1 : n.farmer_status == 0)
            }
            const filLahStat = this.table.filters.lahan_approve
            if (filLahStat) if (filLahStat != 'Semua') {
                if (filLahStat == 'Belum Ada Data') {
                    raw = raw.filter(n => !n.lahan_no)
                }
                if (filLahStat == 'Belum Lengkap') {
                    raw = raw.filter(n => ((n.jenis_bibit && n.jenis_bibit.length == 0) || (n.lahan_approve == 0 && n.lahan_complete == 0)))
                }
                if (filLahStat == 'Belum Verifikasi') {
                    raw = raw.filter(n => n.lahan_approve == 0 && n.lahan_complete == 1)
                }
                if (filLahStat == 'Terverifikasi') {
                    raw = raw.filter(n => n.lahan_approve == 1 && n.lahan_complete == 1 && n.jenis_bibit.length > 0)
                }
            }
            return raw
        }
    },
    mounted() {
        
    },

    methods: {
        downloadExcel() {
            const table = document.getElementById("tableForExportLahanPetaniDashboard");
            const wb = XLSX.utils.table_to_book(table);

            /* Export to file (start a download) */
            XLSX.writeFile(wb, `LahanPetani${this.options.programYear}-${this.data.ff_no}.xlsx`);
        },
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
        async getTableData(getparams) {
            try {
                this.table.loading.show = true
                const params = new URLSearchParams(getparams)
                const url = `Dashboard/DetailPetaniLahan?${params}`
                const call = await axios.get(this.$store.getters.getApiUrl(url), this.$store.state.apiConfig)
                const data = call.data
                this.table.items = data
                this.table.items_raw = data
            } catch (err) {this.errorResponse(err)} finally {
                this.table.loading.show = false
            }
        }
    },
};
</script>