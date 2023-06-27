<template>
    <div>
        <!-- breadcrumbs -->
        <div data-aos="fade-right">
            <v-breadcrumbs
              :dark="$store.state.theme == 'dark'"
              class="breadcrumbsmain"
              :items="[{
                text: 'Activities',
                disabled: true,
                href: 'breadcrumbs_dashboard',
              },{
                text: 'Distribusi',
                disabled: true,
                href: 'Distribusi',
              },{
                text: 'Seedling Change Request',
                disabled: true,
                href: 'breadcrumbs_link_1',
              }]"
              divider=">"
              large
            ></v-breadcrumbs>
        </div>
    </div>
</template>
<script>
export default {
    data: () => ({})
}
</script>