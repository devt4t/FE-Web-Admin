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
                <v-btn
                    rounded
                    outlined
                    :disabled="loading.show"
                    class="my-4"
                    @click="startGettingData()"
                    color="green"
                    block
                >
                    <v-icon class="mr-1 ">mdi-play-circle</v-icon> Mulai Ambil Data
                </v-btn>
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
                                <span v-if="item.type == 'number'">
                                    {{ e[item.key] || 0 }}
                                </span>
                                <span v-else>
                                    {{ e[item.key] }}
                                </span>
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
        config: {
            type: Object,
            default: null
        }
    },

    components: {
        LottieAnimation
    },

    data: () => ({
        programYear: '',
        download: {
            title: 'Export Data'
        },
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
            fields: [],
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
                if (val) await this.initialize()
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
        async initialize() {
            try {
                let loading = this.loading
                const config = this.config
                loading.show = true
                loading.text = 'Menyiapkan kolom data...'
                this.table.data = []
                this.table.fields = []

                this.download.title = config.title
                if (config.fields.find(v => v.id === 'start_date') && config.fields.find(v => v.id === 'end_date'))this.download.title += ` ${config.fields.find(v => v.id === 'start_date').model} ~ ${config.fields.find(v => v.id === 'end_date').model}`

                this.programYear = config.fields.find(v => v.id === 'program_year').model
                this.table.fields = config.fields.filter(v => v.list).map(val => {
                    return {
                        label: val.label,
                        key: val.id
                    }
                })
            } finally {
                this.loading.show = false
                this.loading.progress = 100
            }
        },
        // get data functions
        async getFarmerData() { 
            let loading = this.loading
            const config = this.config
            let store = this.$store

            const getFarmerParams = new URLSearchParams({})
            config.fields.filter(v => v.filter).map(val => {
                getFarmerParams.append(val.id, val.model)
            }) 
            const farmer_no = await axios.get(
                store.getters.getApiUrl(`TempGetFarmerNoPeriod?${getFarmerParams}`),
                store.state.apiConfig
            ).then(response => {return response.data})
            if (farmer_no) {
                if (farmer_no.length > 0) {
                    const perCall = 100
                    const totalLoop = Math.ceil(farmer_no.length/perCall)
                    for (let index = 0; index < totalLoop; index++) {
                        const newFarmerNo = JSON.parse(JSON.stringify(farmer_no)).slice(index * perCall, (index + 1) * perCall)
                        const url = store.getters.getApiUrl(`TempExportFarmer`)
                        const callData = await axios.post(url, {
                            program_year: this.programYear,
                            farmer_no: newFarmerNo
                        }, store.state.apiConfig)
                        this.table.data.push(...callData.data)
                        loading.progress = Math.round((100 / totalLoop) * (index + 1))
                    }
                }
            }
        },
        async getLandSpptData() {
            let loading = this.loading
            let store = this.$store
            const config = this.config

            const getLahanParams = new URLSearchParams({})
            config.fields.filter(v => v.filter).map(val => {
                getLahanParams.append(val.id, val.model)
            }) 
            const lahan_no = await axios.get(
                store.getters.getApiUrl(`TempGetLahanNoSppt?${getLahanParams}`),
                store.state.apiConfig
            ).then(response => {return response.data})
            console.log(lahan_no)
            if (lahan_no) {
                if (lahan_no.length > 0) {
                    const perCall = 100
                    const totalLoop = Math.ceil(lahan_no.length/perCall)
                    for (let index = 0; index < totalLoop; index++) {
                        const lahanNoQueue = JSON.parse(JSON.stringify(lahan_no)).slice(index * perCall, (index + 1) * perCall)
                        const url = store.getters.getApiUrl(`TempGetLahanSppt`)
                        const callData = await axios.post(url, {
                            program_year: this.programYear,
                            lahan_no: lahanNoQueue
                        }, store.state.apiConfig)
                        this.table.data.push(...callData.data)
                        loading.progress = Math.round((100 / totalLoop) * (index + 1))
                    }
                }
            }
        },
        async getLandSeeds() {
            let loading = this.loading
            let store = this.$store
            const config = this.config

            const getLahanParams = new URLSearchParams({})
            config.fields.filter(v => v.filter).map(val => {
                getLahanParams.append(val.id, val.model)
            }) 
            const lahan_no = await axios.get(
                store.getters.getApiUrl(`TempGetLahanAll?${getLahanParams}`),
                store.state.apiConfig
            ).then(response => {return response.data})
            const trees = await axios.get(
                store.getters.getApiUrl(`GetTreesAll`),
                store.state.apiConfig
            ).then(response => {return response.data.data.result.data})
            const tree_codes = trees.map(val => {
                this.table.fields.push({
                    label: val.tree_name,
                    key: `tree_${val.tree_code}`,
                    type: 'number'
                })
                return val.tree_code
            })
            if (lahan_no) {
                if (lahan_no.length > 0) {
                    const perCall = 100
                    const totalLoop = Math.ceil(lahan_no.length/perCall)
                    for (let index = 0; index < totalLoop; index++) {
                        const lahanNoQueue = JSON.parse(JSON.stringify(lahan_no)).slice(index * perCall, (index + 1) * perCall)
                        const url = store.getters.getApiUrl(`TempGetLahanSeeds`)
                        const callData = await axios.post(url, {
                            program_year: this.programYear,
                            lahan_no: lahanNoQueue
                        }, store.state.apiConfig)
                        this.table.data.push(...callData.data)
                        loading.progress = Math.round((100 / totalLoop) * (index + 1))
                    }
                }
            }
        },
        async getLandCompleteWithoutSeeds() {
            let loading = this.loading
            let store = this.$store
            const config = this.config

            const getLahanParams = new URLSearchParams({})
            config.fields.filter(v => v.filter).map(val => {
                getLahanParams.append(val.id, val.model)
            }) 
            getLahanParams.append('province', 'Jawa Barat')
            const lahan_no = await axios.get(
                store.getters.getApiUrl(`TempGetLahanAll?${getLahanParams}`),
                store.state.apiConfig
            ).then(response => {return response.data})
            
            if (lahan_no) {
                if (lahan_no.length > 0) {
                    const perCall = 200
                    const totalLoop = Math.ceil(lahan_no.length/perCall)
                    for (let index = 0; index < totalLoop; index++) {
                        const lahanNoQueue = JSON.parse(JSON.stringify(lahan_no)).slice(index * perCall, (index + 1) * perCall)
                        const url = store.getters.getApiUrl(`TempGetLahanCompleteWithoutSeeds`)
                        const callData = await axios.post(url, {
                            program_year: this.programYear,
                            lahan_no: lahanNoQueue
                        }, store.state.apiConfig)
                        this.table.data.push(...callData.data)
                        loading.progress = Math.round((100 / totalLoop) * (index + 1))
                    }
                }
            }
        },
        // reminder :)
        async sendEmailToYongs(message = null) {
            const params = new URLSearchParams({
                message: message || ''
            })
            await axios.get(
                this.$store.getters.getApiUrl(`EmailToYongs?${params}`),
                this.$store.state.apiConfig
            )
        },
        async startGettingData() {
            let loading = this.loading
            const config = this.config
            try {
                loading.show = true
                loading.text = 'Mengambil data...'
                loading.progress = 0

                if (config.section == 'farmer') {
                    await this.getFarmerData()
                } 
                if (config.section == 'land-sppt') {
                    await this.getLandSpptData()
                }
                if (config.section == 'land-seeds') {
                    await this.getLandSeeds()
                }
                if (config.section == 'land-complete-without-seeds') {
                    await this.getLandCompleteWithoutSeeds()
                }
                if (this.table.data.length > 0) {
                    let emailMessage = config.title || ''
                    await this.sendEmailToYongs(emailMessage)
                    this.downloadExcel()
                }
            } finally {
                this.loading.show = false
                this.loading.progress = 100
            }
        }
    },
};
</script>