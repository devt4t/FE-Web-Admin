<template>
    <div class="mt-6">
        <exportModal :show="dialog.show" :config="dialog.config" @close="() => dialog.show = false"/>
        <v-container>
            <v-expansion-panels focusable
                    data-aos="fade-up"
                    v-model="expansion.model"
            >
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
                                <!-- select-program-year -->
                                <div v-if="filter.type == 'select-program-year'">
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
                                        v-on:change="getMUbyPy()"
                                        outlined
                                        class="mt-2 mr-1"
                                    ></v-select>
                                </div>
                                <!-- select -->
                                <div v-if="filter.type == 'select'">
                                    <v-autocomplete
                                        dense
                                        color="success"
                                        item-color="success"
                                        :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition'}"
                                        hide-details
                                        rounded
                                        v-model="filter.model"
                                        :items="filter.items"
                                        :label="filter.label"
                                        outlined
                                        class="mt-2 mr-1"
                                    ></v-autocomplete>
                                </div>
                                <div v-if="filter.type == 'special-select'">
                                    <v-autocomplete
                                        dense
                                        color="success"
                                        item-color="success"
                                        :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition'}"
                                        hide-details
                                        rounded
                                        v-model="filter.model"
                                        :items="filter.items"
                                        :label="filter.label"
                                        v-on:change="getTargetArea()"
                                        outlined
                                        class="mt-2 mr-1"
                                    ></v-autocomplete>
                                </div>

                                <!-- multi-select -->
                                <div v-if="filter.type == 'multi-select'">
                                    <v-autocomplete
                                        color="success"
                                        item-color="success"
                                        item-text="value"
                                        item-value="value"
                                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                        outlined
                                        rounded
                                        hide-details
                                        chips
                                        multiple
                                        v-model="filter.model"
                                        :items="filter.items"
                                        :label="filter.label"
                                    >
                                        <template v-slot:selection="data">
                                            <v-chip
                                                v-bind="data.attrs"
                                                :input-value="data.selected"
                                                color="success"
                                                close
                                                @click="data.select"
                                                @click:close="filter.model.splice(data.index, 1)"
                                            >
                                                {{ data.item }}
                                            </v-chip>
                                        </template>
                                    </v-autocomplete>
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
import axios from 'axios';
import exportModal from "./components/export.vue";

import petaniFields from "./components/js/fields-per-petani"
import lahanSPPTFields from "./components/js/fields-lahan-sppt"
import lahanBibitFields from "./components/js/fields-lahan-bibit"
import lahanFields from "./components/js/fields-lahan"
import sostamFields from "./components/js/fields-sostam-bibit"
import monitoringFields from "./components/js/fields-monitoring"
import monitoring2Fields from "./components/js/fields-monitoring2"
import monitoring3Fields from "./components/js/fields-monitoring3"

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
                fields: petaniFields
            },
            // data lahan dengan sppt
            {
                title: 'Export Lahan Memiliki SPPT',
                section: 'land-sppt',
                fields: lahanSPPTFields
            },
            // data lahan dengan jenis dan jumlah bibit
            {
                title: 'Export Jenis dan Jumlah Bibit Lahan',
                section: 'land-seeds',
                fields: lahanBibitFields
            },
            // data lahan lengkap tanpa jumlah bibit
            {
                title: 'Export Lahan Lengkap tanpa Jenis dan Jumlah Bibit',
                section: 'land-complete-without-seeds',
                fields: lahanFields
            },
            // Sostam
            {
                title: 'Export Sosialisasi Tanam Dengan Detail Bibit',
                section: 'sostam-complete-with-seed',
                fields: sostamFields
            },
            // Monitoring 1, 2 & 3
            {
                title: 'Export Monitoring 1',
                section: 'export-monitoring',
                fields: monitoringFields
            },
            {
                title: 'Export Monitoring 2',
                section: 'export-monitoring2',
                fields: monitoring2Fields
            },
            {
                title: 'Export Monitoring 3',
                section: 'export-monitoring3',
                fields: monitoring3Fields
            },
        ],
        dialog: {
            show: false,
            config: {}
        },
        expansion: {
            model: 0
        }
    }),

    watch: {
        'expansion.model': {
            async handler(val) {
                // lahan lengkap
                if (val == 3) {
                    // get lahan fields
                    await this.getLahanFields()
                } 
                // monitoring
                if (val == 4) {
                    // await this.getMUbyPy()
                    // await this.getTargetArea()
                }
            }
        }
    },

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
        async getLahanFields() {
            try {
                this.$store.state.loadingOverlay = true
                this.$store.state.loadingOverlayText = 'Mengambil daftar kolom lahan...'
                this.configs[3].fields.find(v => v.id == 'show_fields').items = await axios.get(
                    `TempGetLahanFields`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.$store.state.token}`
                        }
                    }
                ).then(res => {
                    return res.data.map(val => {
                        const existField = this.configs[3].fields.find(v => v.id == val.Field)
                        if (!existField) {
                            return val.Field
                        }
                    }).filter(v => v)
                })
            } catch (err) {
                console.log(err)
            } finally {
                this.$store.state.loadingOverlay = false
                this.$store.state.loadingOverlayText = 'Loading...'
            }
            
        },
        async getMUbyPy(){
            try {
                this.$store.state.loadingOverlay = true
                this.$store.state.loadingOverlayText = 'Mengambil daftar Managemet Unit...'
                var py = this.configs[this.expansion.model].fields.find(v => v.id == 'program_year').model
                let managementUnits = await axios.get(
                    this.$store.getters.getApiUrl(`GetManagementUnitAdmin?program_year=${py}`),
                    this.$store.state.apiConfig
                ).then(res => res.data.data.result)
                managementUnits = managementUnits.map(v => {
                    return {
                        text: v.name,
                        value: v.mu_no
                    }
                })

                this.configs[this.expansion.model].fields.find(v => v.id == 'mu_name').items = managementUnits
            } catch (err) {
                console.log(err)
            } finally {
                this.$store.state.loadingOverlay = false
                this.$store.state.loadingOverlayText = 'Loading...'
            }
        },
        async getTargetArea() {
            try {
                this.$store.state.loadingOverlay = true
                this.$store.state.loadingOverlayText = 'Mengambil daftar Target Area...'
                var py = this.configs[this.expansion.model].fields.find(v => v.id == 'program_year').model
                var mu_no = this.configs[this.expansion.model].fields.find(v => v.id == 'mu_name').model
                let targetAreas = await axios.get(
                    this.$store.getters.getApiUrl(`GetTargetArea?program_year=${py}&mu_no=${mu_no}`),
                    this.$store.state.apiConfig
                ).then(res => res.data.data.result)
                targetAreas = targetAreas.map(v => {
                    return {
                        text: v.name,
                        value: v.area_code
                    }
                })

                this.configs[this.expansion.model].fields.find(v => v.id == 'ta_name').items = targetAreas
            } catch (err) {
                console.log(err)
            } finally {
                this.$store.state.loadingOverlay = false
                this.$store.state.loadingOverlayText = 'Loading...'
            }
            
        },
        submitExport(config) {
            this.dialog.config = config
            this.dialog.show = true
        }
    },
};
</script>