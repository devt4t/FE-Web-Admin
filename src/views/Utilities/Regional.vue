<!-- Contain Regional Datas -->
<template>
    <geko-base-crud :config="config">
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
            </div>
        </template>
    </geko-base-crud>
    
</template>

<script>
import regionConfig from "./regional/regionConfig";
export default {
    name: "crud-regional",
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
                getter: "new-utilities/region/list",
                getterDataKey: "result",
                
                setter: "new-utilities/region/create",
                pk_field: null,

                filter_api: {
                    project_modul: "type",
                },
                permission: {
                    create: "regional-create",
                    read: "regional-list",
                    update: "regional-update",
                    show: "regional-show",
                    lookup: "regional-lookup",
                    delete: "regional-delete",
                },
                slave: [],
                fields: regionConfig
            },
        };
    },
};
</script>
