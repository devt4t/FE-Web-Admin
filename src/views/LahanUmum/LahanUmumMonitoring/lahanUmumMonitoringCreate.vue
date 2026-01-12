<template>
  <div class="program-soc-form">
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row lg="12" class="px-5 py-5">

          <v-col md="12" class="form-separator">
            <h4>Data Umum</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.lahan_no" :item="{
              label: 'No. Lahan',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'lahan_no',
              api: 'GetLahansForMonitoring',
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'lahan_no',
                  label: 'lahan_no',
                  display: ['lahan_no', 'program_year'],
                },
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.mou_no" :item="{
              label: 'MoU',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'mou_no',
              api: 'GetMoUForMonitoring',
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'mou_no',
                  label: 'mou_no',
                  display: ['mou_no'],
                },
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.program_year" :item="{
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
                  {
                    name: '2025',
                    value: '2025',
                  },
                ],

                list_pointer: {
                  code: 'value',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.planting_date" :item="{
              label: 'Waktu Penanaman',
              validation: ['required'],
              col_size: 6,
              type: 'date',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.lahan_condition" :item="{
              label: 'Kondisi Lahan',
              validation: ['required'],
              col_size: 6,
              type: 'text',
            }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Foto Dokumentasi</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.photo1" :item="{
              label: 'Foto Dokumentasi 1',
              path: formData.photo1,
              type: 'upload',
              api: '/general-lands/first-monitorings/upload.php',
              directory: './',
              upload_type: 'image/*',
              setter: 'photo1',
              view_data: 'photo1',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 5,
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.photo2" :item="{
              label: 'Foto Dokumentasi 2',
              type: 'upload',
              api: '/general-lands/first-monitorings/upload.php',
              directory: './',
              upload_type: 'image/*',
              setter: 'photo2',
              view_data: 'photo2',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 5,
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.photo3" :item="{
              label: 'Foto Dokumentasi 3',
              type: 'upload',
              api: '/general-lands/first-monitorings/upload.php',
              directory: './',
              upload_type: 'image/*',
              setter: 'photo3',
              view_data: 'photo3',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 5,
              },
            }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <div class="d-flex flex-row" style="align-items: center">
              <h4 class="mb-0 pb-0">Data Bibit</h4>
              <v-btn small class="circle ml-3" variant="success" @click="addRow()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col md="12">
            <div class="bg-grey">
              <v-expansion-panels focusable v-for="(item, i) in trees" :key="'acc' + i + i">
                <v-expansion-panel class="mb-3">
                  <v-expansion-panel-header>
                    <span :class="{
                      'text-italic text-grey': !item.name,
                    }">{{ item.tree_name || "Masukkan Data Tanaman" }}</span>
                    <div class="d-flex flex-row" style="justify-content: flex-end" v-if="trees.length > 1">
                      <button type="button" class="text-danger" @click="deleteRow(i)">
                        <v-icon class="text-danger">mdi-delete-empty</v-icon>
                      </button>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pt-4 pb-5">
                    <v-row>
                      <v-col lg="3">
                        <geko-input :item="{
                          label: 'Nama Tanaman',
                          validation: ['required'],
                          col_size: 6,
                          type: 'select',
                          setter: 'tree_code',
                          api: 'new-utilities/GetTrees',
                          option: {
                            getterKey: 'data',
                            list_pointer: {
                              code: 'tree_code',
                              label: 'tree_name',
                              display: ['tree_name'],
                            },
                          },
                        }" @selected="selectedTree($event, i)" />
                      </v-col>
                      <v-col lg="3">
                        <geko-input v-model="trees[i].qty" :item="{
                          label: 'Jumlah Bibit',
                          validation: ['required'],
                          col_size: 6,
                          type: 'number',
                        }" />
                      </v-col>
                      <v-col lg="3">
                        <geko-input v-model="trees[i].status" :item="{
                          label: 'Status',
                          validation: ['required'],
                          type: 'select',
                          setter: 'status',
                          option: {
                            default_options: [
                              {
                                name: 'Sudah Ditanam',
                                value: 'sudah_ditanam',
                              },
                              {
                                name: 'Belum Ditanam',
                                value: 'belum_ditanam',
                              },
                            ],

                            list_pointer: {
                              code: 'value',
                              label: 'name',
                              display: ['name'],
                            },
                          },
                        }" />
                      </v-col>
                      <v-col lg="3">
                        <geko-input v-model="trees[i].condition" :item="{
                          label: 'Kondisi',
                          validation: ['required'],
                          type: 'select',
                          setter: 'condition',
                          option: {
                            default_options: [
                              {
                                name: 'Hidup',
                                value: 'hidup',
                              },
                              {
                                name: 'Mati',
                                value: 'mati',
                              },
                            ],

                            list_pointer: {
                              code: 'value',
                              label: 'name',
                              display: ['name'],
                            },
                          },
                        }" />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>

          <v-col lg="12">
            <div class="d-flex flex-row" style="justify-content: flex-end">
              <v-btn variant="success" type="submit" :disabled="loading || (formData.total_minat == 0 && formData.total_ragu == 0)">
                <v-icon>mdi-plus</v-icon>
                <span v-if="isCreate">Tambah Data</span>
                <span v-else>Perbaharui Data</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
// import defaultData from "./ProgramSocData.js";
export default {
  name: "program-soc-form",
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    isCreate: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  methods: {
    // async onChangeVillage(data) {
    //   this.potentialStatus = data.scooping_visits_potential_status
    //   if ([2, 3].includes(this.potentialStatus)) {
    //     this.projectPurpose = data.scooping_visits_potential_status
    //   }
    // },
    async onSubmit() {
      if (this.loading) return;
      this.loading = true;

      const endpoint =
        this.$route.query.view == "create"
          ? "CreateMonitoringLahanUmum"
          : "UpdateFormMinatCollective";

      console.log("Form submitted with data:", this.formData);
      //insert main program soc
      this.formData.list_trees = this.trees;
      await this.$_api
        .post(endpoint, this.formData)
        .then((res) => {
          console.log("res", res);

          this.loading = false;
          this.$_alert.success(
            `Data monitoring berhasil ${
              this.$route.query.view === "create" ? "ditambahkan" : "diperbarui"
            }`
          );
          this.$router.replace({
            query: {
              view: "list",
            },
          });
          this.loading = false;
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
      // for (const farmer of _trees) {
      //   if (!farmer.name || !farmer.status_program) continue;
      //   farmer.form_no = resultMain;
      //   await this.$_api.post("AddFormMinatFarmers_new", farmer);
      // }

      
    },
    addRow() {
      this.trees.push({
        tree_name: null,
        tree_category: null,
        tree_code: null,
      });
    },

    deleteRow(i) {
      this.trees.splice(i, 1);
    },

    onSelectTree(i, v) {
      if (
        Array.isArray(this.trees[i].trees) &&
        this.trees[i].trees.length > 2
      ) {
        this.$_alert.error(
          {},
          "",
          "Pohon yang dipilih tidak boleh lebih dari 3"
        );
        // this.$set(this.trees[i], "trees", v);
      }
    },
    selectedTree(tree, i) {
      console.log("selectedTree", tree, i);
      if (tree && tree.tree_code) {
        this.$set(this.trees[i], "tree_code", tree.tree_code);
        this.$set(this.trees[i], "tree_name", tree.tree_name);
        this.$set(this.trees[i], "tree_category", tree.tree_category);
      } else {
        this.$set(this.trees[i], "tree_code", null);
        this.$set(this.trees[i], "tree_name", null);
        this.$set(this.trees[i], "tree_category", null);
      }
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        created_by: this.user.email,
      },
      projectPurpose: null,
      trees: [
        {
          tree_name: null,
          tree_category: null,
          tree_code: null,
          qty: null,
          status: null,
          condition: null,
        },
      ],
    };
  },
};
</script>
