<template>
  <geko-base-crud
    :config="config"
    :key="'scooping-visit-' + componentKey"
    :hideDelete="!$_sys.isAllowed('scooping-visit-delete')"
    :hideDeleteSoft="!$_sys.isAllowed('scooping-visit-delete')"
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
          item.project_data == 'No Project Found' ||
          true
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
              item.project_data !== 'No Project Found' &&
              !['2022-05-05 00:00:00'].includes(item.created_at),
            danger:
              item.project_data == 'No Project Found' ||
              ['2022-05-05 00:00:00'].includes(item.created_at),
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
              item.status == 'document_saving' &&
              item.is_verify == 0 &&
              item.project_data != 'No Project Found',
            'bg-info':
              item.status == 'document_saving' &&
              item.is_verify == 1 &&
              item.project_data != 'No Project Found',
            'bg-primary':
              item.status == 'ready_to_submit' &&
              item.project_data != 'No Project Found',
            'bg-success':
              item.status == 'submit_review' &&
              item.project_data != 'No Project Found',
            'bg-danger':
              item.project_data == 'No Project Found' ||
              ['2022-05-05 00:00:00'].includes(item.created_at),
          }"
        >
          <span v-if="['2022-05-05 00:00:00'].includes(item.created_at)"
            >Data belum lengkap</span
          >
          <span v-else-if="item.project_data == 'No Project Found'"
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

    <template v-slot:list-potential_status="{ item }">
      <div class="d-flex flex-row justify-content-center">
        <span
          v-if="item.status == 'submit_review'"
          class="badge"
          :class="{
            'bg-success': item.potential_status == 1,
            'bg-danger': item.potential_status == 0,
          }"
          >{{ item.potential_status | parse("status-potential") }}</span
        >

        <span v-else>-</span>
      </div>
    </template>

    <template v-slot:list-bottom-action="{ item }">
      <v-btn
        small
        @click="onExport(item)"
        variant="primary"
        class="mt-1"
        v-if="item.status == 'submit_review'"
      >
        <v-icon small v-if="!exportIds.includes(item.id)"
          >mdi-microsoft-word</v-icon
        >

        <v-progress-circular
          v-else
          color="primary"
          :size="15"
          :width="2"
          indeterminate
        ></v-progress-circular>
        <span class="text-09-em ml-2">Export</span>
      </v-btn>
    </template>
  </geko-base-crud>
</template>

<script>
import "./scooping-visit.scss";
import ScoopingVisitForm from "./ScoopingVisitForm.vue";
import ScoopingVisitDetail from "./ScoopingVisitDetail.vue";
import ScoopingVisitData from "./ScoopingVisitData.js";
import axios from "axios";
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
      exportIds: [],
      config: {
        title: "Scooping Visit",
        model_api: null,
        filter_api: {
          scooping_type: "new",
        },
        getter: "GetNewScoopingAll",
        setter: "addProjectUtils",
        update: "updateProjectUtils",
        delete: "DeleteScoopingVisit_new",
        deleteLabel: "scooping_no",
        deleteKey: "data_no",
        delete_ext_payload: {
          delete_type: "hard_delete",
        },
        deleteSoft: {
          payload: {
            delete_type: "soft_delete",
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
          detail: "scooping-visit-detail",
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
            id: "management_unit_filter",
            label: "Management Unit",
            methods: {
              list: false,
              detail: false,
              create: false,
              update: false,
              filter: {
                validation: ["required"],
                type: "select",
                col_size: 6,
                main: true,
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
            },
          },

          {
            id: "program_year",
            label: "Tahun Program",
            methods: {
              list: {
                class: "badge bg-primary",
              },
              detail: false,
              create: false,
              update: false,
            },
          },
          {
            id: "status",
            label: "Status",
            methods: {
              list: {
                type: "row-slot",
                view_data: "status",
                header_class: "text-center",
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
              filter: {
                type: "select",
                setter: "status",
                main: true,
                option: {
                  default_options: [
                    {
                      name: "Semua Status",
                      code: null,
                    },
                    {
                      name: "Belum Terverifikasi",
                      code: "document_saving",
                    },
                    {
                      name: "Terverifikasi GIS",
                      code: "ready_to_submit",
                    },
                    {
                      name: "Terverifikasi",
                      code: "submit_review",
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
            id: "potential_status",
            label: "Status Potensial",
            methods: {
              list: {
                type: "row-slot",
                view_data: "potential_status",
                header_class: "text-center",
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

          {
            id: "scooping_type",
            label: "Desa Scooping",
            methods: {
              detail: false,
              create: false,
              update: false,
              filter: {
                type: "select",
                setter: "scooping_type",
                main: true,
                option: {
                  default_options: [
                    {
                      name: "Semua Desa",
                      code: "",
                    },
                    {
                      name: "Desa Baru",
                      code: "new",
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

  methods: {
    async onExport(data) {
      if (this.exportIds.includes(data.id)) return;
      this.exportIds.push(data.id);
      const scoopingData = this.$_api.get("GetDetailScoopingVisit_new", {
        id: data.id,
      });

      const scoopingFigures = this.$_api.get(
        "GetDetailScoopingVisitFigures_new",
        { data_no: data.data_no }
      );
      const scoopingProject = this.$_api.get(
        "GetDetailScoopingVistiProject_new",
        { data_no: data.data_no }
      );
      const scoopingNgos = this.$_api.get(
        "GetDetailScoopingVisitNGOCompetitor_new",
        { data_no: data.data_no }
      );
      const scoopingFf = this.$_api.get(
        "GetDetailScoopingVisitFFCandidate_new",
        { data_no: data.data_no }
      );

      Promise.all([
        scoopingData,
        scoopingFigures,
        scoopingProject,
        scoopingNgos,
        scoopingFf,
      ])
        .then(async ([main, figures, projects, ngos, ff]) => {
          let exportPayload = main.data;
          exportPayload.village_figures = figures.data;
          exportPayload.projects = figures.data;
          exportPayload.ff_candidates = ff.data;

          exportPayload.accessibility = this.getDataLabel(
            exportPayload.accessibility,
            "accessibility"
          );

          let waterSources = [];
          for (const item of exportPayload.water_source
            ? exportPayload.water_source.split(",")
            : []) {
            waterSources.push(this.getDataLabel(item, "water_source"));
          }

          exportPayload.water_source = waterSources.join(",");
          exportPayload.agroforestry_type = this.getDataLabel(
            exportPayload.agroforestry_type,
            "agroforestry_type"
          );

          exportPayload.projects = [];
          for (const _project of projects.data) {
            exportPayload.projects.push({
              name: _project.projects_project_name,
              code: _project.projects_project_no,
              purpose: _project.project_planting_purposes_name,
            });
          }

          exportPayload.other_ngo =
            exportPayload.other_ngo == 0 ? "Tidak Ada" : "Ada";
          exportPayload.mitigation_program =
            exportPayload.mitigation_program == 0 ? "Tidak Ada" : "Ada";

          let otherNgo = [];
          if (Array.isArray(ngos.data)) {
            for (const item of ngos.data) {
              otherNgo.push({
                name: item.name,
              });
            }
          }
          if (otherNgo.length > 0) {
            exportPayload.other_ngos = otherNgo.join(",");
          }

          const exportData = await axios
            .post(
              `${this.$_config.baseUrlExport}export/scooping-visit/doc`,
              exportPayload
            )
            .catch(() => false);
          if (!exportData) return;

          const url = URL.createObjectURL(
            new Blob([exportData.data], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            })
          );
          const link = document.createElement("a");
          link.href = url;
          const filename = `scooping-visit-${data.data_no}-${data.desas_name}.doc`;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();

          var idx = this.exportIds.findIndex((x) => x == data.id);
          if (idx > -1) {
            this.exportIds.splice(idx, 1);
          }
        })
        .catch(() => {
          this.$_alert.error({}, "Export Gagal");
          var idx = this.exportIds.findIndex((x) => x == data.id);
          if (idx > -1) {
            this.exportIds.splice(idx, 1);
          }
        });
    },

    getDataLabel(value, dataKey) {
      if (ScoopingVisitData[dataKey].find((x) => x.value == value)) {
        return ScoopingVisitData[dataKey].find((x) => x.value == value).text;
      } else {
        return value;
      }
    },
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
