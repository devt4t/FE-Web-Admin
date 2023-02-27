<template>
    <v-container fluid data-aos="fade-up" data-aos-delay="100">
        <v-row class="align-lg-stretch">
            <!-- Title Toolbar -->
            <v-col cols="12" class="pb-0">
                <v-card class="rounded-pill">
                    <v-card-text class="d-flex flex-column flex-lg-row align-center">
                        <v-chip color="green white--text" class="px-5 mb-2 mb-lg-0"><v-icon class="mr-2">mdi-forest</v-icon> Trees Planted</v-chip>
                        <v-divider class="mx-2"></v-divider>
                        <v-autocomplete
                            rounded
                            dense
                            outlined
                            :menu-props="{rounded: 'xl', offsetY: true, transition: 'slide-y-transition'}"
                            color="green"
                            item-color="green"
                            class="mb-2 mb-lg-0 mr-0 mr-lg-2"
                            label="Management Unit"
                            :loading="mu_no.loading"
                            hide-details
                            item-value="mu_no"
                            item-text="name"
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
            <!-- KAYU Total Amount -->
            <v-col cols="12" lg="2" class="pr-lg-0">
                <v-card class="rounded-xl">
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
                                            :to="10000"
                                            :duration="5"
                                            :delay="0"
                                            easing="Power2.easeInOut"/>
                                        </h4>
                                    </v-card-text>
                                </v-card>
                                <v-card class="rounded-xl bg-white-transparent blurred mt-2">
                                    <v-card-text class="pt-1">
                                        <p class="mb-1">Total</p>
                                        <h4 style="font-size: 33px;">10k</h4>
                                    </v-card-text>
                                </v-card>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-col>
            <!-- KAYU Per-Seed Amount -->
            <v-col cols="12" lg="10" class="d-flex align-lg-stretch">
                <v-card class="rounded-xl flex-grow-1 d-flex flex-column flex-lg-row">
                    <v-card-text class="d-flex">
                        <v-row class="align-self-lg-stretch">
                            <v-col v-for="n in 4" class="px-1 d-flex" cols="12" lg="3">
                                <v-card class="rounded-xl align-self-lg-stretch flex-grow-1" data-aos="zoom-in" :data-aos-delay="200 + (n * 100)">
                                    <v-card-title class="green ma-1 rounded-xl pa-1 white--text">
                                        <v-avatar color="green lighten-2" size="27" class="mr-1">
                                            <p class="mb-0" style="font-size: 15px;">{{ n }}</p>
                                        </v-avatar>
                                        <p class="mb-0" style="font-size: 15px;">JATI</p>
                                    </v-card-title>
                                    <v-card-text class="text-center">
                                        <v-row class="my-0">
                                            <v-col>
                                                <v-card class="rounded-xl">
                                                    <v-card-text class="pt-1">
                                                        <p>{{ programYear }}</p>
                                                        <h4 style="font-size: 33px;">10k</h4>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                            <v-col>
                                                <v-card class="rounded-xl">
                                                    <v-card-text class="pt-1">
                                                        <p>Total</p>
                                                        <h4 style="font-size: 33px;">10k</h4>
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
                    <v-card-actions class="d-flex flex-row flex-lg-column align-center justify-center pl-0" data-aos="zoom-in" data-aos-delay="500">
                        <v-btn fab x-small outlined color="green white--text" class="ma-0 mb-lg-2 mr-2 mr-lg-0"><v-icon>mdi-chevron-left</v-icon></v-btn>
                        <v-btn fab small color="green white--text" class="ma-0 mb-lg-2">1</v-btn>
                        <v-btn fab x-small outlined color="green white--text" class="ma-0 ml-2 ml-lg-0"><v-icon>mdi-chevron-right</v-icon></v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <!-- MPTS Total Amount -->
            <v-col cols="12" lg="2" class="pr-lg-0 pt-0">
                <v-card class="rounded-xl">
                    <v-card-text data-aos="zoom-in" data-aos-delay="200">
                        <v-card class="rounded-xl gradient-animate orange text-center">
                            <v-card-title class="pa-0 pt-2">
                                <v-spacer></v-spacer>
                                <p class="mb-0 font-weight-bold grey--text text--darken-3">MPTS</p>
                                <v-spacer></v-spacer>
                            </v-card-title>
                            <v-card-text>
                                <v-card class="rounded-xl bg-white-transparent blurred">
                                    <v-card-text class="pt-1">
                                        <p class="mb-1">{{ programYear }}</p>
                                        <h4 style="font-size: 33px;">10k</h4>
                                    </v-card-text>
                                </v-card>
                                <v-card class="rounded-xl bg-white-transparent blurred mt-2">
                                    <v-card-text class="pt-1">
                                        <p class="mb-1">Total</p>
                                        <h4 style="font-size: 33px;">10k</h4>
                                    </v-card-text>
                                </v-card>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-col>
            <!-- MPTS Per-Seed Amount -->
            <v-col cols="12" lg="10" class="d-flex align-lg-stretch pt-0">
                <v-card class="rounded-xl flex-grow-1 d-flex flex-column flex-lg-row">
                    <v-card-text class="d-flex">
                        <v-row class="align-self-lg-stretch">
                            <v-col v-for="n in 4" class="px-1 d-flex" cols="12" lg="3">
                                <v-card class="rounded-xl align-self-lg-stretch flex-grow-1" data-aos="zoom-in" :data-aos-delay="200 + (n * 100)">
                                    <v-card-title class="orange ma-1 rounded-xl pa-1 white--text">
                                        <v-avatar color="orange lighten-2" size="27" class="mr-1">
                                            <p class="mb-0" style="font-size: 15px;">{{ n }}</p>
                                        </v-avatar>
                                        <p class="mb-0" style="font-size: 15px;">DURIAN</p>
                                    </v-card-title>
                                    <v-card-text class="text-center">
                                        <v-row class="my-0">
                                            <v-col>
                                                <v-card class="rounded-xl">
                                                    <v-card-text class="pt-1">
                                                        <p>{{ programYear }}</p>
                                                        <h4 style="font-size: 33px;">10k</h4>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                            <v-col>
                                                <v-card class="rounded-xl">
                                                    <v-card-text class="pt-1">
                                                        <p>Total</p>
                                                        <h4 style="font-size: 33px;">10k</h4>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                        <v-btn
                                            rounded
                                            small
                                            color="orange lighten-2 white--text"
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
                    <v-card-actions class="d-flex flex-row flex-lg-column align-center justify-center pl-0" data-aos="zoom-in" data-aos-delay="500">
                        <v-btn fab x-small outlined color="orange white--text" class="ma-0 mb-lg-2 mr-2 mr-lg-0"><v-icon>mdi-chevron-left</v-icon></v-btn>
                        <v-btn fab small color="orange white--text" class="ma-0 mb-lg-2">1</v-btn>
                        <v-btn fab x-small outlined color="orange white--text" class="ma-0 ml-2 ml-lg-0"><v-icon>mdi-chevron-right</v-icon></v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    data: () => ({
        // filter
        mu_no: {
            items: [],
            loading: false,
            model: '021',
        },
        programYear: '',
        // keys
        componentKeys: {
            totalKayuProgramYear: 1111,
        }
    }),
    async mounted() {
        this.programYear = this.$store.state.programYear.model
        await this.getManagementUnitItems()
    },
    methods: {
        numberFormat(num) {
            return new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 0
            }).format(num)
        },
        async getManagementUnitItems() {
            try {
                this.mu_no.loading = true
                const response = await axios.get(this.$store.getters.getApiUrl("GetManagementUnit"), this.$store.state.apiConfig)
                const data = response.data.data.result || []
                this.mu_no.items = data
            } catch (error) {
                if (error.response.status == 401) {
                    localStorage.removeItem("token")
                    this.$router.push("/")
                } else console.error(error.response)
            } finally {
                this.mu_no.loading = false
            }
        },
    },
}
</script>