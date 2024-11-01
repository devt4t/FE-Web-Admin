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
      id: "region_code",
      label: "Kode Region",
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
      id: "name",
      label: "Nama Region",
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
      id: "active_status",
      label: "Status Aktif",
      methods: {
        list: true,
        detail: true,
        create: {
            type: "select",
            col_size: 6,
            validation: ["required"],
            option: {
              default_options: [
                {
                  name: "Tidak Aktif",
                  code: "0",
                },
                {
                  name: "Aktif",
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
          update: {
            type: "select",
            col_size: 6,
            validation: ["required"],
            option: {
              default_options: [
                {
                  name: "Tidak Aktif",
                  code: "0",
                },
                {
                  name: "Aktif",
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
        filter: false,
      },
    },
  ];
  