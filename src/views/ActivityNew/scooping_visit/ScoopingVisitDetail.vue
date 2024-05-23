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
          <h5 class="mb-0 pb-0">Detail</h5>
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
            :data="map.data"
            :key="map.key + 'DetailModalMapSCopingVisit'"
          />

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
                    class="doc-photo"
                    v-bind:style="{
                      backgroundImage:
                        'url(' + $store.state.apiUrlImage + image + ')',
                    }"
                  ></div>
                </div>
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

    <v-dialog v-model="imagePreviewModal" width="auto" v-if="false">
      <v-card
        max-width="400"
        prepend-icon="mdi-update"
        text="Your application will relaunch automatically after the update is complete."
        title="Update in progress"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="imagePreviewModal = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import DetailModalMap from "../../Activity/ScopingVisit/components/DetailModalMap.vue";
export default {
  name: "scooping-visit-detail",
  components: { DetailModalMap },
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
      loading: true,
      imagePreviewModal: true,

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
          this.$set(this.map.data, "village_polygon", res.data.village_polygon);
          this.$set(
            this.map.data,
            "dry_land_polygon",
            res.data.dry_land_polygon
          );
        });
    },
  },
};
</script>
