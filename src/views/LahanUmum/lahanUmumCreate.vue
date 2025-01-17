<template>
  <v-card class="px-7">

    <div class="list-header py-3 mt-1">
    </div>

    <v-row class="mb-4">
      <v-col md="12">
        <div class="form-stepper-header">
          <div class="form-stepper-header-item" :class="{
            active: form === 1,
          }">
            <span class="value">1</span>
            <span class="label">Data Utama</span>
          </div>

          <div class="form-stepper-header-splitter">
            <span></span>
          </div>
          <div class="form-stepper-header-item" :class="{
            active: form === 2,
          }">
            <span class="value">2</span>
            <span class="label">Data Bibit</span>
          </div>

          <div class="form-stepper-header-splitter">
            <span></span>
          </div>
          <div class="form-stepper-header-item" :class="{
            active: form === 3,
          }">
            <span class="value">3</span>
            <span class="label">Koordinat & Periode</span>
          </div>
          <div class="form-stepper-header-splitter">
            <span></span>
          </div>
          <div class="form-stepper-header-item" :class="{
            active: form === 4,
          }">
            <span class="value">4</span>
            <span class="label">Foto & Dokumentasi</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }" v-show="form === 1" class="geko-form-wrapper">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <!-- Data Umum -->
        <v-row>
          <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Data Umum</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
            </div>
          </div>
          <v-col>
            <geko-input v-model="formData.program_year" :item="{
              label: 'Tahun Program',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'program_year',
              option: {
                list_pointer: {
                  label: 'label',
                  code: 'code',
                  display: ['label'],
                },
                default_options: [
                  {
                    label: '2020',
                    code: 2020,
                  },
                  {
                    label: '2021',
                    code: 2021,
                  },
                  {
                    label: '2022',
                    code: 2022,
                  },
                  {
                    label: '2023',
                    code: 2023,
                  },
                  {
                    label: '2024',
                    code: 2024,
                  },
                  {
                    label: '2025',
                    code: 2025,
                  }
                ],
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.mou_no" :item="{
              label: 'MoU No',
              validation: ['required'],
              col_size: 6,
              type: 'text',
            }" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.t4t_employees" :item="{
              label: 'PIC T4T',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 't4t_employees',
              param: {
                page: 1,
                per_page: 10,
              },
              api: 'getEmployeeList_new',
              default_label: formData.t4t_employees,
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'nik',
                  label: 'name',
                  display: ['name', 'nik'],
                },
              },
            }" />
          </v-col>
        </v-row>

        <!-- Data Lahan Umum -->
        <div class="list-header py-3 mt-1">
          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
              <h4>Data Lahan Umum</h4>
          </div>
          <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar"></div>
          </div>
        </div>
        <v-row>
          <v-col>
              <geko-input v-model="formData.land_area" :item="{
                  label: 'Luas Area Lahan (Dalam Meter)',
                  validation: ['required'],
                  col_size: 6,
                  type: 'number',
              }">
              </geko-input>
          </v-col>
          <v-col>
            <geko-input v-model="formData.land_coverage" :item="{
              label: 'Cakupan Lahan',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'land_coverage',
              option: {
                list_pointer: {
                  label: 'label',
                  code: 'code',
                  display: ['label'],
                },
                default_options: [
                  {
                    label: '0%',
                    code: '0',
                  },
                  {
                    label: '25%',
                    code: '25',
                  },
                  {
                    label: '50%',
                    code: '50',
                  },
                  {
                    label: '75%',
                    code: '75',
                  },
                  {
                    label: '100%',
                    code: '100',
                  }
                ],
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.planting_area" :disabled="true" :item="{
              label: 'Luas Area Tanam (Dalam Meter)',
              validation: ['required'],
              col_size: 6,
              type: 'number',
            }" >
            </geko-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.opsi_pola_tanam" :item="{
              label: 'Pola Tanam',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'opsi_pola_tanam',
              option: {
                list_pointer: {
                  label: 'label',
                  code: 'code',
                  display: ['label'],
                },
                default_options: [
                  {
                    label: 'Pola Agroforestry Acak',
                    code: 'Pola Agroforestry Acak',
                  },
                  {
                    label: 'Pola Agroforestry Lajur',
                    code: 'Pola Agroforestry Lajur',
                  },
                  {
                    label: 'Pola Agroforestry Tepi',
                    code: 'Pola Agroforestry Tepi',
                  },
                  {
                    label: 'Pola Konservasi Pohon Kayu',
                    code: 'Pola Konservasi Pohon Kayu',
                  },
                  {
                    label: 'Pola Konservasi Pohon Kayu + MPTS',
                    code: 'Pola Konservasi Pohon Kayu + MPTS',
                  }
                ],
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.land_status" :item="{
              label: 'Status Lahan',
              validation: ['required'],
              col_size: 6,
              type: 'text',
            }" />
          </v-col>
          <v-col>
              <geko-input v-model="formData.land_distance" :item="{
                  label: 'Jarak Lahan Dari Rumah (Dalam Meter)',
                  validation: ['required'],
                  col_size: 6,
                  type: 'number',
              }">
                <v-btn slot="append" text class="text-lowercase" rounded>
                  m<sup>2</sup>
                </v-btn>
              </geko-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.land_access" :item="{
              label: 'Akses Lahan',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'land_access',
              option: {
                list_pointer: {
                  label: 'label',
                  code: 'code',
                  display: ['label'],
                },
                default_options: [
                  {
                    label: 'Jalan Kaki',
                    code: 'Jalan Kaki',
                  },
                  {
                    label: 'Motor',
                    code: 'Motor',
                  },
                  {
                    label: 'Mobil',
                    code: 'Mobil',
                  },
                ],
              },
            }" />
          </v-col>
        </v-row>
        <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Data Lokasi</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
            </div>
          </div>
        <v-row>
          <v-col>
            <geko-input v-model="formData.mu_no" :disabled="!formData.program_year" :item="{
              label: 'Management Unit',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'mu_no',
              param: {
                page: 1,
                per_page: 10,
              },
              api: 'new-utilities/management-units',
              default_label: formData.mu_no,
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'mu_no',
                  label: 'name',
                  display: ['name', 'mu_no'],
                },
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.province" :disabled="!formData.program_year" :item="{
              label: 'Provinsi',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'province',
              param: {
                page: 1,
                per_page: 10,
              },
              api: 'new-utilities/provinces',
              default_label: formData.province,
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'province_code',
                  label: 'name',
                  display: ['name', 'province_code'],
                },
              },
            }" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.kabupaten" :disabled="!formData.program_year || !formData.province" :item="{
              label: 'Kabupaten',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'kabupaten',
              param: {
                page: 1,
                per_page: 10,
                province_code: formData.province
              },
              api: 'new-utilities/kabupatens',
              default_label: formData.kabupaten,
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'kabupaten_no',
                  label: 'name',
                  display: ['name', 'kabupaten_no'],
                },
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.kecamatan" :disabled="!formData.program_year || !formData.province || !formData.kabupaten" :item="{
              label: 'Kecamatan',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'kecamatan',
              param: {
                page: 1,
                per_page: 10,
                kode_kabupaten: formData.kabupaten
              },
              api: 'new-utilities/kecamatans',
              default_label: formData.kecamatan,
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'kode_kecamatan',
                  label: 'name',
                  display: ['name', 'kode_kecamatan'],
                },
              },
            }" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.village"
              :disabled="!formData.program_year || !formData.mu_no || !formData.province || !formData.kabupaten || !formData.kecamatan" :item="{
              label: 'Desa',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'village',
              param: {
                page: 1,
                per_page: 10,
                kode_kecamatan: formData.kecamatan
              },
              api: 'new-utilities/desas/option',
              default_label: formData.village,
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'kode_desa',
                  label: 'name',
                  display: ['name', 'kode_desa'],
                },
              },
            }"/>
          </v-col>
          <v-col>
            <geko-input v-model="formData.address" :item="{
              label: 'Alamat',
              validation: ['required'],
              col_size: 6,
              type: 'text',
              setter: 'address',
            }" />
          </v-col>
        </v-row>
        <div class="list-header py-3 mt-1">
          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
              <h4>Data PIC Lahan Umum</h4>
          </div>
          <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar"></div>
          </div>
        </div>
        <v-row>
          <v-col>
            <div class="pic-person-list">
              <v-row v-for="(person, i) in formData.pic_list" :key="'persons-' + i">
                <v-col class="index-wrapper">
                  <div class="index">{{ i + 1 }}</div>
                </v-col>

                <v-col md="2">
                  <geko-input v-model="person.name" :item="{
                    label: 'Nama',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>
                <v-col md="3">
                  <geko-input v-model="person.ktp" :item="{
                    label: 'Nomor KTP',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="2">
                  <geko-input v-model="person.contact" :item="{
                    label: 'No HP/WA',
                    validation: ['required', 'phone'],
                    type: 'text',
                  }" />
                </v-col>
                <v-col md="3">
                  <geko-input v-model="person.project_no"
                     :item="{
                      label: 'Project',
                      validation: ['required'],
                      col_size: 6,
                      type: 'select',
                      api: 'GetProjectAllAdmin',
                      param: {
                      },
                      setter: 'project_no',
                      option: {
                        getterKey: 'data',
                        list_pointer: {
                          label: 'project_name',
                          code: 'project_no',
                          display: ['project_name', 'project_no'],
                        },
                      },
                    }"/>
                </v-col>
                <v-col md="2">
                  <geko-input v-model="person.plannting_goals" :item="{
                    label: 'Tujuan Penanaman',
                    validation: ['required'],
                    col_size: 6,
                    type: 'select',
                    setter: 'plannting_goals',
                    option: {
                      list_pointer: {
                        label: 'label',
                        code: 'code',
                        display: ['label'],
                      },
                      default_options: [
                        {
                          label: 'Penanaman Biasa',
                          code: 'planting',
                        },
                        {
                          label: 'Penanaman Ulang',
                          code: 're-planting',
                        },
                        {
                          label: 'Optimalisasi',
                          code: 'optimalization',
                        },
                      ],
                    },
                  }" />
                </v-col>
                <v-col md="1" class="d-flex flex-column justify-content-center"
                  style="justify-content: center; align-items: flex-start">
                  <button @click="removeLahanUmumPIC(i)">
                    <v-icon color="red">mdi-close</v-icon>
                  </button>
                </v-col>
              </v-row>

              <v-row>
                <v-col md="12">
                  <v-btn variant="primary" @click="addLahanUmumPIC">
                    <v-icon>mdi-plus</v-icon>
                    <span>Tambah PIC Lahan Umum</span>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <v-col md="12">
          <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
            <v-btn variant="light" @click="$router.go(-1)" class="mr-3">Batal</v-btn>
            <v-btn type="submit" variant="success" :disabled="loading">
              <v-icon>mdi-chevron-right</v-icon>
              <span>Selanjutnya</span>
            </v-btn>
          </div>
        </v-col>
      </form>
    </ValidationObserver>

    <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }" v-show="form === 2" class="geko-form-wrapper">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Tambah Detail Bibit Per PIC</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="tempInsertSeed.tree_category" :item="{
              label: 'Tipe Bibit',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'tree_category',
              option: {
                list_pointer: {
                  label: 'label',
                  code: 'code',
                  display: ['label'],
                },
                default_options: [
                  {
                    label: 'KAYU',
                    code: 'Pohon_Kayu',
                  },
                  {
                    label: 'MPTS',
                    code: 'Pohon_Buah',
                  },
                  {
                    label: 'CROPS',
                    code: 'Tanaman_Bawah_Empon',
                  },
                  {
                    label: 'MANGROVE',
                    code: 'Mangrove',
                  },
                ],
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="tempInsertSeed.tree_code" :item="{
              label: 'Nama Pohon Bibit',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'tree_seed',
              param: {
                limit: 10,
                offset: 0,
                tree_category: tempInsertSeed.tree_category
              },
              api: 'GetTreesAll_new',
              default_label: tempInsertSeed.tree_code,
              option: {
                getterKey: 'result',
                list_pointer: {
                  code: 'tree_code',
                  label: 'tree_name',
                  display: ['tree_name', 'tree_code'],
                },
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="tempInsertSeed.seed_amount" :item="{
              label: 'Jumlah Bibit',
              validation: ['required'],
              col_size: 6,
              type: 'number',
            }" >
            </geko-input>
          </v-col>
          <v-col>
            <geko-input v-model="tempInsertSeed.seed_PIC" :item="{
              label: 'PIC Bibit',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'seed_PIC',
              option: {
                list_pointer: {
                  label: 'name',
                  code: 'pic_no',
                  display: ['name', 'pic_no'],
                },
                default_options: formData.pic_list
              },
            }" />
          </v-col>
          <v-col>
            <v-btn
              class="ma-2"
              outlined
              fab
              color="success"
              @click="() => addBibitPerPIC()"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>

        </v-row>
        <v-row>
          <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Tabel Bibit Tertambah</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
            </div>
          </div>
          <v-col cols="12" sm="12" md="12">
            <v-data-table
              :headers="seedTable.header"
              :items="formData.detailSeed"
              class="elevation-3"
              append-icon="mdi-magnify"
              :items-per-page="10"
            >
              <template v-slot:item.no="{ index }">
                {{ ++index }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  class="mr-2"
                  @click="removeBibitPerPIC(item)"
                  color="red"
                >
                  mdi-delete
                </v-icon>
                <!-- <v-icon @click="removeBibitPerPIC(item)" color="red"> mdi-delete </v-icon> -->
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-col md="12">
          <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
            <v-btn variant="light" @click="form--" class="mr-3">Kembali</v-btn>
            <v-btn type="submit" variant="success" :disabled="loading">
              <v-icon>mdi-chevron-right</v-icon>
              <span>Selanjutnya</span>
            </v-btn>
          </div>
        </v-col>
      </form>
    </ValidationObserver>

    <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }" v-show="form === 3" class="geko-form-wrapper">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Koordinat &amp; Periode</h4>
          </v-col>
        </v-row>
        <v-row>
          <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Data Koordinat</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
            </div>
          </div>
          <v-col>
            <geko-input v-model="formData.longitude" :item="{
              label: 'Longitude',
              validation: ['required'],
              col_size: 6,
              type: 'text',
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.latitude" :item="{
              label: 'Latitude',
              validation: ['required'],
              col_size: 6,
              type: 'text',
            }" />
          </v-col>
        </v-row>
        <v-row>
          <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Data Periode</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
            </div>
          </div>
          <v-col cols="12" lg="4" class="text-center">
            <p class="mb-0">
              <strong>Tanggal Penilikan Lubang Tanam</strong>
            </p>
            <v-btn rounded class="" color="green white--text" disabled>
              {{dateFormat(formData.surviellance_hole_date,"DD MMMM Y")}}
            </v-btn>
          </v-col>
          <v-col>
            <geko-input v-model="formData.distribution_date" :item="{
              label: 'Tanggal Distribusi',
              validation: ['required'],
              col_size: 6,
              type: 'date',
              setter: 'date',
            }" />
          </v-col>
          <v-col cols="12" lg="4" class="text-center">
            <p class="mb-0">
              <strong>Tanggal Realisasi Tanam</strong>
            </p>
            <v-btn rounded class="" color="green white--text" disabled>
              {{dateFormat(formData.planting_date,"DD MMMM Y")}}
            </v-btn>
          </v-col>
        </v-row>
        
        <v-col md="12">
          <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
            <v-btn variant="light" @click="form--" class="mr-3">Kembali</v-btn>
            <v-btn type="submit" variant="success" :disabled="loading">
              <v-icon>mdi-chevron-right</v-icon>
              <span>Selanjutnya</span>
            </v-btn>
          </div>
        </v-col>
      </form>
    </ValidationObserver>
    <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }" v-show="form === 4" class="geko-form-wrapper">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Foto &amp; Dokumentasi</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Foto Dokumen MoU</h4>
          </v-col>
          <v-col md="12">
            <geko-input v-model="formData.mou_photo" :item="{
              label: 'Foto Dokumen MoU',
              validation: ['required'],
              type: 'upload',
              api: '/general-lands/upload1.php',
              directory: 'mou',
              upload_type: 'image/*',
              setter: 'mou_photo',
              view_data: 'mou_photo',
              option: {
                label_hint:
                  'Klik untuk memilih berkas yang akan diunggah',
                max_size: 0.5,
              },
            }" />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Foto Dokumentasi Lahan Umum</h4>
          </v-col>
          <v-col md="12">
            <geko-input v-model="formData.photo1" :item="{
              label: 'Foto Dokumentasi Lahan Umum 1',
              type: 'upload',
              api: '/general-lands/upload1.php',
              directory: 'photos',
              upload_type: 'image/*',
              setter: 'photo1',
              view_data: 'photo1',
              option: {
                label_hint:
                  'Klik untuk memilih berkas yang akan diunggah',
                max_size: 0.5,
              },
            }" />
          </v-col>
          <v-col md="12">
            <geko-input v-model="formData.photo2" :item="{
              label: 'Foto Dokumentasi Lahan Umum 2',
              validation: ['required'],
              type: 'upload',
              api: '/general-lands/upload1.php',
              directory: 'photos',
              upload_type: 'image/*',
              setter: 'photo2',
              view_data: 'photo2',
              option: {
                label_hint:
                  'Klik untuk memilih berkas yang akan diunggah',
                max_size: 0.5,
              },
            }" />
          </v-col>
          <v-col md="12">
            <geko-input v-model="formData.photo3" :item="{
              label: 'Foto Dokumentasi Lahan Umum 3',
              validation: ['required'],
              type: 'upload',
              api: '/general-lands/upload1.php',
              directory: 'photos',
              upload_type: 'image/*',
              setter: 'photo3',
              view_data: 'photo3',
              option: {
                label_hint:
                  'Klik untuk memilih berkas yang akan diunggah',
                max_size: 0.5,
              },
            }" />
          </v-col>
        </v-row>
        <v-col md="12">
          <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
            <v-btn variant="light" @click="form--" class="mr-3">Kembali</v-btn>
            <v-btn type="submit" variant="success" :disabled="loading">
              <v-icon>mdi-chevron-right</v-icon>
              <span>Kirim</span>
            </v-btn>
          </div>
        </v-col>
        <!-- <v-row>
          
        </v-row> -->
      </form>
    </ValidationObserver>

  </v-card>
</template>

<script>
import moment from "moment";

export default {
  name: "pelatihan-petani-create",
  components: {  },
  props: {
    user: {
      required: true,
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      allFFByDesa: [],
      isActive: null,
      form: 1,
      totalSelectedPeserta: 0,
      isModalDetailOpened: false,
      loading: false,
      selectedDesaName: '',
      farmers: [], // getFarmers()
      itemPerPage: 10,
      page: 1,
      peserta: [],
      selectedFarmerData: {},
      farmerByAllFF: new Map(),
      farmerBySelectedFF: new Object(),
      tempLastPicNo: 0,
      seedTable: {
        header: [
          { text: "No", value: "no", align: 'center' },
          { text: "", value: "actions", align: 'center' },
          { text: "Kode Pohon", value: "tree_code", align: 'center' },
          { text: "Nama Pohon", value: "tree_name", align: 'center' },
          { text: "Jumlah", value: "seed_amount", },
          { text: "PIC Bibit", value: "PIC_name", }
        ],
      },
      tempInsertSeed: {
        tree_category: '',
        tree_code: '',
        seed_amount: 0,
        seed_PIC: ''
      },
      formData: {
        pic_no: 0,
        mou_no: '',
        t4t_employees: '',
        land_area: 0,
        land_coverage: 0,
        planting_area: 0,
        opsi_pola_tanam: '',
        land_status: '',
        land_distance: '',
        land_access: '',
        mu_no: '',
        province: '',
        kabupaten: '',
        village: '',
        detailSeed: [],
        pic_list:[],
        user_id: this.user.email,
        program_year: '2025',
        distribution_date: '',
        surviellance_hole_date: '',
        planting_date: '',
        mou_photo: '',
        photo1: '',
        photo2: '',
        photo3: '',
      }
    }
  },
  async mounted() {
    await this.firstAccessPage();
  },
  watch: {
    form(t) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    "formData.land_area": {
      handler(val) {
        this.formData.planting_area = Math.round(
          val * ((100 - this.formData.land_coverage) / 100)
        );
      },
    },
    "formData.land_coverage": {
      handler(val) {
        this.formData.planting_area = Math.round(
          this.formData.land_area * ((100 - val) / 100)
        );
      },
    },
    "formData.distribution_date": {
      handler(newVal) {
        if (newVal) {
          this.formData.surviellance_hole_date = moment(newVal).subtract(14,"days");
          this.formData.planting_date = moment(newVal).add(7, "days");
          this.formData.planting_date = dateFormat(this.formData.planting_date,"DD MMMM Y")
        }
      },
    },
  },
  methods: {
    async onSubmit() {
      if(this.form < 4){
        // console.log("current form: " + this.form);
        
        this.form++;

      }else if(this.form == 4){
        this.formData.surviellance_hole_date = this.dateFormat(this.formData.surviellance_hole_date,"YYYY MM DD")
        this.formData.planting_date = this.dateFormat(this.formData.planting_date,"YYYY MM DD")

        this.formData.surviellance_hole_date = this.formData.surviellance_hole_date.replaceAll(" ", "-")
        this.formData.planting_date = this.formData.planting_date.replaceAll(" ", "-")
        
        console.log(this.formData);
        this.$_api.post('lahan-umum/main/create', this.formData)
        .then(response => {
          this.$router.go(-1);
          this.$refreshKey += 1;
          this.$_alert.success("Berhasil Create Data Lahan Umum");
        }).catch(err => {
          this.$_alert.error({}, "Gagal Melakukan Create Data Lahan Umum");
        });
      }
    },
    firstAccessPage() {
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.checkLastPICNo();
    },
    async checkLastPICNo(){
      let url = this.BaseUrlGet + `lahan-umum/create/pic?`;
      let resPicLahanUmum = await this.$_api.get(url);
      this.tempLastPicNo = resPicLahanUmum.new_pic_no 
      this.tempLastPicNo += 1
      console.log(resPicLahanUmum)
    },
    addLahanUmumPIC(){
      if(this.tempLastPicNo > 0){
        this.formData.pic_list.push({
          name: '',
          ktp: '',
          contact: '',
          project_no: '',
          plannting_goals: '',
          pic_no: this.tempLastPicNo + this.formData.pic_no++
        });
      }else{
        console.log("cannot add lahan umum PIC, Temp PIC: ", this.tempLastPicNo)
      }
    },
    removeLahanUmumPIC(i){
      this.formData.pic_list.splice(i, 1);
      this.formData.pic_no--
    },

    removeBibitPerPIC(i) {
      // console.log(i);
      this.formData.detailSeed.splice(i, 1);
    },
    async addBibitPerPIC() {
      this.formData.detailSeed.push({
        tree_category: this.tempInsertSeed.tree_category,
        tree_name: await this.getSeedDetailData(this.tempInsertSeed.tree_code),
        tree_code: this.tempInsertSeed.tree_code,
        seed_amount: this.tempInsertSeed.seed_amount,
        seed_PIC: this.tempInsertSeed.seed_PIC,
        PIC_name: this.formData.pic_list.filter((v) => v.pic_no == this.tempInsertSeed.seed_PIC)[0].name
      });
      // console.log(this.formData.detailSeed);
    },
    
    async getSeedDetailData(tree_code){
      let url = this.BaseUrlGet + `GetTreesDetail_new?tree_code=${tree_code}`;
      let resTreeDetail = await this.$_api.get(url);
      let res = 'tidak dapat memuat data'
      if(resTreeDetail){
        res = resTreeDetail.result.tree_name
      } 
      return res  
    },
    dateFormat(date, format) {
      return moment(date).format(format);
    },
    

  },
}
</script>