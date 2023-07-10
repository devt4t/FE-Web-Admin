<template>
  <v-dialog
    v-model="showModal"
    content-class="rounded-xl mx-1"
    max-width="999"
    scrollable
    persistent
  >
    <v-card>
      <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
        <span class="white--text"
          ><v-btn class="white dark--text mr-1" fab x-small
            ><v-icon color="grey darken-3">mdi-account-heart</v-icon></v-btn
          >
          Form Minat Petani</span
        >
        <v-icon color="white" class="ml-auto" @click="showModal = false"
          >mdi-close-circle</v-icon
        >
      </v-card-title>
      <v-card-text class="pa-0">
        <!-- Loading -->
        <v-overlay absolute :value="loading.show">
          <div class="d-flex flex-column justify-center align-center">
            <v-progress-circular
              :size="80"
              :width="10"
              indeterminate
              color="white"
            >
            </v-progress-circular>
            <p class="mt-2 mb-0">{{ loading.text }}</p>
          </div>
        </v-overlay>
        <!-- SELECT VILLAGE -->
        <v-row class="ma-0 mx-2 mx-lg-5">
          <v-col cols="12" class="d-flex justify-end">
            <p class="mb-0 red--text">
              Tanda "<v-icon color="red" class="">{{
                localConfig.requiredInputIcon
              }}</v-icon
              >" menandakan WAJIB DIISI.
            </p>
          </v-col>
          <v-col cols="12">
            <div class="d-flex align-center">
              <p class="mb-0" style="font-size: 17px">
                <v-icon class="mr-2">mdi-city</v-icon>Lokasi Desa
              </p>
              <v-divider class="mx-2"></v-divider>
            </div>
          </v-col>
          <!-- Management Unit -->
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-autocomplete
              dense
              color="success"
              hide-details
              item-color="success"
              item-text="name"
              item-value="mu_no"
              :items="inputs.mu_no.items"
              :label="inputs.mu_no.label"
              :loading="inputs.mu_no.loading"
              :menu-props="{ rounded: 'xl', transition: 'slide-y-transition' }"
              :no-data-text="inputs.mu_no.loading ? 'Loading...' : 'No Data'"
              outlined
              rounded
              :rules="[(v) => !!v || 'Field is required']"
              v-model="inputs.mu_no.model"
              v-on:change="getOptionsData({ type: 'target_area' })"
            >
              <template v-slot:label>
                <v-icon v-if="inputs.mu_no.labelIcon" class="mr-1">{{
                  inputs.mu_no.labelIcon
                }}</v-icon>
                {{ inputs.mu_no.label }}
                <sup
                  ><v-icon
                    v-if="inputs.mu_no.required"
                    small
                    style="vertical-align: middle;"
                    >{{ localConfig.requiredInputIcon }}</v-icon
                  ></sup
                >
              </template>
            </v-autocomplete>
          </v-col>
          <!-- Target Area -->
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-autocomplete
              dense
              color="success"
              hide-details
              item-color="success"
              item-text="name"
              item-value="area_code"
              :items="inputs.target_area.items"
              :label="inputs.target_area.label"
              :loading="inputs.target_area.loading"
              :menu-props="{ rounded: 'xl', transition: 'slide-y-transition' }"
              :no-data-text="
                inputs.target_area.loading ? 'Loading...' : 'No Data'
              "
              :disabled="false"
              outlined
              rounded
              :rules="[(v) => !!v || 'Field is required']"
              v-model="inputs.target_area.model"
              v-on:change="getOptionsData({ type: 'village' })"
            >
              <template v-slot:label>
                <v-icon v-if="inputs.target_area.labelIcon" class="mr-1">{{
                  inputs.target_area.labelIcon
                }}</v-icon>
                {{ inputs.target_area.label }}
                <sup
                  ><v-icon
                    v-if="inputs.target_area.required"
                    small
                    style="vertical-align: middle;"
                    >{{ localConfig.requiredInputIcon }}</v-icon
                  ></sup
                >
              </template>
            </v-autocomplete>
          </v-col>
          <!-- Village -->
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-autocomplete
              dense
              color="success"
              hide-details
              item-color="success"
              item-text="name"
              item-value="kode_desa"
              :items="inputs.village.items"
              :label="inputs.village.label"
              :loading="inputs.village.loading"
              :menu-props="{ rounded: 'xl', transition: 'slide-y-transition' }"
              :no-data-text="inputs.village.loading ? 'Loading...' : 'No Data'"
              :disabled="false"
              outlined
              rounded
              :rules="[(v) => !!v || 'Field is required']"
              v-model="inputs.village.model"
            >
              <template v-slot:label>
                <v-icon v-if="inputs.village.labelIcon" class="mr-1">{{
                  inputs.village.labelIcon
                }}</v-icon>
                {{ inputs.village.label }}
                <sup
                  ><v-icon
                    v-if="inputs.village.required"
                    small
                    style="vertical-align: middle;"
                    >{{ localConfig.requiredInputIcon }}</v-icon
                  ></sup
                >
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
        <!-- SELECT DATE -->
        <v-row class="ma-0 mx-2 mx-lg-5">
          <v-col cols="12">
            <div class="d-flex align-center">
              <p class="mb-0" style="font-size: 17px">
                <v-icon class="mr-2">mdi-calendar</v-icon>Tanggal
              </p>
              <v-divider class="mx-2"></v-divider>
            </div>
          </v-col>
          <!-- Date -->
          <v-col cols="12" sm="12" md="6" lg="6">
            <!-- datepicker -->
            <v-menu
              rounded="xl"
              transition="slide-x-transition"
              bottom
              min-width="100"
              offset-y
              :close-on-content-click="false"
              v-model="inputs.form_date.show"
            >
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip top content-class="rounded-xl">
                  <template v-slot:activator="{ on: tooltip }">
                    <v-text-field
                      dense
                      color="green"
                      class="mb-2 mb-lg-0 mr-0 mr-lg-2"
                      hide-details
                      outlined
                      rounded
                      v-bind="attrs"
                      v-on="{ ...menu, ...tooltip }"
                      readonly
                      v-model="inputs.form_date.modelShow"
                    >
                      <template v-slot:label>
                        {{ inputs.form_date.label }}
                        <sup
                          ><v-icon
                            v-if="inputs.form_date.required"
                            small
                            style="vertical-align: middle;"
                            >{{ localConfig.requiredInputIcon }}</v-icon
                          ></sup
                        >
                      </template>
                    </v-text-field>
                  </template>
                  <span>Klik untuk memunculkan datepicker</span>
                </v-tooltip>
              </template>
              <div class="rounded-xl pb-2 white">
                <div class="d-flex flex-column align-center rounded-xl">
                  <v-date-picker
                    :range="inputs.form_date.dateType === 'range'"
                    color="green lighten-1 rounded-xl"
                    v-model="inputs.form_date.model"
                    min="2022-11-24"
                  ></v-date-picker>
                </div>
              </div>
            </v-menu>
          </v-col>
        </v-row>
        <!-- LIST FARMER -->
        <v-row class="ma-0 mx-2 mx-lg-5">
          <v-col cols="12">
            <div class="d-flex align-center">
              <p class="mb-0" style="font-size: 17px">
                <v-icon class="mr-2">{{ inputs.list_farmer.labelIcon }}</v-icon
                >{{ inputs.list_farmer.label }}
              </p>
              <v-divider class="mx-2"></v-divider>
            </div>
          </v-col>
          <v-col cols="12">
            <v-row
              class="mx-0"
              v-for="(item, itemIndex) in inputs.list_farmer.model"
              :key="`farmer-${itemIndex}`"
            >
              <v-col cols="auto" class="">
                <v-btn
                  fab
                  x-small
                  color="green white--text"
                  class="elevation-0 mt-1"
                  >{{ itemIndex + 1 }}</v-btn
                >
              </v-col>
              <v-col cols="12" md="10" lg="10">
                <v-row>
                  <v-col
                    v-for="(input, inputIndex) in Object.entries(
                      inputs.list_farmer.form
                    )"
                    :key="`input-farmer-${itemIndex}-${inputIndex}`"
                    :cols="input[1].cols[0]"
                    :sm="input[1].cols[1]"
                    :md="input[1].cols[2]"
                    :lg="input[1].cols[3]"
                    v-if="inputsListFarmerRoles(input, itemIndex)"
                  >
                    <!-- text-field -->
                    <div v-if="input[1].inputType == 'text-field'">
                      <v-text-field
                        dense
                        color="success"
                        hide-details
                        :label="input[1].label"
                        outlined
                        rounded
                        :placeholder="input[1].placeholder"
                        :type="input[1].type"
                        v-model="item[input[0]]"
                      >
                        <template v-slot:label>
                          <v-icon v-if="input[1].labelIcon" class="mr-1">{{
                            input[1].labelIcon
                          }}</v-icon>
                          {{ input[1].label }}
                          <sup
                            ><v-icon
                              v-if="inputsListFarmerRequired(input, itemIndex)"
                              small
                              style="vertical-align: middle;"
                              >{{ localConfig.requiredInputIcon }}</v-icon
                            ></sup
                          >
                        </template>
                        <template v-slot:append>
                          <div class="mt-1 ml-1" v-html="input[1].append"></div>
                        </template>
                      </v-text-field>
                    </div>
                    <!-- autocomplete -->
                    <div v-else-if="input[1].inputType == 'autocomplete'">
                      <v-autocomplete
                        :small-chips="input[1].chips"
                        :clearable="input[1].clearable"
                        color="success"
                        :dense="input[1].dense"
                        hide-details
                        item-color="success"
                        :item-text="input[1].itemText"
                        :item-value="input[1].itemValue"
                        :items="input[1].items"
                        :multiple="input[1].multiple"
                        :label="input[1].label"
                        :menu-props="{
                          rounded: 'xl',
                          transition: 'slide-y-transition',
                        }"
                        outlined
                        rounded
                        :readonly="input[1].readonly"
                        v-model="item[input[0]]"
                        @change="inputsListFarmerChange(input, itemIndex)"
                      >
                        <template v-slot:label>
                          <v-icon v-if="input[1].labelIcon" class="mr-1">{{
                            input[1].labelIcon
                          }}</v-icon>
                          {{ input[1].label }}
                          <sup
                            ><v-icon
                              v-if="inputsListFarmerRequired(input, itemIndex)"
                              small
                              style="vertical-align: middle;"
                              >{{ localConfig.requiredInputIcon }}</v-icon
                            ></sup
                          >
                        </template>
                        <template v-slot:item="data">
                          <v-list-item-content>
                            <v-list-item-title
                              v-html="data.item[input[1].itemText] || data.item"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              v-if="data.item[input[1].itemSub]"
                              >{{
                                data.item[input[1].itemSub]
                              }}</v-list-item-subtitle
                            >
                          </v-list-item-content>
                        </template>
                        <template
                          v-slot:selection="{ attrs, item, parent, selected }"
                        >
                          <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            label
                            small
                            class="rounded-pill"
                            v-if="input[1].chips"
                          >
                            <span class="pr-2">
                              {{ item[input[1].itemText] || item }}
                            </span>
                            <v-icon small @click="parent.selectItem(item)">
                              mdi-close-circle
                            </v-icon>
                          </v-chip>
                          <span v-else>
                            {{ item[input[1].itemText] || item }}
                          </span>
                        </template>
                      </v-autocomplete>
                    </div>
                    <!-- file -->
                    <div v-else-if="input[1].inputType == 'file-input'">
                      <v-file-input
                        :accept="input[1].accept"
                        :clearable="input[1].clearable"
                        color="success"
                        :dense="input[1].dense"
                        hide-details
                        :label="input[1].label"
                        outlined
                        rounded
                        :placeholder="input[1].placeholder"
                        :prepend-icon="input[1].prependIcon"
                        :readonly="input[1].readonly"
                        :show-size="input[1].showSize"
                        :small-chips="input[1].chips"
                        :solo="input[1].solo"
                        :solo-inverted="input[1].soloInverted"
                        :success="input[1].success"
                        :validate-on-blur="input[1].validateOnBlur"
                        v-model="item[input[0]]"
                        ref="filePhotoMinat"
                        @change="previewFile(item, itemIndex)"
                      >
                        <template v-slot:label>
                          <v-icon v-if="input[1].labelIcon" class="mr-1">{{
                            input[1].labelIcon
                          }}</v-icon>
                          {{ input[1].label }}
                        </template>
                        <template v-slot:selection="{ text }">
                          <span>{{ text }}</span>
                        </template>
                      </v-file-input>
                      <!-- previewPhotoMinat -->
                      <div class="h-25 w-25">
                        <v-img
                          v-if="previewPhotoMinat[itemIndex]"
                          @click="showLightbox(previewPhotoMinat[itemIndex])"
                          class="rounded mt-2 "
                          :width="300"
                          :height="300"
                          :src="previewPhotoMinat[itemIndex]"
                          ><v-icon
                            small
                            @click="removePreviewPhotoMinat(itemIndex)"
                            >mdi-close-circle</v-icon
                          ></v-img
                        >
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                cols="auto"
                lg="1"
                class="d-flex justify-end"
                v-if="itemIndex > 0"
              >
                <v-tooltip>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      fab
                      x-small
                      color="red white--text"
                      class="elevation-0 mt-1"
                      :disabled="itemIndex === 0"
                      @click="
                        () => modifyTotalSubData('-', 'list_farmer', itemIndex)
                      "
                      ><v-icon>mdi-close</v-icon></v-btn
                    >
                  </template>
                  Remove data
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row class="justify-center ma-0 mt-4">
              <v-btn
                rounded
                color="green white--text"
                class="pl-2"
                outlined
                @click="() => modifyTotalSubData('+', 'list_farmer')"
              >
                <v-icon class="mr-1">mdi-plus-circle</v-icon>
                Tambah Data
              </v-btn>
              <!-- <v-btn rounded color="red white--text" class="ml-4" text 
                                @click="() => modifyTotalSubData('-', 'list_farmer')"
                            >
                                <v-icon class="mr-1">mdi-minus-circle</v-icon>
                            </v-btn> -->
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          data-aos="zoom-in"
          data-aos-duration="300"
          data-aos-offset="-100000"
          text
          rounded
          color="red"
          class="pl-2"
        >
          <v-icon class="mr-1">mdi-close-circle</v-icon>
          Close
        </v-btn>
        <v-divider class="mx-2"></v-divider>
        <v-btn
          data-aos="zoom-in"
          data-aos-duration="700"
          data-aos-offset="-100000"
          color="primary white--text"
          class=""
          rounded
          :key="`saveButton${disableSave}`"
          :disabled="isDisabled"
          @click="() => save()"
        >
          <v-icon class="mr-1">mdi-content-save</v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

import formOptions from "./JSON/FormOptions.json";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: null,
    },
    form_no: {
      type: String,
      default: null,
    },
    programYear: {
      type: String,
      default: moment().format("YYYY"),
    },
    status: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    previewPhotoMinat: [],
    tempDataPhoto: [],
    isDisabled: false,
    inputs: {
      program_year: {
        model: "",
        required: true,
      },
      // village location inputs
      mu_no: {
        type: "text",
        label: "Management Unit",
        model: "",
        required: true,
        items: [],
        loading: false,
      },
      target_area: {
        type: "text",
        label: "Target Area",
        model: "",
        required: true,
        items: [],
        loading: false,
      },
      village: {
        type: "text",
        items: [],
        label: "Desa",
        required: true,
        model: "",
        loading: false,
      },
      form_date: {
        loading: false,
        label: "Tanggal Sosialisasi",
        model: null,
        modelShow: "",
        inputType: "datepicker",
        dateType: "date",
        lgView: 4,
        required: true,
        type: "Date",
      },
      list_farmer: {
        default: [
          {
            name: null,
            respond_to_programs: null,
            pattern: null,
            training: null,
            kayu: [],
            mpts: [],
            photo_form_minat: [],
          },
        ],
        form: {
          name: {
            cols: [12, 12, 12, 12],
            inputType: "text-field",
            label: "Nama Petani",
            labelIcon: "mdi-account-tag",
            type: "text",
          },
          respond_to_programs: {
            chips: false,
            clearable: false,
            cols: [12, 6, 6, 5],
            dense: true,
            inputType: "autocomplete",
            items: ["Ya", "Ragu - Ragu", "Tidak"],
            itemSub: null,
            itemText: "value",
            itemValue: "value",
            label: "Berminat?",
            labelIcon: null,
            multiple: false,
            type: "bool",
          },
          pattern: {
            chips: false,
            clearable: true,
            cols: [12, 6, 6, 7],
            dense: true,
            inputType: "autocomplete",
            items: [],
            itemSub: null,
            itemText: "value",
            itemValue: "value",
            label: "Pola Tanam Sebelumnya",
            labelIcon: null,
            multiple: false,
            type: "text",
          },
          training: {
            chips: false,
            clearable: true,
            cols: [12, 12, 12, 12],
            dense: true,
            inputType: "autocomplete",
            items: [],
            itemSub: "material_no",
            itemText: "material_name",
            itemValue: "material_no",
            label: "Materi Pelatihan",
            labelIcon: null,
            multiple: false,
            type: "text",
          },
          kayu: {
            chips: true,
            clearable: true,
            cols: [12, 12, 12, 12],
            dense: false,
            inputType: "autocomplete",
            items: [],
            itemSub: null,
            itemText: "tree_name",
            itemValue: "tree_code",
            label: "Pohon Kayu yang diminati",
            labelIcon: null,
            multiple: true,
            type: "text",
          },
          mpts: {
            chips: true,
            clearable: true,
            cols: [12, 12, 12, 12],
            dense: false,
            inputType: "autocomplete",
            itemText: "tree_name",
            itemValue: "tree_code",
            items: [],
            label: "Pohon Mpts yang diminati",
            labelIcon: null,
            multiple: true,
            type: "text",
          },
          //   photos
          photo_form_minat: {
            cols: [12, 12, 12, 12],
            inputType: "file-input",
            accept: ".jpg,.JPG,.jpeg,.JPEG,.png,.PNG",
            model: [],
            preview: true,
            label: "Foto Minat",
            labelIcon: "mdi-camera",
            items: [],
            type: "file",
          },
        },
        label: "List Petani",
        labelIcon: "mdi-list-box",
        model: [],
      },
    },
    loading: {
      show: false,
      text: "Loading...",
    },
    localConfig: {
      windowWidth: window.innerWidth,
      breakLayoutFrom: 1140,
      requiredInputIcon: "mdi-star",
      maxTreesType: 3,
    },
  }),
  watch: {
    "inputs.form_date.model": {
      async handler(newVal) {
        this.inputs.form_date.modelShow = this._utils.dateFormat(
          newVal,
          "DD MMMM Y"
        );
      },
    },
    "inputs.kayu.model": {
      async handler(val, oldVal) {
        const kayu = val.length;
        const mpts = this.inputs.mpts.model.length;
        if (kayu + mpts > 3) {
          const confirm = await Swal.fire({
            title: "Melebihi Batas!",
            text: "Batas maksimal jumlah jenis adalah 3.",
            icon: "warning",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "Okay",
          });
          this.inputs.kayu.model = oldVal;
        }
      },
    },
    "inputs.mpts.model": {
      async handler(val, oldVal) {
        const mpts = val.length;
        const kayu = this.inputs.kayu.model.length;
        if (kayu === 0 && mpts > 2) {
          const confirm = await Swal.fire({
            title: "Belum Pilih KAYU!",
            text: "Minimal pilh 1 jenis kayu.",
            icon: "warning",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "Okay",
          });
          this.inputs.mpts.model = oldVal;
        }
        if (kayu + mpts > 3) {
          const confirm = await Swal.fire({
            title: "Melebihi Batas!",
            text: "Batas maksimal jumlah jenis adalah 3.",
            icon: "warning",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "Okay",
          });
          this.inputs.mpts.model = oldVal;
        }
      },
    },
  },
  computed: {
    showModal: {
      get: function() {
        if (this.show) {
          this.inputs.program_year.model = this.programYear;
          // if (this.status === "edit") {
          //   this.getDetailData(this.form_no);
          // } else {
          //   this.getDefaultData();
          // }
          if (this.status === "edit") {
            this.getDetailData(this.form_no);
          }
          // this.getDefaultData();
        }
        return this.show;
      },
      set: function(newVal) {
        if (newVal) {
        } else this.$emit("action", { type: "close", name: "form" });
      },
    },
    disableSave() {
      let requiredEmpty = [];
      // get and set required input
      for (const [key, val] of Object.entries(this.inputs)) {
        if (val.required === true) {
          if (val.type !== "bool" && val.type !== "array")
            if (!val.model) requiredEmpty.push(key);
          if (val.type === "array")
            if (val.model.length === 0) requriedEmpty.push(key);
        }
      }
      this.inputs.list_farmer.model.forEach((farmer) => {
        if (!farmer.name || !farmer.respond_to_programs)
          requiredEmpty.push("list_farmer, name or respond_to_programs");
        if (farmer.respond_to_programs != "Tidak") {
          if (farmer.respond_to_programs == "Ya" && !farmer.training)
            requiredEmpty.push("list_farmer, training");
          const kayu = farmer.kayu.length;
          const mpts = farmer.mpts.length;
          if (kayu === 0) requiredEmpty.push("list_farmer, kayu");
          if (mpts > this.localConfig.maxTreesType - 1) {
            Swal.fire({
              title: "Melebihi Batas!",
              text: `Jumlah total jenis KAYU + MPTS maksimal adalah ${this.localConfig.maxTreesType}! Harap KURANGI pilihan jenis MPTS dan MINIMAL memilih 1 jenis KAYU.`,
              icon: "warning",
              confirmButtonColor: "#2e7d32",
              confirmButtonText: "Okay",
            });
            requiredEmpty.push("list_farmer, mpts");
          }
          if (kayu + mpts > this.localConfig.maxTreesType) {
            Swal.fire({
              title: "Melebihi Batas!",
              text: `Jumlah total jenis KAYU + MPTS maksimal adalah ${this.localConfig.maxTreesType}! Harap KURANGI jenis pohon untuk bisa MENYIMPAN data.`,
              icon: "warning",
              confirmButtonColor: "#2e7d32",
              confirmButtonText: "Okay",
            });
            requiredEmpty.push("list_farmer, max_trees");
          }
        }
      });
      // isDisabled if requiredEmpty > 0
      if (requiredEmpty.length > 0) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }

      return this.isDisabled;
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    this.getDefaultData();
  },
  methods: {
    async callApiGet(url) {
      try {
        const response = await axios.get(
          this.$store.getters.getApiUrl(url),
          this.$store.state.apiConfig
        );
        if (response) {
          const data = response.data.data.result;
          return data;
        } else return null;
      } catch (error) {
        this.errorResponse(error);
      }
    },
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
    async getDefaultData() {
      try {
        console.log("getDefaultData");
        this.loading.show = true;
        this.loading.text = 'Preparing "sosialisasi program" form...';
        this.inputs.form_date.model = moment().format("YYYY-MM-DD");
        this.inputs.list_farmer.model = JSON.parse(
          JSON.stringify(this.inputs.list_farmer.default)
        );
        // List Management Unit
        this.loading.text = "Getting list management units...";
        await this.getOptionsData({ type: "mu_no" });
        // List Opsi Pola Tanam
        this.loading.text = "Getting list opsi pola tanam...";
        this.inputs.list_farmer.form.pattern.items = await this.callApiGet(
          "GetOpsiPolaTanamOptions"
        );
        // List Materi Pelatihan
        this.loading.text = "Getting list materi pelatihan...";
        this.inputs.list_farmer.form.training.items = await this.callApiGet(
          "GetTrainingMaterials"
        );
        // List Pohon
        this.loading.text = "Getting trees data...";
        const listTrees = await this.callApiGet("GetTreesAll");
        const kayu = await listTrees.data.filter(
          (lt) => lt.tree_category === "Pohon_Kayu"
        );
        const mpts = await listTrees.data.filter(
          (lt) => lt.tree_category === "Pohon_Buah"
        );
        this.inputs.list_farmer.form.kayu.items = kayu;
        this.inputs.list_farmer.form.mpts.items = mpts;

        // await this.setDummyData()
      } catch (err) {
        this.errorResponse(err);
      } finally {
        this.loading.show = false;
      }
    },
    async getOptionsData(inputs) {
      try {
        // prepare for calling api
        let url = "";

        // set url
        if (inputs.type == "mu_no") url = `GetManagementUnit?program_year=${this.programYear}`;
        else if (inputs.type == "target_area")
          url = `GetTargetArea?program_year=${this.programYear}&mu_no=${this.inputs.mu_no.model}`;
        else if (inputs.type == "village")
          url = `GetDesa?program_year=${this.programYear}&&kode_ta=${this.inputs.target_area.model}`;

        this.$store.state.loadingOverlayText = `Getting ${inputs.type} datas...`;

        // reset data
        if (inputs.type == "mu_no") {
          this.inputs.target_area.model = "";
          this.inputs.target_area.items = [];
        }
        if (["mu_no", "target_area"].includes(inputs.type)) {
          this.inputs.village.model = "";
          this.inputs.village.items = [];
        }
        if (url != "") {
          url = this.$store.getters.getApiUrl(url);

          this.inputs[inputs.type].model = "";
          this.inputs[inputs.type].loading = true;

          // calling api
          const res = await axios.get(url, this.$store.state.apiConfig);
          this.inputs[inputs.type].items = res.data.data.result.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        }
      } catch (err) {
        this.errorResponse(err);
        this.inputs[inputs.type].items = [];
      } finally {
        this.$store.state.loadingOverlayText = null;
        this.inputs[inputs.type].loading = false;
      }
    },
    inputsListFarmerRequired(input, index) {
      if (["name", "respond_to_programs"].includes(input[0])) return true;
      if (
        this.inputs.list_farmer.model[index].respond_to_programs == "Ya" &&
        !["mpts", "pattern"].includes(input[0])
      )
        return true;
      if (
        this.inputs.list_farmer.model[index].respond_to_programs ==
          "Ragu - Ragu" &&
        ["kayu"].includes(input[0])
      )
        return true;
      return false;
    },
    inputsListFarmerRoles(input, index) {
      if (["name", "respond_to_programs"].includes(input[0])) return true;
      if (this.inputs.list_farmer.model[index].respond_to_programs) return true;

      return false;
    },
    modifyTotalSubData(type, name, index = null) {
      if (type == "+") {
        const defaultData = JSON.parse(
          JSON.stringify(this.inputs[name].default[0])
        );
        this.inputs[name].model.push(defaultData);
      } else if (type == "-") {
        if (index) {
          this.inputs[name].model.splice(index, 1);
        } else this.inputs[name].model.pop();
      }
    },
    onResize() {
      this.localConfig.windowWidth = window.innerWidth;
    },
    async save() {
      try {
        const confirm = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#2e7d32",
          cancelButtonColor: "#d33",
          cancelButtonText: "Tidak Jadi",
          confirmButtonText: "Ya, Lanjutkan!",
        });
        if (confirm) {
          this.loading.show = true;
          this.loading.text ='Menyimpan data...';
          const data = {};
          let urlEndpoint = "";
          let imgRes = "";
          for (const [key, val] of Object.entries(this.inputs)) {
            if (key === "list_farmer") {
              data[key] = await Promise.all(
                val.model.map(async (lf) => {
                  if (lf.photo_form_minat != undefined) {
                    imgRes = await this.uploadFiles(
                      "photo",
                      "Photo Form Minat",
                      lf.photo_form_minat,
                      "sosialisasi_program",
                      "photos",
                      lf.name.replace(/[^\w\s]/g, '').replace(/\s+/g, '').toLowerCase() + Math.round(+new Date() / 1000)
                    );
                  } else {
                    imgRes = lf.photo;
                  }
                  const mergeTree = [...lf.kayu, ...lf.mpts];
                  return {
                    name: lf.name,
                    status_program: lf.respond_to_programs,
                    photo: imgRes,
                    pattern: lf.pattern,
                    training: lf.training,
                    tree1: mergeTree[0] || null,
                    tree2: mergeTree[1] || null,
                    tree3: mergeTree[2] || null,
                    tree4: mergeTree[3] || null,
                    tree5: mergeTree[4] || null,
                  };
                })
              );
            } else data[key] = val.model;
          }
          if (this.status == "edit") {
            data.form_no = this.form_no;
            console.log("data", data);
            urlEndpoint = "UpdateFormMinat";
          } else {
            urlEndpoint = "AddFormMinat";
          }
          const res = await axios.post(
            this.$store.getters.getApiUrl(`${urlEndpoint}`),
            data,
            this.$store.state.apiConfig
          );
          if (res) {
            this.showModal = false;
            this.$emit("swal", {
              type: "success",
              message: "Yey! Data SosPro saved!",
            });
          }
        }
      } catch (err) {
        this.errorResponse(err);
      } finally {
        this.loading.show = false;
      }
    },
    async setDummyData() {
      this.loading.text = "Set Dummies data.. :)";
      this.inputs.mu_no.model = "021";
      await this.getOptionsData({
        type: "target_area",
        id: this.inputs.mu_no.model,
      });
      this.inputs.target_area.model = "021003";
      await this.getOptionsData({
        type: "village",
        id: this.inputs.target_area.model,
      });
      this.inputs.village.model = "32.04.39.06";

      this.inputs.list_farmer.model = [
        {
          name: "Kang Asep",
          respond_to_programs: "Ya",
          pattern: "Pola Konservasi Pohon Kayu",
          training: "TR001",
          kayu: ["T0009"],
          mpts: [],
        },
      ];
    },
    // upload file photo minat
    async previewFile(item, index) {
      const file = item.photo_form_minat;
      const url = URL.createObjectURL(file);
      // this.previewPhotoMinat[index] = url;
      await this.$set(this.previewPhotoMinat, index, url);
    },
    async removePreviewPhotoMinat(index) {
      await this.$set(this.previewPhotoMinat, index, null);
    },
    async uploadFiles(type, typeName, file, prefix, dir, name) {
      try {
        this.$store.state.loadingOverlayText = `Saving file "${typeName}"...`;
        const url = `${this.$store.state.apiUrlImage}${prefix}/upload.php`;
        let fileToUpload = file;
        const data = this.generateFormData({
          dir: dir,
          nama: name,
          fileToUpload: fileToUpload,
          type: type,
        });
        let responseName = null;
        const res = await axios.post(url, data);
        if (res) {
          responseName = res.data.data.new_name;
          return `${prefix}/${responseName}`;
        }
      } catch (err) {
        this.errorResponse(err);
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
    async getDetailData(form_no) {
      try {
        this.loading.show = true;
        this.loading.text = 'Mengambil data...';
        let params = {
          form_no: form_no,
        };
        const res = await axios.get(
          this.$store.getters.getApiUrl(`GetFormMinatDetail`),
          {
            params: params,
            ...this.$store.state.apiConfig,
          }
        );
        if (res) {
          const data = res.data.data.result;
          this.inputs.mu_no.model = data.mu_no;
          await this.getOptionsData({
            type: "target_area",
            id: this.inputs.mu_no.model,
          });
          this.inputs.target_area.model = data.target_area;
          await this.getOptionsData({
            type: "village",
            id: this.inputs.target_area.model,
          });
          this.inputs.village.model = data.village;
          this.inputs.list_farmer.model = data.ListFarmer;
          this.inputs.list_farmer.model.forEach((lf, index) => {
            this.previewPhotoMinat[index] =
              this.$store.state.apiUrlImage + lf.photo;
            this.inputs.list_farmer.model[index].photo = lf.photo;
            this.tempDataPhoto[index] = lf.photo;
            this.inputs.list_farmer.model[index].name = lf.name;
            this.inputs.list_farmer.model[index].respond_to_programs =
              lf.status_program;
            this.inputs.list_farmer.model[index].pattern = lf.pattern;
            this.inputs.list_farmer.model[index].training = lf.training;
            // looping tree1, tree2, tree3, to check tree_category
            this.inputs.list_farmer.model[index].kayu = [];
            this.inputs.list_farmer.model[index].mpts = [];
            if (lf.tree1 != null) {
              if (lf.tree1.tree_category == "Pohon_Kayu") {
                this.inputs.list_farmer.model[index].kayu.push(
                  lf.tree1.tree_code
                );
              } else {
                this.inputs.list_farmer.model[index].mpts.push(
                  lf.tree1.tree_code
                );
              }
            }
            if (lf.tree2 != null) {
              if (lf.tree2.tree_category == "Pohon_Kayu") {
                this.inputs.list_farmer.model[index].kayu.push(
                  lf.tree2.tree_code
                );
              } else {
                this.inputs.list_farmer.model[index].mpts.push(
                  lf.tree2.tree_code
                );
              }
            }
            if (lf.tree3 != null) {
              if (lf.tree3.tree_category == "Pohon_Kayu") {
                this.inputs.list_farmer.model[index].kayu.push(
                  lf.tree3.tree_code
                );
              } else {
                this.inputs.list_farmer.model[index].mpts.push(
                  lf.tree3.tree_code
                );
              }
            }
          });
        }
      } catch (err) {
        this.errorResponse(err);
      } finally {
        this.loading.show = false;
      }
    },
    async inputsListFarmerChange() {
      this.inputs.list_farmer.model.forEach((lf, index) => {
        // if kayu not empty disable button false else true
        if (lf.kayu.length > 0) {
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
        }
        if (lf.mpts.length > this.localConfig.maxTreesType - 1) {
          Swal.fire({
            title: "Melebihi Batas!",
            text: `Jumlah total jenis KAYU + MPTS maksimal adalah ${this.localConfig.maxTreesType}! Harap KURANGI pilihan jenis MPTS dan MINIMAL memilih 1 jenis KAYU.`,
            icon: "warning",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "Okay",
          });
          this.isDisabled = true;
        }
        if (lf.kayu.length + lf.mpts.length > this.localConfig.maxTreesType) {
          Swal.fire({
            title: "Melebihi Batas!",
            text: `Jumlah total jenis KAYU + MPTS maksimal adalah ${this.localConfig.maxTreesType}! Harap KURANGI jenis pohon untuk bisa MENYIMPAN data.`,
            icon: "warning",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "Okay",
          });
          this.isDisabled = true;
        }
      });
    },
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs
      
      if (index) this.$store.state.lightbox.index = index
      else this.$store.state.lightbox.index = 0

      this.$store.state.lightbox.show = true
    }
  },
};
</script>
