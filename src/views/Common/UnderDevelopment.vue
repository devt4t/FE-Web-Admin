<template>
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

<style scoped>
.text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(60%);
}
.under-development {
  width: 100%;
  height: 100%;
  padding-block: 0.75em;
  padding-inline: 1.5em;
}

.wrapper {
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 14px;
}
</style>
<script>
import maintenanceAnimation from "@/assets/lottie/maintenance.json";
import LottieAnimation from "lottie-web-vue";
export default {
  components: {
    LottieAnimation,
  },
  name: "under-development",
  data() {
    return {
      lottie: maintenanceAnimation,
    };
  },
};
</script>
