import { reactive } from "vue"

export default reactive({
  export: true,
  title: "Monitoring Populate Data",
  getter: "populate-monitoring/1-to-2/list",
  getterDataKey: "result",
  totalDataKey: 'total',
  // detail: "second-monitorings/main/detail",
  // detailIdKey: "id",
  // detailKey: "result",
  pk_field: null,
  globalFilter: {
    program_year: {
      setter: "program_year",
    },
  },
  permission: {
    create: "monitoring-create",
    read: "monitoring-list",
    update: "monitoring-update",
    detail: "monitoring-detail",
    lookup: "monitoring-lookup",
    delete: "monitoring-delete",
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
      label: "Kode Monitoring Sebelumnya",
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
      id: "farmer_no",
      label: "Kode Petani",
      methods: {
        list: false,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "farmer_name",
      label: "Nama Petani",
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
      label: "Nama FF Penanaman",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    // {
    //   id: "field_facilitators_name",
    //   label: "FF Petugas Monitoring",
    //   methods: {
    //       list: true,
    //       detail: true,
    //       create: false,
    //       update: false,
    //       filter: false,
    //     },
    // },
    {
      id: "mu_name",
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
      id: "target_area_name",
      label: "Target Area",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "target_area",
      label: "Target Area",
      methods: {
        filter: {
          main: true,
          validation: ["required"],
          type: "select",
          col_size: 6,
          getter: "new-utilities/target-areas",
          setter: "target_area",
          form_param: {
            mu_no: "mu_no",
          },
          param: {
            page: 1,
            per_page: 10,
          },
          option: {
            getterKey: "data",
            list_pointer: {
              code: "area_code",
              label: "name",
              display: ["name", "area_code"],
            },
          },
        },
      },
    },
    {
      id: "created_at",
      label: "Tahun Input Data Populasi",
      methods: {
        filter: {
          main: true,
          type: "select",
          col_size: 6,
          // validation: ["required"],
          option: {
            default_options: [
              {
                name: "2021",
                code: "2021",
              },
              {
                name: "2022",
                code: "2022",
              },
              {
                name: "2023",
                code: "2023",
              },
              {
                name: "2024",
                code: "2024",
              },
              {
                name: "2025",
                code: "2025",
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
    {
      id: "monitoring_year",
      label: "Tahun Monitoring",
      methods: {
        filter: {
          main: true,
          type: "select",
          col_size: 6,
          validation: ["required"],
          option: {
            default_options: [
              {
                name: "2021",
                code: "2021",
              },
              {
                name: "2022",
                code: "2022",
              },
              {
                name: "2023",
                code: "2023",
              },
              {
                name: "2024",
                code: "2024",
              },
              {
                name: "2025",
                code: "2025",
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
