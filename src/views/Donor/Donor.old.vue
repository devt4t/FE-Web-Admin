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
      <dialogAddDonors
      :show="addModal"
      @close="closeDialogAdd()"
      >
      </dialogAddDonors>
      <dialogEditDonors
      :show="editDonors.show"
      :itemData="editDonors.data"
      @close="closeDialogEdit()"
      >
      </dialogEditDonors>
      <dialogDetailDonors
      :show="details.show"
      :datas="details.object"
      @close="details.show = false"
      ></dialogDetailDonors>
      
      <v-data-table
        data-aos="fade-up"
        data-aos-delay="200"
        multi-sort
        :headers="headers"
        :items="dataobject"
        :search="search"
        :loading="tableLoading"
        :footer-props="{
          itemsPerPageText: 'Jumlah Data Per Halaman'
        }"
        class="rounded-xl elevation-6 mx-3 pa-1"
        @update:page="($p) => page = $p"
        @update:items-per-page="($p) => itemsPerPage = $p"
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
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Pencarian"
              placeholder="Pencarian..."
              hide-details
              dense
              rounded
              outlined
              color="green"
              style="max-width: 350px;"
            ></v-text-field>
            <v-divider class="mx-2 d-none d-md-block" inset></v-divider>
            <v-select
                v-if="false"
                color="success"
                item-color="success"
                v-model="dataSwitch"
                :items="dataSwitchItems"
                outlined
                dense
                hide-details
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                rounded
                label="Donor-Partisipan"
                class="mx-auto mr-lg-2 mb-2 mb-lg-0"
                style="max-width: 200px"
                v-on:change="SelectedDataSwitch"
            ></v-select>
            <v-btn
              rounded
              dark
              class="px-9"
              color="green"
              @click="addModal = true"
            >
            <strong>Tambah Data Donor</strong>
            <v-icon class="mx-2">mdi-plus</v-icon> 
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.index="{ index }">
          {{ (itemsPerPage * (page-1)) + index + 1 }}
        </template>
        <!-- Category -->
        <template v-slot:item.participant_category="{item}">
            {{ categoryControl(item.participant_category) }}
        </template>
        <!--Status row-->
        <template v-slot:item.status="{item}">
          <v-chip :color="getStatusColumn('bg_color', item.status)" class="white--text">
            <v-icon class="mr-1">{{ getStatusColumn('icon', item.status) }}</v-icon>
            {{ getStatusColumn('text', item.status) }}
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
                     @click="openDetailDonor(item)">
                <v-icon class="mr-1">information-outline</v-icon>
                Detail
              </v-btn>
              <v-btn
                  color="orange white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     @click="openEditDonor(item)">
                <v-icon class="mr-1">mdi-check-bold</v-icon>
                Edit Data Donatur
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
  
  <script>
  import axios from "axios";
  import dialogAddDonors from "@/views/Donor/dialogAddDonors"
  import dialogEditDonors from "@/views/Donor/dialogEditDonors"
  import dialogDetailDonors from "@/views/Donor/dialogDetailDonors"
  
  export default {
    name: "Donor",
    components: {
      dialogAddDonors,
      dialogEditDonors,
      dialogDetailDonors
    },
    data: () => ({
      addModal: false,

      editDonors: {
        show: false,
        data: {}
      },

      page: 1,
      itemsPerPage: 10,
      itemsbr: [
        {
          text: "Main Data",
          disabled: true,
          href: "breadcrumbs_dashboard",
        },
        {
          text: "Donor",
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
        {text: 'No Partisipan', value: 'participant_no'},
        {text: 'Kategori', value: 'participant_category'},
        {text: 'Nama Depan', value: 'first_name'},
        {text: 'Nama Belakang', value: 'last_name'},
        {text: 'Alamat 1', value: 'address1'},
        {text: 'Alamat 2', value: 'address2'},
        {text: 'Perusahaan', value: 'company'},
        {text: 'Kota', value: 'city'},
        {text: 'Actions', value: 'actions', align: 'right'},
      ],
      dataobject: [],
      dataSwitch: "Donor",
      dataSwitchItems: ["Donor", "Manufaktur", "Sponsor"],
      details:{
        show: false,
        object: {}
      },

      snackbar: false,
      textsnackbar: "Test",
      timeoutsnackbar: 2000,
      colorsnackbar: null,
      localConfig: {
        programYear: '',
      },
    }),
  
    created() {
      this.authtoken = localStorage.getItem("token");
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
  
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
      closeDialogAdd(){
        this.addModal = false
        this.initialize()
      },
      closeDialogEdit(){
        this.editDonors.show = false
        this.editDonors.data = {}
        this.initialize()
      },

      async initialize() {
        try {
            this.$store.state.loadingOverlay = true
            this.$store.state.loadingOverlayText = 'Memuat Data...'
            const User = this.$store.state.User
            const created_by = []
            let url = this.$store.getters.getApiUrl(`GetDonorAllAdmin?`)
            const param =new URLSearchParams({
              program_year: this.localConfig.programYear
            })
            
            const res = await axios.get(url + param, this.$store.state.apiConfig)
            if(this.dataSwitch == "Donor"){
              this.dataobject = res.data.donors
            }
            else if(this.dataSwitch == "Manufaktur"){
              this.dataobject = res.data.manufacturs
            }
            else if(this.dataSwitch == "Sponsor"){
              this.dataobject = res.data.sponsors
            }
            } catch (err) {
            this.dataobject = []
              this.$store.state.loadingOverlay = false
              this.$store.state.loadingOverlayText = ''
            this.errorResponse(err)
            } finally {
              this.$store.state.loadingOverlay = false
              this.$store.state.loadingOverlayText = ''
            }
      },
      openDetailDonor(item){
        this.details.object = item
        this.details.show = true
      },
      openEditDonor(item){
        this.editDonors.show = true
        this.editDonors.data = item
      },
      SelectedDataSwitch(){
        console.log(this.dataSwitch)
        this.initialize();
      },
      categoryControl(val){
        if(val == 'cat-1') return 'Umum'
        else if(val == 'cat-2') return 'Komunitas'
        else if(val == 'cat-3') return 'Perusahaan'
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
          if (status == '0') return 'Belum Mengikuti RRA'
          if (status == '1') return 'Potensial'
          if (status == '2') return 'Tidak Potensial'
        }
  
        return ''
      },
      
  //TEST, Ambil data Rrapra
      /*async getRrapra_status(){
      //need table
        try {
          this.table.loading.show = true
          this.table.loading.text = "Sedang ambil data..."
        }
        catch (error){
          this.table.items = []
          this.errorResponse(err)
        } finally {
          this.table.loading.show = false
        }
      },*/
    },
  };
  </script>