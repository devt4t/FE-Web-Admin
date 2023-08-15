<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="1200px"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="mb-1 green darken-1 rounded-xl pa-2 pr-3 ma-1">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-account</v-icon></v-btn> Export Excel</span>
                <v-icon color="white lighten-1" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text>
                <!-- Loading -->
                <v-overlay absolute :value="loading.show" class="rounded-xl">
                    <div class="d-flex flex-column justify-center align-center">
                        <LottieAnimation
                            ref="anim"
                            :animationData="lottie.data.loading"
                            :loop="true"
                            style="height: 64px;"
                        />
                        <p class="mt-2 mb-0">{{ loading.text }}
                            <v-progress-circular
                                :size="17"
                                :width="3"
                                indeterminate
                                color="white"
                            >
                            </v-progress-circular>
                        </p>
                        <v-progress-linear
                            v-model="loading.progress"
                            color="blue-grey"
                            height="25"
                        >
                        <template v-slot:default="{ value }">
                            <strong>{{ Math.ceil(value) }}%</strong>
                        </template>
                        </v-progress-linear>
                    </div>
                </v-overlay>
                <!-- Table Preview -->
                <table id="tableForExport" style="border-collapse: collapse;min-height: 400px;">
                    <thead>
                        <tr>
                            <th colspan="8" style="text-align: left;">{{ download.title }}</th>
                        </tr>
                        <tr>
                            <td colspan="8" style="text-align: left;">Tahun Program: {{ programYear }}</td>
                        </tr>
                        <tr>
                            <td colspan="8" style="text-align: left;">Export Time: {{ Date() }}</td>
                        </tr>
                        <tr>
                            <td colspan="8" style="text-align: left;">Total Data: {{ table.data.length }}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <th>No</th>
                            <th v-for="(header, headerIndex) in table.fields" :key="`headerTbl-${headerIndex}`">
                                {{ header.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(e, i) in table.data" :key="`table-row-${i}`">
                            <td>{{ i + 1 }}</td>
                            <td v-for="(item, itemIndex) in table.fields" :key="`itemTbl-${itemIndex}`">
                                {{ e[item.key] }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    rounded
                    outlined
                    :disabled="loading.show"
                    class="my-4"
                    @click="downloadExcel()"
                    color="green"
                    block
                >
                    <v-icon class="mr-1 ">mdi-microsoft-excel</v-icon> Download Excel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import LottieAnimation from 'lottie-web-vue'

import treeAnimation from '@/assets/lottie/tree.json'
export default {
    name: 'OldGekoExport',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        programYear: {
            type: String,
            default: ''
        },
        defaultData: {
            type: Array,
            default: []
        }
    },

    components: {
        LottieAnimation
    },

    data: () => ({
        download: {title: 'Export Lahan'},
        loading: {
            progress: 0,
            show: false,
            text: ''
        },
        lottie: {
            data: {
                loading: treeAnimation,
            }
        },
        table: {
            fields: [
                {label: 'Management Unit', key: 'mu_name'},
                {label: 'Unit Manager', key: 'um_name'},
                {label: 'Target Area', key: 'ta_name'},
                {label: 'Field Coordinator', key: 'fc_name'},
                {label: 'Field Facilitator', key: 'ff_name'},
                {label: 'Desa', key: 'village_name'},
                {label: 'Petani', key: 'farmer_name'},
                {label: 'Status Petani', key: 'farmer_status'},
                {label: 'Jenis Bibit', key: 'seeds_name'},
                {label: 'Kayu', key: 'total_wood'},
                {label: 'Mpts', key: 'total_mpts'},
                {label: 'Total', key: 'total_wood_mpts'},
                {label: 'Status Lahan', key: 'land_status'},
            ],
            data: [],
            trees: []
        }
        
    }),

    computed: {
        showModal: {
            get: function () {
                return this.show
            },
            set: function(newVal) {
                if (newVal == false) this.$emit('close')
            }
        }
    },
    
    watch: {
        show: {
            async handler(val) {
                if (val) this.getTableData()
            }
        }
    },

    mounted() {
        
    },

    methods: {
        downloadExcel() {
            const table = document.getElementById("tableForExport");
            const wb = XLSX.utils.table_to_book(table);

            /* Export to file (start a download) */
            XLSX.writeFile(wb, `${this.download.title}.xlsx`);
        },
        async getTableData() {
            try {
                let loading = this.loading
                this.table.data = []
                loading.show = true
                loading.text = 'Preparing data...'
                loading.progress = 0
                let store = this.$store
                const farmer_no = this.defaultData.map(val => {return val.kode})
                console.log(this.defaultData)
                const perCall = 100
                const totalLoop = Math.ceil(farmer_no.length/perCall)
                console.log(totalLoop)
                for (let index = 0; index < totalLoop; index++) {
                    const newFarmerNo = JSON.parse(JSON.stringify(farmer_no)).slice(index * perCall, (index + 1) * perCall)
                    const url = store.getters.getApiUrl(`ExportFarmerAllAdminNew`)
                    const callData = await axios.post(url, {
                        program_year: this.programYear,
                        farmer_no: newFarmerNo
                    }, store.state.apiConfig)
                    this.table.data.push(...callData.data)
                    loading.progress = Math.round((100 / totalLoop) * (index + 1))
                }
            } finally {
                if (this.table.data.length > 0) this.downloadExcel()
                this.loading.show = false
                this.loading.progress = 100
            }
        },
    },
};
</script>