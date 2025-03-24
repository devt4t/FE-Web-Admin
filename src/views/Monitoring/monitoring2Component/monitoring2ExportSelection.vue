<template>
    <v-dialog v-model="isOpen" width="70%">
      <template v-slot:default="{ isActive }">
        <v-card class="mx-auto">
          <v-card-title>Export Detail Data Monitoring 2 ({{ data.monitoring2_no }}), Petani: {{ data.farmer_name}}, Lahan: {{ data.lahan_no }}</v-card-title>
            
                <v-col>
                    <v-btn
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
          this.monitoringData = resMonitoringDetail.result;
      },
      onExportExcel(){
        console.log(this.monitoringData);
      },
      onExportPdf(){
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
        loading: false,
        error: "",
      };
    },
  };
  </script>
  