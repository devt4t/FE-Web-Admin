<template>
  <div class="program-soc-form">
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row lg="12" class="px-5 py-5">

          <v-col md="12" class="form-separator">
            <h4>Data Umum</h4>
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.project_no" :item="{
              label: 'Kode/Nama Projek',
              validation: ['required'],
              type: 'select',
              setter: 'project_no',
              api: 'GetProjectAllAdmin',
              param: {
                limit: 100,
                offset: 0,
              },
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'project_no',
                  label: 'project_name',
                  display: ['project_no', 'project_name'],
                },
              },
            }" />
          </v-col>

          <v-col lg="6">
            <geko-input v-model="formData.date_distribution" :item="{
              label: 'Tanggal Distribusi',
              validation: ['required'],
              col_size: 6,
              type: 'date',
            }" />
          </v-col>

          <v-col>
            <geko-input v-model="formData.data_distribution" :item="{
              label: 'Distribusi Data',
              validation: ['required'],
              type: 'select',
              setter: 'general-land/distribution-event/list',
              api: 'general-land/distribution-event/list',
              placeholder: 'Dibuat Oleh - Nama PIC - Lokasi Nursery',
              param: {
                code_custom_project: formData.project_no,
                date_distribution: formData.date_distribution,
                limit: 100,
                offset: 0,
              },
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'id',
                  label: 'rel_created_by',
                  display: ['rel_created_by', 'rel_pic_id', 'rel_location_nursery_id'],
                },
              },
            }" :disabled="!formData.project_no || !formData.date_distribution" />
          </v-col>

          <v-col lg="6">
            <geko-input :disabled="!formData.data_distribution || !formData.project_no || !formData.date_distribution"
              v-model="formData.lahan_no" :item="{
                label: 'No. Lahan',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'lahan_no',
                api: 'lahan-umum/planting-hole/list',
                param: {
                  project_no: formData.project_no,
                  distribution_date: formData.date_distribution,
                  limit: 100,
                  offset: 0,
                },
                option: {
                  getterKey: 'result',
                  list_pointer: {
                    code: 'lahan_no',
                    label: 'lahan_no',
                    display: ['lahan_no', 'pic_lahan'],
                  },
                },
              }" @selected="onSelectedLahan($event)" />
          </v-col>

          <v-col lg="6">
            <geko-input :disabled="!formData.lahan_no" v-model="formData.lahan_condition" :item="{
              label: 'Kondisi Lahan',
              validation: ['required'],
              col_size: 6,
              type: 'text',
            }" />
          </v-col>

          <!-- Foto Dokumentasi -->
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
          <!-- end foto dokumentasi -->

          <!-- editan ku -->
          <!-- === start === -->
          <!-- ========== SECTION: DATA BIBIT ========== -->
          <v-col md="12" class="form-separator">
            <div class="d-flex align-items-center">
              <h4 class="mb-0">Data Bibit</h4>
              <v-chip v-if="hasSeeds" small class="ml-3" :color="isValidSeedInput ? 'success' : 'error'">
                {{ totalInputSeeds }} / {{ totalDistributedSeeds }}
              </v-chip>
            </div>
          </v-col>

          <v-col md="12"
            v-if="!formData.lahan_no || !formData.data_distribution || !formData.project_no || !formData.date_distribution">
            <div class="d-flex align-items-center">
              <v-alert type="info" outlined>
                Silahkan pilih No Lahan terlebih dahulu!
              </v-alert>
            </div>
          </v-col>

          <!-- Loading Seeds -->
          <v-col md="12" v-if="isDistributionSelected && loadingSeeds">
            <v-skeleton-loader type="card" />
          </v-col>

          <!-- Empty Seeds -->
          <v-col md="12" v-else-if="isDistributionSelected && !hasSeeds">
            <v-alert type="warning" outlined>
              Tidak ada data bibit untuk distribusi ini.
            </v-alert>
          </v-col>

          <!-- Expansion Panels untuk tiap bibit -->
          <v-col md="12" v-else-if="isDistributionSelected && hasSeeds">
            <v-expansion-panels focusable multiple>
              <v-expansion-panel v-for="(seed, index) in distributionSeeds" :key="seed.tree_code || index" class="mb-3">
                <!-- Header -->
                <v-expansion-panel-header>
                  <div class="d-flex justify-space-between align-center" style="width: 100%;">
                    <div>
                      <strong>{{ seed.tree_name }}</strong>
                      <span class="text--secondary ml-2">({{ seed.tree_code }})</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-chip small :color="getSeedStatusColor(seed)" class="mr-2">
                        {{ getTotalInputPerSeed(seed) }} / {{ seed.amount }}
                      </v-chip>
                      <v-icon v-if="isSeedOverLimit(seed)" color="error" small>
                        mdi-alert-circle
                      </v-icon>
                    </div>
                  </div>
                </v-expansion-panel-header>

                <!-- Content -->
                <v-expansion-panel-content class="pt-4">
                  <!-- Error -->
                  <v-alert v-if="isSeedOverLimit(seed)" type="error" dense class="mb-4">
                    Total input ({{ getTotalInputPerSeed(seed) }}) melebihi jumlah bibit ({{ seed.amount }})!
                  </v-alert>

                  <!-- SUDAH DITANAM -->
                  <v-card outlined class="pa-4 mb-4">
                    <div class="d-flex align-center mb-3">
                      <v-icon color="success" class="mr-2">mdi-sprout</v-icon>
                      <h5 class="mb-0">Sudah Ditanam</h5>
                      <v-chip small class="ml-auto" color="success" outlined>
                        Total: {{ getTotalPlanted(seed) }}
                      </v-chip>
                    </div>

                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field v-model.number="seed.planted_alive" label="Hidup" type="number" min="0" outlined
                          dense prepend-inner-icon="mdi-check-circle" />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-model.number="seed.planted_dead" label="Mati" type="number" min="0" outlined
                          dense prepend-inner-icon="mdi-close-circle" />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-model.number="seed.planted_missing" label="Hilang" type="number" min="0"
                          outlined dense prepend-inner-icon="mdi-help-circle" />
                      </v-col>
                    </v-row>
                  </v-card>

                  <!-- BELUM DITANAM -->
                  <v-card outlined class="pa-4">
                    <div class="d-flex align-center mb-3">
                      <v-icon color="warning" class="mr-2">mdi-package-variant</v-icon>
                      <h5 class="mb-0">Belum Ditanam</h5>
                      <v-chip small class="ml-auto" color="warning" outlined>
                        Total: {{ getTotalNotPlanted(seed) }}
                      </v-chip>
                    </div>

                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field v-model.number="seed.not_planted_alive" label="Hidup" type="number" min="0"
                          outlined dense prepend-inner-icon="mdi-check-circle" />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-model.number="seed.not_planted_dead" label="Mati" type="number" min="0" outlined
                          dense prepend-inner-icon="mdi-close-circle" />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-model.number="seed.not_planted_missing" label="Hilang" type="number" min="0"
                          outlined dense prepend-inner-icon="mdi-help-circle" />
                      </v-col>
                    </v-row>
                  </v-card>

                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>

          <!-- SUMMARY -->
          <v-col md="12" v-if="hasSeeds">
            <v-card outlined class="pa-4">
              <h5 class="mb-3">Ringkasan Input</h5>
              <v-simple-table dense>
                <tbody>
                  <tr>
                    <td>Total Bibit</td>
                    <td class="text-right"><strong>{{ totalDistributedSeeds }}</strong></td>
                  </tr>
                  <tr>
                    <td>Total Input</td>
                    <td class="text-right">
                      <strong :class="isValidSeedInput ? 'success--text' : 'error--text'">
                        {{ totalInputSeeds }}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td class="text-right">
                      <v-chip small :color="isValidSeedInput ? 'success' : 'error'">
                        {{ isValidSeedInput ? 'Valid ✓' : 'Melebihi Batas ✗' }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>


          <v-col lg="12">
            <div class="d-flex flex-row" style="justify-content: flex-end">
              <v-btn variant="success" type="submit" :disabled="loading || !canSubmit">
                <!-- :disabled="loading || (formData.total_minat == 0 && formData.total_ragu == 0)" -->
                <v-icon v-if="!loading">mdi-plus</v-icon>
                <v-progress-circular v-else indeterminate size="20" class="mr-2" />
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
    /**
     * todo: editanku
     * Handler ketika lahan dipilih - ambil data bibit dari detail
     */
    // ==start==
    async onSelectedLahan(lahan) {
      console.log('Lahan dipilih:', lahan);

      if (!lahan || !lahan.id) {
        this.distributionSeeds = [];
        return;
      }

      this.loadingSeeds = true;

      try {
        // Fetch detail untuk dapat data bibit
        const response = await this.$_api.get('general-land/distribution-event/detail', {
          id: this.formData.data_distribution,
        });

        console.log('Detail lahan response:', response);
        console.log('Detail distribusi response:', response);

        // Cek dulu field apa yang berisi data bibit
        const seedData = response.data?.detail_custom_allocation_seeds || [];

        // map untuk menggabungkan bibit dengan nama yang sama
        const seedMap = new Map()

        // loop data bibit dan gabungkan data
        seedData.forEach(seed => {
          const key = seed.tree_code

          if (seedMap.has(key)) {
            // jika bibit sudah ada di Map tambahkan jumlahnya
            const existing = seedMap.get(key)
            existing.amount += Number(seed.amount || 0)
          } else {
            // jika bibit belum ada buat entry baru
            seedMap.set(key, {
              tree_code: seed.tree_code,
              tree_name: seed.rel_tree_id,
              tree_id: seed.tree_id,
              amount: Number(seed.amount || 0),

              // Input user - Sudah Ditanam
              planted_alive: 0,
              planted_dead: 0,
              planted_missing: 0,

              // Input user - Belum Ditanam
              not_planted_alive: 0,
              not_planted_dead: 0,
              not_planted_missing: 0,
            })
          }
        })

        // convert map ke array
        this.distributionSeeds = Array.from(seedMap.values())

        console.log('Seed data yang sudah digabungkan: ', this.distributionSeeds)

        // // Transform ke format yang dibutuhkan
        // this.distributionSeeds = seedData.map(seed => ({
        //   // Data dari API (read-only)
        //   tree_code: seed.tree_code,
        //   tree_name: seed.rel_tree_id,
        //   tree_id: seed.tree_id,
        //   amount: Number(seed.amount || 0),

        //   // Input user - Sudah Ditanam
        //   planted_alive: 0,
        //   planted_dead: 0,
        //   planted_missing: 0,

        //   // Input user - Belum Ditanam
        //   not_planted_alive: 0,
        //   not_planted_dead: 0,
        //   not_planted_missing: 0,
        // }));

        // console.log('Seed data:', this.distributionSeeds);

      } catch (error) {
        console.error('Error fetching lahan detail:', error);
        this.$_alert.error('Gagal mengambil data bibit');
        this.distributionSeeds = [];
      } finally {
        this.loadingSeeds = false;
      }
    },
    // ==end==


    async onSubmit() {
      if (this.loading) return;

      this.loading = true;

      const endpoint =
        this.$route.query.view == "create"
          ? "CreateMonitoringLahanUmum"
          : "UpdateFormMinatCollective";

      console.log("Form submitted with data:", this.formData);

      // editanku
      // == start ==
      // Siapkan payload
      const payload = {
        ...this.formData,

        distribution_id: this.selectedDistribution?.id,

        // Transform data bibit ke format yang backend butuhkan
        list_trees: this.distributionSeeds.map(seed => ({
          tree_code: seed.tree_code,
          tree_name: seed.tree_name,
          // tree_category: seed.tree_category,
          // total_distributed: seed.total_distributed,
          amount: seed.amount,

          // Sudah Ditanam
          planted_alive: Number(seed.planted_alive || 0),
          planted_dead: Number(seed.planted_dead || 0),
          planted_missing: Number(seed.planted_missing || 0),

          // Belum Ditanam
          not_planted_alive: Number(seed.not_planted_alive || 0),
          not_planted_dead: Number(seed.not_planted_dead || 0),
          not_planted_missing: Number(seed.not_planted_missing || 0),
        })),
      };

      console.log("Payload to submit:", payload);

      try {
        await this.$_api.post(endpoint, payload);

        this.$_alert.success(
          `Data monitoring berhasil ${this.$route.query.view === "create" ? "ditambahkan" : "diperbarui"
          }`
        );

        this.$router.replace({ query: { view: "list" } });
      } catch (err) {
        console.error('Submit error:', err);
        this.$_alert.error(err);
      } finally {
        this.loading = false;
      }

      // == end ==

      // //insert main program soc
      // this.formData.list_trees = this.trees;
      // await this.$_api
      //   .post(endpoint, this.formData)
      //   .then((res) => {
      //     console.log("res", res);

      //     this.loading = false;
      //     this.$_alert.success(
      //       `Data monitoring berhasil ${this.$route.query.view === "create" ? "ditambahkan" : "diperbarui"
      //       }`
      //     );
      //     this.$router.replace({
      //       query: {
      //         view: "list",
      //       },
      //     });
      //     this.loading = false;
      //   })
      //   .catch((err) => {
      //     this.$_alert.error(err);
      //     return false;
      //   });

      // if (!resultMain) {
      //   this.loading = false;
      //   return;
      // }

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

        /**
         * todo: editanku
         */
        // == start ===
        project_no: null,
        date_distribution: null,
        data_distribution: null,
        // == end ==
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
      distributionSeeds: [],
      loadingSeeds: false,
      selectedDistribution: null,
    };
  },
};
</script>
