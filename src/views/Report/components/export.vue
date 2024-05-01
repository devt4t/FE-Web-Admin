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
                const showFields = config.fields.find(v => v.id === 'show_fields')
                if (showFields) if (showFields.model.length > 0) {
                    const fields = showFields.model.map(val => {
                        return {
                            label: val,
                            key: val
                        }
                    })
                    this.table.fields.push(...fields)
                }
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
                        const existLahanNo = this.table.data.map(val => { return val.lahan_no })
                        const newLahanData = callData.data.filter(val => !existLahanNo.includes(val.lahan_no))
                        if (newLahanData) if (newLahanData instanceof Array) if (newLahanData.length > 0) {
                            this.table.data.push(...newLahanData)
                        }
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
                        const existLahanNo = this.table.data.map(val => { return val.lahan_no })
                        const newLahanData = callData.data.filter(val => !existLahanNo.includes(val.lahan_no))
                        if (newLahanData) if (newLahanData instanceof Array) if (newLahanData.length > 0) {
                            this.table.data.push(...newLahanData)
                        }
                        loading.progress = Math.round((100 / totalLoop) * (index + 1))
                    }
                }
            }
        },
        async getLandCompleteWithoutSeeds(py, mu, page, per_page) {
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
        // sostam
        async getSostamPaginate(py, mu, page, per_page){
            let store = this.$store
            const data = await axios.get(
                store.getters.getApiUrl(`TempExportSostam?program_year=${py}&mu_no=${mu}&page=${page}&per_page=${per_page}`),
                store.state.apiConfig
            ).then(res => res.data)
            for (const[indexSostam, valSostam] of Object.entries(data.listData)){
                const generateData = {
                    ...valSostam,
                    program_year: valSostam.planting_year,
                    form_no: valSostam.form_no,
                    ff_name: valSostam.ff,
                    mu_name: valSostam.nama_mu,
                    kecamatan_name: valSostam.kecamatan,
                    desa_name: valSostam.desa,
                    lahan_no: valSostam.lahanNo,
                    socialization_date: valSostam.soc_date,
                    kayu_amount: valSostam.pohon_kayu, 
                    mpts_amount: valSostam.pohon_mpts,
                    seed_total: valSostam.max_seed_amount,
                    penlub_date: valSostam.pembuatan_lubang_tanam,
                    distribution_time: valSostam.distribution_time,
                    distribution_coordinate: valSostam.distribution_coordinates,
                    distribution_location: valSostam.distribution_location,
                    planting_date: valSostam.planting_time,
                    is_verified: valSostam.status,
                }
                this.table.data.push(generateData)
            }

            return data
            // console.log(data)
        },
        async getSostam(){
            let loading = this.loading
            const config = this.config
            
            const monitoring3Params = new URLSearchParams({})
            config.fields.filter(v => v.filter).map(val => {
                monitoring3Params.append(val.id, val.model)
            })

            const management_unit = config.fields.find(v => v.id == 'mu_name').model
            const programYear = config.fields.find(v => v.id == 'program_year').model

            console.log(programYear+', '+management_unit + ' & '+ this.$store.state.User.email) 

            const dataSostam = await this.getSostamPaginate(programYear, management_unit, 1, 200)
            dataSostam.trees.map(val => {
                this.table.fields.push({
                    label: val.tree_name + ' - ' + val.category,
                    key: `tree_${val.tree_code}`,
                    type: 'number'
                })
            });
            if(dataSostam.sourceData.last_page > 1){
                for (let index = 1; index <= dataSostam.sourceData.last_page; index++){
                    console.log(index)
                    loading.progress = Math.round((100 / dataSostam.sourceData.last_page) * (index))
                    await this.getSostamPaginate(programYear, management_unit, index + 1, 200)
                }
            }
        },

        async getMonitoring(num) {
            let loading = this.loading
            let store = this.$store
            const config = this.config
            
            const monitoringParams = new URLSearchParams({})
            config.fields.filter(v => v.filter).map(val => {
                monitoringParams.append(val.id, val.model)
            })

            const areaCode = config.fields.find(v => v.id == 'ta_name').model
            const programYear = config.fields.find(v => v.id == 'program_year').model

            // get trees code
            // const trees = await axios.get(
            //     store.getters.getApiUrl(`GetTreesAll`),
            //     store.state.apiConfig
            // ).then(response => {return response.data.data.result.data})
            // const tree_codes = trees.map(val => {
            //     this.table.fields.push({
            //         label: val.tree_name,
            //         key: `tree_${val.tree_code}`,
            //         type: 'number'
            //     })
            //     return val.tree_code
            // })
            
            const ffNo = await axios.get(
                store.getters.getApiUrl(`getFFbyTA?area_code=${areaCode}`),
                store.state.apiConfig
            ).then(res => res.data.data.result.data)
            
            const dataRekap = []
            for (const[indexF, valFF] of Object.entries(ffNo)) {
                loading.progress = Math.round((indexF / ffNo.length) * 100)
                
                const dataMonitoring = await axios.get(
                    store.getters.getApiUrl(`TempExportMonitoring?program_year=${programYear}&land_program=Petani&ff=${valFF.ff_no}`),
                    store.state.apiConfig
                ).then(res => res.data)

                // const seedStatus = ['dead','life','lost','planted_life']
                const seedStatus = ['planted_life']
                // set trees headers
                if (indexF == 0) {
                    dataMonitoring.trees.map(val => {
                        seedStatus.map((ss, ssIndex) => {
                            // if(ss == 'planted_life') ss='Ditanam Hidup'
                            // else if(ss == 'life') ss='Hidup'
                            // else if(ss == 'dead') ss='Mati'
                            // else if(ss == 'lost') ss='Hilang'
                            this.table.fields.push({
                                label: val.tree_name + ' - ' + ss,
                                key: `tree_${val.tree_code}-${ss}`,
                                type: 'number'
                            })
                        })
                    })
                }
                for (const[indexMon, valMon] of Object.entries(dataMonitoring.data)) {
                    for (const[indexLahan, valLahan] of Object.entries(valMon.lahan_no)) {
                        const dataGenerate = {
                            ...valMon,
                            project: 'undefined',
                            access_lahan: valMon.access_lahan[indexLahan] || '???',
                            coordinate: valMon.coordinate[indexLahan] || '???',
                            document_no: `'${valMon.document_no[indexLahan]}`,
                            lahan_no: valLahan,
                            land_area: valMon.land_area[indexLahan] || '???',
                            land_distance: valMon.land_distance[indexLahan] || '???',
                            land_status: valMon.land_status[indexLahan] || '???',
                            planting_area: valMon.planting_area[indexLahan] || '???',
                            planting_pattern: valMon.planting_pattern[indexLahan] || '???',
                            farmer_address: `${valMon.farmer_address} RT${valMon.farmer_rt}/RW${valMon.farmer_rw}`,
                            ktp_no: `'${valMon.ktp_no}`,
                            is_validate: valMon.is_validate == 2 ? 'UM' : valMon.is_validate == 1 ? 'FC' : 'Belum',
                            total_detail: valMon.tree_details.map(val1 => {
                                return val1.planted_life
                            }).reduce((acc, val)=>{
                                return acc + parseInt(val)
                            },0),
                        }
                        valMon.tree_details.map(treeD => {
                            seedStatus.map(seedStat => {
                                dataGenerate[`tree_${treeD.tree_code}-${seedStat}`] = treeD[seedStat]
                            })
                        })
                        this.table.data.push(dataGenerate)
                   }
                }
            }
        },
        // monitoring 2
        async getPaginationMo2(page,per_page, py, ta){
            
            let store = this.$store
            const data = await axios.get(
                store.getters.getApiUrl(`TempExportMonitoring2?program_year=${py}&ta_no=${ta}&page=${page}&per_page=${per_page}`),
                store.state.apiConfig
            ).then(res => res.data)
            console.log(data.data)
            for (const[indexMon, valMon] of Object.entries(data.data.result.datas.data)) {
                
                const dataGenerate = {
                    ...valMon,
                    project: 'undefined',
                    monitorng2_no: valMon.monitoring2_no || '???',
                    program_year: valMon.program_year || '???',
                    mu_name: valMon.mu_name || '???',
                    ta_name: valMon.ta_name || '???',
                    village_name: valMon.village_name || '???',
                    ff_name: valMon.ff_name || '???',
                    farmer_name: valMon.ff_name || '???',
                    lahan_type: valMon.lahan_type || '???',
                    lahan_no: valMon.lahan_no || '???',
                    is_validate: valMon.is_verified == 2 ? 'UM: '+valMon.verified_by : valMon.is_validate == 1 ? 'FC: '+valMon.verified_by : 'Belum Terverifikasi',

                    last_kayu_amount: valMon.last_kayu_amount || '0',
                    last_mpts_amount: valMon.last_mpts_amount || '0',
                    last_kayu_mpts_amount: valMon.last_kayu_mpts_amount || '0',

                    total_kayu: valMon.total_kayu || '0',
                    total_mpts: valMon.total_mpts || '0',
                    total_kayu_mpts: valMon.total_kayu_mpts || '0',

                }
                
                this.table.data.push(dataGenerate)
                
            }
            return data.data.result.datas
        },
        async getMonitoring2(){
            let loading = this.loading
            const config = this.config
            
            const monitoring2Params = new URLSearchParams({})
            config.fields.filter(v => v.filter).map(val => {
                monitoring2Params.append(val.id, val.model)
            })

            const target_area = config.fields.find(v => v.id == 'ta_name').model
            const programYear = config.fields.find(v => v.id == 'program_year').model

            console.log(programYear+', '+target_area)

            const dataMonitoring = await this.getPaginationMo2(1, 10,programYear, target_area)
            // const totalPageMo2 = dataMonitoring.last_page
            // console.log(totalPageMo2)

            if(dataMonitoring.last_page > 1){
                for (let index = 1; index <= dataMonitoring.last_page; index++) {
                    loading.progress = Math.round((100 / dataMonitoring.last_page) * (index))
                    
                    await this.getPaginationMo2(index+1, 10, programYear, target_area )
                }
            }
            
        },

        // monitoring 3
        async getPaginationMo3(page,per_page, py, mu){
            
            let store = this.$store
            const data = await axios.get(
                store.getters.getApiUrl(`TempExportMonitoring3?program_year=${py}&mu_no=${mu}&page=${page}&per_page=${per_page}`),
                store.state.apiConfig
            ).then(res => res.data)
            console.log(data.data)
            for (const[indexMon, valMon] of Object.entries(data.data.result.datas.data)) {
                
                const dataGenerate = {
                    ...valMon,
                    project: 'undefined',
                    monitorng2_no: valMon.monitoring2_no || '???',
                    program_year: valMon.program_year || '???',
                    mu_name: valMon.mu_name || '???',
                    ta_name: valMon.ta_name || '???',
                    village_name: valMon.village_name || '???',
                    ff_name: valMon.ff_name || '???',
                    farmer_name: valMon.ff_name || '???',
                    lahan_type: valMon.lahan_type || '???',
                    lahan_no: valMon.lahan_no || '???',
                    is_validate: valMon.is_verified == 2 ? 'UM: '+valMon.verified_by : valMon.is_validate == 1 ? 'FC: '+valMon.verified_by : 'Belum Terverifikasi',

                    last_kayu_amount: valMon.last_kayu_amount || '0',
                    last_mpts_amount: valMon.last_mpts_amount || '0',
                    last_kayu_mpts_amount: valMon.last_kayu_mpts_amount || '0',

                    total_kayu: valMon.total_kayu || '0',
                    total_mpts: valMon.total_mpts || '0',
                    total_kayu_mpts: valMon.total_kayu_mpts || '0',

                }
                
                this.table.data.push(dataGenerate)
                
            }
            return data.data.result.datas
        },
        async getMonitoring3(){
            let loading = this.loading
            const config = this.config
            
            const monitoring3Params = new URLSearchParams({})
            config.fields.filter(v => v.filter).map(val => {
                monitoring3Params.append(val.id, val.model)
            })

            const management_unit = config.fields.find(v => v.id == 'mu_name').model
            const programYear = config.fields.find(v => v.id == 'program_year').model

            console.log(programYear+', '+management_unit)

            const dataMonitoring = await this.getPaginationMo3(1, 10,programYear, management_unit)

            if(dataMonitoring.last_page > 1){
                for (let index = 1; index <= dataMonitoring.last_page; index++) {
                    loading.progress = Math.round((100 / dataMonitoring.last_page) * (index))
                    
                    await this.getPaginationMo3(index+1, 10, programYear, management_unit )
                }
            }
            
        },
        // reminder :)
        async sendEmailToYongs(message = null) {
            const params = new URLSearchParams({
                message: message || '',
                sender: this.$store.state.User.email || 'eaunggelia.triandi@trees4trees.org'
            })
            await axios.get(
                this.$store.getters.getApiUrl(`EmailToYongs?${params}`),
                this.$store.state.apiConfig
            )
        },
        // start load data
        async startGettingData() {
            let loading = this.loading
            const config = this.config
            try {
                this.table.data = []
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
                if (config.section == 'sostam-complete-with-seed') {
                    await this.getSostam()
                }
                if (config.section == 'export-monitoring') {
                    await this.getMonitoring(1)
                }
                if (config.section == 'export-monitoring2') {
                    await this.getMonitoring2()
                }
                if (config.section == 'export-monitoring3') {
                    await this.getMonitoring3()
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