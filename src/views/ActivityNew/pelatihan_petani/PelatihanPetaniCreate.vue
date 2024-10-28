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
            <span class="label">Data Lahan &amp; Dokumentasi</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }" v-show="form === 1" class="geko-form-wrapper">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col>
            <geko-input v-model="formData.program_year" :item="{
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
                  }
                ],
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.materi_1" :item="{
              label: 'Materi Pelatihan 1',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              param: {},
              api: 'GetTrainingMaterials',
              setter: 'materi_1',
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
            <geko-input v-model="formData.materi_2" :item="{
              label: 'Materi Pelatihan 2',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              param: {},
              api: 'GetTrainingMaterials',
              setter: 'materi_2',
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
            <geko-input v-model="formData.area_code" :disabled="!formData.program_year || !formData.mu_no" :item="{
              label: 'Target Area',
              validation: ['required'],
              col_size: 6,
              type: 'select',
              setter: 'area_code',
              param: {
                page: 1,
                per_page: 10,
                program_year: formData.program_year,
                mu_no: formData.mu_no
              },
              api: 'new-utilities/target-areas',
              default_label: formData.area_code,
              option: {
                getterKey: 'data',
                list_pointer: {
                  code: 'area_code',
                  label: 'name',
                  display: ['name', 'area_code'],
                },
              },
            }" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.materi_3" :disabled="!formData.materi_1 || !formData.materi_2" :item="{
              label: 'Materi Pelatihan 3',
              col_size: 6,
              type: 'select',
              param: {},
              api: 'GetTrainingMaterials',
              setter: 'materi_3',
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
            <geko-input v-model="formData.kode_desa"
              :disabled="!formData.program_year || !formData.mu_no || !formData.area_code" :item="{
                label: 'Desa',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                api: 'GetDesaFarmerTraining',
                param: {
                  area_code: formData.area_code
                },
                setter: 'kode_desa',
                option: {
                  getterKey: 'data.result',
                  list_pointer: {
                    label: 'Desaname',
                    code: 'kode_desa',
                    display: ['Desaname', 'kode_desa'],
                  },
                },
              }" @selected="setNamaDesa($event)" />
          </v-col>
          <v-col>
            <geko-input v-model="formData.date" :item="{
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
            <geko-input v-model="formData.ff_no" :disabled="!formData.program_year || !formData.mu_no || !formData.area_code
              || !formData.kode_desa
              " :item="{
                label: 'Field Facilitator Aktif',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                api: 'GetFFDesa',
                param: {
                  kode_desa: formData.kode_desa
                },
                setter: 'ff_no',
                option: {
                  getterKey: 'data.result',
                  list_pointer: {
                    label: 'FFname',
                    code: 'ff_no',
                    display: ['FFname', 'ff_no'],
                  },
                },
              }" />
          </v-col>
          <v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <geko-input v-model="formData.manager_code" :disabled="!formData.program_year || !formData.mu_no || !formData.area_code
              || !formData.kode_desa || !formData.ff_no" :item="{
                label: 'Unit Manager',
                validation: ['required'],
                col_size: 6,
                type: 'select',
                api: 'GetEmployeebyPosition',
                param: {
                  position_code: '20'
                },
                setter: 'manager_code',
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
            <geko-input v-model="formData.fc_no" :disabled="!formData.program_year || !formData.mu_no || !formData.area_code
              || !formData.kode_desa || !formData.ff_no || !formData.manager_code" :item="{
                label: 'Field Coordinator',
                validation: ['required'],
                col_size: 6,
                api: 'GetEmployeebyManager',
                param: {
                  manager_code: formData.manager_code
                },
                type: 'select',
                setter: 'fc_no',
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
            <div class="list-search-wrapper">
              <v-icon class="prepend">mdi-magnify</v-icon>
              <input v-model="search" type="text" :placeholder="'Cari petani'" />
              <v-icon v-if="typeof search == 'string' && search.length > 0" @click="search = ''
                " class="append">mdi-close</v-icon>
            </div>

            <div class="statistics mb-3">
              <div class="statistic-item light">
                <v-icon>mdi-list-status</v-icon>
                <div class="statistic-data">
                  <p class="mb-0 label">Total Peserta Terpilih</p>
                  <p class="mb-0 value">{{ peserta.length }}</p>
                </div>
              </div>
            </div>

            <v-data-table class="elevation-1" :items="farmers" :headers="farmerTable.header" :search="search"
              show-select disable-sort item-key="idTblPetani" v-model="peserta" :items-per-page="itemPerPage"
              :page="page" :footer-props="{
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
                ta: formData.area_code
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
      @addedOtherFarmer="handleAddedOtherFarmer"></modal-detail-petani>
    <!-- End Modals -->
  </v-card>
</template>

<script>
import ModalDetailPetani from './ModalDetailPetani.vue';

export default {
  name: "pelatihan-petani-create",
  components: { ModalDetailPetani },
  data() {
    return {
      form: 1,
      isModalDetailOpened: false,
      loading: false,
      selectedDesaName: '',
      farmers: [], // getFarmers()
      search: '',
      itemPerPage: 10,
      page: 1,
      peserta: [],
      selectedFarmerData: {},
      allFarmerByMUandTA: [],
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
      formData: {}
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
    //   this.formData.area_code = null
    // },
    // 'formData.area_code': function () {
    //   this.formData.kode_desa = null
    // },
    // 'formData.kode_desa': function () {
    //   this.formData.ff_no = null
    // },
    'formData.manager_code': function () {
      this.formData.fc_no = null
    },
    'formData.kode_desa': function (kode_desa) {
      this.peserta = []
      this.getFarmers()
      this.isTrainingCompletedForVilage(kode_desa)
    }
  },
  methods: {
    async getFarmers() {
      const farmers = await this.$_api.get('GetFarmerAllAdmin', {
        typegetdata: 'several',
        village: this.formData.kode_desa
      })

      this.farmers = farmers.data.result.data ?? [];
    },
    setNamaDesa(value) {
      this.selectedDesaName = value.Desaname;
    },
    onSubmit() {
      if (this.form < 3) {
        this.form++;
        return;
      }
    },
    handleSelectedOtherFarmer(farmer) {
      this.selectedFarmerData = farmer;
      this.isModalDetailOpened = true;
    },
    handleAddedOtherFarmer(farmer) {

      farmer.nama = farmer.nama.split(' - ')[0];

      /*
      sudah ada ditabel && sudah jadi peserta = prevent
      sudah ada ditabel && belum jadi peserta = push peserta
      belum ada ditabel && belum jadi peserta = push farmers & push peserta
      */

      if (
        this.peserta.some(
          peserta => peserta.idTblPetani === farmer.idTblPetani)
        && this.farmers.some(
          petani => petani.idTblPetani === farmer.idTblPetani)
      ) {
        this.$_alert.error('', `${farmer.nama}`, `Sudah menjadi peserta`);
        return
      } else if (
        this.farmers.some(
          petani => petani.idTblPetani === farmer.idTblPetani)
      ) {
        this.peserta.push(farmer)
        this.$_alert.success(`${farmer.nama} - ${farmer.kode}`, `Berhasil menambahkan peserta`, 'top-right', false, 1500);
      } else {
        this.farmers.push(farmer)
        this.peserta.push(farmer)
        this.$_alert.success(`${farmer.nama} - ${farmer.kode}`, `Berhasil menambahkan peserta`, 'top-right', false, 1500);
      }

    }
  },
  isTrainingCompletedForVilage(kode_desa) {
    // 
  }
}
</script>