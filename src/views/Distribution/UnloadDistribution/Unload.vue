<template>
    <geko-base-crud :config="config" :refreshKey="refreshKey" :hideUpdate="true" :hideDelete="true" :hideCreate="true">
        <template v-slot:list-bottom-action="{ item }">
            <v-btn variant="info" small class="mt-2" @click="onBASTCheck(item)">
                <v-icon left small>mdi-information-box-outline</v-icon>
                <span>Cek Status BAST</span>
            </v-btn>
        </template>
        <template v-slot:detail-slave-raw="{ data }">
            <unload-allocation-detail :data="data"></unload-allocation-detail>
        </template>
    </geko-base-crud>
    
    
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
import UnloadConfig from "./UnloadConfig";
import UnloadAllocationDetail from "./UnloadAllocationDetail.vue";
import LottieAnimation from "lottie-web-vue";
export default {
    components: {
        LottieAnimation,
        UnloadAllocationDetail
    },
    name: "crud-distribution-unload",
    watch: {},
    data() {
        return {
            refreshKey: 1,
            config: {
                title: "Distribution Unload",
                model_api: null,
                getter: "distribution/loading-line/list",
                getterDataKey: "data",
                totalDataKey: 'total',
                detail: "distribution/loading-line/detail",
                detailIdKey: "id",
                detailKey: "data.result",
                pk_field: null,
                globalFilter: {
                    program_year: {
                    setter: "program_year",
                    },
                },
                permission: {
                    read: "distribution-unload-list",
                    // update: "distribution-unload-update",
                    detail: "distribution-unload-detail",
                },
                slave: [],
                fields: UnloadConfig,
            },
            lottie: maintenanceAnimation,
        };
    },
    methods: {
        async onBASTCheck(item){
            const prompt = await this.$_alert.confirm('Cek Status BAST?', 'Apakah Anda Yakin Untuk Melakukan Cek Status BAST?', 'Ya, Verifikasi', 'Batal', true)
            if (prompt.isConfirmed) {
                // console.log(item)
                this.$_api.get('NurseryCheckDistributionBAST', {
                    loading_line_id: item.id,
                })
                    .then(() => {
                        this.$_alert.success('Berhasil Update Status BAST')
                        this.refreshKey += 1
                    })
            }
        }
        
        
    },
};
</script>