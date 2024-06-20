<template>
  <v-card
    data-aos="fade-up"
    data-aos-delay="100"
    data-aos-duration="800"
    class="geko-base-detail-card mb-5"
  >
    <v-card-title>
      <v-icon large class="mr-2" @click="$router.go(-1)"
        >mdi-arrow-left-circle</v-icon
      >
      <h4 class="mb-0 pb-0">Detail {{ title }}</h4>
    </v-card-title>
    <slot name="detail-body">
      <div class="geko-base-detail-wrapper"></div>
    </slot>
  </v-card>
</template>

<script>
export default {
  name: "geko-base-detail",
  props: {
    title: {
      type: String,
      required: false,
    },
    api: {
      type: String,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    param: {
      type: Object,
      required: false,
      defualt: () => {},
    },
  },
  data() {
    return {
      loading: true,
      data: {},
    };
  },
};
</script>
