<template>
  <div>
    <v-row>
      <v-col>A
      </v-col>
      <v-col>
        <div ref="mapContainer" id="mapContainer" class="map-container" style="width: 100%; height: 600px;"></div>
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
                mapLatitude = this.data.response.lands_coordinates.latitude
                mapLongitude = this.data.response.lands_coordinates.longitude

            }
            catch { }
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