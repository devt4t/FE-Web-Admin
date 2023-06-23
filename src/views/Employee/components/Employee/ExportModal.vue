<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="1200px"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="mb-1 headermodalstyle rounded-xl">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-account</v-icon></v-btn> Export Excel Preview</span>
                <v-icon color="red lighten-1" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text>
                <!-- Loading -->
                <v-overlay absolute :value="loading.show">
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
                    </div>
                </v-overlay>
                <!-- Table Preview -->
                <table id="tableForExport" style="border-collapse: collapse;min-height: 400px;">
                    <thead>
                        <tr>
                            <th colspan="8" style="text-align: left;">{{ download.title }}</th>
                        </tr>
                        <tr>
                            <td colspan="8" style="text-align: left;">Export Time: {{ Date() }}</td>
                        </tr>
                        <tr>
                            <td colspan="8" style="text-align: left;">Total Lahan: {{ table.data.length }}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <th>No</th>
                            <th>MU</th>
                            <th>TA</th>
                            <th>Desa</th>
                            <th>Nama Petani</th>
                            <th>No Lahan</th>
                            <th>No SPPT</th>
                            <th>Tahun Tanam</th>
                            <th>Monitoring No</th>
                            <th v-for="trees in table.trees" :key="`trees-header-${trees.tree_code}`">{{ trees.tree_name }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(e, i) in table.data" :key="`table-row-${i}`">
                            <td>{{ i + 1 }}</td>
                            <td>{{ e.mu_name }}</td>
                            <td>{{ e.ta_name }}</td>
                            <td>{{ e.village_name }}</td>
                            <td>{{ e.farmer_name }}</td>
                            <td>{{ e.lahan_no }}</td>
                            <td>{{ e.document_no }}</td>
                            <td>{{ e.program_year }}</td>
                            <td>{{ e.monitoring_no }}</td>
                            <td v-for="trees in table.trees" :key="`trees-column-${trees.tree_code}`">{{ e[trees.tree_code] || 0 }}</td>
                        </tr>
                    </tbody>
                </table>
            </v-card-text>
            <v-card-actions>
                <v-divider class="mr-2"></v-divider>
                <v-btn color="blue white--text" rounded @click="() => downloadExcel()"><v-icon>mdi-download</v-icon> Download</v-btn>
                <v-divider class="ml-2"></v-divider>
            </v-card-actions>
        </v-card>
    </v-dialog>
    
</template>

<script>
import axios from 'axios';
import LottieAnimation from 'lottie-web-vue'

import treeAnimation from '@/assets/lottie/tree.json'

export default {
    components: {
        LottieAnimation
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: []
        },
    },
    data: () => ({
        download: {title: 'Export LAHAN 2021 & 2022 (SPPT Required & Plants)'},
        loading: {
            show: false,
            text: ''
        },
        lottie: {
            data: {
                loading: treeAnimation,
            }
        },
        table: {
            data: [],
            trees: []
        }
    }),
    computed: {
        showModal: {
            get: function () {
                if (this.show) this.getTableData()
                return this.show
            },
            set: function(newVal) {
                if (newVal == false) this.$emit('close')
            }
        }
    },
    watch: {
        'table.data': {
            handler(val) {
                console.log(val)
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
                const list_um = ['04-0006','04-0030','04-0019','04-0041','04-0018','04-0009','04-0007','04-0015','04-0037','09-00998','04-0050','01-0002']
                // const list_um = ['04-0037']
                let um_done = 0
                let store = this.$store
                loading.text = `Getting data UM ${um_done} / ${list_um.length}...`
                for (let um_index = 0; um_index < list_um.length; um_index++) {
                    let fc_done = 0
                    const res_fc = await axios.get(store.getters.getApiUrl(`GetEmployeebyManager?position=19&manager_code=${list_um[um_index]}`), store.state.apiConfig)
                    const list_fc = res_fc.data.data.result.data.map(fc_val => {return fc_val.nik})
                    // const list_fc = ['2234']
                    loading.text = `Done UM ${um_done} / ${list_um.length} FC ${fc_done} / ${list_fc.length}...`
                    // console.log(list_fc)
                    for (let fc_index = 0; fc_index < list_fc.length; fc_index++) {
                        const res_data = await axios.get(store.getters.getApiUrl(`GetDataLahanByDocumentSPPT?fc_no=${list_fc[fc_index]}`), store.state.apiConfig)
                        const list_table = res_data.data.data
                        if (this.table.trees.length === 0 ) this.table.trees = res_data.data.trees
                        this.table.data.push(...list_table)
                        fc_done += 1
                        loading.text = `Done UM ${um_done} / ${list_um.length} FC ${fc_done} / ${list_fc.length}...`
                    }
                    um_done += 1
                    this.download.title = this.download.title + ' ' + um_done
                    this.downloadExcel()
                    loading.text = `Done UM ${um_done} / ${list_um.length} FC ${fc_done} / ${list_fc.length}...`
                    if (um_done === list_um.length && fc_done === list_fc.length) loading.show = false
                }
                console.log(this.table)
            } finally {
                this.loading.show = false
            }
        },
    }
}
</script>