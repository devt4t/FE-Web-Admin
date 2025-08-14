<template>
  <div class="program-soc-form">
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row lg="12" class="px-5 py-5">
          <v-col md="12" class="form-separator">
            <h4>Tanggal Sosialisasi</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.form_date" :item="{
              label: 'Tanggal',
              validation: ['required'],
              type: 'date',
              setter: 'date',
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

          <v-col lg="6" >
            <geko-input v-model="formData.program_type" :item="{
              label: 'Project',
              validation: ['required'],
              type: 'select-radio',
              setter: 'formData.program_type',
              option: {
                list_pointer: {
                  label: 'label',
                  code: 'code',
                  display: ['label'],
                },
                default_options: [
                  {
                    label: 'Carbon',
                    code: 2,
                  },
                  {
                    label: 'Non Carbon',
                    code: 3,
                  },
                ],
              },
            }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Pengisi Form</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.name_entry_data" :item="{
              label: 'Nama Pengisi Form',
              validation: ['required'],
              type: 'text',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.gender" :item="{
              label: 'Jenis Kelamin',
              validation: ['required'],
              type: 'select',
              setter: 'gender',
              option: {
                default_options: [
                  {
                    name: 'Laki-laki',
                    value: 'Laki-laki',
                  },
                  {
                    name: 'Perempuan',
                    value: 'Perempuan',
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
            <geko-input v-model="formData.contact_type" :item="{
              label: 'Kontak',
              validation: ['required'],
              type: 'select',
              option: {
                default_options: [
                  {
                    name: 'Tidak Ada',
                    value: 1,
                  },
                  {
                    name: 'Telephone Rumah',
                    value: 2,
                  },
                  {
                    name: 'HP',
                    value: 3,
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
            <geko-input v-if="formData.contact_type != 1" v-model="formData.contact_person" :item="{
              label: 'Nomor Kontak',
              validation: ['required'],
              type: 'number',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.age" :item="{
              label: 'Umur',
              validation: ['required'],
              type: 'number',
            }" />
          </v-col> 

          <v-col lg="6">
            <geko-input v-model="formData.people_status" :item="{
              label: 'Merupakan Perwakilan Dari',
              validation: ['required'],
              type: 'select-radio',
              option: {
              list_pointer: {
                label: 'label',
                code: 'code',
                display: ['label'],
              },
              default_options: [
                {
                  label: 'Warga Desa',
                  code: 1,
                },
                {
                  label: 'Warga Dusun',
                  code: 2,
                },
                {
                  label: 'Kelompok Dalam Area',
                  code: 3,
                },
              ],
            }}" />
          </v-col>

          <v-col v-if="formData.people_status == 3" lg="6">
            <geko-input  v-model="formData.group_name" :item="{
              label: 'Nama Kelompok',
              validation: ['required'],
              type: 'text',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.entry_data_position" :item="{
              label: 'Jabatan / Posisi',
              validation: ['required'],
              type: 'select-radio',
              option: {
              list_pointer: {
                label: 'label',
                code: 'code',
                display: ['label'],
              },
              default_options: [
                {
                  label: 'Aparat Desa',
                  code: 1,
                },
                {
                  label: 'Tokoh Desa',
                  code: 2,
                },
                {
                  label: 'Lainnya',
                  code: 3,
                },
              ],
            }}" />
          </v-col>

          <v-col lg="6">
            <geko-input  v-model="formData.position_name" :item="{
              label: 'Nama Jabatan / Posisi ',
              validation: ['required'],
              type: 'text',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.is_program" :item="{
              label: 'Pernah Ada Kegiatan Organisasi Di Area Setempat?',
              validation: ['required'],
              type: 'select-radio',
              option: {
              list_pointer: {
                label: 'label',
                code: 'code',
                display: ['label'],
              },
              default_options: [
                {
                  label: 'Ya, Pernah',
                  code: 1,
                },
                {
                  label: 'Tidak Pernah',
                  code: 0,
                },
              ],
            }}" />
          </v-col>

          <v-col lg="6">
            <geko-input v-if="formData.is_program" v-model="formData.is_program_year" :item="{
              label: 'Pernah Ikut Program Tahun',
              validation: ['required'],
              type: 'select',
              option: {
              list_pointer: {
                label: 'label',
                code: 'code',
                display: ['label'],
              },
              default_options: [
                {
                  label: '2020',
                  code: '2020',
                },
                {
                  label: '2021',
                  code: '2021',
                },
                {
                  label: '2022',
                  code: '2022',
                },
                {
                  label: '2023',
                  code: '2023',
                },
                {
                  label: '2024',
                  code: '2024',
                },
              ],
            }}" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Lokasi Desa</h4>
          </v-col>


          <v-col lg="6">
            <geko-input v-model="formData.mu_no" :item="{
              label: 'Management Unit',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'mu_no',
              api: 'new-utilities/management-units',
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'mu_no',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input :disabled="!formData.mu_no" v-model="formData.target_area" :item="{
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
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.province" :disabled="!formData.program_year || !formData.target_area" :item="{
              label: 'Provinsi',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'province_code',
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

          <v-col lg="6">
            <geko-input v-model="formData.city" :disabled="!formData.program_year || !formData.province" :item="{
              label: 'Kota / Kabupaten',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'kabupaten_no',
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

          <v-col lg="6">
            <geko-input :disabled="!formData.city || !formData.program_year" v-model="formData.village" :item="{
              label: 'Desa',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'village',
              api: 'new-utilities/desas',
              param: {
                program_year: formData.program_year,
                kode_ta: formData.target_area,
              },
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'kode_desa',
                  label: 'name',
                  display: ['name'],
                },
              },
            }" @selected="onChangeVillage($event)" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Hasil Sosialisasi Program</h4>
          </v-col>
          
          <v-col lg="6">
            <geko-input v-model="formData.total_minat" :item="{
              label: 'Jumlah Peserta Yg Berminat',
              validation: ['required'],
              type: 'number',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.total_ragu" :item="{
              label: 'Jumlah Peserta Ragu - Ragu',
              validation: ['required'],
              type: 'number',
            }" />
          </v-col>

          <div v-if="formData.total_minat > 0">
          <v-col md="12" class="form-separator">
            <h4>Calon Peserta Dalam Area Yang Memiliki Lahan (Pemilik)</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.peserta_pemilik_people" :item="{
              label: 'Jumlah Peserta',
              validation: ['required'],
              type: 'number',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.peserta_pemilik_lahan" :item="{
              label: 'Jumlah Lahan',
              type: 'number',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.peserta_pemilik_luas_lahan" :item="{
              label: 'Total Luas Lahan (M²)',
              type: 'number',
            }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Calon Peserta Dalam Area Perwakilan Yg Merupakan Pengelola / Penggarap Lahan</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.peserta_penggarap_people" :item="{
              label: 'Jumlah Peserta',
              validation: ['required'],
              type: 'number',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.peserta_penggarap_lahan" :item="{
              label: 'Jumlah Lahan',
              type: 'number',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.peserta_penggarap_luas_lahan" :item="{
              label: 'Total Luas Lahan (M²)',
              type: 'number',
            }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <h4>Calon Peserta Dalam Area Perwakilan Yg Memiliki Status Lainnya Terhadap Lahan</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.peserta_lain_people" :item="{
              label: 'Jumlah Peserta',
              validation: ['required'],
              type: 'number',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.peserta_lain_lahan" :item="{
              label: 'Jumlah Lahan',
              type: 'number',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.peserta_lain_luas_lahan" :item="{
              label: 'Total Luas Lahan (M²)',
              type: 'number',
            }" />
          </v-col>
          </div>

          <v-col md="12" class="form-separator">
            <h4>Data Lahan</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.lahan_legal_status" :item="{
              label: 'Status Legalitas Lahan',
              type: 'select',
              option: {
              multiple: true,
              list_pointer: {
                label: 'label',
                code: 'code',
                display: ['label'],
              },
              default_options: [
                {
                  label: 'Sertifikat Lahan atau letter C atas nama Sendiri',
                  code: 1,
                },
                {
                  label: 'Akte Jual beli atau Letter C masih atas nama Orang Lain',
                  code: 2,
                },
                {
                  label: 'Lahan Waris atau Lahan Sewa atau Lahan Garapan',
                  code: 3,
                },
                {
                  label: 'Lainnya',
                  code: 4,
                },
              ],
            }}" />
          </v-col>

          <v-col lg="6">
            <geko-input v-if="formData.lahan_legal_status.includes(4)" v-model="formData.lahan_legal_status_others" :item="{
              label: 'Status Legalitas Lahan (Lainnya)',
              validation: ['required'],
              type: 'text',
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.pattern" :item="{
              label: 'Pola Tanam Sebelumnya',
              type: 'select',
              option: {
              multiple: true,
              list_pointer: {
                label: 'text',
                code: 'value',
                display: ['text'],
              },
              default_options: defaultData.planting_pattern,
            }}" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.pattern_new" :item="{
              label: 'Pola Tanam Yang Diminati',
              type: 'select',
              validation: ['required'],
              option: {
              multiple: true,
              list_pointer: {
                  label: 'text',
                code: 'value',
                display: ['text'],
              },
              default_options: [
                {
                  value: 'Agroforestry',
                  text: 'Agroforestry',
                },
                {
                  value: 'Konservasi',
                  text: 'Konservasi',
                },
              ],
            }}" />
          </v-col>

           

          <v-col md="12" class="form-separator">
            <h4>Materi Pelatihan</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.training1" :item="{
              label: 'Materi Pelatihan 1',
              col_size: 6,
              type: 'select',
              param: {},
              api: 'GetTrainingMaterials',
              setter: 'training1',
              // default_label: '',
              option: {
                getterKey: 'data.result',
                list_pointer: {
                  label: 'material_name',
                  code: 'material_no',
                  display: ['material_name'],
                },
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.training2" :item="{
              label: 'Materi Pelatihan 2',
              col_size: 6,
              type: 'select',
              param: {},
              api: 'GetTrainingMaterials',
              setter: 'training2',
              // default_label: '',
              option: {
                getterKey: 'data.result',
                list_pointer: {
                  label: 'material_name',
                  code: 'material_no',
                  display: ['material_name'],
                },
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.suggestion" :item="{
              label: 'Usulan Pengisi Data Untuk Trees4Trees',
              // validation: ['required'],
              type: 'textarea',
            }" />
          </v-col>

          <v-col md="12" class="form-separator">
            <div class="d-flex flex-row" style="align-items: center">
              <h4 class="mb-0 pb-0">Jenis Tanaman Yang Diminati Calon Peserta</h4>
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
                    }">{{ item.name || "Masukkan Data Tanaman" }}</span>
                    <div class="d-flex flex-row" style="justify-content: flex-end" v-if="trees.length > 1">
                      <button class="text-danger" @click="deleteRow(i)">
                        <v-icon class="text-danger">mdi-delete-empty</v-icon>
                      </button>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pt-4 pb-5">
                    <v-row>
                      <v-col lg="6">
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
    async onChangeVillage(data) {
      this.potentialStatus = data.scooping_visits_potential_status
      if ([2, 3].includes(this.potentialStatus)) {
        this.projectPurpose = data.scooping_visits_potential_status
      }
    },
    async onSubmit() {
      if (this.loading) return;
      this.loading = true;

      this.formData.list_tree = this.trees;
      this.formData.is_group_area = this.formData.people_status === 3 ? 1 : 0;
      console.log("Form submitted with data:", this.formData);
      //insert main program soc
      const resultMain = await this.$_api
        .post("AddFormMinatCollective", this.formData)
        .then((res) => {
          console.log("res", res);

          this.loading = false;
          this.$_alert.success("Data sosialisasi program berhasil ditambahkan");
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
        },
      ],
    };
  },
};
</script>
