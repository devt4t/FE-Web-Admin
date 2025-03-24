import { reactive } from "vue"

export default reactive({
  // export: true,
    title: "Monitoring 2",
    getter: "second-monitorings/main/list",
    getterDataKey: "result",
    totalDataKey: 'total',
    detail: "second-monitorings/main/detail",
    detailIdKey: "id",
    detailKey: "result",
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
          id: "indicator",
          label: " ",
          methods: {
            list: {
              type: "row-slot",
            },
          },
        },
        {
            id: "monitoring2_no",
            label: "Nomor Monitoring",
            methods: {
              list: false,
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "monitoring_time",
            label: "Tanggal Monitoring",
            methods: {
              list: false,
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "monitoring_start",
            label: "Tanggal Mulai Monitoring",
            methods: {
              list: false,
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "monitoring2_no",
            label: "Tanggal Selesai Monitoring",
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
            id: "opsi_pola_tanam",
            label: "Pola Tanam",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "qty_kayu",
            label: "Total Kayu",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "qty_mpts",
            label: "Total MPTS",
            methods: {
                list: true,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "qty_trees",
            label: "Total Pohon",
            methods: {
                list:{
                  view_data: 'qty_trees',
                  class: {
                    0: "badge bg-success",
                  },
                },
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
          {
            id: "interview",
            label: "Komentar Interview",
            methods: {
                list: false,
                detail: true,
                create: false,
                update: false,
                filter: false,
              },
          },
          {
            id: "is_verified",
            label: "Status Verifikasi",
            methods: {
              list: {
                view_data: "is_verified",
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-warning",
                  2: "badge bg-success",
                },
                transform: "monitoring-verification-status",
              },
              detail: {
                view_data: "is_verified",
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-warning",
                  2: "badge bg-success",
                },
                transform: "monitoring-verification-status",
              },
              create: false,
              update: false,
              filter: false
            },
          },
          {
            id: "verified_by",
            label: "Terverifikasi Oleh",
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
