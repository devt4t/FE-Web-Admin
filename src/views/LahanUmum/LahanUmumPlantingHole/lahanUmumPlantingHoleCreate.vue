<template>
  <v-card class="px-7">

    <div class="list-header py-3 mt-1">
    </div>
        <!-- Data Umum -->
        <v-row>
          <v-col class="d-flex" cols="12"sm="6">
            <v-select
              v-model="formData.lahan_no"
              :items="list_general_land"
              item-value="lahan_no"
              item-text="lahan_no"
              v-on:change="getSeedDetailData"
              label="Lahan Umum (Terverifikasi)"
              clearable
            >
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.lahan_no"></v-list-item-title>
                  <v-list-item-subtitle>{{ data.item.mou_no }} - {{ data.item.employees_name }}</v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-select>
          </v-col>
        </v-row>

        <!-- Data Lahan Umum -->
        <div class="list-header py-3 mt-1">
          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
              <h4>Data Penilikan Lubang Lahan Umum</h4>
          </div>
          <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar"></div>
          </div>
        </div>
        <v-row>
          <v-col>
            <geko-input v-model="formData.total_hole" :item="{
                label: 'Total Lubang',
                validation: ['required'],
                col_size: 6,
                type: 'number',
            }">
            </geko-input>
          </v-col>
          <v-col>
            <geko-input v-model="formData.qty_std_hole" :item="{
              label: 'Total Lubang Standar',
              validation: ['required'],
              col_size: 6,
              type: 'number',
            }" >
            </geko-input>
          </v-col>
        </v-row>
        <v-row>
          <!-- Seed Adjustment -->
          <v-col cols="12" sm="12">
              <v-data-table
                hide-default-footer
                :headers="seedAdjustment.headers"
                :items="seedAdjustment.items"
              >
              <template v-slot:top>
                    <div class="list-header py-3 mt-1">
                        <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                        <h4>Adjustment Bibit Lahan Umum</h4>
                        </div>
                        <div class="d-flex flex-row geko-list-header-action">
                        <div class="geko-list-header-toolbar"></div>
                        </div>
                    </div>

                    <div class="statistics mb-3">
                        <div :class="`statistic-item ${statisticConditionFormat('color')}`">
                          <v-icon>{{ statisticConditionFormat('icon') }}</v-icon>
                          <div class="statistic-data">
                              <p class="mb-0 label">Status Adjustment</p>
                              <p class="mb-0 value">{{ seedAdjustment.total_seed_amount ?? 0 }}</p>

                          </div>
                        </div>
                    </div>
                    </template>
                <template v-slot:item.index="{index}">{{ index+1 }}</template>
                
                <template v-slot:item.amount="{item, index}">
                    <v-row class="ma-0 align-center">
                        <v-text-field 
                            color="green"
                            dense
                            hide-details
                            outlined
                            append-icon="mdi-sprout"
                            rounded
                            style="max-width: 175px;"
                            type="number"
                            min="0"
                            v-model="seedAdjustment.items[index].amount"
                            @change="updateTotalSeedlingAdjustment"
                            @keyup="updateTotalSeedlingAdjustment"
                            @click="updateTotalSeedlingAdjustment"
                        ></v-text-field>
                    </v-row>
                </template>
                
              </v-data-table>
            </v-col>
          </v-row>
        <div class="list-header py-3 mt-1">
          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
              <h4>Foto Penilikan Lubang Lahan Umum</h4>
          </div>
          <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar"></div>
          </div>
          <v-col md="12">
            <geko-input v-model="formData.photo_near" :item="{
              label: 'Foto Dokumentasi Penilikan Lubang (Dekat)',
              type: 'upload',
              api: '/general-lands/planting-hole/upload.php',
              directory: 'photo',
              upload_type: 'image/*',
              setter: 'photo_near',
              view_data: 'photo_near',
              option: {
                label_hint:
                  'Klik untuk memilih berkas yang akan diunggah',
                max_size: 0.5,
              },
            }" />
          </v-col>
          <v-col md="12">
            <geko-input v-model="formData.photo_far" :item="{
              label: 'Foto Dokumentasi Penilikan Lubang (Jauh)',
              validation: ['required'],
              type: 'upload',
              api: '/general-lands/planting-hole/upload.php',
              directory: 'photo',
              upload_type: 'image/*',
              setter: 'photo_far',
              view_data: 'photo_far',
              option: {
                label_hint:
                  'Klik untuk memilih berkas yang akan diunggah',
                max_size: 0.5,
              },
            }" />
          </v-col>
        </div>
        <v-col md="12">
          <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
            <v-btn variant="light" @click="$router.go(-1)" class="mr-3">Batal</v-btn>
            <v-btn @click="onSubmit()" variant="success" :disabled="inputCondition()">
              <v-icon>mdi-check-bold</v-icon>
              <span>Input Data</span>
            </v-btn>
          </div>
        </v-col>
  </v-card>
</template>

<script>
import moment from "moment";

export default {
  name: "pelatihan-petani-create",
  components: {  },
  props: {
    user: {
      required: true,
      type: Object,
      default: {},
    },
    programYear: {
      required: true,
      type: String,
      default: 2025,
    }
  },
  data() {
    return {
      isActive: null,
      totalSelectedPeserta: 0,
      isModalDetailOpened: false,
      loading: false,
      itemPerPage: 10,
      page: 1,
      list_general_land: [],
      seedAdjustment:{
        headers: [
          { text: "No", value: "index", align: 'center' },
          { text: "Kode Pohon", value: "tree_code", align: 'center' },
          { text: "Nama Pohon", value: "tree_name", align: 'center' },
          { text: "Jumlah", value: "amount", align: 'center'},
          { text: "PIC Bibit", value: "pic_name", align: 'center'},
        ],
        items: [],
        total_seed_amount: 0
      },
      formData: {
        lahan_no: '',
        total_hole: 0,
        qty_std_hole: 0,
        photo_near: '',
        photo_far: '',
      }
    }
  },
  async mounted() {
    await this.firstAccessPage();
  },
  watch: {
    form(t) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    "formData.land_area": {
      handler(val) {
        this.formData.planting_area = Math.round(
          val * ((100 - this.formData.land_coverage) / 100)
        );
      },
    },
    "formData.land_coverage": {
      handler(val) {
        this.formData.planting_area = Math.round(
          this.formData.land_area * ((100 - val) / 100)
        );
      },
    },
    "formData.distribution_date": {
      handler(newVal) {
        if (newVal) {
          this.formData.surviellance_hole_date = moment(newVal).subtract(14,"days");
          this.formData.planting_date = moment(newVal).add(7, "days");
          this.formData.planting_date = dateFormat(this.formData.planting_date,"DD MMMM Y")
        }
      },
    },
  },
  methods: {
    async onSubmit() {
      console.log(this.formData);
      let KAYU = 0
      let MPTS = 0
      let CROPS = 0
      this.seedAdjustment.items.forEach(val => {
        if (val.tree_category == 'KAYU') KAYU += parseInt(val.amount)
        if (val.tree_category == 'MPTS') MPTS += parseInt(val.amount)
        if (val.tree_category == 'CROPS') CROPS += parseInt(val.amount)
      })
      let payload = {
        lahan_no: this.formData.lahan_no,
        total_holes: this.formData.total_hole,
        counter_hole_standard: this.formData.total_hole,
        pohon_kayu: KAYU,
        pohon_mpts: MPTS,
        tanaman_bawah: CROPS,
        photo_hole1: this.formData.photo_near,
        photo_hole2: this.formData.photo_far,
        tree_details: this.seedAdjustment.items
      }
      this.$_api.post('general-land/planting-hole/create', payload)
      .then(response => {
        this.$router.go(-1);
        this.$refreshKey += 1;
        this.$_alert.success("Berhasil Create Data Penilikan Lubang Lahan Umum / Event");
      }).catch(err => {
        this.$_alert.error({}, "Gagal Melakukan Create Data Penilikan Lubang Lahan Umum / Event");
      });
    },
    firstAccessPage() {
      this.BaseUrlGet = localStorage.getItem("BaseUrlGet");
      this.getGeneralLandOptions();
    },
    async getGeneralLandOptions(){
      let url = this.BaseUrlGet + `lahan-umum/planting-hole/option-verificated?program_year=${this.programYear}`;
      let resGeneralLand = await this.$_api.get(url);
      let res = 'tidak dapat memuat data'
      if(resGeneralLand){
        res = resGeneralLand.result
      } 
      this.list_general_land = res
    },
    
    async getSeedDetailData(){
      let url = this.BaseUrlGet + `GetDetailLahanUmum?lahan_no=${this.formData.lahan_no}`;
      let resTreeDetail = await this.$_api.get(url);
      let res = 'tidak dapat memuat data'
      if(resTreeDetail){
        res = resTreeDetail.data.result.DetailLahanUmum
      } 
      this.seedAdjustment.items = res

      this.updateTotalSeedlingAdjustment()
      // console.log(this.seedAdjustment.items)

    },
    updateTotalSeedlingAdjustment() {
      this.seedAdjustment.total_seed_amount = 0
      this.seedAdjustment.items.forEach(val => {
        this.seedAdjustment.total_seed_amount += parseInt(val.amount)
      })
    },
    statisticConditionFormat(type){
      
      if(type == 'color'){
        if(this.seedAdjustment.total_seed_amount > this.formData.total_hole)return 'danger'
        else return 'success'
      }
      if(type == 'icon'){
        if(this.seedAdjustment.total_seed_amount > this.formData.total_hole)return 'mdi-alert-minus'
        else return 'mdi-check-circle'
      }
    },
    inputCondition(){
      if(this.formData.lahan_no != '' && this.formData.total_hole > 0 && this.formData.photo_far != '' && this.formData.photo_near != '' && this.formData.qty_std_hole > 0 && this.seedAdjustment.items.length > 0) return false
      return true
    },
    dateFormat(date, format) {
      return moment(date).format(format);
    },
    

  },
}
</script>