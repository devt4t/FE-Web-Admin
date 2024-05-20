<template>
  <geko-base-crud :config="config">
    <template v-slot:create-form> </template>
  </geko-base-crud>
</template>

<script>
export default {
  name: "crud-scooping-visit",
  watch: {},
  data() {
    return {
      config: {
        title: "Scooping Visit",
        program_year: {
          show: false,
          model: "2024",
        },
        model_api: null,
        getter: "GetScoopingAll",
        getterDataKey: "data.result",
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
            id: "province_id",
            label: "Provinsi",
            methods: {
              list: {
                type: "row-slot",
              },
              create: {
                validation: ["required"],
                col_size: 6,
                type: "select",
                setter: "province_id",
                getter: "GetProvince",
                getter_key: "province_id",
                separator: "Lokasi & Tanggal Kegiatan Scooping",
                searchable: false,
                option: {
                  list_pointer: {
                    code: "id",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
              detail: true,
              update: false,
              filter: false,
            },
          },

          {
            id: "province_id",
            label: "Provinsi",
            methods: {
              list: {
                type: "row-slot",
              },
              create: {
                validation: ["required"],
                col_size: 6,
                type: "select",
                setter: "province_id",
                getter: "GetProvince",
                getter_key: "province_id",
                separator: "Lokasi & Tanggal Kegiatan Scooping",
                searchable: false,
                option: {
                  list_pointer: {
                    code: "id",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
              detail: true,
              update: false,
              filter: false,
            },
          },
          {
            id: "city_id",
            label: "Kabupaten / Kota",
            methods: {
              list: {
                type: "row-slot",
              },
              create: false,
              detail: true,
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
