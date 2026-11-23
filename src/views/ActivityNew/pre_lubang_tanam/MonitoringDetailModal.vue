<template>
    <v-dialog v-model="isOpen" max-width="1050px">
        <v-card>
            <v-card-title class="headline bg-info text-white">
                Monitoring Pra-Penlub & Evaluasi Risiko
            </v-card-title>
            <v-card-text class="pt-5">
                <v-row dense class="mb-3" v-if="targetItem">
                    <v-col cols="12" md="3">
                        <div class="text-caption text--secondary">Field Facilitator</div>
                        <div class="font-weight-bold">{{ targetItem.field_facilitators_name }} ({{ targetItem.ff_no }})
                        </div>
                    </v-col>
                    <v-col cols="12" md="3">
                        <div class="text-caption text--secondary">Tanggal Kegiatan Sampel</div>
                        <div class="font-weight-bold">{{ (assessment && assessment.activity_date) || "-" }}</div>
                    </v-col>
                    <v-col cols="12" md="3">
                        <div class="text-caption text--secondary">Status Verifikasi FC</div>
                        <div v-if="assessment && Number(assessment.is_verified) === 1">
                            <v-chip small color="success" text-color="white">Terverifikasi FC</v-chip>
                        </div>
                        <div v-else>
                            <v-chip small color="grey" text-color="white">Belum Diverifikasi</v-chip>
                        </div>
                    </v-col>
                    <v-col cols="12" md="3">
                        <div class="text-caption text--secondary">Rekomendasi Sistem (Kalkulasi FE)</div>
                        <div v-if="aggregated.recommendation">
                            <v-chip small :color="aggregated.recommendation === 'GO' ? 'success' : 'warning'"
                                text-color="white">
                                {{ aggregated.recommendation }} (Skor Rata-rata: {{ aggregated.avgScore }})
                            </v-chip>
                        </div>
                        <span v-else class="text--secondary">Menunggu Input Mobile</span>
                    </v-col>
                </v-row>

                <v-data-table :headers="headers" :items="enrichedSamples" :loading="isLoading" dense class="elevation-1"
                    hide-default-footer loading-text="Memuat detail sampel...">
                    <template v-slot:item.humidity="{ item }">
                        {{ HUMIDITY_MAP[item.humidity] || "-" }}
                    </template>
                    <template v-slot:item.time_checking="{ item }">
                        {{ TIME_CHECKING_MAP[item.time_checking] || "-" }}
                    </template>
                    <template v-slot:item.is_raining="{ item }">
                        {{ IS_RAINING_MAP[item.is_raining] || "-" }}
                    </template>
                    <template v-slot:item.eval_status="{ item }">
                        <v-chip small v-if="item.eval_status !== 'PENDING'"
                            :color="item.eval_status === 'GO' ? 'success' : 'warning'" text-color="white">
                            {{ item.eval_status }} ({{ item.eval_score }})
                        </v-chip>
                        <span v-else class="text--secondary">Belum Dicek</span>
                    </template>
                </v-data-table>
            </v-card-text>
            <v-card-actions>
                <span v-if="assessment && Number(assessment.assignment_status) < 2"
                    class="text-caption text--secondary ml-3">
                    Menunggu seluruh sampel disubmit FF dari Mobile sebelum verifikasi FC.
                </span>
                <v-spacer />
                <v-btn text color="grey" @click="isOpen = false">Tutup</v-btn>
                <!-- <v-btn color="primary" @click="proceedToConfirm"
                    :disabled="!assessment || Number(assessment.is_verified) !== 1">
                    <v-icon left small>mdi-calendar-check</v-icon>
                    Konfirmasi / Override Distribusi
                </v-btn> -->
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import {
    HUMIDITY_MAP,
    TIME_CHECKING_MAP,
    IS_RAINING_MAP,
    evaluateSampleRisk,
    evaluateFFAggregatedRisk,
} from "./PreLubangTanamRiskCalculator.js";

export default {
    name: "MonitoringDetailModal",
    data() {
        return {
            isOpen: false,
            isLoading: false,
            targetItem: null,
            assessment: null,
            samples: [],
            HUMIDITY_MAP,
            TIME_CHECKING_MAP,
            IS_RAINING_MAP,
            headers: [
                { text: "No. Lahan", value: "lahan_no" },
                { text: "Petani", value: "farmer_name" },
                { text: "Tipe Irigasi", value: "irrigation_access" },
                { text: "Tekstur Tanah", value: "soil_texture" },
                { text: "Risk Tier", value: "risk_tier" },
                { text: "Kelembapan", value: "humidity" },
                { text: "Waktu Cek", value: "time_checking" },
                { text: "Hujan H-2", value: "is_raining" },
                { text: "Evaluasi (FE)", value: "eval_status" },
            ],
        };
    },
    computed: {
        enrichedSamples() {
            return this.samples.map((s) => {
                const { score, status } = evaluateSampleRisk(s);
                return { ...s, eval_score: score, eval_status: status };
            });
        },
        aggregated() {
            return evaluateFFAggregatedRisk(this.samples);
        },
    },
    methods: {
        async open(item) {
            this.targetItem = item;
            this.assessment = null;
            this.samples = [];
            this.isOpen = true;
            await this.fetchDetail();
        },
        async fetchDetail() {
            this.isLoading = true;
            try {
                const res = await this.$_api.get(
                    `pre-planting-hole/monitoring-detail?ff_no=${this.targetItem.ff_no}&program_year=${this.targetItem.program_year}`
                );
                const payload = res?.data || res;
                this.assessment = payload.assessment || null;
                this.samples = payload.samples || [];
            } catch (err) {
                this.$_alert.error(err?.response?.data?.message || "Gagal memuat detail monitoring.");
            } finally {
                this.isLoading = false;
            }
        },
        proceedToConfirm() {
            this.isOpen = false;
            this.$emit("open-confirm", {
                item: this.targetItem,
                recommendation: this.aggregated.recommendation,
            });
        },
    },
};
</script>