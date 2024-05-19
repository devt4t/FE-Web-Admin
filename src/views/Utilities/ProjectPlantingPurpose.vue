<template>
    <geko-base-crud :config="config">
        <template v-slot:list-created_by="{ item }">
            {{ item.created_by }}
        </template>
    </geko-base-crud>
</template>

<script>
export default {
    name: "crud-planting-purpose",
    watch: {},
    data() {
        return {
            config: {
                title: "Planting Purpose",
                program_year: {
                    show: false,
                    model: "2024",
                },
                model_api: null,
                getter: "getAllProjectUtils",
                setter: "addProjectUtils",
                setter_ext_payload: {
                    project_modul: 'purpose',
                },
                update: "updateProjectUtils",
                update_ext_payload: {
                    project_modul: 'purpose',
                },
                delete: "deleteProjectUtils",
                delete_ext_payload: {
                    delete_type: "hard_delete",
                    project_modul: 'purpose',
                },
                deleteKey: "code",
                pk_field: null,
                filter_api: {
                    project_modul: 'purpose',
                },
                permission: {
                    create: "planting-purpose-create",
                    read: "planting-purpose-list",
                    update: "planting-purpose-update",
                    show: "planting-purpose-show",
                    lookup: "planting-purpose-lookup",
                    delete: "planting-purpose-delete",
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