<template>
  <div class="program-soc-detail-wrapper" v-if="data">
    <v-data-table
      :headers="detailConfig.header"
      :items="
        data.sprFarmer
          ? data.sprFarmer.filter((x) => !deleteIds.includes(x.id))
          : []
      "
      :search="''"
      class="rounded-xl elevation- pa-1 px-5"
    >
      <template v-slot:top>
        <div class="geko-list-header py-3 mt-1">
          <div
            class="pr-5 mr-5 d-flex flex-row"
            style="justify-content: space-between"
          >
            <h4>Daftar Petani</h4>
            <v-btn
              v-if="
                $store.state.User &&
                ['4', '13', '19'].includes($store.state.User.role) &&
                data.mainSpr.is_verified == 0
              "
              variant="success"
              @click="
                $router.push({
                  path: 'sosialisasi-program-farmer-v2',
                  query: {
                    view: 'create',
                    id: '',
                    form_code: data.mainSpr.form_no,
                    mu_no: data.mainSpr.mu_no,
                  },
                })
              "
            >
              <v-icon>mdi-plus</v-icon>
              <span>Tambah Petani</span>
            </v-btn>
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
              <p class="mb-0 value">{{ data.sprFarmer.length }}</p>
            </div>
          </div>
          <div class="statistic-item success">
            <v-icon>mdi-check-circle-outline</v-icon>
            <div class="statistic-data">
              <p class="mb-0 label">Berminat</p>
              <p class="mb-0 value">
                {{
                  data.sprFarmer.filter((x) => x.status_program == "Ya").length
                }}
              </p>
            </div>
          </div>
          <div class="statistic-item danger">
            <v-icon>mdi-close-circle-outline</v-icon>
            <div class="statistic-data">
              <p class="mb-0 label">Tidak Berminat</p>
              <p class="mb-0 value">
                {{
                  data.sprFarmer.filter((x) => x.status_program == "Tidak")
                    .length
                }}
              </p>
            </div>
          </div>
          <div class="statistic-item info">
            <v-icon>mdi-help-circle-outline</v-icon>
            <div class="statistic-data">
              <p class="mb-0 label">Ragu - Ragu</p>
              <p class="mb-0 value">
                {{
                  data.sprFarmer.filter(
                    (x) => x.status_program == "Ragu - Ragu"
                  ).length
                }}
              </p>
            </div>
          </div>
        </div>

        <h4 class="font-weight-500 mb-2 mt-2 text-grey">Jenis Bibit</h4>

        <div class="statistics mb-3">
          <div
            class="statistic-item mb-2 success"
            v-for="(item, i) in generateStatisticTree(data.sprFarmer)"
          >
            <v-icon>mdi-tree-outline</v-icon>
            <div class="statistic-data">
              <p class="mb-0 label font-weight-500 text-08-em">
                {{ item.label }}
              </p>
              <p class="mb-0 value">
                {{ item.value }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="geko-list-actions-wrapper d-flex flex-column">
          <div class="geko-list-actions">
            <button
              v-if="
                $store.state.User &&
                ['4', '13', '19'].includes($store.state.User.role) &&
                data.mainSpr.is_verified == 0
              "
              class="geko-list-action-update"
              @click="
                $router.push({
                  path: 'sosialisasi-program-farmer-v2',
                  query: {
                    view: 'update',
                    id: item.id,
                    form_code: item.form_no,
                    mu_no: data.mainSpr.mu_no,
                    program_year: data.mainSpr.program_year,
                  },

                  params: {
                    ...item,

                    mu_no: data.mainSpr.mu_no,
                    program_year: data.mainSpr.program_year,
                  },
                })
              "
            >
              <v-icon small>mdi-pencil-minus</v-icon>
            </button>

            <button
              v-if="
                $store.state.User &&
                ['4', '13', '19'].includes($store.state.User.role) &&
                data.mainSpr.is_verified == 0
              "
              class="geko-list-action-delete"
              @click="onDelete(item)"
            >
              <v-icon small>mdi-trash-can-outline</v-icon>
            </button>
          </div>
        </div>
      </template>
      <template v-slot:item.index="{ index }">
        {{ index + 1 }}
      </template>

      <template v-slot:item.status_program="{ item }">
        <div class="d-flex flex-row" style="justify-content: center">
          <span
            :class="{
              'badge bg-success': item.status_program === 'Ya',
              'badge bg-danger': item.status_program === 'Tidak',
              'badge bg-light': item.status_program === 'Ragu - Ragu',
            }"
          >
            <v-icon small v-if="item.status_program === 'Ya'"
              >mdi-check-bold</v-icon
            >
            <v-icon small v-else-if="item.status_program === 'Tidak'"
              >mdi-close-thick</v-icon
            >
            <v-icon small v-else-if="item.status_program === 'Ragu - Ragu'"
              >mdi-help</v-icon
            >
            <span>{{ item.status_program }}</span>
          </span>
        </div>
      </template>

      <template v-slot:item.trees="{ item }">
        <div class="d-flex flex-row min-w-200px" style="flex-wrap: wrap">
          <span
            v-if="item.trees_tree_name_t1"
            class="badge bg-success text-no-wrap mr-2 mb-1"
            >{{ item.trees_tree_name_t1 }}</span
          >
          <span
            v-if="item.trees_tree_name_t2"
            class="badge bg-success text-no-wrap mr-2 mb-1"
            >{{ item.trees_tree_name_t2 }}</span
          >
          <span
            v-if="item.trees_tree_name_t3"
            class="badge bg-success text-no-wrap mr-2 mb-1"
            >{{ item.trees_tree_name_t3 }}</span
          >
        </div>
      </template>

      <template v-slot:item.photo="{ item }">
        <div class="photo">
          <img
            :src="$_config.baseUrlUpload + '/' + item.photo"
            @click="showLightbox($_config.baseUrlUpload + '/' + item.photo)"
          />
        </div>
      </template>

      <template v-slot:item.owned_land_legalization_status="{ item }">
        <div
          class="min-w-200px"
          v-if="item && [1, 2, 3].includes(item.owned_land_legalization_status)"
        >
          <span v-if="item.owned_land_legalization_status">
            {{
              defaultData.owned_land_legalization_status.find(
                (x) => x.code == item.owned_land_legalization_status
              ).label
            }}
          </span>
        </div>

        <div v-else>-</div>
      </template>

      <template v-slot:item.followed_project_model="{ item }">
        <div
          v-if="
            item &&
            [1, 2, 3].includes(item.followed_project_model) &&
            item.status_program == 'Ya'
          "
          class="min-w-200px"
        >
          <span v-if="item.followed_project_model">
            {{
              defaultData.followed_project_model.find(
                (x) => x.code == item.followed_project_model
              ).label
            }}
          </span>
        </div>

        <div v-else>-</div>
      </template>
    </v-data-table>
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
    generateStatisticTree(data) {
      let _statistics = [];
      for (const _data of data) {
        //check if exist
        if (_data.trees_tree_name_t1) {
          const isExist = _statistics.findIndex(
            (x) => x.label === _data.trees_tree_name_t1
          );
          if (isExist > -1) {
            //is exist
            _statistics[isExist].value += 1;
          } else {
            //is not exist
            _statistics.push({
              label: _data.trees_tree_name_t1,
              value: 1,
            });
          }
        }
        if (_data.trees_tree_name_t2) {
          const isExist = _statistics.findIndex(
            (x) => x.label === _data.trees_tree_name_t2
          );
          if (isExist > -1) {
            //is exist
            _statistics[isExist].value += 1;
          } else {
            //is not exist
            _statistics.push({
              label: _data.trees_tree_name_t2,
              value: 1,
            });
          }
        }
        if (_data.trees_tree_name_t3) {
          const isExist = _statistics.findIndex(
            (x) => x.label === _data.trees_tree_name_t3
          );
          if (isExist > -1) {
            //is exist
            _statistics[isExist].value += 1;
          } else {
            //is not exist
            _statistics.push({
              label: _data.trees_tree_name_t3,
              value: 1,
            });
          }
        }
      }
      return _statistics;
    },

    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
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
