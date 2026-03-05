<template>
  <div class="lahan-umum-monitoring-create">
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
              setter: 'lahan_condition',
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

          <!-- Expansion Panels untuk tiap bibit -->
          <v-col md="12" v-if="isDistributionSelected && hasSeeds">
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
      default: true,
    },
  },


  methods: {
    /**
     * todo: editanku
     * Handler ketika lahan dipilih - ambil data bibit dari detail
     */
    // ==start==
    // helper method
    getTotalPlanted(seed) {
      return (seed.planted_alive || 0) + (seed.planted_dead || 0) + (seed.planted_missing || 0);
    },
    getTotalNotPlanted(seed) {
      return (seed.not_planted_alive || 0) + (seed.not_planted_dead || 0) + (seed.not_planted_missing || 0);
    },
    getTotalInputPerSeed(seed) {
      return this.getTotalPlanted(seed) + this.getTotalNotPlanted(seed);
    },
    isSeedOverLimit(seed) {
      return this.getTotalInputPerSeed(seed) > seed.amount;
    },
    getSeedStatusColor(seed) {
      if (this.isSeedOverLimit(seed)) return 'error';
      if (this.getTotalInputPerSeed(seed) === seed.amount) return 'success';
      return 'warning';
    },

    async onSelectedLahan(lahan) {
      this.distributionSeeds = [];

      if (!lahan?.id || !this.formData.data_distribution) {
        return;
      }

      this.loadingSeeds = true;

      try {
        const response = await this.$_api.get(
          'general-land/distribution-event/detail',
          { id: this.formData.data_distribution }
        );

        const seeds = response?.detail_custom_allocation_seeds ?? response.data?.detail_custom_allocation_seeds ?? [];

        const seedMap = seeds.reduce((map, seed) => {
          const existing = map.get(seed.tree_code);
          if (existing) {
            existing.amount += Number(seed.amount ?? 0);
          } else {
            map.set(seed.tree_code, {
              tree_code: seed.tree_code,
              tree_name: seed.rel_tree_id,
              tree_id: seed.tree_id,
              amount: Number(seed.amount ?? 0),
              planted_alive: 0, planted_dead: 0, planted_missing: 0,
              not_planted_alive: 0, not_planted_dead: 0, not_planted_missing: 0,
            });
          }
          return map;
        }, new Map());

        this.distributionSeeds = [...seedMap.values()];
        this.selectedDistribution = lahan;

      } catch (error) {
        console.error('[onSelectedLahan] Failed to fetch seed data:', error);
        this.$_alert.error('Gagal mengambil data bibit');
      } finally {
        this.loadingSeeds = false;
      }
    },
    // ==end==


    async onSubmit() {
      if (this.loading) return;

      this.loading = true;

      const endpoint =
        this.$route.query.view === "create"
          ? "CreateMonitoringLahanUmum"
          : "UpdateFormMinatCollective";

      console.log("Form submitted with data:", this.formData);

      // editanku
      // == start ==
      const payload = {
        ...this.formData,

        program_year: this.selectedDistribution?.program_year || new Date().getFullYear().toString(),
        planting_date: this.formData.date_distribution,

        mou_no: this.selectedDistribution?.mou_no,
        distribution_id: this.selectedDistribution?.id,

        list_trees: this.distributionSeeds.flatMap(seed => {
          const rows = [];
          const combinations = [
            { qty: seed.planted_alive, status: 'sudah_ditanam', condition: 'hidup' },
            { qty: seed.planted_dead, status: 'sudah_ditanam', condition: 'mati' },
            { qty: seed.planted_missing, status: 'sudah_ditanam', condition: 'hilang' },
            { qty: seed.not_planted_alive, status: 'belum_ditanam', condition: 'hidup' },
            { qty: seed.not_planted_dead, status: 'belum_ditanam', condition: 'mati' },
            { qty: seed.not_planted_missing, status: 'belum_ditanam', condition: 'hilang' },
          ];
          combinations.forEach(combo => {
            const qty = Number(combo.qty || 0);
            if (qty > 0) {
              rows.push({
                tree_code: seed.tree_code,
                tree_name: seed.tree_name,
                tree_id: seed.tree_id,
                qty: qty,
                status: combo.status,
                condition: combo.condition,
              })
            }
          })
          return rows;
        }),
      };
      // == end ==

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
    },
  },

  data() {
    return {
      loading: false,
      formData: {
        created_by: this.user.email,

        // editanku
        // == start ===
        project_no: null,
        date_distribution: null,
        data_distribution: null,
        lahan_condition: null,
        lahan_no: null,
        photo1: null,
        photo2: null,
        photo3: null,
      },
      distributionSeeds: [],
      loadingSeeds: false,
      selectedDistribution: null,
    };
  },
  // editanku => untuk memvalidasi form
  // ===start===
  computed: {
    isDistributionSelected() {
      return !!(this.formData.lahan_no && this.formData.data_distribution);
    },

    hasSeeds() {
      return this.distributionSeeds.length > 0;
    },

    totalDistributedSeeds() {
      return this.distributionSeeds.reduce((sum, s) => sum + (s.amount || 0), 0);
    },

    totalInputSeeds() {
      return this.distributionSeeds.reduce((sum, s) =>
        sum + this.getTotalInputPerSeed(s), 0
      );
    },

    isValidSeedInput() {
      return this.distributionSeeds.every(seed => !this.isSeedOverLimit(seed));
    },

    canSubmit() {
      return this.hasSeeds && this.isValidSeedInput && !this.loadingSeeds;
    }
  },

  watch: {
    'formData.project_no'() {
      // Reset semua field turunan ketika project berubah
      this.formData.date_distribution = null;
      this.formData.data_distribution = null;
      this.formData.lahan_no = null;
      this.distributionSeeds = [];
    },
    'formData.data_distribution'() {
      // Reset lahan ketika distribusi berubah
      this.formData.lahan_no = null;
      this.distributionSeeds = [];
    },
  }
  // ===end===

};
</script>
