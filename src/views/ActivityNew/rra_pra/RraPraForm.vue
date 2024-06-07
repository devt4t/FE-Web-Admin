<template>
  <div class="rra-pra-form">
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }" v-show="form === 1">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row class="mb-4">
          <v-col md="12">
            <div class="form-stepper-header">
              <div class="form-stepper-header-item" :class="{
                active: form === 1,
              }">
                <span class="value">1</span>
                <span class="label">RRA</span>
              </div>

              <div class="form-stepper-header-splitter">
                <span></span>
              </div>
              <div class="form-stepper-header-item" :class="{
                active: form === 2,
              }">
                <span class="value">2</span>
                <span class="label">PRA</span>
              </div>

              <div class="form-stepper-header-splitter">
                <span></span>
              </div>
              <div class="form-stepper-header-item" :class="{
                active: form === 3,
              }">
                <span class="value">3</span>
                <span class="label">Flora &amp; Fauna</span>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Data Scooping Visit</h4>
          </v-col>
          <v-col md="6">
            <geko-input v-model="formData.scooping_visit_id" :item="{
              label: 'No. Scooping Visit',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'scooping_visit_id',
              api: 'GetNewScoopingAll',
              param: {
                data_no: 0
              },
              default_label: formData.scooping_visit_code,
              option: {
                list_pointer: {
                  code: 'id',
                  label: 'data_no',
                  display: ['data_no', 'data_no'],
                },
              },
            }" @selected="onSelectScoopingVisit($event)" />
          </v-col>

          <v-col md="6">
            <geko-input v-model="formData.date" :item="{
              label: 'Tanggal RRA PRA',
              validation: ['required'],
              col_size: 6,
              type: 'daterange',
              setter: 'date',
            }" />
          </v-col>
          <v-col md="12" class="form-separator">
            <h4>Batas Wilayah</h4>
          </v-col>

          <v-col md="12">
            <div class="borderline-wrapper multiple-row-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Batas</th>
                    <th>Tipe</th>
                    <th>Provinsi</th>
                    <th>Kabupaten</th>
                    <th>Kecamatan</th>
                    <th>Desa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(borderline, i) in formData.borderlines" class="borderline-item" :key="`borderline-${i}`">
                    <td variant="primary" class="text-center pl-0">
                      <div class="label text-center">
                        {{ borderline.label }}
                      </div>
                    </td>

                    <td style="min-width: 200px">
                      <geko-input v-model="borderline.borderline_type" :item="{
                        label: 'Type',
                        validation: ['required'],
                        col_size: 6,
                        type: 'select',
                        hide_label: true,
                        option: {
                          default_options: [
                            {
                              text: 'Kabupaten',
                              value: 'Kabupaten',
                            },
                            {
                              text: 'Kecamatan',
                              value: 'Kecamatan',
                            },
                            {
                              text: 'Desa',
                              value: 'Desa',
                            },
                          ],
                          list_pointer: {
                            code: 'value',
                            label: 'text',
                            display: ['text'],
                          },
                        },
                      }" />
                    </td>
                    <td style="min-width: 200px">
                      <geko-input v-model="borderline.province_id" :item="{
                        label: 'Provinsi',
                        validation: ['required'],
                        col_size: 6,
                        type: 'select',
                        setter: 'province_id',
                        api: 'GetProvince',
                        default_label: borderline.province_name,
                        hide_label: true,
                        option: {
                          getterKey: 'data.result',
                          list_pointer: {
                            code: 'id',
                            label: 'name',
                            display: ['name'],
                          },
                        },
                      }" @selected="
                        borderline.province_code = $event.province_code
                        " />
                    </td>
                    <td style="min-width: 200px">
                      <geko-input v-model="borderline.city_id" :item="{
                        label: 'Kabupaten / Kota',
                        validation: ['required'],
                        type: 'select',
                        setter: 'city_id',
                        api: 'GetKabupaten',
                        hide_label: true,

                        param: {
                          province_code: borderline.province_code,
                        },
                        default_label: borderline.city_name,
                        option: {
                          getterKey: 'data.result',
                          list_pointer: {
                            code: 'id',
                            label: 'name',
                            display: ['name'],
                          },
                        },
                      }" @selected="borderline.city_code = $event.kabupaten_no" :disabled="!borderline.province_id" />
                    </td>

                    <td style="min-width: 200px">
                      <geko-input v-if="['Kecamatan', 'Desa'].includes(borderline.borderline_type)"
                        v-model="borderline.district_id" :item="{
                          label: 'Kecamatan',
                          validation: ['required'],
                          type: 'select',
                          setter: 'district_id',
                          api: 'GetKecamatan',
                          hide_label: true,
                          param: {
                            kabupaten_no: borderline.city_code,
                          },
                          default_label: borderline.district_name,
                          option: {
                            getterKey: 'data.result',
                            list_pointer: {
                              code: 'id',
                              label: 'name',
                              display: ['name'],
                            },
                          },
                        }" @selected="
                          borderline.district_code = $event.kode_kecamatan
                          " :disabled="!borderline.city_id" />

                      <span v-else class="d-block text-center">-</span>
                    </td>
                    <td style="min-width: 200px">
                      <geko-input v-if="borderline.borderline_type == 'Desa'" v-model="borderline.village_id" :item="{
                        label: 'Desa',
                        validation: ['required'],
                        col_size: 6,
                        type: 'select',
                        setter: 'village_id',
                        api: 'GetDesa',
                        hide_label: true,
                        param: {
                          kode_kecamatan: borderline.district_code,
                        },
                        default_label: borderline.village_name,
                        option: {
                          getterKey: 'data.result',
                          list_pointer: {
                            code: 'id',
                            label: 'name',
                            display: ['name'],
                          },
                        },
                      }" @selected="borderline.village_code = $event.kode_desa" :disabled="!borderline.district_id" />
                      <span v-else class="d-block text-center">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-col>
          <v-col md="12" class="form-separator">
            <h4>Landscape Desa</h4>
          </v-col>

          <v-col md="12">
            <div class="landscape-village">
              <h5 class="font-weight-normal">
                <span style="font-weight: normal">Luas Wilayah : </span>
                <span v-if="formData.land_area">{{ formData.land_area }} Ha</span>
              </h5>
              <span class="text-grey d-block text-08-em note mt-3 mb-1">Kosongkan form apabila tidak ada data</span>

              <v-row>
                <v-col md="4" v-for="data in landscapeVillageConfig" :key="'data-ld' + data[0]">
                  <geko-input v-model="formData[data[0]]" :item="{
                    label: data[1],
                    validation: [],
                    type: 'number',
                  }" />
                </v-col>

                <v-col md="6">
                  <geko-input v-model="formData.lahan_menurut_masyarakat" :item="{
                    label: 'Jenis Lahan Menurut Masyarakat',
                    validation: [],
                    type: 'textarea',
                  }" />
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Pola Pemanfaatan Lahan</h4>
          </v-col>
          <v-col md="12">
            <div class="bg-grey">
              <v-row v-for="(item, i) in landUse" :key="'land-use' + i">
                <v-col md="5">
                  <geko-input v-model="item.pattern" :item="{
                    label: 'Pola',
                    validation: ['required'],
                    col_size: 6,
                    type: 'select',
                    option: {
                      default_options: defaultData.land_use_pattern,
                      list_pointer: {
                        code: 'code',
                        label: 'name',
                        display: ['name'],
                      },
                    },
                  }" />
                </v-col>
                <v-col md="6">
                  <geko-input v-model="item.plant" :item="{
                    label: 'Tanaman',
                    validation: ['required'],
                    col_size: 6,
                    type: 'select',
                    api: 'GetTreesAll',
                    option: {
                      getterKey: 'data.result.data',
                      multiple: true,
                      list_pointer: {
                        code: 'tree_name',
                        label: 'tree_name',
                        display: ['tree_name'],
                      },
                    },
                  }" />
                </v-col>

                <v-col md="1">
                  <div v-if="landUse.length > 1" class="d-flex flex-column"
                    style="height: 100%; justify-content: center">
                    <button class="text-danger" @click="removeRow('landUse', i)">
                      <v-icon class="text-danger">mdi-close</v-icon>
                    </button>
                  </div>
                </v-col>
              </v-row>
              <v-row>

                <v-col md="12" class="mt-0 pt-0">
                  <v-btn small variant="success" @click="addRow('landUse', 'rra_no')"><v-icon
                      small>mdi-plus</v-icon>Tambah Data</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Tanaman Yang Sudah Ada</h4>
          </v-col>
          <v-col md="12">
            <div class="bg-grey">
              <v-row v-for="(item, i) in existingPlant" :key="'epl' + i + i">
                <v-col md="5">
                  <geko-input v-model="item.plant_type" :item="{
                    label: 'Kategori',
                    validation: ['required'],
                    type: 'select',
                    option: {
                      default_options: defaultData.plant_type,
                      list_pointer: {
                        code: 'code',
                        label: 'name',
                        display: ['name'],
                      },
                    },
                  }" />
                </v-col>
                <v-col md="6">
                  <geko-input v-model="item.plant" :item="{
                    label: 'Tanaman',
                    validation: ['required'],
                    type: 'select',
                    api: 'GetTreesAll',
                    option: {
                      getterKey: 'data.result.data',
                      multiple: true,
                      list_pointer: {
                        code: 'tree_name',
                        label: 'tree_name',
                        display: ['tree_name'],
                      },
                    },
                  }" />
                </v-col>


                <v-col md="1">
                  <div v-if="existingPlant.length > 1" class="d-flex flex-column"
                    style="height: 100%; justify-content: center">
                    <button class="text-danger" @click="removeRow('existingPlant', i)">
                      <v-icon class="text-danger">mdi-close</v-icon>
                    </button>
                  </div>
                </v-col>
              </v-row>
              <v-row>

                <v-col md="12" class="mt-0 pt-0">
                  <v-btn small variant="success" @click="addRow('existingPlant', 'rra_no')"><v-icon
                      small>mdi-plus</v-icon>Tambah Data</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col md="12" class="form-separator">
            <h4>Kelembagaan Masyarakat</h4>
          </v-col>
          <v-col md="12">
            <div class="bg-grey">
              <v-row v-for="(item, i) in communityInstitution" :key="'ci' + i + i">
                <v-col md="5">
                  <geko-input v-model="item.institution_name" :item="{
                    label: 'Nama Lembaga',
                    validation: ['required'],
                    type: 'text'
                  }" />
                </v-col>
                <v-col md="6">
                  <geko-input v-model="item.role" :item="{
                    label: 'Role',
                    validation: ['required'],
                    type: 'text'
                  }" />
                </v-col>


                <v-col md="1">
                  <div class="d-flex flex-column" style="height: 100%; justify-content: center">
                    <button class="text-danger" @click="removeRow('communityInstitution', i)">
                      <v-icon class="text-danger">mdi-close</v-icon>
                    </button>
                  </div>
                </v-col>
                <v-col md="11">
                  <geko-input v-model="item.description" :item="{
                    label: 'Deskripsi',
                    validation: [],
                    type: 'textarea'
                  }" />
                </v-col>
              </v-row>
              <v-row>

                <v-col md="12" class="mt-0 pt-0">
                  <v-btn small variant="success" @click="addRow('communityInstitution', 'rra_no')"><v-icon
                      small>mdi-plus</v-icon>Tambah Data</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Potensi Pertanian Organik</h4>
          </v-col>
          <v-col md="12">
            <div class="bg-grey">
              <v-row v-for="(item, i) in organicPotentials" :key="'op' + i + i">
                <v-col md="5">
                  <geko-input v-model="item.name" :item="{
                    label: 'Nama Petani',
                    validation: ['required'],
                    type: 'text'
                  }" />
                </v-col>
                <v-col md="6">
                  <geko-input v-model="item.potential_category" :item="{
                    label: 'Kategori Potensi',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="1">
                  <div class="d-flex flex-column" style="height: 100%; justify-content: center">
                    <button class="text-danger" @click="removeRow('organicPotentials', i)">
                      <v-icon class="text-danger">mdi-close</v-icon>
                    </button>
                  </div>
                </v-col>
                <v-col md="11">
                  <geko-input v-model="item.source" :item="{
                    label: 'Sumber Pertanian Organik',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>
                <v-col md="11">
                  <geko-input v-model="item.description" :item="{
                    label: 'Deskripsi',
                    validation: [],
                    type: 'textarea',
                  }" />
                </v-col>

              </v-row>
              <v-row>

                <v-col md="12" class="mt-0 pt-0">
                  <v-btn small variant="success" @click="addRow('organicPotentials', 'rra_no')"><v-icon
                      small>mdi-plus</v-icon>Tambah Data</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>


          <v-col md="12" class="form-separator">
            <h4>Pemasaran Hasil Produksi</h4>
          </v-col>
          <v-col md="12">
            <div class="bg-grey">
              <v-row v-for="(item, i) in productionMarketing" :key="'pm' + i + i">
                <v-col md="5">
                  <geko-input v-model="item.commodity_name" :item="{
                    label: 'Nama Komoditas',
                    validation: ['required'],
                    type: 'text'
                  }" />
                </v-col>
                <v-col md="6">
                  <geko-input v-model="item.capacity" :item="{
                    label: 'Kapasitas Komoditas (kg)',
                    validation: [],
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="1">
                  <div class="d-flex flex-column" style="height: 100%; justify-content: center"
                    v-if="productionMarketing.length > 1">
                    <button class="text-danger" @click="removeRow('productionMarketing', i)">
                      <v-icon class="text-danger">mdi-close</v-icon>
                    </button>
                  </div>
                </v-col>

                <v-col md="5">
                  <geko-input v-model="item.method" :item="{
                    label: 'Metode',
                    validation: ['required'],
                    type: 'select',
                    option: {
                      default_options: defaultData.production_marketing_method,
                      list_pointer: {
                        code: 'code',
                        label: 'name',
                        display: ['name'],
                      },
                    }
                  }" />
                </v-col>

                <v-col md="6">


                  <geko-input v-model="item.method" :item="{
                    label: 'Periode Pemasaran Komoditas',
                    validation: ['required'],
                    type: 'select',
                    option: {
                      default_options: defaultData.production_marketing_period,
                      list_pointer: {
                        code: 'code',
                        label: 'name',
                        display: ['name'],
                      },
                    }
                  }" />
                </v-col>

                <v-col md="11">
                  <geko-input v-model="item.description" :item="{
                    label: 'Deskripsi',
                    validation: ['required'],
                    type: 'textarea',
                  }" />
                </v-col>

              </v-row>
              <v-row>

                <v-col md="12" class="mt-0 pt-0">
                  <v-btn small variant="success" @click="addRow('productionMarketing', 'rra_no')"><v-icon
                      small>mdi-plus</v-icon>Tambah Data</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>




          <v-col md="12" class="form-separator">
            <h4>Identifikasi Petani Invoatif</h4>
          </v-col>
          <v-col md="12">
            <div class="bg-grey">

              <v-expansion-panels focusable v-for="(item, i) in innovativeFarmer" :key="'pm' + i + i">
                <v-expansion-panel class="mb-3">
                  <v-expansion-panel-header>
                    {{ item.farmer_name || 'Masukkan Data Petani Baru' }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pt-4">
                    <v-row>
                      <v-col md="5">
                        <geko-input v-model="item.farmer_name" :item="{
                          label: 'Nama Petani',
                          validation: ['required'],
                          type: 'text'
                        }" />
                      </v-col>
                      <v-col md="6">
                        <geko-input v-model="item.specialitation" :item="{
                          label: 'Spesialisasi Petani',
                          validation: ['required'],
                          type: 'text',
                        }" />
                      </v-col>
                      <v-col md="11">
                        <geko-input v-model="item.potential" :item="{
                          label: 'Potensial',
                          validation: ['required'],
                          type: 'text',
                        }" />
                      </v-col>
                      <v-col md="11">
                        <geko-input v-model="item.description" :item="{
                          label: 'Deskripsi',
                          validation: ['required'],
                          type: 'textarea',
                        }" />
                      </v-col>

                      <v-col md="1">
                        <div class="d-flex flex-column" style="height: 100%; justify-content: center"
                          v-if="innovativeFarmer.length > 1">
                          <button class="text-danger" @click="removeRow('innovativeFarmer', i)">
                            <v-icon class="text-danger">mdi-close</v-icon>
                          </button>
                        </div>
                      </v-col>



                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-row>

                <v-col md="12" class="mt-5 pt-3">
                  <v-btn small variant="success" @click="addRow('innovativeFarmer', 'rra_no')"><v-icon
                      small>mdi-plus</v-icon>Tambah Data</v-btn>
                </v-col>
              </v-row>

            </div>
          </v-col>
          <v-col md="12" class="form-separator">
            <h4>Data Dusun</h4>
          </v-col>
          <v-col md="12">
            <div class="bg-grey">

              <v-expansion-panels focusable v-for="(item, i) in dusuns" :key="'acc' + i + i">
                <v-expansion-panel class="mb-3">
                  <v-expansion-panel-header>
                    {{ item.dusun_name || 'Masukkan Data Dusun' }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pt-4 pb-5">
                    <v-row class="pb-5">
                      <v-col md="5">
                        <geko-input v-model="item.dusun_name" :item="{
                          label: 'Nama Dusun',
                          validation: ['required'],
                          type: 'text'
                        }" />
                      </v-col>

                      <v-col md="6">
                        <geko-input v-if="item.potential == 0" v-model="item.total_kk" :item="{
                          label: 'Jumlah KK',
                          validation: ['required'],
                          type: 'number'
                        }" />


                      </v-col>

                      <v-col md="1">
                        <div class="d-flex flex-column" style="height: 100%; justify-content: center"
                          v-if="dusuns.length > 1">
                          <button class="text-danger" @click="removeRow('dusuns', i)">
                            <v-icon class="text-danger">mdi-close</v-icon>
                          </button>
                        </div>
                      </v-col>

                      <v-col md="12">

                        <geko-input v-model="item.potential" :item="{
                          view_data: 'potential',
                          type: 'select-radio',
                          label:
                            'Apakah dusun ini berpotensi?',
                          validation: [],
                          option: {
                            list_pointer: {
                              label: 'label',
                              code: 'code',
                              display: ['label'],
                            },
                            default_options: [
                              {
                                label: 'Berpotensi',
                                code: '1',
                              },
                              {
                                label: 'Tidak Berpotensi',
                                code: '0',
                              },
                            ],
                          },
                        }" />
                      </v-col>
                      <v-row class="px-2" v-if="item.potential == 1">
                        <v-col lg="6">
                          <geko-input v-model="item.accessibility" :item="{
                            view_data: 'accessibility',
                            type: 'select',
                            label: 'Aksesibilitas',
                            validation: ['required'],
                            option: {
                              default_options: defaultData.accessibility,
                              list_pointer: {
                                label: 'name',
                                code: 'code',
                                display: ['name']
                              }
                            }
                          }" />
                        </v-col>

                        <v-col lg="6">

                          <geko-input v-model="item.dusun_access_photo" :item="{
                            label: 'Foto Akses Jalan',
                            validation: ['required'],
                            type: 'upload',
                            api: 'rra_pra/upload.php',
                            directory: 'photos',
                            upload_type: 'image/*',
                            setter: 'dusun_access_photo',
                            view_data: 'dusun_access_photo',
                            option: {
                              label_hint:
                                'Klik gambar untuk memilih berkas yang akan diunggah',
                              max_size: 5,
                              max: 5,
                            },
                          }" />
                        </v-col>

                        <v-col md="12" class="form-separator">
                          <h4>Luas Dusun &amp; Lahan Kering</h4>
                        </v-col>
                        <v-col lg="6">
                          <geko-input v-model="item.data_land_area_source" :item="{
                            label: 'Tipe Sumber Data Luas Dusun',
                            validation: ['required'],
                            type: 'select',
                            view_data: item.data_land_area_source,
                            option: {
                              default_options: defaultData.data_type_source,

                              list_pointer: {
                                label: 'name',
                                code: 'code',
                                display: ['name']
                              }
                            }
                          }" />
                        </v-col>
                        <v-col lg="6">
                          <geko-input v-model="item.land_area" :item="{
                            label: 'Luas Dusun',
                            validation: ['required'],
                            type: 'number'
                          }" />
                        </v-col>


                        <v-col lg="6">
                          <geko-input v-model="item.dry_land_area" :item="{
                            label: 'Luas Lahan Kering',
                            validation: ['required'],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="6">
                          <geko-input v-model="item.dry_land_area_source" :item="{
                            label: 'Tipe Sumber Data (Luas Lahan Kering)',
                            validation: ['required'],
                            type: 'select',
                            view_data: item.data_land_area_source,
                            option: {
                              default_options: defaultData.data_type_source,

                              list_pointer: {
                                label: 'name',
                                code: 'code',
                                display: ['name']
                              }
                            }
                          }" />
                        </v-col>


                        <v-col md="12" class="form-separator">
                          <h4>PIC Dusun</h4>
                        </v-col>
                        <v-col lg="6">
                          <geko-input v-model="item.pic_dusun" :item="{
                            label: 'PIC Dusun',
                            validation: ['required'],
                            type: 'text'
                          }" />
                        </v-col>
                        <v-col lg="6">
                          <geko-input v-model="item.position" :item="{
                            label: 'Jabatan',
                            validation: ['required'],
                            type: 'text'
                          }" />
                        </v-col>
                        <v-col lg="6">
                          <geko-input v-model="item.phone" :item="{
                            label: 'No HP',
                            validation: ['required'],
                            type: 'text'
                          }" />
                        </v-col>
                        <v-col lg="6">
                          <geko-input v-model="item.whatsapp" :item="{
                            label: 'Whatsapp',
                            validation: [],
                            type: 'text'
                          }" />
                        </v-col>



                        <v-col md="12" class="form-separator">
                          <h4>Data Populasi</h4>

                        </v-col>
                        <v-col lg="2">
                          <geko-input v-model="item.total_rt" :item="{
                            label: 'RT',
                            validation: ['required'],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="2">
                          <geko-input v-model="item.total_rw" :item="{
                            label: 'RW',
                            validation: ['required'],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="4">
                          <geko-input v-model="item.total_male" :item="{
                            label: 'Jumlah Laki-Laki',
                            validation: [],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="4">
                          <geko-input v-model="item.total_female" :item="{
                            label: 'Jumlah Perempuan',
                            validation: [],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="4">
                          <geko-input v-model="item.total_kk" :item="{
                            label: 'Jumlah KK',
                            validation: ['required'],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="4">
                          <geko-input v-model="item.total_farmer_family" :item="{
                            label: 'Jumlah Keluarga Petani (KK)',
                            validation: [],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="4">
                          <geko-input v-model="item.total_non_farmer_family" :item="{
                            label: 'Jumlah Keluarga Non Petani (KK)',
                            validation: [],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="4">
                          <geko-input v-model="item.average_family_member" :item="{
                            label: 'Rata-Rata Anggota Keluarga',
                            validation: [],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="4">
                          <geko-input v-model="item.average_farmer_family_member" :item="{
                            label: 'Rata-Rata Anggota Keluarga Petani',
                            validation: [],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col lg="4">
                          <geko-input v-model="item.average_non_farmer_family_member" :item="{
                            label: 'Rata-Rata Anggota Keluarga Non Petani',
                            validation: [],
                            type: 'number'
                          }" />
                        </v-col>

                        <v-col md="12" class="form-separator">
                          <h4>Data Edukasi</h4>
                        </v-col>
                        <v-col md="6">
                          <geko-input v-model="item.education_elementary_junior_hs" :item="{
                            label: 'SD - SMP',
                            validation: ['required'],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col md="6">
                          <geko-input v-model="item.education_senior_hs" :item="{
                            label: 'SMA',
                            validation: ['required'],
                            type: 'number'
                          }" />
                        </v-col>
                        <v-col md="6">
                          <geko-input v-model="item.education_college" :item="{
                            label: 'Kuliah',
                            validation: [],
                            type: 'number'
                          }" />
                        </v-col>


                        <v-col md="12" class="form-separator">
                          <h4>Data Produktifitas</h4>
                        </v-col>
                        <v-col md="4">
                          <geko-input v-model="item.data_productive_source" :item="{
                            label: 'Tipe Sumber Data',
                            validation: ['required'],
                            type: 'select',
                            view_data: item.data_productive_source,
                            option: {
                              default_options: defaultData.data_type_source,

                              list_pointer: {
                                label: 'name',
                                code: 'code',
                                display: ['name']
                              }
                            }
                          }" />
                        </v-col>

                        <v-col md="4">
                          <geko-input v-model="item.age_productive" :item="{
                            label: 'Produktif',
                            validation: ['required'],
                            type: 'number'
                          }" />
                        </v-col>

                        <v-col md="4">
                          <geko-input v-model="item.age_non_productive" :item="{
                            label: 'Non-Produktif',
                            validation: [],
                            type: 'number'
                          }" />
                        </v-col>


                        <v-col md="12" class="form-separator">
                          <h4>Mata Pencaharian Masyarakat</h4>
                        </v-col>


                        <v-col md="6" v-for="(job, j) in dusunJobs" :key="'dusuns-' + i + j">
                          <v-switch :label="'Ada ' + job[0]" v-model="item[job[1]]" color="success"></v-switch>

                        </v-col>
                      </v-row>



                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-row>

                <v-col md="12" class="mt-5 pt-3">
                  <v-btn small variant="success" @click="addRow('dusuns', 'potential', 0)"><v-icon
                      small>mdi-plus</v-icon>Tambah Data</v-btn>
                </v-col>
              </v-row>

            </div>
          </v-col>

          <v-col md="12">
            <div class="d-flex flex-row w-100" style="justify-content: flex-end">
              <v-btn variant="success" @click="onSubmit(true)" class="mr-2 outline">
                Tambahkan Data RRA &amp; Isi Data PRA
              </v-btn>
              <v-btn variant="success" @click="onSubmit(false)">
                Tambahkan Data RRA
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import defaultData from "./RraPraData.js";

export default {
  name: "rra-pra-form",
  data() {
    return {
      dusunJobs: [
        // ['Ladies Companion', 'setter'],
        // ['Terapis', 'test'],
        // ['Senior Terapis', 'setter1'],
        ['Petani', 'job_farmer'],
        ['Buruh Tani', 'job_farm_workers'],
        ['Karyawan Swasta', 'job_private_employee'],
        ['ASN (Guru, TNI, Polri)', 'job_state_employee'],
        ['Wiraswasta', 'job_enterpreneur'],
        ['Profesi Lain (Peternakan, Buruh Peternakan, Pensiunan)', 'job_others'],
      ],
      landscapeVillageConfig: [
        ["tanah_sawah", "Tanah Sawah"],
        ["tegal_ladang", "Tegal / Ladang"],
        ["pemukiman", "Pemukiman"],
        ["pekarangan", "Pekarangan"],
        ["tanah_rawa", "Tanah Rawa"],
        ["waduk_danau", "Waduk / Danau"],
        ["tanah_perkebunan_rakyat", "Tanah Perkebunan Rakyat"],
        ["tanah_perkebunan_negara", "Tanah Perkebunan Negara"],
        ["tanah_perkebunan_swasta", "Tanah Perkebunan Swasta"],
        ["hutan_lindung", "Hutan Lindung"],
        ["hutan_rakyat", "Hutan Rakyat"],
        ["fasilitas_umum", "Fasilitas Umum"],
      ],

      communityInstitution: [
      ],
      organicPotentials: [],
      productionMarketing: [
        {
          rra_no: null
        }
      ],
      dusuns: [
        {
          potential: 0
        }
      ],
      landUse: [
        {
          rra_no: null,
        },
      ],
      existingPlant: [
        {
          rra_no: null,
        },
      ],
      innovativeFarmer: [],
      formData: {
        landscape_villages: ["test"],
        borderlines: [
          {
            setter: "north",
            label: "Utara",
            borderline_type: "Kabupaten",
          },
          {
            setter: "east",
            label: "Timur",
            borderline_type: "Kabupaten",
          },
          {
            setter: "south",
            label: "Selatan",
            borderline_type: "Kabupaten",
          },
          {
            setter: "west",
            label: "Barat",
            borderline_type: "Kabupaten",
          },
        ],
      },
      form: 1,
      ready: false,
    };
  },

  mounted() {
  },


  computed: {
    defaultData() {
      return defaultData;
    },
  },

  methods: {
    async onSubmit(addPra = false) {

      if (this.isLoading ) return
      this.isLoading = true
      const mainDataConfig = [
        ['scooping_form_no', 'scooping_visit_code'],
        ['date', 'date'],
        ['village', 'scooping_visit_village'],
        ['lahan_menurut_masyarakat', 'lahan_menurut_masyarakat'],
        ['tanah_sawah', 'tanah_sawah', 'number'],
        ['tegal_ladang', 'tegal_ladang', 'number'],
        ['pemukiman', 'pemukiman', 'number'],
        ['pekarangan', 'pekarangan', 'number'],
        ['tanah_rawa', 'tanah_rawa', 'number'],
        ['waduk_danau', 'waduk_danau', 'number'],
        ['tanah_perkebunan_rakyat', 'tanah_perkebunan_rakyat', 'number'],
        ['tanah_perkebunan_negara', 'tanah_perkebunan_negara', 'number'],
        ['tanah_perkebunan_swasta', 'tanah_perkebunan_swasta', 'number'],
        ['hutan_lindung', 'hutan_lindung', 'number'],
        ['hutan_rakyat', 'hutan_rakyat', 'number'],
        ['fasilitas_umum', 'fasilitas_umum', 'number'],
      ]
      let mainDataPayload = {}
      for (const item of mainDataConfig) {
        mainDataPayload[item[0]] = this.formData[item[1]]
      }
      const mainDataResult = await this.$_api.post('addMainRra_new', mainDataPayload)
        .catch((err) => {
          this.$_alert.error(err)
          this.isLoading = false
          return

        })

      const rraNumber = mainDataResult.rra_no

      let villageBorderPayload = []
      for (const item of this.formData.borderlines) {
        var _data = {
          rra_no: rraNumber,
          point: item.setter,
          border_type: item.borderline_type,
          kabupaten_no: item.city_code,
        }
        villageBorderPayload.push(_data)

        if (item.district_code) {
          _data.kode_kecamatan = item.district_code
        }
        if (item.kode_desa) {
          _data.kode_desa = item.village_code
        }
      }

      let landUsePayload = []
      for (const landUse of this.landUse) {
        landUsePayload.push({
          rra_no: rraNumber,
          pattern: landUse.pattern,
          plant: Array.isArray(landUse.plant) ? landUse.plant.join(',') : ''
        })
      }

      let existingPlantPayload = []
      for (const item of this.existingPlant) {
        existingPlantPayload.push({
          rra_no: rraNumber,
          plant_type: item.plant_type,
          plant: Array.isArray(item.plant) ? item.plant.join(',') : ''
        })
      }

      let communityInstitutionPayload = []
      for (const item of this.communityInstitution) {
        communityInstitutionPayload.push({
          rra_no: rraNumber,
          institution_name: item.institution_name,
          role: item.role,
          description: item.description
        })
      }

      let organicPotentialsPayload = []
      for (const item of this.organicPotentials) {
        organicPotentialsPayload.push({
          rra_no: rraNumber,
          potential_category: item.potential_category,
          name: item.name,
          source: item.source,
          description: item.description
        })
      }

      let productionMarketingPayload = []
      for (const item of this.productionMarketing) {
        productionMarketingPayload.push({
          rra_no: rraNumber,
          commodity_name: item.commodity_name,
          capacity: item._apacity,
          method: item.method,
          period: item.period,
          description: item.description,
          capacity_switcher: item.capacity ? 1 : 0,
          has_customer: 0,
        })
      }

      let innovativeFarmerPayload = []
      for (const item of this.innovativeFarmer) {
        innovativeFarmerPayload.push({
          rra_no: rraNumber,
          farmer_name: item.farmer_name,
          specialitation: item.specialitation,
          potential: item.potential,
          description: item.description,
        })
      }

      let dusunPayload = []
      for (const item of this.dusuns) {
        item.rra_no = rraNumber
        if (item.potential == 0) {
          item.potential = parseInt(item.potential)
          dusunPayload.push(item)
          continue;
        }
        const keyNumber = ['age_non_productive', 'age-productive', 'average_family_member', 'average_farmer_family_member', 'dry_land_area', 'education_college', 'education_senior_hs', 'land_area', 'potential', 'total_farmer_family', 'total_female', 'total_kk', 'total_male', 'total_non_farmer_family', 'total_rt', 'total_rw']

        const keyBoolean = ['job_enterpreneur', 'job_farm_workers', 'job_farmer', 'job_others', 'job_private_employee', 'job_state_employee']
        for (const _key of keyNumber) {
          item[_key] = parseInt(item[_key])
        }

        for (const _key of keyBoolean) {
          item[_key] = item[_key] ? 1 : 0
        }
        dusunPayload.push(
          item
        )

      }

      for (const item of villageBorderPayload) {
        const isSuccess = await this.$_api.post('addRraVillageBorder_new', item)
          .then(() => {
            return true;
          })
          .catch((err) => {
            this.$_alert.error(err)
            return false
          })

        if (!isSuccess) {
          this.isLoading = false
          return
        }
      }

      for (const item of landUsePayload) {
        const isSuccess = await this.$_api.post('addRraLandUse_new', item)
          .then(() => {
            return true;
          })
          .catch((err) => {
            this.$_alert.error(err)
            return false
          })

        if (!isSuccess) {
          this.isLoading = false
          return
        }
      }



      for (const item of existingPlantPayload) {
        const isSuccess = await this.$_api.post('addRraExistingPlant_new', item)
          .then(() => {
            return true;
          })
          .catch((err) => {
            this.$_alert.error(err)
            return false
          })

        if (!isSuccess) {
          this.isLoading = false
          return
        }
      }

      for (const item of communityInstitutionPayload) {
        const isSuccess = await this.$_api.post('addRraComunityInstitution_new', item)
          .then(() => {
            return true;
          })
          .catch((err) => {
            this.$_alert.error(err)
            return false
          })

        if (!isSuccess) {
          this.isLoading = false
          return
        }
      }

      for (const item of organicPotentialsPayload) {
        const isSuccess = await this.$_api.post('addRraOrganicPotentials_new', item)
          .then(() => {
            return true;
          })
          .catch((err) => {
            this.$_alert.error(err)
            return false
          })

        if (!isSuccess) {
          this.isLoading = false
          return
        }
      }


      for (const item of productionMarketingPayload) {
        const isSuccess = await this.$_api.post('addRraProductionMarketing_new', item)
          .then(() => {
            return true;
          })
          .catch((err) => {
            this.$_alert.error(err)
            return false
          })

        if (!isSuccess) {
          this.isLoading = false
          return
        }
      }
      for (const item of innovativeFarmerPayload) {
        const isSuccess = await this.$_api.post('addRraInnovativeFarmer_new', item)
          .then(() => {
            return true;
          })
          .catch((err) => {
            this.$_alert.error(err)
            return false
          })

        if (!isSuccess) {
          this.isLoading = false
          return
        }
      }
      for (const item of dusunPayload) {
        const isSuccess = await this.$_api.post('addRraDusun_new', item)
          .then(() => {
            return true;
          })
          .catch((err) => {
            this.$_alert.error(err)
            return false
          })

        if (!isSuccess) {
          this.isLoading = false
          return
        }
      }


      if (addPra) {
        this.$_alert.success("Data RRA berhasil ditambahkan")
        this.$router.push({
          path: '/newPra',
          query: {
            view: 'create',
            id: ''
          }
        })
      }
      else {
        this.$_alert.success("Data RRA berhasil ditambahkan")
        this.$router.go(-1)
      }


    },
    onSelectScoopingVisit(data) {
      this.$set(this.formData, "scooping_visit_code", data.data_no);
      this.$set(this.formData, "land_area", data.land_area);
      this.$set(this.formData, "scooping_visit_village", data.village);
    },

    addRow(name, key, value) {
      if (Array.isArray(this[name])) {
        this[name].push({
          [key]: ![undefined, null].includes(value) ? value : null,
        });
      }
    },

    removeRow(name, i) {
      if (Array.isArray(this[name])) {
        this[name].splice(i, 1);
      }
    },
  },
};
</script>
