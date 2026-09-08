<template>
    <v-dialog v-model="isOpen" width="50%">
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title>
                    <span>Export Petani</span>
                </v-card-title>

                <v-card-text class="farmer-assign-wrapper mt-3">

                    <geko-input v-model="exportBy" :item="{
                        type: 'select-radio',
                        label: 'Export By',
                        validation: ['required'],
                        option: {
                            list_pointer: {
                                label: 'label',
                                code: 'code',
                                display: ['label'],
                            },
                            default_options: [
                                {
                                    label: 'Management Unit',
                                    code: 'mu',
                                },
                                {
                                    label: 'Field Coordinator',
                                    code: 'fc',
                                },
                                {
                                    label: 'Unit Manager',
                                    code: 'um',
                                },
                                {
                                    label: 'Field Facilitator',
                                    code: 'ff',
                                },
                            ],
                        },
                    }" />

                    <!-- mu_no, target_area & ff_no -->
                    <div :class="exportBy === 'mu' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(() => onSubmitExport('mu'))" autocomplete="off">
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
                                                multiple: true,
                                                getterKey: 'data.result',
                                                default_options: muList,
                                                list_pointer: {
                                                    label: 'name',
                                                    code: 'mu_no',
                                                    display: ['name'],
                                                },
                                            },
                                        }" @option:selected="test2($event)" :disabled="loading || loadingExport" />
                                        <v-progress-circular v-if="muList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="danger" type="submit" v-if="format == 'pdf'"
                                            :disabled="loading || loadingExport">
                                            <v-icon v-if="!loadingExport">mdi-file-pdf-box</v-icon>

                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export PDF</span>
                                        </v-btn>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="success" type="submit" v-if="format == 'excel'"
                                            :disabled="loading || loadingExport">
                                            <v-icon v-if="!loadingExport">mdi-microsoft-excel</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export Excel</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>
                    <div :class="exportBy === 'fc' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(() => onSubmitExport('fc'))" autocomplete="off">
                                <v-row>
                                    <v-col lg="12">
                                        <geko-input v-if="fcList.length > 0" v-model="employee_no_fc" :item="{
                                            label: 'Field Coordinator',
                                            placeholder: 'Pilih Field Coordinator',
                                            type: 'select',
                                            validation: ['required'],
                                            api: 'getEmployeeList_new',
                                            param: {
                                                page: 1,
                                                per_page: 10,
                                                position_no: 19,
                                            },
                                            option: {
                                                multiple: true,
                                                getterKey: 'data.result',
                                                default_options: fcList,
                                                list_pointer: {
                                                    label: 'name',
                                                    code: 'nik',
                                                    display: ['name'],
                                                },
                                            },
                                        }" @option:selected="test2($event)" :disabled="loading || loadingExport" />
                                        <v-progress-circular v-if="fcList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="danger" type="submit" v-if="format == 'pdf'"
                                            :disabled="loading || loadingExport">
                                            <v-icon v-if="!loadingExport">mdi-file-pdf-box</v-icon>

                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export PDF</span>
                                        </v-btn>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="success" type="submit" v-if="format == 'excel'"
                                            :disabled="loading || loadingExport">
                                            <v-icon v-if="!loadingExport">mdi-microsoft-excel</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export Excel</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>
                    <div :class="exportBy === 'um' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(() => onSubmitExport('um'))" autocomplete="off">
                                <v-row>
                                    <v-col lg="12">
                                        <geko-input v-if="umList.length > 0" v-model="employee_no_um" :item="{
                                            label: 'Unit Manager',
                                            placeholder: 'Pilih Unit Manager',
                                            type: 'select',
                                            validation: ['required'],
                                            api: 'GetManagementUnitAdmin',
                                            param: {
                                                page: 1,
                                                per_page: 10,
                                            },
                                            option: {
                                                multiple: true,
                                                getterKey: 'data.result',
                                                default_options: umList,
                                                list_pointer: {
                                                    label: 'name',
                                                    code: 'nik',
                                                    display: ['name'],
                                                },
                                            },
                                        }" @option:selected="test2($event)" :disabled="loading || loadingExport" />
                                        <v-progress-circular v-if="umList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="danger" type="submit" v-if="format == 'pdf'"
                                            :disabled="loading || loadingExport">
                                            <v-icon v-if="!loadingExport">mdi-file-pdf-box</v-icon>

                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export PDF</span>
                                        </v-btn>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="success" type="submit" v-if="format == 'excel'"
                                            :disabled="loading || loadingExport">
                                            <v-icon v-if="!loadingExport">mdi-microsoft-excel</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export Excel</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>
                    <div :class="exportBy === 'ff' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(() => onSubmitExport('ff'))" autocomplete="off">
                                <v-row>
                                    <v-col lg="12">
                                        <geko-input v-if="ffList.length > 0" v-model="employee_no_ff" :item="{
                                            label: 'Field Facilitator',
                                            placeholder: 'Pilih Field Facilitator',
                                            type: 'select',
                                            validation: ['required'],
                                            api: 'GetFFAllWeb_new',
                                            param: {
                                                page: 1,
                                                per_page: 10,
                                            },
                                            option: {
                                                multiple: true,
                                                getterKey: 'data.data',
                                                default_options: ffList,
                                                list_pointer: {
                                                    label: 'name',
                                                    code: 'ff_no',
                                                    display: ['name', 'ff_no'],
                                                },
                                            },
                                        }" @option:selected="test2($event)" :disabled="loading || loadingExport" />
                                        <v-progress-circular v-if="ffList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="danger" type="submit" v-if="format == 'pdf'"
                                            :disabled="loading || loadingExport">
                                            <v-icon v-if="!loadingExport">mdi-file-pdf-box</v-icon>

                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export PDF</span>
                                        </v-btn>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="success" type="submit" v-if="format == 'excel'"
                                            :disabled="loading || loadingExport">
                                            <v-icon v-if="!loadingExport">mdi-microsoft-excel</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export Excel</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>

                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
    name: "lahan-export-modal",
    data() {
        return {
            employee_no_um: null,
            employee_no_fc: null,
            mu_no: null,
            target_area: null,
            isOpen: false,
            loading: false,
            // loadingCarbonExport: false,
            loadingExport: false,
            currentFfName: "",
            exportBy: 'mu',
            fcList: [],
            muList: [],
            umList: [],
            ffList: [],
            employee_no_ff: null,
            exportData: [],
            configUrl: {
                pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
                excel: `${this.$_config.baseUrlExport}export/farmers/excel`,
            }
        };
    },
    props: {
        dataKey: {
            required: false,
            default: false,
        },
        format: {
            required: true,
        },
    },

    watch: {
        dataKey(t) {
            if (t > 0) {
                // this.getInitialData()
                this.getFCDataForExport()
                this.getUMDataForExport()
                this.getMUDataForExport()
                this.getFFDataForExport()
                this.isOpen = true;
            }

            if (!t) {
                this.nik = null;
            }
        },
    },

    // mounted() {
    //   this.getFFDataForExport()
    //   this.getUMDataForExport()
    // },

    methods: {
        test(data) {
            console.log("data", data);
        },
        test2(data) {
            console.log("data", data);
        },

        async getFCDataForExport() {
            if (this.fcList.length > 0) return;
            const result = await this.$_api.get("getEmployeeList_new", {
                limit: 2147,
                offset: 0,
                position_no: 19,
                program_year: this.$store.state.tmpProgramYear,
            });

            if (!Array.isArray(result.data)) return;

            for (const item of result.data) {
                item.name = `${item.name}`;
            }

            this.fcList = result.data;
        },
        async getUMDataForExport() {
            if (this.umList.length > 0) return;
            const result = await this.$_api.get("getEmployeeList_new", {
                limit: 2147,
                offset: 0,
                position_no: 20,
                program_year: this.$store.state.tmpProgramYear,
            });

            if (!Array.isArray(result.data)) return;

            for (const item of result.data) {
                item.name = `${item.name}`;
            }

            this.umList = result.data;
        },
        async getMUDataForExport() {
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

        async getFFDataForExport() {
            if (this.ffList.length > 0) return;
            const result = await this.$_api.get("GetFFAllWeb_new", {
                program_year: this.$store.state.tmpProgramYear,
                limit: 1000,
                offset: 0,
            });

            const dataList = result.data.data || result.data;
            if (!Array.isArray(dataList)) return;

            for (const item of dataList) {
                item.name = `${item.name} - ${item.ff_no}`;
            }

            this.ffList = dataList;
        },

        // export data
        async onSubmitExport(type) {
            const typeConfig = {
                mu: { ids: this.mu_no, list: this.muList, keyField: 'mu_no', nameField: 'name' },
                um: { ids: this.employee_no_um, list: this.umList, keyField: 'nik', nameField: 'name' },
                fc: { ids: this.employee_no_fc, list: this.fcList, keyField: 'nik', nameField: 'name' },
                ff: { ids: this.employee_no_ff, list: this.ffList, keyField: 'ff_no', nameField: 'name' },
            };

            const token = localStorage.getItem('token');

            const config = typeConfig[type];
            if (!config) return;

            const { ids, list, keyField, nameField } = config;

            if (this.loadingExport) return;
            if (!ids || ids.length === 0) {
                this.$_alert.error({}, "Export Gagal", "Pilih minimal satu data terlebih dahulu");
                return;
            }

            this.loadingExport = true;

            const failedItems = [];
            const successItems = [];

            for (const idValue of ids) {
                if (!this.isOpen) break;
                if (!idValue) continue;

                const itemObj = list.find((item) => item[keyField] == idValue);
                const itemName = itemObj ? itemObj[nameField] : "Unknown";

                const format = this.format || 'excel';
                const extension = format === 'pdf' ? 'pdf' : 'xlsx';
                const filename = `Report-${itemName.replace(/ /g, "")}-${idValue}-${moment().format("DDMMYYYYHHmmss")}.${extension}`;

                const axiosConfig = {
                    method: "POST",
                    url: this.configUrl[format] || this.configUrl['excel'],
                    responseType: "arraybuffer",
                    data: {
                        exportBy: type,
                        id_value: idValue,
                        name: itemName,
                        program_year: this.$store.state.tmpProgramYear,
                    },
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };

                let url;
                let link;
                try {
                    const exported = await axios(axiosConfig);
                    if (!exported) {
                        failedItems.push(itemName);
                        continue;
                    }

                    url = URL.createObjectURL(new Blob([exported.data]));
                    link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", filename);
                    document.body.appendChild(link);
                    link.click();

                    successItems.push(itemName);
                } catch (err) {
                    let errorMessage = `Gagal export data ${itemName}`;
                    if (err.response?.data instanceof ArrayBuffer) {
                        try {
                            const decoded = JSON.parse(new TextDecoder().decode(err.response.data));
                            errorMessage = decoded.message || errorMessage;
                        } catch (_) {
                            // bukan JSON, biarin default message
                        }
                    }
                    console.error("Export Error:", errorMessage);
                    failedItems.push(itemName);
                } finally {
                    // cleanup, wajib biar gak leak
                    if (link) document.body.removeChild(link);
                    if (url) URL.revokeObjectURL(url);
                }
            }

            this.loadingExport = false;
            this.isOpen = false;

            if (failedItems.length === 0) {
                this.$_alert.success("Semua data berhasil di-export");
            } else if (successItems.length === 0) {
                this.$_alert.error({}, "Export Gagal", `Semua data gagal di-export: ${failedItems.join(', ')}`);
            } else {
                this.$_alert.error(
                    {},
                    "Export Sebagian Gagal",
                    `Berhasil: ${successItems.length}, Gagal: ${failedItems.join(', ')}`
                );
                this.isOpen = false;
            }
        },


        test(data) {
            console.log("data", data);
        },
        test2(data) {
            console.log("data", data);
        },
    },

    mounted() {
        // this.getInitialData();
    },
};
</script>