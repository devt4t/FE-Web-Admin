export default {
    title: "Petani",
    model_api: null,
    getter: "GetFarmerAllAdmin_new",
    export: true,
    // getterDataKey: "data.result.data",
    detail: "GetDetailFarmer_new",
    detailIdKey: "farmer_no",
    detailKey: "data.DetailFarmerMain",
    setter: "AddFormMinatFarmers_new",
    setter_redirect: "back",
    update: "UpdateFormMinatMain_new",
    delete: "DeleteFarmerData_new",
    deleteLabel: "farmer_no",
    deleteKey: "farmer_no",
    delete_ext_payload: {
        delete_type: "soft_delete",
    },
    filter_api: {
        typegetdata: "all",
    },

    statistic: {
        statistic_key: "count",
        transform_key: {
            total_data: {
                label: "Total Petani",
                icon: "mdi-account",
                transform: "ts",
            },
            verified: {
                label: "Petani Terverifikasi",
                icon: "mdi-account-check",
                color: "success",
                transform: "ts",
            },
            unverified: {
                label: "Petani Belum Terverifikasi",
                icon: "mdi-account-alert",
                color: "warning",
                transform: "ts",
            },
            // petani_data_belum_lengkap: {
            //   label: "Petani Data Belum lengkap",
            //   icon: "mdi-account-remove",
            //   color: "danger",
            //   transform: "ts",
            //   type: "slot",
            //   pointer: ["count", "petani_sudah_verif", "petani_belum_lengkap"],
            // },
        },
    },
    globalFilter: {
        // project_purpose: {
        //   setter: "purpose_code",
        // },
        program_year: {
            setter: "program_year",
        },
    },
    pk_field: null,
    permission: {
        create: "farmer-create",
        read: "farmer-list",
        update: "farmer-update",
        detail: "farmer-detail",
        lookup: "farmer-lookup",
        delete: "farmer-delete",
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
            id: "farmer_id",
            label: "Nama Petani",
            methods: {
                list: {
                    view_data: "name",
                    class: "font-weight-500",
                    type: "row-slot",
                },
                detail: {
                    view_data: "name",
                },
                create: { validation: ["required"] },
                update: { validation: ["required"], setter: "new_name" },
                filter: false,
            },
        },
        {
            id: "detail_farmer_no",
            label: "Kode Petani",
            methods: {
                detail: {
                    view_data: "farmer_no",
                },
            },
        },
        {
            id: "detail_program_year",
            label: "Tahun Program",
            methods: {
                detail: {
                    type: "row-slot",
                },
            },
        },
        {
            id: "approve",
            label: "Status",
            methods: {
                detail: {
                    type: "slot",
                },
            },
        },
        {
            id: "complete_data",
            label: "Kelengkapan Data",
            methods: {
                detail: {
                    type: "slot",
                },
            },
        },
        {
            id: "birth_date",
            label: "Tanggal Lahir",
            methods: {
                detail: {
                    view_data: "birthday",
                },
            },
        },
        {
            id: "gender",
            label: "Jenis Kelamin",
            methods: {
                detail: {
                    transform: "gender",
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
            },
        },
        {
            id: "managementunits_name",
            label: "Management Unit",
            methods: {
                detail: true,
            },
        },
        {
            id: "target_areas_name",
            label: "Target Area",
            methods: {
                detail: true,
            },
        },
        {
            id: "address",
            label: "Alamat",
            methods: {
                detail: {
                    type: "slot",
                },
            },
        },
        {
            id: "phone",
            label: "No. HP",
            methods: {
                detail: true,
            },
        },
        {
            id: "ethnic",
            label: "Suku",
            methods: {
                detail: true,
            },
        },
        {
            id: "origin",
            label: "Asal Usul",
            methods: {
                detail: true,
            },
        },
        {
            id: "number_family_member",
            label: "Jumlah Keluarga",
            methods: {
                detail: true,
            },
        },
        {
            id: "marrital_status",
            label: "Status Perkawinan",
            methods: {
                detail: true,
            },
        },
        {
            id: "education",
            label: "Pendidikan Terakhir",
            methods: {
                detail: true,
            },
        },
        {
            id: "non_formal_education",
            label: "Pendidikan Non-Formal",
            methods: {
                detail: true,
            },
        },
        {
            id: "main_job",
            label: "Pekerjaan Utama",
            methods: {
                detail: true,
            },
        },
        {
            id: "main_income",
            label: "Penghasilan Utama",
            methods: {
                detail: {
                    transform: "idr",
                },
            },
        },
        {
            id: "side_job",
            label: "Pekerjaan Sampingan",
            methods: {
                detail: true,
            },
        },
        {
            id: "side_income",
            label: "Penghasilan Sampingan",
            methods: {
                detail: {
                    transform: "idr",
                },
            },
        },
        {
            id: "join_date",
            label: "Tanggal Bergabung",
            methods: {
                detail: true,
            },
        },
        {
            id: "group_no",
            label: "Kelompok Tani",
            methods: {
                detail: true,
            },
        },
        {
            id: "mou_no",
            label: "No. MOU",
            methods: {
                detail: {
                    class: "badge bg-light",
                },
            },
        },
        {
            id: "project_model",
            label: "Model Project",
            methods: {
                detail: {
                    type: "slot",
                },
            },
        },
        {
            id: "legal_land_categories",
            label: "Kategori Legalitas Lahan",
            methods: {
                detail: {
                    type: "slot",
                },
            },
        },
        {
            id: "ff_id",
            label: "Nama FF",
            methods: {
                list: {
                    // view_data: "field_facilitators_name",
                    type: "row-slot",
                    // class: "min-w-150px",
                },
                detail: false,
                create: { validation: ["required"] },
                update: { validation: ["required"] },
                filter: false,
            },
        },

        {
            id: "village",
            label: "Desa",
            methods: {
                list: {
                    // view_data: "desa",
                    type: "row-slot",
                },
                detail: false,
                create: false,
                update: false,
                filter: false,
            },
        },
        {
            id: "employee_no",
            label: "Unit Manager",
            methods: {
                filter: {
                    validation: ["required"],
                    type: "select",
                    col_size: 6,
                    getter: "getEmployeeList_new",
                    setter: "um_employee_no",
                    main: true,
                    param: {
                        page: 1,
                        per_page: 10,
                        position_no: 20,
                    },
                    option: {
                        getterKey: "data",
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
            id: "employee_no",
            label: "Field Coordinator",
            methods: {
                filter: {
                    validation: ["required"],
                    type: "select",
                    col_size: 6,
                    getter: "getEmployeeList_new",
                    setter: "fc_employee_no",
                    main: true,
                    param: {
                        page: 1,
                        per_page: 10,
                        position_no: 19,
                    },
                    option: {
                        getterKey: "data",
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
            id: "mu_id",
            label: "Management Unit",
            methods: {
                filter: {
                    validation: ["required"],
                    type: "select",
                    col_size: 6,
                    getter: "GetManagementUnitAdmin",
                    setter: "mu_no",
                    main: true,
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
            id: "target_area",
            label: "Target Area",
            methods: {
                list: {
                    type: "row-slot",
                },
                filter: {
                    main: true,
                    type: "select",
                    getter: "GetTargetAreaAdmin",
                    setter: "area_code",
                    option: {
                        getterKey: "data.result",
                        list_pointer: {
                            code: "area_code",
                            label: "name",
                            display: ["name"],
                        },
                    },
                },
            },
        },

        {
            id: "nik",
            label: "NIK",
            methods: {
                list: {
                    view_data: "ktp_no",
                },
                detail: false,
                filter: false,
            },
        },
        // {
        //   id: "total_lahan_outside",
        //   label: "Jumlah Lahan Diluar Area Kerja",
        //   methods: {
        //     list: {
        //       header_class: "text-center",
        //       type: "row-slot",
        //     },
        //   },
        // },

        {
            id: "program_year",
            label: "Tahun Program",
            methods: {
                list: {
                    show: false,
                    class: "badge bg-primary",
                },
                detail: false,
                filter: false,
            },
        },

        {
            id: "join_year",
            label: "Tahun Bergabung",
            methods: {
                list: {
                    header_class: "text-center",
                    type: "row-slot",
                    class: "badge bg-primary",
                },
                detail: false,
                filter: false,
            },
        },

        {
            id: "status",
            label: "Status",
            methods: {
                list: {
                    header_class: "text-center",
                    type: "row-slot",
                    // class: {
                    //   1: "badge bg-success text-no-wrap",
                    //   0: "badge bg-warning text-no-wrap",
                    // },
                    // transform: "status-verification",
                    // view_data: "approve",
                },
                detail: false,
                filter: {
                    type: "select",
                    setter: "approve",
                    icon: "list-status",
                    main: true,
                    option: {
                        default_options: [
                            {
                                name: "Semua Status",
                                code: null,
                            },
                            {
                                name: "Terverifikasi",
                                code: 1,
                            },
                            {
                                name: "Belum Diverifikasi",
                                code: 0,
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


        {
            id: "gender_filter",
            label: "Jenis Kelamin",
            methods: {
                filter: {
                    type: "select",
                    setter: "gender",
                    icon: "gender-male-female",
                    main: true,
                    option: {
                        default_options: [
                            {
                                name: "Semua Gender",
                                code: null,
                            },
                            {
                                name: "Laki - Laki",
                                code: 'male',
                            },
                            {
                                name: "Perempuan",
                                code: 'female',
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
        {
            id: "created_at",
            label: "Tgl Dibuat",
            methods: {
                list: {
                    show: false,
                    transform: "datetime",
                    class: "min-w-150px",
                },
            },
        },

        {
            id: 'updated_at',
            label: 'Tgl. Pendataan',
            methods: {
                list: {
                    transform: 'datetime',
                    class: 'min-w-150px'
                },

                filter: {
                    validation: ["required"],
                    type: "daterange",
                    col_size: 6,
                    getter: "updated_at",
                    setter: "submission_date",
                    icon: 'calendar-edit',
                    main: true,
                },
            }
        }
    ],
}