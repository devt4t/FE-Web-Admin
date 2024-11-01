<template>
  <geko-base-crud :config="config" @onExportExcel="onExportExcel($event)" :hideUpdate="true" :refreshKey="refreshKey">

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
      <pelatihan-petani-create :user="user"></pelatihan-petani-create>
    </template>

    <template v-slot:detail-slave-raw="{ data }">
      <pelatihan-petani-detail :data="data"></pelatihan-petani-detail>
    </template>

    <template v-slot:detail-action="{ item }">
      <div>
        <v-btn v-if="!item.status" variant="success" @click="onVerifDetail(item)">Verifikasi</v-btn>
        <v-btn v-else variant="danger" @click="onUnverifDetail(item)">Unverifikasi</v-btn>
      </div>
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
      config: pelatihanPetaniConfig,
      user: {},
      refreshKey: 1,
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("User"));
    this.user = user;
    this.$set(this.config.delete_ext_payload, 'user_email', user.email);
    this.$set(this.config.deleteSoft.payload, 'user_email', user.email);
  },
  methods: {
    async onVerif(item) {
      const prompt = await this.$_alert.confirm('Verifikasi Pelatihan Petani?', 'Apakah anda yakin akan memverifikasi pelatihan ini?', 'Ya, Verifikasi', 'Batal', true)
      if (prompt.isConfirmed) {
        this.$_api.post('VerificationFarmerTraining', {
          training_no: item.training_no,
          verified_by: this.user.employee_no,
        })
          .then(() => {
            this.$_alert.success('Pelatihan berhasil diverifikasi')
            this.refreshKey += 1
          })
      }
    },
    async onUnverif(item) {
      const prompt = await this.$_alert.confirm('Unverifikasi Pelatihan?', 'Apakah anda yakin akan mengurungkan verifikasi pelatihan ini?', 'Ya, Unverifikasi', 'Batal', true)
      if (prompt.isConfirmed) {
        this.$_api.post('UnverificationFarmerTraining', {
          training_no: item.training_no,
          verified_by: this.user.employee_no,
        })
          .then(() => {
            this.$_alert.success('Pelatihan berhasil diunverifikasi')
            this.refreshKey += 1
          })

      }
    },
    async onVerifDetail(item){
      await this.onVerif(item);
      this.$router.go(-1);
    },
    async onUnverifDetail(item){
      await this.onUnverif(item);
      this.$router.go(-1);
    },
    onExportExcel(data) {

    }
  }
}
</script>