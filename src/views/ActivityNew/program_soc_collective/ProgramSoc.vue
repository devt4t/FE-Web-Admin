<template>
  <geko-base-crud
    :config="config"
    :hideDelete="false"
    :hideUpdate="false"
    :hideDeleteSoft="false"
    :key="'program-soc-detail' + componentKey"
  >
    <template v-slot:list-form_no="{ item }">
      <div class="d-flex flex-column min-w-150px">
        <p class="mb-0 text-link font-weight-500">#{{ item.form_no }}</p>
        <p class="mb-0 font-weight-300">{{ formatDate(item.form_date) }}</p>
      </div>
    </template>

    <template v-slot:list-total_farmer="{ item }">
      <p class="mb-0 text-no-wrap">
        {{
          [undefined, null].includes(item.total_farmer)
            ? "-"
            : item.total_farmer
        }}
        peserta
      </p>
    </template>

    <template v-slot:list-target_area_id="{ item }">
      <div class="d-flex flex-column min-w-100px">
        <p class="mb-0 text-09-em">{{ item.target_areas_name }}</p>
        <p class="mb-0 text-grey text-09-em">
          MU {{ item.managementunits_name }}
        </p>
      </div>
    </template>

    <template v-slot:list-indicator="{ item }">
      <div class="indicator-wrapper pt-1">
        <div
          class="indicator"
          :class="{
            success: item.is_verified == 1,
            danger: item.is_verified == 0,
          }"
        ></div>
      </div>
    </template>

    <template v-slot:detail-pattern="{ item }">
        {{ item.pattern ? item.pattern.replace(/,/g, ', ') : '-' }}
    </template>

    <template v-slot:detail-pattern_new="{ item }">
        {{ item.pattern_new ? item.pattern_new.replace(/,/g, ', ') : '-' }}
    </template>

    <template v-slot:detail-action="{ item }">
      <div>
        <v-btn
          v-if="
            item.is_verified == 0 &&
            $store.state.User &&
            $_sys.isAllowed('sosialisasi-program-verification-create')
          "
          variant="success"
          @click="onVerify"
          >Verifikasi</v-btn
        >
        <v-btn
          v-if="
            item.is_verified == 1 &&
            $store.state.User &&
            $_sys.isAllowed('sosialisasi-program-unverification-create')
          "
          variant="danger"
          @click="onVerify(false)"
          >Unverifikasi</v-btn
        >
      </div>
    </template>

    <template v-slot:detail-lahan_legal_status="{ item }">
      <div v-for="(legal, index) in item.lahan_legal_status.split(',')" :key="index">
          {{ ++index + ". " }} {{ legal | parse('lahan-legal-status') }}
      </div>
    </template>

    <template v-slot:list-bottom-action="{ item }">
      <v-btn
        small
        @click="onExport(item)"
        variant="danger"
        class="mt-1"
        v-if="item.is_verified"
      >
        <v-icon small v-if="!exportIds.includes(item.id)"
          >mdi-file-pdf-box</v-icon
        >

        <v-progress-circular
          v-else
          color="danger"
          :size="15"
          :width="2"
          indeterminate
        ></v-progress-circular>
        <span class="text-09-em ml-1">Export</span>
      </v-btn>
    </template>

    <template v-slot:create-form>
      <program-soc-form />
    </template>

    <!-- DETAIL SLAVE -->
    <template v-slot:detail-slave-raw="{ data }">
      <program-soc-detail :data="data" />
    </template>

    <template v-slot:list-before-create>
        <progsoc-collective-export-modal :dataKey="exportKey" />
    </template>

    <template v-slot:list-after-filter>
        <div class="d-flex flex-row justify-content-start">
            <v-btn variant="info" class="mr-2" @click="exportKey += 1">
                <v-icon>mdi-table-arrow-right</v-icon>
                <span>Export Excel</span>
            </v-btn>
        </div>
    </template>
  </geko-base-crud>
</template>

<script>
import "./program-soc.scss";
import moment from "moment";
import ProgramSocForm from "./ProgramSocForm.vue";
import ProgramSocDetail from "./ProgramSocDetail.vue";
import defaultData from "./ProgramSocData.js";
import axios from "axios";

import ProgsocCollectiveExportModal from "./ProgsocCollectiveExportModal.vue";

export default {
  name: "pra-module",
  components: {
    ProgramSocForm,
    ProgramSocDetail,
    ProgsocCollectiveExportModal,
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("User"));
    console.log("ProgramSoc mounted", user);
    this.user = user;
  },
  methods: {

    //refactored
    async onExportExcel(data) {

      if (this.isExportingExcel) return;
      this.isExportingExcel = true;

      this.$_alert.loading(
        "Sedang mengexport data",
        "Mohon tunggu sebentar, proses ini memerlukan waktu beberapa saat"
      );

      const delay = (ms) => new Promise((res) => setTimeout(res, ms));

      let reqParams = {
        ...data.filter,
        ...data.params,
        limit: parseInt(data.totalRecord * 1.5),
        program_year: this.$_config.programYear.model,
      };

      try {
        const { data: dataList } = await this.$_api.get(
          "GetFormMinatBulkData_new",
          reqParams
        );

        if (!dataList) {
          this.isExportingExcel = false;
          this.$_alert.error(
            {},
            "Export Gagal",
            "Gagal mengambil data list sosialisasi program"
          );
          return;
        }

        const axiosConfig = {
          method: "POST",
          url: `${this.$_config.baseUrlExport}export/soc-prog/excel`,
          responseType: "arraybuffer",
          data: { data: dataList },
        };

        const { data: exported } = await axios(axiosConfig);

        if (!exported) {
          this.isExportingExcel = false;
          this.$_alert.error({}, "Export Gagal");
          return;
        }

        const url = URL.createObjectURL(new Blob([exported]));
        const link = document.createElement("a");
        const filename = `sosialisasi-program-export${moment().format(
          "DMMYYYYHHmmss"
        )}.xlsx`;

        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        this.isExportingExcel = false;
        this.$_alert.success("Successfully");
      } catch (error) {
        this.isExportingExcel = false;
        this.$_alert.error({}, "Export Gagal");
      }
    },

    async onExport(data) {
      if (this.exportIds.includes(data.id)) return;
      this.exportIds.push(data.id);
      const result = await this.$_api
        .get("GetFormMinatCollectiveDetailAll_new", {
          id: data.id,
        })
        .catch(() => false);
      if (!result) {
        let idx = this.exportIds.findIndex((x) => x == data.id);
        this.exportIds.splice(idx, 1);
        return;
      }


      const exported = await axios
        .post(
          `${this.$_config.baseUrlExport}export/soc-prog-collective/pdf`,
          {
            ...result.mainSpr,
            trees: result.sprTrees,
          },
          {
            responseType: "arraybuffer",
          }
        )
        .catch(() => false);

      if (!exported) {
        let idx = this.exportIds.findIndex((x) => x == data.id);
        this.exportIds.splice(idx, 1);
        return;
      }
      const url = URL.createObjectURL(
        new Blob([exported.data], {
          type: "application/pdf",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      const filename = `sosialisasi-program-${data.form_no}-${data.desas_name}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      let idx = this.exportIds.findIndex((x) => x == data.id);
      this.exportIds.splice(idx, 1);
    },
    onVerify(verif = true) {
      this.$_alert
        .confirm(
          "",
          "Data yang sudah diverifikasi tidak dapat di unverifikasi. Apakah anda yakin ingin melanjutkan?",
          "",
          "",
          true
        )
        .then((response) => {
          if (response.isConfirmed) {
            this.$_api
              .post("VerificationFormMinatCollective", {
                id: this.$route.query.id,
                verified_by: this.user.employee_no,
                moduls: verif ? 1 : 0,
              })
              .then(() => {
                this.$_alert.success("Data berhasil diverifikasi");
                this.componentKey += 1;
              })
              .catch((err) => {
                this.$_alert.error(err);
              });
          }
        });
    },
  },

  computed: {
    defaultData() {
      return defaultData;
    },
  },

  data() {
    return {
      exportKey: 0,
      exportIds: [],
      isExportingExcel: false,
      componentKey: 1,
      formatDate(date, format = "YYYY-MM-DD", dateFormat = "YYYY-MM-DD") {
        return moment(date, format).format("DD MMMM YYYY");
      },
      config: {
        title: "Sosialisasi Program Collective",
        model_api: null,
        getter: "GetFormMinatCollectiveAll_new",
        // getterDataKey: "data.result.data",
        detail: "GetFormMinatCollectiveDetailAll_new",
        detailIdKey: "id",
        detailKey: "mainSpr",
        setter: "GetFormMinatAll",

        deleteSoft: {
          payload: {
            delete_type: "soft_delete",
          },
        },

        delete: "",

        deleteKey: "form_no",
        updateValidationKey: "is_verified",
        delete_ext_payload: {
          delete_type: "hard_delete",
        },
        // update: "UpdateDataProject",
        // delete: "deleteProject",
        // update_id_setter: "current_id",
        // allow_create: false,

        globalFilter: {
          // project_purpose: {
          //   setter: "purpose_code",
          // },
          program_year: {
            setter: "program_year",
          },
        },
        export: false,
        pk_field: null,
        permission: {
          create: "sosialisasi-program-create",
          read: "sosialisasi-program-list",
          update: "sosialisasi-program-update",
          detail: "sosialisasi-program-detail",
          lookup: "sosialisasi-program-lookup",
          delete: "sosialisasi-program-delete",
        },
        statistic: {
          statistic_key: "farmer_counter",
          transform_key: {
            total_data: {
              label: "Total Petani Yang Hadir",
              icon: "mdi-list-status",
            },
            berminat: {
              label: "Berminat",
              icon: "mdi-check-circle-outline",
              color: "success",
            },
            tidak_berminat: {
              label: "Belum Berminat",
              icon: "mdi-close-circle-outline",
              color: "danger",
            },
            masih_ragu: {
              label: "Ragu - Ragu",
              icon: "mdi-close-circle-outline",
              color: "info",
            },
          },
        },
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
            id: "indicator",
            label: " ",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },

          {
            id: "form_no",
            label: "Form no",
            methods: {
              list: {
                class: "min-w-100px",
                type: "row-slot",
              },
              detail: true,
              create: true,
              update: true,
              filter: false,
            },
          },

          {
            id: "village_id",
            label: "Desa",
            methods: {
              list: {
                view_data: "desas_name",
              },
              detail: {
                view_data: "desas_name",
              },
              create: true,
              update: true,
              filter: false,
            },
          },

          {
            id: "target_area_id",
            label: "Target Area",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: {
                view_data: "target_areas_name",
              },
              create: true,
              update: true,
            },
          },

          {
            id: "management_unit_id",
            label: "Management Unit",
            methods: {
              list: false,
              detail: {
                view_data: "managementunits_name",
              },
              create: true,
              update: true,
              filter: {
                validation: ["required"],
                type: "select",
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
            id: "target_area_filter",
            label: "Target Area",
            methods: {
              filter: {
                type: "select",
                getter: "GetTA_new",
                setter: "area_code",
                form_param: {
                  mu_no: "mu_no",
                },
                param: {
                  program_year: "current_program_year",
                },
                option: {
                  // getterKey: "data.result",
                  list_pointer: {
                    code: "area_code",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
            },
          },
          {
            id: "village_filter",
            label: "Desa",
            methods: {
              filter: {
                type: "select",
                getter: "GetDesa",
                setter: "kode_desa",
                form_param: {
                  kode_ta: "area_code",
                },
                param: {
                  program_year: "current_program_year",
                },
                option: {
                  getterKey: "data.result",
                  list_pointer: {
                    code: "kode_desa",
                    label: "name",
                    display: ["name"],
                  },
                },
              },
            },
          },
          {
            id: "total_farmer",
            label: "Total Peserta",
            methods: {
              list: false,
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },

          {
            id: "pic_id",
            label: "PIC",
            methods: {
              list: {
                view_data: "users_name_created_by",
              },
              detail: {
                view_data: "users_name_created_by",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "form_date",
            label: "Tanggal Sosialisasi",
            methods: {
              list: false,
              detail: {
                view_data: "form_date",
                transform: "date",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "program_year",
            label: "Tahun Program",
            methods: {
              list: {
                view_data: "program_year",
                class: "badge bg-primary",
              },
              detail: {
                view_data: "program_year",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "program_type",
            label: "Jenis Program",
            methods: {
              list: false,
              detail: {
                view_data: "program_type",
                transform: "program-type",
                class: "badge bg-success",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "pattern",
            label: "Pola Tanam Yg Sudah Ada",
            methods: {
              list: false,
              detail: {
                type: "slot",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "pattern_new",
            label: "Pola Tanam Yg Diinginkan",
            methods: {
              list: false,
              detail: {
                type: "slot",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "name_entry_data",
            label: "Nama Pengisi Form",
            methods: {
              list: false,
              detail: {
                view_data: "name_entry_data",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "is_program_year",
            label: "Pernah Ikut Program Tahun",
            methods: {
              list: false,
              detail: {
                view_data: "is_program_year",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "contact_person",
            label: "Nomor Kontak",
            methods: {
              list: false,
              detail: {
                view_data: "contact_person",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "age",
            label: "Umur",
            methods: {
              list: false,
              detail: {
                view_data: "age",
                append: "Tahun",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "people_status",
            label: "Perwakilan Dari",
            methods: {
              list: false,
              detail: {
                view_data: "people_status",
                transform: "people-status",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "group_name",
            label: "Nama Kelompok",
            methods: {
              list: false,
              detail: {
                view_data: "group_name",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "entry_data_position",
            label: "Jabatan / Posisi Pengisi Form",
            methods: {
              list: false,
              detail: {
                view_data: "entry_data_position",
                transform: "entry-data-position",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "position_name",
            label: "Nama Jabatan / Posisi",
            methods: {
              list: false,
              detail: {
                view_data: "position_name",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "total_minat",
            label: "Jumlah Peserta Yg Berminat",
            methods: {
              list: false,
              detail: {
                class: "badge bg-success",
                view_data: "total_minat",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "total_ragu",
            label: "Jumlah Peserta Yg Ragu-Ragu",
            methods: {
              list: false,
              detail: {
                class: "badge bg-warning",
                view_data: "total_ragu",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "lahan_legal_status",
            label: "Status Legalitas Lahan",
            methods: {
              list: false,
              detail: {
                type: "slot",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "lahan_legal_status_others",
            label: "Legalitas Lahan Lainnya",
            methods: {
              list: false,
              detail: {
                view_data: "lahan_legal_status_others",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "peserta_pemilik_people",
            label: "Jumlah Peserta Pemilik Lahan",
            methods: {
              list: false,
              detail: {
                view_data: "peserta_pemilik_people",
                transform: "no-empty",
                class: "badge bg-info",
                append: "peserta",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "peserta_pemilik_lahan",
            label: "Jumlah Lahan Pemilik Lahan",
            methods: {
              list: false,
              detail: {
                view_data: "peserta_pemilik_lahan",
                transform: "no-empty",
                class: "badge bg-info",
                append: "lahan",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "peserta_pemilik_luas_lahan",
            label: "Luas Lahan Pemilik Lahan",
            methods: {
              list: false,
              detail: {
                view_data: "peserta_pemilik_luas_lahan",
                transform: "no-empty",
                class: "badge bg-info",
                append: "m²",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "peserta_penggarap_people",
            label: "Jumlah Peserta Penggarap",
            methods: {
              list: false,
              detail: {
                view_data: "peserta_penggarap_people",
                transform: "no-empty",
                class: "badge bg-primary",
                append: "peserta",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "peserta_penggarap_lahan",
            label: "Jumlah Lahan Penggarap",
            methods: {
              list: false,
              detail: {
                view_data: "peserta_penggarap_lahan",
                transform: "no-empty",
                class: "badge bg-primary",
                append: "lahan",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "peserta_penggarap_luas_lahan",
            label: "Luas Lahan Penggarap",
            methods: {
              list: false,
              detail: {
                view_data: "peserta_penggarap_luas_lahan",
                transform: "no-empty",
                class: "badge bg-primary",
                append: "m²",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "peserta_lain_people",
            label: "Jumlah Peserta Lainnya",
            methods: {
              list: false,
              detail: {
                view_data: "peserta_penggarap_people",
                transform: "no-empty",
                class: "badge bg-warning",
                append: "peserta",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "peserta_lain_lahan",
            label: "Jumlah Lahan Lainnya",
            methods: {
              list: false,
              detail: {
                view_data: "peserta_lain_lahan",
                transform: "no-empty",
                class: "badge bg-warning",
                append: "lahan",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "peserta_lain_luas_lahan",
            label: "Luas Lahan Lainnya",
            methods: {
              list: false,
              detail: {
                view_data: "peserta_lain_luas_lahan",
                transform: "no-empty",
                class: "badge bg-warning",
                append: "m²",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "training_materials_material_name_training1",
            label: "Materi Pelatihan 1",
            methods: {
              list: false,
              detail: {
                view_data: "training_materials_material_name_training1",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "training_materials_material_name_training2",
            label: "Materi Pelatihan 2",
            methods: {
              list: false,
              detail: {
                view_data: "training_materials_material_name_training2",
                transform: "no-empty",
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "pic_manager_id",
            label: "PIC Manager",
            methods: {
              list: {
                show: false,
                view_data: "users_name_created_by",
                class: "min-w-100px",
              },
              detail: false,
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "suggestion",
            label: "Usulan Untuk T4T",
            methods: {
              list: false,
              detail: {
                view_data: "suggestion",
                transform: "no-empty"
              },
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "users_name_verified_by",
            label: "Verified By",
            methods: {
              list: {
                transform: "no-empty",
                view_data: "users_name_verified_by",
              },
              detail: true,
              create: true,
              update: true,
              filter: false,
            },
          },
          {
            id: "is_verify",
            label: "Status",
            methods: {
              list: {
                view_data: "is_verified",
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-success",
                },
                transform: "status-verification",
              },
              detail: {
                view_data: "is_verified",
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-success",
                },
                transform: "status-verification",
              },
              create: false,
              update: false,
              filter: {
                type: "select",
                setter: "is_verified",
                option: {
                  default_options: [
                    {
                      name: "Semua Status",
                      code: null,
                    },
                    {
                      name: "Belum Terverifikasi",
                      code: 0,
                    },
                    {
                      name: "Terverifikasi",
                      code: 1,
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

          {
            id: "action",
            label: "Action",
            methods: {
              list: false,
              detail: {
                type: "slot",
              },
              create: false,
              update: false,
              filter: false,
            },
          },
        ],
      },
    };
  },
};
</script>
