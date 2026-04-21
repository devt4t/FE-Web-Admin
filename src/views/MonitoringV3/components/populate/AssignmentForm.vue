<template>
    <!-- pakai renderKey agar komponen ini bisa rerender saat data berubah -->
    <v-dialog v-model="isOpen" width="70%" :key="renderKey">
        <v-card v-if="data">
            <v-card-title>
                {{ isEditing ? 'Edit' : 'Lengkapi' }} Data Populasi / Assignment Form
            </v-card-title>
            <v-card-text class="pt-4">
                <v-row>
                    <v-col cols="12" md="6">
                        <geko-input v-model="formValue.sampling" :item="samplingField" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <geko-input v-model="formValue.assigned_to" :item="assignedToField" />
                    </v-col>
                </v-row>

                <div class="d-flex justify-content-end mt-4">
                    <v-btn variant="secondary" text class="mr-2" @click="isOpen = false">
                        Batal
                    </v-btn>
                    <v-btn variant="primary" @click="onSubmit" :loading="isLoading">
                        <v-icon small class="mr-1">mdi-pencil-outline</v-icon>
                        <span>Simpan Data</span>
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { POPULATE_STAGE_REGISTRY } from '../../config/populate/stages'

export default {
    props: {
        data: { required: false },
        dataKey: { type: Number, default: 0 },
        stage: { type: [String, Number], required: true }
    },
    data() {
        return {
            isOpen: false,
            isLoading: false,
            renderKey: 1,

            // Local state untuk hold data dari form
            formValue: {
                sampling: null,
                assigned_to: null,
            },

            // Definisi property dari geko-input
            samplingField: {
                id: 'sampling',
                label: 'Metode Sampling',
                type: 'select',
                validation: ['required'],
                option: {
                    default_options: [
                        { name: 'Sensus', code: 'Sensus' },
                        { name: 'Sampling', code: 'Sampling' }
                    ],
                    list_pointer: { code: 'code', label: 'name', display: ['name'] }
                }
            },
            assignedToField: {
                id: 'assigned_to',
                type: 'select',
                label: 'Petugas FF Monitoring',
                api: 'GetFFAllWeb_new',
                param: {
                    is_monitoring: 0,
                    active: 1,
                    program_year: this.$store.state.tmpProgramYear || localStorage.getItem('tmpProgramYear')
                },
                option: {
                    getterKey: 'data',
                    list_pointer: {
                        label: 'name',
                        code: 'ff_no',
                        display: ['name', 'ff_no']
                    }
                },
            }
        }
    },
    computed: {
        isEditing() {
            if (!this.data) return false;
            return !(
                (this.data.assigned_to == '-' && this.data.sampling == '-') ||
                (this.data.assigned_to == null && this.data.sampling == null)
            );
        },
        stageConfig() {
            return POPULATE_STAGE_REGISTRY[this.stage];
        }
    },
    watch: {
        dataKey() {
            if (this.data) {
                this.formValue = {
                    sampling: this.data.sampling !== '-' ? this.data.sampling : null,
                    assigned_to: this.data.assigned_to !== '-' ? this.data.assigned_to : null,
                    mu_no: this.data.mu_no
                };

                this.isOpen = true;
                this.renderKey += 1;
            }
        }
    },
    methods: {
        validate() {
            if (!this.formValue.sampling) return false;
            if (!this.formValue.assigned_to) return false;
            return true;
        },
        onSubmit() {
            if (!this.validate()) {
                this.$_alert.error('Harap lengkapi semua data form!');
                return;
            }

            this.isLoading = true;

            const payload = {
                id: this.data.id,
                monitoring_step: this.stageConfig.stageNumber,
                program_year: this.data.program_year,
                sampling: this.formValue.sampling,
                assigned_to: this.formValue.assigned_to
            };

            this.$_api.post(this.stageConfig.api.assignment, payload)
                .then(() => {
                    this.$_alert.success('Assignment Berhasil Disimpan!');
                    this.isOpen = false;
                    this.$emit('success'); // trigger refresh tabel di parent
                })
                .catch((err) => {
                    console.error('assignment populate fail => ', err);
                    this.$_alert.error('Gagal Memproses Assignment!');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
}
</script>
