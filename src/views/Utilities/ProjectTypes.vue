<template>
    <geko-base-crud :config="config">
    </geko-base-crud>
</template>

<script>
export default {
    name: "crud-project-type",
    watch: {},
    data() {
        return {
            config: {
                title: "Project Type",
                program_year: {
                    show: false,
                    model: "2024",
                },
                model_api: null,
                getter: "getAllProjectUtils",
                setter: "addProjectUtils",
                setter_ext_payload: {
                    project_modul: 'type',
                },
                update: "updateProjectUtils",
                update_ext_payload: {
                    project_modul: 'type',
                },
                delete: "deleteProjectUtils",
                delete_ext_payload: {
                    delete_type: "hard_delete",
                    project_modul: 'type',
                },
                deleteKey: "code",
                pk_field: null,
                filter_api: {
                    project_modul: 'type',
                },
                permission: {
                    create: "project-type-create",
                    read: "project-type-list",
                    update: "project-type-update",
                    show: "project-type-show",
                    lookup: "project-type-lookup",
                    delete: "project-type-delete",
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