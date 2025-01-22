<template>
  <geko-base-crud :config="config" :hideCreate="true" :hideUpdate="true" :hideDelete="true">

    <template v-slot:list-before-create>
      <modal-acceptance @success="refreshKey += 1" :dataKey="modalAcceptanceKey"
        :data="dataAddendum"></modal-acceptance>
    </template>

    <template v-slot:detail-row>
      <reallocation-detail />
    </template>

    <template v-slot:list-created_by="{ item }">
      {{ item.created_by }}
    </template>

    <template v-slot:list-bottom-action="{ item }">
      <div>
        <v-btn v-if="!item.status_received" variant="success" small class="mt-2" @click="openModalAcceptance(item)">
          <v-icon left small>mdi-hand-extended</v-icon>
          <span>Diterima</span>
        </v-btn>

        <v-btn v-if="!item.status_verified" variant="success" small class="mt-2" @click="verifikasi(item)">
          <v-icon left small>mdi-check-bold</v-icon>
          <span>Verifikasi</span>
        </v-btn>
        <v-btn v-else variant="danger" small class="mt-2" @click="unverifikasi(item)">
          <v-icon left small>mdi-undo</v-icon>
          <span>Unverifikasi</span>
        </v-btn>
      </div>
    </template>

    <template v-slot:list-mu_name="{ item }">
      <div class="min-w-150px">
        <span class="d-block">{{ item.mu_name }}</span>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              item.mu_no
            }}</span>
          </template>

          <span>No. Management Unit</span>
        </v-tooltip>
      </div>
    </template>
    <template v-slot:list-ff_name="{ item }">
      <div class="min-w-150px">
        <span class="d-block">{{ item.ff_name }}</span>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              item.ff_no
            }}</span>
          </template>

          <span>Kode FF</span>
        </v-tooltip>
      </div>
    </template>

    <template v-slot:list-tree_code="{ item }">
      <div class="min-w-150px">
        <span class="d-block">{{ item.rel_tree_id }}</span>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              item.tree_code
            }}</span>
          </template>

          <span>Kode Bibit</span>
        </v-tooltip>
      </div>
    </template>

    <template v-slot:detail-tree_code="{ item }">
      <div class="min-w-150px">
        <span class="d-block">{{ item.rel_tree_id }}</span>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              item.tree_code
            }}</span>
          </template>

          <span>Kode Bibit</span>
        </v-tooltip>
      </div>
    </template>

    <template v-slot:list-qty_seed="{ item }">
      <div class="d-flex flex-row">

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="badge bg-secondary">
              <v-icon size="small">mdi-seed</v-icon> {{ item.before_qty_seed }}
            </span>
          </template>

          <span>Sebelum</span>
        </v-tooltip>


        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="badge bg-success">
              <v-icon size="small">mdi-seed-plus </v-icon> {{ item.after_qty_seed }}
            </span>
          </template>

          <span>Sesudah</span>
        </v-tooltip>

      </div>
    </template>

    <template v-slot:detail-qty_seed="{ item }">
      <div class="d-flex flex-row  ">

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="badge bg-secondary">
              <v-icon size="small">mdi-seed</v-icon> {{ item.before_qty_seed }}
            </span>
          </template>

          <span>Sebelum</span>
        </v-tooltip>


        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="badge bg-success">
              <v-icon size="small">mdi-seed-plus </v-icon> {{ item.after_qty_seed }}
            </span>
          </template>

          <span>Sesudah</span>
        </v-tooltip>

      </div>
    </template>
  </geko-base-crud>
</template>

<script>
import ModalAcceptance from './ModalAcceptance.vue';
import ReallocationDetail from './ReallocationDetail.vue';

export default {
  name: "crud-reallocation",
  watch: {},
  components: {
    ModalAcceptance,
    ReallocationDetail
  },
  data() {
    return {
      dataAddendum: {},
      modalAcceptanceKey: 0,
      config: {
        title: "Pengiriman Ulang",
        program_year: {
          show: false,
          model: "2024",
        },
        model_api: null,
        getter: "nursery/addendum/list",
        setter: "addProjectUtils",
        setter_ext_payload: {
          project_modul: "purpose",
        },
        update: "updateProjectUtils",
        update_ext_payload: {
          project_modul: "purpose",
        },
        delete: "deleteProjectUtils",
        delete_ext_payload: {
          delete_type: "hard_delete",
          project_modul: "purpose",
        },
        deleteKey: "code",
        // detail: "nursery/addendum/detail",
        // detailIdKey: "adendum_id",
        // detailKey: "data.result",
        pk_field: null,
        filter_api: {
          project_modul: "purpose",
        },
        permission: {
          create: "project-planting-purpose-create",
          read: "project-planting-purpose-list",
          update: "project-planting-purpose-update",
          detail: "project-planting-purpose-detail",
          lookup: "project-planting-purpose-lookup",
          delete: "project-planting-purpose-delete",
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
            id: "mu_name",
            label: "Management Unit",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: {
                type: 'slot',
                view_data: 'farmer_name'
              },
            },
          },
          {
            id: "ff_name",
            label: "Nama FF",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: {
                type: 'slot',
                view_data: 'ff_name'
              },
            },
          },
          {
            id: "name_location_nursery",
            label: "Nursery",
            methods: {
              list: true,
              detail: true,
            },
          },
          {
            id: "description",
            label: "Keterangan",
            methods: {
              list: true,
              detail: true,
            },
          },
          {
            id: "distribution_date",
            label: "Tanggal Distribusi",
            methods: {
              list: {
                transform: 'date',
                class: "badge bg-info",
              },
              detail: {
                type: 'slot',
                view_data: 'tree_code'
              },
            },
          },
          {
            id: "rel_updated_by",
            label: "Implementor",
            methods: {
              list: false,
              detail: false,
            },
          },
          {
            id: "status_received",
            label: "Status Penerimaan",
            methods: {
              list: {
                transform: "status-acceptance",
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-success",
                }
              },
              detail: true,
              filter: false,
            },
          },
          {
            id: "status_allocation",
            label: "Status Alokasi",
            methods: {
              list: {
                transform: "status-allocation",
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-success",
                }
              },
              detail: true,
              filter: false,
            },
          },
          {
            id: "status_verified",
            label: "Status Verifikasi",
            methods: {
              list: {
                transform: 'status-verification',
                class: {
                  0: "badge bg-danger",
                  1: "badge bg-success",
                }
              },
              detail: true,
              filter: false,
            },
          },
          {
            id: "program_year",
            label: "tahun Program",
            methods: {
              list: {
                show: true,
                class: "badge bg-primary",
              },
              detail: {
                type: 'slot',
                view_data: 'tree_code'
              },
            },
          },
          {
            id: "request_by",
            label: "Request By",
            methods: {
              list: true,
              detail: true,
              filter: false,
            },
          },
          {
            id: "updated_at",
            label: "Diupdate pada",
            methods: {
              list: {
                transform: "datetime",
                class: "badge bg-info"
              },
              detail: true,
              filter: false,
            },
          },
          {
            id: "rel_verified_by",
            label: "Diverifikasi oleh",
            methods: {
              list: {
                transform: "no-empty"
              },
              detail: true,
              filter: false,
            },
          },

        ],
      },
    };
  },
  methods: {
    openModalAcceptance(item) {
      this.modalAcceptanceKey++;
      this.dataAddendum = item;
    },
    async verifikasi(item) {
      const prompt = await this.$_alert.confirm('Verifikasi Pengiriman Ulang?', 'Apakah anda yakin akan memverifikasi pengiriman ulang ini?', 'Ya, Verifikasi', 'Batal', true)
      if (prompt.isConfirmed) {
        this.$_api.post('nursery/addendum/verify', {
          id: item.id
        })
          .then(() => {
            this.$_alert.success('Pengiriman ulang berhasil diverifikasi')
            this.refreshKey += 1
          })
      }
    },
    async unverifikasi(item) {
      const prompt = await this.$_alert.confirm('Verifikasi Pengiriman Ulang?', 'Apakah anda yakin akan memverifikasi pengiriman ulang ini?', 'Ya, Verifikasi', 'Batal', true)
      if (prompt.isConfirmed) {
        this.$_api.post('nursery/addendum/verify', {
          id: item.id,
          action: 'unverification'
        })
          .then(() => {
            this.$_alert.success('Pengiriman ulang berhasil diverifikasi')
            this.refreshKey += 1
          })
      }
    },
  }
};
</script>