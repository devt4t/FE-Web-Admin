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
          <div class="lahan-side-list">
            <h4>Action</h4>

            <div
              class="lahan-side-item-wrapper"
              style="flex-wrap: wrap; width: 100%"
              v-if="data.main_lahan"
            >
              <div
                class="lahan-side-item d-flex flex-col"
                style="flex-wrap: wrap"
              >
                <v-btn
                  v-if="
                    !openGisEdit &&
                    ['2', '13', '14'].includes($store.state.User.role) &&
                    data.main_lahan.fc_complete_data == 1
                  "
                  variant="success"
                  class="mr-1 mb-1"
                  @click="
                    openGisEdit = true;
                    verifRole = 'gis';
                  "
                  >Verifikasi GIS</v-btn
                >
                <v-btn
                  v-if="
                    !openGisEdit &&
                    ['13', '19'].includes($store.state.User.role)
                  "
                  variant="success"
                  class="mr-1 mb-2"
                  @click="
                    openGisEdit = true;
                    verifRole =
                      data.main_lahan.fc_complete_data == null
                        ? 'fc-verif-data'
                        : 'fc';
                  "
                  >Verifikasi FC</v-btn
                >
                <v-btn
                  v-if="
                    !openGisEdit &&
                    ['13', '20'].includes($store.state.User.role)
                  "
                  variant="success"
                  class="mr-1 mb-2"
                  @click="
                    openGisEdit = true;
                    verifRole = 'um';
                  "
                  >Verifikasi UM</v-btn
                >
              </div>
            </div>
          </div>
          <lahan-gis-verification
            v-if="
              data.main_lahan &&
              ['4', '13', '14', '19', '20'].includes(
                this.$store.state.User.role
              ) &&
              openGisEdit
            "
            :data="data.main_lahan"
            :questions="
              data.lahan_term_question_list.filter((x) => {
                if (verifRole == 'gis') return x.role_id == 14;
                else if (verifRole == 'um') return x.role_id == 20;
                else if (verifRole == 'fc') return x.role_id == 19;
              })
            "
            :answers="data.lahan_term_answer_list"
            :role="verifRole"
            @success="
              componentKey += 1;
              openGisEdit = false;
              getData();
            "
            @polygon_change="onChangePolygon"
            @close="
              openGisEdit = false;
              verifRole = null;
            "
          />

          <div class="lahan-side-list">
            <h4>Status &amp; Log</h4>

            <div class="lahan-side-item-wrapper" v-if="data.main_lahan">
              <div class="lahan-side-item">
                <p class="mb-0 label">Status</p>
                <div class="d-flex flex-row value">
                  <span
                    :class="{
                      'badge bg-warning': data.main_lahan.approve == 0,
                      'badge bg-info': data.main_lahan.approve == 1,
                      'badge bg-success': data.main_lahan.approve == 2,
                    }"
                  >
                    <span v-if="data.main_lahan.approve == 0"
                      >Belum Diverifikasi</span
                    >
                    <span v-else-if="data.main_lahan.approve == 1"
                      >Diverifikasi FC</span
                    >
                    <span v-else-if="data.main_lahan.approve == 2"
                      >Diverifikasi UM</span
                    >
                  </span>
                </div>
              </div>
              <div class="lahan-side-item">
                <p class="mb-0 label">Eligible Status</p>
                <div class="d-flex flex-row value">
                  <span
                    :class="{
                      'text-danger': data.main_lahan.eligible_status == 0,
                      'text-warning': data.main_lahan.eligible_status == 1,
                      'text-success': data.main_lahan.eligible_status == 2,
                    }"
                  >
                    <span v-if="data.main_lahan.eligible_status == 0"
                      >Tidak Bisa Ikut</span
                    >
                    <span v-else-if="data.main_lahan.eligible_status == 1"
                      >Bisa Ikut Dengan Tindakan Tambahan</span
                    >
                    <span v-else-if="data.main_lahan.eligible_status == 2"
                      >Bisa Ikut</span
                    >
                    <span v-else>-</span>
                  </span>
                </div>
              </div>

              <div
                class="lahan-side-item d-flex flex-col"
                style="flex-direction: column !important"
              >
                <p class="mb-0 label">Log Data</p>
                <div class="d-flex flex-col log-data" v-if="data.main_lahan">
                  <div class="log-data-item active">
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span class="time">{{
                        formatDate(
                          data.main_lahan.created_at,
                          "D MMMM YYYY HH:mm"
                        )
                      }}</span>
                      <span class="label">FF Menambahkan Data Lahan</span>
                      <span class="user"
                        >FF: {{ data.main_lahan.field_facilitators_name }}</span
                      >
                    </div>
                  </div>

                  <div
                    class="log-data-item"
                    :class="{
                      active: data.main_lahan.fc_complete_data == 1,
                    }"
                  >
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span
                        class="time"
                        v-if="data.main_lahan.fc_complete_data_at"
                        >{{
                          formatDate(
                            data.main_lahan.fc_complete_data_at,
                            "D MMMM YYYY HH:mm"
                          )
                        }}</span
                      >
                      <span class="label">FC Verifikasi Kelengkapan Data</span>
                      <span
                        class="user"
                        v-if="data.main_lahan.fc_complete_data_by"
                        >{{ data.main_lahan.fc_complete_data_by }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="log-data-item"
                    :class="{
                      active: data.main_lahan.gis_updated_at,
                    }"
                  >
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span
                        class="time"
                        v-if="data.main_lahan.gis_updated_at"
                        >{{
                          formatDate(
                            data.main_lahan.gis_updated_at,
                            "D MMMM YYYY HH:mm"
                          )
                        }}</span
                      >
                      <span class="label"
                        >GIS Verifikasi Polygon & Data Lahan</span
                      >
                      <span
                        class="user"
                        v-if="data.main_lahan.gis_updated_at"
                        >{{ data.main_lahan.gis_officer }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="log-data-item"
                    :class="{
                      active: data.main_lahan.approved_at,
                    }"
                  >
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span class="time" v-if="data.main_lahan.approved_at">{{
                        formatDate(
                          data.main_lahan.approved_at,
                          "D MMMM YYYY HH:mm"
                        )
                      }}</span>
                      <span class="label">FC Verifikasi Data Lahan</span>
                      <span v-if="data.main_lahan.approved_by" class="user">{{
                        data.main_lahan.approved_by
                      }}</span>
                    </div>
                  </div>
                  <div
                    class="log-data-item"
                    :class="{
                      active: data.main_lahan.update_eligible_at,
                    }"
                  >
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span
                        class="time"
                        v-if="data.main_lahan.update_eligible_at"
                        >{{
                          formatDate(
                            data.main_lahan.update_eligible_at,
                            "D MMMM YYYY HH:mm"
                          )
                        }}</span
                      >
                      <span class="label"
                        >UM Menentukan Eligibilitas Lahan</span
                      >
                      <span
                        v-if="data.main_lahan.update_eligible_by"
                        class="user"
                        >{{ data.main_lahan.update_eligible_by }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  <span class="mb-0 value" v-if="v.key === 'project'">
                    <p
                      v-if="v.key === 'project'"
                      v-for="(project, j) in data.lahan_project"
                      :key="`project-${j}`"
                    >
                      {{ project.projects_project_name }}
                    </p>
                  </span>
                  <p
                    class="mb-0 value"
                    v-if="v.type !== 'qrcode' && v.key !== 'project'"
                  >
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
            <p class="mb-0 label">Tutupan Lahan</p>
            <p class="mb-0 value">
              <span v-if="data.main_lahan"
                >{{ data.main_lahan.tutupan_lahan }}%</span
              >
            </p>
          </div>
          <div class="lahan-stat-item">
            <p class="mb-0 label">Luas Lahan</p>
            <p class="mb-0 value" v-if="data.main_lahan">
              <span v-if="data.main_lahan"
                >{{ data.main_lahan.land_area | parse("ts") }} m&sup2;</span
              >
            </p>
          </div>
          <div class="lahan-stat-item">
            <p class="mb-0 label">Luas Tanam</p>
            <p class="mb-0 value" v-if="data.main_lahan">
              <span v-if="data.main_lahan"
                >{{ data.main_lahan.planting_area | parse("ts") }} m&sup2;</span
              >
            </p>
          </div>
        </div>
        <div class="polygon-wrapper">
          <div class="map-wrapper" style="height: 400px; width: 100%">
            <div class="map-legends">
              <div
                class="map-legend-item"
                v-for="(item, i) in legends"
                :key="item.id"
                :class="{
                  active: item.show,
                  disabled: item.disabled,
                }"
                @click="toggleLayer(item, i)"
              >
                <span
                  v-if="item.id !== 'map-coordinate'"
                  class="shape"
                  :class="item.shape"
                >
                </span>
                <span v-else-if="item.id == 'map-coordinate'"
                  ><v-icon class="icon">mdi-map-marker</v-icon></span
                >
                <span>{{ item.label }}</span>
              </div>
            </div>
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

          <div class="other-data mt-5">
            <h4 class="mb-4 text-success">Data Lahan Lainnya</h4>

            <div class="other-data-list">
              <div
                class="other-data-item"
                v-for="(item, i) in mainData"
                :key="'key-' + i"
              >
                <p class="mb-0 label">{{ item[0] }}</p>
                <div class="value" v-if="data.main_lahan">
                  <span
                    v-if="
                      item.length > 2 &&
                      item[2] == 'photo' &&
                      ![null, undefined, '', '-'].includes(
                        data.main_lahan[item[1]]
                      ) &&
                      data.main_lahan[item[1]] !== '-'
                    "
                  >
                    <img
                      :src="
                        $_config.baseUrlUpload + '/' + data.main_lahan[item[1]]
                      "
                      alt=""
                    />
                  </span>
                  <span
                    v-else-if="
                      item.length > 2 &&
                      item[2] == 'boolean' &&
                      data.main_lahan[item[1]] !== '-' &&
                      ![null, undefined, '', '-'].includes(
                        data.main_lahan[item[1]]
                      )
                    "
                  >
                    <span
                      class="badge"
                      :class="{
                        'bg-success': data.main_lahan[item[1]] == 1,
                        'bg-danger': data.main_lahan[item[1]] == 0,
                      }"
                    >
                      <v-icon v-if="data.main_lahan[item[1]] == 1"
                        >mdi-circle-fill</v-icon
                      >
                      <v-icon v-else-if="data.main_lahan[item[1]] == 0"
                        >mdi-close-circle-fill</v-icon
                      >
                      <span
                        >{{
                          data.main_lahan[item[1]] == 1
                            ? "Ya"
                            : data.main_lahan[item[1]] == 0
                            ? "Tidak"
                            : "-"
                        }}
                      </span>
                    </span>
                  </span>

                  <span
                    v-else-if="
                      ![null, undefined, '', '-'].includes(
                        data.main_lahan[item[1]]
                      )
                    "
                  >
                    <span>{{ data.main_lahan[item[1]] }}</span>
                    <span
                      v-if="
                        item.length > 4 &&
                        item[4] &&
                        ![null, undefined, '', '-'].includes(
                          data.main_lahan[item[1]]
                        )
                      "
                      >{{ item[4] }}</span
                    ></span
                  >

                  <span v-else>-</span>
                </div>
              </div>
            </div>
          </div>
          <div class="questions mt-5 pt-5">
            <h4 class="mb-4 text-success">
              Kelayakan dan Kesesuaian Lahan Project
            </h4>
            <table class="eligibility-table geko-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Indikator</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(question, i) in data.lahan_term_question_list"
                  :key="`question-${i}`"
                >
                  <td class="text-center">{{ i + 1 }}</td>
                  <td>{{ question.question }}</td>
                  <td>
                    <div class="center-v text-no-wrap">
                      <span
                        class="badge"
                        :class="{
                          'bg-danger':
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ) &&
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ).term_answer == 0,
                          'bg-success':
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ) &&
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ).term_answer == 1,
                        }"
                      >
                        <span
                          class="center-v text-no-wrap"
                          v-if="
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ) &&
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ).term_answer == 0
                          "
                        >
                          <v-icon small class="mr-1"
                            >mdi-close-circle-outline</v-icon
                          >
                          <span>Ya</span>
                        </span>
                        <span
                          class="center-v text-no-wrap"
                          v-else-if="
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ) &&
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ).term_answer == 1
                          "
                        >
                          <v-icon small class="mr-1"
                            >mdi-check-circle-outline</v-icon
                          >
                          <span>Ya</span>
                        </span>

                        <span v-else>-</span>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import VueQRCodeComponent from "vue-qrcode-component";
import LahanGisVerification from "./LahanGisVerification.vue";
import moment from "moment";
export default {
  name: "land-detail",
  components: {
    "qr-code": VueQRCodeComponent,
    LahanGisVerification,
  },
  methods: {
    toggleLayer(item, i) {
      var isLayerFillExist = this.map.getLayer(`${item.id}-fill`);
      if (isLayerFillExist) {
        this.map.setLayoutProperty(
          `${item.id}-fill`,
          "visibility",
          item.show ? "none" : "visible"
        );
      }

      var isLayerBorderExist = this.map.getLayer(`${item.id}-border`);
      if (isLayerBorderExist) {
        this.map.setLayoutProperty(
          `${item.id}-border`,
          "visibility",
          item.show ? "none" : "visible"
        );
      }

      if (item.id == "map-coordinate") {
        if (item.show) {
          for (const _marker of this.markers) {
            _marker.remove();
          }
          this.markers = [];
        } else {
          for (const coord of Array.isArray(this.data.lahan_polygon)
            ? this.data.lahan_polygon
            : []) {
            const marker = new mapboxgl.Marker()
              .setLngLat([coord.longitude, coord.latitude])
              .addTo(this.map);

            this.markers.push(marker);
          }
        }
      }
      if (
        !isLayerBorderExist &&
        !isLayerFillExist &&
        item.id !== "map-coordinate"
      )
        return;
      this.legends[i].show = !item.show;
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
    async onChangePolygon(newPath) {
      const kmlGisData = await this.loadKml(
        `https://t4tadmin.kolaborasikproject.com/${newPath}`
      );
      console.log("new kml", kmlGisData);
      this.addMapLayer(kmlGisData, "map-layer-2", "#1F6200", "#97F570");
      const centerCoordinate = turf.center(kmlGisData);
      const mapCenter = centerCoordinate.geometry.coordinates;
      this.$set(this.legends, 1, {
        ...this.legends[1],
        disabled: false,
        show: true,
      });

      if (this.map && this.map.setCenter instanceof Function) {
        this.map.setCenter(mapCenter);
      }
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
      if (!this.map) return;
      await this.map.addSource(id, {
        type: "geojson",
        data: data,
      });

      if (fillColor) {
        await this.map.addLayer({
          id: id + "-fill",
          type: "fill",
          source: id,
          layout: {
            visibility: "visible",
          },
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
        layout: {
          visibility: "visible",
        },
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

        this.map.on("load", async () => {
          // this.addMapLayer(kmlGisData, "Map-Layer2", "#1F6200", "#97F570");
          if (
            ![null, "-", undefined].includes(
              this.data.main_lahan.polygon_from_ff
            )
          ) {
            const kmlData = await this.loadKml(
              `https://t4tadmin.kolaborasikproject.com/${this.data.main_lahan.polygon_from_ff}`
            );

            if (kmlData.features.length > 0) {
              this.addMapLayer(kmlData, "map-layer-1", "#FF7B7B", null);
              this.$set(this.legends, 0, {
                ...this.legends[0],
                show: true,
              });

              const centerCoordinate = turf.center(kmlData);
              const mapCenter = centerCoordinate.geometry.coordinates;
              if (this.map && this.map.setCenter instanceof Function) {
                this.map.setCenter(mapCenter);
              }
            }
          }

          if (
            ![null, "-", undefined].includes(
              this.data.main_lahan.polygon_from_gis
            )
          ) {
            const kmlData = await this.loadKml(
              `https://t4tadmin.kolaborasikproject.com/${this.data.main_lahan.polygon_from_gis}`
            );
            this.addMapLayer(kmlData, "map-layer-2", "#1F6200", "#97F570");
            this.$set(this.legends, 1, {
              ...this.legends[1],
              show: true,
            });

            const centerCoordinate = turf.center(kmlData);
            const mapCenter = centerCoordinate.geometry.coordinates;
            if (this.map && this.map.setCenter instanceof Function) {
              this.map.setCenter(mapCenter);
            }
          }

          if (Array.isArray(this.data.lahan_polygon)) {
            for (const coord of this.data.lahan_polygon) {
              const marker = new mapboxgl.Marker()
                .setLngLat([
                  parseFloat(coord.longitude),
                  parseFloat(coord.latitude),
                ])
                .addTo(this.map);

              this.markers.push(marker);
            }
            if (
              [undefined, null, "", "-"].includes(
                this.data.main_lahan.polygon_from_gis
              ) &&
              [undefined, null, "", "-"].includes(
                this.data.main_lahan.polygon_from_ff
              )
            ) {
              this.map.setCenter([
                parseFloat(this.data.main_lahan.longitude),
                parseFloat(this.data.main_lahan.latitude),
              ]);
            }
            if (this.data.lahan_polygon.length > 0) {
              this.$set(this.legends, 2, {
                ...this.legends[2],
                show: true,
              });
            }
          }

          this.mapReady = true;
        });

        this.map.on("click", (e) => {
          console.log(e);
        });
      }, 1000);
    },
  },

  mounted() {
    this.getData();
  },
  data() {
    return {
      formatDate(date, format) {
        return moment(date).format(format);
      },
      map: null,
      mapReady: false,
      mapOpen: true,
      openGisEdit: false,
      componentKey: 0,
      markers: [],
      verifRole: null,
      legends: [
        {
          id: "map-layer-1",
          label: "FF Polygon",
          show: false,
          shape: "ff",
        },
        {
          id: "map-layer-2",
          label: "GIS Polygon",
          show: false,
          shape: "gis",
        },
        {
          id: "map-coordinate",
          label: "Coordinate",
          show: false,
          shape: "coordinate",
        },
      ],
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
              label: "Project",
              key: "project",
            },
          ],
        },
        {
          name: "Kondisi Lahan",
          items: [
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
      mainData: [
        [
          "Ada Habitat Satwa/Kawasan Dilindungi Terdekat",
          "animal_protected_habitat",
          "boolean",
        ],
        [
          "Jarak Ke Habitat Satwa/Kawasan Dilindungi Terdekat",
          "animal_protected_habitat_distance",
          "",
          "",
          "m",
        ],
        ["Koordinat", "coordinate"],
        ["Current Crops", "current_crops"],
        ["Deskripsi", "description"],
        ["Pupuk", "fertilizer"],
        ["Elevation", "elevation"],
        ["Drought", "drought", "boolean"],
        ["floods", "floods", "boolean"],
        ["landslide", "landslide", "boolean"],
        ["Akurasi GPS", "gps_accuration"],
        ["Kode Internal", "internal_code"],
        ["Exposure", "exposure"],
        ["Desa Terdekat", "nearby_village", "boolean"],
        ["Jarak ke Desa Terdekat", "nearby_village_distance", "boolean"],
        ["Potensi", "potency"],
        ["Jenis Tanah", "soil_type"],
        ["Foto Tanah", "soil_photo", "photo"],
        ["SPPT", "sppt", "photo"],
        ["Tutupan Lahan", "tutupan_lahan", "", "", "%"],
        ["Foto Tutupan Lahan", "tutupan_lahan_photo", "photo"],
        [
          "Tutupan Bangunan / Lainnya",
          "tutupan_lain_bangunan_percentage",
          "",
          "",
          "%",
        ],
        [
          "Foto Tutupan Bangunan / Lainnya",
          "tutupan_lain_bangunan_photo",
          "photo",
        ],

        [
          "Tutupan Tanaman Bawah",
          "tutupan_tanaman_bawah_percentage",
          "",
          "",
          "%",
        ],
        ["Foto Tutupan Tanaman Bawah", "tutupan_tanaman_bawah_photo", "photo"],
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
