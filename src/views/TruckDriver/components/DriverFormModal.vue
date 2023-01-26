<template>
    <v-dialog v-model="showModal"
            content-class="rounded-xl mx-1"
            max-width="800px"
            scrollable
            persistent
        >
            <v-card>
                <v-card-title class="mb-1 grey darken-3 rounded-xl">
                    <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-card-account-details</v-icon></v-btn> Driver Form</span>
                    <v-icon color="red lighten-1" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <!-- Loading -->
                    <v-overlay absolute :value="loading.show">
                        <div class="d-flex flex-column"></div>
                        <v-progress-circular
                        :size="80"
                        :width="10"
                        indeterminate
                        color="green"
                        >
                        </v-progress-circular>
                        <p class="mt-2 mb-0">{{ loading.text }}</p>
                    </v-overlay>
                    <!-- START: FORM -->
                    <v-row class="mt-0">
                        <!-- Program Year -->
                        <v-col cols="12" sm="12" md="6" lg="4">
                            <v-autocomplete
                                color="success"
                                hide-details
                                item-color="success"
                                item-text="name"
                                item-value="nik"
                                dense
                                v-model="inputs.programYear"
                                :items="$store.state.programYear.options"
                                :disabled="true"
                                :label="'Program Year'"
                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                    <div class="pb-2 d-flex align-center mt-4">
                        <p class="mb-0"><v-icon class="mr-2">mdi-id-card</v-icon>Biodata</p>
                        <v-divider class="mx-2"></v-divider>
                    </div>
                    <v-row>
                        <v-col cols="12" sm="12" md="12" lg="6">
                            <!-- NIK / Licence -->
                            <v-text-field
                                dense
                                :class="`${inputs.nik.model ? (inputs.nik.exist ? 'red--text' : 'green-text') : ''} mb-3`"   
                                :color="`success`"
                                hide-details
                                :label="inputs.nik.label"
                                :loading="inputs.nik.loading"
                                :no-data-text="inputs.nik.loading ? 'Loading...' : 'No Data'"
                                outlined
                                :append-icon="inputs.nik.model ? 'mdi-check' : ''"
                                rounded
                                :rules="[(v) => v.length > 2 || 'Field is required']"
                                v-model="inputs.nik.model"
                                :disabled="id"
                                @change="checkNikNoExisting"
                                @keyup="checkNikNoExisting(inputs.nik.model)"
                            ></v-text-field>
                            <!-- Upload Photo -->
                            <v-file-input
                                dense
                                color="success"
                                item-color="success"
                                outlined
                                rounded
                                hide-details
                                accept="image/png, image/jpeg, image/bmp"
                                placeholder="Image File (*max 6mb)"
                                prepend-icon="mdi-camera"
                                label="Photo KTP / Licence (*max 6mb)"
                                v-on:change="photoFileChanged"
                                :rules="[(v) => !!v || 'Field is required']"
                            ></v-file-input>
                            <v-card elevation="2" class="rounded-xl" height="300" v-if="inputs.photo.preview && inputs.photo.preview !== ''">
                                <v-img
                                    height="300"
                                    v-bind:src="inputs.photo.preview"
                                    class="my-2 mb-4 rounded-xl cursor-pointer"
                                    id="photo1"
                                    @click="showLightbox(inputs.photo.preview)"
                                ></v-img
                            ></v-card>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="6">
                            <!-- Name -->
                            <v-text-field
                                dense
                                :color="`success`"
                                class="mb-3"
                                hide-details
                                :label="inputs.name.label"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                v-model="inputs.name.model"
                            ></v-text-field>
                            <!-- Address -->
                            <v-textarea
                                :color="`success`"
                                hide-details
                                :label="inputs.address.label"
                                outlined
                                rounded
                                :rules="[(v) => !!v || 'Field is required']"
                                v-model="inputs.address.model"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" outlined rounded class="pr-3 pl-1" small @click="showModal = false"><v-icon class="mr-1">mdi-close-circle</v-icon> Close</v-btn>
                    <v-divider class="mx-2"></v-divider>
                    <v-btn color="green white--text" rounded class="px-3" small><v-icon class="mr-1">mdi-content-save-check</v-icon> Save</v-btn>
                </v-card-actions>
            </v-card>
    </v-dialog>
</template>
<script>
import moment  from 'moment'
import trucksJSON from '@/utils/trucks'
import nurseryJSON from '@/utils/nursery'
import distributionPeriodJSON from '@/utils/distributionPeriod'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: Number,
            default: 0
        }
    },
    data: () => ({
        inputs: {
            address: {
                label: 'Address',
                model: '',
            },
            name: {
                label: 'Name',
                model: '',
            },
            nik: {
                exist: false,
                label: 'NIK / Licence Number',
                loading: false,
                model: '',
            },
            photo: {
                preview: '',
                model: null
            },
        },
        loading: {
            show: false,
            text: 'Loading...'
        }
    }),
    computed: {
        showModal: {
            get: function () {
                if (this.id > 0) {
                    this.getDetailData(this.id)
                }
                
                return this.show
            },
            set: function(newVal) {
                this.$emit('close', {type: 'driver', val: newVal})
            }
        }
    },
    mounted() {
        this.inputs.programYear = this.$store.state.programYear.model
    },
    methods: {
        async getDetailData(id) {
            this.loading.show = true
            setTimeout(() => {
                this.loading.show = false
            }, 2000);
        },
        async checkNikNoExisting(val) {
            // alert(val)
        },
        // UTILITIES
        dateFormat(date, format) {
            return moment(date).format(format)
        },
        forceLogout(response) {
            if (response.status == 401) {
                localStorage.removeItem("token")
                this.$router.push("/")
            }
        },
        photoFileChanged (event) {
            if (event) {
                let fileSize = event.size / 1000000
                console.log(fileSize)
                if (fileSize < 6) {
                    this.inputs.photo.model = event
                    this.inputs.photo.preview = URL.createObjectURL(event)
                } else {
                    alert(`Please change your photo file, it's too big. Max 6mb.`)
                }
            } else {
                this.inputs.photo.model = null
                this.inputs.photo.preview = ""
            }
        },
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        },
    },
}
</script>