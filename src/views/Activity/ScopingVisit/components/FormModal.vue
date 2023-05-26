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
                <!-- Dynamic Inputs -->
                <v-row class="ma-0 mx-5" v-for="(ig, igIndex) in inputsGroup" :key="`IG-${igIndex}`">
                    <!-- Title -->
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">{{ ig.icon }}</v-icon>{{ ig.title }}</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- Inputs -->
                    <v-col v-for="(itemKey, iKIndex) in ig.items_key" :key="`Inputs-${itemKey}-${iKIndex}`" cols="12" sm="12" :md="inputs[itemKey].lgView == 12 ? 12 : 6" :lg="inputs[itemKey].lgView" >
                        <!-- Khususon: potential_description -->
                        <div v-if="itemKey === 'potential_description' && inputs.total_hamlet_potential.model !== null && inputs.total_hamlet_potential.model > 0">
                            <label for="">
                                <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                {{ inputs[itemKey].label }} 
                                <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </label>
                            <VueEditor />
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
                                dense
                                hide-details
                                outlined
                                rounded
                                show-size
                                :prepend-icon="inputs[itemKey].prependIcon"
                                :accept="inputs[itemKey].accept"
                                :disabled="false"
                                :label="inputs[itemKey].label"
                                v-model="inputs[itemKey].model"
                            >
                                <template v-slot:label>
                                    {{ inputs[itemKey].label }} 
                                    <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                </template>
                            </v-file-input>
                            <v-card 
                                class="rounded-xl mt-2"
                                v-if="inputs[itemKey].accept.includes('jpg') && inputs[itemKey].preview"
                            >
                                <v-img
                                    height="300"
                                    v-bind:src="inputs[itemKey].preview"
                                    class="my-2 mb-4 rounded-xl cursor-pointer"
                                    id="photo1"
                                    @click="showLightbox(inputs[itemKey].preview)"
                                ></v-img>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
                <!-- Batas Wilayah -->
                <v-row class="ma-0 mx-5">
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-compass-rose</v-icon>Batas Wilayah Desa</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                </v-row>
                <!-- Tokoh Desa -->
                <v-row class="ma-0 mx-5">
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
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-200" 
                    color="primary white--text"
                    class=""
                    rounded
                    :key="`saveButton${disabledSave}`"
                    :disabled="disabledSave"
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
        trip: {name: ''},
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
                model: moment().format('Y-MM-DD'),
                modelShow: moment().format('DD MMMM Y'),
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
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                labelIcon: 'mdi-road-variant',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Select'
            },
            number_of_male: {
                label: 'Jumlah Laki - Laki',
                inputType: 'text-field',
                type: 'number',
                append: 'orang',
                lgView: 6,
                labelIcon: 'mdi-human-male',
                required: true
            },
            number_of_female: {
                label: 'Jumlah Perempuan',
                inputType: 'text-field',
                type: 'number',
                append: 'orang',
                lgView: 6,
                labelIcon: 'mdi-human-female',
                required: true
            },
            number_of_families: {
                label: 'Jumlah Keluarga (KK)',
                inputType: 'text-field',
                type: 'number',
                append: 'KK',
                lgView: 6,
                labelIcon: 'mdi-human-male-female-child',
                required: true
            },
            land_type: {
                items: formOptions.land_type.sort(),
                label: 'Jenis Tanah',
                model: '',
                itemText: 'value',
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
                model: '',
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                lgView: 6,
                loading: false,
                required: false,
                type: 'Multiple'
            },
            land_height: {
                items: formOptions.land_height.sort(),
                label: 'Ketinggian Tanah',
                model: '',
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
                model: '',
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
                model: '',
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                labelIcon: 'mdi-water-pump',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Multiple'
            },
            rainfall: {
                items: formOptions.rainfall.sort(),
                label: 'Curah Hujan',
                model: '',
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
                model: '',
                itemText: 'value',
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
                model: '',
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                labelIcon: 'mdi-domain',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Multiple'
            },
            land_coverage: {
                items: formOptions.land_coverage.sort(),
                label: 'Cakupan Lahan',
                model: '',
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
                model: '',
                itemText: 'value',
                itemValue: 'value',
                inputType: 'autocomplete',
                labelIcon: 'mdi-home-lightning-bolt',
                lgView: 6,
                loading: false,
                required: true,
                type: 'Multiple'
            },
            total_hamlet: {
                label: 'Total Dusun',
                model: '',
                inputType: 'text-field',
                lgView: 6,
                append: 'dusun',
                loading: false,
                required: true,
                type: 'Number'
            },
            total_hamlet_potential: {
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
                required: true,
                type: 'String'
            },
            dry_land_area: {
                label: 'Luas Lahan Kering / Kritis',
                model: '',
                inputType: 'text-field',
                lgView: 6,
                append: 'Ha',
                loading: false,
                required: true,
                type: 'Number'
            },
            village_polygon: {
                label: 'Polygon Desa *.kml file',
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
            accessibility_photo: {
                label: 'Akses Jalan',
                accept: '.jpg,.JPG,.jpeg,.JPEG,.png,.PNG',
                model: null,
                preview: null,
                inputType: 'file-input',
                lgView: 4,
                prependIcon: 'mdi-camera',
                loading: false,
                required: false,
                type: 'File'
            },
            meeting_photo: {
                label: 'Pertemuan dengan Tokoh Desa',
                accept: '.jpg,.JPG,.jpeg,.JPEG,.png,.PNG',
                model: null,
                preview: null,
                inputType: 'file-input',
                lgView: 4,
                prependIcon: 'mdi-camera',
                loading: false,
                required: false,
                type: 'File'
            },
            dry_land_photo: {
                label: 'Lahan Kering',
                accept: '.jpg,.JPG,.jpeg,.JPEG,.png,.PNG',
                model: null,
                preview: null,
                inputType: 'file-input',
                lgView: 4,
                prependIcon: 'mdi-camera',
                loading: false,
                required: false,
                type: 'File'
            },
            village_profile: {
                label: 'Profil Desa',
                accept: '.jpg,.JPG,.jpeg,.JPEG,.png,.PNG',
                model: null,
                preview: null,
                inputType: 'file-input',
                lgView: 4,
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
            // Dusun Data
            hamlets: {
                expansionModel: 0,
                loading: false,
                required: true,
                type: 'MultipleInput',
                label: 'Data Dusun',
                form: {
                    divider5: {
                        label: 'General Data',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-list-box',
                    },
                    hamlet_name: {
                        label: 'Nama Dusun',
                        type: 'text',
                        suffix: '',
                        lgView: 6,
                        labelIcon: 'mdi-tag',
                        required: true
                    },
                    land_area: {
                        label: 'Luas Dusun',
                        model: '',
                        inputType: 'text-field',
                        lgView: 6,
                        suffix: '',
                        append: 'm<sup>2</sup>',
                        loading: false,
                        required: true,
                        type: 'number'
                    },
                    // accessibility: {
                    //     items: formOptions.accessibility,
                    //     label: 'Aksesibilitas',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Select'
                    // },
                    // land_type: {
                    //     items: formOptions.land_type.sort(),
                    //     label: 'Jenis Tanah',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Multiple'
                    // },
                    // land_slope: {
                    //     items: formOptions.land_slope,
                    //     label: 'Kelerengan Tanah',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Multiple'
                    // },
                    // land_height: {
                    //     items: formOptions.land_height.sort(),
                    //     label: 'Ketinggian Tanah',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Multiple'
                    // },
                    // vegetation_density: {
                    //     items: formOptions.vegetation_density,
                    //     label: 'Kerapatan Vegetasi',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Multiple'
                    // },
                    // water_source: {
                    //     items: formOptions.water_source.sort(),
                    //     label: 'Sumber Air',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Multiple'
                    // },
                    // rainfall: {
                    //     items: formOptions.rainfall.sort(),
                    //     label: 'Curah Hujan',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Multiple'
                    // },
                    // agroforestry_type: {
                    //     items: formOptions.agroforestry_type.sort(),
                    //     label: 'Tipe Agroforestry',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Multiple'
                    // },
                    // government_place: {
                    //     items: formOptions.government_place.sort(),
                    //     label: 'Tempat Pemerintahan',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Multiple'
                    // },
                    land_coverage: {
                        items: formOptions.land_coverage.sort(),
                        label: 'Cakupan Lahan',
                        model: '',
                        itemText: 'value',
                        itemValue: 'value',
                        inputType: 'autocomplete',
                        lgView: 6,
                        loading: false,
                        required: true,
                        type: 'Multiple'
                    },
                    // electricity_source: {
                    //     items: formOptions.electricity_source.sort(),
                    //     label: 'Sumber Listrik',
                    //     model: '',
                    //     itemText: 'value',
                    //     itemValue: 'value',
                    //     inputType: 'autocomplete',
                    //     lgView: 6,
                    //     loading: false,
                    //     required: true,
                    //     type: 'Multiple'
                    // },
                    dry_land_area: {
                        label: 'Luas Lahan Kering / Kritis',
                        model: '',
                        inputType: 'text-field',
                        lgView: 6,
                        append: 'm<sup>2</sup>',
                        loading: false,
                        required: true,
                        type: 'number'
                    },
                    divider6: {
                        label: 'PIC Dusun',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-account-star',
                    },
                    hamlet_pic_name: {
                        label: 'Nama',
                        type: 'text',
                        suffix: '',
                        lgView: 6,
                        labelIcon: '',
                        required: true
                    },
                    hamlet_pic_position: {
                        label: 'Jabatan',
                        type: 'text',
                        suffix: '',
                        lgView: 6,
                        labelIcon: '',
                        required: true
                    },
                    hamlet_pic_phone: {
                        label: 'No HP',
                        type: 'number',
                        suffix: '',
                        prependIcon: 'mdi-phone',
                        lgView: 6,
                        labelIcon: '',
                        required: true
                    },
                    hamlet_pic_whatsapp: {
                        label: 'Whatsapp',
                        type: 'number',
                        suffix: '',
                        prependIcon: 'mdi-whatsapp',
                        lgView: 6,
                        labelIcon: '',
                        required: false
                    },
                    divider1: {
                        label: 'Data Jumlah Keluarga',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-human-male-female-child',
                    },
                    number_of_rw: {
                        label: 'RW',
                        type: 'number',
                        suffix: 'RW',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true
                    },
                    number_of_rt: {
                        label: 'RT',
                        type: 'number',
                        suffix: 'RT',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true
                    },
                    number_of_male: {
                        label: 'Jumlah Laki - Laki',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-human-male',
                        required: true
                    },
                    number_of_female: {
                        label: 'Jumlah Perempuan',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-human-female',
                        required: true
                    },
                    number_of_families: {
                        label: 'Jumlah Keluarga (KK)',
                        type: 'number',
                        suffix: 'KK',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true
                    },
                    number_of_farmer_families: {
                        label: 'Jumlah Keluarga Petani (KK)',
                        type: 'number',
                        suffix: 'KK',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true
                    },
                    avg_family_member: {
                        label: 'Rata - Rata Anggota Keluarga',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true
                    },
                    divider2: {
                        label: 'Data Edukasi',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-book-education',
                    },
                    total_of_jr_highschool: {
                        label: 'SD - SMP',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-bus-school',
                        required: true
                    },
                    total_of_sr_highschool: {
                        label: 'SMA',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-school',
                        required: true
                    },
                    total_of_university: {
                        label: 'Kuliah',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-school',
                        required: true
                    },
                    divider3: {
                        label: 'Produktifitas',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-face-man-shimmer',
                    },
                    total_of_productive: {
                        label: 'Produktif',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-cash-check',
                        required: true
                    },
                    total_of_not_productive: {
                        label: 'Tidak Produktif',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-cash-off',
                        required: true
                    },
                    divider4: {
                        label: 'Mata Pencaharian Masyarakat',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-hand-coin',
                    },
                    total_of_farmers: {
                        label: 'Petani',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-beekeeper',
                        required: true
                    },
                    total_of_farmer_workers: {
                        label: 'Buruh Tani',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-beekeeper',
                        required: true
                    },
                    total_of_priv_employee: {
                        label: 'Karyawan Swasta',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-supervisor',
                        required: true
                    },
                    total_of_gov_employee: {
                        label: 'ASN (Guru, TNI, Polri)',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-tie',
                        required: true
                    },
                    total_of_entrepreneur: {
                        label: 'Wiraswasta',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-cash',
                        required: true
                    },
                    total_of_other_profession: {
                        label: 'Profesi Lain (Peternakan, Buruh Peternakan, Pensiunan)',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-question',
                        required: true
                    },
                },
                model: [],
                default: [{
                    hamlet_name: null,
                    land_area: 0,
                    land_coverage: [],
                    dry_land_area: 0,
                    hamlet_pic_name: 0,
                    hamlet_pic_position: 0,
                    hamlet_pic_phone: 0,
                    hamlet_pic_whatsapp: 0,
                    number_of_rw: 0,
                    number_of_rt: 0,
                    number_of_male: 0,
                    number_of_female: 0,
                    number_of_families: 0,
                    number_of_farmer_families: 0,
                    number_of_souls: 0,
                    avg_family_member: 0,
                    total_of_jr_highschool: 0,
                    total_of_sr_highschool: 0,
                    total_of_university: 0,
                    total_of_productive: 0,
                    total_of_not_productive: 0,
                    total_of_farmers: 0,
                    total_of_farmer_workers: 0,
                    total_of_priv_employee: 0,
                    total_of_gov_employee: 0,
                    total_of_entrepreneur: 0,
                    total_of_other_profession: 0,
                }],
            },
            // Batas Wilayah
        },
        inputsGroup: [
            {
                title: 'Lokasi & Tanggal Kegiatan Scooping',
                icon: 'mdi-calendar',
                items_key: ["province", "regency", "district", "village", "scooping_date"]
            },
            {
                title: 'Data General Desa',
                icon: 'mdi-list-box',
                // items_key: ["land_area", "accessibility", "land_type", "land_slope", "land_height", "vegetation_density", "water_source", "rainfall", "agroforestry_type", "government_place", "land_coverage", "electricity_source", "dry_land_area"]
                items_key: ["land_area", "accessibility", "water_source", "government_place", "electricity_source"]
            },
            {
                title: 'Data Populasi Dan Wilayah',
                icon: 'mdi-account-group',
                items_key: ["total_hamlet", "total_hamlet_potential", "potential_description", "number_of_male", "number_of_female", "number_of_families"],
            }, 
            {
                title: 'Upload Photo File',
                icon: 'mdi-image-multiple',
                items_key: ["accessibility_photo", "meeting_photo", "dry_land_photo", "village_profile"],
            }, 
            {
                title: 'Kelengkapan Data Lahan Kering',
                icon: 'mdi-land-fields',
                items_key: ["dry_land_area", "land_type", "land_slope", "land_height", "land_coverage", "vegetation_density", "agroforestry_type", "rainfall"]
            },
            {
                title: 'Upload Polygon File (GIS)',
                icon: 'mdi-map-marker-path',
                items_key: ["village_polygon", "dry_land_polygon"],
            }
        ],
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
            requiredInputIcon: 'mdi-alert-decagram'
        },
        showedModal: false,
    }),
    watch: {
        'inputs.scooping_date.model': {
            async handler(newVal) {
                // console.log(newVal[0])
                this.inputs.scooping_date.modelShow = this._utils.dateFormat(newVal[0], 'DD MMMM Y') + ' ~ ' + this._utils.dateFormat(newVal[1], 'DD MMMM Y')
            }
        },
        showedModal(val, oldVal) {
            if (oldVal != val && val == true) {
                // console.log(val)
                this.resetData()
                this.inputs.program_year.model = this.programYear
                if (this.id) this.getData(this.id)
                else this.getDummiesData()
            }
        },
        'inputs.province.model': {
            handler(val) {
                if (val) this.getOptionsData({type: 'regency'})
            }
        },
        'inputs.regency.model': {
            handler(val) {
                if (val) this.getOptionsData({type: 'district'})
            }
        },
        'inputs.district.model': {
            handler(val) {
                if (val) this.getOptionsData({type: 'village'})
            }
        },
        'inputs.accessibility_photo.model': {
            async handler(val) {
                await this.photoFileChanged(val, 'accessibility_photo')
            }
        },
        'inputs.meeting_photo.model': {
            async handler(val) {
                await this.photoFileChanged(val, 'meeting_photo')
            }
        },
        'inputs.dry_land_photo.model': {
            async handler(val) {
                await this.photoFileChanged(val, 'dry_land_photo')
            }
        },
        'inputs.hamlets.model': {
            handler(val) {
            }
        }
    },
    computed: {
        showModal: {
            get: function () {
                this.showedModal = this.show
                return this.show
            },
            set: function(newVal) {
                if (newVal) {
                    this.inputs.program_year.model = this.programYear
                } else this.$emit('action', {type: 'close', name: 'form'})
            }
        },
        disabledSave() {
            let requiredEmpty = 0
            for (const [key, value] of Object.entries(this.inputs)) {
                if ((key == 'village_figures')) {
                    if (value.required) if (value.model.length > 0) {
                        value.model.forEach(vm => {
                            if (!vm.name || !vm.position || !vm.phone) requiredEmpty += 1
                        })
                    } else requiredEmpty += 1
                } else if (value.type == 'MultipleInput') {
                    if (value.required) if (value.model.length > 0) {
                        value.model.forEach(vm => {
                            Object.entries(value.form).map(form => {
                                if (form[1].required === true) {
                                    if (!(vm[form[0]] !== null && vm[form[0]] !== 0)) requiredEmpty += 1
                                }
                            })
                        })
                    } else requiredEmpty += 1
                } else if (value.required) if (!value.model) {
                    requiredEmpty += 1
                    // console.log(key)
                }
            }
            return requiredEmpty > 0 ? true : false
        }
    },
    async mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
        // console.log(formOptions)
        await this.getOptionsData({type: 'province'})
    },
    methods: {
        errorResponse(error) {
            console.log(error)
            if (error.response) {
                if (error.response.status) {
                    if (error.response.status == 401) {
                        localStorage.removeItem("token");
                        this.$router.push("/");
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
                for (const [key, value] of Object.entries(data)) {
                    if (this.separateInputsPerType().string.includes(key) || this.separateInputsPerType().number.includes(key) || this.separateInputsPerType().date.includes(key) || this.separateInputsPerType().select.includes(key)) this.inputs[key].model = value
                    if (this.separateInputsPerType().multiple.includes(key)) this.inputs[key].model = value.split(",")
                }
                this.inputs.province.model = data.province
                await this.getOptionsData({type: 'regency', id: data.province})
                this.inputs.regency.model = data.city
                await this.getOptionsData({type: 'district', id: data.city})
                this.inputs.district.model = data.district
                await this.getOptionsData({type: 'village', id: data.district})
                this.inputs.village.model = data.village
                // console.log(data)
            } catch (err) {
                this.errorResponse(err)
                this.$emit('action', {type: 'close', name: 'form'})
            } finally {
                this.loading.show = false
            }
        },
        async getDummiesData() {
            try {
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
                this.inputs.land_type.model = formOptions.land_type
                this.inputs.land_slope.model = formOptions.land_slope
                this.inputs.land_height.model = formOptions.land_height
                this.inputs.vegetation_density.model = formOptions.vegetation_density
                this.inputs.water_source.model = formOptions.water_source
                this.inputs.rainfall.model = formOptions.rainfall
                this.inputs.agroforestry_type.model = formOptions.agroforestry_type
                this.inputs.government_place.model = formOptions.government_place
                this.inputs.land_coverage.model = formOptions.land_coverage
                this.inputs.electricity_source.model = formOptions.electricity_source
                this.inputs.dry_land_area.model = 130500
                this.inputs.village_figures.model = [{
                    name: 'Qwerty',
                    position: 'Keyboard',
                    phone: '1234567890',
                    whatsapp: '0987654321'
                }]
                this.inputs.hamlets.model = [{
                    hamlet_name: 'Durian',
                    land_area: 0,
                    land_coverage: 0,
                    dry_land_area: 0,
                    hamlet_pic_name: 'Epin',
                    hamlet_pic_position: 'Humas',
                    hamlet_pic_phone: null,
                    hamlet_pic_whatsapp: null,
                    number_of_families: 543,
                    number_of_farmer_families: 300,
                    number_of_souls: 2300,
                    avg_family_member: 4,
                    total_of_jr_highschool: 100,
                    total_of_sr_highschool: 200,
                    total_of_university: 200,
                    total_of_productive: 400,
                    total_of_not_productive: 100,
                    total_of_farmers: 400,
                    total_of_farmer_workers: 500,
                    total_of_priv_employee: 300,
                    total_of_gov_employee: 200,
                    total_of_entrepreneur: 100,
                    total_of_other_profession: 1200,
                }]
            } catch (err) {
                this.errorResponse(err)
            } finally {
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

                this.$store.state.loadingOverlayText = `Getting ${inputs.type} datas...`

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
                    // console.log(inputs)
                    this.inputs[name].model.push(inputs)
                    // console.log(this.inputs.hamlets.expansionModel)
                } else if (type == '-') this.inputs[name].model.pop()
            } catch (err) {this.errorResponse(err)} finally {
                if (name == 'hamlets') this.inputs.hamlets.expansionModel = this.inputs.hamlets.model.length - 1
            }
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        },
        photoFileChanged (event, inputKey) {
            if (event) {
                let fileSize = event.size / 1000000
                // console.log(fileSize)
                if (fileSize < 10) {
                    this.inputs[inputKey].model = event
                    this.inputs[inputKey].preview = URL.createObjectURL(event)
                } else {
                    Swal.fire({
                        title: 'Too Big!',
                        text: `Please change your photo file, it's too big. Max 10mb.`,
                        icon: 'error',
                        confirmButtonColor: '#f44336',
                    })
                    this.inputs[inputKey].model = null
                    this.inputs[inputKey].preview = null
                }
            } else {
                this.inputs[inputKey].model = null
                this.inputs[inputKey].preview = null
            }
        },
        resetData() {
            try {
                for (const [key, value] of Object.entries(this.inputs)) {
                    if (this.separateInputsPerType().date.includes(key)) value.model = moment().format('YYYY-MM-DD')
                    else if (this.separateInputsPerType().multipleInput.includes(key)) value.model = JSON.parse(JSON.stringify(value.default))
                    else value.model = null
                }
                // console.log(this.separateInputsPerType().multipleInput)
            } catch (err) {this.errorResponse(err)}
        },
        async save() {
            try {
                const confirm = await Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
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
                    this.$store.state.loadingOverlayText = 'Saving scoping data...'
                    let data = {
                        village: this.inputs.village.model,
                        province: this.inputs.province.model,
                        city: this.inputs.regency.model,
                        district: this.inputs.district.model,
                        land_area: this.inputs.land_area.model,
                        scooping_date: this.inputs.scooping_date.model,
                        land_type: this.inputs.land_type.model.toString(),
                        slope: this.inputs.land_slope.model.toString(),
                        altitude: this.inputs.land_height.model.toString(),
                        dry_land_area: this.inputs.dry_land_area.model,
                        vegetation_density: this.inputs.vegetation_density.model.toString(),
                        rainfall: this.inputs.rainfall.model.toString(),
                        agroforestry_type: this.inputs.agroforestry_type.model.toString(),
                        government_place: this.inputs.government_place.model.toString(),
                        water_source: this.inputs.water_source.model.toString(),
                        land_coverage: this.inputs.land_coverage.model.toString(),
                        electricity_source: this.inputs.electricity_source.model.toString(),
                        village_figures: this.inputs.village_figures.model,
                        user_id: this.$store.state.User.email,
                    }
                    // upload village_polygon
                    if (this.inputs.village_polygon.model) {
                        data.village_polygon = await this.uploadFiles('polygon', 'Polygon Desa', this.inputs.village_polygon.model, 'scooping_visits', 'village_polygon', `${data.village.replace(/\./g, '_')}`)
                    }
                    // upload dry_land polygon
                    if (this.inputs.dry_land_polygon.model) {
                        data.dry_land_polygon = await this.uploadFiles('polygon', 'Polygon Lahan Kering Desa', this.inputs.dry_land_polygon.model, 'scooping_visits', 'village_polygon', `${data.village.replace(/\./g, '_')}-dry_land`)
                    }
                    // upload accessibility_photo
                    if (this.inputs.accessibility_photo.model) {
                        data.accessibility_photo = await this.uploadFiles('photo', 'Foto Akses Jalan', this.inputs.accessibility_photo.model, 'scooping_visits', 'photos', `${data.village.replace(/\./g, '_')}-accessibility`)
                    }
                    // upload meeting_photo
                    if (this.inputs.meeting_photo.model) {
                        data.meeting_photo = await this.uploadFiles('photo', 'Foto Akses Jalan', this.inputs.meeting_photo.model, 'scooping_visits', 'photos', `${data.village.replace(/\./g, '_')}-stakeholder_meeting`)
                    }
                    // upload dry_land_photo
                    if (this.inputs.dry_land_photo.model) {
                        data.dry_land_photo = await this.uploadFiles('photo', 'Foto Akses Jalan', this.inputs.dry_land_photo.model, 'scooping_visits', 'photos', `${data.village.replace(/\./g, '_')}-dry_land`)
                    }
                    this.$store.state.loadingOverlayText = 'Saving scoping data...'
                    // console.log(data.village_figures)
                    let url = ''
                    if (this.id) url = `UpdateScooping?data_no=${this.id}`
                    else url = 'AddScooping'
                    const res = await axios.post(this.$store.getters.getApiUrl(url), data, this.$store.state.apiConfig)
                    if (res) this.$emit('swal', {type: 'success', message: 'Yey! Data scooping saved!'})
                    else Swal.fire({
                        title: 'Error!',
                        text: `Data failed to save.`,
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
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        },
        async uploadFiles(type, typeName, file, prefix, dir, name) {
            try {
                this.$store.state.loadingOverlayText = `Saving file "${typeName}"...`
                const url = `${this.$store.state.apiUrlImage}${prefix}/upload.php`
                const data = this._utils.generateFormData({
                    dir: dir,
                    nama: name,
                    fileToUpload: file,
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