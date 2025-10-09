<template>
  <geko-base-crud :config="config"> </geko-base-crud>
</template>

<script>
export default {
  name: "crud-project-type",
  watch: {},
  data() {
    return {
      config: {
        title: "Permintaan Limitasi Distribusi Harian",
        program_year: {
          show: false,
          model: "2024",
        },
        model_api: null,
        getter: "",
        setter: "addProjectUtils",
        setter_ext_payload: {
          project_modul: "type",
        },
        update: "updateProjectUtils",
        update_ext_payload: {
          project_modul: "type",
        },
        delete: "deleteProjectUtils",
        delete_ext_payload: {
          delete_type: "hard_delete",
          project_modul: "type",
        },
        deleteKey: "code",
        pk_field: null,
        filter_api: {
          project_modul: "type",
        },
        permission: {
          create: "sosialisasi-tanam-create",
          read: "sosialisasi-tanam-list",
          update: "sosialisasi-tanam-update",
          detail: "sosialisasi-tanam-detail",
          lookup: "sosialisasi-tanam-lookup",
          delete: "sosialisasi-tanam-delete",
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
            id: "mu_no",
            label: "Management Unit",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "kayu_limitation",
            label: "Limitasi Kayu",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "mpts_limitation",
            label: "Limitasi MPTS",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "total_limitation",
            label: "Total Limitasi Bibit",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          
          {
            id: "program_year",
            label: "Tahun Program",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "nursery_locations_id",
            label: "Lokasi Persemaian",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          
          {
            id: "start_distribution_time",
            label: "Tanggal Mulai Distribusi",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "end_distribution_time",
            label: "Tanggal Selesai Distribusi",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

        ],
      },
    };
  },
};
</script>
