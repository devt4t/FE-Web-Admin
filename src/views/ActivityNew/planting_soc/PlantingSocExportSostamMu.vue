<template>
    <v-dialog v-model="isOpen" width="50%">
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title>
                    <span>Export Sostam by Management Unit</span>
                </v-card-title>

                <v-card-text class="farmer-assign-wrapper mt-3">
                    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
                        <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                            <v-row>
                                <v-col lg="12">
                                    <geko-input v-model="muNo" :item="{
                                        label: 'Unit Management',
                                        placeholder: 'Pilih Unit Management',
                                        type: 'select',
                                        validation: ['required'],
                                        api: 'new-utilities/management-units',
                                        param: {
                                            limit: 1000,
                                        },
                                        option: {
                                            multiple: false,
                                            list_pointer: {
                                                label: 'name',
                                                code: 'mu_no',
                                                display: ['name', 'mu_no'],
                                            },
                                        },
                                    }" />
                                </v-col>

                                <v-col lg="12">
                                    <v-btn variant="success" type="submit" v-if="">
                                        <v-icon v-if="!loading">mdi-microsoft-excel</v-icon>
                                        <v-progress-circular v-else :size="20" color="danger"
                                            indeterminate></v-progress-circular>
                                        <span class="ml-1"> Export Excel</span>
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
    name: "planting-soc-export-lahan-mu",
    data() {
        return {
            muNo: null,
            isOpen: false,
            loading: false,
            exportData: []
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
                this.isOpen = true;
            }

            if (!t) {
                this.ff_code = null;
            }
        },
    },

    methods: {
        // export data

        getExportData(offset) {
            return new Promise(async (resolve, reject) => {
                this.$_api
                    .get("sostam/export-by/mu", {
                        mu_no: this.muNo,
                        program_year: this.$store.state.tmpProgramYear,
                        limit: 10,
                        offset: offset,
                    })
                    .then((res) => {
                        return resolve(res.data);
                    })
                    .catch(() => {
                        return reject(false);
                    });
            });
        },

        async onSubmit() {
            if (this.loading) return;

            try {
                this.loading = true;

                let offset = 0;
                while (true) {
                    const result = await this.getExportData(offset);
                    if (!result) {
                        this.loading = false;
                        break;
                    }

                    if (!Array.isArray(result) || ((Array.isArray(result) && result.length) == 0 && this.exportData.length == 0)) {
                        this.loading = false;
                        this.$_alert.error(
                            {},
                            "Tidak ada data"
                        );
                        return;
                    } else {
                        console.log(result, offset)
                        this.exportData = [...this.exportData, ...result]
                        if (result.length < 10) break;
                        offset += 10;
                    }



                }



                const axiosConfig = {
                    method: "POST",
                    url: `${this.$_config.baseUrlExport}export/planting-soc/mu/it/excel`,
                    responseType: "arraybuffer",
                    data: {
                        data: this.exportData,
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

                console.log('export result', exported);
                const exportFilename = `Export-SosialisasiTanam-${this.muNo}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`

                const url = URL.createObjectURL(new Blob([exported.data]));
                const link = document.createElement("a");
                link.href = url;

                const filename = exportFilename;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                this.$_alert.success("Successfully");
                this.loading = false;
                this.isOpen = false;

            }

            catch (err) {
                if (typeof err === 'string') {
                    this.$_alert.error(err)
                }
                this.loading = false
            }

        },

    },

    mounted() {
        // this.getInitialData();
    },


    // for (const _ff of this.ff_code) {
    //             if (!_ff) continue;

    //             const result = await this.getExportData(_ff);

    //             if (!result) {
    //                 this.loading = false;
    //                 continue;
    //             }

    //             if (
    //                 !Array.isArray(result.data) ||
    //                 (Array.isArray(result.data) && result.data.length == 0)
    //             ) {
    //                 if (this.ff_code.length == 1) {
    //                     this.loading = false;
    //                     this.$_alert.error(
    //                         {},
    //                         "Tidak ada data",
    //                         `FF ${this._ff} tidak memiliki petani/lahan di tahun ${this.$store.state.tmpProgramYear}`
    //                     );
    //                     return;
    //                 }
    //                 continue;
    //             }

    //             const trees = await this.$_api
    //                 .get("GetTreesAll")
    //                 .then((res) => {
    //                     return res.data.result.data;
    //                 })
    //                 .catch((err) => {
    //                     console.log("err", err);
    //                     return false;
    //                 });

    //             if (!trees) {
    //                 this.loading = false;
    //                 continue;
    //             }

    //             const configUrl = {
    //                 pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
    //                 excel: `${this.$_config.baseUrlExport}export/farmer-land-polygon/excel`,
    //             };

    //             let ffName = this.ffList.find((item) => item.ff_no == _ff)
    //                 ? this.ffList.find((item) => item.ff_no == _ff).name
    //                 : "";

    //             if (ffName) {
    //                 ffName = ffName.replace(/ /g, "");
    //             }

    //             const configFilename = {
    //                 pdf: `Report-${ffName}-${_ff}-${moment().format(
    //                     "DMMYYYYHHmmss"
    //                 )}.pdf`,
    //                 excel: `Report-${ffName}-${_ff}-${moment().format(
    //                     "DMMYYYYHHmmss"
    //                 )}.xlsx`,
    //             };
    //             const axiosConfig = {
    //                 method: "POST",
    //                 url: configUrl[this.format],
    //                 responseType: "arraybuffer",
    //                 data: {
    //                     data: result.data,
    //                     trees: trees,
    //                 },
    //                 headers: {
    //                     "content-type": "application/json",
    //                     Authorization: `Bearer ${this.$store.state.token}`,
    //                 },
    //             };
    //             const exported = await axios(axiosConfig)
    //                 .then((res) => {
    //                     return res;
    //                 })
    //                 .catch((err) => {
    //                     return false;
    //                 });

    //             if (!exported) {
    //                 this.loading = false;
    //                 continue;
    //             }

    //             const url = URL.createObjectURL(new Blob([exported.data]));
    //             const link = document.createElement("a");
    //             link.href = url;

    //             const filename = configFilename[this.format];
    //             link.setAttribute("download", filename);
    //             document.body.appendChild(link);
    //             link.click();
    //         }
};
</script>