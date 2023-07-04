<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="800"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                <span class="white--text">
                    <v-btn class="white dark--text mr-1" fab x-small>
                        <v-icon color="grey darken-3">mdi-file-document</v-icon>
                    </v-btn> 
                    Scoping Visit #{{ this.id }}
                    <v-chip small :color="getStatusColumn('bg_color', status_data)" class="white--text ml-2">
                        <v-icon class="mr-1">{{ getStatusColumn('icon', status_data) }}</v-icon>
                        {{ getStatusColumn('text', status_data) }}
                    </v-chip>
                </span>
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text class="pa-0" style="min-height: 300px;">
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
                <!-- export table -->
                <div id="containerForExport-ScoopingVisit" style="display: none">
                    <p style="text-align: right">Export Time: {{ Date() }}</p>
                    <h2 style="text-align: center;">Scooping Visit Report</h2>
                    <p style="text-align: center;">Form No: #{{ this.id }}</p>
                    <h4>1. Tanggal & Lokasi </h4>
                    <table id="tableForExport-ScoopingVisit" style="width: 100%;">
                        <tr>
                            <td>Tanggal</td>
                            <td colspan="5">: {{ this._utils.dateFormat(this.raw_data.start_scooping_date, 'DD MMMM YYYY') }} {{ this.raw_data.start_scooping_date != this.raw_data.end_scooping_date ? ' - ' + this._utils.dateFormat(this.raw_data.end_scooping_date, 'DD MMMM YYYY') : '' }}</td>
                        </tr>
                        <tr>
                            <td>Provinsi</td>
                            <td colspan="5">: {{ this.raw_data.province_name }}</td>
                        </tr>
                        <tr>
                            <td>Kab / Kota</td>
                            <td colspan="5">: {{ _utils.capitalizeLetter(this.raw_data.city_name) }}</td>
                        </tr>
                        <tr>
                            <td>Kecamatan</td>
                            <td colspan="5">: {{ _utils.capitalizeLetter(this.raw_data.district_name) }}</td>
                        </tr>
                        <tr>
                            <td>Desa</td>
                            <td colspan="5">: {{ _utils.capitalizeLetter(this.raw_data.village_name) }}</td>
                        </tr>
                    </table>
                    <h4>2. Data Desa </h4>
                    <table>
                        <tr>
                            <td>Luas Desa</td>
                            <td colspan="5">: {{ this.raw_data.land_area }} Ha</td>
                        </tr>
                        <tr>
                            <td>Aksesibilitas</td>
                            <td colspan="5">: {{ this.raw_data.accessibility }}</td>
                        </tr>
                        <tr>
                            <td>Sumber Air</td>
                            <td colspan="5">: {{ this.raw_data.water_source }}</td>
                        </tr>
                        <tr>
                            <td>Sumber Listrik</td>
                            <td colspan="5">: {{ this.raw_data.electricity_source }}</td>
                        </tr>
                        <tr>
                            <td>Tempat Pemerintahan</td>
                            <td colspan="5">: {{ this.raw_data.goverment_place }}</td>
                        </tr>
                    </table>
                    <h4>3. Data Populasi </h4>
                    <table>
                        <tr>
                            <td>Total Keluarga</td>
                            <td colspan="5">: {{ this.raw_data.total_kk }} KK</td>
                        </tr>
                        <tr>
                            <td>Total Laki - Laki</td>
                            <td colspan="5">: {{ this.raw_data.total_male }} orang</td>
                        </tr>
                        <tr>
                            <td>Total Perempuan</td>
                            <td colspan="5">: {{ this.raw_data.total_female }} orang</td>
                        </tr>
                        <tr>
                            <td>Total Dusun</td>
                            <td colspan="5">: {{ this.raw_data.total_dusun }} dusun</td>
                        </tr>
                        <tr>
                            <td>Total Dusun Yang Berpotensi</td>
                            <td colspan="5">: {{ this.raw_data.potential_dusun }} dusun</td>
                        </tr>
                        <tr>
                            <td>Deskripsi Potensi Dusun</td>
                            <td colspan="5">: <div v-html="this.raw_data.potential_description"></div></td>
                        </tr>
                    </table>
                    <h4>4. Kelengkapan Data Lahan Kering</h4>
                    <table>
                        <tr>
                            <td>Luas Lahan Kering</td>
                            <td colspan="5">: {{ this.raw_data.dry_land_area }} Ha</td>
                        </tr>
                        <tr>
                            <td>Jenis Tanah</td>
                            <td colspan="5">: {{ this.raw_data.land_type }}</td>
                        </tr>
                        <tr>
                            <td>Ketinggian Tanah (mdpl)</td>
                            <td colspan="5">: {{ this.raw_data.land_height }}</td>
                        </tr>
                        <tr>
                            <td>Kelerengan Tanah (<sup>o</sup>)</td>
                            <td colspan="5">: {{ this.raw_data.land_slope }}</td>
                        </tr>
                        <tr>
                            <td>Kerapatan Vegetasi</td>
                            <td colspan="5">: {{ this.raw_data.vegetation_density }}</td>
                        </tr>
                        <tr>
                            <td>Pola Tanam Lahan Kering</td>
                            <td colspan="5">: {{ this.raw_data.agroforestry_type }}</td>
                        </tr>
                        <tr>
                            <td>Curah Hujan (mm)</td>
                            <td colspan="5">: {{ this.raw_data.rainfall }}</td>
                        </tr>
                    </table>
                    <h4>5. Tokoh Desa</h4>
                    <table style="width: 100%;border-collapse: collapse;" border="1">
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Jabatan</th>
                            <th>No HP</th>
                            <th>Whatsapp</th>
                        </tr>
                        <tr v-for="(tokoh, tokohIndex) in this.raw_data.scooping_figures" :key="tokoh.name">
                            <td>{{ tokohIndex + 1 }}</td>
                            <td>{{ tokoh.name }}</td>
                            <td>{{ tokoh.position }}</td>
                            <td>{{ tokoh.phone }}</td>
                            <td>{{ tokoh.whatsapp }}</td>
                        </tr>
                    </table>
                    <h4>6. Gallery - Akses Jalan</h4>
                    <table>
                        <tr v-for="(imageExp, imageExpIndex) in this.raw_data.photo_road_access" :key="imageExp">
                            <td>
                                <img :src="imageExp" style="max-width: 100px;max-height: 50px;" />
                            </td>
                        </tr>
                    </table>
                    <h4>7. Gallery - Pertemuan</h4>
                    <table>
                        <tr v-for="(imageExp, imageExpIndex) in this.raw_data.photo_meeting" :key="imageExp">
                            <td>
                                <img :src="imageExp" style="max-width: 100px;max-height: 50px;" />
                            </td>
                        </tr>
                    </table>
                    <h4>8. Gallery - Lahan Kering</h4>
                    <table>
                        <tr v-for="(imageExp, imageExpIndex) in this.raw_data.photo_dry_land" :key="imageExp">
                            <td>
                                <img :src="imageExp" style="max-width: 100px;max-height: 50px;" />
                            </td>
                        </tr>
                    </table>
                    <h4>9. Gallery - Profil Desa</h4>
                    <table>
                        <tr>
                            <td>
                                <img :src="this.raw_data.village_profile" style="max-width: 100px;max-height: 50px;" />
                            </td>
                        </tr>
                    </table>
                </div>
                <!-- Polygon Data -->
                <v-row class="ma-0 mx-2">
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-vector-polygon-variant</v-icon>Polygon Data</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <DetailModalMap v-if="showModal == true" :data="map.data" :key="map.key" />
                    </v-col>
                </v-row>
                <!-- data -->
                <div 
                    v-for="data in datas" 
                    :key="data.title">
                    <v-row class="ma-0 mx-2">
                        <v-col cols="12">
                            <div class="d-flex align-center">
                                <p class="mb-0 grey--text text--darken-3"><v-icon color="grey darken-3" class="mr-2">{{ data.icon }}</v-icon>{{ data.title }}</p>
                                <v-divider class="mx-2" color="black"></v-divider>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row v-if="data.type == 'table'" class="ma-0 mx-2">
                        <v-data-table
                            hide-default-footer
                            :items-per-page="-1"
                            multi-sort
                            class="rounded-xl mx-4"
                            style="width: 100%;"
                            :headers="data.table.headers"
                            :items="data.table.items"
                        >
                            <template v-slot:item.no="{index}">
                                {{ index + 1 }}
                            </template>
                            <template v-slot:item.phone="{item}">
                                <v-tooltip top content-class="rounded-xl">
                                    Click here for calling
                                    <template v-slot:activator="{on, attrs}">
                                        <a :href="`tel:${item.phone}`" v-bind="attrs" v-on="on" style="text-decoration: none;" class="grey--text text--darken-3">
                                            <v-btn fab x-small color="grey darken-3 white--text" class="elevation-0 mr-1"><v-icon>mdi-phone</v-icon></v-btn>
                                        </a> 
                                    </template>
                                </v-tooltip>
                                {{ item.phone }}
                            </template>
                            <template v-slot:item.whatsapp="{item}">
                                <v-tooltip top content-class="rounded-xl">
                                    Click here for chat
                                    <template v-slot:activator="{on, attrs}">
                                        <a :href="`https://wa.me/${_utils.whatsappPhone(item.whatsapp)}`" target="_blank" v-bind="attrs" v-on="on" style="text-decoration: none;" class="grey--text text--darken-3">
                                            <v-btn fab x-small color="green white--text" class="elevation-0 mr-1"><v-icon>mdi-whatsapp</v-icon></v-btn>
                                        </a> 
                                    </template>
                                </v-tooltip>
                                {{ item.whatsapp }}
                            </template>
                        </v-data-table>
                    </v-row>
                    <v-row v-else class="ma-0 mx-4">
                        <v-col v-for="item in data.items" 
                            :key="item.key"
                            cols="12" :lg="item.lg" :md="item.md"
                        >
                            <v-card class="rounded-lg">
                                <v-card-title class="grey darken-3 white--text pa-1 px-3">
                                    <span style="font-size: 13px">
                                        <span v-if="item.labelIcon">
                                            <v-icon color="white" class="mr-1">{{ item.labelIcon }}</v-icon>
                                        </span>
                                        <span v-html="item.title"></span>
                                    </span>
                                </v-card-title>
                                <v-card-text class="pa-3">
                                    <h4>
                                        <span v-if="item.prependIcon">
                                            <v-icon color="grey darken-3" class="mr-1">{{ item.prependIcon }}</v-icon>
                                        </span>
                                        <v-progress-circular
                                            :size="17"
                                            :width="3"
                                            indeterminate
                                            v-if="loading.show"
                                        >
                                        </v-progress-circular>
                                        <span v-else>
                                            <span v-if="item.model">
                                                <span v-if="item.type == 'Multiple'">{{ item.model.replaceAll(',', ', ') }}</span>
                                                <span v-else-if="item.type == 'Date'">{{ _utils.dateFormat(item.model, 'DD MMMM YYYY') }}</span>
                                                <span v-else-if="item.type == 'Number'">{{ _utils.numberFormat(item.model) }}</span>
                                                <span v-else-if="item.type == 'Image'">
                                                    <v-card 
                                                        class="rounded-xl mt-2"
                                                    >
                                                        <v-img
                                                            height="293"
                                                            v-bind:src="item.model"
                                                            class="my-2 mb-0 rounded-xl cursor-pointer"
                                                            :key="imageKeyComponent"
                                                            id="photo1"
                                                            @click="showLightbox(item.model)"
                                                        ></v-img>
                                                    </v-card>
                                                </span>
                                                <span v-else-if="item.type == 'MultipleImage'">
                                                    <v-carousel 
                                                        cycle
                                                        height="300" 
                                                        show-arrows-on-hover
                                                        hide-delimiter-background
                                                        class="rounded-xl cursor-pointer"
                                                    >
                                                        <v-carousel-item v-for="(imgMltple, imgMltpleIndex) in item.model" :key="`image-${item.label}-${imgMltpleIndex}`">
                                                            <v-img
                                                                height="300"
                                                                v-bind:src="imgMltple"
                                                                @click="showLightbox(item.model, imgMltpleIndex)"
                                                                class="my-1 mb-4 rounded-xl cursor-pointer"
                                                            ></v-img>
                                                        </v-carousel-item>
                                                    </v-carousel>
                                                </span>
                                                <span v-else v-html="item.model"></span>
                                                <span v-if="item.suffix" v-html="item.suffix" class="ml-1"></span>
                                            </span>
                                            <span v-else>-</span>
                                        </span>
                                    </h4>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn v-if="verificationAccess && status_data == 'ready_to_submit'" rounded color="green" outlined class="pr-4" @click="() => confirmVerification('verify')"><v-icon class="mr-1">mdi-check-circle</v-icon> Verifikasi</v-btn>
                <v-btn v-if="verificationAccess && status_data == 'submit_review'" rounded color="red white--text" class="pr-4" @click="() => confirmVerification('unverif')"><v-icon class="mr-1">mdi-close-circle</v-icon> Unverifikasi</v-btn>
                <v-btn v-if="verificationAccess && status_data == 'submit_review'" rounded color="green" outlined class="pr-4" @click="() => exportReport()"><v-icon class="mr-1">mdi-microsoft-word</v-icon> Export</v-btn>
                <v-btn v-if="$store.state.User.role_name != 'GIS STAFF' && status_data == 'document_saving'" 
                    :disabled="emailToGis > 1"
                    rounded 
                    color="blue white--text" 
                    small 
                    @click="() => sendEmailToGIS(raw_data.data_no)"
                >
                    <v-icon class="mr-1">mdi-email-{{ emailToGis > 1 ? 'check' : 'arrow-right' }}</v-icon>
                    Email to GIS
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
import DetailModalMap from './DetailModalMap.vue'

export default {
    components: {
        LottieAnimation,
        DetailModalMap
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: '0'
        }
    },
    data: () => ({
        datas: [
            {
                title: 'Lokasi & Tanggal Scooping Visit',
                icon: 'mdi-city',
                type: 'column',
                items: [
                    {
                        key: 'province_name',
                        title: 'Provinsi',
                        model: null,
                        type: 'String',
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'city_name',
                        title: 'Kabupaten / Kota',
                        model: null,
                        type: 'String',
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'district_name',
                        title: 'Kecamatan',
                        model: null,
                        type: 'String',
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'village_name',
                        title: 'Desa',
                        model: null,
                        type: 'String',
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'start_scooping_date',
                        title: `Mulai Scooping`,
                        model: null,
                        type: 'Date',
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'end_scooping_date',
                        title: `Selesai Scooping`,
                        model: null,
                        type: 'Date',
                        lg: 4,
                        md: 6
                    },
                ]
            },
            {
                title: 'Scooping Data',
                icon: 'mdi-text-box',
                type: 'column',
                items: [
                    {
                        key: 'land_area',
                        title: 'Luas Desa',
                        model: null,
                        type: 'Number',
                        suffix: `Ha`,
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'accessibility',
                        title: 'Aksesibilitas',
                        model: null,
                        type: 'Multiple',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'water_source',
                        title: 'Sumber Air',
                        model: null,
                        type: 'Multiple',
                        lg: 6,
                        md: 12
                    },
                    {
                        key: 'electricity_source',
                        title: 'Sumber Listrik',
                        model: null,
                        type: 'Multiple',
                        lg: 6,
                        md: 12
                    },
                    {
                        key: 'government_place',
                        title: 'Tempat Pemerintahan',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                ]
            },
            {
                title: 'Data Populasi & Wilayah',
                icon: 'mdi-account-group',
                type: 'column',
                items: [
                    {
                        key: 'total_kk',
                        title: 'Total Keluarga (KK)',
                        prependIcon: 'mdi-human-male-female-child',
                        model: null,
                        type: 'Number',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'total_male',
                        title: 'Total Laki - Laki',
                        prependIcon: 'mdi-human-male',
                        model: null,
                        type: 'Number',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'total_female',
                        title: 'Total Perempuan',
                        prependIcon: 'mdi-human-female',
                        model: null,
                        type: 'Number',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'total_dusun',
                        title: 'Total Dusun',
                        prependIcon: 'mdi-home',
                        model: null,
                        type: 'Number',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'potential_dusun',
                        title: 'Dusun Berpotensi',
                        prependIcon: 'mdi-home-lightbulb',
                        model: null,
                        type: 'Number',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'potential_description',
                        title: 'Deskripsi Potensi',
                        labelIcon: 'mdi-note',
                        model: null,
                        type: 'Text',
                        lg: 12,
                        md: 12
                    },
                ]
            },
            {
                title: 'Kelengkapan Data Lahan Kering',
                icon: 'mdi-land-fields',
                type: 'column',
                items: [
                    {
                        key: 'dry_land_area',
                        title: 'Luas Lahan Kering',
                        model: null,
                        type: 'Number',
                        suffix: `Ha`,
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'land_type',
                        title: 'Jenis Tanah',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'land_height',
                        title: 'Ketinggian Tanah (mdpl)',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'land_slope',
                        title: 'Kelerengan Tanah (<sup>o</sup>)',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'vegetation_density',
                        title: 'Kerapatan Vegetasi',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'land_coverage',
                        title: 'Cakupan Lahan',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'agroforestry_type',
                        title: 'Pola Tanam Lahan Kering',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'rainfall',
                        title: 'Curah Hujan (mm)',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                ]
            },
            {
                title: 'Tokoh Desa',
                icon: 'mdi-account-cowboy-hat',
                type: 'table',
                key: 'scooping_figures',
                table: {
                    headers: [
                        {text: 'No', value: 'no', width: '75px'},
                        {text: 'Nama', value: 'name'},
                        {text: 'Jabatan', value: 'position'},
                        {text: 'No HP', value: 'phone'},
                        {text: 'Whatsapp', value: 'whatsapp'},
                    ],
                    items: []
                }
            },
            {
                title: 'Gallery',
                icon: 'mdi-image-multiple',
                type: 'column',
                items: [
                    {
                        key: 'photo_road_access',
                        title: 'Akses Jalan',
                        labelIcon: 'mdi-road-variant',
                        model: null,
                        type: 'MultipleImage',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'photo_meeting',
                        title: 'Dokumentasi Pertemuan',
                        prependIcon: '',
                        model: null,
                        type: 'MultipleImage',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'photo_dry_land',
                        title: 'Lahan Kering',
                        prependIcon: '',
                        model: null,
                        type: 'MultipleImage',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'village_profile',
                        title: 'Profil Desa',
                        prependIcon: '',
                        model: null,
                        type: 'Image',
                        lg: 6,
                        md: 6
                    },
                ]
            },
            // {
            //     title: 'Log',
            //     icon: 'mdi-clock',
            //     type: 'column',
            //     items: [
            //         {
            //             key: 'created_at',
            //             title: 'Waktu Dibuat',
            //             model: null,
            //             type: 'Time',
            //             lg: 6,
            //             md: 6
            //         },
            //         {
            //             key: 'user_id',
            //             title: 'Dibuat Oleh',
            //             model: null,
            //             type: 'Time',
            //             lg: 6,
            //             md: 6
            //         },
            //         {
            //             key: 'updated_at',
            //             title: 'Waktu Terakhir Dirubah',
            //             model: null,
            //             type: 'Time',
            //             lg: 6,
            //             md: 6
            //         },
            //         {
            //             key: 'updated_by',
            //             title: 'Terakhir Dirubah Oleh',
            //             model: null,
            //             type: 'Time',
            //             lg: 6,
            //             md: 6
            //         },
            //         {
            //             key: 'verified_at',
            //             title: 'Waktu Verifikasi',
            //             model: null,
            //             type: 'Time',
            //             lg: 6,
            //             md: 6
            //         },
            //         {
            //             key: 'verified_by',
            //             title: 'Diverifikasi Oleh',
            //             model: null,
            //             type: 'Time',
            //             lg: 6,
            //             md: 6
            //         },
            //     ]
            // }
        ],
        raw_data: {},
        imageKeyComponent: 71625327,
        verified_data: 0,
        status_data: '',
        emailToGis: 0,
        map: {
            key: 11101203,
            data: {
                village_polygon: null,
                dry_land_polygon: null,
            }
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
        word: '',
    }),
    computed: {
        showModal: {
            get: function () {
                if (this.show) {
                    if (this.id) this.getData(this.id)
                    setTimeout(() => {
                        this.map.key += 1
                    }, 100);
                }
                return this.show
            },
            set: function(newVal) {
                if (!newVal) this.$emit('action', {type: 'close', name: 'detail'})
            }
        },
        verificationAccess() {
            const user = this.$store.state.User
            const role_group = user.role_group
            const role_name = user.role_name
            if (role_group == 'IT') return true
            if (role_name == 'SOCIAL OFFICER') return true
            return false
        }
    },
    methods: {
        confirmVerification(type) {
            const url = type == 'verify' ? 'VerificationScooping' : 'UnverificationScooping'
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2e7d32',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Tidak Jadi',
                confirmButtonText: 'Ya, Lanjutkan!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.loading.show = true
                    this.loading.text = `${type == 'verify' ? 'Verifying' : 'Unverifying'} data...`
                    axios.post(this.$store.getters.getApiUrl(url), {data_no: this.id, verified_by: this.$store.state.User.email}, this.$store.state.apiConfig)
                    .then(res => {
                        Swal.fire({
                            title: 'Verified!',
                            text: `Scooping data #${this.id} has been verified.`,
                            icon: 'success',
                            confirmButtonColor: '#2e7d32',
                        })
                        this.getData(this.id)
                        this.$emit('action', {type: 'refresh-table'})
                    }).catch(err => {
                        this.errorResponse(err)
                        Swal.fire({
                            title: 'Failed!',
                            text: `Failed to proceed.`,
                            icon: 'error',
                            confirmButtonColor: '#f44336',
                        })
                    }).finally(() => {
                        this.loading.show = false
                        this.loading.text = 'Loading...'
                    })
                }
            })
        },
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
        exportReport() {
            const container = document.getElementById("containerForExport-ScoopingVisit");
            var vm = this, word = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <title>Export HTML to Word Document with JavaScript</title>
                </head>
                <body>
                    ${container.innerHTML}
                </body>
            </html>`;
            console.log(container.innerHTML)
            var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(word);
            var fileDownload = document.createElement("a");
            document.body.appendChild(fileDownload);
            fileDownload.href = source;
            fileDownload.download = 'Scooping Visit Export.doc';
            fileDownload.click();
            document.body.removeChild(fileDownload);

            // const wb = XLSX.utils.table_to_book(table);

            // /* Export to file (start a download) */
            // console.log(this.raw_data)
            // XLSX.writeFile(wb, `ExportScoopingVisit.xlsx`);
        },
        async getData(id) {
            try {
                this.loading.show = true
                this.loading.text = `Getting scooping ${this.id} data...`
                this.imageKeyComponent += 1
                const res = await axios.get(this.$store.getters.getApiUrl(`GetDetailScooping?data_no=${id}`), this.$store.state.apiConfig)
                const data = res.data.data.result
                this.raw_data = JSON.parse(JSON.stringify(data))
                this.raw_data.city_name = this.raw_data.city_name.toLowerCase()
                this.raw_data.district_name = this.raw_data.district_name.toLowerCase()
                this.raw_data.village_name = this.raw_data.village_name.toLowerCase()
                if (this.raw_data.photo_road_access) this.raw_data.photo_road_access = this.raw_data.photo_road_access.split(',').map(val => {return this.$store.state.apiUrlImage + val})
                if (this.raw_data.photo_dry_land) this.raw_data.photo_dry_land = this.raw_data.photo_dry_land.split(',').map(val => {return this.$store.state.apiUrlImage + val})
                if (this.raw_data.photo_meeting) this.raw_data.photo_meeting = this.raw_data.photo_meeting.split(',').map(val => {return this.$store.state.apiUrlImage + val})
                if (this.raw_data.village_profile) this.raw_data.village_profile = this.$store.state.apiUrlImage + this.raw_data.village_profile
                this.verified_data = data.is_verify
                this.status_data = data.status
                this.emailToGis = data.email_to_gis
                for (const [key, value] of Object.entries(data)) {
                    this.datas.forEach(localData => {
                        if (localData.type == 'table') {
                            if (localData.key == key) localData.table.items = value
                        } else {
                            const findData = localData.items.find(scopingData => scopingData.key === key)
                            if (findData) {
                                if (findData.type === 'Image') {
                                    if (value) findData.model = this.$store.state.apiUrlImage + value
                                    else findData.model = "/images/noimage.png"
                                } else if (findData.type === 'MultipleImage') {
                                    findData.model = ["/images/noimage.png"]
                                    if (value) findData.model = value.split(',').map(val => {return this.$store.state.apiUrlImage + val})
                                } else findData.model = value
                            }
                        }
                    });
                }
                this.map.data = {
                    village_polygon: data.village_polygon,
                    dry_land_polygon: data.dry_land_polygon
                }
            } catch (err) {
                this.errorResponse(err)
                this.$emit('action', {type: 'close', name: 'detail'})
            } finally {
                this.loading.show = false
            }
        },
        getStatusColumn(type, status) {
            if (type == 'bg_color') {
                if (status == 'document_saving') return 'yellow darken-1'
                if (status == 'ready_to_submit') return 'orange'
                if (status == 'submit_review') return 'green darken-1'
            }
            if (type == 'icon') {
                if (status == 'document_saving') return 'mdi-content-save'
                if (status == 'ready_to_submit') return 'mdi-content-save-check'
                if (status == 'submit_review') return 'mdi-check-circle'
            }
            if (type == 'text') {
                if (status == 'document_saving') return 'Disimpan'
                if (status == 'ready_to_submit') return 'Menunggu Verifikasi'
                if (status == 'submit_review') return 'Terverifikasi'
            }

            return ''
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
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        }
    }
}
</script>