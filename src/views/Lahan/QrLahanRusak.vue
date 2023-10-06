<template>
    <div>
    
      <v-breadcrumbs
          :dark="$store.state.theme == 'dark'"
          data-aos="fade-right"
          class="breadcrumbsmain"
          :items="breadcrumbs"
          divider=">"
          large
      ></v-breadcrumbs>
    
      <!--Main Table-->
      <v-data-table
          data-aos="fade-up"
          data-aos-delay="200"
          multi-sort
          :headers="table.headers"
          :items="table.items"
          :search="table.search"
          :loading="table.loading.show"
          :loading-text="table.loading.text"
          :class="`${$store.state.theme == 'dark' ? '' : ''} rounded-xl elevation-6 mx-3 pa-1`"
          :footer-props="{
                itemsPerPageText: 'Jumlah Data Per Halaman',
                itemsPerPageOptions: [10, 25, 40, -1],
                showCurrentPage: true,
                showFirstLastPage: true,
              }"
      >
        <template v-slot:item.is_verified="{item}">
          <v-chip :color="getStatusColumn('bg_color', item.is_verified)" class="white--text">
            <v-icon class="mr-1">{{ getStatusColumn('icon', item.is_verified) }}</v-icon>
            {{ getStatusColumn('text', item.is_verified) }}
          </v-chip>
        </template>

        <!-- modals -->
         <!--MODAL DETAIL TUTUPAN LAHAN-->
  <v-dialog
      v-model="dialogDetailBarcodeRusak.modal"
      max-width="800px"
      content-class="rounded-xl"
      scrollable
      >
    <v-card>
      <v-card-title class="mb-1 headermodalstyle">
        <span class="headline">Detail Permintaan Tutupan Lahan</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
<!--        loading-Bar-->
       <v-container 
            v-model="dialogDetailBarcodeRusak.loading.show"
            fluid
            fill-height
            style="background-color: rgba(255, 255, 255, 0.5)"
        >
          <v-layout justify-center align-center>
            <v-progress-circular
                :size="80"
                :width="10"
                indeterminate
                color="primary"
            >
            </v-progress-circular>
          </v-layout>
        </v-container>
        <!--ROW no lahan and nama petani-->
        <v-row class="mt-6 shadow-lg rounded-xl">
          <v-col sm="12" md="6" cols="6">
            <div class="ml-2">
              <h4><strong>No Lahan</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.lahan_no }}
              </h5>
            </div>
          </v-col>
          <v-col sm="12" md="3" cols="6">
            <div class="ml-2">
              <h4><strong>Nama Petani</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.farmer_name }}
              </h5>
            </div>
          </v-col>
        </v-row>
        <!--ROW tutupan lahan now and new-->
        <v-row class="mt-6 shadow-lg rounded-xl">
          <v-col sm="12" md="6" cols="6">
            <div class="ml-2">
              <h4><strong>Area Lahan</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.land_area }}
              </h5>
            </div>
          </v-col>
        </v-row>
        <!--ROW tutupan lahan now and new-->
        <v-row class="mt-6 shadow-lg rounded-xl">
          <v-col sm="12" md="6" cols="6">
            <div class="ml-2">
              <h4><strong>Tutupan Lahan Sekarang</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.tutupan_lahan_now + '%'}}
              </h5>
            </div>
          </v-col>
          <v-col sm="12" md="6" cols="6">
            <div class="ml-2">
              <h4><strong>Tutupan Lahan Baru</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.tutupan_lahan_new + '%' }}
              </h5>
            </div>
          </v-col>
        </v-row>
        <!--ROW Mu_no and Target Area-->
        <v-row class="mt-6 shadow-lg rounded-xl">
          <v-col sm="12" md="6" cols="6">
            <div class="ml-2">
              <h4><strong>No Management Unit</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.mu_no }}
              </h5>
            </div>
          </v-col>
          <v-col sm="12" md="3" cols="6">
            <div class="ml-2">
              <h4><strong>Target Area</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.target_area }}
              </h5>
            </div>
          </v-col>
        </v-row>
        <!--ROW active year and program year-->
        <v-row class="mt-6 shadow-lg rounded-xl">
          <v-col sm="12" md="6" cols="6">
            <div class="ml-2">
              <h4><strong>Tahun Aktif</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.year_active }}
              </h5>
            </div>
          </v-col>
          <v-col sm="12" md="3" cols="6">
            <div class="ml-2">
              <h4><strong>Tahun Program</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.program_year }}
              </h5>
            </div>
          </v-col>
        </v-row>
        <!--ROW Reason-->
        <v-row class="mt-6 shadow-lg rounded-xl">
          <v-col sm="12" md="12" cols="12">
            <div class="ml-2">
              <h4><strong>Alasan</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.reason }}
              </h5>
            </div>
          </v-col>
        </v-row>
        <!--ROW Tanggal Submit FF and FC-->
        <v-row class="mt-6 shadow-lg rounded-xl">
          <v-col sm="12" md="6" cols="6">
            <div class="ml-2">
              <h4><strong>Tanggal Submit FF</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.submit_date_ff }}
              </h5>
            </div>
          </v-col>
          <v-col sm="12" md="3" cols="6">
            <div class="ml-2">
              <h4><strong>Tanggal Submit FC</strong></h4>
              <h5>
                {{ itemInBarcodeRusak.submit_date_fc }}
              </h5>
            </div>
          </v-col>
        </v-row>


        <v-card class="rounded-xl shadow-lg" color="light-green">
          <v-row class="ma-0 mx-2">
            <v-col cols="12">
              <div class="d-flex align-center">
                <p class="mb-0 grey--text text--darken-3">
                  <v-icon color="grey darken-3" class="mr-2"
                  >mdi-led-strip</v-icon
                  >File Foto
                </p>
                <v-divider class="mx-2" color="black"></v-divider>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="rounded-xl shadow-lg">
          <v-row class="mt-3">
            <v-col sm="12" md="4" cols="4">
              <div class="ml-2">
                <h5>Foto 1</h5>
                <v-img
                    height="250"
                    width="250"
                    v-bind:src="itemInBarcodeRusak.doc_tutupan_photo1"
                    class="my-1 mb-4"
                ></v-img>
              </div>
            </v-col>
            <v-col sm="12" md="4" cols="4">
              <div class="ml-2">
                <h5>Foto 2</h5>
                <v-img
                    height="250"
                    width="250"
                    v-bind:src="itemInBarcodeRusak.doc_tutupan_photo2"
                    class="my-1 mb-4"
                ></v-img>
              </div>
            </v-col>
            <v-col sm="12" md="4" cols="4">
              <div class="ml-2">
                <h5>Foto 3</h5>
                <v-img
                    height="250"
                    width="250"
                    v-bind:src="itemInBarcodeRusak.doc_tutupan_photo3"
                    class="my-1 mb-4"
                ></v-img>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>


        <!--Action Menus-->
        <template v-slot:item.actions="{ item }">
          <v-menu content-class="rounded-xl">
            <template v-slot:activator="{attrs, on}">
              <v-btn v-bind="attrs" v-on="on" small fab icon>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-card class="pa-2 d-flex align-stretch flex-column justify-center">
              <v-btn color="info white--text"
                     rounded
                     small
                     class="pl-1 d-flex justify-start align-center"
                     @click="showDetailTutupan(item)">
                <v-icon class="mr-1">mdi-information</v-icon>
                Detail
              </v-btn>
                  <!--showModal('detail', item)-->
              <v-btn color="orange white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     :disabled="!$store.state.User.role_name=='UNIT MANAGER' && !$store.state.User.role_name=='FIELD COORDINATOR' && !$store.state.User.role_group=='IT'"
                     @click="showEditTutupan(item)">
                <v-icon class="mr-1">mdi-pencil-circle</v-icon>
                Edit
              </v-btn>
            <!--showModal('detail', item)-->
              <v-btn
                  v-if="item.is_verified == 0"
                  color="green white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     :disabled="!$store.state.User.role_name=='FIELD COORDINATOR' && !$store.state.User.role_group=='IT'"
                     @click="verifyTutupanFC(item)">
                <v-icon class="mr-1">mdi-check-bold</v-icon>
                Verifikasi FC
              </v-btn>
              <v-btn
                  v-if="item.is_verified == 1"
                  color="green darken-1 white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     :disabled="(item.is_verified == 1) && (!$store.state.User.role_name=='UNIT MANAGER' && !$store.state.User.role_group=='IT')"
                     @click="verifyTutupanUM(item)">
                <v-icon class="mr-1">mdi-check-bold</v-icon>
                Verifikasi UM
              </v-btn>
              <v-btn
                  v-if="item.is_verified != 0"
                  color="red white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     :disabled="!$store.state.User.role_name=='UNIT MANAGER' && !$store.state.User.role_group=='IT'"
                     @click="unverifyTutupanUM(item)">
                <v-icon class="mr-1">mdi-check-bold</v-icon>
                Unverifikasi
              </v-btn>
                <!--{showModal('form', item)}-->
            </v-card>
          </v-menu>
        </template>
    
      </v-data-table>
      <v-snackbar
          v-model="snackbar"
          :color="colorsnackbar"
          :timeout="timeoutsnackbar"
      >
        {{ textsnackbar }}
      </v-snackbar>
    </div>
    </template>
    
    <script >
    import axios from 'axios'
    import Swal from "sweetalert2";
    import data from "bootstrap/js/src/dom/data";
    
    export default {
      data: () => ({
        userEmpNo: '',

        dialog: false,
        dialogDetailBarcodeRusak: {
          modal: false,
          loading:{
            show: false,
            text: 'Loading...'
          }
        },
    
        BaseUrl: "",
        BaseUrlGet: "",
    
        defaultItem:{
          document_no: "",
        },
    
        itemInBarcodeRusak:{
          ff_no: "",
          fc_no: "",
          farmer_name: "",
          farmer_no: "",
          land_area: "",
          tutupan_lahan_now: "",
          tutupan_lahan_new: "",
          reason: "",
          lahan_no: "",
          year_active: "",
          program_year: "",
          submit_date_ff: "",
          submit_date_fc: "",
          verified_by: "",
          user_id: "",
          form_no: "",
          mu_no: "",
          target_area: "",
          tutupan_photo1: "",
          tutupan_photo2: "",
          tutupan_photo3: "",
    
          dbtutupanphoto1: "",
          doc_tutupan_photo1: "",
          doc_tutupan_photo2: "",
          doc_tutupan_photo3: "",
    
          loading: {
            show: false,
            text: 'Loading...'
          }
        },
        dialogMenus: {
          progress_tutupan_lahan:{
            label: 'Cakupan Lahan(%)',
            items: [
              {text: '0%', value: 0},
              {text: '25%', value: 25},
              {text: '50%', value: 50},
              {text: '75%', value: 75},
            ],
            model: 0,
            loading: false
          }
        },
        breadcrumbs: [
          {
            text: "Lahan",
            disabled: true,
            href: "breadcrumbs_dashboard",
          },
          {
            text: 'Daftar Laporan QRCode Lahan Rusak',
            disabled: true,
            href: "breadcrumbs_link_1",
          },
        ],
        table: {
          headers: [
            {text: 'Nama Petani', value: 'farmer_name'},
            {text: 'No Lahan', value: 'lahan_no'},
            {text: 'Management Unit', value: 'nama_mu'},
            {text: 'Desa', value: 'nama_desa'},
            {text: 'Alasan', value: 'reason'},
            {text: 'Status', value: 'is_verified', align: 'center'},
            // {text: 'Status', value: '', align: 'center'},
            {text: 'Actions', value: 'actions', align: 'right'},
          ],
          items: [],
          loading: {
            show: false,
            text: 'Loading...'
          },
          search: '',
        },
        user : '',
        localConfig: {
          programYear: '',
        },
        snackbar: false,
        textsnackbar: "Test",
        timeoutsnackbar: 2000,
        colorsnackbar: null,
      }),
      mounted() {
        this.firstAccessPage()
      },
      methods :{
        errorResponse(error) {
          console.log(error)
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 401) {
                localStorage.removeItem("token");
                this.$router.push("/");
              }
            }
          }
        },
    
        async firstAccessPage() {
          // set general config to local config
          this.authtoken = localStorage.getItem("token");
          // this.user = this.$store.state.User
          this.User = JSON.parse(localStorage.getItem("User"));
          this.userEmpNo = this.User.employee_no;
          // console.log(this.userEmpNo);
          this.localConfig.programYear = this.$store.state.programYear.model
          this.BaseUrl = localStorage.getItem("BaseUrl");
          this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
          await this.getTableData()
        },
    
    
    
        async getDetail(item){
          console.log(item)
          this.itemInBarcodeRusak.farmer_no = item.farmer_no
          this.itemInBarcodeRusak.farmer_name = item.farmer_name
          this.itemInBarcodeRusak.land_area = item.land_area
          this.itemInBarcodeRusak.tutupan_lahan_now = item.tutupan_lahan_now
          this.itemInBarcodeRusak.tutupan_lahan_new = item.tutupan_lahan_new
          this.itemInBarcodeRusak.reason = item.reason
          this.itemInBarcodeRusak.lahan_no = item.lahan_no
          this.itemInBarcodeRusak.year_active = item.year_active
          this.itemInBarcodeRusak.program_year = item.program_year
          this.itemInBarcodeRusak.submit_date_ff = item.submit_date_ff
          this.itemInBarcodeRusak.submit_date_fc = item.submit_date_fc
          this.itemInBarcodeRusak.verified_by = item.verified_by
          this.itemInBarcodeRusak.mu_no = item.mu_no
          this.itemInBarcodeRusak.target_area = item.target_area
          
          if(item.tutupan_photo1 == '-'){
            this.itemInBarcodeRusak.doc_tutupan_photo1 = "/images/noimage2.png";
          }else{
            this.itemInBarcodeRusak.doc_tutupan_photo1 = this.BaseUrl + item.tutupan_photo1;
          }
          if(item.tutupan_photo2 == '-'){
            this.itemInBarcodeRusak.doc_tutupan_photo2 = "/images/noimage2.png";
          }else{
            this.itemInBarcodeRusak.doc_tutupan_photo2 = this.BaseUrl + item.tutupan_photo2;
          }
          if(item.tutupan_photo3 == '-'){
            this.itemInBarcodeRusak.doc_tutupan_photo3 = "/images/noimage2.png";
          }else{
            this.itemInBarcodeRusak.doc_tutupan_photo3 = this.BaseUrl + item.tutupan_photo3;
          }
          
        },
        showDetailTutupan(item){
          this.type = "Detail";
          this.dialogDetailTutupan =true;
          this.getDetail(item)
    
        },
    
        showEditTutupan(item){
          this.type = "Edit";
          this.dialogEditTutupanLahan = true;
          this.getDetail(item)
        },
    
        //verifikasi FC
        async verifyTutupanFC(item){
          console.log('start')
          this.$store.state.loadingOverlay = true;
          this.$store.state.loadingOverlayText = "Verifikasi Tutupan Lahan!";
    
          const datapost ={
            form_no: item.form_no,
            verified_by: item.mu_no,
            is_verified: item.is_verified,
    
          };
          try {
            const response =await axios.post(
                this.BaseUrlGet + "VerificationLahanTutupanFC",
                datapost,
                {
                  headers: {
                    Authorization: `Bearer ` + this.authtoken,
                  },
                }
            );
            console.log('result data: '+response.data.data.result);
            if (response.data.data.result == "success") {
              this.dialogDetail = false;
              this.initialize();
            } else {
              this.dialogDetail = false;
              this.alerttoken = true;
            }
          } catch (error){
            if (error.response.status == 401) {
              this.alerttoken = true;
              this.dialogDetail = false;
            }
          }
          finally {
            this.getTableData();
            this.$store.state.loadingOverlay = false;
            this.$store.state.loadingOverlayText = null;
            console.log('end')
          }
        },
        //verifikasi UM
        async verifyTutupanUM(item){
          console.log('start')
          this.$store.state.loadingOverlay = true;
          this.$store.state.loadingOverlayText = "Verifikasi Tutupan Lahan!";
    
          const datapost ={
            form_no: item.form_no,
            verified_by: item.mu_no,
            is_verified: item.is_verified,
    
          };
          try {
            const response =await axios.post(
                this.BaseUrlGet + "VerificationLahanTutupanUM",
                datapost,
                {
                  headers: {
                    Authorization: `Bearer ` + this.authtoken,
                  },
                }
            );
            console.log('result data: '+response.data.data.result);
            if (response.data.data.result == "success") {
              this.dialogDetail = false;
              this.initialize();
            } else {
              this.dialogDetail = false;
              this.alerttoken = true;
            }
          } catch (error){
            if (error.response.status == 401) {
              this.alerttoken = true;
              this.dialogDetail = false;
            }
          }
          finally {
            this.getTableData();
            this.$store.state.loadingOverlay = false;
            this.$store.state.loadingOverlayText = null;
            console.log('end')
          }
        },
        //verifikasi UM
        async unverifyTutupanUM(item){
          console.log('start')
          this.$store.state.loadingOverlay = true;
          this.$store.state.loadingOverlayText = "Unverifikasi Tutupan Lahan!";
    
          const datapost ={
            form_no: item.form_no,
            verified_by: item.mu_no,
            is_verified: item.is_verified,
    
          };
          try {
            const response =await axios.post(
                this.BaseUrlGet + "UnverificationLahanTutupan",
                datapost,
                {
                  headers: {
                    Authorization: `Bearer ` + this.authtoken,
                  },
                }
            );
            console.log('result data: '+response.data.data.result);
            if (response.data.data.result == "success") {
              this.dialogDetail = false;
              this.initialize();
            } else {
              this.dialogDetail = false;
              this.alerttoken = true;
            }
          } catch (error){
            if (error.response.status == 401) {
              this.alerttoken = true;
              this.dialogDetail = false;
            }
          }
          finally {
            this.getTableData();
            this.$store.state.loadingOverlay = false;
            this.$store.state.loadingOverlayText = null;
            console.log('end')
          }
        },
    
    
        //Update Data
        async updateTutupanLahan(datapost){
    
          try {
            const response = await axios.post(
                this.BaseUrlGet +"UpdateLahanTutupanRequest",
                datapost,
                {
                  headers: {
                    Authorization: `Bearer ` + this.authtoken,
                  },
                }
            );
            await this.getTableData();
    
            this.dialogEditTutupanLahan = false;
            console.log(response.data.result);
            if (response.data.data.result == "success") {
              this.dialog = false;
              this.snackbar = true;
              this.colorsnackbar = "green";
              this.textsnackbar = "Sukses mengubah data";
              this.initialize();
            } else {
              this.dialog = true;
            }
    
          }catch (error){
            if (error.response.status == 401) {
              this.dialog = true;
            } else {
              this.snackbar = true;
              this.colorsnackbar = "red";
              this.textsnackbar = "Gagal Simpan! Kolom Tidak Boleh Ada Yang Kosong.";
            }
          }
        },
        async saveTutupan(){
          this.itemInBarcodeRusak.loading.show = true;
          
          const confirm = await Swal.fire({
                  title: 'Konfirmasi',
                  text: "Apakah Anda Yakin?",
                  icon: 'warning',
                  confirmButtonColor: '#2e7d32',
                  confirmButtonText: 'Ya!',
                  showCancelButton: true,
                  cancelButtonColor: '#d33',
                })
                if(confirm.isConfirmed){
                  if(
              this.itemInBarcodeRusak.form_no != null &&
              this.itemInBarcodeRusak.ff_no != null &&
              this.itemInBarcodeRusak.lahan_no != null &&
              this.itemInBarcodeRusak.tutupan_lahan_new != null &&
              this.itemInBarcodeRusak.mu_no != null &&
              this.itemInBarcodeRusak.land_area != null &&
              this.itemInBarcodeRusak.program_year != null &&
              this.itemInBarcodeRusak.reason != null &&
              this.itemInBarcodeRusak.farmer_no != null &&
              this.itemInBarcodeRusak.tutupan_photo1 &&
              this.itemInBarcodeRusak.tutupan_photo2 &&
              this.itemInBarcodeRusak.tutupan_photo3
          ){
            const postTutupan ={
              lahan_no: this.itemInBarcodeRusak.lahan_no,
              year_active : this.itemInBarcodeRusak.year_active,
              program_year : this.itemInBarcodeRusak.program_year,
              tutupan_lahan_now : this.itemInBarcodeRusak.tutupan_lahan_now,
              tutupan_lahan_new : this.itemInBarcodeRusak.tutupan_lahan_new,
              reason: this.itemInBarcodeRusak.reason,
              mu_no : this.itemInBarcodeRusak.mu_no,
              land_area : this.itemInBarcodeRusak.land_area,
              farmer_no : this.itemInBarcodeRusak.farmer_no,
              target_area : this.itemInBarcodeRusak.target_area,
              user_id: this.itemInBarcodeRusak.mu_no,
              tutupan_photo1: '',
              tutupan_photo2: '',
              tutupan_photo3: '',
            }
            if(this.itemInBarcodeRusak.tutupan_photo1){
              const namafile = postTutupan.lahan_no + "_" + this.localConfig.programYear + "_TutupanLahan1";
              const response = await axios.post(
                  this.BaseUrl + "land-coverage/upload.php?nama=",
                  this._utils.generateFormData({
                    nama: namafile,
                    fileToUpload: this.itemInBarcodeRusak.tutupan_photo1
                  }),
              );
              postTutupan.tutupan_photo1 = response.data.data.new_name
            }if(this.itemInBarcodeRusak.tutupan_photo2){
              const namafile = postTutupan.lahan_no + "_" + this.localConfig.programYear + "_TutupanLahan2";
              const response = await axios.post(
                  this.BaseUrl + "land-coverage/upload.php?nama=",
                  this._utils.generateFormData({
                    nama: namafile,
                    fileToUpload: this.itemInBarcodeRusak.tutupan_photo2
                  }),
              );
              postTutupan.tutupan_photo2 = response.data.data.new_name
            }if(this.itemInBarcodeRusak.tutupan_photo3){
              const namafile = postTutupan.lahan_no + "_" + this.localConfig.programYear + "_TutupanLahan3";
              const response = await axios.post(
                  this.BaseUrl + "land-coverage/upload.php?nama=",
                  this._utils.generateFormData({
                    nama: namafile,
                    fileToUpload: this.itemInBarcodeRusak.tutupan_photo3
                  }),
              );
              postTutupan.tutupan_photo3 = response.data.data.new_name
            }
            console.log(postTutupan)
            await this.updateTutupanLahan(postTutupan);
    
            this.dialogEditTutupanLahan= false;
    
    
          }
          else {
            console.log('start end')
            Swal.fire({
              title: 'Gagal Simpan!',
              text: `Kolom Belum Lengkap!`,
              icon: 'warning',
              confirmButtonColor: '#2e7d32',
              confirmButtonText: 'Okay'
            })
          }
          this.itemInBarcodeRusak.loading.show =false;
                }
          
        },
    
    
        //Status
        getStatusColumn(type, is_verified) {
          if (type == 'bg_color') {
            if (is_verified == '0') return 'red'
            if (is_verified == '1') return 'orange'
            if (is_verified == '2') return 'green darken-1'
          }
          if (type == 'icon') {
            if (is_verified == '0') return 'mdi-alpha-x-circle'
            if (is_verified == '1') return 'mdi-check-circle'
            if (is_verified == '2') return 'mdi-check-circle'
          }
          if (type == 'text') {
            if (is_verified == '0') return 'Belum Terverifikasi'
            if (is_verified == '1') return 'Terverifikasi FC'
            if (is_verified == '2') return 'Terverifikasi UM'
          }
    
          return ''
        },
    
    
        async getTableData() {
          try {
            this.table.loading.show = true
            const User = this.$store.state.User
            const created_by = []
            let url = this.$store.getters.getApiUrl(`GetLahanBarcodeRequestAdmin?user_id=${this.userEmpNo}`)
            const res = await axios.get(url, this.$store.state.apiConfig)
            this.table.items = res.data.data.result
    
            /*if(res.data.result.tutupan_photo1 == "-"){
              this.itemInBarcodeRusak.tutupan_photo1 = "/images/noimage.png";
              console.log(res.data.result.tutupan_photo1)
            } else {
              if(res.data.result.tutupan_photo1 < 1000){
                this.itemInBarcodeRusak.tutupan_photo1 =
                this.BaseUrl + res.data.result.tutupan_photo1;
              }else {
                this.itemInBarcodeRusak.tutupan_photo1 =
                    "data:image/jpg;base64," + res.data.result.tutupan_photo1;
    
              }
            }*/
            // console.log(this.table.items)
    
          } catch (err) {
            this.table.items = []
            this.errorResponse(err)
          } finally {
            this.table.loading.show = false
          }
        },
      }
    }
    </script>
    
    