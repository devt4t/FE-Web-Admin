<template>
  <v-dialog v-model="isOpen" width="50%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <span>Export Pendataan (Petani - Lahan Social Impact)</span>
        </v-card-title>

        <v-card-text class="farmer-assign-wrapper mt-3">
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
              <v-row>
                <v-col lg="12">
                  <geko-input
                    v-model="mu_no"
                    :item="{
                      label: 'Management Unit',
                      placeholder: 'Pilih Management Unit',
                      type: 'select',
                      validation: ['required'],
                      api: 'GetManagementUnitAdmin',
                      param: {
                        program_year: $store.state.tmpProgramYear,
                        limit: 50,
                      },
                      option: {
                        getterKey: 'data.result',
                        list_pointer: {
                          label: 'name',
                          code: 'mu_no',
                          display: ['name'],
                        },
                      },
                    }"
                    @selected="currentFfName = $event.name"
                  />
                </v-col>

                <v-col lg="12">
                  <v-btn
                    variant="success"
                    type="submit"
                    v-if="format == 'excel'"
                  >
                    <v-icon v-if="!loading">mdi-microsoft-excel</v-icon>
                    <v-progress-circular
                      v-else
                      :size="20"
                      color="danger"
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
      mu_no: null,
      isOpen: false,
      loading: false,
      currentFfName: "",
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
      console.log("modal open", t);
      if (t > 0) {
        this.isOpen = true;
      }

      if (!t) {
        this.mu_no = null;
      }
    },
  },

  methods: {
    test(data) {
      console.log("data", data);
    },
    // export data

    async onSubmit() {
      if (this.loading) return;

      this.loading = true;

      const result = await this.$_api
        .get("lahan-export/social-impact-officer", {
          program_year: this.$store.state.tmpProgramYear,
          mu_no: this.mu_no,
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
          `Management Unit ${this.mu_no} tidak memiliki petani/lahan di tahun ${this.$store.state.tmpProgramYear}`
        );
        return;
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

      // console.log("treee", trees);

      // this.loading = false;
      // return;

      const configUrl = {
        excel: `${this.$_config.baseUrlExport}export/farmer-land-social-impact/excel`,
      };

      const configFilename = {
        excel: `Report-${this.currentFfName.replace(/ /g, "")}-${
          this.mu_no
        }-${moment().format("DMMYYYYHHmmss")}.xlsx`,
      };
      const axiosConfig = {
        method: "POST",
        url: configUrl[this.format],
        responseType: "arraybuffer",
        data: {
          data: result.data,
          trees: trees,
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
        return this.$_alert.error({}, "Export Gagal");
      }
      //   console.log("buffer excel", exported);

      const url = URL.createObjectURL(new Blob([exported.data]));
      const link = document.createElement("a");
      link.href = url;
      // const filename = `Report-${this.currentFfName.replace(/ /g, "")}-${
      //   this.mu_no
      // }-${moment().format("DMMYYYYHHmmss")}.xlsx`;

      const filename = configFilename[this.format];
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
