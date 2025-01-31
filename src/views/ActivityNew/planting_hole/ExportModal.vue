<template>
  <v-dialog v-model="isOpen" width="50%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <span>Export Pendataan Lubang Tanam</span>
        </v-card-title>

        <v-card-text class="farmer-assign-wrapper mt-3">

          <v-row>
            <v-col lg="12">
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
                  default_options: [
                    {
                      label: 'Field Facilitator',
                      code: 'ff',
                    },
                    {
                      label: 'Target Area',
                      code: 'ta',
                    },
                    {
                      label: 'Date Range',
                      code: 'daterange',
                    },

                  ],
                },
              }" />
            </v-col>
          </v-row>

          <ValidationObserver :class="exportBy === 'ff' ? 'd-block' : 'd-none'" ref="firstForm"
            v-slot="{ handleSubmit }">
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

          <ValidationObserver :class="exportBy === 'ta' ? 'd-block' : 'd-none'" ref="firstForm"
            v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">

              <v-row>
                <v-col lg="12">
                  <geko-input v-if="taList.length > 0" v-model="area_code" :item="{
                    label: 'Target Area',
                    placeholder: 'Pilih Target Area',
                    type: 'select',
                    validation: ['required'],
                    api: 'GetFFAllWeb_new',
                    param: {
                      limit: 20,
                    },
                    option: {
                      multiple: true,
                      default_options: taList,
                      list_pointer: {
                        label: 'namaTa',
                        code: 'area_code',
                        display: ['namaTa', 'area_code'],
                      },
                    },
                  }" @option:selected="test($event)" :disabled="taList.length == 0" />
                  <v-progress-circular v-if="taList.length == 0" indeterminate color="primary"></v-progress-circular>
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

          <ValidationObserver :class="exportBy === 'daterange' ? 'd-block' : 'd-none'" ref="firstForm"
            v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">

              <v-row>
                <v-col lg="12">
                  <geko-input v-model="daterange" :item="{
                    label: 'Date Range',
                    placeholder: 'Pilih Date Range',
                    type: 'daterange',
                    validation: ['required'],
                  }" />
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
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "export-modal",
  data() {
    return {
      ff_code: [],
      area_code: [],
      daterange: null,
      isOpen: false,
      loading: false,
      currentFfName: "",
      exportBy: 'ff',
      ffList: [],
      taList: [],
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
        this.getFFList()
        this.getTAList()
        this.isOpen = true;
      }

      if (!t) {
        this.ff_code = null;
      }
    },
  },

  methods: {
    test(data) {
      console.log("data", data);
    },

    async getFFList() {
      if (this.ffList.length > 0) return;
      const result = await this.$_api.get("GetFFAllWeb_new", {
        limit: 10000,
        offset: 0,
      });

      if (!Array.isArray(result.data)) return;

      for (const item of result.data) {
        item.name = `${item.name} - ${item.ff_no}`;
      }

      this.ffList = result.data;
    },
    async getTAList() {
      if (this.taList.length > 0) return;
      const result = await this.$_api.get("GetTargetAreaAdmin", {
        program_year: 'Semua'
      });

      if (!Array.isArray(result.data.result)) return;

      for (const item of result.data.result) {
        item.name = `${item.namaTa} - ${item.area_code}`;
      }

      this.taList = result.data.result;
    },
    // export data

    getExportData(id) {
      return new Promise(async (resolve, reject) => {

        let payload = {
          program_year: this.$store.state.tmpProgramYear,
          limit: 5000,
          offset: 0,
        };

        if (this.exportBy == 'ta') {
          payload = { ...payload, 'area_code': id };
        } else if (this.exportBy == 'ff') {
          payload = { ...payload, 'ff_no': id };
        } else {
          return;
        }

        this.$_api
          .get("new-planting-hole/list/export", payload)
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
      let selectedData = [];

      if (this.exportBy == 'ff') {
        selectedData = [...this.ff_code]
      } else if (this.exportBy == 'ta') {
        selectedData = [...this.area_code]
      } else if (this.exportBy == 'daterange') {
        return this.exportByDateRange();
      }

      for (const _id of selectedData) {
        if (!_id) continue;

        const result = await this.getExportData(_id);

        if (!result) {
          this.loading = false;
          continue;
        }

        if (
          !Array.isArray(result.data) ||
          (Array.isArray(result.data) && result.data.length == 0)
        ) {
          if (selectedData.length == 1) {
            this.loading = false;
            this.$_alert.error(
              {},
              "Tidak ada data",
            );
            return;
          }
          continue;
        }

        const configUrl = {
          pdf: `${this.$_config.baseUrlExport}export/planting-hole/pdf`,
          excel: `${this.$_config.baseUrlExport}export/planting-hole/excel`,
        };

        let selectedName = ''

        if (this.exportBy == 'ff') {
          selectedName = this.ffList.find((item) => item.ff_no == _id)
            ? this.ffList.find((item) => item.ff_no == _id).name
            : "";
        } else if (this.exportBy == 'ta') {
          selectedName = this.taList.find((item) => item.area_code == _id)
            ? this.taList.find((item) => item.area_code == _id).name
            : "";
        }

        console.log('selectedName', selectedName)
        if (selectedName) {
          selectedName = selectedName.replace(/ /g, "");
        }

        const configFilename = {
          pdf: `Report-${selectedName}-${_id}-${moment().format(
            "DMMYYYYHHmmss"
          )}.pdf`,
          excel: `Report-${selectedName}-${_id}-${moment().format(
            "DMMYYYYHHmmss"
          )}.xlsx`,
        };
        const axiosConfig = {
          method: "POST",
          url: configUrl[this.format],
          responseType: "arraybuffer",
          data: {
            exportBy: this.exportBy,
            data: result.data
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
    async exportByDateRange() {
      const payload = {
        program_year: this.$store.state.tmpProgramYear,
        start_date: this.daterange[0],
        end_date: this.daterange[1],
      };

      const result = await this.$_api.get("new-planting-hole/list/export-by-date", payload);

      if (!result) {
        this.loading = false;
        return;
      }

      if (
        !Array.isArray(result.data) ||
        (Array.isArray(result.data) && result.data.length == 0)
      ) {
        this.loading = false;
        this.$_alert.error(
          {},
          "Tidak ada data",
        );
        return;
      }


      const configUrl = {
        pdf: `${this.$_config.baseUrlExport}export/planting-hole/pdf`,
        excel: `${this.$_config.baseUrlExport}export/planting-hole/excel-by-daterange`,
      };

      const datas = Object.groupBy(result.data, ({ ff_no }) => ff_no);

      for (const ff_no of Object.keys(datas)) {

        // Menyusun header bibit
        let headerBibits = [];
        for (const item of datas[ff_no]) {
          headerBibits = headerBibits.concat(item.seed_detail)
        }
        headerBibits = Object.groupBy(headerBibits, ({ tree_name }) => tree_name);
        // Menyusun header bibit - end

        const axiosConfig = {
          method: "POST",
          url: configUrl[this.format],
          responseType: "arraybuffer",
          data: {
            exportBy: 'ff',
            data: datas[ff_no],
            bibit: Object.keys(headerBibits).map(bibit => {
              return { name: bibit }
            }),
            daterange: `${moment(this.daterange[0]).format("DD MMMM YYYY")} - ${moment(this.daterange[1]).format("DD MMMM YYYY")}`
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
          return;
        }

        const url = URL.createObjectURL(new Blob([exported.data]));
        const link = document.createElement("a");
        link.href = url;

        const configFilename = {
          pdf: `Report-Penlub-${datas[ff_no][0].ff_name}-${ff_no}-${moment(this.daterange[0]).format("DD MMMM YYYY")}-${moment(this.daterange[1]).format("DD MMMM YYYY")}.pdf`,
          excel: `Report-Penlub-${datas[ff_no][0].ff_name}-${ff_no}-${moment(this.daterange[0]).format("DD MMMM YYYY")}-${moment(this.daterange[1]).format("DD MMMM YYYY")}.xlsx`,
        };

        const filename = configFilename[this.format];
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      }

      this.$_alert.success("Successfully");
      this.loading = false;
      this.isOpen = false;
    },

    test(data) {
      console.log("data", data);
    },
  },

  mounted() {
    // this.getFFList();
  },
};
</script>
