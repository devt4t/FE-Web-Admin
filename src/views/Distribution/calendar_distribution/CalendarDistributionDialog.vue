<template>
  <div>
    <v-dialog
      v-model="isOpen"
      max-width="1000px"
      content-class="rounded-xl"
      scrollable
      persistent
    >
      <v-card>
        <!-- loading overlay -->
        <v-overlay :value="isLoading" absolute class="rounded-xl" color="white">
          <div class="d-flex flex-column align-center justify-center">
            <v-progress-circular
              indeterminate
              color="green"
              size="72"
              width="7"
              class="mt-10"
            ></v-progress-circular>
            <p class="green--text mt-2">Memuat Data ...</p>
          </div>
        </v-overlay>
        <!-- header -->
        <v-toolbar flat>
          <span class="text-h6">
            <v-icon>mdi-calendar-outline</v-icon>
            Detail Kalendar
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="isOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <!-- content -->
        <v-card-text>
          <v-container>
            <!-- detail distribution ff && statistic -->
            <v-row>
              <!-- detail distribution ff -->
              <v-col cols="12" lg="6" v-if="sostam && sostam.data">
                <table>
                  <!-- program_year -->
                  <tr>
                    <td>Program</td>
                    <td>:</td>
                    <td>{{ sostam.data.program_year }}</td>
                  </tr>
                  <!-- management_unit_name -->
                  <tr>
                    <td>MU</td>
                    <td>:</td>
                    <td class="font-weight-bold">
                      {{ sostam.data.management_unit_name }}
                    </td>
                  </tr>
                  <!-- target_area_name -->
                  <tr>
                    <td>TA</td>
                    <td>:</td>
                    <td>{{ sostam.data.target_area_name }}</td>
                  </tr>
                  <!-- field_facilitator_name -->
                  <tr>
                    <td>FF</td>
                    <td>:</td>
                    <td>
                      {{ sostam.data.field_facilitator_name }} <br />
                      <v-chip x-small color="info">
                        {{ sostam.data.ff_no }}
                        <v-icon
                          x-small
                          class="ml-1"
                          @click="copyToClipboard(sostam.data.ff_no)"
                        >
                          mdi-content-copy
                        </v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <!-- distribution_date -->
                  <tr>
                    <td>Tgl Distribusi</td>
                    <td>:</td>
                    <td class="font-weight-bold">
                      {{ sostam.data.distribution_date | parse("date") }}
                    </td>
                  </tr>
                </table>
                <!-- progress lahan penlub geko & nms -->
                <div
                  class="d-inline-block py-2 px-4 d-flex flex-column align-items-center justify-content-center"
                >
                  <p class="mb-1 font-weight-bold text-center">
                    <v-icon>mdi-progress-check</v-icon> Progress Lahan Penlub
                    Geko & NMS
                  </p>
                  <v-row class="justify-content-center">
                    <v-col
                      cols="auto"
                      class="d-flex flex-column align-items-center"
                    >
                      <v-progress-circular
                        :rotate="360"
                        :size="100"
                        :width="15"
                        :value="progressGEKO"
                        color="purple"
                      >
                        {{ progressGEKO }} %
                      </v-progress-circular>
                      <p class="mb-1 font-weight-bold">Penlub GEKO</p>
                    </v-col>
                    <v-col
                      cols="auto"
                      class="d-flex flex-column align-items-center"
                    >
                      <v-progress-circular
                        :rotate="360"
                        :size="100"
                        :width="15"
                        :value="progressGEKONMS"
                        color="success"
                      >
                        {{ progressGEKONMS }} %
                      </v-progress-circular>
                      <p class="mb-1 font-weight-bold">Penlub NMS</p>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <!-- statistic -->
              <v-col cols="12" lg="6">
                <p class="font-weight-bold text-center">
                  <v-icon>mdi-select-compare</v-icon>
                  Komparasi Data Sostam, Penlub GEKO & NMS
                </p>
                <!-- sostam -->
                <v-row>
                  <!-- totalLahanSostam -->
                  <v-col cols="6" class="pa-1">
                    <statistic-card
                      :item="{
                        title: 'Lahan Sostam',
                        icon: 'mdi-land-fields',
                        value: totalLahanSostam,
                        color: 'warning',
                      }"
                    ></statistic-card>
                  </v-col>
                  <!-- totalSeedSostam -->
                  <v-col cols="6" class="pa-1">
                    <statistic-card
                      :item="{
                        title: 'Bibit Sostam',
                        icon: 'mdi-tree-outline',
                        value: totalSeedSostam,
                        color: 'warning',
                      }"
                    ></statistic-card>
                  </v-col>
                </v-row>
                <!-- penlub -->
                <v-row>
                  <!-- totalLahanPenlub -->
                  <v-col cols="6" class="pa-1">
                    <statistic-card
                      :item="{
                        title: 'Lahan Penlub',
                        icon: 'mdi-land-fields',
                        value: totalLahanPenlub,
                        color: 'info',
                      }"
                    ></statistic-card>
                  </v-col>
                  <!-- totalSeedPenlub -->
                  <v-col cols="6" class="pa-1">
                    <statistic-card
                      :item="{
                        title: 'Bibit Penlub',
                        icon: 'mdi-tree-outline',
                        value: totalSeedPenlub,
                        color: 'info',
                      }"
                    ></statistic-card>
                  </v-col>
                </v-row>
                <!-- NMS penlub -->
                <v-row>
                  <!-- totalLahanPenlubNMS -->
                  <v-col cols="6" class="pa-1">
                    <statistic-card
                      :item="{
                        title: 'Lahan Penlub NMS',
                        icon: 'mdi-land-fields',
                        value: totalLahanPenlubNMS,
                        color: 'success',
                      }"
                    ></statistic-card>
                  </v-col>
                  <!-- totalSeedPenlubNMS -->
                  <v-col cols="6" class="pa-1">
                    <statistic-card
                      :item="{
                        title: 'Bibit Penlub NMS',
                        icon: 'mdi-tree-outline',
                        value: totalSeedPenlubNMS,
                        color: 'success',
                      }"
                    ></statistic-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- Tabs -->
            <v-tabs v-model="tab" color="green" class="mt-3">
              <v-tab>Per-Jenis</v-tab>
              <v-tab>Per-Lahan</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <!-- list per-jenis -->
              <v-tab-item>
                <!-- chart list per jenis -->
                <GChart
                  type="ColumnChart"
                  :data="chartPerSeeds"
                  :options="perSeedChartOptions"
                />
                <!-- table list per jenis -->
                <v-data-table
                  :headers="perSeedHeaders"
                  :items="listSeedMixed"
                  :items-per-page="5"
                  class="elevation-1"
                >
                  <template #item.tree_name="{ item }">
                    <p
                      :class="`mb-0 ${
                        item.penlub === item.penlub_nms ? 'green' : 'red'
                      }--text`"
                    >
                      {{ item.tree_name }}
                    </p>
                  </template>
                  <template #item.sostam="{ item }">
                    {{ Number(item.sostam).toLocaleString("id") }}
                  </template>
                  <template #item.penlub="{ item }">
                    {{ Number(item.penlub).toLocaleString("id") }}
                  </template>
                  <template #item.penlub_nms="{ item }">
                    <p
                      :class="`mb-0 font-weight-bold ${
                        item.penlub === item.penlub_nms ? 'green' : 'red'
                      }--text`"
                    >
                      {{ Number(item.penlub_nms).toLocaleString("id") }}
                    </p>
                  </template>
                </v-data-table>
              </v-tab-item>
              <!-- list per-lahan -->
              <v-tab-item>
                <!-- table list per lahan -->
                <v-data-table
                  :headers="perLandHeaders"
                  :items="listLahanMixed"
                  :expanded.sync="perLandExpanded"
                  item-key="lahan_no"
                  :items-per-page="5"
                  class="elevation-1"
                  show-expand
                >
                  <template #item.farmer_name="{ item }">
                    <p
                      :class="`mb-0 ${
                        item.total_penlub === item.total_penlub_nms
                          ? 'green'
                          : 'red'
                      }--text`"
                    >
                      {{ item.farmer_name }} <br />
                      <v-chip x-small color="info" class="mb-1">
                        {{ item.farmer_no }}
                        <v-icon
                          x-small
                          class="ml-1"
                          @click="copyToClipboard(item.farmer_no)"
                        >
                          mdi-content-copy
                        </v-icon>
                      </v-chip>
                    </p>
                  </template>
                  <template #item.lahan_no="{ item }">
                    {{ item.lahan_no }}
                    <v-icon
                      small
                      class="ml-1"
                      @click="copyToClipboard(item.lahan_no)"
                    >
                      mdi-content-copy
                    </v-icon>
                  </template>
                  <template #item.total_sostam="{ item }">
                    {{ Number(item.total_sostam).toLocaleString("id") }}
                  </template>
                  <template #item.total_penlub="{ item }">
                    {{ Number(item.total_penlub).toLocaleString("id") }}
                  </template>
                  <template #item.total_penlub_nms="{ item }">
                    <p
                      :class="`mb-0 font-weight-bold ${
                        item.total_penlub === item.total_penlub_nms
                          ? 'green'
                          : 'red'
                      }--text`"
                    >
                      {{ Number(item.total_penlub_nms).toLocaleString("id") }}
                    </p>
                  </template>
                  <!-- expand item -->
                  <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length" class="white">
                      <v-alert
                        v-if="item.penlub_id && !item.penlub_is_validate"
                        class="mt-5 py-3"
                        outlined
                        type="warning"
                        border="left"
                        icon="mdi-alert-circle-outline"
                      >
                        Lahan Penilikan Lubang <b>Belum Verifikasi</b>
                        <v-tooltip v-if="item.penlub_id && item.ph_form_no" top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                              class="ml-3"
                              color="warning"
                              small
                              @click="openPagePenlub(item)"
                              icon
                            >
                              <v-icon left>mdi-page-next</v-icon>
                            </v-btn>
                          </template>
                          <span>Buka Halaman Penilikan Lubang Lahan</span>
                        </v-tooltip>
                      </v-alert>
                      <!-- list jenis -->
                      <p class="pt-3 font-weight-bold mb-1 text-info">
                        <v-icon class="text-info">mdi-tree-outline</v-icon>
                        Detail Per-Jenis
                      </p>
                      <v-simple-table dense class="mb-2">
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">Jenis</th>
                              <th class="text-left">Sostam</th>
                              <th class="text-left">Penlub GEKO</th>
                              <th class="text-left">Penlub NMS</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(i, index) in item.seeds"
                              :key="`${i.tree_code}-${item.lahan_no}-${index}`"
                            >
                              <td>
                                <p
                                  :class="`mb-0 ${
                                    i.penlub === i.penlub_nms ? 'green' : 'red'
                                  }--text`"
                                >
                                  {{ i.tree_name }}
                                </p>
                              </td>
                              <td>{{ i.sostam }}</td>
                              <td>{{ i.penlub }}</td>
                              <td>
                                <p
                                  :class="`mb-0 font-weight-bold ${
                                    i.penlub === i.penlub_nms ? 'green' : 'red'
                                  }--text`"
                                >
                                  {{ i.penlub_nms }}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                      <!-- btn action to detail activity -->
                      <v-row class="mb-5 mt-0 justify-content-center">
                        <v-btn
                          v-if="
                            sostam &&
                            sostam.data &&
                            sostam.data.id &&
                            sostam.data.soc_no
                          "
                          class="mx-1"
                          color="warning"
                          small
                          @click="openPageSostam()"
                        >
                          <v-icon left>mdi-page-next</v-icon>
                          Halaman Sostam
                        </v-btn>
                        <v-btn
                          v-if="item.penlub_id && item.ph_form_no"
                          class="mx-1"
                          color="success"
                          small
                          @click="openPagePenlub(item)"
                        >
                          <v-icon left>mdi-page-next</v-icon>
                          Halaman Penlub
                        </v-btn>
                      </v-row>
                    </td>
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs-items>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import statisticCard from "./components/statisticCard.vue";

export default {
  components: { statisticCard },
  name: "GekoCalendarDistributionDialog",

  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selectedData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      eventData: {},
      gekoPenlub: null,
      isLoading: false,
      isOpen: false,
      nmsPenlub: [],
      perSeedChartOptions: {
        chart: {
          title: "Company Performance",
          subtitle: "Sales, Expenses, and Profit: 2014-2017",
        },
      },
      perLandExpanded: [],
      perLandHeaders: [
        { text: "Petani", value: "farmer_name" },
        { text: "Lahan", value: "lahan_no" },
        { text: "Sostam", value: "total_sostam" },
        { text: "Penlub", value: "total_penlub" },
        { text: "Penlub NMS", value: "total_penlub_nms" },
        { text: "", value: "data-table-expand" },
      ],
      perSeedHeaders: [
        { text: "Jenis", value: "tree_name" },
        { text: "Sostama", value: "sostam" },
        { text: "Penlub GEKO", value: "penlub" },
        { text: "Penlub NMS", value: "penlub_nms" },
      ],
      sostam: null,
      tab: 1,
    };
  },

  computed: {
    // SOSTAM _______________________________________________
    listLahanSostam() {
      if (!this.sostam || !this.sostam.farmers) return [];

      return this.sostam.farmers;
    },
    totalLahanSostam() {
      return this.listLahanSostam.length;
    },
    listSeedsSostam() {
      return Object.values(
        this.listLahanSostam.reduce((acc, lahan) => {
          lahan.seeds.map((seed) => {
            if (!acc[seed.tree_code]) {
              acc[seed.tree_code] = {
                tree_code: seed.tree_code,
                tree_name: seed.tree_name,
                amount: 0,
              };
            }
            acc[seed.tree_code].amount += parseInt(seed.total_seed);
          });
          return acc;
        }, {})
      );
    },
    totalSeedSostam() {
      return this.listSeedsSostam.reduce((acc, val) => {
        return (acc += val.amount);
      }, 0);
    },
    // PENLUB GEKO _______________________________________________
    listLahanPenlub() {
      if (!this.gekoPenlub || !this.gekoPenlub.data_seeds) return [];

      return this.gekoPenlub.data_seeds.map((v) => {
        const detaiData = this.gekoPenlub.data.find(
          (p) => p.lahan_no == v.lahan_no
        );
        return {
          ...v,
          penlub_id: detaiData ? detaiData.id : null,
        };
      });
    },
    totalLahanPenlub() {
      return this.listLahanPenlub.length;
    },
    listSeedPenlub() {
      return Object.values(
        this.listLahanPenlub.reduce((acc, lahan) => {
          lahan.detail_seeds.map((seed) => {
            if (!acc[seed.tree_code]) {
              acc[seed.tree_code] = {
                tree_code: seed.tree_code,
                tree_name: seed.tree_name,
                amount: 0,
              };
            }
            acc[seed.tree_code].amount += parseInt(seed.amount);
          });
          return acc;
        }, {})
      );
    },
    totalSeedPenlub() {
      return this.listSeedPenlub.reduce((acc, val) => {
        return (acc += val.amount);
      }, 0);
    },
    progressGEKO() {
      return Math.floor((this.totalLahanPenlub / this.totalLahanSostam) * 100);
    },
    // PENLUB GEKO NMS _______________________________________________
    totalLahanPenlubNMS() {
      return this.nmsPenlub.length;
    },
    listSeedPenlubNMS() {
      return Object.values(
        this.nmsPenlub.reduce((acc, lahan) => {
          lahan.detail_planting_hole.map((seed) => {
            if (!acc[seed.tree_code]) {
              acc[seed.tree_code] = {
                tree_code: seed.tree_code,
                tree_name: seed.tree_name,
                amount: 0,
              };
            }
            acc[seed.tree_code].amount += parseInt(seed.amount);
          });
          return acc;
        }, {})
      );
    },
    totalSeedPenlubNMS() {
      return this.listSeedPenlubNMS.reduce((acc, val) => {
        return (acc += parseInt(val.amount));
      }, 0);
    },
    progressGEKONMS() {
      return Math.floor(
        (this.totalLahanPenlubNMS / this.totalLahanPenlub) * 100
      );
    },
    // mixeed seeds
    listSeedMixed() {
      return this.listSeedsSostam
        .map((sostam) => {
          const penlub = this.listSeedPenlub.find(
            (p) => p.tree_code == sostam.tree_code
          );
          const penlubNMS = this.listSeedPenlubNMS.find(
            (p) => p.tree_code == sostam.tree_code
          );
          return {
            tree_name: sostam.tree_name,
            tree_code: sostam.tree_code,
            sostam: sostam.amount,
            penlub: penlub ? penlub.amount : 0,
            penlub_nms: penlubNMS ? penlubNMS.amount : 0,
          };
        })
        .sort((a, b) => b.sostam - a.sostam);
    },
    listLahanMixed() {
      return this.listLahanSostam
        .map((sostam) => {
          const lahanPenlub = this.listLahanPenlub.find(
            (v) => v.lahan_no === sostam.no_lahan
          );
          const lahanPenlubNMS = this.nmsPenlub.find(
            (v) => v.lahan_no === sostam.no_lahan
          );
          const listMixedSeedLahan = sostam.seeds.map((v) => {
            const seedPenlub = lahanPenlub
              ? lahanPenlub.detail_seeds.find(
                  (lp) => lp.tree_code === v.tree_code
                )
              : null;
            const seedPenlubNMS = lahanPenlubNMS
              ? lahanPenlubNMS.detail_planting_hole.find(
                  (lp) => lp.tree_code === v.tree_code
                )
              : null;

            return {
              tree_name: v.tree_name,
              tree_code: v.tree_code,
              sostam: parseInt(v.total_seed),
              penlub: seedPenlub ? parseInt(seedPenlub.amount) : 0,
              penlub_nms: seedPenlubNMS ? parseInt(seedPenlubNMS.amount) : 0,
            };
          });

          const seedSostamTotal = listMixedSeedLahan.reduce(
            (acc, val) => acc + val.sostam,
            0
          );
          const seedPenlubTotal = listMixedSeedLahan.reduce(
            (acc, val) => acc + val.penlub,
            0
          );
          const seedPenlubNMSTotal = listMixedSeedLahan.reduce(
            (acc, val) => acc + val.penlub_nms,
            0
          );

          return {
            farmer_name: sostam.farmer_name,
            farmer_no: sostam.farmer_no,
            lahan_no: sostam.no_lahan,
            penlub_id: lahanPenlub ? lahanPenlub.penlub_id : null,
            ph_form_no: lahanPenlub ? lahanPenlub.ph_form_no : null,
            penlub_is_validate: lahanPenlub ? lahanPenlub.is_validate : null,
            seeds: listMixedSeedLahan,
            total_sostam: seedSostamTotal,
            total_penlub: seedPenlubTotal,
            total_penlub_nms: seedPenlubNMSTotal,
          };
        })
        .sort((a, b) => b.total_sostam - a.total_sostam);
    },
    // Chart Data
    chartPerSeeds() {
      const chartData = [["Jenis Bibit", "Sostam", "Penlub", "Penlub NMS"]];
      this.listSeedMixed.map((seed) => {
        chartData.push([
          seed.tree_name,
          seed.sostam,
          seed.penlub,
          seed.penlub_nms,
        ]);
      });
      return chartData;
    },
  },

  watch: {
    show: function (newVal) {
      this.isOpen = newVal;
      this.eventData = this.selectedData;
    },
    isOpen: function (newVal) {
      if (newVal === true) this.initData();
      if (newVal === false) this.$emit("hide", true);
    },
  },

  mounted() {},

  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        this.$_alert.success("Copied to clipboard");
      });
    },
    initData: async function () {
      try {
        this.isLoading = true;
        const programYear = this.eventData.soc_no.split("-")[1];

        // get sostam
        const sostamDetail = await this.$_api.get("sostam/detail", {
          soc_no: this.eventData.soc_no,
          program_year: programYear,
        });
        this.sostam = sostamDetail;

        // get penlub
        const gekoPenlubRes = await this.$_api.get(
          "new-planting-hole/list/export",
          {
            program_year: programYear,
            ff_no: sostamDetail.data.ff_no,
            limit: 200,
          }
        );
        this.gekoPenlub = gekoPenlubRes;

        // get penlubNursery
        const nurseryPenlubRes = await this.$_api.getNursery("public/list", {
          model: "distribution",
          limit: 200,
          ff_no: sostamDetail.data.ff_no,
          program_year: programYear,
        });
        this.nmsPenlub = nurseryPenlubRes.data;
      } catch (err) {
        console.log("CalendarDistributionDialog.vue error", err);
        this.$_alert.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    openPagePenlub(item) {
      const routeData = this.$router.resolve({
        path: "LubangTanamV2",
        query: {
          view: "detail",
          id: item.penlub_id,
          ph_form_no: item.ph_form_no,
        },
      });
      window.open(routeData.href, "_blank");
    },
    openPageSostam() {
      const routeData = this.$router.resolve({
        path: "sosialisasi-tanam-v2",
        query: {
          view: "detail",
          id: this.sostam.data.id,
          soc_no: this.sostam.data.soc_no,
        },
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>