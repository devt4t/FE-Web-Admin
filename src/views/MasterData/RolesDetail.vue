<template>
  <v-card
    data-aos="fade-up"
    data-aos-delay="100"
    data-aos-duration="800"
    class="geko-base-detail-card mb-5"
  >
    <v-card-title
      class="d-flex flex-row"
      style="justify-content: space-between"
    >
      <div class="d-flex flex-row" style="align-items: center">
        <h4 class="mb-0 pb-0">Permission</h4>
      </div>
    </v-card-title>
    <div class="permission-wrapper">
      <div class="table-wrapper">
        <table class="geko-table">
          <thead>
            <tr>
              <th class="font-weight-bold">Tasks</th>
              <th class="text-primary">Select<br />All</th>
              <th>Create</th>
              <th>List</th>
              <th>Detail</th>
              <th>Update</th>
              <th>Delete</th>
              <th>Lookup</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in tasks" :key="'permission-' + i">
              <td>{{ item.task_name }}</td>
              <td>
                <div class="text-center">
                  <v-checkbox
                    v-model="item.select_all"
                    color="primary"
                    @change="onCheckRow(item, $event, i)"
                  ></v-checkbox>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <v-checkbox
                    v-model="item.create"
                    color="success"
                    @change="onCheckPermission(item, $event, i)"
                  ></v-checkbox>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <v-checkbox v-model="item.list" color="success"></v-checkbox>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <v-checkbox
                    v-model="item.detail"
                    color="success"
                    @change="onCheckPermission(item, $event, i)"
                  ></v-checkbox>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <v-checkbox
                    v-model="item.update"
                    color="success"
                    @change="onCheckPermission(item, $event, i)"
                  ></v-checkbox>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <v-checkbox
                    v-model="item.delete"
                    color="success"
                    @change="onCheckPermission(item, $event, i)"
                  ></v-checkbox>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <v-checkbox
                    v-model="item.lookup"
                    color="success"
                    @change="onCheckPermission(item, $event, i)"
                  ></v-checkbox>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex flex-row mt-5 justify-content-center">
        <v-btn variant="warning" @click="onSubmit">Update Permission</v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "roles-detail",
  methods: {
    onInit() {
      const getTasks = this.$_api.get("task", { limit: 10000 });
      const getRoles = this.$_api.get(`role-task/${this.$route.query.id}`);

      Promise.all([getTasks, getRoles]).then(([tasks, roles]) => {
        console.log("task response", tasks.data);

        let processedData = [];
        for (const task of tasks.data) {
          const isExist = processedData.find(
            (x) => x.task_groups_name == task.task_groups_name
          );
          if (isExist) continue;

          const hasLookupPermission = roles.data.find(
            (x) => x.task_code == `${task.task_groups_name}-lookup`
          );
          const hasCreatePermission = roles.data.find(
            (x) => x.task_code == `${task.task_groups_name}-create`
          );
          const hasListPermission = roles.data.find(
            (x) => x.task_code == `${task.task_groups_name}-list`
          );
          const hasDetailPermission = roles.data.find(
            (x) => x.task_code == `${task.task_groups_name}-detail`
          );
          const hasUpdatePermission = roles.data.find(
            (x) => x.task_code == `${task.task_groups_name}-update`
          );
          const hasDeletePermission = roles.data.find(
            (x) => x.task_code == `${task.task_groups_name}-delete`
          );
          const taskList = tasks.data.find(
            (x) => x.code == `${task.task_groups_name}-list`
          );
          const taskDetail = tasks.data.find(
            (x) => x.code == `${task.task_groups_name}-detail`
          );
          const taskUpdate = tasks.data.find(
            (x) => x.code == `${task.task_groups_name}-update`
          );
          const taskDelete = tasks.data.find(
            (x) => x.code == `${task.task_groups_name}-delete`
          );
          const taskCreate = tasks.data.find(
            (x) => x.code == `${task.task_groups_name}-create`
          );
          const taskLookup = tasks.data.find(
            (x) => x.code == `${task.task_groups_name}-lookup`
          );

          processedData.push({
            id: task.id,
            task_name: task.task_groups_name.replace(/-/g, " "),
            task_groups_name: task.task_groups_name,
            lookup: hasLookupPermission ? true : false,
            lookup_id: hasLookupPermission ? hasLookupPermission.id : null,
            lookup_task_id: taskLookup.id,
            list: hasListPermission ? true : false,
            list_id: hasListPermission ? hasListPermission.id : null,
            list_task_id: taskList.id,
            detail: hasDetailPermission ? true : false,
            detail_id: hasDetailPermission ? hasDetailPermission.id : null,
            detail_task_id: taskDetail.id,
            create: hasCreatePermission ? true : false,
            create_id: hasCreatePermission ? hasCreatePermission.id : null,
            create_task_id: taskCreate.id,
            update: hasUpdatePermission ? true : false,
            update_id: hasUpdatePermission ? hasUpdatePermission.id : null,
            update_task_id: taskUpdate.id,
            delete: hasDeletePermission ? true : false,
            delete_id: hasDeletePermission ? hasDeletePermission.id : null,
            delete_task_id: taskDelete.id,
            select_all:
              hasListPermission &&
              hasLookupPermission &&
              hasCreatePermission &&
              hasDetailPermission &&
              hasUpdatePermission &&
              hasDeletePermission
                ? true
                : false,
          });
        }

        this.tasks = processedData;
        console.log("TASKS", this.tasks);
        this.loading = false;
      });
    },
    onCheckRow(item, v, i) {
      let value = v ? true : false;
      this.tasks[i].create = value;
      this.tasks[i].list = value;
      this.tasks[i].detail = value;
      this.tasks[i].update = value;
      this.tasks[i].delete = value;
      this.tasks[i].lookup = value;
    },

    onCheckPermission(item, v, i) {
      const isAllChecked =
        item.create &&
        item.list &&
        item.detail &&
        item.lookup &&
        item.update &&
        item.delete;

      if (isAllChecked !== item.select_all) {
        this.tasks[i].select_all = isAllChecked;
      }
    },

    onSubmit() {
      let payloadPermission = [];
      for (const task of this.tasks) {
        //list
        payloadPermission.push({
          role_id: parseInt(this.$route.query.id),
          permission: task.list,
          task_id: task.list_task_id,
          task_code: `${task.task_name}-list`,
        });
        //detail
        payloadPermission.push({
          role_id: parseInt(this.$route.query.id),
          permission: task.detail,
          task_id: task.detail_task_id,
          task_code: `${task.task_name}-detail`,
        });
        //lookup
        payloadPermission.push({
          role_id: parseInt(this.$route.query.id),
          permission: task.lookup,
          task_id: task.lookup_task_id,
          task_code: `${task.task_name}-lookup`,
        });
        //update
        payloadPermission.push({
          role_id: parseInt(this.$route.query.id),
          permission: task.update,
          task_id: task.update_task_id,
          task_code: `${task.task_name}-update`,
        });
        //create
        payloadPermission.push({
          role_id: parseInt(this.$route.query.id),
          permission: task.create,
          task_id: task.create_task_id,
          task_code: `${task.task_name}-create`,
        });
        //delete
        payloadPermission.push({
          role_id: parseInt(this.$route.query.id),
          permission: task.delete,
          task_id: task.delete_task_id,
          task_code: `${task.task_name}-delete`,
        });
      }

      this.$_api
        .post("role-task/create", {
          permissions: payloadPermission,
        })
        .then(() => {
          this.$_alert.success("Mantap Master!", "", "center", true);
        });
    },
  },
  mounted() {
    this.onInit();
  },

  data() {
    return {
      tasks: [],
      loading: false,
    };
  },
};
</script>
