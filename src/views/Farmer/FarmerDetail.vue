<template>
  <v-row class="farmer-detail" :key="'farmer-detail' + componentKey">
    <v-col md="4" xl="3">
      <farmer-assign-modal
        :data="ff"
        :dataKey="farmerAssignModal"
        @success="getData()"
        v-if="$_sys.isAllowed('farmer-update')"
      />
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="scooping-visit-detail-card farmer-card mb-5"
      >
        <v-card-title>
          <v-icon large class="mr-2" @click="$router.go(-1)"
            >mdi-arrow-left-circle</v-icon
          >
          <h5 class="mb-0 pb-0">Detail Petani</h5>
        </v-card-title>

        <div class="farmer-side-wrapper">
          <!-- <div
            class="d-flex flex-row align-items-center bg-danger-light px-3 py-3 br-8 mb-3"
            v-if="mainData && workingAreas.length == 0"
          >
            <v-icon x-large class="text-danger">mdi-information</v-icon>
            <span class="text-danger ml-2">Petani belum di assign ke FF</span>
          </div> -->
          <h5 class="side-title">Profil Petani</h5>

          <div class="farmer-info d-flex flex-row">
            <div class="farmer-info-text d-flex flex-column">
              <div class="farmer-info-list">
                <v-icon>mdi-account-badge-outline</v-icon>
                <span>{{ mainData.name }}</span>
              </div>

              <div class="farmer-info-list">
                <v-icon>mdi-account-badge-outline</v-icon>
                <span>{{ mainData.farmer_no }}</span>
              </div>

              <div class="farmer-info-list">
                <v-icon>mdi-map-marker-radius-outline</v-icon>
                <span class="d-block"
                  >{{ mainData.target_areas_name?.replace(/_/g, " ") }}
                </span>
              </div>
              <div class="d-flex flex-row mt-3">
                <div
                  class="action-button d-flex flex-column"
                  style="flex-wrap: wrap"
                >
                  <v-btn
                    variant="success"
                    v-if="
                      $_sys.isAllowed('farmer-verification-create') &&
                      mainData.approve == 0 &&
                      this.$store.state.tmpProgramYear ==
                        this.$_config.programYear.model
                    "
                    small
                    class="mr-3 mb-2"
                    @click="onVerification()"
                  >
                    Verifikasi
                  </v-btn>

                  <v-btn
                    variant="danger"
                    v-else-if="
                      mainData.approve == 1 &&
                      $_sys.isAllowed('farmer-unverification-create') &&
                      this.$store.state.tmpProgramYear ==
                        this.$_config.programYear.model
                    "
                    small
                    @click="onVerification()"
                    class="mr-3 mb-2"
                    ><span>Unverifikasi </span></v-btn
                  >
                  <v-btn
                    variant="info"
                    v-if="$_sys.isAllowed('farmer-update')"
                    small
                    class="mr-3 mb-2"
                    @click="farmerAssignModal += 1"
                  >
                    Assign Program Year
                  </v-btn>
                </div>
              </div>
            </div>
            <div class="farmer-info-avatar-wrapper">
              <div class="farmer-info-avatar" v-if="!mainData.farmer_profile">
                {{ avatarHelper(mainData.name)?.toUpperCase() }}
              </div>
              <div
                v-else
                @click="
                  showLightbox(
                    `${$_config.baseUrlUpload}/${mainData.farmer_profile}`
                  )
                "
                v-bind:style="{
                  'background-image':
                    'url(' +
                    `${$_config.baseUrlUpload}/${mainData.farmer_profile}` +
                    ')',
                }"
                alt=""
                class="farmer-profile hover-pointer"
              ></div>
            </div>
          </div>

          <div
            class="farmer-side-list-wrapper"
            v-for="(item, i) in fieldSide"
            :key="'info-list' + i"
          >
            <h5 class="side-title">{{ item.label }}</h5>
            <div class="farmer-side-list">
              <div
                class="farmer-side-item"
                v-for="(data, j) in item.items"
                :key="'info-list' + i + j"
              >
                <span class="label">{{ data.label }}</span>
                <div class="value">
                  <span v-if="data.view_data == 'program_year'">
                    <!-- <span
                      class="badge bg-primary mr-1"
                      v-for="(year, k) in ff"
                      :key="'year-' + k"
                      >{{ year.program_year }}</span
                    > -->
                    <span class="badge bg-primary mr-1">{{
                      $store.state.tmpProgramYear
                    }}</span>
                  </span>

                  <span
                    v-else-if="data.view_data == 'address'"
                    class="text-capitalize"
                  >
                    {{ getAddress() }}
                  </span>

                  <span v-else-if="data.view_data == 'ff_name'">
                    <span>{{ mainData?.field_facilitators_name }}</span>
                    <div class="d-flex flex-row">
                      <span class="badge bg-light">{{
                        mainData?.user_id
                      }}</span>
                    </div>
                  </span>

                  <span v-else-if="data.value == 'photo'">
                    <div
                      class="item-photo hover-pointer"
                      @click="
                        showLightbox(
                          `${$_config.baseUrlUpload}/${
                            mainData[data.view_data]
                          }`
                        )
                      "
                      v-bind:style="{
                        'background-image':
                          'url(' +
                          `${$_config.baseUrlUpload}/${
                            mainData[data.view_data]
                          }` +
                          ')',
                      }"
                    ></div>
                  </span>
                  <span
                    v-else-if="data.class && typeof data.class == 'object'"
                    :class="{
                      [data.class[mainData[data.view_data]]]: true,
                    }"
                  >
                    <span
                      v-if="typeof data.view_data == 'string' && !data.value"
                      >{{ mainData[data.view_data] }}</span
                    >
                    <span v-else-if="typeof data.value == 'object'">{{
                      data.value[mainData[data.view_data]]
                    }}</span>
                  </span>

                  <span
                    v-else
                    :class="{
                      [data.class]: true,
                    }"
                  >
                    <span v-if="typeof data.value === 'object'">
                      {{ data.value[mainData[data.view_data]] }}
                    </span>
                    <span v-else>{{ mainData[data.view_data] }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col lg="8">
      <farmer-detail-working-area
        :workingAreas="workingAreas"
        :mainData="mainData"
        @refresh="getData()"
      />
      <farmer-detail-tree :trees="trees" :mainData="mainData" :pivots="ff" />
      <farmer-detail-land :lands="lands" :mainData="mainData" />
    </v-col>
  </v-row>
</template>

<script>
import FarmerDetailTree from "./FarmerDetailTree.vue";
import FarmerDetailLand from "./FarmerDetailLand.vue";
import FarmerAssignModal from "./FarmerAssignModal.vue";
import FarmerDetailWorkingArea from "./FarmerDetailWorkingArea.vue";
export default {
  name: "farmer-detail",
  components: {
    FarmerDetailTree,
    FarmerDetailLand,
    FarmerAssignModal,
    FarmerDetailWorkingArea,
  },
  methods: {
    // getAddress() {
    //   if (!this.mainData.id) return;

    //   let locationArr = [];

    //   if (this.mainData.address) locationArr.push(this.mainData.address);
    //   if (this.mainData.desas_name) locationArr.push(this.mainData.desas_name);
    //   if (this.mainData.kecamatans_name)
    //     locationArr.push(this.mainData.kecamatans_name);
    //   if (this.mainData.kabupatens_name)
    //     locationArr.push(this.mainData.kabupatens_name);
    //   if (this.mainData.provinces_name)
    //     locationArr.push(this.mainData.provinces_name);
    //   if (this.mainData.desas_post_code)
    //     locationArr.push(this.mainData.desas_post_code);
    //   if (locationArr.length == 0) return "-";

    //   return locationArr.map((x) => x.toLowerCase()).join(", ");
    // },

    //refactored code
    getAddress() {
      if (!this.mainData.id) return "-";

      const locationArr = [
        this.mainData.address,
        this.mainData.desas_name,
        this.mainData.kecamatans_name,
        this.mainData.kabupatens_name,
        this.mainData.provinces_name,
        this.mainData.desas_post_code,
      ];

      const filteredLocationArr = locationArr.filter((x) => (x ? true : false));
      if (filteredLocationArr.length === 0) return "-";

      return filteredLocationArr.map((x) => x.toLowerCase()).join(", ");
    },

    // avatarHelper(name) {
    //   if (typeof name !== "string") return;
    //   if (name.split(" ").length > 1) {
    //     return name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0);
    //   } else if (name.split(" ").length > 0) {
    //     return `${name.charAt(0)}${name.charAt(1)}`;
    //   }
    // },

    //refactored
    avatarHelper(name) {
      if (typeof name !== "string") return;
      if (name.split(" ").length > 1) {
        return name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0);
      } else if (name.split(" ").length > 0) {
        return `${name.charAt(0)}${name.charAt(1)}`;
      }
    },

    async getData() {
      if (!this.$route.query.program_year) {
        return this.$_alert.error(
          null,
          "Error",
          "Tahun program tidak ditemukan"
        );
      }
      this.loading = true;
      const farmer = await this.$_api
        .get("GetDetailFarmer_new", {
          farmer_no: this.$route.query.farmer_no,
        })
        .catch(() => false);

      if (!farmer) return;

      if (
        this.$route.query.program_year === this.$_config.programYear.model ||
        (this.$route.query.program_year !== this.$_config.programYear.model &&
          farmer.DetailFarmerMainLog.length == 0)
      ) {
        this.mainData = farmer.DetailFarmerMain;
      } else {
        const logMainData = farmer.DetailFarmerMainLog.find((x) =>
          x.program_year.includes(this.$route.query.program_year)
        );

        if (!logMainData) {
          this.$_alert.error(
            "",
            "Data Tidak Ditemukan",
            `Data petani ${this.$route.query.farmer_no} tahun ${this.$route.query.program_year} tidak ditemukan`
          );
          return;
        }

        this.mainData = logMainData;
      }

      this.trees = farmer.DetailFarmerTree.concat(farmer.DetailFarmerTreeLog);
      this.ff = farmer.DetailFarmerPivot;
      this.lands = farmer.DetailFarmerLahanPivot;
      this.workingAreas = farmer.DetailFarmerWorkingArea;
    },
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    onVerification() {
      const isApprove = this.mainData.approve === 1;
      const action = isApprove ? "Unverifikasi" : "Verifikasi";
      const message = isApprove
        ? "Apakah anda yakin ingin unverifikasi data petani?"
        : "Apakah anda yakin ingin verifikasi data petani?";
      const successMessage = isApprove
        ? "Data petani berhasil di unverifikasi"
        : "Data petani berhasil di verifikasi";

      this.$_alert
        .confirm(
          `${action} Petani`,
          message,
          `Ya, ${action}`,
          "Batal",
          isApprove
        )
        .then((res) => {
          if (res.isConfirmed) {
            this.$_api
              .post("updateFarmerApproval", {
                current_id: this.$route.query.id,
              })
              .then(() => {
                this.getData();
                this.$_alert.success(successMessage);
              });
          }
        });
    },

    // onVerification() {
    //   if (this.mainData.approve == 1) {
    //     this.$_alert
    //       .confirm(
    //         "Unverifikasi Petani",
    //         "Apakah anda yakin ingin unverifikasi data petani?",
    //         "Ya, Unverifikasi",
    //         "Batal",
    //         true
    //       )
    //       .then((res) => {
    //         if (res.isConfirmed) {
    //           //unverif
    //           this.$_api
    //             .post("updateFarmerApproval", {
    //               current_id: this.$route.query.id,
    //             })
    //             .then(() => {
    //               this.$_alert.success("Data petani berhasil di unverifikasi");
    //               this.getData();
    //             });
    //         }
    //       });
    //   } else {
    //     this.$_alert
    //       .confirm(
    //         "Verifikasi Petani",
    //         "Apakah anda yakin ingin verifikasi data petani?",
    //         "Ya, Verifikasi",
    //         "Batal",
    //         false
    //       )
    //       .then((res) => {
    //         if (res.isConfirmed) {
    //           //verif
    //           this.$_api
    //             .post("updateFarmerApproval", {
    //               current_id: this.$route.query.id,
    //             })
    //             .then(() => {
    //               this.getData();
    //               this.$_alert.success("Data petani berhasil di verifikasi");
    //             });
    //         }
    //       });
    //   }
    // },
  },
  // mounted() {
  //   if (this.$store.state.tmpProgramYear == this.$_config.programYear.model) {
  //     this.fieldSide[1].items = [
  //       {
  //         label: "Penghasilan Pertanian Tahunan",
  //         view_data: "avg_farming_income_yearly",
  //       },
  //       {
  //         label: "Penghasilan Perikanan Tahunan",
  //         view_data: "avg_fishery_income_yearly",
  //       },
  //       {
  //         label: "Pengeluaran Makan Bulanan",
  //         view_data: "avg_food_outcome_monthly",
  //       },
  //       {
  //         label: "Pendapatan Bulanan",
  //         view_data: "avg_income_permonth",
  //       },
  //       {
  //         label: "Pendapatan Pariwisata",
  //         view_data: "avg_nature_tourism_yearly",
  //       },
  //       {
  //         label: "Pendapatan Usaha Kayu",
  //         view_data: "avg_wood_bussines_income_yearly",
  //       },
  //       {
  //         label: "Pendapatan Usaha Lainnya",
  //         view_data: "avg_other_source_income_yearly",
  //       },
  //     ];
  //   } else {
  //     this.fieldSide[1].items = [
  //       {
  //         label: "Pekerjaan Utama",
  //         view_data: "main_job",
  //       },
  //       {
  //         label: "Penghasilan Utama",
  //         view_data: "main_income",
  //         transform: "idr",
  //       },
  //       {
  //         label: "Pekerjaan Sampingan",
  //         view_data: "side_job",
  //       },
  //       {
  //         label: "Penghasilan Sampingan",
  //         view_data: "side_income",
  //         transform: "idr",
  //       },
  //     ];
  //   }

  //   this.fieldSide = this.fieldSide;
  //   this.getData();
  // },

  //refactored
  mounted() {
    const items =
      this.$store.state.tmpProgramYear == this.$_config.programYear.model
        ? [
            {
              label: "Penghasilan Pertanian Tahunan",
              view_data: "avg_farming_income_yearly",
            },
            {
              label: "Penghasilan Perikanan Tahunan",
              view_data: "avg_fishery_income_yearly",
            },
            {
              label: "Pengeluaran Makan Bulanan",
              view_data: "avg_food_outcome_monthly",
            },
            { label: "Pendapatan Bulanan", view_data: "avg_income_permonth" },
            {
              label: "Pendapatan Pariwisata",
              view_data: "avg_nature_tourism_yearly",
            },
            {
              label: "Pendapatan Usaha Kayu",
              view_data: "avg_wood_bussines_income_yearly",
            },
            {
              label: "Pendapatan Usaha Lainnya",
              view_data: "avg_other_source_income_yearly",
            },
          ]
        : [
            { label: "Pekerjaan Utama", view_data: "main_job" },
            {
              label: "Penghasilan Utama",
              view_data: "main_income",
              transform: "idr",
            },
            { label: "Pekerjaan Sampingan", view_data: "side_job" },
            {
              label: "Penghasilan Sampingan",
              view_data: "side_income",
              transform: "idr",
            },
          ];

    this.$set(this.fieldSide, 1, { items });
    this.getData();
  },

  data() {
    return {
      mainData: {},
      loading: true,
      trees: [],
      lands: [],
      ff: [],
      workingAreas: [],
      componentKey: 1,
      farmerAssignModal: 0,
      fieldSide: [
        {
          label: "Status & Lahan",
          items: [
            {
              label: "Tahun Program",
              class: "badge bg-primary",
              view_data: "program_year",
            },
            {
              label: "MU",
              view_data: "managementunits_name",
            },
            {
              label: "FF",
              view_data: "ff_name",
            },
            {
              label: "Status",
              class: {
                1: "badge bg-success",
                0: "badge bg-danger",
              },
              value: {
                1: "Terverifikasi",
                0: "Belum Diverifikasi",
              },
              view_data: "approve",
            },
            {
              label: "Kelengkapan Data",
              class: {
                1: "badge bg-success",
                0: "badge bg-danger",
              },
              value: {
                1: "Lengkap",
                0: "Tidak Lengkap",
              },
              view_data: "complete_data",
            },
            {
              label: "No. HP",
              view_data: "phone",
            },
            {
              label: "Tanggal Bergabung",
              view_data: "join_date",
              transform: "date",
            },
            {
              label: "Model Project",
              class: "badge bg-primary",
              view_data: "project_model",
              value: {
                0: "-",
                1: "Model 1 - 100% Kayu",
                2: "Model 2 - 60% Kayu & 40% MPTS",
                3: "Model 3 - 40% Kayu & 60% MPTS",
              },
            },
            {
              label: "Kategori Legalitas Lahan",
              class: "font-weight-bold",
              view_data: "legal_land_categories",
              transform: "no-empty",
            },
            {
              label: "No. MOU",
              view_data: "mou_no",
            },
          ],
        },

        {
          label: "Pekerjaan & Pendapatan",
          items: [],
        },
        {
          label: "Data Lainnya",
          items: [
            {
              label: "Tanggal Lahir",
              view_data: "birthday",
            },
            {
              label: "Foto KTP",
              view_data: "ktp_document",
              value: "photo",
            },
            {
              label: "Tanda Tangan",
              view_data: "signature",
              value: "photo",
            },
            {
              label: "Suku",
              view_data: "ethnic",
            },
            {
              label: "Asal",
              view_data: "origin",
              class: "text-capitalize",
            },
            {
              label: "Agama",
              view_data: "religion",
              class: "text-capitalize",
            },
            {
              label: "Alamat",
              view_data: "address",
            },
            {
              label: "Pendidikan Terakhir",
              view_data: "education",
            },
            {
              label: "Pendidikan Non-Formal",
              view_data: "non_formal_education",
            },
            {
              label: "Sumber Air Bersih",
              view_data: "general_clean_water_source",
            },
            {
              label: "Sumber Air Minum",
              view_data: "general_drink_water_source",
            },
            {
              label: "Sumber Makanan",
              view_data: "general_food_source",
            },
            {
              label: "Sumber Obat-Obatan",
              view_data: "general_medicine_source",
            },
            {
              label: "Status Perkawinan",
              view_data: "marrital_status",
            },
            {
              label: "Jumlah Anggota Keluarga",
              view_data: "number_family_member",
            },
          ],
        },
      ],
    };
  },
};
</script>
