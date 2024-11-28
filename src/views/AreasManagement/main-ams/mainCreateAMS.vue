<template>
    <v-card class="px-7">
  
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
                <geko-input v-model="formData.region" :disabled="!formData.program_year" :item="{
                    label: 'Regional',
                    validation: ['required'],
                    col_size: 6,
                    type: 'select',
                    setter: 'region',
                    param: {
                    page: 1,
                    per_page: 10,
                    },
                    api: 'new-utilities/region/list',
                    default_label: formData.region,
                    option: {
                    getterKey: 'result',
                    list_pointer: {
                        code: 'region_code',
                        label: 'name',
                        display: ['name', 'region_code'],
                    },
                    },
                }" />
                </v-col>
            </v-row>  
            <v-row>
                <v-col>
                    <geko-input v-model="formData.employee_position" :item="{
                    label: 'Posisi',
                    validation: ['required'],
                    col_size: 6,
                    type: 'select',
                    setter: 'employee_position',
                    option: {
                    list_pointer: {
                        label: 'label',
                        code: 'code',
                        display: ['label'],
                    },
                    default_options: [
                        {
                        label: 'Regional Manager',
                        code: 23,
                        },
                        {
                        label: 'Unit Manager',
                        code: 20,
                        },
                        {
                        label: 'Field Coordinator',
                        code: 19,
                        },
                        {
                        label: 'Field Facilitator',
                        code: 'ff',
                        }
                    ],
                    },
                }" /> 
                </v-col>
                <v-col>
                <geko-input v-if="formData.employee_position == 'ff' || formData.employee_position == 19 || formData.employee_position == 20" v-model="formData.mu_no" 
                :disabled="!formData.program_year || !formData.region" :item="{
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
                
            </v-row>
            <v-row>
                <v-col>
                    <geko-input v-model="formData.user_id" :item="{
                        label: 'Assign Kepada: ',
                        validation: ['required'],
                        col_size: 6,
                        type: 'select',
                        api: 'getEmployeeList_new',
                        setter: 'user_id',
                        default_label: formData.user_id,
                        option: {
                        getterKey: 'data',
                        list_pointer: {
                                code: 'nik',
                                label: 'name',
                                display: ['name', 'nik'],
                            },
                        },
                    }" /> 
                </v-col>
                <v-col>
                    <geko-input v-if="formData.employee_position == 'ff' || formData.employee_position == 19" v-model="formData.target_area" 
                        :disabled="!formData.program_year || !formData.mu_no" :item="{
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
            </v-row>
            <v-row>
                <v-col>
                
                </v-col>
                <v-col>
                    <geko-input v-if="formData.employee_position == 'ff'" v-model="formData.village"
                        :disabled="!formData.program_year || !formData.mu_no || !formData.target_area" :item="{
                        label: 'Desa',
                        validation: ['required'],
                        col_size: 6,
                        type: 'select',
                        api: 'GetDesaByKecamatanTA_new',
                        param: {
                            ta_no: formData.target_area,
                            program_year: formData.program_year
                        },
                        setter: 'village',
                        option: {
                            getterKey: 'data',
                            list_pointer: {
                            label: 'name',
                            code: 'kode_desa',
                            display: ['name', 'kode_desa'],
                                },
                            },
                        }"/>
                </v-col>
            </v-row>
          <v-col md="12">
            <div class="d-flex flex-row justify-content-end" style="justify-content: flex-end">
              <v-btn type="submit" variant="success" :disabled="loading">
                <v-icon>mdi-check-bold</v-icon>
                <span>Submit</span>
              </v-btn>
            </div>
          </v-col>
        </form>
      </ValidationObserver>

    </v-card>
  </template>
  
  <script>
  
  export default {
    name: "ams-create",
    props: {},
    data() {
      return {
        allFFByDesa: [],
        isActive: null,
        form: 1,
        totalSelectedPeserta: 0,
        isModalDetailOpened: false,
        loading: false,
        selectedDesaName: '',
        
        formData: {
            region: '',
            mu_no: '',
            target_area: '',
            village: '',
            user_id: '',
            employee_position: '',
            program_year: '2024',
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
    },
    methods: {
      onSubmit() {
        if (this.form == 1) {
            // console.log(this.formData)
            this.$_api.post('ams/post_create', this.formData)
                .then(response => {
                this.$router.go(-1);
                this.$refreshKey += 1;
                this.$_alert.success("Data Area Management berhasil ditambahkan");
            }).catch(err => {

            });
        } else {
            console.log('undefined')
        }
      },
    },
  }
  </script>