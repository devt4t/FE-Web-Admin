export default [
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
    // {
    //   id: "pic_lahan",
    //   label: "PIC Lahan",
    //   methods: {
    //     list: true,
    //     detail: true,
    //     create: false,
    //     update: false,
    //     filter: false
    //   },
    // },
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
      id: "is_verified",
      label: "Status Verifikasi Lubang Tanam",
      methods: {
        list: {
          view_data: "is_verified",
          class: {
            0: "badge bg-danger",
            1: "badge bg-danger",
            2: "badge bg-success",
          },
          transform: "general-land-planting-hole-status",
        },
        detail: {
          view_data: "is_verified",
          class: {
            0: "badge bg-info",
            1: "badge bg-danger",
            2: "badge bg-success",
          },
          transform: "general-land-planting-hole-status",
        },
        create: false,
        update: false,
        filter: false
      },
    },
  ];
  