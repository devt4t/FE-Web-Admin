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
    id: "nik",
    label: "ID Karyawan",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "text",
        col_size: 6,
        validation: ["required"],
        separator: "DATA EMPLOYEE",
      },
      update: {
        type: "text",
        col_size: 6,
        validation: ["required"],
        separator: "DATA EMPLOYEE",
        disabled: true,
      },
      filter: false,
    },
  },
  {
    id: "name",
    label: "Nama",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "text",
        validation: ["required"],
        col_size: 6,
        separator: "DATA DIRI",
      },
      update: {
        type: "text",
        validation: ["required"],
        col_size: 6,
        separator: "DATA DIRI",
      },
      filter: false,
    },
  },
  {
    id: "alias",
    label: "Nama Alias",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },
  {
    id: "ktp_no",
    label: "No. KTP",
    methods: {
      list: true,
      detail: true,
      create: {
        validation: ["required", "digits:16"],
        type: "text",
        col_size: 6,
      },
      update: {
        validation: ["required", "digits:16"],
        type: "text",
        col_size: 6,
      },
      filter: false,
    },
  },
  {
    id: "emp_position",
    label: "Position",
    methods: {
      list: {
        view_data: "employee_positions_name",
      },
      detail: {
        view_data: "employee_positions_name",
      },
      create: {
        validation: ["required"],
        col_size: 6,
        view_data: "position_no",
        type: "select",
        getter: "GetJobPosition",
        setter: "position_no",
        option: {
          getterKey: "data.result.data",
          getter: "position_no",
          list_pointer: {
            code: "position_no",
            label: "name",
            display: ["name"],
          },
        },
      },
      update: {
        validation: ["required"],
        col_size: 6,
        view_data: "position_no",
        type: "select",
        getter: "GetJobPosition",
        setter: "position_no",
        option: {
          getter: "position_no",
          getterKey: "data.result.data",
          default_label: "employee_positions_name",
          list_pointer: {
            code: "position_no",
            label: "name",
            display: ["name"],
          },
        },
      },
      filter: {
        validation: ["required"],
        col_size: 6,
        type: "select",
        getter: "GetJobPosition",
        setter: "position_no",
        icon: "account-star",
        main: true,
        option: {
          getterKey: "data.result.data",
          list_pointer: {
            code: "position_no",
            label: "name",
            display: ["name"],
          },
        },
      },
    },
  },
  {
    id: "birthplace",
    label: "Tempat Lahir",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "birthday",
    label: "Tanggal Lahir",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "date",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "date",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "blood_type",
    label: "Golongan Darah",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "select",
        validation: ["required"],
        col_size: 6,
        option: {
          default_options: [
            {
              label: "-",
              code: "-",
            },
            {
              label: "O",
              code: "O",
            },
            {
              label: "A",
              code: "A",
            },
            {
              label: "B",
              code: "B",
            },
            {
              label: "AB",
              code: "AB",
            },
          ],
          list_pointer: {
            label: "label",
            code: "code",
            display: ["label"],
          },
        },
      },
      update: {
        type: "select",
        validation: ["required"],
        col_size: 6,
        option: {
          default_options: [
            {
              label: "-",
              code: "-",
            },
            {
              label: "O",
              code: "O",
            },
            {
              label: "A",
              code: "A",
            },
            {
              label: "B",
              code: "B",
            },
            {
              label: "AB",
              code: "AB",
            },
          ],
          list_pointer: {
            label: "label",
            code: "code",
            display: ["label"],
          },
        },
      },
      filter: false,
    },
  },

  {
    id: "religion",
    label: "Agama",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "select",
        validation: ["required"],
        col_size: 6,
        option: {
          default_options: [
            {
              label: "-",
              code: "-",
            },
            {
              label: "Islam",
              code: "islam",
            },
            {
              label: "Kristen",
              code: "kristen",
            },
            {
              label: "Khatolik",
              code: "khatolik",
            },
            {
              label: "Hindu",
              code: "hindu",
            },
            {
              label: "Budha",
              code: "budha",
            },
          ],
          list_pointer: {
            label: "label",
            code: "code",
            display: ["label"],
          },
        },
      },
      update: {
        type: "select",
        validation: ["required"],
        col_size: 6,
        option: {
          default_options: [
            {
              label: "-",
              code: "-",
            },
            {
              label: "Islam",
              code: "islam",
            },
            {
              label: "Kristen",
              code: "kristen",
            },
            {
              label: "Khatolik",
              code: "khatolik",
            },
            {
              label: "Hindu",
              code: "hindu",
            },
            {
              label: "Budha",
              code: "budha",
            },
          ],
          list_pointer: {
            label: "label",
            code: "code",
            display: ["label"],
          },
        },
      },
      filter: false,
    },
  },

  {
    id: "gender",
    label: "Jenis Kelamin",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "select",
        validation: ["required"],
        col_size: 6,
        option: {
          default_options: [
            {
              label: "Laki - Laki",
              code: "male",
            },
            {
              label: "Perempuan",
              code: "female",
            },
          ],
          list_pointer: {
            label: "label",
            code: "code",
            display: ["label"],
          },
        },
      },
      update: {
        type: "select",
        validation: ["required"],
        col_size: 6,
        option: {
          default_options: [
            {
              label: "Laki - Laki",
              code: "male",
            },
            {
              label: "Perempuan",
              code: "female",
            },
          ],
          list_pointer: {
            label: "label",
            code: "code",
            display: ["label"],
          },
        },
      },
      filter: false,
    },
  },

  {
    id: "marrital",
    label: "Status Perkawinan",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "select",
        validation: ["required"],
        col_size: 6,
        option: {
          default_options: [
            {
              label: "-",
              code: "-",
            },
            {
              label: "Kawin",
              code: "KAWIN",
            },
            {
              label: "Belum Kawin",
              code: "BELUM KAWIN",
            },
            {
              label: "Janda",
              code: "JANDA",
            },
            {
              label: "Duda",
              code: "DUDA",
            },
          ],
          list_pointer: {
            label: "label",
            code: "code",
            display: ["label"],
          },
        },
      },
      update: {
        type: "select",
        validation: ["required"],
        col_size: 6,
        option: {
          default_options: [
            {
              label: "-",
              code: "-",
            },
            {
              label: "Kawin",
              code: "KAWIN",
            },
            {
              label: "Belum Kawin",
              code: "BELUM KAWIN",
            },
            {
              label: "Janda",
              code: "JANDA",
            },
            {
              label: "Duda",
              code: "DUDA",
            },
          ],
          list_pointer: {
            label: "label",
            code: "code",
            display: ["label"],
          },
        },
      },
      filter: false,
    },
  },

  {
    id: "phone",
    label: "No HP",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: ["required", "phone"],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: ["required", "phone"],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "email",
    label: "Email",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: ["required", "email"],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: ["required", "email"],
        col_size: 6,
        disabled: true,
      },
      filter: false,
    },
  },

  {
    id: "npwp",
    label: "NPWP",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "bpjs_kesehatan_no",
    label: "No. BPJS Kesehatan",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "bpjs_tenagakerja_no",
    label: "No. BPJS Ketenagakerjaan ",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "address",
    label: "Address",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "textarea",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "textarea",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "village",
    label: "Desa",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: false,
      filter: false,
    },
  },

  {
    id: "zip_code",
    label: "Kode Pos",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: ["digits:5"],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: ["digits:5"],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "kecamatan",
    label: "Kecamatan",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },
  {
    id: "city",
    label: "Kota",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "province",
    label: "Provinsi",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },

  {
    id: "bank_account",
    label: "Akun Bank",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
        separator: "Akun Bank",
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
        separator: "Akun Bank",
      },
      filter: false,
    },
  },
  {
    id: "bank_name",
    label: "Nama Bank",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },
  {
    id: "bank_branch",
    label: "Branch Bank",
    methods: {
      list: false,
      detail: true,
      create: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      update: {
        type: "text",
        validation: [],
        col_size: 6,
      },
      filter: false,
    },
  },
  {
    id: "job_status",
    label: "Status",
    methods: {
      list: {
        view_data: "job_status",
        header_class: "text-center",
        class: {
          Training: "badge bg-info",
          Active: "badge bg-success",
        },
        // transform: "status-potential",
      },
      detail: true,
      create: false,
      update: false,
    },
  },
];
