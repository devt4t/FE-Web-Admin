// config/populate/fields.base.js
export const POPULATE_BASE_FIELDS = [
    {
        id: 'populate_no',
        label: 'Kode Populasi',
        methods: { list: true, detail: true },
    },
    {
        id: 'monitoring_no',
        label: 'Kode Monitoring Sebelumnya',
        methods: { list: true, detail: true },
    },
    {
        id: 'lahan_no',
        label: 'Nomor Lahan',
        methods: { list: true, detail: true },
    },
    {
        id: 'farmer_no',
        label: 'Kode Petani',
        methods: { list: false, detail: true },
    },
    {
        id: 'farmer_name',
        label: 'Nama Petani',
        methods: { list: true, detail: true },
    },
    {
        id: 'ff_name',
        label: 'Nama FF Penanaman',
        methods: { list: true, detail: true },
    },
    {
        id: 'mu_name',
        label: 'Management Unit',
        methods: { list: true, detail: true },
    },
    {
        id: 'mu_no',
        label: 'Management Unit',
        methods: {
            filter: {
                main: true,
                validation: ['required'],
                type: 'select',
                col_size: 6,
                getter: 'new-utilities/management-units',
                setter: 'mu_no',
                param: { page: 1, per_page: 10 },
                option: {
                    getterKey: 'data',
                    list_pointer: { code: 'mu_no', label: 'name', display: ['name', 'mu_no'] },
                },
            },
        },
    },
    {
        id: 'target_area_name',
        label: 'Target Area',
        methods: { list: true, detail: true },
    },
    {
        id: 'target_area',
        label: 'Target Area',
        methods: {
            filter: {
                main: true,
                validation: ['required'],
                type: 'select',
                col_size: 6,
                getter: 'new-utilities/target-areas',
                setter: 'target_area',
                form_param: { mu_no: 'mu_no' },
                param: { page: 1, per_page: 10 },
                option: {
                    getterKey: 'data',
                    list_pointer: { code: 'area_code', label: 'name', display: ['name', 'area_code'] },
                },
            },
        },
    },
    {
        id: 'sampling',
        label: 'Metode Sampling',
        methods: { list: true, detail: true },
    },
    {
        id: 'assigned_to',
        label: 'FF Petugas Monitoring',
        methods: {
            list: { type: 'row-slot' },
            detail: { type: 'slot', view_data: 'assigned_to' },
        },
    },
    {
        id: 'users_employee_no',
        label: 'FC Monitoring V3',
        methods: {
            list: { type: 'row-slot' },
            detail: true
        }
    },
    {
        id: 'status_data',
        label: 'Status Data',
        methods: {
            list: { type: 'row-slot' },
            detail: { type: 'slot', view_data: 'status_data' },
        },
    },
    // {
    //     id: 'created_at',
    //     label: 'Tahun Input Data Populasi',
    //     methods: {
    //         filter: {
    //             main: true,
    //             type: 'select',
    //             col_size: 6,
    //             option: {
    //                 default_options: [
    //                     { name: '2021', code: '2021' },
    //                     { name: '2022', code: '2022' },
    //                     { name: '2023', code: '2023' },
    //                     { name: '2024', code: '2024' },
    //                     { name: '2025', code: '2025' },
    //                     { name: '2026', code: '2026' },
    //                 ],
    //                 list_pointer: { code: 'code', label: 'name', display: ['name'] },
    //             },
    //         },
    //     },
    // },
]
