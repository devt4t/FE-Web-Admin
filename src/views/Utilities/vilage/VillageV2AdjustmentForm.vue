<template>
    <v-dialog v-model="isOpen" width="70%">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>Assign Data Target Area - Desa </v-card-title>
  
          <v-card-text class="ff-email-wrapper">
            <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <v-row class="assign-ff-wrapper" v-if="village_data">
                  <v-col lg="12" class="form-separator">
                    <div class="d-flex flex-row align-items-center">
                      <p class="mb-0">Pemetaan TA - Desa</p>
                      <v-btn
                        variant="success"
                        class="add-button ml-2"
                        @click="addTaDesa()"
                        small
                      >
                        <v-icon small>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col lg="12" v-for="(taDesa, i) in ta_desa" :key="'taDesa-' + i">
                    <v-row class="mx-3 bg-grey">
                      <v-col lg="6">
                        <geko-input
                          v-model="taDesa.program_year"
                          :item="{
                            label: 'Tahun Program',
                            type: 'select',
                            validation: ['required'],
                            option: {
                              default_label: taDesa.program_year,
                              multiple: true,
                              default_options: [
                                {
                                  label: '2020',
                                  code: '2020',
                                },
                                {
                                  label: '2021',
                                  code: '2021',
                                },
                                {
                                  label: '2022',
                                  code: '2022',
                                },
                                {
                                  label: '2023',
                                  code: '2023',
                                },
                                {
                                  label: '2024',
                                  code: '2024',
                                },
                                {
                                  label: '2025',
                                  code: '2025',
                                },
                              ],
                              list_pointer: {
                                label: 'label',
                                code: 'code',
                                display: ['label'],
                              },
                            },
                          }"
                        />
                      </v-col>
  
                      <v-col lg="5">
                        <geko-input
                          v-model="taDesa.area_code"
                          :item="{
                            type: 'select',
                            label: 'Target Area',
                            validation: ['required'],
                            api: 'new-utilities/target-areas',
                            default_label: taDesa.target_areas_name,
                            param: {
                              active: 1,
                              limit: 1000,
                              offset: 0
                            },
                            option: {
                              list_pointer: {
                                code: 'area_code',
                                label: 'name',
                                display: ['name'],
                              },
                            },
                          }"
                        />
                      </v-col>
                      <v-col
                        lg="1"
                        class="mt-0 pt-0 d-flex flex-column"
                        style="
                          justify-content: center;
                          position: relative;
                          transform: translateY(15%);
                        "
                      >
                        <v-btn
                          small
                          variant="danger"
                          class="btn-icon"
                          @click="removeTADesa(i)"
                        >
                          <v-icon small>mdi-delete-empty</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col lg="12">
                    <p class="text-danger" v-if="error_ta_desa">
                      {{ error_ta_desa }}
                    </p></v-col
                  >
  
                </v-row>
  
                <v-row>
                  <v-col lg="12" class="d-flex flex-row justify-content-center">
                    <v-btn
                      variant="warning"
                      class="d-flex flex-row align-items-center"
                      type="submit"
                    >
                      <v-icon>mdi-pencil-outline</v-icon>
                      <span>Perbarui Data Desa</span>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row> </v-row>
              </form>
            </ValidationObserver>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: "village-assign-target-area",
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
      addTaDesa() {
        this.ta_desa.push({
          id:"",
          area_code: null,
          program_year: null,
          kode_desa: this.village_data.kode_desa,
        });
      },
      removeTADesa(i) {
        if (!this.ta_desa[i].id) {
          this.ta_desa.splice(i, 1);
          return;
        }
        this.$_alert
          .confirm("Hapus Data TA - Desa?", "", "Ya, Hapus", "Batal", true)
          .then((res) => {
            if (res.isConfirmed) {
              // console.log('data deleted: ', this.ta_desa[i].id)
              this.$_api
                .post("new-utilities/delete/ta_desas", {
                  id: this.ta_desa[i].id,
                })
                .then((res) => {
                  this.ta_desa.splice(i, 1);
                  this.$_alert.success(" Berhasil hapus data TA - Desa");
                })
                .catch((err) => {
                  console.log("err", err);
                });
            }
          });
      },
      onOpen() {
        this.village_data = this.data;
        console.log('data', this.data)
        if (Array.isArray(this.village_data.ta_desas_pivot)) {
          let newtaDesa = [];
          for (const item of this.village_data.ta_desas_pivot) {
            if (!item.program_year) item.program_year = [];
            else {
              item.program_year = item.program_year.replace(/ /g, "").split(",");
            }
            newtaDesa.push(item);
          }
          this.ta_desa = newtaDesa;
        }
      },
  
      onSubmit() {
        if (this.loading) return;
        this.loading = true;
        this.error_ta_desa = "";
        let payloadtaDesa = JSON.parse(JSON.stringify(this.ta_desa));
        let uniqueValue = [];
        for (let item of payloadtaDesa) {
          if (item.program_year.length == 0) {
            this.$_alert.error({}, "", "Tahun program harus diisi");
            return;
          }
          for (const year of item.program_year) {
            if (uniqueValue.includes(year)) {
              this.error_ta_desa = `Tahun program TA - Desa tidak boleh sama`;
              this.$_alert.error(
                {},
                "Error",
                "Tahun program TA - Desa tidak boleh sama"
              );
              return;
            }
            uniqueValue.push(year);
          }
          item.program_year = item.program_year.join(", ");
        }
  
        uniqueValue = [];
  
        const keys = ["id", "kode_desa", "area_code", "program_year", "active"];
  
        let payload = {
          ta_desa: payloadtaDesa,
        };
  
        for (const key of keys) {
          if (this.village_data[key]) payload[key] = this.village_data[key];
        }
        console.log(payload)
        this.$_api
          .post("new-utilities/create/ta_desas", payload)
          .then(() => {
            this.$_alert.success("Berhasil Melakukan Update TA - Desa");
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
          this.isOpen = true;
        }
      },
      isOpen(t) {
        console.log("open change", this.isOpen);
        if (t) {
          this.onOpen();
        } else {
          this.village_data = null;
          this.loading = false;
          this.programYears = [];
          this.existingProgramYears = [];
          this.newProgramYear = null;
          this.error = "";
        }
      },
    },
    data() {
      return {
        isOpen: false,
        village_data: null,
        loading: false,
        programYears: [],
        existingProgramYears: [],
        newProgramYear: null,
        error: "",
        target_area: "",
        target_area_label: "",
        ta_desa: [],
        error_ta_desa: null,
        error_working_area: null,
      };
    },
  };
  </script>
  