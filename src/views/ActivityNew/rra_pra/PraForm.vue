<template>
  <div class="rra-pra-form">
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row class="mb-4">
          <v-col md="12">
            <div class="form-stepper-header">
              <div class="form-stepper-header-item">
                <span class="value">1</span>
                <span class="label">RRA</span>
              </div>

              <div class="form-stepper-header-splitter">
                <span></span>
              </div>
              <div
                class="form-stepper-header-item"
                :class="{
                  active: true,
                }"
              >
                <span class="value">2</span>
                <span class="label">PRA</span>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- FORM -->
        <v-row>
          <template v-for="(parent, i) in config">
            <v-col
              md="12"
              class="form-separator d-flex flex-row"
              style="align-items: center"
            >
              <h4>{{ parent.name }}</h4>
              <v-btn
                v-if="
                  (parent.fieldData !== 'farmerIncomes' ||
                    (parent.fieldData === 'farmerIncomes' &&
                      formData.collection_type === 'Sampling')) &&
                  parent.fieldData
                "
                small
                variant="success"
                class="ml-3"
                @click="addRow(parent.fieldData)"
                ><v-icon small>mdi-plus</v-icon></v-btn
              >
            </v-col>

            <v-col
              md="12"
              v-if="
                Array.isArray(formFieldData[parent.fieldData]) ||
                !parent.fieldData
              "
            >
              <div class="bg-grey">
                <v-row
                  v-if="
                    (Array.isArray(parent.fields) &&
                      parent.fields.filter(
                        (x) => x.main_form && x.pre_main_form
                      ).length > 0) ||
                    !parent.fieldData
                  "
                >
                  <v-col
                    v-for="(input, k) in parent.fields.filter(
                      (x) => x.main_form && x.pre_main_form
                    )"
                    :key="`f-${i}-${k}`"
                    :md="input.size"
                  >
                    <geko-input
                      v-model="formData[input.setter]"
                      :item="{
                        label: input.name,
                        validation: input.validation || [],
                        type: input.type || 'text',
                        api: input.api || '',
                        getterKey: input.getterKey,
                        option: ['select', 'select-radio'].includes(input.type)
                          ? {
                              default_options: input.options || null,
                              multiple: input.multiple,
                              list_pointer: {
                                code: input.code ? input.code : 'code',
                                label: input.label ? input.label : 'name',
                                display: [input.label ? input.label : 'name'],
                              },
                            }
                          : null,
                      }"
                    />
                  </v-col>
                </v-row>
                <v-row
                  v-for="(f, j) in formFieldData[parent.fieldData]"
                  v-if="parent.fields.filter((x) => !x.main_form).length > 0"
                  :key="`f-${i}-${j}`"
                >
                  <template
                    v-for="(input, k) in parent.fields.filter(
                      (x) => !x.main_form
                    )"
                    v-if="
                      !input.show_if ||
                      (input.show_if &&
                        formData[input.show_if] == input.show_if_equals)
                    "
                  >
                    <v-col :md="input.size" :key="`f-${i}-${j}-${k}`">
                      <div
                        v-if="input.type === 'delete'"
                        class="d-flex flex-column"
                        style="height: 100%; justify-content: center"
                      >
                        <button
                          v-if="formFieldData[parent.fieldData].length > 1"
                          class="text-danger"
                          @click="removeRow(parent.fieldData, i)"
                        >
                          <v-icon class="text-danger">mdi-close</v-icon>
                        </button>
                      </div>
                      <geko-input
                        v-else
                        v-model="formData[input.setter]"
                        :item="{
                          label: input.name,
                          validation: input.validation || [],
                          type: input.type || 'text',
                          api: input.api || '',
                          option: ['select', 'select-radio'].includes(
                            input.type
                          )
                            ? {
                                default_options: input.options || null,
                                multiple: input.multiple,
                                getterKey: input.getterKey,
                                list_pointer: {
                                  code: input.code ? input.code : 'code',
                                  label: input.label ? input.label : 'name',
                                  display: [input.label ? input.label : 'name'],
                                },
                              }
                            : null,
                        }"
                      />
                    </v-col>
                  </template>
                </v-row>

                <v-row
                  v-if="
                    Array.isArray(parent.fields) &&
                    parent.fields.filter((x) => x.main_form && !x.pre_main_form)
                      .length > 0
                  "
                >
                  <v-col
                    v-for="(input, k) in parent.fields.filter(
                      (x) => x.main_form && !x.pre_main_form
                    )"
                    v-if="
                      !input.show_if ||
                      (input.show_if &&
                        formData[input.show_if] == input.show_if_equals)
                    "
                    :class="{
                      'm-0 p-0': input.type === 'group',
                    }"
                    :md="input.size"
                  >
                    <div v-if="input.type === 'group'">
                      <h5>{{ input.name }}</h5>
                    </div>
                    <geko-input
                      v-else
                      v-model="formData[input.setter]"
                      :item="{
                        label: input.name,
                        validation: input.validation || [],
                        type: input.type || 'text',
                        api: input.api || '',
                        option: ['select', 'select-radio'].includes(input.type)
                          ? {
                              default_options: input.options || null,
                              multiple: input.multiple,
                              getterKey: input.getterKey,
                              list_pointer: {
                                code: input.code ? input.code : 'code',
                                label: input.label ? input.label : 'name',
                                display: [input.label ? input.label : 'name'],
                              },
                            }
                          : null,
                      }"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </template>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import defaultData from "./RraPraData.js";
export default {
  name: "pra-form",

  computed: {
    defaultData() {
      return defaultData;
    },
  },
  methods: {
    addRow(field, key) {
      this.formFieldData[field].push({
        pra_no: null,
      });
    },
    removeRow(field, i) {
      this.formFieldData[field].splice(i, 1);
    },
    onSubmit() {},
  },

  data() {
    return {
      formData: {},
      formFieldData: {
        landOwnerships: [{ rra_no: null }],
        dryLandSpreads: [{ rra_no: null }],
        waterSourceDetails: [{ rra_no: null }],
        farmerIncomes: [{ rra_no: null }],
        fertilizerDetails: [{ rra_no: null }],
        pesticideDetails: [{ rra_no: null }],
      },
      config: [
        {
          name: "Kepemilikan Lahan",
          fieldData: "landOwnerships",
          fields: [
            {
              name: "Kategori Kepemilikan",
              type: "select",
              options: defaultData.type_ownership,
              setter: "type_ownership",
              validation: ["required"],
              size: 5,
            },
            {
              name: "Percentage",
              setter: "percentage",
              validation: ["required"],
              size: 6,
            },

            {
              type: "delete",
              size: 1,
            },
            {
              name: "Deskripsi Kepemilikan Lahan",
              type: "textarea",
              main_form: true,
              setter: "land_ownership_description",
              size: 11,
            },
          ],
        },
        {
          name: "Penyebaran Lokasi Lahan Kering & Kritis",
          fieldData: "dryLandSpreads",
          fields: [
            {
              name: "Nama Dusun",
              type: "text",
              setter: "dusun_name",
              size: 5,
              validation: ["required"],
              // options: defaultData.
            },
            {
              name: "Pola Pemanfaatan Lahan",
              type: "select",
              setter: "type_utilization",
              size: 6,
              validation: ["required"],
              options: defaultData.land_use_pattern,
            },

            {
              type: "delete",
              size: 1,
            },
            {
              name: "Deskripsi Penyebaran Lokasi Lahan Kering / Kritis",
              type: "textarea",
              main_form: true,
              setter: "distribution_of_critical_land_locations_description",
              size: 11,
            },
          ],
        },
        {
          name: "Sumber Air",
          fieldData: "waterSourceDetails",
          fields: [
            {
              name: "Nama Sumber Air",
              type: "text",
              setter: "watersource_name",
              size: 5,
              validation: ["required"],
              // options: defaultData.
            },
            {
              name: "Jenis",
              type: "select",
              setter: "watersource_type",
              size: 6,
              validation: ["required"],
              options: defaultData.watersource_type,
            },

            {
              type: "delete",
              size: 1,
            },
            {
              name: "Kondisi",
              type: "select",
              setter: "watersource_condition",
              size: 5,
              validation: ["required"],
              options: defaultData.watersource_condition,
            },
            {
              name: "Pemanfaatan Sumber Air",
              type: "select",
              setter: "watersource_utilization",
              size: 6,
              options: defaultData.watersource_utilization,
            },
            {
              name: "Deskripsi Sumber Air",
              type: "textarea",
              main_form: true,
              setter: "pra_watersource_description",
              size: 11,
            },
          ],
        },
        {
          name: "Pendapatan dan Pemasaran Komoditas (Ekonomi)",
          fieldData: "farmerIncomes",
          fields: [
            {
              name: "Cara Pengumpulan Data",
              type: "select-radio",
              setter: "collection_type",
              size: 12,
              validation: ["required"],
              main_form: true,
              pre_main_form: true,
              options: [
                {
                  label: "Sampling",
                  code: "Sampling",
                },
                {
                  label: "Bukan Sampling",
                  code: "Bukan Sampling",
                },
              ],
            },
            {
              name: "Laki - Laki",
              type: "group",
              size: 12,
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
              class: "m-0 p-0",
            },
            {
              name: "Sumber Informasi",
              validation: ["required"],
              size: 6,
              setter: "man_source",
              placeholder:
                "Sumber informasi yang didapatkan, narasumber / lainnya",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },
            {
              name: "Nama Komoditas",
              validation: ["required"],
              size: 6,
              setter: "man_commodity_name",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },
            {
              name: "Metode Pemasaran Komoditas",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "man_method",
              main_form: true,
              multiple: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
              options: defaultData.eco_method,
            },
            {
              name: "Metode Penjualan Tidak Langsung",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "man_marketing",
              main_form: true,
              multiple: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
              options: defaultData.eco_marketing,
            },
            {
              name: "Rata - Rata Periode Pemasaran",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "man_period",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
              options: defaultData.eco_period,
            },
            {
              name: "Rata - Rata Kapasitas Komoditas (kg)",
              validation: [],
              size: 6,
              type: "number",
              setter: "man_average_capacity",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },
            {
              name: "Pendapatan Terendah (Perbulan)",
              validation: ["required"],
              size: 6,
              type: "number",
              setter: "man_min_income",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },
            {
              name: "Pendapatan Tertinggi (Perbulan)",
              validation: ["required"],
              size: 6,
              type: "number",
              setter: "man_max_income",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },
            {
              name: "Perempuan",
              type: "group",
              size: 12,
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
              class: "m-0 p-0",
            },
            {
              name: "Sumber Informasi",
              validation: ["required"],
              size: 6,
              setter: "woman_source",
              placeholder:
                "Sumber informasi yang didapatkan, narasumber / lainnya",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },
            {
              name: "Nama Komoditas",
              validation: ["required"],
              size: 6,
              setter: "woman_commodity_name",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },
            {
              name: "Metode Pemasaran Komoditas",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "woman_method",
              main_form: true,
              multiple: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
              options: defaultData.eco_method,
            },
            {
              name: "Metode Penjualan Tidak Langsung",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "woman_marketing",
              main_form: true,
              multiple: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
              options: defaultData.eco_marketing,
            },
            {
              name: "Rata - Rata Periode Pemasaran",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "woman_period",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
              options: defaultData.eco_period,
            },
            {
              name: "Rata - Rata Kapasitas Komoditas (kg)",
              validation: [],
              size: 6,
              type: "number",
              setter: "woman_average_capacity",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },
            {
              name: "Pendapatan Terendah (Perbulan)",
              validation: ["required"],
              size: 6,
              type: "number",
              setter: "woman_min_income",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },
            {
              name: "Pendapatan Tertinggi (Perbulan)",
              validation: ["required"],
              size: 6,
              type: "number",
              setter: "woman_max_income",
              main_form: true,
              show_if: "collection_type",
              show_if_equals: "Bukan Sampling",
            },

            {
              name: "Nama Peserta Sampling",
              validation: ["required"],
              size: 6,
              setter: "name",
              show_if: "collection_type",
              show_if_equals: "Sampling",
            },
            {
              name: "Jenis Kelamin",
              validation: ["required"],
              size: 6,
              type: "select",
              options: defaultData.gender,
              show_if: "collection_type",
              show_if_equals: "Sampling",
            },

            {
              name: "Jenis Keluarga",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "family_type",
              show_if: "collection_type",
              show_if_equals: "Sampling",
              options: defaultData.eco_family_type,
            },

            {
              name: "Nama Komoditas",
              validation: ["required"],
              size: 6,
              setter: "commodity_name",
              show_if: "collection_type",
              show_if_equals: "Sampling",
            },

            {
              name: "Metode Pemasaran Komoditas",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "method",
              show_if: "collection_type",
              show_if_equals: "Sampling",
              options: defaultData.eco_method,
            },

            {
              name: "Periode Pemasaran",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "period",
              show_if: "collection_type",
              show_if_equals: "Sampling",
              options: defaultData.eco_period,
            },
            {
              name: "Kapasitas",
              validation: ["required"],
              size: 6,
              type: "number",
              setter: "capacity",
              show_if: "collection_type",
              show_if_equals: "Sampling",
            },
            {
              name: "Jumlah Keluarga",
              validation: ["required"],
              size: 6,
              type: "number",
              setter: "family_member",
              show_if: "collection_type",
              show_if_equals: "Sampling",
            },
            {
              name: "Pendapatan Perbulan",
              validation: ["required"],
              size: 6,
              type: "number",
              setter: "source_income",
              show_if: "collection_type",
              show_if_equals: "Sampling",
            },
            {
              name: "Sumber (Tanaman & Yang Lainnya)",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "source_income",
              getterKey: "data.result.data",
              api: "GetTreesAll",
              multiple: "true",
              show_if: "collection_type",
              show_if_equals: "Sampling",
              label: "tree_name",
              code: "tree_name",
            },
          ],
        },

        {
          name: "Hasil Ekonomi Pemanfaatan Lahan",
          fields: [
            {
              name: "Jenis Sumber Pemanfaatan Lahan",
              type: "text",
              setter: "land_utilization_source",
              size: 5,
              validation: ["required"],
              main_form: true,
            },
            {
              name: "Jenis Tanaman",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "land_utilization_plant_type",
              getterKey: "data.result.data",
              api: "GetTreesAll",
              multiple: true,
              main_form: true,
              label: "tree_name",
              code: "tree_name",
            },

            {
              name: "Deskripsi",
              type: "textarea",
              setter: "land_utilization_description",
              size: 11,
              validation: ["required"],
              main_form: true,
            },
          ],
        },

        {
          name: "Pupuk Dalam Pemanfaatan Lahan",
          fieldData: "fertilizerDetails",
          fields: [
            {
              name: "Nama Pupuk",
              type: "text",
              setter: "fertilizer_name",
              size: 5,
              validation: ["required"],
            },
            {
              name: "Kategori Pupuk",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "fertilizer_categories",
              options: defaultData.fertilizer_categories,
            },
            {
              name: "Jenis",
              validation: ["required"],
              size: 5,
              type: "select",
              setter: "fertilizer_type",
              options: defaultData.fertilizer_types,
            },
            {
              name: "Sumber",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "fertilizer_source",
              options: defaultData.fertilizer_sources,
            },
            {
              name: "Deskripsi",
              validation: ["required"],
              size: 11,
              type: "textarea",
              setter: "fertilizer_description",
            },
          ],
        },

        {
          name: "Pestisida Dalam Pemanfaatan Lahan",
          fieldData: "pesticideDetails",
          fields: [
            {
              name: "Nama Pestisida",
              type: "text",
              setter: "pesticide_name",
              size: 5,
              validation: ["required"],
            },
            {
              name: "Kategori Pestisida",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "pesticide_categories",
              options: defaultData.pesticide_categories,
            },
            {
              name: "Jenis",
              validation: ["required"],
              size: 5,
              type: "select",
              setter: "pesticide_type",
              options: defaultData.pesticide_types,
            },
            {
              name: "Sumber",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "pesticide_source",
              options: defaultData.pesticide_sources,
            },
            {
              name: "Deskripsi",
              validation: ["required"],
              size: 11,
              type: "textarea",
              setter: "pesticide_description",
            },
          ],
        },
      ],
    };
  },
};
</script>
