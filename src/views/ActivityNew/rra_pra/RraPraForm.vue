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
                  separator: '-',
                  display: ['data_no', 'desas_name'],
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
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="1">
                  <div class="d-flex flex-column" style="height: 100%; justify-content: center">
                    <button class="text-danger" @click="removeRow('productionMarketing', i)">
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
                  <v-btn small variant="success" @click="addRow('productionMarketing', 'rra_no')"><v-icon
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
import defaultData from "./RraPraForm.js";
export default {
  name: "rra-pra-form",
  data() {
    return {
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

    addRow(name, key) {
      if (Array.isArray(this[name])) {
        this[name].push({
          [key]: null,
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
