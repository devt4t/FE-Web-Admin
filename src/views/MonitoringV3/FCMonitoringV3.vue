<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="false"
        :hideCreate="false">
        <template v-slot:list-after-filter>
            <div class="d-flex flex-row justify-content-between">
                <!-- SWITCH DATA SOURCE -->
                <div>
                    <v-btn-toggle v-model="config.dataSource" mandatory color="primary" @change="refreshKey += 1">
                        <v-btn value="external" small>Data External (V3)</v-btn>
                        <v-btn value="internal" small>Data Internal (Employee)</v-btn>
                    </v-btn-toggle>
                </div>

                <div>
                    <v-btn color="success" class="mr-2" @click="isAssignModalOpen = true">
                        <v-icon small>mdi-account-arrow-right</v-icon>
                        <span class="ms-2">Assign Karyawan Lama</span>
                    </v-btn>
                </div>
            </div>

            <v-dialog v-model="isAssignModalOpen" max-width="500">
                <v-card>
                    <v-card-title>Assign Karyawan Lama</v-card-title>
                    <v-card-text class="pt-4">
                        <geko-input v-model="assignPayload.nik" :item="{
                            type: 'select',
                            label: 'Pilih Karyawan',
                            api: 'monitoring-officer-v3/fc/options',
                            param: {
                                // is_monitoring: 0 // => jika is_monitoring = 1 maka datanya tidak akan muncul alias dikecualikan
                                program_year: $store.state.tmpProgramYear
                            },
                            option: {
                                list_pointer: { label: 'name', code: 'nik', display: ['name', 'nik', 'users_email'] }
                            }
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
import { buildFCMonitoringConfig } from './config';
import { FC_BASE_FIELDS } from './config/fcMonitoring/fields.base';

export default {
    data() {
        return {
            config: buildFCMonitoringConfig(FC_BASE_FIELDS),
            refreshKey: 1,
            user: {},
            detailDataKey: 0,
            isAssignModalOpen: false,
            isAssignLoading: false,
            assignPayload: { nik: null, user_id: null }
        }
    },
    methods: {
        randomNik() {
            const randomNumber = Math.floor(Math.random() * 9000) + 1000;
            return `FC_MONV3_${Date.now()}_${randomNumber}`
        },

        async submitAssignExisting() {
            if (!this.assignPayload.nik) {
                return this.$_alert.error(null, "Harap pilih Karyawan terlebih dahulu.");
            }

            this.isAssignLoading = true;
            try {
                const payload = {
                    employee_nik: this.assignPayload.nik,
                    user_id: this.user.id,
                    program_year: this.$store.state.tmpProgramYear || localStorage.getItem('tmpProgramYear')
                }
                await this.$_api.post('monitoring-officer-v3/fc/assign', payload);

                this.$_alert.success(null, "Berhasil assign karyawan lama.");
                this.isAssignModalOpen = false;
                this.assignPayload.nik = null;
                this.assignPayload.user_id = null;

                this.refreshKey += 1;
            } catch (e) {
                console.error(e);
                this.$_alert.error(null, "Gagal melakukan assign");
            } finally {
                this.isAssignLoading = false;
            }
        }
    },
    mounted() {
        const userRoles = Array.isArray(this.$store.state.User.role)
            ? this.$store.state.User.role.map(String)
            : [String(this.$store.state.User.role)];

        const allowedRoles = ['13', '23', '3', '4', '44', '46'];
        const hasAccess = userRoles.some(role => allowedRoles.includes(role));

        if (!hasAccess) {
            this.$_alert.error(null, 'Anda tidak memiliki akses ke modul FC Monitoring V3.');
            this.$router.push('/');
            return;
        }


        this.user = JSON.parse(localStorage.getItem('User'))

        const generateNIK = this.randomNik();

        this.$set(this.config, "setter_ext_payload", {
            nik: generateNIK,
            user_id: this.$store.state.User.employee_no,
            position_no: '42',
            is_monitoring: 1,
        });
    },
}
</script>