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
                   :disabled="!$store.state.User.role_name=='PLANNING MANAGER' && !$store.state.User.role_group=='IT'"
                   @click="">
              <v-icon class="mr-1">information-outline</v-icon>
              Detail
            </v-btn>
            <v-btn
                v-if="item.is_verified == 0"
                color="green white--text"
                   rounded
                   small
                   class="pl-1 mt-1 d-flex justify-start align-center"
                   :disabled="!$store.state.User.role_name=='PLANNING MANAGER' && !$store.state.User.role_group=='IT'"
                   @click="">
              <v-icon class="mr-1">mdi-check-bold</v-icon>
              Verifikasi
            </v-btn>
            <v-btn
                v-if="item.is_verified != 0"
                color="red white--text"
                   rounded
                   small
                   class="pl-1 mt-1 d-flex justify-start align-center"
                   :disabled="!$store.state.User.role_name=='PLANNING MANAGER' && !$store.state.User.role_group=='IT'"
                   @click="">
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

<script>
import axios from "axios";

export default {
  name: "Donor",
  data: () => ({
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
      {text: 'Nama', value: 'farmer_name'},
      {text: 'Negara', value: 'lahan_no'},
      {text: 'No Partisipan', value: 'nama_mu'},
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
          let url = this.$store.getters.getApiUrl(`GetLahanBarcodeRequestAdmin?user_id=`)
          const res = await axios.get(url, this.$store.state.apiConfig)
          if(this.dataSwitch == "Donor"){
            this.dataobject = res.data.data.result
          }
          else if(this.dataSwitch == "Participant"){
            this.dataobject = res.data.data.result1
          }
          else if(this.dataSwitch == "else"){
            this.dataobject = res.data.data.result
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
    SelectedDataSwitch(){
      console.log(this.dataSwitch)
      this.initialize();
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