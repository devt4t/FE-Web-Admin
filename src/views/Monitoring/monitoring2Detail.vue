<template>
  <div>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-1">
          <v-data-table :headers="headerBibits" :items="data.result.monitoring_tree_detail" :search="''" class="rounded-xl elevation- pa-1 px-5"
            :footer-props="{
              showCurrentPage: false,
              showFirstLastPage: false,
            }">
            
            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                  <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Detail Pohon
                  </h4>
                  </div>
                  <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                  </div>
              </div>
            </template>

            <template v-slot:item.index="{ index }">
              <div class="ml-2">
                {{ index + 1 }}

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
              <h4>Titik Koordinat Monitoring</h4>
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
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">

            <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Foto Dokumentasi Monitoring</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
            </div>
            </div>

            <div class="absent-photo-list d-flex flex-row" v-if="true">
                <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/' + data.result.photo1 ?? '')"
                    v-bind:style="{
                    backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/' +
                        data.result.photo1 ?? '' +
                        ')',
                    }">
                    <h6>Foto Dokumentasi 1</h6>
                </div>
                <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/' + data.result.photo2 ?? '')"
                    v-bind:style="{
                    backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/' +
                        data.result.photo2 ?? '' +
                        ')',
                    }">
                    <h6>Foto Dokumentasi 2</h6>
                </div>
            </div>
            <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Foto Akumulasi Pohon Monitoring</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
            </div>
            </div>

            <div class="absent-photo-list d-flex flex-row" v-if="true">
                <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/' + data.result.tree_detail_acumulation[0].photo_dead ?? '')"
                    v-bind:style="{
                    backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/' +
                        data.result.tree_detail_acumulation[0].photo_dead ?? '' +
                        ')',
                    }">
                    <h6>Foto Pohon Mati</h6>
                </div>
                <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/' + data.result.tree_detail_acumulation[0].photo_life ?? '')"
                    v-bind:style="{
                    backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/' +
                        data.result.tree_detail_acumulation[0].photo_life ?? '' +
                        ')',
                    }">
                    <h6>Foto Pohon Hidup</h6>
                </div>
            </div>  
        </v-card>
          
      </v-col>
    </v-row>

  </div>

</template>

<script>

export default {
  name: "monitoring-detail",
  props: {
    data: {
      required: true,
      default: [],
    },
  },
  mounted() {
    this.initializeMap()
    // this.getBibits()
  },
  methods: {
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
          text: 'Kode Monitoring',
          key: 'monitoring2_no',
          value: 'monitoring2_no',
        },
        {
          text: 'Kode Pohon',
          key: 'tree_no',
          value: 'tree_no',
        },
        {
          text: 'Nama Pohon',
          key: 'tree_name',
          value: 'tree_name',
        },
        {
          text: 'Nama Petani',
          key: 'farmer_name',
          value: 'tree_name',
        },
        {
          text: 'Kondisi Sekitar Pohon',
          key: 'tree_condition',
          value: 'tree_condition',
        },
        {
          text: 'Tinggi (cm)',
          key: 'height',
          value: 'height',
        },
        {
          text: 'Diameter (cm)',
          key: 'diameter',
          value: 'diameter',
        },
        {
          text: 'Pupuk/Pestisida',
          key: 'pest',
          value: 'pest',
        },
        {
          text: 'Deskripsi Pupuk/Pestisida',
          key: 'pest_description',
          value: 'pest_description',
        },
      ],
    }
  }
}
</script>