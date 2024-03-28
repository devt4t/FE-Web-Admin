<template>
    <v-dialog 
        v-model="showModal"
        scrollable
        max-width="1000px"
        transition="dialog-transition"
        content-class="rounded-xl">
        <v-card rounded="xl">
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-pencil-plus</v-icon> Edit Project
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
                            v-model="projectCategory.model"
                            :items="projectCategory.items"
                            item-text="text"
                            item-value="value"
                            label="Kategori Project"
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
                            v-model="projectName"
                            label="Nama Project"
                            placeholder="Masukan Nama Project..."
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
                            v-model="project_start_date.show"
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
                                            v-model="project_start_date.model"
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
                                        v-model="project_start_date.model"
                                        min="2022-11-24"
                                        v-on:change="startDateOnChange()"
                                        
                                    ></v-date-picker>
                                </div>
                            </div>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-menu 
                            rounded="xl"
                            transition="slide-x-transition"
                            bottom
                            min-width="100"
                            offset-y
                            :close-on-content-click="true"
                            v-model="project_end_date.show"
                        >
                            <template v-slot:activator="{ on: menu, attrs }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-text-field
                                            dense
                                            color="green"
                                            hide-details
                                            outlined
                                            label="Tanggal Selesai Project"
                                            rounded
                                            v-bind="attrs"
                                            v-on="{...menu, ...tooltip}"
                                            readonly
                                            v-model="project_end_date.model"
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
                                        v-model="project_end_date.model"
                                        min="2022-11-24"
                                        v-on:change="endDateOnChange()"
                                        
                                    ></v-date-picker>
                                </div>
                            </div>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field
                            outlined
                            hide-details
                            rounded
                            dense
                            color="success"
                            v-model="projectDescription"
                            label="Deskripsi Project"
                            placeholder="Masukan Deskripsi Project..."
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
                            v-model="projectLocation"
                            label="Lokasi Project"
                            placeholder="Masukan Lokasi Project..."
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
                            type="number"
                            min="0"
                            v-model="total_trees"
                            label="Jumlah Target Pohon"
                            placeholder="Masukan Jumlah Target Pohon..."
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
                            v-model="co2_capture"
                            label="Proyeksi CO2"
                            min="0"
                            placeholder="Masukan Proyeksi CO2..."
                        >
                        <template v-slot:label>
                            Proyeksi CO<sup>2</sup>
                        </template>
                            
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
                            v-model="donors.model"
                            :items="donors.items"
                            :loading="donors.loading"
                            :item-text="item => item.first_name + ' - ' + item.company +' - '+ item.city+ ' - '+ item.state"
                            item-value="participant_no"
                            label="Masukan Donatur"
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
                            v-model="mu.model"
                            :items="mu.items"
                            item-text="name"
                            item-value="mu_no"
                            :loading="mu.loading"
                            label="Masukan Management Unit"
                        >
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <p style="color:red;"><strong> * All Column Is Required!</strong></p>
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
              @click="UpdateDataProject()"
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
                default : {}
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

            project_no: '',

            projectCategory: {
                items: [
                    {text: "CSR", value: 'csr'},
                    {text: "Project Dua", value: 'project_dua_test'},
                    {text: "Project Tiga", value: 'project_tiga_test'},
                ],
                model: '',
                loading: false
            },
            projectName: '',
            project_start_date:{
                show: false,
                model: ''
            },
            project_end_date: {
                show: false,
                model: ''
            },
            projectDescription: '',
            projectLocation: '',
            total_trees: 0,
            co2_capture: 0,
            donors:{
                items: [],
                model: '',
                loading: false
            },
            mu:{
                items: [],
                model: '',
                loading: false
            },


            BaseUrlGet: '',
            authtoken: ''

        }),
        computed: {
            showModal: {
                get: function () {
                    if(this.show){
                        this.BaseUrlGet= localStorage.getItem("BaseUrlGet");
                        this.authtoken= localStorage.getItem("token");
                        this.resetData()
                        this.getMUList()
                        this.getDonorsList()
                        this.getDefaultData(this.itemData)
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
                this.projectCategory.model= ''
                this.projectName= ''
                this.project_start_date.model= ''
                this.project_end_date.model= ''
                this.projectDescription= ''
                this.projectLocation= ''
                this.total_trees= 0
                this.co2_capture= 0
                this.donors.model=''
                this.mu.model=''
            },
            async startDateOnChange(){
                if(this.project_end_date.model != ''){
                    if(this.project_start_date.model > this.project_end_date.model){
                        this.project_start_date.model = '' 
                        await Swal.fire({
                            title: 'Error',
                            text: "Tanggal Mulai Tidak Bisa Lebih Dari Tanggal Selesai!",
                            icon: 'error',
                            confirmButtonColor: '#2e7d32',
                            confirmButtonText: 'Okay',
                        })

                    } 
                }
            },
            saveButtonCondition(){
                if(this.projectCategory.model != '' && this.projectName != '' && this.project_start_date.model != '' && this.project_end_date.model != '' && this.projectDescription != '' && this.projectLocation != '' && this.total_trees != 0 && this.co2_capture != 0 && this.donors.model !='' && this.mu.model!='') return true
                return false
            },
            async endDateOnChange(){
                if(this.project_start_date.model != ''){
                    if(this.project_end_date.model <= this.project_start_date.model) {
                        this.project_end_date.model = '' 
                        await Swal.fire({
                            title: 'Error',
                            text: "Tanggal Selesai Tidak Bisa Kurang Dari Tanggal Mulai!",
                            icon: 'error',
                            confirmButtonColor: '#2e7d32',
                            confirmButtonText: 'Okay',
                        })
                    }
                }
            },
            async getDonorsList(){
                try {
                    this.donors.loading = true
                    const response = await axios.get(this.$store.getters.getApiUrl("GetDonorAllAdmin"), this.$store.state.apiConfig)
                    const data = response.data.donors || []
                    this.donors.items = data
                } catch (error) {
                    if (error.response) {
                        if (error.response.status == 401) {
                            localStorage.removeItem("token")
                            this.$router.push("/")
                        }
                    } else console.error(error)
                } finally {
                    this.donors.loading = false
                }
            },
            async getMUList(){
                try {
                    this.mu.loading = true
                    const response = await axios.get(this.$store.getters.getApiUrl("GetManagementUnit"), this.$store.state.apiConfig)
                    const data = response.data.data.result || []
                    this.mu.items = data
                } catch (error) {
                    if (error.response) {
                        if (error.response.status == 401) {
                            localStorage.removeItem("token")
                            this.$router.push("/")
                        }
                    } else console.error(error)
                } finally {
                    this.mu.loading = false
                }
            },

        async UpdateDataProject(){
            try{
                const confirmation = await Swal.fire({
                    title: 'Anda Yakin Untuk Menyimpan Perubahan Data Project?',
                    text: "Proses Tidak Dapat Dikembalikan!",
                    icon: 'warning',
                    confirmButtonColor: '#2e7d32',
                    confirmButtonText: 'Okay',
                    showCancelButton: true
                })
                if(confirmation.isConfirmed){
                    const params = {
                        project_no: this.project_no,
                        project_category: this.projectCategory.model,
                        project_name: this.projectName,
                        start_date: this.project_start_date.model,
                        end_date: this.project_end_date.model,
                        description: this.projectDescription,
                        location: this.projectLocation,
                        tree_amount: this.total_trees,
                        co2_capture: this.co2_capture,
                        donors: this.donors.model,
                        mu_no: this.mu.model
                    }
                    console.log(params)
                    // const url = `AddNewProject?${params}`
                    const PostData = await axios.post(
                        this.BaseUrlGet + "UpdateDataProject",
                            params,
                            {
                            headers: {
                                Authorization: `Bearer ` + this.authtoken,
                            },
                            }
                    );
                    const data = PostData.data
                    await Swal.fire({
                        title: 'Sukses!',
                        text: "Berhasil Menyimpan Perubahan Data Project!",
                        icon: 'success',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Okay'
                    })
                    
                }
            }catch(error){
                await Swal.fire({
                    title: 'Error!',
                    text: "Gagal Menyimpan Perubahan Data Project!",
                    icon: 'error',
                    confirmButtonColor: '#2e7d32',
                    confirmButtonText: 'Okay'
                })
            }
            this.showModal = false
        },
        getDefaultData(Obj){
            this.project_no = Obj.project_no
            this.projectCategory.model= Obj.project_category
            this.projectName= Obj.project_name
            this.project_start_date.model= Obj.project_date
            this.project_end_date.model= Obj.end_project
            this.projectDescription= Obj.project_description
            this.projectLocation= Obj.location
            this.total_trees= Obj.total_trees
            this.co2_capture= Obj.co2_capture
            this.donors.model=Obj.donors
            this.mu.model=Obj.mu_no
        }
    }
    
}
</script>