<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="[{
        text: 'Activities',
        disabled: true,
        href: 'breadcrumbs_dashboard',
      },{
        text: 'Progress',
        disabled: true,
        href: 'breadcrumbs_link_1',
      }]"
      divider='>'
      large
    ></v-breadcrumbs>
    

    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        color="green"
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <div class="mx-9">
      <v-alert :value="auth.alertToken" color="red" elevation="24" type="error">
        Session Token Login Habis, Login Kembali !
      </v-alert>
    </div>

    <!-- MODAL -->
    <!-- END: MODAL -->

    <!-- Filters Panel -->
    <v-expansion-panels v-model="expansions.model" class="px-3">
      <v-expansion-panel class="mb-6 rounded-lg ">
        <v-expansion-panel-header>
          Filters
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row class="mx-2 pt-2">
            <!-- Program year -->
            <v-col cols="12" sm="12" md="12">
              <v-select
                v-model="options.programYear.model"
                :items="options.programYear.items"
                label="Tahun Program"
                outlined
                type="string"
                :rules="[(v) => !!v || 'Field is required']"
              ></v-select>
            </v-col>
            <!-- Date 1 -->
            <v-col cols="12" sm="12" md="6" lg="3">
              <p class="mb-1">Petani Date 1</p>
                  <v-menu 
                    rounded="lg"
                    v-model="menus.farmer.date1"
                    transition="slide-x-transition"
                    bottom
                    right
                    offset-x
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on: menu, attrs }">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-btn
                            color="green lighten-1"
                            v-bind="attrs"
                            v-on="{...menu, ...tooltip}"
                          >
                            <v-icon left> mdi-calendar </v-icon>
                            {{ dates.farmer.date1 }}
                          </v-btn>
                        </template>
                        <span>Klik untuk memunculkan datepicker</span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-date-picker 
                          color="green lighten-1" 
                          v-model="dates.farmer.date1"
                        ></v-date-picker>
                        <br>
                      </v-list-item>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green lighten-1"
                          center
                          @click="menus.farmer.date1 = false"
                        >
                          Ok
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-list-item>
                    </v-list>
                  </v-menu>
            </v-col>
            <!-- Date 2 -->
            <v-col cols="12" sm="12" md="6" lg="3">
              <p class="mb-1">Petani Date 2</p>
                  <v-menu 
                    rounded="lg"
                    v-model="menus.farmer.date2"
                    transition="slide-x-transition"
                    bottom
                    right
                    offset-x
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on: menu, attrs }">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-btn
                            color="green lighten-1"
                            v-bind="attrs"
                            v-on="{...menu, ...tooltip}"
                          >
                            <v-icon left> mdi-calendar </v-icon>
                            {{ dates.farmer.date2 }}
                          </v-btn>
                        </template>
                        <span>Klik untuk memunculkan datepicker</span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-date-picker 
                          color="green lighten-1" 
                          v-model="dates.farmer.date2"
                        ></v-date-picker>
                        <br>
                      </v-list-item>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green lighten-1"
                          center
                          @click="menus.farmer.date2 = false"
                        >
                          Ok
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-list-item>
                    </v-list>
                  </v-menu>
            </v-col>
            <!-- Date 3 -->
            <v-col cols="12" sm="12" md="6" lg="3">
              <p class="mb-1">Lahan Date 1</p>
                  <v-menu 
                    rounded="lg"
                    v-model="menus.land.date1"
                    transition="slide-x-transition"
                    bottom
                    right
                    offset-x
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on: menu, attrs }">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-btn
                            color="green lighten-1"
                            v-bind="attrs"
                            v-on="{...menu, ...tooltip}"
                          >
                            <v-icon left> mdi-calendar </v-icon>
                            {{ dates.land.date1 }}
                          </v-btn>
                        </template>
                        <span>Klik untuk memunculkan datepicker</span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-date-picker 
                          color="green lighten-1" 
                          v-model="dates.land.date1"
                        ></v-date-picker>
                        <br>
                      </v-list-item>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green lighten-1"
                          center
                          @click="menus.land.date1 = false"
                        >
                          Ok
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-list-item>
                    </v-list>
                  </v-menu>
            </v-col>
            <!-- Date 4 -->
            <v-col cols="12" sm="12" md="6" lg="3">
              <p class="mb-1">Lahan Date 2</p>
                  <v-menu 
                    rounded="lg"
                    v-model="menus.land.date2"
                    transition="slide-x-transition"
                    bottom
                    right
                    offset-x
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on: menu, attrs }">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-btn
                            color="green lighten-1"
                            v-bind="attrs"
                            v-on="{...menu, ...tooltip}"
                          >
                            <v-icon left> mdi-calendar </v-icon>
                            {{ dates.land.date2 }}
                          </v-btn>
                        </template>
                        <span>Klik untuk memunculkan datepicker</span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-date-picker 
                          color="green lighten-1" 
                          v-model="dates.land.date2"
                        ></v-date-picker>
                        <br>
                      </v-list-item>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green lighten-1"
                          center
                          @click="menus.land.date2 = false"
                        >
                          Ok
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-list-item>
                    </v-list>
                  </v-menu>
            </v-col>
            <!-- Unit Manager Option -->
            <v-col cols="12" lg="4">
              <v-autocomplete
                v-model="options.UM.model"
                :items="options.UM.items"
                :item-value="options.UM.itemValue"
                :item-text="options.UM.itemText"
                v-on:change="optionsChanged('UM')"
                :label="options.UM.loading ? 'Getting UM data...' : options.UM.label"
                :loading="options.UM.loading"
                :no-data-text="options.UM.loading ? 'Loading...' : 'No Data'"
                :placeholder="options.UM.loading ? 'Loading...' : 'Select UM'"
                outlined
                :readonly="!access.filterUM"
                :rules="[(v) => !!v || 'Field is required']"
              >
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title v-html="data.item[options.UM.itemText]"></v-list-item-title>
                  <v-list-item-subtitle>{{ data.item[options.UM.itemValue] }}</v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            </v-col>
            <!-- Field Coordinator Option -->
            <v-col cols="12" lg="4">
              <v-autocomplete
                v-model="options.FC.model"
                :items="options.FC.items"
                :item-value="options.FC.itemValue"
                :item-text="options.FC.itemText"
                v-on:change="optionsChanged('FC')"
                :label="options.FC.loading ? 'Getting FC data...' : options.FC.label"
                :loading="options.FC.loading"
                :no-data-text="options.FC.loading ? 'Loading...' : 'No Data'"
                :placeholder="options.FC.loading ? 'Loading...' : 'Select FC'"
                outlined
                :readonly="!access.filterFC"
                :rules="[(v) => !!v || 'Field is required']"
              >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item[options.UM.itemText]"></v-list-item-title>
                    <v-list-item-subtitle>{{ data.item[options.UM.itemValue] }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <!-- Button -->
            <v-col cols="12" lg="4" class="d-flex align-items-center">
              <v-btn
                class="mr-1 mt-2 text--white"
                @click="generateKPI()"
                color="blue"
                :disabled="!options.FC.model"
              >
                <v-icon class="mr-1" small>mdi-check-circle</v-icon> Generate
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Main Table -->
    <v-data-table
      :headers="tables.farmer.headers"
      :items="tables.farmer.items"
      :search="tables.farmer.search"
      :loading="tables.farmer.loading"
      loading-text="Loading... Please wait"
      class="rounded-lg elevation-6 mx-3 pa-1 mb-5"
      :items-per-page="15"
      :footer-props="{
        itemsPerPageOptions: [8, 15, 30, -1]
      }"
    >
      <template v-slot:top>
        <div class="py-3">
          <v-btn v-if="filters.UM" class="mx-2">UM - {{ filters.UM }}</v-btn>
          <v-btn class="mx-2" v-if="filters.FC">FC - {{ filters.FC }}</v-btn>
          <v-btn 
            @click="generateReport"
            color="info"
            class="ml-2"
          >
            <v-icon small class="mr-1">mdi-printer</v-icon>
            Export
          </v-btn>
        </div>
      </template>
      <template v-slot:header.petani1>
        Petani {{ filters.dates.farmer.date1 }}
      </template>
      <template v-slot:header.petani2>
        Petani {{ filters.dates.farmer.date2 }}
      </template>
      <template v-slot:item.progress_petani="{item}">
        {{ item.progress_petani }}%
      </template>
      <template v-slot:header.lahan1>
        Lahan {{ filters.dates.land.date1 }}
      </template>
      <template v-slot:header.lahan2>
        Lahan {{ filters.dates.land.date2 }}
      </template>
      <template v-slot:item.progress_lahan="{item}">
        {{ item.progress_lahan }}%
      </template>
    </v-data-table>

    <!-- Export Template -->
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      :filename="`Progress FF | FC ${filters.FC} | UM ${filters.UM}`"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="1125px"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <v-container>
          <v-row>
            <v-col sm="6" class="mb-2">
              <table>
                <tr>
                  <td>Unit Manager</td>
                  <td>:</td>
                  <td>{{ filters.UM }}</td>
                </tr>
                <tr>
                  <td>Field Coordinator</td>
                  <td>:</td>
                  <td>{{ filters.FC }}</td>
                </tr>
              </table>
            </v-col>
            <v-col sm="12">
              <h3>Petani</h3>
              <center>
                <table border="1" style="border-collapse: collapse;width: 100%;">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama FF</th>
                      <th>Petani {{ filters.dates.farmer.date1 }}</th>
                      <th>Petani {{ filters.dates.farmer.date2 }}</th>
                      <th>Petani Total</th>
                      <th>Petani Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(data, dIndex) in tables.farmer.items" :key="dIndex">
                      <td align="center">{{ dIndex + 1 }}</td>
                      <td style="padding-left: 5px">{{ data.ff }}</td>
                      <td align="center">{{ data.petani1 }}</td>
                      <td align="center">{{ data.petani2 }}</td>
                      <td align="center">{{ data.total_petani }}</td>
                      <td align="center">{{ data.progress_petani }}%</td>
                    </tr>
                  </tbody>
                </table>
              </center>
            </v-col>
            <v-col sm="12">
              <h3>Lahan</h3>
              <center>
                <table border="1" style="border-collapse: collapse;width: 100%;">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama FF</th>
                      <th>Lahan {{ filters.dates.land.date1 }}</th>
                      <th>Lahan {{ filters.dates.land.date2 }}</th>
                      <th>Lahan Total</th>
                      <th>Lahan Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(data, dIndex) in tables.farmer.items" :key="dIndex">
                      <td align="center">{{ dIndex + 1 }}</td>
                      <td style="padding-left: 5px">{{ data.ff }}</td>
                      <td align="center">{{ data.lahan1 }}</td>
                      <td align="center">{{ data.lahan2 }}</td>
                      <td align="center">{{ data.total_lahan }}</td>
                      <td align="center">{{ data.progress_lahan }}%</td>
                    </tr>
                  </tbody>
                </table>
              </center>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </vue-html2pdf>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
// import ModalFarmer from "./ModalFarmer";
import axios from "axios";
import { truncate } from "fs";
import { randomInt } from 'crypto';
// import BaseUrl from "../../services/BaseUrl.js";
import moment from 'moment'
import VueHtml2pdf from 'vue-html2pdf'

export default {
  name: "LubangTanam",
  components: {
    VueHtml2pdf
  },
  data: () => ({
    access: {
      filterUM: false,
      filterFC: false,
      filterFF: false,
    },
    auth: {
      alertToken: false,
      baseUrl: '',
      baseUrlGet: '',
      baseUrlUpload: '',
      ff: '',
      token: "",
      typegetdata: '',
      user: '',
    },
    dates: {
      farmer: {
        date1: '2022-08-31',
        date2: '2022-09-30',
      },
      land: {
        date1: '2022-10-03',
        date2: '2022-10-31',
      },
    },
    expansions: {
      model: 0
    },
    filters: {
      dates: {
        farmer: {
          date1: '',
          date2: ''
        },
        land: {
          date1: '',
          date2: ''
        }
      },
      programYear: '',
      UM: '',
      FC: '',
      FF: '',
    },
    menus: {
      farmer: {
        date1: false,
        date2: false,
      },
      land: {
        date1: false,
        date2: false,
      },
    },
    options: {
      FC: {
        itemText: 'name',
        itemValue: 'nik',
        items: [],
        label: 'Field Coordinator',
        loading: false,
        model: '',
      },
      programYear: {
        items: ['2021', '2022', '2023'],
        model: ''
      },
      UM: {
        itemText: 'name',
        itemValue: 'nik',
        items: [],
        label: 'Unit Manager',
        loading: false,
        model: '',
      },
    },
    overlay: false,
    snackbar: {
      color: 'green',
      show: false,
      text: 'Snackbar',
      timeout: 3000
    },
    tables: {
      farmer: {
        headers: [
          { text: "Field Facilitator", value: "ff" },
          { text: "petani1", value: "petani1", align: 'center' },
          { text: "petani2", value: "petani2", align: 'center' },
          { text: "Petani Total", value: "total_petani", align: 'center' },
          { text: "Petani Progress", value: "progress_petani", align: 'center' },
          { text: "lahan1", value: "lahan1", align: 'center' },
          { text: "lahan2", value: "lahan2", align: 'center' },
          { text: "Lahan Total", value: "total_lahan", align: 'center' },
          { text: "Lahan Progress", value: "progress_lahan", align: 'center' },
        ],
        items: [],
        loading: false,
        search: ''
      },
      land: {
        headers: [],
        items: [],
        loading: false,
        search: ''
      },
    }
  }),

  async created() {
    await this.firstAccessPage();
    this.options.programYear.model = new Date().getFullYear().toString()
    // this.filters.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 70000)).toISOString().substr(0, 10)
  },

  methods: {
    async firstAccessPage() {
      this.auth.token = localStorage.getItem("token")
      this.auth.user = JSON.parse(localStorage.getItem("User"))
      this.auth.ff = this.auth.user.ff.ff
      this.auth.typegetdata = this.auth.user.ff.value_data
      this.auth.baseUrlGet = localStorage.getItem("BaseUrlGet")
      this.auth.baseUrl = localStorage.getItem("BaseUrl")
      this.auth.baseUrlUpload = localStorage.getItem("BaseUrlUpload")
      await this.checkRoleAccess()
      await this.getUMAll()
    },
    optionsChanged(type) {
      if (type == 'UM') {
        if (this.options.UM.model) {
          this.getFCbyManager(this.options.UM.model)
        } 
      }
    },
    async getUMAll() {
      try {
        this.options.UM.loading = true
        const response = await axios.get(
          this.auth.baseUrlGet + "GetEmployeebyPosition?position_code=20",
          {
            headers: {
              Authorization: `Bearer ` + this.auth.token,
            },
          }
        );
        this.options.UM.items = response.data.data.result.data
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
      } finally {
        this.options.UM.loading = false
      }
    },
    async getFCbyManager(valcodeum) {
      this.options.FC.model = ''
      this.options.FC.loading = true
      try {
        const response = await axios.get(
          this.auth.baseUrlGet +
            "GetEmployeebyManager?manager_code=" +
            valcodeum +
            "&position=19",
          {
            headers: {
              Authorization: `Bearer ` + this.auth.token,
            },
          }
        );
          this.options.FC.items = response.data.data.result.data
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
      } finally {
        this.options.FC.loading = false
      }
    },
    async generateKPI(){
      if (this.options.FC.model) {
        await this.generateKPIbyFC(this.options.FC.model)
      }
    },
    async generateKPIbyFC(fc_no) {
      let params = new URLSearchParams({
        fc_no: fc_no,
        program_year: this.options.programYear.model,
        dates: [this.dates.farmer.date1, this.dates.farmer.date2, this.dates.land.date1, this.dates.land.date2]
      })
      this.tables.farmer.loading = true
      try {
        const response = await axios.get(
          this.auth.baseUrlGet +
            "KPIFC?" + params,
          {
            headers: {
              Authorization: `Bearer ` + this.auth.token,
            },
          }
        );
        console.log(response.data.data.result)
        let datas = response.data.data.result
        let farmers = []
        let lands = []
        if (datas.length > 0) {
          await datas.forEach(val => {
            farmers.push({
              ff: val.ff,
              ...val.petani,
              ...val.lahan
            })
            lands.push(val.lahan)
          })
        }
        // set table data
        this.tables.farmer.items = farmers
        this.tables.land.items = lands
        // set filter data
        await this.setFilterData(datas)
        // minimize expansions filter panel
        this.expansions.model = 1
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
      } finally {
        this.tables.farmer.loading = false
      }
    },
    // Utilities Function
    setFilterData(datas) {
      // set management
      if (datas.length > 0) {
        this.filters.UM = datas[0].um
        this.filters.FC = datas[0].fc
      }
      
      
      // set date
      this.filters.dates.farmer.date1 = this.dates.farmer.date1
      this.filters.dates.farmer.date2 = this.dates.farmer.date2
      this.dates.farmer.date1 = '2022-08-31'
      this.dates.farmer.date2 = '2022-09-30'
      this.filters.dates.land.date1 = this.dates.land.date1
      this.filters.dates.land.date2 = this.dates.land.date2
      this.dates.land.date1 = '2022-10-03'
      this.dates.land.date2 = '2022-10-31'
    },
    getProgramYearPetani(text) {
        if (text.slice(13, 14) === '_') {
            return text.slice(9, 13)
        } else {
            return text.slice(4, 8)
        }
    },
    checkRoleAccess() {
      if (this.auth.user.role_group == "IT") {
        this.access.filterUM = true
        this.access.filterFC = true
        this.access.filterFF = true
      }
    },
    dateFormat(date, format) {
        return moment(date).format(format)
    },
    generateReport () {
        this.$refs.html2Pdf.generatePdf()
    },
    generateFormData(data) {
        let formData= new FormData()

        const objectArray= Object.entries(data)

        objectArray.forEach(([key, value]) => {

            if (Array.isArray(value)){
            value.map(item => {
                formData.append(key+'[]' , item)
            })
            }else {
            formData.append(key, value)
            }
        })
        return formData
    },
    sessionEnd(error) {
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
    }
  },
};
</script>