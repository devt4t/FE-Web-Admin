export default [
    {
        col: 12,
        id: 'program_year',
        icon: 'mdi-ticket',
        label: 'Tahun Program',
        type: 'select-program-year',
        model: '',
        filter: true,
    },
    {
        id: 'start_date',
        icon: 'mdi-calendar',
        label: 'Awal Periode',
        type: 'inline-date-picker',
        model: '',
        filter: true
    },
    {
        id: 'end_date',
        icon: 'mdi-calendar',
        label: 'Akhir Periode',
        type: 'inline-date-picker',
        model: '',
        filter: true
    },
    {
        col: 12,
        id: 'show_fields',
        icon: 'mdi-view-column',
        label: 'Tabel Kolom',
        type: 'multi-select',
        model: [],
        items: [],
        filter: true
    },
    {
        id: 'mu_name',
        icon: 'mdi-calendar',
        label: 'MU',
        type: 'text',
        model: '',
        filter: false,
        list: true,
    },
    {
        id: 'um_name',
        icon: 'mdi-calendar',
        label: 'UM',
        type: 'text',
        model: '',
        filter: false,
        list: true,
    },
    {
        id: 'ta_name',
        icon: 'mdi-calendar',
        label: 'TA',
        type: 'text',
        model: '',
        filter: false,
        list: true,
    },
    {
        id: 'fc_name',
        icon: 'mdi-calendar',
        label: 'FC',
        type: 'text',
        model: '',
        filter: false,
        list: true,
    },
    {
        id: 'ff_name',
        icon: 'mdi-calendar',
        label: 'FF',
        type: 'text',
        model: '',
        filter: false,
        list: true,
    },
    {
        id: 'village_name',
        icon: 'mdi-calendar',
        label: 'Desa',
        type: 'text',
        model: '',
        filter: false,
        list: true,
    },
    {
        id: 'farmer_name',
        icon: 'mdi-calendar',
        label: 'Petani',
        type: 'text',
        model: '',
        filter: false,
        list: true,
    },
    {
        id: 'lahan_no',
        icon: 'mdi-calendar',
        label: 'Kode Lahan',
        type: 'text',
        model: '',
        filter: false,
        list: true,
    },
    {
        id: 'land_status',
        icon: 'mdi-calendar',
        label: 'Status Lahan',
        type: 'text',
        model: '',
        filter: false,
        list: true,
    },
]