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
        <TruckFormModal :show="modals.truck.show" :id="modals.truck.id" @close="closeModals($event)" @refreshTable="() => getTableData('truck')" @snackbar="showSnackBar($event)"></TruckFormModal>
        <DriverFormModal :show="modals.driver.show" :id="modals.driver.id" @close="closeModals($event)" @refreshTable="() => getTableData('driver')" @snackbar="showSnackBar($event)"></DriverFormModal>
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
                        :search="tables.truck.search"
                        :loading="tables.truck.loading"
                        :items="tables.truck.items"
                        multi-sort
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
                        <!-- Licence Plate -->
                        <template v-slot:item.plat_no="{item}">
                            <v-chip color="grey darken-3 white--text" class="rounded-lg">{{ item.plat_no }}</v-chip>
                        </template>
                        <!-- Status -->
                        <template v-slot:item.status="{item}">
                            <v-chip small :color="item.status == 'contract' ? 'primary' : 'orange'" class="white--text">
                                {{ item.status.toUpperCase() }}
                            </v-chip>
                        </template>
                        <!-- Is Active -->
                        <template v-slot:item.is_active="{item}">
                            <v-chip :color="`${item.is_active ? 'green' : 'red'} white--text`">
                                <v-icon class="mr-1">mdi-truck-{{ item.is_active ? 'check' : 'alert' }}</v-icon>
                                {{ item.is_active ? 'Active' : 'Nonactive' }}
                            </v-chip>
                        </template>
                        <!-- Type -->
                        <template v-slot:item.type="{item}">
                            <p class="mb-0">{{ trucks.find(v => v.name == item.type).type || ''  }}</p>
                            <small>{{ $store.getters.numberFormat(item.min_capacity) }} - {{ $store.getters.numberFormat(item.max_capacity) }} Bibit</small>
                        </template>
                        <!-- Actions -->
                        <template v-slot:item.action="{item}">
                            <v-btn rounded small color="orange" class="white--text pl-1" @click="modals.truck.id = item.plat_no;modals.truck.show = true;"><v-icon class="mr-1">mdi-pencil-circle</v-icon> Edit</v-btn>
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
                        multi-sort
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
                        <!-- Actions -->
                        <template v-slot:item.action="{item}">
                            <v-btn rounded small color="orange" class="white--text pl-1" @click="modals.driver.id = item.nik;modals.driver.show = true;"><v-icon class="mr-1">mdi-pencil-circle</v-icon> Edit</v-btn>
                        </template>
                    </v-data-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        
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
                <v-spacer></v-spacer>
                <v-icon small class="pl-1" @click="snackbar.show = false">mdi-close-circle</v-icon>
            </div>
        </v-snackbar>
    </div>
</template>

<script>
import axios from 'axios';
import DriverFormModal from './components/DriverFormModal.vue';
import TruckFormModal from './components/TruckFormModal.vue'
import trucks from '@/utils/trucks'

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
        snackbar: {
            color: '',
            show: false,
            text: '',
            timeout: 5000,
        },
        tables: {
            truck: {
                programYear: "2022",
                items: [],
                headers: [
                    { text: "Nursery", value: "nursery" },
                    { text: "Licence Plate", value: "plat_no", align: 'center' },
                    { text: "Type", value: "type" },
                    { text: "Status", value: "status", align: 'center' },
                    { text: "Availability", value: "is_active", align: 'center' },
                    { text: "Action", value: "action", align: 'right' },
                ],
                loading: false,
                search: ""
            },
            driver: {
                programYear: "2022",
                items: [],
                headers: [
                    { text: "Name", value: "name" },
                    { text: "NIK / Licence", value: "nik" },
                    { text: "Action", value: "action", align: 'right' },
                ],
                loading: false,
                search: ""
            },
        },
        trucks
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
            } else if (data.type && data.val == true) this.modals[data.type].show = true
        },
        showSnackBar(data) {
            const {color, text} = data
            this.snackbar.show = false
            setTimeout(() => {
                this.snackbar.color = color
                this.snackbar.text = text
                this.snackbar.show = true
            }, 100);
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