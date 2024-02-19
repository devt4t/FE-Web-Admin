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
                        <td>Tahun Program </td>
                        <td>: {{  generalData.program_year }}</td>
                        <td colspan="2"></td>
                        <td>Lokasi / Desa </td>
                        <td colspan="2">: {{ generalData.village }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Project</td>
                        <td>: {{ generalData.project }}</td>
                        <td colspan="2"></td>
                        <td>No Lahan</td>
                        <td colspan="2">: {{ generalData.lahan_no }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td colspan="5"></td>
                        <td>Koordinat Lahan</td>
                        <td colspan="2">: {{ generalData.land_coordinates }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Tanggal Pelaksanaan Monitoring </td>
                        <td>:_______________________________ </td>
                        <td colspan="2"></td>
                        <td>Luas Lahan</td>
                        <td colspan="2">: {{ generalData.land_area }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Waktu Mulai Monitoring </td>
                        <td>:_______________________________ </td>
                        <td colspan="2"></td>
                        <td>Tutupan</td>
                        <td>: {{ generalData.land_closing_area }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Waktu Selesai Monitoring</td>
                        <td>:_______________________________ </td>
                        <td colspan="2"></td>
                        <td>Area Tanam</td>
                        <td>: {{ generalData.planting_area }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Monitoring Dilakukan Oleh (FF) </td>
                        <td>: {{ generalData.assign_to }} </td>
                        <td colspan="2"></td>
                        <td>Pola Tanam</td>
                        <td colspan="2">: {{ generalData.planting_method }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td colspan="5"></td>
                        <td>Nama Petani</td>
                        <td colspan="2">: {{ generalData.farmer_name}}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td colspan="5"></td>
                        <td>Kode Petani </td>
                        <td colspan="2">: {{ generalData.farmer_code }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td colspan="8" style="padding-bottom: 30px;"></td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Management Unit </td>
                        <td>: {{ generalData.mu_name }}</td>
                        <td colspan="2"></td>
                        <td>No ID Pencatatan Aktifitas di GEKO </td>
                        <td colspan="2">: {{ generalData.id_from_geko }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Target Area </td>
                        <td>: {{ generalData.ta_name }}</td>
                        <td colspan="2"></td>
                        <td>Tipe Percontohan Lahan </td>
                        <td colspan="2">: Fixed / Random </td>
                    </tr>
                    

                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Data Monitoring Sebelumnya </td>
                        <td>: {{ generalData.prev_monitoring_data }}</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Nama Kegiatan </td>
                        <td>: {{ generalData.activity_name }}</td>
                        <td></td>
                        <td colspan="4"> 
                            
                        </td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Tanggal Aktifitas </td>
                        <td>: {{ generalData.activity_date }}</td>
                        <td></td>
                        <td colspan="4"> 
                            
                        </td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td colspan="8" style="padding-bottom: 30px;"></td>
                    </tr>

                    <tr style="border-collapse: collapse;" class="black--text">
                        <th  style="border: 1px solid black;border-collapse: collapse;" 
                            v-for="(header, headerIndex) in table.treeHeaders" :key="`treeExportManualMonitoring2Format${headerIndex}`" class="justify-center align-center">
                            {{ header.text }}
                        </th>
                    </tr>
                            
                            
                        <tr v-for="(tableData, tableDataIndex) in table.treeItem" :key="`treetableForBAMonitoring2Format${tableDataIndex}`" :class="`${tableDataIndex % 2 == 0 ? 'white' : 'grey'} justify-center align-center lighten-4 `" style="text-align: center; " >
                            <td v-for="(itemTable, itemTableIndex) in table.treeHeaders" :key="`tableTreeForBAMonitoring2Format${itemTableIndex}-${tableDataIndex}`" 
                            style="border: 1px solid black;border-collapse: collapse;"
                            >
                                <span v-if="itemTable.value == 'index'">
                                        {{ tableDataIndex + 1 }}
                                </span>
                                <span v-else>
                                    {{ tableData[itemTable.value] }}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black;border-collapse: collapse;"></td>
                            <td style="border: 1px solid black;border-collapse: collapse; text-align: center;">Total</td>
                            <td style="border: 1px solid black;border-collapse: collapse; text-align: center;">{{table.treeItem.reduce((acc, val) => {
                                return acc + parseInt(val.qty)
                            }, 0) }}</td>
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
                            <th colspan="5" style="border: 1px solid black;border-collapse: collapse;">
                                Data Monitoring
                            </th>
                        </tr>
                        <tr style="border-collapse: collapse;" class="black--text">
                            <th  style="border: 1px solid black;border-collapse: collapse;" 
                                v-for="(header, headerIndex) in table.headers2" :key="`ExportManualTbl2Monitoring2Format${headerIndex}`" class="justify-center align-center">
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
                                    <td style="border: 1px solid black;border-collapse: collapse;" rowspan="2">  </td>
                                    <td style="border: 1px solid black;border-collapse: collapse;">[ ] Ada | [ ] Tidak</td>
                                    <td style="border: 1px solid black;border-collapse: collapse;" rowspan="2" ></td>
                                    <td style="border: 1px solid black;border-collapse: collapse;" rowspan="2"></td>
                                    <td style="border: 1px solid black;border-collapse: collapse; text-align: left;">[ ] Bersih</td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; border: 1px solid black;border-collapse: collapse;"></td>
                                    <td style="text-align: left; border: 1px solid black;border-collapse: collapse;">[ ] Tidak Bersih</td>
                                </tr>
                        </tbody>


                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                            <td colspan="8" style="padding-bottom: 20px;"></td>
                        </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Keterangan: </td>
                        <td colspan="3"> *] Dilakukan Mulai Pemantauan III/IV/V/VI Pada Tinggi DBH(1.3 Meter)</td>
                        <td></td>
                        <td colspan="2"> 
                        </td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td></td>
                        <td colspan="3"> **] Bersih Atau Tidak Bersih Pada Diameter 1 Meter Sekitar pohon</td>
                        <td></td>
                        <td colspan="2"> 
                        </td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td></td>
                        <td colspan="3"> ***] Tandai Jika Pohon Hidup, Biarkan Kosong Jika Pohon Mati</td>
                        <td></td>
                        <td colspan="2"> 
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8"></td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Kondisi Lahan:</td>
                        <td colspan="3"> [ ] Terpelihara</td>
                        <td></td>
                        <td colspan="2"> </td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>(Secara Keseluruhan yang Terpantau)</td>
                        <td colspan="3"> [ ] Tidak Terpelihara</td>
                        <td></td>
                        <td colspan="2"> </td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td colspan="3">Apakah Terdapat Pertanian Lainnya di Lahan yang Dimonitoring?</td>
                        <td >: Ya / Tidak</td>
                        <td colspan="3"> </td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td colspan="3">Jika Ada, Apa Jenisnya:</td>
                        <td colspan="4"> _________________________________</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td colspan="3"></td>
                        <td colspan="4"> _________________________________</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td colspan="3"></td>
                        <td colspan="4"> _________________________________</td>
                    </tr>


                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td></td>
                        <td>Interview Dengan Petani:</td>
                        <td colspan="6"> ___________________________________________________________________________________________________________</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td colspan="2"></td>
                        <td colspan="6"> ___________________________________________________________________________________________________________</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                        <td colspan="2"></td>
                        <td colspan="6"> ___________________________________________________________________________________________________________</td>
                    </tr>
                    <tr style="text-align: left; margin-left: 2em;font-size: 13px;">
                            <td colspan="8" style="padding-bottom: 20px;"></td>
                        </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td style="text-align: center;font-size: 14px;" colspan="4">Demikian Berita Acara Pemantauan Tanaman Dibuat Dengan Benar</td>
                        <td colspan="2"></td>
                    </tr>
                    <tr>
                        <td colspan="8"></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style="text-align: center;font-size: 14px;" colspan="2">Pelaksanaan Oleh,</td>
                        <td style="text-align: center;font-size: 14px;" colspan="2">Divalidasi Oleh,</td>
                        <td style="text-align: center;font-size: 14px;" colspan="2">Disetujui Oleh,</td>
                        <td></td>
                    </tr>
                    
                    <tr >
                        <td></td>
                        <td style="text-align: center;font-size: 14px; padding-top: 80px;" colspan="2">(________________)</td>
                        <td style="text-align: center;font-size: 14px; padding-top: 80px;" colspan="2">(________________)</td>
                        <td style="text-align: center;font-size: 14px; padding-top: 80px;" colspan="2">(________________)</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style="text-align: center;font-size: 14px;" colspan="2">Field Facilitator/External</td>
                        <td style="text-align: center;font-size: 14px;" colspan="2">Field Coordinator</td>
                        <td style="text-align: center;font-size: 14px;" colspan="2">Manager</td>
                        <td></td>
                    </tr>
                    </table>
                
            </v-card-text>
            
            <v-card-actions class="justify-center align-center">
                    <!-- <v-btn :disabled="table.loading.show" color="green white--text" rounded @click="downloadExcel()"><v-icon class="mr-1">mdi-microsoft-excel</v-icon> Unduh Excel</v-btn> -->
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
            itemDataMO1: {
                type: Array,
                default: []
            },
            itemDataMO2: {
                type: Array,
                default: []
            },
            generalDatas: {
                type: Object,
                default: {}
            }
        },
        data: () => ({
            generalData: {
                mo2_no: '',
                program_year: '',
                project: '',
                village: '',
                land_coordinates: '',
                land_area: '',
                planting_area: '',
                land_closing_area: '',
                lahan_no: '',
                assign_to: '',
                planting_method: '',
                farmer_name: '',
                farmer_code: '',
                mu_name: '',
                ta_name: '',
                id_from_geko: '',
                prev_monitoring_data: '',
                activity_name: '',
                activity_date: '',

                totalTreeQty: 0,
            },
            table: {
                treeHeaders: [
                    { text: "No", value: "index", align: 'center', width: '2%'},
                    { text: "Jenis Pohon", value: "tree_code", width: '20%'},
                    { text: "Jumlah Hidup", value: "qty"},
                ],
                treeItem: [],
                headers: [
                    { text: "No", value: "index", align: 'center', width: '2%'},
                    { text: "Id Pohon", value: "tree_no", paddingRight: '40px'},
                    { text: "Jenis Pohon", value: "tree_name"},
                ],
                headers2: [
                    { text: "Pohon Hidup ***", value: "tree_status"},
                    { text: "Serangan Hama / Penyakit", value: "tree_pests_deseases"},
                    { text: "Tinggi Pohon", value: "tree_length_mo2"},
                    { text: "Diameter Pohon *", value: "tree_diameter"},
                    { text: "Kondisi Sekitar Pohon **", value: "tree_environment_condition"},
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
        downloadPDF() {
            console.log(this.generalData.totalTreeQty)
            window.jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [620 , 877]
            });
            doc.autoTable({ 
                //header
                // didDrawPage: function (data) {
                //     doc.setFontSize(20);
                //     doc.setTextColor(40);
                //     doc.setFontStyle('normal');
                //     doc.addImage(logoUrl, 'PNG', data.settings.margin.left, 15, 10, 10);
                // },
                //body
                html: '#ExportManualMonitoring2Format',
                useCss: true,
                tableLineWidth: 0,
                theme: 'striped'
             })
            doc.save(`FormMonitoringManual_${this.generalDatas.assignToFF}_${this.generalDatas.monitoring2_no}.pdf`);
        },
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
            this.table.treeItem = this.itemDataMO1
            this.table.items = this.itemDataMO2

            this.generalData.mo2_no= this.generalDatas.monitoring2_no
            this.generalData.program_year= this.generalDatas.program_year
            this.generalData.project= this.generalDatas.project_no ?? '-'
            this.generalData.village= this.generalDatas.village
            this.generalData.land_coordinates= this.generalDatas.longitude +', ' + this.generalDatas.latitude
            this.generalData.land_area= this.generalDatas.land_area
            this.generalData.planting_area= this.generalDatas.planting_area
            this.generalData.land_closing_area= this.generalDatas.tutupan
            this.generalData.lahan_no= this.generalDatas.lahan_no
            this.generalData.assign_to= this.generalDatas.assignToFF
            this.generalData.planting_method= this.generalDatas.opsi_pola_tanam
            this.generalData.farmer_name= this.generalDatas.farmer_name
            this.generalData.farmer_code= this.generalDatas.farmer_no
            this.generalData.mu_name= this.generalDatas.mu_name
            this.generalData.ta_name= this.generalDatas.ta_name
            this.generalData.id_from_geko= this.generalDatas.monitoring2_no
            this.generalData.prev_monitoring_data= this.generalDatas.monitoring_no
            this.generalData.activity_name= 'Monitoring 2'
            this.generalData.activity_date= ''
        }
    }
    
    }
    </script>