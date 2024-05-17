<template>
  <v-card
    data-aos="fade-up"
    data-aos-delay="100"
    data-aos-duration="800"
    class="geko-form-card mb-5"
  >
    <v-card-title>
      <v-icon large class="mr-2" @click="$router.go(-1)"
        >mdi-arrow-left-circle</v-icon
      >
      <h4 class="mb-0 pb-0">Tambah {{ title }}</h4>
    </v-card-title>

    <ValidationObserver ref="mainForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row class="geko-form-wrapper m-4">
          <v-col
            v-for="(item, i) in fields.filter((x) => x.input)"
            :key="title + i"
            :md="item.col_size"
          >
            <geko-input
              v-model="formData[item.setter]"
              :item="{
                label: item.label,
                type: item.type,
                validation: item.validation,
              }"
            />
          </v-col>

          <v-col md="12">
            <div class="form-footer">
              <v-btn variant="light" class="mr-3" @click="$router.go(-1)">
                Batal
              </v-btn>
              <v-btn
                :variant="isCreate ? 'success' : 'warning'"
                type="submit"
                :disabled="loading"
              >
                <v-icon v-if="isCreate && !loading">mdi-plus</v-icon>
                <v-icon v-if="!isCreate && !loading" small class="mr-1"
                  >mdi-pencil-minus</v-icon
                >

                <v-progress-circular
                  v-if="loading"
                  :color="isCreate ? 'green' : 'amber'"
                  indeterminate
                  :width="2"
                  :size="15"
                  class="mr-1"
                ></v-progress-circular>

                <span>{{ isCreate ? "Tambah" : "Perbarui" }} Data</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </v-card>
</template>

<script>
export default {
  name: "geko-base-form",
  props: {
    title: {
      required: true,
      type: String,
    },
    setter: {
      required: true,
      type: String,
    },
    update: {
      type: String,
      default: null,
    },
    setterExtPayload: {
      type: Object,
      default: () => {},
    },
    updateExtPayload: {
      type: Object,
      default: () => {},
    },
    fields: {
      required: true,
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      formData: {},
      isCreate: null,
      loading: false,
    };
  },

  mounted() {
    this.isCreate = this.$route.query.view === "create";
    this.buildFields();
  },

  methods: {
    buildFields() {
      if (this.$route.query.view === "update" && !this.$route.params) {
        this.$_alert.error(null, "Data not found");
        return;
      }
      for (const f of this.fields) {
        console.log(f.setter);
        this.$set(
          this.formData,
          f.setter || f.view_data,
          this.$route.params[f.getter || f.view_data]
        );
      }
    },
    onSubmit() {
      if (this.loading) return;
      this.loading = true;
      let extPayload = {};
      if (this.isCreate && this.setterExtPayload) {
        extPayload = this.setterExtPayload;
      }

      if (!this.isCreate && this.updateExtPayload) {
        extPayload = this.updateExtPayload;
      }

      let payload = Object.assign(
        JSON.parse(JSON.stringify(this.formData)),
        extPayload
      );
      for (const f of this.fields) {
        if (f.input) continue;
        if (f.default === "current_user_id") {
          payload[f.view_data] = this.$store.state.User.id;
        }
      }

      if (!this.isCreate) {
        payload.id = this.$route.query.id;
      }

      const endpoint = this.isCreate
        ? this.setter
        : this.update
        ? this.update
        : this.setter;
      this.$_api
        .post(endpoint, payload)
        .then((res) => {
          this.loading = false;
          this.$emit("success");
          this.$_alert.success(
            `Data berhasil ${this.isCreate ? "ditambahkan" : "diperbarui"}`
          );
          this.$router.go(-1);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
