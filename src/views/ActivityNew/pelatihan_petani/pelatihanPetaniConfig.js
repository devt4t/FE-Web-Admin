export default {
  // export: true,
  title: "Pelatihan Petani",
  getter: "farmer-training",
  filter_api: {
    typegetdata: "all",
  },
  // getterDataKey: "data.result",
  detail: "DetailFarmerTraining",
  detailIdKey: "training_no",
  detailKey: "data.result",
  delete: "a",
  deleteLabel: "id",
  deleteKey: "id",
  delete_ext_payload: {
    delete_type: "hard_delete",
  },
  deleteSoft: {
    payload: {
      delete_type: "soft_delete",
    },
  },
  pk_field: null,
  globalFilter: {
    program_year: {
      setter: "program_year",
    },
  },
  permission: {
    create: "pelatihan-petani-create",
    read: "pelatihan-petani-list",
    update: "pelatihan-petani-update",
    detail: "pelatihan-petani-detail",
    lookup: "pelatihan-petani-lookup",
    delete: "pelatihan-petani-delete",
  },
  fields: [
    {
      id: "training_no",
      label: "Training No",
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
      }
    },
    {
      id: "target_area",
      label: "Target Area",
      methods: {
        list: false,
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
      }
    },
    {
      id: "management_unit",
      label: "Managemen Unit",
      methods: {
        list: false,
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
      }
    },
    {
      id: "employees_name_um",
      label: "Unit Manager",
      methods: {
        list: true,
        detail: {
          view_data: "um_name"
        },
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
      }
    },
    {
      id: "desas_name",
      label: "Desa",
      methods: {
        list: true,
        detail: {
          view_data: "desa"
        },
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
      }
    },
    {
      id: "training_date",
      label: "Tanggal Training",
      methods: {
        list: {
          transform: 'date'
        },
        detail: {
          transform: 'date'
        },
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
      }
    },
    {
      id: "program_year",
      label: "Tahun Program",
      methods: {
        list: {
          class: "badge bg-primary"
        },
        detail: {
          class: "badge bg-primary"
        },
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
      }
    },
    {
      id: "users_name",
      label: "Dibuat Oleh",
      methods: {
        list: true,
        detail: {
          view_data: "users_name"
        },
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
      }
    },
    {
      id: "status",
      label: "Status",
      methods: {
        list: {
          transform: "status-verification",
          class: {
            1: "badge bg-success",
            0: "badge bg-danger",
          },
        },
        detail: {
          transform: "status-verification",
          class: {
            1: "badge bg-success",
            0: "badge bg-danger",
          },
        },
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
      }
    },
    {
      id: "materi_pelatihan_1",
      label: "Materi Pelatihan 1",
      methods: {
        list: false,
        detail: {
          view_data: "materi_1",
          show_if: "materi_pelatihan_1"
        },
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
      }
    },
    {
      id: "materi_pelatihan_2",
      label: "Materi Pelatihan 2",
      methods: {
        list: false,
        detail: {
          view_data: "materi_2",
          show_if: "materi_pelatihan_2"
        },
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
      }
    },
    {
      id: "materi_pelatihan_3",
      label: "Materi Pelatihan 3",
      methods: {
        list: false,
        detail: {
          view_data: "materi_3",
          show_if: "materi_pelatihan_3"
        },
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
      }
    },
    {
      id: "action",
      label: "Action",
      methods: {
        list: false,
        detail: {
          type: "slot",
        },
        create: false,
        update: false,
        filter: false,
      },
    },
  ]
}