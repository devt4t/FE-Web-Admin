<template>
  <div>
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      data-aos="fade-right"
      class="breadcrumbsmain"
      :items="[{
        text: 'Activities',
        disabled: true,
        href: 'breadcrumbs_dashboard',
      },{
        text: 'Monitoring 2',
        disabled: true,
        href: 'breadcrumbs_link_1',
      }]"
      divider=">"
      large
    ></v-breadcrumbs>
    <!-- trees preview component -->
    <!-- <TreesPreview></TreesPreview> -->

    <v-data-table
      data-aos="fade-up"
      loading-text="Loading... Please wait"
      class="rounded-xl elevation-6 mx-3 pa-1"
      :footer-props="{
      itemsPerPageText: 'Jumlah Data Per Halaman'
      }"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-xl">
          <v-spacer class="d-none d-md-block"></v-spacer>
          <v-text-field
            dense
            outlined
            rounded
            color="green"
            append-icon="mdi-magnify"
            label="Pencarian"
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import TreesPreview from "./components/monitoring2/TreesPreview.vue";

export default {
  name: "Monitoring2",
  components: {
    TreesPreview
},
  data: () => ({
    // general setting
    authtoken: "",
    User: {},
    // snackbar
    snackbar: {
      color: '',
      show: false,
      timeout: 5000,
      text: ''
    }
  }),
  computed: {},

  async mounted() {
    this.User = this.$store.state.User
    // const taskForceEmails = this.$store.state.taskForceTeam.emails || []

    if (this.User.role_group != 'IT') {
      this.$store.state.maintenanceOverlay = true
    }
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false

    this.$store.state.loadingOverlay = false
    this.$store.state.loadingOverlayText = null
  },

  methods: {
    LatLng(lat, lng) {
      const array = [parseFloat(lat), parseFloat(lng)];
      //   console.log(array);
      return array;
    },
  },
};
</script>
