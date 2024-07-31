<template>
  <div class="program-soc-form">
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row lg="12" class="px-5 py-5">
          <v-col md="12" class="form-separator">
            <h4>Tanggal Sosialisasi</h4>
          </v-col>

          <v-col lg="6">
            <geko-input
              v-model="formData.form_date"
              :item="{
                label: 'Tanggal',
                validation: ['required'],
                type: 'date',
                setter: 'date',
              }"
            />
          </v-col>

          <v-col lg="6">
            <geko-input
              v-model="formData.program_year"
              :item="{
                label: 'Tahun Program',
                validation: ['required'],
                type: 'select',
                setter: 'program_year',
                option: {
                  default_options: [
                    {
                      name: '2020',
                      value: '2020',
                    },
                    {
                      name: '2021',
                      value: '2021',
                    },
                    {
                      name: '2022',
                      value: '2022',
                    },
                    {
                      name: '2023',
                      value: '2023',
                    },
                    {
                      name: '2024',
                      value: '2024',
                    },
                  ],

                  list_pointer: {
                    code: 'value',
                    label: 'name',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col md="12" class="form-separator">
            <h4>Lokasi Desa</h4>
          </v-col>
          <v-col lg="6">
            <geko-input
              v-model="formData.mu_no"
              :item="{
                label: 'Management Unit',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'mu_no',
                api: 'GetManagementUnit',
                option: {
                  getterKey: 'data.result',
                  list_pointer: {
                    code: 'mu_no',
                    label: 'name',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="6">
            <geko-input
              :disabled="!formData.mu_no"
              v-model="formData.target_area"
              :item="{
                label: 'Target Area',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'target_area',
                api: 'GetTargetArea',
                param: {
                  mu_no: formData.mu_no,
                },
                option: {
                  getterKey: 'data.result',
                  list_pointer: {
                    code: 'area_code',
                    label: 'name',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="6">
            <geko-input
              :disabled="!formData.target_area || !formData.program_year"
              v-model="formData.village"
              :item="{
                label: 'Desa',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'village',
                api: 'GetDesa',
                param: {
                  program_year: formData.program_year,
                  kode_ta: formData.target_area,
                },
                option: {
                  getterKey: 'data.result',
                  list_pointer: {
                    code: 'kode_desa',
                    label: 'name',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>

          <v-col md="12" class="form-separator" v-if="formData.mu_no">
            <div class="d-flex flex-row" style="align-items: center">
              <h4 class="mb-0 pb-0">Daftar Petani</h4>
              <v-btn
                small
                class="circle ml-3"
                variant="success"
                @click="addRow()"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col md="12" v-if="formData.mu_no">
            <div class="bg-grey">
              <v-expansion-panels
                focusable
                v-for="(item, i) in participants"
                :key="'acc' + i + i"
              >
                <v-expansion-panel class="mb-3">
                  <v-expansion-panel-header>
                    <span
                      :class="{
                        'text-italic text-grey': !item.name,
                      }"
                      >{{ item.name || "Masukkan Data Petani" }}</span
                    >
                    <div
                      class="d-flex flex-row"
                      style="justify-content: flex-end"
                      v-if="participants.length > 1"
                    >
                      <button class="text-danger" @click="deleteRow(i)">
                        <v-icon class="text-danger">mdi-delete-empty</v-icon>
                      </button>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pt-4 pb-5">
                    <v-row>
                      <v-col lg="6">
                        <geko-input
                          v-model="item.name"
                          :item="{
                            label: 'Nama Petani',
                            validation: ['required'],
                            type: 'text',
                            setter: 'name',
                          }"
                        />
                      </v-col>
                      <v-col lg="6">
                        <geko-input
                          v-model="item.status_program"
                          :item="{
                            label: 'Berminat?',
                            validation: ['required'],
                            type: 'select-radio',
                            setter: 'status_program',
                            option: {
                              list_pointer: {
                                label: 'label',
                                code: 'code',
                                display: ['label'],
                              },
                              default_options: [
                                {
                                  label: 'Ya',
                                  code: 'Ya',
                                },
                                {
                                  label: 'Tidak',
                                  code: 'Tidak',
                                },
                                {
                                  label: 'Ragu - Ragu',
                                  code: 'Ragu - Ragu',
                                },
                              ],
                            },
                          }"
                        />
                      </v-col>
                      <v-col lg="6" v-if="item.status_program === 'Ya'">
                        <geko-input
                          v-model="item.pattern"
                          :item="{
                            label: 'Pola Tanam Sebelumnya',
                            validation: ['required'],
                            type: 'select',
                            setter: 'pattern',
                            option: {
                              list_pointer: {
                                label: 'text',
                                code: 'value',
                                display: ['text'],
                              },
                              default_options: defaultData.planting_pattern,
                            },
                          }"
                        />
                      </v-col>
                      <v-col
                        lg="6"
                        v-if="
                          ['Ya', 'Ragu - Ragu'].includes(item.status_program)
                        "
                      >
                        <geko-input
                          v-model="item.training"
                          :item="{
                            label: 'Materi Pelatihan',
                            validation: ['required'],
                            type: 'select',
                            setter: 'training',
                            api: 'GetTrainingMaterials',
                            option: {
                              getterKey: 'data.result',
                              list_pointer: {
                                label: 'material_name',
                                code: 'material_no',
                                display: ['material_name'],
                              },
                            },
                          }"
                        />
                      </v-col>

                      <v-col
                        lg="6"
                        v-if="
                          ['Ya'].includes(item.status_program) &&
                          !['007', '019', '015', '008', '014', '016'].includes(
                            formData.mu_no
                          )
                        "
                      >
                        <geko-input
                          v-model="item.owned_land_legalization_status"
                          :item="{
                            validation: ['required'],
                            label: 'Status legalitas lahan yang dimiliki',
                            type: 'select-radio',
                            option: {
                              default_options:
                                defaultData.owned_land_legalization_status,
                              list_pointer: {
                                code: 'code',
                                name: 'name',
                                display: ['name'],
                              },
                            },
                          }"
                        />
                      </v-col>

                      <v-col
                        lg="6"
                        v-if="
                          ['Ya'].includes(item.status_program) &&
                          !['007', '019', '015', '008', '014', '016'].includes(
                            formData.mu_no
                          )
                        "
                      >
                        <geko-input
                          v-model="item.followed_project_model"
                          :item="{
                            validation: ['required'],
                            label: 'Model project yang akan diikuti',
                            type: 'select-radio',
                            option: {
                              default_options:
                                defaultData.followed_project_model,
                              list_pointer: {
                                code: 'code',
                                name: 'name',
                                display: ['name'],
                              },
                            },
                          }"
                        />
                      </v-col>

                      <v-col lg="6" v-if="['Ya'].includes(item.status_program)">
                        <geko-input
                          v-model="item.trees"
                          :item="{
                            label: 'Pohon Yang Diminati (maks 3)',
                            validation: ['required'],
                            type: 'select',
                            setter: 'training',
                            api: 'GetTreesAll',
                            option: {
                              multiple: true,
                              getterKey: 'data.result.data',
                              list_pointer: {
                                label: 'tree_name',
                                code: 'tree_code',
                                display: ['tree_name'],
                              },
                            },
                          }"
                          @selected="onSelectTree(i, item.trees)"
                        />
                      </v-col>

                      <v-col md="6">
                        <geko-input
                          v-model="item.photo"
                          :item="{
                            label: 'Foto Minat',
                            validation: ['required'],
                            type: 'upload',
                            api: 'sosialisasi_program/upload.php',
                            directory: 'photos',
                            upload_type: 'image/*',
                            setter: 'photo',
                            view_data: 'farmer_photo_' + i,
                            option: {
                              label_hint:
                                'Klik gambar untuk memilih berkas yang akan diunggah',
                              max_size: 5,
                              multiple: false,
                            },
                          }"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>

          <v-col lg="12">
            <div class="d-flex flex-row" style="justify-content: flex-end">
              <v-btn variant="success" type="submit" :disabled="loading">
                <v-icon>mdi-plus</v-icon>
                <span>Tambah Data</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import defaultData from "./ProgramSocData.js";
export default {
  name: "program-soc-form",
  methods: {
    async onSubmit() {
      if (this.loading) return;
      this.loading = true;

      //validate master detail

      let _participants = [];
      for (const item of this.participants) {
        if (Array.isArray(item.trees) && item.trees.length > 3) {
          this.$_alert.error(
            {},
            "",
            `Pohon yang dipilih tidak boleh lebih dari 3 (Petani: ${item.name})`
          );
          this.loading = false;
          return;
        }

        if (Array.isArray(item.trees)) {
          let tmpValue = item;
          if (item.trees.length > 0) {
            tmpValue.tree1 = item.trees[0];
          }

          if (item.trees.length > 1) {
            tmpValue.tree2 = item.trees[1];
          }

          if (item.trees.length > 2) {
            tmpValue.tree3 = item.trees[2];
          }

          delete tmpValue.trees;
          _participants.push(tmpValue);
        }
      }
      //api call

      const payload = {
        form_date: this.formData.form_date,
        village: this.formData.village,
        mu_no: this.formData.mu_no,
        target_area: this.formData.target_area,
        program_year: this.formData.program_year,
      };

      //insert main program soc
      const resultMain = await this.$_api
        .post("AddFormMinatMain_new", payload)
        .then((res) => {
          console.log("res", res);
          return res.form_no;
        })
        .catch((err) => {
          this.$_alert.error(err);
          return false;
        });

      if (!resultMain) {
        this.loading = false;
        return;
      }

      //insert farmers
      for (const farmer of _participants) {
        if (!farmer.name || !farmer.status_program) continue;
        farmer.form_no = resultMain;
        await this.$_api.post("AddFormMinatFarmers_new", farmer);
      }

      this.loading = false;
      this.$_alert.success("Data sosialisasi program berhasil ditambahkan");
      this.$router.replace({
        query: {
          view: "list",
        },
      });
    },

    addRow() {
      this.participants.push({
        form_no: null,
        trees: [],
      });
    },

    deleteRow(i) {
      this.participants.splice(i, 1);
    },

    onSelectTree(i, v) {
      if (
        Array.isArray(this.participants[i].trees) &&
        this.participants[i].trees.length > 2
      ) {
        this.$_alert.error(
          {},
          "",
          "Pohon yang dipilih tidak boleh lebih dari 3"
        );
        // this.$set(this.participants[i], "trees", v);
      }
    },
  },

  computed: {
    defaultData() {
      return defaultData;
    },
  },

  watch: {
    "formData.mu_no"(v) {
      this.$set(this.formData, "target_area", null);
      this.$set(this.formData, "village", null);
    },

    "formData.target_area"() {
      this.$set(this.formData, "village", null);
    },
  },

  data() {
    return {
      loading: false,
      formData: {
        form_date: "",
        village: "",
        mu_no: "",
        target_area: "",
        program_year: "2024",
      },
      participants: [
        {
          form_no: "",
          name: "",
          address: "",
          status_program: "",
          training: "",
          photo: "",
          trees: [],
          tree1: "",
          tree2: "",
          tree3: "",
          pattern: "",
        },
      ],
    };
  },
};
</script>
