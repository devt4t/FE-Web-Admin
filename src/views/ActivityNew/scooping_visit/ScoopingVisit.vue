<template>
  <geko-base-crud :config="config">
    <template v-slot:create-form>
      <scooping-visit-form />
    </template>

    <template v-slot:list-village_area="{ item }">
      {{ parseInt(item.land_area) }} Ha
    </template>

    <template v-slot:list-date="{ item }">
      <div>
        <span v-if="item.start_scooping_date">{{
          item.start_scooping_date | parse("date")
        }}</span>
        <span v-if="item.start_scooping_date && item.end_scooping_date">
          -
        </span>
        <span v-if="item.end_scooping_date">{{
          item.end_scooping_date | parse("date")
        }}</span>
      </div>
    </template>

    <template v-slot:list-potential_dusun="{ item }">
      {{ item.potential_dusun }} dusun
    </template>

    <template v-slot:detail-row>
      <scooping-visit-detail />
    </template>
  </geko-base-crud>
</template>

<script>
import "./scooping-visit.scss";
import ScoopingVisitForm from "./ScoopingVisitForm.vue";
import ScoopingVisitDetail from "./ScoopingVisitDetail.vue";
export default {
  name: "crud-scooping-visit",
  components: {
    ScoopingVisitForm,
    ScoopingVisitDetail,
  },
  watch: {},
  data() {
    return {
      config: {
        title: "Scooping Visit",
        model_api: null,
        getter: "GetNewScoopingAll",
        setter: "addProjectUtils",
        update: "updateProjectUtils",
        delete: "newDeleteDonor",
        pk_field: null,
        permission: {
          create: "scooping-visit-create",
          read: "scooping-visit-list",
          update: "scooping-visit-update",
          show: "scooping-visit-show",
          lookup: "scooping-visit-lookup",
          delete: "scooping-visit-delete",
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
            id: "data_no",
            label: "Form No",
            methods: {
              list: true,
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "desa",
            label: "Desa",
            methods: {
              list: {
                view_data: "desas_name",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "village_area",
            label: "Luas Desa",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "date",
            label: "Tanggal",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "potential_dusun",
            label: "Potensi",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "pic",
            label: "PIC",
            methods: {
              list: {
                view_data: "users_name",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "pic_manager",
            label: "PIC Manager",
            methods: {
              list: {
                view_data: "employees_name",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
        ],
      },
    };
  },

  methods: {},
};
</script>
