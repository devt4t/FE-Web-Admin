<template>
  <div>
    <!-- breadcrumbs -->
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>
    
    <!-- loading overlay -->
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        color="white"
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <!-- alert session -->
    <div class="mx-9">
      <v-alert :value="alerttoken" color="red" elevation="24" type="error">
        Session Token Login Habis, Login Kembali !
      </v-alert>
    </div>

    <!-- lightbox ~ image preview -->
    <vue-easy-lightbox
      :visible="preview.lightbox.isVisible"
      :imgs="preview.lightbox.imgs"
      :index="preview.lightbox.index"
      @hide="() => { preview.lightbox.isVisible = false; }"
    ></vue-easy-lightbox>

    <!-- MODAL -->
      <!-- Modal Filter Area -->
      <v-dialog v-model="dialogFilterArea" max-width="500px">
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
                    label="Target Area"
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
            <v-btn color="blue darken-1" text
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="searchbyarea"
              >Cari</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Filter Emp -->
      <v-dialog v-model="dialogFilterEmp" max-width="500px">
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
            <v-btn color="blue darken-1" text @click="closeDelete"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="searchbyemp"
              >Cari</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Create Form Pelatihan Petani -->
      <v-dialog v-model="dialogAddonly" max-width="1000px" persistent content-class="rounded-lg" scrollable>
        <v-card class="rounded-xl">
          <v-card-title class="mb-1 headermodalstyle">
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text class="pa-0 fontall">
            <v-stepper v-if="load == false" v-model="e1">
              <v-stepper-header>
                <v-stepper-step editable :complete="e1 > 1" step="1" color="success">
                  Main Data
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :editable="!selectFF == false && !dataToStore.materi_2 == false" :complete="e1 > 2" step="2" color="success">
                  Peserta 
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :editable="!selectFF == false && !dataToStore.materi_2 == false && listFarmerParticipantChecked.length > 0" :complete="e1 > 3" step="3" color="success">
                  Foto Absensi & Dokumentasi
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <!-- Main Data -->
                <v-stepper-content class="pa-3" step="1">
                  <!-- Content -->
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12" lg="6">
                        <v-row>
                          <!-- Program year -->
                          <v-col cols="12" sm="12" md="12">
                            <v-select
                              color="success"
                              item-color="success"
                              :menu-props="{rounded: 'xl'}"
                              outlined
                              rounded
                              hide-details
                              v-model="dataToStore.program_year"
                              :items="itemsTahun"
                              item-text="text"
                              item-value="value"
                              disabled
                              label="Tahun Program"
                              type="string"
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-select>
                          </v-col>
                          <!-- UM -->
                          <v-col cols="12" sm="12" md="12">
                            <v-autocomplete
                              color="success"
                              item-color="success"
                              :menu-props="{rounded: 'xl'}"
                              outlined
                              rounded
                              hide-details
                              v-model="selectUM"
                              :items="itemsum"
                              item-value="nik"
                              item-text="name"
                              v-on:change="selectedUM"
                              label="Unit Manager"
                              :loading="loading.um"
                              :readonly="User.role_name === 'FIELD COORDINATOR' || User.role_name === 'UNIT MANAGER'"
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-autocomplete>
                          </v-col>
                          <!-- FC -->
                          <v-col cols="12" sm="12" md="12">
                            <v-autocomplete
                              color="success"
                              item-color="success"
                              :menu-props="{rounded: 'xl'}"
                              outlined
                              rounded
                              hide-details
                              v-model="selectFC"
                              :items="itemsfc"
                              item-value="nik"
                              item-text="name"
                              v-on:change="selectedFC"
                              label="Field Coordinator"
                              :rules="[(v) => !!v || 'Field is required']"
                              :loading="loading.fc"
                              :no-data-text="loading.fc ? 'Loading...' : 'Pilih UM'"
                              :readonly="User.role_name === 'FIELD COORDINATOR'"
                            ></v-autocomplete>
                          </v-col>
                          <!-- FF -->
                          <v-col cols="12" sm="12" md="12">
                            <v-autocomplete
                              color="success"
                              item-color="success"
                              :menu-props="{rounded: 'xl'}"
                              outlined
                              rounded
                              hide-details
                              v-model="selectFF"
                              :items="itemsff"
                              item-text="name"
                              item-value="ff_no"
                              label="Field Facilitator"
                              :loading="loading.ff"
                              :no-data-text="loading.ff ? 'Loading...' : 'Pilih FC'"
                              return-object
                              type="string"
                              v-on:change="selectPetaniWithMUScope"
                              :rules="[(v) => !!v || 'Field is required']"
                            >
                            <template v-slot:item="data">
                              <v-list-item-content>
                                <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                <v-list-item-subtitle>{{ data.item.ff_no }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </template>
                            </v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="12" md="6" lg="6">
                        <v-row>
                          <!-- Materi Pelatihan 1 -->
                          <v-col cols="12" sm="12" md="12">
                            <v-autocomplete
                              color="success"
                              item-color="success"
                              :menu-props="{rounded: 'xl'}"
                              outlined
                              rounded
                              hide-details
                              v-model="dataToStore.materi_1"
                              :items="options.materiPelatihan"
                              item-text="material_name"
                              item-value="material_no"
                              label="Materi Pelatihan 1"
                              readonly
                              type="string"
                              :rules="[(v) => !!v || 'Field is required']"
                            >
                              <!-- <template v-slot:selection="data">
                                {{ data.item.material_no }} - {{ data.item.material_name}}
                              </template> -->
                            </v-autocomplete>
                          </v-col>
                          <!-- Materi Pelatihan 2 -->
                          <v-col cols="12" sm="12" md="12">
                            <v-autocomplete
                              color="success"
                              item-color="success"
                              :menu-props="{rounded: 'xl'}"
                              outlined
                              rounded
                              hide-details
                              v-model="dataToStore.materi_2"
                              :items="options.materiPelatihan"
                              item-text="material_name"
                              item-value="material_no"
                              label="Materi Pelatihan 2"
                              type="string"
                              clearable
                              :rules="[(v) => !!v || 'Field is required']"
                            >
                              <template v-slot:item="data">
                                <v-list-item-content>
                                  <v-list-item-title v-html="data.item.material_no"></v-list-item-title>
                                  <v-list-item-subtitle>{{ data.item.material_name }}</v-list-item-subtitle>
                                </v-list-item-content>
                              </template>
                            </v-autocomplete>
                          </v-col>
                          <!-- Date -->
                          <v-col cols="12" sm="12" md="12" lg="12">
                            <p class="mb-1">Date</p>
                                <v-menu 
                                  rounded="xl"
                                  v-model="datePickerMenu"
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
                                          large
                                          color="green lighten-1"
                                          v-bind="attrs"
                                          v-on="{...menu, ...tooltip}"
                                        >
                                          <v-icon left> mdi-calendar </v-icon>
                                          {{ dateFormat(dataToStore.date, 'dddd, DD MMMM Y') }}
                                        </v-btn>
                                      </template>
                                      <span>Klik untuk memunculkan datepicker</span>
                                    </v-tooltip>
                                  </template>
                                  <v-list>
                                    <v-list-item>
                                      <v-date-picker 
                                        color="green lighten-1 rounded-xl" 
                                        v-model="dataToStore.date"
                                      ></v-date-picker>
                                      <br>
                                    </v-list-item>
                                    <v-list-item>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        color="green lighten-1"
                                        center
                                        rounded
                                        @click="datePickerMenu = false"
                                      >
                                        Ok
                                      </v-btn>
                                      <v-spacer></v-spacer>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-stepper-content>
                <!-- Peserta Pelatihan -->
                <v-stepper-content class="pa-3" step="2">
                  <!-- Content -->
                  <v-container class="mb-2">
                    <!-- List Peserta Pelatihan -->
                    <v-row class="mb-3">
                      <h4>List Peserta Pelatihan</h4>
                      <v-divider class="mx-2 mt-3"></v-divider>
                    </v-row>
                    <v-row v-if="selectFF" class="">
                      <v-col cols="12" sm="12" md="12" lg="6">
                        <h3>{{ selectFF.ff_no }} - {{ selectFF.name }}</h3>
                      </v-col>
                      <!-- Material Organik -->
                      <v-col cols="12" sm="12" md="12" lg="6">
                        <v-select
                          rounded
                          multiple
                          v-model="dataToStore.material_organic"
                          :items="options.material_organic"
                          label="Material Organik"
                          item-text="organic_name"
                          item-value="organic_no"
                          outlined
                          disabled
                          type="string"
                          :rules="[(v) => !!v || 'Field is required']"
                        >
                          <template v-slot:item="data">
                            <v-list-item-content>
                              <v-list-item-title v-html="data.item.organic_name"></v-list-item-title>
                            </v-list-item-content>
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>
                    <v-row class="align-end">
                      <!-- <v-col cols="12" sm="12" md="6" class="d-flex align-end"> -->
                        <h4>Checked: {{ listFarmerParticipantChecked.length }}</h4>
                      <!-- </v-col> -->
                      <v-divider class="mx-2"></v-divider>
                      <!-- <v-col cols="12" sm="12" md="6"> -->
                        <v-text-field
                          v-model="searchListPesertaPelatihan"
                          append-icon="mdi-magnify"
                          label="Search"
                          single-line
                          hide-details
                        ></v-text-field>
                      <!-- </v-col> -->
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <!-- Table List Petani Peserta Pelatihan -->
                        <v-data-table
                          :headers="headerListProduct"
                          :items="listFarmerParticipant"
                          class="elevation-3 rounded-xl"
                          item-key="kode"
                          :loading="loadtabledetail"
                          loading-text="Loading... Please wait"
                          v-model="listFarmerParticipantChecked"
                          show-select
                          :search="searchListPesertaPelatihan"
                          :single-select="false"
                          :key="componentKey.listFarmerParticipantTable"
                          hide-default-footer
                          :items-per-page="-1"
                          :footer-props="{
                            itemsPerPageOptions: [10, 25, 40, -1]
                          }"
                        >
                          <template v-slot:header.data-table-select="{props,on}">
                            <v-simple-checkbox color="success" v-ripple v-bind="props" v-on="on"></v-simple-checkbox>
                          </template>
                          <template v-slot:item.data-table-select="{isSelected,select}">
                            <v-simple-checkbox color="success" v-ripple :value="isSelected" @input="select($event)"></v-simple-checkbox>
                          </template>
                          <template v-slot:item.index="{ index }">
                            {{ index + 1 }}
                          </template>
                          <template v-slot:item.photo="{item}">
                            <v-tooltip top>
                              <template v-slot:activator="{ on, attrs }">
                                <v-avatar v-bind="attrs" v-on="on" color="secondary" size="56" class="my-1 cursor-pointer" @click="() => {preview.petani.data = item;preview.petani.modal = true;}" >
                                  <img
                                    :src="`https://t4tadmin.kolaborasikproject.com/Uploads/fphoto_${item.nik}.jpg`"
                                    :alt="`Foto petani ${item.nama}`"
                                  >
                                </v-avatar>
                              </template>
                              <span>Klik untuk preview</span>
                            </v-tooltip>
                          </template>
                          <template v-slot:item.actions="{ index, item }">
                            <v-row class="">
                              <v-col cols="6" class="d-inline-flex align-center">
                                <v-icon
                                  @click="deletePesertaPelatihan(index, item)"
                                  color="red"
                                >
                                  mdi-delete
                                </v-icon>
                              </v-col>
                            </v-row>
                            <!-- <v-icon @click="deleteItem(item)" color="red"> mdi-delete </v-icon> -->
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                    <!-- Tambah Petani Lain -->
                    <v-row class="mb-3">
                      <h4>Tambah Petani Lain</h4>
                      <v-divider class="mx-2 mt-3"></v-divider>
                    </v-row>
                    <v-row>
                      <v-col class="px-1 py-0" cols="12" sm="12" md="12">
                        <v-autocomplete
                          color="success"
                          item-color="success"
                          :menu-props="{rounded: 'xl'}"
                          outlined
                          rounded
                          hide-details
                          :items="itemspetaniallmu"
                          v-model="addMoreFarmerParticipantSelectValue"
                          item-text="nama"
                          item-value="kode"
                          label="Pilih Petani"
                          v-on:change="addMoreFarmerParticipant"
                          return-object
                          clearable
                          :loading="loading.farmer"
                        >
                        <template v-slot:item="data">
                          <v-list-item-avatar>
                            <img :src="`https://t4tadmin.kolaborasikproject.com/Uploads/fphoto_${data.item.nik}.jpg`">
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title v-html="data.item.nama"></v-list-item-title>
                            <v-list-item-subtitle>{{ data.item.kode }} - {{ data.item.nik }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-stepper-content>
                <!-- Foto Absensi & Dokumentasi -->
                <v-stepper-content class="pa-3" step="3">
                  <!-- Content -->
                  <v-container>
                    <v-row>
                      <!-- Absensi Foto -->
                      <v-col cols="12" sm="12" md="12" lg="6">
                        <v-row>
                          <!-- Absensi File -->
                          <v-col cols="12" sm="12" md="12">
                            <v-file-input
                              color="success"
                              item-color="success"
                              outlined
                              rounded
                              hide-details
                              accept="image/png, image/jpeg, image/bmp"
                              placeholder="Foto Absensi Tertulis"
                              prepend-icon="mdi-camera"
                              label="Foto Absensi Tertulis"
                              v-on:change="absensiFileChanged"
                              :key="componentKey.absensiImageInput"
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-file-input>
                            <v-card elevation="2" class="rounded-xl" height="300" v-if="absensiPreview && absensiPreview !== ''">
                              <v-img
                                height="300"
                                v-bind:src="absensiPreview"
                                class="my-2 mb-4 rounded-xl"
                                id="idFotoAbsensi"
                              ></v-img
                            ></v-card>
                          </v-col>
                          <!-- Absensi File 2 -->
                          <v-col cols="12" sm="12" md="12">
                            <v-btn
                              v-if="dataToStore.absensi_img && showedAbsensi2 == false"
                              color="info"
                              rounded
                              @click="showedAbsensi2 = true"
                            >
                              <v-icon>mdi-plus</v-icon>
                              Add more image
                            </v-btn>
                            <v-file-input
                              v-if="showedAbsensi2"
                              color="success"
                              item-color="success"
                              :menu-props="{rounded: 'xl'}"
                              outlined
                              rounded
                              hide-details
                              accept="image/png, image/jpeg, image/bmp"
                              placeholder="Foto Absensi Tertulis 2"
                              prepend-icon="mdi-camera"
                              label="Foto Absensi Tertulis 2"
                              v-on:change="absensiFileChanged2"
                              :key="componentKey.absensiImageInput2"
                            ></v-file-input>
                            <v-card elevation="2" class="rounded-xl" height="300" v-if="absensiPreview2 && absensiPreview2 !== ''">
                              <v-img
                                height="300"
                                v-bind:src="absensiPreview2"
                                class="my-2 mb-4 rounded-xl"
                                id="idFotoAbsensi2"
                              ></v-img
                            ></v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- Dokumentasi Foto -->
                      <v-col cols="12" sm="12" md="12" lg="6">
                        <v-row>
                          <!-- Dokumentasi File -->
                          <v-col cols="12" sm="12" md="12">
                            <v-file-input
                              color="success"
                              item-color="success"
                              outlined
                              rounded
                              hide-details
                              accept="image/png, image/jpeg, image/bmp"
                              placeholder="Foto Dokumentasi"
                              prepend-icon="mdi-camera"
                              label="Foto Dokoumentasi"
                              v-on:change="dokumentasiFileChanged"
                              :key="componentKey.dokumentasiImageInput"
                              :rules="[(v) => !!v || 'Field is required']"
                            ></v-file-input>
                            <v-card elevation="2" class="rounded-xl" height="300" v-if="dokumentasiPreview && dokumentasiPreview !== ''">
                              <v-img
                                height="300"
                                v-bind:src="dokumentasiPreview"
                                class="my-2 mb-4 rounded-xl"
                                id="idFotoDokumentasi"
                              ></v-img
                            ></v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
          <v-card-actions class="ma-2">
            <!-- Footer Button -->
            <v-row>
              <v-col cols="3">
                <v-btn
                  class="mr-0 mr-md-1"
                  color="red"
                  rounded
                  elevation="1"
                  @click="close"
                  outlined
                >
                  <v-icon class="d-none d-md-inline" left> mdi-close-circle-outline </v-icon>
                  <v-icon class="d-inline d-md-none" center> mdi-close-circle-outline </v-icon>
                  <span class="d-none d-md-inline-block"> 
                    Cancel
                  </span>
                </v-btn>

              </v-col>
              <v-col cols="6" align="center">
                <v-btn
                  :disabled="e1 == 1"
                  elevation="1"
                  outlined
                  color="primary"
                  class="mr-1"
                  rounded
                  @click="stepperMove('-')"
                >
                  <v-icon class="d-none d-md-inline" left> mdi-chevron-left-circle-outline </v-icon>
                  <v-icon class="d-inline d-md-none" center> mdi-chevron-left-circle-outline </v-icon>
                  <span class="d-none d-md-inline-block"> 
                    Back
                  </span>
                </v-btn>
                <v-btn
                  class="ml-1"
                  elevation="1"
                  rounded
                  outlined
                  color="primary"
                  @click="stepperMove('+')"
                  :disabled="
                    (e1 == 1 && (!selectFF || !dataToStore.materi_2) ) || 
                    (e1 == 2 && listFarmerParticipantChecked.length == 0) ||
                    e1 == 3
                  "
                >
                  <span class="d-none d-md-inline-block"> 
                    Next
                  </span>
                  <v-icon class="d-none d-md-inline" right> mdi-chevron-right-circle-outline </v-icon>
                  <v-icon class="d-inline d-md-none" center> mdi-chevron-right-circle-outline </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="3" align="end">
                <v-btn
                  color="success"
                  elevation="1"
                  rounded
                  outlined
                  @click="saveFormFarmerTraining"
                  :disabled="listFarmerParticipantChecked.length == 0 || !dataToStore.absensi_img || !dataToStore.materi_2 ||!dataToStore.dokumentasi_img"
                >
                  <v-progress-circular
                    v-if="loadsave == true"
                    :size="25"
                    rounded
                    :width="5"
                    indeterminate
                    color="green"
                  >
                  </v-progress-circular>
                  <span v-if="loadsave == false" class="d-none d-md-inline-block"> 
                    Save
                  </span>
                  <v-icon v-if="loadsave == false" class="d-none d-md-inline" right> mdi-checkbox-marked-circle-outline </v-icon>
                  <v-icon v-if="loadsave == false" class="d-inline d-md-none" center> mdi-checkbox-marked-circle-outline </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>

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

      <!-- Modal Detail Form Pelatihan Petani -->
      <v-dialog v-model="dialogDetail" max-width="900px" content-class="rounded-xl" scrollable>
        <v-card class="rounded-lg">
          <v-card-title class="mb-1 headermodalstyle">
            <span class="headline">Detail Pelatihan Petani</span>
          </v-card-title>
          <v-card-text class="pa-0 fontall">
            <vue-html2pdf
                :show-layout="false"
                :float-layout="true"
                :enable-download="false"
                :preview-modal="true"
                :paginate-elements-by-height="1400"
                :filename="`Pelatihan petani - ${dialogDetailData ? dialogDetailData.training_no : ''}`"
                :pdf-quality="2"
                :manual-pagination="false"
                pdf-format="a4"
                pdf-orientation="portrait"
                pdf-content-width="800px"
                ref="html2Pdf"
            >
              <section slot="pdf-content">
                <v-container v-if="dialogDetailData">
                  <v-row>
                    <v-col sm="12" class="mb-2">
                      <center>
                        <h2 class="text-center">{{ dialogDetailData.training_no }}</h2>
                        <h3 class="text-center">Program Year : {{ dialogDetailData.program_year }}</h3>
                      </center>
                    </v-col>
                    <v-col sm="6" class="mb-2">
                      <table>
                        <tr>
                          <td>Unit Manager</td>
                          <td>:</td>
                          <td>{{ dialogDetailData.um_name }}</td>
                        </tr>
                        <tr>
                          <td>Field Coordinator</td>
                          <td>:</td>
                          <td>{{ dialogDetailData.fc_name }}</td>
                        </tr>
                        <tr>
                          <td>Field Facilitator</td>
                          <td>:</td>
                          <td>{{ dialogDetailData.ff_name }}</td>
                        </tr>
                        <tr>
                          <td>Tgl Pelatihan</td>
                          <td>:</td>
                          <td>{{ dateFormat(dialogDetailData.training_date, 'LL') }}</td>
                        </tr>
                      </table>
                    </v-col>
                    <v-col sm="6" class="mb-2">
                      <table>
                        <tr>
                          <td>Management Unit</td>
                          <td>:</td>
                          <td>{{ dialogDetailData.management_unit }}</td>
                        </tr>
                        <tr>
                          <td>Target Area</td>
                          <td>:</td>
                          <td>{{ dialogDetailData.target_area }}</td>
                        </tr>
                        <tr>
                          <td>Desa</td>
                          <td>:</td>
                          <td>{{ dialogDetailData.desa }}</td>
                        </tr>
                        <tr>
                          <td>Material Organik</td>
                          <td>:</td>
                          <td>Pupuk, Pestisida</td>
                        </tr>
                      </table>
                    </v-col>
                    <v-col sm="12">
                      <table>
                        <tr>
                          <td>Materi Pelatihan 1</td>
                          <td>:</td>
                          <td>{{ dialogDetailData.materi_1 }}</td>
                        </tr>
                        <tr>
                          <td>Materi Pelatihan 2</td>
                          <td>:</td>
                          <td>{{ dialogDetailData.materi_2 }}</td>
                        </tr>
                      </table>
                    </v-col>
                    <v-col sm="12">
                      <p style="margin-bottom: 5px;">Jumlah kehadiran petani: <strong>{{ dialogDetailData.farmers.length }}</strong></p>
                      <center>
                        <table border="1" style="border-collapse: collapse;width: 100%;">
                          <thead>
                            <tr>
                              <th rowspan="2">No</th>
                              <th colspan="3">Petani Peserta</th>
                            </tr>
                            <tr>
                              <th>Kode</th>
                              <th>Nama</th>
                              <th>NIK / No KTP</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(farmer, fIndex) in dialogDetailData.farmers" :key="farmer.kode">
                              <td align="center">{{ fIndex + 1 }}</td>
                              <td><span style="margin-left: 5px;">{{ farmer.farmer_no }}</span></td>
                              <td><span style="margin-left: 5px;">{{ farmer.name }}</span></td>
                              <td><span style="margin-left: 5px;">{{ farmer.nik }}</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </center>
                    </v-col>
                  </v-row>
                </v-container>
              </section>
            </vue-html2pdf>
            <v-container v-if="dialogDetailData">
              <div class="mb-2">
                <h2 class="text-center">{{ dialogDetailData.training_no }}</h2>
                <h3 class="text-center">Program Year : {{ dialogDetailData.program_year }}</h3>
              </div>
              <v-row class="mt-2">
                <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="6" class="mb-2">
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td>Unit Manager</td>
                          <td>:</td>
                          <td><strong>{{ dialogDetailData.um_name }}</strong></td>
                        </tr>
                        <tr>
                          <td>Field Coordinator</td>
                          <td>:</td>
                          <td><strong>{{ dialogDetailData.fc_name }}</strong></td>
                        </tr>
                        <tr>
                          <td>Field Facilitator</td>
                          <td>:</td>
                          <td><strong>{{ dialogDetailData.ff_name }}</strong></td>
                        </tr>
                        <tr>
                          <td>Tgl Pelatihan</td>
                          <td>:</td>
                          <td><strong>{{ dateFormat(dialogDetailData.training_date, 'LL') }}</strong></td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="6" class="mb-2">
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td>Management Unit</td>
                          <td>:</td>
                          <td><strong>{{ dialogDetailData.management_unit }}</strong></td>
                        </tr>
                        <tr>
                          <td>Target Area</td>
                          <td>:</td>
                          <td><strong>{{ dialogDetailData.target_area }}</strong></td>
                        </tr>
                        <tr>
                          <td>Desa</td>
                          <td>:</td>
                          <td><strong>{{ dialogDetailData.desa }}</strong></td>
                        </tr>
                        <tr>
                          <td>Material Organik</td>
                          <td>:</td>
                          <td><strong>Pupuk, Pestisida</strong></td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <v-col lg="12">
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td>Materi Pelatihan 1</td>
                          <td>:</td>
                          <td><strong>{{ dialogDetailData.materi_1 }}</strong></td>
                        </tr>
                        <tr>
                          <td>Materi Pelatihan 2</td>
                          <td>:</td>
                          <td><strong>{{ dialogDetailData.materi_2 }}</strong></td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="8" xl="8">
                  <p style="margin-bottom: 5px;">Jumlah kehadiran petani: <strong>{{ dialogDetailData.farmers.length }}</strong></p>
                  <!-- Table List Petani Peserta Pelatihan -->
                  <v-data-table
                    :headers="tables.farmerListDetailModal.headers"
                    :items="dialogDetailData.farmers"
                    class="elevation-3 rounded-xl"
                    item-key="kode"
                    :loading="tables.farmerListDetailModal.loading"
                    loading-text="Loading... Please wait"
                    :search="tables.farmerListDetailModal.search"
                    :items-per-page="10"
                    :footer-props="{
                      itemsPerPageOptions: [10, 25, 40, -1]
                    }"
                  >
                    <template v-slot:item.index="{ index }">
                      {{ index + 1 }}
                    </template>
                    <template v-slot:item.photo="{item}">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-avatar color="secondary" size="56" class="my-1 cursor-pointer" @click="() => {preview.petani.data = {kode: item.farmer_no, nik: item.nik, nama: item.name};preview.petani.modal = true;}" v-bind="attrs" v-on="on" >
                            <img
                              :src="`https://t4tadmin.kolaborasikproject.com/Uploads/fphoto_${item.nik}.jpg`"
                              :alt="`Foto petani ${item.nama}`"
                            >
                          </v-avatar>
                        </template>
                        <span>Klik untuk preview</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="4" xl="4">
                  <h4>Foto Absensi</h4>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-carousel 
                        cycle
                        height="250"
                        v-model="carousel.absensi_img"
                        show-arrows-on-hover
                        hide-delimiter-background
                        class="rounded-xl elevation-5 mb-2"
                      >
                        <v-carousel-item v-for="(absensiImg, aIIndex) in dialogDetailData.absent" :key="aIIndex">
                          <v-img
                            aspect-ratio="1"
                            class="rounded-xl cursor-pointer"
                            transition="fade-transition"
                            :src="absensiImg"
                            @click="() => {preview.lightbox.imgs = dialogDetailData.absent; preview.lightbox.index = aIIndex; preview.lightbox.isVisible = true}"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <template v-slot:placeholder>
                              <v-skeleton-loader
                                class="mx-auto rounded-xl"
                                type="image"
                              ></v-skeleton-loader>
                            </template>
                          </v-img>
                        </v-carousel-item>
                      </v-carousel>
                    </template>
                    <span>Klik untuk preview Foto Absensi</span>
                  </v-tooltip>
                  <h4>Foto Dokumentasi</h4>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-img
                        aspect-ratio="1"
                        class="rounded-xl cursor-pointer mb-2 elevation-5"
                        transition="fade-transition"
                        :src="(dokumentasiFTUrl+dialogDetailData.documentation_photo)"
                        @click="() => {preview.lightbox.imgs = (dokumentasiFTUrl+dialogDetailData.documentation_photo); preview.lightbox.index = 0; preview.lightbox.isVisible = true}"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template v-slot:placeholder>
                          <v-skeleton-loader
                            class="mx-auto rounded-xl"
                            type="image"
                          ></v-skeleton-loader>
                        </template>
                      </v-img>
                    </template>
                    <span>Klik untuk preview Dokumentasi</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="ma-2">
            <v-row>
              <v-col>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      dark
                      color="blue lighten-1"
                      @click="generateReport"
                      rounded
                      class="d-none d-lg-block"
                    >
                      <v-icon class="mr-1" small>mdi-printer</v-icon> Export
                    </v-btn>
                  </template>
                  <span>Export to .pdf</span>
                </v-tooltip>
              </v-col>
              <v-col align="end">
                <v-btn
                  rounded
                  outlined
                  color="red lighten-1"
                  @click="dialogDetail = false"
                >
                  <v-icon class="mr-1" small>mdi-close</v-icon> Close
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Preview Petani Modal -->
      <v-dialog v-model="preview.petani.modal" max-width="500px" content-class="rounded-xl" scrollable>
        <v-card class="rounded-xl">
          <v-card-title>
            {{ preview.petani.data.kode }} -
            {{ preview.petani.data.nama }}
          </v-card-title>
          <v-card-text class="pa-1 fontall">
            <v-container>
              <v-img
                class="w-100 rounded-lg"
                :lazy-src="`https://t4tadmin.kolaborasikproject.com/Uploads/fphoto_${preview.petani.data.nik}.jpg`"
                :src="`https://t4tadmin.kolaborasikproject.com/Uploads/fphoto_${preview.petani.data.nik}.jpg`"
              ></v-img>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              elevation="1"
              outlined
              class="rounded-lg"
              @click="preview.petani.modal = false"
            >
              <v-icon left> mdi-close-circle-outline </v-icon>
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Preview Absensi Modal -->
      <v-dialog v-model="preview.absensi.modal" max-width="500px" content-class="rounded-xl" scrollable>
        <v-card class="rounded-xl">
          <v-card-title>
            Preview Absensi Photo
          </v-card-title>
          <v-card-text class="pa-1 fontall">
            <v-container>
              <v-img
                class="w-100 rounded-lg"
                :lazy-src="`${preview.absensi.url}`"
                :src="`${preview.absensi.url}`"
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
              @click="preview.absensi.modal = false"
            >
              <v-icon left> mdi-close-circle-outline </v-icon>
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Preview Petani Modal ~ before adding to participant list -->
      <v-dialog v-model="preview.addParticipant.modal" max-width="800px" content-class="rounded-xl" persistent scrollable>
        <v-card class="rounded-xl">
          <v-card-title class="headermodalstyle mb-0 rounded-none">Konfirmasi Petani</v-card-title>
          <v-card-text class="pa-1 fontall">
            <v-container>
              <v-row>
                <v-col lg="6" style="display: inline-flex;justify-content: start;align-items: start;">
                  <table>
                    <tr>
                      <td>No Petani</td>
                    </tr>
                    <tr>
                      <td><h3 class="mb-2">{{ preview.addParticipant.data.kode }}</h3></td>
                    </tr>
                    <tr>
                      <td>Nama</td>
                    </tr>
                    <tr>
                      <td><h3 class="mb-2">{{ preview.addParticipant.data.nama }}</h3></td>
                    </tr>
                    <tr>
                      <td>NIK / No KTP</td>
                    </tr>
                    <tr>
                      <td><h3 class="mb-2">{{ preview.addParticipant.data.nik }}</h3></td>
                    </tr>
                    <tr>
                      <td>Desa</td>
                    </tr>
                    <tr>
                      <td><h3 class="mb-2">{{ preview.addParticipant.data.desa }}</h3></td>
                    </tr>
                    <tr>
                      <td>FF <small>(Field Facilitator)</small></td>
                    </tr>
                    <tr>
                      <td><h3 class="mb-2">{{ preview.addParticipant.data.user }}</h3></td>
                    </tr>
                  </table>
                </v-col>
                <v-col lg="6">
                  <v-img
                    class="w-100 rounded-lg"
                    :lazy-src="`https://t4tadmin.kolaborasikproject.com/Uploads/fphoto_${preview.addParticipant.data.nik}.jpg`"
                    :src="`https://t4tadmin.kolaborasikproject.com/Uploads/fphoto_${preview.addParticipant.data.nik}.jpg`"
                  ></v-img>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green"
              elevation="1"
              outlined
              rounded
              @click="() => {addingToTableFarmerParticipant(preview.addParticipant.data)}"
            >
              <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
              Tambah
            </v-btn>
            <v-btn
              rounded
              color="red"
              elevation="1"
              outlined
              @click="() => {preview.addParticipant.modal = false;addMoreFarmerParticipantSelectValue = null}"
            >
              <v-icon left> mdi-close-circle-outline </v-icon>
              Tidak Jadi
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Delete -->
      <v-dialog v-model="dialogDelete" max-width="500px" content-class="rounded-xl">
        <v-card class="rounded-xl pb-2">
          <v-card-title class="headline"
            >Are you sure you want to delete this item?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="px-2 pr-4" color="red darken-1" dark rounded @click="closeDelete"
              >
              <v-icon class="mr-1">mdi-close</v-icon>
              Cancel</v-btn
            >
            <v-btn class="px-2 pr-4" color="blue darken-1" dark rounded @click="deleteItemConfirm"
              >
              <v-icon class="mr-1">mdi-check</v-icon>
              OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- END: MODAL -->

    <!-- main table -->
    <v-data-table
      :headers="headers"
      :items="dataobject"
      :search="search"
      :loading="loadtable"
      loading-text="Loading... Please wait"
      :class="`${$store.state.theme == 'dark' ? '' : ''} rounded-xl elevation-6 mx-3 pa-1`"
    >
      <template v-slot:top>
          <v-row class="pa-4 align-center px-5 justify-center">
            <!-- Refresh Button -->
            <v-btn
              dark
              @click="initialize()"
              color="info"
              rounded
              class="mb-2 mb-lg-0"
            >
              <v-icon small class="mr-1">mdi-refresh</v-icon> Refresh
            </v-btn>
            <v-divider class="d-none d-md-block mx-2"></v-divider>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              outlined
              rounded
              class="mr-2"
              dense
              hide-details
            ></v-text-field>
            <v-btn
              dark
              class="mb-2 mr-1 mt-2 mt-lg-0"
              @click="showAddModal()"
              color="green"
              rounded
            >
              <v-icon small>mdi-plus</v-icon> Add
            </v-btn>
          </v-row>
      </template>

      <!-- Date -->
      <template v-slot:item.training_date="{ item }">
        {{ dateFormat(item.training_date, 'DD MMMM Y') }}
      </template>
      <!-- Action table -->
      <template v-slot:item.actions="{ item, index }">
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
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" rounded @click="showDetailFarmerTraining(item.training_no)" color="info">
                    <v-icon class="mr-1">
                      mdi-information-outline
                    </v-icon>
                    Detail
                  </v-btn>
                </template>
                <span>Detail</span>
              </v-tooltip>
            </v-list-item>
            <v-list-item v-if="getDeleteAccess(User, item)">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark v-bind="attrs" v-on="on" rounded @click="showDeleteModal(item)" color="red">
                    <v-icon class="mr-1">
                      mdi-delete
                    </v-icon>
                    Hapus
                  </v-btn>
                </template>
                <span>Hapus</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snackbar"
      :color="colorsnackbar"
      :timeout="timeoutsnackbar"
      rounded="xl"
    >
      {{ textsnackbar }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          outlined
          rounded
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon class="mr-1" small>mdi-close</v-icon>
          Close
        </v-btn>
      </template>
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
  authtoken: "",
  data: () => ({
    carousel: {
      absensi_img: 0
    },
    showedAbsensi2: false,
    overlay: false,
    datePickerMenu: false,
    dataToStore: {
      um_no: "",
      fc_no: "",
      ff_no: "",
      absensi_img: "",
      absensi_img2: "",
      dokumentasi_img: "",
      materi_1: 'TR010',
      materi_2: null,
      material_organic: ['ORG22090001', 'ORG22090002'],
      program_year: '2022',
      date: '',
      farmers: []
    },
    // temporary
    temporaryTableDatas: [],
    dialogDetailData: null,
    absensiPreview: '',
    absensiPreview2: '',
    dokumentasiPreview: '',
    absensiFTUrl: 'https://t4tadmin.kolaborasikproject.com/farmer-training/absensi-images/',
    dokumentasiFTUrl: 'https://t4tadmin.kolaborasikproject.com/farmer-training/documentation-photos/',

    tables: {
      farmerListDetailModal: {
        headers: [
        { text: "No", value: "index", width: "15%" },
        { text: "Foto", value: "photo", width: "20%" },
        { text: "No Petani", value: "farmer_no", width: "30%" },
        { text: "Nama Petani", value: "name", width: "40%" },
        ],
        items: [],
        loading: false,
        search: ''
      }
    },

    options: {
      materiPelatihan: [],
      material_organic: []
    },
    componentKey: {
      listFarmerParticipantTable: 0,
      absensiImageInput: 100,
      absensiImageInput2: 200,
      dokumentasiImageInput: 200,
    },
    alerttoken: false,
    itemsbr: [
      {
        text: "Activities",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Pelatihan Petani",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    e1: 1,
    User: [],
    dialogAddonly: false,
    dialog: false,
    dialogDelete: false,
    idDelete: null,
    absensiDelete: null,
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
      { text: "Form No", value: "training_no" },
      { text: "Nama FC", value: "fc_name" },
      { text: "Nama FF", value: "ff_name", align: "start" },
      { text: "Desa", value: "desa", align: "start" },
      { text: "Tanggal", value: "training_date" },
      { text: "Tahun Tanam", value: "program_year" },
      { text: "Created By", value: "created_by" },
      { text: "Actions", align: 'right', value: "actions", sortable: false },
    ],
    // headers table list peserta pelatihan di form tambah pelatihan petani 
    headerListProduct: [
      { text: "No", value: "index", width: "7%" },
      { text: "Foto", value: "photo", width: "10%" },
      { text: "No Petani", value: "kode", width: "20%" },
      { text: "Nama Petani", value: "nama", width: "30%" },
      { text: "NIK", value: "nik", width: "20%" },
      { text: "Del", value: "actions", sortable: false, width: "10%" },
    ],
    dataobject: [],
    defaultItem: {
      id: "",
      ph_form_no: "",
      farmer_no: "",
      lahan_no: "",
      latitude: "",
      longitude: "",
      total_holes: 0,
      planting_year: "2021",
      farmer_signature: "",
      gambar1: "",
      gambar2: "",
      gambar3: "",
      pohon_kayu: "",
      pohon_mpts: "",
      tanaman_bawah: "",
      validate_by: "",
      validate_name: "",
      is_validate: "",
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
    listFarmerParticipant: [],
    listFarmerParticipantChecked: [],
    addMoreFarmerParticipantSelectValue: null,
    searchListPesertaPelatihan: "",
    itemslahan: [],
    itemsum: [],
    itemsfc: [],
    itemsff: [],
    itemspetani: [],
    itemspetaniallmu: [],
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
    selectFF: "",
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

    valid: true,
    BaseUrlUpload: "",
    BaseUrl: "",
    RoleAccesFilterShow: true,
    RoleAccesDownloadAllShow: true,
    RoleAccesCRUDShow: true,
    RoleAccesPrintLabelShow: true,
    RoleAccesIT: false,
    
    valueMUExcel: "",
    valueTAExcel: "",
    valueVillageExcel: "",
    typegetdataExcel: "",
    valueFFcodeExcel: "",

    // snackbar
    snackbar: false,
    textsnackbar: "Test",
    colorsnackbar: null,
    timeoutsnackbar: 100000,

    employee_no: "",
    preview: {
      petani: {
        modal: false,
        data: {},
      },
      absensi: {
        modal: false,
        url: '',
      },
      addParticipant: {
        modal: false,
        data: {},
      },
      lightbox: {
        isVisible: false,
        imgs: '',
        index: 0
      }
    },
    loading: {
      um: false,
      fc: false,
      ff: false,
      farmer: false
    },
  }),

  watch: {
    'e1': {
      handler(newValue) {
        console.log(newValue)
      }
    }
  },

  created() {
    this.firstAccessPage();
    this.dataToStore.program_year = new Date().getFullYear().toString()
    this.dataToStore.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 70000)).toISOString().substr(0, 10)
  },

  methods: {
    async initialize() {
      this.loadtable = true;
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetFarmerTrainingAllAdmin?mu=" +
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
        if (response.data.length != 0) {
          this.dataobject = response.data.data.result;
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
          this.sessionEnd(error)
        } else {
          this.dataobject = [];
          this.loadtable = false;
        }
      }
    },
    firstAccessPage() {
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.BaseUrl = localStorage.getItem("BaseUrl");
      this.employee_no = this.User.employee_no;
      // this.fc_no_global = this.User.fc.fc;
      this.checkRoleAccess();
      this.initialize();
      this.getMU();
      this.getFF();
      this.getUMAll();
      this.BaseUrlUpload = localStorage.getItem("BaseUrlUpload");
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
          alert("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
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
          alert("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
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
        if (response.data.length != 0) {
          if (val == "table") {
            this.itemsVillage = response.data.data.result;
          } else {
            this.itemsVillageForm = response.data.data.result;
          }
          // this.dataobject = response.data.data.result;
        } else {
          alert("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
      }
    },
    async getFF(fc_no) {
      let fcNo = fc_no ? fc_no : null
      if (this.User.fc.fc && fcNo == null) {
        this.fc_no_global = this.User.fc.fc;
        fcNo = this.User.fc.fc
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetFieldFacilitatorAll?fc_no=" + fcNo,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        if (response.data.length != 0) {
          this.itemsff = response.data.data.result.data;
          this.loaddownload = false;
          // this.dataobject = response.data.data.result;
        } else {
          alert("Kosong");
          this.loaddownload = false;
        }
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
        this.loaddownload = false;
      }
    },
    async verif() {
      const datapost = {
        ph_form_no: this.defaultItem.ph_form_no,
        validate_by: this.employee_no,
      };
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "ValidatePlantingHole",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
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
        this.sessionEnd(error)
      }
    },

    async getUMAll() {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        this.loading.um = true
        const response = await axios.get(
          this.BaseUrlGet + "GetEmployeebyPosition?position_code=20",
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        if (response.data.length != 0) {
          this.itemsum = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
          this.loading.um = false
        } else {
          alert('data kosong')
          this.loading.um = false
        }
      } catch (error) {
        this.loading.um = false
        console.error(error.response);
        this.sessionEnd(error)
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
        if (response.data.length != 0) {
          this.itemsfc = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          alert("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
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
        if (response.data.length != 0) {
          this.valueFFcode = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          alert("Kosong");
        }
      } catch (error) {
        this.valueFFcode = "";
        console.error(error.response);
        this.sessionEnd(error)
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
        if (response.data.length != 0) {
          this.itemspetani = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          this.itemspetani = [];
        }
      } catch (error) {
        console.error(error.response)
        this.sessionEnd(error)
        this.itemspetani = []
        this.defaultItem.farmer_no = ""
      }
    },
    async getPetaniByMU(mu_no, ta_no) {
      // if (this.User.fc.fc) {
      //   this.fc_no_global = this.User.fc.fc;
      // }
      try {
        const params = new URLSearchParams({
          typegetdata: 'all',
          mu: mu_no,
          ta: ta_no
        })
        const response = await axios.get(
          this.BaseUrlGet +
            "GetFarmerAllAdmin?" + params,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        if (response.data.length != 0) {
          this.itemspetaniallmu = response.data.data.result.data;
          // this.dataobject = response.data.data.result;
        } else {
          this.itemspetaniallmu = [];
        }
      } catch (error) {
        console.error(error.response);
        this.sessionEnd(error)
        this.itemspetaniallmu = [];
        this.defaultItem.farmer_no = ""
      }
    },
    async addMoreFarmerParticipant(val) {
      if (val) {
        this.loadtabledetail = true
        let same = 0
        await this.listFarmerParticipant.forEach((participant) => {
          if (participant.kode === val.kode) {
            same += 1
          } 
        });

        if (same === 0) {
          this.preview.addParticipant.data = val
          this.preview.addParticipant.modal = true
          this.loadtabledetail = false
        } else {
          this.loadtabledetail = false
          this.addMoreFarmerParticipantSelectValue = null
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Petani sudah ada.";
        }
      }
    },
    async addingToTableFarmerParticipant(val) {
      this.listFarmerParticipant.push(val)
      this.listFarmerParticipantChecked.push(val)
      this.addMoreFarmerParticipantSelectValue = null
      this.preview.addParticipant.data = {}
      this.preview.addParticipant.modal = false
      this.colorsnackbar = "green";
      this.textsnackbar = "Petani berhasil ditambahkan";
      this.snackbar = true;
    },
    // SAVING FARMER TRAINING
    async saveFormFarmerTraining() {
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data;
      this.loadsave = true
      this.overlay = true
      this.dialogAddonly = false
      this.showedAbsensi2 = false
      // insert UM FC FF data
      this.dataToStore.um_no = this.selectUM
      this.dataToStore.fc_no = this.selectFC
      this.dataToStore.ff_no = this.selectFF.ff_no

      // insert MU TA DESA
      this.dataToStore.mu_no = this.selectFF.mu_no
      this.dataToStore.target_area = this.selectFF.target_area
      this.dataToStore.working_area = this.selectFF.working_area

      // insert list farmer participant
      await this.listFarmerParticipantChecked.forEach((farmerParticipant) => {
        this.dataToStore.farmers.push(farmerParticipant.kode)
      })
      this.temporaryTableDatas.push(this.dataToStore)

      const dataForPost = {
        training_date: this.dataToStore.date,
        first_material: this.dataToStore.materi_1,
        second_material: this.dataToStore.materi_2,
        organic_material: this.dataToStore.material_organic,
        program_year: this.dataToStore.program_year,
        absent: this.dataToStore.absensi_img,
        dokumentasi: this.dataToStore.dokumentasi_img,
        mu_no: this.selectFF.mu_no,
        target_area: this.selectFF.target_area,
        village: this.selectFF.working_area,
        field_coordinator: this.dataToStore.fc_no,
        ff_no: this.dataToStore.ff_no,
        user_id: this.User.email,
        status: 1,
        farmers: this.dataToStore.farmers
      }
      if (this.dataToStore.absensi_img2 != '' && typeof this.dataToStore.absensi_img2 !== 'undefined') {
        dataForPost.absent2 = this.dataToStore.absensi_img2
      }
      console.log(dataForPost)
      
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddFarmerTraining",this.generateFormData(dataForPost),
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
              "Content-Type": "multipart/form-data"
            },
          }
        )
        if (response) {
            this.textsnackbar = "Berhasil menambah data pelatihan"
            this.snackbar = true
            this.colorsnackbar = 'green lighten-1'
            await this.resetvalue()
            await this.initialize()
        } else {
          console.log('failed')
          this.textsnackbar = "Gagal menambah data pelatihan"
          this.snackbar = true
          this.colorsnackbar = 'red lighten-1'
        }
      } catch(error) {
          this.textsnackbar = error.response.data.data.status.code + ': ' +error.response.data.data.status.description
          this.colorsnackbar = 'red lighten-1'
          this.snackbar = true
        this.sessionEnd(error)
      } finally {
        this.loadsave = false
        this.overlay = false
        this.close()
      }
    },

    async showDetailFarmerTraining(training_no) {
      this.overlay = true
      try {
        const response = await axios.get(
          this.BaseUrlGet + "DetailFarmerTraining?training_no=" + training_no,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        )
        if (response.data.data.result) {
          this.dialogDetailData = response.data.data.result
          if (this.dialogDetailData.absent.length > 0) {
            let absensiWithUrl = []
            await this.dialogDetailData.absent.forEach((absVal) => {
              absensiWithUrl.push(`${this.absensiFTUrl}${absVal}`)
            })
            this.dialogDetailData.absent = absensiWithUrl
          }
          this.dialogDetail = true
          console.log(this.dialogDetailData)
        } else {
          console.log(response.data);
        }
      }  catch (error) {
        this.sessionEnd(error)
        console.log(error.response.data.data);
      } finally {
        this.overlay = false
      }
    },

    selectedMU(a) {
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
      this.valueVillage = a;
      if (a == null) {
        this.valueVillage = "";
      }
      // this.initialize();
    },
    async selectedUM(a) {
      this.valueUM = a;
      if (a != null) {
        this.loading.fc = true
        await this.getEmpFCbyManager(a);
        await this.GetFFbyUMandFC("UM", a);
        this.valueFC = "";
        this.selectFC = "";
        this.typegetdata = "several";
        this.loading.fc = false
      } else {
        this.valueUM = "";
        this.valueFC = "";
        this.itemsfc = [];
        this.typegetdata = this.User.ff.value_data;
      }
        this.selectFF = "";
        this.itemsff = [];
      // this.initialize();
    },
    async selectedFC(a) {
      this.loading.ff = true
      this.valueFC = a;
      await this.GetFFbyUMandFC("FC", a);
      this.typegetdata = "several";
      if (a == null) {
        this.valueFC = "";
        this.selectFC = "";
        this.selectFF = "";
        this.itemsff = [];
        this.typegetdata = this.User.ff.value_data;
        this.loading.ff = false
      } else {
        this.getFF(a)
        this.loading.ff = false
      }
    },

    selectedMUForm(a) {
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
      this.valueVillageForm = a;
      this.defaultItem.village = a;
      if (a == null) {
        this.valueVillageForm = "";
        this.defaultItem.village = "";
      }
    },
    selectPetani(a) {
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
    async selectPetaniWithMUScope(a) {
      if (a != null) {
        this.valueFFForm = a.ff_no;
        this.loading.farmer = true
        this.loadtabledetail = true
        await this.getPetani();
        await this.getPetaniByMU(a.mu_no, a.target_area);
        this.loadtabledetail = false
        this.listFarmerParticipant = []
        await this.itemspetani.forEach((val, index) => {
          let programYearPetani = this.getProgramYearPetani(val.mou_no)
          if (programYearPetani == 2022) {
            this.listFarmerParticipant.push(val)
          }
        });
        this.loading.farmer = false
      } else {
        this.defaultItem.ff_no = "";
        this.defaultItem.kode = "";
        this.itemspetani = [];
      }
      this.listFarmerParticipantChecked = []
    },
    async deletePesertaPelatihan(index, item) {
      this.loadtabledetail = true
      await this.listFarmerParticipantChecked.forEach((checkedParticipant, indexCP) => {
        if (checkedParticipant.kode === item.kode) {
          this.listFarmerParticipantChecked.splice(indexCP, 1);
        }
      })
      await this.listFarmerParticipant.splice(index, 1);
      
      this.componentKey.listFarmerParticipantTable += 1
      this.loadtabledetail = false
    },

    async showFilterArea() {
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
    async showAddModal() {
      this.overlay = true
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.itemsff = []

      // Get Training Materi Options
      if (this.options.materiPelatihan.length == 0) {
        await this.getTrainingMateriOption()
      }

      // Get Organic Options
      if (this.options.material_organic.length == 0) {
        await this.getOrganicMaterialsOption()
      }
      
      this.overlay = false
      this.formTitle = "Form Pelatihan Petani";
      this.dialogAddonly = true;

      this.resetvalue();

      // field coordinator
      if (this.User.role_name === "FIELD COORDINATOR") {
        this.selectUM = this.User.EmployeeStructure.manager_code
        await this.selectedUM(this.User.EmployeeStructure.manager_code)
        this.selectFC = this.User.employee_no
        await this.selectedFC(this.User.employee_no)
      } 
      // Unit Manager
      if (this.User.role_name === "UNIT MANAGER") {
        this.selectUM = this.User.employee_no
        await this.selectedUM(this.User.employee_no)
      }
    },

    showDeleteModal(item) {
      this.idDelete = item.ft_id;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.dialogDelete = false
      this.overlay = true
      try {
        const response = await axios.post(
          this.BaseUrlGet + 'DeleteFarmerTraining',
          {
            id: this.idDelete,
            user_email: this.User.email
          },
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        )
        if (response) {
          this.snackbar = true
          this.textsnackbar = "Berhasil menghapus data"
          this.colorsnackbar = 'green lighten-1'
          this.initialize()
        }
      }  catch (error) {
        this.sessionEnd(error)
        console.log(error);
      } finally {
        this.idDelete = null
        this.overlay = false
      }
    },
    close() {
      this.dialog = false;
      this.dialogAddProduct = false;
      this.dialogdownload = false;
      this.dialogAddonly = false;
      this.showedAbsensi2 = false
      // reset data
      this.listFarmerParticipant= []
      this.listFarmerParticipantChecked= []
      this.addMoreFarmerParticipantSelectValue= null
      this.searchListPesertaPelatihan= ""
      this.itemspetaniallmu= []
      this.selectUM = null
      this.selectFC = null
      this.selectFF = null
    },
    closeDelete() {
      this.idDelete = null
      this.dialogDelete = false;
    },
    async deleteExternalAbsensiImage(imagesName) {
      try {
        await axios.post(
          'https://t4tadmin.kolaborasikproject.com/farmer-training/delete.php', this.generateFormData({
            nama: imagesName,
          }),
          {
            headers: {
              "Content-Type": "multipart/form-data"
            },
          }
        )
      } catch(error) {
        console.log(error)
      }
    },
    // get options
    async getTrainingMateriOption() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + 'GetTrainingMaterials',
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        )
        if (response.data.data.result) {
          this.options.materiPelatihan = response.data.data.result
          // set materi 10 disable
          await this.options.materiPelatihan.forEach((maPel, index) => {
            if (maPel.material_no == 'TR010') {
              this.options.materiPelatihan[index] = {
                ...this.options.materiPelatihan[index],
                disabled: true
              }
            }
          })
        } else {
          this.options.materiPelatihan = []
        }
      } catch (error) {
        this.sessionEnd(error)
        console.log(error.response.data.data);
      }
    },
    async getOrganicMaterialsOption() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + 'GetOrganicAll',
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        )
        if (response.data.data.result) {
          this.options.material_organic = response.data.data.result
        } else {
          this.options.material_organic = []
        }
      } catch (error) {
        this.sessionEnd(error)
        console.log(error.response.data.data);
      }

    },
    // Utilities Function
    resetvalue() {
      this.dataToStore = {
        um_no: "",
        fc_no: "",
        ff_no: "",
        absensi_img: "",
        materi_1: 'TR010',
        materi_2: null,
        material_organic: ['ORG22090001', 'ORG22090002'],
        program_year: new Date().getFullYear().toString(),
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 70000)).toISOString().substr(0, 10),
        farmers: []
      }
      this.absensiPreview = ""
      this.absensiPreview2 = ""
      this.componentKey.absensiImageInput += 1
      this.componentKey.absensiImageInput2 += 1
      this.e1 = 1;

      this.absensiDelete = ''
    },
    getProgramYearPetani(text) {
        if (text.slice(13, 14) === '_') {
            return text.slice(9, 13)
        } else {
            return text.slice(4, 8)
        }
    },
    absensiFileChanged (event) {
      if (event) {
        this.dataToStore.absensi_img = event
        console.log(event.name)
        this.absensiPreview = URL.createObjectURL(event)
      } else {
        this.dataToStore.absensi_img = ""
        this.absensiPreview = ""
      }
    },
    absensiFileChanged2 (event) {
      if (event) {
        this.dataToStore.absensi_img2 = event
        this.absensiPreview2 = URL.createObjectURL(event)
      } else {
        this.dataToStore.absensi_img2 = ""
        this.absensiPreview2 = ""
      }
    },
    dokumentasiFileChanged (event) {
      if (event) {
        this.dataToStore.dokumentasi_img = event
        console.log(event.name)
        this.dokumentasiPreview = URL.createObjectURL(event)
      } else {
        this.dataToStore.dokumentasi_img = ""
        this.dokumentasiPreview = ""
      }
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
    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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
    getDeleteAccess(user, item) {
      if (user.role_group === 'IT') return true
      else if (user.role_name === 'UNIT MANAGER') return true
      else if (item.mu_name === 'CITARIK' && user.role_name === 'REGIONAL MANAGER') return true
      else return false 
    },
    sessionEnd(error) {
        if (error.response.status == 401) {
          this.alerttoken = true
          this.dialogAddonly = false
          this.showedAbsensi2 = false
          this.dialog = false
          this.dialogDelete = false
          this.dialogDetail = false
          this.dialogFilterArea = false
          this.dialogFilterEmp = false
          this.dialogShowEdit = false
          this.dialogDetailPohon = false
          this.dialogDetailPohonEdit = false
          this.dialogAddProduct = false
          this.dialogCetakPilihan = false
          this.dialogdownload = false
          this.preview.petani.modal = false
          this.preview.absensi.modal = false
          this.preview.addParticipant.modal = false
          localStorage.removeItem("token");
          this.$router.push("/");
        }
    },
    stepperMove(type) {
      let step = parseInt(this.e1)
      if (type == '+') this.e1 = step += 1
      else if (type == '-') this.e1 = step -= 1
    },
    // Temporary
    deleteTemporary(index) {
      this.temporaryTableDatas.splice(index, 1)
    },
  },
};
</script>
