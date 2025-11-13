// This Is Main Config For Every Planting Hole Survielliance Model
export default [
  {
    id: "ph_form_no",
    label: "Form No",
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
    id: "lahan_no",
    label: "Nomor Lahan",
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
    id: "project_purpose",
    label: "Tipe Penggunaan Project",
    methods: {
      list: {
        class: {
          'carbon': "badge bg-success",
          'non-carbon': "badge bg-warning",
          '-': "badge bg-danger",
        }
      },
      detail: {
        class: {
          'carbon': "badge bg-success",
          'non-carbon': "badge bg-warning",
          '-': "badge bg-danger",
        }

      },
      create: false,
      update: false,
      filter: false
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
        label: "Tanggal Distribusi",
        validation: ["required"],
        type: "daterange",
        col_size: 6,
        getter: "updated_at",
        setter: "distribution_date",
        icon: "calendar-edit",
        main: false,
      },
    },
  },
  {
    id: "ff_id",
    label: "Field Facilitator",
    methods: {
      list: {
        type: "row-slot"
      },
      detail: {
        view_data: "field_facilitators_name"
      },
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
      filter: {
        validation: ["required"],
        type: "select",
        col_size: 6,
        getter: "GetFFAllWeb_new",
        setter: "ff_no",
        param: {
          page: 1,
          per_page: 100,
        },
        option: {
          getterKey: "data",
          list_pointer: {
            code: "ff_no",
            label: "name",
            display: ["name", "ff_no"],
          },
        },
      },
    }
  },
  {
    id: "farmer_id",
    label: "Nama Petani",
    methods: {
      list: {
        type: "row-slot"
      },
      detail: {
        view_data: "farmers_name"
      },
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
    id: "lahans_mu_no",
    label: "Management Unit",
    methods: {
      list: false,
      detail: false,
      create: false,
      update: false,
      filter: {
        validation: ["required"],
        type: "select",
        col_size: 6,
        getter: "new-utilities/management-units",
        setter: "mu_no",
        param: {
          page: 1,
          per_page: 100,
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
    id: "lahans_target_area",
    label: "Target Area",
    methods: {
      list: false,
      detail: false,
      create: false,
      update: false,
      filter: {
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
          per_page: 100,
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
    id: "lahans_village",
    label: "Desa",
    methods: {
      list: false,
      detail: false,
      create: false,
      update: false,
      filter: {
        validation: ["required"],
        type: "select",
        col_size: 6,
        getter: "new-utilities/desas/ta_desas",
        setter: "village",
        form_param: {
          area_code: "target_area",
        },
        param: {
          page: 1,
          per_page: 100,
        },
        option: {
          getterKey: "data",
          list_pointer: {
            code: "kode_desa",
            label: "name",
            display: ["desas_name", 'program_year'],
          },
        },
      },
    },
  },
  {
    id: "total_holes",
    label: "Total Lubang",
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
    id: "counter_hole_standard",
    label: "Total Lubang Standard",
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
    id: "pohon_kayu",
    label: "Total Pohon Kayu",
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
    id: "pohon_mpts",
    label: "Total Pohon MPTS",
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
    id: "tanaman_bawah",
    label: "Total Crops",
    methods: {
      list: false,
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
    id: "start_planting_hole",
    label: "Tanggal Mulai Penilikan Lubang",
    methods: {
      list: {
        class: "badge bg-primary",
      },
      detail: {
        class: "badge bg-primary",
      },
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "end_planting_hole",
    label: "Tanggal Selesai Penilikan Lubang",
    methods: {
      list: {
        class: "badge bg-info",
      },
      detail: {
        class: "badge bg-info",
      },
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "is_validate",
    label: "Status Verifikasi",
    methods: {
      list: {
        view_data: "is_validate",
        class: {
          0: "badge bg-danger",
          1: "badge bg-success",
        },
        transform: "simple-status",
      },
      detail: {
        view_data: "is_validate",
        class: {
          0: "badge bg-danger",
          1: "badge bg-success",
        },
        transform: "simple-status",
      },
      create: false,
      update: false,
      filter: {
        type: "select",
        col_size: 6,
        validation: ["required"],
        option: {
          default_options: [
            {
              name: "Belum Terverifikasi",
              code: "0",
            },
            {
              name: "Terverifikasi",
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
    },
  },
  {
    id: "gambar3",
    label: "Status Adjustment",
    methods: {
      list: false,
      detail: {
        view_data: "gambar3",
        class: {
          'adjustment': "badge bg-danger",
          'non-adjustment': "badge bg-success",
        },
        transform: "adjustment-status",
      },
      create: false,
      update: false,
      filter: false,
    },
  },
  {
    id: "action",
    label: "Action",
    methods: {
      list: false,
      detail: {
        type: "slot",
      },
      create: false,
      update: false,
      filter: false,
    },
  },
];
