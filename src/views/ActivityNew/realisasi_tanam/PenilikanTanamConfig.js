import { reactive } from "vue"
export default reactive({
  localPlantingYear: 2025,
  exportIds: [],
  refreshKey: 1,
  farmerEditKey: 1,
  farmerEditData: null,
  sostamCoordinateData: null,
  sostamDistributionData: null,
  exportLahanKey: 1,
  populateKey: 1,
  importSostamKey: 1,
  // searchColumn: 'mu',
  sostamCoordinateEditKey: 1,
  sostamDistributionEditKey: 1,
  targetMonitoringStage: 0,
  isV3Mode: false,
  config: {
    title: "Realisasi Tanam",
    globalFilter: {
      program_year: {
        setter: "program_year",
      },
    },
    // searchColumn: true,
    // searchColumnOptions: [
    //   { value: 'mu', label: 'MU' },
    //   { value: 'ta', label: 'Target Area' },
    //   { value: 'ff', label: 'FF' },
    //   { value: 'petani', label: 'Petani' },
    //   { value: 'no_lahan', label: 'No. Lahan' },
    //   { value: 'awal_monitoring', label: 'Awal Waktu Monitoring' },
    //   { value: 'akhir_monitoring', label: 'Akhir Waktu Monitoring' },
    //   { value: 'status', label: 'Status' },
    //   { value: 'status_populasi', label: 'Status Populasi' },
    // ],
    detail: "first-monitorings/main/detail",
    detailIdKey: "id",
    detailKey: "result.result",
    getter: "first-monitorings/main/list",
    getterDataKey: 'result',
    // totalDataKey: 'data.result.data',
    // limitKey: 'per_page',
    // offsetKey: 'page',
    expandable: false,
    setter: "addProjectUtils",
    setter_ext_payload: {
      project_modul: "purpose",
    },
    // update: "updateProjectUtils",
    // update_ext_payload: {
    //     project_modul: "purpose",
    // },
    // delete_ext_payload: {
    //     delete_type: "hard_delete",
    //     project_modul: "purpose",
    // },
    deleteKey: "monitoring_no",
    delete: "first-monitorings/main/delete",
    pk_field: null,
    filter_api: {
      typegetdata: "all",
      is_populated_v3: 0,
    },
    permission: {
      create: "sosialisasi-tanam-create",
      read: "sosialisasi-tanam-list",
      update: "sosialisasi-tanam-update",
      detail: "sosialisasi-tanam-detail",
      lookup: "sosialisasi-tanam-lookup",
      delete: "sosialisasi-tanam-delete",
    },
    slave: [],
    fields: [
      {
        id: "data-table-expand",
        label: "Detail",
        methods: {
          list: false,
        },
      },


      // {
      //   id: "indicator",
      //   label: " ",
      //   methods: {
      //     list: {
      //       type: "row-slot",
      //     },
      //   },
      // },
      {
        id: "managementunits_name",
        label: "Management Unit",
        methods: {
          list: true,
          detail: true,

          filter: {
            main: true,
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
        id: "target_areas_name",
        label: "Target Area",
        methods: {
          list: true,
          detail: true,

          filter: {
            main: true,
            type: "select",
            getter: "GetTargetAreaAdmin",
            setter: "target_area",
            option: {
              getterKey: "data.result",
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
        label: "Nama Desa",
        methods: {

          detail: true,
        },
      },

      {
        id: "field_facilitators_name",
        label: "Field Facilitator",
        methods: {
          list: true,
          detail: true,
          filter: {
            main: true,
            validation: ["required"],
            type: "select",
            col_size: 6,
            getter: "GetFFAllWeb_new",
            setter: "ff_no",
            param: {
              program_year: "current_program_year",
              page: 1,
              per_page: 10,
            },
            option: {
              // getterKey: "data.result",
              list_pointer: {
                code: "ff_no",
                label: "name",
                display: ["name", "ff_no"],
              },
            },
          },
        },
      },

      {
        id: "farmers_name",
        label: "Nama Petani",
        methods: {
          list: {
            type: "row-slot",
          },
          detail: true,
        },
      },
      {
        id: "monitoring_no",
        label: "No. Monitoring",
        methods: {
          detail: {
            class: "badge bg-info"

          },
        },
      },
      {
        id: "lahan_no",
        label: "No. Lahan",
        methods: {
          list: {
            type: "row-slot",
          },
          detail: {
            class: "badge bg-info"

          },
        },
      },

      {
        id: "qty_std",
        label: "Bibit",
        methods: {
          list: {
            type: 'row-slot'
          },
          detail: {
            type: 'slot',
            view_data: 'qty_std'
          },
        },
      },
      {
        id: "kayu",
        label: "Kayu",
        methods: {
          list: {
            type: 'row-slot'
          },
          detail: {
            type: 'slot',
            view_data: 'kayu'
          },
        },
      },
      {
        id: "mpts",
        label: "MPTS",
        methods: {
          list: {
            type: 'row-slot'
          },
          detail: {
            type: 'slot',
            view_data: 'mpts'
          },
        },
      },
      {
        id: "start_monitoring_period",
        label: "Awal Waktu Monitoring",
        methods: {
          list: {
            type: "row-slot",
          },
        },
      },
      {
        id: "end_monitoring_period",
        label: "Akhir Waktu Monitoring",
        methods: {
          list: {
            type: "row-slot",
          },
        },
      },

      {
        id: "planting_date",
        label: "Tanggal Penanaman",
        methods: {

          detail: {
            transform: 'date',
            class: 'badge bg-primary'
          },
        },
      },
      {
        id: "monitoring_period",
        label: "Waktu Monitoring",
        methods: {
          detail: {
            type: 'slot',
            view_data: 'monitoring_period'
          },
        },
      },
      {
        id: "lahan_condition",
        label: "Kondisi Lahan",
        methods: {

          detail: {
            transform: 'capitalize'
          },
        },
      },

      {
        id: "is_validate",
        label: "Status",
        methods: {
          list: {
            type: "row-slot",
          },
          detail: {
            transform: "status-verification",
            class: {
              2: "badge bg-success",
              1: "badge bg-warning",
              0: "badge bg-danger",
            },
          },
          // filter: {
          //   type: "select",
          //   setter: "status",
          //   main: true,
          //   option: {
          //     default_options: [
          //       {
          //         name: "Semua Status",
          //         code: null,
          //       },
          //       {
          //         name: "Belum Terverifikasi",
          //         code: 0,
          //       },
          //       {
          //         name: "Koordinat Terverifikasi",
          //         code: 2,
          //       },
          //       {
          //         name: "Koordinat Tidak Sesuai",
          //         code: 3,
          //       },
          //       {
          //         name: "Terverifikasi",
          //         code: 1,
          //       },
          //     ],
          //     list_pointer: {
          //       code: "code",
          //       label: "name",
          //       display: ["name"],
          //     },
          //   },
          // },
        },
      },

      {
        id: "is_populated",
        label: "Status Populasi",
        methods: {
          list: {
            type: "row-slot",
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
        id: "redistribution_status",
        label: "Status Distribusi Ulang",
        methods: {
          list: {
            type: 'row-slot'
          },
          // detail: {
          //   view_data: "redistribution_status",
          //   type: 'slot'
          // }
        },
      },
      {
        id: "action",
        label: "Action",
        methods: {
          detail: {
            type: "slot",
            view_data: 'action'
          },
        },
      },
    ],
  },
});
