<template>
    <div v-if="data" class="pa-4">
        <!-- 5 CARD DASHBOARD CLUSTERING -->
        <v-row class="mb-4">
            <!-- Blok 1: Identitas Lahan -->
            <v-col cols="12" md="4">
                <v-card outlined class="fill-height border-top-primary">
                    <v-card-title class="subtitle-2 font-weight-bold pb-2">
                        <v-icon small left color="primary">mdi-account-outline</v-icon> Identitas Lahan
                    </v-card-title>
                    <v-card-text class="pt-0">
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Petani:</span>
                            <span class="font-weight-bold">{{ data.farmer_name || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">No. Lahan:</span>
                            <span class="font-weight-bold">{{ data.lahan_no || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">No. Monitoring:</span>
                            <span class="font-weight-bold">{{ data.monitoring2_no || data.monitoring_no || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Tahun Program:</span>
                            <span class="font-weight-bold">{{ data.program_year || '-' }}</span>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">MU / TA:</span>
                            <span class="font-weight-bold text-right">{{ data.managementunits_name }} / {{
                                data.target_areas_name }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Desa:</span>
                            <span class="font-weight-bold">{{ data.desas_name || data.village || '-' }}</span>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Blok 2: Status Verifikasi & Sistem -->
            <v-col cols="12" md="4">
                <v-card outlined class="fill-height border-top-success">
                    <v-card-title class="subtitle-2 font-weight-bold pb-2">
                        <v-icon small left color="success">mdi-shield-check-outline</v-icon> Status Verifikasi
                    </v-card-title>
                    <v-card-text class="pt-0">
                        <div class="mb-3 d-flex align-center">
                            <span class="text-muted small mr-2">Verifikasi:</span>
                            <v-chip small :color="data.is_verified == 1 ? 'success' : 'error'" class="font-weight-bold">
                                {{ formatVerified(data.is_verified) }}
                            </v-chip>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">FC Penanggungjawab:</span>
                            <span class="font-weight-bold">{{ data.users_name || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">FF Pelaksana:</span>
                            <span class="font-weight-bold">{{ data.field_facilitators_name || '-' }}</span>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <div class="row no-gutters text-center mt-2">
                            <div class="col-6 border-right">
                                <div class="text-muted extra-small">Sudah Dikunjungi</div>
                                <v-icon small :color="data.is_visited == 1 ? 'success' : 'grey'">
                                    {{ data.is_visited == 1 ? 'mdi-check-circle' : 'mdi-close-circle' }}
                                </v-icon>
                                <div class="font-weight-bold small">{{ formatYesNo(data.is_visited) }}</div>
                            </div>
                            <div class="col-6">
                                <div class="text-muted extra-small">Barcode Discan</div>
                                <v-icon small :color="data.is_barcode_scanned == 1 ? 'success' : 'grey'">
                                    {{ data.is_barcode_scanned == 1 ? 'mdi-check-circle' : 'mdi-close-circle' }}
                                </v-icon>
                                <div class="font-weight-bold small">{{ formatYesNo(data.is_barcode_scanned) }}</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Blok 3: Data Lahan & Pola Tanam -->
            <v-col cols="12" md="4">
                <v-card outlined class="fill-height border-top-info">
                    <v-card-title class="subtitle-2 font-weight-bold pb-2">
                        <v-icon small left color="info">mdi-layers-outline</v-icon> Data Lahan & Tanaman
                    </v-card-title>
                    <v-card-text class="pt-0">
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Pola Tanam:</span>
                            <span class="font-weight-bold text-right">{{ data.opsi_pola_tanam || '-' }}</span>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <div class="row no-gutters text-center mt-2">
                            <div class="col-4 border-right px-1">
                                <div class="font-weight-bold text-h6 primary--text">{{ data.qty_trees || 0 }}</div>
                                <div class="text-muted extra-small">Total Pohon</div>
                            </div>
                            <div class="col-4 border-right px-1">
                                <div class="font-weight-bold text-h6 success--text">{{ data.qty_kayu || 0 }}</div>
                                <div class="text-muted extra-small">Kayu</div>
                            </div>
                            <div class="col-4 px-1">
                                <div class="font-weight-bold text-h6 info--text">{{ data.qty_mpts || 0 }}</div>
                                <div class="text-muted extra-small">MPTS</div>
                            </div>
                        </div>
                        <v-divider class="my-3"></v-divider>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Luas Lahan:</span>
                            <span class="font-weight-bold">{{ data.land_area || 0 }} m²</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Luas Tanam:</span>
                            <span class="font-weight-bold">{{ data.planting_area || 0 }} m²</span>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Blok 4: Kondisi Lahan & Perawatan -->
            <v-col cols="12" md="6">
                <v-card outlined class="fill-height border-top-warning">
                    <v-card-title class="subtitle-2 font-weight-bold pb-2">
                        <v-icon small left color="warning">mdi-shovel</v-icon> Kondisi Lahan & Perawatan
                    </v-card-title>
                    <v-card-text class="pt-0">
                        <v-row dense>
                            <v-col cols="6">
                                <div class="text-muted small">Kondisi Gulma:</div>
                                <div class="font-weight-bold">{{ monitoringMap.weed_condition[data.weed_condition] ||
                                    '-' }}</div>
                            </v-col>
                            <v-col cols="6">
                                <div class="text-muted small">Kelembaban Tanah:</div>
                                <div class="font-weight-bold">{{ monitoringMap.soil_moisture[data.soil_moisture] || '-'
                                    }}</div>
                            </v-col>
                            <v-col cols="6">
                                <div class="text-muted small">Sumber Pengairan:</div>
                                <div class="font-weight-bold">{{ monitoringMap.irrigation_origin[data.irrigation_origin]
                                    || '-' }}</div>
                            </v-col>
                            <v-col cols="6">
                                <div class="text-muted small">Jenis Pupuk:</div>
                                <div class="font-weight-bold">{{ monitoringMap.fertilizer_type[data.fertilizer_type] ||
                                    '-' }}</div>
                            </v-col>
                            <v-col cols="12">
                                <div class="text-muted small">Catatan Interview:</div>
                                <div class="font-weight-bold font-italic small">"{{ data.inteview || '-' }}"</div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Blok 5: Pertumbuhan & Isu -->
            <v-col cols="12" md="6">
                <v-card outlined class="fill-height border-top-danger">
                    <v-card-title class="subtitle-2 font-weight-bold pb-2">
                        <v-icon small left color="danger">mdi-alert-circle-outline</v-icon> Pertumbuhan & Isu
                    </v-card-title>
                    <v-card-text class="pt-0">
                        <div class="d-flex align-center mb-3">
                            <div style="flex: 1">
                                <div class="text-muted small">Rata-rata Pertumbuhan:</div>
                                <div class="font-weight-bold">{{
                                    monitoringMap.average_plant_growth[data.average_plant_growth] || '-' }}</div>
                            </div>
                            <div class="px-2 border-left" style="flex: 1">
                                <div class="text-muted small">Estimasi Total Pohon:</div>
                                <div class="font-weight-bold">{{
                                    monitoringMap.total_estimated_tree[data.total_estimated_tree] || '-' }}</div>
                            </div>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <v-row dense>
                            <v-col cols="4" class="text-center">
                                <div class="text-muted extra-small">Hama</div>
                                <v-icon small :color="data.is_pest_attack == 1 ? 'error' : 'success'">
                                    {{ data.is_pest_attack == 1 ? 'mdi-bug' : 'mdi-shield-check' }}
                                </v-icon>
                                <div class="small font-weight-bold">{{ formatYesNo(data.is_pest_attack) }}</div>
                            </v-col>
                            <v-col cols="4" class="text-center">
                                <div class="text-muted extra-small">Bencana</div>
                                <v-icon small :color="data.is_disaster == 1 ? 'error' : 'success'">
                                    {{ data.is_disaster == 1 ? 'mdi-alert' : 'mdi-shield-check' }}
                                </v-icon>
                                <div class="small font-weight-bold">{{ formatYesNo(data.is_disaster) }}</div>
                            </v-col>
                            <v-col cols="4" class="text-center">
                                <div class="text-muted extra-small">Isu/Masalah</div>
                                <v-icon small :color="data.is_issue_or_problems == 1 ? 'error' : 'success'">
                                    {{ data.is_issue_or_problems == 1 ? 'mdi-help-circle' : 'mdi-shield-check' }}
                                </v-icon>
                                <div class="small font-weight-bold">{{ formatYesNo(data.is_issue_or_problems) }}</div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-divider class="my-5"></v-divider>

        <!-- BLOK 6: DATA POLYMORPHIC -->
        <div v-if="hasAnyPolymorph" class="mb-5">
            <h5 class="mb-4">
                <v-icon left color="deep-orange">mdi-clipboard-list-outline</v-icon>
                Data Lapangan Tambahan
            </h5>

            <v-row>
                <!-- KOLOM KIRI: ISU & KENDALA -->
                <v-col cols="12" md="6">
                    <v-card outlined class="fill-height border-top-danger"
                        v-if="data.pest_diseases?.length || data.disasters?.length || data.complains?.length">
                        <v-card-title class="subtitle-2 font-weight-bold pb-2 bg-light">
                            <v-icon small left color="error">mdi-alert</v-icon> Kelompok Isu & Kendala
                        </v-card-title>
                        <v-card-text class="pt-3">

                            <!-- Tabel Hama & Penyakit -->
                            <div v-if="data.pest_diseases && data.pest_diseases.length > 0" class="mb-5">
                                <h6 class="text-danger font-weight-bold mb-2">
                                    <v-icon small left color="error">mdi-bug</v-icon> Hama & Penyakit
                                    <v-chip x-small color="error" class="ml-2">{{ data.pest_diseases.length }}</v-chip>
                                </h6>
                                <v-data-table :headers="pestDiseaseHeaders" :items="data.pest_diseases"
                                    :items-per-page="5" dense class="elevation-1 border">
                                    <template v-slot:item.index="{ index }">
                                        <span class="font-weight-bold">{{ index + 1 }}</span>
                                    </template>
                                    <template v-slot:item.pest_disease_type="{ item }">
                                        <v-chip x-small :color="item.pest_disease_type === 0 ? 'orange' : 'red'">
                                            {{ monitoringMap.pest_diseases_type[item.pest_disease_type] || '-' }}
                                        </v-chip>
                                    </template>
                                </v-data-table>
                            </div>

                            <!-- Tabel Bencana -->
                            <div v-if="data.disasters && data.disasters.length > 0" class="mb-5">
                                <h6 class="text-warning font-weight-bold mb-2">
                                    <v-icon small left color="warning">mdi-weather-lightning</v-icon> Bencana
                                    <v-chip x-small color="warning" class="ml-2">{{ data.disasters.length }}</v-chip>
                                </h6>
                                <v-data-table :headers="disasterHeaders" :items="data.disasters" :items-per-page="5"
                                    dense class="elevation-1 border">
                                    <template v-slot:item.index="{ index }">
                                        <span class="font-weight-bold">{{ index + 1 }}</span>
                                    </template>
                                    <template v-slot:item.disaster_type="{ item }">
                                        <v-chip x-small color="warning">
                                            {{ monitoringMap.disaster_type[item.disaster_type] || '-' }}
                                        </v-chip>
                                    </template>
                                </v-data-table>
                            </div>

                            <!-- Tabel Keluhan -->
                            <div v-if="data.complains && data.complains.length > 0" class="mb-2">
                                <h6 class="text-info font-weight-bold mb-2">
                                    <v-icon small left color="info">mdi-comment-alert-outline</v-icon> Keluhan / Isu
                                    <v-chip x-small color="info" class="ml-2">{{ data.complains.length }}</v-chip>
                                </h6>
                                <v-data-table :headers="complainHeaders" :items="data.complains" :items-per-page="5"
                                    dense class="elevation-1 border">
                                    <template v-slot:item.index="{ index }">
                                        <span class="font-weight-bold">{{ index + 1 }}</span>
                                    </template>
                                    <template v-slot:item.complain_type="{ item }">
                                        <v-chip x-small color="info">
                                            {{ monitoringMap.complain_type[item.complain_type] || '-' }}
                                        </v-chip>
                                    </template>
                                </v-data-table>
                            </div>

                        </v-card-text>
                    </v-card>
                </v-col>

                <!-- KOLOM KANAN: POTENSI LAHAN & TANAMAN -->
                <v-col cols="12" md="6">
                    <v-card outlined class="fill-height border-top-success"
                        v-if="data.harvests?.length || data.plant_companions?.length">
                        <v-card-title class="subtitle-2 font-weight-bold pb-2 bg-light">
                            <v-icon small left color="success">mdi-sprout</v-icon> Kelompok Potensi Lahan
                        </v-card-title>
                        <v-card-text class="pt-3">

                            <!-- Tabel Panen -->
                            <div v-if="data.harvests && data.harvests.length > 0" class="mb-5">
                                <h6 class="text-success font-weight-bold mb-2">
                                    <v-icon small left color="success">mdi-fruit-cherries</v-icon> Data Panen
                                    <v-chip x-small color="success" class="ml-2">{{ data.harvests.length }}</v-chip>
                                </h6>
                                <v-data-table :headers="harvestHeaders" :items="data.harvests" :items-per-page="5" dense
                                    class="elevation-1 border">
                                    <template v-slot:item.index="{ index }">
                                        <span class="font-weight-bold">{{ index + 1 }}</span>
                                    </template>
                                    <template v-slot:item.harvest_intensity="{ item }">
                                        {{ monitoringMap.harvest_intensity[item.harvest_intensity] || '-' }}
                                    </template>
                                </v-data-table>
                            </div>

                            <!-- Tabel Tanaman Pendamping -->
                            <div v-if="data.plant_companions && data.plant_companions.length > 0" class="mb-2">
                                <h6 class="text-primary font-weight-bold mb-2">
                                    <v-icon small left color="primary">mdi-leaf</v-icon> Tanaman Pendamping
                                    <v-chip x-small color="primary" class="ml-2">{{ data.plant_companions.length
                                    }}</v-chip>
                                </h6>
                                <v-data-table :headers="plantCompanionHeaders" :items="data.plant_companions"
                                    :items-per-page="5" dense class="elevation-1 border">
                                    <template v-slot:item.index="{ index }">
                                        <span class="font-weight-bold">{{ index + 1 }}</span>
                                    </template>
                                    <template v-slot:item.plant_type="{ item }">
                                        <v-chip x-small color="primary">
                                            {{ monitoringMap.plant_type[item.plant_type] || '-' }}
                                        </v-chip>
                                    </template>
                                </v-data-table>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>

        <v-divider class="my-5"></v-divider>
        <!-- DETAIL POHON -->
        <div v-if="treeDetailHeaders && treeDetailHeaders.length" class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="text-success mb-0">
                    <v-icon left color="success">mdi-tree-outline</v-icon> Detail Per Pohon
                </h5>
                <v-text-field v-model="searchTreeDetail" append-icon="mdi-magnify" label="Cari Kode Pohon..."
                    single-line hide-details dense outlined style="max-width: 300px;"></v-text-field>
            </div>
            <v-data-table :headers="treeDetailHeaders" :items="data.monitoring_detail || []" :items-per-page="10"
                :search="searchTreeDetail" class="elevation-1 border">
                <template v-slot:item.index="{ index }">
                    <span class="font-weight-bold">{{ index + 1 }}</span>
                </template>
            </v-data-table>
            <v-divider class="my-5"></v-divider>
        </div>

        <!-- AKUMULASI POHON -->
        <div v-if="monitoringTreeDetailHeaders && monitoringTreeDetailHeaders.length" class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="text-info mb-0">
                    <v-icon left color="info">mdi-format-list-bulleted-type</v-icon> Akumulasi Per Jenis Pohon
                </h5>
                <v-text-field v-model="searchTreeAcumulation" append-icon="mdi-magnify" label="Cari Jenis Pohon..."
                    single-line hide-details dense outlined style="max-width: 300px;"></v-text-field>
            </div>
            <v-data-table :headers="monitoringTreeDetailHeaders" :items="data.monitoring_tree_detail || []"
                :search="searchTreeAcumulation" :items-per-page="10" class="elevation-1 border">
                <template v-slot:item.index="{ index }">
                    <span class="font-weight-bold">{{ index + 1 }}</span>
                </template>
            </v-data-table>
            <v-divider class="my-5"></v-divider>
        </div>

        <!-- GABUNGAN FOTO & STATISTIK (COMPACT MODE) -->
        <v-row class="mb-5 px-2">

            <!-- KOLOM KIRI: FOTO DOKUMENTASI -->
            <v-col cols="12" md="5">
                <h6 class="mb-3 text-primary font-weight-bold">
                    <v-icon left small color="primary">mdi-image-multiple</v-icon> Dokumentasi Akumulasi
                </h6>

                <template v-if="data.accumulated_photos && data.accumulated_photos.length > 0">
                    <!-- Gunakan flex dengan overflow-x agar bisa di-scroll ke samping kalau foto banyak -->
                    <div class="d-flex overflow-x-auto py-1">
                        <v-img v-for="(img, idx) in data.accumulated_photos" :key="idx"
                            :src="$_config.baseUrlUpload + '/' + img" width="70" height="70"
                            class="rounded mr-2 shrink-0 cursor-pointer elevation-1" @click="showLightbox(img)">
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate size="20"
                                        color="grey lighten-5"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                    </div>
                </template>
                <template v-else>
                    <!-- Empty state yang jauh lebih minimalis -->
                    <div class="text-muted border rounded pa-2 d-flex align-items-center justify-content-center bg-light"
                        style="max-width: max-content;">
                        <v-icon size="20" color="grey" class="mr-2">mdi-image-off-outline</v-icon>
                        <span class="small">Belum ada foto</span>
                    </div>
                </template>
            </v-col>

            <!-- KOLOM KANAN: STATISTIK PERTUMBUHAN -->
            <v-col cols="12" md="7">
                <h6 class="mb-3 text-warning font-weight-bold">
                    <v-icon left small color="warning">mdi-chart-line</v-icon> Statistik Pertumbuhan
                </h6>

                <!-- Tambahkan h-100 agar tinggi box sama dengan box dokumentasi di sebelahnya -->
                <div class="d-flex align-center justify-space-between bg-light border rounded pa-3 h-100">

                    <!-- Metrik 1: Persentase -->
                    <div class="text-center" style="flex: 1; border-right: 1px solid #dee2e6;">
                        <p class="font-weight-bold mb-2">Persentase Pohon Hidup</p>
                        <!-- Saya turunkan ukurannya sedikit ke 120 agar lebih compact & tidak mendesak -->
                        <v-progress-circular :rotate="360" :size="120" :width="12"
                            :value="data.life_tree_percentage || 0"
                            :color="data.life_tree_percentage > 80 ? 'green' : (data.life_tree_percentage > 30 ? 'orange' : 'red')">
                            <span class="font-weight-bold">{{ Number(data.life_tree_percentage || 0).toFixed(1)
                                }}%</span>
                        </v-progress-circular>
                        <div class="small text-muted mt-2">
                            {{ data.current_monitoring_total_trees || 0 }} / {{ data.previous_monitoring_total_trees ||
                                0 }}
                            Hidup
                        </div>
                    </div>

                    <!-- Metrik 2 & 3: Rata-rata -->
                    <div class="text-center d-flex flex-column justify-center" style="flex: 1">
                        <p class="font-weight-bold mb-3">Rata-rata Pertumbuhan</p>

                        <div class="d-flex justify-center align-center">
                            <!-- Metrik 2: Tinggi -->
                            <div class="text-center px-4">
                                <v-icon color="primary" class="mb-1" size="24">mdi-arrow-up-bold</v-icon>
                                <h5 class="mb-0 font-weight-bold">{{ Number(data.average_tree_length || 0).toFixed(1) }}
                                </h5>
                                <div class="small text-muted">cm (Tinggi)</div>
                            </div>

                            <!-- INI CARA BIKIN GARIS PEMISAH VERTIKAL -->
                            <v-divider vertical style="height: 40px; align-self: center;"></v-divider>

                            <!-- Metrik 3: Diameter -->
                            <div class="text-center px-4">
                                <v-icon color="info" class="mb-1" size="24">mdi-diameter</v-icon>
                                <h5 class="mb-0 font-weight-bold">{{ Number(data.average_tree_diameter || 0).toFixed(1)
                                    }}</h5>
                                <div class="small text-muted">cm (Diameter)</div>
                            </div>
                        </div>

                    </div>

                </div>
            </v-col>
        </v-row>

        <v-divider class="my-5"></v-divider>

    </div>
</template>

<script>
import { monitoringMap, formatYesNo, formatVerified } from '../../utils/monitoringMap';

export default {
    props: {
        data: { type: Object, required: true },
        treeDetailHeaders: { type: Array, default: () => [] },
        monitoringTreeDetailHeaders: { type: Array, default: () => [] },
        pestDiseaseHeaders: { type: Array, default: () => [] },
        disasterHeaders: { type: Array, default: () => [] },
        complainHeaders: { type: Array, default: () => [] },
        harvestHeaders: { type: Array, default: () => [] },
        plantCompanionHeaders: { type: Array, default: () => [] },
    },
    computed: {
        hasAnyPolymorph() {
            if (!this.data) return false;
            return (
                (this.data.pest_diseases && this.data.pest_diseases.length > 0) ||
                (this.data.disasters && this.data.disasters.length > 0) ||
                (this.data.complains && this.data.complains.length > 0) ||
                (this.data.harvests && this.data.harvests.length > 0) ||
                (this.data.plant_companions && this.data.plant_companions.length > 0)
            );
        }
    },
    data() {
        return {
            monitoringMap,
            searchTreeDetail: '',
            searchTreeAcumulation: ''
        }
    },
    methods: {
        formatVerified,
        formatYesNo,
        showLightbox(imgs) {
            if (imgs) {
                this.$store.state.lightbox.imgs = this.$_config.baseUrlUpload + '/' + imgs;
                this.$store.state.lightbox.index = 0;
                this.$store.state.lightbox.show = true;
            }
        }
    }
}
</script>
