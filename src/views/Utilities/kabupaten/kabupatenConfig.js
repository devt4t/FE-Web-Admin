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
    label: "Nama Kab/Kota",
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
    id: "kab_code",
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
    id: "kabupaten_no",
    label: "No. Kabupaten",
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
    id: "provinces_name",
    label: "Nama Provinsi",
    methods: {
      list: true,
      detail: true,
      create: {
        type: "row-slot",
        setter: "province_code",
        col_size: 6,
      },
      update: {
        type: "row-slot",
        setter: "province_code",
        col_size: 6,
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
          per_page: 100,
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
  {
    id: "province_code",
    label: "Kode Provinsi",
    methods: {
      list: true,
      detail: true,
      create: false,
      update: false,
    },
  }
];
