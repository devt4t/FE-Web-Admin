<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:detail-slave-raw="{ data }">
            <monitoring-populate-detail :data="data"></monitoring-populate-detail>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import monitoringPopulateConfig from "./monitoringPopulateConfig";
import monitoringPopulateDetail from "./monitoringPopulateDetail.vue";

export default {
    components: {
        LottieAnimation,
        monitoringPopulateDetail
    },
    name: "crud-monitoringPopulate",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: monitoringPopulateConfig,
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