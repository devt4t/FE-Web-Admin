<template>
    <geko-base-crud :config="config" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:list-potential_status="{ item }">
            <div class="d-flex flex-row" style="flex-wrap: wrap;">
                <span class="badge" :class="{
                    'bg-info': item.potential_status == 2 || item.potential_status == 4,
                    'bg-light': item.potential_status == 3,
                    'bg-danger': item.potential_status == 0
                }">

                    <span v-if="[2, 4].includes(item.potential_status)">Potensial Carbon</span>
                    <span v-else-if="item.potential_status == 3">Potensial Non Carbon</span>
                    <span v-else-if="item.potential_status == 0"> Tidak Potensial</span>
                    <span v-else>-</span>
                </span>
                <span class="badge bg-light" v-if="item.potential_status == 4">Potensial Non Carbon</span>
            </div>
        </template>

        <template v-slot:list-program_year="{ item }">
            <span class="badge bg-primary">{{ $_config.programYear.model }}</span>
        </template>
    </geko-base-crud>
</template>

<script>
export default {
    name: "crud-village",
    watch: {},
    data() {
        return {
            config: {
                title: "Desa",
                model_api: null,
                getter: "new-utilities/desas",
                totalDataKey: 'count_record',
                setter: "addProjectUtils",
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
                deleteKey: "code",
                pk_field: null,
                filter_api: {
                    project_modul: "purpose",
                },
                permission: {
                    create: "desa-create",
                    read: "desa-list",
                    update: "desa-update",
                    detail: "desa-detail",
                    lookup: "desa-lookup",
                    delete: "desa-delete",
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
                        id: "name",
                        label: "Desa",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"], setter: "new_name" },
                            filter: false,
                        },
                    },

                    {
                        id: "kode_desa",
                        label: "Kode Desa",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"] },
                            filter: false,
                        },
                    },

                    {
                        id: "kecamatans_name",
                        label: "Kecamatan",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"] },
                            filter: false,
                        },
                    },

                    {
                        id: "kabupatens_name",
                        label: "Kabupaten",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"] },
                            filter: false,
                        },
                    },

                    {
                        id: "post_code",
                        label: "Kode Pos",
                        methods: {
                            list: true,
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"] },
                            filter: false,
                        },
                    },

                    {
                        id: "potential_status",
                        label: "Status",
                        methods: {
                            list: {
                                type: 'row-slot'
                            },
                            detail: true,
                            create: { validation: ["required"] },
                            update: { validation: ["required"] },
                            filter: false,
                        },
                    },

                    {
                        id: "program_year",
                        label: "Tahun Program",
                        methods: {
                            list: {
                                type: 'row-slot'
                            },
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