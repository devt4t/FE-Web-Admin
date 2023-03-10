<template>
    <div>
        <confirmation type="verification" :show="dialogs.confirmation.model" @close="() => dialogs.confirmation.model = false" @confirm="() => verificationConfirm()"></confirmation>
        <v-dialog v-model="showDialog" max-width="800" content-class="rounded-xl" persistent scrollable>  
            <v-card color="orange">
                <v-card-title class="white--text">
                    <v-icon color="white" class="mr-1">mdi-message-bulleted</v-icon>
                    Detail
                    <v-divider color="white" class="mx-2"></v-divider>
                    <v-icon color="white" @click="() => showDialog = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text class="pb-0">
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
                                <v-chip color="orange white--text"><v-icon class="mr-1">mdi-chat-processing</v-icon> {{ data.main.request_no || '-' }}</v-chip>
                                <v-divider class="mx-2"></v-divider>
                                <p class="mb-0">{{ data.main.created_at || '-' }} <v-icon>mdi-clock-fast</v-icon></p>
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
                                    <tr v-if="landProgram == 'Petani'">
                                        <td style="max-width: fit-content;">FF</td>
                                        <td>: {{ data.main.ff_name || '-' }}</td>
                                    </tr>
                                    <tr v-if="landProgram == 'Petani'">
                                        <td style="max-width: fit-content;">Petani</td>
                                        <td>: {{ data.main.farmer_name || '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td style="max-width: fit-content;">Lahan</td>
                                        <td>: {{ data.main.lahan_no || '-' }}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                            <v-data-table
                                dense
                                :headers="seedHeaders"
                                :items="data.seeds || []"
                            >
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
                                        <v-icon small>mdi-checkbox-marked-circle-outline</v-icon> Confirm ({{ data.seeds.filter(s => s.is_checked === true).length }}/{{ data.seeds.length }})
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
                <v-card-actions class="justify-center rounded-pill" style="position: relative;">
                    <!-- Reject Button -->
                    <v-hover v-slot="{hover}">
                        <v-btn rounded :outlined="!hover" :color="`${!hover ? 'white' : 'red'} white--text`"><v-icon>mdi-undo</v-icon> Reject</v-btn>
                    </v-hover>
                    <v-divider class="mx-2 mr-5" color="white"></v-divider>
                    <!-- verification button -->
                    <v-tooltip left content-class="rounded-xl">
                        <template v-slot:activator="{on,attrs}">
                            <v-btn v-bind="attrs" v-on="on" @click="() => dialogs.confirmation.model = true" fab rounded absolute top right color="green white--text"><v-icon>mdi-check-all</v-icon></v-btn>
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
        data: {
            main: {},
            seeds: []
        },
        dialogs: {
            confirmation: {
                model: false
            }
        },
        loading: {
            show: false,
            text: ''
        },
        seedHeaders: [
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
    },
    methods: {
        async initialize() {
            try {
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
                this.data.seeds = await data.seeds.map(s => {return {...s, is_checked: 0}})
                console.log(this.data)
            } catch (err) {
                this.errorResponse(err)
            } finally {
                this.loading.show = false
                this.loading.text = 'Loading...'
            }
        },
        async verificationConfirm() {
            try {
                this.dialogs.confirmation.model = false
                this.loading.show = true
                this.loading.text = 'Verifying data...'
                
                const urlName = this.$store.getters.getApiUrl(`${this.settings.prefixUrl}Verification`)
                const apiConfig = this.settings.apiConfig
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
            } catch (err) {
                this.errorResponse(err)
            } finally {
                this.snackbar.show = true
                this.loading.show = false
                this.loading.text = 'Loading...'
            }
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
    },
}
</script>