<template>
    <div>

        <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true"
            :hideCreate="true">

            <!-- detail -->
            <template v-slot:detail-slave-raw="{ data }">
                <!-- <populate-detail :data="data" /> -->
                <!-- di render oleh base model geko base crud -->
            </template>

            <!-- action buttons -->
            <template v-slot:list-bottom-action="{ item }">
                <!-- assign/edit data populasi -->
                <v-btn class="d-flex flex-row align-items-center mt-2" variant="primary" small
                    @click="assignDataPopulate(item)" v-if="item.is_monitoring == 0">
                    <v-icon small>mdi-pencil-plus</v-icon>
                    <span v-if="isNotAssigned(item)">Lengkapi Data Populasi</span>
                    <span v-else>Edit Data Populasi</span>
                </v-btn>

                <!-- reset assignment -->
                <v-btn class="d-flex flex-row align-items-center mt-2" variant="warning" small
                    @click="onResetAssignment(item)" v-if="!isNotAssigned(item) && item.is_monitoring == 0">
                    <v-icon small>mdi-alert-warning</v-icon>
                    <span>Reset Data Populasi</span>
                </v-btn>

                <!-- generate monitoring data -->
                <v-btn class="d-flex flex-row align-items-center mt-2" variant="success" small
                    @click="onGenerateMonitoring(item)" v-if="!isNotAssigned(item) && item.is_monitoring == 0">
                    <v-icon small>mdi-check-all</v-icon>
                    <span>Generate Data Monitoring</span>
                </v-btn>

                <!-- delete populate -->
                <v-btn class="d-flex flex-row align-items-center mt-2" variant="danger" small
                    @click="onDeletePopulate(item)" v-if="item.is_monitoring == 0 && canDelete">
                    <v-icon small>mdi-backspace</v-icon>
                    <span>Hapus Data Populasi</span>
                </v-btn>
            </template>

            <!-- status badge (custom-slot) -->
            <template v-slot:list-status_data="{ item }">
                <status-badge :item="item" />
            </template>
            <template v-slot:detail-status_data="{ item }">
                <status-badge :item="item" />
            </template>

            <!-- assign to (custom display) -->
            <template v-slot:list-assigned_to="{ item }">
                {{ item.field_facilitators_name ?? 'Belum Ditentukan!' }}
                <br />
                ({{ item.assigned_to ?? '-' }})
            </template>
            <template v-slot:detail-assigned_to="{ item }">
                {{ item.field_facilitators_name ?? 'Belum Ditentukan!' }}
                ({{ item.assigned_to ?? '-' }})
            </template>

            <!-- list FC -->
            <template v-slot:list-users_employee_no="{ item }">
                {{ item.users_name ?? '-' }}
                <br />
                ({{ item.fc_no ?? '-' }})
            </template>

            <!-- assignment form -->
            <template v-slot:list-after-filter>
                <div class="d-flex flex-row justify-content-end align-items-center pb-2">
                    <!-- Form Component (Hidden by default) -->
                    <assignment-form :data="formData" :dataKey="formDataKey" :stage="activePopulateStage"
                        :currentYear="localPlantingYear" @success="refreshKey += 1" />
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
import { buildPopulateCrudConfig, POPULATE_STAGE_REGISTRY } from './config'
import PopulateDetail from './components/populate/PopulateDetail.vue'
import AssignmentForm from './components/populate/AssignmentForm.vue'
import StatusBadge from './components/populate/StatusBadge.vue'

export default {
    name: 'crud-monitoring-v3-populate',
    components: { PopulateDetail, AssignmentForm, StatusBadge },

    data() {
        const currentYear = '2025'
        const config = buildPopulateCrudConfig('1-to-2')
        config.getter = `${config.getter}?current_year=${currentYear}`

        return {
            activePopulateStage: '1-to-2',
            config: config,
            refreshKey: 1,
            formData: null,
            formDataKey: 0,
            localPlantingYear: currentYear,
        }
    },

    computed: {
        populateStageOptions() {
            return Object.entries(POPULATE_STAGE_REGISTRY).map(([stageKey, val]) => ({
                stageKey: stageKey,
                label: val.label,
            }))
        },
        programYear() {
            return this.$store.state.tmpProgramYear
        },
        stageConfig() {
            return POPULATE_STAGE_REGISTRY[this.activePopulateStage]
        },
        canDelete() {
            const user = this.$store.state.User || JSON.parse(localStorage.getItem('User') || '{}');
            const role = String(user.role || '');
            return ['13', '23', '3', '4'].includes(role)
        }
    },

    watch: {
        programYear(newVal) {
            this.recalculateStage(newVal);
        }
    },

    created() {
        this.recalculateStage(this.programYear);
    },

    mounted() {
        this.user = JSON.parse(localStorage.getItem('User'))
        // this.recalculateStage(this.programYear);
    },

    methods: {
        recalculateStage(pYearVal) {
            const currentYear = parseInt(this.localPlantingYear);
            const pYear = parseInt(pYearVal);

            let step = currentYear - pYear;

            if (step > 5) {
                // this.$_alert.error('Data terlalu lawas! Batas maksimal adalah ruang lingkup Monitoring 6.');
                this.$_alert.suppress = true;
                this.$_alert.custom({
                    title: "Informasi",
                    icon: "info",
                    text: "Data terlalu lawas! Batas maksimal adalah ruang lingkup Monitoring 6.",
                    showCloseButton: true,
                });
                return;
            }
            if (step < 1) {
                // this.$_alert.error('Tahun Program tidak valid (melebihi atau sama Tahun Tanam).');
                this.$_alert.suppress = true;
                this.$_alert.custom({
                    title: "Informasi",
                    icon: "info",
                    text: "Tahun Program tidak valid (melebihi atau sama dengan Tahun Tanam).",
                    showCloseButton: true,
                });
                return;
            }

            this.activePopulateStage = `${step}-to-${step + 1}`;
            this.config = buildPopulateCrudConfig(this.activePopulateStage);
            this.config.getter = `${this.config.getter}?current_year=${currentYear}`;
            if (this.config.detail) {
                this.config.detail = `${this.config.detail}?current_year=${currentYear}&program_year=${this.programYear}`;
            }
            this.formData = null;
            this.$nextTick(() => {
                this.refreshKey += 1;
            });

        },

        // helper: untuk cek apakah belum di assign
        isNotAssigned(item) {
            return item.assigned_to == null || item.assigned_to === '-' || item.assigned_to === ''
        },

        assignDataPopulate(item) {
            this.formData = item
            this.formDataKey += 1
        },

        async onResetAssignment(item) {
            const prompt = await this.$_alert.confirm(
                'Reset Assignment Populasi?',
                'Data assignment akan direset!',
                'Ya, Reset', 'Batal', true
            )
            if (prompt.isConfirmed) {
                const payload = {
                    id: item.id,
                    // monitoring_step: this.stageConfig.stageNumber,
                    current_year: this.localPlantingYear,
                    program_year: item.program_year,
                    type: 'unassign',
                }
                this.$_api.post(this.stageConfig.api.resetAssignment, payload)
                    .then(() => {
                        this.$_alert.success('Berhasil Reset Assignment!')
                        this.refreshKey += 1
                    })
                    .catch((err) => {
                        this.$_alert.error('Gagal Reset Assignment!')
                        console.log('gagal reset data assignment, error => ', err)
                        this.refreshKey += 1
                    })
            }
        },

        async onGenerateMonitoring(item) {
            const prompt = await this.$_alert.confirm(
                'Generate Data Monitoring?',
                'Proses ini tidak dapat dikembalikan!',
                'Ya, Generate!', 'Batal', true
            )
            if (prompt.isConfirmed) {
                this.$_api.post(this.stageConfig.api.generateMonitoring, {
                    populate_id: item.id,
                    // monitoring_step: this.stageConfig.targetMonitoring,
                    program_year: item.program_year,
                    current_year: this.localPlantingYear,
                })
                    .then(() => {
                        this.$_alert.success(
                            `Berhasil Generate ke Monitoring ${this.stageConfig.targetMonitoring}!`
                        )
                        this.refreshKey += 1
                    })
                    .catch((err) => {
                        this.$_alert.error('Gagal Generate ke Monitoring!')
                        console.log('gagal generate ke monitoring, error =>', err)
                        this.refreshKey += 1
                    })
            }
        },

        async onDeletePopulate(item) {
            const prompt = await this.$_alert.confirm(
                'Hapus Data Populasi?',
                'Yakin Menghapus?',
                'Ya, Hapus!', 'Batal', true
            )

            if (prompt.isConfirmed) {
                const payload = {
                    id: item.id,
                    program_year: item.program_year,
                    current_year: this.localPlantingYear
                }
                this.stageConfig.deletePayloadKeys.forEach(k => payload[k] = (item[k]));
                this.$_api.post(this.stageConfig.api.delete, payload)
                    .then(() => {
                        this.$_alert.success('Berhasil menghapus data populasi!')
                        this.refreshKey += 1
                    })
                    .catch((err) => {
                        this.$_alert.error('Gagal menghapus data populasi!')
                        console.log('gagal menghapus data populasi, error =>', err)
                        this.refreshKey += 1
                    })
            }
        }
    }
}

</script>
