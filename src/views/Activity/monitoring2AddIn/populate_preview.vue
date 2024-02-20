<template>
    <v-dialog
        v-model="showModal"
        scrollable
        max-width="1000px"
        transition="dialog-transition"
        content-class="rounded-xl"
        >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Export Format Monitoring 2 Manual
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
                    id="ExportManualMonitoring2Format"
                    style="border: 2px solid black;
                    border-collapse: collapse; 
                    min-height: 200px"
                    class="center"
                >
                    <tr>
                        <th :colspan="table.headers.length + table.headers2.length" align="center" style="text-align: center;font-size: 15px;">
                            Form Berita Acara</th>
                    </tr>
                    <tr>
                        <th :colspan="table.headers.length + table.headers2.length" align="center" style="text-align: center;font-size: 15px;">
                            Pemantauan Tahunan Tanaman (IS 25% Jenis)</th>
                    </tr>
                    <tr>
                        <th :colspan="table.headers.length + table.headers2.length" align="center" style="text-align: center;font-size: 15px;">
                            {{ this.generalData.mo2_no }}</th>
                    </tr>
                    <tr>
                        <td :colspan="table.headers.length + table.headers2.length" style="text-align: center;">
                            <small>
                                Export Time: {{ Date() }}
                            </small>
                        </td>
                    </tr>
                    
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Jumlah Terpilih </td>
                        <td>: {{ generalData.totalSelected }} / {{ generalData.totalData }}</td>
                        <td></td>
                        <td colspan="4"> 
                            
                        </td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Persentase Data Terpilih (25%) </td>
                        <td>: {{ generalData.percentages }}%</td>
                        <td></td>
                        <td colspan="4"> 
                            
                        </td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td colspan="8" style="padding-bottom: 30px;"></td>
                    </tr>

                    
                    <!-- table 2 start -->
                        <tr style="border-collapse: collapse;" class="black--text">
                            <th  style="border: 1px solid black;border-collapse: collapse;" 
                                v-for="(header, headerIndex) in table.headers" :key="`ExportManualTbl1Monitoring2Format${headerIndex}`" class="justify-center align-center" rowspan="2">
                                {{ header.text }}
                            </th>
                            
                        </tr>
                        <tbody v-for="(tableData, tableDataIndex) in table.items" :key="`itemtableForExportLahanPetaniDashboard${tableDataIndex}`">
                            <tr :class="`${tableDataIndex % 2 == 0 ? 'white' : 'grey'} justify-center align-center lighten-4 `" style="text-align: center; " >
                                    <td v-for="(itemTable, itemTableIndex) in table.headers" :key="`tableItemForBAMonitoring2Format${itemTableIndex}-${tableDataIndex}`" 
                                    style="border: 1px solid black;border-collapse: collapse;" rowspan="2" 
                                    >
                                    <span v-if="itemTable.value == 'index'">
                                            {{ tableDataIndex + 1 }}
                                    </span>
                                    <span v-else>
                                        {{ tableData[itemTable.value] }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>


                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                            <td colspan="8" style="padding-bottom: 20px;"></td>
                        </tr>
                    
                    </table>
                
            </v-card-text>
            
            <v-card-actions class="justify-center align-center">
                    <!-- <v-btn :disabled="table.loading.show" color="green white--text" rounded @click="downloadExcel()"><v-icon class="mr-1">mdi-microsoft-excel</v-icon> Unduh Excel</v-btn> -->
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
            listData: {
                type: Array,
                default: []
            },
            selectedAmount: {
                type: String,
                default: ''
            },
            totalAmount: {
                type: String,
                default: ''
            },
            percentageAmount: {
                type: String,
                default: ''
            },
            
        },
        data: () => ({
            generalData: {
                totalData: '',
                percentages: '',
                totalSelected: '',
            },
            table: {
                
                headers: [
                    { text: "No", value: "index", align: 'center', width: '2%'},
                    { text: "Management Unit", value: "mu_name"},
                    { text: "Nomor Lahan", value: "lahan_no"},
                    { text: "Nama FF", value: "nama_ff"},
                    { text: "Nama Petani", value: "nama_petani"},
                    { text: "Total Kayu", value: "kayu_hidup"},
                    { text: "Total MPTS", value: "mpts_hidup"},
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
        // downloadExcel() {
        //     const table = document.getElementById("ExportManualMonitoring2Format");
        //     const wb = XLSX.utils.table_to_book(table);
    
        //     /* Export to file (start a download) */
        //     XLSX.writeFile(wb, `ExportRealisasiTanam(DistribusiBAST&Monitoring).xlsx`);
        // },
        // downloadPDF() {
        //     console.log(this.generalData.totalTreeQty)
        //     window.jsPDF = window.jspdf.jsPDF;
        //     var doc = new jsPDF({
        //         orientation: 'portrait',
        //         unit: 'px',
        //         format: [620 , 877]
        //     });
        //     doc.autoTable({ 
        //         //header
        //         // didDrawPage: function (data) {
        //         //     doc.setFontSize(20);
        //         //     doc.setTextColor(40);
        //         //     doc.setFontStyle('normal');
        //         //     doc.addImage(logoUrl, 'PNG', data.settings.margin.left, 15, 10, 10);
        //         // },
        //         //body
        //         html: '#ExportManualMonitoring2Format',
        //         useCss: true,
        //         tableLineWidth: 0,
        //         theme: 'striped'
        //      })
        //     doc.save(`FormMonitoringManual_${this.generalDatas.assignToFF}_${this.generalDatas.monitoring2_no}.pdf`);
        // },
    statusRowColor(outputColor, itemKey){
            if(itemKey == 'status'){
                
                    if (outputColor == 'Belum Verifikasi') return "red";
                else return "green";
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
            this.table.items = this.listData

            // this.generalData.mo2_no= this.generalDatas.monitoring2_no
            // this.generalData.program_year= this.generalDatas.program_year
            // this.generalData.project= this.generalDatas.project_no ?? '-'
        }
    }
    
    }
    </script>