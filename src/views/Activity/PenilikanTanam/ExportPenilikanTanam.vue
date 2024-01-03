<template>
    <v-dialog
        v-model="showModal"
        scrollable
        max-width="2500px"
        transition="dialog-transition"
        content-class="rounded-xl"
        >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Export Monitoring 1 + Distribution Report
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text>
                    <!-- Loading -->
                    <v-overlay absolute :value="table.loading.show" class="rounded-xl">
                        <div class="d-flex flex-column justify-center align-center">
                            <p class="mt-2 mb-0"> {{table.loading.text}}
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
    
                <table
                    id="tabelForExportMonitoring1"
                    
                    style="border: 2px solid black;border-collapse: collapse; min-height: 200px"
                >
                    <tr>
                        <th :colspan="table.headers.length + (4 * 3)" align="center" style="text-align: center;font-size: 15px;">
                            Export Realisasi Tanam Tahun Program: {{ this.program_year }}</th>
                    </tr>
                    <tr>
                        <td :colspan="table.headers.length + (4 * 3)" style="text-align: center;">
                            <small>
                                Export Time: {{ Date() }}
                            </small>
                        </td>
                    </tr>
                    <tr><td :colspan="table.headers.length + (4 * 3)"></td></tr>
                    <tr style="border: 2px solid black;border-collapse: collapse;" class="green darken-2 white--text">
                        <th  style="border: 1px solid black;border-collapse: collapse;" 
                            v-for="(header, headerIndex) in table.headers" :key="`tabelForExportMonitoring1${headerIndex}`" class="justify-center align-center" rowspan="2">
                            {{ header.text }}
                        </th>
                        <th class="justify-center align-center" colspan="4" style="border: 1px solid black;border-collapse: collapse;" >
                            Data Distribusi
                        </th>
                        <th class="justify-center align-center" colspan="4" style="border: 1px solid black;border-collapse: collapse;" >
                            Data BAST Distribusi
                        </th>
                        <th v-for="totalTHeader in ['KAYU', 'MPTS', 'TOTAL KAYU + MPTS']" 
                            :key="`${totalTHeader}-header-tree-total`"
                        class="justify-center align-center" colspan="3"
                        style="border: 1px solid black;border-collapse: collapse;" 
                        >
                            {{ totalTHeader }}
                        </th>
                        
                        <!-- <th v-for="(header, headerIndex) in table.headersTree" :key="`tabelForExportMonitoring1tree${headerIndex}`" class="green darken-2 white--text justify-center align-center" colspan="5">
                            {{ header.text }}
                        </th> -->
                    </tr>

                    <tr style="border: 2px solid black;border-collapse: collapse;" class="green white--text">
                        <!-- data distribusi -->
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Tanggal Distribusi
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            KAYU
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            MPTS
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            TOTAL
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Tanggal BAST
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            KAYU
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            MPTS
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            TOTAL
                        </th>
                        <!-- total kayu -->
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Hidup
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Mati
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Hilang
                        </th>
                        <!-- total mpts -->
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Hidup
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Mati
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Hilang
                        </th>
                        <!-- total kayu + mpts -->
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Hidup
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Mati
                        </th>
                        <th style="border: 1px solid black;border-collapse: collapse;">
                            Hilang
                        </th>
                    </tr>
                    <tr v-for="(tableData, tableDataIndex) in table.items" :key="`itemtableForExportLahanPetaniDashboard${tableDataIndex}`" :class="`${tableDataIndex % 2 == 0 ? 'white' : 'grey'} justify-center align-center lighten-4 `" style="text-align: center; " >
                            <td v-for="(itemTable, itemTableIndex) in table.headers" :key="`tableItemForExportSostambyFC${itemTableIndex}-${tableDataIndex}`" 
                            :class="` ${statusRowColor(tableData[itemTable.value], itemTable.value)} lighten-3`"
                            style="border: 1px solid black;border-collapse: collapse;"
                            >
                                <span v-if="itemTable.value == 'index'">
                                        {{ tableDataIndex + 1 }}
                                </span>
                                <span v-if="itemTable.value == 'status'">
                                        {{ getStatusCondition(tableData.is_validate) }}
                                </span>
                                <span v-if="itemTable.value == 'planting_date'">
                                    {{ dateFormat(tableData.planting_date, 'DD-MM-Y') }}
                                </span>
                                <span v-else>
                                    {{ tableData[itemTable.value] }}
                                </span>
                            </td>
                            <!-- data distribusi -->
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ dateFormat(tableData.distribution_date.distribution_date, 'DD-MM-Y') }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.kayu_distributed }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.mpts_distributed }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.total_distributed }}
                            </td>
                            <!-- data Bast distribusi -->
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ dateFormat(tableData.bast_distribution_date.adjust_date, 'DD-MM-Y') }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.bast_kayu_distributed }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.bast_mpts_distributed }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.total_bast_distributed }}
                            </td>
                            <!-- total kayu -->
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.kayu_hidup }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.kayu_mati }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.kayu_hilang }}
                            </td>
                            <!-- total MPTS -->
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.mpts_hidup }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.mpts_mati }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.mpts_hilang }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.total_hidup }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.total_mati }}
                            </td>
                            <td style="border: 1px solid black;border-collapse: collapse;">
                                {{ tableData.total_hilang }}
                            </td>
                        </tr>
                        <tr>
                            
                        </tr>
                    </table>
                
            </v-card-text>
            
            <v-card-actions class="justify-center align-center">
                    <v-btn :disabled="table.loading.show" color="green white--text" rounded @click="downloadExcel()"><v-icon class="mr-1">mdi-microsoft-excel</v-icon> Unduh Excel</v-btn>
                    <v-btn :disabled="table.loading.show" color="orange darken-2 white--text" rounded @click="downloadPDF()"><v-icon class="mr-1">mdi-file-pdf-box</v-icon> Unduh PDF</v-btn>
                </v-card-actions>
        </v-card>
    </v-dialog>
    
    </template>
    
    <script>
    
    import axios from 'axios'
    import moment from 'moment'
    import Swal from 'sweetalert2'
    export default {
        
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            data: {
                type: Object,
                default: null,
            },
            program_year: {
                type: String,
                default: '2022',
            },
        },
        data: () => ({
            totalLahan : 0,
            totalBibitKayu : 0,
    
            table: {
                headers: [
                    { text: "No", value: "index", align: 'center', width: '2%', sortable: false },
                    { text: "MU", value: "mu_name", search: true },
                    { text: "FF", value: "nama_ff", search: true },
                    { text: "Petani", value: "nama_petani", search: true },
                    { text: "Nomor Lahan", align: "start", value: "lahan_no", sortable: false, search: true },
                    { text: "Bibit", value: "qty_std", align: 'center', sortable: false },
                    { text: "Waktu Tanam", value: "planting_date", align: 'center', search: true },
                    { text: "Status", value: "status", align: 'center', search: true },
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
                    if(this.show){
                     
                        this.getTableData(
                        //     {
                        //     ff_no: this.data.ff_no,
                        //     program_year: this.data.program_year
                        // }
                        )   
                    }
                    return this.show
                },
                set: function(newVal) {
                    if (!newVal) {
                        setTimeout(() => {
                            this.table.items = []
                            this.table.items_raw = []
                        }, 200);
                        this.$emit('close', false)
                    }else{
                    }
                }
            },
        },
    
    methods: {
        downloadExcel() {
            const table = document.getElementById("tabelForExportMonitoring1");
            const wb = XLSX.utils.table_to_book(table);
    
            /* Export to file (start a download) */
            XLSX.writeFile(wb, `ExportRealisasiTanam(DistribusiBAST&Monitoring)-${this.program_year}.pdf`);
        },
        downloadPDF() {
            window.jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [1400, 700]
            });
            doc.autoTable({ 
                html: '#tabelForExportMonitoring1',
                useCss: true,
                tableLineWidth: 0,
                theme: 'striped'
             })
            doc.save(`ExportRealisasiTanam(DistribusiBAST&Monitoring)-${this.program_year}.pdf`);
        },
        statusRowColor(outputColor, itemKey){
            if(itemKey == 'is_validate'){
                
                    if (outputColor == 'Belum Verifikasi') return "red";
                else return "green";
            }
        },
        getColorStatus(status) {
          if (status == 'Belum Verifikasi') return "red";
          else return "green";
        },
        getTotalPohonKayu(tables) {
        
            let totalBibitKayu = 0
            if(tables.length){
                 totalBibitKayu = tables.reduce(( a, b) => {
                    const totalKayu =(parseInt(a.pohon_kayu + b.pohon_kayu))
                    
                    return {pohon_kayu: totalKayu}
                    
                })
                console.log(totalBibitKayu)
    
            }
    
          return totalBibitKayu.pohon_kayu 
        },
        getTotalPohonMpts(tables) {
        
        let totalBibitMpts = 0
        if(tables.length){
            totalBibitMpts = tables.reduce(( a, b) => {
                const totalMpts =(parseInt(a.pohon_mpts + b.pohon_mpts))
                
                return {pohon_mpts: totalMpts}
                
            })
            console.log(totalBibitMpts)
    
        }
    
        return totalBibitMpts.pohon_mpts 
    },
    statusRowColor(outputColor, itemKey){
            if(itemKey == 'status'){
                
                    if (outputColor == 'Belum Verifikasi') return "red";
                else return "green";
            }
        },
    getStatusCondition(item){
        if(item == null || item == ''){
            return 'Belum Terverifikasi'
        }else{
            return 'Terverifikasi'
        }
    },
    dateFormat(date, format) {
      return moment(date).format(format)
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
            async getTableData() {
                try {
                    this.table.loading.show = true
                    // const params = new URLSearchParams(getparams)
                    // const url = `ExportSostamAllSuperAdmin?${params}`
                    // const call = await axios.get(this.$store.getters.getApiUrl(url), this.$store.state.apiConfig)
                    // const data = call.data.listData
                    
                    // const totalData = call.data.totalData
                    // this.totalLahan = totalData
    
                    this.table.items = this.data
                    this.table.items_raw = this.data
                } catch (err) {this.errorResponse(err)} finally {
                    this.table.loading.show = false
                }
            }
    }
    
    }
    </script>