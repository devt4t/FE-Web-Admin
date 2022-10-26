<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <div class="mx-9">
      <v-alert :value="alerttoken" color="red" elevation="24" type="error">
        Session Token Login Habis, Login Kembali !
      </v-alert>
    </div>

    <!-- MODAL -->
      <!-- Modal Filter Area -->
      <v-dialog v-model="dialogFilterArea" max-width="500px">
        <v-card rounded="xl">
          <v-card-title class=""
            >Filter Pencarian Area</v-card-title
          >
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="selectMU"
                    :items="itemsMU"
                    item-value="mu_no"
                    item-text="name"
                    v-on:change="selectedMU"
                    label="Management Unit"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="selectTA"
                    :items="itemsTA"
                    item-value="area_code"
                    item-text="name"
                    v-on:change="selectedTA"
                    label="Targer Area"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="selectVillage"
                    :items="itemsVillage"
                    item-value="kode_desa"
                    item-text="name"
                    v-on:change="selectedVillage"
                    label="Desa"
                    clearable
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="pb-4">
            <v-spacer></v-spacer>
            <v-btn dark color="red" rounded class="px-5" @click="dialogFilterArea = false">
              <v-icon small class="mr-1">mdi-close</v-icon>
              Cancel
            </v-btn
            >
            <v-btn dark color="warning" rounded class="px-5" @click="searchbyarea">
              <v-icon small class="mr-1">mdi-filter</v-icon>
              Cari
            </v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Filter Emp -->
      <v-dialog v-model="dialogFilterEmp" max-width="500px">
        <v-card rounded="xl">
          <v-card-title class=""
            >Filter Pencarian By Emp</v-card-title
          >
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="selectUM"
                    :items="itemsum"
                    item-value="nik"
                    item-text="name"
                    v-on:change="selectedUM"
                    label="Pilih Unit Manager"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="selectFC"
                    :items="itemsfc"
                    item-value="nik"
                    item-text="name"
                    v-on:change="selectedFC"
                    label="Pilih Field Coordinator"
                    clearable
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="pb-4">
            <v-spacer></v-spacer>
            <v-btn dark color="red" rounded class="px-5" @click="dialogFilterEmp = false">
              <v-icon small class="mr-1">mdi-close</v-icon>
              Cancel
            </v-btn
            >
            <v-btn dark color="warning" rounded class="px-5" @click="searchbyemp">
              <v-icon small class="mr-1">mdi-filter</v-icon>
              Cari
            </v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Create Sostam Per~FF -->
      <v-dialog v-model="dialogAdd.show" max-width="1200px" content-class="rounded-xl" persistent scrollable>
        <v-card rounded="xl" elevation="10">
          <!-- Title -->
          <v-card-title class="mb-1 headermodalstyle rounded-xl elevation-5">
            <span class="">Add per~FF</span>
            <v-spacer></v-spacer>
            <v-icon color="red" @click="dialogAdd.show = false">mdi-close-circle</v-icon>
          </v-card-title>

          <v-card-text>
            <!-- Loading -->
            <v-container
              v-if="dialogAdd.loading"
              fluid
              fill-height
              style="background-color: rgba(255, 255, 255, 0.5)"
            >
              <v-layout column justify-center align-center>
                <v-progress-circular
                  :size="100"
                  :width="13"
                  indeterminate
                  color="green"
                  class="mb-2"
                >
                </v-progress-circular>
                Getting FF data...
              </v-layout>
            </v-container>
            <!-- Content -->
            <v-container v-if="dialogAdd.loading == false">
              <v-row>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn small color="info" rounded @click="getFFOptions">
                    <v-icon small class="mr-1">mdi-refresh</v-icon>
                    Refresh FF
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    outlined
                    rounded
                    color="success"
                    item-color="success"
                    :menu-props="{rounded: 'xl'}"
                    :rules="[(v) => !!v || 'Field is required']"
                    label="Pilih Field Facilitator"
                    :items="options.ff.items"
                    item-text="name"
                    item-value="ff_no"
                    v-model="options.ff.model"
                    :loading="options.ff.loading"
                    :no-data-text="options.ff.loading ? 'Loading...' : 'No Data'"
                    @change="getLahansFF()"
                  ></v-autocomplete>
                </v-col>
                <!-- Lahans Table -->
                <v-col cols="12" sm="12" md="12">
                  <v-row class="align-center mb-4 px-5">
                    <v-col cols="12" class="">
                      <h4>List Lahan</h4>
                      <v-divider class="mx-5"></v-divider>
                      <p class="mb-0"><strong>{{ table.lahans.items.length }}</strong> Lahan</p>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end">
                      <v-btn :disabled="!options.ff.model" color="info" rounded @click="getLahansFF" small>
                        <v-icon class="mr-1" small>mdi-refresh</v-icon>
                        Refresh Lahan
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-data-table
                    color="success"
                    class="rounded-xl elevation-5 mb-2"
                    :headers="table.lahans.header"
                    :items="table.lahans.items"
                    :loading="table.lahans.loading"
                    loading-text="Loading... Please wait"
                    hide-default-footer
                    :items-per-page="-1"
                  >
                    <template v-slot:top>
                      <!-- Trees Dialog -->
                      <v-dialog v-model="table.lahans.dialogs.trees.show" max-width="700px" content-class="rounded-xl">
                        <v-card>
                          <v-card-title class="mb-1 headermodalstyle rounded-xl elevation-5">
                            <span class="">Set Trees Amount</span>
                            <v-spacer></v-spacer>
                            <v-icon color="red" @click="table.lahans.dialogs.trees.show = false">mdi-close-circle</v-icon>
                          </v-card-title>
                          <v-card-content v-if="table.lahans.dialogs.trees.datas">
                            <v-container class="py-2">
                              <h4>Lahan</h4>
                              <v-simple-table>
                                <tbody>
                                  <tr>
                                    <td>Luas Lahan</td>
                                    <td>:</td>
                                    <td><strong>{{ numberFormat(table.lahans.dialogs.trees.datas.land_area) }}m<sup>2</sup></strong></td>
                                  </tr>
                                  <tr>
                                    <td>Opsi Pola Tanam</td>
                                    <td>:</td>
                                    <td><strong>{{ table.lahans.dialogs.trees.datas.opsi_pola_tanam }}</strong></td>
                                  </tr>
                                  <tr>
                                    <td>Region</td>
                                    <td>:</td>
                                    <td><strong>{{ table.lahans.dialogs.trees.datas.province == 'JB' ? 'Jawa Barat' : 'Jawa Tengah' }}</strong></td>
                                  </tr>
                                  <tr>
                                    <td>Max Bibit</td>
                                    <td>:</td>
                                    <td><strong>{{ numberFormat(getSeedCalculation(table.lahans.dialogs.trees.datas, 'total_max_trees')) }}</strong> Bibit</td>
                                  </tr>
                                </tbody>
                              </v-simple-table>
                              <!-- Trees -->
                              <h4>Seeds List</h4>
                              <v-simple-table class="rounded-xl elevation-2 overflow-hidden">
                                <thead>
                                  <tr>
                                    <th>No</th>
                                    <th>Category</th>
                                    <th>Tree Name</th>
                                    <th>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(tree, treeIndex) in table.lahans.dialogs.trees.datas.trees" :key="treeIndex">
                                    <td>{{ treeIndex + 1 }}</td>
                                    <td>{{ tree.category }}</td>
                                    <td>{{ tree.tree_name }}</td>
                                    <td>{{ tree.amount }}</td>
                                  </tr>
                                </tbody>
                              </v-simple-table>
                            </v-container>
                          </v-card-content>
                          <v-card-actions>
                            <v-btn color="red px-5" rounded dark @click="table.lahans.dialogs.trees.show = false">
                              <v-icon class="mr-1">mdi-close-circle</v-icon>
                              Cancel
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="green px-5" rounded dark @click="table.lahans.dialogs.trees.show = false">
                              <v-icon class="mr-1">mdi-check-circle</v-icon>
                              Set
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </template>
                    <template v-slot:item.index="{index}">
                      {{ index + 1 }}
                    </template>
                    <template v-slot:item.land_area="{item}">
                      {{ numberFormat(item.land_area) }}m<sup>2</sup>
                    </template>
                    <template v-slot:item.tutupan_lahan="{item}">
                      {{ item.tutupan_lahan }}%
                    </template>
                    <template v-slot:item.trees="{ item, index }">
                      <strong>{{ numberFormat(getSeedCalculation(item, 'setDataToStore', index)) }} Bibit</strong>
                      <!-- <v-menu
                        rounded="xl"
                        bottom
                        left
                        offset-y
                        transition="slide-y-transition"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" color="dark">
                            mdi-dots-vertical
                          </v-icon>
                        </template>
                        <v-list class="d-flex flex-column align-center">
                          <v-list-item>
                            <v-btn rounded dark small color="warning" @click="() => {table.lahans.dialogs.trees.show = true;table.lahans.dialogs.trees.datas = item}">
                              <v-icon small class="mr-1">mdi-pencil-circle</v-icon>
                              Set Amount
                            </v-btn>
                          </v-list-item>
                        </v-list>
                      </v-menu> -->
                    </template>
                    <template v-slot:item.actions="{index}">
                      <v-icon 
                        color="red" 
                        @click="() => {table.lahans.items.splice(index, 1)}"
                      >
                        mdi-close-circle
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-col>
                <!-- Lokasi Distribusi -->
                <v-col cols="12">
                  <v-text-field
                    outlined
                    rounded
                    v-model="dataToStore.distribution_location"
                    label="Distribution Location"
                    :rules="[(v) => !!v || 'Field is required']"
                    hide-details
                  ></v-text-field>
                </v-col>
                <!-- Tanggal Distribusi -->
                <v-col cols="12" sm="12" md="12" lg="4" class="d-flex flex-column align-center">
                  <p class="mb-1">Tanggal Distribusi</p>
                    <v-menu 
                      rounded="xl"
                      transition="slide-x-transition"
                      bottom
                      right
                      offset-x
                      :close-on-content-click="false"
                      v-model="datepicker2Show"
                    >
                      <template v-slot:activator="{ on: menu, attrs }">
                        <v-tooltip top>
                          <template v-slot:activator="{ on: tooltip }">
                            <v-btn
                              rounded
                              large
                              :disabled="!options.ff.model || !dataToStore.distribution_location"
                              color="green lighten-1"
                              v-bind="attrs"
                              v-on="{...menu, ...tooltip}"
                            >
                              <v-icon left> mdi-calendar </v-icon>
                              {{ dateFormat(dataToStore.distribution_time, 'dddd, DD MMMM Y') }}
                            </v-btn>
                          </template>
                          <span>Klik untuk memunculkan datepicker</span>
                        </v-tooltip>
                      </template>
                      <v-list>
                        <v-overlay :value="datepicker2Loading">
                          <div class="d-flex flex-column align-center justify-center">
                            <v-progress-circular
                                indeterminate
                                color="white"
                                size="64"
                            ></v-progress-circular>
                            <p class="mt-2 mb-0">Updating available dates...</p>
                          </div>
                        </v-overlay>
                        <v-list-item>
                          <div class="d-flex flex-column align-center">
                            <v-date-picker 
                              color="green lighten-1 rounded-xl" 
                              v-model="dataToStore.distribution_time"
                              min="2022-11-24"
                              max="2023-01-31"
                              :allowed-dates="showingAvailableDates"
                              :key="datepicker2Key"
                            ></v-date-picker>
                            <v-btn color="green" class="white--text px-4" small rounded @click="datepicker2Show = false">
                              <v-icon small class="mr-1">mdi-check-circle</v-icon>
                              Set
                            </v-btn>
                          </div>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                </v-col>
                <!-- Tanggal Penilikan Lubang -->
                <v-col cols="12" sm="12" md="12" lg="4" class="d-flex flex-column align-center">
                  <p class="mb-1">Tanggal Penilikan Lubang</p>
                  <v-btn
                    rounded
                    large
                    color="green lighten-1"
                    disabled
                  >
                    <v-icon left> mdi-calendar </v-icon>
                    {{ dateFormat(dataToStore.penlub_time, 'dddd, DD MMMM Y') }}
                  </v-btn>
                </v-col>
                <!-- Tanggal Realisasi Tanam -->
                <v-col cols="12" sm="12" md="12" lg="4" class="d-flex flex-column align-center">
                  <p class="mb-1">Tanggal Realisasi Tanam</p>
                  <v-btn
                    rounded
                    large
                    disabled
                    color="green lighten-1"
                  >
                    <v-icon left> mdi-calendar </v-icon>
                    {{ dateFormat(dataToStore.planting_time, 'dddd, DD MMMM Y') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions v-if="dialogAdd.loading == false" class="elevation-15 rounded-xl">
            <v-btn color="red px-5" rounded dark @click="dialogAdd.show = false">
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="green px-5 white--text" 
              rounded 
              @click="createSostamByFF()"
              :disabled="!dataToStore.distribution_time || !dataToStore.distribution_location || table.lahans.items.length == 0"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              Create Sostam
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Edit -->
      <v-dialog v-model="dialog" max-width="800px" content-class="rounded-xl">
        <v-card rounded="xl">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title class="mb-1 headermodalstyle rounded-xl">
              <span class="">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container
                v-if="load == true"
                fluid
                fill-height
                style="background-color: rgba(255, 255, 255, 0.5)"
              >
                <v-layout justify-center align-center>
                  <v-progress-circular
                    :size="80"
                    :width="10"
                    indeterminate
                    color="primary"
                  >
                  </v-progress-circular>
                </v-layout>
              </v-container>
              <v-container v-if="load == false">
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      disabled
                      rounded
                      v-model="defaultItem.ff_no"
                      :items="itemsff"
                      item-text="name"
                      item-value="ff_no"
                      label="Pilih Field Facilitator"
                      outlined
                      clearable
                      v-on:change="selectPetani"
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      disabled
                      rounded
                      v-model="defaultItem.farmer_no"
                      :items="itemspetani"
                      item-text="nama"
                      item-value="kode"
                      label="Pilih Petani"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      disabled
                      rounded
                      v-model="defaultItem.no_lahan"
                      label="No Lahan"
                      outlined
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      disabled
                      rounded
                      v-model="defaultItem.planting_year"
                      :items="itemsTahun"
                      item-text="text"
                      item-value="value"
                      label="Pilih Tahun Program"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      rounded
                      v-model="defaultItem.distribution_location"
                      label="Tempat Distribusi Bibit"
                      outlined
                      :rules="rules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" class="d-flex flex-column align-center">
                    <p class="mb-0"><strong>Penilikan Lubang</strong></p>
                    <v-btn 
                      rounded disabled class="black--text"
                    >
                      {{ dateFormat(datepicker1, 'ddd, DD MMMM Y') }}
                    </v-btn>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-menu v-model="menu2" offset-x transition="slide-x-transition" rounded="xl">
                      <template v-slot:activator="{ on, attrs }">
                        <div class="d-flex flex-column align-center">
                          <p class="mb-0 mx-auto"><strong>Distribusi Bibit</strong></p>
                          <v-btn 
                            dark
                            rounded class=""
                            color="green"
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ dateFormat(datepicker2, 'ddd, DD MMMM Y') }}
                          </v-btn>
                        </div>
                      </template>
                      <v-date-picker
                        v-model="datepicker2"
                        @input="menu2 = false"
                        color="green"
                        class="rounded-xl"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" lg="4" class="d-flex flex-column align-center">
                    <p class="mb-0"><strong>Realisasi Tanam</strong></p>
                    <v-btn 
                      rounded disabled class="black--text"
                    >
                      {{ dateFormat(datepicker3, 'ddd, DD MMMM Y') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions v-if="load == false">
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" dark rounded class="px-5" @click="close">
                <v-icon class="mr-1">mdi-close-circle</v-icon>
                Cancel
              </v-btn>
              <v-btn color="green" dark rounded class="px-5" @click="save">
                <v-icon class="mr-1">mdi-check-circle</v-icon>
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- What do you want to edit? -->
      <v-dialog v-model="dialogShowEdit" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class=" justify-center"
            >What you want to edit?</v-card-title
          >
          <v-card-actions class="pb-3">
            <v-spacer></v-spacer>
            <v-btn dark rounded color="blue" @click="showEditModal" class="px-5"
              >
              <v-icon class="mr-1">mdi-file-document-edit</v-icon>
              Edit Sosialisasi</v-btn
            >
            <v-btn dark
              color="green"
              rounded
              :disabled="User.role_group != 'IT' && User.role_name != 'UNIT MANAGER'"
              @click="showEditJumlahPohonModal"
              class="px-5"
              >
              <v-icon class="mr-1">mdi-forest</v-icon>
              Jumlah Pohon</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- List Edit Jumlah Pohon -->
      <v-dialog v-model="dialogDetailPohon" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class=" justify-center align-center py-5"
            ><span class="">
              <v-icon class="mr-1">mdi-forest</v-icon>
              List Pohon Lahan</span></v-card-title
          >
          <v-card-text>
            <v-row class="">
              <v-col cols="12">
                <v-simple-table>
                  <tbody>
                    <tr>
                      <td>Luas Lahan</td>
                      <td>:</td>
                      <td><strong>{{ numberFormat(DetailTreesLahanTempData.land_area || 0) }}</strong>m<sup>2</sup></td>
                    </tr>
                    <tr>
                      <td>Tutupan Lahan</td>
                      <td>:</td>
                      <td><strong>{{ DetailTreesLahanTempData.tutupan_lahan || 0 }}</strong>%</td>
                    </tr>
                    <tr v-if="DetailTreesLahanTempData.planting_details && DetailTreesLahanTempData.land_area < 10000">
                      <td>Max Bibit Kayu {{ getStatusTotalBibitInDetail(DetailTreesLahanTempData.planting_details, 'EXISTS', 'MPTS') > 0 ? '(+MPTS)' : '' }}</td>
                      <td>:</td>
                      <td><strong>{{ DetailTreesLahanTempData.max_seed_amount || getSeedCalculation(DetailTreesLahanTempData, 'total_max_trees') }}</strong> Bibit</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <div>
                  <h3 class="ml-1">
                    <v-data-table
                      :headers="headersdetaileditjumlah"
                      :items="DetailTreesLahanTemp"
                      class="elevation-5 rounded-xl"
                    >
                      <!-- <template v-slot:item.tree_category="{ item }">
                        {{ gettype(item.tree_category) }}
                      </template> -->
                      <template v-slot:item.actions="{ item }">
                        <v-icon
                          v-if="true"
                          @click="editDetailPohon(item)"
                          color="warning"
                          :disabled="disabledEditPohon(DetailTreesLahanTemp, item.tree_category, DetailTreesLahanTempData)"
                        >
                          mdi-pencil-circle
                        </v-icon>
                        <!-- <v-icon
                          v-if="RoleAccesCRUDShow == true"
                          @click="deleteDetailPohon(item)"
                          small
                          color="red"
                        >
                          mdi-delete
                        </v-icon> -->
                      </template>
                    </v-data-table>
                  </h3>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="red" rounded @click="closeDetailPohon" class="px-5 mb-2"
              >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Cancel</v-btn
            >
            <v-btn color="green" rounded @click="saveEditPohon" class="px-5 mb-2 white--text"
              :disabled="getStatusTotalBibitInDetail(DetailTreesLahanTemp, 'KAYU') == 0 || getStatusTotalBibitInDetail(DetailTreesLahanTemp, 'KAYU') < (DetailTreesLahanTempData.max_seed_amount * 60 / 100)"
              >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              Save</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Edit Jumlah Pohon -->
      <v-dialog v-model="dialogDetailPohonEdit" max-width="450px" content-class="rounded-xl">
        <v-card>
          <v-card-text>
            <v-row class="pt-7">
              <v-col cols="12">
                <v-simple-table>
                  <tbody>
                    <tr v-if="DetailTreesLahanTempData.planting_details && DetailTreesLahanTempData.land_area < 10000">
                      <td>Total Available</td>
                      <td>:</td>
                      <td><strong> {{ getAvailableBibit(DetailTreesLahanTemp, (DetailTreesLahanTempData.max_seed_amount || getSeedCalculation(DetailTreesLahanTempData, 'total_max_trees')), editedItemPohon) }}</strong> Bibit</td>
                    </tr>
                    <tr>
                      <td>Nama Pohon</td>
                      <td>:</td>
                      <td><strong>{{ editedItemPohon.tree_name }}</strong></td>
                    </tr>
                    <tr>
                      <td>Kategori</td>
                      <td>:</td>
                      <td><strong>{{ editedItemPohon.tree_category }}</strong></td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="editedItemPohon.amount"
                  label="Jumlah Pohon"
                  hide-details
                  rounded
                  outlined
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pb-4">
            <v-spacer></v-spacer>
            <v-btn rounded small color="red" dark @click="closeDetailEditPohon" class="px-3"
              >
              <v-icon small class="mr-1">mdi-close</v-icon>
              Cancel</v-btn
            >
            <v-btn rounded small color="green" :disabled="(DetailTreesLahanTempData.land_area < 10000 && getDisabledSaveItemPohon(DetailTreesLahanTemp, DetailTreesLahanTempData, editedItemPohon)) || editedItemPohon.amount < 0" @click="saveEditPohonTemp" class="px-3 white--text"
            >
              <v-icon small class="mr-1">mdi-check</v-icon>
              Set</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Detail -->
      <v-dialog v-model="dialogDetail" max-width="800px" scrollable persistent>
        <v-card rounded="xl">
          <v-card-title class="mb-1 headermodalstyle">
            <span class="">Detail Sosialisasi Tanam</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- Loader -->
            <v-container
              v-if="load == true"
              fluid
              fill-height
              style="background-color: rgba(255, 255, 255, 0.5)"
            >
              <v-layout justify-center align-center>
                <v-progress-circular
                  :size="80"
                  :width="10"
                  indeterminate
                  color="success"
                >
                </v-progress-circular>
              </v-layout>
            </v-container>
            <!-- Content -->
            <v-container v-if="load == false">
              <v-divider
                style="background-color: black !important"
              ></v-divider>
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th
                        class="text-left"
                        style="width: 200px; font-size: 14px"
                      >
                        Form No
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ defaultItem.form_no }}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th
                        class="text-left"
                        style="width: 200px; font-size: 14px"
                      >
                        Tahun Program
                      </th>
                      <th class="text-left" style="font-size: 14px">
                        {{ defaultItem.planting_year }}
                      </th>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Nama Petani
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ defaultItem.nama_petani }}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        No Ktp
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ defaultItem.ktp_no }}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Alamat
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ defaultItem.alamat }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-divider
                style="background-color: black !important"
              ></v-divider>
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th
                        class="text-left"
                        style="width: 200px; font-size: 14px"
                      >
                        Opsi Pola Tanam
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ defaultItem.opsi_pola_tanam }}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Status Kepimilikan Lahan
                      </th>
                      <th class="text-left" style="font-size: 14px">
                        {{ defaultItem.type_sppt }}
                      </th>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        No Dokumen Lahan
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ defaultItem.document_no }}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Luas Lahan dan Tutupan Lahan
                      </th>
                      <th class="text-left" style="font-size: 14px">
                        {{ defaultItem.land_area }}m<sup>2</sup> dan
                        {{ defaultItem.tutupan_lahan }}%
                      </th>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Pembuatan Lubang Tanam
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ gettanggal(defaultItem.pembuatan_lubang_tanam) }}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Waktu Distribusi Bibit
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ gettanggal(defaultItem.distribution_time) }}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Lokasi Distribusi Bibit
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ defaultItem.distribution_location }}</strong>
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left" style="font-size: 14px">
                        Waktu Penanaman Petani
                      </th>
                      <td class="text-left" style="font-size: 14px">
                        <strong>{{ gettanggal(defaultItem.planting_time) }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-divider
                style="background-color: black !important"
              ></v-divider>
              <div>
                <h4 class="mt-3">Jenis dan Jumlah Bibit</h4>
                <v-simple-table v-if="defaultItem.max_seed_amount && defaultItem.planting_details">
                  <tbody>
                    <tr>
                      <td>Max Kayu 
                        {{ getStatusTotalBibitInDetail(defaultItem.planting_details, 'EXISTS', 'MPTS') > 0 ? '(+MPTS)' : '' }}</td>
                      <td>:</td>
                      <td><strong>{{ defaultItem.max_seed_amount }}</strong> Bibit</td>
                    </tr>
                    <tr>
                      <td>Total Kayu {{ getStatusTotalBibitInDetail(defaultItem.planting_details, 'EXISTS', 'MPTS') > 0 ? '(+MPTS)' : '' }}</td>
                      <td>:</td>
                      <td>
                        <v-btn
                          rounded
                          dark
                          :color="getStatusTotalBibitInDetail(defaultItem.planting_details, 'COLOR', defaultItem.max_seed_amount)"
                          class="pr-2"
                        >
                          {{ 
                            getStatusTotalBibitInDetail(defaultItem.planting_details, 'KAYU') +  
                            getStatusTotalBibitInDetail(defaultItem.planting_details, 'MPTS')
                          }} Bibit
                          <v-icon class="ml-2">{{ getStatusTotalBibitInDetail(defaultItem.planting_details, 'COLOR', defaultItem.max_seed_amount) == 'green' ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                    <tr v-if="getStatusTotalBibitInDetail(defaultItem.planting_details, 'EXISTS', 'CROPS') > 0">
                      <td>Total Crops</td>
                      <td>:</td>
                      <td>
                        <strong>
                          {{ 
                            getStatusTotalBibitInDetail(defaultItem.planting_details, 'CROPS')
                          }}
                        </strong> Bibit
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <h3 class="ml-1">
                  <v-data-table
                    :headers="headersdetail"
                    :items="defaultItem.planting_details"
                    class="elevation-1"
                  >
                    <!-- <template v-slot:item.tree_category="{ item }">
                              {{ gettype(item.tree_category) }}
                            </template> -->
                  </v-data-table>
                </h3>
              </div>
              <v-divider
                style="background-color: black !important"
              ></v-divider>
              <v-row class="mt-2">
                <v-col cols="12" md="6" lg="4">
                  <p>Tanda Tangan Petani</p>
                  <v-img
                    aspect-ratio="1"
                    lazy-src=""
                    class="rounded-lg cursor-pointer elevation-5"
                    transition="fade-transition"
                    :src="(`https://t4tadmin.kolaborasikproject.com/${defaultItem.signature}`)"
                    @click="() => {preview.signature.url = (`https://t4tadmin.kolaborasikproject.com/${defaultItem.signature}`); preview.signature.modal = true}"
                  >
                    <template v-slot:placeholder>
                      <v-skeleton-loader
                        class="mx-auto rounded-lg"
                        type="image"
                      ></v-skeleton-loader>
                    </template>
                  </v-img>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              dark
              color="red"
              class="px-5"
              rounded
              @click="() => {dialogDetail = false;disabledVerification = false}"
              outlined
              elevation="1"
            >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Close
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="RoleAccesCRUDShow == true && defaultItem.waitingapproval == true"
              color="success"
              rounded
              @click="verifSubmit()"
              :disabled="disabledVerification || getStatusTotalBibitInDetail(defaultItem.planting_details, 'ALL') == 0"
              elevation="1"
              class="px-5 white--text"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              Verifikasi
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Verification -->
      <v-dialog v-model="dialogVerification" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class=" justify-center"
            >Are you sure you want to <strong> Verification</strong>?
            <small class="red--text">this can't be undo</small>
            </v-card-title
          >
          <v-card-actions class="pb-3">
            <v-spacer></v-spacer>
            <v-btn color="red white--text" class="px-4" rounded @click="closeVerification"
              >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Cancel</v-btn
            >
            <v-btn
              color="success"
              class="px-4"
              rounded
              @click="VerificationItemConfirm"
              >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Delete -->
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class=""
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
      <!-- Preview Signature Modal -->
      <v-dialog v-model="preview.signature.modal" max-width="500px" content-class="rounded-xl" scrollable>
        <v-card class="rounded-xl">
          <v-card-title>
            Preview Signature Photo
          </v-card-title>
          <v-card-text class="pa-1 fontall">
            <v-container>
              <v-img
                class="w-100 rounded-lg"
                :lazy-src="`${preview.signature.url}`"
                :src="`${preview.signature.url}`"
              >
                <template v-slot:placeholder>
                  <v-skeleton-loader
                    class="mx-auto"
                    type="image"
                  ></v-skeleton-loader>
                </template>
              </v-img>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              elevation="1"
              outlined
              class="rounded-lg"
              @click="preview.signature.modal = false"
            >
              <v-icon left> mdi-close-circle-outline </v-icon>
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- END: MODAL -->

    <!-- Main Table -->
    <v-data-table
      class="rounded-xl elevation-6 mx-3 pa-1 mb-5"
      :headers="headers"
      :items="dataobject"
      :loading="loadtable"
      :options.sync="table.options"
      :server-items-length="table.datas.total"
      loading-text="Loading... Please wait"
      :page="table.pagination.current_page"
    >

      <template v-slot:top>
          <v-row class="pt-3 px-2">
            <v-col cols="12" lg="6" class="d-flex align-center">
              <!-- dropdown filter button -->
              <v-menu
                rounded="xl"
                bottom
                right
                offset-y
                transition="slide-y-transition"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    class=""
                    color="warning"
                    v-bind="attrs"
                    v-on="on"
                    rounded
                  >
                    <v-icon class="mr-1" small>mdi-filter-variant</v-icon> Filter
                  </v-btn>
                </template>
    
                <v-list class="d-flex flex-column align-center">
                  <v-list-item>
                    <v-btn
                      rounded
                      dark
                      class="px-9"
                      @click="showFilterArea()"
                      color="green"
                    >
                      <v-icon class="mx-2" small>mdi-map-legend</v-icon> 
                      by Area
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn
                      v-if="RoleAccesFilterShow == true"
                      rounded
                      dark
                      class="mx-3 mt-1"
                      @click="showFilterEmployee()"
                      color="green"
                    >
                      <v-icon class="mx-2" small>mdi-account-group</v-icon> 
                      by Employee
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
              <!-- Program Year -->
              <v-select
                color="success"
                item-color="success"
                v-model="program_year"
                :items="['all', 2021,2022]"
                outlined
                dense
                hide-details
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                rounded
                label="Program Year"
                class="mx-auto mx-lg-3"
                style="max-width: 200px"
              ></v-select>
            </v-col>
            <v-col cols="12" lg="6" class="d-flex align-center justify-end">
              <v-btn
                dark
                rounded
                @click="showAddModal()"
                color="green"
              >
                <v-icon class="mr-1" small>mdi-plus-circle</v-icon> Add FF Sostam
              </v-btn>
              <!-- dropdown export button -->
              <!-- <v-menu
                rounded="xl"
                bottom
                left
                offset-y
                transition="slide-y-transition"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" color="dark">
                    mdi-dots-vertical
                  </v-icon>
                </template>
      
                <v-list class="d-flex flex-column align-center">
                  <v-list-item v-if="false">
                    <v-btn
                      v-if="RoleAccesCRUDShow == true"
                      dark
                      class=""
                      @click="showAddModal()"
                      color="green"
                    >
                      <v-icon small>mdi-plus</v-icon> Add
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                  </v-list-item>
                  <v-list-item>
                    <v-btn
                      v-if="false"
                      dark
                      rounded
                      @click="downloadSuperAdmin()"
                      color="blue"
                    >
                      <v-icon class="mr-1" small>mdi-download-circle</v-icon> Export All
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-menu> -->
            </v-col>
          </v-row>
          <v-row class="pb-4 px-2">
            <v-col cols="12" lg="6">
              <!-- Page Table -->
              <v-select
                v-model="table.pagination.current_page"
                :items="table.pagination.page_options"
                hide-details
                outlined
                dense
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                rounded
                label="Page"
                class="centered-select"
                style="width: 50%;max-width: 100px;"
              ></v-select>
            </v-col>
            <v-col cols="12" lg="6" class="d-flex">
              <!-- Select Search Field -->
              <v-select
                color="success"
                item-color="success"
                v-model="table.search.field"
                :items="table.search.options.column"
                item-value="value"
                item-text="text"
                hide-details
                outlined
                dense
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                rounded
                label="Kolom Search"
                class="centered-select"
                style="width: 50%;max-width: 200px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
              ></v-select>
              <!-- Search Input -->
              <v-text-field
                color="success"
                item-color="success"
                v-if="table.search.field != 'opsi_pola_tanam' && table.search.field != 'validation'"
                v-model="table.search.value"
                append-icon="mdi-magnify"
                outlined
                dense
                rounded
                label="Search"
                hide-details
                style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;"
                :loading="table.search.options.column_loading"
              ></v-text-field>
              <v-select
                v-else-if="table.search.field == 'opsi_pola_tanam'"
                color="success"
                item-color="success"
                v-model="table.search.value"
                :items="table.search.options.pola_tanam"
                placeholder="All"
                hide-details
                outlined
                dense
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                rounded
                clearable
                label="Pilih Opsi Pola Tanam"
                class="centered-select"
                style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;"
                :loading="table.search.options.pola_tanam_loading"
              ></v-select>
              <v-select
                v-else
                color="success"
                item-color="success"
                v-model="table.search.value"
                :items="table.search.options.validation"
                item-value="value"
                item-text="text"
                hide-details
                outlined
                dense
                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                rounded
                label="Status"
                class="centered-select"
                style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;"
              ></v-select>
            </v-col>
          </v-row>
      </template>

      <!-- index column -->
      <template v-slot:item.index="{item, index}">
          {{ index + 1 + ((table.pagination.current_page - 1) * table.pagination.per_page) }}
      </template>

      <!-- Luas Lahan kolom -->
      <template v-slot:item.land_area="{ item }">
        {{ numberFormat(item.land_area) }} m<sup>2</sup>
      </template>

      <!-- Total Bibit kolom -->
      <template v-slot:item.trees_total="{ item }">
        {{ numberFormat(item.trees_total) }}
      </template>

      <!-- Color Status -->
      <template v-slot:item.validation="{ item }">
        <v-chip :color="getColorStatus(item.validation)" dark>
          {{ item.validation == 1 ? 'Verified FC' : (item.validation == 0 ? 'Unverified' : '-') }}
        </v-chip>
      </template>
      <!-- Action table -->
      <template v-slot:item.actions="{ item }">
        <v-menu
          rounded="xl"
          bottom
          left
          offset-y
          transition="slide-y-transition"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" color="dark">
              mdi-arrow-down-drop-circle
            </v-icon>
          </template>

          <v-list class="d-flex flex-column align-center">
            <v-list-item>
              <v-btn
                dark
                class="w-100"
                rounded
                @click="showDetail(item)"
                color="info"
              >
              <v-icon class="mr-1" @click="showDetail(item)" small color="white">
                  mdi-information-outline
              </v-icon>
                Detail
              </v-btn>
            </v-list-item>
            <v-list-item v-if="(RoleAccesCRUDShow == true && item.validation != 1 && User.role_name == 'UNIT MANAGER') || User.role_group == 'IT'">
              <v-btn
                vi
                dark
                class="px-7"
                rounded
                @click="showEditDetailModal(item)"
                color="warning"
              >
              <v-icon class="mr-1" small color="white">
                mdi-pencil
              </v-icon>
                Edit
              </v-btn>
            </v-list-item>
            <v-list-item v-if="(RoleAccesCRUDShow == true && item.validation != 1) || User.role_group == 'IT'">
              <v-btn
                dark
                rounded
                @click="showDeleteModal(item)"
                color="red"
              >
              <v-icon class="mr-1" small color="white">
                mdi-delete
              </v-icon>
                Delete
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        
      </template>
    </v-data-table>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="colorsnackbar"
      :timeout="timeoutsnackbar"
      rounded="xl"
    >
      {{ textsnackbar }}
    </v-snackbar>
  </div>
</template>

<script>
// import ModalFarmer from "./ModalFarmer";
import axios from "axios";
import moment from "moment";
// import BaseUrl from "../../services/BaseUrl.js";

export default {
  name: "SosialisasiTanam",
  authtoken: "",
  data: () => ({
    dialogAdd: {
      show: false,
      loading: false,

    },
    program_year: 2022,
    alerttoken: false,
    datepicker1: new Date().toISOString().substr(0, 10),
    datepicker2: new Date().toISOString().substr(0, 10),
    datepicker2Show: false,
    datepicker2Loading: false,
    datepicker2NotAvailable: [],
    datepicker2Key: 101,
    datepicker3: new Date().toISOString().substr(0, 10),
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 1) || "Min 1 characters",
    ],
    elevations: [6, 12, 18],
    itemsbr: [
      {
        text: "Activities",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Sosialisasi Tanam",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    User: [],
    menu1: "",
    menu2: "",
    menu3: "",
    dialog: false,
    dialogDelete: false,
    dialogDetail: false,
    dialogFilterArea: false,
    dialogFilterEmp: false,
    dialogShowEdit: false,
    dialogDetailPohon: false,
    dialogDetailPohonEdit: false,
    loadtable: false,
    load: false,
    formTitle: "Add Item",
    search: "",
    type: "",
    headers: [
      { text: "No", value: "index"},
      { text: "No Form", value: "form_no"},
      { text: "Field Facilitator", value: "nama_ff"},
      { text: "Nama Petani", value: "nama_petani"},
      { text: "No Lahan", align: "center", value: "no_lahan"},
      { text: "Luas Lahan", align: "center", value: "land_area"},
      { text: "Pola Tanam", align: "center", value: "opsi_pola_tanam"},
      { text: "Total Bibit", align: "center", value: "trees_total", sortable: false},
      { text: "Tahun Tanam", align: "center", value: "planting_year", sortable: false},
      { text: "Status", align: "center", value: "validation"},
      { text: "Actions", align: "right", value: "actions", sortable: false},
    ],

    headersdetail: [
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Kategori", value: "tree_category", width: "20%" },
      { text: "Jumlah", value: "amount", width: "15%" },
    ],
    headersdetaileditjumlah: [
      { text: "Nama Pohon", value: "tree_name"},
      { text: "Kategori", value: "tree_category"},
      { text: "Jumlah", value: "amount", align: 'center' },
      { text: "Actions", value: "actions", sortable: false, align: 'right' },
    ],
    DetailTreesLahanTemp: [],
    DetailTreesLahanTempData: {},
    dataobject: [],
    editedItem: {
      name: "",
    },
    defaultItem: {
      id: "",
      alamat: "",
      current_crops: "",
      distribution_location: "",
      distribution_time: "",
      document_no: "",
      farmer_no: "",
      kode: "",
      ff_name: "",
      ff_no: "",
      form_no: "",
      ktp_no: "",
      luas_lahan: "",
      land_area: "",
      luas_tanam: "",
      nama_petani: "",
      no_lahan: "",
      opsi_pola_tanam: "",
      pembuatan_lubang_tanam: "",
      planting_time: "",
      planting_year: "",
      type_sppt: "",
      validate_by: "",
      validate_name: "",
      validation: "",
      waitingapproval: false,
      max_seed_amount: '',
      tutupan_lahan: '',

      planting_details: [],
    },
    disabledVerification: false,
    itemsTahun: [
      { text: "2019", value: "2019" },
      { text: "2020", value: "2020" },
      { text: "2021", value: "2021" },
      { text: "2022", value: "2022" },
      { text: "2023", value: "2023" },
      { text: "2024", value: "2024" },
      { text: "2025", value: "2025" },
      { text: "2026", value: "2026" },
    ],

    itemsum: [],
    itemsfc: [],
    itemsff: [],
    itemspetani: [],
    itemsethnic: [],
    itemsjob: [],
    itemsgroupfarmer: [],
    itemsMU: [],
    itemsTA: [],
    itemsVillage: [],
    valueMU: "",
    valueTA: "",
    valueVillage: "",
    valueUM: "",
    valueFC: "",
    selectUM: "",
    selectFC: "",
    selectMU: "",
    selectTA: "",
    selectVillage: "",
    itemsTAForm: [],
    itemsVillageForm: [],
    valueMUForm: "",
    valueTAForm: "",
    valueVillageForm: "",
    valueFFcode: "",
    selectMUForm: "",
    selectTAForm: "",
    valueFFForm: "",
    selectVillageForm: "",
    BaseUrlGet: "",
    dialogVerification: false,
    fc_no_global: "",
    typegetdata: "",

    filephotoarray: [],

    valid: true,
    BaseUrlUpload: "",
    BaseUrl: "",
    RoleAccesFilterShow: true,
    RoleAccesDownloadAllShow: true,
    RoleAccesCRUDShow: true,
    RoleAccesPrintLabelShow: true,

    valueMUExcel: "",
    valueTAExcel: "",
    valueVillageExcel: "",
    typegetdataExcel: "",
    valueFFcodeExcel: "",

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,

    employee_no: "",
    itemTemp: "",

    jumlahPohonTemp: 0,
    idPohonTemp: 0,
    editedIndexPohon: -1,
    editedItemPohon: {
      amount: "",
      detail_year: "",
      id: "",
      lahan_no: "",
      tree_category: "",
      tree_code: "",
      tree_name: "",
    },
    table: {
      search: {
        options: {
          column: [],
          column_loading: false,
          pola_tanam: [],
          pola_tanam_loading: false,
          validation: [{
            text: 'All',
            value: ''
          },{
            text: 'Unverified',
            value: 0
          }, {
            text: 'Verified FC',
            value: 1
          }]
        },
        field: 'form_no',
        value: ''
      },
      datas: {
        total: 0,
      },
      pagination: {
        current_page: 1,
        per_page: 10,
        length_page: 0,
        page_options: []
      },
      options: {},
      lahans: {
        expanded: [],
        header: [
          { text: "No", value: "index"},
          { text: "Lahan No", value: "lahan_no"},
          { text: "Petani", value: "farmer_name"},
          { text: "Luas Lahan", value: "land_area", align: 'center'},
          { text: "Tutupan", value: "tutupan_lahan", align: 'center'},
          { text: "Pola Tanam", value: "opsi_pola_tanam"},
          { text: "Max Kayu (+ MPTS)", value: "trees", align: 'center'},
          { text: "Remove", value: "actions", align: 'right', sortable: false},
        ],
        items: [],
        loading: false,
        dialogs: {
          trees: {
            show: false,
            datas: null,
            maxSeeds: {}
          }
        }
      }
    },
    preview: {
      signature: {
        modal: false,
        url: '',
      },
    },
    options: {
      ff: {
        items: [],
        loading: false,
        model: ''
      }
    },
    dataToStore: {
      selectedFF: {},
      hasSostam: false,
      distribution_time: '',
      distribution_location: '',
      planting_time: '',
      penlub_time: '',
      lahans: []
    }
  }),
  watch: {
    'table.options': {
        handler(newValue) {
          let {page, itemsPerPage, sortBy} = newValue
          this.table.pagination.current_page = page
          this.table.pagination.per_page = itemsPerPage
          this.initialize()
        },
        deep: true
    },
    'table.search.value': {
        handler() {
          setTimeout(() => {
            this.initialize()
          }, 1000);
        },
        deep: true
    },
    'table.search.field': {
      handler(newValue) {
        if (newValue == 'opsi_pola_tanam') {
          this.getOpsiPolaTanamOptions()
        }
      }
    },
    program_year(newYear) {
      this.initialize()
    },
    'dataToStore.distribution_time': {
      handler(newValue) {
        this.dataToStore.penlub_time = moment(newValue).subtract(14, 'days')
        this.dataToStore.planting_time = moment(newValue).add(7, 'days')
      }
    },
    'datepicker2': {
      handler(newValue) {
        this.datepicker1 = moment(newValue).subtract(14, 'days')
        this.datepicker3 = moment(newValue).add(7, 'days')
      }
    },
    'datepicker2Show': {
      handler(newValue) {
        if (newValue == true) {
          this.getAvailableDistributionDates()
        }
      }
    }
  },

  mounted() {
    this.firstAccessPage();
    this.program_year = new Date().getFullYear()
    if (this.User.role_group != 'IT') {
      this.$store.state.maintenanceOverlay = true
    }
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false
  },

  methods: {
    async firstAccessPage() {
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.BaseUrl = localStorage.getItem("BaseUrl");
      this.employee_no = this.User.employee_no;

      // get search options column
      this.table.search.options.column_loading = true
      let searchColumns = ['form_no', 'nama_ff', 'nama_petani', 'no_lahan', 'land_area', 'opsi_pola_tanam', 'validation']
      // set search column options
      await this.headers.forEach(val => {
        if (searchColumns.includes(val.value)) {
          this.table.search.options.column.push(val)
        }
      })
      this.table.search.options.column_loading = false

      // this.fc_no_global = this.User.fc.fc;
      await this.checkRoleAccess();
      await this.getMU();
      await this.getEthnic();
      await this.getJob();
      await this.getFF();
      await this.getUMAll();
      this.BaseUrlUpload = localStorage.getItem("BaseUrlUpload");
    },
    checkRoleAccess() {
      if (this.User.role_group == "IT") {
        this.RoleAccesCRUDShow = true;
        this.RoleAccesFilterShow = true;
        this.RoleAccesDownloadAllShow = true;
        this.RoleAccesPrintLabelShow = true;
      } else if (this.User.role_group == "FIELD") {
        if (this.User.role == "19") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesDownloadAllShow = false;
          this.RoleAccesPrintLabelShow = false;
        } else if (this.User.role == "20") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesDownloadAllShow = true;
          this.RoleAccesPrintLabelShow = false;
        } else if (this.User.role == "14") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = true;
          this.RoleAccesDownloadAllShow = true;
          this.RoleAccesPrintLabelShow = false;
        } else {
          this.RoleAccesCRUDShow = false;
          this.RoleAccesFilterShow = true;
          this.RoleAccesDownloadAllShow = true;
          this.RoleAccesPrintLabelShow = true;
        }
      } else {
        if (this.User.role == "19" || this.User.role == "20") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesPrintLabelShow = false;
        } else {
          this.RoleAccesCRUDShow = false;
          this.RoleAccesFilterShow = true;
          this.RoleAccesPrintLabelShow = false;
        }
      }
    },
    async initialize() {
      this.loadtable = true;
      await this.getTableData().then(data => {
        this.dataobject = data.items
        this.table.datas.total = data.total
        this.table.pagination.current_page = data.current_page
        this.table.pagination.length_page = data.last_page
        const pageOptions = []
        for (let index = 1; index <= data.last_page; index++) {
          pageOptions.push(index)          
        }
        this.table.pagination.page_options = pageOptions
      }).finally(() => {
        this.loadtable = false
      })
    },
    getTableData() {
      return new Promise((resolve, reject) => {
        const params = new URLSearchParams({
          program_year: this.program_year,
          page: this.table.pagination.current_page,
          per_page: this.table.pagination.per_page,
          sortBy: this.table.options.sortBy || '',
          sortDesc: this.table.options.sortDesc || '',
          search_column: this.table.search.field || '',
          search_value: this.table.search.value || '',
          mu: this.valueMU,
          ta: this.valueTA,
          village: this.valueVillage,
          typegetdata: this.typegetdata,
          ff: this.valueFFcode,
        })
        axios.get(
          this.BaseUrlGet +
            "GetSosisalisasiTanamAdminLimit?" + params,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        ).then(res => {
          if (typeof res.data.data.result !== 'undefined') {
            let items = res.data.data.result.data
            const total = res.data.data.result.total
            const current_page = res.data.data.result.current_page
            const last_page = res.data.data.result.last_page
            resolve({
              items,
              total,
              current_page,
              last_page
            })
          } else {
            reject('Error')
          }
        }).catch(err => {
          reject(err)
        })
      })
    },

    async createSostamByFF() {
      try {
        this.dialogAdd.show = false
        this.$store.state.loadingOverlay = true

        let dataToStore = {
          ff_no: this.options.ff.model,
          lahans: this.table.lahans.items,
          program_year: 2022,
          distribution_time: this.dataToStore.distribution_time,
          distribution_location: this.dataToStore.distribution_location,
          distribution_location: this.dataToStore.distribution_location,
          planting_time: this.dateFormat(this.dataToStore.planting_time, 'Y-MM-DD'),
          penlub_time: this.dateFormat(this.dataToStore.penlub_time, 'Y-MM-DD'),
        }

        const res = await axios.post(
          this.BaseUrlGet + "createSostamByFF",
          dataToStore,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken
            },
          }
        )
        // reset form create value
        this.options.ff.model = ''
        this.table.lahans.items = []
        this.dataToStore.distribution_location
        
        this.initialize()
        this.colorsnackbar = 'green'
        this.textsnackbar = `Berhasil menambah ${res.data.data.result.created['data']} data sostam`
        this.timeoutsnackbar = 10000
        this.snackbar = true
      } catch (err) {
        console.log(err.response)
      } finally {
        this.$store.state.loadingOverlay = false
      }
    },

    async getMU() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetManagementUnit",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        if (response.data.length != 0) {
          this.itemsMU = response.data.data.result;
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
    async getTA(val) {
      var valparam = "";
      if (val == "table") {
        valparam = this.valueMU;
      } else {
        valparam = this.valueMUForm;
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetTargetArea?mu_no=" + valparam,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        if (response.data.length != 0) {
          if (val == "table") {
            this.itemsTA = response.data.data.result;
          } else {
            this.itemsTAForm = response.data.data.result;
          }
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
    async getVillage(val) {
      var valparam = "";
      if (val == "table") {
        valparam = this.valueTA;
      } else {
        valparam = this.valueTAForm;
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetDesa?kode_ta=" + valparam,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          if (val == "table") {
            this.itemsVillage = response.data.data.result;
          } else {
            this.itemsVillageForm = response.data.data.result;
          }
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
    async getEthnic() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetSuku", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsethnic = response.data.data.result;
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
    async getJob() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetPekerjaan", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsjob = response.data.data.result;
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
    async getFF() {
      if (this.User.fc.fc) {
        this.fc_no_global = this.User.fc.fc;
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetFieldFacilitatorAll?fc_no=" + this.fc_no_global,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsff = response.data.data.result.data;
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
    async getDetail(item) {
      this.load = true;
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetDetailSosisalisasiTanam?form_no=" +
            item.form_no,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.defaultItem = Object.assign({}, response.data.data.result);
          this.defaultItem.land_area = response.data.data.result.luas_lahan
          if (this.defaultItem.max_seed_amount == null || this.defaultItem.max_seed_amount == 'null') {
            let maxSeedTrue = parseInt(this.getSeedCalculation(this.defaultItem, 'total_max_trees'))
            let totalBibitMPTSKAYU = parseInt(this.getStatusTotalBibitInDetail(this.defaultItem.planting_details, 'KAYU')) + parseInt(this.getStatusTotalBibitInDetail(this.defaultItem.planting_details, 'MPTS'))
            let separator = maxSeedTrue - totalBibitMPTSKAYU
            console.log('separator = ' + separator)
            if (separator < 0) {
              this.disabledVerification = true
            }

            // set max_seed_amount
            this.defaultItem.max_seed_amount = maxSeedTrue
          }
          this.defaultItem.waitingapproval = this.waitingapprovefunct(
            response.data.data.result.validation
          );
          if (this.type == "Detail") {
            this.load = false;
          } else {
            //   this.valueMUForm = response.data.data.result.mu_no;
            // this.valueTAForm = response.data.data.result.target_area;
            this.valueFFForm = response.data.data.result.ff_no;
            this.datepicker1 = response.data.data.result.pembuatan_lubang_tanam;
            this.datepicker2 = response.data.data.result.distribution_time;
            this.datepicker3 = response.data.data.result.planting_time;
          }

          this.load = false;
          //   this.defaultItem.kode = response.data.data.result.farmer_no;
        } else {
          console.log("Kosong");
          this.load = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
          this.load = false;
        }
      }
    },
    async verif() {
      console.log(this.defaultItem.id);
      const datapost = {
        form_no: this.defaultItem.form_no,
        validate_by: this.employee_no,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "ValidateSosisalisasiTanam",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialogDetail = false;
          this.dialogVerification = false;
          this.initialize();
        } else {
          this.dialogDetail = false;
          this.dialogVerification = false;
          this.alerttoken = true;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.alerttoken = true;
          this.dialogDetail = false;
          this.dialogVerification = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async verifDelete() {
      const datapost = {
        form_no: this.defaultItem.form_no,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "SoftDeleteSosisalisasiTanam",
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
          this.initialize();
        } else {
          this.dialogDelete = false;
          this.alerttoken = true;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.alerttoken = true;
          this.dialogDelete = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },

    async getUMAll() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetEmployeebyPosition?position_code=20",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsum = response.data.data.result.data;
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
    async getEmpFCbyManager(valcodeum) {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetEmployeebyManager?manager_code=" +
            valcodeum +
            "&position=19",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsfc = response.data.data.result.data;
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
    async GetFFbyUMandFC(position, valcode) {
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetFFbyUMandFC?position=" +
            position +
            "&code=" +
            valcode,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.valueFFcode = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        this.valueFFcode = "";
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
      console.log(this.valueFFcode);
    },

    async addData() {
      const datapost = {
        ff_no: this.defaultItem.ff_no,
        farmer_no: this.defaultItem.farmer_no,
        no_lahan: this.defaultItem.no_lahan,
        planting_year: this.defaultItem.planting_year,
        pembuatan_lubang_tanam: this.datepicker1,
        distribution_time: this.datepicker2,
        planting_time: this.datepicker3,
        distribution_location: this.defaultItem.distribution_location,
      };
      console.log(datapost);
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddSosisalisasiTanam",
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
          this.textsnackbar = "Sukses menambahkan data";
          this.initialize();
        } else {
          this.dialog = true;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = true;
        }
      }
    },

    async updateData() {
      const datapost = {
        form_no: this.defaultItem.form_no,
        ff_no: this.defaultItem.ff_no,
        farmer_no: this.defaultItem.farmer_no,
        no_lahan: this.defaultItem.no_lahan,
        planting_year: this.defaultItem.planting_year,
        pembuatan_lubang_tanam: this.datepicker1,
        distribution_time: this.datepicker2,
        planting_time: this.datepicker3,
        distribution_location: this.defaultItem.distribution_location,
      };
      console.log(datapost);
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateSosisalisasiTanam",
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
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = true;
        }
      }
    },
    async updateDataPohon(datapost) {
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdatePohonSosisalisasiTanam",
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
          this.dialogDetailPohon = false;
          this.initialize();
        } else {
          this.dialog = true;
        }
      } catch (error) {
        console.error(error.response.data.data);
        if (error.response.status == 401) {
          this.dialog = true;
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = error.response.data.data.result;
        }
      }
    },
    async getPetani() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetFarmerAllAdmin?typegetdata=several&ff=" +
            this.valueFFForm,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemspetani = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          this.itemspetani = [];
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
        this.itemspetani = [];
        this.defaultItem.farmer_no = "";
      }
    },

    selectedMU(a) {
      console.log(a);
      this.valueMU = a;
      if (a != null) {
        this.getTA("table");
        this.valueTA = "";
        this.selectTA = "";
        this.selectVillage = "";
        this.valueVillage = "";
      } else {
        this.valueMU = "";
        this.valueTA = "";
        this.itemsTA = [];
        this.valueVillage = "";
        this.itemsVillage = [];
      }
      // this.initialize();
    },
    selectedTA(a) {
      console.log(a);
      this.valueTA = a;
      if (a != null) {
        this.getVillage("table");
        this.valueVillage = "";
        this.selectVillage = "";
      } else {
        this.valueTA = "";
        this.valueVillage = "";
        this.itemsVillage = [];
      }
      // this.initialize();
    },
    selectedVillage(a) {
      console.log(a);
      this.valueVillage = a;
      if (a == null) {
        this.valueVillage = "";
      }
      // this.initialize();
    },
    selectedUM(a) {
      console.log(a);
      this.valueUM = a;
      if (a != null) {
        this.getEmpFCbyManager(a);
        this.GetFFbyUMandFC("UM", a);
        this.valueFC = "";
        this.selectFC = "";
        this.typegetdata = "several";
      } else {
        this.valueUM = "";
        this.valueFC = "";
        this.itemsfc = [];
        this.typegetdata = this.User.ff.value_data;
      }
      // this.initialize();
    },
    selectedFC(a) {
      console.log(a);
      this.valueFC = a;
      this.GetFFbyUMandFC("FC", a);
      this.typegetdata = "several";
      if (a == null) {
        this.valueFC = "";
        this.selectFC = "";
        this.typegetdata = this.User.ff.value_data;
      }
    },
    async showDetail(item) {
      this.type = "Detail";
      this.dialogDetail = true;
      this.disabledVerification = false
      await this.getDetail(item);
    },

    selectedMUForm(a) {
      console.log(a);
      this.valueMUForm = a;
      if (a != null) {
        this.getTA("form");
        this.getFarmerGroup();
        this.valueTAForm = "";
        this.selectTAForm = "";
        this.selectVillageForm = "";
        this.valueVillageForm = "";
      } else {
        this.valueMUForm = "";
        this.valueTAForm = "";
        this.itemsTAForm = [];
        this.valueVillageForm = "";
        this.itemsVillageForm = [];
        this.defaultItem.mu_no = a;
      }
    },
    selectedTAForm(a) {
      console.log(a);
      this.valueTAForm = a;
      if (a != null) {
        this.getVillage("form");
        this.valueVillageForm = "";
        this.selectVillageForm = "";
        this.defaultItem.village = "";
      } else {
        this.valueTAForm = "";
        this.valueVillageForm = "";
        this.itemsVillageForm = [];
        this.defaultItem.village = "";
        this.defaultItem.kode_ta = a;
      }
    },
    selectedVillageForm(a) {
      console.log(a);
      this.valueVillageForm = a;
      this.defaultItem.village = a;
      if (a == null) {
        this.valueVillageForm = "";
        this.defaultItem.village = "";
      }
    },
    selectPetani(a) {
      console.log(a);
      // this.valueMUForm = a;
      if (a != null) {
        this.valueFFForm = a;
        this.getPetani();
      } else {
        this.defaultItem.ff_no = "";
        this.defaultItem.kode = "";
        this.itemspetani = [];
      }
    },

    async showFilterArea() {
      // console.log(localStorage.getItem("token"));
      await this.resetFilter();
      this.dialogFilterArea = true;
    },
    async showFilterEmployee() {
      await this.resetFilter();
      this.dialogFilterEmp = true;
    },
    resetFilter() {
      this.valueMU = "";
      this.valueTA = "";
      this.valueVillage = "";
      this.selectMU = "";
      this.selectTA = "";
      this.selectVillage = "";

      this.valueUM = "";
      this.valueFC = "";
      this.selectUM = "";
      this.selectFC = "";
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data;
    },
    async searchbyarea() {
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data;
      await this.initialize();
      await this.resetFilter();
      this.dialogFilterArea = false;
    },
    async searchbyemp() {
      await this.initialize();
      await this.resetFilter();
      this.dialogFilterEmp = false;
    },
    async showEditModal() {
      this.type = "Edit";
      console.log(this.itemTemp);
      this.dialog = true;
      this.dialogShowEdit = false;
      await this.getDetail(this.itemTemp);
      await this.getPetani();
      //   console.log(item.farmer_no);
      //   console.log(item);
      this.formTitle = "Edit data";
      this.defaultItem.farmer_no = this.itemTemp.farmer_no;
    },
    async showEditJumlahPohonModal() {
      // console.log(item.kode);
      this.type = "Edit";
      await this.getDetail(this.itemTemp);

      this.DetailTreesLahanTemp = this.defaultItem.planting_details;
      this.DetailTreesLahanTempData = this.defaultItem
      
      if (this.DetailTreesLahanTemp.length == 0) {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Tidak Bisa Edit, Jumlah Pohon Kosong. Harus di isi lewat aplikasi android";
      } else {
        this.dialogShowEdit = false;
        this.dialogDetailPohon = true;
      }
    },
    async showEditDetailModal(item) {
      this.type = "Edit";
      this.itemTemp = item;
      // await this.getDetail(item);
      console.log(this.itemTemp);
      this.dialogShowEdit = true;
    },

    showPrintModal(item) {
      this.type = "Detail";
      // this.dialogDetail = true;
      this.getDetail(item);

      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakLabelSosTam?form_no=" +
          item.form_no
      );
    },

    saveEditPohon() {
      const d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      var date = d.getDate();

      var datenow = year + "-" + month + "-" + date;

      const datapost = {
        form_no: this.defaultItem.form_no,
        list_pohon: this.DetailTreesLahanTemp,
        detail_year: datenow,
      };

      console.log(datapost);
      this.updateDataPohon(datapost);
    },
    saveEditPohonTemp() {
      Object.assign(
        this.DetailTreesLahanTemp[this.editedIndexPohon],
        this.editedItemPohon
      );

      console.log(this.DetailTreesLahanTemp);

      this.dialogDetailPohonEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.editedItemPohon);
        this.editedIndex = -1;
      });
    },
    editDetailPohon(item) {
      console.log(item);
      this.editedItemPohon.amount = item.amount;
      this.editedItemPohon.tree_name = item.tree_name;
      this.editedItemPohon.tree_category = item.tree_category;
      this.idPohonTemp = item.id;
      this.editedIndexPohon = this.DetailTreesLahanTemp.indexOf(item);
      this.editedItemPohon = Object.assign({}, item);
      this.dialogDetailPohonEdit = true;
    },
    deleteDetailPohon(item) {
      console.log(item);
      this.editedIndexPohon = this.DetailTreesLahanTemp.indexOf(item);
      this.editedItemPohon = Object.assign({}, item);

      this.DetailTreesLahanTemp.splice(this.editedIndexPohon, 1);

      console.log(this.DetailTreesLahanTemp);

      // this.dialogDetailPohonEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.editedItemPohon);
        this.editedIndex = -1;
      });
    },

    showDeleteModal(item) {
      console.log(item.form_no);
      this.defaultItem.form_no = item.form_no;
      this.dialogDelete = true;
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
    closeDetailEditPohon() {
      this.dialogDetailPohonEdit = false;
    },
    closeDetailDeletePohon() {
      this.dialogDetailPohonEdit = false;
    },
    closeDetailPohon() {
      this.dialogDetailPohon = false;
    },

    verifSubmit() {
      this.dialogVerification = true;
    },
    VerificationItemConfirm() {
      this.verif();
    },
    closeVerification() {
      this.dialogVerification = false;
    },

    async save() {
      this.$refs.form.validate();

      if (
        this.defaultItem.no_lahan.length != 0 &&
        this.defaultItem.planting_year.length != 0 &&
        this.defaultItem.distribution_location.length != 0 &&
        this.defaultItem.farmer_no.length != 0 &&
        this.defaultItem.ff_no != null
      ) {
        if (this.defaultItem.id) {
          this.updateData();
        } else {
          this.addData();
        }
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Gagal Simpan, Kolom required tidak boleh ada yang kosong";
      }

      // this.close();
    },

    capitalize(word) {
      return word[0].toUpperCase() + word.substring(1).toLowerCase();
    },
    genderindo(val) {
      if (val == "male") {
        return "Laki-Laki";
      } else {
        return "Perempuan";
      }
    },
    convertToRupiah(angka) {
      var rupiah = "";
      var angkarev = angka.toString().split("").reverse().join("");
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ".";
      rupiah = rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("");
      return "Rp. " + (rupiah.length < 1 ? "0" : rupiah) + ",-";
    },
    waitingapprovefunct(valapprove) {
      if (valapprove == 0) {
        return true;
      } else {
        return false;
      }
    },

    gettanggal(val) {
      var bulanIndo = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Juni",
        "Juli",
        "Agust",
        "Sept",
        "Okt",
        "Nov",
        "Des",
      ];

      var date = val.split(" ")[0];

      var tanggal = date.split("-")[2];
      var bulan = date.split("-")[1];
      var tahun = date.split("-")[0];

      return tanggal + " " + bulanIndo[Math.abs(bulan)] + " " + tahun;
    },

    downloadSuperAdmin() {
      console.log(this.valueMUExcel);
      console.log(this.valueTAExcel);
      console.log(this.valueVillageExcel);
      console.log(this.typegetdataExcel);
      console.log(this.valueFFcodeExcel);
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "ExportSostamAllSuperAdmin?mu=" +
          this.valueMUExcel +
          "&ta=" +
          this.valueTAExcel +
          "&village=" +
          this.valueVillageExcel +
          "&typegetdata=" +
          this.typegetdataExcel +
          "&ff=" +
          this.valueFFcodeExcel
      );

      // this.valueMUExcel = "";
      // this.valueTAExcel = "";
      // this.valueVillageExcel = "";
      // this.typegetdataExcel = "";
      // this.valueFFcodeExcel = "";
    },
    getColorStatus(status) {
      if (status == 0) return "red";
      else return "green";
    },
    async getOpsiPolaTanamOptions() {
      try {
        this.table.search.options.pola_tanam_loading = true
        if (this.table.search.options.pola_tanam.length == 0) {
          const res = await axios.get(
            this.BaseUrlGet + "GetOpsiPolaTanamOptions",
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          )

          this.table.search.options.pola_tanam = res.data.data.result
        }
      } finally {
        this.table.search.options.pola_tanam_loading = false
      }
    },
    async showAddModal() {
      try {
        this.dialogAdd.loading = true
        this.dialogAdd.show = true
        await this.getFFOptions()
      } finally {
        this.dialogAdd.loading = false
      }
    },
    async getLahansFF() {
      try {
        this.table.lahans.loading = true

        const params = new URLSearchParams({
          ff_no: this.options.ff.model,
          program_year: 2022
        })
        const res = await axios.get(
          this.BaseUrlGet + `getFFLahanSostam?${params}`,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        )
        this.dataToStore.selectedFF = res.data.data.result.ff
        this.table.lahans.items = res.data.data.result.lahans
        this.dataToStore.hasSostam = res.data.data.result.sostam > 0 ? true : false
      } catch (err) {
        console.log(err.response)
      } finally {
        this.table.lahans.loading = false
      }
    },
    async getFFOptions() {
      try {
        this.options.ff.loading = true

        const params = new URLSearchParams({
          typegetdata: this.typegetdata,
          ff: this.valueFFcode.join(),
          program_year: 2022
        })
        
        const res = await axios.get(
          this.BaseUrlGet + `getFFOptionsSostam?${params}`,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        )
        this.options.ff.items = res.data.data.result
      } catch (err) {
        console.log(err.response)
      } finally {
        this.options.ff.loading = false
      }
    },
    // Utilities
    dateFormat(date, format) {
        return moment(date).format(format)
    },
    disabledEditPohon(trees = [], category = '', sostam) {
      let maxBibit = sostam.max_seed_amount || this.getSeedCalculation(sostam, 'total_max_trees')
      let minKayu = Math.round(maxBibit * 60/100)
      
      let total = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0
      }
      
      trees.forEach(treeData => {
        total[treeData.tree_category] += parseInt(treeData.amount)
      })

      let totalBibitNow = total.KAYU + total.MPTS + total.CROPS

      console.log('disable edit pohon : ' + total.KAYU )

      if (category != '') {
        if (category == 'MPTS') {
          if (total.KAYU < minKayu) {
            return true
          } else return false
        } else return false
      } else return false

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
    getAvailableBibit(trees = [], maxSeed = 0, item = null) {
      let total = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0
      }

      trees.forEach(val => {
        if (item.tree_name != val.tree_name) {
          total[val.tree_category] += parseInt(val.amount)
        }
      })

      if (item.tree_category == 'CROPS') {
        return Math.round(total.KAYU * 20 / 100) - item.amount
      } else if (item.tree_category == 'KAYU') {
        return parseInt(maxSeed) - item.amount - total.KAYU - total.MPTS
      } else if(item.tree_category == 'MPTS') {
        return parseInt(maxSeed) - item.amount - total.KAYU - total.MPTS
      }
    },
    getDisabledSaveItemPohon(listEditPohon, dataSostamEditPohon, editPohon) {
      let getAvailableBibit = this.getAvailableBibit(listEditPohon, (dataSostamEditPohon.max_seed_amount || this.getSeedCalculation(dataSostamEditPohon, 'total_max_trees')), editPohon)
      let totalNow = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0
      }
      listEditPohon.forEach(treeNow => {
        totalNow[treeNow.tree_category] += parseInt(treeNow.amount)
      })

      let disabled = 0
      if (getAvailableBibit < 0) {
        disabled += 1
      }

      if (disabled > 0) {
        return true
      } else return false
    },
    getSeedCalculation(lahan, typeReturn, indexLahan = null) {
      const calculationAgroforestry = {
        satu_jalur: {
          300: [18, 12, 4],
          400: [24, 16, 5],
          500: [31, 20, 6],
          600: [37, 24, 7],
          700: [43, 29, 9],
          800: [49, 33, 10],
          900: [55, 37, 11],
          1000: [61, 41, 12],
          1100: [67, 45, 13],
          1200: [73, 49, 15],
          1300: [80, 53, 16],
          1400: [86, 57, 17],
          1500: [92, 61, 18],
          1600: [98, 65, 20],
          1700: [104, 69, 21],
          1800: [110, 73, 22],
          1900: [116, 78, 23],
          2000: [122, 82, 24],
        },
        tepi: {
          300: [6, 4, 1],
          400: [8, 5, 2],
          500: [10, 6, 2],
          600: [12, 8, 2],
          700: [13, 9, 3],
          800: [15, 10, 3],
          900: [17, 12, 3],
          1000: [19, 13, 4],
          1100: [21, 14, 4],
          1200: [23, 15, 5],
          1300: [25, 17, 5],
          1400: [27, 18, 5],
          1500: [29, 19, 6],
          1600: [31, 20, 6],
          1700: [33, 22, 7],
          1800: [35, 23, 7],
          1900: [36, 24, 7],
          2000: [38, 26, 8],
        },
        acak: {
          300: [4, 3, 1],
          400: [6, 4, 1],
          500: [7, 5, 1],
          600: [9, 6, 2],
          700: [10, 7, 2],
          800: [12, 8, 2],
          900: [13, 9, 3],
          1000: [14, 10, 3],
          1100: [16, 11, 3],
          1200: [17, 12, 3],
          1300: [19, 12, 4],
          1400: [20, 13, 4],
          1500: [22, 14, 4],
          1600: [23, 15, 5],
          1700: [24, 16, 5],
          1800: [26, 17, 5],
          1900: [27, 18, 5],
          2000: [29, 19, 6],
        },
      }
      let trees_max = {
        kayu: 0,
        mpts: 0,
        crops: 0
      }

      let maxBibit = {
        kayu: 0,
        mpts: 0,
        crops: 0
      }

      let totalBibitMax = 0

      if (lahan.land_area < 10000) {
        const luasLahan = Math.floor((lahan.land_area > 2000 ? 2000 : lahan.land_area) / 100) * 100
  
        if (lahan.opsi_pola_tanam == 'Pola Konservasi Pohon Kayu' ) {
          maxBibit.kayu = luasLahan * .25
        } else if (lahan.opsi_pola_tanam == 'Pola Konservasi Pohon Kayu + MPTS' ) {
          maxBibit.kayu = (luasLahan * .25) * .6
          maxBibit.mpts = (luasLahan * .25) * .4
        } else if (lahan.opsi_pola_tanam == 'Pola Agroforestry Satu Jalur' ) {
          if (luasLahan >= 300) {
            maxBibit = {
              kayu: calculationAgroforestry.satu_jalur[luasLahan][0],
              mpts: calculationAgroforestry.satu_jalur[luasLahan][1],
            }
          }
        } else if (lahan.opsi_pola_tanam == 'Pola Agroforestry Tepi' ) {
          if (luasLahan >= 300) {
            maxBibit = {
              kayu: calculationAgroforestry.tepi[luasLahan][0],
              mpts: calculationAgroforestry.tepi[luasLahan][1],
            }
          }
        } else if (lahan.opsi_pola_tanam == 'Pola Agroforestry Acak' ) {
          if (luasLahan >= 300) {
            maxBibit = {
              kayu: calculationAgroforestry.acak[luasLahan][0],
              mpts: calculationAgroforestry.acak[luasLahan][1],
            }
          }
        }
        totalBibitMax = Math.round((maxBibit.kayu + maxBibit.mpts) * (100 - lahan.tutupan_lahan) / 100)
      }
      
      if (typeReturn == 'total_max_trees') {
        return totalBibitMax
      } else if (typeReturn == 'setDataToStore') {
        this.table.lahans.items[indexLahan].max_seed_amount = totalBibitMax
        return totalBibitMax
      } 
    },
    getStatusTotalBibitInDetail(seeds, typeReturn, secParams = null) {
      let exists = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0
      }
      let total = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0
      }
      seeds.forEach((seed) => {
        total[seed.tree_category] += parseInt(seed.amount)
        exists[seed.tree_category] += 1
      })

      if (typeReturn == 'KAYU' || typeReturn == 'MPTS' || typeReturn == 'CROPS') {
        return total[typeReturn]
      } else if (typeReturn == 'ALL') {
        return total.KAYU + total.MPTS + total.CROPS
      } else if (typeReturn == 'COLOR') {
        if (secParams >= (total.KAYU + total.MPTS) && (total.KAYU + total.MPTS) > 0) {
          this.disabledVerification = false
          return 'green'
        } else {
          this.disabledVerification = true
          return 'red'
        }
      } else if(typeReturn == 'EXISTS' ) {
        return exists[secParams]
      }
    },
    numberFormat(num) {
        return new Intl.NumberFormat('id-ID').format(num)
    },
    showingAvailableDates(val) {
      return this.datepicker2NotAvailable.includes(val) == false
    },
    async getAvailableDistributionDates() {
      this.datepicker2Loading = true
      const distributionDateRange = [
        {
          month: '11',
          year: '2022',
          program_year: 2022
        },
        {
          month: '12',
          year: '2022',
          program_year: 2022
        },
        {
          month: '01',
          year: '2023',
          program_year: 2022
        },
      ]
      // get FF MU no
      let ff_mu_no = ''
      await this.options.ff.items.forEach((ffVal) => {
        if (ffVal.ff_no == this.options.ff.model) {
          ff_mu_no = ffVal.mu_no
        } 
      })

      // get ff nursery
      let ff_nursery = this.getNurseryAlocation(ff_mu_no) 

      let ffDatesFull = []
      let ffDatesAvailable = []

      await Promise.all(distributionDateRange.map(async (dDate, dIndex) => {
        let params = new URLSearchParams(dDate)
        await axios.get(
          localStorage.getItem("BaseUrlGet") + 'DistributionCalendar?' + params,
          {
            headers: {
              Authorization: `Bearer ` + localStorage.getItem("token")
            },
          }
        ).then(res => {
          const resData = res.data.data.result.datas || []
          resData.forEach((avData, avIndex) => {
            if (avData.nursery == ff_nursery) {
              avData.color = this.calendarGetNurseryColor(avData.nursery, avData.total, avData.date)
              if (avData.color == 'yellow') {
                ffDatesAvailable.push(this.dateFormat(avData.date, 'Y-MM-DD'))
              } else {
                ffDatesFull.push(this.dateFormat(avData.date, 'Y-MM-DD'))
              }
            }
          })
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          if (dIndex == 2) {
            this.datepicker2NotAvailable = ffDatesFull
            this.datepicker2Loading = false
          }
        })
      }))
    },
    getNurseryAlocation(mu_no) {
        const ciminyak   = ['023', '026', '027', '021', '029']
        const arjasari   = ['022', '024', '025', '020']
        const kebumen    = ['019']
        const pati       = ['015']
        
        let nursery = 'Tidak Ada'

        if (ciminyak.includes(mu_no)) {
            nursery = 'Ciminyak'
        } else if (arjasari.includes(mu_no)) {
            nursery = 'Arjasari'
        } else if (kebumen.includes(mu_no)) {
            nursery = 'Kebumen'
        } else if (pati.includes(mu_no)) {
            nursery = 'Pati'
        }
        
        return nursery;
    },
    calendarGetNurseryColor(n, total, date) {
        let maxFF = this.calendarGetMaxFF(n, date)
        
        if (total === maxFF) {
            return 'green'
        } else if (total > maxFF) {
            return 'red'
        } else {
            return 'yellow'
        }
    },
    calendarGetMaxFF(n, date) {
        if (n == 'Arjasari') {
            if (date >= '2022-12-21' && date <= '2022-12-31') {
                return 8
            } else if (date >= '2023-01-01' && date <= '2023-01-31') {
                return 5
            } else return 4
        } else if (n == 'Ciminyak') {
            if (date >= '2022-12-21' && date <= '2022-12-31') {
                return 8
            } else return 4
        } else if (n == 'Kebumen' || n == 'Pati') {
            return 1
        } else return 4
    },
  },
};
</script>
