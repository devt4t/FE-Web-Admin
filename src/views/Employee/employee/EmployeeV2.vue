<template>
  <geko-base-crud
    :config="config"
    :hideCreate="!['4', '13'].includes($store.state.User.role)"
    :hideUpdate="!['4', '13'].includes($store.state.User.role)"
  >
    <template v-slot:list-indicator="{ item }">
      <div class="indicator-wrapper pt-1">
        <div
          class="indicator"
          :class="{
            info: item.job_status == 'Training',
            success: item.job_status == 'Active',
          }"
        ></div>
      </div>
    </template>
  </geko-base-crud>
</template>

<script>
import employeeConfig from "./employeeConfig";
export default {
  name: "crud-employee-v2",
  watch: {},
  data() {
    return {
      config: {
        title: "Employee",
        // program_year: {
        //     show: false,
        //     model: "2024",
        // },
        model_api: null,
        getter: "getEmployeeList_new",
        setter: "AddEmployee",
        search_key: "search",
        // getterDataKey: "data.result.data",
        // pagination: false,
        // setter_ext_payload: {
        //     project_modul: 'environment',
        // },
        update: "EditEmployee",
        update_ext_payload: {
          id: this.$route.query.id,
        },
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
            "alias",
            "ktp_no",
            "blood_type",
            "religion",
            "marrital",
            "gender",
            "birthplace",
            "birthday",
            "phone",
            "address",
            "village",
            "zip_code",
            "kecamatan",
            "city",
            "province",
            "nik",
            "position_no",
            "email",
            "npwp",
            "bpjs_kesehatan_no",
            "bpjs_tenagakerja_no",
            "bank_account",
            "bank_name",
            "bank_branch",
          ],
        },
        permission: {
          create: "emplyoee-create",
          read: "emplyoee-list",
          update: "emplyoee-update",
          show: "emplyoee-show",
          lookup: "emplyoee-lookup",
          delete: "emplyoee-delete",
        },
        slave: [],
        fields: employeeConfig,
      },
    };
  },
};
</script>
