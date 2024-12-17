export default {
  exportIds: [],
  refreshKey: 1,
  farmerEditKey: 1,
  farmerEditData: null,
  sostamCoordinateData: null,
  sostamDistributionData: null,
  exportLahanKey: 1,
  importSostamKey: 1,
  sostamCoordinateEditKey: 1,
  sostamDistributionEditKey: 1,
  config: {
    title: "Realisasi Tanam",
    globalFilter: {
      program_year: {
        setter: "program_year",
      },
    },
    detailIdKey: "soc_no",
    getter: "GetSocAllAdmin",
    // getterDataKey: 'data.result.data.data',
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
    delete: "sostam/delete",
    // delete_ext_payload: {
    //     delete_type: "hard_delete",
    //     project_modul: "purpose",
    // },
    deleteKey: "soc_no",
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
        id: "field_facilitators_name",
        label: "Field Facilitator",
        methods: {
          list: true,
          detail: true,
          filter: false,
        },
      },
      {
        id: "distribution_date",
        label: "Waktu Distribusi",
        methods: {
          list: {
            transform: "date",
          },
          detail: true,
          filter: {
            label: "Tanggal Monitoring",
            validation: ["required"],
            type: "daterange",
            col_size: 6,
            getter: "updated_at",
            setter: "distribution_date",
            icon: "calendar-edit",
            main: true,
          },
        },
      },
      {
        id: "soc_date",
        label: "Tanggal Sosialisasi",
        methods: {
          list: {
            transform: "date",
          },
          detail: true,
        },
      },
      {
        id: "program_year",
        label: "Tahun Program",
        methods: {
          list: {
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
            type: "row-slot",
          },
          detail: true,
          filter: {
            type: "select",
            setter: "status",
            main: true,
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
                  name: "Koordinat Terverifikasi",
                  code: 2,
                },
                {
                  name: "Koordinat Tidak Sesuai",
                  code: 3,
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
    ],
  },
};
