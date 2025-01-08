This Is Base Model For Planting Hole Survielliance Details
<template>
    <div>
      <v-row>
        <v-col>
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
                <v-data-table :headers="tree_detail_accumulation_field.table.header" :items="data.result.tree_detail_acumulation"
                    :search="''" class="rounded-xl elevation- pa-1 px-5">

                    <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                    </template>

                    <template v-slot:top>
                    <div class="list-header py-3 mt-1">
                        <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                        <h4>Detail Monitoring Akumulasi 2</h4>
                        </div>
                        <div class="d-flex flex-row geko-list-header-action">
                        <div class="geko-list-header-toolbar"></div>
                        </div>
                    </div>
                    

                    <!-- <div class="statistics mb-3">
                        <div class="statistic-item light">
                        <v-icon>mdi-list-status</v-icon>
                        <div class="statistic-data">
                            <p class="mb-0 label">Total Data Bibit</p>
                            <p class="mb-0 value">{{ data.result.detailData.length ?? '' }}</p>
                        </div>
                        </div>
                    </div> -->
                    </template>

                    <template v-slot:item.photo_life="{ item }">
                      <div class="d-flex flex-row lahan-photo" style="max-width: 100px">
                        <v-img
                          v-if="item.photo_life"
                          :src="$_config.baseUrlUpload + '/' + item.photo_life"
                          alt="Foto Pohon Hidup"
                          :width="100"
                          @click="showLightbox($_config.baseUrlUpload + '/' + item.photo_life)"
                          class="second-monitoring-img"
                        >
                          <template v-slot:placeholder>
                            <div class="second-monitoring-placeholder">
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
        <!-- <v-col>
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">

                <div class="list-header py-3 mt-1">
                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                    <h4>Tanda Tangan Petani</h4>
                </div>
                <div class="d-flex flex-row geko-list-header-action">
                    <div class="geko-list-header-toolbar"></div>
                </div>
                </div>

                <div class="absent-photo-list d-flex flex-row" v-if="true">
                    <div class="absent-photo-item"
                        @click="showLightbox($_config.baseUrlUpload + '/' + data.result.farmer_signature ?? '')"
                        v-bind:style="{
                        backgroundImage:
                            'url(' +
                            $_config.baseUrlUpload +
                            '/' +
                            data.result.farmer_signature ?? '' +
                            ')',
                        }">
                        <h6>Foto Tandatangan Petani</h6>
                    </div>
                </div>

            </v-card>
          <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">
  
            <div class="list-header py-3 mt-1">
              <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Dokumentasi</h4>
              </div>
              <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
              </div>
            </div>
  
            <div class="absent-photo-list d-flex flex-row" v-if="true">
              <div class="absent-photo-item"
                @click="showLightbox($_config.baseUrlUpload + '/' + data.result.gambar1 ?? '')"
                v-bind:style="{
                  backgroundImage:
                    'url(' +
                    $_config.baseUrlUpload +
                    '/' +
                    data.result.gambar1 ?? '' +
                    ')',
                }">
                <h6>Foto Dokumentasi 1</h6>
              </div>
            </div>
            <div class="absent-photo-list d-flex flex-row" v-if="true">
              <div class="absent-photo-item"
                @click="showLightbox($_config.baseUrlUpload + '/' + data.result.gambar2 ?? '')"
                v-bind:style="{
                  backgroundImage:
                    'url(' +
                    $_config.baseUrlUpload +
                    '/' +
                    data.result.gambar2 ?? '' +
                    ')',
                }">
                <h6>Foto Dokumentasi 2</h6>
              </div>
            </div>
  
          </v-card>
          
        </v-col> -->
      </v-row>
    </div>
  
  </template>
  
  <script>
  
  export default {
    name: "penilikan-lubang-detail",
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
    data() {
      return {
        tree_detail_accumulation_field: {
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
              key: "life",
              sortable: false,
              text: "Jumlah Hidup Sebelum Monitoring",
              value: "life",
            },
            {
              key: "life_after",
              sortable: false,
              text: "Jumlah Hidup Setelah Monitoring",
              value: "life_after",
            },
            {
              key: "photo_life",
              sortable: false,
              text: "Foto Tanaman Hidup",
              value: "photo_life",
            }
            
          ]
        }
      },
        
      }
    },
  }
  </script>

<style>
  .second-monitoring-img {
    width: 100px;
    height: auto;
    margin-right: 5px;
    border-radius: 8px;
    position: relative;
    bottom: 0;
    box-shadow: rgba(100, 100, 111, 0) 0px 7px 29px 0px;
    transition: all 0.2s ease;
  }

  .second-monitoring-img:hover {
    cursor: pointer;
    bottom: 5px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    transition: all 0.2s ease;
  }

  .second-monitoring-placeholder {
    width: 100px;
    height: 100%;
    background-color: rgba(128, 128, 128, 0.05);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .text-gray {
    color: gray;
  }
</style>