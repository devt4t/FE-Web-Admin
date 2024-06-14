<template>
  <v-row class="rra-pra-detail">
    <v-col md="4" xl="3">
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="rra-pra-detail-card mb-5"
      >
        <v-card-title>
          <v-icon large class="mr-2" @click="$router.go(-1)"
            >mdi-arrow-left-circle</v-icon
          >
          <h5 class="mb-0 pb-0">Detail RRA-PRA</h5>
        </v-card-title>
        <div class="rra-pra-wrapper">
          <div class="rra-pra-list">
            <div
              class="rra-pra-item"
              v-for="(f, i) in config.main_detail"
              :key="`main-data-${i}`"
            >
              <div class="label">{{ f[0] }}</div>
              <div class="value" v-if="data.rra">
                <span
                  v-if="f[1] === 'status'"
                  :class="{
                    'badge bg-light': data.rra.mainRra && !data.pra.mainPra,
                    'badge bg-warning':
                      data.rra.mainRra &&
                      data.rra.mainRra.status == 'document_saving',
                    'badge bg-success':
                      data.rra.mainRra &&
                      data.rra.mainRra.status == 'submit_review',
                  }"
                >
                  <span v-if="data.rra.mainRra && !data.pra.mainPra"
                    >Draft</span
                  >
                  <span
                    v-else-if="
                      data.rra.mainRra &&
                      data.rra.mainRra.status == 'document_saving'
                    "
                    >Pending</span
                  >
                  <span
                    v-else-if="
                      data.rra.mainRra &&
                      data.rra.mainRra.status == 'submit_review'
                    "
                    >Terverifikasi</span
                  >
                </span>
                <span
                  v-else
                  :class="{
                    [f.length > 4 ? f[4] : '']: true,
                  }"
                  >{{
                    getValue(f[1]) | parse(f.length > 2 ? f[2] : "no-empty")
                  }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </v-card>

      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="rra-pra-detail-menu mb-5"
      >
        <v-card-title class="border-dotted-bottom">
          <h5 class="mb-0 pb-0">Informasi RRA</h5>
        </v-card-title>

        <!-- MENUUU -->
        <div class="menu-list">
          <div
            class="menu-item hover-pointer"
            v-for="(m, i) in menus[activeTab]"
            :key="`menu-${i}`"
            v-if="!m.mainData"
            :class="{
              active: activeMenu == i,
            }"
            @click="activeMenu = i"
          >
            <div class="d-flex flex-column">
              <h6>{{ m.label }}</h6>
              <p class="mb-0 value">{{ m.description }}</p>
            </div>
            <v-icon>mdi-chevron-right</v-icon>
          </div>
        </div>
        <!-- END MENUUU -->
      </v-card>
    </v-col>

    <v-col md="8" xl="9">
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="rra-pra-detail-card mb-5"
      >
        <div class="segment-menu">
          <button
            v-for="(item, i) in tabs"
            :key="'segment-' + i"
            :class="{
              active: i === activeTab,
            }"
          >
            <v-icon>{{ item.icon }}</v-icon> {{ item.label }}
          </button>
        </div>
        <v-card-title>
          <h5 class="mb-0 pb-0">RRA</h5>
        </v-card-title>

        <div class="detail-wrapper">
          <rra-pra-detail-rra
            :data="data ? data.rra : null"
            :scoopingData="data ? data.mainScooping : null"
            :activeMenu="0"
          />
          <!-- <rra-pra-detail-card v-if="data" :data="data" :scoopingData="scoopingData"
                        :config="configs[activeMenu].fields" /> -->
        </div>
      </v-card>
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="rra-pra-detail-card mb-5"
        :componentKey="`comp-detail-${componentKey}`"
      >
        <v-card-title>
          <h5 class="mb-0 pb-0">
            {{ menus[activeTab][activeMenu].label }}
          </h5>
        </v-card-title>
        <div class="detail-wrapper">
          <rra-pra-detail-rra
            v-if="activeTab == 0"
            :data="data ? data.rra : null"
            :scoopingData="data ? data.mainScooping : null"
            :activeMenu="activeMenu"
          />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import RraPraDetailRra from "./RraPraDetailRra.vue";
export default {
  name: "rra-pra-detail",
  components: {
    RraPraDetailRra,
  },
  methods: {
    async getData() {
      const result = await this.$_api
        .get("GetDetailRraPra_new", { id: this.$route.query.id })
        .catch(() => false);
      if (result) {
        this.data = result;
      }
    },

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
  },

  mounted() {
    this.getData();
  },

  watch: {
    activeMenu(v) {
      this.componentKey += 1;
    },
  },
  data() {
    return {
      componentKey: 1,
      activeTab: 0,
      tabs: [
        {
          label: "RRA",
          icon: "mdi-home-group",
          code: "rra",
        },
        {
          label: "PRA",
          icon: "mdi-home-analytics",
          code: "pra",
        },
      ],

      menus: [
        [
          {
            label: "Landscape Desa",
            description: "Informasi luas desa, tanah, dll",
            mainData: true,
          },
          {
            label: "Batas Wilayah",
            description: "Informasi Batas Wilayah Desa",
          },
          {
            label: "Pola Pemanfaatan Lahan",
            description: "Informasi Pola Pemanfaatan Lahan di Desa Tersebut ",
          },
          {
            label: "Kelembagaan Masyarakat",
            description: "Daftar kelembagaan masyarakat di desa tersebut ",
          },
          {
            label: "Periode Pertanian Organik",
            description: "Daftar pertanian organik di desa tersebut ",
          },
          {
            label: "Tanaman Yang Sudah Ada",
            description: "Daftar tanaman yang ada di desa tersebut ",
          },
          {
            label: "Identifikasi Petani Inovatif",
            description: "Daftar petani inovatif",
          },
          {
            label: "Data Dusun",
            description:
              "Daftar dusun potensial & tidak potensial di desa tersebut",
          },
        ],
        [
          {
            label: "Landscape Desa",
            description: "Informasi luas desa, tanah, dll",
            mainData: true,
          },
          {
            label: "Batas Wilayah",
            description: "Informasi Batas Wilayah Desa",
          },
        ],
      ],

      activeMenu: 1,
      data: {},
      ready: false,
      loading: true,
      config: {
        main_detail: [
          ["Scooping Visit", "mainScooping.data_no"],
          ["Desa", "mainScooping.desas_name"],
          ["Status", "status"],
          ["RRA", "rra.mainRra.rra_no", "", "badge", "badge bg-primary"],
          ["PRA", "pra.mainPra.pra_no", "", "badge", "badge bg-primary"],
          ["Tanggal Mulai", "rra.mainRra.rra_pra_date_start", "date"],
          ["Tanggal Selesai", "rra.mainRra.rra_pra_date_end", "date"],
        ],
      },
    };
  },
};
</script>
