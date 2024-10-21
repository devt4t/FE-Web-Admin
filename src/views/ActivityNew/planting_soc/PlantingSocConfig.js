export default {
    refreshKey: 1,
        config: {
            title: "Sosialisasi Tanam",
            globalFilter: {
                program_year: {
                    setter: "program_year",
                },
            },
            getter: "GetSocAllAdmin",
            // getterDataKey: 'data.result.data.data',
            // totalDataKey: 'data.result.data',
            // limitKey: 'per_page',
            // offsetKey: 'page',
            expandable: true,
            setter: "addProjectUtils",
            setter_ext_payload: {
                project_modul: "purpose",
            },
            // update: "updateProjectUtils",
            // update_ext_payload: {
            //     project_modul: "purpose",
            // },
            // delete: "deleteProjectUtils",
            // delete_ext_payload: {
            //     delete_type: "hard_delete",
            //     project_modul: "purpose",
            // },
            // deleteKey: "code",
            pk_field: null,
            filter_api: {
                typegetdata: 'all'
            },
            permission: {
                create: "sosialisasi-tanam-create",
                read: "sosialisasi-tanam-list",
                update: "sosialisasi-tanam-update",
                detail: "sosialisasi-tanam-detail",
                lookup: "sosialisasi-tanam-lookup",
                delete: "sosialisasi-tanam-delete",
            },
            slave: [],
            fields: [
                {
                    id: 'data-table-expand',
                    label: 'Detail',
                    methods: {
                        list: true
                    }
                },
                {
                    id: "soc_no",
                    label: "No. Sostam",
                    methods: {
                        list: true,
                        detail: true,
                        filter: false,
                    },
                },
                {
                    id: "managementunits_name",
                    label: "Management Unit",
                    methods: {
                        list: true,
                        detail: true,
                        filter: false,
                    },
                },
                {
                    id: "target_areas_name",
                    label: "Target Area",
                    methods: {
                        list: true,
                        detail: true,
                        filter: false,
                    },
                },
                {
                    id: "field_facilitators_name",
                    label: "Field Facilitator",
                    methods: {
                        list: true,
                        detail: true,
                        filter: false,
                    },
                },
                {
                    id: "distribution_date",
                    label: "Waktu Distribusi",
                    methods: {
                        list: {
                            transform: 'date'
                        },
                        detail: true,
                        filter: false,
                    },
                },
                {
                    id: "soc_date",
                    label: "Tanggal Sosialisasi",
                    methods: {
                        list: {
                            transform: 'date'
                        },
                        detail: true,
                        filter: false,
                    },
                },
                {
                    id: "program_year",
                    label: "Tahun Program",
                    methods: {
                        list: {
                            class: 'badge bg-primary'
                        },
                        detail: true,
                        filter: false,
                    },
                },
            ],
        },
}