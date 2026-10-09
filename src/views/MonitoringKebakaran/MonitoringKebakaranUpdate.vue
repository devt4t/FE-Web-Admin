<template>
    <div class="geko-form-wrapper monitoring-kebakaran-from">
        <ValidationObserver ref="fireForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">

                <!-- STEPPER HEADER -->
                <v-row class="mb-4">
                    <v-col md="12">
                        <div class="form-stepper-header flex-wrap">
                            <div class="form-stepper-header-item" :class="{ active: currentStep === 1 }">
                                <span class="value">1</span>
                                <span class="label">Info & Kejadian</span>
                            </div>
                            <div class="form-stepper-header-splitter"><span></span></div>

                            <div class="form-stepper-header-item" :class="{ active: currentStep === 2 }">
                                <span class="value">2</span>
                                <span class="label">Tindakan FF</span>
                            </div>
                            <div class="form-stepper-header-splitter"><span></span></div>

                            <div class="form-stepper-header-item" :class="{ active: currentStep === 3 }">
                                <span class="value">3</span>
                                <span class="label">Tindakan FC & Sumber Daya</span>
                            </div>
                            <div class="form-stepper-header-splitter"><span></span></div>

                            <div class="form-stepper-header-item" :class="{ active: currentStep === 4 }">
                                <span class="value">4</span>
                                <span class="label">Dampak & Penyebab</span>
                            </div>
                            <div class="form-stepper-header-splitter"><span></span></div>

                            <div class="form-stepper-header-item" :class="{ active: currentStep === 5 }">
                                <span class="value">5</span>
                                <span class="label">Dokumentasi</span>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <!-- STEP 1: INFO & KEJADIAN (READONLY) -->
                <v-row v-show="currentStep === 1">
                    <v-col md="12" class="form-separator">
                        <h4>1. Informasi Dasar Lahan (Read-Only)</h4>
                    </v-col>

                    <v-col md="12">
                        <div class="bg-grey py-3 px-3 mb-3">
                            <v-row>
                                <v-col md="4">
                                    <geko-input v-model="form.lahan_no" :item="{
                                        label: 'Nomor Lahan',
                                        type: 'text',
                                        api: 'monitoring-fire-incident/list-web',
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'lahan_no',
                                                label: 'lahan_no',
                                                display: ['lahan_no'],
                                            },
                                        },
                                    }" disabled />
                                </v-col>
                                <v-col md="4">
                                    <geko-input v-model="form.program_year" :item="{
                                        label: 'Tahun Program',
                                        type: 'text',
                                        api: 'monitoring-fire-incident/list-web',
                                        view_data: 'report_program_year',
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'report_program_year',
                                                label: 'report_program_year',
                                                display: ['report_program_year'],
                                            },
                                        },
                                    }" disabled />
                                </v-col>
                                <v-col md="4">
                                    <geko-input v-model="form.farmer_name" :item="{
                                        label: 'Nama Petani',
                                        type: 'text',
                                        api: 'monitoring-fire-incident/list-web',
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'farmer_name',
                                                label: 'farmer_name',
                                                display: ['farmer_name'],
                                            },
                                        },
                                    }" disabled />
                                </v-col>
                                <v-col md="3">
                                    <geko-input v-model="form.village_name" :item="{
                                        label: 'Desa',
                                        type: 'text',
                                        api: 'monitoring-fire-incident/list-web',
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'village_name',
                                                label: 'village_name',
                                                display: ['village_name'],
                                            },
                                        },
                                    }" disabled />
                                </v-col>
                                <v-col md="3">
                                    <geko-input v-model="form.kecamatan_name" :item="{
                                        label: 'Kecamatan',
                                        type: 'text',
                                        api: 'monitoring-fire-incident/list-web',
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'kecamatan_name',
                                                label: 'kecamatan_name',
                                                display: ['kecamatan_name'],
                                            },
                                        },
                                    }" disabled />
                                </v-col>
                                <v-col md="3">
                                    <geko-input v-model="form.kabupaten_name" :item="{
                                        label: 'Kabupaten',
                                        type: 'text',
                                        api: 'monitoring-fire-incident/list-web',
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'kabupaten_name',
                                                label: 'kabupaten_name',
                                                display: ['kabupaten_name'],
                                            },
                                        },
                                    }" disabled />
                                </v-col>
                                <v-col md="3">
                                    <geko-input v-model="form.ff_name" :item="{
                                        label: 'Field Facilitator',
                                        type: 'text',
                                        api: 'monitoring-fire-incident/list-web',
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'ff_name',
                                                label: 'ff_name',
                                                display: ['ff_name', 'ff_no'],
                                            },
                                        },
                                    }" disabled />
                                </v-col>
                                <v-col md="6">
                                    <geko-input v-model="form.mu_name" :item="{
                                        label: 'Managemen Unit',
                                        type: 'text',
                                        api: 'monitoring-fire-incident/list-web',
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'mu_name',
                                                label: 'mu_name',
                                                display: ['mu_name']
                                            }
                                        },
                                    }" disabled />
                                </v-col>
                                <v-col md="6">
                                    <geko-input v-model="form.target_area_name" :item="{
                                        label: 'Target Area',
                                        type: 'text',
                                        api: 'monitoring-fire-incident/list-web',
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'target_area_name',
                                                label: 'target_area_name',
                                                display: ['target_area_name']
                                            },
                                        },
                                    }" disabled />
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>

                    <v-col md="12" class="form-separator">
                        <h4>2. Detail Kejadian & Verifikasi Awal</h4>
                    </v-col>

                    <v-col md="3">
                        <geko-input v-model="form.incident_date" :item="{
                            label: 'Tanggal Kejadian',
                            validation: ['required'],
                            type: 'date',
                            setter: 'incident_date'
                        }" />
                    </v-col>
                    <v-col md="3">
                        <ValidationProvider name="Waktu Kejadian" rules="required" v-slot="{ errors }">
                            <label style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Waktu
                                Kejadian <span class="text-danger">*</span></label>
                            <v-text-field type="time" v-model="form.incident_time" :error-messages="errors" outlined
                                dense hide-details="auto"></v-text-field>
                        </ValidationProvider>
                    </v-col>
                    <v-col md="3">
                        <ValidationProvider name="Laporan Diterima" rules="required" v-slot="{ errors }">
                            <label style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Laporan
                                Diterima</label>
                            <v-text-field type="datetime-local" v-model="form.report_received_time"
                                :error-messages="errors" outlined dense hide-details="auto"></v-text-field>
                        </ValidationProvider>
                    </v-col>
                    <v-col md="3">
                        <ValidationProvider name="Info Diterima FF" rules="required" v-slot="{ errors }">
                            <label style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Info
                                Diterima FF</label>
                            <v-text-field type="datetime-local" v-model="form.ff_info_received_time"
                                :error-messages="errors" outlined dense hide-details="auto"></v-text-field>
                        </ValidationProvider>
                    </v-col>

                    <v-col md="6">
                        <ValidationProvider name="Sumber Informasi Awal" rules="required" v-slot="{ errors }">
                            <label style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Sumber
                                Informasi Awal <span class="text-danger">*</span></label>
                            <v-combobox v-model="form.detection_source"
                                :items="['Laporan warga', 'Hotspot satelit', 'Media Sosial']" :error-messages="errors"
                                outlined dense hide-details="auto"
                                placeholder="Pilih atau ketik sumber lainnya..."></v-combobox>
                        </ValidationProvider>
                    </v-col>
                    <v-col md="6">
                        <geko-input v-model="form.verification_result" :item="{
                            label: 'Hasil Verifikasi Lapangan (Awal)',
                            type: 'text',
                            validation: ['required'],
                            setter: 'verification_result'
                        }" />
                    </v-col>
                </v-row>


                <!-- STEP 2: KRONOLOGI & TINDAKAN FF -->
                <v-row v-show="currentStep === 2">
                    <v-col md="12" class="form-separator">
                        <h4>Kronologi Kejadian (FF)</h4>
                    </v-col>

                    <v-col md="12" v-if="form.chronology.length > 0">
                        <div class="bg-grey py-3 px-3 mb-3">
                            <v-row v-for="(item, i) in form.chronology" :key="'chrono' + i"
                                class="mb-2 border-bottom pb-2">
                                <v-col md="6">
                                    <geko-input v-model="item.tahapan"
                                        :item="{ label: 'Tahapan / Uraian Kejadian', type: 'text' }" disabled />
                                </v-col>
                                <v-col md="2" class="d-flex align-center">
                                    <v-checkbox v-model="item.is_done" label="Terjadi?" color="success"></v-checkbox>
                                </v-col>
                                <v-col md="4">
                                    <label
                                        style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Waktu</label>
                                    <v-text-field type="datetime-local" v-model="item.occurred_at"
                                        :disabled="!item.is_done"
                                        :rules="item.is_done ? [v => !!v || 'Wajib diisi'] : []" outlined
                                        dense></v-text-field>
                                </v-col>

                                <!-- Conditional Notes (Bila Terjadi) -->
                                <v-col md="12" v-if="item.is_done" class="mt-2 pl-5 pr-5">
                                    <geko-input v-model="item.notes"
                                        :item="{ label: 'Keterangan Tambahan / Catatan', type: 'textarea' }" />
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>

                    <v-col md="12" class="form-separator">
                        <h4>Checklist Tindakan (FF)</h4>
                    </v-col>

                    <v-col md="12" v-if="form.ff_action_checklist.length > 0">
                        <div class="bg-grey py-3 px-3">
                            <v-row v-for="(item, i) in form.ff_action_checklist" :key="'ff_check' + i"
                                class="mb-2 border-bottom pb-2">
                                <v-col md="6">
                                    <geko-input v-model="item.tindakan" :item="{ label: 'Tindakan (FF)', type: 'text' }"
                                        disabled />
                                </v-col>
                                <v-col md="2" class="d-flex align-center">
                                    <v-checkbox v-model="item.is_done" :label="item.is_done ? 'Dilakukan' : 'Belum'"
                                        color="success"></v-checkbox>
                                </v-col>
                                <v-col md="4">
                                    <label
                                        style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Waktu</label>
                                    <v-text-field type="datetime-local" v-model="item.done_at" :disabled="!item.is_done"
                                        :rules="item.is_done ? [v => !!v || 'Wajib diisi'] : []" outlined
                                        dense></v-text-field>
                                </v-col>

                                <!-- Conditional Notes & Photos (Bila Dilakukan) -->
                                <v-col md="12" v-if="item.is_done" class="mt-2 pl-5 pr-5 border-left">
                                    <v-row>
                                        <v-col md="12">
                                            <geko-input v-model="item.notes"
                                                :item="{ label: 'Keterangan Tindakan', type: 'textarea' }" />
                                        </v-col>
                                        <v-col md="12">
                                            <label style="font-size: 13px; font-weight: bold; color: #555;">Dokumentasi
                                                / Bukti Foto (Opsional, Maks 3):</label>
                                        </v-col>
                                        <v-col md="4" v-for="e in 3" :key="'ff_ev' + e">
                                            <geko-input v-model="item.evidences[e - 1].photo" :item="{
                                                label: `Bukti Foto ${e}`,
                                                type: 'upload',
                                                api: 'monitoring_kebakaran/upload.php',
                                                directory: 'evidences',
                                                upload_type: 'image/*',
                                                setter: `ff_ev_${i}_${e}`,
                                                view_data: `ff_ev_${i}_${e}`
                                            }" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>


                <!-- STEP 3: TINDAKAN FC & SUMBER DAYA -->
                <v-row v-show="currentStep === 3">
                    <v-col md="12" class="form-separator">
                        <h4>Tindak Lanjut Lapangan (Oleh FC)</h4>
                    </v-col>

                    <v-col md="12" v-if="form.fc_action_checklist.length > 0">
                        <div class="bg-grey py-3 px-3 mb-3">
                            <v-row v-for="(item, i) in form.fc_action_checklist" :key="'fc_check' + i"
                                class="mb-2 border-bottom pb-2">
                                <v-col md="6">
                                    <geko-input v-model="item.tindakan"
                                        :item="{ label: 'Tindakan Lanjutan (FC)', type: 'text' }" disabled />
                                </v-col>
                                <v-col md="2" class="d-flex align-center">
                                    <v-checkbox v-model="item.is_done" :label="item.is_done ? 'Dilakukan' : 'Belum'"
                                        color="success" class="mt-0"></v-checkbox>
                                </v-col>
                                <v-col md="4">
                                    <label
                                        style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Waktu</label>
                                    <v-text-field type="datetime-local" v-model="item.done_at" :disabled="!item.is_done"
                                        :rules="item.is_done ? [v => !!v || 'Wajib diisi'] : []" outlined
                                        dense></v-text-field>
                                </v-col>

                                <!-- Conditional Notes & Photos (Bila Dilakukan) -->
                                <v-col md="12" v-if="item.is_done" class="mt-2 pl-5 pr-5 border-left">
                                    <v-row>
                                        <v-col md="12">
                                            <geko-input v-model="item.notes"
                                                :item="{ label: 'Keterangan Tindakan', type: 'textarea' }" />
                                        </v-col>
                                        <v-col md="12">
                                            <label style="font-size: 13px; font-weight: bold; color: #555;">Dokumentasi
                                                / Bukti Foto (Opsional, Maks 3):</label>
                                        </v-col>
                                        <v-col md="4" v-for="e in 3" :key="'fc_ev' + e">
                                            <geko-input v-model="item.evidences[e - 1].photo" :item="{
                                                label: `Bukti Foto ${e}`,
                                                type: 'upload',
                                                api: 'monitoring_kebakaran/upload.php',
                                                directory: 'evidences',
                                                upload_type: 'image/*',
                                                setter: `fc_ev_${i}_${e}`,
                                                view_data: `fc_ev_${i}_${e}`
                                            }" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>

                    <v-col md="12" class="form-separator">
                        <h4>Sumber Daya yang Terlibat (Oleh FC)</h4>
                    </v-col>

                    <v-col md="12" v-if="form.resources_involved.length > 0">
                        <div class="bg-grey py-3 px-3">
                            <v-row v-for="(res, i) in form.resources_involved" :key="'res' + i"
                                class="mb-2 border-bottom pb-2">
                                <v-col md="8">
                                    <geko-input v-model="res.name"
                                        :item="{ label: 'Pihak Terlibat (Warga/Instansi)', type: 'text' }" disabled />
                                </v-col>
                                <v-col md="4" class="d-flex align-center">
                                    <v-checkbox v-model="res.is_done" label="Terlibat?" color="success"></v-checkbox>
                                </v-col>

                                <!-- Conditional Qty & Notes -->
                                <v-col md="12" v-if="res.is_done" class="mt-2 pl-5 pr-5">
                                    <v-row>
                                        <v-col md="4">
                                            <geko-input v-model="res.qty"
                                                :item="{ label: 'Jml (Org/Unit)', validation: ['required'], type: 'number' }" />
                                        </v-col>
                                        <v-col md="8">
                                            <geko-input v-model="res.notes"
                                                :item="{ label: 'Keterangan / Peran Spesifik', type: 'text' }" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>


                <!-- STEP 4: DAMPAK, POHON & PENYEBAB -->
                <v-row v-show="currentStep === 4">
                    <v-col md="12" class="form-separator">
                        <h4>Luas Terdampak & Kerugian Asap</h4>
                    </v-col>

                    <v-col md="4">
                        <geko-input v-model="form.estimated_burned_land_area"
                            :item="{ label: 'Estimasi Awal Area (m2) - Oleh FF', type: 'number' }" />
                    </v-col>
                    <v-col md="4">
                        <geko-input v-model="form.final_burned_land_area"
                            :item="{ label: 'Estimasi Akhir Area (m2) - Oleh FC', validation: ['required'], type: 'number' }" />
                    </v-col>
                    <v-col md="4">
                        <geko-input v-model="form.nearest_settlement_distance"
                            :item="{ label: 'Jarak ke Pemukiman (m)', type: 'number' }" />
                    </v-col>

                    <v-col md="6">
                        <geko-input v-model="form.plant_loss"
                            :item="{ label: 'Kerugian Tanaman (Cth: 15 Bibit Hangus)', type: 'textarea' }" />
                    </v-col>
                    <v-col md="6">
                        <geko-input v-model="form.smoke_impact"
                            :item="{ label: 'Dampak Asap Lingkungan/Jalan', type: 'textarea' }" />
                    </v-col>

                    <v-col md="12" class="form-separator d-flex flex-row mt-4" style="align-items: center">
                        <h4>Pohon Terdampak (Mati)</h4>
                        <v-btn small variant="success" class="ml-3" @click="addTreeRow">
                            <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col md="12" v-if="form.trees_impacted.length > 0">
                        <div class="bg-grey py-3 px-3 mb-3">
                            <v-row v-for="(tree, i) in form.trees_impacted" :key="'tree' + i"
                                class="mb-2 border-bottom pb-2">
                                <v-col md="6">
                                    <geko-input v-model="tree.tree_code" :item="{
                                        label: 'Jenis Pohon',
                                        placeholder: 'Pilih jenis pohon',
                                        view_data: 'tree_code',
                                        type: 'select',
                                        setter: 'tree',
                                        api: 'GetTreesLocation',
                                        param: {
                                            mu_no: form.mu_no
                                        },
                                        default_label: tree.tree_name,
                                        option: {
                                            getterKey: 'data.result.data',
                                            list_pointer: {
                                                code: 'tree_code',
                                                label: 'tree_name',
                                                display: ['tree_name'],
                                            },
                                        },
                                    }" @selected="onTreeSelected(i, $event)" />
                                </v-col>
                                <v-col md="2">
                                    <geko-input v-model="tree.total_planted"
                                        :item="{ label: 'Total  Tertanam', type: 'text' }" disabled />
                                </v-col>
                                <v-col md="2">
                                    <geko-input v-model="tree.total_alive"
                                        :item="{ label: 'Sisa Hidup', type: 'number' }" />
                                </v-col>
                                <v-col md="1">
                                    <geko-input v-model="tree.total_dead" :item="{ label: 'Mati', type: 'number' }" />
                                </v-col>
                                <v-col md="1" class="d-flex align-center">
                                    <v-btn color="error" icon
                                        @click="removeTreeRow(i)"><v-icon>mdi-delete</v-icon></v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>

                    <v-col md="12" class="form-separator">
                        <h4>Penyebab & Rekomendasi</h4>
                    </v-col>

                    <v-col md="12">
                        <geko-input v-model="form.fire_cause" :item="{
                            label: 'Dugaan Penyebab Kebakaran',
                            type: 'select',
                            placeholder: 'Pilih Penyebab...',
                            option: {
                                default_options: [
                                    { label: 'Slash & Burn (Buka Lahan)', code: 0 },
                                    { label: 'Puntung Rokok', code: 1 },
                                    { label: 'Sengaja Dibakar (Vandalisme)', code: 2 },
                                    { label: 'Sambaran Petir / Alam', code: 3 },
                                    { label: 'Belum Diketahui', code: 4 },
                                    { label: 'Lainnya', code: 5 }
                                ],
                                list_pointer: {
                                    code: 'code',
                                    label: 'label',
                                    display: ['label']
                                }
                            }
                        }" />
                    </v-col>
                    <v-col md="6">
                        <geko-input v-model="form.fire_cause_description"
                            :item="{ label: 'Deskripsi Singkat Penyebab', type: 'textarea' }" />
                    </v-col>
                    <v-col md="6">
                        <geko-input v-model="form.recommendation"
                            :item="{ label: 'Rekomendasi / Tindakan Pencegahan Kedepan', type: 'textarea' }" />
                    </v-col>

                </v-row>

                <!-- STEP 5: DOKUMENTASI & SUBMIT -->
                <v-row v-show="currentStep === 5">
                    <v-col md="12" class="form-separator">
                        <h4>Dokumentasi Kejadian</h4>
                        <span class="text-grey d-block text-08-em note mt-1 mb-3">Foto 1 - 5 (Ekstensi bebas, Max
                            5MB)</span>
                    </v-col>

                    <v-col md="4" v-for="i in 5" :key="'photo' + i" v-if="isDataFetched">
                        <geko-input v-model="form[`photo${i}`]" :item="{
                            label: `Foto ${i}`,
                            validation: [],
                            type: 'upload',
                            api: 'monitoring_kebakaran/upload.php',
                            directory: 'photos',
                            upload_type: 'image/*',
                            setter: `photo_${i}`,
                            view_data: `photo_${i}`,
                            option: {
                                label_hint: 'Klik untuk mengunggah / merubah foto',
                                max_size: 5,
                                max: 5
                            }
                        }" />
                    </v-col>
                </v-row>

                <!-- FOOTER NAVIGASI WIZARD -->
                <v-row class="mt-5">
                    <v-col md="12">
                        <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end;">
                            <v-btn variant="light" class="mr-2" v-if="currentStep > 1" @click="prevStep" outlined>
                                <v-icon left>mdi-chevron-left</v-icon> Sebelumnya
                            </v-btn>

                            <v-btn variant="primary" v-if="currentStep < 5" @click="nextStep" outlined>
                                <span>Selanjutnya</span> <v-icon right>mdi-chevron-right</v-icon>
                            </v-btn>

                            <v-btn type="button" @click="handleSubmit(onSubmit)" variant="success" outlined
                                v-if="currentStep === 5" :loading="isLoading" :disabled="isLoading">
                                <v-icon left>mdi-content-save</v-icon> Simpan Laporan Akhir (FC)
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>

            </form>
        </ValidationObserver>
    </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
    name: 'MonitoringKebakaranUpdate',
    components: {
        ValidationObserver,
        ValidationProvider
    },
    data() {
        return {
            isDataFetched: false,
            currentStep: 1,
            isLoading: false,
            muTrees: [],
            defaultChronology: [
                { tahapan: "Informasi/laporan diterima FF", waktu: null },
                { tahapan: "FF berangkat ke lokasi", waktu: null },
                { tahapan: "FF tiba & mulai verifikasi", waktu: null },
                { tahapan: "Mulai upaya pemadaman oleh warga (didampingi FF)", waktu: null },
                { tahapan: "Api dinyatakan padam", waktu: null },
                { tahapan: "Pemantauan pasca kejadian selesai", waktu: null }
            ],
            defaultFFChecklist: [
                { tindakan: "Melakukan verifikasi lapangan atas laporan/titik panas (hotspot)", is_done: false, waktu: null },
                { tindakan: "Menghubungi & memobilisasi kepada Masyarakat, stakeholder/warga setempat", is_done: false, waktu: null },
                { tindakan: "Mendampingi warga melakukan pemadaman dini (bukan memadamkan sendiri)", is_done: false, waktu: null },
                { tindakan: "Mendokumentasikan kejadian (foto, video, titik koordinat GPS)", is_done: false, waktu: null },
                { tindakan: "Melaporkan perkembangan situasi ke FC", is_done: false, waktu: null },
                { tindakan: "Memantau area pasca-padam untuk potensi munculnya api kembali", is_done: false, waktu: null },
                { tindakan: "Memberikan edukasi singkat pencegahan kebakaran kepada warga", is_done: false, waktu: null },
                { tindakan: "Mencatat kebutuhan dukungan (alat, tenaga) untuk disampaikan ke FC", is_done: false, waktu: null }
            ],
            defaultFCChecklist: [
                { tindakan: "Menerima & memverifikasi laporan awal dari FF", is_done: false, waktu: null },
                { tindakan: "Mengoordinasikan bantuan (BPBD/Damkar/Masyarakat) bila diperlukan", is_done: false, waktu: null },
                { tindakan: "Menghubungkan dengan aparat desa tentang lokasi kebakaran", is_done: false, waktu: null },
                { tindakan: "Memantau keselamatan FF dan warga yang terlibat di lapangan", is_done: false, waktu: null },
                { tindakan: "Mengonsolidasikan informasi dari beberapa FF/lokasi (bila meluas)", is_done: false, waktu: null },
                { tindakan: "Melaporkan perkembangan ke koordinator program/manajemen", is_done: false, waktu: null },
                { tindakan: "Memutuskan eskalasi status kejadian bila diperlukan", is_done: false, waktu: null },
                { tindakan: "Mengoordinasikan evaluasi & pembelajaran pasca kejadian bersama FF", is_done: false, waktu: null }
            ],
            form: {
                mon_no: '',
                lahan_no: '',
                mu_no: '',
                farmer_name: '',
                ff_name: '',
                mu_name: '',
                target_area_name: '',
                village_name: '',
                kecamatan_name: '',
                kabupaten_name: '',
                program_year: '',
                incident_date: '',
                incident_time: '',
                report_received_time: '',
                ff_info_received_time: '',
                detection_source: '',
                verification_result: '',
                estimated_burned_land_area: 0,
                final_burned_land_area: 0,
                nearest_settlement_distance: 0,
                plant_loss: '',
                smoke_impact: '',
                fire_cause: null,
                fire_cause_description: '',
                recommendation: '',
                chronology: [],
                ff_action_checklist: [],
                fc_action_checklist: [],
                resources_involved: [],
                trees_impacted: [],
                photo1: null, photo2: null, photo3: null, photo4: null, photo5: null,
            }
        }
    },
    async mounted() {
        await this.fetchDetailData();
    },
    methods: {
        async loadMUTrees(muNo) {
            if (!muNo) return;
            try {
                const res = await this.$_api.get('GetTreesLocation', { mu_no: muNo });
                let trees = [];
                if (res?.data?.result?.data && Array.isArray(res.data.result.data)) {
                    trees = res.data.result.data;
                } else if (res?.result?.data && Array.isArray(res.result.data)) {
                    trees = res.result.data;
                } else if (res?.data && Array.isArray(res.data)) {
                    trees = res.data;
                } else if (Array.isArray(res)) {
                    trees = res;
                }
                this.muTrees = trees;
            } catch (e) {
                console.error("Gagal load pohon MU:", e);
            }
        },
        onTreeSelected(index, treeData) {
            const selected = this.muTrees.find(t => t.tree_code === treeData.tree_code);
            if (selected) {
                this.form.trees_impacted[index].tree_name = selected.tree_name;
                this.form.trees_impacted[index].total_planted = selected.total_planted;
            }
        },
        async fetchDetailData() {
            const idMonNo = this.$route.query.id || this.$route.params.id;
            const monNo = this.$route.params.mon_no || this.$route.query.mon_no;

            if (!idMonNo && !monNo) return;

            this.isLoading = true;
            try {
                const [resDetail, resTemplate] = await Promise.all([
                    this.$_api.get('monitoring-fire-incident/detail', { id: idMonNo, mon_no: monNo }),
                    this.$_api.get('monitoring-fire-incident/get-template-items')
                ]);

                const detail = resDetail.data.data || resDetail.data;
                const templates = resTemplate.data;

                Object.keys(this.form).forEach(key => {
                    if (detail[key] !== undefined && typeof detail[key] !== 'object') {
                        this.form[key] = detail[key];
                    }
                });

                this.form.program_year = detail.report_program_year;

                if (detail.mu_no) await this.loadMUTrees(detail.mu_no);

                const chronoMap = new Map((detail.chronology || []).map(i => [i.item_code, i]));
                const ffActionMap = new Map((detail.ff_action_checklist || []).map(i => [i.item_code, i]));
                const fcActionMap = new Map((detail.fc_action_checklist || []).map(i => [i.item_code, i]));
                const resMap = new Map((detail.resources_involved || []).map(i => [i.item_code, i]));

                const padEvidences = (evs) => {
                    const arr = [...(evs || [])];
                    while (arr.length < 3) {
                        arr.push({ id: null, photo: null, caption: null, latitude: null, longitude: null });
                    }
                    return arr.slice(0, 3);
                };

                this.form.chronology = (templates.chronology || []).map(tpl => {
                    const existing = chronoMap.get(tpl.code);
                    return {
                        item_code: tpl.code,
                        tahapan: tpl.label,
                        id: existing?.id || null,
                        is_done: existing?.occurred_at ? true : false,
                        occurred_at: existing?.occurred_at || null,
                        notes: existing?.notes || ''
                    };
                });

                this.form.ff_action_checklist = (templates.ff_action || []).map(tpl => {
                    const existing = ffActionMap.get(tpl.code);
                    return {
                        item_code: tpl.code,
                        tindakan: tpl.label,
                        id: existing?.id || null,
                        is_done: existing?.is_done == 1 ? true : false,
                        done_at: existing?.done_at || null,
                        evidences: padEvidences(existing?.evidences)
                    };
                });

                this.form.fc_action_checklist = (templates.fc_action || []).map(tpl => {
                    const existing = fcActionMap.get(tpl.code);
                    return {
                        item_code: tpl.code,
                        tindakan: tpl.label,
                        id: existing?.id || null,
                        is_done: existing?.is_done == 1 ? true : false,
                        done_at: existing?.done_at || null,
                        evidences: padEvidences(existing?.evidences)
                    };
                });

                this.form.resources_involved = (templates.resource || []).map(tpl => {
                    const existing = resMap.get(tpl.code);
                    return {
                        item_code: tpl.code,
                        name: tpl.label,
                        id: existing?.id || null,
                        is_done: existing ? true : false,
                        qty: existing?.qty || 1,
                        notes: existing?.notes || ''
                    };
                });

                if (detail.trees_impacted && Array.isArray(detail.trees_impacted)) {
                    this.form.trees_impacted = detail.trees_impacted.map(t => {
                        return {
                            ...t,
                            total_planted: t.total_planted || 0
                        };
                    });
                }

            } catch (error) {
                console.error("Gagal load data detail:", error);
            } finally {
                this.isLoading = false;
                this.isDataFetched = true;
            }
        },
        async nextStep() {
            const isValid = await this.$refs.fireForm.validate();
            if (isValid && this.currentStep < 5) {
                this.currentStep++;
            }
        },
        prevStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
            }
        },
        addTreeRow() {
            this.form.trees_impacted.push({ tree_code: '', tree_name: '', total_planted: 0, total_alive: 0, total_dead: 0 });
        },
        removeTreeRow(index) { this.form.trees_impacted.splice(index, 1); },

        async onSubmit() {
            const isValid = await this.$refs.fireForm.validate();
            if (!isValid) return;

            const promptConfirm = await this.$_alert.confirm(
                "Konfirmasi Update",
                "Pastikan data benar sebelum menyimpan data!",
                "Ya, benar",
                "Batalkan"
            );

            if (!promptConfirm) return;

            this.isLoading = true;

            try {
                const payload = { ...this.form };

                payload.resources_involved = payload.resources_involved.filter(r => r.is_done);

                payload.chronology = payload.chronology.map(c => ({
                    ...c,
                    occurred_at: c.is_done ? c.occurred_at : null,
                    notes: c.is_done ? c.notes : ''
                }));

                payload.ff_action_checklist = payload.ff_action_checklist.map(c => ({
                    ...c,
                    done_at: c.is_done ? c.done_at : null,
                    notes: c.is_done ? c.notes : ''
                }));
                payload.fc_action_checklist = payload.fc_action_checklist.map(c => ({
                    ...c,
                    done_at: c.is_done ? c.done_at : null,
                    notes: c.is_done ? c.notes : ''
                }));

                await this.$_api.post('monitoring-fire-incident/update-from-web', payload);
                this.$_alert.success('Berhasil Update Data');
                this.$router.go(-1);
            } catch (err) {
                console.error(err);
                this.isLoading = false;
                this.$_alert.error('Gagal mengupdate data!');
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>