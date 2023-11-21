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
  
      <v-data-table
        data-aos="fade-up"
        data-aos-delay="200"
        multi-sort
        :headers="headers"
        :items="dataobject"
        :search="search"
        :loading="tableLoading"
        loading-text="Loading... Please wait"
        class="rounded-xl elevation-6 mx-3 pa-1"
        :options.sync="table.options"
        :page="table.current_page"
        :server-items-length="table.total_data"
        :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman',
        itemsPerPageOptions: [10, 25, 50, 100],
        showCurrentPage: true,
        showFirstLastPage: true,
      }"
      >
        <template v-slot:top>
          <v-toolbar flat class="rounded-xl">
          <!-- program years-->
            <v-select
                color="success"
                item-color="success"
                v-model="localConfig.programYear"
                :items="['All Data',...$store.state.programYear.options]"
                :disabled="tableLoading"
                outlined
                dense
                hide-details
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                rounded
                label="Tahun Program"
                class="mx-auto mr-lg-2 mb-2 mb-lg-0"
                style="max-width: 200px"
            ></v-select>
            <v-col cols="12" lg="6" class="d-flex">
              <v-select
                  color="success"
                  item-color="success"
                  v-model="search.column"
                  :items="search.options"
                  item-value="value"
                  item-text="text"
                  hide-details
                  outlined
                  dense
                  :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                  rounded
                  label="Kolom Pencarian"
                  class="centered-select"
                  style="width: 50%;max-width: 200px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
                ></v-select>
              <v-text-field
                color="success"
                item-color="success"
                v-model="search.model"
                placeholder="Pencarian..."
                append-icon="mdi-magnify"
                outlined
                dense
                rounded
                label="Pencarian"
                hide-details
                style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;"
              ></v-text-field>
            </v-col>
            <v-divider class="mx-2 d-none d-md-block" inset></v-divider>
          
          </v-toolbar>
        </template>
        <template v-slot:item.index="{ index }">
          {{ (itemsPerPage * (page-1)) + index + 1 }}
        </template>
        <!--Status row-->
        <template v-slot:item.validation="{item}">
          <v-chip :color="getStatusColumn('bg_color', item.validation)" class="white--text">
            <v-icon class="mr-1">{{ getStatusColumn('icon', item.validation) }}</v-icon>
            {{ getStatusColumn('text', item.validation) }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu content-class="rounded-xl">
            <template v-slot:activator="{attrs, on}">
              <v-btn v-bind="attrs" v-on="on" small fab icon>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-card class="pa-2 d-flex align-stretch flex-column justify-center">
            <!--showModal('detail', item)-->
                <v-btn
                  color="blue white--text"
                  rounded
                  small
                  class="pl-1 mt-1 d-flex justify-start align-center"
                  :disabled="!$store.state.User.role_name=='FIELD COORDINATOR' && !$store.state.User.role_name=='UNIT MANAGER' && !$store.state.User.role_group=='IT'"
                  @click="ShowDialogDetail(item)"
                  >
                <v-icon class="mr-1">information-outline</v-icon>
                Detail
              </v-btn>
              <!-- <v-btn
                  color="blue white--text"
                  rounded
                  small
                  class="pl-1 mt-1 d-flex justify-start align-center"
                  :disabled="!$store.state.User.role_name=='PLANNING MANAGER' && !$store.state.User.role_group=='IT'"
                  @click="ShowDialogDetail(item)">
                <v-icon class="mr-1">mdi-pencil</v-icon>
                Edit
              </v-btn> -->
              <v-btn
                  v-if="item.validation == 0"
                  color="green white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     :disabled="!$store.state.User.role_name=='FIELD COORDINATOR' && !$store.state.User.role_name=='UNIT MANAGER' && !$store.state.User.role_group=='IT'"
                     @click="verify(item)">
                <v-icon class="mr-1">mdi-check-bold</v-icon>
                Verifikasi
              </v-btn>
              <v-btn
                  v-if="item.validation == 1"
                  color="red white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     :disabled="!$store.state.User.role_group=='IT'"
                     @click="unverify(item)">
                <v-icon class="mr-1">mdi-pencil-remove</v-icon>
                Unverifikasi
              </v-btn>
              <v-btn
                  v-if="item.validation == 0"
                  color="red white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     :disabled="!$store.state.User.role_name=='FIELD COORDINATOR' && !$store.state.User.role_name=='UNIT MANAGER' && !$store.state.User.role_group=='IT'"
                     @click="openDelete(item)">
                <v-icon class="mr-1">mdi-trash-can</v-icon>
                Hapus
              </v-btn>
              <!-- <v-btn
                  v-if="item.validation != 0"
                  color="red white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     :disabled="!$store.state.User.role_name=='PLANNING MANAGER' && !$store.state.User.role_group=='IT'"
                     @click="">
                <v-icon class="mr-1">mdi-check-bold</v-icon>
                Unverifikasi
              </v-btn> -->
                <!--{showModal('form', item)}-->
            </v-card>
          </v-menu>
        </template>

      </v-data-table>

      <DetailAdjustmentSostam
      :show="detailModal.show"
      :data="detailModal.data"
      @close="detailModal.show = false">
      </DetailAdjustmentSostam>
  
      <v-snackbar
        v-model="snackbar"
        :color="colorsnackbar"
        :timeout="timeoutsnackbar"
      >
        {{ textsnackbar }}
      </v-snackbar>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import Swal from "sweetalert2";
  import DetailAdjustmentSostam from "@/views/Activity/components/sostam/DetailAdjustmentSostam"
  
  export default {
    name: "AdjustmentDataSostam",
    components:{
      DetailAdjustmentSostam
    },
    data: () => ({

      page: 1,
      itemsPerPage: 10,
      itemsbr: [
        {
          text: "Sosialisasi Tanam",
          disabled: true,
          href: "breadcrumbs_dashboard",
        },
        {
          text: "Adjustment Data Sostam",
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      search: {
        model: "",
        column: "",
        options: [
          {text: "Nama FF", value: "nama_ff"},
          {text: "Nomor Lahan", value: "lahan_no"},
          {text: "Nama Petani", value: "name_farmer"},
        ]
      },
      authtoken: "",
      BaseUrlGet: "",
      tableLoading: false,
      table: {
        current_page: 1,
        per_page: 10,
        length_page: 0,
        page_options: [],
        total_data: 0,
        options: {}
      },
      headers: [
        {text: 'No', value: 'index'},
        {text: 'No Form', value: 'form_no'},
        {text: 'Field Facilitator', value: 'nama_ff'},
        {text: 'Nama Petani', value: 'nama_petani'},
        {text: 'No Lahan', value: 'lahan_no'},
        {text: 'Luas Lahan', value: 'land_area'},
        {text: 'Koordinat', value: 'distribution_coordinates'},
        {text: 'Pola Tanam', value: 'opsi_pola_tanam'},
        {text: 'Total Bibit', value: 'max_seed_amount'},
        {text: 'Total Bibit Adjustment', value: 'max_seed_amount_new'},
        {text: 'Tahun Tanam', value: 'program_year'},
        {text: 'Status', value: 'validation'},
        {text: 'Diverifikasi Oleh', value: 'nama_employee'},
        {text: 'Actions', value: 'actions', align: 'right'},
      ],
      dataobject: [],
      detailDataObject: [],


      snackbar: false,
      textsnackbar: "Test",
      timeoutsnackbar: 2000,
      colorsnackbar: null,
      localConfig: {
        programYear: '',
      },
      detailModal: {
        show: false,
        data: "",
      },
      User: '',
      valueFFcode: '',
      UMVal: '',
      employee_no: '',

      load: false,
    }),
  
    created() {
      this.authtoken = localStorage.getItem("token");
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
  
      this.localConfig.programYear = this.$store.state.programYear.model
    },
    watch: {
      'localConfig.programYear': {
        handler(val) {
          this.initialize()
        }
      },
      'table.options': {
      handler(newValue) {
        let {page, itemsPerPage} = newValue
        this.table.current_page = page
        this.table.per_page = itemsPerPage
        this.initialize()
        },
        deep: true
      },
      'search.model': {
        handler() {
          setTimeout(() => {
            this.initialize()
          }, 1000);
        },
        deep: true
    },
    },
  
    computed: {
      
    },
    async mounted(){
      await this.firstAccessPage();
    },
    methods: {
      async initialize() {
        try {
            this.$store.state.loadingOverlay = true
            this.$store.state.loadingOverlayText = 'Memuat Data...'
            const param = new URLSearchParams({
              program_year: this.localConfig.programYear,
              page: this.table.current_page,
              per_page: this.table.per_page,
              ff: this.valueFFcode,
              search_column: this.search.column || '',
              search_value: this.search.model || '',
            })
            console.log(param)
            const response = await axios.get(
            this.BaseUrlGet +
            "GetSocializationAdjustmentAll?"+ param,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          if (response.data.length != 0) {
            this.dataobject = response.data.data.result.data;
            this.$store.state.loadingOverlay = false
            this.$store.state.loadingOverlayText = ''

            this.table.total_data = response.data.data.result.total
            this.table.current_page = response.data.data.result.current_page
            this.table.length_page = response.data.data.result.last_page
            const pageOptions = []
            for (let index = 1; index <= response.data.data.result.last_page; index++) {
              pageOptions.push(index)
            }
            this.table.page_options = pageOptions
          } else {
            this.dataobject = [];
            this.$store.state.loadingOverlay = false
            this.$store.state.loadingOverlayText = ''
          }
        } catch (error) {
          console.error(error);
          if (error.response.status == 401) {
            this.sessionEnd(error)
          } else {
            this.dataobject = [];
            this.$store.state.loadingOverlay = false
            this.$store.state.loadingOverlayText = ''
          }
        }
      },
      async firstAccessPage(){
        this.User = JSON.parse(localStorage.getItem("User"))
        this.employee_no = this.User.employee_no;
        this.valueFFcode = this.User.ff.ff;

        if (this.User.role_name === "FIELD COORDINATOR") {
        this.UMVal = this.User.EmployeeStructure.manager_code
        // this.selectFC = this.User.employee_no
        // await this.selectedFC(this.User.employee_no)
      }
      // Unit Manager
        if (this.User.role_name === "UNIT MANAGER") {
          this.UMVal = this.User.employee_no
        }
      },
      async openDelete(item){
        const confirm = await Swal.fire({
            title: 'Apa Anda Yakin?',
            text: "Anda Akan Melakukan Hapus Data Adjustment!",
            icon: 'warning',
            confirmButtonColor: '#2e7d32',
            confirmButtonText: 'ya',
            showCancelButton: true
        })
        if (confirm.isConfirmed){
          const datapost ={
            form_no: item.form_no,
          }
          console.log(datapost)
          try {
            const response = await axios.post(
              this.BaseUrlGet + "DeleteAdjustment",
              datapost,
              {
                headers: {
                  Authorization: `Bearer ` + this.authtoken,
                },
              }
            );
            if (response.data.data.result == "success") {
              this.initialize();
            } else {
              this.alerttoken = true;
            }
          } catch (error) {
            console.error(error.response);
            this.sessionEnd(error)
          }
        }
        this.initialize();
      },
      // verif adjustment
      async verify(item){
        const confirm = await Swal.fire({
            title: 'Apa Anda Yakin Untuk Verifikasi?',
            text: "Setelah Melakukan Verifikasi, Data Adjustment Tidak Dapat Diubah Maupun Dihapus!",
            icon: 'warning',
            confirmButtonColor: '#2e7d32',
            confirmButtonText: 'ya',
            showCancelButton: true
        })
        if (confirm.isConfirmed){
          
          const datapost ={
            form_no: item.form_no,
            validate_by: this.employee_no,
          }
          console.log(datapost)
          try {
            const response = await axios.post(
              this.BaseUrlGet + "AdjustmentValidation",
              datapost,
              {
                headers: {
                  Authorization: `Bearer ` + this.authtoken,
                },
              }
            );
            if (response.data.data.result == "success") {
              this.initialize();
            } else {
              this.alerttoken = true;
            }
          } catch (error) {
            console.error(error.response);
            this.sessionEnd(error)
          }
        }
      },
      //unverification
      async unverify(item){
        const confirm = await Swal.fire({
            title: 'Apa Anda Yakin Untuk Verifikasi?',
            text: "Setelah Melakukan Verifikasi, Data Adjustment Tidak Dapat Diubah Maupun Dihapus!",
            icon: 'warning',
            confirmButtonColor: '#2e7d32',
            confirmButtonText: 'ya',
            showCancelButton: true
        })
        if (confirm.isConfirmed){
          
          const datapost ={
            ff_no: item.ff_no,
          }
          console.log(datapost)
          try {
            const response = await axios.post(
              this.BaseUrlGet + "AdjustmentUnvalidation",
              datapost,
              {
                headers: {
                  Authorization: `Bearer ` + this.authtoken,
                },
              }
            );
            if (response.data.data.result == "success") {
              this.initialize();
            } else {
              this.alerttoken = true;
            }
          } catch (error) {
            console.error(error.response);
            this.sessionEnd(error)
          }
        }
      },
      ShowDialogDetail(item){
        this.detailModal.data = item.form_no
        
        this.detailModal.show = true


      },
      getStatusTotalBibitInDetail(seeds, typeReturn, secParams = null) {
        let exists = {
          KAYU: 0,
          MPTS: 0,
          CROPS: 0
        }
        let total = {
          KAYU: 0,
          MPTS: 0,
          CROPS: 0
        }
        seeds.forEach((seed) => {
          total[seed.tree_category] += parseInt(seed.amount)
          exists[seed.tree_category] += 1
        })
        if (typeReturn == 'KAYU' || typeReturn == 'MPTS' || typeReturn == 'CROPS') {
          return total[typeReturn]
        } else if (typeReturn == 'ALL') {
          return total.KAYU + total.MPTS + total.CROPS
        } else if (typeReturn == 'COLOR') {
          if (total.KAYU > 0 && (total.KAYU >= (Math.round(60 / 100 * (total.KAYU + total.MPTS)))) && (total.MPTS <= (Math.round(40/100 * (total.KAYU + total.MPTS))))) {
            return 'green'
          } else {
            return 'red'
          }
        } else if(typeReturn == 'EXISTS' ) {
          return exists[secParams]
        }
      },
      getStatusColumn(type, status) {
        if (type == 'bg_color') {
          if (status == '0') return 'orange'
          if (status == '1') return 'green darken-1'
          if (status == '2') return 'red'
        }
        if (type == 'icon') {
          if (status == '0') return 'mdi-google-downasaur' //mdi:cancel
          if (status == '1') return 'mdi-check-circle'
          if (status == '2') return 'mdi-alert-rhombus-outline'
        }
        if (type == 'text') {
          if (status == '0') return 'Belum Terverifikasi'
          if (status == '1') return 'Terverifikasi'
          // if (status == '2') return 'Tidak Potensial'
        }
  
        return ''
      },
      async initializeDetailAdjustment(form_no){
      try {
        const response = await axios.get(
          this.BaseUrlGet +
          "GetSocializationAdjustmentDetail?form_no="+form_no,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        if (response.data.length != 0) {
          this.detailDataObject = response.data.data.result;
          console.log(this.detailDataObject)
        } else {
          this.detailDataObject = [];
        }
        } catch (error) {
          console.error(error);
          if (error.response.status == 401) {
            this.sessionEnd(error)
          } else {
            this.detailDataObject = [];
          }
        }
      },
      sessionEnd(error) {
      if (error.response.status == 401) {
        this.alerttoken = true
        this.dialogAddonly = false
        this.showedAbsensi2 = false
        this.showedMateri3 = false
        this.dialog = false
        this.dialogDelete = false
        this.dialogDetail = false
        this.dialogFilterArea = false
        this.dialogFilterEmp = false
        this.dialogShowEdit = false
        this.dialogDetailPohon = false
        this.dialogDetailPohonEdit = false
        this.dialogAddProduct = false
        this.dialogCetakPilihan = false
        this.dialogdownload = false
        this.preview.petani.modal = false
        this.preview.absensi.modal = false
        this.preview.addParticipant.modal = false
        localStorage.removeItem("token");
        this.$router.push("/");
      }
    },
    },
  };
  </script>