import { reactive } from "vue"

export default reactive({
  title: "Monitoring Populate 1 - Lahan Umum",
  getter: "general-land/populate-monitoring/1-to-2/list",
  getterDataKey: "result",
  totalDataKey: 'total',
  pk_field: null,
  globalFilter: {
    program_year: {
      setter: "program_year",
    },
  },
  permission: {
    create: "lahan-umum-create",
    read: "lahan-umum-list",
    update: "lahan-umum-update",
    detail: "lahan-umum-detail",
    lookup: "lahan-umum-lookup",
    delete: "lahan-umum-delete",
  },
  slave: [],
  fields: [
    {
      id: "populate_no",
      label: "Kode Populasi",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "monitoring_no",
      label: "Kode Realisasi Tanam",
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
      label: "Nomor Lahan",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
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
      id: "managementunits_name",
      label: "Management Unit",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "mu_no",
      label: "Management Unit",
      methods: {
        filter: {
          main: true,
          validation: ["required"],
          type: "select",
          col_size: 6,
          getter: "new-utilities/management-units",
          setter: "mu_no",
          param: {
            page: 1,
            per_page: 10,
          },
          option: {
            getterKey: "data",
            list_pointer: {
              code: "mu_no",
              label: "name",
              display: ["name", "mu_no"],
            },
          },
        },
      },
    },
    {
      id: "lahan_umums_pic_lahan",
      label: "PIC Lahan Umum",
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
      label: "Nama Employee",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "program_year",
      label: "Tahun Program",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "planting_date",
      label: "Tanggal Tanam",
      methods: {
        list: {
          transform: "date",
          class: " badge bg-primary",
        },
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "sampling",
      label: "Metode Sampling",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "assigned_to",
      label: "FF Petugas Monitoring",
      methods: {
        list: {
          type: 'row-slot'
        },
        detail: {
          type: 'slot',
          view_data: 'assigned_to'
        },
      },
    },
    {
      id: "status_data",
      label: "Status Data",
      methods: {
        list: {
          type: 'row-slot'
        },
        detail: {
          type: 'slot',
          view_data: 'status_data'
        },
      },
    },
  ],
});
