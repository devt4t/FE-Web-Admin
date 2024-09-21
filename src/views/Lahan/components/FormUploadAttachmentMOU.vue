<template>
  <div class="lahan-gis-verification">
    <div class="d-flex flex-row mb-3" style="justify-content: space-between">
      <h5>Upload Attachment MOU</h5>
      <button @click="$emit('close')"><v-icon>mdi-close</v-icon></button>
    </div>

    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <template v-for="(input, i) in formInputs">
            <v-col v-if="input.show" lg="6" :key="`formInputAttach${i}`">
              <geko-input
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
            </v-col>
          </template>

          <v-col lg="12">
            <v-btn
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
  </div>
</template>
<script>
export default {
  name: 'FormUploadAttachmentMOU',
  methods: {
    onSubmit: async function () {
      try {
        
      } catch (err) {
        console.log('onSubmit() err',err)
        this.$_alert.error(err)
      } finally {
        // close parent modal
        this.$emit('closeParent')
        
        // update detail lahan local data
        this.$emit('refreshData')
      }
    },
    setForm() {
      // hide field
      const hideField = []
      hideField.forEach(f => {
        const find = this.formInputs.find(v => v.field == f)
        if (find) find.show = false
      });
    }
  },

  mounted() {
    this.setForm()
  },
  
  data() {
    return {
      formData: {},
      formInputs: [
        // land_ownership_photo
        {
          show: true,
          field: 'land_ownership_photo',
          label: 'Surat Kepemilikan Lahan',
          validation: ['required'],
          type: 'upload',
          setter: '',
          view_data: '',
          api: '',
          upload_type: '.jpg',
          directory: '',
        },
        // mou_file
        {
          show: true,
          field: 'mou_file',
          label: 'MOU Tertandatangani',
          validation: ['required'],
          type: 'upload',
          setter: '',
          view_data: '',
          api: '',
          upload_type: '.jpg',
          directory: '',
        },
        // polygon_image
        {
          show: true,
          field: 'polygon_image',
          label: 'Polygon Tertandatangani',
          validation: ['required'],
          type: 'upload',
          setter: '',
          view_data: '',
          api: '',
          upload_type: '.jpg',
          directory: '',
        },
        // land_ownership_photo
        {
          show: true,
          field: 'land_not_sengketa_photo',
          label: 'Surat Keterangan Bebas Sengketa',
          validation: ['required'],
          type: 'upload',
          setter: '',
          view_data: '',
          api: '',
          upload_type: '.jpg',
          directory: '',
        },
        // land_proof_photo
        {
          show: true,
          field: 'land_proof_photo',
          label: 'Bukti Kepemilikan Lahan',
          validation: ['required'],
          type: 'upload',
          setter: '',
          view_data: '',
          api: '',
          upload_type: '.jpg',
          directory: '',
        },
      ],
      loading: false
    }
  }
}

</script>