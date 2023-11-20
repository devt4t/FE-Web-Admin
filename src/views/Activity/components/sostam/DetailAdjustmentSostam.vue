<template>
    <v-dialog 
        v-model="showModal"
        scrollable
        max-width="800px"
        transition="dialog-transition"
        content-class="rounded-xl">
        <v-card rounded="xl">
          <v-card-title class="mb-1 headermodalstyle">
            <span class="">Detail Adjustment Bibit Sosialisasi Tanam</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- Content -->
            <v-container>
              <v-divider
                style="background-color: black !important"
              ></v-divider>
              <strong>Data Umum</strong>
              <v-simple-table>
                <template>
                  <tbody>
                    <tr>
                      <th
                        class="text-left"
                        style="width: 200px; font-size: 14px"
                      >
                        Form No
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{defaultItem.form_no}}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th
                        class="text-left"
                        style="width: 200px; font-size: 14px"
                      >
                        Tahun Program
                      </th>
                      <th class="text-left" style="font-size: 14px">
                        {{defaultItem.program_year}}
                      </th>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Nama FF
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{defaultItem.ff_name}}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Nama Petani
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{defaultItem.farmer_name}}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Nomor Lahan
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{defaultItem.lahan_no}}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Koordinat Distribusi
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{defaultItem.distribution_coordinates}}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        No Ktp
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{defaultItem.ktp_no}}</strong>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-divider
                style="background-color: black !important"
              ></v-divider>
              <v-divider
                style="background-color: black !important"
              ></v-divider>
              <v-divider
                style="background-color: black !important"
              ></v-divider>
              <div>
                <h4 class="mt-3">Jenis dan Jumlah Bibit</h4>
                <v-simple-table >
                  <tbody>
                    <tr>
                      <th
                        class="text-left"
                        style="width: 200px; font-size: 14px"
                      >
                        Total Bibit Sebelum Adjustment 
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{defaultItem.max_seed_amount}}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th
                        class="text-left"
                        style="width: 200px; font-size: 14px"
                      >
                        Total Bibit Setelah Adjustment 
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{defaultItem.max_seed_amount_new}}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th
                        class="text-left"
                        style="width: 200px; font-size: 14px"
                      >
                        Persentase Adjustment Bibit 
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{defaultItem.percentage.toFixed(2)}}%</strong>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <h3 class="ml-1">
                  <v-data-table
                    :headers="headers"
                    :items="itemDataPlanting"
                    class="elevation-1"
                  >
                    <template v-slot:item.percentage="{ item }">
                              {{ item.percentage }}%
                            </template>
                  </v-data-table>
                </h3>
              </div>
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
              dark
              color="blue"
              class="px-5"
              rounded
              @click=""
              outlined
              elevation="1"
              disabled
            >
              <v-icon class="mr-1">mdi-pencil</v-icon>
              Edit Adjustment Data Bibit Sostam
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
            data: {
                type: String,
                default: ""
            },
            // data: {
            //     type: Object,
            //     default: null,
            // },
        },
        data: () => ({
            totalLahan : 0,
            itemData: [],
            itemDataPlanting: [],
            defaultItem:{
              form_no: "",
              program_year: "",
              ff_name: "",
              farmer_name: "",
              ktp_no: "",
              address: "",
              lahan_no: "",
              max_seed_amount: 0,
              max_seed_amount_new: 0,
              distribution_coordinates: 0,
              percentage: 0,
            },
            headers: [
              {text: 'Nama Pohon', value: 'tree_name'},
              {text: 'Kategori', value: 'tree_category'},
              {text: 'Jumlah Sebelum Adjustment', value: 'amount_old'},
              {text: 'Jumlah Adjustment', value: 'amount_new'},
              {text: 'Persentase Pengurangan', value: 'percentage'},

            ],
            items: [],
            items_raw: [],
            loading: {
              show: false,
              text: 'Loading...'
            },
            search: '',
            load: false,
            
        }),
        computed: {
            showModal: {
                get: function () {
                    if(this.show){
                     
                        this.getTableData({
                            form_no: this.data
                        })   
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
            async getTableData(getparams) {
              console.log(this.data);
                try {
                    this.loading.show = true
                    const params = new URLSearchParams(getparams)
                    const url = `GetSocializationAdjustmentDetail?${params}`
                    const call = await axios.get(this.$store.getters.getApiUrl(url), this.$store.state.apiConfig)
                    const data = call.data.data.result

                    this.defaultItem.form_no = data.form_no
                    this.defaultItem.program_year = data.program_year
                    this.defaultItem.lahan_no = data.lahan_no
                    this.defaultItem.max_seed_amount_new = data.max_seed_amount_new,
                    this.defaultItem.max_seed_amount = data.max_seed_amount,
                    this.defaultItem.ff_name = data.ff_no
                    this.defaultItem.farmer_name = data.nama_petani
                    this.defaultItem.ktp_no = data.ktp_no
                    this.defaultItem.distribution_coordinates = data.distribution_coordinates
                    this.defaultItem.percentage = data.percentage

                    
                    // this.itemData = data
                    this.itemDataPlanting= data.planting_details

                    const totalData = call.data.totalData
                    this.totalLahan = totalData
                } catch (err) {this.errorResponse(err)} finally {
                    this.loading.show = false
                }
            }
    }
    
    }
    </script>