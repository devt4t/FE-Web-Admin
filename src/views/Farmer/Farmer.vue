<template>
  <geko-base-crud
    :config="config"
    :hideCreate="true"
    :hideUpdate="true"
    :key="`component-farmer-${componentKey}`"
  >
    <template v-slot:list-action-detail="{ item }">
      <button
        class="geko-list-action-view"
        @click="
          $router.push({
            name: $route.name,
            query: {
              view: 'detail',
              id: item.id,
              farmer_no: item.farmer_no,
              program_year: $store.state.tmpProgramYear,
            },
          })
        "
      >
        <v-icon small>mdi-information-outline</v-icon>
      </button>
    </template>
    <template v-slot:list-join_year="{ item }">
      <div
        class="d-flex flex-row mt-1"
        style="justify-content: center; align-items: center"
      >
        <span
          class="mb-0"
          :class="{
            'badge bg-primary':
              formatDate(getMaskedValue(item).join_date, 'YYYY') == '2024',
            'badge bg-info':
              formatDate(getMaskedValue(item).join_date, 'YYYY') !== '2024',
          }"
          >{{ formatDate(getMaskedValue(item).join_date, "YYYY") }}</span
        >
      </div>
    </template>

    <template v-slot:list-total_lahan_outside="{ item }">
      <span
        class="d-block text-center font-weight-bold min-w-150px"
        v-if="
          getMaskedValue(item).farmer_working_area_amount[0].jumlah_working_area
        "
        >{{
          getMaskedValue(item).farmer_working_area_amount[0].jumlah_working_area
        }}
        Lahan</span
      >

      <span class="d-block text-center min-w-150px" v-else>Tidak ada</span>
    </template>
    <template v-slot:list-ff_id="{ item }">
      <div class="d-flex flex-column min-w-150px">
        <span class="font-weight-500">{{
          getMaskedValue(item).field_facilitators_name
        }}</span>
        <div class="d-flex flex-row">
          <span class="badge bg-light">{{ getMaskedValue(item).user_id }}</span>
        </div>
      </div>
    </template>

    <template v-slot:list-indicator="{ item }">
      <div class="indicator-wrapper pt-1">
        <div
          class="indicator"
          :class="{
            warning: getMaskedValue(item).approve == 0,
            success: getMaskedValue(item).approve == 1,
          }"
        ></div>
      </div>
    </template>

    <template v-slot:statistic-petani_data_belum_lengkap="{ item }">
      <span>{{
        getMaskedValue(item).petani_belum_lengkap | parse("no-null")
      }}</span>
    </template>

    <template v-slot:list-village="{ item }">
      <div class="d-flex flex-column">
        <p class="mb-0">{{ getMaskedValue(item).desas_name }}</p>
      </div>
    </template>

    <template v-slot:list-name="{ item }">
      <div class="d-flex flex-column min-w-150px">
        <v-tooltip
          top
          v-if="
            getMaskedValue(item).farmer_working_area_amount &&
            Array.isArray(getMaskedValue(item).farmer_working_area_amount) &&
            getMaskedValue(item).farmer_working_area_amount.length > 0 &&
            getMaskedValue(item).farmer_working_area_amount[0]
              .jumlah_working_area > 0
          "
        >
          <template v-slot:activator="{ on }">
            <span v-on="on" class="font-weight-bold"
              >{{ getMaskedValue(item).name }}
              <span class="text-danger">*</span></span
            >
          </template>
          <span
            >Petani memiliki
            {{
              getMaskedValue(item).farmer_working_area_amount[0]
                .jumlah_working_area
            }}
            lahan diluar area kerja</span
          >
        </v-tooltip>

        <span class="font-weight-bold" v-else>{{
          getMaskedValue(item).name
        }}</span>
        <div class="d-flex flex-row">
          <span class="badge bg-light font-weight-300">{{
            getMaskedValue(item).farmer_no
          }}</span>
        </div>
      </div>
    </template>

    <template v-slot:list-target_area="{ item }">
      <div class="d-flex flex-column">
        <p class="mb-0">{{ getMaskedValue(item).target_areas_name }}</p>
        <span class="text-link text-08-em"
          >MU {{ getMaskedValue(item).managementunits_name }}</span
        >
      </div>
    </template>

    <template v-slot:list-status="{ item }">
      <div class="d-flex flex-row">
        <span
          class="badge"
          :class="{
            'badge bg-warning text-no-wrap': getMaskedValue(item).approve == 0,
            'badge bg-success text-no-wrap': getMaskedValue(item).approve == 1,
            // 'badge bg-danger text-no-wrap':
            //   getMaskedValue(item).farmer_working_area_amount[0].jumlah_working_area == 0,
          }"
        >
          <span v-if="getMaskedValue(item).approve == 0"
            >Belum Diverifikasi</span
          >
          <span v-else-if="getMaskedValue(item).approve == 1"
            >Terverifikasi</span
          >
        </span>
      </div>
    </template>

    <!-- <template v-slot:detail-header-action="{ item, response }">
      <div>
        {{ JSON.stringify(response) }}
      </div>
    </template> -->

    <template v-slot:detail-legal_land_categories="{ item }">
      <span
        :class="{
          'badge bg-primary font-weight-500': ![
            '',
            null,
            undefined,
            '-',
          ].includes(item.legal_land_categories),
        }"
        >{{ item.legal_land_categories }}</span
      >
    </template>

    <template v-slot:detail-row-detail_program_year="{ item, response }">
      <div class="geko-base-detail-item">
        <div class="label">
          <p class="mb-0 pb-0">Tahun Program</p>
        </div>
        <div class="value">
          <p class="mb-0 pb-0">
            <span
              class="badge bg-primary"
              v-for="(f, i) in response?.DetailFarmerPivot"
              :key="'farmer-detail-year' + i"
              >{{ f.program_year }}</span
            >
          </p>
        </div>
      </div>
    </template>

    <template v-slot:detail-project_model="{ item }">
      <span v-if="!item || item == '-' || item == 0">-</span>
      <span v-else>
        <span v-if="item.project_model == 1"
          ><strong>Model 1</strong> (100% Kayu)</span
        >
        <span v-else-if="item.project_model == 2"
          ><strong>Model 2</strong> (60% Kayu & 40% MPTS)</span
        >
        <span v-else-if="item.project_model == 3"
          ><strong>Model 3</strong> (40% Kayu & 60% MPTS)</span
        >
      </span>
    </template>

    <template v-slot:detail-farmer_id="{ item }">
      <div class="d-flex flex-column">
        <span
          >{{ item.name }}
          <span v-if="item.nickname">({{ item.nickname }})</span></span
        >
        <div class="d-flex flex-row mt-1">
          <span class="badge bg-primary">NIK {{ item.ktp_no }}</span>
          <span class="ml-2 badge bg-light">{{ item.farmer_no }}</span>
        </div>
      </div>
    </template>

    <template v-slot:detail-address="{ item }">
      <span class="text-capitalize">
        <span> {{ item.address }}</span>
        <span v-if="item.rw"> RT {{ item.rt }}</span>
        <span v-if="item.rw"> RW {{ item.rw }}</span>
        <span v-if="item.desas_name"
          >, Desa {{ item.desas_name.toLowerCase() }}</span
        >
        <span v-if="item.kecamatans_name"
          >, Kec. {{ item.kecamatans_name.toLowerCase() }}</span
        >
        <span v-if="item.kabupatens_name"
          >, {{ item.kabupatens_name.toLowerCase() }}</span
        >
        <span v-if="item.provinces_name"
          >, {{ item.provinces_name.toLowerCase() }}</span
        >
        <span v-if="item.post_code">, {{ item.post_code }}</span>
      </span>
    </template>

    <template v-slot:detail-body-after="{ item, response }">
      <div>
        <div class="geko-base-detail-item">
          <div class="label">Jenis Bibit</div>
          <div class="value">
            <div class="d-flex flex-row">
              <div
                class="badge bg-success mr-2"
                v-for="(tree, i) in response ? response.DetailFarmerTree : []"
                :key="`farmer-${i}`"
              >
                <v-icon class="mr-1">mdi-tree</v-icon>
                <span>{{ tree.trees_tree_name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-5 d-flex flex-row"
          style="justify-content: space-between"
        >
          <div class="d-flex flex-column farmer-detail-photo">
            <h6>Foto KTP</h6>
            <div
              class="img cover"
              v-bind:style="{
                'background-image':
                  'url(' +
                  `${$_config.baseUrlUpload}/${response?.DetailFarmerMain.ktp_document}` +
                  ')',
              }"
              @click="
                showLightbox(
                  `${$_config.baseUrlUpload}/${response?.DetailFarmerMain.ktp_document}`
                )
              "
            ></div>
          </div>
          <div class="d-flex flex-column farmer-detail-photo">
            <h6>Profile Petani</h6>
            <div
              class="img cover"
              v-bind:style="{
                'background-image':
                  'url(' +
                  `${$_config.baseUrlUpload}/${response?.DetailFarmerMain.farmer_profile}` +
                  ')',
              }"
              @click="
                showLightbox(
                  `${$_config.baseUrlUpload}/${response?.DetailFarmerMain.farmer_profile}`
                )
              "
            ></div>
          </div>
          <div class="d-flex flex-column farmer-detail-photo">
            <h6>Tanda Tangan</h6>
            <div
              class="img"
              v-bind:style="{
                'background-image':
                  'url(' +
                  `${$_config.baseUrlUpload}/${response?.DetailFarmerMain.signature}` +
                  ')',
              }"
              @click="
                showLightbox(
                  `${$_config.baseUrlUpload}/${response?.DetailFarmerMain.signature}`
                )
              "
            ></div>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:detail-complete_data="{ item }">
      <div class="d-flex flex-row">
        <div
          class="badge"
          :class="{
            'bg-success': item.complete_data == 1,
            'bg-danger': item.complete_data == 0,
          }"
        >
          {{ item.complete_data == 1 ? "Lengkap" : "Belum Lengkap" }}
        </div>
      </div>
    </template>

    <template v-slot:detail-approve="{ item }">
      <div class="d-flex flex-row">
        <div
          class="badge"
          :class="{
            'bg-success': item.approve == 1,
            'bg-danger': item.approve == 0,
          }"
        >
          {{ item.approve == 1 ? "Terverifikasi" : "Belum Diverifikasi" }}
        </div>
      </div>
    </template>

    <template v-slot:detail-header-action="{ item, response }">
      <div>
        <farmer-assign-modal
          :data="response?.DetailFarmerPivot"
          :dataKey="farmerAssignModal"
          @success="componentKey += 1"
        />
        <v-btn variant="info" class="mr-2" @click="farmerAssignModal += 1"
          ><v-icon small class="mr-1">mdi-account-convert-outline</v-icon>
          <span>Assign Program Year</span>
        </v-btn>
        <v-btn
          variant="success"
          @click="onVerification(item)"
          v-if="
            item.approve == 0 && $_sys.isAllowed('farmer-verification-create')
          "
        >
          <v-icon small class="mr-1">mdi-check</v-icon>
          <span>Verifikasi</span>
        </v-btn>
        <v-btn
          variant="success"
          @click="onVerification(item)"
          v-if="
            item.approve == 1 && $_sys.isAllowed('farmer-verification-create')
          "
        >
          <v-icon small class="mr-1">mdi-check</v-icon>
          <span>Verifikasi</span>
        </v-btn>
        <v-btn
          variant="danger"
          v-else-if="
            item.approve == 1 && $_sys.isAllowed('farmer-unverification-create')
          "
          @click="onVerification(item)"
        >
          <v-icon small class="mr-1">mdi-close</v-icon
          ><span>Unverifikasi</span></v-btn
        >
      </div>
    </template>

    <template v-slot:detail-row>
      <farmer-detail />
    </template>
  </geko-base-crud>
</template>

<script>
import moment from "moment";
import "./farmer.scss";
import FarmerAssignModal from "./FarmerAssignModal.vue";
import FarmerDetail from "./FarmerDetail.vue";
export default {
  name: "farmer-v2",
  components: {
    FarmerAssignModal,
    FarmerDetail,
  },
  methods: {
    getMaskedValue(item) {
      if (!Array.isArray(item.log_farmers) || item.log_farmers.length === 0) {
        return item;
      }

      const logData = item.log_farmers.find((x) =>
        x.program_year.includes(this.$store.state.tmpProgramYear)
      );

      return logData ? logData : item;
    },

    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    onVerification(data) {
      const isApproved = data.approve === 1;
      const action = isApproved ? "Unverifikasi" : "Verifikasi";

      const confirmationMessage = isApproved
        ? "Apakah anda yakin ingin unverifikasi data petani?"
        : "Apakah anda yakin ingin verifikasi data petani?";
      const successMessage = isApproved
        ? "Data petani berhasil di unverifikasi"
        : "Data petani berhasil di verifikasi";

      this.$_alert
        .confirm(
          action + " Petani",
          confirmationMessage,
          "Ya, " + action,
          "Batal",
          isApproved
        )
        .then((res) => {
          if (res.isConfirmed) {
            this.$_api
              .post("updateFarmerApproval", {
                current_id: this.$route.query.id,
              })
              .then(() => {
                this.componentKey += 1;
                this.$_alert.success(successMessage);
              });
          }
        });
    },
  },
  data() {
    return {
      farmerAssignModal: 0,
      componentKey: 1,
      formatDate(date, format = "DD MMMM YYYY", dateFormat = "YYYY-MM-DD") {
        return moment(date, dateFormat).format(format);
      },
      config: {
        title: "Petani",
        model_api: null,
        getter: "GetFarmerAllAdmin_new",

        // getterDataKey: "data.result.data",
        detail: "GetDetailFarmer_new",
        detailIdKey: "farmer_no",
        detailKey: "data.DetailFarmerMain",
        setter: "AddFormMinatFarmers_new",
        setter_redirect: "back",
        update: "UpdateFormMinatMain_new",
        delete: "DeleteFarmerData_new",
        deleteLabel: "farmer_no",
        deleteKey: "farmer_no",
        delete_ext_payload: {
          delete_type: "soft_delete",
        },
        filter_api: {
          typegetdata: "all",
        },

        statistic: {
          statistic_key: "count",
          transform_key: {
            total_data: {
              label: "Total Petani",
              icon: "mdi-account",
              transform: "ts",
            },
            verified: {
              label: "Petani Terverifikasi",
              icon: "mdi-account-check",
              color: "success",
              transform: "ts",
            },
            unverified: {
              label: "Petani Belum Terverifikasi",
              icon: "mdi-account-alert",
              color: "warning",
              transform: "ts",
            },
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
            id: "farmer_id",
            label: "Nama Petani",
            methods: {
              list: {
                view_data: "name",
                class: "font-weight-500",
                type: "row-slot",
              },
              detail: {
                view_data: "name",
              },
              create: { validation: ["required"] },
              update: { validation: ["required"], setter: "new_name" },
              filter: false,
            },
          },
          {
            id: "detail_farmer_no",
            label: "Kode Petani",
            methods: {
              detail: {
                view_data: "farmer_no",
              },
            },
          },
          {
            id: "detail_program_year",
            label: "Tahun Program",
            methods: {
              detail: {
                type: "row-slot",
              },
            },
          },
          {
            id: "approve",
            label: "Status",
            methods: {
              detail: {
                type: "slot",
              },
            },
          },
          {
            id: "complete_data",
            label: "Kelengkapan Data",
            methods: {
              detail: {
                type: "slot",
              },
            },
          },
          {
            id: "birth_date",
            label: "Tanggal Lahir",
            methods: {
              detail: {
                view_data: "birthday",
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
            },
          },
          {
            id: "religion",
            label: "Agama",
            methods: {
              detail: {
                class: "text-capitalize",
              },
            },
          },
          {
            id: "managementunits_name",
            label: "Management Unit",
            methods: {
              detail: true,
            },
          },
          {
            id: "target_areas_name",
            label: "Target Area",
            methods: {
              detail: true,
            },
          },
          {
            id: "address",
            label: "Alamat",
            methods: {
              detail: {
                type: "slot",
              },
            },
          },
          {
            id: "phone",
            label: "No. HP",
            methods: {
              detail: true,
            },
          },
          {
            id: "ethnic",
            label: "Suku",
            methods: {
              detail: true,
            },
          },
          {
            id: "origin",
            label: "Asal Usul",
            methods: {
              detail: true,
            },
          },
          {
            id: "number_family_member",
            label: "Jumlah Keluarga",
            methods: {
              detail: true,
            },
          },
          {
            id: "marrital_status",
            label: "Status Perkawinan",
            methods: {
              detail: true,
            },
          },
          {
            id: "education",
            label: "Pendidikan Terakhir",
            methods: {
              detail: true,
            },
          },
          {
            id: "non_formal_education",
            label: "Pendidikan Non-Formal",
            methods: {
              detail: true,
            },
          },
          {
            id: "main_job",
            label: "Pekerjaan Utama",
            methods: {
              detail: true,
            },
          },
          {
            id: "main_income",
            label: "Penghasilan Utama",
            methods: {
              detail: {
                transform: "idr",
              },
            },
          },
          {
            id: "side_job",
            label: "Pekerjaan Sampingan",
            methods: {
              detail: true,
            },
          },
          {
            id: "side_income",
            label: "Penghasilan Sampingan",
            methods: {
              detail: {
                transform: "idr",
              },
            },
          },
          {
            id: "join_date",
            label: "Tanggal Bergabung",
            methods: {
              detail: true,
            },
          },
          {
            id: "group_no",
            label: "Kelompok Tani",
            methods: {
              detail: true,
            },
          },
          {
            id: "mou_no",
            label: "No. MOU",
            methods: {
              detail: {
                class: "badge bg-light",
              },
            },
          },
          {
            id: "project_model",
            label: "Model Project",
            methods: {
              detail: {
                type: "slot",
              },
            },
          },
          {
            id: "legal_land_categories",
            label: "Kategori Legalitas Lahan",
            methods: {
              detail: {
                type: "slot",
              },
            },
          },
          {
            id: "ff_id",
            label: "Nama FF",
            methods: {
              list: {
                // view_data: "field_facilitators_name",
                type: "row-slot",
                // class: "min-w-150px",
              },
              detail: false,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "village",
            label: "Desa",
            methods: {
              list: {
                // view_data: "desa",
                type: "row-slot",
              },
              detail: false,
              create: false,
              update: false,
              filter: false,
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

          {
            id: "target_area",
            label: "Target Area",
            methods: {
              list: {
                type: "row-slot",
              },
              filter: {
                main: true,
                type: "select",
                getter: "GetTargetAreaAdmin",
                setter: "area_code",
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
            id: "nik",
            label: "NIK",
            methods: {
              list: {
                view_data: "ktp_no",
              },
              detail: false,
              filter: false,
            },
          },
          // {
          //   id: "total_lahan_outside",
          //   label: "Jumlah Lahan Diluar Area Kerja",
          //   methods: {
          //     list: {
          //       header_class: "text-center",
          //       type: "row-slot",
          //     },
          //   },
          // },

          {
            id: "program_year",
            label: "Tahun Program",
            methods: {
              list: {
                show: false,
                class: "badge bg-primary",
              },
              detail: false,
              filter: false,
            },
          },

          {
            id: "join_year",
            label: "Tahun Bergabung",
            methods: {
              list: {
                header_class: "text-center",
                type: "row-slot",
                class: "badge bg-primary",
              },
              detail: false,
              filter: false,
            },
          },

          {
            id: "status",
            label: "Status",
            methods: {
              list: {
                header_class: "text-center",
                type: "row-slot",
                // class: {
                //   1: "badge bg-success text-no-wrap",
                //   0: "badge bg-warning text-no-wrap",
                // },
                // transform: "status-verification",
                // view_data: "approve",
              },
              detail: false,
              filter: {
                type: "select",
                setter: "approve",
                icon: "list-status",
                main: true,
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
                      name: "Belum Diverifikasi",
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
            label: "Tgl Dibuat",
            methods: {
              list: {
                transform: "datetime",
                class: "min-w-150px",
              },
            },
          },
        ],
      },
    };
  },
};
</script>
