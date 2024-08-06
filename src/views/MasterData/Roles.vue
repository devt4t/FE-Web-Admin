<template>
  <geko-base-crud :config="config" :hideUpdate="true" :hideDelete="true">
    <template v-slot:detail-slave-raw="{ data }">
      <roles-detail :data="data" />
    </template>

    <template v-slot:list-name="{ item }">
      <span class="text-capitalize">{{
        item.name
          .split(" ")
          .map((x) => (!["IT", "GIS"].includes(x) ? x.toLowerCase() : x))
          .join(" ")
      }}</span>
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
        setter: "addEmployeePosition_new",
        pk_field: null,
        permission: {
          create: "task-create",
          read: "task-list",
          update: "task-update",
          detail: "task-detail",
          lookup: "task-lookup",
          delete: "task-delete",
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
              list: {
                type: "row-slot",
              },
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
              create: {
                type: "select",
                validation: ["required"],
                option: {
                  default_options: [
                    {
                      label: "IT",
                      code: "IT",
                    },
                    {
                      label: "FIELD",
                      code: "FIELD",
                    },
                    {
                      label: "MARKETING",
                      code: "MARKETING",
                    },
                    {
                      label: "OPERATIONAL",
                      code: "OPERATIONAL",
                    },
                    {
                      label: "OPERATIONAL CARBON",
                      code: "OPERATIONAL CARBON",
                    },
                  ],
                  list_pointer: {
                    label: "label",
                    code: "code",
                    display: ["label"],
                  },
                },
              },
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
