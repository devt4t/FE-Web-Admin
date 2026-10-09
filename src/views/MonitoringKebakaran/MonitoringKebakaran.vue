<template>
    <div>
        <geko-base-crud :config="config" :hideCreate="true" :hideDelete="true">
            <!-- karena disini hanya me-report atau archive aja jadi tidak ada hapus ygy -->
            <template v-slot:create-form>
                <MonitoringKebakaranUpdate />
            </template>
            <!-- hide button kalo udah di verif FC -->
            <template v-slot:list-action-update="{ item }">
                <button v-if="item.is_verified == 0" class="geko-list-action-update"
                    @click="$router.push({ query: { view: 'update', id: item.id, mon_no: item.mon_no } })"
                    title="Update Data">
                    <v-icon small>mdi-pencil-minus</v-icon>
                </button>
                <div v-else></div>
            </template>
            <template v-slot:list-bottom-action="{ item }">
                <v-btn variant="danger" small class="mr-2 mt-2"
                    :loading="exportingId === item.id && exportType === 'laporan'" :disabled="exportingId === item.id"
                    @click="handleExportPdf(item, 'laporan')" title="Export PDF Laporan Kebakaran">
                    <v-icon small color="danger">mdi-file-pdf-box</v-icon>
                    <span>Export Laporan Kebakaran</span>
                </v-btn>
                <v-btn variant="danger" small class="mr-2 mt-2"
                    :loading="exportingId === item.id && exportType === 'berita_acara'"
                    :disabled="exportingId === item.id" @click="handleExportPdf(item, 'berita_acara')"
                    title="Export PDF Berita Acara Kebakaran">
                    <v-icon small color="danger">mdi-file-pdf-box</v-icon>
                    <span>Export Berita Acara</span>
                </v-btn>
            </template>
            <template v-slot:detail-body>
                <div class="d-none"></div>
            </template>

            <template v-slot:detail-slave-raw="{ data }">
                <template v-if="data && data.data">
                    <MonitoringKebakaranDetailMap :long="data.data.longitude" :lat="data.data.latitude"
                        :section="'Monitoring Kebakaran'" :title="'Koordinat Lahan'" />
                    <MonitoringKebakaranDetail :data="data.data" />
                </template>
            </template>

            <template v-slot:list-is_verified="{ item }">
                <span class="badge" :class="{
                    'bg-light': item.is_verified == 0,
                    'bg-primary': item.is_verified == 1,
                    'bg-success': item.is_verified == 2
                }">{{ item.is_verified == 0 ? 'Belum Diverifikasi' :
                    item.is_verified == 1 ? 'Diverifikasi FC' :
                        item.is_verified == 2 ? 'Diverifikasi UM' : 'null' }}</span>
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
            exportingId: null,
            exportType: null,
        }
    },
    methods: {
        async handleExportPdf(item, type) {
            const config = {
                'laporan': {
                    title: 'Laporan Kebakaran',
                    endpoint: 'export/monitoring-kebakaran/pdf',
                    prefix: 'Laporan_Respon_Cepat_Kebakaran'
                },
                'berita_acara': {
                    title: 'Berita Acara',
                    endpoint: 'export/monitoring-kebakaran/berita-acara-pdf',
                    prefix: 'Berita_Acara_Kebakaran_Lahan'
                }
            }[type];

            const prompt =
                await this.$_alert.custom({
                    title: `Export PDF ${config.title}`,
                    text: `Mulai proses Export PDF ${config.title} untuk lahan ini?`,
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
                this.exportType = type;

                const response =
                    await axios({
                        method: 'POST',
                        url: `${this.$_config.baseUrlExport}${config.endpoint}`,
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

                const fileName = `${config.prefix}_${item.mon_no}_${moment().format('DDMMYYYYHHmmss')}.pdf`;

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);

                this.$_alert.success(`Berhasil Export ${config.title} PDF`);
            } catch (err) {
                console.error(err);
                this.$_alert.error(`Export ${config.title} PDF Failed`);
            } finally {
                this.exportingId = null;
                this.exportType = null;
            }
        },
    }
};
</script>