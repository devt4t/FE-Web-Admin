<template>
  <div class="geko-form-wrapper scooping-visit-form">
    <v-row class="mb-4">
      <v-col md="12">
        <div class="form-stepper-header">
          <div
            class="form-stepper-header-item"
            :class="{
              active: form === 1,
            }"
          >
            <span class="value">1</span>
            <span class="label">Tanggal & Data Desa</span>
          </div>

          <div class="form-stepper-header-splitter">
            <span></span>
          </div>
          <div
            class="form-stepper-header-item"
            :class="{
              active: form === 2,
            }"
          >
            <span class="value">2</span>
            <span class="label">Data Wilayah</span>
          </div>

          <div class="form-stepper-header-splitter">
            <span></span>
          </div>
          <div
            class="form-stepper-header-item"
            :class="{
              active: form === 3,
            }"
          >
            <span class="value">3</span>
            <span class="label">Data Lahan, GIS &amp; Tokoh Desa</span>
          </div>
        </div>
      </v-col>
    </v-row>
    <ValidationObserver
      ref="firstForm"
      v-slot="{ handleSubmit }"
      v-show="form === 1"
    >
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Lokasi &amp; Tanggal Kegiatan Scooping</h4>
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.project_id"
              :item="{
                label: 'Project',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'project_id',
                api: 'GetProjectAllAdmin',
                option: {
                  list_pointer: {
                    code: 'id',
                    label: 'project_name',
                    display: ['project_name', 'project_no'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.province_id"
              :item="{
                label: 'Provinsi',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'province_id',
                api: 'GetProvince',
                option: {
                  getterKey: 'data.result',
                  list_pointer: {
                    code: 'id',
                    label: 'name',
                    display: ['name'],
                  },
                },
              }"
              @selected="formData.province_code = $event.province_code"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.city_id"
              :item="{
                label: 'Kabupaten / Kota',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'city_id',
                api: 'GetKabupaten',
                param: {
                  province_code: formData.province_code,
                },
                option: {
                  getterKey: 'data.result',
                  list_pointer: {
                    code: 'id',
                    label: 'name',
                    display: ['name'],
                  },
                },
              }"
              @selected="formData.city_code = $event.kabupaten_no"
              :disabled="!formData.province_id"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.district_id"
              :item="{
                label: 'Kecamatan',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'district_id',
                api: 'GetKecamatan',
                param: {
                  kabupaten_no: formData.city_code,
                },
                option: {
                  getterKey: 'data.result',
                  list_pointer: {
                    code: 'id',
                    label: 'name',
                    display: ['name'],
                  },
                },
              }"
              @selected="formData.district_code = $event.kode_kecamatan"
              :disabled="!formData.city_id"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.village_id"
              :item="{
                label: 'Desa',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'village_id',
                api: 'GetDesa',
                param: {
                  kode_kecamatan: formData.district_code,
                },
                option: {
                  getterKey: 'data.result',
                  list_pointer: {
                    code: 'id',
                    label: 'name',
                    display: ['name'],
                  },
                },
              }"
              @selected="formData.village_code = $event.kode_desa"
              :disabled="!formData.district_id"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.date"
              :item="{
                label: 'Tanggal Scooping',
                validation: ['required'],
                col_size: 6,
                type: 'daterange',
                setter: 'date',
              }"
            />
          </v-col>
          <v-col md="12" class="form-separator">
            <h4>Data General Desa</h4>
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.village_area"
              :item="{
                label: 'Luas Desa (Ha)',
                validation: ['required'],
                col_size: 6,
                type: 'number',
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.accessibility"
              :item="{
                label: 'Akesibilitas',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                option: {
                  default_options: [
                    {
                      text: 'Mudah',
                      value: 'easy',
                    },
                    {
                      text: 'Sedang',
                      value: 'medium',
                    },
                    {
                      text: 'Sulit',
                      value: 'hard',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.water_source"
              :item="{
                label: 'Sumber Air',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                option: {
                  multiple: true,
                  default_options: [
                    {
                      text: 'Sungai',
                      value: 'river',
                    },
                    {
                      text: 'Waduk',
                      value: 'reservoir',
                    },
                    {
                      text: 'Danau',
                      value: 'lake',
                    },
                    {
                      text: 'Pam Desa',
                      value: 'pam_village',
                    },
                    {
                      text: 'Mata Air',
                      value: 'water_springs',
                    },
                    {
                      text: 'Sumur',
                      value: 'well',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.electricity_source"
              :item="{
                label: 'Sumber Listrik',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                option: {
                  multiple: true,
                  default_options: [
                    {
                      text: 'PLN',
                      value: 'PLN',
                    },
                    {
                      text: 'Solarcell',
                      value: 'Solarcell',
                    },
                    {
                      text: 'Genset Desa',
                      value: 'Genset Desa',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.government_place"
              :item="{
                label: 'Tempat Pemerintahan',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                option: {
                  multiple: true,
                  default_options: [
                    {
                      text: 'Kantor Bupati',
                      value: 'Kantor Bupati',
                    },
                    {
                      text: 'Kantor Camat',
                      value: 'Kantor Camat',
                    },
                    {
                      text: 'Kantor Lurah',
                      value: 'Kantor Lurah',
                    },
                    {
                      text: 'Kantor Kepala Desa',
                      value: 'Kantor Kepala Desa',
                    },
                    {
                      text: 'Kantor Polisi',
                      value: 'Kantor Polisi',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.land_coverage"
              :item="{
                label: 'Cakupan Lahan',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                option: {
                  multiple: true,
                  default_options: [
                    {
                      text: 'Hutan Rimba',
                      value: 'Hutan Rimba',
                    },
                    {
                      text: 'Perkebunan/Kebun',
                      value: 'Perkebunan/Kebun',
                    },
                    {
                      text: 'Pemukiman',
                      value: 'Pemukiman',
                    },
                    {
                      text: 'Sawah Tadah Hujan',
                      value: 'Sawah Tadah Hujan',
                    },
                    {
                      text: 'Semak Belukar',
                      value: 'Semak Belukar',
                    },
                    {
                      text: 'Tegalan/Ladang',
                      value: 'Tegalan/Ladang',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.vegetation_density"
              :item="{
                label: 'Kerapatan Vegetasi',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                option: {
                  multiple: true,
                  default_options: [
                    {
                      text: 'Tinggi',
                      value: 'Tinggi',
                    },
                    {
                      text: 'Sedang',
                      value: 'Sedang',
                    },
                    {
                      text: 'Rendah',
                      value: 'Rendah',
                    },
                    {
                      text: 'Terbuka',
                      value: 'Terbuka',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.agroforestry_type"
              :item="{
                label: 'Pola Tanam Lahan Kering',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                option: {
                  multiple: true,
                  default_options: [
                    {
                      text: 'Agroforestry Intensitas Tinggi',
                      value: 'agroforestry_high_intensive',
                    },
                    {
                      text: 'Agroforestry Intensitas Rendah',
                      value: 'agroforestry_low_intensive',
                    },
                    {
                      text: 'Konservasi',
                      value: 'conservation',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>
          <v-col md="12">
            <div
              class="d-flex flex-row justify-content-end"
              style="justify-content: flex-end"
            >
              <v-btn variant="light" @click="$router.go(-1)" class="mr-3"
                >Batal</v-btn
              >
              <v-btn type="submit" variant="success" :disabled="loading">
                <v-icon>mdi-chevron-right</v-icon>
                <span>Selanjutnya</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>

    <ValidationObserver
      ref="secondForm"
      v-slot="{ handleSubmit }"
      v-show="form === 2"
    >
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Data Populasi &amp; Wilayah</h4>
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.total_dusun"
              :item="{
                label: 'Total Dusun',
                validation: ['required'],
                type: 'number',
                setter: 'total_dusun',
                view_data: 'total_dusun',
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.potential_dusun"
              :item="{
                label: 'Potential Dusun',
                validation: ['required'],
                type: 'number',
                setter: 'potential_dusun',
              }"
            />
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.potential_description"
              :item="{
                label: 'Potential Dusun',
                placeholder: 'Deskripsi / alasan dusun berpotensi',
                validation: ['required'],
                type: 'editor',
                setter: 'potential_description',
              }"
            />
          </v-col>

          <v-col md="4">
            <geko-input
              v-model="formData.total_male"
              :item="{
                label: 'Jumlah Laki-Laki',
                validation: ['required'],
                type: 'number',
                setter: 'total_male',
              }"
            />
          </v-col>

          <v-col md="4">
            <geko-input
              v-model="formData.total_female"
              :item="{
                label: 'Jumlah Perempuan',
                validation: ['required'],
                type: 'number',
                setter: 'total_female',
              }"
            />
          </v-col>

          <v-col md="4">
            <geko-input
              v-model="formData.total_kk"
              :item="{
                label: 'Jumlah Keluarga (KK)',
                validation: ['required'],
                type: 'number',
                setter: 'total_kk',
              }"
            />
          </v-col>
          <v-col md="12" class="form-separator">
            <h4>Upload Foto Dokumentasi Kegiatan</h4>
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.photo_road_access"
              :item="{
                label: 'Foto Akses Jalan',
                validation: ['required'],
                type: 'upload',
                setter: 'photo_road_access',
                view_data: 'photo_road_access',
                option: {
                  label_hint:
                    'Klik gambar untuk memilih berkas yang akan diunggah',
                  max_size: 5,
                  max: 5,
                  multiple: true,
                },
              }"
            />
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.photo_meeting"
              :item="{
                label: 'Foto Pertemuan Dengan Tokoh Desa',
                validation: ['required'],
                type: 'upload',
                setter: 'photo_meeting',
                view_data: 'photo_meeting',
                option: {
                  label_hint:
                    'Klik gambar untuk memilih berkas yang akan diunggah',
                  max_size: 5,
                  max: 3,
                  multiple: true,
                },
              }"
            />
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.photo_dry_land"
              :item="{
                label: 'Foto Lahan Kering',
                validation: ['required'],
                type: 'upload',
                setter: 'photo_dry_land',
                view_data: 'photo_dry_land',
                option: {
                  label_hint:
                    'Klik gambar untuk memilih berkas yang akan diunggah',
                  max_size: 5,
                  max: 5,
                  multiple: true,
                },
              }"
            />
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.village_profile"
              :item="{
                label: 'Profile Desa',
                validation: ['required'],
                type: 'upload',
                setter: 'village_profile',
                view_data: 'village_profile',
                option: {
                  label_hint:
                    'Klik gambar untuk memilih berkas yang akan diunggah',
                  max_size: 5,
                },
              }"
            />
          </v-col>

          <v-col lg="12">
            <div class="d-flex flex-row justify-content-end">
              <v-btn
                variant="light"
                class="mr-3"
                @click="form = 1"
                :disabled="loading"
              >
                <span>Back</span>
              </v-btn>
              <v-btn variant="success" type="submit" :disabled="loading">
                <v-icon class="mr-2">mdi-chevron-right</v-icon>
                <span>Selanjutnya</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>

    <ValidationObserver
      ref="thirdForm"
      v-slot="{ handleSubmit }"
      v-show="form === 3"
    >
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Kelengkapan Data Lahan Kering</h4>
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.land_area"
              :item="{
                label: 'Luas Lahan Kering / Kritis',
                validation: ['required'],
                type: 'number',
                setter: 'land_area',
                view_data: 'land_area',
              }"
            />
          </v-col>
          <v-col md="6">
            <geko-input
              v-model="formData.land_type"
              :item="{
                label: 'Jenis Tanah',
                validation: ['required'],
                type: 'select',
                option: {
                  multiple: true,
                  default_options: [
                    {
                      text: 'Andosol',
                      value: 'Andosol',
                    },
                    {
                      text: 'Kambisol',
                      value: 'Kambisol',
                    },
                    {
                      text: 'Arenosol',
                      value: 'Arenosol',
                    },
                    {
                      text: 'Alvisol',
                      value: 'Alvisol',
                    },
                    {
                      text: 'Aluvial',
                      value: 'Aluvial',
                    },
                    {
                      text: 'Entisol',
                      value: 'Entisol',
                    },
                    {
                      text: 'Gleisol',
                      value: 'Gleisol',
                    },
                    {
                      text: 'Grumosol',
                      value: 'Grumosol',
                    },
                    {
                      text: 'Histosol',
                      value: 'Histosol',
                    },
                    {
                      text: 'Inseptisol',
                      value: 'Inseptisol',
                    },
                    {
                      text: 'Litosol',
                      value: 'Litosol',
                    },
                    {
                      text: 'Mediteran',
                      value: 'Mediteran',
                    },
                    {
                      text: 'Molisol',
                      value: 'Molisol',
                    },
                    {
                      text: 'Nitosol',
                      value: 'Nitosol',
                    },
                    {
                      text: 'Organosol',
                      value: 'Organosol',
                    },
                    {
                      text: 'Oxisol',
                      value: 'Oxisol',
                    },
                    {
                      text: 'Podsolik',
                      value: 'Podsolik',
                    },
                    {
                      text: 'Regosol',
                      value: 'Regosol',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.slope"
              :item="{
                label: 'Kelerengan Tanah',
                validation: ['required'],
                type: 'select',
                option: {
                  multiple: false,
                  default_options: [
                    {
                      text: '0 - 8°',
                      value: '0 - 8°',
                    },
                    {
                      text: '8° - 15°',
                      value: '8° - 15°',
                    },
                    {
                      text: '15° - 25°',
                      value: '15° - 25°',
                    },
                    {
                      text: '25° - 45°',
                      value: '25° - 45°',
                    },
                    {
                      text: '> 45°',
                      value: '> 45°',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.altitude"
              :item="{
                label: 'Ketinggian Tanah',
                validation: ['required'],
                type: 'select',
                option: {
                  multiple: false,
                  default_options: [
                    {
                      text: '0 - 300',
                      value: '0 - 300',
                    },
                    {
                      text: '300 - 550',
                      value: '300 - 550',
                    },
                    {
                      text: '550 - 850',
                      value: '550 - 850',
                    },
                    {
                      text: '850 - 1050',
                      value: '850 - 1050',
                    },
                    {
                      text: '1050 -1350',
                      value: '1050 -1350',
                    },
                    {
                      text: '1350 - 1550',
                      value: '1350 - 1550',
                    },
                    {
                      text: '1550 - 1900',
                      value: '1550 - 1900',
                    },
                    {
                      text: '> 1900',
                      value: '> 1900',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="6">
            <geko-input
              v-model="formData.rainfall"
              :item="{
                label: 'Curah Hujan',
                validation: ['required'],
                type: 'select',
                option: {
                  multiple: true,
                  default_options: [
                    {
                      text: '0 - 500',
                      value: '0 - 500',
                    },
                    {
                      text: '500 - 1000',
                      value: '500 - 1000',
                    },
                    {
                      text: '1000 - 1500',
                      value: '1000 - 1500',
                    },
                    {
                      text: '1500 - 2000',
                      value: '1500 - 2000',
                    },
                    {
                      text: '2000 - 2500',
                      value: '2000 - 2500',
                    },
                    {
                      text: '2500 - 3000',
                      value: '2500 - 3000',
                    },
                  ],
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Upload Polygon File (GIS)</h4>
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.village_polygon"
              :item="{
                label: 'Polygon Desa',
                validation: ['required'],
                type: 'upload',
                setter: 'village_polygon',
                view_data: 'village_polygon',
                option: {
                  icon: 'mdi-vector-polygon',
                  label_hint:
                    'Klik polygon untuk memilih file .kml yang akan diunggah',
                },
              }"
            />
          </v-col>

          <v-col md="12">
            <geko-input
              v-model="formData.dry_land_polygon"
              :item="{
                label: 'Polygon Lahan Kering / Kritis',
                validation: ['required'],
                type: 'upload',
                setter: 'dry_land_polygon',
                view_data: 'dry_land_polygon',
                option: {
                  icon: 'mdi-vector-polygon',
                  label_hint:
                    'Klik polygon untuk memilih file .kml yang akan diunggah',
                },
              }"
            />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Tokoh Desa</h4>
          </v-col>

          <v-col md="12">
            <div class="village-person-list">
              <v-row
                v-for="(person, i) in formData.village_persons"
                :key="'persons-' + i"
              >
                <v-col md="1" class="index-wrapper">
                  <!-- <div class="index-wrapper"> -->
                  <div class="index">{{ i + 1 }}</div>
                  <!-- </div> -->
                </v-col>

                <v-col md="3">
                  <geko-input
                    v-model="person.name"
                    :item="{
                      label: 'Nama',
                      validation: ['required'],
                      type: 'text',
                    }"
                  />
                </v-col>

                <v-col md="2">
                  <geko-input
                    v-model="person.position"
                    :item="{
                      label: 'Jabatan',
                      validation: ['required'],
                      type: 'text',
                    }"
                  />
                </v-col>

                <v-col md="2">
                  <geko-input
                    v-model="person.phone"
                    :item="{
                      label: 'No HP',
                      validation: ['required'],
                      type: 'text',
                    }"
                  />
                </v-col>
                <v-col md="2">
                  <geko-input
                    v-model="person.wa"
                    :item="{
                      label: 'No WA',
                      validation: ['required'],
                      type: 'text',
                    }"
                  />
                </v-col>

                <v-col
                  md="1"
                  class="d-flex flex-column justify-content-center"
                  style="justify-content: center; align-items: flex-start"
                >
                  <button
                    @click="removeVillagePerson(i)"
                    v-if="formData.village_persons.length > 1"
                  >
                    <v-icon color="red">mdi-close</v-icon>
                  </button>
                </v-col>
              </v-row>

              <v-row>
                <v-col md="12">
                  <v-btn variant="primary" @click="addVillagePerson">
                    <v-icon>mdi-plus</v-icon>
                    <span>Tambah Tokoh Desa</span>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col md="12">
            <div class="d-flex flex-row" style="justify-content: flex-end">
              <v-btn
                variant="light"
                class="mr-3"
                @click="form = 2"
                :disabled="loading"
              >
                Back
              </v-btn>
              <v-btn type="submit" variant="success" :disabled="loading">
                <v-icon>mdi-plus</v-icon>
                <span>Tambah Data Scooping Visit</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script src="./ScoopingVisitForm.js"></script>
