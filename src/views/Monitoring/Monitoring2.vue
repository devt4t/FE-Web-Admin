<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:detail-slave-raw="{ data }">
            <monitoring2-detail :data="data"></monitoring2-detail>
        </template>
        <template v-slot:list-indicator="{ item }">
            <div class="indicator-wrapper pt-1">
                <div
                class="indicator"
                :class="{
                    danger: item.is_verified == 0,
                    warning: item.is_verified == 1,
                    success: item.is_verified == 2,
                    }"
                ></div>
            </div>
        </template>
        <template v-slot:list-bottom-action="{ item }">
            <v-btn
                variant="success"
                small
                class="d-flex flex-row align-items-center mt-2"
                @click="onExportDetailExcel(item)"
                v-if="$_sys.isAllowed('field-facilitator-update')"
            >
                <v-icon small class="mr-1">mdi-microsoft-excel</v-icon>
                <span>Export Detail Excel</span>
            </v-btn>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import monitoring2Config from "./monitoring2Component/monitoring2Config";
import monitoring2Detail from "./monitoring2Detail.vue";

export default {
    components: {
        LottieAnimation,
        monitoring2Detail
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