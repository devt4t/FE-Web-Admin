<template>
  <div>
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
      data-aos="fade-right"
    ></v-breadcrumbs>
    <div class="mx-9">
      <v-alert :value="alerttoken" color="red" elevation="24" type="error">
        Session Token Login Habis, Login Kembali !
      </v-alert>
    </div>
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
            <v-btn color="blue darken-1" text @click="closeDelete"
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

      <!-- Modal Add Edit -->
      <v-dialog v-model="dialog" max-width="800px">
        <v-card rounded="xl">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title class="mb-1 headermodalstyle">
              <span class="headline">{{ formTitle }}</span>
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
                      v-model="defaultItem.kode"
                      :items="itemspetani"
                      item-text="nama"
                      item-value="kode"
                      label="Pilih Petani"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col v-if="showAdd == true" cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="defaultItem.barcode"
                      label="No Barcode"
                      outlined
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="defaultItem.document_no"
                      label="No SPPT/Document"
                      outlined
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="defaultItem.type_sppt"
                      :items="itemskepemilikan"
                      item-text="text"
                      item-value="value"
                      label="Pilih Status SPPT"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="defaultItem.latitude"
                      label="Latitude"
                      outlined
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="defaultItem.longitude"
                      label="Longitude"
                      outlined
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="defaultItem.mu_no"
                      :items="itemsMU"
                      item-text="name"
                      item-value="mu_no"
                      label="Management Unit"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                      v-on:change="selectedMUForm"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="defaultItem.target_area"
                      :items="itemsTAForm"
                      item-text="name"
                      item-value="area_code"
                      label="Target Area"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                      v-on:change="selectedTAForm"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="defaultItem.village"
                      :items="itemsVillageForm"
                      item-text="name"
                      item-value="kode_desa"
                      label="Desa"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                      v-on:change="selectedVillageForm"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="defaultItem.land_area"
                      label="Luas Area"
                      outlined
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="defaultItem.planting_area"
                      label="Area Tanam"
                      outlined
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="defaultItem.water_availability"
                      :items="itemsWaterAvainility"
                      item-text="text"
                      item-value="value"
                      label="Ketersediaan Air"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="defaultItem.jarak_lahan"
                      :items="itemsJarakLahan"
                      item-text="text"
                      item-value="value"
                      label="Jarak ke Lahan"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="defaultItem.access_to_lahan"
                      :items="itemsAksesJalan"
                      item-text="text"
                      item-value="value"
                      label="Akses Jalan"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="defaultItem.access_to_water_sources"
                      :items="itemsAksesAir"
                      item-text="text"
                      item-value="value"
                      label="Akses Air"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="defaultItem.fertilizer"
                      :items="itemsKimia"
                      item-text="text"
                      item-value="value"
                      label="Fertilizer"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="defaultItem.pesticide"
                      :items="itemsKimia"
                      item-text="text"
                      item-value="value"
                      label="Pesticide"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      v-model="defaultItem.opsi_pola_tanam"
                      :items="itemsOpsiPolaTanam"
                      item-text="text"
                      item-value="value"
                      label="Opsi Pola Tanam"
                      outlined
                      clearable
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-select
                      v-model="defaultItem.lahan_type"
                      :items="itemsLahanType"
                      item-text="text"
                      item-value="value"
                      label="Tipe Lahan"
                      outlined
                      clearable
                      color="green"
                      item-color="green"
                      :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-select
                      v-model="defaultItem.polygon"
                      :items="itemsLahanPolygon"
                      item-text="text"
                      item-value="value"
                      label="Polygon"
                      outlined
                      clearable
                      color="green"
                      item-color="green"
                      :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                    >
                      <template v-slot:item="data">
                        <v-list-item-content>
                          <v-list-item-title v-html="data.item.text"></v-list-item-title>
                          <v-img v-if="data.item.img" :src="data.item.img" style="max-width: 200px"></v-img>
                        </v-list-item-content>
                      </template>
                    </v-select>
                    <!-- <v-text-field
                      v-model="defaultItem.polygon"
                      label="Polygon"
                      outlined
                    ></v-text-field> -->
                  </v-col>
                  <!-- 
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="defaultItem.soil_type"
                      :items="itemsTanahType"
                      item-text="text"
                      item-value="value"
                      label="Tipe Tanah"
                      outlined
                      clearable
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-select
                      v-model="defaultItem.potency"
                      :items="itemsPotency"
                      item-text="text"
                      item-value="value"
                      label="Potency"
                      outlined
                      clearable
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="defaultItem.kelerengan_lahan"
                      label="Kelerengan Lahan"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="defaultItem.exposure"
                      label="Exposure"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="defaultItem.elevation"
                      label="Elevation"
                      outlined
                    ></v-text-field>
                  </v-col>                      
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="defaultItem.current_crops"
                      label="Current Crops"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="defaultItem.tutupan_lahan"
                      label="Tutupan Lahan"
                      outlined
                    ></v-text-field>
                  </v-col> -->
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="defaultItem.description"
                      label="Deskripsi"
                      outlined
                      rows="2"
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-textarea>
                  </v-col>
                  <v-container>
                    <v-row>
                      <v-col cols="6" md="4">
                        <div>Foto SPPT/ Dokument</div>
                        <v-card
                          class="d-flex align-center"
                          elevation="2"
                          height="200"
                        >
                          <v-img
                            height="200"
                            v-bind:src="defaultItem.sppt"
                            class="my-2 mb-4"
                          ></v-img>
                        </v-card>
                      </v-col>
                      <v-col cols="6" md="4">
                        <div>Foto Lahan 1</div>
                        <v-card
                          class="d-flex align-center"
                          elevation="2"
                          height="200"
                        >
                          <v-img
                            height="200"
                            v-bind:src="defaultItem.photo1"
                            class="my-2 mb-4"
                          ></v-img>
                        </v-card>
                      </v-col>
                      <v-col cols="6" md="4">
                        <div>Foto Lahan 2</div>
                        <v-card
                          class="d-flex align-center"
                          elevation="2"
                          height="200"
                        >
                          <v-img
                            height="200"
                            v-bind:src="defaultItem.photo2"
                            class="my-2 mb-4"
                          ></v-img>
                        </v-card>
                      </v-col>
                      <v-col cols="6" md="4">
                        <div>Foto Lahan 3</div>
                        <v-card
                          class="d-flex align-center"
                          elevation="2"
                          height="200"
                        >
                          <v-img
                            height="200"
                            v-bind:src="defaultItem.photo3"
                            class="my-2 mb-4"
                          ></v-img>
                        </v-card>
                      </v-col>
                      <v-col cols="6" md="4">
                        <div>Foto Lahan 4</div>
                        <v-card
                          class="d-flex align-center"
                          elevation="2"
                          height="200"
                        >
                          <v-img
                            height="200"
                            v-bind:src="defaultItem.photo4"
                            class="my-2 mb-4"
                          ></v-img>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-col cols="12" sm="12" md="12">
                    <v-file-input
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Pilih Foto SPPT/Document lain"
                      prepend-icon="mdi-camera"
                      show-size
                      label="Pilih Foto SPPT/Document lain"
                      v-on:change="pilihfotosppt"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-file-input
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Pilih Foto"
                      prepend-icon="mdi-camera"
                      show-size
                      label="Pilih Foto Lahan 1"
                      v-on:change="pilihfotolahan1"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-file-input
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Pilih Foto"
                      prepend-icon="mdi-camera"
                      show-size
                      label="Pilih Foto Lahan 2"
                      v-on:change="pilihfotolahan2"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-file-input
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Pilih Foto"
                      prepend-icon="mdi-camera"
                      show-size
                      label="Pilih Foto Lahan 3"
                      v-on:change="pilihfotolahan3"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-file-input
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Pilih Foto"
                      prepend-icon="mdi-camera"
                      show-size
                      label="Pilih Foto Lahan 4"
                      v-on:change="pilihfotolahan4"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions v-if="load == false">
              <v-spacer></v-spacer>
              <v-btn outlined color="red darken-1" @click="close">
                <v-icon left> mdi-close-circle-outline </v-icon>
                Cancel
              </v-btn>
              <v-btn outlined color="blue darken-1" @click="save">
                <v-icon left> mdi-content-save-all-outline </v-icon>
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- Modal Edit GIS -->
      <v-dialog v-model="dialogGIS" max-width="800px" content-class="rounded-xl" scrollable>
        <v-card>
          <v-card-title class="mb-1 headermodalstyle rounded-xl">
            <span class=""><v-icon class="mr-1 white--text">mdi-map-check</v-icon> Edit GIS</span>
            <v-divider class="mx-2" color="white"></v-divider>
            <v-icon @click="close" color="red">mdi-close-circle</v-icon>
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
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="defaultItem.ff_no"
                    :items="itemsff"
                    item-text="name"
                    item-value="ff_no"
                    label="Pilih Field Facilitator"
                    outlined
                    dense
                    hide-details
                    rounded
                    clearable
                    disabled
                    v-on:change="selectPetani"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="defaultItem.kode"
                    :items="itemspetani"
                    item-text="nama"
                    item-value="kode"
                    label="Pilih Petani"
                    dense
                    rounded
                    hide-details
                    outlined
                    clearable
                    disabled
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.barcode"
                    label="No Barcode"
                    dense
                    rounded
                    outlined
                    hide-details
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.document_no"
                    label="No SPPT/Document"
                    dense
                    rounded
                    hide-details
                    outlined
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.mu_no"
                    :items="itemsMU"
                    item-text="name"
                    item-value="mu_no"
                    label="Management Unit"
                    outlined
                    hide-details
                    rounded
                    disabled
                    clearable
                    :rules="[(v) => !!v || 'Field is required']"
                    v-on:change="selectedMUForm"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.target_area"
                    :items="itemsTAForm"
                    item-text="name"
                    item-value="area_code"
                    label="Target Area"
                    hide-details
                    rounded
                    disabled
                    outlined
                    clearable
                    :rules="[(v) => !!v || 'Field is required']"
                    v-on:change="selectedTAForm"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    color="success"
                    item-color="success"
                    :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition'}"
                    v-model="defaultItem.village"
                    :items="itemsVillageForm"
                    item-text="name"
                    item-value="kode_desa"
                    label="Desa"
                    hide-details
                    rounded
                    outlined
                    :rules="[(v) => !!v || 'Field is required']"
                    v-on:change="selectedVillageForm"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    color="success"
                    v-model="defaultItem.latitude"
                    label="Latitude"
                    hide-details
                    rounded
                    outlined
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    color="success"
                    v-model="defaultItem.longitude"
                    label="Longitude"
                    hide-details
                    rounded
                    outlined
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.soil_type"
                    :items="itemsTanahType"
                    item-text="text"
                    item-value="value"
                    label="Tipe Tanah"
                    hide-details
                    rounded
                    dense
                    outlined
                    disabled
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.potency"
                    :items="itemsPotency"
                    item-text="text"
                    item-value="value"
                    label="Potency"
                    hide-details
                    rounded
                    dense
                    outlined
                    clearable
                    disabled
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.kelerengan_lahan"
                    :items="itemsKeleranganLahan"
                    item-text="text"
                    item-value="value"
                    label="Kelerengan Lahan"
                    outlined
                    hide-details
                    dense
                    rounded
                    clearable
                    disabled
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.elevation"
                    :items="itemsElevation"
                    item-text="text"
                    item-value="value"
                    label="Elevation"
                    outlined
                    dense
                    hide-details
                    rounded
                    clearable
                    disabled
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.tutupan_lahan"
                    :items="itemsTutupanLahan"
                    item-text="text"
                    item-value="value"
                    label="Tutupan Lahan"
                    rounded
                    hide-details
                    outlined
                    dense
                    clearable
                    disabled
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions v-if="load == false">
            <v-spacer></v-spacer>
            <v-btn outlined rounded color="red darken-1" @click="close">
              <v-icon left> mdi-close-circle-outline </v-icon>
              Cancel
            </v-btn>
            <v-btn rounded color="info white--text" class="px-3" @click="savegis">
              <v-icon left class=""> mdi-content-save-all-outline </v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Detail -->
      <v-dialog v-model="dialogDetail" max-width="800px" content-class="rounded-xl" scrollable>
        <v-card>
          <v-card-title class="mb-1 headermodalstyle">
            <span class="headline">Detail Lahan</span>
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
              <DetailLahanMap :long="defaultItem.longitude" :lat="defaultItem.latitude" :section="`Lahan`" />
              <v-row>
                <v-col cols="12" sm="8" md="8">
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>No Lahan</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.lahan_no }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Nama Petani</h5>
                        <h3 class="ml-2">{{ defaultItem.namaPetani }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>No Document</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.document_no }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Barcode</h5>
                        <h3 class="ml-2">{{ defaultItem.barcode }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Kepemilikan SPPT</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.kepemilikan_sppt }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>No Identitas Internal</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.internal_code }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Latitude Longitude</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.latitude }}
                          {{ defaultItem.longitude }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Coordinate</h5>
                        <h3 class="ml-2">{{ defaultItem.coordinate }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Desa</h5>
                        <h3 class="ml-2">{{ defaultItem.namaDesa }}</h3>
                      </div>
                    </v-col>
                    <!-- <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Nama Kelompok</h5>
                        <h3 class="ml-2">{{ defaultItem.namaKelompok }}</h3>
                      </div>
                    </v-col> -->
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Management Unit</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.namaMu }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Target Area</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.namaTa }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <!-- <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Provinsi</h5>
                        <h3 class="ml-2">{{ defaultItem.namaProvinsi }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Kabupaten/Kota</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.namaKabupaten }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Kecamatan</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.namaKecamatan }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row> -->
                  <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Jarak Lahan</h5>
                        <h3 class="ml-2">{{ defaultItem.jarak_lahan }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Akses ke Lahan</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.access_to_lahan }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Akses Sumber Air</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.access_to_water_sources }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Luas Lahan</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.land_area }} m<sup>2</sup>
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Area Tanam</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.planting_area }} m<sup>2</sup>
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Ketersediaan Air</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.water_availability }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Tipe Lahan</h5>
                        <h3 class="ml-2">{{ defaultItem.lahan_type }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Polygon</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.polygon }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <!-- <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Kelerengan Lahan</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.kelerengan_lahan }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Exposure</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.exposure }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Elevation</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.elevation }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Tipe Tanah</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.soil_type }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Current Crops</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.current_crops }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Potensi</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.potency }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row> -->

                  <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Pohon Mpts/Kayu</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.pohon_mpts }} /
                          {{ defaultItem.pohon_kayu }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Fertilizer</h5>
                        <h3 class="ml-2">{{ defaultItem.fertilizer }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Pesticide</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.pesticide }}
                        </h3>
                      </div>
                    </v-col>
                    <!-- <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Tutupan Lahan</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.tutupan_lahan }}
                        </h3>
                      </div>
                    </v-col> -->
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Opsi Pola Tanam</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.opsi_pola_tanam }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Description</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.description }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row class="mt-3">
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Detail Lahan Pohon</h5>
                        <h3 class="ml-1">
                          <v-data-table
                            :headers="headersdetail"
                            :items="defaultItem.DetailTreesLahan"
                            class="elevation-1"
                          >
                            <!-- <template v-slot:item.tree_category="{ item }">
                              {{ gettype(item.tree_category) }}
                            </template> -->
                          </v-data-table>
                        </h3>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Nama</h5>
                        <h3 class="ml-2">{{ defaultItem.nama }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Tanggal Lahir</h5>
                        <h3 class="ml-2">{{ defaultItem.birthday }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Jenis Kelamin</h5>
                        <h3 class="ml-2">{{ defaultItem.gender }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Agama</h5>
                        <h3 class="ml-2">{{ defaultItem.religion }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Management Unit</h5>
                        <h3 class="ml-2">{{ defaultItem.namaMu }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Target Area</h5>
                        <h3 class="ml-2">{{ defaultItem.namaTa }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div>
                        <h5>Alamat</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.address }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>RT/RW</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.rt }}/{{ defaultItem.rw }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Desa</h5>
                        <h3 class="ml-2">{{ defaultItem.namaDesa }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Kode Pos</h5>
                        <h3 class="ml-2">{{ defaultItem.post_code }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Provinsi</h5>
                        <h3 class="ml-2">{{ defaultItem.namaProvinsi }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Kabupaten/Kota</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.namaKabupaten }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Kecamatan</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.namaKecamatan }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>No Telp</h5>
                        <h3 class="ml-2">{{ defaultItem.phone }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Suku</h5>
                        <h3 class="ml-2">{{ defaultItem.ethnic }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Asal-usul</h5>
                        <h3 class="ml-2">{{ defaultItem.origin }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Status Perkawinan</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.marrital_status }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Jumlah Keluarga</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.number_family_member }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Pendidikan Terakhir</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.education }}
                        </h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Pendidikan Non-Formal</h5>
                        <h3 class="ml-2">
                          {{ defaultItem.non_formal_education }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Pekerjaan Utama</h5>
                        <h3 class="ml-2">{{ defaultItem.main_job }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Penghasilan Utama</h5>
                        <h3 class="ml-2">{{ defaultItem.main_income }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Pekerjaan Sampingan</h5>
                        <h3 class="ml-2">{{ defaultItem.side_job }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <div>
                        <h5>Penghasilan Tambahan</h5>
                        <h3 class="ml-2">{{ defaultItem.side_income }}</h3>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Tanggal Bergabung</h5>
                        <h3 class="ml-2">{{ defaultItem.join_date }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Kelompok Tani</h5>
                        <h3 class="ml-2">{{ defaultItem.group_no }}</h3>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div>
                        <h5>Mou No</h5>
                        <h3 class="ml-2">{{ defaultItem.mou_no }}</h3>
                      </div>
                    </v-col>
                  </v-row> -->
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <div>Foto Sppt</div>
                  <v-img
                    height="250"
                    v-bind:src="defaultItem.sppt"
                    @click="showLightbox(defaultItem.sppt)"
                    class="my-1 mb-4 rounded-xl cursor-pointer"
                  ></v-img>
                  <div>Foto Lahan</div>
                  <v-carousel 
                    cycle
                    height="250" 
                    show-arrows-on-hover
                    hide-delimiter-background
                    class="rounded-xl cursor-pointer"
                  >
                    <v-carousel-item>
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.photo1"
                        @click="showLightbox([defaultItem.photo1,defaultItem.photo2,defaultItem.photo3,defaultItem.photo4], 0)"
                        class="my-1 mb-4 rounded-xl cursor-pointer"
                      ></v-img>
                    </v-carousel-item>
                    <v-carousel-item>
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.photo2"
                        @click="showLightbox([defaultItem.photo1,defaultItem.photo2,defaultItem.photo3,defaultItem.photo4], 1)"
                        class="my-1 mb-4 rounded-xl cursor-pointer"
                      ></v-img>
                    </v-carousel-item>
                    <v-carousel-item>
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.photo3"
                        @click="showLightbox([defaultItem.photo1,defaultItem.photo2,defaultItem.photo3,defaultItem.photo4], 2)"
                        class="my-1 mb-4 rounded-xl cursor-pointer"
                      ></v-img>
                    </v-carousel-item>
                    <v-carousel-item>
                      <v-img
                        height="250"
                        v-bind:src="defaultItem.photo4"
                        @click="showLightbox([defaultItem.photo1,defaultItem.photo2,defaultItem.photo3,defaultItem.photo4], 3)"
                        class="my-1 mb-4 rounded-xl cursor-pointer"
                      ></v-img>
                    </v-carousel-item>
                  </v-carousel>
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
              @click="verif"
              outlined
              elevation="1"
            >
              <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
              Verifikasi
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDetailPohon" max-width="500px">
        <v-card>
          <v-card-title class="mb-1 headermodalstyle"
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
            <v-btn outlined color="red" @click="closeDelete">
              <v-icon left> mdi-close-circle-outline </v-icon>
              Cancel</v-btn
            >
            <v-btn outlined color="blue" @click="saveEditPohon">
              <v-icon left> mdi-content-save-all-outline </v-icon>
              Save</v-btn
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
              >Cancel</v-btn
            >
            <v-btn outlined color="blue" text @click="saveEditPohonTemp"
              >Save</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogShowEdit" max-width="400px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="d-flex justify-center"
            >What you want to edit?</v-card-title
          >
          <v-container>
            <v-row v-if="crudLahanBasicShow == true">
              <v-col
                cols="12"
                sm="6"
                md="6"
                class="px-3"
                style="text-align: center"
              >
                <v-btn block outlined color="blue" @click="showEditModal">
                  <v-icon left> mdi-lead-pencil </v-icon>
                  Edit Lahan</v-btn
                >
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
                class="px-3"
                style="text-align: center"
              >
                <v-btn
                  block
                  outlined
                  color="green"
                  @click="showEditJumlahPohonModal"
                  disabled
                >
                  <v-icon left> mdi-lead-pencil </v-icon>
                  Jumlah Pohon</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="updateGisShow == true || User.role_name == 'GIS STAFF'">
              <v-col
                cols="12"
                sm="12"
                md="12"
                class="px-3"
                style="text-align: center"
              >
                <v-btn block outlined color="orange" @click="showEditGIS" rounded>
                  <v-icon left> mdi-lead-pencil </v-icon>
                  Data GIS</v-btn
                >
              </v-col>
            </v-row>
          </v-container>

          <v-card-actions> </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Delete -->
      <v-dialog v-model="dialogDelete" max-width="500px">
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

      <!-- Modal Unverif -->
      <v-dialog v-model="unverifDialog.show" max-width="500px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="d-flex flex-column align-center justify-center">
            <v-icon color="orange" size="65">mdi-alert-circle</v-icon>
            <p class="mt-3 text-center">
              Are you sure you want to UNVERIF this land:<br> <b>{{ unverifDialog.lahan_no || '-' }}</b>?
            </p>
          </v-card-title>
          <v-card-actions>
            <v-btn color="warning white--text" rounded text @click="() => {unverifDialog.show = false}">
              <v-icon class="mr-1">mdi-undo</v-icon>
              Back
            </v-btn>
            <v-divider class="mx-2"></v-divider>
            <v-btn color="blue darken-1" rounded outlined @click="() => {unverifDialog.show2 = true}">
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              Okay
            </v-btn>
          </v-card-actions>
        </v-card> 
      </v-dialog>
      <v-dialog v-model="unverifDialog.show2" max-width="600px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="d-flex flex-column align-center justify-center">
            <v-icon color="red" size="65">mdi-alert</v-icon>
          </v-card-title>
          <v-card-text>
            <p class="mt-3 text-center">
              This process also <span class="red--text font-weight-bold">DELETE</span> all activities data from land <b>{{ unverifDialog.lahan_no || '-' }}</b>!<br>
              It's including "Sosialisasi Tanam", "Penilikan Lubang", "Material Organik", "Distribusi", and "Realisasi Tanam / Monitoring 1".<br>
              Still wanna process it??
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="warning white--text" rounded text @click="() => closeUnverification2()">
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              No
            </v-btn>
            <v-divider class="mx-2"></v-divider>
            <v-btn color="red white--text" rounded outlined @click="() => {unverifLahanConfirm(unverifDialog.lahan_no)}">
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              Sure!
            </v-btn>
          </v-card-actions>
        </v-card> 
      </v-dialog>
      <v-dialog v-model="unverifDialog.show3" max-width="400px" content-class="rounded-xl">
        <v-card>
          <v-card-title class="d-flex flex-column align-center justify-center">
            <v-icon color="green" size="65">mdi-check-circle</v-icon>
            <p>Unverif lahan data success!</p>
          </v-card-title>
          <v-card-text>
            <div v-if="unverifDialog.show3data.lahan" class="px-3">
              <p class="mb-0">Updated data: </p>
              <ol>
                <li v-if="unverifDialog.show3data.lahan.main">Unverified data lahan.</li>
              </ol>
              <p class="mb-0 pt-3">Deleted data: </p>
              <ol>
                <li v-if="unverifDialog.show3data.sostam.main">Deleted data "Sosialisasi Tanam".</li>
                <li v-if="unverifDialog.show3data.penlub.main">Deleted data "Penilikan Lubang".</li>
                <li v-if="unverifDialog.show3data.material_organic.data.length > 0">Deleted data "Material Organik".</li>
                <li v-if="unverifDialog.show3data.distribusi.main">Deleted data "Distribusi".</li>
                <li v-if="unverifDialog.show3data.mon1.main">Deleted data "Realisasi Tanam / Monitoring 1".</li>
              </ol>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-divider class="mr-2"></v-divider>
            <v-btn color="blue white--text" rounded text @click="() => {unverifDialog.show3 = false;unverifDialog.show3data = {};}">
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Okay
            </v-btn>
            <v-divider class="ml-2"></v-divider>
          </v-card-actions>
        </v-card> 
      </v-dialog>

      <!-- Modal Mass Insert Lahan -->
      <v-dialog v-model="insertDataLahan.show" max-width="1000px" content-class="rounded-xl" scrollable>
        <v-card>
          <v-card-title class="mb-1 headermodalstyle"
            ><span class=""><v-icon class="mr-1 white--text">mdi-land-fields</v-icon> Mass Insert Data Lahan</span></v-card-title
          >
          <v-card-text>
            <v-textarea
              v-model="insertDataLahan.data.text"
              class="mt-3"
              color="green"
              label="Input Data"
              outlined
              rounded
              rows="1000"
              auto-grow
              placeholder="..."
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="saveMassInsertDataLahan" rounded color="info white--text px-5"><v-icon>mdi-content-save</v-icon> SAVE</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Mass Update Lat Long -->
      <v-dialog v-model="updateDataLahan.show" max-width="1000px" content-class="rounded-xl" scrollable>
        <v-card>
          <v-card-title class="mb-1 headermodalstyle"
            ><span class=""><v-icon class="mr-1 white--text">mdi-land-fields</v-icon> Mass Update Data Coordinate</span></v-card-title
          >
          <v-card-text>
            <v-textarea
              v-model="updateDataLahan.data.text"
              class="mt-3"
              color="green"
              label="Input Data"
              outlined
              rounded
              rows="1000"
              auto-grow
              placeholder=".lahan_no	latitude	longitude	;
              10_0000009421	107,473890	-7,030280	;
              ..."
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="saveMassUpdateDataLahan" rounded color="info white--text px-5"><v-icon>mdi-content-save</v-icon> SAVE</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <!-- END: MODAL -->
    <v-data-table
      data-aos="fade-up" data-aos-delay="200"
      :headers="headers"
      :items="dataobject"
      multi-sort
      :search="search"
      :loading="loadtable"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1"
      :items-per-page="30"
      :footer-props="{
        itemsPerPageOptions: [10, 20, 30, 40, 50, -1]
      }"
    >
      <template v-slot:top>
        <v-row class="mx-2 my-0 mt-2 align-center">
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
                class=""
                color="warning white--text"
                v-bind="attrs"
                :disabled="loadtable"
                v-on="on"
                rounded
              >
                <v-icon class="mr-1" small>mdi-filter-variant</v-icon> Filter
              </v-btn>
            </template>

            <v-list class="">
              <v-list-item>
                <v-btn
                  block
                  dark
                  class=""
                  rounded
                  @click="showFilterArea()"
                  color="green"
                >
                  <v-icon class="mx-1" small>mdi-filter-variant</v-icon> Filter Area
                </v-btn>
              </v-list-item>
              <v-list-item v-if="RoleAccesFilterShow == true">
                <v-btn
                  block
                  rounded
                  dark
                  class=" d-none d-md-block"
                  @click="showFilterEmployee()"
                  color="green"
                >
                  <v-icon class="mx-1" small>mdi-image-filter-none</v-icon> Filter
                  Employee
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-switch 
                  label="Data Tester"
                  v-model="showTesterData"
                ></v-switch>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- Program Year -->
          <v-select
            color="success"
            item-color="success"
            v-model="programYear"
            :items="$store.state.programYear.options"
            :disabled="loadtable"
            outlined
            dense
            hide-details
            :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
            rounded
            label="Program Year"
            class="ml-1 ml-lg-2"
            style="max-width: 200px"
          ></v-select>
          <v-divider class="d-none d-md-block mx-2"></v-divider>
          <v-text-field
            class="mt-2 mt-lg-0"
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            color="green"
            hide-details
            outlined
            rounded
            dense
          ></v-text-field>
          <v-btn
            class="mb-2 mr-1 ml-2 d-none d-md-block"
            @click="download()"
            color="blue white--text"
            rounded
            :disabled="!typegetdataExcel"
          >
            <v-icon class="mr-1" small>mdi-microsoft-excel</v-icon> Export
          </v-btn>
          <!-- UPDATE LAHAN LAT LONG -->
          <v-menu
            rounded="xl"
            bottom
            left
            offset-y
            transition="slide-y-transition"
            :close-on-content-click="false"
            content-class="rounded-xl"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" color="dark" >
                mdi-dots-vertical
              </v-icon>
            </template>
            <v-card class="pa-3 d-flex flex-column align-stretch justify-content-center">
              <v-btn :disabled="User.role_group != 'IT'" @click="insertDataLahan.show = true" rounded color="red white--text"><v-icon class="mr-1">mdi-land-fields</v-icon> Mass Insert Data Lahan</v-btn>
              <v-btn :disabled="User.role_group != 'IT' && User.role_name != 'GIS STAFF'" @click="updateDataLahan.show = true" rounded color="info white--text" class="mt-2"><v-icon class="mr-1">mdi-map-check</v-icon> Mass Update Lat Long</v-btn>
            </v-card>
          </v-menu>
        </v-row>
      </template>

      <!-- Color Status -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="getColorStatus(item.status)" dark>
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.updated_gis="{ item }">
        <v-chip :color="getColorStatusGIS(item.updated_gis)" dark style="text-transform: capitalize;" class="pl-1">
          <v-icon class="mr-1">mdi-{{ item.updated_gis == 'sudah' ? 'map-check' : 'help-circle' }}</v-icon> {{ item.updated_gis }}
        </v-chip>
      </template>
      
      <!-- Index -->
      <template v-slot:item.index="{index}">
        {{ index + 1 }}
      </template>

      <!-- Tutupan table -->
      <template v-slot:item.tutupan_lahan="{ item }">
        {{ item.tutupan_lahan.replace('-', '') }}{{ item.tutupan_lahan.includes('%') ? '' : '%' }}
      </template>

      <!-- Luas Lahan table -->
      <template v-slot:item.luas_lahan="{ item }">
        {{ item.luas_lahan }}m<sup>2</sup>
      </template>

      <!-- Tahun Program -->
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at.slice(0, 4) }}
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

          <v-card class="pa-2 d-flex flex-column align-stretch" style="gap: 7px;">
            <v-btn
              class="w-100"
              rounded
              @click="showDetail(item)"
              color="info white--text"
              block
              small
            >
            <v-icon class="mr-1" @click="showDetail(item)" small color="white">
                mdi-information-outline
            </v-icon>
              Detail
            </v-btn>
            <v-btn
              v-if="(RoleAccesCRUDShow == true && item.status != 'Sudah Verifikasi') || User.role_group == 'IT' || User.role_name == 'GIS STAFF'"
              class="w-100"
              rounded
              @click="showEditDetailModal(item)"
              color="warning white--text"
              block
              small
            >
            <v-icon class="mr-1" @click="showEditDetailModal(item)" small color="white">
              mdi-lead-pencil
            </v-icon>
              Edit
            </v-btn>
            <v-btn
              v-if="item.status == 'Sudah Verifikasi'"
              class="w-100"
              rounded
              @click="() => showUnverifModal(item)"
              color="red white--text"
              :disabled="User.role_name != 'UNIT MANAGER' && User.role_group != 'IT'"
              block
              small
            >
            <v-icon class="mr-1" small color="white">
              mdi-undo
            </v-icon>
              Unverif
            </v-btn>
            <!-- <v-btn
              v-if="(RoleAccesCRUDShow == true && crudLahanBasicShow == true && item.status != 'Sudah Verifikasi') || User.role_group == 'IT'"
              class="w-100"
              rounded
              @click="showDeleteModal(item)"
              color="red white--text"
              block
              small
            >
            <v-icon class="mr-1" @click="showDeleteModal(item)" small color="white">
              mdi-delete
            </v-icon>
              Delete
            </v-btn> -->
          </v-card>
        </v-menu>
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
import DetailLahanMap from '@/views/Lahan/components/DetailLahanMap'

export default {
  components: {
    DetailLahanMap
  },
  name: "Lahan",
  data: () => ({
    showTesterData: false,
    raw_data: [],
    unverifDialog: {
      show: false,
      show2: false,
      show3: false,
      show3data: {},
      lahan_no: ''
    },
    insertDataLahan: {
      show: false,
      data: {
        text: ''
      }
    },
    updateDataLahan: {
      show: false,
      data: {
        text: ''
      }
    },
    itemsbr: [
      {
        text: "Main Data",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Lahan",
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
    dialogDetailPohonEdit: false,
    dialogDetailPohonHapus: false,
    dialogDetailPohon: false,
    dialogShowEdit: false,
    dialogFilterArea: false,
    dialogFilterEmp: false,
    dialogGIS: false,
    loadtable: false,
    load: false,
    search: "",
    authtoken: "",
    BaseUrlGet: "",
    itemsum: [],
    itemsfc: [],
    itemsff: [],
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
    valueFFcode: "",
    valueMUForm: "",
    valueTAForm: "",
    valueVillageForm: "",
    selectMUForm: "",
    selectTAForm: "",
    valueFFForm: "",
    selectVillageForm: "",
    type: "",
    dataobject: [],
    headers: [
      { text: "No", align: "center",value: "index",width: "5%"},
      { text: "Kode", align: "start",value: "lahanNo",width: "10%"},
      { text: "Desa", value: "desa", width: "15%" },
      { text: "Petani", value: "petani", width: "15%" },
      { text: "Field Facilitator", value: "user", width: "10%" },
      { text: "Luas Lahan", value: "luas_lahan", width: "10%" },
      { text: "Tutupan", value: "tutupan_lahan", width: "7%" },
      { text: "Pola Tanam", value: "pola_tanam", width: "20%" },
      { text: "Tahun Program", value: "created_at", width: "10%" },
      { text: "Status", value: "status", width: "12%" },
      { text: "Actions", value: "actions", sortable: false, width: "15%", align: 'right' },
    ],
    headersgis: [
      {
        text: "Kode",
        align: "start",
        value: "lahanNo",
        width: "10%",
      },
      { text: "Coordinate", value: "coordinate", width: "20%" },
      { text: "Desa", value: "desa", width: "15%" },
      { text: "Petani", value: "petani", width: "15%" },
      { text: "Field Facilitator", value: "user", width: "15%" },
      { text: "Status", value: "updated_gis", width: "13%" },
      { text: "Actions", value: "actions", sortable: false, width: "15%" },
    ],
    headersdetail: [
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Kategori", value: "tree_category", width: "20%" },
      { text: "Jumlah", value: "amount", width: "15%" },
    ],
    headersdetaileditjumlah: [
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Kategori", value: "tree_category", width: "20%" },
      { text: "Jumlah", value: "amount", width: "15%" },
      { text: "Actions", value: "actions", sortable: false, width: "15%" },
    ],
    User: [],
    itemskepemilikan: [
      { text: "Sendiri", value: "0" },
      { text: "Keterkaitan Keluarga", value: "1" },
      { text: "Umum", value: "2" },
      { text: "Lain-lain", value: "3" },
    ],
    itemsWaterAvainility: [
      { text: "Sungai", value: "Sungai" },
      { text: "Sumur", value: "Sumur" },
      { text: "Mata air", value: "Mata Air" },
      { text: "Lainnya", value: "Lainnya" },
    ],
    itemsJarakLahan: [
      { text: "< 500m", value: "< 500m" },
      { text: "500m - 2km", value: "500m - 2km" },
      { text: "> 2km", value: "> 2km" },
    ],
    itemsAksesJalan: [
      { text: "Mobil", value: "Mobil" },
      { text: "Motor", value: "Motor" },
      { text: "Jalan Kaki", value: "Jalan Kaki" },
    ],
    itemsAksesAir: [
      { text: "Tidak ada", value: "Tidak ada" },
      { text: "s/d 200m", value: "< 200m" },
      { text: "> 200m", value: "> 200m" },
    ],
    itemsKimia: [
      { text: "Kimia", value: "Kimia" },
      { text: "Non-Kimia", value: "Non-Kimia" },
      { text: "Keduanya", value: "Keduanya" },
    ],
    itemsTanahType: [
      { text: "-", value: "-" },
      { text: "Alfisol", value: "Alfisol" },
      { text: "Aluvial", value: "Aluvial" },
      { text: "Andosol", value: "Andosol" },
      { text: "Arenosol", value: "Arenosol" },
      { text: "Entisol", value: "Entisol" },
      { text: "Gleisol", value: "Gleisol" },
      { text: "Grumosol", value: "Grumosol" },
      { text: "Histosol", value: "Histosol" },
      { text: "Inseptisol", value: "Inseptisol" },
      { text: "Kambisol", value: "Kambisol" },
      { text: "Latosol", value: "Latosol" },
      { text: "Litosol", value: "Litosol" },
      { text: "Mediteran", value: "Mediteran" },
      { text: "Molisol", value: "Molisol" },
      { text: "Nitosol", value: "Nitosol" },
      { text: "Organosol", value: "Organosol" },
      { text: "Oxisol", value: "Oxisol" },
      { text: "Podsolik", value: "Podsolik" },
      { text: "Regosol", value: "Regosol" },
      { text: "Renzina", value: "Renzina" },
      { text: "Spodosol", value: "Spodosol" },
      { text: "Ultisol", value: "Ultisol" },
      { text: "Umbisol", value: "Umbisol" },
    ],
    itemsLahanType: [
      { text: "-", value: "-" },
      {
        text: "Agroforestri Low Intensive",
        value: "Agroforestri Low Intensive",
      },
      {
        text: "Agroforestri High Intensive",
        value: "Agroforestri High Intensive",
      },
      { text: "Konservasi", value: "Konservasi" },
    ],
    itemsPotency: [
      { text: "-", value: "-" },
      { text: "Potensial", value: "Potensial" },
      { text: "Kurang Potensial", value: "Kurang Potensial" },
      { text: "Tidak Potensial", value: "Tidak Potensial" },
    ],
    itemsKeleranganLahan: [
      { text: "-", value: "-" },
      { text: "datar (0-8 %)", value: "datar (0-8 %)" },
      { text: "landai (8-15 %)", value: "landai (8-15 %)" },
      { text: "agak curam (15-25 %)", value: "agak curam (15-25 %)" },
      { text: "curam (25-45 %)", value: "curam (25-45 %)" },
      { text: "sangat curam (≥ 45 %)", value: "sangat curam (≥ 45 %)" },
    ],
    itemsElevation: [
      { text: "-", value: "-" },
      { text: "0-300 mdpl", value: "0-300 mdpl" },
      { text: ">300-550 mdpl", value: ">300-550 mdpl" },
      { text: ">550 - 850 mdpl", value: ">550 - 850 mdpl" },
      { text: ">550 - 850 mdpl", value: ">550 - 850 mdpl" },
      { text: ">850 - 1050 mdpl", value: ">850 - 1050 mdpl" },
      { text: ">1050 - 1350 mdpl", value: ">1050 - 1350 mdpl" },
      { text: ">1350 - 1550 mdpl", value: ">1350 - 1550 mdpl" },
      { text: ">1550 - 1900 mdpl", value: ">1550 - 1900 mdpl" },
      { text: ">1900 mdpl", value: ">1900 mdpl" },
    ],
    itemsTutupanLahan: [
      { text: "-", value: "-" },
      { text: "Tinggi", value: "Tinggi" },
      { text: "Sedang", value: "Sedang" },
      { text: "Rendah", value: "Rendah" },
      { text: "Terbuka", value: "Terbuka" },
    ],
    itemsLahanPolygon: [
      { text: "-", value: "-", img: null },
      { text: "Membulat", value: "Membulat", img: '/lahanPolygon/membulat.png' },
      { text: "Memanjang", value: "Memanjang", img: '/lahanPolygon/memanjang.png' },
      { text: "Persegi", value: "Persegi", img: '/lahanPolygon/persegi.png' },
      { text: "Leter L", value: "Leter L", img: '/lahanPolygon/letterL.png' },
      { text: "Tidak Beraturan", value: "Tidak Beraturan", img: '/lahanPolygon/tidakBeraturan.png' },
    ],
    itemsOpsiPolaTanam: [
      { text: "-", value: "-" },
      {
        text: "Pola Konservasi Pohon Kayu",
        value: "Pola Konservasi Pohon Kayu",
      },
      {
        text: "Pola Konservasi Pohon Kayu + MPTS",
        value: "Pola Konservasi Pohon Kayu + MPTS",
      },
      {
        text: "Pola Agroforestry Tepi",
        value: "Pola Agroforestry Tepi",
      },
      {
        text: "Pola Agroforestry Satu Jalur",
        value: "Pola Agroforestry Satu Jalur",
      },
      {
        text: "Pola Agroforestry Acak",
        value: "Pola Agroforestry Acak",
      },
    ],
    defaultItem: {
      id: "",
      ff_no: "",
      kode: "",
      DetailTreesLahan: [],
      sppt: "",
      photo1: "",
      photo2: "",
      photo3: "",
      photo4: "",
      access_to_lahan: "",
      access_to_water_sources: "",
      active: "",
      barcode: "",
      city: "",
      coordinate: "",
      current_crops: "",
      description: "",
      document_no: "",
      internal_code: "",
      elevation: "",
      exposure: "",
      farmer_no: "",
      farmer_temp: "",
      fertilizer: "",
      group_no: "",
      jarak_lahan: "",
      kecamatan: "",
      kelerengan_lahan: "",
      lahan_no: "",
      lahan_type: "",
      land_area: "",
      latitude: "",
      longitude: "",
      mu_no: "",
      namaDesa: "",
      namaKabupaten: "",
      namaKecamatan: "",
      namaKelompok: "",
      namaMu: "",
      namaPetani: "",
      namaProvinsi: "",
      namaTa: "",
      pesticide: "",
      planting_area: "",
      polygon: "",
      potency: "",
      province: "",
      soil_type: "",
      target_area: "",
      tutupan_lahan: "",
      user_id: "",
      village: "",
      water_availability: "",
      waitingapproval: false,
      internal_code: "",
      type_sppt: "",
      kepemilikan_sppt: "",

      filephoto1: "",
      filephoto2: "",
      filephoto3: "",
      filephoto4: "",
      filephoto5: "",

      opsi_pola_tanam: "",
      pohon_kayu: "",
      pohon_mpts: "",

      dbsppt: "-",
      dblahan1: "",
      dblahan2: "",
      dblahan3: "",
      dblahan4: "",
    },

    DetailTreesLahanTemp: [],

    itemTemp: {
      idTblLahan: "",
    },
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

    fc_no_global: "",
    typegetdata: "",

    itemsff: [],
    itemspetani: [],

    itemsdetaillahan: [],

    valid: true,
    BaseUrlUpload: "",
    BaseUrl: "",
    RoleAccesFilterShow: true,
    RoleAccesDownloadAllShow: true,
    RoleAccesCRUDShow: true,
    showAdd: true,

    valueMUExcel: "",
    valueTAExcel: "",
    valueVillageExcel: "",
    typegetdataExcel: "",
    valueFFcodeExcel: "",

    crudLahanBasicShow: false,
    updateGisShow: false,

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    filephotoarray: [],
    programYear: ''
  }),

  mounted() {
    this.programYear = this.$store.state.programYear.model
    this.firstAccessPage();
    // localStorage.setItem("token", this.authtoken);
    // this.getMU();
  },

  watch: {
    programYear: {
      handler(newValue) {
        this.initialize()
      }
    },
    async showTesterData(val) {
      if (val === false) this.dataobject = this.raw_data.filter(f1 => f1.lahanNo.match(/^10_00.*$/))
      else this.dataobject = this.raw_data
    }
  },

  methods: {
    async saveMassInsertDataLahan() {
      try {
        this.insertDataLahan.show = false
        this.$store.state.loadingOverlayText = 'Creating data...'
        this.$store.state.loadingOverlay = true
        const response = await axios.post(this.BaseUrlGet + "UpdateLatLongLahan",
          { datas: this.insertDataLahan.data.text},
          { headers: {
              Authorization: `Bearer ` + this.authtoken,
          }}
        )
        
        this.textsnackbar = "SUCCESSSSS YEAYYY!"
        this.timeoutsnackbar = 2000
        this.colorsnackbar = 'green'
        this.insertDataLahan.data.text = ''
      } catch (err) {
        this.textsnackbar = "GAK KESIMPEEEEEEN! ERRORR"
        this.timeoutsnackbar = 2000
        this.colorsnackbar = 'red'
      } finally {
        this.snackbar = true
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
      }
    },
    async saveMassUpdateDataLahan() {
      try {
        this.updateDataLahan.show = false
        this.$store.state.loadingOverlayText = 'Creating data...'
        this.$store.state.loadingOverlay = true
        const response = await axios.post(this.$store.getters.getApiUrl('MassUpdateLatLongLahan'),
          { datas: this.updateDataLahan.data.text}, this.$store.state.apiConfig)
        
        this.textsnackbar = "SUCCESSSSS YEAYYY!"
        this.timeoutsnackbar = 2000
        this.colorsnackbar = 'green'
        this.initialize()
        this.updateDataLahan.data.text = ''
      } catch (err) {
        if (err.message != undefined) this.textsnackbar = err.message
        else this.textsnackbar = "GAK KESIMPEEEEEEN! ERRORR"
        this.timeoutsnackbar = 2000
        this.colorsnackbar = 'red'
      } finally {
        this.snackbar = true
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
      }
    },
    firstAccessPage() {
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data == '-' ? 'all' : this.User.ff.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.BaseUrl = localStorage.getItem("BaseUrl");
      // this.fc_no_global = this.User.fc.fc;
      this.checkRoleAccess();
      this.initialize();
      this.getMU();
      this.getFF();
      this.getUMAll();
      this.BaseUrlUpload = localStorage.getItem("BaseUrlUpload");
    },
    checkRoleAccess() {
      if (this.User.role_group == "IT") {
        this.RoleAccesCRUDShow = true;
        this.RoleAccesFilterShow = true;
        this.updateGisShow = true;
        this.crudLahanBasicShow = true;
        this.RoleAccesDownloadAllShow = true;
      } else if (this.User.role_group == "FIELD") {
        if (this.User.role == "19") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.updateGisShow = false;
          this.crudLahanBasicShow = true;
          this.RoleAccesDownloadAllShow = false;
        } else if (this.User.role == "20") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
          this.updateGisShow = false;
          this.crudLahanBasicShow = true;
          this.RoleAccesDownloadAllShow = true;
        } else if (this.User.role == "14") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = true;
          this.updateGisShow = true;
          this.crudLahanBasicShow = false;
          this.RoleAccesDownloadAllShow = true;
          this.headers = this.headersgis;
        } else {
          this.RoleAccesCRUDShow = false;
          this.RoleAccesFilterShow = true;
          this.updateGisShow = false;
          this.crudLahanBasicShow = false;
          this.RoleAccesDownloadAllShow = true;
        }
      } else {
        this.RoleAccesCRUDShow = false;
        this.RoleAccesFilterShow = true;
        this.updateGisShow = false;
        this.crudLahanBasicShow = false;
        this.RoleAccesDownloadAllShow = false;
      }
    },
    getColorStatus(status) {
      if (status == "Belum Lengkap") return "red";
      else if (status == "Belum Verifikasi") return "orange";
      else return "green";
    },
    getColorStatusGIS(status) {
      if (status == "belum") return "orange";
      else return "green";
    },
    async initialize() {
      this.loadtable = true;
      let params = {
        mu: this.valueMU,
        ta: this.valueTA,
        village: this.valueVillage,
        typegetdata: this.typegetdata,
        ff: this.valueFFcode,
        program_year: this.programYear
      }
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetLahanAllAdmin?" +
            new URLSearchParams(params),
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result.data);
        const resData = response.data.data.result.data
        if (resData.length != 0) {
          this.dataobject = resData;
          this.raw_data = resData
          if (this.showTesterData === false) {
            this.dataobject = resData.filter(f1 => f1.lahanNo.match(/^10_00.*$/))
          }
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
          this.alerttoken = true;
          this.loadtable = false;
          localStorage.removeItem("token");
          this.$router.push("/");
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
          this.alerttoken = true;
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
          // this.itemsTA = response.data.data.result;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.alerttoken = true;
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
          // this.itemsVillage = response.data.data.result;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.alerttoken = true;
        }
      }
    },
    async getDetail(item) {
      // console.log()
      this.load = true;
      this.defaultItem.id = item.idTblLahan;
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetLahanDetail?id=" + item.idTblLahan,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.defaultItem = Object.assign({}, response.data.data.result);

          this.defaultItem.ff_no = response.data.data.result.user_id;
          this.defaultItem.kode = response.data.data.result.farmer_no;
          if (response.data.data.result.type_sppt == 0) {
            this.defaultItem.kepemilikan_sppt = "Pribadi";
          }
          if (response.data.data.result.type_sppt == 1) {
            this.defaultItem.kepemilikan_sppt = "Keterkaitan Keluarga";
          }
          if (response.data.data.result.type_sppt == 2) {
            this.defaultItem.kepemilikan_sppt = "Umum";
          }
          if (response.data.data.result.type_sppt == 3) {
            this.defaultItem.kepemilikan_sppt = "Lain-lain";
          }

          this.defaultItem.type_sppt = response.data.data.result.type_sppt;

          if (response.data.data.result.sppt == "-") {
            this.defaultItem.sppt = "/images/noimage.png";
            this.defaultItem.dbsppt = response.data.data.result.sppt;
          } else {
            if (response.data.data.result.sppt.length < 1000) {
              this.defaultItem.sppt =
                this.BaseUrl + response.data.data.result.sppt;
            } else {
              this.defaultItem.sppt =
                "data:image/jpg;base64," + response.data.data.result.sppt;
            }
            this.defaultItem.dbsppt = response.data.data.result.sppt;
          }
          if (response.data.data.result.photo1 == "-") {
            this.defaultItem.photo1 = "/images/noimage.png";
          } else {
            if (response.data.data.result.photo1.length < 1000) {
              this.defaultItem.photo1 =
                this.BaseUrl + response.data.data.result.photo1;
            } else {
              this.defaultItem.photo1 =
                "data:image/jpg;base64," + response.data.data.result.photo1;
            }
            this.defaultItem.dblahan1 = response.data.data.result.photo1;
            // this.defaultItem.photo1 =
            //   "data:image/jpg;base64," + response.data.data.result.photo1;
          }
          if (response.data.data.result.photo2 == "-") {
            this.defaultItem.photo2 = "/images/noimage.png";
          } else {
            if (response.data.data.result.photo2.length < 1000) {
              this.defaultItem.photo2 =
                this.BaseUrl + response.data.data.result.photo2;
            } else {
              this.defaultItem.photo2 =
                "data:image/jpg;base64," + response.data.data.result.photo2;
            }
            this.defaultItem.dblahan2 = response.data.data.result.photo2;
          }
          if (response.data.data.result.photo3 == "-") {
            this.defaultItem.photo3 = "/images/noimage.png";
          } else {
            if (response.data.data.result.photo3.length < 1000) {
              this.defaultItem.photo3 =
                this.BaseUrl + response.data.data.result.photo3;
            } else {
              this.defaultItem.photo3 =
                "data:image/jpg;base64," + response.data.data.result.photo3;
            }
            this.defaultItem.dblahan3 = response.data.data.result.photo3;
          }
          if (response.data.data.result.photo4 == "-") {
            this.defaultItem.photo4 = "/images/noimage.png";
          } else {
            if (response.data.data.result.photo4.length < 1000) {
              this.defaultItem.photo4 =
                this.BaseUrl + response.data.data.result.photo4;
            } else {
              this.defaultItem.photo4 =
                "data:image/jpg;base64," + response.data.data.result.photo4;
            }
            this.defaultItem.dblahan4 = response.data.data.result.photo4;
          }

          if (this.type == "Detail") {
            // if (
            //   response.data.data.result.soil_type != "-" &&
            //   response.data.data.result.lahan_type != "-" &&
            //   response.data.data.result.potency != "-" &&
            //   response.data.data.result.kelerengan_lahan != "-" &&
            //   response.data.data.result.exposure != "-"
            // ) {
            //     this.defaultItem.waitingapproval = this.waitingapprovefunct(
            //     response.data.data.result.complete_data,
            //     response.data.data.result.approve
            //   );
            // }

            if (
              response.data.data.result.lahan_type != "-" &&
              response.data.data.result.polygon != "-"
            ) {
              this.defaultItem.waitingapproval = this.waitingapprovefunct(
                response.data.data.result.complete_data,
                response.data.data.result.approve
              );
            }

            // this.defaultItem.waitingapproval = this.waitingapprovefunct(
            //   response.data.data.result.complete_data,
            //   response.data.data.result.approve
            // );
          } else {
            this.valueMUForm = response.data.data.result.mu_no;
            this.valueTAForm = response.data.data.result.target_area;
            this.valueFFForm = response.data.data.result.user_id;
          }

          this.load = false;

          // this.itemsMU = response.data.data.result;
          // this.dataobject = response.data.data.result;
        } else {
          console.log("Kosong");
          this.load = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
          this.load = false;
        } else {
          this.load = false;
        }
      }
    },
    async verif() {
      const datapost = {
        id: this.defaultItem.id,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "VerificationLahan",
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
          this.initialize();
        } else {
          this.dialogDetail = false;
          this.alerttoken = true;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.alerttoken = true;
          this.dialogDetail = false;
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
          this.BaseUrlGet + "SoftDeleteLahan",
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

    async UploadData() {
      // console.log(this.BaseUrlUpload);
      if (this.filephotoarray.length != 0) {
        var i;
        var namafile = "";
        var arraytemp = this.filephotoarray;
        for (i = 0; i < this.filephotoarray.length; i++) {
          const formData = new FormData();
          if (arraytemp[i] == "sppt") {
            formData.append("files", this.defaultItem.filephoto1);
            namafile = "Lahan_" + this.defaultItem.document_no;
          } else if (arraytemp[i] == "lahan1") {
            formData.append("files", this.defaultItem.filephoto2);
            namafile = "Lahan1_" + this.defaultItem.document_no;
          } else if (arraytemp[i] == "lahan2") {
            formData.append("files", this.defaultItem.filephoto3);
            namafile = "Lahan2_" + this.defaultItem.document_no;
          } else if (arraytemp[i] == "lahan3") {
            formData.append("files", this.defaultItem.filephoto4);
            namafile = "Lahan3_" + this.defaultItem.document_no;
          } else {
            formData.append("files", this.defaultItem.filephoto5);
            namafile = "Lahan4_" + this.defaultItem.document_no;
          }
          // console.log(namafile);
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
              if (namafile.substring(0, 6) == "Lahan_") {
                this.defaultItem.dbsppt = response.data.TempName;
                // console.log(response.data.TempName);
                // console.log(this.defaultItem.farmer_profile);
              } else if (namafile.substring(0, 6) == "Lahan1") {
                this.defaultItem.dblahan1 = response.data.TempName;
              } else if (namafile.substring(0, 6) == "Lahan2") {
                this.defaultItem.dblahan2 = response.data.TempName;
              } else if (namafile.substring(0, 6) == "Lahan3") {
                this.defaultItem.dblahan3 = response.data.TempName;
              } else {
                this.defaultItem.dblahan4 = response.data.TempName;
                // console.log(response.data.TempName);
                // console.log(this.defaultItem.signature);
              }
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
      }
    },
    async addData(datapost) {
      // console.log(datapost);
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddMandatoryLahanBarcode",
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

    async updateData(datapost) {
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateLahan",
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
        } else {
          this.snackbar = true;
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal Simpan";
        }
      }
    },

    async updateDataGIS() {
      try {
        this.dialogGIS = false
        this.$store.state.loadingOverlay = true
        this.$store.state.loadingOverlayText = 'Updating lahan GIS data...'
        const datapost = {
          lahan_no: this.defaultItem.lahan_no,
          village: this.defaultItem.village,
          longitude: this.defaultItem.longitude,
          latitude: this.defaultItem.latitude,
          soil_type: this.defaultItem.soil_type,
          potency: this.defaultItem.potency,
          kelerengan_lahan: this.defaultItem.kelerengan_lahan,
          // exposure: this.defaultItem.exposure,
          elevation: this.defaultItem.elevation,
          // current_crops: this.defaultItem.current_crops,
          tutupan_lahan: this.defaultItem.tutupan_lahan,
        };
  
        // console.log(datapost);
        const response = await axios.post(
          this.BaseUrlGet + "UpdateLahanGIS",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.dialogGIS = false;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.initialize();
        } else {
          this.dialogGIS = true;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialogGIS = true;
        } else {
          this.colorsnackbar = "red";
          this.textsnackbar = "Gagal Simpan";
        }
      } finally {
        this.snackbar = true;
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
      }
    },

    async updateDataPohon(datapost) {
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateDetailLahanPohon",
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
      this.initialize();
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
      this.initialize();
    },
    selectedVillage(a) {
      console.log(a);
      this.valueVillage = a;
      if (a == null) {
        this.valueVillage = "";
      }
      this.initialize();
    },
    selectedMUForm(a) {
      console.log(a);
      this.valueMUForm = a;
      if (a != null) {
        this.getTA("form");
        // this.getFarmerGroup();
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
        this.defaultItem.target_area = a;
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
      this.valueFC = "";
      this.valueVillage = "";
      this.selectMU = "";
      this.selectTA = "";
      this.selectVillage = "";
      this.itemsfc = [];
      this.itemsTA = [];
      this.itemsVillage = [];
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

    showAddModal() {
      this.formTitle = "Add Item";
      this.load = false;
      this.defaultItem.barcode = "";
      this.defaultItem.lahan_no = "";
      this.defaultItem.document_no = "";
      this.defaultItem.latitude = "";
      this.defaultItem.longitude = "";
      this.defaultItem.planting_area = "";
      this.defaultItem.land_area = "";
      this.defaultItem.description = "";
      // this.defaultItem.birthday.length != 0 &&
      this.defaultItem.ff_no = "";
      this.defaultItem.farmer_no = "";
      this.defaultItem.kode = "";

      this.defaultItem.type_sppt = "";
      this.defaultItem.kepemilikan_sppt = "";
      this.defaultItem.mu_no = "";
      this.defaultItem.target_area = "";
      this.defaultItem.village = "";
      this.defaultItem.water_availability = "";
      this.defaultItem.jarak_lahan = "";
      this.defaultItem.access_to_lahan = "";
      this.defaultItem.access_to_water_sources = "";
      this.defaultItem.fertilizer = "";
      this.defaultItem.pesticide = "";

      this.defaultItem.lahan_type = "";
      this.defaultItem.soil_type = "";
      this.defaultItem.potency = "";
      this.defaultItem.kelerengan_lahan = "";
      this.defaultItem.exposure = "";
      this.defaultItem.elevation = "";
      this.defaultItem.polygon = "";
      this.defaultItem.current_crops = "";
      this.defaultItem.tutupan_lahan = "";

      this.defaultItem.opsi_pola_tanam = "";

      this.defaultItem.sppt = "";
      this.defaultItem.photo1 = "";
      this.defaultItem.photo2 = "";
      this.defaultItem.photo3 = "";
      this.defaultItem.photo4 = "";

      this.defaultItem.dbsppt = "";
      this.defaultItem.dblahan1 = "";
      this.defaultItem.dblahan2 = "";
      this.defaultItem.dblahan3 = "";
      this.defaultItem.dblahan4 = "";

      // console.log(localStorage.getItem("token"));
      this.showAdd = true;
      this.dialog = true;
    },
    async showEditGIS() {
      this.type = "Edit";
      this.showAdd = false;
      this.formTitle = "Edit Item";
      this.dialogShowEdit = false;
      this.dialogGIS = true;
      await this.getDetail(this.itemTemp);
      await this.getTA("form");
      await this.getVillage("form");
      this.getPetani();
    },
    async showEditModal() {
      // console.log(item.kode);
      this.type = "Edit";
      this.showAdd = false;
      this.formTitle = "Edit Item";
      this.dialogShowEdit = false;
      this.dialog = true;
      await this.getDetail(this.itemTemp);
      await this.getTA("form");
      await this.getVillage("form");
      this.getPetani();
    },
    async showEditJumlahPohonModal() {
      // console.log(item.kode);
      this.type = "Edit";
      await this.getDetail(this.itemTemp);

      this.DetailTreesLahanTemp = this.defaultItem.DetailTreesLahan;
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
      this.defaultItem.id = item.idTblLahan
      this.dialogDelete = true
    },
    showUnverifModal(item) {
      this.unverifDialog.lahan_no = item.lahanNo
      this.unverifDialog.show = true
    },
    async closeUnverification2() {
      this.unverifDialog.show2 = false
      await setTimeout(() => {
        this.unverifDialog.show = false
      }, 300)
    },
    async unverifLahanConfirm(lahan_no) {
      try {
        await this.closeUnverification2()
        this.$store.state.loadingOverlayText = 'Loading unverif data...'
        this.$store.state.loadingOverlay = true
        if (lahan_no) {
          const response = await axios.post(this.$store.getters.getApiUrl('UnverificationLahan'), {lahan_no: lahan_no}, this.$store.state.apiConfig)
          const res = response.data
          this.unverifDialog.show3 = true
          this.unverifDialog.show3data = res
          this.initialize()
        } 
      } catch (err) {
        if (err.response) {
          if (err.response.status == 401) {
            this.alerttoken = true;
            this.loadtable = false;
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        } else console.error(err)
      } finally {
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
      }
    },
    deleteItemConfirm() {
      this.verifDelete();
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
    closeDetailEditPohon() {
      this.dialogDetailPohonEdit = false;
    },
    closeDetailDeletePohon() {
      this.dialogDetailPohonEdit = false;
    },
    close() {
      this.dialog = false;
      this.dialogDetailPohon = false;
      this.dialogGIS = false;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.dialogDetailPohon = false;
    },

    saveEditPohon() {
      const d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      var date = d.getDate();

      var datenow = year + "-" + month + "-" + date;

      const datapost = {
        user_id: this.defaultItem.ff_no,
        lahan_no: this.defaultItem.lahan_no,
        tree_list: this.DetailTreesLahanTemp,
        detail_year: datenow,
      };

      console.log(datapost);
      this.updateDataPohon(datapost);
    },

    async savegis() {
      if (
        this.defaultItem.latitude.length != 0 &&
        this.defaultItem.longitude.length != 0 &&
        this.defaultItem.kelerengan_lahan != null &&
        this.defaultItem.elevation != null &&
        this.defaultItem.tutupan_lahan != null &&
        // this.defaultItem.exposure != null &&
        // this.defaultItem.current_crops != null &&

        this.defaultItem.soil_type != null &&
        this.defaultItem.potency != null
      ) {
        await this.updateDataGIS();
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Gagal Simpan, Kolom required tidak boleh ada yang kosong";
      }
    },

    async save() {
      this.$refs.form.validate();

      // console.log(this.defaultItem.document_no.length);
      // console.log(this.defaultItem.latitude.length);
      // console.log(this.defaultItem.longitude.length);
      // console.log(this.defaultItem.planting_area.length);
      // console.log(this.defaultItem.land_area.length);
      // console.log(this.defaultItem.description.length);
      // console.log(this.defaultItem.dbsppt);

      if (
        this.defaultItem.document_no.length != 0 &&
        this.defaultItem.latitude.length != 0 &&
        this.defaultItem.longitude.length != 0 &&
        this.defaultItem.planting_area.length != 0 &&
        this.defaultItem.land_area.length != 0 &&
        this.defaultItem.description.length != 0 &&
        // this.defaultItem.birthday.length != 0 &&
        this.defaultItem.ff_no != null &&
        this.defaultItem.farmer_no != null &&
        this.defaultItem.type_sppt != null &&
        this.defaultItem.mu_no != null &&
        this.defaultItem.target_area != null &&
        this.defaultItem.village != null &&
        this.defaultItem.water_availability != null &&
        this.defaultItem.jarak_lahan != null &&
        this.defaultItem.access_to_lahan != null &&
        this.defaultItem.access_to_water_sources != null &&
        this.defaultItem.fertilizer != null &&
        this.defaultItem.pesticide != null &&
        this.defaultItem.opsi_pola_tanam != null
      ) {
        // var tipesppt = 0;
        // if (this.defaultItem.type_sppt == "bersama") {
        //   tipesppt = 1;
        // }
        if (this.defaultItem.dbsppt.length == 0) {
          this.defaultItem.dbsppt = "-";
        }
        var farmerno;
        if (this.defaultItem.kode) {
          farmerno = this.defaultItem.kode;
        }

        await this.UploadData();

        console.log(this.defaultItem.DetailTreesLahan.length);
        var pohon_kayu_temp = 0;
        var pohon_buah_temp = 0;
        if (this.defaultItem.DetailTreesLahan != null) {
          var arraytemp = this.defaultItem.DetailTreesLahan;
          var i;
          for (i = 0; i < this.defaultItem.DetailTreesLahan.length; i++) {
            if (arraytemp[i].tree_category == "Pohon_Buah") {
              pohon_buah_temp = pohon_buah_temp + parseInt(arraytemp[i].amount);
            } else {
              pohon_kayu_temp = pohon_kayu_temp + parseInt(arraytemp[i].amount);
            }
          }

          // console.log(pohon_buah_temp);
          // console.log(pohon_kayu_temp);
        }

        this.defaultItem.pohon_mpts = pohon_buah_temp;
        this.defaultItem.pohon_kayu = pohon_kayu_temp;

        const datapost = {
          barcode: this.defaultItem.barcode,
          lahan_no: this.defaultItem.lahan_no,
          document_no: this.defaultItem.document_no,
          type_sppt: this.defaultItem.type_sppt,
          land_area: this.defaultItem.land_area,
          longitude: this.defaultItem.longitude,
          latitude: this.defaultItem.latitude,
          coordinate: this.defaultItem.coordinate,
          village: this.defaultItem.village,
          mu_no: this.defaultItem.mu_no,
          target_area: this.defaultItem.target_area,
          farmer_no: farmerno,
          fertilizer: this.defaultItem.fertilizer,
          pesticide: this.defaultItem.pesticide,
          description: this.defaultItem.description,
          planting_area: this.defaultItem.planting_area,
          water_availability: this.defaultItem.water_availability,
          jarak_lahan: this.defaultItem.jarak_lahan,
          access_to_lahan: this.defaultItem.access_to_lahan,
          access_to_water_sources: this.defaultItem.access_to_water_sources,
          soil_type: this.defaultItem.soil_type,
          lahan_type: this.defaultItem.lahan_type,
          potency: this.defaultItem.potency,
          kelerengan_lahan: this.defaultItem.kelerengan_lahan,
          exposure: this.defaultItem.exposure,
          elevation: this.defaultItem.elevation,
          polygon: this.defaultItem.polygon,
          current_crops: this.defaultItem.current_crops,
          tutupan_lahan: this.defaultItem.tutupan_lahan,

          opsi_pola_tanam: this.defaultItem.opsi_pola_tanam,
          pohon_kayu: this.defaultItem.pohon_kayu,
          pohon_mpts: this.defaultItem.pohon_mpts,

          sppt: this.defaultItem.dbsppt,
          photo1: this.defaultItem.dblahan1,
          photo2: this.defaultItem.dblahan2,
          photo3: this.defaultItem.dblahan3,
          photo4: this.defaultItem.dblahan4,
          active: 1,
          user_id: this.defaultItem.ff_no,
        };

        console.log(datapost);

        if (this.defaultItem.lahan_no) {
          this.updateData(datapost);
        } else {
          if (this.defaultItem.ktp_no) {
            this.addData(datapost);
          }
        }
      } else {
        this.snackbar = true;
        this.colorsnackbar = "red";
        this.textsnackbar =
          "Gagal Simpan, Kolom required tidak boleh ada yang kosong";
      }
      // if (this.editedIndex > -1) {
      //   Object.assign(this.desserts[this.editedIndex], this.editedItem);
      // } else {
      //   this.desserts.push(this.editedItem);
      // }
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
    waitingapprovefunct(valcomplete, valapprove) {
      if (valcomplete == 1 && valapprove == 0) {
        return true;
      } else {
        return false;
      }
    },

    pilihfotosppt(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.sppt = URL.createObjectURL(event);
        this.defaultItem.filephoto1 = event;
        this.filephotoarray.push("sppt");
      } else {
        this.defaultItem.sppt = "";
        const index = this.filephotoarray.indexOf("sppt");
        if (index > -1) {
          this.filephotoarray.splice(index, 1);
        }
      }
    },
    pilihfotolahan1(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.photo1 = URL.createObjectURL(event);
        this.defaultItem.filephoto2 = event;
        this.filephotoarray.push("lahan1");
      } else {
        this.defaultItem.photo1 = "";
        const index = this.filephotoarray.indexOf("lahan1");
        if (index > -1) {
          this.filephotoarray.splice(index, 1);
        }
      }
    },
    pilihfotolahan2(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.photo2 = URL.createObjectURL(event);
        this.defaultItem.filephoto3 = event;
        this.filephotoarray.push("lahan2");
      } else {
        this.defaultItem.photo2 = "";
        const index = this.filephotoarray.indexOf("lahan2");
        if (index > -1) {
          this.filephotoarray.splice(index, 1);
        }
      }
    },
    pilihfotolahan3(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.photo3 = URL.createObjectURL(event);
        this.defaultItem.filephoto4 = event;
        this.filephotoarray.push("lahan3");
      } else {
        this.defaultItem.photo3 = "";
        const index = this.filephotoarray.indexOf("lahan3");
        if (index > -1) {
          this.filephotoarray.splice(index, 1);
        }
      }
    },
    pilihfotolahan4(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.photo4 = URL.createObjectURL(event);
        this.defaultItem.filephoto5 = event;
        this.filephotoarray.push("lahan4");
      } else {
        this.defaultItem.photo4 = "";
        const index = this.filephotoarray.indexOf("lahan4");
        if (index > -1) {
          this.filephotoarray.splice(index, 1);
        }
      }
    },

    gettype(val) {
      if (val == "Pohon_Buah") {
        return "Pohon_Buah/MPTS";
      } else {
        return val;
      }
    },

    download() {
      // console.log(this.valueMUExcel);
      // console.log(this.valueTAExcel);
      // console.log(this.valueVillageExcel);
      // console.log(this.typegetdataExcel);
      // console.log(this.valueFFcodeExcel);
      const params = new URLSearchParams({
        program_year: this.programYear,
        mu: this.valueMUExcel,
        ta: this.valueTAExcel,
        village: this.valueVillageExcel,
        typegetdata: this.typegetdataExcel,
        ff: this.valueFFcodeExcel
      })
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "ExportLahanTest?" + params
      )
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
          "ExportLahanAllSuperAdmin?mu=" +
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
    showLightbox(imgs, index) {
        if (imgs) this.$store.state.lightbox.imgs = imgs
        
        if (index) this.$store.state.lightbox.index = index
        else this.$store.state.lightbox.index = 0

        this.$store.state.lightbox.show = true
    },
  },
};
</script>