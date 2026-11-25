export default {
    title: "Pra Lubang Tanam",
    permission: {
        create: "pre-lubang-tanam-create",
        read: "pre-lubang-tanam-list",
        update: "pre-lubang-tanam-update",
        detail: "pre-lubang-tanam-detail",
        lookup: "pre-lubang-tanam-lookup",
        delete: "pre-lubang-tanam-delete",
    },
    globalFilter: {
        program_year: {
            setter: "program_year",
        },
    },
    detailIdKey: "soc_no",
    getter: "pre-planting-hole/list",
    expandable: false,
    fields: [
        {
            id: "soc_no",
            label: "No Sostam",
            methods: {
                list: true,
                detail: false,
                filter: false,
            },
        },
        {
            id: "managementunits_name",
            label: "Management Unit",
            methods: {
                list: true,
                detail: false,
                filter: {
                    main: true,
                    validation: ["required"],
                    type: "select",
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
            id: "target_areas_name",
            label: "Target Area",
            methods: {
                list: true,
                detail: false,
                filter: {
                    main: true,
                    type: "select",
                    getter: "GetTA_new",
                    setter: "area_code",
                    form_param: {
                        mu_no: "mu_no"
                    },
                    param: {
                        program_year: "current_program_year",
                    },
                    option: {
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
            id: "fc_name",
            label: "Field Coordinator",
            methods: {
                list: true,
                detail: false,
                filter: {
                    main: true,
                    type: "select",
                    col_size: 4,
                    getter: "GetFCByTargetArea",
                    setter: "fc_no",
                    form_param: {
                        area_code: "area_code",
                    },
                    param: {
                        program_year: "current_program_year",
                    },
                    option: {
                        getterKey: "data",
                        list_pointer: {
                            code: "key1",
                            label: "fc_name",
                            display: ["fc_name"],
                        },
                    },
                },
            },
        },
        {
            id: "field_facilitators_name",
            label: "Field Facilitator",
            methods: {
                list: true,
                detail: false,
                filter: false,
            },
        },
        {
            id: "distribution_date",
            label: "Waktu Distribusi",
            methods: {
                list: {
                    type: "row-slot",
                },
                detail: true,
                filter: {
                    label: "Tanggal Distribusi",
                    validation: ["required"],
                    type: "daterange",
                    col_size: 6,
                    getter: "updated_at",
                    setter: "distribution_date",
                    icon: "calendar-edit",
                    main: true,
                },
            },
        },
        {
            id: "program_year",
            label: "Tahun Program",
            methods: {
                list: {
                    class: "badge bg-primary",
                },
                detail: true,
                filter: false,
            },
        },
        {
            id: 'distribution_confirmation_status',
            label: 'Status Konfirmasi Distribusi',
            methods: {
                list: {
                    type: "row-slot",
                },
            },
        },
        {
            id: "activity_date",
            label: "Tgl Cek Sampel",
            methods: {
                list: { type: "row-slot" },
                detail: false,
                filter: false,
            },
        },
        {
            id: "assignment_progress",
            label: "Progress Sampel",
            methods: {
                list: { type: "row-slot" },
                detail: false,
                filter: false,
            },
        },
        {
            id: "assignment_status",
            label: "Status Sampel",
            methods: {
                list: { type: "row-slot" },
                detail: false,
                filter: {
                    main: true,
                    type: "select",
                    col_size: 4,
                    setter: "assignment_status",
                    option: {
                        default_options: [
                            { code: "0", name: "Belum Di-assign" },
                            { code: "1", name: "Sudah Di-assign" },
                            { code: "2", name: "Complete" },
                        ],
                        list_pointer: { code: "code", label: "name", display: ["name"] },
                    },
                },
            },
        },
        {
            id: "is_verified",
            label: "Verifikasi FC",
            methods: {
                list: { type: "row-slot" },
                detail: false,
                filter: {
                    main: true,
                    type: "select",
                    col_size: 4,
                    setter: "is_verified",
                    option: {
                        default_options: [
                            { code: "0", name: "Belum Diverifikasi" },
                            { code: "1", name: "Terverifikasi FC" },
                        ],
                        list_pointer: { code: "code", label: "name", display: ["name"] },
                    },
                },
            },
        },
    ],
}