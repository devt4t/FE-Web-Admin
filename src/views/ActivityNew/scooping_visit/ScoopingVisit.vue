<template>
  <geko-base-crud :config="config">
    <template v-slot:create-form>
      <scooping-visit-form />
    </template>

    <template v-slot:list-bottom-action="{ item }">
      <v-btn
        v-if="item.status === 'document_saving'"
        variant="warning"
        class="mt-1"
        small
        >Verifikasi</v-btn
      >
    </template>

    <template v-slot:list-village_area="{ item }">
      <div class="min-w-70px">
        <span>{{ parseInt(item.land_area) }} Ha</span>
      </div>
    </template>

    <template v-slot:list-date="{ item }">
      <div class="min-w-150px">
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
    </template>

    <template v-slot:list-potential_dusun="{ item }">
      <div class="text-no-wrap">{{ item.potential_dusun }} dusun</div>
    </template>

    <template v-slot:detail-row>
      <scooping-visit-detail />
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
      config: {
        title: "Scooping Visit",
        model_api: null,
        getter: "GetNewScoopingAll",
        setter: "addProjectUtils",
        update: "updateProjectUtils",
        delete: "newDeleteDonor",
        globalFilter: {
          project_purpose: {
            setter: "purpose_code",
          },
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
            id: "data_no",
            label: "Form No",
            methods: {
              list: {
                class: "min-w-70px",
              },
              detail: true,
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

  methods: {},
};
</script>
