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
            <geko-input v-model="formData.monitoring_no" :item="{
              label: 'Nomor Monitoring',
              validation: ['required'],
              col_size: 6,
              type: 'text',
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
            <geko-input :disabled="!formData.planting_date" v-model="formData.target_area" :item="{
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
              api: 'sosialisasi_program/upload.php',
              directory: 'photos/doc_collective',
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
              api: 'sosialisasi_program/upload.php',
              directory: 'photos/doc_collective',
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
              api: 'sosialisasi_program/upload.php',
              directory: 'photos/doc_collective',
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
  beforeMount() {
    if (this.$route.query.view === "update") {
      this.isCreate = false;
      this.ready = true;
      this.initData();
    } else {
      this.isCreate = true;
      this.ready = true;
    }
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
          ? "AddFormMinatCollective"
          : "UpdateFormMinatCollective";

      this.formData.list_tree = this.trees;
      this.formData.is_group_area = this.formData.people_status === 3 ? 1 : 0;
      this.formData.city = typeof this.formData.city === 'object' ? this.formData.city[0].kabupaten_no : this.formData.city;
      this.formData.training1 = typeof this.formData.training1 === 'object' ? this.formData.training1[0]?.material_no : this.formData.training1;
      this.formData.training2 = typeof this.formData.training2 === 'object' ? this.formData.training2[0]?.material_no : this.formData.training2;
      this.formData.village = typeof this.formData.village === 'object' ? this.formData.village[0].kode_desa : this.formData.village;
      this.formData.target_area = typeof this.formData.target_area === 'object' ? this.formData.target_area[0].area_code : this.formData.target_area;
      this.formData.mu_no = typeof this.formData.mu_no === 'object' ? this.formData.mu_no[0].mu_no : this.formData.mu_no;
      this.formData.province = typeof this.formData.province === 'object' ? this.formData.province[0].province_code : this.formData.province;
      console.log("Form submitted with data:", this.formData, typeof this.formData.target_area);
      //insert main program soc
      const resultMain = await this.$_api
        .post(endpoint, this.formData)
        .then((res) => {
          console.log("res", res);

          this.loading = false;
          this.$_alert.success(
            `Data sosialisasi program berhasil ${
              this.$route.query.view === "create" ? "ditambahkan" : "diperbarui"
            }`
          );
          this.$router.replace({
            query: {
              view: "list",
            },
          });

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
      // for (const farmer of _trees) {
      //   if (!farmer.name || !farmer.status_program) continue;
      //   farmer.form_no = resultMain;
      //   await this.$_api.post("AddFormMinatFarmers_new", farmer);
      // }

      
    },
    async initData() {
      const detailData = await this.$_api.get("GetFormMinatCollectiveDetailAll_new", {
        id: this.$route.query.id,
      });
      this.data = detailData.mainSpr;
      this.muNo = this.$route.query.mu_no;

      this.trees = detailData.sprTrees || [];

      const resTrainings = await this.$_api.get(
        "GetTrainingMaterials"
      );

      const resMUs = await this.$_api.get(
        "new-utilities/management-units",
        {
          mu_no: this.data.mu_no,
        }
      );

      const resTAs = await this.$_api.get(
        "GetTargetArea",
        {
          mu_no: this.data.mu_no,
          area_code: this.data.target_area,
        }
      );

      const resProvinces = await this.$_api.get(
        "new-utilities/provinces",
        {
          province_code: this.data.province,
        }
      );

      const resKabs = await this.$_api.get(
        "new-utilities/kabupatens",
        {
          kabupaten_no: this.data.city,
        }
      );

      const resDesas = await this.$_api.get(
        "new-utilities/desas",
        {
          village: this.data.village,
        }
      );

      
      
      const keys = [
        ["photo1"],
        ["photo2"],
        ["form_date"],
        ["form_no"],
        ["village"],
        ["mu_no"],
        ["target_area"],
        ["total_minat"],
        ["total_ragu"],
        ["program_year"],
        ["contact_type"],
        ["contact_person"],
        ["list_tree"],
        ["lahan_legal_status"],
        ["program_type"],
        ["lahan_legal_status_others"],
        ["name_entry_data"],
        ["gender"],
        ["age"],
        ["people_status","people_status"],
        ["group_name"],
        ["entry_data_position", "entry_data_position"],
        ["position_others"],
        ["position_name"],
        ["is_program","is_program"],
        ["is_program_year"],
        ["province"],
        ["city"],
        ["is_minat"],
        ["peserta_pemilik_people"],
        ["peserta_pemilik_lahan"],
        ["peserta_pemilik_luas_lahan"],
        ["peserta_penggarap_people"],
        ["peserta_penggarap_lahan"],
        ["peserta_penggarap_luas_lahan"],
        ["peserta_lain_people"],
        ["peserta_lain_lahan"],
        ["peserta_lain_luas_lahan"],
        ["pattern"],
        ["pattern_new"],
        ["training1","training1"],
        ["training2"],
        ["suggestion"],
    ];
      // console.log("thi", detailData);

      for (const keyArr of keys) {
        if (keyArr[0] !== "trees"
         && keyArr[0] !== "training"
         && keyArr[0] !== "pattern"
         && keyArr[0] !== "lahan_legal_status"
         && keyArr[0] !== "pattern_new") {
          this.$set(
            this.formData,
            keyArr[0],
            keyArr.length > 1 ? this.data[keyArr[1]] : this.data[keyArr[0]]
          );
          if (keyArr.length > 2) {
            this.$set(this.formData, keyArr[2], this.data[keyArr[2]]);
          }
        } else if (keyArr[0] == "training") {
          let _training = [];
          if (this.data.training_materials_material_name && this.data.training_materials_material_name !== "-") {
            _training.push({
              material_no: this.data.training.split(',')[0] ?? null,
              material_name: this.data.training_materials_material_name,
            });
          }
          if (this.data.training_materials_material_name2 && this.data.training_materials_material_name2 !== "-") {
            _training.push({
              material_no: this.data.training.split(',')[1] ?? null,
              material_name: this.data.training_materials_material_name2,
            });
          }
          console.log("training", _training);
          this.$set(this.formData, "training", _training);
        } else if (keyArr[0] == "pattern") {
          if (this.data[keyArr[0]] != null) this.$set(this.formData, "pattern", this.data[keyArr[0]].split(','));
        } else if (keyArr[0] == "pattern_new") {
          if (this.data[keyArr[0]] != null) this.$set(this.formData, "pattern_new", this.data[keyArr[0]].split(','));
        } else if (keyArr[0] == "lahan_legal_status") {
          this.$set(this.formData, "lahan_legal_status", this.data[keyArr[0]].split(','));
        } else {
          let _tree = [];
          if (this.data.tree1 && this.data.tree1 !== "-") {
            _tree.push({
              tree_name: this.data.trees_tree_name_t1,
              tree_code: this.data.tree1,
            });
          }
          if (this.data.tree2 && this.data.tree2 !== "-") {
            _tree.push({
              tree_name: this.data.trees_tree_name_t2,
              tree_code: this.data.tree2,
            });
          }
          if (this.data.tree3 && this.data.tree3 !== "-") {
            _tree.push({
              tree_name: this.data.trees_tree_name_t3,
              tree_code: this.data.tree3,
            });
          }
          this.$set(this.formData, "trees", _tree);
        }
      }

      let existingTraining1 = [];
      for (const d of resTrainings.data.result.filter((x) => x.material_no == this.data.training1)) {
        existingTraining1.push({
          material_name: `${d.material_name}`,
          material_no: d.material_no,
        });
      }

      let existingTraining2 = [];
      for (const d of resTrainings.data.result.filter((x) => x.material_no == this.data.training2)) {
        existingTraining2.push({
          material_name: `${d.material_name}`,
          material_no: d.material_no,
        });
      }

      let existingMU = [];
      for (const d of resMUs.data.filter((x) => x.mu_no == this.data.mu_no)) {
        existingMU.push({
          name: `${d.name}`,
          mu_no: d.mu_no,
        });
      }

      let existingTA = [];
      for (const d of resTAs.data.result) {
        existingTA.push({
          name: `${d.name}`,
          area_code: d.area_code,
        });
      }

      let existingProvince = [];
      for (const d of resProvinces.data) {
        existingProvince.push({
          name: `${d.name}`,
          province_code: d.province_code,
        });
      }

      let existingKab = [];
      for (const d of resKabs.data) {
        existingKab.push({
          name: `${d.name}`,
          kabupaten_no: d.kabupaten_no,
        });
      }

      let existingDesa = [];
      for (const d of resDesas.data) {
        existingDesa.push({
          name: `${d.name}`,
          kode_desa: d.kode_desa,
        });
      }

      this.$set(this.formData, "training1", existingTraining1);
      this.$set(this.formData, "training2", existingTraining2);
      this.$set(this.formData, "mu_no", existingMU);
      this.$set(this.formData, "target_area", existingTA);
      this.$set(this.formData, "province", existingProvince);
      this.$set(this.formData, "city", existingKab);
      this.$set(this.formData, "village", existingDesa);
      this.ready = true;
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
  }, 
  }, 

  // computed: {
  //   defaultData() {
  //     return defaultData;
  //   },
  // },

  watch: {
    "formData.mu_no"(v) {
      // this.$set(this.formData, "target_area", null);
      // this.$set(this.formData, "village", null);
    },

    "formData.target_area"() {
      // this.$set(this.formData, "village", null);
    },

    "formData.village"(v) {
      if (!v) this.projectPurpose = null;
    },
    "formData.contact_type"(v) {
      if (v == 1) this.formData.contact_person = null;
    },
    "formData.is_program"(v) {
      if (!v) this.formData.is_program_year = null;
    },
    "formData.total_minat"(v) {
      if (v == 0) {
        this.formData.is_minat = null;
        this.formData.peserta_pemilik_people = null;
        this.formData.peserta_pemilik_lahan = null;
        this.formData.peserta_pemilik_luas_lahan = null;
        this.formData.peserta_penggarap_people = null;
        this.formData.peserta_penggarap_lahan = null;
        this.formData.peserta_penggarap_luas_lahan = null;
        this.formData.peserta_lain_people = null;
        this.formData.peserta_lain_lahan = null;
        this.formData.peserta_lain_luas_lahan = null;
      } else {
        this.formData.is_minat = 1;
      }
    },
    "formData.total_ragu"(v) {
      if (v == 0) {
        this.formData.is_ragu = null;
        this.formData.peserta_pemilik_people = null;
        this.formData.peserta_pemilik_lahan = null;
        this.formData.peserta_pemilik_luas_lahan = null;
        this.formData.peserta_penggarap_people = null;
        this.formData.peserta_penggarap_lahan = null;
        this.formData.peserta_penggarap_luas_lahan = null;
        this.formData.peserta_lain_people = null;
        this.formData.peserta_lain_lahan = null;
        this.formData.peserta_lain_luas_lahan = null;
      } else {
        this.formData.is_ragu = 1;
      }
    },
    "formData.lahan_legal_status"(v) {
      if (v != 4) this.formData.lahan_legal_status_others = null;
    },
    "formData.entry_data_position"(v) {
      if (v != 3) this.formData.position_others = null;
    },
    "formData.people_status"(v) {
      if (v != 3) this.formData.group_name = null;
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
        total_minat: 0,
        total_ragu: 0,
        program_year: "2025",
        contact_type: 1,
        list_tree: [],
        lahan_legal_status: [],
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
