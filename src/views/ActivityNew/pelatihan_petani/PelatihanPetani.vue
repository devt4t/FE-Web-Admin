<template>
  <geko-base-crud :config="config" @onExportExcel="onExportExcel($event)" :hideUpdate="true">
    <template v-slot:list-bottom-action="{ item }">
      <v-btn v-if="item.status" variant="danger" small class="mt-2" @click="onUnverif(item)">
        <v-icon left small>mdi-undo</v-icon>
        <span>Unverifikasi</span>
      </v-btn>
      <v-btn v-else variant="success" small class="mt-2" @click="onVerif(item)">
        <v-icon left small>mdi-check-bold</v-icon>
        <span>Verifikasi</span>
      </v-btn>
    </template>

    <template v-slot:create-form>
      <pelatihan-petani-create></pelatihan-petani-create>
    </template>

    <template v-slot:detail-action="{ item }">
      <div>
        <v-btn v-if="!item.status" variant="success" @click="onVerif(item)">Verifikasi</v-btn>
        <v-btn v-else variant="danger" @click="onUnverif(item)">Unverifikasi</v-btn>
      </div>
    </template>

    <template v-slot:detail-slave-raw="{ data }">
      <pelatihan-petani-detail :data="data"></pelatihan-petani-detail>
    </template>

  </geko-base-crud>

</template>

<script>
import pelatihanPetaniConfig from './pelatihanPetaniConfig';
import PelatihanPetaniDetail from './PelatihanPetaniDetail.vue';
import PelatihanPetaniCreate from './PelatihanPetaniCreate.vue';

import "./pelatihan-petani.scss";

export default {
  name: "crud-pelatihan-petani",
  components: {
    PelatihanPetaniDetail,
    PelatihanPetaniCreate
  },
  data() {
    return {
      config: pelatihanPetaniConfig
    }
  },
  methods: {
    async onVerif(item) {
      const prompt = await this.$_alert.confirm('Verifikasi Pelatihan Petani?', 'Apakah anda yakin akan memverifikasi data pelatihan ini?', 'Ya, Verifikasi', 'Batal', true)

      console.log({ item })
    },
    async onUnverif(item) {
      const prompt = await this.$_alert.confirm('Unverifikasi Pelatihan?', 'Apakah anda yakin akan mengurungkan verifikasi pelatihan ini?', 'Ya, Unverifikasi', 'Batal', true)

      console.log({ item })
    },
    onExportExcel(data) {

    }
  }
}
</script>