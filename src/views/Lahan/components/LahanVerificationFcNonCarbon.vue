<template>
  <div class="lahan-gis-verification" v-if="ready">
    <div class="d-flex flex-row mb-3" style="justify-content: space-between">
      <h5>Verifikasi Data</h5>
      <button @click="$emit('close', true)"><v-icon>mdi-close</v-icon></button>
    </div>

    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row>
          <v-col lg="12">
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
  name: "lahan-fc-verification-non-carbon",
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
    async onSubmit() {
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
    },

    async submitIndicator() {
      return new Promise(async (resolve, reject) => {
        var i = 0;
        for (const question of this.questions) {
          const isCreate = this.answers.find((x) => question.id == x.term_id)
            ? false
            : true;
          await this.$_api
            .post(
              isCreate ? "addLahanTermAnswer_new" : "updateLahantermAnswer_new",
              {
                current_id: isCreate
                  ? null
                  : this.answers.find((x) => question.id == x.term_id).id,
                lahan_no: this.data.lahan_no,
                term_id: question.id,
                term_answer: this.formData[`question_${question.id}`],
                program_year: this.$_config.programYear.model || "2024",
              }
            )
            .then(() => {
              i += 1;

              if (i == this.questions.length) {
                return resolve(true);
              }
            })
            .catch((err) => {
              return reject(err);
            });
        }
      });
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
