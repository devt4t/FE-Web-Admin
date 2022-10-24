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

    <div class="mx-9">
      <v-alert :value="auth.alertToken" color="red" elevation="24" type="error">
        Session Token Login Habis, Login Kembali !
      </v-alert>
    </div>

    <!-- MODAL -->
    <!-- END: MODAL -->

    <v-expansion-panels v-model="expansions.model" class="mb-6 px-3" multiple>
      <!-- Filters Panel -->
      <v-expansion-panel class="rounded-xl ">
        <v-expansion-panel-header>
          <v-btn dark rounded color="info" class="mx-2"><v-icon class="mr-1">mdi-cog</v-icon> Set Progression Content</v-btn>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row class="mx-2 pt-2">
            <!-- Program year -->
            <v-col cols="12" sm="12" md="4">
              <v-select
                color="success"
                item-color="success"
                :menu-props="{rounded: 'xl', offsetY: true}"
                outlined
                hide-details
                rounded
                v-model="options.programYear.model"
                :items="options.programYear.items"
                label="Tahun Program"
                type="string"
                :rules="[(v) => !!v || 'Field is required']"
              ></v-select>
            </v-col>
            <!-- Unit Manager Option -->
            <v-col cols="12" lg="4">
              <v-autocomplete
                color="success"
                item-color="success"
                :menu-props="{rounded: 'xl'}"
                outlined
                hide-details
                rounded
                v-model="options.UM.model"
                :items="options.UM.items"
                :item-value="options.UM.itemValue"
                :item-text="options.UM.itemText"
                v-on:change="optionsChanged('UM')"
                :label="options.UM.loading ? 'Getting UM data...' : options.UM.label"
                :loading="options.UM.loading"
                :no-data-text="options.UM.loading ? 'Loading...' : 'No Data'"
                :placeholder="options.UM.loading ? 'Loading...' : 'Select UM'"
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
                color="success"
                item-color="success"
                :menu-props="{rounded: 'xl'}"
                outlined
                hide-details
                clearable
                rounded
                v-model="options.FC.model"
                :items="options.FC.items"
                :item-value="options.FC.itemValue"
                :item-text="options.FC.itemText"
                v-on:change="optionsChanged('FC')"
                :label="options.FC.loading ? 'Getting FC data...' : options.FC.label"
                :loading="options.FC.loading"
                :no-data-text="options.FC.loading ? 'Loading...' : 'No Data'"
                :placeholder="options.FC.loading ? 'Loading...' : 'Select FC'"
                :readonly="!access.filterFC"
              >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item[options.UM.itemText]"></v-list-item-title>
                    <v-list-item-subtitle>{{ data.item[options.UM.itemValue] }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <!-- Activities -->
            <v-col cols="12">
              <v-select
                color="success"
                item-color="success"
                item-text="value"
                item-value="value"
                :menu-props="{rounded: 'xl', offsetY: true}"
                outlined
                rounded
                hide-details
                chips
                multiple
                v-model="options.activities.model"
                :items="options.activities.items"
                :label="options.activities.loading ? 'Getting activities data...' : options.activities.label"
                :loading="options.activities.loading"
                :no-data-text="options.activities.loading ? 'Loading...' : 'No Data'"
                :placeholder="options.activities.loading ? 'Loading...' : 'Select activities'"
                :rules="[(v) => !!v || 'Field is required']"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    color="success"
                    close
                    @click="data.select"
                    @click:close="removeFromActivitiesInput(data.item)"
                  >
                    {{ data.item.value }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
            <!-- Petani Date Range -->
            <v-col cols="12" sm="12" md="6" lg="3" v-if="options.activities.model.includes('Pendataan Petani & Lahan') || options.activities.model.includes('Sosialisasi Tanam')">
              <p class="mb-1">Petani Date Range</p>
                  <v-menu 
                    rounded="xl"
                    v-model="menus.farmer"
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
                            rounded
                            color="green lighten-1"
                            v-bind="attrs"
                            v-on="{...menu, ...tooltip}"
                          >
                            <v-icon left> mdi-calendar </v-icon>
                            {{ dates.farmer.toString().replace(',', ' to ') }}
                          </v-btn>
                        </template>
                        <span>Klik untuk memunculkan datepicker</span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-date-picker 
                          color="green lighten-1 rounded-xl" 
                          range
                          rounded
                          v-model="dates.farmer"
                        ></v-date-picker>
                        <br>
                      </v-list-item>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green lighten-1"
                          center
                          rounded
                          @click="menus.farmer = false"
                        >
                          Ok
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-list-item>
                    </v-list>
                  </v-menu>
            </v-col>
            <!-- Lahan Date Range -->
            <v-col cols="12" sm="12" md="6" lg="3" v-if="options.activities.model.includes('Pendataan Petani & Lahan') || options.activities.model.includes('Sosialisasi Tanam')">
              <p class="mb-1">Lahan Date Range</p>
                  <v-menu 
                    rounded="xl"
                    v-model="menus.land"
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
                            rounded
                            color="green lighten-1"
                            v-bind="attrs"
                            v-on="{...menu, ...tooltip}"
                          >
                            <v-icon left> mdi-calendar </v-icon>
                            {{ dates.land.toString().replace(',', ' to ') }}
                          </v-btn>
                        </template>
                        <span>Klik untuk memunculkan datepicker</span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-date-picker 
                          color="green lighten-1 rounded-xl" 
                          range
                          rounded
                          v-model="dates.land"
                        ></v-date-picker>
                        <br>
                      </v-list-item>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green lighten-1"
                          center
                          rounded
                          @click="menus.land = false"
                        >
                          Ok
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-list-item>
                    </v-list>
                  </v-menu>
            </v-col>
            <!-- Sostam Date -->
            <v-col cols="12" sm="12" md="6" lg="3" v-if="options.activities.model.includes('Sosialisasi Tanam')">
              <p class="mb-1">Sostam Date</p>
                  <v-menu 
                    rounded="xl"
                    v-model="menus.sostam"
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
                            rounded
                            color="green lighten-1"
                            v-bind="attrs"
                            v-on="{...menu, ...tooltip}"
                          >
                            <v-icon left> mdi-calendar </v-icon>
                            {{ dates.sostam }}
                          </v-btn>
                        </template>
                        <span>Klik untuk memunculkan datepicker</span>
                      </v-tooltip>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-date-picker 
                          color="green lighten-1 rounded-xl" 
                          rounded
                          v-model="dates.sostam"
                        ></v-date-picker>
                        <br>
                      </v-list-item>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green lighten-1"
                          center
                          rounded
                          @click="menus.sostam = false"
                        >
                          Ok
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-list-item>
                    </v-list>
                  </v-menu>
            </v-col>
            <!-- Button -->
            <v-col cols="12" class="d-flex align-items-center justify-center">
              <v-btn
                class="mr-1 my-2 white--text px-10"
                @click="generateKPI()"
                color="blue"
                rounded
                :disabled="btn.generateButton.disabled"
                x-large
                :loading="btn.generateButton.loading"
              >
                <v-icon class="mr-1 " small>mdi-calendar-start</v-icon> 
                <span class="">Generate</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Filtered Panel -->
      <v-expansion-panel class="rounded-xl mt-2" v-if="filters.showed">
        <v-expansion-panel-header>
          <h3 class="dark--text"><v-icon class="mr-1">mdi-filter</v-icon> Filtered Panel</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-chip v-if="filters.UM" class="mx-2 my-1 px-4" color="success">UM - {{ filters.UM }}</v-chip>
          <v-chip v-if="filters.FC" class="mx-2 my-1  px-4" color="success">FC - {{ filters.FC }}</v-chip>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Pendataan Petani dan Lahan Panel -->
      <v-expansion-panel class="rounded-xl mt-2" v-if="tables.farmer.show">
        <v-expansion-panel-header>
          <h3 class="">Pendataan Petani & Lahan</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Main Table -->
          <v-data-table
            :headers="tables.farmer.headers"
            :items="tables.farmer.items"
            :search="tables.farmer.search"
            :loading="tables.farmer.loading"
            loading-text="Loading... Please wait"
            class="rounded-xl mx-3 pa-1 mb-5"
            :items-per-page="15"
            :footer-props="{
              itemsPerPageOptions: [8, 15, 30, -1]
            }"
          >
            <template v-slot:top>
              <v-row v-if="filters.FC" class="py-3 justify-center">
                <v-spacer class="d-none d-md-inline-block"></v-spacer>
                <v-btn 
                  @click="generateReport('Pendataan Petani & Lahan')"
                  color="info"
                  class="mb-2 d-none d-md-inline-block"
                  rounded
                >
                  <v-icon small class="mr-1">mdi-printer</v-icon>
                  Export
                </v-btn>
              </v-row>
            </template>
            <template v-slot:header.petani1>
              Petani ({{ dateFormat(filters.dates.farmer[0], 'DD MMM Y') }})
            </template>
            <template v-slot:header.petani2>
              Petani ({{ dateFormat(filters.dates.farmer[1], 'DD MMM Y') }})
            </template>
            <template v-slot:item.progress_petani="{item}">
              {{ item.progress_petani }}%
            </template>
            <template v-slot:header.lahan1>
              Lahan ({{ dateFormat(filters.dates.land[0], 'DD MMM Y') }})
            </template>
            <template v-slot:header.lahan2>
              Lahan ({{ dateFormat(filters.dates.land[1], 'DD MMM Y') }})
            </template>
            <template v-slot:item.progress_lahan="{item}">
              {{ item.progress_lahan }}%
            </template>
            <template v-slot:item.actions="{item, index}">
              <v-btn
                dark
                color="red"
                rounded
                icon
                @click="() => { tables.farmer.items.splice(index, 1) }"
              >
                <v-icon class="">mdi-close-circle</v-icon>
              </v-btn>
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
            ref="exportPDFPendataanPetaniLahan"
          >
            <section slot="pdf-content">
              <v-container>
                <center>
                  <h2>Pendataan Petani & Lahan</h2>
                  <h3>Activities Progress</h3>
                </center>
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
                      <tr>
                        <td>Export Date</td>
                        <td>:</td>
                        <td>{{ dateFormat(new Date(), 'DD MMMM Y') }}</td>
                      </tr>
                    </table>
                  </v-col>
                  <v-col sm="12">
                    <center>
                      <table border="1" style="border-collapse: collapse;width: 100%;">
                        <thead>
                          <tr>
                            <th rowspan="2">No</th>
                            <th rowspan="2">Nama FF</th>
                            <th colspan="4">Petani</th>
                            <th colspan="4">Lahan</th>
                          </tr>
                          <tr>
                            <th>{{ dateFormat(filters.dates.farmer[0], 'DD MMM Y') }}</th>
                            <th>{{ dateFormat(filters.dates.farmer[1], 'DD MMM Y') }}</th>
                            <th>Total</th>
                            <th>Progress</th>
                            <th>{{ dateFormat(filters.dates.land[0], 'DD MMM Y') }}</th>
                            <th>{{ dateFormat(filters.dates.land[1], 'DD MMM Y') }}</th>
                            <th>Total</th>
                            <th>Progress</th>
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
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Sosialisasi Tanam -->
      <v-expansion-panel class="rounded-xl mt-2" v-if="tables.sostam.show">
        <v-expansion-panel-header>
          <h3 class="">Sosialisasi Tanam</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Main Table -->
          <v-data-table
            :headers="tables.sostam.headers"
            :items="tables.sostam.items"
            :search="tables.sostam.search"
            :loading="tables.sostam.loading"
            loading-text="Loading... Please wait"
            class="rounded-xl mx-3 pa-1 mb-5"
            :items-per-page="15"
            :footer-props="{
              itemsPerPageOptions: [8, 15, 30, -1]
            }"
          >
            <template v-slot:top>
              <v-row v-if="filters.FC" class="py-3 justify-center">
                <v-spacer class="d-none d-md-inline-block"></v-spacer>
                <v-btn 
                  @click="generateReport('Sosialisasi Tanam')"
                  color="info"
                  class="mb-2 d-none d-md-inline-block"
                  rounded
                >
                  <v-icon small class="mr-1">mdi-printer</v-icon>
                  Export
                </v-btn>
              </v-row>
            </template>
            <template v-slot:item.actions="{item, index}">
              <v-btn
                dark
                color="red"
                rounded
                icon
                @click="() => { tables.sostam.items.splice(index, 1) }"
              >
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </template>
            <template v-slot:header.total_petani>
              Total Petani ({{ dateFormat(filters.dates.farmer[1], 'DD MMM Y') }})
            </template>
            <template v-slot:header.total_lahan>
              Total Lahan ({{ dateFormat(filters.dates.land[1], 'DD MMM Y') }})
            </template>
            <template v-slot:header.total_sostam>
              Total Sostam ({{ dateFormat(filters.dates.sostam, 'DD MMM Y') }})
            </template>
            <template v-slot:item.total_petani="{item}">
              <strong>{{ item.total_petani }}</strong> Petani
            </template>
            <template v-slot:item.total_lahan="{item}">
              <strong>{{ item.total_lahan }}</strong> Lahan
            </template>
            <template v-slot:item.total_sostam="{item}">
              <strong>{{ item.total_sostam }}</strong> Sostam
            </template>
            <template v-slot:item.progress_sostam="{item}">
              <strong>{{ item.progress_sostam }}</strong>%
            </template>
            <template v-slot:item.total_bibit="{item}">
              <strong>{{ numberFormat(item.total_bibit) }}</strong> Bibit
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
            ref="exportPDFSosialisasiTanam"
          >
            <section slot="pdf-content">
              <v-container>
                <center>
                  <h2>Pendataan Sosialisasi Tanam</h2>
                  <h3>Activities Progress</h3>
                </center>
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
                      <tr>
                        <td>Export Date</td>
                        <td>:</td>
                        <td>{{ dateFormat(new Date(), 'DD MMMM Y') }}</td>
                      </tr>
                    </table>
                  </v-col>
                  <v-col sm="12">
                    <center>
                      <table border="1" style="border-collapse: collapse;width: 100%;">
                        <thead>
                          <tr>
                            <th rowspan="2">No</th>
                            <th rowspan="2">Nama FF</th>
                            <th rowspan="2">Total Petani</th>
                            <th rowspan="2">Total Lahan</th>
                            <th colspan="2">Sosialisasi Tanam</th>
                          </tr>
                          <tr>
                            <th>{{ dateFormat(filters.dates.sostam, 'DD MMM Y') }}</th>
                            <th>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(data, dIndex) in tables.sostam.items" :key="dIndex">
                            <td align="center">{{ dIndex + 1 }}</td>
                            <td style="padding-left: 5px">{{ data.ff }}</td>
                            <td align="center">{{ data.total_petani }}</td>
                            <td align="center">{{ data.total_lahan }}</td>
                            <td align="center">{{ data.total_sostam }}</td>
                            <td align="center">{{ data.progress_sostam }}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </center>
                  </v-col>
                </v-row>
              </v-container>
            </section>
          </vue-html2pdf>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

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
      farmer: ['2022-08-31','2022-09-30'],
      land: ['2022-10-03','2022-10-31'],
      sostam: '2022-11-15'
    },
    btn: {
      generateButton: {
        loading: false,
        disabled: true
      }
    },
    expansions: {
      model: [0]
    },
    filters: {
      showed: false,
      activities: [],
      dates: {
        farmer: [],
        land: [],
        sostam: ''
      },
      programYear: '',
      UM: '',
      FC: '',
      FF: '',
    },
    menus: {
      farmer: false,
      land: false,
      sostam: false,
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
      activities: {
        items: [
          {value: "Pendataan Petani & Lahan", disabled: false},
          {value: "Sosialisasi Tanam", disabled: false},
          {value: "Penilikan Lubang", disabled: true},
          {value: "Realisasi Tanam", disabled: true},
        ],
        label: 'Activities',
        loading: false,
        model: [],
      }
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
          { text: "Actions", value: "actions", align: 'center', sortable: false },
        ],
        items: [],
        loading: false,
        search: '',
        show: false
      },
      land: {
        headers: [],
        items: [],
        loading: false,
        search: ''
      },
      sostam: {
        headers: [
          { text: "Field Facilitator", value: "ff" },
          { text: "Total Petani", value: "total_petani", align: 'center' },
          { text: "Total Lahan", value: "total_lahan", align: 'center' },
          { text: "Sostam", value: "total_sostam", align: 'center' },
          { text: "Sostam Progress", value: "progress_sostam", align: 'center' },
          { text: "Total Bibit", value: "total_bibit", align: 'center' },
          { text: "Actions", value: "actions", align: 'center', sortable: false },
        ],
        items: [
          {
            ff: 'Asep',
            total_lahan: 35,
            total_sostam: 20,
            progress_sostam: '57%',
            total_bibit: '1900 Bibit'
          }
        ],
        loading: false,
        search: '',
        show: false
      },
    }
  }),

  async mounted() {
    await this.firstAccessPage();
    this.options.programYear.model = new Date().getFullYear().toString()
    // this.filters.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 70000)).toISOString().substr(0, 10)
    // if (this.auth.user.role_group != 'IT') {
    //   this.$store.state.maintenanceOverlay = true
    // }
  },
  destroyed() {
    // this.$store.state.maintenanceOverlay = false
  },

  watch: {
    'filters.activities': {
      handler(newValue) {
        console.log(newValue)
      }
    },
    'options.UM.model': {
      handler() {
        this.getButtonGenerateKPIDisabledCondition()
      }
    },
    'options.FC.model': {
      handler() {
        this.getButtonGenerateKPIDisabledCondition()
      }
    },
    'options.activities.model': {
      handler() {
        this.getButtonGenerateKPIDisabledCondition()
      }
    },
    'dates.farmer': {
      handler() {
        this.getButtonGenerateKPIDisabledCondition()
      }
    },
    'dates.land': {
      handler() {
        this.getButtonGenerateKPIDisabledCondition()
      }
    },
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
    async generateKPI() {
      this.btn.generateButton.loading = true
      
      const activitiesActive = this.options.activities.model
      let openedPanel = []
      // Pendataan Petani & Lahan
      if (activitiesActive.includes('Pendataan Petani & Lahan')) {
        openedPanel.push(2)
        this.filters.activities.push('Pendataan Petani & Lahan')
        this.tables.farmer.show = true
      } else {
        openedPanel.forEach((val, index) => {
          if (val == 'Pendataan Petani & Lahan') {
            openedPanel.slice(index, 1)
          }
        });
        this.tables.farmer.show = false
      }
      // Sosialisasi Tanam
      if (activitiesActive.includes('Sosialisasi Tanam')) {
        if (openedPanel.includes(2)) {
          openedPanel.push(3)
        } else {
          openedPanel.push(2)
        }
        this.filters.activities.push('Sosialisasi Tanam')
        this.tables.sostam.show = true
      } else {
        openedPanel.forEach((val, index) => {
          if (val == 'Sosialisasi Tanam') {
            openedPanel.slice(index, 1)
          }
        })
        this.tables.sostam.show = false
      }

      this.filters.showed = true
      this.expansions.model = [1, ...openedPanel]

      if (this.options.UM.model && this.options.FC.model) {
        await this.generateKPIbyFC(this.options.FC.model)
      } else if (this.options.UM.model) {
        await this.generateKPIbyUM()
      }

      this.btn.generateButton.loading = false
    },
    async generateKPIbyFC(fc_no) {
      try {
        // remove FC in table farmer
        this.tables.farmer.headers.forEach((farmerHeader, farmerHeaderIndex) => {
          if (farmerHeader.text == 'FC') {
            this.tables.farmer.headers.splice(farmerHeaderIndex, 1)
          }
        })
        // remove FC in table sostam
        this.tables.sostam.headers.forEach((sostamHeader, sostamHeaderIndex) => {
          if (sostamHeader.text == 'FC') {
            this.tables.sostam.headers.splice(sostamHeaderIndex, 1)
          }
        })

        let params = new URLSearchParams({
          activities: this.options.activities.model.join(),
          fc_no: fc_no,
          program_year: this.options.programYear.model,
          dates: [this.dates.farmer[0], this.dates.farmer[1], this.dates.land[0], this.dates.land[1], this.dates.sostam]
        })
        this.tables.farmer.loading = true
        this.tables.sostam.loading = true

        const response = await axios.get(
          this.auth.baseUrlGet +
            "KPIFC?" + params,
          {
            headers: {
              Authorization: `Bearer ` + this.auth.token,
            },
          }
        );
        let datas = response.data.data.result

        // get farmer land data
        let farmers = []
        if (datas.petani_lahan.length > 0) {
          await datas.petani_lahan.forEach(val => {
            farmers.push({
              ff: val.ff,
              ...val.petani,
              ...val.lahan
            })
          })
        }

        // set table data
        this.tables.farmer.items = farmers
        this.tables.sostam.items = datas.sostam
        // set filter data
        await this.setFilterData(datas)
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
      } finally {
        this.tables.farmer.loading = false
        this.tables.sostam.loading = false
      }
    },
    async generateKPIbyUM() {
      try {
        this.tables.farmer.loading = true
        this.tables.sostam.loading = true
        this.$store.state.loadingOverlay = true

        // add FC in table farmer
        this.tables.farmer.headers = [
          { text: "FC", value: "fc" },
          ...this.tables.farmer.headers
        ]
        // add FC in table sostam
        this.tables.sostam.headers = [
          { text: "FC", value: "fc" },
          ...this.tables.sostam.headers
        ]

        const fieldCoordinators = this.options.FC.items || [] 

        let farmers = []
        let sostams = []
        
        let totalFC = fieldCoordinators.length
        let generatedFC = 0

        this.$store.state.loadingOverlayText = `Getting KPI FC (<strong>${generatedFC} / ${totalFC}</strong>) datas...`

        await Promise.all(fieldCoordinators.map(async (fcVal, fcIndex) => {
          let params = new URLSearchParams({
            activities: this.options.activities.model.join(),
            fc_no: fcVal.nik,
            program_year: this.options.programYear.model,
            dates: [this.dates.farmer[0], this.dates.farmer[1], this.dates.land[0], this.dates.land[1], this.dates.sostam]
          })
  
          axios.get(
            this.auth.baseUrlGet +
              "KPIFC?" + params,
            {
              headers: {
                Authorization: `Bearer ` + this.auth.token,
              },
            }
          ).then(response => {
            let datas = response.data.data.result
            // get farmer & land data
            if (datas.petani_lahan.length > 0) {
              datas.petani_lahan.forEach(plVal => {
                farmers.push({
                  fc: fcVal.name,
                  ff: plVal.ff,
                  ...plVal.petani,
                  ...plVal.lahan
                })
              })
            }
  
            // get sostam
            if (datas.sostam.length > 0) {
              datas.sostam.forEach(sosVal => {
                sostams.push({
                  fc: fcVal.name,
                  ...sosVal
                })
              })
            }
  
            // set filter data
            if (fcIndex == 0) {
              this.setFilterData({um: datas.um})
            } 
  
            // update progress text
            this.$store.state.loadingOverlayText = `Getting KPI FC (<strong>${generatedFC += 1} / ${totalFC}</strong>) datas...`
          }).catch(err => {
            console.error(err)
            this.sessionEnd(err)
            generatedFC += 1
          }).finally(() => {
            if (generatedFC == totalFC) {
              this.$store.state.loadingOverlay = false
  
              this.tables.farmer.loading = false
              this.tables.sostam.loading = false
            }
          })
        }))
        
        // set datas to tables
        this.tables.farmer.items = farmers
        this.tables.sostam.items = sostams
      } catch (error) {
        console.error(error)
      }
    },
    removeFromActivitiesInput (item) {
      const index = this.options.activities.model.indexOf(item.value)
      if (index >= 0) this.options.activities.model.splice(index, 1)
    },
    getButtonGenerateKPIDisabledCondition() {
      let requiredNull = 0
      // required UM
      if (!this.options.UM.model) requiredNull += 1
      // required activities
      if (this.options.activities.model.length < 1) requiredNull += 1
      else {
        // pendataan petani dan lahan
        if (this.options.activities.model.includes('Pendataan Petani & Lahan')) {
          if (this.dates.farmer.length < 2 || this.dates.land.length < 2) requiredNull += 1
          else {
            // fixing dates farmer
            if (this.dates.farmer[0] > this.dates.farmer[1]) {
              const reconstructionFarmerDate = [this.dates.farmer[1], this.dates.farmer[0]]
              this.dates.farmer = reconstructionFarmerDate
            }
            // fixing dates lahan
            if (this.dates.land[0] > this.dates.land[1]) {
              const reconstructionLandDate = [this.dates.land[1], this.dates.land[0]]
              this.dates.land = reconstructionLandDate
            }
          }
        }
      }
      
      if (requiredNull == 0) this.btn.generateButton.disabled = false
      else this.btn.generateButton.disabled = true
    },
    // Utilities Function
    setFilterData(datas) {
      // set management
      this.filters.UM = datas.um || ''
      this.filters.FC = datas.fc || ''
      
      
      // set date
      this.filters.dates.farmer = this.dates.farmer
      this.dates.farmer = ['2022-08-31', '2022-09-30']
      this.filters.dates.land = this.dates.land
      this.dates.land = ['2022-10-03' ,'2022-10-31']
      this.filters.dates.sostam = this.dates.sostam
      this.dates.sostam = '2022-11-15'
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
    generateReport (activities) {
       if (activities == 'Pendataan Petani & Lahan') {
         this.$refs.exportPDFPendataanPetaniLahan.generatePdf()
       } else if (activities == 'Sosialisasi Tanam') {
         this.$refs.exportPDFSosialisasiTanam.generatePdf()
       }
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
    numberFormat(num) {
        return new Intl.NumberFormat('id-ID').format(num)
    },
    sessionEnd(error) {
      if (typeof error.response.status != 'undefined') {
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    }
  },
};
</script>