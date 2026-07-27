export default [
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
        id: "monitoring_no",
        label: "Monitoring_no",
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
        id: "lahan_no",
        label: "Lahan No",
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
        id: "program_year",
        label: "Tahun Program",
        methods: {
            list: true,
            detail: true,
            create: false,
            update: false,
            filter: false
        },
    },
    {
        id: "planting_date",
        label: "Tanggal Monitoring",
        methods: {
            list: {
                transform: "date",
                class: "badge bg-primary",
            },
            detail: true,
            filter: false,
        },
    },
    {
        id: "lahan_umums_pic_lahan",
        label: "PIC Lahan Umum",
        methods: {
            list: true,
            detail: true,
            filter: false
        },
    },
    {
        id: "is_verified",
        label: "Status Verifikasi",
        methods: {
            list: {
                view_data: "is_verified",
                class: {
                    0: "badge bg-danger",
                    1: "badge bg-success",
                },
                transform: "simple-status",
            },
            detail: {
                view_data: "is_verified",
                class: {
                    0: "badge bg-danger",
                    1: "badge bg-success",
                },
                transform: "simple-status",
            },
            create: false,
            update: false,
            filter: false
        },
    },
]