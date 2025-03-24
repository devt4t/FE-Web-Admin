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
                variant="info"
                small
                class="d-flex flex-row align-items-center mt-2"
                @click="onExportDetailSelection(item)"
                v-if="$_sys.isAllowed('field-facilitator-update')"
            >
                <v-icon small class="mr-1">mdi-download</v-icon>
                <span>Export Detail</span>
            </v-btn>
        </template>
        <template v-slot:list-after-filter>
            <monitoring2-export-selection
                :data="detailData"
                :dataKey="detailDataKey"
            ></monitoring2-export-selection>
        </template>
    </geko-base-crud>

</template>

<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
import monitoring2Config from "./monitoring2Component/monitoring2Config";
import monitoring2Detail from "./monitoring2Detail.vue";
import monitoring2ExportSelection from "./monitoring2Component/monitoring2ExportSelection.vue";

export default {
    components: {
        LottieAnimation,
        monitoring2Detail,
        monitoring2ExportSelection
    },
    name: "crud-monitoring2",
    watch: {},
    data() {
        return {
            user: {},
            refreshKey: 1,
            config: monitoring2Config,
            lottie: maintenanceAnimation,
            
            detailData: null,
            detailDataKey: null,
        };
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem("User"));
        this.user = user;
    },
    methods: {
        onExportDetailSelection(item){
            this.detailData = item
            this.detailDataKey += 1
            console.log(this.detailData);
        }
    },
};
</script>