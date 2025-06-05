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
      id: "sampling",
      label: "Metode Sampling",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "assigned_ff",
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
      id: "mu_no",
      label: "Management Unit",
      methods: {
        filter: {
          main: true,
          validation: ["required"],
          type: "select",
          col_size: 6,
          getter: "new-utilities/management-units",
          setter: "mu_no",
          param: {
            page: 1,
            per_page: 10,
          },
          option: {
            getterKey: "data",
            list_pointer: {
              code: "mu_no",
              label: "name",
              display: ["name", "mu_no"],
            },
          },
        },
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
      id: "target_area",
      label: "Target Area",
      methods: {
        filter: {
          main: true,
          validation: ["required"],
          type: "select",
          col_size: 6,
          getter: "new-utilities/target-areas",
          setter: "target_area",
          form_param: {
            mu_no: "mu_no",
          },
          param: {
            page: 1,
            per_page: 10,
          },
          option: {
            getterKey: "data",
            list_pointer: {
              code: "area_code",
              label: "name",
              display: ["name", "area_code"],
            },
          },
        },
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
    // {
    //   id: "village",
    //   label: "Desa",
    //   methods: {
    //     filter: {
    //       main: true,
    //       validation: ["required"],
    //       type: "select",
    //       col_size: 6,
    //       getter: "new-utilities/desas/option",
    //       setter: "village",
    //       form_param: {
    //         area_code: "target_area",
    //       },
    //       param: {
    //         page: 1,
    //         per_page: 100,
    //       },
    //       option: {
    //         getterKey: "data",
    //         list_pointer: {
    //           code: "kode_desa",
    //           label: "name",
    //           display: ["name", "kode_desa"],
    //         },
    //       },
    //     },
    //   },
    // },
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
        list: {
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
      id: "is_populated",
      label: "Status Populasi",
      methods: {
        list: {
          transform: "status-population",
          class: {
            1: "badge bg-success",
            0: "badge bg-danger",
          },
        },
        detail: {
          transform: "status-population",
          class: {
            1: "badge bg-success",
            0: "badge bg-danger",
          },
        },
        // filter: {
        //   label: "Tanggal Monitoring",
        //   validation: ["required"],
        //   type: "daterange",
        //   col_size: 6,
        //   getter: "updated_at",
        //   setter: "distribution_date",
        //   icon: "calendar-edit",
        //   main: true,
        // },
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
    {
      id: "created_at",
      label: "Tahun Input Data",
      methods: {
        filter: {
          main: true,
          type: "select",
          col_size: 6,
          // validation: ["required"],
          option: {
            default_options: [
              {
                name: "2021",
                code: "2021",
              },
              {
                name: "2022",
                code: "2022",
              },
              {
                name: "2023",
                code: "2023",
              },
              {
                name: "2024",
                code: "2024",
              },
              {
                name: "2025",
                code: "2025",
              }
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
      id: "monitoring_year",
      label: "Tahun Monitoring",
      methods: {
        filter: {
          main: true,
          type: "select",
          col_size: 6,
          validation: ["required"],
          option: {
            default_options: [
              {
                name: "2021",
                code: "2021",
              },
              {
                name: "2022",
                code: "2022",
              },
              {
                name: "2023",
                code: "2023",
              },
              {
                name: "2024",
                code: "2024",
              },
              {
                name: "2025",
                code: "2025",
              }
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
  ],
});
