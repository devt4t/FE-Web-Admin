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
        validation: ["required"],
        col_size: 6,
        view_data: "kabupaten_no",
        type: "select",
        getter: "new-utilities/kabupatens",
        setter: "kabupaten_no",
        option: {
          getterKey: 'data',
          list_pointer: {
            code: 'kabupaten_no',
            label: 'name',
            display: ['name', 'kabupaten_no'],
          },
        },
      },
      update: {
        validation: ["required"],
        col_size: 6,
        view_data: "kabupaten_no",
        type: "select",
        getter: "new-utilities/kabupatens",
        setter: "kabupaten_no",
        option: {
          getterKey: 'data',
          list_pointer: {
            code: 'kabupaten_no',
            label: 'name',
            display: ['name', 'kabupaten_no'],
          },
        },
      },
      filter: false,
    },
  },
];
