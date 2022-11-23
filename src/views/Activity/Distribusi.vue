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
                top
                max-width="1000px" 
                scrollable 
                transition="dialog-top-transition"
                v-model="calendar.detailBibit.show" 
            >
                <v-card class="elevation-5 rounded-xl">
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
                        <div v-if="calendar.detailBibit.loading" class="d-flex flex-column align-center justify-center" style="min-height: 250px">
                            <v-progress-circular
                                indeterminate
                                color="green"
                                size="76"
                                width="7"
                            ></v-progress-circular>
                            <p class="mt-2">Getting Seeds Data...</p>
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
                                                <td>Activity</td>
                                                <td>:</td>
                                                <td>{{ calendar.detailBibit.datas.activity == 'sostam' ? 'Sosialisasi Tanam' : 'Penilikan Lubang' }}</td>
                                            </tr>
                                            <tr>
                                                <td>Field Facilitators</td>
                                                <td>:</td>
                                                <td>
                                                    <v-chip color="green white--text" class="mr-1 mb-1" v-for="(ffData, ffIndex) in calendar.detailBibit.datas.FF_details" :key="ffIndex">
                                                        <v-icon small class="mr-1">mdi-clipboard-account</v-icon>
                                                        {{ ffData.name }} ({{ ffData.village_name }})
                                                    </v-chip>
                                                </td>
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
                                    <v-simple-table dense>
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
                                <v-col v-if="calendar.detailBibit.datas.total_bibit_details['MPTS'].length > 0">
                                    <v-simple-table dense>
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
                                    <v-simple-table dense>
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
                    <v-card-actions v-if="calendar.detailBibit.loading == false" class="">
                        <v-btn rounded color="red white--text pr-3" @click="calendar.detailBibit.show = false">
                            <v-icon class="mr-1">mdi-close-circle</v-icon>
                            Close
                        </v-btn>
                        <v-divider class="mx-2"></v-divider>
                        <v-btn rounded color="blue white--text pr-3">
                            <v-icon class="mr-1">mdi-printer</v-icon>
                            Export
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- Detail Period FF Modal -->
            <v-dialog 
                content-class="rounded-xl elevation-0" 
                top
                max-width="1000px" 
                scrollable 
                transition="dialog-top-transition"
                v-model="calendar.detailPeriodFF.show" 
            >
                <v-card class="elevation-5 rounded-xl">
                    <v-card-title class="mb-1 green headermodalstyle rounded-xl d-flex align-center">
                        <span class="d-flex align-center">
                            <v-icon color="white" class="mr-1">
                                mdi-timer
                            </v-icon>
                            Distribution Period
                        </span>
                        <v-divider class="mx-2" dark></v-divider>
                        <v-icon color="white" @click="calendar.detailPeriodFF.show = false">
                            mdi-close-circle
                        </v-icon>
                    </v-card-title>
                    <v-card-text>
                        <!-- loading -->
                        <div v-if="calendar.detailPeriodFF.loading" class="d-flex flex-column align-center justify-center">
                            <v-progress-circular
                                indeterminate
                                color="green"
                                size="72"
                                width="7"
                                class="mt-10"
                            ></v-progress-circular>
                            <p class="mt-2">{{ calendar.detailPeriodFF.loadingText }}</p>
                        </div>
                        <div v-if="calendar.detailPeriodFF.loading == false && calendar.detailPeriodFF.datas">
                            <v-row>
                                <v-col cols="12" lg="6">
                                    <v-simple-table>
                                        <tbody>
                                            <tr>
                                                <th>Field Facilitator</th>
                                                <td>:</td>
                                                <td><small>{{ calendar.detailPeriodFF.datas.FF.ff_no }}</small><br>{{ calendar.detailPeriodFF.datas.FF.name }} </td>
                                            </tr>
                                            <tr>
                                                <th>Field Coordinator</th>
                                                <td>:</td>
                                                <td>{{ calendar.detailPeriodFF.datas.FC.name }}</td>
                                            </tr>
                                            <tr>
                                                <th>Distribution Location</th>
                                                <td>:</td>
                                                <td  v-if="User.role_group == 'IT' || User.role_name == 'PLANNING MANAGER' || User.email == 'faris.ardika@trees4trees.org' || User.email == 'fauzan.timur@trees4trees.org'">
                                                    <v-textarea
                                                        v-model="calendar.detailPeriodFF.newPeriod.distribution_location"
                                                        rows="3"
                                                        dense
                                                        rounded
                                                        outlined
                                                        hide-details
                                                        color="green"
                                                        class="text-caption my-1"
                                                        :rules="[(v) => !!v || 'Field is required']"
                                                    ></v-textarea>
                                                </td>
                                                <td v-else>{{ calendar.detailPeriodFF.newPeriod.distribution_location }}</td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-simple-table>
                                        <tbody>
                                            <tr>
                                                <th>Planting Hole Surveillance</th>
                                                <td>:</td>
                                                <td>{{ dateFormat(calendar.detailPeriodFF.newPeriod.hole_time, 'DD MMMM Y') }}</td>
                                            </tr>
                                            <tr>
                                                <th>Distribution</th>
                                                <td>:</td>
                                                <td v-if="User.role_group == 'IT' || User.role_name == 'PLANNING MANAGER' || User.email == 'faris.ardika@trees4trees.org' || User.email == 'fauzan.timur@trees4trees.org'">
                                                    <v-menu offset-x transition="slide-x-transition" rounded="xl">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <div class="d-flex flex-column align-center">
                                                                <v-btn 
                                                                    rounded class=""
                                                                    color="green white--text"
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                >
                                                                    {{ dateFormat(calendar.detailPeriodFF.newPeriod.distribution_time, 'DD MMMM Y') }}
                                                                </v-btn>
                                                            </div>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="calendar.detailPeriodFF.newPeriod.distribution_time"
                                                            color="green"
                                                            class="rounded-xl"
                                                        ></v-date-picker>
                                                    </v-menu>
                                                </td>
                                                <td v-else>{{ dateFormat(calendar.detailPeriodFF.newPeriod.distribution_time, 'DD MMMM Y') }}</td>
                                            </tr>
                                            <tr>
                                                <th>Planting Realization</th>
                                                <td>:</td>
                                                <td>{{ dateFormat(calendar.detailPeriodFF.newPeriod.planting_time, 'DD MMMM Y') }}</td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                    <v-card-actions class="" v-if="calendar.detailPeriodFF.loading == false && calendar.detailPeriodFF.datas">
                        <v-btn rounded color="red white--text pr-3" @click="calendar.detailPeriodFF.show = false">
                            <v-icon class="mr-1">mdi-close-circle</v-icon>
                            Close
                        </v-btn>
                        <v-divider class="mx-2"></v-divider>
                        <v-btn rounded color="green white--text pr-3" v-if="User.role_group == 'IT' || User.role_name == 'PLANNING MANAGER' || User.email == 'faris.ardika@trees4trees.org' || User.email == 'fauzan.timur@trees4trees.org'" :disabled="calendar.detailPeriodFF.newPeriod.distribution_time == dateFormat(calendar.detailPeriodFF.datas.period.distribution_time, 'Y-MM-DD') && calendar.detailPeriodFF.newPeriod.distribution_location == calendar.detailPeriodFF.datas.period.distribution_location" @click="calendarUpdateDetailFFPeriod ">
                            <v-icon class="mr-1">mdi-content-save-check</v-icon>
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- Loading Line Scan Modal -->
            <v-dialog 
                top
                persistent
                scrollable 
                max-width="700px" 
                content-class="rounded-xl elevation-0 mx-2" 
                v-model="loadingLine.detailDialog.show" 
            >
                <v-card class="elevation-5 rounded-xl">
                    <v-card-title class="mb-1 headermodalstyle rounded-xl d-flex align-center">
                        <span class="d-flex align-center">
                            <v-icon color="white" class="mr-1">
                                mdi-qrcode-scan
                            </v-icon>
                            Scan Bags Loading Line
                        </span>
                        <v-divider class="mx-2" dark></v-divider>
                        <v-icon color="white" @click="loadingLine.detailDialog.show = false">
                            mdi-close-circle
                        </v-icon>
                    </v-card-title>
                    <v-card-text>
                        <!-- loading -->
                        <div v-if="loadingLine.detailDialog.loading" class="d-flex flex-column align-center justify-center">
                            <v-progress-circular
                                indeterminate
                                color="green"
                                size="72"
                                width="7"
                                class="mt-10"
                            ></v-progress-circular>
                            <p class="mt-2">{{ loadingLine.detailDialog.loadingText }}</p>
                        </div>
                        <div v-else>
                            <v-simple-table>
                                <tbody>
                                    <tr>
                                        <th>Field Facilitator</th>
                                        <th>:</th>
                                        <td>T4T Devs</td>
                                    </tr>
                                    <tr>
                                        <th>Management Unit</th>
                                        <th>:</th>
                                        <td>CIWIDEY</td>
                                    </tr>
                                    <tr>
                                        <th>Seedling Total</th>
                                        <th>:</th>
                                        <td>5.500</td>
                                    </tr>
                                    <tr>
                                        <th>Bags / Labels Total</th>
                                        <th>:</th>
                                        <td>612</td>
                                    </tr>
                                    <tr>
                                        <th>Bags / Labels Scanned Total</th>
                                        <th>:</th>
                                        <td>{{ loadingLine.detailDialog.inputs.scanner.values.length }}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                            <p>Scanned: <strong>{{ JSON.stringify(loadingLine.detailDialog.inputs.scanner.values) }}</strong></p>
                            <v-text-field
                                v-model="loadingLine.detailDialog.inputs.scanner.model"
                                @change="scannerUpdate"
                                color="green"
                                placeholder="SCAN HERE"
                                outlined
                                rounded
                                :error-messages="loadingLine.detailDialog.inputs.scanner.alert.color == 'red' ? loadingLine.detailDialog.inputs.scanner.alert.text : ''"
                                :success-messages="loadingLine.detailDialog.inputs.scanner.alert.color == 'green' ? loadingLine.detailDialog.inputs.scanner.alert.text : ''"
                            ></v-text-field>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-divider class="mx-2"></v-divider>
                        <v-btn
                            color="green white--text"
                            rounded
                            class="pr-3"
                            :disabled="loadingLine.detailDialog.inputs.scanner.values.length == 0"
                        >
                            <v-icon class="mr-1">mdi-check-circle</v-icon>
                            Save
                        </v-btn>
                        <v-divider class="mx-2"></v-divider>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- Confirmation -->
            <v-dialog v-model="confirmation.show" max-width="500px" persistent content-class="rounded-lg" scrollable>
                <v-card class="rounded-xl">
                    <v-card-title class="mb-1 headermodalstyle">
                        <v-icon class="mr-2 white--text">mdi-help-circle</v-icon>
                        <span>Confirmation</span>
                        <v-divider dark class="mx-2"></v-divider>
                        <v-icon color="red" @click="confirmation.show = false">mdi-close-circle</v-icon>
                    </v-card-title>
                    <v-card-text>
                        <h2 class="text-center pt-4">{{ confirmation.title }}</h2>
                        <v-row class="mt-10 align-center mb-0">
                            <v-divider class="mx-2"></v-divider>
                            <v-btn rounded color="red white--text mr-1" @click="confirmation.show = false">
                                <v-icon class="mr-1">mdi-close-circle</v-icon>
                                Close
                            </v-btn>
                            <v-btn rounded color="green white--text ml-1" @click="confirmationOk(confirmation.okText)">
                                <v-icon class="mr-1">mdi-check-circle</v-icon>
                                {{ confirmation.okText }}
                            </v-btn>
                            <v-divider class="mx-2"></v-divider>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
        <!-- END: MODAL -->
        
        
        <!-- MAIN Calendar -->
        <v-container fluid>
            <!-- General Settings -->
            <v-toolbar rounded="xl" class="mb-2">
                <v-divider class="mx-2"></v-divider>
                <!-- Program Year -->
                <v-select
                    color="success"
                    item-color="success"
                    v-model="generalSettings.programYear"
                    :items="['2021','2022','2023']"
                    outlined
                    dense
                    hide-details
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    rounded
                    label="Program Year"
                    class="mx-auto mx-lg-3"
                    style="max-width: 200px"
                ></v-select>
                <!-- Nursery -->
                <v-select
                    color="success"
                    item-color="success"
                    v-model="generalSettings.nursery.model"
                    :items="generalSettings.nursery.options"
                    outlined
                    dense
                    hide-details
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    rounded
                    label="Nursery"
                    class="mx-auto mx-lg-3"
                    style="max-width: 200px"
                    :disabled="generalSettings.nursery.disabled || calendar.loading"
                ></v-select>
                <v-divider class="mx-2"></v-divider>
            </v-toolbar>
            <!-- Expansions Panels -->
            <v-expansion-panels multiple v-model="expansions.model">
                <!-- Calendar Section -->
                <v-expansion-panel class="rounded-xl">
                    <v-expansion-panel-header>
                        <h3 class="dark--text"><v-icon class="mr-1">mdi-calendar</v-icon> Distribution Calendar</h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <!-- loading overlay -->
                        <v-overlay :value="calendar.loading" absolute class="rounded-xl" color="white">
                            <div class="d-flex flex-column align-center justify-center">
                                <v-progress-circular
                                    indeterminate
                                    color="green"
                                    size="123"
                                    width="7"
                                ></v-progress-circular>
                                <p class="mt-2 mb-0 green--text white rounded-xl px-2 py-1">Getting distribution datas in <strong>{{ generalSettings.nursery.model }}</strong> Nursery...</p>
                            </div>
                        </v-overlay>
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
                                :start="calendar.range[0]"
                                :end="calendar.range[1]"
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
                            <!-- Card Detail Event -->
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
                                                <td>Total Bibit Sostam</td>
                                                <td>:</td>
                                                <td>    
                                                    <v-tooltip top>
                                                        Click for preview detailed seed
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <strong 
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                class="cursor-pointer" 
                                                                @click="calendarShowDetailTotalBibit(calendar.selectedEvent, 'nursery', 'sostam')"
                                                            >
                                                                {{ numberFormat(calendar.selectedEvent.total_bibit_sostam) }} Bibit
                                                            </strong>
                                                        </template>
                                                    </v-tooltip>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total Bibit Penlub</td>
                                                <td>:</td>
                                                <td>    
                                                    <v-tooltip top>
                                                        Click for preview detailed seed
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <strong 
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                class="cursor-pointer" 
                                                                @click="calendarShowDetailTotalBibit(calendar.selectedEvent, 'nursery', 'penlub')"
                                                            >
                                                                {{ numberFormat(calendar.selectedEvent.total_bibit_penlub) }} Bibit
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
                                    <v-data-table 
                                        hide-default-footer
                                        :items-per-page="-1"
                                        :headers="calendar.table.headers"
                                        :items="calendar.selectedEvent.details"
                                        dense
                                    >
                                        <!-- No Column -->
                                        <template v-slot:item.no="{index}">
                                            {{ index+1 }}
                                        </template>
                                        <!-- Total Bibit Sostam Column -->
                                        <template v-slot:item.total_bibit_sostam="{item}">
                                            {{ numberFormat(item.total_bibit_sostam) }} Bibit
                                        </template>
                                        <!-- Progress Penlub Column -->
                                        <template v-slot:item.progress_penlub="{item}">
                                            <v-chip :color="`${item.progress_penlub == 100 ? 'green' : (item.progress_penlub > 0 ? 'orange' : 'red')} white--text`">
                                                {{ item.progress_penlub }} %
                                            </v-chip>
                                        </template>
                                        <!-- Total Bibit Penlub Column -->
                                        <template v-slot:item.total_bibit_penlub="{item}">
                                            {{ numberFormat(item.total_bibit_penlub) }} Bibit
                                        </template>
                                        <!-- Action Column -->
                                        <template v-slot:item.actions="{item}">
                                            <v-menu
                                                rounded="xl"
                                                bottom
                                                left
                                                offset-y
                                                transition="slide-y-transition"
                                                :close-on-content-click="false"
                                            >
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on" color="dark">
                                                    mdi-arrow-down-drop-circle
                                                    </v-icon>
                                                </template>

                                                <v-list class="d-flex flex-column align-stretch">
                                                    <v-list-item>
                                                        <v-btn 
                                                            block color="blue white--text" rounded 
                                                            @click="calendarShowDetailFFPeriod(item)"
                                                        >
                                                            <v-icon class="mr-1">mdi-calendar</v-icon>
                                                            Period
                                                        </v-btn>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-btn 
                                                            block color="green white--text" rounded 
                                                            @click="calendarShowDetailTotalBibit(item, 'ff', 'sostam')"
                                                        >
                                                            <v-icon class="mr-1">mdi-seed</v-icon>
                                                            Sostam Seeds
                                                        </v-btn>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-btn 
                                                            block color="green white--text" rounded 
                                                            @click="calendarShowDetailTotalBibit(item, 'ff', 'penlub')"
                                                        >
                                                            <v-icon class="mr-1">mdi-sprout</v-icon>
                                                            Penlub Seeds
                                                        </v-btn>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </template>
                                    </v-data-table>
                                </v-card-text>
                                <v-card-actions class="white">
                                    <v-btn
                                        outlined
                                        color="red"
                                        rounded
                                        @click="calendar.selectedOpen = false"
                                    >
                                        <v-icon class="mr-1">mdi-close</v-icon>
                                        Close
                                    </v-btn>
                                    <v-divider class="mx-2"></v-divider>
                                </v-card-actions>
                            </v-card>
                            </v-menu>
                        </v-sheet>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <!-- Packing Label Section -->
                <v-expansion-panel class="rounded-xl">
                    <v-expansion-panel-header>
                        <h3 class="dark--text"><v-icon class="mr-1">mdi-label-multiple</v-icon> Packing Label</h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <!-- loading overlay -->
                        <v-overlay :value="packingLabel.loading" absolute class="rounded-xl" color="white">
                            <div class="d-flex flex-column align-center justify-center">
                                <v-progress-circular
                                    indeterminate
                                    color="green"
                                    size="100"
                                    width="7"
                                ></v-progress-circular>
                                <p v-if="packingLabel.loadingText" class="mt-2 mb-0 green--text white rounded-xl px-2 py-1">{{ packingLabel.loadingText }}</p>
                            </div>
                        </v-overlay>
                        <v-row>
                            <!-- Packing Label Tabs -->
                            <v-col cols="12" v-if="false">
                                <v-tabs
                                    active-class="green rounded-xl"
                                    background-color="green lighten-3"
                                    class="rounded-xl"
                                    color="white"
                                    grow
                                    height="50"
                                    hide-slider
                                    slider-size="50"
                                    slider-color="green rounded-xl"
                                    v-model="packingLabel.tabs.model"
                                >
                                    <v-tab>By Lahan</v-tab>
                                    <v-tab>By Field Facilitator</v-tab>
                                </v-tabs>
                            </v-col>
                            <!-- Packing Label Tables -->
                            <v-col cols="12">
                                <v-tabs-items v-model="packingLabel.tabs.model">
                                    <!-- Packing Label Table 1 ~ Per Lahan -->
                                    <v-tab-item>
                                        <v-data-table
                                            :footer-props="{
                                                itemsPerPageOptions: [10, 25, 40, -1]
                                            }"
                                            :headers="packingLabel.tables.byLahan.headers"
                                            :items="packingLabel.tables.byLahan.items"
                                            :loading="packingLabel.tables.byLahan.loading"
                                            :search="packingLabel.tables.byLahan.search"
                                            multi-sort
                                        >
                                            <template v-slot:top>
                                                <v-row class="mx-0 my-2 align-center">
                                                    <v-divider class="mx-2"></v-divider>
                                                    <v-text-field
                                                        hide-details
                                                        dense
                                                        rounded
                                                        outlined
                                                        color="green"
                                                        placeholder="Start type to search..."
                                                        label="Search"
                                                        append-icon="mdi-magnify"
                                                        v-model="packingLabel.tables.byLahan.search"
                                                    ></v-text-field>
                                                </v-row>
                                            </template>
                                            <!-- Check Column -->
                                            <template v-slot:item.is_checked="{item}">
                                                <v-checkbox
                                                    v-model="item.is_checked"
                                                    @click="confirmationShow('Check Label', item)"
                                                    readonly
                                                    :background-color="`${item.is_checked ? 'green' : 'grey darken-1'} rounded-xl px-2 pr-3 py-1`"
                                                    dark
                                                    color="white"
                                                    class="mt-0"
                                                    hide-details
                                                    :label="`${item.is_checked ? 'Printed' : 'Nope'}`"
                                                    off-icon="mdi-circle-outline"
                                                    on-icon="mdi-check-circle"
                                                ></v-checkbox>
                                            </template>
                                            <!-- Total Bibit Column -->
                                            <template v-slot:item.total_holes="{item}">
                                                {{ numberFormat(item.total_holes) }}
                                            </template>
                                            <!-- Total Bibit Column -->
                                            <template v-slot:item.total_bibit="{item}">
                                                {{ numberFormat(item.total_bibit) }}
                                            </template>
                                            <!-- Actions Column -->
                                            <template v-slot:item.actions="{item}">
                                                <v-menu
                                                    rounded="xl"
                                                    bottom
                                                    left
                                                    offset-y
                                                    transition="slide-y-transition"
                                                    :close-on-content-click="false"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon v-bind="attrs" v-on="on" color="dark">
                                                        mdi-arrow-down-drop-circle
                                                        </v-icon>
                                                    </template>

                                                    <v-list class="d-flex flex-column align-stretch">
                                                        <v-list-item>
                                                            <v-btn 
                                                                block color="blue white--text" rounded 
                                                                @click="printPackingLabelByLahan('label', item.ph_form_no)"
                                                            >
                                                                <v-icon class="mr-1">mdi-printer</v-icon>
                                                                Label
                                                            </v-btn>
                                                        </v-list-item>
                                                        <v-list-item>
                                                            <v-btn 
                                                                color="green white--text" rounded
                                                                @click="printPackingLabelByLahan('tanda_terima', item.ph_form_no)"
                                                            >
                                                                <v-icon class="mr-1">mdi-printer</v-icon>
                                                                Tanda Terima
                                                            </v-btn>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                            </template>
                                        </v-data-table>
                                    </v-tab-item>
                                    <!-- Packing Label Table 2 ~ Per FF -->
                                    <v-tab-item>
                                        <v-data-table
                                        ></v-data-table>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <!-- Loading Line Section -->
                <v-expansion-panel class="rounded-xl">
                    <v-expansion-panel-header>
                        <h3 class="dark--text"><v-icon class="mr-1">mdi-human-dolly</v-icon> Loading Line</h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <!-- loading overlay -->
                        <v-overlay :value="loadingLine.loading" absolute class="rounded-xl" color="white">
                            <div class="d-flex flex-column align-center justify-center">
                                <v-progress-circular
                                    indeterminate
                                    color="green"
                                    size="100"
                                    width="7"
                                ></v-progress-circular>
                                <p v-if="loadingLine.loadingText" class="mt-2 mb-0 green--text white rounded-xl px-2 py-1">{{ loadingLine.loadingText }}</p>
                            </div>
                        </v-overlay>
                        <v-row>
                            <!-- Select Date Input -->
                            <v-col cols="12">
                                <v-toolbar flat>
                                    <v-menu 
                                        rounded="xl"
                                        transition="slide-x-transition"
                                        bottom
                                        min-width="100"
                                        offset-y
                                        :close-on-content-click="true"
                                        v-model="loadingLine.datePicker.show"
                                    >
                                        <template v-slot:activator="{ on: menu, attrs }">
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on: tooltip }">
                                                    <v-text-field
                                                        dense
                                                        color="green"
                                                        hide-details
                                                        outlined
                                                        label="Distribution Date"
                                                        rounded
                                                        v-bind="attrs"
                                                        v-on="{...menu, ...tooltip}"
                                                        readonly
                                                        v-model="loadingLine.datePicker.model"
                                                    ></v-text-field>
                                                </template>
                                                <span>Klik untuk memunculkan datepicker</span>
                                            </v-tooltip>
                                        </template>
                                        <div class="rounded-xl pb-2 white">
                                            <v-overlay :value="loadingLine.datePicker.loading">
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
                                                    color="green lighten-1 rounded-xl" 
                                                    v-model="loadingLine.datePicker.model"
                                                    min="2022-11-24"
                                                    max="2023-01-31"
                                                ></v-date-picker>
                                            </div>
                                        </div>
                                    </v-menu>
                                    <v-divider class="ml-2"></v-divider>
                                    <v-divider></v-divider>
                                    <v-divider></v-divider>
                                    <v-divider></v-divider>
                                    <v-divider></v-divider>
                                    <v-divider></v-divider>
                                </v-toolbar>
                            </v-col>
                            <!-- Loading Line Table -->
                            <v-col cols="12">
                                <v-data-table
                                    :headers="loadingLine.table.headers"
                                    :items="loadingLine.table.items"
                                    :loading="loadingLine.table.loading"
                                >
                                    <!-- Check Column -->
                                    <template v-slot:item.is_loaded="{item}">
                                        <v-checkbox
                                            v-model="item.is_loaded"
                                            readonly
                                            :background-color="`${item.is_loaded ? 'green' : 'grey darken-1'} rounded-xl px-3 py-1`"
                                            dark
                                            color="white"
                                            class="mt-0"
                                            hide-details
                                            :label="`${item.is_loaded ? 'Loaded' : 'Nope'}`"
                                            off-icon="mdi-truck-alert"
                                            on-icon="mdi-truck-check"
                                        ></v-checkbox>
                                    </template>
                                    <!-- Printed Progress Column -->
                                    <template v-slot:item.printed_progress="{item}">
                                        {{ `${item.ph_printed}/${item.ph_all}` }} 
                                        <v-chip :color="`${item.printed_progress == 100 ? 'green' : 'red'} white--text`" class="ml-1">
                                            <v-icon v-if="item.printed_progress == 100" color="white" class="mr-1">mdi-check-circle</v-icon>
                                            <v-icon v-else color="white" class="mr-1">mdi-close-circle</v-icon>
                                            {{ item.printed_progress }}%
                                        </v-chip>
                                    </template>
                                    <!-- Seeds Total Column -->
                                    <template v-slot:item.total_tree_amount="{item}">
                                        {{ numberFormat(item.total_tree_amount) }}
                                    </template>
                                    <!-- Bags Total Column -->
                                    <template v-slot:item.total_bags="{item}">
                                        {{ numberFormat(item.total_bags) }}
                                    </template>
                                    <!-- Actions Column -->
                                    <template v-slot:item.actions="{item}">
                                        <v-btn rounded :disabled="item.printed_progress != 100" color="blue white--text" @click="loadingLine.detailDialog.show = true">
                                            <v-icon class="mr-1">mdi-qrcode-scan</v-icon>
                                            Scan Label
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <!-- Distribution Report Section -->
                <v-expansion-panel class="rounded-xl">
                    <v-expansion-panel-header>
                        <h3 class="dark--text"><v-icon class="mr-1">mdi-notebook-check</v-icon> Distribution Report</h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <!-- loading overlay -->
                        <v-overlay :value="distributionReport.loading" absolute class="rounded-xl">
                            <div class="d-flex flex-column align-center justify-center">
                                <v-progress-circular
                                    indeterminate
                                    color="white"
                                    size="64"
                                ></v-progress-circular>
                            </div>
                        </v-overlay>
                        <v-row>
                            <!-- Distribution Report Table -->
                            <v-col cols="12">
                                <v-data-table
                                    :headers="distributionReport.table.headers"
                                    :items="distributionReport.table.items"
                                >
                                    <template v-slot:item.check="{item}">
                                        <v-checkbox
                                            v-model="item.check"
                                            :background-color="`${item.check ? 'green' : 'grey darken-1'} rounded-xl px-3 py-1`"
                                            dark
                                            color="white"
                                            class="mt-0"
                                            hide-details
                                            :label="`${item.check ? 'Loaded' : 'Nope'}`"
                                            off-icon="mdi-truck-alert"
                                            on-icon="mdi-truck-check"
                                        ></v-checkbox>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-container>

        <!-- Snackbar -->
        <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        rounded="xl"
        >
            <div class="d-flex justify-between">
                <p class="mb-0">
                    {{ snackbar.text }}
                </p>
                <v-spacer></v-spacer>
                <v-icon small class="pl-1" @click="snackbar.show = false">mdi-close-circle</v-icon>
            </div>
        </v-snackbar>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    data: () => ({
        apiConfig: {
            baseUrl: localStorage.getItem('BaseUrlGet'),
            token: localStorage.getItem('token'),
        },
        calendar: {
            colors: ['green', 'teal'],
            detailBibit: {
                show: false,
                loading: false,
                datas : null
            },
            detailPeriodFF: {
                show: false,
                loading: false,
                loadingText: '',
                datas : null,
                newPeriod: {
                    distribution_time: '',
                    hole_time: '',
                    planting_time: '',
                    distribution_location: '',
                }
            },
            events: [],
            focus: '',
            loading: false,
            names: ['Arjasari', 'Ciminyak'],
            range: [ '2022-11-24', '2023-01-31'],
            selectedElement: null,
            selectedEvent: {},
            selectedOpen: false,
            table: {
                headers: [
                    { text: 'No', value: 'no', align: 'center'},
                    { text: 'MU', value: 'mu_name', align: 'left'},
                    { text: 'FF', value: 'ff_name', align: 'left'},
                    { text: 'Total Bibit Sostam', value: 'total_bibit_sostam', align: 'left'},
                    { text: 'Progress PenLub', value: 'progress_penlub', align: 'center'},
                    { text: 'Total Bibit PenLub', value: 'total_bibit_penlub', align: 'center'},
                    { text: 'Actions', value: 'actions', align: 'right'},
                ]
            },
            type: 'month',
            typeToLabel: {
                month: 'Month',
                week: 'Week',
                day: 'Day',
                '4day': '4 Days',
            },
        },
        confirmation: {
            model: null,
            okText: '',
            show: false,
            title: 'Confirmation',
        },
        distributionReport: {
            loading: false,
            table: {
                headers: [],
                items: [],
                loading: false,
            }
        },
        expansions: {
            model: [0,1,2,3]
        },
        generalSettings: {
            nursery: {
                model: 'All',
                options: ['All', 'Arjasari', 'Ciminyak', 'Kebumen', 'Pati'],
                disabled: false,
            },
            programYear: '2022',
        },
        loadingLine: {
            datePicker: {
                loading: false,
                model: moment().format('Y-MM-DD'),
                show: false,
            },
            detailDialog: {
                inputs: {
                    scanner: {
                        alert: {
                            color: '',
                            show: false,
                            text: ''
                        },
                        model: '',
                        values: [],
                    }
                },
                loading: false,
                loadingText: 'Loading...',
                show: false,
            },
            loading: false,
            loadingText: null,
            table: {
                headers: [
                    { text: 'Check', value: 'is_loaded', align: 'center', width: '100'},
                    { text: 'Management Unit', value: 'mu_name'},
                    { text: 'Field Facilitator', value: 'ff_name'},
                    { text: 'Printed Progress', value: 'printed_progress', align: 'center'},
                    { text: 'Seeds Total', value: 'total_tree_amount', align: 'center'},
                    { text: 'Bags Total', value: 'total_bags', align: 'center'},
                    { text: 'Actions', value: 'actions', align: 'right'},
                ],
                items: [],
                loading: false,
            }
        },
        packingLabel: {
            dialogs: {
                checkedConfirmation: {
                    show: false,
                    model: {
                        ph_form_no: null,
                        status: 0
                    }
                }
            },
            loading: false,
            loadingText: null,
            tables: {
                byLahan: {
                    headers: [
                        { text: 'Check', value: 'is_checked', align: 'center', width: '100'},
                        { text: "No Lahan", align: "start", value: "lahan_no"},
                        { text: "Management Unit", value: "mu_name"},
                        { text: "Target Area", value: "ta_name"},
                        { text: "Field Facilitator", value: "nama_ff"},
                        { text: "Farmer", value: "nama_petani"},
                        { text: "Seeds Total", value: "total_bibit", align: 'center' },
                        { text: "Actions", value: "actions", sortable: false, align: 'right' },
                    ],
                    items: [],
                    loading: false,
                    search: ''
                }
            },
            tabs: {
                model: 0
            },
        },
        snackbar: {
            color: '',
            show: false,
            text: '',
            timeout: 10000,
        },
        User: JSON.parse(localStorage.getItem("User"))
    }),
    async mounted() {
        if (this.User.ff.value_data == '-') this.User.ff.value_data = 'all'
        await this.firstAccessPage()
    },
    destroyed() {
        this.$store.state.loadingOverlay = false
    },
    watch: {
        'calendar.events': {
            handler(newValue) {
                // console.log(newValue)
            }
        },
        'generalSettings.nursery.model': {
            async handler(newValue, oldValue) {
                if (newValue != oldValue) {
                    const calendar = {
                        start: this.$refs.calendar.renderProps.start,
                        end: this.$refs.calendar.renderProps.end,
                    }
                    this.packingLabel.loadingText = 'Waiting for completed get distribution calendar data...'
                    this.packingLabel.loading = true
                    this.loadingLine.loadingText = 'Waiting for completed get distribution calendar data...'
                    this.loadingLine.loading = true
                    // refresh calendar
                    await this.calendarUpdateRange({start: calendar.start, end: calendar.end})
                    this.packingLabel.loadingText = 'Getting packing label data...'
                    this.loadingLine.loadingText = 'Waiting for completed get packing label data...'
                    // refresh packing label table
                    await this.getPackingLabelTableData()
                    this.packingLabel.loading = false
                    this.loadingLine.loadingText = 'Getting loading line data...'
                    await this.getLoadinglineTableData()
                    this.loadingLine.loading = false
                }
            }
        },
        'generalSettings.programYear': {
            async handler(newValue) {
                if (newValue == '2022') {
                    this.calendar.range = [ '2022-11-24', '2023-01-31']
                } else if (newValue == '2023') {
                    this.calendar.range = [ '2023-11-24', '2024-01-31']
                } else {
                    this.calendar.range = ['2021-11-24', '2022-01-31']
                }
                this.calendar.focus = this.calendar.range[0]
                // refresh packing label table
                await this.getPackingLabelTableData()
            }
        },
        'packingLabel.tabs.model': {
            async handler(newValue) {
                if (newValue == 0 && this.packingLabel.tables.byLahan.items.length == 0) {
                    await this.getPackingLabelTableData()
                }
            }  
        },
        'calendar.detailPeriodFF.newPeriod.distribution_time' : {
            handler(newValue) {
                this.calendar.detailPeriodFF.newPeriod.hole_time = moment(newValue).subtract(14, 'days').format('Y-MM-DD')
                this.calendar.detailPeriodFF.newPeriod.planting_time = moment(newValue).add(7, 'days').format('Y-MM-DD')
            }
        },
        'loadingLine.datePicker.model': {
            async handler() {
                await this.getLoadinglineTableData()
            }
        }
    },
    methods: {
        // CALENDAR
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
        async calendarShowDetailFFPeriod(data) {
            const params = {
                ff_no: data.ff_no,
                program_year: data.planting_year
            }
            this.calendar.detailPeriodFF.show = true
            this.calendar.detailPeriodFF.loading = true
            this.calendar.detailPeriodFF.loadingText = 'Getting Distribution Period Data...'
            axios.get(`${this.apiConfig.baseUrl}DistributionPeriodDetail?${new URLSearchParams(params)}`,
                {
                    headers: {
                        Authorization: `Bearer ` + this.apiConfig.token
                    },
                }
            ).then(res => {
                const response = res.data.data.result
                console.log(response)
                this.calendar.detailPeriodFF.datas = response
                this.calendar.detailPeriodFF.newPeriod.distribution_time = this.dateFormat(response.period.distribution_time, 'Y-MM-DD')
                this.calendar.detailPeriodFF.newPeriod.distribution_location = response.period.distribution_location
                this.calendar.detailPeriodFF.newPeriod.hole_time = response.period.pembuatan_lubang_tanam
                this.calendar.detailPeriodFF.newPeriod.planting_time = response.period.planting_time
            }).catch(err => {
                this.sessionEnd(err)
            }).finally(() => {
                this.calendar.detailPeriodFF.loading = false
                this.calendar.detailPeriodFF.loadingText = ''
            })
        },
        async calendarUpdateDetailFFPeriod() {
            const datapost = {
                form_no: this.calendar.detailPeriodFF.datas.sostam.form_no,
                ff_no: this.calendar.detailPeriodFF.datas.sostam.ff_no,
                farmer_no: this.calendar.detailPeriodFF.datas.sostam.farmer_no,
                no_lahan: this.calendar.detailPeriodFF.datas.sostam.no_lahan,
                program_year: this.calendar.detailPeriodFF.datas.sostam.planting_year,
                pembuatan_lubang_tanam: this.calendar.detailPeriodFF.newPeriod.hole_time,
                distribution_time: this.calendar.detailPeriodFF.newPeriod.distribution_time,
                planting_time: this.calendar.detailPeriodFF.newPeriod.planting_time,
                distribution_location: this.calendar.detailPeriodFF.newPeriod.distribution_location,
            };
            console.log(datapost);
            try {
                this.calendar.detailPeriodFF.loading = true
                this.calendar.detailPeriodFF.loadingText = 'Updating Distribution Period...'

                await axios.post(
                    this.apiConfig.baseUrl + "UpdateSosialisasiTanamPeriod",
                    datapost,
                    {
                        headers: {
                            Authorization: `Bearer ` + this.apiConfig.token,
                        },
                    }
                ).then(response => {
                    if (response.data.data.result == "success") {
                        this.snackbar.show = true
                        this.snackbar.color = "green"
                        this.snackbar.text = "Update distribution period success!"

                        this.calendar.detailPeriodFF.show = false
                        this.calendar.selectedOpen = false

                        const calendar = {
                            start: this.$refs.calendar.renderProps.start,
                            end: this.$refs.calendar.renderProps.end,
                        }
                        // refresh calendar
                        this.calendarUpdateRange({start: calendar.start, end: calendar.end})
                        // refresh packing label table
                        this.getPackingLabelTableData()
                    } else {
                        this.snackbar.show = true
                        this.snackbar.color = "red"
                        this.snackbar.text = "Update distribution period failed!"
                    }
                }).catch(err => {
                    this.sessionEnd(err)
                })
            } catch (error) {
                console.log(error)
            } finally {
                this.calendar.detailPeriodFF.loading = false
                this.calendar.detailPeriodFF.loadingText = ''
            }
            },
        async calendarShowDetailTotalBibit(datas, type, activity) {
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
                program_year: program_year,
                activity: activity
            })
            await axios.get(url, {
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token")
                },
            }).then(res => {
                this.calendar.detailBibit.datas = res.data.data.result
            }).catch(err => {
                console.log(err.response)
                this.sessionEnd(err)
            }).finally(() => {
                this.calendar.detailBibit.loading = false
            })
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
            this.generalSettings.nursery.model = 'Pati'
            this.calendar.loading = true
            await this.getUserException()
            const params = new URLSearchParams({
                month: this.dateFormat(start.date, 'MM'),
                year: this.dateFormat(start.date, 'Y'),
                program_year: this.generalSettings.programYear,
                nursery: this.generalSettings.nursery.model
            })

            const res = await axios.get(
                this.apiConfig.baseUrl + 'DistributionCalendar?' + params,
                {
                    headers: {
                        Authorization: `Bearer ` + this.apiConfig.token
                    },
                }
            ).catch(err => {
                this.sessionEnd(err)
            })
            const resData = res.data.data.result.datas
            const events = []

            console.log(resData)
            await resData.forEach((evData, evIndex) => {
                events.push({
                    name: evData.nursery,
                    start: this.dateFormat(evData.date, 'YYYY-MM-DD'),
                    total_ff: evData.total,
                    total_bibit_sostam: evData.total_bibit_sostam,
                    total_bibit_penlub: evData.total_bibit_penlub,
                    color: this.calendarGetNurseryColor(evData.nursery, evData.total, evData.date),
                    details: evData.details,
                })
            })

            this.calendar.events = events
            this.calendar.loading = false
        },
        // FF
        async getFFMUNo(ff_no) {
            let mu_no = ''
            await axios.get(
                this.apiConfig.baseUrl + 'GetFieldFacilitatorDetail?id=999&ff_no=' + ff_no,
                {
                    headers: {
                        Authorization: `Bearer ` + this.apiConfig.token
                    },
                }
            ).then(result => {
                const res = result.data.data.result
                if (typeof res.mu_no != 'undefined') {
                    mu_no = res.mu_no
                }
            }).catch(err => {
                console.error(err)
            })
            return mu_no
        },
        // PACKING LABEL
        async getPackingLabelTableData() {
            let url = ''
            let params = {
                typegetdata: this.User.ff.value_data,
                ff: this.User.ff.ff,
                program_year: this.generalSettings.programYear,
                nursery: this.generalSettings.nursery.model
            }
            if (this.packingLabel.tabs.model == 0) {
                this.packingLabel.tables.byLahan.loading = true
                url = 'GetPackingLabelByLahan?'
            }

            if (url && params) {
                const urlParams = new URLSearchParams(params)
                // call api
                await axios.get(
                    this.apiConfig.baseUrl + url + urlParams,
                    {
                        headers: {
                            Authorization: `Bearer ` + this.apiConfig.token
                        },
                    }
                ).then(res => {
                    this.packingLabel.tables.byLahan.items = res.data.data.result.data
                }).catch(err => {
                    if (err.response.status == 404) {
                        this.packingLabel.tables.byLahan.items = []
                    }
                    this.sessionEnd(err)
                }).finally(() => {
                    this.packingLabel.tables.byLahan.loading = false
                })
            }
        },
        printPackingLabelByLahan(type, form_no) {
            if (type == 'label') {
                window.open(
                    this.apiConfig.baseUrl.substring(0, this.apiConfig.baseUrl.length - 4) +
                    "CetakLabelLubangTanamTemp?ph_form_no=" + form_no
                )
            } else if (type == 'tanda_terima') {
                window.open(
                    this.apiConfig.baseUrl.substring(0, this.apiConfig.baseUrl.length - 4) +
                    "CetakBuktiPenyerahanTemp?ph_form_no=" + form_no
                )
            }
        },
        async updateCheckedPlantingHoles(ph_form_no, status) {
            if (status == 0 && (this.User.role_group == 'IT' || this.User.role_name == 'NURSERY' || this.User.role_name == 'NURSERY MANAGER')) {
                this.packingLabel.loadingText = 'Updating status packing label & creating loading line data...'
                this.packingLabel.loading = true
                const url = this.apiConfig.baseUrl + 'CheckedPlantingHole?'
                const params = {
                    program_year: this.generalSettings.programYear,
                    ph_form_no: ph_form_no
                }
                let success = 0
                await axios.get(`${url}${new URLSearchParams(params)}`, {
                    headers: {
                        Authorization: `Bearer ${this.apiConfig.token}`
                    }
                }).then(res => {
                    success = 1
                }).catch(err => {
                    console.log(err.response)
                    if (err.response.status == 404 ||err.response.status == 400 ) {
                        this.snackbar.text = err.response.data.data.result
                        this.snackbar.color = 'red'
                        this.snackbar.show = true
                    }
                    this.sessionEnd(err)
                }).finally(() => {
                    this.packingLabel.loading = false
                    this.packingLabel.loadingText = null
                })
                if (success == 1) {
                    this.packingLabel.loadingText = 'Updating packing label data...'
                    this.loadingLine.loadingText = 'Waiting...'
                    this.loadingLine.loading = true
                    await this.getPackingLabelTableData()
                    this.packingLabel.loadingText = null
    
                    this.loadingLine.loadingText = 'Updating loading line data...'
                    await this.getLoadinglineTableData()
                    this.loadingLine.loading = false
                    this.loadingLine.loadingText = null
                }
            } else if (this.User.role_group != 'IT' || this.User.role_name != 'NURSERY' || this.User.role_name != 'NURSERY MANAGER') {
                this.snackbar.text = `Can't use this modul from this user.`
                this.snackbar.color = 'red'
                this.snackbar.show = true
            } else {
                this.snackbar.text = 'Already been checked!'
                this.snackbar.color = 'red'
                this.snackbar.show = true
            }
        },
        // LOADING LINE
        async getLoadinglineTableData() {
            this.loadingLine.table.loading = true
            let url = 'GetLoadingLine?'
            let params = {
                typegetdata: this.User.ff.value_data,
                ff: this.User.ff.ff,
                program_year: this.generalSettings.programYear,
                nursery: this.generalSettings.nursery.model,
                distribution_date: this.loadingLine.datePicker.model
            }
            await axios.get(`${this.apiConfig.baseUrl + url + new URLSearchParams(params)}`, {
                headers: {
                    Authorization: `Bearer ${this.apiConfig.token}`
                }
            }).then(result => {
                const res = result.data.data.result
                this.loadingLine.table.items = res 
            }).catch(err => {
                console.error(err)
                this.sessionEnd(err)
            }).finally(() => {
                this.loadingLine.table.loading = false
            })
        },
        // Utilities
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
        async confirmationOk(type) {
            this.confirmation.show = false
            if (type == 'Check Label') {
                await this.updateCheckedPlantingHoles(this.confirmation.model.ph_form_no, this.confirmation.model.status)
            }
        },
        confirmationShow(type, data) {
            if (type == 'Check Label') {
                if (data.is_checked == 0) {
                    this.confirmation.title = `Do u want to check this label? This can't be undone!`
                    this.confirmation.okText = 'Check Label'
                    this.confirmation.show = true
                    this.confirmation.model = {
                        ph_form_no: data.ph_form_no,
                        status: data.is_checked
                    }
                } else {
                    this.snackbar.text = 'Already been checked!'
                    this.snackbar.color = 'red'
                    this.snackbar.show = true
                }
            }
        },
        dateFormat(date, format) {
            return moment(date).format(format)
        },
        async firstAccessPage() {
            this.packingLabel.loadingText = 'Getting packing label data...'
            this.packingLabel.loading = true
            this.loadingLine.loadingText = 'Waiting for completed get packing label data...'
            this.loadingLine.loading = true

            await this.getPackingLabelTableData()
            this.packingLabel.loading = false
            this.loadingLine.loadingText = 'Getting loading line data...'
            await this.getLoadinglineTableData()
            this.loadingLine.loading = false
        },
        getNurseryAlocation(mu_no) {
            const ciminyak   = ['023', '026', '027', '021' ]
            const arjasari   = ['022', '024', '025', '020', '029']
            const kebumen    = ['019']
            const pati       = ['015']
            
            let nursery = 'All'

            if (ciminyak.includes(mu_no)) {
                nursery = 'Ciminyak'
            } else if (arjasari.includes(mu_no)) {
                nursery = 'Arjasari'
            } else if (kebumen.includes(mu_no)) {
                nursery = 'Kebumen'
            } else if (pati.includes(mu_no)) {
                nursery = 'Pati'
            }
            
            return nursery;
        },
        async getUserException() {
            if (this.User.role_name == 'UNIT MANAGER') {
                if (typeof this.User.ff.ff[0] != 'undefined') {
                    const mu_no = await this.getFFMUNo(this.User.ff.ff[0])
                    this.generalSettings.nursery.model = this.getNurseryAlocation(mu_no)
                    this.generalSettings.nursery.disabled = true
                }
            } else {
                const nurserySite = ['Arjasari', 'Ciminyak', 'Kebumen', 'Pati']
                await nurserySite.forEach((val) => {
                    if (this.$store.state.nurseryTeam.emails[val].includes(this.User.email)) {
                        this.generalSettings.nursery.model = val
                        this.generalSettings.nursery.disabled = true
                    }
                })
            }
        },
        numberFormat(num) {
            return new Intl.NumberFormat('id-ID').format(num)
        },
        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        async scannerUpdate() {
            const existsScannedLabel = this.loadingLine.detailDialog.inputs.scanner.values
            const newLabel = this.loadingLine.detailDialog.inputs.scanner.model
            let audio = null
            const totalChar = 21
            
            if (newLabel.length != totalChar) {
                    audio = new Audio(require('@/assets/audio/error.mp3'))
    
                    this.loadingLine.detailDialog.inputs.scanner.alert.text = `Label "${newLabel}" invalid format, total char is ${totalChar}!`
                    this.loadingLine.detailDialog.inputs.scanner.alert.color = 'red'

            } else {
                if (existsScannedLabel.includes(newLabel) == false) {
                    this.loadingLine.detailDialog.inputs.scanner.values.push(newLabel)
                    audio = new Audio(require('@/assets/audio/success.mp3'))
    
                    this.loadingLine.detailDialog.inputs.scanner.alert.text = `Label "${newLabel}" scaned!`
                    this.loadingLine.detailDialog.inputs.scanner.alert.color = 'green'
    
                } else {
                    audio = new Audio(require('@/assets/audio/error.mp3'))
    
                    this.loadingLine.detailDialog.inputs.scanner.alert.text = `Label "${newLabel}" has been already scaned!`
                    this.loadingLine.detailDialog.inputs.scanner.alert.color = 'red'
                }
            }
            

            await audio.play()
            this.loadingLine.detailDialog.inputs.scanner.alert.show = true
            this.loadingLine.detailDialog.inputs.scanner.model = ''
        },
        sessionEnd(error) {
            if (typeof error.response.status != 'undefined') {
                if (error.response.status == 401) {
                    localStorage.removeItem("token")
                    this.$router.push("/")
                }
            }
        },
    }
}
</script>