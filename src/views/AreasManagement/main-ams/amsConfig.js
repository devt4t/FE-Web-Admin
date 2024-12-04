export default [
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
      id: "am_no",
      label: "Kode Area Management",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "regions_name",
      label: "Region",
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
        filter: false
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
        filter: false
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
        filter: false
      },
    },
    {
      id: "employees_name",
      label: "User",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false
      },
    },
    {
      id: "active_status",
      label: "Status Aktif",
      methods: {
        list: {
          view_data: "active_status",
          class: {
            0: "badge bg-danger",
            1: "badge bg-success",
          },
          transform: "active-status",
        },
        detail: {
          view_data: "active_status",
          class: {
            0: "badge bg-danger",
            1: "badge bg-success",
          },
          transform: "active-status",
        },
        create: false,
        update: false,
        filter: false
      },
    },
    {
      id: "employee_positions_name",
      label: "Posisi",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false
      },
    },
    {
      id: "program_year",
      label: "Tahun Program",
      methods: {
        detail: false,
        create: {
          validation: ["required"],
          type: "select",
          col_size: 6,
          setter: "program_year",
          option: {
            list_pointer: {
              code: "code",
              label: "label",
              display: ["label"],
            },
            default_options: [
              {
                code: "2020",
                label: "2020",
              },
              {
                code: "2021",
                label: "2021",
              },
              {
                code: "2022",
                label: "2022",
              },
              {
                code: "2023",
                label: "2023",
              },
              {
                code: "2024",
                label: "2024",
              },
              {
                code: "2025",
                label: "2025",
              },
            ],
          },
        },
        filter: false,
      },
    },
    {
      id: "region",
      label: "Region",
      methods: {
        list: false,
        detail: false,
        create: {
          validation: ["required"],
          col_size: 6,
          view_data: "region_code",
          type: "select",
          getter: "new-utilities/region/list",
          setter: "region",
          option: {
            getterKey: "result",
            getter: "region_code",
            list_pointer: {
              code: "region_code",
              label: "name",
              display: ["name"],
            },
          },
        },
        update: {
          validation: ["required"],
          col_size: 6,
          view_data: "region_code",
          type: "select",
          getter: "new-utilities/region/list",
          setter: "region_code",
          option: {
            getterKey: "result",
            getter: "region_code",
            list_pointer: {
              code: "region_code",
              label: "name",
              display: ["name"],
            },
          },
        },
        filter: {
          validation: ["required"],
          col_size: 6,
          type: "select",
          getter: "new-utilities/region/list",
          icon: "location",
          main: true,
          option: {
            getterKey: "result",
            list_pointer: {
              code: "region_code",
              label: "name",
              display: ["name"],
            },
          },
        }
      },
    },
    {
      id: "employee_position",
      label: "Posisi",
      methods: {
        create: {
          validation: ["required"],
          col_size: 6,
          view_data: "employee_position",
          type: "select",
          getter: "GetJobPosition",
          setter: "employee_position",
          option: {
            getterKey: "data.result.data",
            getter: "employee_position",
            list_pointer: {
              code: "position_no",
              label: "name",
              display: ["name"],
            },
          },
        },
        filter: false,
      },
    },
    {
      id: "mu_no",
      label: "Management Units",
      methods: {
        list: false,
        detail: false,
        create: {
          // validation: ["required"],
          col_size: 6,
          view_data: "mu_no",
          type: "select",
          getter: "new-utilities/management-units",
          setter: "mu_no",
          option: {
            getterKey: "data",
            getter: "mu_no",
            list_pointer: {
              code: "mu_no",
              label: "name",
              display: ["name"],
            },
          },
        },
        update: {
          // validation: ["required"],
          col_size: 6,
          view_data: "mu_no",
          type: "select",
          getter: "new-utilities/management-units",
          setter: "mu_no",
          option: {
            getterKey: "data",
            getter: "mu_no",
            list_pointer: {
              code: "mu_no",
              label: "name",
              display: ["name"],
            },
          },
        },
        filter: {
          // validation: ["required"],
          col_size: 6,
          type: "select",
          getter: "new-utilities/management-units",
          setter: "mu_no",
          icon: "location",
          main: true,
          option: {
            getterKey: "data",
            list_pointer: {
              code: "mu_no",
              label: "name",
              display: ["name"],
            },
          },
        }
      },
    },
    {
      id: "target_area",
      label: "Target Area",
      methods: {
        create: {
          // validation: ["required"],
          col_size: 6,
          view_data: "area_code",
          type: "select",
          getter: "new-utilities/target-areas",
          setter: "target_area",
          option: {
            getterKey: "data",
            getter: "area_code",
            list_pointer: {
              code: "area_code",
              label: "name",
              display: ["name"],
            },
          },
        },
        filter: {
          type: "select",
          getter: "new-utilities/target-areas",
          setter: "area_code",
          form_param: {
            mu_no: "mu_no",
          },
          param: {
            program_year: "current_program_year",
          },
          main: true,
          option: {
            getterKey: "data",
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
        create: {
          // validation: ["required"],
          col_size: 6,
          view_data: "kode_desa",
          type: "select",
          getter: "GetDesaByKecamatanTA_new",
          param: {
            program_year: "2024",
          },
          setter: "village",
          option: {
            getterKey: "data",
            getter: "kode_desa",
            list_pointer: {
              code: "kode_desa",
              label: "name",
              display: ["name"],
            },
          },
        },
        filter: {
          type: "select",
          getter: "GetDesaByKecamatanTA_new",
          setter: "kode_desa",
          form_param: {
            ta_no: "area_code",
          },
          param: {
            program_year: "current_program_year",
          },
          main: true,
          option: {
            getterKey: "data",
            list_pointer: {
              code: "kode_desa",
              label: "name",
              display: ["name"],
            },
          },
        },
      },
    },
    
    {
      id: "user_id",
      label: "Assign Kepada: ",
      methods: {
        create: {
          validation: ["required"],
          col_size: 6,
          view_data: "user_id",
          type: "select",
          getter: "getEmployeeList_new",
          setter: "user_id",
          option: {
            getterKey: "data",
            getter: "user_id",
            list_pointer: {
              code: "nik",
              label: "name",
              display: ["name"],
            },
          },
        },
        filter: false,
      },
    },
  ];
  