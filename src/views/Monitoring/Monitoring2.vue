<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">

    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import monitoring2Config from "./monitoring2Component/monitoring2Config";

export default {
    components: {
        LottieAnimation,
    },
    name: "crud-monitoring2",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: monitoring2Config,
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