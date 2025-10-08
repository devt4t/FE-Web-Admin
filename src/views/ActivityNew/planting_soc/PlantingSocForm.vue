<template>
    <div class="geko-form-wrapper planting-soc-form" v-if="ready">
        <ValidationObserver ref="plantingSocForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <v-row>
                    <v-col md="12" class="form-separator">
                        <h4>Tanggal Distribusi</h4>
                    </v-col>



                    <v-col md="12">
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
                        <geko-input v-model="formData.soc_date" :item="{
                            label: 'Tanggal Sostam',
                            type: 'date',
                            validation: ['required'],

                        }" />
                    </v-col>

                    <v-col md="8">

                        <span class="geko-input" style="position: relative;">
                            <label class="required mb-3"> Tanggal Distribusi</label>
                            <date-picker @calendar-change="onCalendarPickerChange" :disabled-date="dateDisabled"
                                title-format="YYYY-MMMM-DD" class="distribution-calendar"
                                v-model="formData.distribution_date" format="YYYY-MM-DD" type="date"
                                placeholder="Select date" :popup-style="{a:5}" inline>
                            </date-picker>
                            <v-overlay v-if="loading" absolute opacity="0.5">
                                <v-progress-circular indeterminate size="50"></v-progress-circular>
                                <span>Mengambil data bibit</span>
                            </v-overlay>
                        </span>
                    </v-col>
                    <v-col md="4" sm="12">

                        <v-row class="distribution-date-row">
                            <v-col md="12" sm="6">
                                <div class="distribution-date success">
                                    <v-icon>mdi-truck-fast-outline</v-icon>
                                    <div class="pl-3">
                                        <label for="">Distribusi</label>
                                        <div class="distribution-date-label" v-if="formData.distribution_date">
                                            {{ formatDate(formData.distribution_date, 'D MMMM YYYY') }}
                                        </div>
                                        <div class="distribution-date-label" v-else>-</div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col md="12" sm="6">
                                <div class="distribution-date success">
                                    <v-icon>mdi-map-marker-distance</v-icon>
                                    <div class="pl-3">
                                        <label for="">Nursery</label>
                                        <div class="distribution-date-label" v-if="nurseryLocation">
                                            {{ nurseryLocation.name_location_nursery }}
                                        </div>
                                        <div class="distribution-date-label" v-else>-</div>
                                    </div>
                                </div>
                            </v-col>


                            <v-col md="12" sm="6">
                                <div class="distribution-date">
                                    <v-icon>mdi-clipboard-text-clock-outline</v-icon>
                                    <div class="pl-3">
                                        <label for="">Pembuatan Lubang Tanam</label>
                                        <div class="distribution-date-label"
                                            v-if="plantingHoleStart && plantingHoleEnd">
                                            {{ formatDate(plantingHoleStart, 'D MMM YYYY') }} - {{
                                                formatDate(plantingHoleEnd,
                                                    'D MMM YYYY') }}
                                        </div>
                                        <div class="distribution-date-label" v-else>-</div>
                                    </div>
                                </div>
                            </v-col>

                            <v-col md="12" sm="6">
                                <div class="distribution-date">
                                    <v-icon>mdi-clipboard-text-clock-outline</v-icon>
                                    <div class="pl-3">
                                        <label for="">Realisasi Tanam</label>
                                        <div class="distribution-date-label"
                                            v-if="plantingRealizationStart && plantingRealizationEnd">
                                            {{ formatDate(plantingRealizationStart, 'D MMM YYYY') }} -
                                            {{ formatDate(plantingRealizationEnd, 'D MMM YYYY') }}
                                        </div>
                                        <div class="distribution-date-label" v-else>-</div>
                                    </div>
                                </div>
                            </v-col>

                            <v-col md="12" sm="6">
                                <div class="distribution-date">
                                    <v-icon>mdi-sprout</v-icon>
                                    <div class="pl-3">
                                        <label for="">Alokasi Bibit Tersisa</label>
                                        <div class="distribution-date-label" v-if="nurseryLocation">
                                            {{
                                                remainingSeedAMonth.find(d => {
                                                    const selectedDate = () => {
                                                        const d = new Date(JSON.parse(JSON.stringify(formData))?.distribution_date);
                                                        d.setDate(d.getDate() + 1);
                                                        return d.toISOString().split('T')[0];
                                                    };
                                                    return d.date === selectedDate();
                                                })?.remaining | parse('ts') ?? '-'
                                                
                                            }}
                                        </div>
                                        <div class="distribution-date-label" v-else>-</div>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>






                    <v-col md="12" class="form-separator" v-if="lahans.length > 0">
                        <h4>Daftar Petani & Lahan</h4>
                    </v-col>

                    <v-col md="12" v-if="lahans.length > 0">
                        <div class="lahan-statistic">
                            <div class="lahan-statistic-item light">
                                <v-icon>mdi-account-multiple</v-icon>
                                <div class="lahan-statistic-value">
                                    <span class="label">Jumlah Petani</span>
                                    <span class="value">{{ lahanStatistic.totalFarmer != null ?
                                        lahanStatistic.totalFarmer : '-' }}</span>
                                </div>
                            </div>
                            <div class="lahan-statistic-item success">
                                <v-icon style="color: green;">mdi-sprout</v-icon>
                                <div class="lahan-statistic-value">
                                    <span class="label">Jumlah Kayu</span>
                                    <span class="value">{{ lahanStatistic.totalKayu != null ? lahanStatistic.totalKayu :
                                        '-' | parse('ts') }}</span>
                                </div>
                            </div>
                            <div class="lahan-statistic-item warning">
                                <v-icon style="color: orange;">mdi-sprout</v-icon>
                                <div class="lahan-statistic-value">
                                    <span class="label">Jumlah MPTS</span>
                                    <span class="value">{{ lahanStatistic.totalMpts != null ? lahanStatistic.totalMpts :
                                        '-' | parse('ts') }}</span>
                                </div>
                            </div>
                            <div class="lahan-statistic-item primary">
                                <v-icon style="color: #5ab2ff;">mdi-account-multiple</v-icon>
                                <div class="lahan-statistic-value">
                                    <span class="label">Jumlah Bibit</span>
                                    <span class="value">{{ lahanStatistic.totalSeed != null ?
                                        lahanStatistic.totalSeed : '-' | parse('ts') }}</span>
                                </div>
                            </div>
                        </div>
                        <table class="farmer-lahan geko-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th class="text-left">Petani</th>
                                    <th class="text-left">No. Lahan</th>
                                    <th>Total Kayu</th>
                                    <th>Total MPTS</th>
                                    <th>Total Bibit</th>
                                    <th>Kehadiran</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(farmer, i) in lahans" :key="`farmer-land-${i}`" :class="{
                                    'bordered': farmer.bordered
                                }">
                                    <td class="text-center">
                                        <span v-if="farmer.bordered">{{ farmer.index
                                            }}</span>
                                    </td>
                                    <td class="text-left">
                                        <div class="d-block" v-if="farmer.bordered">
                                            <h4 class="font-weight-normal">{{ farmer.farmer_name }}</h4>
                                            <span class="badge bg-light">
                                                {{ farmer.farmer_no }}
                                            </span>
                                        </div>
                                    </td>

                                    <td class="text-left">
                                        <h4 class="font-weight-normal">{{ farmer.lahan_no }}</h4>
                                    </td>
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
                                    <td class="text-center">

                                        <span class="d-flex flex-row align-items-center justify-content-center">
                                            <v-icon style="color: #5ab2ff;">mdi-sprout</v-icon>
                                            <span class="amount" style="color: #5ab2ff">{{ farmer.total_mpts +
                                                farmer.total_kayu }}</span>
                                        </span>
                                    </td>
                                    <td>

                                        <div class="d-flex flex-row justify-content-center">
                                            <v-checkbox @change="onChangeAttendance($event, farmer)"
                                                v-if="farmer.bordered" v-model="farmer.attendance"
                                                color="success"></v-checkbox>
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

                        <v-col md="12" class="form-separator ml-0 pl-0 ">
                            <h4>Koordinat Lokasi Distribusi</h4>
                        </v-col>
                        <span class="geko-input">
                            <div ref="mapContainer" id="mapContainer" class="map-container"
                                style="width: 100%; height: 600px;"></div>
                        </span>
                    </v-col>

                    <v-col md="12">
                        <div class="d-flex flex-row justify-content-end">
                            <v-btn :disabled="loading || !lahans.length" variant="success" type="submit">
                                <v-icon v-if="!loading">mdi-plus</v-icon>

                                <v-progress-circular v-else :size="20" color="green"
                                    indeterminate></v-progress-circular>
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