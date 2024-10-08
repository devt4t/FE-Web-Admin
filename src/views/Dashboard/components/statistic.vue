<template>
  <div>
    <!-- header -->
    <div class="d-flex align-items-center">
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
      ></v-autocomplete>
    </div>

    <!-- statistic data -->
    <b-row class="my-0">
      <b-col cols="auto"
        v-for="(data, i) in datas"
        :key="`statistic${i}`"
      >
        <v-card 
          class="d-flex flex-column justify-content-center align-items-center pa-4" 
          rounded="xl"
          style="min-width: 200px;"
          data-aos="fade-down"
          :data-aos-delay="i * 200"
        >
          <v-avatar v-if="!data.badge" size="75" :class="`${data.color} lighten-5`">
            <v-icon size="xx-large" :color="data.color">{{ data.icon }}</v-icon>
          </v-avatar>
          <v-badge
            v-else
            bordered
            :color="data.badge.color || data.color"
            :icon="data.badge.icon"
            overlap
            bottom
          >
            <v-avatar size="75" :class="`${data.color} lighten-5`">
              <v-icon size="xx-large" :color="data.color">{{ data.icon }}</v-icon>
            </v-avatar>
          </v-badge>
          <p class="mt-1 mb-0">{{ data.label }}</p>
          <p class="mb-2 text-subtitle-2 font-italic grey--text">{{ data.subtitle }}</p>
          
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
          <p class="mb-0 text-caption text--secondary">{{ data.suffix }}</p>
        </v-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'GekoStatistic',

  data() {
    return {
      datas: [
        {
          label: 'Field Facilitator',
          icon: 'mdi-account-supervisor',
          color: 'indigo',
          subtitle: '.',
          value: 0,
          isLoading: true,
          suffix: 'Orang',
        },
        {
          label: 'Petani',
          icon: 'mdi-account-cowboy-hat-outline',
          color: 'amber',
          subtitle: '.',
          value: 0,
          isLoading: true,
          suffix: 'Orang',
          badge: {
            icon: 'mdi-check-all',
          }
        },
        {
          label: 'Lahan',
          icon: 'mdi-land-fields',
          color: 'green',
          subtitle: 'Carbon',
          value: 0,
          isLoading: true,
          suffix: 'Lahan',
          badge: {
            icon: 'mdi-check-all',
          }
        },
        {
          label: 'Lahan',
          icon: 'mdi-land-fields',
          color: 'light-green',
          subtitle: 'Non-Carbon',
          value: 0,
          isLoading: true,
          suffix: 'Lahan',
          badge: {
            icon: 'mdi-check-all',
          }
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
        source: {
          model: "Pendataan",
          options: [
            "Pendataan",
            "Sosialisasi Tanam",
            "Penilikan Lubang",
            "Distribusi",
            "Realisasi Tanam",
          ],
        },
      },
    };
  },

  methods: {
    getOptionsData: async function (params) {
      let urlEndpoint = '';
      let items = [];

      if (params.type == "mu_no")
        urlEndpoint = `GetManagementUnit`;

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
    initData: async function () {
      this.options.programYear = this.$store.state.programYear.model;

      // get mu options data
      this.options.mu_no.items = await this.getOptionsData({
        program_year: this.options.programYear,
        type: "mu_no",
      });
    },
    onChange: async function (type) {
      if (type == 'py') {
        // get mu options data
        this.options.mu_no.items = await this.getOptionsData({
          program_year: this.options.programYear,
          type: "mu_no",
        });
      }
    }
  },

  mounted() {
    this.initData()
  },
};
</script>