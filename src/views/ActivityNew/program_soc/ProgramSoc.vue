<template>
  <geko-base-crud :config="config">
    <template v-slot:list-form_no="{ item }">
      <div class="d-flex flex-column min-w-150px">
        <p class="mb-0 text-link font-weight-500">#{{ item.form_no }}</p>
        <p class="mb-0 font-weight-300">{{ formatDate(item.form_date) }}</p>
      </div>
    </template>

    <template v-slot:list-total_farmer="{ item }">
      <p class="mb-0 text-no-wrap">
        {{
          [undefined, null].includes(item.total_farmer)
            ? "-"
            : item.total_farmer
        }}
        peserta
      </p>
    </template>

    <template v-slot:list-target_area_id="{ item }">
      <div class="d-flex flex-column min-w-100px">
        <p class="mb-0 text-09-em">{{ item.target_areas_name }}</p>
        <p class="mb-0 text-grey text-09-em">
          MU {{ item.managementunits_name }}
        </p>
      </div>
    </template>

    <template v-slot:list-indicator="{ item }">
      <div class="indicator-wrapper pt-1">
        <div
          class="indicator"
          :class="{
            success: item.is_verified == 1,
            danger: item.is_verified == 0,
          }"
        ></div>
      </div>
    </template>

    <template v-slot:create-form>
      <program-soc-form />
    </template>

    <!-- DETAIL SLAVE -->
    <template v-slot:detail-slave-raw="{ data }">
      <div class="program-soc-detail-wrapper">
        <v-data-table
          :headers="detailConfig.header"
          :items="data.sprFarmer"
          :search="''"
          class="rounded-xl elevation- pa-1 px-5"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <template v-slot:top>
            <div class="geko-list-header py-3 mt-1">
              <div class="pr-5 mr-5">
                <h4>Daftar Petani</h4>
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
                      data.sprFarmer.filter((x) => x.status_program == "Ya")
                        .length
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
              <img :src="$_config.baseUrlUpload + '/' + item.photo" />
            </div>
          </template>
        </v-data-table>
      </div>
    </template>
  </geko-base-crud>
</template>

<script>
import "./program-soc.scss";
import moment from "moment";
import ProgramSocForm from "./ProgramSocForm.vue";
export default {
  name: "pra-module",
  components: {
    ProgramSocForm,
  },

  methods: {
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
      console.log(_statistics);
      return _statistics;
    },
  },
  data() {
    return {
      formatDate(date, format = "YYYY-MM-DD", dateFormat = "YYYY-MM-DD") {
        return moment(date, format).format("DD MMMM YYYY");
      },
      detailConfig: {
        header: [
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
            key: "photo",
            sortable: false,
            text: "Foto Form Minat",
            value: "photo",
          },
        ],
        data: [],
      },
      config: {
        title: "Sosialisasi Program",
        model_api: null,
        getter: "GetFormMinatAll_new",
        // getterDataKey: "data.result.data",
        detail: "GetFormMinatDetailAll_new",
        detailIdKey: "id",
        detailKey: "mainSpr",
        setter: "GetFormMinatAll",
        // update: "UpdateDataProject",
        // delete: "deleteProject",
        // update_id_setter: "current_id",
        // deleteKey: "code",
        // allow_create: false,

        globalFilter: {
          // project_purpose: {
          //   setter: "purpose_code",
          // },
          program_year: {
            setter: "program_year",
          },
        },
        pk_field: null,
        permission: {
          create: "program-soc-create",
          read: "program-soc-list",
          update: "program-soc-update",
          show: "program-soc-show",
          lookup: "program-soc-lookup",
          delete: "program-soc-delete",
        },
        //   statistic: {
        //     transform_key: {
        //       total_data: {
        //         label: "Total Data",
        //         icon: "mdi-list-status",
        //       },
        //       verified: {
        //         label: "Terverifikasi",
        //         icon: "mdi-check-circle-outline",
        //         color: "success",
        //       },
        //       unverified: {
        //         label: "Belum Terverifikasi",
        //         icon: "mdi-close-circle-outline",
        //         color: "danger",
        //       },
        //     },
        //   },
        fields: [
          {
            id: "id",
            methods: {
              list: false,
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },

          {
            id: "indicator",
            label: " ",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },

          {
            id: "form_no",
            label: "Form no",
            methods: {
              list: {
                class: "min-w-100px",
                type: "row-slot",
              },
              detail: true,
              create: true,
              update: true,
              filter: false,
            },
          },

          {
            id: "village_id",
            label: "Desa",
            methods: {
              list: {
                view_data: "desas_name",
              },
              detail: {
                view_data: "desas_name",
              },
              create: true,
              update: true,
              filter: false,
            },
          },

          {
            id: "target_area_id",
            label: "Target Area",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: {
                view_data: "target_areas_name",
              },
              create: true,
              update: true,
              filter: false,
            },
          },

          {
            id: "management_unit_id",
            label: "Management Unit",
            methods: {
              list: false,
              detail: {
                view_data: "managementunits_name",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "total_farmer",
            label: "Total Peserta",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },

          {
            id: "pic_id",
            label: "PIC",
            methods: {
              list: {
                view_data: "users_name_created_by",
              },
              detail: {
                view_data: "users_name_created_by",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "program_year",
            label: "Tahun Program",
            methods: {
              list: {
                view_data: "program_year",
                class: "badge bg-primary",
              },
              detail: {
                view_data: "program_year",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "pic_manager_id",
            label: "PIC Manager",
            methods: {
              list: {
                show: false,
                view_data: "users_name_created_by",
                class: "min-w-100px",
              },
              detail: false,
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "verified_by",
            label: "Verified By",
            methods: {
              list: {
                transform: "no-empty",
                view_data: "users_name_verified_by",
              },
              detail: true,
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "is_verify",
            label: "Status",
            methods: {
              list: {
                view_data: "is_verified",
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-success",
                },
                transform: "status-verification",
              },
              detail: {
                view_data: "is_verified",
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-success",
                },
                transform: "status-verification",
              },
              create: false,
              update: false,
              filter: false,
            },
          },
        ],
      },
    };
  },

  mounted() {},
};
</script>
