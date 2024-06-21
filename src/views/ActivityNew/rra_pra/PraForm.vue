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
          <v-col
            md="12"
            class="form-separator d-flex flex-row"
            style="align-items: center"
          >
            <h4>Data Scooping &amp; RRA</h4>
          </v-col>

          <v-col lg="5">
            <geko-input
              v-model="$route.query.scooping_visit_code"
              :item="{
                type: 'text',
                validation: ['required'],
                label: 'No. Scooping Visit',
              }"
              :disabled="true"
            />
          </v-col>

          <v-col lg="6">
            <geko-input
              v-model="$route.query.rra_code"
              :item="{
                type: 'text',
                validation: ['required'],
                label: 'No. RRA',
              }"
              :disabled="true"
            />
          </v-col>

          <v-col lg="5">
            <geko-input
              v-model="$route.query.scooping_visit_village"
              :item="{
                type: 'text',
                validation: ['required'],
                label: 'Desa ',
              }"
              :disabled="true"
            />
          </v-col>

          <v-col lg="6">
            <geko-input
              :item="{
                type: 'text',
                label: 'Tanggal Scooping',
              }"
              :disabled="true"
              :value="`${formatDate(
                $route.query.scooping_visit_start
              )} - ${formatDate($route.query.scooping_visit_end)}`"
            />
          </v-col>
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
                (Array.isArray(formFieldData[parent.fieldData]) &&
                  formFieldData[parent.fieldData].length > 0) ||
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
                      (!input.show_if && !input.item_show_if) ||
                      (input.show_if &&
                        formData[input.show_if] == input.show_if_equals) ||
                      (input.item_show_if &&
                        f[input.item_show_if] == input.item_show_if_equals)
                    "
                  >
                    <v-col :md="input.size" :key="`f-${i}-${j}-${k}`">
                      <div
                        v-if="input.type === 'delete'"
                        class="d-flex flex-column"
                        style="height: 100%; justify-content: center"
                      >
                        <button
                          v-if="
                            formFieldData[parent.fieldData].length >
                            (parent.allowEmpty ? 0 : 1)
                          "
                          class="text-danger"
                          @click="removeRow(parent.fieldData, j)"
                        >
                          <v-icon class="text-danger">mdi-close</v-icon>
                        </button>
                      </div>
                      <geko-input
                        v-else
                        v-model="f[input.setter]"
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

        <v-col md="12" class="form-separator d-flex flex-column">
          <h4>Matriks Permasalahan</h4>
          <p class="text-grey text-09-em">
            NB: Angka terkecil adalah yang paling bermasalah
          </p>
        </v-col>

        <v-col lg="12">
          <div class="bg-grey">
            <div class="table-responsive">
              <table class="problem-matrix">
                <thead>
                  <tr>
                    <th>Nama Masalah</th>
                    <th>Dirasakan</th>
                    <th>Sering Terjadi</th>
                    <th>Prioritas</th>
                    <th>Potensi</th>
                    <th>Jumlah</th>
                    <th>Ranking</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(item, i) in formFieldData.existingProblems"
                    :key="`index-${i}`"
                  >
                    <td class="text-center">
                      <span v-if="item.problem_name">{{
                        item.problem_name
                      }}</span>
                      <span v-else class="text-italic text-09-em text-grey"
                        >Isi nama masalah terlebih dahulu</span
                      >
                    </td>
                    <td>
                      <div class="problem-matrix-wrapper">
                        <button
                          v-for="(child, j) in formFieldData.existingProblems"
                          @click="
                            item.impact_to_people =
                              j + 1 == item.impact_to_people ? null : j + 1
                          "
                          :class="{
                            'problem-matrix-btn': true,
                            active: item.impact_to_people == j + 1,
                            disabled:
                              formFieldData.existingProblems.find(
                                (x) => x.impact_to_people == j + 1
                              ) &&
                              formFieldData.existingProblems.findIndex(
                                (x) => x.impact_to_people == j + 1
                              ) !== i,
                          }"
                          :disabled="
                            formFieldData.existingProblems.find(
                              (x) => x.impact_to_people == j + 1
                            ) &&
                            formFieldData.existingProblems.findIndex(
                              (x) => x.impact_to_people == j + 1
                            ) !== i
                          "
                        >
                          {{ j + 1 }}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div class="problem-matrix-wrapper">
                        <button
                          v-for="(child, j) in formFieldData.existingProblems"
                          @click="
                            item.interval_problem =
                              j + 1 == item.interval_problem ? null : j + 1
                          "
                          :class="{
                            'problem-matrix-btn': true,
                            active: item.interval_problem == j + 1,
                            disabled:
                              formFieldData.existingProblems.find(
                                (x) => x.interval_problem == j + 1
                              ) &&
                              formFieldData.existingProblems.findIndex(
                                (x) => x.interval_problem == j + 1
                              ) !== i,
                          }"
                          :disabled="
                            formFieldData.existingProblems.find(
                              (x) => x.interval_problem == j + 1
                            ) &&
                            formFieldData.existingProblems.findIndex(
                              (x) => x.interval_problem == j + 1
                            ) !== i
                          "
                        >
                          {{ j + 1 }}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div class="problem-matrix-wrapper">
                        <button
                          v-for="(child, j) in formFieldData.existingProblems"
                          @click="
                            item.priority =
                              j + 1 == item.priority ? null : j + 1
                          "
                          :class="{
                            'problem-matrix-btn': true,
                            active: item.priority == j + 1,
                            disabled:
                              formFieldData.existingProblems.find(
                                (x) => x.priority == j + 1
                              ) &&
                              formFieldData.existingProblems.findIndex(
                                (x) => x.priority == j + 1
                              ) !== i,
                          }"
                          :disabled="
                            formFieldData.existingProblems.find(
                              (x) => x.priority == j + 1
                            ) &&
                            formFieldData.existingProblems.findIndex(
                              (x) => x.priority == j + 1
                            ) !== i
                          "
                        >
                          {{ j + 1 }}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div class="problem-matrix-wrapper">
                        <button
                          v-for="(child, j) in formFieldData.existingProblems"
                          @click="
                            item.potential =
                              j + 1 == item.potential ? null : j + 1
                          "
                          :class="{
                            'problem-matrix-btn': true,
                            active: item.potential == j + 1,
                            disabled:
                              formFieldData.existingProblems.find(
                                (x) => x.potential == j + 1
                              ) &&
                              formFieldData.existingProblems.findIndex(
                                (x) => x.potential == j + 1
                              ) !== i,
                          }"
                          :disabled="
                            formFieldData.existingProblems.find(
                              (x) => x.potential == j + 1
                            ) &&
                            formFieldData.existingProblems.findIndex(
                              (x) => x.potential == j + 1
                            ) !== i
                          "
                        >
                          {{ j + 1 }}
                        </button>
                      </div>
                    </td>
                    <td class="text-center">
                      <span class="font-weight-bold">{{
                        (item.impact_to_people || 0) +
                        (item.interval_problem || 0) +
                        (item.potential || 0) +
                        (item.priority || 0)
                      }}</span>
                    </td>
                    <td>
                      <div class="problem-matrix-wrapper">
                        <button
                          v-for="(child, j) in formFieldData.existingProblems"
                          @click="
                            item.ranking = j + 1 == item.ranking ? null : j + 1
                          "
                          :class="{
                            'problem-matrix-btn': true,
                            active: item.ranking == j + 1,
                            disabled:
                              formFieldData.existingProblems.find(
                                (x) => x.ranking == j + 1
                              ) &&
                              formFieldData.existingProblems.findIndex(
                                (x) => x.ranking == j + 1
                              ) !== i,
                          }"
                          :disabled="
                            formFieldData.existingProblems.find(
                              (x) => x.ranking == j + 1
                            ) &&
                            formFieldData.existingProblems.findIndex(
                              (x) => x.ranking == j + 1
                            ) !== i
                          "
                        >
                          {{ j + 1 }}
                        </button>
                      </div>
                    </td>
                    <!-- <td>
                      <v-select
                        dense
                        color="success"
                        clearable
                        :placeholder="`1 - ${
                          formFieldData.existingProblems.length + 1
                        }`"
                        :items="
                          formFieldData.existingProblems.map(
                            (val, valIndex) => {
                              return {
                                text: valIndex + 1,
                                value: valIndex + 1,
                                disabled: formFieldData.existingProblems.find(
                                  (val1) =>
                                    val1.impact_to_people === valIndex + 1
                                )
                                  ? true
                                  : false,
                              };
                            }
                          )
                        "
                        single-line
                        hide-details
                        item-color="success"
                        :menu-props="{
                          rounded: 'xl',
                          transition: 'slide-y-transition',
                        }"
                        style="width: 150px"
                        outlined
                        rounded
                        class="mx-auto"
                        v-model="item.impact_to_people"
                      ></v-select>
                    </td> -->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </v-col>

        <v-col lg="12">
          <div class="d-flex flex-row" style="justify-content: flex-end">
            <v-btn variant="success" @click="onSubmit"> Test </v-btn>
          </div>
        </v-col>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import defaultData from "./RraPraData.js";
import moment from "moment";
export default {
  name: "pra-form",

  computed: {
    defaultData() {
      return defaultData;
    },
  },
  methods: {
    addRow(field, key) {
      if (field == "existingProblems") {
        this.componentKey += 1;
      }
      this.formFieldData[field].push({
        pra_no: null,
      });
    },
    removeRow(field, i) {
      console.log("remove row called", field, i);
      console.log("before remove", this.formFieldData[field]);
      this.formFieldData[field].splice(i, 1);
    },

    async submitMasterDetail(endPoint, data) {
      return new Promise(async (resolve, reject) => {
        this.$_api
          .post(endPoint, data)
          .then((res) => {
            return resolve();
          })
          .catch((err) => {
            console.log(`add ${endPoint} error `, err);
            return reject();
          });
      });
    },
    async onSubmit() {
      console.log("form data", this.formData);
      console.log("form fields", this.formFieldData);

      let _existingProblems = [];
      for (const item of this.formFieldData.existingProblems) {
        item.pra_no = null;
        if (
          !item.impact_to_people ||
          !item.interval_problem ||
          !item.priority ||
          !item.potential ||
          !item.ranking
        ) {
          // this.$_alert.error(
          //   {},
          //   "Data belum lengkap",
          //   "Isi semua form yang ada di dalam matriks permasalahan"
          // );
          // return;
        }
        item.total_value =
          (item.impact_to_people || 0) +
          (item.interval_problem || 0) +
          (item.priority || 0) +
          (item.potential || 0);
        _existingProblems.push(item);
      }

      const mainPraPayload = {
        scooping_form_no: this.$route.query.scooping_visit_code,
        land_ownership_description: this.formData.land_ownership_description,
        distribution_of_critical_land_locations_description:
          this.formData.distribution_of_critical_land_locations_description,
        collection_type: this.formData.collection_type,
        man_min_income: this.formData.man_min_income,
        man_max_income: this.formData.man_max_income,
        man_income_source: this.formData.man_income_source,
        man_commodity_name: this.formData.man_commodity_name,
        man_method: Array.isArray(this.formData.man_method)
          ? this.formData.man_method.join(",")
          : null,
        man_average_capacity: this.formData.man_average_capacity,
        man_marketing: Array.isArray(this.formData.man_marketing)
          ? this.formData.man_marketing.join(",")
          : null,
        man_period: this.formData.man_period,
        man_source: this.formData.man_source,
        woman_min_income: this.formData.woman_min_income,
        woman_max_income: this.formData.woman_max_income,
        woman_income_source: this.formData.woman_income_source,
        woman_commodity_name: this.formData.woman_commodity_name,
        woman_method: Array.isArray(this.formData.woman_method)
          ? this.formData.woman_method.join(",")
          : null,
        woman_average_capacity: this.formData.woman_average_capacity,
        woman_marketing: Array.isArray(this.formData.woman_marketing)
          ? this.formData.woman_marketing.join(",")
          : null,
        woman_period: this.formData.woman_period,
        woman_source: this.formData.woman_source,
        income_description: this.formData.income_description,
        land_utilization_source: this.formData.land_utilization_source,
        land_utilization_plant_type: Array.isArray(
          this.formData.land_utilization_plant_type
        )
          ? this.formData.land_utilization_plant_type.join(",")
          : null,
        land_utilization_description:
          this.formData.land_utilization_description,
        pra_watersource_description: this.formData.pra_watersource_description,
        dry_land_photo: this.formData.dry_land_photo,
        dry_land_photo2: this.formData.dry_land_photo,
        watersource_photo: this.formData.watersource_photo,
        status_document: "document_saving",
      };

      let mainPra = this.tmpPraCode;
      if (!mainPra) {
        mainPra = await this.$_api
          .post("addMainPra_new", mainPraPayload)
          .then((res) => {
            return res.pra_no;
          })
          .catch(() => {
            return false;
          });
      }

      if (!mainPra) return;
      this.tmpPraCode = mainPra || this.tmpPraCode;
      const praCode = mainPra ? mainPra : this.tmpPraCode;

      for (const item of this.formFieldData.landOwnerships) {
        item.pra_no = praCode;
        await this.submitMasterDetail("addPraLandOwnership_new", item);
      }

      for (const item of this.formFieldData.disasterDetails) {
        item.pra_no = praCode;
        await this.submitMasterDetail("addPraDisasterDetail_new", item);
      }

      for (const item of this.formFieldData.fertilizerDetails) {
        item.pra_no = praCode;
        await this.submitMasterDetail("addPraFretilizerDetail_new", item);
      }

      for (const item of this.formFieldData.pesticideDetails) {
        item.pra_no = praCode;
        await this.submitMasterDetail("addPraPesticideDetail_new", item);
      }

      for (const item of this.formFieldData.dryLandSpreads) {
        item.pra_no = praCode;
        await this.submitMasterDetail("addPraDryLandSpreads_new", item);
      }

      for (const item of this.formFieldData.waterSourceDetails) {
        item.pra_no = praCode;
        await this.submitMasterDetail("addPraWaterSource_new", item);
      }
      for (const item of this.formFieldData.farmerIncomes) {
        item.pra_no = praCode;
        item.source_income = item.source_income
          ? item.source_income.join(",")
          : null;
        await this.submitMasterDetail("addPraFarmerIncome_new", item);
      }

      for (const item of _existingProblems) {
        item.pra_no = praCode;
        await this.submitMasterDetail("addPraExistingProblem_new", item);
      }

      for (const item of this.formFieldData.floras) {
        item.pra_no = praCode;
        await this.submitMasterDetail("addSocialImpactFloraDetails_new", item);
      }

      for (const item of this.formFieldData.faunas) {
        item.pra_no = praCode;
        await this.submitMasterDetail("addSocialImpactFaunaDetails_new", item);
      }

      this.$_alert.success("Data rra berhasil ditambahkan");
      this.$router.replace({
        query: {
          view: "detail",
          id: this.$route.query.id,
        },
      });
    },
  },

  data() {
    return {
      componentKey: 1,
      tmpPraCode: null,
      formData: {},
      formFieldData: {
        landOwnerships: [{ pra_no: null }],
        dryLandSpreads: [{ pra_no: null }],
        waterSourceDetails: [{ pra_no: null }],
        farmerIncomes: [{ pra_no: null }],
        fertilizerDetails: [{ pra_no: null }],
        pesticideDetails: [{ pra_no: null }],
        disasterDetails: [],
        existingProblems: [{ pra_no: null }],
        floras: [],
        faunas: [],
      },
      formatDate(date, format = "DD MMMM YYYY") {
        return moment(date).format(format);
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
              type: "number",
              validation: ["required"],
              size: 6,
            },

            {
              type: "delete",
              size: 1,
            },

            {
              name: "Jenis Kepemilikan",
              type: "select",
              options: defaultData.land_ownership_type,
              setter: "land_ownership",
              validation: ["required"],

              item_show_if: "type_ownership",
              item_show_if_equals: "non_petani",
              size: 5,
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
              size: 5,
              setter: "name",
              show_if: "collection_type",
              show_if_equals: "Sampling",
            },
            {
              name: "Jenis Kelamin",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "gender",
              options: defaultData.gender,
              show_if: "collection_type",
              show_if_equals: "Sampling",
            },

            {
              type: "delete",
              size: 1,
            },

            {
              name: "Jenis Keluarga",
              validation: ["required"],
              size: 5,
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
              size: 5,
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
              size: 5,
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
              size: 5,
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
              type: "delete",
              size: 1,
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
              type: "delete",
              size: 1,
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

        {
          name: "Bencana",
          fieldData: "disasterDetails",
          allowEmpty: true,
          fields: [
            {
              name: "Penyebutan Terhadap Kejadian Bencana",
              type: "text",
              setter: "disaster_name",
              size: 5,
              validation: ["required"],
            },
            {
              name: "Kategori Bencana",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "disaster_categories",
              options: defaultData.disaster_categories,
            },

            {
              type: "delete",
              size: 1,
            },
            {
              name: "Periode Terjadinya Bencana",
              validation: ["required"],
              size: 5,
              type: "text",
              setter: "year",
            },
            {
              name: "Korban Jiwa",
              validation: [],
              size: 6,
              type: "number",
              setter: "fatalities",
            },
            {
              name: "Penjelasan Mengenai Bencana",
              validation: ["required"],
              size: 11,
              type: "textarea",
              setter: "detail",
            },
          ],
        },

        {
          name: "Data Flora Endemik",
          fieldData: "floras",
          allowEmpty: true,
          fields: [
            {
              name: "Nama",
              type: "text",
              setter: "flora_name",
              size: 5,
              validation: ["required"],
            },
            {
              name: "Jenis",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "flora_categories",
              options: defaultData.flora_type,
            },

            {
              type: "delete",
              size: 1,
            },
            {
              name: "Populasi",
              validation: [],
              size: 5,
              type: "number",
              setter: "flora_population",
            },
            {
              name: "Sumber Air",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "flora_foodsource",
              options: defaultData.watersource_type,
            },
            {
              name: "Status",
              validation: ["required"],
              size: 5,
              type: "select",
              setter: "flora_status",
              options: defaultData.flora_status,
            },
          ],
        },

        {
          name: "Data Fauna Endemik",
          fieldData: "faunas",
          allowEmpty: true,
          fields: [
            {
              name: "Nama",
              type: "text",
              setter: "fauna_name",
              size: 5,
              validation: ["required"],
            },
            {
              name: "Jenis",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "fauna_categories",
              options: defaultData.flora_type,
            },

            {
              type: "delete",
              size: 1,
            },
            {
              name: "Populasi",
              validation: [],
              size: 5,
              type: "number",
              setter: "fauna_population",
            },
            {
              name: "Sumber Makanan",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "fauna_foodsource",
              options: defaultData.fauna_source,
            },
            {
              name: "Status",
              validation: ["required"],
              size: 5,
              type: "select",
              setter: "fauna_status",
              options: defaultData.flora_status,
            },
          ],
        },

        {
          name: "Pemasalahan Yang Ada",
          fieldData: "existingProblems",
          fields: [
            {
              name: "Nama masalah",
              type: "text",
              setter: "problem_name",
              size: 5,
              validation: ["required"],
            },
            {
              name: "Kategori Bencana",
              validation: ["required"],
              size: 6,
              type: "select",
              setter: "problem_categories",
              options: defaultData.problem_categories,
            },

            {
              type: "delete",
              size: 1,
            },
            {
              name: "Periode Masalah",
              validation: ["required"],
              placeholder: "3 Bulan Terakhir / 5 Tahun Lalu / Lainnya",
              size: 5,
              type: "text",
              setter: "date",
            },
            {
              name: "Narasumber",
              validation: ["required"],
              size: 6,
              type: "text",
              setter: "problem_source",
            },
            {
              name: "Saran Solusi",
              validation: ["required"],
              size: 11,
              type: "textarea",
              setter: "problem_solution",
            },
          ],
        },
      ],
    };
  },
};
</script>
