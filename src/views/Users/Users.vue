<template>
  <div>
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <v-data-table
      :headers="headers"
      :items="dataobject"
      :search="search"
      :loading="table.loading"
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

          <!-- Create Form Modal -->
          <v-dialog v-model="dialog" max-width="700px">
            <v-card>
              <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="defaultItem.name"
                        label="Nama"
                        :rules="rules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="defaultItem.email"
                        label="Email"
                        :rules="rules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row v-if="typeAdd == true">
                    <v-col cols="12" sm="4" md="4">
                      <v-select
                        v-model="defaultItem.type"
                        :items="itemsType"
                        item-value="value"
                        item-text="text"
                        label="Pilih Type"
                        v-on:change="selectedType"
                        :rules="rules"
                      ></v-select>
                    </v-col>
                    <v-col v-if="typeselectedFF == true" cols="12" sm="8" md="8">
                      <v-autocomplete
                        v-model="defaultItem.employee_no"
                        :items="itemsFF"
                        item-value="ff_no"
                        item-text="namaFF"
                        label="Pilih FF"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                    <v-col v-if="typeselectedFF == false" cols="12" sm="8" md="8">
                      <v-autocomplete
                        v-model="defaultItem.employee_no"
                        :items="itemsEmp"
                        item-value="nik"
                        item-text="name"
                        label="Pilih Employee"
                        clearable
                      ></v-autocomplete>
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
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogReset" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to reset password?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="resetItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
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
        <v-icon @click="resetItem(item)" color="red"> mdi-autorenew </v-icon>
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
  name: "Users",
  data: () => ({
    itemsbr: [
      {
        text: "Users",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Users",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 1) || "Min 1 characters",
    ],
    alerttoken: false,
    formTitle: "Add Item",
    value: "add",
    dialog: false,
    dialogDelete: false,
    dialogDetail: false,
    dialogReset: false,
    search: "",
    valid: true,
    authtoken: "",
    BaseUrlGet: "",
    dataobject: [],
    headers: [
      {
        text: "Kode Pegawai",
        align: "start",
        value: "employee_no",
        width: "15%",
      },
      { text: "Nama", value: "name", width: "25%" },
      { text: "Role", value: "role", width: "20%" },
      { text: "Email", value: "email", width: "25%" },
      { text: "Actions", value: "actions", sortable: false, width: "15%" },
    ],
    defaultItem: {
      id: "",
      employee_no: "",
      name: "",
      role: "",
      email: "",
      type: "",
    },
    itemsType:[
      { text: "FF", value: "FF" },
      { text: "Employee", value: "Employee" },
    ],
    itemsEmp:[],
    itemsFF:[],
    itemsPositionEmp:[],
    typeselectedFF: true,
    typeAdd: true,

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    table: {loading: false}
  }),
  created() {
    this.authtoken = localStorage.getItem("token");
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.initialize();
    this.GetEmp();
    this.GetFF();
    this.GetJobPosition();
    // localStorage.setItem("token", this.authtoken);
    // this.getMU();
  },
  methods: {
    async initialize() {
      try {
        this.table.loading = true
        const response = await axios.get(this.BaseUrlGet + "GetUser", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result.data;
        } else {
          console.log("Kosong");
          this.dataobject = [];
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.dataobject = [];
        }
      } finally {
        this.table.loading = false
      }
    },
    async GetEmp() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetEmployeeAll", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.itemsEmp = response.data.data.result.data;
        } else {
          console.log("Kosong");
          this.itemsEmp = [];
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.itemsEmp = [];
        }
      }
    },
    async GetFF() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetFieldFacilitatorAllWeb", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.itemsFF = response.data.data.result.data;
        } else {
          console.log("Kosong");
          this.itemsFF = [];
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.itemsFF = [];
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
        console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.itemsPositionEmp = response.data.data.result.data;
        } else {
          console.log("Kosong");
          this.itemsPositionEmp = [];
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.itemsPositionEmp = [];
        }
      }
    },
    async addData() {
      console.log(this.defaultItem.id);
      const datapost = {
        employee_no: this.defaultItem.employee_no,
        name: this.defaultItem.name,
        email: this.defaultItem.email,
        password: '123456',
        role: this.defaultItem.type,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "Regist",
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
        }else{
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
        }
      }
    },
    async updateData() {
      console.log(this.defaultItem.id);
      const datapost = {
        employee_no: this.defaultItem.employee_no,
        name: this.defaultItem.name,
        email: this.defaultItem.email,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "EditUser",
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
        }else{
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
        }
      }
    },
    async resetItemConfirm() {
      console.log(this.defaultItem.employee_no);
      const datapost = {
        employee_no: this.defaultItem.employee_no,
        email: this.defaultItem.email,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "ResetPasswordUser",
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
        }else{
          this.dialog = true;
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal mengubah data";
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
          this.BaseUrlGet + "DeleteUser",
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

    deleteItemConfirm() {
      
      this.verifDelete();
    },
    close() {
      this.dialog = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    deleteItem(item){
      this.defaultItem.id = item.id;
      this.dialogDelete = true;
    },
    resetItem(item){
      this.defaultItem.employee_no = item.employee_no;
      this.defaultItem.email = item.email;
      this.dialogReset = true;
    },

    showAddModal() {
      
      this.defaultItem.id = "";
      this.defaultItem.name = "";
      this.defaultItem.role = "";
      this.defaultItem.employee_no = "";
      this.defaultItem.email = "";
      this.defaultItem.type = "FF";
      this.formTitle = 'Add Item';
      this.typeAdd = true;
      this.dialog = true;
    },
    editItem(item) {
      console.log(item);
      this.defaultItem.id = item.id;
      this.defaultItem.employee_no = item.employee_no;
      this.defaultItem.name = item.name;
      this.defaultItem.role = item.role;
      this.defaultItem.email = item.email;
      if(item.role == 'ff'){this.defaultItem.type = 'FF';this.typeselectedFF = true;}
      else{this.defaultItem.type = 'Employee';this.typeselectedFF = false;}
      this.formTitle = 'Edit Item';
      this.typeAdd = false;
      this.dialog = true;
    },
    selectedType(a){
      console.log(a);
      if(a == 'FF'){this.typeselectedFF = true;this.defaultItem.type = a;}
      else{this.typeselectedFF = false;this.defaultItem.type = a;}
      // this.valueMU = a;
    },
    save(){
      this.$refs.form.validate();
      if (
        this.defaultItem.name.length != 0 &&
        // this.defaultItem.birthday.length != 0 &&
        this.defaultItem.type != null &&
        this.defaultItem.employee_no != null &&
        this.defaultItem.email.length != 0 
      ) {
        if (this.defaultItem.id) {
          this.updateData();
        }else{
          this.addData();
        }        
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Gagal Simpan, Semua kolom tidak boleh ada yang kosong";
      }
    }
  },
};
</script>