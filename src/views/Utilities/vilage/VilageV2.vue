<template>
  <geko-base-crud :config="config" :hideUpdate="true" :hideDelete="true">
    <template v-slot:list-program_year="{ item }">
      <span class="badge bg-primary">{{ $store.state.tmpProgramYear }}</span>
    </template>
    <template v-slot:list-bottom-action="{ item }">
      <v-btn
        variant="info"
        small
        class="d-flex flex-row align-items-center mt-2"
        @click="onAssignTADesas(item)"
        v-if="$_sys.isAllowed('field-facilitator-update')"
      >
        <v-icon small class="mr-1">mdi-clipboard-text</v-icon>
        <span>Assign Target Area</span>
      </v-btn>
    </template>
    <template v-slot:detail-slave-raw="{ data }">
        <village-detail :data="data"></village-detail>
    </template>
    <template v-slot:list-after-filter>
      <village-ta-adjustment 
        @success="refreshKey = refreshKey + 1"
        :data="village_data"
        :dataKey="village_data_key"/>
    </template>
  </geko-base-crud>
</template>

<script>
import vilageConfig from "./vilageConfig";
import villageTaAdjustment from "./VillageV2AdjustmentForm.vue";
import villageDetail from "./VillageDetail.vue";
export default {
  name: "crud-vilage-v2",
  components: {
    villageTaAdjustment,
    villageDetail
  },
  watch: {},
  mounted() {
    this.$set(this.config, "update_ext_payload", {
      id: this.$route.query.id,
    });
  },
  methods:{
    onAssignTADesas(item){
      this.village_data = item
      this.village_data_key = this.village_data_key + 1
      console.log(this.village_data)
    }
  },
  data() {
    return {
      refreshKey: 0,
      village_data: null,
      village_data_key: 0,
      config: {
        title: "Village",
        // program_year: {
        //     show: false,
        //     model: "2024",
        // },
        model_api: null,
        getter: "new-utilities/desas",
        setter: "new-utilities/create/desas",
        search_key: "search_value",
        detail: "new-utilities/detail/desas",
        detailIdKey: "kode_desa",
        detailKey: "data",
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
          // program_year: {
          //   setter: "program_year",
          // },
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
