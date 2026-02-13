<template>
    <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
        <v-card>
            <v-card-title>
                <span class="headline">Assignment Data Populasi</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="formData.populate_no" label="Kode Populasi" disabled
                                outlined></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="formData.monitoring_no" label="Kode Realisasi Tanam" disabled
                                outlined></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="formData.lahan_no" label="Nomor Lahan" disabled
                                outlined></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-select v-model="formData.sampling" :items="samplingOptions" label="Metode Sampling"
                                outlined item-text="name" item-value="code"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <geko-input v-model="formData.assigned_to" :item="{
                                label: 'FF Petugas Monitoring',
                                type: 'select',
                                validation: ['required'],
                                api: 'GetFFAllWeb_new',
                                param: {
                                    limit: 20,
                                },
                                option: {
                                    multiple: false,
                                    default_label: formData.field_facilitators_name,
                                    getterKey: 'data',
                                    list_pointer: {
                                        code: 'ff_no',
                                        label: 'name',
                                        display: ['name', 'ff_no'],
                                    },
                                },
                            }"></geko-input>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="closeDialog">Batal</v-btn>
                <v-btn color="green darken-1" text @click="saveAssignment" :loading="loading">Simpan</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "LahanUmumMonitoringPopulatePertamaAssignmentForm",
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
        dataKey: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            dialog: false,
            loading: false,
            formData: {
                id: null,
                populate_no: "",
                monitoring_no: "",
                lahan_no: "",
                sampling: "",
                assigned_to: "",
                field_facilitators_name: "",
            },
            samplingOptions: [
                { name: "Tetap", code: "Tetap" },
                { name: "Random", code: "Random" },
            ],
        };
    },
    watch: {
        dataKey: {
            handler(val) {
                if (val > 0 && this.data) {
                    this.formData = {
                        id: this.data.id,
                        populate_no: this.data.populate_no || "",
                        monitoring_no: this.data.monitoring_no || "",
                        lahan_no: this.data.lahan_no || "",
                        sampling: this.data.sampling || "",
                        assigned_to: this.data.assigned_to || "",
                        field_facilitators_name: this.data.field_facilitators_name || "",
                    };
                    this.dialog = true;
                }
            },
        },
    },
    methods: {
        closeDialog() {
            this.dialog = false;
            this.resetForm();
        },
        resetForm() {
            this.formData = {
                id: null,
                populate_no: "",
                monitoring_no: "",
                lahan_no: "",
                sampling: "",
                assigned_to: "",
                field_facilitators_name: "",
            };
        },
        async saveAssignment() {
            if (!this.formData.sampling || !this.formData.assigned_to) {
                this.$_alert.error("Harap lengkapi semua data yang diperlukan!");
                return;
            }

            this.loading = true;
            try {
                await this.$_api.post("general-land/populate-monitoring/1-to-2/update-assignment", {
                    id: this.formData.id,
                    sampling: this.formData.sampling,
                    assigned_to: this.formData.assigned_to,
                });
                this.$_alert.success("Berhasil menyimpan assignment data populasi!");
                this.$emit("success");
                this.closeDialog();
            } catch (error) {
                this.$_alert.error("Gagal menyimpan assignment data populasi!");
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
