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

    <!-- MODAL EXPORT PER UM  -->
    <ExportSostamByUM
      :show="dialogexportsostamPerUM"
      :program_year="this.program_year"
      :um_no="this.selectExportUM"
      :fc_no="this.selectExportFC"
      @close="dialogexportsostamPerUM = false"
    >
    </ExportSostamByUM>
    <!-- MODAL EXPORT PER-FF-->
    <Export
      :show="dialogExportSostam"
      :data="dialogExportSostamData"
      @close="dialogExportSostam = false"
    >
    </Export>

    <v-dialog v-model="dialogExportDataSostam.show" max-width="500px">
      <v-card rounded="xl">
        <v-card-title class="">
          <v-spacer></v-spacer>
          Export Berdasarkan FC
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  outlined
                  rounded
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                  v-model="selectExportUM"
                  :items="itemsum"
                  item-value="nik"
                  item-text="name"
                  v-on:change="selectedExportUM"
                  label="Pilih Unit Manager"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  v-model="selectExportFC"
                  :items="itemsfc"
                  item-value="nik"
                  item-text="name"
                  label="Field Coordinator"
                  clearable
                  :menu-props="{ rounded: 'xl', offsetY: true }"
                  outlined
                  rounded
                  hide-details
                  :rules="[(v) => !!v || 'Field is required']"
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
            @click="dialogExportDataSostam.show = false"
          >
            <v-icon small class="mr-1">mdi-close</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="green white--text"
            rounded
            class="px-5"
            :disabled="disabledExportSostamFF"
            @click="showExportSostamPerFCModal()"
          >
            <v-icon small class="mr-1">mdi-microsoft-excel</v-icon>
            Export
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Filter Area -->
    <v-dialog v-model="dialogFilterArea" max-width="500px">
      <v-card rounded="xl">
        <v-card-title class="">
          <v-spacer></v-spacer>
          Filter Pencarian Area
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  v-model="selectMU"
                  :items="itemsMU"
                  item-value="mu_no"
                  item-text="name"
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                  outlined
                  rounded
                  hide-details
                  v-on:change="selectedMU"
                  label="Management Unit"
                  clearable
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
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                  outlined
                  rounded
                  hide-details
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
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                  outlined
                  rounded
                  hide-details
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
            Keluar
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
    <v-dialog v-model="dialogFilterEmp" max-width="500px">
      <v-card rounded="xl">
        <v-card-title class="d-flex justify-center">
          Filter Pencarian By Emp
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  outlined
                  rounded
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                  v-model="selectUM"
                  :items="itemsum"
                  item-value="nik"
                  item-text="name"
                  v-on:change="selectedUM"
                  label="Pilih Unit Manager"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  outlined
                  rounded
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  color="green"
                  item-color="green"
                  v-model="selectFC"
                  :items="itemsfc"
                  item-value="nik"
                  item-text="name"
                  v-on:change="selectedFC"
                  label="Pilih Field Coordinator"
                  clearable
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
            @click="dialogFilterEmp = false"
          >
            <v-icon small class="mr-1">mdi-close</v-icon>
            Keluar
          </v-btn>
          <v-btn dark color="warning" rounded class="px-5" @click="searchbyemp">
            <v-icon small class="mr-1">mdi-filter</v-icon>
            Cari
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Modal Planting Perode-->
    <v-dialog
      v-model="dialogPeriodeTanam.show"
      max-width="999"
      content-class="rounded-xl"
      persistent
      scrollable
    >
      <v-card rounded="xl" elevation="10">
        <!-- Title -->
        <v-card-title class="mb-1 headermodalstyle rounded-xl elevation-5">
          <span class="">Tambah Data Periode Tanam</span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="dialogPeriodeTanam.show = false"
            >mdi-close-circle</v-icon
          >
        </v-card-title>

        <v-card-text class="px-0 px-lg-5">
          <!-- Loading -->
          <v-overlay absolute :value="dialogPeriodeTanam.loading">
            <div class="d-flex flex-column justify-center align-center">
              <LottieAnimation
                ref="anim"
                :animationData="lottie.data.loading"
                :loop="true"
                style="height: 64px"
              />
              <p class="mt-2 mb-0">
                Loading...
                <v-progress-circular
                  :size="17"
                  :width="3"
                  indeterminate
                  color="white"
                >
                </v-progress-circular>
              </p>
            </div>
          </v-overlay>
          <!-- Content -->
          <v-container>
            <v-row>
              <!-- Tanggal Distribusi -->
              <v-col
                cols="12"
                sm="12"
                md="12"
                lg="4"
                class="d-flex flex-column align-center"
              >
                <p class="mb-1">Tanggal Distribusi</p>
                <v-menu
                  rounded="xl"
                  transition="slide-x-transition"
                  bottom
                  right
                  offset-x
                  :close-on-content-click="false"
                  v-model="pTDatePickerShow"
                >
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          rounded
                          large
                          color="green lighten-1"
                          v-bind="attrs"
                          v-on="{ ...menu, ...tooltip }"
                        >
                          <v-icon left> mdi-calendar </v-icon>
                          {{
                            dateFormat(
                              dataToStore.distribution_time,
                              "dddd, DD MMMM Y"
                            )
                          }}
                        </v-btn>
                      </template>
                      <span>Klik untuk memunculkan datepicker</span>
                    </v-tooltip>
                  </template>
                  <v-card class="rounded-xl pb-2">
                    <v-overlay :value="datepicker2Loading">
                      <div
                        class="d-flex flex-column align-center justify-center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="white"
                          size="64"
                        ></v-progress-circular>
                        <p class="mt-2 mb-0">Updating available dates...</p>
                      </div>
                    </v-overlay>
                    <div class="d-flex flex-column align-center">
                      <v-date-picker
                        color="green lighten-1 rounded-xl"
                        v-model="dataToStore.distribution_time"
                        min="2023-12-01"
                        max="2024-02-15"
                        :allowed-dates="showingAvailableDates"
                        :key="datepicker2Key"
                      ></v-date-picker>
                      <v-btn
                        color="green"
                        class="white--text px-4"
                        small
                        rounded
                        @click="pTDatePickerShow = false"
                      >
                        <v-icon small class="mr-1">mdi-check-circle</v-icon>
                        Set
                      </v-btn>
                    </div>
                  </v-card>
                </v-menu>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="12"
                lg="4"
                class="d-flex flex-column align-center"
              >
                <!-- Tanggal Penilikan Lubang -->
                <v-col>
                  <p class="mb-1">Awal Pembuatan Lubang Tanam</p>
                  <v-btn rounded large color="green lighten-1" disabled>
                    <v-icon left> mdi-calendar </v-icon>
                    {{
                      dateFormat(
                        dataToStore.start_pemlub_time,
                        "dddd, DD MMMM Y"
                      )
                    }}
                  </v-btn>
                </v-col>

                <!-- Tanggal Penilikan Lubang -->
                <v-col>
                  <p class="mb-1">Batas Akhir Pembuatan Lubang Tanam</p>
                  <v-btn rounded large color="green lighten-1" disabled>
                    <v-icon left> mdi-calendar </v-icon>
                    {{ dateFormat(dataToStore.penlub_time, "dddd, DD MMMM Y") }}
                  </v-btn>
                </v-col>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="12"
                lg="4"
                class="d-flex flex-column align-center"
              >
                <!-- Tanggal Realisasi Tanam -->
                <v-col>
                  <p class="mb-1">Tanggal Awal Realisasi Tanam</p>
                  <v-btn rounded large disabled color="green lighten-1">
                    <v-icon left> mdi-calendar </v-icon>
                    {{
                      dateFormat(dataToStore.planting_time, "dddd, DD MMMM Y")
                    }}
                  </v-btn>
                </v-col>
                <v-col>
                  <p class="mb-1">Batas Akhir Realisasi Tanam</p>
                  <v-btn rounded large disabled color="green lighten-1">
                    <v-icon left> mdi-calendar </v-icon>
                    {{
                      dateFormat(
                        dataToStore.end_planting_time,
                        "dddd, DD MMMM Y"
                      )
                    }}
                  </v-btn>
                </v-col>
              </v-col>
              <!-- Lokasi Distribusi -->
              <v-col cols="12">
                <div class="d-flex align-center my-0">
                  <p
                    class="mb-0 grey--text text--darken-3"
                    style="font-size: 17px"
                  >
                    <v-icon class="mr-2">mdi-map-marker</v-icon>Pilih Lokasi
                    Distribusi
                  </p>
                  <v-divider class="mx-2" color=""></v-divider>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12" class="">
                <v-text-field
                  outlined
                  rounded
                  dense
                  hide-details
                  color="green"
                  label="Koordinat Lokasi"
                  v-model="dataToStore.distribution_coordinates"
                >
                  <template v-slot:append>
                    <v-btn
                      small
                      rounded
                      class="mb-2"
                      color="green white--text"
                      @click="
                        () =>
                          showModalPickCoordinate({
                            model: dataToStore.distribution_coordinates,
                          })
                      "
                    >
                      {{
                        dataToStore.distribution_coordinates ? "Edit" : "Ambil"
                      }}
                      Koordinat
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <!-- detail alamat -->
              <v-col cols="12" sm="12" md="12" lg="12" class="">
                <v-text-field
                  color="green"
                  dense
                  outlined
                  rounded
                  placeholder="Balai Desa / Rumah Bp ... / dll"
                  v-model="dataToStore.distribution_location"
                  label="Detail Alamat Distribusi"
                  :rules="[(v) => !!v || 'Field is required']"
                  hide-details
                ></v-text-field>
              </v-col>
              <!-- rekomendasi armada -->
              <v-col cols="12" sm="12" md="12" lg="12" class="">
                <v-text-field
                  color="green"
                  dense
                  outlined
                  rounded
                  label="Rekomendasi Armada"
                  placeholder="Truck / SS / yang lainnya"
                  v-model="dataToStore.distribution_rec_armada"
                  :rules="[(v) => !!v || 'Field is required']"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions
          v-if="dialogPeriodeTanam.loading == false"
          class="elevation-15 rounded-xl"
        >
          <v-btn
            color="red px-5"
            rounded
            dark
            @click="dialogPeriodeTanam.show = false"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green white--text"
            rounded
            @click="showConfirmationPeriodeTanam"
            :disabled="disabledCreatePeriodeTanamByFF"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Buat Periode Tanam
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit GIS -->
    <v-dialog
      v-model="dialogEditGIS.show"
      max-width="999"
      content-class="rounded-xl"
      persistent
      scrollable
    >
      <v-card rounded="xl" elevation="10">
        <!-- Title -->
        <v-card-title class="mb-1 headermodalstyle rounded-xl elevation-5">
          <span class="">Edit Data GIS</span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="dialogEditGIS.show = false"
            >mdi-close-circle</v-icon
          >
        </v-card-title>

        <v-card-text class="px-0 px-lg-5">
          <!-- Loading -->
          <v-overlay absolute :value="dialogEditGIS.loading">
            <div class="d-flex flex-column justify-center align-center">
              <LottieAnimation
                ref="anim"
                :animationData="lottie.data.loading"
                :loop="true"
                style="height: 64px"
              />
              <p class="mt-2 mb-0">
                Loading...
                <v-progress-circular
                  :size="17"
                  :width="3"
                  indeterminate
                  color="white"
                >
                </v-progress-circular>
              </p>
            </div>
          </v-overlay>
          <!-- Content -->
          <v-container>
            <v-row>
              <!-- Lokasi Distribusi -->
              <v-col cols="12">
                <div class="d-flex align-center my-0">
                  <p
                    class="mb-0 grey--text text--darken-3"
                    style="font-size: 17px"
                  >
                    <v-icon class="mr-2">mdi-map-marker</v-icon>Lokasi
                    Distribusi
                  </p>
                  <v-divider class="mx-2" color=""></v-divider>
                </div>
              </v-col>
              <v-text-field
                outlined
                rounded
                dense
                hide-details
                color="green"
                label="Koordinat Lokasi"
                v-model="dataToStore.distribution_coordinates"
              >
              </v-text-field>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions
          v-if="dialogEditGIS.loading == false"
          class="elevation-15 rounded-xl"
        >
          <v-btn
            color="red px-5"
            rounded
            dark
            @click="dialogEditGIS.show = false"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green white--text"
            rounded
            @click="SaveEditGIS"
            :disabled="
              (User.role_group != 'IT' && User.role_name != 'GIS STAFF') ||
              disabledEditDataGIS
            "
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Edit Data GIS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogConfirmPeriodeTanam"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="d-flex justify-center"
          >Apa Anda Yakin Untuk menambah Data Ini?</v-card-title
        >
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="orange white--text"
            rounded
            small
            @click="dialogConfirmPeriodeTanam = false"
            class="px-4"
          >
            <v-icon class="mr-1" small>mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-btn
            color="green white--text"
            rounded
            small
            @click="addDataPeriodeTanam"
            class="px-4"
          >
            <v-icon class="mr-1" small>mdi-check-bold</v-icon>
            OK
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Create Sostam Per~FF -->
    <PickCoordinate
      :show="modals.pick_coordinate.show"
      :data="modals.pick_coordinate.data"
      @action="($v) => modalActions($v)"
    />
    <v-dialog
      v-model="dialogAdd.show"
      max-width="999"
      content-class="rounded-xl"
      persistent
      scrollable
    >
      <v-card rounded="xl" elevation="10">
        <!-- Title -->
        <v-card-title class="mb-1 headermodalstyle rounded-xl elevation-5">
          <span class="">Tambah Data Sosialisasi Tanam FF</span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="dialogAdd.show = false"
            >mdi-close-circle</v-icon
          >
        </v-card-title>

        <v-card-text class="px-0 px-lg-5">
          <!-- Loading -->
          <v-overlay absolute :value="dialogAdd.loading">
            <div class="d-flex flex-column justify-center align-center">
              <LottieAnimation
                ref="anim"
                :animationData="lottie.data.loading"
                :loop="true"
                style="height: 64px"
              />
              <p class="mt-2 mb-0">
                Loading...
                <v-progress-circular
                  :size="17"
                  :width="3"
                  indeterminate
                  color="white"
                >
                </v-progress-circular>
              </p>
            </div>
          </v-overlay>
          <!-- Content -->
          <v-container>
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn small color="info" rounded @click="getFFOptions">
                  <v-icon small class="mr-1">mdi-refresh</v-icon>
                  Muat Ulang FF
                </v-btn>
              </v-col>
              <!-- Select FF -->
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  dense
                  outlined
                  rounded
                  color="success"
                  item-color="success"
                  :menu-props="{ rounded: 'xl' }"
                  :rules="[(v) => !!v || 'Field is required']"
                  label="Pilih Field Facilitator"
                  :items="options.ff.items"
                  item-text="name"
                  item-value="ff_no"
                  v-model="options.ff.model"
                  :loading="options.ff.loading"
                  :no-data-text="options.ff.loading ? 'Loading...' : 'No Data'"
                  @change="getLahansFF()"
                >
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="data.item.name"
                      ></v-list-item-title>
                      <v-list-item-subtitle>{{
                        data.item.ff_no
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- Tanggal Distribusi -->

              <v-col
                cols="12"
                sm="12"
                md="12"
                lg="4"
                class="d-flex flex-column align-center"
              >
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
                          :disabled="!options.ff.model"
                          color="green lighten-1"
                          v-bind="attrs"
                          v-on="{ ...menu, ...tooltip }"
                        >
                          <v-icon left> mdi-calendar </v-icon>
                          {{
                            dateFormat(
                              dataToStore.distribution_time,
                              "dddd, DD MMMM Y"
                            )
                          }}
                        </v-btn>
                      </template>
                      <span>Klik untuk memunculkan datepicker</span>
                    </v-tooltip>
                  </template>
                  <v-card class="rounded-xl pb-2">
                    <v-overlay :value="datepicker2Loading">
                      <div
                        class="d-flex flex-column align-center justify-center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="white"
                          size="64"
                        ></v-progress-circular>
                        <p class="mt-2 mb-0">Updating available dates...</p>
                      </div>
                    </v-overlay>
                    <div class="d-flex flex-column align-center">
                      <v-date-picker
                        color="green lighten-1 rounded-xl"
                        v-model="dataToStore.distribution_time"
                        min="2023-12-01"
                        max="2024-01-31"
                        :allowed-dates="showingAvailableDates"
                        :key="datepicker2Key"
                      ></v-date-picker>
                      <v-btn
                        color="green"
                        class="white--text px-4"
                        small
                        rounded
                        @click="this.setTanggalDistribusi"
                      >
                        <v-icon small class="mr-1">mdi-check-circle</v-icon>
                        Set
                      </v-btn>
                    </div>
                  </v-card>
                </v-menu>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="12"
                lg="4"
                class="d-flex flex-column align-center"
              >
                <!-- Tanggal Penilikan Lubang -->
                <v-col>
                  <p class="mb-1">Awal Pembuatan Lubang Tanam</p>
                  <v-btn rounded large color="green lighten-1" disabled>
                    <v-icon left> mdi-calendar </v-icon>
                    {{
                      dateFormat(
                        dataToStore.start_pemlub_time,
                        "dddd, DD MMMM Y"
                      )
                    }}
                  </v-btn>
                </v-col>

                <!-- Tanggal Penilikan Lubang -->
                <v-col>
                  <p class="mb-1">Batas Akhir Pembuatan Lubang Tanam</p>
                  <v-btn rounded large color="green lighten-1" disabled>
                    <v-icon left> mdi-calendar </v-icon>
                    {{ dateFormat(dataToStore.penlub_time, "dddd, DD MMMM Y") }}
                  </v-btn>
                </v-col>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="12"
                lg="4"
                class="d-flex flex-column align-center"
              >
                <!-- Tanggal Realisasi Tanam -->
                <v-col>
                  <p class="mb-1">Tanggal Awal Realisasi Tanam</p>
                  <v-btn rounded large disabled color="green lighten-1">
                    <v-icon left> mdi-calendar </v-icon>
                    {{
                      dateFormat(dataToStore.planting_time, "dddd, DD MMMM Y")
                    }}
                  </v-btn>
                </v-col>
                <v-col>
                  <p class="mb-1">Batas Akhir Realisasi Tanam</p>
                  <v-btn rounded large disabled color="green lighten-1">
                    <v-icon left> mdi-calendar </v-icon>
                    {{
                      dateFormat(
                        dataToStore.end_planting_time,
                        "dddd, DD MMMM Y"
                      )
                    }}
                  </v-btn>
                </v-col>
              </v-col>
              <!-- Lokasi Distribusi -->
              <v-col cols="12">
                <div class="d-flex align-center my-0">
                  <p
                    class="mb-0 grey--text text--darken-3"
                    style="font-size: 17px"
                  >
                    <v-icon class="mr-2">mdi-map-marker</v-icon>Pilih Lokasi
                    Distribusi
                  </p>
                  <v-divider class="mx-2" color=""></v-divider>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12" class="">
                <v-text-field
                  outlined
                  rounded
                  dense
                  hide-details
                  color="green"
                  label="Koordinat Lokasi"
                  v-model="dataToStore.distribution_coordinates"
                >
                  <template v-slot:append>
                    <v-btn
                      small
                      rounded
                      class="mb-2"
                      color="green white--text"
                      @click="
                        () =>
                          showModalPickCoordinate({
                            model: dataToStore.distribution_coordinates,
                          })
                      "
                    >
                      {{
                        dataToStore.distribution_coordinates ? "Edit" : "Ambil"
                      }}
                      Koordinat
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <!-- detail alamat -->
              <v-col cols="12" sm="12" md="12" lg="12" class="">
                <v-text-field
                  color="green"
                  dense
                  outlined
                  rounded
                  placeholder="Balai Desa / Rumah Bp ... / dll"
                  v-model="dataToStore.distribution_location"
                  label="Detail Alamat Distribusi"
                  :rules="[(v) => !!v || 'Field is required']"
                  hide-details
                ></v-text-field>
              </v-col>
              <!-- rekomendasi armada -->
              <v-col cols="12" sm="12" md="12" lg="12" class="">
                <v-text-field
                  color="green"
                  dense
                  outlined
                  rounded
                  label="Rekomendasi Armada"
                  placeholder="Truck / SS / yang lainnya"
                  v-model="dataToStore.distribution_rec_armada"
                  :rules="[(v) => !!v || 'Field is required']"
                  hide-details
                ></v-text-field>
              </v-col>
              <!-- materi pelatihan -->
              <v-col cols="12">
                <v-autocomplete
                  dense
                  color="success"
                  hide-details
                  item-color="success"
                  item-text="material_name"
                  item-value="material_no"
                  :items="training_material_items"
                  label="Materi Pelatihan"
                  :menu-props="{
                    rounded: 'xl',
                    transition: 'slide-y-transition',
                  }"
                  outlined
                  rounded
                  readonly
                  v-model="dataToStore.training_material"
                ></v-autocomplete>
              </v-col>

              <!--Upload Absen Sostam-->
              <v-col cols="12">
                <div class="d-flex align-center my-0">
                  <p
                    class="mb-0 grey--text text--darken-3"
                    style="font-size: 17px"
                  >
                    <v-icon class="mr-2">mdi-note-alert</v-icon>Upload Absen
                    Sostam
                  </p>
                  <v-divider class="mx-2" color=""></v-divider>
                </div>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-file-input
                  accept="image/png, image/jpeg, image/bmp"
                  @change="
                    (val) => {
                      dataToStore.absensi_photo = val;
                    }
                  "
                  placeholder="Pilih Foto Absensi Sostam 1"
                  prepend-icon="mdi-camera"
                  show-size
                  label="Pilih Foto Absensi Sostam 1..."
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-file-input
                  accept="image/png, image/jpeg, image/bmp"
                  @change="
                    (val) => {
                      dataToStore.absensi_photo2 = val;
                    }
                  "
                  placeholder="Pilih Foto Absensi Sostam 2"
                  prepend-icon="mdi-camera"
                  show-size
                  label="Pilih Foto Absensi Sostam 2..."
                ></v-file-input>
              </v-col>

              <!-- Table -->
              <v-col cols="12" sm="12" md="12">
                <v-row class="align-center mb-4">
                  <v-col cols="12" class="">
                    <div class="d-flex align-center my-0">
                      <p
                        class="mb-0 grey--text text--darken-3"
                        style="font-size: 17px"
                      >
                        <v-icon class="mr-2">mdi-account-group</v-icon> List
                        Petani & Lahan
                      </p>
                      <v-divider class="mx-2" color=""></v-divider>
                      <p class="mb-0">
                        <strong>{{ table.lahans.items.length }}</strong> Lahan,
                        <strong>{{ this.totalDataBibitSostam }}</strong> Bibit
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-end">
                    <v-btn
                      :disabled="!options.ff.model"
                      color="info"
                      rounded
                      @click="getLahansFF"
                      small
                    >
                      <v-icon class="mr-1" small>mdi-refresh</v-icon>
                      Muat Ulang
                    </v-btn>
                  </v-col>
                </v-row>
                <v-data-table
                  item-key="farmer_no"
                  showSelect
                  checkbox-color="green"
                  color="success"
                  class="rounded-xl elevation-5 mb-2"
                  :headers="table.lahans.header"
                  :items="table.lahans.items"
                  :loading="table.lahans.loading"
                  @input="($val) => selectedKehadiranPetani($val)"
                  loading-text="Loading... Please wait"
                  hide-default-footer
                  :items-per-page="-1"
                >
                  <template v-slot:top>
                    <!-- Trees Dialog -->
                    <v-dialog
                      v-model="table.lahans.dialogs.trees.show"
                      max-width="700px"
                      content-class="rounded-xl"
                    >
                      <v-card>
                        <v-card-title
                          class="mb-1 headermodalstyle rounded-xl elevation-5"
                        >
                          <span class="">Set Trees Amount</span>
                          <v-spacer></v-spacer>
                          <v-icon
                            color="red"
                            @click="table.lahans.dialogs.trees.show = false"
                            >mdi-close-circle</v-icon
                          >
                        </v-card-title>
                        <v-card-content v-if="table.lahans.dialogs.trees.datas">
                          <v-container class="py-2">
                            <h4>Lahan</h4>
                            <v-simple-table>
                              <tbody>
                                <tr>
                                  <td>Luas Lahan</td>
                                  <td>:</td>
                                  <td>
                                    <strong
                                      >{{
                                        numberFormat(
                                          table.lahans.dialogs.trees.datas
                                            .land_area
                                        )
                                      }}m<sup>2</sup></strong
                                    >
                                  </td>
                                </tr>
                                <tr>
                                  <td>Opsi Pola Tanam</td>
                                  <td>:</td>
                                  <td>
                                    <strong>{{
                                      table.lahans.dialogs.trees.datas
                                        .opsi_pola_tanam
                                    }}</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Region</td>
                                  <td>:</td>
                                  <td>
                                    <strong>{{
                                      table.lahans.dialogs.trees.datas
                                        .province == "JB"
                                        ? "Jawa Barat"
                                        : "Jawa Tengah"
                                    }}</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </v-simple-table>
                            <!-- Trees -->
                            <h4>Seeds List</h4>
                            <v-simple-table
                              class="rounded-xl elevation-2 overflow-hidden"
                            >
                              <thead>
                                <tr>
                                  <th>No</th>
                                  <th>Category</th>
                                  <th>Tree Name</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="(tree, treeIndex) in table.lahans
                                    .dialogs.trees.datas.trees"
                                  :key="treeIndex"
                                >
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
                          <v-btn
                            color="red px-5"
                            rounded
                            dark
                            @click="table.lahans.dialogs.trees.show = false"
                          >
                            <v-icon class="mr-1">mdi-close-circle</v-icon>
                            Keluar
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="green px-5"
                            rounded
                            dark
                            @click="table.lahans.dialogs.trees.show = false"
                          >
                            <v-icon class="mr-1">mdi-check-circle</v-icon>
                            Set
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </template>
                  <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template v-slot:item.no_lahan="{ item }">
                    {{ numberFormat(item.no_lahan) }}
                  </template>
                  <template v-slot:item.total_kayu="{ item }">
                    <v-icon class="mr-1" color="green">mdi-sprout</v-icon
                    >{{ numberFormat(item.total_kayu) }}
                  </template>
                  <template v-slot:item.total_mpts="{ item }">
                    <v-icon class="mr-1" color="orange">mdi-sprout</v-icon
                    >{{ numberFormat(item.total_mpts) }}
                  </template>
                  <template v-slot:header.data-table-select="{ index }">
                    Kehadiran
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions
          v-if="dialogAdd.loading == false"
          class="elevation-15 rounded-xl"
        >
          <v-btn color="red px-5" rounded dark @click="dialogAdd.show = false">
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green white--text"
            rounded
            @click="createSostamByFF()"
            :disabled="disabledCreateSostamByFF"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Buat Sostam
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
                <!-- <v-col cols="12" sm="12" md="12">
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
                  </v-col> -->
                <!-- <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      disabled
                      rounded
                      v-model="defaultItem.no_lahan"
                      label="No Lahan"
                      outlined
                      :rules="[(v) => !!v || 'Field is required']"
                    ></v-text-field>
                  </v-col> -->
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

                <!-- <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      rounded
                      v-model="defaultItem.distribution_location"
                      label="Tempat Distribusi Bibit"
                      outlined
                      :rules="rules"
                    ></v-text-field>
                  </v-col> -->
                <!-- Update Photo Section -->
                <v-col cols="12">
                  <div class="d-flex align-center my-0">
                    <p
                      class="mb-0 grey--text text--darken-3"
                      style="font-size: 17px"
                    >
                      <v-icon class="mr-2">mdi-note-alert</v-icon>Upload Absen
                      Sostam
                    </p>
                    <v-divider class="mx-2" color=""></v-divider>
                  </div>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    @change="
                      (val) => {
                        dataToStore.absensi_photo = val;
                      }
                    "
                    placeholder="Pilih Foto Absensi Sostam 1"
                    prepend-icon="mdi-camera"
                    show-size
                    label="Pilih Foto Absensi Sostam 1..."
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    @change="
                      (val) => {
                        dataToStore.absensi_photo2 = val;
                      }
                    "
                    placeholder="Pilih Foto Absensi Sostam 2"
                    prepend-icon="mdi-camera"
                    show-size
                    label="Pilih Foto Absensi Sostam 2..."
                  ></v-file-input>
                </v-col>

                <v-col cols="12" lg="4">
                  <v-menu
                    v-model="menu2"
                    offset-x
                    transition="slide-x-transition"
                    rounded="xl"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div class="d-flex flex-column align-center">
                        <p class="mb-0 mx-auto">
                          <strong>Distribusi Bibit</strong>
                        </p>
                        <v-btn
                          dark
                          rounded
                          class=""
                          color="green"
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{ dateFormat(datepicker2, "ddd, DD MMMM Y") }}
                        </v-btn>
                      </div>
                    </template>
                    <v-overlay :value="datepicker2Loading">
                      <div
                        class="d-flex flex-column align-center justify-center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="white"
                          size="64"
                        ></v-progress-circular>
                        <p class="mt-2 mb-0">Updating available dates...</p>
                      </div>
                    </v-overlay>
                    <v-date-picker
                      v-model="datepicker2"
                      min="2023-12-01"
                      max="2024-01-31"
                      :allowed-dates="showingAvailableDates"
                      @input="menu2 = false"
                      color="green"
                      class="rounded-xl"
                      :key="datepicker2Key2"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" lg="4" class="d-flex flex-column align-center">
                  <v-col>
                    <p class="mb-0"><strong>Awal Penilikan Lubang</strong></p>
                    <v-btn rounded disabled class="black--text">
                      {{ dateFormat(datepicker1) }}
                    </v-btn>
                  </v-col>
                  <v-col>
                    <p class="mb-0"><strong>Akhir Penilikan Lubang</strong></p>
                    <v-btn rounded disabled class="black--text">
                      {{ dateFormat(datepicker4) }}
                    </v-btn>
                  </v-col>
                </v-col>
                <v-col cols="12" lg="4" class="d-flex flex-column align-center">
                  <v-col>
                    <p class="mb-0">
                      <strong>Batas Awal Realisasi Tanam</strong>
                    </p>
                    <v-btn rounded disabled class="black--text">
                      {{ dateFormat(datepicker3) }}
                    </v-btn>
                  </v-col>
                  <v-col>
                    <p class="mb-0">
                      <strong>Batas Akhir Realisasi Tanam</strong>
                    </p>
                    <v-btn rounded disabled class="black--text">
                      {{ dateFormat(datepicker5) }}
                    </v-btn>
                  </v-col>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions v-if="load == false">
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              dark
              rounded
              class="px-5"
              @click="close"
            >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Keluar
            </v-btn>
            <v-btn color="green" dark rounded class="px-5" @click="updateData">
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Modal Edit Absensi -->
    <v-dialog
      v-model="dialogShowEditAbsensi"
      max-width="800px"
      content-class="rounded-xl"
    >
      <v-card rounded="xl">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title class="mb-1 headermodalstyle rounded-xl">
            <span class="">Edit Foto Absensi</span>
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
                <!-- Update Photo Section -->
                <v-col cols="12">
                  <div class="d-flex align-center my-0">
                    <p
                      class="mb-0 grey--text text--darken-3"
                      style="font-size: 17px"
                    >
                      <v-icon class="mr-2">mdi-note-alert</v-icon>Upload Absen
                      Sostam
                    </p>
                    <v-divider class="mx-2" color=""></v-divider>
                  </div>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    @change="
                      (val) => {
                        dataToStore.absensi_photo = val;
                      }
                    "
                    placeholder="Pilih Foto Absensi Sostam 1"
                    prepend-icon="mdi-camera"
                    show-size
                    label="Pilih Foto Absensi Sostam 1..."
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    @change="
                      (val) => {
                        dataToStore.absensi_photo2 = val;
                      }
                    "
                    placeholder="Pilih Foto Absensi Sostam 2"
                    prepend-icon="mdi-camera"
                    show-size
                    label="Pilih Foto Absensi Sostam 2..."
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions v-if="load == false">
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              dark
              rounded
              class="px-5"
              @click="close"
            >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Keluar
            </v-btn>
            <v-btn
              color="green"
              dark
              rounded
              class="px-5"
              @click="updateAbsentPhoto"
              :disabled="disabledUpdateFotoAbsensi"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- What do you want to edit? -->
    <v-dialog
      v-model="dialogShowEdit"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="justify-center"
          >Data Mana Yang Ingin Anda Edit?</v-card-title
        >
        <v-card-actions class="pb-3">
          <v-spacer></v-spacer>
          <v-row class="mx-2 my-0 mt-2 justify-center">
            <v-col cols="14" lg="6">
              <v-btn
                rounded
                color="blue white--text"
                @click="showEditModal"
                class="px-5"
                :disabled="
                  User.role_group != 'IT' &&
                  User.role_name != 'PLANNING MANAGER'
                "
                disabled
              >
                <v-icon class="mr-1">mdi-file-document-edit</v-icon>
                Edit Sosialisasi</v-btn
              >
            </v-col>
            <v-col cols="14" lg="6">
              <v-btn
                color="green white--text"
                rounded
                :disabled="
                  true ||
                  (User.role_group != 'IT' && User.role_name != 'UNIT MANAGER')
                "
                @click="showEditJumlahPohonModal"
                class="px-5"
              >
                <v-icon class="mr-1">mdi-forest</v-icon>
                Jumlah Pohon</v-btn
              >
            </v-col>
            <v-col cols="14" lg="6">
              <v-btn
                dark
                rounded
                @click="showPlantingPeriode"
                color="green"
                :disabled="User.role_group != 'IT'"
                class="px-5"
              >
                <v-icon class="mr-1" small color="white">
                  mdi-plus-thick
                </v-icon>
                Periode Tanam
              </v-btn>
            </v-col>
          </v-row>

          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- List Edit Jumlah Pohon -->
    <v-dialog
      v-model="dialogDetailPohon"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="justify-center align-center py-5"
          ><span class="">
            <v-icon class="mr-1">mdi-forest</v-icon>
            List Pohon Lahan</span
          ></v-card-title
        >
        <v-card-text>
          <v-row class="">
            <v-col cols="12">
              <v-simple-table>
                <tbody>
                  <tr>
                    <td>Luas Lahan</td>
                    <td>:</td>
                    <td>
                      <strong>{{
                        numberFormat(DetailTreesLahanTempData.land_area || 0)
                      }}</strong
                      >m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Tutupan Lahan</td>
                    <td>:</td>
                    <td>
                      <strong>{{
                        DetailTreesLahanTempData.tutupan_lahan || 0
                      }}</strong
                      >%
                    </td>
                  </tr>
                  <tr
                    v-if="
                      DetailTreesLahanTempData.planting_details &&
                      DetailTreesLahanTempData.land_area < 10000
                    "
                  >
                    <td>
                      Max Bibit Kayu
                      {{
                        getTotalBibitInDetail(
                          DetailTreesLahanTempData.planting_details,
                          "EXISTS",
                          "MPTS"
                        ) > 0
                          ? "(+MPTS)"
                          : ""
                      }}
                    </td>
                    <td>:</td>
                    <td>
                      <strong>{{
                        DetailTreesLahanTempData.max_seed_amount ||
                        getSeedCalculation(
                          DetailTreesLahanTempData,
                          "total_max_trees"
                        )
                      }}</strong>
                      Bibit
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <div class="d-flex flex-column align-center">
                <v-btn
                  color="red white--text mb-2"
                  small
                  v-if="
                    DetailTreesLahanTempData.land_area < 10000 &&
                    DetailTreesLahanTempData.max_seed_amount <
                      getStatusTotalBibitInDetail(
                        DetailTreesLahanTemp,
                        'KAYU'
                      ) +
                        getStatusTotalBibitInDetail(
                          DetailTreesLahanTemp,
                          'MPTS'
                        )
                  "
                  rounded
                  @click="resetJumlahBibit()"
                >
                  <v-icon small class="mr-1">mdi-refresh</v-icon>
                  Reset Jumlah Bibit
                </v-btn>
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
                      :disabled="
                        disabledEditPohon(
                          DetailTreesLahanTemp,
                          item.tree_category,
                          DetailTreesLahanTempData
                        )
                      "
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
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="red"
            rounded
            @click="closeDetailPohon"
            class="px-5 mb-2"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar</v-btn
          >
          <v-btn
            color="green"
            rounded
            @click="saveEditPohon"
            class="px-5 mb-2 white--text"
            :disabled="
              getStatusTotalBibitInDetail(DetailTreesLahanTemp, 'KAYU') == 0 ||
              getStatusTotalBibitInDetail(DetailTreesLahanTemp, 'MPTS') >
                Math.round(
                  (40 / 60) *
                    getStatusTotalBibitInDetail(DetailTreesLahanTemp, 'KAYU')
                ) ||
              (DetailTreesLahanTempData.land_area < 10000 &&
                DetailTreesLahanTempData.max_seed_amount <
                  getStatusTotalBibitInDetail(DetailTreesLahanTemp, 'KAYU') +
                    getStatusTotalBibitInDetail(DetailTreesLahanTemp, 'MPTS'))
            "
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Simpan</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Jumlah Pohon -->
    <v-dialog
      v-model="dialogDetailPohonEdit"
      max-width="450px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-text>
          <v-row class="pt-7">
            <v-col cols="12">
              <v-simple-table>
                <tbody>
                  <tr
                    v-if="
                      DetailTreesLahanTempData.planting_details &&
                      DetailTreesLahanTempData.land_area < 10000
                    "
                  >
                    <td>Total Available</td>
                    <td>:</td>
                    <td>
                      <strong>
                        {{
                          getAvailableBibit(
                            DetailTreesLahanTemp,
                            DetailTreesLahanTempData.max_seed_amount ||
                              getSeedCalculation(
                                DetailTreesLahanTempData,
                                "total_max_trees"
                              ),
                            editedItemPohon
                          )
                        }}</strong
                      >
                      Bibit
                    </td>
                  </tr>
                  <tr>
                    <td>Nama Pohon</td>
                    <td>:</td>
                    <td>
                      <strong>{{ editedItemPohon.tree_name }}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Kategori</td>
                    <td>:</td>
                    <td>
                      <strong>{{ editedItemPohon.tree_category }}</strong>
                    </td>
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
          <v-btn
            rounded
            small
            color="red"
            dark
            @click="closeDetailEditPohon"
            class="px-3"
          >
            <v-icon small class="mr-1">mdi-close</v-icon>
            Keluar</v-btn
          >
          <v-btn
            rounded
            small
            color="green"
            :disabled="
              (DetailTreesLahanTempData.land_area < 10000 &&
                getDisabledSaveItemPohon(
                  DetailTreesLahanTemp,
                  DetailTreesLahanTempData,
                  editedItemPohon
                )) ||
              editedItemPohon.amount < 0
            "
            @click="saveEditPohonTemp"
            class="px-3 white--text"
          >
            <v-icon small class="mr-1">mdi-check</v-icon>
            Set</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Detail -->
    <v-dialog
      v-model="dialogDetail"
      max-width="800px"
      scrollable
      persistent
      content-class="rounded-xl"
    >
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
            <!-- Detail Map -->
            <detailLokasiSostam
              :section="'detailLokasiSostam'"
              :long="defaultItem.long"
              :lat="defaultItem.lat"
              :ff_no="defaultItem.ff_no"
            />

            <v-divider style="background-color: black !important"></v-divider>
            <strong>Data Umum</strong>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <th class="text-left" style="width: 200px; font-size: 14px">
                      Form No
                    </th>
                    <td class="text-left" style="font-size: 14px">
                      <strong>{{ defaultItem.form_no }}</strong>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left" style="width: 200px; font-size: 14px">
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
                    <th class="text-left" style="font-size: 14px">No Ktp</th>
                    <td class="text-left" style="font-size: 14px">
                      <strong>{{ defaultItem.ktp_no }}</strong>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left" style="font-size: 14px">Alamat</th>
                    <td class="text-left" style="font-size: 14px">
                      <strong>{{ defaultItem.alamat }}</strong>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider style="background-color: black !important"></v-divider>
            <strong>Keterangan Lahan</strong>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <th class="text-left" style="width: 200px; font-size: 14px">
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
                </tbody>
              </template>
            </v-simple-table>
            <v-divider style="background-color: black !important"></v-divider>
            <strong>Waktu dan Lokasi</strong>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <th class="text-left" style="font-size: 14px">
                      Pembuatan Lubang Tanam
                    </th>
                    <td class="text-left" style="font-size: 14px">
                      <v-card
                        rounded
                        block
                        darken
                        color="orange"
                        class="align-center"
                      >
                        <strong
                          >{{
                            gettanggal(defaultItem.start_pembuatan_lubang_tanam)
                          }}
                          s/d
                          {{
                            gettanggal(defaultItem.pembuatan_lubang_tanam)
                          }}</strong
                        >
                      </v-card>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left" style="font-size: 14px">
                      Waktu Distribusi Bibit
                    </th>
                    <td class="text-left" style="font-size: 14px">
                      <strong>{{
                        gettanggal(defaultItem.distribution_time)
                      }}</strong>
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
                      Rekomanedasi Armada
                    </th>
                    <td class="text-left" style="font-size: 14px">
                      <strong>{{ defaultItem.rec_armada }}</strong>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left" style="font-size: 14px">
                      Waktu Penanaman Petani
                    </th>
                    <td class="text-left" style="font-size: 14px">
                      <v-card
                        rounded
                        block
                        darken
                        color="orange"
                        class="align-center"
                      >
                        <strong
                          >{{ gettanggal(defaultItem.planting_time) }} s/d
                          {{
                            gettanggal(defaultItem.end_planting_time)
                          }}</strong
                        >
                      </v-card>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider style="background-color: black !important"></v-divider>
            <div>
              <h4 class="mt-3">Jenis dan Jumlah Bibit</h4>
              <v-simple-table
                v-if="
                  defaultItem.max_seed_amount && defaultItem.planting_details
                "
              >
                <tbody>
                  <tr>
                    <td>
                      Max Kayu
                      {{
                        getStatusTotalBibitInDetail(
                          defaultItem.planting_details,
                          "EXISTS",
                          "MPTS"
                        ) > 0
                          ? "(+MPTS)"
                          : ""
                      }}
                    </td>
                    <td>:</td>
                    <td>
                      <strong>{{ defaultItem.max_seed_amount }}</strong> Bibit
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Total Kayu
                      {{
                        getStatusTotalBibitInDetail(
                          defaultItem.planting_details,
                          "EXISTS",
                          "MPTS"
                        ) > 0
                          ? "(+MPTS)"
                          : ""
                      }}
                    </td>
                    <td>:</td>
                    <td>
                      <v-btn
                        rounded
                        dark
                        :color="
                          getStatusTotalBibitInDetail(
                            defaultItem.planting_details,
                            'COLOR',
                            defaultItem.max_seed_amount
                          )
                        "
                        class="pr-2"
                      >
                        {{
                          getStatusTotalBibitInDetail(
                            defaultItem.planting_details,
                            "KAYU"
                          ) +
                          getStatusTotalBibitInDetail(
                            defaultItem.planting_details,
                            "MPTS"
                          )
                        }}
                        Bibit
                        <v-icon class="ml-2">{{
                          getStatusTotalBibitInDetail(
                            defaultItem.planting_details,
                            "COLOR",
                            defaultItem.max_seed_amount
                          ) == "green"
                            ? "mdi-check-circle"
                            : "mdi-close-circle"
                        }}</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                  <tr
                    v-if="
                      getStatusTotalBibitInDetail(
                        defaultItem.planting_details,
                        'EXISTS',
                        'CROPS'
                      ) > 0
                    "
                  >
                    <td>Total Crops</td>
                    <td>:</td>
                    <td>
                      <strong>
                        {{
                          getStatusTotalBibitInDetail(
                            defaultItem.planting_details,
                            "CROPS"
                          )
                        }}
                      </strong>
                      Bibit
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
            <v-divider style="background-color: black !important"></v-divider>
            <v-row class="mt-2 py-4">
              <v-col cols="12" md="6" lg="4">
                <p>Tanda Tangan Petani</p>
                <v-img
                  aspect-ratio="1"
                  lazy-src=""
                  class="rounded-lg cursor-pointer elevation-5"
                  transition="fade-transition"
                  :src="`${$store.state.apiUrlImage}${defaultItem.signature}`"
                  @click="
                    () => {
                      preview.signature.url = `${$store.state.apiUrlImage}${defaultItem.signature}`;
                      preview.signature.modal = true;
                    }
                  "
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

            <!--Preview Foto Absensi -->
            <v-divider style="background-color: black !important"></v-divider>
            <v-row class="mt-2">
              <v-col cols="12" md="6" lg="4">
                <p>Foto Absensi 1</p>
                <v-img
                  aspect-ratio="1"
                  lazy-src=""
                  class="rounded-lg cursor-pointer elevation-5"
                  transition="fade-transition"
                  :src="`${$store.state.apiUrlImage}${defaultItem.absensi1}`"
                  @click="
                    () => {
                      preview.absensi1.url = `${$store.state.apiUrlImage}${defaultItem.absensi1}`;
                      preview.absensi1.modal = true;
                    }
                  "
                >
                  <template v-slot:placeholder>
                    <v-skeleton-loader
                      class="mx-auto rounded-lg"
                      type="image"
                    ></v-skeleton-loader>
                  </template>
                </v-img>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <p>Foto Absensi 2</p>
                <v-img
                  aspect-ratio="1"
                  lazy-src=""
                  class="rounded-lg cursor-pointer elevation-5"
                  transition="fade-transition"
                  :src="`${$store.state.apiUrlImage}${defaultItem.absensi2}`"
                  @click="
                    () => {
                      preview.absensi2.url = `${$store.state.apiUrlImage}${defaultItem.absensi2}`;
                      preview.absensi2.modal = true;
                    }
                  "
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
            @click="
              () => {
                dialogDetail = false;
                disabledVerification = false;
              }
            "
            outlined
            elevation="1"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-spacer></v-spacer>
          <p
            class="red--text small mb-0"
            v-if="
              getStatusTotalBibitInDetail(
                defaultItem.planting_details,
                'KAYU'
              ) < 1
            "
          >
            Kayu masih 0!
          </p>
          <v-btn
            v-if="
              RoleAccesCRUDShow == true && defaultItem.waitingapproval == true
            "
            color="success"
            rounded
            @click="verifSubmit()"
            :disabled="
              !defaultItem.signature ||
              getStatusTotalBibitInDetail(
                defaultItem.planting_details,
                'ALL'
              ) == 0 ||
              getStatusTotalBibitInDetail(
                defaultItem.planting_details,
                'KAYU'
              ) == 0 ||
              (defaultItem.land_area < 10000 &&
                getStatusTotalBibitInDetail(
                  defaultItem.planting_details,
                  'COLOR',
                  defaultItem.max_seed_amount
                ) == 'red')
            "
            elevation="1"
            class="px-5 white--text"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Verifikasi
          </v-btn>
          <v-btn
            v-if="
              adjustmentStatus == true && defaultItem.waitingapproval == false
            "
            dark
            color="blue"
            class="px-5"
            rounded
            @click="dialogAdjustmentDataBibit = true"
            :disabled="
              !$store.state.User.role_name == 'FIELD COORDINATOR' &&
              !$store.state.User.role_name == 'UNIT MANAGER' &&
              !$store.state.User.role_group == 'IT'
            "
            outlined
            elevation="1"
          >
            <v-icon class="mr-1">mdi-pencil</v-icon>
            Adjust Data Bibit Sostam
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- modal adjust data bibit -->
    <v-dialog
      v-model="dialogAdjustmentDataBibit"
      max-width="800px"
      scrollable
      persistent
      content-class="rounded-xl"
    >
      <v-card rounded="xl">
        <v-card-title color="orange" class="mb-1 headermodalstyle">
          <span>Adjust Jumlah Bibit</span>
        </v-card-title>
        <v-simple-table>
          <tbody>
            <tr>
              <td>
                Total Kayu
                {{
                  getStatusTotalBibitInDetail(
                    dataToStore.adjustment_planting_details,
                    "EXISTS",
                    "MPTS"
                  ) > 0
                    ? "(+MPTS)"
                    : ""
                }}
              </td>
              <td>:</td>
              <td>
                <v-btn
                  rounded
                  dark
                  :color="
                    getStatusTotalBibitInDetail(
                      dataToStore.adjustment_planting_details,
                      'COLOR',
                      defaultItem.max_seed_amount
                    )
                  "
                  class="pr-2"
                >
                  {{
                    getStatusTotalBibitInDetail(
                      dataToStore.adjustment_planting_details,
                      "KAYU"
                    ) +
                    getStatusTotalBibitInDetail(
                      dataToStore.adjustment_planting_details,
                      "MPTS"
                    )
                  }}
                  Bibit
                  <v-icon class="ml-2">{{
                    getStatusTotalBibitInDetail(
                      dataToStore.adjustment_planting_details,
                      "COLOR",
                      defaultItem.max_seed_amount
                    ) == "green"
                      ? "mdi-check-circle"
                      : "mdi-close-circle"
                  }}</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-divider></v-divider>
        <v-card-text>
          <h4 class="mt-3 red--text">
            <strong>Klik Jumlah Bibit Pada Tabel Untuk Mengubah!</strong>
          </h4>
          <v-data-table
            :headers="headerUpdateDetailBibit"
            :items="dataToStore.adjustment_planting_details"
            class="elevation-1"
          >
            <template v-slot:body="{ items, headers }">
              <tbody>
                <tr v-for="(item, idx, k) in items" :key="idx">
                  <td v-for="(header, key) in headers" :key="key">
                    <v-edit-dialog
                      :return-value.sync="item[header.value]"
                      @save="simpanJumlah"
                      large
                    >
                      {{ item[header.value] }}
                      <template v-if="header.value == 'amount'" v-slot:input>
                        <v-text-field
                          v-model="item[header.value]"
                          label="Edit"
                          single-line
                          type="number"
                        ></v-text-field>
                        <!-- Amount Limitation -->
                        <!-- @change="$v=>$v > item.maxAmount? item[header.value]=item.maxAmount:''"
                                  :rules="[
                                    v => (!!v && v <= item.maxAmount)|| 'Jumlah Tidak Bisa Lebih!'
                                  ]" -->
                      </template>
                    </v-edit-dialog>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="elevation-15 rounded-xl">
          <v-btn
            color="red px-5"
            rounded
            dark
            @click="dialogAdjustmentDataBibit = false"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green white--text" rounded @click="saveDataAdjustment">
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Simpan
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
        <v-card-title class="justify-center"
          >Apakah Anda yakin Untuk <strong> Verifikasi</strong>?
          <small class="red--text">Hasil Tidak Dapat Dikembalikan</small>
        </v-card-title>
        <v-card-actions class="pb-3">
          <v-spacer></v-spacer>
          <v-btn
            color="red white--text"
            class="px-4"
            rounded
            @click="closeVerification"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Keluar</v-btn
          >
          <v-btn
            color="success"
            class="px-4"
            rounded
            @click="VerificationItemConfirm"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            YA</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Modal Petani Susulan-->
    <v-dialog
      v-model="dialogPetaniSusulan"
      max-width="500px"
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title class="d-flex justify-center">
          Apa Anda Yakin Melakukan Proses Ini?
        </v-card-title>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="red white--text"
            rounded
            small
            @click="closePetaniSusulan"
            class="px-4"
          >
            <v-icon class="mr-1" small>mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-btn
            color="green white--text"
            rounded
            small
            @click="approvePetaniSusulan"
            class="px-4"
          >
            <v-icon class="mr-1" small>mdi-save</v-icon>
            Simpan
          </v-btn>
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
        <v-card-title class="d-flex justify-center"
          >Apa Anda Yakin Menghapus Data Ini?</v-card-title
        >
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="orange white--text"
            rounded
            small
            @click="closeDelete"
            class="px-4"
          >
            <v-icon class="mr-1" small>mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-btn
            color="red white--text"
            rounded
            small
            @click="deleteItemConfirm"
            class="px-4"
          >
            <v-icon class="mr-1" small>mdi-delete</v-icon>
            OK
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
        <v-card-title class="d-flex justify-center"
          >Apa Anda Yakin Untuk UNVERIFIKASI Data Ini?</v-card-title
        >
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="orange white--text"
            rounded
            small
            @click="dialogUnverif = false"
            class="px-4"
          >
            <v-icon class="mr-1" small>mdi-close-circle</v-icon>
            Keluar
          </v-btn>
          <v-btn
            color="red white--text"
            rounded
            small
            @click="unverifItemConfirm"
            class="px-4"
          >
            <v-icon class="mr-1" small>mdi-undo</v-icon>
            OK
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Preview Signature Modal -->
    <v-dialog
      v-model="preview.signature.modal"
      max-width="500px"
      content-class="rounded-xl"
      scrollable
    >
      <v-card class="rounded-xl">
        <v-card-title> Preview Foto Tanda Tangan </v-card-title>
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
            Keluar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Preview Absensi1 Modal -->
    <v-dialog
      v-model="preview.absensi1.modal"
      max-width="500px"
      content-class="rounded-xl"
      scrollable
    >
      <v-card class="rounded-xl">
        <v-card-title> Preview Foto Absensi 1 </v-card-title>
        <v-card-text class="pa-1 fontall">
          <v-container>
            <v-img
              class="w-100 rounded-lg"
              :lazy-src="`${preview.absensi1.url}`"
              :src="`${preview.absensi1.url}`"
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
            @click="preview.absensi1.modal = false"
          >
            <v-icon left> mdi-close-circle-outline </v-icon>
            Keluar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Preview Absensi2 Modal -->
    <v-dialog
      v-model="preview.absensi2.modal"
      max-width="500px"
      content-class="rounded-xl"
      scrollable
    >
      <v-card class="rounded-xl">
        <v-card-title> Preview Foto Absensi 2 </v-card-title>
        <v-card-text class="pa-1 fontall">
          <v-container>
            <v-img
              class="w-100 rounded-lg"
              :lazy-src="`${preview.absensi2.url}`"
              :src="`${preview.absensi2.url}`"
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
            @click="preview.absensi2.modal = false"
          >
            <v-icon left> mdi-close-circle-outline </v-icon>
            Keluar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END: MODAL -->

    <!-- Main Table -->
    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      class="rounded-xl elevation-6 mx-3 pa-1 mb-2"
      :headers="headers"
      :items="dataobject"
      :loading="loadtable"
      :options.sync="table.options"
      :server-items-length="table.datas.total"
      loading-text="Loading... Please wait"
      :page="table.pagination.current_page"
      :show-expand="true"
      single-expand
      @item-expanded="checkExpandenItem"
      :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman',
        itemsPerPageOptions: [10, 25, 50, 100, 250, 500],
        showCurrentPage: true,
        showFirstLastPage: true,
      }"
    >
      <!--CountDown-->
      <template v-slot:item.countDown="{ item }">
        <div :id="`counter-${item.id}`"></div>
        {{ getCountDown(item) }}
      </template>

      <!-- index column -->
      <template v-slot:item.index="{ item, index }">
        <span v-if="loadtable == false">
          {{
            index +
            1 +
            (table.pagination.current_page - 1) * table.pagination.per_page
          }}
        </span>
        <v-progress-circular
          v-else
          indeterminate
          color="green"
          size="20"
        ></v-progress-circular>
      </template>

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
                  <v-icon class="mr-1" small>mdi-filter-variant</v-icon>
                  Filter
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
                    Berdasarkan Area
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
                    Berdasarkan Karyawan
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    v-if="RoleAccesFilterShow == true"
                    rounded
                    dark
                    class="mx-3 mt-1"
                    @click="resetFilter()"
                    color="green"
                  >
                    <v-icon class="mx-2" small>mdi-refresh</v-icon>
                    Reset Filter
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
            <!-- Program Year -->
            <v-select
              color="success"
              item-color="success"
              v-model="program_year"
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
              label="Tahun Program"
              class="mx-auto mx-lg-3"
              style="max-width: 200px"
            ></v-select>
            <!-- Refresh Button -->
            <v-btn
              @click="resetFilter"
              color="info white--text"
              rounded
              class="mb-2 mb-lg-0"
              :disabled="loadtable"
            >
              <v-icon v-if="!loadtable" small class="mr-1">mdi-refresh</v-icon>
              <v-progress-circular
                v-else
                indeterminate
                size="15"
                class="mr-1"
              ></v-progress-circular>
              Muat Ulang
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            lg="6"
            class="d-none d-lg-flex align-center justify-end"
          >
            <v-btn
              dark
              rounded
              class="mb-2 mr-1 ml-2 d-none d-md-block"
              color="orange"
              @click="$router.push('AdjustmentDataSostam')"
              :disabled="
                !$store.state.User.role_name == 'FIELD COORDINATOR' &&
                !$store.state.User.role_name == 'UNIT MANAGER' &&
                !$store.state.User.role_group == 'IT'
              "
            >
              <v-icon class="mr-1" small>mdi-pencil</v-icon> Data Adjustment
              Bibit Sostam
            </v-btn>

            <v-btn
              :disabled="!$store.state.User.role_group == 'IT'"
              dark
              rounded
              class="mb-2 mr-1 ml-2 d-none d-md-block"
              @click="showAddModal()"
              color="green"
            >
              <v-icon class="mr-1" small>mdi-plus-circle</v-icon> Tambah FF
              Sostam
            </v-btn>

            <!-- dropdown export button -->
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
                  <v-btn
                    v-if="
                      User.role_group == 'IT' ||
                      User.role_name == 'GIS STAFF' ||
                      User.role_name == 'SOCIAL OFFICER'
                    "
                    dark
                    rounded
                    class=""
                    @click="showExportPerUMModal()"
                    color="blue"
                  >
                    <v-icon>mdi-download-box</v-icon> Export Data Sostam By FC
                  </v-btn>
                </v-list-item>

                <!-- <v-list-item>
                    <v-btn
                      :disabled="!valueMU && typegetdata == 'all'"
                      rounded
                      @click="downloadSuperAdmin()"
                      color="blue white--text"
                    >
                      <v-icon class="mr-1" small>mdi-download-circle</v-icon> Export Semua
                    </v-btn>
                  </v-list-item> -->
              </v-list>
            </v-menu>
          </v-col>
          <v-fab-transition>
            <v-btn
              class="d-lg-none mb-16"
              color="green"
              dark
              fixed
              bottom
              right
              fab
              @click="showAddModal()"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-row>
        <v-row class="pb-4 px-2">
          <v-col cols="12" lg="6">
            <!-- Page Table -->
            <v-select
              v-if="false"
              v-model="table.pagination.current_page"
              :items="table.pagination.page_options"
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
              label="Halaman"
              class="centered-select"
              style="width: 50%; max-width: 100px"
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
              :menu-props="{
                bottom: true,
                offsetY: true,
                rounded: 'xl',
                transition: 'slide-y-transition',
              }"
              rounded
              label="Kolom Pencarian"
              class="centered-select"
              style="
                width: 50%;
                max-width: 200px;
                border-top-right-radius: 0px;
                border-bottom-right-radius: 0px;
              "
            ></v-select>
            <!-- Search Input -->
            <v-text-field
              color="success"
              item-color="success"
              v-if="
                table.search.field != 'opsi_pola_tanam' &&
                table.search.field != 'validation'
              "
              v-model="table.search.value"
              append-icon="mdi-magnify"
              outlined
              dense
              rounded
              label="Pencarian"
              hide-details
              style="
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              "
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
              :menu-props="{
                bottom: true,
                offsetY: true,
                rounded: 'xl',
                transition: 'slide-y-transition',
              }"
              rounded
              clearable
              label="Pilih Opsi Pola Tanam"
              class="centered-select"
              style="
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              "
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
              :menu-props="{
                bottom: true,
                offsetY: true,
                rounded: 'xl',
                transition: 'slide-y-transition',
              }"
              rounded
              label="Status"
              class="centered-select"
              style="
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              "
            ></v-select>
          </v-col>

          <v-col cols="12" lg="6" class="d-none d-lg-flex align-center">
            <v-row class="pb-4 px-2">
              <p><strong>Persentase Adjustment Sostam: </strong></p>

              <v-progress-linear
                :value="progressBar.value"
                color="amber"
                height="25"
              >
                <strong>{{ Math.ceil(progressBar.value) }}%</strong>
              </v-progress-linear>
            </v-row>
          </v-col>
        </v-row>
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

      <!--Expand Detail table -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-6">
          <v-data-table
            data-aos="fade-up"
            data-aos-delay="200"
            class="rounded-xl elevation-6 mx-3 pa-1 mb-2"
            :headers="subMainTable.table.expandItem.subHeader"
            :items="subMainTable.table.expandItem.subItem"
            :loading="subMainTable.table.expandItem.loading"
            :options.sync="subMainTable.table.expandItem.options"
            :server-items-length="subMainTable.table.expandItem.total"
            loading-text="Loading... Please wait"
            :page="subMainTable.table.expandItem.current_page"
            :footer-props="{
              itemsPerPageText: 'Jumlah Data Per Halaman',
              itemsPerPageOptions: [10, 25, 40, -1],
              showCurrentPage: true,
              showFirstLastPage: true,
            }"
          >
            <!-- index column -->
            <template v-slot:item.subindex="{ item, index }">
              <span v-if="loadtable == false">
                {{
                  index +
                  1 +
                  (subMainTable.table.expandItem.current_page - 1) *
                    subMainTable.table.expandItem.per_page
                }}
              </span>
              <v-progress-circular v-else indeterminate color="green" size="20">
              </v-progress-circular>
            </template>
            <!-- Status -->
            <template v-slot:item.validation="{ item }">
              <v-chip :color="getColorStatus(item.validation)" dark>
                {{
                  item.validation == 1
                    ? "Verifikasi FC"
                    : item.validation == 0
                    ? "Belum Terverifikasi"
                    : "-"
                }}
              </v-chip>
            </template>
            <template v-slot:item.adjustment_validation="{ item }">
              <v-chip :color="getColorStatus(item.adjustment_validation)" dark>
                {{
                  item.adjustment_validation == 1
                    ? "Verifikasi FC"
                    : item.adjustment_validation == 0
                    ? "Belum Terverifikasi"
                    : item.adjustment_validation == null
                    ? "Belum Melakukan Adjustment"
                    : "-"
                }}
              </v-chip>
            </template>
            <!-- Action table -->
            <template v-slot:item.subactions="{ item }">
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

                <v-list class="d-flex flex-column align-stretch">
                  <v-list-item>
                    <v-btn
                      dark
                      class="w-100"
                      rounded
                      @click="showDetail(item)"
                      color="info"
                      block
                    >
                      <v-icon
                        class="mr-1"
                        @click="showDetail(item)"
                        small
                        color="white"
                      >
                        mdi-information-outline
                      </v-icon>
                      Detail
                    </v-btn>
                  </v-list-item>
                  <!-- <v-list-item v-if="(RoleAccesCRUDShow == true && item.validation != 1 && (User.role_name == 'UNIT MANAGER' || User.role_name == 'REGIONAL MANAGER')) || User.role_group == 'IT' || User.role_name == 'PLANNING MANAGER'">
                <v-btn
                  vi
                  dark
                  class="px-7"
                  rounded
                  @click="showEditDetailModal(item)"
                  color="warning"
                  block
                >
                <v-icon class="mr-1" small color="white">
                  mdi-pencil
                </v-icon>
                  Edit
                </v-btn>
              </v-list-item> -->
                  <v-list-item
                    v-if="
                      RoleAccesCRUDShow == true &&
                      item.validation == 1 &&
                      (User.role_group == 'IT' ||
                        User.role_name == 'UNIT MANAGER' ||
                        User.role_name == 'REGIONAL MANAGER')
                    "
                  >
                    <v-btn
                      rounded
                      @click="showUnverifModal(item)"
                      color="warning"
                      block
                    >
                      <v-icon class="mr-1" small color="white">
                        mdi-undo
                      </v-icon>
                      Unverifikasi
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn
                      dark
                      rounded
                      @click="verifPetaniSusulan(item)"
                      color="green"
                      class="px-5"
                    >
                      <v-icon class="mr-1" small color="white">
                        mdi-plus-box-outline
                      </v-icon>
                      Petani Susulan
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn
                      dark
                      rounded
                      @click="showEditGIS(item)"
                      color="green"
                      :disabled="
                        User.role_group != 'IT' && User.role_name != 'GIS STAFF'
                      "
                      class="px-5"
                    >
                      <v-icon class="mr-1" small color="white">
                        mdi-file-document-edit
                      </v-icon>
                      Edit GIS
                    </v-btn>
                  </v-list-item>
                  <!-- <v-list-item v-if="(RoleAccesCRUDShow == true && item.validation != 1) || User.role_group == 'IT'">
                <v-btn
                  dark
                  rounded
                  @click="showDeleteModal(item)"
                  color="red"
                  block
                  disabled
                >
                <v-icon class="mr-1" small color="white">
                  mdi-delete
                </v-icon>
                  Hapus
                </v-btn>
              </v-list-item> -->
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </td>
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

          <v-list class="d-flex flex-column align-stretch">
            <!-- <v-list-item>
              <v-btn
                dark
                class="w-100"
                rounded
                @click="showDetail(item)"
                color="info"
                block
              >
              <v-icon class="mr-1" @click="showDetail(item)" small color="white">
                  mdi-information-outline
              </v-icon>
                Detail
              </v-btn>
            </v-list-item> -->
            <v-list-item
              v-if="
                (RoleAccesCRUDShow == true &&
                  item.validation != 1 &&
                  (User.role_name == 'FIELD COORDINATOR' ||
                    User.role_name == 'UNIT MANAGER' ||
                    User.role_name == 'REGIONAL MANAGER')) ||
                User.role_group == 'IT' ||
                User.role_name == 'PLANNING MANAGER'
              "
            >
              <v-btn
                vi
                dark
                class="px-7"
                rounded
                @click="showEditDetailModal(item)"
                color="warning"
                block
              >
                <v-icon class="mr-1" small color="white"> mdi-pencil </v-icon>
                Edit
              </v-btn>
            </v-list-item>
            <!-- edit foto absen -->
            <v-list-item
              v-if="
                (RoleAccesCRUDShow == true &&
                  item.validation != 1 &&
                  (User.role_name == 'FIELD COORDINATOR' ||
                    User.role_name == 'UNIT MANAGER' ||
                    User.role_name == 'REGIONAL MANAGER')) ||
                User.role_group == 'IT' ||
                User.role_name == 'PLANNING MANAGER'
              "
            >
              <v-btn
                vi
                dark
                class="px-7"
                rounded
                @click="showEditAbsensiModal(item)"
                color="success"
                block
              >
                <v-icon class="mr-1" small color="white"> mdi-pencil </v-icon>
                Edit Foto Absensi
              </v-btn>
            </v-list-item>
            <!-- export data -->
            <v-list-item
              v-if="
                (RoleAccesCRUDShow == true &&
                  item.validation != 1 &&
                  (User.role_name == 'UNIT MANAGER' ||
                    User.role_name == 'PLANNING MANAGER')) ||
                User.role_group == 'IT'
              "
            >
              <v-btn
                :disabled="
                  !$store.state.User.role_group == 'IT' ||
                  !User.role_name == 'UNIT MANAGER' ||
                  !User.email == 'pandu@trees4trees.org'
                "
                dark
                rounded
                @click="showExportModal(item)"
                color="blue"
              >
                <v-icon class="mr-1" small>mdi-microsoft-excel</v-icon>
                Export Data Sostam
              </v-btn>
            </v-list-item>
            <v-list-item
              v-if="
                RoleAccesCRUDShow == true &&
                item.validation == 1 &&
                (User.role_group == 'IT' ||
                  User.role_name == 'UNIT MANAGER' ||
                  User.role_name == 'REGIONAL MANAGER')
              "
            >
              <v-btn
                rounded
                @click="showUnverifModal(item)"
                color="warning"
                block
              >
                <v-icon class="mr-1" small color="white"> mdi-undo </v-icon>
                Unverifikasi
              </v-btn>
            </v-list-item>
            <!-- <v-list-item>
                    <v-btn
                      :disabled="User.role_group != 'IT'"
                      rounded
                      @click="editDataSostamLahanPetani(item)"
                      color="blue white--text"
                    >
                      <v-icon class="mr-1" small>mdi-refresh</v-icon> EDIT DATA SOSTAM LAHAN PETANI
                    </v-btn>
                  </v-list-item> -->

            <!-- <v-list-item v-if="(RoleAccesCRUDShow == true && item.validation != 1) || User.role_group == 'IT'">
              <v-btn
                dark
                rounded
                @click="showDeleteModal(item)"
                color="red"
                block
                disabled
              >
              <v-icon class="mr-1" small color="white">
                mdi-delete
              </v-icon>
                Hapus
              </v-btn>
            </v-list-item> -->
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
      <div class="d-flex justify-between">
        <p class="mb-0">
          {{ textsnackbar }}
        </p>
        <v-icon small class="pl-1" @click="snackbar = false"
          >mdi-close-circle</v-icon
        >
      </div>
    </v-snackbar>
  </div>
</template>

<script>
// import ModalFarmer from "./ModalFarmer";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import LottieAnimation from "lottie-web-vue";

import detailLokasiSostam from "@/views/Activity/components/sostam/DetailLahanSostamMap";

import Export from "@/views/Activity/SosialisasiTanam/Export";
import ExportSostamByUM from "@/views/Activity/SosialisasiTanam/ExportSostamByUM";

import treeAnimation from "@/assets/lottie/tree.json";
import PickCoordinate from "@/views/Activity/components/sostam/PickCoordinate";
// import {Kebumen} from "@/store/scpecialEmails/nurseryTeam";
// import BaseUrl from "../../services/BaseUrl.js";

export default {
  name: "SosialisasiTanam",
  components: {
    detailLokasiSostam,
    LottieAnimation,
    PickCoordinate,
    Export,
    ExportSostamByUM,
  },
  data: () => ({
    authtoken: "",

    selectExportUM: "",
    selectExportFC: "",

    dialogExportDataSostam: {
      show: false,
    },

    dialogAdd: {
      show: false,
      loading: false,
    },
    dialogPeriodeTanam: {
      show: false,
      loading: false,
    },
    dialogEditGIS: {
      show: false,
      loading: false,
    },

    totalDataBibitSostam: 0,

    dialogUnverif: false,
    dialogConfirmPeriodeTanam: false,
    program_year: "2022",
    alerttoken: false,
    datepicker1: new Date().toISOString().substr(0, 10),
    datepicker2: new Date().toISOString().substr(0, 10),
    datepicker3: new Date().toISOString().substr(0, 10),
    datepicker4: new Date().toISOString().substr(0, 10),
    datepicker5: new Date().toISOString().substr(0, 10),
    datepicker2Show: false,
    datepicker2Loading: false,
    datepicker2NotAvailable: [],
    datepicker2Key: 101,
    datepicker2Key2: 1011,

    //distribution seed
    tempSeed: 0,
    totalDistributionSeed: 0,

    //Export per-ff Modals
    dialogExportSostam: false,
    dialogExportSostamData: null,

    //Export per-UM modals
    dialogexportsostamPerUM: false,
    dialogexportsostamPerUMData: null,

    // periode tanam date picker
    pTDatePicker: new Date().toISOString().substr(0, 10),
    pTDatePicker2: new Date().toISOString().substr(0, 10),
    pTDatePicker3: new Date().toISOString().substr(0, 10),
    pTDatePickerShow: false,
    pTDatePickerLoading: false,
    pTDatePickerNotAvailable: [],
    pTDatePickerKey: 102,
    pTDatePickerKey2: 1012,

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
    mu_no: "",
    menu1: "",
    menu2: "",
    menu3: "",
    dialog: false,
    dialogDelete: false,
    dialogPetaniSusulan: false,
    dialogConfirmPetaniSusulan: false,
    dialogDetail: false,
    dialogAdjustmentDataBibit: false,
    dialogFilterArea: false,
    dialogFilterEmp: false,
    dialogShowEdit: false,
    dialogShowEditAbsensi: false,
    dialogDetailPohon: false,
    dialogDetailPohonEdit: false,
    loadtable: false,
    load: false,
    formTitle: "Add Item",
    search: "",
    type: "",
    adjustmentStatus: false,
    subMainTable: {
      table: {
        expand: true,
        expandItem: {
          ff_no: null,
          subItem: [],
          options: {},
          loading: false,
          total: 0,
          current_page: 1,
          per_page: 10,
          subHeader: [
            { text: "No", value: "subindex", sortable: false, align: "center" },
            { text: "No Form", value: "form_no" },
            { text: "Field Facilitator", value: "nama_ff" },
            { text: "Nama Petani", value: "nama_petani" },
            { text: "No Lahan", align: "center", value: "no_lahan" },
            { text: "Luas Lahan", align: "center", value: "land_area" },
            {
              text: "Koordinat",
              align: "center",
              value: "distribution_coordinates",
            },
            { text: "Pola Tanam", align: "center", value: "opsi_pola_tanam" },
            {
              text: "Waktu Tunggu Validasi",
              align: "center",
              value: "countDown",
              sortable: false,
            },
            {
              text: "Total Bibit",
              align: "center",
              value: "trees_total",
              sortable: false,
            },
            {
              text: "Tahun Tanam",
              align: "center",
              value: "planting_year",
              sortable: false,
            },
            { text: "Status", align: "center", value: "validation" },
            {
              text: "Status Adjustment",
              align: "center",
              value: "adjustment_validation",
            },
            {
              text: "Actions",
              align: "right",
              value: "subactions",
              sortable: false,
            },
          ],
        },
      },
    },
    headers: [
      { text: "No", value: "index", sortable: false, align: "center" },
      { text: "No Sosialisasi", value: "soc_no" },
      { text: "Management Unit", value: "nama_mu" },
      { text: "Target Area", value: "nama_ta" },
      { text: "Field Facilitator", value: "name_ff" },
      { text: "Waktu Distribusi", value: "distribution_date" },
      { text: "Tanggal Sosialisasi", value: "soc_date" },
      {
        text: "Tahun Program",
        align: "center",
        value: "program_year",
        sortable: false,
      },
      { text: "Actions", align: "right", value: "actions", sortable: false },
      {
        text: "Detail Per-FF",
        align: "center",
        value: "data-table-expand",
        sortable: false,
      },
    ],

    headersdetail: [
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Kategori", value: "tree_category", width: "20%" },
      { text: "Jumlah", value: "amount", width: "15%" },
    ],
    headerUpdateDetailBibit: [
      { text: "Nama Pohon", value: "tree_name", width: "20%" },
      { text: "Kategori", value: "tree_category", width: "20%" },
      { text: "Jumlah", value: "amount", width: "15%" },
    ],
    headersdetaileditjumlah: [
      { text: "Nama Pohon", value: "tree_name" },
      { text: "Kategori", value: "tree_category" },
      { text: "Jumlah", value: "amount", align: "center" },
      { text: "Actions", value: "actions", sortable: false, align: "right" },
    ],
    DetailTreesLahanTemp: [],
    DetailTreesLahanTempData: {},
    dataobject: [],
    editedItem: {
      name: "",
    },
    progressBar: {
      value: 0,
    },
    defaultItem: {
      id: "",
      alamat: "",
      current_crops: "",
      distribution_location: "",
      rec_armada: "",
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
      end_planting_time: "",
      planting_year: "",
      type_sppt: "",
      validate_by: "",
      validate_name: "",
      validation: "",
      status: "",
      confirm_date: "",
      waitingapproval: false,
      max_seed_amount: "",
      tutupan_lahan: "",
      countDown: "",
      hour: "",
      minute: "",
      second: "",
      signature: "",
      absensi1: "",
      absensi2: "",

      hourCounter: 12,
      minuteCounter: 0,
      secondCounter: 0,

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
    soc_no: "",

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
          validation: [
            {
              text: "All",
              value: "",
            },
            {
              text: "Unverified",
              value: 0,
            },
            {
              text: "Verified FC",
              value: 1,
            },
          ],
        },
        field: "soc_no",
        value: "",
      },
      datas: {
        total: 0,
      },
      timer: {
        setHour: 12,
        setMinute: 0,
        setSecond: 0,

        hourCount: 0,
        minuteCount: 0,
        secondCount: 0,
      },
      pagination: {
        current_page: 1,
        per_page: 10,
        length_page: 0,
        page_options: [],
      },
      options: {},
      farmer_attendance: [],
      lahans: {
        expanded: [],
        header: [
          { text: "No", value: "index" },
          { text: "Petani", value: "farmer_name" },
          { text: "No Lahan", value: "lahan_no" },
          { text: "Total Kayu", value: "total_kayu", align: "center" },
          { text: "Total MPTS", value: "total_mpts", align: "center" },
          {
            text: "Kehadiran",
            value: "data-table-select",
            align: "right",
            sortable: false,
          },
        ],
        items: [],
        loading: false,
        dialogs: {
          trees: {
            show: false,
            datas: null,
            maxSeeds: {},
          },
        },
      },
    },
    preview: {
      signature: {
        modal: false,
        url: "",
      },
      absensi1: {
        modal: false,
        url: "",
      },
      absensi2: {
        modal: false,
        url: "",
      },
    },
    options: {
      ff: {
        items: [],
        loading: false,
        model: "",
      },
    },
    dataToStore: {
      selectedFF: {},
      hasSostam: false,
      training_material: "TR010",
      distribution_coordinates: "",
      distribution_rec_armada: "",
      distribution_time: "",
      distribution_location: "",
      planting_time: "",
      end_planting_time: "",
      penlub_time: "",
      start_pemlub_time: "",

      absensi_photo: "",
      absensi_photo2: "",
      adjustment_planting_details: [],
      totalAdjustmentSeed: "",
      lahans: [],
    },
    training_material_items: [],
    maps: {
      accessToken: "",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
      center: [113.9213, -0.7893],
      geojson: {},
      hoveredStateId: 0,
      key: 111,
      layerId: 0,
      layerStyle: {
        outline: {
          color: "#000000",
        },
        fill: {
          color: "#f06800",
        },
      },
      legends: {
        model: "",
      },
      listMarker: [],
      loading: {
        show: false,
        text: "Loading...",
      },
      location: { lat: "", lng: "" },
      mapStyle: "",
      model: null,
      popup: {
        model: false,
        content: {
          title: "",
          description: "",
        },
      },
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 3,
    },
    lottie: {
      data: {
        loading: treeAnimation,
      },
    },
    modals: {
      pick_coordinate: {
        show: false,
        data: null,
      },
    },
  }),
  watch: {
    "table.options": {
      handler(newValue) {
        let { page, itemsPerPage, sortBy } = newValue;
        this.table.pagination.current_page = page;
        this.table.pagination.per_page = itemsPerPage;
        this.initialize();
      },
      deep: true,
    },
    "table.search.value": {
      handler() {
        setTimeout(() => {
          this.initialize();
        }, 1000);
      },
      deep: true,
    },
    "table.search.field": {
      handler(newValue) {
        if (newValue == "opsi_pola_tanam") {
          this.getOpsiPolaTanamOptions();
        }
      },
    },
    "subMainTable.table.expandItem.options": {
      handler(newValue) {
        let { page, itemsPerPage, sortBy } = newValue;
        this.subMainTable.table.expandItem.current_page = page;
        this.subMainTable.table.expandItem.per_page = itemsPerPage;

        this.getTableData(this.subMainTable.table.expandItem.ff_no);
      },
      deep: true,
    },
    program_year(newYear) {
      this.initialize();
    },
    "dataToStore.distribution_coordinates": {
      handler(val, oldVal) {
        if (val) {
        }
      },
    },
    "dataToStore.distribution_time": {
      handler(newValue) {
        this.dataToStore.penlub_time = moment(newValue)
          .subtract(21, "days")
          .format("Y-MM-DD");
        this.dataToStore.start_pemlub_time = moment(newValue)
          .subtract(42, "days")
          .format("Y-MM-DD");
        this.dataToStore.planting_time = moment(newValue)
          .add(1, "days")
          .format("Y-MM-DD");
        this.dataToStore.end_planting_time = moment(newValue)
          .add(21, "days")
          .format("Y-MM-DD");
      },
    },

    datepicker2: {
      handler(newValue) {
        this.datepicker1 = moment(newValue)
          .subtract(42, "days")
          .format("Y-MM-DD");
        this.datepicker3 = moment(newValue).add(1, "days").format("Y-MM-DD");
        this.datepicker4 = moment(newValue)
          .subtract(21, "days")
          .format("Y-MM-DD");
        this.datepicker5 = moment(newValue).add(21, "days").format("Y-MM-DD");
      },
    },
    pTDatePicker: {
      handler(newValue) {
        this.pTDatePicker2 = moment(newValue)
          .subtract(14, "days")
          .format("Y-MM-DD");
        this.pTDatePicker3 = moment(newValue).add(7, "days").format("Y-MM-DD");
      },
    },
    datepicker2Show: {
      async handler(newValue) {
        if (newValue == true) {
          // await this.setUnavailableDistributionDates()
          console.log("datepicker2NotAvailable", this.datepicker2NotAvailable);
        }
      },
    },

    pTDatePickerShow: {
      async handler(newValue) {
        if (newValue == true) {
          // Command to disable unavailable distribution date
          // await this.setUnavailableDistributionDates()
          console.log("datepicker2NotAvailable", this.datepicker2NotAvailable);
        }
      },
    },
    menu2: {
      async handler(newValue) {
        if (newValue == true) {
          // await this.setUnavailableDistributionDates()
        }
      },
    },
  },
  computed: {
    disabledCreateSostamByFF() {
      if (
        !this.dataToStore.distribution_time ||
        !this.dataToStore.distribution_location ||
        this.table.lahans.items.length == 0 ||
        !this.dataToStore.distribution_rec_armada ||
        !this.dataToStore.absensi_photo
      )
        return true;
      if (this.table.farmer_attendance.length == 0) return true;

      return false;
    },
    disabledExportSostamFF() {
      if (!this.selectExportUM || !this.selectExportFC) return true;
      return false;
    },
    disabledCreatePeriodeTanamByFF() {
      if (
        !this.dataToStore.distribution_time ||
        !this.dataToStore.distribution_location ||
        !this.dataToStore.distribution_coordinates ||
        !this.dataToStore.distribution_rec_armada
      )
        return true;
      return false;
    },
    disabledUpdateFotoAbsensi() {
      if (!this.dataToStore.absensi_photo) return true;
      return false;
    },
    disabledEditDataGIS() {
      if (!this.dataToStore.distribution_coordinates) return true;
      return false;
    },
  },
  mounted() {
    this.firstAccessPage();
    if (
      this.User.role_group != "IT" ||
      this.User.email != "iyas.muzani@trees4trees.org"
    ) {
      // this.$store.state.maintenanceOverlay = true
    }
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false;

    // reset loading overlay
    this.$store.state.loadingOverlay = false;
    this.$store.state.loadingOverlayText = null;
  },

  methods: {
    async errorResponse(error) {
      console.log(error);
      if (error.response) {
        if (error.response.status) {
          if (error.response.status == 401) {
            const confirm = await Swal.fire({
              title: "Session Ended!",
              text: "Please login again.",
              icon: "warning",
              confirmButtonColor: "#2e7d32",
              confirmButtonText: "Okay",
            });
            if (confirm) {
              localStorage.removeItem("token");
              this.$router.push("/");
            }
          }
          if (error.response.status === 500 || error.response.status === 400) {
            let errMessage = error.response.data.message;
            if (errMessage)
              if (errMessage.includes("Duplicate entry"))
                errMessage = "Data sudah ada!";
            Swal.fire({
              title: "Error!",
              text: `${errMessage || error.message}`,
              icon: "error",
              confirmButtonColor: "#f44336",
            });
          }
        }
      }
    },
    async checkExpandenItem(item) {
      this.soc_no = item.item.soc_no;
      this.subMainTable.table.expandItem.ff_no = item.item.ff_no;
      if (item.value) this.getTableData(item.item.ff_no);
    },
    async firstAccessPage() {
      this.program_year = this.$store.state.programYear.model;
      this.maps.accessToken = this.$store.state.maps.accessToken;
      this.maps.mapStyle = this.$store.state.maps.mapStyle;
      this.authtoken = localStorage.getItem("token");
      this.User = JSON.parse(localStorage.getItem("User"));
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata =
        this.User.ff.value_data == "-" ? "all" : this.User.ff.value_data;
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.BaseUrlUpload = localStorage.getItem("BaseUrlUpload");
      this.BaseUrl = localStorage.getItem("BaseUrl");
      this.employee_no = this.User.employee_no;

      // get search options column
      this.table.search.options.column_loading = true;
      let searchColumns = ["soc_no", "name_ff"];
      // set search column options
      await this.headers.forEach((val) => {
        if (searchColumns.includes(val.value)) {
          this.table.search.options.column.push(val);
        }
      });
      this.table.search.options.column_loading = false;

      // this.fc_no_global = this.User.fc.fc;
      await this.checkRoleAccess();
      await this.getMU();
      await this.getEthnic();
      await this.getJob();
      await this.getFF();
      await this.getUMAll();
      this.training_material_items = await this.callApiGet(
        "GetTrainingMaterials"
      );
    },
    async callApiGet(url) {
      try {
        const response = await this.$_api.get(
         url,
        );
        if (response) {
          const data = response.data.result;
          return data;
        } else return null;
      } catch (error) {
        this.errorResponse(error);
      }
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
      this.$store.state.loadingOverlayText = "Getting sostam datas...";
      this.$store.state.loadingOverlay = true;
      await this.getAdjustmentProgress();
      await this.getSocTableData()
        .then((data) => {
          this.dataobject = data.items;
          this.table.datas.total = data.total;
          this.table.pagination.current_page = data.current_page;
          this.table.pagination.length_page = data.last_page;
          const pageOptions = [];
          for (let index = 1; index <= data.last_page; index++) {
            pageOptions.push(index);
          }
          this.table.pagination.page_options = pageOptions;
        })
        .finally(() => {
          this.$store.state.loadingOverlay = false;
          this.$store.state.loadingOverlayText = null;
          this.loadtable = false;
        });
    },

    async editDataSostamLahanPetani(item) {
      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda Yakin?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        const postDataEdit = {
          ff_no: item.ff_no,
        };
        console.log(postDataEdit);
        try {
          const response = await axios.post(
            this.BaseUrlGet + "test",
            postDataEdit,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          console.log(response.data.data.result);

          this.dialogDetail = false;
          this.dialogPeriodeTanam.show = false;
          this.dialogConfirmPeriodeTanam = false;
          this.dialog = false;
          this.dialogShowEdit = false;

          this.initialize();
        } catch (error) {
          console.error(error.response);
          if (error.response.status == 401) {
            this.dialogDetail = false;
            this.dialogPeriodeTanam.show = false;
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }
      }
    },

    getCountDown(item) {
      const hour = this.table.timer.setHour * 3600000;
      const minute = this.table.timer.setMinute * 60000;
      const second = this.table.timer.setSecond * 1000;

      const setTime = hour + minute + second;
      const startTime = moment(item.created_at);
      const futureTime = startTime + setTime;
      if (!item.distribution_coordinates) {
        setInterval(function () {
          const currentTime = Date.now();
          const remainingTime = futureTime - currentTime;

          var hrs = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
          var mins = Math.floor((remainingTime / (1000 * 60)) % 60);
          var secs = Math.floor((remainingTime / 1000) % 60);

          var resetHrs = "00";
          var resrtMins = "00";
          var resetSecs = "00";

          if (remainingTime > 0) {
            document.getElementById(
              `counter-${item.id}`
            ).innerHTML = `${hrs} : ${mins} : ${secs}`;
          } else if (remainingTime < 0) {
            document.getElementById(
              `counter-${item.id}`
            ).innerHTML = `${resetHrs} : ${resrtMins} : ${resetSecs}`;
            if (!item.deletePeriod) {
              item.deletePeriod = true;
              axios.post(
                "deleteSosialisasiTanamPeriod",
                {
                  ff_no: item.ff_no,
                }
              );
            }
          }
          // console.log(secs)

          /* if(remainingTime < 0){
            console.log(remainingTime)
          }*/
        }, 1000);
      }
    },
    getAdjustmentProgress() {
      axios
        .get(
          this.BaseUrlGet +
            "SeedTotalAdjustmentPerNursery?program_year=" +
            this.program_year,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        )
        .then((res) => {
          if (typeof res.data !== "undefined") {
            this.progressBar.value = res.data.progress_adjustment;
            console.log(this.progressBar.value);
          } else {
            reject("Error");
          }
        })
        .catch((err) => {
          this.sessionEnd(err);
          reject(err);
        });
    },
    getSocTableData() {
      return new Promise((resolve, reject) => {
        const socParams = new URLSearchParams({
          program_year: this.program_year,
          page: this.table.pagination.current_page,
          per_page: this.table.pagination.per_page,
          typegetdata: this.typegetdata,
          sortBy: this.table.options.sortBy || "",
          sortDesc: this.table.options.sortDesc || "",
          search_column: this.table.search.field || "",
          search_value: this.table.search.value || "",
          mu: this.valueMU,
          ta: this.valueTA,
          village: this.valueVillage,
          ff: this.valueFFcode,
        });
        axios
          .get(this.BaseUrlGet + "GetSocAllAdmin?" + socParams, {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          })
          .then((res) => {
            if (typeof res.data.data.result !== "undefined") {
              let items = res.data.data.result.data.data;

              const total = res.data.data.result.data.total;
              const current_page = res.data.data.result.data.current_page;
              const last_page = res.data.data.result.data.last_page;
              resolve({
                items,
                total,
                current_page,
                last_page,
              });
            } else {
              reject("Error");
            }
          })
          .catch((err) => {
            this.sessionEnd(err);
            reject(err);
          });
      });
    },
    getTableData(ff_no) {
      return new Promise((resolve, reject) => {
        this.subMainTable.table.expandItem.loading = true;
        const params = new URLSearchParams({
          program_year: this.program_year,
          page: this.subMainTable.table.expandItem.current_page,
          per_page: this.subMainTable.table.expandItem.per_page,
          // sortBy: this.table.options.sortBy || '',
          // sortDesc: this.table.options.sortDesc || '',
          // search_column: this.table.search.field || '',
          // search_value: this.table.search.value || '',
          // mu: this.valueMU,
          // ta: this.valueTA,
          // village: this.valueVillage,
          typegetdata: "all",
          ff: ff_no,
          // soc_no: this.soc_no,
        });
        axios
          .get(this.BaseUrlGet + "GetSosisalisasiTanamAdmin?" + params, {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          })
          .then((res) => {
            if (typeof res.data.data.result !== "undefined") {
              let items = res.data.data.result.data;
              const total = res.data.data.result.total;
              const current_page = res.data.data.result.current_page;
              const last_page = res.data.data.result.last_page;
              this.subMainTable.table.expandItem.subItem = items;

              this.subMainTable.table.expandItem.total = total;
              this.subMainTable.table.expandItem.current_page = current_page;
              this.subMainTable.table.expandItem.length_page = last_page;
              this.subMainTable.table.expandItem.loading = false;
              // resolve({
              //   items,
              //   total,
              //   current_page,
              //   last_page
              // })
            } else {
              reject("Error");
            }
          })
          .catch((err) => {
            this.sessionEnd(err);
            reject(err);
          });
      });
    },

    async createSostamByFF() {
      try {
        const coordinatesPattern = /^[-+]?\d+(\.\d+)?,\s*[-+]?\d+(\.\d+)?$/;
        const isValidCoordinates = coordinatesPattern.test(
          this.dataToStore.distribution_coordinates
        );
        if (!isValidCoordinates) {
          Swal.fire({
            title: "Perhatian!",
            text: `Format data yang diinputkan salah! Format koordinat harus "long, lat"`,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "Okayy",
          });
        } else {
          const confirmSaving = await Swal.fire({
            title: "Apakah anda yakin?",
            text: "Setelah ini anda tidak akan bisa membatalkannya!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2e7d32",
            cancelButtonColor: "#d33",
            cancelButtonText: "Tidak Jadi",
            confirmButtonText: "Ya, Lanjutkan!",
          });
          if (confirmSaving.isConfirmed) {
            this.dialogAdd.show = false;
            this.$store.state.loadingOverlay = true;

            let dataToStore = {
              ff_no: this.options.ff.model,
              lahans: this.table.lahans.items,
              farmer_attendance: this.table.farmer_attendance,
              program_year: this.program_year,
              distribution_time: this.dataToStore.distribution_time,
              distribution_latitude: this.maps.location.lat,
              distribution_longitude: this.maps.location.lng,
              distribution_location: this.dataToStore.distribution_location,
              distribution_rec_armada: this.dataToStore.distribution_rec_armada,
              distribution_coordinates:
                this.dataToStore.distribution_coordinates,
              training_material: this.dataToStore.training_material,
              planting_time: this.dateFormat(
                this.dataToStore.planting_time,
                "Y-MM-DD"
              ),
              penlub_time: this.dateFormat(
                this.dataToStore.penlub_time,
                "Y-MM-DD"
              ),
              start_pembuatan_lubang_tanam: this.dateFormat(
                this.dataToStore.start_pemlub_time,
                "Y-MM-DD"
              ),
              end_planting_time: this.dateFormat(
                this.dataToStore.end_planting_time,
                "Y-MM-DD"
              ),
              absent: "",
              absent2: "",
            };
            if (this.dataToStore.absensi_photo) {
              const namafile =
                this.options.ff.model +
                "_" +
                this.program_year +
                "_AbsenPetani";
              const response = await axios.post(
                this.BaseUrl + "planting-socialization/upload.php",
                this._utils.generateFormData({
                  nama: namafile,
                  dir: "planting-absent/",
                  image: this.dataToStore.absensi_photo,
                })
              );
              dataToStore.absent = response.data.data.new_name;
            }
            if (this.dataToStore.absensi_photo2) {
              const namafile =
                this.options.ff.model +
                "_" +
                this.program_year +
                "_AbsenPetani2";
              const response = await axios.post(
                this.BaseUrl + "planting-socialization/upload.php",
                this._utils.generateFormData({
                  nama: namafile,
                  dir: "planting-absent/",
                  image: this.dataToStore.absensi_photo2,
                })
              );
              dataToStore.absent2 = response.data.data.new_name;
            }
            console.log(dataToStore);

            await this.setUnavailableDistributionDates();

            const isUnavailableDate = this.datepicker2NotAvailable.includes(
              this.dateFormat(dataToStore.distribution_time, "Y-MM-DD")
            );
            if (isUnavailableDate == true) {
              this.dataToStore.distribution_time = "";
              this.colorsnackbar = "red";
              this.textsnackbar = `Tanggal distribusi sudah penuh!`;
              this.timeoutsnackbar = 20000;
              this.snackbar = true;
            } else {
              /*send online*/
              const res = await axios.post(
                this.BaseUrlGet + "createSostamByFF",
                dataToStore,
                {
                  headers: {
                    Authorization: `Bearer ` + this.authtoken,
                  },
                }
              );
              console.log(dataToStore);
              // reset form create value
              this.options.ff.model = "";
              this.table.lahans.items = [];
              this.dataToStore.distribution_location = "";

              this.initialize();
              this.colorsnackbar = "green";
              this.textsnackbar = `Berhasil menambah ${res.data.data.result.created["data"]} data sostam`;
              this.timeoutsnackbar = 10000;
              this.snackbar = true;
            }
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.$store.state.loadingOverlay = false;
      }
    },

    async getMU() {
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetManagementUnit" +
            `?program_year=${this.program_year}`,
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
          this.BaseUrlGet +
            "GetTargetArea?mu_no=" +
            valparam +
            `&program_year=${this.program_year}`,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(this.program_year);
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
          this.BaseUrlGet +
            "GetDesa?kode_ta=" +
            valparam +
            `&program_year=${this.program_year}`,
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
          console.log(this.program_year);
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
      console.log(item);
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
          this.dataToStore.adjustment_planting_details =
            response.data.data.result.planting_details.map((val) => {
              return {
                ...val,
                maxAmount: val.amount,
              };
            });
          this.defaultItem.land_area = response.data.data.result.luas_lahan;
          if (response.data.data.result.absent == null) {
            this.defaultItem.absensi1 = "images/noimage2.png";
          } else {
            this.defaultItem.absensi1 =
              "planting-socialization/planting-absent/" +
              response.data.data.result.absent;
          }
          if (response.data.data.result.absent2 == null) {
            this.defaultItem.absensi2 = "images/noimage2.png";
          } else {
            this.defaultItem.absensi2 =
              "planting-socialization/planting-absent/" +
              response.data.data.result.absent2;
          }

          if (
            this.defaultItem.max_seed_amount == null ||
            this.defaultItem.max_seed_amount == "null"
          ) {
            let maxSeedTrue = parseInt(
              this.getSeedCalculation(this.defaultItem, "total_max_trees")
            );
            let totalBibitMPTSKAYU =
              parseInt(
                this.getStatusTotalBibitInDetail(
                  this.defaultItem.planting_details,
                  "KAYU"
                )
              ) +
              parseInt(
                this.getStatusTotalBibitInDetail(
                  this.defaultItem.planting_details,
                  "MPTS"
                )
              );

            let separator = maxSeedTrue - totalBibitMPTSKAYU;
            console.log("separator = " + separator);
            if (separator < 0 && this.defaultItem.land_area < 10000) {
              this.disabledVerification = true;
            }

            // set max_seed_amount
            this.defaultItem.max_seed_amount = maxSeedTrue;
          }
          this.defaultItem.waitingapproval = this.waitingapprovefunct(
            response.data.data.result.validation
          );
          if (this.defaultItem.distribution_coordinates) {
            this.defaultItem.lat =
              this.defaultItem.distribution_coordinates.split(",")[0];

            this.defaultItem.long = this.defaultItem.distribution_coordinates
              .split(",")[1]
              .replace(" ", "");
          }

          if (this.type == "Detail") {
            this.load = false;
          } else {
            //   this.valueMUForm = response.data.data.result.mu_no;
            // this.valueTAForm = response.data.data.result.target_area;
            this.valueFFForm = response.data.data.result.ff_no;
            this.datepicker1 = response.data.data.result.pembuatan_lubang_tanam;
            this.datepicker2 = response.data.data.result.distribution_time;
            this.datepicker3 = response.data.data.result.planting_time;
            // this.datepicker4 = response.data.data.result
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

    async verifPetaniSusulan(item) {
      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda Yakin?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        const datapost = {
          form_no: item.form_no,
        };
        console.log(item);

        try {
          const response = await axios.post(
            this.BaseUrlGet + "UpdatePetaniSusulan",
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
            this.dialogPetaniSusulan = false;
            this.initialize();
          } else {
            this.dialogDetail = false;
            this.dialogPetaniSusulan = false;
          }
        } catch (error) {
          console.error(error.response);
          if (error.response.status == 401) {
            this.dialogDetail = false;
            this.dialogPetaniSusulan = false;
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }
      }
    },
    async SaveEditGIS() {
      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda Yakin?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        const postEditGIS = {
          ff_no: this.dataToStore.ff_no,
          distribution_coordinates: this.dataToStore.distribution_coordinates,
        };
        console.log(postEditGIS);
        try {
          const response = await axios.post(
            this.BaseUrlGet + "UpdateCoordinatebyGis",
            postEditGIS,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          console.log(response.data.data.result);

          this.dialogEditGIS.show = false;
          await this.resetFilter();
        } catch (error) {
          console.error(error.response);
          if (error.response.status == 401) {
            this.dialogEditGIS.show = false;
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }
      }
    },
    async pushDataPeriodeTanam() {
      const datapost = {
        program_year: this.program_year,
        form_no: this.defaultItem.form_no,
        ff_no: this.defaultItem.ff_no,
        pembuatan_lubang_tanam: this.dataToStore.penlub_time,
        distribution_time: this.dataToStore.distribution_time,
        distribution_location: this.dataToStore.distribution_location,
        planting_time: this.dataToStore.planting_time,
        distribution_coordinates: this.dataToStore.distribution_coordinates,
        distribution_rec_armada: this.dataToStore.distribution_rec_armada,
        start_pembuatan_lubang_tanam: this.dataToStore.start_pemlub_time,
        end_planting_time: this.dataToStore.end_planting_time,
      };
      console.log(datapost);

      try {
        const response = await axios.post(
          this.BaseUrlGet + "createSosialisasiTanamPeriod",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);

        this.dialogDetail = false;
        this.dialogPeriodeTanam.show = false;
        this.dialogConfirmPeriodeTanam = false;
        this.dialog = false;
        this.dialogShowEdit = false;

        this.initialize();
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialogDetail = false;
          this.dialogPeriodeTanam.show = false;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    async verif() {
      console.log(this.defaultItem.id);
      const datapost = {
        form_no: this.defaultItem.form_no,
        validate_by: this.employee_no,
        max_seed_amount: this.defaultItem.max_seed_amount,
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
          this.getTableData(this.subMainTable.table.expandItem.ff_no);
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
          console.log(this.itemsfc);
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

    async updateDataByFarmers() {
      const datapost = {
        form_no: this.defaultItem.form_no,
        ff_no: this.defaultItem.ff_no,
        farmer_no: this.defaultItem.farmer_no,
        no_lahan: this.defaultItem.no_lahan,
        program_year: this.defaultItem.planting_year,
        pembuatan_lubang_tanam: this.datepicker4,
        distribution_time: this.datepicker2,
        planting_time: this.datepicker3,
        end_planting_time: this.datepicker5,
        start_pembuatan_lubang_tanam: this.datepicker1,
        distribution_location: this.defaultItem.distribution_location,
      };
      try {
        this.$store.state.loadingOverlay = true;
        const response = await axios.post(this.BaseUrlGet + "", datapost, {
          headers: {
            Authorization: `Bearer ` + this.authtoken,
          },
        });
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.$store.state.loadingOverlay = false;
          this.dialog = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.initialize();
        } else {
          this.dialog = true;
          this.$store.state.loadingOverlay = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = true;
          this.$store.state.loadingOverlay = false;
        }
      }
    },
    async updateAbsentPhoto() {
      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda Yakin?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        const updatedatapost = {
          ff_no: this.dataToStore.ff_no,
          absent: "",
          absent2: "",
        };
        if (this.dataToStore.absensi_photo) {
          const namafile =
            updatedatapost.ff_no + "_" + this.program_year + "_AbsenPetani";
          const response = await axios.post(
            this.BaseUrl + "planting-socialization/upload.php",
            this._utils.generateFormData({
              nama: namafile,
              dir: "planting-absent/",
              image: this.dataToStore.absensi_photo,
            })
          );
          updatedatapost.absent = response.data.data.new_name;
        }
        if (this.dataToStore.absensi_photo2) {
          const namafile =
            updatedatapost.ff_no + "_" + this.program_year + "_AbsenPetani2";
          const response = await axios.post(
            this.BaseUrl + "planting-socialization/upload.php",
            this._utils.generateFormData({
              nama: namafile,
              dir: "planting-absent/",
              image: this.dataToStore.absensi_photo2,
            })
          );
          updatedatapost.absent2 = response.data.data.new_name;
        }
        console.log(updatedatapost);

        try {
          this.$store.state.loadingOverlay = true;
          const response = await axios.post(
            this.BaseUrlGet + "UpdateAbsenSosialisasi",
            updatedatapost,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          console.log(response.data.data.result);
          if (response.data.data.result == "success") {
            this.$store.state.loadingOverlay = false;
            this.dialog = false;
            this.snackbar = true;
            this.colorsnackbar = "green";
            this.textsnackbar = "Sukses mengubah data";
            this.initialize();
          } else {
            this.dialogShowEditAbsensi = false;
            this.$store.state.loadingOverlay = false;
          }
        } catch (error) {
          console.error(error.response);
          if (error.response.status == 401) {
            this.dialogShowEditAbsensi = false;
            this.$store.state.loadingOverlay = false;
          }
        }
      }
    },
    async updateData() {
      const datapost = {
        //form_no: this.defaultItem.form_no,
        ff_no: this.defaultItem.ff_no,
        //farmer_no: this.defaultItem.farmer_no,
        //no_lahan: this.defaultItem.no_lahan,
        program_year: this.defaultItem.planting_year,
        pembuatan_lubang_tanam: this.datepicker4,
        distribution_time: this.datepicker2,
        planting_time: this.datepicker3,
        end_planting_time: this.datepicker5,
        start_pembuatan_lubang_tanam: this.datepicker1,
        distribution_location: this.defaultItem.distribution_location,
      };
      console.log(datapost);
      this.dialogDetail = false;
      this.dialog = false;
      try {
        this.$store.state.loadingOverlay = true;
        const response = await axios.post(
          this.BaseUrlGet + "UpdateSosialisasiTanamPeriod",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        console.log(response.data.data.result);
        if (response.data.data.result == "success") {
          this.$store.state.loadingOverlay = false;
          this.dialog = false;
          this.snackbar = true;
          this.colorsnackbar = "green";
          this.textsnackbar = "Sukses mengubah data";
          this.initialize();
        } else {
          this.dialog = true;
          this.$store.state.loadingOverlay = false;
        }
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.dialog = true;
          this.$store.state.loadingOverlay = false;
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
      console.log(this.selectExportUM);
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
    selectedExportUM(a) {
      console.log(a);
      this.valueUM = a;

      if (a != null) {
        this.getEmpFCbyManager(a);
        this.valueFC = "";
        this.selectFC = "";
        this.typegetdata = "several";
      } else {
        this.valueUM = "";
        this.valueFC = "";
        this.itemsfc = [];
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
      this.disabledVerification = false;
      if (item.adjustment_validation == null) {
        this.adjustmentStatus = true;
      } else {
        this.adjustmentStatus = false;
      }
      console.log(this.adjustmentStatus);
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
    async resetFilter() {
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

      this.table.search.field = "";
      this.table.search.value = "";

      // this.search_column = "";
      // this.search_value = "";
      // this.typegetdata = this.User.ff.value_data;
      await this.initialize();
    },
    async searchbyarea() {
      this.valueFFcode = this.User.ff.ff;
      this.typegetdata = this.User.ff.value_data;
      await this.initialize();
      // await this.resetFilter();
      this.dialogFilterArea = false;
    },
    async searchbyemp() {
      await this.initialize();
      // await this.resetFilter();
      this.dialogFilterEmp = false;
    },
    async showEditModal() {
      this.type = "Edit";
      // console.log(this.itemTemp);
      this.dialog = true;
      this.dialogShowEdit = false;
      //await this.getDetail(this.itemTemp);
      //console.log(this.itemTemp);
      // await this.getPetani();
      //   console.log(item.farmer_no);
      //   console.log(item);

      this.defaultItem.planting_year = this.itemTemp.program_year;
      this.defaultItem.ff_no = this.itemTemp.ff_no;
      this.formTitle = "Edit data";
      //this.defaultItem.farmer_no = this.itemTemp.farmer_no;
    },
    async showEditJumlahPohonModal() {
      // console.log(item.kode);
      this.type = "Edit";
      await this.getDetail(this.itemTemp);

      this.DetailTreesLahanTemp = this.defaultItem.planting_details;
      this.DetailTreesLahanTempData = this.defaultItem;

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
    showEditAbsensiModal(item) {
      //console.log(item);
      this.dataToStore.ff_no = item.ff_no;
      this.dialogShowEditAbsensi = true;

      this.dataToStore.absensi_photo = "";
      this.dataToStore.absensi_photo2 = "";
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
        max_seed_amount: this.defaultItem.max_seed_amount,
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
    showPetaniSusulanModal() {
      console.log(this.itemTemp);
      this.dialogPetaniSusulan = true;
      // this.dialogShowEdit = false;
      this.defaultItem.form_no = this.itemTemp.form_no;
    },

    showEditGIS(item) {
      this.dataToStore.ff_no = item.ff_no;
      this.dataToStore.distribution_coordinates = item.distribution_coordinates;
      this.dialogEditGIS.show = true;
    },

    showPlantingPeriode() {
      console.log(this.itemTemp);

      this.dialogPeriodeTanam.show = true;
      this.defaultItem.form_no = this.itemTemp.form_no;
      this.defaultItem.ff_no = this.itemTemp.ff_no;
      this.defaultItem.mu_no = this.itemTemp.mu_no;

      this.dataToStore.distribution_time = "";
      this.dataToStore.start_pemlub_time = "";
      this.dataToStore.penlub_time = "";
      this.dataToStore.planting_time = "";
      this.dataToStore.end_planting_time = "";
      this.dataToStore.distribution_coordinates = "";
      this.dataToStore.distribution_location = "";
      this.dataToStore.distribution_rec_armada = "";
    },

    showUnverifModal(item) {
      // console.log(item.form_no);
      this.defaultItem.form_no = item.form_no;
      this.dialogUnverif = true;
    },
    async unverifItemConfirm() {
      this.$store.state.loadingOverlayText = "Unverification data...";
      this.$store.state.loadingOverlay = true;
      const datapost = {
        form_no: this.defaultItem.form_no,
      };
      // this.dialogDetail = false;
      try {
        this.dialogUnverif = false;
        await axios.post(
          this.BaseUrlGet + "UnverificationSosialisasiTanam",
          datapost,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        this.$store.state.loadingOverlayText = null;
        this.$store.state.loadingOverlay = false;
        await this.getTableData(this.subMainTable.table.expandItem.ff_no);
      } catch (error) {
        console.error(error.response);
        if (error.response.status == 401) {
          this.alerttoken = true;
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      } finally {
      }
    },

    showConfirmationPeriodeTanam() {
      this.dialogConfirmPeriodeTanam = true;
    },

    deleteItemConfirm() {
      this.verifDelete();
    },
    close() {
      this.dialog = false;
      this.dialogShowEditAbsensi = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    closePetaniSusulan() {
      this.dialogPetaniSusulan = false;
    },
    approvePetaniSusulan() {
      this.verifPetaniSusulan();
    },
    addDataPeriodeTanam() {
      this.pushDataPeriodeTanam();
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
    showExportModal(item) {
      this.dialogExportSostam = true;
      this.dialogExportSostamData = item;
    },

    showExportPerUMModal() {
      console.log("open export");
      // this.dialogexportsostamPerUM = true;
      this.dialogExportDataSostam.show = true;
    },
    showExportSostamPerFCModal() {
      this.dialogexportsostamPerUM = true;
    },

    downloadSuperAdmin() {
      var str = this.BaseUrlGet;
      window.open(
        str.substring(0, str.length - 4) +
          "ExportSostamSuperAdmin?mu=021" +
          this.valueMU +
          "&ta=021010" +
          this.valueTA +
          "&village=" +
          this.valueVillage +
          "&typegetdata=" +
          this.typegetdata +
          "&ff=" +
          this.valueFFcode +
          "&program_year=" +
          this.program_year
      );

      // this.valueMUExcel = "";
      // this.valueTAExcel = "";
      // this.valueVillageExcel = "";
      // this.typegetdataExcel = "";
      // this.valueFFcodeExcel = "";
    },
    getColorStatus(status) {
      if (status == 0 || status == null) return "red";
      else return "green";
    },
    async getOpsiPolaTanamOptions() {
      try {
        this.table.search.options.pola_tanam_loading = true;
        if (this.table.search.options.pola_tanam.length == 0) {
          const res = await axios.get(
            this.BaseUrlGet + "GetOpsiPolaTanamOptions",
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );

          this.table.search.options.pola_tanam = res.data.data.result;
        }
      } finally {
        this.table.search.options.pola_tanam_loading = false;
      }
    },
    async selectedKehadiranPetani(items) {
      //Checkbox condition
      this.table.farmer_attendance = items.map((val) => {
        return val.farmer_no;
      });
      this.table.lahans.items = this.table.lahans.items.map((val) => {
        var attendance = 0;
        if (this.table.farmer_attendance.includes(val.farmer_no))
          attendance = 1;
        return {
          ...val,
          attendance: attendance,
        };
      });
      console.log(this.table.farmer_attendance);
    },
    async showAddModal() {
      try {
        this.dialogAdd.loading = true;
        this.dialogAdd.show = true;
        await this.getFFOptions();
      } finally {
        this.dialogAdd.loading = false;
      }
    },
    async getLahansFF() {
      this.resetDataAddSostam();
      try {
        this.table.lahans.loading = true;

        this.dialogAdd.loading = true;

        const params = new URLSearchParams({
          ff_no: this.options.ff.model,
          program_year: this.program_year,
        });
        const res = await axios.get(
          this.BaseUrlGet + `getFFLahanSostamNew?${params}`,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        this.dataToStore.selectedFF = res.data.data.result.ff;
        this.totalDataBibitSostam = 0;
        this.table.lahans.items = res.data.data.result.lahans.map((value) => {
          this.totalDataBibitSostam += parseInt(
            value.total_kayu + value.total_mpts
          );
          return {
            ...value,
            max_seed_amount: value.total_kayu + value.total_mpts,
            training_material: this.dataToStore.training_material,
          };
        });

        await this.setUnavailableDistributionDates();
        this.checkTotalSeed();
        this.dataToStore.hasSostam =
          res.data.data.result.sostam > 0 ? true : false;
      } catch (err) {
        console.log(err.response);
      } finally {
        this.table.lahans.loading = false;

        this.dialogAdd.loading = false;
      }
    },
    resetDataAddSostam() {
      console.log("reset");
      this.dataToStore.distribution_time = "";
      this.dataToStore.start_pemlub_time = "";
      this.dataToStore.penlub_time = "";
      this.dataToStore.planting_time = "";
      this.dataToStore.end_planting_time = "";
      this.dataToStore.distribution_coordinates = "";
      this.dataToStore.distribution_location = "";
      this.dataToStore.distribution_rec_armada = "";
    },
    async setTanggalDistribusi() {
      this.datepicker2Show = false;
      await this.setUnavailableDistributionDates();
    },

    async getFFOptions() {
      try {
        this.options.ff.loading = true;

        const params = new URLSearchParams({
          typegetdata: this.typegetdata,
          ff: this.valueFFcode.join(),
          program_year: this.program_year,
        });

        const res = await axios.get(
          this.BaseUrlGet + `getFFOptionsSostam?${params}`,
          {
            headers: {
              Authorization: `Bearer ` + this.authtoken,
            },
          }
        );
        this.options.ff.items = res.data.data.result;
      } catch (err) {
        console.log(err.response);
      } finally {
        this.options.ff.loading = false;
      }
    },
    modalActions(val) {
      if (val.type == "save") {
        this.dataToStore.distribution_coordinates = `${val.coordinate.lat},${val.coordinate.lng}`;
      }
      if (["close", "save"].includes(val.type)) {
        this.modals[val.name].show = false;
      }
    },
    showModalPickCoordinate(data) {
      this.modals.pick_coordinate.data = data;
      this.modals.pick_coordinate.show = true;
    },
    // Utilities

    // checkTotalSeed(totalSeeds){
    //   console.log('Total Seed', this.totalDistributionSeed)

    //   if(this.tempSeed + totalSeeds > 3500){

    //   }
    // },

    calendarGetNurseryColor(n, total, totalSeed) {
      let maxFF = this.calendarGetMaxFF(n);
      let maxSeed = this.calendarGetMaxSeed(n);
      if (total === maxFF || maxSeed === totalSeed) {
        return "green";
      } else if (total > maxFF || maxSeed < totalSeed) {
        return "red";
      } else {
        return "yellow";
      }
    },
    calendarGetMaxSeed(n) {
      if (["Ciminyak", "Cirasea", "Soreang"].includes(n)) {
        return 40000;
      } else if (["Pati", "Kebumen"]) {
        return 25000;
      }
    },
    calendarGetMaxFF(n) {
      if (n == "Soreang") {
        return 7;
      } else if (n == "Ciminyak") {
        return 7;
      } else if (n == "Kebumen") {
        return 4;
      } else if (n == "Pati" || n == "Cirasea") {
        return 7;
      } else return 4;
    },
    dateFormat(date, format) {
      return moment(date).format(format);
    },
    disabledEditPohon(trees = [], category = "", sostam) {
      let maxBibit =
        sostam.max_seed_amount ||
        this.getSeedCalculation(sostam, "total_max_trees");
      let minKayu = 1;

      let total = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0,
      };

      trees.forEach((treeData) => {
        total[treeData.tree_category] += parseInt(treeData.amount);
      });

      let totalBibitNow = total.KAYU + total.MPTS + total.CROPS;

      console.log("disable edit pohon : " + total.KAYU);

      if (category != "") {
        if (category == "MPTS") {
          if (total.KAYU < minKayu) {
            return true;
          } else return false;
        } else return false;
      } else return false;
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
    getAvailableBibit(trees = [], maxSeed = 0, item = null) {
      let total = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0,
      };

      trees.forEach((val) => {
        if (item.tree_name != val.tree_name) {
          total[val.tree_category] += parseInt(val.amount);
        }
      });

      if (item.tree_category == "CROPS") {
        return Math.round((total.KAYU * 20) / 100) - item.amount;
      } else if (item.tree_category == "KAYU") {
        return parseInt(maxSeed) - item.amount - total.KAYU - total.MPTS;
      } else if (item.tree_category == "MPTS") {
        if (total.KAYU < Math.round((parseInt(maxSeed) * 60) / 100)) {
          return Math.round((40 / 60) * total.KAYU) - item.amount - total.MPTS;
        } else {
          return parseInt(maxSeed) - item.amount - total.KAYU - total.MPTS;
        }
      }
    },
    getDisabledSaveItemPohon(listEditPohon, dataSostamEditPohon, editPohon) {
      let getAvailableBibit = this.getAvailableBibit(
        listEditPohon,
        dataSostamEditPohon.max_seed_amount ||
          this.getSeedCalculation(dataSostamEditPohon, "total_max_trees"),
        editPohon
      );
      let totalNow = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0,
      };
      listEditPohon.forEach((treeNow) => {
        totalNow[treeNow.tree_category] += parseInt(treeNow.amount);
      });

      let disabled = 0;
      if (getAvailableBibit < 0) {
        disabled += 1;
      }

      if (disabled > 0) {
        return true;
      } else return false;
    },
    getNurseryAlocation(mu_no) {
      const soreang = ["020", "021"];
      const ciminyak = ["023", "026", "027"];
      const cirasea = ["022", "024", "025", "029"];
      const kebumen = ["019"];
      const pati = ["015", "016"];

      let nursery = "All";
      console.log(mu_no);

      if (ciminyak.includes(mu_no)) {
        nursery = "Ciminyak";
      } else if (cirasea.includes(mu_no)) {
        nursery = "Cirasea";
      } else if (kebumen.includes(mu_no)) {
        nursery = "Kebumen";
      } else if (pati.includes(mu_no)) {
        nursery = "Pati";
      } else if (soreang.includes(mu_no)) {
        nursery = "Soreang";
      }

      return nursery;
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
      };
      let trees_max = {
        kayu: 0,
        mpts: 0,
        crops: 0,
      };

      let maxBibit = {
        kayu: 0,
        mpts: 0,
        crops: 0,
      };

      let totalBibitMax = 0;

      if (lahan.land_area < 10000) {
        const luasLahan =
          Math.floor((lahan.land_area > 2000 ? 2000 : lahan.land_area) / 100) *
          100;

        if (lahan.opsi_pola_tanam == "Pola Konservasi Pohon Kayu") {
          maxBibit.kayu = luasLahan * 0.25;
        } else if (
          lahan.opsi_pola_tanam == "Pola Konservasi Pohon Kayu + MPTS"
        ) {
          maxBibit.kayu = luasLahan * 0.25 * 0.6;
          maxBibit.mpts = luasLahan * 0.25 * 0.4;
        } else if (lahan.opsi_pola_tanam == "Pola Agroforestry Satu Jalur") {
          if (luasLahan >= 300) {
            maxBibit = {
              kayu: calculationAgroforestry.satu_jalur[luasLahan][0],
              mpts: calculationAgroforestry.satu_jalur[luasLahan][1],
            };
          }
        } else if (lahan.opsi_pola_tanam == "Pola Agroforestry Tepi") {
          if (luasLahan >= 300) {
            maxBibit = {
              kayu: calculationAgroforestry.tepi[luasLahan][0],
              mpts: calculationAgroforestry.tepi[luasLahan][1],
            };
          }
        } else if (lahan.opsi_pola_tanam == "Pola Agroforestry Acak") {
          if (luasLahan >= 300) {
            maxBibit = {
              kayu: calculationAgroforestry.acak[luasLahan][0],
              mpts: calculationAgroforestry.acak[luasLahan][1],
            };
          }
        }
        totalBibitMax = Math.round(
          ((maxBibit.kayu + maxBibit.mpts) * (100 - lahan.tutupan_lahan)) / 100
        );
      }

      if (typeReturn == "total_max_trees") {
        return totalBibitMax;
      } else if (typeReturn == "setDataToStore") {
        this.table.lahans.items[indexLahan].max_seed_amount = totalBibitMax;
        return totalBibitMax;
      }
    },
    getStatusTotalBibitInDetail(seeds, typeReturn, secParams = null) {
      let exists = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0,
      };
      let total = {
        KAYU: 0,
        MPTS: 0,
        CROPS: 0,
      };
      seeds.forEach((seed) => {
        total[seed.tree_category] += parseInt(seed.amount);
        exists[seed.tree_category] += 1;
      });
      if (
        typeReturn == "KAYU" ||
        typeReturn == "MPTS" ||
        typeReturn == "CROPS"
      ) {
        return total[typeReturn];
      } else if (typeReturn == "ALL") {
        return total.KAYU + total.MPTS + total.CROPS;
      } else if (typeReturn == "COLOR") {
        if (
          total.KAYU > 0 &&
          total.KAYU >= Math.round((60 / 100) * (total.KAYU + total.MPTS)) &&
          total.MPTS <= Math.round((40 / 100) * (total.KAYU + total.MPTS))
        ) {
          return "green";
        } else {
          return "red";
        }
      } else if (typeReturn == "EXISTS") {
        return exists[secParams];
      }
    },
    numberFormat(num) {
      return new Intl.NumberFormat("id-ID").format(num);
    },
    resetJumlahBibit() {
      this.DetailTreesLahanTemp.forEach((seed, seedIndex) => {
        this.DetailTreesLahanTemp[seedIndex].amount = 0;
      });
    },
    showingAvailableDates(val) {
      return this.datepicker2NotAvailable.includes(val) == false;
    },
    async setUnavailableDistributionDates() {
      this.datepicker2Loading = true;
      // get FF MU no
      let ff_mu_no = "";
      await this.options.ff.items.forEach((ffVal) => {
        if (ffVal.ff_no == this.options.ff.model) {
          ff_mu_no = ffVal.mu_no;
          // console.log(ffVal)
        }
      });

      // set mu ff in edit sostam
      console.log("mu_no", this.dataToStore.selectedFF.mu_no);
      if (ff_mu_no == "") {
        if (this.dataToStore.selectedFF.mu_no)
          ff_mu_no = this.dataToStore.selectedFF.mu_no;
      }

      // get ff nursery
      let ff_nursery = this.getNurseryAlocation(ff_mu_no);

      console.log(ff_nursery);
      let ffDatesFull = [];
      let ffDatesAvailable = [];

      const distributionDateRange = [
        {
          // day: '1',
          month: "12",
          year: "2023",
          program_year: this.$store.state.programYear.model,
          /*program_year: '2022',*/
          nursery: ff_nursery,
        },
        {
          // day: '1',
          month: "01",
          year: "2024",
          program_year: this.$store.state.programYear.model,
          /*program_year: '2022',*/
          nursery: ff_nursery,
        },
      ];

      await Promise.all(
        distributionDateRange.map(async (dDate, dIndex) => {
          let params = new URLSearchParams(dDate);
          await axios
            .get(
              localStorage.getItem("BaseUrlGet") +
                "DistributionCalendar?" +
                params,
              {
                headers: {
                  Authorization: `Bearer ` + localStorage.getItem("token"),
                },
              }
            )
            .then((res) => {
              const resData = res.data.data.result.datas || [];

              // console.log(resData)
              resData.forEach((avData, avIndex) => {
                if (avData.nursery == ff_nursery) {
                  avData.color = this.calendarGetNurseryColor(
                    avData.nursery,
                    avData.total,
                    avData.total_bibit_sostam + this.totalDataBibitSostam
                  );
                  console.log(avData);
                  if (avData.color == "yellow") {
                    ffDatesAvailable.push(
                      this.dateFormat(avData.date, "Y-MM-DD")
                    );
                  } else {
                    ffDatesFull.push(this.dateFormat(avData.date, "Y-MM-DD"));
                  }
                }
              });
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              if (dIndex == 2) {
              }
            });
        })
      );
      console.log(ffDatesFull);

      let holiday = [
        "2023-12-11",
        "2023-12-22",
        "2024-01-02",
        "2024-01-13",
        "2024-01-24",
        "2024-02-04",
        "2024-02-15",
      ];

      this.datepicker2NotAvailable = [...ffDatesFull, ...holiday];
      this.datepicker2Loading = false;
      this.datepicker2Key += 1;
      this.datepicker2Key2 += 1;
    },
    simpanJumlah() {
      // this.dataToStore.adjustment_planting_details.map((val)=>{
      //   if(parseInt(val.amount) > val.maxAmount){
      //     const findTree = this.dataToStore.adjustment_planting_details.find(v=>v.tree_code == val.tree_code)
      //     console.log(findTree)
      //     if(findTree){
      //       findTree.amount= val.maxAmount
      //       console.log(findTree)
      //     }
      //   }
      // })
      // console.log(this.dataToStore.adjustment_planting_details);
    },
    async saveDataAdjustment() {
      this.dataToStore.totalAdjustmentSeed =
        parseInt(
          this.getStatusTotalBibitInDetail(
            this.dataToStore.adjustment_planting_details,
            "KAYU"
          )
        ) +
        parseInt(
          this.getStatusTotalBibitInDetail(
            this.dataToStore.adjustment_planting_details,
            "MPTS"
          )
        );
      // console.log(this.dataToStore.totalAdjustmentSeed)
      const confirm = await Swal.fire({
        title: "Apa Anda Yakin?",
        text: "Pastikan Data Perubahan yang Dimasukan Benar!",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya",
        showCancelButton: true,
      });
      if (confirm.isConfirmed) {
        this.dialogDetail = false;
        this.dialogAdjustmentDataBibit = false;
        const dataToPost = {
          form_no: this.defaultItem.form_no,
          totalAdjustmentSeed: this.dataToStore.totalAdjustmentSeed,
          seed_details: this.dataToStore.adjustment_planting_details,
        };
        console.log(dataToPost);
        try {
          const sendData = await axios.post(
            this.BaseUrlGet + "AddAdjustment",
            dataToPost,
            {
              headers: {
                Authorization: `Bearer ` + this.authtoken,
              },
            }
          );
          //  reset form create value
          const notif = await Swal.fire({
            title: "Berhasil Menyimpan Data Adjustment!",
            icon: "success",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "OK",
          });
          if (notif.isConfirmed) {
            //this.$router.push('AdjustmentDataSostam')
            await this.initialize();
            this.getTableData(this.subMainTable.table.expandItem.ff_no);
          }

          this.colorsnackbar = "green";
          this.textsnackbar = `Berhasil menambah ${sendData.data.data.result.created["data"]} data adjustment sostam`;
          this.timeoutsnackbar = 10000;
          this.snackbar = true;
        } catch (error) {
          console.error(error.response);
          //  Swal.fire({
          //   title: 'error',
          //   icon: 'warning',
          //   confirmButtonColor: '#2e7d32',
          //   confirmButtonText: 'OK',

          // })
        }
        this.initialize();
      }
      this.initialize();
      // this.$router.push('AdjustmentDataSostam')
    },
    generateFormData(data) {
      let formData = new FormData();

      const objectArray = Object.entries(data);

      objectArray.forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.map((item) => {
            if (item instanceof Object) {
              formData.append(key + "[]", JSON.stringify(item));
            } else {
              formData.append(key + "[]", item);
            }
          });
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    },
    async sessionEnd(error) {
      console.log(error);
      if (error.response) {
        if (error.response.status) {
          if (error.response.status == 401) {
            const confirm = await Swal.fire({
              title: "Session Ended!",
              text: "Please login again.",
              icon: "warning",
              confirmButtonColor: "#2e7d32",
              confirmButtonText: "Okay",
            });
            if (confirm) {
              localStorage.removeItem("token");
              this.$router.push("/");
            }
          }
          if (error.response.status === 500 || error.response.status === 400) {
            let errMessage = error.response.data.message;
            if (errMessage)
              if (errMessage.includes("Duplicate entry"))
                errMessage = "Data sudah ada!";
            Swal.fire({
              title: "Error!",
              text: `${errMessage || error.message}`,
              icon: "error",
              confirmButtonColor: "#f44336",
            });
          }
        }
      }
    },
  },
};
</script>
