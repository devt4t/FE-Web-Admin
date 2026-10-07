<template>
    <div v-if="data" class="pa-4 monitoring-kebakaran-detail">
        <v-row class="mb-4">
            <!-- Identitas Lahan -->
            <v-col cols="12" md="6">
                <v-card outlined class="fill-height border-top-primary">
                    <!-- Action Verifikasi -->
                    <v-row class="ml-4">
                        <v-col cols="12">
                            <div class="my-3 font-weight-500">
                                Aksi Verifikasi Laporan
                            </div>
                            <!-- User FC -->
                            <template v-if="isFCRole">
                                <v-btn v-if="data.is_verified == 0" color="primary"
                                    @click="handleVerify('verification')">
                                    <v-icon left>mdi-check-circle-outline</v-icon> Verifikasi FC
                                </v-btn>

                                <v-btn v-else-if="data.is_verified == 1" outlined color="error"
                                    @click="handleUnverify()">
                                    <v-icon left>mdi-close-circle-outline</v-icon> Un-Verifikasi FC
                                </v-btn>

                                <v-chip v-else-if="data.is_verified == 2" color="success" class="font-weight-bold">
                                    <v-icon left>mdi-check-decagram</v-icon> Laporan Selesai (Disetujui UM)
                                </v-chip>
                            </template>

                            <!-- User UM -->
                            <template v-if="isUMCARole">
                                <v-btn v-if="data.is_verified == 0" disabled
                                    title="Tunggu pihak FC verifikasi lapangan dulu" class="ml-2">
                                    Menunggu Verifikasi FC
                                </v-btn>

                                <v-btn v-else-if="data.is_verified == 1" color="primary" class="ml-2"
                                    @click="handleVerify('verification')">
                                    <v-icon left>mdi-check-circle-outline</v-icon> Verifikasi UM
                                </v-btn>

                                <v-btn v-else-if="data.is_verified == 2" outlined color="error" class="ml-2"
                                    @click="handleUnverify()">
                                    <v-icon left>mdi-close-circle-outline</v-icon> Un-Verifikasi UM
                                </v-btn>
                            </template>
                        </v-col>
                    </v-row>

                    <v-divider class="my-5"></v-divider>

                    <v-card-title class="subtitle-2 font-weight-bold pb-2 bg-light">
                        <v-icon small left color="primary">mdi-account-outline</v-icon> Identitas Lahan
                    </v-card-title>
                    <v-card-text class="pt-3">
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
                            <span class="font-weight-bold">{{ data.mon_no || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Tahun Program:</span>
                            <span class="font-weight-bold">{{ data.report_program_year || '-' }}</span>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">MU / TA:</span>
                            <span class="font-weight-bold text-right">{{ data.mu_name || '-' }} / {{
                                data.target_area_name || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Desa:</span>
                            <span class="font-weight-bold">{{ data.village_name || data.village || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Kec/Kab:</span>
                            <span class="font-weight-bold text-right">{{ data.kecamatan_name || '-' }}, {{
                                data.kabupaten_name || '-' }}</span>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Status Laporan & Verifikasi -->
            <v-col cols="12" md="6">
                <v-card outlined class="fill-height border-top-success">
                    <v-card-title class="subtitle-2 font-weight-bold pb-2 bg-light">
                        <v-icon small left color="success">mdi-shield-check-outline</v-icon> Status Laporan
                    </v-card-title>
                    <v-card-text class="pt-3">
                        <div class="mb-3 d-flex align-center">
                            <span class="text-muted small mr-2">Verifikasi:</span>
                            <v-chip small :color="getVerificationColor(data.is_verified)" class="font-weight-bold">
                                {{ getVerificationStatus(data.is_verified) }}
                            </v-chip>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">FC Verifikator:</span>
                            <span class="font-weight-bold">{{ data.fc_name || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">No. FC Verifikator:</span>
                            <span class="font-weight-bold">{{ data.fc_no || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">FF Pelaksana:</span>
                            <span class="font-weight-bold">{{ data.ff_name || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">No. FF:</span>
                            <span class="font-weight-bold">{{ data.ff_no || '-' }}</span>
                        </div>
                        <v-divider class="my-2"></v-divider>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Tgl Kejadian:</span>
                            <span class="font-weight-bold">{{ formatDate(data.incident_date) }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Waktu Kejadian:</span>
                            <span class="font-weight-bold small">{{ data.incident_time || '-' }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                            <span class="text-muted small">Info Diterima (FF):</span>
                            <span class="font-weight-bold small">{{ data.ff_info_received_time || '-' }}</span>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-divider class="my-5"></v-divider>

        <!-- DATA LAPANGAN & PENYEBAB -->
        <div class="mb-5">
            <h5 class="mb-4">
                <v-icon left color="deep-orange">mdi-alert-octagon-outline</v-icon>
                Detail Insiden & Penyebab
            </h5>

            <v-row>
                <!-- Hasil Verifikasi & Penyebab -->
                <v-col cols="12" md="6">
                    <v-card outlined class="fill-height border-top-warning">
                        <v-card-title class="subtitle-2 font-weight-bold pb-2 bg-light">
                            <v-icon small left color="warning">mdi-magnify</v-icon> Investigasi Lapangan
                        </v-card-title>
                        <v-card-text class="pt-3">
                            <div class="mb-3">
                                <div class="text-muted small">Hasil Verifikasi Awal (FF):</div>
                                <div class="font-weight-bold bg-light pa-2 rounded border mt-1">{{
                                    data.verification_result || '-' }}</div>
                            </div>
                            <div class="mb-3">
                                <div class="text-muted small">Dugaan Penyebab:</div>
                                <div class="font-weight-bold">
                                    <v-chip small color="error" class="mt-1">{{ getFireCause(data.fire_cause)
}}</v-chip>
                                </div>
                            </div>
                            <div class="mb-3" v-if="data.fire_cause_description">
                                <div class="text-muted small">Keterangan Penyebab:</div>
                                <div class="font-weight-bold">{{ data.fire_cause_description }}</div>
                            </div>
                            <div class="mb-3">
                                <div class="text-muted small">Kerugian Tanaman (Estimasi Awal):</div>
                                <div class="font-weight-bold text-danger">{{ data.plant_loss || '-' }}</div>
                            </div>
                            <div class="mb-3">
                                <div class="text-muted small">Rekomendasi Tindak Lanjut:</div>
                                <div class="font-weight-bold bg-light pa-2 rounded border mt-1">{{ data.recommendation
                                    || '-' }}</div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <!-- Dampak & Kondisi Lahan -->
                <v-col cols="12" md="6">
                    <v-card outlined class="fill-height border-top-danger">
                        <v-card-title class="subtitle-2 font-weight-bold pb-2 bg-light">
                            <v-icon small left color="danger">mdi-fire-alert</v-icon> Dampak & Kondisi Lahan
                        </v-card-title>
                        <v-card-text class="pt-3">
                            <div class="d-flex justify-space-between mb-1">
                                <span class="text-muted small">Sumber Deteksi:</span>
                                <span class="font-weight-bold text-right">{{ data.detection_source || '-' }}</span>
                            </div>
                            <v-divider class="my-2"></v-divider>
                            <div class="row no-gutters text-center mt-2">
                                <div class="col-4 border-right px-1">
                                    <div class="font-weight-bold text-h6">{{ data.total_land_area || 0 }}
                                    </div>
                                    <div class="text-muted extra-small">Total (m²)</div>
                                </div>
                                <div class="col-4 border-right px-1">
                                    <div class="font-weight-bold text-h6">{{
                                        data.estimated_burned_land_area
                                        || 0 }}</div>
                                    <div class="text-muted extra-small">Estimasi (m²)</div>
                                </div>
                                <div class="col-4 px-1">
                                    <div class="font-weight-bold text-h6">{{ data.final_burned_land_area ||
                                        0 }}
                                    </div>
                                    <div class="text-muted extra-small">Final (m²)</div>
                                </div>
                            </div>
                            <v-divider class="my-3"></v-divider>
                            <div class="d-flex justify-space-between mb-1">
                                <span class="text-muted small">Jarak Pemukiman:</span>
                                <span class="font-weight-bold">{{ data.nearest_settlement_distance || 0 }} m</span>
                            </div>
                            <div class="d-flex justify-space-between mb-1">
                                <span class="text-muted small">Sumber Air:</span>
                                <span class="font-weight-bold">{{ data.nearest_water_source || '-' }}</span>
                            </div>
                            <div class="d-flex justify-space-between mb-1">
                                <span class="text-muted small">Dampak Asap:</span>
                                <span class="font-weight-bold text-right">{{ data.smoke_impact || '-' }}</span>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>

        <v-divider class="my-5"></v-divider>


        <!-- Checklist & Kronologi -->
        <div class="mb-5">
            <v-row>
                <v-col cols="12" md="12">
                    <v-card outlined class="fill-height border-top-info">
                        <v-card-title class="subtitle-2 font-weight-bold pb-2 bg-light">
                            <v-icon small left color="info">mdi-clipboard-check-outline</v-icon> Checklist & Kronologi
                        </v-card-title>
                        <v-card-text class="pt-3">
                            <div class="checklist-table-wrapper" style="padding-inline: 0;">
                                <!-- Kronologi -->
                                <h4>KRONOLOGI RESPON CEPAT <span class="badge">(FF)</span></h4>
                                <table class="checklist-table">
                                    <thead>
                                        <tr>
                                            <th width="70%">TAHAPAN</th>
                                            <th width="30%">WAKTU</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-for="(c, i) in parsedChronology">
                                            <tr :key="'chron-' + i">
                                                <td>{{ c.tahapan }}</td>
                                                <td class="text-center font-weight-bold">
                                                    <span v-if="c.is_done" class="text-black">{{ c.waktu }}</span>
                                                    <span v-else class="text-muted">-</span>
                                                </td>
                                            </tr>
                                            <tr :key="'chron-detail-' + i" v-if="c.is_done && c.notes">
                                                <td colspan="2" class="bg-light px-4 py-2 border-bottom">
                                                    <strong>Keterangan:</strong> {{ c.notes }}
                                                </td>
                                            </tr>
                                        </template>
                                        <tr v-if="parsedChronology.length === 0">
                                            <td colspan="2" class="text-center font-italic text-muted py-3">Tidak ada
                                                data kronologi</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- FF Checklist -->
                                <h4>CHECKLIST TINDAKAN FIELD FACILITATOR <span class="badge">(FF)</span></h4>
                                <table class="checklist-table">
                                    <thead>
                                        <tr>
                                            <th width="60%">TINDAKAN</th>
                                            <th width="20%">DILAKUKAN</th>
                                            <th width="20%">WAKTU</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-for="(c, i) in parsedFFChecklist">
                                            <tr :key="'ff-' + i">
                                                <td>{{ c.tindakan }}</td>
                                                <td>
                                                    <div class="checkbox-wrapper">
                                                        <div class="check-box">
                                                            <v-icon v-if="c.is_done"
                                                                color="success">mdi-checkbox-marked</v-icon>
                                                            <v-icon v-else
                                                                color="grey">mdi-checkbox-blank-outline</v-icon>
                                                            <span>Ya</span>
                                                        </div>
                                                        <div class="check-box">
                                                            <v-icon v-if="!c.is_done"
                                                                color="error">mdi-checkbox-marked</v-icon>
                                                            <v-icon v-else
                                                                color="grey">mdi-checkbox-blank-outline</v-icon>
                                                            <span>Tidak</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="text-center font-weight-bold">
                                                    <span v-if="c.is_done" class="text-black">{{ c.waktu }}</span>
                                                    <span v-else class="text-muted"> - </span>
                                                </td>
                                            </tr>
                                            <tr :key="'ff-detail-' + i"
                                                v-if="c.is_done && (c.notes || hasValidEvidences(c.evidences))">
                                                <td colspan="3" class="bg-light px-4 py-3 border-bottom">
                                                    <div v-if="c.notes" class="mb-2"><strong>Catatan:</strong> {{
                                                        c.notes }}</div>
                                                    <div v-if="hasValidEvidences(c.evidences)">
                                                        <strong>Evidence:</strong>
                                                        <div class="d-flex mt-2" style="gap: 10px;">
                                                            <template v-for="(ev, eIdx) in c.evidences">
                                                                <img v-if="ev.photo" :key="ev.id || eIdx"
                                                                    :src="$store.state.apiUrlImage + ev.photo"
                                                                    style="height: 80px; width: 80px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 1px solid #ccc"
                                                                    @click="showLightbox(ev.photo)" />
                                                            </template>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </template>
                                        <tr v-if="parsedFFChecklist.length === 0">
                                            <td colspan="3" class="text-center font-italic text-muted py-3">Tidak ada
                                                data checklist FF</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- FC Checklist -->
                                <h4>CHECKLIST TINDAKAN FIELD COORDINATOR <span class="badge">(FC)</span></h4>
                                <table class="checklist-table">
                                    <thead>
                                        <tr>
                                            <th width="60%">TINDAKAN</th>
                                            <th width="20%">DILAKUKAN</th>
                                            <th width="20%">WAKTU</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-for="(c, i) in parsedFCChecklist">
                                            <tr :key="'fc-' + i">
                                                <td>{{ c.tindakan }}</td>
                                                <td>
                                                    <div class="checkbox-wrapper">
                                                        <div class="check-box">
                                                            <v-icon v-if="c.is_done"
                                                                color="success">mdi-checkbox-marked</v-icon>
                                                            <v-icon v-else
                                                                color="grey">mdi-checkbox-blank-outline</v-icon>
                                                            <span>Ya</span>
                                                        </div>
                                                        <div class="check-box">
                                                            <v-icon v-if="!c.is_done"
                                                                color="error">mdi-checkbox-marked</v-icon>
                                                            <v-icon v-else
                                                                color="grey">mdi-checkbox-blank-outline</v-icon>
                                                            <span>Tidak</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="text-center font-weight-bold">
                                                    <span v-if="c.is_done" class="text-black">{{ c.waktu }}</span>
                                                    <span v-else class="text-muted">-</span>
                                                </td>
                                            </tr>
                                            <tr :key="'fc-detail-' + i"
                                                v-if="c.is_done && (c.notes || hasValidEvidences(c.evidences))">
                                                <td colspan="3" class="bg-light px-4 py-3 border-bottom">
                                                    <div v-if="c.notes" class="mb-2"><strong>Catatan:</strong> {{
                                                        c.notes }}</div>
                                                    <div v-if="hasValidEvidences(c.evidences)">
                                                        <strong>Evidence:</strong>
                                                        <div class="d-flex mt-2" style="gap: 10px;">
                                                            <template v-for="(ev, eIdx) in c.evidences">
                                                                <img v-if="ev.photo" :key="ev.id || eIdx"
                                                                    :src="$store.state.apiUrlImage + ev.photo"
                                                                    style="height: 80px; width: 80px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 1px solid #ccc"
                                                                    @click="showLightbox(ev.photo)" />
                                                            </template>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </template>
                                        <tr v-if="parsedFCChecklist.length === 0">
                                            <td colspan="3" class="text-center font-italic text-muted py-3">Tidak ada
                                                data checklist FC</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- Resources Involved -->
                                <h4>SUMBER DAYA & PIHAK YANG TERLIBAT <span class="badge">(FC)</span></h4>
                                <table class="checklist-table">
                                    <thead>
                                        <tr>
                                            <th width="40%">Sumber Daya / Pihak Terlibat</th>
                                            <th width="20%">Jumlah</th>
                                            <th width="40%">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-for="(r, i) in parsedResources">
                                            <tr :key="'res-' + i">
                                                <td class="font-weight-bold">{{ r.sumber_daya }}</td>
                                                <td class="text-center">
                                                    <span v-if="r.is_done" class="font-weight-bold text-primary">{{
                                                        r.jumlah }}</span>
                                                    <span v-else class="text-muted">-</span>
                                                </td>
                                                <td>
                                                    <span v-if="r.is_done">{{ r.keterangan || '-' }}</span>
                                                    <span v-else class="text-muted">-</span>
                                                </td>
                                            </tr>
                                        </template>
                                        <tr v-if="parsedResources.length === 0">
                                            <td colspan="3" class="text-center font-italic text-muted py-3">Tidak ada
                                                data sumber daya</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>

        <v-divider class="my-5"></v-divider>

        <!-- DETAIL POHON TERDAMPAK -->
        <div class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="text-success mb-0">
                    <v-icon left color="success">mdi-tree-outline</v-icon> Detail Bibit Pohon Terdampak
                </h5>
            </div>

            <v-data-table :headers="treeDetailHeaders" :items="data.trees_impacted || []" class="elevation-1 border"
                hide-default-footer>
                <template v-slot:item.index="{ index }">
                    <span class="font-weight-bold">{{ index + 1 }}</span>
                </template>
                <template v-slot:item.total_planted="{ item }">
                    <span class="font-weight-bold text-primary">{{ item.total_planted }}</span>
                </template>
                <template v-slot:item.total_alive="{ item }">
                    <span class="font-weight-bold text-success">{{ item.total_alive }}</span>
                </template>
                <template v-slot:item.total_dead="{ item }">
                    <span class="font-weight-bold text-danger">{{ item.total_dead }}</span>
                </template>
                <template v-slot:item.total_unknown="{ item }">
                    <span class="font-weight-bold text-warning">{{ Math.max(0, parseInt(item.total_planted || 0) -
                        (parseInt(item.total_alive || 0) + parseInt(item.total_dead || 0))) }}</span>
                </template>
                <template v-slot:body.append v-if="data.trees_impacted && data.trees_impacted.length > 0">
                    <tr class="font-weight-bold">
                        <td colspan="4" class="text-left"
                            style="background-color: #e8ebe9 !important; border-top: 1px solid #ccc !important;">TOTAL
                        </td>
                        <td class="text-primary text-center"
                            style="background-color: #e8ebe9 !important; border-top: 1px solid #ccc !important;">{{
                                sumPlanted }}</td>
                        <td class="text-success text-center"
                            style="background-color: #e8ebe9 !important; border-top: 1px solid #ccc !important;">{{
                                sumAlive }}</td>
                        <td class="text-danger text-center"
                            style="background-color: #e8ebe9 !important; border-top: 1px solid #ccc !important;">{{
                                sumDead }}</td>
                        <td class="text-warning text-center"
                            style="background-color: #e8ebe9 !important; border-top: 1px solid #ccc !important;">{{
                                sumUnknown }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>

        <v-divider class="my-5"></v-divider>

        <!-- FOTO DOKUMENTASI -->
        <v-row class="mb-4">
            <v-col cols="12">
                <v-card outlined class="border-top-primary">
                    <v-card-title class="subtitle-2 font-weight-bold pb-2 bg-light">
                        <v-icon small left color="primary">mdi-camera-outline</v-icon> Foto Dokumentasi
                    </v-card-title>
                    <v-card-text class="pt-3">
                        <v-row>
                            <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="(label, i) in photoLabels"
                                :key="'photo-' + i">
                                <v-card outlined class="h-100 d-flex flex-column" hover
                                    style="border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0;">

                                    <!-- Header Foto -->
                                    <div class="pa-3 bg-light" style="border-bottom: 1px solid #e0e0e0;">
                                        <p class="mb-0 font-weight-bold text-truncate" :title="label"
                                            style="font-size: 14px; color: #424242;">{{ label }}</p>
                                    </div>

                                    <!-- Konten Foto -->
                                    <div class="pa-3 flex-grow-1 d-flex justify-content-center align-items-center"
                                        style="min-height: 180px;">
                                        <div v-if="![null, undefined, '', '-'].includes(data[`photo${i + 1}`])"
                                            style="width: 100%;">
                                            <img style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"
                                                :src="$store.state.apiUrlImage + data[`photo${i + 1}`]"
                                                @click="showLightbox(data[`photo${i + 1}`])"
                                                @mouseover="$event.target.style.opacity = '0.8'"
                                                @mouseleave="$event.target.style.opacity = '1'" />
                                        </div>

                                        <!-- Empty State -->
                                        <div v-else
                                            class="text-center text-muted d-flex flex-column justify-content-center align-items-center"
                                            style="width: 100%; height: 180px; border: 2px dashed #cbd5e1; border-radius: 8px; background-color: #f8fafc;">
                                            <v-icon color="grey lighten-1"
                                                style="font-size: 36px; margin-bottom: 8px;">mdi-image-off-outline</v-icon>
                                            <span style="font-size: 13px;">Belum ada foto</span>
                                        </div>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Object, required: true },
    },
    data() {
        return {
            isLoading: false,
            templates: null,
            // mapping header data
            treeDetailHeaders: [
                { text: 'No', value: 'index', sortable: false, width: '60px' },
                { text: 'Kode Pohon', value: 'tree_code' },
                { text: 'Jenis Tanaman', value: 'tree_name' },
                { text: 'Tahun Tanam Pohon', value: 'planting_year' },
                { text: 'Jumlah Tertanam', value: 'total_planted', align: 'center' },
                { text: 'Jumlah Hidup', value: 'total_alive', align: 'center' },
                { text: 'Jumlah Mati', value: 'total_dead', align: 'center' },
                { text: 'Pohon Tidak Diketahui', value: 'total_unknown', align: 'center' },
            ],
            photoLabels: [
                'Koordinasi dengan pemilik lahan',
                'Kondisi Lahan setelah Terbakar 1',
                'Kondisi Lahan setelah Terbakar 2',
                'Kondisi Tanaman pasca lahan terbakar',
                'Pengecekan Lahan Terbakar'
            ],
        }
    },
    async mounted() {
        try {
            const resTemplate = await this.$_api.get('monitoring-fire-incident/get-template-items');
            this.templates = resTemplate.data;
        } catch (e) {
            console.error("Gagal load templates:", e);
        }
    },
    computed: {
        isFCRole() {
            const user = this.$store.state.User;
            const roles = String(user.role || '');
            return ['13', '19'].includes(roles);
        },
        isUMCARole() {
            const user = this.$store.state.User;
            const roles = String(user.role || '');
            return ['13', '20', '33'].includes(roles);
        },
        parsedChronology() {
            const existArr = this.parseJsonSafely(this.data.chronology);
            if (!this.templates || !this.templates.chronology) return existArr;
            const existMap = new Map(existArr.map(i => [i.item_code, i]));
            return this.templates.chronology.map(tpl => {
                const existing = existMap.get(tpl.code);
                return {
                    item_code: tpl.code,
                    tahapan: tpl.label,
                    is_done: !!existing?.occurred_at,
                    waktu: existing?.occurred_at || null,
                    notes: existing?.notes || ''
                };
            });
        },
        parsedFFChecklist() {
            const existArr = this.parseJsonSafely(this.data.ff_action_checklist);
            if (!this.templates || !this.templates.ff_action) return existArr;
            const existMap = new Map(existArr.map(i => [i.item_code, i]));
            return this.templates.ff_action.map(tpl => {
                const existing = existMap.get(tpl.code);
                return {
                    item_code: tpl.code,
                    tindakan: tpl.label,
                    is_done: existing?.is_done == 1,
                    waktu: existing?.done_at || null,
                    notes: existing?.notes || '',
                    evidences: existing?.evidences || []
                };
            });
        },
        parsedFCChecklist() {
            const existArr = this.parseJsonSafely(this.data.fc_action_checklist);
            if (!this.templates || !this.templates.fc_action) return existArr;
            const existMap = new Map(existArr.map(i => [i.item_code, i]));
            return this.templates.fc_action.map(tpl => {
                const existing = existMap.get(tpl.code);
                return {
                    item_code: tpl.code,
                    tindakan: tpl.label,
                    is_done: existing?.is_done == 1,
                    waktu: existing?.done_at || null,
                    notes: existing?.notes || '',
                    evidences: existing?.evidences || []
                };
            });
        },
        parsedResources() {
            const existArr = this.parseJsonSafely(this.data.resources_involved);
            if (!this.templates || !this.templates.resource) return existArr;
            const existMap = new Map(existArr.map(i => [i.item_code, i]));
            return this.templates.resource.map(tpl => {
                const existing = existMap.get(tpl.code);
                return {
                    item_code: tpl.code,
                    sumber_daya: tpl.label,
                    is_done: !!existing,
                    jumlah: existing?.qty || 0,
                    keterangan: existing?.notes || ''
                };
            });
        },
        sumPlanted() {
            if (!this.data.trees_impacted) return 0;
            return this.data.trees_impacted.reduce((sum, item) => sum + (parseInt(item.total_planted) || 0), 0);
        },
        sumAlive() {
            if (!this.data.trees_impacted) return 0;
            return this.data.trees_impacted.reduce((sum, item) => sum + (parseInt(item.total_alive) || 0), 0);
        },
        sumDead() {
            if (!this.data.trees_impacted) return 0;
            return this.data.trees_impacted.reduce((sum, item) => sum + (parseInt(item.total_dead) || 0), 0);
        },
        sumUnknown() {
            if (!this.data.trees_impacted) return 0;
            return this.data.trees_impacted.reduce((sum, item) => {
                let planted = parseInt(item.total_planted || 0);
                let alive = parseInt(item.total_alive || 0);
                let dead = parseInt(item.total_dead || 0);
                let diff = planted - (alive + dead);
                return sum + (diff > 0 ? diff : 0);
            }, 0);
        },
    },
    methods: {
        async handleVerify(type) {
            const prompt = await this.$_alert.custom({
                title: "Konfirmasi Verifikasi",
                text: "Yakin ingin me-verifikasi data?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: '#6feefc',
                confirmButtonText: 'Ya, Verifikasi',
                cancelButtonColor: '#e1e3e3',
                cancelButtonText: 'Batal',
            });

            if (!prompt.isConfirmed) return;
            const user = this.$store.state.User;

            this.isLoading = true;

            try {
                await this.$_api.post('monitoring-fire-incident/verification', {
                    current_id: this.data.id,
                    modul: type,
                    user_id: user.EmployeeStructure?.nik || user.email,
                });

                this.$_alert.success('Berhasil Verifikasi');
                
                // Optimistic UI Update for instant Reactivity
                if (this.data.is_verified == 0) this.data.is_verified = 1;
                else if (this.data.is_verified == 1) this.data.is_verified = 2;
                
                this.isLoading = false;
                this.$emit('refresh'); // trigger parent to reload
            } catch (err) {
                console.error('Gagal verifikasi data:', err);
                this.$_alert.error(err.response?.data?.message || 'Gagal verifikasi data');
                this.isLoading = false;
            } finally {
                this.isLoading = false;
            }
        },
        async handleUnverify() {
            const prompt = await this.$_alert.confirm(
                "Konfirmasi Un-Verifikasi",
                "Yakin ingin membatalkan verifikasi (Unverifikasi)?",
                "Ya, Unverifikasi",
                "Tidak"
            );  

            if (!prompt.isConfirmed) return;

            this.isLoading = true;

            try {
                await this.$_api.post('monitoring-fire-incident/unverification', {
                    current_id: this.data.id
                });

                this.$_alert.success('Berhasil Unverifikasi Data');

                // Optimistic UI Update for instant Reactivity
                if (this.data.is_verified == 2) this.data.is_verified = 1;
                else if (this.data.is_verified == 1) this.data.is_verified = 0;

                this.isLoading = false;
                this.$emit('refresh');
            } catch (err) {
                console.error('Gagal men-Unverifikasi data:', err);
                this.$_alert.error(err.response?.data?.message || 'Gagal un-verifikasi data');
                this.isLoading = false;
            } finally {
                this.isLoading = false;
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            if (isNaN(date)) return dateStr;
            return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        },
        getVerificationStatus(status) {
            if (status == 1) return 'Diverifikasi FC';
            if (status == 2) return 'Disetujui UM';
            return 'Belum Diverifikasi';
        },
        getVerificationColor(status) {
            if (status == 1) return 'primary';
            if (status == 2) return 'success';
            return 'grey';
        },
        getFireCause(code) {
            const causes = {
                0: 'Slash & burn',
                1: 'Puntung rokok',
                2: 'Sengaja dibakar',
                3: 'Sambaran petir',
                4: 'Belum diketahui',
                5: 'Lainnya'
            };
            return causes[code] || 'Belum diketahui';
        },
        parseJsonSafely(jsonStr) {
            if (!jsonStr) return [];
            if (Array.isArray(jsonStr)) return jsonStr;
            try {
                const parsed = JSON.parse(jsonStr);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        },
        hasValidEvidences(evidences) {
            if (!evidences || !Array.isArray(evidences)) return false;
            return evidences.some(ev => ev.photo && ev.photo.trim() !== '');
        },
        showLightbox(photoPath) {
            if (!photoPath) return;
            const url = this.$store.state.apiUrlImage + photoPath;
            // Jika ada plugin lightbox global, bisa dipanggil disini.
            // Contoh: this.$viewerApi({ images: [url] })
            window.open(url, '_blank');
        }
    }
}
</script>