<template>
    <v-dialog v-model="isOpen" :width="step === 1 ? '50%' : '90%'" :style="{ 'min-height': '90vh' }">
        <v-card>
            <v-card-title class="text-center d-block font-weight-bold">
                Bulk Import Data Mitigasi Lahan (Risk Tier)
            </v-card-title>

            <v-card-text>
                <!-- UPLOAD EXCEL -->
                <div class="upload d-flex flex-column" v-if="step === 1">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <p class="mb-0 text-muted">Silakan unggah file Excel yang berisi daftar Kode Lahan.</p>
                        <v-btn small outlined color="primary" @click="downloadTemplate">
                            <v-icon small class="mr-1">mdi-download</v-icon> Download Template
                        </v-btn>
                    </div>

                    <!-- <div class="mb-4">
                        <geko-input v-model="selectedProject" :item="{
                            id: 'project_no',
                            type: 'select',
                            label: 'Pilih Project (Wajib)',
                            placeholder: 'Ketik Nama / Kode Project',
                            api: 'GetProjectAllAdmin',
                            option: {
                                list_pointer: {
                                    code: 'project_no',
                                    label: 'project_name',
                                    display: ['project_name', 'project_no']
                                }
                            }
                        }" />
                    </div> -->

                    <div class="upload-file-wrapper text-center border p-5 d-flex align-center justify-center"
                        style="border-style: dashed !important; border-radius: 8px; width: 8em; height: 8em;">
                        <label for="excelFile" class="cursor-pointer">
                            <v-icon>mdi-file-excel</v-icon>
                            <p class="mt-3">Pilih File Excel</p>
                        </label>
                        <input id="excelFile" type="file" class="d-none" accept=".xlsx, .xls"
                            @change="handleFileChange" />
                    </div>
                    <p class="text-muted mb-0 mt-4" v-if="!file">Belum ada file yang dipilih</p>
                    <p class="text-success mb-0 mt-4 font-weight-bold" v-else>{{ file.name }}</p>

                    <div class="d-flex flex-row justify-content-center mt-4">
                        <v-btn @click="processExcel" variant="success" :disabled="!file || loading">
                            <v-icon v-if="!loading">mdi-arrow-right</v-icon>
                            <v-progress-circular v-else :size="20" color="white" indeterminate></v-progress-circular>
                            <span class="ml-1">Lanjut ke Preview</span>
                        </v-btn>
                    </div>
                </div>

                <!-- PREVIEW DATAGRID -->
                <div class="result d-flex flex-column" v-if="step === 2">
                    <ValidationObserver ref="formObserver" v-slot="{ handleSubmit }">
                        <form @submit.prevent="handleSubmit(submitData)" autocomplete="off">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <p class="mb-0">
                                    Total Lahan: <strong>{{ data.length }}</strong>
                                </p>
                                <v-btn small variant="light-danger" @click="resetForm">
                                    <v-icon small class="mr-1">mdi-arrow-left</v-icon> Kembali Upload
                                </v-btn>
                            </div>

                            <div class="table-wrapper" style="width: 100%; overflow-x: auto; max-height: 60vh;">
                                <table class="geko-table">
                                    <thead>
                                        <tr>
                                            <th style="width: 50px;">#</th>
                                            <th style="min-width: 150px;">Kode Lahan</th>
                                            <th style="min-width: 150px;">Nama Petani</th>
                                            <th style="min-width: 150px;">Titik Koordinat (lat,long)</th>
                                            <th style="min-width: 150px;">Kelerengan (Slope)</th>
                                            <th style="min-width: 220px;">Akses Irigasi</th>
                                            <th style="min-width: 220px;">Tekstur Tanah</th>
                                            <th style="min-width: 200px;">Risk Tier (Auto)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, i) in data" :key="`row-${i}`">
                                            <td>{{ i + 1 }}</td>
                                            <td class="font-weight-bold text-link">{{ item.lahan_no }}</td>
                                            <td class="font-weight-bold text-link">{{ item.farmer_name }}</td>
                                            <td class="font-weight-bold text-link">{{ item.latitude }}, {{
                                                item.longitude }}</td>
                                            <td>
                                                <span class="badge bg-light text-dark">{{ item.kelerengan_lahan ||
                                                    'Tidak Diketahui' }}</span>
                                            </td>
                                            <td>
                                                <geko-input v-model="item.irrigation_access"
                                                    @input="calculateRiskTier(item)" :item="{
                                                        type: 'select',
                                                        validation: ['required'],
                                                        hide_label: true,
                                                        placeholder: 'Pilih Irigasi',
                                                        option: {
                                                            default_options: options.irrigation,
                                                            list_pointer: { label: 'label', code: 'code', display: ['label'] }
                                                        }
                                                    }" />
                                            </td>
                                            <td>
                                                <geko-input v-model="item.soil_texture" :item="{
                                                    type: 'select',
                                                    validation: ['required'],
                                                    hide_label: true,
                                                    placeholder: 'Pilih Tekstur Tanah',
                                                    option: {
                                                        default_options: options.soil_texture,
                                                        list_pointer: { label: 'label', code: 'code', display: ['label'] }
                                                    }
                                                }" />
                                            </td>
                                            <td>
                                                <geko-input v-model="item.risk_tier" :item="{
                                                    type: 'select',
                                                    validation: ['required'],
                                                    hide_label: true,
                                                    placeholder: 'Pilih Risk Tier',
                                                    option: {
                                                        default_options: options.risk_tier,
                                                        list_pointer: { label: 'label', code: 'code', display: ['label'] }
                                                    }
                                                }" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="d-flex flex-row justify-content-center mt-4">
                                <v-btn variant="success" type="submit" :disabled="loading">
                                    <v-icon v-if="!loading">mdi-content-save-all</v-icon>
                                    <v-progress-circular v-else :size="20" color="white"
                                        indeterminate></v-progress-circular>
                                    <span class="ml-1">Simpan Data Mitigasi</span>
                                </v-btn>
                            </div>
                        </form>
                    </ValidationObserver>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import * as XLSX from "xlsx";

export default {
    name: "lahan-mitigasi-import-modal",
    props: {
        dataKey: {
            type: Number,
            required: true,
        },
    },
    watch: {
        dataKey(val) {
            if (val > 0) {
                this.isOpen = true;
                this.resetForm();
            }
        },
    },
    data() {
        return {
            isOpen: false,
            step: 1,
            loading: false,
            file: null,
            data: [],
            rawLahanNos: [],
            selectedProject: null,
            specifictProjects: ['PJ00035', 'PJ00044'],
            options: {
                irrigation: [
                    { label: 'None (Tidak ada)', code: 'none' },
                    { label: 'Partial-Seasonal (Musiman)', code: 'partial-seasonal' },
                    { label: 'Full Year (Sepanjang tahun)', code: 'full-year' },
                ],
                soil_texture: [
                    { label: 'Lempung (Loam)', code: 'loam' },
                    { label: 'Lempung Berpasir (Sandy Loam)', code: 'sandy-loam' },
                    { label: 'Lempung Berdebu (Silt Loam)', code: 'silt-loam' },
                    { label: 'Lempung Liat Berpasir (Sandy clay loam)', code: 'sandy-clay-loam' },
                    { label: 'Liat Berdebu (Silty clay)', code: 'silty-clay' },
                ],
                risk_tier: [
                    { label: 'Tier A (Lereng, tanpa irigasi)', code: 'A' },
                    { label: 'Tier B (Lereng, parsial/musiman)', code: 'B' },
                    { label: 'Tier C (Datar, tanpa irigasi)', code: 'C' },
                    { label: 'Tier D (Datar, irigasi sepanjang tahun)', code: 'D' },
                ]
            }
        };
    },
    methods: {
        resetForm() {
            this.step = 1;
            this.file = null;
            this.data = [];
            this.rawLahanNos = [];
            this.selectedProject = null;
            this.loading = false;

            this.$nextTick(() => {
                const fileInput = document.getElementById('excelFile');
                if (fileInput) {
                    fileInput.value = '';
                }
            });
        },
        downloadTemplate() {
            const templateData = [
                { "Kode Lahan": "Contoh: 10_0000001123" }
            ];
            const worksheet = XLSX.utils.json_to_sheet(templateData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Template Mitigasi");
            XLSX.writeFile(workbook, "Template_Import_Mitigasi_Lahan.xlsx");
        },
        handleFileChange(e) {
            const files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            this.file = files[0];
        },
        async processExcel() {
            if (!this.file) return;
            this.loading = true;

            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const rawJson = XLSX.utils.sheet_to_json(worksheet);

                if (rawJson.length === 0) {
                    this.$_alert.error("File Excel kosong");
                    this.loading = false;
                    return;
                }

                const mappedJson = rawJson.map(row => {
                    return row['Kode Lahan'] || row['lahan_no'] || null;
                }).filter(item => item !== null);

                if (mappedJson.length === 0) {
                    this.$_alert.error("Format salah! Kolom 'Kode Lahan' tidak ditemukan.");
                    this.loading = false;
                    return;
                }

                this.rawLahanNos = mappedJson;
                await this.fetchExistingLahanData();
            };
            reader.readAsArrayBuffer(this.file);
        },
        async fetchExistingLahanData() {
            try {
                // Fetch existing lahan data strictly by project_no
                const response = await this.$_api.post("lahan/bulk-mitigation-preview", {
                    project_no: this.specifictProjects,
                    lahans: this.rawLahanNos
                });

                let fetchedLahans = [];
                if (Array.isArray(response.data)) {
                    fetchedLahans = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    fetchedLahans = response.data.data;
                } else if (response.result && Array.isArray(response.result)) {
                    fetchedLahans = response.result;
                } else if (Array.isArray(response)) {
                    fetchedLahans = response;
                }

                if (fetchedLahans.length === 0) {
                    this.$_alert.error("Tidak ada data lahan dari file Excel yang terdaftar pada Project ini.");
                    this.loading = false;
                    return;
                }

                if (fetchedLahans.length < this.rawLahanNos.length) {
                    const countRejected = this.rawLahanNos.length - fetchedLahans.length;
                    this.$_alert.custom({
                        title: 'Perhatian',
                        icon: 'warning',
                        text: `${countRejected} lahan dilewati karena tidak terdaftar di Projek AZ 2026`,
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#81fcf6',
                        showCancelButton: false,
                        showCloseButton: true,
                    });
                }

                this.data = fetchedLahans.map(lahan => {
                    return {
                        lahan_no: lahan.lahan_no,
                        farmer_name: lahan.farmer_name || '-',
                        latitude: lahan.latitude || '-',
                        longitude: lahan.longitude || '-',
                        kelerengan_lahan: lahan.kelerengan_lahan || '-',
                        irrigation_access: lahan.irrigation_access || null,
                        soil_texture: lahan.soil_texture || null,
                        risk_tier: lahan.risk_tier || null,
                    };
                });
                this.step = 2;
            } catch (err) {
                console.error(err);
                this.$_alert.error("Terjadi kesalahan saat memproses data.");
            } finally {
                this.loading = false;
            }
        },
        calculateRiskTier(item) {
            if (!item.irrigation_access) return;

            const slope = String(item.kelerengan_lahan || "").toLowerCase();
            const isFlat = slope.includes("datar");
            const irigasi = item.irrigation_access;

            if (!isFlat) {
                if (irigasi === "none") item.risk_tier = "A";
                else if (irigasi === "partial-seasonal") item.risk_tier = "B";
                else item.risk_tier = "B";
            } else {
                if (irigasi === "none") item.risk_tier = "C";
                else if (irigasi === "full-year") item.risk_tier = "D";
                else item.risk_tier = "C";
            }
        },
        async submitData() {
            this.loading = true;
            try {
                const payload = {
                    data: this.data.map(item => ({
                        lahan_no: item.lahan_no,
                        irrigation_access: item.irrigation_access,
                        soil_texture: item.soil_texture,
                        risk_tier: item.risk_tier
                    }))
                };

                await this.$_api.post("lahan/bulk-update/mitigation", payload);

                this.$_alert.success("Data mitigasi lahan berhasil diupdate secara massal.");
                this.isOpen = false;
                this.$emit('refresh'); // Memicu refresh tabel utama di Lahan.vue
            } catch (err) {
                console.error(err);
                this.$_alert.error("Gagal menyimpan data mitigasi.");
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>