export default {
    title: 'Monitoring Kebakaran',
    getter: 'monitoring-fire-incident/list-web',
    setter: 'monitoring-fire-incident/update-from-web', // setter ini bisa diisi apa aja tanpa peduli correct API
    delete: 'monitoring-fire-incident/delete',
    delete_ext_payload: {
        delete_type: 'soft_delete'
    },
    detail: 'monitoring-fire-incident/detail',
    detailIdKey: 'mon_no',
    permission: {
        read: 'monitoring-kebakaran-list',
        detail: 'monitoring-kebakaran-detail',
        create: 'monitoring-kebakaran-create',
        update: 'monitoring-kebakaran-update',
        delete: 'monitoring-kebakaran-delete',
        lookup: 'monitoring-kebakaran-lookup',
    },
    globalFilter: {
        program_year: {
            setter: 'program_year'
        }
    },
    fields:[
        // list section
        {
            id: 'mon_no',
            label: 'Monitoring No',
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'incident_date',
            label: 'Tanggal Kejadian',
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'program_year',
            label: "Tahun Program",
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'ff_name',
            label: "Nama FF",
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'farmer_name',
            label: "Nama Petani",
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'village_name',
            label: "Desa",
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'total_trees_planted',
            label: "Total Pohon Yang Tertanam",
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'lahan_no',
            label: 'No Lahan',
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'mu_name',
            label: 'Management Unit',
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'planting_area',
            label: 'Luas Area Tanam (m2)',
            methods: {
                list: true,
                detail: true,
            },
        },
        {
            id: 'is_verified',
            label: 'Status Verifikasi',
            methods: {
                list: {
                    view_data: 'is_verified',
                    class: {
                        0: 'badge bg-grey',
                        1: 'badge bg-primary',
                        2: 'badge bg-success',
                    },
                    transform: 'simple-status'
                },
                detail: {
                    view_data: 'is_verified',
                    class: {
                        0: 'badge bg-grey',
                        1: 'badge bg-primary',
                        2: 'badge bg-success',
                    },
                    transform: 'simple-status'
                },
            },
        },

        // detail section
        {
            id: 'target_area_name',
            label: 'Target Area',
            methods: {
                list: false,
                detail: true,
            },
        },
        {
            id: 'kecamatan_name',
            label: 'Kecamatan',
            methods: {
                list: false,
                detail: true,
            },
        },
        {
            id: 'kabupaten_name',
            label: 'Kabupaten',
            methods: {
                list: false,
                detail: true,
            },
        },
        {
            id: 'project_no',
            label: 'Projek',
            methods: {
                list: false,
                detail: true,
            },
        },
        {
            id: 'project_no',
            label: 'Projek',
            methods: {
                list: false,
                detail: true,
            },
        },
    ],
};