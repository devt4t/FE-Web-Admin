<template>
  <geko-base-crud :config="config" :hideUpdate="true">
    <!-- LIST -->
    <template v-slot:list-name="{ item }">
      <div class="d-flex flex-row">
        <div class="d-flex flex-column">
          <span>{{ item.name }}</span>
          <span class="d-block badge bg-light">{{ item.ff_no }}</span>
        </div>
      </div>
    </template>
    <!-- END LIST -->

    <!-- CREATE -->
    <template v-slot:create-city="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.city"
          :item="{
            type: 'select',
            label: 'Kota / Kabupaten',
            api: 'GetKabupaten',
            validation: [],
            param: {
              province_code: formData.province,
            },
            option: {
              getterKey: 'data.result',
              list_pointer: {
                label: 'name',
                code: 'kabupaten_no',
                display: ['name'],
              },
            },
          }"
          :disabled="!formData.province"
        />
      </v-col>
    </template>
    <template v-slot:create-kecamatan="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.kecamatan"
          :item="{
            type: 'select',
            label: 'Kecamatan',
            api: 'GetKecamatan',
            validation: [],
            param: {
              kabupaten_no: formData.city,
            },
            option: {
              getterKey: 'data.result',
              list_pointer: {
                label: 'name',
                code: 'kode_kecamatan',
                display: ['name'],
              },
            },
          }"
          :disabled="!formData.city"
        />
      </v-col>
    </template>
    <template v-slot:create-village="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.village"
          :item="{
            type: 'select',
            label: 'Desa',
            api: 'GetDesa',
            validation: [],
            param: {
              kode_kecamatan: formData.kecamatan,
            },
            option: {
              getterKey: 'data.result',
              list_pointer: {
                label: 'name',
                code: 'kode_desa',
                display: ['name'],
              },
            },
          }"
          :disabled="!formData.kecamatan"
        />
      </v-col>
    </template>

    <template v-slot:create-mu_no="{ formData, setFormData, item }">
      <v-col md="12" class="form-separator">
        <h4>AREA KERJA</h4>
      </v-col>
      <v-col lg="6">
        <geko-input
          v-model="formData.mu_no"
          :item="{
            type: 'select',
            label: 'Management Unit',
            api: 'GetManagementUnit',
            validation: ['required'],
            param: {
              program_year: formData.program_year,
            },
            option: {
              getterKey: 'data.result',
              list_pointer: {
                label: 'name',
                code: 'mu_no',
                display: ['name'],
              },
            },
          }"
          :disabled="!formData.program_year"
        />
      </v-col>
    </template>

    <template v-slot:create-target_area="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.target_area"
          :item="{
            type: 'select',
            label: 'Target Area',
            api: 'GetTargetArea',
            validation: ['required'],
            param: {
              program_year: formData.program_year,
              mu_no: formData.mu_no,
            },
            option: {
              getterKey: 'data.result',
              list_pointer: {
                label: 'name',
                code: 'area_code',
                display: ['name'],
              },
            },
          }"
          :disabled="!formData.mu_no"
        />
      </v-col>
    </template>

    <template v-slot:create-working_area="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.working_area"
          :item="{
            type: 'select',
            label: 'Working Area / Desa',
            api: 'GetDesa',
            validation: ['required'],
            param: {
              program_year: formData.program_year,
              kode_ta: formData.target_area,
            },
            option: {
              getterKey: 'data.result',
              list_pointer: {
                label: 'name',
                code: 'kode_desa',
                display: ['name'],
              },
            },
          }"
          :disabled="!formData.target_area"
        />
      </v-col>
    </template>

    <template v-slot:create-fc_no="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.fc_no"
          :item="{
            type: 'select',
            label: 'PIC T4T (Field Coordinator)',
            api: 'getEmployeeList_new',
            validation: ['required'],
            param: {
              program_year: formData.program_year,
            },
            option: {
              // getterKey: 'data.result.data',
              list_pointer: {
                label: 'name',
                code: 'nik',
                display: ['name'],
              },
            },
          }"
        />
      </v-col>
    </template>

    <!-- END CREATE -->
  </geko-base-crud>
</template>

<script>
import defaultData from "./FFData";
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
        setter: "AddFieldFacilitator",
        setter_ext_payload: {
          active: "1",
          user_id: this.$store.state.User.employee_no,
        },
        detail: "GetDetailFFWeb_new",
        detailIdKey: "ff_no",
        detailKey: "data.DetailFarmerMain",
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
              detail: false,
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
              list: {
                type: "row-slot",
              },
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
              detail: {
                transform: "gender",
              },
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
            id: "religion",
            label: "Agama",
            methods: {
              detail: {
                class: "text-capitalize",
              },
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
                  default_options: defaultData.gender,
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
                  default_options: defaultData.gender,
                },
              },
            },
          },

          {
            id: "phone",
            label: "No HP",
            methods: {
              list: false,
              detail: {
                transform: "no-empty",
              },
              create: {
                validation: ["required", "phone"],
                col_size: 6,
                type: "text",
              },
              update: {
                validation: ["required", "phone"],
                col_size: 6,
                type: "text",
              },
              filter: false,
            },
          },

          {
            id: "birthday",
            label: "Tanggal Lahir",
            methods: {
              detail: {
                transform: "date",
              },
              create: {
                validation: ["required"],
                col_size: 6,
                type: "date",
              },
              update: {
                validation: ["required"],
                col_size: 6,
                type: "date",
              },
              filter: false,
            },
          },

          {
            id: "ktp_no",
            label: "NIK / No KTP",
            methods: {
              detail: {
                transform: "no-empty",
              },
              create: {
                validation: ["required", "length:16"],
                col_size: 6,
                type: "number",
              },
              update: {
                validation: ["required", "length:16"],
                col_size: 6,
                type: "number",
              },
              filter: false,
            },
          },

          {
            id: "marrital",
            label: "Status Perkawinan",
            methods: {
              detail: {
                class: "text-capitalize",
              },
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
                      code: "kawin",
                      label: "Kawin",
                    },
                    {
                      code: "belum kawin",
                      label: "Belum Kawin",
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
                      code: "kawin",
                      label: "Kawin",
                    },
                    {
                      code: "belum kawin",
                      label: "Belum Kawin",
                    },
                  ],
                },
              },
            },
          },

          {
            id: "join_date",
            label: "Tanggal Bergabung",
            methods: {
              detail: {
                transform: "date",
              },
              create: {
                validation: ["required"],
                col_size: 6,
                type: "date",
              },
              update: {
                validation: ["required"],
                col_size: 6,
                type: "date",
              },
              filter: false,
            },
          },

          {
            id: "province",
            label: "Provinsi",
            methods: {
              detail: {
                view_data: "provinces_name",
                transform: "no-empty",
              },
              create: {
                separator: "Domisili FF",
                validation: [],
                type: "select",
                getter: "GetProvince",
                col_size: 6,
                option: {
                  getterKey: "data.result",
                  list_pointer: {
                    code: "province_code",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
              update: {
                separator: "Domisili FF",
                validation: ["required"],
                type: "select",
                getter: "GetProvince",
                col_size: 6,
                option: {
                  getterKey: "data.result",
                  list_pointer: {
                    code: "province_code",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
            },
          },

          {
            id: "city",
            label: "Kota",
            methods: {
              detail: {
                view_data: "kabupatens_name",
                transform: "no-empty",
              },
              create: {
                type: "row-slot",
                validation: ["required"],
                getter: "GetKabupaten",
                col_size: 6,
              },
              update: {
                validation: ["required"],
                type: "row-slot",
                getter: "GetKabupaten",
                col_size: 6,
              },
            },
          },

          {
            id: "kecamatan",
            label: "Kecamatan",
            methods: {
              list: false,
              detail: {
                view_data: "kecamatans_name",
                transform: "no-empty",
              },
              create: {
                type: "row-slot",
              },
              update: {
                type: "row-slot",
              },
            },
          },

          {
            id: "village",
            label: "Desa",
            methods: {
              detail: {
                view_data: "desas_name_villages",
                transform: "no-empty",
              },
              create: {
                type: "row-slot",
              },
              update: {
                type: "row-slot",
              },
            },
          },

          {
            id: "address",
            label: "Alamat",
            methods: {
              detail: true,
              create: {
                type: "textarea",
                validation: [],
                col_size: 6,
              },
              update: {
                type: "textarea",
                validation: [],
                col_size: 6,
              },
            },
          },

          {
            id: "post_code",
            label: "Kode Pos",
            methods: {
              detail: true,
              create: {
                type: "text",
                validation: ["length:5"],
                col_size: 6,
              },
              update: {
                type: "text",
                validation: ["length:5"],
                col_size: 6,
              },
            },
          },

          {
            id: "mu_no",
            label: "Unit Management",
            methods: {
              list: {
                view_data: "managementunits_name",
              },
              detail: {
                view_data: "managementunits_name",
              },
              create: {
                type: "row-slot",
              },
              update: {
                type: "row-slot",
              },
            },
          },

          {
            id: "target_area",
            label: "Target Area",
            methods: {
              list: {
                view_data: "target_areas_name",
              },
              detail: {
                view_data: "target_areas_name",
              },
              create: {
                type: "row-slot",
              },
              update: {
                type: "row-slot",
              },
            },
          },

          {
            id: "working_area",
            label: "Working Area / Desa",
            methods: {
              list: {
                view_data: "desas_name",
              },
              detail: {
                view_data: "desas_name",
              },
              create: {
                type: "row-slot",
              },
              update: {
                type: "row-slot",
              },
            },
          },

          {
            id: "fc_no",
            label: "PIC T4T (Field Coordinator)",
            methods: {
              detail: {
                view_data: "employees_name",
              },
              create: {
                type: "row-slot",
              },
              update: {
                type: "row-slot",
              },
            },
          },

          {
            id: "bank_name",
            label: "Nama Bank",
            methods: {
              detail: true,
              create: {
                separator: "BANK",
                type: "text",
                col_size: 6,
                validation: [],
              },
              update: {
                separator: "BANK",
                type: "text",
                validation: [],
              },
            },
          },

          {
            id: "bank_account",
            label: "Akun Bank",
            methods: {
              detail: true,
              create: {
                type: "text",
                col_size: 6,
                validation: [],
              },
              update: {
                type: "text",
                validation: [],
              },
            },
          },

          {
            id: "status",
            label: "Status",
            methods: {
              list: {
                view_data: "active",
                class: {
                  1: "badge bg-success",
                  0: "badge bg-danger",
                },
                transform: "active",
              },
              detail: {
                view_data: "active",
                class: {
                  1: "badge bg-success",
                  0: "badge bg-danger",
                },
                transform: "active",
              },
            },
          },
        ], // END CONFIG
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
