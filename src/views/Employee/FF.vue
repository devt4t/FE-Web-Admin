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
    <template v-slot:detail-date="{ item }">
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

    <template v-slot:detail-donors_name="{ item }">
      <span>{{ item.participants_first_name }} </span>
      <span v-if="item.participants_last_name"
        >{{ " " }}{{ item.participants_last_name }}
      </span>
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
        title: "Field Facilitator",
        model_api: null,
        getter: "GetFFAllWeb_new",
        getterDataKey: "data",
        setter: "AddFF_new",
        // update: "UpdateDataProject",
        // delete: "deleteProject",
        // update_id_setter: "current_id",
        // deleteKey: "code",
        pk_field: null,
        permission: {
          create: "field-facilitator-create",
          read: "field-facilitator-list",
          update: "field-facilitator-update",
          show: "field-facilitator-show",
          lookup: "field-facilitator-lookup",
          delete: "field-facilitator-delete",
        },
        // formOption: {
        //   sort: [
        //     "project_name",
        //     "project_no",
        //     "donors_name",

        //     "project_types_name",
        //     "project_planting_environments_name",
        //     "total_tree",
        //     "project_planting_purposes_name",
        //     "co2_capture",
        //     "project_period_type",
        //     "year_interval",
        //     "date",
        //     "end_project",
        //     "location",
        //     "description",
        //     "active",
        //   ],
        // },
        slave: [],
        fields: [
          {
            id: "program_year",
            label: "Tahun Program",
            methods: {
              detail: true,
              create: {
                separator: "TAHUN PROGRAM",
                validation: ["required"],
                type: "select",
                col_size: 6,
                setter: "program_year",
                option: {
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["label"],
                  },
                  default_options: [
                    {
                      code: "2020",
                      label: "2020",
                    },
                    {
                      code: "2021",
                      label: "2021",
                    },
                    {
                      code: "2022",
                      label: "2022",
                    },
                    {
                      code: "2023",
                      label: "2023",
                    },
                    {
                      code: "2024",
                      label: "2024",
                    },
                  ],
                },
              },
              update: {
                separator: "PROGRAM YEAR",
                validation: ["required"],
                type: "select",
                col_size: 6,
                setter: "program_year",
                option: {
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["label"],
                  },
                  default_options: [
                    {
                      code: "2020",
                      label: "2020",
                    },
                    {
                      code: "2021",
                      label: "2021",
                    },
                    {
                      code: "2022",
                      label: "2022",
                    },
                    {
                      code: "2023",
                      label: "2023",
                    },
                    {
                      code: "2024",
                      label: "2024",
                    },
                  ],
                },
              },
              filter: false,
            },
          },

          {
            id: "name",
            label: "Nama FF",
            methods: {
              list: true,
              detail: {
                transform: "no-empty",
              },
              create: {
                validation: ["required"],
                col_size: 6,
                type: "text",
                separator: "IDENTITAS FF",
              },
              update: {
                validation: ["required"],
                col_size: 6,
                type: "text",
                separator: "IDENTITAS FF",
              },
              filter: false,
            },
          },
          {
            id: "gender",
            label: "Jenis Kelamin",
            methods: {
              detail: true,
              create: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["label"],
                  },
                  default_options: [
                    {
                      code: "male",
                      label: "Laki-Laki",
                    },
                    {
                      code: "female",
                      label: "Perempuan",
                    },
                  ],
                },
              },
              update: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["label"],
                  },
                  default_options: [
                    {
                      code: "male",
                      label: "Laki-Laki",
                    },
                    {
                      code: "female",
                      label: "Perempuan",
                    },
                  ],
                },
              },
            },
          },
          {
            id: "gender",
            label: "Agama",
            methods: {
              detail: true,
              create: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["label"],
                  },
                  default_options: [
                    {
                      code: "male",
                      label: "Laki-Laki",
                    },
                    {
                      code: "female",
                      label: "Perempuan",
                    },
                  ],
                },
              },
              update: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                option: {
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["label"],
                  },
                  default_options: [
                    {
                      code: "male",
                      label: "Laki-Laki",
                    },
                    {
                      code: "female",
                      label: "Perempuan",
                    },
                  ],
                },
              },
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
