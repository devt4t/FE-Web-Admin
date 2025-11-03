<template>
    <v-dialog v-model="isOpen" width="70%">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>Perbarui Alamat Distribusi </v-card-title>
  
          <v-card-text class="ff-email-wrapper">
            <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <v-row class="assign-ff-wrapper" v-if="socData">
                  <v-col lg="6">
                    <v-row class="mx-3">
                      <v-col>
                        <geko-input
                          v-model="new_address"
                          :item="{
                            type: 'text',
                            label: 'Alamat Distribusi',
                            validation: ['required'],
                            
                          }"
                        />
                      </v-col>
                    </v-row>
                    <v-row class="mx-3">
                      <v-col md="12">
                          <geko-input v-model="latlng" :item="{
                              label: 'Titik Koordinat',
                              type: 'text',
                              placeholder: 'longitude, latitude'
                          }" />
                      </v-col>
                    </v-row>
                  </v-col>




                  <v-col lg="6">
                    <v-row class="mx-3 bg-grey">
                      <v-col>
    
                          <v-col md="12" class="form-separator ml-0 pl-0 ">
                              <h4>Koordinat Lokasi Distribusi</h4>
                          </v-col>
                          <span class="geko-input">
                              <div ref="mapContainer" id="mapContainer" class="map-container"
                                  style="width: 100%; height: 300px;"></div>
                          </span>
                      </v-col>
                    </v-row>
                  </v-col>

                </v-row>


                
  
                <v-row>
                  <v-col lg="12" class="d-flex flex-row justify-content-center">
                    <v-btn
                      variant="warning"
                      class="d-flex flex-row align-items-center"
                      type="submit"
                    >
                      <v-icon>mdi-pencil-outline</v-icon>
                      <span>Perbarui Alamat Distribusi</span>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row> </v-row>
              </form>
            </ValidationObserver>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: "soc-period-distribution-location",
    props: {
      data: {
        required: true,
        default: () => {},
      },
      dataKey: {
        required: true,
        default: 0,
        type: Number,
      },
    },
  
    methods: {
      onOpen() {
        this.$nextTick(() => {
          this.initializeMap();
        });
      },
      async initializeMap() {
        mapboxgl.accessToken = this.$_config.mapBoxApi;
        this.maps = await new mapboxgl.Map({
          container: "mapContainer",
          style: this.$_config.mapBoxStyle,
          zoom: 12,
          projection: "globe",
          maxZoom: 100,
          preserveDrawingBuffer: true,
          center: [110.41467292861057, -7.024947076120682],
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

        let coord = this.data.distribution_coordinates;
        coord = coord.split(' ');

        this.marker = new mapboxgl.Marker({ color: "red", anchor: "center" })
          .setLngLat([coord[1], coord[0]])
          .addTo(this.maps);
          
        await this.maps.flyTo({ 
          center: [coord[1],coord[0]], 
          zoom: 13 
        });

        this.maps.on("click", async (data) => { 
          this.marker.setLngLat(data.lngLat);
          this.$set(this,'latlng',data.lngLat.lat + " " + data.lngLat.lng)
          await this.maps.flyTo({ 
            center: [data.lngLat.lng,data.lngLat.lat], 
            zoom: 13 
          });
        });
      },
  
      onSubmit() {
        let payload = {
          ff_no: this.socData.ff_no,
          program_year: this.socData.program_year,
          new_address: this.new_address,
          latlng: this.latlng,
        };
        console.log(payload)
        this.$_api
        .post("new-sostam/add-on/update_distribution_address2", payload)
        .then(() => {
          this.$_alert.success("Berhasil Mengupdate Alamat Distribusi Sostam");
          this.isOpen = false;
          this.loading = false;
          this.$emit("success", true);
        })
        .catch(() => {
          this.loading = false;
          this.$emit('success');
        });
  
      },
      isValidCoordinate(lat, lng) {
        const numLat = parseFloat(lat);
        const numLng = parseFloat(lng);

        if (isNaN(numLat) || isNaN(numLng)) return false;
        if (numLat < -90 || numLat > 90) return false;
        if (numLng < -180 || numLng > 180) return false;

        return true;
      }
    },
  
    watch: {
      async dataKey(t) {


        if (t > 0) {
          this.isOpen = true;
          this.socData = this.data;

          this.new_address = this.socData.distribution_location
          this.latlng = this.socData.distribution_coordinates[0] != '-' ? this.socData.distribution_coordinates.split(' ').map(item => item.trim()).reverse().join(' ') : this.socData.distribution_coordinates;
          let val=this.latlng.split(' ');

          console.log({val})
          this.marker.setLngLat(val);
        }
      },
      isOpen(t) {
        console.log("open change", this.isOpen);
        if (t) {
          this.onOpen();
        } else {
          this.socData = null;
          this.loading = false;
          this.program_year = "";
          this.new_address = "";

        }
      },
      async latlng(val) {
      if (val.includes(' ')) {
        val=val.split(' ');

        console.log({fufu:!this.isValidCoordinate(val[0],val[1]), val})
        if (!this.isValidCoordinate(val[0],val[1])) return;
        
        this.marker.setLngLat({
          lng:val[1],lat:val[0]});
        await this.maps.flyTo({ 
          center: [val[1],val[0]], 
          zoom: 13 
        });
      }
    },
    },
    data() {
      return {
        isOpen: false,
        socData: null,
        loading: false,
        program_year: "",
        new_address: "",
        latlng: "",
        maps: null,
        marker: null
      };
    },
  };
  </script>
  