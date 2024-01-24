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
      <!-- trees preview component -->
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
            <!-- <v-btn
              rounded
              class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
              @click=""
              color="green white--text"
            >
              <v-icon class="mr-1">mdi-zip-box</v-icon> Populate Data Lahan
            </v-btn> -->
          </v-row>
        </template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  import axios from "axios";

  
  export default {
    name: "Donor",
    components: {
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
        {text: 'Kategori', value: 'category'},
        {text: 'Kategori', value: 'category'},
        {text: 'Kategori', value: 'category'},
        {text: 'Kategori', value: 'category'},
        {text: 'Kategori', value: 'category'},
        {text: 'Kategori', value: 'category'},
        {text: 'Kategori', value: 'category'},
        {text: 'Actions', value: 'actions', align: 'right'},
      ],
      dataobject: [],

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
            // const User = this.$store.state.User
            // const created_by = []
            // let url = this.$store.getters.getApiUrl(``)
            // const res = await axios.get(url, this.$store.state.apiConfig)

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
    },
  };
  </script>
  