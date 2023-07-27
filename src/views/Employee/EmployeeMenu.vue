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
      data-aos="fade-up" data-aos-delay="200"
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
          <v-divider class="ml-2"></v-divider>
          <v-dialog v-model="dialog" max-width="600px" content-class="rounded-xl" scrollable>
            <v-card>
              <v-card-title class="mb-1 headermodalstyle">
                <span class="headline">Edit Data</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="4" md="4">
                      <div>
                        <h5>ID Karyawan</h5>
                        <h2 class="ml-2">{{ defaultItem.IdEmp }}</h2>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="8" md="8">
                      <div>
                        <h5>Nama</h5>
                        <h2 class="ml-2">{{ defaultItem.NamaEmp }}</h2>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row class="mt-5">
                    <v-col cols="12" sm="12" md="12">
                      <v-autocomplete
                        rounded
                        color="green"
                        item-color="success"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        outlined
                        hide-details
                        dense
                        v-model="defaultItem.IdManager"
                        :items="itemsEmp"
                        item-value="nik"
                        item-text="name"
                        label="Pilih Manager"
                        clearable
                        v-on:change="selectedManager($event)"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-autocomplete
                        rounded
                        color="green"
                        item-color="success"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        outlined
                        hide-details
                        dense
                        v-model="menudropdown"
                        :items="itemsMenu"
                        item-value="id"
                        item-text="name"
                        label="Pilih Tambah Akses Menu"
                        v-on:change="selectedMenuAccess($event)"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-data-table
                        :headers="headersmenu"
                        :items="defaultItem.MenuTable"
                        class="elevation-1 rounded-xl"
                        append-icon="mdi-magnify"
                        :footer-props="{
                          itemsPerPageText: 'Jumlah Data Per Halaman',
                          itemsPerPageOptions: [5, 10, 25, 40, -1],
                          showCurrentPage: true,
                          showFirstLastPage: true,
                        }"
                      >
                        <template v-slot:item.actions="{ item }">
                          <v-icon
                            @click="deletelistmenu(item)"
                            color="red"
                          >
                            mdi-delete
                          </v-icon>
                          <!-- <v-icon @click="deleteItem(item)" color="red"> mdi-delete </v-icon> -->
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" text rounded @click="close">
                  <v-icon class="mr-1">mdi-close-circle</v-icon>
                  Keluar
                </v-btn>
                <v-btn color="green white--text" rounded @click="save"><v-icon class="mr-1">mdi-content-save</v-icon> Simpan </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.no="{ index }">
        {{ (itemsPerPage * (page-1)) + index + 1 }}
      </template>
      <template v-slot:item.Menu="{ item }">
        <v-chip v-if="item.Menu.split(', ').length == itemsMenu.length" color="green white--text" class="pl-2" rounded><v-icon class="mr-1">mdi-shield-crown</v-icon> Semua Akses</v-chip>
        <v-chip v-else-if="!item.Menu" color="red white--text" class="pl-1" rounded><v-icon class="mr-1">mdi-close-circle</v-icon> Tidak Ada Akses</v-chip>
        <div v-else-if="item.Menu.split(', ').length <= 3">
          <v-chip v-for="(menuName, menuIndex) in item.Menu.split(', ')" color="green white--text" class="pl-1 mr-1" :key="menuName + menuIndex"><v-icon class="mr-1">mdi-numeric-{{ menuIndex + 1 }}-circle</v-icon> {{ menuName }}</v-chip>
        </div>
        <div v-else>
          <v-menu content-class="rounded-xl" max-height="400" offset-y>
            <template v-slot:activator="{on, attrs}">
              <v-chip v-bind="attrs" v-on="on" color="green white--text"><v-icon class="mr-1">mdi-format-list-numbered</v-icon> {{ item.Menu.split(', ').length }} Akses <v-icon>mdi-chevron-down</v-icon></v-chip>
            </template>
            <v-card scrollable>
              <v-card-text>
                <v-simple-table>
                  <tr
                    v-for="(item, index) in item.Menu.split(', ').sort()"
                    :key="index"
                  >
                    <td class="text-center">{{ index + 1 }}.</td>
                    <td>{{ item }}</td>
                  </tr>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-menu>          
        </div>
        <!-- <v-icon @click="deleteItem(item)" color="red"> mdi-delete </v-icon> -->
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

export default {
  name: "Employee",
  data: () => ({
    page: 1,
    itemsPerPage: 10,
    itemsbr: [
      {
        text: "Employee",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Employee Menu",
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
      { text: "No", value: "no", width: '70' },
      { text: "Nama Emp", value: "NamaEmp", width: "20%" },
      { text: "Nama Manager", value: "NamaManager", width: "20%" },
      { text: "Akses Menu", value: "Menu" },
      { text: "Actions", value: "actions", sortable: false, align: 'right' },
    ],
    headersmenu: [
      { text: "Menu Code", value: "MenuCode" },
      { text: "Nama Menu", value: "MenuName" },
      { text: "Actions", value: "actions", sortable: false, align: 'right' },
    ],
    defaultItem: {
      IdEmp: "",
      NamaEmp: "",
      Menu: "",
      IdManager: "",
      NamaManager: "",
      MenuCode: [],
      MenuTable: [],
    },
    dataobject: [],
    itemsEmp: [],
    itemsMenu: [],
    statusAdd: true,

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    menudropdown: "",

    editedIndex: -1,
    editedItem: {
      MenuCode: "",
      MenuName: "",
    },
  }),
  created() {
    this.authtoken = localStorage.getItem("token");
    this.User = JSON.parse(localStorage.getItem("User"));
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.BaseUrl = localStorage.getItem("BaseUrl");
    this.initialize();
    this.GetEmp();
    this.GetMenu();
  },
  methods: {
    async initialize() {
      this.loadtable = true;
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetEmployeeMenuAccess",
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
    async GetEmp() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetEmployeeAll", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.itemsEmp = response.data.data.result.data.sort((a, b) => a.name.localeCompare(b.name));
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
    async GetMenu() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetAllMenuAccess", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsMenu = response.data.data.result.sort((a, b) => a.name.localeCompare(b.name));
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
    async Update(datapost) {
      // console.log(this.defaultItem.id);
      // const datapost = {
      //   id: this.defaultItem.id,
      //   nik: this.defaultItem.nik,
      //   position_no: this.defaultItem.position_no,
      // };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "EditMenuAccessEmp",
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
      } finally {
        this.menudropdown = ""
      }
    },

    editItem(item) {
      console.log(item);
      this.defaultItem.IdEmp = item.IdEmp;
      this.defaultItem.NamaEmp = item.NamaEmp;
      this.defaultItem.Menu = item.Menu;
      this.defaultItem.IdManager = item.IdManager;
      this.defaultItem.NamaManager = item.NamaManager;
      this.defaultItem.MenuCode = item.MenuCode;
      this.defaultItem.MenuTable = item.MenuTable;
      this.statusAdd = false;
      this.dialog = true;
    },
    selectedManager(x) {
      console.log(x);
      if (x != null) {
        for (let i = 0; i < this.itemsMenu.length; i++) {
          if (this.itemsEmp[i].nik == x) {
            // console.log(this.itemsMenu[i]);
            this.defaultItem.IdManager = this.itemsEmp[i].nik;
            this.defaultItem.NamaManager = this.itemsEmp[i].name;
            // console.log(this.editedItem);
            break;
          }
        }
      } else {
        this.defaultItem.IdManager = "-";
        this.defaultItem.NamaManager = "-";
      }
    },
    selectedMenuAccess(a) {
      if (a != null) {
        var listmenu = this.defaultItem.MenuTable;
        var result = false;
        for (let n = 0; n < listmenu.length; n++) {
          if (listmenu[n].MenuCode == a) {
            result = true;
            break;
          }
        }
        if (result == false) {
          var itemsmenuset = {
            MenuCode: "",
            MenuName: "",
          };
          for (let i = 0; i < this.itemsMenu.length; i++) {
            if (this.itemsMenu[i].id == a) {
              // console.log(this.itemsMenu[i]);
              itemsmenuset.MenuCode = this.itemsMenu[i].id;
              itemsmenuset.MenuName = this.itemsMenu[i].name;
              // console.log(this.editedItem);
              break;
            }
          }
          this.defaultItem.MenuTable.push(itemsmenuset);
          // console.log(this.defaultItem.MenuTable);
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses Tambah Menu Access";
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Menu Sudah Ada Bro..!!!";
        }
        // this.menudropdown.id = '';
      }
    },
    async deletelistmenu(item) {
      console.log(item);
      this.editedIndex = await this.defaultItem.MenuTable.indexOf(item);
      this.editedItem = await Object.assign({}, item);
      // console.log(this.editedIndex);
      // console.log(this.editedItem);
      this.defaultItem.MenuTable.splice(this.editedIndex, 1);
    },
    save() {
      if (this.defaultItem.IdEmp.length != 0) {
        var listmenupost = "";
        var listmenutemp = "";
        for (let n = 0; n < this.defaultItem.MenuTable.length; n++) {
          if (n == 0) {
            listmenutemp = this.defaultItem.MenuTable[n].MenuCode;
          } else {
            listmenutemp =
              listmenutemp + "," + this.defaultItem.MenuTable[n].MenuCode;
          }
        }
        listmenupost = "[" + listmenutemp + "]";
        console.log(listmenupost);
        const datapost = {
          nik: this.defaultItem.IdEmp,
          manager_code: this.defaultItem.IdManager,
          menu_access: listmenupost,
          NamaEmp: this.defaultItem.NamaEmp,
          NamaManager: this.defaultItem.NamaManager,
          MenuTable: this.defaultItem.MenuTable,
        };
        console.log(datapost);
        if (this.statusAdd == false) {
          this.Update(datapost);
        } else {
          // this.addData();
        }
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Gagal Simpan, Semua kolom tidak boleh ada yang kosong";
      }
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>