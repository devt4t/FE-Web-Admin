import { reactive } from "vue"

export default reactive({
  // export: true,
  title: "Lahan Barcode History",
  getter: "lahan/generate-barcode/list",
  getterDataKey: "result",
  totalDataKey: 'total',
  pk_field: null,
  globalFilter: {
  },
  permission: {
    create: "lahan-create",
    read: "lahan-list",
    update: "lahan-update",
    detail: "lahan-detail",
    lookup: "lahan-lookup",
    delete: "lahan-delete",
  },
  slave: [],
  fields: [
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
      id: "history_lahan",
      label: "Lahan History Range",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },
    {
      id: "lahan_amount",
      label: "Jumlah Data Lahan",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },
    {
      id: "is_printed_qty",
      label: "Jumlah Export",
      methods: {
        list: true,
      },
    },
    {
      id: "employees_name_printer",
      label: "Terakhir Di Export Oleh",
      methods: {
        list: true,
      },
    },
    {
      id: "is_printed_at",
      label: "Waktu Terakhir Di Export",
      methods: {
        list: true,
      },
    },
    {
      id: "description",
      label: "Deskripsi",
      methods: {
        list: {
          type: "row-slot",
        },
      },
    },
    {
      id: "employees_name_generator",
      label: "Digenerate Oleh",
      methods: {
        list: true,
      },
    },
    {
      id: "created_at",
      label: "Waktu Generate",
      methods: {
        list: true,
      },
    },
  ],
});
