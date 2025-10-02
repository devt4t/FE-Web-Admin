<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <v-card class="mx-auto my-2" max-width="1000"> </v-card>
  </div>
</template>

<script>
export default {
  name: "Employee",
  data: () => ({
    config: {
      permission: {
        read: "employee-manager-list",
      },
    },
    itemsbr: [
      {
        text: "Employee",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Employee Manager",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
  }),
  mounted() {
    this.$store.state.maintenanceOverlay = true;
  },
  destroyed() {
    this.$store.state.maintenanceOverlay = false;
  },
};
</script>
