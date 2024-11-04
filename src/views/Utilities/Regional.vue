<!-- Contain Regional Datas -->
<template>
    <geko-base-crud :config="config"/>    
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
                update: "new-utilities/region/update",
                delete: "new-utilities/region/delete",
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
