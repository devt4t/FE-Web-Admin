<template>
  <div>
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      data-aos="fade-right"
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      multi-sort
      :headers="headers"
      :items="dataobject"
      :search="search"
      :loading="tableLoading"
      :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman'
      }"
      class="rounded-xl elevation-6 mx-3 pa-1"
      @update:page="($p) => page = $p"
      @update:items-per-page="($p) => itemsPerPage = $p"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-xl">
        <!-- program years-->
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
              label="Tahun Program"
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
            style="max-width: 350px;"
          ></v-text-field>
          <v-divider class="mx-2"></v-divider>
          <v-btn dark rounded class="mb-2" @click="showAddModal()" color="green">
            <v-icon small>mdi-plus</v-icon> Tambah Data
          </v-btn>
          <v-dialog v-model="dialog" max-width="777" content-class="rounded-xl">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span class="">{{ formTitle }}</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>

                    <v-col cols="12" lg="6">

                      <v-autocomplete
                        dense
                        hide-details
                        outlined
                        rounded
                        color="green"
                        item-color="green"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        v-model="defaultItem.kode_kecamatan"
                        :items="itemsKab"
                        item-value="kode_kecamatan"
                        item-text="namaKecamatan"
                        label="Pilih Kecamatan"
                        clearable
                        :rules="[(v) => !!v || 'Field is required']"
                      >
                        <template v-slot:item="data">
                          <v-list-item-content>
                            <v-list-item-title v-html="data.item.namaKecamatan"></v-list-item-title>
                            <v-list-item-subtitle>Kode: {{ data.item.kode_kecamatan }}</v-list-item-subtitle>
                            <v-list-item-subtitle>{{ data.item.namaKabupaten }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <!-- <v-col cols="12">
                      <v-autocomplete
                        dense
                        hide-details
                        outlined
                        rounded
                        color="green"
                        item-color="green"
                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                        v-model="defaultItem.area_code"
                        :items="itemsTa"
                        item-value="area_code"
                        item-text="namaTa"
                        label="Pilih Target Area"
                        clearable
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-autocomplete>
                    </v-col> -->
                    <v-col cols="12" lg="6">
                      <v-text-field
                        dense
                        hide-details
                        outlined
                        rounded
                        color="green"
                        v-model="defaultItem.kode_desa"
                        label="Kode Desa"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="6">
                      <v-text-field
                        dense
                        hide-details
                        outlined
                        rounded
                        color="green"
                        label="Nama Desa"
                        v-model="defaultItem.namaDesa"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="6">
                      <v-text-field
                        dense
                        hide-details
                        outlined
                        rounded
                        color="green"
                        type="number"
                        v-model="defaultItem.post_code"
                        label="Kode Pos"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <div class="d-flex align-center my-4">
                    <p class="mb-0"><v-icon class="mr-2">mdi-map-marker-distance</v-icon>Pemetaan Target Area</p>
                    <v-divider class="mx-2"></v-divider>
                  </div>
                  <v-row v-for="(assignTa, assignTaIndex) in defaultItem.ta_desas" :key="`row-ta-assign-${assignTaIndex}`">
                    <v-col cols="auto" class="d-flex align-start">
                      <v-btn fab x-small color="green white--text" class="elevation-0"><v-icon>mdi-numeric-{{ assignTaIndex + 1 }}</v-icon></v-btn>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col cols="12">
                          <v-combobox
                              dense
                              multiple
                              color="success"
                              hide-details
                              small-chips
                              hide-selected
                              item-color="success"
                              :items="$store.state.programYear.options"
                              v-model="assignTa.program_year"
                              label="Tahun Program"
                              :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                              outlined
                              rounded
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
                        <v-col cols="12">
                          <v-autocomplete
                            dense
                            hide-details
                            outlined
                            rounded
                            color="green"
                            item-color="green"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :items="itemsTa.map(ita => {
                              if (ita.program_year && assignTa.program_year)
                                if (assignTa.program_year.every(pro => ita.program_year.split(',').includes(pro)))
                                  return ita
                              return null
                            }).filter(n => n)"
                            label="Pilih Target Area"
                            item-value="area_code"
                            item-text="namaTa"
                            v-model="assignTa.area_code"
                            clearable
                            :disabled="assignTa.program_year.length == 0"
                            :rules="[(v) => !!v || 'Field is required']"
                          >
                            <template v-slot:item="data">
                              <v-list-item-content>
                                <v-list-item-title v-html="data.item.namaTa"></v-list-item-title>
                                <v-list-item-subtitle>Kode: {{ data.item.area_code }}</v-list-item-subtitle>
                                <v-list-item-subtitle>MU: {{ data.item.namaMu }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </template>
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row class="justify-center">
                      <v-btn
                          data-aos="fade-right" data-aos-offset="-10000" 
                          :key="`village_set_ta_plus_btn`" 
                          fab small color="green white--text" class="mx-1" 
                          @click="() => modifyTotalSubData('+')"
                      >
                          <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn v-if="defaultItem.ta_desas.length > 1" 
                          data-aos="fade-left" data-aos-offset="-10000" 
                          :key="`village_set_ta_minus_btn`" 
                          fab small color="red" outlined class="mx-1"
                          @click="() => modifyTotalSubData('-')"
                      >
                          <v-icon>mdi-minus</v-icon>
                      </v-btn>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="red darken-1" text rounded @click="close">
                  <v-icon class="mr-1">mdi-close-circle</v-icon>
                  Keluar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="green white--text" rounded @click="save" class="" :disabled="saveDisabled"> 
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
        {{ (itemsPerPage * (page-1)) + index + 1 }}
      </template>
      <!--Status row-->
      <template v-slot:item.status="{item}">
        <v-chip :color="getStatusColumn('bg_color', item.status)" class="white--text">
          <v-icon class="mr-1">{{ getStatusColumn('icon', item.status) }}</v-icon>
          {{ getStatusColumn('text', item.status) }}
        </v-chip>
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
  name: "Vilage",
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
        text: "Village",
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
      { text: "No", value: "no", width: '70' },
      { text: "Desa", value: "namaDesa" },
      { text: "Kode_Desa", value: "kode_desa" },
      { text: "Kecamatan", value: "namaKecamatan" },
      { text: "Target Area", value: "namaTa" },
      { text: "Kode Pos", value: "post_code" },
        /*YONGS
        add data headers (Sample with postcode data)*/
      {text: 'Status', value: 'status', align: 'center'},
      {text : "Tahun Program", value: "program_year"},
        /*End data headers*/
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
      namaDesaKecamatan: "",
      area_code: "",
      namaTa: "",
      post_code: "",
      program_year: "",
      ta_desas: []
    },
    ta_desas_default: {
      program_year: [],
      area_code: ''
    },
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
  watch: {
    'localConfig.programYear': {
      handler(val) {
        this.initialize()
      }
    }
  },

  computed: {
    saveDisabled() {
      if (!this.defaultItem.kode_kecamatan) return true
      if (!this.defaultItem.kode_desa) return true
      if (!this.defaultItem.namaDesa) return true
      if (!this.defaultItem.post_code) return true

      let emptyTA = 0
      this.defaultItem.ta_desas.forEach(val => {
        if (val.program_year.length > 0) if (!val.area_code) emptyTA += 1
      })
      if (emptyTA > 0) return true
      
      return false
    }
  },
  methods: {
    async initialize() {
      try {
        this.tableLoading = true

        const response = await axios.get(
            this.BaseUrlGet + `GetDesaAdmin?program_year=${this.localConfig.programYear}`,
            {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });

        // status desa condition

        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result.map(val => {
            return {
              ...val,
              ta_desas: val.ta_desas.map(val2 => {
                return {
                  ...val2,
                  program_year: val2.program_year.split(',')
                  //program_year: val2.program_year ? val2.program_year.split(',') : []
                }
              })
            }
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
        this.tableLoading = false
      }
    },
    getStatusColumn(type, status) {
      if (type == 'bg_color') {
        if (status == '0') return 'orange'
        if (status == '1') return 'green darken-1'
        if (status == '2') return 'red'
      }
      if (type == 'icon') {
        if (status == '0') return 'mdi-google-downasaur' //mdi:cancel
        if (status == '1') return 'mdi-check-circle'
        if (status == '2') return 'mdi-alert-rhombus-outline'
      }
      if (type == 'text') {
        if (status == '0') return 'Belum Mengikuti RRA'
        if (status == '1') return 'Potensial'
        if (status == '2') return 'Tidak Potensial'
      }

      return ''
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
        ta_desas: this.defaultItem.ta_desas.map(val => {
          if (val.program_year && val.area_code) 
          return {...val, program_year: val.program_year.sort((a,b) => {return a - b}).toString()}
          return null
        }).filter(n => n)
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
//TEST, Ambil data Rrapra
    /*async getRrapra_status(){
    //need table
      try {
        this.table.loading.show = true
        this.table.loading.text = "Sedang ambil data..."
      }
      catch (error){
        this.table.items = []
        this.errorResponse(err)
      } finally {
        this.table.loading.show = false
      }
    },*/
    async updateData() {
      const datapost = {
        id: this.defaultItem.id,
        kode_ta: this.defaultItem.area_code,
        kode_kecamatan: this.defaultItem.kode_kecamatan,
        kode_desa: this.defaultItem.kode_desa,
        post_code: this.defaultItem.post_code,
        name: this.defaultItem.namaDesa,
        ta_desas: this.defaultItem.ta_desas.map(val => {
          if (val.program_year && val.area_code) return {...val, program_year: val.program_year.sort((a,b) => {return a - b}).toString()}
          return null
        }).filter(n => n)
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
        console.log(error);
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
      this.formTitle = "Tambah Data";
      this.getKec();
      this.getTa();
      this.defaultItem.id = "";
      this.defaultItem.area_code = null;
      this.defaultItem.kode_kecamatan = null;
      this.defaultItem.kode_desa = "";
      this.defaultItem.namaDesa = "";
      this.defaultItem.post_code = "";
      this.defaultItem.status_desa = "";
      this.defaultItem.desa_program_year="";
      this.defaultItem.ta_desas = [JSON.parse(JSON.stringify(this.ta_desas_default))]
      this.dialog = true;
    },
    editItem(item) {
      console.log(item);
      this.formTitle = "Edit Data";
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
    modifyTotalSubData(type) {
        if (type == '+') {
          this.defaultItem.ta_desas.push(JSON.parse(JSON.stringify(this.ta_desas_default)))
        } else if (type == '-') {
          this.defaultItem.ta_desas.pop()
        }
    },
    async save() {
      try {
        this.dialog = false
        this.$store.state.loadingOverlay = true
        this.$store.state.loadingOverlayText = 'Loading...'
        if (
          this.defaultItem.kode_kecamatan != null &&
          this.defaultItem.kode_desa.length != 0 &&
          this.defaultItem.namaDesa.length != 0 &&
          this.defaultItem.post_code.length != 0
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
          this.textsnackbar = "Gagal Menambah, Kolom tidak boleh ada yang kosong";
        }
      } finally {
        this.$store.state.loadingOverlay = false
      }
    },
  },
};
</script>