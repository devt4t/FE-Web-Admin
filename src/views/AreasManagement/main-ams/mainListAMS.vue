<template>
    <geko-base-crud :config="config" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:list-active_status="{ item }">
            <div class="d-flex flex-row" style="flex-wrap: wrap;">
                <span class="badge" :class="{
                    'bg-success': item.active_status == 1,
                    'bg-danger': item.active_status == 0
                }">
                    <span v-if="item.active_status == 1">Aktif</span>
                    <span v-else-if="item.active_status == 0">Tidak Aktif</span>
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
                title: "Regional",
                model_api: null,
                getter: "new-utilities/region/list",
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