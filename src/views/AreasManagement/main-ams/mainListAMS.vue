<template>
    <geko-base-crud :config="config" :hideUpdate="true" :hideDelete="true" :hideCreate="true"/>
        
</template>

<script>
export default {
    name: "crud-area-management-system",
    watch: {},
    data() {
        return {
            config: {
                title: "Area Management System",
                model_api: null,
                getter: "ams/get-list",
                totalDataKey: 'count_record',
                setter: "ams/post_create",
                setter_ext_payload: {
                    project_modul: "purpose",
                },
                update: "updateProjectUtils",
                update_ext_payload: {
                    project_modul: "purpose",
                },
                delete: "deleteProjectUtils",
                delete_ext_payload: {
                    delete_type: "hard_delete",
                    project_modul: "purpose",
                },
                deleteKey: "id",
                pk_field: null,
                filter_api: {
                    project_modul: "purpose",
                },
                permission: {
                    create: "region-create",
                    read: "region-list",
                    update: "region-update",
                    detail: "region-detail",
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
                        label: "Kode Region",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"], setter: "new_region_code" },
                            filter: false,
                        },
                    },

                    {
                        id: "name",
                        label: "Nama Region",
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
                    }
                ],
            },
        };
    },
};
</script>