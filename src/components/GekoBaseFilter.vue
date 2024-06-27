<template>
  <div
    class="filters d-flex"
    style="width: 100%; flex-wrap: wrap"
    :class="{
      'pb-5': !mainFilter,
      'flex-row': !mainFilter,
      active: open,
    }"
  >
    <div class="filter-item mb-5" v-for="(item, i) in fields" :key="'hf-' + i">
      <geko-input
        v-model="formData[item.setter]"
        :item="{
          label: item.label,
          type: item.type,
          ic: 'filter-select',
          validation: [],
          option: item.option,
          api: item.getter,
          placeholder: item.label,
          param: item.param,
          default_label: item.option ? formData[item.option.default_label] : '',
        }"
        :disabled="item.disabled || false"
      />
    </div>
    <div
      class="filter-footer d-flex flex-row"
      style="align-items: center; width: 100%"
      v-if="!mainFilter"
    >
      <v-btn small variant="light" class="mr-3" @click="$emit('close', true)">
        <span>Batal</span>
      </v-btn>
      <v-btn small variant="info" @click="onFilter">
        <v-icon small>mdi-filter</v-icon>
        <span> Terapkan Filter</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "geko-base-filter",
  data() {
    return {
      formData: {},
    };
  },

  props: {
    fields: {
      type: Array,
      required: false,
      default: () => [],
    },

    mainFilter: {
      type: Boolean,
      required: false,
      default: false,
    },
    open: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  methods: {
    onFilter() {
      console.log("onfilter");
      this.$emit("filter", this.formData);
    },

    onReset() {
      let _defaultValue = {};
      for (const item of this.fields) {
        _defaultValue[item.setter] = null;
      }
      this.$emit("filter", _defaultValue);
    },
  },

  mounted() {
    console.log(this.fields);
  },
};
</script>
