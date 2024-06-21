<template>
  <div>
    <!-- BreadCrumbs -->
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      data-aos="fade-right"
      class="breadcrumbsmain"
      :items="breadcrumbs"
      divider=">"
      large
    ></v-breadcrumbs>
    <!-- Modals -->
    <FormModal
      :show="modals.form.show"
      :id="modals.form.data"
      :programYear="localConfig.programYear"
      @action="($v) => modalActions($v)"
      @swal="($v) => swalActions($v)"
      :key="modals.form.key"
    />
    <DetailModal
      :show="modals.detail.show"
      :id="modals.detail.data"
      :programYear="localConfig.programYear"
      @action="($v) => modalActions($v)"
      @swal="($v) => swalActions($v)"
      :key="modals.detail.key"
    />
    <!-- Main Table -->
    <div class="px-4">
      <v-alert type="info"
        >Geko V2.0<br />Modul Scooping Visit bisa diakses melalui menu
        <strong
          class="cursor-pointer"
          @click="
            $router.push({
              path: 'scooping-visit-v2',
              query: {
                view: 'list',
              },
            })
          "
          >New Activities</strong
        >
      </v-alert>
    </div>
    <v-data-table
      data-aos="fade-up"
      data-aos-delay="200"
      multi-sort
      :headers="table.headers"
      :items="table.items"
      :search="table.search"
      :loading="table.loading.show"
      :loading-text="table.loading.text"
      :class="`${
        $store.state.theme == 'dark' ? '' : ''
      } rounded-xl elevation-6 mx-3 pa-1`"
      :footer-props="{
        itemsPerPageText: 'Jumlah Data Per Halaman',
        itemsPerPageOptions: [10, 25, 40, -1],
        showCurrentPage: true,
        showFirstLastPage: true,
      }"
    >
      <!-- Toolbars -->
      <template v-slot:top>
        <v-row class="my-2 mx-2 mx-lg-3 align-center">
          <!-- Program Year -->
          <!-- <v-select
                        color="success"
                        item-color="success"
                        v-model="localConfig.programYear"
                        :items="$store.state.programYear.options"
                        :disabled="table.loading.show"
                        outlined
                        dense
                        hide-details
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                        rounded
                        label="Program Year"
                        class="mx-auto mr-lg-2 mb-2 mb-lg-0"
                        style="max-width: 200px"
                    ></v-select> -->
          <!-- Search Field -->
          <v-text-field
            color="green"
            hide-details
            dense
            outlined
            rounded
            class="mx-auto mb-2 mb-lg-0"
            label="Pencarian"
            placeholder="Start type to search..."
            append-icon="mdi-magnify"
            v-model="table.search"
          ></v-text-field>
          <v-divider class="mx-2 d-none d-lg-block"></v-divider>
          <div class="mx-auto">
            <v-btn
              v-if="false"
              color="green white--text"
              :disabled="table.loading.show || table.items.length == 0"
              rounded
              class="mr-2"
              @click="() => exportExcel()"
              disabled
            >
              <v-icon class="mr-1">mdi-microsoft-excel</v-icon>
              Export
            </v-btn>
            <v-btn
              v-if="false"
              color="info"
              rounded
              class="pl-2"
              @click="
                () => {
                  modals.form.show = true;
                  modals.form.key += 1;
                }
              "
            >
              <v-icon class="mr-1">mdi-plus-circle</v-icon>
              Tambah
            </v-btn>
          </div>
        </v-row>
      </template>
      <!-- No -->
      <template v-slot:item.no="{ index }">
        {{ index + 1 }}
      </template>
      <!-- Luas Desa -->
      <template v-slot:item.land_area="{ item }">
        {{ _utils.numberFormat(item.land_area) }} Ha
      </template>
      <!-- Tanggal Column -->
      <template v-slot:item.start_scooping_date="{ item }">
        {{ _utils.dateFormat(item.start_scooping_date, "DD MMMM Y") }}
        <span v-if="item.start_scooping_date != item.end_scooping_date">
          ~
          {{ _utils.dateFormat(item.end_scooping_date, "DD MMMM Y") }}
        </span>
      </template>
      <!-- Luas Desa -->
      <template v-slot:item.potential_dusun="{ item }">
        {{ _utils.numberFormat(item.potential_dusun) }} Dusun
      </template>
      <!-- Status Column -->
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getStatusColumn('bg_color', item.status)"
          class="white--text"
        >
          <v-icon class="mr-1">{{
            getStatusColumn("icon", item.status)
          }}</v-icon>
          {{ getStatusColumn("text", item.status) }}
        </v-chip>
      </template>

      <!-- Action Column -->
      <template v-slot:item.actions="{ item }">
        <!-- <v-menu content-class="rounded-xl">
                    <template v-slot:activator="{ attrs, on }">
                        <v-btn v-bind="attrs" v-on="on" small fab icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
<v-card class="pa-2 d-flex align-stretch flex-column justify-center">
    <v-btn color="info white--text" rounded small class="pl-1 d-flex justify-start align-center"
        @click="showModal('detail', item)">
        <v-icon class="mr-1">mdi-information</v-icon> Detail
    </v-btn>
    <v-btn color="orange white--text" rounded small class="pl-1 mt-1 d-flex justify-start align-center"
        :disabled="(item.status == 'submit_review') && user.role_name != 'GIS STAFF'"
        @click="() => { showModal('form', item) }">
        <v-icon class="mr-1">mdi-pencil-circle</v-icon> Edit
    </v-btn>
    <v-btn rounded small color="red darken-2 white--text" class="mt-1 pl-1 d-flex justify-start align-center"
        @click="() => showDeleteModal(item)" :disabled="deleteDisabled(item.is_validate)">
        <v-icon class="mr-1 pl-2">mdi-delete</v-icon> Delete
    </v-btn>
</v-card>
</v-menu> -->
      </template>
    </v-data-table>
  </div>
</template>

<script>
import FormModal from "./components/FormModal.vue";
import DetailModal from "./components/DetailModal.vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  components: {
    FormModal,
    DetailModal,
  },
  data: () => ({
    breadcrumbs: [
      {
        text: "Activities",
        disabled: true,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Scooping Visit",
        disabled: true,
        href: "breadcrumbs_link_1",
      },
    ],
    localConfig: {
      programYear: "",
    },
    modals: {
      form: {
        show: false,
        data: null,
        key: 29291,
      },
      detail: {
        show: false,
        data: null,
        key: 89238292,
      },
    },
    table: {
      headers: [
        { text: "No", value: "no" },
        { text: "Form No", value: "data_no" },
        { text: "Desa", value: "village_name" },
        { text: "Luas Desa", value: "land_area" },
        { text: "Tanggal", value: "start_scooping_date" },
        { text: "Potensi", value: "potential_dusun", align: "center" },
        { text: "PIC", value: "pic_name" },
        { text: "PIC Manager", value: "pic_manager" },
        { text: "Status", value: "status", align: "center" },
        //{ text: 'Actions', value: 'actions', align: 'right' },
      ],
      items: [],
      loading: {
        show: false,
        text: "Loading...",
      },
      search: "",
    },
    user: "",
  }),
  mounted() {
    this.firstAccessPage();
  },
  methods: {
    errorResponse(error) {
      console.log(error);
      if (error.response) {
        if (error.response.status) {
          if (error.response.status == 401) {
            localStorage.removeItem("token");
            this.$router.push("/");
          }
        }
      }
    },
    async firstAccessPage() {
      // set general config to local config
      this.user = this.$store.state.User;
      this.localConfig.programYear = this.$store.state.tmpProgramYear
        ? this.$store.state.tmpProgramYear
        : this.$store.state.programYear.model;

      await this.getTableData();
    },
    getStatusColumn(type, status) {
      if (type == "bg_color") {
        if (status == "document_saving") return "blue darken-1";
        if (status == "ready_to_submit") return "orange";
        if (status == "submit_review") return "green darken-1";
      }
      if (type == "icon") {
        if (status == "document_saving") return "mdi-content-save";
        if (status == "ready_to_submit") return "mdi-content-save-check";
        if (status == "submit_review") return "mdi-check-circle";
      }
      if (type == "text") {
        if (status == "document_saving") return "Disimpan";
        if (status == "ready_to_submit") return "Menunggu Verifikasi";
        if (status == "submit_review") return "Terverifikasi";
      }

      return "";
    },
    async getTableData() {
      try {
        this.table.loading.show = true;
        const User = this.$store.state.User;
        const created_by = [];
        if (["UNIT MANAGER", "FIELD COORDINATOR"].includes(User.role_name)) {
          created_by.push(User.email);
          if (User.role_name == "UNIT MANAGER") {
            const resEmp = await axios.get(
              this.$store.getters.getApiUrl(
                `GetEmployeebyManager?position_no=19&manager_code=${User.employee_no}`
              ),
              this.$store.state.apiConfig
            );
            resEmp.data.data.result.data.map((val) => {
              created_by.push(val.email);
            });
          }
        }
        let url = this.$store.getters.getApiUrl(
          `GetScoopingAll?user_id=${created_by.toString()}`
        );
        const res = await axios.get(url, this.$store.state.apiConfig);
        this.table.items = res.data.data.result;
        // console.log(this.table.items)
      } catch (err) {
        this.table.items = [];
        this.errorResponse(err);
      } finally {
        this.table.loading.show = false;
      }
    },
    modalActions(val) {
      if (val.type == "close") {
        this.modals[val.name].show = false;
        this.modals[val.name].data = null;
      } else if (val.type == "refresh-table") this.getTableData();
    },
    async showModal(name, data) {
      this.modals[name].data = await data.data_no;
      this.modals[name].show = await true;
    },
    swalActions(val) {
      this.getTableData();
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        showCloseButton: true,
        timer: 10000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: val.type,
        title: val.message,
      });
    },
  },
};
</script>
