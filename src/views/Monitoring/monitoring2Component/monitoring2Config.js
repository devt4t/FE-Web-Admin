import { reactive } from "vue"

export default reactive({
  // export: true,
    title: "Monitoring 2",
    getter: "second-monitorings/main/list",
    getterDataKey: "result",
    totalDataKey: 'total',
    // detail: "lahan-umum/main/detail",
    // detailIdKey: "id",
    // detailKey: "result",
    pk_field: null,
    globalFilter: {
        program_year: {
            setter: "program_year",
        },
    },
    permission: {
        create: "monitoring-create",
        read: "monitoring-list",
        update: "monitoring-update",
        detail: "monitoring-detail",
        lookup: "monitoring-lookup",
        delete: "monitoring-delete",
    },
    slave: [],
    fields: [
        {
            id: "monitoring2_no",
            label: "Nomor Monitoring",
            methods: {
              list: true,
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "monitoring_no",
            label: "Nomor Monitoring Sebelumnya",
            methods: {
              list: true,
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "program_year",
            label: "Tahun Program",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "field_facilitators_name",
            label: "Nama FF",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "farmers_name",
            label: "Nama Petani",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "managementunits_name",
            label: "Management Unit",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "target_areas_name",
            label: "Target Area",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "desas_name",
            label: "Desa",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "lahan_no",
            label: "Nomor Lahan",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "land_condition",
            label: "Kondisi Lahan",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
    ],
});
