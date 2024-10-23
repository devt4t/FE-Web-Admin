<template>
  <div>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
          <v-data-table :headers="configKehadiranFC.table.header" :items="data.data.result.field_coordinator"
            :search="''" class="rounded-xl elevation- pa-1 px-5">

            <template v-slot:item.index="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Daftar Kehadiran FC</h4>
                </div>
                <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                </div>
              </div>

              <div class="statistics mb-3">
                <div class="statistic-item light">
                  <v-icon>mdi-list-status</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total FC</p>
                    <p class="mb-0 value">{{ data.data.result.field_coordinator.length }}</p>
                  </div>
                </div>
              </div>
            </template>

          </v-data-table>
        </v-card>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
          <v-data-table :headers="configKontribusiFF.table.header" :items="data.data.result.field_facilitators"
            :search="''" class="rounded-xl elevation- pa-1 px-5">

            <template v-slot:item.index="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Daftar Kontribusi FF</h4>
                </div>
                <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                </div>
              </div>

              <div class="statistics mb-3">
                <div class="statistic-item light">
                  <v-icon>mdi-list-status</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total FF</p>
                    <p class="mb-0 value">{{ data.data.result.field_facilitators.length }}</p>
                  </div>
                </div>
              </div>
            </template>

          </v-data-table>
        </v-card>
      </v-col>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">

          <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
              <h4>Absensi</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar"></div>
            </div>
          </div>

          <div class="absent-photo-list d-flex flex-row" v-if="true">
            <div class="absent-photo-item" v-for="(item, i) in data.data.result.absent" :key="'absent-photo' + i"
              @click="showLightbox($_config.baseUrlUpload + '/' + item)" v-bind:style="{
                backgroundImage:
                  'url(' +
                  $_config.baseUrlUpload +
                  '/' +
                  item +
                  ')',
              }">
              <h6>Foto Absen {{ ++i }}</h6>
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
              @click="showLightbox($_config.baseUrlUpload + '/' + data.data.result.documentation_photo)" v-bind:style="{
                backgroundImage:
                  'url(' +
                  $_config.baseUrlUpload +
                  '/' +
                  data.data.result.documentation_photo +
                  ')',
              }">
              <h6>Foto Dokumentasi</h6>
            </div>
          </div>

        </v-card>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
          <v-data-table :headers="configPesertaUmum.table.header" :items="data.data.result.peserta_umums" :search="''"
            class="rounded-xl elevation- pa-1 px-5">

            <template v-slot:item.index="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Daftar Peserta Umum</h4>
                </div>
                <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                </div>
              </div>

              <div class="statistics mb-3">
                <div class="statistic-item light">
                  <v-icon>mdi-list-status</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Peserta Umum</p>
                    <p class="mb-0 value">{{ data.data.result.peserta_umums.length }}</p>
                  </div>
                </div>
              </div>
            </template>

          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
          <v-data-table :headers="configKehadiranPetani.table.header" :items="data.data.result.farmers" :search="''"
            class="rounded-xl elevation- pa-1 px-5">

            <template v-slot:item.index="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Daftar Kehadiran Petani</h4>
                </div>
                <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                </div>
              </div>

              <div class="statistics mb-3">
                <div class="statistic-item light">
                  <v-icon>mdi-list-status</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Petani</p>
                    <p class="mb-0 value">{{ data.data.result.farmers.length }}</p>
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
  name: "pelatihan-petani-detail",
  props: {
    data: {
      required: false,
      default: null,
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