<template>
  <div class="geko-form-wrapper scooping-visit-form" v-if="ready">
    <v-row class="mb-4">
      <v-col md="12">
        <div class="form-stepper-header">
          <div class="form-stepper-header-item" :class="{
            active: form === 1,
          }">
            <span class="value">1</span>
            <span class="label">Tanggal & Data Desa</span>
          </div>

          <div class="form-stepper-header-splitter">
            <span></span>
          </div>
          <div class="form-stepper-header-item" :class="{
            active: form === 2,
          }">
            <span class="value">2</span>
            <span class="label">Data Wilayah</span>
          </div>

          <div class="form-stepper-header-splitter">
            <span></span>
          </div>
          <div class="form-stepper-header-item" :class="{
            active: form === 3,
          }">
            <span class="value">3</span>
            <span class="label">Data Lahan, GIS &amp; Tokoh Desa</span>
          </div>
        </div>
      </v-col>
    </v-row>
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }" v-show="form === 1">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Lokasi &amp; Tanggal Kegiatan Scooping</h4>
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.project_id" :item="{
              label: 'Project',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'project_id',
              api: 'GetProjectAllAdmin',
              default_label: formData.project_code,
              option: {
                multiple: true,
                list_pointer: {
                  separator: '-',
                  code: 'id',
                  label: 'project_name',
                  display: ['project_name', 'project_no'],
                },
              },
            }" />

          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.province_id" :item="{
              label: 'Provinsi',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'province_id',
              api: 'GetProvince',
              default_label: formData.province_name,
              option: {
                getterKey: 'data.result',
                list_pointer: {
                  code: 'id',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" @selected="formData.province_code = $event.province_code" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.city_id" :item="{
              label: 'Kabupaten / Kota',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'city_id',
              api: 'GetKabupaten',
              param: {
                province_code: formData.province_code,
              },
              default_label: formData.city_name,
              option: {
                getterKey: 'data.result',
                list_pointer: {
                  code: 'id',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" @selected="formData.city_code = $event.kabupaten_no" :disabled="!formData.province_id" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.district_id" :item="{
              label: 'Kecamatan',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'district_id',
              api: 'GetKecamatan',
              param: {
                kabupaten_no: formData.city_code,
              },
              default_label: formData.district_name,
              option: {
                getterKey: 'data.result',
                list_pointer: {
                  code: 'id',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" @selected="formData.district_code = $event.kode_kecamatan" :disabled="!formData.city_id" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.village_id" :item="{
              label: 'Desa',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'village_id',
              api: 'GetDesa',
              param: {
                kode_kecamatan: formData.district_code,
              },
              default_label: formData.village_name,
              option: {
                getterKey: 'data.result',
                list_pointer: {
                  code: 'id',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" @selected="formData.village_code = $event.kode_desa" :disabled="!formData.district_id" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.date" :item="{
              label: 'Tanggal Scooping',
              validation: ['required'],
              col_size: 6,
              type: 'daterange',
              setter: 'date',
            }" />
          </v-col>
          <v-col md="12" class="form-separator">
            <h4>Data General Desa</h4>
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.village_area" :item="{
              label: 'Luas Desa (Ha)',
              validation: ['required'],
              col_size: 6,
              type: 'number',
            }" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.accessibility" :item="{
              label: 'Akesibilitas',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              option: {
                default_options: defaultData.accessibility,
                list_pointer: {
                  code: 'value',
                  label: 'text',
                  display: ['text'],
                },
              },
            }" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.water_source" :item="{
              label: 'Sumber Air',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              option: {
                multiple: true,
                default_options: defaultData.water_source,
                list_pointer: {
                  code: 'value',
                  label: 'text',
                  display: ['text'],
                },
              },
            }" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.electricity_source" :item="{
              label: 'Sumber Listrik',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              option: {
                multiple: true,
                default_options: defaultData.electricity_source,
                list_pointer: {
                  code: 'value',
                  label: 'text',
                  display: ['text'],
                },
              },
            }" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.goverment_place" :item="{
              label: 'Tempat Pemerintahan',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              option: {
                multiple: true,
                default_options: defaultData.goverment_place,
                list_pointer: {
                  code: 'value',
                  label: 'text',
                  display: ['text'],
                },
              },
            }" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.land_coverage" :item="{
              label: 'Cakupan Lahan',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              option: {
                multiple: true,
                default_options: defaultData.land_coverage,
                list_pointer: {
                  code: 'value',
                  label: 'text',
                  display: ['text'],
                },
              },
            }" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.vegetation_density" :item="{
              label: 'Kerapatan Vegetasi',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              option: {
                multiple: true,
                default_options: defaultData.vegetation_density,
                list_pointer: {
                  code: 'value',
                  label: 'text',
                  display: ['text'],
                },
              },
            }" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.agroforestry_type" :item="{
              label: 'Pola Tanam Lahan Kering',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              option: {
                multiple: true,
                default_options: defaultData.agroforestry_type,
                list_pointer: {
                  code: 'value',
                  label: 'text',
                  display: ['text'],
                },
              },
            }" />
          </v-col>
          <v-col md="12">
            <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
              <v-btn variant="light" @click="$router.go(-1)" class="mr-3">Batal</v-btn>
              <v-btn type="submit" variant="success" :disabled="loading">
                <v-icon>mdi-chevron-right</v-icon>
                <span>Selanjutnya</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>

    <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }" v-show="form === 2">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Data Populasi &amp; Wilayah</h4>
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.total_dusun" :item="{
              label: 'Total Dusun',
              validation: ['required'],
              type: 'number',
              setter: 'total_dusun',
              view_data: 'total_dusun',
            }" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.potential_dusun" :item="{
              label: 'Potential Dusun',
              validation: ['required'],
              type: 'number',
              setter: 'potential_dusun',
            }" />
          </v-col>

          <v-col md="12">
            <geko-input v-model="formData.potential_description" :item="{
              label: 'Potential Dusun',
              placeholder: 'Deskripsi / alasan dusun berpotensi',
              validation: ['required'],
              type: 'editor',
              setter: 'potential_description',
            }" />
          </v-col>

          <v-col md="4">
            <geko-input v-model="formData.total_male" :item="{
              label: 'Jumlah Laki-Laki',
              validation: ['required'],
              type: 'number',
              setter: 'total_male',
            }" />
          </v-col>

          <v-col md="4">
            <geko-input v-model="formData.total_female" :item="{
              label: 'Jumlah Perempuan',
              validation: ['required'],
              type: 'number',
              setter: 'total_female',
            }" />
          </v-col>

          <v-col md="4">
            <geko-input v-model="formData.total_kk" :item="{
              label: 'Jumlah Keluarga (KK)',
              validation: ['required'],
              type: 'number',
              setter: 'total_kk',
            }" />
          </v-col>
          <v-col md="12" class="form-separator">
            <h4>Upload Foto Dokumentasi Kegiatan</h4>
          </v-col>

          <v-col md="12">
            <geko-input v-model="formData.photo_road_access" :item="{
              label: 'Foto Akses Jalan',
              validation: ['required'],
              type: 'upload',
              api: 'scooping_visits/upload.php',
              directory: 'photos',
              upload_type: 'image/*',
              setter: 'photo_road_access',
              view_data: 'photo_road_access',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 5,
                max: 5,
                multiple: true,
              },
            }" />
          </v-col>

          <v-col md="12">
            <geko-input v-model="formData.photo_meeting" :item="{
              label: 'Foto Pertemuan Dengan Tokoh Desa',
              validation: ['required'],
              type: 'upload',
              setter: 'photo_meeting',
              view_data: 'photo_meeting',
              api: 'scooping_visits/upload.php',
              directory: 'photos',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 5,
                max: 3,
                multiple: true,
              },
            }" />
          </v-col>

          <v-col md="12">
            <geko-input v-model="formData.photo_dry_land" :item="{
              label: 'Foto Lahan Kering',
              validation: ['required'],
              type: 'upload',
              setter: 'photo_dry_land',
              view_data: 'photo_dry_land',
              api: 'scooping_visits/upload.php',
              directory: 'photos',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 5,
                max: 5,
                multiple: true,
              },
            }" />
          </v-col>

          <v-col md="12">
            <geko-input v-model="formData.village_profile" :item="{
              label: 'Profile Desa',
              validation: ['required'],
              type: 'upload',
              setter: 'village_profile',
              view_data: 'village_profile',
              api: 'scooping_visits/upload.php',
              directory: 'photos',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 5,
              },
            }" />
          </v-col>

          <v-col lg="12">
            <div class="d-flex flex-row justify-content-end">
              <v-btn variant="light" class="mr-3" @click="form = 1" :disabled="loading">
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

    <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }" v-show="form === 3">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Kelengkapan Data Lahan Kering</h4>
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.land_area" :item="{
              label: 'Luas Lahan Kering / Kritis',
              validation: ['required'],
              type: 'number',
              setter: 'land_area',
              view_data: 'land_area',
            }" />
          </v-col>
          <!-- <v-col md="6">
            <geko-input
              v-model="formData.land_type"
              :item="{
                label: 'Jenis Tanah',
                validation: ['required'],
                type: 'select',
                option: {
                  multiple: true,
                  default_options: defaultData.land_type,
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col> -->
          <!-- 
          <v-col md="6" v-if="$route.query.view === 'create'">
            <geko-input
              v-model="formData.slope"
              :item="{
                label: 'Kelerengan Tanah',
                validation: ['required'],
                type: 'select',
                option: {
                  multiple: false,
                  default_options: defaultData.slope,
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col> -->
          <!-- 
          <v-col md="6" v-if="$route.query.view === 'create'">
            <geko-input
              v-model="formData.altitude"
              :item="{
                label: 'Ketinggian Tanah',
                validation: ['required'],
                type: 'select',
                option: {
                  multiple: false,
                  default_options: defaultData.altitude,
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col> -->

          <!-- <v-col md="6">
            <geko-input
              v-model="formData.rainfall"
              :item="{
                label: 'Curah Hujan',
                validation: ['required'],
                type: 'select',
                option: {
                  multiple: true,
                  default_options: defaultData.rainfall,
                  list_pointer: {
                    code: 'value',
                    label: 'text',
                    display: ['text'],
                  },
                },
              }"
            />
          </v-col> -->

          <!-- <v-col md="12" class="form-separator">
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
                api: 'scooping_visits/upload.php',

                upload_type: '.kml',
                directory: 'village_polygon',
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
                upload_type: '.kml',
                view_data: 'dry_land_polygon',
                api: 'scooping_visits/upload.php',
                directory: 'village_polygon',
                option: {
                  icon: 'mdi-vector-polygon',
                  label_hint:
                    'Klik polygon untuk memilih file .kml yang akan diunggah',
                },
              }"
            />
          </v-col> -->

          <v-col md="12" class="form-separator">
            <h4>INFORMASI LAINNYA</h4>
          </v-col>

          <v-row>
            <v-col md="6" style="padding-left: 1.5em">
              <geko-input v-model="formData.other_ngo" :item="{
                view_data: 'other_ngo',
                type: 'select-radio',
                label:
                  'Apakah ada Lembaga lain/NGO lain di desa dengan program Jasa Lingkungan?',
                validation: [],
                option: {
                  list_pointer: {
                    label: 'label',
                    code: 'code',
                    display: ['label'],
                  },
                  default_options: [
                    {
                      label: 'Ada',
                      code: '1',
                    },
                    {
                      label: 'Tidak Ada',
                      code: '0',
                    },
                  ],
                },
              }" />
            </v-col>

            <v-col md="6" v-if="formData.other_ngo == '1'">
              <div class="other-ngo d-flex flex-row align-items-end" style="align-items: flex-end">
                <geko-input v-model="formData.other_ngo_input" :item="{
                  label: 'Nama Lembaga',
                  type: 'text',
                  validation: [],
                }" />

                <v-btn variant="success" class="mb-2 ml-2" @click="addOtherNgo">Tambah</v-btn>
              </div>

              <div class="ngo-list d-flex flex-row" style="flex-wrap: wrap">
                <div class="badge bg-info mr-1 mb-1" v-for="(ngo, i) in formData.other_ngo_data"
                  @click="removeOtherNgo(i)">
                  {{ ngo.name }}
                </div>
              </div>
            </v-col>
          </v-row>
          <v-col md="6">
            <geko-input v-model="formData.mitigation_program" :item="{
              view_data: 'mitigation_program',
              type: 'select-radio',
              label:
                'Adakah Program Mitigasi Perubahan Iklim di Desa tersebut?',
              validation: [],
              option: {
                list_pointer: {
                  label: 'label',
                  code: 'code',
                  display: ['label'],
                },
                default_options: [
                  {
                    label: 'Ada',
                    code: '1',
                  },
                  {
                    label: 'Tidak Ada',
                    code: '0',
                  },
                ],
              },
            }" />
          </v-col>
          <v-col md="6">
            <geko-input v-model="formData.resident_acceptance" :item="{
              view_data: 'resident_acceptance',
              type: 'textarea',
              label: 'Bagaimana Keberterimaan Masyarakat?',
              validation: [],
            }" />
          </v-col>
          <v-col md="6">
            <geko-input v-model="formData.next_event_contact_person" :item="{
              view_data: 'next_event_contact_person',
              type: 'textarea',
              label: 'Siapa Kontak Persons untuk Kegiatan Selanjutnya?',
              validation: [],
            }" />
          </v-col>
          <v-col md="6">
            <geko-input v-model="formData.general_land_condition" :item="{
              view_data: 'general_land_condition',
              type: 'textarea',
              label: 'Bagaimana Kondisi Umum Lahan untuk Program T4T?',
              validation: [],
            }" />
          </v-col>
          <v-col md="6">
            <geko-input v-model="formData.field_companion_potency" :item="{
              view_data: 'field_companion_potency',
              type: 'textarea',
              label: 'Potensi pendamping lapang?',
              validation: [],
            }" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.ff_candidate" :item="{
              view_data: 'ff_candidate',
              type: 'textarea',
              label: 'Identifikasi Kandidat FF',
              validation: [],
            }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Tokoh Desa</h4>
          </v-col>

          <v-col md="12">
            <div class="village-person-list">
              <v-row v-for="(person, i) in formData.village_persons" :key="'persons-' + i">
                <v-col md="1" class="index-wrapper">
                  <!-- <div class="index-wrapper"> -->
                  <div class="index">{{ i + 1 }}</div>
                  <!-- </div> -->
                </v-col>

                <v-col md="3">
                  <geko-input v-model="person.name" :item="{
                    label: 'Nama',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="2">
                  <geko-input v-model="person.position" :item="{
                    label: 'Jabatan',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="2">
                  <geko-input v-model="person.phone" :item="{
                    label: 'No HP',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>
                <v-col md="2">
                  <geko-input v-model="person.whatsapp" :item="{
                    label: 'No WA',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="1" class="d-flex flex-column justify-content-center"
                  style="justify-content: center; align-items: flex-start">
                  <button @click="removeVillagePerson(i)" v-if="formData.village_persons.length > 1">
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
              <v-btn variant="light" class="mr-3" @click="form = 2" :disabled="loading">
                Back
              </v-btn>
              <v-btn type="submit" variant="success" :disabled="loading">
                <v-icon>mdi-plus</v-icon>
                <span v-if="isCreate">Tambah Data Scooping Visit</span>
                <span v-else="isCreate">Perbarui Data Scooping Visit</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script src="./ScoopingVisitForm.js"></script>
