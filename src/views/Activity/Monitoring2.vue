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
      <!-- <template v-slot:item.actions="{ item }">
        <v-menu content-class="rounded-xl">
          <template v-slot:activator="{attrs, on}">
            <v-btn v-bind="attrs" v-on="on" small fab icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-card class="pa-2 d-flex align-stretch flex-column justify-center">
            <v-btn color="info white--text" rounded small class="pl-1 d-flex justify-start align-center" @click="showDetail(item)">
              <v-icon class="mr-1">mdi-information</v-icon> Detail
            </v-btn>
            <v-btn v-if="generalSettings.landProgram.model == 'Umum'" :disabled="item.is_validate > 0 || (item.is_validate == 0 && (User.role_name == 'REGIONAL MANAGER' || User.role_name == 'PROGRAM MANAGER'))" color="orange white--text" rounded small class="pl-1 mt-1 d-flex justify-start align-center" @click="() => {showEditUmumModal(item.monitoring_no)}">
              <v-icon class="mr-1">mdi-pencil-circle</v-icon> Edit
            </v-btn>
            <v-btn rounded small color="red white--text" class="mt-1 pl-1 d-flex justify-start align-center" v-if="(item.is_validate > 0 && generalSettings.landProgram.model == 'Petani') && (User.role_group == 'IT' || ((item.is_validate <= 2 && User.role_name == 'UNIT MANAGER') || (item.is_validate == 2 && User.role_name == 'REGIONAL MANAGER')))" @click="showUnverifModal(item)">
              <v-icon class="mr-1 pl-2">mdi-undo</v-icon> Unverif
            </v-btn>
            <v-btn v-else-if="(item.is_validate > 0 && generalSettings.landProgram.model == 'Umum')" 
              :disabled="(item.is_validate == 1 && User.role_name != 'REGIONAL MANAGER' && User.role_name != 'PROGRAM MANAGER' && User.role_group != 'IT') || (item.is_validate == 2 && User.role_name != 'REGIONAL MANAGER' && User.role_name != 'PROGRAM MANAGER' && User.role_group != 'IT')"
              rounded small color="red white--text" class="mt-1 pl-1 d-flex justify-start align-center"  @click="() => showUnverifModal(item)">
              <v-icon class="mr-1 pl-2">mdi-undo</v-icon> Unverif
            </v-btn>
            <v-btn rounded small color="red darken-2 white--text" class="mt-1 pl-1 d-flex justify-start align-center" @click="() => showDeleteModal(item)" :disabled="deleteDisabled(item.is_validate)">
              <v-icon class="mr-1 pl-2">mdi-delete</v-icon> Delete
            </v-btn>
          </v-card>
        </v-menu>
      </template> -->
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

export default {
  name: "Monitoring2",
  components: {
    // TreesPreview
},
  data: () => ({
    // general setting
    authtoken: "",
    User: {},
    headers: [
      {text: 'Nomor Project', value: 'project_no'},
      {text: 'Nomor Lahan', value: 'lahan_no'},
    ],
    tableLoading: false,
    dataobject: [],
    // snackbar
    snackbar: {
      color: '',
      show: false,
      timeout: 5000,
      text: ''
    }
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
