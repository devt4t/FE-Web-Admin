<template>
  <div>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
          <v-data-table :headers="headerBibits" :items="bibits" :search="''" class="rounded-xl elevation-1 "
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
          </v-data-table>
        </v-card>
      </v-col>
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
    this.getBibits()
  },
  methods: {
    getBibits() {
      this.$_api.get('first-monitorings/main/detail-seed', {
        id: this.data.result.id
      }).then(res => {
        this.bibits = res.data
      })
    },
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
      bibits: [],
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
          text: 'Kode Bibit',
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