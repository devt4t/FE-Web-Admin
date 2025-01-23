<template>
  <div>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-1">
          <v-data-table :headers="headerBibits" :items="data.seed_detail" :search="''" class="rounded-xl elevation- pa-1 px-5"
            :footer-props="{
              showCurrentPage: false,
              showFirstLastPage: false,
            }">
            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                  <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Detail Bibit
                  </h4>
                  </div>
                  <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                  </div>
              </div>
              <div class="statistics mb-3">
                <div class="statistic-item success">
                  <v-icon>mdi-seed</v-icon>
                  <div class="statistic-data">
                      <p class="mb-0 label">Total Tertanam</p>
                      <p class="mb-0 value">{{ assignStatisticData('planted') ?? 0 }}</p>
                  </div>
                </div>
                <div class="statistic-item warning">
                  <v-icon>mdi-seed-plus</v-icon>
                  <div class="statistic-data">
                      <p class="mb-0 label">Total Belum Ditanam</p>
                      <p class="mb-0 value">{{ assignStatisticData('unplanted') ?? 0 }}</p>

                  </div>
                </div>
                <div class="statistic-item info">
                  <v-icon>mdi-sprout</v-icon>
                  <div class="statistic-data">
                      <p class="mb-0 label">Total Hidup</p>
                      <p class="mb-0 value">{{ assignStatisticData('alive') ?? 0 }}</p>

                  </div>
                </div>
                <div class="statistic-item danger">
                  <v-icon>mdi-seed-off</v-icon>
                  <div class="statistic-data">
                      <p class="mb-0 label">Total Mati</p>
                      <p class="mb-0 value">{{ assignStatisticData('die') ?? 0 }}</p>
                  </div>
                </div>
                <div class="statistic-item danger">
                  <v-icon>mdi-eye-remove</v-icon>
                  <div class="statistic-data">
                      <p class="mb-0 label">Total Hilang</p>
                      <p class="mb-0 value">{{ assignStatisticData('gone') ?? 0 }}</p>
                  </div>
                </div>
              </div>
            </template>



            <template v-slot:item.index="{ index }">
              <div class="ml-2">
                {{ index + 1 }}

              </div>
            </template>
            <template v-slot:item.planted_status="{ item }">
              <div class="d-flex flex-row min-w-100px mb-3" style="justify-content: space-around">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-info">
                            <v-icon size="small">mdi-sprout</v-icon> {{ item.planted ?? 0 }}
                        </span>
                    </template>

                    <span>Total Tertanam</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-success">
                            <v-icon size="small">mdi-sprout</v-icon> {{ item.planted_life ?? 0 }}
                        </span>
                    </template>

                    <span>Total Tertanam Hidup</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-danger">
                            <v-icon size="small">mdi-sprout</v-icon> {{ item.planted_dead ?? 0 }}
                        </span>
                    </template>

                    <span>Total Tertanam Mati</span>
                </v-tooltip>
              </div>
              <div class="d-flex flex-row min-w-100px" style="justify-content: space-around">
                <v-btn variant="success" class="mr-2" @click="showLightbox($_config.baseUrlUpload + '/' + item.planted_life_photo)">
                      <v-icon>mdi-camera</v-icon>
                  </v-btn>
                <v-btn variant="danger" class="mr-2" @click="showLightbox($_config.baseUrlUpload + '/' + item.planted_death_photo)">
                    <v-icon>mdi-camera</v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:item.unplanted_status="{ item }">
              <div class="d-flex flex-row min-w-100px max-w-200px" style="justify-content: space-around">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-info">
                            <v-icon size="small">mdi-sprout-outline</v-icon> {{ item.unplanted ?? 0 }}
                        </span>
                    </template>

                    <span>Total Belum Tertanam</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-success">
                            <v-icon size="small">mdi-sprout-outline</v-icon> {{ item.unplanted_life ?? 0 }}
                        </span>
                    </template>

                    <span>Total Belum Tertanam Hidup</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="badge bg-danger">
                            <v-icon size="small">mdi-sprout-outline</v-icon> {{ item.unplanted_dead ?? 0 }}
                        </span>
                    </template>

                    <span>Total Belum Tertanam Mati</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn variant="light" class="mr-2" @click="showLightbox($_config.baseUrlUpload + '/' + item.unplanted_death_photo)">
                      <v-icon>mdi-table-arrow-right</v-icon>
                      <span>Belum Tertanam Mati </span>
                  </v-btn>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:item.gone="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <span v-on="on" class="badge bg-danger">
                        <v-icon size="small">mdi-magnify-close</v-icon> {{ item.gone ?? 0 }}
                    </span>
                </template>
                <span>Total Hilang</span>
              </v-tooltip>
            </template>
            <template v-slot:item.life_photo="{ item }">
              <div class="d-flex flex-row lahan-photo" style="max-width: 100px">
                <v-img
                  :src="$_config.baseUrlUpload + '/' + item.life_photo"
                  alt="Foto Pohon Hidup"
                  :width="100"
                  @click="showLightbox($_config.baseUrlUpload + '/' + item.life_photo)"
                  class="tree-life-monitoring-img"
                >
                  <template v-slot:placeholder>
                    <div class="tree-life-monitoring-placeholder">
                      <v-progress-circular
                        color="primary"
                        indeterminate
                        :size="20"
                      ></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </div>
            </template>
            <template v-slot:item.death_photo="{ item }">
              <div class="d-flex flex-row lahan-photo" style="max-width: 100px">
                <v-img
                  :src="$_config.baseUrlUpload + '/' + item.death_photo"
                  alt="Foto Pohon Hidup"
                  :width="100"
                  @click="showLightbox($_config.baseUrlUpload + '/' + item.death_photo)"
                  class="tree-life-monitoring-img"
                >
                  <template v-slot:placeholder>
                    <div class="tree-life-monitoring-placeholder">
                      <v-progress-circular
                        color="primary"
                        indeterminate
                        :size="20"
                      ></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">

          <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
              <h4>Titik Koordinat Penanaman</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar"></div>
            </div>
          </div>

          <div>
            <div ref="mapContainer" id="mapContainer" class="map-container"
              style="width: 100%; height: 400px; border-radius: 10px;"></div>
          </div>


        </v-card>
      </v-col>
    </v-row>

  </div>

</template>

<script>

export default {
  name: "penilikan-tanam-detail",
  props: {
    data: {
      required: true,
      default: [],
      configKehadiranFC: {
        table: {
          header: [
            {
              key: "index",
              sortable: false,
              text: "No",
              value: "index",
            },
            {
              key: "fc_no",
              sortable: false,
              text: "No. FC",
              value: "fc_no",
            },
            {
              key: "name",
              sortable: false,
              text: "Nama",
              value: "name",
            }
          ]
        }
      }
    },
  },
  mounted() {
    this.initializeMap()
    // this.getBibits()
  },
  methods: {
    // async getBibits() {
    //   this.$_api.get('first-monitorings/main/detail-seed', {
    //     id: this.data.result.id
    //   }).then(res => {
    //     this.bibits = res.data
    //   })
    // },
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    assignStatisticData(type){
      if(type == 'planted') return this.data.seed_detail.reduce((n, {planted}) => n + planted, 0)
      if(type == 'unplanted') return this.data.seed_detail.reduce((n, {unplanted}) => n + unplanted, 0)
      if(type == 'gone') return this.data.seed_detail.reduce((n, {gone}) => n + gone, 0)
      if(type == 'alive') return this.data.seed_detail.reduce((n, {alive}) => n + alive, 0)
      if(type == 'die') return this.data.seed_detail.reduce((n, {die}) => n + die, 0)
    },
    async initializeMap() {
      mapboxgl.accessToken = this.$_config.mapBoxApi;
      let mapLatitude = -7.024947076120682
      let mapLongitude = 110.41467292861057
      try {
        mapLatitude = this.data.result.lands_coordinates.latitude
        mapLongitude = this.data.result.lands_coordinates.longitude
      }
      catch (e) { console.log(e) }
      this.maps = await new mapboxgl.Map({
        container: "mapContainer",
        style: this.$_config.mapBoxStyle,
        zoom: 12,
        projection: "globe",
        maxZoom: 100,
        preserveDrawingBuffer: true,
        center: [mapLongitude, mapLatitude],
      });

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });
      await this.maps.dragRotate.disable();
      await this.maps.touchZoomRotate.disableRotation();
      await this.maps.addControl(new mapboxgl.FullscreenControl());
      await this.maps.addControl(new mapboxgl.NavigationControl());
      await this.maps.addControl(geolocate);
      this.marker = new mapboxgl.Marker({ color: "red", anchor: "center" })
        .setLngLat([mapLongitude, mapLatitude])
        .addTo(this.maps);
      // this.maps.on("click", (data) => {
      //     this.marker.setLngLat(data.lngLat);
      // });
    },
  },
  data() {
    return {
      // bibits: [],
      headerBibits: [
        {
          text: 'No',
          key: 'index',
          value: 'index',
        },
        {
          text: 'Nama Bibit',
          key: 'tree_name',
          value: 'tree_name',
        },
        {
          text: 'Kode Pohon',
          key: 'tree_code',
          value: 'tree_code',
        },
        {
          text: 'Total Tertanam',
          key: 'planted_status',
          value: 'planted_status',
        },
        {
          text: 'Belum Ditanam',
          key: 'unplanted_status',
          value: 'unplanted_status',
        },
        {
          text: 'Total Hidup',
          key: 'alive',
          value: 'alive',
        },
        {
          text: 'Mati',
          key: 'die',
          value: 'die',
        },
        {
          text: 'Hilang',
          key: 'gone',
          value: 'gone',
        },
      ],
    }
  }
}
</script>