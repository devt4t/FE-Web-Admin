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
                      <geko-input v-if="borderline.borderline_type == 'Kecamatan'" v-model="borderline.district_id"
                        :item="{
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
                        code: 'id',
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
                        code: 'id',
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
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="6">
                  <geko-input v-model="item.period" :item="{
                    label: 'Periode Pemasaran Komoditas',
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
        ['Ladies Companion', 'setter'],
        ['Terapis', 'test'],
        ['Senior Terapis', 'setter1'],
        // ['Petani', 'job_farmer'],
        // ['Buruh Tani', 'job_farm_workers'],
        // ['Karyawan Swasta', 'job_private_employee'],
        // ['ASN (Guru, TNI, Polri)', 'job_state_employee'],
        // ['Wiraswasta', 'job_enterpreneur'],
        // ['Profesi Lain (Peternakan, Buruh Peternakan, Pensiunan)', 'job_others'],
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
    console.log(this.defaultData)
  },


  computed: {
    defaultData() {
      return defaultData;
    },
  },

  methods: {
    onsubmit() {
      console.log(this.formData);
    },
    onSelectScoopingVisit(data) {
      this.$set(this.formData, "scooping_visit_code", data.data_no);
      this.$set(this.formData, "land_area", data.land_area);
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
