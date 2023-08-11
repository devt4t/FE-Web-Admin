<template>
    <div class="mt-6">
        <exportModal :show="dialog.show" :config="dialog.config" @close="() => dialog.show = false"/>
        <v-container>
            <v-expansion-panels focusable
                    data-aos="fade-up">
                <v-expansion-panel
                    v-for="(conf, confIndex) in configs"
                    :key="`export-section-${confIndex}`"
                    :class="`flat rounded-xl elevation-6 mx-3 pa-1 ${confIndex > 0 ? 'mt-4' : ''}`"
                >
                    <v-expansion-panel-header>
                        {{ confIndex + 1 }}. {{ conf.title }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="pt-4">
                        <v-row>
                            <v-col v-for="(filter, filterIndex) in conf.fields.filter(v => v.filter)" :key="`filter-input-${confIndex}-${filterIndex}`" :cols="filter.col || 'auto'">
                                <p><v-icon>{{ filter.icon }}</v-icon> {{ filter.label }}</p>
                                <!-- inline-date-picker -->
                                <div
                                    v-if="filter.type == 'inline-date-picker'"
                                >
                                    <v-date-picker
                                        color="green lighten-1 rounded-xl"
                                        v-model="filter.model"
                                    ></v-date-picker>
                                </div>
                                <!-- select -->
                                <div v-if="filter.type == 'select'">
                                    <v-select
                                        dense
                                        color="success"
                                        item-color="success"
                                        :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition'}"
                                        hide-details
                                        rounded
                                        v-model="filter.model"
                                        :items="$store.state.programYear.options"
                                        label="Tahun Program"
                                        outlined
                                        class="mt-2 mr-1"
                                    ></v-select>
                                </div>
                            </v-col>
                        </v-row>
                        <div :key="`footer-export-${confIndex}-${disabledExportBtn(conf.fields)}`" class="mt-4">
                            <v-btn 
                                data-aos="zoom-in" 
                                data-aos-offset="-9999999" 
                                data-aos-duration="300" 
                                rounded block 
                                color="green white--text" 
                                :disabled="disabledExportBtn(conf.fields)" 
                                @click="submitExport(conf)"
                            >
                                Export
                            </v-btn>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-container>
    </div>
</template>

<script>
import exportModal from "./components/export.vue";
export default {
    name: 'OldGekoReportData',
    components: {
        exportModal
    },
    data: () =>  ({
        configs: [
            // data petani (per-petani)
            {
                title: 'Export Per-Petani',
                section: 'farmer',
                fields: [
                    {
                        col: 12,
                        id: 'program_year',
                        icon: 'mdi-ticket',
                        label: 'Tahun Program',
                        type: 'select',
                        model: '',
                        filter: true,
                    },
                    {
                        id: 'start_date',
                        icon: 'mdi-calendar',
                        label: 'Awal Periode',
                        type: 'inline-date-picker',
                        model: '',
                        filter: true
                    },
                    {
                        id: 'end_date',
                        icon: 'mdi-calendar',
                        label: 'Akhir Periode',
                        type: 'inline-date-picker',
                        model: '',
                        filter: true
                    },
                    {
                        id: 'mu_name',
                        icon: 'mdi-calendar',
                        label: 'MU',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'um_name',
                        icon: 'mdi-calendar',
                        label: 'UM',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'ta_name',
                        icon: 'mdi-calendar',
                        label: 'TA',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'fc_name',
                        icon: 'mdi-calendar',
                        label: 'FC',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'ff_name',
                        icon: 'mdi-calendar',
                        label: 'FF',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'village_name',
                        icon: 'mdi-calendar',
                        label: 'Desa',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'farmer_name',
                        icon: 'mdi-calendar',
                        label: 'Petani',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'farmer_status',
                        icon: 'mdi-calendar',
                        label: 'Status Petani',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'seeds_name',
                        icon: 'mdi-calendar',
                        label: 'Jenis Bibit',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'total_wood',
                        icon: 'mdi-calendar',
                        label: 'Kayu',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'total_mpts',
                        icon: 'mdi-calendar',
                        label: 'Mpts',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'total_wood_mpts',
                        icon: 'mdi-calendar',
                        label: 'Total',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'land_status',
                        icon: 'mdi-calendar',
                        label: 'Status Lahan',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                ]
            },
            // data lahan dengan sppt
            {
                title: 'Export Lahan Memiliki SPPT',
                section: 'land-sppt',
                fields: [
                    {
                        col: 12,
                        id: 'program_year',
                        icon: 'mdi-ticket',
                        label: 'Tahun Program',
                        type: 'select',
                        model: '',
                        filter: true,
                    },
                    {
                        id: 'mu_name',
                        icon: 'mdi-calendar',
                        label: 'MU',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'um_name',
                        icon: 'mdi-calendar',
                        label: 'UM',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'ta_name',
                        icon: 'mdi-calendar',
                        label: 'TA',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'fc_name',
                        icon: 'mdi-calendar',
                        label: 'FC',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'ff_name',
                        icon: 'mdi-calendar',
                        label: 'FF',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'village_name',
                        icon: 'mdi-calendar',
                        label: 'Desa',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'farmer_name',
                        icon: 'mdi-calendar',
                        label: 'Petani',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'lahan_no',
                        icon: 'mdi-calendar',
                        label: 'Kode Lahan',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'document_no',
                        icon: 'mdi-calendar',
                        label: 'Nomor Dokumen',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'land_status',
                        icon: 'mdi-calendar',
                        label: 'Status Lahan',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                ]
            },
            // data lahan dengan jenis dan jumlah bibit
            {
                title: 'Export Jenis dan Jumlah Bibit Lahan',
                section: 'land-seeds',
                fields: [
                    {
                        col: 12,
                        id: 'program_year',
                        icon: 'mdi-ticket',
                        label: 'Tahun Program',
                        type: 'select',
                        model: '',
                        filter: true,
                    },
                    {
                        id: 'start_date',
                        icon: 'mdi-calendar',
                        label: 'Awal Periode',
                        type: 'inline-date-picker',
                        model: '',
                        filter: true
                    },
                    {
                        id: 'end_date',
                        icon: 'mdi-calendar',
                        label: 'Akhir Periode',
                        type: 'inline-date-picker',
                        model: '',
                        filter: true
                    },
                    {
                        id: 'mu_name',
                        icon: 'mdi-calendar',
                        label: 'MU',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'um_name',
                        icon: 'mdi-calendar',
                        label: 'UM',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'ta_name',
                        icon: 'mdi-calendar',
                        label: 'TA',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'fc_name',
                        icon: 'mdi-calendar',
                        label: 'FC',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'ff_name',
                        icon: 'mdi-calendar',
                        label: 'FF',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'village_name',
                        icon: 'mdi-calendar',
                        label: 'Desa',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'farmer_name',
                        icon: 'mdi-calendar',
                        label: 'Petani',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'lahan_no',
                        icon: 'mdi-calendar',
                        label: 'Kode Lahan',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'document_no',
                        icon: 'mdi-calendar',
                        label: 'Nomor Dokumen',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'land_status',
                        icon: 'mdi-calendar',
                        label: 'Status Lahan',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'pohon_kayu',
                        icon: 'mdi-calendar',
                        label: 'Jml Kayu',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'pohon_mpts',
                        icon: 'mdi-calendar',
                        label: 'Jml MPTS',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                    {
                        id: 'pohon_kayu_mpts',
                        icon: 'mdi-calendar',
                        label: 'Jml Total',
                        type: 'text',
                        model: '',
                        filter: false,
                        list: true,
                    },
                ]
            },
        ],
        dialog: {
            show: false,
            config: {}
        }
    }),

    mounted() {
        
    },

    methods: {
        disabledExportBtn(fields) {
            let disabled = false
            fields.map(val => {
                if (val.filter) if (!val.model) disabled = true
            })
            return disabled
        },
        submitExport(config) {
            this.dialog.config = config
            this.dialog.show = true
        }
    },
};
</script>