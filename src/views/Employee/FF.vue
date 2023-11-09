<template>
  <div>
    <v-breadcrumbs
      data-aos="fade-right"
      :dark="$store.state.theme == 'dark'"
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>
    <!-- Dialogs -->
    <!-- Modal Add Edit -->
    <AddFFModal
      :show="dialogs.addEditFF.show"
      :id="dialogs.addEditFF.id"
      :programYear="localConfig.programYear"
      @dialogAct="dialogsAction($event)"
      @showSnackbar="showSnackbar($event.text, $event.color)"
      @swal="($v) => swalActions($v)"
      @refreshTable="initialize"
    />
    <!-- modal edit email ff -->
    <editEmailModal
      :show="dialogs.editEmailFF.show"
      :email="dialogs.editEmailFF.value"
      @close="dialogs.editEmailFF.show = false"
    />
      
    
    <!-- modal list ff farmers -->
    <ShowFarmerList :show="dialogs.listFarmer.show" :ff_no="dialogs.listFarmer.ff_no" />
    <!-- dialog detail -->
    <v-dialog
      v-model="dialogdetail"
      max-width="700px"
      content-class="rounded-xl"
      scrollable
    >
      <v-card>
        <v-card-title class="mb-1 headermodalstyle">
          <span class="">Detail FF</span>
        </v-card-title>
        <v-card-text>
          <v-container
            v-if="load == true"
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
          <v-container v-if="load == false">
            <v-card class="rounded-xl shadow-lg font-weight-bold" color="light-green">
              <v-row class="ma-0 mx-2">
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <p class="mb-0 grey--text text--darken-3">
                      <v-icon color="grey darken-3" class="mr-2"
                      >mdi-responsive</v-icon
                      >Informasi Umum
                    </p>
                    <v-divider class="mx-2" color="black"></v-divider>
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <v-card class="rounded-xl shadow-lg">
              <v-row class="mt-3">
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>FF Number</strong></h4>
                    <h5>
                      {{ defaultItem.ff_no }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>No KTP</strong></h4>
                    <h5>
                      {{ defaultItem.ktp_no }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Nama FF</strong></h4>
                    <h5>
                      {{ defaultItem.name }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Alamat FF</strong></h4>
                    <h5>
                      {{ defaultItem.address }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Desa</strong></h4>
                    <h5>
                      {{ defaultItem.village }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Kode Pos</strong></h4>
                    <h5>
                      {{ defaultItem.post_code }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Kecamatan</strong></h4>
                    <h5>
                      {{ defaultItem.kecamatan }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Kabupaten/Kota</strong></h4>
                    <h5>
                      {{ defaultItem.city }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Provinsi</strong></h4>
                    <h5>
                      {{ defaultItem.province }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Working Area</strong></h4>
                    <h5>
                      {{ defaultItem.namaWorkingArea }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Target Area</strong></h4>
                    <h5>
                      {{ defaultItem.namaTA }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Management Unit</strong></h4>
                    <h5>
                      {{ defaultItem.namaMU }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>No Hp</strong></h4>
                    <h5>
                      {{ defaultItem.phone }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Jenis Kelamin</strong></h4>
                    <h5>
                      {{ defaultItem.gender }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Agama</strong></h4>
                    <h5>
                      {{ defaultItem.religion }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Tanggal Lahir</strong></h4>
                    <h5>
                      {{ defaultItem.birthday }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Status Perkawinan</strong></h4>
                    <h5>
                      {{ defaultItem.marrital }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Akun Bank</strong></h4>
                    <h5>
                      {{ defaultItem.bank_account }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Cabang bank</strong></h4>
                    <h5>
                      {{ defaultItem.bank_branch }}
                    </h5>
                  </div>
                </v-col>
                <v-col sm="12" md="3" cols="3">
                  <div class="ml-2">
                    <h4><strong>Nama Bank</strong></h4>
                    <h5>
                      {{ defaultItem.bank_name }}
                    </h5>
                  </div>
                </v-col>
              </v-row>
            </v-card>

          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-divider class="mx-2"></v-divider>
          <v-btn
            v-if="defaultItem.active == 1"
            rounded
            color="red white--text"
            class="px-5"
            @click="nonactivateFF(defaultItem)"
          >
            <v-icon class="mr-1">mdi-account-off</v-icon>
            Nonaktifkan
          </v-btn>
          <v-btn
            v-else
            dark
            rounded
            @click="activateFF(defaultItem)"
            color="green white--text"
          >
            <v-icon class="mr-1" small color="white">
              mdi-account-check
            </v-icon>
            Aktifkan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialog delete -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Apa Anda Yakin Menghapus Data Ini?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Keluar</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirmation -->
    <v-dialog
      v-model="dialogs.nonactivateConfirmation.show"
      max-width="500px"
      persistent
      content-class="rounded-lg"
      scrollable
    >
      <v-card class="rounded-xl" v-if="dialogs.nonactivateConfirmation.model">
        <v-card-title class="mb-1 headermodalstyle">
          <v-icon class="mr-2 white--text">mdi-help-circle</v-icon>
          <span>Confirmation</span>
          <v-divider dark class="mx-2"></v-divider>
          <v-icon
            color="red"
            @click="dialogs.nonactivateConfirmation.show = false"
            >mdi-close-circle</v-icon
          >
        </v-card-title>
        <v-card-text>
          <h2 class="text-center pt-4">
            Apa Anda Mau
            {{
              dialogs.nonactivateConfirmation.model[1]
                ? "Aktifkan"
                : "Nonaktifkan"
            }}
            FF Ini?
          </h2>
          <v-row class="mt-10 align-center mb-0">
            <v-divider class="mx-2"></v-divider>
            <v-btn
              rounded
              color="red white--text mr-1"
              @click="dialogs.nonactivateConfirmation.show = false"
            >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Keluar
            </v-btn>
            <v-btn
              rounded
              color="green white--text ml-1"
              @click="confirmNonactivate"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              {{
                dialogs.nonactivateConfirmation.model[1]
                  ? "Activate"
                  : "Nonactivate"
              }}
            </v-btn>
            <v-divider class="mx-2"></v-divider>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Change FF Modal -->
    <ChangeFFModal
      :show="dialogs.changeFF.show"
      :id="dialogs.changeFF.id"
      @dialogAct="dialogsAction($event)"
      @showSnackbar="showSnackbar($event.text, $event.color)"
      @refreshTable="initialize"
    />

    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      multi-sort
      :headers="headers"
      :items="dataobject"
      :search="search"
      :loading="loadtable"
      :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman',
        itemsPerPageOptions: [10, 25, 40, -1],
        showCurrentPage: true,
        showFirstLastPage: true,
      }"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1 mb-4"
    >
      <template v-slot:top>
        <v-toolbar flat rounded="xl">
          <!-- Program Year -->
          <v-select
            color="success"
            item-color="success"
            v-model="localConfig.programYear"
            :items="['Semua', ...$store.state.programYear.options]"
            :disabled="loadtable"
            outlined
            dense
            hide-details
            :menu-props="{
              bottom: true,
              offsetY: true,
              rounded: 'xl',
              transition: 'slide-y-transition',
            }"
            rounded
            label="Tahun Program"
            class="mx-auto mr-lg-2 mb-2 mb-lg-0"
            style="max-width: 200px"
          ></v-select>
          <v-text-field
            color="green"
            outlined
            rounded
            dense
            v-model="search"
            append-icon="mdi-magnify"
            label="Pencarian"
            hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset></v-divider>
          <v-btn
            v-if="RoleAccesCRUDShow == true"
            dark
            rounded
            class="mb-2"
            @click="showAddModal()"
            color="blue"
          >
            <v-icon small>mdi-plus</v-icon> Tambah Data
          </v-btn>
        </v-toolbar>
      </template>
      <!-- Status Column -->
      <template v-slot:item.active="{ item }">
        <v-chip :color="`${item.active ? 'green' : 'red'} white--text`">
          {{ item.active ? "Aktif" : "Nonaktif" }}
        </v-chip>
      </template>
      <!-- Actions Column -->
      <template v-slot:item.actions="{ item }">
        <v-menu
          rounded="xl"
          bottom
          left
          offset-y
          transition="slide-y-transition"
          :close-on-content-click="true"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" color="dark">
              mdi-arrow-down-drop-circle
            </v-icon>
          </template>

          <v-card class="rounded-xl pa-2">
            <v-btn
              dark
              rounded
              @click="showDetail(item)"
              color="info"
              class="mb-1"
              block
              small
            >
              <v-icon
                class="mr-1"
                @click="showDetail(item)"
                small
                color="white"
              >
                mdi-information-outline
              </v-icon>
              Detail
            </v-btn>
            <v-btn
              v-if="
                (RoleAccesCRUDShow == true &&
                  item.validation != 1 &&
                  (User.role_name == 'UNIT MANAGER' ||
                    User.role_name == 'REGIONAL MANAGER')) ||
                  User.role_group == 'IT'
              "
              class="mb-1"
              block
              small
              rounded
              @click="editItem(item)"
              color="warning white--text"
            >
              <v-icon class="mr-1" small color="white">
                mdi-pencil
              </v-icon>
              Edit
            </v-btn>
            <v-btn
              v-if="
                (RoleAccesCRUDShow == true &&
                  item.validation != 1 &&
                  (User.role_name == 'UNIT MANAGER' ||
                    User.role_name == 'REGIONAL MANAGER')) ||
                  User.role_group == 'IT'"
              class="mb-1"
              block
              small
              rounded
              @click="editEmail(item)"
              color="info white--text"
            >
              <v-icon class="mr-1" small color="white">
                mdi-pencil
              </v-icon>
              Edit Email
            </v-btn>
            <v-btn
              v-if="User.role_group == 'IT' && item.active != 1 && false"
              dark
              rounded
              @click="deleteItem(item)"
              color="red"
              class="mb-1"
              block
              small
            >
              <v-icon class="mr-1" small color="white">
                mdi-delete
              </v-icon>
              Hapus
            </v-btn>
            <!-- <v-btn
              v-if="item.active == 1"
              rounded
              @click="nonactivateFF(item)"
              color="red white--text"
              class="mb-1"
              block
              small
            >
            <v-icon class="mr-1" small color="white">
              mdi-account-off
            </v-icon>
              Nonactivate
            </v-btn> -->
            <!-- <v-btn
              v-if="item.active == 0"
              rounded
              @click="activateFF(item)"
              color="green white--text"
              class="mb-1"
              block
              small
            >
            <v-icon class="mr-1" small color="white">
              mdi-account-check
            </v-icon>
              Activate
            </v-btn> -->
            <!-- <v-btn
              rounded
              @click="() => {dialogs.changeFF.id = item.id;dialogs.changeFF.show = true;}"
              color="red white--text"
              class="mb-0"
              block
              :disabled="User.role_group != 'IT'"
              small
            >
            <v-icon class="mr-1" small color="white">
              mdi-account-convert
            </v-icon>
              Change FC
            </v-btn> -->
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

import editEmailModal from "./components/FF/editEmailModal.vue"
import ChangeFFModal from "./components/FF/ChangeFFModal.vue";
import AddFFModal from "./components/FF/AddFFModal.vue";
import ShowFarmerList from "./components/FF/ShowFarmerList.vue";

export default {
  name: "FieldFacilitator",
  components: { editEmailModal, ChangeFFModal, AddFFModal, ShowFarmerList },
  data: () => ({
    dialogs: {
      addEditFF: {
        show: false,
        id: "",
      },
      editEmailFF: {
        show: false,
        value: "",
      },
      changeFF: {
        show: false,
        id: "",
      },
      nonactivateConfirmation: {
        show: false,
        model: null,
      },
      listFarmer: {
        show: false,
        ff_no: null
      }
    },
    menu2: "",
    valid: true,
    datepicker: new Date().toISOString().substr(0, 10),
    itemsbr: [
      {
        text: "Employee",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Field Facilitator",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    formTitle: "Tambah Data",
    value: "add",
    dialogdetail: false,
    dialog: false,
    dialogDelete: false,
    loadtable: false,
    load: false,
    search: "",
    authtoken: "",
    BaseUrlGet: "",
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 1) || "Min 1 characters",
    ],
    headers: [
      // { text: "ID", value: "id" },
      { text: "FF No", value: "ff_no" },
      { text: "Nama FF", value: "namaFF" },
      { text: "Nama FC", value: "namaFC" },
      { text: "MU", value: "mu_name" },
      { text: "TA", value: "ta_name" },
      { text: "Desa", value: "village_name" },
      { text: "Email", value: "email" },
      { text: "Status", value: "active", align: "center" },
      { text: "Actions", value: "actions", sortable: false, align: "right" },
    ],
    dataobject: [],
    defaultItem: {
      id: "",
      address: "",
      bank_account: "",
      bank_branch: "",
      bank_name: "",
      birthday: "",
      city: "",
      fc_no: "",
      ff_no: "",
      ff_photo: "",
      ff_photo_path: "",
      gender: "",
      join_date: "",
      kecamatan: "",
      ktp_no: "",
      marrital: "",
      mu_no: "",
      namaMU: "",
      namaTA: "",
      namaWorkingArea: "",
      name: "",
      phone: "",
      post_code: "",
      province: "",
      religion: "",
      target_area: "",
      user_id: "",
      village: "",
      working_area: "",
      active: "",
    },
    itemsgender: [
      { text: "Laki-Laki", value: "male" },
      { text: "Perempuan", value: "female" },
    ],
    itemsagama: [
      { text: "Islam", value: "islam" },
      { text: "Kristen", value: "kristen" },
      { text: "Khatolik", value: "khatolik" },
      { text: "Hindu", value: "hindu" },
      { text: "Budha", value: "budha" },
    ],
    itemsmarrital: [
      { text: "Kawin", value: "kawin" },
      { text: "Belum Kawin", value: "belum kawin" },
      { text: "Janda", value: "janda" },
      { text: "Duda", value: "duda" },
    ],
    itemsMU: [],
    itemsTA: [],
    itemsVillage: [],
    itemsTAForm: [],
    itemsVillageForm: [],
    valueMUForm: "",
    valueTAForm: "",
    valueVillageForm: "",
    valueFFcode: "",
    selectMUForm: "",
    selectTAForm: "",
    selectVillageForm: "",

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 5000,
    colorsnackbar: null,
    user_id: "",

    itemsfc: [],
    User: [],
    um_code: "",
    fc_no_selected: "",
    RoleAccesFilterShow: true,
    RoleAccesCRUDShow: true,
    RoleAccesCRUDDelete: true,
    localConfig: {
      programYear: "",
    },
  }),
  mounted() {
    this.firstAccessPage();
  },
  watch: {
    "localConfig.programYear": {
      handler(val) {
        this.initialize();
      },
    },
  },
  methods: {
    dialogsAction(dialog) {
      this.dialogs[dialog.name].show = dialog.status;
      if (dialog.name == "changeFF" && dialog.status == false)
        this.dialogs[dialog.name].id = "";
    },
    firstAccessPage() {
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.user_id = this.User.employee_no;
      this.fc_no_selected = this.User.fc.fc;
      this.typegetdata = this.User.fc.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.localConfig.programYear = this.$store.state.programYear.model;
      this.checkRoleAccess();
      this.initialize();
      this.getMU();
    },
    checkRoleAccess() {
      if (this.User.role_group == "IT") {
        this.RoleAccesCRUDShow = true;
        this.RoleAccesFilterShow = true;
        this.RoleAccesCRUDDelete = true;
        this.getFCAll();
      } else {
        if (this.User.role == "20") {
          this.um_code = this.User.um.um;
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesCRUDDelete = false;
          this.getEmpFCbyManager();
        } else {
          this.RoleAccesCRUDShow = false;
          this.RoleAccesFilterShow = true;
          this.RoleAccesCRUDDelete = false;
        }
      }
    },
    async initialize() {
      this.loadtable = true;
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetFieldFacilitatorAllWeb?fc_no=" +
            this.fc_no_selected +
            `&program_year=${this.localConfig.programYear}`,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result.data;
          this.loadtable = false;
        } else {
          console.log("Kosong");
          this.loadtable = false;
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.loadtable = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.dataobject = [];
          this.loadtable = false;
        }
      }
    },
    async getDetail(val, type) {
      this.load = true;
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetFieldFacilitatorDetail?id=" + val.id,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.length != 0) {
          if (type == "detail") {
            this.load = false;
          } else {
            this.valueMUForm = response.data.data.result.mu_no;
            this.valueTAForm = response.data.data.result.target_area;
          }
          this.defaultItem = Object.assign({}, response.data.data.result);
          this.datepicker = response.data.data.result.birthday;
          this.load = false;
          // this.dataobject = response.data.data.result.data;
        } else {
          console.log("Kosong");
          this.load = false;
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
          this.load = false;
        } else {
          // this.dataobject = [];
          this.load = false;
        }
      }
    },
    async getEmpFCbyManager() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetEmployeebyManager?manager_code=" +
            this.um_code +
            "&position=19",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsfc = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getFCAll() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetEmployeebyPosition?position_code=19",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsfc = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getMU() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetManagementUnit",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsMU = response.data.data.result;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getTA(val) {
      var valparam = "";
      if (val == "table") {
        valparam = this.valueMU;
      } else {
        valparam = this.valueMUForm;
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetTargetArea?mu_no=" + valparam,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          if (val == "table") {
            this.itemsTA = response.data.data.result;
          } else {
            this.itemsTAForm = response.data.data.result;
          }
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getVillage(val) {
      var valparam = "";
      if (val == "table") {
        valparam = this.valueTA;
      } else {
        valparam = this.valueTAForm;
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetDesa?kode_ta=" + valparam,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          if (val == "table") {
            this.itemsVillage = response.data.data.result;
          } else {
            this.itemsVillageForm = response.data.data.result;
          }
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async addData() {
      // console.log(this.defaultItem.id);
      const datapost = {
        fc_no: this.defaultItem.fc_no,
        name: this.defaultItem.name,
        birthday: this.datepicker,
        religion: this.defaultItem.religion,
        gender: this.defaultItem.gender,
        ktp_no: this.defaultItem.ktp_no,
        address: this.defaultItem.address,
        village: this.defaultItem.village,
        kecamatan: this.defaultItem.kecamatan,
        city: this.defaultItem.city,
        province: this.defaultItem.province,
        working_area: this.defaultItem.working_area,
        mu_no: this.defaultItem.mu_no,
        target_area: this.defaultItem.target_area,
        active: 1,
        marrital: this.defaultItem.marrital,
        join_date: "1999-01-01",
        phone: this.defaultItem.phone,
        post_code: this.defaultItem.post_code,
        bank_account: this.defaultItem.bank_account,
        bank_branch: this.defaultItem.bank_branch,
        bank_name: this.defaultItem.bank_name,
        user_id: this.user_id,
      };
      // console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddFieldFacilitator",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialog = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.initialize();
        } else {
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
        }
      }
    },
    async updateData() {
      // console.log(this.defaultItem.id);
      const datapost = {
        id: this.defaultItem.id,
        fc_no: this.defaultItem.fc_no,
        name: this.defaultItem.name,
        birthday: this.datepicker,
        religion: this.defaultItem.religion,
        gender: this.defaultItem.gender,
        ktp_no: this.defaultItem.ktp_no,
        address: this.defaultItem.address,
        village: this.defaultItem.village,
        kecamatan: this.defaultItem.kecamatan,
        city: this.defaultItem.city,
        province: this.defaultItem.province,
        working_area: this.defaultItem.working_area,
        mu_no: this.defaultItem.mu_no,
        target_area: this.defaultItem.target_area,
        active: 1,
        marrital: this.defaultItem.marrital,
        join_date: "1999-01-01",
        phone: this.defaultItem.phone,
        post_code: this.defaultItem.post_code,
        bank_account: this.defaultItem.bank_account,
        bank_branch: this.defaultItem.bank_branch,
        bank_name: this.defaultItem.bank_name,
        user_id: this.user_id,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateFieldFacilitator",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialog = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.initialize();
        } else {
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
        }
      }
    },
    async deleteData() {
      // console.log(this.defaultItem.id);
      const datapost = {
        id: this.defaultItem.id,
        user_id: this.user_id,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "DeleteFieldFacilitator",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialog = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.initialize();
        } else {
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
        }
      }
    },

    selectedMUForm(a) {
      console.log(a);
      this.valueMUForm = a;
      if (a != null) {
        this.getTA("form");
        this.valueTAForm = "";
        this.selectTAForm = "";
        this.selectVillageForm = "";
        this.valueVillageForm = "";
      } else {
        this.valueMUForm = "";
        this.valueTAForm = "";
        this.itemsTAForm = [];
        this.valueVillageForm = "";
        this.itemsVillageForm = [];
        this.defaultItem.mu_no = a;
      }
    },
    selectedTAForm(a) {
      console.log(a);
      this.valueTAForm = a;
      if (a != null) {
        this.getVillage("form");
        this.valueVillageForm = "";
        this.selectVillageForm = "";
        this.defaultItem.working_area = "";
      } else {
        this.valueTAForm = "";
        this.valueVillageForm = "";
        this.itemsVillageForm = [];
        this.defaultItem.working_area = "";
        this.defaultItem.target_area = a;
      }
    },
    selectedVillageForm(a) {
      console.log(a);
      this.valueVillageForm = a;
      this.defaultItem.working_area = a;
      if (a == null) {
        this.valueVillageForm = "";
        this.defaultItem.working_area = "";
      }
    },

    showDetail(item) {
      this.type = "Detail";
      console.log(item);
      this.dialogdetail = true;
      this.getDetail(item, "detail");
    },
    showAddModal() {
      this.dialogs.addEditFF.id = "";
      this.dialogs.addEditFF.show = true;
    },
    async editItem(item) {
      this.dialogs.addEditFF.id = item.id.toString();
      this.dialogs.addEditFF.show = true;
    },
    async editEmail(item){
      this.dialogs.editEmailFF.show = true;
      this.dialogs.editEmailFF.value = item.email
    },
    deleteItem(item) {
      console.log(item.id);
      this.defaultItem.id = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.deleteData();
    },
    close() {
      this.dialog = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    nonactivateFF(data) {
      this.dialogs.nonactivateConfirmation.show = true;
      this.dialogs.nonactivateConfirmation.model = [data.ff_no, 0];
    },
    activateFF(data) {
      this.dialogs.nonactivateConfirmation.show = true;
      this.dialogs.nonactivateConfirmation.model = [data.ff_no, 1];
    },
    async confirmNonactivate() {
      this.dialogs.nonactivateConfirmation.show = false;
      this.dialogdetail = false;
      this.$store.state.loadingOverlayText = "Nonactivate Field Facilitator...";
      this.$store.state.loadingOverlay = true;

      await axios
        .post(
          `${this.BaseUrlGet}NonactivateFieldFacilitator`,
          {
            ff_no: this.dialogs.nonactivateConfirmation.model[0],
            active: this.dialogs.nonactivateConfirmation.model[1],
          },
          {
            headers: {
              Authorization: `Bearer ${this.authtoken}`,
            },
          }
        )
        .then(() => {
          this.colorsnackbar = "green";
          this.textsnackbar = `${
            this.dialogs.nonactivateConfirmation.model[1]
              ? "Activate"
              : "Nonactivate"
          } FF success!`;
          this.initialize();
        })
        .catch((err) => {
          this.colorsnackbar = "red";
          this.textsnackbar = `${
            this.dialogs.nonactivateConfirmation.model[1]
              ? "Activate"
              : "Nonactivate"
          } FF failed!`;
          if (err.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        })
        .finally(() => {
          this.snackbar = true;
          this.timeoutsnackbar = 5000;
          this.$store.state.loadingOverlay = false;
          this.$store.state.loadingOverlayText = null;
        });
    },
    showSnackbar(text, color) {
      this.textsnackbar = text;
      this.colorsnackbar = color;
      this.snackbar = true;
    },
    swalActions(val) {
      this.initialize();
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        showCloseButton: true,
        timer: 10000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: val.type,
        title: val.message,
      });
    },
  },
};
</script>
