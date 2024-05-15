<template>
    <geko-base-crud :config="config" />
</template>

<script>
export default {
    name: "crud-planting-environment",
    watch: {},
    data() {
        return {
            config: {
                title: "Planting Environment",
                model_api: null,
                getter: "getAllProjectUtils",
                setter: "planting-environment",
                pk_field: null,

                filter_api: {
                    project_modul: "type",
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
                            update: { validation: ["required"] },
                            filter: false,
                        },
                    },

                    {
                        id: "created_by",
                        label: "Created By",
                        methods: {
                            list: true,
                            detail: true,
                            create: { 
                                input: false,
                                default: 'current_user_id'
                             },
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
