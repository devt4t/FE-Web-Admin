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
                    <div :class="exportBy === 'ff' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(onSubmitByFF)" autocomplete="off">
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
                                                multiple: true,
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
                                        <v-btn variant="danger" type="submit" v-if="format == 'pdf'">
                                            <v-icon v-if="!loadingExportByMU">mdi-file-pdf-box</v-icon>

                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export PDF</span>
                                        </v-btn>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="success" type="submit" v-if="format == 'excel'">
                                            <v-icon v-if="!loadingExportByMU">mdi-microsoft-excel</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export Excel</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>
                    <div :class="exportBy === 'mu' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(onSubmitByMU)" autocomplete="off">
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
                                        }" @option:selected="test2($event)" :disabled="muList.length == 0" />
                                        <v-progress-circular v-if="muList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="danger" type="submit" v-if="format == 'pdf'">
                                            <v-icon v-if="!loadingExportByMU">mdi-file-pdf-box</v-icon>

                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export PDF</span>
                                        </v-btn>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="success" type="submit" v-if="format == 'excel'">
                                            <v-icon v-if="!loadingExportByMU">mdi-microsoft-excel</v-icon>
                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export Excel</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </div>
                    <div :class="exportBy === 'ta' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(onSubmitByTA)" autocomplete="off">
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
                                                multiple: true,
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
                                        <v-btn variant="danger" type="submit" v-if="format == 'pdf'">
                                            <v-icon v-if="!loadingExportByTA">mdi-file-pdf-box</v-icon>

                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export PDF</span>
                                        </v-btn>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="success" type="submit" v-if="format == 'excel'">
                                            <v-icon v-if="!loadingExportByTA">mdi-microsoft-excel</v-icon>
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
            ff_no: null,
            mu_no: null,
            target_area: null,
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
            default: "excel",
        },
    },

    watch: {
        dataKey(t) {
            if (t > 0) {
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

        async getFFDataForExport() {
            if (this.ffList.length > 0) return;
            const result = await this.$_api.get("GetFFAllWeb_new", {
                limit: 1000,
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

        getExportData(ffCode) {
            return new Promise(async (resolve, reject) => {
                this.$_api
                    .get("getExportDataLahanFarmer_new", {
                        program_year: this.$store.state.tmpProgramYear,
                        ff_no: ffCode,
                        limit: 100000,
                        offset: 0,
                    })
                    .then((res) => {
                        return resolve(res);
                    })
                    .catch(() => {
                        return reject(false);
                    });
            });
        },
        getExportDataCarbon(value, offset) {
            return new Promise(async (resolve, reject) => {

                let payload = {
                    program_year: this.$store.state.tmpProgramYear,
                    limit: 100,
                    offset: offset,
                };
                if (this.exportBy == 'ta') {
                    payload = { ...payload, 'ta_code': value };
                } else if (this.exportBy == 'mu') {
                    payload = { ...payload, 'mu_no': value };
                } else if (this.exportBy == 'ff') {
                    payload = { ...payload, 'ff_no': value };
                } else {
                    return;
                }

                this.$_api
                    .get("monitoring/first/main/export", payload)
                    .then((res) => {
                        return resolve(res);
                    })
                    .catch(() => {
                        return reject(false);
                    });
            });
        },

        async onSubmit() {
            if (this.loading) return;

            this.loading = true;
            for (const _ff of this.ff_no) {
                if (!_ff) continue;

                const result = await this.getExportData(_ff);

                if (!result) {
                    this.loading = false;
                    continue;
                }

                if (
                    !Array.isArray(result.data) ||
                    (Array.isArray(result.data) && result.data.length == 0)
                ) {
                    if (this.ff_no.length == 1) {
                        this.loading = false;
                        this.$_alert.error(
                            {},
                            "Tidak ada data",
                            `FF ${this._ff} tidak memiliki petani/lahan di tahun ${this.$store.state.tmpProgramYear}`
                        );
                        return;
                    }
                    continue;
                }

                // const trees = await this.$_api
                //     .get("GetTreesAll")
                //     .then((res) => {
                //         return res.data.result.data;
                //     })
                //     .catch((err) => {
                //         console.log("err", err);
                //         return false;
                //     });

                // if (!trees) {
                //     this.loading = false;
                //     continue;
                // }

                const configUrl = {
                    pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
                    excel: `${this.$_config.baseUrlExport}export/farmer-land-polygon/excel`,
                };

                let ffName = this.ffList.find((item) => item.ff_no == _ff)
                    ? this.ffList.find((item) => item.ff_no == _ff).name
                    : "";

                if (ffName) {
                    ffName = ffName.replace(/ /g, "");
                }

                const configFilename = {
                    pdf: `Report-${ffName}-${_ff}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.pdf`,
                    excel: `Report-${ffName}-${_ff}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.xlsx`,
                };
                const axiosConfig = {
                    method: "POST",
                    url: configUrl[this.format],
                    responseType: "arraybuffer",
                    data: {
                        data: result.data,
                        trees: trees,
                    },
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${this.$store.state.token}`,
                    },
                };
                const exported = await axios(axiosConfig)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        return false;
                    });

                if (!exported) {
                    this.loading = false;
                    continue;
                }

                const url = URL.createObjectURL(new Blob([exported.data]));
                const link = document.createElement("a");
                link.href = url;

                const filename = configFilename[this.format];
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
            }

            this.$_alert.success("Successfully");
            this.loading = false;
            this.isOpen = false;
        },
        async onSubmitByTA() {
            if (this.loadingExportByTA) return;

            this.loadingExportByTA = true;
            for (const [index, _ta] of this.target_area.entries()) {
                if (!_ta) continue;

                let taName = this.taList.find((item) => item.area_code == _ta)
                    ? this.taList.find((item) => item.area_code == _ta).name
                    : "";

                let offset = 0;
                let trees = [];
                while (true) {
                    const result = await this.getExportDataCarbon(_ta, offset);
                    if (!result) {
                        this.loadingExportByTA = false;
                        break;
                    }

                    if (
                        !Array.isArray(result.total) ||
                        !Array.isArray(result.trees) ||
                        (Array.isArray(result.data && result.data.length == 0))
                    ) {
                        this.loadingExportByTA = false;
                        this.$_alert.error(
                            {},
                            "Tidak ada data",
                            `Tidak ada data di Unit Management ${taName} ${this.$store.state.tmpProgramYear}`
                        );
                        return;
                    } else {
                        console.log(result, offset)
                        this.exportData = [...this.exportData, ...result.data]
                        trees = result.trees;
                        if (result.data.length < 100) break;
                        offset += 100;
                    }



                }


                // const trees = await this.$_api
                //     .get("GetTreesAll")
                //     .then((res) => {
                //         return res.data.result.data;
                //     })
                //     .catch((err) => {
                //         console.log("err", err);
                //         return false;
                //     });

                // if (!trees) {
                //     this.loading = false;
                //     continue;
                // }



                if (taName) {
                    taName = taName.replace(/ /g, "");
                }

                const configFilename = {
                    pdf: `Report-${taName}-${_ta}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.pdf`,
                    excel: `Report-${taName}-${_ta}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.xlsx`,
                };
                const axiosConfig = {
                    method: "POST",
                    url: this.configUrl['excel'],
                    responseType: "arraybuffer",
                    data: {
                        data: this.exportData,
                        exportBy: this.exportBy,
                        trees: trees
                    },
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${this.$store.state.token}`,
                    },
                };
                const exported = await axios(axiosConfig)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        return false;
                    });

                if (!exported) {
                    this.loadingExportByTA = false;
                    continue;
                }

                const url = URL.createObjectURL(new Blob([exported.data]));
                const link = document.createElement("a");
                link.href = url;

                const filename = configFilename[this.format];
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();

                // reset after complete download, then filled by next UM
                this.exportData = [];

                // stop the loading when the last download completed
                if (index === this.target_area.length - 1) {
                    this.loadingExportByTA = false;
                }
            }

            this.$_alert.success("Successfully");
            this.loading = false;
            this.isOpen = false;
        },
        async onSubmitByMU() {
            if (this.loadingExportByMU) return;

            this.loadingExportByMU = true;
            for (const [index, _mu] of this.mu_no.entries()) {
                if (!_mu) continue;

                let muName = this.muList.find((item) => item.mu_no == _mu)
                    ? this.muList.find((item) => item.mu_no == _mu).name
                    : "";

                let offset = 0;
                let trees = [];
                while (true) {
                    const result = await this.getExportDataCarbon(_mu, offset);
                    if (!result) {
                        this.loadingExportByMU = false;
                        break;
                    }

                    if (
                        !Array.isArray(result.total) ||
                        !Array.isArray(result.trees) ||
                        !Array.isArray(result.data) ||
                        result.data.length == 0
                    ) {
                        this.loadingExportByMU = false;
                        this.$_alert.error(
                            {},
                            "Tidak ada data",
                            `Tidak ada data di Unit Management ${muName} ${this.$store.state.tmpProgramYear}`
                        );
                        return;
                    } else {
                        console.log(result, offset)
                        this.exportData = [...this.exportData, ...result.data]
                        trees = result.trees;
                        if (result.data.length < 100) break;
                        offset += 100;
                    }



                }


                // const trees = await this.$_api
                //     .get("GetTreesAll")
                //     .then((res) => {
                //         return res.data.result.data;
                //     })
                //     .catch((err) => {
                //         console.log("err", err);
                //         return false;
                //     });

                // if (!trees) {
                //     this.loading = false;
                //     continue;
                // }



                if (muName) {
                    muName = muName.replace(/ /g, "");
                }

                const configFilename = {
                    pdf: `Report-${muName}-${_mu}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.pdf`,
                    excel: `Report-${muName}-${_mu}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.xlsx`,
                };
                const axiosConfig = {
                    method: "POST",
                    url: this.configUrl['excel'],
                    responseType: "arraybuffer",
                    data: {
                        data: this.exportData,
                        exportBy: this.exportBy,
                        trees: trees
                    },
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${this.$store.state.token}`,
                    },
                };
                const exported = await axios(axiosConfig)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        return false;
                    });

                if (!exported) {
                    this.loadingExportByMU = false;
                    continue;
                }

                const url = URL.createObjectURL(new Blob([exported.data]));
                const link = document.createElement("a");
                link.href = url;

                const filename = configFilename[this.format];
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();

                // reset after complete download, then filled by next UM
                this.exportData = [];

                // stop the loading when the last download completed
                if (index === this.mu_no.length - 1) {
                    this.loadingExportByMU = false;
                }
            }

            this.$_alert.success("Successfully");
            this.loading = false;
            this.isOpen = false;
        },
        async onSubmitByFF() {
            if (this.loadingExportByFF) return;

            this.loadingExportByFF = true;
            for (const [index, _ff] of this.ff_no.entries()) {
                if (!_ff) continue;

                let ffName = this.ffList.find((item) => item.ff_no == _ff)
                    ? this.ffList.find((item) => item.ff_no == _ff).name
                    : "";

                let offset = 0;
                let trees = [];
                while (true) {
                    const result = await this.getExportDataCarbon(_ff, offset);
                    if (!result) {
                        this.loadingExportByFF = false;
                        break;
                    }

                    if (
                        !Array.isArray(result.total) ||
                        !Array.isArray(result.trees) ||
                        !Array.isArray(result.data) ||
                        result.data.length == 0
                    ) {
                        this.loadingExportByFF = false;
                        this.$_alert.error(
                            {},
                            "Tidak ada data",
                            `Tidak ada data di Unit Management ${ffName} ${this.$store.state.tmpProgramYear}`
                        );
                        return;
                    } else {
                        console.log(result, offset)
                        this.exportData = [...this.exportData, result.data]
                        trees = result.trees;
                        if (result.data.length < 100) break;
                        offset += 100;
                    }



                }


                // const trees = await this.$_api
                //     .get("GetTreesAll")
                //     .then((res) => {
                //         return res.data.result.data;
                //     })
                //     .catch((err) => {
                //         console.log("err", err);
                //         return false;
                //     });

                // if (!trees) {
                //     this.loading = false;
                //     continue;
                // }



                if (ffName) {
                    ffName = ffName.replace(/ /g, "");
                }

                const configFilename = {
                    pdf: `Report-${ffName}-${_ff}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.pdf`,
                    excel: `Report-${ffName}-${_ff}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.xlsx`,
                };
                const axiosConfig = {
                    method: "POST",
                    url: this.configUrl['excel'],
                    responseType: "arraybuffer",
                    data: {
                        data: this.exportData,
                        exportBy: this.exportBy,
                        trees: trees
                    },
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${this.$store.state.token}`,
                    },
                };
                const exported = await axios(axiosConfig)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        return false;
                    });

                if (!exported) {
                    this.loadingExportByFF = false;
                    continue;
                }

                const url = URL.createObjectURL(new Blob([exported.data]));
                const link = document.createElement("a");
                link.href = url;

                const filename = configFilename[this.format];
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();

                // reset after complete download, then filled by next UM
                this.exportData = [];

                // stop the loading when the last download completed
                if (index === this.ff_no.length - 1) {
                    this.loadingExportByFF = false;
                }
            }

            this.$_alert.success("Successfully");
            this.loading = false;
            this.isOpen = false;
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