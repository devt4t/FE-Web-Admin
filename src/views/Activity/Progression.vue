<template>
  <div>
    <v-breadcrumbs
      data-aos="fade-right"
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
      <!-- Confirmation -->
      <v-dialog v-model="confirmation.show" max-width="500px" persistent content-class="rounded-lg" scrollable>
          <v-card class="rounded-xl">
              <v-card-title class="mb-1 headermodalstyle">
                  <v-icon class="mr-2 white--text">mdi-help-circle</v-icon>
                  <span>Confirmation</span>
                  <v-divider dark class="mx-2"></v-divider>
                  <v-icon color="red" @click="confirmation.show = false">mdi-close-circle</v-icon>
              </v-card-title>
              <v-card-text>
                  <h2 class="text-center pt-4">{{ confirmation.title }}</h2>
                  <v-row class="mt-10 align-center mb-0">
                      <v-divider class="mx-2"></v-divider>
                      <v-btn rounded color="red white--text mr-1" @click="confirmation.show = false">
                          <v-icon class="mr-1">mdi-close-circle</v-icon>
                          Close
                      </v-btn>
                      <v-btn rounded color="green white--text ml-1" @click="confirmationOk(confirmation.okText)">
                          <v-icon class="mr-1">mdi-check-circle</v-icon>
                          {{ confirmation.okText }}
                      </v-btn>
                      <v-divider class="mx-2"></v-divider>
                  </v-row>
              </v-card-text>
          </v-card>
      </v-dialog>
    <!-- END: MODAL -->

    <v-expansion-panels v-model="expansions.model" class="mb-6 px-3" multiple data-aos="fade-up" data-aos-delay="200">
      <!-- Filters Panel -->
      <v-expansion-panel class="rounded-xl ">
        <v-expansion-panel-header>
          <v-btn dark rounded color="green" class="mx-2"><v-icon class="mr-1">mdi-cog</v-icon> Set Progression Content</v-btn>
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
                :items="$store.state.programYear.options"
                label="Program Year"
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
                :rules="[(v) => !!v || 'Field is required']"
                :disabled="options.UM.disabled"
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
            <v-col cols="12" sm="12" md="6" lg="3" v-if="options.activities.model.includes('Pendataan Petani & Lahan') || options.activities.model.includes('Sosialisasi Tanam') || options.activities.model.includes('Penilikan Lubang') || options.activities.model.includes('Distribusi')">
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
            <v-col cols="12" sm="12" md="6" lg="3" v-if="options.activities.model.includes('Pendataan Petani & Lahan') || options.activities.model.includes('Sosialisasi Tanam') || options.activities.model.includes('Penilikan Lubang')">
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
            <v-col cols="12" sm="12" md="6" lg="2" v-if="options.activities.model.includes('Sosialisasi Tanam')">
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
            <!-- Penlub Date -->
            <v-col cols="12" sm="12" md="6" lg="2" v-if="options.activities.model.includes('Penilikan Lubang') || options.activities.model.includes('Distribusi')">
              <p class="mb-1">Penlub Date</p>
                  <v-menu 
                    rounded="xl"
                    v-model="menus.penlub"
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
                            {{ dates.penlub }}
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
                          v-model="dates.penlub"
                        ></v-date-picker>
                        <br>
                      </v-list-item>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green lighten-1"
                          center
                          rounded
                          @click="menus.penlub = false"
                        >
                          Ok
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-list-item>
                    </v-list>
                  </v-menu>
            </v-col>
            <!-- Distribution Date -->
            <v-col cols="12" sm="12" md="6" lg="2" v-if="options.activities.model.includes('Distribusi')">
              <p class="mb-1">Distribution Date</p>
                  <v-menu 
                    rounded="xl"
                    v-model="menus.distribusi"
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
                            {{ dates.distribusi }}
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
                          v-model="dates.distribusi"
                        ></v-date-picker>
                        <br>
                      </v-list-item>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green lighten-1"
                          center
                          rounded
                          @click="menus.distribusi = false"
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
                class="my-2 white--text px-10"
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
              <v-btn 
                v-if="options.FC.model"
                :disabled="btn.generateButton.disabled"
                @click="exportExcel('Pendataan Petani & Lahan')"
                color="green white--text"
                class="ml-2 my-2 d-none d-md-inline-block"
                rounded
                x-large
              >
                <v-icon small class="mr-1">mdi-microsoft-excel</v-icon>
                Export Excel
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
          <h3 class=""><v-btn fab x-small color="green white--text" class="mr-1"><v-icon>mdi-table-account</v-icon></v-btn> Pendataan Petani & Lahan</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Main Table -->
          <v-data-table
            multi-sort
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
              <v-row class="py-3 justify-center">
                <v-spacer class="d-none d-md-inline-block"></v-spacer>
                <v-btn 
                  @click="generateReport('Pendataan Petani & Lahan')"
                  color="info"
                  class="mb-2 mx-1 d-none d-md-inline-block"
                  rounded
                >
                  <v-icon small class="mr-1">mdi-file-pdf-box</v-icon>
                  Export PDF
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
            :manual-pagination="true"
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
                          <tr v-for="(data, dIndex) in tables.farmer.items" :key="dIndex" :class="pageBreakIndex(dIndex)">
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
          <h3 class=""><v-btn fab x-small color="green white--text" class="mr-1"><v-icon>mdi-account-group</v-icon></v-btn> Sosialisasi Tanam</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Main Table -->
          <v-data-table
            multi-sort
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
              <strong>{{ numberFormat(item.total_bibit) }}</strong>
            </template>
            <template v-slot:item.distribution_time="{item}">
              <strong v-if="item.distribution_time != '-'">{{ dateFormat(item.distribution_time, 'DD-MM-Y') }}</strong>
              <span v-else>-</span>
            </template>
            <template v-slot:item.actions="{item, index}">
              <v-btn
                dark
                color="red"
                rounded
                icon
                @click="removeSostamItem(index)"
              >
                <v-icon>mdi-close-circle</v-icon>
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
            ref="exportPDFSosialisasiTanam"
          >
            <section slot="pdf-content">
              <v-container>
                <center>
                  <h2>Pendataan Sosialisasi Tanam</h2>
                  <h3>Activities Progress</h3>
                </center>
                <v-row>
                  <v-col sm="6">
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
                            <th colspan="4">Sosialisasi Tanam</th>
                          </tr>
                          <tr>
                            <th>{{ dateFormat(filters.dates.sostam, 'DD MMM Y') }}</th>
                            <th>Progress</th>
                            <th>Total Bibit</th>
                            <th>Tanggal Distribusi</th>
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
                            <td align="center">{{ numberFormat(data.total_bibit) }}</td>
                            <td align="center">
                              <span v-if="data.distribution_time != '-'">{{dateFormat(data.distribution_time, 'DD MMMM Y') }}</span>
                              <span v-else>-</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </center>
                  </v-col>
                </v-row>
                <v-row class="html2pdf__page-break">
                  <v-col sm="12" md="4">
                    <table border="1" style="border-collapse: collapse;width: 100%;">
                      <thead>
                        <tr>
                          <th colspan="3">KAYU ({{ getTotalBibitPerCategory('KAYU', 'sostam') }})</th>
                        </tr>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(tree, treeIndex) in tables.sostam.totalBibitDetails.KAYU" :key="treeIndex">
                          <td align="center">{{ treeIndex += 1 }}</td>
                          <td style="padding-left: 5px">{{ tree.tree_name }}</td>
                          <td align="center">{{ numberFormat(tree.amount) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                  <v-col sm="12" md="4">
                    <table border="1" style="border-collapse: collapse;width: 100%;">
                      <thead>
                        <tr>
                          <th colspan="3">MPTS ({{ getTotalBibitPerCategory('MPTS', 'sostam') }})</th>
                        </tr>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(tree, treeIndex) in tables.sostam.totalBibitDetails.MPTS" :key="treeIndex">
                          <td align="center">{{ treeIndex += 1 }}</td>
                          <td style="padding-left: 5px">{{ tree.tree_name }}</td>
                          <td align="center">{{ numberFormat(tree.amount) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                  <v-col sm="12" md="4">
                    <table border="1" style="border-collapse: collapse;width: 100%;">
                      <thead>
                        <tr>
                          <th colspan="3">CROPS ({{ getTotalBibitPerCategory('CROPS', 'sostam') }})</th>
                        </tr>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(tree, treeIndex) in tables.sostam.totalBibitDetails.CROPS" :key="treeIndex">
                          <td align="center">{{ treeIndex += 1 }}</td>
                          <td style="padding-left: 5px">{{ tree.tree_name }}</td>
                          <td align="center">{{ numberFormat(tree.amount) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                </v-row>
              </v-container>
            </section>
          </vue-html2pdf>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Pelatihan Petani -->
      <v-expansion-panel class="rounded-xl mt-2" v-if="tables.pelpet.show">
        <v-expansion-panel-header>
          <h3 class=""><v-btn fab x-small color="green white--text" class="mr-1"><v-icon>mdi-school</v-icon></v-btn> Pelatihan Petani</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Main Table -->
          <v-data-table
            multi-sort
            :headers="tables.pelpet.headers"
            :items="tables.pelpet.items"
            :search="tables.pelpet.search"
            :loading="tables.pelpet.loading"
            loading-text="Loading... Please wait"
            class="rounded-xl mx-3 pa-1 mb-5"
            :items-per-page="15"
            :footer-props="{
              itemsPerPageOptions: [8, 15, 30, -1]
            }"
          ></v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Penilikan Lubang Tanam -->
      <v-expansion-panel class="rounded-xl mt-2" v-if="tables.penlub.show">
        <v-expansion-panel-header>
          <h3 class=""><v-btn fab x-small color="green white--text" class="mr-1"><v-icon>mdi-pi-hole</v-icon></v-btn> Penilikan Lubang Tanam</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Main Table -->
          <v-data-table
            multi-sort
            :headers="tables.penlub.headers"
            :items="tables.penlub.items"
            :search="tables.penlub.search"
            :loading="tables.penlub.loading"
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
                  @click="generateReport('Penilikan Lubang')"
                  color="info"
                  class="mb-2 d-none d-md-inline-block"
                  rounded
                >
                  <v-icon small class="mr-1">mdi-printer</v-icon>
                  Export
                </v-btn>
              </v-row>
            </template>
            <template v-slot:header.total_petani>
              Total Petani ({{ dateFormat(filters.dates.farmer[1], 'DD MMM Y') }})
            </template>
            <template v-slot:header.total_lahan>
              Total Lahan ({{ dateFormat(filters.dates.land[1], 'DD MMM Y') }})
            </template>
            <template v-slot:header.total_penlub>
              Total Penlub ({{ dateFormat(filters.dates.penlub, 'DD MMM Y') }})
            </template>
            <template v-slot:item.total_petani="{item}">
              <strong>{{ item.total_petani }}</strong> Petani
            </template>
            <template v-slot:item.total_lahan="{item}">
              <strong>{{ item.total_lahan }}</strong> Lahan
            </template>
            <template v-slot:item.total_penlub="{item}">
              <strong>{{ item.total_penlub }}</strong> Penlub
            </template>
            <template v-slot:item.progress_penlub="{item}">
              <strong>{{ item.progress_penlub }}</strong>%
            </template>
            <template v-slot:item.total_lubang="{item}">
              <strong>{{ numberFormat(item.total_lubang) }}</strong>
            </template>
            <template v-slot:item.total_lubang_standar="{item}">
              <strong>{{ numberFormat(item.total_lubang_standar) }}</strong>
            </template>
            <template v-slot:item.total_bibit="{item}">
              <strong>{{ numberFormat(item.total_bibit) }}</strong>
            </template>
            <template v-slot:item.actions="{item, index}">
              <v-btn
                dark
                color="red"
                rounded
                icon
                @click="removeSostamItem(index)"
              >
                <v-icon>mdi-close-circle</v-icon>
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
            ref="exportPDFPenilikanLubang"
          >
            <section slot="pdf-content">
              <v-container>
                <center>
                  <h2>Pendataan Penilikan Lubang Tanam</h2>
                  <h3>Activities Progress</h3>
                </center>
                <v-row>
                  <v-col sm="6">
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
                            <th colspan="4">Penilikan Lubang Tanam</th>
                          </tr>
                          <tr>
                            <th>{{ dateFormat(filters.dates.penlub, 'DD MMM Y') }}</th>
                            <th>Progress</th>
                            <th>Total Bibit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(data, dIndex) in tables.penlub.items" :key="dIndex">
                            <td align="center">{{ dIndex + 1 }}</td>
                            <td style="padding-left: 5px">{{ data.ff }}</td>
                            <td align="center">{{ data.total_petani }}</td>
                            <td align="center">{{ data.total_lahan }}</td>
                            <td align="center">{{ data.total_penlub }}</td>
                            <td align="center">{{ data.progress_penlub }}%</td>
                            <td align="center">{{ numberFormat(data.total_bibit) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </center>
                  </v-col>
                </v-row>
                <v-row class="html2pdf__page-break">
                  <v-col sm="12" md="4">
                    <table border="1" style="border-collapse: collapse;width: 100%;">
                      <thead>
                        <tr>
                          <th colspan="3">KAYU ({{ getTotalBibitPerCategory('KAYU', 'penlub') }})</th>
                        </tr>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(tree, treeIndex) in tables.penlub.totalBibitDetails.KAYU" :key="treeIndex">
                          <td align="center">{{ treeIndex += 1 }}</td>
                          <td style="padding-left: 5px">{{ tree.tree_name }}</td>
                          <td align="center">{{ numberFormat(tree.amount) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                  <v-col sm="12" md="4">
                    <table border="1" style="border-collapse: collapse;width: 100%;">
                      <thead>
                        <tr>
                          <th colspan="3">MPTS ({{ getTotalBibitPerCategory('MPTS', 'penlub') }})</th>
                        </tr>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(tree, treeIndex) in tables.penlub.totalBibitDetails.MPTS" :key="treeIndex">
                          <td align="center">{{ treeIndex += 1 }}</td>
                          <td style="padding-left: 5px">{{ tree.tree_name }}</td>
                          <td align="center">{{ numberFormat(tree.amount) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                  <v-col sm="12" md="4">
                    <table border="1" style="border-collapse: collapse;width: 100%;">
                      <thead>
                        <tr>
                          <th colspan="3">CROPS ({{ getTotalBibitPerCategory('CROPS', 'penlub') }})</th>
                        </tr>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(tree, treeIndex) in tables.penlub.totalBibitDetails.CROPS" :key="treeIndex">
                          <td align="center">{{ treeIndex += 1 }}</td>
                          <td style="padding-left: 5px">{{ tree.tree_name }}</td>
                          <td align="center">{{ numberFormat(tree.amount) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                </v-row>
              </v-container>
            </section>
          </vue-html2pdf>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Material Organik (Pupuk) -->
      <v-expansion-panel class="rounded-xl mt-2" v-if="tables.pupuk.show">
        <v-expansion-panel-header>
          <h3 class=""><v-btn fab x-small color="green white--text" class="mr-1"><v-icon>mdi-beer</v-icon></v-btn> Material Organik (Pupuk)</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Main Table -->
          <v-data-table
            multi-sort
            :headers="tables.pupuk.headers"
            :items="tables.pupuk.items"
            :search="tables.pupuk.search"
            :loading="tables.pupuk.loading"
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
                <!-- <v-btn 
                  @click="generateReport('Penilikan Lubang')"
                  color="info"
                  class="mb-2 d-none d-md-inline-block"
                  rounded
                >
                  <v-icon small class="mr-1">mdi-printer</v-icon>
                  Export
                </v-btn> -->
              </v-row>
            </template>
            <template v-slot:header.total_petani>
              Total Petani ({{ dateFormat(filters.dates.farmer[1], 'DD MMM Y') }})
            </template>
            <template v-slot:item.total_petani="{item}">
              <strong>{{ item.total_petani }}</strong> Petani
            </template>
            <template v-slot:item.progress_penlub="{item}">
              <strong>{{ item.progress_penlub }}</strong>%
            </template>
            <template v-slot:item.progress_pupuk="{item}">
              <strong>{{ item.progress_pupuk }}</strong>%
            </template>
            <template v-slot:item.total_lubang="{item}">
              <strong>{{ numberFormat(item.total_lubang) }}</strong>
            </template>
            <template v-slot:item.total_lubang_standar="{item}">
              <strong>{{ numberFormat(item.total_lubang_standar) }}</strong>
            </template>
            <template v-slot:item.total_amount_pupuks="{item}">
              <strong>{{ numberFormat(item.total_amount_pupuks) }}</strong> ml
            </template>
            <template v-slot:item.actions="{item, index}">
              <v-btn
                dark
                color="red"
                rounded
                icon
                @click="removeSostamItem(index)"
              >
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Distribusi -->
      <v-expansion-panel class="rounded-xl mt-2" v-if="tables.distribusi.show">
        <v-expansion-panel-header>
          <h3 class=""><v-btn fab x-small color="green white--text" class="mr-1"><v-icon>mdi-human-dolly</v-icon></v-btn> Distribusi</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Main Table -->
          <v-data-table
            multi-sort
            :headers="tables.distribusi.headers"
            :items="tables.distribusi.items"
            :search="tables.distribusi.search"
            :loading="tables.distribusi.loading"
            loading-text="Loading... Please wait"
            class="rounded-xl mx-3 pa-1 mb-5"
            :items-per-page="15"
            :footer-props="{
              itemsPerPageOptions: [8, 15, 30, -1]
            }"
          >
            <template v-slot:header.total_petani>
              Total Petani ({{ dateFormat(filters.dates.farmer[1], 'DD MMM Y') }})
            </template>
            <template v-slot:header.progress_penlub>
              Penlub ({{ dateFormat(filters.dates.penlub, 'DD MMM Y') }})
            </template>
            <template v-slot:header.total_distribution>
              Total Distribution ({{ dateFormat(filters.dates.distribusi, 'DD MMM Y') }})
            </template>
            <template v-slot:item.progress_penlub="{item}">
              {{ item.progress_penlub }}%
            </template>
            <template v-slot:item.penlub_total_bibit="{item}">
              {{ numberFormat(item.penlub_total_bibit) }}
            </template>
            <template v-slot:item.total_bibit_distribusi_all="{item}">
              {{ numberFormat(item.total_bibit_distribusi_all) }}
            </template>
            <template v-slot:item.total_bibit_distribusi_loaded="{item}">
              {{ numberFormat(item.total_bibit_distribusi_loaded) }}
            </template>
            <template v-slot:item.total_bibit_distribusi_distributed="{item}">
              {{ numberFormat(item.total_bibit_distribusi_distributed) }}
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Monitoring 1 -->
      <v-expansion-panel class="rounded-xl mt-2" v-if="tables.monitoring1.show">
        <v-expansion-panel-header>
          <h3 class=""><v-btn fab x-small color="green white--text" class="mr-1"><v-icon>mdi-nature-people</v-icon></v-btn> Realisasi Tanam / Monitoring 1</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Main Table -->
          <v-data-table
            multi-sort
            :headers="tables.monitoring1.headers"
            :items="tables.monitoring1.items"
            :search="tables.monitoring1.search"
            :loading="tables.monitoring1.loading"
            loading-text="Loading... Please wait"
            class="rounded-xl mx-3 pa-1 mb-5"
            :items-per-page="15"
            :footer-props="{
              itemsPerPageOptions: [8, 15, 30, -1]
            }"
          >
            <template v-slot:header.total_petani>
              Total Petani ({{ dateFormat(filters.dates.farmer[1], 'DD MMM Y') }})
            </template>
            <template v-slot:header.total_distribution>
              Total Distribution ({{ dateFormat(filters.dates.distribusi, 'DD MMM Y') }})
            </template>
            <template v-slot:item.progress_monitoring="{item}">
              {{ item.progress_monitoring }}%
            </template>
            <template v-slot:item.total_seed_received="{item}">
              {{ numberFormat(item.total_seed_received) }}
            </template>
            <template v-slot:item.total_seed_planted_live="{item}">
              {{ numberFormat(item.total_seed_planted_live) }}
            </template>
            <template v-slot:item.total_seed_dead="{item}">
              {{ numberFormat(item.total_seed_dead) }}
            </template>
            <template v-slot:item.total_seed_lost="{item}">
              {{ numberFormat(item.total_seed_lost) }}
            </template>
          </v-data-table>
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
    confirmation: {
      model: null,
      okText: '',
      show: false,
      title: 'Confirmation',
    },
    dates: {
      farmer: ['2022-08-31', moment().format('Y-MM-DD')],
      land: ['2022-10-03', moment().format('Y-MM-DD')],
      sostam: moment().format('Y-MM-DD'),
      penlub: moment().format('Y-MM-DD'),
      pupuk: moment().format('Y-MM-DD'),
      distribusi: moment().format('Y-MM-DD'),
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
        sostam: '',
        penlub: '',
        distribusi: ''
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
      penlub: false,
      pupuk: false,
      distribusi: false
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
        disabled: false,
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
          {value: "Pelatihan Petani", disabled: false},
          {value: "Penilikan Lubang", disabled: false},
          {value: "Material Organik (Pupuk)", disabled: false},
          {value: "Distribusi", disabled: false},
          {value: "Realisasi Tanam", disabled: false},
          {value: "Material Organik (Pestisida)", disabled: true},
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
          // { text: "Actions", value: "actions", align: 'center', sortable: false },
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
          { text: "Tanggal Distribusi", value: "distribution_time", align: 'center' },
          // { text: "Actions", value: "actions", align: 'center', sortable: false },
        ],
        items: [],
        loading: false,
        search: '',
        show: false,
        totalBibitDetails: {
          KAYU: [],
          MPTS: [],
          CROPS: []
        }
      },
      pelpet: {
        headers: [
          { text: "Field Facilitator", value: "ff" },
          { text: "Petani", value: "total_farmer", align: 'center' },
          { text: "Participant", value: "total_participant", align: 'center' },
          { text: "Trainer", value: "trainee", align: 'center' },
          { text: "Date", value: "training_date", align: 'center' },
          { text: "Materi 1", value: "materi1", align: 'center' },
          { text: "Materi 2", value: "materi2", align: 'center' },
          // { text: "Actions", value: "actions", align: 'center', sortable: false },
        ],
        items: [],
        loading: false,
        search: '',
        show: false,
      },
      penlub: {
        headers: [
          { text: "Field Facilitator", value: "ff" },
          { text: "Total Petani", value: "total_petani", align: 'center' },
          { text: "Total Lahan", value: "total_lahan", align: 'center' },
          { text: "Penlub", value: "total_penlub", align: 'center' },
          { text: "Penlub Progress", value: "progress_penlub", align: 'center' },
          { text: "Lubang", value: "total_lubang", align: 'center' },
          { text: "Lubang Standar", value: "total_lubang_standar", align: 'center' },
          { text: "Total Bibit", value: "total_bibit", align: 'center' },
          // { text: "Actions", value: "actions", align: 'center', sortable: false },
        ],
        items: [],
        loading: false,
        search: '',
        show: false,
        totalBibitDetails: {
          KAYU: [],
          MPTS: [],
          CROPS: []
        }
      },
      pupuk: {
        headers: [
          { text: "Field Facilitator", value: "ff" },
          { text: "Total Petani", value: "total_petani", align: 'center' },
          { text: "Penlub Progress", value: "progress_penlub", align: 'center' },
          { text: "Pupuk Progress", value: "progress_pupuk", align: 'center' },
          { text: "Lubang", value: "total_lubang", align: 'center' },
          { text: "Lubang Standar", value: "total_lubang_standar", align: 'center' },
          { text: "Total Pupuk", value: "total_amount_pupuks", align: 'center' },
          // { text: "Actions", value: "actions", align: 'center', sortable: false },
        ],
        items: [],
        loading: false,
        search: '',
        show: false,
      },
      distribusi: {
        headers: [
          { text: "Field Facilitator", value: "ff" },
          { sortable: false, text: "Total Petani", value: "total_petani", align: 'center' },
          { text: "Penlub Progress", value: "progress_penlub", align: 'center' },
          { text: "Penlub Bibit", value: "penlub_total_bibit", align: 'center' },
          { sortable: false, text: "Total Distribusi", value: "total_distribusi", align: 'center' },
          { text: "D. Bibit All", value: "total_bibit_distribusi_all", align: 'center' },
          { sortable: false, text: "D. Bibit Loaded", value: "total_bibit_distribusi_loaded", align: 'center' },
          { sortable: false, text: "D. Bibit Distributed", value: "total_bibit_distribusi_distributed", align: 'center' },
          { sortable: false, text: "D. Bibit Broken", value: "total_bibit_distribusi_broken", align: 'center' },
          { sortable: false, text: "D. Bibit Missing", value: "total_bibit_distribusi_missing", align: 'center' },
          { sortable: false, text: "D. Bibit Received", value: "total_bibit_distribusi_received", align: 'center' },
          // { text: "Actions", value: "actions", align: 'center', sortable: false },
        ],
        items: [],
        loading: false,
        search: '',
        show: false,
        totalBibitDetails: {
          KAYU: [],
          MPTS: [],
          CROPS: []
        }
      },
      monitoring1: {
        headers: [
          { text: "Field Facilitator", value: "ff" },
          { sortable: false, text: "Total Petani", value: "total_petani", align: 'center' },
          { sortable: false, text: "Total Distribusi", value: "total_distribusi", align: 'center' },
          { sortable: false, text: "Total Monitoring", value: "total_monitoring", align: 'center' },
          { sortable: true, text: "Progress Monitoring", value: "progress_monitoring", align: 'center' },
          { sortable: false, text: "Received Seeds", value: "total_seed_received", align: 'center' },
          { sortable: false, text: "Planted Live Seeds", value: "total_seed_planted_live", align: 'center' },
          { sortable: false, text: "Dead Seeds", value: "total_seed_dead", align: 'center' },
          { sortable: false, text: "Lost Seeds", value: "total_seed_lost", align: 'center' },
          // { text: "Actions", value: "actions", align: 'center', sortable: false },
        ],
        items: [],
        loading: false,
        search: '',
        show: false,
        totalBibitDetails: {
          KAYU: [],
          MPTS: [],
          CROPS: []
        }
      },
    }
  }),

  async mounted() {
    await this.firstAccessPage();
    // this.filters.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 70000)).toISOString().substr(0, 10)
    // if (this.auth.user.role_group != 'IT') {
    //   this.$store.state.maintenanceOverlay = true
    // }
  },
  destroyed() {
    // this.$store.state.maintenanceOverlay = false
    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },

  watch: {
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
    'expansions.model': {
      handler(newValue) {
        // console.log('Expansion' + newValue)
      }
    },
    'filters.activities': {
      handler(newValue) {
        // console.log(newValue)
      }
    },
    'options.activities.model': {
      handler() {
        this.getButtonGenerateKPIDisabledCondition()
      }
    },
    'options.FC.model': {
      handler() {
        this.getButtonGenerateKPIDisabledCondition()
      }
    },
    'options.UM.model': {
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
      // set program year
      this.options.programYear.model = this.$store.state.programYear.model
      // set UM model if User == 'UNIT MANAGER'
      if (this.auth.user.role_name == 'UNIT MANAGER') {
        this.options.UM.model = this.auth.user.employee_no
        this.options.UM.disabled = true
        this.optionsChanged('UM')
      }
      await this.getUMAll()
    },
    async generateKPI() {
      this.btn.generateButton.loading = true
      
      const activitiesActive = this.options.activities.model
      let openedPanel = []
      let openedPanelIndex = 2
      // Pendataan Petani & Lahan
      if (activitiesActive.includes('Pendataan Petani & Lahan')) {
        await openedPanel.push(openedPanelIndex)
        openedPanelIndex += 1
        this.filters.activities.push('Pendataan Petani & Lahan')
        this.tables.farmer.show = true
      } else {
        this.tables.farmer.show = false
      }
      // Sosialisasi Tanam
      if (activitiesActive.includes('Sosialisasi Tanam')) {
        await openedPanel.push(openedPanelIndex)
        openedPanelIndex += 1
        this.filters.activities.push('Sosialisasi Tanam')
        this.tables.sostam.show = true
      } else {
        this.tables.sostam.show = false
      }
      // Pelatihan Petani
      if (activitiesActive.includes('Pelatihan Petani')) {
        await openedPanel.push(openedPanelIndex)
        openedPanelIndex += 1
        this.filters.activities.push('Pelatihan Petani')
        this.tables.pelpet.show = true
      } else {
        this.tables.pelpet.show = false
      }
      // Penilikan Lubang
      if (activitiesActive.includes('Penilikan Lubang')) {
        await openedPanel.push(openedPanelIndex)
        openedPanelIndex += 1
        this.filters.activities.push('Penilikan Lubang')
        this.tables.penlub.show = true
      } else {
        this.tables.penlub.show = false
      }
      // Material Organik (Pupuk)
      if (activitiesActive.includes('Material Organik (Pupuk)')) {
        await openedPanel.push(openedPanelIndex)
        openedPanelIndex += 1
        this.filters.activities.push('Material Organik (Pupuk)')
        this.tables.pupuk.show = true
      } else {
        this.tables.pupuk.show = false
      }
      // Distribusi
      if (activitiesActive.includes('Distribusi')) {
        await openedPanel.push(openedPanelIndex)
        openedPanelIndex += 1
        this.filters.activities.push('Distribusi')
        this.tables.distribusi.show = true
      } else {
        this.tables.distribusi.show = false
      }
      // Realisasi Tanam
      if (activitiesActive.includes('Realisasi Tanam')) {
        await openedPanel.push(openedPanelIndex)
        openedPanelIndex += 1
        this.filters.activities.push('Realisasi Tanam')
        this.tables.monitoring1.show = true
      } else {
        this.tables.monitoring1.show = false
      }

      // console.log('Opened' + openedPanel)

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
        await Promise.all(this.tables.farmer.headers.map(async (farmerHeader, farmerHeaderIndex) => {
          if (farmerHeader.text == 'FC') {
            await this.tables.farmer.headers.splice(farmerHeaderIndex, 1)
          }
        })) 
        // remove FC in table sostam
        await Promise.all(this.tables.sostam.headers.map(async (sostamHeader, sostamHeaderIndex) => {
          if (sostamHeader.text == 'FC') {
            await this.tables.sostam.headers.splice(sostamHeaderIndex, 1)
          }
        })) 
        // remove FC in table pelpet
        await Promise.all(this.tables.pelpet.headers.map(async (pelpetHeader, pelpetHeaderIndex) => {
          if (pelpetHeader.text == 'FC') {
            await this.tables.pelpet.headers.splice(pelpetHeaderIndex, 1)
          }
        })) 
        // remove FC in table penlub
        await Promise.all(this.tables.penlub.headers.map(async (penlubHeader, penlubHeaderIndex) => {
          if (penlubHeader.text == 'FC') {
            await this.tables.penlub.headers.splice(penlubHeaderIndex, 1)
          }
        })) 
        // remove FC in table pupuk
        await Promise.all(this.tables.pupuk.headers.map(async (pupukHeader, pupukHeaderIndex) => {
          if (pupukHeader.text == 'FC') {
            await this.tables.pupuk.headers.splice(pupukHeaderIndex, 1)
          }
        })) 
        // remove FC in table distribusi
        await Promise.all(this.tables.distribusi.headers.map(async (distribusiHeader, distribusiHeaderIndex) => {
          if (distribusiHeader.text == 'FC') {
            await this.tables.distribusi.headers.splice(distribusiHeaderIndex, 1)
          }
        })) 
        // remove FC in table monitoring1
        await Promise.all(this.tables.monitoring1.headers.map(async (monitoring1Header, monitoring1HeaderIndex) => {
          if (monitoring1Header.text == 'FC') {
            await this.tables.monitoring1.headers.splice(monitoring1HeaderIndex, 1)
          }
        })) 

        let params = new URLSearchParams({
          activities: this.options.activities.model.join(),
          fc_no: fc_no,
          program_year: this.options.programYear.model,
          dates: [this.dates.farmer[0], this.dates.farmer[1], this.dates.land[0], this.dates.land[1], this.dates.sostam, this.dates.penlub, this.dates.distribusi]
        })
        this.tables.farmer.loading = true
        this.tables.sostam.loading = true
        this.tables.pelpet.loading = true
        this.tables.penlub.loading = true
        this.tables.pupuk.loading = true
        this.tables.distribusi.loading = true
        this.tables.monitoring1.loading = true

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
        this.tables.pelpet.items = datas.pelpet
        this.tables.penlub.items = datas.penlub
        this.tables.pupuk.items = datas.pupuk
        this.tables.distribusi.items = datas.distribusi
        this.tables.monitoring1.items = datas.monitoring1

        this.generateTotalBibitDetails(datas.sostam, 'sostam')
        this.generateTotalBibitDetails(datas.penlub, 'penlub')

        // set filter data
        await this.setFilterData(datas)
      } catch (error) {
        console.error(error);
        this.sessionEnd(error)
      } finally {
        this.tables.farmer.loading = false
        this.tables.sostam.loading = false
        this.tables.pelpet.loading = false
        this.tables.penlub.loading = false
        this.tables.pupuk.loading = false
        this.tables.distribusi.loading = false
        this.tables.monitoring1.loading = false
      }
    },
    async generateKPIbyUM() {
      try {
        this.tables.farmer.loading = true
        this.tables.sostam.loading = true
        this.tables.pelpet.loading = true
        this.tables.penlub.loading = true
        this.tables.distribusi.loading = true
        this.tables.monitoring1.loading = true
        this.$store.state.loadingOverlay = true

        // add FC in table farmer
        let checkFarmerHeaderContainFC = 0
        await Promise.all(this.tables.farmer.headers.map(async (farmerHeader, farmerHeaderIndex) => {
          if (farmerHeader.text == 'FC') {
            checkFarmerHeaderContainFC += 1
          }
        })) 
        if (checkFarmerHeaderContainFC == 0) {
          this.tables.farmer.headers = [
            { text: "FC", value: "fc" },
            ...this.tables.farmer.headers
          ]
        }
        // add FC in table sostam
        let checkSostamHeaderContainFC = 0
        await Promise.all(this.tables.sostam.headers.map(async (sostamHeader, sostamHeaderIndex) => {
          if (sostamHeader.text == 'FC') {
            checkSostamHeaderContainFC += 1
          }
        })) 
        if (checkSostamHeaderContainFC == 0) {
          this.tables.sostam.headers = [
            { text: "FC", value: "fc" },
            ...this.tables.sostam.headers
          ]
        }
        // add FC in table pelpet
        let checkPelpetHeaderContainFC = 0
        await Promise.all(this.tables.pelpet.headers.map(async (pelpetHeader, pelpetHeaderIndex) => {
          if (pelpetHeader.text == 'FC') {
            checkPelpetHeaderContainFC += 1
          }
        })) 
        if (checkPelpetHeaderContainFC == 0) {
          this.tables.pelpet.headers = [
            { text: "FC", value: "fc" },
            ...this.tables.pelpet.headers
          ]
        }
        // add FC in table penlub
        let checkPenlubHeaderContainFC = 0
        await Promise.all(this.tables.penlub.headers.map(async (penlubHeader, penlubHeaderIndex) => {
          if (penlubHeader.text == 'FC') {
            checkPenlubHeaderContainFC += 1
          }
        })) 
        if (checkPenlubHeaderContainFC == 0) {
          this.tables.penlub.headers = [
            { text: "FC", value: "fc" },
            ...this.tables.penlub.headers
          ]
        }
        // add FC in table distribusi
        let checkDistribusiHeaderContainFC = 0
        await Promise.all(this.tables.distribusi.headers.map(async (distribusiHeader, distribusiHeaderIndex) => {
          if (distribusiHeader.text == 'FC') {
            checkDistribusiHeaderContainFC += 1
          }
        })) 
        if (checkDistribusiHeaderContainFC == 0) {
          this.tables.distribusi.headers = [
            { text: "FC", value: "fc" },
            ...this.tables.distribusi.headers
          ]
        }
        // add FC in table distribusi
        let checkMonitoring1HeaderContainFC = 0
        await Promise.all(this.tables.monitoring1.headers.map(async (monitoring1Header, monitoring1HeaderIndex) => {
          if (monitoring1Header.text == 'FC') {
            checkMonitoring1HeaderContainFC += 1
          }
        })) 
        if (checkMonitoring1HeaderContainFC == 0) {
          this.tables.monitoring1.headers = [
            { text: "FC", value: "fc" },
            ...this.tables.monitoring1.headers
          ]
        }

        const fieldCoordinators = this.options.FC.items || [] 

        let farmers = []
        let sostams = []
        let pelpets = []
        let penlubs = []
        let distribusis = []
        let firstMonitorings = []
        
        let totalFC = fieldCoordinators.length
        let generatedFC = 0

        this.$store.state.loadingOverlayText = `Getting KPI FC (<strong>${generatedFC} / ${totalFC}</strong>) datas...`

        for (let forIndex = 0; forIndex < totalFC; forIndex++) {
          let params = new URLSearchParams({
            activities: this.options.activities.model.join(),
            fc_no: fieldCoordinators[forIndex].nik,
            program_year: this.options.programYear.model,
            dates: [this.dates.farmer[0], this.dates.farmer[1], this.dates.land[0], this.dates.land[1], this.dates.sostam, this.dates.penlub, this.dates.distribusi]
          })
  
          await axios.get(
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
                  fc: fieldCoordinators[forIndex].name,
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
                  fc: fieldCoordinators[forIndex].name,
                  ...sosVal
                })
              })
            }

            // get pelpet
            if (datas.pelpet.length > 0) {
              datas.pelpet.forEach(pelPetVal => {
                pelpets.push({
                  fc: fieldCoordinators[forIndex].name,
                  ...pelPetVal
                })
              })
            }

            // get penlub
            if (datas.penlub.length > 0) {
              datas.penlub.forEach(penlubVal => {
                penlubs.push({
                  fc: fieldCoordinators[forIndex].name,
                  ...penlubVal
                })
              })
            }

            // get distribusi
            if (datas.distribusi.length > 0) {
              datas.distribusi.forEach(distribusiVal => {
                distribusis.push({
                  fc: fieldCoordinators[forIndex].name,
                  ...distribusiVal
                })
              })
            }

            // get monitoring1
            if (datas.monitoring1.length > 0) {
              datas.monitoring1.forEach(monitoring1Val => {
                firstMonitorings.push({
                  fc: fieldCoordinators[forIndex].name,
                  ...monitoring1Val
                })
              })
            }
  
            // set filter data
            if (forIndex == 0) {
              this.setFilterData({um: datas.um})
            } 
  
            // update progress text
            generatedFC += 1
            this.$store.state.loadingOverlayText = `Getting KPI FC (<strong>${generatedFC} / ${totalFC}</strong>) datas...`
          }).finally(() => {
            if (generatedFC == totalFC) {
              this.$store.state.loadingOverlay = false
              this.$store.state.loadingOverlayText = null
  
              this.tables.farmer.loading = false
              this.tables.sostam.loading = false
              this.tables.pelpet.loading = false
              this.tables.penlub.loading = false
              this.tables.distribusi.loading = false
              this.tables.monitoring1.loading = false
            }
          })
        }
        
        // set datas to tables
        this.tables.farmer.items = farmers
        this.tables.sostam.items = sostams
        this.tables.pelpet.items = pelpets
        this.tables.penlub.items = penlubs
        this.tables.distribusi.items = distribusis
        this.tables.monitoring1.items = firstMonitorings
      } catch (error) {
        console.error(error)
        this.sessionEnd(error)
      }
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
    optionsChanged(type) {
      if (type == 'UM') {
        if (this.options.UM.model) {
          this.getFCbyManager(this.options.UM.model)
        } 
      }
    },
    removeFromActivitiesInput (item) {
      const index = this.options.activities.model.indexOf(item.value)
      if (index >= 0) this.options.activities.model.splice(index, 1)
    },
    // Utilities Function
    async confirmationOk(okText) {
        this.confirmation.show = false
    },
    confirmationShow(type, data) {

    },
    dateFormat(date, format) {
        return moment(date).format(format)
    },
    exportExcel() {
      let params = new URLSearchParams({
          activities: this.options.activities.model.join(),
          fc_no: this.options.FC.model,
          program_year: this.options.programYear.model,
          dates: [this.dates.farmer[0], this.dates.farmer[1], this.dates.land[0], this.dates.land[1], this.dates.sostam, this.dates.penlub, this.dates.distribusi]
        })
      window.open(`${this.auth.baseUrlGet.substring(0, this.auth.baseUrlGet.length - 4)}KPIExportExcel?${params}`)
    },
    getProgramYearPetani(text) {
        if (text.slice(13, 14) === '_') {
            return text.slice(9, 13)
        } else {
            return text.slice(4, 8)
        }
    },
    generateReport (activities) {
       if (activities == 'Pendataan Petani & Lahan') {
         this.$refs.exportPDFPendataanPetaniLahan.generatePdf()
       } else if (activities == 'Sosialisasi Tanam') {
         this.$refs.exportPDFSosialisasiTanam.generatePdf()
       } else if (activities == 'Penilikan Lubang') {
         this.$refs.exportPDFPenilikanLubang.generatePdf()
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
    generateTotalBibitDetails(datas, type) {
      this.tables[type].totalBibitDetails = {
        KAYU: [],
        MPTS: [],
        CROPS: []
      }
      datas.forEach((val, index) => {
        val.total_bibit_details.forEach((val2, index2) => {
          let exists = 0
          this.tables[type].totalBibitDetails[val2.category].forEach((val3, index3) => {
            if (val3.tree_code == val2.tree_code) {
              this.tables[type].totalBibitDetails[val2.category][index3].amount += val2.amount
              exists += 1
            }
          })
          if (exists == 0 && val2.amount > 0) {
            this.tables[type].totalBibitDetails[val2.category].push(val2)
          }
        })
      })
    },
    getTotalBibitPerCategory(category, type) {
      let total = 0
      this.tables[type].totalBibitDetails[category].forEach(val => {
        total += val.amount
      })
      return this.numberFormat(total)
    },
    numberFormat(num) {
        return new Intl.NumberFormat('id-ID').format(num)
    },
    pageBreakIndex(index) {
      const pageBreak = [21,52,83]
      if (pageBreak.includes(index)) return 'html2pdf__page-break'
      else return ''
    },
    async removeSostamItem(index) {
      this.tables.sostam.items.splice(index, 1)
    },
    sessionEnd(error) {
      if (typeof error.response.status != 'undefined') {
        if (error.response.status == 401) {
          this.auth.alertToken = true
          localStorage.removeItem("token")
          this.$router.push("/")
        }
      }
    },
    async setFilterData(datas) {
      // set management
      this.filters.UM = datas.um || ''
      this.filters.FC = datas.fc || ''
      
      
      // set date
      this.filters.dates.farmer = this.dates.farmer
      this.dates.farmer = ['2022-08-31', moment().format('Y-MM-DD')]
      this.filters.dates.land = this.dates.land
      this.dates.land = ['2022-10-03' , moment().format('Y-MM-DD')]
      this.filters.dates.sostam = this.dates.sostam
      this.dates.sostam = '2022-11-15'
      this.filters.dates.penlub = this.dates.penlub
      this.dates.penlub = '2022-12-31'
      this.filters.dates.distribusi = this.dates.distribusi
      this.dates.distribusi = '2023-01-31'
    },
  },
};
</script>