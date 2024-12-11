<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:detail-slave-raw="{ data }">
            <lahan-umum-detail :data="data"></lahan-umum-detail>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import LahanUmumConfig from "./LahanUmumConfig";
import LahanUmumDetail from "./LahanUmumDetail.vue";

export default {
    components: {
        LottieAnimation,
        LahanUmumDetail
    },
    name: "crud-public-land",
    watch: {},
    data() {
        return {
            refreshKey: 1,
            config: {
                export: true,
                title: "Lahan Umum",
                getter: "lahan-umum/main/list",
                getterDataKey: "result",
                totalDataKey: 'total',
                detail: "lahan-umum/main/detail",
                detailIdKey: "id",
                detailKey: "result",
                // deleteKey: "id",
                pk_field: null,
                globalFilter: {
                    program_year: {
                        setter: "program_year",
                    },
                },
                permission: {
                    create: "lahan-umum-create",
                    read: "lahan-umum-list",
                    update: "lahan-umum-update",
                    detail: "lahan-umum-detail",
                    lookup: "lahan-umum-lookup",
                    delete: "lahan-umum-delete",
                },
                slave: [],
                fields: LahanUmumConfig,
            },
            lottie: maintenanceAnimation,
            exportModal: 0,
            exportFormat: null
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods: {
        
    },
};
</script>