<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:list-bottom-action="{ item }">
            <v-btn variant="info" small class="mt-2" @click="onBASTCheck(item)">
                <v-icon left small>mdi-information-box-outline</v-icon>
                <span>Cek Status BAST</span>
            </v-btn>
            <v-btn v-if="item.status_bast == 1" variant="danger" small class="mt-2" @click="lackOfSeedForm(item)">
                <v-icon left small>mdi-magnify-minus</v-icon>
                <span>Lapor Bibit Kurang</span>
            </v-btn>
            <v-btn v-else-if="item.status_bast == 2" variant="warning" small class="mt-2"
                @click="excessOfSeedForm(item)">
                <v-icon left small>mdi-magnify-plus</v-icon>
                <span>Lapor Bibit Berlebih</span>
            </v-btn>
            <v-btn variant="success" small class="d-block mt-2" @click="onExportExcel(item)">
                <v-icon v-if="!exportIds.includes(item.id)">mdi-microsoft-excel</v-icon>
                <v-progress-circular v-else indeterminate :size="20" color="success"></v-progress-circular>

                <span>Export Excel</span>
            </v-btn>
            <v-btn variant="success" small class="d-block mt-2" @click="onExportProofInsentiveExcel(item)">
                <v-icon v-if="!exportProofInsentiveIds.includes(item.id)">mdi-microsoft-excel</v-icon>
                <v-progress-circular v-else indeterminate :size="20" color="success"></v-progress-circular>

                <span>Proof Insentive</span>
            </v-btn>
        </template>
        <template v-slot:detail-slave-raw="{ data }">
            <unload-allocation-detail :data="data"></unload-allocation-detail>
        </template>
    </geko-base-crud>
</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import UnloadConfig from "./LahanUmumDistributionLoadingLineConfig";
import UnloadAllocationDetail from "./LahanUmumDistributionLoadingLineDetail.vue";
import LottieAnimation from "lottie-web-vue";
import moment from "moment";
import axios from "axios";
export default {
    components: {
        LottieAnimation,
        UnloadAllocationDetail,
    },
    name: "crud-distribution-unload-general-land",
    watch: {},
    data() {
        return {
            User: JSON.parse(localStorage.getItem("User")),
            refreshKey: 1,
            exportUnloadKey: 0,
            exportIds: [],
            exportProofInsentiveIds: [],
            config: {
                title: "Distribution Unload - Lahan Umum",
                model_api: null,
                getter: "distribution/loading-line/list?land_status=2",
                getterDataKey: "data",
                totalDataKey: 'total',
                detail: "distribution/loading-line/detail",
                detailIdKey: "id",
                detailKey: "data.result",
                pk_field: null,
                globalFilter: {
                    program_year: {
                        setter: "program_year",
                    },
                },
                permission: {
                    read: "distribution-unload-list",
                    // update: "distribution-unload-update",
                    detail: "distribution-unload-detail",
                },
                slave: [],
                fields: UnloadConfig,
            },
            lottie: maintenanceAnimation,
        };
    },
    methods: {
        async onBASTCheck(item) {
            const prompt = await this.$_alert.confirm('Cek Status BAST?', 'Apakah Anda Yakin Untuk Melakukan Cek Status BAST?', 'Ya, Verifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                // console.log(item)
                this.$_api.get('distribution/nursery/check-bast', {
                    loading_line_id: item.id,
                })
                    .then(() => {
                        this.$_alert.success('Berhasil Update Status BAST')
                        this.refreshKey += 1
                    })
            }
        },
        lackOfSeedForm(item) {
            // console.log(item.id, this.User.name)
            window.open(
                `https://nursery.trees4trees.org/#/forms/request-distribution-addendum?loading_line_id=${item.id}&request_by=${this.User.name}`
            );
        },
        excessOfSeedForm(item) {
            window.open(
                `https://nursery.trees4trees.org/#/forms/request-distribution-addendum?loading_line_id=${item.id}&request_by=${this.User.name}`
            );
        },


        async onExportExcel(item) {
            try {
                if (this.exportIds.includes(item.id)) return
                this.exportIds.push(item.id)
                const distribution_unload = await this.$_api.get('distribution/loading-line/detail', {
                    id: item.id
                })

                if (!distribution_unload.result) throw "err"
                //EXPORT DATA
                const exportEndpoint = `${this.$_config.baseUrlExport}export/distribution-unload/excel`
                const exportPayload = {
                    data: distribution_unload.result
                }
                const exportFilename = `Export-Distribution-Unload-${distribution_unload.result.id}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`


                const axiosConfig = {
                    method: "POST",
                    url: exportEndpoint,
                    responseType: "arraybuffer",
                    data: exportPayload,
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

                if (!exported) throw "ERR"
                const url = URL.createObjectURL(new Blob([exported.data]));
                const link = document.createElement("a");
                link.href = url;

                const filename = exportFilename;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                let idx = this.exportIds.findIndex(x => x === item.id)
                if (idx > -1) this.exportIds.splice(idx, 1)

            }

            catch (err) {
                console.log('err', err);

                let idx = this.exportIds.findIndex(x => x === item.id)
                if (idx > -1) this.exportIds.splice(idx, 1)
            }
        },
        async onExportProofInsentiveExcel(item) {
            try {
                if (this.exportProofInsentiveIds.includes(item.id)) return
                this.exportProofInsentiveIds.push(item.id)
                const distribution_unload = await this.$_api.get('distribution/export/proof-for-insentive', {
                    id: item.id
                })

                if (!distribution_unload.result) throw "err"
                //EXPORT DATA
                const exportEndpoint = `${this.$_config.baseUrlExport}export/distribution-proof-insentive/excel`
                const exportPayload = {
                    data: distribution_unload.result,
                    program_year: this.$store.state.tmpProgramYear
                }
                const exportFilename = `Export-Distribution-Unload-${distribution_unload.result.id}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`


                const axiosConfig = {
                    method: "POST",
                    url: exportEndpoint,
                    responseType: "arraybuffer",
                    data: exportPayload,
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

                if (!exported) throw "ERR"
                const url = URL.createObjectURL(new Blob([exported.data]));
                const link = document.createElement("a");
                link.href = url;

                const filename = exportFilename;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                let idx = this.exportProofInsentiveIds.findIndex(x => x === item.id)
                if (idx > -1) this.exportProofInsentiveIds.splice(idx, 1)

            }

            catch (err) {
                console.log('err', err);

                let idx = this.exportProofInsentiveIds.findIndex(x => x === item.id)
                if (idx > -1) this.exportProofInsentiveIds.splice(idx, 1)
            }
        }

    },
};
</script>