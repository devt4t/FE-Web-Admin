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

    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
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
      class="rounded-xl elevation-6 mx-3 pa-1"
      @update:page="($p) => (page = $p)"
      @update:items-per-page="($p) => (itemsPerPage = $p)"
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
            style="max-width: 350px"
          ></v-text-field>
          <v-divider class="ml-2"></v-divider>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title class="mb-1 headermodalstyle">
                <span class="headline">Edit Posisi</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Nama</h5>
                        <h2 class="ml-2">{{ defaultItem.name }}</h2>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="defaultItem.position_no"
                        :items="itemsPosition"
                        item-value="position_no"
                        item-text="name"
                        label="Pilih Jabatan"
                        clearable
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="Update"> Save </v-btn>
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
          v-if="$_sys.isAllowed('employee-position-update')"
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
  name: "Employee",
  data: () => ({
    config: {
      permission: {
        read: "employee-position-list",
      },
    },
    page: 1,
    itemsPerPage: 10,
    itemsbr: [
      {
        text: "Employee",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Employee Position",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    value: "add",
    dialog: false,
    loadtable: false,
    search: "",
    authtoken: "",
    BaseUrlGet: "",
    headers: [
      { text: "No", value: "no", width: "70" },
      { text: "NIK", value: "nik" },
      { text: "Nama Emp", value: "name" },
      { text: "Grup Posisi", value: "position_group" },
      { text: "Nama Jabatan", value: "namaPosition" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    defaultItem: {
      id: "",
      position_no: "",
      name: "",
      nik: "",
    },
    dataobject: [],
    itemsPosition: [],

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
  }),
  created() {
    this.authtoken = localStorage.getItem("token");
    this.User = JSON.parse(localStorage.getItem("User"));
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.BaseUrl = localStorage.getItem("BaseUrl");
    this.initialize();
    this.GetJobPosition();
  },
  methods: {
    async initialize() {
      this.loadtable = true;
      // console.log(this.User.ff.ff);
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetEmployeeManagePosition",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result.data;
          this.loadtable = false;
        } else {
          this.dataobject = [];
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
      // console.log(this.User.ff.ff);
      try {
        const response = await axios.get(this.BaseUrlGet + "GetJobPosition", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        // console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.itemsPosition = response.data.data.result.data;
        } else {
          this.itemsPosition = [];
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.itemsPosition = [];
        }
      }
    },
    async Update() {
      console.log(this.defaultItem.id);
      const datapost = {
        id: this.defaultItem.id,
        nik: this.defaultItem.nik,
        position_no: this.defaultItem.position_no,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "EditPositionEmp",
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
    editItem(item) {
      console.log(item);
      this.defaultItem.id = item.id;
      this.defaultItem.position_no = item.position_no;
      this.defaultItem.name = item.name;
      this.defaultItem.nik = item.nik;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
