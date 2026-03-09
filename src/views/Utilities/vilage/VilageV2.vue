<template>
  <geko-base-crud :config="config" :hideDelete="true" :hideUpdate="false" :refreshKey="refreshKey">
    <!-- <template v-slot:list-program_year="{ item }">
      <span class="badge bg-primary">{{ $store.state.tmpProgramYear }}</span>
    </template> -->
    <template v-slot:list-bottom-action="{ item }">
      <v-btn variant="info" small class="d-flex flex-row align-items-center mt-2" @click="onAssignTADesas(item)"
        v-if="$_sys.isAllowed('field-facilitator-update')">
        <v-icon small class="mr-1">mdi-clipboard-text</v-icon>
        <span>Assign Target Area</span>
      </v-btn>
    </template>
    <template v-slot:detail-slave-raw="{ data }">
      <village-detail :data="data"></village-detail>
    </template>
    <template v-slot:list-after-filter>
      <village-ta-adjustment @success="refreshKey = refreshKey + 1" :data="village_data" :dataKey="village_data_key" />
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
  methods: {
    onAssignTADesas(item) {
      this.village_data = item
      this.village_data_key = this.village_data_key + 1
      console.log('village data: ', this.village_data)
    }
  },
  data() {
    return {
      refreshKey: 0,
      village_data: null,
      village_data_key: 0,
      config: {
        title: "Village",

        model_api: null,
        getter: "new-utilities/desas",
        setter: "new-utilities/create/desas",
        search_key: "search_value",
        detail: "new-utilities/detail/desas",
        detailIdKey: "kode_desa",
        detailKey: "result",
        // getterDataKey: "data.result.data",
        pagination: true,
        // setter_ext_payload: {
        //     project_modul: 'environment',
        // },
        update: "new-utilities/update/desas",
        update_id_getter: 'kode_desa',
        update_id_setter: 'kode_desa',
        delete: "DeleteEmployee",

        deleteKey: "id",
        pk_field: null,

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
