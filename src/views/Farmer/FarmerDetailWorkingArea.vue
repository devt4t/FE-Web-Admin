<template>
  <v-data-table
    :headers="header"
    :items="data"
    :search="''"
    class="rounded-xl elevation-1 mx-3 pa-1 mb-4"
    data-aos="fade-up"
    data-aos-delay="100"
    data-aos-duration="800"
    :footer-props="{
      showCurrentPage: false,
      showFirstLastPage: false,
    }"
  >
    <template v-slot:top>
      <farmer-assign-ff-modal
        :dataKey="assignFfModal"
        @refresh="$emit('refresh', true)"
      />
      <div class="geko-list-header px-5 py-3 mt-1">
        <div
          class="pr-5 mr-5 mb-3 pb-3 bordered-bottom d-flex flex-row align-items-center justify-content-between"
        >
          <h4>FF (Area Kerja)</h4>
          <div class="buttons">
            <v-btn
              v-if="$_sys.isAllowed('farmer-working-area-create')"
              variant="info"
              @click="assignFfModal += 1"
            >
              <v-icon>mdi-account-edit</v-icon>
              <span>Assign FF</span>
            </v-btn>
          </div>
        </div>

        <div
          class="d-flex flex-row align-items-center mt-2 bg-info-light px-4 py-3 br-8"
        >
          <v-icon class="text-info" large>mdi-information</v-icon>
          <span class="text-info pl-3">
            Informasi area kerja petani apabila petani memiliki lahan yang
            berada di luar area kerja
          </span>
        </div>
      </div>
    </template>

    <!-- <template v-slot:item.action="{item}">
      
      <div class="geko-list-actions-wrapper d-flex flex-column">
          <div class="geko-list-actions">

          </div>
      </div>
    </template> -->

    <template v-slot:item.index="{ index }">
      {{ index + 1 }}
    </template>

    <template v-slot:item.action="{ item }">
      <div class="geko-list-actions-wrapper d-flex flex-column">
        <div class="geko-list-actions">
          <button
            v-if="$_sys.isAllowed('field-facilitator-detail')"
            class="geko-list-action-view"
            @click="
              $router.push({
                path: '/field-facilitator-v2',
                query: {
                  view: 'detail',
                  ff_no: item.ff_no,
                },
              })
            "
          >
            <v-icon small>mdi-information-outline</v-icon>
          </button>

          <button
            class="geko-list-action-delete"
            @click="onDelete(item)"
            :disabled="loading"
            v-if="$_sys.isAllowed('farmer-working-area-delete')"
          >
            <v-icon small>mdi-trash-can-outline</v-icon>
          </button>
        </div>
      </div>
    </template>

    <template v-slot:item.ff_id="{ item }">
      <div class="d-flex flex-column">
        <span class="font-weight-500">{{ item.field_facilitators_name }}</span>
        <div class="d-flex flex-row">
          <span class="badge bg-light">{{ item.ff_no }}</span>
        </div>
      </div>
    </template>

    <template v-slot:item.program_year="{ item }">
      <span class="badge bg-primary">{{ item.program_year }}</span>
    </template>
  </v-data-table>
</template>

<script>
import FarmerAssignFfModal from "./FarmerAssignFfModal.vue";
export default {
  name: "farmer-detail-working-area",
  components: {
    FarmerAssignFfModal,
  },
  props: {
    workingAreas: {
      required: false,
      default: () => [],
    },
    mainData: {
      required: false,
      default: () => {},
    },
  },
  methods: {
    async onDelete(item) {
      try {
        this.loading = true;
        const isConfirmed = await this.$_alert.confirm(
          "Hapus Permanen?",
          "Apakah anda yakin ingin menghapus data area kerja petani?",
          "Ya, Hapus",
          "Batal",
          true
        );

        if (!isConfirmed.isConfirmed) throw "cancel";

        this.$_api
          .post("deleteFarmerworkingArea_new", {
            id: item.id,
          })
          .then((res) => {
            this.$_alert.success("Data area kerja petani berhasil dihapus");
            this.$emit("refresh");
            this.loading = false;
          })
          .catch((err) => {
            throw err;
          });
      } catch (err) {
        this.loading = false;
      }
    },
  },
  watch: {
    workingAreas(t) {
      if (Array.isArray(t)) {
        this.data = t;
      }
    },
  },
  data() {
    return {
      assignFfModal: 0,
      hasEmptyTree: false,
      loading: false,
      header: [
        {
          text: "",
          key: "action",
          value: "action",
          sortable: false,
        },
        {
          text: "No",
          key: "index",
          value: "index",
          class: "sticky-left",
          sortable: false,
        },
        {
          text: "Nama FF",
          key: "ff_id",
          value: "ff_id",
          sortable: false,
        },
        {
          text: "Desa",
          key: "village_id",
          value: "desas_name",
          sortable: false,
        },
        {
          text: "Tahun Program",
          key: "program_year",
          value: "program_year",
          sortable: false,
        },
        {
          text: "Diperbarui Oleh",
          key: "updated_by",
          value: "updated_by",
          sortable: false,
        },
      ],
      data: [],
    };
  },
};
</script>
