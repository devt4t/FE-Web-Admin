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
      data-aos="fade-up"
      data-aos-delay="200"
      class="rounded-xl elevation-6 mx-3 pa-1"
      @update:page="($p) => page = $p"
      @update:items-per-page="($p) => itemsPerPage = $p"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-xl">
          <!-- Program Year -->
          <v-select
              color="success"
              item-color="success"
              v-model="localConfig.programYear"
              :items="['All Data',...$store.state.programYear.options]"
              :disabled="tableLoading"
              outlined
              dense
              hide-details
              :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
              rounded
              label="Program Year"
              class="mx-auto mr-lg-2 mb-2 mb-lg-0"
              style="max-width: 200px"
          ></v-select>
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
          <v-btn dark rounded class="mb-2" @click="showAddModal()" color="green">
            <v-icon small>mdi-plus</v-icon> Add Item
          </v-btn>
          <v-dialog v-model="dialog" max-width="500px" content-class="rounded-xl">
            <v-card>
              <v-card-title class="px-3">
                <v-spacer></v-spacer>
                <span class="">{{ formTitle }}</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        dense
                        rounded
                        outlined
                        hide-details
                        color="green"
                        v-model="defaultItem.name"
                        label="Nama Managemen Unit"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
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
                          :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                          outlined
                          rounded
                          v-model="defaultItem.program_year"
                      >
                          <template v-slot:no-data>
                              <v-list-item>
                              <v-list-item-content>
                                  <v-list-item-title>
                                  No results matching. Press <kbd>enter</kbd> to create a new one
                                  </v-list-item-title>
                              </v-list-item-content>
                              </v-list-item>
                          </template>
                          <template v-slot:selection="{ attrs, item, parent, selected }">
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
                                  <v-icon
                                      small
                                      @click="parent.selectItem(item)"
                                  >
                                      mdi-close-circle
                                  </v-icon>
                              </v-chip>
                          </template>
                      </v-combobox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="red darken-1" text rounded @click="close">
                  <v-icon class="mr-1">mdi-close-circle</v-icon>
                  Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="green white--text" rounded @click="save" class="" :disabled="saveDisabled"> 
                  <v-icon class="mr-1">mdi-content-save</v-icon>
                  Save 
                </v-btn>
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
      <template v-slot:item.no="{ index }">
        {{ (itemsPerPage * (page-1)) + index + 1 }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editItem(item)" color="warning">
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
import Swal from 'sweetalert2'

export default {
  name: "ManagementUnit",
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
        text: "Management Unit",
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
    tableLoading: false,
    headers: [
      { text: "No", value: "no", width: '70' },
      {
        text: "Kode Management Unit",
        value: "mu_no",
      },
      { text: "Nama Management Unit", value: "name" },
      { text: "Tahun Program", value: "program_year" },
      { text: "Actions", value: "actions", sortable: false, align: 'right' },
    ],
    dataobject: [],
    defaultItem: { id: "", mu_no: "", name: "", program_year: [] },
    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    localConfig: {
        programYear: '',
    },
  }),

  created() {
    this.authtoken = localStorage.getItem("token");
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.localConfig.programYear = this.$store.state.programYear.model
    this.initialize();
  },

  computed: {
    saveDisabled() {
      if (!this.defaultItem.name) return true
      if (!this.defaultItem.program_year) return true
      else if (this.defaultItem.program_year.length == 0) return true
      return false
    }
  },
  watch: {
    'localConfig.programYear': {
      handler(val) {
        this.initialize()
      }
    }
  },
  methods: {
    async errorResponse(error) {
        console.log(error)
        if (error.response) {
            if (error.response.status) {
                if (error.response.status == 401) {
                    const confirm = await Swal.fire({
                        title: 'Session Ended!',
                        text: "Please login again.",
                        icon: 'warning',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Okay'
                    })
                    if (confirm) {
                        localStorage.removeItem("token");
                        this.$router.push("/");
                    }
                }
                if (error.response.status === 500 || error.response.status === 400) {
                    let errMessage = error.response.data.message
                    Swal.fire({
                        title: 'Error!',
                        text: `${errMessage || error.message}`,
                        icon: 'error',
                        confirmButtonColor: '#f44336',
                    })
                }
            }
        }
    },
    async initialize() {
      try {
        this.tableLoading = true
        const response = await axios.get(
          this.BaseUrlGet + `GetManagementUnitAdmin?program_year=${this.localConfig.programYear}`,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result.map(val => {
            return {
              ...val,
              program_year: val.program_year ? val.program_year.split(',') : []
            }
          });
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error);
        this.dataobject = []
        if (error.response.status == 401) {
          this.alerttoken = true;
        }
      }finally {
        this.tableLoading = false
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
          this.BaseUrlGet + "DeleteManagementUnit",
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
        name: this.defaultItem.name,
        program_year: this.defaultItem.program_year.sort((a,b) => {return a - b}).toString()
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddManagementUnit",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses tambah data";
          this.initialize();
        }
      } catch (error) {
        console.error(error.response);
      }
    },
    async updateData() {
      const datapost = {
        id: this.defaultItem.id,
        name: this.defaultItem.name,
        program_year: this.defaultItem.program_year.sort((a,b) => {return a - b}).toString(),
        active: 1,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateManagementUnit",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses ubah data";
          this.initialize();
        }
      } catch (error) {
        console.error(error.response);
      }
    },

    showAddModal() {
      this.value = "add";
      this.formTitle = "Add Item";
      this.defaultItem.id = "";
      this.defaultItem.mu_no = "";
      this.defaultItem.name = "";
      this.dialog = true;
    },
    editItem(item) {
      this.formTitle = "Edit Item";
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
        const confirm = await Swal.fire({
            title: 'Apakah engkau yakin?',
            text: "Setelah ini kamu tidak akan bisa membatalkannya!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2e7d32',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Tidak Jadi',
            confirmButtonText: 'Ya, Lanjutkan!'
        })
        if (confirm.isConfirmed) {
          this.dialog = false
          this.$store.state.loadingOverlay = true
          this.$store.state.loadingOverlayText = 'Loading...'
          if (this.defaultItem.name.length != 0) {
            if (this.defaultItem.id) {
              console.log("edit");
              await this.updateData();
            } else {
              console.log("add");
              await this.addData();
            }
            await this.close();
          } else {
            this.snackbar = true;
            this.colorsnackbar = "red";
            this.textsnackbar = "Gagal Menambah, Kolom tidak boleh ada yang kosong";
          }
        }
      } catch (err) {await this.errorResponse(err)} finally {
        this.$store.state.loadingOverlay = false
      }
    },
  },
};
</script>