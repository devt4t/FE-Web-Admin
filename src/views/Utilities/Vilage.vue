<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <v-data-table
      :headers="headers"
      :items="dataobject"
      :search="search"
      class="rounded elevation-6 mx-3 pa-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn dark class="mb-2" @click="showAddModal()" color="green">
            <v-icon small>mdi-plus</v-icon> Add Item
          </v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="defaultItem.kode_kecamatan"
                        :items="itemsKab"
                        item-value="kode_kecamatan"
                        item-text="namaKecamatan"
                        label="Pilih Kecamatan"
                        clearable
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="defaultItem.area_code"
                        :items="itemsTa"
                        item-value="area_code"
                        item-text="namaTa"
                        label="Pilih Target Area"
                        clearable
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="defaultItem.kode_desa"
                        label="Kode_Desa"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="defaultItem.namaDesa"
                        label="Nama Desa"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="defaultItem.post_code"
                        label="Kode Pos"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
  name: "Vilage",
  data: () => ({
    itemsbr: [
      {
        text: "Utilities",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Vilage",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    formTitle: "Add Item",
    value: "add",
    dialog: false,
    dialogDelete: false,
    search: "",
    authtoken: "",
    BaseUrlGet: "",
    headers: [
      { text: "ID", value: "id" },
      { text: "Desa", value: "namaDesa" },
      { text: "Kode_Desa", value: "kode_desa" },
      { text: "Kecamatan", value: "namaKecamatan" },
      { text: "Target Area", value: "namaTa" },
      { text: "Kode Pos", value: "post_code" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    dataobject: [],
    itemsKab: [],
    itemsTa: [],
    defaultItem: {
      id: "",
      kode_desa: "",
      namaDesa: "",
      kode_kecamatan: "",
      namaKecamatan: "",
      area_code: "",
      namaTa: "",
      post_code: "",
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
        const response = await axios.get(this.BaseUrlGet + "GetDesaAdmin", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
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
          this.BaseUrlGet + "DeleteDesa",
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
        kode_ta: this.defaultItem.area_code,
        kode_kecamatan: this.defaultItem.kode_kecamatan,
        kode_desa: this.defaultItem.kode_desa,
        post_code: this.defaultItem.post_code,
        name: this.defaultItem.namaDesa,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddDesa",
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
        kode_ta: this.defaultItem.area_code,
        kode_kecamatan: this.defaultItem.kode_kecamatan,
        kode_desa: this.defaultItem.kode_desa,
        post_code: this.defaultItem.post_code,
        name: this.defaultItem.namaDesa,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateDesa",
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
    async getKec() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetKecamatanAdmin",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsKab = response.data.data.result;
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
    async getTa() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetTargetAreaAdmin",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsTa = response.data.data.result;
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
      this.formTitle = "Add Item";
      this.getKec();
      this.getTa();
      this.defaultItem.id = "";
      this.defaultItem.area_code = null;
      this.defaultItem.kode_kecamatan = null;
      this.defaultItem.kode_desa = "";
      this.defaultItem.namaDesa = "";
      this.defaultItem.post_code = "";
      this.dialog = true;
    },
    editItem(item) {
      console.log(item);
      this.formTitle = "Edit Item";
      this.getKec();
      this.getTa();
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
        this.defaultItem.area_code != null &&
        this.defaultItem.kode_kecamatan != null &&
        this.defaultItem.kode_desa.length != 0 &&
        this.defaultItem.namaDesa.length != 0 &&
        this.defaultItem.post_code.length != 0
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