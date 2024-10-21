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
    label: "Nama Kecamatan",
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
    id: "kode_kecamatan",
    label: "Kode kecamatan",
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
    id: "kabupaten_no",
    label: "Kode Kabupaten",
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
    id: "provinces_name",
    label: "Nama Provinsi",
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
        getter: "new-utilities/provinces",
        setter: "province_code",
        param: {
          page: 1,
          per_page: 10,
        },
        option: {
          getterKey: "data",
          list_pointer: {
            code: "province_code",
            label: "name",
            display: ["name"],
          },
        },
      },
    },
  },
];
