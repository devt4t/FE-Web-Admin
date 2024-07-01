<template>
  <v-row class="lahan-detail">
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
        <div class="polygon-wrapper">
          <div class="map-wrapper" style="height: 400px; width: 100%">
            <div ref="mapContainer" class="map-container"></div>
          </div>

          <div class="lahan-photo-list d-flex flex-row" v-if="data.main_lahan">
            <div
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

export default {
  name: "land-detail",
  components: {
    "qr-code": VueQRCodeComponent,
  },
  methods: {
    getValue(data) {
      var _value = this.data;
      for (const key of data.split(".")) {
        if (_value[key]) {
          _value = _value[key];
        }
      }

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
          return resolve(geoJson);
        });
      });
    },

    async addMapLayer(data, id, borderColor, fillColor) {
      await this.map.addSource(id, {
        type: "geojson",
        data: data,
      });
      await this.map.addLayer({
        id: id + "-fill",
        type: "fill",
        source: id, // reference the data source
        layout: {},
        paint: {
          "fill-color": fillColor, // blue color fill
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.1,
            0.5,
          ],
        },
      });

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
      this.$set(this.maps, "center", [
        parseFloat(this.data.main_lahan.longitude),
        parseFloat(this.data.main_lahan.latitude),
      ]);
      this.$set(
        this.maps,
        "data",
        "https://t4tadmin.kolaborasikproject.com/scooping_visits/village_polygon/33_01_24_2004.kml"
      );
      mapboxgl.accessToken = this.$_config.mapBoxApi;
      const map = await new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: this.$_config.mapBoxStyle, // Replace with your preferred map style
        center: this.maps.center,
        zoom: 9,
      });

      await map.addControl(new mapboxgl.NavigationControl());
      const kmlData = await this.loadKml(
        "https://t4tadmin.kolaborasikproject.com/scooping_visits/village_polygon/33_09_22_2002.kml"
      );

      const kmlGisData = await this.loadKml(
        "https://t4tadmin.kolaborasikproject.com/scooping_visits/village_polygon/33_09_22_2002-dry_land.kml"
      );
      // const kmlData = await omnivore
      //   .kml(
      //     "https://t4tadmin.kolaborasikproject.com/scooping_visits/village_polygon/33_01_24_2004.kml"
      //   )
      //   .on("ready", async function () {
      //     const testgeo = await kmlData.toGeoJSON();
      //     console.log("geojson", testgeo);
      //   });
      // console.log("kmldata", kmlData);
      // const geoJsonData = await kmlData.toGeoJSON();
      // console.log("geo json data", geoJsonData);
      // console.log("geo jsons", kmlData.features);
      map.on("load", async () => {
        // layerStyle.fill.color = this._utils.getRandomColor();
        this.addMapLayer(kmlData, "Map-Layer2", "#1F6200", "#97F570");
        this.addMapLayer(kmlGisData, "Map-Layer1", "#A70100", "#FFBAB9");
      });

      this.map = map;
    },
  },

  mounted() {
    this.getData();
  },
  data() {
    return {
      map: null,
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
