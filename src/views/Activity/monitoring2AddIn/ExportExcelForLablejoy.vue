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
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Export Data Monitoring For LableJoy
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
                    id="tabelForExportSostam"
                    class="ml-auto mr-auto"
                    
                    style="border: 2px solid black;border-collapse: collapse; min-height: 200px"
                >
                    <!-- <tr>
                        <th :colspan="table.headers.length" align="center" style="text-align: center;font-size: 15px;">
                            Tahun Program: {{ this.program_year }}</th>
                    </tr>
                    <tr>
                        <td :colspan="table.headers.length" style="text-align: center;">
                            <small>
                                Export Time: {{ Date() }}
                            </small>
                        </td>
                    </tr>
                    <tr><td :colspan="table.headers.length"></td></tr> -->
                    <tr style="border: 2px solid black;border-collapse: collapse;">
                        <th v-for="header in table.headers" :key="`tabelForExportSostam${header.value}`" class="green darken-2 white--text justify-center align-center">
                            {{ header.text }}
                            <div v-if="header.value == 'land_area'">(m<sup>2</sup>)</div>
                            <div v-if="header.value == 'planting_area'">(m<sup>2</sup>)</div>
                        </th>
                    </tr>
                    
                    <tr v-for="(tableData, tableDataIndex) in table.items" :key="`itemtableForExportLahanPetaniDashboard${tableDataIndex}`" :class="`${tableDataIndex % 2 == 0 ? 'white' : 'grey'} justify-center align-center lighten-4 `" style="text-align: center; " >
                            <td v-for="(itemTable, itemTableIndex) in table.headers" :key="`tableItemForExportSostambyFC${itemTable.value}`" 
                            style="border: 1px solid black;
                            border-collapse: collapse;"
                            >
    
                                <!-- <span v-if="itemTable.value == 'index'">
                                    {{ tableDataIndex + 1 }}
                                </span> -->
                                <span v-if="itemTable.value == 'total_bibit'"
                                >
                                {{tableData.pohon_kayu + tableData.pohon_mpts }}
                                    
                                </span>
                                <span v-else>
                                    {{ tableData[itemTable.value] }}
                                </span>
                            </td>
                        </tr>
                        
                
                    </table>
                
            </v-card-text>
            
            <v-card-actions class="justify-center align-center">
                    <v-btn :disabled="table.loading.show" color="green white--text" rounded @click="downloadExcel()"><v-icon class="mr-1">mdi-microsoft-excel</v-icon> Unduh Excel</v-btn>
                    <!-- <v-btn :disabled="table.loading.show" color="orange darken-2 white--text" rounded @click="downloadPDF()"><v-icon class="mr-1">mdi-file-pdf-box</v-icon> Unduh PDF</v-btn> -->
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
            dataObject: {
                type: Array,
                default: ''
            },
            ff_no: {
                type: String,
                default: ''
            },
            farmer_name: {
                type: String,
                default: ''
            },
            program_year: {
                type: String,
                default: ''
            }
        },
        data: () => ({
            totalData : 0,
            totalBibitKayu : 0,
            data_um_name: '',
            data_fc_name: '',

    
            table: {
                trees: [],
                headers: [
                    // {text: 'No', value: 'index', width: 75},
                    {text: 'Kode Pohon dan Qr-Code', value: 'tree_no'},
                    {text: 'Jenis Pohon', value: 'tree_name'},
                    {text: 'Tahun Tanam', value: 'planting_year'},
                    {text: 'Petani', value: 'farmer_name'},

                    {text: 'Nomor Lahan', value: 'lahan_no'},
                    {text: 'Desa', value: 'village'},
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
            console.log(this.farmer_name)
            const table = document.getElementById("tabelForExportSostam");
            const wb = XLSX.utils.table_to_book(table);
    
            /* Export to file (start a download) */
            XLSX.writeFile(wb, `DataMO2-${this.program_year}_${this.ff_no}_${this.farmer_name}.xlsx`);
        },
        // downloadPDF() {
        //     window.jsPDF = window.jspdf.jsPDF;
        //     var doc = new jsPDF({
        //         orientation: 'landscape',
        //         unit: 'px',
        //         format: [1400, 700]
        //     });
        //     doc.autoTable({ 
        //         html: '#tabelForExportSostam',
        //         useCss: true,
        //         tableLineWidth: 0,
        //         theme: 'striped'
        //      })
        //     doc.save(`DataMO2-${this.program_year}_${this.lahan_no}.pdf`);
        // },
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
        // getSeedAmount(item, data){

        //     const tree_seed = data.seed_list.find(v=>v.tree_code == item.value)

        //     if(tree_seed){
        //         return tree_seed.amount
        //     }
        //     else return 0
        // },
    //     getTotalPohonKayu(tables) {
        
    //         let totalBibitKayu = 0
    //         if(tables.length){
    //              totalBibitKayu = tables.reduce(( a, b) => {
    //                 const totalKayu =(parseInt(a.pohon_kayu + b.pohon_kayu))
                    
    //                 return {pohon_kayu: totalKayu}
                    
    //             })
    //             console.log(totalBibitKayu)
    
    //         }
    
    //       return totalBibitKayu.pohon_kayu 
    //     },
    //     getTotalPohonMpts(tables) {
        
    //     let totalBibitMpts = 0
    //     if(tables.length){
    //         totalBibitMpts = tables.reduce(( a, b) => {
    //             const totalMpts =(parseInt(a.pohon_mpts + b.pohon_mpts))
                
    //             return {pohon_mpts: totalMpts}
                
    //         })
    //         console.log(totalBibitMpts)
    
    //     }
    
    //     return totalBibitMpts.pohon_mpts 
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
            async getTableData() {
                try {
                    this.table.loading.show = true
                    console.log(this.farmer_name)
                    this.table.items = this.dataObject
                    this.table.items_raw = this.dataObject
                } catch (err) {this.errorResponse(err)} finally {
                    this.table.loading.show = false
                }
            }
    }
    
    }
    </script>