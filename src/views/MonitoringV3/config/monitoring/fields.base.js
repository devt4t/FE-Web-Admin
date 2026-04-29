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
            list: true,
            detail: {
                view_data: 'ff_no',
                label: 'Kode FF'
            },
            filter: {
                main: true,
                validation: ['required'],
                type: 'select',
                col_size: 6,
                getter: 'monitoring-officer-v3/ff/options',
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
        id: 'users_name',
        label: 'Nama FC',
        methods: {
            list: true,
            detail: {
                view_data: 'fc_no',
                label: 'Kode FC'
            },
        }
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
    {
        id: 'mu_no',
        label: 'Management Unit',
        methods: {
            list: false,
            detail: {
                view_data: 'managementunits_name'
            },
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
        id: 'target_area',
        label: 'Target Area',
        methods: {
            list: false,
            detail: {
                view_data: 'target_areas_name',
            },
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
        methods: {
            list: true,
            detail: true,
        },
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
    // field yang ada di mobile
    {
        id: 'percentage_of_t4t_live_plants',
        label: 'Persentase Tanaman Hidup T4T',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'percentage_of_t4t_live_plants' },
        }
    },
    {
        id: 'is_other_program_plants',
        label: 'Tanaman Di Luar Program',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'is_other_program_plants' },
        },
    },
    {
        id: 'watering_period',
        label: 'Periode Irigasi',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'watering_period' },
        }
    },
    {
        id: 'irrigation_origin',
        label: 'Asal dari Irigasi Utama',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'irrigation_origin' },
        }
    },
    {
        id: 'is_watering',
        label: 'Tindakan Penyiraman',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'is_watering' },
        }
    },
    // Blok Kondisi Lahan & Lingkungan
    {
        id: 'weed_condition',
        label: 'Kondisi Gulma',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'weed_condition' },
        }
    },
    {
        id: 'soil_moisture',
        label: 'Kelembaban Tanah',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'soil_moisture' },
        }
    },
    {
        id: 'land_use_changes',
        label: 'Perubahan Fungsi Lahan',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'land_use_changes' },
        }
    },
    // Blok Perawatan Tanaman
    {
        id: 'preservation_period',
        label: 'Periode Perawatan',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'preservation_period' },
        }
    },
    {
        id: 'fertilizer_type',
        label: 'Jenis Pupuk',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'fertilizer_type' },
        }
    },
    {
        id: 'pesticide_type',
        label: 'Jenis Pestisida',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'pesticide_type' },
        }
    },
    // Blok Kondisi & Pertumbuhan
    {
        id: 'total_estimated_tree',
        label: 'Estimasi Total Pohon',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'total_estimated_tree' },
        }
    },
    {
        id: 'average_plant_growth',
        label: 'Rata-rata Pertumbuhan',
        methods: {
            list: false,
            detail: { type: 'slot', view_data: 'average_plant_growth' },
        }
    },
    // Blok Boolean Flags
    {
        id: 'is_preservation',
        label: 'Tindakan Perawatan',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_preservation' } }
    },
    {
        id: 'is_fertilizer',
        label: 'Pemupukan',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_fertilizer' } }
    },
    {
        id: 'is_pesticide',
        label: 'Penggunaan Pestisida',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_pesticide' } }
    },
    {
        id: 'is_fauna_exists',
        label: 'Keberadaan Fauna',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_fauna_exists' } }
    },
    {
        id: 'is_pest_attack',
        label: 'Serangan Hama',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_pest_attack' } }
    },
    {
        id: 'is_disaster',
        label: 'Terjadi Bencana',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_disaster' } }
    },
    {
        id: 'is_harvested',
        label: 'Sudah Dipanen',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_harvested' } }
    },
    {
        id: 'is_issue_or_problems',
        label: 'Ada Isu / Masalah',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_issue_or_problems' } }
    },
    {
        id: 'is_planted_plants_companion',
        label: 'Tanaman Pendamping',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_planted_plants_companion' } }
    },
    {
        id: 'is_visited',
        label: 'Sudah Dikunjungi',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_visited' } }
    },
    {
        id: 'is_barcode_scanned',
        label: 'Barcode Discan',
        methods: { list: false, detail: { type: 'slot', view_data: 'is_barcode_scanned' } }
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
                class: { 0: 'badge bg-danger', 1: 'badge bg-success' },
                transform: 'monitoring-verification-status',
            },
            detail: {
                view_data: 'is_verified',
                class: { 0: 'badge bg-danger', 1: 'badge bg-success' },
                transform: 'monitoring-verification-status',
            },
        },
    },
    {
        id: 'users_name_verified_by',
        label: 'Diverifikasi Oleh',
        methods: { list: true, detail: true },
    },
    {
        id: 'verified_at',
        label: 'Waktu Diverifikasi',
        methods: {
            list: true,
            detail: true
        }
    },
    // {
    //     id: 'created_at',
    //     label: 'Tahun Input Data',
    //     methods: {
    //         filter: {
    //             main: true, type: 'select', col_size: 6,
    //             option: {
    //                 default_options: [
    //                     { name: '2021', code: '2021' }, { name: '2022', code: '2022' },
    //                     { name: '2023', code: '2023' }, { name: '2024', code: '2024' },
    //                     { name: '2025', code: '2025' }, { name: '2026', code: '2026' },
    //                 ],
    //                 list_pointer: { code: 'code', label: 'name', display: ['name'] },
    //             },
    //         },
    //     },
    // },
]
