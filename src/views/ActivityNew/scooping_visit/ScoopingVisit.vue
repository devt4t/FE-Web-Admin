<template>
  <geko-base-crud
    :config="config"
    :key="'scooping-visit-' + componentKey"
    :hideDelete="$store.state.User.role != 13"
  >
    <template v-slot:create-form>
      <scooping-visit-form />
    </template>

    <template v-slot:list-projects="{ item }">
      <div class="scooping-project-wrapper min-w-200px">
        <div
          v-if="item.project_data && item.project_data !== 'No Project Found'"
        >
          <ol
            class="ml-0 pl-0"
            :style="{
              'list-style-type':
                item.project_data.split(',').length > 1 ? 'auto' : 'none',
            }"
          >
            <li class="mb-0" v-for="data in item.project_data.split(',')">
              {{ data.split(";").length > 1 ? data.split(";")[1] : "-" }}
            </li>
          </ol>
        </div>

        <div v-else>
          <span class="text-italic text-grey">Project belum ditambahkan</span>
        </div>
      </div>
    </template>

    <template v-slot:list-action-update="{ item }">
      <button
        v-if="
          item.status == 'document_saving' ||
          item.is_verify == 0 ||
          item.project_data == 'No Project Found'
        "
        class="geko-list-action-update"
        @click="
          $router.push({
            query: {
              view: 'update',
              id: item.id,
            },

            params: item,
          })
        "
      >
        <v-icon small>mdi-pencil-minus</v-icon>
      </button>
      <div v-else></div>
    </template>

    <template v-slot:list-village_area="{ item }">
      <div class="min-w-70px text-right">
        <span>{{ parseInt(item.land_area) }} Ha</span>
      </div>
    </template>

    <template v-slot:list-data_no="{ item }">
      <div class="d-flex flex-column indicator-left">
        <p class="mb-0o text-link">#{{ item.data_no }}</p>
        <div class="min-w-150px text-09-em">
          <span v-if="item.start_scooping_date">{{
            item.start_scooping_date | parse("date")
          }}</span>
          <span v-if="item.start_scooping_date && item.end_scooping_date">
            -
          </span>
          <span v-if="item.end_scooping_date">{{
            item.end_scooping_date | parse("date")
          }}</span>
        </div>
      </div>
    </template>

    <template v-slot:list-potential_dusun="{ item }">
      <div class="text-no-wrap">{{ item.potential_dusun }} dusun</div>
    </template>

    <template v-slot:list-project="{ item }">
      <div class="d-flex flex-col align-items-center min-w-300px" v-if="false">
        <ol>
          <li>
            <div
              class="d-flex flex-row pb-2"
              :class="{
                'border-dotted-bottom': true,
              }"
            >
              <h5 class="font-weight-400 mb-0 text-09-em">
                Project Pembangunan Masjid
              </h5>
              <div class="d-flex flex-row" style="align-items: flex-start">
                <span class="badge bg-info text-08-em ml-2">Carbon</span>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </template>

    <template v-slot:detail-row>
      <scooping-visit-detail />
    </template>

    <template v-slot:list-indicator="{ item }">
      <div class="indicator-wrapper pt-1">
        <div
          class="indicator"
          :class="{
            danger: item.project_data == 'No Project Found',
            warning:
              item.status == 'document_saving' &&
              item.is_verify == 0 &&
              item.project_data !== 'No Project Found',
            info:
              item.status == 'document_saving' &&
              item.is_verify == 1 &&
              item.project_data !== 'No Project Found',
            primary:
              item.status == 'ready_to_submit' &&
              item.project_data !== 'No Project Found',
            success:
              item.status == 'submit_review' &&
              item.project_data !== 'No Project Found',
          }"
        ></div>
      </div>
    </template>

    <template v-slot:list-status="{ item }">
      <div class="d-flex flex-row min-w-150px" style="justify-content: center">
        <span
          class="badge"
          :class="{
            'bg-warning':
              item.status == 'document_saving' && item.is_verify == 0,
            'bg-info': item.status == 'document_saving' && item.is_verify == 1,
            'bg-primary': item.status == 'ready_to_submit',
            'bg-success': item.status == 'submit_review',
            'bg-danger': item.project_data == 'No Project Found',
          }"
        >
          <span v-if="item.project_data == 'No Project Found'"
            >Belum Assign Project</span
          >
          <span
            v-else-if="item.status == 'document_saving' && item.is_verify == 0"
            >Pending</span
          >
          <span
            v-else-if="item.status == 'document_saving' && item.is_verify == 1"
            >GIS Review</span
          >
          <span v-else-if="item.status == 'ready_to_submit'"
            >GIS Terverifikasi</span
          >
          <span v-else-if="item.status == 'submit_review'">Terverifikasi</span>
        </span>
      </div>
    </template>
  </geko-base-crud>
</template>

<script>
import "./scooping-visit.scss";
import ScoopingVisitForm from "./ScoopingVisitForm.vue";
import ScoopingVisitDetail from "./ScoopingVisitDetail.vue";
export default {
  name: "crud-scooping-visit",
  components: {
    ScoopingVisitForm,
    ScoopingVisitDetail,
  },
  watch: {},
  data() {
    return {
      componentKey: 1,
      updateIds: [],
      config: {
        title: "Scooping Visit",
        model_api: null,
        getter: "GetNewScoopingAll",
        setter: "addProjectUtils",
        update: "updateProjectUtils",
        delete: "DeleteScoopingVisit_new",
        deleteLabel: "scooping_no",
        deleteKey: "data_no",
        delete_ext_payload: {
          delete_type: "hard_delete",
        },
        globalFilter: {
          // project_purpose: {
          //   setter: "purpose_code",
          // },
          program_year: {
            setter: "program_year",
          },
        },
        statistic: {
          transform_key: {
            total_data: {
              label: "Total Data",
              icon: "mdi-list-status",
            },
            verified: {
              label: "Terverifikasi",
              icon: "mdi-check-circle-outline",
              color: "success",
            },
            unverified: {
              label: "Belum Terverifikasi",
              icon: "mdi-close-circle-outline",
              color: "danger",
            },
          },
        },
        pk_field: null,
        permission: {
          create: "scooping-visit-create",
          read: "scooping-visit-list",
          update: "scooping-visit-update",
          show: "scooping-visit-show",
          lookup: "scooping-visit-lookup",
          delete: "scooping-visit-delete",
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
            id: "indicator",
            label: " ",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },
          {
            id: "data_no",
            label: "Form No",
            methods: {
              list: {
                type: "row-slot",
                class: "min-w-70px",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "project",
            label: "Project",
            methods: {
              list: {
                show: false,
                type: "row-slot",
              },
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "projects",
            label: "Project",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "desa",
            label: "Desa",
            methods: {
              list: {
                view_data: "desas_name",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "village_area",
            label: "Luas Desa",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "date",
            label: "Tanggal",
            methods: {
              list: {
                show: false,
                type: "row-slot",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "potential_dusun",
            label: "Potensi",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "pic",
            label: "PIC",
            methods: {
              list: {
                view_data: "users_name",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "pic_manager",
            label: "PIC Manager",
            methods: {
              list: {
                view_data: "employees_name",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },

          {
            id: "project_type",
            label: "Tipe Project",
            methods: {
              list: false,
              detail: false,
              create: false,
              update: false,
              filter: {
                type: "select",
                getter: "GetDonorAllAdmin",
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
            },
          },
          {
            id: "status",
            label: "Status",
            methods: {
              list: {
                type: "row-slot",
                view_data: "status",
                class: {
                  document_saving: "badge bg-warning",
                  ready_to_submit: "badge bg-info",
                  submit_review: "badge bg-success",
                },
                transform: "status-scooping-visit",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "potential_status",
            label: "Status Potensial",
            methods: {
              list: {
                view_data: "potential_status",
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-success",
                },
                transform: "status-potential",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
        ],
      },
    };
  },

  methods: {
    onVerification(data) {
      if (
        data.status == "document_saving" &&
        data.is_verify == 0 &&
        data.email_to_gis < 3
      ) {
        this.$_api.get("MailtoGis", { data_no: data.data_no }).then(() => {
          this.updateIds.push(data.id);
          this.$_alert.success("Berhasil mengirim email ke GIS");
        });
      } else if (
        data.status === "ready_to_submit" &&
        ["13", "25", "23"].includes(this.$store.state.User.role)
      ) {
        this.$_alert
          .confirm(
            "Verifikasi Data?",
            "Apakah anda yakin ingin verifikasi data?"
          )
          .then((res) => {
            if (res.isConfirmed) {
              this.$_api
                .post("UpdateVerifScoopingVisit_new", {
                  current_id: data.id,
                  verificator_email: this.$store.state.User.email,
                })
                .then(() => {
                  this.updateIds.push(data.id);
                  this.$_alert.success("Data berhasil diverifikasi");
                  // this.componentKey += 1;
                })
                .catch((err) => {
                  this.$_alert.error(err);
                });
            }
          });
      }
    },
  },
};
</script>
