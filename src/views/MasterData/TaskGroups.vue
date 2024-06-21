<template>
  <geko-base-crud :config="config"> </geko-base-crud>
</template>

<script>
export default {
  name: "crud-tasks",
  watch: {},
  data() {
    return {
      config: {
        title: "Task Group",
        model_api: null,
        getter: "task-group",
        setter: "addProjectUtils",

        update: "updateProjectUtils",
        delete: "deleteProjectUtils",
        deleteKey: "code",
        pk_field: null,
        permission: {
          create: "tasks-create",
          read: "tasks-list",
          update: "tasks-update",
          show: "tasks-show",
          lookup: "tasks-lookup",
          delete: "tasks-delete",
        },
        slave: [],
        fields: [
          {
            id: "id",
            methods: {
              list: false,
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },

          {
            id: "code",
            label: "Kode",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
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
            id: "created_by",
            label: "Created By",
            methods: {
              list: false,
              detail: true,
              create: {
                input: false,
                default: "current_user_id",
              },
              update: {
                input: false,
                default: "current_user_id",
                setter: "updated_by",
              },
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
