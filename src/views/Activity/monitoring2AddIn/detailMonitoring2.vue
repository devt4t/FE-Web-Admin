<template>
    <v-dialog
        v-model="showModal"
        scrollable
        max-width="1500px"
        transition="dialog-transition"
        content-class="rounded-xl"
        >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Detail Monitoring 2
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

                <v-container >
                    <!-- General Detail -->
                    <v-simple-table>
                        <tbody>
                            <v-col cols="12" class="d-flex align-center">
                                <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-information</v-icon></v-btn> <h3>Data Umum</h3><v-divider class="mx-2"></v-divider>
                            </v-col>
                            <tr>
                                <td>Nomor Monitoring 2</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.mo2_no || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Tahun Program</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.program_year || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Project</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.project || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Data Monitoring Sebelumnya</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.prev_monitoring_data || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Unit Management</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.mu_name || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Target Area</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.ta_name || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Desa</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.village || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Nama Petani</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.farmer_name || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Hasil Interview Petani</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.interview || '-' }}</strong></td>
                            </tr>
                            
                            <v-col cols="12" class="d-flex align-center">
                                <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-land-plots-marker</v-icon></v-btn> <h3>Data Lahan</h3><v-divider class="mx-2"></v-divider>
                            </v-col>
                            <tr>
                                <td>Nomor Lahan</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.lahan_no || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Koordinat Lahan</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.land_coordinates || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Luas Lahan</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.land_area || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Kondisi Lahan</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.land_condition || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Luas Tutupan Lahan</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.land_closing_area || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Luas Area Tanam</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.planting_area || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Pola Tanam</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.planting_method || '-' }}</strong></td>
                            </tr>
                            <v-col cols="12" class="d-flex align-center">
                                <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-eye-check</v-icon></v-btn> <h3>Data Monitoring 2</h3><v-divider class="mx-2"></v-divider>
                            </v-col>
                            <tr>
                                <td>Nomor ID Pencatatan GEKO</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.mo2_no || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Sampling</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.sampling }}</strong></td>
                            </tr>
                            <tr>
                                <td>Tanggal Pelaksanaan</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.monitoring2_time || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Waktu Mulai Monitoring</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.monitoring2_start || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Waktu Selesai Monitoring</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.monitoring2_end || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>FF yang Bertugas</td>
                                <td>:</td>
                                <td><strong>{{ this.generalData.assign_to || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Persentase Monitoring</td>
                                <td>:</td>
                                <!-- <td><div>
                                    <v-progress-linear
                                        :value="percentageFormat(distributionReport.dialogs.detail.totalSeedArrival, distributionReport.dialogs.detail.labels.loaded.length)"
                                        color="orange"
                                        height="25"
                                        >
                                        <strong>{{ Math.ceil(percentageFormat(distributionReport.dialogs.detail.totalSeedArrival, distributionReport.dialogs.detail.labels.loaded.length)) }}%</strong>
                                        </v-progress-linear>
                                </div></td> -->
                            </tr>
                            <v-col cols="12" class="d-flex align-center">
                                <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-list-box</v-icon></v-btn> <h3>Tabel Detail Monitoring 2 </h3><v-divider class="mx-2"></v-divider>
                            </v-col>
                        </tbody>
                    </v-simple-table>
                    <!-- List Detail Table -->
                        <v-data-table 
                            :headers="table.headers" 
                            :items="table.items"
                            class="elevation-3 rounded-xl" 
                            item-key="kode" 
                            :loading="table.loading.show"
                            loading-text="Loading... Please wait"  
                            :items-per-page="20" 
                            :footer-props="{
                            itemsPerPageText: 'Jumlah Data Per Halaman',
                            itemsPerPageOptions: [20, 50, 100, 200]
                            }">
                        </v-data-table>
                    <v-col cols="12" class="d-flex align-center">
                        <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-image-multiple</v-icon></v-btn> <h3>Foto Kegiatan Monitoring 2 </h3><v-divider class="mx-2"></v-divider>
                    </v-col>
                    <v-row class="justify-center align-center">
                        <v-col cols="12" lg="4" sm="6" md="6">
                          <v-img
                            height="250"
                            v-bind:src="generalData.photo1"
                            @click="showLightbox(generalData.photo1)"
                            class="my-1 mb-4 rounded-xl cursor-pointer"
                          ></v-img>
                        </v-col>
                        <v-col cols="12" lg="4" sm="6" md="6">
                          <v-img
                            height="250"
                            v-bind:src="generalData.photo2"
                            @click="showLightbox(generalData.photo2)"
                            class="my-1 mb-4 rounded-xl cursor-pointer"
                          ></v-img>
                        </v-col>
                    </v-row>
                    <v-col cols="12" class="d-flex align-center">
                        <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-list-box</v-icon></v-btn> <h3>Foto Pohon Per Jenis </h3><v-divider class="mx-2"></v-divider>
                    </v-col>
                    <h3 class="ml-1">
                      <v-simple-table dense class="rounded-xl overflow-hidden" style="border: 1px solid #e2e2e2;border-collapse: collapse;">
                        <thead>
                          <tr>
                            <th class="text-center">No</th>
                            <th>Category</th>
                            <th>Name</th>
                            <th class="text-center">Foto Hidup</th>
                            <th class="text-center">Foto Mati</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(tree, treeIndex) in treeDetail" :key="treeIndex">
                            <td class="text-center">{{ treeIndex + 1 }}</td>
                            <td>{{ tree.tree_code }}</td>
                            <td>{{ tree.tree_name }}</td>
                            <td class="text-center">
                              <v-btn 
                                color="green white--text"
                                outlined
                                hide-details
                                dense
                                :disabled="treeDetail[treeIndex].photo_life == '-'"
                                @click="openPlantPhoto(treeDetail[treeIndex].photo_life)"
                                rounded>
                                <v-icon class="mr-1">mdi-image</v-icon>
                              </v-btn>
                            </td>
                            <td class="text-center">
                              <v-btn 
                                color="red white--text"
                                outlined
                                hide-details
                                dense
                                :disabled="treeDetail[treeIndex].photo_dead == '-'"
                                @click="openPlantPhoto(treeDetail[treeIndex].photo_dead)"
                                rounded>
                                <v-icon class="mr-1">mdi-image</v-icon>
                                <v-tooltip
                                  activator="parent"
                                  location="end"
                                ><span>Klik untuk memunculkan</span></v-tooltip>
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </h3>
                </v-container>
            </v-card-text>
            
            <v-card-actions class="justify-center align-center">
                    <!-- <v-btn :disabled="table.loading.show" color="green white--text" rounded @click="ExportData()"><v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export Data</v-btn> -->
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
            dataDetail: {
                type: Array,
                default: []
            },
            treeDetail:  {
                type: Array,
                default: []
            },
            generalDatas: {
                type: Object,
                default: {}
            }
        },
        data: () => ({
            exportModal: false,

            totalData : 0,
            totalBibitKayu : 0,
            data_um_name: '',
            data_fc_name: '',
            generalData: {
                mo2_no: '',
                program_year: '',
                project: '',
                village: '',
                land_coordinates: '',
                land_condition: '',
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
                interview: '',

                monitoring2_start: '',
                monitoring2_end: '',
                monitoring2_time: '',
                sampling: '',

                totalTreeQty: 0,
            },
    
            table: {
                trees: [],
                headers: [
                    // {text: 'No', value: 'index', width: 75},
                    {text: 'Kode Pohon dan Qr-Code', value: 'tree_no'},
                    {text: 'Jenis Pohon', value: 'tree_name'},
                    {text: 'Tahun Tanam', value: 'planting_year'},
                    {text: 'Petani', value: 'farmer_name'},

                    {text: 'Kondisi Pohon', value: 'tree_condition'},
                    {text: 'Diameter Pohon', value: 'diameter'},
                    {text: 'Tinggi Pohon', value: 'height'},
                    {text: 'Keterangan', value: 'note'},
                    {text: 'Hama/Penyakit', value: 'pest'},
                    {text: 'Keterangan Hama/Penyakit', value: 'pest_description'},
                ],
                items: [],
                items_raw: [],
                items_tree: [],
                loading: {
                    show: false,
                    text: 'Loading...'
                },
                search: ''
            },
            BaseUrl: ''
        }),
        computed: {
            showModal: {
                get: function () {
                    if(this.show){
                        this.BaseUrl = localStorage.getItem("BaseUrl");
                        this.getTableData({})   
                    }
                    return this.show
                },
                set: function(newVal) {
                    if (!newVal) {
                        setTimeout(() => {
                            this.items_tree = []
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
            openPlantPhoto(photoRoute){
                this.showLightbox(this.BaseUrl +photoRoute)
            },
            showLightbox(imgs, index) {
                if (imgs) this.$store.state.lightbox.imgs = imgs
                
                if (index) this.$store.state.lightbox.index = index
                else this.$store.state.lightbox.index = 0

                this.$store.state.lightbox.show = true
            },
            async getTableData() {
                this.items_tree = this.treeDetail
                this.table.items = this.dataDetail
                console.log(this.treeDetail)
                this.table.items_raw = this.dataDetail

                this.generalData.mo2_no= this.generalDatas.monitoring2_no
                this.generalData.program_year= this.generalDatas.program_year
                this.generalData.project= this.generalDatas.project_no ?? '-'
                this.generalData.village= this.generalDatas.desa_name
                this.generalData.land_coordinates= this.generalDatas.longitude +', ' + this.generalDatas.latitude
                this.generalData.land_condition= this.generalDatas.land_condition
                this.generalData.land_area= this.generalDatas.land_area
                this.generalData.planting_area= this.generalDatas.planting_area
                this.generalData.land_closing_area= this.generalDatas.tutupan
                this.generalData.lahan_no= this.generalDatas.lahan_no
                this.generalData.assign_to= this.generalDatas.ff_name
                this.generalData.planting_method= this.generalDatas.opsi_pola_tanam
                this.generalData.farmer_name= this.generalDatas.farmer_name
                this.generalData.farmer_code= this.generalDatas.farmer_no
                this.generalData.interview = this.generalDatas.interview
                this.generalData.mu_name= this.generalDatas.mu_name
                this.generalData.ta_name= this.generalDatas.ta_name
                this.generalData.id_from_geko= this.generalDatas.monitoring2_no
                this.generalData.prev_monitoring_data= this.generalDatas.monitoring_no
                this.generalData.activity_name= 'Monitoring 2'
                this.generalData.activity_date= ''

                this.generalData.monitoring2_start= this.generalDatas.monitoring_start
                this.generalData.monitoring2_end= this.generalDatas.monitoring_end
                this.generalData.monitoring2_time= this.generalDatas.monitoring_time
                this.generalData.sampling= this.generalDatas.sampling

                if (this.generalDatas.photo1) {
                    this.generalData.photo1 = this.BaseUrl + this.generalDatas.photo1
                }else{
                    this.generalData.photo1 = "/images/noimage.png"
                }

                if (this.generalDatas.photo2) {
                    this.generalData.photo2 = this.BaseUrl + this.generalDatas.photo2
                }else{
                    this.generalData.photo2 = "/images/noimage.png"
                }
                // this.generalData.photo2= this.generalDatas.photo2
            }
    }
    
}
</script>