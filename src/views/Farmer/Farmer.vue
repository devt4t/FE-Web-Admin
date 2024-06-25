<template>
  <geko-base-crud :config="config">
    <template v-slot:list-join_year="{ item }">
      <div
        class="d-flex flex row mt-1"
        style="justify-content: center; align-items: center"
      >
        <span class="mb-0 badge bg-primary">{{
          formatDate(item.join_date, "YYYY")
        }}</span>
      </div>
    </template>
  </geko-base-crud>
</template>

<script>
import moment from "moment";
export default {
  name: "farmer-v2",
  data() {
    return {
      formatDate(date, format = "DD MMMM YYYY", dateFormat = "YYYY-MM-DD") {
        return moment(date, dateFormat).format(format);
      },
      config: {
        title: "Petani",
        model_api: null,
        getter: "GetFarmerAllAdmin",

        getterDataKey: "data.result.data",
        setter: "AddFormMinatFarmers_new",
        setter_redirect: "back",
        update: "UpdateFormMinatMain_new",
        delete: "deleteProjectUtils",
        filter_api: {
          typegetdata: "all",
        },
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
          create: "farmer-create",
          read: "farmer-list",
          update: "farmer-update",
          show: "farmer-show",
          lookup: "farmer-lookup",
          delete: "farmer-delete",
        },
        slave: [],
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
            id: "farmer_id",
            label: "Nama Petani",
            methods: {
              list: {
                view_data: "nama",
                class: "font-weight-500",
              },
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"], setter: "new_name" },
              filter: false,
            },
          },

          {
            id: "ff_id",
            label: "Nama FF",
            methods: {
              list: {
                view_data: "user",
              },
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "village",
            label: "Desa",
            methods: {
              list: {
                view_data: "desa",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },

          {
            id: "nik",
            label: "NIK",
            methods: {
              list: {
                view_data: "nik",
              },
              detail: true,
              filter: false,
            },
          },

          {
            id: "program_year",
            label: "Tahun Program",
            methods: {
              list: {
                show: false,
                class: "badge bg-primary",
              },
              detail: true,
              filter: false,
            },
          },

          {
            id: "join_year",
            label: "Tahun Bergabung",
            methods: {
              list: {
                type: "row-slot",
                class: "badge bg-primary",
              },
              detail: true,
              filter: false,
            },
          },

          {
            id: "status",
            label: "Status",
            methods: {
              list: {
                header_class: "text-center",
                class: {
                  "Sudah Verifikasi": "badge bg-success text-no-wrap",
                  "Belum Verifikasi": "badge bg-warning text-no-wrap",
                },
                view_data: "status",
              },
              detail: true,
              filter: false,
            },
          },
        ],
      },
    };
  },
};
</script>
