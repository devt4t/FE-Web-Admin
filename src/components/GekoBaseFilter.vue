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
    <div class="filter-item mb-5" v-for="(item, i) in filters" :key="'hf-' + i">
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
          param: item.param
            ? {
                ...item.param,
                ...getParams[item.setter],
              }
            : {},
          default_label: item.option ? formData[item.option.default_label] : '',
        }"
        :disabled="
          typeof getParams[item.setter].disabled === 'boolean'
            ? getParams[item.setter].disabled
            : false
        "
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
      filters: [],
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
    onInit() {
      console.log("fields", this.fields);

      for (const filter of this.fields) {
        // if (
        //   filter.param &&
        //   filter.param.program_year == "current_program_year"
        // ) {
        //   filter.param.program_year = this.$store.state.tmpProgramYear;
        // }

        if (filter.param) {
          for (const param of Object.keys(filter.param)) {
            console.log(filter.param, param);
            if (!filter.param[param]) continue;
            if (filter.param[param] == "current_program_year") {
              console.log("test", filter.param, param);
              filter.param[param] = this.$store.state.tmpProgramYear;
            } else if (
              typeof filter.param[param] === "string" &&
              filter.param[param].split(".").length > 1 &&
              filter.param[param].split(".")[0] == "form"
            ) {
              filter.param[param] =
                this.formData[filter.param[param].split(".")[1]];

              filter.disabled = !this.formData[filter.param[param]];
            }
          }
        }
      }

      console.log(this.fields);
      this.filters = this.fields;
    },
    onFilter() {
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
  computed: {
    getParams() {
      const result = {};
      for (const value of this.fields) {
        if (!value.form_param) {
          result[value.setter] = {
            disabled: value.disabled || false,
          };
          continue;
        }

        let _tmpValue = {};
        for (const param of Object.keys(value.form_param)) {
          _tmpValue[param] = this.formData[value.form_param[param]];
        }
        let _disabled = false;
        for (const value of Object.keys(_tmpValue)) {
          if (!_tmpValue[value]) {
            _disabled = true;
          }
        }
        _tmpValue.disabled = _disabled;
        result[value.setter] = _tmpValue;
      }

      return result;
    },
  },

  mounted() {
    this.onInit();
  },

  watch: {
    fields() {
      this.onInit();
    },
  },
};
</script>
