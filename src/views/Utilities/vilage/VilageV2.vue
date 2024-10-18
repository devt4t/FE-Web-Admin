<template>
  <geko-base-crud :config="config">
  </geko-base-crud>
</template>

<script>
import vilageConfig from "./vilageConfig";
export default {
  name: "crud-vilage-v2",
  watch: {},
  mounted() {
    this.$set(this.config, "update_ext_payload", {
      id: this.$route.query.id,
    });
  },
  data() {
    return {
      config: {
        title: "Village",
        // program_year: {
        //     show: false,
        //     model: "2024",
        // },
        model_api: null,
        getter: "new-utilities/desas",
        setter: "AddEmployee",
        search_key: "search_value",
        // getterDataKey: "data.result.data",
        pagination: true,
        // setter_ext_payload: {
        //     project_modul: 'environment',
        // },
        update: "EditEmployee",
        update_ext_payload: {},
        globalFilter: {
          // project_purpose: {
          //   setter: "purpose_code",
          // },
          program_year: {
            setter: "program_year",
          },
        },
        delete: "DeleteEmployee",
        // delete_ext_payload: {
        //     delete_type: "hard_delete",
        //     project_modul: 'environment',
        // },
        deleteKey: "id",
        pk_field: null,
        // filter_api: {
        //     project_modul: 'environment',
        // },

        formOption: {
          sort: [
            "name",
            "province_code",
          ],
        },
        permission: {
          create: "desa-create",
          read: "desa-list",
          update: "desa-update",
          detail: "desa-detail",
          lookup: "desa-lookup",
          delete: "desa-delete",
        },
        slave: [],
        fields: vilageConfig,
      },
    };
  },
};
</script>
