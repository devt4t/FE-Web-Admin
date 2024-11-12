<!-- This Is Base Model For Planting Hole Survielliance Details -->
<template>
    <div>
      <v-row>
        <v-col>
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
                <v-data-table :headers="configTaDesasDetail.table.header" :items="data.data.ta_desas_pivot"
                    :search="''" class="rounded-xl elevation- pa-1 px-5">

                    <template v-slot:item.index="{ index }">
                    {{ index + 1 }}
                    </template>
                    <template v-slot:item.active="{ item }">
                      <v-chip v-if="!item.active" :color="'red'" class="white--text">
                        <v-icon left
                        small>mdi-xamarin</v-icon>Tidak Aktif
                      </v-chip>
                      <v-chip v-else :color="'green darken-1'" class="white--text">
                        <v-icon left
                        small>mdi-check-bold</v-icon>Aktif
                      </v-chip>
                    </template>

                    <template v-slot:top>
                    <div class="list-header py-3 mt-1">
                        <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                        <h4>Data Pivot Desa</h4>
                        </div>
                        <div class="d-flex flex-row geko-list-header-action">
                        <div class="geko-list-header-toolbar"></div>
                        </div>
                    </div>

                    <div class="statistics mb-3">
                        <div class="statistic-item light">
                        <v-icon>mdi-list-status</v-icon>
                        <div class="statistic-data">
                            <p class="mb-0 label">Total Data Pivot Desa</p>
                            <p class="mb-0 value">{{ data.data.ta_desas_pivot.length ?? '' }}</p>
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
  
  export default {
    name: "village-detail",
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
        configTaDesasDetail: {
        table: {
          header: [
            {
              key: "index",
              sortable: false,
              text: "No",
              value: "index",
            },
            {
              key: "target_areas_name",
              sortable: false,
              text: "Target Area",
              value: "target_areas_name",
            },
            {
              key: "desas_name",
              sortable: false,
              text: "Desa",
              value: "desas_name",
            },
            {
              key: "program_year",
              sortable: false,
              text: "Tahun Program",
              value: "program_year",
            },
            {
              key: "active",
              sortable: false,
              text: "Status Aktif",
              value: "active",
            }
          ]
        }
      },
        
      }
    }
  }
  </script>