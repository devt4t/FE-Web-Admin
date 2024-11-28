<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true"/>
    <!-- <div class="under-development">
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
    </div> -->
</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import areamanagementconfig from "./amsConfig";
import LottieAnimation from "lottie-web-vue";
export default {
    components: {
        LottieAnimation,
    },
    name: "crud-area-management-system",
    watch: {},
    data() {
        return {
            refreshKey: 1,
            config: {
                title: "Area Management System",
                model_api: null,
                getter: "ams/get-list",
                getterDataKey: "result",
                totalDataKey: 'count_record',
                setter: "ams/post_create",
                update: "ams/post_update",
                delete: "ams/post_delete",
                
                deleteKey: "id",
                pk_field: null,
                globalFilter: {
                    program_year: {
                    setter: "program_year",
                    },
                },
                permission: {
                    create: "area-management-system-create",
                    read: "area-management-system-list",
                    update: "area-management-system-update",
                    detail: "area-management-system-detail",
                    lookup: "area-management-system-lookup",
                    delete: "area-management-system-delete",
                },
                slave: [],
                fields: areamanagementconfig,
            },
            lottie: maintenanceAnimation,
        };
    },
};
</script>