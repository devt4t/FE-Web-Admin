<template>
  <geko-base-crud :config="config" :hideCreate="true" :hideUpdate="true" :hideDelete="true">
    <template v-slot:list-created_by="{ item }">
      {{ item.created_by }}
    </template>

    <template v-slot:list-farmer_name="{ item }">
      <div class="min-w-150px">
        <span class="d-block">{{ item.farmer_name }}</span>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              item.farmer_no
            }}</span>
          </template>

          <span>Kode Petani</span>
        </v-tooltip>
      </div>
    </template>
    <template v-slot:detail-farmer_name="{ item }">
      <div class="min-w-150px">
        <span class="d-block">{{ item.farmer_name }}</span>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="text-08-em badge bg-light mt-1">{{
              item.farmer_no
            }}</span>
          </template>

          <span>Kode Petani</span>
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
export default {
  name: "crud-reallocation",
  watch: {},
  data() {
    return {
      config: {
        title: "Pengiriman Ulang",
        program_year: {
          show: false,
          model: "2024",
        },
        model_api: null,
        getter: "nursery/addendum/reallocation/list",
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
            id: "lahan_no",
            label: "Lahan No",
            methods: {
              list: true,
              detail: true,
            },
          },

          {
            id: "farmer_name",
            label: "Nama Petani",
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
            id: "description_reason",
            label: "Keterangan",
            methods: {
              list: true,
              detail: true,
            },
          },
          {
            id: "tree_code",
            label: "Jenis Bibit",
            methods: {
              list: {
                type: 'row-slot'
              },
              detail: {
                type: 'slot',
                view_data: 'tree_code'
              },
            },
          },
          {
            id: "qty_seed",
            label: "Qty Bibit",
            methods: {
              list: {
                type: 'row-slot'
              },
              detail: {
                type: 'slot',
                view_data: 'qty_seed'
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
            id: "rel_created_by",
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
              list: true,
              detail: true,
              filter: false,
            },
          },
        ],
      },
    };
  },
};
</script>