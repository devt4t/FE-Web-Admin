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
        <div class="d-flex flex-column py-4" id="app">
          <v-row no-gutters>
              <v-col cols="4">
                <v-sheet class="pa-2 ma-2">
                  <qr-code v-bind:text="dialogDigitalBarcode.cardData.barcodeValue">
                    Kode Tidak Valid!.
                  </qr-code>
                  <p class="mb-0 text-center mt-4">{{ dialogDigitalBarcode.cardData.barcodeValue }}</p>
                </v-sheet>
              </v-col>
              <v-col>
                <v-sheet class="pa-2 ma-2">
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Jenis Pohon</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ this.dialogDigitalBarcode.cardData.treeType }}</h4>
                    </v-col>
                  </v-row>
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Tahun Tanam</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ this.dialogDigitalBarcode.cardData.planting_year }}</h4>
                    </v-col>
                  </v-row>
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Nama Petani</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ this.dialogDigitalBarcode.cardData.farmerName }}</h4>
                    </v-col>
                  </v-row>
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Nomor Lahan</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ this.dialogDigitalBarcode.cardData.lahan_no }}</h4>
                    </v-col>
                  </v-row>
                  <v-row no-gutters style="height: 35px;">
                    <v-col cols="4">
                      <h4>Desa</h4>
                    </v-col>
                    <v-col>
                      <h4>: {{ this.dialogDigitalBarcode.cardData.village }}</h4>
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>
            </v-row>
            <!-- vue pdf downloader -->
          <vue-html2pdf 
            :show-layout="false"
            :float-layout="true" 
            :enable-download="false" 
            :preview-modal="true"
            :paginate-elements-by-height="2000"
            :filename="`Pelatihan petani - ${dialogDigitalBarcode.cardData.barcodeValue}`" 
            :pdf-quality="2"
            :margin="5"
            :manual-pagination="false" 
            pdf-format="a8" 
            pdf-orientation="landscape" 
            pdf-content-width="325px"
            ref="html2Pdf">
            <section slot="pdf-content">
              <v-row no-gutters style="padding-top: 48px; padding-bottom: 48px;">
              <!-- <v-col style="width: 1px;"></v-col> -->
              
               <v-col cols="3" style="padding-left: 2%;">
                
                  <v-sheet>
                    <!-- <div width="300" height="300"> -->
                      
                      <qr-code v-bind:text="dialogDigitalBarcode.cardData.barcodeValue" size="75" align="center">
                        Kode Tidak Valid!.
                      </qr-code>
                    <!-- </div> -->
                    <h6 class="mb-0 text-center mt-4">{{ dialogDigitalBarcode.cardData.barcodeValue }}</h6>
                  </v-sheet>
                </v-col>
                <v-col style="padding-left: 2%;">
                  <v-sheet class="pa-2 ma-2">
                    <v-row no-gutters style="height: 15px;">
                      <v-col cols="5">
                        <h6>Jenis Pohon</h6>
                      </v-col>
                      <v-col cols="5">
                        <h6>: {{ this.dialogDigitalBarcode.cardData.treeType }}</h6>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="height: 15px;">
                      <v-col cols="5">
                        <h6>Tahun Tanam</h6>
                      </v-col>
                      <v-col cols="5">
                        <h6>: {{ this.dialogDigitalBarcode.cardData.planting_year }}</h6>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="height: 15px;">
                      <v-col cols="5">
                        <h6>Nama Petani</h6>
                      </v-col>
                      <v-col cols="5">
                        <h6>: {{ this.dialogDigitalBarcode.cardData.farmerName }}</h6>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="height: 15px;">
                      <v-col cols="5">
                        <h6>Nomor Lahan</h6>
                      </v-col>
                      <v-col cols="5">
                        <h6>: {{ this.dialogDigitalBarcode.cardData.lahan_no }}</h6>
                      </v-col>
                    </v-row>
                    <v-row no-gutters style="height: 15px;">
                      <v-col cols="5">
                        <h6>Desa</h6>
                      </v-col>
                      <v-col cols="5">
                        <h6>: {{ this.dialogDigitalBarcode.cardData.village }}</h6>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </v-col>
              </v-row>
            </section>
          </vue-html2pdf>
        </div>
      </v-card>
      <v-card-actions style="position: relative">
        <v-row>
          <v-col>
            <v-btn dark color="blue lighten-1" @click="generateExportDetail" rounded
              class="d-none d-lg-block">
              <v-icon class="mr-1" small>mdi-printer</v-icon> Export PDF
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
      :headers="headers"
      :items="dataobject"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1"
      multi-sort
      :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman',
        itemsPerPageOptions: [10, 20, 30, 40, 100, 200],
        showCurrentPage: true,
        showFirstLastPage: true,
      }"
    >
      <template v-slot:top>
        <v-row class="ma-0 mt-2 mr-2 align-center">
          <!-- Program Year -->
          
          <v-divider class="mx-2 d-none d-md-block"></v-divider>
          <v-btn
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="$router.push('populateDataMonitoring1')"
            color="green white--text"
          >
            <v-icon class="mr-1">mdi-zip-box</v-icon> Populate Data Lahan
          </v-btn>
          <v-btn
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="dialogDigitalBarcode.show = true"
            color="green white--text"
          >
            <v-icon class="mr-1">mdi-zip-box</v-icon> Barcode Pohon Monitoring
          </v-btn>
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
// import TreesPreview from "./components/monitoring2/TreesPreview.vue";
import VueHtml2pdf from 'vue-html2pdf';
import VueQRCodeComponent from 'vue-qrcode-component';

export default {
  name: "Monitoring2",
  components: {
    // TreesPreview
    'qr-code': VueQRCodeComponent,
    VueHtml2pdf
},
  data: () => ({
    // general setting

    dialogDigitalBarcode: {
      show: false,
      loading:{
        show: false,
        text: 'Sedang Memuat Data Barcode!'
      },
      cardData:{
        barcodeValue: 'MOP-2023-0000037501',
        treeType: 'Pohon',
        planting_year: '2022',
        farmerName: 'Ucok',
        lahan_no: '123456789',
        village: 'Desa'
      }
    },

    authtoken: "",
    User: {},
    headers: [
      {text: 'Nomor Monitoring', value: 'monitoring2_no'},
      {text: 'Management Unit', value: 'mu_no'},
      {text: 'Field Facilitator', value: 'ff_no'},
      {text: 'Petani', value: 'farmer_name'},
      {text: 'Desa', value: 'village'},
      {text: 'Nomor Lahan', value: 'lahan_no'},
      {text: 'Kondisi Lahan', value: 'land_condition'},
      {text: 'Jumlah Total Pohon', value: 'qty_trees'},
      {text: 'Waktu Monitoring', value: 'monitoring_time'},
      {text: 'Waktu Awal Monitoring', value: 'monitoring_start'},
      {text: 'Waktu Akhir Monitoring', value: 'monitoring_end'},
      {text: 'Tahun Program', value: 'program_year'},
      {text: 'Status', value: 'is_verified'},
      {text: 'Action', value: 'actions'}
    ],
    tableLoading: false,
    dataobject: [],
    // snackbar
    snackbar: {
      color: '',
      show: false,
      timeout: 5000,
      text: ''
    },
    User: ''
  }),
  computed: {},

  async mounted() {
    this.User = this.$store.state.User
    // const taskForceEmails = this.$store.state.taskForceTeam.emails || []

    // if (this.User.role_group != 'IT') {
    //   this.$store.state.maintenanceOverlay = true
    // }
  },
  destroyed() {
    // this.$store.state.maintenanceOverlay = false

    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },

  methods: {
    generateExportDetail() {
      this.$refs.html2Pdf.generatePdf()
    },
    LatLng(lat, lng) {
      const array = [parseFloat(lat), parseFloat(lng)];
      //   console.log(array);
      return array;
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
