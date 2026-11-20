<template>
    <v-dialog v-model="isOpen" max-width="950px" persistent>
        <v-card>
            <v-card-title class="headline bg-primary text-white">
                Assign Lahan Sampel Pra-Penlub
            </v-card-title>
            <v-card-text class="pt-5">
                <v-row dense class="mb-2">
                    <v-col cols="12" md="6">
                        <div class="text-caption text--secondary">Field Facilitator</div>
                        <div class="font-weight-bold">
                            {{ targetItem ? `${targetItem.field_facilitators_name} (${targetItem.ff_no})` : "-" }}
                        </div>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="activityDate" label="Tanggal Rencana Kegiatan *"
                                    prepend-icon="mdi-calendar" readonly outlined dense v-bind="attrs" v-on="on"
                                    hide-details="auto" />
                            </template>
                            <v-date-picker v-model="activityDate" @input="dateMenu = false" />
                        </v-menu>
                    </v-col>
                </v-row>

                <v-alert type="info" dense text class="my-3">
                    Pilih lahan sampel untuk FF ini. Lahan yang sudah dicek di Mobile App tidak dapat dihapus dari
                    daftar sampel.
                </v-alert>

                <v-data-table :headers="headers" :items="lahans" :loading="isLoading" dense class="elevation-1"
                    :items-per-page="10" loading-text="Memuat daftar lahan FF...">
                    <template v-slot:item.selected="{ item }">
                        <v-checkbox v-model="selectedLahans" :value="item.lahan_no" :disabled="Boolean(item.checked_at)"
                            hide-details dense class="mt-0 pt-0" />
                    </template>
                    <template v-slot:item.risk_tier="{ item }">
                        <v-chip small v-if="item.risk_tier"
                            :color="item.risk_tier === 'A' ? 'red' : item.risk_tier === 'B' ? 'orange' : 'green'"
                            text-color="white">
                            Tier {{ item.risk_tier }}
                        </v-chip>
                        <span v-else>-</span>
                    </template>
                    <template v-slot:item.checked_at="{ item }">
                        <v-chip small color="success" v-if="item.checked_at">Sudah Dicek</v-chip>
                        <span v-else class="text--secondary">Belum Dicek</span>
                    </template>
                </v-data-table>
            </v-card-text>
            <v-card-actions>
                <span class="text-caption ml-3">Terpilih: <strong>{{ selectedLahans.length }}</strong> lahan</span>
                <v-spacer />
                <v-btn text color="grey" @click="isOpen = false" :disabled="isSubmitting">Batal</v-btn>
                <v-btn color="primary" @click="submitAssign" :loading="isSubmitting"
                    :disabled="!activityDate || selectedLahans.length === 0">
                    Simpan Sampel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "SampleAssignModal",
    data() {
        return {
            isOpen: false,
            isLoading: false,
            isSubmitting: false,
            dateMenu: false,
            targetItem: null,
            activityDate: null,
            lahans: [],
            selectedLahans: [],
            headers: [
                { text: "Pilih", value: "selected", sortable: false, width: "60px" },
                { text: "No. Lahan", value: "lahan_no" },
                { text: "Petani", value: "farmer_name" },
                { text: "Irigasi (GIS)", value: "irrigation_access" },
                { text: "Tekstur (GIS)", value: "soil_texture" },
                { text: "Risk Tier (GIS)", value: "risk_tier" },
                { text: "Status Cek Mobile", value: "checked_at" },
            ],
        };
    },
    methods: {
        async open(item) {
            this.targetItem = item;
            this.activityDate = item.activity_date || null;
            this.lahans = [];
            this.selectedLahans = [];
            this.isOpen = true;
            await this.fetchFFLahans();
        },
        async fetchFFLahans() {
            this.isLoading = true;
            try {
                const res = await this.$_api.get(
                    `pre-planting-hole/ff-lahans?ff_no=${this.targetItem.ff_no}&program_year=${this.targetItem.program_year}`
                );
                const payload = res?.data || res;
                this.lahans = payload.lahans || [];
                this.selectedLahans = this.lahans
                    .filter((l) => Number(l.is_selected_sample) === 1)
                    .map((l) => l.lahan_no);
                if (payload.assessment && payload.assessment.activity_date) {
                    this.activityDate = payload.assessment.activity_date;
                }
            } catch (err) {
                this.$_alert.error(err?.response?.data?.message || "Gagal memuat daftar lahan FF.");
            } finally {
                this.isLoading = false;
            }
        },
        async submitAssign() {
            this.isSubmitting = true;
            try {
                await this.$_api.post("pre-planting-hole/assign-samples", {
                    ff_no: this.targetItem.ff_no,
                    soc_no: this.targetItem.soc_no,
                    program_year: String(this.targetItem.program_year),
                    activity_date: this.activityDate,
                    lahan_nos: this.selectedLahans,
                });
                this.$_alert.success("Berhasil menyimpan assignment lahan sampel.");
                this.isOpen = false;
                this.$emit("refresh");
            } catch (err) {
                this.$_alert.error(err?.response?.data?.message || "Gagal menyimpan assignment sampel.");
            } finally {
                this.isSubmitting = false;
            }
        },
    },
};
</script>