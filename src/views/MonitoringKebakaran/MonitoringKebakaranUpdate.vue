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
                                        options: {
                                            getterKey: 'data',
                                            list_pointer: {
                                                code: 'program_year',
                                                label: 'program_year',
                                                display: ['program_year'],
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
                    <v-col md="12" class="form-separator d-flex flex-row" style="align-items: center">
                        <h4>Kronologi Kejadian (FF)</h4>
                        <v-btn small variant="success" class="ml-3" @click="addChronology">
                            <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col md="12" v-if="form.chronology.length > 0">
                        <div class="bg-grey py-3 px-3 mb-3">
                            <v-row v-for="(item, i) in form.chronology" :key="'chrono' + i"
                                class="mb-2 border-bottom pb-2">
                                <v-col md="9">
                                    <geko-input v-model="item.tahapan"
                                        :item="{ label: 'Tahapan / Uraian Kejadian', validation: ['required'], type: 'text' }" />
                                </v-col>
                                <v-col md="2">
                                    <label
                                        style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Waktu</label>
                                    <v-text-field type="time" v-model="item.waktu" outlined dense
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col md="1" class="d-flex align-center">
                                    <v-btn color="error" icon
                                        @click="removeChronology(i)"><v-icon>mdi-delete</v-icon></v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>

                    <v-col md="12" class="form-separator d-flex flex-row" style="align-items: center">
                        <h4>Checklist Tindakan (FF)</h4>
                        <v-btn small variant="success" class="ml-3" @click="addFFChecklist">
                            <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col md="12" v-if="form.ff_action_checklist.length > 0">
                        <div class="bg-grey py-3 px-3">
                            <v-row v-for="(item, i) in form.ff_action_checklist" :key="'ff_check' + i"
                                class="mb-2 border-bottom pb-2">
                                <v-col md="7">
                                    <geko-input v-model="item.tindakan"
                                        :item="{ label: 'Tindakan (FF)', validation: ['required'], type: 'text' }" />
                                </v-col>
                                <v-col md="2" class="d-flex align-center">
                                    <v-checkbox v-model="item.is_done" :label="item.is_done ? 'Dilakukan' : 'Belum'"
                                        color="success"></v-checkbox>
                                </v-col>
                                <v-col md="2">
                                    <label
                                        style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Waktu</label>
                                    <v-text-field type="time" v-model="item.waktu" :disabled="!item.is_done" outlined
                                        dense hide-details></v-text-field>
                                </v-col>
                                <v-col md="1" class="d-flex align-center">
                                    <v-btn color="error" icon
                                        @click="removeFFChecklist(i)"><v-icon>mdi-delete</v-icon></v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>


                <!-- STEP 3: TINDAKAN FC & SUMBER DAYA -->
                <v-row v-show="currentStep === 3">
                    <v-col md="12" class="form-separator d-flex flex-row" style="align-items: center">
                        <h4>Tindak Lanjut Lapangan (Oleh FC)</h4>
                        <v-btn small variant="success" class="ml-3" @click="addFCChecklist">
                            <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col md="12" v-if="form.fc_action_checklist.length > 0">
                        <div class="bg-grey py-3 px-3 mb-3">
                            <v-row v-for="(item, i) in form.fc_action_checklist" :key="'fc_check' + i"
                                class="mb-2 border-bottom pb-2">
                                <v-col md="7">
                                    <geko-input v-model="item.tindakan"
                                        :item="{ label: 'Tindakan Lanjutan (FC)', validation: ['required'], type: 'text' }" />
                                </v-col>
                                <v-col md="2" class="d-flex align-center">
                                    <v-checkbox v-model="item.is_done" :label="item.is_done ? 'Dilakukan' : 'Belum'"
                                        color="success" class="mt-0"></v-checkbox>
                                </v-col>
                                <v-col md="2">
                                    <label
                                        style="font-size: 13px; color: #757575; display: block; margin-bottom: 4px;">Waktu</label>
                                    <v-text-field type="time" v-model="item.waktu" :disabled="!item.is_done" outlined
                                        dense hide-details></v-text-field>
                                </v-col>
                                <v-col md="1" class="d-flex align-center">
                                    <v-btn color="error" icon
                                        @click="removeFCChecklist(i)"><v-icon>mdi-delete</v-icon></v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>

                    <v-col md="12" class="form-separator d-flex flex-row" style="align-items: center">
                        <h4>Sumber Daya yang Terlibat (Oleh FC)</h4>
                        <v-btn small variant="success" class="ml-3" @click="addResource">
                            <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col md="12" v-if="form.resources_involved.length > 0">
                        <div class="bg-grey py-3 px-3">
                            <v-row v-for="(res, i) in form.resources_involved" :key="'res' + i"
                                class="mb-2 border-bottom pb-2">
                                <v-col md="4">
                                    <geko-input v-model="res.sumber_daya"
                                        :item="{ label: 'Pihak Terlibat (Warga/Instansi)', validation: ['required'], type: 'text' }" />
                                </v-col>
                                <v-col md="2">
                                    <geko-input v-model="res.jumlah"
                                        :item="{ label: 'Jml (Org/Unit)', validation: ['required'], type: 'number' }" />
                                </v-col>
                                <v-col md="5">
                                    <geko-input v-model="res.keterangan"
                                        :item="{ label: 'Keterangan / Peran', type: 'text' }" />
                                </v-col>
                                <v-col md="1" class="d-flex align-center">
                                    <v-btn color="error" icon
                                        @click="removeResource(i)"><v-icon>mdi-delete</v-icon></v-btn>
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
                                        default_options: 'data.trees_impacted.tree_code',
                                        type: 'select',
                                        setter: 'tree',
                                        api: 'GetTreesLocation',
                                        param: {
                                            mu_no: form.mu_no
                                        },
                                        option: {
                                            getterKey: 'data.result.data',
                                            list_pointer: {
                                                code: 'tree_code',
                                                label: 'tree_name',
                                                display: ['tree_name'],
                                            },
                                        },
                                    }" />
                                </v-col>
                                <v-col md="2">
                                    <geko-input v-model="tree.total_planted"
                                        :item="{ label: 'Total  Tertanam', type: 'text' }" disabled/>
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
                            api: 'monitoring-kebakaran/upload.php',
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
                if (res && res.data) {
                    this.muTrees = res.data;
                }
            } catch (e) {
                console.error("Gagal load pohon MU:", e);
            }
        },
        onTreeSelected(index, treeCode) {
            const selected = this.muTrees.find(t => t.tree_code === treeCode);
            if (selected) {
                this.form.trees_impacted[index].tree_name = selected.tree_name;
            }
        },
        async fetchDetailData() {
            const idMonNo = this.$route.query.id || this.$route.params.id;
            const monNo = this.$route.params.mon_no || this.$route.query.mon_no;
            if (!idMonNo && !monNo) {
                this.isDataFetched = true;
                return;
            }

            this.isLoading = true;
            try {
                const res = await this.$_api.get('monitoring-fire-incident/detail', { id: idMonNo, mon_no: monNo });

                const val = res.data;

                if (val) {
                    Object.keys(this.form).forEach(key => {
                        if (val[key] !== undefined) {
                            this.form[key] = val[key];
                        }
                    });

                    if (val.mu_no) {
                        this.loadMUTrees(val.mu_no);
                    }

                    const jsonFields = ['chronology', 'ff_action_checklist', 'fc_action_checklist', 'resources_involved'];
                    jsonFields.forEach(field => {
                        if (typeof this.form[field] === 'string' && this.form[field] !== '') {
                            try {
                                this.form[field] = JSON.parse(this.form[field]);
                            } catch (e) {
                                this.form[field] = [];
                            }
                        } else if (!this.form[field]) {
                            this.form[field] = [];
                        }
                    });

                    const mergeArray = (defaultArr, dbArr, keyName) => {
                        const result = [];
                        defaultArr.forEach(def => {
                            const found = dbArr.find(db => db[keyName] === def[keyName]);
                            result.push(found ? { ...found } : { ...def });
                        });
                        dbArr.forEach(db => {
                            if (!defaultArr.some(def => def[keyName] === db[keyName])) result.push({ ...db });
                        });
                        return result;
                    };

                    this.form.chronology = mergeArray(this.defaultChronology, this.form.chronology, 'tahapan');
                    this.form.ff_action_checklist = mergeArray(this.defaultFFChecklist, this.form.ff_action_checklist, 'tindakan');
                    this.form.fc_action_checklist = mergeArray(this.defaultFCChecklist, this.form.fc_action_checklist, 'tindakan');

                    if (val.trees_data && Array.isArray(val.trees_data)) {
                        this.form.trees_impacted = val.trees_data;
                    }
                }
            } catch (error) {
                console.error("Gagal mengambil data detail:", error);
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
        addChronology() { this.form.chronology.push({ tahapan: '', waktu: null }); },
        removeChronology(index) { this.form.chronology.splice(index, 1); },
        addFFChecklist() { this.form.ff_action_checklist.push({ tindakan: '', is_done: false, waktu: null }); },
        removeFFChecklist(index) { this.form.ff_action_checklist.splice(index, 1); },
        addFCChecklist() { this.form.fc_action_checklist.push({ tindakan: '', is_done: false, waktu: null }); },
        removeFCChecklist(index) { this.form.fc_action_checklist.splice(index, 1); },
        addResource() { this.form.resources_involved.push({ sumber_daya: '', jumlah: 1, keterangan: '' }); },
        removeResource(index) { this.form.resources_involved.splice(index, 1); },
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
                await this.$_api.post('monitoring-fire-incident/update-from-web', this.form);
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