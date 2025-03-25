<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:detail-slave-raw="{ data }">
            <monitoring2-detail :data="data"></monitoring2-detail>
        </template>
        <template v-slot:list-indicator="{ item }">
            <div class="indicator-wrapper pt-1">
                <div class="indicator" :class="{
                    danger: item.is_verified == 0,
                    warning: item.is_verified == 1,
                    success: item.is_verified == 2,
                }"></div>
            </div>
        </template>

        <template v-slot:list-bottom-action="{ item }">
            <v-btn variant="danger" small class="d-flex flex-row align-items-center mt-2"
                @click="onExportDetailPdf(item)" v-if="$_sys.isAllowed('field-facilitator-update')">
                <v-icon small v-if="!exportPdfIds.includes(item.id)">mdi-file-pdf-box</v-icon>
                <v-progress-circular v-else indeterminate :size="20" color="danger"></v-progress-circular>

                <span>Export PDF</span>
            </v-btn>

            <v-btn variant="success" small class="d-flex flex-row align-items-center mt-2"
                @click="onExportDetailExcel(item)" v-if="$_sys.isAllowed('field-facilitator-update')">
                <v-icon small v-if="!exportIds.includes(item.id)">mdi-microsoft-excel</v-icon>
                <v-progress-circular v-else indeterminate :size="20" color="success"></v-progress-circular>

                <span>Export Excel</span>
            </v-btn>
            <v-btn variant="primary" small class="d-flex flex-row align-items-center mt-2"
                @click="onExportDetailSelectiom(item)" v-if="$_sys.isAllowed('field-facilitator-update')">
                <v-icon small v-if="!exportIds.includes(item.id)">mdi-download</v-icon>
                <!-- <v-progress-circular v-else indeterminate :size="20" color="success"></v-progress-circular> -->
                <span>Export Detail</span>
            </v-btn>
        </template>
        <template v-slot:list-after-filter>
            <monitoring2-export-selection :data="detailData" :dataKey="detailDataKey"></monitoring2-export-selection>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import monitoring2Config from "./monitoring2Component/monitoring2Config";
import monitoring2Detail from "./monitoring2Detail.vue";
import monitoring2ExportSelection from "./monitoring2Component/monitoring2ExportSelection.vue";

import moment from "moment";
import axios from "axios";
export default {
    components: {
        LottieAnimation,
        monitoring2Detail,
        monitoring2ExportSelection
    },
    name: "crud-monitoring2",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: monitoring2Config,
            lottie: maintenanceAnimation,
            exportIds: [],
            exportPdfIds: [],
            detailDataKey: 0,
            detailData: [],
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods: {
        async onExportDetailExcel(item) {
            try {
                if (this.exportIds.includes(item.id)) {
                    // console.log('item', this.exportIds.includes(item.id));
                    return;
                }
                this.exportIds.push(item.id)
                const monitoring_data = await this.$_api.get('second-monitorings/main/detail', {
                    id: item.id
                })

                if (monitoring_data.result.length == 0) throw "err"

                //EXPORT DATA
                const exportEndpoint = `${this.$_config.baseUrlExport}export/monitoring2/excel`
                const exportPayload = {
                    data: monitoring_data.result
                }
                const exportFilename = `Export-Monitoring2-${monitoring_data.result.monitoring2_no}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`

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
        async onExportDetailPdf(item) {
            try {
                if (this.exportPdfIds.includes(item.id)) {
                    // console.log('item', this.exportPdfIds.includes(item.id));
                    return;
                }
                this.exportPdfIds.push(item.id)
                const monitoring_data = await this.$_api.get('second-monitorings/main/detail', {
                    id: item.id
                })

                if (monitoring_data.result.length == 0) throw "err"

                //EXPORT DATA
                const exportEndpoint = `${this.$_config.baseUrlExport}export/monitoring2/pdf`
                const exportPayload = {
                    data: monitoring_data.result
                }
                const exportFilename = `Export-Monitoring2-${monitoring_data.result.monitoring2_no}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.pdf`

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
                let idx = this.exportPdfIds.findIndex(x => x === item.id)
                if (idx > -1) this.exportPdfIds.splice(idx, 1)

            }

            catch (err) {
                console.log('err', err);

                let idx = this.exportPdfIds.findIndex(x => x === item.id)
                if (idx > -1) this.exportPdfIds.splice(idx, 1)
            }

        },
        onExportDetailSelectiom(item){
            this.detailData = item
            this.detailDataKey += 1
        }
    },
};
</script>