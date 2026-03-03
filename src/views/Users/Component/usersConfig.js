import { reactive } from "vue"

export default reactive({
  // export: true,
  title: "UsersV2",
  getter: "GetUser_new",
  getterDataKey: "data",
  totalDataKey: 'total',
  // editanku
  detail: "GetUserDetail",
  delete: "DeleteUser",
  // -----
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
    detail: "user-detail",
    create: "user-create",
    delete: "user-delete",
    reset_password: "user-reset-password",
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