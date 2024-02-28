<template>
    <div>
        <v-breadcrumbs
        :dark="$store.state.theme == 'dark'"
        data-aos="fade-right"
        class="breadcrumbsmain"
        :items="itemsbr"
        divider=">"
        large
      ></v-breadcrumbs>
      <!-- dialogs -->
      <v-dialog 
        v-model="showUpdateModal"
        scrollable
        max-width="750px"
        transition="dialog-transition"
        content-class="rounded-xl"
        >
        <v-card>
          <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> Lengkapi Data Populasi Monitoring1 - Monitoring2
                <v-icon color="white" class="ml-auto" @click="showUpdateModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text>
              <v-container class="mb-2">
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    Nama Petani: <strong>{{ itemDetailForUpdate.farmer_name }}</strong>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    Tahun Program: <strong>{{ itemDetailForUpdate.program_year }}</strong>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    FF Tahun 2022: <strong>{{ itemDetailForUpdate.ff_name }}</strong>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    Nomor Lahan: <strong>{{ itemDetailForUpdate.lahan_no }}</strong>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    Management Unit (2022): <strong>{{ itemDetailForUpdate.mu_name }}</strong>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    Jumlah Pohon Hidup (2022): <strong>{{ itemDetailForUpdate.total_hidup }}</strong>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    Target Area (2022): <strong>{{ itemDetailForUpdate.target_area_name }}</strong>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="updateItem.sampling"
                      :items="['Tetap', 'Random']"
                      label="Pilih Metode Sampling"
                      outlined
                      clearable
                      type="string"
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <!-- <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="village"
                      :items="itemDesa"
                      item-text="namaDesa"
                      item-value="kode_desa"
                      label="Pilih Desa Penugasan (Sekarang)"
                      outlined
                      clearable
                      type="string"
                      v-on:change="getFFbyVillage"
                    ></v-select>
                  </v-col> -->
                  <v-col cols="12" sm="6" md="6">
                    <v-select 
                      v-model="updateItem.assign_to"
                      :items="itemFFPerDesa"
                      item-text="name"
                      item-value="ff_no"
                      label="Pilih Penugasan Ke FF"
                      outlined
                      clearable
                      type="string"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="red white--text" rounded @click="showUpdateModal = false">
                <v-icon color="white">
                    mdi-close-circle
                </v-icon>   
                Close
            </v-btn>
            <v-divider class="mx-2"></v-divider>

            <v-btn
                @click="pushUpdateData()" 
                rounded 
                :disabled="updateItem.sampling == '' || updateItem.assign_to == ''"
                color="green white--text" 
                class="px-4">
                <v-icon 
                class="mr-1">mdi-check-bold
                </v-icon> Update Data!
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>

      

      <!-- Main Table -->
      <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      class="rounded-xl elevation-6 mx-3 pa-1 mb-2"
      :headers="headers"
      :items="dataobject"
      :loading="tableLoading"
      loading-text="Loading... Please wait"
      :show-expand="true"
      single-expand
      @item-expanded="checkExpandenItem"
      :expanded.sync="subTable.expanded"
      :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman',
        itemsPerPageOptions: [10, 25, 50, 100, 250, 500],
        showCurrentPage: true,
        showFirstLastPage: true,
      }">
      <!-- index column -->
      <template v-slot:item.index="{item, index}">
        <span v-if="tableLoading == false">
          {{ index + 1 }}
        </span>
        <v-progress-circular
          v-else
          indeterminate
          color="green"
          size="20"
        ></v-progress-circular>
      </template>

      <template v-slot:top>
          <v-row class="pt-3 px-2">
            <v-col cols="12" lg="6" class="d-flex align-center">
              <!-- Program Year -->
              <v-select
                color="success"
                item-color="success"
                v-model="localConfig.programYear"
                :items="$store.state.programYear.options"
                outlined
                dense
                hide-details
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                rounded
                label="Tahun Program"
                class="mx-auto mx-lg-3"
                style="max-width: 200px"
              ></v-select>
              <v-divider class="mx-2 d-none d-md-block" inset></v-divider>
              <!-- <v-btn
                v-if="User.role_group=='IT'"
                rounded
                dark
                class="px-9"
                color="green"
                @click="formModal=true"
              >
              <strong>Print Form Monitoring 2 Manual</strong>
              <v-icon class="mx-2">mdi-</v-icon> 
              </v-btn> -->
              <!-- Refresh Button -->
            </v-col>
          </v-row>
      </template>
      <!-- Color Status -->
      <template v-slot:item.active_status="{ item }">
        <v-chip :color="item.active== 1 ? 'green' : (item.active == 0 ? 'red' : '-')" dark>
          {{ item.active == 1 ? 'Terverifikasi' : (item.active == 0 ? 'Belum Terverifikasi' : '-')  }}
        </v-chip>
      </template>

      <!--Expand Detail table -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-6">
          <v-data-table
          data-aos="fade-up"
          data-aos-delay="200"
          class="rounded-xl elevation-6 mx-3 pa-1 mb-2"
          :headers="subTable.headers"
          :items="subTable.populateDataObject"
          :loading="subTable.tableLoading"
          loading-text="Loading... Please wait"
          :footer-props="{
            itemsPerPageText: 'Jumlah Data Per Halaman',
            itemsPerPageOptions: [10, 25, 40, -1],
            showCurrentPage: true,
            showFirstLastPage: true,
          }"
          >

          <template v-slot:item.lahan_no="{item}">
            <v-chip v-if="lahanNoFormat(item.lahan_no).length < 2" class="green white--text ma-1">
              {{ lahanNoFormat(item.lahan_no)[0] }}
            </v-chip>
            <v-menu v-else open-on-hover offset-x :close-on-content-click="false" content-class="rounded-xl" >
              <template v-slot:activator="{attrs, on}">
                <v-btn rounded small v-bind="attrs" v-on="on" :color="`green darken-${(lahanNoFormat(item.lahan_no).length - 1) < 5 ? (lahanNoFormat(item.lahan_no).length - 1) : 4} white--text`">
                  {{ lahanNoFormat(item.lahan_no).length }} Lahan
                </v-btn>
              </template>
              <v-card class="pa-2 pb-1 d-flex flex-column">
                <v-chip 
                  v-for="(lahan, lahanIndex) in lahanNoFormat(item.lahan_no)" 
                  :key="lahanIndex"
                  color="green white--text"
                  class="mb-1"
                  style="cursor: auto"
                >
                  {{ lahan }}
                </v-chip>
              </v-card>
            </v-menu>
          </template>

          <!-- index column -->
          <template v-slot:item.index="{item, index}">
            <span v-if="subTable.tableLoading == false">
              {{ index + 1 }}
            </span>
            <v-progress-circular
              v-else
              indeterminate
              color="green"
              size="20"
            >
            </v-progress-circular>
          </template>
          <!-- top bar -->
          <template v-slot:top>
            <v-row class="pt-3 px-2">
              <v-col cols="12" lg="6" class="d-flex align-center">
              <!-- Program Year -->
              <v-col cols="12" lg="6" class="d-flex">
                  <v-text-field
                      color="success"
                      item-color="success"
                      v-model="populateSearchFarmer"
                      placeholder="Pencarian Nama Petani..."
                      append-icon="mdi-magnify"
                      outlined
                      dense
                      rounded
                      label="Pencarian Nama Petani"
                      hide-details
                      
                  ></v-text-field>
                </v-col>
              <v-divider class="mx-2 d-none d-md-block" inset></v-divider>
            </v-col>
          </v-row>
          </template>


          <!-- Status -->
          <template v-slot:item.sts="{item}">
            <v-chip v-if="item.assigned_to == '-' || item.sampling == '-' && item.is_monitoring == 0" color="red white--text" class="pl-1 pr-3"><v-icon class="mr-1">mdi-close-circle</v-icon> Data Belum Lengkap</v-chip>
            <v-chip v-else-if="item.assigned_to != '-' && item.sampling != '-' && item.is_monitoring == 0" color="orange white--text" class="pl-1 pr-3"><v-icon class="mr-1">mdi-plus-circle-outline</v-icon> Data Sudah Siap</v-chip>
            <v-chip v-else-if="item.is_monitoring == 1" color="green white--text" class="pl-1 pr-3"><v-icon class="mr-1">mdi-check-circle-outline</v-icon> Data Sudah Masuk</v-chip>
          </template>
          <!-- Action table -->
        <template v-slot:item.actions="{ item }">
          <v-menu
            rounded="xl"
            bottom
            left
            offset-y
            transition="slide-y-transition"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" color="dark">
                mdi-arrow-down-drop-circle
              </v-icon>
            </template>
            <v-list class="d-flex flex-column align-stretch">
            <v-list-item v-if="item.sampling == '-' && item.assigned_to == '-'">
              <v-btn
                  dark
                  rounded
                  @click="openUpdateModal(item)"
                  color="green"
                  :disabled="User.role_group != 'IT' && User.role_name != 'PLANNING MANAGER' && User.role_name != 'FIELD COORDINATOR' && User.role_name != 'UNIT MANAGER'"
                  class="px-5"
                  >
                <v-icon class="mr-1" small color="white">
                  mdi-file-document-edit
                </v-icon>
                Lengkapi Data!
              </v-btn>
            </v-list-item>  
            <v-list-item v-if="item.sampling != '-' && item.assigned_to != '-' && item.is_monitoring == 0">
              <v-btn
                  dark
                  rounded
                  @click="pushGenerateMonitoring2(item)"
                  color="green"
                  :disabled="User.role_group != 'IT' && User.role_name != 'PLANNING MANAGER' && User.role_name != 'FIELD COORDINATOR' && User.role_name != 'UNIT MANAGER'"
                  class="px-5"
                  >
                <v-icon class="mr-1" small color="white">
                  mdi-check-bold
                </v-icon>
                Generate Monitoring 2!
              </v-btn>
            </v-list-item> 
            <v-list-item v-if="User.role_group == 'IT' && item.sampling != '-' && item.assigned_to != '-' && item.is_monitoring == 0">
              <v-btn
                  dark
                  rounded
                  @click="resetDataPopulate(item)"
                  color="red"
                  class="px-5"
                  >
                <v-icon class="mr-1" small color="white">
                  mdi-refresh
                </v-icon>
                Reset Data Populasi!
              </v-btn>
            </v-list-item> 
            </v-list>
          </v-menu>
        </template>
        
      </v-data-table>
        </td>
      </template>

      <!-- Action table -->
      <!-- <template v-slot:item.actions="{ item }">
        <v-menu
          rounded="xl"
          bottom
          left
          offset-y
          transition="slide-y-transition"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" color="dark">
              mdi-arrow-down-drop-circle
            </v-icon>
          </template>
          <v-list class="d-flex flex-column align-stretch">
            <v-list-item v-if="User.role_name == 'PLANNING MANAGER' || User.role_name == 'IT'">
              <v-btn
                dark
                class="px-7"
                rounded
                @click=""
                color="warning"
                block
                
              >
              <v-icon class="mr-1" small color="white">
                mdi-pencil
              </v-icon>
                Detail
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>

      </template> -->
    </v-data-table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  import Swal from 'sweetalert2';

  
  export default {
    name: "Donor",
    components: {
      
    },
    data: () => ({
      formModal: false,
      addModal: false,
      showUpdateModal: false,

      editDonors: {
        show: false,
        data: {}
      },

      page: 1,
      itemsPerPage: 10,
      itemsbr: [
        {
          text: "Activities",
          disabled: true,
          href: "breadcrumbs_dashboard",
        },
        {
          text: "Monitoring 2",
          disabled: true,
          href: "breadcrumbs_link_1",
        },
        {
          text: "Populate Data Monitoring 1",
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      search: "",
      authtoken: "",
      BaseUrlGet: "",
      tableLoading: false,
      populateSearchFarmer: '',
      headers: [
        {text: 'No', value: 'index'},
        {text: 'Kode Area', value: 'area_code'},
        {text: 'Target Area', value: 'name'},
        {text: 'Management Unit', value: 'mu_name'},
        {text: 'Tahun Program', value: 'program_year'},
        {text: 'Status', value: 'active_status'},
        // {text: 'Actions', value: 'actions', align: 'right'},
        {text: 'Detail Populated Data', value: 'data-table-expand', align: 'right'}
      ],
      dataobject: [],
      expanded: [],
      expand_key: '',

      snackbar: false,
      textsnackbar: "Test",
      timeoutsnackbar: 2000,
      colorsnackbar: null,
      localConfig: {
        programYear: '',
      },
      subTable: {
        tableLoading: false,
        headers: [
          {text: 'No', value: 'index'},
          {text: 'Kode Populate', value: 'populate_no'},
          {text: 'Nomor Lahan', value: 'lahan_no'},
          {text: 'Management Unit', value: 'mu_name'},
          {text: 'Target Area', value: 'target_area_name'},
          {text: 'Tahun Program', value: 'program_year'},
          {text: 'Nama Petani', value: 'farmer_name'},
          {text: 'Luas Lahan', value: 'land_area'},
          {text: 'Luas Area Tanam', value: 'planting_area'},
          {text: 'Pola Tanam', value: 'planting_option'},
          {text: 'Nama FF', value: 'ff_name'},
          {text: 'Total Pohon Hidup', value: 'total_hidup'},
          {text: 'Sampling', value: 'sampling'},
          {text: 'Ditugaskan Pada', value: 'assigned_to_name'},
          {text: 'Status Data', value: 'sts'},
          {text: 'Action', value: 'actions'}
        ],
        populateDataObject: [],
        expanded: []
      },
      itemDetailForUpdate: {},
      updateItem:{
        populate_no: '',
        sampling: 'Random',
        assign_to: ''
      },
      targetAreaModel: '',
      itemFFPerDesa: [],
      itemDesa: [],
      progra_year_now: '',
      ta: '',
      village: '',

      User: ''
    }),
  
    created() {
      this.authtoken = localStorage.getItem("token");
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.getFFData(this.User.ff.ff)
      this.localConfig.programYear = this.$store.state.programYear.model
      this.initialize();
    },
    watch: {
      'populateSearchFarmer': {
        handler(val){
          this.getPopulateTableData()
        }
      },
      'localConfig.programYear': {
        handler(val) {
          this.initialize()
        }
      },
    },
  
    computed: {
      
    },
    methods: {
      lahanNoFormat(lahan_no) {
        return lahan_no.replace('[', '').replace(']', '').split(',')
      },
      checkExpandenItem(item){ 
        this.expand_key=item.item.area_code

        this.getPopulateTableData()

      },
      async initialize() {
        try {
          this.$store.state.loadingOverlay = true
          this.$store.state.loadingOverlayText = "Memuat Data Populasi..."
          this.dataobject = [];
          const response = await axios.get(
            this.BaseUrlGet +
            "GetTAForPopulateMonitoring1?program_year="+ 
            this.localConfig.programYear +
            "&ff=" +
            this.User.ff.ff,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          if (response.data.length != 0) {
            this.dataobject = response.data.data.result
          } else {
            this.dataobject = [];
            // this.loadtable = false;
          }
          this.$store.state.loadingOverlay = false
          this.$store.state.loadingOverlayText = ""
        } catch (error) {
          console.error(error);
          if (error.response.status == 401) {
            this.sessionEnd(error)
          } else {
            this.dataobject = [];
            this.$store.state.loadingOverlay = false
            this.$store.state.loadingOverlayText = ""
            // this.loadtable = false;
          }
        }
      },
      openUpdateModal(item){
        this.itemDetailForUpdate = item
        console.log(this.itemDetailForUpdate)
        this.updateItem.assign_to = ''
        this.updateItem.populate_no = ''
        this.updateItem.populate_no = item.populate_no
        this.targetAreaModel = item.target_area 
        console.log(this.targetAreaModel)
        this.getVillage()
        this.showUpdateModal = true
        // this.getVillage(item)
      },
      async resetDataPopulate(item){
        const confirmation = await Swal.fire({
          title: 'Apa Anda Yakin Untuk Melakukan RESET Data Populasi?',
          text: "Proses Tidak Dapat Dikembalikan!",
          icon: 'warning',
          confirmButtonColor: '#2e7d32',
          confirmButtonText: 'Okay',
          showCancelButton: true
      })
      if(confirmation.isConfirmed){
        this.$store.state.loadingOverlay = true
        this.$store.state.loadingOverlayText = "Loading... Sedang Melakukan Update Data"
         var params = {
          populate_no: item.populate_no
         }
          // console.log(item.populate_no)
          try {
            const response = await axios.post(
              this.BaseUrlGet + "resetDataPopulated" , params,
              {
                headers: {
                  Authorization: `Bearer ` + this.authtoken,
                },
              }
            );
            this.subTable.expanded = []
            console.log(response)
            await Swal.fire({
                title: 'Berhasil Melakukan RESET Data Populasi!',
                icon: 'success',
                confirmButtonColor: '#2e7d32',
                confirmButtonText: 'Okay',
            })
          } catch (error) {
            await Swal.fire({
              title: 'Gagal Melakukan Reset Data Populasi',
              text: "error:" + error.response,
              icon: 'error',
              confirmButtonColor: '#2e7d32',
              confirmButtonText: 'Okay',
            })
            console.error(error.response);
            this.subTable.expanded = []
            if (error.response.status == 401) {
              localStorage.removeItem("token");
              this.$router.push("/");
            }
          }
          this.$store.state.loadingOverlay = false
          this.$store.state.loadingOverlayText = ""
        }
      },
      async pushGenerateMonitoring2(item){
        
        const confirmation = await Swal.fire({
          title: 'Apa Anda Yakin Untuk Melakukan Generate Data Populasi Ke Monitoring 2?',
          text: "Proses Tidak Dapat Dikembalikan!",
          icon: 'warning',
          confirmButtonColor: '#2e7d32',
          confirmButtonText: 'Okay',
          showCancelButton: true
      })
      if(confirmation.isConfirmed){
          this.$store.state.loadingOverlay = true
          this.$store.state.loadingOverlayText = "Memuat Data Populasi..."
          try {
            const response = await axios.post(
              this.BaseUrlGet + "AddMonitoring2" , item,
              {
                headers: {
                  Authorization: `Bearer ` + this.authtoken,
                },
              }
            );
            this.subTable.expanded = []
            console.log(response)
            await Swal.fire({
                title: 'Berhasil Melakukan Generate Data Populasi Ke Monitoring 2!',
                icon: 'success',
                confirmButtonColor: '#2e7d32',
                confirmButtonText: 'Okay',
            })
          } catch (error) {
            await Swal.fire({
                title: 'Gagal Melakukan Generate Data Populasi Ke Monitoring 2!',
                text: 'error: ' + error.response,
                icon: 'error',
                confirmButtonColor: '#2e7d32',
                confirmButtonText: 'Okay',
            })
            console.error(error.response);
            this.subTable.expanded = []
            if (error.response.status == 401) {
              localStorage.removeItem("token");
              this.$router.push("/");
            }
          }
          this.$store.state.loadingOverlay = false
          this.$store.state.loadingOverlayText = ""
        }
      },
      async pushUpdateData() {
        var params = {
          populate_no: this.updateItem.populate_no,
          sampling: this.updateItem.sampling,
          assign_to: this.updateItem.assign_to
        }
        console.log(params)
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = "Loading... Sedang Melakukan Update Data!"
        try {
          const response = await axios.post(
            this.BaseUrlGet + "UpdateDataPopulate" , params,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          this.showUpdateModal = false
          this.subTable.expanded = []
          console.log(response)
          await Swal.fire({
            title: 'Berhasil Melakukan Update Data Populasi!',
            icon: 'success',
            confirmButtonColor: '#2e7d32',
            confirmButtonText: 'Okay',
          })
        } catch (error) {
          await Swal.fire({
            title: 'Gagal Melakukan Update Data Populasi!',
            text: 'error: '+error.response,
            icon: 'error',
            confirmButtonColor: '#2e7d32',
            confirmButtonText: 'Okay',
          })
          console.error(error.response);
          this.subTable.expanded = []
          this.showUpdateModal = false
          if (error.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = ""
      },
      async getFFData(item) {
        this.itemFFPerDesa = []
        this.updateItem.assign_to = ''
        try {
          const response = await axios.get(
          
            this.BaseUrlGet + `GetFFNow?ff_no=${item}` ,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          if (response.data.length != 0) {
            this.itemFFPerDesa = response.data.data.result
            console.log(this.itemFFPerDesa)
          }
          
        } catch (error) {
          console.error(error.response);
          this.itemDesa = [];
          if (error.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
          this.itemFFPerDesa = []
          this.updateItem.assign_to = ''
        }
      },
      async getVillage() {
        
        this.itemDesa = []
        this.village = ''
        
        try {
          const response = await axios.get(
          
            this.BaseUrlGet + `GetDesaNew?kode_ta=${this.targetAreaModel}` ,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          if (response.data.length != 0) {
            this.itemDesa = response.data.data.result
          }
          
        } catch (error) {
          console.error(error.response);
          this.itemDesa = [];
          if (error.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }
      },
      async getFFbyVillage() {
        this.itemFFPerDesa = []
        this.updateItem.assign_to = ''
        try {
          const response = await axios.get(
            // this.BaseUrlGet + `GetDesa?program_year=${this.generalSettings.programYear}&kode_ta=${valparam}` ,
            this.BaseUrlGet + `getFFbyVillage?village_no=${this.village}&&area_code=${this.targetAreaModel}` ,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          if (response.data.length != 0) {
            this.itemFFPerDesa = response.data.data.result.data;
            // this.dataobject = response.data.data.result;
          }
          
        } catch (error) {
          this.itemFFPerDesa = [];
          console.error(error.response);
          if (error.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }
      },
      async getPopulateTableData(){
        try {
          this.subTable.tableLoading = true
          this.subTable.populateDataObject = [];
          const response = await axios.get(
            this.BaseUrlGet +
            "GetMonitoring1PopulateByTA?program_year="+ 
            this.localConfig.programYear +
            "&ta=" +
            this.expand_key + "&search_value=" + this.populateSearchFarmer,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          if (response.data.length != 0) {
            this.subTable.populateDataObject = response.data.data.result
            this.subTable.tableLoading = false
          } else {
            this.subTable.populateDataObject = [];
            this.subTable.tableLoading = false
            // this.loadtable = false;
          }
        } catch (error) {
          console.error(error);
          if (error.response.status == 401) {
            this.sessionEnd(error)
            this.subTable.tableLoading = false
          } else {
            this.subTable.populateDataObject = [];
            this.subTable.tableLoading = false
            // this.loadtable = false;
          }
        }
      }
    },
  };
  </script>
  