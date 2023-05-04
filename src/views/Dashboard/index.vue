<template>
  <v-container class="mt-5 pl-3 pl-lg-6" fluid>
    <!-- Greetings -->
    <div data-aos="fade-down">
      <v-card  rounded="xl" :dark="$store.state.theme == 'dark'">
        <v-card-text>
          <v-row style="margin-top: -15px" class="flex-column-reverse flex-lg-row">
            <v-col cols="12" md="12" lg="9">
              <v-card class="transparent elevation-0">
                <v-card-title class="fontall" v-if="time.isMorning()">
                  Good Morning, {{ User.name || '-' }}
                </v-card-title>
                <v-card-title class="fontall" v-else>
                  Good Afternoon, {{ User.name || '-' }}
                </v-card-title>
                <v-card-subtitle>
                  it's
                  <span v-if="time.date">
                    {{ time.date || '-' }}
                  </span>
                  <v-progress-circular v-else
                      indeterminate
                      color="white"
                      size="15"
                  ></v-progress-circular>
                </v-card-subtitle>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="d-flex flex-column flex-lg-row align-items-center justify-content-center">
                      <v-select
                        dense
                        color="success"
                        item-color="success"
                        :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition', dark: $store.state.theme == 'dark'}"
                        hide-details
                        rounded
                        v-model="options.programYear"
                        :disabled="loading"
                        :items="$store.state.programYear.options"
                        label="Program Year"
                        :rules="[(v) => !!v || 'Field is required']"
                        outlined
                        class="mt-2 mr-1"
                        style="max-width: 175px;"
                        @change="initialize"
                      ></v-select>
                      <v-autocomplete
                        dense
                        color="success"
                        item-color="success"
                        :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition', dark: $store.state.theme == 'dark'}"
                        hide-details
                        rounded
                        v-model="options.source.model"
                        :items="options.source.options"
                        :disabled="loading"
                        label="Source Data"
                        :rules="[(v) => !!v || 'Field is required']"
                        outlined
                        class="mt-2 mx-1"
                        @change="initialize"
                        style="max-width: 250px;"
                      ></v-autocomplete>
                      <v-autocomplete
                        v-if="options.province.show"
                        dense
                        color="success"
                        item-color="success"
                        :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition', dark: $store.state.theme == 'dark'}"
                        hide-details
                        rounded
                        v-model="options.province.model"
                        :items="options.province.options"
                        :disabled="loading"
                        label="Province"
                        :rules="[(v) => !!v || 'Field is required']"
                        outlined
                        class="mt-2 ml-1"
                        @change="initialize"
                        style="max-width: 250px;"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="3" class="pa-0">
              <v-img
                max-width="170px"
                :src="require('@/assets/female-investors.gif')"
              ></v-img>
              
              <!-- <LottieAnimation
                ref="anim"
                :animationData="lottie.planting"
                :loop="true"
                :key="lottie.key"
                style="height: 175px;padding: 0px;"
              /> -->
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
    <!-- Manual Books -->
    <v-card class="mt-2 rounded-xl" dark data-aos="fade-down" data-aos-delay="350">
      <v-card-text class="">
        <v-row class="mx-0 align-center">
          <p class="mb-0"><v-icon>mdi-book</v-icon> Manual Book</p>
          <v-divider class="mx-2"></v-divider>
          <!-- <v-tooltip left content-class="rounded-xl">
            <template v-slot:activator="{on, attrs}">
              <v-btn v-bind="attrs" v-on="on" rounded color="green white--text" class="my-2 mr-2" small @click="() => {$router.push('GekoManual')}"><v-icon class="mr-1">mdi-book-open-variant</v-icon> Open</v-btn>
            </template>
            Click to open the manual book in new page
          </v-tooltip> -->
          <v-tooltip left content-class="rounded-xl">
            <template v-slot:activator="{on, attrs}">
              <v-btn v-bind="attrs" v-on="on" rounded color="blue white--text" class="my-2" small @click="() => downloadManualBook()"><v-icon class="mr-1">mdi-download</v-icon> Download</v-btn>
            </template>
            Click to download the manual book
          </v-tooltip>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Total Datas -->
    <v-row class="mt-0">
      <v-col v-for="n in 4" cols="12" md="3" class="">
        <v-card
          data-aos="fade-down"
          :data-aos-delay="totalData[`data${n}`].dataAosDelay + 700"
          class="rounded-xl shadow-lg"
          @click="$router.push(totalData[`data${n}`].link)"
        >
          <v-list-item three-line>
            <v-list-item-content class="px-3">
              <div class="mb-2">
                {{ totalData[`data${n}`].Judul }}
              </div>
              <v-list-item-title class="text-h5 mb-1 font-weight-bold">
                <number
                  v-if="loading == false"
                  :ref="totalData[`data${n}`].ref"
                  :key="totalData[`data${n}`].key"
                  :format="numberFormat"
                  :from="0"
                  :to="totalData[`data${n}`].Count"
                  :duration="5"
                  :delay="0"
                  easing="Power2.easeInOut"/>
                <v-progress-circular v-else
                    indeterminate
                    :color="totalData[`data${n}`].color"
                    size="27"
                ></v-progress-circular>
              </v-list-item-title>
              <v-list-item-subtitle>{{ totalData[`data${n}`].sub }}</v-list-item-subtitle>
            </v-list-item-content>
  
            <v-list-item-avatar
              data-aos="zoom-in"
              data-aos-delay="800"
              tile
              size="80"
              :color="totalData[`data${n}`].color"
              class="rounded-circle"
            >
              
            <v-icon style="font-size: 35px !important" color="white">
              {{ totalData[`data${n}`].icon }}
            </v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- Maps -->
    <DMap :options="options" data-aos="fade-up" data-aos-delay="1000" />

    <!-- Try Cam360 -->
    <v-card class="rounded-xl mt-3" data-aos="fade-up" >
      <v-card-title>
          <v-icon class="mr-1">mdi-panorama-variant</v-icon>
          <v-badge content="Develop" color="warning">360<sup>o</sup> View</v-badge>
          <v-divider class="mx-2"></v-divider>
          <small>
          </small>
      </v-card-title>
      <v-card-text>
        <div style="width: 100%;height: 400px;resize: vertical;overflow: hidden;min-height: 300px;max-height: 80vh;">
          <iframe class="ku-embed rounded-xl" style="width: 100%;height: 100%;" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no" src="https://kuula.co/share/NwzZH?logo=1&info=1&fs=1&vr=0&zoom=1&sd=1&initload=0&thumbs=1"></iframe>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import DMap from './components/maps'
import LottieAnimation from 'lottie-web-vue'
import plantingAnimation from '@/assets/lottie/planting.json'
import plant1 from '@/assets/lottie/plant-1.json'
import plant2 from '@/assets/lottie/plant-2.json'
import plant3 from '@/assets/lottie/plant-3.json'
import plant4 from '@/assets/lottie/plant-4.json'
import moneyTree from '@/assets/lottie/money-tree.json'

export default {
  name: "Dashboard",
  components: {
    DMap,
    LottieAnimation
  },
  data: () => ({
    loading: false,
    lottie: {
      planting: moneyTree,
      key: 1101
    },
    maps:{
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      listMarker: [],
      loading: {
        show: false,
        text: 'Loading...'
      }
    },
    options: {
      programYear: '2022',
      province: {
        disabled: false,
        show: true,
        model: 'all',
        options: [
          { 
            text: 'All',
            value: 'all'
          },
          { 
            text: 'Jawa Barat',
            value: 'JB'
          }, 
          { 
            text: 'Jawa Tengah',
            value: 'JT'
          }]
      },
      source: {
        model: 'Pendataan',
        options: ['Pendataan', 'Sosialisasi Tanam', 'Penilikan Lubang', 'Distribusi', 'Realisasi Tanam']
      },
    },
    time: {
      isMorning() {
        return new Date().getHours() < 12 ? true : false;
      },
      date: ''
    },
    totalData: {
      data1: {
        Judul: "Total FF",
        Count: "1",
        link: "FieldFacilitator",
        icon: 'mdi-account',
        color: 'blue',
        sub: 'Field Facilitator',
        ref: 'totalFFNumber',
        key: 123,
        dataAosDelay: 100
      },
      data2: {
        Judul: "Total Petani",
        Count: "1",
        link: "Farmer",
        icon: 'mdi-nature-people',
        color: 'orange',
        sub: 'Petani',
        ref: 'totalFarmerNumber',
        key: 321,
        dataAosDelay: 200
      },
      data3: {
        Judul: "Total Lahan",
        Count: "11",
        link: "Lahan",
        icon: 'mdi-land-fields',
        color: 'brown',
        sub: 'Lahan',
        ref: 'totalLahanNumber',
        key: 222,
        dataAosDelay: 300
      },
      data4: {
        Judul: "Total Pohon",
        Count: "111",
        link: "Dashboard",
        icon: 'mdi-forest',
        color: 'green',
        sub: 'Pohon',
        ref: 'totalPohonNumber',
        key: 111,
        dataAosDelay: 400
      },
    },
    User: {}
  }),
  async mounted() {
    this.User = this.$store.state.User
    this.options.programYear = this.$store.state.programYear.model
    // console.log(this.User)
    if (this.User.ff.ff.length > 0) this.options.province.show = false
    await this.initialize();
    // this.$store.state.maintenanceOverlay = true
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false
    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },
  computed: {
  },
  methods: {
    dateTimeNow() {
      setInterval(() => {
        this.time.date = new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
      }, 1000)
    },
    async initialize() {
      try {
        this.loading = true;
        this.dateTimeNow()
        this.$store.state.loadingOverlayText = 'Loading...'
        // this.$store.state.loadingOverlay = true
        this.$store.state.loadingOverlayText = `Getting datas from ${this.options.source.model}...`
        let params = new URLSearchParams({
          program_year: this.options.programYear,
          source: this.options.source.model,
          province: this.options.province.model
        })
        if (this.User.ff.ff) {
          params.set('ff', this.User.ff.ff.toString())
        }
        await this.setDashboardAnimation(this.options.source.model)
        const totalData = await axios.get(this.$store.getters.getApiUrl(`GekoDashboardAll?${params}`), this.$store.state.apiConfig).then(res => {return res.data.data.result})
        const tdEl = this.totalData
        tdEl.data1.Count = await totalData.total.ff
        tdEl.data2.Count = await totalData.total.farmer
        tdEl.data3.Count = await totalData.total.land_total
        tdEl.data4.Count = await totalData.total.trees
      } catch (error) {
        console.error(error);
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.dataobject = [];
        }
      } finally {
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
        this.loading = false
      }
    },
    numberFormat(num) {
        return new Intl.NumberFormat('id-ID', {
          maximumFractionDigits: 0
        }).format(num)
    },
    downloadManualBook() {
      const url = `https://trees4trees.sharepoint.com/:b:/g/EdnPK5LSmNVIvauAiE1qy5MBb5zC9UhWdUUFokVeI9FV2g?e=3wlCiA`
      window.open(url, '_blank')
    },
    // Utilities
    catchingError(error) {
        if (error.response) {
          if (typeof error.response.status != undefined) {
              if (error.response.status == 401) {
                  localStorage.removeItem("token")
                  this.$router.push("/")
              }
          }
        }
        console.log(error)
    },
    async setDashboardAnimation(source) {
      if (source == 'Penilikan Lubang') this.lottie.planting = await plant1;
      else this.lottie.planting = await moneyTree
      
      this.lottie.key += 1; 
    }
  },
};
</script>

