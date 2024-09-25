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
    <div v-if="mouData.mou_status > 2">
      <!-- input -->
      <geko-input
        v-if="!preview"
        v-model="mouData.mou_file"
        :item="{
          label: formInputs.find(v => v.field == 'mou_file').label,
          validation: formInputs.find(v => v.field == 'mou_file').validation,
          type: formInputs.find(v => v.field == 'mou_file').type,
          setter: formInputs.find(v => v.field == 'mou_file').setter,
          view_data: `${iLahan}${i}${formInputs.find(v => v.field == 'mou_file').view_data}`,
          api: formInputs.find(v => v.field == 'mou_file').api,
          upload_type: formInputs.find(v => v.field == 'mou_file').upload_type,
          directory: formInputs.find(v => v.field == 'mou_file').directory,
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
          $_config.baseUrlUpload + '/' + mouData.mou_file
        )"
        style="width: 250px;"
        :style="{
        backgroundImage:
          'url(' +
          $_config.baseUrlUpload +
          '/' +
          mouData.mou_file +
          ')',
        }"
      >
        <h5>{{ formInputs.find(v => v.field == 'mou_file').label }}</h5>
      </div>

      <v-tabs
        v-model="tab"
        background-color="transparent"
        color="success"
        class="mt-5"
      >
        <v-tab
          v-for="(lahan, iLahan) in mouData.mou_lahans"
          :key="`tab${iLahan}`"
        >
          <b>{{ lahan.lahan_no }}</b>
        </v-tab>
      </v-tabs>
  
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(lahan, iLahan) in mouData.mou_lahans"
          :key="`tab${iLahan}`"
        >
          <v-card
            color="basil"
            flat
          >
            <v-card-text>
              <ValidationObserver :ref="`formUploadAttachment${iLahan}`" v-slot="{ handleSubmit }">
                <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                  <v-row>
                    <template v-for="(input, i) in formInputs">
                      <v-col v-if="input.show" :lg="preview ? 4 : 6" :key="`formInputAttach${iLahan}${i}`">
                        <!-- input -->
                        <geko-input
                          v-if="!preview"
                          v-model="lahan[input.field]"
                          :item="{
                            label: input.label,
                            validation: input.validation,
                            type: input.type,
                            setter: input.setter,
                            view_data: `${iLahan}${i}${input.view_data}`,
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
                            $_config.baseUrlUpload + '/' + lahan[input.field]
                          )"
                          :style="{
                          backgroundImage:
                            'url(' +
                            $_config.baseUrlUpload +
                            '/' +
                            lahan[input.field] +
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
                    </v-col>
                  </v-row>
                </form>
              </ValidationObserver>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <!-- approve btn -->
      <v-btn
        v-if="preview"
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
    </div>
    <div v-else
      class="my-5 py-5"
    >
      <v-alert color="warning" dense text>
        <v-icon large color="warning" class="mr-2">mdi-printer-alert</v-icon>
        Silakan Print Appendix Terlebih Dahulu!
      </v-alert>
      <v-btn color="warning"
        @click="openPrintAppendix()"
      >
        Print Appendix
      </v-btn>
    </div>
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

        const lahanOpened = this.mouData.mou_lahans[this.tab]
        // set payload
        const payload = {
          mou_no: this.mouData.mou_no,
          lahan_no: lahanOpened.lahan_no,
          mou_file: this.mouData.mou_file
        }
        console.log('lahanOpened',lahanOpened)
        for (const [field, data] of Object.entries(lahanOpened)) {
          const findField = this.formInputs.find(v => v.field == field)
          if (findField && findField.show) {
            payload[field] = data
          }
        }

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
    openPrintAppendix() {
      // open appendix modal
      setTimeout(() => {
        this.$emit('openPrintAppendix')
      }, 100);
    },  
    setForm() {
      const legalLandCategory = this.lahanData.farmers_legal_land_categories_pivot_farmer
      // hide field
      let showField = []
      if (legalLandCategory == 'Clear & Clean') {
        showField = ['land_ownership_photo','polygon_image']
      } else if (legalLandCategory == 'Clear No Clean') {
        showField = ['land_not_sengketa_photo','land_proof_photo','polygon_image']
      }
      // set showing input
      showField.forEach(f => {
        const find = this.formInputs.find(v => v.field == f)
        if (find) find.show = true
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
  },
  
  data() {
    return {
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
      tab: 0
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