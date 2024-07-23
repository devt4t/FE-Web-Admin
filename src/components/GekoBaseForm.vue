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
      <h4 class="mb-0 pb-0">
        {{ isCreate ? "Tambah" : "Perbarui" }} {{ title }}
      </h4>
    </v-card-title>

    <slot name="create-form">
      <ValidationObserver ref="mainForm" v-slot="{ handleSubmit }">
        <form
          @submit.prevent="handleSubmit(onSubmit)"
          autocomplete="off"
          v-if="ready"
        >
          <v-row class="geko-form-wrapper">
            <template
              v-for="(item, i) in !sort
                ? fields.filter((x) => x.input)
                : fields.filter((x) => x.input).sort(sortForm)"
              v-if="
                item.show_if
                  ? formData[item.show_if.id] == item.show_if.value
                  : true
              "
              :md="item.col_size"
            >
              <slot
                :name="
                  $route.query.view === 'create'
                    ? 'create' + '-' + item.view_data
                    : 'update' + '-' + item.view_data
                "
                v-bind:formData="formData"
                v-bind:setFormData="setFormData"
                v-bind:field="item"
              >
                <v-col md="12" v-if="item.separator" class="form-separator">
                  <h4>{{ item.separator }}</h4>
                </v-col>

                <v-col :md="item.col_size">
                  <geko-input
                    v-model="formData[item.setter]"
                    :item="{
                      label: item.label,
                      type: item.type,
                      validation: item.validation,
                      option: item.option,
                      api: item.getter,
                      param: item.param,
                      default_label: item.option
                        ? formData[item.option.default_label]
                        : '',
                    }"
                    :disabled="item.disabled || false"
                  />
                </v-col>
              </slot>
            </template>

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
    </slot>
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
    sort: {
      required: false,
      type: Array,
    },
    update_id_getter: {
      type: String,
    },

    update_id_setter: {
      type: String,
    },
  },

  data() {
    return {
      formData: {},
      isCreate: null,
      loading: false,
      ready: false,
    };
  },

  mounted() {
    this.isCreate = this.$route.query.view === "create";
    this.buildFields();
  },

  methods: {
    setFormData(key, value) {
      this.$set(this.formData, key, value);
    },
    sortForm(a, b) {
      var idxA = this.sort.indexOf(a["view_data"]);
      var idxB = this.sort.indexOf(b["view_data"]);
      if (idxA < idxB) {
        return -1;
      } else if (idxA > idxB) {
        return 1;
      } else {
        return 0;
      }
    },
    buildFields() {
      if (this.$route.query.view === "update" && !this.$route.params) {
        this.$_alert.error(null, "Data not found");
        return;
      }
      for (const f of this.fields) {
        let _value =
          f.option && f.option.default_value
            ? f.option.default_value
            : this.$route.params[f.getter || f.view_data];

        if (this.$route.query.view === "update") {
          if (f.type === "select" && f.option.default_label) {
            this.$set(
              this.formData,
              f.option.default_label,
              this.$route.params[f.option.default_label]
            );
          }

          this.$set(
            this.formData,
            f.setter || f.view_data,
            this.$route.params[
              f.option ? f.option.getter || f.view_data : f.view_data
            ]
          );
        } else {
          this.$set(this.formData, f.setter || f.view_data, _value);
        }
      }

      this.ready = true;
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
        payload[this.update_id_setter] =
          this.$route.query[this.update_id_getter];
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
