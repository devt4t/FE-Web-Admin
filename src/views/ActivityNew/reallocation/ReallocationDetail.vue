<template>
  <span>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card pb-4">
          <v-card-title>
            <v-icon large class="mr-2" @click="$router.go(-1)">mdi-arrow-left-circle</v-icon>
            <h5 class="mb-0 pb-0">Detail Pengiriman Ulang</h5>
          </v-card-title>

          <div class="card-body" v-if="data">
            <div class="mx-5">
              <table class="reallocation-table">
                <tr>
                  <td>Tanggal Distribusi</td>
                  <td>
                    {{ dateFormat(data.distribution_date, 'DD MMMM YYYY') }}
                  </td>
                </tr>
                <tr>
                  <td>Tahun Program</td>
                  <td>
                    <span>{{ data.program_year }}</span>
                  </td>
                </tr>
                <tr>
                  <td>Lokasi Nursery</td>
                  <td>
                    <span>{{ data.name_location_nursery }}</span>
                  </td>
                </tr>
                <tr>
                  <td>Keterangan</td>
                  <td>
                    <span>{{ data.description }}</span>
                  </td>
                </tr>
                <tr>
                  <td>Request By</td>
                  <td>
                    <span>{{ data.request_by }}</span>
                  </td>
                </tr>
                <tr>
                  <td>Management Unit</td>
                  <td>
                    <span>{{ data.mu_name }}</span>
                    <div class="d-flex flex-row">
                      <span class="badge bg-light">{{ data.mu_no }}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Field Facilitator</td>
                  <td>
                    <span>{{ data.ff_name }}</span>
                    <div class="d-flex flex-row">
                      <span class="badge bg-light">{{ data.ff_no }}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Status Alokasi</td>
                  <td>
                    <span :class="data.status_allocation == 1 ? 'badge bg-success' : 'badge bg-danger'">{{
                      data.status_allocation == 1 ? 'Sudah Dialokasi' : 'Belum Dialokasi' }}</span>
                  </td>
                </tr>
                <tr>
                  <td>Status Penerimaan</td>
                  <td>
                    <span :class="data.status_received == 1 ? 'badge bg-success' : 'badge bg-danger'">{{
                      data.status_received == 1 ? 'Sudah Diterima' : 'Belum Diterima' }}</span>
                  </td>
                </tr>
                <tr>
                  <td>Status Verifikasi</td>
                  <td>
                    <span :class="data.status_verified == 1 ? 'badge bg-success' : 'badge bg-danger'">{{
                      data.status_verified == 1 ? 'Terverifikasi' : 'Belum Diverifikasi' }}</span>
                  </td>
                </tr>
                <!-- status_allocation
              status_received
              status_verified -->
              </table>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
          <v-data-table :headers="headerAddendumTable" :items="data.list_adendum" :search="''"
            class="rounded-xl elevation pa-1 px-5">

            <template v-slot:item.index="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Daftar Addendum</h4>
                </div>
                <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                </div>
              </div>

              <div class="statistics mb-3">
                <div class="statistic-item light">
                  <v-icon>mdi-list-status</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Addendum</p>
                    <p class="mb-0 value">{{ data.list_adendum.length }}</p>
                  </div>
                </div>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </span>
</template>

<script>
import moment from 'moment';
import './reallocation.scss';

export default {
  name: 'reallocation-detail',
  data() {
    return {
      data: {},
      headerAddendumTable: [
        {
          key: "index",
          sortable: false,
          text: "No",
          value: "index",
        },
        {
          key: "lahan_no",
          value: "lahan_no",
          text: "Nomor Lahan",
        },
        {
          key: "rel_tree_id",
          value: "rel_tree_id",
          text: "Nama Bibit",
        },
        {
          key: "after_qty_seed",
          value: "after_qty_seed",
          text: "Total Load",
        },

        {
          key: "description_reason",
          value: "description_reason",
          text: "Keterangan",
        },
        {
          key: "farmer_name",
          value: "farmer_name",
          text: "Nama Petani",
        },
        {
          key: "farmer_no",
          value: "farmer_no",
          text: "Kode Petani",
        },


        // {
        //   key: "id",
        //   value: "id",
        //   text: "",
        // },
        // {
        //   key: "tree_id",
        //   value: "tree_id",
        //   text: "",
        // },
        // {
        //   key: "updated_at",
        //   value: "updated_at",
        //   text: "",
        // },
        // {
        //   key: "updated_by",
        //   value: "updated_by",
        //   text: "",
        // },
        // {
        //   key: "rel_adendum_id",
        //   value: "rel_adendum_id",
        //   text: "",
        // },
        // {
        //   key: "rel_created_by",
        //   value: "rel_created_by",
        //   text: "",
        // },
        // {
        //   key: "before_qty_seed",
        //   value: "before_qty_seed",
        //   text: "",
        // },
        // {
        //   key: "category_id",
        //   value: "category_id",
        //   text: "",
        // },
        // {
        //   key: "created_at",
        //   value: "created_at",
        //   text: "",
        // },
        // {
        //   key: "created_by",
        //   value: "created_by",
        //   text: "",
        // },
        // {
        //   key: "rel_updated_by",
        //   value: "rel_updated_by",
        //   text: "",
        // },

      ]
    }
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      this.$_api.get('nursery/addendum/detail', {
        adendum_id: this.$route.query.id
      }).then(data => {
        this.data = data.data;
      })
    },
    dateFormat(date, format) {
      return moment(date).format(format);
    },
  }
}
</script>