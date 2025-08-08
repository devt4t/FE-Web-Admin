<template>
  <div class="program-soc-detail-wrapper" v-if="true">
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
                    <p class="mb-0 value">{{ data.data.result.field_coordinator.length ?? '' }}</p>
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
import defaultData from "./ProgramSocData.js";
export default {
  name: "program-soc-detail",
  props: {
    data: {
      required: false,
      default: null,
    },
  },
  mounted: function () {
    console.log("ProgramSocDetail mounted", this.data);
  },
  methods: {
    onDelete(item) {
      this.$_alert
        .confirm(
          "",
          "Data yang dihapus tidak dapat dikembalikan. Apakah anda yakin ingin melanjutkan?",
          "",
          "",
          true
        )
        .then((response) => {
          if (response.isConfirmed) {
            this.$_api
              .post("DeleteFormMinatFarmer_new", {
                id: item.id,
                delete_type: "hard_delete",
              })
              .then(() => {
                this.$_alert.success("Data berhasil dihapus");
                this.deleteIds.push(item.id);
              })
              .catch((err) => {
                this.$_alert.error(err);
              });
          }
        });
    },
    // generateStatisticTree(data) {
    //   let _statistics = [];
    //   for (const _data of data) {
    //     //check if exist
    //     if (_data.trees_tree_name_t1) {
    //       const isExist = _statistics.findIndex(
    //         (x) => x.label === _data.trees_tree_name_t1
    //       );
    //       if (isExist > -1) {
    //         //is exist
    //         _statistics[isExist].value += 1;
    //       } else {
    //         //is not exist
    //         _statistics.push({
    //           label: _data.trees_tree_name_t1,
    //           value: 1,
    //         });
    //       }
    //     }
    //     if (_data.trees_tree_name_t2) {
    //       const isExist = _statistics.findIndex(
    //         (x) => x.label === _data.trees_tree_name_t2
    //       );
    //       if (isExist > -1) {
    //         //is exist
    //         _statistics[isExist].value += 1;
    //       } else {
    //         //is not exist
    //         _statistics.push({
    //           label: _data.trees_tree_name_t2,
    //           value: 1,
    //         });
    //       }
    //     }
    //     if (_data.trees_tree_name_t3) {
    //       const isExist = _statistics.findIndex(
    //         (x) => x.label === _data.trees_tree_name_t3
    //       );
    //       if (isExist > -1) {
    //         //is exist
    //         _statistics[isExist].value += 1;
    //       } else {
    //         //is not exist
    //         _statistics.push({
    //           label: _data.trees_tree_name_t3,
    //           value: 1,
    //         });
    //       }
    //     }
    //   }
    //   return _statistics;
    // },

    //refactored
    // Refactored vue js 2 function

    generateStatisticTree(data) {
      let statistics = [];

      const updateStatistics = (treeName) => {
        const isExist = statistics.findIndex((x) => x.label === treeName);
        if (isExist > -1) {
          statistics[isExist].value += 1;
        } else {
          statistics.push({ label: treeName, value: 1 });
        }
      };

      for (const _data of data) {
        if (_data.trees_tree_name_t1) {
          updateStatistics(_data.trees_tree_name_t1);
        }

        if (_data.trees_tree_name_t2) {
          updateStatistics(_data.trees_tree_name_t2);
        }

        if (_data.trees_tree_name_t3) {
          updateStatistics(_data.trees_tree_name_t3);
        }
      }

      return statistics;
    },

    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    async getDetail() {
      if (!this.data) return;

      this.$_api
        .get("GetFormMinatCollectiveDetailAll_new", {
          id: this.data.id,
        })
        .then((response) => {
          this.data = response.data.result;
          // this.$emit("data-loaded", this.data);
        })
        .catch((err) => {
          console.error(err);
          this.$_alert.error(err);
        });
    }
  },
  computed: {
    defaultData() {
      return defaultData;
    },
  },
  data() {
    return {
      deleteIds: [],
      detailConfig: {
        header: [
          {
            text: "",
            key: "actions",
            value: "actions",
            class: "sticky-left",
            sortable: false,
          },
          {
            key: "index",
            sortable: false,
            text: "#",
            value: "index",
          },
          {
            key: "name",
            sortable: false,
            text: "Nama",
            value: "name",
          },
          {
            key: "status_program",
            sortable: false,
            text: "Berminat?",
            value: "status_program",
          },
          {
            key: "training_materials_material_name",
            sortable: false,
            text: "Materi Training",
            value: "training_materials_material_name",
          },
          {
            key: "pattern",
            sortable: false,
            text: "Pola",
            value: "pattern",
          },
          {
            key: "trees",
            sortable: false,
            text: "Jenis Bibit Yang Diharapkan",
            value: "trees",
          },
          {
            key: "owned_land_legalization_status",
            sortable: false,
            text: "Status legalitas lahan yang dimiliki",
            value: "owned_land_legalization_status",
          },
          {
            key: "followed_project_model",
            sortable: false,
            text: "Model project yang akan diikuti",
            value: "followed_project_model",
          },
          {
            key: "photo",
            sortable: false,
            text: "Foto Form Minat",
            value: "photo",
          },
        ],
        data: [],
      },
    };
  },
};
</script>
