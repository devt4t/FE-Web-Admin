<template>
    <div>
        <!-- BreadCrumbs -->
        <v-breadcrumbs
            data-aos="fade-right"
            class="breadcrumbsmain"
            :items="breadcrumbs"
            divider=">"
            large
        ></v-breadcrumbs>

        <!-- START: MODAL -->
        <TruckFormModal :show="modals.truck.show" :id="modals.truck.id" @close="closeModals($event)"></TruckFormModal>
        <DriverFormModal :show="modals.driver.show" :id="modals.driver.id" @close="closeModals($event)"></DriverFormModal>
        <!-- END: MODAL -->

        <v-expansion-panels v-model="expansions.model" class="mb-6 px-3" multiple  data-aos="fade-up" data-aos-delay="200" data-aos-once="true">
            <!-- Truck Panel -->
            <v-expansion-panel class="rounded-xl mt-2">
                <v-expansion-panel-header class="">
                    <h3 class=""><v-btn fab x-small color="green white--text" class="mr-1"><v-icon>mdi-truck</v-icon></v-btn> Truck </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-data-table
                        :headers="tables.truck.headers"
                        :loading="tables.truck.loading"
                        :items="tables.truck.items"
                        class=""
                    >
                        <template v-slot:top>
                            <v-row class="ma-0 align-center">
                                <!-- Program Year -->
                                <v-select
                                    color="success"
                                    item-color="success"
                                    v-model="tables.truck.programYear"
                                    :items="$store.state.programYear.options"
                                    outlined
                                    dense
                                    hide-details
                                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                    rounded
                                    label="Program Year"
                                    class="mx-auto mx-lg-2 mb-2 mb-lg-0"
                                    style="max-width: 200px"
                                ></v-select>
                                <!-- Search Input -->
                                <v-text-field
                                    v-model="tables.truck.search"
                                    append-icon="mdi-magnify"
                                    color="green"
                                    label="Search"
                                    hide-details
                                    outlined
                                    rounded
                                    dense
                                    class=""
                                    style="max-width: 300px"
                                ></v-text-field>
                                <v-divider class="mx-2"></v-divider>
                                <v-btn color="info" fab small @click="modals.truck.show = true;">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </v-row>
                        </template>
                    </v-data-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <!-- Driver Panel -->
            <v-expansion-panel class="rounded-xl mt-2">
                <v-expansion-panel-header class="">
                    <h3 class=""><v-btn fab x-small color="green white--text" class="mr-1"><v-icon>mdi-card-account-details</v-icon></v-btn> Driver </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-data-table
                        :headers="tables.driver.headers"
                        :loading="tables.driver.loading"
                        :items="tables.driver.items"
                        :search="tables.driver.search"
                        class=""
                    >
                        <template v-slot:top>
                            <v-row class="ma-0 align-center">
                                <!-- Program Year -->
                                <v-select
                                    color="success"
                                    item-color="success"
                                    v-model="tables.driver.programYear"
                                    :items="$store.state.programYear.options"
                                    outlined
                                    dense
                                    hide-details
                                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                    rounded
                                    label="Program Year"
                                    class="mx-auto mx-lg-2 mb-2 mb-lg-0"
                                    style="max-width: 200px"
                                ></v-select>
                                <!-- Search Input -->
                                <v-text-field
                                    v-model="tables.driver.search"
                                    append-icon="mdi-magnify"
                                    color="green"
                                    label="Search"
                                    hide-details
                                    outlined
                                    rounded
                                    dense
                                    class=""
                                    style="max-width: 300px"
                                ></v-text-field>
                                <v-divider class="mx-2"></v-divider>
                                <v-btn color="info" fab small @click="modals.driver.show = true">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </v-row>
                        </template>
                    </v-data-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        
    </div>
</template>

<script>
import axios from 'axios';
import DriverFormModal from './components/DriverFormModal.vue';
import TruckFormModal from './components/TruckFormModal.vue'

export default {
    components: { TruckFormModal, DriverFormModal },
    data: () => ({
        breadcrumbs: [
            {
                text: "Main Data",
                disabled: true,
                href: "breadcrumbs_dashboard",
            },
            {
                text: "Truck & Driver",
                disabled: true,
                href: "breadcrumbs_link_1",
            },
        ],
        expansions: {
            model: [0, 1]
        },
        modals: {
            driver: {
                show: false,
                id: null,
            },
            truck: {
                show: false,
                id: null,
            }
        },
        tables: {
            truck: {
                programYear: "2022",
                items: [],
                headers: [
                    { text: "Truck ID", value: "truck_id" },
                ],
                loading: false,
                search: ""
            },
            driver: {
                programYear: "2022",
                items: [],
                headers: [
                    { text: "NIK / Licence", value: "nik" },
                    { text: "Name", value: "name" },
                    { text: "Address", value: "address" },
                    { text: "Action", value: "action", align: 'right' },
                ],
                loading: false,
                search: ""
            },
        }
    }),
    watch: {
        'modals.truck.show': {
            handler(newVal) {
                // alert(newVal)
            }
        }
    },
    async mounted() {
        await this.getTableData('truck')
        await this.getTableData('driver')
    },
    methods: {
        async getTableData(type) {
            try {
                this.tables[type].loading = true
                const res = await axios.get(`${this.$store.getters.getApiUrl(`Get${this.$store.getters.capitalizeFirstLetter(type)}`)}`, this.$store.state.apiConfig)
                this.tables[type].items = res.data.data.result
            } catch(err) {
                console.log(err)
                if (err.response) this.forceLogout(err.response)
            } finally {
                this.tables[type].loading = false
            }
        },
        // UTILITIES
        closeModals(data) {
            if (data.type && data.val == false) {
                this.modals[data.type].show = false
                this.modals[data.type].id = null
            }
        },
        forceLogout(response) {
            if (response.status == 401) {
                localStorage.removeItem("token")
                this.$router.push("/")
            }
        },
    },
}
</script>