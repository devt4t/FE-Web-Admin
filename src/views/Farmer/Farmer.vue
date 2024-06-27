<template>
  <geko-base-crud
    :config="config"
    :hideCreate="true"
    :hideDelete="!['13'].includes($store.state.User.role)"
    :hideUpdate="true"
  >
    <template v-slot:list-join_year="{ item }">
      <div
        class="d-flex flex row mt-1"
        style="justify-content: center; align-items: center"
      >
        <span class="mb-0 badge bg-light">{{
          formatDate(item.join_date, "YYYY")
        }}</span>
      </div>
    </template>

    <template v-slot:list-indicator="{ item }">
      <div class="indicator-wrapper pt-1">
        <div
          class="indicator"
          :class="{
            warning: item.approve == 0,
            success: item.approve == 1,
          }"
        ></div>
      </div>
    </template>

    <template v-slot:statistic-petani_data_belum_lengkap="{ item }">
      <span>{{ item.petani_belum_lengkap | parse("no-null") }}</span>
    </template>

    <template v-slot:list-village="{ item }">
      <div class="d-flex flex-column">
        <p class="mb-0">{{ item.desas_name }}</p>
      </div>
    </template>

    <template v-slot:list-target_area="{ item }">
      <div class="d-flex flex-column">
        <p class="mb-0">{{ item.target_areas_name }}</p>
        <span class="text-link text-08-em"
          >MU {{ item.managementunits_name }}</span
        >
      </div>
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
      <span>
        <span> {{ item.address }}</span>
        <span v-if="item.rw"> RT {{ item.rt }}</span>
        <span v-if="item.rw"> RW {{ item.rw }}</span>
        <span v-if="item.desas_name">, Desa {{ item.desas_name }}</span>
        <span v-if="item.kecamatans_name"
          >, Kec. {{ item.kecamatans_name }}</span
        >
        <span v-if="item.kabupatens_name">, {{ item.kabupatens_name }}</span>
        <span v-if="item.provinces_name">, {{ item.provinces_name }}</span>
        <span v-if="item.post_code">, {{ item.post_code }}</span>
      </span>
    </template>

    <template v-slot:detail-body-after="{ item, response }">
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
    </template>

    <!-- <template v-slot:detail-header-action="{ item, response }">
      <v-btn
        variant="success"
        v-if="
          item.approve == 0 &&
          ['13', '19', '20'].includes($store.state.User.role)
        "
      >
        <v-icon small>mdi-check</v-icon>
        <span>Verifikasi</span>
      </v-btn>
      <v-btn
        variant="danger"
        v-else-if="
          item.approve == 1 && ['13', '20'].includes($store.state.User.role)
        "
        @click="onVerification(item)"
      >
        <v-icon small>mdi-close</v-icon><span>Unverifikasi</span></v-btn
      >
    </template> -->
  </geko-base-crud>
</template>

<script>
import moment from "moment";
export default {
  name: "farmer-v2",

  methods: {
    onVerification(data) {
      if (item.approve == 1) {
      }
    },
  },
  data() {
    return {
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
        delete: "DeleteScoopingVisit_new",
        deleteLabel: "scooping_no",
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
          show: "farmer-show",
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
              },
              detail: {
                type: "slot",
              },
              create: { validation: ["required"] },
              update: { validation: ["required"], setter: "new_name" },
              filter: false,
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
            id: "ff_id",
            label: "Nama FF",
            methods: {
              list: {
                view_data: "field_facilitators_name",
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
                class: {
                  1: "badge bg-success text-no-wrap",
                  0: "badge bg-warning text-no-wrap",
                },
                transform: "status-verification",
                view_data: "approve",
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
        ],
      },
    };
  },
};
</script>
