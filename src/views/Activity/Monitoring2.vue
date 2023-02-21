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

    <div class="mx-9">
      <v-alert :value="alerttoken" color="red" elevation="24" type="error">
        Session Token Login Habis, Login Kembali !
      </v-alert>
    </div>

    <v-card v-if="false" elevation="5" class="pt-1 pb-0 px-2 mx-3 mt-0 mb-3" data-aos="fade-up" data-aos-delay="200">
      <v-card-text class="px-1">
        <v-row>
          <v-col
            class="px-2 py-1"
            cols="12"
            sm="3"
            md="3"
            style="text-align: center"
          >
            <v-btn
              dark
              class="mx-3 mt-1"
              @click="showFilterArea()"
              color="green"
              block
            >
              <v-icon class="mx-2" small>mdi-filter-variant</v-icon> Filter by
              Area
            </v-btn>
            <v-btn
              v-if="RoleAccesFilterShow == true"
              dark
              class="mx-3 mt-1"
              @click="showFilterEmployee()"
              color="green"
              block
            >
              <v-icon class="mx-2" small>mdi-image-filter-none</v-icon> Filter
              by Employee
            </v-btn>
            <div
              class="mr-3 mt-3 pt-2"
              style="
                border-style: solid;
                border-color: red;
                height: 150px;
                margin-left: 30px !important;
              "
            >
              <p># Titik Maps diambil dari maks 10 dari list Monitoring</p>
              <p># Klik Titik di Maps Untuk Melihat Detail Sederhana</p>
            </div>
          </v-col>
          <v-col
            class="px-3 py-1"
            cols="12"
            sm="9"
            md="9"
            style="text-align: center"
          >
            <l-map
              style="height: 300px; z-index: "
              :zoom="zoom"
              :center="center"
            >
              <l-tile-layer
                :url="url"
                :attribution="attribution"
              ></l-tile-layer>
              <!-- <l-marker :lat-lng="markerLatLng"></l-marker> -->
              <l-marker
                v-for="star in listMarker"
                :lat-lng="LatLng(star.latitude, star.longitude)"
                :key="star.name"
              >
                <l-popup>
                  <h4>Lahan No : {{ star.lahan_no }}</h4>
                  <h4>Petani : {{ star.nama_petani }}</h4>
                  <h4>Luas Tanam : {{ star.planting_area }} m<sup>2</sup></h4>
                  <h4>{{ star.longitude }},{{ star.latitude }}</h4>
                </l-popup>
              </l-marker>
            </l-map>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-data-table
      data-aos="fade-up" data-aos-delay="400"
      :headers="headers"
      :items="dataobject"
      :loading="loadtable"
      loading-text="Loading... Please wait"
      class="rounded elevation-6 mx-3 pa-1"
    >
      <!-- Color Status -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="getColorStatus(item.status)" dark>
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <!-- <v-btn
            dark
            class="mx-3 mt-1 d-none d-md-block"
            @click="showFilterArea()"
            color="green"
          >
            <v-icon class="mx-2" small>mdi-filter-variant</v-icon> Filter by
            Area
          </v-btn>
          <v-btn
            v-if="RoleAccesFilterShow == true"
            dark
            class="mx-3 mt-1 d-none d-md-block"
            @click="showFilterEmployee()"
            color="green"
          >
            <v-icon class="mx-2" small>mdi-image-filter-none</v-icon> Filter by
            Employee
          </v-btn> -->
          <v-divider class="mx-4 d-none d-md-block" inset vertical></v-divider>
          <v-spacer class="d-none d-md-block"></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <!-- <v-btn
            v-if="RoleAccesIT == true"
            dark
            class="mb-2 mr-1"
            @click="showAddModal()"
            color="green"
          >
            <v-icon small>mdi-plus</v-icon> Add
          </v-btn> -->
          <!-- <v-btn
            v-if="RoleAccesDownloadAllShow == true"
            dark
            class="mb-2 mr-1 d-none d-md-block"
            @click="downloadSuperAdmin()"
            color="blue"
          >
            <v-icon class="mr-1" small>mdi-download-circle</v-icon> Export All
          </v-btn> -->
          <!-- <v-btn
            v-if="RoleAccesDownloadAllShow == true"
            dark
            class="mb-2 mr-1 d-none d-md-block"
            @click="downloadSuperAdmin()"
            color="blue"
          >
            <v-icon class="mr-1" small>mdi-download-circle</v-icon> Export
          </v-btn> -->
          <!-- Modal Filter Area -->
          <v-dialog
            v-model="dialogFilterArea"
            max-width="500px"
            style="z-index: 20001"
          >
            <v-card>
              <v-card-title class="headline"
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
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="searchbyarea"
                  >Cari</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Modal Filter Emp -->
          <v-dialog
            style="z-index: 20001"
            v-model="dialogFilterEmp"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="headline"
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
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="searchbyemp"
                  >Cari</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Modal Add Edit -->
          <v-dialog style="z-index: 20001" v-model="dialog" max-width="800px">
            <v-card>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-title class="mb-1 headermodalstyle">
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text class="pa-0 fontall">
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
                  <v-stepper v-if="load == false" v-model="e1">
                    <v-stepper-header>
                      <v-stepper-step editable :complete="e1 > 1" step="1">
                        Main Data
                      </v-stepper-step>
                      <v-divider></v-divider>
                      <v-stepper-step editable :complete="e1 > 2" step="2">
                        List Pohon
                      </v-stepper-step>
                      <v-divider></v-divider>
                      <v-stepper-step editable step="3"> Foto </v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                      <v-stepper-content class="pa-3" step="1">
                        <v-container class="mb-2">
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="defaultItem.user_id"
                                :items="itemsff"
                                item-text="name"
                                item-value="ff_no"
                                label="Pilih Field Facilitator"
                                outlined
                                clearable
                                type="string"
                                v-on:change="selectPetani"
                                :rules="[(v) => !!v || 'Field is required']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="defaultItem.lahan_no"
                                label="No Lahan"
                                outlined
                                type="string"
                                :rules="[(v) => !!v || 'Field is required']"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                v-model="defaultItem.planting_year"
                                :items="itemsTahun"
                                item-text="text"
                                item-value="value"
                                label="Pilih Tahun Program"
                                outlined
                                clearable
                                type="string"
                                :rules="[(v) => !!v || 'Field is required']"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="defaultItem.total_holes"
                                label="Total Lubang"
                                outlined
                                type="number"
                                :rules="[(v) => !!v || 'Field is required']"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>

                        <v-row class="ma-2">
                          <v-spacer></v-spacer>
                          <v-btn
                            class="mr-1"
                            color="red"
                            elevation="1"
                            @click="close"
                            outlined
                          >
                            <v-icon left> mdi-close-circle-outline </v-icon>
                            Cancel
                          </v-btn>
                          <v-btn
                            elevation="1"
                            outlined
                            color="primary"
                            @click="e1 = 2"
                          >
                            <v-icon left>
                              mdi-chevron-right-circle-outline
                            </v-icon>
                            Next
                          </v-btn>
                        </v-row>
                      </v-stepper-content>

                      <v-stepper-content class="pa-3" step="2">
                        <v-container class="mb-2">
                          <v-row class="mb-3">
                            <h4>Pilih Pohon</h4>
                            <v-divider class="mx-2 mt-3"></v-divider>
                          </v-row>
                          <v-row>
                            <v-col class="px-1 py-0" cols="12" sm="12" md="12">
                              <v-combobox
                                :items="itemstrees"
                                item-value="tree_code"
                                item-text="tree_name"
                                label="Pilih Pohon"
                                v-on:change="changeBarangSelected"
                                outlined
                                clearable
                              ></v-combobox>
                            </v-col>
                          </v-row>
                          <v-row class="mb-3">
                            <h4>List Pohon</h4>
                            <v-divider class="mx-2 mt-3"></v-divider>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-data-table
                                :headers="headerListProduct"
                                :items="defaultItem.list_detail"
                                class="elevation-3"
                                append-icon="mdi-magnify"
                                :items-per-page="5"
                                :loading="loadtabledetail"
                                loading-text="Loading... Please wait"
                              >
                                <template v-slot:item.actions="{ item }">
                                  <v-icon
                                    class="mr-2"
                                    @click="deletelistitemproduct(item)"
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

                        <v-row class="ma-2">
                          <v-spacer></v-spacer>
                          <v-btn
                            class="mr-1"
                            color="red"
                            elevation="1"
                            @click="close"
                            outlined
                          >
                            <v-icon left> mdi-close-circle-outline </v-icon>
                            Cancel
                          </v-btn>
                          <v-btn
                            elevation="1"
                            outlined
                            color="primary"
                            @click="e1 = 3"
                          >
                            <v-icon left>
                              mdi-chevron-right-circle-outline
                            </v-icon>
                            Next
                          </v-btn>
                        </v-row>
                      </v-stepper-content>

                      <v-stepper-content class="pa-3" step="3">
                        <v-container class="mb-2">
                          <v-row>
                            <v-col cols="12" sm="4" md="4" class="pa-1">
                              <v-file-input
                                accept="image/png, image/jpeg, image/bmp"
                                placeholder="Pilih Foto"
                                prepend-icon="mdi-camera"
                                show-size
                                label="Gambar Signature"
                                outlined
                                v-model="gambarinput1"
                                v-on:change="pilihgambar1"
                              ></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="4" md="4" class="pa-1">
                              <v-file-input
                                accept="image/png, image/jpeg, image/bmp"
                                placeholder="Pilih Foto"
                                prepend-icon="mdi-camera"
                                show-size
                                label="Pilih Gambar1"
                                outlined
                                v-model="gambarinput2"
                                v-on:change="pilihgambar2"
                              ></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="4" md="4" class="pa-1">
                              <v-file-input
                                accept="image/png, image/jpeg, image/bmp"
                                placeholder="Pilih Foto"
                                prepend-icon="mdi-camera"
                                show-size
                                label="Pilih Gambar2"
                                outlined
                                v-model="gambarinput3"
                                v-on:change="pilihgambar3"
                              ></v-file-input>
                            </v-col>
                            <v-container>
                              <v-row>
                                <v-col cols="4" md="4">
                                  <!-- <div>Foto SPPT/ Dokument</div> -->
                                  <v-card
                                    class="d-flex align-center"
                                    elevation="2"
                                    height="250"
                                    width="250"
                                  >
                                    <v-img
                                      v-bind:src="defaultItem.gambarshow1"
                                      class="my-2 mb-4"
                                      contain
                                      max-height="225"
                                    ></v-img>
                                  </v-card>
                                </v-col>
                                <v-col cols="4" md="4">
                                  <!-- <div>Foto SPPT/ Dokument</div> -->
                                  <v-card
                                    class="d-flex align-center"
                                    elevation="2"
                                    height="250"
                                    width="250"
                                  >
                                    <v-img
                                      v-bind:src="defaultItem.gambarshow2"
                                      class="my-2 mb-4"
                                      max-height="225"
                                      contain
                                    ></v-img>
                                  </v-card>
                                </v-col>
                                <v-col cols="4" md="4">
                                  <!-- <div>Foto SPPT/ Dokument</div> -->
                                  <v-card
                                    class="d-flex align-center"
                                    elevation="2"
                                    height="250"
                                    width="250"
                                  >
                                    <v-img
                                      v-bind:src="defaultItem.gambarshow3"
                                      class="my-2 mb-4"
                                      max-height="225"
                                      contain
                                    ></v-img>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-row>
                        </v-container>
                        <v-row class="ma-2">
                          <v-spacer> </v-spacer>
                          <v-btn
                            class="mr-1"
                            color="red"
                            elevation="1"
                            @click="close"
                            outlined
                          >
                            <v-icon left> mdi-close-circle-outline </v-icon>
                            Cancel
                          </v-btn>
                          <v-btn
                            color="success"
                            elevation="1"
                            outlined
                            @click="save"
                          >
                            <v-progress-circular
                              v-if="loadsave == true"
                              :size="25"
                              :width="5"
                              indeterminate
                              color="green"
                            >
                            </v-progress-circular>
                            <v-icon v-if="loadsave == false" left>
                              mdi-checkbox-marked-circle-outline
                            </v-icon>
                            <h4 v-if="loadsave == false">Save</h4>
                          </v-btn>
                        </v-row>
                      </v-stepper-content>
                    </v-stepper-items>
                  </v-stepper>
                </v-card-text>

                <!-- <v-card-actions v-if="load == false">
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" outlined @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" outlined @click="save">
                    Save
                  </v-btn>
                </v-card-actions> -->
              </v-form>
            </v-card>
          </v-dialog>

          <v-dialog
            style="z-index: 20001"
            v-model="dialogAddonly"
            max-width="800px"
          >
            <v-card>
              <v-card-title class="mb-1 headermodalstyle">
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text class="pa-0 fontall">
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
                <v-stepper v-if="load == false" v-model="e1">
                  <v-stepper-header>
                    <v-stepper-step editable :complete="e1 > 1" step="1">
                      Main Data
                    </v-stepper-step>
                    <v-divider></v-divider>
                    <v-divider></v-divider>
                    <v-stepper-step editable step="2"> Foto </v-stepper-step>
                  </v-stepper-header>

                  <v-stepper-items>
                    <v-stepper-content class="pa-3" step="1">
                      <v-container class="mb-2">
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-select
                              v-model="defaultItem.user_id"
                              :items="itemsff"
                              item-text="name"
                              item-value="ff_no"
                              label="Pilih Field Facilitator"
                              outlined
                              clearable
                              type="string"
                              v-on:change="selectPetani"
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="defaultItem.farmer_no"
                              :items="itemspetani"
                              item-text="nama"
                              item-value="kode"
                              label="Pilih Petani"
                              outlined
                              clearable
                              type="string"
                              v-on:change="selectLahan"
                            ></v-select>
                          </v-col>

                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="defaultItem.lahan_no"
                              :items="itemslahan"
                              item-text="lahan_no"
                              item-value="lahan_no"
                              label="Pilih No Lahan"
                              outlined
                              clearable
                              type="string"
                              v-on:change="selectedLahanNo"
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="defaultItem.lahan_condition"
                              label="Kondisi Lahan"
                              outlined
                              required
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-text-field>
                            <!-- <v-select
                              v-model="defaultItem.lahan_condition"
                              :items="itemslahancondition"
                              item-text="text"
                              item-value="value"
                              label="Pilih Lahan Condition"
                              outlined
                              clearable
                              type="string"
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-select> -->
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <div
                              style="
                                border-style: solid;
                                padding: 3px;
                                border-color: red;
                              "
                            >
                              <h4>Jarak Lahan : {{ jarak_lahan }}</h4>
                              <h4>Akses Jangkauan : {{ akses_jangkauan }}</h4>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="defaultItem.planting_year"
                              :items="itemsTahun"
                              item-text="text"
                              item-value="value"
                              label="Planting Year"
                              outlined
                              clearable
                              type="string"
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-menu
                              v-model="menu1"
                              transition="scale-transition"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="datepicker1"
                                  slot="activator"
                                  label="Planting Date"
                                  outlined
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  :rules="[(v) => !!v || 'Field is required']"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="datepicker1"
                                @input="menu1 = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                        <!-- <v-row class="mb-3">
                          <h4>Pilih Pohon</h4>
                          <v-divider class="mx-2 mt-3"></v-divider>
                        </v-row>
                        <v-row>
                          <v-col class="px-1 py-0" cols="12" sm="12" md="12">
                            <v-combobox
                              :items="itemstrees"
                              item-value="tree_code"
                              item-text="tree_name"
                              label="Pilih Pohon"
                              v-on:change="changeBarangSelected"
                              outlined
                              clearable
                            ></v-combobox>
                          </v-col>
                        </v-row> -->
                        <v-row class="mb-3">
                          <h4>Detail Penilikan</h4>
                          <v-divider class="mx-2 mt-3"></v-divider>
                          <v-btn @click="adddetailpohon">Add</v-btn>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-data-table
                              :headers="headerslistpohon"
                              :items="itemlistpohon"
                              sort-by="calories"
                              class="elevation-1"
                            >
                              <template v-slot:item.actions="{ item }">
                                <v-icon small @click="deleteItemPohon(item)">
                                  mdi-delete
                                </v-icon>
                              </template>
                            </v-data-table>
                          </v-col>
                        </v-row>
                      </v-container>

                      <v-row class="ma-2">
                        <v-spacer></v-spacer>
                        <v-btn
                          class="mr-1"
                          color="red"
                          elevation="1"
                          @click="close"
                          outlined
                        >
                          <v-icon left> mdi-close-circle-outline </v-icon>
                          Cancel
                        </v-btn>
                        <v-btn
                          elevation="1"
                          outlined
                          color="primary"
                          @click="e1 = 2"
                        >
                          <v-icon left>
                            mdi-chevron-right-circle-outline
                          </v-icon>
                          Next
                        </v-btn>
                      </v-row>
                    </v-stepper-content>

                    <v-stepper-content class="pa-3" step="2">
                      <v-container class="mb-2">
                        <v-row>
                          <v-col cols="12" sm="4" md="4" class="pa-1">
                            <v-file-input
                              accept="image/png, image/jpeg, image/bmp"
                              placeholder="Pilih Foto"
                              prepend-icon="mdi-camera"
                              show-size
                              label="Gambar Signature"
                              outlined
                              v-model="gambarinput1"
                              v-on:change="pilihgambar1"
                            ></v-file-input>
                          </v-col>
                          <v-col cols="12" sm="4" md="4" class="pa-1">
                            <v-file-input
                              accept="image/png, image/jpeg, image/bmp"
                              placeholder="Pilih Foto"
                              prepend-icon="mdi-camera"
                              show-size
                              label="Pilih Gambar1"
                              outlined
                              v-model="gambarinput2"
                              v-on:change="pilihgambar2"
                            ></v-file-input>
                          </v-col>
                          <v-col cols="12" sm="4" md="4" class="pa-1">
                            <v-file-input
                              accept="image/png, image/jpeg, image/bmp"
                              placeholder="Pilih Foto"
                              prepend-icon="mdi-camera"
                              show-size
                              label="Pilih Gambar2"
                              outlined
                              v-model="gambarinput3"
                              v-on:change="pilihgambar3"
                            ></v-file-input>
                          </v-col>
                          <v-container>
                            <v-row>
                              <v-col cols="4" md="4">
                                <!-- <div>Foto SPPT/ Dokument</div> -->
                                <v-card
                                  class="d-flex align-center"
                                  elevation="2"
                                  height="250"
                                  width="250"
                                >
                                  <v-img
                                    v-bind:src="defaultItem.gambarshow1"
                                    class="my-2 mb-4"
                                    contain
                                    max-height="225"
                                  ></v-img>
                                </v-card>
                              </v-col>
                              <v-col cols="4" md="4">
                                <!-- <div>Foto SPPT/ Dokument</div> -->
                                <v-card
                                  class="d-flex align-center"
                                  elevation="2"
                                  height="250"
                                  width="250"
                                >
                                  <v-img
                                    v-bind:src="defaultItem.gambarshow2"
                                    class="my-2 mb-4"
                                    max-height="225"
                                    contain
                                  ></v-img>
                                </v-card>
                              </v-col>
                              <v-col cols="4" md="4">
                                <!-- <div>Foto SPPT/ Dokument</div> -->
                                <v-card
                                  class="d-flex align-center"
                                  elevation="2"
                                  height="250"
                                  width="250"
                                >
                                  <v-img
                                    v-bind:src="defaultItem.gambarshow3"
                                    class="my-2 mb-4"
                                    max-height="225"
                                    contain
                                  ></v-img>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-row>
                      </v-container>
                      <v-row class="ma-2">
                        <v-spacer> </v-spacer>
                        <v-btn
                          class="mr-1"
                          color="red"
                          elevation="1"
                          @click="close"
                          outlined
                        >
                          <v-icon left> mdi-close-circle-outline </v-icon>
                          Cancel
                        </v-btn>
                        <v-btn
                          color="success"
                          elevation="1"
                          outlined
                          @click="save"
                        >
                          <v-progress-circular
                            v-if="loadsave == true"
                            :size="25"
                            :width="5"
                            indeterminate
                            color="green"
                          >
                          </v-progress-circular>
                          <v-icon v-if="loadsave == false" left>
                            mdi-checkbox-marked-circle-outline
                          </v-icon>
                          <h4 v-if="loadsave == false">Save</h4>
                        </v-btn>
                      </v-row>
                    </v-stepper-content>
                  </v-stepper-items>
                </v-stepper>
              </v-card-text>

              <!-- <v-card-actions v-if="load == false">
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" outlined @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" outlined @click="save">
                    Save
                  </v-btn>
                </v-card-actions> -->
            </v-card>
          </v-dialog>

          <v-dialog
            style="z-index: 20001"
            v-model="dialogPohon"
            max-width="500px"
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">Daftar Pohon</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-combobox
                        v-model="tree_temp"
                        :items="itemstrees"
                        item-text="tree_name"
                        item-value="tree_code"
                        label="Pilih Pohon"
                        outlined
                        clearable
                        type="string"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItemPohon.qty"
                        label="Jumlah"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu v-model="menu4" transition="scale-transition">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="datepicker4"
                            slot="activator"
                            label="Planting Date"
                            v-bind="attrs"
                            v-on="on"
                            outlined
                            :rules="[(v) => !!v || 'Field is required']"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="datepicker4"
                          @input="menu4 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItemPohon.status"
                        :items="itemsstatustrees"
                        item-text="text"
                        item-value="value"
                        label="Pilih Status"
                        outlined
                        clearable
                        type="string"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItemPohon.condition"
                        :items="itemscoditiontrees"
                        item-text="text"
                        item-value="value"
                        label="Pilih Kondisi"
                        outlined
                        clearable
                        type="string"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closePohonTambah">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="savePohon">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog
            style="z-index: 20001"
            v-model="dialogDeletePohon"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDeletePohon"
                  >Cancel</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  @click="deleteItemConfirmPohon"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Modal Add Product -->
          <v-dialog
            style="z-index: 20001"
            v-model="dialogAddProduct"
            max-width="500px"
          >
            <v-card>
              <v-card-text class="pa-1 fontall">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-combobox
                        v-model="trees_add_temp"
                        :items="itemstrees"
                        item-text="tree_name"
                        item-value="tree_code"
                        label="Pilih Pohon"
                        outlined
                        clearable
                        type="string"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-combobox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="pb-1" cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="jumlah_temp"
                        label="Jumlah"
                        outlined
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col class="pb-1" cols="12" sm="6" md="6">
                      <v-menu v-model="menu2" transition="scale-transition">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="datepicker2"
                            slot="activator"
                            label="Planting Date"
                            outlined
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="[(v) => !!v || 'Field is required']"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="datepicker2"
                          @input="menu2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="status_temp"
                        :items="itemsstatustrees"
                        item-text="text"
                        item-value="value"
                        label="Pilih Status"
                        outlined
                        clearable
                        type="string"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="condition_temp"
                        :items="itemscoditiontrees"
                        item-text="text"
                        item-value="value"
                        label="Pilih Kondisi"
                        outlined
                        clearable
                        type="string"
                        :rules="[(v) => !!v || 'Field is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red"
                  elevation="1"
                  outlined
                  @click="canceladdproduk"
                >
                  <v-icon left> mdi-close-circle-outline </v-icon>
                  Cancel
                </v-btn>
                <v-btn
                  color="success"
                  elevation="1"
                  outlined
                  @click="addProduct"
                >
                  <v-icon left> mdi-plus-circle-outline </v-icon>
                  Add
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog
            style="z-index: 20001"
            v-model="dialogShowEdit"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="headline"
                >What you want to edit?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined color="blue" text @click="showEditModal"
                  >Edit Sosialisasi</v-btn
                >
                <v-btn
                  outlined
                  color="green"
                  text
                  @click="showEditJumlahPohonModal"
                  >Jumlah Pohon</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog
            style="z-index: 20001"
            v-model="dialogDetailPohon"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="headline"
                ><span class="headline">Detail Pohon Lahan</span></v-card-title
              >
              <v-card-text>
                <v-row class="mt-3">
                  <v-col cols="12" sm="12" md="12">
                    <div>
                      <h3 class="ml-1">
                        <v-data-table
                          :headers="headersdetaileditjumlah"
                          :items="DetailTreesLahanTemp"
                          class="elevation-1"
                        >
                          <!-- <template v-slot:item.tree_category="{ item }">
                            {{ gettype(item.tree_category) }}
                          </template> -->
                          <template v-slot:item.actions="{ item }">
                            <v-icon
                              v-if="RoleAccesCRUDShow == true"
                              class="mr-3"
                              @click="editDetailPohon(item)"
                              small
                              color="warning"
                            >
                              mdi-pencil
                            </v-icon>
                            <v-icon
                              v-if="RoleAccesCRUDShow == true"
                              @click="deleteDetailPohon(item)"
                              small
                              color="red"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                        </v-data-table>
                      </h3>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined color="red" text @click="closeDetailPohon"
                  >Cancel</v-btn
                >
                <v-btn outlined color="blue" text @click="saveEditPohon"
                  >Save</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog
            style="z-index: 20001"
            v-model="dialogDetailPohonEdit"
            max-width="300px"
          >
            <v-card>
              <v-card-text>
                <v-row class="mt-7">
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItemPohon.amount"
                      label="Jumlah Pohon"
                      outlined
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined color="red" text @click="closeDetailEditPohon"
                  >Cancel</v-btn
                >
                <v-btn outlined color="blue" text @click="saveEditPohonTemp"
                  >Save</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Modal Detail -->
          <v-dialog
            style="z-index: 20001"
            v-model="dialogDetail"
            max-width="800px"
          >
            <v-card>
              <v-card-title class="mb-1 headermodalstyle">
                <span class="headline">Detail Sosialisasi Tanam</span>
              </v-card-title>
              <v-divider></v-divider>
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
                    <v-col cols="12" sm="4" md="4">
                      <div>Foto Foto</div>
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.gambarshow1"
                        class="my-1 mb-4"
                      ></v-img>
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.gambarshow2"
                        class="my-1 mb-4"
                      ></v-img>
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.gambarshow3"
                        class="my-1 mb-4"
                      ></v-img>
                    </v-col>
                    <v-col cols="12" sm="8" md="8">
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
                              <th class="text-left" style="font-size: 14px">
                                {{ defaultItem.nama_petani }}
                              </th>
                            </tr>
                            <tr>
                              <th class="text-left" style="font-size: 14px">
                                Nama FF
                              </th>
                              <th class="text-left" style="font-size: 14px">
                                {{ defaultItem.nama_ff }}
                              </th>
                            </tr>
                            <tr>
                              <th class="text-left" style="font-size: 14px">
                                No Lahan
                              </th>
                              <th class="text-left" style="font-size: 14px">
                                {{ defaultItem.lahan_no }}
                              </th>
                            </tr>
                            <tr>
                              <th class="text-left" style="font-size: 14px">
                                Kondisi Lahan
                              </th>
                              <th class="text-left" style="font-size: 14px">
                                {{ defaultItem.lahan_condition }}
                              </th>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>

                      <v-divider
                        style="background-color: black !important"
                      ></v-divider>
                      <div>
                        <h4 class="mt-3">Jenis dan Jumlah Bibit</h4>
                        <h3 class="ml-1">
                          <v-data-table
                            :headers="headersdetail"
                            :items="defaultItem.list_detail"
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
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions v-if="defaultItem.waitingapproval == true">
                <v-spacer></v-spacer>
                <v-btn
                  v-if="RoleAccesCRUDShow == true"
                  color="green"
                  text
                  @click="verifSubmit()"
                  outlined
                  elevation="1"
                >
                  Verifikasi
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog
            style="z-index: 20001"
            v-model="dialogCetakPilihan"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="headline"
                >What you want to print?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined color="blue" text @click="showPrintLabel()"
                  >Print Label</v-btn
                >
                <v-btn
                  outlined
                  color="green"
                  text
                  @click="showPrintTandaTerima()"
                  >Tanda Terima</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Modal Verification -->
          <v-dialog
            style="z-index: 20001"
            v-model="dialogVerification"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to Verification?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeVerification"
                  >Cancel</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  @click="VerificationItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Modal Delete -->
          <v-dialog
            style="z-index: 20001"
            v-model="dialogDelete"
            max-width="500px"
          >
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

      <!-- Action table -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="showDetail(item)" small color="info">
          mdi-information-outline
        </v-icon>
        <v-icon
          v-if="RoleAccesCRUDShow == true"
          class="mr-2"
          @click="showEditModal(item)"
          small
          color="warning"
        >
          mdi-pencil
        </v-icon>
        <!-- <v-icon
          v-if="RoleAccesPrintLabelShow == true"
          class="mr-2"
          @click="showPrintModal(item)"
          small
          color="green"
        >
          mdi-printer
        </v-icon> -->
        <v-icon
          v-if="RoleAccesCRUDShow == true"
          @click="showDeleteModal(item)"
          small
          color="red"
        >
          mdi-delete
        </v-icon>
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
// import ModalFarmer from "./ModalFarmer";
import axios from "axios";
// import BaseUrl from "../../services/BaseUrl.js";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";

export default {
  name: "Monitoring2",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  authtoken: "",
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 9,
    center: [-7.0667, 110.41667],
    markerLatLng: [-7.0667, 110.41667],

    listMarker: [
      {
        lahan_no: "Sol",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0667,
        latitude: 110.41667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0767,
        latitude: 110.45667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0787,
        latitude: 110.55667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0887,
        latitude: 110.65667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0967,
        latitude: 110.75667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0167,
        latitude: 110.85667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0267,
        latitude: 110.95667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0467,
        latitude: 110.15667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0567,
        latitude: 110.25667,
      },
      {
        lahan_no: "Mizar",
        nama_petani: "Sol",
        planting_area: "1000",
        longitude: -7.0667,
        latitude: 110.35667,
      },
    ],

    // latitude: "-7.0667"
    // longitude: "110.41667"

    alerttoken: false,
    datepicker1: new Date().toISOString().substr(0, 10),
    datepicker2: new Date().toISOString().substr(0, 10),
    datepicker3: new Date().toISOString().substr(0, 10),
    elevations: [6, 12, 18],
    itemsbr: [
      {
        text: "Activities",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Monitoring 2",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    e1: 1,
    stepperdone: false,
    User: [],
    datepicker: new Date().toISOString().substr(0, 10),
    datepicker4: new Date().toISOString().substr(0, 10),
    menu1: "",
    menu2: "",
    menu3: "",
    menu4: "",
    dialogAddonly: false,
    dialog: false,
    dialogDelete: false,
    dialogDetail: false,
    dialogFilterArea: false,
    dialogFilterEmp: false,
    dialogShowEdit: false,
    dialogDetailPohon: false,
    dialogDetailPohonEdit: false,
    dialogAddProduct: false,
    dialogCetakPilihan: false,
    dialogdownload: false,
    loadtable: false,
    loadtabledetail: false,
    load: false,
    loadsave: false,
    downloadvalueff: false,
    downloadvaluepetani: false,
    downloadvaluetime: false,
    loaddownload: false,
    formTitle: "Add Item",
    value: "add",
    search: "",
    type: "",
    headers: [
      { text: "Nama Petani", value: "nama_petani", width: "18%" },
      {
        text: "No Lahan",
        align: "start",
        value: "lahan_no",
        width: "10%",
      },
      { text: "Tahun Tanam", value: "planting_year", width: "15%" },
      { text: "Kondisi Lahan", value: "lahan_condition", width: "15%" },
      { text: "Field Facilitator", value: "nama_ff", width: "15%" },
      { text: "Status", value: "status", width: "13%" },
      { text: "Actions", value: "actions", sortable: false, width: "20%" },
    ],

    headersdetail: [
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Jumlah", value: "qty", width: "15%" },
      { text: "Kondisi", value: "condition", width: "15%" },
      { text: "Status", value: "status", width: "15%" },
    ],
    headersdetaileditjumlah: [
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Kategori", value: "tree_category", width: "20%" },
      { text: "Jumlah", value: "amount", width: "15%" },
      { text: "Actions", value: "actions", sortable: false, width: "15%" },
    ],
    headerListProduct: [
      { text: "Nama Pohon", value: "tree_name", width: "35%" },
      { text: "Jumlah", value: "qty", width: "15%" },
      { text: "Status", value: "status", width: "15%" },
      { text: "Kondisi", value: "condition", width: "15%" },
      { text: "planting_date", value: "planting_date", width: "25%" },
      { text: "Actions", value: "actions", sortable: false, width: "10%" },
    ],
    DetailTreesLahanTemp: [],
    dataobject: [],
    editedItem: {
      name: "",
    },
    defaultItem: {
      id: "",
      monitoring_no: "",
      farmer_no: "",
      farmer_no: "",
      lahan_no: "",
      lahan_condition: "",
      planting_year: "2021",
      planting_date: "",
      gambar1: "",
      gambar2: "",
      gambar3: "",
      qty_kayu: "",
      qty_mpts: "",
      qty_crops: "",
      validate_by: "",
      validate_name: "",
      is_validate: "",
      user_id: "",
      nama_ff: "",
      user_id: "FF000001",
      nama_petani: "",
      waitingapproval: false,

      gambarshow1: "",
      gambarshow2: "",
      gambarshow3: "",
      fileUpload_files: "",
      fileUploadReady_files: false,
      fileUpload1: "",
      fileUploadReady_gambar1: false,
      fileUpload2: "",
      fileUploadReady_gambar2: false,
      fileUpload3: "",
      fileUploadReady_gambar3: false,
      list_detail: [],
    },
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
    itemsstatustrees: [
      { text: "Sudah Ditanam", value: "sudah_ditanam" },
      { text: "Belum Ditanam", value: "belum_ditanam" },
    ],
    itemscoditiontrees: [
      { text: "Hidup", value: "hidup" },
      { text: "Sakit", value: "sakit" },
      { text: "Mati", value: "mati" },
      { text: "Hilang", value: "hilang" },
    ],
    // itemsdownload: [
    //   { text: "Output All Data", value: "output_data" },
    //   { text: "Loading Plan", value: "loading_plan" },
    //   { text: "Packing Plan", value: "packing_plan" },
    //   { text: "Shipping Plan", value: "shipping_plan" },
    //   { text: "Farmer Receipt", value: "farmer_receipt" },
    // ],

    itemslahan: [],
    itemsum: [],
    itemsfc: [],
    itemsff: [],
    itemspetani: [],
    itemsethnic: [],
    itemsjob: [],
    itemstrees: [],
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

    itemspetanidownload: "",
    itemsdistribusidownload: "",
    selectFFdownload: "",
    selectpetanidownload: "",
    selectdistribusitimedownload: "",

    gambarinput1: "",
    gambarinput2: "",
    gambarinput3: "",

    filephotoarray: [],

    valid: true,
    BaseUrlUpload: "",
    BaseUrl: "",
    RoleAccesFilterShow: true,
    RoleAccesDownloadAllShow: true,
    RoleAccesCRUDShow: true,
    RoleAccesPrintLabelShow: true,
    RoleAccesIT: false,

    valuedownloadselected: "",
    valueMUExcel: "",
    valueTAExcel: "",
    valueVillageExcel: "",
    typegetdataExcel: "",
    valueFFcodeExcel: "",

    valuePetaniselected: "",
    valueLahanselected: "",

    trees_add_temp: "",
    tree_code_temp: "",
    tree_name_temp: "",
    tree_category_temp: "",
    jumlah_temp: "",
    planting_date_temp: "",
    status_temp: "",
    condition_temp: "",
    max_value_pohon_temp: 0,

    jarak_lahan: "",
    akses_jangkauan: "",

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,

    employee_no: "",
    itemTemp: "",

    max_kayu: 15,
    max_mpts: 6,
    max_crops: 5,

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

    headerListProduct: [
      { text: "Nama Pohon", value: "tree_name", width: "35%" },
      { text: "Jumlah", value: "qty", width: "15%" },
      { text: "Status", value: "status", width: "15%" },
      { text: "Kondisi", value: "condition", width: "15%" },
      { text: "planting_date", value: "planting_date", width: "25%" },
      { text: "Actions", value: "actions", sortable: false, width: "10%" },
    ],

    itemlistpohon: [],
    dialogPohon: false,
    dialogDeletePohon: false,
    headerslistpohon: [
      {
        text: "Nama Pohon",
        align: "start",
        sortable: false,
        value: "tree_name",
      },
      { text: "Jummlah", value: "qty" },
      { text: "Status", value: "status" },
      { text: "Kondisi", value: "condition" },
      { text: "Planting Date", value: "planting_date" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    // itemlistanak: [],
    editedIndexPohon: -1,
    editedItemPohon: {
      tree_code: "",
      tree_name: "",
      qty: 0,
      status: "-",
      condition: "-",
      planting_date: "-",
    },
    defaultItemPohon: {
      tree_code: "",
      tree_name: "",
      qty: 0,
      status: "-",
      condition: "-",
      planting_date: "-",
    },
    tree_temp: "",

    ph_form_no_temp: "",
  }),
  computed: {
    // formTitle() {
    //   return this.editedIndex === -1 ? "New Item" : "Edit Item";
    // },
  },

  async mounted() {
    await this.firstAccessPage();

    // const taskForceEmails = this.$store.state.taskForceTeam.emails || []

    if (this.User.role_group != 'IT') {
      this.$store.state.maintenanceOverlay = true
    }
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false

    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },

  methods: {
    firstAccessPage() {
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data == '-' ? 'all' : this.User.ff.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.BaseUrl = localStorage.getItem("BaseUrl");
      this.employee_no = this.User.employee_no;
      // this.fc_no_global = this.User.fc.fc;
      this.checkRoleAccess();
      this.initialize();
      this.getMU();
      //   this.getEthnic();
      //   this.getJob();
      this.getFF();
      this.getUMAll();
      this.getTrees();
      this.BaseUrlUpload = localStorage.getItem("BaseUrlUpload");
    },
    checkRoleAccess() {
      if (this.User.role_group == "IT") {
        this.RoleAccesCRUDShow = true;
        this.RoleAccesFilterShow = true;
        this.RoleAccesDownloadAllShow = true;
        this.RoleAccesPrintLabelShow = true;
        this.RoleAccesIT = true;
      } else if (this.User.role_group == "FIELD") {
        if (this.User.role == "19") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesDownloadAllShow = false;
          this.RoleAccesPrintLabelShow = false;
          this.RoleAccesIT = false;
        } else if (this.User.role == "20") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesDownloadAllShow = true;
          this.RoleAccesPrintLabelShow = true;
          this.RoleAccesIT = false;
        } else if (this.User.role == "14") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = true;
          this.RoleAccesDownloadAllShow = true;
          this.RoleAccesPrintLabelShow = false;
          this.RoleAccesIT = false;
        } else {
          this.RoleAccesCRUDShow = false;
          this.RoleAccesFilterShow = true;
          this.RoleAccesDownloadAllShow = true;
          this.RoleAccesPrintLabelShow = true;
          this.RoleAccesIT = false;
        }
      } else {
        if (this.User.role == "19" || this.User.role == "20") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.RoleAccesPrintLabelShow = false;
          this.RoleAccesIT = false;
        } else {
          this.RoleAccesCRUDShow = false;
          this.RoleAccesFilterShow = true;
          this.RoleAccesPrintLabelShow = false;
          this.RoleAccesIT = false;
        }
      }
    },
    getColorStatus(status) {
      if (status == "Belum Verifikasi") return "red";
      else return "green";
    },

    LatLng(lat, lng) {
      const array = [parseFloat(lat), parseFloat(lng)];
      //   console.log(array);
      //   console.log(this.markerLatLng);
      return array;
    },
    async initialize() {
      this.loadtable = true;
      // console.log(this.User.ff.ff);
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetMonitoring2Admin?mu=" +
            this.valueMU +
            "&ta=" +
            this.valueTA +
            "&village=" +
            this.valueVillage +
            "&typegetdata=" +
            this.typegetdata +
            "&ff=" +
            this.valueFFcode,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result.data);
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result.data;
          //   console.log(this.listMarker);
          let tenData = response.data.data.result.data.slice(0, 10);
          this.listMarker = tenData;
          console.log(tenData[0].latitude);
          console.log(tenData[0].longitude);
          const arrayCenter = [
            parseFloat(tenData[0].latitude),
            parseFloat(tenData[0].longitude),
          ];
          //   console.log(this.center);
          this.center = arrayCenter;
          //   console.log(this.center);
          this.valueMUExcel = this.valueMU;
          this.valueTAExcel = this.valueTA;
          this.valueVillageExcel = this.valueVillage;
          this.typegetdataExcel = this.typegetdata;
          this.valueFFcodeExcel = this.valueFFcode;
          this.loadtable = false;
        } else {
          this.dataobject = [];
          this.loadtable = false;
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
          this.loadtable = false;
        } else {
          this.dataobject = [];
          this.loadtable = false;
        }
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
        // console.log(response.data.data.result);
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
        // console.log(response.data.data.result);
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
    async getTrees() {
      try {
        const response = await axios.get(this.BaseUrlGet + "GetTreesAll", {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemstrees = response.data.data.result.data;
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
          this.loaddownload = false;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
          this.loaddownload = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
        this.loaddownload = false;
      }
    },
    async getDetail(item) {
      this.load = true;
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetMonitoring2Detail?monitoring_no=" +
            item.monitoring_no,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.defaultItem = Object.assign({}, response.data.data.result.data);
          this.defaultItem.list_detail = response.data.data.result.list_detail;
          this.itemlistpohon = response.data.data.result.list_detail;
          this.max_value_pohon_temp =
            response.data.data.result.count_list_pohon;
          this.defaultItem.waitingapproval = this.waitingapprovefunct(
            response.data.data.result.data.is_validate
          );

          if (response.data.data.result.data.gambar1 == "-") {
            this.defaultItem.gambarshow1 = "/images/noimage.png";
          } else {
            this.defaultItem.gambarshow1 =
              this.BaseUrl + response.data.data.result.data.gambar1;
          }
          console.log(this.defaultItem.gambarshow1);
          if (response.data.data.result.data.gambar2 == "-") {
            this.defaultItem.gambarshow2 = "/images/noimage.png";
          } else {
            this.defaultItem.gambarshow2 =
              this.BaseUrl + response.data.data.result.data.gambar2;
          }
          if (response.data.data.result.data.gambar3 == "-") {
            this.defaultItem.gambarshow3 = "/images/noimage.png";
          } else {
            this.defaultItem.gambarshow3 =
              this.BaseUrl + response.data.data.result.data.gambar3;
          }

          this.load = false;

          if (this.type == "Detail") {
            this.load = false;
          } else {
            this.selectPetani(response.data.data.result.data.user_id);
            this.defaultItem.farmer_no =
              response.data.data.result.data.farmer_no;
            this.selectLahan(response.data.data.result.data.farmer_no);
            this.defaultItem.lahan_no = response.data.data.result.data.lahan_no;
            this.selectedLahanNo(response.data.data.result.data.lahan_no);
            this.datepicker1 = response.data.data.result.data.planting_date;
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
        monitoring_no: this.defaultItem.monitoring_no,
        validate_by: this.employee_no,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "ValidateMonitoring2",
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
        monitoring_no: this.defaultItem.monitoring_no,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "SoftDeleteMonitoring2",
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
        user_id: this.defaultItem.user_id,
        lahan_no: this.defaultItem.lahan_no,
        farmer_no: this.defaultItem.farmer_no,
        planting_date: this.datepicker1,
        planting_year: this.defaultItem.planting_year,
        lahan_condition: this.defaultItem.lahan_condition,
        gambar1: this.defaultItem.gambar1,
        gambar2: this.defaultItem.gambar2,
        gambar3: this.defaultItem.gambar3,
        list_pohon: this.itemlistpohon,
      };
      console.log(datapost);
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddMonitoring2",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.loadsave = false;
          this.dialogAddonly = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses menambahkan data";
          this.initialize();
        } else {
          this.dialogAddonly = true;
          this.loadsave = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialogAddonly = true;
          this.loadsave = false;
        }
        this.loadsave = false;
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Gagal menambahkan data, no lahan sudah ada";
      }
    },

    async updateData() {
      const datapost = {
        monitoring_no: this.defaultItem.monitoring_no,
        user_id: this.defaultItem.user_id,
        lahan_no: this.defaultItem.lahan_no,
        farmer_no: this.defaultItem.farmer_no,
        planting_date: this.datepicker1,
        planting_year: this.defaultItem.planting_year,
        lahan_condition: this.defaultItem.lahan_condition,
        gambar1: this.defaultItem.gambar1,
        gambar2: this.defaultItem.gambar2,
        gambar3: this.defaultItem.gambar3,
        list_pohon: this.itemlistpohon,
      };
      console.log(datapost);
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateMonitoring2",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.loadsave = false;
          this.dialogAddonly = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.initialize();
        } else {
          this.dialogAddonly = true;
          this.loadsave = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialogAddonly = true;
          this.loadsave = false;
        }
        this.loadsave = false;
      }
    },
    async updateDataPohon(datapost) {
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdatePohonMonitoring2",
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
    async getLahan() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetLahanAll?farmer_no=" +
            this.valuePetaniselected +
            "&user_id=" +
            this.valueFFForm,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemslahan = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          this.itemslahan = [];
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
        this.itemslahan = [];
        this.defaultItem.farmer_no = "";
      }
    },
    async getLahanDetail() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetLahanDetailLahanNo?lahan_no=" +
            this.valueLahanselected,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.jarak_lahan = response.data.data.result.jarak_lahan;
          this.akses_jangkauan = response.data.data.result.access_to_lahan;
          //   this.itemslahan = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          this.itemslahan = [];
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
        this.itemslahan = [];
        this.defaultItem.farmer_no = "";
      }
    },
    async UploadData(val, type) {
      console.log(this.BaseUrlUpload);
      var dateConvert = Date.now();

      const formData = new FormData();
      formData.append("files", val);
      var namafile = "PH_" + dateConvert;

      // console.log(namafile);
      try {
        const response = await axios.post(
          this.BaseUrlUpload + "?nama=" + namafile,
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
          this.resultUpload = true;
          if (type == "farmer_signature") {
            this.defaultItem.farmer_signature = response.data.TempName;
          }
          if (type == "gambar1") {
            this.defaultItem.gambar1 = response.data.TempName;
          }
          if (type == "gambar2") {
            this.defaultItem.gambar2 = response.data.TempName;
          }
          if (type == "gambar3") {
            this.defaultItem.gambar3 = response.data.TempName;
          }
        } else {
          this.resultUpload = false;
          // this.dialog = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.resultUpload = false;
          localStorage.removeItem("token");
          this.$router.push("/");
          // this.dialog = false;
        } else {
          this.resultUpload = false;
        }
      }
    },

    changeBarangSelected(val) {
      console.log(val);
      this.tree_code_temp = val.tree_code;
      this.tree_name_temp = val.tree_name;
      this.tree_category_temp = val.tree_category;
      //   this.satuan_temp = val.satuan;
      this.dialogAddProduct = true;
    },
    adddetailpohon() {
      this.dialogPohon = true;
    },
    async addProduct() {
      if (this.jumlah_temp > 0) {
        var newlist = [];
        var list = this.defaultItem.list_detail;
        // this.loadtabledetail = true;

        console.log(list);
        console.log(list.length);

        // for (let n = 0; n < list.length; n++) {
        //   var productold = {
        //     tree_code: "",
        //     tree_name: "",
        //     qty: 0,
        //     id: 0,
        //     status: "",

        //     condition: "",
        //     planting_date: "",
        //   };

        //   productold.tree_code = list[n].tree_code;
        //   productold.tree_name = list[n].tree_name;
        //   productold.status = list[n].status;
        //   productold.condition = list[n].condition;
        //   productold.planting_date = list[n].planting_date;
        //   productold.qty = list[n].qty;

        //   newlist.push(productold);
        // }

        var productset = {
          tree_code: "",
          tree_name: "",
          qty: 0,
          id: 0,
          //   ph_form_no: "",
          status: "",
          condition: "",
          planting_date: "",
        };

        productset.id = this.max_value_pohon_temp + 1;
        productset.tree_code = this.trees_add_temp.tree_code;
        productset.tree_name = this.trees_add_temp.tree_name;
        productset.status = this.status_temp;
        productset.condition = this.condition_temp;
        productset.planting_date = this.datepicker2;
        // productset.tree_category = this.tree_category_temp;
        productset.qty = Number(this.jumlah_temp);

        newlist.push(productset);

        this.snackbar = true;
        this.colorsnackbar = "green";
        this.textsnackbar = "Product Berhasil ditambahkan..!!!";

        this.dialogAddProduct = false;
        this.loadtabledetail = false;

        this.defaultItem.list_detail = [];

        this.max_value_pohon_temp = productset.id;
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Jumlah Buku Tidak boleh 0..!!!";
      }
    },

    async deletelistitemproduct(item) {
      console.log(item);
      //   var newlist = [];
      //   this.loadtabledetail = true;

      //   var list = this.defaultItem.list_detail;
      //   this.defaultItem.list_detail = [];
      //   console.log(list);
      //   var result = false;
      //   for (let n = 0; n < list.length; n++) {
      //     if (list[n].tree_code == item.tree_code) {
      //       result = true;
      //       console.log(result);
      //       // break;
      //     } else {
      //       var productold = {
      //         tree_code: "",
      //         tree_name: "",
      //         amount: 0,
      //         id: 0,
      //         ph_form_no: "",
      //         tree_category: "",
      //       };

      //       productold.tree_code = list[n].tree_code;
      //       productold.tree_name = list[n].tree_name;
      //       productold.tree_category = list[n].tree_category;
      //       productold.amount = list[n].amount;

      //       newlist.push(productold);
      //     }
      //   }
      //   this.defaultItem.list_detail = [];

      //   this.snackbar = true;
      //   this.colorsnackbar = "green";
      //   this.textsnackbar = "Product Berhasil dihapus..!!!";

      //   this.defaultItem.list_detail = newlist;

      //   this.loadtabledetail = false;
    },

    canceladdproduk() {
      this.dialogAddProduct = false;
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
    showDetail(item) {
      this.type = "Detail";
      this.dialogDetail = true;
      this.getDetail(item);
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
    selectLahan(a) {
      console.log(a);
      // this.valueMUForm = a;
      if (a != null) {
        this.valuePetaniselected = a;
        this.getLahan();
      } else {
        // this.defaultItem.ff_no = "";
        // this.defaultItem.kode = "";
        this.itemslahan = [];
      }
    },
    selectedLahanNo(a) {
      console.log(a);
      // this.valueMUForm = a;
      if (a != null) {
        this.valueLahanselected = a;
        this.getLahanDetail();
      } else {
        // this.defaultItem.ff_no = "";
        // this.defaultItem.kode = "";
        // this.itemslahan = [];
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
      this.valueFC = "";
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

    resetvalue() {
      this.defaultItem.id = "";
      this.defaultItem.monitoring_no = "";
      this.defaultItem.lahan_no = "";
      this.defaultItem.farmer_no = "";
      this.defaultItem.planting_year = "";
      this.defaultItem.user_id = "";
      this.defaultItem.list_detail = [];
      this.itemlistpohon = [];

      this.e1 = 1;

      this.gambarinput1 = "";
      this.gambarinput2 = "";
      this.gambarinput3 = "";
      this.defaultItem.farmer_signature = "/images/noimage.png";
      this.defaultItem.gambar1 = "/images/noimage.png";
      this.defaultItem.gambar2 = "/images/noimage.png";
      this.defaultItem.gambar3 = "/images/noimage.png";
      this.defaultItem.gambarshow1 = "/images/noimage.png";
      this.defaultItem.gambarshow2 = "/images/noimage.png";
      this.defaultItem.gambarshow3 = "/images/noimage.png";

      this.load = false;
    },
    showAddModal() {
      this.load = false;
      // console.log(localStorage.getItem("token"));

      if (this.$refs.form) {
        this.$refs.form.reset();
      }

      this.formTitle = "Add data";
      this.dialogAddonly = true;

      this.resetvalue();
    },
    async showEditModal(item) {
      console.log("test");
      this.type = "Edit";
      this.resetvalue();
      //   console.log(this.itemTemp);
      this.dialogAddonly = true;
      this.dialogShowEdit = false;
      await this.getDetail(item);
      //   await this.getPetani();
      //   console.log(item.farmer_no);
      //   console.log(item);
      this.formTitle = "Edit data";
      //   this.defaultItem.farmer_no = this.itemTemp.farmer_no;
    },
    async showEditJumlahPohonModal() {
      // console.log(item.kode);
      this.type = "Edit";
      await this.getDetail(this.itemTemp);

      this.DetailTreesLahanTemp = this.defaultItem.planting_details;
      // await this.getTA("form");
      // await this.getVillage("form");
      // this.getPetani();
      console.log(this.DetailTreesLahanTemp.length);
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
      if (item.is_validate == 1) {
        this.type = "Detail";
        // this.dialogDetail = true;
        //   this.getDetail(item);
        this.ph_form_no_temp = item.ph_form_no;

        this.dialogCetakPilihan = true;
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Tidak Bisa Cetak. Status Belum Verifikasi";
      }
      //   var str = this.BaseUrlGet;
      //   window.open(
      //     str.substring(0, str.length - 4) +
      //       "CetakLabelLubangTanam?ph_form_no=" +
      //       item.ph_form_no
      //   );
    },
    showPrintLabel() {
      this.type = "Detail";
      // this.dialogDetail = true;
      //   this.getDetail(item);

      this.dialogCetakPilihan = false;
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakLabelLubangTanamTemp?ph_form_no=" +
          this.ph_form_no_temp
      );
    },
    showPrintTandaTerima() {
      this.dialogCetakPilihan = false;
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakBuktiPenyerahanTemp?ph_form_no=" +
          this.ph_form_no_temp
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
      this.dialogAddProduct = false;
      this.dialogdownload = false;
      this.dialogAddonly = false;
      this.dialogFilterArea = false;
      this.dialogFilterEmp = false;
    },
    closePohonTambah() {
      this.dialogPohon = false;
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

    async SaveAdd() {
      this.loadsave = true;
      if (this.defaultItem.fileUploadReady_gambar1 == true) {
        await this.UploadData(this.defaultItem.fileUpload1, "gambar1");
      }
      if (this.defaultItem.fileUploadReady_gambar2 == true) {
        await this.UploadData(this.defaultItem.fileUpload2, "gambar1");
      }
      if (this.defaultItem.fileUploadReady_gambar3 == true) {
        await this.UploadData(this.defaultItem.fileUpload3, "gambar3");
      }

      const datapost = {
        user_id: this.defaultItem.user_id,
        lahan_no: this.defaultItem.lahan_no,
        farmer_no: this.defaultItem.farmer_no,
        planting_date: this.datepicker1,
        planting_year: this.defaultItem.planting_year,
        lahan_condition: this.defaultItem.lahan_condition,
        gambar1: this.defaultItem.gambar1,
        gambar2: this.defaultItem.gambar2,
        gambar3: this.defaultItem.gambar3,
        list_pohon: this.defaultItem.list_detail,
      };

      console.log(datapost);

      //   if (this.defaultItem.id) {
      //     this.updateData();
      //   } else {
      //     this.addData();
      //   }
    },
    async save() {
      this.loadsave = true;
      // this.$refs.form.validate();

      if (
        this.defaultItem.user_id != "" &&
        this.defaultItem.lahan_no != "" &&
        this.defaultItem.farmer_no != "" &&
        this.defaultItem.planting_year != "" &&
        this.defaultItem.lahan_condition != ""
      ) {
        this.loadsave = true;
        if (this.defaultItem.fileUploadReady_gambar1 == true) {
          await this.UploadData(this.defaultItem.fileUpload1, "gambar1");
        }
        if (this.defaultItem.fileUploadReady_gambar2 == true) {
          await this.UploadData(this.defaultItem.fileUpload2, "gambar1");
        }
        if (this.defaultItem.fileUploadReady_gambar3 == true) {
          await this.UploadData(this.defaultItem.fileUpload3, "gambar3");
        }

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

    pilihgambar1(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.gambarshow1 = URL.createObjectURL(event);
        console.log(this.defaultItem.gambarshow1);
        this.defaultItem.fileUpload1 = event;
        this.defaultItem.fileUploadReady_gambar1 = true;
        // this.filephotoarray.push("lahan1");
      } else {
        this.defaultItem.gambarshow1 = "/images/noimage.png";
        this.defaultItem.fileUploadReady_gambar1 = false;
        // this.defaultItem.photo1 = "";
        // const index = this.filephotoarray.indexOf("lahan1");
        // if (index > -1) {
        //   this.filephotoarray.splice(index, 1);
        // }
      }
    },
    pilihgambar2(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.gambarshow2 = URL.createObjectURL(event);
        console.log(this.defaultItem.gambarshow2);
        this.defaultItem.fileUpload2 = event;
        this.defaultItem.fileUploadReady_gambar2 = true;
        // this.filephotoarray.push("lahan1");
      } else {
        this.defaultItem.gambarshow2 = "/images/noimage.png";
        this.defaultItem.fileUploadReady_gambar2 = false;
        // this.defaultItem.photo1 = "";
        // const index = this.filephotoarray.indexOf("lahan1");
        // if (index > -1) {
        //   this.filephotoarray.splice(index, 1);
        // }
      }
    },
    pilihgambar3(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.gambarshow3 = URL.createObjectURL(event);
        console.log(this.defaultItem.gambarshow3);
        this.defaultItem.fileUpload3 = event;
        this.defaultItem.fileUploadReady_gambar3 = true;
        // this.filephotoarray.push("lahan1");
      } else {
        this.defaultItem.gambarshow3 = "/images/noimage.png";
        this.defaultItem.fileUploadReady_gambar3 = false;
        // this.defaultItem.photo1 = "";
        // const index = this.filephotoarray.indexOf("lahan1");
        // if (index > -1) {
        //   this.filephotoarray.splice(index, 1);
        // }
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
      this.dialogdownload = true;
      this.downloadvalueff = false;
      this.downloadvaluetime = false;
      this.downloadvaluepetani = false;
      this.loaddownload = false;
      // console.log(this.valueMUExcel);
      // console.log(this.valueTAExcel);
      // console.log(this.valueVillageExcel);
      // console.log(this.typegetdataExcel);
      // console.log(this.valueFFcodeExcel);
    },
    pilihtipedownload(val) {
      console.log(val);
      if (val == "output_data") {
        this.downloadvalueff = false;
        this.downloadvaluetime = false;
        this.downloadvaluepetani = false;
      } else if (val == "loading_plan") {
        this.loaddownload = true;
        this.getFF();
        console.log(this.itemsff);
        this.downloadvalueff = true;
        this.downloadvaluetime = false;
        this.downloadvaluepetani = false;
      } else if (val == "packing_plan") {
        this.loaddownload = true;
        this.getDistribusiTimeDownload();
        this.downloadvalueff = false;
        this.downloadvaluetime = true;
        this.downloadvaluepetani = false;
      } else if (val == "shipping_plan") {
        this.loaddownload = true;
        this.getDistribusiTimeDownload();
        this.downloadvalueff = false;
        this.downloadvaluetime = true;
        this.downloadvaluepetani = false;
      } else if (val == "farmer_receipt") {
        this.loaddownload = true;
        this.getPetaniDownload();
        this.downloadvalueff = false;
        this.downloadvaluetime = false;
        this.downloadvaluepetani = true;
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Gagal tipe tidak tersedia";
        this.downloadvalueff = false;
        this.downloadvaluetime = false;
        this.downloadvaluepetani = false;
      }
    },
    verifytipedownload() {
      console.log(this.selectFFdownload.ff_no);
      console.log(this.selectpetanidownload.kodePetani);
      console.log(this.selectdistribusitimedownload);
      if (this.valuedownloadselected == "output_data") {
        this.downloadall();
      } else if (this.valuedownloadselected == "loading_plan") {
        if (this.selectFFdownload.ff_no) {
          this.downloadloadingplan(this.selectFFdownload.ff_no);
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal, pilih ff terlebih dahulu";
        }
      } else if (this.valuedownloadselected == "packing_plan") {
        if (this.selectdistribusitimedownload) {
          this.downloadpackingplan(this.selectdistribusitimedownload);
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal, pilih waktu distribusi terlebih dahulu";
        }
      } else if (this.valuedownloadselected == "shipping_plan") {
        // this.downloadshippingplan();
        if (this.selectdistribusitimedownload) {
          this.downloadshippingplan(this.selectdistribusitimedownload);
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal, pilih waktu distribusi terlebih dahulu";
        }
      } else if (this.valuedownloadselected == "farmer_receipt") {
        // this.downloadfarmerreceipt();
        if (this.selectpetanidownload.kodePetani) {
          this.downloadfarmerreceipt(this.selectpetanidownload.kodePetani);
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal, pilih petani terlebih dahulu";
        }
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar = "Gagal tipe tidak tersedia";
      }
    },

    downloadall() {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelPlantingHoleAll?mu=" +
          this.valueMUExcel +
          "&ta=" +
          this.valueTAExcel +
          "&village=" +
          this.valueVillageExcel +
          "&typegetdata=" +
          this.typegetdataExcel +
          "&ff=" +
          this.valueFFcodeExcel +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );

      this.valueMUExcel = "";
      this.valueTAExcel = "";
      this.valueVillageExcel = "";
      this.typegetdataExcel = "";
      this.valueFFcodeExcel = "";
    },
    downloadpackingplan(val) {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelPackingPlan?date=" +
          val +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );
    },
    downloadshippingplan(val) {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelShippingPlan?date=" +
          val +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );
    },
    downloadloadingplan(val) {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelLoadingPlan?typegetdatadownload=ff&ff=" +
          val +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );
    },
    downloadfarmerreceipt(val) {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "CetakExcelLoadingPlan?typegetdatadownload=farmer&farmer_no=" +
          val +
          "&max_kayu=" +
          this.max_kayu +
          "&max_mpts=" +
          this.max_mpts +
          "&max_crops=" +
          this.max_crops
      );
    },

    deleteItemPohon(item) {
      this.editedIndexPohon = this.itemlistpohon.indexOf(item);
      this.editedItemPohon = Object.assign({}, item);
      console.log(item);
      this.dialogDeletePohon = true;
    },
    deleteItemConfirmPohon() {
      this.itemlistpohon.splice(this.editedIndexPohon, 1);
      this.closeDeletePohon();
    },
    closePohon() {
      this.dialogPohon = false;
      this.$nextTick(() => {
        this.editedItemPohon = Object.assign({}, this.defaultItemPohon);
        this.editedIndexPohon = -1;
      });
    },
    closeDeletePohon() {
      this.dialogDeletePohon = false;
      this.$nextTick(() => {
        this.editedItemPohon = Object.assign({}, this.defaultItemPohon);
        this.editedIndexPohon = -1;
      });
    },
    savePohon() {
      if (this.editedIndexPohon > -1) {
        Object.assign(
          this.itemlistpohon[this.editedIndexPohon],
          this.editedItemPohon
        );
      } else {
        this.editedItemPohon.planting_date = this.datepicker4;
        this.editedItemPohon.tree_code = this.tree_temp.tree_code;
        this.editedItemPohon.tree_name = this.tree_temp.tree_name;
        // console.log(this.editedItemPohon);
        this.itemlistpohon.push(this.editedItemPohon);
        //   console.log(this.datepicker4);
      }
      this.closePohon();
    },
  },
};
</script>
