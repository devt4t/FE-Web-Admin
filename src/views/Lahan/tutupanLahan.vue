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
    <!--  <div class="mx-9">
    <v-alert :value="alerttoken" color="red" elevation="24" type="error">
      Session Token Login Habis, Login Kembali !
    </v-alert>
  </div>-->

    <!--  <v-dialog
      v-model="dialogDetailTutupan"
      max-width="800px"
      content-class="rounded-xl"
      scrollable>
    <v-card>
      <v-card-title class="mb-1 headermodalstyle">
        <span class="headline">Detail Lahan</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container
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
        <v-container >
          <v-row class="ma-0 mx-2">
            <v-col cols="12">
              <div class="d-flex align-center">
                <p class="mb-0 grey&#45;&#45;text text&#45;&#45;darken-3">
                  <v-icon color="grey darken-3" class="mr-2"
                  >mdi-responsive</v-icon
                  >Data Lahan
                </p>
                <v-divider class="mx-2" color="black"></v-divider>
              </div>
            </v-col>
          </v-row>
          <v-row class="mt-3">
            <v-col sm="12" md="3" cols="6">
              <div class="ml-2">
                <h4><strong>No Lahan</strong></h4>
                <h5>
                  {{ defaultItem.lahan_no }}
                </h5>
              </div>
            </v-col>
            <v-col sm="12" md="3" cols="6">
              <div class="ml-2">
                <h4><strong>Nama Petani</strong></h4>
                <h5>
                  {{ defaultItem.namaPetani }}
                </h5>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="12" md="3" cols="6">
              <div class="ml-2">
                <h4><strong>Kepemilikan SPPT</strong></h4>
                <h5>
                  {{ defaultItem.kepemilikan_sppt }}
                </h5>
              </div>
            </v-col>
            <v-col sm="12" md="3" cols="6">
              <div class="ml-2">
                <h4><strong>No Identitas Internal</strong></h4>
                <h5>
                  {{ defaultItem.internal_code }}
                </h5>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="12" md="6" cols="6">
              <div class="ml-2">
                <h4><strong>Desa</strong></h4>
                <h5>
                  {{ defaultItem.namaDesa }}
                </h5>
              </div>
            </v-col>
            <v-col sm="12" md="6" cols="6">
              <div class="ml-2">
                <h4><strong>Management Unit</strong></h4>
                <h5>
                  {{ defaultItem.namaMu }}
                </h5>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>-->
    <!--MODAL DETAIL TUTUPAN LAHAN-->
    <v-dialog
      v-model="dialogDetailTutupan"
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
          <!--        <v-container
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
        </v-container>-->
          <!--ROW no lahan and nama petani-->
          <v-row class="mt-6 shadow-lg rounded-xl">
            <v-col sm="12" md="6" cols="6">
              <div class="ml-2">
                <h4><strong>No Lahan</strong></h4>
                <h5>
                  {{ itemInTutupanLahan.lahan_no }}
                </h5>
              </div>
            </v-col>
            <v-col sm="12" md="3" cols="6">
              <div class="ml-2">
                <h4><strong>Nama Petani</strong></h4>
                <h5>
                  {{ itemInTutupanLahan.farmer_name }}
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
                  {{ itemInTutupanLahan.land_area }}
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
                  {{ itemInTutupanLahan.tutupan_lahan_now + "%" }}
                </h5>
              </div>
            </v-col>
            <v-col sm="12" md="6" cols="6">
              <div class="ml-2">
                <h4><strong>Tutupan Lahan Baru</strong></h4>
                <h5>
                  {{ itemInTutupanLahan.tutupan_lahan_new + "%" }}
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
                  {{ itemInTutupanLahan.mu_no }}
                </h5>
              </div>
            </v-col>
            <v-col sm="12" md="3" cols="6">
              <div class="ml-2">
                <h4><strong>Target Area</strong></h4>
                <h5>
                  {{ itemInTutupanLahan.target_area }}
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
                  {{ itemInTutupanLahan.year_active }}
                </h5>
              </div>
            </v-col>
            <v-col sm="12" md="3" cols="6">
              <div class="ml-2">
                <h4><strong>Tahun Program</strong></h4>
                <h5>
                  {{ itemInTutupanLahan.program_year }}
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
                  {{ itemInTutupanLahan.reason }}
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
                  {{ itemInTutupanLahan.submit_date_ff }}
                </h5>
              </div>
            </v-col>
            <v-col sm="12" md="3" cols="6">
              <div class="ml-2">
                <h4><strong>Tanggal Submit FC</strong></h4>
                <h5>
                  {{ itemInTutupanLahan.submit_date_fc }}
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
                    v-bind:src="itemInTutupanLahan.doc_tutupan_photo1"
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
                    v-bind:src="itemInTutupanLahan.doc_tutupan_photo2"
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
                    v-bind:src="itemInTutupanLahan.doc_tutupan_photo3"
                    class="my-1 mb-4"
                  ></v-img>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!--MODAL EDIT DATA TUTUPAN LAHAN-->
    <v-dialog
      v-model="dialogEditTutupanLahan"
      max-width="800px"
      content-class="rounded-xl"
    >
      <v-card-title class="mb-1 headermodalstyle">
        <span class="headline">Form Tutupan Lahan</span>
      </v-card-title>
      <v-card style="position: relative">
        <v-form>
          <v-container>
            <!-- loading overlay -->
            <v-overlay
              v-if="itemInTutupanLahan.loading.show"
              absolute
              justify-center
              align-center
            >
              <div class="d-flex flex-column align-center justify-center">
                <v-progress-circular
                  :size="80"
                  :width="7"
                  indeterminate
                  color="white"
                >
                </v-progress-circular>
                <p class="mb-0 text-center mt-4">
                  {{ itemInTutupanLahan.loading.text || "Loading..." }}
                </p>
              </div>
            </v-overlay>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="itemInTutupanLahan.lahan_no"
                  label="Pilih Nomor Lahan"
                  outlined
                  clearable
                  disabled
                  :rules="[(v) => !!v || 'Field is required']"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="itemInTutupanLahan.farmer_name"
                  label="Nama Petani"
                  outlined
                  clearable
                  disabled
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="itemInTutupanLahan.land_area"
                  label="Area Lahan"
                  outlined
                  clearable
                  disabled
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  color="success"
                  v-model="itemInTutupanLahan.tutupan_lahan_now"
                  label="Tutupan Lahan Sekarang"
                  hide-details
                  rounded
                  outlined
                  disabled
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  color="success"
                  v-model="itemInTutupanLahan.tutupan_lahan_new"
                  :items="dialogMenus.progress_tutupan_lahan.items"
                  label="Tutupan Lahan Baru"
                  hide-details
                  rounded
                  outlined
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-select>
              </v-col>
              <v-col cols="24" sm="12" md="12">
                <v-text-field
                  v-model="itemInTutupanLahan.reason"
                  label="Tulis Alasan..."
                  outlined
                  clearable
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  color="success"
                  v-model="itemInTutupanLahan.year_active"
                  label="Tahun Aktif"
                  hide-details
                  rounded
                  outlined
                  disabled
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  color="success"
                  v-model="itemInTutupanLahan.program_year"
                  label="Tahun Program"
                  hide-details
                  rounded
                  outlined
                  disabled
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="itemInTutupanLahan.mu_no"
                  label="Nomor MU"
                  outlined
                  clearable
                  disabled
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="itemInTutupanLahan.target_area"
                  label="Pilih Target Area..."
                  outlined
                  clearable
                  disabled
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-col cols="12" sm="12" md="12">
            <v-file-input
              accept="image/png, image/jpeg, image/bmp"
              v-model="itemInTutupanLahan.tutupan_photo1"
              @change="
                (val) => {
                  itemInTutupanLahan.tutupan_photo1 = val;
                }
              "
              placeholder="Pilih Foto Tutupan Lahan 1"
              prepend-icon="mdi-camera"
              show-size
              label="Pilih Foto Tutupan Lahan 1..."
            ></v-file-input>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-file-input
              accept="image/png, image/jpeg, image/bmp"
              @change="
                (val) => {
                  itemInTutupanLahan.tutupan_photo2 = val;
                }
              "
              placeholder="Pilih Foto Tutupan Lahan 2"
              prepend-icon="mdi-camera"
              show-size
              label="Pilih Foto Tutupan Lahan 2..."
            ></v-file-input>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-file-input
              accept="image/png, image/jpeg, image/bmp"
              @change="
                (val) => {
                  itemInTutupanLahan.tutupan_photo3 = val;
                }
              "
              placeholder="Pilih Foto Tutupan Lahan 3"
              prepend-icon="mdi-camera"
              show-size
              label="Pilih Foto Tutupan Lahan 3..."
            ></v-file-input>
            <!--v-on:change="pilihfototutupanlahan3"-->
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="red darken-1" @click="">
              <v-icon left> mdi-close-circle-outline </v-icon>
              Keluar
            </v-btn>
            <v-btn outlined color="blue darken-1" @click="saveTutupan">
              <v-icon left> mdi-content-save-all-outline </v-icon>
              Simpan
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

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
      :class="`${
        $store.state.theme == 'dark' ? '' : ''
      } rounded-xl elevation-6 mx-3 pa-1`"
      :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman',
        itemsPerPageOptions: [10, 25, 40, -1],
        showCurrentPage: true,
        showFirstLastPage: true,
      }"
    >
      <template v-slot:item.is_verified="{ item }">
        <v-chip
          :color="getStatusColumn('bg_color', item.is_verified)"
          class="white--text"
        >
          <v-icon class="mr-1">{{
            getStatusColumn("icon", item.is_verified)
          }}</v-icon>
          {{ getStatusColumn("text", item.is_verified) }}
        </v-chip>
      </template>

      <!--Action Menus-->
      <template v-slot:item.actions="{ item }">
        <v-menu content-class="rounded-xl">
          <template v-slot:activator="{ attrs, on }">
            <v-btn v-bind="attrs" v-on="on" small fab icon>
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-card class="pa-2 d-flex align-stretch flex-column justify-center">
            <v-btn
              color="info white--text"
              rounded
              small
              class="pl-1 d-flex justify-start align-center"
              @click="showDetailTutupan(item)"
            >
              <v-icon class="mr-1">mdi-information</v-icon>
              Detail
            </v-btn>
            <!--showModal('detail', item)-->
            <v-btn
              color="orange white--text"
              rounded
              small
              class="pl-1 mt-1 d-flex justify-start align-center"
              :disabled="
                !$store.state.User.role_name == 'UNIT MANAGER' &&
                !$store.state.User.role_name == 'FIELD COORDINATOR' &&
                !$store.state.User.role_group == 'IT'
              "
              @click="showEditTutupan(item)"
            >
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
              :disabled="
                !$store.state.User.role_name == 'FIELD COORDINATOR' &&
                !$store.state.User.role_group == 'IT'
              "
              @click="verifyTutupanFC(item)"
            >
              <v-icon class="mr-1">mdi-check-bold</v-icon>
              Verifikasi FC
            </v-btn>
            <v-btn
              v-if="item.is_verified == 1"
              color="green darken-1 white--text"
              rounded
              small
              class="pl-1 mt-1 d-flex justify-start align-center"
              :disabled="
                item.is_verified == 1 &&
                !$store.state.User.role_name == 'UNIT MANAGER' &&
                !$store.state.User.role_group == 'IT'
              "
              @click="verifyTutupanUM(item)"
            >
              <v-icon class="mr-1">mdi-check-bold</v-icon>
              Verifikasi UM
            </v-btn>
            <v-btn
              v-if="item.is_verified != 0"
              color="red white--text"
              rounded
              small
              class="pl-1 mt-1 d-flex justify-start align-center"
              :disabled="
                !$store.state.User.role_name == 'UNIT MANAGER' &&
                !$store.state.User.role_group == 'IT'
              "
              @click="unverifyTutupanUM(item)"
            >
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
import Swal from "sweetalert2";
import data from "bootstrap/js/src/dom/data";

export default {
  data: () => ({
    dialog: false,
    dialogDetailTutupan: false,
    dialogEditTutupanLahan: false,

    BaseUrl: "",
    BaseUrlGet: "",

    defaultItem: {
      document_no: "",
    },

    itemInTutupanLahan: {
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
        text: "Loading...",
      },
    },
    dialogMenus: {
      progress_tutupan_lahan: {
        label: "Cakupan Lahan(%)",
        items: [
          { text: "0%", value: 0 },
          { text: "25%", value: 25 },
          { text: "50%", value: 50 },
          { text: "75%", value: 75 },
        ],
        model: 0,
        loading: false,
      },
    },
    breadcrumbs: [
      {
        text: "Lahan",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Daftar Permintaan Pergantian Tutupan Lahan",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    table: {
      headers: [
        { text: "Nama Petani", value: "farmer_name" },
        { text: "No Lahan", value: "lahan_no" },
        { text: "Tutupan Lahan Sekarang", value: "tutupan_lahan_now" },
        { text: "Tutupan Lahan Baru", value: "tutupan_lahan_new" },
        { text: "Alasan", value: "reason" },
        { text: "Status", value: "is_verified", align: "center" },
        // {text: 'Status', value: '', align: 'center'},
        { text: "Actions", value: "actions", align: "right" },
      ],
      items: [],
      loading: {
        show: false,
        text: "Loading...",
      },
      search: "",
    },
    user: "",
    localConfig: {
      programYear: "",
    },
    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
  }),
  mounted() {
    this.firstAccessPage();
  },
  methods: {
    errorResponse(error) {
      console.log(error);
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
      this.user = this.$store.state.User;
      this.localConfig.programYear = this.$store.state.programYear.model;
      this.BaseUrl = localStorage.getItem("BaseUrl");
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      await this.getTableData();
    },

    async getDetail(item) {
      console.log(item);
      this.itemInTutupanLahan.farmer_no = item.farmer_no;
      this.itemInTutupanLahan.farmer_name = item.farmer_name;
      this.itemInTutupanLahan.land_area = item.land_area;
      this.itemInTutupanLahan.tutupan_lahan_now = item.tutupan_lahan_now;
      this.itemInTutupanLahan.tutupan_lahan_new = item.tutupan_lahan_new;
      this.itemInTutupanLahan.reason = item.reason;
      this.itemInTutupanLahan.lahan_no = item.lahan_no;
      this.itemInTutupanLahan.year_active = item.year_active;
      this.itemInTutupanLahan.program_year = item.program_year;
      this.itemInTutupanLahan.submit_date_ff = item.submit_date_ff;
      this.itemInTutupanLahan.submit_date_fc = item.submit_date_fc;
      this.itemInTutupanLahan.verified_by = item.verified_by;
      this.itemInTutupanLahan.mu_no = item.mu_no;
      this.itemInTutupanLahan.target_area = item.target_area;

      if (item.tutupan_photo1 == "-") {
        this.itemInTutupanLahan.doc_tutupan_photo1 = "/images/noimage2.png";
      } else {
        this.itemInTutupanLahan.doc_tutupan_photo1 =
          this.BaseUrl + item.tutupan_photo1;
      }
      if (item.tutupan_photo2 == "-") {
        this.itemInTutupanLahan.doc_tutupan_photo2 = "/images/noimage2.png";
      } else {
        this.itemInTutupanLahan.doc_tutupan_photo2 =
          this.BaseUrl + item.tutupan_photo2;
      }
      if (item.tutupan_photo3 == "-") {
        this.itemInTutupanLahan.doc_tutupan_photo3 = "/images/noimage2.png";
      } else {
        this.itemInTutupanLahan.doc_tutupan_photo3 =
          this.BaseUrl + item.tutupan_photo3;
      }
    },
    showDetailTutupan(item) {
      this.type = "Detail";
      this.dialogDetailTutupan = true;
      this.getDetail(item);
    },

    showEditTutupan(item) {
      this.type = "Edit";
      this.dialogEditTutupanLahan = true;
      this.getDetail(item);
    },

    //verifikasi FC
    async verifyTutupanFC(item) {
      console.log("start");
      this.$store.state.loadingOverlay = true;
      this.$store.state.loadingOverlayText = "Verifikasi Tutupan Lahan!";

      const datapost = {
        form_no: item.form_no,
        verified_by: item.mu_no,
        is_verified: item.is_verified,
      };
      try {
        const response = await axios.post(
          this.BaseUrlGet + "VerificationLahanTutupanFC",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log("result data: " + response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialogDetail = false;
          this.initialize();
        } else {
          this.dialogDetail = false;
          this.alerttoken = true;
        }
      } catch (error) {
        if (error.response.status == 401) {
          this.alerttoken = true;
          this.dialogDetail = false;
        }
      } finally {
        this.getTableData();
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;
        console.log("end");
      }
    },
    //verifikasi UM
    async verifyTutupanUM(item) {
      console.log("start");
      this.$store.state.loadingOverlay = true;
      this.$store.state.loadingOverlayText = "Verifikasi Tutupan Lahan!";

      const datapost = {
        form_no: item.form_no,
        verified_by: item.mu_no,
        is_verified: item.is_verified,
      };
      try {
        const response = await axios.post(
          this.BaseUrlGet + "VerificationLahanTutupanUM",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log("result data: " + response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialogDetail = false;
          this.initialize();
        } else {
          this.dialogDetail = false;
          this.alerttoken = true;
        }
      } catch (error) {
        if (error.response.status == 401) {
          this.alerttoken = true;
          this.dialogDetail = false;
        }
      } finally {
        this.getTableData();
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;
        console.log("end");
      }
    },
    //verifikasi UM
    async unverifyTutupanUM(item) {
      console.log("start");
      this.$store.state.loadingOverlay = true;
      this.$store.state.loadingOverlayText = "Unverifikasi Tutupan Lahan!";

      const datapost = {
        form_no: item.form_no,
        verified_by: item.mu_no,
        is_verified: item.is_verified,
      };
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UnverificationLahanTutupan",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log("result data: " + response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialogDetail = false;
          this.initialize();
        } else {
          this.dialogDetail = false;
          this.alerttoken = true;
        }
      } catch (error) {
        if (error.response.status == 401) {
          this.alerttoken = true;
          this.dialogDetail = false;
        }
      } finally {
        this.getTableData();
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;
        console.log("end");
      }
    },

    //Update Data
    async updateTutupanLahan(datapost) {
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateLahanTutupanRequest",
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
      } catch (error) {
        if (error.response.status == 401) {
          this.dialog = true;
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar =
            "Gagal Simpan! Kolom Tidak Boleh Ada Yang Kosong.";
        }
      }
    },
    async saveTutupan() {
      this.itemInTutupanLahan.loading.show = true;

      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda Yakin?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        if (
          this.itemInTutupanLahan.form_no != null &&
          this.itemInTutupanLahan.ff_no != null &&
          this.itemInTutupanLahan.lahan_no != null &&
          this.itemInTutupanLahan.tutupan_lahan_new != null &&
          this.itemInTutupanLahan.mu_no != null &&
          this.itemInTutupanLahan.land_area != null &&
          this.itemInTutupanLahan.program_year != null &&
          this.itemInTutupanLahan.reason != null &&
          this.itemInTutupanLahan.farmer_no != null &&
          this.itemInTutupanLahan.tutupan_photo1 &&
          this.itemInTutupanLahan.tutupan_photo2 &&
          this.itemInTutupanLahan.tutupan_photo3
        ) {
          const postTutupan = {
            lahan_no: this.itemInTutupanLahan.lahan_no,
            year_active: this.itemInTutupanLahan.year_active,
            program_year: this.itemInTutupanLahan.program_year,
            tutupan_lahan_now: this.itemInTutupanLahan.tutupan_lahan_now,
            tutupan_lahan_new: this.itemInTutupanLahan.tutupan_lahan_new,
            reason: this.itemInTutupanLahan.reason,
            mu_no: this.itemInTutupanLahan.mu_no,
            land_area: this.itemInTutupanLahan.land_area,
            farmer_no: this.itemInTutupanLahan.farmer_no,
            target_area: this.itemInTutupanLahan.target_area,
            user_id: this.itemInTutupanLahan.mu_no,
            tutupan_photo1: "",
            tutupan_photo2: "",
            tutupan_photo3: "",
          };
          if (this.itemInTutupanLahan.tutupan_photo1) {
            const namafile =
              postTutupan.lahan_no +
              "_" +
              this.localConfig.programYear +
              "_TutupanLahan1";
            const response = await axios.post(
              this.BaseUrl + "land-coverage/upload.php?nama=",
              this._utils.generateFormData({
                nama: namafile,
                fileToUpload: this.itemInTutupanLahan.tutupan_photo1,
              })
            );
            postTutupan.tutupan_photo1 = response.data.data.new_name;
          }
          if (this.itemInTutupanLahan.tutupan_photo2) {
            const namafile =
              postTutupan.lahan_no +
              "_" +
              this.localConfig.programYear +
              "_TutupanLahan2";
            const response = await axios.post(
              this.BaseUrl + "land-coverage/upload.php?nama=",
              this._utils.generateFormData({
                nama: namafile,
                fileToUpload: this.itemInTutupanLahan.tutupan_photo2,
              })
            );
            postTutupan.tutupan_photo2 = response.data.data.new_name;
          }
          if (this.itemInTutupanLahan.tutupan_photo3) {
            const namafile =
              postTutupan.lahan_no +
              "_" +
              this.localConfig.programYear +
              "_TutupanLahan3";
            const response = await axios.post(
              this.BaseUrl + "land-coverage/upload.php?nama=",
              this._utils.generateFormData({
                nama: namafile,
                fileToUpload: this.itemInTutupanLahan.tutupan_photo3,
              })
            );
            postTutupan.tutupan_photo3 = response.data.data.new_name;
          }
          console.log(postTutupan);
          await this.updateTutupanLahan(postTutupan);

          this.dialogEditTutupanLahan = false;
        } else {
          console.log("start end");
          Swal.fire({
            title: "Gagal Simpan!",
            text: `Kolom Belum Lengkap!`,
            icon: "warning",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "Okay",
          });
        }
        this.itemInTutupanLahan.loading.show = false;
      }
    },

    //Status
    getStatusColumn(type, is_verified) {
      if (type == "bg_color") {
        if (is_verified == "0") return "red";
        if (is_verified == "1") return "orange";
        if (is_verified == "2") return "green darken-1";
      }
      if (type == "icon") {
        if (is_verified == "0") return "mdi-alpha-x-circle";
        if (is_verified == "1") return "mdi-check-circle";
        if (is_verified == "2") return "mdi-check-circle";
      }
      if (type == "text") {
        if (is_verified == "0") return "Belum Terverifikasi";
        if (is_verified == "1") return "Terverifikasi FC";
        if (is_verified == "2") return "Terverifikasi UM";
      }

      return "";
    },

    async getTableData() {
      try {
        this.table.loading.show = true;
        const User = this.$store.state.User;
        const created_by = [];
        // let url = this.$store.getters.getApiUrl(`GetLahanTutupanRequestAllAdmin?program_year=${this.localConfig.programYear}`)
        // const res = await axios.get(url, this.$store.state.apiConfig)
        const res = await this.$_api.get("GetLahanTutupanRequestAllAdmin", {
          program_year: this.localConfig.programYear,
        });
        this.table.items = res.data.result;

        /*if(res.data.result.tutupan_photo1 == "-"){
          this.itemInTutupanLahan.tutupan_photo1 = "/images/noimage.png";
          console.log(res.data.result.tutupan_photo1)
        } else {
          if(res.data.result.tutupan_photo1 < 1000){
            this.itemInTutupanLahan.tutupan_photo1 =
            this.BaseUrl + res.data.result.tutupan_photo1;
          }else {
            this.itemInTutupanLahan.tutupan_photo1 =
                "data:image/jpg;base64," + res.data.result.tutupan_photo1;

          }
        }*/
        // console.log(this.table.items)
      } catch (err) {
        this.table.items = [];
        this.errorResponse(err);
      } finally {
        this.table.loading.show = false;
      }
    },
  },
};
</script>
