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
      id: "distribution_date",
      label: "Tanggal Distribusi",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "rel_implementor_allocation_seed_id",
      label: "Nama Implementer",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "ff_name",
      label: "Nama Field Facilitator",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "rel_implementor_allocation_seed_id",
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
      id: "location_distribution",
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
      id: "mu_name",
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
      id: "rel_location_nursery_id",
      label: "Lokasi Nursery",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false
      },
    },
    {
      id: "total_kayu",
      label: "Total Kayu",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false
      },
    },
    {
      id: "total_mpts",
      label: "Total MPTS",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false
      },
    },
    {
      id: "total_pupuk",
      label: "Total Pupuk",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false
      },
    },
    {
        id: "status_bast",
        label: "Status BAST",
        methods: {
          list: {
            view_data: "status_bast",
            class: {
              0: "badge bg-danger",
              1: "badge bg-warning",
              2: "badge bg-info",
              3: "badge bg-success",
            },
            transform: "distribution-status-bast",
          },
          detail: {
            view_data: "status_bast",
            class: {
              0: "badge bg-danger",
              1: "badge bg-warning",
              2: "badge bg-info",
              3: "badge bg-success",
            },
            transform: "distribution-status-bast",
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
            type: "date",
            col_size: 6,
            getter: "updated_at",
            setter: "distribution_date",
            icon: "calendar-edit",
            main: true,
          },
        },
      },
  ];
  