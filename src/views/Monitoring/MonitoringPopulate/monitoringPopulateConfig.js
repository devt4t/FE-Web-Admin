import { reactive } from "vue"

export default reactive({
  // export: true,
    title: "Monitoring Populate Data",
    getter: "populate-monitoring/1-to-2/list",
    getterDataKey: "result",
    totalDataKey: 'total',
    // detail: "second-monitorings/main/detail",
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
            id: "populate_no",
            label: "Kode Populate",
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
            label: "Kode Monitoring Sebelumnya",
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
            id: "farmer_no",
            label: "Kode Petani",
            methods: {
                list: false,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "farmer_name",
            label: "Nama Nama Petani",
            methods: {
                list: false,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "ff_name",
            label: "Nama FF Penanaman",
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
            label: "FF Petugas Monitoring",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "target_area_name",
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
            id: "mu_name",
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
            id: "status",
            label: "Status Monitoring Selanjutnya",
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
