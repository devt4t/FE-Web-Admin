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
          <v-card-text>
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
                


                <v-col cols="12" sm="6" md="6">
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
                    maxlength="Masukan Longtitude"
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
                    maxlength="Masukan Latitude..."
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
                    v-model="defaultItem.religion"
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
                    v-model="defaultItem.religion"
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
                    v-model="defaultItem.religion"
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
                    v-model="defaultItem.religion"
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
                    v-model="defaultItem.religion"
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
                    v-model="defaultItem.religion"
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
                    v-model="defaultItem.religion"
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
                    v-model="defaultItem.religion"
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
                    v-model="defaultItem.gender"
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
                    v-model="defaultItem.marrital"
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
                    v-model="defaultItem.religion"
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
                    v-model="defaultItem.religion"
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

          <v-card-actions v-if="load == false">
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
              ><v-icon class="mr-1">mdi-content-save</v-icon> Simpan
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from "axios";


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
      window.alert('Tambah Petani Lahan!')
    }
  }
}
</script>