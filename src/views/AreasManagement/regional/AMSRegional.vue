<template>
  <geko-base-crud :config="config"> </geko-base-crud>
</template>

<script>
export default {
  name: "crud-ams-regional",
  watch: {},
  data() {
    return {
      config: {
        title: "AMS Regional",
        model_api: null,
        getter: "GetDonorAllAdmin",
        setter: "addProjectUtils",
        update: "updateProjectUtils",
        delete: "newDeleteDonor",
        pk_field: null,
        permission: {
          create: "ams-regional-create",
          read: "ams-regional-list",
          update: "ams-regional-update",
          show: "ams-regional-show",
          lookup: "ams-regional-lookup",
          delete: "ams-regional-delete",
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
            id: "program_year",
            methods: {
              list: true,
              detail: false,
              create: {
                type: "select",
                validation: ["required"],
                setter: "program_year",
                option: {
                  default_options: [
                    {
                      code: 2020,
                      label: "2020",
                    },
                    {
                      code: 2021,
                      label: "2021",
                    },
                    {
                      code: 2022,
                      label: "2022",
                    },
                    {
                      code: 2023,
                      label: "2023",
                    },
                  ],
                },
              },
              update: false,
              filter: false,
            },
          },
        ],
      },
    };
  },
};
</script>
