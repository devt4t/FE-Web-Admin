<template>
  <geko-base-crud :config="config" @onExportExcel="onExportExcel($event)" :hideCreate="true" :hideUpdate="true" :refreshKey="refreshKey">

    <template v-if="$_sys.isAllowed('pelatihan-petani-export-create')" v-slot:list-bottom-action="{ item }">
      <v-btn variant="success" small class="d-block mt-1" @click="onExportExcel(item)">
        <v-icon v-if="!exportIds.includes(item.training_no)">mdi-microsoft-excel</v-icon>
        <v-progress-circular v-else indeterminate :size="20" color="success"></v-progress-circular>

        <span>Export Excel</span>
      </v-btn>
      <v-btn v-if="item.status && $_sys.isAllowed('pelatihan-petani-unverification-create')" variant="danger" small
        class="mt-2" @click="onUnverif(item)">
        <v-icon left small>mdi-undo</v-icon>
        <span>Unverifikasi</span>
      </v-btn>
      <v-btn v-else-if="!item.status && $_sys.isAllowed('pelatihan-petani-verification-create')" variant="success" small
        class="mt-2" @click="onVerif(item)">
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

    <template v-if="this.$_sys.isAllowed('pelatihan-petani-update')" v-slot:detail-action="{ item }">
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

import moment from 'moment';
import axios from 'axios'

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
      exportIds: [],
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
    async onVerifDetail(item) {
      await this.onVerif(item);
      this.$router.go(-1);
    },
    async onUnverifDetail(item) {
      await this.onUnverif(item);
      this.$router.go(-1);
    },
    async onExportExcel(item) {
      try {
        if (this.exportIds.includes(item.training_no)) return
        this.exportIds.push(item.training_no)
        const training_data = await this.$_api.get('farmer-training/detail/export', {
          training_no: item.training_no
        })

        if (training_data.data.result.length == 0) throw "err"

        //EXPORT DATA
        const exportEndpoint = `${this.$_config.baseUrlExport}export/farmer-training/excel`
        const exportPayload = {
          data: training_data.data.result
        }
        const exportFilename = `Export-PelatihanPetani-${training_data.data.result.um_name.replace(/ /g, '')}-${training_data.data.result.desa}-${training_data.data.result.training_no}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`

        const axiosConfig = {
          method: "POST",
          url: exportEndpoint,
          responseType: "arraybuffer",
          data: exportPayload,
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

        if (!exported) throw "ERR"
        const url = URL.createObjectURL(new Blob([exported.data]));
        const link = document.createElement("a");
        link.href = url;

        const filename = exportFilename;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        let idx = this.exportIds.findIndex(x => x === item.training_no)
        if (idx > -1) this.exportIds.splice(idx, 1)

      }

      catch (err) {
        console.log('err', err);

        let idx = this.exportIds.findIndex(x => x === item.training_no)
        if (idx > -1) this.exportIds.splice(idx, 1)
      }

    },
  }
}
</script>