<template>
  <div class="lahan-gis-verification" v-if="ready">
    <div class="d-flex flex-row mb-3" style="justify-content: space-between">
      <h5>Verifikasi Data</h5>
      <button @click="$emit('close', true)"><v-icon>mdi-close</v-icon></button>
    </div>

    <ValidationObserver ref="fcCompleteDataForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col lg="12" v-if="role == 'fc-verif-data'">
            <geko-input
              v-model="formData.fc_complete_data"
              :item="{
                label: 'Kelengkapan Data',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: [
                    {
                      label: 'Lengkap',
                      code: '1',
                    },
                    {
                      label: 'Tidak Lengkap',
                      code: '0',
                    },
                  ],
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
          <v-col lg="12">
            <v-btn
              type="submit"
              variant="warning"
              class="w-100"
              style="width: 100%"
              :disabled="loading"
            >
              <v-icon>mdi-pencil-outline</v-icon>
              <span>Verifikasi Data</span>
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import defaultData from "../LahanData.js";
export default {
  name: "lahan-verification-fc-complete-data",
  props: {
    data: {
      required: true,
      type: Object,
      default: () => {},
    },
    role: {
      required: false,
      default: null,
    },
    isCarbonProject: {
      required: false,
      default: null,
    },
  },
  mounted() {
    this.initData();
  },

  methods: {
    calculateTutupan(t, f, key) {
      let _pohon = parseInt(this.formData.tutupan_pohon_percentage) || 0;
      let _tanaman_bawah =
        parseInt(this.formData.tutupan_tanaman_bawah_percentage) || 0;
      let _lainnya =
        parseInt(this.formData.tutupan_lain_bangunan_percentage) || 0;

      const tutupanLahan = _pohon + _tanaman_bawah + _lainnya;
      const plantingArea = 100 - (_pohon + _tanaman_bawah + _lainnya);

      if (tutupanLahan > 100) {
        this.$_alert.error({}, "Tutupan lahan maksimal 100%");
        this.$set(this.formData, key, f);
        return;
      }
      this.$set(this.formData, "tutupan_lahan", tutupanLahan);
      this.$set(this.formData, "planting_area", plantingArea);
    },

    async onSubmit() {
      let payload = JSON.parse(JSON.stringify(this.formData));
      payload.current_id = this.$route.query.id;

      this.loading = true;
      if (this.role == "fc-verif-data") {
        const prompt = await this.$_alert.confirm(
          "Verifikasi?",
          "Apakah anda yakin ingin verifikasi kelengkapan data lahan?",
          "Verifikasi"
        );

        if (!prompt.isConfirmed) {
          this.loading = false;
          return;
        }
        await this.$_api
          .post("UpdateLahanFCCompleteStatus_new", {
            current_id: this.$route.query.id,
            fc_complete_data: parseInt(this.formData.fc_complete_data),
          })
          .then(() => {
            this.loading = false;
            this.$_alert.success("Data lahan berhasil diverifikasi");
            this.$emit("success", true);
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (this.role == "fc-non-carbon") {
        const isConfirmed = await this.$_alert.confirm(
          "Verifikasi?",
          "Apakah anda yakin ingin verifikasi kelengkapan data dan status lahan?",
          "Verifikasi"
        );

        if (!isConfirmed.isConfirmed) {
          this.loading = false;
          return;
        }

        const fcComplete = await this.$_api
          .post("UpdateLahanFCCompleteStatus_new", {
            current_id: this.$route.query.id,
            fc_complete_data: parseInt(this.formData.fc_complete_data),
          })
          .then(() => {
            return true;
          })
          .catch(() => {
            this.loading = false;

            return false;
          });

        if (!fcComplete) {
          this.loading = false;
        }

        this.$_api
          .post("UpdateLahanApproval_new", {
            moduls: "verification",
            current_id: this.$route.query.id,
            approval_status: 1,
          })
          .then(() => {
            this.loading = false;
            this.$_alert.success("Data lahan berhasil diverifikasi");
            this.$emit("success", true);
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },

    initData() {
      this.ready = true;
    },
  },
  computed: {
    defaultData() {
      return defaultData;
    },
  },
  data() {
    return {
      loading: false,
      formData: {},
      ready: false,
    };
  },
};
</script>
