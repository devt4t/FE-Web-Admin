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
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      v-model="updateItem.sampling"
                      :items="['Exact', 'Random']"
                      label="Pilih Metode Sampling"
                      outlined
                      clearable
                      type="string"
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="village"
                      :items="itemDesa"
                      item-text="namaDesa"
                      item-value="kode_desa"
                      label="Pilih Desa Penugasan"
                      outlined
                      clearable
                      type="string"
                      v-on:change="getFFbyVillage"
                    ></v-select>
                  </v-col>
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
                :disabled="updateItem.sampling == '' || village == ''|| updateItem.assign_to == ''"
                color="green white--text" 
                class="px-4">
                <v-icon 
                class="mr-1">mdi-check-bold
                </v-icon> Update Data!
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>

      <manualForm
      :show="formModal"
      @close="formModal = false">
      </manualForm>

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
              <v-btn
                v-if="User.role_group=='IT'"
                rounded
                dark
                class="px-9"
                color="green"
                @click="formModal=true"
              >
              <strong>Print Form Monitoring 2 Manual</strong>
              <v-icon class="mx-2">mdi-</v-icon> 
              </v-btn>
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
          <!-- Status -->
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
                  :disabled="User.role_group != 'IT' && User.role_name != 'PLANNING MANAGER'"
                  class="px-5"
                  >
                <v-icon class="mr-1" small color="white">
                  mdi-file-document-edit
                </v-icon>
                Lengkapi Data!
              </v-btn>
            </v-list-item>  
            <v-list-item v-if="item.sampling != '-' && item.assigned_to != '-'">
              <v-btn
                  dark
                  rounded
                  @click="pushGenerateMonitoring2(item)"
                  color="green"
                  :disabled="User.role_group != 'IT' && User.role_name != 'PLANNING MANAGER'"
                  class="px-5"
                  >
                <v-icon class="mr-1" small color="white">
                  mdi-check-bold
                </v-icon>
                Generate Monitoring 2!
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
  import manualForm from "@/views/Activity/monitoring2AddIn/manualMonitoring2Form";

  
  export default {
    name: "Donor",
    components: {
      manualForm
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
          {text: 'Sampling', value: 'sampling'},
          {text: 'Ditugaskan Pada', value: 'assigned_to'},
          {text: 'Action', value: 'actions'}
        ],
        populateDataObject: [],
        expanded: []
      },
      updateItem:{
        populate_no: '',
        sampling: 'Random',
        assign_to: ''
      },
      targetAreaModel: '',
      itemFFPerDesa: [],
      itemDesa: [],
      village: '',

      User: ''
    }),
  
    created() {
      this.authtoken = localStorage.getItem("token");
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.localConfig.programYear = this.$store.state.programYear.model
      this.initialize();
    },
    watch: {
      'localConfig.programYear': {
        handler(val) {
          this.initialize()
        }
      }
    },
  
    computed: {
      
    },
    methods: {
      checkExpandenItem(item){ 
        this.expand_key=item.item.area_code
        this.getPopulateTableData(item.item.area_code)

      },
      async initialize() {
        try {
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
        } catch (error) {
          console.error(error);
          if (error.response.status == 401) {
            this.sessionEnd(error)
          } else {
            this.dataobject = [];
            // this.loadtable = false;
          }
        }
      },
      openUpdateModal(item){
        console.log(item)
        this.updateItem.assign_to = ''
        this.updateItem.populate_no = ''
        this.updateItem.populate_no = item.populate_no
        this.targetAreaModel = item.target_area 
        console.log(this.targetAreaModel)
        this.getVillage()
        this.showUpdateModal = true
        // this.getVillage(item)
      },
      async pushGenerateMonitoring2(item){
        console.log(item)
      },
      async pushUpdateData() {
        var params = {
          populate_no: this.updateItem.populate_no,
          sampling: this.updateItem.sampling,
          assign_to: this.updateItem.assign_to
        }
        console.log(params)
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
        } catch (error) {
          console.error(error.response);
          this.subTable.expanded = []
          this.showUpdateModal = false
          if (error.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
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
      async getPopulateTableData(area_code){
        try {
          this.subTable.tableLoading = true
          this.subTable.populateDataObject = [];
          const response = await axios.get(
            this.BaseUrlGet +
            "GetMonitoring1PopulateByTA?program_year="+ 
            this.localConfig.programYear +
            "&ta=" +
            area_code,
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
  