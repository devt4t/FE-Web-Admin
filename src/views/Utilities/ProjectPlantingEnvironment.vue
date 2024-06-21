<template>
    <geko-base-crud :config="config">
    </geko-base-crud>
</template>

<script>
export default {
    name: "crud-planting-environment",
    watch: {},
    data() {
        return {
            config: {
                title: "Planting Environment",
                program_year: {
                    show: false,
                    model: "2024",
                },
                model_api: null,
                getter: "getAllProjectUtils",
                setter: "addProjectUtils",
                setter_ext_payload: {
                    project_modul: 'environment',
                },
                update: "updateProjectUtils",
                update_ext_payload: {
                    project_modul: 'environment',
                },
                delete: "deleteProjectUtils",
                delete_ext_payload: {
                    delete_type: "hard_delete",
                    project_modul: 'environment',
                },
                deleteKey: "code",
                pk_field: null,
                filter_api: {
                    project_modul: 'environment',
                },
                permission: {
                    create: "planting-environment-create",
                    read: "planting-environment-list",
                    update: "planting-environment-update",
                    show: "planting-environment-show",
                    lookup: "planting-environment-lookup",
                    delete: "planting-environment-delete",
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
                        id: "code",
                        label: "Kode",
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
                        label: "Nama",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"], setter: "new_name" },
                            filter: false,
                        },
                    },

                    {
                        id: "created_by",
                        label: "Created By",
                        methods: {
                            list: false,
                            detail: true,
                            create: {
                                input: false,
                                default: "current_user_id",
                            },
                            update: {
                                input: false,
                                default: "current_user_id",
                                setter: "updated_by",
                            },
                            filter: false,
                        },
                    },

                    {
                        id: "created_at",
                        label: "Tgl. Dibuat",
                        methods: {
                            list: {
                                transform: "datetime",
                            },
                            detail: true,
                            filter: false,
                        },
                    },
                ],
            },
        };
    },
};
</script>
