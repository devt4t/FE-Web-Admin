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
                        <v-sheet height="600">
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
                                :activator="calendar.selectedElement"
                                offset-x
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
                                                <td>{{ numberFormat(calendar.selectedEvent.total_bibit_sostam) }} Bibit</td>
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
                                                <td align="center">{{ numberFormat(detailData.total_bibit_sostam) }}</td>
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
    }
}
</script>