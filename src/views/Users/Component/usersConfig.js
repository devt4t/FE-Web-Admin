import { reactive } from "vue"

export default reactive({
  // export: true,
  title: "UsersV2",
  getter: "GetUser_new",
  getterDataKey: "data",
  totalDataKey: 'total',
  detail: "",
  detailIdKey: "id",
  detailKey: "result",
  pk_field: null,
  globalFilter: {
    // program_year: {
    //   setter: "program_year",
    // },
  },
  permission: {
    read: "user-list",
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
      id: "employee_no",
      label: "Kode Karyawan",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "name",
      label: "Nama Karyawan",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "email",
      label: "Email Geko",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
    {
      id: "role",
      label: "Posisi",
      methods: {
        list: true,
        detail: true,
        create: false,
        update: false,
        filter: false,
      },
    },
  ],
});