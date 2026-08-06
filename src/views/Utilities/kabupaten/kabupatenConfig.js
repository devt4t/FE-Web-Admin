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
        getter: 'new-utilities/provinces',
        type: "select",
        setter: "province_code",
        view_data: "province_code",
        col_size: 6,
        option: {
          getterKey: "data",
          list_pointer: {
            code: "province_code",
            label: "name",
            display: ["name"],
          },
        },
      },
      update: {
        getter: "new-utilities/provinces",
        type: "select",
        setter: "province_code",
        view_data: "province_code",
        col_size: 6,
        option: {
          getterKey: "data",
          getter: "province_code",
          default_label: "provinces_name",
          list_pointer: {
            code: "province_code",
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
