<template>
  <geko-base-crud :config="config">
    <!-- :hideCreate="!['4', '13'].includes($store.state.User.role)"
    :hideUpdate="!['4', '13'].includes($store.state.User.role)" -->
    <template v-slot:list-indicator="{ item }">

    </template>
  </geko-base-crud>
</template>

<script>
import provinsiConfig from "./provinsiConfig";
export default {
  name: "crud-provinsi-v2",
  watch: {},
  mounted() {
    this.$set(this.config, "update_ext_payload", {
      id: this.$route.query.id,
    });
  },
  data() {
    return {
      config: {
        title: "Provinsi",
        // program_year: {
        //     show: false,
        //     model: "2024",
        // },
        model_api: null,
        getter: "new-utilities/provinces",
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
          create: "provinsi-create",
          read: "provinsi-list",
          update: "provinsi-update",
          detail: "provinsi-detail",
          lookup: "provinsi-lookup",
          delete: "provinsi-delete",
        },
        slave: [],
        fields: provinsiConfig,
      },
    };
  },
};
</script>
