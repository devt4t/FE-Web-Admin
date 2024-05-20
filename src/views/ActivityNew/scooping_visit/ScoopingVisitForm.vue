<template>
  <ValidationObserver ref="mainForm" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
      <v-row class="geko-form-wrapper" v-if="ready">
        <v-col md="12" class="form-separator">
          <h4>Lokasi &amp; Tanggal Kegiatan Scooping</h4>
        </v-col>

        <v-col md="6">
          <geko-input
            v-model="formData.province_id"
            :item="{
              type: 'select',
              label: 'Provinsi',
              api: 'GetProvince',
            }"
          />
        </v-col>
      </v-row>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  name: "scooping-visit-form",
  data() {
    return {
      formData: {
        ready: false,
      },
    };
  },

  methods: {
    onSubmit() {},
  },
};
</script>
