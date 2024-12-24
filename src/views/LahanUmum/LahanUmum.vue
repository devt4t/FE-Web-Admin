<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true">
        <template v-slot:detail-slave-raw="{ data }">
            <lahan-umum-detail-map
              :long="data.result.longitude"
              :lat="data.result.latitude"
              :section="`LahanUmum`"
            />
            <lahan-umum-detail :data="data"></lahan-umum-detail>
        </template>
        <template v-slot:create-form>
            <lahan-umum-create :user="user"></lahan-umum-create>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import LahanUmumConfig from "./LahanUmumConfig";
import LahanUmumDetail from "./LahanUmumDetail.vue";
import LahanUmumDetailMap from "@/views/Lahan/components/DetailLahanMap";
import LahanUmumCreate from "./lahanUmumCreate.vue"

export default {
    components: {
        LottieAnimation,
        LahanUmumDetail,
        LahanUmumDetailMap,
        LahanUmumCreate
    },
    name: "crud-public-land",
    watch: {},
    data() {
        return {
            user: {},
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