<template>
  <v-dialog v-model="isOpen" width="70%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>Assign Data FF </v-card-title>

        <v-card-text class="ff-email-wrapper">
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
              <v-row class="assign-ff-wrapper">
                <v-col lg="6">
                  <geko-input
                    v-model="formData.mu_no"
                    :item="{
                      type: 'select',
                      label: 'Management Unit',
                      api: 'GetManagementUnit',
                      validation: ['required'],
                      param: {
                        program_year: 2024,
                      },
                      option: {
                        getterKey: 'data.result',
                        default_label: formData.managementunits_name,
                        list_pointer: {
                          label: 'name',
                          code: 'mu_no',
                          display: ['name'],
                        },
                      },
                    }"
                  />
                </v-col>

                <v-col lg="6">
                  <geko-input
                    v-model="formData.area_code"
                    :item="{
                      type: 'select',
                      label: 'Target Area',
                      api: 'GetTargetArea',
                      validation: ['required'],
                      param: {
                        mu_no: formData.mu_no,
                      },
                      option: {
                        default_label: formData.target_areas_name,
                        getterKey: 'data.result',
                        list_pointer: {
                          label: 'name',
                          code: 'area_code',
                          display: ['name'],
                        },
                      },
                    }"
                    :disabled="!formData.mu_no"
                  />
                </v-col>

                <v-col lg="6">
                  <geko-input
                    v-model="formData.village"
                    :item="{
                      type: 'select',
                      label: 'Working Area / Desa',
                      api: 'GetDesaByKecamatanTA_new',
                      validation: ['required'],
                      param: {
                        ta_no: formData.area_code,
                      },
                      option: {
                        // getterKey: 'data.result',
                        default_label: formData.desas_name,
                        list_pointer: {
                          label: 'name',
                          code: 'kode_desa',
                          display: ['name'],
                        },
                      },
                    }"
                    :disabled="!formData.area_code"
                  />
                </v-col>

                <v-col lg="6">
                  <geko-input
                    v-model="formData.ff_no"
                    :item="{
                      type: 'select',
                      label: 'Field Facilitator',
                      api: 'GetFFAllWeb_new',
                      validation: ['required'],
                      option: {
                        // getterKey: 'data.result',
                        default_label: formData.ff_name,
                        list_pointer: {
                          label: 'name',
                          code: 'ff_no',
                          display: ['name', 'target_areas_name'],
                        },
                      },
                    }"
                  />
                </v-col>

                <v-col lg="12" class="d-flex flex-row justify-content-center">
                  <v-btn
                    variant="info"
                    class="d-flex flex-row align-items-center"
                    type="submit"
                  >
                    <v-icon>mdi-account-edit</v-icon>
                    <span>Assign FF</span>
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
  name: "ff-assign-program-year",
  props: {
    data: {
      required: false,
      default: () => {},
    },
    dataKey: {
      required: true,
      default: 0,
      type: Number,
    },
  },

  methods: {
    onOpen() {},

    onSubmit() {
      let payload = JSON.parse(JSON.stringify(this.formData));
      payload.farmer_no = this.$route.query.farmer_no;
      payload.program_year = this.$_config.programYear.model;

      //api post
      this.$_api.post("AssignAnotherFFtoFarmer_new", payload).then(() => {
        this.$_alert.success("Petani berhasil di assign ke FF");

        this.formData = {
          ff_no: null,
          farmer_no: null,
          village: null,
          program_year: null,
        };
        this.$emit("refresh", true);
        this.isOpen = false;
      });
    },
  },

  watch: {
    dataKey(t) {
      if (t > 0) {
        this.isOpen = true;
      }
    },
    isOpen(t) {
      if (t) {
        this.onOpen();
      } else {
        //set default data
      }
    },
  },
  data() {
    return {
      isOpen: false,
      loading: false,
      formData: {
        ff_no: null,
        farmer_no: null,
        village: null,
        program_year: null,
      },
    };
  },
};
</script>
