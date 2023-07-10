<template>
  <div>
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
      data-aos="fade-right"
    ></v-breadcrumbs>
    <!-- DIALOGS -->
    <!-- Modal Add Edit -->
    <v-dialog v-model="dialog" max-width="800px" content-class="rounded-xl">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title class="mb-1 headermodalstyle">
            <span class=""
              ><v-icon class="mr-2" color="white">mdi-account-details</v-icon
              >{{ formTitle }}</span
            >
          </v-card-title>

          <v-card-text>
            <!-- Loading -->
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
                  color="green"
                >
                </v-progress-circular>
              </v-layout>
            </v-container>
            <!-- Form Content -->
            <v-container v-if="load == false">
              <v-row>
                <!-- position -->
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    clearable
                    v-model="defaultItem.position_no"
                    :items="itemsposition"
                    item-text="name"
                    item-value="position_no"
                    label="Posisi Karyawan"
                    placeholder="Pilih satu..."
                    :rules="rules"
                  ></v-autocomplete>
                </v-col>
                <!-- name -->
                <v-col cols="12" sm="8" md="8">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.name"
                    label="Nama"
                    placeholder="Nama lengkap..."
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <!-- alias -->
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.alias"
                    label="Alias"
                    placeholder="Panggilan..."
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <!-- employee id -->
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.nik"
                    label="No ID Karyawan"
                    placeholder="9999"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <!-- nik / no ktp -->
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.ktp_no"
                    label="No KTP / NIK"
                    maxlength="16"
                    :rules="rules"
                  >
                    <template v-slot:append>
                      <div class="mt-1">
                        {{ `${defaultItem.ktp_no.length}/16` }}
                      </div>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.birthplace"
                    label="Tempat Lahir"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-menu
                    v-model="menu2"
                    transition="scale-transition"
                    content-class="rounded-xl"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        hide-details
                        rounded
                        dense
                        color="success"
                        v-model="datepicker"
                        slot="activator"
                        label="Tanggal Lahir"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="green"
                      v-model="datepicker"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.blood_type"
                    :items="itemsblood_type"
                    item-text="text"
                    item-value="value"
                    label="Gol Darah"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.religion"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Agama"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.gender"
                    :items="itemsgender"
                    item-text="text"
                    item-value="value"
                    label="Jenis Kelamin"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.marrital"
                    :items="itemsmarrital"
                    item-text="text"
                    item-value="value"
                    label="Marrital Status"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.phone"
                    label="No HP"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    type="email"
                    color="success"
                    v-model="defaultItem.email"
                    label="Email"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.npwp"
                    label="NPWP"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.bpjs_kesehatan_no"
                    label="bpjs Kesehatan No"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.bpjs_tenagakerja_no"
                    label="bpjs Tenagakerja No"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.address"
                    label="Alamat"
                    rows="3"
                    :rules="rules"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.kelurahan"
                    label="Desa"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.zipcode"
                    label="Kode Pos"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.kecamatan"
                    label="Kecamatan"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.city"
                    label="Kab/Kota"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.province"
                    label="Provinsi"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.bank_account"
                    label="Akun Bank"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.bank_name"
                    label="Bank Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.bank_branch"
                    label="Bank Branch"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions v-if="load == false">
            <v-btn color="red" rounded text @click="close">
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              class="px-5"
              rounded
              outlined
              @click="save"
              ><v-icon class="mr-1">mdi-content-save</v-icon> Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- dialog detail -->
    <v-dialog v-model="dialogdetail" max-width="700px">
      <v-card>
        <v-card-title class="mb-1 headermodalstyle">
          <span class="headline">Detail Employee</span>
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
                  <h5>NIK</h5>
                  <h3 class="ml-2">
                    {{ defaultItem.nik }}
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
                  <h5>Nama</h5>
                  <h3 class="ml-2">{{ defaultItem.name }}</h3>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <div>
                  <h5>Alamat</h5>
                  <h3 class="ml-2">{{ defaultItem.address }}</h3>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <div>
                  <h5>Desa</h5>
                  <h3 class="ml-2">
                    {{ defaultItem.kelurahan }}
                  </h3>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="8">
                <div>
                  <h5>Kode Pos</h5>
                  <h3 class="ml-2">
                    {{ defaultItem.zipcode }}
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
              <v-col cols="12" sm="12" md="4">
                <div>
                  <h5>NPWP</h5>
                  <h3 class="ml-2">
                    {{ defaultItem.npwp }}
                  </h3>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <div>
                  <h5>bpjs Kesehatan No</h5>
                  <h3 class="ml-2">
                    {{ defaultItem.bpjs_kesehatan_no }}
                  </h3>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <div>
                  <h5>bpjs Tenagakerja No</h5>
                  <h3 class="ml-2">
                    {{ defaultItem.bpjs_tenagakerja_no }}
                  </h3>
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
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Eport Dialog -->
    <ExportModal
      :show="showExportModal"
      :data="dataobject"
      @close="() => (showExportModal = false)"
    />

    <!-- MAIN TABLE -->
    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      :headers="headers"
      :items="dataobject"
      :search="search"
      :loading="loadtable"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1"
      @update:page="($p) => (page = $p)"
      @update:items-per-page="($p) => (itemsPerPage = $p)"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-xl">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            placeholder="Search..."
            hide-details
            dense
            rounded
            outlined
            color="green"
            style="max-width: 350px;"
          ></v-text-field>
          <v-divider class="mx-2"></v-divider>
          <v-btn
            v-if="$store.state.User.email == 'iyas.muzani@trees4trees.org'"
            rounded
            color="green white--text"
            :disabled="loadtable"
            @click="() => (showExportModal = true)"
            class="mr-1"
            ><v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export
            Excel</v-btn
          >
          <v-btn dark rounded @click="showAddModal()" color="blue">
            <v-icon small>mdi-plus</v-icon> Add Item
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.no="{ index }">
        {{ itemsPerPage * (page - 1) + index + 1 }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-3" @click="showDetail(item)" small color="info">
          mdi-information-outline
        </v-icon>
        <v-icon
          v-if="RoleAccesCRUDShow == true"
          class="mr-2"
          @click="editItem(item)"
          color="warning"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="RoleAccesCRUDDelete == true"
          @click="deleteItem(item)"
          color="red"
        >
          mdi-delete
        </v-icon>
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
import ExportModal from "./components/Employee/ExportModal.vue";

export default {
  name: "Employee",
  components: {
    ExportModal,
  },
  data: () => ({
    showExportModal: false,
    page: 1,
    itemsPerPage: 10,
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
        text: "Employee",
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
      { text: "No", value: "no", width: "70" },
      // { text: "ID", value: "id" },
      { text: "ID Karyawan", value: "nik" },
      { text: "Nama", value: "name" },
      { text: "No KTP", value: "ktp_no" },
      { text: "Position", value: "emp_position" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    dataobject: [],
    defaultItem: {
      id: "",
      nik: "",
      zipcode: "",
      birthplace: "",
      position_no: "",
      alias: "",
      email: "",
      npwp: "",
      bpjs_kesehatan_no: "",
      bpjs_tenagakerja_no: "",
      blood_type: "",
      address: "",
      bank_account: "",
      bank_branch: "",
      bank_name: "",
      birthday: "",
      city: "",
      gender: "",
      join_date: "",
      kecamatan: "",
      ktp_no: "",
      marrital: "",
      name: "",
      phone: "",
      post_code: "",
      province: "",
      religion: "",
      target_area: "",
      user_id: "",
      kelurahan: "",
      working_area: "",
    },
    itemsgender: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" },
    ],
    itemsagama: [
      { text: "Islam", value: "islam" },
      { text: "Kristen", value: "kristen" },
      { text: "Khatolik", value: "khatolik" },
      { text: "Hindu", value: "hindu" },
      { text: "Budha", value: "budha" },
    ],
    itemsmarrital: [
      { text: "Kawin", value: "KAWIN" },
      { text: "Belum Kawin", value: "BELUM KAWIN" },
      { text: "Janda", value: "JANDA" },
      { text: "Duda", value: "DUDA" },
    ],
    itemsblood_type: [
      { text: "-", value: "-" },
      { text: "O", value: "O" },
      { text: "A", value: "A" },
      { text: "AB", value: "AB" },
      { text: "B", value: "B" },
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

    itemsposition: [],
  }),
  created() {
    this.firstAccessPage();
  },
  methods: {
    firstAccessPage() {
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.user_id = this.User.employee_no;
      this.fc_no_selected = this.User.fc.fc;
      this.typegetdata = this.User.fc.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.checkRoleAccess();
      this.initialize();
      this.GetJobPosition();
    },
    checkRoleAccess() {
      if (this.User.role_group == "IT") {
        this.RoleAccesCRUDShow = true;
        this.RoleAccesFilterShow = true;
        this.RoleAccesCRUDDelete = true;
        // this.getFCAll();
      } else {
        if (this.User.role == "20") {
          this.um_code = this.User.um.um;
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesCRUDDelete = false;
          // this.getEmpFCbyManager();
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
        const response = await axios.get(this.BaseUrlGet + "GetEmployeeAll?", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
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
    async GetJobPosition() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetJobPosition", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsposition = response.data.data.result.data;
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
      this.defaultItem.birthday = this.datepicker;
      const datapost = this.defaultItem;
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddEmployee",
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
      this.defaultItem.birthday = this.datepicker;
      const datapost = this.defaultItem;
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "EditEmployee",
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
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "DeleteEmployee",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialogDelete = false;
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

    showDetail(item) {
      this.type = "Detail";
      console.log(item);
      // this.defaultItem = item;

      this.defaultItem = Object.assign({}, item);
      console.log(this.defaultItem);
      this.dialogdetail = true;
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
      this.defaultItem.zipcode = "";
      this.defaultItem.birthplace = "";
      this.defaultItem.nik = "";
      this.defaultItem.position_no = "";
      this.defaultItem.alias = "";
      this.defaultItem.email = "";
      this.defaultItem.npwp = "";
      this.defaultItem.bpjs_kesehatan_no = "";
      this.defaultItem.bpjs_tenagakerja_no = "";
      this.defaultItem.blood_type = "";

      this.formTitle = "Add Item";
      this.dialog = true;
    },
    async editItem(item) {
      console.log(item);
      this.dialog = true;
      this.defaultItem = Object.assign({}, item);
      this.datepicker = item.birthday;
      this.formTitle = "Edit Item";
    },

    save() {
      this.$refs.form.validate();

      if (
        this.defaultItem.ktp_no.length != 0 &&
        this.defaultItem.nik.length != 0 &&
        this.defaultItem.name.length != 0 &&
        // this.datepicker.length != 0 &&
        // this.defaultItem.birthday.length != 0 &&
        this.defaultItem.religion != null &&
        this.defaultItem.gender != null &&
        this.defaultItem.blood_type != null &&
        this.defaultItem.address.length != 0 &&
        this.defaultItem.kelurahan.length != 0 &&
        this.defaultItem.kecamatan.length != 0 &&
        this.defaultItem.province.length != 0 &&
        this.defaultItem.city.length != 0 &&
        this.defaultItem.marrital != null &&
        this.defaultItem.phone.length != 0 &&
        this.defaultItem.email.length != 0 &&
        this.defaultItem.position_no.length != 0 &&
        this.defaultItem.alias.length != 0 &&
        this.defaultItem.npwp.length != 0 &&
        this.defaultItem.bpjs_kesehatan_no.length != 0 &&
        this.defaultItem.bpjs_tenagakerja_no.length != 0 &&
        this.defaultItem.birthplace.length != 0 &&
        this.defaultItem.zipcode.length != 0
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
  },
};
</script>
