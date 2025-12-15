<template>
  <v-dialog v-model="isOpen" width="50%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <span>Export Pendataan Lahan Umum</span>
        </v-card-title>

        <v-card-text class="farmer-assign-wrapper mt-3">

          <geko-input v-model="exportBy" :item="{
            type: 'select-radio',
            label: 'Export By',
            validation: ['required'],
            option: {
              list_pointer: {
                label: 'label',
                code: 'code',
                display: ['label'],
              },
              default_options: exportByOptions
            },
          }" />

          <div :class="exportBy === 'ff' ? 'd-block' : 'd-none'">
            <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <v-row>
                  <v-col lg="12">
                    <geko-input v-if="ffList.length > 0" v-model="ff_code" :item="{
                      label: 'Field Facilitator',
                      placeholder: 'Pilih Field Facilitator',
                      type: 'select',
                      validation: ['required'],
                      api: 'GetFFAllWeb_new',
                      param: {
                        limit: 20,
                      },
                      option: {
                        multiple: true,
                        default_options: ffList,
                        list_pointer: {
                          label: 'name',
                          code: 'ff_no',
                          display: ['name', 'ff_no'],
                        },
                      },
                    }" @option:selected="test($event)" :disabled="ffList.length == 0" />
                    <v-progress-circular v-if="ffList.length == 0" indeterminate color="primary"></v-progress-circular>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="danger" type="submit" v-if="format == 'pdf'">
                      <v-icon v-if="!loading">mdi-file-pdf-box</v-icon>

                      <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
                      <span class="ml-1"> Export PDF</span>
                    </v-btn>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="success" type="submit" v-if="format == 'excel'">
                      <v-icon v-if="!loading">mdi-microsoft-excel</v-icon>
                      <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
                      <span class="ml-1"> Export Excel</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </form>
            </ValidationObserver>
          </div>
          <div :class="exportBy === 'mu' ? 'd-block' : 'd-none'">
            <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onSubmitByMU)" autocomplete="off">
                <v-row>
                  <v-col lg="12">
                    <geko-input v-if="muList.length > 0" v-model="mu_no" :item="{
                      label: 'Unit Management',
                      placeholder: 'Pilih Unit Management',
                      type: 'select',
                      validation: ['required'],
                      api: 'GetManagementUnitAdmin',
                      param: {
                        page: 1,
                        per_page: 10,
                      },
                      option: {
                        multiple: true,
                        getterKey: 'data.result',
                        default_options: muList,
                        list_pointer: {
                          label: 'name',
                          code: 'mu_no',
                          display: ['name'],
                        },
                      },
                    }" @option:selected="test2($event)" :disabled="muList.length == 0" />
                    <v-progress-circular v-if="muList.length == 0" indeterminate color="primary"></v-progress-circular>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="danger" type="submit" v-if="format == 'pdf'">
                      <v-icon v-if="!loadingCarbonExport">mdi-file-pdf-box</v-icon>

                      <v-progress-circular v-else :size="20" color="danger" :value="muLoadingProgress" :rotate="-90">
                      </v-progress-circular> 
                      <span v-if="loadingCarbonExport">
                        &nbsp; {{ muLoadingProgress }}%
                      </span>
                      <span class="ml-1"> Export PDF</span>
                    </v-btn>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="success" type="submit" v-if="format == 'excel'">
                      <v-icon v-if="!loadingCarbonExport">mdi-microsoft-excel</v-icon>
                      <v-progress-circular v-else :size="20" color="danger" :value="muLoadingProgress" :rotate="-90">
                      </v-progress-circular> 
                      <span v-if="loadingCarbonExport">
                        &nbsp; {{ muLoadingProgress }}%
                      </span>
                      <span class="ml-1"> Export Excel</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </form>
            </ValidationObserver>
          </div>
          <div :class="exportBy === 'fc' ? 'd-block' : 'd-none'">
            <ValidationObserver ref="secondForm" v-slot="{ handleSubmit }">
                <form @submit.prevent="handleSubmit(onSubmitByFC)" autocomplete="off">
                    <v-row>
                        <v-col lg="12">
                            <geko-input v-if="fcList.length > 0" v-model="employee_no_fc" :item="{
                                label: 'Field Coordinator',
                                placeholder: 'Pilih Field Coordinator',
                                type: 'select',
                                validation: ['required'],
                                api: 'getEmployeeList_new',
                                param: {
                                    page: 1,
                                    per_page: 10,
                                    position_no: 19,
                                },
                                option: {
                                    multiple: true,
                                    getterKey: 'data.result',
                                    default_options: fcList,
                                    list_pointer: {
                                        label: 'name',
                                        code: 'nik',
                                        display: ['name'],
                                    },
                                },
                            }" @option:selected="test2($event)" :disabled="fcList.length == 0" />
                            <v-progress-circular v-if="fcList.length == 0" indeterminate
                                color="primary"></v-progress-circular>
                        </v-col>

                        <v-col lg="12">
                            <v-btn variant="danger" type="submit" v-if="format == 'pdf'">
                                <v-icon v-if="!loadingExportByFC">mdi-file-pdf-box</v-icon>

                                <v-progress-circular v-else :size="20" color="danger"
                                    indeterminate></v-progress-circular>
                                <span class="ml-1"> Export PDF</span>
                            </v-btn>
                        </v-col>

                        <v-col lg="12">
                            <v-btn variant="success" type="submit" v-if="format == 'excel'">
                                <v-icon v-if="!loadingExportByFC">mdi-microsoft-excel</v-icon>
                                <v-progress-circular v-else :size="20" color="danger"
                                    indeterminate></v-progress-circular>
                                <span class="ml-1"> Export Excel</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </form>
            </ValidationObserver>
          </div>
          <div :class="exportBy === 'um' ? 'd-block' : 'd-none'">
            <ValidationObserver ref="thirdForm" v-slot="{ handleSubmit }">
                <form @submit.prevent="handleSubmit(onSubmitByUM)" autocomplete="off">
                    <v-row>
                        <v-col lg="12">
                            <geko-input v-if="umList.length > 0" v-model="employee_no_um" :item="{
                                label: 'Unit Manager',
                                placeholder: 'Pilih Unit Manager',
                                type: 'select',
                                validation: ['required'],
                                api: 'GetManagementUnitAdmin',
                                param: {
                                    page: 1,
                                    per_page: 10,
                                },
                                option: {
                                    multiple: true,
                                    getterKey: 'data.result',
                                    default_options: umList,
                                    list_pointer: {
                                        label: 'name',
                                        code: 'nik',
                                        display: ['name'],
                                    },
                                },
                            }" @option:selected="test2($event)" :disabled="umList.length == 0" />
                            <v-progress-circular v-if="umList.length == 0" indeterminate
                                color="primary"></v-progress-circular>
                        </v-col>

                        <v-col lg="12">
                            <v-btn variant="danger" type="submit" v-if="format == 'pdf'">
                                <v-icon v-if="!loadingExportByUM">mdi-file-pdf-box</v-icon>

                                <v-progress-circular v-else :size="20" color="danger"
                                    indeterminate></v-progress-circular>
                                <span class="ml-1"> Export PDF</span>
                            </v-btn>
                        </v-col>

                        <v-col lg="12">
                            <v-btn variant="success" type="submit" v-if="format == 'excel'">
                                <v-icon v-if="!loadingExportByUM">mdi-microsoft-excel</v-icon>
                                <v-progress-circular v-else :size="20" color="danger"
                                    indeterminate></v-progress-circular>
                                <span class="ml-1"> Export Excel</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </form>
            </ValidationObserver>
          </div>

        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "lahan-export-modal",
  data() {
    return {
      ff_code: null,
      mu_no: null,
      employee_no_fc: null,
      employee_no_um: null,
      isOpen: false,
      loading: false,
      loadingCarbonExport: false,
      loadingExportByFC: false,
      loadingExportByUM: false,
      currentFfName: "",
      exportBy: 'mu',
      muLoadingProgress: 0,
      exportByOptions:[],
      ffList: [],
      muList: [],
      fcList: [],
      umList: [],
      exportData: [],
    };
  },
  props: {
    dataKey: {
      required: false,
      default: false,
    },
    format: {
      required: true,
    },
  },

  watch: {
    dataKey(t) {
      if (t > 0) {
        // this.getInitialData()
        this.getFFDataForExport()
        this.getUMDataForExport()
        this.getFCDataForExport()
        this.getMUDataForExport()

        if (this.format === 'pdf') {
          this.exportByOptions = [
            // {
            //   label: 'Field Facilitator',
            //   code: 'ff',
            // },
            {
              label: 'Unit Management',
              code: 'mu',
            },
          ];
        } else {
          this.exportByOptions = [
            {
              label: 'Unit Management',
              code: 'mu',
            },
            // {
            //   label: 'Field Facilitator',
            //   code: 'ff',
            // },
            // {
            //   label: 'Field Coordinator',
            //   code: 'fc',
            // },
            // {
            //   label: 'Unit Manager',
            //   code: 'um',
            // },
          ];
        }

        this.isOpen = true;

      }

      if (!t) {
        this.ff_code = null;
      }
    },
  },

  // mounted() {
  //   this.getFFDataForExport()
  //   this.getUMDataForExport()
  // },

  methods: {
    test(data) {
      console.log("data", data);
    },
    test2(data) {
      console.log("data", data);
    },

    async getFFDataForExport() {
      if (this.ffList.length > 0) return;
      const result = await this.$_api.get("GetFFAllWeb_new", {
        program_year: this.$store.state.tmpProgramYear,
        limit: 2200,
        offset: 0,
      });

      if (!Array.isArray(result.data)) return;

      for (const item of result.data) {
        item.name = `${item.name} - ${item.ff_no}`;
      }

      this.ffList = result.data;
    },
    async getMUDataForExport() {
      if (this.muList.length > 0) return;
      const result = await this.$_api.get("GetManagementUnitAdmin", {
        page: 1,
        per_page: 1000,
      });

      if (!Array.isArray(result.data.result)) return;

      for (const item of result.data.result) {
        item.name = `${item.name} - ${item.mu_no}`;
      }

      this.muList = result.data.result;
    },
    async getFCDataForExport() {
      if (this.fcList.length > 0) return;
      const result = await this.$_api.get("getEmployeeList_new", {
          limit: 2147,
          offset: 0,
          position_no: 19,
          program_year: this.$store.state.tmpProgramYear,
      });

      if (!Array.isArray(result.data)) return;

      for (const item of result.data) {
          item.name = `${item.name}`;
      }

      this.fcList = result.data;
    },
    async getUMDataForExport() {
      if (this.umList.length > 0) return;
      const result = await this.$_api.get("getEmployeeList_new", {
          limit: 2147,
          offset: 0,
          position_no: 20,
          program_year: this.$store.state.tmpProgramYear,
      });

      if (!Array.isArray(result.data)) return;

      for (const item of result.data) {
          item.name = `${item.name}`;
      }

      this.umList = result.data;
    },
    // export data

    getExportData(ffCode) {
      return new Promise(async (resolve, reject) => {
        this.$_api
          .get("getExportDataLahanFarmer_new", {
            program_year: this.$store.state.tmpProgramYear,
            ff_no: ffCode,
            limit: 100000,
            offset: 0,
          })
          .then((res) => {
            return resolve(res);
          })
          .catch(() => {
            return reject(false);
          });
      });
    },
    getExportDataByMU(muNo, offset) {
      return new Promise(async (resolve, reject) => {
        this.$_api
          .get("getExportDataLahanFarmer_new", {
            program_year: this.$store.state.tmpProgramYear,
            mu_no: muNo,
            limit: 500,
            offset
          })
          .then((res) => {
            return resolve(res);
          })
          .catch(() => {
            return reject(false);
          });
      });
    },
    getExportDataCarbon(muNo, offset) {
      return new Promise(async (resolve, reject) => {
        this.$_api
          .get("lahan/export/list/carbon", {
            program_year: this.$store.state.tmpProgramYear,
            mu_no: muNo,
            limit: 100,
            offset,
          })
          .then((res) => {
            return resolve(res);
          })
          .catch(() => {
            return reject(false);
          });
      });
    },
    getExportDataByEmployee(employee_no, offset) {
      return new Promise(async (resolve, reject) => {
        this.$_api
          .get("getExportDataLahanFarmerByEmployee_new", {
            program_year: this.$store.state.tmpProgramYear,
            employee_no: employee_no,
            limit: 100,
            offset,
          })
          .then((res) => {
            return resolve(res);
          })
          .catch(() => {
            return reject(false);
          });
      });
    },

    async onSubmit() {
      if (this.loading) return;

      this.loading = true;
      for (const _ff of this.ff_code) {
        if (!_ff) continue;

        const result = await this.getExportData(_ff);

        if (!result) {
          this.loading = false;
          continue;
        }

        if (
          !Array.isArray(result.data) ||
          (Array.isArray(result.data) && result.data.length == 0)
        ) {
          if (this.ff_code.length == 1) {
            this.loading = false;
            this.$_alert.error(
              {},
              "Tidak ada data",
              `FF ${this._ff} tidak memiliki petani/lahan di tahun ${this.$store.state.tmpProgramYear}`
            );
            return;
          }
          continue;
        }

        const trees = await this.$_api
          .get("GetTreesAll")
          .then((res) => {
            return res.data.result.data;
          })
          .catch((err) => {
            console.log("err", err);
            return false;
          });

        if (!trees) {
          this.loading = false;
          continue;
        }

        const configUrl = {
          pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
          excel: `${this.$_config.baseUrlExport}export/farmer-land-polygon/excel`,
        };

        let ffName = this.ffList.find((item) => item.ff_no == _ff)
          ? this.ffList.find((item) => item.ff_no == _ff).name
          : "";

        if (ffName) {
          ffName = ffName.replace(/ /g, "");
        }

        const configFilename = {
          pdf: `Report-${ffName}-${_ff}-${moment().format(
            "DMMYYYYHHmmss"
          )}.pdf`,
          excel: `Report-${ffName}-${_ff}-${moment().format(
            "DMMYYYYHHmmss"
          )}.xlsx`,
        };
        const axiosConfig = {
          method: "POST",
          url: configUrl[this.format],
          responseType: "arraybuffer",
          data: {
            data: result.data,
            trees: trees,
            exportBy: this.exportBy,
            name: ffName,
            program_year: this.$store.state.tmpProgramYear,
          },
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        };
        const exported = await axios(axiosConfig)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            return false;
          });

        if (!exported) {
          this.loading = false;
          continue;
        }

        const url = URL.createObjectURL(new Blob([exported.data]));
        const link = document.createElement("a");
        link.href = url;

        const filename = configFilename[this.format];
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      }

      this.$_alert.success("Successfully");
      this.loading = false;
      this.isOpen = false;
    },
    async onSubmitCarbonData() {
      if (this.loadingCarbonExport) return;

      const configUrl = {
        pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
        excel: `${this.$_config.baseUrlExport}export/land-carbon/excel`,
      };


      this.loadingCarbonExport = true;
      for (const [index, _mu] of this.mu_no.entries()) {
        if (!_mu) continue;

        let muName = this.muList.find((item) => item.mu_no == _mu)
          ? this.muList.find((item) => item.mu_no == _mu).name
          : "";

        let offset = 0;
        while (true) {
          const result = await this.getExportDataCarbon(_mu, offset);
          if (!result) {
            this.loadingCarbonExport = false;
            break;
          }

          if (
            !Array.isArray(result.result) ||
            (Array.isArray(result.result) && result.result.length == 0 && this.exportData.length == 0)
          ) {
            this.loadingCarbonExport = false;
            this.$_alert.error(
              {},
              "Tidak ada data",
              `Tidak ada data di Unit Management ${muName} ${this.$store.state.tmpProgramYear}`
            );
            return;
          } else {
            console.log(result, offset)
            this.muLoadingProgress = result.total ? Math.min(100, Math.round((this.exportData.length / result.total) * 100)) : 100;
            this.exportData = [...this.exportData, ...result.result]
            if (result.result.length < 100) break;
            offset += 100;
          }



        }


        const trees = await this.$_api
          .get("GetTreesAll")
          .then((res) => {
            return res.data.result.data;
          })
          .catch((err) => {
            console.log("err", err);
            return false;
          });

        if (!trees) {
          this.loading = false;
          continue;
        }



        if (muName) {
          muName = muName.replace(/ /g, "");
        }

        const configFilename = {
          pdf: `Report-${muName}-${_mu}-${moment().format(
            "DMMYYYYHHmmss"
          )}.pdf`,
          excel: `Report-${muName}-${_mu}-${moment().format(
            "DMMYYYYHHmmss"
          )}.xlsx`,
        };
        const axiosConfig = {
          method: "POST",
          url: configUrl[this.format],
          responseType: "arraybuffer",
          data: {
            data: this.exportData,
            trees: trees
          },
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        };
        const exported = await axios(axiosConfig)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            return false;
          });

        if (!exported) {
          this.loadingCarbonExport = false;
          continue;
        }

        const url = URL.createObjectURL(new Blob([exported.data]));
        const link = document.createElement("a");
        link.href = url;

        const filename = configFilename[this.format];
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        // reset after complete download, then filled by next UM
        this.exportData = [];

        // stop the loading when the last download completed
        if (index === this.mu_no.length - 1) {
          this.loadingCarbonExport = false;
        }
      }

      this.$_alert.success("Successfully");
      this.loading = false;
      this.isOpen = false;
    },
    async onSubmitByMU() {
      if (this.loadingCarbonExport) return;

      const configUrl = {
        pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
        excel: `${this.$_config.baseUrlExport}export/farmer-land-polygon/excel`,
      };


      this.loadingCarbonExport = true;
      for (const [index, _mu] of this.mu_no.entries()) {
        if (!_mu) continue;

        let muName = this.muList.find((item) => item.mu_no == _mu)
          ? this.muList.find((item) => item.mu_no == _mu).name
          : "";

        let offset = 0;
        while (true) {
          const result = await this.getExportDataByMU(_mu, offset);
          console.log({result})
          if (!result) {
            this.loadingCarbonExport = false;
            break;
          }

          if (
            !Array.isArray(result.data) ||
            (Array.isArray(result.data) && result.data.length == 0 && this.exportData.length == 0)
          ) {
            this.loadingCarbonExport = false;
            this.$_alert.error(
              {},
              "Tidak ada data",
              `Tidak ada data di Unit Management ${muName} ${this.$store.state.tmpProgramYear}`
            );
            return;
          } else {
            console.log(result, offset)
            this.muLoadingProgress = result.total ? Math.min(100, Math.round((this.exportData.length / result.total) * 100)) : 100;
            this.exportData = [...this.exportData, ...result.data]
            if (result.data.length < 500) break;
            offset += 500;
          }



        }


        const trees = await this.$_api
          .get("GetTreesAll")
          .then((res) => {
            return res.data.result.data;
          })
          .catch((err) => {
            console.log("err", err);
            return false;
          });

        if (!trees) {
          this.loading = false;
          continue;
        }



        if (muName) {
          muName = muName.replace(/ /g, "");
        }

        const configFilename = {
          pdf: `Report-${muName}-${_mu}-${moment().format(
            "DMMYYYYHHmmss"
          )}.pdf`,
          excel: `Report-${muName}-${_mu}-${moment().format(
            "DMMYYYYHHmmss"
          )}.xlsx`,
        };
        const axiosConfig = {
          method: "POST",
          url: configUrl[this.format],
          responseType: "arraybuffer",
          data: {
            data: this.exportData,
            trees: trees,
            exportBy: this.exportBy,
            name: muName,
            program_year: this.$store.state.tmpProgramYear,
          },
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        };
        const exported = await axios(axiosConfig)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            return false;
          });

        if (!exported) {
          this.loadingCarbonExport = false;
          continue;
        }

        const url = URL.createObjectURL(new Blob([exported.data]));
        const link = document.createElement("a");
        link.href = url;

        const filename = configFilename[this.format];
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        // reset after complete download, then filled by next UM
        this.exportData = [];

        // stop the loading when the last download completed
        if (index === this.mu_no.length - 1) {
          this.loadingCarbonExport = false;
        }
      }

      this.$_alert.success("Successfully");
      this.loading = false;
      this.isOpen = false;
    },
    async onSubmitByUM() {
      if (this.loadingExportByUM) return;

      const configUrl = {
        pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
        excel: `${this.$_config.baseUrlExport}export/farmer-land-polygon/excel`,
      };

      this.loadingExportByUM = true;
      for (const [index, _um] of this.employee_no_um.entries()) {
          if (!_um) continue;

          let umName = this.umList.find((item) => item.nik == _um)
              ? this.umList.find((item) => item.nik == _um).name
              : "";

          let offset = 0;
          while (true) {
              const result = await this.getExportDataByEmployee(_um, offset);
              if (!result) {
                  this.loadingExportByUM = false;
                  break;
              }

              if (offset == 0 && result.data.length == 0) {
                  this.loadingExportByUM = false;
                  this.$_alert.error(
                      {},
                      "Tidak ada data",
                      `Tidak ada data di Target Area ${umName} ${this.$store.state.tmpProgramYear}`
                  );
                  return;
              } else {
                  console.log(result, offset)
                  this.exportData = [...this.exportData, ...result.data]
                  if (result.data.length < 100) break;
                  offset += 100;
              }



          }


          const trees = await this.$_api
              .get("GetTreesAll")
              .then((res) => {
                  return res.data.result.data;
              })
              .catch((err) => {
                  console.log("err", err);
                  return false;
              });

          if (!trees) {
              this.loading = false;
              continue;
          }

          const configFilename = {
              pdf: `Report-${umName.replace(/ /g, "")}-${_um}-${moment().format(
                  "DMMYYYYHHmmss"
              )}.pdf`,
              excel: `Report-${umName.replace(/ /g, "")}-${_um}-${moment().format(
                  "DMMYYYYHHmmss"
              )}.xlsx`,
          };
          const axiosConfig = {
              method: "POST",
              url: configUrl[this.format],
              responseType: "arraybuffer",
              data: {
                  data: this.exportData,
                  trees: trees,
                  exportBy: this.exportBy,
                  name: umName,
                  program_year: this.$store.state.tmpProgramYear,
              },
              headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${this.$store.state.token}`,
              },
          };
          const exported = await axios(axiosConfig)
              .then((res) => {
                  return res;
              })
              .catch((err) => {
                  return false;
              });

          if (!exported) {
              this.loadingExportByUM = false;
              continue;
          }

          const url = URL.createObjectURL(new Blob([exported.data]));
          const link = document.createElement("a");
          link.href = url;

          const filename = configFilename[this.format];
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();

          // reset after complete download, then filled by next UM
          this.exportData = [];

          // stop the loading when the last download completed
          if (index === this.employee_no_um.length - 1) {
              this.loadingExportByUM = false;
          }
      }

      this.$_alert.success("Successfully");
      this.loading = false;
      this.isOpen = false;
    },
    async onSubmitByFC() {
        if (this.loadingExportByFC) return;

        const configUrl = {
          pdf: `${this.$_config.baseUrlExport}export/farmer-land-polygon/pdf`,
          excel: `${this.$_config.baseUrlExport}export/farmer-land-polygon/excel`,
        };

        this.loadingExportByFC = true;
        for (const [index, _fc] of this.employee_no_fc.entries()) {
            if (!_fc) continue;
            
            let fcName = this.fcList.find((item) => item.nik == _fc)
                ? this.fcList.find((item) => item.nik == _fc).name
                : "";

            let offset = 0;
            while (true) {
                const result = await this.getExportDataByEmployee(_fc, offset);
                if (!result) {
                    this.loadingExportByFC = false;
                    break;
                }

                if (offset == 0 && result.data.length == 0) {
                    this.loadingExportByFC = false;
                    this.$_alert.error(
                        {},
                        "Tidak ada data",
                        `Tidak ada data dari FC ${fcName} ${this.$store.state.tmpProgramYear}`
                    );
                    return;
                } else {
                    console.log(result, offset)
                    this.exportData = [...this.exportData, ...result.data]
                    if (result.data.length < 100) break;
                    offset += 100;
                }



            }


            const trees = await this.$_api
                .get("GetTreesAll")
                .then((res) => {
                    return res.data.result.data;
                })
                .catch((err) => {
                    console.log("err", err);
                    return false;
                });

            if (!trees) {
                this.loading = false;
                continue;
            }

            const configFilename = {
                pdf: `Report-${fcName.replace(/ /g, "")}-${_fc}-${moment().format(
                    "DMMYYYYHHmmss"
                )}.pdf`,
                excel: `Report-${fcName.replace(/ /g, "")}-${_fc}-${moment().format(
                    "DMMYYYYHHmmss"
                )}.xlsx`,
            };
            const axiosConfig = {
                method: "POST",
                url: configUrl[this.format],
                responseType: "arraybuffer",
                data: {
                    data: this.exportData,
                    trees: trees,
                    exportBy: this.exportBy,
                    name: fcName,
                    program_year: this.$store.state.tmpProgramYear,
                },
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${this.$store.state.token}`,
                },
            };
            const exported = await axios(axiosConfig)
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    return false;
                });

            if (!exported) {
                this.loadingExportByFC = false;
                continue;
            }

            const url = URL.createObjectURL(new Blob([exported.data]));
            const link = document.createElement("a");
            link.href = url;

            const filename = configFilename[this.format];
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();

            // reset after complete download, then filled by next UM
            this.exportData = [];

            // stop the loading when the last download completed
            if (index === this.employee_no_fc.length - 1) {
                this.loadingExportByFC = false;
            }
        }

        this.$_alert.success("Successfully");
        this.loading = false;
        this.isOpen = false;
    },

    test(data) {
      console.log("data", data);
    },
    test2(data) {
      console.log("data", data);
    },
  },

  mounted() {
    // this.getInitialData();
  },
};
</script>
