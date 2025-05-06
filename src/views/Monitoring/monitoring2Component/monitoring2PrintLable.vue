<template>
  <v-dialog v-model="isOpen" width="70%">
    <template v-slot:default="{ isActive }">
      <v-card class="mx-auto">
        <v-card-title>Print Label Pohon Monitoring 2 ({{ data.monitoring2_no }}), Petani: {{ data.farmer_name }}, Lahan:
          {{ data.lahan_no }}</v-card-title>
        <form @submit.prevent="handleSubmit(onSubmitPrint())" autocomplete="off">
          <v-row>
            <v-col lg="12">
              <v-col>
                <h3>Total Label</h3>
              </v-col>
              <v-col lg="4" class="flex d-flex justify-center">
                <v-progress-circular :rotate="360" :size="200" :width="20"
                  :value="percentageFormat(monitoring_trees_lable.selected.length, monitoring_trees_lable.totalTrees)"
                  :color="`${monitoring_trees_lable.selected.length >= 1400 ? 'red' : 'green'}`">
                  <br>{{ monitoring_trees_lable.selected.length }} / {{ monitoring_trees_lable.totalTrees }} - Max
                  1400</br>
                  <br>
                  Persentase: {{percentageFormat(monitoring_trees_lable.selected.reduce((acc, val) => {
                    return acc + parseInt(val.total_hidup);
                  }, 0), monitoring_trees_lable.totalTrees)}}%
                  </br>
                </v-progress-circular>

              </v-col>
            </v-col>

            <v-col lg="12">
              <v-data-table :headers="monitoring_trees_lable.table.header" :items="monitoring_trees_lable.table.items"
                :server-items-length="monitoring_trees_lable.totalRecord" :loading="monitoring_trees_lable.loading"
                :items-per-page="monitoring_trees_lable.perPage" class="elevation-1" @update:page="onChangePage"
                :page="monitoring_trees_lable.page" @update:items-per-page="updatePerPage" :footer-props="{
                  itemsPerPageText: 'Jumlah Data Per Halaman',
                  itemsPerPageOptions: [10, 25, 50, 100, 200],
                  showCurrentPage: true,
                  showFirstLastPage: true,
                }" :show-select="true" v-model="monitoring_trees_lable.selected"
                :search="monitoring_trees_lable.search">
                <template v-slot:top>
                  <v-text-field v-model="monitoring_trees_lable.search" append-icon="mdi-magnify" color="green"
                    label="Pencarian" hide-details outlined rounded dense class="mr-2"
                    @input="GetData()"></v-text-field>
                </template>
                <template v-slot:item.index="{ index }">
                  {{ index + 1 }}
                </template>
                <template v-slot:item.data-table-select="{ isSelected, select }">
                  <v-simple-checkbox color="success" v-ripple :value="isSelected"
                    @input="select($event)"></v-simple-checkbox>
                </template>
              </v-data-table>
            </v-col>

            <v-col lg="12">
              <v-btn
                :disabled="monitoring_trees_lable.selected.length == 0 || monitoring_trees_lable.selected.length >= 1400"
                variant="success" type="submit">
                <v-icon v-if="!monitoring_trees_lable.loading">mdi-printer</v-icon>
                <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
                <span class="ml-1"> Print Lable</span>
              </v-btn>
            </v-col>
          </v-row>
        </form>
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
    onOpen() {
      this.monitoring_trees_lable.table.items = []
      this.GetData()
    },
    async GetData() {
      console.log(this.data);
      var payload = {
        'monitoring2_no': this.data.monitoring2_no,
        'limit': this.monitoring_trees_lable.perPage,
        'offset': this.monitoring_trees_lable.perPage * (this.monitoring_trees_lable.page - 1),
        'search_value': this.monitoring_trees_lable.search
      }
      var MonitoringDetailUrl = "second-monitorings/main/print-lable";
      var resMonitoringDetail = await this.$_api.get(MonitoringDetailUrl, payload);
      this.monitoring_trees_lable.table.items = resMonitoringDetail.result
      this.monitoring_trees_lable.totalRecord = resMonitoringDetail.total
      this.monitoring_trees_lable.totalTrees = resMonitoringDetail.total
      this.monitoring_trees_lable.loading = false
    },
    async onSubmitPrint() {
      console.log(this.monitoring_trees_lable.selected)

      const configUrl = `${this.$_config.baseUrlExport}export/label-monitoring2-populate/pdf`;

      const configFilename = `Label-Monitoring-Populate-${'selectedName'}-${moment().format("DMMYYYYHHmmss")}.pdf`;
      const axiosConfig = {
        method: "POST",
        url: configUrl,
        responseType: "arraybuffer",
        data: {
          data: this.monitoring_trees_lable.selected.filter(data=> {
            return {
              tree_no: data.tree_no,
              monitoring2_no: data.monitoring2_no,
              tree_name: data.tree_name,
              farmer_name: data.farmer_name,
              lahan_no: data.lahan_no, 
            }
          })
        },
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

      if (!exported) {
        this.loading = false;
      }

      const url = URL.createObjectURL(new Blob([exported.data]));
      const link = document.createElement("a");
      link.href = url;

      const filename = configFilename;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    },
    percentageFormat(partial, total) {
      return ((partial * 100) / total).toFixed(1);
    },
    onChangePage(t) {
      this.monitoring_trees_lable.page = t;
      this.monitoring_trees_lable.loading = true;
      this.GetData()
    },
    updatePerPage($p) {
      this.monitoring_trees_lable.perPage = $p;
      this.monitoring_trees_lable.loading = true;

      this.GetData()
    },
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
        this.monitoring_trees_lable.table.items = []
        this.monitoring_trees_lable.loading = false
        this.monitoring_trees_lable.selected = []
        this.monitoring_trees_lable.totalTrees = 0
        this.monitoring_trees_lable.totalRecord = 0
        this.error = "";
      }
    },
  },
  data() {
    return {
      isOpen: false,
      loading: false,
      error: "",
      monitoring_trees_lable: {
        selected: [],
        totalTrees: 0,
        table: {
          header: [
            {
              key: "index",
              sortable: false,
              text: "No",
              value: "index",
            },
            {
              key: "tree_no",
              sortable: false,
              text: "Kode Pohon",
              value: "tree_no",
            },
            {
              key: "monitoring2_no",
              sortable: false,
              text: "Nomor Monitoring 2",
              value: "monitoring2_no",
            },
            {
              key: "tree_name",
              sortable: false,
              text: "Nama Pohon",
              value: "tree_name",
            },
            {
              key: "farmer_name",
              sortable: false,
              text: "Nama Petani",
              value: "farmer_name",
            },
            {
              key: "lahan_no",
              sortable: false,
              text: "No. Lahan",
              value: "lahan_no",
            },
            {
              key: "village_name",
              sortable: false,
              text: "Desa",
              value: "village_name",
            }
          ],
          items: [],
        },
        totalRecord: 0,
        perPage: 10,
        page: 1,
        search: '',
        loading: false
      }
    };
  },
};
</script>