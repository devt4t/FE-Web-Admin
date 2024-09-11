<template>
  <div
    v-if="config && Array.isArray(config.fields)"
    :class="{
      [wc]: true,
    }"
    style="overflow-x: scroll"
  >
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th
            v-for="(h, i) in config.fields"
            :key="`header-${h.getter}-${i}`"
            :class="{
              [h.header_class || '']: true,
            }"
          >
            {{ h.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="Array.isArray(data)">
        <tr v-for="(d, i) in data" :key="`body-${i}-${d.id}`">
          <td
            v-for="(f, j) in [{ id: 1 }, ...config.fields]"
            :key="`body-${f.getter}-${i}-${j}`"
            :class="{
              [f.wc || '']: true,
            }"
          >
            <span v-if="j == 0">{{ i + 1 }}</span>
            <span v-else>
              <div
                v-if="f.getter == 'custom_dusun'"
                class="w-100 d-flex flex-row justify-content-center"
              >
                <v-btn
                  variant="info"
                  class="d-flex flex-row align-items-center w-100 py-2"
                  medium
                  v-if="d.potential == 1"
                  @click="$emit('detailDusun', d)"
                >
                  <v-icon medium>mdi-information-outline</v-icon>
                  <span class="ml-1">Detail Dusun</span>
                </v-btn>
                <span v-else>-</span>
              </div>
              <span v-else-if="f.translate">{{
                defaultData[f.translate].find((x) => x.code == [d[f.getter]])
                  ?.name | parse(f.transform || "no-empty")
              }}</span>
              <span
                :class="{
                  [typeof f.class === 'string' ? f.class : '' || '']: true,
                  [typeof f.class === 'object'
                    ? f.class[d[f.getter]]
                    : '']: true,
                }"
                v-else
                >{{ d[f.getter] | parse(f.transform || "no-empty") }}
              </span>
              <span v-if="f.append">{{ f.append }}</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="d-flex flex-column detail-table-description mt-3"
      v-if="description"
    >
      <div class="label text-08-em mb-1 text-grey">
        {{ config.description.label }}
      </div>

      <div class="value">
        {{ description }}
      </div>
    </div>
  </div>
</template>
<script>
import defaultData from "./RraPraData.js";
export default {
  name: "rra-pra-detail-table",
  props: {
    config: {
      default: null,
      required: false,
    },
    data: {
      default: () => [],
      required: false,
      type: Array,
    },
    description: {
      required: false,
      default: "default",
    },
    wc: {
      default: "",
      required: false,
      type: String,
    },
  },
  data() {
    return {};
  },

  computed: {
    defaultData() {
      return defaultData;
    },
  },
};
</script>
