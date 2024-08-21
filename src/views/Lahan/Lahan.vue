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
          class="indicator"
          :class="{
            warning:
              item.approve == 0 && item.updated_gis.toLowerCase() == 'belum',
            success: item.approve == 2 && item.eligible_status == 2,
            info:
              (item.approve == 0 &&
                item.updated_gis.toLowerCase() == 'sudah') ||
              (item.approve == 2 && item.eligible_status == 1),
            primary: item.approve == 1 && item.fc_complete_data !== null,
            danger:
              item.approve == 3 ||
              (item.approve == 2 && item.eligible_status == 0) ||
              (item.approve == 1 && item.fc_complete_data == null),
          }"
        ></div>
      </div>
    </template>

    <template v-slot:list-lahan_id="{ item }">
      <template>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-link text-1-em"
              >#{{ item.lahan_no }}</span
            >
          </template>
          <span>Kode Lahan</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-09-em d-block font-weight-500">{{
              item.document_no
            }}</span>
          </template>
          <span>Dokumen Lahan</span>
        </v-tooltip>
      </template>
    </template>

    <template v-slot:list-ff_id="{ item }">
      <template>
        <span class="d-block">{{ item.field_facilitators_name }}</span>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              item.user_id
            }}</span>
          </template>
          <span>Kode FF</span>
        </v-tooltip>
      </template>
    </template>

    <template v-slot:list-farmer_id="{ item }">
      <div class="min-w-150px">
        <span class="d-block">{{ item.farmer_name }}</span>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              item.farmer_no
            }}</span>
          </template>
          <span>Kode Petani</span>
        </v-tooltip>
      </div>
    </template>

    <template v-slot:list-program_year="{ item }">
      <span class="d-block text-center">{{
        formatDate(item.created_time, "YYYY")
      }}</span>
    </template>

    <template v-slot:list-target_area="{ item }">
      <div class="d-flex flex-column">
        <span>{{ item.target_areas_name }}</span>
        <span class="text-link font-weight-300 text-09-em">
          MU {{ item.managementunits_name }}</span
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
                  >{{ item.land_area | parse("ts") }}m&sup2;</span
                >
              </span>
            </div>
          </template>
          <span>Luas lahan SPPT</span>
        </v-tooltip>

        <v-tooltip top v-if="item.gis_polygon_area">
          <template v-slot:activator="{ on }">
            <div class="d-flex flex-row align-items-center mt-1" v-on="on">
              <span class="d-block text-end font-weight-bold text-no-wrap">
                <v-icon medium>mdi-vector-polygon</v-icon>
                <span class="ml-1 text-link"
                  >{{ item.gis_polygon_area | parse("ts") }}m&sup2;</span
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
          {{ item.planting_area || 0 }}%
        </span>
        <span v-if="item.planting_area"
          >(~{{ (item.planting_area / 100) * item.land_area }}m)</span
        >
      </div>
    </template>

    <template v-slot:list-cover="{ item }">
      <span class="d-block text-center">{{ item.tutupan_lahan }}%</span>
    </template>

    <template v-slot:list-tree="{ item }">
      <div
        class="d-flex flex-row min-w-200px"
        v-if="Array.isArray(item.jenis_bibit)"
        style="flex-wrap: wrap"
      >
        <div
          class="badge bg-success text-no-wrap mr-1 mb-1"
          v-for="(tree, i) in item.jenis_bibit"
          :key="item.document_no + i"
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
          Array.isArray(item.total_from_detail) &&
          item.total_from_detail.length > 0
        "
      >
        {{ item.total_from_detail[0].pohon_kayu_detail | parse("ts") }}
      </span>
    </template>

    <template v-slot:list-total_mpts="{ item }">
      <span
        class="d-block text-center"
        v-if="
          Array.isArray(item.total_from_detail) &&
          item.total_from_detail.length > 0
        "
      >
        {{ item.total_from_detail[0].pohon_mpts_detail | parse("ts") }}
      </span>
    </template>

    <template v-slot:list-total="{ item }">
      <span
        class="font-weight-bold d-block text-center"
        v-if="
          Array.isArray(item.total_from_detail) &&
          item.total_from_detail.length > 0
        "
        >{{
          (item.total_from_detail[0].pohon_kayu_detail +
            item.total_from_detail[0].pohon_mpts_detail)
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
          class="badge"
          :class="{
            'bg-warning':
              item.approve == 0 && item.updated_gis.toLowerCase() == 'belum',
            'bg-info':
              (item.approve == 0 &&
                item.updated_gis.toLowerCase() == 'sudah') ||
              (item.approve == 2 && item.eligible_status == 1),
            'bg-primary': item.approve == 1,
            'bg-success': item.approve == 2,
            'bg-danger':
              item.approve == 3 ||
              (item.approve == 2 && item.eligible_status == 0) ||
              (item.approve == 1 && item.fc_complete_data == null),
          }"
        >
          <span v-if="item.approve == 1 && item.fc_complete_data == null"
            >Data Bermasalah</span
          >
          <span
            v-else-if="
              item.approve == 0 && item.updated_gis.toLowerCase() == 'belum'
            "
            >Belum Diverifikasi</span
          >
          <span
            v-else-if="
              item.approve == 0 && item.updated_gis.toLowerCase() == 'sudah'
            "
            >Diverifikasi GIS</span
          >
          <span v-else-if="item.approve == 1">Diverifikasi FC</span>
          <span v-else-if="item.approve == 2">
            <span v-if="item.eligible_status == 0">Tidak Bisa Ikut</span>
            <span v-else-if="item.eligible_status == 1"
              >Bisa Ikut Dengan Kondisi</span
            >
            <span v-else-if="item.eligible_status == 2">Bisa Ikut</span>
          </span>
          <span v-else-if="item.approve == 3">Force Majeure</span>
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
            'bg-success': item.fc_complete_data == 1,
            'bg-danger': item.fc_complete_data == 0,
            'bg-info': item.fc_complete_data == null,
          }"
        >
          <span v-if="item.fc_complete_data == 0">Belum Lengkap</span>
          <span v-else-if="item.fc_complete_data == 1">Lengkap</span>
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

        <!-- <v-btn variant="danger" class="mt-2">
          <v-icon>
            mdi-information
          </v-icon>
          Tandai Semua Polygon Lahan Salah
        </v-btn> -->
      </div>
    </template>

    <!-- <template v-slot:list-bottom-action="{ item }">
      <div class="buttons mt-2">
        <v-btn
          variant="warning"
          v-if="
            $store.state.tmpProgramYear == '2023' &&
            $_sys.isAllowed('lahan-update')
          "
          @click="joinNewProgram(item)"
        >
          <v-icon>mdi-bookmark-check</v-icon>
          <span class="text-09-em">Ikutkan Program 2024</span>
        </v-btn>
      </div>
    </template> -->
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

    onExportExcel(data) {
      // console.log("data", data);
      this.exportModal += 1;
    },
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    onVerification(data) {
      if (data.approve == 1) {
        this.$_alert
          .confirm(
            "Unverifikasi Petani",
            "Apakah anda yakin ingin unverifikasi data petani?",
            "Ya, Delete",
            "Batal",
            true
          )
          .then((res) => {
            if (res.isConfirmed) {
              //unverif
              this.$_api
                .post("updateFarmerApproval", {
                  current_id: this.$route.query.id,
                })
                .then(() => {
                  this.$_alert.success("Data petani berhasil di unverifikasi");
                  this.componentKey += 1;
                });
            }
          });
      } else {
        this.$_alert
          .confirm(
            "Verifikasi Petani",
            "Apakah anda yakin ingin verifikasi data petani?",
            "Ya, Verifikasi",
            "Batal",
            false
          )
          .then((res) => {
            if (res.isConfirmed) {
              //verif
              this.$_api
                .post("updateFarmerApproval", {
                  current_id: this.$route.query.id,
                })
                .then(() => {
                  this.componentKey += 1;
                  this.$_alert.success("Data petani berhasil di verifikasi");
                });
            }
          });
      }
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

        // getterDataKey: "lahan.data",
        // detail: "GetDetailFarmer_new",
        // detailIdKey: "farmer_no",
        // detailKey: "data.DetailFarmerMain",
        // setter: "AddFormMinatFarmers_new",
        // setter_redirect: "back",
        // update: "UpdateFormMinatMain_new",
        delete: "DeleteDataLahan_new",
        deleteKey: "lahan_no",
        delete_ext_payload: {
          delete_type: "hard_delete",
        },
        // deleteLabel: "scooping_no",
        // filter_api: {
        //   typegetdata: "all",
        //   page: 1,
        //   per_page: 10,
        //   update_mode: 0,
        // },

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
            // belum_lengkap: {
            //   label: "Lahan Belum Lengkap",
            //   icon: "mdi-information-off",
            //   color: "danger",
            //   transform: "ts",
            // },
            // belum_ada: {
            //   label: "Lahan Belum Ada Petani",
            //   icon: "mdi-google-downasaur",
            //   color: "info",
            //   transform: "ts",
            // },
            // petani_data_belum_lengkap: {
            //   label: "Petani Data Belum lengkap",
            //   icon: "mdi-account-remove",
            //   color: "danger",
            //   transform: "ts",
            //   type: "slot",
            //   pointer: ["count", "petani_sudah_verif", "petani_belum_lengkap"],
            // },
          },
        },
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
                getter: "GetTargetAreaAdmin",
                setter: "area_code",
                main: true,
                option: {
                  getterKey: "data.result",
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
                setter: "approve",
                option: {
                  default_options: [
                    {
                      name: "Semua Status",
                      code: null,
                    },
                    {
                      name: "Terverifikasi",
                      code: 1,
                    },
                    {
                      name: "Belum Terverifikasi",
                      code: 0,
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
