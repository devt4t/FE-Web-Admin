<template>
  <v-dialog v-model="isOpen" width="50%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <span>Export Pendataan (Petani - Lahan - Polygon)</span>
        </v-card-title>

        <v-card-text class="farmer-assign-wrapper mt-3">
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
              <v-row>
                <v-col lg="12">
                  <geko-input
                    v-model="ff_code"
                    :item="{
                      label: 'Field Facilitator',
                      placeholder: 'Pilih Field Facilitator',
                      type: 'select',
                      validation: ['required'],
                      api: 'GetFFAllWeb_new',
                      option: {
                        list_pointer: {
                          label: 'name',
                          code: 'ff_no',
                          display: ['name'],
                        },
                      },
                    }"
                  />
                </v-col>

                <v-col lg="12">
                  <v-btn variant="success" type="submit">
                    <v-icon v-if="!loading">mdi-microsoft-excel</v-icon>

                    <v-progress-circular
                      v-else
                      :size="20"
                      color="success"
                      indeterminate
                    ></v-progress-circular>
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
  name: "lahan-export-modal",
  data() {
    return {
      ff_code: null,
      isOpen: false,
      loading: false,
    };
  },
  props: {
    dataKey: {
      required: false,
      default: false,
    },
  },

  watch: {
    dataKey(t) {
      console.log("modal open", t);
      if (t > 0) {
        this.isOpen = true;
      }

      if (!t) {
        this.ff_code = null;
      }
    },
  },

  methods: {
    async onSubmit() {
      if (this.loading) return;

      this.loading = true;

      const result = await this.$_api
        .get("getExportDataLahanFarmer_new", {
          program_year: this.$store.state.tmpProgramYear,
          ff_no: this.ff_code,
          limit: 100000,
          offset: 0,
        })
        .catch(() => {
          return false;
        });

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
          `FF ${this.ff_code} tidak memiliki petani/lahan di tahun ${this.$store.state.tmpProgramYear}`
        );
        return;
      }

      const axiosConfig = {
        method: "POST",
        url: `${this.$_config.baseUrlExport}export/farmer-land-polygon/excel`,
        responseType: "arraybuffer",
        data: {
          data: result.data,
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
        return this.$_alert.error({}, "Export Gagal");
      }
      //   console.log("buffer excel", exported);

      const url = URL.createObjectURL(new Blob([exported.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = `report-pendataan-${moment().format(
        "DMMYYYYHHmmss"
      )}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      this.$_alert.success("Successfully");
      this.loading = false;
      this.isOpen = false;
    },
  },

  mounted() {},
};
</script>
