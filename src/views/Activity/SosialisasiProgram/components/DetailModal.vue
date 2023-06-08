<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="1200"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-document</v-icon></v-btn> RRA PRA Form #{{ this.id }}</span>
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text class="pa-0" style="min-height: 300px;">
                <!-- Loading -->
                <v-overlay absolute :value="loading.show">
                    <div class="d-flex flex-column justify-center align-center">
                        <LottieAnimation
                            ref="anim"
                            :animationData="lottie.data.loading"
                            :loop="true"
                            style="height: 64px;"
                        />
                        <p class="mt-2 mb-0">{{ loading.text }}
                            <v-progress-circular
                                :size="17"
                                :width="3"
                                indeterminate
                                color="white"
                            >
                            </v-progress-circular>
                        </p>
                    </div>
                </v-overlay>
                <div v-if="datas">
                    <!-- Global data -->
                    <v-row class="ma-0 mx-2 mx-lg-4">
                        <v-col cols="12" md="12" lg="7">
                            <v-card class="rounded-lg" data-aos="fade-down" :key="`location_card-${showModal}`">
                                <v-card-title class="grey darken-3 white--text pa-1 px-3">
                                    <span style="font-size: 13px">
                                        <v-icon color="white">mdi-map-marker</v-icon>
                                        Lokasi Desa
                                    </span>
                                </v-card-title>
                                <v-card-text class="pa-3">
                                    <v-row>
                                        <v-col cols="12" md="6" lg="3">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    Provinsi
                                                </span>
                                                <h4>
                                                    {{ datas.Scooping.province_name || '-' }}
                                                </h4>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" md="6" lg="3">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    Kabupaten
                                                </span>
                                                <h4>
                                                    {{ datas.Scooping.city_name || '-' }}
                                                </h4>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" md="6" lg="3">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    Kecamatan
                                                </span>
                                                <h4>
                                                    {{ datas.Scooping.district_name || '-' }}
                                                </h4>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" md="6" lg="3">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    Desa
                                                </span>
                                                <h4>
                                                    {{ datas.Scooping.village_name || '-' }}
                                                </h4>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="12" lg="5">
                            <v-card class="rounded-lg" data-aos="fade-down" :key="`date_period_card-${showModal}`">
                                <v-card-title class="grey darken-3 white--text pa-1 px-3">
                                    <span style="font-size: 13px">
                                        <v-icon color="white">mdi-calendar</v-icon>
                                        Tanggal RRA - PRA
                                    </span>
                                </v-card-title>
                                <v-card-text class="pa-3">
                                    <v-row>
                                        <v-col cols="12">
                                            <v-card class="pa-2 elevation-0">
                                                <span class="grey--text text--darken-2" style="font-size: 13px">
                                                    {{ getIntervalDay(datas.RRA.rra_pra_date_start, datas.RRA.rra_pra_date_end) + 1 }} Hari
                                                </span>
                                                <h4>
                                                    {{ _utils.dateFormat(datas.RRA.rra_pra_date_start, 'DD MMMM YYYY') || '-' }}
                                                    <span v-if="datas.RRA.rra_pra_date_start != datas.RRA.rra_pra_date_end">
                                                        ~
                                                        {{ _utils.dateFormat(datas.RRA.rra_pra_date_end, 'DD MMMM YYYY') || '-' }}
                                                    </span>
                                                </h4>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <!-- Stepper -->
                    <v-stepper :vertical="localConfig.windowWidth < localConfig.breakLayoutFrom" v-model="stepper.model" class="rounded-xl mt-2 elevation-0">
                        <!-- Stepper Header -->
                        <v-stepper-header v-if="localConfig.windowWidth >= localConfig.breakLayoutFrom" class="elevation-0 mx-5">
                            <template v-for="(stepperName, stepperIndex) in stepper.steps">
                                <v-stepper-step
                                    :complete="stepper.model > stepperIndex + 1"
                                    :step="stepperIndex + 1"
                                    editable
                                    color="green"
                                    class="rounded-pill"
                                >
                                    <span>
                                        <v-icon :color="stepper.model > stepperIndex + 1 ? 'green' : ''" class="mr-1">mdi-{{ stepper.steps_icon[stepperIndex] }}</v-icon> 
                                        {{ stepperName }}
                                    </span>
                                </v-stepper-step>

                                <v-divider
                                    v-if="(stepperIndex + 1) !== stepper.steps.length"
                                    data-aos="fade-right"
                                    :data-aos-delay="200 * stepperIndex + 100"
                                    :key="(stepperIndex + 1)"
                                ></v-divider>
                            </template>
                        </v-stepper-header>
                        <!-- Stepper Content -->
                        <v-stepper-items>
                            <div v-for="(stepperName, stepperIndex) in stepper.steps">
                                <!-- RRA -->
                                <v-stepper-step v-if="localConfig.windowWidth < localConfig.breakLayoutFrom && stepper.steps.length >= 1" color="green" :complete="stepper.model > 1" :step="1" editable class="rounded-xl py-3 ma-1">
                                    <span><v-icon :color="stepper.model > (stepperIndex + 1) ? 'green' : ''" class="mr-1">mdi-{{ stepper.steps_icon[stepperIndex] }}</v-icon>{{ stepper.steps[stepperIndex] }}</span>
                                </v-stepper-step>
                                <v-stepper-content
                                    v-if="stepper.steps.length >= (stepperIndex + 1)"
                                    class="pt-0"
                                    :step="stepperIndex + 1"
                                >
                                    <v-card
                                        class="ma-1 rounded-xl"
                                        min-height="250px"
                                    >
                                        <v-card-text>
                                            <div v-for="(data, dataIndex) in groupingData[stepperName]">
                                                <div class="d-flex align-center my-8" v-if="data.label">
                                                    <p class="mb-0 grey--text text--darken-3" style="font-size: 17px"><v-icon class="mr-2">{{ data.labelIcon }}</v-icon>{{ data.label }}</p>
                                                    <v-divider class="mx-2" color=""></v-divider>
                                                </div>
                                                <!-- {{ datas[stepperName][data.dataKey] }} -->
                                                <!-- table -->
                                                <div v-if="data.dataType === 'table'">
                                                    <v-data-table
                                                        :caption="data.table.caption"
                                                        multi-sort
                                                        :hide-default-footer="data.table.hideDefaultFooter"
                                                        :headers="data.table.headers"
                                                        :items="datas[data.dataSource || stepperName][data.dataKey]"
                                                        :items-per-page="data.table.itemsPerPage"
                                                        :class="`rounded-xl elevation-6 mx-2 mx-lg-3 pa-1 elevation-3 overflow-hidden mt-4`"
                                                        :show-expand="data.table.expand"
                                                    >
                                                        <!-- Table Index -->
                                                        <template v-slot:item.index="{index}">
                                                            {{ index + 1 }}
                                                        </template>
                                                    </v-data-table>
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-stepper-content>
                            </div>
                        </v-stepper-items>
                    </v-stepper>
                </div>
            </v-card-text>
            <v-card-actions class="justify-center" v-if="verificationAccess">
                <v-btn v-if="verified_data == 0" rounded color="green" outlined class="pr-4" @click="() => confirmVerification('verify')"><v-icon class="mr-1">mdi-check-circle</v-icon> Verifikasi</v-btn>
                <v-btn v-if="verified_data == 1" rounded color="red" outlined class="pr-4" @click="() => confirmVerification('unverif')"><v-icon class="mr-1">mdi-close-circle</v-icon> Unverifikasi</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import LottieAnimation from 'lottie-web-vue'
import Swal from 'sweetalert2'

import formOptions from '@/assets/json/rraPraOptions.json'
import treeAnimation from '@/assets/lottie/tree.json'

export default {
    components: {
        LottieAnimation,
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: '0'
        }
    },
    data: () => ({
        datas: null,
        groupingData: {
            "List Petani": [
                {
                    label: 'List Petani',
                    labelIcon: 'mdi-flower',
                    dataType: 'table',
                    dataSource: 'PRA',
                    dataKey: '',
                    table: {
                        hideDefaultFooter: true,
                        itemsPerPage: -1,
                        headers: [
                            {text: 'No', value: 'index', width: 70, sortable: false},
                        ]
                    }
                },
            ]
        },
        verified_data: 0,
        loading: {
            show: false,
            text: 'Loading...'
        },
        localConfig: {
            windowWidth: window.innerWidth,
            breakLayoutFrom: 1140,
            maxSubDataTotal: 5,
            requiredInputIcon: 'mdi-star'
        },
        lottie: {
            data: {
                loading: treeAnimation,
            }
        },
        stepper: {
            model: 1,
            steps: ['List Petani'],
            steps_icon: ['account-group']
        },
    }),
    computed: {
        showModal: {
            get: function () {
                if (this.show) {
                    
                    if (this.id) {
                        this.getData(this.id)
                    }
                }
                return this.show
            },
            set: function(newVal) {
                if (!newVal) this.$emit('action', {type: 'close', name: 'detail'})
            }
        },
        verificationAccess() {
            const user = this.$store.state.User
            const role_group = user.role_group
            const role_name = user.role_name
            if (role_group == 'IT') return true
            if (role_name == 'SOCIAL OFFICER') return true
            return false
        }
    },
    watch: {
        'stepper.model': {
            handler(val) {
                // console.log(val)
            }
        }
    },
    methods: {
        confirmVerification(type) {
            const url = type == 'verify' ? 'VerificationRraPra' : 'UnverificationRraPra'
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2e7d32',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Tidak Jadi',
                confirmButtonText: 'Ya, Lanjutkan!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.loading.show = true
                    this.loading.text = `${type == 'verify' ? 'Verifying' : 'Unverifying'} data...`
                    axios.post(this.$store.getters.getApiUrl(url), {form_no: this.id, verified_by: this.$store.state.User.email}, this.$store.state.apiConfig)
                    .then(res => {
                        Swal.fire({
                            title: 'Verified!',
                            text: `Scooping data #${this.id} has been verified.`,
                            icon: 'success',
                            confirmButtonColor: '#2e7d32',
                        })
                        this.getData(this.id)
                        this.$emit('swal', {type: 'success', message: `Data ${type == 'verify' ? 'Verified' : 'Unverified'}!`})
                    }).catch(err => {
                        this.errorResponse(err)
                        Swal.fire({
                            title: 'Failed!',
                            text: `Failed to proceed.`,
                            icon: 'error',
                            confirmButtonColor: '#f44336',
                        })
                    }).finally(() => {
                        this.loading.show = false
                        this.loading.text = 'Loading...'
                    })
                }
            })
        },
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
                    if (error.response.status === 500 || error.response.status === 400) {
                        let errMessage = error.response.data.message
                        if (errMessage) if (errMessage.includes("Duplicate entry")) errMessage = 'Data sudah ada!' 
                        Swal.fire({
                            title: 'Error!',
                            text: `${errMessage || error.message}`,
                            icon: 'error',
                            confirmButtonColor: '#f44336',
                        })
                    }
                }
            }
        },
        async getData(id) {
            try {
                this.loading.show = true
                this.loading.text = `Getting Form "${id}" data...`
                const res = await axios.get(this.$store.getters.getApiUrl(`DetailFormMinat?form_no=${id}`), this.$store.state.apiConfig)
                this.datas = res.data.data.result
                for (const [key, val] of Object.entries(this.datas)) {
                }
                this.stepper.model = 2
                this.verified_data = this.datas.RRA.is_verify
                console.log(this.verified_data)
            } catch (err) {
                this.errorResponse(err)
                this.$emit('action', {type: 'close', name: 'detail'})
            } finally {
                this.loading.show = false
            }
        },
        getIntervalDay(start, end) {
            const startDate = moment(start);
            const endDate = moment(end);

            const duration = moment.duration(endDate.diff(startDate));
            const days = duration.asDays();
            return days
        },
        indonesianify(eng) {
            if (eng === 'north') return 'Utara'
            if (eng === 'east') return 'Timur'
            if (eng === 'south') return 'Selatan'
            if (eng === 'west') return 'Barat'

            return '??'
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        },
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        },
        whatsappPhone(no) {
            return no.replace(/^0/, "62");
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
    }
}
</script>