<template>
    <v-dialog v-model="isOpen" width="70%">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>Assign Data Target Area - Desa </v-card-title>
  
          <v-card-text class="ff-email-wrapper">
            <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <v-row class="assign-ff-wrapper" v-if="ffData">
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
                  <!-- <v-col lg="12" v-for="(fcff, i) in fc_ff" :key="'fcff-' + i">
                    <v-row class="mx-3 bg-grey">
                      <v-col lg="6">
                        <geko-input
                          v-model="fcff.program_year"
                          :item="{
                            label: 'Tahun Program',
                            type: 'select',
                            validation: ['required'],
                            option: {
                              default_label: fcff.program_year,
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
                          v-model="fcff.key1"
                          :item="{
                            type: 'select',
                            label: 'Field Coordinator',
                            validation: ['required'],
                            api: 'getEmployeeList_new',
                            default_label: fcff.employees_name,
                            option: {
                              list_pointer: {
                                code: 'nik',
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
                    <p class="text-danger" v-if="error_fc_ff">
                      {{ error_fc_ff }}
                    </p></v-col
                  > -->
  
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
        this.fc_ff.push({
          id: "",
          key1: null,
          key2: this.ffData.ff_no,
          type: "fc_ff",
        });
      },
      removeTADesa(i) {
        if (!this.fc_ff[i].id) {
          this.fc_ff.splice(i, 1);
          return;
        }
        this.$_alert
          .confirm("Hapus Data FC FF?", "", "Ya, Hapus", "Batal", true)
          .then((res) => {
            if (res.isConfirmed) {
              this.$_api
                .post("DeleteAssignData", {
                  mainPivot_id: this.fc_ff[i].id,
                })
                .then((res) => {
                  this.fc_ff.splice(i, 1);
                  this.$_alert.success(" Berhasil hapus data FC FF");
                })
                .catch((err) => {
                  console.log("err", err);
                });
            }
          });
      },
      onOpen() {
        this.ffData = this.data;
        if (Array.isArray(this.ffData.ff_main_pivot)) {
          let newFcFf = [];
          for (const item of this.ffData.ff_main_pivot) {
            if (!item.program_year) item.program_year = [];
            else {
              item.program_year = item.program_year.replace(/ /g, "").split(",");
            }
            newFcFf.push(item);
          }
          this.fc_ff = newFcFf;
        }
  
        if (Array.isArray(this.ffData.ff_working_areas)) {
          let newWorkingAreas = [];
          for (const item of this.ffData.ff_working_areas) {
            if (!item.program_year) item.program_year = [];
            else {
              item.program_year = item.program_year.replace(/ /g, "").split(",");
            }
            newWorkingAreas.push(item);
          }
          this.working_areas = newWorkingAreas;
        }
      },
  
      onSubmit() {
        if (this.loading) return;
        this.loading = true;
        this.error_fc_ff = "";
        this.error_working_area = "";
        let payloadFcFf = JSON.parse(JSON.stringify(this.fc_ff));
        let uniqueValue = [];
        for (let item of payloadFcFf) {
          if (item.program_year.length == 0) {
            this.$_alert.error({}, "", "Tahun program harus diisi");
            return;
          }
          for (const year of item.program_year) {
            if (uniqueValue.includes(year)) {
              this.error_fc_ff = `Tahun program pemetaan FC FF tidak boleh sama`;
              this.$_alert.error(
                {},
                "Error",
                "Tahun program pemetaan FC FF tidak boleh sama"
              );
              return;
            }
            uniqueValue.push(year);
          }
          item.program_year = item.program_year.join(", ");
        }
  
        uniqueValue = [];
  
        const keys = ["id", "ff_no", "name", "ktp_no", "active"];
  
        let payload = {
          fc_ff: payloadFcFf,
        };
  
        for (const key of keys) {
          if (this.ffData[key]) payload[key] = this.ffData[key];
        }
  
        this.$_api
          .post("UpdateFieldFacilitator", payload)
          .then(() => {
            this.$_alert.success("FF berhasil di assign ke program year baru");
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
          this.ffData = null;
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
        ffData: null,
        loading: false,
        programYears: [],
        existingProgramYears: [],
        newProgramYear: null,
        error: "",
        key1: "",
        key1_label: "",
        working_areas: [],
        fc_ff: [],
        error_fc_ff: null,
        error_working_area: null,
      };
    },
  };
  </script>
  