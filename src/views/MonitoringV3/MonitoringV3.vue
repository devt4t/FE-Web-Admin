<template>
    <div>
        <monitoring-export-modal :dataKey="exportKey" :exportFormat="exportFormat" :programYear="programYear"
            :currentYear="localPlantingYear" title="Export Monitoring V3" />
        <!-- <monitoring-export-modal :dataKey="exportSummaryKey" :programYear="programYear" :currentYear="localPlantingYear"
            :monitoringStep="activeStage" exportType="summary" endpoint="v2/export/monitoring-v3/summary/excel"
            title="Export Summary Monitoring V3" /> -->

        <geko-base-crud :key="'crud-' + activeStage" :config="config" :refreshKey="refreshKey" :hideUpdate="true"
            :hideDelete="true" :hideCreate="true">

            <!-- INDICATOR SLOT -->
            <template v-slot:list-indicator="{ item }">
                <div class="indicator-wrapper pt-1">
                    <div class="indicator" :class="{
                        danger: item.is_verified == 0,
                        success: item.is_verified == 1
                    }"></div>
                </div>
            </template>

            <!-- KOSONGKAN DETAIL BODY AGAR LOOP BAWAAN HILANG -->
            <template v-slot:detail-body>
                <div class="d-none"></div>
            </template>

            <!-- DETAIL SLOT -->
            <template v-slot:detail-slave-raw="{ data }">
                <template v-if="data">
                    <monitoring-detail-map :long="normalizeMonitoringDetail(data).longitude"
                        :lat="normalizeMonitoringDetail(data).latitude" :section="`MonitoringV3`"
                        :title="'Koordinat Monitoring'" />
                    <monitoring-detail :data="normalizeMonitoringDetail(data)" :stageKey="stageConfig.key"
                        :treeDetailHeaders="config.treeDetailHeaders"
                        :monitoringTreeDetailHeaders="config.monitoringTreeDetailHeaders"
                        :pestDiseaseHeaders="config.pestDiseaseHeaders" :disasterHeaders="config.disasterHeaders"
                        :complainHeaders="config.complainHeaders" :harvestHeaders="config.harvestHeaders"
                        :plantCompanionHeaders="config.plantCompanionHeaders" />
                </template>
            </template>

            <!-- ACTION BUTTONS -->
            <template v-slot:list-bottom-action="{ item }">
                <!-- Verifikasi FC -->
                <v-btn variant="warning" small class="mt-2" @click="onVerifFC(item)"
                    v-if="item.is_verified == 0 && item.monitoring_end !== null && item.monitoring_end !== ''">
                    <v-icon small>mdi-check</v-icon>
                    <span>Verifikasi FC</span>
                </v-btn>

                <!-- Export Detail -->
                <v-btn variant="success" small class="mt-2" @click="ExportDetail(item)">
                    <v-icon small>mdi-file-excel</v-icon>
                    <span>Export Detail</span>
                </v-btn>

                <!-- Hapus -->
                <v-btn variant="danger" small class="mt-2" @click="onDelete(item)"
                    v-if="item.is_verified == 0 && canDelete">
                    <v-icon small>mdi-trash-can</v-icon>
                    <span>Hapus</span>
                </v-btn>

                <!-- Unverifikasi -->
                <v-btn variant="danger" small class="mt-2" @click="onUnverif(item)"
                    v-if="item.is_verified != 0 && canUnVerif">
                    <v-icon small>mdi-backspace</v-icon>
                    <span>Unverifikasi</span>
                </v-btn>

                <!-- Generate Populate (conditional => nanti dulu) -->
                <!-- <v-btn variant="success" small class="mt-2" @click="onGeneratePopulate(item)"
                    v-if="stageConfig.features.hasGeneratePopulate && item.is_verified == 1">
                    <v-icon small>mdi-check-bold</v-icon>
                    <span>Generate Populate Mon {{ stageConfig.populate.targetStage }}</span>
                </v-btn> -->
            </template>

            <!-- EXPORT BUTTONS AND PLANTING YEAR -->
            <template v-slot:list-after-filter>
                <div class="d-flex w-100 justify-content-between align-items-center mb-2">
                    <!-- Export Buttons -->
                    <div class="d-flex align-items-center">
                        <v-btn variant="info" small class="mr-2" @click="exportFormat = 'excel'; exportKey += 1">
                            <v-icon small>mdi-table-arrow-right</v-icon>
                            <span>Export Excel</span>
                        </v-btn>

                        <v-btn variant="danger" small class="mr-2" @click="exportFormat = 'pdf'; exportKey += 1">
                            <v-icon small>mdi-file-pdf-box</v-icon>
                            <span>Export PDF</span>
                        </v-btn>
                        <!-- <v-btn variant="success" small class="mr-2" @click="exportSummaryKey += 1"
                            v-if="stageConfig.features.hasExportSummary">
                            <v-icon small>mdi-table-arrow-right</v-icon>
                            <span>Export Summary Per FF</span>
                        </v-btn> -->
                    </div>
                    <div class="d-flex align-items-center">
                        <v-select v-model="localPlantingYear" :items="['2025', '2026']" label="Pilih Tahun Tanam" dense
                            outlined hide-details style="max-width: 200px;"
                            @change="recalculateStage(programYear)"></v-select>
                    </div>
                </div>
            </template>
        </geko-base-crud>
    </div>
</template>

<script>
import axios from "axios";
import { buildMonitoringCrudConfig, MONITORING_STAGES_REGISTRY } from './config'
import MonitoringDetail from './components/monitoring/MonitoringDetail.vue'
import MonitoringDetailMap from '@/views/Lahan/components/DetailLahanMap'
import MonitoringExportModal from './components/monitoring/ExportModal.vue'

export default {
    name: 'crud-monitoring-v3',
    components: { MonitoringDetail, MonitoringDetailMap, MonitoringExportModal },

    data() {
        const currentYear = '2025'
        const config = buildMonitoringCrudConfig(2)
        config.getter = `${config.getter}?current_year=${currentYear}`

        return {
            config,
            activeStage: 2,
            refreshKey: 1,
            exportKey: 0,
            exportFormat: 'excel',
            exportSummaryKey: 0,
            user: {},
            localPlantingYear: currentYear,
        }
    },

    computed: {
        stageOptions() {
            return Object.values(MONITORING_STAGES_REGISTRY)
        },
        programYear() {
            return this.$store.state.tmpProgramYear
        },
        stageConfig() {
            return MONITORING_STAGES_REGISTRY[this.activeStage]
        },
        canDelete() {
            const user = this.$store.state.User || JSON.parse(localStorage.getItem('User') || '{}');
            const role = String(user.role || '');
            return ['13', '23', '3', '4'].includes(role)
        },
        canUnVerif() {
            const user = this.$store.state.User || JSON.parse(localStorage.getItem('User') || '{}')
            const role = String(user.role || '')
            return ['13', '4'].includes(role)
        }
    },

    watch: {
        programYear(newVal) {
            this.recalculateStage(newVal);
        }
    },

    mounted() {
        this.user = JSON.parse(localStorage.getItem('User'))

        // this.recalculateStage(this.programYear);
    },

    methods: {
        normalizeMonitoringDetail(response = {}) {
            const poly = response.polymorph || {}
            return {
                ...(response.data || {}),
                monitoring_detail: response.detail || [],
                monitoring_tree_detail: response.tree_detail || [],
                pest_diseases: poly.pest_diseases || [],
                disasters: poly.disasters || [],
                complains: poly.complains || [],
                harvests: poly.harvests || [],
                plant_companions: poly.plant_companions || [],
            }
        },

        recalculateStage(pYearVal) {
            const currentYear = parseInt(this.localPlantingYear);
            const pYear = parseInt(pYearVal);

            let step = currentYear - pYear;

            if (step > 5) {
                this.$_alert.error('Data terlalu lawas! Batas maksimal adalah ruang lingkup Monitoring 6.');
                return;
            }
            if (step < 1) {
                this.$_alert.error('Tahun Program tidak valid (melebihi atau sama Tahun Tanam).');
                return;
            }

            this.activeStage = step + 1;
            this.config = buildMonitoringCrudConfig(this.activeStage);
            this.config.getter = `${this.config.getter}?current_year=${currentYear}`;
            if (this.config.detail) {
                this.config.detail = `${this.config.detail}?current_year=${currentYear}&program_year=${this.programYear}`;
            }
            // this.$nextTick(() => {
            //     this.refreshKey += 1;
            // });
        },
        async ExportDetail(item) {
            const prompt = await this.$_alert.custom({
                title: 'Export Data?',
                text: 'Mulai proses unduh Excel untuk detail monitoring ini?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#17a2b8',
                cancelButtonColor: '#868e96',
                confirmButtonText: 'Ya, Export Data!',
                cancelButtonText: 'Batal'
            })
            if (prompt.isConfirmed) {
                const payload = {
                    id: item.id,
                    current_year: this.localPlantingYear,
                    program_year: item.program_year,
                    token: localStorage.getItem("token")
                };
                await axios({
                    method: "POST",
                    url: `${this.$_config.baseUrlExport}export/monitoring-v3/details`,
                    responseType: "arraybuffer",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    data: payload,
                }).then((res) => {
                    this.downloadFile(res);
                    this.$_alert.success("Export success");
                }).catch(err => {
                    this.$_alert.error('Gagal Melakukan Export!')
                    console.error('Export Error =>', err)
                })
            }
        },
        downloadFile(response) {
            const blob = new Blob([response.data], {
                type: response.headers['content-type'],
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

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
        },
        async onVerifFC(item) {
            const prompt = await this.$_alert.confirm(
                'Verifikasi FC?', 'Harap Cek Data!', 'Ya, Verifikasi!', 'Batal', true
            )
            if (prompt.isConfirmed) {
                this.$_api.post(this.stageConfig.api.verifFC, {
                    [this.stageConfig.key]: item[this.stageConfig.key],
                    // monitoring_step: this.activeStage,
                    id: item.id,
                    current_year: this.localPlantingYear,
                    program_year: item.program_year,
                    is_verified: 1,
                    user_id: this.user.id,
                    verified_by: this.user.id,
                    verified_at: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }),
                }).then(() => {
                    this.$_alert.success('Berhasil Verifikasi FC!')
                    this.refreshKey += 1
                }).catch(err => {
                    this.$_alert.error('Gagal Verifikasi FC!')
                    console.error('verif FC error =>', err)
                })
            }
        },

        async onUnverif(item) {
            const prompt = await this.$_alert.confirm(
                'Unverifikasi?', 'Status akan kembali!', 'Ya!', 'Batal', true
            )
            if (prompt.isConfirmed) {
                this.$_api.post(this.stageConfig.api.unverif, {
                    [this.stageConfig.key]: item[this.stageConfig.key],
                    // monitoring_step: this.activeStage,
                    id: item.id,
                    current_year: this.localPlantingYear,
                    program_year: item.program_year,
                    is_verified: 0,
                    verified_by: 'null',
                    // verified_at: 'null',
                }).then(() => {
                    this.$_alert.success('Berhasil Unverifikasi!')
                    this.refreshKey += 1
                }).catch(err => {
                    this.$_alert.error('Gagal Unverifikasi!')
                    console.error('unverif error =>', err)
                })
            }
        },

        async onDelete(item) {
            const prompt = await this.$_alert.confirm(
                'Hapus Data?', 'Yakin menghapus?', 'Ya, Hapus!', 'Batal', true
            )
            if (prompt.isConfirmed) {
                const payload = {
                    //  monitoring_step: this.activeStage 
                    id: item.id,
                    current_year: this.localPlantingYear,
                    program_year: item.program_year,
                }
                this.stageConfig.deletePayloadKeys.forEach(k => payload[k] = item[k])
                this.$_api.post(this.stageConfig.api.delete, payload)
                    .then(() => {
                        this.$_alert.success('Berhasil Hapus!')
                        this.refreshKey += 1
                    }).catch(err => {
                        this.$_alert.error('Gagal Hapus!')
                        console.error('delete error =>', err)
                    })
            }
        },

        async onGeneratePopulate(item) {
            if (!this.stageConfig.populate) return
            const prompt = await this.$_alert.confirm(
                `Generate Populate Mon ${this.stageConfig.populate.targetStage}?`,
                'Proses tidak bisa dikembalikan!', 'Ya, Generate!', 'Batal', true
            )
            if (prompt.isConfirmed) {
                this.$_api.post(this.stageConfig.populate.endpoint, {
                    // ...item,
                    // monitoring_step: this.activeStage,
                    current_year: this.localPlantingYear,
                    program_year: item.program_year,
                    list_monitoring1: [item],
                }).then(() => {
                    this.$_alert.success('Berhasil Generate Populate!')
                    this.refreshKey += 1
                }).catch(err => {
                    this.$_alert.error('Gagal Generate!')
                    console.error('populate error =>', err)
                })
            }
        },
    },
}
</script>
