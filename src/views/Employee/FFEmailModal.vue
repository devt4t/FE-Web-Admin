<template>
  <v-dialog v-model="isOpen" width="50%">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>Perbarui Email FF </v-card-title>
        <v-card-text class="ff-email-wrapper">
          <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
              <v-row>
                <v-col lg="12">
                  <geko-input
                    v-model="formData.tmp_name"
                    :item="{
                      type: 'text',
                      label: 'Nama FF',
                      validation: ['required'],
                    }"
                    :disabled="true"
                  />
                </v-col>
                <v-col lg="12">
                  <geko-input
                    v-model="formData.ff_no"
                    :item="{
                      type: 'text',
                      label: 'Kode FF',
                      validation: ['required'],
                    }"
                    :disabled="true"
                  />
                </v-col>
                <v-col lg="12">
                  <geko-input
                    v-model="formData.name"
                    :item="{
                      type: 'text',
                      label: 'Email',
                      validation: ['required'],
                      placeholder: 'Masukkan email baru tanpa tanda @',
                      append: '@t4t.org',
                    }"
                  />
                  <!-- <div class="alert info">
                    <v-icon>mdi-information-outline</v-icon>
                    <span>Email akan dikombinasikan otomatis dari nama FF</span>
                  </div> -->
                </v-col>

                <v-col lg="12">
                  <div class="d-flex flex-row justify-content-center">
                    <v-btn
                      variant="warning"
                      class="d-flex flex-row align-items-center"
                      type="submit"
                      :disabled="loading"
                    >
                      <v-icon class="mr-1">mdi-email-edit-outline</v-icon>
                      <span>Perbarui Email FF</span>
                    </v-btn>
                  </div>
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
export default {
  name: "ff-email-modal",
  props: {
    data: {
      required: true,
      default: () => {},
    },
    dataKey: {
      required: true,
      default: 0,
      type: Number,
    },
  },

  methods: {
    onOpen() {
      this.isOpen = true;
      this.formData = {
        email: "",
        tmp_name: this.data.name,
        ff_no: this.data.ff_no,
        name: "",
      };
    },

    onSubmit() {
      if (this.loading) return;
      this.loading = true;
      let _payload = JSON.parse(JSON.stringify(this.formData));

      _payload.name = _payload.name.split("@")[0];
      this.$_api
        .post("createUpdateFFUserData", _payload)
        .then((res) => {
          this.$_alert.success("Email FF berhasil diperbarui");
          this.$emit("success", true);
          this.loading = false;
          this.isOpen = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },

  watch: {
    dataKey(t) {
      if (t > 0) {
        this.isOpen = true;
      }
    },
    isOpen(t) {
      if (t) {
        this.onOpen();
      } else {
        this.formData = {};
      }
    },
  },
  data() {
    return {
      isOpen: false,
      formData: {},
      loading: false,
    };
  },
};
</script>
