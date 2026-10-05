<template>
    <div>
        <geko-base-crud :config="config" :hideCreate="true" :hideUpdate="false" :hideDelete="true">
            <!-- karena disini hanya me-report atau archive aja jadi tidak ada hapus -->
            <template v-slot:create-form>
                <MonitoringKebakaranUpdate />
            </template>
            
            <template v-slot:list-bottom-action="{ item }">
                <v-btn variant="danger" small class="mr-2 mt-2" :loading="exportingId === item.id"
                    :disabled="exportingId === item.id" @click="onExportLaporanKebakaranPDF(item)"
                    title="Export PDF Laporan Kebakaran">
                    <v-icon small color="danger">mdi-file-pdf-box</v-icon>
                    <span>Export Laporan Kebakaran</span>
                </v-btn>
                <!-- <v-btn variant="danger" small class="mr-2 mt-2" :loading="exportingId === item.id"
                    :disabled="exportingId === item.id" @click="onExportBeritaAcaraPDF(item)"
                    title="Export PDF Berita Acara Kebakaran">
                    <v-icon small color="danger">mdi-file-pdf-box</v-icon>
                    <span>Export Berita Acara</span>
                </v-btn> -->
            </template>
            <template v-slot:detail-body>
                <div class="d-none"></div>
            </template>

            <template v-slot:detail-slave-raw="{ data }">
                <template v-if="data && data.data">
                    <MonitoringKebakaranDetailMap :long="data.data.longitude" :lat="data.data.latitude" :section="'Monitoring Kebakaran'" :title="'Koordinat Lahan'"/>
                    <MonitoringKebakaranDetail :data="data.data" />
                </template>
            </template>
            
        </geko-base-crud>
    </div>
</template>

<script>
import config from "./MonitoringKebakaranConfig.js";
import MonitoringKebakaranUpdate from "./MonitoringKebakaranUpdate.vue";
import MonitoringKebakaranDetail from "./MonitoringKebakaranDetail.vue";
import MonitoringKebakaranDetailMap from "@/views/Lahan/components/DetailLahanMap.vue";
import "./monitoring-kebakaran.scss";
import axios from "axios";
import moment from "moment";

export default {
    name: "crud-monitoring-kebakaran",
    components: {
        MonitoringKebakaranUpdate,
        MonitoringKebakaranDetail,
        MonitoringKebakaranDetailMap,
    },
    data() {
        return {
            config,
            exportingId: null
        }
    },
    methods: {
        async onExportLaporanKebakaranPDF(item) {
            const prompt =
                await this.$_alert.custom({
                    title: 'Export PDF Laporan Kebakaran?',
                    text: 'Mulai proses Export PDF Laporan Kebakaran untuk lahan ini?',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#17a2b8',
                    cancelButtonColor: '#868e96',
                    confirmButtonText: 'Ya, Export!',
                    cancelButtonText: 'Batal'
                });

            if (!prompt.isConfirmed) return;

            const token = localStorage.getItem("token");

            try {
                this.exportingId = item.id;

                const response =
                    await axios({
                        method: 'POST',
                        url: `${this.$_config.baseUrlExport}export/monitoring-kebakaran/pdf`,
                        responseType: 'arraybuffer',
                        data: {
                            filters: {
                                mon_no: item.mon_no,
                                token: token,
                            }
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                const fileName = `Laporan_Respon_Cepat_Kebakaran_${item.mon_no}_${moment().format('DDMMYYYYHHmmss')}.pdf`;

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);

                this.$_alert.success('Berhasil Export Laporan Kebakaran PDF');
            } catch (err) {
                console.error(err);
                this.$_alert.error('Export Laporan Kebakaran PDF Failed');
            } finally {
                this.exportingId = null;
            }
        },
        async onExportBeritaAcaraPDF(item) {
            const prompt = await this.$_alert.custom({
                title: 'Export PDF Berita Acara',
                text: 'Mulai export data untuk Berita Acara Kebakaran Lahan?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Ya, Export',
                confirmButtonColor: '#17a2b8',
                cancelButtonText: 'Batalkan',
                cancelButtonColor: '#868e96',
            });

            if (!prompt.isConfirmed) return;

            const token = localStorage.getItem("token");

            try {
                this.exportingId = item.id;

                const response = await axios({
                    method: 'POST',
                    url: `${this.$_config.baseUrlExport}export/monitoring-kebakaran/pdf`,
                    responseType: 'arraybuffer',
                    data: {
                        filters: {
                            mon_no: item.mon_no,
                            token: token,
                        },
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const fileName = `Berita_Acara_Kebakaran_Lahan${item.mon_no}_${moment().format('DDMMYYYYHHmmss')}.pdf`;

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");

                link.href = url;
                link.setAttribute('download', fileName);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);

                this.$_alert.success('Berhasil Export Berita Acara PDF');
            } catch (err) {
                console.error(err);
                this.$_alert.error('Export Berita Acara Failed');
            } finally {
                this.exportingId = null;
            }
        }
    }
};
</script>