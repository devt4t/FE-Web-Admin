<template>
    <div>
        <!-- BreadCrumbs -->
        <v-breadcrumbs
            :dark="$store.state.theme == 'dark'"
            data-aos="fade-right"
            class="breadcrumbsmain"
            :items="breadcrumbs"
            divider=">"
            large
        ></v-breadcrumbs>
        <!-- Modals -->
        <FormModal :show="modals.form.show" :id="modals.form.id" :programYear="localConfig.programYear" @action="$v => modalActions($v)" @swal="$v => swalActions($v)" :key="modals.form.key"/>
        <!-- Main Table -->
        <v-data-table
            data-aos="fade-up"
            data-aos-delay="200"
            multi-sort
            :headers="table.headers"
            :items="table.items"
            :search="table.search"
            :loading="table.loading.show"
            :loading-text="table.loading.text"
            :class="`${$store.state.theme == 'dark' ? '' : ''} rounded-xl elevation-6 mx-3 pa-1`"
        >
            <!-- Toolbars -->
            <template v-slot:top>
                <v-row class="my-2 mx-2 mx-lg-3 align-center">
                    <!-- Program Year -->
                    <v-select
                        color="success"
                        item-color="success"
                        v-model="localConfig.programYear"
                        :items="$store.state.programYear.options"
                        :disabled="table.loading.show"
                        outlined
                        dense
                        hide-details
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                        rounded
                        label="Program Year"
                        class="mx-auto mr-lg-2 mb-2 mb-lg-0"
                        style="max-width: 200px"
                    ></v-select>
                    <!-- Search Field -->
                    <v-text-field
                        color="green"
                        hide-details
                        dense
                        outlined
                        rounded
                        class="mx-auto mb-2 mb-lg-0"
                        label="Search"
                        placeholder="Start type to search..."
                        append-icon="mdi-magnify"
                        v-model="table.search"
                    ></v-text-field>
                    <v-divider class="mx-2 d-none d-lg-block"></v-divider>
                    <div class="mx-auto">
                        <v-btn color="green white--text" :disabled="table.loading.show || table.items.length == 0" rounded class="mr-2" @click="() => exportExcel()">
                            <v-icon class="mr-1">mdi-microsoft-excel</v-icon>
                            Export
                        </v-btn>
                        <v-btn color="info" rounded class="pl-2" @click="() => {modals.form.show = true;modals.form.key += 1}">
                            <v-icon class="mr-1">mdi-plus-circle</v-icon>
                            Add
                        </v-btn>
                    </div>
                </v-row>
            </template>
            <!-- No -->
            <template v-slot:item.no="{index}">
                {{ index + 1 }}
            </template>
        </v-data-table>
    </div>
</template>

<script>
import FormModal from './components/FormModal.vue'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    components: {
        FormModal,
    },
    data: () => ({
        breadcrumbs: [
            {
                text: "Activities",
                disabled: true,
                href: "breadcrumbs_dashboard",
            },
            {
                text: 'Scoping Visit',
                disabled: true,
                href: "breadcrumbs_link_1",
            },
        ],
        localConfig: {
            programYear: '',
        },
        modals: {
            form: {
                show: false,
                data: null,
                key: 29291,
            }
        },
        table: {
            headers: [
                {text: 'No', value: 'no'},
                {text: 'Form No', value: 'data_no'},
                {text: 'Desa', value: 'village_name'},
                {text: 'Luas Desa', value: 'land_area'},
                {text: 'Tanggal', value: 'scooping_date'},
                {text: 'Created By', value: 'user_id'},
                {text: 'Status', value: 'is_verify'},
            ],
            items: [],
            loading: {
                show: false,
                text: 'Loading...'
            },
            search: ''
        },
        user: '',
        
    }),
    mounted() {
        this.firstAccessPage()
    },
    methods: {
        errorResponse(error) {
            console.log(error)
            if (error.response) {
                if (error.response.status) {
                    if (error.response.status == 401) {
                        localStorage.removeItem("token");
                        this.$router.push("/");
                    }
                }
            }
        },
        async firstAccessPage() {
            // set general config to local config
            this.user = this.$store.state.User
            this.localConfig.programYear = this.$store.state.programYear.model

            await this.getTableData()
        },
        async getTableData() {
            try {
                this.table.loading.show = true
                let url = this.$store.getters.getApiUrl(`GetScoopingAll`)
                const res = await axios.get(url, this.$store.state.apiConfig)
                this.table.items = res.data.data.result
                // console.log(this.table.items)
                 
            } catch (err) { this.errorResponse(err) } finally {
                this.table.loading.show = false
            }
        },
        modalActions(val) {
            if (val.type == 'close') {
                this.modals[val.name].show = false
            }
        },
        swalActions(val) {
            this.getTableData()
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 10000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: val.type,
                title: val.message
            })
        }
    },
}
</script>