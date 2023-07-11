<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="1200"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-document-edit</v-icon></v-btn> Scoping Visit Form</span>
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text class="pa-0">
                <!-- Loading -->
                <v-overlay absolute :value="loading.show">
                    <div class="d-flex flex-column justify-center align-center">
                        <LottieAnimation
                            ref="anim"
                            :animationData="lottie.data.loading"
                            :loop="true"
                            style="height: 64px;"
                        />
                        <p class="mt-2 mb-0">{{ loading.text }}
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
                <!-- NB -->
                <v-row class="ma-0 mx-5">
                    <v-col cols="12" class="d-flex justify-end">
                        <p class="mb-0 red--text">Tanda "<v-icon color="red" class="">{{ localConfig.requiredInputIcon }}</v-icon>" menandakan WAJIB DIISI.</p>
                    </v-col>
                </v-row>
                <!-- Dynamic Inputs -->
                <v-row class="ma-0 mx-5" v-for="(ig, igIndex) in inputsGroup" :key="`IG-${igIndex}`"
                    v-if="showFormInputs(ig)"
                >
                    <!-- Title -->
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">{{ ig.icon }}</v-icon>{{ ig.title }}</p>
                            <v-divider class="mx-2"></v-divider>
                            <v-btn v-if="ig.title === 'Kelengkapan Data Lahan Kering' && editId && $store.state.User.role_name != 'GIS STAFF'" 
                                :disabled="emailToGis > 1"
                                rounded 
                                color="blue white--text" 
                                small 
                                @click="() => sendEmailToGIS(editId)"
                                ><v-icon class="mr-1">mdi-email-{{ emailToGis > 1 ? 'check' : 'arrow-right' }}</v-icon>Email to GIS</v-btn>
                        </div>
                    </v-col>
                    <!-- Inputs -->
                    <v-col v-for="(itemKey, iKIndex) in ig.items_key" :key="`Inputs-${itemKey}-${iKIndex}`" cols="12" sm="12" :md="inputs[itemKey].lgView == 12 ? 12 : 6" :lg="inputs[itemKey].lgView" >
                        <!-- Khususon: potential_description -->
                        <div v-if="itemKey === 'potential_description'">
                            <label for="">
                                <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                {{ inputs[itemKey].label }} 
                                <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </label>
                            <VueEditor v-if="inputs.potential_dusun.model !== null && inputs.potential_dusun.model > 0" 
                                placeholder="Deskripsi / alasan dusun berpotensi"
                                v-model="inputs.potential_description.model"
                            />
                            <v-textarea v-else hide-details disabled outlined class="rounded-xl" placeholder="Deskripsi disabled. Total dusun berpotensi 0."></v-textarea>
                        </div>
                        <!-- autocomplete -->
                        <v-autocomplete
                            v-else-if="inputs[itemKey].inputType == 'autocomplete'"
                            dense
                            :multiple="inputs[itemKey].type == 'Multiple'"
                            color="success"
                            hide-details
                            item-color="success"
                            :item-text="inputs[itemKey].itemText"
                            :item-value="inputs[itemKey].itemValue"
                            :items="inputs[itemKey].items"
                            :label="inputs[itemKey].label"
                            :loading="inputs[itemKey].loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs[itemKey].loading ? 'Loading...' : 'No Data'"
                            outlined
                            rounded
                            v-model="inputs[itemKey].model"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                {{ inputs[itemKey].label }} 
                                <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                        <!-- datepicker -->
                        <v-menu 
                            v-else-if="inputs[itemKey].inputType == 'datepicker'"
                            rounded="xl"
                            transition="slide-x-transition"
                            bottom
                            min-width="100"
                            offset-y
                            :close-on-content-click="false"
                            v-model="inputs[itemKey].show"
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
                                            v-on="{...menu, ...tooltip}"
                                            readonly
                                            v-model="inputs[itemKey].modelShow"
                                        >
                                            <template v-slot:label>
                                                {{ inputs[itemKey].label }} 
                                                <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                            </template>
                                        </v-text-field>
                                    </template>
                                    <span>Klik untuk memunculkan datepicker</span>
                                </v-tooltip>
                            </template>
                            <div class="rounded-xl pb-2 white">
                                <v-overlay :value="inputs[itemKey].loading">
                                    <div class="d-flex flex-column align-center justify-center">
                                        <v-progress-circular
                                            indeterminate
                                            color="white"
                                            size="64"
                                        ></v-progress-circular>
                                        <p class="mt-2 mb-0">Updating available dates...</p>
                                    </div>
                                </v-overlay>
                                <div class="d-flex flex-column align-center rounded-xl">
                                    <v-date-picker 
                                        :range="inputs[itemKey].dateType === 'range'"
                                        color="green lighten-1 rounded-xl" 
                                        v-model="inputs[itemKey].model"
                                        min="2022-11-24"
                                    ></v-date-picker>
                                </div>
                            </div>
                        </v-menu>
                        <!-- text-field -->
                        <v-text-field
                            v-else-if="inputs[itemKey].inputType == 'text-field'"
                            dense
                            color="success"
                            hide-details
                            :label="inputs[itemKey].label"
                            outlined
                            rounded
                            :type="inputs[itemKey].type == 'Number' ? 'number' : 'text'"
                            v-model="inputs[itemKey].model"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                {{ inputs[itemKey].label }} 
                                <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                            <template v-slot:append>
                                <div class="mt-1 ml-1" v-html="inputs[itemKey].append"></div>
                            </template>
                        </v-text-field>
                        <!-- file-input -->
                        <div
                            v-else-if="inputs[itemKey].inputType == 'file-input'"
                        >
                            <v-file-input
                                color="success"
                                :dense="inputs[itemKey].dense"
                                :hide-details="inputs[itemKey].hideDetails"
                                outlined
                                rounded
                                :multiple="inputs[itemKey].multiple"
                                counter
                                show-size
                                :prepend-icon="inputs[itemKey].prependIcon"
                                :accept="inputs[itemKey].accept"
                                :placeholder="id ? 'Upload ulang untuk merubah file' : 'Upload file disini'"
                                :disabled="false"
                                :label="inputs[itemKey].label"
                                v-model="inputs[itemKey].model"
                            >
                                <template v-slot:label>
                                    {{ inputs[itemKey].label }} 
                                    <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                </template>
                                <template v-slot:selection="{ index, text, file }">
                                    <v-card 
                                        class="rounded-lg mt-2 elevation-0 mr-1 mb-1"
                                        style="position: relative;"
                                        v-if="inputs[itemKey].chip"
                                    >
                                        <v-chip
                                            color="deep-purple accent-4"
                                            class="rounded-pill"
                                            dark
                                            label
                                            small
                                            style="position: absolute;bottom: 0;left: 0;right: 0;z-index: 2"
                                        >
                                            {{ text }}
                                        </v-chip>
                                        <v-img
                                            v-bind:src="setUrlFileImage(file)"
                                            class="my-2 mb-4 rounded-lg cursor-pointer"
                                            style="max-width: 200px;max-height: 110px;"
                                        ></v-img>
                                    </v-card>
                                    <span v-else> {{ text }}</span>
                                </template>
                            </v-file-input>
                            <div v-if="id && (itemKey.includes('photo') || itemKey == 'village_profile') && false">
                                <v-card 
                                    v-if="inputs[itemKey].chip"
                                    v-for="(imgMltple, imgMltpleIndex) in inputs[itemKey].preview" :key="`image-${itemKey}-${imgMltpleIndex}`"
                                    class="rounded-lg mt-2 elevation-0 mr-1 mb-1 d-inline-block"
                                    style="position: relative;"
                                >
                                    <v-chip
                                        color="deep-purple accent-4"
                                        class="rounded-pill"
                                        dark
                                        label
                                        small
                                        style="position: absolute;bottom: 0;left: 0;right: 0;z-index: 2"
                                    >
                                        {{ itemKey }} {{ imgMltpleIndex }}
                                    </v-chip>
                                    <v-img
                                        v-bind:src="imgMltple"
                                        @click="showLightbox(inputs[itemKey].preview, imgMltpleIndex)"
                                        class="my-2 mb-4 rounded-lg cursor-pointer"
                                        style="max-width: 200px;max-height: 110px;"
                                    ></v-img>
                                </v-card>
                                <!-- <v-carousel 
                                    cycle
                                    height="300" 
                                    show-arrows-on-hover
                                    hide-delimiter-background
                                    class="rounded-xl cursor-pointer"
                                    style="max-width: 500px;"
                                    :key="`image-carousel-${itemKey}-${showModal}`"
                                >
                                    <v-carousel-item v-for="(imgMltple, imgMltpleIndex) in inputs[itemKey].preview" :key="`image-${itemKey}-${imgMltpleIndex}`">
                                        <v-img
                                            height="300"
                                            v-bind:src="imgMltple"
                                            @click="showLightbox(inputs[itemKey].preview, imgMltpleIndex)"
                                            class="my-1 mb-4 rounded-xl cursor-pointer"
                                        ></v-img>
                                    </v-carousel-item>
                                </v-carousel> -->
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <!-- Tokoh Desa -->
                <v-row class="ma-0 mx-5" v-if="$store.state.User.role_name != 'GIS STAFF'">
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-card-account-phone</v-icon>Tokoh Desa</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <v-row 
                            v-for="(village_figure, village_figure_index) in inputs.village_figures.model" 
                            :key="`village_figure_${village_figure_index}`"
                            data-aos="fade-right"
                            data-aos-offset="-10000"
                        >
                            <v-col cols="auto">
                                <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ village_figure_index + 1 }}</v-btn>
                            </v-col>
                            <v-col cols="11">
                                <v-row>
                                    <!-- village_figure name -->
                                    <v-col cols="12" sm="12" md="6" lg="6">
                                        <v-text-field
                                            dense
                                            color="success"
                                            hide-details
                                            :disabled="false"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="village_figure.name"
                                        >
                                            <template v-slot:label>
                                                Nama
                                                <sup><v-icon small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <!-- village_figure position -->
                                    <v-col cols="12" sm="12" md="6" lg="6">
                                        <v-text-field
                                            dense
                                            color="success"
                                            hide-details
                                            :disabled="false"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="village_figure.position"
                                        >
                                            <template v-slot:label>
                                                Jabatan
                                                <sup><v-icon small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <!-- village_figure phone -->
                                    <v-col cols="12" sm="12" md="6" lg="6">
                                        <v-text-field
                                            dense
                                            color="success"
                                            hide-details
                                            prepend-icon="mdi-phone"
                                            :disabled="false"
                                            outlined
                                            rounded
                                            type="number"
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="village_figure.phone"
                                        >
                                            <template v-slot:label>
                                                Nomor HP
                                                <sup><v-icon small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <!-- village_figure whatsapp -->
                                    <v-col cols="12" sm="12" md="6" lg="6">
                                        <v-text-field
                                            dense
                                            color="success"
                                            hide-details
                                            label="Whatsapp"
                                            :disabled="false"
                                            outlined
                                            rounded
                                            prepend-icon="mdi-whatsapp"
                                            type="number"
                                            v-model="village_figure.whatsapp"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="justify-center mb-2">
                            <v-btn v-if="inputs.village_figures.model.length < 5" 
                                data-aos="fade-right" data-aos-offset="-10000" 
                                :key="`village_figures_plus_btn`" 
                                fab small color="green white--text" class="mx-1" 
                                @click="() => modifyTotalSubData('+', 'village_figures')"
                            >
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                            <v-btn v-if="inputs.village_figures.model.length > 1" 
                                data-aos="fade-left" data-aos-offset="-10000" 
                                :key="`village_figures_minus_btn`" 
                                fab small color="red" outlined class="mx-1"
                                @click="() => modifyTotalSubData('-', 'village_figures')"
                            >
                                <v-icon>mdi-minus</v-icon>
                            </v-btn>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn 
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-200"
                    text rounded color="red" class="pl-2">
                    <v-icon class="mr-1">mdi-close-circle</v-icon>
                    Close
                </v-btn>
                <v-divider class="mx-2"></v-divider>
                <v-btn
                    v-if="showSaveButton"
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-200" 
                    color="primary white--text"
                    class="px-3 pr-4"
                    rounded
                    :key="`saveButton${disabledSave}`"
                    :disabled="disabledSave"
                    @click="() => save()"
                >
                <span v-if="this.editId && (formStatus == 'document_saving' || formStatus == 'ready_to_submit') && gisInputCheck && photosInputCheck">
                    <v-icon class="mr-1">mdi-send-check</v-icon>
                    Kirim Untuk Ditinjau
                </span>
                <span v-else>
                    <v-icon class="mr-1">mdi-content-save</v-icon>
                    Simpan
                </span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import LottieAnimation from 'lottie-web-vue'
import Swal from 'sweetalert2'

import formOptions from '@/assets/json/rraPraOptions.json'
import treeAnimation from '@/assets/lottie/tree.json'

export default {
    components: {
        LottieAnimation
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: '0'
        },
        programYear: {
            type: String,
            default: '0'
        }
    },
    data: () => ({
        editId: null,
        imageKeyComponent: 82726366,
        inputs: {
            program_year: {
                model: '',
                required: true,
                type: 'String'
            },
            // village location inputs
            province: {
                label: 'Provinsi',
                model: '',
                items: [],
                itemText: 'name',
                itemValue: 'province_code',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: true,
                type: 'String'
            },
            regency: {
                label: 'Kabupaten / Kota',
                model: '',
                items: [],
                itemText: 'name',
                itemValue: 'kabupaten_no',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: true,
                type: 'String'
            },
            district: {
                label: 'Kecamatan',
                model: '',
                items: [],
                itemText: 'name',
                itemValue: 'kode_kecamatan',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: true,
                type: 'String'
            },
            village: {
                items: [],
                label: 'Desa',
                model: '',
                itemText: 'name',
                itemValue: 'kode_desa',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: true,
                type: 'String'
            },
            // scoping date
            scooping_date: {
                loading: false,
                label: 'Tanggal Scooping',
                model: [],
                modelShow: '',
                inputType: 'datepicker',
                dateType: 'range',
                lgView: 6,
                show: false,
                required: true,
                type: 'Date'
            },
            // scoping visit inputs
            land_area: {
                label: 'Luas Desa',
                model: '',
                inputType: 'text-field',
                lgView: 6,
                append: 'Ha',
                loading: false,
                required: true,
                type: 'Number'
            },
            accessibility: {
                items: formOptions.accessibility,
                label: 'Aksesibilitas',
                model: '',
                itemText: 'text',
                itemValue: 'value',
                inputType: 'autocomplete',
                labelIcon: 'mdi-road-variant',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Select'
            },
            total_male: {
                label: 'Jumlah Laki - Laki',
                model: '',
                inputType: 'text-field',
                type: 'Number',
                append: 'orang',
                lgView: 6,
                labelIcon: 'mdi-human-male',
                required: true
            },
            total_female: {
                label: 'Jumlah Perempuan',
                model: '',
                inputType: 'text-field',
                type: 'Number',
                append: 'orang',
                lgView: 6,
                labelIcon: 'mdi-human-female',
                required: true
            },
            total_kk: {
                label: 'Jumlah Keluarga (KK)',
                model: '',
                inputType: 'text-field',
                type: 'Number',
                append: 'KK',
                lgView: 6,
                labelIcon: 'mdi-human-male-female-child',
                required: true
            },
            land_type: {
                items: formOptions.land_type.sort(),
                label: 'Jenis Tanah',
                model: [],
                itemText: 'text',
                itemValue: 'value',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: false,
                type: 'Multiple'
            },
            land_slope: {
                items: formOptions.land_slope,
                label: 'Kelerengan Tanah',
                model: [],
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: false,
                type: 'Multiple'
            },
            land_height: {
                items: formOptions.land_height,
                label: 'Ketinggian Tanah',
                model: [],
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: false,
                type: 'Multiple'
            },
            vegetation_density: {
                items: formOptions.vegetation_density,
                label: 'Kerapatan Vegetasi',
                model: [],
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Multiple'
            },
            water_source: {
                items: formOptions.water_source.sort(),
                label: 'Sumber Air',
                model: [],
                itemText: 'text',
                itemValue: 'value',
                inputType: 'autocomplete',
                labelIcon: 'mdi-water-pump',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Multiple'
            },
            rainfall: {
                items: formOptions.rainfall,
                label: 'Curah Hujan',
                model: [],
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: false,
                type: 'Multiple'
            },
            agroforestry_type: {
                items: formOptions.agroforestry_type.sort(),
                label: 'Pola Tanam Lahan Kering',
                model: [],
                itemText: 'text',
                itemValue: 'value',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Multiple'
            },
            government_place: {
                items: formOptions.government_place.sort(),
                label: 'Tempat Pemerintahan',
                model: [],
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                labelIcon: 'mdi-domain',
                lgView: 12,
                loading: false,
                required: true,
                type: 'Multiple'
            },
            land_coverage: {
                items: formOptions.land_coverage.sort(),
                label: 'Cakupan Lahan',
                model: [],
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Multiple'
            },
            electricity_source: {
                items: formOptions.electricity_source.sort(),
                label: 'Sumber Listrik',
                model: [],
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                labelIcon: 'mdi-home-lightning-bolt',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Multiple'
            },
            total_dusun: {
                label: 'Total Dusun',
                model: '',
                inputType: 'text-field',
                lgView: 6,
                append: 'dusun',
                loading: false,
                required: true,
                type: 'Number'
            },
            potential_dusun: {
                label: 'Total Dusun yang Berpotensi',
                model: '',
                inputType: 'text-field',
                lgView: 6,
                append: 'dusun',
                loading: false,
                required: true,
                type: 'Number'
            },
            potential_description: {
                label: 'Deskripsi Potensi',
                model: '',
                inputType: 'text-editor',
                lgView: 12,
                loading: false,
                required: false,
                type: 'String'
            },
            dry_land_area: {
                label: 'Luas Lahan Kering / Kritis',
                model: '',
                inputType: 'text-field',
                lgView: 6,
                append: 'Ha',
                loading: false,
                required: false,
                type: 'Number'
            },
            village_polygon: {
                label: 'Polygon Desa *.kml file',
                dense: true,
                chip: false,
                hideDetails: true,
                accept: '.kml',
                model: null,
                inputType: 'file-input',
                lgView: 6,
                prependIcon: 'mdi-vector-polygon',
                loading: false,
                required: false,
                type: 'File'
            },
            dry_land_polygon: {
                label: 'Polygon Lahan Kering / Kritis *.kml file',
                dense: true,
                chip: false,
                hideDetails: true,
                accept: '.kml',
                model: null,
                inputType: 'file-input',
                lgView: 6,
                prependIcon: 'mdi-vector-polygon',
                loading: false,
                required: false,
                type: 'File'
            },
            // photos
            photo_road_access: {
                label: 'Akses Jalan (maks 5 foto)',
                accept: '.jpg,.JPG,.jpeg,.JPEG,.png,.PNG',
                chip: true,
                model: [],
                preview: null,
                hideDetails: false,
                inputType: 'file-input',
                multiple: true,
                lgView: 12,
                prependIcon: 'mdi-camera',
                loading: false,
                required: false,
                type: 'File'
            },
            photo_meeting: {
                label: 'Pertemuan dengan Tokoh Desa (maks 3 foto)',
                accept: '.jpg,.JPG,.jpeg,.JPEG,.png,.PNG',
                chip: true,
                model: [],
                preview: null,
                inputType: 'file-input',
                hideDetails: false,
                multiple: true,
                lgView: 12,
                prependIcon: 'mdi-camera',
                loading: false,
                required: false,
                type: 'File'
            },
            photo_dry_land: {
                label: 'Lahan Kering (maks 5 foto)',
                accept: '.jpg,.JPG,.jpeg,.JPEG,.png,.PNG',
                chip: true,
                model: null,
                preview: null,
                inputType: 'file-input',
                hideDetails: false,
                multiple: true,
                lgView: 12,
                prependIcon: 'mdi-camera',
                loading: false,
                required: false,
                type: 'File'
            },
            village_profile: {
                label: 'Profil Desa',
                accept: '.jpg,.JPG,.jpeg,.JPEG,.png,.PNG',
                chip: true,
                model: [],
                preview: null,
                inputType: 'file-input',
                hideDetails: false,
                multiple: false,
                lgView: 6,
                prependIcon: 'mdi-camera',
                loading: false,
                required: false,
                type: 'File'
            },
            // Tokoh Desa
            village_figures: {
                label: 'Tokoh Desa',
                model: [],
                default: [{
                        name: null,
                        position: null,
                        phone: null,
                        whatsapp: null
                }],
                loading: false,
                required: true,
                type: 'MultipleInput'
            },
        },
        inputsGroup: [
            {
                title: 'Lokasi & Tanggal Kegiatan Scooping',
                icon: 'mdi-calendar',
                gis_role: false,
                items_key: ["province", "regency", "district", "village", "scooping_date"]
            },
            {
                title: 'Data General Desa',
                icon: 'mdi-list-box',
                gis_role: false,
                items_key: ["land_area", "accessibility", "water_source", "electricity_source", "government_place", "land_coverage", "vegetation_density", "agroforestry_type"]
            },
            {
                title: 'Data Populasi Dan Wilayah',
                icon: 'mdi-account-group',
                gis_role: false,
                items_key: ["total_dusun", "potential_dusun", "potential_description", "total_male", "total_female", "total_kk"],
            }, 
            {
                title: 'Upload Foto Dokumentasi Kegiatan',
                icon: 'mdi-image-multiple',
                gis_role: false,
                items_key: ["photo_road_access", "photo_meeting", "photo_dry_land", "village_profile"],
            }, 
            {
                title: 'Kelengkapan Data Lahan Kering',
                icon: 'mdi-land-fields',
                gis_role: true,
                items_key: ["dry_land_area", "land_type", "land_slope", "land_height", "rainfall"]
            },
            {
                title: 'Upload Polygon File (GIS)',
                icon: 'mdi-map-marker-path',
                gis_role: true,
                items_key: ["village_polygon", "dry_land_polygon"],
            }
        ],
        formStatus: '',
        emailToGis: 0,
        loading: {
            show: false,
            text: 'Loading...'
        },
        lottie: {
            data: {
                loading: treeAnimation,
            }
        },
        localConfig: {
            windowWidth: window.innerWidth,
            breakLayoutFrom: 1140,
            requiredInputIcon: 'mdi-star'
        },
        raw_data: {}
    }),
    watch: {
        'inputs.scooping_date.model': {
            async handler(newVal) {
                let range = JSON.parse(JSON.stringify(newVal))
                range.sort()
                this.inputs.scooping_date.modelShow = this._utils.dateFormat(range[0], 'DD MMMM Y') + ' ~ ' + this._utils.dateFormat(range[1], 'DD MMMM Y')
            }
        },
        'inputs.province.model': {
            async handler(val) {
                if (val) await this.getOptionsData({type: 'regency'})
            }
        },
        'inputs.regency.model': {
            async handler(val) {
                if (val) await this.getOptionsData({type: 'district'})
            }
        },
        'inputs.district.model': {
            async handler(val) {
                if (val) await this.getOptionsData({type: 'village'})
            }
        },
        'inputs.village.model': {
            async handler(val) {
                try {
                    if (val && !this.id) {
                        // check existing scooping data
                        this.loading.show = true
                        this.loading.text = 'Check existing scooping data...'
                        const url = this.$store.getters.getApiUrl('GetScoopingAll')
                        const res = await axios.get(url, this.$store.state.apiConfig)
                        const listScooping = res.data.data.result.map(val => {return val.village})
                        if (listScooping.includes(val)) {
                            const confirm = await Swal.fire({
                                title: 'Exist!',
                                text: `Kode desa "${val}" sudah memiliki data scooping!`,
                                icon: 'warning',
                                confirmButtonColor: '#2e7d32',
                                confirmButtonText: 'Okay'
                            })
                            this.inputs.village.model = null
                        }
                    }
                } catch (err) {this.errorResponse(err)} finally {
                    this.loading.show = false
                }
            }
        },
        'inputs.photo_road_access.model': {
            async handler(val) {
                if (val) if (val.length > 5) {
                    const confirm = await Swal.fire({
                        title: 'Melebihi Batas!',
                        text: `Maksimal 5 foto!`,
                        icon: 'warning',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Okay'
                    })
                    this.inputs.photo_road_access.model = val.slice(0, 5)
                }
            }
        },
        'inputs.photo_meeting.model': {
            async handler(val) {
                if (val) if (val.length > 3) {
                    const confirm = await Swal.fire({
                        title: 'Melebihi Batas!',
                        text: `Maksimal 3 foto!`,
                        icon: 'warning',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Okay'
                    })
                    this.inputs.photo_meeting.model = val.slice(0, 3)
                }
            }
        },
        'inputs.photo_dry_land.model': {
            async handler(val) {
                if (val) if (val.length > 5) {
                    const confirm = await Swal.fire({
                        title: 'Melebihi Batas!',
                        text: `Maksimal 5 foto!`,
                        icon: 'warning',
                        confirmButtonColor: '#2e7d32',
                        confirmButtonText: 'Okay'
                    })
                    this.inputs.photo_dry_land.model = val.slice(0, 5)
                }
            }
        },
        'inputs.village_profile.model': {
            async handler(val) {
                await this.photoFileChanged(val, 'village_profile')
            }
        },
        'loading.show': {
            handler(val) {
            }
        }
    },
    computed: {
        disabledSave() {
            let requiredEmpty = []
            for (const [key, value] of Object.entries(this.inputs)) {
                if ((key == 'village_figures')) {
                    if (value.required) {if (value.model.length > 0) {
                        value.model.forEach(vm => {
                            if (!vm.name || !vm.position || !vm.phone) requiredEmpty.push('village_figures:name,position,phone')
                        })
                    } else requiredEmpty.push(key)}
                } else if (value.type == 'MultipleInput') {
                    if (value.required) if (value.model.length > 0) {
                        value.model.forEach(vm => {
                            Object.entries(value.form).map(form => {
                                if (form[1].required === true) {
                                    if (!(vm[form[0]] !== null && vm[form[0]] !== 0)) requiredEmpty.push(key)
                                }
                            })
                        })
                    } else requiredEmpty.push(key)
                } else if (value.required) if (!value.model) {
                    requiredEmpty.push(key)
                }
            }
            return requiredEmpty.length > 0 ? true : false
        },
        gisInputCheck() {
            let gisInputs = [] 
            let gisInputEmpty = 0
            this.inputsGroup.filter(n => n.gis_role === true).map(val => {gisInputs.push(...val.items_key)})
            gisInputs.map(val => {                
                if (!this.inputs[val].model && val != 'dry_land_polygon') {
                    if (this.editId) {
                        if (!this.raw_data[val] || this.raw_data[val] == '-') gisInputEmpty += 1
                    } else gisInputEmpty += 1
                }
            })

            if (gisInputEmpty === 0) return true
            return false
        },
        photosInputCheck() {
            let photos_key = [
                'photo_road_access',
                'photo_meeting',
                'photo_dry_land',
                'village_profile'
            ] 
            let empty = []
            photos_key.map(key => {
                if (!this.inputs[key].model) {
                    if (this.editId) {
                        if (!this.raw_data[key] || this.raw_data[key] == '-') empty.push(key) 
                    } else empty.push(key)
                }
            })
            console.log(empty)
            if (empty.length === 0) return true
            return false
        },
        showModal: {
            get: function () {
                if (this.show) {
                    this.showedModal(this.id)
                }
                return this.show
            },
            set: function(newVal) {
                if (!newVal) this.$emit('action', {type: 'close', name: 'form'})
            }
        },
        showSaveButton() {
            const inputs = Object.entries(this.inputs)
            let empty = 0
            const arrayInput = [
                'land_type',
                'land_slope',
                'land_height',
                'vegetation_density',
                'water_source',
                'rainfall',
                'agroforestry_type',
                'government_place',
                'land_coverage',
                'electricity_source',
                'village_figures'
            ]
            for (const [key, val] of inputs) {
                if (!val.model) empty += 1
                else if (arrayInput.includes(key)) if (val.model.length < 1) empty += 1
            }
            if (empty == 0) return false

            return true
        },
    },
    async mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
    },
    methods: {
        async errorResponse(error) {
            console.log(error)
            if (error.response) {
                if (error.response.status) {
                    if (error.response.status == 401) {
                        const confirm = await Swal.fire({
                            title: 'Session Ended!',
                            text: "Please login again.",
                            icon: 'warning',
                            confirmButtonColor: '#2e7d32',
                            confirmButtonText: 'Okay'
                        })
                        if (confirm) {
                            localStorage.removeItem("token");
                            this.$router.push("/");
                        }
                    }
                }
            }
        },
        async getData(id) {
            try {
                this.loading.show = true
                this.loading.text = 'Getting scooping data...'
                const res = await axios.get(this.$store.getters.getApiUrl(`GetDetailScooping?data_no=${id}`), this.$store.state.apiConfig)
                const data = res.data.data.result
                this.raw_data = data
                this.formStatus = data.status
                this.emailToGis = data.email_to_gis
                for (const [key, value] of Object.entries(data)) {
                    if (this.separateInputsPerType().string.includes(key) || this.separateInputsPerType().number.includes(key) || this.separateInputsPerType().date.includes(key) || this.separateInputsPerType().select.includes(key)) this.inputs[key].model = value
                    if (this.separateInputsPerType().multiple.includes(key)) this.inputs[key].model = value ? value.split(",") : value
                }
                this.inputs.scooping_date.model = [data.start_scooping_date, data.end_scooping_date]
                this.inputs.province.model = data.province
                this.loading.show = true
                await this.getOptionsData({type: 'regency', id: data.province})
                this.inputs.regency.model = data.city
                this.loading.show = true
                await this.getOptionsData({type: 'district', id: data.city})
                this.inputs.district.model = data.district
                this.loading.show = true
                await this.getOptionsData({type: 'village', id: data.district})
                this.inputs.village.model = data.village
                // village figures
                this.inputs.village_figures.model = data.scooping_figures
                // photos
                const imageKeyInput = ["photo_road_access", "photo_meeting", "photo_dry_land", "village_profile"]
                imageKeyInput.forEach(inputKey => {
                    this.inputs[inputKey].preview = []
                    if (data[inputKey]) if (data[inputKey].length > 0) this.inputs[inputKey].preview = data[inputKey].split(',').map(val => {return this.$store.state.apiUrlImage + val})
                })
            } catch (err) {
                this.errorResponse(err)
                this.$emit('action', {type: 'close', name: 'form'})
            } finally {
                this.loading.show = false
            }
        },
        async getDummiesData() {
            try {
                this.loading.show = true
                this.loading.text = 'Set dummy data... :)'

                const province = 'JT'
                const regency = '33'
                const district = '33.74.15'
                const village = '33.74.15.1001'
                this.inputs.province.model = province
                await this.getOptionsData({type: 'regency', id: province})
                this.inputs.regency.model = regency
                await this.getOptionsData({type: 'district', id: regency})
                this.inputs.district.model = district
                await this.getOptionsData({type: 'village', id: district})
                this.inputs.village.model = village

                this.inputs.land_area.model = 400000
                this.inputs.accessibility.model = 'Sulit'
                this.inputs.water_source.model = formOptions.water_source
                this.inputs.government_place.model = formOptions.government_place
                this.inputs.electricity_source.model = formOptions.electricity_source
                this.inputs.total_dusun.model = 243
                this.inputs.potential_dusun.model = 50
                this.inputs.potential_description.model = `Masih terdapat banyak lahan kering yang kosong.`
                this.inputs.total_male.model = 654
                this.inputs.total_female.model = 987
                this.inputs.total_kk.model = 321
                this.inputs.potential_dusun.model = 50
                this.inputs.potential_dusun.model = 50
                this.inputs.land_type.model = formOptions.land_type
                this.inputs.land_slope.model = formOptions.land_slope
                this.inputs.land_height.model = formOptions.land_height
                this.inputs.vegetation_density.model = formOptions.vegetation_density
                this.inputs.rainfall.model = formOptions.rainfall
                this.inputs.agroforestry_type.model = formOptions.agroforestry_type
                this.inputs.land_coverage.model = formOptions.land_coverage
                this.inputs.dry_land_area.model = 130500
                this.inputs.village_figures.model = [{
                    name: 'Qwerty',
                    position: 'Keyboard',
                    phone: '1234567890',
                    whatsapp: '0987654321'
                }]
            } catch (err) {
                this.errorResponse(err)
            } finally {
                this.loading.show = false
            }
        },
        async getOptionsData(inputs) {
            try {
                // prepare for calling api
                let url = ''
                
                // set url
                if (inputs.type == 'province') url = 'GetProvince'
                else if (inputs.type == 'regency') url = 'GetKabupaten?province_code=' + this.inputs.province.model
                else if (inputs.type == 'district') url = 'GetKecamatan?kabupaten_no=' + this.inputs.regency.model
                else if (inputs.type == 'village') url = 'GetDesa?&kode_kecamatan=' + this.inputs.district.model

                this.loading.text = `Getting ${inputs.type} datas...`

                // reset data 
                if (inputs.type == 'regency') {
                    this.inputs.district.model = ''
                    this.inputs.district.items = []
                } if (['regency', 'district'].includes(inputs.type)) { 
                    this.inputs.village.model = ''
                    this.inputs.village.items = []
                }
                if (url != '') {
                    url = this.$store.getters.getApiUrl(url) 

                    this.inputs[inputs.type].model = ''
                    this.inputs[inputs.type].loading = true
                    
                    // calling api
                    const res = await axios.get(url, this.$store.state.apiConfig)
                    this.inputs[inputs.type].items = res.data.data.result.sort((a, b) => a.name.localeCompare(b.name))
                }
            } catch (err) {
                this.errorResponse(err)
                this.inputs[inputs.type].items = []
            } finally {
                this.$store.state.loadingOverlayText = null
                this.inputs[inputs.type].loading = false
            }
        },
        modifyTotalSubData(type, name) {
            try {
                if (type == '+') {
                    let inputs = JSON.parse(JSON.stringify(this.inputs[name].default[0]))
                    this.inputs[name].model.push(inputs)
                } else if (type == '-') this.inputs[name].model.pop()
            } catch (err) {this.errorResponse(err)} finally {
            }
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
        },
        photoFileChanged (event, inputKey) {
            // if (event) {
            //     let fileSize = event.size / 1000000
            //     if (fileSize < 10) {
            //         this.inputs[inputKey].model = event
            //         this.inputs[inputKey].preview = URL.createObjectURL(event)
            //     } else {
            //         Swal.fire({
            //             title: 'Too Big!',
            //             text: `Please change your photo file, it's too big. Max 10mb.`,
            //             icon: 'error',
            //             confirmButtonColor: '#f44336',
            //         })
            //         this.inputs[inputKey].model = null
            //         this.inputs[inputKey].preview = null
            //     }
            // } else {
            //     this.inputs[inputKey].model = null
            //     this.inputs[inputKey].preview = null
            // }
        },
        async resetData() {
            try {
                for (const [key, value] of Object.entries(this.inputs)) {
                    if (this.separateInputsPerType().date.includes(key)) value.model = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                    else if (this.separateInputsPerType().multipleInput.includes(key)) value.model = await JSON.parse(JSON.stringify(value.default))
                    else value.model = null
                }
                this.formStatus = ''
                this.emailToGis = 0
            } catch (err) {this.errorResponse(err)}
        },
        async save() {
            try {
                const confirm = await Swal.fire({
                    title: 'Apakah kamu yakin?',
                    text: "Harap dipastikan lagi data yang sudah diisi!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#2e7d32',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Tidak Jadi',
                    confirmButtonText: 'Ya, Lanjutkan!'
                })
                if (confirm.isConfirmed) {
                    this.showModal = false
                    this.$store.state.loadingOverlay = true
                    this.$store.state.loadingOverlayText = 'Menyimpan data "scooping"...'
                    const scoopingDateRange = JSON.parse(JSON.stringify(this.inputs.scooping_date.model)).sort()
                    let data = {
                        village: this.inputs.village.model,
                        province: this.inputs.province.model,
                        city: this.inputs.regency.model,
                        district: this.inputs.district.model,
                        start_scooping_date: scoopingDateRange[0],
                        end_scooping_date: scoopingDateRange[1],
                        land_area: this.inputs.land_area.model,
                        accessibility: this.inputs.accessibility.model,
                        water_source: this.inputs.water_source.model.toString(),
                        government_place: this.inputs.government_place.model.toString(),
                        electricity_source: this.inputs.electricity_source.model.toString(),
                        total_dusun: this.inputs.total_dusun.model,
                        potential_dusun: this.inputs.potential_dusun.model,
                        potential_description: this.inputs.potential_description.model,
                        total_male: this.inputs.total_male.model,
                        total_female: this.inputs.total_female.model,
                        total_kk: this.inputs.total_kk.model,
                        dry_land_area: this.inputs.dry_land_area.model,
                        land_type: this.inputs.land_type.model ? this.inputs.land_type.model.toString() : '',
                        slope: this.inputs.land_slope.model ? this.inputs.land_slope.model.toString() : '',
                        altitude: this.inputs.land_height.model ? this.inputs.land_height.model.toString() : '',
                        land_coverage: this.inputs.land_coverage.model ? this.inputs.land_coverage.model.toString() : '',
                        vegetation_density: this.inputs.vegetation_density.model ? this.inputs.vegetation_density.model.toString() : '',
                        rainfall: this.inputs.rainfall.model ? this.inputs.rainfall.model.toString() : '',
                        agroforestry_type: this.inputs.agroforestry_type.model ? this.inputs.agroforestry_type.model.toString() : '',
                        village_figures: this.inputs.village_figures.model,
                        user_id: this.$store.state.User.email,
                        status: 'document_saving'
                    }
                    
                    // upload photos
                    var imageKeyInput = ["photo_road_access", "photo_meeting", "photo_dry_land", "village_profile"]
                    for (let index = 0; index < imageKeyInput.length; index++) {
                        let imgKey = imageKeyInput[index]
                        if (this.inputs[imgKey].model) if (this.inputs[imgKey].model.length > 0) {
                            let imgListName = []
                            for (let imgIndex = 0; imgIndex < this.inputs[imgKey].model.length; imgIndex++) {
                                const imgRes = await this.uploadFiles('photo', `Foto ${imgKey} ${imgIndex + 1}`, this.inputs[imgKey].model[imgIndex], 'scooping_visits', 'photos', `${data.village.replace(/\./g, '_')}-${imgKey.replace("photo_", "")}-${imgIndex + 1}`)
                                imgListName.push(imgRes)
                            }
                            data[imgKey] = imgListName.toString()
                        }
                        //  else if (this.inputs[imgKey].preview && !this.inputs[imgKey].preview.includes('noimage')) data[imgKey] = this.inputs[imgKey].preview.replace(this.$store.state.apiUrlImage, "")
                    }
                    // upload village_polygon
                    if (this.inputs.village_polygon.model) {
                        data.village_polygon = await this.uploadFiles('polygon', 'Polygon Desa', this.inputs.village_polygon.model, 'scooping_visits', 'village_polygon', `${data.village.replace(/\./g, '_')}`)
                    } else data.village_polygon = this.raw_data.village_polygon
                    // upload dry_land polygon
                    if (this.inputs.dry_land_polygon.model) {
                        data.dry_land_polygon = await this.uploadFiles('polygon', 'Polygon Lahan Kering Desa', this.inputs.dry_land_polygon.model, 'scooping_visits', 'village_polygon', `${data.village.replace(/\./g, '_')}-dry_land`)
                    } else data.dry_land_polygon = this.raw_data.dry_land_polygon
                    this.$store.state.loadingOverlayText = 'Saving scoping data...'
                    let url = ''
                    if (this.editId) {
                        url = `UpdateScooping?data_no=${this.editId}`
                        if (this.gisInputCheck && this.photosInputCheck) data.status = 'ready_to_submit'
                    }
                    else url = 'AddScooping'
                    const res = await axios.post(this.$store.getters.getApiUrl(url), data, this.$store.state.apiConfig)
                    if (res) {
                        this.$emit('swal', {type: 'success', message: 'Yey! Data berhasil disimpan!'})
                        if (!this.gisInputCheck) {
                            let confirmSendEmail = await Swal.fire({
                                title: 'Bantuan GIS',
                                text: "Apakah anda ingin mengirim email ke GIS STAFF untuk meminta bantuan pengisian?",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#2e7d32',
                                cancelButtonColor: '#d33',
                                cancelButtonText: 'Tidak Usah',
                                confirmButtonText: 'Ya, Kirim!'
                            })
                            if (confirmSendEmail.isConfirmed) {
                                this.$store.state.loadingOverlay = true
                                this.$store.state.loadingOverlayText = 'Mengirim email ke GIS STAFF...'
                                axios.get(`${this.$store.state.apiUrl.replace('api/', '')}send-mail?data_no=${res.data.data.result}`)
                                setTimeout(() => {
                                    this.$emit('swal', {type: 'success', message: 'Yey! Berhasil mengirim email ke GIS STAFF!'})
                                    this.$store.state.loadingOverlay = false
                                }, 1000);
                            }
                        }
                    }
                    else Swal.fire({
                        title: 'Error!',
                        text: `Data gagal disimpan.`,
                        icon: 'error',
                        confirmButtonColor: '#f44336',
                    })
                }
            } catch (err) {this.errorResponse(err)} finally {
                this.$store.state.loadingOverlay = false
                this.$store.state.loadingOverlayText = 'Loading...'
            }
        },
        separateInputsPerType() {  
            let inputsString = []
            let inputsNumber = []
            let inputsDate = []
            let inputsSelect = []
            let inputsMultiple = []
            let inputsMultipleInput = []
            let inputsFile = []
            for (const [key, value] of Object.entries(this.inputs)) {
                if (value.type == 'String') inputsString.push(key)
                if (value.type == 'Number') inputsNumber.push(key)
                if (value.type == 'Date') inputsDate.push(key)
                if (value.type == 'Select') inputsSelect.push(key)
                if (value.type == 'Multiple') inputsMultiple.push(key)
                if (value.type == 'MultipleInput') inputsMultipleInput.push(key)
                if (value.type == 'File') inputsFile.push(key)
            }
            return {
                string: inputsString,
                number: inputsNumber,
                date: inputsDate,
                select: inputsSelect,
                multiple: inputsMultiple,
                multipleInput: inputsMultipleInput,
                file: inputsFile
            }
        },
        async sendEmailToGIS(data_no) {
            try {
                this.loading.show = true
                this.loading.text = 'Mengirim email...'
                await axios.get(`${this.$store.state.apiUrl.replace('api/', '')}send-mail?data_no=${data_no}`)
            } finally {
                this.emailToGis += 1
                this.$emit('swal', {type: 'success', message: 'Yey! Berhasil mengirim email ke GIS STAFF!'})
                this.loading.show = false
            }
        },
        setUrlFileImage(file) {
            return URL.createObjectURL(file)
        },
        async showedModal(id) {
            try {
                this.loading.show = true
                this.loading.text = 'Menyiapkan form...'
                await this.resetData()
                this.inputs.program_year.model = this.programYear
                this.loading.show = true
                await this.getOptionsData({type: 'province'})
                if (id) {
                    this.loading.show = true
                    this.editId = await JSON.parse(JSON.stringify(id))
                    await this.getData(id)
                } else {
                    this.editId = null
                    // await this.getDummiesData()
                }
            } finally {
                this.loading.show = false
            }
        },
        showFormInputs(section) {
            const user = this.$store.state.User
            // if (user.role_name != 'GIS STAFF' && user.role_group != 'IT' && section.gis_role) return false
            if (user.role_name == 'GIS STAFF' && !section.gis_role) return false
            return true
        },
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        },
        async uploadFiles(type, typeName, file, prefix, dir, name) {
            try {
                this.$store.state.loadingOverlayText = `Mengunggah "${typeName}"...`
                const url = `${this.$store.state.apiUrlImage}${prefix}/upload.php`
                let fileToUpload = file
                if (type == 'polygon') fileToUpload = file[0]
                const data = this._utils.generateFormData({
                    dir: dir,
                    nama: name,
                    fileToUpload: fileToUpload,
                    type: type
                })
                let responseName = null
                const res = await axios.post(url,data)
                if (res) {
                    responseName = res.data.data.new_name
                    return `${prefix}/${responseName}`
                }
            } catch (err) {this.errorResponse(err)}
        },
    }
}
</script>