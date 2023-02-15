<template>
    <div>
        <v-dialog v-model="isShow" max-width="500" content-class="rounded-xl" persistent scrollable>
            <v-card>
                <v-card-title class="headermodalstyle">
                    Change FC
                    <v-divider class="mx-2" color="white"></v-divider>
                    <v-icon color="red" @click="isShow = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <!-- Loading -->
                    <v-overlay absolute :value="isLoading">
                        <v-progress-circular
                        :size="80"
                        :width="7"
                        indeterminate
                        color="white"
                        >
                        </v-progress-circular>
                        <p class="mt-2 mb-0">{{ isLoadingText }}</p>
                    </v-overlay>
                    <v-autocomplete
                        color="green"
                        item-color="green"
                        rounded
                        outlined
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                        hide-details
                        class="mt-2"
                        label="Unit Manager"
                        item-text="name"
                        item-value="nik"
                        :items="UM.items"
                        :loading="UM.loading"
                        v-model="UM.model"
                        :disabled="$store.state.User.role_group != 'IT'"
                        @change="getOptions('FC', $event)"
                    >
                        <template v-slot:item="data">
                          <v-list-item-content>
                            <v-list-item-title v-html="data.item.name"></v-list-item-title>
                            <v-list-item-subtitle>{{ data.item.nik }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                    </v-autocomplete>
                    <v-autocomplete
                        color="green"
                        item-color="green"
                        rounded
                        outlined
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                        hide-details
                        class="mt-3"
                        label="Field Facilitator"
                        item-text="name"
                        item-value="nik"
                        :items="FC.items"
                        :loading="FC.loading"
                        v-model="FC.model"
                    >
                        <template v-slot:item="data">
                          <v-list-item-content>
                            <v-list-item-title v-html="data.item.name"></v-list-item-title>
                            <v-list-item-subtitle>{{ data.item.nik }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                    </v-autocomplete>
                </v-card-text>
                <v-card-actions>
                    <v-divider class="mr-2"></v-divider>
                    <v-btn color="green white--text" rounded class="px-5" :disabled="!FC.model || !ff_no" @click="save"><v-icon class="mr-1">mdi-content-save-check</v-icon> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String|Number,
            default: ''
        }
    },
    data: () => ({
        isLoading: false,
        isLoadingText: 'Loading...',
        ff_no: '',
        UM: {
            items: [],
            loading: false,
            model: '',
        },
        FC: {
            items: [],
            loading: false,
            model: '',
        }
    }),
    computed: {
        isShow: {
            get: function () {
                return this.show
            },
            set: function(val) {
                if (val == false) this.resetData()
                this.$emit('dialogAct', {name: 'changeFF', status: val});
            }
        }
    },
    watch: {
        id: {
            async handler(id) {
                if (id) {
                    this.isLoading = true
                    if (this.UM.items.length == 0) {
                        this.isLoadingText = 'Get List UM data...'
                        await this.getOptions('UM')
                    }
                    await this.getDetail(id)
                    this.isLoading = false
                }
            },
        }
    },
    methods: {
        async getDetail(id) {
            try {
                this.isLoadingText = 'Get FF data...'
                const response = await axios.get(this.$store.getters.getApiUrl(`GetFieldFacilitatorDetail?id=${id}`), this.$store.state.apiConfig)
                const res = response.data.data.result
                // console.log(res.fc_no)
                this.isLoadingText = 'Get FC data...'
                const resFC = await axios.get(this.$store.getters.getApiUrl(`GetEmployeeAll?name=${res.fc_name}&position=19`), this.$store.state.apiConfig)
                // console.log(resFC)
                const FCData = resFC.data.data.result.data
                if (FCData.length > 0) {
                    this.ff_no = res.ff_no
                    
                    this.UM.model = FCData[0].manager_code
                    await this.getOptions('FC', this.UM.model)
                    this.FC.model = res.fc_no
                }
            } catch(err) {
                this.$emit('showSnackbar', {text: err.message, color: 'red'})
                if (err.response != undefined) this.sessionEnd(err)
                else console.error(err)
            } finally {
                this.isLoadingText = 'Loading...'
            }
        },
        async getOptions(type, data = null) {
            try {
                this[type].loading = true
                this[type].model = ''
                let URL = ''
                if (type == 'UM') URL = `GetEmployeeAll?position_no=20` 
                else if (type == 'FC') URL = `GetEmployeebyManager?position=19&manager_code=${data}`

                const response = await axios.get(this.$store.getters.getApiUrl(URL), this.$store.state.apiConfig)
                const res = response.data.data
                this[type].items = await res.result.data
            } catch(err) {
                this.$emit('showSnackbar', {text: err.message, color: 'red'})
                if (err.response != undefined) this.sessionEnd(err)
                else console.error(err)
            } finally {
                this[type].loading = false
            }
        },
        resetData() {
            this.ff_no = ''
            this.FC.items = []
            this.FC.model = ''
            this.UM.items = []
            this.UM.model = ''
        },
        async save() {
            try {
                this.isLoading = true
                this.isLoadingText = 'Changing FC...'
                const res = await axios.post(this.$store.getters.getApiUrl('ChangeFCFieldFacilitator'), {
                    ff_no: this.ff_no,
                    fc_no: this.FC.model
                }, this.$store.state.apiConfig)
                console.log(res)
                this.$emit('refreshTable')
                this.$emit('showSnackbar', {text: res.data, color: res.status == 200 ? 'green' : 'red'})
            } catch(err) {
                this.$emit('showSnackbar', {text: err.message, color: 'red'})
                if (err.response != undefined) this.sessionEnd(err)
                else console.error(err)
            } finally {
                this.isLoading = false
                this.isShow = false
            }
        },
        sessionEnd(error) {
            if (typeof error.response.status != 'undefined') {
                if (error.response.status == 401) {
                    localStorage.removeItem("token")
                    this.$router.push("/")
                }
            }
        },
    },
}
</script>