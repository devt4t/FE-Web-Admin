<!-- This Is Base Model For Planting Hole Survielliance -->
<template>
    <!-- <geko-base-crud :config="config" :refreshKey="refreshKey" :hideDetail="true" :hideUpdate="true"/> -->
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
import LottieAnimation from "lottie-web-vue";
import config from './PlantingHoleConfig'

import "./planting-hole.scss";
export default {
    name: "crud-planting_hole_surviellance",
    components: {
        LottieAnimation
    },
    watch: {},
    methods: {
        
    },
    lottie: maintenanceAnimation,
    data() {
        return config
    },
};
</script>