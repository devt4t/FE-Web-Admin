<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>
    <!-- Dialogs -->
      <!-- Confirmation -->
      <v-dialog v-model="dialogs.nonactivateConfirmation.show" max-width="500px" persistent content-class="rounded-lg" scrollable>
        <v-card class="rounded-xl" v-if="dialogs.nonactivateConfirmation.model">
          <v-card-title class="mb-1 headermodalstyle">
            <v-icon class="mr-2 white--text">mdi-help-circle</v-icon>
            <span>Confirmation</span>
            <v-divider dark class="mx-2"></v-divider>
            <v-icon color="red" @click="dialogs.nonactivateConfirmation.show = false">mdi-close-circle</v-icon>
          </v-card-title>
          <v-card-text>
            <h2 class="text-center pt-4">Do u want to {{ dialogs.nonactivateConfirmation.model[1] ? 'Activate' : 'Nonactivate' }} this FF?</h2>
            <v-row class="mt-10 align-center mb-0">
              <v-divider class="mx-2"></v-divider>
              <v-btn rounded color="red white--text mr-1" @click="dialogs.nonactivateConfirmation.show = false">
                  <v-icon class="mr-1">mdi-close-circle</v-icon>
                  Close
              </v-btn>
              <v-btn rounded color="green white--text ml-1" @click="confirmNonactivate">
                  <v-icon class="mr-1">mdi-check-circle</v-icon>
                  {{ dialogs.nonactivateConfirmation.model[1] ? 'Activate' : 'Nonactivate' }}
              </v-btn>
              <v-divider class="mx-2"></v-divider>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Change FF Modal -->
      <ChangeFFModal :show="dialogs.changeFF.show" @dialogAct="dialogsAction($event)" />

    <v-data-table
      :headers="headers"
      :items="dataobject"
      :search="search"
      :loading="loadtable"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1 mb-4"
    >
      <template v-slot:top>
        <v-toolbar flat rounded="xl">
          <v-text-field
            outlined
            rounded
            dense
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset></v-divider>
          <v-btn
            v-if="RoleAccesCRUDShow == true"
            dark
            rounded
            class="mb-2"
            @click="showAddModal()"
            color="green"
          >
            <v-icon small>mdi-plus</v-icon> Add Item
          </v-btn>
          <!-- Modal Add Edit -->
          <v-dialog v-model="dialog" max-width="800px" content-class="rounded-xl">
            <v-card>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-title class="mb-1 headermodalstyle">
                  <span class="">{{ formTitle }}</span>
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
                    <v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-select
                            v-model="defaultItem.fc_no"
                            :items="itemsfc"
                            item-text="name"
                            item-value="nik"
                            label="Pilih Field Coordinator"
                            outlined
                            clearable
                            :rules="rules"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="defaultItem.ktp_no"
                            label="No KTP"
                            outlined
                            :rules="rules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="defaultItem.name"
                            label="Nama"
                            outlined
                            :rules="rules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-select
                            v-model="defaultItem.mu_no"
                            :items="itemsMU"
                            item-text="name"
                            item-value="mu_no"
                            label="Management Unit"
                            outlined
                            clearable
                            :rules="rules"
                            v-on:change="selectedMUForm"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-select
                            v-model="defaultItem.target_area"
                            :items="itemsTAForm"
                            item-text="name"
                            item-value="area_code"
                            label="Target Area"
                            outlined
                            clearable
                            :rules="rules"
                            v-on:change="selectedTAForm"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-select
                            v-model="defaultItem.working_area"
                            :items="itemsVillageForm"
                            item-text="name"
                            item-value="kode_desa"
                            label="Working Area"
                            outlined
                            clearable
                            :rules="rules"
                            v-on:change="selectedVillageForm"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-menu v-model="menu2" transition="scale-transition">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="datepicker"
                                slot="activator"
                                label="Tanggal Lahir"
                                outlined
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="rules"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="datepicker"
                              @input="menu2 = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-select
                            v-model="defaultItem.religion"
                            :items="itemsagama"
                            item-text="text"
                            item-value="value"
                            label="Agama"
                            outlined
                            clearable
                            :rules="rules"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-select
                            v-model="defaultItem.gender"
                            :items="itemsgender"
                            item-text="text"
                            item-value="value"
                            label="Jenis Kelamin"
                            outlined
                            clearable
                            :rules="rules"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="defaultItem.phone"
                            label="No HP"
                            outlined
                            :rules="rules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="defaultItem.marrital"
                            :items="itemsmarrital"
                            item-text="text"
                            item-value="value"
                            label="Marrital Status"
                            outlined
                            clearable
                            :rules="rules"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            v-model="defaultItem.address"
                            label="Alamat"
                            outlined
                            rows="3"
                            :rules="rules"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="defaultItem.village"
                            label="Desa"
                            outlined
                            :rules="rules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="defaultItem.post_code"
                            label="Kode Pos"
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="defaultItem.kecamatan"
                            label="Kecamatan"
                            outlined
                            :rules="rules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="defaultItem.city"
                            label="Kab/Kota"
                            outlined
                            :rules="rules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="defaultItem.province"
                            label="Provinsi"
                            outlined
                            :rules="rules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="defaultItem.bank_account"
                            label="Akun Bank"
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="defaultItem.bank_name"
                            label="Bank Name"
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="defaultItem.bank_branch"
                            label="Bank Branch"
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions v-if="load == false">
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- dialog detail -->
          <v-dialog v-model="dialogdetail" max-width="700px" content-class="rounded-xl" scrollable>
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
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>FF Number</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.ff_no }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>No KTP</h5>
                        <h3 class="ml-2">{{ defaultItem.ktp_no }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Nama FF</h5>
                        <h3 class="ml-2">{{ defaultItem.name }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Alamat FF</h5>
                        <h3 class="ml-2">{{ defaultItem.address }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Desa</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.village }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="8">
                      <div>
                        <h5>Kode Pos</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.post_code }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Kecamatan</h5>
                        <h3 class="ml-2">{{ defaultItem.kecamatan }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Kabupaten/Kota</h5>
                        <h3 class="ml-2">{{ defaultItem.city }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Provinsi</h5>
                        <h3 class="ml-2">{{ defaultItem.province }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Working Area</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.namaWorkingArea }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Target Area</h5>
                        <h3 class="ml-2">{{ defaultItem.namaTA }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Management Unit</h5>
                        <h3 class="ml-2">{{ defaultItem.namaMU }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>No Hp</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.phone }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Jenis Kelamin</h5>
                        <h3 class="ml-2">{{ defaultItem.gender }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Agama</h5>
                        <h3 class="ml-2">{{ defaultItem.religion }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Tanggal Lahir</h5>
                        <h3 class="ml-2">{{ defaultItem.birthday }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Status Perkawinan</h5>
                        <h3 class="ml-2">{{ defaultItem.marrital }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Akun Bank</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.bank_account }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Bank Branch</h5>
                        <h3 class="ml-2">{{ defaultItem.bank_branch }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Bank Name</h5>
                        <h3 class="ml-2">{{ defaultItem.bank_name }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                  <v-divider class="mx-2"></v-divider>
                  <v-btn v-if="defaultItem.active == 1" rounded color="red white--text" class="px-5" @click="nonactivateFF(defaultItem)">
                    <v-icon class="mr-1">mdi-account-off</v-icon>
                    Nonactivate
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
                    Activate
                  </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- dialog delete -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- Status Column -->
      <template v-slot:item.active="{item}">
        <v-chip :color="`${item.active ? 'green' : 'red'} white--text`">
          {{ item.active ? 'Active' : 'Nonactive' }}
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
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" color="dark">
              mdi-arrow-down-drop-circle
            </v-icon>
          </template>

          <v-list class="d-flex flex-column align-stretch">
            <v-list-item>
              <v-btn
                dark
                rounded
                @click="showDetail(item)"
                color="info"
                block
              >
              <v-icon class="mr-1" @click="showDetail(item)" small color="white">
                  mdi-information-outline
              </v-icon>
                Detail
              </v-btn>
            </v-list-item>
            <v-list-item v-if="(RoleAccesCRUDShow == true && item.validation != 1 && (User.role_name == 'UNIT MANAGER' || User.role_name == 'REGIONAL MANAGER')) || User.role_group == 'IT'">
              <v-btn
                vi
                dark
                block
                rounded
                @click="editItem(item)"
                color="warning"
              >
              <v-icon class="mr-1" small color="white">
                mdi-pencil
              </v-icon>
                Edit
              </v-btn>
            </v-list-item>
            <v-list-item v-if="(RoleAccesCRUDDelete == true || User.role_group == 'IT' ) && item.active != 1">
              <v-btn
                dark
                rounded
                @click="deleteItem(item)"
                color="red"
                block
              >
              <v-icon class="mr-1" small color="white">
                mdi-delete
              </v-icon>
                Delete
              </v-btn>
            </v-list-item>
            <v-list-item v-if="User.role_group == 'IT' && item.active == 1">
              <v-btn
                dark
                rounded
                @click="nonactivateFF(item)"
                color="red white--text"
              >
              <v-icon class="mr-1" small color="white">
                mdi-account-off
              </v-icon>
                Nonactivate
              </v-btn>
            </v-list-item>
            <v-list-item v-if="User.role_group == 'IT' && item.active == 0">
              <v-btn
                dark
                rounded
                @click="activateFF(item)"
                color="green white--text"
              >
              <v-icon class="mr-1" small color="white">
                mdi-account-check
              </v-icon>
                Activate
              </v-btn>
            </v-list-item>
            <v-list-item v-if="User.role_group == 'IT'">
              <v-btn
                dark
                rounded
                @click="() => {dialogs.changeFF.show = true}"
                color="red white--text"
                block
              >
              <v-icon class="mr-1" small color="white">
                mdi-account-convert
              </v-icon>
                Change FC
              </v-btn>
            </v-list-item>
          </v-list>
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
import ChangeFFModal from "./components/FF/ChangeFFModal.vue"

export default {
  name: "FieldFacilitator",
  components: { ChangeFFModal },
  data: () => ({
    dialogs: {
      changeFF: {
        show: false,
      },
      nonactivateConfirmation: {
        show: false,
        model: null,
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
    formTitle: "Add Item",
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
      { text: "FF Name", value: "namaFF" },
      { text: "FC Name", value: "namaFC" },
      { text: "MU", value: "mu_name" },
      { text: "TA", value: "ta_name" },
      { text: "Village", value: "village_name" },
      { text: "Status", value: "active", align: 'center' },
      { text: "Actions", value: "actions", sortable: false, align: 'right' },
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
      active: ''
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
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    user_id: "",

    itemsfc: [],
    User: [],
    um_code: "",
    fc_no_selected: "",
    RoleAccesFilterShow: true,
    RoleAccesCRUDShow: true,
    RoleAccesCRUDDelete: true,
  }),
  created() {
    this.firstAccessPage();
  },
  methods: {
    dialogsAction(dialog) {
      this.dialogs[dialog.name].show = dialog.status
    },
    firstAccessPage() {
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.user_id = this.User.employee_no;
      this.fc_no_selected = this.User.fc.fc;
      this.typegetdata = this.User.fc.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
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
            this.fc_no_selected,
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
      console.log(datapost);
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
      this.load = false;
      this.defaultItem.id = "";
      this.defaultItem.name = "";
      this.defaultItem.ktp_no = "";
      this.defaultItem.fc_no = "";
      this.defaultItem.birthday = "";
      this.defaultItem.gender = "";
      this.defaultItem.religion = "";
      this.defaultItem.post_code = "";
      this.defaultItem.village = "";
      this.defaultItem.kecamatan = "";
      this.defaultItem.city = "";
      this.defaultItem.province = "";
      this.defaultItem.address = "";
      this.defaultItem.mu_no = "";
      this.defaultItem.target_area = "";
      this.defaultItem.working_area = "";
      this.defaultItem.bank_account = "";
      this.defaultItem.bank_branch = "";
      this.defaultItem.bank_name = "";
      this.defaultItem.marrital = "";
      this.defaultItem.phone = "";

      this.formTitle = "Add Item";
      this.dialog = true;
    },
    async editItem(item) {
      console.log(item);
      this.dialog = true;
      await this.getDetail(item, "edit");
      await this.getTA("form");
      await this.getVillage("form");
      this.formTitle = "Edit Item";
    },

    save() {
      this.$refs.form.validate();

      if (
        this.defaultItem.ktp_no.length != 0 &&
        this.defaultItem.name.length != 0 &&
        // this.datepicker.length != 0 &&
        // this.defaultItem.birthday.length != 0 &&
        this.defaultItem.religion != null &&
        this.defaultItem.address.length != 0 &&
        this.defaultItem.village.length != 0 &&
        this.defaultItem.village.length != 0 &&
        this.defaultItem.village.length != 0 &&
        this.defaultItem.village.length != 0 &&
        this.defaultItem.marrital != null &&
        this.defaultItem.phone.length != 0 &&
        this.defaultItem.gender != null &&
        this.defaultItem.mu_no != null &&
        this.defaultItem.fc_no != null &&
        this.defaultItem.target_area != null &&
        this.defaultItem.working_area != null
      ) {
        if (this.defaultItem.id) {
          console.log("testupdate");
          console.log(this.datepicker);
          this.updateData();
        } else {
          if (this.defaultItem.ktp_no) {
            console.log("testadd");
            console.log(this.datepicker);
            this.addData();
          }
        }
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Gagal Simpan, Kolom required tidak boleh ada yang kosong";
      }
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
      this.dialogs.nonactivateConfirmation.show = true
      this.dialogs.nonactivateConfirmation.model = [data.ff_no, 0]
    },
    activateFF(data) {
      this.dialogs.nonactivateConfirmation.show = true
      this.dialogs.nonactivateConfirmation.model = [data.ff_no, 1]
    },
    async confirmNonactivate () {
      this.dialogs.nonactivateConfirmation.show = false
      this.dialogdetail = false
      this.$store.state.loadingOverlayText = 'Nonactivate Field Facilitator...'
      this.$store.state.loadingOverlay = true
      
      await axios.post(`${this.BaseUrlGet}NonactivateFieldFacilitator`, 
        {
          ff_no: this.dialogs.nonactivateConfirmation.model[0], 
          active: this.dialogs.nonactivateConfirmation.model[1]
        }, 
        { headers: {
          Authorization: `Bearer ${this.authtoken}`
        }
      }).then(() => {
        this.colorsnackbar = 'green'
        this.textsnackbar = `${this.dialogs.nonactivateConfirmation.model[1] ? 'Activate' : 'Nonactivate'} FF success!`
        this.initialize()
      }).catch((err) => {
        this.colorsnackbar = 'red'
        this.textsnackbar = `${this.dialogs.nonactivateConfirmation.model[1] ? 'Activate' : 'Nonactivate'} FF failed!`
        if (err.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }).finally(() => {
          this.snackbar = true
          this.timeoutsnackbar = 5000
          this.$store.state.loadingOverlay = false
          this.$store.state.loadingOverlayText = null
      })
    }
  },
};
</script>