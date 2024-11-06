// This Is Main Config For Every Planting Hole Survielliance Model
export default [
    {
      id: "ph_form_no",
      label: "Form No",
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
      id: "lahan_no",
      label: "Nomor Lahan",
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
      id: "project_purpose",
      label: "Tipe Penggunaan Project",
      methods: {
        list: {
          class:{
            'carbon': "badge bg-success",  
            'non-carbon': "badge bg-warning",
            '-': "badge bg-danger",
          }
        },
        detail: {
          class:{
            'carbon': "badge bg-success",  
            'non-carbon': "badge bg-warning",
            '-': "badge bg-danger",
          }
        },
        create: false,
          update: false,
        filter: false
      },
    },
    {
      id: "field_facilitators_name",
      label: "Nama FF",
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
      id: "farmers_name",
      label: "Nama Petani",
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
      id: "total_holes",
      label: "Total Lubang",
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
      id: "counter_hole_standard",
      label: "Total Lubang Standard",
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
      id: "pohon_kayu",
      label: "Total Pohon Kayu",
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
      id: "pohon_mpts",
      label: "Total Pohon MPTS",
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
      id: "tanaman_bawah",
      label: "Total Crops",
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
      id: "start_planting_hole",
      label: "Tanggal Mulai Penilikan Lubang",
      methods: {
        list: {
          class: "badge bg-primary",  
        },
        detail: {
          class:  "badge bg-primary",
        },
        create: false,
          update: false,
        filter: false
      },
    },
    {
      id: "end_planting_hole",
      label: "Tanggal Selesai Penilikan Lubang",
      methods: {
        list: {
          class: "badge bg-info",  
        },
        detail: {
          class:  "badge bg-info",
        },
        create: false,
          update: false,
        filter: false
      },
    },
    {
      id: "is_validate",
      label: "Status Verifikasi",
      methods: {
        list: {
          view_data: "is_validate",
          class: {
            0: "badge bg-danger",
            1: "badge bg-success",
          },
          transform: "simple-status",
        },
        detail: {
          view_data: "is_validate",
          class: {
            0: "badge bg-danger",
            1: "badge bg-success",
          },
          transform: "simple-status",
        },
        create: false,
        update: false,
        filter: {
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
      },
    },
  ];
  