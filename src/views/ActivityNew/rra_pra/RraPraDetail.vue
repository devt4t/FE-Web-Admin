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
          <div
            class="d-flex flex row justify-content-between align-items-center pr-2"
          >
            <h5 class="mb-0 pb-0 pl-3">Detail RRA-PRA</h5>
          </div>
        </v-card-title>
        <div class="rra-pra-wrapper">
          <div class="rra-pra-list">
            <div class="rra-pra-item d-flex flex-column mb-3">
              <div class="label">Action</div>
              <div class="values">
                <v-btn
                  class="mr-2 mb-2"
                  small
                  variant="danger"
                  @click="onDelete()"
                  v-if="$_sys.isAllowed('rra-pra-delete') && data.pra?.mainPra"
                  ><v-icon>mdi-delete-empty</v-icon><span>Hapus</span></v-btn
                >

                <v-btn
                  class="mr-2 mb-2"
                  small
                  variant="success"
                  @click="onVerification('verification')"
                  v-if="
                    data.rra &&
                    data.rra.mainRra &&
                    ['ready_to_submit', 'document_saving'].includes(
                      data.rra.mainRra.status
                    ) &&
                    $_sys.isAllowed('rra-pra-verification-create') &&
                    data.pra?.mainPra
                  "
                >
                  <v-icon>mdi-file-check-outline</v-icon>
                  <span>Verifikasi</span>
                </v-btn>

                <v-btn
                  @click="onVerification('unverification')"
                  class="mr-2 mb-2"
                  small
                  variant="danger"
                  v-if="
                    data.rra &&
                    data.rra.mainRra &&
                    ['submit_review'].includes(data.rra.mainRra.status) &&
                    $_sys.isAllowed('rra-pra-unverification-create')
                  "
                >
                  <v-icon>mdi-undo-variant</v-icon>
                  <span>Unverifikasi</span>
                </v-btn>
              </div>
            </div>
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
                    'badge bg-light': data.rra.mainRra && !data.pra?.mainPra,
                    'badge bg-warning':
                      data.rra.mainRra &&
                      data.rra.mainRra.status == 'document_saving',
                    'badge bg-success':
                      data.rra.mainRra &&
                      data.rra.mainRra.status == 'submit_review',
                  }"
                >
                  <span v-if="data.rra?.mainRra && !data.pra?.mainPra"
                    >Draft</span
                  >
                  <span
                    v-else-if="
                      data.rra &&
                      data.rra.mainRra &&
                      data.rra.mainRra.status == 'document_saving'
                    "
                    >Pending</span
                  >
                  <span
                    v-else-if="
                      data.rra?.mainRra &&
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
          <h5 class="mb-0 pb-0">Informasi {{ tabs[activeTab].label }}</h5>
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
            @click="
              activeMenu = i == 0 ? 1 : 1;
              activeTab = i;
            "
          >
            <v-icon>{{ item.icon }}</v-icon> {{ item.label }}
          </button>
        </div>
        <v-card-title>
          <h5 class="mb-0 pb-0">{{ tabs[activeTab].label }}</h5>
        </v-card-title>

        <div class="detail-wrapper" v-if="data.rra">
          <rra-pra-detail-rra
            :data="data ? (activeTab == 0 ? data.rra : data.pra) : null"
            :scoopingData="data ? data.mainScooping : null"
            :activeMenu="0"
            :activeTab="activeTab"
            :rraCode="data.rra && data.rra.mainRra && data.rra.mainRra.rra_no"
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
            :data="data ? (activeTab == 0 ? data.rra : data.pra) : null"
            :scoopingData="data ? data.mainScooping : null"
            :activeMenu="activeMenu"
            :activeTab="activeTab"
            v-if="
              activeTab == 0 || (activeTab == 1 && data.pra && data.pra.mainPra)
            "
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
    async onVerification(type) {
      const alertTitle = type == "verification" ? "Verifikasi" : "Unverifikasi";
      const isConfirmed = await this.$_alert
        .confirm(
          `${alertTitle} Data?`,
          `Apakah anda yakin ingin ${alertTitle.toLowerCase()} data RRA-PRA?`,
          `Ya, ${alertTitle}`,
          "Batal",
          true
        )
        .then((res) => {
          return res.isConfirmed;
        })
        .catch(() => false);

      if (!isConfirmed) return;

      const endpoint =
        type == "verification" ? "VerificationRraPra" : "UnverificationRraPra";
      console.log(this.data);
      const formNo = this.data.mainScooping.data_no;
      this.$_api
        .post(endpoint, {
          form_no: formNo,
        })
        .then((res) => {
          this.$_alert.success(
            `Data RRA-PRA berhasil di${alertTitle.toLowerCase()}`
          );
          this.getData();
        })
        .catch((err) => {
          this.$_alert.error(err);
        });
    },
    onDelete() {
      let payload = {};
      if (
        this.data.rra &&
        this.data.rra.mainRra &&
        this.data.rra.mainRra.rra_no
      ) {
        payload.rra_no = this.data.rra.mainRra.rra_no;
      }
      if (
        this.data.pra &&
        this.data.pra.mainPra &&
        this.data.pra.mainPra.pra_no
      ) {
        payload.pra_no = this.data.pra.mainPra.pra_no;
      }

      this.$_alert
        .confirm(
          "Hapus data RRA PRA?",
          `Apakah anda yakin ingin menghapus data ${payload.rra_no}  ${
            payload.pra_no ? `dan ${payload.pra_no}` : ""
          }? Data yang sudah terhapus tidak dapat dikembalikan`,
          "Ya, Hapus",
          "Batal",
          true
        )
        .then((res) => {
          if (res.isConfirmed) {
            this.$_api
              .post("deleteRraPra_new", {
                delete_type: "hard_delete",
                ...payload,
              })
              .then(() => {
                this.$_alert.success("Data RRA-PRA berhasil dihapus");
                this.$router
                  .replace({
                    path: this.$route.path,
                    query: {
                      view: "list",
                      id: "",
                    },
                  })
                  .catch(() => {
                    this.$router.go(-1);
                  });
              });
          }
        });
    },
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

      if (typeof values !== "string" && !Array.isArray(values)) return "-";

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
            label: "Pendapatan & Pemasaran Komoditas",
            description: "Pendapatan & Pemasaran Komoditas",
            mainData: true,
          },
          {
            label: "Kepemilikan Lahan",
            description: "Informasi kepemilikan lahan di desa tersebut",
          },
          {
            label: "Penyebaran Lokasi Lahan Kering & Kritis",
            description: "Penyebaran Lokasi Lahan Kering & Kritis",
          },
          {
            label: "Sumber Air",
            description:
              "Informasi tentang sumber air, jenis, kondisi dan pemanfaatannya",
          },
          {
            label: "Hasil Ekonomi Pemanfaatan Lahan",
            description: "Hasil ekonomi pemanfaatan lahan di desa tersebut",
          },
          {
            label: "Pupuk",
            description: "Pupuk dalam pemanfaatan lahan",
          },
          {
            label: "Pestisida",
            description: "Pestisida dalam pemanfaatan lahan",
          },
          {
            label: "Permasalahan Yang Ada",
            description: "Informasi permasalahan nyang ada di desa tersebut",
          },
          {
            label: "Bencana",
            description: "Informasi bencana, periode bencana, detail, dll",
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
