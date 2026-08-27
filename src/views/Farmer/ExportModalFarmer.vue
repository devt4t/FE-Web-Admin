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
                            ],
                        },
                    }" />

                    <!-- mu_no, target_area & ff_no -->
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
                    <div :class="exportBy === 'fc' ? 'd-block' : 'd-none'">
                        <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }">
                            <form @submit.prevent="handleSubmit(onSubmitByFC)" autocomplete="off">
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
                                        }" @option:selected="test2($event)" :disabled="fcList.length == 0" />
                                        <v-progress-circular v-if="fcList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="danger" type="submit" v-if="format == 'pdf'">
                                            <v-icon v-if="!loadingExportByFC">mdi-file-pdf-box</v-icon>

                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export PDF</span>
                                        </v-btn>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="success" type="submit" v-if="format == 'excel'">
                                            <v-icon v-if="!loadingExportByFC">mdi-microsoft-excel</v-icon>
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
                            <form @submit.prevent="handleSubmit(onSubmitByUM)" autocomplete="off">
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
                                        }" @option:selected="test2($event)" :disabled="umList.length == 0" />
                                        <v-progress-circular v-if="umList.length == 0" indeterminate
                                            color="primary"></v-progress-circular>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="danger" type="submit" v-if="format == 'pdf'">
                                            <v-icon v-if="!loadingExportByUM">mdi-file-pdf-box</v-icon>

                                            <v-progress-circular v-else :size="20" color="danger"
                                                indeterminate></v-progress-circular>
                                            <span class="ml-1"> Export PDF</span>
                                        </v-btn>
                                    </v-col>

                                    <v-col lg="12">
                                        <v-btn variant="success" type="submit" v-if="format == 'excel'">
                                            <v-icon v-if="!loadingExportByUM">mdi-microsoft-excel</v-icon>
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
            loadingExportByFC: false,
            loadingExportByUM: false,
            loadingExportByMU: false,
            currentFfName: "",
            exportBy: 'mu',
            fcList: [],
            muList: [],
            umList: [],
            exportData: [],
            configUrl: {
                // pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
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

        // export data

        getExportData(ffCode) {
            return new Promise(async (resolve, reject) => {
                this.$_api
                    .get("second-monitorings/main/list", {
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
            console.log({ value, offset })
            return new Promise(async (resolve, reject) => {

                let payload = {
                    program_year: this.$store.state.tmpProgramYear,
                    limit: 100,
                    offset: offset,
                };
                if (this.exportBy == 'fc') {
                    payload = { ...payload, 'employee_no': value };
                } else if (this.exportBy == 'mu') {
                    payload = { ...payload, 'mu_no': value };
                } else if (this.exportBy == 'um') {
                    payload = { ...payload, 'employee_no': value };
                } else {
                    return;
                }

                this.$_api
                    .get("export/farmerAll", payload)
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
            for (const _fc of this.nik) {
                if (!_fc) continue;

                const result = await this.getExportData(_fc);

                if (!result) {
                    this.loading = false;
                    continue;
                }

                if (
                    !Array.isArray(result.data) ||
                    (Array.isArray(result.data) && result.data.length == 0)
                ) {
                    if (this.nik.length == 1) {
                        this.loading = false;
                        this.$_alert.error(
                            {},
                            "Tidak ada data",
                            `FF ${this._fc} tidak memiliki petani/lahan di tahun ${this.$store.state.tmpProgramYear}`
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
                    excel: `${this.$_config.baseUrlExport}export/monitoring2-mass/excel`,
                };

                let ffName = this.ffList.find((item) => item.nik == _fc)
                    ? this.ffList.find((item) => item.nik == _fc).name
                    : "";

                if (ffName) {
                    ffName = ffName.replace(/ /g, "");
                }

                const configFilename = {
                    pdf: `Report-${ffName}-${_fc}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.pdf`,
                    excel: `Report-${ffName}-${_fc}-${moment().format(
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
                        offset == 0 && result.data.length == 0
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

                const configFilename = {
                    pdf: `Report-${muName.replace(/ /g, "")}-${_mu}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.pdf`,
                    excel: `Report-${muName.replace(/ /g, "")}-${_mu}-${moment().format(
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
                        program_year: this.$store.state.tmpProgramYear,
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
        async onSubmitByUM() {
            if (this.loadingExportByUM) return;

            this.loadingExportByUM = true;
            for (const [index, _um] of this.employee_no_um.entries()) {
                if (!_um) continue;

                let umName = this.umList.find((item) => item.nik == _um)
                    ? this.umList.find((item) => item.nik == _um).name
                    : "";

                let offset = 0;
                let trees = [];
                while (true) {
                    const result = await this.getExportDataCarbon(_um, offset);
                    if (!result) {
                        this.loadingExportByUM = false;
                        break;
                    }

                    if (offset == 0 && result.data.length == 0) {
                        this.loadingExportByUM = false;
                        this.$_alert.error(
                            {},
                            "Tidak ada data",
                            `Tidak ada data di Target Area ${umName} ${this.$store.state.tmpProgramYear}`
                        );
                        return;
                    } else {
                        console.log(result, offset)
                        this.exportData = [...this.exportData, ...result.data]
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

                const configFilename = {
                    pdf: `Report-${umName.replace(/ /g, "")}-${_um}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.pdf`,
                    excel: `Report-${umName.replace(/ /g, "")}-${_um}-${moment().format(
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
                        name: umName,
                        program_year: this.$store.state.tmpProgramYear,
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
                    this.loadingExportByUM = false;
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
                if (index === this.employee_no_um.length - 1) {
                    this.loadingExportByUM = false;
                }
            }

            this.$_alert.success("Successfully");
            this.loading = false;
            this.isOpen = false;
        },
        async onSubmitByFC() {
            if (this.loadingExportByFC) return;

            this.loadingExportByFC = true;
            for (const [index, _fc] of this.employee_no_fc.entries()) {
                if (!_fc) continue;

                let fcName = this.fcList.find((item) => item.nik == _fc)
                    ? this.fcList.find((item) => item.nik == _fc).name
                    : "";

                let offset = 0;
                let trees = [];
                while (true) {
                    const result = await this.getExportDataCarbon(_fc, offset);
                    if (!result) {
                        this.loadingExportByFC = false;
                        break;
                    }

                    if (offset == 0 && result.data.length == 0) {
                        this.loadingExportByFC = false;
                        this.$_alert.error(
                            {},
                            "Tidak ada data",
                            `Tidak ada data dari FC ${fcName} ${this.$store.state.tmpProgramYear}`
                        );
                        return;
                    } else {
                        console.log(result, offset)
                        this.exportData = [...this.exportData, ...result.data]
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

                const configFilename = {
                    pdf: `Report-${fcName.replace(/ /g, "")}-${_fc}-${moment().format(
                        "DMMYYYYHHmmss"
                    )}.pdf`,
                    excel: `Report-${fcName.replace(/ /g, "")}-${_fc}-${moment().format(
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
                        name: fcName,
                        program_year: this.$store.state.tmpProgramYear,
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
                    this.loadingExportByFC = false;
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
                if (index === this.employee_no_fc.length - 1) {
                    this.loadingExportByFC = false;
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