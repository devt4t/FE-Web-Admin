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
                <!-- SELECT VILLAGE -->
                <v-row class="ma-0 mx-5">
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-city</v-icon>Lokasi & Tangal Scoping</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- Province -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="province_code"
                            :items="inputs.province.items"
                            :label="inputs.province.label"
                            :loading="inputs.province.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.province.loading ? 'Loading...' : 'No Data'"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.province.model"
                            v-on:change="getOptionsData({type: 'regency'})"
                        ></v-autocomplete>
                    </v-col>
                    <!-- Regency -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kabupaten_no"
                            :items="inputs.regency.items"
                            :label="inputs.regency.label"
                            :loading="inputs.regency.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.regency.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.regency.model"
                            v-on:change="getOptionsData({type: 'district'})"
                        ></v-autocomplete>
                    </v-col>
                    <!-- District -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_kecamatan"
                            :items="inputs.district.items"
                            :label="inputs.district.label"
                            :loading="inputs.district.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.district.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.district.model"
                            v-on:change="getOptionsData({type: 'village'})"
                        ></v-autocomplete>
                    </v-col>
                    <!-- Village -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.village.items"
                            :loading="inputs.village.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.village.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.village.model"
                        >
                            <template v-slot:label>
                                {{ inputs.village.label }} 
                                <sup><v-icon v-if="inputs.village.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- Tanggal Scoping -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-menu 
                            rounded="xl"
                            transition="slide-x-transition"
                            bottom
                            min-width="100"
                            offset-y
                            :close-on-content-click="true"
                            v-model="inputs.scooping_date.show"
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
                                            v-model="inputs.scooping_date.modelShow"
                                        >
                                            <template v-slot:label>
                                                {{ inputs.scooping_date.label }} 
                                                <sup><v-icon v-if="inputs.scooping_date.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                            </template>
                                        </v-text-field>
                                    </template>
                                    <span>Klik untuk memunculkan datepicker</span>
                                </v-tooltip>
                            </template>
                            <div class="rounded-xl pb-2 white">
                                <v-overlay :value="inputs.scooping_date.loading">
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
                                        color="green lighten-1 rounded-xl" 
                                        v-model="inputs.scooping_date.model"
                                        min="2022-11-24"
                                    ></v-date-picker>
                                </div>
                            </div>
                        </v-menu>
                    </v-col>
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-format-columns</v-icon>Scoping Visit Form</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- land_area -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-text-field
                            dense
                            color="success"
                            hide-details
                            :label="inputs.land_area.label"
                            :disabled="false"
                            outlined
                            rounded
                            type="number"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_area.model"
                        >
                            <template v-slot:label>
                                {{ inputs.land_area.label }} 
                                <sup><v-icon v-if="inputs.land_area.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                            <template v-slot:append>
                                <div class="mt-1 ml-1">
                                    m<sup>2</sup>
                                </div>
                            </template>
                        </v-text-field>
                    </v-col>
                    <!-- land_type -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            dense
                            multiple
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.land_type.items"
                            :label="inputs.land_type.label"
                            :loading="inputs.land_type.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.land_type.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_type.model"
                        >
                            <template v-slot:label>
                                {{ inputs.land_type.label }} 
                                <sup><v-icon v-if="inputs.land_type.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- land_slope -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.land_slope.items"
                            :label="inputs.land_slope.label"
                            :loading="inputs.land_slope.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.land_slope.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_slope.model"
                        >
                            <template v-slot:label>
                                {{ inputs.land_slope.label }} 
                                <sup><v-icon v-if="inputs.land_slope.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- land_height -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            suffix="mdpl"
                            :items="inputs.land_height.items"
                            :label="inputs.land_height.label"
                            :loading="inputs.land_height.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.land_height.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_height.model"
                        >
                            <template v-slot:label>
                                {{ inputs.land_height.label }} 
                                <sup><v-icon v-if="inputs.land_height.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- vegetation_density -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.vegetation_density.items"
                            :label="inputs.vegetation_density.label"
                            :loading="inputs.vegetation_density.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.vegetation_density.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.vegetation_density.model"
                        >
                            <template v-slot:label>
                                {{ inputs.vegetation_density.label }} 
                                <sup><v-icon v-if="inputs.vegetation_density.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- water_source -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.water_source.items"
                            :label="inputs.water_source.label"
                            :loading="inputs.water_source.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.water_source.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.water_source.model"
                        >
                            <template v-slot:label>
                                {{ inputs.water_source.label }} 
                                <sup><v-icon v-if="inputs.water_source.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- rainfall -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            suffix="mm"
                            :items="inputs.rainfall.items"
                            :label="inputs.rainfall.label"
                            :loading="inputs.rainfall.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.rainfall.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.rainfall.model"
                        >
                            <template v-slot:label>
                                {{ inputs.rainfall.label }} 
                                <sup><v-icon v-if="inputs.rainfall.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- agroforestry_type -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.agroforestry_type.items"
                            :label="inputs.agroforestry_type.label"
                            :loading="inputs.agroforestry_type.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.agroforestry_type.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.agroforestry_type.model"
                        >
                            <template v-slot:label>
                                {{ inputs.agroforestry_type.label }} 
                                <sup><v-icon v-if="inputs.agroforestry_type.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- government_place -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.government_place.items"
                            :label="inputs.government_place.label"
                            :loading="inputs.government_place.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.government_place.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.government_place.model"
                        >
                            <template v-slot:label>
                                {{ inputs.government_place.label }} 
                                <sup><v-icon v-if="inputs.government_place.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- land_coverage -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.land_coverage.items"
                            :label="inputs.land_coverage.label"
                            :loading="inputs.land_coverage.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.land_coverage.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.land_coverage.model"
                        >
                            <template v-slot:label>
                                {{ inputs.land_coverage.label }} 
                                <sup><v-icon v-if="inputs.land_coverage.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- electricity_source -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-autocomplete
                            multiple
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="name"
                            item-value="kode_desa"
                            :items="inputs.electricity_source.items"
                            :label="inputs.electricity_source.label"
                            :loading="inputs.electricity_source.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.electricity_source.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.electricity_source.model"
                        >
                            <template v-slot:label>
                                {{ inputs.electricity_source.label }} 
                                <sup><v-icon v-if="inputs.electricity_source.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- dry_land_area -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-text-field
                            dense
                            color="success"
                            hide-details
                            :label="inputs.dry_land_area.label"
                            :disabled="false"
                            outlined
                            rounded
                            type="number"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.dry_land_area.model"
                        >
                            <template v-slot:label>
                                {{ inputs.dry_land_area.label }} 
                                <sup><v-icon v-if="inputs.dry_land_area.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                            <template v-slot:append>
                                <div class="mt-1 ml-1">
                                    m<sup>2</sup>
                                </div>
                            </template>
                        </v-text-field>
                    </v-col>
                    <!-- POLYGON INPUTS -->
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-map-marker-path</v-icon>Upload File Polygon</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- village_polygon -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-file-input
                            color="success"
                            dense
                            hide-details
                            outlined
                            rounded
                            show-size
                            prepend-icon="mdi-vector-polygon"
                            :accept="inputs.village_polygon.accept"
                            :disabled="false"
                            :label="inputs.village_polygon.label"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.village_polygon.model"
                        >
                            <template v-slot:label>
                                {{ inputs.village_polygon.label }} 
                                <sup><v-icon v-if="inputs.village_polygon.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-file-input>
                    </v-col>
                    <!-- dry_land_polygon -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-file-input
                            color="success"
                            dense
                            hide-details
                            outlined
                            rounded
                            show-size
                            prepend-icon="mdi-vector-polygon"
                            :accept="inputs.dry_land_polygon.accept"
                            :disabled="false"
                            :label="inputs.dry_land_polygon.label"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.dry_land_polygon.model"
                        >
                            <template v-slot:label>
                                {{ inputs.dry_land_polygon.label }} 
                                <sup><v-icon v-if="inputs.dry_land_polygon.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-file-input>
                    </v-col>
                    <!-- critical_land_polygon -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <v-file-input
                            color="success"
                            dense
                            hide-details
                            outlined
                            rounded
                            show-size
                            prepend-icon="mdi-vector-polygon"
                            :accept="inputs.critical_land_polygon.accept"
                            :disabled="false"
                            :label="inputs.critical_land_polygon.label"
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.critical_land_polygon.model"
                        >
                            <template v-slot:label>
                                {{ inputs.critical_land_polygon.label }} 
                                <sup><v-icon v-if="inputs.critical_land_polygon.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-file-input>
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
                loading: false,
                required: true,
                type: 'String'
            },
            regency: {
                label: 'Kabupaten / Kota',
                model: '',
                items: [],
                loading: false,
                required: true,
                type: 'String'
            },
            district: {
                label: 'Kecamatan',
                model: '',
                items: [],
                loading: false,
                required: true,
                type: 'String'
            },
            village: {
                items: [],
                label: 'Desa',
                model: '',
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
                show: false,
                required: true,
                type: 'Date'
            },
            // scoping visit inputs
            land_area: {
                label: 'Luas Desa',
                model: '',
                loading: false,
                required: true,
                type: 'Number'
            },
            land_type: {
                items: formOptions.land_type.sort(),
                label: 'Jenis Tanah',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            land_slope: {
                items: formOptions.land_slope,
                label: 'Kelerengan Tanah',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            land_height: {
                items: formOptions.land_height.sort(),
                label: 'Ketinggian Tanah',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            vegetation_density: {
                items: formOptions.vegetation_density.sort(),
                label: 'Kerapatan Vegetasi',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            water_source: {
                items: formOptions.water_source.sort(),
                label: 'Sumber Air',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            rainfall: {
                items: formOptions.rainfall.sort(),
                label: 'Curah Hujan',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            agroforestry_type: {
                items: formOptions.agroforestry_type.sort(),
                label: 'Tipe Agroforestry',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            government_place: {
                items: formOptions.government_place.sort(),
                label: 'Tempat Pemerintahan',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            land_coverage: {
                items: formOptions.land_coverage.sort(),
                label: 'Cakupan Lahan',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            electricity_source: {
                items: formOptions.electricity_source.sort(),
                label: 'Sumber Listrik',
                model: '',
                loading: false,
                required: true,
                type: 'Multiple'
            },
            dry_land_area: {
                label: 'Luas Lahan Kering',
                model: '',
                loading: false,
                required: true,
                type: 'Number'
            },
            village_polygon: {
                label: 'Polygon Desa *.kmz file',
                accept: '.kmz',
                model: null,
                loading: false,
                required: false,
                type: 'File'
            },
            dry_land_polygon: {
                label: 'Polygon Lahan Kering *.kmz file',
                accept: '.kmz',
                model: null,
                loading: false,
                required: false,
                type: 'File'
            },
            critical_land_polygon: {
                label: 'Polygon Lahan Kritis *.kmz file',
                accept: '.kmz',
                model: null,
                loading: false,
                required: false,
                type: 'File'
            },
        },
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
    }),
    watch: {
        'inputs.scooping_date.model': {
            async handler(newVal) {
                this.inputs.scooping_date.modelShow = this._utils.dateFormat(newVal, 'DD MMMM Y')
            }
        }
    },
    computed: {
        showModal: {
            get: function () {
                if (this.show == true) {
                    this.resetData()
                    this.inputs.program_year.model = this.programYear
                    if (this.id) this.getData(this.id)
                    else this.getDummiesData()
                }
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
                if (value.required) if (!value.model) {
                    requiredEmpty += 1
                    console.log(key)
                }
            }
            return requiredEmpty > 0 ? true : false
        }
    },
    async mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
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
                    if (this.separateInputsPerType().string.includes(key) || this.separateInputsPerType().number.includes(key) || this.separateInputsPerType().date.includes(key)) this.inputs[key].model = value
                    if (this.separateInputsPerType().multiple.includes(key)) this.inputs[key].model = value.split(",")
                }
                this.inputs.province.model = data.province
                await this.getOptionsData({type: 'regency', id: data.province})
                this.inputs.regency.model = data.city
                await this.getOptionsData({type: 'district', id: data.city})
                this.inputs.district.model = data.district
                await this.getOptionsData({type: 'village', id: data.district})
                this.inputs.village.model = data.village
                console.log(data)
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

                this.inputs.land_area.model = 200
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
                this.inputs.dry_land_area.model = 130
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
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        },
        resetData() {
            try {
                for (const [key, value] of Object.entries(this.inputs)) {
                    if (this.separateInputsPerType().date.includes(key)) value.model = moment().format('YYYY-MM-DD')
                    else value.model = null
                }
            } catch (err) {this.errorResponse(err)}
        },
        separateInputsPerType() {  
            let inputsString = []
            let inputsNumber = []
            let inputsDate = []
            let inputsMultiple = []
            let inputsFile = []
            for (const [key, value] of Object.entries(this.inputs)) {
                if (value.type == 'String') inputsString.push(key)
                if (value.type == 'Number') inputsNumber.push(key)
                if (value.type == 'Date') inputsDate.push(key)
                if (value.type == 'Multiple') inputsMultiple.push(key)
                if (value.type == 'File') inputsFile.push(key)
            }
            return {
                string: inputsString,
                number: inputsNumber,
                date: inputsDate,
                multiple: inputsMultiple,
                file: inputsFile
            }
        },
        async save() {
            try {
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
                    user_id: this.$store.state.User.email,
                }
                // upload village polygon
                if (this.inputs.village_polygon.model) {
                    data.village_polygon = await this.uploadPhotos('Polygon Desa', this.inputs.village_polygon.model, 'scooping_visits', 'village_polygon', `${data.village.replace(/\./g, '_')}`)
                }
                // upload dry_land polygon
                if (this.inputs.dry_land_polygon.model) {
                    data.dry_land_polygon = await this.uploadPhotos('Polygon Lahan Kering Desa', this.inputs.dry_land_polygon.model, 'scooping_visits', 'village_polygon', `${data.village.replace(/\./g, '_')}-dry_land`)
                }
                // upload critical_land polygon
                if (this.inputs.critical_land_polygon.model) {
                    data.critical_land_polygon = await this.uploadPhotos('Polygon Lahan Kritis Desa', this.inputs.critical_land_polygon.model, 'scooping_visits', 'village_polygon', `${data.village.replace(/\./g, '_')}-critical_land`)
                }
                this.$store.state.loadingOverlayText = 'Saving scoping data...'
                console.log(data)
                let url = ''
                if (this.id) url = `UpdateScooping?data_no=${this.id}`
                else url = 'AddScooping'
                const res = await axios.post(this.$store.getters.getApiUrl(url), data, this.$store.state.apiConfig)
                if (res) this.$emit('swal', {type: 'success', message: 'Yey! Data scooping saved!'})
            } catch (err) {this.errorResponse(err)} finally {
                this.$store.state.loadingOverlay = false
                this.$store.state.loadingOverlayText = 'Loading...'
            }
        },
        async uploadPhotos(type, file, prefix, dir, name) {
            try {
                this.$store.state.loadingOverlayText = `Saving photo "${type}"...`
                const url = `${this.$store.state.apiUrlImage}${prefix}/upload.php`
                const data = this._utils.generateFormData({
                    dir: dir,
                    nama: name,
                    fileToUpload: file
                })
                let responseName = null
                const res = await axios.post(url,data)
                if (res) {
                    responseName = res.data.data.new_name
                    return `${prefix}/${responseName}`
                }
            } catch (err) {this.errorResponse(err)}
        }
    }
}
</script>