<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="800"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-document</v-icon></v-btn> Scoping Visit #{{ this.id }}</span>
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
                <!-- data -->
                <div 
                    v-for="data in datas" 
                    :key="data.title">
                    <v-row class="ma-0 mx-2">
                        <v-col cols="12">
                            <div class="d-flex align-center">
                                <p class="mb-0"><v-icon class="mr-2">{{ data.icon }}</v-icon>{{ data.title }}</p>
                                <v-divider class="mx-2"></v-divider>
                            </div>
                        </v-col>
                        <v-col v-for="item in data.items" 
                            :key="item.key"
                            cols="12" :lg="item.lg" :md="item.md"
                        >
                            <span v-html="item.title"></span>
                            <h4>
                                <v-progress-circular
                                    :size="17"
                                    :width="3"
                                    indeterminate
                                    v-if="loading.show"
                                >
                                </v-progress-circular>
                                <span v-else>
                                    <span v-if="item.model">
                                        <span v-if="item.type == 'Multiple'">{{ item.model.replaceAll(',', ', ') }}</span>
                                        <span v-else>{{ item.model }}</span>
                                        <span v-if="item.suffix" v-html="item.suffix" class="ml-1"></span>
                                    </span>
                                    <span v-else>-</span>
                                </span>
                            </h4>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn rounded color="green" outlined class="pr-4" @click="() => confirmVerification('verify')"><v-icon class="mr-1">mdi-check-circle</v-icon> Verifikasi</v-btn>
                <!-- <v-btn rounded color="red" outlined class="pr-4" @click="() => confirmVerification('unverif')"><v-icon class="mr-1">mdi-close-circle</v-icon> Unverifikasi</v-btn> -->
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
        LottieAnimation
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
        datas: [
            {
                title: 'Lokasi & Tanggal Scooping Visit',
                icon: 'mdi-city',
                items: [
                    {
                        key: 'province_name',
                        title: 'Provinsi',
                        model: null,
                        type: 'String',
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'city_name',
                        title: 'Kabupaten / Kota',
                        model: null,
                        type: 'String',
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'district_name',
                        title: 'Kecamatan',
                        model: null,
                        type: 'String',
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'village_name',
                        title: 'Desa',
                        model: null,
                        type: 'String',
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'scooping_date',
                        title: 'Tanggal Scooping',
                        model: null,
                        type: 'Date',
                        lg: 4,
                        md: 6
                    },
                ]
            },
            {
                title: 'Scooping Data',
                icon: 'mdi-text-box',
                items: [
                    {
                        key: 'land_area',
                        title: 'Luas Desa',
                        model: null,
                        type: 'Number',
                        suffix: `m<sup>2</sup>`,
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'dry_land_area',
                        title: 'Luas Lahan Kering',
                        model: null,
                        type: 'Number',
                        suffix: `m<sup>2</sup>`,
                        lg: 4,
                        md: 6
                    },
                    {
                        key: 'land_type',
                        title: 'Tipe Lahan',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'land_height',
                        title: 'Ketinggian Lahan (mdpl)',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'land_slope',
                        title: 'Kelerengan Lahan (<sup>o</sup>)',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'vegetation_density',
                        title: 'Kerapatan Vegetasi',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'land_coverage',
                        title: 'Tutupan Lahan',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'government_place',
                        title: 'Tempat Pemerintahan',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'electricity_source',
                        title: 'Sumber Listrik',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'water_source',
                        title: 'Sumber Air',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                    {
                        key: 'agroforestry_type',
                        title: 'Tipe Agroforestry',
                        model: null,
                        type: 'Multiple',
                        lg: 12,
                        md: 12
                    },
                ]
            },
            {
                title: 'Log',
                icon: 'mdi-clock',
                items: [
                    {
                        key: 'created_at',
                        title: 'Dibuat',
                        model: null,
                        type: 'Time',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'user_id',
                        title: 'Dibuat Oleh',
                        model: null,
                        type: 'Time',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'updated_at',
                        title: 'Terakhir Dirubah',
                        model: null,
                        type: 'Time',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'updated_by',
                        title: 'Terakhir Dirubah Oleh',
                        model: null,
                        type: 'Time',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'verified_at',
                        title: 'Diverifikasi',
                        model: null,
                        type: 'Time',
                        lg: 6,
                        md: 6
                    },
                    {
                        key: 'verified_by',
                        title: 'Diverifikasi Oleh',
                        model: null,
                        type: 'Time',
                        lg: 6,
                        md: 6
                    },
                ]
            }
        ],
        loading: {
            show: false,
            text: 'Loading...'
        },
        lottie: {
            data: {
                loading: treeAnimation,
            }
        },
    }),
    computed: {
        showModal: {
            get: function () {
                if (this.show) {
                    if (this.id) this.getData(this.id)
                }
                return this.show
            },
            set: function(newVal) {
                if (!newVal) this.$emit('action', {type: 'close', name: 'detail'})
            }
        },
    },
    methods: {
        confirmVerification() {
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
                    this.loading.text = 'Verifying data...'
                    axios.post(this.$store.getters.getApiUrl('VerificationScooping'), {data_no: this.id}, this.$store.state.apiConfig)
                    .then(res => {
                        Swal.fire({
                            title: 'Verified!',
                            text: `Scooping data #${this.id} has been verified.`,
                            icon: 'success',
                            confirmButtonColor: '#2e7d32',
                        })
                        this.getData(this.id)
                        this.$emit('action', {type: 'refresh-table'})
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
        async getData(id) {
            try {
                this.loading.show = true
                this.loading.text = `Getting scooping ${this.id} data...`

                const res = await axios.get(this.$store.getters.getApiUrl(`GetDetailScooping?data_no=${id}`), this.$store.state.apiConfig)
                const data = res.data.data.result
                
                for (const [key, value] of Object.entries(data)) {
                    this.datas.forEach(localData => {
                        const findData = localData.items.find(scopingData => scopingData.key === key)
                        if (findData) findData.model = value
                    });
                }
                console.log(data)
            } catch (err) {
                this.errorResponse(err)
                this.$emit('action', {type: 'close', name: 'detail'})
            } finally {
                this.loading.show = false
            }
        },
    }
}
</script>