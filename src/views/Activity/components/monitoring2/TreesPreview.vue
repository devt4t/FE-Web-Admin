<template>
    <div>
        <title-info :show="dialogs.titleInfo.show" @close="$event => closeDialog($event)"></title-info>
        <v-container fluid data-aos="fade-up" data-aos-delay="100">
            <v-row :class="`${mu_no.model ? '' : ''}`">
                <!-- Title Toolbar -->
                <v-col cols="12" class="pb-0">
                    <v-card class="rounded-xl">
                        <v-card-text class="d-flex flex-column flex-lg-row align-center pa-2 px-3">
                            <v-chip color="green white--text" class="px-5 mb-2 mb-lg-0"><v-icon class="mr-2">mdi-forest</v-icon> Trees Planted <v-icon small class="ml-1" @click="() => {dialogs.titleInfo.show = true}">mdi-information</v-icon></v-chip>
                            <v-divider class="mx-2"></v-divider>
                            <v-autocomplete
                                rounded
                                dense
                                outlined
                                clearable
                                :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition'}"
                                color="green"
                                item-color="green"
                                class="mb-2 mb-lg-0 mr-0 mr-lg-2"
                                label="Management Unit"
                                :loading="mu_no.loading"
                                hide-details
                                item-value="mu_no"
                                item-text="name"
                                :disabled="disabledFilter"
                                :items="mu_no.items"
                                v-model="mu_no.model"
                                style="max-width: 250px;"
                            ></v-autocomplete>
                            <v-select
                                rounded
                                dense
                                outlined
                                :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition'}"
                                color="green"
                                item-color="green"
                                class="mb-2 mb-lg-0"
                                label="Program Year"
                                hide-details
                                :disabled="disabledFilter"
                                :items="$store.state.programYear.options"
                                v-model="programYear"
                                style="max-width: 200px;"
                            ></v-select>
                            <v-btn rounded color="blue white--text" class="ml-2">
                                <v-icon class="mr-1">mdi-microsoft-excel</v-icon>
                                Export
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <!-- KAYU Total Amount -->
                <v-col cols="12" lg="2" class="pr-lg-0">
                    <v-card class="rounded-xl" :loading="trees.kayu.general.loading">
                        <v-card-text data-aos="zoom-in" data-aos-delay="200">
                            <v-card class="rounded-xl gradient-animate text-center">
                                <v-card-title class="pa-0 pt-2">
                                    <v-spacer></v-spacer>
                                    <p class="mb-0 font-weight-bold grey--text text--darken-3">KAYU</p>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-card-text>
                                    <v-card class="rounded-xl bg-white-transparent blurred">
                                        <v-card-text class="pt-1">
                                            <p class="mb-1">{{ programYear }}</p>
                                            <h4 style="font-size: 33px;">
                                                <number
                                                ref="totalKayuProgramYear"
                                                :key="componentKeys.totalKayuProgramYear"
                                                :format="numberFormat"
                                                animationPaused
                                                :from="0"
                                                :to="trees.kayu.general.qty_py"
                                                :duration="5"
                                                :delay="0"
                                                easing="Power2.easeInOut"/>
                                            </h4>
                                        </v-card-text>
                                    </v-card>
                                    <v-card class="rounded-xl bg-white-transparent blurred mt-2">
                                        <v-card-text class="pt-1">
                                            <p class="mb-1">Total</p>
                                            <h4 style="font-size: 33px;">
                                                <number
                                                ref="totalKayuAll"
                                                :key="componentKeys.totalKayuAll"
                                                :format="numberFormat"
                                                animationPaused
                                                :from="0"
                                                :to="trees.kayu.general.qty"
                                                :duration="5"
                                                :delay="0"
                                                easing="Power2.easeInOut"/>
                                            </h4>
                                        </v-card-text>
                                    </v-card>
                                </v-card-text>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-col>
                <!-- KAYU Per-Seed Amount -->
                <v-col cols="12" lg="10" class="d-flex align-lg-stretch">
                    <v-card class="rounded-xl flex-grow-1 d-flex flex-column flex-lg-row" :loading="trees.kayu.category.loading">
                        <v-card-text class="d-flex" v-if="trees.kayu.category.loading == false && trees.kayu.category.items.length > 0">
                            <v-row class="align-self-lg-stretch">
                                <v-col v-for="(kayu, kayuIndex) in displayedItemsKayu" :key="kayuIndex" class="px-1 d-flex" cols="12" lg="3">
                                    <v-card class="rounded-xl align-self-lg-stretch flex-grow-1" data-aos="zoom-in" :data-aos-delay="200 + (kayuIndex * 50)">
                                        <v-card-title class="green ma-1 rounded-xl pa-1 white--text">
                                            <v-avatar color="green lighten-2" size="27" class="mr-1">
                                                <p class="mb-0" style="font-size: 15px;">{{ (4 * (trees.kayu.category.currentPage - 1)) + (kayuIndex + 1) }}</p>
                                            </v-avatar>
                                            <p class="mb-0" style="font-size: 15px;">{{ kayu.tree_name || 'Tree Name' }}</p>
                                        </v-card-title>
                                        <v-card-text class="text-center">
                                            <v-row class="my-0">
                                                <v-col>
                                                    <v-card class="rounded-xl">
                                                        <v-card-text class="pt-1">
                                                            <p>{{ programYear }}</p>
                                                            <h4 style="font-size: 20px;">{{ numberFormat(kayu.qty_py || 0) }}</h4>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col>
                                                    <v-card class="rounded-xl">
                                                        <v-card-text class="pt-1">
                                                            <p>Total</p>
                                                            <h4 style="font-size: 20px;">{{ numberFormat(kayu.qty || 0) }}</h4>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                            <v-btn
                                                rounded
                                                small
                                                color="green lighten-2 white--text"
                                                class="mt-1"
                                            >
                                                <v-icon class="mr-1">mdi-list-box</v-icon>
                                                Show Land
                                            </v-btn>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text v-else-if="trees.kayu.category.loading == false && trees.kayu.category.items.length == 0" class="d-flex align-center justify-center">
                            <div data-aos="zoom-in" class="d-flex align-center justify-center flex-column">
                                <v-icon size="50">mdi-{{ mu_no.model ? 'close-circle' : 'select-marker' }}</v-icon>
                                <p class="mt-2 mb-0">{{ mu_no.model ? `No Data "KAYU" Available` : 'Select Management Unit' }}</p>
                            </div>
                        </v-card-text>
                        <v-card-text v-else class="d-flex flex-column align-center justify-center">
                            <v-progress-circular
                                indeterminate
                                color="green"
                                size="64"
                                data-aos="zoom-in"
                                data-aos-duration="1000"
                            ></v-progress-circular>
                            <p class="mt-2 mb-0" data-aos="zoom-in" data-aos-delay="200">Loading...</p>
                        </v-card-text>
                        <v-card-actions v-if="trees.kayu.category.loading == false && trees.kayu.category.items.length > 0" class="d-flex flex-row flex-lg-column align-center justify-center pl-0" data-aos="zoom-in" data-aos-delay="500">
                            <v-btn @click="() => {trees.kayu.category.currentPage -= 1}" :disabled="trees.kayu.category.currentPage < 2" fab x-small outlined color="green white--text" class="ma-0 mb-lg-2 mr-2 mr-lg-0"><v-icon>mdi-chevron-left</v-icon></v-btn>
                            <v-btn fab small color="green white--text" class="ma-0 mb-lg-2">{{trees.kayu.category.currentPage}}</v-btn>
                            <v-btn @click="() => {trees.kayu.category.currentPage += 1}" :disabled="trees.kayu.category.currentPage >= numPagesKayu" fab x-small outlined color="green white--text" class="ma-0 ml-2 ml-lg-0"><v-icon>mdi-chevron-right</v-icon></v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <!-- MPTS Total Amount -->
                <v-col cols="12" lg="2" class="pr-lg-0 pt-0">
                    <v-card class="rounded-xl" :loading="trees.mpts.general.loading">
                        <v-card-text data-aos="zoom-in" data-aos-delay="200">
                            <v-card class="rounded-xl gradient-animate blue text-center">
                                <v-card-title class="pa-0 pt-2">
                                    <v-spacer></v-spacer>
                                    <p class="mb-0 font-weight-bold grey--text text--darken-3">MPTS</p>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-card-text>
                                    <v-card class="rounded-xl bg-white-transparent blurred">
                                        <v-card-text class="pt-1">
                                            <p class="mb-1">{{ programYear }}</p>
                                            <h4 style="font-size: 33px;">
                                                <number
                                                ref="totalMptsProgramYear"
                                                :key="componentKeys.totalMptsProgramYear"
                                                :format="numberFormat"
                                                animationPaused
                                                :from="0"
                                                :to="trees.mpts.general.qty_py"
                                                :duration="5"
                                                :delay="0"
                                                easing="Power2.easeInOut"/>
                                            </h4>
                                        </v-card-text>
                                    </v-card>
                                    <v-card class="rounded-xl bg-white-transparent blurred mt-2">
                                        <v-card-text class="pt-1">
                                            <p class="mb-1">Total</p><h4 style="font-size: 33px;">
                                                <number
                                                ref="totalMptsAll"
                                                :key="componentKeys.totalMptsAll"
                                                :format="numberFormat"
                                                animationPaused
                                                :from="0"
                                                :to="trees.mpts.general.qty"
                                                :duration="5"
                                                :delay="0"
                                                easing="Power2.easeInOut"/>
                                            </h4>
                                        </v-card-text>
                                    </v-card>
                                </v-card-text>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-col>
                <!-- MPTS Per-Seed Amount -->
                <v-col cols="12" lg="10" class="d-flex align-lg-stretch pt-0">
                    <v-card class="rounded-xl flex-grow-1 d-flex flex-column flex-lg-row" :loading="trees.mpts.category.loading">
                        <v-card-text v-if="trees.mpts.category.loading == false && trees.mpts.category.items.length > 0" class="d-flex">
                            <v-row class="align-self-lg-stretch">
                                <v-col v-for="(mpts, mptsIndex) in displayedItemsMpts" :key="mptsIndex" class="px-1 d-flex" cols="12" lg="3">
                                    <v-card class="rounded-xl align-self-lg-stretch flex-grow-1" data-aos="zoom-in" :data-aos-delay="200 + (mptsIndex * 50)">
                                        <v-card-title class="blue ma-1 rounded-xl pa-1 white--text">
                                            <v-avatar color="blue lighten-2" size="27" class="mr-1">
                                                <p class="mb-0" style="font-size: 15px;">{{ (4 * (trees.mpts.category.currentPage - 1)) + (mptsIndex + 1) }}</p>
                                            </v-avatar>
                                            <p class="mb-0" style="font-size: 15px;">{{ mpts.tree_name || 'Tree Name' }}</p>
                                        </v-card-title>
                                        <v-card-text class="text-center">
                                            <v-row class="my-0">
                                                <v-col>
                                                    <v-card class="rounded-xl">
                                                        <v-card-text class="pt-1">
                                                            <p>{{ programYear }}</p>
                                                            <h4 style="font-size: 20px;">{{ numberFormat(mpts.qty_py || 0) }}</h4>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col>
                                                    <v-card class="rounded-xl">
                                                        <v-card-text class="pt-1">
                                                            <p>Total</p>
                                                            <h4 style="font-size: 20px;">{{ numberFormat(mpts.qty || 0) }}</h4>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                            <v-btn
                                                rounded
                                                small
                                                color="blue lighten-2 white--text"
                                                class="mt-1"
                                            >
                                                <v-icon class="mr-1">mdi-list-box</v-icon>
                                                Show Land
                                            </v-btn>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text v-else-if="trees.mpts.category.loading == false && trees.mpts.category.items.length == 0" class="d-flex align-center justify-center">
                            <div data-aos="zoom-in" class="d-flex align-center justify-center flex-column">
                                <v-icon size="50">mdi-{{ mu_no.model ? 'close-circle' : 'select-marker' }}</v-icon>
                                <p class="mt-2 mb-0">{{ mu_no.model ? `No Data "MPTS" Available` : 'Select Management Unit' }}</p>
                            </div>
                        </v-card-text>
                        <v-card-text v-else class="d-flex flex-column align-center justify-center">
                            <v-progress-circular
                                indeterminate
                                color="blue"
                                size="64"
                                data-aos="zoom-in"
                                data-aos-duration="1000"
                            ></v-progress-circular>
                            <p class="mt-2 mb-0" data-aos="zoom-in" data-aos-delay="200">Loading...</p>
                        </v-card-text>
                        <v-card-actions v-if="trees.mpts.category.loading == false && trees.mpts.category.items.length > 0" class="d-flex flex-row flex-lg-column align-center justify-center pl-0" data-aos="zoom-in" data-aos-delay="500">
                            <v-btn @click="() => {trees.mpts.category.currentPage -= 1}" :disabled="trees.mpts.category.currentPage < 2" fab x-small outlined color="blue white--text" class="ma-0 mb-lg-2 mr-2 mr-lg-0"><v-icon>mdi-chevron-left</v-icon></v-btn>
                            <v-btn fab small color="blue white--text" class="ma-0 mb-lg-2">{{trees.mpts.category.currentPage}}</v-btn>
                            <v-btn @click="() => {trees.mpts.category.currentPage += 1}" :disabled="trees.mpts.category.currentPage >= numPagesMpts" fab x-small outlined color="blue white--text" class="ma-0 ml-2 ml-lg-0"><v-icon>mdi-chevron-right</v-icon></v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import TitleInfo from './dialogs/TitleInfo.vue'

export default {
    components: {
        TitleInfo
    },
    data: () => ({
        // filter
        mu_no: {
            items: [],
            loading: false,
            model: '',
        },
        programYear: '',
        // trees datas
        trees: {
            kayu: {
                general: {
                    loading: false,
                    qty: 0,
                    qty_py: 0
                },
                category: {
                    loading: false,
                    currentPage: 1,
                    items: []
                }
            },
            mpts: {
                general: {
                    loading: false,
                    qty: 0,
                    qty_py: 0
                },
                category: {
                    loading: false,
                    currentPage: 1,
                    items: []
                }
            },
        },
        // dialogs
        dialogs: {
            titleInfo: {show: false},
        },
        // keys
        componentKeys: {
            totalKayuProgramYear: 1111,
            totalKayuAll: 1010,
            totalMptsProgramYear: 1111,
            totalMptsAll: 1010,
        }
    }),
    watch: {
        async programYear(val) {
            await this.setTreesData()
        },
        'mu_no.model': {
            async handler(val) {
                await this.setTreesData()
            }
        }
    },
    computed: {
        numPagesKayu() {
            return Math.ceil(this.trees.kayu.category.items.length / 4);
        },
        displayedItemsKayu() {
            const start = (this.trees.kayu.category.currentPage - 1) * 4;
            const end = start + 4;
            return this.trees.kayu.category.items.slice(start, end);
        },
        numPagesMpts() {
            return Math.ceil(this.trees.mpts.category.items.length / 4);
        },
        displayedItemsMpts() {
            const start = (this.trees.mpts.category.currentPage - 1) * 4;
            const end = start + 4;
            return this.trees.mpts.category.items.slice(start, end);
        },
        disabledFilter() {
            let status = false
            if (this.trees.kayu.general.loading) status = true
            if (this.trees.kayu.category.loading) status = true
            if (this.trees.mpts.general.loading) status = true
            if (this.trees.mpts.category.loading) status = true
            return status
        }
    },
    async mounted() {
        this.programYear = this.$store.state.programYear.model
        await this.getManagementUnitItems()
    },
    methods: {
        numberFormat(number) {
            let numb = number
            let alpha = ''
            let fractionDigit = 0
            if (number >= 10000 && number < 1000000) {
                numb = numb / 1000
                alpha = 'K'
            } else if (number >= 1000000) {
                numb = numb / 1000000
                alpha = 'M'
                if (number < 100000000) fractionDigit = 1
            }
            let num = new Intl.NumberFormat('id-ID', {
                maximumFractionDigits: fractionDigit
            }).format(numb)
            return num + alpha
        },
        async getManagementUnitItems() {
            try {
                this.mu_no.loading = true
                const response = await axios.get(this.$store.getters.getApiUrl("GetManagementUnit"), this.$store.state.apiConfig)
                const data = response.data.data.result || []
                this.mu_no.items = data
            } catch (error) {
                if (error.response) {
                    if (error.response.status == 401) {
                        localStorage.removeItem("token")
                        this.$router.push("/")
                    }
                } else console.error(error)
            } finally {
                this.mu_no.loading = false
            }
        },
        async setTreesData() {
            if (this.programYear && this.mu_no.model) {
                // start loading
                this.trees.kayu.general.loading = true
                this.trees.kayu.category.loading = true
                this.trees.mpts.general.loading = true
                this.trees.mpts.category.loading = true
                
                // KAYU: GENERAL
                const kayuGeneral = await this.getTreesAmount(this.programYear, 'KAYU', this.mu_no.model, 'general')
                this.trees.kayu.general.qty_py = kayuGeneral.data.qty_py || 0
                await this.startNumberAnimation('totalKayuProgramYear')
                this.trees.kayu.general.qty = kayuGeneral.data.qty || 0
                await this.startNumberAnimation('totalKayuAll')
                this.trees.kayu.general.loading = false
                // KAYU: CATEGORY
                const kayuCategory = await this.getTreesAmount(this.programYear, 'KAYU', this.mu_no.model, 'category')
                this.trees.kayu.category.items = kayuCategory.data || []
                this.trees.kayu.category.loading = false
                // MPTS: GENERAL
                const mptsGeneral = await this.getTreesAmount(this.programYear, 'MPTS', this.mu_no.model, 'general')
                this.trees.mpts.general.qty_py = mptsGeneral.data.qty_py || 0
                await this.startNumberAnimation('totalMptsProgramYear')
                this.trees.mpts.general.qty = mptsGeneral.data.qty || 0
                await this.startNumberAnimation('totalMptsAll')
                this.trees.mpts.general.loading = false
                // MPTS: CATEGORY
                const mptsCategory = await this.getTreesAmount(this.programYear, 'MPTS', this.mu_no.model, 'category')
                this.trees.mpts.category.items = mptsCategory.data || []
                this.trees.mpts.category.loading = false
            }
        },
        async getTreesAmount(py, category, mu_no, type) {
            try {
                const params = new URLSearchParams({
                    program_year: py,
                    category: category,
                    mu_no: mu_no,
                    type: type
                })
                const res = await axios.get(this.$store.getters.getApiUrl(`ShowTotalTreesGeneral?${params}`), this.$store.state.apiConfig)
                return res.data
            } catch (error) {
                if (error.response.status == 401) {
                    localStorage.removeItem("token")
                    this.$router.push("/")
                } else console.error(error.response)
            } finally {}
        },
        async startNumberAnimation (ref) {
            this.componentKeys[ref] += 1
            await setTimeout(() => {
                this.$refs[ref].play()
            }, 100)
        },
        closeDialog(name) {
            this.dialogs[name].show = false
        }
    },
}
</script>