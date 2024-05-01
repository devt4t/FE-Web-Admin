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
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Data Lahan Terpilih
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
                <v-data-table
                    data-aos="fade-up"
                    data-aos-delay="200"
                    multi-sort
                    :headers="table.headers"
                    :items="table.items"
                    :search="search"
                    :footer-props="{
                        itemsPerPageText: 'Jumlah Data Per Halaman',
                        itemsPerPageOptions: [10, 25, 50, 100, 200],
                        showCurrentPage: true,
                        showFirstLastPage: true,
                    }"
                >
                <template v-slot:top>
                    <v-row class="pb-4 px-2">
                        <v-col cols="12" lg="2">
                            <p>
                                Tahun Program: {{ program_year }}
                            </p>
                        </v-col>
                        <v-col cols="12" lg="4" >
                            <v-select
                                v-model="projectToAssign.model"
                                :items="projectToAssign.items"
                                hide-details
                                outlined
                                dense
                                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                rounded
                                label="Project"
                                class="centered-select"
                            ></v-select>
                            
                        </v-col>
                        <v-col cols="12" lg="6" class="d-flex">
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Pencarian"
                                placeholder="Pencarian..."
                                hide-details
                                dense
                                rounded
                                outlined
                                color="green"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </template>
                <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                </template>
                <template v-slot:item.approve="{ item }">
                    <v-chip :color="item.approve == 0? 'red': item.approve == 1 ? 'green': item.approve == 2 ? 'green': 'indigo'" dark>
                    <v-icon v-if="item.approve == 1" class="mr-1">mdi-check-circle</v-icon>{{ getStatusText(item.approve, item.complete_data) }}
                    </v-chip>
                </template>
                <template v-slot:item.seed_type="{ item }">
                    {{ item.jenis_bibit.toString() }}
                </template>
                <template v-slot:item.registered_year="{ item }">
                    {{ item.created_time.slice(0, 4) }}
                </template>
                </v-data-table>
                
            </v-card-text>
            
            <v-card-actions class="justify-center align-center" v-if="!projectToAssign.model == ''">
                    <v-btn :disabled="table.loading.show" color="green white--text" rounded @click="SaveChange()"><v-icon class="mr-1">mdi-check-bold</v-icon> Simpan Data Project Lahan</v-btn>
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
            tableData: {
                type: Array,
                default: []
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
            projectToAssign:{
                model: '',
                items: []
            },
            search: "",
            table: {
                headers: [
                    {text: 'No', value: 'index', width: 75},
                    {text: 'Nama FF', value: 'ff_name'},
                    {text: 'Nama Petani', value: 'farmer_name'},
                    {text: 'Desa', value: 'village_name'},
                    {text: 'Nomor Lahan', value: 'lahan_no'},

                    {text: 'Tahun Terdaftar', value: 'registered_year'},
                    {text: 'Dokumen Lahan', value: 'document_no'},
                    {text: 'Luas Lahan', value: 'land_area'},
                    {text: 'Pola Tanam', value: 'opsi_pola_tanam'},
    
                    {text: 'Tutupan Lahan', class: "justify-center align-center", value: 'tutupan_lahan'},
                    
                    {text: 'Jenis Bibit', align: "center", value: 'seed_type'},
                    {text: 'Total Kayu', align: "center", value: 'pohon_kayu'},
                    {text: 'Total MPTS', align: "center", value: 'pohon_mpts'},
                    
                    {text: 'Total Kayu + MPTS', value: 'pohon_kayu_mpts'},
                    
                    {text: 'Status', value: 'approve'},
                ],
                items: [],
                items_raw: [],
                loading: {
                    show: false,
                    text: 'Loading...'
                },
                search: ''
            },
            xAppKey_Portal: '',
            BaseUrlPortal: '',
        }),
        computed: {
            showModal: {
                get: function () {
                    if(this.show){
                        this.BaseUrlPortal = localStorage.getItem("BaseUrlPortal");
                        this.xAppKey_Portal = localStorage.getItem("xAppKey_Portal");
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
        SaveChange() {
            const confirmation = Swal.fire({
                title: 'Apa Anda Yakin Untuk Update Data Project Lahan?',
                text: "Mohon TELITI!, Setelah Melakukan Update, Data Tidak Dapat Diubah Lagi!",
                icon: 'warning',
                confirmButtonColor: '#2e7d32',
                confirmButtonText: 'Okay',
                showCancelButton: true,
                cancelButtonColor: 'red'
            })
            if(confirmation.isConfirmed){
                let listLahan = this.table.items.map( v => {
                    return v.lahan_no
                })
                const params = {
                    project: this.projectToAssign.model,
                    listLahanNo: listLahan 
                }
                console.log(params)
            }
        },
        async getProjectPortalDatas(){
            // console.log('Portalurl: '+ this.BaseUrlPortal +', ' + 'AppKey_Portal: '+ this.xAppKey_Portal);
            const getProjectList = await axios.get(
              this.BaseUrlPortal + "/project/list",
              {
                headers: {
                    'x-api-key': this.xAppKey_Portal,
                },
              }
            )
            this.projectToAssign.items = getProjectList.data.data

        },
        getStatusText(approve, complete){
            if (!complete) return "Belum Lengkap"
            if (complete && approve == 0) return "Lengkap, Belum Terverif"
            if(approve == 3) return "Force Majeure"
            // if(approve == 2) return "green"
            if(approve == 1) return "Terverifikasi"
            if(approve == 0) return "Belum Terverifikasi"
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
                    this.getProjectPortalDatas()
                    this.table.loading.show = true

                    this.table.items = this.tableData
                    this.table.items_raw = this.tableData
                    
                    this.table.loading.show = false
                } catch (err) {this.errorResponse(err)} finally {
                    this.table.loading.show = false
                }
            }
    }
    
    }
    </script>