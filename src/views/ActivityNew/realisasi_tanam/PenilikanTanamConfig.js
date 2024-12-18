import { reactive } from "vue"
export default reactive({
  exportIds: [],
  refreshKey: 1,
  farmerEditKey: 1,
  farmerEditData: null,
  sostamCoordinateData: null,
  sostamDistributionData: null,
  exportLahanKey: 1,
  importSostamKey: 1,
  searchColumn: 'mu',
  sostamCoordinateEditKey: 1,
  sostamDistributionEditKey: 1,
  config: {
    title: "Realisasi Tanam",
    globalFilter: {
      program_year: {
        setter: "program_year",
      },
    },
    searchColumn: true,
    searchColumnOptions: [
      { value: 'mu', label: 'MU' },
      { value: 'ta', label: 'Target Area' },
      { value: 'ff', label: 'FF' },
      { value: 'petani', label: 'Petani' },
      { value: 'no_lahan', label: 'No. Lahan' },
      { value: 'awal_monitoring', label: 'Awal Waktu Monitoring' },
      { value: 'akhir_monitoring', label: 'Akhir Waktu Monitoring' },
      { value: 'status', label: 'Status' },
      { value: 'status_populasi', label: 'Status Populasi' },
    ],
    detailIdKey: "soc_no",
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
    // deleteKey: "soc_no",
    // delete: "sostam/delete",
    pk_field: null,
    filter_api: {
      typegetdata: "all",
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
      {
        id: "status",
        label: "Program Lahan",
        methods: {
          list: false,
          detail: false,
          filter: {
            type: "select",
            setter: "status",
            main: true,
            option: {
              default_options: [
                {
                  name: "Petani",
                  code: "petani",
                },
                {
                  name: "Umum",
                  code: "umum",
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
        id: "target_areas_name",
        label: "Desa",
        methods: {
          list: false,
          detail: false,

          filter: {
            main: true,
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
        id: "target_areas_name",
        label: "Field Coordinator",
        methods: {
          list: false,
          detail: false,

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
        id: "farmers_name",
        label: "Nama Petani",
        methods: {
          list: true,
          detail: true,
        },
      },
      {
        id: "lahan_no",
        label: "No. Lahan",
        methods: {
          list: true,
          detail: true,
        },
      },
      {
        id: "bibit",
        label: "Bibit",
        methods: {
          list: true,
          detail: true,
        },
      },
      {
        id: "lahan_no",
        label: "Kayu",
        methods: {
          list: true,
          detail: true,
        },
      },
      {
        id: "lahan_no",
        label: "MPTS",
        methods: {
          list: true,
          detail: true,
        },
      },
      {
        id: "start_monitoring_period",
        label: "Awal Waktu Monitoring",
        methods: {
          list: {
            transform: "datetime",
          },
          detail: true,
        },
      },
      {
        id: "end_monitoring_period",
        label: "Akhir Waktu Monitoring",
        methods: {
          list: {
            transform: "datetime",
          },
          detail: true,
        },
      },
      {
        id: "is_validate",
        label: "Status",
        methods: {
          list: {
            type: "row-slot",
          },
          detail: true,
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
          detail: true,
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

    ],
  },
});
