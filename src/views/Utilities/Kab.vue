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
      :footer-props="{
        itemsPerPageText :'Jumlah Data Per Halaman'
      }"
      class="rounded-xl elevation-6 mx-3 pa-1"
      data-aos="fade-up"
      data-aos-delay="200"
      @update:page="($p) => page = $p"
      @update:items-per-page="($p) => itemsPerPage = $p"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-xl">
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
          <v-divider class="mx-2"></v-divider>
          <v-btn dark rounded class="mb-2" @click="showAddModal()" color="green">
            <v-icon small>mdi-plus</v-icon> Tambah Data
          </v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="defaultItem.kabupaten_no"
                        label="Kab_No"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-select
                        v-model="defaultItem.province_code"
                        :items="itemsProvince"
                        item-value="province_code"
                        item-text="name"
                        label="Pilih Provinsi"
                        clearable
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="defaultItem.kab_code"
                        label="Kab_Code"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="defaultItem.namaKabupaten"
                        label="Nama Kabupaten"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Keluar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Simpan </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Apakah Anda Yakin Menghapus Data Ini?</v-card-title
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
        {{ (itemsPerPage * (page-1)) + index + 1 }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editItem(item)" color="warning">
          mdi-pencil
        </v-icon>
        <v-icon @click="deleteItem(item)" color="red"> mdi-delete </v-icon>
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
  name: "Kabupaten",
  data: () => ({
    page: 1,
    itemsPerPage: 10,
    itemsbr: [
      {
        text: "Utilities",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Provinsi",
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
    headers: [
      { text: "No", value: "no", width: '70' },
      { text: "Kabupaten/Kota", value: "namaKabupaten" },
      { text: "Kab_No", value: "kabupaten_no" },
      { text: "Kab_Code", value: "kab_code" },
      { text: "Nama Provinsi", value: "namaProvinsi" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    dataobject: [],
    itemsProvince: [],
    defaultItem: {
      id: "",
      namaProvinsi: "",
      province_code: null,
      namaKabupaten: "",
      kabupaten_no: "",
      kab_code: "",
    },
    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
  }),
  created() {
    this.authtoken = localStorage.getItem("token");
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.initialize();
  },

  methods: {
    async initialize() {
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
          this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.alerttoken = true;
        }
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
          this.BaseUrlGet + "DeleteKabupaten",
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
        kab_code: this.defaultItem.kab_code,
        province_code: this.defaultItem.province_code,
        name: this.defaultItem.namaKabupaten,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddKabupaten",
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
          this.textsnackbar = "Sukses menambahkan data";
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
        kab_code: this.defaultItem.kab_code,
        province_code: this.defaultItem.province_code,
        name: this.defaultItem.namaKabupaten,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateKabupaten",
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
    async getProv() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetProvinceAdmin", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsProvince = response.data.data.result;
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
      this.formTitle = "Tambah Data";
      this.getProv();
      this.defaultItem.id = "";
      this.defaultItem.province_code = null;
      this.defaultItem.kabupaten_no = "";
      this.defaultItem.kab_code = "";
      this.defaultItem.namaKabupaten = "";
      this.dialog = true;
    },
    editItem(item) {
      console.log(item);
      this.formTitle = "Edit Data";
      this.getProv();
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
    save() {
      if (
        this.defaultItem.province_code != null &&
        this.defaultItem.kabupaten_no.length != 0 &&
        this.defaultItem.kab_code.length != 0 &&
        this.defaultItem.namaKabupaten.length != 0
      ) {
        if (this.defaultItem.id) {
          console.log("edit");
          this.updateData();
        } else {
          console.log("add");
          this.addData();
        }
        this.close();
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Gagal Menambah, Kolom tidak boleh ada yang kosong";
      }
    },
  },
};
</script>