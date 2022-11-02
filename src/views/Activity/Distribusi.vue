<template>
    <div>
        <!-- Breadcrumb -->
        <v-breadcrumbs
          class="breadcrumbsmain"
          :items="[{
            text: 'Activities',
            disabled: true,
            href: 'breadcrumbs_dashboard',
          },{
            text: 'Distribusi',
            disabled: true,
            href: 'breadcrumbs_link_1',
          }]"
          divider='>'
          large
        ></v-breadcrumbs>
        <!-- MODAL -->
        <!-- Detail Seed Modal -->
        <v-dialog 
            content-class="rounded-xl elevation-0" 
            hide-overlay top
            max-width="1000px" 
            scrollable 
            transition="dialog-top-transition"
            v-model="calendar.detailBibit.show" 
        >
            <v-card class="elevation-5 rounded-xl ma-2">
                <v-card-title class="mb-1 green headermodalstyle rounded-xl d-flex align-center">
                    <span class="d-flex align-center">
                        <v-icon color="white" class="mr-1">
                            mdi-sprout
                        </v-icon>
                        Seed Details
                    </span>
                    <v-divider class="mx-2" dark></v-divider>
                    <v-icon color="white" @click="calendar.detailBibit.show = false">
                        mdi-close-circle
                    </v-icon>
                </v-card-title>
                <v-card-text>
                    <!-- loading -->
                    <div v-if="calendar.detailBibit.loading" class="d-flex flex-column align-center justify-center">
                        <v-progress-circular
                            indeterminate
                            color="green"
                            size="64"
                        ></v-progress-circular>
                    </div>
                    <div v-else>
                        <v-row v-if="calendar.detailBibit.datas">
                            <!-- Desc -->
                            <v-col cols="12">
                                <v-simple-table>
                                    <tbody>
                                        <tr>
                                            <td>Program Year</td>
                                            <td>:</td>
                                            <td>{{ calendar.detailBibit.datas.program_year }}</td>
                                        </tr>
                                        <tr>
                                            <td>Field Facilitators</td>
                                            <td>:</td>
                                            <td>{{ calendar.detailBibit.datas.FF.length }} FF ({{ calendar.detailBibit.datas.FF.toString() }})</td>
                                        </tr>
                                        <tr>
                                            <td>Total Bibit</td>
                                            <td>:</td>
                                            <td>{{ numberFormat(calendar.detailBibit.datas.total_bibit) }} Bibit</td>
                                        </tr>
                                    </tbody>
                                </v-simple-table>
                            </v-col>
                            <!-- KAYU -->
                            <v-col>
                                <v-simple-table >
                                    <thead>
                                        <tr>
                                            <th colspan="3" class="text-center">KAYU</th>
                                        </tr>
                                        <tr>
                                            <th>No</th>
                                            <th>Name</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(tree, treeIndex) in calendar.detailBibit.datas.total_bibit_details['KAYU']" :key="treeIndex">
                                            <td>{{ treeIndex += 1 }}</td>
                                            <td>{{ tree.tree_name }}</td>
                                            <td>{{ numberFormat(tree.amount) }}</td>
                                        </tr>
                                    </tbody>
                                </v-simple-table>
                            </v-col>
                            <!-- MPTS -->
                            <v-col>
                                <v-simple-table >
                                    <thead>
                                        <tr>
                                            <th colspan="3" class="text-center">MPTS</th>
                                        </tr>
                                        <tr>
                                            <th>No</th>
                                            <th>Name</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(tree, treeIndex) in calendar.detailBibit.datas.total_bibit_details['MPTS']" :key="treeIndex">
                                            <td>{{ treeIndex += 1 }}</td>
                                            <td>{{ tree.tree_name }}</td>
                                            <td>{{ numberFormat(tree.amount) }}</td>
                                        </tr>
                                    </tbody>
                                </v-simple-table>
                            </v-col>
                            <!-- CROPS -->
                            <v-col v-if="calendar.detailBibit.datas.total_bibit_details['CROPS'].length > 0">
                                <v-simple-table >
                                    <thead>
                                        <tr>
                                            <th colspan="3" class="text-center">CROPS</th>
                                        </tr>
                                        <tr>
                                            <th>No</th>
                                            <th>Name</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(tree, treeIndex) in calendar.detailBibit.datas.total_bibit_details['CROPS']" :key="treeIndex">
                                            <td>{{ treeIndex += 1 }}</td>
                                            <td>{{ tree.tree_name }}</td>
                                            <td>{{ numberFormat(tree.amount) }}</td>
                                        </tr>
                                    </tbody>
                                </v-simple-table>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- END: MODAL -->

        <!-- MAIN Calendar -->
        <v-container fluid>
            <!-- Expansions Panels -->
            <v-expansion-panels multiple v-model="expansions.model">
                <!-- Calendar Panel -->
                <v-expansion-panel class="rounded-xl">
                    <v-expansion-panel-header>
                        <h3 class="dark--text"><v-icon class="mr-1">mdi-calendar</v-icon> Distribution Calendar</h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row class="mb-3 align-center">
                            <v-spacer></v-spacer>
                            <v-btn
                                fab
                                text
                                small
                                color="grey darken-2"
                                @click="calendarPrev"
                            >
                                <v-icon small>
                                mdi-chevron-left
                                </v-icon>
                            </v-btn>
                            <v-toolbar-title v-if="$refs.calendar">
                                {{ $refs.calendar.title }}
                            </v-toolbar-title>
                            <v-btn
                                fab
                                text
                                small
                                color="grey darken-2"
                                @click="calendarNext"
                            >
                                <v-icon small>
                                mdi-chevron-right
                                </v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-sheet height="750">
                            <v-calendar
                                ref="calendar"
                                v-model="calendar.focus"
                                color="green"
                                start="2022-11-24"
                                end="2023-01-31"
                                show-week
                                class="rounded-xl overflow-hidden"
                                :event-margin-bottom="5"
                                :events="calendar.events"
                                :event-color="calendarGetEventColor"
                                :event-text-color="calendarGetEventTextColor"
                                :type="calendar.type"
                                @click:event="calendarShowEvent"
                                @change="calendarUpdateRange"
                            >
                                <!-- <template v-slot:day-label="{day}">
                                    {{ day }}
                                </template> -->
                                <template v-slot:event="{event}">
                                    <h4 class="mx-1 text-center">
                                        <v-icon v-if="event.color == 'green'" dark small>mdi-check-circle</v-icon>
                                        <v-icon v-else-if="event.color == 'red'" dark small>mdi-close-circle</v-icon>
                                        {{ event.name }} ~ {{ event.total_ff }} FF 
                                    </h4>
                                </template>
                            </v-calendar>
                            <v-menu
                                v-model="calendar.selectedOpen"
                                :close-on-content-click="false"
                                :close-on-click="false"
                                :activator="calendar.selectedElement"
                                transition="scale-transition"
                                offset-y
                                rounded="xl"
                            >
                            <v-card
                                color="grey lighten-4"
                                min-width="350px"
                                max-height="700"
                                class="red"
                                flat
                            >
                                <v-toolbar
                                :color="calendar.selectedEvent.color"
                                :dark="calendar.selectedEvent.color == 'yellow' ? false : true"
                                >
                                    <v-btn icon>
                                        <v-icon>mdi-calendar</v-icon>
                                    </v-btn>
                                    <v-toolbar-title>
                                        <strong>{{ calendar.selectedEvent.name }}</strong>
                                    </v-toolbar-title>
                                    <v-divider class="mx-2"></v-divider>
                                    <v-btn icon @click="calendar.selectedOpen = false">
                                        <v-icon>mdi-close-circle</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <v-card-text class="white">
                                    <v-simple-table class="rounded-xl">
                                        <tbody>
                                            <tr>
                                                <td>Tanggal</td>
                                                <td>:</td>
                                                <td>{{ dateFormat(calendar.selectedEvent.start, 'dddd, DD MMMM Y') }}</td>
                                            </tr>
                                            <tr>
                                                <td>Total Bibit</td>
                                                <td>:</td>
                                                <td>    
                                                    <v-tooltip top>
                                                        Click for preview detailed seed
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <strong 
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                class="cursor-pointer" 
                                                                @click="showDetailTotalBibit(calendar.selectedEvent, 'nursery')"
                                                            >
                                                                {{ numberFormat(calendar.selectedEvent.total_bibit_sostam) }} Bibit
                                                            </strong>
                                                        </template>
                                                    </v-tooltip>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total FF</td>
                                                <td>:</td>
                                                <td>{{ calendar.selectedEvent.total_ff }} FF</td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                    <v-simple-table class="my-1" >
                                        <thead>
                                            <tr>
                                                <td>No</td>
                                                <td>Management Unit</td>
                                                <td>FF Name</td>
                                                <td>Bibit Sostam</td>
                                                <td>Location</td>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            <tr v-for="(detailData, detailIndex) in calendar.selectedEvent.details" :key="detailIndex">
                                                <td>{{ detailIndex + 1 }}</td>
                                                <td>{{ detailData.mu_name }}</td>
                                                <td>{{ detailData.ff_name }}</td>
                                                <td align="center">
                                                    <v-tooltip top>
                                                        Click for preview detailed seed
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <strong 
                                                                v-on="on"
                                                                v-bind="attrs"
                                                                @click="showDetailTotalBibit(detailData, 'ff')"
                                                                class="cursor-pointer"
                                                            >{{ numberFormat(detailData.total_bibit_sostam) }}</strong>
                                                        </template>
                                                    </v-tooltip>
                                                </td>
                                                <td>{{ detailData.distribution_location }}</td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-card-text>
                                <v-card-actions class="white">
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        outlined
                                        color="red"
                                        rounded
                                        @click="calendar.selectedOpen = false"
                                    >
                                        <v-icon class="mr-1">mdi-close</v-icon>
                                        Close
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                            </v-menu>
                        </v-sheet>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    data: () => ({
        calendar: {
            colors: ['green', 'teal'],
            detailBibit: {
                show: false,
                loading: false,
                datas : null
            },
            events: [],
            focus: '',
            names: ['Arjasari', 'Ciminyak'],
            selectedElement: null,
            selectedEvent: {},
            selectedOpen: false,
            type: 'month',
            typeToLabel: {
                month: 'Month',
                week: 'Week',
                day: 'Day',
                '4day': '4 Days',
            },
        },
        expansions: {
            model: [0]
        },
    }),
    async mounted() {
        await this.firstAccessPage()
    },
    watch: {
        'calendar.events': {
            handler(newValue) {
                console.log(newValue)
            }
        }
    },
    methods: {
        // Calendar
        calendarGetEventColor (event) {
            return event.color
        },
        calendarGetEventTextColor (event) {
            const color = event.color 
            const light = ['yellow']
            if (light.includes(color)) {
                return 'black'
            } else return 'white'
        },
        calendarPrev () {
            this.$refs.calendar.prev()
        },
        calendarNext () {
            this.$refs.calendar.next()
        },
        calendarShowEvent ({ nativeEvent, event }) {
            const open = () => {
                this.calendar.selectedEvent = event
                this.calendar.selectedElement = nativeEvent.target
                requestAnimationFrame(() => requestAnimationFrame(() => this.calendar.selectedOpen = true))
            }

            if (this.calendar.selectedOpen) {
                this.calendar.selectedOpen = false
            requestAnimationFrame(() => requestAnimationFrame(() => open()))
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },
        async calendarUpdateRange ({ start, end }) {
            this.$store.state.loadingOverlay = true
            const params = new URLSearchParams({
                month: this.dateFormat(start.date, 'MM'),
                year: this.dateFormat(start.date, 'Y'),
                program_year: 2022
            })

            const res = await axios.get(
                localStorage.getItem("BaseUrlGet") + 'DistributionCalendar?' + params,
                {
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token")
                    },
                }
            )
            const resData = res.data.data.result.datas
            const events = []

            console.log(resData)
            await resData.forEach((evData, evIndex) => {
                events.push({
                    name: evData.nursery,
                    start: this.dateFormat(evData.date, 'YYYY-MM-DD'),
                    total_ff: evData.total,
                    total_bibit_sostam: evData.total_bibit_sostam,
                    color: this.calendarGetNurseryColor(evData.nursery, evData.total, evData.date),
                    details: evData.details,
                })
            })

            this.calendar.events = events
            this.$store.state.loadingOverlay = false
        },
        // Utilities
        async firstAccessPage() {
            this.$refs.calendar.checkChange()
        },
        calendarGetNurseryColor(n, total, date) {
            let maxFF = this.calendarGetMaxFF(n, date)
            
            if (total === maxFF) {
                return 'green'
            } else if (total > maxFF) {
                return 'red'
            } else {
                return 'yellow'
            }
        },
        calendarGetMaxFF(n, date) {
            if (n == 'Arjasari') {
                if (date >= '2022-12-21' && date <= '2022-12-31') {
                    return 8
                } else if (date >= '2023-01-01' && date <= '2023-01-31') {
                    return 5
                } else return 4
            } else if (n == 'Ciminyak') {
                if (date >= '2022-12-21' && date <= '2022-12-31') {
                    return 8
                } else return 4
            } else if (n == 'Kebumen' || n == 'Pati') {
                return 2
            } else return 4
        },
        dateFormat(date, format) {
            return moment(date).format(format)
        },
        numberFormat(num) {
            return new Intl.NumberFormat('id-ID').format(num)
        },
        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        async showDetailTotalBibit(datas, type) {
            let ff_no = []
            let program_year = ''
            if (type == 'nursery') {
                await datas.details.forEach(val => {
                    ff_no.push(val.ff_no)
                    if (program_year == '') {
                        program_year = val.planting_year
                    }
                })
            } else if (type == 'ff') {
                ff_no.push(datas.ff_no)
                program_year = datas.planting_year
            }
            this.calendar.detailBibit.show = true
            this.calendar.detailBibit.loading = true
            
            let url = localStorage.getItem("BaseUrlGet") + 'DistributionSeedDetail?' + new URLSearchParams({
                ff_no: ff_no.toString(),
                program_year: program_year
            })
            await axios.get(url, {
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token")
                },
            }).then(res => {
                this.calendar.detailBibit.datas = res.data.data.result
            }).catch(err => {
                console.log(err.response)
            }).finally(() => {
                this.calendar.detailBibit.loading = false
                console.log('finish')
            })
        }
    }
}
</script>