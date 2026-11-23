<template>
    <div>
        <geko-base-crud :config="config" :refreshKey="refreshKey" :hideCreate="true" :hideDetail="true"
            :hideUpdate="true" :hideDelete="true">
            <template v-slot:list-after-filter>
                <div class="d-flex justify-content-start">
                    <v-btn variant="primary" @click="openConfirmModal">
                        <v-icon>mdi-calendar-check</v-icon>
                        <span>Konfirmasi Distribusi (AZ)</span>
                    </v-btn>
                </div>
            </template>

            <template v-slot:list-activity_date="{ item }">
                <span v-if="item.activity_date">{{ item.activity_date | parse('date') }}</span>
                <span v-else> - </span>
            </template>

            <template v-slot:list-assignment_progress="{ item }">
                <span>{{ item.submitted_samples || 0 }} / {{ item.total_samples || 0 }}</span>
            </template>

            <template v-slot:list-assignment_status="{ item }">
                <span class="badge" :class="getStatusMeta(item.assignment_status).color">
                    {{ getStatusMeta(item.assignment_status).label }}
                </span>
            </template>

            <template v-slot:list-system_recommendation="{ item }">
                <span v-if="getFFRecommendation(item)" class="badge"
                    :class="getFFRecommendation(item) === 'GO' ? 'bg-success' : 'bg-warning'">
                    {{ getFFRecommendation(item) }}
                </span>
                <span v-else class="text--secondary">-</span>
            </template>

            <template v-slot:list-distribution_date="{ item }">
                <div class="d-flex flex-column">
                    <span>{{ item.distribution_date | parse('date') }}</span>
                    <span v-if="item.original_distribution_time"
                        class="text-09-em text-decoration-line-through text--secondary">
                        {{ item.original_distribution_time | parse('date') }}
                    </span>
                </div>
            </template>

            <template v-slot:list-distribution_confirmation_status="{ item }">
                <div>
                    <span v-if="item.distribution_confirmation_status" class="badge" :class="{
                        'bg-success': item.distribution_confirmation_status === 'GO',
                        'bg-primary': item.distribution_confirmation_status === 'DELAY',
                        'bg-danger': item.distribution_confirmation_status === 'CANCEL'
                    }">
                        {{ item.distribution_confirmation_status }}
                    </span>
                    <span v-else> - </span>
                </div>
            </template>

            <template v-slot:list-bottom-action="{ item }">
                <v-btn variant="info" small class="mr-1 mt-1 mb-1" @click="openSampleAssignModal(item)">
                    <v-icon left small>mdi-map-marker-check</v-icon>
                    <span>Assign Sampel</span>
                </v-btn>
                <v-btn v-if="(item.total_samples || 0) > 0" variant="primary" small class="mt-1"
                    @click="openMonitoringModal(item)">
                    <v-icon left small>mdi-clipboard-pulse</v-icon>
                    <span>Monitoring & Evaluasi</span>
                </v-btn>
            </template>
        </geko-base-crud>

        <SampleAssignModal ref="sampleAssignModal" @refresh="refreshKey += 1" />
        <MonitoringDetailModal ref="monitoringModal" @open-confirm="handleOpenConfirmFromMonitoring" />
        <DistributionConfirmModal ref="confirmModal" @refresh="refreshKey += 1" />
    </div>
</template>

<script>
import config from "./PreLubangTanamConfig.js";
import SampleAssignModal from "./SampleAssignModal";
import MonitoringDetailModal from "./MonitoringDetailModal";
import DistributionConfirmModal from "./DistributionConfirmModal";
import { ASSIGNMENT_STATUS_MAP, evaluateFFAggregatedRisk } from "./PreLubangTanamRiskCalculator";

export default {
    name: "pre-lubang-tanam",
    components: {
        SampleAssignModal,
        MonitoringDetailModal,
        DistributionConfirmModal,
    },
    data() {
        return {
            config: config,
            refreshKey: 1,
        };
    },
    methods: {
        getStatusMeta(status) {
            return ASSIGNMENT_STATUS_MAP[Number(status)] || ASSIGNMENT_STATUS_MAP[0];
        },
        getFFRecommendation(item) {
            const { recommendation } = evaluateFFAggregatedRisk(item.samples || []);
            return recommendation;
        },
        openSampleAssignModal(item) {
            this.$refs.sampleAssignModal.open(item);
        },
        openMonitoringModal(item) {
            this.$refs.monitoringModal.open(item);
        },
        openConfirmModal() {
            this.$refs.confirmModal.open();
        },
        handleOpenConfirmFromMonitoring({ item }) {
            this.$refs.confirmModal.open();
            if (item && item.ff_no) {
                this.$nextTick(() => {
                    this.$refs.confirmModal.selectedFF = item.ff_no;
                });
            }
        },
    },
};
</script>