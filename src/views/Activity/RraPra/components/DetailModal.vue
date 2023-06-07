<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="1200"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-document</v-icon></v-btn> RRA PRA Form #{{ this.id }}</span>
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
                <div v-if="datas">
                    <!-- Global data -->
                    <v-row class="ma-0 mx-2 mx-lg-4">
                        <v-col cols="12" md="12" lg="7">
                            <v-card class="rounded-lg" data-aos="fade-down" :key="`location_card-${showModal}`">
                                <v-card-title class="grey darken-3 white--text pa-1 px-3">
                                    <span style="font-size: 13px">
                                        <v-icon color="white">mdi-map-marker</v-icon>
                                        Lokasi Desa
                                    </span>
                                </v-card-title>
                                <v-card-text class="pa-3">
                                    <v-row>
                                        <v-col cols="12" md="6" lg="3">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    Provinsi
                                                </span>
                                                <h4>
                                                    {{ datas.Scooping.province_name || '-' }}
                                                </h4>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" md="6" lg="3">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    Kabupaten
                                                </span>
                                                <h4>
                                                    {{ datas.Scooping.city_name || '-' }}
                                                </h4>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" md="6" lg="3">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    Kecamatan
                                                </span>
                                                <h4>
                                                    {{ datas.Scooping.district_name || '-' }}
                                                </h4>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" md="6" lg="3">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    Desa
                                                </span>
                                                <h4>
                                                    {{ datas.Scooping.village_name || '-' }}
                                                </h4>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="12" lg="5">
                            <v-card class="rounded-lg" data-aos="fade-down" :key="`date_period_card-${showModal}`">
                                <v-card-title class="grey darken-3 white--text pa-1 px-3">
                                    <span style="font-size: 13px">
                                        <v-icon color="white">mdi-calendar</v-icon>
                                        Tanggal RRA - PRA
                                    </span>
                                </v-card-title>
                                <v-card-text class="pa-3">
                                    <v-row>
                                        <v-col cols="12">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    {{ getIntervalDay(datas.RRA.rra_pra_date_start, datas.RRA.rra_pra_date_end) + 1 }} Hari
                                                </span>
                                                <h4>
                                                    {{ _utils.dateFormat(datas.RRA.rra_pra_date_start, 'DD MMMM YYYY') || '-' }}
                                                    <span v-if="datas.RRA.rra_pra_date_start != datas.RRA.rra_pra_date_end">
                                                        ~
                                                        {{ _utils.dateFormat(datas.RRA.rra_pra_date_end, 'DD MMMM YYYY') || '-' }}
                                                    </span>
                                                </h4>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <!-- Stepper -->
                    <v-stepper :vertical="localConfig.windowWidth < localConfig.breakLayoutFrom" v-model="stepper.model" class="rounded-xl mt-2 elevation-0">
                        <!-- Stepper Header -->
                        <v-stepper-header v-if="localConfig.windowWidth >= localConfig.breakLayoutFrom" class="elevation-0 mx-5">
                            <template v-for="(stepperName, stepperIndex) in stepper.steps">
                                <v-stepper-step
                                    :complete="stepper.model > stepperIndex + 1"
                                    :step="stepperIndex + 1"
                                    editable
                                    color="green"
                                    class="rounded-pill"
                                >
                                    <span>
                                        <v-icon :color="stepper.model > stepperIndex + 1 ? 'green' : ''" class="mr-1">mdi-{{ stepper.steps_icon[stepperIndex] }}</v-icon> 
                                        {{ stepperName }}
                                    </span>
                                </v-stepper-step>

                                <v-divider
                                    v-if="(stepperIndex + 1) !== stepper.steps.length"
                                    data-aos="fade-right"
                                    :data-aos-delay="200 * stepperIndex + 100"
                                    :key="(stepperIndex + 1)"
                                ></v-divider>
                            </template>
                        </v-stepper-header>
                        <!-- Stepper Content -->
                        <v-stepper-items>
                            <div v-for="(stepperName, stepperIndex) in stepper.steps">
                                <!-- RRA -->
                                <v-stepper-step v-if="localConfig.windowWidth < localConfig.breakLayoutFrom && stepper.steps.length >= 1" color="green" :complete="stepper.model > 1" :step="1" editable class="rounded-xl py-3 ma-1">
                                    <span><v-icon :color="stepper.model > (stepperIndex + 1) ? 'green' : ''" class="mr-1">mdi-{{ stepper.steps_icon[stepperIndex] }}</v-icon>{{ stepper.steps[stepperIndex] }}</span>
                                </v-stepper-step>
                                <v-stepper-content
                                    v-if="stepper.steps.length >= (stepperIndex + 1)"
                                    class="pt-0"
                                    :step="stepperIndex + 1"
                                >
                                    <v-card
                                        class="ma-1 rounded-xl"
                                        min-height="250px"
                                    >
                                        <v-card-text>
                                            <div v-for="(data, dataIndex) in groupingData[stepperName]">
                                                <div class="d-flex align-center my-8">
                                                    <p class="mb-0 grey--text text--darken-3" style="font-size: 17px"><v-icon class="mr-2">{{ data.labelIcon }}</v-icon>{{ data.label }}</p>
                                                    <v-divider class="mx-2" color=""></v-divider>
                                                </div>
                                                <!-- {{ datas[stepperName][data.dataKey] }} -->
                                                <!-- table -->
                                                <div v-if="data.dataType === 'table'">
                                                    <v-data-table
                                                        multi-sort
                                                        :hide-default-footer="data.table.hideDefaultFooter"
                                                        :headers="data.table.headers"
                                                        :items="datas[stepperName][data.dataKey]"
                                                        :items-per-page="data.table.itemsPerPage"
                                                        :class="`rounded-xl elevation-6 mx-2 mx-lg-3 pa-1 elevation-3 overflow-hidden`"
                                                        :show-expand="data.table.expand"
                                                    >
                                                        <!-- Table Index -->
                                                        <template v-slot:item.index="{index}">
                                                            {{ index + 1 }}
                                                        </template>
                                                        <!-- VillageBorder: point -->
                                                        <template v-slot:item.point="{item}">
                                                            {{ indonesianify(item.point) }}
                                                        </template>
                                                        <!-- Dusun: potential -->
                                                        <template v-slot:item.potential="{item}">
                                                            <v-chip :color="item.potential == 1 ? 'green' : 'red'" class="white--text pl-1">
                                                                <v-icon class="mr-1">mdi-{{ item.potential  == 1 ? 'check' : 'close' }}-circle</v-icon>
                                                                {{ item.potential == 1 ? 'Ya' : 'Tidak' }}
                                                            </v-chip>
                                                        </template>
                                                        <!-- Expand -->
                                                        <template v-slot:expanded-item="{ headers, item }">
                                                            <!-- ProductionMarketing -->
                                                            <td :colspan="headers.length" class="rounded-xl elevation-0" v-if="data.dataKey == 'ProductionMarketing'">
                                                                <v-row class="py-4">
                                                                    <v-col cols="12" md="6" lg="4" 
                                                                        :class="{'pa-1': true}"
                                                                    >
                                                                        <v-card class="rounded-xl">
                                                                            <v-card-text :class="{'text-center': true, 'pa-2': true}">
                                                                                <p class="mb-0 grey darken-3 white--text px-4 rounded-pill" style="font-size: 13px;">
                                                                                    <v-icon class="mr-1" color="white">mdi-account-tag</v-icon>
                                                                                    Customer
                                                                                </p>
                                                                                <h4 class="mb-0 pa-2">
                                                                                    <span>{{ item.customer || '-' }}</span>
                                                                                </h4>
                                                                            </v-card-text>
                                                                        </v-card>
                                                                    </v-col>
                                                                    <v-col cols="12" md="6" lg="4" 
                                                                        :class="{'pa-1': true}"
                                                                    >
                                                                        <v-card class="rounded-xl">
                                                                            <v-card-text :class="{'text-center': true, 'pa-2': true}">
                                                                                <p class="mb-0 grey darken-3 white--text px-4 rounded-pill" style="font-size: 13px;">
                                                                                    <v-icon class="mr-1" color="white">mdi-phone</v-icon>
                                                                                    Customer Phone
                                                                                </p>
                                                                                <h4 class="mb-0 pa-2">
                                                                                    <span>{{ item.phone || '-' }}</span>
                                                                                </h4>
                                                                            </v-card-text>
                                                                        </v-card>
                                                                    </v-col>
                                                                    <v-col cols="12" md="6" lg="4" 
                                                                        :class="{'pa-1': true}"
                                                                    >
                                                                        <v-card class="rounded-xl">
                                                                            <v-card-text :class="{'text-center': true, 'pa-2': true}">
                                                                                <p class="mb-0 grey darken-3 white--text px-4 rounded-pill" style="font-size: 13px;">
                                                                                    <v-icon class="mr-1" color="white">mdi-email</v-icon>
                                                                                    Customer Email
                                                                                </p>
                                                                                <h4 class="mb-0 pa-2">
                                                                                    <span>{{ item.email || '-' }}</span>
                                                                                </h4>
                                                                            </v-card-text>
                                                                        </v-card>
                                                                    </v-col>
                                                                    <v-col cols="12" :class="{'pa-1': true}"
                                                                    >
                                                                        <v-card class="rounded-xl">
                                                                            <v-card-text :class="{'text-center': false, 'pa-2': true}">
                                                                                <p class="mb-0 grey darken-3 white--text px-4 rounded-pill" style="font-size: 13px;">
                                                                                    <v-icon class="mr-1" color="white">mdi-note</v-icon>
                                                                                    Deskripsi
                                                                                </p>
                                                                                <h4 class="mb-0 pa-2">
                                                                                    <span>{{ item.description || '-' }}</span>
                                                                                </h4>
                                                                            </v-card-text>
                                                                        </v-card>
                                                                    </v-col>
                                                                </v-row>
                                                            </td>
                                                            <!-- Dusun -->
                                                            <td v-else-if="data.dataKey == 'Dusun'" :colspan="headers.length" class="rounded-xl elevation-0">
                                                                <div v-for="(exp, expIndex) in data.table.expandItem">
                                                                    <div class="d-flex align-center my-4">
                                                                        <p class="mb-0 grey--text text--darken-3" style="font-size: 17px"><v-icon class="mr-2">{{ exp.labelIcon }}</v-icon>{{ exp.label }}</p>
                                                                        <v-divider class="mx-2" color=""></v-divider>
                                                                    </div>
                                                                    <v-row class="mb-2">
                                                                        <v-col v-for="(itemExp, itemExpIndex) in exp.items" :key="`dusun-${item.dusun_name}-column-item-${exp.label}-${expIndex}-${itemExpIndex}`"
                                                                            :cols="itemExp.cols[0]" :sm="itemExp.cols[1]"  :md="itemExp.cols[2]"  :lg="itemExp.cols[3]"
                                                                            :class="{'pa-2': true}"
                                                                        >
                                                                            <v-card class="rounded-xl">
                                                                                <v-card-text :class="{'text-center': itemExp.centered, 'pa-2': true}">
                                                                                    <p class="mb-0 grey darken-3 white--text px-4 rounded-pill" style="font-size: 13px;">{{ itemExp.label }}</p>
                                                                                    <h4 class="mb-0 pa-2">
                                                                                        <span v-if="itemExp.dataType === 'number'">
                                                                                            {{ _utils.numberFormat(item[itemExp.dataKey]) }}
                                                                                        </span>
                                                                                        <span v-else-if="itemExp.dataKey === 'phone'">
                                                                                            <v-tooltip top content-class="rounded-xl">
                                                                                                Click here for call
                                                                                                <template v-slot:activator="{on, attrs}">
                                                                                                    <a :href="`tel:${item[itemExp.dataKey]}`" target="_blank" v-bind="attrs" v-on="on" style="text-decoration: none;" class="grey--text text--darken-3">
                                                                                                        <v-btn fab x-small color="grey darken-3 white--text" class="elevation-0 mr-1"><v-icon>mdi-phone</v-icon></v-btn>
                                                                                                    </a> 
                                                                                                </template>
                                                                                            </v-tooltip>
                                                                                            {{ item[itemExp.dataKey] }}
                                                                                        </span>
                                                                                        <span v-else-if="itemExp.dataKey === 'whatsapp'">
                                                                                            <v-tooltip top content-class="rounded-xl">
                                                                                                Click here for chat
                                                                                                <template v-slot:activator="{on, attrs}">
                                                                                                    <a :href="`https://wa.me/${_utils.whatsappPhone(item[itemExp.dataKey])}`" target="_blank" v-bind="attrs" v-on="on" style="text-decoration: none;" class="grey--text text--darken-3">
                                                                                                        <v-btn fab x-small color="green white--text" class="elevation-0 mr-1"><v-icon>mdi-whatsapp</v-icon></v-btn>
                                                                                                    </a> 
                                                                                                </template>
                                                                                            </v-tooltip>
                                                                                            {{ item[itemExp.dataKey] }}
                                                                                        </span>
                                                                                        <span v-else>
                                                                                            {{ item[itemExp.dataKey] }}
                                                                                        </span>
                                                                                        <span v-if="itemExp.suffix" class="ml-0" v-html="itemExp.suffix"></span>
                                                                                    </h4>
                                                                                </v-card-text>
                                                                            </v-card>
                                                                        </v-col>
                                                                    </v-row>
                                                                </div>
                                                            </td>
                                                        </template>
                                                    </v-data-table>
                                                    <v-card v-if="data.description" class="rounded-xl mx-2 mx-lg-3 mt-2">
                                                        <v-card-text>
                                                            <p class="mb-0 grey darken-3 white--text px-4 rounded-pill" style="font-size: 13px;">
                                                                <v-icon color="white">mdi-text-box</v-icon>
                                                                Deskripsi {{ data.label }}
                                                            </p>
                                                            <p class="mb-0 pa-2" v-html="datas[stepperName][data.descriptionKey]"></p>
                                                        </v-card-text>
                                                    </v-card>
                                                </div>
                                                <!-- column -->
                                                <div v-if="data.dataType === 'column'">
                                                    <v-row>
                                                        <v-col v-for="(item, itemIndex) in data.items" :key="`column-item-${data.label}-${itemIndex}`"
                                                            :cols="item.cols[0]" :sm="item.cols[1]"  :md="item.cols[2]"  :lg="item.cols[3]"
                                                            :class="{'pa-2': item.dense}"
                                                        >
                                                            <v-card class="rounded-xl">
                                                                <v-card-text :class="{'text-center': item.centered, 'pa-2': true}">
                                                                    <p class="mb-0 grey darken-3 white--text px-4 rounded-pill" style="font-size: 13px;">{{ item.label }}</p>
                                                                    <h4 class="mb-0 pa-2">
                                                                        <span v-if="item.dataType === 'number'">
                                                                            {{ _utils.numberFormat(datas[item.dataSource || stepperName][item.dataKey]) }}
                                                                        </span><span v-else>{{ datas[item.dataSource || stepperName][item.dataKey] }}</span>
                                                                        <span v-if="item.suffix" v-html="item.suffix"></span>
                                                                    </h4>
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-stepper-content>
                            </div>
                        </v-stepper-items>
                    </v-stepper>
                </div>
            </v-card-text>
            <v-card-actions class="justify-center" v-if="verificationAccess">
                <v-btn v-if="verified_data == 0" rounded color="green" outlined class="pr-4" @click="() => confirmVerification('verify')"><v-icon class="mr-1">mdi-check-circle</v-icon> Verifikasi</v-btn>
                <v-btn v-if="verified_data == 1" rounded color="red" outlined class="pr-4" @click="() => confirmVerification('unverif')"><v-icon class="mr-1">mdi-close-circle</v-icon> Unverifikasi</v-btn>
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
        LottieAnimation,
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
        datas: null,
        groupingData: {
            RRA: [
                {
                    label: 'Batas Wilayah',
                    labelIcon: 'mdi-compass-rose',
                    dataType: 'table',
                    dataKey: 'VillageBorder',
                    table: {
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'Arah', value: 'point'},
                            {text: 'Kabupaten', value: 'kabupaten_no'},
                            {text: 'Kecamatan', value: 'kode_kecamatan'},
                            {text: 'Desa', value: 'kode_desa'},
                        ]
                    }
                },
                {
                    label: 'Landscape Desa',
                    labelIcon: 'mdi-home',
                    dataType: 'column',
                    items: [
                        {
                            centered: true,
                            cols: [12,12,12,12],
                            dataKey: 'land_area',
                            dataSource: 'Scooping',
                            dataType: 'number',
                            dense: true,
                            label: 'Luas Desa',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'tanah_sawah',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Tanah Sawah',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'tegal_ladang',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Tegal / Ladang',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'pemukiman',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Pemukiman',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'pekarangan',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Pekarangan',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'tanah_rawa',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Tanah Rawa',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'waduk_danau',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Situ / Waduk / Danau',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'tanah_perkebunan_rakyat',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Tanah Perkebunan Rakyat',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'tanah_perkebunan_negara',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Tanah Perkebunan Negara',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'tanah_perkebunan_swasta',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Tanah Perkebunan Swasta',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'hutan_lindung',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Hutan Lindung',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'hutan_rakyat',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Hutan Rakyat',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: true,
                            cols: [12,6,4,3],
                            dataKey: 'fasilitas_umum',
                            dataSource: null,
                            dataType: 'number',
                            dense: true,
                            label: 'Fasilitas Umum',
                            labelIcon: '',
                            prefix: '',
                            suffix: 'Ha',
                        },
                        {
                            centered: false,
                            cols: [12,12,12,12],
                            dataKey: 'lahan_menurut_masyarakat',
                            dataSource: null,
                            dataType: 'text',
                            dense: true,
                            label: 'Lahan Menurut Masyarakat',
                            labelIcon: '',
                            prefix: '',
                            suffix: '',
                        },
                    ]
                },
                {
                    label: 'Pola Pemanfaatan Lahan',
                    labelIcon: 'mdi-land-fields',
                    dataType: 'table',
                    dataKey: 'LandUse',
                    table: {
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'No', value: 'index', width: 70, sortable: false},
                            {text: 'Pola', value: 'pattern'},
                            {text: 'Tanaman', value: 'plant'},
                        ]
                    }
                },
                {
                    label: 'Kelembagaan Masyarakat',
                    labelIcon: 'mdi-account-cowboy-hat',
                    dataType: 'table',
                    dataKey: 'CommunityInstitution',
                    table: {
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'No', value: 'index', width: 70, sortable: false},
                            {text: 'Nama Lembaga', value: 'institution_name'},
                            {text: 'Peran', value: 'role'},
                            {text: 'Description', value: 'description'},
                        ]
                    }
                },
                {
                    label: 'Potensi Pertanian Organik',
                    labelIcon: 'mdi-barn',
                    dataType: 'table',
                    dataKey: 'OrganicPotential',
                    table: {
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'No', value: 'index', width: 70, sortable: false},
                            {text: 'Nama', value: 'name'},
                            {text: 'Kategori', value: 'potential_category'},
                            {text: 'Sumber', value: 'source'},
                            {text: 'Description', value: 'description'},
                        ]
                    }
                },
                {
                    label: 'Pemasaran Hasil Produksi',
                    labelIcon: 'mdi-store',
                    dataType: 'table',
                    dataKey: 'ProductionMarketing',
                    table: {
                        expand: true,
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'No', value: 'index', width: 70, sortable: false},
                            {text: 'Nama', value: 'commodity_name'},
                            {text: 'Kapasitas (kg)', value: 'capacity'},
                            {text: 'Metode', value: 'method'},
                            {text: 'Periode Pemasaran', value: 'period'},
                            { text: 'Detail', value: 'data-table-expand' },
                        ]
                    }
                },
                {
                    label: 'Identifikasi Petani Inovatif',
                    labelIcon: 'mdi-account-star',
                    dataType: 'table',
                    dataKey: 'InnovativeFarmer',
                    table: {
                        expand: false,
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'No', value: 'index', width: 70, sortable: false},
                            {text: 'Nama', value: 'farmer_name'},
                            {text: 'Spesialisasi', value: 'specialitation'},
                            {text: 'Potensial', value: 'potential'},
                            {text: 'Description', value: 'description'},
                        ]
                    }
                },
                {
                    label: 'List Dusun',
                    labelIcon: 'mdi-home-group',
                    dataType: 'table',
                    dataKey: 'Dusun',
                    table: {
                        expand: true,
                        expandItem: [
                            {
                                label: 'General data',
                                labelIcon: 'mdi-list-box',
                                items: [
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'land_area',
                                        dataType: 'number',
                                        label: 'Luas Dusun',
                                        labelIcon: null,
                                        suffix: `m<sup>2</sup>`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'accessibility',
                                        dataType: 'text',
                                        label: 'Aksesibilitas',
                                        labelIcon: null,
                                        suffix: null,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'dry_land_area',
                                        dataType: 'number',
                                        label: 'Luas Lahan Kritis',
                                        labelIcon: null,
                                        suffix: `m<sup>2</sup>`,
                                    },
                                ]
                            },
                            {
                                label: 'PIC Dusun',
                                labelIcon: 'mdi-account-tag',
                                items: [
                                    {
                                        cols: [12,12,6,6],
                                        dataKey: 'pic_dusun',
                                        dataType: 'text',
                                        label: 'Nama',
                                        labelIcon: null,
                                        suffix: null,
                                    },
                                    {
                                        cols: [12,12,6,6],
                                        dataKey: 'position',
                                        dataType: 'text',
                                        label: 'Jabatan',
                                        labelIcon: null,
                                        suffix: null,
                                    },
                                    {
                                        cols: [12,12,6,6],
                                        dataKey: 'phone',
                                        dataType: 'text',
                                        label: 'No HP',
                                        labelIcon: `mdi-phone`,
                                        suffix: null,
                                    },
                                    {
                                        cols: [12,12,6,6],
                                        dataKey: 'whatsapp',
                                        dataType: 'text',
                                        label: 'Whatsapp',
                                        labelIcon: `mdi-whatsapp`,
                                        suffix: null,
                                    },
                                ]
                            },
                            {
                                label: 'Data Populasi',
                                labelIcon: 'mdi-human-male-female-child',
                                items: [
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'total_rw',
                                        dataType: 'number',
                                        label: 'Total RW',
                                        labelIcon: null,
                                        suffix: `RW`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'total_rt',
                                        dataType: 'number',
                                        label: 'Total RT',
                                        labelIcon: null,
                                        suffix: `RW`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'total_male',
                                        dataType: 'number',
                                        label: 'Total Laki - Laki',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'total_female',
                                        dataType: 'number',
                                        label: 'Total Perempuan',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'total_kk',
                                        dataType: 'number',
                                        label: 'Total Keluarga (KK)',
                                        labelIcon: null,
                                        suffix: `KK`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'total_farmer_family',
                                        dataType: 'number',
                                        label: 'Total Keluarga Petani (KK)',
                                        labelIcon: null,
                                        suffix: `KK`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'average_family_member',
                                        dataType: 'number',
                                        label: 'Rata - Rata Anggota Keluarga',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'average_farmer_family_member',
                                        dataType: 'number',
                                        label: 'Rata - Rata Anggota Keluarga Petani',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                ]
                            },
                            {
                                label: 'Data Edukasi',
                                labelIcon: 'mdi-book-education',
                                items: [
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'education_elementary_junior_hs',
                                        dataType: 'number',
                                        label: 'SD - SMP',
                                        labelIcon: 'mdi-bus-school',
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'education_senior_hs',
                                        dataType: 'number',
                                        label: 'SMA',
                                        labelIcon: 'mdi-school',
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'education_college',
                                        dataType: 'number',
                                        label: 'Kuliah',
                                        labelIcon: 'mdi-account-school',
                                        suffix: `orang`,
                                    },
                                ]
                            },
                            {
                                label: 'Produktifitas',
                                labelIcon: 'mdi-book-education',
                                items: [
                                    {
                                        cols: [12,6,6,6],
                                        dataKey: 'age_productive',
                                        dataType: 'number',
                                        label: 'Produktif',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,6],
                                        dataKey: 'age_non_productive',
                                        dataType: 'number',
                                        label: 'Tidak Produktif',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                ]
                            },
                            {
                                label: 'Mata Pencaharian Masyarakat',
                                labelIcon: 'mdi-book-education',
                                items: [
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'job_farmer',
                                        dataType: 'number',
                                        label: 'Petani',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'job_farm_workers',
                                        dataType: 'number',
                                        label: 'Buruh Tani',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'job_private_employee',
                                        dataType: 'number',
                                        label: 'Karyawan Swasta',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'job_state_employee',
                                        dataType: 'number',
                                        label: 'ASN (Guru, TNI, Polri)',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'job_enterpreneur',
                                        dataType: 'number',
                                        label: 'Wiraswasta',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                    {
                                        cols: [12,6,6,4],
                                        dataKey: 'job_others',
                                        dataType: 'number',
                                        label: 'Profesi Lain',
                                        labelIcon: null,
                                        suffix: `orang`,
                                    },
                                ]
                            },
                        ],
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'No', value: 'index', width: 70, sortable: false},
                            {text: 'Nama', value: 'dusun_name'},
                            {text: 'Jumlah Keluarga (KK)', value: 'total_kk'},
                            {text: 'Potensi', value: 'potential', align: 'center'},
                            { text: 'Detail', value: 'data-table-expand' },
                        ]
                    }
                },
            ],
            PRA: [
                {
                    label: 'Kepemilikan Lahan',
                    labelIcon: 'mdi-account-tag',
                    dataType: 'table',
                    dataKey: 'LandOwnership',
                    description: true,
                    descriptionKey: `land_ownership_description`,
                    table: {
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'No', value: 'index', width: 70, sortable: false},
                        ]
                    }
                },
                {
                    label: 'Penyebaran Lokasi Lahan Kering / Kritis',
                    labelIcon: 'mdi-account-tag',
                    dataType: 'table',
                    dataKey: 'LandOwnership',
                    description: true,
                    descriptionKey: `land_ownership_description`,
                    table: {
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'No', value: 'index', width: 70, sortable: false},
                        ]
                    }
                },
            ]
        },
        verified_data: 0,
        loading: {
            show: false,
            text: 'Loading...'
        },
        localConfig: {
            windowWidth: window.innerWidth,
            breakLayoutFrom: 1140,
            maxSubDataTotal: 5,
            requiredInputIcon: 'mdi-star'
        },
        lottie: {
            data: {
                loading: treeAnimation,
            }
        },
        stepper: {
            model: 1,
            steps: ['RRA', 'PRA'],
            steps_icon: ['home-group', 'home-analytics']
        },
    }),
    computed: {
        showModal: {
            get: function () {
                if (this.show) {
                    if (this.id) this.getData(this.id)
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
    watch: {
        'stepper.model': {
            handler(val) {
                console.log(val)
            }
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
                    if (error.response.status === 500 || error.response.status === 400) {
                        let errMessage = error.response.data.message
                        if (errMessage) if (errMessage.includes("Duplicate entry")) errMessage = 'Data sudah ada!' 
                        Swal.fire({
                            title: 'Error!',
                            text: `${errMessage || error.message}`,
                            icon: 'error',
                            confirmButtonColor: '#f44336',
                        })
                    }
                }
            }
        },
        async getData(id) {
            try {
                this.loading.show = true
                this.loading.text = `Getting Form "${this.id}" data...`
                this.imageKeyComponent += 1
                const res = await axios.get(this.$store.getters.getApiUrl(`GetDetailRraPra?form_no=${id}`), this.$store.state.apiConfig)
                this.datas = res.data.data.result
                for (const [key, val] of Object.entries(this.datas)) {
                }
                this.stepper.model = 2
                console.log(this.datas)
            } catch (err) {
                this.errorResponse(err)
                this.$emit('action', {type: 'close', name: 'detail'})
            } finally {
                this.loading.show = false
            }
        },
        getIntervalDay(start, end) {
            const startDate = moment(start);
            const endDate = moment(end);

            const duration = moment.duration(endDate.diff(startDate));
            const days = duration.asDays();
            return days
        },
        indonesianify(eng) {
            if (eng === 'north') return 'Utara'
            if (eng === 'east') return 'Timur'
            if (eng === 'south') return 'Selatan'
            if (eng === 'west') return 'Barat'

            return '??'
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        },
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        },
        whatsappPhone(no) {
            return no.replace(/^0/, "62");
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
    }
}
</script>