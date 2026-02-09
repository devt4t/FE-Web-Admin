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
    id: "employees_name",
    label: "PIC T4T",
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
    label: "Nama Implementor",
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
    label: "Lokasi Distribusi",
    methods: {
      list: true,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "pic_lahan",
    label: "PIC Lahan",
    methods: {
      list: true,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "ktp_no",
    label: "KTP PIC Lahan",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "luas_lahan",
    label: "Luas Lahan",
    methods: {
      list: true,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "luas_tanam",
    label: "Luas Tanam",
    methods: {
      list: true,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "pattern_planting",
    label: "Pola Tanam",
    methods: {
      list: true,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "project_no",
    label: "Projek",
    methods: {
      list: false,
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
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "goals",
    label: "Tujuan Penanaman",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "access_lahan",
    label: "Akses Transportasi",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "jarak_lahan",
    label: "Jarak Lahan",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "status",
    label: "Status Pemeliharaan",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "coordinate",
    label: "Koordinat Lahan",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "planting_hole_date",
    label: "Tanggal Pembuatan Lubang Tanam",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "total_holes",
    label: "Total Lubang",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "counter_hole_standard",
    label: "Total Lubang Standard",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "distribution_date",
    label: "Tanggal Distribusi",
    methods: {
      list: false,
      detail: true,
      create: false,
      update: false,
      filter: false
    },
  },
  {
    id: "planting_realization_date",
    label: "Tanggal Penanaman",
    methods: {
      list: false,
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
  {
    id: "total_holes",
    label: "Status Lubang Tanam",
    methods: {
      list: {
        type: 'row-slot'
      },
      detail: {
        view_data: "total_holes",
        type: 'slot'
      }
    },
  },
  {
    id: "scooping_visits_data_no",
    label: "Status Desa",
    methods: {
      list: {
        type: 'row-slot'
      },
      detail: {
        view_data: "scooping_visits_data_no",
        type: 'slot'
      }
    },
  },
];
