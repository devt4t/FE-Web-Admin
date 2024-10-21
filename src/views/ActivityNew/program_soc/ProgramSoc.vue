<template>
  <geko-base-crud
    :config="config"
    :hideDelete="!['13'].includes($store.state.User.role)"
    :hideUpdate="true"
    :key="'program-soc-detail' + componentKey"
    @onExportExcel="onExportExcel($event)"
  >
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

    <template v-slot:detail-action="{ item }">
      <div>
        <v-btn
          v-if="
            item.is_verified == 0 &&
            $store.state.User &&
            $_sys.isAllowed('sosialisasi-program-verification-create')
          "
          variant="success"
          @click="onVerify"
          >Verifikasi</v-btn
        >
        <v-btn
          v-if="
            item.is_verified == 1 &&
            $store.state.User &&
            $_sys.isAllowed('sosialisasi-program-unverification-create')
          "
          variant="danger"
          @click="onVerify(false)"
          >Unverifikasi</v-btn
        >
      </div>
    </template>
    <template v-slot:list-bottom-action="{ item }">
      <v-btn
        small
        @click="onExport(item)"
        variant="danger"
        class="mt-1"
        v-if="item.is_verified"
      >
        <v-icon small v-if="!exportIds.includes(item.id)"
          >mdi-file-pdf-box</v-icon
        >

        <v-progress-circular
          v-else
          color="danger"
          :size="15"
          :width="2"
          indeterminate
        ></v-progress-circular>
        <span class="text-09-em ml-1">Export</span>
      </v-btn>
    </template>

    <template v-slot:create-form>
      <program-soc-form />
    </template>

    <!-- DETAIL SLAVE -->
    <template v-slot:detail-slave-raw="{ data }">
      <program-soc-detail :data="data" />
    </template>
  </geko-base-crud>
</template>

<script>
import "./program-soc.scss";
import moment from "moment";
import ProgramSocForm from "./ProgramSocForm.vue";
import ProgramSocDetail from "./ProgramSocDetail.vue";
import defaultData from "./ProgramSocData.js";
import axios from "axios";
export default {
  name: "pra-module",
  components: {
    ProgramSocForm,
    ProgramSocDetail,
  },

  methods: {

    //refactored
    async onExportExcel(data) {
      this.$_alert.loading(
        "Sedang mengexport data",
        "Mohon tunggu sebentar, proses ini memerlukan waktu beberapa detik"
      );

      const delay = (ms) => new Promise((res) => setTimeout(res, ms));

      let reqParams = {
        ...data.filter,
        ...data.params,
        limit: parseInt(data.totalRecord * 1.5),
      };

      try {
        const { data: dataList } = await this.$_api.get(
          "GetFormMinatBulkData_new",
          reqParams
        );

        if (!dataList) {
          this.$_alert.error(
            {},
            "Export Gagal",
            "Gagal mengambil data list sosialisasi program"
          );
          return;
        }

        const axiosConfig = {
          method: "POST",
          url: `${this.$_config.baseUrlExport}export/soc-prog/excel`,
          responseType: "arraybuffer",
          data: { data: dataList },
        };

        const { data: exported } = await axios(axiosConfig);

        if (!exported) {
          this.$_alert.error({}, "Export Gagal");
          return;
        }

        const url = URL.createObjectURL(new Blob([exported]));
        const link = document.createElement("a");
        const filename = `sosialisasi-program-export${moment().format(
          "DMMYYYYHHmmss"
        )}.xlsx`;

        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        this.$_alert.success("Successfully");
      } catch (error) {
        this.$_alert.error({}, "Export Gagal");
      }
    },

    async onExport(data) {
      if (this.exportIds.includes(data.id)) return;
      this.exportIds.push(data.id);
      const result = await this.$_api
        .get("GetFormMinatDetailAll_new", {
          id: data.id,
        })
        .catch(() => false);
      if (!result) {
        let idx = this.exportIds.findIndex((x) => x == data.id);
        this.exportIds.splice(idx, 1);
        return;
      }

      for (const item of result.sprFarmer) {
        if (item.owned_land_legalization_status) {
          item.owned_land_legalization_status =
            defaultData.owned_land_legalization_status.find(
              (x) => x.code == item.owned_land_legalization_status
            ).label;
        }
        if (item.followed_project_model) {
          item.followed_project_model = defaultData.followed_project_model.find(
            (x) => x.code == item.followed_project_model
          ).label;
        }
      }
      const exported = await axios
        .post(
          `${this.$_config.baseUrlExport}export/soc-prog/pdf`,
          {
            ...result.mainSpr,
            participants: result.sprFarmer,
          },
          {
            responseType: "arraybuffer",
          }
        )
        .catch(() => false);

      if (!exported) {
        let idx = this.exportIds.findIndex((x) => x == data.id);
        this.exportIds.splice(idx, 1);
        return;
      }
      const url = URL.createObjectURL(
        new Blob([exported.data], {
          type: "application/pdf",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      const filename = `sosialisasi-program-${data.form_no}-${data.desas_name}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      let idx = this.exportIds.findIndex((x) => x == data.id);
      this.exportIds.splice(idx, 1);
    },
    onVerify(verif = true) {
      this.$_alert
        .confirm(
          "",
          "Data yang sudah diverifikasi tidak dapat di unverifikasi. Apakah anda yakin ingin melanjutkan?",
          "",
          "",
          true
        )
        .then((response) => {
          if (response.isConfirmed) {
            this.$_api
              .post("UpdateVerificationFormMinat_new", {
                current_id: this.$route.query.id,
                moduls: verif ? "verification" : "unverification",
              })
              .then(() => {
                this.$_alert.success("Data berhasil diverifikasi");
                this.componentKey += 1;
              })
              .catch((err) => {
                this.$_alert.error(err);
              });
          }
        });
    },
  },

  computed: {
    defaultData() {
      return defaultData;
    },
  },

  data() {
    return {
      exportIds: [],
      componentKey: 1,
      formatDate(date, format = "YYYY-MM-DD", dateFormat = "YYYY-MM-DD") {
        return moment(date, format).format("DD MMMM YYYY");
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

        deleteSoft: {
          payload: {
            delete_type: "soft_delete",
          },
        },

        delete: "DeleteFormMinatMain_new",

        deleteKey: "form_no",
        delete_ext_payload: {
          delete_type: "hard_delete",
        },
        // update: "UpdateDataProject",
        // delete: "deleteProject",
        // update_id_setter: "current_id",
        // allow_create: false,

        globalFilter: {
          // project_purpose: {
          //   setter: "purpose_code",
          // },
          program_year: {
            setter: "program_year",
          },
        },
        export: true,
        pk_field: null,
        permission: {
          create: "sosialisasi-program-create",
          read: "sosialisasi-program-list",
          update: "sosialisasi-program-update",
          detail: "sosialisasi-program-detail",
          lookup: "sosialisasi-program-lookup",
          delete: "sosialisasi-program-delete",
        },
        statistic: {
          statistic_key: "farmer_counter",
          transform_key: {
            total_data: {
              label: "Total Petani Yang Hadir",
              icon: "mdi-list-status",
            },
            berminat: {
              label: "Berminat",
              icon: "mdi-check-circle-outline",
              color: "success",
            },
            tidak_berminat: {
              label: "Belum Berminat",
              icon: "mdi-close-circle-outline",
              color: "danger",
            },
            masih_ragu: {
              label: "Ragu - Ragu",
              icon: "mdi-close-circle-outline",
              color: "info",
            },
          },
        },
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
              filter: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                getter: "GetManagementUnitAdmin",
                setter: "mu_no",
                param: {
                  page: 1,
                  per_page: 10,
                },
                option: {
                  getterKey: "data.result",
                  list_pointer: {
                    code: "mu_no",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
            },
          },
          {
            id: "target_area_filter",
            label: "Target Area",
            methods: {
              filter: {
                type: "select",
                getter: "GetTA_new",
                setter: "area_code",
                form_param: {
                  mu_no: "mu_no",
                },
                param: {
                  program_year: "current_program_year",
                },
                option: {
                  // getterKey: "data.result",
                  list_pointer: {
                    code: "area_code",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
            },
          },
          {
            id: "village_filter",
            label: "Desa",
            methods: {
              filter: {
                type: "select",
                getter: "GetDesa",
                setter: "kode_desa",
                form_param: {
                  kode_ta: "area_code",
                },
                param: {
                  program_year: "current_program_year",
                },
                option: {
                  getterKey: "data.result",
                  list_pointer: {
                    code: "kode_desa",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
            },
          },
          {
            id: "total_farmer",
            label: "Total Peserta",
            methods: {
              list: false,
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
              filter: {
                type: "select",
                setter: "is_verified",
                option: {
                  default_options: [
                    {
                      name: "Semua Status",
                      code: null,
                    },
                    {
                      name: "Belum Terverifikasi",
                      code: 0,
                    },
                    {
                      name: "Terverifikasi",
                      code: 1,
                    },
                  ],
                  list_pointer: {
                    code: "code",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
            },
          },

          {
            id: "action",
            label: "Action",
            methods: {
              list: false,
              detail: {
                type: "slot",
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
