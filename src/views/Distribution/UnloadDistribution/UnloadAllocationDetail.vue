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
                        <h4>Detail Alokasi Transport</h4>
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
      </v-row>
    </div>
  
  </template>
  
  <script>
  import DetailUnloadField from "./unloadDetailField";
  
  export default {
    name: "unload-allocation-detail",
    props: {
      data: {
        required: true,
        default: [],
      },
    },
    methods: {
    },
    data() {
      return {
        configAllocationTransportDetail: {
        table: {
          header: DetailUnloadField
        }
      },
      }
    }
  }
  </script>