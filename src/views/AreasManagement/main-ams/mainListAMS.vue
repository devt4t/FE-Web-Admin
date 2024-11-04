<template>
    <!-- <geko-base-crud :config="config" :hideUpdate="true" :hideDelete="true" :hideCreate="true"/> -->
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
            config: {
                title: "Area Management System",
                model_api: null,
                getter: "ams/get-list",
                totalDataKey: 'count_record',
                setter: "ams/post_create",
                // setter_ext_payload: {
                //     project_modul: "purpose",
                // },
                update: "updateProjectUtils",
                // update_ext_payload: {
                //     project_modul: "purpose",
                // },
                delete: "deleteProjectUtils",
                // delete_ext_payload: {
                //     delete_type: "hard_delete",
                //     project_modul: "purpose",
                // },
                deleteKey: "id",
                pk_field: null,
                // filter_api: {
                //     project_modul: "purpose",
                // },
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