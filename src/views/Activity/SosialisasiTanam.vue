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

    <v-data-table
      :headers="headers"
      :items="dataobject"
      :search="search"
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
          <v-btn
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
          </v-btn>
          <!-- <v-select
            v-model="selectMU"
            :items="itemsMU"
            item-value="mu_no"
            item-text="name"
            v-on:change="selectedMU"
            label="Management Unit"
            clearable
            class="mx-3 mt-7 d-none d-md-block"
            style="max-width: 200px"
          ></v-select>
          <v-select
            v-model="selectTA"
            :items="itemsTA"
            item-value="area_code"
            item-text="name"
            v-on:change="selectedTA"
            label="Targer Area"
            clearable
            class="mx-3 mt-7 d-none d-md-block"
            style="max-width: 225px"
          ></v-select>
          <v-select
            v-model="selectVillage"
            :items="itemsVillage"
            item-value="kode_desa"
            item-text="name"
            v-on:change="selectedVillage"
            label="Desa"
            clearable
            class="mx-3 mt-7 d-none d-md-block"
            style="max-width: 225px"
          ></v-select> -->
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
          <v-btn
            v-if="RoleAccesCRUDShow == true"
            dark
            class="mb-2 mr-1"
            @click="showAddModal()"
            color="green"
          >
            <v-icon small>mdi-plus</v-icon> Add
          </v-btn>
          <v-btn
            v-if="RoleAccesDownloadAllShow == true"
            dark
            class="mb-2 mr-1 d-none d-md-block"
            @click="downloadSuperAdmin()"
            color="blue"
          >
            <v-icon class="mr-1" small>mdi-download-circle</v-icon> Export All
          </v-btn>

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
                          v-on:change="selectPetani"
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
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
                          v-model="defaultItem.no_lahan"
                          label="No Lahan"
                          outlined
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
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="defaultItem.distribution_location"
                          label="Tempat Distribusi Bibit"
                          outlined
                          :rules="rules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4">
                        <v-menu v-model="menu1" transition="scale-transition">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="datepicker1"
                              slot="activator"
                              label="Waktu Pembuatan Lubang Tanam"
                              outlined
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :rules="rules"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="datepicker1"
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="4" md="4">
                        <v-menu v-model="menu2" transition="scale-transition">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="datepicker2"
                              slot="activator"
                              label="Waktu Distribusi Bibit"
                              outlined
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :rules="rules"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="datepicker2"
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="4" md="4">
                        <v-menu v-model="menu3" transition="scale-transition">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="datepicker3"
                              slot="activator"
                              label="Waktu Penanaman"
                              outlined
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :rules="rules"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="datepicker3"
                            @input="menu3 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions v-if="load == false">
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" outlined @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" outlined @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogShowEdit" max-width="500px">
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
                              v-if="RoleAccesCRUDShow == true && item.validation === 0"
                              class="mr-3"
                              @click="editDetailPohon(item)"
                              small
                              color="warning"
                            >
                              mdi-pencil
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

          <!-- Modal Detail -->
          <v-dialog v-model="dialogDetail" max-width="800px">
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
                            No Ktp
                          </th>
                          <th class="text-left" style="font-size: 14px">
                            {{ defaultItem.ktp_no }}
                          </th>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Alamat
                          </th>
                          <th class="text-left" style="font-size: 14px">
                            {{ defaultItem.alamat }}
                          </th>
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
                          <th class="text-left" style="font-size: 14px">
                            {{ defaultItem.opsi_pola_tanam }}
                          </th>
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
                          <th class="text-left" style="font-size: 14px">
                            {{ defaultItem.document_no }}
                          </th>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Luas Lahan dan Tanam
                          </th>
                          <th class="text-left" style="font-size: 14px">
                            {{ defaultItem.luas_lahan }}m<sup>2</sup> dan
                            {{ defaultItem.luas_tanam }}m<sup>2</sup>
                          </th>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Pembuatan Lubang Tanam
                          </th>
                          <th class="text-left" style="font-size: 14px">
                            {{ gettanggal(defaultItem.pembuatan_lubang_tanam) }}
                          </th>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Waktu Distribusi Bibit
                          </th>
                          <th class="text-left" style="font-size: 14px">
                            {{ gettanggal(defaultItem.distribution_time) }}
                          </th>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Lokasi Distribusi Bibit
                          </th>
                          <th class="text-left" style="font-size: 14px">
                            {{ defaultItem.distribution_location }}
                          </th>
                        </tr>
                        <tr>
                          <th class="text-left" style="font-size: 14px">
                            Waktu Penanaman Petani
                          </th>
                          <th class="text-left" style="font-size: 14px">
                            {{ gettanggal(defaultItem.planting_time) }}
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
          @click="showEditDetailModal(item)"
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

export default {
  name: "SosialisasiTanam",
  authtoken: "",
  data: () => ({
    alerttoken: false,
    datepicker1: new Date().toISOString().substr(0, 10),
    datepicker2: new Date().toISOString().substr(0, 10),
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
      { text: "No Form", value: "form_no", width: "15%" },
      {
        text: "No Lahan",
        align: "start",
        value: "no_lahan",
        width: "10%",
      },
      { text: "Nama Petani", value: "nama_petani", width: "17%" },
      { text: "Tahun Tanam", value: "planting_year", width: "15%" },
      { text: "Field Facilitator", value: "nama_ff", width: "15%" },
      { text: "Status", value: "status", width: "13%" },
      { text: "Actions", value: "actions", sortable: false, width: "18%" },
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
    DetailTreesLahanTemp: [],
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

      planting_details: [],
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
  }),
  computed: {
    // formTitle() {
    //   return this.editedIndex === -1 ? "New Item" : "Edit Item";
    // },
  },

  created() {
    this.firstAccessPage();
  },

  methods: {
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
    getColorStatus(status) {
      if (status == "Belum Verifikasi") return "red";
      else return "green";
    },
    async initialize() {
      this.loadtable = true;
      // console.log(this.User.ff.ff);
      try {
        const response = await axios.get(
          this.BaseUrlGet +
            "GetSosisalisasiTanamAdmin?mu=" +
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

    showAddModal() {
      this.load = false;
      // console.log(localStorage.getItem("token"));
      this.defaultItem.id = "";
      this.defaultItem.form_no = "";
      this.defaultItem.nama = "";
      this.defaultItem.name = "";
      this.defaultItem.ktp_no = "";
      this.defaultItem.farmer_no = "";
      this.defaultItem.side_income = "";
      this.defaultItem.ff_no = "";

      this.defaultItem.no_lahan = "";
      this.defaultItem.planting_year = "";
      this.defaultItem.distribution_location = "";

      this.datepicker1 = "";
      this.datepicker2 = "";
      this.datepicker3 = "";

      this.formTitle = "Add data";
      this.dialog = true;
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
  },
};
</script>
