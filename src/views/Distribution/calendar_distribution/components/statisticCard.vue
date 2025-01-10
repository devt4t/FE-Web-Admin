<template>
  <v-card rounded="xl" :class="`statistic-card ${item.color} elevation-0`">
    <v-card-text class="d-flex align-items-center py-3">
      <v-icon class="mr-2" :color="item.color">{{ item.icon }}</v-icon>
      <div :class="`statistic-data`">
        <p class="mb-0 label">{{ item.title }}</p>
        <p class="mb-0 value font-weight-bold h1">
          <number
            :class="`value`"
            :format="$store.getters.numberFormat"
            :from="item.from || 0"
            :to="item.value"
            :duration="item.duration || 3"
            :delay="item.delay || 0"
            easing="Power2.easeInOut"
          />
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import "./statistic-card.scss";

export default {
  name: "GekoStatisticCard",

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>