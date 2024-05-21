<template>
  <v-row class="scooping-visit-detail">
    <v-col md="4">
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="scooping-visit-detail-card mb-5"
      >
        <v-card-title>
          <v-icon large class="mr-2" @click="$router.go(-1)"
            >mdi-arrow-left-circle</v-icon
          >
          <h5 class="mb-0 pb-0">Detail {{ title }}</h5>
        </v-card-title>
        <div class="scooping-visit-wrapper">
          <div
            class="scooping-visit-list mb-3"
            v-for="(row, i) in fields"
            :key="'row-' + i"
          >
            <h6>{{ row.name }}</h6>
            <div
              class="scooping-visit-item"
              v-for="(f, j) in row.items"
              :key="'row-' + i + j"
            >
              <div class="label">{{ f.label }}</div>
              <div
                class="value d-flex flex-row"
                v-if="f.type === 'badge' && f.value_type == 'array'"
                style="flex-wrap: wrap"
              >
                <span
                  class="badge mr-1 mb-1"
                  v-for="(item, i) in data[f.key].split(',')"
                  :class="{
                    [`bg-${f.variant ? f.variant : 'light'}`]: true,
                  }"
                  :key="f.key + i"
                  v-if="data[f.key]"
                  >{{
                    item | parse(f.transform ? f.transform : "no-empty")
                  }}</span
                >
              </div>
              <div class="value" v-else-if="f.type === 'badge'">
                <span
                  class="badge"
                  :class="{
                    [`bg-${f.variant ? f.variant : 'light'}`]: true,
                  }"
                  v-if="data[f.key]"
                  >{{
                    data[f.key] | parse(f.transform ? f.transform : "no-empty")
                  }}</span
                >
              </div>
              <div class="value" v-else>
                <span>{{
                  data[f.key] | parse(f.transform ? f.transform : "no-empty")
                }}</span>
                <span v-if="f.append"> {{ f.append }}</span>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col md="8">
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="scooping-visit-detail-card mb-5"
      >
        <v-card-title>
          <h5 class="mb-0 pb-0">Dokumentasi, Map &amp; Lainnya</h5>
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "scooping-visit-detail",
  data() {
    return {
      data: {},
      fields: [
        {
          name: "Lokasi & tanggal scooping visit",
          items: [
            {
              key: "provinces_name",
              label: "Provinsi",
            },

            {
              key: "kabupatens_name",
              label: "Kabupaten / Kota",
            },

            {
              key: "kecamatans_name",
              label: "Kecamatan",
            },

            {
              key: "desas_name",
              label: "Desa",
            },

            {
              key: "start_scooping_date",
              label: "Tanggal",
              type: "badge",
              transform: "date",
              variant: "primary",
            },
          ],
        },
        {
          name: "Scooping Data",
          items: [
            {
              key: "land_area",
              label: "Luas Desa",
              append: "Ha",
              transform: "thousand-separator",
            },
            {
              key: "accessibility",
              label: "Aksesibilitas",
            },
            {
              key: "water_source",
              label: "Sumber Air",
              type: "badge",
              variant: "primary",
              value_type: "array",
            },
            {
              key: "electricity_source",
              label: "Sumber Listrik",
              type: "badge",
              variant: "primary",
              value_type: "array",
            },
            {
              key: "goverment_place",
              label: "Tempat Pemerintahan",
              type: "badge",
              variant: "light",
              value_type: "array",
            },
          ],
        },
        {
          name: "Data Populasi & Wilayah",
          items: [
            {
              key: "total_kk",
              label: "Total Keluarga (KK)",
              transform: "thousand-separator",
            },
            {
              key: "total_male",
              label: "Total Laki - Laki",
              transform: "thousand-separator",
            },
            {
              key: "total_female",
              label: "Total Perempuan",
              transform: "thousand-separator",
            },
            {
              key: "total_dusun",
              label: "Total Dusun",
            },
            {
              key: "potential_dusun",
              label: "Dusun Potensial",
            },
            // {
            //   key: "potential_description",
            //   label: "Deskripsi Potensi",
            // },
          ],
        },

        {
          name: "Kelengkapan Data Lahan Kering",
          items: [
            {
              key: "total_kk",
              label: "Luas Lahan Kering",
              append: "Ha",
              transform: "thousand-separator",
            },
            {
              key: "land_type",
              label: "Jenis Tanah",
              type: "badge",
              variant: "light",
              value_type: "array",
            },
            {
              key: "altitude",
              label: "Ketinggian Tanah (mdpl)",
              transform: "thousand-separator",
              type: "badge",
              value_type: "array",
            },
            {
              key: "slope",
              label: "Kelerengan Tanah",
              type: "badge",
              variant: "light",
              value_type: "array",
            },
            {
              key: "vegetation_density",
              label: "Kerapatan Vegetasi",
              type: "badge",
              variant: "light",
              value_type: "array",
            },
            {
              key: "land_coverage",
              label: "Cakupan Lahan",

              type: "badge",
              variant: "light",
              value_type: "array",
            },
            {
              key: "agroforestry_type",
              label: "Pola Tanam Lahan Kering",
              type: "badge",
              variant: "light",
              value_type: "array",
            },
            {
              key: "rainfall",
              label: "Curah Hujan (mm)",
              type: "badge",
              variant: "light",
              value_type: "array",
            },
          ],
        },
      ],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      this.$_api
        .get("GetDetailScoopingVisit_new", { id: this.$route.query.id })
        .then((res) => {
          this.data = res.data;
        });
    },
  },
};
</script>
