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

    <v-data-table
      :headers="headers"
      :items="dataobject"
      :search="search"
      :loading="tableLoading"
      :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman',
      }"
      class="rounded-xl elevation-6 mx-3 pa-1"
      data-aos="fade-up"
      data-aos-delay="200"
      @update:page="($p) => (page = $p)"
      @update:items-per-page="($p) => (itemsPerPage = $p)"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-xl">
          <!-- Program Year -->
          <v-select
            color="success"
            item-color="success"
            v-model="localConfig.programYear"
            :items="['Semua', ...$store.state.programYear.options]"
            :disabled="tableLoading"
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
            label="Tahun program"
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
            style="max-width: 350px"
          ></v-text-field>
          <v-divider class="mx-2"></v-divider>
          <v-btn
            dark
            rounded
            class="mb-2"
            @click="showAddModal()"
            color="green"
            v-if="$_sys.isAllowed('target-area-create')"
          >
            <v-icon small>mdi-plus</v-icon> Tambah Data
          </v-btn>
          <v-dialog
            v-model="dialog"
            max-width="500px"
            content-class="rounded-xl"
          >
            <v-card class="white">
              <v-card-title class="px-3">
                <v-spacer></v-spacer>
                <span class="">{{ formTitle }}</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <!-- combobox -->
                      <v-combobox
                        dense
                        multiple
                        color="success"
                        hide-details
                        small-chips
                        hide-selected
                        item-color="success"
                        :items="$store.state.programYear.options"
                        label="Tahun Program"
                        :menu-props="{
                          rounded: 'xl',
                          transition: 'slide-y-transition',
                        }"
                        outlined
                        rounded
                        v-model="defaultItem.program_year"
                      >
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>
                                No results matching. Press <kbd>enter</kbd> to
                                create a new one
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <template
                          v-slot:selection="{ attrs, item, parent, selected }"
                        >
                          <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            label
                            small
                            class="rounded-pill"
                          >
                            <span class="pr-2">
                              {{ item }}
                            </span>
                            <v-icon small @click="parent.selectItem(item)">
                              mdi-close-circle
                            </v-icon>
                          </v-chip>
                        </template>
                      </v-combobox>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-autocomplete
                        dense
                        hide-details
                        outlined
                        rounded
                        v-model="defaultItem.mu_no"
                        :items="optionsMUModal"
                        item-value="mu_no"
                        item-text="name"
                        label="Pilih Management Unit"
                        color="green"
                        item-color="green"
                        clearable
                        :menu-props="{
                          rounded: 'xl',
                          transition: 'slide-y-transition',
                        }"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-autocomplete
                        dense
                        hide-details
                        outlined
                        rounded
                        v-model="defaultItem.kabupaten_no"
                        :items="itemsKab"
                        item-value="kabupaten_no"
                        item-text="namaKabupaten"
                        label="Pilih Kabupaten"
                        color="green"
                        item-color="green"
                        clearable
                        :menu-props="{
                          rounded: 'xl',
                          transition: 'slide-y-transition',
                        }"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        dense
                        rounded
                        outlined
                        hide-details
                        color="green"
                        v-model="defaultItem.namaTa"
                        label="Nama Target Area"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        dense
                        rounded
                        outlined
                        hide-details
                        color="green"
                        v-model="defaultItem.luas"
                        label="Luas Area"
                        type="number"
                      >
                        <template v-slot:append>
                          <div class="mt-1 ml-1">m<sup>2</sup></div>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="red darken-1" text rounded @click="close">
                  <v-icon class="mr-1">mdi-close-circle</v-icon>
                  Keluar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="green white--text"
                  rounded
                  @click="save"
                  class=""
                  :disabled="saveDisabled"
                >
                  <v-icon class="mr-1">mdi-content-save</v-icon>
                  Simpan
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Apa Anda Yakin Menghapus Data Ini?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Keluar</v-btn
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
      <template v-slot:item.no="{ index }">
        {{ itemsPerPage * (page - 1) + index + 1 }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="mr-2"
          @click="editItem(item)"
          color="warning"
          v-if="$_sys.isAllowed('target-area-update')"
        >
          mdi-pencil
        </v-icon>
        <!-- <v-icon @click="deleteItem(item)" color="red"> mdi-delete </v-icon> -->
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
  name: "TargetArea",
  data: () => ({
    config: {
      permission: {
        read: "target-area-list",
      },
    },
    page: 1,
    itemsPerPage: 10,
    itemsbr: [
      {
        text: "Utilities",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Target Area",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    formTitle: "Tambah Data",
    value: "add",
    dialog: false,
    dialogDelete: false,
    search: "",
    authtoken: "",
    BaseUrlGet: "",
    tableLoading: false,
    headers: [
      { text: "No", value: "no", width: "70" },
      { text: "Area Code", value: "area_code" },
      { text: "Target Area", value: "namaTa" },
      { text: "Management Unit", value: "namaMu" },
      { text: "Kabupaten/Kota", value: "namaKabupaten" },
      { text: "Tahun Program", value: "program_year" },
      { text: "Actions", value: "actions", sortable: false, align: "right" },
    ],
    dataobject: [],
    itemsMu: [],
    itemsKab: [],
    defaultItem: {
      id: "",
      program_year: [],
      area_code: "",
      namaTa: "",
      luas: "",
      namaMu: "",
      mu_no: "",
      namaProvince: "",
      province_code: "",
      namaKabupaten: "",
      kabupaten_no: "",
    },
    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    localConfig: {
      programYear: "",
    },
  }),
  mounted() {
    this.authtoken = localStorage.getItem("token");
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.localConfig.programYear = this.$store.state.programYear.model;
    this.initialize();
  },
  computed: {
    saveDisabled() {
      if (!this.defaultItem.mu_no) return true;
      if (!this.defaultItem.program_year) return true;
      if (!this.defaultItem.kabupaten_no) return true;
      if (!this.defaultItem.namaTa) return true;
      return false;
    },
    optionsMUModal() {
      const items = this.itemsMu
        .map((val) => {
          if (val.program_year && this.defaultItem.program_year)
            if (
              this.defaultItem.program_year.every((pro) =>
                val.program_year.split(",").includes(pro)
              )
            )
              return val;
          return null;
        })
        .filter((n) => n);
      if (this.defaultItem.program_year)
        if (!items.find((val) => val.mu_no == this.defaultItem.mu_no))
          this.defaultItem.mu_no = "";
      return items;
    },
  },
  watch: {
    "localConfig.programYear": {
      handler(val) {
        this.initialize();
      },
    },
  },
  methods: {
    async initialize() {
      try {
        this.tableLoading = true;
        const response = await axios.get(
          this.BaseUrlGet +
            `GetTargetAreaAdmin?program_year=${this.localConfig.programYear}`,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result.map((val) => {
            return {
              ...val,
              program_year: val.program_year ? val.program_year.split(",") : [],
            };
          });
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.alerttoken = true;
        }
      } finally {
        this.tableLoading = false;
      }
    },
    async verifDelete() {
      const datapost = {
        id: this.defaultItem.id,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "DeleteTargetArea",
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
          this.textsnackbar = "Sukses hapus data";
          this.initialize();
        } else {
          this.dialogDelete = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialogDelete = false;
        }
      }
    },
    async addData() {
      const datapost = {
        kabupaten_no: this.defaultItem.kabupaten_no,
        program_year: this.defaultItem.program_year
          .sort((a, b) => {
            return a - b;
          })
          .toString(),
        mu_no: this.defaultItem.mu_no,
        name: this.defaultItem.namaTa,
        luas: this.defaultItem.luas,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddTargetArea",
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
          this.textsnackbar = "Sukses tambah data";
          this.initialize();
        } else {
          this.dialog = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = false;
        }
      }
    },
    async updateData() {
      const datapost = {
        id: this.defaultItem.id,
        kabupaten_no: this.defaultItem.kabupaten_no,
        program_year: this.defaultItem.program_year
          .sort((a, b) => {
            return a - b;
          })
          .toString(),
        mu_no: this.defaultItem.mu_no,
        name: this.defaultItem.namaTa,
        luas: this.defaultItem.luas,
        active: 1,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateTargetArea",
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
          this.textsnackbar = "Sukses ubah data";
          this.initialize();
        } else {
          this.dialog = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = false;
        }
      }
    },
    async getKab() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetKabupatenAdmin",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsKab = response.data.data.result.sort((a, b) =>
            a.namaKabupaten.localeCompare(b.namaKabupaten)
          );
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error);
        // if (error.response.status == 401) {
        //   this.alerttoken = true;
        // }
      }
    },
    async getMu() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetManagementUnitAdmin",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsMu = response.data.data.result.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error);
        // if (error.response.status == 401) {
        //   this.alerttoken = true;
        // }
      }
    },

    showAddModal() {
      this.value = "add";
      this.formTitle = "Tambah Target Area";
      this.getKab();
      this.getMu();
      this.defaultItem.id = "";
      if (this.localConfig.programYear != "Semua")
        this.defaultItem.program_year = [this.localConfig.programYear];
      else this.defaultItem.program_year = [];
      this.defaultItem.kabupaten_no = null;
      this.defaultItem.mu_no = null;
      this.defaultItem.namaTa = "";
      this.defaultItem.area_code = "";
      this.defaultItem.luas = "";
      this.dialog = true;
    },
    editItem(item) {
      console.log(item);
      this.formTitle = "Edit Data";
      this.getKab();
      this.getMu();
      this.defaultItem = Object.assign({}, item);
      this.value = "edit";
      this.dialog = true;
    },
    deleteItem(item) {
      this.defaultItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.closeDelete();
      this.verifDelete();
    },
    close() {
      this.dialog = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    async save() {
      try {
        this.dialog = false;
        this.$store.state.loadingOverlay = true;
        this.$store.state.loadingOverlayText = "Loading...";
        if (
          this.defaultItem.kabupaten_no != null &&
          this.defaultItem.mu_no != null &&
          this.defaultItem.namaTa.length != 0 &&
          this.defaultItem.luas.length != 0
        ) {
          if (this.defaultItem.id) {
            console.log("edit");
            await this.updateData();
          } else {
            console.log("add");
            await this.addData();
          }
          this.close();
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar =
            "Gagal Menambah, Kolom tidak boleh ada yang kosong";
        }
      } finally {
        this.$store.state.loadingOverlay = false;
      }
    },
  },
};
</script>
