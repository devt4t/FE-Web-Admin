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
  </geko-base-crud>
</template>

<script>
import "./program-soc.scss";
import moment from "moment";
export default {
  name: "pra-module",
  data() {
    return {
      formatDate(date, format = "YYYY-MM-DD", dateFormat = "YYYY-MM-DD") {
        return moment(date, format).format("DD MMMM YYYY");
      },
      config: {
        title: "Sosialisasi Program",
        model_api: null,
        getter: "GetFormMinatAll_new",
        // getterDataKey: "data.result.data",
        setter: "GetFormMinatAll",
        // update: "UpdateDataProject",
        // delete: "deleteProject",
        // update_id_setter: "current_id",
        // deleteKey: "code",
        // allow_create: false,
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
              detail: true,
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
              detail: true,
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
                view_data: "users_name",
              },
              detail: true,
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
                view_data: "users_name",
                class: "min-w-100px",
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
              detail: true,
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
