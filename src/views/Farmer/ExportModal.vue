<template>
  <v-dialog v-model="isOpen" width="50%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <span>Export Petani by Management Unit</span>
        </v-card-title>

        <v-card-text class="farmer-assign-wrapper mt-3">
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
              <v-row>
                <v-col lg="12">
                  <geko-input v-model="muNo" :item="{
                    label: 'Unit Management',
                    placeholder: 'Pilih Unit Management',
                    type: 'select',
                    validation: ['required'],
                    api: 'new-utilities/management-units',
                    param: {
                      limit: 1000,
                    },
                    option: {
                      multiple: false,
                      list_pointer: {
                        label: 'name',
                        code: 'mu_no',
                        display: ['name', 'mu_no'],
                      },
                    },
                  }" />
                </v-col>

                <v-col lg="12">
                  <v-btn :disabled="!muNo" variant="success" type="submit" v-if="">
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
import moment from "moment";
import axios from "axios";
export default {
  name: 'ExportModal',
  props: {
    exportKey: {
      required: true,
    }
  },
  methods: {
    getExportData() {
      return new Promise(async (resolve, reject) => {
        this.$_api
          .get("export/farmerAll", {
            program_year: this.$store.state.tmpProgramYear,
            mu_no: this.muNo,
          })
          .then((res) => {
            return resolve(res.data);
          })
          .catch((err) => reject(false));
      });
    },
    async onSubmit() {
      if (this.loading) return;

      try {
        this.loading = true;
        const exportData = await this.getExportData().catch(() => false)
        if (!Array.isArray(exportData) || (Array.isArray(exportData) && exportData.length) == 0) {
          throw "Not Found"
        }
        
        
        const axiosConfig = {
          method: "POST",
          url: `${this.$_config.baseUrlExport}export/farmers/excel`,
          responseType: "arraybuffer",
          data: {
            data: exportData,
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

        const exportFilename = `Export-Farmers-${this.muNo}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`
        
        console.log('export result', exported);
        const url = URL.createObjectURL(new Blob([exported.data]));
        const link = document.createElement("a");
        const filename = exportFilename;
        link.href = url;
        
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        this.$_alert.success("Successfully");
        this.loading = false;
        this.isOpen = false;

      }

      catch (err) {
        if (typeof err === 'string') {
          this.$_alert.error(err)
        }
        this.loading = false
      }

    },
  },
  data() {
    return {
      isOpen: false,
      muNo: null,
    }
  },
  watch: {
    exportKey(t) {
      if (t > 0) {
        // this.getInitialData()
        // this.getFFDataForExport()
        // this.getUMDataForExport()
        this.isOpen = true;
      }
    },
  },
}
</script>