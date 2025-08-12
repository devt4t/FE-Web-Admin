<template>
  <v-dialog v-model="isOpen" width="80%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>Update Data Main Sosprog</v-card-title>

        <v-card-text class="ff-email-wrapper">
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <v-row v-if="loading == false" lg="12" class="px-5 py-5">
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
                        api: 'GetManagementUnit',
                        default_label: formData.managementunits_name,
                        option: {
                            getterKey: 'data.result',
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
                        default_label: formData.target_areas_name,
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
                        <geko-input :disabled="!formData.target_area || !formData.program_year" v-model="formData.village" :item="{
                        label: 'Desa',
                        validation: ['required'],
                        col_size: 6,
                        type: 'select',
                        setter: 'village',
                        api: 'new-utilities/desas',
                        default_label: formData.desas_name,
                        param: {
                            program_year: formData.program_year,
                            kode_ta: formData.target_area,
                        },
                        option: {
                            getterKey: 'data',
                            list_pointer: {
                            code: 'kode_desa',
                            label: 'name',
                            display: ['name','kecamatans_name'],
                            },
                        },
                        }" @selected="onChangeVillage($event)" />
                    </v-col>

                    <v-col lg="6" v-if="formData.village">
                        <geko-input v-model="projectPurpose" :item="{
                        label: 'Project',
                        validation: ['required'],
                        type: 'select-radio',
                        setter: 'projectPurpose',
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

                    <v-col md="6">
                        <geko-input v-model="formData.photo_documentation1" :item="{
                        label: 'Foto Dokumentasi 1',
                        validation: ['required'],
                        type: 'upload',
                        api: 'sosialisasi_program/upload.php',
                        directory: 'photos/documentations',
                        upload_type: 'image/*',
                        setter: 'photo_documentation1',
                        view_data: 'photo_documentation1',
                        option: {
                            label_hint:
                            'Klik gambar untuk memilih berkas yang akan diunggah',
                            max_size: 5,
                            multiple: false,
                        },
                        }" />
                    </v-col>

                    <v-col md="6">
                        <geko-input v-model="formData.photo_documentation2" :item="{
                        label: 'Foto Dokumentasi 2',
                        validation: ['required'],
                        type: 'upload',
                        api: 'sosialisasi_program/upload.php',
                        directory: 'photos/documentations',
                        upload_type: 'image/*',
                        setter: 'photo_documentation2',
                        view_data: 'photo_documentation2',
                        option: {
                            label_hint:
                            'Klik gambar untuk memilih berkas yang akan diunggah',
                            max_size: 5,
                            multiple: false,
                        },
                        }" />
                    </v-col>

                </v-row>

                <v-row>
                    <v-col lg="12" class="d-flex flex-row justify-content-center">
                    <v-btn
                        variant="warning"
                        class="d-flex flex-row align-items-center"
                        type="submit"
                    >
                        <v-icon>mdi-pencil-outline</v-icon>
                        <span>Perbarui Data</span>
                    </v-btn>
                    </v-col>
                </v-row>
            </form>
          </ValidationObserver>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>

export default {
  name: "update-program-soc-form-main",
  props: {
    data: {
      required: true,
      default: () => {},
    },
    dataKey: {
      required: true,
      default: 0,
      type: Number,
    },
  },

  methods: {
    
    onOpen() {
      this.formData = this.data;
    },

    onSubmit() {
      this.loading = true;
      this.error_project_programYear = "";
      this.$_api
        .post("UpdateFormMinatMain_new", {
            id: this.formData.id,
            form_date: this.formData.form_date,
            program_year: this.formData.program_year,
            mu_no: this.formData.mu_no,
            target_area: this.formData.target_area,
            village: this.formData.village,
            photo_documentation1: this.formData.photo_documentation1,
            photo_documentation2: this.formData.photo_documentation2
        })
        .then(() => {
          this.$_alert.success("Berhasil Melakukan Update Data Sosialisasi Program");
          this.isOpen = false;
          this.loading = false;
          this.$emit("success", true);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },

  watch: {
    dataKey(t) {
      if (t > 0) {
        this.formData= null;
        this.isOpen = true;
      }
    },
    isOpen(t) {
      console.log("open change", this.isOpen);
      if (t) {
        this.onOpen();
      } else {
        this.formData = null;
        this.loading = false;
        this.error = "";
      }
    },
  },
  data() {
    return {
        isOpen: false,
        loading: false,
        formData: null,
        projectPurpose: null,
        error: null
    };
  },
};
</script>
