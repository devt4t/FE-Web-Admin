<template>
  <div>
    <!-- header -->
    <div class="d-flex align-items-center" data-aos="fade-left">
      <v-icon class="mr-2">mdi-counter</v-icon>
      Jumlah Data
      <v-divider class="mx-2"></v-divider>
      <!-- program_year -->
      <!-- <geko-input
        v-model="options.programYear"
        :item="{
          label: 'Program',
          validation: [],
          type: 'select',
          optionList: []
        }"
      /> -->
      <v-select
        dense
        hide-details
        rounded
        outlined
        color="success"
        item-color="success"
        class="mt-2 mr-1"
        label="Tahun Program"
        :rules="[(v) => !!v || 'Field is required']"
        v-model="options.programYear"
        :disabled="isLoading"
        :items="$store.state.programYear.options"
        :menu-props="{
          rounded: 'xl',
          offsetY: true,
          transition: 'slide-y-transition',
          dark: $store.state.theme == 'dark',
        }"
        style="max-width: 175px"
        @change="onChange('py')"
      ></v-select>
      <!-- mu_no -->
      <v-autocomplete
        v-if="options.mu_no.show"
        dense
        hide-details
        rounded
        outlined
        clearable
        :loading="isLoading"
        color="success"
        item-color="success"
        class="mt-2 ml-1"
        label="Management Unit"
        :menu-props="{
          rounded: 'xl',
          offsetY: true,
          transition: 'slide-y-transition',
          dark: $store.state.theme == 'dark',
        }"
        item-text="name"
        item-value="mu_no"
        placeholder="Semua"
        v-model="options.mu_no.model"
        :items="options.mu_no.items"
        :disabled="isLoading"
        style="max-width: 250px"
        @change="onChange('mu_no')"
      ></v-autocomplete>
    </div>

    <!-- statistic data -->
    <b-row class="my-0">
      <b-col cols="auto" v-for="(data, i) in datas" :key="`statistic${i}`">
        <div
          class="flip-card"
          @click="data.directUrl ? $router.push(data.directUrl) : null"
        >
          <div :class="`flip-card-inner ${data.flip ? 'active-flip' : ''}`">
            <div class="flip-card-front">
              <v-card
                :id="`statistic-card${data.flip ? '-flip' : ''}`"
                class="d-flex flex-column justify-content-center align-items-center pa-4 pt-7"
                rounded="xl"
                style="min-width: 200px"
                data-aos="fade-left"
                :data-aos-delay="i * 200"
              >
                <v-progress-circular
                  v-if="!data.isLoading && data.flip && data.flip.isLoading"
                  indeterminate
                  :color="data.flip.color"
                  size="15"
                  class="loading-flip"
                ></v-progress-circular>
                <v-avatar
                  v-if="!data.badge"
                  size="75"
                  :class="`${data.color} lighten-5`"
                >
                  <v-icon size="xx-large" :color="data.color">{{
                    data.icon
                  }}</v-icon>
                </v-avatar>
                <v-badge
                  v-else
                  bordered
                  :color="data.badge.color || data.color"
                  :icon="data.badge.icon"
                  overlap
                  :bottom="
                    !data.badge.position || data.badge.position == 'bottom'
                  "
                  :top="data.badge.position == 'top'"
                >
                  <v-avatar size="75" :class="`${data.color} lighten-5`">
                    <v-icon size="xx-large" :color="data.color">{{
                      data.icon
                    }}</v-icon>
                  </v-avatar>
                </v-badge>
                <p class="mt-1 mb-0">{{ data.label }}</p>
                <p class="mb-2 text-subtitle-2 font-italic grey--text">
                  {{ data.subtitle }}
                </p>

                <v-progress-circular
                  v-if="data.isLoading"
                  indeterminate
                  :color="data.color"
                  size="28"
                  class="mb-1"
                ></v-progress-circular>
                <number
                  v-else
                  :class="`text-h5 font-weight-bold ${data.color}--text`"
                  :format="_utils.numberFormat"
                  :from="0"
                  :to="data.value"
                  :duration="3"
                  :delay="0"
                  easing="Power2.easeInOut"
                />
                <p class="mb-0 text-caption text--secondary">
                  {{ data.suffix }}
                </p>
              </v-card>
            </div>
            <div class="flip-card-back" v-if="data.flip">
              <v-card
                :id="`statistic-card${data.flip ? '-flip' : ''}`"
                class="d-flex flex-column justify-content-center align-items-center pa-4 pt-7"
                rounded="xl"
                style="min-width: 200px"
                data-aos="fade-left"
                :data-aos-delay="i * 200"
              >
                <v-avatar
                  v-if="!data.flip.badge"
                  size="75"
                  :class="`${data.flip.color} lighten-5`"
                >
                  <v-icon size="xx-large" :color="data.flip.color">{{
                    data.flip.icon
                  }}</v-icon>
                </v-avatar>
                <v-badge
                  v-else
                  bordered
                  :color="data.flip.badge.color || data.flip.color"
                  :icon="data.flip.badge.icon"
                  overlap
                  bottom
                >
                  <v-avatar size="75" :class="`${data.flip.color} lighten-5`">
                    <v-icon size="xx-large" :color="data.flip.color">{{
                      data.flip.icon
                    }}</v-icon>
                  </v-avatar>
                </v-badge>
                <p class="mt-1 mb-0">{{ data.flip.label }}</p>
                <p class="mb-2 text-subtitle-2 font-italic grey--text">
                  {{ data.flip.subtitle }}
                </p>

                <v-progress-circular
                  v-if="data.flip.isLoading"
                  indeterminate
                  :color="data.flip.color"
                  size="28"
                  class="mb-1"
                ></v-progress-circular>
                <number
                  v-else
                  :class="`text-h5 font-weight-bold ${data.flip.color}--text`"
                  :format="_utils.numberFormat"
                  :from="0"
                  :to="data.flip.value"
                  :duration="3"
                  :delay="0"
                  easing="Power2.easeInOut"
                />
                <p class="mb-0 text-caption text--secondary">
                  {{ data.flip.suffix }}
                </p>
              </v-card>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "GekoStatistic",

  data() {
    return {
      datas: [
        // FF
        {
          label: "Field Facilitator",
          icon: "mdi-account-supervisor",
          color: "purple",
          subtitle: ".",
          value: 0,
          isLoading: true,
          suffix: "Orang",
          directUrl: "field-facilitator-v2?view=list",
          badge: {
            position: "top",
          },
          api: {
            endpoint: "new-dashboard/ff",
            params: {
              active: 1,
            },
          },
        },
        // Petani
        {
          label: "Petani",
          icon: "mdi-account-cowboy-hat-outline",
          color: "light-blue",
          subtitle: ".",
          value: 0,
          isLoading: true,
          suffix: "Orang",
          badge: {
            icon: "mdi-check-all",
          },
          api: {
            endpoint: "new-dashboard/farmers",
            params: {
              approve: 1,
            },
          },
          directUrl: "farmer-v2?view=list",
        },
        // Lahan Non-Carbon
        {
          label: "Lahan",
          icon: "mdi-land-fields",
          color: "light-green",
          subtitle: "Non-Carbon",
          value: 0,
          isLoading: true,
          suffix: "Lahan",
          badge: {
            icon: "mdi-check-all",
          },
          api: {
            endpoint: "new-dashboard/land-by-purpose",
            params: {
              project_purpose: "non-carbon",
              approve: 2,
            },
          },
          directUrl: "lahan-v2?view=list",
          flip: {
            label: "Lahan",
            icon: "mdi-land-fields",
            color: "orange",
            subtitle: "Non-Carbon",
            value: 0,
            isLoading: true,
            suffix: "Lahan",
            api: {
              endpoint: "new-dashboard/land-by-purpose",
              params: {
                project_purpose: "non-carbon",
              },
            },
          },
        },
        // Lahan Carbon
        {
          label: "Lahan",
          icon: "mdi-land-fields",
          color: "green",
          subtitle: "Carbon",
          value: 0,
          isLoading: true,
          suffix: "Lahan",
          badge: {
            icon: "mdi-check-all",
          },
          api: {
            endpoint: "new-dashboard/land-by-purpose",
            params: {
              project_purpose: "carbon",
              approve: 2,
            },
          },
          directUrl: "lahan-v2?view=list",
          flip: {
            label: "Lahan",
            icon: "mdi-land-fields",
            color: "orange",
            subtitle: "Carbon",
            value: 0,
            isLoading: true,
            suffix: "Lahan",
            api: {
              endpoint: "new-dashboard/land-by-purpose",
              params: {
                project_purpose: "carbon",
              },
            },
          },
        },
      ],
      isLoading: false,
      options: {
        programYear: "2024",
        mu_no: {
          disabled: false,
          show: true,
          model: "",
          items: [],
        },
      },
    };
  },

  methods: {
    getOptionsData: async function (params) {
      let urlEndpoint = "";
      let items = [];

      if (params.type == "mu_no") urlEndpoint = `GetManagementUnit`;

      if (urlEndpoint) {
        console.log(this.$store.state.token);
        const res = await this.$_api.get(urlEndpoint, {
          program_year: params.program_year,
        });

        items = res.data.result;

        if (items.length > 0) {
          if (["mu_no"].includes(params.type))
            items = items.sort((a, b) => a.name.localeCompare(b.name));
        }
      }

      return items;
    },
    getStatisticData: async function () {
      try {
        // show loading
        this.isLoading = true;
        this.datas.map((v) => {
          v.isLoading = true;
          if (v.flip) {
            v.flip.isLoading = true;
          }
        });

        for (const [key, data] of Object.entries(this.datas)) {
          if (!data.api || !data.api.endpoint) {
            data.value = "???";
            data.isLoading = false;
            continue;
          }

          // set params
          let params = {
            program_year: this.options.programYear,
            mu_no: this.options.mu_no.model,
          };
          if (data.api.params)
            params = {
              ...params,
              ...data.api.params,
            };

          // call api
          const { result: res } = await this.$_api.get(
            data.api.endpoint,
            params
          );
          data.value = res;
          data.isLoading = false;

          // get flip data
          if (data.flip) {
            if (!data.flip.api || !data.flip.api.endpoint) {
              data.flip.value = "???";
              data.flip.isLoading = false;
              continue;
            }

            // set params
            let paramsFlip = {
              program_year: this.options.programYear,
              mu_no: this.options.mu_no.model,
            };
            if (data.flip.api.params)
              paramsFlip = {
                ...paramsFlip,
                ...data.flip.api.params,
              };

            // call api
            const { result: res } = await this.$_api.get(
              data.flip.api.endpoint,
              paramsFlip
            );
            data.flip.value = res;
            data.flip.isLoading = false;
          }
        }
      } catch (err) {
        console.log("getStatisticData() err", err);
        this.$_alert.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    initData: async function () {
      this.options.programYear = this.$store.state.programYear.model;

      // get mu options data
      this.getOptionsData({
        program_year: this.options.programYear,
        type: "mu_no",
      }).then((res) => {
        this.options.mu_no.items = res;
      });

      // get statistic data
      await this.getStatisticData();
    },
    onChange: async function (type) {
      if (type == "py") {
        // get mu options data
        this.getOptionsData({
          program_year: this.options.programYear,
          type: "mu_no",
        }).then((res) => {
          this.options.mu_no.items = res;
        });
      }
      // get statistic data
      await this.getStatisticData();
    },
  },

  mounted() {
    this.initData();
  },
};
</script>

<style>
.flip-card {
  background-color: transparent;
  min-width: 200px;
  height: 220px;
  transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover {
    cursor: pointer;
    transform: translateY(-10px);
  }
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner.active-flip {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-front {
}

.flip-card-back {
  transform: rotateY(180deg);
}

.loading-flip {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>