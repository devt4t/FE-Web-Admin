<!-- This Is Base Model For Planting Hole Survielliance Details -->
<template>
    <div>
      <v-row>
        <v-col>
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
                <v-data-table :headers="configMonitoringDetail.table.header" :items="data.list_detail"
                    :search="''" class="rounded-xl elevation- pa-1 px-5">

                    <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                    </template>

                    <template v-slot:top>
                    <div class="list-header py-3 mt-1">
                        <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                        <h4>Detail Pohon Monitoring Lahan Umum</h4>
                        </div>
                        <div class="d-flex flex-row geko-list-header-action">
                        <div class="geko-list-header-toolbar"></div>
                        </div>
                    </div>

                    <!-- <div class="statistics mb-3">
                        <div class="statistic-item light">
                        <v-icon>mdi-list-status</v-icon>
                        <div class="statistic-data">
                            <p class="mb-0 label">Total Data Pohon Lahan Umum</p>
                            <p class="mb-0 value">{{ data.result.detail_seed.length ?? '' }}</p>
                        </div>
                        </div>
                    </div> -->
                    </template>

                </v-data-table>
            </v-card>
        </v-col>
        <v-col>
          <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">
  
                <div class="list-header py-3 mt-1">
                    <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                    <h4>Dokumentasi Penilikan Tanam Lahan Umum</h4>
                    </div>
                    <div class="d-flex flex-row geko-list-header-action">
                    <div class="geko-list-header-toolbar"></div>
                    </div>
                </div>

                <div class="absent-photo-list d-flex flex-row" v-if="true">
                    <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/general-lands/first-monitorings' + monitoring.data.gambar1 ?? '')"
                    v-bind:style="{
                        backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/general-lands/first-monitorings' +
                        monitoring.data.gambar1 ?? '' +
                        ')',
                    }">
                    <h6>Foto Realisasi Tanam</h6>
                    </div>
                </div>
                <div class="absent-photo-list d-flex flex-row" v-if="true">
                    <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/general-lands/first-monitorings' + monitoring.data.gambar2 ?? '')"
                    v-bind:style="{
                        backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/general-lands/first-monitorings' +
                        monitoring.data.gambar2 ?? '' +
                        ')',
                    }">
                    <h6>Foto Realisasi Tanam</h6>
                    </div>
                </div>
                
                <div class="absent-photo-list d-flex flex-row" v-if="true">
                    <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/general-lands/first-monitorings' + monitoring.data.gambar3 ?? '')"
                    v-bind:style="{
                        backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/general-lands/first-monitorings' +
                        monitoring.data.gambar3 ?? '' +
                        ')',
                    }">
                    <h6>Foto Realisasi Tanam</h6>
                    </div>
                </div>
            

            </v-card>
          
        </v-col>
      </v-row>
    </div>
  
  </template>
  
  <script>

  
  
  export default {
    name: "lahan-umum-monitoring-detail",
    components:{
    },
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
    },
    async mounted(){
      const result = await this.$_api.get("general-land/first-monitriong/detail", {
        monitoring_no: this.$route.query.monitoring_no,
      });
      this.monitoring = result;
      console.log('get data')
    },
    data() {
      return {
        configMonitoringDetail: {
            table: {
                header: [
                    {
                    key: "index",
                    sortable: false,
                    text: "No",
                    value: "index",
                    },
                    {
                    key: "tree_name",
                    sortable: false,
                    text: "Nama Pohon",
                    value: "tree_name",
                    },
                    {
                    key: "amount",
                    sortable: false,
                    text: "Jumlah",
                    value: "amount",
                    },
                    // {
                    //   key: "lahan_umum_pic_lahan_nama",
                    //   sortable: false,
                    //   text: "Nama PIC Per-Bibit",
                    //   value: "lahan_umum_pic_lahan_nama",
                    // }
                ]
            }
        },
        monitoring: {},
      }
    }
  }
  </script>