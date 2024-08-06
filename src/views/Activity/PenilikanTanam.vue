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

    <!-- MODAL -->

    <!-- <pushPopulatePreview
      :show="false"
      :listData="listMonitoring1Checked"
      >
      </pushPopulatePreview> -->

    <!-- Export Distribusi Simple -->
    <ExportPenilikanTanam
      :show="exportSimpleDistribution.show"
      :ItemData="exportSimpleDistribution.data"
      :program_year="generalSettings.programYear"
      @close="exportSimpleDistribution.show = false"
    >
    </ExportPenilikanTanam>
    <!-- modal dialog foto tanaman -->
    <v-dialog
      v-model="plantPhotoDialog"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card rounded="xl">
        <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text"
          >Foto & Deskripsi Tanaman
          <v-icon
            color="white"
            class="ml-auto"
            @click="plantPhotoDialog = false"
            >mdi-close-circle</v-icon
          >
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <p class="text-center">
                  Deskripsi: {{ this.plantDescription }}
                </p>
                <v-text-field
                  outlined
                  hide-details
                  rounded
                  dense
                  color="success"
                  v-model="plantDescription"
                  :min="1"
                  :rules="[(v) => (v && v.length < 1) || 'Kolom Harus Terisi']"
                  label="Edit Deskripsi?"
                  placeholder="Masukan Deskripsi Baru..."
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="blue"
            :disabled="plantDescription < 1"
            rounded
            class="px-5"
            @click="refreshPlantPhotoBtn()"
          >
            <v-icon small class="mr-1">mdi-camera-flip</v-icon>
            Refresh Foto
          </v-btn>
          <v-btn
            color="green white--text"
            rounded
            class="px-5"
            @click="openPlantPhoto()"
          >
            <v-icon small class="mr-1">mdi-magnify</v-icon>
            Buka Foto
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Modal Filter Area -->
    <v-dialog
      v-model="dialogFilterArea"
      max-width="500px"
      content-class="rounded-xl mx-1"
      persistent
    >
      <v-card>
        <v-card-title class="mb-1 green darken-3 rounded-xl ma-1 py-2">
          <span class="white--text">Filter Area</span>
          <v-icon color="white" class="ml-auto" @click="resetFilter()"
            >mdi-close-circle</v-icon
          >
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  outlined
                  rounded
                  color="green"
                  clearable
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  hide-details
                  v-model="selectMU"
                  :items="itemsMU"
                  item-value="mu_no"
                  item-text="name"
                  v-on:change="selectedMU"
                  label="Management Unit"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  outlined
                  rounded
                  color="green"
                  clearable
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  hide-details
                  v-model="selectTA"
                  :items="itemsTA"
                  item-value="area_code"
                  item-text="name"
                  v-on:change="selectedTA"
                  label="Target Area"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  outlined
                  rounded
                  color="green"
                  clearable
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  hide-details
                  v-model="selectVillage"
                  :items="itemsVillage"
                  item-value="kode_desa"
                  item-text="name"
                  v-on:change="selectedVillage"
                  label="Desa"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="red" rounded class="px-5" @click="resetFilter()">
            <v-icon small class="mr-1">mdi-close-circle</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="green white--text"
            rounded
            class="px-5"
            @click="searchbyarea"
          >
            <v-icon small class="mr-1">mdi-magnify</v-icon>
            Cari
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Filter Emp -->
    <v-dialog
      v-model="dialogFilterEmp"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="justify-center"
          >Filter Pencarian Berdasarkan Emp</v-card-title
        >
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  outlined
                  rounded
                  color="green"
                  clearable
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  hide-details
                  v-model="selectUM"
                  :items="itemsum"
                  item-value="nik"
                  item-text="name"
                  v-on:change="selectedUM"
                  label="Pilih Unit Manager"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  outlined
                  rounded
                  color="green"
                  clearable
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  hide-details
                  v-model="selectFC"
                  :items="itemsfc"
                  item-value="nik"
                  item-text="name"
                  v-on:change="selectedFC"
                  label="Pilih Field Coordinator"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="red"
            rounded
            class="px-5"
            @click="dialogFilterEmp = false"
          >
            <v-icon small class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-btn
            color="green white--text"
            rounded
            class="px-5"
            @click="searchbyemp"
          >
            <v-icon small class="mr-1">mdi-magnify</v-icon>
            Cari
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Add Edit -->
    <v-dialog v-model="dialog" max-width="800px">
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
                          :items="$_config.programYear.options"
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
                      Keluar
                    </v-btn>
                    <v-btn
                      elevation="1"
                      outlined
                      color="primary"
                      @click="e1 = 2"
                    >
                      <v-icon left> mdi-chevron-right-circle-outline </v-icon>
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
                      Keluar
                    </v-btn>
                    <v-btn
                      elevation="1"
                      outlined
                      color="primary"
                      @click="e1 = 3"
                    >
                      <v-icon left> mdi-chevron-right-circle-outline </v-icon>
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
                      Keluar
                    </v-btn>
                    <v-btn color="success" elevation="1" outlined @click="save">
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

    <v-dialog v-model="dialogAddonly" max-width="800px">
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
                      <v-menu v-model="menu1" transition="scale-transition">
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
                    Keluar
                  </v-btn>
                  <v-btn elevation="1" outlined color="primary" @click="e1 = 2">
                    <v-icon left> mdi-chevron-right-circle-outline </v-icon>
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
                    Keluar
                  </v-btn>
                  <v-btn color="success" elevation="1" outlined @click="save">
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
                    <h4 v-if="loadsave == false">SaveAdd</h4>
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

    <!-- Dialog Add Monitoring Lahan Umum Photo -->
    <v-dialog
      v-model="dialogAddLahanUmumPlantPhoto.model"
      max-width="500px"
      content-class="rounded-xl mx-1"
      persistent
    >
      <v-card>
        <v-card-title class="mb-1 green darken-3 rounded-xl ma-1 py-2">
          <span class="white--text">Tambah Foto Per Jenis Bibit</span>
          <v-icon
            color="white"
            class="ml-auto"
            @click="dialogAddLahanUmumPlantPhoto.model = false"
            >mdi-close-circle</v-icon
          >
        </v-card-title>
        <v-card-text>
          <v-container
            fluid
            fill-height
            style="background-color: rgba(255, 255, 255, 0.5)"
          >
          </v-container>
          <v-row class="my-0">
            <v-col cols="12" sm="12" md="12" lg="12">
              <v-file-input
                color="success"
                item-color="success"
                outlined
                rounded
                hide-details
                accept="image/jpg"
                placeholder="Photo Per-Jenis Pohon"
                prepend-icon="mdi-camera"
                label="Foto per-pohon (*max 6mb & .jpg)"
                v-on:change="photoPerjenisFileChanged"
                :rules="[(v) => !!v || 'Field is required']"
              ></v-file-input>
              <v-card
                elevation="2"
                class="rounded-xl"
                height="300"
                v-if="
                  dialogFormLahanUmum.inputs.photoPerjenis.preview &&
                  dialogFormLahanUmum.inputs.photoPerjenis.preview !== ''
                "
              >
                <v-img
                  height="300"
                  v-bind:src="dialogFormLahanUmum.inputs.photoPerjenis.preview"
                  class="my-2 mb-4 rounded-xl cursor-pointer"
                  id="photoPerjenis"
                  @click="
                    showLightbox(
                      dialogFormLahanUmum.inputs.photoPerjenis.preview
                    )
                  "
                ></v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="red"
            rounded
            class="px-5"
            @click="dialogAddLahanUmumPlantPhoto.model = false"
          >
            <v-icon small class="mr-1">mdi-close-circle</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="green white--text"
            rounded
            :disabled="
              this.dialogFormLahanUmum.inputs.photoPerjenis.model == null ||
              this.dialogFormLahanUmum.inputs.photoPerjenis.preview == ''
            "
            class="px-5"
            @click="
              saveLahanUmumPhotoPerjenis(
                'Perjenis',
                dialogFormLahanUmum.inputs.photoPerjenis.model
              )
            "
          >
            <v-icon small class="mr-1">mdi-save</v-icon>
            Simpan
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Add Realisasi Tanam Lahan Umum -->
    <v-dialog
      v-model="dialogFormLahanUmum.model"
      max-width="1000px"
      content-class="rounded-xl mx-1"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title class="mb-1 headermodalstyle">
          <span class="">Form Realisasi Tanam Lahan Umum</span>
        </v-card-title>

        <v-card-text>
          <v-container
            v-if="dialogFormLahanUmum.loading"
            fluid
            fill-height
            style="background-color: rgba(255, 255, 255, 0.5)"
          >
            <v-layout justify-center align-center>
              <v-progress-circular
                :size="80"
                :width="10"
                indeterminate
                color="green"
              >
              </v-progress-circular>
            </v-layout>
          </v-container>
          <v-row v-else class="my-0">
            <!-- MoU No -->
            <v-col cols="12" sm="12">
              <v-autocomplete
                color="success"
                item-color="success"
                item-text="mou_no"
                item-value="mou_no"
                v-model="dialogFormLahanUmum.inputs.mou_no.model"
                :items="dialogFormLahanUmum.inputs.mou_no.options"
                @change="getSeedDetailFromDistributionAdjustment"
                :disabled="dialogFormLahanUmum.inputs.mou_no.disabled"
                clearable
                outlined
                hide-details
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                rounded
                label="MoU No"
                class=""
              >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="data.item.mou_no"
                    ></v-list-item-title>
                    <v-list-item-subtitle>{{
                      data.item.pic_lahan
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-btn fab x-small color="green white--text" class="mr-2"
                ><v-icon>mdi-sprout</v-icon></v-btn
              >
              <h3>Adjusting Trees</h3>
              <v-divider class="mx-2"></v-divider>
            </v-col>
            <v-col cols="12" md="12">
              <p class="red--text">
                <strong>*Jangan Lupa Mengisi Foto Pohon Per-jenis!</strong>
              </p>
              <v-data-table
                :headers="dialogFormLahanUmum.inputs.adjustment.headers"
                :items="dialogFormLahanUmum.inputs.adjustment.items"
                :loading="dialogFormLahanUmum.inputs.adjustment.loading"
                :items-per-page="-1"
                hide-default-footer
                class="rounded-xl elevation-5 overflow-hidden mt-2"
              >
                <template v-slot:progress>
                  <v-layout justify-center align-center>
                    <v-progress-circular
                      :size="50"
                      :width="5"
                      indeterminate
                      color="green"
                      class="my-3"
                    >
                    </v-progress-circular>
                  </v-layout>
                </template>
                <template v-slot:item.no="{ index }">
                  {{ index + 1 }}
                </template>
                <template v-slot:item.total_tree_received="{ item }">
                  <v-chip color="info white--text">
                    <v-icon>mdi-sprout</v-icon>
                    <strong class="ml-1">{{
                      numberFormat(item.total_tree_received)
                    }}</strong>
                  </v-chip>
                </template>
                <template v-slot:item.planted="{ index, item }">
                  <v-row
                    class="ma-0 align-center justify-end justify-lg-center flex-nowrap"
                  >
                    <v-text-field
                      color="green"
                      class="mr-1 my-1"
                      dense
                      hide-details
                      outlined
                      rounded
                      style="max-width: 120px"
                      type="number"
                      min="0"
                      label="Life"
                      v-model="
                        dialogFormLahanUmum.inputs.adjustment.items[index]
                          .total_tree_planted_life
                      "
                      @change="updateSeedlingAdjustment"
                      @keyup="updateSeedlingAdjustment"
                      @click="updateSeedlingAdjustment"
                    ></v-text-field>
                    <v-btn
                      fab
                      x-small
                      color="green white--text"
                      class="mr-2"
                      @click="openDialogPhoto(item, 'hidup')"
                      ><v-icon>mdi-camera</v-icon>
                    </v-btn>
                    <v-text-field
                      color="green"
                      class="mr-1 my-1"
                      dense
                      hide-details
                      outlined
                      rounded
                      style="max-width: 120px"
                      type="number"
                      min="0"
                      label="Dead"
                      v-model="
                        dialogFormLahanUmum.inputs.adjustment.items[index]
                          .total_tree_planted_dead
                      "
                      @change="updateSeedlingAdjustment"
                      @keyup="updateSeedlingAdjustment"
                      @click="updateSeedlingAdjustment"
                    ></v-text-field>
                    <v-btn
                      fab
                      x-small
                      color="red white--text"
                      class="mr-2"
                      @click="openDialogPhoto(item, 'mati')"
                      ><v-icon>mdi-camera</v-icon>
                    </v-btn>
                  </v-row>
                </template>
                <template v-slot:item.unplanted="{ index }">
                  <v-row
                    class="ma-0 align-center justify-end justify-lg-center flex-nowrap"
                  >
                    <v-text-field
                      color="green"
                      class="mr-1 my-1"
                      dense
                      hide-details
                      outlined
                      rounded
                      style="max-width: 120px"
                      type="number"
                      min="0"
                      label="Life"
                      v-model="
                        dialogFormLahanUmum.inputs.adjustment.items[index]
                          .total_tree_unplanted_life
                      "
                      @change="updateSeedlingAdjustment"
                      @keyup="updateSeedlingAdjustment"
                      @click="updateSeedlingAdjustment"
                    ></v-text-field>
                    <v-text-field
                      color="green"
                      class="mr-1 my-1"
                      dense
                      hide-details
                      outlined
                      rounded
                      style="max-width: 120px"
                      type="number"
                      min="0"
                      label="Dead"
                      v-model="
                        dialogFormLahanUmum.inputs.adjustment.items[index]
                          .total_tree_unplanted_dead
                      "
                      @change="updateSeedlingAdjustment"
                      @keyup="updateSeedlingAdjustment"
                      @click="updateSeedlingAdjustment"
                    ></v-text-field>
                  </v-row>
                </template>
                <template v-slot:item.lost="{ item }">
                  <v-chip color="red white--text">
                    <v-icon>mdi-pi-hole</v-icon>
                    <strong class="ml-1">{{ numberFormat(item.lost) }}</strong>
                  </v-chip>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-btn fab x-small color="green white--text" class="mr-2"
                ><v-icon>mdi-forest</v-icon></v-btn
              >
              <h3>Land Data</h3>
              <v-divider class="mx-2"></v-divider>
            </v-col>
            <!-- Lahan Condition -->
            <v-col cols="12" sm="12" md="6" lg="4">
              <v-text-field
                color="green"
                hide-details
                outlined
                rounded
                label="Land Condition"
                v-model="dialogFormLahanUmum.inputs.land_condition"
              ></v-text-field>
            </v-col>
            <!-- Standard Trees Amount -->
            <v-col cols="12" sm="12" md="6" lg="4">
              <v-text-field
                color="green"
                hide-details
                outlined
                rounded
                type="number"
                min="0"
                label="Standard Trees Amount"
                v-model="dialogFormLahanUmum.inputs.qty_std"
              ></v-text-field>
            </v-col>
            <!-- Planting Date -->
            <v-col cols="12" md="6" lg="4" class="text-center">
              <v-menu
                v-model="
                  dialogFormLahanUmum.inputs.planting_date.datepicker.show
                "
                offset-x
                transition="slide-x-transition"
                rounded="xl"
              >
                <template v-slot:activator="{ on, attrs }">
                  <p class="mb-0">
                    <strong>{{
                      dialogFormLahanUmum.inputs.planting_date.label
                    }}</strong>
                  </p>
                  <v-btn
                    rounded
                    class=""
                    color="green white--text"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{
                      dateFormat(
                        dialogFormLahanUmum.inputs.planting_date.model,
                        "ddd, DD MMMM Y"
                      )
                    }}
                  </v-btn>
                </template>
                <div>
                  <v-date-picker
                    v-model="dialogFormLahanUmum.inputs.planting_date.model"
                    min="2023-11-24"
                    max="2024-03-31"
                    @input="
                      dialogFormLahanUmum.inputs.planting_date.datepicker.show = false
                    "
                    color="green"
                    class="rounded-xl"
                    :key="
                      dialogFormLahanUmum.inputs.planting_date.datepicker.key
                    "
                  ></v-date-picker>
                </div>
              </v-menu>
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-btn fab x-small color="green white--text" class="mr-2"
                ><v-icon>mdi-image-multiple</v-icon></v-btn
              >
              <h3>Photos</h3>
              <v-divider class="mx-2"></v-divider>
            </v-col>
            <!-- Photo 1 File -->
            <v-col cols="12" sm="12" md="6" lg="4">
              <v-file-input
                v-if="false"
                color="success"
                item-color="success"
                outlined
                rounded
                hide-details
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Photo 1"
                prepend-icon="mdi-camera"
                label="Living Plant (*max 6mb)"
                v-on:change="photo1FileChanged"
                :rules="[(v) => !!v || 'Field is required']"
              ></v-file-input>
              <v-card
                elevation="2"
                class="rounded-xl"
                height="300"
                v-if="
                  dialogFormLahanUmum.inputs.photo1.preview &&
                  dialogFormLahanUmum.inputs.photo1.preview !== ''
                "
              >
                <v-img
                  height="300"
                  v-bind:src="dialogFormLahanUmum.inputs.photo1.preview"
                  class="my-2 mb-4 rounded-xl cursor-pointer"
                  id="photo1"
                  @click="
                    showLightbox(dialogFormLahanUmum.inputs.photo1.preview)
                  "
                ></v-img
              ></v-card>
            </v-col>
            <!-- Photo 3 File -->
            <v-col cols="12" sm="12" md="6" lg="4">
              <v-file-input
                color="success"
                item-color="success"
                outlined
                rounded
                hide-details
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Foto Bibit Belum Ditanam"
                prepend-icon="mdi-camera"
                label="Bibit Belum Ditantam (*max 6mb)"
                v-on:change="photo3FileChanged"
                :rules="[(v) => !!v || 'Field is required']"
              ></v-file-input>
              <v-card
                elevation="2"
                class="rounded-xl"
                height="300"
                v-if="
                  dialogFormLahanUmum.inputs.photo3.preview &&
                  dialogFormLahanUmum.inputs.photo3.preview !== ''
                "
              >
                <v-img
                  height="300"
                  v-bind:src="dialogFormLahanUmum.inputs.photo3.preview"
                  class="my-2 mb-4 rounded-xl cursor-pointer"
                  id="photo3"
                  @click="
                    showLightbox(dialogFormLahanUmum.inputs.photo3.preview)
                  "
                ></v-img
              ></v-card>
            </v-col>
            <!-- Photo 2 File -->
            <v-col cols="12" sm="12" md="6" lg="4">
              <v-file-input
                v-if="false"
                color="success"
                item-color="success"
                outlined
                rounded
                hide-details
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Foto Bibit Belum Ditanam"
                prepend-icon="mdi-camera"
                label="Bibit Belum Ditanam (*max 6mb)"
                v-on:change="photo2FileChanged"
                :rules="[(v) => !!v || 'Field is required']"
              ></v-file-input>
              <v-card
                elevation="2"
                class="rounded-xl"
                height="300"
                v-if="
                  dialogFormLahanUmum.inputs.photo2.preview &&
                  dialogFormLahanUmum.inputs.photo2.preview !== ''
                "
              >
                <v-img
                  height="300"
                  v-bind:src="dialogFormLahanUmum.inputs.photo2.preview"
                  class="my-2 mb-4 rounded-xl cursor-pointer"
                  id="photo2"
                  @click="
                    showLightbox(dialogFormLahanUmum.inputs.photo2.preview)
                  "
                ></v-img
              ></v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions v-if="dialogFormLahanUmum.loading == false">
          <v-btn
            color="red white--text"
            rounded
            @click="dialogFormLahanUmum.model = false"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-divider class="mx-2"></v-divider>
          <v-btn
            color="blue white--text"
            rounded
            :disabled="
              dialogFormLahanUmum.inputs.qty_std < 1 ||
              dialogFormLahanUmum.inputs.land_condition < 1 ||
              !dialogFormLahanUmum.inputs.mou_no.model ||
              dialogFormLahanUmum.inputs.adjustment.items.length == 0 ||
              !dialogFormLahanUmum.inputs.planting_date.model
            "
            @click="dialogFormLahanUmum.confirm = true"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogFormLahanUmum.confirm"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="justify-center">
          Are you sure you want to SAVE?
          <small class="red--text">Proses Ini Tidak Bisa Dikembalikan!</small>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="pr-3"
            color="red white--text"
            rounded
            @click="dialogFormLahanUmum.confirm = false"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-btn
            color="green white--text"
            class="pr-3"
            rounded
            @click="saveLahanUmumMonitoring"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            OK, SIMPAN
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPohon" max-width="500px">
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
            Keluar
          </v-btn>
          <v-btn color="blue darken-1" text @click="savePohon"> Simpan </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDeletePohon" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeletePohon"
            >Keluar</v-btn
          >
          <v-btn color="blue darken-1" text @click="deleteItemConfirmPohon"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Add Product -->
    <v-dialog v-model="dialogAddProduct" max-width="500px">
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
          <v-btn color="red" elevation="1" outlined @click="canceladdproduk">
            <v-icon left> mdi-close-circle-outline </v-icon>
            Keluar
          </v-btn>
          <v-btn color="success" elevation="1" outlined @click="addProduct">
            <v-icon left> mdi-plus-circle-outline </v-icon>
            Tambah Data
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogShowEdit" max-width="500px">
      <v-card>
        <v-card-title class="headline">What you want to edit?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="blue" text @click="showEditModal"
            >Edit Sosialisasi</v-btn
          >
          <v-btn outlined color="green" text @click="showEditJumlahPohonModal"
            >Jumlah Pohon</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDetailPohon" max-width="500px">
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
            >Keluar</v-btn
          >
          <v-btn outlined color="blue" text @click="saveEditPohon"
            >Simpan</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDetailPohonEdit" max-width="300px">
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
            >Keluar</v-btn
          >
          <v-btn outlined color="blue" text @click="saveEditPohonTemp"
            >Simpan</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Detail -->
    <v-dialog
      v-model="dialogDetail"
      max-width="1000px"
      content-class="rounded-xl"
      scrollable
    >
      <v-card>
        <v-card-title class="mb-1 headermodalstyle">
          <span class="">Detail Realisasi Tanam</span>
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
                color="green"
              >
              </v-progress-circular>
            </v-layout>
          </v-container>
          <v-container v-if="load == false">
            <DetailLahanMap
              v-if="dialogDetail"
              :key="`MapMarkerLocation${dialogDetail}`"
              :lahanNo="defaultItem.lahan_no || ''"
              :section="`RealisasiTanam`"
            />
            <v-row>
              <v-col cols="12">
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
                        <td class="text-left" style="font-size: 14px">
                          <strong>{{
                            defaultItem.planting_year ||
                            defaultItem.program_year ||
                            "?"
                          }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th
                          class="text-left"
                          style="width: 200px; font-size: 14px"
                        >
                          Monitoring No
                        </th>
                        <td class="text-left" style="font-size: 14px">
                          <strong>{{ defaultItem.monitoring_no }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left" style="font-size: 14px">
                          Nama
                          {{
                            generalSettings.landProgram.model == "Petani"
                              ? "FF"
                              : "PIC T4T"
                          }}
                        </th>
                        <td class="text-left" style="font-size: 14px">
                          <strong>{{
                            defaultItem.nama_ff ||
                            defaultItem.nama_pic_t4t ||
                            "?"
                          }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left" style="font-size: 14px">
                          Nama
                          {{
                            generalSettings.landProgram.model == "Petani"
                              ? "Petani"
                              : "PIC Lahan"
                          }}
                        </th>
                        <td class="text-left" style="font-size: 14px">
                          <strong>{{
                            defaultItem.nama_petani ||
                            defaultItem.nama_pic_lahan ||
                            "?"
                          }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left" style="font-size: 14px">
                          No Lahan
                        </th>
                        <td class="text-left" style="font-size: 14px">
                          <strong v-if="defaultItem.lahan_no">{{
                            defaultItem.lahan_no
                              .replace("[", "")
                              .replace("]", "")
                          }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left" style="font-size: 14px">
                          Kondisi Lahan
                        </th>
                        <td class="text-left" style="font-size: 14px">
                          <strong style="text-transform: capitalize">
                            {{ defaultItem.lahan_condition.replace("_", " ") }}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left" style="font-size: 14px">
                          Pohon Hidup
                        </th>
                        <td class="text-left" style="font-size: 14px">
                          <strong>{{ defaultItem.qty_std || 0 }}</strong>
                        </td>
                      </tr>
                      <tr v-if="generalSettings.landProgram.model == 'Petani'">
                        <th class="text-left" style="font-size: 14px">
                          Tanggal Penanaman
                        </th>
                        <td class="text-left" style="font-size: 14px">
                          <strong>{{
                            defaultItem.planting_date
                              ? $store.getters.dateFormat(
                                  defaultItem.planting_date,
                                  "DD MMMM Y"
                                )
                              : "-"
                          }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div>
                  <h4 class="mt-3 mb-2">
                    <v-icon>mdi-sprout</v-icon> Jenis dan Jumlah Bibit
                  </h4>
                  <h3 class="ml-1">
                    <v-simple-table
                      dense
                      class="rounded-xl overflow-hidden"
                      style="
                        border: 1px solid #e2e2e2;
                        border-collapse: collapse;
                      "
                    >
                      <thead>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th colspan="2" class="text-center">Ditanam</th>
                          <th colspan="2" class="text-center">Belum Ditanam</th>
                          <th></th>
                        </tr>
                        <tr>
                          <th class="text-center">No</th>
                          <th>Category</th>
                          <th>Name</th>
                          <th class="text-center">Hidup</th>
                          <th class="text-center">Mati</th>
                          <th class="text-center">Hidup</th>
                          <th class="text-center">Mati</th>
                          <th class="text-center">Hilang</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(seed, seedIndex) in defaultItem.list_detail"
                          :key="seedIndex"
                        >
                          <td class="text-center">{{ seedIndex + 1 }}</td>
                          <td>{{ seed.tree_category }}</td>
                          <td>{{ seed.tree_name }}</td>
                          <td class="text-center">
                            <v-btn
                              color="green white--text"
                              outlined
                              hide-details
                              dense
                              :disabled="
                                defaultItem.list_detail[seedIndex].seedling
                                  .ditanam.hidup <= 0
                              "
                              @click="
                                openDialogPhotoDetailJenis(
                                  defaultItem.list_detail[seedIndex].seedling
                                    .ditanam,
                                  defaultItem.list_detail[seedIndex].seedling
                                    .ditanam.fotoHidup,
                                  '-',
                                  'hidup'
                                )
                              "
                              rounded
                            >
                              <v-icon class="mr-1">mdi-image</v-icon>
                              {{
                                defaultItem.list_detail[seedIndex].seedling
                                  .ditanam.hidup
                              }}
                            </v-btn>
                          </td>
                          <td class="text-center">
                            <v-btn
                              color="red white--text"
                              outlined
                              hide-details
                              dense
                              :disabled="
                                defaultItem.list_detail[seedIndex].seedling
                                  .ditanam.mati <= 0
                              "
                              @click="
                                openDialogPhotoDetailJenis(
                                  defaultItem.list_detail[seedIndex].seedling
                                    .ditanam,
                                  defaultItem.list_detail[seedIndex].seedling
                                    .ditanam.fotoMati,
                                  defaultItem.list_detail[seedIndex].seedling
                                    .ditanam.keterangan,
                                  'mati'
                                )
                              "
                              rounded
                            >
                              <v-icon class="mr-1">mdi-image</v-icon>
                              {{
                                defaultItem.list_detail[seedIndex].seedling
                                  .ditanam.mati
                              }}
                              <v-tooltip activator="parent" location="end"
                                ><span>Klik untuk memunculkan</span></v-tooltip
                              >
                            </v-btn>
                          </td>
                          <td class="text-center">
                            <v-btn
                              color="green white--text"
                              outlined
                              hide-details
                              dense
                              rounded
                            >
                              <v-icon class="mr-1">mdi-sprout</v-icon>
                              {{
                                defaultItem.list_detail[seedIndex].seedling
                                  .blm_ditanam.hidup
                              }}
                            </v-btn>
                          </td>
                          <td class="text-center">
                            <v-btn
                              color="red white--text"
                              outlined
                              hide-details
                              dense
                              rounded
                            >
                              <v-icon class="mr-1">mdi-sprout</v-icon>
                              {{
                                defaultItem.list_detail[seedIndex].seedling
                                  .blm_ditanam.mati
                              }}
                            </v-btn>
                          </td>
                          <td class="text-center">
                            <v-btn
                              color="orange white--text"
                              outlined
                              hide-details
                              dense
                              rounded
                            >
                              <v-icon class="mr-1"
                                >mdi-eye-remove-outline</v-icon
                              >
                              {{
                                defaultItem.list_detail[seedIndex].seedling
                                  .hilang
                              }}
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </h3>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="text-center mb-2">
                  <v-icon>mdi-image-multiple</v-icon> Foto Bibit Belum Ditanam
                </div>
                <v-row class="justify-center align-center">
                  <!-- <v-col cols="12" lg="4">
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.gambarshow1"
                        @click="showLightbox(defaultItem.gambarshow1)"
                        class="my-1 mb-4 rounded-xl cursor-pointer"
                      ></v-img>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.gambarshow2"
                        @click="showLightbox(defaultItem.gambarshow2)"
                        class="my-1 mb-4 rounded-xl cursor-pointer"
                      ></v-img>
                    </v-col> -->
                  <v-col cols="12" lg="4">
                    <v-img
                      height="250"
                      v-bind:src="defaultItem.gambarshow3"
                      @click="showLightbox(defaultItem.gambarshow3)"
                      class="my-1 mb-4 rounded-xl cursor-pointer"
                    ></v-img>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions v-if="load == false">
          <v-spacer></v-spacer>
          <v-btn
            v-if="
              RoleAccesCRUDShow == true &&
              defaultItem.is_validate == 0 &&
              User.role_name != 'UNIT MANAGER'
            "
            rounded
            color="green white--text"
            class="pr-3"
            @click="verifSubmit()"
            elevation="1"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon> Verifikasi FC
          </v-btn>
          <v-btn
            v-else-if="
              RoleAccesCRUDShow == true &&
              defaultItem.is_validate == 1 &&
              User.role_name != 'FIELD COORDINATOR'
            "
            rounded
            @click="dialogVerificationUM = true"
            color="green white--text"
            class="pr-3"
            elevation="1"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon> Verifikasi UM
          </v-btn>
          <v-btn
            v-if="defaultItem.is_verified == 0"
            :disabled="
              User.role_name == 'PROGRAM MANAGER' ||
              User.role_name == 'REGIONAL MANAGER'
            "
            rounded
            color="green white--text"
            class="pr-3"
            @click="
              () => {
                verifSubmit();
              }
            "
            elevation="1"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon> Verifikasi PIC
          </v-btn>
          <v-btn
            v-if="defaultItem.is_verified == 1"
            :disabled="
              User.role_name != 'PROGRAM MANAGER' &&
              User.role_name != 'REGIONAL MANAGER' &&
              User.role_group != 'IT'
            "
            rounded
            color="green white--text"
            class="pr-3"
            @click="
              () => {
                verifSubmit();
              }
            "
            elevation="1"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon> Verifikasi RM / PM
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Verification -->
    <v-dialog
      v-model="dialogVerification"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="justify-center">
          Apa Anda Yakin Untuk Melakukan VERIFIKASI?
          <small class="red--text">Proses Ini Tidak Bisa Dikembalikan!</small>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="pr-3"
            color="red white--text"
            text
            rounded
            @click="closeVerification"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-btn
            color="green white--text"
            class="pr-3"
            rounded
            @click="VerificationItemConfirm"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            OK, Verifikasi
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogVerificationUM"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="justify-center">
          Apa Anda Yakin Untuk Melakukan <strong> VERIFIKASI?</strong>
          <small class="red--text">Proses Ini Tidak Bisa Dikembalikan!</small>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="pr-3"
            color="red white--text"
            rounded
            @click="dialogVerificationUM = false"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-btn
            color="green white--text"
            class="pr-3"
            rounded
            @click="VerificationUMItemConfirm"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            OK, Verifikasi
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Unverif -->
    <v-dialog
      v-model="dialogUnverif"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="justify-center text-center"
          >Apa Anda Yakin Untuk Melakukan <br />
          UNVERIFIKASI? <br />
          Data Monitoring Ini?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="pr-3"
            color="red white--text"
            rounded
            @click="dialogUnverif = false"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-btn
            color="warning white--text"
            class="pr-3"
            rounded
            @click="unverifItemConfirm"
          >
            <v-icon class="mr-1 pl-2">mdi-undo</v-icon>
            Ya, Unverifikasi
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Delete -->
    <v-dialog
      v-model="dialogDelete"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-text>
          <p
            class="text-center grey--text text--darken-3 pt-4"
            style="font-size: 20px"
          >
            Apa Anda Yakin Untuk <br />
            MENGHAPUS Ini? <br /><b>{{ defaultItem.monitoring_no }}</b
            >?
          </p>
          <v-simple-table>
            <tbody>
              <tr>
                <td>MU</td>
                <td>:</td>
                <td>
                  <b>{{ defaultItem.mu_name }}</b>
                </td>
              </tr>
              <tr v-if="generalSettings.landProgram.model == 'Petani'">
                <td>FF</td>
                <td>:</td>
                <td>
                  <b>{{ defaultItem.nama_ff }}</b>
                </td>
              </tr>
              <tr v-else>
                <td>PIC T4T</td>
                <td>:</td>
                <td>
                  <b>{{ defaultItem.pic_t4t_name || "-" }}</b>
                </td>
              </tr>
              <tr v-if="generalSettings.landProgram.model == 'Petani'">
                <td>Petani</td>
                <td>:</td>
                <td>
                  <b>{{ defaultItem.nama_petani }}</b>
                </td>
              </tr>
              <tr v-else>
                <td>PIC Lahan</td>
                <td>:</td>
                <td>
                  <b>{{ defaultItem.pic_lahan_name || "-" }}</b>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="pr-3"
            color="blue white--text"
            text
            rounded
            @click="() => (dialogDelete = false)"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-divider class="mx-2"></v-divider>
          <v-btn
            color="red white--text"
            class="pr-3"
            rounded
            @click="
              () => {
                deleteItemConfirm();
              }
            "
          >
            <v-icon class="mr-1 pl-2">mdi-delete</v-icon>
            Ya, Hapus
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Export Filter -->
    <v-dialog
      v-model="dialogs.exportFilter.model"
      content-class="rounded-xl"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          Export Filter
          <v-divider class="mx-2"></v-divider>
          <v-icon
            color="red"
            @click="() => (dialogs.exportFilter.model = false)"
            >mdi-close-circle</v-icon
          >
        </v-card-title>
        <v-card-text>
          <v-switch
            v-model="switchExportFilter"
            flat
            :label="`Pindah Model Filter`"
          ></v-switch>
          <v-row v-if="switchExportFilter == false" class="mt-0">
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Tahun Program"
                :items="$_config.programYear.options"
                v-model="dialogs.exportFilter.program_year"
              ></v-autocomplete>
            </v-col>
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Regional Manager"
                :loading="dialogs.exportFilter.filters.rm.loading"
                :item-value="dialogs.exportFilter.filters.rm.itemVal"
                :item-text="dialogs.exportFilter.filters.rm.itemText"
                :items="dialogs.exportFilter.filters.rm.options"
                v-model="dialogs.exportFilter.filters.rm.model"
                :disabled="disabledExportFilterRM"
                @change="($event) => getFiltersOptions('um', $event)"
              ></v-autocomplete>
            </v-col>
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Unit Manager"
                :loading="dialogs.exportFilter.filters.um.loading"
                :item-value="dialogs.exportFilter.filters.um.itemVal"
                :item-text="dialogs.exportFilter.filters.um.itemText"
                :items="dialogs.exportFilter.filters.um.options"
                v-model="dialogs.exportFilter.filters.um.model"
                :disabled="disabledExportFilterUM"
                @change="
                  ($event) => {
                    getFiltersOptions('fc', $event);
                  }
                "
              ></v-autocomplete>
            </v-col>
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Field Coordinator"
                :loading="dialogs.exportFilter.filters.fc.loading"
                :item-value="dialogs.exportFilter.filters.fc.itemVal"
                :item-text="dialogs.exportFilter.filters.fc.itemText"
                :items="dialogs.exportFilter.filters.fc.options"
                v-model="dialogs.exportFilter.filters.fc.model"
                :disabled="disabledExportFilterFC"
                @change="($event) => setFiltersFF('FC', $event)"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row
            v-if="switchExportFilter == true && User.role_group == 'IT'"
            class="mt-0"
          >
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Tahun Program"
                :items="$_config.programYear.options"
                v-model="dialogs.exportFilter.program_year"
              ></v-autocomplete>
            </v-col>
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Management Unit"
                item-value="mu_no"
                item-text="name"
                :loading="dialogs.exportFilter.filters.mu.loading"
                :items="itemsMU"
                v-model="dialogs.exportFilter.filters.mu.model"
                v-on:change="getTA('export')"
              ></v-autocomplete>
            </v-col>
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Target Area"
                item-value="area_code"
                item-text="name"
                :loading="dialogs.exportFilter.filters.ta.loading"
                :items="dialogs.exportFilter.filters.ta.options"
                v-model="dialogs.exportFilter.filters.ta.model"
                v-on:change="getFFbyTA('export')"
              ></v-autocomplete>
            </v-col>
            <!-- <v-col :cols="12">
                <v-autocomplete
                  rounded
                  outlined
                  dense
                  hide-details
                  color="green"
                  item-color="green"
                  :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                  label="Desa"
                  item-value="kode_desa"
                  item-text="name"
                  :loading="dialogs.exportFilter.filters.village.loading"
                  :items="dialogs.exportFilter.filters.village.options"
                  v-model="dialogs.exportFilter.filters.village.model"
                  v-on:change="getFFbyVillage('export')"
                ></v-autocomplete>
              </v-col> -->
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Field Facilitator"
                item-value="ff_no"
                item-text="name"
                :loading="dialogs.exportFilter.filters.ff_area.loading"
                :items="dialogs.exportFilter.filters.ff_area.options"
                v-model="dialogs.exportFilter.filters.ff_area.model"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row
            v-if="
              switchExportFilter == true && User.role_name == 'UNIT MANAGER'
            "
            class="mt-0"
          >
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Tahun Program"
                :items="$_config.programYear.options"
                v-model="dialogs.exportFilter.program_year"
              ></v-autocomplete>
            </v-col>
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Management Unit"
                item-value="mu_no"
                item-text="name"
                :loading="dialogs.exportFilter.filters.mu.loading"
                :items="itemsMU"
                v-model="dialogs.exportFilter.filters.mu.model"
                v-on:change="getTA('export')"
              ></v-autocomplete>
            </v-col>
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Target Area"
                item-value="area_code"
                item-text="name"
                :loading="dialogs.exportFilter.filters.ta.loading"
                :items="dialogs.exportFilter.filters.ta.options"
                v-model="dialogs.exportFilter.filters.ta.model"
                v-on:change="getFFbyTA('export')"
              ></v-autocomplete>
            </v-col>
            <!-- <v-col :cols="12">
                <v-autocomplete
                  rounded
                  outlined
                  dense
                  hide-details
                  color="green"
                  item-color="green"
                  :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                  label="Desa"
                  item-value="kode_desa"
                  item-text="name"
                  :loading="dialogs.exportFilter.filters.village.loading"
                  :items="dialogs.exportFilter.filters.village.options"
                  v-model="dialogs.exportFilter.filters.village.model"
                  v-on:change="getFFbyVillage('export')"
                ></v-autocomplete>
              </v-col> -->
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Field Facilitator"
                item-value="ff_no"
                item-text="name"
                :loading="dialogs.exportFilter.filters.ff_area.loading"
                :items="dialogs.exportFilter.filters.ff_area.options"
                v-model="dialogs.exportFilter.filters.ff_area.model"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-divider class="mx-2"></v-divider>
          <v-hover v-slot="{ hover }">
            <v-btn
              v-if="User.role_group == 'IT' && switchExportFilter == false"
              rounded
              :color="`green ${hover ? 'white--text' : ''}`"
              :outlined="!hover"
              @click="() => exportData()"
              :disabled="
                dialogs.exportFilter.filters.ff.model.length < 1 ||
                dialogs.exportFilter.filters.ff.loading
              "
            >
              <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export</v-btn
            >
          </v-hover>
          <v-hover v-slot="{ hover }">
            <v-btn
              v-if="User.role_group == 'IT'"
              rounded
              :color="`green ${hover ? 'white--text' : ''}`"
              :outlined="!hover"
              @click="exportSimpleDistribution.show = true"
            >
              <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export +
              Distribution</v-btn
            >
          </v-hover>
          <v-hover v-slot="{ hover }">
            <v-btn
              v-if="User.role_group == 'IT' && switchExportFilter == true"
              rounded
              :color="`green ${hover ? 'white--text' : ''}`"
              :outlined="!hover"
              @click="() => exportDataByMU()"
              :disabled="
                dialogs.exportFilter.filters.ta.model < 1 ||
                dialogs.exportFilter.filters.mu.model < 1 ||
                dialogs.exportFilter.filters.ff_area.model < 1 ||
                dialogs.exportFilter.filters.mu.loading
              "
            >
              <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export By
              Area</v-btn
            >
          </v-hover>
          <v-divider class="mx-2"></v-divider>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Export Filter -->
    <v-dialog
      v-model="dialogs.exportFF.model"
      content-class="rounded-xl"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          Export per FF
          <v-divider class="mx-2"></v-divider>
          <v-icon color="red" @click="() => (dialogs.exportFF.model = false)"
            >mdi-close-circle</v-icon
          >
        </v-card-title>
        <v-card-text>
          <v-row class="mt-0">
            <v-col :cols="12">
              <v-autocomplete
                rounded
                outlined
                dense
                hide-details
                color="green"
                item-color="green"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  rounded: 'xl',
                  transition: 'slide-y-transition',
                }"
                label="Field Facilitator"
                item-value="ff_no"
                item-text="name"
                :loading="dialogs.exportFilter.filters.ff_area.loading"
                :items="ff_user"
                v-model="dialogs.exportFilter.filters.ff_area.model"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-divider class="mx-2"></v-divider>
          <v-hover v-slot="{ hover }">
            <v-btn
              rounded
              :color="`green ${hover ? 'white--text' : ''}`"
              :outlined="!hover"
              @click="exportDataByMU()"
              :disabled="dialogs.exportFilter.filters.ff_area.model < 1"
            >
              <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export Data
              FF</v-btn
            >
          </v-hover>
          <v-divider class="mx-2"></v-divider>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END: MODAL -->

    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      :headers="
        generalSettings.landProgram.model == 'Petani' ? headers : headers2
      "
      :items="dataobject"
      :search="search"
      :loading="loadtable"
      :options.sync="pagination.options"
      :server-items-length="pagination.total"
      v-model="listMonitoring1Checked"
      :show-select="populateDataSwitch"
      :page="pagination.current_page"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1"
      multi-sort
      :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman',
        itemsPerPageOptions: [10, 20, 30, 40, 100, 200],
        showCurrentPage: true,
        showFirstLastPage: true,
      }"
    >
      <template v-slot:item.data-table-select="{ isSelected, select }">
        <v-simple-checkbox
          color="success"
          v-ripple
          :value="isSelected"
          @input="select($event)"
        ></v-simple-checkbox>
      </template>
      <template v-slot:top>
        <v-row class="ma-0 mt-2 mr-2 align-center">
          <v-menu
            offset-y
            content-class="rounded-xl"
            v-if="
              generalSettings.landProgram.model == 'Petani' &&
              (User.role_group == 'IT' ||
                User.role_name == 'PROGRAM MANAGER' ||
                User.role_name == 'REGIONAL MANAGER' ||
                User.role_name == 'UNIT MANAGER' ||
                User.role_name == 'PLANNING MANAGER')
            "
          >
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                rounded
                color="warning white--text"
                class="d-none d-md-block ml-2"
              >
                <v-icon class="mr-1">mdi-filter</v-icon>
                Filter
              </v-btn>
            </template>
            <v-card
              class="d-flex flex-column align-stretch justify-center pa-2 py-3"
            >
              <v-btn
                dark
                rounded
                class="mx-1 d-none d-md-block mb-2"
                @click="showFilterArea()"
                color="green"
              >
                <v-icon class="mx-2" small>mdi-filter-variant</v-icon> Filter
                Berdasarkan Area
              </v-btn>
              <v-btn
                v-if="RoleAccesFilterShow == true"
                dark
                rounded
                class="mx-1 d-none d-md-block"
                @click="showFilterEmployee()"
                color="green"
              >
                <v-icon class="mx-2" small>mdi-image-filter-none</v-icon> Filter
                Berdasarkan Karyawan
              </v-btn>
              <v-switch
                v-if="
                  User.role_group == 'IT' ||
                  User.role_name == 'PLANNING MANAGER'
                "
                v-model="populateDataSwitch"
                label="Melakukan Populate Data Ke Monitoring 2?"
                inset
                color="orange"
                hide-details
              ></v-switch>
            </v-card>
          </v-menu>
          <!-- Program Year -->
          <v-select
            color="success"
            item-color="success"
            v-model="generalSettings.programYear"
            :items="$_config.programYear.options"
            outlined
            dense
            hide-details
            :menu-props="{
              bottom: true,
              offsetY: true,
              rounded: 'xl',
              transition: 'slide-y-transition',
            }"
            rounded
            label="Tahun Program"
            class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
            style="max-width: 200px"
          ></v-select>
          <!-- Land Program -->
          <v-select
            color="success"
            item-color="success"
            v-model="generalSettings.landProgram.model"
            :items="generalSettings.landProgram.items"
            outlined
            dense
            hide-details
            :menu-props="{
              bottom: true,
              offsetY: true,
              rounded: 'xl',
              transition: 'slide-y-transition',
            }"
            rounded
            :label="generalSettings.landProgram.label"
            class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
            style="max-width: 200px"
          ></v-select>
          <v-select
            v-if="User.role_group == 'IT'"
            color="success"
            item-color="success"
            v-model="pagination.current_page"
            :items="pagination.page_options"
            outlined
            dense
            hide-details
            :menu-props="{
              bottom: true,
              offsetY: true,
              rounded: 'xl',
              transition: 'slide-y-transition',
            }"
            rounded
            label="Page"
            class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
            style="max-width: 200px"
          ></v-select>
          <v-divider class="mx-2 d-none d-md-block"></v-divider>
          <!-- Select Search Field -->
          <v-select
            color="success"
            item-color="success"
            v-model="pagination.search.field"
            :items="pagination.search.options.column"
            item-value="value"
            item-text="text"
            hide-details
            outlined
            dense
            :menu-props="{
              bottom: true,
              offsetY: true,
              rounded: 'xl',
              transition: 'slide-y-transition',
            }"
            rounded
            label="Kolom Filter"
            class="centered-select"
            style="
              width: 50%;
              max-width: 130px;
              border-top-right-radius: 0px;
              border-bottom-right-radius: 0px;
            "
          ></v-select>
          <!-- Search Input -->
          <v-text-field
            v-if="pagination.search.field != 'is_validate'"
            color="success"
            item-color="success"
            v-model="pagination.search.value"
            append-icon="mdi-magnify"
            outlined
            dense
            rounded
            label="Pencarian"
            hide-details
            style="
              border-top-left-radius: 0px;
              border-bottom-left-radius: 0px;
              max-width: 200px;
            "
            :loading="pagination.search.options.column_loading"
          ></v-text-field>
          <v-select
            v-else
            color="success"
            item-color="success"
            v-model="pagination.search.value"
            :items="
              pagination.search.options[
                generalSettings.landProgram.model == 'Petani'
                  ? 'validation'
                  : 'validation2'
              ]
            "
            item-value="value"
            item-text="text"
            hide-details
            outlined
            dense
            :menu-props="{
              bottom: true,
              offsetY: true,
              rounded: 'xl',
              transition: 'slide-y-transition',
            }"
            rounded
            label="Status"
            class="centered-select"
            style="border-top-left-radius: 0px; border-bottom-left-radius: 0px"
          ></v-select>
          <v-btn
            v-if="
              User.role_group == 'IT' &&
              generalSettings.landProgram.model == 'Petani'
            "
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="
              () => {
                openExportFilter();
              }
            "
            :disabled="loadtable"
            color="info white--text"
          >
            <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export
          </v-btn>
          <v-btn
            v-if="
              (User.role_group == 'IT' || User.role_name == 'UNIT MANAGER') &&
              generalSettings.landProgram.model == 'Petani'
            "
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="dialogs.exportFF.model = true"
            :disabled="loadtable"
            color="info white--text"
          >
            <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export Per-FF
          </v-btn>
          <v-btn
            v-if="
              User.role_group == 'IT' &&
              generalSettings.landProgram.model == 'Umum'
            "
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="
              () => {
                exportLahanUmum();
              }
            "
            :disabled="loadtable"
            color="info white--text"
          >
            <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export
          </v-btn>
          <v-btn
            v-if="
              generalSettings.landProgram.model == 'Umum' &&
              (User.role_group == 'IT' ||
                User.role_name == 'FIELD COORDINATOR' ||
                User.name == 'UNIT MANAGER')
            "
            dark
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1 mt-lg-0"
            @click="showAddModal()"
            color="green"
          >
            <v-icon small>mdi-plus</v-icon> Add
          </v-btn>
        </v-row>
        <v-row
          class="pb-4 px-2"
          v-if="
            (populateDataSwitch == true &&
              !valueTA == '' &&
              User.role_group == 'IT') ||
            User.role_name == 'PLANNING MANAGER'
          "
        >
          <v-col cols="12" lg="4">
            <h4>
              Jumlah Lahan Terpilih Untuk Monitoring 2:
              {{
                listMonitoring1Checked.reduce((acc, val) => {
                  return acc + parseInt(val.kayu_hidup + val.mpts_hidup);
                }, 0)
              }}
              / {{ totalDatas }}
            </h4>
          </v-col>
          <v-col cols="12" lg="4">
            <h4>
              Persentase Lahan Terpilih Untuk Monitoring 2:
              {{
                percentageFormat(
                  listMonitoring1Checked.reduce((acc, val) => {
                    return acc + parseInt(val.kayu_hidup + val.mpts_hidup);
                  }, 0) + total_populated,
                  totalDatas
                )
              }}%
            </h4>
          </v-col>
          <v-select
            v-if="
              User.role_group == 'IT' || User.role_name == 'PLANNING MANAGER'
            "
            v-model="populateModalSwitch"
            :items="populateSwitchItem"
            item-text="text"
            item-value="value"
            label="Modul Populate Monitoring"
            outlined
            dense
            hide-details
            :menu-props="{
              bottom: true,
              offsetY: true,
              rounded: 'xl',
              transition: 'slide-y-transition',
            }"
            rounded
            class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
            style="max-width: 400px"
          ></v-select>
          <v-btn
            v-if="
              User.role_group == 'IT' ||
              (User.role_name == 'PLANNING MANAGER' &&
                generalSettings.programYear == '2023')
            "
            rounded
            class="mx-auto mx-lg-0 ml-lg-2 mt-1"
            @click="pushPopulateData()"
            :disabled="listMonitoring1Checked.length <= 0"
            color="green white--text"
          >
            <v-icon class="mr-1">mdi-arrow-collapse-right</v-icon> Populate Data
          </v-btn>
        </v-row>
      </template>

      <!-- index column -->
      <template v-slot:item.index="{ item, index }">
        <span v-if="loadtable == false">
          {{ index + 1 + (pagination.current_page - 1) * pagination.per_page }}
        </span>
      </template>

      <!-- No Lahan Column -->
      <template v-slot:item.lahan_no="{ item }">
        <v-chip
          v-if="lahanNoFormat(item.lahan_no).length < 2"
          class="green white--text ma-1"
        >
          {{ lahanNoFormat(item.lahan_no)[0] }}
        </v-chip>
        <v-menu
          v-else
          open-on-hover
          offset-x
          :close-on-content-click="false"
          content-class="rounded-xl"
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              rounded
              small
              v-bind="attrs"
              v-on="on"
              :color="`green darken-${
                lahanNoFormat(item.lahan_no).length - 1 < 5
                  ? lahanNoFormat(item.lahan_no).length - 1
                  : 4
              } white--text`"
            >
              {{ lahanNoFormat(item.lahan_no).length }} Lahan
            </v-btn>
          </template>
          <v-card class="pa-2 pb-1 d-flex flex-column">
            <v-chip
              v-for="(lahan, lahanIndex) in lahanNoFormat(item.lahan_no)"
              :key="lahanIndex"
              color="green white--text"
              class="mb-1"
              style="cursor: auto"
            >
              {{ lahan }}
            </v-chip>
          </v-card>
        </v-menu>
      </template>
      <template v-slot:item.start_monitoring_period="{ item }">
        <v-chip class="green white--text ma-1">
          <v-icon class="white--text ma-1">mdi-clock-check</v-icon>
          {{ item.start_monitoring_period }}
        </v-chip>
      </template>
      <template v-slot:item.end_monitoring_period="{ item }">
        <v-chip class="orange white--text ma-1">
          <v-icon class="white--text ma-1">mdi-clock-alert</v-icon>
          {{ item.end_monitoring_period }}
        </v-chip>
      </template>
      <!-- Lahan Condition Column -->
      <template v-slot:item.lahan_condition="{ item }">
        <span style="text-transform: capitalize">
          {{
            item.lahan_condition ? item.lahan_condition.replace("_", " ") : "-"
          }}
        </span>
      </template>

      <!-- KAYU Column -->
      <template v-slot:item.kayu_hidup="{ item }">
        <v-row class="ma-0">
          <v-col
            cols="4"
            class="pa-0 ma-0 d-flex flex-column align-center justify-center"
          >
            <small class="">HIDUP</small>
            <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
            <strong>{{ item.kayu_hidup }}</strong>
          </v-col>
          <v-col
            cols="4"
            class="pa-0 px-4 ma-0 d-flex flex-column align-center justify-center"
          >
            <small class="">MATI</small>
            <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
            <strong>{{ item.kayu_mati }}</strong>
          </v-col>
          <v-col
            cols="4"
            class="pa-0 ma-0 d-flex flex-column align-center justify-center"
          >
            <small v-if="item.kayu_hilang < -1">LAHAN LAIN</small>
            <small v-else-if="item.kayu_hilang >= 0">HILANG</small>
            <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
            <strong>{{ item.kayu_hilang }}</strong>
          </v-col>
        </v-row>
      </template>

      <!-- MPTS Column -->
      <template v-slot:item.mpts_hidup="{ item }">
        <v-row class="ma-0">
          <v-col
            cols="4"
            class="pa-0 ma-0 d-flex flex-column align-center justify-center"
          >
            <small class="">HIDUP</small>
            <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
            <strong>{{ item.mpts_hidup }}</strong>
          </v-col>
          <v-col
            cols="4"
            class="pa-0 px-4 ma-0 d-flex flex-column align-center justify-center"
          >
            <small class="">MATI</small>
            <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
            <strong>{{ item.mpts_mati }}</strong>
          </v-col>
          <v-col
            cols="4"
            class="pa-0 ma-0 d-flex flex-column align-center justify-center"
          >
            <small v-if="item.mpts_hilang < -1">LAHAN LAIN</small>
            <small v-else-if="item.mpts_hilang >= 0">HILANG</small>
            <!-- <v-icon class="mr-1">mdi-sprout</v-icon> -->
            <strong>{{ item.mpts_hilang }}</strong>
          </v-col>
        </v-row>
      </template>

      <!-- Status Column -->
      <template v-slot:item.is_validate="{ item }">
        <v-chip
          :color="
            item.is_validate > 0
              ? `${item.is_validate == 1 ? 'warning' : 'green'}`
              : 'red'
          "
          class="white--text pl-1"
        >
          <v-icon class="mr-1"
            >mdi-{{
              item.is_validate > 0
                ? `${
                    item.is_validate == 2 ? "checkbox-multiple-marked" : "check"
                  }`
                : "close"
            }}-circle</v-icon
          >
          {{
            item.is_validate > 0
              ? `Terverifikasi ${
                  item.is_validate == 1
                    ? generalSettings.landProgram.model == "Petani"
                      ? "FC"
                      : "PIC"
                    : generalSettings.landProgram.model == "Petani"
                    ? "UM"
                    : "RM / PM"
                }`
              : "Belum Terverifikasi"
          }}
        </v-chip>
      </template>
      <!-- Status Populasi Column -->
      <template v-slot:item.is_populate="{ item }">
        <v-chip
          :color="item.is_populated > 0 ? 'green' : 'red'"
          class="white--text pl-1"
        >
          <v-icon class="mr-1"
            >mdi-{{
              item.is_populated > 0
                ? `${
                    item.is_populated == 2
                      ? "checkbox-multiple-marked"
                      : "check"
                  }`
                : "close"
            }}-circle</v-icon
          >
          {{
            item.is_populated > 0 ? `Terpopulasi` : "Belum / Tidak Terpopulasi"
          }}
        </v-chip>
      </template>

      <!-- Action Column -->
      <template v-slot:item.actions="{ item }">
        <v-menu content-class="rounded-xl">
          <template v-slot:activator="{ attrs, on }">
            <v-btn v-bind="attrs" v-on="on" small fab icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-card class="pa-2 d-flex align-stretch flex-column justify-center">
            <v-btn
              color="info white--text"
              rounded
              small
              class="pl-1 d-flex justify-start align-center"
              @click="showDetail(item)"
            >
              <v-icon class="mr-1">mdi-information</v-icon> Detail
            </v-btn>
            <v-btn
              v-if="generalSettings.landProgram.model == 'Umum'"
              :disabled="
                item.is_validate > 0 ||
                (item.is_validate == 0 &&
                  (User.role_name == 'REGIONAL MANAGER' ||
                    User.role_name == 'PROGRAM MANAGER'))
              "
              color="orange white--text"
              rounded
              small
              class="pl-1 mt-1 d-flex justify-start align-center"
              @click="
                () => {
                  showEditUmumModal(item.monitoring_no);
                }
              "
            >
              <v-icon class="mr-1">mdi-pencil-circle</v-icon> Edit
            </v-btn>
            <v-btn
              rounded
              small
              color="red white--text"
              class="mt-1 pl-1 d-flex justify-start align-center"
              v-if="
                item.is_validate > 0 &&
                generalSettings.landProgram.model == 'Petani' &&
                (User.role_group == 'IT' ||
                  (item.is_validate <= 2 && User.role_name == 'UNIT MANAGER') ||
                  (item.is_validate == 2 &&
                    User.role_name == 'REGIONAL MANAGER'))
              "
              @click="showUnverifModal(item)"
            >
              <v-icon class="mr-1 pl-2">mdi-undo</v-icon> Unverif
            </v-btn>
            <v-btn
              v-else-if="
                item.is_validate > 0 &&
                generalSettings.landProgram.model == 'Umum'
              "
              :disabled="
                (item.is_validate == 1 &&
                  User.role_name != 'REGIONAL MANAGER' &&
                  User.role_name != 'PROGRAM MANAGER' &&
                  User.role_group != 'IT') ||
                (item.is_validate == 2 &&
                  User.role_name != 'REGIONAL MANAGER' &&
                  User.role_name != 'PROGRAM MANAGER' &&
                  User.role_group != 'IT')
              "
              rounded
              small
              color="red white--text"
              class="mt-1 pl-1 d-flex justify-start align-center"
              @click="() => showUnverifModal(item)"
            >
              <v-icon class="mr-1 pl-2">mdi-undo</v-icon> Unverif
            </v-btn>
            <v-btn
              rounded
              small
              color="red darken-2 white--text"
              class="mt-1 pl-1 d-flex justify-start align-center"
              @click="() => showDeleteModal(item)"
              :disabled="deleteDisabled(item.is_validate)"
            >
              <v-icon class="mr-1 pl-2">mdi-delete</v-icon> Delete
            </v-btn>
          </v-card>
        </v-menu>
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snackbar"
      :color="colorsnackbar"
      :timeout="timeoutsnackbar"
      rounded="xl"
      class="d-flex"
    >
      <div class="d-flex justify-between">
        <p class="mb-0">
          {{ textsnackbar }}
        </p>
        <v-spacer></v-spacer>
        <v-icon small class="pl-1" @click="snackbar = false"
          >mdi-close-circle</v-icon
        >
      </div>
    </v-snackbar>
  </div>
</template>

<script>
// import ModalFarmer from "./ModalFarmer";
import axios from "axios";
import moment from "moment";
import ExportPenilikanTanam from "@/views/Activity/PenilikanTanam/ExportPenilikanTanam";
import pushPopulatePreview from "@/views/Activity/monitoring2AddIn/populate_preview";
import Swal from "sweetalert2";
// import BaseUrl from "../../services/BaseUrl.js";

import DetailLahanMap from "@/views/Lahan/components/DetailLahanMap";

export default {
  components: {
    DetailLahanMap,
    ExportPenilikanTanam,
    pushPopulatePreview,
  },
  name: "PenilikanTanam",
  authtoken: "",
  data: () => ({
    config: {
      permission: {
        read: 'realisasi-tanam-list'
      }
    },
    generalSettings: {
      programYear: "2022",
      landProgram: {
        items: ["Petani", "Umum"],
        label: "Program Lahan",
        model: "Petani",
      },
    },
    LahanUmumOptionData: [],
    pagination: {
      current_page: 1,
      length_page: 0,
      options: {
        itemsPerPage: 20,
      },
      page_options: [],
      per_page: 20,
      search: {
        field: "",
        options: {
          column: [],
          column_loading: false,
          validation: [
            {
              text: "All",
              value: "",
            },
            {
              text: "Belum Terverifikasi",
              value: 0,
            },
            {
              text: "Terverifikasi FC",
              value: 1,
            },
            {
              text: "Terferifikasi UM",
              value: 2,
            },
          ],
          validation2: [
            {
              text: "All",
              value: "",
            },
            {
              text: "Belum Terverifikasi",
              value: 0,
            },
            {
              text: "Terverifikasi PIC",
              value: 1,
            },
            {
              text: "Terverifikasi RM / PM",
              value: 2,
            },
          ],
        },
        value: "",
      },
      total: 0,
    },
    exportSimpleDistribution: {
      show: false,
      data: [],
    },
    dialogAddLahanUmumPlantPhoto: {
      photoNewName: "",
      model: false,
    },
    dialogFormLahanUmum: {
      confirm: false,
      model: false,
      inputs: {
        //monitoring lahan umum 2023
        selectedMouDatas: {},
        mainDetailDatas: {},
        ktp_no: {
          model: null,
          options: [],
          disabled: false,
        },
        //
        mou_no: {
          model: null,
          options: [],
          disabled: false,
        },
        lahan_no: [],
        land_condition: "",
        adjustment: {
          headers: [
            { text: "No", value: "no", align: "center", sortable: false },
            { text: "Category", value: "tree_category", align: "center" },
            { text: "Name", value: "tree_name" },
            { text: "Received", value: "total_tree_received" },
            {
              text: "Planted",
              value: "planted",
              align: "center",
              sortable: false,
            },
            {
              text: "Unplanted",
              value: "unplanted",
              align: "center",
              sortable: false,
            },
            { text: "Lost", value: "lost", align: "center", sortable: true },
          ],
          items: [],
          loading: false,
          totalAdjustment: 0,
        },
        photoPerjenis: {
          model: null,
          preview: null,
        },
        photo1: {
          model: null,
          preview: null,
        },
        photo2: {
          model: null,
          preview: null,
        },
        photo3: {
          model: null,
          preview: null,
        },
        planting_date: {
          datepicker: {
            show: false,
            key: 84846,
          },
          label: "Planting Date",
          model: "",
        },
        qty_std: 0,
      },
      loading: false,
    },
    dialogs: {
      exportFF: {
        model: false,
      },
      exportFilter: {
        program_year: "2021",
        model: false,
        filters: {
          rm: {
            itemVal: "nik",
            itemText: "name",
            loading: false,
            model: "",
            options: [],
          },
          um: {
            itemVal: "nik",
            itemText: "name",
            loading: false,
            model: "",
            options: [],
          },
          fc: {
            itemVal: "nik",
            itemText: "name",
            loading: false,
            model: "",
            options: [],
          },
          ff: {
            loading: false,
            model: [],
          },
          mu: {
            itemVal: "mu_no",
            itemText: "name",
            loading: false,
            model: "",
            options: [],
          },
          ta: {
            itemVal: "ta_no",
            itemText: "name",
            loading: false,
            model: "",
            options: [],
          },
          village: {
            itemVal: "village_no",
            itemText: "name",
            loading: false,
            model: "",
            options: [],
          },
          ff_area: {
            itemVal: "village_no",
            itemText: "name",
            loading: false,
            model: "",
            options: [],
          },
        },
      },
    },
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
        text: "Realisasi Tanam",
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
    dialogUnverif: false,
    dialogDetail: false,
    dialogFilterArea: false,

    plantPhotoDialog: false,
    plantPhotoRoute: "",
    plantDescription: "",
    refreshPlantPhotoRoute: "",
    plantTreeCode: "",
    plantCondition: "",
    mo_no: "",
    plantCondition: "",

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
    formTitle: "Tambah Data",
    value: "add",
    search: "",
    type: "",
    headers: [
      {
        text: "No",
        value: "index",
        align: "center",
        width: "2%",
        sortable: false,
      },
      { text: "MU", value: "mu_name", search: true },
      { text: "Target Area", value: "ta_name", search: true },
      { text: "FF", value: "nama_ff", search: true },
      { text: "Petani", value: "nama_petani", search: true },
      {
        text: "Nomor Lahan",
        align: "start",
        value: "lahan_no",
        sortable: false,
        search: true,
      },
      { text: "Bibit", value: "qty_std", align: "center", sortable: false },
      { text: "KAYU", value: "kayu_hidup", align: "center", sortable: false },
      { text: "MPTS", value: "mpts_hidup", align: "center", sortable: false },
      {
        text: "Awal Waktu Monitoring",
        value: "start_monitoring_period",
        align: "center",
        search: true,
      },
      {
        text: "Akhir Waktu Monitoring",
        value: "end_monitoring_period",
        align: "center",
        search: true,
      },
      { text: "Status", value: "is_validate", align: "center", search: true },
      {
        text: "Status Populasi",
        value: "is_populate",
        align: "center",
        search: true,
      },
      { text: "Actions", value: "actions", align: "right", sortable: false },
    ],
    headers2: [
      { text: "MU", value: "mu_name", search: true },
      { text: "MoU No", value: "mou_no", search: true },
      { text: "Monitoring No", value: "monitoring_no" },
      // { text: "KTP No", value: "ktp_no", search: true }, 2022 and below
      { text: "PIC T4T", value: "pic_t4t_name", search: true },
      { text: "PIC Lahan", value: "pic_lahan_name", search: true },
      {
        text: "No Lahan",
        align: "start",
        value: "lahan_no",
        sortable: false,
        search: true,
      },
      { text: "Kondisi", value: "lahan_condition" },
      { text: "Status", value: "is_validate", align: "center", search: true },
      { text: "Actions", value: "actions", align: "right", sortable: false },
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
      { text: "Tanggal Tanam", value: "planting_date", width: "25%" },
      { text: "Actions", value: "actions", sortable: false, width: "10%" },
    ],
    DetailTreesLahanTemp: [],
    dataobject: [],
    populateModalSwitch: 0,
    populateSwitchItem: [
      { text: "Populate Untuk Monitoring 2", value: 0 },
      { text: "Populate Untuk Monitoring 3", value: 1 },
      { text: "Populate Untuk Monitoring 4", value: 2 },
    ],
    populateDataSwitch: false,
    listMonitoring1Checked: [],
    totalDatas: 0,
    total_populated: 0,
    livingTreeTotal: 0,
    monitoringCheckedPercentages: 0,
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
      qty_std: "",
      validate_by: "",
      validate_name: "",
      is_validate: "",
      user_id: "",
      nama_ff: "",
      user_id: "FF000001",
      nama_petani: "",
      waitingapproval: false,

      fotoJenis_Tanam_Hidup: "",
      fotoJenis_Tanam_Mati: "",
      fotoJenis_blmTanam_Hidup: "",
      fotoJenis_blmTanam_Mati: "",
      fotoJenis_blmTanam_Hilang: "",

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
    dialogVerificationUM: false,
    fc_no_global: "",
    typegetdata: "",

    switchExportFilter: false,

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
    dialogDelete: false,
    ff_user: [],
  }),
  computed: {
    disabledEditSeedInDetailModal() {
      let User = this.User;
      let defaultItem = this.defaultItem;
      if (User.role_group != "IT") {
        if (this.generalSettings.landProgram.model == "Petani") {
          if (
            (User.role_name == "FIELD FACILITATOR" &&
              defaultItem.is_validate > 0) ||
            (User.role_name == "UNIT MANAGER" &&
              defaultItem.is_validate != 1) ||
            defaultItem.is_validate == 2
          )
            return true;
          else return false;
        } else {
          if (
            (User.role_name != "PROGRAM MANAGER" &&
              User.role_name != "REGIONAL MANAGER" &&
              defaultItem.is_verified == 1) ||
            ((User.role_name == "PROGRAM MANAGER" ||
              User.role_name == "REGIONAL MANAGER") &&
              defaultItem.is_verified == 0) ||
            defaultItem.is_verified == 2
          )
            return true;
          else return false;
        }
      } else return false;
    },
    disabledExportFilterRM() {
      const user = this.User;
      let status = false;
      const disabledPositions = [
        "REGIONAL MANAGER",
        "UNIT MANAGER",
        "NURSERY",
        "NURSERY MANAGER",
      ];
      if (disabledPositions.includes(user.role_name)) status = true;
      return status;
    },
    disabledExportFilterUM() {
      const filters = this.dialogs.exportFilter.filters;
      const user = this.User;
      let status = false;
      if (!filters.rm.model) status = true;
      if (user.role_name == "UNIT MANAGER") status = true;
      return status;
    },
    disabledExportFilterFC() {
      const filters = this.dialogs.exportFilter.filters;
      let status = false;
      if (!filters.um.model) status = true;
      return status;
    },
    whatTodoTextExport() {
      const filters = this.dialogs.exportFilter.filters;
      let text = "Select Regional Manager.";
      if (filters.rm.model) text = "Select Unit Manager.";
      if (filters.um.model) text = "Select Field Coordinator.";
      if (filters.fc.model)
        text = filters.ff.model.length + " Field Facilitator";
      if (filters.ff.loading) text = "Getting FF datas...";
      return text;
    },
  },
  async mounted() {
    await this.firstAccessPage();

    const taskForceEmails = this.$store.state.taskForceTeam.emails || [];

    // if (this.User.role_group != 'IT' && taskForceEmails.includes(this.User.email) == false) {
    // if (this.User.role_group != 'IT') {
    //   this.$store.state.maintenanceOverlay = true
    // }
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false;

    this.$store.state.loadingOverlay = false;
    this.$store.state.loadingOverlayText = null;
  },

  watch: {
    "dialogFormLahanUmum.inputs.qty_std": {
      async handler(val) {
        if (val) {
          let sumTreesLife = 0;
          await this.dialogFormLahanUmum.inputs.adjustment.items.map((tree) => {
            sumTreesLife += parseInt(tree.total_tree_planted_life);
          });
          if (val > sumTreesLife) {
            alert(`Ur total trees PLANTED and LIFE is just ${sumTreesLife}!`);
            this.dialogFormLahanUmum.inputs.qty_std = sumTreesLife;
          } else if (val < 0) this.dialogFormLahanUmum.inputs.qty_std = 0;
        } else this.dialogFormLahanUmum.inputs.qty_std = 0;
      },
    },
    "generalSettings.programYear": {
      handler(newVal) {
        this.initialize();
      },
    },
    "generalSettings.landProgram.model": {
      handler() {
        this.dataobject = [];
        this.pagination.search.field = "";
        this.pagination.search.value = "";
        this.initialize();
      },
    },
    "pagination.options": {
      handler(newValue) {
        let { page, itemsPerPage, sortBy } = newValue;
        this.pagination.current_page = page;
        this.pagination.per_page = itemsPerPage;
        this.initialize();
      },
      deep: true,
    },
    "pagination.search.value": {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },

  methods: {
    deleteDisabled(is_validate) {
      const program = this.generalSettings.landProgram.model;
      const role_group = this.User.role_group;
      const role_name = this.User.role_name;
      let status = false;
      if (role_group == "IT") status = false;
      else if (program == "Petani") {
        if (is_validate == 1 && role_name == "FIELD FACILITATOR") status = true;
        if (is_validate == 2 && role_name == "UNIT MANAGER") status = true;
      } else if (program == "Umum") {
        if (
          is_validate == 1 &&
          role_group != "IT" &&
          role_name != "REGIONAL MANAGER" &&
          role_name != "PROGRAM MANAGER"
        )
          status = true;
      }

      if (program == "Umum") {
        status = true;
      }
      return status;
    },
    firstAccessPage() {
      this.program_year = this.$_config.programYear.options
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata =
        this.User.ff.value_data == "-" ? "all" : this.User.ff.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.BaseUrl = localStorage.getItem("BaseUrl");
      this.employee_no = this.User.employee_no;
      this.generalSettings.programYear = this.$store.state.programYear.model;
      // this.fc_no_global = this.User.fc.fc;
      this.checkRoleAccess();
      this.initialize();
      this.getMU();
      //   this.getEthnic();
      //   this.getJob();
      this.getFF();
      this.getUMAll();
      this.getTrees();
      this.openExportPerFF(this.User.ff.ff);
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
    percentageFormat(partial, total) {
      this.monitoringCheckedPercentages = ((partial * 100) / total).toFixed(1);
      return ((partial * 100) / total).toFixed(1);
    },
    getColorStatus(status) {
      if (status == "Belum Verifikasi") return "red";
      else return "green";
    },
    async pushPopulateData() {
      var url = "";
      var alertText = "";
      if (this.populateModalSwitch == 0) {
        url = "AddMonitoring1Populate";
        alertText = "Untuk Monitoring 2?";
      } else if (this.populateModalSwitch == 1) {
        url = "AddMonitoring1PopulateTo2";
        alertText = "Untuk Monitoring 3?";
      } else if (this.populateModalSwitch == 2) {
        url = "AddMonitoring1PopulateTo3";
        alertText = "Untuk Monitoring 4?";
      }
      const confirmation = await Swal.fire({
        title: `Apa Anda Yakin Untuk Melakukan Populasi Data ${alertText}`,
        text: "Proses Tidak Dapat Dikembalikan!",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Okay",
        showCancelButton: true,
      });
      if (confirmation.isConfirmed) {
        const pushParams = {
          // list_monitoring1ID: this.listMonitoring1Checked.map(val => {
          //   return val.monitoring_no
          // }),

          list_monitoring1: this.listMonitoring1Checked,
        };
        console.log(url);

        try {
          const response = await this.$_api.post(url, pushParams);
          if (response.data.result == "success") {
            this.listMonitoring1Checked = [];
            this.totalDatas = 0;
            this.$router.push("populateDataMonitoring1");
            this.initialize();
          } else {
            this.listMonitoring1Checked = [];
            this.totalDatas = 0;
            this.loadtable = false;
          }
        } catch (error) {
          console.error(error.response);
          this.loadtable = false;
        }

        this.listMonitoring1Checked = [];
        this.totalDatas = 0;
        this.initialize();
        this.loadtable = false;
      }
    },
    async getSeedDetailFromDistributionAdjustment(mou_no, existingData = null) {
      var ktp_fc = this.dialogFormLahanUmum.inputs.mou_no.options.filter(
        (v) => {
          return v.mou_no.includes(mou_no);
        }
      );
      this.dialogFormLahanUmum.inputs.selectedMouDatas = ktp_fc[0];
      if (mou_no) {
        try {
          this.dialogFormLahanUmum.inputs.adjustment.loading = true;
          var url = "";
          var auth = "";
          if (this.generalSettings.programYear == "2023") {
            url = `https://backend.geninelabs.live/api/custom/reportGecko?program_year=${this.generalSettings.programYear}&&ff_no=${this.dialogFormLahanUmum.inputs.selectedMouDatas.ktp_no}`;
            auth = {
              headers: {
                Authorization:
                  `Bearer ` +
                  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTY5NjMxNzExMiwiZXhwIjoxNzI3NDIxMTEyLCJuYmYiOjE2OTYzMTcxMTIsImp0aSI6IkNzSHRmb0ltOFMzdnNKRUgiLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.5yw7p18qzA4VLVi6Ea0ToA5NO90vgUOsE46uZrHhdBw",
              },
            };
          } else {
            url = `${this.BaseUrlGet}GetUmumDistributionDetailReport?distribution_no=D-${this.generalSettings.programYear}-${mou_no}`;
            auth = this.$store.state.apiConfig;
          }
          const res = await this.$_api.get(url);
          var datas = "";

          // push data from nursery
          if (this.generalSettings.programYear == "2023") {
            datas = res.data.detail_farmers[0].detail_seed_farmers;

            let listLahan = this.LahanUmumOptionData.filter((val) => {
              return val.mou_no.includes(mou_no);
            });
            listLahan = listLahan[0].lahanNo;
            let listTrees = [];

            await datas.forEach((adj, adjIndex) => {
              // let checkExistLahanNo = listLahan.includes(adj.lahan_no)
              // if (!checkExistLahanNo) listLahan.push(adj.lahan_no)
              const pushData = {
                tree_code: adj.tree_code,
                tree_category: adj.tree_category,
                tree_name: adj.rel_tree_id,
                total_tree_received: parseInt(adj.total_received),
                total_tree_planted_life: 0,
                total_tree_planted_dead: 0,
                total_tree_unplanted_life: 0,
                total_tree_unplanted_dead: 0,
                lost: parseInt(adj.total_missing),
              };
              const indexTreee = listTrees.findIndex(
                (tr) => tr.tree_code === adj.tree_code
              );
              if (indexTreee > -1) {
                listTrees[indexTreee].total_tree_received += parseInt(
                  adj.total_tree_received
                );
                listTrees[indexTreee].lost += parseInt(adj.total_missing);
              } else listTrees.push(pushData);
            });
            this.dialogFormLahanUmum.inputs.lahan_no = await listLahan;
            this.dialogFormLahanUmum.inputs.adjustment.items = await listTrees;

            if (existingData) {
              await existingData.map((exData) => {
                let adjIndexEx =
                  this.dialogFormLahanUmum.inputs.adjustment.items.findIndex(
                    (adjItems) => adjItems.tree_code == exData.tree_code
                  );
                if (
                  exData.status == "sudah_ditanam" &&
                  exData.condition == "hidup"
                )
                  this.dialogFormLahanUmum.inputs.adjustment.items[
                    adjIndexEx
                  ].total_tree_planted_life += parseInt(exData.amount);
                else if (
                  exData.status == "sudah_ditanam" &&
                  exData.condition == "mati"
                )
                  this.dialogFormLahanUmum.inputs.adjustment.items[
                    adjIndexEx
                  ].total_tree_planted_dead += parseInt(exData.amount);
                else if (
                  exData.status == "belum_ditanam" &&
                  exData.condition == "hidup"
                )
                  this.dialogFormLahanUmum.inputs.adjustment.items[
                    adjIndexEx
                  ].total_tree_unplanted_life += parseInt(exData.amount);
                else if (
                  exData.status == "belum_ditanam" &&
                  exData.condition == "mati"
                )
                  this.dialogFormLahanUmum.inputs.adjustment.items[
                    adjIndexEx
                  ].total_tree_unplanted_dead += parseInt(exData.amount);
              });
              await this.updateSeedlingAdjustment();
            }
            //push data from geko
          } else {
            datas = res.data.result;
            let listLahan = [];
            let listTrees = [];
            await datas.distributionAdjustment.forEach((adj, adjIndex) => {
              let checkExistLahanNo = listLahan.includes(adj.lahan_no);
              if (!checkExistLahanNo) listLahan.push(adj.lahan_no);

              const pushData = {
                tree_code: adj.tree_code,
                tree_category: adj.tree_category,
                tree_name: adj.tree_name,
                total_tree_received: parseInt(adj.total_tree_received),
                total_tree_planted_life: 0,
                total_tree_planted_dead: 0,
                total_tree_unplanted_life: 0,
                total_tree_unplanted_dead: 0,
                lost: parseInt(adj.total_tree_received),
              };
              const indexTreee = listTrees.findIndex(
                (tr) => tr.tree_code === adj.tree_code
              );
              if (indexTreee > -1) {
                listTrees[indexTreee].total_tree_received += parseInt(
                  adj.total_tree_received
                );
                listTrees[indexTreee].lost += parseInt(adj.total_tree_received);
              } else listTrees.push(pushData);
            });
            this.dialogFormLahanUmum.inputs.lahan_no = await listLahan;
            this.dialogFormLahanUmum.inputs.adjustment.items = await listTrees;
            if (existingData) {
              await existingData.map((exData) => {
                let adjIndexEx =
                  this.dialogFormLahanUmum.inputs.adjustment.items.findIndex(
                    (adjItems) => adjItems.tree_code == exData.tree_code
                  );
                if (
                  exData.status == "sudah_ditanam" &&
                  exData.condition == "hidup"
                )
                  this.dialogFormLahanUmum.inputs.adjustment.items[
                    adjIndexEx
                  ].total_tree_planted_life += parseInt(exData.amount);
                else if (
                  exData.status == "sudah_ditanam" &&
                  exData.condition == "mati"
                )
                  this.dialogFormLahanUmum.inputs.adjustment.items[
                    adjIndexEx
                  ].total_tree_planted_dead += parseInt(exData.amount);
                else if (
                  exData.status == "belum_ditanam" &&
                  exData.condition == "hidup"
                )
                  this.dialogFormLahanUmum.inputs.adjustment.items[
                    adjIndexEx
                  ].total_tree_unplanted_life += parseInt(exData.amount);
                else if (
                  exData.status == "belum_ditanam" &&
                  exData.condition == "mati"
                )
                  this.dialogFormLahanUmum.inputs.adjustment.items[
                    adjIndexEx
                  ].total_tree_unplanted_dead += parseInt(exData.amount);
              });
              await this.updateSeedlingAdjustment();
            }
          }
        } catch (err) {
          this.dialogFormLahanUmum.inputs.adjustment.items = [];
          if (err.response == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        } finally {
          this.dialogFormLahanUmum.inputs.adjustment.loading = false;
        }
      } else this.dialogFormLahanUmum.inputs.adjustment.items = [];
    },
    async getLahanUmumDataOptions() {
      var lahanUmumUrl = "";
      var resLahanUmum = "";
      var itemLahanUmum = "";
      var itemDistributionNursery = "";
      var url = "";
      var auth = "";
      var existingMonitoringDatas = this.dataobject.map((v) => {
        return v.mou_no;
      });
      try {
        if (this.generalSettings.programYear == "2023") {
          // get list report distribusi lahan umum
          lahanUmumUrl =
            this.BaseUrlGet +
            `GetLahanUmumAllAdmin?program_year=${this.generalSettings.programYear}`;
          resLahanUmum = await this.$_api.get(lahanUmumUrl);
          this.LahanUmumOptionData = resLahanUmum.data.result;

          // get list ktp lahan umum
          url = "https://api-nursery.t4t-api.org/api/public/list?";
          auth = {
            headers: {
              Authorization:
                `Bearer ` +
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTY5NjMxNzExMiwiZXhwIjoxNzI3NDIxMTEyLCJuYmYiOjE2OTYzMTcxMTIsImp0aSI6IkNzSHRmb0ltOFMzdnNKRUgiLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.5yw7p18qzA4VLVi6Ea0ToA5NO90vgUOsE46uZrHhdBw",
            },
          };
        } else {
          url = this.BaseUrlGet + "GetUmumDistributionAdjustment?";
          auth = this.$store.state.apiConfig;
        }
        const params = {
          limit: 100,
          model: "loading_line",
          status: 2,
          program_year: this.generalSettings.programYear,
        };
        // if (this.User.role_group != 'IT' && this.User.role_name != 'PROGRAM MANAGER' && this.User.role_name != 'REGIONAL MANAGER') {
        //     params.created_by = this.User.email
        // }
        var res = await this.$_api.get(`${url}${new URLSearchParams(params)}`);

        itemDistributionNursery = res.data.map((val) => {
          return val.ff_no;
        });
        if (this.generalSettings.programYear == "2023") {
          var nurseryFilter = this.LahanUmumOptionData.filter((val) => {
            return itemDistributionNursery.includes(val.ktp_no);
            // .includes(filtered)
          });
          this.dialogFormLahanUmum.inputs.mou_no.options = nurseryFilter.filter(
            (val) => {
              return !existingMonitoringDatas.includes(val.mou_no);
            }
          );
        } else {
          this.dialogFormLahanUmum.inputs.mou_no.options = res;
        }
      } catch (err) {
        this.dialogFormLahanUmum.inputs.mou_no.options = [];
        if (err.response != undefined) {
          if (err.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        } else console.log(err);
      } finally {
      }
    },
    async initialize() {
      this.loadtable = true;
      // console.log(this.User.ff.ff);
      try {
        this.loadtable = true;
        this.$store.state.loadingOverlayText = "Getting monitoring datas...";
        this.$store.state.loadingOverlay = true;
        this.dataobject = [];
        this.total_populated = 0;
        this.livingTreeTotal = 0;
        // get search column
        await this.getSearchColumn();

        await this.getTableData().then((data) => {
          this.dataobject = data.items;
          this.pagination.total = data.total;
          if (this.generalSettings.landProgram.model == "Petani") {
            this.total_populated = data.total_populated;
            this.livingTreeTotal = data.total_living_tree;
          }
          this.pagination.current_page = data.current_page;
          this.pagination.length_page = data.last_page;
          if (
            this.populateDataSwitch == true &&
            this.totalDatas == 0 &&
            this.pagination.search.value == "" &&
            !this.valueTA == ""
          ) {
            this.totalDatas = data.total_living_tree + data.total_populated;
          }
          const pageOptions = [];
          for (let index = 1; index <= data.last_page; index++) {
            pageOptions.push(index);
          }
          this.pagination.page_options = pageOptions;
          // console.log(this.pagination)
        });
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
      } finally {
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;
        this.loadtable = false;
      }
    },
    getTableData() {
      return new Promise((resolve, reject) => {
        let url = this.BaseUrlGet;
        let params = {
          program_year: this.generalSettings.programYear,
          // pagination
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          sortBy: this.pagination.options.sortBy || "",
          sortDesc: this.pagination.options.sortDesc || "",

          search_column: this.pagination.search.field || "",
          search_value: this.pagination.search.value || "",
          mu: this.valueMU,
          ta: this.valueTA,
          village: this.valueVillage,
          typegetdata: this.typegetdata,
          ff: this.valueFFcode,
        };
        if (this.generalSettings.landProgram.model == "Petani") {
          // url += "GetMonitoringAdmin?" + new URLSearchParams(params)
          url += "GetExportMonitoringAllAdmin?" + new URLSearchParams(params);
        } else if (this.generalSettings.landProgram.model == "Umum") {
          delete params.ff;
          delete params.ta;
          if (
            this.User.role_group != "IT" &&
            this.User.role_name != "PROGRAM MANAGER" &&
            this.User.role_name != "REGIONAL MANAGER"
          ) {
            params.created_by = this.User.email;
          }
          url += "GetMonitoringLahanUmumAdmin?" + new URLSearchParams(params);
        }
        // get data response
        this.$_api
          .get(url)
          .then((res) => {
            if (typeof res.data.result !== "undefined") {
              if (this.generalSettings.landProgram.model == "Umum") {
                let items = res.data.result.data;
                const total = res.data.result.total;
                const current_page = res.data.result.current_page;
                const last_page = res.data.result.last_page;
                resolve({
                  items,
                  total,
                  current_page,
                  last_page,
                });
              } else {
                let items = res.data.result.datas.data;
                const total = res.data.result.datas.total;
                const total_populated = res.data.result.total_terpopulasi;
                const total_living_tree = res.data.result.total_pohon_hidup;
                const current_page = res.data.result.datas.current_page;
                const last_page = res.data.result.datas.last_page;
                resolve({
                  items,
                  total,
                  total_populated,
                  total_living_tree,
                  current_page,
                  last_page,
                });
              }
              this.exportSimpleDistribution.data = items;
            } else {
              reject("Error");
            }
          })
          .catch((err) => {
            if (err.response == 401) {
              localStorage.removeItem("token");
              this.$router.push("/");
              this.loadtable = false;
            }
            reject(err);
          });
      });
    },
    async getSearchColumn() {
      let headerItems = [];
      let searchOptions = [];
      if (this.generalSettings.landProgram.model == "Petani")
        headerItems = this.headers;
      else if (this.generalSettings.landProgram.model == "Umum")
        headerItems = this.headers2;
      await headerItems.forEach((val) => {
        if (val.search == true) searchOptions.push(val);
      });
      this.pagination.search.options.column = searchOptions;
      if (!this.pagination.search.field)
        this.pagination.search.field = "mu_name";
    },

    async saveLahanUmumPhotoPerjenis(type, file) {
      const confirmation = await Swal.fire({
        title: "Anda Yakin Untuk Update Foto Per-jenis?",
        text: "Proses Tidak Dapat Dikembalikan!",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Okay",
        showCancelButton: true,
      });
      if (confirmation.isConfirmed) {
        this.$store.state.loadingOverlayText = `Saving photo "${type}"...`;
        const url = `${this.BaseUrl}general-lands/upload.php`;
        const newName = `${this.dialogAddLahanUmumPlantPhoto.photoNewName
          .replace(/\s/g, "")
          .replaceAll("/", "_")}_${type}_${this.generalSettings.programYear}`;
        const data = this.generateFormData({
          dir: "first-monitorings/per-type-condition",
          nama: newName,
          image: file,
        });
        console.log(newName);
        let responseName = null;
        await axios
          .post(url, data)
          .then((res) => {
            responseName = res.data.data.new_name;
          })
          .catch((err) => {
            console.error(err);
          });
        await Swal.fire({
          title: "Foto Berhasil Terupdate!",
          icon: "success",
          confirmButtonColor: "#2e7d32",
          confirmButtonText: "Okay",
          showCancelButton: false,
        });
        this.dialogAddLahanUmumPlantPhoto.model = false;
      }
    },

    async saveLahanUmumMonitoring() {
      try {
        this.dialogFormLahanUmum.confirm = false;
        this.dialogFormLahanUmum.model = false;
        this.$store.state.loadingOverlay = true;
        this.$store.state.loadingOverlayText =
          "Saving monitoring lahan umum...";
        let url = `${this.BaseUrlGet}CreateMonitoringLahanUmum`;
        if (this.dialogFormLahanUmum.inputs.mou_no.disabled == true)
          url = `${this.BaseUrlGet}UpdateMonitoringLahanUmum`;
        let dataForPost = {
          program_year: this.generalSettings.programYear,
          mou_no: this.dialogFormLahanUmum.inputs.mou_no.model,
          planting_date: this.dialogFormLahanUmum.inputs.planting_date.model,
          qty_std: this.dialogFormLahanUmum.inputs.qty_std,
          lahan_condition: this.dialogFormLahanUmum.inputs.land_condition,
          created_by: this.User.email,
          list_trees: [],
          lahan_no: this.dialogFormLahanUmum.inputs.lahan_no.toString(),
        };
        // set list trees
        await this.dialogFormLahanUmum.inputs.adjustment.items.forEach(
          (val) => {
            if (parseInt(val.total_tree_planted_life) > 0)
              dataForPost.list_trees.push({
                tree_code: val.tree_code,
                qty: parseInt(val.total_tree_planted_life),
                status: "sudah_ditanam",
                condition: "hidup",
              });
            if (parseInt(val.total_tree_planted_dead) > 0)
              dataForPost.list_trees.push({
                tree_code: val.tree_code,
                qty: parseInt(val.total_tree_planted_dead),
                status: "sudah_ditanam",
                condition: "mati",
              });
            if (parseInt(val.total_tree_unplanted_life) > 0)
              dataForPost.list_trees.push({
                tree_code: val.tree_code,
                qty: parseInt(val.total_tree_unplanted_life),
                status: "belum_ditanam",
                condition: "hidup",
              });
            if (parseInt(val.total_tree_unplanted_dead) > 0)
              dataForPost.list_trees.push({
                tree_code: val.tree_code,
                qty: parseInt(val.total_tree_unplanted_dead),
                status: "belum_ditanam",
                condition: "mati",
              });
            if (parseInt(val.lost) > 0)
              dataForPost.list_trees.push({
                tree_code: val.tree_code,
                qty: parseInt(val.lost),
                status: "hilang",
                condition: "hilang",
              });
          }
        );
        // upload photo 1
        if (this.dialogFormLahanUmum.inputs.photo1.model) {
          const photo1 = await this.uploadPhotos(
            "photo1",
            this.dialogFormLahanUmum.inputs.photo1.model
          );
          dataForPost.photo1 = photo1;
        } else if (this.dialogFormLahanUmum.inputs.photo1.preview) {
          dataForPost.photo1 =
            this.dialogFormLahanUmum.inputs.photo1.preview.replace(
              this.BaseUrl,
              ""
            );
        }
        // upload photo 2
        if (this.dialogFormLahanUmum.inputs.photo2.model) {
          const photo2 = await this.uploadPhotos(
            "photo2",
            this.dialogFormLahanUmum.inputs.photo2.model
          );
          dataForPost.photo2 = photo2;
        } else if (this.dialogFormLahanUmum.inputs.photo2.preview) {
          dataForPost.photo2 =
            this.dialogFormLahanUmum.inputs.photo2.preview.replace(
              this.BaseUrl,
              ""
            );
        }
        // upload photo 3
        if (this.dialogFormLahanUmum.inputs.photo3.model) {
          const photo3 = await this.uploadPhotos(
            "photo3",
            this.dialogFormLahanUmum.inputs.photo3.model
          );
          dataForPost.photo3 = photo3;
        } else if (this.dialogFormLahanUmum.inputs.photo3.preview) {
          dataForPost.photo3 =
            this.dialogFormLahanUmum.inputs.photo3.preview.replace(
              this.BaseUrl,
              ""
            );
        }
        const store = await this.$_api.post(url, dataForPost);
        if (store) {
          this.textsnackbar = "Success store monitoring lahan umum data!";
          this.colorsnackbar = "green";
          this.initialize();
        } else {
          this.textsnackbar = "Failed store monitoring lahan umum data!";
          this.colorsnackbar = "red";
        }
      } catch (err) {
        if (err.response.status == 401) {
          this.textsnackbar = "Unaunthicated!";
          this.colorsnackbar = "red";
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.textsnackbar = err.response.message;
          this.colorsnackbar = "red";
        }
        console.error(err);
      } finally {
        this.timeoutsnackbar = 5000;
        this.snackbar = true;
        this.$store.state.loadingOverlayText = null;
        this.$store.state.loadingOverlay = false;
      }
    },

    async getMU() {
      try {
        const response = await this.$_api.get(
          `GetManagementUnit?program_year=${this.generalSettings.programYear}`
        );
        if (response.length != 0) {
          this.itemsMU = response.data.result.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          // this.dataobject = response.data.result;
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
      this.dialogs.exportFilter.filters.ta.options = [];
      this.dialogs.exportFilter.filters.ta.model = "";
      var valparam = "";
      var valYear = "";
      if (val == "table") {
        valparam = this.valueMU;
        valYear = this.generalSettings.programYear;
      } else if (val == "export") {
        valparam = this.dialogs.exportFilter.filters.mu.model;
        valYear = this.dialogs.exportFilter.program_year;
      } else {
        valparam = this.valueMUForm;
      }
      try {
        const response = await this.$_api.get(
          `GetTargetArea?program_year=${valYear}&mu_no=${valparam}`
        );
        if (response.length != 0) {
          if (val == "table") {
            this.itemsTA = response.data.result;
          } else if (val == "export") {
            this.dialogs.exportFilter.filters.ta.options = response.data.result;
          } else {
            this.itemsTAForm = response.data.result;
          }
          // this.dataobject = response.data.result;
        }
      } catch (error) {
        this.itemsTAForm = [];
        this.itemsTA = [];
        console.error(error.response);

        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getVillage(val) {
      this.dialogs.exportFilter.filters.village.model = "";
      this.dialogs.exportFilter.filters.village.options = [];
      var valparam = "";
      if (val == "table") {
        valparam = this.valueTA;
      } else if (val == "export") {
        valparam = this.dialogs.exportFilter.filters.ta.model;
      } else {
        valparam = this.valueTAForm;
      }
      try {
        const response = await this.$_api.get(
          // this.BaseUrlGet + `GetDesa?program_year=${this.generalSettings.programYear}&kode_ta=${valparam}` ,
          `GetDesa?kode_ta=${valparam}`
        );
        if (response.length != 0) {
          if (val == "table") {
            this.itemsVillage = response.data.result;
          } else if (val == "export") {
            this.dialogs.exportFilter.filters.village.options =
              response.data.result;
          } else {
            this.itemsVillageForm = response.data.result;
          }
          // this.dataobject = response.data.result;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async getFFbyTA(val) {
      this.dialogs.exportFilter.filters.ff_area.model = "";
      this.dialogs.exportFilter.filters.ff_area.options = [];
      var areaParam = "";
      if (val == "table") {
        areaParam = "";
      } else if (val == "export") {
        areaParam = this.dialogs.exportFilter.filters.ta.model;
      } else {
        areaParam = "";
      }
      try {
        const response = await this.$_api.get(
          // this.BaseUrlGet + `GetDesa?program_year=${this.generalSettings.programYear}&kode_ta=${valparam}` ,

          "getFFbyTA?area_code=" +
            this.dialogs.exportFilter.filters.ta.model +
            "&program_year=" +
            this.dialogs.exportFilter.program_year
        );
        if (response.length != 0) {
          if (val == "table") {
            this.dialogs.exportFilter.filters.ff_area.options = "";
          } else if (val == "export") {
            this.dialogs.exportFilter.filters.ff_area.options =
              response.data.result.data;
          } else {
            this.dialogs.exportFilter.filters.ff_area.options =
              response.data.result.data;
          }
          // this.dataobject = response.data.result;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },

    async getFFbyVillage(val) {
      this.dialogs.exportFilter.filters.ff_area.model = "";
      this.dialogs.exportFilter.filters.ff_area.options = [];
      var valparam = "";
      var areaParam = "";
      if (val == "table") {
        valparam = "";
      } else if (val == "export") {
        valparam = this.dialogs.exportFilter.filters.village.model;
        areaParam = this.dialogs.exportFilter.filters.ta.model;
      } else {
        valparam = "";
      }
      try {
        const response = await this.$_api.get.get(
          // this.BaseUrlGet + `GetDesa?program_year=${this.generalSettings.programYear}&kode_ta=${valparam}` ,
          `getFFbyVillage?village_no=${valparam}&&area_code=${areaParam}`
        );
        if (response.length != 0) {
          if (val == "table") {
            this.dialogs.exportFilter.filters.ff_area.options = "";
          } else if (val == "export") {
            this.dialogs.exportFilter.filters.ff_area.options =
              response.data.result.data;
          } else {
            this.dialogs.exportFilter.filters.ff_area.options =
              response.data.result.data;
          }
          // this.dataobject = response.data.data.result;
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
        const response = await this.$_api.get("GetTreesAll");
        if (response.length != 0) {
          this.itemstrees = response.data.result.data;
          // this.dataobject = response.data.result;
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
        const response = await this.$_api.get(
          this.BaseUrlGet + "GetFieldFacilitatorAll?fc_no=" + this.fc_no_global
        );
        if (response.length != 0) {
          this.itemsff = response.data.result.data;
          // this.dataobject = response.data.result;
        }
        this.loaddownload = false;
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
        let urlPrefix = "GetMonitoringDetail?monitoring_no=";
        if (this.generalSettings.landProgram.model == "Umum") {
          urlPrefix = "GetMonitoringDetailLahanUmumAdmin?monitoring_no=";
          if (this.generalSettings.programYear == "2023") {
            var mo_no = String.raw`${item.monitoring_no}`;
          }
        }
        const response = await this.$_api.get(urlPrefix + item.monitoring_no);
        if (response) {
          this.defaultItem = Object.assign({}, response.data.result.data);
          this.defaultItem.list_detail = await this.setGroupingDetailSeedling(
            response.data.result.list_detail
          );
          this.itemlistpohon = response.data.result.list_detail;
          this.max_value_pohon_temp = response.data.result.count_list_pohon;
          this.defaultItem.waitingapproval = this.waitingapprovefunct(
            response.data.result.data.is_validate
          );

          if (response.data.result.data.gambar1 == "-") {
            this.defaultItem.gambarshow1 = "/images/noimage.png";
          } else {
            this.defaultItem.gambarshow1 =
              this.BaseUrl + response.data.result.data.gambar1;
          }
          if (response.data.result.data.gambar2 == "-") {
            this.defaultItem.gambarshow2 = "/images/noimage.png";
          } else {
            this.defaultItem.gambarshow2 =
              this.BaseUrl + response.data.result.data.gambar2;
          }
          if (response.data.result.data.gambar3 == "-") {
            this.defaultItem.gambarshow3 = "/images/noimage.png";
          } else {
            this.defaultItem.gambarshow3 =
              this.BaseUrl + response.data.result.data.gambar3;
          }

          this.load = false;

          if (this.type == "Detail") {
            this.load = false;
          } else {
            this.selectPetani(response.data.result.data.user_id);
            this.defaultItem.farmer_no = response.data.result.data.farmer_no;
            this.selectLahan(response.data.result.data.farmer_no);
            this.defaultItem.lahan_no = response.data.result.data.lahan_no;
            this.selectedLahanNo(response.data.result.data.lahan_no);
            this.datepicker1 = response.data.result.data.planting_date;
          }

          this.load = false;
          //   this.defaultItem.kode = response.data.data.result.farmer_no;
        } else {
          console.log("Kosong");
          this.load = false;
        }
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
          this.load = false;
        }
      }
    },
    async VerificationItemConfirm() {
      try {
        let listTrees = [];
        await this.defaultItem.list_detail.forEach((tree) => {
          if (parseInt(tree.seedling.ditanam.hidup) > 0) {
            listTrees.push({
              monitoring_no: this.defaultItem.monitoring_no,
              tree_code: tree.tree_code,
              qty: parseInt(tree.seedling.ditanam.hidup),
              status: "sudah_ditanam",
              condition: "hidup",
              planting_date: this.defaultItem.planting_date,
              tree_photo: tree.seedling.ditanam.fotoHidup,
              tree_description: "-",
            });
          }
          if (parseInt(tree.seedling.ditanam.mati) > 0) {
            listTrees.push({
              monitoring_no: this.defaultItem.monitoring_no,
              tree_code: tree.tree_code,
              qty: parseInt(tree.seedling.ditanam.mati),
              status: "sudah_ditanam",
              condition: "mati",
              planting_date: this.defaultItem.planting_date,
              tree_photo: tree.seedling.ditanam.fotoMati,
              tree_description: tree.seedling.ditanam.keterangan,
            });
          }
          if (parseInt(tree.seedling.blm_ditanam.hidup) > 0) {
            listTrees.push({
              monitoring_no: this.defaultItem.monitoring_no,
              tree_code: tree.tree_code,
              qty: parseInt(tree.seedling.blm_ditanam.hidup),
              status: "belum_ditanam",
              condition: "hidup",
              planting_date: this.defaultItem.planting_date,
              tree_photo: tree.seedling.blm_ditanam.fotoHidup,
              tree_description: "-",
            });
          }
          if (parseInt(tree.seedling.blm_ditanam.mati) > 0) {
            listTrees.push({
              monitoring_no: this.defaultItem.monitoring_no,
              tree_code: tree.tree_code,
              qty: parseInt(tree.seedling.blm_ditanam.mati),
              status: "belum_ditanam",
              condition: "mati",
              planting_date: this.defaultItem.planting_date,
              tree_photo: tree.seedling.blm_ditanam.fotoMati,
              tree_description: "-",
            });
          }
          if (parseInt(tree.seedling.hilang) > 0) {
            listTrees.push({
              monitoring_no: this.defaultItem.monitoring_no,
              tree_code: tree.tree_code,
              qty: parseInt(tree.seedling.hilang),
              status: "hilang",
              condition: "hilang",
              planting_date: this.defaultItem.planting_date,
              tree_photo: "-",
              tree_description: "-",
            });
          }
        });
        // console.log(listTrees)
        let datapost = {
          monitoring_no: this.defaultItem.monitoring_no,
          validate_by: this.User.email,
          list_trees: listTrees,
        };
        if (this.generalSettings.landProgram.model == "Umum")
          datapost.is_verified = this.defaultItem.is_verified + 1;
        // this.dialogDetail = false;
        this.dialogDetail = false;
        this.dialogVerification = false;
        this.$store.state.loadingOverlayText = `Verifying monitoring by ${
          this.generalSettings.landProgram.model == "Petani" ? "FC" : "PIC T4T"
        }...`;
        this.$store.state.loadingOverlay = true;

        const response = await this.$_api.post(
          `ValidateMonitoring${
            this.generalSettings.landProgram.model == "Umum" ? "LahanUmum" : ""
          }`,
          datapost
        );
        // console.log(response.data.result);
        if (response.data.result == "success") {
          this.initialize();
          this.snackbar = true;
          this.textsnackbar = "Success!";
          this.timeoutsnackbar = 5000;
          this.colorsnackbar = "green";
        } else {
          this.alerttoken = true;
        }
      } catch (error) {
        this.textsnackbar = error.message;
        this.timeoutsnackbar = 5000;
        this.colorsnackbar = "red";
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      } finally {
        this.snackbar = true;
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;
      }
    },

    async deleteItemConfirm() {
      try {
        this.dialogDelete = false;
        this.$store.state.loadingOverlayText = `Deleting ${this.defaultItem.monitoring_no}...`;
        this.$store.state.loadingOverlay = true;
        let urlName = "DeleteMonitoring";
        if (this.generalSettings.landProgram == "Umum")
          urlName = "DeleteMonitoringLahanUmum";
        const data = {
          monitoring_no: this.defaultItem.monitoring_no,
        };
        const res = await this.$_api.post(urlName, data);
        if (res) {
          this.textsnackbar = "Delete Success!";
          this.colorsnackbar = "green";
          this.initialize();
        }
      } catch (error) {
        this.textsnackbar = error.message;
        this.colorsnackbar = "red";
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      } finally {
        this.timeoutsnackbar = 5000;
        this.snackbar = true;
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;
      }
    },

    async getUMAll() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const response = await this.$_api.get(
          "GetEmployeebyPosition?position_code=20"
        );
        // console.log(response.data.data.result);
        if (response.length != 0) {
          this.itemsum = response.data.result.data;
          // this.dataobject = response.data.result;
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
        const response = await this.$_api.get(
          "GetEmployeebyManager?manager_code=" + valcodeum + "&position=19"
        );
        // console.log(response.data.data.result);
        if (response.length != 0) {
          this.itemsfc = response.data.result.data;
          // this.dataobject = response.data.result;
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
        const response = await this.$_api.get(
          "GetFFbyUMandFC?position=" + position + "&code=" + valcode
        );
        // console.log(response.data.data.result);
        if (response.length != 0) {
          this.valueFFcode = response.data.result.data;
          // this.dataobject = response.data.result;
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
        const response = await this.$_api.post("AddMonitoring", datapost);
        if (response.data.result == "success") {
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
        const response = await this.$_api.post(
          "UpdateMonitoring",
          datapost
        );
        if (response.data.result == "success") {
          this.loadsave = false;
          this.dialog = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.initialize();
        } else {
          this.dialog = true;
          this.loadsave = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = true;
          this.loadsave = false;
        }
        this.loadsave = false;
      }
    },
    async updateDataPohon(datapost) {
      this.dialogDetail = false;
      try {
        const response = await this.$_api.post(
           "UpdatePohonMonitoring",
          datapost
        );
        if (response.data.result == "success") {
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
        const response = await this.$_api.get(
          "GetFarmerAllAdmin?typegetdata=several&ff=" + this.valueFFForm
        );
        // console.log(response.data.data.result);
        if (response.length != 0) {
          this.itemspetani = response.data.result.data;
          // this.dataobject = response.data.result;
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
        const response = await this.$_api.get(
          "GetLahanAll?farmer_no=" +
            this.valuePetaniselected +
            "&user_id=" +
            this.valueFFForm
        );
        // console.log(response.data.data.result);
        if (response.length != 0) {
          this.itemslahan = response.data.result.data;
          // this.dataobject = response.data.result;
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
        const response = await this.$_api.get(
          "GetLahanDetailLahanNo?lahan_no=" + this.valueLahanselected
        );
        // console.log(response.data.result);
        if (response.length != 0) {
          this.jarak_lahan = response.data.result.jarak_lahan;
          this.akses_jangkauan = response.data.result.access_to_lahan;
          //   this.itemslahan = response.data.result.data;
          // this.dataobject = response.data.result;
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
      this.dialogFormLahanUmum.inputs.mainDetailDatas = item;
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
      this.dialogFilterArea = true;
      this.valueMU = "";
      this.valueTA = "";
      this.valueVillage = "";
      this.selectMU = "";
      this.selectTA = "";
      this.selectVillage = "";
      this.listMonitoring1Checked = [];
      this.totalDatas = 0;
    },
    async showFilterEmployee() {
      this.dialogFilterEmp = true;
    },
    resetFilter() {
      this.dialogFilterArea = false;
      this.valueTA = "";
      if (this.dialogFilterArea == true) {
        this.valueUM = "";
        this.valueFC = "";
        this.selectUM = "";
        this.selectFC = "";
      } else if (this.dialogFilterEmp == true) {
        this.valueMU = "";
        this.valueTA = "";
        this.valueVillage = "";
        this.selectMU = "";
        this.selectTA = "";
        this.selectVillage = "";
      }
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data;
    },
    async searchbyarea() {
      this.dialogFilterArea = false;
      await this.initialize();
    },
    async searchbyemp() {
      this.dialogFilterEmp = false;
      await this.resetFilter();
      await this.initialize();
    },
    openDialogPhotoDetailJenis(item, itemPhoto, itemDesc, condition) {
      if (this.generalSettings.landProgram.model == "Umum") {
        var ktp_no = this.dialogFormLahanUmum.inputs.mainDetailDatas.ktp_no;
        var path = "general-lands/first-monitorings/per-type-condition/";
        this.plantPhotoRoute =
          this.BaseUrl +
          path +
          "upload_" +
          ktp_no +
          "_" +
          item.tree_code +
          "_" +
          condition +
          "_Perjenis_" +
          this.generalSettings.programYear +
          ".jpg";
        console.log(this.plantPhotoRoute);
      } else {
        this.plantPhotoRoute = this.BaseUrl + itemPhoto;
      }
      this.plantPhotoDialog = true;
      if (itemDesc == "" || itemDesc == null) {
        this.plantDescription = "-";
      } else {
        this.plantDescription = itemDesc;
      }
      this.plantTreeCode = item.tree_code;
      this.plantCondition = condition;
      this.mo_no = item.monitoring_no;
      this.refreshPlantPhotoRoute =
        "Uploads/" +
        item.monitoring_no.replaceAll("-", "_") +
        "_" +
        item.tree_code +
        "_" +
        condition +
        ".jpg";
      console.log(item.tree_code);
    },
    openPlantPhoto() {
      this.showLightbox(this.plantPhotoRoute);
    },
    async refreshPlantPhotoBtn() {
      const confirmation = await Swal.fire({
        title: "Refresh Data Foto dan Deskripsi?",
        text: "Proses Tidak Dapat Dikembalikan!",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Okay",
        showCancelButton: true,
      });
      if (confirmation.isConfirmed) {
        const pushParams = {
          monitoring_no: this.mo_no,
          tree_code: this.plantTreeCode,
          tree_condition: this.plantCondition,
          newPhotoRoute: this.refreshPlantPhotoRoute,
          newDetailDesc: this.plantDescription,
        };
        const response = await this.$_api.post(
          "RefreshMonitoringPhotoAndDesc",
          pushParams,
        );
        this.plantPhotoDialog = false;
        this.dialogDetail = false;
        this.initialize();
        console.log(pushParams);
      }
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
    async showAddModal() {
      try {
        this.$store.state.loadingOverlayText = "Get lahan umum datas...";
        this.$store.state.loadingOverlay = true;

        // reset data
        this.dialogFormLahanUmum.inputs.mou_no.model = null;
        this.dialogFormLahanUmum.inputs.mou_no.disabled = false;
        this.dialogFormLahanUmum.inputs.mou_no.options = [];
        this.dialogFormLahanUmum.inputs.adjustment.items = [];
        this.dialogFormLahanUmum.inputs.land_condition = "";
        this.dialogFormLahanUmum.inputs.qty_std = 0;
        this.dialogFormLahanUmum.inputs.planting_date.model =
          moment().format("Y-MM-DD");
        this.dialogFormLahanUmum.inputs.photo1.model = null;
        this.dialogFormLahanUmum.inputs.photo1.preview = null;
        this.dialogFormLahanUmum.inputs.photo2.model = null;
        this.dialogFormLahanUmum.inputs.photo2.preview = null;
        this.dialogFormLahanUmum.inputs.photo3.model = null;
        this.dialogFormLahanUmum.inputs.photo3.preview = null;

        await this.getLahanUmumDataOptions();
      } finally {
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;

        this.dialogFormLahanUmum.model = true;
      }
    },
    async showEditUmumModal(monitoring_no) {
      try {
        this.$store.state.loadingOverlayText = "Getting monitoring data...";
        this.$store.state.loadingOverlay = true;

        const response = await this.$_api.get(
          "GetMonitoringDetailLahanUmumAdmin",
          {
            monitoring_no: monitoring_no,
          }
        );
        const res = response.data.result;
        // reset data
        this.dialogFormLahanUmum.inputs.mou_no.model = res.data.mou_no || "";
        this.dialogFormLahanUmum.inputs.mou_no.disabled = true;
        this.dialogFormLahanUmum.inputs.mou_no.options = [
          { mou_no: res.data.mou_no },
        ];
        await this.getSeedDetailFromDistributionAdjustment(
          res.data.mou_no,
          res.list_detail
        );
        this.dialogFormLahanUmum.inputs.land_condition =
          res.data.lahan_condition || "-";
        this.dialogFormLahanUmum.inputs.qty_std = res.data.qty_std || 0;
        this.dialogFormLahanUmum.inputs.planting_date.model =
          this.$store.getters.dateFormat(res.data.planting_date, "Y-MM-DD");
        this.dialogFormLahanUmum.inputs.photo1.model = null;
        this.dialogFormLahanUmum.inputs.photo1.preview =
          res.data.photo1 != "-" ? this.BaseUrl + res.data.photo1 : "";
        this.dialogFormLahanUmum.inputs.photo2.model = null;
        this.dialogFormLahanUmum.inputs.photo2.preview =
          res.data.photo2 != "-" ? this.BaseUrl + res.data.photo2 : "";
        this.dialogFormLahanUmum.inputs.photo3.model = null;
        this.dialogFormLahanUmum.inputs.photo3.preview =
          res.data.photo3 != "-" ? this.BaseUrl + res.data.photo3 : "";
      } catch (err) {
        console.log(err);
      } finally {
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;

        this.dialogFormLahanUmum.model = true;
      }
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

    showUnverifModal(item) {
      this.defaultItem.monitoring_no = item.monitoring_no;
      this.defaultItem.is_validate = item.is_validate;
      this.dialogUnverif = true;
    },

    showDeleteModal(item) {
      this.defaultItem.monitoring_no = item.monitoring_no;
      this.defaultItem.is_validate = item.is_validate;
      this.defaultItem.mu_name = item.mu_name;
      if (this.generalSettings.landProgram.model == "Petani") {
        this.defaultItem.nama_petani = item.nama_petani;
        this.defaultItem.nama_ff = item.nama_ff;
      } else {
        this.defaultItem.pic_t4t_name = item.pic_t4t_name;
        this.defaultItem.pic_lahan_name = item.pic_lahan_name;
      }
      this.dialogDelete = true;
    },
    openDialogPhoto(item, condition) {
      this.dialogAddLahanUmumPlantPhoto.photoNewName = "";
      this.dialogAddLahanUmumPlantPhoto.photoNewName =
        "upload/" +
        this.dialogFormLahanUmum.inputs.selectedMouDatas.ktp_no +
        "_" +
        item.tree_code +
        "_" +
        condition;
      this.dialogFormLahanUmum.inputs.photoPerjenis.preview = "";
      this.dialogFormLahanUmum.inputs.photoPerjenis.model = null;
      this.dialogAddLahanUmumPlantPhoto.model = true;
    },

    async updateSeedlingAdjustment() {
      await this.dialogFormLahanUmum.inputs.adjustment.items.forEach((val) => {
        val.lost =
          parseInt(val.total_tree_received) -
          (parseInt(val.total_tree_planted_life) +
            parseInt(val.total_tree_planted_dead) +
            parseInt(val.total_tree_unplanted_life) +
            parseInt(val.total_tree_unplanted_dead));
        if (val.lost < 0 || val.lost > val.total_tree_received) {
          alert("Invalid input!");
          val.lost = val.total_tree_received;
          val.total_tree_planted_life = 0;
          val.total_tree_planted_dead = 0;
          val.total_tree_unplanted_life = 0;
          val.total_tree_unplanted_dead = 0;
        }
      });
    },

    dateFormat(date, format) {
      return moment(date).format(format);
    },
    async unverifItemConfirm() {
      // this.dialogDetail = false;
      try {
        this.dialogUnverif = false;
        this.$store.state.loadingOverlayText = "Unverifying data...";
        this.$store.state.loadingOverlay = true;
        const datapost = {
          monitoring_no: this.defaultItem.monitoring_no,
          is_validate: parseInt(this.defaultItem.is_validate) - 1,
        };
        let url = this.BaseUrlGet;
        if (this.generalSettings.landProgram.model == "Petani")
          url += "UnverificationMonitoring";
        else if (this.generalSettings.landProgram.model == "Umum")
          url += "UnverificationMonitoringLahanUmum";
        await this.$_api.post(url, datapost);
        this.textsnackbar = "Data unverified!";
        this.colorsnackbar = "green";
        await this.initialize();
      } catch (error) {
        console.error(error.response);
        this.textsnackbar = "Data failed to unverif!";
        this.colorsnackbar = "red";
        if (error.response.status == 401) {
          this.alerttoken = true;
          this.dialogUnverif = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      } finally {
        this.timeoutsnackbar = 5000;
        this.snackbar = true;
        this.$store.state.loadingOverlayText = null;
        this.$store.state.loadingOverlay = false;
      }
    },
    close() {
      this.dialog = false;
      this.dialogAddProduct = false;
      this.dialogdownload = false;
      this.dialogAddonly = false;
    },

    closePohonTambah() {
      this.dialogPohon = false;
    },
    closeDelete() {
      this.dialogUnverif = false;
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
    async VerificationUMItemConfirm() {
      try {
        this.dialogVerificationUM = false;
        this.dialogDetail = false;
        this.$store.state.loadingOverlayText = "Verifying monitoring by UM...";
        this.$store.state.loadingOverlay = true;

        const data = this.defaultItem;
        let listTrees = [];
        // ungrouping per condition
        await data.list_detail.forEach((tree) => {
          if (tree.seedling.ditanam.hidup > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.ditanam.hidup,
              status: "sudah_ditanam",
              condition: "hidup",
              planting_date: data.planting_date,
              tree_photo: tree.seedling.ditanam.fotoHidup,
              tree_description: "-",
            };
            listTrees.push(pushData);
          }
          if (tree.seedling.ditanam.mati > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.ditanam.mati,
              status: "sudah_ditanam",
              condition: "mati",
              planting_date: data.planting_date,
              tree_photo: tree.seedling.ditanam.fotoMati,
              tree_description: tree.seedling.ditanam.keterangan,
            };
            listTrees.push(pushData);
          }
          if (tree.seedling.blm_ditanam.hidup > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.blm_ditanam.hidup,
              status: "belum_ditanam",
              condition: "hidup",
              planting_date: data.planting_date,
              tree_photo: tree.seedling.blm_ditanam.fotoHidup,
              tree_description: "-",
            };
            listTrees.push(pushData);
          }
          if (tree.seedling.blm_ditanam.mati > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.blm_ditanam.mati,
              status: "belum_ditanam",
              condition: "mati",
              planting_date: data.planting_date,
              tree_photo: tree.seedling.blm_ditanam.fotoMati,
              tree_description: "-",
            };
            listTrees.push(pushData);
          }
          if (tree.seedling.hilang > 0) {
            let pushData = {
              tree_code: tree.tree_code,
              qty: tree.seedling.hilang,
              status: "hilang",
              condition: "hilang",
              planting_date: data.planting_date,
              tree_photo: "-",
              tree_description: "-",
            };
            listTrees.push(pushData);
          }
        });

        const url = `${this.BaseUrlGet}MonitoringVerificationUM`;
        const postData = {
          monitoring_no: data.monitoring_no,
          list_trees: listTrees,
          validate_by: this.User.email,
        };
        const response = await this.$_api.post(url, postData);
        if (response) {
          this.textsnackbar = "Verified!";
          this.timeoutsnackbar = 5000;
          this.colorsnackbar = "green";
          await this.initialize();
        }
      } catch (error) {
        this.textsnackbar = error.message;
        this.timeoutsnackbar = 5000;
        this.colorsnackbar = "red";
        console.log(error);
      } finally {
        this.snackbar = true;
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = null;
      }
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
    waitingapprovefunct(valapprove) {
      if (valapprove == 0) {
        return true;
      } else {
        return false;
      }
    },

    pilihgambar1(event) {
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
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    async setGroupingDetailSeedling(datas) {
      // console.log(datas)
      let grouping = [];
      await datas.forEach((data) => {
        let pushData = {
          tree_code: data.tree_code,
          tree_category:
            data.tree_category == "Pohon_Kayu"
              ? "KAYU"
              : data.tree_category == "Pohon_Buah"
              ? "MPTS"
              : "CROPS",
          tree_name: data.tree_name,
          seedling: {
            ditanam: {
              hidup: 0,
              fotoHidup: "",
              HidupPhotoRefreshRoute: "",

              mati: 0,
              fotoMati: "",
              keterangan: "",
              newMatiPhotoRoute: "",
              monitoring_no: "",
              tree_code: "",
            },
            blm_ditanam: {
              hidup: 0,
              fotoHidup: "",
              mati: 0,
              fotoMati: "",
            },
            hilang: 0,
          },
        };
        const checkExistsID = grouping.findIndex(
          (grp) => grp.tree_code == data.tree_code
        );
        if (checkExistsID > -1) {
          if (data.status == "sudah_ditanam" && data.condition == "hidup") {
            grouping[checkExistsID].seedling.ditanam.hidup += parseInt(
              data.amount
            );
            grouping[checkExistsID].seedling.ditanam.fotoHidup =
              data.tree_photo;
            grouping[checkExistsID].seedling.ditanam.HidupPhotoRefreshRoute =
              "Uploads/" +
              data.monitoring_no.replaceAll("-", "_") +
              "_" +
              data.tree_code +
              "_" +
              data.condition +
              ".jpg";
            grouping[checkExistsID].seedling.ditanam.monitoring_no =
              data.monitoring_no;
            grouping[checkExistsID].seedling.ditanam.tree_code = data.tree_code;
          } else if (
            data.status == "sudah_ditanam" &&
            data.condition == "mati"
          ) {
            grouping[checkExistsID].seedling.ditanam.mati += parseInt(
              data.amount
            );
            grouping[checkExistsID].seedling.ditanam.fotoMati = data.tree_photo;
            grouping[checkExistsID].seedling.ditanam.keterangan =
              data.tree_description;
            grouping[checkExistsID].seedling.ditanam.newMatiPhotoRoute =
              "Uploads/" +
              data.monitoring_no.replaceAll("-", "_") +
              "_" +
              data.tree_code +
              "_" +
              data.condition +
              ".jpg";
            grouping[checkExistsID].seedling.ditanam.monitoring_no =
              data.monitoring_no;
            grouping[checkExistsID].seedling.ditanam.tree_code = data.tree_code;
          } else if (
            data.status == "belum_ditanam" &&
            data.condition == "hidup"
          ) {
            grouping[checkExistsID].seedling.blm_ditanam.hidup += parseInt(
              data.amount
            );
            grouping[checkExistsID].seedling.blm_ditanam.fotoHidup =
              data.tree_photo;
          } else if (
            data.status == "belum_ditanam" &&
            data.condition == "mati"
          ) {
            grouping[checkExistsID].seedling.blm_ditanam.mati += parseInt(
              data.amount
            );
            grouping[checkExistsID].seedling.blm_ditanam.fotoMati =
              data.tree_photo;
          } else if (data.status == "hilang" && data.condition == "hilang") {
            grouping[checkExistsID].seedling.hilang += parseInt(data.amount);
          }
        } else {
          if (data.status == "sudah_ditanam" && data.condition == "hidup") {
            pushData.seedling.ditanam.hidup += parseInt(data.amount);
            pushData.seedling.ditanam.fotoHidup = data.tree_photo;
            pushData.seedling.ditanam.HidupPhotoRefreshRoute =
              "upload/" +
              data.monitoring_no.replace("-", "_") +
              "_" +
              data.tree_code +
              "_" +
              data.condition +
              ".jpg";
            pushData.seedling.ditanam.monitoring_no = data.monitoring_no;
            pushData.seedling.ditanam.tree_code = data.tree_code;
          } else if (
            data.status == "sudah_ditanam" &&
            data.condition == "mati"
          ) {
            pushData.seedling.ditanam.mati += parseInt(data.amount);
            pushData.seedling.ditanam.fotoMati = data.tree_photo;
            pushData.seedling.ditanam.keterangan = data.tree_description;
            pushData.seedling.ditanam.newMatiPhotoRoute =
              "upload/" +
              data.monitoring_no.replace("-", "_") +
              "_" +
              data.tree_code +
              "_" +
              data.condition +
              ".jpg";
            pushData.seedling.ditanam.monitoring_no = data.monitoring_no;
            pushData.seedling.ditanam.tree_code = data.tree_code;
          } else if (
            data.status == "belum_ditanam" &&
            data.condition == "hidup"
          ) {
            pushData.seedling.blm_ditanam.hidup += parseInt(data.amount);
            pushData.seedling.blm_ditanam.fotoHidup = data.tree_photo;
          } else if (
            data.status == "belum_ditanam" &&
            data.condition == "mati"
          ) {
            pushData.seedling.blm_ditanam.mati += parseInt(data.amount);
            pushData.seedling.blm_ditanam.fotoMati = data.tree_photo;
          } else if (data.status == "hilang" && data.condition == "hilang") {
            pushData.seedling.hilang += parseInt(data.amount);
          }
          grouping.push(pushData);
        }
      });
      // console.log(grouping)
      return grouping;
    },
    numberFormat(num) {
      return new Intl.NumberFormat("id-ID").format(num);
    },
    photoPerjenisFileChanged(event) {
      if (event) {
        let fileSize = event.size / 1000000;
        console.log(event);
        if (fileSize < 6) {
          this.dialogFormLahanUmum.inputs.photoPerjenis.model = event;
          this.dialogFormLahanUmum.inputs.photoPerjenis.preview =
            URL.createObjectURL(event);
        } else {
          alert(`Please change your photo file, it's too big. Max 6mb.`);
        }
      } else {
        this.dialogFormLahanUmum.inputs.photoPerjenis.model = null;
        this.dialogFormLahanUmum.inputs.photoPerjenis.preview = "";
      }
    },
    photo1FileChanged(event) {
      if (event) {
        let fileSize = event.size / 1000000;
        console.log(fileSize);
        if (fileSize < 6) {
          this.dialogFormLahanUmum.inputs.photo1.model = event;
          this.dialogFormLahanUmum.inputs.photo1.preview =
            URL.createObjectURL(event);
        } else {
          alert(`Please change your photo file, it's too big. Max 6mb.`);
        }
      } else {
        this.dialogFormLahanUmum.inputs.photo1.model = null;
        this.dialogFormLahanUmum.inputs.photo1.preview = "";
      }
    },
    photo2FileChanged(event) {
      if (event) {
        let fileSize = event.size / 1000000;
        console.log(fileSize);
        if (fileSize < 6) {
          this.dialogFormLahanUmum.inputs.photo2.model = event;
          this.dialogFormLahanUmum.inputs.photo2.preview =
            URL.createObjectURL(event);
        } else {
          alert(`Please change your photo file, it's too big. Max 6mb.`);
        }
      } else {
        this.dialogFormLahanUmum.inputs.photo2.model = null;
        this.dialogFormLahanUmum.inputs.photo2.preview = "";
      }
    },
    photo3FileChanged(event) {
      if (event) {
        let fileSize = event.size / 1000000;
        console.log(fileSize);
        if (fileSize < 6) {
          this.dialogFormLahanUmum.inputs.photo3.model = event;
          this.dialogFormLahanUmum.inputs.photo3.preview =
            URL.createObjectURL(event);
        } else {
          alert(`Please change your photo file, it's too big. Max 6mb.`);
        }
      } else {
        this.dialogFormLahanUmum.inputs.photo3.model = null;
        this.dialogFormLahanUmum.inputs.photo3.preview = "";
      }
    },
    generateFormData(data) {
      let formData = new FormData();

      const objectArray = Object.entries(data);

      objectArray.forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.map((item) => {
            formData.append(key + "[]", item);
          });
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    },
    async uploadPhotos(type, file) {
      this.$store.state.loadingOverlayText = `Saving photo "${type}"...`;
      const url = `${this.BaseUrl}general-lands/upload.php`;
      const newName = `${this.dialogFormLahanUmum.inputs.mou_no.model
        .replace(/\s/g, "")
        .replaceAll("/", "_")}_${type}`;
      const data = this.generateFormData({
        dir: "first-monitorings",
        nama: newName,
        image: file,
      });
      let responseName = null;
      await axios
        .post(url, data)
        .then((res) => {
          responseName = res.data.data.new_name;
        })
        .catch((err) => {
          console.error(err);
        });
      return "general-lands/" + responseName;
    },
    lahanNoFormat(lahan_no) {
      return lahan_no.replace("[", "").replace("]", "").split(",");
    },

    async openExportPerFF(item) {
      this.ff_user = [];
      try {
        const response = await this.$_api.get(`GetFFNow?ff_no=${item}`);
        if (response.length != 0) {
          this.ff_user = response.data.result;
        }
      } catch (error) {
        console.error(error.response);
        this.itemDesa = [];
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
        this.ff_user = [];
      }
    },
    async openExportFilter() {
      const dialog = this.dialogs.exportFilter;
      const filters = dialog.filters;
      // reset data
      filters.rm.model = "";
      filters.rm.options = [];
      filters.um.model = "";
      filters.um.options = [];
      filters.fc.model = "";
      filters.fc.options = [];
      filters.ff.model = [];

      const user = this.User;
      if (user.role_name == "FIELD COORDINATOR") {
        this.$store.state.loadingOverlay = true;
        this.$store.state.loadingOverlayText = "Getting FF datas...";
        await this.setFiltersFF("FC", user.employee_no);
        await this.exportData();
        this.$store.state.loadingOverlay = false;
        this.$store.state.loadingOverlayText = "";
      } else dialog.model = true;
      dialog.loading = true;
      await this.getFiltersOptions("rm");
      if (user.role_name == "UNIT MANAGER") {
        const managerCode = await user.EmployeeStructure.manager_code;
        filters.rm.model = managerCode;
        await this.getFiltersOptions("um", managerCode);
        filters.um.model = user.employee_no;

        await this.getFiltersOptions("fc", user.employee_no);
      } else if (user.role_name == "REGIONAL MANAGER") {
        filters.rm.model = user.employee_no;
        await this.getFiltersOptions("um", user.employee_no);
      } else if (user.role_name == "NURSERY") {
        const managerCode = await user.EmployeeStructure.manager_code;
        filters.um.model = managerCode;
        await this.getFiltersOptions("fc", managerCode);
      }
      dialog.loading = false;
    },
    async exportData() {
      const dialog = this.dialogs.exportFilter;
      dialog.model = false;
      let url =
        this.$store.state.apiUrl.replace("/api/", "/") + "ExportMonitoring?";
      const params = new URLSearchParams({
        program_year: this.generalSettings.programYear,
        land_program: this.generalSettings.landProgram.model,
        ff: this.dialogs.exportFilter.filters.ff.model.toString(),
      });
      url += params.toString();
      window.open(url, "blank");
    },

    async exportDataByMU() {
      const dialog = this.dialogs.exportFilter;
      dialog.model = false;
      let url =
        this.$store.state.apiUrl.replace("/api/", "/") +
        "ExportMonitoringArea?";
      const params = new URLSearchParams({
        program_year: this.dialogs.exportFilter.program_year,
        land_program: this.generalSettings.landProgram.model,
        mu_no: this.dialogs.exportFilter.filters.mu.model,
        ta_no: this.dialogs.exportFilter.filters.ta.model,
        ff: this.dialogs.exportFilter.filters.ff_area.model,
      });
      url += params.toString();
      window.open(url, "blank");
    },

    async exportLahanUmum() {
      const dialog = this.dialogs.exportFilter;
      dialog.model = false;
      let url =
        this.$store.state.apiUrl.replace("/api/", "/") +
        "ExportMonitoringLahanUmum?";

      let params = new URLSearchParams({
        program_year: this.generalSettings.programYear,
        land_program: this.generalSettings.landProgram.model,
      });
      const user = this.User;
      if (
        user.role_name != "REGIONAL MANAGER" &&
        user.role_name != "UNIT MANAGER" &&
        user.role_group != "IT"
      )
        params.set("created_by", user.email);
      url += params.toString();
      window.open(url, "blank");
    },
    async getFiltersOptions(type, data = null) {
      const filters = this.dialogs.exportFilter.filters[type];
      try {
        filters.loading = true;
        let url = "";
        if (type == "rm") url = "GetEmployeebyPosition?position_code=23";
        else if (type == "um" && data)
          url = `GetEmployeebyManager?manager_code=${data}&position=20`;
        else if (type == "fc" && data)
          url = `GetEmployeebyManager?manager_code=${data}&position=19`;
        filters.model = "";
        this.dialogs.exportFilter.filters.ff.model = [];
        if (url) {
          const list = await this.$_api.get(url).then((res) => {
            return res.data.result.data;
          });
          filters.options = list.sort((a, b) => a.name.localeCompare(b.name));
        }
        // console.log(data)
      } catch (err) {
        this.errorResponse(err);
      } finally {
        filters.loading = false;
      }
    },
    async setFiltersFF(position, id_code) {
      const filters = this.dialogs.exportFilter.filters.ff;
      try {
        filters.loading = true;
        let url = `GetFFbyUMandFC?position=${position}&code=${id_code}`;
        const ff = await this.$_api.get(url).then((res) => {
          return res.data.result.data;
        });
        // console.log(ff)
        filters.model = ff;
      } catch (err) {
        this.errorResponse(err);
      } finally {
        filters.loading = false;
      }
    },
    errorResponse(error) {
      console.log(error);
      if (error.response) {
        if (error.response.status) {
          if (error.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }
      }
    },
  },
};
</script>
