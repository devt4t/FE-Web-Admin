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
    <dialogAddProject
      :show="openAddDialog"
      @close="closeAddDialog()"
    >
    </dialogAddProject>
    <dialogEditProject
      :show="editModul.show"
      :itemData="editModul.itemData"
      @close="closeEditDialog()"
    ></dialogEditProject>
    <dialogDetailProject
      :show="detailModul.show"
      :datas="detailModul.itemData"
      @close="detailModul.show = false"
    ></dialogDetailProject>

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
            <v-btn
              v-if="$store.state.User.role_group=='IT'"
              rounded
              dark
              class="px-9"
              color="green"
              @click="openAddDialog=true"
            >
            <strong>Tambah Data Project
              <v-icon class="mx-2">mdi-plus</v-icon> 
            </strong>
            </v-btn>
          <!-- <v-select
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
          ></v-select> -->
        </v-toolbar>
      </template>
      <template v-slot:item.index="{ index }">
        {{ (itemsPerPage * (page-1)) + index + 1 }}
      </template>
      <template v-slot:header.co2_capture="{header}">
        Proyeksi CO<sup>2</sup>
      </template>

      <!--Status row-->
      <template v-slot:item.status="{item}">
        <v-chip :color="item.active > 0 ? 'green': 'red'" class="white--text">
          <v-icon class="mr-1">{{ item.active > 0? 'mdi-check-bold': 'mdi-close-thick' }}</v-icon>
          {{ item.active>0?'Aktif': 'Tidak Aktif'}}
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
                   :disabled="!$store.state.User.role_name=='PLANNING MANAGER' && !$store.state.User.role_group=='IT'"
                   @click="opensDetailDialog(item)">
              <v-icon class="mr-1">mdi-information-outline</v-icon>
              Detail
            </v-btn>
            <v-btn
                  color="orange white--text"
                     rounded
                     small
                     class="pl-1 mt-1 d-flex justify-start align-center"
                     :disabled="!$store.state.User.role_group=='IT'"
                     @click="opensEditDialog(item)">
                <v-icon class="mr-1">mdi-refresh</v-icon>
                Edit Data Project
              </v-btn>
            <v-btn
                v-if="item.active == 0"
                color="green white--text"
                   rounded
                   small
                   class="pl-1 mt-1 d-flex justify-start align-center"
                   :disabled="!$store.state.User.role_name=='PLANNING MANAGER' && !$store.state.User.role_group=='IT'"
                   @click="ProjectActivation(item)">
              <v-icon class="mr-1">mdi-check-bold</v-icon>
              Aktifkan
            </v-btn>
            <v-btn
                v-if="item.active != 0"
                color="red white--text"
                   rounded
                   small
                   class="pl-1 mt-1 d-flex justify-start align-center"
                   :disabled="!$store.state.User.role_name=='PLANNING MANAGER' && !$store.state.User.role_group=='IT'"
                   @click="ProjectActivation(item)">
              <v-icon class="mr-1">mdi-close-thick</v-icon>
              Non-Aktifkan
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
import Swal from 'sweetalert2'
import dialogAddProject from "@/views/Project/component/dialogAddProject"
import dialogEditProject from "@/views/Project/component/dialogEditProject";
import dialogDetailProject from "./component/dialogDetailProject.vue";

export default {
  name: "Donor",
  components: {
    dialogAddProject,
    dialogEditProject,
    dialogDetailProject
  },
  data: () => ({
    openAddDialog: false,
    editModul: {
      show: false,
      itemData: {}
    },
    detailModul:{
      show: false,
      itemData: {}
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
        text: "Data Project",
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
      {text: 'Nomor', value: 'project_no'},
      {text: 'Kategori', value: 'project_category'},
      {text: 'Nama Project', value: 'project_name'},
      {test: 'Status', value: 'status'},
      {text: 'Actions', value: 'actions', align: 'right'},
    ],
    dataobject: [],
    dataSwitch: "Donor",
    dataSwitchItems: ["Donor", "Participant", "else"],

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
    async initialize() {
      try {
          this.$store.state.loadingOverlay = true
          this.$store.state.loadingOverlayText = 'Memuat Data...'
          const User = this.$store.state.User
          const created_by = []
          let url = this.$store.getters.getApiUrl(`GetProjectAllAdmin`)
          const res = await axios.get(url, this.$store.state.apiConfig)
          this.dataobject = res.data.Project
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
    opensEditDialog(item){
      this.editModul.show=true
      this.editModul.itemData = item
    },
    opensDetailDialog(item){
      this.detailModul.show=true
      this.detailModul.itemData = item
    },
    closeEditDialog(){
      this.editModul.show=false
      this.initialize()
    },
    closeAddDialog(){
      this.openAddDialog=false
      this.initialize()
    },
    SelectedDataSwitch(){
      console.log(this.dataSwitch)
      this.initialize();
    },
    async ProjectActivation(item){
            try{
                const confirmation = await Swal.fire({
                    title: 'Anda Yakin Untuk Aktif/Non-Aktifkan Data Project?',
                    text: "Proses Tidak Dapat Dikembalikan!",
                    icon: 'warning',
                    confirmButtonColor: '#2e7d32',
                    confirmButtonText: 'Okay',
                    showCancelButton: true
                })
                if(confirmation.isConfirmed){
                    const params = {
                        project_no: item.project_no,
                    }
                    console.log(params)
                    // const url = `AddNewProject?${params}`
                    const PostData = await axios.post(
                        this.BaseUrlGet + "ProjectActivator",
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
            this.initialize()
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
    
  },
};
</script>