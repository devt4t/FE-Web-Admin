<template>
  <div>
    <v-row>
      <!-- <v-col>A
      </v-col> -->
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
            <div ref="mapContainer" id="mapContainer" class="map-container" style="width: 100%; height: 600px; border-radius: 10px;"></div>
          </div>


        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>

export default {
  name: "pelatihan-petani-detail",
  props: {
    data: {
      required: true,
      default: [],
    },
  },
  mounted() {
    this.initializeMap()
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
      configKehadiranPetani: {
        table: {
          header: [
            {
              key: "index",
              sortable: false,
              text: "No",
              value: "index",
            },
            {
              key: "farmer_no",
              sortable: false,
              text: "No. Petani",
              value: "farmer_no",
            },
            {
              key: "nickname",
              sortable: false,
              text: "Nama Panggilan",
              value: "nickname",
            },
            {
              key: "farmer_name",
              sortable: false,
              text: "Nama",
              value: "farmer_name",
            },
            {
              key: "ff_name",
              sortable: false,
              text: "Nama FF",
              value: "ff_name",
            },
          ],
        }
      },
      configKontribusiFF: {
        table: {
          header: [
            {
              key: "index",
              sortable: false,
              text: "No",
              value: "index",
            },
            {
              key: "ff_additional",
              sortable: false,
              text: "No. FF",
              value: "ff_additional",
            },
            {
              key: "name",
              sortable: false,
              text: "Nama",
              value: "name",
            },
          ]
        }
      },
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
      },
      configPesertaUmum: {
        table: {
          header: [
            {
              key: "index",
              sortable: false,
              text: "No",
              value: "index",
            },
            {
              key: "name",
              sortable: false,
              text: "Nama",
              value: "name",
            },
            {
              key: "address",
              sortable: false,
              text: "Alamat",
              value: "address",
            },
            {
              key: "phone",
              sortable: false,
              text: "Kontak",
              value: "phone",
            },
            {
              key: "gender",
              sortable: false,
              text: "Jenis Kelamin",
              value: "gender",
            },
          ]
        }
      }
    }
  }
}
</script>