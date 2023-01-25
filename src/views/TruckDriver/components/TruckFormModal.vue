<template>
    <v-dialog v-model="showModal"
            content-class="rounded-xl mx-1"
            max-width="800px"
            scrollable
            persistent
        >
            <v-card>
                <v-card-title class="mb-1 grey darken-3 rounded-xl">
                    <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-truck</v-icon></v-btn> Truck Form</span>
                    <v-icon color="red lighten-1" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <!-- Loading -->
                    <v-overlay absolute :value="loading.show">
                        <div class="d-flex flex-column"></div>
                        <v-progress-circular
                        :size="80"
                        :width="10"
                        indeterminate
                        color="green"
                        >
                        </v-progress-circular>
                        <p class="mt-2 mb-0">{{ loading.text }}</p>
                    </v-overlay>
                    <!-- START: FORM -->
                    <v-row class="mt-0">
                        <!-- Program Year -->
                        <v-col cols="12" sm="12" md="6" lg="4">
                            <v-autocomplete
                                color="success"
                                hide-details
                                item-color="success"
                                item-text="name"
                                item-value="nik"
                                dense
                                v-model="inputs.programYear"
                                :items="$store.state.programYear.options"
                                :disabled="true"
                                :label="'Program Year'"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                            ></v-autocomplete>
                        </v-col>
                        <!-- Nursery-->
                        <v-col cols="12" sm="12" md="6" lg="4">
                            <v-autocomplete
                                color="success"
                                hide-details
                                item-color="success"
                                dense
                                v-model="inputs.nursery.model"
                                :items="inputs.nursery.items"
                                :label="inputs.nursery.label"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                    <div class="pb-2 d-flex align-center mt-4">
                        <p class="mb-0"><v-icon class="mr-2">mdi-truck</v-icon>Vehicle</p>
                        <v-divider class="mx-2"></v-divider>
                    </div>
                    <v-row>
                        <!-- Plate -->
                        <v-col cols="12" sm="12" md="12" lg="4">
                            <v-text-field
                                dense
                                :class="`${inputs.plate.model ? (inputs.plate.exist ? 'red--text' : 'green-text') : ''}`"   
                                :color="`success`"
                                hide-details
                                :label="inputs.plate.label"
                                :loading="inputs.plate.loading"
                                :no-data-text="inputs.plate.loading ? 'Loading...' : 'No Data'"
                                outlined
                                :append-icon="inputs.plate.model ? 'mdi-check' : ''"
                                rounded
                                :rules="[(v) => v.length > 2 || 'Field is required']"
                                v-model="inputs.plate.model"
                                :disabled="id"
                                @change="checkPlateNoExisting"
                                @keyup="checkPlateNoExisting(inputs.plate.model)"
                            ></v-text-field>
                        </v-col>
                        <!-- Type -->
                        <v-col cols="12" sm="12" md="6" lg="4">
                            <v-autocomplete
                                color="success"
                                hide-details
                                item-color="success"
                                item-text="type"
                                return-object
                                dense
                                :items="inputs.type.items"
                                :label="inputs.type.label"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                @change="selectedVehicleType"
                            >
                                <template v-slot:item="data">
                                    <v-list-item-content>
                                    <v-list-item-title v-html="data.item.type"></v-list-item-title>
                                    <v-list-item-subtitle>{{ data.item.capacity }} <small>Seeds</small></v-list-item-subtitle>
                                    </v-list-item-content>
                                </template>
                            </v-autocomplete>
                        </v-col>
                        <!-- Capacity -->
                        <v-col cols="12" sm="12" md="12" lg="4">
                            <v-text-field
                                dense
                                :color="`success`"
                                hide-details
                                :label="inputs.capacity.label"
                                outlined
                                rounded
                                v-model="inputs.capacity.model"
                                disabled
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <div class="pb-2 d-flex align-center mt-4">
                        <p class="mb-0"><v-icon class="mr-2">mdi-chart-timeline</v-icon>Period</p>
                        <v-divider class="mx-2"></v-divider>
                    </div>
                    <v-row>
                        <!-- Status -->
                        <v-col cols="12" sm="12">
                            <v-autocomplete
                                color="success"
                                hide-details
                                item-color="success"
                                dense
                                :items="inputs.status.items"
                                :label="inputs.status.label"
                                v-model="inputs.status.model"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                style="max-width: fit-content;"
                            ></v-autocomplete>
                        </v-col>
                        <!-- Period -->
                        <v-col cols="12" sm="12" md="6" lg="4" v-if="inputs.status.model == 'Monthly'">
                            <v-autocomplete
                                color="success"
                                hide-details
                                item-color="success"
                                item-text="name"
                                return-object
                                dense
                                :items="inputs.status.dateRange"
                                label="Distribution Period"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                outlined
                                rounded
                                @change="selectedDateRange"
                            >
                                <template v-slot:item="data">
                                    <v-list-item-content>
                                    <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                    <v-list-item-subtitle>{{ dateFormat(data.item.date_range.from, 'DD MMMM Y') }} - {{ dateFormat(data.item.date_range.to, 'DD MMMM Y') }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </template>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="6" lg="8" v-if="inputs.status.model == 'Monthly' && inputs.dateDistribution.dateRange">
                            <v-btn readonly rounded color="green white--text">
                                <v-icon class="mr-1">mdi-calendar</v-icon> {{ dateFormat(inputs.dateDistribution.dateRange.from, 'DD MMMM Y') }} - {{ dateFormat(inputs.dateDistribution.dateRange.to, 'DD MMMM Y') }}
                            </v-btn>
                        </v-col>
                        <!-- Select Dates -->
                        <v-col cols="12" md="6" lg="4" class="text-center" v-if="inputs.status.model == 'Daily'">
                            <v-menu v-model="inputs.dateDistribution.datepicker.show" offset-y top transition="slide-x-transition" rounded="xl" :close-on-content-click="false">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                        rounded class=""
                                        color="green white--text"
                                        v-bind="attrs"
                                        v-on="on"
                                        block
                                    >
                                        Select Date
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-overlay :value="inputs.dateDistribution.loading">
                                        <div class="d-flex flex-column align-center justify-center">
                                        <v-progress-circular
                                            indeterminate
                                            color="white"
                                            size="64"
                                        ></v-progress-circular>
                                        <p class="mt-2 mb-0">Updating dates...</p>
                                        </div>
                                    </v-overlay>
                                    <v-date-picker
                                        v-model="inputs.dateDistribution.model"
                                        multiple
                                        min="2022-11-24"
                                        max="2023-01-31"
                                        color="green"
                                        class="rounded-xl"
                                        :key="inputs.dateDistribution.datepicker.key"
                                    ></v-date-picker>
                                </v-card>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" v-if="inputs.status.model == 'Daily' && inputs.dateDistribution.model.length > 0">
                            <p class="mb-0" data-aos="fade-up"><v-icon>mdi-calendar</v-icon> Dates :</p>
                            <v-chip v-for="(item, index) in inputs.dateDistribution.model" :key="index" data-aos="zoom-in" data-aos-delay="200" small color="info" class="mr-1 mt-1">{{ dateFormat(item, 'D MMM Y') }}</v-chip>
                        </v-col>
                    </v-row>
                    <v-row class="ml-0">
                            <v-switch
                                v-model="inputs.isActive"
                                :label="`Status ${inputs.isActive ? 'Active' : 'Nonactive'}`"
                                color="green"
                            ></v-switch>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" outlined rounded class="pr-3 pl-1" small @click="showModal = false"><v-icon class="mr-1">mdi-close-circle</v-icon> Close</v-btn>
                    <v-divider class="mx-2"></v-divider>
                    <v-btn color="green white--text" rounded class="px-3" small><v-icon class="mr-1">mdi-content-save-check</v-icon> Save</v-btn>
                </v-card-actions>
            </v-card>
    </v-dialog>
</template>
<script>
import Moment  from 'moment'
import { extendMoment } from 'moment-range'
import trucksJSON from '@/utils/trucks'
import nurseryJSON from '@/utils/nursery'
import distributionPeriodJSON from '@/utils/distributionPeriod'

const moment = extendMoment(Moment)

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: Number,
            default: 0
        }
    },
    data: () => ({
        inputs: {
            capacity: {
                model: '',
                label: 'Seeds Capacity'
            },
            dateDistribution: {
                datepicker: {
                    show: false,
                    key: 1315432
                },
                label: 'Distribution Date',
                loading: false,
                model: [],
                dateRange: null
            },
            isActive: true,
            nursery: {
                items: nurseryJSON,
                label: 'Nursery',
                model: ''
            },
            plate: {
                exist: false,
                label: 'Licence Plate',
                loading: false,
                model: '',
            },
            programYear: '',
            status: {
                items: ['Monthly', 'Daily'],
                label: 'Status',
                model: '',
                dateRange: distributionPeriodJSON
            },
            type: {
                items: trucksJSON,
                label: 'Vehicle Type',
                model: ''
            },
        },
        loading: {
            show: false,
            text: 'Loading...'
        }
    }),
    watch: {
        'inputs.status.model': {
            handler(val) {
                if (val) {
                    this.inputs.dateDistribution.model = []
                    this.inputs.dateDistribution.dateRange = null
                }
            }
        },
        'inputs.dateDistribution.model': {
            handler(val, oldVal) {
                if (val != oldVal) {
                    this.inputs.dateDistribution.model = val.sort()
                }
            }
        }
    },
    computed: {
        showModal: {
            get: function () {
                if (this.id > 0) {
                    this.getDetailData(this.id)
                }
                
                return this.show
            },
            set: function(newVal) {
                this.$emit('close', {type: 'truck', val: newVal})
            }
        }
    },
    mounted() {
        this.inputs.programYear = this.$store.state.programYear.model
    },
    methods: {
        async getDetailData(id) {
            this.loading.show = true
            setTimeout(() => {
                this.loading.show = false
            }, 2000);
        },
        async selectedDateRange(val) {
            this.inputs.dateDistribution.dateRange = val.date_range
            this.inputs.dateDistribution.model = Array.from(moment.range(moment(val.date_range.from), moment(val.date_range.to)).by('days')).map(m => this.dateFormat(m.toDate(), 'Y-MM-DD'))
        },
        async checkPlateNoExisting(val) {
            // alert(val)
        },
        async selectedVehicleType(val) {
            this.inputs.type.model = val.type
            this.inputs.capacity.model = val.capacity
        },
        // UTILITIES
        dateFormat(date, format) {
            return moment(date).format(format)
        },
    },
}
</script>