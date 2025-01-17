<template>
    <geko-base-crud :config="config" :hideCreate="true" :hideUpdate="true" :hideDelete="true">
      <template v-slot:list-created_by="{ item }">
        {{ item.created_by }}
      </template>
    </geko-base-crud>
  </template>
  
  <script>
  export default {
    name: "crud-reallocation",
    watch: {},
    data() {
      return {
        config: {
          title: "Pengiriman Ulang",
          program_year: {
            show: false,
            model: "2024",
          },
          model_api: null,
          getter: "nursery/addendum/list",
          setter: "addProjectUtils",
          setter_ext_payload: {
            project_modul: "purpose",
          },
          update: "updateProjectUtils",
          update_ext_payload: {
            project_modul: "purpose",
          },
          delete: "deleteProjectUtils",
          delete_ext_payload: {
            delete_type: "hard_delete",
            project_modul: "purpose",
          },
          deleteKey: "code",
          pk_field: null,
          filter_api: {
            project_modul: "purpose",
          },
          permission: {
            create: "project-planting-purpose-create",
            read: "project-planting-purpose-list",
            update: "project-planting-purpose-update",
            detail: "project-planting-purpose-detail",
            lookup: "project-planting-purpose-lookup",
            delete: "project-planting-purpose-delete",
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
                id: "mu_name",
                label: "Management Unit",
                methods: {
                list: true,
                detail: true,
                },
            },
  
            {
              id: "ff_name",
              label: "Field Facilitator",
              methods: {
                list: true,
                detail: true,
              },
            },
  
            {
              id: "rel_updated_by",
              label: "Implementor",
              methods: {
                list: false,
                detail: false,
              },
            },
  
            {
              id: "request_by",
              label: "Request By",
              methods: {
                list: true,
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
  