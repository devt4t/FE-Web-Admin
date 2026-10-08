<template>
    <v-dialog v-model="isOpen" max-width="500px">
        <v-card>
            <v-card-title class="d-flex justify-content-between align-items-center">
                <span class="text-h5">Import Excel Mitigasi Lahan</span>
                <v-btn small outlined color="primary" @click="downloadTemplate">
                    <v-icon small class="mr-1">mdi-download</v-icon> Download Template
                </v-btn>
            </v-card-title>
            <v-card-text>
                <div v-if="!file">
                    <div class="upload-file-wrapper text-center border p-5 d-flex flex-column align-center justify-center cursor-pointer"
                        style="border-style: dashed !important; border-radius: 8px;" @click="$refs.excelFile.click()">
                        <v-icon size="40">mdi-file-excel</v-icon>
                        <p class="mt-3 mb-0">Klik Untuk Memilih File Excel</p>
                    </div>
                    <input ref="excelFile" type="file" class="d-none" accept=".xlsx, .xls" @change="handleFileChange" />
                </div>
                <div v-else class="text-center pt-4">
                    <v-icon size="40" color="success" class="mb-2">mdi-check-circle</v-icon>
                    <p class="text-success mb-0 font-weight-bold">{{ file.name }}</p>
                    <p class="mt-2 text-h6">Terdapat {{ parsedExcelData.length }} data siap di-import.</p>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="isOpen = false">Batal</v-btn>
                <v-btn color="blue darken-1" text @click="submitImportExcel" :loading="loading"
                    :disabled="!file || parsedExcelData.length === 0">Import</v-btn>
            </v-card-actions>
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
                this.file = null;
                this.parsedExcelData = [];
                this.loading = false;
            }
        },
    },
    data() {
        return {
            isOpen: false,
            loading: false,
            file: null,
            parsedExcelData: [],
        };
    },
    methods: {
        downloadTemplate() {
            const ws = XLSX.utils.json_to_sheet([
                {
                    "Kode Lahan": "10_TESTAZ2026",
                    "Akses Irigasi": "none",
                    "Tekstur Tanah": "loam",
                    "Risk Tier": "A"
                }
            ]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Template_Mitigasi");
            XLSX.writeFile(wb, "Template_Mitigasi_Lahan.xlsx");
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.file = file;
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const rawJson = XLSX.utils.sheet_to_json(worksheet);

                if (rawJson.length === 0) {
                    this.$_alert.error("File Excel kosong");
                    this.file = null;
                    return;
                }

                const mappedJson = rawJson.map(row => {
                    return {
                        lahan_no: row['Kode Lahan'] || row['lahan_no'] || null,
                        irrigation_access: row['Akses Irigasi'] || row['irrigation_access'] || null,
                        soil_texture: row['Tekstur Tanah'] || row['soil_texture'] || null,
                        risk_tier: String(row['Risk Tier'] || row['risk_tier'] || '').toUpperCase() || null,
                    };
                }).filter(item => item.lahan_no !== null && item.lahan_no !== "");

                if (mappedJson.length === 0) {
                    this.$_alert.error("Format salah! Kolom 'Kode Lahan' tidak ditemukan.");
                    this.file = null;
                    return;
                }

                this.parsedExcelData = mappedJson;

                if (this.$refs.excelFile) this.$refs.excelFile.value = "";
            };
            reader.readAsArrayBuffer(this.file);
        },
        async submitImportExcel() {
            this.loading = true;

            const chunkSize = 500;
            const totalChunks = Math.ceil(this.parsedExcelData.length / chunkSize);
            let successCount = 0;

            try {
                for (let i = 0; i < totalChunks; i++) {
                    const chunk = this.parsedExcelData.slice(
                        i * chunkSize,
                        (i + 1) * chunkSize
                    );

                    await this.$_api.post("lahan/bulk-update/mitigation", {
                        data: chunk,
                    });

                    successCount += chunk.length;
                }

                this.$_alert.success(
                    `Berhasil mengimport data mitigasi untuk ${successCount} lahan.`
                );
                this.isOpen = false;
                this.$emit("refresh");
            } catch (err) {
                console.error(err);
                this.$_alert.error(
                    err?.response?.data?.message || "Gagal melakukan proses import data mitigasi massal."
                );
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>