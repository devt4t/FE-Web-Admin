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
    id: "monitoring_no",
    label: "Monitoring_no",
    methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
    },
    },
    {
      id: "mou_no",
      label: "MoU No",
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
      label: "Lahan No",
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
      id: "provinces_name",
      label: "Provinsi",
      methods: {
        list: false,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "kabupatens_name",
      label: "Kota/Kabupaten",
      methods: {
        list: false,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "kecamatans_name",
      label: "Kecamatan",
      methods: {
        list: false,
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
        list: false,
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
        filter: false
      },
    },
    {
      id: "planting_date",
      label: "Tanggal Tanam",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false
      },
    },
    {
      id: "lahan_umums_pic_lahan",
      label: "",
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
      label: "",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false
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
              1: "badge bg-success",
            },
            transform: "simple-status",
          },
          detail: {
            view_data: "is_verified",
            class: {
              0: "badge bg-danger",
              1: "badge bg-success",
            },
            transform: "simple-status",
          },
          create: false,
          update: false,
          filter: false
        },
    },
]