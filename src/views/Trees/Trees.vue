<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>
    <!-- Modal -->
    <!-- Detail -->
    <v-dialog v-model="dialogDetail" max-width="800px" content-class="rounded-xl" scrollable>
      <v-card>
        <v-card-title>
          <span class="headline">Detail Petani</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="4" md="4">
                <div>Foto 1</div>
                <v-img
                  height="250"
                  v-bind:src="defaultItem.photo1"
                  class="my-1 mb-4"
                ></v-img>
                <div>Foto 2</div>
                <v-img
                  height="250"
                  v-bind:src="defaultItem.photo1"
                  class="my-1 mb-4"
                ></v-img>
              </v-col>
              <v-col cols="12" sm="8" md="8">
                <v-row>
                  <v-col cols="12" sm="12" md="6">
                    <div>
                      <h5>Kode Pohon</h5>
                      <h3 class="ml-2">
                        {{ defaultItem.tree_code }}
                      </h3>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <div>
                      <h5>Nama Pohon</h5>
                      <h3 class="ml-2">{{ defaultItem.tree_name }}</h3>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="6">
                    <div>
                      <h5>Nama Sains</h5>
                      <h3 class="ml-2">
                        {{ defaultItem.scientific_name }}
                      </h3>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <div>
                      <h5>English Name</h5>
                      <h3 class="ml-2">{{ defaultItem.english_name }}</h3>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="6">
                    <div>
                      <h5>Nama Umum</h5>
                      <h3 class="ml-2">
                        {{ defaultItem.common_name }}
                      </h3>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <div>
                      <h5>Kategori Pohon</h5>
                      <h3 class="ml-2">
                        {{ defaultItem.tree_category }}
                      </h3>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="6">
                    <div>
                      <h5>CO2</h5>
                      <h3 class="ml-2">
                        {{ defaultItem.co2_capture }}
                      </h3>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <div>
                      <h5>Produk</h5>
                      <h3 class="ml-2">{{ defaultItem.product_list }}</h3>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <div>
                      <h5>Informasi Singkat</h5>
                      <h3 class="ml-2">
                        {{ defaultItem.short_information }}
                      </h3>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <div>
                      <h5>Lama Panen</h5>
                      <h3 class="ml-2">
                        {{ defaultItem.estimate_income }}
                      </h3>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <div>
                      <h5>Deskripsi</h5>
                      <h3 class="ml-2">
                        {{ defaultItem.description }}
                      </h3>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="defaultItem.waitingapproval == true">
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="verif" outlined elevation="1">
            Verifikasi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Add, Edit -->
    <v-dialog v-model="dialog" max-width="700px" content-class="rounded-xl">
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
                    v-model="defaultItem.tree_name"
                    label="Nama Pohon"
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.common_name"
                    label="Nama Umum"
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.scientific_name"
                    label="Nama Sains"
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.english_name"
                    label="Nama Inggris"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="defaultItem.tree_category"
                    :items="itemstype"
                    item-value="value"
                    item-text="text"
                    label="Kategori Pohon"
                    clearable
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.estimate_income"
                    label="Lama Panen"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.co2_capture"
                    label="CO2"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    v-model="defaultItem.product_list"
                    label="Hasil Produk"
                    rows="1"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    v-model="defaultItem.short_information"
                    label="Informasi Singkat"
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    v-model="defaultItem.description"
                    label="Deskripsi"
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pilih Foto Pohon 1"
                    prepend-icon="mdi-camera"
                    label="Pilih Foto Pohon 1"
                    v-on:change="pilihfoto1"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-img
                    height="250"
                    v-bind:src="defaultItem.photo1"
                    class="my-1 mb-4"
                  ></v-img>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pilih Foto Pohon 2"
                    prepend-icon="mdi-camera"
                    label="Pilih Foto Pohon 2"
                    v-on:change="pilihfoto2"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-img
                    height="250"
                    v-bind:src="defaultItem.photo2"
                    class="my-1 mb-4"
                  ></v-img>
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
    <!-- Add Tree Locations -->
    <v-dialog v-model="dialogs.treeLocations.add.show" content-class="rounded-xl" max-width="700px" persistent>
      <v-card>
        <!-- Title -->
        <v-card-title class="mb-1 headermodalstyle rounded-xl elevation-5">
          <span class="">Add Tree Locations</span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="closeDialogAdjustTreeLocation">mdi-close-circle</v-icon>
        </v-card-title>
        <!-- Content -->
        <v-card-text>
          <!-- loading overlay -->
          <v-overlay :value="dialogs.treeLocations.add.loading" absolute class="rounded-xl" color="white">
              <div class="d-flex flex-column align-center justify-center">
                  <v-progress-circular
                      indeterminate
                      color="green"
                      size="123"
                      width="7"
                  ></v-progress-circular>
                  <p class="mt-2 mb-0 green--text white rounded-xl px-2 py-1">Getting Trees in <strong>{{ dialogs.treeLocations.add.forms.mu_no || 'All' }}</strong> data...</p>
              </div>
          </v-overlay>
          <v-row class="my-0">
            <!-- select MU -->
            <v-col cols="12">
              <v-autocomplete
                clearable
                hide-details
                outlined
                rounded
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                color="green"
                item-color="green"
                class="mb-2 mb-lg-0"
                item-value="mu_no"
                item-text="name"
                :label="expansions.treeLocations.optionsMU.label"
                :items="expansions.treeLocations.optionsMU.items"
                :loading="expansions.treeLocations.optionsMU.loading"
                :disabled="expansions.treeLocations.optionsMU.disabled"
                v-model="dialogs.treeLocations.add.forms.mu_no"
                :rules="[(v) => !!v || 'Field is required']"
              ></v-autocomplete>
            </v-col>
            <!-- select Trees KAYU -->
            <v-col cols="12">
              <v-autocomplete
                multiple
                chips
                clearable
                hide-details
                outlined
                rounded
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                color="green"
                item-color="green"
                class="mb-2 mb-lg-0"
                item-value="tree_code"
                item-text="tree_name"
                :label="`KAYU (${dialogs.treeLocations.add.forms.KAYU.length})`"
                :items="dataobject"
                v-model="dialogs.treeLocations.add.forms.KAYU"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    color="green white--text"
                    close
                    @click="data.select"
                    @click:close="dialogs.treeLocations.add.forms.KAYU.splice(data.index, 1)"
                  >
                    {{ data.item.tree_name }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <!-- select Trees MPTS -->
            <v-col cols="12">
              <v-autocomplete
                multiple
                chips
                clearable
                hide-details
                outlined
                rounded
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                color="green"
                item-color="green"
                class="mb-2 mb-lg-0"
                item-value="tree_code"
                item-text="tree_name"
                :label="`MPTS (${dialogs.treeLocations.add.forms.MPTS.length})`"
                :items="dataobject"
                v-model="dialogs.treeLocations.add.forms.MPTS"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    color="green white--text"
                    close
                    @click="data.select"
                    @click:close="dialogs.treeLocations.add.forms.MPTS.splice(data.index, 1)"
                  >
                    {{ data.item.tree_name }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <!-- select Trees CROPS -->
            <v-col cols="12">
              <v-autocomplete
                multiple
                chips
                clearable
                hide-details
                outlined
                rounded
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                color="green"
                item-color="green"
                class="mb-2 mb-lg-0"
                item-value="tree_code"
                item-text="tree_name"
                :label="`CROPS (${dialogs.treeLocations.add.forms.CROPS.length})`"
                :items="dataobject"
                v-model="dialogs.treeLocations.add.forms.CROPS"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    color="green white--text"
                    close
                    @click="data.select"
                    @click:close="dialogs.treeLocations.add.forms.CROPS.splice(data.index, 1)"
                  >
                    {{ data.item.tree_name }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions>
          <v-btn rounded color="red white--text pr-3" @click="closeDialogAdjustTreeLocation">
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Close
          </v-btn>
          <v-divider class="mx-2"></v-divider>
          <v-btn rounded color="green white--text px-3" @click="saveTreeLocations"
            :disabled="!dialogs.treeLocations.add.forms.mu_no"
          >
            <v-icon class="mr-1">mdi-content-save-check</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete -->
    <v-dialog v-model="dialogDelete" max-width="500px" content-class="rounded-xl">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="verifDelete"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END:Modal -->
    
    <v-container fluid>
      <!-- Expansions Panels -->
      <v-expansion-panels multiple v-model="expansions.model">
        <!-- Main Tree Section -->
        <v-expansion-panel class="rounded-xl">
          <v-expansion-panel-header>
              <h3 class="dark--text"><v-icon class="mr-1">mdi-pine-tree</v-icon> Main Tree</h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
              <!-- loading overlay -->
              <v-overlay :value="expansions.mainTrees.loading" absolute class="rounded-xl" color="white">
                  <div class="d-flex flex-column align-center justify-center">
                      <v-progress-circular
                          indeterminate
                          color="green"
                          size="123"
                          width="7"
                      ></v-progress-circular>
                      <p class="mt-2 mb-0 green--text white rounded-xl px-2 py-1">Getting <strong>Main Trees</strong> data...</p>
                  </div>
              </v-overlay>
              <v-data-table
                :headers="headers"
                :items="dataobject"
                :search="search"
                class=""
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-text-field
                      dense
                      outlined
                      rounded
                      v-model="search"
                      append-icon="mdi-magnify"
                      color="green"
                      label="Search"
                      hide-details
                    ></v-text-field>
                    <v-divider class="mx-2"></v-divider>
                    <v-btn rounded dark class="mb-2" @click="showAddModal()" color="green">
                      <v-icon small>mdi-plus</v-icon> Add Item
                    </v-btn>
                  </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon class="mr-3" @click="showDetail(item)" small color="info">
                    mdi-information-outline
                  </v-icon>
                  <v-icon class="mr-2" @click="editItem(item)" color="warning">
                    mdi-pencil
                  </v-icon>
                  <v-icon @click="deleteItem(item)" color="red"> mdi-delete </v-icon>
                </template>
              </v-data-table>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- Tree Location Section -->
        <v-expansion-panel class="rounded-xl">
          <v-expansion-panel-header>
              <h3 class="dark--text"><v-icon class="mr-1">mdi-forest</v-icon> Tree per-Management Unit</h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
              <!-- loading overlay -->
              <v-overlay :value="expansions.treeLocations.loading" absolute class="rounded-xl" color="white">
                  <div class="d-flex flex-column align-center justify-center">
                      <v-progress-circular
                          indeterminate
                          color="green"
                          size="123"
                          width="7"
                      ></v-progress-circular>
                      <p class="mt-2 mb-0 green--text white rounded-xl px-2 py-1">Getting Trees in <strong>{{ expansions.treeLocations.optionsMU.model }}</strong> data...</p>
                  </div>
              </v-overlay>
              <v-data-table
                :headers="expansions.treeLocations.headers"
                :items="expansions.treeLocations.items"
                :search="expansions.treeLocations.search"
                class=""
              >
                <template v-slot:top>
                  <v-row class="align-center justify-center mx-0 my-0">
                    <!-- select MU -->
                    <v-autocomplete
                      clearable
                      dense
                      hide-details
                      outlined
                      rounded
                      :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                      color="green"
                      item-color="green"
                      class="mb-2 mb-lg-0"
                      item-value="mu_no"
                      item-text="name"
                      :label="expansions.treeLocations.optionsMU.label"
                      :items="expansions.treeLocations.optionsMU.items"
                      :loading="expansions.treeLocations.optionsMU.loading"
                      :disabled="expansions.treeLocations.optionsMU.disabled"
                      v-model="expansions.treeLocations.optionsMU.model"
                    >

                    </v-autocomplete>
                    <v-divider class="mx-2"></v-divider>
                    <!-- search -->
                    <v-text-field
                      dense
                      class="mb-2 mb-lg-0 mr-lg-2"
                      outlined
                      rounded
                      v-model="expansions.treeLocations.search"
                      append-icon="mdi-magnify"
                      color="green"
                      label="Search"
                      hide-details
                    ></v-text-field>
                    <!-- add button -->
                    <v-btn rounded dark class="mb-2" @click="dialogs.treeLocations.add.show = true" color="green">
                      <v-icon class="mr-1">mdi-nature-people</v-icon> Adjust Trees
                    </v-btn>
                  </v-row>
                </template>
                <template v-slot:item.actions="{ item }">

                </template>
              </v-data-table>
            </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>

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
  name: "Trees",
  data: () => ({
    expansions: {
      model: [0,1],
      mainTrees: {
        loading: false
      },
      treeLocations: {
        headers: [
          {text: 'Management Unit', value: 'mu_name'},
          {text: 'Tree Code', value: 'tree_code'},
          {text: 'Tree Name', value: 'tree_name'},
          {text: 'Tree Category', value: 'category', align: 'center'},
          // {text: 'Actions', value: 'actions', align: 'right'},
        ],
        items: [],
        loading: false,
        optionsMU: {
          disabled: false,
          items: [],
          label: 'Management Unit',
          loading: false,
          model: '',
        },
        search: ''
      }
    },
    dialogs: {
      treeLocations: {
        add: {
          loading: false,
          show: false,
          forms: {
            mu_no: '',
            KAYU: [],
            MPTS: [],
            CROPS: []
          }
        }
      }
    },
    itemsbr: [
      {
        text: "Main Data",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Trees",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    alerttoken: false,
    formTitle: "Add Item",
    value: "add",
    dialog: false,
    dialogDelete: false,
    dialogDetail: false,
    search: "",
    authtoken: "",
    BaseUrlGet: "",
    BaseUrlUpload: "",
    dataobject: [],
    type: "",
    itemstype: [
      { text: "Pohon Kayu", value: "Pohon_Kayu" },
      { text: "Pohon Buah/MPTS", value: "Pohon_Buah" },
      { text: "Perkebunan", value: "Perkebunan" },
      { text: "Tanaman Bawah/Empon-empon", value: "Tanaman_Bawah_Empon" },
    ],
    headers: [
      {
        text: "Kode Pohon",
        align: "start",
        value: "tree_code",
        width: "11%",
      },
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Kategori Pohon", value: "tree_category", width: "20%" },
      { text: "Nama Sains", value: "scientific_name", width: "20%" },
      { text: "Nama Umum", value: "common_name", width: "15%" },
      { text: "Actions", value: "actions", sortable: false, width: "14%" },
    ],
    defaultItem: {
      id: "",
      tree_code: "",
      tree_name: "",
      scientific_name: "",
      common_name: "",
      english_name: "",
      short_information: "",
      description: "",
      tree_category: "",
      product_list: "",
      estimate_income: "",
      co2_capture: "",
      photo1: "",
      photo2: "",
      photo1save: "",
      photo2save: "",
      User: [],
      filephoto1: "",
      filephoto2: "",
      resultUpload: false,
    },
    banyakfile: 0,

    valid: true,

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
  }),
  watch: {
    'expansions.treeLocations.optionsMU.model': {
      async handler(newVal, oldVal) {
        if (newVal != oldVal) {
          await this.getTreeLocationsData(newVal, 'TABLE')
        }
      }
    },
    'dialogs.treeLocations.add.forms.mu_no': {
      async handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.dialogs.treeLocations.add.forms.KAYU = []
          this.dialogs.treeLocations.add.forms.MPTS = []
          this.dialogs.treeLocations.add.forms.CROPS = []
          if (newVal) {
            await this.getTreeLocationsData(newVal, 'FORM')
          }
        }
      }
    }
  },
  async mounted() {
    this.authtoken = localStorage.getItem("token");
    this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
    this.BaseUrlUpload = localStorage.getItem("BaseUrlUpload");
    this.User = JSON.parse(localStorage.getItem("User"));
    // getting Management Units Data
    this.$store.state.loadingOverlay = true
    this.$store.state.loadingOverlayText = 'Getting Management Units Data...'
    await this.getManagementUnits()
    this.$store.state.loadingOverlayText = null
    this.$store.state.loadingOverlay = false

    // Getting Table Data
    await this.initialize()
    // localStorage.setItem("token", this.authtoken);
    // this.getMU();
  },
  methods: {
    async initialize() {
      try {
        // getting Main Trees Data
        this.expansions.mainTrees.loading = true
        const response = await axios.get(this.BaseUrlGet + "GetTreesAll", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        })
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result.data;
        } else {
          this.dataobject = []
          console.log("Kosong")
        }
        await this.getTreeLocationsData(this.expansions.treeLocations.optionsMU.model, 'TABLE')
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      } finally {
        this.expansions.mainTrees.loading = false
      }
    },
    async getTreeLocationsData(MU, TYPE) {
      if (TYPE == 'TABLE') this.expansions.treeLocations.loading = true
      else this.dialogs.treeLocations.add.loading = true
      let params = {
        mu_no: MU || ''
      }
      await axios.get(this.BaseUrlGet + "GetTreesLocation?" + new URLSearchParams(params), {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        }).then((res) => {
          if (TYPE == 'TABLE') this.expansions.treeLocations.items = res.data.data.result.data
          else {
            res.data.data.result.data.forEach((val, index) => {
              this.dialogs.treeLocations.add.forms[val.category].push(val.tree_code)
            })
          }          
        }).catch(err => {
          if (TYPE == 'TABLE') this.expansions.treeLocations.items = []
          else {
            this.dialogs.treeLocations.add.forms.KAYU = []
            this.dialogs.treeLocations.add.forms.MPTS = []
            this.dialogs.treeLocations.add.forms.CROPS = []
          }
          if (err.response.status == 401) {
            this.alerttoken = true;
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }).finally(() => {
          if (TYPE == 'TABLE') this.expansions.treeLocations.loading = false
          else this.dialogs.treeLocations.add.loading = false
        })
    },
    async getManagementUnits() {
      this.expansions.treeLocations.optionsMU.loading = true
      await axios.get(this.BaseUrlGet + "GetManagementUnit", {
        headers: {
          Authorization: `Bearer ` + this.authtoken,
        },
      }).then((res) => {
        this.expansions.treeLocations.optionsMU.items = res.data.data.result
      }).catch(err => {
        this.expansions.treeLocations.optionsMU.items = []
        if (err.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }).finally(() => {
        this.expansions.treeLocations.optionsMU.loading = false
      })
    },
    async getDetail(item) {
      this.defaultItem.id = item.id;
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetTreesDetail?id=" + item.id,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.defaultItem = Object.assign({}, response.data.data.result);

          if (this.type == "Detail") {
            this.dialogDetail = true;
          }
          console.log(this.defaultItem.id);
          // this.itemsMU = response.data.data.result;
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
    async UploadData() {
      console.log(this.BaseUrlUpload);
      if (this.banyakfile != 0) {
        var i;
        var namafile;
        for (i = 1; i <= this.banyakfile; i++) {
          // console.log(i);
          const formData = new FormData();
          if (i == 1) {
            formData.append("files", this.defaultItem.filephoto1);
            namafile = this.defaultItem.tree_name + "_001";
          } else {
            formData.append("files", this.defaultItem.filephoto2);
            namafile = this.defaultItem.tree_name + "_002";
          }

          try {
            const response = await axios.post(
              this.BaseUrlUpload + "?nama=" + namafile.replace(/\s/g, "_"),
              formData,
              {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(response);
            if (response.data.success == true) {
              this.defaultItem.resultUpload = true;
              if (i == 1) {
                this.defaultItem.photo1save = response.data.TempName;
                console.log(response.data.TempName);
                console.log(this.defaultItem.photo1save);
              } else {
                this.defaultItem.photo2save = response.data.TempName;
                console.log(response.data.TempName);
                console.log(this.defaultItem.photo2save);
              }

              // this.dialog = false;
              // this.snackbar = true;
              // this.colorsnackbar = "green";
              // this.textsnackbar = "Sukses edit data";
              // this.initialize();
            } else {
              this.defaultItem.resultUpload = false;
              // this.dialog = false;
            }
          } catch (error) {
            console.error(error.response);
            if (error.response.status == 401) {
              this.defaultItem.resultUpload = false;
              // this.dialog = false;
            }
          }
        }
        this.banyakfile = 0;
      }
      // const val = "1";
      // // console.log(this.defaultItem.filephoto1);
      //

      // // this.dialogDetail = false;
      //
    },
    async addData(datapost) {
      // console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddTrees",
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
          this.textsnackbar = "Sukses add data";
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

    async editData(datapost) {
      // console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateTrees",
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
          this.textsnackbar = "Sukses edit data";
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
    async verifDelete() {
      const datapost = {
        id: this.defaultItem.id,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "DeleteTrees",
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

    showDetail(item) {
      this.defaultItem.id = item.id;
      this.type = "Detail";
      this.getDetail(item);
    },
    showAddModal() {
      this.defaultItem.id = "";
      this.defaultItem.tree_code = "";
      this.defaultItem.tree_name = "";
      this.defaultItem.scientific_name = "";
      this.defaultItem.common_name = "";
      this.defaultItem.english_name = "";
      this.defaultItem.short_information = "";
      this.defaultItem.description = "";
      this.defaultItem.tree_category = "";
      this.defaultItem.product_list = "";
      this.defaultItem.estimate_income = "";
      this.defaultItem.co2_capture = "";
      this.defaultItem.photo1 = "";
      this.defaultItem.photo2 = "";
      this.defaultItem.photo1save = "";
      this.defaultItem.photo2save = "";
      this.defaultItem.filephoto1 = "";
      this.defaultItem.filephoto2 = "";
      this.defaultItem.resultUpload = false;
      this.banyakfile = 0;
      this.dialog = true;
    },
    editItem(item) {
      // console.log(item);
      this.formTitle = "Edit Item";
      this.type = "Edit";
      this.getDetail(item);
      this.value = "edit";
      this.defaultItem.resultUpload = false;
      this.banyakfile = 0;
      this.dialogDetail = false;
      this.dialog = true;
    },
    deleteItem(item) {
      this.defaultItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    close() {
      this.dialog = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },

    pilihfoto1(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.photo1 = URL.createObjectURL(event);
        this.defaultItem.filephoto1 = event;
        var n = this.banyakfile;
        var hasil = n + 1;
        console.log(this.defaultItem.photo1);
        this.banyakfile = hasil;
      } else {
        this.defaultItem.photo1 = "";
        var n = this.banyakfile;
        if (n != 0) {
          var hasil = n - 1;
          this.banyakfile = hasil;
        }
      }
    },

    pilihfoto2(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.photo2 = URL.createObjectURL(event);
        this.defaultItem.filephoto2 = event;
        var n = this.defaultItem.banyakfile;
        var hasil = n + 1;
        this.defaultItem.banyakfile = hasil;
      } else {
        this.defaultItem.photo2 = "";
        var n = this.defaultItem.banyakfile;
        if (n != 0) {
          var hasil = n - 1;
          this.defaultItem.banyakfile = hasil;
        }
      }
    },

    async save() {
      console.log(this.banyakfile);
      this.$refs.form.validate();
      if (
        this.defaultItem.tree_category != null &&
        this.defaultItem.tree_name.length != 0 &&
        this.defaultItem.scientific_name.length != 0 &&
        this.defaultItem.common_name.length != 0
      ) {
        if (this.defaultItem.id) {
          console.log("edit");
          this.defaultItem.photo1save = this.defaultItem.photo1;
          this.defaultItem.photo2save = this.defaultItem.photo2;
          if (this.banyakfile > 0) {
            await this.UploadData();
          }
          const datapost = {
            id: this.defaultItem.id,
            tree_name: this.defaultItem.tree_name,
            scientific_name: this.defaultItem.scientific_name,
            common_name: this.defaultItem.common_name,
            short_information: this.defaultItem.short_information,
            tree_category: this.defaultItem.tree_category,
            english_name: this.defaultItem.english_name,
            description: this.defaultItem.description,
            product_list: this.defaultItem.product_list,
            estimate_income: this.defaultItem.estimate_income,
            co2_capture: this.defaultItem.co2_capture,
            photo1: this.defaultItem.photo1save,
            photo2: this.defaultItem.photo2save,
          };
          // console.log(this.defaultItem);
          // console.log(datapost);
          this.editData(datapost);
        } else {
          console.log("add");
          if (this.banyakfile > 0) {
            await this.UploadData();
          }
          const datapost = {
            tree_name: this.defaultItem.tree_name,
            scientific_name: this.defaultItem.scientific_name,
            common_name: this.defaultItem.common_name,
            short_information: this.defaultItem.short_information,
            tree_category: this.defaultItem.tree_category,
            english_name: this.defaultItem.english_name,
            description: this.defaultItem.description,
            product_list: this.defaultItem.product_list,
            estimate_income: this.defaultItem.estimate_income,
            co2_capture: this.defaultItem.co2_capture,
            photo1: this.defaultItem.photo1save,
            photo2: this.defaultItem.photo2save,
          };
          // console.log(datapost);
          this.addData(datapost);
        }
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Gagal Menambah, Kolom required tidak boleh ada yang kosong";
      }
      // this.close();
    },
    async saveTreeLocations() {
      this.dialogs.treeLocations.add.show = false 
      this.$store.state.loadingOverlayText = 'Adjust Tree Locations...'
      this.$store.state.loadingOverlay = true
      
      let dataForPost = {
        mu_no: this.dialogs.treeLocations.add.forms.mu_no,
        KAYU: this.dialogs.treeLocations.add.forms.KAYU || [],
        MPTS: this.dialogs.treeLocations.add.forms.MPTS || [],
        CROPS: this.dialogs.treeLocations.add.forms.CROPS || [],
      }
      console.log(dataForPost)
      await axios.post(this.BaseUrlGet + 'AdjustTreesLocation',dataForPost, {
        headers: {
          Authorization: `Bearer ` + this.authtoken,
        },
      }).then(response => {
        let res = response.data.data.result

        // show snackbar
        this.textsnackbar = `Success Adjust Trees in ${res.mu_name} (${res.deleted} -> ${parseInt(res.created.KAYU) + parseInt(res.created.MPTS) + parseInt(res.created.CROPS)})`
        this.timeoutsnackbar = 100000
        this.colorsnackbar = 'green rounded-xl'
        this.snackbar = true

        // reset form
        this.dialogs.treeLocations.add.forms = {
          mu_no: '',
          KAYU: [],
          MPTS: [],
          CROPS: []
        }
      }).catch(err => {
        console.log(err.response)
        if (err.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.dialogs.treeLocations.add.show = true 
        }
      }).finally(() => {
        this.$store.state.loadingOverlayText = null
        this.$store.state.loadingOverlay = false
      })
    },
    closeDialogAdjustTreeLocation() {
      this.dialogs.treeLocations.add.show = false
      // reset form
      this.dialogs.treeLocations.add.forms = {
        mu_no: '',
        KAYU: [],
        MPTS: [],
        CROPS: []
      }
    }
  },
};
</script>