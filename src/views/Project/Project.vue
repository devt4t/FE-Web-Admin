<template>
  <geko-base-crud :config="config">
    <template v-slot:list-date="{ item }">
      <div class="min-w-200px">
        <span>{{ item.project_date | parse("date") }}</span>
        <span v-if="item.end_project">
          {{ " - " }} {{ item.end_project | parse("date") }}</span
        >
      </div>
    </template>

    <template v-slot:list-donors_name="{ item }">
      <span class="d-block min-w-150px"
        >{{ item.participants_first_name }}
        {{ item.participants_last_name || "" }}</span
      >
    </template>

    <template v-slot:update-project_name="{ formData, field }">
      <v-col md="6">
        <geko-input
          v-model="formData.project_name"
          :item="{
            label: field.label,
            type: 'text',
            validation: ['required'],
          }"
        />
      </v-col>
    </template>
  </geko-base-crud>
</template>

<script>
export default {
  name: "crud-donor",
  watch: {},
  data() {
    return {
      config: {
        title: "Project",
        model_api: null,
        getter: "GetProjectAllAdmin",
        getterDataKey: "data",
        setter: "AddNewProject",
        update: "UpdateDataProject",
        delete: "deleteProject",
        update_id_setter: "current_id",
        deleteKey: "code",
        pk_field: null,
        permission: {
          create: "project-create",
          read: "project-list",
          update: "project-update",
          show: "project-show",
          lookup: "project-lookup",
          delete: "project-delete",
        },
        formOption: {
          sort: [
            "project_name",
            "project_no",
            "donors_name",

            "project_types_name",
            "project_planting_environments_name",
            "total_tree",
            "project_planting_purposes_name",
            "co2_capture",
            "project_period_type",
            "year_interval",
            "date",
            "end_project",
            "location",
            "description",
            "active",
          ],
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
            id: "project_name",
            label: "Nama Project",
            methods: {
              list: {
                class: "min-w-200px",
              },
              detail: true,
              create: {
                type: "text",
                validation: ["required"],
                label: "Nama Project",
                col_size: 6,
                separator: "INFORMASI PROJECT",
              },
              update: {
                type: "row-slot",
                validation: ["required"],
                label: "Nama Project",
                col_size: 6,
                separator: "INFORMASI PROJECT",
              },
              filter: false,
            },
          },

          {
            id: "project_no",
            label: "No. Project",
            methods: {
              list: true,
              detail: true,
              create: false,
              update: {
                validation: [],
                col_size: 6,
                type: "text",
                disabled: true,
                option: {
                  getter: "project_no",
                },
              },
              filter: false,
            },
          },

          {
            id: "donors_name",
            label: "Donor",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: true,
              create: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                getter: "GetDonorAllAdmin",
                setter: "donors_id",
                param: {
                  page: 1,
                  per_page: 10,
                },
                option: {
                  list_pointer: {
                    code: "id",
                    label: "first_name",
                    display: ["name"],
                  },
                },
              },
              update: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                getter: "GetDonorAllAdmin",
                setter: "donors_id",
                param: {
                  page: 1,
                  per_page: 10,
                },
                option: {
                  getter: "participants_id",
                  default_label: "participants_first_name",
                  list_pointer: {
                    code: "id",
                    label: "first_name",
                    display: ["first_name"],
                  },
                },
              },
              filter: false,
            },
          },

          {
            id: "project_types_name",
            label: "Tipe Planting",
            methods: {
              list: true,
              detail: true,
              create: {
                validation: ["required"],
                col_size: 6,
                type: "select",
                setter: "planting_type_id",
                getter: "getAllProjectUtils",
                getter_key: "project_planting_type_id",
                separator: "Informasi Planting",
                searchable: false,
                param: {
                  project_modul: "type",
                },
                option: {
                  list_pointer: {
                    code: "id",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
              update: {
                validation: ["required"],
                col_size: 6,
                type: "select",
                setter: "planting_type_id",
                getter: "getAllProjectUtils",
                separator: "Informasi Planting",
                param: {
                  project_modul: "type",
                },
                option: {
                  getter: "project_types_id",
                  default_label: "project_types_name",
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["name"],
                  },
                },
              },
              filter: false,
            },
          },

          {
            id: "project_planting_purposes_name",
            label: "Tujuan",
            methods: {
              list: {
                class: {
                  Carbon: "badge bg-info",
                  "Non Carbon": "badge bg-light",
                },
              },
              detail: true,
              create: {
                validation: ["required"],
                col_size: 6,
                type: "select",
                getter: "getAllProjectUtils",
                setter: "planting_purpose_id",
                param: {
                  project_modul: "purpose",
                },
                option: {
                  list_pointer: {
                    code: "id",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
              update: {
                validation: ["required"],
                col_size: 6,
                type: "select",
                getter: "getAllProjectUtils",
                setter: "planting_purpose_id",
                param: {
                  project_modul: "purpose",
                },
                option: {
                  getter: "project_planting_purposes_id",
                  default_label: "project_planting_purposes_name",
                  list_pointer: {
                    code: "id",
                    label: "label",
                    display: ["name"],
                  },
                },
              },
              filter: false,
            },
          },

          {
            id: "total_tree",
            label: "Total Pohon",
            methods: {
              list: false,
              detail: true,
              create: {
                type: "number",
                setter: "tree_amount",
                validation: ["required"],
                col_size: 6,
              },
              update: {
                type: "number",
                setter: "tree_amount",
                validation: ["required"],
                col_size: 6,
                option: {
                  getter: "total_trees",
                },
              },
              filter: false,
            },
          },

          {
            id: "co2_capture",
            label: "Proyeksi CO2",
            methods: {
              list: true,
              detail: true,
              create: {
                type: "number",
                validation: ["required"],
                col_size: 6,
                show_if: {
                  id: "planting_purpose_id",
                  type: "equal",
                  value: 7,
                },
              },
              update: {
                type: "number",
                validation: ["required"],
                col_size: 6,
                show_if: {
                  id: "planting_purpose_id",
                  type: "equal",
                  value: 7,
                },
              },
              filter: false,
            },
          },

          {
            id: "project_planting_environments_name",
            label: "Media Tanam",
            methods: {
              list: true,
              detail: true,
              create: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                setter: "planting_environment_id",
                getter: "getAllProjectUtils",
                param: {
                  project_modul: "environment",
                },
                option: {
                  list_pointer: {
                    code: "id",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
              update: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                setter: "planting_environment_id",
                getter: "getAllProjectUtils",
                param: {
                  project_modul: "environment",
                },
                option: {
                  getter: "project_planting_environments_id",
                  default_label: "project_planting_environments_name",
                  list_pointer: {
                    code: "id",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
              filter: false,
            },
          },

          {
            id: "project_period_type",
            label: "Project Period",
            methods: {
              list: true,
              detail: true,
              create: {
                validation: [],
                type: "select-radio",
                col_size: 12,
                setter: "project_period",
                option: {
                  default_value: "one-time",
                  default_options: [
                    {
                      label: "One Time",
                      icon: "mdi-pine-tree-variant-outline",
                      code: "one-time",
                    },
                    {
                      label: "Annually",
                      icon: "mdi-forest",
                      code: "annually",
                    },
                  ],
                  list_pointer: {
                    label: "label",
                    code: "code",
                    display: ["label"],
                  },
                },

                separator: "LAINNYA",
              },
              update: {
                validation: [],
                type: "select-radio",
                col_size: 12,
                setter: "project_period",
                option: {
                  default_value: "one-time",
                  default_options: [
                    {
                      label: "One Time",
                      icon: "mdi-pine-tree-variant-outline",
                      code: "one-time",
                    },
                    {
                      label: "Annually",
                      icon: "mdi-forest",
                      code: "annually",
                    },
                  ],
                  list_pointer: {
                    label: "label",
                    code: "code",
                    display: ["label"],
                  },
                },

                separator: "LAINNYA",
              },
              filter: false,
            },
          },

          {
            id: "year_interval",
            label: "Planting Cycle",
            methods: {
              list: true,
              detail: true,
              create: {
                label: "Planting Cycle (year)",
                validation: ["required"],
                type: "number",
                col_size: 12,
                setter: "year_interval",
                show_if: {
                  id: "project_period",
                  type: "equal",
                  value: "annually",
                },
              },
              update: {
                label: "Planting Cycle (year)",
                validation: ["required"],
                type: "number",
                col_size: 12,
                setter: "year_interval",
                show_if: {
                  id: "project_period",
                  type: "equal",
                  value: "annually",
                },
              },
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
              create: {
                label: "Tanggal Mulai",
                validation: ["required"],
                col_size: 6,
                type: "date",
                setter: "start_date",
              },
              update: {
                label: "Tanggal Mulai",
                validation: ["required"],
                col_size: 6,
                type: "date",
                setter: "start_date",
                option: {
                  getter: "project_date",
                },
              },
              filter: false,
            },
          },

          {
            id: "end_project",
            label: "Tanggal Selesai",
            methods: {
              list: false,
              detail: false,
              create: {
                validation: ["required"],
                col_size: 6,
                type: "date",
                setter: "end_date",
              },
              update: {
                validation: ["required"],
                col_size: 6,
                type: "date",
                setter: "end_date",
              },
              filter: false,
            },
          },

          {
            id: "location",
            label: "Lokasi",
            methods: {
              list: false,
              detail: true,
              create: {
                validation: ["required"],
                col_size: 12,
                type: "textarea",
              },
              update: {
                validation: ["required"],
                col_size: 12,
                type: "textarea",
              },
              filter: false,
            },
          },

          {
            id: "description",
            label: "Deskripsi Project",
            methods: {
              list: false,
              detail: true,
              create: {
                validation: [],
                col_size: 12,
                type: "textarea",
              },
              update: {
                validation: [],
                col_size: 12,
                type: "textarea",
                option: {
                  getter: "note",
                  setter: "description",
                },
              },
              filter: false,
            },
          },

          {
            id: "active",
            label: "Status",
            methods: {
              list: {
                transform: "active",
                class: {
                  1: "badge bg-success text-no-wrap",
                  0: "badge bg-danger text-no-wrap",
                },
              },
              detail: true,
              create: {
                validation: ["required"],
                type: "date",
                col_size: 6,
                type: "select",
                option: {
                  default_options: [
                    {
                      code: 0,
                      label: "Tidak Aktif",
                    },
                    {
                      code: 1,
                      label: "Aktif",
                    },
                  ],
                  default_value: 1,
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["name"],
                  },
                },
              },
              update: {
                validation: ["required"],
                type: "date",
                col_size: 6,
                type: "select",
                option: {
                  getter: "active",
                  default_options: [
                    {
                      code: 0,
                      label: "Tidak Aktif",
                    },
                    {
                      code: 1,
                      label: "Aktif",
                    },
                  ],
                  default_value: 1,
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["name"],
                  },
                },
              },
              filter: false,
            },
          },
        ],
      },
    };
  },

  methods: {
    parseAddress(item) {
      let locations = [];
      let keys = ["city", "state", "country"];

      for (const key of keys) {
        if (item[key]) {
          locations.push(item[key]);
        }
      }

      return locations.join(", ").toLowerCase();
    },
  },
};
</script>
