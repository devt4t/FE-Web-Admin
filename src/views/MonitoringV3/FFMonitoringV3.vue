<template>
    <geko-base-crud v-if="hasCheckedAccess" :config="config" :refreshKey="refreshKey" :hideUpdate="true"
        :hideDelete="!isAssignedAsFC" :hideCreate="!isAssignedAsFC">
        <template v-slot:create-city="{ formData }">
            <v-col lg="6">
                <geko-input v-model="formData.city" :item="{
                    type: 'select',
                    label: 'Kota / Kabupaten',
                    api: 'GetKabupaten',
                    validation: [],
                    param: { province_code: formData.province },
                    option: {
                        getterKey: 'data.result',
                        list_pointer: { label: 'name', code: 'kabupaten_no', display: ['name'] },
                    },
                }" :disabled="!formData.province" />
            </v-col>
        </template>
        <!-- Slot Kecamatan -->
        <template v-slot:create-kecamatan="{ formData }">
            <v-col lg="6">
                <geko-input v-model="formData.kecamatan" :item="{
                    type: 'select',
                    label: 'Kecamatan',
                    api: 'GetKecamatan',
                    validation: [],
                    param: { kabupaten_no: formData.city },
                    option: {
                        getterKey: 'data.result',
                        list_pointer: { label: 'name', code: 'kode_kecamatan', display: ['name'] },
                    },
                }" :disabled="!formData.city" />
            </v-col>
        </template>

        <!-- Slot Desa/Village -->
        <template v-slot:create-village="{ formData }">
            <v-col lg="6">
                <geko-input v-model="formData.village" :item="{
                    type: 'select',
                    label: 'Desa',
                    api: 'GetDesa',
                    validation: [],
                    param: { kode_kecamatan: formData.kecamatan },
                    option: {
                        getterKey: 'data.result',
                        list_pointer: { label: 'name', code: 'kode_desa', display: ['name'] },
                    },
                }" :disabled="!formData.kecamatan" />
            </v-col>
        </template>

        <template v-slot:create-mu_no="{ formData }">
            <v-col md="12" class="form-separator">
                <h4>AREA KERJA</h4>
            </v-col>
            <v-col lg="6">
                <geko-input v-model="formData.mu_no" :item="{
                    type: 'select',
                    label: 'Management Unit',
                    api: 'GetManagementUnit',
                    validation: [],
                    param: {
                        program_year: formData.program_year,
                    },
                    option: {
                        getterKey: 'data.result',
                        list_pointer: {
                            label: 'name',
                            code: 'mu_no',
                            display: ['name'],
                        },
                    },
                }" />
            </v-col>
        </template>

        <template v-slot:create-target_area="{ formData }">
            <v-col lg="6">
                <geko-input v-model="formData.target_area" :item="{
                    type: 'select',
                    label: 'Target Area',
                    api: 'new-utilities/target-areas',
                    validation: [],
                    param: {
                        program_year: formData.program_year,
                        mu_no: formData.mu_no,
                    },
                    option: {
                        getterKey: 'data',
                        list_pointer: {
                            label: 'name',
                            code: 'area_code',
                            display: ['name'],
                        },
                    },
                }" />
            </v-col>
        </template>

        <template v-slot:create-working_area="{ formData }">
            <v-col lg="6">
                <geko-input v-model="formData.working_area" :item="{
                    type: 'select',
                    label: 'Working Area / Desa',
                    api: 'GetDesa',
                    validation: [],
                    param: {
                        program_year: formData.program_year,
                        kode_ta: formData.target_area,
                    },
                    option: {
                        getterKey: 'data.result',
                        list_pointer: {
                            label: 'name',
                            code: 'kode_desa',
                            display: ['name'],
                        },
                    },
                }" />
            </v-col>
        </template>

        <!-- list -->
        <template v-slot:list-indicator="{ item }">
            <div class="indicator-wrapper pt-1">
                <div class="indicator" :class="{
                    danger: item.active == 0,
                    success: item.active == 1,
                }"></div>
            </div>
        </template>

        <!-- button or filter -->
        <template v-slot:list-after-filter>
            <div class="d-flex flex-row justify-content-between">
                <!-- SWITCH DATA SOURCE -->
                <div>
                    <v-btn-toggle v-model="config.dataSource" mandatory color="primary" @change="refreshKey += 1">
                        <v-btn value="external" small>Data External (V3)</v-btn>
                        <v-btn value="internal" small>Data Internal (Employee)</v-btn>
                    </v-btn-toggle>
                </div>
                <div v-if="isAssignedAsFC">
                    <!-- Tombol Assign Existing -->
                    <v-btn color="success" class="mr-2" @click="isAssignModalOpen = true">
                        <v-icon small>mdi-account-arrow-right</v-icon>
                        <span class="ms-2">Assign Karyawan</span>
                    </v-btn>
                </div>
            </div>

            <!-- TINY MODAL FOR ASSIGN EXISTING -->
            <v-dialog v-model="isAssignModalOpen" max-width="500">
                <v-card>
                    <v-card-title>Assign Karyawan FF</v-card-title>
                    <v-card-text class="pt-4">
                        <geko-input v-model="assignPayload.ff_no" :item="{
                            type: 'select',
                            label: 'Pilih Karyawan',
                            api: 'monitoring-officer-v3/ff/options/public',
                            param: {
                                program_year: $store.state.tmpProgramYear,
                                is_monitoring: null // => jika is_monitoring = 1 maka datanya tidak akan muncul alias dikecualikan
                            },
                            option: {
                                getterKey: 'data',
                                list_pointer: { label: 'name', code: 'ff_no', display: ['name', 'ff_no'] }
                            },
                        }" />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="isAssignModalOpen = false">Batal</v-btn>
                        <v-btn color="primary" @click="submitAssignExisting">Assign Karyawan</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
    </geko-base-crud>
</template>

<script>
import { buildFFMonitoringConfig } from './config';
import { FF_BASE_FIELDS } from './config/ffMonitoring/fields.base';

export default {
    data() {
        return {
            config: buildFFMonitoringConfig(FF_BASE_FIELDS),
            refreshKey: 1,
            user: {},
            detailDataKey: 0,
            isAssignModalOpen: false,
            isAssignLoading: false,
            assignPayload: { ff_no: null, user_id: null },
            isAssignedAsFC: false,
            hasCheckedAccess: false,
        }
    },
    methods: {
        async submitAssignExisting() {

            if (!this.assignPayload.ff_no) {
                return this.$_alert.error(null, "Harap pilih FF terlebih dahulu.");
            }

            this.isAssignLoading = true;

            try {
                const payload = {
                    ff_no: this.assignPayload.ff_no,
                    user_id: this.user.id,
                    program_year: this.$store.state.tmpProgramYear,
                };

                console.log('[DEBUG] assign payload', payload);

                await this.$_api.post('monitoring-officer-v3/ff/assign', payload);

                this.$_alert.success(null, "Berhasil assign FF.");
                this.isAssignModalOpen = false;
                this.assignPayload.ff_no = null;
                this.assignPayload.user_id = null;
                this.refreshKey += 1;
            } catch (e) {
                console.error('[DEBUG] assign error', e);
                this.$_alert.error(null, 'Gagal melakukan assign data FF,')
            } finally {
                this.isAssignLoading = false;
            }
        },

        async checkAssignedFC() {
            try {
                const programYear = this.$store.state.tmpProgramYear || localStorage.getItem('tmpProgramYear');

                const [externalRes, internalRes] = await Promise.all([
                    this.$_api.get('monitoring-officer-v3/fc/list', {
                        is_external: true,
                        program_year: programYear
                    }),
                    this.$_api.get('monitoring-officer-v3/fc/list', {
                        is_external: false,
                        program_year: programYear
                    })
                ]);

                const externalRows = externalRes?.data || [];
                const internalRows = internalRes?.data || [];
                const allFCRows = [...externalRows, ...internalRows];

                const currentEmployeeNo = String(this.user.employee_no || '');
                const currentNik = String(this.user.nik || '');

                this.isAssignedAsFC = allFCRows.some(item => {
                    const itemEmployeeNo = String(item.employee_no || '');
                    const itemNik = String(item.nik || '');

                    return (
                        itemEmployeeNo === currentEmployeeNo ||
                        itemNik === currentEmployeeNo ||
                        itemEmployeeNo === currentNik ||
                        itemNik === currentNik
                    );
                });

                console.log('[DEBUG] user', this.user);
                console.log('[DEBUG] programYear', programYear);
                console.log('[DEBUG] externalRes', externalRes);
                console.log('[DEBUG] internalRes', internalRes);


            } catch (e) {
                console.error("Gagal mengecek assignment FC", e);
                this.isAssignedAsFC = false;
            } finally {
                this.hasCheckedAccess = true;

                if (!this.isAssignedAsFC) {
                    this.$_alert.error(
                        null,
                        "Anda belum terdaftar/di-assign sebagai FC di Monitoring V3. Fitur penambahan FF dinonaktifkan."
                    );
                }
            }
        }

    },
    async mounted() {
        this.user = JSON.parse(localStorage.getItem('User') || '{}');

        // Base payload
        const payload = {
            user_id: this.user.employee_no,
            position_no: '43',
            is_monitoring: 1,
            fc_no: this.user.employee_no,
            active: '1'
        };

        this.$set(this.config, "setter_ext_payload", payload);

        // Lakukan Preemptive Check
        await this.checkAssignedFC();
    },
}
</script>