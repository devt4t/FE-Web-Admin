<template>
  <b-row>
    <b-col>
      <v-card
        rounded="xl"
        :dark="$store.state.theme == 'dark'"
        data-aos="fade-down"
      >
        <v-card-text>
          <v-row
            style="margin-top: -15px"
            class="flex-column-reverse flex-lg-row"
          >
            <v-col
              cols="12"
              md="12"
              lg="9"
              class="d-flex flex-column justify-content-between py-5"
            >
              <p class="text-h5 mb-2">
                <span class="mr-1">Selamat {{ time.isMorning() }},</span>
                <b>{{ User.name || "-" }}</b>
              </p>
              <div class="clock">
                <p class="text-subtitle-1">
                  <span v-if="time.date">
                    {{ time.date || "-" }}
                  </span>
                  <v-progress-circular
                    v-else
                    indeterminate
                    color="white"
                    size="15"
                  ></v-progress-circular>
                </p>
                <p v-if="time.clock" class="mb-0" style="font-size: 40px">
                  {{ time.clock || "-" }}
                </p>
              </div>
            </v-col>
            <v-col cols="12" lg="3" class="pa-0">
              <LottieAnimation
                :animationData="femaleWork"
                :loop="true"
                :key="'female-work'"
                style="height: 175px; padding: 0px"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </b-col>
    <b-col cols="auto" class="d-flex align-items-stretch">
      <!-- Manual Books -->
      <v-card
        class="rounded-xl"
        :dark="$store.state.theme == 'dark'"
        data-aos="fade-down"
        data-aos-delay="350"
      >
        <v-card-text class="text-center">
          <div
            class="d-flex align-items-center flex-column justify-content-center"
          >
            <p class="font-size-h1">
              <v-icon size="xxx-large" color="success">mdi-book</v-icon>
            </p>
            <p class="mb-3">Buku Manual GEKO</p>
            <v-btn
              rounded
              color="blue white--text"
              class="my-2"
              small
              @click="() => downloadManualBook()"
              ><v-icon class="mr-1">mdi-download</v-icon> Unduh</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </b-col>
  </b-row>
</template>

<script>
import femaleWork from "@/assets/lottie/female-work.json";
import LottieAnimation from "lottie-web-vue";

export default {
  name: "GekoGreetings",

  components: {
    LottieAnimation,
  },

  data() {
    return {
      time: {
        isMorning() {
          const hour = new Date().getHours();
          let time = "";
          if (hour < 12) time = "Pagi";
          if (hour >= 12 && hour < 15) time = "Siang";
          if (hour >= 15 && hour < 18) time = "Sore";
          if (hour >= 18 && hour < 24) time = "Malam";
          return `${time}`;
        },
        date: "",
        clock: "",
      },
      urlManualBook:
        "https://trees4trees.sharepoint.com/:b:/g/EdnPK5LSmNVIvauAiE1qy5MBb5zC9UhWdUUFokVeI9FV2g?e=3wlCiA",
      User: {},
    };
  },

  computed: {
    femaleWork() {
      return femaleWork;
    },
  },

  mounted() {
    this.User = this.$store.state.User;
    this.dateTimeNow();
  },

  methods: {
    dateTimeNow() {
      this.time.date = new Date().toLocaleDateString("ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setInterval(() => {
        this.time.clock = new Date().toLocaleTimeString("US");
      }, 100);
    },
    downloadManualBook() {
      const url = this.urlManualBook;
      window.open(url, "_blank");
    },
  },
};
</script>