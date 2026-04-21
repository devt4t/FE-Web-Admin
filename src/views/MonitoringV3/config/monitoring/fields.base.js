export const MONITORING_BASE_FIELDS = [
    {
        id: 'indicator',
        label: ' ',
        methods: { list: { type: 'row-slot' } },
    },
    {
        id: 'monitoring_prev',
        label: 'Nomor Monitoring Sebelumnya',
        methods: { list: false, detail: true }
    },
    {
        id: 'monitoring_no', // nih bisa berganti sesuai dengan monitoring yang dipilih
        label: 'Nomor Monitoring',
        methods: { list: true, detail: true },
    },
    {
        id: 'monitoring_start',
        label: 'Tanggal Mulai Monitoring',
        methods: { list: false, detail: true },
    },
    {
        id: 'monitoring_end',
        label: 'Tanggal Monitoring',
        methods: { list: false, detail: true },
    },
    {
        id: 'program_year',
        label: 'Tahun Program',
        methods: { list: true, detail: true },
    },
    {
        id: 'field_facilitators_name',
        label: 'Nama FF',
        methods: {
            list: true, detail: true,
            filter: {
                main: true,
                validation: ['required'],
                type: 'select',
                col_size: 6,
                getter: 'GetFFAllWeb_new',
                setter: 'ff_no',
                param: { page: 1, per_page: 100 },
                option: {
                    getterKey: 'data',
                    list_pointer: { code: 'ff_no', label: 'name', display: ['name', 'ff_no'] },
                },
            },
        },
    },
    {
        id: 'farmer_name',
        label: 'Nama Petani',
        methods: { list: true, detail: true },
    },
    {
        id: 'qty_trees',
        label: 'Total Pohon',
        methods: { list: true, detail: true },
    },
    // {
    //     id: 'sampling',
    //     label: 'Metode Sampling',
    //     methods: { list: true, detail: true },
    // },
    // {
    //     id: 'assign_to',
    //     label: 'FF Petugas Monitoring',
    //     methods: { list: true, detail: true },
    // },
    {
        id: 'managementunits_name',
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
        id: 'target_areas_name',
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
        id: 'desas_name',
        label: 'Desa',
        methods: { list: true, detail: true },
    },
    {
        id: 'lahan_no',
        label: 'Nomor Lahan',
        methods: { list: true, detail: true },
    },
    {
        id: 'opsi_pola_tanam',
        label: 'Pola Tanam',
        methods: { list: true, detail: true },
    },
    // {
    //     id: 'total_detail_life_kayu',
    //     label: 'Total Kayu Hidup',
    //     methods: { list: true, detail: true },
    // },
    // {
    //     id: 'total_detail_life_mpts',
    //     label: 'Total MPTS Hidup',
    //     methods: { list: true, detail: true },
    // },
    {
        id: 'total_detail_life_trees',
        label: 'Total Pohon Hidup',
        methods: {
            list: {
                view_data: 'total_detail_life_trees',
                class: { 0: 'badge bg-success' },
            },
            detail: false,
        },
    },
    {
        id: 'tutupan',
        label: 'Tutupan Lahan (%)',
        methods: { list: false, detail: true },
    },
    {
        id: 'land_area',
        label: 'Luas Lahan (m²)',
        methods: { list: false, detail: true },
    },
    {
        id: 'planting_area',
        label: 'Luas Tanam (m²)',
        methods: { list: false, detail: true },
    },
    {
        id: 'land_condition',
        label: 'Kondisi Lahan',
        methods: { list: true, detail: true },
    },
    {
        id: 'inteview',
        label: 'Komentar Interview',
        methods: { list: false, detail: true },
    },
    {
        id: 'is_verified',
        label: 'Status Verifikasi',
        methods: {
            list: {
                view_data: 'is_verified',
                class: { 0: 'badge bg-danger', 1: 'badge bg-warning', 2: 'badge bg-success' },
                transform: 'monitoring-verification-status',
            },
            detail: {
                view_data: 'is_verified',
                class: { 0: 'badge bg-danger', 1: 'badge bg-warning', 2: 'badge bg-success' },
                transform: 'monitoring-verification-status',
            },
        },
    },
    {
        id: 'verified_by',
        label: 'Terverifikasi Oleh',
        methods: { list: true, detail: true },
    },
    {
        id: 'created_at',
        label: 'Tahun Input Data',
        methods: {
            filter: {
                main: true, type: 'select', col_size: 6,
                option: {
                    default_options: [
                        { name: '2021', code: '2021' }, { name: '2022', code: '2022' },
                        { name: '2023', code: '2023' }, { name: '2024', code: '2024' },
                        { name: '2025', code: '2025' }, { name: '2026', code: '2026' },
                    ],
                    list_pointer: { code: 'code', label: 'name', display: ['name'] },
                },
            },
        },
    },
    {
        id: 'planting_year',
        label: 'Tahun Tanam',
        methods: {
            // filter: {
            //     main: true, type: 'select', col_size: 6, validation: ['required'],
            //     option: {
            //         default_options: [
            //             { name: '2021', code: '2021' }, { name: '2022', code: '2022' },
            //             { name: '2023', code: '2023' }, { name: '2024', code: '2024' },
            //             { name: '2025', code: '2025' }, { name: '2026', code: '2026' },
            //         ],
            //         list_pointer: { code: 'code', label: 'name', display: ['name'] },
            //     },
            // },
            list: true, detail: true,
        },
    },
]
