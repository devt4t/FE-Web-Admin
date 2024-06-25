<template>
  <geko-base-crud
    :config="config"
    :hideDelete="true"
    :hideUpdate="true"
    :key="'program-soc-detail' + componentKey"
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
            ['13', '20', '25'].includes($store.state.User.role)
          "
          variant="success"
          @click="onVerify"
          >Verifikasi</v-btn
        >
        <v-btn
          v-if="
            item.is_verified == 1 &&
            $store.state.User &&
            ['13', '23'].includes($store.state.User.role)
          "
          variant="danger"
          @click="onVerify(false)"
          >Unverifikasi</v-btn
        >
      </div>
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
export default {
  name: "pra-module",
  components: {
    ProgramSocForm,
    ProgramSocDetail,
  },

  methods: {
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

  data() {
    return {
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
