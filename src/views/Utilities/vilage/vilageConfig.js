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
    id: "name",
    label: "Nama Desa",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "text",
        validation: ["required"],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: ["required"],
        col_size: 6,
      },
      filter: false,
    },
  },
  {
    id: "kode_desa",
    label: "Kode Desa",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      filter: false,
    },
  },
  {
    id: "kabupatens_name",
    label: "Nama Kabupaten",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      filter: false,
    },
  },
  {
    id: "kabupatens_province_code",
    label: "Kode Kab. Provinsi",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
    },
  },
  {
    id: "kecamatans_name",
    label: "Nama Kecamatan",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      filter: {
        validation: ["required"],
        type: "select",
        col_size: 6,
        main: true,
        getter: "new-utilities/kecamatans",
        setter: "kode_kecamatan",
        param: {
          page: 1,
          per_page: 10,
        },
        option: {
          getterKey: "data",
          list_pointer: {
            code: "kode_kecamatan",
            label: "name",
            display: ["name"],
          },
        },
      },
    },
  },
  {
    id: "kode_kecamatan",
    label: "Kode Kecamatan",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
    },
  },
  {
    id: "post_code",
    label: "Kode POS",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      filter: false,
    },
  },
  {
    id: "mu_no_from_ta_pivot",
    label: "Managemen Unit",
    methods: {
      list: {
        view_data: "mu_name",
        transform: "no-empty"
      },
      detail: {
        view_data: "mu_name",
        transform: "no-empty"
      },
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "select",
        col_size: 6,
        validation: ["required"],
        setter: "mu_no",
        getter: "new-utilities/management-units",
        param: {
          active: '1',
          limit: '10',
          offset: '0'
        },
        option: {
          getter: "id",
          default_label: "mu_name",
          list_pointer: {
            code: "mu_no",
            label: "name",
            display: ["name"],
          },
        },
      },
      filter: {
        validation: ["required"],
        type: "select",
        col_size: 6,
        main: true,
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
            display: ["name"],
          },
        },
      },
    },
  },
  {
    id: "ta_from_pivot",
    label: "Target Area",
    methods: {
      list: {
        view_data: "ta_from_pivot_name",
        transform: "no-empty"
      },
      detail: {
        view_data: "ta_from_pivot_name",
        transform: "no-empty"
      },
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "select",
        col_size: 6,
        validation: ["required"],
        setter: "area_code",
        getter: "new-utilities/target-areas",
        param: {
          active: '1',
          limit: '10',
          offset: '0'
        },
        option: {
          getter: "id",
          default_label: "ta_from_pivot_name",
          list_pointer: {
            code: "area_code",
            label: "name",
            display: ["name"],
          },
        },
      },
      filter: {
        validation: ["required"],
        type: "select",
        col_size: 6,
        main: true,
        getter: "new-utilities/target-areas",
        setter: "kode_ta",
        param: {
          page: 1,
          per_page: 10,
        },
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
    id: "project_name",
    label: "Nama Project",
    methods: {
      list: { transform: "no-empty" },
      detail: { transform: "no-empty" },
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
    },
  },
  {
    id: "program_year_from_pivot",
    label: "Tahun Program",
    methods: {
      list: true,
      detail: { transform: "no-empty" },
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
      update: {
        type: "text",
        col_size: 6,
        validation: ["required"],
      },
    },
  },
  {
    id: "status",
    label: "Status",
    methods: {
      list: { transform: "active", },
      detail: { transform: "active" },
      create: {
        type: "select",
        col_size: 6,
        validation: ["required"],
        option: {
          default_options: [
            {
              name: "Tidak Aktif",
              code: "0",
            },
            {
              name: "Aktif",
              code: "1",
            }
          ],
          list_pointer: {
            code: "code",
            label: "name",
            display: ["name"],
          },
        },
      },
      update: {
        type: "select",
        col_size: 6,
        validation: ["required"],
        option: {
          default_options: [
            {
              name: "Tidak Aktif",
              code: "0",
            },
            {
              name: "Aktif",
              code: "1",
            }
          ],
          list_pointer: {
            code: "code",
            label: "name",
            display: ["name"],
          },
        },
      },
      filter: false,
    },
  },
  {
    id: "scooping_visits_potential_status",
    label: "Potential Status",
    methods: {
      list: {
        view_data: "scooping_visits_potential_status",
        class: {
          1: "badge bg-warning",
          2: "badge bg-info",
          3: "badge bg-info",
          4: "badge bg-info",
          0: "badge bg-danger",
        },
        transform: "potential-vilage",
      },
      detail: {
        view_data: "scooping_visits_potential_status",
        class: {
          1: "badge bg-warning",
          2: "badge bg-info",
          3: "badge bg-info",
          4: "badge bg-info",
          0: "badge bg-danger",
        },
        transform: "potential-vilage",
      },
      create: {
        type: "select",
        col_size: 6,
        validation: ["required"],
        option: {
          default_options: [
            {
              name: "Tidak Potensial",
              code: "0",
            },
            {
              name: "Belum Pengecekan",
              code: "1",
            },
            {
              name: "Potensial Carbon",
              code: "2",
            },
            {
              name: "Potensial Non-Carbon",
              code: "3",
            },
            {
              name: "Potensial Carbon & Non-Carbon",
              code: "4",
            },
          ],
          list_pointer: {
            code: "code",
            label: "name",
            display: ["name"],
          },
        },
      },
      update: {
        type: "select",
        col_size: 6,
        validation: ["required"],
        option: {
          default_options: [
            {
              name: "Tidak Potensial",
              code: "0",
            },
            {
              name: "Belum Pengecekan",
              code: "1",
            },
            {
              name: "Potensial Carbon",
              code: "2",
            },
            {
              name: "Potensial Non-Carbon",
              code: "3",
            },
            {
              name: "Potensial Carbon & Non-Carbon",
              code: "4",
            },
          ],
          list_pointer: {
            code: "code",
            label: "name",
            display: ["name"],
          },
        },
      },
      filter: {
        validation: ["required"],
        type: "select",
        col_size: 6,
        main: true,
        setter: "potential_status",
        param: {
          page: 1,
          per_page: 10,
        },
        option: {
          default_options: [
            {
              name: "Semua Status",
              code: null,
            },
            {
              name: "Tidak Potensial",
              code: "0",
            },
            {
              name: "Belum Pengecekan",
              code: "1",
            },
            {
              name: "Potensial Carbon",
              code: "2",
            },
            {
              name: "Potensial Non-Carbon",
              code: "3",
            },
            {
              name: "Potensial Carbon & Non-Carbon",
              code: "4",
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
];
