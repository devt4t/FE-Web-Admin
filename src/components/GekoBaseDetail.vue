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
      <div class="geko-base-detail-wrapper">
        <div class="geko-base-detail-list">
          <template v-for="(item, i) in fields">
            <slot :name="`detail-row-${item.view_data}`" v-bind:item="data">
              <div
                class="geko-base-detail-item"
                :key="'base-detail' + i"
                v-if="item.type !== 'row-slot'"
              >
                <div class="label">
                  <p class="mb-0 pb-0">{{ item.label }}</p>
                </div>
                <div class="value">
                  <p class="mb-0 pb-0">
                    <slot
                      v-if="item.type === 'slot'"
                      :name="`detail-${item.view_data}`"
                      v-bind:item="data"
                    >
                    </slot>
                    <span
                      v-if="item.type === 'text'"
                      :class="{
                        [item.class
                          ? typeof item.class === 'object'
                            ? item.class[data[item.view_data]]
                            : typeof item.class == 'string'
                            ? data[item.view_data]
                            : ''
                          : '']: true,
                      }"
                      >{{ data[item.view_data] | parse(item.transform) }}</span
                    >
                  </p>
                </div>
              </div>
            </slot>
          </template>
        </div>
      </div>
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
  mounted() {
    console.log(this.fields);
    if (this.api) {
      this.getData();
    } else {
      this.data = this.$route.params;
    }
  },

  methods: {
    getData() {
      this.$_api.get(this.api).then((res) => {
        console.log("res", res);
      });
    },
  },
};
</script>
