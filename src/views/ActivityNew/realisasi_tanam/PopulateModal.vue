<template>
    <v-dialog v-model="isOpen" width="70%">
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title>
                    <span>Populate </span>
                </v-card-title>

                <v-card-text class="farmer-assign-wrapper mt-3">

                    <v-col lg="12">
                        <geko-input v-model="populateModalSwitch" :item="{
                            type: 'select',
                            label: 'Modul Populate Monitoring',
                            option: {
                                list_pointer: {
                                    label: 'label',
                                    code: 'code',
                                    display: ['label'],
                                },
                                default_options: [
                                    { label: 'Populate Untuk Monitoring 2', code: 0 },
                                    { label: 'Populate Untuk Monitoring 3 (Skip Mon2)', code: 1 },
                                    { label: 'Populate Untuk Monitoring 4 (Skip Mon2&3)', code: 2 },
                                ],
                            },
                        }" />

                    </v-col>


                    <geko-input v-model="exportBy" :item="{
                        type: 'select-radio',
                        label: 'Populate By',
                        validation: ['required'],
                        option: {
                            list_pointer: {
                                label: 'label',
                                code: 'code',
                                display: ['label'],
                            },
                            default_options: [
                                {
                                    label: 'Field Facilitator',
                                    code: 'ff',
                                },
                                {
                                    label: 'Unit Management',
                                    code: 'mu',
                                },
                                {
                                    label: 'Target Area',
                                    code: 'ta',
                                },
                                {
                                    label: 'Unique Case: Multiple Lahan',
                                    code: 'multiple_lahans',
                                },
                            ],
                        },
                    }" />

                    <!-- mu_no, target_area & ff_no -->
                    <div :class="exportBy === 'ff' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(onSubmit_new('ff'))" autocomplete="off">
                                <v-row>
                                    <v-col lg="12">
                                        <geko-input v-if="ffList.length > 0" v-model="ff_no" :item="{
                                            label: 'Field Facilitator',
                                            placeholder: 'Pilih Field Facilitator',
                                            type: 'select',
                                            validation: ['required'],
                                            api: 'GetFFAllWeb_new',
                                            param: {
                                                limit: 20,
                                            },
                                            option: {

                                                default_options: ffList,
                                                list_pointer: {
                                                    label: 'name',
                                                    code: 'ff_no',
                                                    display: ['name', 'ff_no'],
                                                },
                                            },
                                        }" @option:selected="test($event)" :disabled="ffList.length == 0" />
                                        <v-progress-circular v-if="ffList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-col>
                                            <h3>Total Pohon yang Akan Terpopulasi</h3>
                                        </v-col>
                                        <v-col lg="4" class="flex d-flex justify-center">
                                            <v-progress-circular :rotate="360" :size="200" :width="20"
                                                :value="percentageFormat(configFF.selected.reduce((acc, val) => { return acc + parseInt(val.total_hidup); }, 0), configFF.totalTrees)"
                                                :color="`${configFF.totalTrees == 0 ? 'red' : 'green'}`">
                                                <br>{{configFF.selected.reduce((acc, val) => {
                                                    return acc + parseInt(val.total_hidup);
                                                }, 0)}} / {{ configFF.totalTrees }}</br>
                                                <br>
                                                Persentase: {{percentageFormat(configFF.selected.reduce((acc, val) => {
                                                    return acc + parseInt(val.total_hidup);
                                                }, 0), configFF.totalTrees)}}%
                                                </br>
                                            </v-progress-circular>

                                        </v-col>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-data-table :headers="configFF.table.header" :items="configFF.allPopulateData"
                                            :server-items-length="configFF.totalRecord" :loading="loadingExportByFF"
                                            :items-per-page="configFF.perPage" class="elevation-1"
                                            @update:page="onChangePage" :page="configFF.page"
                                            @update:items-per-page="updatePerPage" :footer-props="{
                                                itemsPerPageText: 'Jumlah Data Per Halaman',
                                                itemsPerPageOptions: [10, 25, 50, 100, 200],
                                                showCurrentPage: true,
                                                showFirstLastPage: true,
                                            }" :show-select="true" v-model="configFF.selected">
                                            <template v-slot:item.index="{ index }">
                                                {{ index + 1 }}
                                            </template>
                                            <template v-slot:item.data-table-select="{ isSelected, select }">
                                                <v-simple-checkbox color="success" v-ripple :value="isSelected"
                                                    @input="select($event)"></v-simple-checkbox>
                                            </template>
                                        </v-data-table>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn :disabled="!configFF.selected.length" variant="success" type="submit">
                                            <v-icon v-if="!loadingExportByFF">mdi-file-tree</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Populate Data</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>
                    <div :class="exportBy === 'mu' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(onSubmit_new('mu'))" autocomplete="off">
                                <v-row>
                                    <v-col lg="12">
                                        <geko-input v-if="muList.length > 0" v-model="mu_no" :item="{
                                            label: 'Unit Management',
                                            placeholder: 'Pilih Unit Management',
                                            type: 'select',
                                            validation: ['required'],
                                            api: 'GetManagementUnitAdmin',
                                            param: {
                                                page: 1,
                                                per_page: 10,
                                            },
                                            option: {

                                                getterKey: 'data.result',
                                                default_options: muList,
                                                list_pointer: {
                                                    label: 'name',
                                                    code: 'mu_no',
                                                    display: ['name'],
                                                },
                                            },
                                        }" @option:selected="test2($event)" :disabled="muList.length == 0" />
                                        <v-progress-circular v-if="muList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-col>
                                            <h3>Total Pohon yang Akan Terpopulasi</h3>
                                        </v-col>
                                        <v-col lg="4" class="flex d-flex justify-center">
                                            <v-progress-circular :rotate="360" :size="200" :width="20"
                                                :value="percentageFormat(configMU.selected.reduce((acc, val) => { return acc + parseInt(val.total_hidup); }, 0), configMU.totalTrees)"
                                                :color="`${configMU.totalTrees == 0 ? 'red' : 'green'}`">
                                                <br>{{configMU.selected.reduce((acc, val) => {
                                                    return acc + parseInt(val.total_hidup);
                                                }, 0)}} / {{ configMU.totalTrees }}</br>
                                                <br>
                                                Persentase: {{percentageFormat(configMU.selected.reduce((acc, val) => {
                                                    return acc + parseInt(val.total_hidup);
                                                }, 0), configMU.totalTrees)}}%
                                                </br>
                                            </v-progress-circular>

                                        </v-col>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-data-table :headers="configMU.table.header" :items="configMU.allPopulateData"
                                            :server-items-length="configMU.totalRecord" :loading="loadingExportByMU"
                                            :items-per-page="configMU.perPage" class="elevation-1"
                                            @update:page="onChangePage" :page="configMU.page"
                                            @update:items-per-page="updatePerPage" :footer-props="{
                                                itemsPerPageText: 'Jumlah Data Per Halaman',
                                                itemsPerPageOptions: [10, 25, 50, 100, 200, 500, 10000],
                                                showCurrentPage: true,
                                                showFirstLastPage: true,
                                            }" :show-select="true" v-model="configMU.selected"
                                            :search="configMU.search">
                                            <template v-slot:top>
                                                <v-text-field v-model="configMU.search" append-icon="mdi-magnify"
                                                    color="green" label="Pencarian" hide-details outlined rounded dense
                                                    class="mr-2" @input="GetMUData()"></v-text-field>
                                            </template>
                                            <template v-slot:item.index="{ index }">
                                                {{ index + 1 }}
                                            </template>
                                            <template v-slot:item.data-table-select="{ isSelected, select }">
                                                <v-simple-checkbox color="success" v-ripple :value="isSelected"
                                                    @input="select($event)"></v-simple-checkbox>
                                            </template>
                                        </v-data-table>
                                    </v-col>


                                    <v-col lg="12">
                                        <v-btn :disabled="!configMU.selected.length" variant="success" type="submit">
                                            <v-icon v-if="!loadingExportByMU">mdi-file-tree</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Populate Data</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>
                    <div :class="exportBy === 'ta' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(onSubmit_new('ta'))" autocomplete="off">
                                <v-row>
                                    <v-col lg="12">
                                        <geko-input v-if="taList.length > 0" v-model="target_area" :item="{
                                            label: 'Target Area',
                                            placeholder: 'Pilih Target Area',
                                            type: 'select',
                                            validation: ['required'],
                                            api: 'GetManagementUnitAdmin',
                                            param: {
                                                page: 1,
                                                per_page: 10,
                                            },
                                            option: {

                                                getterKey: 'data.result',
                                                default_options: taList,
                                                list_pointer: {
                                                    label: 'name',
                                                    code: 'area_code',
                                                    display: ['name'],
                                                },
                                            },
                                        }" @option:selected="test2($event)" :disabled="taList.length == 0" />
                                        <v-progress-circular v-if="taList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-col>
                                            <h3>Total Pohon yang Akan Terpopulasi</h3>
                                        </v-col>
                                        <v-col lg="4" class="flex d-flex justify-center">
                                            <v-progress-circular :rotate="360" :size="200" :width="20"
                                                :value="percentageFormat(configTA.selected.reduce((acc, val) => { return acc + parseInt(val.total_hidup); }, 0), configTA.totalTrees)"
                                                :color="`${configTA.totalTrees == 0 ? 'red' : 'green'}`">
                                                <br>{{configTA.selected.reduce((acc, val) => {
                                                    return acc + parseInt(val.total_hidup);
                                                }, 0)}} / {{ configTA.totalTrees }}</br>
                                                <br>
                                                Persentase: {{percentageFormat(configTA.selected.reduce((acc, val) => {
                                                    return acc + parseInt(val.total_hidup);
                                                }, 0), configTA.totalTrees)}}%
                                                </br>
                                            </v-progress-circular>

                                        </v-col>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-data-table :headers="configTA.table.header" :items="configTA.allPopulateData"
                                            :server-items-length="configTA.totalRecord" :loading="loadingExportByTA"
                                            :items-per-page="configTA.perPage" class="elevation-1"
                                            @update:page="onChangePage" :page="configTA.page"
                                            @update:items-per-page="updatePerPage" :footer-props="{
                                                itemsPerPageText: 'Jumlah Data Per Halaman',
                                                itemsPerPageOptions: [10, 25, 50, 100, 200],
                                                showCurrentPage: true,
                                                showFirstLastPage: true,
                                            }" :show-select="true" v-model="configTA.selected"
                                            :search="configTA.search">
                                            <template v-slot:top>
                                                <v-text-field v-model="configMU.search" append-icon="mdi-magnify"
                                                    color="green" label="Pencarian" hide-details outlined rounded dense
                                                    class="mr-2" @input="GetTAData()"></v-text-field>
                                            </template>
                                            <template v-slot:item.index="{ index }">
                                                {{ index + 1 }}
                                            </template>
                                            <template v-slot:item.data-table-select="{ isSelected, select }">
                                                <v-simple-checkbox color="success" v-ripple :value="isSelected"
                                                    @input="select($event)"></v-simple-checkbox>
                                            </template>
                                        </v-data-table>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn :disabled="!configTA.selected.length" variant="success" type="submit">
                                            <v-icon v-if="!loadingExportByTA">mdi-file-tree</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Populate Data</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>
                    <div v-if="$store.state.tmpProgramYear == '2022'"
                        :class="exportBy === 'multiple_lahans' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(onSubmit_new('multiple_lahans'))" autocomplete="off">
                                <v-row>
                                    <v-col lg="12">
                                        <v-btn variant="info" @click="GetUniqueData()">
                                            <span class="ml-1"> Muat Data! </span>
                                        </v-btn>
                                    </v-col>
                                    <v-col lg="12">
                                        <v-col>
                                            <h3>Total Pohon yang Akan Terpopulasi</h3>
                                        </v-col>
                                        <v-col lg="4" class="flex d-flex justify-center">
                                            <v-progress-circular :rotate="360" :size="200" :width="20"
                                                :value="percentageFormat(config_multiple_lahans.selected.reduce((acc, val) => { return acc + parseInt(val.total_hidup); }, 0), config_multiple_lahans.totalTrees)"
                                                :color="`${config_multiple_lahans.totalTrees == 0 ? 'red' : 'green'}`">
                                                <br>{{config_multiple_lahans.selected.reduce((acc, val) => {
                                                    return acc + parseInt(val.total_hidup);
                                                }, 0)}} / {{ config_multiple_lahans.totalTrees }}</br>
                                                <br>
                                                Persentase:
                                                {{percentageFormat(config_multiple_lahans.selected.reduce((acc, val) => {
                                                    return acc + parseInt(val.total_hidup);
                                                }, 0), config_multiple_lahans.totalTrees)}}%
                                                </br>
                                            </v-progress-circular>

                                        </v-col>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-data-table :headers="config_multiple_lahans.table.header"
                                            :items="config_multiple_lahans.allPopulateData"
                                            :server-items-length="config_multiple_lahans.totalRecord"
                                            :loading="loadingExportByTA"
                                            :items-per-page="config_multiple_lahans.perPage" class="elevation-1"
                                            @update:page="onChangePage" :page="config_multiple_lahans.page"
                                            @update:items-per-page="updatePerPage" :footer-props="{
                                                itemsPerPageText: 'Jumlah Data Per Halaman',
                                                itemsPerPageOptions: [10, 25, 50, 100, 200],
                                                showCurrentPage: true,
                                                showFirstLastPage: true,
                                            }" :show-select="true" v-model="config_multiple_lahans.selected"
                                            :search="config_multiple_lahans.search">
                                            <template v-slot:top>
                                                <v-text-field v-model="config_multiple_lahans.search"
                                                    append-icon="mdi-magnify" color="green" label="Pencarian"
                                                    hide-details outlined rounded dense class="mr-2"
                                                    @input="GetUniqueData()"></v-text-field>
                                            </template>
                                            <template v-slot:item.index="{ index }">
                                                {{ index + 1 }}
                                            </template>
                                            <template v-slot:item.data-table-select="{ isSelected, select }">
                                                <v-simple-checkbox color="success" v-ripple :value="isSelected"
                                                    @input="select($event)"></v-simple-checkbox>
                                            </template>
                                        </v-data-table>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn :disabled="!config_multiple_lahans.selected.length" variant="success"
                                            type="submit">
                                            <v-icon v-if="!loadingExportBy_multiple_lahans">mdi-file-tree</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Populate Data</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>
                    <div>

                    </div>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2"

export default {
    name: "populate-modal",
    data() {
        return {
            ff_no: null,
            mu_no: null,
            target_area: null,
            multiple_lahans: null,
            isOpen: false,
            loading: false,
            // loadingCarbonExport: false,
            loadingExportByFF: false,
            loadingExportByTA: false,
            loadingExportByMU: false,
            currentFfName: "",
            exportBy: 'ff',
            ffList: [],
            muList: [],
            taList: [],
            exportData: [],
            configUrl: {
                // pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
                excel: `${this.$_config.baseUrlExport}export/penilikan-tanam/excel`,
            },
            loadingExportBy_multiple_lahans: false,
            loadingExportByTA: false,
            loadingExportByMU: false,
            loadingExportByFF: false,
            config_multiple_lahans: {
                allPopulateData: [],
                totalTrees: 0,
                search: '',
                totalRecord: 0,
                selected: [],
                perPage: 10,
                page: 1,
                table: {
                    header: [
                        {
                            key: "index",
                            sortable: false,
                            text: "No",
                            value: "index",
                        },
                        {
                            key: "managementunits_name",
                            sortable: false,
                            text: "MU",
                            value: "managementunits_name",
                        },
                        {
                            key: "target_areas_name",
                            sortable: false,
                            text: "TA",
                            value: "target_areas_name",
                        },
                        {
                            key: "field_facilitators_name",
                            sortable: false,
                            text: "FF",
                            value: "field_facilitators_name",
                        },
                        {
                            key: "farmers_name",
                            sortable: false,
                            text: "Petani",
                            value: "farmers_name",
                        },
                        {
                            key: "lahan_no",
                            sortable: false,
                            text: "No. Lahan",
                            value: "lahan_no",
                        },
                        {
                            key: "qty_std",
                            sortable: false,
                            text: "Bibit",
                            value: "qty_std",
                        }
                    ]
                }
            },
            configTA: {
                allPopulateData: [],
                totalTrees: 0,
                totalRecord: 0,
                selected: [],
                perPage: 10,
                search: '',
                page: 1,
                table: {
                    header: [
                        {
                            key: "index",
                            sortable: false,
                            text: "No",
                            value: "index",
                        },
                        {
                            key: "managementunits_name",
                            sortable: false,
                            text: "MU",
                            value: "managementunits_name",
                        },
                        {
                            key: "target_areas_name",
                            sortable: false,
                            text: "TA",
                            value: "target_areas_name",
                        },
                        {
                            key: "field_facilitators_name",
                            sortable: false,
                            text: "FF",
                            value: "field_facilitators_name",
                        },
                        {
                            key: "farmers_name",
                            sortable: false,
                            text: "Petani",
                            value: "farmers_name",
                        },
                        {
                            key: "lahan_no",
                            sortable: false,
                            text: "No. Lahan",
                            value: "lahan_no",
                        },
                        {
                            key: "qty_std",
                            sortable: false,
                            text: "Bibit",
                            value: "qty_std",
                        }
                    ]
                }
            },
            configMU: {
                allPopulateData: [],
                totalTrees: 0,
                totalRecord: 0,
                selected: [],
                perPage: 10,
                search: '',
                page: 1,
                table: {
                    header: [
                        {
                            key: "index",
                            sortable: false,
                            text: "No",
                            value: "index",
                        },
                        {
                            key: "managementunits_name",
                            sortable: false,
                            text: "MU",
                            value: "managementunits_name",
                        },
                        {
                            key: "target_areas_name",
                            sortable: false,
                            text: "TA",
                            value: "target_areas_name",
                        },
                        {
                            key: "field_facilitators_name",
                            sortable: false,
                            text: "FF",
                            value: "field_facilitators_name",
                        },
                        {
                            key: "farmers_name",
                            sortable: false,
                            text: "Petani",
                            value: "farmers_name",
                        },
                        {
                            key: "lahan_no",
                            sortable: false,
                            text: "No. Lahan",
                            value: "lahan_no",
                        },
                        {
                            key: "qty_std",
                            sortable: false,
                            text: "Bibit",
                            value: "qty_std",
                        }
                    ]
                }
            },
            configFF: {
                allPopulateData: [],
                totalTrees: 0,
                totalRecord: 0,
                selected: [],
                perPage: 10,
                page: 1,
                table: {
                    header: [
                        {
                            key: "index",
                            sortable: false,
                            text: "No",
                            value: "index",
                        },
                        {
                            key: "managementunits_name",
                            sortable: false,
                            text: "MU",
                            value: "managementunits_name",
                        },
                        {
                            key: "target_areas_name",
                            sortable: false,
                            text: "TA",
                            value: "target_areas_name",
                        },
                        {
                            key: "field_facilitators_name",
                            sortable: false,
                            text: "FF",
                            value: "field_facilitators_name",
                        },
                        {
                            key: "farmers_name",
                            sortable: false,
                            text: "Petani",
                            value: "farmers_name",
                        },
                        {
                            key: "lahan_no",
                            sortable: false,
                            text: "No. Lahan",
                            value: "lahan_no",
                        },
                        {
                            key: "qty_std",
                            sortable: false,
                            text: "Bibit",
                            value: "qty_std",
                        }
                    ]
                }
            },
            populateModalSwitch: 0,
            // populateSwitchItem: [
            //     { text: "Populate Untuk Monitoring 2", value: 0 },
            //     { text: "Populate Untuk Monitoring 3", value: 1 },
            //     { text: "Populate Untuk Monitoring 4", value: 2 },
            // ],
            populateDataSwitch: false,
        };
    },
    props: {
        dataKey: {
            required: false,
            default: false,
        },
    },

    watch: {
        dataKey(t) {
            if (t > 0) {

                this.getFFDataForExport()
                this.getUMDataForExport()
                this.getTADataForExport()
                this.isOpen = true;
            }

            // if (!t) {
            //     this.ff_no = null;
            // }
        },
        exportBy(t) {
            // this.getData()
        },
        mu_no(t) {
            this.GetMUData();
        },
        ff_no(t) {
            this.configFF.selected = [];
            this.configFF.allPopulateData = [];
            this.configFF.totalRecord = 0;
            this.loadingExportByFF = true;
            this.getData()
        },
        target_area(t) {
            this.GetTAData();
        },
        multiple_lahans(t) {
            this.GetUniqueData();
        }
    },

    // mounted() {
    //   this.getFFDataForExport()
    //   this.getUMDataForExport()
    // },

    methods: {
        GetTAData() {
            this.configTA.allPopulateData = [];
            this.configTA.totalRecord = 0;
            this.loadingExportByTA = true;
            this.page = 1;
            this.getData()
        },
        GetMUData() {
            this.configMU.allPopulateData = [];
            this.configMU.totalRecord = 0;
            this.loadingExportByMU = true;
            this.getData()
        },
        GetUniqueData() {
            this.config_multiple_lahans.allPopulateData = [];
            this.config_multiple_lahans.totalRecord = 0;
            this.loadingExportBy_multiple_lahans = true;
            this.page = 1;
            this.getData()
            // this.loadingExportBy_multiple_lahans = false;
        },

        async getData() {
            let payload = {
                program_year: this.$store.state.tmpProgramYear,
                limit: 10,
                offset: 0,
                typegetdata: 'all'
            }
            if (this.$store.state.tmpProgramYear == '2022' && this.exportBy == 'multiple_lahans') {
                payload = {
                    ...payload,
                    'program_year': '2022',
                    'multiple_lahans': 1,
                    'limit': this.config_multiple_lahans.perPage,
                    'offset': this.config_multiple_lahans.perPage * (this.config_multiple_lahans.page - 1),
                    'search_value': this.config_multiple_lahans.search
                }
            } else if (this.exportBy == 'ta') {
                payload = {
                    ...payload,
                    'target_area': this.target_area,
                    'limit': this.configTA.perPage,
                    'offset': this.configTA.perPage * (this.configTA.page - 1),
                    'search_value': this.configTA.search
                };
            } else if (this.exportBy == 'mu') {
                payload = {
                    ...payload,
                    'mu_no': this.mu_no,
                    'limit': this.configMU.perPage,
                    'offset': this.configMU.perPage * (this.configMU.page - 1),
                    'search_value': this.configMU.search
                };
            } else if (this.exportBy == 'ff') {
                payload = {
                    ...payload,
                    'ff_no': this.ff_no,
                    'limit': this.configFF.perPage,
                    'offset': this.configFF.perPage * (this.configFF.page - 1)
                };
            } else {
                return;
            }

            const result = await this.$_api.get("first-monitorings/main/options", payload);

            if (this.exportBy == 'multiple_lahans') {
                this.loadingExportBy_multiple_lahans = false;
                this.config_multiple_lahans.allPopulateData = result.result ?? [];
                this.config_multiple_lahans.totalRecord = result.total ?? 0;
                this.config_multiple_lahans.totalTrees = result.total_life_trees ?? 0;
            } else if (this.exportBy == 'ta') {
                this.loadingExportByTA = false;
                this.configTA.allPopulateData = result.result ?? [];
                this.configTA.totalRecord = result.total ?? 0;
                this.configTA.totalTrees = result.total_life_trees ?? 0;
            } else if (this.exportBy == 'mu') {
                this.loadingExportByMU = false;
                this.configMU.allPopulateData = result.result ?? [];
                this.configMU.totalRecord = result.total ?? 0;
                this.configMU.totalTrees = result.total_life_trees ?? 0;
                // const lahans = []
                // let lahan = []
                // this.configMU.selected = result.result.filter(data => {
                //     if (lahans.includes(data.lahan_no)) {
                //         lahan.push(data.lahan_no)
                //         return true
                //     } else {
                //         return false
                //     }
                // })
                // console.log(lahan.length, lahans.length)
                // lahans.filter(data => {
                //     if (lahan.includes(data)) {
                //         // lahan.push(data)
                //         return true
                //     } else {
                //         console.log('compare ', data)
                //         return false
                //     }
                // })
            } else if (this.exportBy == 'ff') {
                this.loadingExportByFF = false;
                this.configFF.allPopulateData = result.result ?? [];
                this.configff.totalTrees = result.total_life_trees ?? 0;
                this.configFF.totalRecord = result.total ?? 0;
            } else {
                return;
            }

        },
        onChangePage(t) {
            if (this.exportBy == 'multiple_lahans') {
                this.config_multiple_lahans.page = t;
                this.loadingExportByTA = true;
            } else if (this.exportBy == 'ta') {
                this.configTA.page = t;
                this.loadingExportByTA = true;
            } else if (this.exportBy == 'mu') {
                this.configMU.page = t;
                this.loadingExportByMU = true;
            } else if (this.exportBy == 'ff') {
                this.configFF.page = t;
                this.loadingExportByFF = true;
            } else {
                return;
            }
            this.getData()
        },
        updatePerPage($p) {
            if (this.exportBy == 'mmultiple_lahans') {
                this.config_multiple_lahans.perPage = $p;
                this.loadingExportBy_multiple_lahans = true;
            } else if (this.exportBy == 'ta') {
                this.configTA.perPage = $p;
                this.loadingExportByTA = true;
            } else if (this.exportBy == 'mu') {
                this.configMU.perPage = $p;
                this.loadingExportByMU = true;
            } else if (this.exportBy == 'ff') {
                this.configFF.perPage = $p;
                this.loadingExportByFF = true;
            } else {
                return;
            }
            this.getData()
        },
        async getFFDataForExport() {
            if (this.ffList.length > 0) return;
            const result = await this.$_api.get("GetFFAllWeb_new", {
                limit: 2147,
                offset: 0,
            });

            if (!Array.isArray(result.data)) return;

            for (const item of result.data) {
                item.name = `${item.name} - ${item.ff_no}`;
            }

            this.ffList = result.data;
        },
        async getUMDataForExport() {
            if (this.muList.length > 0) return;
            const result = await this.$_api.get("GetManagementUnitAdmin", {
                page: 1,
                per_page: 1000,
            });

            if (!Array.isArray(result.data.result)) return;

            for (const item of result.data.result) {
                item.name = `${item.name} - ${item.mu_no}`;
            }

            this.muList = result.data.result;
        },
        async getTADataForExport() {
            if (this.taList.length > 0) return;
            const result = await this.$_api.get("GetTargetAreaAdmin", {
                page: 1,
                program_year: this.$_config.programYear.model,
                per_page: 1000,
            });

            if (!Array.isArray(result.data.result)) return;

            for (const item of result.data.result) {
                item.name = `${item.name} - ${item.area_code}`;
            }

            this.taList = result.data.result;
        },
        // export data

        test2(data) {
            console.log("data", data);
        },
        async onSubmit_new(configType) {
            var configData = []
            if (configType == 'multiple_lahans') configData = this.config_multiple_lahans.selected
            else if (configType == 'ff') configData = this.configFF.selected
            else if (configType == 'mu') configData = this.configMU.selected
            else if (configType == 'ta') configData = this.configTA.selected
            console.log(configData)
            try {

                // const creating = await this.$_api.post('populate-monitoring/1-to-2/create', {
                //     list_monitoring1: configData,
                // })
                //     .catch(() => false)

                // if (!creating) {
                //     throw "err"
                // }

                // editanku
                let url = ''
                let alertText = ''
                if (this.populateModalSwitch == 0) {
                    url = 'AddMonitoring1Populate'
                    alertText = 'Untuk Monitoring 2'
                } else if (this.populateModalSwitch == 1) {
                    url = 'AddMonitoring1PopulateTo2'
                    alertText = 'Untuk Monitoring 3'
                } else if (this.populateModalSwitch == 2) {
                    url = 'AddMonitoring1PopulateTo3'
                    alertText = 'Untuk Monitoring 4'
                }

                const confirmation = await Swal.fire({
                    title: `Apa Anda Yakin Untuk Melakukan Populasi Data ${alertText}`,
                    text: "Proses Tidak Dapat Dikembalikan!",
                    icon: "warning",
                    color: "#000000",
                    confirmButtonColor: "#00FF4C",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Okay",
                    showCancelButton: true,
                });

                if (!confirmation.isConfirmed) {
                    return;
                }

                const creating = await this.$_api.post(url, {
                    list_monitoring1: configData,
                })
                    .catch(() => false)

                if (!creating) {
                    throw "err"
                }

                this.$_alert.success("Berhasil Melakukan Populasi Data Monitoring!")
                this.$emit('success', true)
                this.config_multiple_lahans.selected = []
                this.configFF.selected = []
                this.configMU.selected = []
                this.configTA.selected = []
                configData = []
            }

            catch (err) {
                console.log('err', err);
                this.loading = false

            }
            this.getData()
        },


        percentageFormat(partial, total) {
            return ((partial * 100) / total).toFixed(1);
        },
    },

    mounted() {
        // this.getInitialData();
    },
};
</script>