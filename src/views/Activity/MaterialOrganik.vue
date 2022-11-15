<template>
    <div>
        <!-- breadcrumbs -->
        <v-breadcrumbs
            class="breadcrumbsmain"
            :items="itemsbr"
            divider=">"
            large
        ></v-breadcrumbs>
        <!-- Dialog -->
        <v-dialog v-model="dialogs.confirmation.show" max-width="700px" persistent content-class="rounded-lg" scrollable>
            <v-card class="rounded-xl">
                <v-card-title class="mb-1 headermodalstyle">
                    <v-icon class="mr-2 white--text">mdi-help-circle</v-icon>
                    <span>Confirmation</span>
                    <v-divider dark class="mx-2"></v-divider>
                    <v-icon color="red" @click="dialogs.confirmation.show = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <h2 class="text-center pt-4">{{ dialogs.confirmation.title }}</h2>
                    <v-row class="mt-10 align-center mb-0">
                        <v-divider class="mx-2"></v-divider>
                        <v-btn rounded color="red white--text mr-1" @click="dialogs.confirmation.show = false">
                            <v-icon>mdi-close-circle</v-icon>
                            Close
                        </v-btn>
                        <v-btn rounded color="green white--text ml-1" @click="confirmationOk(dialogs.confirmation.okText)">
                            <v-icon>mdi-check-circle</v-icon>
                            {{ dialogs.confirmation.okText }}
                        </v-btn>
                        <v-divider class="mx-2"></v-divider>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- END: Dialog -->
        
        <!-- main table -->
        <v-data-table
            :headers="tables.main.headers"
            :items="tables.main.items"
            :search="tables.main.search"
            :loading="tables.main.loading"
            :loading-text="tables.main.loadingText"
            :class="`${$store.state.theme == 'dark' ? '' : ''} rounded-xl elevation-6 mx-3 pa-1`"
        >
            <!-- Toolbars -->
            <template v-slot:top>
                <v-row class="my-2 mx-4 align-center">
                    <v-divider class="mx-2"></v-divider>
                    <v-text-field
                        hide-details
                        dense
                        outlined
                        rounded
                        label="Search"
                        placeholder="Start type to search..."
                        append-icon="mdi-magnify"
                        v-model="tables.main.search"
                    ></v-text-field>
                </v-row>
            </template>
            <!-- Status Column -->
            <template v-slot:item.status="{item}">
                <v-chip
                    :color="`${item.status ? 'green' : 'red'} white--text`"
                >
                    <v-icon class="mr-1">mdi-{{ item.status ? 'check' : 'close' }}-circle</v-icon>
                    {{ item.status ? 'Verified' : 'Unverified' }}
                </v-chip>
            </template>
            <!-- Actions Column -->
            <template v-slot:item.actions="{item}">
                <v-btn
                    v-if="item.status == 0"
                    color="green white--text"
                    rounded
                    small
                    @click="dialogs.confirmation.show = true;dialogs.confirmation.title = 'Ar u sure want to verif this data?';dialogs.confirmation.okText = 'Verif';dialogs.confirmation.model = item.organic_no"
                >
                    <v-icon small class="mr-1">mdi-check-circle</v-icon>
                    Validate
                </v-btn>
                <v-btn
                    v-if="item.status == 1 && (User.role_group == 'IT' || User.role_name == 'UNIT MANAGER')"
                    color="red white--text"
                    rounded
                    small
                    @click="dialogs.confirmation.show = true;dialogs.confirmation.title = 'Ar u sure want to unverif this data?';dialogs.confirmation.okText = 'Unverif';dialogs.confirmation.model = item.organic_no"
                >
                    <v-icon small class="mr-1">mdi-close-circle</v-icon>
                    Unvalidate
                </v-btn>
            </template>
        </v-data-table>

        <!-- Snackbar -->
        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="snackbar.timeout"
            rounded="xl"
        >
            <div class="d-flex justify-between">
                <p class="mb-0">
                    {{ snackbar.text }}
                </p>
                <v-divider class="mx-2"></v-divider>
                <v-icon small class="pl-1" @click="snackbar.show = false">mdi-close-circle</v-icon>
            </div>
        </v-snackbar>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data: () => ({
        apiConfig: {
            baseUrl: localStorage.getItem('BaseUrlGet'),
            token: localStorage.getItem('token'),
        },
        dialogs: {
            confirmation: {
                model: '',
                okText: '',
                show: false,
                title: 'Confirmation',
            }
        },
        itemsbr: [
            {
                text: "Activities",
                disabled: true,
                href: "breadcrumbs_dashboard",
            },
            {
                text: "Material Organik",
                disabled: true,
                href: "breadcrumbs_link_1",
            },
        ],
        snackbar: {
            color: '',
            show: false,
            text: '',
            timeout: 10000,
        },
        tables: {
            main: {
                headers: [
                    { text: "Organic No", value: "organic_no" },
                    { text: "Farmer No", value: "farmer_no" },
                    { text: "Organic Name", value: "organic_name", align: 'center' },
                    { text: "Amount", value: "organic_amount" },
                    { text: "Status", value: "status", align: 'center' },
                    { text: "Actions", value: "actions", align: 'right' },
                ],
                items: [],
                loading: false,
                loadingText: 'Loading...',
                search: '',
            }
        },
        User: JSON.parse(localStorage.getItem("User"))
    }),
    async mounted() {
        await this.firstAccessPage()
    },
    destroyed() {
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
    },
    methods: {
        async confirmationOk(type) {
            const datas = {
                organic_no: this.dialogs.confirmation.model,
                verified_by: this.User.email,
            }
            if (type == 'Verif') {
                datas.status = 1
            } else if (type == 'Unverif') {
                datas.status = 0
            }

            this.dialogs.confirmation.show = false
            this.$store.state.loadingOverlayText = `${type} Data...`
            this.$store.state.loadingOverlay = true

            await axios.post(
                `${this.apiConfig.baseUrl}${type == 'Verif' ? 'Validate' : 'Unvalidate'}Organic`,
                datas,
                {
                    headers: {
                        Authorization: `Bearer ${this.apiConfig.token}`
                    }
                }
            ).then(res => {
                if (res.data.data.result == 'success') {
                    this.snackbar = {
                        color: 'green white--text',
                        show: true,
                    text: `${type} Success`,
                        timeout: 10000,
                    }
                    this.getMainTableData()
                }
            }).catch(err => {
                this.snackbar = {
                    color: 'red white--text',
                    show: true,
                    text: `${type} Failed`,
                    timeout: 10000,
                }
                this.sessionEnd(err)
            }).finally(() => {
                this.$store.state.loadingOverlayText = null
                this.$store.state.loadingOverlay = false
            })
        },
        async firstAccessPage() {
            await this.getMainTableData()
        },
        async getMainTableData() {
            this.tables.main.loadingText = 'Getting Data...'
            this.tables.main.loading = true
            await axios.get(
                `${this.apiConfig.baseUrl}GetOrganicAll`,
                {
                    headers: {
                        Authorization: `Bearer ${this.apiConfig.token}` 
                    },
                }
            ).then(response => {
                const res = response.data.data.result
                this.tables.main.items = res 
            }).catch(err => {
                this.tables.main.items = []
                this.sessionEnd(err)
            }).finally(() => {
                this.tables.main.loading = false
            })
        },
        sessionEnd(error) {
            if (typeof error.response.status != 'undefined') {
                if (error.response.status == 401) {
                    localStorage.removeItem("token")
                    this.$router.push("/")
                }
            }
        },
    }
}
</script>