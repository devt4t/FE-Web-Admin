<template>
  <v-row class="lahan-detail" :key="'lahan-detail' + componentKey">
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
          <h5 class="mb-0 pb-0">Detail Lahan</h5>
        </v-card-title>
        <div class="lahan-side-wrapper">
          <lahan-gis-verification
            v-if="
              data.main_lahan &&
              ['13', '14'].includes(this.$store.state.User.role)
            "
            :data="data.main_lahan"
            @success="componentKey += 1"
            @polygon_change="onChangePolygon"
          />
          <div
            v-if="data.main_lahan"
            class="lahan-side-list"
            v-for="(item, i) in side"
            :key="'land-detail-row-' + i"
          >
            <h4>{{ item.name }}</h4>

            <div class="lahan-side-item-wrapper">
              <div
                class="lahan-side-item"
                v-for="(v, j) in item.items"
                :key="'lahan-item' + i + j"
              >
                <p class="mb-0 label">{{ v.label }}</p>
                <div class="value">
                  <p class="mb-0 value qrcode" v-if="v.type === 'qrcode'">
                    <qr-code :text="data.main_lahan.barcode" />
                  </p>
                  <p class="mb-0 value" v-else>
                    <span v-if="v.prepend">{{ v.prepend }}</span>
                    <span
                      :class="{
                        [v.class || '']: true,
                      }"
                      >{{
                        getValue(v.key) | parse(v.transform || "no-empty")
                      }}</span
                    >
                    <span v-if="v.append">{{ v.append }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card></v-col
    >

    <v-col lg="8">
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="scooping-visit-detail-card mb-5"
      >
        <v-card-title>
          <h5 class="mb-0 pb-0">Polygon, Pohon &amp; Lainnya</h5>
        </v-card-title>

        <div class="lahan-stat-list">
          <div class="lahan-stat-item">
            <p class="mb-0 label">Project</p>
            <p class="mb-0 value">
              <span
                v-if="
                  Array.isArray(data.lahan_project) &&
                  data.lahan_project.length > 0
                "
              >
                {{ data.lahan_project[0].project_no }}
              </span>
              <span v-else>-</span>
            </p>
          </div>
          <div class="lahan-stat-item">
            <p class="mb-0 label">Luas Lahan</p>
            <p class="mb-0 value" v-if="data.main_lahan">
              <span>{{ data.main_lahan.land_area | parse("ts") }} Ha</span>
            </p>
          </div>
          <div class="lahan-stat-item">
            <p class="mb-0 label">Luas Tanam</p>
            <p class="mb-0 value" v-if="data.main_lahan">
              <span>{{ data.main_lahan.planting_area | parse("ts") }} Ha</span>
            </p>
          </div>
        </div>
        <div class="polygon-wrapper">
          <div class="map-wrapper" style="height: 400px; width: 100%">
            <div ref="mapContainer" class="map-container" v-if="mapOpen"></div>
            <div class="map-placeholder" v-else>
              <v-btn variant="success" @click="openMaps">
                <v-icon>mdi-google-maps</v-icon>
                <span>Buka Maps</span>
              </v-btn>
            </div>
          </div>

          <div class="lahan-photo-list d-flex flex-row" v-if="data.main_lahan">
            <div
              v-if="
                data.main_lahan.photo1 !== '-' ||
                data.main_lahan.photo2 !== '-' ||
                data.main_lahan.photo3 !== '-' ||
                data.main_lahan.photo4 !== '-'
              "
              class="lahan-photo-item"
              v-for="(item, i) in [1, 2, 3, 4]"
              :key="'lahan-photo' + i"
              @click="
                showLightbox(
                  $_config.baseUrlUpload + '/' + data.main_lahan[`photo${item}`]
                )
              "
              v-bind:style="{
                backgroundImage:
                  'url(' +
                  $_config.baseUrlUpload +
                  '/' +
                  data.main_lahan[`photo${item}`] +
                  ')',
              }"
            >
              <h6>Foto Lahan {{ item }}</h6>
            </div>
          </div>

          <div class="trees">
            <h4>Pohon</h4>

            <div class="tree-list">
              <div
                class="tree-item"
                v-for="(item, i) in Array.isArray(data.lahan_detail)
                  ? data.lahan_detail
                  : []"
              >
                <v-icon>mdi-tree</v-icon>
                <div class="tree-item-wrapper">
                  <span class="label">Pohon {{ item.trees_tree_name }} </span>
                  <span class="value">{{ item.amount | parse("ts") }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import VueQRCodeComponent from "vue-qrcode-component";
import LahanGisVerification from "./LahanGisVerification.vue";

export default {
  name: "land-detail",
  components: {
    "qr-code": VueQRCodeComponent,
    LahanGisVerification,
  },
  methods: {
    onChangePolygon(newPath) {
      
    },
    getValue(data) {
      var _value = this.data;
      for (const key of data.split(".")) {
        if (_value[key]) {
          _value = _value[key];
        }
      }

      if (typeof _value === "object") return "-";

      return _value;
    },
    async getData() {
      const result = await this.$_api.get("getDetailLahan_new", {
        id: this.$route.query.id,
      });

      this.data = result;
      this.openMaps();
    },

    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },

    async loadKml(url) {
      return new Promise(async (resolve) => {
        const data = await omnivore.kml(url).on("ready", async function () {
          const geoJson = await data.toGeoJSON();
          if (geoJson.features.length > 1) {
            let _coordinates = [];

            for (const _c of geoJson.features) {
              _coordinates.push(_c.geometry.coordinates);
            }

            _coordinates.push(geoJson.features[0].geometry.coordinates);

            let _model = {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: [_coordinates],
                  },
                  properties: {
                    name: "Area 1",
                    styleUrl: "#style1",
                    styleHash: "-3bc05740",
                  },
                },
              ],
            };

            return resolve(_model);
          }

          return resolve(geoJson);
        });
      });
    },

    async addMapLayer(data, id, borderColor, fillColor) {
      await this.map.addSource(id, {
        type: "geojson",
        data: data,
      });

      if (fillColor) {
        await this.map.addLayer({
          id: id + "-fill",
          type: "fill",
          source: id,
          layout: {},
          paint: {
            "fill-color": fillColor,
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.1,
              0.5,
            ],
          },
        });
      }

      await this.map.addLayer({
        id: id + "-border",
        type: "line",
        source: id,
        layout: {},
        paint: {
          "line-color": borderColor,
          "line-width": 2,
        },
      });
    },

    async openMaps() {
      this.mapOpen = true;
      setTimeout(async () => {
        this.$set(this.maps, "center", [
          parseFloat(this.data.main_lahan.longitude),
          parseFloat(this.data.main_lahan.latitude),
        ]);
        mapboxgl.accessToken = this.$_config.mapBoxApi;
        this.map = await new mapboxgl.Map({
          container: this.$refs.mapContainer,
          style: this.$_config.mapBoxStyle,
          zoom: 17,
          projection: "globe",
        });

        await this.map.dragRotate.disable();

        await this.map.touchZoomRotate.disableRotation();
        await this.map.addControl(new mapboxgl.FullscreenControl());
        await this.map.addControl(new mapboxgl.NavigationControl());

        // const kmlGisData = await this.loadKml(
        //   "https://t4tadmin.kolaborasikproject.com/lahans/polygon-ff/example-giss_revisi.kml"
        // );

        //
        const kmlData = await this.loadKml(
          `https://t4tadmin.kolaborasikproject.com/${this.data.main_lahan.polygon_from_ff}`
        );

        this.map.on("load", async () => {
          // this.addMapLayer(kmlGisData, "Map-Layer2", "#1F6200", "#97F570");
          this.addMapLayer(kmlData, "Map-Layer1", "#FF7B7B", null);

          const centerCoordinate = turf.center(kmlData);
          const mapCenter = centerCoordinate.geometry.coordinates;
          this.map.setCenter(mapCenter);
          this.mapReady = true;
        });
      }, 1000);
    },
  },

  mounted() {
    this.getData();
  },
  data() {
    return {
      map: null,
      mapReady: false,
      mapOpen: true,
      componentKey: 0,
      maps: {
        accessToken: this.$_config.mapBoxApi,
        mapStyle: this.$_config.mapBoxStyle,
        center: [113.9213, -0.7893],
        zoom: 3,
        geojson: {},
        key: 111,
        layerId: 0,
        hoveredStateId: 0,
        layerStyle: {
          outline: {
            color: "#000000",
          },
          fill: {
            color: "#f06800",
          },
        },
        popup: {
          model: false,
          content: {
            title: "",
            description: "",
          },
        },
      },
      side: [
        {
          name: "Informasi Lahan",
          items: [
            {
              label: "QR Code",
              key: "main_lahan.barcode",
              type: "qrcode",
            },
            {
              label: "No. Lahan",
              key: "main_lahan.lahan_no",
              class: "badge bg-primary",
            },
            {
              label: "No. Dokumen",
              key: "main_lahan.document_no",
              class: "font-weight-300",
            },
            {
              label: "Luas",
              key: "main_lahan.land_area",
              class: "font-weight-bold",
              append: " Ha",
              transform: "ts",
            },
            {
              label: "Luas Tanam",
              key: "main_lahan.planting_area",
              class: "font-weight-bold",
              append: " Ha",
              transform: "ts",
            },
          ],
        },
        {
          name: "Kondisi Lahan",
          items: [
            {
              label: "Status",
              key: "main_lahan.approve",
            },
            {
              label: "Jenis Lahan",
              key: "main_lahan.lahan_type",
            },
            {
              label: "Kondisi Terbaru",
              key: "main_lahan.latest_condition",
            },
            {
              label: "Deskripsi",
              key: "main_lahan.description",
            },
          ],
        },
        {
          name: "Petani",
          items: [
            {
              label: "Nama",
              key: "main_lahan.farmers_name",
              class: "fotn-weight-bold",
            },
            {
              label: "Kode",
              key: "main_lahan.farmer_no",
            },
            {
              label: "Nama FF",
              key: "main_lahan.field_facilitators_name",
            },
          ],
        },
        {
          name: "Lokasi Lahan",
          items: [
            {
              label: "Management Unit",
              key: "main_lahan.managementunits_name",
            },
            {
              label: "Target Area",
              key: "main_lahan.target_areas_name",
            },
            {
              label: "Koordinat",
              key: "main_lahan.coordinate",
            },
            {
              label: "Desa",
              key: "main_lahan.desas_name",
            },
            {
              label: "Akses Lahan",
              key: "main_lahan.access_to_lahan",
            },
            {
              label: "Akses Sumber Air",
              key: "main_lahan.access_to_water_sources",
            },
            {
              label: "Jarak Lahan",
              key: "main_lahan.jarak_lahan",
            },
          ],
        },
        {
          name: "Informasi Lainnya",
          items: [
            {
              label: "Pestisida",
              key: "main_lahan.pesticide",
            },
            {
              label: "Ketersediaan Air",
              key: "main_lahan.water_availability",
            },
            {
              label: "Pola Tanam",
              key: "main_lahan.opsi_pola_tanam",
            },
          ],
        },
      ],
      data: {
        main_lahan: null,
        broken_barcode: [],
        lahan_detail: [],
        lahan_polygon: [],
        lahan_project: [],
        lahan_tutupan: [],
        lahan_tutupan_request: [],
      },
    };
  },
};
</script>
