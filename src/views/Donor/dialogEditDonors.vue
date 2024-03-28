<template>
    <v-dialog 
        v-model="showModal"
        scrollable
        max-width="1000px"
        transition="dialog-transition"
        content-class="rounded-xl">
        <v-card rounded="xl">
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-pencil-plus</v-icon> Edit Data Donatur
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- Content -->
            <v-container>
                <!-- <v-divider
                  style="background-color: black !important"
                ></v-divider> -->
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-select
                            outlined
                            hide-details
                            rounded
                            dense
                            color="success"
                            item-color="success"
                            v-model="donorsCategory.model"
                            :items="donorsCategory.items"
                            item-text="text"
                            item-value="value"
                            label="Kategori Donor"
                        >
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field
                            outlined
                            hide-details
                            rounded
                            dense
                            color="success"
                            v-model="company"
                            label="Perusahaan"
                            placeholder="Masukan Perusahaan..."
                            >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field
                            outlined
                            hide-details
                            rounded
                            dense
                            color="success"
                            v-model="donors_name.first_name"
                            label="Nama Depan"
                            placeholder="Masukan Nama Depan..."
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field
                            outlined
                            hide-details
                            rounded
                            dense
                            color="success"
                            v-model="donors_name.last_name"
                            label="Nama Belakang"
                            placeholder="Masukan Nama Belakang..."
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-menu 
                            rounded="xl"
                            transition="slide-x-transition"
                            bottom
                            min-width="100"
                            offset-y
                            :close-on-content-click="true"
                            v-model="date_joined.show"
                        >
                            <template v-slot:activator="{ on: menu, attrs }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-text-field
                                            dense
                                            color="green"
                                            hide-details
                                            outlined
                                            label="Tanggal Mulai Project"
                                            rounded
                                            v-bind="attrs"
                                            v-on="{...menu, ...tooltip}"
                                            readonly
                                            v-model="date_joined.model"
                                            style="max-width: 250px"
                                        ></v-text-field>
                                    </template>
                                    <span>Klik untuk memunculkan datepicker</span>
                                </v-tooltip>
                            </template>
                            <div class="rounded-xl pb-2 white">
                                <div class="d-flex flex-column align-center rounded-xl">
                                    <v-date-picker 
                                        color="green lighten-1 rounded-xl" 
                                        v-model="date_joined.model"
                                        min="2022-11-24"
                                        
                                    ></v-date-picker>
                                </div>
                            </div>
                        </v-menu>
                    </v-col>
                    <v-divider
                        style="background-color: black !important"
                    >
                        <strong>Lokasi</strong>
                    </v-divider>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field
                                outlined
                                hide-details
                                rounded
                                dense
                                color="success"
                                v-model="address.address1"
                                label="Alamat Utama"
                                placeholder="Masukan Alamat Utama..."
                            >
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field
                                outlined
                                hide-details
                                rounded
                                dense
                                color="success"
                                v-model="address.address2"
                                label="Alamat Kedua (Opsional)"
                                placeholder="Masukan Alamat Kedua (Opsional)..."
                                >
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field
                                outlined
                                hide-details
                                rounded
                                dense
                                color="success"
                                v-model="address.postal_code"
                                label="Kode Pos"
                                max="8"
                                placeholder="Masukan Kode Pos..."
                            >
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select
                                outlined
                                hide-details
                                rounded
                                dense
                                color="success"
                                item-color="success"
                                v-model="address.country.model"
                                :items="address.country.itemList"
                                item-text="text"
                                item-value="value"
                                label="Country"
                            >
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select
                                outlined
                                hide-details
                                rounded
                                dense
                                color="success"
                                item-color="success"
                                v-model="address.state.model"
                                :items="address.state.itemList"
                                :disabled="address.country.model == 'Foreign' || address.country.model == ''"
                                v-on:change="getCityByStates()"
                                item-text="name"
                                item-value="province_code"
                                label="Provinsi"
                            >
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select
                                outlined
                                hide-details
                                rounded
                                dense
                                color="success"
                                item-color="success"
                                v-model="address.city.model"
                                :items="address.city.itemList"
                                :disabled="address.state.model == '' || address.city.itemList == []"
                                item-text="namaKabupaten"
                                item-value="kabupaten_no"
                                label="Kota"
                            >
                            </v-select>
                        </v-col>
                    <v-divider
                        style="background-color: black !important"
                    >
                        <v-icon class="mr-1">mdi-map</v-icon>
                        <strong>Kontak</strong>
                    </v-divider>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field
                            outlined
                            hide-details
                            rounded
                            dense
                            color="success"
                            v-model="contact.email"
                            label="Email"
                            placeholder="Masukan Email Anda..."
                            max="50"
                            hint="Contoh: nama@mail.com"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field
                            outlined
                            hide-details
                            rounded
                            dense
                            type="number"
                            color="success"
                            v-model="contact.phoneNumber"
                            label="Nomor Telepon"
                            placeholder="Masukan Nomor Telepon..."
                            maxlength="12"
                            counter="12"
                            hint="Contoh: 0812--------"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field
                            outlined
                            hide-details
                            rounded
                            dense
                            color="success"
                            v-model="contact.website"
                            label="Website"
                            placeholder="Masukan Website (Opsional)..."
                        >
                        </v-text-field>
                    </v-col>
                    <v-divider
                        style="background-color: black !important"
                    >
                        <v-icon class="mr-1">mdi-camera</v-icon>
                        <strong>Status & Foto</strong>
                    </v-divider>
                    <v-col cols="12" sm="6" md="6">
                        <v-file-input
                            accept="image/png, image/jpeg, image/bmp"
                            @change="val => {donorsPhoto = val}"
                            placeholder="Pilih Foto Donatur"
                            prepend-icon="mdi-camera"
                            show-size
                            label="Pilih Foto Donatur..."
                        ></v-file-input>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                        <v-select
                            outlined
                            hide-details
                            rounded
                            dense
                            color="success"
                            item-color="success"
                            v-model="active_status.model"
                            :items="active_status.itemList"
                            item-text="text"
                            item-value="value"
                            label="Status Aktif"
                        >
                        </v-select>
                    </v-col>
                </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              dark
              color="red"
              class="px-5"
              rounded
              @click="showModal = false"
              outlined
              elevation="1"
            >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Keluar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                v-if="saveButtonCondition()"
              dark
              color="green"
              class="px-5"
              rounded
              @click="editDataDonors()"
              outlined
              elevation="1"
            >
              <v-icon class="mr-1">mdi-pencil-plus</v-icon>
              Simpan Project
            </v-btn>
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
            itemData: {
                type: Object,
                default: []
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
            participant_no: '',
            donorsCategory: {
                items: [
                    {text: "Donatur Umum", value: 'cat-1'},
                    {text: "Komunitas Donatur", value: 'cat-2'},
                    {text: "Perusahaan", value: 'cat-3'},
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
                        this.resetData()
                        this.setDataDefault()
                        this.getProvinceList()
                        // this.getMUList()
                        // this.getDonorsList()
                        // this.getTableData({
                        //     form_no: this.data
                        // })   
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
            saveButtonCondition(){
                if(this.donorsCategory.model != '' && this.donors_name.first_name != '' && this.donors_name.last_name != '' && this.address.address1 != '' && this.address.address2 != '' && this.address.country.model != '' && this.contact.email !='' && this.contact.phoneNumber!='' && this.date_joined.model!='' && this.active_status.model!='' && this.donorsPhoto !='') return true
                return false
            },
            async getCityByStates(){
                this.address.city.itemList = []
                const params = this.address.state.model

                this.address.state.loading = true
                const response = await axios.get(
                    this.BaseUrlGet + `GetKabupatenByProvince?province_code=${params}`,
                    {
                    headers: {
                        Authorization: `Bearer ` + this.authtoken,
                    },
                    }
                );
                const data = response.data.data.result || []
                this.address.city.itemList = data
                this.address.city.loading = false
            },

            async getProvinceList(){
                try {
                    this.address.state.loading = true
                    const response = await axios.get(this.$store.getters.getApiUrl("GetProvinceAdmin"), this.$store.state.apiConfig)
                    const data = response.data.data.result || []
                    this.address.state.itemList = data
                } catch (error) {
                    if (error.response) {
                        if (error.response.status == 401) {
                            localStorage.removeItem("token")
                            this.$router.push("/")
                        }
                    } else console.error(error)
                } finally {
                    this.address.state.loading = false
                }
            },
 
            async setDataDefault(){
                console.log(this.itemData)
                this.participant_no = this.itemData.participant_no
                this.donorsCategory.model = this.itemData.participant_category
                this.donors_name.first_name= this.itemData.first_name
                this.donors_name.last_name= this.itemData.last_name
                this.address.address1= this.itemData.address1
                this.address.address2= this.itemData.address2
                this.company= this.itemData.company
                // this.address.city.model= this.itemData.city
                // this.address.state.model= this.itemData.state
                this.address.postal_code= this.itemData.postal_code
                // this.address.country.model= this.itemData.country
                this.contact.email= this.itemData.email
                this.contact.website= this.itemData.website
                this.contact.phoneNumber= this.itemData.phone
                this.date_joined.model= this.itemData.join_date
                this.active_status.model= this.itemData.active
                // this.donorsPhoto = this.itemData.photo
            },
        async editDataDonors(){
            try{
                const confirmation = await Swal.fire({
                    title: 'Anda Yakin Untuk Menyimpan Data Donor?',
                    text: "Proses Tidak Dapat Dikembalikan!",
                    icon: 'warning',
                    confirmButtonColor: '#2e7d32',
                    confirmButtonText: 'Okay',
                    showCancelButton: true
                })
                if(confirmation.isConfirmed){
                    const params = {
                        participant_no: this.participant_no,
                        participant_category: this.donorsCategory.model,
                        first_name: this.donors_name.first_name,
                        last_name: this.donors_name.last_name,
                        address1: this.address.address1,
                        address2: this.address.address2,
                        company: this.company,
                        city: this.address.city.model,
                        state: this.address.state.model,
                        postal_code: this.address.postal_code,
                        country: this.address.country.model,
                        email: this.contact.email,
                        website: this.contact.website,
                        phone: this.contact.phoneNumber,
                        join_date: this.date_joined.model,
                        active: this.active_status.model,
                        photo: '',
    
                    }
                    if(this.donorsPhoto){
                        const namafile = this.donors_name.first_name + "_" + this.contact.phoneNumber + "_donors";
                        const response = await axios.post(
                            this.BaseUrl + "donor/upload.php",
                            this._utils.generateFormData({
                                nama: namafile,
                                dir: 'donor-photo/',
                                image: this.donorsPhoto
                            }),
                        );
                        params.photo = response.data.data.new_name
                    }
                    console.log(params)
                    const PostData = await axios.post(
                        this.BaseUrlGet + "UpdateDonor",
                            params,
                            {
                                headers: {
                                    Authorization: `Bearer ` + this.authtoken,
                                },
                            }
                    );
                    const data = PostData.data
    
                    // const url = `AddNewProject?${params}`
                    
                }
            }catch(error){
                await Swal.fire({
                    title: `Gagal Menyimpan Data Donor!`,
                    text: 'Error: ' + error.response,
                    icon: 'error',
                    confirmButtonColor: '#2e7d32',
                    confirmButtonText: 'Okay',
                })
                console.error(error.response);
                if (error.response.status == 401) {
                localStorage.removeItem("token");
                this.$router.push("/");
                }
            }
            this.showModal = false;
        }
    }
    
}
</script>