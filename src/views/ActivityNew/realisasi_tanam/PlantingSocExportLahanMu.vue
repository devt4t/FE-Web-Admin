<template>
    <v-dialog v-model="isOpen" width="50%">
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title>
                    <span>Export Penilikan Tanam</span>
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
                            ],
                        },
                    }" />

                    <!-- mu_no, target_area & ff_no -->
                    <ValidationObserver ref="exportForm" v-slot="{ handleSubmit }">
                        <form @submit.prevent="handleSubmit(submitExport)" autocomplete="off">
                            <v-row>

                                <!-- FF -->
                                <v-col lg="12" v-if="exportBy === 'ff'">
                                    <geko-input v-model="ff_no" :item="{
                                        label: 'Field Facilitator',
                                        placeholder: 'Pilih Field Facilitator',
                                        type: 'select',
                                        validation: ['required'],
                                        api: 'GetFFAllWeb_new',
                                        param: {
                                            program_year: program_year,
                                            limit: 20,
                                        },
                                        option: {
                                            multiple: true,
                                            list_pointer: {
                                                label: 'name',
                                                code: 'ff_no',
                                                display: ['name', 'ff_no'],
                                            },
                                        },
                                    }" />
                                </v-col>

                                <!-- MU -->
                                <v-col lg="12" v-if="exportBy === 'mu'">
                                    <geko-input v-model="mu_no" :item="{
                                        label: 'Unit Management',
                                        placeholder: 'Pilih Unit Management',
                                        type: 'select',
                                        validation: ['required'],
                                        api: 'GetManagementUnitAdmin',
                                        param: {
                                            page: 1,
                                            per_page: 20,
                                        },
                                        option: {
                                            getterKey: 'data.result',
                                            multiple: true,
                                            list_pointer: {
                                                label: 'name',
                                                code: 'mu_no',
                                                display: ['name'],
                                            },
                                        },
                                    }" />
                                </v-col>

                                <!-- TA -->
                                <v-col lg="12" v-if="exportBy === 'ta'">
                                    <geko-input v-model="target_area" :item="{
                                        label: 'Target Area',
                                        placeholder: 'Pilih Target Area',
                                        type: 'select',
                                        validation: ['required'],
                                        api: 'GetTargetAreaAdmin',
                                        param: {
                                            page: 1,
                                            program_year: program_year,
                                            per_page: 20,
                                        },
                                        option: {
                                            getterKey: 'data.result',
                                            multiple: true,
                                            list_pointer: {
                                                label: 'name',
                                                code: 'area_code',
                                                display: ['name'],
                                            },
                                        },
                                    }" />
                                </v-col>

                                <!-- Export Button -->
                                <v-col lg="12">
                                    <v-btn color="success" type="submit" :disabled="loadingExport">
                                        <v-icon v-if="!loadingExport">mdi-microsoft-excel</v-icon>
                                        <v-progress-circular v-else :size="20" indeterminate />
                                        <span class="ml-1">Export Excel</span>
                                    </v-btn>
                                </v-col>

                            </v-row>
                        </form>
                    </ValidationObserver>

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

    props: {
        program_year: {
            required: true,
            default: 2025,
        },
        props: {
            program_year: {
                required: true,
                default: 2025,
            },
            dataKey: {
                required: false,
                default: false,
            },
            format: {
                required: false,
                default: "excel",
            },
        },

        watch: {
            dataKey(t) {
                if (t) {
                    // this.getInitialData()
                    this.getFFDataForExport()
                    this.getUMDataForExport()
                    this.getTADataForExport()
                    this.isOpen = true;
                }

                if (!t) {
                    this.ff_no = null;
                }
            },
            isOpen(val) {
                if (!val) {
                    // modal just closed
                    this.resetState()
                    this.$emit('update:dataKey', 0)
                    console.log('datakey', this.dataKey)
                }
            }
        },

        isOpen(val) {
            if (!val) this.resetState();
        },
    },

    methods: {
        resetState() {
            this.ff_no = [];
            this.mu_no = [];
            this.target_area = [];
            this.loadingExport = false;
        },

        async loadData() {
            await Promise.all([
                this.getFFDataForExport(),
                this.getUMDataForExport(),
                this.getTADataForExport(),
            ]);
        },

        this.loading = false
            this.loadingExportByFF = false
            this.loadingExportByMU = false
            this.loadingExportByTA = false
    },
    test(data) {
        console.log("data", data);
    },
    test2(data) {
        console.log("data", data);
    },
    async loadData() {
        this.getFFDataForExport()
        this.getUMDataForExport()
        this.getTADataForExport()
    },
    async getFFDataForExport() {
        if (this.ffList.length) return;

        const res = await this.$_api.get("GetFFAllWeb_new", {
            program_year: this.program_year,
            limit: 2147,
            offset: 0,
        });

        this.ffList = (res.data || []).map(i => ({
            ...i,
            name: `${i.name} - ${i.ff_no}`,
        }));
    },

    async getUMDataForExport() {
        if (this.muList.length) return;

        const res = await this.$_api.get("GetManagementUnitAdmin", {
            page: 1,
            per_page: 1000,
        });

        this.muList = (res.data.result || []).map(i => ({
            ...i,
            name: `${i.name} - ${i.mu_no}`,
        }));
    },

    async getTADataForExport() {
        if (this.taList.length) return;

        const res = await this.$_api.get("GetTargetAreaAdmin", {
            page: 1,
            program_year: this.program_year,
            per_page: 1000,
        });

        this.taList = (res.data.result || []).map(i => ({
            ...i,
            name: `${i.name} - ${i.area_code}`,
        }));
    },

    async submitExport() {
        if (this.loadingExport) return;

        if (!this.program_year) {
            this.$_alert.error({}, "Program Year required");
            return;
        }

        this.loadingExport = true;

        try {
            const payload = {
                program_year: this.program_year,
                exportBy: this.exportBy,
                ff_no: this.exportBy === "ff" ? this.ff_no : null,
                mu_no: this.exportBy === "mu" ? this.mu_no : null,
                target_area: this.exportBy === "ta" ? this.target_area : null,
                token: localStorage.getItem("token")
            };
            console.log('payloads', payload)
            const res = await axios({
                method: "POST",
                url: `${this.$_config.baseUrlExport}v2/export/penilikan/excel`,
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                data: payload,
            });

            this.downloadFile(res);
            this.$_alert.success("Export success");
            this.isOpen = false;

        } catch (err) {
            console.error(err);
            this.$_alert.error({}, "Export failed");
        } finally {
            this.loadingExport = false;
        }
    },

    downloadFile(response) {
        const blob = new Blob([response.data], {
            type: response.headers['content-type'],
        });

        let payload = {
            program_year: this.$store.state.tmpProgramYear,
            limit: 100,
            offset: offset,
        };
        if (this.exportBy == 'ta') {
            payload = { ...payload, 'target_area': value };
        } else if (this.exportBy == 'mu') {
            payload = { ...payload, 'mu_no': value };
        } else if (this.exportBy == 'ff') {
            payload = { ...payload, 'ff_no': value };
        } else {
            return;
        }

        let fileName = "export.xlsx";

        const contentDisposition = response.headers['content-disposition'];

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match && match[1]) {
                fileName = match[1];
            }
        }

        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }
},
};
</script>