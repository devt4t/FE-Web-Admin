<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <v-card class="mx-auto my-2" max-width="900">
      <v-img
        class="d-none d-md-block"
        style="width: 100%"
        src="/images/BG_Maintenance_Web.jpg"
      ></v-img>
      <v-img
        class="d-md-none"
        style="height: 100%"
        src="/images/BG_Maintenance_Mobile.jpg"
      ></v-img>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Farmer",
  data: () => ({
    itemsbr: [
      {
        text: "Main Data",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Activity",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
  }),
};
</script>