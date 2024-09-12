<template>
  <div class="lahan-gis-verification" v-if="ready">
    <div class="d-flex flex-row mb-3" style="justify-content: space-between">
      <h5>Verifikasi Data</h5>
      <button @click="$emit('close', true)"><v-icon>mdi-close</v-icon></button>
    </div>

    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col lg="12" v-if="role == 'um'">
            <geko-input
              v-model="formData.seed_verify_status"
              :item="{
                label: 'Verifikasi Jumlah Bibit',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: [
                    {
                      label: 'Tidak',
                      code: '0',
                    },
                    {
                      label: 'Ya',
                      code: '1',
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

          <v-col
            lg="12"
            v-if="role == 'um' && formData.seed_verify_status == 1"
          >
            <geko-input
              v-model="formData.eligible_status"
              :item="{
                label: 'Eligibilitas Lahan',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: [
                    {
                      label: 'Tidak Bisa Ikut',
                      code: '0',
                    },
                    {
                      label: 'Bisa Ikut Dengan Kondisi',
                      code: '1',
                    },
                    {
                      label: 'Bisa Ikut',
                      code: '2',
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
  name: "lahan-um-verification",
  props: {
    data: {
      required: true,
      type: Object,
      default: () => {},
    },
    questions: {
      required: false,
      default: () => [],
    },
    answers: {
      required: false,
      default: () => [],
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
    async handleUmVerification() {
      let verifList = [];
      if (this.formData.seed_verify_status == 1) {
        verifList.push("jumlah bibit");
        verifList.push("eligibilitas lahan");
      }
      if (this.formData.seed_verify_status == 0) verifList.push("jumlah bibit");

      const prompt = await this.$_alert.confirm(
        "Verifikasi?",
        `Apakah anda yakin ingin verifikasi ${verifList.join(" dan ")}?`,
        "Verifikasi"
      );

      if (!prompt.isConfirmed) {
        this.loading = false;
        return false;
      }

      let payload = {
        current_id: this.$route.query.id,
        verif_moduls: "verif",
        approval_status: 2,
      };

      const verifySeed = await this.$_api
        .post("UpdateSeedAmountVerification_new", payload)
        .then(() => {
          if (this.formData.seed_verify_status == 0) {
            this.loading = false;
            this.$_alert.success(
              `Data ${verifList.join(" dan ")} berhasil diverifikasi`
            );
            this.$emit("success", true);
            return false;
          } else {
            return true;
          }
        })
        .catch(() => {
          this.loading = false;
          return false;
        });

      if (!verifySeed) {
        this.loading = false;
        return;
      }

      const updateApproval = await this.$_api
        .post("UpdateLahanApproval_new", {
          approval_status: 2,
          current_id: this.$route.query.id,
          moduls: "verification",
        })
        .then(() => true)
        .catch(() => false);

      if (!updateApproval) {
        this.loading = false;
        return;
      }

      this.$_api
        .post("UpdateLahanEligibleStatus_new", {
          current_id: this.$route.query.id,
          eligible_status: parseInt(this.formData.eligible_status),
        })
        .then(() => {
          this.loading = false;
          this.$_alert.success(
            `Data ${verifList.join(" dan ")} berhasil diverifikasi`
          );
          this.$emit("success", true);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    async onSubmit() {
      let payload = JSON.parse(JSON.stringify(this.formData));
      payload.current_id = this.$route.query.id;

      this.loading = true;

      this.handleUmVerification();
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
