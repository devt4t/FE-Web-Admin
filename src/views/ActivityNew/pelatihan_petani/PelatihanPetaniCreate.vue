<template>
  <v-card class="px-7">

    <div class="list-header py-3 mt-1">
    </div>

    <v-row class="mb-4">
      <v-col md="12">
        <div class="form-stepper-header">
          <div class="form-stepper-header-item" :class="{
            active: form === 1,
          }">
            <span class="value">1</span>
            <span class="label">Main Data</span>
          </div>

          <div class="form-stepper-header-splitter">
            <span></span>
          </div>
          <div class="form-stepper-header-item" :class="{
            active: form === 2,
          }">
            <span class="value">2</span>
            <span class="label">Peserta</span>
          </div>

          <div class="form-stepper-header-splitter">
            <span></span>
          </div>
          <div class="form-stepper-header-item" :class="{
            active: form === 3,
          }">
            <span class="value">3</span>
            <span class="label">Foto Absensi &amp; Dokumentasi</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }" v-show="form === 1" class="geko-form-wrapper">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col>
            <geko-input :disabled="true" v-model="formData.program_year" :item="{
              label: 'Tahun Program',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'program_year',
              option: {
                list_pointer: {
                  label: 'label',
                  code: 'code',
                  display: ['label'],
                },
                default_options: [
                  {
                    label: '2020',
                    code: 2020,
                  },
                  {
                    label: '2021',
                    code: 2021,
                  },
                  {
                    label: '2022',
                    code: 2022,
                  },
                  {
                    label: '2023',
                    code: 2023,
                  },
                  {
                    label: '2024',
                    code: 2024,
                  },
                  {
                    label: '2025',
                    code: 2025,
                  }
                ],
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.first_material" :item="{
              label: 'Materi Pelatihan 1',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              param: {},
              api: 'GetTrainingMaterials',
              setter: 'first_material',
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
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.mu_no" :disabled="!formData.program_year" :item="{
              label: 'Management Unit',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'mu_no',
              param: {
                page: 1,
                per_page: 10,
              },
              api: 'new-utilities/management-units',
              default_label: formData.mu_no,
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'mu_no',
                  label: 'name',
                  display: ['name', 'mu_no'],
                },
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.second_material" :item="{
              label: 'Materi Pelatihan 2',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              param: {},
              api: 'GetTrainingMaterials',
              setter: 'second_material',
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
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.target_area" :disabled="!formData.program_year || !formData.mu_no" :item="{
              label: 'Target Area',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'target_area',
              param: {
                page: 1,
                per_page: 10,
                program_year: formData.program_year,
                mu_no: formData.mu_no
              },
              api: 'new-utilities/target-areas',
              default_label: formData.target_area,
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'area_code',
                  label: 'name',
                  display: ['name', 'area_code'],
                  status: 1,
                  user_id: null,

                },
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.third_material"
              :disabled="!formData.first_material || !formData.second_material" :item="{
                label: 'Materi Pelatihan 3',
                col_size: 6,
                type: 'select',
                param: {},
                api: 'GetTrainingMaterials',
                setter: 'third_material',
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
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.village"
              :disabled="!formData.program_year || !formData.mu_no || !formData.target_area" :item="{
                label: 'Desa',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                api: 'village/dataset',
                param: {
                  area_code: formData.target_area
                },
                setter: 'village',
                option: {
                  getterKey: 'data',
                  list_pointer: {
                    label: 'desas_name',
                    code: 'kode_desa',
                    display: ['desas_name', 'kode_desa'],
                  },
                },
              }" @selected="handleOnSelectDesa($event)" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.training_date" :item="{
              label: 'Tanggal Pelatihan',
              validation: ['required'],
              col_size: 6,
              type: 'date',
              setter: 'date',
            }" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-if="allFFByDesa.length > 0" v-model="formData.ff_additional" :disabled="!formData.program_year || !formData.mu_no || !formData.target_area
              || !formData.village || !farmerByAllFF.size
              " :item="{
                label: 'Field Facilitator Aktif',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                setter: 'ff_additional',
                option: {
                  multiple: true,
                  list_pointer: {
                    label: 'field_facilitators_name',
                    code: 'ff_no',
                    display: ['field_facilitators_name', 'ff_no'],
                  },
                  default_options: allFFByDesa
                },
              }" @selected="setFarmerBySelectedFF" @deselected="unsetFarmerBySelectedFF" />
          </v-col>
          <v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.unit_manager" :disabled="!formData.program_year || !formData.mu_no || !formData.target_area
              || !formData.village || !formData.ff_additional" :item="{
                label: 'Unit Manager',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                api: 'GetEmployeebyPosition',
                param: {
                  position_code: '20'
                },
                setter: 'unit_manager',
                option: {
                  getterKey: 'data.result.data',
                  list_pointer: {
                    label: 'name',
                    code: 'nik',
                    display: ['name'],
                  },
                },
              }" />
          </v-col>
          <v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.fc_additional" :disabled="!formData.program_year || !formData.mu_no || !formData.target_area
              || !formData.village || !formData.ff_additional || !formData.unit_manager" :item="{
                label: 'Field Coordinator',
                validation: ['required'],
                col_size: 6,
                api: 'GetEmployeebyManager',
                param: {
                  manager_code: formData.unit_manager
                },
                type: 'select',
                setter: 'fc_additional',
                option: {
                  multiple: true,
                  getterKey: 'data.result.data',
                  list_pointer: {
                    label: 'name',
                    code: 'nik',
                    display: ['name', 'fc_no'],
                  },
                },
              }" />
          </v-col>
          <v-col>
          </v-col>
        </v-row>
        <v-col md="12">
          <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
            <v-btn variant="light" @click="$router.go(-1)" class="mr-3">Batal</v-btn>
            <v-btn type="submit" variant="success" :disabled="loading">
              <v-icon>mdi-chevron-right</v-icon>
              <span>Selanjutnya</span>
            </v-btn>
          </div>
        </v-col>
      </form>
    </ValidationObserver>

    <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }" v-show="form === 2" class="geko-form-wrapper">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Tambah Peserta Pelatihan Dari Desa {{ selectedDesaName }}</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-for="(ff, name, key) in farmerBySelectedFF">
              <div :style="{ display: isActive === name ? 'block' : 'none' }" class="list-search-wrapper">
                <v-icon class="prepend">mdi-magnify</v-icon>
                <input v-model="ff.search" type="text" :placeholder="'Cari petani'" />
                <v-icon v-if="typeof ff.search == 'string' && ff.search.length > 0" @click="ff.search = ''
                  " class="append">mdi-close</v-icon>
              </div>
            </div>

            <!-- <div class="statistics mb-3">
              <div class="statistic-item light">
                <v-icon>mdi-list-status</v-icon>
                <div class="statistic-data">
                  <p class="mb-0 label">Total Peserta Terpilih</p>
                  <p class="mb-0 value">{{ totalSelectedPeserta }}</p>
                </div>
              </div>
            </div> -->

            <div style="display: inline-block; margin: 0px 10px 10px 0px" v-for="(ff, name, key) in farmerBySelectedFF">
              <v-btn :variant="isActive === name ? 'success' : 'light'" @click="isActive = name">{{
                ff.field_facilitators_name }}
                <v-badge small v-if="ff.selectedFarmers.length" color="primary" :content="ff.selectedFarmers.length"
                  inline></v-badge>
              </v-btn>
            </div>

            <div :style="{ display: isActive === name ? 'block' : 'none', margin: '0px 10px 10px 0px' }"
              v-for="(ff, name, key) in farmerBySelectedFF">
              <v-data-table class="elevation-1" :items="ff.farmers" :headers="farmerTable.header" :search="ff.search"
                show-select disable-sort item-key="idTblPetani" v-model="ff.selectedFarmers"
                :items-per-page="ff.itemPerPage" :page="ff.page" :footer-props="{
                  itemsPerPageText: 'Jumlah Data Per Halaman',
                  itemsPerPageOptions: [5, 10, 25, 40, -1],
                }" @update:page="($p) => (page = $p)" @update:items-per-page="($p) => (itemPerPage = $p)">

                <template v-slot:item.no="{ index }">
                  {{ ++index }}
                </template>

                <template v-slot:item.photo="{ item }">
                  <v-avatar color="secondary" size="30" class="my-1 cursor-pointer" @click="() => {
                    // show bigger image | Lightbox
                  }
                    ">
                    <img :src="`${$store.state.apiUrlImage}Uploads/fphoto_${item.nik}.jpg`"
                      :alt="`Foto petani ${item.nama}`" />
                  </v-avatar>
                </template>

                <template v-slot:item.no_petani="{ item }">
                  <div class="center-horizontally">
                    {{ item.kode }}
                  </div>
                </template>


              </v-data-table>
            </div>

          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input :item="{
              label: 'Tambah Petani Lain',
              col_size: 6,
              type: 'select',
              api: 'GetFarmerAllAdmin',
              param: {
                typegetdata: 'all',
                mu: formData.mu_no,
                ta: formData.target_area
              },
              key: 'selectPetaniLain',
              option: {
                getterKey: 'data.result.data',
                list_pointer: {
                  label: 'nama',
                  code: 'kode',
                  display: ['nama', 'kode'],
                },
                // default_options: allFarmerByMUandTA
              },
            }" @selected="handleSelectedOtherFarmer" />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Peserta Umum</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="village-person-list">
              <v-row v-for="(person, i) in formData.peserta_tambahan" :key="'persons-' + i">
                <v-col md="1" class="index-wrapper">
                  <!-- <div class="index-wrapper"> -->
                  <div class="index">{{ i + 1 }}</div>
                  <!-- </div> -->
                </v-col>

                <v-col md="3">
                  <geko-input v-model="person.name" :item="{
                    label: 'Nama',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="2">
                  <geko-input v-model="person.address" :item="{
                    label: 'Alamat',
                    validation: ['required'],
                    type: 'text',
                  }" />
                </v-col>

                <v-col md="2">
                  <geko-input v-model="person.phone" :item="{
                    label: 'No HP/WA',
                    validation: ['required', 'phone'],
                    type: 'text',
                  }" />
                </v-col>
                <v-col md="2">
                  <geko-input v-model="person.gender" :item="{
                    label: 'Jenis Kelamin',
                    validation: ['required'],
                    type: 'select',
                    option: {
                      list_pointer: {
                        label: 'label',
                        code: 'label',
                        display: ['label'],
                      },
                      default_options: [
                        { label: 'Laki-laki' },
                        { label: 'Perempuan' },
                      ]
                    }
                  }" />
                </v-col>

                <v-col md="1" class="d-flex flex-column justify-content-center"
                  style="justify-content: center; align-items: flex-start">
                  <button type="button" @click="hapusPesertaUmum(i)">
                    <v-icon color="red">mdi-close</v-icon>
                  </button>
                </v-col>
              </v-row>

              <v-row>
                <v-col md="12">
                  <v-btn type="button" variant="primary" @click="tambahPesertaUmun">
                    <v-icon>mdi-plus</v-icon>
                    <span>Tambah Peserta Umum</span>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <v-col md="12">
          <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
            <v-btn variant="light" @click="form--" class="mr-3">Back</v-btn>
            <v-btn type="button" @click="handleNextButtonPage2" variant="success" :disabled="loading">
              <v-icon>mdi-chevron-right</v-icon>
              <span>Selanjutnya</span>
            </v-btn>
          </div>
        </v-col>
      </form>
    </ValidationObserver>

    <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }" v-show="form === 3" class="geko-form-wrapper">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col md="12" class="form-separator">
            <h4>Foto Absensi &amp; Dokumentasi</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn small href="https://www.iloveimg.com/compress-image" target="_blank"><v-icon left
                small>mdi-zip-box</v-icon> klik untuk kompres gambar</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12">
            <geko-input v-model="formData.absent" :item="{
              label: 'Foto Absensi Tertulis',
              validation: ['required'],
              type: 'upload',
              api: '/farmer-training/upload1.php',
              directory: 'absensi-images',
              upload_type: 'image/*',
              setter: 'absent',
              view_data: 'absent',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 0.5,
              },
            }" />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12">
            <geko-input v-model="formData.absent2" :item="{
              label: 'Foto Absensi Tertulis (2)',
              type: 'upload',
              api: '/farmer-training/upload1.php',
              directory: 'absensi-images',
              upload_type: 'image/*',
              setter: 'absent2',
              view_data: 'absent2',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 0.5,
              },
            }" />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12">
            <geko-input v-model="formData.dokumentasi" :item="{
              label: 'Foto Dokumentasi',
              validation: ['required'],
              type: 'upload',
              api: '/farmer-training/upload1.php',
              directory: 'documentation-photos',
              upload_type: 'image/*',
              setter: 'dokumentasi',
              view_data: 'dokumentasi',
              option: {
                label_hint:
                  'Klik gambar untuk memilih berkas yang akan diunggah',
                max_size: 0.5,
              },
            }" />
          </v-col>
        </v-row>
        <v-col md="12">
          <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
            <v-btn variant="light" @click="form--" class="mr-3">Back</v-btn>
            <v-btn type="submit" variant="success" :disabled="loading">
              <v-icon>mdi-chevron-right</v-icon>
              <span>Selanjutnya</span>
            </v-btn>
          </div>
        </v-col>
      </form>
    </ValidationObserver>

    <!-- Modals -->
    <modal-detail-petani :isOpen="isModalDetailOpened" :dataFarmer="selectedFarmerData"
      @addedOtherFarmer="handleAddedOtherFarmer" @batal="isModalDetailOpened = false"></modal-detail-petani>
    <!-- End Modals -->
  </v-card>
</template>

<script>
import ModalDetailPetani from './ModalDetailPetani.vue';

export default {
  name: "pelatihan-petani-create",
  components: { ModalDetailPetani },
  props: {
    user: {
      required: true,
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      allFFByDesa: [],
      isActive: null,
      form: 1,
      totalSelectedPeserta: 0,
      isModalDetailOpened: false,
      loading: false,
      selectedDesaName: '',
      farmers: [], // getFarmers()
      itemPerPage: 10,
      page: 1,
      peserta: [],
      selectedFarmerData: {},
      farmerByAllFF: new Map(),
      farmerBySelectedFF: new Object(),
      farmerTable: {
        header: [
          { text: "No", value: "no", align: 'center' },
          { text: "Foto", value: "photo", align: 'center' },
          { text: "No Petani", value: "kode", },
          { text: "Nama Petani", value: "nama", },
          { text: "Nama FF", value: "user", },
          { text: "NIK", value: "nik", },
        ],
      },
      formData: {
        organic_material: ["ORG22090001", "ORG22090002"],
        peserta_tambahan: [],
        status: 1,
        user_id: this.user.email,
        program_year: '2025',
        farmers: []
      }
    }
  },
  watch: {
    form(t) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    // 'formData.mu_no': function () {
    //   this.formData.target_area = null
    // },
    // 'formData.target_area': function () {
    //   this.formData.village = null
    // },
    // 'formData.village': function () {
    //   this.formData.ff_additional = null
    // },
    'formData.unit_manager': function () {
      this.formData.fc_additional = null
    },
    'formData.village': function (village) {
      this.resetSelectedFF()
      this.peserta = []
      this.getFarmers()
      // this.isTrainingCompletedInSelectedVillage(village)
    },
  },
  methods: {
    async getFarmers() {
      const farmers = await this.$_api.get('GetFarmerAllAdmin', {
        typegetdata: 'several',
        village: this.formData.village
      })
      this.farmers = farmers.data.result.data ?? [];
      this.farmerByAllFF = Map.groupBy(farmers.data.result.data, ({ ff_no }) => ff_no);
    },
    handleOnSelectDesa(value) {
      this.selectedDesaName = value.Desaname;
      this.allFFByDesa = [];
      // api: 'GetFFDesa_new',
      // param: {
      //   kode_desa: formData.village
      // },
      this.$_api.get('field-facilitator/dataset', {
        village_code: value.kode_desa,
        limit: 1000
      }).then(res => {
        this.$set(this, 'allFFByDesa', res.data);
        // this.allFFByDesa = res.data;
        console.log(this.allFFByDesa); 
      })
    },
    countTotalPeseerta() {
      let total = 0;
      for (const ff_no in this.farmerBySelectedFF) {
        total += this.farmerBySelectedFF[ff_no].selectedFarmers.length
      }
      return total;
    },
    onSubmit() {
      if (this.form < 3) {
        if (this.form === 2 && !this.countTotalPeseerta()) {
          return;
        }
        this.form++;
      } else {

        let ff_selected_farmer = [];

        for (let ff_no in this.farmerBySelectedFF) {
          if (this.farmerBySelectedFF[ff_no].selectedFarmers.length) {
            console.log('farmerBySelectedFF ', this.farmerBySelectedFF[ff_no].selectedFarmers);
            ff_selected_farmer.push(ff_no)
            
            for (let selectedFarmerKey in this.farmerBySelectedFF[ff_no].selectedFarmers) {
              this.formData.farmers.push({
                farmer_no: this.farmerBySelectedFF[ff_no].selectedFarmers[selectedFarmerKey].kode
              });
              console.log('selectedFarmers ', this.farmerBySelectedFF[ff_no].selectedFarmers[selectedFarmerKey]);
            }
          }
        }

        this.formData.ff_additional = ff_selected_farmer;

        this.$_api.post('AddFarmerTraining', this.formData)
          .then(response => {
            this.$router.go(-1);
            this.$refreshKey += 1;
            this.$_alert.success("Data pelatihan petani berhasil ditambahkan");
          }).catch(err => {
            this.formData.farmers = [];
            this.$_alert.error("Terjadi kesalahan saat menambahkan data pelatihan petani"); 
          });
      }
    },
    handleSelectedOtherFarmer(farmer) {
      this.selectedFarmerData = farmer;
      this.isModalDetailOpened = true;
    },
    handleAddedOtherFarmer(farmer) {
      this.isModalDetailOpened = false;
      farmer.nama = farmer.nama.split(' - ')[0];

      /*
      sudah ada ditabel && sudah jadi peserta = prevent
      sudah ada ditabel && belum jadi peserta = push peserta
      belum ada ditabel && belum jadi peserta = push farmers (tabel) & push peserta
      */

      if (!Object.keys(this.farmerBySelectedFF).includes(farmer.ff_no)) {
        this.$set(this.farmerBySelectedFF, farmer.ff_no, {
          field_facilitators_name: farmer.user,
          farmers: [farmer],
          selectedFarmers: [farmer],
          search: ''
        });
        this.$_alert.success(`${farmer.nama} - ${farmer.kode}`, `Berhasil menambahkan peserta`, 'top-right', false, 1500);
      } else {
        if (
          this.farmerBySelectedFF[farmer.ff_no].selectedFarmers.some(
            peserta => peserta.idTblPetani === farmer.idTblPetani)
          && this.farmerBySelectedFF[farmer.ff_no].farmers.some(
            petani => petani.idTblPetani === farmer.idTblPetani)
        ) {
          this.$_alert.error('', `${farmer.nama}`, `Sudah menjadi peserta`);
          return
        } else if (
          this.farmerBySelectedFF[farmer.ff_no].farmers.some(
            petani => petani.idTblPetani === farmer.idTblPetani)
        ) {
          this.farmerBySelectedFF[farmer.ff_no].selectedFarmers.push(farmer)
          this.$_alert.success(`${farmer.nama} - ${farmer.kode}`, `Berhasil menambahkan peserta`, 'top-right', false, 1500);
        } else {
          this.farmerBySelectedFF[farmer.ff_no].farmers.push(farmer)
          this.farmerBySelectedFF[farmer.ff_no].selectedFarmers.push(farmer)
          this.$_alert.success(`${farmer.nama} - ${farmer.kode}`, `Berhasil menambahkan peserta`, 'top-right', false, 1500);
        }
      }




    },
    hapusPesertaUmum(i) {
      this.formData.peserta_tambahan.splice(i, 1);
    },
    tambahPesertaUmun() {
      this.formData.peserta_tambahan.push({
        name: "",
        address: "",
        phone: "",
        gender: "",
      });
    },
    // isTrainingCompletedInSelectedVillage(village) {
    //   // 
    // },
    setFarmerBySelectedFF(ff) {
      const FF = ff[ff.length - 1]
      this.$set(this.farmerBySelectedFF, FF.ff_no, {
        field_facilitators_name: FF.field_facilitators_name.split(' - ')[0],
        farmers: this.farmerByAllFF.get(FF.ff_no),
        selectedFarmers: [],
        search: ''
      });
    },
    unsetFarmerBySelectedFF(ff) {
      this.$delete(this.farmerBySelectedFF, ff.ff_no);
    },
    resetSelectedFF() {
      this.farmerByAllFF.clear()
      this.farmerBySelectedFF = new Object()
      this.formData.ff_additional = []
    },
    handleNextButtonPage2(){
      let emptyForm = 0;
      for (const key in this.formData.peserta_tambahan) {
        if (this.formData.peserta_tambahan[key].name == '' || this.formData.peserta_tambahan[key].address == '' || this.formData.peserta_tambahan[key].phone == '' || this.formData.peserta_tambahan[key].gender == '') {
          emptyForm++;
        }
      }
      
      if (!emptyForm) this.form++;
    }
  },
}
</script>