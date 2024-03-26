<template>
    <v-dialog 
        v-model="showModal"
        scrollable
        max-width="1000px"
        transition="dialog-transition"
        content-class="rounded-xl">
        <v-card rounded="xl">
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-pencil-plus</v-icon> Tambah Data Donatur
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- Content -->
            <v-container>
                <!-- <v-divider
                  style="background-color: black !important"
                ></v-divider> -->
                <v-simple-table>
                        <tbody>
                            <v-col cols="12" class="d-flex align-center">
                                <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-information</v-icon></v-btn> <h3>Data Umum</h3><v-divider class="mx-2"></v-divider>
                            </v-col>
                            <tr>
                                <td>Kategori Donor</td>
                                <td>:</td>
                                <td><strong>{{ categoryController(this.datas.participant_category) || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Perusahaan</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.company || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Nama</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.first_name + ' ' + this.datas.last_name|| '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Tanggal Mulai Partisipasi</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.join_date || '-' }}</strong></td>
                            </tr>
                            <v-col cols="12" class="d-flex align-center">
                                <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-land-plots-marker</v-icon></v-btn> <h3>Data Lokasi</h3><v-divider class="mx-2"></v-divider>
                            </v-col>
                            <tr>
                                <td>Alamat Utama</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.address1 || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Alamat Kedua</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.address2 || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Kode Pos</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.postal_code|| '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Kenegaraan</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.country || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Provinsi</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.state || '-' }}</strong></td>
                            </tr>
                            
                            <tr>
                                <td>Kota</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.city || '-' }}</strong></td>
                            </tr>
                            <v-col cols="12" class="d-flex align-center">
                                <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-land-plots-marker</v-icon></v-btn> <h3>Data Kontak</h3><v-divider class="mx-2"></v-divider>
                            </v-col>
                            <tr>
                                <td>Email</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.email || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Nomor Telepon</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.phone || '-' }}</strong></td>
                            </tr>
                            <tr>
                                <td>Website</td>
                                <td>:</td>
                                <td><strong>{{ this.datas.website || '-' }}</strong></td>
                            </tr>
                            <v-col cols="12" class="d-flex align-center">
                                <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-land-plots-marker</v-icon></v-btn> <h3>Status Donor</h3><v-divider class="mx-2"></v-divider>
                            </v-col>
                            <tr>
                                <td>Status</td>
                                <td>:</td>
                                <td class="text-center">
                                    <v-card rounded-xl shadow-lg :color="datas.active > 0 ? 'green': 'red'" darken class="white--text">
                                        <strong>{{ this.datas.active > 0 ? 'Aktif': 'Tidak Aktif'}}</strong>
                                    </v-card>
                                </td>
                            </tr>
                            <v-col cols="12" class="d-flex align-center">
                                <v-btn fab x-small color="green white--text" class="mr-2"><v-icon>mdi-land-plots-marker</v-icon></v-btn> <h3>Foto Donor</h3><v-divider class="mx-2"></v-divider>
                            </v-col>
                        </tbody>
                    </v-simple-table>
                    <v-row class="justify-center align-center">
                        <v-col cols="12" lg="4" sm="6" md="6">
                          <v-img
                            height="250"
                            v-bind:src="donorsPhoto"
                            @click="showLightbox(donorsPhoto)"
                            class="my-1 mb-4 rounded-xl cursor-pointer"
                          ></v-img>
                        </v-col>
                    </v-row>
            </v-container>
          </v-card-text>
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
            datas:{
                type: Object,
                default: {},
            }
        },
        data: () => ({

            items: [],
            items_raw: [],
            loading: {
              show: false,
              text: 'Loading...'
            },
            load: false,

            donorsCategory: {
                items: [
                    {text: "Donatur Umum", value: 'donors'},
                    {text: "Komunitas Donatur", value: 'comunity'},
                    {text: "Perusahaan", value: 'company'},
                ],
                model: '',
                loading: false
            },
            donors_name: {
                first_name: '',
                last_name: ''
            },
            date_joined:{
                show: false,
                model: ''
            },
            address: {
                address1: '',
                address2: '',
                city: {
                    itemList: [],
                    model: '',
                    loading: false
                },
                state: {
                    itemList: [],
                    model: '',
                    loading: false
                },
                postal_code: '',
                country: {
                    itemList: [
                        {text: 'Indonesia', value: 'Indonesia'},
                        {text: 'Foreign', value: 'Foreign'}    
                    ],
                    model: ''
                },
            },
            contact:{
                phoneNumber:'',
                email: '',
                website: '-'
            },
            company: '',
            donorsPhoto: '',
            active_status:{
                itemList: [
                    {text: 'Aktif', value: '1'},
                    {text: 'Tidak Aktif', value: '0'},
                ],
                model: ''
            },

            BaseUrlGet: '',
            BaseUrl: '',
            authtoken: ''

        }),
        computed: {
            showModal: {
                get: function () {
                    if(this.show){
                        this.BaseUrlGet= localStorage.getItem("BaseUrlGet");
                        this.BaseUrl = localStorage.getItem("BaseUrl");
                        this.authtoken= localStorage.getItem("token");
                        this.generateDatas();
                    }
                    return this.show
                },
                set: function(newVal) {
                    if (!newVal) {
                        setTimeout(() => {
                            this.items = []
                            this.items_raw = []
                        }, 200);
                        this.$emit('close', false)
                        this.resetData()
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
            showLightbox(imgs, index) {
                if (imgs) this.$store.state.lightbox.imgs = imgs
                
                if (index) this.$store.state.lightbox.index = index
                else this.$store.state.lightbox.index = 0

                this.$store.state.lightbox.show = true
            },
            generateDatas(){
                this.donorsPhoto= this.BaseUrl+ 'donor/donor-photo/' + this.datas.photo
            },
            categoryController(val){
                if(val == 'cat1') return 'Umum'
                else if(val == 'cat2') return 'Komunitas'
                else if(val == 'cat3') return 'Perusahaan'
            },
            resetData(){
                this.donorsCategory.model = ''
                this.donors_name.first_name= ''
                this.donors_name.last_name= ''
                this.address.address1= ''
                this.address.address2= ''
                this.company= ''
                this.address.city.model= ''
                this.address.state.model= ''
                this.address.postal_code= ''
                this.address.country.model= ''
                this.contact.email= ''
                this.contact.website= ''
                this.contact.phoneNumber= ''
                this.date_joined.show= ''
                this.active_status.model= ''
                this.donorsPhoto= ''
            },

    }
    
}
</script>