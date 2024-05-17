<!-- Contain Regional Datas -->
<template>
    <geko-base-crud :config="config" />
</template>

<script>
export default {
    name: "crud-regional-data",
    watch: {},
    data() {
        return {
            config: {
                title: "Regional",
                program_year:{
                    show: true,
                    model: '2024'
                },
                model_api: null,
                getter: "getRegion",
                // can we add list path in case the response getting more complicated sir?
                setter: "region",
                pk_field: null,

                filter_api: {
                    project_modul: "type",
                },
                permission: {
                    create: "region-create",
                    read: "region-list",
                    update: "region-update",
                    show: "region-show",
                    lookup: "region-lookup",
                    delete: "region-delete",
                },
                slave: [],
                fields: [
                    {
                        id: "id",
                        methods: {
                            list: false,
                            detail: false,
                            create: false,
                            update: false,
                            filter: false,
                        },
                    },

                    {
                        id: "region_code",
                        label: "Kode Regional",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"] },
                            filter: false,
                        },
                    },

                    {
                        id: "name",
                        label: "Nama Regional",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"] },
                            filter: false,
                        },
                    },
                    {
                        id: "active_status",
                        label: "Status Aktif",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"] },
                            filter: false,
                        },
                    },
                ],
            },
        };
    },
};
</script>
