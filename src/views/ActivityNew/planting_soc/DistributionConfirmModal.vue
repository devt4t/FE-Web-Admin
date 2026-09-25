<template>
    <v-dialog v-model="isOpen" max-width="900px">
        <v-card>
            <v-card-title class="headline bg-primary text-white">
                Konfirmasi Jadwal Distribusi AZ (Per FF)
            </v-card-title>
            <v-card-text class="pt-5">
                <v-row>
                    <v-col cols="12" v-if="isOpen">
                        <geko-input :item="{
                            id: 'ff_no',
                            type: 'select',
                            label: 'Pilih Field Facilitator (Khusus Projek AZ)',
                            placeholder: 'Ketik No FF / Nama FF',
                            api: 'distribution-request/list-ff-az',
                            setter: 'ff_no',
                            param: {
                                program_year: this.$store.state.tmpProgramYear,
                            },
                            option: {
                                getterKey: 'data.result.data',
                                list_pointer: {
                                    code: 'ff_no',
                                    label: 'name',
                                    display: ['name', 'ff_no'],
                                },
                            },
                        }" v-model="selectedFF" />
                    </v-col>
                </v-row>

                <!-- Tabel Preview Lahan (Muncul jika FF dipilih) -->
                <v-row v-show="selectedFF">
                    <v-col cols="12">
                        <p class="font-weight-bold mb-2">Preview Lahan AZ Milik FF:</p>
                        <v-data-table :headers="previewHeaders" :items="previewLahans" hide-default-footer
                            class="elevation-1" :loading="isLoadingPreview" loading-text="Memuat data lahan...">
                            <template v-slot:item.distribution_confirmation_status="{ item }">
                                <v-chip color="info" small v-if="item.distribution_confirmation_status">
                                    {{ item.distribution_confirmation_status }}
                                </v-chip>
                                <span v-else>-</span>
                            </template>
                            <!-- Badge Sostam -->
                            <template v-slot:item.sostam_badge="{ item }">
                                <v-chip :color="item.sostam_color" small>
                                    {{ item.sostam_badge }}
                                </v-chip>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>

                <!-- Opsi Konfirmasi -->
                <v-row v-if="previewLahans.length > 0 && !isLoadingPreview">
                    <v-col cols="12">
                        <v-radio-group v-model="confirmAction" row label="Aksi Eksekusi:">
                            <v-radio label="GO (Sesuai Jadwal)" value="GO"></v-radio>
                            <v-radio label="DELAY (Tunda)" value="DELAY"></v-radio>
                            <v-radio label="CANCEL (Batal)" value="CANCEL"></v-radio>
                        </v-radio-group>
                    </v-col>

                    <!-- Muncul jika pilih DELAY -->
                    <v-col cols="12" v-if="confirmAction === 'DELAY'">
                        <v-radio-group v-model="delayType" row>
                            <v-radio label="Auto (+7 Hari dari jadwal)" value="auto"></v-radio>
                            <v-radio label="Manual (Pilih Tanggal)" value="manual"></v-radio>
                        </v-radio-group>

                        <v-menu v-if="delayType === 'manual'" v-model="dateMenu" :close-on-content-click="false"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="newDate" label="Pilih Tanggal Baru" prepend-icon="mdi-calendar"
                                    readonly v-bind="attrs" v-on="on" outlined dense></v-text-field>
                            </template>
                            <v-date-picker v-model="newDate" @input="dateMenu = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" @click="isOpen = false">Batal</v-btn>
                <v-btn color="primary" @click="submitConfirmation" :disabled="!isSubmitValid" :loading="isSubmitting">
                    Submit Konfirmasi
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "DistributionConfirmModal",
    data() {
        return {
            isOpen: false,
            selectedFF: null,
            previewLahans: [],
            isLoadingPreview: false,
            confirmAction: null,
            delayType: "auto",
            newDate: null,
            dateMenu: false,
            isSubmitting: false,
            previewHeaders: [
                { text: "No Lahan", value: "lahan_no" },
                { text: "Nama Petani", value: "farmer_name" },
                { text: "Tgl Distribusi", value: "distribution_time" },
                { text: "Status Saat Ini", value: "distribution_confirmation_status" },
                { text: "Status Sostam", value: "sostam_badge" },
            ],
        };
    },
    watch: {
        selectedFF(newVal) {
            if (newVal) {
                this.fetchPreviewLahan();
            } else {
                this.previewLahans = [];
            }
        }
    },
    methods: {
        open() {
            this.isOpen = true;
            this.selectedFF = null;
            this.previewLahans = [];
            this.confirmAction = null;
            this.newDate = null;
            this.delayType = "auto";
        },
        async fetchPreviewLahan() {
            if (!this.selectedFF) return;
            this.previewLahans = []; // Reset tabel setiap ganti FF
            this.isLoadingPreview = true;

            try {
                // Memberikan delay kecil agar animasi loading terlihat mulus (UX)
                await new Promise((r) => setTimeout(r, 400));

                const py = this.$store.state.tmpProgramYear;
                const res = await this.$_api.get(
                    `distribution-request/preview-lahan-az?ff_no=${this.selectedFF}&program_year=${py}`
                );

                if (res?.data?.status?.code === 200) {
                    this.previewLahans = res.data.result || [];
                } else {
                    throw new Error(
                        res?.data?.status?.description || "Gagal memuat preview lahan"
                    );
                }
            } catch (err) {
                console.error("[fetchPreviewLahan] Error:", err);
                this.$_alert.error(
                    err?.response?.data?.data?.status?.description ||
                    err?.response?.data?.message ||
                    err.message ||
                    "Gagal memuat preview lahan"
                );
            } finally {
                this.isLoadingPreview = false;
            }
        },
        async submitConfirmation() {
            this.isSubmitting = true;
            try {
                const py = this.$store.state.tmpProgramYear;
                const payload = {
                    ff_no: this.selectedFF,
                    program_year: py,
                    action: this.confirmAction,
                    new_date: this.delayType === "manual" ? this.newDate : null,
                };

                const res = await this.$_api.post(
                    "distribution-request/confirm-by-ff",
                    payload
                );

                if (res?.data?.status?.code === 200) {
                    this.$_alert.success(
                        res.data.status.description || "Konfirmasi Distribusi Berhasil"
                    );
                    this.isOpen = false;
                    this.$emit("refresh");
                } else {
                    throw new Error(
                        res?.data?.status?.description ||
                        "Gagal melakukan konfirmasi pelaksanaan distribusi."
                    );
                }
            } catch (err) {
                console.error("[submitConfirmation] Error:", err);
                this.$_alert.error(
                    err?.response?.data?.data?.status?.description ||
                    err?.response?.data?.message ||
                    err.message ||
                    "Terjadi kesalahan saat memproses konfirmasi"
                );
            } finally {
                this.isSubmitting = false;
            }
        },
    },
    computed: {
        isSubmitValid() {
            if (!this.selectedFF || !this.confirmAction) return false;
            if (
                this.confirmAction === "DELAY" &&
                this.delayType === "manual" &&
                !this.newDate
            )
                return false;
            return true;
        },
    },
};
</script>
