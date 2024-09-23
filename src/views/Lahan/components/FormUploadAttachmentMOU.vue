<template>
  <div class="lahan-gis-verification">
    <div class="d-flex flex-row mb-3" style="justify-content: space-between">
      <p>Legal Land Category: <br>
        <v-btn 
          variant="info"
          class="px-5"
        >
        <b>{{ lahanData.farmers_legal_land_categories_pivot_farmer }}</b>
        </v-btn>
      </p>
      <v-btn
        small
        variant="primary"
        @click="$emit('close')"
      >
        <v-icon>mdi-file-eye-outline</v-icon>
        <span>Lihat MOU</span>
      </v-btn>
    </div>
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <template v-for="(input, i) in formInputs">
            <v-col v-if="input.show" :lg="preview ? 4 : 6" :key="`formInputAttach${i}`">
              <!-- input -->
              <geko-input
                v-if="!preview"
                v-model="formData[input.field]"
                :item="{
                  label: input.label,
                  validation: input.validation,
                  type: input.type,
                  setter: input.setter,
                  view_data: input.view_data,
                  api: input.api,
                  upload_type: input.upload_type,
                  directory: input.directory,
                  option: {
                    icon: 'mdi-file-outline',
                    label_hint:
                      'Klik untuk memilih file yang akan diunggah',
                  },
                }"
              />
              <!-- preview -->
              <div v-else
                id="preview-wrapper"
                @click="
                showLightbox(
                  $_config.baseUrlUpload + '/' + formData[input.field]
                )"
                :style="{
                backgroundImage:
                  'url(' +
                  $_config.baseUrlUpload +
                  '/' +
                  formData[input.field] +
                  ')',
                }"
              >
                <h5>{{ input.label }}</h5>
              </div>
            </v-col>
          </template>

          <v-col lg="12">
            <v-btn
              v-if="!preview"
              type="submit"
              variant="success"
              class="w-100"
              style="width: 100%"
              :disabled="loading"
            >
              <v-icon>mdi-content-save-outline</v-icon>
              <span>Simpan</span>
            </v-btn>
            <v-btn
              v-else
              type="button"
              @click="lastVerification()"
              variant="success"
              class="w-100"
              style="width: 100%"
              :disabled="loading || mouData.mou_status == 5"
            >
              <v-icon>mdi-check-decagram-outline</v-icon>
              <span>{{ mouData.mou_status == 5 ? 'Sudah' : '' }}Verifikasi Data</span>
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>

export default {
  name: 'FormUploadAttachmentMOU',

  props: {
    lahanData: {
      required: true,
    },
    mouData: {
      default: null,
      required: false,
    },
    preview: {
      default: false,
    },
  },
  
  methods: {
    lastVerification: async function () {
      try {
        this.loading = true
        const confirm = await this.$_alert.confirm('Apakah anda yakin akan mem-Verifikasi data ini?')
        if (!confirm.isConfirmed) return;

        // api update status
        await this.$_api.post('farmer-mou/approve', {
          mou_no: this.mouData.mou_no
        })

        // success verif
        this.$_alert.success('Data Berhasil Di Verifikasi')

        // update detail lahan local data
        this.$emit('refreshData')

        // close parent modal
        this.$emit('closeParent')
      } catch (err) {
        console.log('lastVerification() err',err)
        this.$_alert.error(err)
      } finally {
        this.loading = false
      }

    },
    onSubmit: async function () {
      try {
        this.loading = true
        // set payload
        const payload = {
          mou_no: this.mouData.mou_no
        }
        for (const [field, data] of Object.entries(this.formData)) {
          if (this.formInputs.find(v => v.field == field).show) {
            payload[field] = data
          }
        }
        console.log('payload',payload)

        // call API
        await this.$_api.post('farmer-mou/update', payload)

        // success
        this.$_alert.success('Berhasil menyimpan data!')

        // update detail lahan local data
        this.$emit('refreshData')

        // close parent modal
        this.$emit('closeParent')
      } catch (err) {
        console.log('onSubmit() err',err)
        this.$_alert.error(err)
      } finally {
        this.loading = false
      }
    },
    setForm() {
      const legalLandCategory = this.lahanData.farmers_legal_land_categories_pivot_farmer
      // hide field
      let showField = []
      if (legalLandCategory == 'Clear & Clean') {
        showField = ['land_ownership_photo','mou_file','polygon_image']
      } else if (legalLandCategory == 'Clear No Clean') {
        showField = ['land_not_sengketa_photo','land_proof_photo','mou_file','polygon_image']
      }
      // set showing input & inputted data
      showField.forEach(f => {
        const find = this.formInputs.find(v => v.field == f)
        if (find) {
          find.show = true
          if (this.mouData[find.field]) this.formData[find.field] = this.mouData[find.field]
        }
      });
    },
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
  },

  mounted() {
    this.setForm()
    console.log('this.lahanData',this.lahanData)
  },
  
  data() {
    return {
      formData: {},
      formInputs: [
        // land_ownership_photo
        {
          show: false,
          field: 'land_ownership_photo',
          label: 'Surat Kepemilikan Lahan',
          validation: ['required'],
          type: 'upload',
          setter: 'land_ownership_photo',
          view_data: 'land_ownership_photo',
          api: 'lahans/upload.php',
          upload_type: 'image/*',
          directory: 'mou-docs',
        },
        // mou_file
        {
          show: false,
          field: 'mou_file',
          label: 'MOU Tertandatangani',
          validation: ['required'],
          type: 'upload',
          setter: 'mou_file',
          view_data: 'mou_file',
          api: 'lahans/upload.php',
          upload_type: 'image/*',
          directory: 'mou-docs',
        },
        // polygon_image
        {
          show: false,
          field: 'polygon_image',
          label: 'Polygon Tertandatangani',
          validation: ['required'],
          type: 'upload',
          setter: 'polygon_image',
          view_data: 'polygon_image',
          api: 'lahans/upload.php',
          upload_type: 'image/*',
          directory: 'mou-docs',
        },
        // land_ownership_photo
        {
          show: false,
          field: 'land_not_sengketa_photo',
          label: 'Surat Keterangan Bebas Sengketa',
          validation: ['required'],
          type: 'upload',
          setter: 'land_not_sengketa_photo',
          view_data: 'land_not_sengketa_photo',
          api: 'lahans/upload.php',
          upload_type: 'image/*',
          directory: 'mou-docs',
        },
        // land_proof_photo
        {
          show: false,
          field: 'land_proof_photo',
          label: 'Bukti Kepemilikan Lahan',
          validation: ['required'],
          type: 'upload',
          setter: 'land_proof_photo',
          view_data: 'land_proof_photo',
          api: 'lahans/upload.php',
          upload_type: 'image/*',
          directory: 'mou-docs',
        },
      ],
      loading: false,
    }
  }
}

</script>

<style>
#preview-wrapper {
  height: 220px;
  width: 100%;
  border-radius: 10px;
  background-position: center;
  background-size: cover;
  background-color: #d7f0f3;
  overflow: hidden;
  transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 500ms;
  
  &:hover {
    transform: translateY(-7px);  
    cursor: pointer
  }

  h5 {
    background-color: #000000aa;
    color: white;
    padding: 2px 5px;
  }
}
</style>