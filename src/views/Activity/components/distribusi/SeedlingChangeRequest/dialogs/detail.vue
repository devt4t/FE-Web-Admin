<template>
    <div>
        <confirmation :type="dialogs.confirmation.type" :show="dialogs.confirmation.model" @close="() => dialogs.confirmation.model = false" @confirm="() => verificationOrRejectConfirm()"></confirmation>
        <v-dialog v-model="showDialog" max-width="1000" content-class="rounded-xl" persistent scrollable>  
            <v-card color="orange">
                <v-card-title class="white--text">
                    <v-icon color="white" class="mr-1">mdi-message-bulleted</v-icon>
                    Detail
                    <v-divider color="white" class="mx-2"></v-divider>
                    <v-icon color="white" @click="() => showDialog = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text :class="verificationStatus != 3 ? 'pb-0' : ''">
                    <v-overlay v-if="loading.show" justify-center align-center absolute>
                        <div class="d-flex flex-column align-center justify-center">
                            <v-progress-circular
                                :size="80"
                                :width="7"
                                indeterminate
                                color="white"
                            >
                            </v-progress-circular>
                            <p class="mb-0 text-center mt-4">{{ loading.text || 'Loading...' }}</p>
                        </div>
                    </v-overlay>
                    <v-card class="rounded-xl">
                        <v-card-text class="pb-0">
                            <v-row class="align-center ma-0">
                                <v-tooltip bottom content-class="rounded-xl">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-chip v-bind="attrs" v-on="on" :color="statusColorAndIcon(data.main.status, 'color', 'request')" style="text-transform: uppercase;">
                                            <v-icon class="mr-1">{{ statusColorAndIcon(data.main.status, 'icon', 'request') }}</v-icon>
                                            {{ data.main.request_no }}
                                        </v-chip>
                                    </template>
                                    Requested By: {{ data.main.created_by }}
                                </v-tooltip>
                                <v-divider class="mx-2"></v-divider>
                                <v-tooltip bottom content-class="rounded-xl">
                                    <template v-slot:activator="{ on, attrs }">
                                        <p v-bind="attrs" v-on="on" class="mb-0">{{ data.main.created_at || '-' }} <v-icon>mdi-clock-fast</v-icon></p>
                                    </template>
                                    Request created time
                                </v-tooltip>
                            </v-row>
                            <!-- Main Data -->
                            <v-row class="align-center mx-0 my-0 mt-2">
                                <p class="mb-0"><v-icon>mdi-clipboard-text</v-icon> Main Data</p>
                                <v-divider class="ml-2"></v-divider>
                            </v-row>
                            <v-simple-table dense>
                                <tbody>
                                    <tr>
                                        <td style="max-width: fit-content;">Distribution</td>
                                        <td>: {{ data.main.distribution_date }}</td>
                                    </tr>
                                    <tr v-if="landProgram == 'Petani'">
                                        <td style="max-width: fit-content;">Unit Manager</td>
                                        <td>: {{ data.main.um_name || '-' }}</td>
                                    </tr>
                                    <tr v-if="landProgram == 'Petani'">
                                        <td style="max-width: fit-content;">FC</td>
                                        <td>: {{ data.main.fc_name || '-' }}</td>
                                    </tr>
                                    <tr v-else>
                                        <td style="max-width: fit-content;">PIC T4T</td>
                                        <td>: {{ data.main.pic_t4t_name || '-' }}</td>
                                    </tr>
                                    <tr v-if="landProgram == 'Petani'">
                                        <td style="max-width: fit-content;">FF</td>
                                        <td>: {{ data.main.ff_name || '-' }}</td>
                                    </tr>
                                    <tr v-else>
                                        <td style="max-width: fit-content;">PIC Lahan</td>
                                        <td>: {{ data.main.pic_lahan_name || '-' }}</td>
                                    </tr>
                                    <tr v-if="landProgram == 'Petani'">
                                        <td style="max-width: fit-content;">Petani</td>
                                        <td>: {{ data.main.farmer_name || '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td style="max-width: fit-content;">Lahan</td>
                                        <td>: {{ data.main.lahan_no || '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td style="max-width: fit-content;">Reason Notes</td>
                                        <td>: {{ data.main.notes || '-' }} <i>({{ data.main.created_by_name || '-' }})</i></td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                            <!-- activities -->
                            <v-card class="elevation-0 mt-3" v-if="data.main.last_activity" :key="components.activitiesCard">
                                <v-card-title data-aos="zoom-in" class="pb-0">
                                    <v-spacer class="mr-2"></v-spacer>
                                    <span class="grey--text text--darken-2">
                                        <v-icon class="mr-1">mdi-timeline-check</v-icon> {{ landProgram == 'Petani' ? 'Farmer' : 'MoU' }} Last Activities
                                    </span>
                                    <v-spacer class="ml-2"></v-spacer>
                                </v-card-title>
                                <v-card-text class="pb-0">
                                    <v-stepper alt-labels class="elevation-0" v-model="data.main.last_activity_model">
                                        <v-stepper-header class="elevation-0">
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="0" color="green" step="x" :complete="data.main.last_activity_model >= 1" :rules="[() => data.main.last_activity_model < 1 ? false : true]" error-icon="mdi-close-circle"><small>Pendataan Lahan</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step v-if="landProgram == 'Petani'" data-aos="zoom-in" data-aos-delay="50" color="green" step="x" :complete="data.main.last_activity_model >= 2" :rules="[() => data.main.last_activity_model < 2 ? false : true]" error-icon="mdi-close-circle"><small>Sosialisasi Tanam</small></v-stepper-step>
                                            <v-divider v-if="landProgram == 'Petani'" class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="100" color="green" step="x" :complete="data.main.last_activity_model >= 3" :rules="[() => data.main.last_activity_model < 3 ? false : true]" error-icon="mdi-close-circle"><small>Penilikan Lubang</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="150" color="green" step="x" :complete="data.main.last_activity_model >= 4" :rules="[() => data.main.last_activity_model < 4 ? false : true]" error-icon="mdi-close-circle"><small>Print Label</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="200" color="green" step="x" :complete="data.main.last_activity_model >= 5" :rules="[() => data.main.last_activity_model < 5 ? false : true]" error-icon="mdi-close-circle"><small>Load Bag</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="250" color="green" step="x" :complete="data.main.last_activity_model >= 6" :rules="[() => data.main.last_activity_model < 6 ? false : true]" error-icon="mdi-close-circle"><small>Distribute Bag</small></v-stepper-step>
                                            <v-divider class=""></v-divider>
                                            <v-stepper-step data-aos="zoom-in" data-aos-delay="300" color="green" step="x" :complete="data.main.last_activity_model >= 7" :rules="[() => data.main.last_activity_model < 7 ? false : true]" error-icon="mdi-close-circle"><small>Realisasi Tanam</small></v-stepper-step>
                                        </v-stepper-header>
                                    </v-stepper>
                                </v-card-text>
                            </v-card>
                            <!-- Seeds Data -->
                            <v-row class="align-center mx-0 my-0 mt-2">
                                <p class="mb-0"><v-icon>mdi-forest</v-icon> Seedling Change</p>
                                <v-divider class="ml-2"></v-divider>
                            </v-row>
                            <v-data-table
                                dense
                                hide-default-footer
                                :items-per-page="-1"
                                multi-sort
                                :headers="seedHeaders"
                                :items="data.seeds || []"
                            >
                                <!-- no column -->
                                <template v-slot:item.no="{index}">
                                    {{ index + 1 }}
                                </template>
                                <!-- status template -->
                                <template v-slot:item.type="{item}">
                                    <v-chip small :color="getTypeColorAndLabel('color', item.type)">{{ getTypeColorAndLabel('label', item.type) }}</v-chip>
                                </template>
                                <!-- change log -->
                                <template v-slot:item.new_amount="{item}">
                                    <v-icon :color="getTypeColorAndLabel('color', item.type)">mdi-sprout</v-icon> {{ item.old_amount }}
                                    <span v-if="item.type != 'same'">
                                        <v-icon small>mdi-chevron-double-right</v-icon>
                                        {{ item.new_amount }}
                                    </span>
                                </template>
                                <!-- check -->
                                <template v-slot:header.is_checked>
                                        <v-icon small>mdi-checkbox-marked-circle-outline</v-icon> Confirm ({{ data.seeds ? (data.seeds.filter(s => s.is_checked === true ).length) : '' }}/{{ data.seeds ? data.seeds.length : '' }})
                                </template>
                                <template v-slot:item.is_checked="{item}">
                                    <v-row class="mx-0">
                                        <v-checkbox
                                            off-icon="mdi-circle-outline"
                                            on-icon="mdi-check-circle"
                                            color="green"
                                            :label="item.is_checked ? 'Confirmed' : 'Check'"
                                            v-model="item.is_checked"
                                        ></v-checkbox>
                                    </v-row>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
    
                    <!-- snackbar -->
                    <v-snackbar
                        v-model="snackbar.show"
                        :color="snackbar.color"
                        :timeout="snackbar.timeout"
                        :multi-line="snackbar.multiLine"
                        rounded="xl"
                        class="d-flex"
                    >
                        <div class="d-flex justify-between">
                            <p class="mb-0">
                                {{ snackbar.text }}
                            </p>
                            <v-spacer></v-spacer>
                            <v-icon small class="pl-1" @click="() => snackbar.show = false">mdi-close-circle</v-icon>
                        </div>
                    </v-snackbar>
                </v-card-text>
                <v-card-actions v-if="verificationStatus != 3" class="justify-center rounded-pill" style="position: relative;">
                    <!-- Reject Button -->
                    <v-hover v-slot="{hover}">
                        <v-btn v-if="User.role_group == 'IT' || User.role_name == 'NURSERY MANAGER'" @click="() => {dialogs.confirmation.type = 'reject';dialogs.confirmation.model = true;}"  rounded :outlined="!hover" :color="`${!hover ? 'white' : 'red'} white--text`"><v-icon class="mr-1">mdi-file-document-remove</v-icon> Reject</v-btn>
                    </v-hover>
                    <v-divider class="mx-2 mr-5" color="white"></v-divider>
                    <!-- verification button -->
                    <v-tooltip left content-class="rounded-xl">
                        <template v-slot:activator="{on,attrs}">
                            <v-btn v-bind="attrs" v-on="on" @click="() => {showVerificationDialog()}"  :disabled="disabledVerification" fab rounded absolute top right color="green white--text"><v-icon>mdi-check-all</v-icon></v-btn>
                        </template>
                        Verification Request
                    </v-tooltip>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import confirmation from './createConfirmation.vue'

export default {
    components: {
        confirmation
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        landProgram: {
            type: String,
            default: 'Petani'
        },
        id: {
            type: String,
            default: null
        },
        settings: {
            type: Object,
            default: null
        }
    },
    data: () => ({
        components: {
            activitiesCard: 29123,
        },
        data: {
            main: {},
            seeds: []
        },
        dialogs: {
            confirmation: {
                model: false,
                type: ''
            }
        },
        loading: {
            show: false,
            text: ''
        },
        seedHeaders: [
            {text: 'No', value: 'no', align: 'center', width: '20px', sortable: false},
            {text: 'Lahan', value: 'lahan_no'},
            {text: 'Jenis', value: 'tree_name'},
            {text: 'Status', value: 'type', align: 'right'},
            {text: 'Perubahan', value: 'new_amount'},
            {text: 'Check', value: 'is_checked', align: 'left'},
        ],
        snackbar: {
            color: 'green',
            timeout: 5000,
            show: false,
            text: 'Alert!',
            multiLine: false
        },
        User: {}
    }),
    computed: {
        showDialog: {
            get: function () {
                if (this.show == true) this.initialize()
                return this.show
            },
            set: async function (val) {
                if (val == false) {
                    this.$emit('close', {name: 'detail'})
                } 
            }
        },
        disabledVerification() {
            const data = this.data
            const user = this.User
            const lp = this.landProgram
            let disabled = false
            if (data.main.request_no) {
                const verification = data.main.verification || 0
                if (lp == 'Petani') {
                    if (verification == 0 && user.role_name != 'FIELD COORDINATOR') disabled = true
                    else if (verification == 1 && user.role_name != 'UNIT MANAGER') disabled = true
                    else if (verification == 2 && user.role_name != 'PROGRAM MANAGER' && user.role_name != 'REGIONAL MANAGER') disabled = true
                } else {
                    const createdLU = data.main.created_lu_email
                    if (verification == 0 && createdLU != user.email) disabled = true
                    else if (verification == 1 && user.role_name != 'PROGRAM MANAGER' && user.role_name != 'REGIONAL MANAGER') disabled = true
                }

                if (user.role_group == 'IT') disabled = false

                if (data.seeds.filter(s => s.is_checked === true ).length != data.seeds.length) disabled = true
            } else disabled = true
            return disabled
        },
        verificationStatus() {
            const data = this.data.main
            let status = 0;
            if (data.verification) status = data.verification
            if (data.status == 'rejected') status = 3
            return status
        }
    },
    methods: {
        async initialize() {
            try {
                this.User = this.$store.state.User
                if (this.id) {
                    await this.getData(this.id)
                }
            } catch (err) {

            } finally {
            }
        },
        async getData(reqNo) {
            try {
                this.loading.show = true
                this.loading.text = 'Getting request detail...'
                const params = new URLSearchParams({
                    request_no: reqNo
                })
                const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}DetailRequest?${params}`)
                const apiConfig = this.settings.apiConfig
                const data = await axios.get(urlName, apiConfig).then(res => {return res.data})
                this.data.main = data.main
                this.data.main.created_at = this.$store.getters.dateFormat(data.main.created_at, 'HH:mm - DD MMMM Y')
                this.data.main.distribution_date = this.$store.getters.dateFormat(data.main.distribution_date, 'DD MMMM Y')
                if (data.main.last_activity == 'Pendataan Lahan') this.data.main.last_activity_model = 1
                if (data.main.last_activity == 'Sosialisasi Tanam') this.data.main.last_activity_model = 2
                if (data.main.last_activity == 'Penilikan Lubang') this.data.main.last_activity_model = 3
                if (data.main.last_activity == 'Print Label') this.data.main.last_activity_model = 4
                if (data.main.last_activity == 'Load Bag') this.data.main.last_activity_model = 5
                if (data.main.last_activity == 'Distribute Bag') this.data.main.last_activity_model = 6
                if (data.main.last_activity == 'Realisasi Tanam') this.data.main.last_activity_model = 7
                this.components.activitiesCard += 1
                this.data.seeds = await data.seeds.map(s => {return {...s, is_checked: 0}})
                
                if (this.data.main.verification == 3) {
                    const checkedIndex = this.seedHeaders.findIndex(sh => sh.value === 'is_checked')
                    if (checkedIndex > -1) this.seedHeaders.splice(checkedIndex,1)
                } else {
                    const exist = this.seedHeaders.find(sh => sh.value == 'is_checked')
                    if (!exist) this.seedHeaders.push({text: 'Check', value: 'is_checked', align: 'left'})
                }
                // console.log(this.data)
            } catch (err) {
                this.errorResponse(err)
            } finally {
                this.loading.show = false
                this.loading.text = 'Loading...'
            }
        },
        async verificationOrRejectConfirm() {
            try {
                this.loading.show = true
                const dialogConfirm = this.dialogs.confirmation
                dialogConfirm.model = false
                let urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}`)
                const apiConfig = this.settings.apiConfig
                if (dialogConfirm.type == 'verification' || dialogConfirm.type == 'last_verification') {
                    this.loading.text = 'Verifying data...'
                    urlName += 'Verification'
                    const verif = await axios.post(urlName, {request_no: this.id}, apiConfig).then(res => {return res.data})
                    if (verif) {
                        this.snackbar.text = verif
                        this.snackbar.color = 'green'
                        this.$emit('close', {name: 'detail', snackbar: {
                            text: 'Send request success!',
                            color: 'green',
                            show: true
                        }})
                    }
                } else if (dialogConfirm.type == 'reject') {
                    this.loading.text = 'Rejecting data...'
                    urlName += 'Reject'
                    const reject = await axios.post(urlName, {request_no: this.id}, apiConfig).then(res => {return res.data})
                    if (reject) {
                        this.snackbar.text = reject
                        this.snackbar.color = 'green'
                        this.$emit('close', {name: 'detail', snackbar: {
                            text: 'Request rejected!',
                            color: 'green',
                            show: true
                        }})
                    }
                }
            } catch (err) {
                this.errorResponse(err)
            } finally {
                this.snackbar.show = true
                this.loading.show = false
                this.loading.text = 'Loading...'
            }
        },
        // utilities: show verif dialog
        showVerificationDialog() {
            const dialog = this.dialogs.confirmation
            const lp = this.landProgram
            const data = this.data.main
            if ((lp == 'Petani' && data.verification == 2) || (lp == 'Umum' && data.verification == 1)) dialog.type = 'last_verification'
            else dialog.type = 'verification'
            dialog.model = true
        },
        // utilities: get type color
        getTypeColorAndLabel(t, type) {
            if (t == 'color') {
                let color = 'grey darken-1'
                if (type == 'remove') color = 'red'  
                if (type == 'change') color = 'orange'
                if (type == 'new') color = 'blue'
    
                return color + ' white--text'
            } else {
                let label = 'TETAP'
                if (type == 'remove') label = 'HAPUS'  
                if (type == 'change') label = 'BERUBAH'
                if (type == 'new') label = 'BARU'

                return label
            }
        },
        // Utilities: session  end
        errorResponse(error) {
            this.snackbar.text = error.message
            this.snackbar.color = 'red'
            if (error.response) {
                if (typeof error.response.status != 'undefined') {
                    if (error.response.status == 401) {
                        localStorage.removeItem("token")
                        this.$router.push("/")
                    } else if (error.response.status == 400) {
                        // this.snackbar.multiLine = true
                        this.snackbar.text = error.response.data
                    }
                }
            }
            this.snackbar.show = true
        },
		// utilities: get status request color & icon
		statusColorAndIcon(status, el, type) {
			let data = ''
			if (type == 'request') {
				if (el == 'color') {
					if (status == 'requested') data = 'orange'
					else if (status == 'rejected') data = 'red'
					else data = 'green'
					return data + ' white--text'
				} else {
					if (status == 'requested') data = 'chat-processing'
					else if (status == 'rejected') data = 'chat-remove'
					else data = 'check-decagram'
					return 'mdi-' + data
				}
			} else {
				if (el == 'color') {
					if (status == 0) data = 'red'
					else if (status == 1) data = 'orange'
					else if (status == 2 ) data = 'yellow darken-2'
					else if (status == 3) data = 'green'
					return data + ' white--text'
				} else if ( el == 'icon') {
					if (status == 0) data = 'progress-alert'
					else if (status == 1) data = 'progress-check'
					else if (status == 2 ) data = 'check-circle'
					else if (status == 3) data = 'checkbox-multiple-marked-circle'
					return 'mdi-' + data
				} else {
					if (status == 0) data = 'UNVERIFIED'
					else if (status == 1) data = 'VERIFIED FC'
					else if (status == 2 ) data = 'VERIFIED UM'
					else if (status == 3) data = 'VERIFIED RM / PM'
					return data
				} 
			}
		}
    },
}
</script>