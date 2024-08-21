<template>
  <geko-base-crud
    :config="config"
    :hideUpdate="!['13', '4', '19', '20'].includes($store.state.User.role)"
    :refreshKey="refreshKey"
    :hideDelete="!['13', '4'].includes($store.state.User.role)"
    @create-success="onCreateSuccess($event)"
    :hideCreate="['19'].includes($store.state.User.role)"
  >
    <!-- LIST -->
    <template v-slot:list-name="{ item }">
      <div class="d-flex flex-row">
        <div class="d-flex flex-column">
          <span>{{ item.name }}</span>
          <span class="d-block badge bg-light">{{ item.ff_no }}</span>
        </div>
      </div>
    </template>

    <template v-slot:list-indicator="{ item }">
      <div class="indicator-wrapper pt-1">
        <div
          class="indicator"
          :class="{
            danger: item.active == 0,
            success: item.active == 1,
          }"
        ></div>
      </div>
    </template>
    <template v-slot:list-bottom-action="{ item }">
      <v-btn
        variant="info"
        small
        class="d-flex flex-row align-items-center mt-2"
        @click="onAssignProgramYear(item)"
        v-if="$_sys.isAllowed('field-facilitator-update')"
      >
        <v-icon small class="mr-1">mdi-account-switch</v-icon>
        <span>Assign</span>
      </v-btn>
      <!-- <v-btn
        variant="warning"
        small
        class="d-flex flex-row align-items-center mt-1"
        @click="onAssignEmail(item)"
        v-if="
          (typeof item.ff_users_data === 'object' &&
            item.ff_users_data !== null &&
            !item.ff_users_data.email) ||
          !item.ff_users_data
        "
      >
        <v-icon small class="mr-1">mdi-email-edit-outline</v-icon>
        <span>Email</span>
      </v-btn> -->
    </template>

    <template v-slot:list-main_pivots_program_year="{ item }">
      <div
        class="d-flex flex-row list-program-year justify-content-center"
        style="width: 150px; flex-wrap: wrap"
        v-if="item.main_pivots_program_year"
      >
        <span
          class="badge bg-custom mr-1 mb-1"
          :class="{
            [`y${item}`]: true,
          }"
          v-for="(item, i) in item.main_pivots_program_year
            .replace(/ /g, '')
            .split(',')
            .map((v) => parseInt(v))
            .sort(function (a, b) {
              return a - b;
            })"
          >{{ item }}</span
        >
      </div>
    </template>
    <template v-slot:list-email="{ item }">
      <div
        v-if="
          typeof item.ff_users_data === 'object' &&
          item.ff_users_data !== null &&
          item.ff_users_data.email
        "
      >
        <span>{{ item.ff_users_data.email }}</span>
      </div>
      <div v-else>-</div>
    </template>

    <template v-slot:list-after-filter>
      <ff-assign-modal
        @success="refreshKey = refreshKey + 1"
        :data="ffData"
        :dataKey="ffDataKey"
      ></ff-assign-modal>
      <ff-email-modal
        @success="refreshKey = refreshKey + 1"
        :data="emailData"
        :dataKey="emailDataKey"
      ></ff-email-modal>
    </template>
    <!-- END LIST -->

    <!-- DETAIL -->

    <template v-slot:detail-main_pivots_program_year="{ item }">
      <div
        class="d-flex flex-row list-program-year"
        v-if="item.main_pivots_program_year"
      >
        <span
          class="badge bg-custom mr-1 mb-1"
          :class="{
            [`y${item}`]: true,
          }"
          v-for="(item, i) in item.main_pivots_program_year
            .replace(/ /g, '')
            .split(',')
            .map((v) => parseInt(v))
            .sort(function (a, b) {
              return a - b;
            })"
          >{{ item }}</span
        >
      </div>
      <div v-else>-</div>
    </template>

    <template v-slot:detail-email="{ item }">
      <div
        v-if="
          typeof item.ff_users_data === 'object' &&
          item.ff_users_data !== null &&
          item.ff_users_data.email
        "
      >
        <span>{{ item.ff_users_data.email }}</span>
      </div>
      <div v-else>-</div>
    </template>
    <!-- END DETAIL -->
    <!-- CREATE -->
    <template v-slot:create-city="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.city"
          :item="{
            type: 'select',
            label: 'Kota / Kabupaten',
            api: 'GetKabupaten',
            validation: ['required'],
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
            validation: ['required'],
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
            validation: ['required'],
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

    <!-- UPDATE -->
    <template v-slot:update-city="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.city"
          :item="{
            type: 'select',
            label: 'Kota / Kabupaten',
            api: 'GetKabupaten',
            validation: [],
            default_label: formData.kabupatens_name_domicile,
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

    <template v-slot:update-kecamatan="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.kecamatan"
          :item="{
            type: 'select',
            label: 'Kecamatan',
            api: 'GetKecamatan',
            validation: [],
            default_label: formData.kecamatans_name_domicile,
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

    <template v-slot:update-village="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.village"
          :item="{
            type: 'select',
            label: 'Desa',
            api: 'GetDesa',
            validation: [],
            default_label: formData.desas_name_domicile,
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

    <template v-slot:update-mu_no="{ formData, setFormData, item }">
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
            default_label: formData.managementunits_name,
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
        />
      </v-col>
    </template>

    <template v-slot:update-target_area="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.target_area"
          :item="{
            type: 'select',
            label: 'Target Area',
            api: 'GetTargetArea',
            validation: ['required'],
            default_label: formData.target_areas_name,
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

    <template v-slot:update-working_area="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.working_area"
          :item="{
            type: 'select',
            label: 'Working Area / Desa',
            api: 'GetDesa',
            validation: ['required'],
            default_label: formData.desas_name,
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

    <template v-slot:update-fc_no="{ formData, setFormData, item }">
      <v-col lg="6">
        <geko-input
          v-model="formData.fc_no"
          :item="{
            type: 'select',
            label: 'PIC T4T (Field Coordinator)',
            api: 'getEmployeeList_new',
            validation: ['required'],
            default_label: formData.employees_name,
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
          :disabled="true"
        />
      </v-col>
    </template>
    <!-- END UPDATE -->
  </geko-base-crud>
</template>

<script>
import defaultData from "./FFData";
import FfAssignModal from "./FFAssignModal.vue";
import FfEmailModal from "./FFEmailModal.vue";
import "./ff.scss";
export default {
  name: "crud-donor",
  components: {
    FfAssignModal,
    FfEmailModal,
  },
  watch: {},
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
    onAssignProgramYear(item) {
      this.ffData = item;
      this.ffDataKey = this.ffDataKey + 1;
    },
    onAssignEmail(item) {
      this.emailData = item;
      this.emailDataKey = this.emailDataKey + 1;
    },
    onCreateSuccess(data) {
      console.log("data", data);
      this.$_alert.success(
        "Success",
        `<div><p>Data FF berhasil ditambahkan. Berikut akses akun FF :</p><p>Kode FF: <strong>${data.data.result.ff_no}</strong></p><p>Email: <strong>${data.data.result.email}</strong></p><p>Password: <strong>123456</strong></p></div>`,
        "center",
        true,
        120000,
        true
      );
    },
  },

  mounted() {
    this.$set(this.config, "setter_ext_payload", {
      active: "1",
      user_id: this.$store.state.User.employee_no,
    });
  },

  data() {
    return {
      ffData: null,
      ffDataKey: 0,
      emailData: null,
      emailDataKey: 0,
      refreshKey: 0,
      config: {
        title: "Field Facilitator",
        class: "ff-module",
        model_api: null,
        getter: "GetFFAllWeb_new",
        getterDataKey: "data",
        setter: "AddFieldFacilitator",
        setter_ext_payload: {},
        detail: "GetDetailFFWeb_new",
        detailIdKey: "ff_no",
        detailKey: "data.DetailFarmerMain",
        detailParams: true,

        formConfig: {
          hideCreateAlert: true,
        },
        update: "UpdateFieldFacilitator",
        delete: "HardDeleteFF_new",
        // update_id_setter: "current_id",
        deleteKey: "ff_no",

        globalFilter: {
          // project_purpose: {
          //   setter: "purpose_code",
          // },
          program_year: {
            setter: "program_year",
          },
        },
        pk_field: null,
        permission: {
          create: "field-facilitator-create",
          read: "field-facilitator-list",
          update: "field-facilitator-update",
          detail: "field-facilitator-detail",
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
            id: "indicator",
            label: " ",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },
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
            id: "ff_no",
            label: "Kode FF",
            methods: {
              update: {
                disabled: true,
                validation: ["required"],
                col_size: 6,
              },
            },
          },

          {
            id: "email",
            label: "Email",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: {
                type: "slot",
              },
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
                view_data: "provinces_name_domicile",
                transform: "no-empty",
              },
              create: {
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
              update: {
                separator: "Domisili FF",
                validation: ["required"],
                type: "select",
                getter: "GetProvince",
                col_size: 6,
                option: {
                  default_label: "provinces_name_domicile",
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
                view_data: "kabupatens_name_domicile",
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
                base_type: "select",
                option: {
                  default_label: "kabupatens_name_domicile",
                },
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
                view_data: "kecamatans_name_domicile",
                transform: "no-empty",
              },
              create: {
                type: "row-slot",
              },
              update: {
                type: "row-slot",
                base_type: "select",
                option: {
                  default_label: "kecamatans_name_domicile",
                },
              },
            },
          },

          {
            id: "village",
            label: "Desa",
            methods: {
              detail: {
                view_data: "desas_name_domicile",
                transform: "no-empty",
              },
              create: {
                type: "row-slot",
              },
              update: {
                type: "row-slot",
                base_type: "select",
                option: {
                  default_label: "desas_name_domicile",
                },
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
                validation: ['required'],
                col_size: 6,
              },
              update: {
                type: "textarea",
                validation: ['required'],
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
                base_type: "select",
                option: {
                  default_label: "managementunits_name",
                },
              },

              filter: {
                validation: ["required"],
                type: "select",
                main: true,
                col_size: 6,
                getter: "GetManagementUnitAdmin",
                setter: "mu_no",
                param: {
                  page: 1,
                  per_page: 10,
                },
                option: {
                  getterKey: "data.result",
                  list_pointer: {
                    code: "mu_no",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
            },
          },

          {
            id: "fc_filter",
            label: "Field Coordinator",
            methods: {
              filter: {
                validation: ["required"],
                type: "select",
                main: true,
                col_size: 6,
                getter: "getEmployeeList_new",
                setter: "fc_filter",
                param: {
                  page: 1,
                  per_page: 10,
                },
                option: {
                  list_pointer: {
                    code: "nik",
                    label: "name",
                    display: ["name"],
                  },
                },
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
                base_type: "select",
                option: {
                  default_label: "target_areas_name",
                },
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
                base_type: "select",
                option: {
                  default_label: "desas_name",
                },
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
                base_type: "select",
                disabled: true,
                option: {
                  default_label: "employees_name",
                },
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
            id: "main_pivots_program_year",
            label: "Program Year",
            methods: {
              list: {
                header_class: "text-center",
                type: "row-slot",
              },
              detail: {
                type: "slot",
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
              update: {
                validation: ["required"],
                type: "select-radio",
                col_size: 6,
                setter: "active",
                view_data: "active",
                option: {
                  list_pointer: {
                    code: "code",
                    label: "label",
                    display: ["label"],
                  },
                  default_options: [
                    {
                      label: "Aktif",
                      code: "1",
                    },
                    {
                      label: "Tidak Aktif",
                      code: "0",
                    },
                  ],
                },
              },
              filter: {
                type: "select",
                setter: "active",
                icon: "list-status",
                main: true,
                option: {
                  default_options: [
                    {
                      name: "Semua Status",
                      code: null,
                    },
                    {
                      name: "Aktif",
                      code: 1,
                    },
                    {
                      name: "Tidak Aktif",
                      code: "0",
                    },
                  ],
                  list_pointer: {
                    code: "code",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
            },
          },
        ], // END CONFIG
      },
    };
  },
};
</script>
