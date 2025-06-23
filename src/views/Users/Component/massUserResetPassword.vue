<template>
  <v-dialog v-model="isOpen" width="70%">
    <template v-slot:default="{ isActive }">
      <v-card class="mx-auto">
        <v-card-title>Mass Reset Password User</v-card-title>
        <form @submit.prevent="handleSubmit(onSubmitReset())" autocomplete="off">
          <v-row>
            <v-col lg="12">
              <v-data-table :headers="usersList.table.header" :items="usersList.table.items"
                :server-items-length="usersList.totalRecord" :loading="usersList.loading"
                :items-per-page="usersList.perPage" class="elevation-1" @update:page="onChangePage"
                :page="usersList.page" @update:items-per-page="updatePerPage" :footer-props="{
                  itemsPerPageText: 'Jumlah Data Per Halaman',
                  itemsPerPageOptions: [10, 25, 50, 100, 200],
                  showCurrentPage: true,
                  showFirstLastPage: true,
                }" :show-select="true" v-model="usersList.selected"
                :search="usersList.search">
                <template v-slot:top>
                  <v-text-field v-model="usersList.search" append-icon="mdi-magnify" color="green"
                    label="Pencarian" hide-details outlined rounded dense class="mr-2"
                    @input="GetData()"></v-text-field>
                </template>
                <template v-slot:item.index="{ index }">
                  {{ index + 1 }}
                </template>
                <template v-slot:item.data-table-select="{ isSelected, select }">
                  <v-simple-checkbox color="success" v-ripple :value="isSelected"
                    @input="select($event)"></v-simple-checkbox>
                </template>
              </v-data-table>
            </v-col>

            <v-col lg="12">
              <v-btn
                :disabled="usersList.selected.length == 0"
                variant="danger" type="submit">
                <v-icon v-if="!usersList.loading">mdi-lock-reset</v-icon>
                <v-progress-circular v-else :size="20" color="danger" indeterminate></v-progress-circular>
                <span class="ml-1"> Reset Password!</span>
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </v-card>
    </template>
  </v-dialog>
</template>



<script>
import moment from "moment";
import axios from "axios";
export default {
  name: "monitoring-detail-export",
  props: {
    data: {
      required: true,
      default: () => { },
    },
    dataKey: {
      required: true,
      default: 0,
      type: Number,
    },
  },

  methods: {
    onOpen() {
      this.usersList.table.items = []
      this.GetData()
    },
    onMassPrintSwitch(){
      this.GetData()
    },
    async GetData() {
      var limit = this.usersList.perPage;
      var offset = (this.usersList.page - 1)*limit;

      var payload = {
        'limit': limit,
        'offset': offset,
        'search_value': this.usersList.search
      }
      var Url = "GetUser_new";
      var resDetail = await this.$_api.get(Url, payload);
      this.usersList.table.items = resDetail.data
      this.usersList.totalRecord = resDetail.total
      this.usersList.loading = false
    },
    async onSubmitReset() {
      console.log(this.usersList.selected);
      var payload={
        user_list: this.usersList.selected
      }
      const prompt = await this.$_alert.confirm('Reset Password User?', 'Harap Cek Data Dengan Teliti Sebelum Melakukan Reset Password!', 'Ya, Verifikasi!', 'Batal', true)
        if (prompt.isConfirmed) {
            this.$_api.post('MassResetPasswordUser', payload)
            .then(() => {
                this.$_alert.success('Berhasil Melakukan Reset Password User!')
                this.refreshKey += 1;
            })
            this.$emit("success", true);
        }
    },
    onChangePage(t) {
      this.usersList.page = t;
      this.usersList.loading = true;
      this.GetData()
    },
    updatePerPage($p) {
      this.usersList.perPage = $p;
      this.usersList.loading = true;
      this.GetData()
    },
  },

  watch: {
    dataKey(t) {
      if (t > 0) {
        this.isOpen = true;
      }
    },
    isOpen(t) {
      if (t) {
        this.onOpen();
      } else {
        this.usersList.table.items = []
        this.usersList.loading = false
        this.usersList.selected = []
        this.usersList.totalTrees = 0
        this.usersList.totalRecord = 0
        this.error = "";
      }
    },
  },
  data() {
    return {
      isOpen: false,
      loading: false,
      error: "",
      massPrint: false,
      usersList: {
        selected: [],
        totalTrees: 0,
        table: {
          header: [
            {
              key: "index",
              sortable: false,
              text: "No",
              value: "index",
            },
            {
              key: "employee_no",
              sortable: false,
              text: "Kode Karyawan",
              value: "employee_no",
            },
            {
              key: "name",
              sortable: false,
              text: "Nama",
              value: "name",
            },
            {
              key: "role",
              sortable: false,
              text: "Posisi",
              value: "role",
            },
          ],
          items: [],
        },
        totalRecord: 0,
        perPage: 10,
        page: 1,
        search: '',
        loading: false
      }
    };
  },
};
</script>