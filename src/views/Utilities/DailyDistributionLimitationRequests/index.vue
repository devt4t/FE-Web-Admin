<template>
  <geko-base-crud 
    :config="config" 
    :hideDelete="false"
    :hideUpdate="false"
  > 
    <template v-slot:create-form>
        <create />
    </template>

    <template v-slot:list-nursery_locations_id="{ item }">
      {{ $store.state.nurseries.find(n => n.id === item.nursery_locations_id)?.name || '-' }}
    </template>

    <template v-slot:list-wood_limitation="{ item }">
        <span class="badge bg-primary">
            <v-icon size="small">mdi-seed</v-icon> &nbsp;{{ item.wood_limitation }}
        </span>
    </template>

    <template v-slot:list-mpts_limitation="{ item }">
        <span class="badge bg-primary">
            <v-icon size="small">mdi-seed</v-icon> &nbsp;{{ item.mpts_limitation }}
        </span>
    </template>

    <template v-slot:list-total_limitation="{ item }">
        <span class="badge bg-warning">
            <v-icon size="small">mdi-seed</v-icon> &nbsp;
            {{ Number(item.wood_limitation) + Number(item.mpts_limitation) }}
        </span>
    </template>

    <template v-slot:list-program_year="{ item }">
        <span class="badge bg-info">
            {{ item.program_year }}
        </span>
    </template>

    <template v-slot:list-start_distribution_time="{ item }">
        <span class="badge bg-info">
            {{ item.start_distribution_time | parse('date') }}
        </span>
    </template>

    <template v-slot:list-end_distribution_time="{ item }">
        <span class="badge bg-info">
            {{ item.end_distribution_time | parse('date') }}
        </span>
    </template>
    

    <template v-slot:detail-nursery_locations_id="{ item }">
      {{ $store.state.nurseries.find(n => n.id === item.nursery_locations_id)?.name || '-' }}
    </template>

    <template v-slot:detail-wood_limitation="{ item }">
        <span class="badge bg-primary">
            <v-icon size="small">mdi-seed</v-icon> &nbsp;{{ item.wood_limitation }}
        </span>
    </template>

    <template v-slot:detail-mpts_limitation="{ item }">
        <span class="badge bg-primary">
            <v-icon size="small">mdi-seed</v-icon> &nbsp;{{ item.mpts_limitation }}
        </span>
    </template>

    <template v-slot:detail-total_limitation="{ item }">
        <span class="badge bg-warning">
            <v-icon size="small">mdi-seed</v-icon> &nbsp;
            {{ Number(item.wood_limitation) + Number(item.mpts_limitation) }}
        </span>
    </template>

    <template v-slot:detail-program_year="{ item }">
        <span class="badge bg-info">
            {{ item.program_year }}
        </span>
    </template>

    <template v-slot:detail-start_distribution_time="{ item }">
        <span class="badge bg-info">
            {{ item.start_distribution_time | parse('date') }}
        </span>
    </template>

    <template v-slot:detail-end_distribution_time="{ item }">
        <span class="badge bg-info">
            {{ item.end_distribution_time | parse('date') }}
        </span>
    </template>

  </geko-base-crud>
</template>

<script>
import Create from './create.vue';

export default {
  name: "crud-daily-distribution-limit",
  components: { Create },
  watch: {},
  data() {
    return {
      config: {
        title: "Permintaan Limitasi Distribusi Harian",
        program_year: {
          show: false,
          model: "2024",
        },
        model_api: null,
        getter: "sostam/calendar/daily-distribution-limit/list",
        setter: "",
        setter_ext_payload: {
          project_modul: "type",
        },
        update: "",
        update_ext_payload: {
          project_modul: "type",
        },
        delete: "sostam/calendar/daily-distribution-limit/delete",
        delete_ext_payload: {
          delete_type: "hard_delete"
        },
        deleteKey: "id",
        pk_field: null,
        filter_api: {
          project_modul: "type",
        },
        permission: {
          create: "sosialisasi-tanam-create",
          read: "sosialisasi-tanam-list",
          update: "sosialisasi-tanam-update",
          detail: "sosialisasi-tanam-detail",
          lookup: "sosialisasi-tanam-lookup",
          delete: "sosialisasi-tanam-delete",
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
            id: "code",
            label: "Kode",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "name",
            label: "Nama",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"], setter: "new_name" },
              filter: false,
            },
          },

          
          {
            id: "managementunits_name",
            label: "Management Unit",
            methods: {
              list: true,
              detail: true,
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "wood_limitation",
            label: "Limitasi Kayu",
            methods: {
              list: {
                type:'row-slot'
              },
              detail: {
                type:'slot',
              },
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "mpts_limitation",
            label: "Limitasi MPTS",
            methods: {
              list: {
                type:'row-slot'
              },
              detail: {
                type:'slot',
              },
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "total_limitation",
            label: "Total Limitasi Bibit",
            methods: {
              list: {
                type:'row-slot'
              },
              detail: {
                type:'slot',
              },
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          
          {
            id: "program_year",
            label: "Tahun Program",
            methods: {
              list: {
                type:'row-slot'
              },
              detail: {
                type:'slot',
              },
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "nursery_locations_id",
            label: "Lokasi Persemaian",
            methods: {
              list: {
                type:'row-slot'
              },
              detail: {
                type:'slot'
              },
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          
          {
            id: "start_distribution_time",
            label: "Waktu Mulai Distribusi",
            methods: {
              list: {
                type:'row-slot'
              },
              detail: {
                type:'slot'
              },
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "end_distribution_time",
            label: "Waktu Selesai Distribusi",
            methods: {
              list: {
                type:'row-slot'
              },
              detail: {
                type:'slot'
              },
              create: { validation: ["required"] },
              update: { validation: ["required"] },
              filter: false,
            },
          },

        ],
      },
    };
  },
};
</script>
