<template>
  <v-row class="scooping-visit-detail">
    <v-col md="4" xl="3">
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
          <h5 class="mb-0 pb-0">Detail</h5>
        </v-card-title>
        <div class="scooping-visit-wrapper">
          <div class="scooping-visit-list">
            <h6>Status</h6>
            <div class="scooping-visit-item status d-flex flex-column mb-3">
              <div class="label">Form</div>
              <div class="value d-flex flex-row align-items-center">
                <span class="text-link mr-2">#{{ data.data_no }}</span
                ><span
                  class="badge text-07-em"
                  :class="{
                    'bg-warning':
                      data.status == 'document_saving' && data.is_verify == 0,
                    'bg-info':
                      data.status == 'document_saving' && data.is_verify == 1,
                    'bg-primary': data.status == 'ready_to_submit',
                    'bg-success': data.status == 'submit_review',
                  }"
                >
                  <span
                    v-if="
                      data.status == 'document_saving' && data.is_verify == 0
                    "
                    >Pending</span
                  >
                  <span
                    v-else-if="
                      data.status == 'document_saving' && data.is_verify == 1
                    "
                    >GIS Review</span
                  >
                  <span v-else-if="data.status == 'ready_to_submit'"
                    >GIS Terverifikasi</span
                  >
                  <span v-else-if="data.status == 'submit_review'"
                    >Terverifikasi</span
                  >
                </span>
              </div>

              <div class="label"></div>
              <div class="value">
                <v-alert
                  v-if="data.status === 'ready_to_submit'"
                  type="warning"
                  style="font-size: 0.8em"
                  >Pastikan untuk memeriksa data terlebih dahulu sebelum
                  melakukan verifikasi</v-alert
                >
                <v-btn
                  v-if="
                    data.status === 'ready_to_submit' &&
                    ['25', '23', '13'].includes($store.state.User.role)
                  "
                  variant="warning"
                  class="mt-1"
                  small
                  @click="onVerification('verification_um')"
                  >Verifikasi</v-btn
                >

                <v-btn
                  variant="warning"
                  class="mt-1"
                  small
                  @click="onVerification('mail_to_gis')"
                  v-if="
                    data.status === 'document_saving' &&
                    data.is_verify == 0 &&
                    $store.state.User.role != 14 &&
                    data.email_to_gis < 3
                  "
                >
                  Email to GIS
                </v-btn>

                <v-btn
                  variant="success"
                  class="mt-1"
                  small
                  @click="onVerification('verification_gis')"
                  v-if="
                    data.status === 'document_saving' &&
                    data.is_verify == 0 &&
                    ['13', '14'].includes($store.state.User.role)
                  "
                >
                  Verifikasi GIS
                </v-btn>

                <span v-if="data.status == 'submit_review'">-</span>
              </div>
            </div>

            <div class="scooping-visit-item status d-flex flex-column mb-3">
              <div class="label">Project</div>

              <div class="value">
                <h5
                  v-for="(item, i) in projects"
                  :key="`scooping-project-${i}`"
                >
                  {{ item.projects_project_name }}
                  <span
                    :class="{
                      'font-weight-400': true,
                      'badge bg-info':
                        item.project_planting_purposes_code == 'carbon',
                      'badge bg-light':
                        item.project_planting_purposes_code == 'non-carbon' ||
                        !item.project_planting_purposes_code,
                    }"
                    >{{
                      item.project_planting_purposes_code == "carbon"
                        ? "Carbon"
                        : "Non Carbon"
                    }}</span
                  >
                </h5>
              </div>
            </div>
          </div>
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
                  v-for="(item, i) in typeof data[f.key] === 'string'
                    ? data[f.key].split(',')
                    : []"
                  :class="{
                    [`bg-${f.variant ? f.variant : 'light'}`]: true,
                  }"
                  :key="f.key + i"
                  v-if="data[f.key]"
                >
                  <span v-if="data[f.key] && !f.translate">{{
                    item | parse(f.transform ? f.transform : "no-empty")
                  }}</span>

                  <span
                    v-else-if="
                      data[f.key] &&
                      f.translate &&
                      defaultData[f.translate].find((x) => x.value == item)
                    "
                    >{{
                      defaultData[f.translate].find((x) => x.value == item).text
                    }}</span
                  >
                </span>
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

    <v-col md="8" xl="9">
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="scooping-visit-detail-card mb-5"
        v-if="data"
      >
        <v-card-title>
          <h5 class="mb-0 pb-0">Dokumentasi, Map &amp; Lainnya</h5>
        </v-card-title>

        <div class="map-wrapper">
          <div class="village-preview d-flex flex-row justify-content-between">
            <div class="village-preview-item light">
              <p class="label">Desa</p>

              <p class="value text-capitalize">
                {{ data.desas_name?.toLowerCase() }}
              </p>
            </div>
            <div class="village-preview-item success">
              <p class="label">Luas Desa</p>

              <p class="value text-capitalize">
                {{ data.land_area | parse("thousandSep") }} Ha
              </p>
            </div>
            <div class="village-preview-item success">
              <p class="label">Luas Lahan Kering</p>

              <p class="value text-capitalize">
                {{ data.dry_land_area | parse("thousandSep") }} Ha
              </p>
            </div>
          </div>

          <DetailModalMap
            v-if="this.openMaps"
            :data="map.data"
            :key="map.key + 'DetailModalMapSCopingVisit'"
          />

          <div
            v-else
            class="map-placeholder d-flex flex-column"
            style="justify-content: center; align-items: center"
          >
            <v-btn
              v-if="data.village_polygon || data.dry_land_polygon"
              @click="openMaps = true"
              variant="primary"
              >Buka Maps</v-btn
            >
            <p class="text-white mb-0" v-else>
              <span v-if="!loading">Belum verifikasi GIS</span>
              <span v-else>Belum verifikasi GIS</span>
            </p>
          </div>

          <div class="doc-field-wrapper mt-4">
            <div
              class="doc-field-item"
              v-for="(f, i) in fields_doc"
              :key="'fd' + i"
            >
              <p class="mb-0 label">{{ f.label }}</p>
              <div class="value d-flex flex-row" v-if="f.type == 'image'">
                <div
                  v-for="(image, j) in typeof data[f.key] === 'string'
                    ? data[f.key].split(',')
                    : []"
                  class="doc-photo-wrapper"
                >
                  <div
                    class="doc-photo hover-pointer"
                    v-bind:style="{
                      backgroundImage:
                        'url(' + $store.state.apiUrlImage + image + ')',
                    }"
                    @click="showLightbox($store.state.apiUrlImage + image)"
                  ></div>
                </div>
              </div>

              <div
                class="value d-flex flex-row"
                v-else-if="f.key == 'other_ngo'"
              ></div>
              <div
                class="value d-flex flex-row"
                v-else-if="f.type === 'boolean'"
              >
                {{ data[f.key] == 0 ? "Ada" : "Tidak Ada" }}
              </div>

              <div
                class="value"
                v-else-if="f.type == 'html'"
                v-html="data[f.key]"
              ></div>

              <p class="mb-0 value" v-else>
                {{ data[f.key] }} {{ f.append ? f.append : "" }}
              </p>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col md="12">
      <scooping-visit-gis-verification
        :dataKey="verifGisModal"
        @success="onSuccessGisVerification"
        :dryLandArea="data.dry_land_area"
        :scoopingVisitCode="data.data_no"
        v-if="data.dry_land_area"
      />
    </v-col>
    <v-col md="12">
      <scooping-visit-verification
        :dataKey="verifModal"
        @success="onSuccessVerification"
      />
    </v-col>
  </v-row>
</template>

<script>
import DetailModalMap from "../../Activity/ScopingVisit/components/DetailModalMap.vue";
import ScoopingVisitGisVerification from "./ScoopingVisitGisVerification.vue";
import ScoopingVisitVerification from "./ScoopingVisitVerification.vue";
import defaultData from "./ScoopingVisitData";

export default {
  name: "scooping-visit-detail",
  components: {
    DetailModalMap,
    ScoopingVisitGisVerification,
    ScoopingVisitVerification,
  },
  data() {
    return {
      verifGisModal: 1,
      verifModal: 1,
      data: {},
      openMaps: false,
      updating: false,
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
              type: "badge",
              variant: "primary",
              value_type: "array",
              translate: "accessibility",
            },
            {
              key: "water_source",
              label: "Sumber Air",
              type: "badge",
              variant: "primary",
              value_type: "array",
              translate: "water_source",
            },
            {
              key: "electricity_source",
              label: "Sumber Listrik",
              type: "badge",
              variant: "primary",
              value_type: "array",
              translate: "electricity_source",
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
              translate: "agroforestry_type",
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
      loading: true,
      imagePreviewModal: true,

      otherNgo: [],
      villagePerson: [],
      projects: [],

      map: {
        key: 11101203,
        data: {
          village_polygon: null,
          dry_land_polygon: null,
        },
      },
      fields_doc: [
        {
          label: "Total Dusun",
          key: "total_dusun",
          append: "dusun",
        },
        {
          label: "Dusun Potensial",
          key: "potential_dusun",
          append: "dusun",
        },

        {
          label: "Deskripsi Potensi",
          key: "potential_description",
          type: "html",
        },

        {
          label: "Foto Akses Jalan",
          key: "photo_road_access",
          type: "image",
        },

        {
          label: "Foto Lahan Kering",
          key: "photo_dry_land",
          type: "image",
        },

        {
          label: "Foto Pertemuan",
          key: "photo_meeting",
          type: "image",
        },

        {
          label: "Profil Desa",
          key: "village_profile",
          type: "image",
        },
        {
          label: "NGO lain di desa dengan program Jasa Lingkungan",
          key: "other_ngo",
          type: "array",
        },

        {
          label: "Program Mitigasi Perubahan Iklim di Desa tersebut",
          key: "mitigation_program",
          type: "boolean",
        },

        {
          label: "Keberterimaan Masyarakat",
          key: "resident_acceptance",
        },
        {
          label: "Kontak Persons untuk Kegiatan Selanjutnya",
          key: "next_event_contact_person",
        },
        {
          label: "Kondisi Umum Lahan untuk Program T4T",
          key: "general_land_condition",
        },
        {
          label: "Potensi Pendamping Lapang",
          key: "field_companion_potency",
        },
        {
          label: "Identifikasi Kandidat FF",
          key: "ff_candidate",
        },
      ],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      // this.$_api
      //   .get("GetDetailScoopingVisit_new", { id: this.$route.query.id })
      //   .then((res) => {
      //     this.data = res.data;
      //     this.$set(this.map.data, "village_polygon", res.data.village_polygon);

      //   });

      const scoopingData = await this.$_api.get("GetDetailScoopingVisit_new", {
        id: this.$route.query.id,
      });

      const otherNgo = await this.$_api.get(
        "GetDetailScoopingVisitNGOCompetitor_new",
        { data_no: scoopingData.data.data_no }
      );
      const villagePerson = await this.$_api.get(
        "GetDetailScoopingVisitFigures_new",
        {
          data_no: scoopingData.data.data_no,
        }
      );
      const scoopingProjects = await this.$_api.get(
        "GetDetailScoopingVistiProject_new",
        {
          data_no: scoopingData.data.data_no,
        }
      );
      this.data = scoopingData.data;
      this.$set(
        this.map.data,
        "village_polygon",
        scoopingData.data.village_polygon
      );
      this.$set(
        this.map.data,
        "dry_land_polygon",
        scoopingData.data.dry_land_polygon
      );

      Promise.all([otherNgo, villagePerson, scoopingProjects]).then(
        ([resNgo, resPerson, resProject]) => {
          this.otherNgo = resNgo.data;
          this.villagePerson = resPerson.data;

          this.projects = resProject.data;
          // this.$set(this.formData, 'project_id', resProject.data)
          // this.$set(this.formData, 'project_id', [
          //   {
          //     label: 'Test',
          //     code: 1,
          //   },
          //   {
          //     label: 'Test1',
          //     code: 2,
          //   },
          // ])
        }
      );
    },

    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },

    async onVerification(type) {
      if (this.updating) return;
      this.updating = true;
      if (type == "mail_to_gis") {
        this.$_api
          .get("MailtoGis", { data_no: this.data.data_no })
          .then(() => {
            this.$_alert.success("Berhasil mengirimkan email ke GIS");
            this.$set(this.data, "email_to_gis", this.data.email_to_gis + 1);
            this.updating = false;
          })
          .catch((err) => {
            this.$_alert.error(err);
            this.updating = false;
          });
      } else if (type === "verification_gis") {
        this.verifGisModal += 1;
        this.updating = false;
      } else if (type === "verification_um") {
        this.verifModal += 1;
        this.updating = false;
      }
    },

    onSuccessGisVerification() {
      this.$set(this.data, "is_verify", 1);
      this.$set(this.data, "status", "ready_to_submit");

      // this.getData();
    },

    onSuccessVerification() {
      this.$set(this.data, "is_verify", 1);
      this.$set(this.data, "status", "ready_to_submit");
      this.getData();
    },
  },

  computed: {
    defaultData() {
      return defaultData;
    },
  },
};
</script>
