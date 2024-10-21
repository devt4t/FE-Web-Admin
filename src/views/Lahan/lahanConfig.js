export default {
  title: "Lahan",
  model_api: null,
  export: true,
  getter: "GetLahanAll_new",
  delete: "DeleteDataLahan_new",
  deleteKey: "lahan_no",
  delete_ext_payload: {
    delete_type: "hard_delete",
  },

  statistic: {
    statistic_key: "custom_count",
    transform_key: {
      total_data: {
        label: "Total Lahan",
        icon: "mdi-land-fields",
        transform: "ts",
      },
      unverified: {
        label: "Lahan Belum Terverifikasi",
        icon: "mdi-information",
        color: "warning",
        transform: "ts",
      },
      fc_complete_datas: {
        label: "Kelengkapan Data (FC)",
        icon: "mdi-check-circle",
        color: "primary",
        transform: "ts",
      },
      updated_gis: {
        label: "Polygon (GIS)",
        icon: "mdi-shape-polygon-plus",
        color: "info",
        transform: "ts",
      },
      fc_verif: {
        label: "Kelayakan Project (FC)",
        icon: "mdi-check-circle",
        color: "primary",
        transform: "ts",
      },
      um_verif: {
        label: "Eligibilitas (UM)",
        icon: "mdi-check-circle",
        color: "success",
        transform: "ts",
      },
    },
  },
  globalFilter: {
    program_year: {
      setter: "program_year",
    },
  },
  pk_field: null,
  permission: {
    create: "farmer-create",
    read: "farmer-list",
    update: "farmer-update",
    detail: "farmer-detail",
    lookup: "farmer-lookup",
    delete: "farmer-delete",
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
      id: "lahan_id",
      label: "Lahan",
      methods: {
        list: {
          sticky: true,
          type: "row-slot",
        },
      },
    },
    {
      id: "project_id",
      label: "Project",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },
    {
      id: "lahan_size",
      label: "Luas Lahan",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },

    {
      id: "mu_id",
      label: "Management Unit",
      methods: {
        filter: {
          validation: ["required"],
          type: "select",
          col_size: 6,
          getter: "GetManagementUnitAdmin",
          setter: "mu_no",
          main: true,
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
    // {
    //   id: "planting_area",
    //   label: "Luas Area Tanam",
    //   methods: {
    //     list: {
    //       type: "row-slot",
    //     },
    //   },
    // },
    {
      id: "ff_id",
      label: "Nama FF",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },
    {
      id: "farmer_id",
      label: "Nama Petani",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },
    // {
    //   id: "farmer_nik",
    //   label: "NIK Petani",
    //   methods: {
    //     list: true,
    //   },
    // },

    {
      id: "target_area",
      label: "Target Area",
      methods: {
        list: {
          type: "row-slot",
        },
        filter: {
          type: "select",
          getter: "GetTA_new",
          setter: "area_code",
          form_param: {
            mu_no: "mu_no",
          },
          param: {
            program_year: "current_program_year",
          },
          main: true,
          option: {
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
      id: "village",
      label: "Desa",
      methods: {
        list: {
          view_data: "desas_name",
        },
      },
    },
    {
      id: "program_year",
      label: "Tahun Bergabung",
      methods: {
        list: {
          header_class: "text-center",
          type: "row-slot",
        },
      },
    },
    {
      id: "planting_pattern",
      label: "Pola Tanam",
      methods: {
        list: {
          class: "min-w-150px",
          view_data: "opsi_pola_tanam",
        },
      },
    },
    {
      id: "cover",
      label: "Tutupan",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },
    {
      id: "tree",
      label: "Jenis Bibit",
      methods: {
        list: {
          show: false,
          type: "row-slot",
        },
      },
    },
    {
      id: "total_wood",
      label: "Kayu",
      methods: {
        list: {
          type: "row-slot",
          // view_data: "pohon_kayu",
          transform: "ts",
          class: "text-center d-block",
        },
      },
    },
    {
      id: "total_mpts",
      label: "MPTS",
      methods: {
        list: {
          view_data: "pohon_mpts",
          transform: "ts",
          class: "text-center d-block",
        },
      },
    },
    {
      id: "total",
      label: "Kayu + MPTS",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },

    {
      id: "fc_complete_data",
      label: "Kelengkapan Data",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },

    {
      id: 'project_no',
      label: 'Project',
      methods: {
        
        filter: {
          type: "select",
          getter: "GetProjectAllAdmin",
          setter: "project_no",
          // form_param: {
          //   mu_no: "mu_no",
          // },
          param: {
            // program_year: "current_program_year",
            project_filter: true,
          },
          ext_param: {
            project_filter: true
          },
          main: true,
          option: {
            list_pointer: {
              code: "project_no",
              label: "project_name",
              display: ["project_name"],
            },
          },
        },
      }
    },

    {
      id: "status",
      label: "Status",
      methods: {
        list: {
          header_class: "text-center",
          type: "row-slot",
        },
        detail: false,
        filter: {
          type: "select",
          main: true,
          setter: "approve",
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
                name: "Diverifikasi FC",
                code: 1,
              },
              {
                name: "Terverifikasi",
                code: 2,
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

    {
      id: "updated_gis",
      label: "Verifikasi GIS",
      methods: {
        filter: {
          type: "select",
          main: true,
          setter: "updated_gis",
          option: {
            default_options: [
              {
                name: "Semua Status",
                code: null,
              },
              {
                name: "Belum",
                code: "belum",
              },
              {
                name: "Sudah",
                code: "Sudah",
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
    //   id: "fc_complete_data",
    //   label: "Kelengkapan Data",
    //   methods: {
    //     filter: {
    //       type: "select",
    //       main: true,
    //       setter: "fc_complete_data",
    //       option: {
    //         default_options: [
    //           {
    //             name: "Semua ",
    //             code: null,
    //           },
    //           {
    //             name: "Lengkap",
    //             code: 1,
    //           },
    //           {
    //             name: "Belum Lengkap",
    //             code: "0",
    //           },
    //         ],
    //         list_pointer: {
    //           code: "code",
    //           label: "name",
    //           display: ["name"],
    //         },
    //       },
    //     },
    //   },
    // },
    {
      id: "created_at",
      label: "Tgl. Dibuat",
      methods: {
        list: {
          header_class: "text-center",
          class: "text-no-wrap d-block text-center",
          transform: "datetime",
        },
      },
    },
  ],
};
