<template>
    <v-dialog v-model="showModal"
        scrollable
        max-width="1000px"
        transition="dialog-transition"
        content-class="rounded-xl">
      <v-card height="100%">
        <v-form ref="form" lazy-validation>
          <v-card-title class="rounded-xl green darken-3 ma-1 pa-2 white--text">
                <v-icon color="white" class="mx-2">mdi-account-details</v-icon> {{ this.formTitle }}
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
          </v-card-title>
          <!-- Modal Add Lahan -->
          <v-card-text v-if="addLahanPetaniDialogSwitch == false">
            <!-- Loading -->
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
            <!-- Form Content -->
            <v-container v-if="load == false">
              <v-row>
                <!-- new data -->
                <v-col cols="12" sm="12" md="12">
                  <v-btn
                        small
                        rounded
                        class="mb-2"
                        color="green white--text"
                        @click="openAddNewFarmerLahan()"
                    ><v-icon class="mr-1">mdi-account-multiple-plus</v-icon>
                        Tambah Data Petani
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.farmer_name"
                    label="Nama Petani"
                    placeholder="Masukan Nama Petani..."
                    disabled
                    :rules="rules"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.kepemilikan_lahan"
                    :items="menuKepemilikanLahan"
                    item-text="text"
                    item-value="value"
                    label="Status Kepemilikan Lahan"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <h3>
                    <strong>Memiliki Nomor SPPT? </strong>
                    <v-switch
                    color="green"
                    outlined
                    v-model="switchSPPT"
                    >
                  </v-switch>
                  </h3>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-file-input
                      v-if="switchSPPT == true"
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Input Foto SPPT"
                      prepend-icon="mdi-camera"
                      show-size
                      label="Input Foto SPPT"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-if="switchSPPT == true"
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.no_sppt"
                    label="Nomor SPPT"
                    placeholder="Masukan Nomor SPPT..."
                    maxlength="18"
                    :rules="rules"
                  >
                  <template v-slot:append>
                      <div class="mt-1">
                        {{ `${defaultItem.lahan_no.length}/18` }}
                      </div>
                    </template></v-text-field>
                </v-col>
                


                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.lahan_no"
                    label="Kode Lahan"
                    placeholder="Kode Nomor Lahan..."
                    maxlength="13"
                    :rules="rules"
                  >
                  <template v-slot:append>
                      <div class="mt-1">
                        {{ `${defaultItem.lahan_no.length}/13` }}
                      </div>
                    </template></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.luas_lahan"
                    label="Luas Area Lahan"
                    placeholder="Masukan Luas Area Lahan..."
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.luas_tanam"
                    label="Luas Area Tanam"
                    placeholder="Masukan Luas Tanam Pada Lahan..."
                    :rules="rules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4">
                  <v-btn
                    color="green darken-1"
                    class="px-5"
                    rounded
                    v-model="defaultItem.coordinate"
                    ><v-icon class="mr-1">mdi-content-save</v-icon> Ambil Koordinat Lahan
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="8" md="8">
                  <h3>
                    <strong>Atau Isi Data Longtitude dan Latitude Secara Manual</strong>
                  </h3>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.longtitude"
                    label="Longtitude"
                    placeholder="Masukan Longtitude"
                    :rules="rules"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="defaultItem.latitude"
                    label="Latitude"
                    placeholder="Masukan Latitude..."
                    :rules="rules"
                  >
                  </v-text-field>
                </v-col>
                
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.polygon"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Bentuk Polygon Lahan"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.province"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Provinsi"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.city"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Kota"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.kecamatan"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Kecamatan"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.village"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Desa"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.pola_tanam"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Pola Tanam"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.pupuk"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Pupuk"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.pesticide"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Pestisida"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.jarak_lahan"
                    :items="itemsgender"
                    item-text="text"
                    item-value="value"
                    label="Jarak Lahan"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.akses_lahan"
                    :items="itemsmarrital"
                    item-text="text"
                    item-value="value"
                    label="Akses ke Lahan"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.ketersediaan_air"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Ketersediaan Air"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="defaultItem.akses_sumber_air"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Akses ke Sumber Air"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <!-- Modal Add Petani Lahan -->
          <v-card-text v-if="addLahanPetaniDialogSwitch == true">
            <!-- Loading -->
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
            <!-- Form Content -->
            <v-container v-if="load == false">
              <v-row>
                <!-- new data -->
                <v-col cols="12" sm="12" md="12">
                  <v-btn
                        small
                        rounded
                        class="mb-2"
                        color="green white--text"
                        @click="openAddNewLahan()"
                    ><v-icon class="mr-1">mdi-account-multiple-plus</v-icon>
                        Isi Data Lahan Baru!2
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="farmerItem.farmer_name"
                    label="Nama Lengkap"
                    placeholder="Masukan Nama Petani..."
                    :rules="rules"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="farmerItem.farmer_nickname"
                    label="Nama Alias atau Panggilan"
                    placeholder="Masukan Nama Petani..."
                    :rules="rules"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="farmerItem.no_ktp"
                    label="Nomor KTP"
                    placeholder="Masukan Nomor KTP..."
                    type="number"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-file-input
                      accept="image/png, image/jpeg, image/bmp"
                      @change="val => {farmerItem.fotoKTP = val}"
                      placeholder="Pilih Foto KTP"
                      prepend-icon="mdi-camera"
                      show-size
                      label="Pilih Foto KTP..."
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-file-input
                      accept="image/png, image/jpeg, image/bmp"
                      @change="val => {farmerItem.fotoPetani = val}"
                      placeholder="Pilih Foto Petani"
                      prepend-icon="mdi-camera"
                      show-size
                      label="Pilih Foto Petani..."
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.gender"
                    :items="farmerOptions.gender"
                    label="Jenis Kelamin"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" class="d-flex flex-column align-center">
                  <p class="mb-1">Tanggal Lahir</p>
                    <v-menu
                      rounded="xl"
                      transition="slide-x-transition"
                      bottom
                      right
                      offset-x
                      :close-on-content-click="false"
                      v-model="farmerOptions.birthday.show"
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
                              {{ dateFormat(farmerItem.birthday, 'dddd, DD MMMM Y') }}
                            </v-btn>
                          </template>
                          <span>Klik untuk Memilih Tanggal Lahir!</span>
                        </v-tooltip>
                      </template>
                      <v-card class="rounded-xl pb-2">
                        <div class="d-flex flex-column align-center">
                          <v-date-picker
                            color="green lighten-1 rounded-xl"
                            v-model="farmerItem.birthday"
                            
                          ></v-date-picker>
                          <v-btn color="green" class="white--text px-4" small rounded>
                            <v-icon small class="mr-1">mdi-check-circle</v-icon>
                            Set
                          </v-btn>
                        </div>
                      </v-card>
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.religion"
                    :items="farmerOptions.religion"
                    label="Agama"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.ethnic"
                    :items="farmerOptions.ethnic"
                    label="Suku"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.origin"
                    :items="farmerOptions.origin"
                    label="Asal"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="farmerItem.phone"
                    label="Nomor HP"
                    placeholder="Masukan Nomor HP..."
                    type="number"
                    maxlength="13"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.village"
                    :items="farmerOptions.village"
                    label="Desa"
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="farmerItem.rt"
                    label="RT"
                    placeholder="Masukan RT..."
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="farmerItem.rw"
                    label="RW"
                    placeholder="Masukan RW..."
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.ta"
                    :items="farmerOptions.ta"
                    label="Target Area"
                    clearable
                    disabled
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.mu"
                    :items="farmerOptions.mu"
                    label="Management Unit"
                    clearable
                    disabled
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.marital"
                    :items="farmerOptions.marital"
                    label="Status Pernikahan"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="farmerItem.familyMember"
                    label="Jumlah Anggota Keluarga"
                    placeholder="Masukan Jumlah Anggota Keluarga..."
                    type="number"
                    maxlength="2"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.mainJob"
                    :items="farmerOptions.mainJob"
                    label="Pekerjaan Utama"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="farmerItem.mainSalary"
                    label="Penghasilan Utama"
                    placeholder="Masukan Penghasilan Utama..."
                    type="number"
                    maxlength="30"
                    prefix="Rp."
                    suffix="/Bulan"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.sideJob"
                    :items="farmerOptions.sideJob"
                    label="Pekerjaan Sampingan"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    v-model="farmerItem.sideSalary"
                    label="Penghasilan Sampingan"
                    placeholder="Masukan Penghasilan Sampingan..."
                    type="number"
                    maxlength="30"
                    prefix="Rp."
                    suffix="/Bulan"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.study"
                    :items="farmerOptions.study"
                    label="Pendidikan"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    hide-details
                    rounded
                    dense
                    color="success"
                    item-color="success"
                    :menu-props="{
                      bottom: true,
                      offsetY: true,
                      rounded: 'xl',
                      transition: 'slide-y-transition',
                    }"
                    v-model="farmerItem.nonFormalStudy"
                    :items="farmerOptions.nonFormalStudy"
                    label="Pendidikan Non-Formal"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-file-input
                      accept="image/png, image/jpeg, image/bmp"
                      @change="val => {farmerItem.signature = val}"
                      placeholder="Upload Foto Tanda Tangan"
                      prepend-icon="mdi-camera"
                      show-size
                      label="Upload Foto Tanda Tangan"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions v-if="load == false && addLahanPetaniDialogSwitch == false">
            <v-btn color="red" rounded text >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Keluar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              class="px-5"
              rounded
              outlined
              ><v-icon class="mr-1">mdi-content-save</v-icon> Simpan Data Lahan
            </v-btn>
          </v-card-actions>
          <v-card-actions v-if="load == false && addLahanPetaniDialogSwitch == true">
            <v-btn color="red" rounded text >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Keluar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              class="px-5"
              rounded
              outlined
              ><v-icon class="mr-1">mdi-content-save</v-icon> Simpan Data Petani
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";


export default {
  name: "TambahDataLahan",
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    showAddLahanModal: false,
    addLahanPetaniDialogSwitch: false,
    page: 1,
    itemsPerPage: 10,
    menu2: "",
    valid: true,
    datepicker: new Date().toISOString().substr(0, 10),
    itemsbr: [
      {
        text: "TambahDataLahan",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "TambahDataLahan",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    formTitle: "Tambah Data Lahan",
    value: "add",
    load: false,
    search: "",
    authtoken: "",
    BaseUrlGet: "",
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 1) || "Min 1 characters",
    ],
    menuKepemilikanLahan: [
      {text: 'Pribadi', value: 'pribadi' },
      {text: 'Keterikatan Keluarga', value: 'keterikatan_keluarga'},
      {text: 'Umum', value: 'umum'},
      {text: 'Lainnya', value: 'lainnya'},
    ],
    dataobject: [],
    switchSPPT: false,
    defaultItem: {
      farmer_name: "",
      lahan_no: "",
      kepemilikan_lahan: "",
      no_sppt: "",
      luas_lahan: "",
      luas_tanam: "",
      coordinate: "",
      longtitude: "",
      latitude: "",
      polygon: "",
      province: "",
      city: "",
      kecamatan: "",
      village: "",
      pola_tanam: "",
      pupuk: "",
      pesticide: "",
      jarak_lahan: "",
      akses_lahan: "",
      ketersediaan_air: "",
      akses_sumber_air: "",
    },
    defaultLahanOptions: {

    },
    farmerItem:{
      farmer_name: "",
      farmer_nickname: "",
      no_ktp: "",
      foto_ktp: '',
      foto_petani: '',
      religion: '',
      ethnic: '',
      origin: '',
      address: '',
      phone: '',
      rt: '',
      rw: '',
      village: '',
      ta: '',
      mu: '',
      marital: '',
      familyMember: 0,
      mainJob: '',
      mainSalary: '',
      sideJob: '',
      sideSalary: '',
      study: '',
      nonFormalStudy: '-',
      signature: '',
    },
    farmerOptions:{
      gender: ["Laki-laki", "Perempuan"],
      religion: [
        "Jawa", 
        "Baduy", 
        "Batak", 
        "Sunda", 
        "Betawi", 
        "Madura", 
        "Melayu", 
        "Tionghoa", 
        "Dayak", 
        "Sasak", 
        "Minangkabau", 
        "Bugis", 
        "Bali", 
        "Banten", 
        "Aceh", 
        "Lampung", 
        "Lainnya"],
      ethnic: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghuchu", "Lainnya"],
      origin:  ["lokal", "Pendatang"],
      village: [],
      marital: [
        {text: "Belum Kawin", value: "belum_kawin"},
        {text: "Kawin", value: "kawin"},
        {text: "Duda", value: "duda"},
        {text: "Janda", value: "janda"},
        {text: "Lainnya", value: "lainnya"},
      ],
      mainJob: [
        {text: "Tidak/Belum Bekerja", value: "belum_bekerja"},

      ],
      sideJob: [
        {text: "Tidak/Belum Bekerja", value: "belum_bekerja"},

      ],
      study: [
        {text: "Tidak Sekolah", value: "-"},
        {text: "SD", value: "sd"},
        {text: "SMP", value: "smp"},
        {text: "SMA", value: "sma"},
        {text: "Diploma", value: "diploma"},
        {text: "Sarjana", value: "sarjana"},
        {text: "Magister", value: "magister"},
        {text: "Doktor", value: "doktor"},
      ],
      nonFormalStudy: [
        {text: "Tidak Ada", value: "-"},
        {text: "Pesantren", value: "pesantren"},
        {text: "Kursus/Pelatihan", value: "kursus_pelatihan"},
      ],
      birthday: {
        show: false,
        value: '',
      },
    },

    
    itemsMU: [],
    itemsTA: [],
    itemsVillage: [],
    itemsTAForm: [],
    itemsVillageForm: [],
    valueMUForm: "",
    valueTAForm: "",
    valueVillageForm: "",
    valueFFcode: "",
    selectMUForm: "",
    selectTAForm: "",
    selectVillageForm: "",

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    user_id: "",

    itemsfc: [],
    User: [],
    um_code: "",
    fc_no_selected: "",
    RoleAccesFilterShow: true,
    RoleAccesCRUDShow: true,
    RoleAccesCRUDDelete: true,

    itemsposition: [],
  }),
  watch: {
    'farmerOptions.birthday.show': {
      async handler(newValue) {
        if (newValue == true) {
          // await this.setUnavailableDistributionDates()
        }
      }
    },
  },
  computed:{
    showModal: {
        get: function () {
          return this.show
        },
        set: function(newVal) {
          if (!newVal) {
              this.$emit('close', false)
          }else{
          }
        }
    },
  },
  methods:{
    openAddNewFarmerLahan(){
      this.addLahanPetaniDialogSwitch = true
    },
    openAddNewLahan(){
      this.addLahanPetaniDialogSwitch = false
    },
    dateFormat(date, format) {
        return moment(date).format(format)
    },
  }
}
</script>