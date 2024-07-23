<template>
  <geko-base-crud
    :config="config"
    :hideCreate="true"
    :hideUpdate="true"
    :hideDelete="true"
  >
    <template v-slot:detail-slave-raw="{ data }">
      <roles-detail :data="data" />
    </template>
  </geko-base-crud>
</template>

<script>
import RolesDetail from "./RolesDetail.vue";
import "./roles.scss";
export default {
  name: "crud-roles",
  components: {
    RolesDetail,
  },
  watch: {},
  data() {
    return {
      config: {
        title: "Roles",
        model_api: null,
        getter: "roles",
        pk_field: null,
        permission: {
          create: "roles-create",
          read: "roles-list",
          update: "roles-update",
          show: "roles-show",
          lookup: "roles-lookup",
          delete: "roles-delete",
        },
        slave: [],
        fields: [
          {
            id: "id",
            methods: {
              list: true,
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },

          {
            id: "name",
            label: "Nama",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"], setter: "new_name" },
              filter: false,
            },
          },

          {
            id: "position_group",
            label: "Position Group",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "created_at",
            label: "Tgl. Dibuat",
            methods: {
              list: {
                transform: "datetime",
              },
              detail: true,
              filter: false,
            },
          },
        ],
      },
    };
  },
};
</script>
