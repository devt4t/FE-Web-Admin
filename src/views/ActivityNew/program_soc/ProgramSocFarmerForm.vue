<template>
  <div class="program-soc-form">
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form
        @submit.prevent="handleSubmit(onSubmit)"
        autocomplete="off"
        v-if="ready"
      >
        <v-row class="px-5 py-5">
          <v-col md="12">
            <div>
              <v-row>
                <v-col lg="6">
                  <geko-input
                    v-model="formData.name"
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
                    v-model="formData.status_program"
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
                <v-col lg="6" v-if="formData.status_program === 'Ya'">
                  <geko-input
                    v-model="formData.pattern"
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
                  v-if="['Ya', 'Ragu - Ragu'].includes(formData.status_program)"
                >
                  <geko-input
                    v-model="formData.training"
                    :item="{
                      label: 'Materi Pelatihan',
                      validation: ['required'],
                      type: 'select',
                      setter: 'training',
                      api: 'GetTrainingMaterials',
                      default_label: formData.training_materials_material_name,
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

                <v-col lg="6" v-if="['Ya'].includes(formData.status_program)">
                  <geko-input
                    v-model="formData.trees"
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
                    @selected="onSelectTree(formData.trees)"
                  />
                </v-col>

                <v-col md="6">
                  <geko-input
                    v-model="formData.photo"
                    :item="{
                      label: 'Foto Minat',
                      validation: ['required'],
                      type: 'upload',
                      api: 'sosialisasi_program/upload.php',
                      directory: 'photos',
                      upload_type: 'image/*',
                      setter: 'photo',
                      view_data: 'farmer_photo',
                      option: {
                        label_hint:
                          'Klik gambar untuk memilih berkas yang akan diunggah',
                        max_size: 5,
                        multiple: false,
                      },
                    }"
                  />
                </v-col>

                <v-col
                  lg="6"
                  v-if="
                    ['Ya'].includes(formData.status_program) &&
                    !['007', '019', '015', '008', '014', '016'].includes(muNo)
                  "
                >
                  <geko-input
                    v-model="formData.owned_land_legalization_status"
                    :item="{
                      validation: ['required'],
                      label: 'Status legalitas lahan yang dimiliki',
                      type: 'select-radio',
                      option: {
                        default_options: [
                          {
                            label:
                              'Sertifikat lahan atau Letter C atas nama sendiri',
                            code: 1,
                          },
                          {
                            label:
                              'Akte Jual Beli ata Letter C masih atas nama Orang Lain',
                            code: 2,
                          },
                          {
                            label:
                              'Lahan Waris atau Lahan Sewa atau Lahan Garapan',
                            code: 3,
                          },
                        ],
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
                    ['Ya'].includes(formData.status_program) &&
                    !['007', '019', '015', '008', '014', '016'].includes(muNo)
                  "
                >
                  <geko-input
                    v-model="formData.followed_project_model"
                    :item="{
                      validation: ['required'],
                      label: 'Model project yang akan diikuti',
                      type: 'select-radio',
                      option: {
                        default_options: [
                          {
                            label: 'Model 1 (Pohon Kayu untuk Ditebang)',
                            code: 1,
                          },
                          {
                            label:
                              'Model 2 - Pohon Kayu untuk Ditebang + Pohon Buah/MPTS',
                            code: 2,
                          },
                          {
                            label:
                              'Model 3 - Pohon Kayu dan Buah/MPTS tidak Ditebang',
                            code: 3,
                          },
                        ],
                        list_pointer: {
                          code: 'code',
                          name: 'name',
                          display: ['name'],
                        },
                      },
                    }"
                  />
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col lg="12">
            <div class="d-flex flex-row" style="justify-content: flex-end">
              <v-btn
                :variant="
                  $route.query.view === 'create' ? 'success' : 'warning'
                "
                type="submit"
                :disabled="loading"
              >
                <v-icon v-if="$route.query.view === 'create'">mdi-plus</v-icon>
                <v-icon v-if="$route.query.view === 'update'"
                  >mdi-pencil-minus</v-icon
                >
                <span
                  >{{
                    $route.query.view == "create" ? "Tambah" : "Perbarui"
                  }}
                  Petani</span
                >
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
  name: "program-soc-farmer-form",
  methods: {
    async onSubmit() {
      if (this.loading) return;
      this.loading = true;

      //validate master detail

      let _payload = this.formData;
      _payload.form_no = this.$route.query.form_code;
      if (Array.isArray(_payload.trees) && _payload.trees.length > 3) {
        this.$_alert.error(
          {},
          "",
          `Pohon yang dipilih tidak boleh lebih dari 3`
        );
        this.loading = false;
        return;
      }

      if (Array.isArray(_payload.trees)) {
        if (_payload.trees.length > 0) {
          _payload.tree1 =
            typeof _payload.trees[0] === "string"
              ? _payload.trees[0]
              : _payload.trees[0].tree_code;
        }

        if (_payload.trees.length > 1) {
          _payload.tree2 =
            typeof _payload.trees[1] === "string"
              ? _payload.trees[1]
              : _payload.trees[1].tree_code;
        }

        if (_payload.trees.length > 2) {
          _payload.tree3 =
            typeof _payload.trees[2] === "string"
              ? _payload.trees[2]
              : _payload.trees[2].tree_code;
        }

        delete _payload.trees;
      }
      //api call

      //insert farmers
      const endpoint =
        this.$route.query.view == "create"
          ? "AddFormMinatFarmers_new"
          : "UpdateFormMinatFarmers_new";
      if (this.$route.query.view == "update") {
        _payload.current_id = this.$route.query.id;
      }
      this.$_api
        .post(endpoint, _payload)
        .then(() => {
          this.loading = false;
          this.$_alert.success(
            `Data sosialisasi program berhasil ${
              this.$route.query.view === "create" ? "ditambahkan" : "diperbarui"
            }`
          );
          this.$router.go(-1);
        })
        .catch((err) => {
          this.$_alert.error(err);
        });
    },

    async initData() {
      const detailData = await this.$_api.get("GetFormMinatDetailFarmer_new", {
        id: this.$route.query.id,
      });

      // form_no: "",
      //   name: "",
      //   address: "",
      //   status_program: "",
      //   training: "",
      //   photo: "",
      //   trees: [],
      //   tree1: "",
      //   tree2: "",
      //   tree3: "",
      //   pattern: "",
      this.data = detailData.sprFarmer;
      this.muNo = this.$route.query.mu_no;

      const keys = [
        ["name"],
        ["pattern", "pattern"],
        ["status_program"],
        ["training", "training", "training_materials_material_name"],
        ["photo", "photo"],
        ["trees", "trees"],
        ["owned_land_legalization_status", "owned_land_legalization_status"],
        ["followed_project_model", "followed_project_model"],
      ];
      // console.log("thi", detailData);

      for (const keyArr of keys) {
        if (keyArr[0] !== "trees") {
          this.$set(
            this.formData,
            keyArr[0],
            keyArr.length > 1 ? this.data[keyArr[1]] : this.data[keyArr[0]]
          );

          if (keyArr.length > 2) {
            this.$set(this.formData, keyArr[2], this.data[keyArr[2]]);
          }
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

      this.ready = true;
    },

    onSelectTree(v) {
      if (
        Array.isArray(this.formData.trees) &&
        this.formData.trees.length > 2
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

  mounted() {
    if (this.$route.query.view === "update") {
      this.initData();
    } else {
      this.ready = true;
    }
  },

  computed: {
    defaultData() {
      return defaultData;
    },
  },

  data() {
    return {
      ready: false,
      loading: false,
      muNo: null,
      formData: {
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
        owned_land_legalization_status: "",
      },
    };
  },
};
</script>
