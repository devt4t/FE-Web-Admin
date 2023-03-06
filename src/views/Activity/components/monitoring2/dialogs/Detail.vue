<template>
    <v-dialog v-model="showDialog" content-class="rounded-xl elevation-20" max-width="900" scrollable>
        <v-card class="pt-2 elevation-20">
            <v-card-title :class="`${themeColor} darken-3 white--text mx-2 rounded-xl elevation-10`" elevation="20">
                <p class="mb-0"><v-icon color="white">mdi-list-box</v-icon> Lists</p>
                <v-divider class="mx-2" color="white"></v-divider>
                <v-icon color="white" @click="() => {showDialog = false}">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text v-if="loading" class="d-flex flex-column align-center justify-center py-5">
                <v-progress-circular
                    indeterminate
                    :color="themeColor"
                    class="mt-5"
                    size="64"
                    data-aos="zoom-in"
                    data-aos-duration="1000"
                ></v-progress-circular>
                <p class="mt-2 mb-5" data-aos="zoom-in" data-aos-delay="200">Loading...</p>
            </v-card-text>
            <v-card-text v-else>
                <!-- general data -->
                <v-row class="my-0 mt-3">
                    <v-col cols="12" lg="5">
                        <v-card class="rounded-xl transparent" elevation="0">
                            <v-card-text class="pa-2 px-3">
                                <p :class="`mb-0 d-flex align-center px-2 ${themeColor}--text text--darken-2`" style="font-size: 17px;">
                                    {{ general.tree.category }} <v-divider class="mx-2"></v-divider> {{ general.tree.name }}
                                </p>
                                <p :class="`mb-0 mt-2 mt-1 ${themeColor} white--text pl-5 rounded-xl py-3 px-2 elevation-7`" style="font-size: 20px;">
                                    <v-icon class="mr-1" color="white">mdi-sprout</v-icon>
                                    <number
                                    ref="treeSumAmount"
                                    :key="componentKeys.treeSumAmount"
                                    :format="$store.getters.numberFormat"
                                    animationPaused
                                    :from="0"
                                    :to="general.tree.sum_amount"
                                    :duration="5"
                                    :delay="0"
                                    easing="Power2.easeInOut"/>
                                </p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" lg="7">
                        <v-row>
                            <v-col cols="12" lg="7">
                                <v-text-field
                                    dense
                                    rounded
                                    outlined
                                    readonly
                                    hide-details
                                    :color="themeColor"
                                    label="Management Unit"
                                    v-model="general.muName"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" lg="5">
                                <v-text-field
                                    hide-details
                                    dense
                                    rounded
                                    outlined
                                    readonly
                                    :color="themeColor"
                                    label="Program Year"
                                    v-model="general.programYear"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" class="pt-lg-0">
                                <!-- Search Input -->
                                <v-text-field
                                    color="success"
                                    item-color="success"
                                    append-icon="mdi-magnify"
                                    outlined
                                    dense
                                    rounded
                                    label="Search"
                                    hide-details
                                    v-model="table.search"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <!-- table -->
                <v-data-table
                    class="transparent"
                    multi-sort
                    :headers="table.headers"
                    :items="table.items"
                    :search="table.search"
                >
                    <template v-slot:item.ff_name="{item}">
                        {{ item.ff_name }}<br>
                        <small>{{ item.ff_no }}</small>
                    </template>
                    <template v-slot:item.farmer_name="{item}">
                        {{ item.farmer_name }}<br>
                        <small>{{ item.farmer_no }}</small>
                    </template>
                    <template v-slot:item.lahan_no="{item}">
                        <v-chip v-if="lahanNoFormat(item.lahan_no).length < 2" :class="`${themeColor} white--text ma-1`">
                            {{ lahanNoFormat(item.lahan_no)[0] }}
                        </v-chip>
                        <v-menu v-else open-on-hover offset-x :close-on-content-click="false" content-class="rounded-xl" >
                            <template v-slot:activator="{attrs, on}">
                                <v-btn rounded small v-bind="attrs" v-on="on" :color="`${themeColor} darken-${lahanNoFormat(item.lahan_no).length < 5 ? lahanNoFormat(item.lahan_no).length : 4} white--text`">
                                    {{ lahanNoFormat(item.lahan_no).length }} Lahan
                                </v-btn>
                            </template>
                            <v-card class="pa-2 pb-1 d-flex flex-column">
                                <v-chip 
                                    v-for="(lahan, lahanIndex) in lahanNoFormat(item.lahan_no)" 
                                    :key="lahanIndex"
                                    :color="`${themeColor} white--text`"
                                    class="mb-1"
                                    style="cursor: auto"
                                >
                                    {{ lahan }}
                                </v-chip>
                            </v-card>
                        </v-menu>
                    </template>
                    <template v-slot:item.qty="{item}">
                        <v-icon>mdi-sprout</v-icon>{{ $store.getters.numberFormat(item.qty) }}
                    </template>
                </v-data-table>
            </v-card-text>
            <v-card-actions class="rounded-xl pl-2 mx-2 mb-2 elevation-3">
                <v-btn rounded outlined color="red" class="pl-1" @click="() => {showDialog = false}"><v-icon class="mr-1">mdi-close-circle</v-icon>Close</v-btn>
                <v-divider class="ml-2"></v-divider>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'

export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
            default: null
        },
    },
    computed: {
        showDialog: {
            get: function () {
                if (this.show == true) {
                    this.themeColor = (this.data.type == 'KAYU' ? 'green' : 'blue')
                    this.getData(this.data.py, this.data.mu_no, this.data.tree_code)
                }
                return this.show
            },
            set: function (val) {
                if (val == false) this.$emit('close', 'detail')
            }
        }
    },
    data: () => ({
        themeColor: 'green',
        loading: false,
        general: {
            programYear: '',
            muName: '',
            tree: {
                code: '',
                name: '',
                category: '',
                sum_amount: 0
            }
        },
        table: {
            headers: [
                {text: 'Field Coordinator', value: 'fc_name'},
                {text: 'Field Facilitator', value: 'ff_name'},
                {text: 'Farmer', value: 'farmer_name'},
                {text: 'Land(s)', value: 'lahan_no'},
                {text: 'Amount', value: 'qty'},
            ],
            items: [],
            search: ''
        },
        componentKeys: {
            treeSumAmount: 123,
        }
    }),
    methods: {
        async getData(py, mu_no, tree_code) {
            if (py && mu_no && tree_code) {
                try {
                    this.loading = true
                    this.general.programYear = py
                    const params = new URLSearchParams({
                        program_year: py,
                        tree_code: tree_code,
                        mu_no: mu_no
                    })
                    const data = await axios.get(this.$store.getters.getApiUrl(`ShowListLandPerTreeCode?${params}`), this.$store.state.apiConfig).then(response => {return response.data})
                    this.general.muName = data.mu
                    this.general.tree = data.tree
                    this.startNumberAnimation('treeSumAmount')
                    this.table.items = data.list.data
                    // console.log(data)
                } catch (err) {
                    if (err.respnse) {
                        if (err.response.status == 401) {
                            localStorage.removeItem("token")
                            this.$router.push("/")
                        }
                    } else console.log(err)
                    this.$emit('close', 'detail')
                } finally {
                    this.loading = false
                }
            }
        },
        async startNumberAnimation (ref) {
            this.componentKeys[ref] += 1
            await setTimeout(() => {
                this.$refs[ref].play()
            }, 100)
        },
        lahanNoFormat(lahan_no) {
            return lahan_no.replace('[', '').replace(']', '').split(',')
        }
    },
}
</script>