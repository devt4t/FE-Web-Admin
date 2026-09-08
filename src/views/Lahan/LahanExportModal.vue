<template>
  <v-dialog v-model="isOpen" width="50%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <span>Export Pendataan (Petani - Lahan - Polygon)</span>
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
              <form @submit.prevent="handleSubmit(onSubmitByFF)" autocomplete="off">
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
                    }" @option:selected="test($event)" :disabled="loading" />
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
                    <v-btn variant="success" type="submit" v-if="format == 'excel'" :disabled="loading">
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
                      label: 'Management Unit',
                      placeholder: 'Pilih Management Unit',
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
                    <v-btn variant="danger" type="submit" v-if="format == 'pdf'" :disabled="loading">
                      <v-icon v-if="!loading">mdi-file-pdf-box</v-icon>

                      <v-progress-circular v-else :size="20" color="danger" :value="muLoadingProgress" :rotate="-90">
                      </v-progress-circular>
                      <span v-if="loading">
                        &nbsp; {{ muLoadingProgress }}%
                      </span>
                      <span class="ml-1"> Export PDF</span>
                    </v-btn>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="success" type="submit" v-if="format == 'excel'" :disabled="loading">
                      <v-icon v-if="!loading">mdi-microsoft-excel</v-icon>
                      <v-progress-circular v-else :size="20" color="danger" :value="muLoadingProgress" :rotate="-90">
                      </v-progress-circular>
                      <span v-if="loading">
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
                    <v-progress-circular v-if="fcList.length == 0" indeterminate color="primary"></v-progress-circular>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="danger" type="submit" v-if="format == 'pdf'" :disabled="loading">
                      <v-icon v-if="!loading">mdi-file-pdf-box</v-icon>

                      <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
                      <span class="ml-1"> Export PDF</span>
                    </v-btn>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="success" type="submit" v-if="format == 'excel'" :disabled="loading">
                      <v-icon v-if="!loading">mdi-microsoft-excel</v-icon>
                      <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
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
                    <v-progress-circular v-if="umList.length == 0" indeterminate color="primary"></v-progress-circular>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="danger" type="submit" v-if="format == 'pdf'" :disable="loading">
                      <v-icon v-if="!loading">mdi-file-pdf-box</v-icon>

                      <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
                      <span class="ml-1"> Export PDF</span>
                    </v-btn>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="success" type="submit" v-if="format == 'excel'" :disabled="loading">
                      <v-icon v-if="!loading">mdi-microsoft-excel</v-icon>
                      <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
                      <span class="ml-1"> Export Excel</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </form>
            </ValidationObserver>
          </div>

          <div :class="exportBy === 'project' ? 'd-block' : 'd-none'">
            <ValidationObserver ref="projectForm" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onSubmitByProject)" autocomplete="off">
                <v-row>
                  <v-col>
                    <geko-input v-model="projectNo" :item="{
                      label: 'Projek',
                      placeholder: 'Pilih Projek',
                      type: 'select',
                      validation: ['required'],
                      api: 'GetProjectAllAdmin',
                      param: {
                        limit: 10,
                        offset: 0,
                      },
                      option: {
                        multiple: true,
                        getterKey: 'data',
                        list_pointer: {
                          label: 'project_name',
                          code: 'project_no',
                          display: ['project_name', 'project_no'],
                        }
                      }
                    }" />
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="danger" type="submit" v-if="format == 'pdf'" :disabled="loadingExportByProject">
                      <v-icon v-if="!loadingExportByProject">mdi-file-pdf-box</v-icon>

                      <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
                      <span class="ml-1"> Export PDF</span>
                    </v-btn>
                  </v-col>

                  <v-col lg="12">
                    <v-btn variant="success" type="submit" v-if="format == 'excel'" :disabled="loadingExportByProject">
                      <v-icon v-if="!loadingExportByProject">mdi-microsoft-excel</v-icon>
                      <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
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
      exportBy: 'ff',
      muLoadingProgress: 0,
      exportByOptions: [],
      ffList: [],
      muList: [],
      fcList: [],
      umList: [],
      exportData: [],
      projectNo: null,
      projectList: [],
      loadingExportByProject: false,
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
        this.getProjectDataForExport()

        if (this.format === 'pdf') {
          this.exportByOptions = [
            {
              label: 'Field Facilitator',
              code: 'ff',
            },
            {
              label: 'Unit Management',
              code: 'mu',
            },
          ];
        } else {
          this.exportByOptions = [
            {
              label: 'Field Facilitator',
              code: 'ff',
            },
            {
              label: 'Unit Management',
              code: 'mu',
            },
            {
              label: 'Field Coordinator',
              code: 'fc',
            },
            {
              label: 'Unit Manager',
              code: 'um',
            },
            {
              label: 'Projek',
              code: 'project',
            },
          ];
        }
        this.isOpen = true;
      }
      if (!t) {
        this.ff_code = null;
      }
    },
  },

  methods: {
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
    async getProjectDataForExport() {
      if (this.projectList && this.projectList.length > 0) return;

      const result = await this.$_api.get("GetProjectAllAdmin", {
        limit: 1000,
        offset: 0,
      });

      if (result.data && Array.isArray(result.data.data)) {
        this.projectList = result.data.data;
      } else if (Array.isArray(result.data)) {
        this.projectList = result.data;
      }
    },

    async exportGeneric(exportType, filterKey, selectedData) {
      moment.locale('id');

      if (!selectedData || selectedData.length === 0) {
        this.$_alert.error({}, "Pilih data terlebih dahulu!");
        return;
      }

      this.loading = true;
      try {
        const token = localStorage.getItem("token");

        for (const selectedId of selectedData) {

          let selectedName = "";
          let dataListToSearch = [];

          if (exportType === 'ff') dataListToSearch = this.ffList;
          else if (exportType === 'mu') dataListToSearch = this.muList;
          else if (exportType === 'fc') dataListToSearch = this.fcList;
          else if (exportType === 'um') dataListToSearch = this.umList;

          let itemKey = (exportType === 'fc' || exportType === 'um') ? 'nik' : `${exportType}_no`;

          const matchedItem = dataListToSearch.find(item => item[itemKey] == selectedId);
          if (matchedItem && matchedItem.name) {
            selectedName = matchedItem.name.replace(/ /g, "");
            if (selectedName.length > 50) selectedName = selectedName.substring(0, 50);
          }

          const payload = {
            exportType: exportType,
            filters: {
              program_year: this.$store.state.tmpProgramYear,
              token: token,
            }
          };
          payload.filters[filterKey] = [selectedId];

          const response = await axios({
            method: 'POST',
            url: `${this.$_config.baseUrlExport}export/farmer-land-polygon/excel`,
            responseType: "arraybuffer",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            data: payload
          });

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;

          const timestamp = moment().format("YYYYMMDD_HHmmss");
          let fileName = `Export_Lahan_${exportType.toUpperCase()}`;
          if (selectedName !== "") fileName += `_${selectedName}`;
          fileName += `_${this.$store.state.tmpProgramYear || 'ALL'}_${timestamp}.xlsx`;

          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

        }

        this.$_alert.success("Data berhasil di-export!");
        this.isOpen = false;
      } catch (err) {
        console.error("Export Error =>", err);
        if (err.response && err.response.data) {
          try {
            const decoder = new TextDecoder("utf-8");
            const errorMsg = JSON.parse(decoder.decode(err.response.data));
            this.$_alert.error({}, errorMsg.message || "Tidak ada data");
          } catch (e) {
            this.$_alert.error("Gagal Melakukan Export!");
          }
        } else {
          this.$_alert.error("Gagal Melakukan Export!");
        }
      } finally {
        this.loading = false;
      }
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
        // bersihkan elemen <a> dari DOM
        link.remove();
        // hapus blob dari memory browser
        window.URL.revokeObjectURL();

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

    async onSubmitByFF() {
      await this.exportGeneric("ff", "ff_no", this.ff_code);
    },

    async onSubmitByUM() {
      await this.exportGeneric("um", "um_no", this.employee_no_um);
    },

    async onSubmitByFC() {
      await this.exportGeneric("fc", "fc_no", this.employee_no_fc);
    },

    async onSubmitByMU() {
      await this.exportGeneric("mu", "mu_no", this.mu_no);
    },

    async onSubmitByProject(item) {
      if (this.loadingExportByProject) return;

      this.loadingExportByProject = true;

      let selectedNames = "";
      if (this.projectNo && this.projectNo.length > 0) {
        const items = this.projectList.filter(p => this.projectNo.includes(p.project_no));
        selectedNames = items.map(p => {
          let cleanName = p.project_name ? p.project_name.replace(/ /g, "") : "Unknown";
          return `${cleanName}_${p.project_no}`;
        }).join('_');
        if (selectedNames.length > 50) {
          selectedNames = selectedNames.substring(0, 50) + "_dan_lainnya";
        }
      }

      const token = localStorage.getItem('token');
      try {
        for (const projId of this.projectNo) {

          // 1. Cari Nama Projek
          let selectedName = "";
          const matchedItem = this.projectList.find(p => p.project_no == projId);
          if (matchedItem) {
            let cleanName = matchedItem.project_name ? matchedItem.project_name.replace(/ /g, "") : "Unknown";
            selectedName = `${cleanName}_${matchedItem.project_no}`;
            if (selectedName.length > 50) selectedName = selectedName.substring(0, 50);
          }
          // 2. Tembak API
          const response = await axios({
            method: 'POST',
            url: `${this.$_config.baseUrlExport}export/land-by-project/excel`,
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            data: {
              project_no: [projId], // KIRM CUMA 1 ID (tapi di dalam array)
              program_year: this.$store.state.tmpProgramYear,
              token: token,
            },
          });

          // 3. Download File
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");

          const timestamp = moment().format("YYYYMMDD_HHmmss");
          let fileName = `Export_Lahan_Project`;
          if (selectedName !== "") fileName += `_${selectedName}`;
          fileName += `_${this.$store.state.tmpProgramYear || "ALL"}_${timestamp}.xlsx`;
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);

        }
        this.$_alert.success("Export success");
        this.isOpen = false;
      } catch (err) {
        console.error("Export Error =>", err);
        if (err.response && err.response.data) {
          try {
            const decoder = new TextDecoder("utf-8");
            const errorMsg = JSON.parse(decoder.decode(err.response.data));
            this.$_alert.error({}, errorMsg.message || "Tidak ada data");
          } catch (e) {
            this.$_alert.error("Gagal Melakukan Export!");
          }
        } else {
          this.$_alert.error("Gagal Melakukan Export!");
        }
      } finally {
        this.loadingExportByProject = false;
      }
    },
  },

  mounted() {
    // this.getInitialData();
  },
};
</script>
