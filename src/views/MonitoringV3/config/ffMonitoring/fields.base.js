import defaultData from './religions'

export const FF_BASE_FIELDS = [
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
        id: "program_year",
        label: "Tahun Program",
        methods: {
            detail: false,
            create: {
                separator: "TAHUN PROGRAM",
                validation: ["required"],
                type: "select",
                col_size: 6,
                setter: "program_year",
                option: {
                    list_pointer: {
                        code: "code",
                        label: "label",
                        display: ["label"],
                    },
                    default_options: [
                        {
                            code: "2020",
                            label: "2020",
                        },
                        {
                            code: "2021",
                            label: "2021",
                        },
                        {
                            code: "2022",
                            label: "2022",
                        },
                        {
                            code: "2023",
                            label: "2023",
                        },
                        {
                            code: "2024",
                            label: "2024",
                        },
                        {
                            code: "2025",
                            label: "2025",
                        },
                    ],
                },
            },
            filter: false,
        },
    },

    {
        id: "name",
        label: "Nama FF",
        methods: {
            list: true,
            detail: {
                transform: "no-empty",
            },
            create: {
                validation: ["required"],
                col_size: 6,
                type: "text",
                separator: "IDENTITAS FF",
            },
            update: {
                validation: ["required"],
                col_size: 6,
                type: "text",
                separator: "IDENTITAS FF",
            },
            filter: false,
        },
    },

    {
        id: "ff_no",
        label: "Kode FF",
        methods: {
            list: true,
            detail: true,
            update: {
                disabled: true,
                validation: ["required"],
                col_size: 6,
            },
        },
    },

    {
        id: "users_email",
        label: "Email",
        methods: {
            list: true,
            detail: true,
        },
    },
    {
        id: "gender",
        label: "Jenis Kelamin",
        methods: {
            detail: {
                transform: "gender",
            },
            create: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                    list_pointer: {
                        code: "code",
                        label: "label",
                        display: ["label"],
                    },
                    default_options: [
                        {
                            code: "male",
                            label: "Laki-Laki",
                        },
                        {
                            code: "female",
                            label: "Perempuan",
                        },
                    ],
                },
            },
            update: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                    list_pointer: {
                        code: "code",
                        label: "label",
                        display: ["label"],
                    },
                    default_options: [
                        {
                            code: "male",
                            label: "Laki-Laki",
                        },
                        {
                            code: "female",
                            label: "Perempuan",
                        },
                    ],
                },
            },
        },
    },
    {
        id: "religion",
        label: "Agama",
        methods: {
            detail: {
                class: "text-capitalize",
            },
            create: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                    list_pointer: {
                        code: "code",
                        label: "label",
                        display: ["label"],
                    },
                    default_options: defaultData.religion,
                },
            },
            update: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                    list_pointer: {
                        code: "code",
                        label: "label",
                        display: ["label"],
                    },
                    default_options: defaultData.religion,
                },
            },
        },
    },

    {
        id: "phone",
        label: "No HP",
        methods: {
            list: false,
            detail: {
                transform: "no-empty",
            },
            create: {
                validation: ["required", "phone"],
                col_size: 6,
                type: "text",
            },
            update: {
                validation: ["required", "phone"],
                col_size: 6,
                type: "text",
            },
            filter: false,
        },
    },

    {
        id: "birthday",
        label: "Tanggal Lahir",
        methods: {
            detail: {
                transform: "date",
            },
            create: {
                validation: ["required"],
                col_size: 6,
                type: "date",
            },
            update: {
                validation: ["required"],
                col_size: 6,
                type: "date",
            },
            filter: false,
        },
    },

    {
        id: "ktp_no",
        label: "NIK / No KTP",
        methods: {
            detail: {
                transform: "no-empty",
            },
            create: {
                validation: ["required", "length:16"],
                col_size: 6,
                type: "number",
            },
            update: {
                validation: ["required", "length:16"],
                col_size: 6,
                type: "number",
            },
            filter: false,
        },
    },

    {
        id: "marrital",
        label: "Status Perkawinan",
        methods: {
            detail: {
                class: "text-capitalize",
            },
            create: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                    list_pointer: {
                        code: "code",
                        label: "label",
                        display: ["label"],
                    },
                    default_options: [
                        {
                            code: "kawin",
                            label: "Kawin",
                        },
                        {
                            code: "belum kawin",
                            label: "Belum Kawin",
                        },
                    ],
                },
            },
            update: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                    list_pointer: {
                        code: "code",
                        label: "label",
                        display: ["label"],
                    },
                    default_options: [
                        {
                            code: "kawin",
                            label: "Kawin",
                        },
                        {
                            code: "belum kawin",
                            label: "Belum Kawin",
                        },
                    ],
                },
            },
        },
    },

    {
        id: "join_date",
        label: "Tanggal Bergabung",
        methods: {
            detail: {
                transform: "date",
            },
            create: {
                validation: ["required"],
                col_size: 6,
                type: "date",
            },
            update: {
                validation: ["required"],
                col_size: 6,
                type: "date",
            },
            filter: false,
        },
    },

    {
        id: "province",
        label: "Provinsi",
        methods: {
            detail: {
                view_data: "provinces_name_domicile",
                transform: "no-empty",
            },
            create: {
                separator: "Domisili FF",
                validation: ["required"],
                type: "select",
                getter: "GetProvince",
                col_size: 6,
                option: {
                    getterKey: "data.result",
                    list_pointer: {
                        code: "province_code",
                        label: "name",
                        display: ["name"],
                    },
                },
            },
            update: {
                separator: "Domisili FF",
                validation: ["required"],
                type: "select",
                getter: "GetProvince",
                col_size: 6,
                option: {
                    default_label: "provinces_name_domicile",
                    getterKey: "data.result",
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
        id: "city",
        label: "Kota",
        methods: {
            detail: {
                view_data: "kabupatens_name_domicile",
                transform: "no-empty",
            },
            create: {
                type: "row-slot",
                validation: ["required"],
                getter: "GetKabupaten",
                col_size: 6,
            },
            update: {
                validation: ["required"],
                type: "row-slot",
                base_type: "select",
                option: {
                    default_label: "kabupatens_name_domicile",
                },
                getter: "GetKabupaten",
                col_size: 6,
            },
        },
    },

    {
        id: "kecamatan",
        label: "Kecamatan",
        methods: {
            list: false,
            detail: {
                view_data: "kecamatans_name_domicile",
                transform: "no-empty",
            },
            create: {
                type: "row-slot",
            },
            update: {
                type: "row-slot",
                base_type: "select",
                option: {
                    default_label: "kecamatans_name_domicile",
                },
            },
        },
    },

    {
        id: "village",
        label: "Desa",
        methods: {
            detail: {
                view_data: "desas_name_domicile",
                transform: "no-empty",
            },
            create: {
                type: "row-slot",
            },
            update: {
                type: "row-slot",
                base_type: "select",
                option: {
                    default_label: "desas_name_domicile",
                },
            },
        },
    },

    {
        id: "address",
        label: "Alamat",
        methods: {
            detail: true,
            create: {
                type: "textarea",
                validation: ['required'],
                col_size: 6,
            },
            update: {
                type: "textarea",
                validation: ['required'],
                col_size: 6,
            },
        },
    },

    {
        id: "post_code",
        label: "Kode Pos",
        methods: {
            detail: true,
            create: {
                type: "text",
                validation: ["length:5"],
                col_size: 6,
            },
            update: {
                type: "text",
                validation: ["length:5"],
                col_size: 6,
            },
        },
    },

    {
        id: "mu_no",
        label: "Unit Management",
        methods: {
            list: {
                view_data: "managementunits_name",
            },
            detail: {
                view_data: "managementunits_name",
            },
            create: {
                type: "row-slot",
            },
            update: {
                type: "row-slot",
                base_type: "select",
                option: {
                    default_label: "managementunits_name",
                },
            },

            filter: {
                validation: ["required"],
                type: "select",
                main: true,
                col_size: 6,
                getter: "GetManagementUnitAdmin",
                setter: "mu_no",
                param: {
                    page: 1,
                    per_page: 10,
                },
                option: {
                    getterKey: "data.result",
                    list_pointer: {
                        code: "mu_no",
                        label: "name",
                        display: ["name"],
                    },
                },
            },
        },
    },

    {
        id: "fc_filter",
        label: "Field Coordinator",
        methods: {
            filter: {
                validation: ["required"],
                type: "select",
                main: true,
                col_size: 6,
                getter: "getEmployeeList_new",
                setter: "fc_filter",
                param: {
                    page: 1,
                    per_page: 10,
                },
                option: {
                    list_pointer: {
                        code: "nik",
                        label: "name",
                        display: ["name"],
                    },
                },
            },
        },
    },

    {
        id: "target_area",
        label: "Target Area",
        methods: {
            list: {
                view_data: "target_areas_name",
            },
            detail: {
                view_data: "target_areas_name",
            },
            create: {
                type: "row-slot",
            },
            update: {
                type: "row-slot",
                base_type: "select",
                option: {
                    default_label: "target_areas_name",
                },
            },
        },
    },

    {
        id: "working_area",
        label: "Working Area / Desa",
        methods: {
            list: {
                view_data: "desas_name",
            },
            detail: {
                view_data: "desas_name",
            },
            create: {
                type: "row-slot",
            },
            update: {
                type: "row-slot",
                base_type: "select",
                option: {
                    default_label: "desas_name",
                },
            },
        },
    },

    // {
    //     id: "fc_no",
    //     label: "PIC T4T (Field Coordinator)",
    //     methods: {
    //         detail: {
    //             view_data: "employees_name",
    //         },
    //         create: {
    //             type: "row-slot",
    //         },
    //         update: false
    //     },
    // },

    {
        id: "bank_name",
        label: "Nama Bank",
        methods: {
            detail: true,
            create: {
                separator: "BANK",
                type: "text",
                col_size: 6,
                validation: [],
            },
            update: {
                separator: "BANK",
                type: "text",
                validation: [],
            },
        },
    },

    {
        id: "bank_account",
        label: "Akun Bank",
        methods: {
            detail: true,
            create: {
                type: "text",
                col_size: 6,
                validation: [],
            },
            update: {
                type: "text",
                validation: [],
            },
        },
    },

    {
        id: "main_pivots_program_year",
        label: "Program Year",
        methods: {
            list: {
                header_class: "text-center",
                type: true,
            },
            detail: {
                type: "slot",
            },
        },
    },

    {
        id: "status",
        label: "Status",
        methods: {
            list: {
                view_data: "active",
                class: {
                    1: "badge bg-success",
                    0: "badge bg-danger",
                },
                transform: "active",
            },
            detail: {
                view_data: "active",
                class: {
                    1: "badge bg-success",
                    0: "badge bg-danger",
                },
                transform: "active",
            },
            update: {
                validation: ["required"],
                type: "select-radio",
                col_size: 6,
                setter: "active",
                view_data: "active",
                option: {
                    list_pointer: {
                        code: "code",
                        label: "label",
                        display: ["label"],
                    },
                    default_options: [
                        {
                            label: "Aktif",
                            code: "1",
                        },
                        {
                            label: "Tidak Aktif",
                            code: "0",
                        },
                    ],
                },
            },
            filter: {
                type: "select",
                setter: "active",
                icon: "list-status",
                main: true,
                option: {
                    default_options: [
                        {
                            name: "Semua Status",
                            code: null,
                        },
                        {
                            name: "Aktif",
                            code: 1,
                        },
                        {
                            name: "Tidak Aktif",
                            code: "0",
                        },
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
]