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
                    <v-card-actions class="">
                        <v-btn rounded color="red white--text pr-3" @click="calendar.detailBibit.show = false">
                            <v-icon class="mr-1">mdi-close-circle</v-icon>
                            Close
                        </v-btn>
                        <v-divider class="mx-2"></v-divider>
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
                                                <td>{{ calendar.detailPeriodFF.datas.FF.name }} <br><small>{{ calendar.detailPeriodFF.datas.FF.ff_no }}</small></td>
                                            </tr>
                                            <tr>
                                                <th>Field Coordinator</th>
                                                <td>:</td>
                                                <td>{{ calendar.detailPeriodFF.datas.FC.name }}</td>
                                            </tr>
                                            <tr>
                                                <th>Distribution Location</th>
                                                <td>:</td>
                                                <td>{{ calendar.detailPeriodFF.datas.period.distribution_location }}</td>
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
                                                <td>
                                                    <v-menu offset-x transition="slide-x-transition" rounded="xl">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <div class="d-flex flex-column align-center">
                                                                <v-btn 
                                                                    rounded class=""
                                                                    color="green white--text"
                                                                    v-bind="attrs"
                                                                    v-on="on"
                                                                    :disabled="User.role_group != 'IT' && User.role_name != 'PLANNING MANAGER'"
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
                        <v-btn rounded color="green white--text pr-3" v-if="User.role_group == 'IT' || User.role_name == 'PLANNING MANAGER'" :disabled="calendar.detailPeriodFF.newPeriod.distribution_time == dateFormat(calendar.detailPeriodFF.datas.period.distribution_time, 'Y-MM-DD')" @click="calendarUpdateDetailFFPeriod">
                            <v-icon class="mr-1">mdi-content-save-check</v-icon>
                            Save
                        </v-btn>
                    </v-card-actions>
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
                    :disabled="User.role_name == 'UNIT MANAGER' || calendar.loading"
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
                                                                @click="calendarShowDetailTotalBibit(calendar.selectedEvent, 'nursery')"
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
                                    <v-simple-table class="my-1" dense>
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
                                                <td>
                                                    <v-tooltip top>
                                                        Click for preview detailed ff period
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <strong 
                                                                v-on="on"
                                                                v-bind="attrs"
                                                                class="cursor-pointer"
                                                                @click="calendarShowDetailFFPeriod(detailData)"
                                                            >
                                                                {{ detailData.ff_name }}
                                                            </strong>
                                                        </template>
                                                    </v-tooltip>
                                                </td>
                                                <td align="center">
                                                    <v-tooltip top>
                                                        Click for preview detailed seed
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <strong 
                                                                v-on="on"
                                                                v-bind="attrs"
                                                                @click="calendarShowDetailTotalBibit(detailData, 'ff')"
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
                        <v-overlay :value="packingLabel.loading" absolute class="rounded-xl">
                            <div class="d-flex flex-column align-center justify-center">
                                <v-progress-circular
                                    indeterminate
                                    color="white"
                                    size="64"
                                ></v-progress-circular>
                            </div>
                        </v-overlay>
                        <v-row>
                            <!-- Packing Label Tabs -->
                            <v-col cols="12">
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
                                            multi-sort
                                        >
                                            <!-- Check Column -->
                                            <template v-slot:item.check="{item}">
                                                <v-checkbox
                                                    v-model="item.is_printed"
                                                    :background-color="`${item.is_printed ? 'green' : 'grey darken-1'} rounded-xl px-2 pr-3 py-1`"
                                                    dark
                                                    color="white"
                                                    class="mt-0"
                                                    hide-details
                                                    :label="`${item.is_printed ? 'Printed' : 'Nope'}`"
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
                                                                @click="printByLahan('label', item.ph_form_no)"
                                                            >
                                                                <v-icon class="mr-1">mdi-printer</v-icon>
                                                                Label
                                                            </v-btn>
                                                        </v-list-item>
                                                        <v-list-item>
                                                            <v-btn 
                                                                color="green white--text" rounded
                                                                @click="printByLahan('tanda_terima', item.ph_form_no)"
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
                        <v-overlay :value="loadingLine.loading" absolute class="rounded-xl">
                            <div class="d-flex flex-column align-center justify-center">
                                <v-progress-circular
                                    indeterminate
                                    color="white"
                                    size="64"
                                ></v-progress-circular>
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
                                        :close-on-content-click="false"
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
                                                        label="Select Date"
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
                                                <v-btn color="green" class="white--text px-4" small rounded @click="loadingLine.datePicker.show = false">
                                                    <v-icon small class="mr-1">mdi-check-circle</v-icon>
                                                    Set
                                                </v-btn>
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
                                >
                                    <!-- Check Column -->
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
                                    <!-- Date Column -->
                                    <template v-slot:item.date="{item}">
                                        {{ dateFormat(item.date, 'DD MMMM Y') }}
                                    </template>
                                    <!-- Seeds Total Column -->
                                    <template v-slot:item.seeds_total="{item}">
                                        {{ numberFormat(item.seeds_total) }}
                                    </template>
                                    <!-- Bags Total Column -->
                                    <template v-slot:item.bags_total="{item}">
                                        {{ numberFormat(item.bags_total) }}
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <!-- Distribution Report Section -->
                <v-expansion-panel class="rounded-xl">
                    <v-expansion-panel-header>
                        <h3 class="dark--text"><v-icon class="mr-1">mdi-nature-people</v-icon> Distribution Report</h3>
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
            type: 'month',
            typeToLabel: {
                month: 'Month',
                week: 'Week',
                day: 'Day',
                '4day': '4 Days',
            },
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
            },
            programYear: '2022',
        },
        loadingLine: {
            datePicker: {
                loading: false,
                model: moment().format('Y-MM-DD'),
                show: false,
            },
            loading: false,
            table: {
                headers: [
                    { text: 'Check', value: 'check', align: 'center', width: '100'},
                    { text: 'Date', value: 'date'},
                    { text: 'Field Facilitator', value: 'ff_name'},
                    { text: 'Seeds Total', value: 'seeds_total', align: 'center'},
                    { text: 'Bags Total', value: 'bags_total', align: 'center'},
                    { text: 'Actions', value: 'actions', align: 'right'},
                ],
                items: [
                    { check: 0, date: '2022-12-12', ff_name: 'T4T Devs', seeds_total: '5500', bags_total: Math.ceil(5500/15)}
                ],
                loading: false,
            }
        },
        packingLabel: {
            loading: false,
            tables: {
                byLahan: {
                    headers: [
                        { text: 'Check', value: 'check', align: 'center', width: '100'},
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
                    // refresh calendar
                    await this.calendarUpdateRange({start: calendar.start, end: calendar.end})
                    // refresh packing label table
                    await this.getPackingLabelTableData()
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
        }
    },
    methods: {
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
                distribution_location: this.calendar.detailPeriodFF.datas.period.distribution_location,
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
        async calendarShowDetailTotalBibit(datas, type) {
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
            this.calendar.loading = true
            if (this.User.role_name == 'UNIT MANAGER') {
                if (typeof this.User.ff.ff[0] != 'undefined') {
                    const mu_no = await this.getFFMUNo(this.User.ff.ff[0])
                    this.generalSettings.nursery.model = this.getNurseryAlocation(mu_no)
                }
            }
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
                    color: this.calendarGetNurseryColor(evData.nursery, evData.total, evData.date),
                    details: evData.details,
                })
            })

            this.calendar.events = events
            this.calendar.loading = false
        },
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
        printByLahan(type, form_no) {
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
        dateFormat(date, format) {
            return moment(date).format(format)
        },
        async firstAccessPage() {
            if (this.User.role_name == 'UNIT MANAGER') {
                if (typeof this.User.ff.ff[0] != 'undefined') {
                    const mu_no = await this.getFFMUNo(this.User.ff.ff[0])
                    this.generalSettings.nursery.model = this.getNurseryAlocation(mu_no)
                }
            }
            await this.getPackingLabelTableData()
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
        numberFormat(num) {
            return new Intl.NumberFormat('id-ID').format(num)
        },
        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
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