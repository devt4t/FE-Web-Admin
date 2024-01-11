<template>
    <v-dialog 
        v-model="showModal"
        scrollable
        max-width="800px"
        transition="dialog-transition"
        content-class="rounded-xl">
        <v-card rounded="xl">
            <v-card-title class="rounded-xl orange darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-pencil-plus</v-icon> Tambahkan Project Lahan!
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- Content -->
            <v-container>
                <strong>Nomor Lahan: {{ this.lahan_no }}</strong>
                <v-divider
                  style="background-color: black !important"
                ></v-divider>
                <v-select
                    color="success"
                    item-color="success"
                    v-model="projectItem.model"
                    :items="projectItem.items"
                    outlined
                    dense
                    hide-details
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    rounded
                    label="Pilih Project Lahan"
                    class="mx-auto mx-lg-4 mr-lg-2 mb-4 mb-lg-0 py-4"
                    style="max-width: 600px"
                ></v-select>
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
                v-if="projectItem.model != ''"
              dark
              color="green"
              class="px-5"
              rounded
              @click="saveDataProjectLahan()"
              outlined
              elevation="1"
                          >
              <v-icon class="mr-1">mdi-pencil-plus</v-icon>
              Simpan Project Lahan
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
            lahan_no: {
                type: String,
                default: ""
            },
        },
        data: () => ({

            items: [],
            items_raw: [],
            loading: {
              show: false,
              text: 'Loading...'
            },
            load: false,
            
            projectItem: {
                items: ['satu', 'dua', 'tiga'],
                model: ''
            },

        }),
        computed: {
            showModal: {
                get: function () {
                    if(this.show){
                        this.projectItem.model= ''
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
        async saveDataProjectLahan(){
            const confirmation = await Swal.fire({
                title: 'Anda Yakin Untuk Menyimpan Data Project Lahan?',
                text: "Proses Tidak Dapat Dikembalikan!",
                icon: 'warning',
                confirmButtonColor: '#2e7d32',
                confirmButtonText: 'Okay',
                showCancelButton: true
            })
            if(confirmation.isConfirmed){
                const params = {
                    lahan_no: this.lahan_no,
                    project: this.projectItem.model
                }
                console.log(params)
                this.showModal = false
            }

        }
    }
    
}
</script>