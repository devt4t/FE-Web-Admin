<template>
    <v-dialog v-model="isOpen" max-width="520px">
        <v-card>
            <v-card-title class="d-flex justify-content-between align-items-center">
                <span class="text-h5">Import Excel Verifikasi GIS</span>
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
                        <small class="text-muted mt-1">Mendukung Template Verifikasi GIS maupun file Export Excel By MU</small>
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
import moment from "moment";

export default {
    name: "planting-soc-import-excel",
    props: {
        dataKey: {
            required: false,
            default: 0,
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
                    "No Sostam": "SO-2026-FF0001",
                    "Latitude": "-7.0406285",
                    "Longitude": "107.5122978",
                    "Keterangan": "Sesuai",
                    "Catatan": ""
                },
                {
                    "No Sostam": "SO-2026-FF0002",
                    "Latitude": "",
                    "Longitude": "",
                    "Keterangan": "Tidak Sesuai",
                    "Catatan": "Titik lokasi tidak dapat diakses truk"
                }
            ]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Template_GIS_Sostam");
            XLSX.writeFile(wb, "Template_Verifikasi_GIS_Sostam.xlsx");
        },
        getCellByAliases(row, aliases) {
            for (const key of Object.keys(row)) {
                if (aliases.includes(key.trim().toLowerCase())) {
                    return row[key];
                }
            }
            return "";
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.file = file;
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    // Deteksi otomatis baris header (Row 1 pada template, atau Row 6 pada file Export MU)
                    const rows2D = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
                    let headerRowIdx = rows2D.findIndex((r) =>
                        r.some((cell) => {
                            const val = String(cell || "").trim().toLowerCase();
                            return val === "no sostam" || val === "no_sostam" || val === "soc_no";
                        })
                    );
                    if (headerRowIdx === -1) headerRowIdx = 0;

                    const rawJson = XLSX.utils.sheet_to_json(worksheet, { range: headerRowIdx, defval: "" });

                    if (rawJson.length === 0) {
                        this.$_alert.error("File Excel kosong");
                        this.file = null;
                        return;
                    }

                    const mappedJson = [];
                    for (const row of rawJson) {
                        const socNo = String(this.getCellByAliases(row, ["no sostam", "no_sostam", "soc_no"])).trim();
                        if (!socNo) continue;

                        const lat = String(this.getCellByAliases(row, ["latitude", "lat"])).trim();
                        const lng = String(this.getCellByAliases(row, ["longitude", "lng", "long"])).trim();
                        const ket = String(this.getCellByAliases(row, ["keterangan", "gis_status", "status gis", "status"])).trim().toLowerCase();
                        const catatan = String(this.getCellByAliases(row, ["catatan", "note", "suggestion_note"])).trim();

                        let gisStatus = null;
                        if (ket === "sesuai" || ket === "1") {
                            gisStatus = 1;
                        } else if (ket === "tidak sesuai" || ket === "2") {
                            gisStatus = 2;
                        } else {
                            this.$_alert.error(
                                `Data Keterangan tidak valid pada No Sostam ${socNo}. Isi dengan "Sesuai" atau "Tidak Sesuai".`
                            );
                            this.file = null;
                            this.parsedExcelData = [];
                            return;
                        }

                        mappedJson.push({
                            soc_no: socNo,
                            distribution_coordinates: (lat && lng) ? `${lat} ${lng}` : null,
                            gis_status: gisStatus,
                            suggestion_note: catatan || null,
                            suggestion_date: moment().format("YYYY-MM-DD"),
                        });
                    }

                    if (mappedJson.length === 0) {
                        this.$_alert.error("Format salah! Kolom 'No Sostam' tidak ditemukan atau data kosong.");
                        this.file = null;
                        return;
                    }

                    this.parsedExcelData = mappedJson;
                } catch (err) {
                    console.error("[PlantingSocImportExcel] Parse Error:", err);
                    this.$_alert.error("Gagal membaca file Excel. Pastikan format file valid.");
                    this.file = null;
                } finally {
                    if (this.$refs.excelFile) this.$refs.excelFile.value = "";
                }
            };
            reader.readAsArrayBuffer(this.file);
        },
        async submitImportExcel() {
            this.loading = true;
            const chunkSize = 200;
            const totalChunks = Math.ceil(this.parsedExcelData.length / chunkSize);
            let successCount = 0;

            try {
                const programYear = this.$store.state.tmpProgramYear;
                for (let i = 0; i < totalChunks; i++) {
                    const chunk = this.parsedExcelData.slice(
                        i * chunkSize,
                        (i + 1) * chunkSize
                    );

                    await this.$_api.post("sostam/gis-verification", {
                        program_year: programYear,
                        data: chunk,
                    });

                    successCount += chunk.length;
                }

                this.$_alert.success(`Berhasil memverifikasi GIS untuk ${successCount} data sostam.`);
                this.isOpen = false;
                this.$emit("refresh");
            } catch (err) {
                console.error("[submitImportExcel] Error:", err);
                this.$_alert.error(
                    err?.data?.message ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Gagal melakukan proses import verifikasi GIS."
                );
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
