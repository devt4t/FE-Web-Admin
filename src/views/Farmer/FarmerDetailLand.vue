<template>
  <v-data-table
    :headers="header"
    :items="data"
    :search="''"
    class="rounded-xl elevation-1 mx-3 pa-1"
    data-aos="fade-up"
    data-aos-delay="100"
    data-aos-duration="800"
    :footer-props="{
      showCurrentPage: false,
      showFirstLastPage: false,
    }"
  >
    <template v-slot:top>
      <div
        class="geko-list-header d-flex flex-row justify-content-between px-5 py-3 mt-1"
      >
        <div class="pr-5 mr-5">
          <h4>Lahan Petani</h4>
        </div>
        <div class="land-filters">
          <v-btn
            :variant="item.program_year == programYear ? 'success' : 'light'"
            v-for="(item, i) in lands.filter(
              (obj1, i, arr) =>
                arr.findIndex(
                  (obj2) => obj2.program_year === obj1.program_year
                ) === i
            )"
            @click="getData(item.program_year)"
            class="ml-1"
            :key="`farmer-land-filter-${i}`"
            >{{ item.program_year }}</v-btn
          >
        </div>
      </div>
    </template>

    <template v-slot:item.indicator="{ item }">
      <div class="indicator-wrapper pt-1">
        <div
          class="indicator"
          :class="{
            warning:
              item.approve == 0 && item.updated_gis.toLowerCase() == 'belum',
            success: item.approve == 2 && item.eligible_status == 2,
            info:
              (item.approve == 0 &&
                item.updated_gis.toLowerCase() == 'sudah') ||
              (item.approve == 2 && item.eligible_status == 1),
            primary: item.approve == 1 && item.fc_complete_data !== null,
            danger:
              item.approve == 3 ||
              (item.approve == 2 && item.eligible_status == 0) ||
              (item.approve == 1 && item.fc_complete_data == null),
          }"
        ></div>
      </div>
    </template>

    <template v-slot:item.action="{ item }">
      <div class="geko-list-actions-wrapper d-flex flex-column">
        <div class="geko-list-actions">
          <button
            v-if="$_sys.isAllowed('lahan-detail')"
            class="geko-list-action-view"
            @click="
              $router.push({
                path: 'lahan-v2',
                query: {
                  view: 'detail',
                  id: item.id,
                },
              })
            "
          >
            <v-icon small>mdi-information-outline</v-icon>
          </button>
        </div>
      </div>
    </template>

    <template v-slot:item.index="{ index }">
      <div class="d-flex flex-row justify-content-center">
        {{ index + 1 }}
      </div>
    </template>

    <template v-slot:item.land_id="{ item }">
      <div class="d-flex flex-column">
        <span class="text-link">#{{ item.lahan_no }}</span>
        <span class="font-weight-500">{{ item.document_no }}</span>
      </div>
    </template>

    <template v-slot:item.land_area="{ item }">
      <div
        class="d-flex flex-row font-weight-bold justify-content-end min-w-100px"
      >
        {{ item.land_area | parse("ts") }} m&sup2;
      </div>
    </template>

    <template v-slot:item.ff_id="{ item }">
      <div class="d-flex flex-column">
        <span>{{ item.field_facilitators_name }}</span>
        <span class="badge bg-light">{{ item.user_id }}</span>
      </div>
    </template>

    <template v-slot:item.farmer_id="{ item }">
      <div class="d-flex flex-column">
        <span>{{ item.farmer_name }}</span>
        <span class="badge bg-light">{{ item.farmer_no }}</span>
      </div>
    </template>

    <template v-slot:item.pohon_kayu="{ item }">
      <span
        class="d-block text-center"
        v-if="
          Array.isArray(item.total_from_detail) &&
          item.total_from_detail.length > 0
        "
      >
        {{ item.total_from_detail[0].pohon_kayu_detail | parse("ts") }}
      </span>
    </template>

    <template v-slot:item.pohon_mpts="{ item }">
      <span
        class="d-block text-center"
        v-if="
          Array.isArray(item.total_from_detail) &&
          item.total_from_detail.length > 0
        "
      >
        {{ item.total_from_detail[0].pohon_mpts_detail | parse("ts") }}
      </span>
    </template>

    <template v-slot:item.kayu_mpts="{ item }">
      <span
        class="font-weight-bold d-block text-center"
        v-if="
          Array.isArray(item.total_from_detail) &&
          item.total_from_detail.length > 0
        "
        >{{
          (item.total_from_detail[0].pohon_kayu_detail +
            item.total_from_detail[0].pohon_mpts_detail)
            | parse("ts")
        }}</span
      >
    </template>

    <template v-slot:item.complete_data="{ item }">
      <div class="d-flex flex-row justify-content-center">
        <span
          class="badge"
          :class="{
            'bg-info': item.complete_data == 0,
            'bg-danger': item.complete_data == null,
            'bg-success': item.complete_data == 1,
          }"
          >{{
            item.complete_data == 1
              ? "Lengkap"
              : item.complete_data == 0
              ? "Belum Lengkap"
              : "Menunggu Verifikasi FC"
          }}</span
        >
      </div>
    </template>

    <template v-slot:item.status="{ item }">
      <div class="d-flex flex-row text-no-wrap" style="align-items: center">
        <div
          class="badge"
          :class="{
            'bg-warning':
              item.approve == 0 && item.updated_gis.toLowerCase() == 'belum',
            'bg-info':
              item.approve == 0 && item.updated_gis.toLowerCase() == 'sudah',
            'bg-primary': item.approve == 1 && item.fc_complete_data != null,
            'bg-success': item.approve == 2,
            'bg-danger':
              item.approve == 3 ||
              (item.approve == 1 && item.fc_complete_data == null),
          }"
        >
          <span v-if="item.approve == 1 && item.fc_complete_data == null"
            >Data Bermasalah</span
          >
          <span
            v-else-if="
              item.approve == 0 && item.updated_gis.toLowerCase() == 'belum'
            "
            >Belum Diverifikasi</span
          >
          <span
            v-else-if="
              item.approve == 0 && item.updated_gis.toLowerCase() == 'sudah'
            "
            >Diverifikasi GIS</span
          >
          <span v-else-if="item.approve == 1">Diverifikasi FC</span>
          <span v-else-if="item.approve == 2">Terverifikasi</span>
          <span v-else-if="item.approve == 3">Force Majeure</span>
        </div>
      </div>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "farmer-detail-land",
  props: {
    lands: {
      required: false,
      default: () => [],
    },
  },
  methods: {
    async getData(programYear = null) {
      if (this.lands.length == 0) {
        return;
      }
      this.loading = true;
      this.programYear = programYear || this.lands[0].program_year;
      const lahanList = await this.$_api.get("GetLahanAll_new", {
        farmer_no: this.$route.query.farmer_no,
        program_year: this.programYear,
        limit: 100,
        offset: 0,
      });

      this.data = lahanList.data;

      this.loading = false;
    },
  },
  watch: {
    lands(t) {
      if (Array.isArray(t)) {
        this.getData();
      }
    },
  },
  data() {
    return {
      header: [
        {
          text: "",
          key: "action",
          value: "action",
          class: "sticky-left",
          sortable: false,
        },
        {
          text: "No",
          key: "index",
          value: "index",
          class: "sticky-left",
          sortable: false,
        },
        {
          text: "",
          key: "indicator",
          value: "indicator",
          sortable: false,
        },
        {
          text: "Lahan",
          key: "land_id",
          value: "land_id",
          sortable: false,
        },
        {
          text: "Luas Lahan",
          key: "land_area",
          value: "land_area",
          sortable: false,
        },
        {
          text: "Nama FF",
          key: "ff_id",
          value: "ff_id",
          sortable: false,
        },
        {
          text: "Nama Petani",
          key: "farmer_id",
          value: "farmer_id",
          sortable: false,
        },
        {
          text: "Desa",
          key: "desas_name",
          value: "desas_name",
          sortable: false,
        },
        {
          text: "Pola Tanam",
          key: "lahan_type",
          value: "lahan_type",
          sortable: false,
        },
        {
          text: "Tutupan",
          key: "tutupan_lahan",
          value: "tutupan_lahan",
          sortable: false,
        },
        {
          text: "Kayu",
          key: "pohon_kayu",
          value: "pohon_kayu",
          sortable: false,
        },
        {
          text: "MPTS",
          key: "pohon_mpts",
          value: "pohon_mpts",
          sortable: false,
        },
        {
          text: "Kayu + MPTS",
          key: "kayu_mpts",
          value: "kayu_mpts",
          sortable: false,
        },
        {
          text: "Kelengkapan Data",
          key: "complete_data",
          value: "complete_data",
          sortable: false,
        },
        {
          text: "Status",
          key: "status",
          value: "status",
          sortable: false,
        },
      ],
      programYear: "2024",
      data: [],
      loading: false,
    };
  },
};
</script>
