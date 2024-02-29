<template>
  <div>
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      data-aos="fade-right"
      class="breadcrumbsmain"
      :items="[{
        text: 'Activities',
        disabled: true,
        href: 'breadcrumbs_dashboard',
      },{
        text: 'Monitoring 2',
        disabled: true,
        href: 'breadcrumbs_link_1',
      }]"
      divider=">"
      large
    ></v-breadcrumbs>
    <!-- trees preview component -->
    <!-- <TreesPreview></TreesPreview> -->
    <detailModal
      :show="details.detailModalMO2"
      :dataDetail="details.monitoring2Details"
      :treeDetail="details.monitoring2TreeDetails"
      :generalDatas="details.generalData"
      @close="details.detailModalMO2 = false">
    ></detailModal>

    <manualForm
      :show="details.manualFormDialog"
      :itemDataMO1="details.monitoring1Details"
      :itemDataMO2="details.monitoring2Details"
      :generalDatas="details.generalData"
      @close="details.manualFormDialog = false">
    </manualForm>

    <ExportExcelForLablejoy
    :show="dialogExportDataToExcel.show"
    :dataObject="details.monitoring2Details"
    :lahan_no="dialogDigitalBarcode.lahan_no"
    :program_year="localConfig.programYear"
    @close="dialogExportDataToExcel.show = false"
    >
    </ExportExcelForLablejoy>

    <v-dialog
      v-model="dialogDigitalBarcode.show"
      max-width="800px"
      content-class="rounded-xl">
      <v-card-title class="mb-1 headermodalstyle">
          <span class="headline">Barcode Pohon Monitoring 2 Digital</span>
      </v-card-title>
      <v-card style="position: relative">
        <v-overlay v-if="dialogDigitalBarcode.loading.show" absolute justify-center align-center>
          <div class="d-flex flex-column align-center justify-center">
            <v-progress-circular
                :size="80"
                :width="7"
                indeterminate
                color="white"
            >
            </v-progress-circular>
            <p class="mb-0 text-center mt-4">{{ dialogDigitalBarcode.loading.text || 'Loading...' }}</p>
          </div>
        </v-overlay>
        <H2>Unduh Data Excel Untuk LabelJoy!</H2>
        <!-- <div class="d-flex flex-column py-4" id="app">
          <v-row no-gutters v-for="n in details.monitoring2Details" :key="`frontCard-${n.tree_no}-${n.planting_year}`">
              <v-col cols="4">
                <v-sheet class="pa-2 ma-2">
                  <qr-code v-bind:text="n.tree_no">
                    Kode Tidak Valid!.
                  </qr-code>
                  <h4 class="mb-0 text-center mt-4">{{ n.tree_no }}</h4>
                </v-sheet>
              </v-col>
              <v-col>
                <v-sheet class="pa-2 ma-2">
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Jenis Pohon</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ n.tree_name }}</h4>
                    </v-col>
                  </v-row>
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Tahun Tanam</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ n.planting_year }}</h4>
                    </v-col>
                  </v-row>
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Nama Petani</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ n.farmer_name }}</h4>
                    </v-col>
                  </v-row>
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Nomor Lahan</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ n.lahan_no }}</h4>
                    </v-col>
                  </v-row>
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Desa</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ n.village }}</h4>
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>
            </v-row>

          <vue-html2pdf 
            :show-layout="false"
            :float-layout="true" 
            :enable-download="false" 
            :preview-modal="true"
            :paginate-elements-by-height="20000"
            :pdf-quality="2"
            :margin="5"
            :manual-pagination="false" 
            pdf-format="a8" 
            pdf-orientation="portrait" 
            pdf-content-width="315px"
            ref="html2Pdf">
            <section slot="pdf-content">
              <v-row v-for="n in dialogDigitalBarcode.cardData" :key="`exportCard-${n.tree_no}`" no-gutters style="padding-top: 162px; padding-bottom: 43px;">
               <v-col cols="3" style="padding-left: 2%;">
                  <v-sheet>
                      <qr-code v-bind:text="n.tree_no" :size="75" align="center">
                        Kode Tidak Valid!.
                      </qr-code>
                      
                  </v-sheet>
                </v-col>
                <v-col style="padding-left: 2%;">
                  <v-sheet class="pa-2 ma-2">
                    <v-row no-gutters style="height: 30px;">
                      <v-col cols="5">
                        <h6 class="mb-0 text-center mt-4" style="font-size: 10px;">{{ n.tree_no }}</h6>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="height: 15px;">
                      <v-col cols="5">
                        <h6 style="font-size: 10px;">{{ n.tree_name }}</h6>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="height: 15px;">
                      <v-col cols="5">
                        <h6 style="font-size: 10px;">{{ n.planting_year }}</h6>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="height: 15px;">
                      <v-col cols="5">
                        <h6>Nomor Lahan</h6>
                      </v-col>
                      <v-col cols="5">
                        <h6>: {{ n.lahan_no }}</h6>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="height: 15px;">
                      <v-col cols="5">
                        <h6>Desa</h6>
                      </v-col>
                      <v-col cols="5">
                        <h6>: {{ n.village }}</h6>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </v-col>
              </v-row>
            </section>
          </vue-html2pdf>
        </div> -->
      </v-card>
      <v-card-actions style="position: relative">
        <v-row>
          <v-col v-if="false">
            <v-btn dark color="blue lighten-1" @click="generateExportDetail" rounded
              class="d-none d-lg-block">
              <v-icon class="mr-1" small>mdi-printer</v-icon> Export PDF
            </v-btn>
          </v-col>
          <v-col v-if="User.role_group=='IT' || User.role_name=='UNIT MANAGER'">
            <v-btn dark color="green lighten-1" @click="dialogExportDataToExcel.show = true" rounded
              class="d-none d-lg-block">
              <v-icon class="mr-1" small>mdi-printer</v-icon> Open Export Excel
            </v-btn>
          </v-col>
          <v-col align="end">
            <v-btn rounded outlined color="red lighten-1" @click="dialogDigitalBarcode.show = false">
              <v-icon class="mr-1" small>mdi-close</v-icon> Close
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-dialog>

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
      }"
    >
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
      <template v-slot:top>
        <v-row class="ma-0 mt-2 mr-2 align-center">
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
          
          <v-divider class="mx-2 d-none d-md-block"></v-divider>
          <v-btn
            v-if="User.role_group=='IT' || User.role_name=='UNIT MANAGER' || User.role_name=='FIELD COORDINATOR'"
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="$router.push('populateDataMonitoring1')"
            color="green white--text"
          >
            <v-icon class="mr-1">mdi-zip-box</v-icon> Populate Data Lahan
          </v-btn>
          <!-- <v-btn
            v-if="User.role_group=='IT'"
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="dialogDigitalBarcode.show = true"
            color="green white--text"
          >
            <v-icon class="mr-1">mdi-zip-box</v-icon> Barcode Pohon Monitoring
          </v-btn> -->
          <!-- <v-btn
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click=""
            color="info white--text"
          >
            <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export
          </v-btn> -->

        </v-row>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-6">
          <v-data-table
          data-aos="fade-up"
          data-aos-delay="200"
          class="rounded-xl elevation-6 mx-3 pa-1 mb-2"
          :headers="subTable.headers"
          :items="subTable.dataobject"
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


          <template v-slot:top>
            <v-row class="pt-3 px-2">
              <v-col cols="12" lg="6" class="d-flex align-center">
              <v-col cols="12" lg="6" class="d-flex">
                  <v-text-field
                      color="success"
                      item-color="success"
                      v-model="searchByFarmer"
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
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.is_verified > 0 ? 'green' : 'red'" class="white--text pl-1">
              <v-icon class="mr-1">mdi-{{ item.is_verified > 0 ? `${ item.is_verified == 2 ? 'checkbox-multiple-marked' : 'check'}` : 'close' }}-circle</v-icon>
              {{ item.is_verified > 0 ? item.verified_by : 'Belum Terverifikasi' }}
            </v-chip>
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
            <v-list class="d-flex flex-column align-center">
            <v-list-item>
              <v-btn
                  dark
                  rounded
                  @click="openDetailMonitoring2Modal(item)"
                  color="blue"
                  class="px-5"
                  >
                <!-- <v-icon class="mr-1" small color="white">
                  mdi-info
                </v-icon> -->
                Detail Monitoring2
              </v-btn>
            </v-list-item>  
            <v-list-item v-if="User.role_group === 'IT' || User.role_name == 'UNIT MANAGER' || User.role_name == 'FIELD FACILITATOR'">
              <v-btn
                  dark
                  rounded
                  @click="openManualMonitoring2(item)"
                  color="orange"
                  class="px-5"
                  >
                <!-- <v-icon class="mr-1" small color="white">
                  mdi-print
                </v-icon> -->
                Cetak Form Monitoring Manual
              </v-btn>
            </v-list-item> 
            <v-list-item v-if="User.role_group == 'IT' || User.role_name == 'UNIT MANAGER'">
              <v-btn
                  dark
                  rounded
                  @click="openBarcodeDigital(item)"
                  color="green"
                  class="px-5"
                  >
                <!-- <v-icon class="mr-1" small color="white">
                  mdi-lable
                </v-icon> -->
                Label Monitoring Digital dan Cetak Label
              </v-btn>
            </v-list-item> 
            <!-- v-if="(User.role_group == 'IT' || User.role_name == 'UNIT MANAGER')  && item.is_verified == 0 && item.monitoring_time != null && item.monitoring_start != null && item.monitoring_end != null" -->
            <v-list-item v-if="(User.role_group == 'IT' || User.role_name == 'UNIT MANAGER')  && item.is_verified == 0 && item.monitoring_time != null && item.monitoring_start != null && item.monitoring_end != null">
              <v-btn
                  dark
                  rounded
                  @click="verifuMO2(item)"
                  color="green"
                  class="px-5"
                  >
                <!-- <v-icon class="mr-1" small color="white">
                  
                </v-icon> -->
                Verifikasi Monitoring 2
              </v-btn>
            </v-list-item>
            <v-list-item v-if="(User.role_group == 'IT')  && item.is_verified == 1">
              <v-btn
                  dark
                  rounded
                  @click="verifuMO2(item)"
                  color="red"
                  class="px-5"
                  >
                <v-icon class="mr-1" small color="white">
                  <mdi-check></mdi-check>
                </v-icon>
                Unverifikasi Monitoring 2
              </v-btn>
            </v-list-item>
            <v-list-item v-if="item.total_tree_monitoring != item.total_hidup">
              <v-btn
                  dark
                  rounded
                  @click="deleteData(item)"
                  color="red"
                  class="px-5"
                  >
                <v-icon class="mr-1" small color="white">
                  <mdi-check></mdi-check>
                </v-icon>
                Hapus Data Monitoring 2
              </v-btn>
            </v-list-item>    
            </v-list>
          </v-menu>
        </template>
        
      </v-data-table>
        </td>
      </template>
      <!-- index column -->
      <!-- <template v-slot:item.index="{item, index}">
        <span v-if="loadtable == false">
          {{ index + 1 + ((pagination.current_page - 1) * pagination.per_page) }}
        </span>
      </template> -->

      <!-- No Lahan Column -->
      
      
      <!-- Action Column -->
      <template v-slot:item.actions="{ item }">
        <v-menu content-class="rounded-xl">
          <template v-slot:activator="{attrs, on}">
            <v-btn v-bind="attrs" v-on="on" small fab icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-card class="pa-2 d-flex align-stretch flex-column justify-center">
            <v-btn color="info white--text" rounded small class="pl-1 d-flex justify-start align-center" @click="">
              <v-icon class="mr-1">mdi-information</v-icon> Detail
            </v-btn>
            <v-btn v-if="User.role" color="orange white--text" rounded small class="pl-1 mt-1 d-flex justify-start align-center" @click="() => {showEditUmumModal(item.monitoring_no)}">
              <v-icon class="mr-1">mdi-pencil-circle</v-icon> Edit
            </v-btn>
            <v-btn rounded small color="red darken-2 white--text" class="mt-1 pl-1 d-flex justify-start align-center" @click="() => showDeleteModal(item)" :disabled="deleteDisabled(item.is_validate)">
              <v-icon class="mr-1 pl-2">mdi-delete</v-icon> Delete
            </v-btn>
          </v-card>
        </v-menu>
      </template>
    </v-data-table>

    <!-- <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
    </v-snackbar> -->
  </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';
// import TreesPreview from "./components/monitoring2/TreesPreview.vue";
import VueHtml2pdf from 'vue-html2pdf';
import VueQRCodeComponent from 'vue-qrcode-component';
import ExportExcelForLablejoy from '@/views/Activity/monitoring2AddIn/ExportExcelForLablejoy';
import manualForm from "@/views/Activity/monitoring2AddIn/manualMonitoring2Form";
import detailModal from '@/views/Activity/monitoring2AddIn/detailMonitoring2';

export default {
  name: "Monitoring2",
  components: {
    // TreesPreview
    'qr-code': VueQRCodeComponent,
    'VueHtml2pdf': VueHtml2pdf,
    'ExportExcelForLablejoy': ExportExcelForLablejoy,
    'manualForm': manualForm,
    'detailModal': detailModal
},
  data: () => ({
    // general setting
    dialogExportDataToExcel:{
      show: false,
    },

    dialogDigitalBarcode: {
      show: false,
      loading:{
        show: false,
        text: 'Sedang Memuat Data Barcode!'
      },
      cardData:[],
      lahan_no: ''
    },

    authtoken: "",
    User: {},
    headers: [
      {text: 'No', value: 'index'},
      {text: 'Kode Area', value: 'area_code'},
      {text: 'Target Area', value: 'name'},
      {text: 'Management Unit', value: 'mu_name'},
      {text: 'Tahun Program', value: 'program_year'},
      {text: 'Detail Data Monitoring 2', value: 'data-table-expand', align: 'right'}
    ],
    tableLoading: false,
    dataobject: [],

    // Sub Table
    subTable:{
      headers: [
        {text: 'No', value: 'index'},
        {text: 'Nomor Monitoring', value: 'monitoring2_no'},
        {text: 'Management Unit', value: 'mu_no'},
        {text: 'Field Facilitator', value: 'assignToFF'},
        {text: 'Petani', value: 'farmer_name'},
        {text: 'Desa', value: 'village'},
        {text: 'Nomor Lahan', value: 'lahan_no'},
        {text: 'Kondisi Lahan', value: 'land_condition'},
        {text: 'Jumlah Total Pohon', value: 'qty_trees'},
        {text: 'Waktu Monitoring', value: 'monitoring_time'},
        {text: 'Waktu Awal Monitoring', value: 'monitoring_start'},
        {text: 'Waktu Akhir Monitoring', value: 'monitoring_end'},
        {text: 'Tahun Program', value: 'program_year'},
        {text: 'Status', value: 'status'},
        {text: 'Action', value: 'actions'}
      ],
      dataobject: [],
      tableLoading: false,
      expanded: [],
      expand_key: '',

    },
    itemTA: '',
    searchByFarmer: '',
    details:{
      monitoring1Details: [],
      monitoring2Details: [],
      monitoring2TreeDetails: [],

      generalData: {},

      detailDialog: false,
      manualFormDialog: false,

      detailModalMO2: false,
    },

    localConfig: {
      programYear: '',
    },

    // snackbar
    snackbar: {
      color: '',
      show: false,
      timeout: 5000,
      text: ''
    },
    User: '',
    authtoken: '',
    BaseUrlGet: '',

    }),
  watch: {
      'localConfig.programYear': {
        handler(val) {
          this.initializeParentTable()
        }
      },
      'searchByFarmer': {
        handler(val){
          this.getDataMonitoring2Main()
        }
      }
    },

  computed: {},
  created() {
      this.authtoken = localStorage.getItem("token");
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.localConfig.programYear = this.$store.state.programYear.model
      this.initializeParentTable();
    },

  destroyed() {
    // this.$store.state.maintenanceOverlay = false

    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },

  methods: {
    checkExpandenItem(item){
      console.log(item)
      this.itemTA = ''
      this.itemTA = item.item.area_code
      this.getDataMonitoring2Main()
    },
    openDetailMonitoring2Modal(item){

      this.getDetailData(item)

      this.details.detailModalMO2 = true
    },
    openManualMonitoring2(item){
      this.getDetailData(item)
      this.details.manualFormDialog = true
    },
    async getDetailData(item){
      var params = new URLSearchParams({
        monitoring_no: item.monitoring_no,
        monitoring2_no: item.monitoring2_no
      })
      try {
        this.details.monitoring1Details= []
        this.details.monitoring2Details= []
        this.details.monitoring2TreeDetails= []
        const response = await axios.get(
          this.BaseUrlGet +
          "GetNewMonitoring2Detail?"+ 
          params,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        if (response.data.length != 0) {
          this.details.monitoring1Details= response.data.data.result.mo1Details
          this.details.monitoring2Details= response.data.data.result.mo2Details
          this.details.monitoring2TreeDetails= response.data.data.result.mo2DetailTree
          console.log(this.details.monitoring2TreeDetails)
          // this.dialogDigitalBarcode.cardData = this.details.monitoring2Details
          this.details.generalData = item
          

          
        } else {
          this.details.monitoring1Details= []
          this.details.monitoring2Details= []
          this.details.monitoring2TreeDetails= []
          this.details.manualFormDialog = false
          this.details.detailModalMO2 = false
        }
        
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.sessionEnd(error)
        } else {
          
        }
        this.details.monitoring1Details= []
        this.details.monitoring2Details= []
        this.details.monitoring2TreeDetails= []
        this.details.manualFormDialog = false
      }
    },
    openDetailMonitoring2(item){
      console.log(item)

      this.getDetailData(item.monitoring_no, item.monitoring2_no)
    },
    async deleteData(item){
      var params = {
        monitoring2_no: item.monitoring2_no,
        populate_no: item.populate_no
      }
      const confirmation = await Swal.fire({
          title: 'Apa Anda Yakin Untuk Menghapus Data Monitoring 2?',
          icon: 'warning',
          confirmButtonColor: '#2e7d32',
          confirmButtonText: 'Okay',
          showCancelButton: true
      })
      if(confirmation.isConfirmed){
        console.log(params)
        try {
          const response = await axios.post(
            this.BaseUrlGet + "deleteMonitoring2Datas" , params,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          this.subTable.expanded = []
          console.log(response)
          await Swal.fire({
              title: 'Berhasil Melakukan Hapus Data Monitoring 2!',
              icon: 'success',
              confirmButtonColor: '#2e7d32',
              confirmButtonText: 'Okay',
          })
        } catch (error) {
          await Swal.fire({
              title: 'Gagal Melakukan Hapus Data Monitoring 2!',
              text: 'Error: ' + error.response,
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
      }
    },
    async verifuMO2(item){
      var params = {
        monitoring2_no: item.monitoring2_no,
        verified_by: this.User.name,

      }
      const confirmation = await Swal.fire({
          title: 'Apa Anda Yakin Untuk Melakukan Verifikasi Monitoring 2?',
          icon: 'warning',
          confirmButtonColor: '#2e7d32',
          confirmButtonText: 'Okay',
          showCancelButton: true
      })
      if(confirmation.isConfirmed){
          console.log(params)
          try {
            const response = await axios.post(
              this.BaseUrlGet + "ValidateMonitoring2" , params,
              {
                headers: {
                  Authorization: `Bearer ` + this.authtoken,
                },
              }
            );
            this.subTable.expanded = []
            console.log(response)
            await Swal.fire({
                title: 'Berhasil Melakukan Verifikasi Monitoring 2!',
                icon: 'success',
                confirmButtonColor: '#2e7d32',
                confirmButtonText: 'Okay',
            })
          } catch (error) {
            console.error(error.response);
            this.subTable.expanded = []
            if (error.response.status == 401) {
              localStorage.removeItem("token");
              this.$router.push("/");
            }
          }
        }
    },
    async openBarcodeDigital(item){
      var params = new URLSearchParams({
        monitoring_no: item.monitoring_no,
        monitoring2_no: item.monitoring2_no
      })
      try {
        this.details.monitoring1Details= []
        this.details.monitoring2Details= []
        this.details.monitoring2TreeDetails= []
        const response = await axios.get(
          this.BaseUrlGet +
          "GetNewMonitoring2Detail?"+ 
          params,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        if (response.data.length != 0) {
          this.details.monitoring1Details= response.data.data.result.mo1Details
          this.details.monitoring2Details= response.data.data.result.mo2Details
          this.details.monitoring2TreeDetails= response.data.data.result.mo2DetailTree

          this.dialogDigitalBarcode.lahan_no= item.assignToFF
          console.log(item)
          this.details.generalData = item

          this.dialogDigitalBarcode.show = true
        } else {
          this.details.monitoring1Details= []
          this.details.monitoring2Details= []
          this.details.monitoring2TreeDetails= []
          this.details.manualFormDialog = false
        }
        
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.sessionEnd(error)
        } else {
          
        }
        this.details.monitoring1Details= []
        this.details.monitoring2Details= []
        this.details.monitoring2TreeDetails= []
        this.details.manualFormDialog = false
      }
    },

      
    // },
    async getDataMonitoring2Main(){
      try {
        
        this.subTable.tableLoading = true
        this.subTable.dataobject = [];
        const response = await axios.get(
          this.BaseUrlGet +
          "GetMonitoring2ByTA?program_year="+ 
          this.localConfig.programYear +
          "&ta=" + this.itemTA + "&search_value=" + this.searchByFarmer,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        if (response.data.length != 0) {
          this.subTable.dataobject = response.data.data.result
        } else {
          this.subTable.dataobject = [];
          // this.loadtable = false;
        }
        this.subTable.tableLoading = false
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.sessionEnd(error)
        } else {
          this.subTable.dataobject = [];
          // this.loadtable = false;
        }
        this.subTable.tableLoading = false
      }
    },
    firstAccessPage(){
      this.initializeParentTable()
    },
    generateExportDetail() {
      this.$refs.html2Pdf.generatePdf()
    },
    LatLng(lat, lng) {
      const array = [parseFloat(lat), parseFloat(lng)];
      //   console.log(array);
      return array;
    },
    async initializeParentTable(){
      try {
          this.$store.state.loadingOverlay = true
          this.$store.state.loadingOverlayText = "Memuat TA Monitoring 2..."
          this.dataobject = [];
          const response = await axios.get(
            this.BaseUrlGet +
            "GetTAForMonitoring2?program_year="+ 
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
            // this.loadtable = false;
          }
            this.$store.state.loadingOverlay = false
            this.$store.state.loadingOverlayText = ""
        }
    },
    async getPopulateTableData(area_code){
        try {
          this.tableLoading = true
          this.dataobject = [];
          // const response = await axios.get(
          //   this.BaseUrlGet +
          //   "GetMonitoring1PopulateByTA?program_year="+ 
          //   this.localConfig.programYear +
          //   "&ta=" +
          //   area_code,
          //   {
          //     headers: {
          //       Authorization: `Bearer ` + this.authtoken,
          //     },
          //   }
          // );
          if (response.data.length != 0) {
            this.dataobject = response.data.data.result
            this.tableLoading = false
          } else {
            this.dataobject = [];
            this.tableLoading = false
            // this.loadtable = false;
          }
        } catch (error) {
          console.error(error);
          if (error.response.status == 401) {
            this.sessionEnd(error)
            this.tableLoading = false
          } else {
            this.dataobject = [];
            this.tableLoading = false
            // this.loadtable = false;
          }
        }
      }
  },
};
</script>
