<template>
    <div class="geko-form-wrapper planting-soc-form" v-if="ready">
        <ValidationObserver ref="plantingSocForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <v-row>
                    <v-col md="12" class="form-separator">
                        <h4>Tanggal Distribusi</h4>
                    </v-col>



                    <v-col md="6">
                        <geko-input v-model="formData.ff_no" :item="{
                            label: 'Field Facilitator',
                            validation: ['required'],
                            col_size: 6,
                            type: 'select',
                            setter: 'ff_no',
                            api: 'getFFOptionsSostam',
                            option: {
                                getterKey: 'data.result',
                                default_options: ffList,
                                list_pointer: {
                                    code: 'ff_no',
                                    label: 'name',
                                    display: ['name', 'ff_no'],
                                },
                            },
                        }" @selected="onChangeFf($event)" />
                    </v-col>

                    <v-col md="12">

                        <span class="geko-input" style="position: relative;">
                            <label class="required mb-3"> Tanggal Distribusi</label>
                            <date-picker @calendar-change="onCalendarPickerChange" :disabled-date="dateDisabled"
                                title-format="YYYY-MMMM-DD" class="distribution-calendar"
                                v-model="formData.distribution_date" format="YYYY-MM-DD" type="date"
                                placeholder="Select date" inline></date-picker>
                            <v-overlay v-if="loading" absolute opacity="0.5">
                                <v-progress-circular indeterminate size="50"></v-progress-circular>
                                <span>Mengambil data bibit</span>
                            </v-overlay>
                        </span>
                    </v-col>

                    <v-col md="6">
                        <div class="distribution-date">
                            <v-icon>mdi-clipboard-text-clock-outline</v-icon>
                            <div class="pl-3">
                                <label for="">Pembuatan Lubang Tanam</label>
                                <div class="distribution-date-label" v-if="plantingHoleStart && plantingHoleEnd">
                                    {{ formatDate(plantingHoleStart, 'D MMMM YYYY') }} - {{ formatDate(plantingHoleEnd,
                                        'D MMMM YYYY') }}
                                </div>
                                <div class="distribution-date-label" v-else>-</div>
                            </div>
                        </div>
                    </v-col>

                    <v-col md="6">
                        <div class="distribution-date">
                            <v-icon>mdi-clipboard-text-clock-outline</v-icon>
                            <div class="pl-3">
                                <label for="">Realisasi Tanam</label>
                                <div class="distribution-date-label"
                                    v-if="plantingRealizationStart && plantingRealizationEnd">
                                    {{ formatDate(plantingRealizationStart, 'D MMMM YYYY') }} -
                                    {{ formatDate(plantingRealizationEnd, 'D MMMM YYYY') }}
                                </div>
                                <div class="distribution-date-label" v-else>-</div>
                            </div>
                        </div>
                    </v-col>
                    <v-col md="12" class="form-separator" v-if="lahans.length > 0">
                        <h4>Daftar Petani & Lahan</h4>
                    </v-col>

                    <v-col md="12" v-if="lahans.length > 0">
                        <table class="farmer-lahan geko-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Petani</th>
                                    <th>Total Kayu</th>
                                    <th>Total MPTS</th>
                                    <th>Kehadiran</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(farmer, i) in lahans" :key="`farmer-land-${i}`">
                                    <td class="text-center">{{ i + 1 }}</td>
                                    <td class="text-left">{{ farmer.farmer_name }}</td>
                                    <td class="text-center">
                                        <span class="d-flex flex-row align-items-center justify-content-center">
                                            <v-icon style="color: green;">mdi-sprout</v-icon>
                                            <span class="amount">{{ farmer.total_kayu }}</span>
                                        </span>
                                    </td>
                                    <td class="text-center">

                                        <span class="d-flex flex-row align-items-center justify-content-center">
                                            <v-icon style="color: orange;">mdi-sprout</v-icon>
                                            <span class="amount">{{ farmer.total_mpts }}</span>
                                        </span>
                                    </td>
                                    <td>

                                        <div class="d-flex flex-row justify-content-center">
                                            <v-checkbox v-model="farmer.attendance" color="success"></v-checkbox>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </v-col>

                    <v-col md="6">
                        <v-row>
                            <v-col md="12" class="form-separator">
                                <h4>Alamat Distribusi</h4>
                            </v-col>

                            <v-col md="12">
                                <geko-input v-model="formData.distribution_location" :item="{
                                    label: 'Detail Alamat',
                                    validation: ['required'],
                                    type: 'textarea',
                                    setter: 'distribution_location',
                                    placeholder: 'Balai Desa / Rumah Bp.. / dll'
                                }" />
                            </v-col>

                            <v-col md="12">
                                <geko-input v-model="formData.rec_armada" :item="{
                                    label: 'Rekomendasi Armada',
                                    validation: ['required'],
                                    type: 'text',
                                    setter: 'rec_armada',
                                    placeholder: 'Truk, SS atau lainnya'
                                }" />
                            </v-col>


                            <v-col md="12">
                                <geko-input v-model="formData.training_material" :item="{
                                    label: 'Materi Pelatihan',
                                    validation: ['required'],
                                    type: 'select',
                                    api: 'GetTrainingMaterials',
                                    setter: 'training_material',
                                    placeholder: 'Materi Pelatihan',
                                    option: {
                                        getterKey: 'data.result',
                                        list_pointer: {
                                            code: 'material_no',
                                            label: 'material_name',
                                            display: ['material_name',],
                                        },
                                    }
                                }" />
                            </v-col>


                            <v-col md="12">
                                <geko-input v-model="formData.absent1" :item="{
                                    label: 'Foto Absensi 1',
                                    validation: ['required'],
                                    type: 'upload',
                                    api: 'planting-socs/upload.php',
                                    directory: 'images',
                                    upload_type: 'image/*',
                                    setter: 'absent1',
                                    view_data: 'absent1',
                                    option: {
                                        label_hint:
                                            'Klik gambar untuk memilih berkas yang akan diunggah',
                                        max_size: 5,
                                        max: 5,
                                        multiple: false,
                                    },
                                }" />
                            </v-col>


                            <v-col md="12">
                                <geko-input v-model="formData.absent2" :item="{
                                    label: 'Foto Absensi 2',
                                    validation: [],
                                    type: 'upload',
                                    api: 'planting-socs/upload.php',
                                    directory: 'images',
                                    upload_type: 'image/*',
                                    setter: 'absent2',
                                    view_data: 'absent2',
                                    option: {
                                        label_hint:
                                            'Klik gambar untuk memilih berkas yang akan diunggah',
                                        max_size: 5,
                                        max: 5,
                                        multiple: false,
                                    },
                                }" />
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col md="6">

                        <v-col md="12" class="form-separator ml-0 pl-0">
                            <h4>Koordinat Lokasi Distribusi</h4>
                        </v-col>
                        <span class="geko-input">
                            <div ref="mapContainer" id="mapContainer" class="map-container"
                                style="width: 100%; height: 600px;"></div>
                        </span>
                    </v-col>

                    <v-col md="12">
                        <div class="d-flex flex-row justify-content-end">
                            <v-btn variant="success" type="submit">
                                <v-icon>mdi-plus</v-icon>
                                <span class="ml-1">Tambah Data Sostam</span>
                            </v-btn>
                        </div>
                    </v-col>

                </v-row>
            </form>
        </ValidationObserver>
    </div>

</template>


<script src="./PlantingSocForm.js">
</script>