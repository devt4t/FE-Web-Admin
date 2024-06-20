<template>
  <div class="rra-detail" v-if="data && Array.isArray(configs)">
    <!-- ADD PRA -->
    <div v-if="activeTab == 1 && !data.mainPra">
      <v-btn
        variant="success"
        @click="
          $router.push({
            query: {
              view: 'create',
              id: '',
              type: 'pra',
              scooping_visit_code: scoopingData.data_no,
              scooping_visit_village: scoopingData.desas_name,
              rra_code: rraCode,
              scooping_visit_start: scoopingData.start_scooping_date,
              scooping_visit_end: scoopingData.end_scooping_date,
            },
          })
        "
      >
        <v-icon>mdi-plus</v-icon>
        <span>Tambah Data Pra</span>
      </v-btn>
    </div>
    <!-- END ADD PRA -->
    <div v-if="mainConfig[activeTab][activeMenu]">
      <rra-pra-detail-card
        v-if="mainConfig[activeTab][activeMenu].mainData"
        :data="data[mainConfig[activeTab][activeMenu].getter]"
        :scoopingData="scoopingData"
        :config="mainConfig[activeTab][activeMenu].fields"
      />

      <rra-pra-detail-card
        v-if="mainConfig[activeTab][activeMenu].card"
        :data="data[mainConfig[activeTab][activeMenu].getter]"
        :scoopingData="scoopingData"
        :config="mainConfig[activeTab][activeMenu].fields"
        :ic="mainConfig[activeTab][activeMenu].class"
      />

      <rra-pra-detail-table
        v-else-if="
          !mainConfig[activeTab][activeMenu].mainData &&
          !mainConfig[activeTab][activeMenu].card
        "
        :config="mainConfig[activeTab][activeMenu]"
        :data="data[mainConfig[activeTab][activeMenu].getter]"
        :wc="activeTab == 0 ? '' : 'mt-5'"
        :description="
          mainConfig[activeTab][activeMenu].description
            ? data[activeTab == 0 ? 'mainRra' : 'mainPra'][
                mainConfig[activeTab][activeMenu].description.value
              ]
            : null
        "
      />
    </div>
  </div>
</template>

<script>
import RraPraDetailTable from "./RraPraDetailTable.vue";
import RraPraDetailCard from "./RraPraDetailCard.vue";
export default {
  name: "rra-pra-detail-rra",
  components: {
    RraPraDetailTable,
    RraPraDetailCard,
  },
  props: {
    data: {
      required: false,
      default: null,
    },
    scoopingData: {
      required: false,
      default: null,
    },

    rraCode: {
      required: false,
      default: null,
    },
    activeMenu: {
      required: false,
      default: 0,
    },

    activeTab: {
      required: false,
      default: 0,
      type: Number,
    },
  },

  mounted() {
    this.configs = this.mainConfig[this.activeMenu];
  },

  methods: {
    getValue(key) {
      const keys = key.split(".");

      var values = this.data;
      for (const _key of keys) {
        if (values[_key]) {
          values = values[_key];
        }
      }

      return values;
    },
    initData() {
      const keys = [
        {
          getter: "RraVillageBorder",
          setter: "village_borders",
        },
      ];

      for (const _key of keys) {
        if (this.data[_key.getter]) {
          if (
            typeof this.data[_key.getter] === "object" &&
            !Array.isArray(this.data[_key.getter])
          ) {
            this[_key.setter] = [this.data[_key.getter]];
          } else if (Array.isArray(this.data[_key.getter])) {
            this[_key.setter] = this.data[_key.getter];
          } else {
            this[_key.setter] = [];
          }
        }
      }

      this.configs = this.mainConfig[this.activeMenu];
    },
  },
  data() {
    return {
      village_borders: [],
      configs: null,
      mainConfig: [
        [
          {
            title: "Landscape Desa",
            getter: "mainRra",
            mainData: true,
            fields: [
              {
                label: "Luas Desa",
                getter: "scoopingData.land_area",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Tanah Sawah",
                getter: "data.tanah_sawah",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Tegal / Ladang",
                getter: "data.tegal_ladang",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Pemukiman",
                getter: "data.pemukiman",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Pekarangan",
                getter: "data.pekarangan",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Tanah Rawa",
                getter: "data.tanah_rawa",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Situ / Waduk / Danau",
                getter: "data.waduk_danau",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Tanah Perkebunan Rakyat",
                getter: "data.tanah_perkebunan_rakyat",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Tanah Perkebunan Negara",
                getter: "data.tanah_perkebunan_negara",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Tanah Perkebunan Swasta",
                getter: "data.tanah_perkebunan_swasta",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Hutan Lindung",
                getter: "data.hutan_lindung",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Hutan Rakyat",
                getter: "data.hutan_rakyat",
                transform: "ts",
                append: "Ha",
              },
              {
                label: "Fasilitas Umum",
                getter: "data.fasilitas_umum",
                transform: "ts",
                append: "Ha",
              },
            ],
          },
          {
            title: "Batas Wilayah",
            getter: "RraVillageBorder",
            fields: [
              {
                getter: "point",
                label: "Batas",
                transform: "border",
                class: "badge bg-primary",
              },
              {
                label: "Kabupaten",
                getter: "kabupatens_name",
                class: "text-capitalize",
                // transform: 'lowercase'
              },
              {
                label: "Kecamatan",
                getter: "kecamatans_name",
                class: "text-capitalize",
                // transform: 'lowercase'
              },
              {
                label: "Desa",
                getter: "desas_name",
                class: "text-capitalize",
                // transform: 'lowercase'
              },
            ],
          },
          {
            title: "Pola Pemanfaatan Lahan",
            getter: "RralandUse",
            fields: [
              {
                getter: "pattern",
                label: "Pola",
                translate: "land_use_pattern",
              },
              {
                getter: "plant",
                label: "Tanaman",
              },
            ],
          },
          {
            title: "Kelembagaan Masyarakat",
            getter: "RraComunityInstitution",
            fields: [
              {
                getter: "institution_name",
                label: "Nama Lembaga",
              },
              {
                getter: "role",
                label: "Peran",
                class: "d-block text-left text-09-em",
              },
              {
                getter: "description",
                label: "Deskripsi",
                class: "d-block text-left text-09-em",
              },
            ],
          },
          {
            title: "Potensi Pertanian Organik",
            getter: "OrganicPotential",
            fields: [
              {
                getter: "name",
                label: "Nama",
              },
              {
                getter: "capacity",
                label: "Capacity",
              },
              {
                getter: "method",
                label: "Metoe",
              },
              {
                getter: "marketing_period",
                label: "Periode Pemasaran",
              },
            ],
          },
          {
            title: "Tanaman Yang Sudah Ada",
            getter: "RraExistingPlant",
            fields: [
              {
                getter: "plant_type",
                label: "Kategori",
              },
              {
                getter: "plant",
                label: "Tanaman",
                class: "text-left d-block",
              },
            ],
          },
          {
            title: "Identifikasi Petani Inovatif",
            getter: "RraInnovativeFarmer",
            fields: [
              {
                getter: "name",
                label: "Nama",
              },
            ],
          },
          {
            title: "Data Dusun",
            getter: "RraDusun",
            fields: [
              {
                getter: "dusun_name",
                label: "Nama",
                class: "text-left d-block",
                header_class: "text-left",
              },
              {
                getter: "potential",
                label: "Status Potensial",
                transform: "status-potential",
                class: {
                  1: "badge bg-success",
                  0: "badge bg-danger",
                },
                header_class: "text-center",
              },
              {
                getter: "custom_dusun",
                label: "Action",
              },
            ],
          },
        ],
        [
          {
            title: "Pendapatan & Pemasaran Komoditas",
            mainData: true,
            getter: "mainPra",
            class: "md-50",
            fields: [
              {
                getter: "data.man_commodity_name",
                label: "Nama Komoditas (Laki-laki)",
              },
              {
                getter: "data.woman_commodity_name",
                label: "Nama Komoditas (Perempuan)",
              },
              {
                getter: "data.man_period",
                label: "Rata-Rata Periode Pemasaran (Laki-laki)",
              },
              {
                getter: "data.woman_period",
                label: "Rata-Rata Periode Pemasaran (Perempuan)",
              },
              {
                getter: "data.man_average_capacity",
                label: "Rata-Rata Kapasitas (Laki-laki)",
                append: "Kg",
              },
              {
                getter: "data.woman_average_capacity",
                label: "Rata-Rata Kapasitas (Perempuan)",
                append: "Kg",
              },
              {
                getter: "data.man_method",
                label: "Metode Pemasaran (Laki-laki)",
                translate: "eco_method",
              },
              {
                getter: "data.woman_method",
                label: "Metode Pemasaran (Perempuan)",
                translate: "eco_method",
              },
              {
                getter: "data.man_source",
                label: "Sumber (Laki-laki)",
              },
              {
                getter: "data.woman_source",
                label: "Sumber (Perempuan)",
              },
              {
                getter: "data.man_min_income",
                label: "Pendapatan Terendah (Laki-laki)",
                transform: "idr",
              },
              {
                getter: "data.woman_min_income",
                label: "Pendapatan Terendah (Perempuan)",
                transform: "idr",
              },
              {
                getter: "data.man_max_income",
                label: "Pendapatan Tertinggi (Laki-laki)",
                transform: "idr",
              },
              {
                getter: "data.woman_max_income",
                label: "Pendapatan Tertinggi (Perempuan)",
                transform: "idr",
              },
            ],
          },
          {
            title: "Kepemilikan Lahan",
            getter: "PraLandOwnershipDetail",
            description: {
              value: "land_ownership_description",
              label: "Deskripsi kepemilikan lahan",
            },
            fields: [
              {
                getter: "land_ownership",
                label: "Pemilik",
                class: "badge bg-primary",
              },
              {
                getter: "type_ownership",
                label: "Tipe Pemilik",
                translate: "type_ownership",
              },
              {
                getter: "percentage",
                label: "Presentase",
                append: "%",
              },
            ],
          },
          {
            title: "Penyebaran Lokasi Lahan Kering & Kritis",
            getter: "PraDryLandSpreadDetail",
            description: {
              value: "land_utilization_description",
              label: "Deskripsi Penyebaran Lokasi Lahan Kering & Kritis",
            },
            fields: [
              {
                getter: "dusun_name",
                label: "Nama Dusun",
              },
              {
                getter: "type_utilization",
                label: "Pola Pemanfaatan Lahan",
                translate: "land_use_pattern",
              },
            ],
          },
          {
            title: "Sumber Air",
            getter: "PraWaterSourceDetail",
            description: {
              value: "land_utilization_description",
              label: "Deskripsi Sumber Air",
            },
            fields: [
              {
                getter: "watersource_name",
                label: "Nama",
                class: "text-left",
              },
              {
                getter: "watersource_condition",
                label: "Kondisi",
              },
              {
                getter: "watersource_type",
                label: "Tipe",
                translate: "watersource_type",
              },
              {
                gettter: "watersource_utilization",
                label: "Pemanfaatan",
              },
            ],
          },

          {
            title: "Hasil Ekonomi Pemanfaatan Lahan",
            card: true,
            getter: "mainPra",
            class: "md-100",
            fields: [
              {
                getter: "data.land_utilization_source",
                label: "Sumber",
              },

              {
                getter: "data.land_utilization_plant_type",
                label: "Jenis Tanaman",
              },

              {
                getter:
                  "data.distribution_of_critical_land_locations_description",
                label: "Deskripsi hasil ekonomi pemanfaatan lahan",
              },
            ],
          },

          {
            title: "Pupuk",
            getter: "PraFertilizerDetail",
            fields: [
              {
                getter: "fertilizer_name",
                label: "Nama Pupuk",
                class: "text-left",
              },
              {
                gettter: "fertilizer_type",
                label: "Jenis",
              },
              {
                getter: "fertilizer_categories",
                label: "Kategori",
              },
              {
                getter: "fertilizer_source",
                label: "Asal",
              },
              {
                getter: "fertilizer_description",
                label: "Deskripsi",
                class: "text-09-em min-w-300px text-left",
              },
            ],
          },

          {
            title: "Pestisida",
            getter: "PraPersticideDetail",
            fields: [
              {
                getter: "pesticide_name",
                label: "Nama Pestisida",
                class: "text-left",
              },
              {
                gettter: "pesticide_type",
                label: "Jenis",
              },
              {
                getter: "pesticide_categories",
                label: "Kategori",
              },
              {
                getter: "pesticide_source",
                label: "Asal",
              },
              {
                getter: "pesticide_description",
                label: "Deskripsi",
                class: "text-09-em min-w-300px text-left",
              },
            ],
          },

          {
            title: "Permasalahan Yang Ada",
            getter: "PraExistingProblemDetail",
            fields: [
              {
                getter: "problem_name",
                label: "Nama Masalah",
              },
              {
                gettter: "problem_categories",
                label: "Kategori",
              },
              {
                getter: "date",
                label: "Periode",
              },
              {
                getter: "problem_source",
                label: "Asal",
              },
              {
                getter: "problem_solution",
                label: "Solusi",
                class: "text-09-em min-w-300px text-left",
              },
            ],
          },

          {
            title: "Bencana",
            getter: "PraDisasterDetail",
            fields: [
              {
                getter: "disaster_name",
                label: "Nama Bencana",
              },
              {
                getter: "year",
                label: "Periode",
              },
              {
                gettter: "disaster_categories",
                label: "Kategori",
              },
              {
                getter: "fatalities",
                label: "Korban Jiwa",
              },
              {
                getter: "detail",
                label: "Deskripsi",
                class: "text-09-em min-w-300px text-left",
              },
            ],
          },
        ],
      ],
    };
  },
  watch: {
    data: {
      deep: true,
      handler(v) {
        console.log("data change", v);
        if (v && v !== null) {
          this.initData();
        }
      },
    },
  },
};
</script>
