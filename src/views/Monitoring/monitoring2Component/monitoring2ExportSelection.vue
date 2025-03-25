<template>
    <v-dialog v-model="isOpen" width="70%">
      <template v-slot:default="{ isActive }">
        <v-card class="mx-auto">
          <v-card-title>Export Detail Data Monitoring 2 ({{ data.monitoring2_no }}), Petani: {{ data.farmer_name}}, Lahan: {{ data.lahan_no }}</v-card-title>
            
                <v-col>
                    <v-btn
                        v-if="!exportIds.includes(data.id)"
                        variant="success"
                        class="d-flex flex-row align-items-center ml-2 mt-3"
                        @click="onExportExcel()"
                        >
                        <v-icon>mdi-microsoft-excel</v-icon>
                        <span>Export Excel</span>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        variant="danger"
                        class="d-flex flex-row align-items-center ml-2 mt-3"
                        @click="onExportPdf()"
                        >
                        <v-icon>mdi-file-pdf-box</v-icon>
                        <span>Export PDF</span>
                    </v-btn>
                </v-col>
        </v-card>
      </template>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: "monitoring-detail-export",
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
      async onOpen() {
        console.log(this.data);
        var MonitoringDetailUrl =
            `second-monitorings/main/detail?id=${this.data.id}`;
          var resMonitoringDetail = await this.$_api.get(MonitoringDetailUrl);
          this.monitoringData = resMonitoringDetail;
      },
      async onExportExcel(){
        console.log(this.monitoringData);
        try {
                if (this.exportIds.includes(this.monitoringData.id)) {
                    // console.log('this.monitoringData', this.exportIds.includes(this.monitoringData.id));
                    return;
                }
                this.exportIds.push(this.monitoringData.id)
                // const monitoring_data = await this.$_api.get('second-monitorings/main/detail', {
                //     id: this.monitoringData.id
                // })

                if (this.monitoringData == null) throw "err"

                //EXPORT DATA
                const exportEndpoint = `${this.$_config.baseUrlExport}export/monitoring2/excel`
                const exportPayload = {
                    data: this.monitoringData
                }
                const exportFilename = `Export-Monitoring2-${this.monitoringData.monitoring2_no}-${moment().format('DD-MM-YYYY-HH:mm:ss')}.xlsx`

                console.log(exportFilename)

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
                let idx = this.exportIds.findIndex(x => x === this.monitoringData.id)
                if (idx > -1) this.exportIds.splice(idx, 1)

            }

            catch (err) {
                console.log('err', err);

                let idx = this.exportIds.findIndex(x => x === this.monitoringData.id)
                if (idx > -1) this.exportIds.splice(idx, 1)
            }
      },
      async onExportPdf(){
        console.log(this.monitoringData);
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
        exportIds: [],
        loading: false,
        error: "",
      };
    },
  };
  </script>
  