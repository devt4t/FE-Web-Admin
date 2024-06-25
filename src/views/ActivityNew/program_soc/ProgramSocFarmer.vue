<template>
  <geko-base-crud :config="config" :hideList="true">
    <template v-slot:create-form>
      <program-soc-farmer-form />
    </template>
  </geko-base-crud>
</template>

<script>
import ProgramSocFarmerForm from "./ProgramSocFarmerForm.vue";
export default {
  name: "program-soc-farmer",
  components: {
    ProgramSocFarmerForm,
  },
  data() {
    return {
      config: {
        title: "Petani (Sosialisasi Program)",
        model_api: null,
        getter: "GetFormMinatDetailAll_new",
        setter: "AddFormMinatFarmers_new",
        setter_redirect: "back",
        update: "UpdateFormMinatMain_new",
        delete: "deleteProjectUtils",
        pk_field: null,
        permission: {
          create: "program-socializations-create",
          read: "program-socializations-list",
          update: "program-socializations-update",
          show: "program-socializations-show",
          lookup: "program-socializations-lookup",
          delete: "program-socializations-delete",
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
