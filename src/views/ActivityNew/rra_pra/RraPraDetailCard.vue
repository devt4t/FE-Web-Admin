<template>
  <div v-if="data">
    <h4 v-if="title" class="mb-2">{{ title }}</h4>
    <div class="detail-card-list">
      <div
        class="detail-card-item"
        :class="{
          [ic]: true,
        }"
        v-for="(c, i) in config"
        :key="`main-config-rra-${i}`"
      >
        <p class="label">{{ c.label }}</p>
        <span class="value" v-if="c.translate">{{
          defaultData[c.translate].find((x) => x.code == getValue(c.getter))
            ?.name | parse(c.transform || "no-empty")
        }}</span>
        <p class="value" v-else>
          {{ getValue(c.getter) | parse(c.transform || "no-empty") }}
          <span v-if="c.append && getValue(c.getter)">{{ c.append }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import defaultData from "./RraPraData.js";
export default {
  name: "rra-pra-detail-card",
  data() {
    return {};
  },

  methods: {
    getValue(key) {
      const keys = key.split(".");

      var values = this;
      for (const _key of keys) {
        // if (values[_key]) {
        values = values[_key];
        // }
      }

      return values || 0;
    },
  },
  props: {
    data: {
      requried: false,
      default: null,
    },

    scoopingData: {
      requried: false,
      default: null,
    },

    config: {
      required: false,
      default: () => [],
    },
    title: {
      required: false,
      default: null,
    },
    ic: {
      required: false,
      default: "",
    },
  },

  computed: {
    defaultData() {
      return defaultData;
    },
  },
};
</script>
