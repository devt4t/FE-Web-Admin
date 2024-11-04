<template>
    <!-- <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true"/> -->
    <div class="under-development">
        <div class="wrapper">
        <div class="text-wrapper">
            <h3>{{ $route.name.replace(/([a-z])([A-Z])/g, "$1 $2") }} Module</h3>
            <p class="mb-0 pb-0">is Under Development</p>
        </div>
        <LottieAnimation
            ref="anim"
            :animationData="lottie"
            :loop="true"
            style="height: 70vh"
        />
        </div>
    </div>
</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import plantingHoleConfig from "./PlantingHoleConfig";
import LottieAnimation from "lottie-web-vue";
export default {
    components: {
        LottieAnimation,
    },
    name: "crud-planting-hole",
    watch: {},
    data() {
        return {
            config: {
                title: "Lubang Tanam",
                model_api: null,
                getter: "new-planting-hole/list/main",
                totalDataKey: 'count_record',
                // setter: "ams/post_create",
                // update: "ams/post_update",
                // delete: "ams/post_delete",
                
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
                    // update: "lubang-tanam-update",
                    detail: "lubang-tanam-detail",
                    // lookup: "lubang-tanam-lookup",
                    // delete: "lubang-tanam-delete",
                },
                slave: [],
                fields: plantingHoleConfig,
            },
            lottie: maintenanceAnimation,
        };
    },
};
</script>