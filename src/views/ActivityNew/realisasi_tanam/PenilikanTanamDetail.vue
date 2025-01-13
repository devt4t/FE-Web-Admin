<template>
  <div>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-1">
          <v-data-table :headers="headerBibits" :items="data.seed_detail" :search="''" class="rounded-xl elevation-1 "
            :footer-props="{
              showCurrentPage: false,
              showFirstLastPage: false,
            }">
            <template v-slot:top>
              <div class="geko-list-header mb-3 d-flex flex-row justify-content-between px-5 py-3 mt-1">
                <div class="pr-5 mr-5">
                  <h4>Detail Bibit</h4>
                </div>


              </div>
              <!-- <div class="flex flex-col justify-content-between"> -->
              <!-- <div class="statistics mb-3 mx-3">
                <div class="statistic-item success">
                  <v-icon>mdi-list-status</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Tertanam</p>
                    <p class="mb-0 value">{{ '1' }}</p>
                  </div>
                </div>
              </div>
              <div class="statistics mb-3 mx-3">
                <div class="statistic-item danger">
                  <v-icon>mdi-list-status</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label"> Belum Tertanam</p>
                    <p class="mb-0 value">{{ bibits.planted }}</p>
                  </div>
                </div>
              </div> -->
              <!-- </div> -->
            </template>



            <template v-slot:item.index="{ index }">
              <div class="ml-2">
                {{ index + 1 }}

              </div>
            </template>
            <template v-slot:item.planted="{ item }">
              <div class="ml-2">
                <v-card
                  color="blue pa-5 rounded-xl text-center white--text"
                >
                  <v-icon color="white" x-large>mdi-sprout</v-icon>
                  {{ item.planted }}
                </v-card>
              </div>
            </template>
            <template v-slot:item.unplanted="{ item }">
              <div class="ml-2">
                <v-card
                  color="orange pa-5 rounded-xl text-center white--text"
                >
                  <v-icon color="white" x-large>mdi-alert</v-icon>
                  {{ item.unplanted }}
                </v-card>
              </div>
            </template>
            <template v-slot:item.alive="{ item }">
              <div class="ml-2">
                <v-card
                  color="green pa-5 rounded-xl text-center white--text"
                >
                  <v-icon color="white" x-large>mdi-check-bold</v-icon>
                  {{ item.alive }}
                </v-card>
              </div>
            </template>
            <template v-slot:item.die="{ item }">
              <div class="ml-2">
                <v-card
                  color="red pa-5 rounded-xl text-center white--text"
                >
                  <v-icon color="white" x-large>mdi-close-box</v-icon>
                  {{ item.die }}
                </v-card>
              </div>
            </template>
            <template v-slot:item.gone="{ item }">
              <div class="ml-2">
                <v-card
                  color="red pa-5 rounded-xl text-center white--text"
                >
                  <v-icon color="white" x-large>mdi-magnify-close</v-icon>
                  {{ item.gone }}
                </v-card>
              </div>
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
          key: 'planted',
          value: 'planted',
        },
        {
          text: 'Belum Ditanam',
          key: 'unplanted',
          value: 'unplanted',
        },
        {
          text: 'Hidup',
          key: 'alive',
          value: 'alive',
        },
        {
          text: 'Foto Hidup',
          key: 'life_photo',
          value: 'life_photo',
        },
        {
          text: 'Mati',
          key: 'die',
          value: 'die',
        },
        {
          text: 'Foto Mati',
          key: 'death_photo',
          value: 'death_photo',
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