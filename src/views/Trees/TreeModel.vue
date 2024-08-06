<template>
  <geko-base-crud :config="config" :hideUpdate="true">
    <template v-slot:list-tree_id="{ item }">
      <div class="d-flex flex-column">
        <p class="mb-0">
          <span
            >{{ item.trees_tree_name }}
            <span
              v-if="
                item.trees_common_name &&
                item.trees_common_name.toLowerCase() !==
                  item.trees_tree_name.toLowerCase()
              "
              class="font-weight-300"
              >({{ item.trees_common_name }})</span
            ></span
          >
        </p>
        <div class="d-flex flex-row">
          <div class="badge bg-light">{{ item.tree_code }}</div>
        </div>
      </div>
    </template>
  </geko-base-crud>
</template>

<script>
export default {
  name: "crud-planting-purpose",
  watch: {},
  data() {
    return {
      config: {
        title: "Tree Model",
        program_year: {
          show: false,
          model: "2024",
        },
        model_api: null,
        getter: "GetTreeModels",
        setter: "AddTreeModels",
        delete: "DeleteTreeModels",
        delete_ext_payload: {
          delete_type: "hard_delete",
        },
        globalFilter: {
          // project_purpose: {
          //   setter: "purpose_code",
          // },
          program_year: {
            setter: "planting_year",
          },
        },
        pk_field: null,
        permission: {
          create: "tree-model-create",
          read: "tree-model-list",
          update: "tree-model-update",
          detail: "tree-model-detail",
          lookup: "tree-model-lookup",
          delete: "tree-model-delete",
        },
        slave: [],
        fields: [
          {
            id: "model_id",
            label: "Model",
            methods: {
              list: {
                class: "font-weight-bold",
              },
              detail: true,
              create: {
                validation: ["required"],
                type: "select-radio",
                col_size: 12,
                setter: "model_id",
                option: {
                  default_options: [
                    {
                      label: "Model 1",
                      code: 1,
                    },
                    {
                      label: "Model 2",
                      code: 2,
                    },
                    {
                      label: "Model 3",
                      code: 3,
                    },
                    {
                      label: "Model 4",
                      code: 4,
                    },
                  ],
                  list_pointer: {
                    label: "label",
                    code: "code",
                    display: ["label"],
                  },
                },
              },
            },
          },

          {
            id: "tree_category",
            label: "Kategori Pohon",
            methods: {
              list: {
                view_data: "trees_tree_category",
              },
              detail: {
                view_data: "trees_tree_category",
              },
            },
          },

          {
            id: "tree_id",
            label: "Pohon",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: {
                view_data: "trees_tree_name",
              },
              create: {
                validation: ["required"],
                type: "select",
                col_size: 12,
                setter: "tree_code",
                getter: "GetTreesAll",
                option: {
                  getterKey: "data.result.data",
                  list_pointer: {
                    code: "tree_code",
                    label: "tree_name",
                    display: ["tree_name"],
                  },
                },
              },
              filter: false,
            },
          },
          {
            id: "tree_code",
            label: "Kode Pohon",
            methods: {
              detail: true,
            },
          },

          {
            id: "trees_common_name",
            label: "Nama Umum",
            methods: {
              detail: true,
            },
          },

          {
            id: "planting_year",
            label: "Tahun Tanam",
            methods: {
              detail: true,
            },
          },

          {
            id: "planting_year",
            label: "Tahun Tanam",
            methods: {
              list: true,
              detail: false,
              create: {
                validation: ["required"],
                type: "select-radio",
                col_size: 12,
                setter: "planting_year",
                option: {
                  default_options: [
                    {
                      label: "2020",
                      code: "2020",
                    },
                    {
                      label: "2021",
                      code: "2021",
                    },
                    {
                      label: "2022",
                      code: "2022",
                    },
                    {
                      label: "2023",
                      code: "2023",
                    },
                    {
                      label: "2024",
                      code: "2024",
                    },
                  ],
                  list_pointer: {
                    label: "label",
                    code: "code",
                    display: ["label"],
                  },
                },
              },
            },
          },
        ],
      },
    };
  },
};
</script>
