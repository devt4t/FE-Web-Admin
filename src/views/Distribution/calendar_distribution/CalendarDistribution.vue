<template>
  <div>
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      class="breadcrumbsmain"
      :items="[
        {
          text: 'Menu',
          disabled: true,
          href: 'breadcrumbs_dashboard',
        },
        {
          text: `${config.title}`,
          disabled: true,
          href: 'breadcrumbs_link_1',
        },
      ]"
      divider=">"
      large
      data-aos="fade-right"
    ></v-breadcrumbs>
    <v-container fluid>
      <!-- dialogs -->
      <CalendarDistributionDialog
        :show="selectedOpen"
        :selectedData="selectedEvent"
        @hide="() => (selectedOpen = false)"
      />
      <!-- calendar component -->
      <v-card rounded="xl" data-aos-delay="200" class="pa-5">
        <!-- loading overlay -->
        <v-overlay :value="isLoading" absolute class="rounded-xl" color="white">
          <div class="d-flex flex-column align-center justify-center">
            <v-progress-circular
              indeterminate
              color="green"
              size="72"
              width="7"
              class="mt-10"
            ></v-progress-circular>
          </div>
        </v-overlay>
        <!-- toolbar top -->
        <v-toolbar rounded="xl" flat class="mb-3">
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="$refs.calendar.prev()"
          >
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="$refs.calendar.next()"
          >
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <geko-input
            v-model="config.calendarOptions.focus"
            :item="{
              label: 'Tanggal Distribusi',
              hide_label: true,
              type: 'date',
              validation: [],
            }"
          ></geko-input>
          <!-- <statistic-card
            :item="{
              title: 'Bibit Sostam',
              icon: 'mdi-tree-outline',
              value: totalSeedSostam,
              color: 'green',
            }"
          ></statistic-card> -->
        </v-toolbar>
        <!-- calendar -->
        <v-sheet height="600" rounded="xl">
          <v-calendar
            ref="calendar"
            v-model="config.calendarOptions.focus"
            :type="config.calendarOptions.type"
            :events="events"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            color="success"
            @click:more="viewDay"
            @click:date="viewDay"
            @click:event="showEvent"
            @change="getEvents"
          ></v-calendar>
        </v-sheet>
        <!-- toolbar bottom -->
        <v-toolbar class="pt-2" rounded="xl" flat>
          <v-spacer></v-spacer>
          <geko-input
            v-model="config.calendarOptions.type"
            :item="{
              type: 'select-radio',
              hide_label: true,
              validation: [],
              label: 'Tampilan',
              option: {
                clearable: false,
                default_options: config.calendarOptions.types,
                list_pointer: {
                  code: 'code',
                  label: 'label',
                  display: 'label',
                },
              },
            }"
          ></geko-input>
        </v-toolbar>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import _Config from "./CalendarDistributionConfig";
import CalendarDistributionDialog from "./CalendarDistributionDialog.vue";
import StatisticCard from "./components/statisticCard.vue";

export default {
  name: "GekoCalendarDistribution",

  components: {
    CalendarDistributionDialog,
    StatisticCard,
  },

  data() {
    return {
      config: _Config,
      events: [],
      isLoading: false,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
    };
  },

  computed: {
    totalSeedSostam() {
      return this.events.reduce((acc, event) => {
        return acc + parseInt(event.data.total_seed);
      }, 0);
    },
  },

  mounted() {
    this.config.calendarOptions.type = "day";
  },

  methods: {
    viewDay({ date }) {
      this.config.calendarOptions.focus = date;
      this.config.calendarOptions.type = "day";
    },
    setToday() {
      this.config.calendarOptions.focus = "";
    },
    getEvents({ start, end }) {
      try {
        this.isLoading = true;
        this.$_api
          .get("sostam/calendar/nursery", {
            program_year: this.$_config.programYear.model,
            // year: 2025,
            // month: "01",
            start_date: start.date,
            end_date: end.date,
          })
          .then((res) => {
            const calendarOption = this.config.calendarOptions;
            const events = [];
            const muColors = [];

            for (const [key, ff] of Object.entries(res.data)) {
              // set per mu colors
              const findExistMu = muColors.find((v) => v.mu_name == ff.mu_name);
              let color =
                calendarOption.colors[
                  this.rnd(0, calendarOption.colors.length - 1)
                ];
              if (findExistMu) {
                color = findExistMu.color;
              } else {
                muColors.push({
                  mu_name: ff.mu_name,
                  color: color,
                });
              }
              let eventName = `${ff.ff_name} - ${ff.mu_name}`;
              events.push({
                name: eventName,
                start: ff.date,
                color: color,
                timed: false,
                data: ff,
              });
            }

            this.events = events;
          })
          .catch((err) => {
            console.log("getEvents error", err);
            this.$_alert.error(err);
          })
          .finally(() => {
            this.isLoading = false;
          });
      } catch (error) {}
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event.data;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
  },
};
</script>