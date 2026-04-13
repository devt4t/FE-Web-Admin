<template>
  <v-dialog v-model="isOpen" width="70%">
    <template v-slot:default="{ isActive }">
      <v-card class="mx-auto">
        <v-card-title>Export Detail Data Monitoring 6 ({{ data.monitoring6_no }}), Petani: {{ data.farmer_name }},
          Lahan:
          {{ data.lahan_no }}</v-card-title>

        <v-col>
          <v-btn variant="success" class="d-flex flex-row align-items-center ml-2 mt-3" @click="onExportExcel()">
            <v-icon small v-if="!exportIds.includes(data.id)">mdi-microsoft-excel</v-icon>
            <v-progress-circular v-else indeterminate :size="20" color="success"></v-progress-circular>
            <span>Export Excel</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="danger" class="d-flex flex-row align-items-center ml-2 mt-3" @click="onExportPdf()">
            <v-icon small v-if="!exportPdfIds.includes(data.id)">mdi-file-pdf-box</v-icon>
            <v-progress-circular v-else indeterminate :size="20" color="danger"></v-progress-circular>
            <span>Export PDF</span>
          </v-btn>
        </v-col>
      </v-card>
    </template>
  </v-dialog>
</template>



<script>
import moment from "moment";
import axios from "axios";
export default {
  name: "monitoring-detail-export",
  props: {
    data: {
      required: true,
      default: () => { },
    },
    dataKey: {
      required: true,
      default: 0,
      type: Number,
    },
  },

  methods: {
    async onOpen() {
      console.log(this.data);
      var MonitoringDetailUrl =
        `sixth-monitorings/main/detail?id=${this.data.id}`;
      var resMonitoringDetail = await this.$_api.get(MonitoringDetailUrl);
      this.monitoringData = resMonitoringDetail;
    },
    async onExportExcel() {
      try {
        if (this.exportIds.includes(this.data.id)) {
          // console.log('this.data', this.exportIds.includes(this.data.id));
          return;
        }
        this.exportIds.push(this.data.id)
        const monitoring_data = this.monitoringData

        if (monitoring_data.result.length == 0) throw "err"

        //EXPORT DATA
        const exportEndpoint = `${this.$_config.baseUrlExport}export/monitoring2/excel`
        const exportPayload = {
          data: monitoring_data.result
        }
        const exportFilename = `Export-monitoring6-${monitoring_data.result.monitoring6_no}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`

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
        let idx = this.exportIds.findIndex(x => x === this.data.id)
        if (idx > -1) this.exportIds.splice(idx, 1)

      }

      catch (err) {
        console.log('err', err);

        let idx = this.exportIds.findIndex(x => x === this.data.id)
        if (idx > -1) this.exportIds.splice(idx, 1)
      }
    },
    async onExportPdf() {
      try {
        if (this.exportPdfIds.includes(this.data.id)) {
          // console.log('this.data', this.exportPdfIds.includes(this.data.id));
          return;
        }
        this.exportPdfIds.push(this.data.id)
        const monitoring_data = this.monitoringData

        if (monitoring_data.result.length == 0) throw "err"

        //EXPORT DATA
        const exportEndpoint = `${this.$_config.baseUrlExport}export/monitoring2/pdf`
        const exportPayload = {
          data: monitoring_data.result
        }
        const exportFilename = `Export-monitoring6-${monitoring_data.result.monitoring6_no}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.pdf`

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
        let idx = this.exportPdfIds.findIndex(x => x === this.data.id)
        if (idx > -1) this.exportPdfIds.splice(idx, 1)

      }

      catch (err) {
        console.log('err', err);

        let idx = this.exportPdfIds.findIndex(x => x === this.data.id)
        if (idx > -1) this.exportPdfIds.splice(idx, 1)
      }
    }
  },

  watch: {
    dataKey(t) {
      if (t > 0) {
        this.isOpen = true;
      }
    },
    isOpen(t) {
      console.log("open change", this.isOpen);
      if (t) {
        this.onOpen();
      } else {
        this.monitoringData = null;
        this.loading = false;
        this.error = "";
      }
    },
  },
  data() {
    return {
      isOpen: false,
      monitoringData: null,
      exportPdfIds: [],
      exportIds: [],
      loading: false,
      error: "",
    };
  },
};
</script>