<template>
  <div>
    <v-breadcrumbs
      class="breadcrumbsmain"
      :items="itemsbr"
      divider=">"
      large
    ></v-breadcrumbs>

    <v-card class="mx-auto my-2" max-width="1000">
      <v-img max-height="500" src="/images/UnderMaintenanceWeb.jpg"></v-img>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Employee",
  data: () => ({
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
};
</script>