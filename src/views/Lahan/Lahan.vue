<template>
  <geko-base-crud
    :config="config"
    :hideCreate="true"
    :hideUpdate="true"
    :refreshKey="refreshKey"
    @onExportExcel="onExportExcel($event)"
  >
    <template v-slot:list-indicator="{ item }">
      <div class="indicator-wrapper pt-1">
        <div
          v-if="getProject(item) === 'carbon'"
          class="indicator"
          :class="{
            warning:
              getMaskedValue(item).approve == 0 &&
              getMaskedValue(item).updated_gis.toLowerCase() == 'belum',

            success:
              getMaskedValue(item).approve == 2 &&
              getMaskedValue(item).eligible_status == 2,

            info:
              (getMaskedValue(item).approve == 0 &&
                getMaskedValue(item).updated_gis.toLowerCase() == 'sudah') ||
              (getMaskedValue(item).approve == 2 &&
                getMaskedValue(item).eligible_status == 1),

            primary:
              getMaskedValue(item).approve == 1 &&
              getMaskedValue(item).fc_complete_data !== null,

            danger:
              getMaskedValue(item).approve == 3 ||
              (getMaskedValue(item).approve == 2 &&
                getMaskedValue(item).eligible_status == 0) ||
              (getMaskedValue(item).approve == 1 &&
                getMaskedValue(item).fc_complete_data == null),
          }"
        ></div>

        <div
          class="indicator"
          v-else-if="getProject(item) === 'non-carbon'"
          :class="{
            success: getMaskedValue(item).approve === 2,
            warning:
              getMaskedValue(item).approve === 0 &&
              getMaskedValue(item).fc_complete_data === null,
            primary:
              getMaskedValue(item).approve === 0 &&
              getMaskedValue(item).fc_complete_data !== null,
          }"
        ></div>
      </div>
    </template>

    <template v-slot:list-lahan_id="{ item }">
      <template>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-link text-1-em"
              >#{{ getMaskedValue(item).lahan_no }}</span
            >
          </template>

          <span>Kode Lahan</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-09-em d-block font-weight-500">{{
              getMaskedValue(item).document_no
            }}</span>
          </template>

          <span>Dokumen Lahan</span>
        </v-tooltip>
      </template>
    </template>

    <template v-slot:list-ff_id="{ item }">
      <template>
        <span class="d-block">{{
          getMaskedValue(item).field_facilitators_name
        }}</span>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              getMaskedValue(item).user_id
            }}</span>
          </template>

          <span>Kode FF</span>
        </v-tooltip>
      </template>
    </template>

    <template v-slot:list-farmer_id="{ item }">
      <div class="min-w-150px">
        <span class="d-block">{{ getMaskedValue(item).farmer_name }}</span>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              getMaskedValue(item).farmer_no
            }}</span>
          </template>

          <span>Kode Petani</span>
        </v-tooltip>
      </div>
    </template>

    <template v-slot:list-program_year="{ item }">
      <span class="d-block text-center">{{
        formatDate(getMaskedValue(item).created_time, "YYYY")
      }}</span>
    </template>

    <template v-slot:list-target_area="{ item }">
      <div class="d-flex flex-column">
        <span>{{ getMaskedValue(item).target_areas_name }}</span>

        <span class="text-link font-weight-300 text-09-em">
          MU {{ getMaskedValue(item).managementunits_name }}</span
        >
      </div>
    </template>

    <template v-slot:list-lahan_size="{ item }">
      <div class="d-flex flex-column">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <div class="d-flex flex-row align-items-center" v-on="on">
              <span class="d-block text-end font-weight-bold text-no-wrap">
                <v-icon medium>mdi-file-document-outline</v-icon>

                <span class="ml-1"
                  >{{
                    getMaskedValue(item).land_area | parse("ts")
                  }}m&sup2;</span
                >
              </span>
            </div>
          </template>

          <span>Luas lahan SPPT</span>
        </v-tooltip>

        <v-tooltip top v-if="getMaskedValue(item).gis_polygon_area">
          <template v-slot:activator="{ on }">
            <div class="d-flex flex-row align-items-center mt-1" v-on="on">
              <span class="d-block text-end font-weight-bold text-no-wrap">
                <v-icon medium>mdi-vector-polygon</v-icon>

                <span class="ml-1 text-link"
                  >{{
                    getMaskedValue(item).gis_polygon_area | parse("ts")
                  }}m&sup2;</span
                >
              </span>
            </div>
          </template>

          <span>Luas lahan polygon</span>
        </v-tooltip>
      </div>
    </template>

    <template v-slot:list-planting_area="{ item }">
      <div class="d-flex">
        <span class="font-weight-bold mr-2">
          {{ getMaskedValue(item).planting_area || 0 }}%
        </span>

        <span v-if="getMaskedValue(item).planting_area"
          >(~{{
            (getMaskedValue(item).planting_area / 100) *
            getMaskedValue(item).land_area
          }}m)</span
        >
      </div>
    </template>

    <template v-slot:list-cover="{ item }">
      <span class="d-block text-center"
        >{{ getMaskedValue(item).tutupan_lahan }}%</span
      >
    </template>

    <template v-slot:list-tree="{ item }">
      <div
        class="d-flex flex-row min-w-200px"
        v-if="Array.isArray(getMaskedValue(item).jenis_bibit)"
        style="flex-wrap: wrap"
      >
        <div
          class="badge bg-success text-no-wrap mr-1 mb-1"
          v-for="(tree, i) in getMaskedValue(item).jenis_bibit"
          :key="getMaskedValue(item).document_no + i"
        >
          <v-icon>mdi-tree-outline</v-icon>

          <span>{{ tree }}</span>
        </div>
      </div>
    </template>

    <template v-slot:list-total_wood="{ item }">
      <span
        class="d-block text-center"
        v-if="
          Array.isArray(getMaskedValue(item).total_from_detail) &&
          getMaskedValue(item).total_from_detail.length > 0
        "
      >
        {{
          getMaskedValue(item).total_from_detail[0].pohon_kayu_detail
            | parse("ts")
        }}
      </span>
    </template>

    <template v-slot:list-total_mpts="{ item }">
      <span
        class="d-block text-center"
        v-if="
          Array.isArray(getMaskedValue(item).total_from_detail) &&
          getMaskedValue(item).total_from_detail.length > 0
        "
      >
        {{
          getMaskedValue(item).total_from_detail[0].pohon_mpts_detail
            | parse("ts")
        }}
      </span>
    </template>

    <template v-slot:list-total="{ item }">
      <span
        class="font-weight-bold d-block text-center"
        v-if="
          Array.isArray(getMaskedValue(item).total_from_detail) &&
          getMaskedValue(item).total_from_detail.length > 0
        "
        >{{
          (getMaskedValue(item).total_from_detail[0].pohon_kayu_detail +
            getMaskedValue(item).total_from_detail[0].pohon_mpts_detail)
            | parse("ts")
        }}</span
      >
    </template>

    <template v-slot:list-status="{ item }">
      <div
        class="d-flex flex-row text-no-wrap justify-content-center"
        style="align-items: center"
      >
        <div
          v-if="getProject(item) === 'carbon'"
          class="badge"
          :class="{
            'bg-warning':
              getMaskedValue(item).approve == 0 &&
              getMaskedValue(item).updated_gis.toLowerCase() == 'belum',

            'bg-info':
              (getMaskedValue(item).approve == 0 &&
                getMaskedValue(item).updated_gis.toLowerCase() == 'sudah') ||
              (getMaskedValue(item).approve == 2 &&
                getMaskedValue(item).eligible_status == 1),

            'bg-primary': getMaskedValue(item).approve == 1,

            'bg-success': getMaskedValue(item).approve == 2,

            'bg-danger':
              getMaskedValue(item).approve == 3 ||
              (getMaskedValue(item).approve == 2 &&
                getMaskedValue(item).eligible_status == 0) ||
              (getMaskedValue(item).approve == 1 &&
                getMaskedValue(item).fc_complete_data == null),
          }"
        >
          <span
            v-if="
              getMaskedValue(item).approve == 1 &&
              getMaskedValue(item).fc_complete_data == null
            "
            >Data Bermasalah</span
          >

          <span
            v-else-if="
              getMaskedValue(item).approve == 0 &&
              getMaskedValue(item).updated_gis.toLowerCase() == 'belum'
            "
            >Belum Diverifikasi</span
          >

          <span
            v-else-if="
              getMaskedValue(item).approve == 0 &&
              getMaskedValue(item).updated_gis.toLowerCase() == 'sudah'
            "
            >Diverifikasi GIS</span
          >

          <span v-else-if="getMaskedValue(item).approve == 1"
            >Diverifikasi FC</span
          >

          <span v-else-if="getMaskedValue(item).approve == 2">
            <span v-if="getMaskedValue(item).eligible_status == 0"
              >Tidak Bisa Ikut</span
            >

            <span v-else-if="getMaskedValue(item).eligible_status == 1"
              >Bisa Ikut Dengan Kondisi</span
            >

            <span v-else-if="getMaskedValue(item).eligible_status == 2"
              >Bisa Ikut</span
            >
          </span>

          <span v-else-if="getMaskedValue(item).approve == 3"
            >Force Majeure</span
          >
        </div>

        <div v-else-if="getProject(item) === 'non-carbon'">
          <span
            class="badge"
            :class="{
              'bg-warning':
                getMaskedValue(item).approve === 0 &&
                getMaskedValue(item).fc_complete_data === null,
              'bg-primary':
                getMaskedValue(item).approve === 0 &&
                getMaskedValue(item).fc_complete_data !== null,
              'bg-success': getMaskedValue(item).approve === 2,
            }"
          >
            <span
              v-if="
                getMaskedValue(item).approve === 0 &&
                getMaskedValue(item).fc_complete_data === null
              "
              >Belum Diverifikasi</span
            >
            <span
              v-else-if="
                getMaskedValue(item).approve === 0 &&
                getMaskedValue(item).fc_complete_data !== null
              "
              >Data Lahan Terverifikasi</span
            >
            <span v-else-if="getMaskedValue(item).approve === 2"
              >Terverifikasi</span
            >
          </span>
        </div>
      </div>
    </template>

    <template v-slot:list-before-create>
      <lahan-export-modal :dataKey="exportModal" />
    </template>

    <template v-slot:list-fc_complete_data="{ item }">
      <div class="d-flex flex-row text-no-wrap justify-content-center">
        <span
          class="badge"
          :class="{
            'bg-success': getMaskedValue(item).fc_complete_data == 1,

            'bg-danger': getMaskedValue(item).fc_complete_data == 0,

            'bg-info': getMaskedValue(item).fc_complete_data == null,
          }"
        >
          <span v-if="getMaskedValue(item).fc_complete_data == 0"
            >Belum Lengkap</span
          >

          <span v-else-if="getMaskedValue(item).fc_complete_data == 1"
            >Lengkap</span
          >

          <span v-else>Menunggu Verifikasi FC</span>
        </span>
      </div>
    </template>

    <template v-slot:detail-row>
      <lahan-detail />
    </template>

    <template v-slot:list-after-filter>
      <div
        class="d-flex flex-row justify-content-start align-items-center pb-4"
      >
        <v-btn
          class="mr-3"
          variant="info"
          @click="
            $router.push({
              path: '/DaftarQRLahanRusak',
              query: {
                view: 'list',
              },
            })
          "
        >
          <v-icon small class="mr-2">mdi-qrcode-remove</v-icon>
          <span>Barcode Lahan Rusak</span>
        </v-btn>
        <v-btn
          class="mr-3"
          variant="success"
          @click="
            $router.push({
              path: '/PermintaanTutupanLahan',
              query: {
                view: 'list',
              },
            })
          "
        >
          <v-icon small class="mr-2">mdi-file-arrow-left-right-outline</v-icon>
          <span>Permintaan Pergantian Tutupan Lahan</span>
        </v-btn>

        <v-btn
          v-if="$_sys.isAllowed('lahan-kml-bulk-upload-create')"
          class="mr-2 d-flex flex-row align-items-center"
          variant="info"
          @click="uploadKmlModal = uploadKmlModal + 1"
        >
          <v-icon>mdi-shape-polygon-plus</v-icon>
          <span>Bulk Upload KML</span>
        </v-btn>

        <lahan-kml-upload :dataKey="uploadKmlModal" />
      </div>
    </template>
  </geko-base-crud>
</template>

<script>
import moment from "moment";
import "./lahan.scss";
import LahanDetail from "./LahanDetail.vue";
import LahanKmlUpload from "./LahanKmlUpload.vue";
import LahanExportModal from "./LahanExportModal.vue";
export default {
  name: "lahan-v2",

  components: {
    LahanDetail,
    LahanKmlUpload,
    LahanExportModal,
  },
  methods: {
    getProject(item) {
      try {
        return item.land_project.project_planting_purposes_code;
      } catch {
        return null;
      }
    },
    getMaskedValue(item) {
      if (!Array.isArray(item.log_lahans) || item.log_lahans.length === 0) {
        return item;
      }

      if (
        this.$store.state.tmpProgramYear !== this.$_config.programYear.model
      ) {
        return item;
      }

      if (
        !item.log_lahans.find(
          (x) => x.program_year === this.$store.state.tmpProgramYear
        )
      ) {
        return item;
      }

      try {
        return {
          ...item,
          ...item.log_lahans.find(
            (x) => x.program_year === this.$store.state.tmpProgramYear
          ),
        };
      } catch {
        return item;
      }
    },

    async joinNewProgram(item) {
      return;
      const confirmation = await this.$_alert.confirm(
        "Ikutkan Program 2024?",
        `Apakah anda yakin ingin mengikutkan lahan dengan Nomor Lahan ${item.lahan_no} di tahun program 2024?`,

        "Ya, Ikutkan",
        "Batal",
        false
      );
      if (!confirmation.isConfirmed) return;
      const updating = await this.$_api
        .post("UpdateReusableLahan_new", {
          lahan_no: item.lahan_no,
          program_year: this.$_config.programYear.model,
        })
        .then(() => true)
        .catch(() => false);

      if (!updating) return;
      this.$_alert.success(
        "Berhasil",
        "Lahan berhasil di ikutkan kembali di tahun program 2024",
        "center"
      );
      this.refreshKey += 1;
    },

    onExportExcel() {
      this.exportModal += 1;
    },
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    onVerification(data) {
      const confirmationMessage =
        data.approve === 1 ? "Unverifikasi Petani" : "Verifikasi Petani";
      const confirmationText =
        data.approve === 1
          ? "Apakah anda yakin ingin unverifikasi data petani?"
          : "Apakah anda yakin ingin verifikasi data petani?";
      const confirmationButton =
        data.approve === 1 ? "Ya, Delete" : "Ya, Verifikasi";
      const isDanger = data.approve === 1;

      this.$_alert
        .confirm(
          confirmationMessage,
          confirmationText,
          confirmationButton,
          "Batal",
          isDanger
        )
        .then((res) => {
          if (res.isConfirmed) {
            this.$_api
              .post("updateFarmerApproval", {
                current_id: this.$route.query.id,
              })
              .then(() => {
                const successMessage =
                  data.approve === 1
                    ? "Data petani berhasil di unverifikasi"
                    : "Data petani berhasil di verifikasi";
                this.$_alert.success(successMessage);
                this.componentKey += 1;
              });
          }
        });
    },
  },
  data() {
    return {
      refreshKey: 1,
      uploadKmlModal: 2,
      componentKey: 1,
      exportModal: 0,
      formatDate(date, format = "DD MMMM YYYY", dateFormat = "YYYY-MM-DD") {
        return moment(date, dateFormat).format(format);
      },
      config: {
        title: "Lahan",
        model_api: null,
        export: true,
        getter: "GetLahanAll_new",
        delete: "DeleteDataLahan_new",
        deleteKey: "lahan_no",
        delete_ext_payload: {
          delete_type: "hard_delete",
        },

        statistic: {
          statistic_key: "count",
          transform_key: {
            total_data: {
              label: "Total Lahan",
              icon: "mdi-land-fields",
              transform: "ts",
            },
            verified: {
              label: "Lahan Terverifikasi",
              icon: "mdi-check-circle",
              color: "success",
              transform: "ts",
            },
            unverified: {
              label: "Lahan Belum Terverifikasi",
              icon: "mdi-information",
              color: "warning",
              transform: "ts",
            },
          },
        },
        globalFilter: {
          program_year: {
            setter: "program_year",
          },
        },
        pk_field: null,
        permission: {
          create: "farmer-create",
          read: "farmer-list",
          update: "farmer-update",
          detail: "farmer-detail",
          lookup: "farmer-lookup",
          delete: "farmer-delete",
        },
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
            id: "lahan_id",
            label: "Lahan",
            methods: {
              list: {
                sticky: true,
                type: "row-slot",
              },
            },
          },
          {
            id: "lahan_size",
            label: "Luas Lahan",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },

          {
            id: "mu_id",
            label: "Management Unit",
            methods: {
              filter: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                getter: "GetManagementUnitAdmin",
                setter: "mu_no",
                main: true,
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
          // {
          //   id: "planting_area",
          //   label: "Luas Area Tanam",
          //   methods: {
          //     list: {
          //       type: "row-slot",
          //     },
          //   },
          // },
          {
            id: "ff_id",
            label: "Nama FF",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },
          {
            id: "farmer_id",
            label: "Nama Petani",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },
          // {
          //   id: "farmer_nik",
          //   label: "NIK Petani",
          //   methods: {
          //     list: true,
          //   },
          // },

          {
            id: "target_area",
            label: "Target Area",
            methods: {
              list: {
                type: "row-slot",
              },
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
                main: true,
                option: {
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
            id: "village",
            label: "Desa",
            methods: {
              list: {
                view_data: "desas_name",
              },
            },
          },
          {
            id: "program_year",
            label: "Tahun Bergabung",
            methods: {
              list: {
                header_class: "text-center",
                type: "row-slot",
              },
            },
          },
          {
            id: "planting_pattern",
            label: "Pola Tanam",
            methods: {
              list: {
                class: "min-w-150px",
                view_data: "opsi_pola_tanam",
              },
            },
          },
          {
            id: "cover",
            label: "Tutupan",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },
          {
            id: "tree",
            label: "Jenis Bibit",
            methods: {
              list: {
                show: false,
                type: "row-slot",
              },
            },
          },
          {
            id: "total_wood",
            label: "Kayu",
            methods: {
              list: {
                type: "row-slot",
                // view_data: "pohon_kayu",
                transform: "ts",
                class: "text-center d-block",
              },
            },
          },
          {
            id: "total_mpts",
            label: "MPTS",
            methods: {
              list: {
                view_data: "pohon_mpts",
                transform: "ts",
                class: "text-center d-block",
              },
            },
          },
          {
            id: "total",
            label: "Kayu + MPTS",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },

          {
            id: "fc_complete_data",
            label: "Kelengkapan Data",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },

          {
            id: "status",
            label: "Status",
            methods: {
              list: {
                header_class: "text-center",
                type: "row-slot",
              },
              detail: false,
              filter: {
                type: "select",
                main: true,
                setter: "approve",
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
                      name: "Diverifikasi FC",
                      code: 1,
                    },
                    {
                      name: "Terverifikasi",
                      code: 2,
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
            id: "updated_gis",
            label: "Verifikasi GIS",
            methods: {
              filter: {
                type: "select",
                main: true,
                setter: "updated_gis",
                option: {
                  default_options: [
                    {
                      name: "Semua Status",
                      code: null,
                    },
                    {
                      name: "Belum",
                      code: "belum",
                    },
                    {
                      name: "Sudah",
                      code: "Sudah",
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
          // {
          //   id: "fc_complete_data",
          //   label: "Kelengkapan Data",
          //   methods: {
          //     filter: {
          //       type: "select",
          //       main: true,
          //       setter: "fc_complete_data",
          //       option: {
          //         default_options: [
          //           {
          //             name: "Semua ",
          //             code: null,
          //           },
          //           {
          //             name: "Lengkap",
          //             code: 1,
          //           },
          //           {
          //             name: "Belum Lengkap",
          //             code: "0",
          //           },
          //         ],
          //         list_pointer: {
          //           code: "code",
          //           label: "name",
          //           display: ["name"],
          //         },
          //       },
          //     },
          //   },
          // },
          {
            id: "created_at",
            label: "Tgl. Dibuat",
            methods: {
              list: {
                header_class: "text-center",
                class: "text-no-wrap d-block text-center",
                transform: "datetime",
              },
            },
          },
        ],
      },
    };
  },
};
</script>
