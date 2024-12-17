<!-- This Is Base Model For Planting Hole Survielliance Details -->
<template>
    <div>
      <v-row>
        <v-col>
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
                <v-data-table :headers="configAllocationTransportDetail.table.header" :items="data.result.detail_allocation_transportation"
                    :search="''" class="rounded-xl elevation- pa-1 px-5">

                    <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                    </template>

                    <template v-slot:top>
                    <div class="list-header py-3 mt-1">
                        <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                        <h4>Detail Armada Distribusi</h4>
                        </div>
                        <div class="d-flex flex-row geko-list-header-action">
                        <div class="geko-list-header-toolbar"></div>
                        </div>
                    </div>

                    <div class="statistics mb-3">
                        <div class="statistic-item light">
                        <v-icon>mdi-list-status</v-icon>
                        <div class="statistic-data">
                            <p class="mb-0 label">Total Data Alokasi Transport</p>
                            <p class="mb-0 value">{{ data.result.detail_allocation_transportation.length ?? '' }}</p>

                        </div>
                        </div>
                    </div>
                    </template>

                </v-data-table>
            </v-card>
          
        </v-col>
        <v-col v-if="false">
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">

                <div class="list-header py-3 mt-1">
                  <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                      <h4>Dokumentasi Distribusi</h4>
                  </div>
                  <div class="d-flex flex-row geko-list-header-action">
                      <div class="geko-list-header-toolbar"></div>
                  </div>
                </div>

                <div class="absent-photo-list d-flex flex-row" v-if="true">
                    <div class="absent-photo-item"
                        @click="showLightbox(data.result.img_photo_created_by.url ?? '/images/noimage.png')"
                        v-bind:style="{
                        backgroundImage:
                            'url(' +
                            data.result.img_photo_created_by.thumbnail_url ?? '/images/noimage.png' +
                            ')',
                        }">
                        <h6>Foto Dokumentasi Distribusi</h6>
                    </div>
                </div>

            </v-card>
        </v-col>
      </v-row>

      <!-- detail farmer -->
      <v-row>
        <v-col>
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
                <v-data-table 
                  :headers="configAllocationFarmerDetail.table.header" 
                  :items="data.result.detail_farmers"
                  :search="''" 
                  class="rounded-xl elevation- pa-1 px-5"
                  :single-expand="true"
                  :item-key="data.result.detail_farmers.id"
                  show-expand
                  >

                    <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                    </template>

                    <template v-slot:top>
                    <div class="list-header py-3 mt-1">
                        <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                        <h4>Detail BAST per-Petani</h4>
                        </div>
                        <div class="d-flex flex-row geko-list-header-action">
                        <div class="geko-list-header-toolbar"></div>
                        </div>
                    </div>

                    <div class="statistics mb-3">
                        <div class="statistic-item light">
                          <v-icon>mdi-list-status</v-icon>
                          <div class="statistic-data">
                              <p class="mb-0 label">Total Data Alokasi Petani</p>
                              <p class="mb-0 value">{{ data.result.detail_farmers.length ?? 0 }}</p>

                          </div>
                        </div>
                        <div class="statistic-item info">
                          <v-icon>mdi-truck-plus</v-icon>
                          <div class="statistic-data">
                              <p class="mb-0 label">Total Bibit Dimuat</p>
                              <p class="mb-0 value">{{ data.result.ff_seed_loaded ?? 0 }}</p>

                          </div>
                        </div>
                        <div class="statistic-item warning">
                          <v-icon>mdi-image-broken-variant</v-icon>
                          <div class="statistic-data">
                              <p class="mb-0 label">Total Bibit Rusak</p>
                              <p class="mb-0 value">{{ data.result.ff_seed_broken ?? 0 }}</p>

                          </div>
                        </div>
                        <div class="statistic-item danger">
                          <v-icon>mdi-help-rhombus-outline</v-icon>
                          <div class="statistic-data">
                              <p class="mb-0 label">Total Bibit Hilang</p>
                              <p class="mb-0 value">{{ data.result.ff_seed_missing ?? 0 }}</p>

                          </div>
                        </div>
                        <div class="statistic-item success">
                          <v-icon>mdi-check-bold</v-icon>
                          <div class="statistic-data">
                              <p class="mb-0 label">Total Bibit Terdistribusi</p>
                              <p class="mb-0 value">{{ data.result.ff_seed_received ?? 0 }}</p>

                          </div>
                        </div>
                    </div>
                    </template>
                    <template v-slot:item.total_pupuk="{ item }">
                      <p v-if="item.is_pupuk_load == 0" >0</p>
                      <p v-else>{{item.total_pupuk}}</p>
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length">
                        <div class="list-header py-3 mt-1">
                          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                              <h4>Detail Label Petani {{ item.farmer_name }}</h4>
                          </div>
                          <div class="d-flex flex-row geko-list-header-action">
                              <div class="geko-list-header-toolbar"></div>
                          </div>
                        </div>
                        <h3>  </h3>
                        <!-- detail lable -->
                        <tr>
                          <!-- total label -->
                           <td>

                           </td>
                          <td>
                            <v-card color="#26c6da" max-width="575" class="geko-base-detail-card mb-5 px-1">
                              <v-data-table :headers="configLablePrintedDetail.table.header" :items-per-page="3" :items="item.printed_lable"
                                      :search="''" class="rounded-xl elevation- pa-1 px-5">

                                      <template v-slot:item.index="{ index }">
                                      {{ index + 1 }}
                                      </template>

                                      <template v-slot:top>
                                      <div class="list-header py-3 mt-1">
                                          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                          <h4>Label Tercetak</h4>
                                          </div>
                                          <div class="d-flex flex-row geko-list-header-action">
                                          <div class="geko-list-header-toolbar"></div>
                                          </div>
                                      </div>

                                      <div class="statistics mb-3">
                                          <div class="statistic-item light">
                                            <v-icon>mdi-list-status</v-icon>
                                            <div class="statistic-data">
                                                <p class="mb-0 label">Total Label</p>
                                                <p class="mb-0 value">{{ item.printed_lable.length ?? '' }}</p>

                                            </div>
                                          </div>
                                      </div>
                                      </template>

                                  </v-data-table>
                            </v-card>
                          </td>
                          <!-- total loaded -->
                          <td>
                            <v-card color="#f0a42b" max-width="575" class="geko-base-detail-card mb-5 px-1">
                              <v-data-table :headers="configLableLoadedDetail.table.header" :items-per-page="3" :items="item.loaded_lable"
                                      :search="''" class="rounded-xl elevation- pa-1 px-5">

                                      <template v-slot:item.index="{ index }">
                                      {{ index + 1 }}
                                      </template>

                                      <template v-slot:top>
                                      <div class="list-header py-3 mt-1">
                                          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                          <h4>Label Loaded</h4>
                                          </div>
                                          <div class="d-flex flex-row geko-list-header-action">
                                          <div class="geko-list-header-toolbar"></div>
                                          </div>
                                      </div>

                                      <div class="statistics mb-3">
                                          <div class="statistic-item light">
                                          <v-icon>mdi-list-status</v-icon>
                                          <div class="statistic-data">
                                              <p class="mb-0 label">Total Label Loaded</p>
                                              <p class="mb-0 value">{{ item.loaded_lable.length ?? '' }}</p>

                                          </div>
                                          </div>
                                      </div>
                                      </template>

                                  </v-data-table>
                            </v-card>
                          </td>
                        </tr>
                        <tr>
                          <!-- total distributed -->
                          <td>
                            
                          </td>
                          <td>
                            <v-card color="#1cd104" max-width="575" class="geko-base-detail-card mb-5 px-1">
                              <v-data-table :headers="configLableDistributedDetail.table.header" :items-per-page="3" :items="item.distributed_lable"
                                      :search="''" class="rounded-xl elevation- pa-1 px-5">

                                      <template v-slot:item.index="{ index }">
                                      {{ index + 1 }}
                                      </template>

                                      <template v-slot:top>
                                      <div class="list-header py-3 mt-1">
                                          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                          <h4>Label Terdistribusi</h4>
                                          </div>
                                          <div class="d-flex flex-row geko-list-header-action">
                                          <div class="geko-list-header-toolbar"></div>
                                          </div>
                                      </div>

                                      <div class="statistics mb-3">
                                          <div class="statistic-item light">
                                          <v-icon>mdi-list-status</v-icon>
                                          <div class="statistic-data">
                                              <p class="mb-0 label">Total Label Terdistribusi</p>
                                              <p class="mb-0 value">{{ item.distributed_lable.length ?? '' }}</p>

                                          </div>
                                          </div>
                                      </div>
                                      </template>

                                  </v-data-table>
                            </v-card>
                          </td>
                          <!-- total missing -->
                          <td>
                            <v-card color="#e81313" max-width="575" class="geko-base-detail-card mb-5 px-1">
                              <v-data-table :headers="configLableMissingDetail.table.header" :items-per-page="3" :items="item.missing_lable"
                                      :search="''" class="rounded-xl elevation- pa-1 px-5">

                                      <template v-slot:item.index="{ index }">
                                      {{ index + 1 }}
                                      </template>

                                      <template v-slot:top>
                                      <div class="list-header py-3 mt-1">
                                          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                          <h4>Label Hilang</h4>
                                          </div>
                                          <div class="d-flex flex-row geko-list-header-action">
                                          <div class="geko-list-header-toolbar"></div>
                                          </div>
                                      </div>

                                      <div class="statistics mb-3">
                                          <div class="statistic-item light">
                                          <v-icon>mdi-list-status</v-icon>
                                          <div class="statistic-data">
                                              <p class="mb-0 label">Total Label Hilang</p>
                                              <p class="mb-0 value">{{ item.missing_lable.length ?? '' }}</p>

                                          </div>
                                          </div>
                                      </div>
                                      </template>

                                  </v-data-table>
                            </v-card>
                          </td>
                        </tr>
                        <tr>
                          <td>

                          </td>
                          <td>
                            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">

                                <div class="list-header py-3 mt-1">
                                  <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                      <h4>Foto Penerimaan Petani</h4>
                                  </div>
                                  <div class="d-flex flex-row geko-list-header-action">
                                      <div class="geko-list-header-toolbar"></div>
                                  </div>
                                </div>

                                <div class="absent-photo-list d-flex flex-row" v-if="item.file_accept != null">
                                    <div class="absent-photo-item"
                                        @click="showLightbox(item.file_accept.url ?? '/images/noimage.png')"
                                        v-bind:style="{
                                        backgroundImage:
                                            'url(' +
                                            item.file_accept.url ?? '/images/noimage.png' +
                                            ')',
                                        }">
                                        <h6>Foto Dokumentasi Distribusi</h6>
                                    </div>
                                </div>

                            </v-card>
                          </td>
                          <td>
                            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">

                                <div class="list-header py-3 mt-1">
                                  <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                      <h4>Tanda Tangan Petani</h4>
                                  </div>
                                  <div class="d-flex flex-row geko-list-header-action">
                                      <div class="geko-list-header-toolbar"></div>
                                  </div>
                                </div>

                                <div class="absent-photo-list d-flex flex-row" v-if="item.file_signature != null">
                                    <div class="absent-photo-item"
                                        @click="showLightbox(item.file_signature.url ?? '/images/noimage.png')"
                                        v-bind:style="{
                                        backgroundImage:
                                            'url(' +
                                            item.file_signature.url ?? '/images/noimage.png' +
                                            ')',
                                        }">
                                        <h6>Tanda Tangan Petani</h6>
                                    </div>
                                </div>

                            </v-card>
                          </td>
                        </tr>
                      </td>
                    
                    </template>

                </v-data-table>
            </v-card>
          
        </v-col>
      </v-row>

      
    </div>
  
  </template>
  
  <script>
  import DetailUnloadAllocationTransportField from "./unloadDetailField";
  import DetailUnloadAllocationFarmersField from "./unloadDetailFarmerFields";
  import DetailLablePrinted from "./DetailLable/totalLableField";
  import DetailLableLoaded from "./DetailLable/totalLableLoaded";
  import DetailLableDistributed from "./DetailLable/totalLableDistributed";
  import DetailLableMissing from "./DetailLable/totalLableMissing";

  
  export default {
    name: "unload-allocation-detail",
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
        configAllocationTransportDetail: {
          table: {
            header: DetailUnloadAllocationTransportField
          }
        },
        configAllocationFarmerDetail: {
          table: {
            header: DetailUnloadAllocationFarmersField
          }

        },
        configLablePrintedDetail: {
          table: {
            header: DetailLablePrinted
          }
        },
        configLableLoadedDetail: {
          table: {
            header: DetailLableLoaded
          }
        },
        configLableDistributedDetail: {
          table: {
            header: DetailLableDistributed
          }
        },
        configLableMissingDetail: {
          table: {
            header: DetailLableMissing
          }
        },
      }
    },
  }
  </script>