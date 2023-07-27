<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="1200"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-document-edit</v-icon></v-btn> Form Field Coordinator</span>
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text class="pa-0">
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
                <!-- NB -->
                <v-row class="ma-0 mx-5">
                    <v-col cols="12" class="d-flex justify-end">
                        <p class="mb-0 red--text">Tanda "<v-icon color="red" class="">{{ localConfig.requiredInputIcon }}</v-icon>" menandakan WAJIB DIISI.</p>
                    </v-col>
                </v-row>
                <!-- Dynamic Inputs -->
                <v-row class="ma-0 mx-5" v-for="(ig, igIndex) in inputsGroup" :key="`IG-${igIndex}`"
                    v-if="showFormInputs(ig)"
                >
                    <!-- Title -->
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">{{ ig.icon }}</v-icon>{{ ig.title }}</p>
                            <v-divider class="mx-2"></v-divider>
                            <v-btn v-if="ig.title === 'Kelengkapan Data Lahan Kering' && editId && $store.state.User.role_name != 'GIS STAFF'" 
                                :disabled="emailToGis > 1"
                                rounded 
                                color="blue white--text" 
                                small 
                                @click="() => sendEmailToGIS(editId)"
                                ><v-icon class="mr-1">mdi-email-{{ emailToGis > 1 ? 'check' : 'arrow-right' }}</v-icon>Email to GIS</v-btn>
                        </div>
                    </v-col>
                    <!-- Inputs -->
                    <v-col v-for="(itemKey, iKIndex) in ig.items_key" :key="`Inputs-${itemKey}-${iKIndex}`" cols="12" sm="12" :md="inputs[itemKey].lgView == 12 ? 12 : 6" :lg="inputs[itemKey].lgView" >
                        <!-- Khususon: potential_description -->
                        <div v-if="itemKey === 'potential_description'">
                            <label for="">
                                <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                {{ inputs[itemKey].label }} 
                                <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </label>
                            <VueEditor v-if="inputs.potential_dusun.model !== null && inputs.potential_dusun.model > 0" 
                                placeholder="Deskripsi / alasan dusun berpotensi"
                                v-model="inputs.potential_description.model"
                            />
                            <v-textarea v-else hide-details disabled outlined class="rounded-xl" placeholder="Deskripsi disabled. Total dusun berpotensi 0."></v-textarea>
                        </div>
                        <!-- autocomplete -->
                        <v-autocomplete
                            v-else-if="inputs[itemKey].inputType == 'autocomplete'"
                            dense
                            :multiple="inputs[itemKey].type == 'Multiple'"
                            color="success"
                            hide-details
                            item-color="success"
                            :item-text="inputs[itemKey].itemText"
                            :item-value="inputs[itemKey].itemValue"
                            :items="inputs[itemKey].items"
                            :label="inputs[itemKey].label"
                            :loading="inputs[itemKey].loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs[itemKey].loading ? 'Loading...' : 'No Data'"
                            outlined
                            rounded
                            v-model="inputs[itemKey].model"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                {{ inputs[itemKey].label }} 
                                <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                        </v-autocomplete>
                        <!-- datepicker -->
                        <v-menu 
                            v-else-if="inputs[itemKey].inputType == 'datepicker'"
                            rounded="xl"
                            transition="slide-x-transition"
                            bottom
                            min-width="100"
                            offset-y
                            :close-on-content-click="false"
                            v-model="inputs[itemKey].show"
                        >
                            <template v-slot:activator="{ on: menu, attrs }">
                                <v-tooltip top content-class="rounded-xl">
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-text-field
                                            dense
                                            color="green"
                                            class="mb-2 mb-lg-0 mr-0 mr-lg-2"
                                            hide-details
                                            outlined
                                            rounded
                                            v-bind="attrs"
                                            v-on="{...menu, ...tooltip}"
                                            readonly
                                            v-model="inputs[itemKey].modelShow"
                                        >
                                            <template v-slot:label>
                                                {{ inputs[itemKey].label }} 
                                                <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                            </template>
                                        </v-text-field>
                                    </template>
                                    <span>Klik untuk memunculkan datepicker</span>
                                </v-tooltip>
                            </template>
                            <div class="rounded-xl pb-2 white">
                                <v-overlay :value="inputs[itemKey].loading">
                                    <div class="d-flex flex-column align-center justify-center">
                                        <v-progress-circular
                                            indeterminate
                                            color="white"
                                            size="64"
                                        ></v-progress-circular>
                                        <p class="mt-2 mb-0">Updating available dates...</p>
                                    </div>
                                </v-overlay>
                                <div class="d-flex flex-column align-center rounded-xl">
                                    <v-date-picker 
                                        :range="inputs[itemKey].dateType === 'range'"
                                        color="green lighten-1 rounded-xl" 
                                        v-model="inputs[itemKey].model"
                                        min="2022-11-24"
                                    ></v-date-picker>
                                </div>
                            </div>
                        </v-menu>
                        <!-- text-field -->
                        <v-text-field
                            v-else-if="inputs[itemKey].inputType == 'text-field'"
                            dense
                            color="success"
                            hide-details
                            :label="inputs[itemKey].label"
                            outlined
                            rounded
                            :type="inputs[itemKey].type == 'Number' ? 'number' : 'text'"
                            v-model="inputs[itemKey].model"
                        >
                            <template v-slot:label>
                                <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                {{ inputs[itemKey].label }} 
                                <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                            <template v-slot:append>
                                <div class="mt-1 ml-1" v-html="inputs[itemKey].append"></div>
                            </template>
                        </v-text-field>
                        <!-- file-input -->
                        <div
                            v-else-if="inputs[itemKey].inputType == 'file-input'"
                        >
                            <v-file-input
                                color="success"
                                :dense="inputs[itemKey].dense"
                                :hide-details="inputs[itemKey].hideDetails"
                                outlined
                                rounded
                                :multiple="inputs[itemKey].multiple"
                                counter
                                show-size
                                :prepend-icon="inputs[itemKey].prependIcon"
                                :accept="inputs[itemKey].accept"
                                :placeholder="id ? 'Upload ulang untuk merubah file' : 'Upload file disini'"
                                :disabled="false"
                                :label="inputs[itemKey].label"
                                v-model="inputs[itemKey].model"
                            >
                                <template v-slot:label>
                                    {{ inputs[itemKey].label }} 
                                    <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                </template>
                                <template v-slot:selection="{ index, text, file }">
                                    <v-card 
                                        class="rounded-lg mt-2 elevation-0 mr-1 mb-1"
                                        style="position: relative;"
                                        v-if="inputs[itemKey].chip"
                                    >
                                        <v-chip
                                            color="deep-purple accent-4"
                                            class="rounded-pill"
                                            dark
                                            label
                                            small
                                            style="position: absolute;bottom: 0;left: 0;right: 0;z-index: 2"
                                        >
                                            {{ text }}
                                        </v-chip>
                                        <v-img
                                            v-bind:src="setUrlFileImage(file)"
                                            class="my-2 mb-4 rounded-lg cursor-pointer"
                                            style="max-width: 200px;max-height: 110px;"
                                        ></v-img>
                                    </v-card>
                                    <span v-else> {{ text }}</span>
                                </template>
                            </v-file-input>
                            <div v-if="id && (itemKey.includes('photo') || itemKey == 'village_profile') && false">
                                <v-card 
                                    v-if="inputs[itemKey].chip"
                                    v-for="(imgMltple, imgMltpleIndex) in inputs[itemKey].preview" :key="`image-${itemKey}-${imgMltpleIndex}`"
                                    class="rounded-lg mt-2 elevation-0 mr-1 mb-1 d-inline-block"
                                    style="position: relative;"
                                >
                                    <v-chip
                                        color="deep-purple accent-4"
                                        class="rounded-pill"
                                        dark
                                        label
                                        small
                                        style="position: absolute;bottom: 0;left: 0;right: 0;z-index: 2"
                                    >
                                        {{ itemKey }} {{ imgMltpleIndex }}
                                    </v-chip>
                                    <v-img
                                        v-bind:src="imgMltple"
                                        @click="showLightbox(inputs[itemKey].preview, imgMltpleIndex)"
                                        class="my-2 mb-4 rounded-lg cursor-pointer"
                                        style="max-width: 200px;max-height: 110px;"
                                    ></v-img>
                                </v-card>
                                <!-- <v-carousel 
                                    cycle
                                    height="300" 
                                    show-arrows-on-hover
                                    hide-delimiter-background
                                    class="rounded-xl cursor-pointer"
                                    style="max-width: 500px;"
                                    :key="`image-carousel-${itemKey}-${showModal}`"
                                >
                                    <v-carousel-item v-for="(imgMltple, imgMltpleIndex) in inputs[itemKey].preview" :key="`image-${itemKey}-${imgMltpleIndex}`">
                                        <v-img
                                            height="300"
                                            v-bind:src="imgMltple"
                                            @click="showLightbox(inputs[itemKey].preview, imgMltpleIndex)"
                                            class="my-1 mb-4 rounded-xl cursor-pointer"
                                        ></v-img>
                                    </v-carousel-item>
                                </v-carousel> -->
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn 
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-200"
                    text rounded color="red" class="pl-2"
                    @click="showModal = false">
                    <v-icon class="mr-1">mdi-close-circle</v-icon>
                    Keluar
                </v-btn>
                <v-divider class="mx-2"></v-divider>
                <v-btn
                    v-if="showSaveButton"
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-200" 
                    color="primary white--text"
                    class="px-3 pr-4"
                    rounded
                    :key="`saveButton${disabledSave}`"
                    :disabled="disabledSave"
                    @click="() => save()"
                >
                <span v-if="this.editId && (formStatus == 'document_saving' || formStatus == 'ready_to_submit')">
                    <v-icon class="mr-1">mdi-send-check</v-icon>
                    Kirim Untuk Ditinjau
                </span>
                <span v-else>
                    <v-icon class="mr-1">mdi-content-save</v-icon>
                    Simpan
                </span>
                </v-btn>
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
        },
        programYear: {
            type: String,
            default: '0'
        }
    },
    data: () => ({
        editId: null,
        imageKeyComponent: 82726366,
        inputs: {
            program_year: {
                model: '',
                required: true,
                type: 'String'
            },
        },
        inputsGroup: [
        ],
        formStatus: '',
        loading: {
            show: false,
            text: 'Loading...'
        },
        lottie: {
            data: {
                loading: treeAnimation,
            }
        },
        localConfig: {
            windowWidth: window.innerWidth,
            breakLayoutFrom: 1140,
            requiredInputIcon: 'mdi-star'
        },
        raw_data: {}
    }),
    watch: {
        'loading.show': {
            handler(val) {
            }
        }
    },
    computed: {
        disabledSave() {
            let requiredEmpty = []
            for (const [key, value] of Object.entries(this.inputs)) {
                if (value.type == 'MultipleInput') {
                    if (value.required) if (value.model.length > 0) {
                        value.model.forEach(vm => {
                            Object.entries(value.form).map(form => {
                                if (form[1].required === true) {
                                    if (!(vm[form[0]] !== null && vm[form[0]] !== 0)) requiredEmpty.push(key)
                                }
                            })
                        })
                    } else requiredEmpty.push(key)
                } else if (value.required) if (!value.model) {
                    requiredEmpty.push(key)
                }
            }
            return requiredEmpty.length > 0 ? true : false
        },
        showModal: {
            get: function () {
                if (this.show) {
                    this.showedModal(this.id)
                }
                return this.show
            },
            set: function(newVal) {
                if (!newVal) this.$emit('action', {type: 'close', name: 'form'})
            }
        },
        showSaveButton() {
            return true
        },
    },
    async mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
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
        async getData(id) {
            try {
                this.loading.show = true
                this.loading.text = 'Getting scooping data...'
                const res = await axios.get(this.$store.getters.getApiUrl(`GetDetailScooping?data_no=${id}`), this.$store.state.apiConfig)
                const data = res.data.data.result
            } catch (err) {
                this.errorResponse(err)
                this.$emit('action', {type: 'close', name: 'form'})
            } finally {
                this.loading.show = false
            }
        },
        async getDummiesData() {
            try {
                this.loading.show = true
                this.loading.text = 'Set dummy data... :)'
            } catch (err) {
                this.errorResponse(err)
            } finally {
                this.loading.show = false
            }
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
        },
        async save() {
            try {
                const confirm = await Swal.fire({
                    title: 'Apakah kamu yakin?',
                    text: "Harap dipastikan lagi data yang sudah diisi!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#2e7d32',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Tidak Jadi',
                    confirmButtonText: 'Ya, Lanjutkan!'
                })
            } catch (err) {this.errorResponse(err)} finally {
                this.loading.show = false
            }
        },
        setUrlFileImage(file) {
            return URL.createObjectURL(file)
        },
        async showedModal(id) {
            try {
                this.loading.show = true
                this.loading.text = 'Menyiapkan form...'
                // await this.resetData()
                this.loading.show = true
                if (id) {
                    this.loading.show = true
                    await this.getData(id)
                } else {
                    this.editId = null
                    // await this.getDummiesData()
                }
            } finally {
                this.loading.show = false
            }
        },
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        },
        async uploadFiles(type, typeName, file, prefix, dir, name) {
            try {
                this.$store.state.loadingOverlayText = `Mengunggah "${typeName}"...`
                const url = `${this.$store.state.apiUrlImage}${prefix}/upload.php`
                let fileToUpload = file
                if (type == 'polygon') fileToUpload = file[0]
                const data = this._utils.generateFormData({
                    dir: dir,
                    nama: name,
                    fileToUpload: fileToUpload,
                    type: type
                })
                let responseName = null
                const res = await axios.post(url,data)
                if (res) {
                    responseName = res.data.data.new_name
                    return `${prefix}/${responseName}`
                }
            } catch (err) {this.errorResponse(err)}
        },
    }
}
</script>