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
                        color="white"
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
                                v-model="inputs.program_year.model"
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
                        <p class="mb-0"><v-icon class="mr-2">mdi-car-pickup</v-icon>Vehicle</p>
                        <v-divider class="mx-2"></v-divider>
                    </div>
                    <v-row>
                        <!-- Licence Plate -->
                        <v-col cols="12" sm="12" md="12" lg="12" v-if="!id">
                            <v-alert :value="inputs.plat_no.exist" type="error" class="rounded-xl" dense dismissible transition="scale-transition">
                                The Plat Number has already been taken.
                            </v-alert>
                            <v-alert v-if="inputs.plat_no.model && inputs.plat_no.exist == false && checkPlate.loading == false && checkPlate.checked == true" type="success" class="rounded-xl" dense dismissible data-aos="zoom-in" data-aos-duration="100">
                                The Plat Number is available.
                            </v-alert>
                            <v-row class="ma-0">
                                <v-text-field
                                    dense
                                    :color="`success`"
                                    placeholder="H 9999 XX"
                                    hide-details
                                    :label="inputs.plat_no.label"
                                    :loading="checkPlate.loading"
                                    outlined
                                    rounded
                                    :rules="[(v) => !!v || 'Field is required']"
                                    v-model="inputs.plat_no.model"
                                    style="max-width: fit-content;"
                                ></v-text-field>
                                <v-btn small rounded class="ml-2 mt-2" color="info" @click="checkPlateExisting(inputs.plat_no.model)" :disabled="!inputs.plat_no.model" :loading="checkPlate.loading">Check</v-btn>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="12" v-else>
                            <v-row class="justify-center mt-0">
                                <v-chip v-if="id" color="grey darken-3 white--text" class="rounded-lg" data-aos="fade-down">{{ id }}</v-chip>
                            </v-row>
                        </v-col>
                        <!-- Type -->
                        <v-col cols="12" sm="12" md="6" lg="6">
                            <v-autocomplete
                                color="success"
                                hide-details
                                item-color="success"
                                item-text="type"
                                item-value="name"
                                return-object
                                dense
                                :items="inputs.type.items"
                                :label="inputs.type.label"
                                v-model="inputs.type.model"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                @change="selectedVehicleType"
                            >
                                <template v-slot:item="data">
                                    <v-list-item-content>
                                    <v-list-item-title v-html="data.item.type"></v-list-item-title>
                                    <v-list-item-subtitle>{{ data.item.capacity.min }} - {{ data.item.capacity.max }} <small>Seeds</small></v-list-item-subtitle>
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
                        <p class="mb-0"><v-icon class="mr-2">mdi-chart-timeline</v-icon>Active Dates</p>
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
                                :disabled="id ? true : false"
                            ></v-autocomplete>
                        </v-col>
                        <!-- Period -->
                        <v-col cols="12" v-if="inputs.status.model == 'contract' && inputs.active_date.period.length > 0" class="text-center">
                            <v-btn v-for="(period, pIndex) in inputs.active_date.period" :key="pIndex" readonly rounded color="green white--text" class="mb-2 mr-0 mr-md-2" data-aos="zoom-in" :data-aos-delay="pIndex * 200">
                                <v-icon class="mr-1">mdi-calendar</v-icon><strong class="d-lg-inline d-none">{{ period.name }}:</strong> {{ dateFormat(period.date_range.from, 'DD MMM Y') }} - {{ dateFormat(period.date_range.to, 'DD MMM Y') }}
                            </v-btn>
                        </v-col>
                        <v-col cols="12" v-if="inputs.status.model == 'contract'">
                            <v-select
                                color="success"
                                multiple
                                hide-details
                                item-color="success"
                                item-text="name"
                                return-object
                                dense
                                v-model="inputs.active_date.period"
                                :items="inputs.status.dateRange"
                                label="Distribution Period"
                                :menu-props="{rounded: 'xl',offsetY: true, transition: 'slide-y-transition'}"
                                outlined
                                rounded
                            >
                                <template v-slot:selection="data">
                                    <v-chip
                                        v-bind="data.attrs"
                                        :input-value="data.selected"
                                        color="success"
                                        small
                                        close
                                        data-aos="zoom-in" :data-aos-delay="data.index * 200"
                                        @click="() => {}"
                                        @click:close="spliceDatePeriod(data.item.name)"
                                    >
                                        {{ data.item.name }}
                                    </v-chip>
                                </template>
                                <template v-slot:item="data">
                                    <v-list-item-content>
                                    <v-list-item-title><v-icon>mdi-timeline-clock</v-icon> {{ data.item.name }}</v-list-item-title>
                                    <v-list-item-subtitle><strong>{{ dateFormat(data.item.date_range.from, 'DD MMMM Y') }} - {{ dateFormat(data.item.date_range.to, 'DD MMMM Y') }}</strong></v-list-item-subtitle>
                                    </v-list-item-content>
                                </template>
                            </v-select>
                        </v-col>
                        <!-- Select Dates -->
                        <v-col cols="12" md="6" lg="4" class="text-center" v-if="inputs.status.model == 'ritase'">
                            <v-menu v-model="inputs.active_date.datepicker.show" offset-y top transition="slide-x-transition" rounded="xl" :close-on-content-click="false">
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
                                    <v-overlay :value="inputs.active_date.loading">
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
                                        v-model="inputs.active_date.model"
                                        multiple
                                        min="2022-11-24"
                                        max="2023-01-31"
                                        color="green"
                                        class="rounded-xl"
                                        :key="inputs.active_date.datepicker.key"
                                    ></v-date-picker>
                                </v-card>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" v-if="inputs.status.model == 'ritase' && inputs.active_date.model.length > 0">
                            <p class="mb-0" data-aos="fade-up"><v-icon>mdi-calendar</v-icon> Dates :</p>
                            <v-chip v-for="(item, index) in inputs.active_date.model" :key="index" data-aos="zoom-in" data-aos-delay="200" small color="info" class="mr-1 mt-1">{{ dateFormat(item, 'D MMM Y') }}</v-chip>
                        </v-col>
                    </v-row>
                    <v-row class="ml-0">
                            <v-switch
                                v-model="inputs.is_active.model"
                                :label="`Status ${inputs.is_active.model ? 'Active' : 'Nonactive'}`"
                                color="green"
                            ></v-switch>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" outlined rounded class="pr-3 pl-1" small @click="showModal = false"><v-icon class="mr-1">mdi-close-circle</v-icon> Close</v-btn>
                    <v-divider class="mx-2"></v-divider>
                    <v-dialog
                        v-model="dialog"
                        persistent
                        max-width="400"
                        content-class="rounded-xl"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" color="green white--text" rounded class="px-3" small :disabled="!checkPlate.checked || inputs.plat_no.exist || !inputs.plat_no.model || !inputs.nursery.model || !inputs.type.model || !inputs.status.model"><v-icon class="mr-1">mdi-content-save-check</v-icon> Save</v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="text-h5">
                                <v-spacer></v-spacer>
                                Are u sure?
                                <v-spacer></v-spacer>
                            </v-card-title>
                            <v-card-text class="text-center">
                                Are u sure wanna save this data?
                            </v-card-text>
                            <v-card-actions>
                                <v-btn
                                    color="red"
                                    text
                                    rounded
                                    @click="dialog = false"
                                >
                                    <v-icon class="mr-1">mdi-undo</v-icon>
                                    Back
                                </v-btn>
                                <v-divider class="mx-2"></v-divider>
                                <v-btn
                                    color="green white--text pr-3"
                                    rounded
                                    @click="save(id)"
                                >
                                    <v-icon class="mr-1">mdi-check-circle</v-icon>
                                    Ok, Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-actions>
            </v-card>
    </v-dialog>
</template>
<script>
import Moment  from 'moment'
import axios  from 'axios'
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
            type: String,
            default: 0
        }
    },
    data: () => ({
        checkPlate: {
            checked: false,
            loading: false
        },
        dialog: false,
        inputs: {
            capacity: {
                model: '',
                label: 'Seeds Capacity'
            },
            min_capacity: {model: 0},
            max_capacity: {model: 0},
            active_date: {
                datepicker: {
                    show: false,
                    key: 1315432
                },
                label: 'Distribution Date',
                loading: false,
                model: [],
                dateRange: [],
                period: []
            },
            is_active: {model: true},
            nursery: {
                items: nurseryJSON,
                label: 'Nursery',
                model: ''
            },
            plat_no: {
                exist: false,
                label: 'Licence Plate',
                loading: false,
                model: '',
            },
            program_year: {
                model: ''
            },
            status: {
                items: [{text: 'Monthly ( Contract )', value: 'contract'}, {text: 'Daily ( Ritase )', value: 'ritase'}],
                label: 'Status',
                model: '',
                dateRange: []
            },
            type: {
                items: trucksJSON,
                label: 'Vehicle Type',
                model: ''
            },
            user_id: {
                model: JSON.parse(localStorage.getItem('User')).email
            }
        },
        JSON: {
            distributionPeriodJSON
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
                    this.inputs.active_date.model = []
                    this.inputs.active_date.dateRange = []
                }
            }
        },
        'inputs.active_date.period': {
            async handler(val, oldVal) {
                try {
                    if (val != oldVal) {
                        // alert('changed!')
                        this.inputs.active_date.period = val
                        let dateRange = []
                        await val.forEach(period => {
                            dateRange.push(period.date_range)
                        })
                        this.inputs.active_date.dateRange = dateRange
                        this.inputs.active_date.model = []
                        await dateRange.forEach(range => {
                            this.inputs.active_date.model.push(...Array.from(moment.range(moment(range.from), moment(range.to)).by('days')).map(m => this.dateFormat(m.toDate(), 'Y-MM-DD')))
                        })
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        },
        'inputs.active_date.model': {
            handler(val, oldVal) {
                if (val != oldVal) {
                    this.inputs.active_date.model = val.sort()
                }
            }
        },
        'inputs.plat_no.model': {
            handler(val) {
                if (!this.id) this.checkPlate.checked = false
                this.inputs.plat_no.model = val.toUpperCase()
            }
        },
    },
    computed: {
        showModal: {
            get: function () {
                if (this.id) {
                    this.getDetailData(this.id)
                    this.checkPlate.checked = true
                }
                
                return this.show
            },
            set: function(newVal) {
                this.manageData('reset')
                this.$emit('close', {type: 'truck', val: newVal})
            }
        }
    },
    mounted() {
        this.inputs.program_year.model = this.$store.state.programYear.model

        // set distribution period JSON
        this.inputs.status.dateRange = this.JSON.distributionPeriodJSON.find(val => val.program_year === this.inputs.program_year.model).items
    },
    methods: {
        async getDetailData(id) {
            try {
                this.loading.show = true
                const res = await axios.get(`${this.$store.getters.getApiUrl('GetDetailTruck')}?plat_no=${id}`, this.$store.state.apiConfig)
                await this.manageData('set', res.data.data.result)
            } catch (err) {
                if (err.response != undefined) {
                    console.log(err.response.data.data.result)
                    this.forceLogout(err.response)
                } else console.error(err)
            } finally {
                this.loading.show = false
            }
        },
        async checkPlateExisting(val) {
            this.inputs.plat_no.exist = false
            this.checkPlate.checked = false
            this.checkPlate.loading = true
            await axios.get(`${this.$store.getters.getApiUrl('GetDetailTruck')}?plat_no=${val}`, this.$store.state.apiConfig)
                .then(() => {
                    this.inputs.plat_no.exist = true
                }).catch((err) => {
                    const plateNumberRegex = /^([A-Z]{1,2}[ ]\d{1,4}[ ]{1}[A-Z]{1,3})$/
                    // console.log(plateNumberRegex.test(val))
                    if (plateNumberRegex.test(val)) {
                        this.inputs.plat_no.exist = false
                        this.checkPlate.checked = true
                    } else {
                        alert('Licence plate invalid!')
                    }
                    
                    this.forceLogout(err)
                }).finally(() => {
                    this.checkPlate.loading = false
                })
        },
        async save(id = null) {
            try {
                this.dialog = false
                this.$emit('close', {type: 'truck', val: false})

                this.$store.state.loadingOverlayText = 'Saving data...'
                this.$store.state.loadingOverlay = true
                
                let sendData = {}
                for (const [key, value] of Object.entries(this.inputs)) {
                    if (key != 'capacity') {
                        if (value.model) {
                            if (key == 'active_date') sendData[key] = await value.model.toString() 
                            else sendData[key] = await value.model 
                        } else if (key == 'is_active') sendData[key] = await 0
                    }
                }
                console.log(sendData)
                // console.log(id)
                let type = 'AddTruck'
                if (id) type = 'UpdateTruck'
                await axios.post(`${this.$store.getters.getApiUrl(type)}`, sendData, this.$store.state.apiConfig)
                await this.$emit('snackbar', {color: 'green', text: 'Saving truck data success!'})
                await this.$emit('refreshTable')
                this.manageData('reset')
            } catch (err) {
                await this.$emit('snackbar', {color: 'red', text: err})
                if (err.response != undefined) {
                    console.log(err.response.data.data.result)
                    this.forceLogout(err.response)
                } else console.error(err)
            } finally {
                this.$store.state.loadingOverlay = false
                this.$store.state.loadingOverlayText = null
            }
        },
        async selectedVehicleType(val) {
            this.inputs.type.model = val.name
            this.inputs.capacity.model = val.capacity.min + ' - ' + val.capacity.max + ' bibit'
            this.inputs.min_capacity.model = val.capacity.min
            this.inputs.max_capacity.model = val.capacity.max
        },
        // UTILITIES
        dateFormat(date, format) {
            return moment(date).format(format)
        },
        forceLogout(response) {
            if (response.status == 401) {
                localStorage.removeItem("token")
                this.$router.push("/")
            }
        },
        async manageData(type, data = null) {
            if (type == 'dummy') {
            } else if (type == 'reset') {
                this.inputs.capacity.model = ''
                this.inputs.min_capacity.model = 0
                this.inputs.max_capacity.model = 0
                this.inputs.active_date.model = []
                this.inputs.active_date.dateRange = []
                this.inputs.active_date.period = []
                this.inputs.is_active.model = true
                this.inputs.nursery.model = ''
                this.inputs.plat_no.model = ''
                this.inputs.program_year.model = this.$store.state.programYear.model
                this.inputs.status.model = ''
                this.inputs.type.model = ''
            } else if (type == 'set' && data) {
                this.inputs.min_capacity.model = data.min_capacity
                this.inputs.max_capacity.model = data.max_capacity
                this.inputs.capacity.model = data.min_capacity + ' - ' + data.max_capacity + ' bibit'
                this.inputs.is_active.model = data.is_active
                this.inputs.nursery.model = data.nursery
                this.inputs.plat_no.model = data.plat_no
                this.inputs.program_year.model = data.program_year
                this.inputs.status.model = data.status
                this.inputs.type.model = data.type

                if (data.status == 'contract') {
                    let periods = []
                    await this.inputs.status.dateRange.forEach(range => {
                        if (data.active_date.includes(range.date_range.from) && data.active_date.includes(range.date_range.to)) {
                            periods.push(range)
                        }
                    })
                    this.inputs.active_date.period = periods
                } else if (data.status == 'ritase') {
                    this.inputs.active_date.model = await data.active_date.split(",")
                }
            }
        },
        async spliceDatePeriod(name) {
            var periods = this.inputs.active_date.period
            this.inputs.active_date.period = []
            // console.log(name)
            await periods.splice(periods.findIndex(val => val.name == name), 1)
            this.inputs.active_date.period = periods
        }
    },
}
</script>