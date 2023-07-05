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
        <FormModal :show="modals.form.show" :id="modals.form.data" :programYear="localConfig.programYear" @action="$v => modalActions($v)" @swal="$v => swalActions($v)" :key="modals.form.key"/>
        <DetailModal :show="modals.detail.show" :id="modals.detail.data" :programYear="localConfig.programYear" @action="$v => modalActions($v)" @swal="$v => swalActions($v)" :key="modals.detail.key"/>
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
                        <v-btn color="green white--text" :disabled="table.loading.show || table.items.length == 0 || true" rounded class="mr-2" @click="() => exportExcel()">
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
            <!-- Tanggal Column -->
            <template v-slot:item.rra_pra_date_start="{item}">
                {{ _utils.dateFormat(item.rra_pra_date_start, 'DD MMMM Y') }}
                <span v-if="item.rra_pra_date_start != item.rra_pra_date_end">
                    ~
                    {{ _utils.dateFormat(item.rra_pra_date_end, 'DD MMMM Y') }}
                </span>
            </template>
            <!-- Status Column -->
            <template v-slot:item.is_verify="{item}">
                <v-chip :color="item.is_verify == 1 ? 'green' : 'red'" class="white--text pl-1">
                <v-icon class="mr-1">mdi-{{ item.is_verify  == 1 ? 'check' : 'close' }}-circle</v-icon>
                {{ item.is_verify == 1 ? 'Verified' : 'Unverified' }}
                </v-chip>
            </template>
            <!-- Action Column -->
            <template v-slot:item.actions="{ item }">
                <v-menu content-class="rounded-xl">
                <template v-slot:activator="{attrs, on}">
                    <v-btn v-bind="attrs" v-on="on" small fab icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-card class="pa-2 d-flex align-stretch flex-column justify-center">
                    <v-btn color="info white--text" rounded small class="pl-1 d-flex justify-start align-center" @click="() => showModal('detail', item)">
                        <v-icon class="mr-1">mdi-information</v-icon> Detail
                    </v-btn>
                    <v-btn color="orange white--text" rounded small class="pl-1 mt-1 d-flex justify-start align-center" 
                        :disabled="item.is_verify === 1"
                        @click="() => {showModal('form', item)}">
                        <v-icon class="mr-1">mdi-pencil-circle</v-icon> Edit
                    </v-btn>
                </v-card>
                </v-menu>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'

import FormModal from './components/FormModal.vue'
import DetailModal from './components/DetailModal.vue'

export default {
    components: {
        FormModal,
        DetailModal
    },
    data: () => ({
        breadcrumbs: [
            {
                text: "Main Data",
                disabled: true,
                href: "breadcrumbs_dashboard",
            },
            {
                text: "RRA & PRA",
                disabled: true,
                href: "breadcrumbs_link_1",
            },
        ],
        modals: {
            detail: {
                show: false,
                data: null,
                key: 8990458,
            },
            form: {
                id: null,
                show: false,
                data: null,
                key: 7892345,
            }
        },
        localConfig: {
            programYear: '',
        },
        table: {
            headers: [
                {text: 'No', value: 'no'},
                {text: 'Form No', value: 'form_no'},
                {text: 'Tanggal', value: 'rra_pra_date_start'},
                {text: 'PIC Email', value: 'user_id'},
                {text: 'Status', value: 'is_verify', align: 'center'},
                {text: 'Actions', value: 'actions', align: 'right'},
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
        async errorResponse(error) {
            console.log(error)
            if (error.response) {
                if (error.response.status) {
                    if (error.response.status == 401) {
                        const confirm = await Swal.fire({
                            title: 'Session Ended!',
                            text: "Please login again.",
                            icon: 'warning',
                            confirmButtonColor: '#2e7d32',
                            confirmButtonText: 'Okay'
                        })
                        if (confirm) {
                            localStorage.removeItem("token");
                            this.$router.push("/");
                        }
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
                let url = this.$store.getters.getApiUrl(`GetRraPraAll`)
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
                this.modals[val.name].data = null
            }
        },
        async showModal(name, data) {
            this.modals[name].data = await data.form_no
            this.modals[name].show = await true
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