<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true">
        <template v-slot:detail-slave-raw="{ data }">
            <!-- <lahan-umum-planting-hole-detail-map
              :long="data.result.longitude"
              :lat="data.result.latitude"
              :section="`LahanUmum`"
            /> -->
            <lahan-umum-planting-hole-detail :data="data"></lahan-umum-planting-hole-detail>
        </template>
        <template v-slot:create-form>
            <lahan-umum-planting-hole-create :user="user"></lahan-umum-planting-hole-create>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import LahanUmumPlantingHoleConfig from "./LahanUmumPlantingHoleConfig";
import LahanUmumPlantingHoleDetail from "./LahanUmumPlantingHoleDetail.vue";
import LahanUmumPlantingHoleDetailMap from "@/views/Lahan/components/DetailLahanMap";
import LahanUmumPlantingHoleCreate from "./lahanUmumPlantingHoleCreate.vue"

export default {
    components: {
        LottieAnimation,
        LahanUmumPlantingHoleDetail,
        LahanUmumPlantingHoleDetailMap,
        LahanUmumPlantingHoleCreate
    },
    name: "crud-public-land-planting-hole",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: {
                export: true,
                title: "Penilikan Lubang Lahan Umum / Event",
                getter: "lahan-umum/planting-hole/list",
                getterDataKey: "result",
                totalDataKey: 'total',
                detail: "lahan-umum/planting-hole/detail",
                detailIdKey: "id",
                detailKey: "result",
                deleteKey: "id",
                pk_field: null,
                globalFilter: {
                    program_year: {
                        setter: "program_year",
                    },
                },
                permission: {
                    create: "lubang-tanam-create",
                    read: "lubang-tanam-list",
                    update: "lubang-tanam-update",
                    detail: "lubang-tanam-detail",
                    lookup: "lubang-tanam-lookup",
                    delete: "lubang-tanam-delete",
                },
                slave: [],
                fields: LahanUmumPlantingHoleConfig,
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