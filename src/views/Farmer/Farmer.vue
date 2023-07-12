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

    <!--  MODAL -->
    <!-- Modal Filter Area -->
    <v-dialog
      v-model="dialogFilterArea"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="d-flex justify-center"
          >Filter Pencarian Area</v-card-title
        >
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  v-model="selectMU"
                  :items="itemsMU"
                  item-value="mu_no"
                  item-text="name"
                  v-on:change="selectedMU"
                  label="Management Unit"
                  clearable
                  rounded
                  outlined
                  hide-details
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  v-model="selectTA"
                  :items="itemsTA"
                  item-value="area_code"
                  item-text="name"
                  v-on:change="selectedTA"
                  label="Target Area"
                  clearable
                  rounded
                  outlined
                  hide-details
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  v-model="selectVillage"
                  :items="itemsVillage"
                  item-value="kode_desa"
                  item-text="name"
                  v-on:change="selectedVillage"
                  label="Desa"
                  clearable
                  rounded
                  outlined
                  hide-details
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="red"
            rounded
            class="px-5"
            @click="dialogFilterArea = false"
          >
            <v-icon small class="mr-1">mdi-close</v-icon>
            Cancel
          </v-btn>
          <v-btn
            dark
            color="warning"
            rounded
            class="px-5"
            @click="searchbyarea"
          >
            <v-icon small class="mr-1">mdi-filter</v-icon>
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
        <v-card-title class="d-flex justify-center"
          >Filter Pencarian By Emp</v-card-title
        >
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  v-model="selectUM"
                  :items="itemsum"
                  item-value="nik"
                  item-text="name"
                  v-on:change="selectedUM"
                  label="Pilih Unit Manager"
                  clearable
                  rounded
                  outlined
                  hide-details
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  v-model="selectFC"
                  :items="itemsfc"
                  item-value="nik"
                  item-text="name"
                  v-on:change="selectedFC"
                  label="Pilih Field Coordinator"
                  clearable
                  rounded
                  outlined
                  hide-details
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogFilterEmp = false"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="searchbyemp">Cari</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Add Edit -->
    <v-dialog v-model="dialog" max-width="800px" content-class="rounded-xl">
      <v-card>
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
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.ktp_no"
                    label="No KTP"
                    outlined
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.name"
                    label="Nama"
                    outlined
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.nickname"
                    label="Nama Panggilan"
                    outlined
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-menu v-model="menu2" transition="scale-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="datepicker"
                        slot="activator"
                        label="Tanggal Lahir"
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="datepicker"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.religion"
                    :items="itemsagama"
                    item-text="text"
                    item-value="value"
                    label="Agama"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.gender"
                    :items="itemsgender"
                    item-text="text"
                    item-value="value"
                    label="Jenis Kelamin"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="8" md="8">
                  <v-textarea
                    v-model="defaultItem.address"
                    label="Alamat"
                    outlined
                    rows="3"
                    :rules="rules"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="2" md="2">
                  <v-text-field
                    v-model="defaultItem.rt"
                    label="Rt"
                    outlined
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2" md="2">
                  <v-text-field
                    v-model="defaultItem.rw"
                    label="Rw"
                    outlined
                    type="number"
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
                    :rules="rules"
                    v-on:change="selectedMUForm"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.kode_ta"
                    :items="itemsTAForm"
                    item-text="name"
                    item-value="area_code"
                    label="Target Area"
                    outlined
                    clearable
                    :rules="rules"
                    v-on:change="selectedTAForm"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.kode_desa"
                    :items="itemsVillageForm"
                    item-text="name"
                    item-value="kode_desa"
                    label="Desa"
                    outlined
                    clearable
                    :rules="rules"
                    v-on:change="selectedVillageForm"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    v-model="defaultItem.phone"
                    label="No Hp"
                    outlined
                    :rules="rules"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.marrital_status"
                    :items="itemsmarrital"
                    item-text="text"
                    item-value="value"
                    label="Marrital Status"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    v-model="defaultItem.number_family_member"
                    :items="itemsperson"
                    item-text="text"
                    item-value="value"
                    label="Jumlah Anggota Keluarga"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="defaultItem.ethnic"
                    :items="itemsethnic"
                    item-text="name"
                    item-value="code"
                    label="Suku"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="defaultItem.origin"
                    :items="itemsorigin"
                    item-text="text"
                    item-value="value"
                    label="Asal"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="defaultItem.education"
                    :items="itemseducation"
                    item-text="text"
                    item-value="value"
                    label="Pendidikan"
                    outlined
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="defaultItem.non_formal_education"
                    :items="itemsnoneducation"
                    item-text="text"
                    item-value="value"
                    label="Pendidikan Non Formal"
                    outlined
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="defaultItem.main_job"
                    :items="itemsjob"
                    item-text="name"
                    item-value="code"
                    label="Pekerjaan Utama"
                    outlined
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.main_income"
                    label="Penghasilan Utama"
                    outlined
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="defaultItem.side_job"
                    :items="itemsjob"
                    item-text="name"
                    item-value="code"
                    label="Pekerjaan Sampingan"
                    outlined
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="defaultItem.side_income"
                    label="Penghasilan Tambahan"
                    outlined
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    v-model="defaultItem.group_no"
                    :items="itemsgroupfarmer"
                    item-text="name"
                    item-value="group_no"
                    label="Kelompok Petani"
                    outlined
                    clearable
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="4" md="4">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pilih Foto Petani"
                    prepend-icon="mdi-camera"
                    label="Pilih Foto Petani"
                    v-on:change="pilihfotopetani"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pilih Foto KTP"
                    prepend-icon="mdi-camera"
                    label="Pilih Foto KTP"
                    v-on:change="pilihfotoktp"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pilih Foto Tandatangan"
                    prepend-icon="mdi-camera"
                    label="Pilih Foto Tandatangan"
                    v-on:change="pilihfototandatangan"
                  ></v-file-input>
                </v-col>
                <v-container>
                  <v-row>
                    <v-col cols="6" md="4">
                      <v-card elevation="2" height="250">
                        <v-img
                          height="250"
                          v-bind:src="defaultItem.farmer_profile"
                          class="my-2 mb-4"
                          id="idfotopetani"
                        ></v-img
                      ></v-card>
                    </v-col>
                    <v-col cols="6" md="4">
                      <v-card elevation="2" height="250">
                        <v-img
                          height="250"
                          v-bind:src="defaultItem.ktp_document"
                          class="my-2 mb-4"
                        ></v-img>
                      </v-card>
                    </v-col>
                    <v-col cols="6" md="4">
                      <v-card elevation="2" height="150">
                        <v-img
                          height="150"
                          v-bind:src="defaultItem.signature"
                          class="my-2 mb-4"
                        ></v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions v-if="load == false">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Modal Detail -->
    <v-dialog
      v-model="dialogDetail"
      max-width="800px"
      content-class="rounded-xl"
      scrollable
    >
      <v-card>
        <v-card-title class="mb-1 headermodalstyle">
          <span class="headline">Detail Petani</span>
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
            <!-- data pentani -->
            <v-row class="ma-0 mx-2">
              <v-col cols="12">
                <div class="d-flex align-center">
                  <p class="mb-0 grey--text text--darken-3">
                    <v-icon color="grey darken-3" class="mr-2"
                      >mdi-responsive</v-icon
                    >Data Petani
                  </p>
                  <v-divider class="mx-2" color="black"></v-divider>
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-3">
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>NIK</h5>
                  <h3>
                    {{ defaultItem.ktp_no }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Kode Petani</h5>
                  <h3>
                    {{ defaultItem.farmer_no }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Nama</h5>
                  <h3>
                    {{ defaultItem.nama }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Nama Panggilan</h5>
                  <h3>
                    {{ defaultItem.nickname }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Tanggal Lahir</h5>
                  <h3>
                    {{ defaultItem.birthday }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Jenis Kelamin</h5>
                  <h3>
                    {{ defaultItem.gender }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Agama</h5>
                  <h3>
                    {{ defaultItem.religion }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Management Unit</h5>
                  <h3>
                    {{ defaultItem.namaMu }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Target Area</h5>
                  <h3>
                    {{ defaultItem.namaTa }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Alamat</h5>
                  <h3>
                    {{ defaultItem.address }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>RT/RW</h5>
                  <h3>{{ defaultItem.rt }}/{{ defaultItem.rw }}</h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Desa</h5>
                  <h3>
                    {{ defaultItem.namaDesa }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Kode Pos</h5>
                  <h3>
                    {{ defaultItem.post_code }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Provinsi</h5>
                  <h3>{{ defaultItem.namaProvinsi }}</h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Kabupaten/Kota</h5>
                  <h3>
                    {{ defaultItem.namaKabupaten }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Kecamatan</h5>
                  <h3>
                    {{ defaultItem.namaKecamatan }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>No Telp</h5>
                  <h3>{{ defaultItem.phone }}</h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Suku</h5>
                  <h3>
                    {{ defaultItem.ethnic }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Asal-usul</h5>
                  <h3>
                    {{ defaultItem.origin }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Status Perkawinan</h5>
                  <h3>{{ defaultItem.marrital_status }}</h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Jumlah Keluarga</h5>
                  <h3>
                    {{ defaultItem.number_family_member }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Pendidikan Terakhir</h5>
                  <h3>
                    {{ defaultItem.education }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Pendidikan Non-Formal</h5>
                  <h3>{{ defaultItem.non_formal_education }}</h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Pekerjaan Utama</h5>
                  <h3>
                    {{ defaultItem.main_job }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Penghasilan Utama</h5>
                  <h3>
                    {{ defaultItem.main_income }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Pekerjaan Sampingan</h5>
                  <h3>{{ defaultItem.side_job }}</h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Penghasilan Tambahan</h5>
                  <h3>
                    {{ defaultItem.side_income }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Tanggal Bergabung</h5>
                  <h3>
                    {{ defaultItem.join_date }}
                  </h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Kelompok Tani</h5>
                  <h3>{{ defaultItem.group_no }}</h3>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Mou No</h5>
                  <h3>
                    {{ defaultItem.mou_no }}
                  </h3>
                </div>
              </v-col>
            </v-row>
            <v-row class="ma-0 mx-2">
              <v-col cols="12">
                <div class="d-flex align-center">
                  <p class="mb-0 grey--text text--darken-3">
                    <v-icon color="grey darken-3" class="mr-2"
                      >mdi-sprout</v-icon
                    > Jenis Bibit
                  </p>
                  <v-divider class="mx-2" color="black"></v-divider>
                </div>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  :headers="tables.sproutHeaders"
                  :items="defaultItem.FarmerDetail"
                ></v-data-table>
              </v-col>
            </v-row>
            <v-row class="ma-0 mx-2">
              <v-col cols="12">
                <div class="d-flex align-center">
                  <p class="mb-0 grey--text text--darken-3">
                    <v-icon color="grey darken-3" class="mr-2"
                      >mdi-led-strip</v-icon
                    >File
                  </p>
                  <v-divider class="mx-2" color="black"></v-divider>
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-3">
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Foto Petani</h5>
                  <v-img
                    height="250"
                    width="250"
                    v-bind:src="defaultItem.farmer_profile"
                    class="my-1 mb-4"
                  ></v-img>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Foto Ktp</h5>
                  <v-img
                    height="250"
                    width="250"
                    v-bind:src="defaultItem.ktp_document"
                    class="my-1 mb-4"
                  ></v-img>
                </div>
              </v-col>
              <v-col sm="12" md="4" cols="4">
                <div class="ml-2">
                  <h5>Foto Signature</h5>
                  <v-img
                    height="250"
                    width="250"
                    v-bind:src="defaultItem.signature"
                    class="my-1 mb-4"
                  ></v-img>
                </div>
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

    <!-- Modal Verification -->
    <v-dialog v-model="dialogVerification" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to Verification?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeVerification"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="VerificationItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
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
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END: MODAL -->

    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      :headers="headers"
      :items="dataobject"
      :search="search"
      :loading="loadtable"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1"
      :items-per-page="20"
      :footer-props="{
        itemsPerPageOptions: [10, 20, 30, 40, 50, -1],
      }"
    >
      <!-- Toolbar Table -->
      <template v-slot:top>
        <v-row class="mx-2 mx-lg-3 my-0 mt-2 align-center justify-center">
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
              <v-btn dark color="warning" v-bind="attrs" v-on="on" rounded>
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
                  :disabled="RoleAccesFilterShow == false"
                  rounded
                  class="mx-3 mt-1"
                  @click="showFilterEmployee()"
                  color="green white--text"
                >
                  <v-icon class="mx-2" small>mdi-account-group</v-icon>
                  by Employee
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
            label="Program Year"
            class="mx-auto mx-lg-3"
            style="max-width: 200px"
          ></v-select>
          <v-divider class="mx-2 d-none d-md-block" inset></v-divider>
          <!-- Search Input -->
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
            dense
            outlined
            rounded
            class="mr-0 mr-lg-2 my-2 my-lg-0"
          ></v-text-field>
          <!-- Add Button -->
          <!-- <v-btn
            v-if="User.role_group == 'IT'"
            dark
            rounded
            class="mb-2"
            @click="showAddModal()"
            color="green"
          >
            <v-icon small>mdi-plus</v-icon> Add
          </v-btn> -->

          <!-- Export Button -->
          <v-btn
            rounded
            :disabled="loadtable"
            class="mb-2"
            @click="exportData()"
            color="blue white--text"
          >
            <v-icon small>mdi-microsoft-excel</v-icon> Export
          </v-btn>
        </v-row>
      </template>
      <!-- /.Modals END -->

      <!-- Index -->
      <template v-slot:item.index="{ index }">
        {{ index + 1 }}
      </template>
      <!-- Program Year Column -->
      <template v-slot:item.mou_no="{ item }">
        {{ getProgramYear(item.mou_no) }}
      </template>
      <!-- Join Date Column -->
      <template v-slot:item.join_date="{ item }">
        {{ item.join_date.slice(0, 4) }}
      </template>
      <!-- Status Column -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="getColorStatus(item.status)" dark>
          {{ item.status }}
        </v-chip>
      </template>
      <!-- Action table Column -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-3" @click="showDetail(item)" small color="info">
          mdi-information-outline
        </v-icon>
        <v-icon
          v-if="RoleAccesCRUDShow == true && item.status != 'Sudah Verifikasi'"
          class="mr-3"
          @click="showEditModal(item)"
          small
          color="warning"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="RoleAccesCRUDShow == true && item.status != 'Sudah Verifikasi'"
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
import axios from "axios";
import moment from "moment";

export default {
  name: "Farmer",
  authtoken: "",
  data: () => ({
    showTesterData: false,
    export_filter: {
      program_year: "",
      typegetdata: "",
      mu: "",
      ta: "",
      village: "",
      ff: "",
    },
    programYear: moment().format("Y"),
    alerttoken: false,
    datepicker: new Date().toISOString().substr(0, 10),
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 1) || "Min 1 characters",
    ],
    elevations: [6, 12, 18],
    itemsbr: [
      {
        text: "Main Data",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Farmer",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    User: [],
    menu2: "",
    dialog: false,
    dialogDelete: false,
    dialogDetail: false,
    dialogFilterArea: false,
    dialogFilterEmp: false,
    loadtable: false,
    load: false,
    formTitle: "Add Item",
    search: "",
    type: "",
    headers: [
      { text: "No", value: "index"},
      { text: "Nama FF", value: "user"},
      { text: "Nama Petani", value: "nama"},
      { text: "Kode", align: "start", value: "kode"},
      { text: "Desa", value: "desa"},
      { text: "NIK", value: "nik"},
      { text: "Tahun Program", value: "mou_no"},
      { text: "Tahun Bergabung", value: "join_date"},
      { text: "Status", value: "status"},
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        width: "5%",
        align: "right",
      },
    ],
    dataobject: [],
    editedItem: {
      name: "",
    },
    defaultItem: {
      id: "",
      idTabelPetani: "",
      imagesPetani: "",
      imagesKtp: "",
      imagesSignature: "",
      nama: "",
      name: "",
      nickname: "",
      ktp_no: "",
      farmer_no: "",
      birthday: "",
      gender: "",
      religion: "",
      address: "",
      mu_no: "",
      kode_ta: "",
      kode_desa: "",
      kode_kecamatan: "",
      kabupaten_no: "",
      province_code: "",
      namaKabupaten: "",
      namaKecamatan: "",
      namaMu: "",
      namaTa: "",
      rt: "",
      rw: "",
      namaDesa: "",
      post_code: "",
      phone: "",
      ethnic: "",
      origin: "",
      join_date: "",
      group_no: "",
      education: "",
      non_formal_education: "",
      marrital_status: "",
      number_family_member: "",
      main_income: "",
      main_job: "",
      mou_no: "",
      side_job: "",
      side_income: "",
      waitingapproval: false,
      ff_no: "",
      farmer_profile: "",
      ktp_document: "",
      signature: "",
      filephoto1: "",
      filephoto2: "",
      filephoto3: "",
      resultUpload: false,
      join_date: "",
    },
    itemsgender: [
      { text: "Laki-Laki", value: "male" },
      { text: "Perempuan", value: "female" },
    ],
    itemsagama: [
      { text: "Islam", value: "islam" },
      { text: "Kristen", value: "kristen" },
      { text: "Khatolik", value: "khatolik" },
      { text: "Hindu", value: "hindu" },
      { text: "Budha", value: "budha" },
    ],
    itemsmarrital: [
      { text: "Kawin", value: "Kawin" },
      { text: "Belum Kawin", value: "Belum Kawin" },
      { text: "Janda", value: "Janda" },
      { text: "Duda", value: "Duda" },
    ],
    itemsperson: [
      { text: "1", value: "1" },
      { text: "2", value: "2" },
      { text: "3", value: "3" },
      { text: "4", value: "4" },
      { text: "5", value: "5" },
      { text: "6", value: "6" },
      { text: "7", value: "7" },
      { text: "8", value: "8" },
      { text: "9", value: "9" },
      { text: "10", value: "10" },
    ],
    itemsorigin: [
      { text: "Lokal", value: "lokal" },
      { text: "Pendatang", value: "pendatang" },
    ],
    itemseducation: [
      { text: "Tidak Sekolah", value: "Tidak Sekolah" },
      { text: "SD", value: "SD" },
      { text: "SMP", value: "SMP" },
      { text: "SMA", value: "SMA" },
      { text: "Diploma", value: "Diploma" },
      { text: "Sarjana", value: "Sarjana" },
      { text: "Magister", value: "Magister" },
      { text: "Doktor", value: "Doktor" },
    ],
    itemsnoneducation: [
      { text: "Tidak Ada", value: "Tidak Ada" },
      { text: "Pesantren", value: "Pesantren" },
      { text: "Kursus/Pelatihan", value: "Kursus/Pelatihan" },
    ],
    itemsum: [],
    itemsfc: [],
    itemsff: [],
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
    RoleAccesCRUDShow: true,

    snackbar: false,
    textsnackbar: "Test",
    timeoutsnackbar: 2000,
    colorsnackbar: null,
    tables: {
      sproutHeaders: [
        {text: 'Kode Pohon', value: 'tree_code'},
        {text: 'Jenis', value: 'tree_name'}
      ]
    }
  }),
  watch: {
    programYear: {
      handler(newVal) {
        this.initialize();
        this.export_filter.program_year = newVal;
        this.export_filter.typegetdata = this.typegetdata;
        this.export_filter.ff = this.valueFFcode;
        this.export_filter.mu = "";
        this.export_filter.ta = "";
        this.export_filter.village = "";
      },
    },
    async showTesterData(val) {
      if (val === false)
        this.dataobject = this.filterDataDummy(this.raw_data);
      else this.dataobject = this.raw_data;
    },
  },

  mounted() {
    this.programYear = this.$store.state.programYear.model;
    this.firstAccessPage();
  },

  methods: {
    exportData() {
      let params = new URLSearchParams({
        program_year: this.export_filter.program_year,
        typegetdata: this.export_filter.typegetdata,
        ff: this.export_filter.ff.toString(),
        mu: this.export_filter.mu,
        ta: this.export_filter.ta,
        village: this.export_filter.village,
      });
      window.open(
        `${this.BaseUrlGet.slice(0, 38)}ExportFarmerAllAdmin?${params}`
      );
    },
    firstAccessPage() {
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata =
        this.User.ff.value_data == "-" ? "all" : this.User.ff.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.BaseUrl = localStorage.getItem("BaseUrl");
      // this.fc_no_global = this.User.fc.fc;
      this.checkRoleAccess();
      this.initialize();
      this.getMU();
      this.getEthnic();
      this.getJob();
      this.getFF();
      this.getUMAll();
      this.BaseUrlUpload = localStorage.getItem("BaseUrlUpload");
    },
    checkRoleAccess() {
      if (this.User.role_group == "IT") {
        this.RoleAccesCRUDShow = true;
        this.RoleAccesFilterShow = true;
      } else {
        if (this.User.role == "19" || this.User.role == "20") {
          this.RoleAccesCRUDShow = true;
          this.RoleAccesFilterShow = false;
        } else {
          this.RoleAccesCRUDShow = false;
          this.RoleAccesFilterShow = true;
        }
      }
    },
    getColorStatus(status) {
      if (status == "Belum Lengkap") return "red";
      else if (status == "Belum Verifikasi") return "orange";
      else return "green";
    },
    async initialize() {
      this.loadtable = true;
      // console.log(this.User.ff.ff);
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetFarmerAllAdmin?mu=" +
            this.valueMU +
            "&ta=" +
            this.valueTA +
            "&village=" +
            this.valueVillage +
            "&typegetdata=" +
            this.typegetdata +
            "&ff=" +
            this.valueFFcode +
            "&program_year=" +
            this.programYear,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result.data);
        const resData = response.data.data.result.data;
        if (response.data.length != 0) {
          this.dataobject = resData;
          this.raw_data = resData;
          if (this.showTesterData === false) {
            this.dataobject = this.filterDataDummy(resData);
          }
          this.loadtable = false;
        } else {
          this.dataobject = [];
          this.loadtable = false;
        }
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          this.loadtable = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.dataobject = [];
          this.loadtable = false;
        }
      }
    },
    filterDataDummy(data) {
      return data.filter((f) => f.kode.match(/^F.*$/)).filter((f) => f.ff_no.match(/^FF.*$/)).filter((f) => !f.user.includes('FF'))
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
    async getFarmerGroup() {
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetFarmerGroupsDropDown?mu_no=" + this.valueMUForm,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.itemsgroupfarmer = response.data.data.result.data;
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
      this.defaultItem.idTabelPetani = item.idTblPetani;
      try {
        const response = await axios.get(
          this.BaseUrlGet + "GetFarmerDetailWeb?id=" + item.idTblPetani,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        // console.log(response.data.data.result);
        if (response.data.length != 0) {
          this.defaultItem = Object.assign({}, response.data.data.result);

          // this.defaultItem.FarmerDetail = response.data.data.result.FarmerDetail.map(
          //   (val) => {
          //     return val.tree_name;
          //   }
          // ).toString();

          this.defaultItem.ff_no = response.data.data.result.user_id;

          this.datepicker = response.data.data.result.birthday;

          if (response.data.data.result.farmer_profile == "-") {
            this.defaultItem.farmer_profile = "/images/noimage.png";
            this.defaultItem.imagesPetani =
              response.data.data.result.farmer_profile;
          } else {
            if (response.data.data.result.farmer_profile.length < 1000) {
              this.defaultItem.farmer_profile =
                this.BaseUrl + response.data.data.result.farmer_profile;
            } else {
              this.defaultItem.farmer_profile =
                "data:image/jpg;base64," +
                response.data.data.result.farmer_profile;
            }
            this.defaultItem.imagesPetani =
              response.data.data.result.farmer_profile;
          }
          if (response.data.data.result.ktp_document == "-") {
            this.defaultItem.ktp_document = "/images/noimage.png";
            this.defaultItem.imagesKtp = response.data.data.result.ktp_document;
          } else {
            if (response.data.data.result.ktp_document.length < 1000) {
              this.defaultItem.ktp_document =
                this.BaseUrl + response.data.data.result.ktp_document;
            } else {
              this.defaultItem.ktp_document =
                "data:image/jpg;base64," +
                response.data.data.result.ktp_document;
            }
            this.defaultItem.imagesKtp = response.data.data.result.ktp_document;
          }
          if (response.data.data.result.signature == "-") {
            this.defaultItem.signature = "/images/noimage2.png";
            this.defaultItem.imagesSignature =
              response.data.data.result.signature;
          } else {
            if (response.data.data.result.signature.length < 1000) {
              this.defaultItem.signature =
                this.BaseUrl + response.data.data.result.signature;
            } else {
              this.defaultItem.signature =
                "data:image/jpg;base64," + response.data.data.result.signature;
            }
            this.defaultItem.imagesSignature =
              response.data.data.result.signature;
          }

          // this.defaultItem.nik = response.data.data.result.ktp_no;
          // this.defaultItem.kode = response.data.data.result.farmer_no;
          // this.defaultItem.tanggallahir = response.data.data.result.birthday;
          // this.defaultItem.alamat = response.data.data.result.address;
          // this.defaultItem.provinsi = response.data.data.result.namaProvinsi;
          // this.defaultItem.kab = response.data.data.result.namaKabupaten;
          // this.defaultItem.kec = response.data.data.result.namaKecamatan;
          // this.defaultItem.mu = response.data.data.result.namaMu;
          // this.defaultItem.ta = response.data.data.result.namaTa;
          // this.defaultItem.rt = response.data.data.result.rt;
          // this.defaultItem.rw = response.data.data.result.rw;
          // this.defaultItem.desa = response.data.data.result.namaDesa;
          // this.defaultItem.post_code = response.data.data.result.post_code;
          // this.defaultItem.phone = response.data.data.result.phone;
          // this.defaultItem.marrital_status =
          //   response.data.data.result.marrital_status;
          // this.defaultItem.number_family_member =
          //   response.data.data.result.number_family_member;
          // this.defaultItem.education = response.data.data.result.education;
          // this.defaultItem.non_formal_education =
          //   response.data.data.result.non_formal_education;
          // this.defaultItem.join_date = response.data.data.result.join_date;
          // this.defaultItem.group_no = response.data.data.result.group_no;
          // this.defaultItem.mou_no = response.data.data.result.mou_no;
          // this.defaultItem.main_job = response.data.data.result.main_job;

          if (this.type == "Detail") {
            this.defaultItem.nama = this.capitalize(
              response.data.data.result.name
            );

            this.defaultItem.gender = this.genderindo(
              response.data.data.result.gender
            );
            this.defaultItem.religion = this.capitalize(
              response.data.data.result.religion
            );
            this.defaultItem.ethnic = this.capitalize(
              response.data.data.result.ethnic
            );
            this.defaultItem.origin = this.capitalize(
              response.data.data.result.origin
            );

            this.defaultItem.main_income = this.convertToRupiah(
              response.data.data.result.main_income
            );
            this.defaultItem.side_job = response.data.data.result.side_job;
            this.defaultItem.side_income = this.convertToRupiah(
              response.data.data.result.side_income
            );
            this.defaultItem.waitingapproval = this.waitingapprovefunct(
              response.data.data.result.complete_data,
              response.data.data.result.approve
            );
          } else {
            this.valueMUForm = response.data.data.result.mu_no;
            this.valueTAForm = response.data.data.result.kode_ta;
          }
          console.log(this.defaultItem.idTabelPetani);
          // this.itemsMU = response.data.data.result;
          // this.dataobject = response.data.data.result;
          this.load = false;
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
        id: this.defaultItem.id,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "VerificationFarmer",
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
        id: this.defaultItem.idTabelPetani,
      };
      console.log(datapost);
      // this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "SoftDeleteFarmer",
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

    async UploadData() {
      console.log(this.filephotoarray.length);
      if (this.filephotoarray.length != 0) {
        var i;
        var namafile = "";
        var arraytemp = this.filephotoarray;
        // console.log(arraytemp);
        for (i = 0; i < this.filephotoarray.length; i++) {
          const formData = new FormData();
          if (arraytemp[i] == "fphoto") {
            formData.append("files", this.defaultItem.filephoto1);
            namafile = "fphoto_" + this.defaultItem.ktp_no;
          } else if (arraytemp[i] == "fktp") {
            formData.append("files", this.defaultItem.filephoto2);
            namafile = "fktp_" + this.defaultItem.ktp_no;
          } else {
            formData.append("files", this.defaultItem.filephoto3);
            namafile = "fttd_" + this.defaultItem.ktp_no;
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
              if (namafile.substring(0, 6) == "fphoto") {
                this.defaultItem.imagesPetani = response.data.TempName;
                // console.log(response.data.TempName);
                // console.log(this.defaultItem.farmer_profile);
              } else if (namafile.substring(0, 4) == "fktp") {
                this.defaultItem.imagesKtp = response.data.TempName;
                // console.log(response.data.TempName);
                // console.log(this.defaultItem.ktp_document);
              } else {
                this.defaultItem.imagesSignature = response.data.TempName;
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

    async addData() {
      var today = new Date();
      var datenow =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

      var ktpdocupload = "-";
      if (this.defaultItem.imagesKtp.length != 0) {
        ktpdocupload = this.defaultItem.imagesKtp;
      }

      const datapost = {
        ktp_no: this.defaultItem.ktp_no,
        name: this.defaultItem.name,
        nickname: this.defaultItem.nickname,
        birthday: this.datepicker,
        religion: this.defaultItem.religion,
        rt: this.defaultItem.rt,
        rw: this.defaultItem.rw,
        address: this.defaultItem.address,
        village: this.defaultItem.village,
        marrital_status: this.defaultItem.marrital_status,
        phone: this.defaultItem.phone,
        ethnic: this.defaultItem.ethnic,
        origin: this.defaultItem.origin,
        gender: this.defaultItem.gender,
        join_date: datenow,
        number_family_member: this.defaultItem.number_family_member,
        mu_no: this.defaultItem.mu_no,
        target_area: this.defaultItem.kode_ta,
        active: 1,
        user_id: this.defaultItem.ff_no,
        ktp_document: ktpdocupload,
        signature: this.defaultItem.imagesSignature,
        farmer_profile: this.defaultItem.imagesPetani,
        group_no: this.defaultItem.group_no,
        main_income: this.defaultItem.main_income,
        side_income: this.defaultItem.side_income,
        main_job: this.defaultItem.main_job,
        side_job: this.defaultItem.side_job,
        education: this.defaultItem.education,
        non_formal_education: this.defaultItem.non_formal_education,
      };
      console.log(datapost);
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "AddMandatoryFarmer",
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
      var ktpdocupload = "-";
      if (this.defaultItem.imagesKtp.length != 0) {
        ktpdocupload = this.defaultItem.imagesKtp;
      }

      const datapost = {
        farmer_no: this.defaultItem.farmer_no,
        ktp_no: this.defaultItem.ktp_no,
        name: this.defaultItem.name,
        nickname: this.defaultItem.nickname,
        birthday: this.datepicker,
        religion: this.defaultItem.religion,
        rt: this.defaultItem.rt,
        rw: this.defaultItem.rw,
        address: this.defaultItem.address,
        village: this.defaultItem.village,
        marrital_status: this.defaultItem.marrital_status,
        phone: this.defaultItem.phone,
        ethnic: this.defaultItem.ethnic,
        origin: this.defaultItem.origin,
        gender: this.defaultItem.gender,
        number_family_member: this.defaultItem.number_family_member,
        mu_no: this.defaultItem.mu_no,
        mou_no: this.defaultItem.mou_no,
        target_area: this.defaultItem.kode_ta,
        active: 1,
        user_id: this.defaultItem.ff_no,
        ktp_document: ktpdocupload,
        signature: this.defaultItem.imagesSignature,
        farmer_profile: this.defaultItem.imagesPetani,
        group_no: this.defaultItem.group_no,
        main_income: this.defaultItem.main_income,
        side_income: this.defaultItem.side_income,
        main_job: this.defaultItem.main_job,
        side_job: this.defaultItem.side_job,
        education: this.defaultItem.education,
        non_formal_education: this.defaultItem.non_formal_education,
      };
      console.log(datapost);
      this.dialogDetail = false;
      try {
        const response = await axios.post(
          this.BaseUrlGet + "UpdateFarmer",
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

    selectedMU(a) {
      // console.log(a);
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
      // console.log(a);
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
      // console.log(a);
      this.valueVillage = a;
      if (a == null) {
        this.valueVillage = "";
      }
      // this.initialize();
    },
    selectedUM(a) {
      // console.log(a);
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
      // console.log(a);
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
      this.export_filter.mu = this.valueMU;
      this.export_filter.ta = this.valueTA;
      this.export_filter.village = this.valueVillage;
      this.export_filter.typegetdata = this.typegetdata;
      this.export_filter.ff = this.valueFFcode;
      await this.initialize();
      await this.resetFilter();
      this.dialogFilterArea = false;
    },
    async searchbyemp() {
      this.export_filter.mu = "";
      this.export_filter.ta = "";
      this.export_filter.village = "";
      this.export_filter.typegetdata = "several";
      this.export_filter.ff = this.valueFFcode;
      await this.initialize();
      await this.resetFilter();
      this.dialogFilterEmp = false;
    },

    showAddModal() {
      this.load = false;
      // console.log(localStorage.getItem("token"));
      this.defaultItem.id = "";
      this.defaultItem.idTabelPetani = "";
      this.defaultItem.imagesPetani = "";
      this.defaultItem.imagesKtp = "";
      this.defaultItem.imagesSignature = "";
      this.defaultItem.nama = "";
      this.defaultItem.name = "";
      this.defaultItem.nickname = "";
      this.defaultItem.ktp_no = "";
      this.defaultItem.farmer_no = "";
      this.defaultItem.birthday = "";
      this.defaultItem.gender = "";
      this.defaultItem.religion = "";
      this.defaultItem.address = "";
      this.defaultItem.mu_no = "";
      this.defaultItem.kode_ta = "";
      this.defaultItem.kode_desa = "";
      this.defaultItem.namaMu = "";
      this.defaultItem.namaTa = "";
      this.defaultItem.rt = "";
      this.defaultItem.rw = "";
      this.defaultItem.namaDesa = "";
      this.defaultItem.post_code = "";
      this.defaultItem.phone = "";
      this.defaultItem.ethnic = "";
      this.defaultItem.origin = "";
      this.defaultItem.join_date = "";
      this.defaultItem.education = "";
      this.defaultItem.group_no = "";
      this.defaultItem.non_formal_education = "";
      this.defaultItem.marrital_status = "";
      this.defaultItem.number_family_member = "";
      this.defaultItem.main_income = "";
      this.defaultItem.main_job = "";
      this.defaultItem.mou_no = "";
      this.defaultItem.side_job = "";
      this.defaultItem.side_income = "";
      this.defaultItem.ff_no = "";
      this.defaultItem.farmer_profile = "";
      this.defaultItem.ktp_document = "";
      this.defaultItem.signature = "";
      this.defaultItem.filephoto1 = "";
      this.defaultItem.filephoto2 = "";
      this.defaultItem.filephoto3 = "";

      this.formTitle = "Add data";
      this.dialog = true;
    },
    async showEditModal(item) {
      console.log(item.kode);
      console.log(item);
      this.type = "Edit";
      this.dialog = true;
      await this.getDetail(item);
      await this.getTA("form");
      await this.getVillage("form");
      await this.getFarmerGroup();
      this.formTitle = "Edit data";
    },
    showDeleteModal(item) {
      console.log(item.idTblPetani);
      this.defaultItem.idTabelPetani = item.idTblPetani;
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
        this.defaultItem.ktp_no.length != 0 &&
        this.defaultItem.name.length != 0 &&
        this.defaultItem.nickname.length != 0 &&
        // this.defaultItem.birthday.length != 0 &&
        this.defaultItem.religion != null &&
        this.defaultItem.rt.length != 0 &&
        this.defaultItem.rw.length != 0 &&
        this.defaultItem.address.length != 0 &&
        this.defaultItem.village != null &&
        this.defaultItem.marrital_status != null &&
        this.defaultItem.phone.length != 0 &&
        this.defaultItem.ethnic != null &&
        this.defaultItem.origin != null &&
        this.defaultItem.gender != null &&
        this.defaultItem.number_family_member != null &&
        this.defaultItem.mu_no != null &&
        this.defaultItem.ff_no != null &&
        this.defaultItem.kode_ta != null
      ) {
        if (this.defaultItem.id) {
          console.log("test");
          console.log(this.filephotoarray);
          await this.UploadData();
          this.updateData();
        } else {
          if (this.defaultItem.ktp_no) {
            console.log(this.datepicker);
            await this.UploadData();
            this.addData();
          }
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
      var angkarev = angka
        .toString()
        .split("")
        .reverse()
        .join("");
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

    async pilihfotopetani(event) {
      console.log(event);
      var value = event;
      if (event != null) {
        console.log("petanichangefoto-----------");

        // if(event.size<37000){
        //   var result = await this.getBase64(event);
        //   console.log("logerresult--------" + result.split(",")[1]);
        //   this.defaultItem.farmer_profile = result;

        //   this.defaultItem.imagesPetani = result;
        // }else if(event.size<150000){
        //   var result = await this.convert(event);
        //   console.log("logerrsltresize--------" + result.split(",")[1])
        //   this.defaultItem.farmer_profile = result;

        //   this.defaultItem.imagesPetani = result;
        // }else{
        //   var result = "";
        //   this.snackbar = true;
        //   this.colorsnackbar = "red";
        //   this.textsnackbar =
        //     "Ukuran File Maks 150kb";

        //   this.defaultItem.imagesPetani = result;
        // }

        //

        this.defaultItem.filephoto1 = event;
        this.filephotoarray.push("fphoto");
        this.defaultItem.farmer_profile = URL.createObjectURL(event);

        // console.log("success------------------------" + valconv);
        // console.log("logerAfterFunc--------" + this.imagesTempPetani);
      } else {
        this.defaultItem.farmer_profile = "";
        const index = this.filephotoarray.indexOf("fphoto");
        if (index > -1) {
          this.filephotoarray.splice(index, 1);
        }
        // this.filephotoarray.pop();
      }
    },
    async pilihfotoktp(event) {
      console.log(event);
      if (event != null) {
        // var vartype = "ktp_document";
        this.defaultItem.filephoto2 = event;
        this.filephotoarray.push("fktp");
        this.defaultItem.ktp_document = URL.createObjectURL(event);

        // await this.setimageupload();
        // this.defaultItem.filephoto2 = event;
        // this.filephotoarray.push("fktp");
        // this.defaultItem.imagesKtp = this.imagesTempAll;
        // console.log("success------------------------" + valconv);
      } else {
        this.defaultItem.ktp_document = "";
        const index = this.filephotoarray.indexOf("fktp");
        if (index > -1) {
          this.filephotoarray.splice(index, 1);
        }
        // this.filephotoarray.pop();
      }
    },
    async pilihfototandatangan(event) {
      console.log(event);
      if (event != null) {
        this.defaultItem.filephoto3 = event;
        this.filephotoarray.push("fttd");
        this.defaultItem.signature = URL.createObjectURL(event);
        // this.defaultItem.filephoto2 = event;
        // this.filephotoarray.push("fttd");
        // this.defaultItem.imagesSignature = this.imagesTempAll;
        // console.log("success------------------------" + valconv);
      } else {
        this.defaultItem.signature = "";
        const index = this.filephotoarray.indexOf("fttd");
        if (index > -1) {
          this.filephotoarray.splice(index, 1);
        }
        // this.filephotoarray.pop();
      }
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    convert(val) {
      return new Promise((resolve) => {
        console.log("convert file --------------");

        var resize_width = 200;
        // var resize_height = 300;
        var item = val;

        //create a FileReader
        var reader = new FileReader();

        reader.readAsDataURL(item);
        reader.name = item.name;
        reader.size = item.size;
        reader.onload = function(event) {
          var img = new Image(); //create a image
          img.src = event.target.result; //result is base64-encoded Data URI
          img.name = event.target.name; //set name (optional)
          img.size = event.target.size; //set size (optional)
          img.onload = function(el) {
            var elem = document.createElement("canvas"); //create a canvas

            //scale the image to 600 (width) and keep aspect ratio
            var scaleFactor = resize_width / el.target.width;
            elem.width = resize_width;
            elem.height = el.target.height * scaleFactor;

            // var scaleFactor = resize_height / el.target.height;
            // elem.height = resize_height;
            // elem.width = resize_width;

            //draw in canvas
            var ctx = elem.getContext("2d");
            ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

            //get the base64-encoded Data URI from the resize image
            var srcEncoded = ctx.canvas.toDataURL("image/jpeg", 1);

            // console.log(srcEncoded.split(",")[1]);
            resolve(srcEncoded);
          };
        };
      });
    },
    getProgramYear(text) {
      if (text.slice(13, 14) === "_") {
        return text.slice(9, 13);
      } else {
        return text.slice(4, 8);
      }
    },
  },
};
</script>
