<template>
  <geko-base-crud :config="config" :key="'task-list' + componentKey">
    <template v-slot:list-before-create>
      <v-btn
        v-if="$_sys.isAllowed('task-create')"
        variant="info"
        @click="onGenerate()"
        >Generate Task</v-btn
      >
    </template>
  </geko-base-crud>
</template>

<script>
export default {
  name: "crud-tasks",
  watch: {},
  methods: {
    async onGenerate() {
      if (this.loading) return;
      this.loading = true;
      const generating = await this.$_api
        .post("task/generate")
        .catch(() => false);
      if (!generating) {
        this.loading = false;
        return;
      }
      this.$_alert.success("Task successfully generated");
      this.componentKey += 1;
    },
  },
  data() {
    return {
      loading: false,
      componentKey: 1,
      config: {
        title: "Tasks",
        model_api: null,
        getter: "task",
        setter: "addProjectUtils",

        update: "updateProjectUtils",
        delete: "deleteProjectUtils",
        deleteKey: "code",
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
