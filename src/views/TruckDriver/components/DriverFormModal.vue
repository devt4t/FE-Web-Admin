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
                                v-model="inputs.program_year.model"
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
                        <v-col cols="12" sm="12" md="12">
                            <v-alert :value="inputs.nik.exist" type="error" class="rounded-xl" dense dismissible transition="scale-transition">
                                The nik has already been taken.
                            </v-alert>
                            <v-alert v-if="inputs.nik.model && inputs.nik.exist == false && checkNik.loading == false && checkNik.checked == true" type="success" class="rounded-xl" dense dismissible data-aos="zoom-in" data-aos-duration="100">
                                The nik is available.
                            </v-alert>
                            <v-row class="ma-0 align-center">
                                <!-- NIK / Licence -->
                                <v-text-field
                                    ref="nikInput"
                                    dense
                                    :class="`${inputs.nik.model ? (inputs.nik.exist ? 'red--text' : 'green-text') : ''} mt-2`"   
                                    :color="`success`"
                                    hide-details
                                    :label="inputs.nik.label"
                                    :loading="inputs.nik.loading"
                                    :no-data-text="inputs.nik.loading ? 'Loading...' : 'No Data'"
                                    outlined
                                    :append-icon="inputs.nik.exist ? '' : (inputs.nik.model ? '' : '')"
                                    rounded
                                    :rules="[(v) => v.length == 16 || 'Field is required']"
                                    v-model="inputs.nik.model"
                                    :disabled="id ? true : false"
                                ></v-text-field>
                                <v-btn v-if="!id" small rounded class="ml-2 mt-2" color="info" @click="checkNikNoExisting(inputs.nik.model)" :loading="checkNik.loading">Check</v-btn>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" lg="6">
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
                                v-model="inputs.address.model"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" outlined rounded class="pr-3 pl-1" small @click="showModal = false"><v-icon class="mr-1">mdi-close-circle</v-icon> Close</v-btn>
                    <v-divider class="mx-2"></v-divider>
                    <v-dialog
                        v-model="dialog"
                        persistent
                        max-width="400"
                        content-class="rounded-xl"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" color="green white--text" rounded class="px-3" small :disabled="!id && (checkNik.loading || !checkNik.checked || inputs.nik.exist || !inputs.name.model)"><v-icon class="mr-1">mdi-content-save-check</v-icon> Save</v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="text-h5">
                                <v-spacer></v-spacer>
                                Are u sure?
                                <v-spacer></v-spacer>
                            </v-card-title>
                            <v-card-text class="text-center">
                                Are u sure wanna save this data?
                            </v-card-text>
                            <v-card-actions>
                                <v-btn
                                    color="red"
                                    text
                                    rounded
                                    @click="dialog = false"
                                >
                                    <v-icon class="mr-1">mdi-undo</v-icon>
                                    Back
                                </v-btn>
                                <v-divider class="mx-2"></v-divider>
                                <v-btn
                                    color="green white--text pr-3"
                                    rounded
                                    @click="save(id)"
                                >
                                    <v-icon class="mr-1">mdi-check-circle</v-icon>
                                    Ok, Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-actions>
            </v-card>
    </v-dialog>
</template>
<script>
import moment  from 'moment'
import axios from 'axios'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: 0
        }
    },
    data: () => ({
        dialog: false,
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
            program_year: {
                model: ''
            },
            user_id: {
                model: JSON.parse(localStorage.getItem('User')).email
            }
        },
        checkNik: {
            checked: false,
            loading: false
        },
        loading: {
            show: false,
            text: 'Loading...'
        },
    }),
    watch: {
        'inputs.nik.exist': {
            handler(val) {
                console.log(val)
            }
        },
        'inputs.nik.model': {
            handler(val) {
                this.checkNik.checked = false
            }
        },
        show(val) {
            if (val) {
                // set dummy data
                // this.manageData('dummy')
            } else this.manageData('reset')
        }
    },
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
        this.inputs.program_year.model = this.$store.state.programYear.model
    },
    methods: {
        async getDetailData(id) {
            try {
                this.loading.show = true
                const res = await axios.get(`${this.$store.getters.getApiUrl('GetDetailDriver')}?nik=${id}`, this.$store.state.apiConfig)
                await this.manageData('set', res.data.data.result)
            } catch (err) {
                if (err.response != undefined) {
                    this.forceLogout(err.response)
                } else console.log(err)
            } finally {
                this.loading.show = false
            }
        },
        async checkNikNoExisting(val) {
            this.inputs.nik.exist = false
            this.checkNik.checked = false
            this.checkNik.loading = true
            await axios.get(`${this.$store.getters.getApiUrl('GetDetailDriver')}?nik=${val}`, this.$store.state.apiConfig)
                .then(() => {
                    this.inputs.nik.exist = true
                }).catch((err) => {
                    const nikLicenceFormat = /^(\d{16}|\d{4}-\d{4}-\d{6})$/
                    if (nikLicenceFormat.test(val)) {
                        this.inputs.nik.exist = false
                        this.checkNik.checked = true
                    } else alert('Nik / Licence are invalid.')
                    this.forceLogout(err)
                }).finally(() => {
                    this.checkNik.loading = false
                })
        },
        async save(id = null) {
            try {
                this.inputs.nik.exist = false
                this.dialog = false
                this.$emit('close', {type: 'driver', val: false})

                this.$store.state.loadingOverlayText = 'Saving data...'
                this.$store.state.loadingOverlay = true
                
                let sendData = {}
                for (const [key, value] of Object.entries(this.inputs)) {
                    if (value.model) sendData[key] = value.model
                }
                if (sendData.photo) sendData.photo = await this.uploadPhotos('ktp-licence', sendData.photo, 'driver-ktp_licence')
                let type = 'AddDriver'
                if (id) type = 'UpdateDriver'
                await axios.post(`${this.$store.getters.getApiUrl(type)}`, sendData, this.$store.state.apiConfig)
                await this.$emit('snackbar', {color: 'green', text: 'Success saving driver data!'})
                await this.$emit('refreshTable')
                this.manageData('reset')
            } catch (err) {
                await this.$emit('snackbar', {color: 'red', text: err})
                if (err.response != undefined) {
                    // console.log(err.response.data.data.result)
                    const message = err.response.data.data.result
                    if (message == 'The nik has already been taken.') {
                        this.$refs['nikInput'].focus()
                        this.$emit('close', {type: 'driver', val: true})
                        this.inputs.nik.exist = true
                    }

                    this.forceLogout(err.response)
                } else console.log(err)
            } finally {
                this.$store.state.loadingOverlay = false
                this.$store.state.loadingOverlayText = null
            }
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
        generateFormData(data) {
            let formData= new FormData()

            const objectArray= Object.entries(data)

            objectArray.forEach(([key, value]) => {

                if (Array.isArray(value)){
                value.map(item => {
                    formData.append(key+'[]' , item)
                })
                }else {
                formData.append(key, value)
                }
            })
            return formData
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
                    this.inputs.photo.model = null
                    this.inputs.photo.preview = null
                }
            } else {
                this.inputs.photo.model = null
                this.inputs.photo.preview = ""
            }
        },
        async manageData(type, data = null) {
            this.inputs.program_year.model = this.$store.state.programYear.model
            if (type == 'dummy') {
                this.inputs.nik.model = 3322202210701001
                this.inputs.name.model = 'Melvin'
                this.inputs.address.model = 'Jl. Sanggung Bar. No.11, RT.006/RW.002, Jatingaleh, Kec. Candisari, Kota Semarang, Jawa Tengah 50254'
            } else if (type == 'reset') {
                this.inputs.nik.model = ''
                this.inputs.name.model = ''
                this.inputs.address.model = ''
                this.inputs.photo.model = ''
                this.inputs.photo.preview = ''
            } else if (type == 'set' && data) {
                this.inputs.nik.model = data.nik
                this.inputs.name.model = data.name
                this.inputs.address.model = data.address
                this.inputs.photo.model = data.photo
                if (data.photo) this.inputs.photo.preview = this.$store.state.apiUrlImage + data.photo
            }
        },
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        },
        async uploadPhotos(type, file, dir) {
            this.$store.state.loadingOverlayText = `Saving photo "${type}"...`
            const url = `${this.$store.state.apiUrlImage}drivers_trucks/upload.php`
            const newName = `${this.inputs.nik.model}_${type}`
            const data = this.generateFormData({
                dir: dir,
                nama: newName,
                image: file
            })
            let responseName = null
            await axios.post(url,data).then(res => {
                responseName = res.data.data.new_name
            }).catch(err => {
                console.error(err)
            })
            return 'drivers_trucks/' + responseName
        }
    },
}
</script>