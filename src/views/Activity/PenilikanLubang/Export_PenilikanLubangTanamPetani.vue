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
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Export Data Sostam
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
                <!-- <v-row class="align-center ma-0 my-2">
                    FF: {{ data ? data.name_ff || '-' : '-' }}
                    <v-divider class="mx-2"></v-divider>
                </v-row> -->
    
                <table
                    id="tableForExportPenilikanLubangTanamPetani"
                    
                    class="ml-auto mr-auto"
                    style="border: 2px solid black;border-collapse: collapse; min-height: 200px; "
                >
                    <tr>
                        <th :colspan="table.headers.length" align="center" style="text-align: center;font-size: 20px;">
                            <h2>
                                Data Export Penilikan Lubang Tanam
                            </h2>
                        </th>
                    </tr>
                    <tr>
                        <td :colspan="table.headers.length" style="text-align: center;">
                            <small>
                                Export Time: {{ Date() }}
                            </small>
                        </td>
                    </tr>
                    <tr><td :colspan="table.headers.length"></td></tr>
                    <tr style="border: 2px solid black;border-collapse: collapse;">
                        <th v-for="header in table.headers" :key="`tableForExportPenilikanLubangTanamPetani${header.value}`" class="green darken-2 white--text justify-center align-center">
                            {{ header.text }}
                            <div v-if="header.value == 'land_area'">(m<sup>2</sup>)</div>
                            <div v-if="header.value == 'planting_area'">(m<sup>2</sup>)</div>
                        </th>
                    </tr>
                    <tr v-for="(tableData, tableDataIndex) in table.items" :key="`itemtableForExportLahanPetaniDashboard${tableDataIndex}`" :class="`${tableDataIndex % 2 == 0 ? 'white' : 'grey'} justify-center align-center lighten-4 `" style="text-align: center; " >
                            <td v-for="(itemTable, itemTableIndex) in table.headers" :key="`tableItemForExportLahanPetaniDashboard${itemTable.value}`" 
                            :class="`lighten-3`"
                            style="border: 1px solid black;border-collapse: collapse;"
                            >
    
                                <span v-if="itemTable.value == 'index'">
                                    {{ tableDataIndex + 1 }}
                                </span>
                                
                                <!-- <span v-else-if="itemTable.value == 'status'">
                                    <v-chip :color="getColorStatus(tableData[itemTable.value])" dark>
                                        {{ tableData[itemTable.value] }}
                                    </v-chip>
                                </span> -->
                                <span v-else>
                                    {{ tableData[itemTable.value] }}
                                </span>
                            </td>
                        </tr>
                        <tr v-for="(tableData, dataStatusColor) in table.items">
    
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
            program_year:{
                type: String,
                default: ''
            },
            mu:{
                type: String,
                default:''
            },
            ta:{
                type: String,
                default:''
            },
            village:{
                type: String,
                default:''
            }
            // data: {
            //     type: Object,
            //     default: null,
            // },
        },
        data: () => ({
            totalLahan : 0,
    
            table: {
                headers: [
                    {text: 'No', value: 'index', width: 75},
                    {text: 'Unit Manager', value: 'um_name'},
                    {text: 'Field Coordinator', value: 'fc_name'},
                    {text: 'Field Facilitator', value: 'ff_name'},
                    {text: 'Management Unit', value: 'mu_name'},
                    {text: 'Target Area', value: 'fc_name'},
                    {text: 'Desa', value: 'village_name'},
                    {text: 'Petani', value: 'farmer_name'},
    
                    {text: 'Jumlah Lubang', value: 'holes'},
                    {text: 'Jumlah Lubang Standar', value: 'holes_standard'},
                    
                    {text: 'Status', align: "center", value: 'is_validate'},
                    
                    
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
                     
                        this.getTableData({
                            program_year: this.program_year,
                            type: 'area',
                            mu: this.mu,
                            ta: this.ta,
                            village: this.village
                        })   
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
            const table = document.getElementById("tableForExportPenilikanLubangTanamPetani");
            const wb = XLSX.utils.table_to_book(table);
            console.log('export xlsx')
    
            /* Export to file (start a download) */
            XLSX.writeFile(wb, `DataPenilikanLubangTanamPetani_${this.program_year}_${this.mu}_${this.ta}_${this.village}.xlsx`);
        },
        downloadPDF() {
            window.jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [1400, 700]
            });
            doc.autoTable({ 
                html: '#tableForExportPenilikanLubangTanamPetani',
                useCss: true,
                tableLineWidth: 0,
                theme: 'striped'
             })
            doc.save(`DataPenilikanLubangTanamPetani_${this.program_year}_${this.mu}_${this.ta}_${this.village}.pdf`);
        },
        // statusRowColor(outputColor, itemKey){
        //     if(itemKey == 'status'){
                
        //             if (outputColor == 'Belum Verifikasi') return "red";
        //         else return "green";
        //     }
        // },
        // getColorStatus(status) {
        //   if (status == 'Belum Verifikasi') return "red";
        //   else return "green";
        // },
        
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
                    const url = `ExportExcelPenilikanLubang?${params}`
                    const call = await axios.get(this.$store.getters.getApiUrl(url), this.$store.state.apiConfig)
                    const data = call.data
                    
                    // const totalData = call.data.totalData
                    // this.totalLahan = totalData
    
                    this.table.items = data
                    this.table.items_raw = data
                } catch (err) {this.errorResponse(err)} finally {
                    this.table.loading.show = false
                }
            }
    }
    
    }
    </script>