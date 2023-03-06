<template>
    <v-dialog
        v-model="showDialog" 
        max-width="1000"
        content-class="rounded-xl"
        scrollable
    >
        <v-card>
            <v-card-title class="orange white--text rounded-xl">
                <p class="mb-0"><v-icon color="white">mdi-comment-text</v-icon> Form Request</p>
                <v-divider color="white" class="mx-2"></v-divider>
                <v-icon color="white" @click="() => showDialog = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text>
                <v-row class="mt-2">
                    <!-- Program Year -->
                    <v-col cols="12" sm="12" md="6" lg="3">
                        <v-autocomplete
                            color="success"
                            dense
                            hide-details
                            item-color="success"
                            :items="$store.state.programYear.options"
                            :label="inputs.programYear.label"
                            :loading="inputs.programYear.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.programYear.loading ? 'Loading...' : 'No Data'"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.programYear.model"
                            disabled
                        ></v-autocomplete>
                    </v-col>
                    <!-- Nursery -->
                    <v-col cols="12" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            item-color="success"
                            outlined
                            hide-details
                            :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                            rounded
                            label="Nursery"
                            class=""
                            :items="inputs.nursery.items"
                            v-model="inputs.nursery.model"
                        ></v-autocomplete>
                    </v-col>
                    <!-- Distribution Date -->
                    <v-col cols="12" lg="4" class="">
                        <v-menu v-model="inputs.distributionDate.datepicker.show" offset-x transition="slide-x-transition" rounded="xl">
                            <template v-slot:activator="{ on, attrs }">
                                <p class="mb-0"><strong>{{ inputs.distributionDate.label }}</strong></p>
                                <v-btn 
                                    rounded class=""
                                    color="green white--text"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    {{ $store.getters.dateFormat(inputs.distributionDate.model, 'ddd, DD MMMM Y') }}
                                </v-btn>
                            </template>
                            <div>
                                <v-overlay :value="inputs.distributionDate.loading">
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
                                    v-model="inputs.distributionDate.model"
                                    min="2022-11-24"
                                    @input="() => {inputs.distributionDate.datepicker.show = false}"
                                    color="green"
                                    class="rounded-xl"
                                    :key="inputs.distributionDate.datepicker.key"
                                ></v-date-picker>
                            </div>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row class="mt-2">
                    <!-- Management Unit -->
                    <v-col cols="12" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            item-color="success"
                            outlined
                            hide-details
                            :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                            rounded
                            class=""
                            label="Management Unit"
                            :loading="inputs.mu.loading"
                            :items="inputs.mu.items"
                            item-text="name"
                            item-value="mu_no"
                            v-model="inputs.mu.model"
                            :disabled="disabledInputMU"
                            @change="($event) => getFF($event)"
                        ></v-autocomplete>
                    </v-col>
                    <!-- FF -->
                    <v-col cols="12" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            item-color="success"
                            outlined
                            hide-details
                            :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                            rounded
                            class=""
                            label="Field Facilitator"
                            :loading="inputs.ff.loading"
                            :items="inputs.ff.items"
                            item-text="ff_name"
                            item-value="ff_no"
                            v-model="inputs.ff.model"
                            :disabled="disabledInputFF"
                            @change="($event) => getFarmer($event)"
                        ></v-autocomplete>
                    </v-col>
                    <!-- Farmer -->
                    <v-col cols="12" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            item-color="success"
                            outlined
                            hide-details
                            :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                            rounded
                            class=""
                            label="Farmer"
                            :loading="inputs.farmer.loading"
                            :items="inputs.farmer.items"
                            item-text="farmer_name"
                            item-value="farmer_no"
                            v-model="inputs.farmer.model"
                            :disabled="disabledInputFarmer"
                            @change="($event) => getLand($event)"
                        ></v-autocomplete>
                    </v-col>
                    <!-- Lahan No -->
                    <v-col cols="12" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            item-color="success"
                            outlined
                            hide-details
                            :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                            rounded
                            class=""
                            label="Land"
                            item-text="lahan_no"
                            item-value="lahan_no"
                            :loading="inputs.land.loading"
                            :items="inputs.land.items"
                            v-model="inputs.land.model"
                            :disabled="disabledInputLand"
                        >
                            <template v-slot:item="data">
                                <v-list-item-content>
                                    <v-list-item-title>{{ data.item.lahan_no }}</v-list-item-title>
                                    <v-list-item-subtitle v-if="data.item.bibit_penlub == 0">Bibit Sostam: {{ data.item.bibit_sostam }}</v-list-item-subtitle>
                                    <v-list-item-subtitle v-else>Bibit PenLub: {{ data.item.bibit_penlub }} <v-chip v-if="data.item.is_printed === 1" x-small class="ml-2 pl-2" color="red white--text"><v-icon small class="mr-1">mdi-printer</v-icon>Printed</v-chip></v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-autocomplete>
                        <v-alert :type="alert.type" border="top" dense class="rounded-xl mt-2 mb-0">{{ alert.message }}</v-alert>
                    </v-col>
                    <!-- Notes -->
                    <v-col cols="12" lg="8">
                        <v-textarea rounded outlined dense hide-details color="green" :label="inputs.notes.label" v-model="inputs.notes.model" rows="3" prepend-icon="mdi-note-edit"></v-textarea>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        alert: {
            type: 'info',
            message: 'Select Nursery',
        },
        inputs: {
            programYear: {
                label: 'Program Year',
                model: null,
                loading: false
            },
            nursery: {
                model: '',
                items: ['Arjasari','Ciminyak','Kebumen','Pati']
            },
            distributionDate: {
                datepicker: {
                    show: false,
                    key: 1315432
                },
                label: 'Distribution Date',
                loading: false,
                model: ''
            },
            mu: {
                items: [],
                model: '',
                loading: false
            },
            ff: {
                items: [],
                model: '',
                loading: false
            },
            farmer: {
                items: [],
                model: '',
                loading: false
            },
            land: {
                items: [],
                model: '',
                loading: false
            },
            notes: {
                label: 'Notes',
                model: ''
            }
        },
        settings: {
            prefixUrl: 'SeedlingChangeRequest/',
        }
    }),
    watch: {
        'inputs.nursery.model': {
            async handler(val) {
                if (val && this.inputs.distributionDate.model) {
                    await this.getMU()
                }
            }
        },
        'inputs.distributionDate.model': {
            async handler(val) {
                if (val && this.inputs.distributionDate.model) {
                    await this.getMU()
                }
            }
        }
    },
    computed: {
        showDialog: {
            get: function () {
                this.initialize()
                return this.show
            },
            set: function (val) {
                if (val == false) {
                    this.$emit('close', 'create')
                } else {
                    this.resetData()
                }
            }
        },
        disabledInputMU() {
            let status = false
            if (!this.inputs.nursery.model || !this.inputs.distributionDate.model) status = true
            return status
        },
        disabledInputFF() {
            let status = false
            if (!this.inputs.nursery.model || !this.inputs.distributionDate.model) status = true
            if (!this.inputs.mu.model) status = true
            return status
        },
        disabledInputFarmer() {
            let status = false
            if (!this.inputs.nursery.model || !this.inputs.distributionDate.model) status = true
            if (!this.inputs.mu.model) status = true
            if (!this.inputs.ff.model) status = true
            return status
        },
        disabledInputLand() {
            let status = false
            if (!this.inputs.nursery.model || !this.inputs.distributionDate.model) status = true
            if (!this.inputs.mu.model) status = true
            if (!this.inputs.ff.model) status = true
            if (!this.inputs.farmer.model) status = true
            return status
        },
    },
    methods: {
        async initialize() {
            this.inputs.programYear.model = this.$store.state.programYear.model
            this.inputs.nursery.model = 'Kebumen'
            this.alert.message = 'Select Distribution Date'
            this.inputs.distributionDate.model = '2022-12-01'
            this.alert.message = 'Select Management Unit'
        },
        async getMU() {
            try {
                this.inputs.mu.loading = true
                this.inputs.mu.model = ''
                this.inputs.ff.model = ''
                this.inputs.farmer.model = ''
                this.inputs.land.model = ''
                const params = new URLSearchParams({
                    program_year: this.inputs.programYear.model,
                    nursery: this.inputs.nursery.model,
                    distribution_date: this.inputs.distributionDate.model
                })
                const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetMU?${params}`)
                const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                this.inputs.mu.items = data.list
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
            } finally {
                this.inputs.mu.loading = false
            }
        },
        async getFF(mu_no) {
            try {
                if (mu_no) {
                    this.alert.message = 'Select FF'
                    this.inputs.ff.loading = true
                    this.inputs.ff.model = ''
                    this.inputs.farmer.model = ''
                    this.inputs.land.model = ''
                    const params = new URLSearchParams({
                        program_year: this.inputs.programYear.model,
                        mu_no: mu_no,
                        distribution_date: this.inputs.distributionDate.model
                    })
                    const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetFF?${params}`)
                    const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                    this.inputs.ff.items = data.list
                }
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
            } finally {
                this.inputs.ff.loading = false
            }
        },
        async getFarmer(ff_no) {
            try {
                if (ff_no) {
                    this.alert.message = 'Select Farmer'
                    this.inputs.farmer.loading = true
                    this.inputs.farmer.model = ''
                    this.inputs.land.model = ''
                    const params = new URLSearchParams({
                        program_year: this.inputs.programYear.model,
                        ff_no: ff_no,
                        distribution_date: this.inputs.distributionDate.model
                    })
                    const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetFarmer?${params}`)
                    const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                    this.inputs.farmer.items = data.list
                }
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
            } finally {
                this.inputs.farmer.loading = false
            }
        },
        async getLand(farmer_no) {
            try {
                if (farmer_no) {
                    this.alert.message = 'Select Land'
                    this.inputs.land.loading = true
                    this.inputs.land.model = ''
                    const params = new URLSearchParams({
                        program_year: this.inputs.programYear.model,
                        farmer_no: farmer_no,
                        distribution_date: this.inputs.distributionDate.model
                    })
                    const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}GetLand?${params}`)
                    const data = await axios.get(urlName, this.$store.state.apiConfig).then(res => {return res.data})
                    this.inputs.land.items = data.list
                }
            } catch (err) {
                this.sessionEnd(err)
                console.log(err)
            } finally {
                this.inputs.land.loading = false
            }
        },
        resetData() {
            this.inputs.programYear.model = ''
            this.inputs.nursery.model = ''
            this.inputs.distributionDate.model = ''
            this.inputs.mu.model = ''
            this.inputs.ff.model = ''
            this.inputs.farmer.model = ''
            this.inputs.land.model = ''
            this.inputs.notes.model = ''
        },
        sessionEnd(error) {
            if (error.response) {
                if (typeof error.response.status != 'undefined') {
                    if (error.response.status == 401) {
                        localStorage.removeItem("token")
                        this.$router.push("/")
                    }
                }
            }
        },
    },
}
</script>