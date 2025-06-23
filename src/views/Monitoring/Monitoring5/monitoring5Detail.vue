<template>
  <div>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-1">
          <v-data-table :headers="headerBibits" :items="data.result.monitoring_tree_detail" :search="''" class="rounded-xl elevation- pa-1 px-5"
            :footer-props="{
              showCurrentPage: false,
              showFirstLastPage: false,
            }">
            
            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                  <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Detail Pohon
                  </h4>
                  </div>
                  <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                  </div>
              </div>
            </template>

            <template v-slot:item.index="{ index }">
              <div class="ml-2">
                {{ index + 1 }}

              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-1">
          <v-data-table :headers="DetailPerSeeds.header" :items="DetailPerSeeds.items" :search="''" class="rounded-xl elevation- pa-1 px-5"
            :footer-props="{
              showCurrentPage: false,
              showFirstLastPage: false,
            }">
            
            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                  <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Detail Pohon Per-Jenis
                  </h4>
                  </div>
                  <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                  </div>
              </div>
            </template>

            <template v-slot:item.index="{ index }">
              <div class="ml-2">
                {{ index + 1 }}

              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">
          <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
              <h4>Total Pohon Hidup Dari Monitoring Sebelumnya</h4>
            </div>
            
            <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar"></div>
            </div>
          </div>
          <div class="text-center mb-3">
            <v-progress-circular
              :rotate="360" :size="200" :width="20"
              :value="data.result.life_tree_percentage"
              :color="progressColorFormat(data.result.life_tree_percentage)"
            >
              <br>
                {{data.result.current_monitoring_total_trees}}/{{data.result.previous_monitoring_total_trees}}
              </br>
              <br>
                {{ data.result.life_tree_percentage.toFixed(1) }}%
              </br>
            </v-progress-circular>
          </div>
          <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
              <h4>Rata-rata Tinggi Dan Diameter Hasil Monitoring</h4>
            </div>
            
            <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar"></div>
            </div>
          </div>
          <div class="text-center mb-3">
            <br>
              <span v-on="on" class="badge bg-primary">
                <v-icon>mdi-arrow-up-bold</v-icon>Tinggi Rata-rata: {{ data.result.average_tree_length.toFixed(2) }}
              </span>
            </br>
            <br>
              <span v-on="on" class="badge bg-info">
                <v-icon>mdi-diameter</v-icon>Diameter Rata-rata: {{ data.result.average_tree_diameter.toFixed(2) }}
              </span>
            </br>
          </div>
          </v-card>
      </v-col>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">

            <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Foto Dokumentasi Monitoring</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
            </div>
            </div>

            <div class="absent-photo-list d-flex flex-row" v-if="true">
                <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/' + data.result.photo1 ?? '')"
                    v-bind:style="{
                    backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/' +
                        data.result.photo1 ?? '' +
                        ')',
                    }">
                    <h6>Foto Dokumentasi 1</h6>
                </div>
                <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/' + data.result.photo2 ?? '')"
                    v-bind:style="{
                    backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/' +
                        data.result.photo2 ?? '' +
                        ')',
                    }">
                    <h6>Foto Dokumentasi 2</h6>
                </div>
            </div>
            <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                <h4>Foto Akumulasi Pohon Monitoring</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
                <div class="geko-list-header-toolbar"></div>
            </div>
            </div>

            <div class="absent-photo-list d-flex flex-row" v-if="data.result.tree_detail_acumulation.length > 0">
                <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/' + data.result.tree_detail_acumulation[0]?.photo_dead ?? '')"
                    v-bind:style="{
                    backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/' +
                        data.result.tree_detail_acumulation[0]?.photo_dead ?? '' +
                        ')',
                    }">
                    <h6>Foto Pohon Mati</h6>
                </div>
                <div class="absent-photo-item"
                    @click="showLightbox($_config.baseUrlUpload + '/' + data.result.tree_detail_acumulation[0]?.photo_life ?? '')"
                    v-bind:style="{
                    backgroundImage:
                        'url(' +
                        $_config.baseUrlUpload +
                        '/' +
                        data.result.tree_detail_acumulation[0]?.photo_life ?? '' +
                        ')',
                    }">
                    <h6>Foto Pohon Hidup</h6>
                </div>
            </div>  
        </v-card>
          
      </v-col>
    </v-row>

  </div>

</template>

<script>

export default {
  name: "monitoring5-detail",
  props: {
    data: {
      required: true,
      default: [],
    },
  },
  mounted() {
  },
  methods: {
    progressColorFormat(val){
      if(val <= 30) return "red"
      else if (val > 30 && val <= 80) return "orange"
      else if (val > 80) return "green"
    },
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
  },
  data() {
    return {
      // bibits: [],
      DetailPerSeeds:{
        header: [
          {
            text: 'No',
            key: 'index',
            value: 'index',
          },
          {
            text: 'Kode Monitoring',
            key: 'monitoring5_no',
            value: 'monitoring5_no',
          },  
          {
            text: 'Kode Jenis Pohon',
            key: 'tree_code',
            value: 'tree_code',
          },
          {
            text: 'Nama Pohon',
            key: 'tree_name',
            value: 'tree_name',
          }
        ], 
      },
      headerBibits: [
        {
          text: 'No',
          key: 'index',
          value: 'index',
        },
        {
          text: 'Kode Monitoring',
          key: 'monitoring5_no',
          value: 'monitoring5_no',
        },
        {
          text: 'Kode Pohon',
          key: 'tree_no',
          value: 'tree_no',
        },
        {
          text: 'Nama Pohon',
          key: 'tree_name',
          value: 'tree_name',
        },
        {
          text: 'Nama Petani',
          key: 'farmer_name',
          value: 'tree_name',
        },
        {
          text: 'Kondisi Sekitar Pohon',
          key: 'tree_condition',
          value: 'tree_condition',
        },
        {
          text: 'Tinggi (cm)',
          key: 'height',
          value: 'height',
        },
        {
          text: 'Diameter (cm)',
          key: 'diameter',
          value: 'diameter',
        },
        {
          text: 'Pupuk/Pestisida',
          key: 'pest',
          value: 'pest',
        },
        {
          text: 'Deskripsi Pupuk/Pestisida',
          key: 'pest_description',
          value: 'pest_description',
        },
      ],
    }
  }
}
</script>
<style>
.map-container {
            border-radius: 12px ;
            overflow: hidden;
            border: 1px solid rgba(128, 128, 128, 0.349);
        }
</style>