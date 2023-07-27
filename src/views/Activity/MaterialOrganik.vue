<template>
    <div>
        <!-- breadcrumbs -->
        <v-breadcrumbs
            :dark="$store.state.theme == 'dark'"
            data-aos="fade-right"
            class="breadcrumbsmain"
            :items="itemsbr"
            divider=">"
            large
        ></v-breadcrumbs>
        <!-- Dialog -->
        <!-- Confirmation -->
        <v-dialog v-model="dialogs.confirmation.show" max-width="500px" persistent content-class="rounded-lg" scrollable>
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
        <!-- Detail -->
        <v-dialog v-model="dialogs.detail.show" max-width="800px" persistent content-class="rounded-lg" scrollable>
            <v-card class="rounded-xl">
                <v-card-title class="mb-1 headermodalstyle">
                    <v-icon class="mr-2 white--text">mdi-information</v-icon>
                    <span>Detail</span>
                    <v-divider dark class="mx-2"></v-divider>
                    <v-icon color="red" @click="dialogs.detail.show = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text v-if="dialogs.detail.datas">
                    <v-simple-table>
                        <tbody>
                            <tr>
                                <th>No Material Organik</th>
                                <th>:</th>
                                <td>{{ dialogs.detail.datas.organic_no }}</td>
                            </tr>
                            <tr>
                                <th>Field Facilitator</th>
                                <th>:</th>
                                <td>{{ dialogs.detail.datas.ff_name }} <br>
                                    <small>{{ dialogs.detail.datas.ff_no }}</small>
                                </td>
                            </tr>
                            <tr>
                                <th>Petani</th>
                                <th>:</th>
                                <td>{{ dialogs.detail.datas.farmer_name }} <br>
                                    <small>{{ dialogs.detail.datas.farmer_no }}</small>
                                </td>
                            </tr>
                            <tr>
                                <th>Jumlah Material Organik</th>
                                <th>:</th>
                                <td>{{ numberFormat(dialogs.detail.datas.organic_amount) }} {{ dialogs.detail.datas.uom }}<br>
                                    <small>{{ dialogs.detail.datas.organic_name }}</small>
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                    <v-row>
                        <v-col cols="12" lg="6">
                            <div class="text-center my-2"><v-icon class="mr-1">mdi-image</v-icon> Signature Image</div>
                            <v-img
                                height="250"
                                v-bind:src="`${apiConfig.imageUrl}${dialogs.detail.datas.farmer_signature}`"
                                class="my-1 mb-4 cursor-pointer rounded-xl elevation-10"
                                @click="() => {showLightbox(`${apiConfig.imageUrl}${dialogs.detail.datas.farmer_signature}`, 0)}"
                            ></v-img>
                        </v-col>
                        <v-col cols="12" lg="6">
                            <div class="text-center my-2"><v-icon class="mr-1">mdi-camera</v-icon> Organic Photo</div>
                            <v-img
                                height="250"
                                v-bind:src="`${apiConfig.imageUrl}${dialogs.detail.datas.organic_photo}`"
                                class="my-1 mb-4 cursor-pointer rounded-xl elevation-10"
                                @click="() => {showLightbox(`${apiConfig.imageUrl}${dialogs.detail.datas.organic_photo}`, 0)}"
                            ></v-img>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions v-if="dialogs.detail.datas">
                    <v-divider class="mx-2"></v-divider>
                    <v-btn
                        v-if="dialogs.detail.datas.status == 0"
                        :disabled="User.role_group != 'IT' && User.role_name != 'FIELD COORDINATOR'"
                        color="green white--text"
                        class="pr-3"
                        rounded
                        @click="dialogs.confirmation.show = true;dialogs.confirmation.title = 'Ar u sure want to VERIF this data?';dialogs.confirmation.okText = 'Verif';dialogs.confirmation.model = dialogs.detail.datas.organic_no"
                    >
                        <v-icon class="mr-1">mdi-check-circle</v-icon>
                        Verification
                    </v-btn>
                    <v-btn
                        v-if="dialogs.detail.datas.status == 1"
                        :disabled="User.role_group != 'IT' && User.role_name != 'UNIT MANAGER'"
                        color="red white--text"
                        class="pr-3"
                        rounded
                        @click="dialogs.confirmation.show = true;dialogs.confirmation.title = 'Ar u sure want to UNVERIF this data?';dialogs.confirmation.okText = 'Unverif';dialogs.confirmation.model = dialogs.detail.datas.organic_no"
                    >
                        <v-icon class="mr-1">mdi-close-circle</v-icon>
                        Unverif
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Add -->
        <v-dialog v-model="dialogs.add.show" max-width="800px" persistent content-class="rounded-lg" scrollable>
            <v-card class="rounded-xl">
                <v-card-title class="mb-1 headermodalstyle">
                    <v-icon class="mr-2 white--text">mdi-plus-circle</v-icon>
                    <span>Add</span>
                    <v-divider dark class="mx-2"></v-divider>
                    <v-icon color="red" @click="dialogs.add.show = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-row class="ma-0">
                        <!-- Photo 1 File -->
                        <v-col cols="12" sm="12" md="6" lg="6">
                            <v-file-input
                            color="success"
                            item-color="success"
                            outlined
                            rounded
                            hide-details
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Photo 1"
                            prepend-icon="mdi-camera"
                            label="Photo 1 (*max 6mb)"
                            v-on:change="photo1FileChanged"
                            :rules="[(v) => !!v || 'Field is required']"
                            ></v-file-input>
                            <v-card elevation="2" class="rounded-xl" height="300" v-if="dialogs.add.inputs.photo1.preview && dialogs.add.inputs.photo1.preview !== ''">
                                <v-img
                                    height="300"
                                    v-bind:src="dialogs.add.inputs.photo1.preview"
                                    class="my-2 mb-4 rounded-xl cursor-pointer"
                                    id="photo1"
                                    @click="showLightbox(dialogs.add.inputs.photo1.preview)"
                                ></v-img
                            ></v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-divider class="mx-2"></v-divider>
                    <v-btn color="green white--text" rounded class="px-4">
                        <v-icon class="mr-1">mdi-content-save-check</v-icon>
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- END: Dialog -->
        
        <!-- main table -->
        <v-data-table
            data-aos="fade-up"
            data-aos-delay="200"
            multi-sort
            :headers="land_program.model == 'Petani' ? tables.main.headers : tables.main.headers2"
            :items="tables.main.items"
            :search="tables.main.search"
            :loading="tables.main.loading"
            :loading-text="tables.main.loadingText"
            :class="`${$store.state.theme == 'dark' ? '' : ''} rounded-xl elevation-6 mx-3 pa-1`"
            @update:page="($p) => tables.main.page = $p"
            @update:items-per-page="($p) => tables.main.itemsPerPage = $p"
            @current-items="($p) => checkCurrentItems($p)"
            :footer-props="{
              itemsPerPageText: 'Jumlah Data Per Halaman',
              itemsPerPageOptions: [10, 25, 40, -1],
              showCurrentPage: true,
              showFirstLastPage: true,
            }"
        >
            <!-- Toolbars -->
            <template v-slot:top>
                <v-row class="my-2 mx-2 mx-lg-3 align-center">
                    <!-- Program Year -->
                    <v-select
                        color="success"
                        item-color="success"
                        v-model="programYear"
                        :items="$store.state.programYear.options"
                        :disabled="tables.main.loading"
                        outlined
                        dense
                        hide-details
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                        rounded
                        label="Tahun Program"
                        class=""
                        style="max-width: 200px"
                    ></v-select>
                    <!-- Land Program -->
                    <v-select
                        color="success"
                        item-color="success"
                        v-model="land_program.model"
                        :items="land_program.options"
                        :disabled="land_program.disabled"
                        outlined
                        dense
                        hide-details
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                        rounded
                        label="Program Lahan"
                        class="ml-2"
                        style="max-width: 200px"
                    ></v-select>
                    <v-divider class="mx-2"></v-divider>
                    <!-- Search Field -->
                    <v-text-field
                        color="green"
                        hide-details
                        dense
                        outlined
                        rounded
                        label="Pencarian"
                        placeholder="Start type to search..."
                        append-icon="mdi-magnify"
                        v-model="tables.main.search"
                    ></v-text-field>
                </v-row>
                <v-row class="mx-2 mx-lg-3 mb-0 align-center">
                    <!-- Organic Type -->
                    <v-select
                        color="success"
                        item-color="success"
                        v-model="organicType"
                        :items="['Pupuk', 'Pestisida']"
                        :disabled="tables.main.loading"
                        outlined
                        dense
                        hide-details
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                        rounded
                        label="Tipe Material Organik"
                        class=""
                        style="max-width: 200px"
                    ></v-select>
                    <v-divider class="mx-2"></v-divider>
                    <v-btn color="green white--text" :disabled="tables.main.loading" rounded class="pl-2" @click="() => exportExcel()">
                        <v-icon class="mr-1">mdi-microsoft-excel</v-icon>
                        Export
                    </v-btn>
                    <v-btn v-if="land_program.model == 'Umum'" color="info" rounded class="pl-2" @click="dialogs.add.show = true">
                        <v-icon class="mr-1">mdi-plus-circle</v-icon>
                        Add
                    </v-btn>
                </v-row>
            </template>
            <!-- No Columns -->
            <template v-slot:item.no="{ index }">
                {{ (tables.main.itemsPerPage * (tables.main.page-1)) + index + 1 }}
            </template>
            <!-- Created At Column -->
            <template v-slot:item.created_at="{item}">
                {{ dateFormat(item.created_at, 'DD MMMM Y, H:ss') }}
            </template>
            <!-- Amount Column -->
            <template v-slot:item.organic_amount="{item}">
                {{ numberFormat(item.organic_amount) }} {{ item.uom }}
            </template>
            <!-- Status Column -->
            <template v-slot:item.status="{item}">
                <v-chip
                    :color="`${item.status ? 'green' : 'red'} white--text`"
                    class="pl-1"
                >
                    <v-icon class="mr-1">mdi-{{ item.status ? 'check' : 'close' }}-circle</v-icon>
                    {{ item.status ? 'Verified' : 'Unverified' }}
                </v-chip>
            </template>
            <!-- Actions Column -->
            <template v-slot:item.actions="{item}">
                <v-menu
                    rounded="xl"
                    bottom
                    left
                    offset-y
                    transition="slide-y-transition"
                    :close-on-content-click="false"
                >
                    <template v-slot:activator="{on, attrs}">
                        <v-icon v-bind="attrs" v-on="on">mdi-arrow-down-drop-circle</v-icon>
                    </template>
                    <v-card class="rounded-xl px-2 py-2 d-flex flex-column align-stretch">
                        <v-btn
                            color="blue white--text"
                            rounded
                            small
                            @click="dialogs.detail.show = true;dialogs.detail.datas = item;"
                        >
                            <v-icon small class="mr-1">mdi-information</v-icon>
                            Detail
                        </v-btn>
                        <v-btn
                            color="red white--text"
                            class="mt-2"
                            rounded
                            small
                            :disabled="item.status == 1"
                            @click="dialogs.confirmation.show = true;dialogs.confirmation.title = 'Ar u sure want to PERMANENT DELETE this data?';dialogs.confirmation.okText = 'Delete';dialogs.confirmation.model = item.organic_no"
                        >
                            <v-icon small class="mr-1">mdi-delete</v-icon>
                            Delete
                        </v-btn>
                    </v-card>
                </v-menu>
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
import moment from 'moment'

export default {
    data: () => ({
        apiConfig: {
            baseUrl: localStorage.getItem('BaseUrlGet'),
            imageUrl: localStorage.getItem('BaseUrl'),
            token: localStorage.getItem('token'),
        },
        dialogs: {
            confirmation: {
                model: '',
                okText: '',
                show: false,
                title: 'Confirmation',
            },
            detail: {
                datas: null,
                loading: false,
                show: false
            },
            add: {
                inputs: {
                    photo1: {
                        model: null,
                        preview: null
                    }
                },
                loading: false,
                show: false,
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
        land_program: {
            model: 'Petani',
            options: ['Petani', 'Umum'],
            disabled: true
        },
        programYear: '',
        organicType: 'Pupuk',
        snackbar: {
            color: '',
            show: false,
            text: '',
            timeout: 10000,
        },
        tables: {
            main: {
                page: 1,
                itemsPerPage: 10,
                headers: [
                    { text: "No", value: "no", width: '70' },
                    { text: "No Material Organik", value: "organic_no" },
                    { text: "Tanggal", value: "created_at" },
                    { text: "Nama FF", value: "ff_name" },
                    { text: "Nama Petani", value: "farmer_name" },
                    { text: "Nama Material Organik", value: "organic_name", align: 'center' },
                    { text: "Jumlah Material Organik", value: "organic_amount" },
                    { text: "Status", value: "status", align: 'center' },
                    { text: "Actions", value: "actions", align: 'right' },
                ],
                headers2: [
                    { text: "No", value: "no", width: '70' },
                    { text: "No MOU", value: "mou_no" },
                    { text: "Tanggal", value: "created_at" },
                    { text: "PIC T4T", value: "employee_name" },
                    { text: "PIC Lahan", value: "pic_lahan" },
                    { text: "Nama Material Organik", value: "organic_name", align: 'center' },
                    { text: "Jumlah Material Organik", value: "organic_amount" },
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
    watch: {
        'programYear': {
            async handler() {
                await this.getMainTableData()
            }
        },
        'organicType': {
            async handler() {
                await this.getMainTableData()
            }
        },
        'land_program.model': {
            async handler() {
                await this.getMainTableData()
            }
        }
    },
    async mounted() {
        await this.firstAccessPage()
    },
    destroyed() {
        this.$store.state.loadingOverlay = false
        this.$store.state.loadingOverlayText = null
    },
    methods: {
        async confirmationOk(type) {
            let url = ''
            const datas = {
                organic_no: this.dialogs.confirmation.model,
                verified_by: this.User.email,
            }
            if (type == 'Verif') {
                datas.status = 1
                url = 'Validate'
            } else if (type == 'Unverif') {
                datas.status = 0
                url = 'Unvalidate'
            } else {
                url = type
            }

            this.dialogs.confirmation.show = false
            this.dialogs.detail.show = false
            this.$store.state.loadingOverlayText = `${type} Data...`
            this.$store.state.loadingOverlay = true

            await axios.post(
                `${this.apiConfig.baseUrl + url}Organic`,
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
        checkCurrentItems(items) {
        },
        dateFormat(date, format) {
            return moment(date).format(format)
        },
        async exportExcel() {
            try {
                let params = new URLSearchParams({
                    token: localStorage.getItem('token'),
                    program_year: this.programYear,
                    land_program: this.land_program.model,
                    organic_type: this.organicType
                })

                if (this.User.ff.ff) if (this.User.ff.ff != '-') if (this.User.ff.ff.length > 0) params.set('ff', this.User.ff.ff.toString())

                const url = this.$store.getters.getApiUrl(`ExportMaterialOrganic?${params}`);

                window.open(url, '_blank');
            } catch (err) {
                this.sessionEnd(err)
            }
        },
        async firstAccessPage() {
            this.programYear = this.$store.state.programYear.model
            await this.getMainTableData()
        },
        async getMainTableData() {
            this.tables.main.loadingText = 'Getting Data...'
            this.tables.main.loading = true
            this.tables.main.items = []

            let params = {
                program_year: this.programYear,
                type: this.organicType,
                typegetdata: this.User.ff.value_data,
                ff_no: this.User.ff.ff
            }
            let url = 'GetOrganicAllAdmin'
            if (this.land_program.model == 'Umum') url = 'GetOrganicLahanUmumAllAdmin'
            await axios.get(
                `${this.apiConfig.baseUrl}${url}?${new URLSearchParams(params)}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.apiConfig.token}` 
                    },
                }
            ).then(response => {
                const res = response.data.data.result
                this.tables.main.items = res 
            }).catch(err => {
                this.sessionEnd(err)
            }).finally(() => {
                this.tables.main.loading = false
            })
        },
        numberFormat(num) {
            return new Intl.NumberFormat('id-ID').format(num)
        },
        photo1FileChanged (event) {
            if (event) {
                let fileSize = event.size / 1000000
                console.log(fileSize)
                if (fileSize < 6) {
                    this.dialogs.add.inputs.photo1.model = event
                    this.dialogs.add.inputs.photo1.preview = URL.createObjectURL(event)
                } else {
                    alert(`Please change your photo file, it's too big. Max 6mb.`)
                }
            } else {
                this.dialogs.add.inputs.photo1.model = null
                this.dialogs.add.inputs.photo1.preview = ""
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
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        },
    }
}
</script>