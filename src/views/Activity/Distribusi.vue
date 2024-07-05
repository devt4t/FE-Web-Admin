<template>
  <div>
    <!-- Breadcrumb -->
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      data-aos="fade-right"
      class="breadcrumbsmain"
      :items="[
        {
          text: 'Activities',
          disabled: true,
          href: 'breadcrumbs_dashboard',
        },
        {
          text: 'Distribusi',
          disabled: true,
          href: 'breadcrumbs_link_1',
        },
      ]"
      divider=">"
      large
    ></v-breadcrumbs>

    <!-- MODAL -->
    <!-- dialog export filter -->
    <!-- <v-dialog v-model="distributionReport.dialogs.exportFilter.show" content-class="rounded-xl" max-width="500">
            <v-card>
                <v-card-title>
                    Export Filter
                    <v-divider class="mx-2"></v-divider>
                    <v-icon color="red" @click="distributionReport.dialogs.exportFilter.show = false">mdi-close-circle</v-icon>
                </v-card-title>

                <v-card-text>
                    <p class="red--text">
                        <strong>
                            *Sesuaikan Tanggal Distribusi Terlebih Dahulu!!
                        </strong>
                    </p>
                    <v-row class="mt-0">
                    <v-col :cols="12">
                        <v-autocomplete
                        rounded
                        outlined
                        dense
                        hide-details
                        color="green"
                        item-color="green"
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                        label="Field Facilitator"
                        item-value="ff_no"
                        item-text="name"
                        :items="distributionReport.dialogs.exportFilter.ff_item"
                        v-model="distributionReport.dialogs.exportFilter.ff_model"
                        ></v-autocomplete>
                    </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-divider class="mx-2"></v-divider>
                    <v-hover v-slot="{hover}">
                    <v-btn
                    rounded 
                    :color="`green ${hover ? 'white--text' : ''}`" 
                    :outlined="!hover" 
                    @click="distributionReport.dialogExportDistributionReport.show = true">
                    <v-icon class="mr-1">mdi-microsoft-excel</v-icon> Export</v-btn>
                    </v-hover>
                </v-card-actions>
            </v-card>
        </v-dialog> -->
    <!-- dialog Export -->
    <exportReportDistribusi
      :show="distributionReport.dialogExportDistributionReport.show"
      :distribution_date="distributionReport.datePicker.model"
      :ff_no="distributionReport.dialogs.exportFilter.ff_model"
      :mu_no="distributionReport.dialogs.exportFilter.mu_no"
      :fc_name="this.distributionReport.dialogs.exportFilter.fc_name"
      :data="distributionReport.dialogs.exportFilter.farmerData"
      :program_year="this.generalSettings.programYear"
      @close="distributionReport.dialogExportDistributionReport.show = false"
    >
    </exportReportDistribusi>

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
        <v-card-title
          class="mb-1 green headermodalstyle rounded-xl d-flex align-center"
        >
          <span class="d-flex align-center">
            <v-icon color="white" class="mr-1"> mdi-sprout </v-icon>
            Seed Details
          </span>
          <v-divider class="mx-2" dark></v-divider>
          <v-icon color="white" @click="calendar.detailBibit.show = false">
            mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <!-- loading -->
          <div
            v-if="calendar.detailBibit.loading"
            class="d-flex flex-column align-center justify-center"
            style="min-height: 250px"
          >
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
                      <td style="width: 150px">Program Year</td>
                      <td>:</td>
                      <td>{{ calendar.detailBibit.datas.program_year }}</td>
                    </tr>
                    <tr>
                      <td style="width: 150px">Activity</td>
                      <td>:</td>
                      <td>
                        {{
                          calendar.detailBibit.datas.activity == "sostam"
                            ? "Sosialisasi Tanam"
                            : calendar.detailBibit.datas.activity == "penlub"
                            ? "Penilikan Lubang"
                            : "Lahan"
                        }}
                      </td>
                    </tr>
                    <tr v-if="generalSettings.type.model == 'Petani'">
                      <td style="width: 150px">Field Facilitators</td>
                      <td>:</td>
                      <td>
                        <v-chip
                          color="green white--text"
                          class="mr-1 mb-1"
                          v-for="(ffData, ffIndex) in calendar.detailBibit.datas
                            .FF_details"
                          :key="ffIndex"
                        >
                          <v-icon small class="mr-1"
                            >mdi-clipboard-account</v-icon
                          >
                          {{ ffData.name }} ({{ ffData.village_name }})
                        </v-chip>
                      </td>
                    </tr>
                    <tr v-else-if="generalSettings.type.model == 'Umum'">
                      <td style="width: 150px">PIC Lahan</td>
                      <td>:</td>
                      <td>
                        <v-chip
                          color="green white--text"
                          class="mr-1 mb-1"
                          v-for="(ffData, ffIndex) in calendar.detailBibit.datas
                            .pic_lahan"
                          :key="ffIndex"
                        >
                          <v-icon small class="mr-1"
                            >mdi-clipboard-account</v-icon
                          >
                          {{ ffData }}
                        </v-chip>
                      </td>
                    </tr>
                    <tr v-if="generalSettings.type.model == 'Umum'">
                      <td style="width: 150px">PIC T4T</td>
                      <td>:</td>
                      <td>
                        <v-chip
                          color="info white--text"
                          class="mr-1 mb-1"
                          v-for="(ffData, ffIndex) in calendar.detailBibit.datas
                            .pic_t4t"
                          :key="ffIndex"
                        >
                          <v-icon small class="mr-1">mdi-account-tie</v-icon>
                          {{ ffData }}
                        </v-chip>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 150px">Total Bibit</td>
                      <td>:</td>
                      <td>
                        {{
                          numberFormat(calendar.detailBibit.datas.total_bibit)
                        }}
                        Bibit
                      </td>
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
                    <tr
                      v-for="(tree, treeIndex) in calendar.detailBibit.datas
                        .total_bibit_details['KAYU']"
                      :key="treeIndex"
                    >
                      <td>{{ (treeIndex += 1) }}</td>
                      <td>{{ tree.tree_name }}</td>
                      <td>{{ numberFormat(tree.amount) }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <!-- MPTS -->
              <v-col
                v-if="
                  calendar.detailBibit.datas.total_bibit_details['MPTS']
                    .length > 0
                "
              >
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
                    <tr
                      v-for="(tree, treeIndex) in calendar.detailBibit.datas
                        .total_bibit_details['MPTS']"
                      :key="treeIndex"
                    >
                      <td>{{ (treeIndex += 1) }}</td>
                      <td>{{ tree.tree_name }}</td>
                      <td>{{ numberFormat(tree.amount) }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <!-- CROPS -->
              <v-col
                v-if="
                  calendar.detailBibit.datas.total_bibit_details['CROPS']
                    .length > 0
                "
              >
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
                    <tr
                      v-for="(tree, treeIndex) in calendar.detailBibit.datas
                        .total_bibit_details['CROPS']"
                      :key="treeIndex"
                    >
                      <td>{{ (treeIndex += 1) }}</td>
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
          <v-btn
            rounded
            color="red white--text pr-3"
            @click="calendar.detailBibit.show = false"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Close
          </v-btn>
          <v-divider class="mx-2"></v-divider>
          <v-btn
            rounded
            color="blue white--text pr-3"
            @click="
              exportExcel(
                generalSettings.type.model == 'Petani'
                  ? 'bibit_by_ff'
                  : 'bibit_by_lahan',
                {
                  datas: calendar.detailBibit.datas,
                  distribution_date: dateFormat(
                    calendar.selectedEvent.start,
                    'dddd, DD MMMM Y'
                  ),
                }
              )
            "
          >
            <v-icon class="mr-1">mdi-printer</v-icon>
            Export
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Detail Period Calendar Modal -->
    <v-dialog
      content-class="rounded-xl elevation-0"
      top
      max-width="1000px"
      scrollable
      transition="dialog-top-transition"
      v-model="calendar.detailPeriodFF.show"
    >
      <v-card class="elevation-5 rounded-xl">
        <v-card-title
          class="mb-1 green headermodalstyle rounded-xl d-flex align-center"
        >
          <span class="d-flex align-center">
            <v-icon color="white" class="mr-1"> mdi-timer </v-icon>
            {{ generalSettings.type.model == "Umum" ? "Nursery &" : "" }}
            Distribution Period
          </span>
          <v-divider class="mx-2" dark></v-divider>
          <v-icon color="white" @click="calendar.detailPeriodFF.show = false">
            mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <!-- loading -->
          <div
            v-if="calendar.detailPeriodFF.loading"
            class="d-flex flex-column align-center justify-center"
          >
            <v-progress-circular
              indeterminate
              color="green"
              size="72"
              width="7"
              class="mt-10"
            ></v-progress-circular>
            <p class="mt-2">{{ calendar.detailPeriodFF.loadingText }}</p>
          </div>
          <div
            v-if="
              calendar.detailPeriodFF.loading == false &&
              calendar.detailPeriodFF.datas
            "
          >
            <v-row>
              <v-col cols="12" lg="6">
                <v-simple-table>
                  <tbody>
                    <tr v-if="generalSettings.type.model == 'Petani'">
                      <th>Field Facilitator</th>
                      <td>:</td>
                      <td v-if="calendar.detailPeriodFF.datas.FF">
                        <small>{{
                          calendar.detailPeriodFF.datas.FF.ff_no || "-"
                        }}</small
                        ><br />{{
                          calendar.detailPeriodFF.datas.FF.name || "-"
                        }}
                      </td>
                    </tr>
                    <tr v-if="generalSettings.type.model == 'Umum'">
                      <th>PIC T4T</th>
                      <td>:</td>
                      <td v-if="calendar.detailPeriodFF.datas.pic_t4t">
                        {{ calendar.detailPeriodFF.datas.pic_t4t.name || "-" }}
                      </td>
                    </tr>
                    <tr v-if="generalSettings.type.model == 'Petani'">
                      <th>Field Coordinator</th>
                      <td>:</td>
                      <td v-if="calendar.detailPeriodFF.datas.FC">
                        {{ calendar.detailPeriodFF.datas.FC.name || "-" }}
                      </td>
                    </tr>
                    <tr v-if="generalSettings.type.model == 'Umum'">
                      <th>PIC Lahan</th>
                      <td>:</td>
                      <td v-if="calendar.detailPeriodFF.datas">
                        {{ calendar.detailPeriodFF.datas.pic_lahan || "-" }}
                      </td>
                    </tr>
                    <tr>
                      <th>Management Unit</th>
                      <td>:</td>
                      <td>
                        {{
                          generalSettings.type.model == "Petani"
                            ? calendar.detailPeriodFF.datas.FF
                              ? calendar.detailPeriodFF.datas.FF.mu_name
                              : "-"
                            : calendar.detailPeriodFF.datas.data
                            ? calendar.detailPeriodFF.datas.data.mu_name
                            : "-"
                        }}
                      </td>
                    </tr>
                    <tr v-if="generalSettings.type.model == 'Petani'">
                      <th>Target Area</th>
                      <td>:</td>
                      <td>
                        {{
                          calendar.detailPeriodFF.datas.FF
                            ? calendar.detailPeriodFF.datas.FF.ta_name
                            : "-"
                        }}
                      </td>
                    </tr>
                    <tr v-if="generalSettings.type.model == 'Umum'">
                      <th>District</th>
                      <td>:</td>
                      <td>
                        {{
                          calendar.detailPeriodFF.datas.data
                            ? calendar.detailPeriodFF.datas.data.district_name
                            : "-"
                        }}
                      </td>
                    </tr>
                    <tr>
                      <th>Village</th>
                      <td>:</td>
                      <td>
                        {{
                          generalSettings.type.model == "Petani"
                            ? calendar.detailPeriodFF.datas.FF
                              ? calendar.detailPeriodFF.datas.FF.village_name
                              : "-"
                            : calendar.detailPeriodFF.datas.data
                            ? calendar.detailPeriodFF.datas.data.village_name
                            : "-"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <v-col cols="12" lg="6">
                <v-simple-table>
                  <tbody>
                    <tr v-if="generalSettings.type.model == 'Umum'">
                      <th>Nursery</th>
                      <td>:</td>
                      <td
                        v-if="
                          User.role_group != 'IT' &&
                          User.role_name != 'PLANNING MANAGER'
                        "
                      >
                        {{ calendar.detailPeriodFF.datas.nursery }}
                      </td>
                      <td v-else>
                        <v-select
                          color="success"
                          item-color="success"
                          outlined
                          dense
                          rounded
                          hide-details
                          :menu-props="{
                            bottom: true,
                            offsetY: true,
                            rounded: 'xl',
                            transition: 'slide-y-transition',
                          }"
                          v-model="calendar.detailPeriodFF.newPeriod.nursery"
                          :items="[
                            'Tidak Ada',
                            'Cirasea',
                            'Ciminyak',
                            'Soreang',
                            'Kebumen',
                            'Pati',
                          ]"
                        ></v-select>
                      </td>
                    </tr>
                    <tr>
                      <th>Planting Hole Surveillance</th>
                      <td>:</td>
                      <td>
                        {{
                          dateFormat(
                            calendar.detailPeriodFF.newPeriod.hole_time,
                            "DD MMMM Y"
                          )
                        }}
                      </td>
                    </tr>
                    <tr>
                      <th>Distribution</th>
                      <td>:</td>
                      <td
                        v-if="
                          User.role_group == 'IT' ||
                          User.role_name == 'PLANNING MANAGER' ||
                          User.email == 'faris.ardika@trees4trees.org' ||
                          User.email == 'fauzan.timur@trees4trees.org'
                        "
                      >
                        <v-menu
                          offset-x
                          transition="slide-x-transition"
                          rounded="xl"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <div class="d-flex flex-column align-center">
                              <v-btn
                                rounded
                                class=""
                                color="green white--text"
                                v-bind="attrs"
                                v-on="on"
                                disabled
                              >
                                {{
                                  dateFormat(
                                    calendar.detailPeriodFF.newPeriod
                                      .distribution_time,
                                    "DD MMMM Y"
                                  )
                                }}
                              </v-btn>
                            </div>
                          </template>
                          <v-date-picker
                            v-model="
                              calendar.detailPeriodFF.newPeriod
                                .distribution_time
                            "
                            color="green"
                            class="rounded-xl"
                          ></v-date-picker>
                        </v-menu>
                      </td>
                      <td v-else>
                        {{
                          dateFormat(
                            calendar.detailPeriodFF.newPeriod.distribution_time,
                            "DD MMMM Y"
                          )
                        }}
                      </td>
                    </tr>
                    <tr>
                      <th>Planting Realization</th>
                      <td>:</td>
                      <td>
                        {{
                          dateFormat(
                            calendar.detailPeriodFF.newPeriod.planting_time,
                            "DD MMMM Y"
                          )
                        }}
                      </td>
                    </tr>
                    <tr v-if="generalSettings.type.model == 'Petani'">
                      <th>Distribution Location</th>
                      <td>:</td>
                      <td
                        v-if="
                          User.role_group == 'IT' ||
                          User.role_name == 'PLANNING MANAGER' ||
                          User.email == 'faris.ardika@trees4trees.org' ||
                          User.email == 'fauzan.timur@trees4trees.org'
                        "
                      >
                        <v-textarea
                          v-model="
                            calendar.detailPeriodFF.newPeriod
                              .distribution_location
                          "
                          rows="3"
                          dense
                          rounded
                          outlined
                          hide-details
                          color="green"
                          disabled
                          class="text-caption my-1"
                          :rules="[(v) => !!v || 'Field is required']"
                        ></v-textarea>
                      </td>
                      <td v-else>
                        {{
                          calendar.detailPeriodFF.newPeriod
                            .distribution_location
                        }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions
          class=""
          v-if="
            calendar.detailPeriodFF.loading == false &&
            calendar.detailPeriodFF.datas
          "
        >
          <v-btn
            rounded
            color="red white--text pr-3"
            @click="calendar.detailPeriodFF.show = false"
          >
            <v-icon class="mr-1">mdi-close-circle</v-icon>
            Close
          </v-btn>
          <v-divider class="mx-2"></v-divider>
          <v-btn
            rounded
            color="green white--text pr-3"
            v-if="
              generalSettings.type.model == 'Petani' &&
              (User.role_group == 'IT' ||
                User.role_name == 'PLANNING MANAGER' ||
                User.email == 'faris.ardika@trees4trees.org' ||
                User.email == 'fauzan.timur@trees4trees.org')
            "
            :disabled="
              calendar.detailPeriodFF.newPeriod.distribution_time ==
                dateFormat(
                  calendar.detailPeriodFF.datas.period.distribution_time,
                  'Y-MM-DD'
                ) &&
              calendar.detailPeriodFF.newPeriod.distribution_location ==
                calendar.detailPeriodFF.datas.period.distribution_location
            "
            @click="calendarUpdateDetailFFPeriod"
          >
            <v-icon class="mr-1">mdi-content-save-check</v-icon>
            Save
          </v-btn>
          <v-btn
            rounded
            color="green white--text pr-3"
            v-if="
              generalSettings.type.model == 'Umum' &&
              (User.role_group == 'IT' ||
                User.role_name == 'PLANNING MANAGER' ||
                User.email == 'faris.ardika@trees4trees.org' ||
                User.email == 'fauzan.timur@trees4trees.org')
            "
            :disabled="
              calendar.detailPeriodFF.newPeriod.distribution_time ==
                dateFormat(
                  calendar.detailPeriodFF.datas.period.distribution_time,
                  'Y-MM-DD'
                ) &&
              calendar.detailPeriodFF.newPeriod.nursery ==
                calendar.detailPeriodFF.datas.nursery
            "
            @click="calendarUpdateDetailLahanUmumPeriod"
          >
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
        <v-card-title
          class="mb-1 headermodalstyle rounded-xl d-flex align-center"
        >
          <span class="d-flex align-center">
            <v-icon color="white" class="mr-1"> mdi-qrcode </v-icon>
            Scan Labels
          </span>
          <v-divider class="mx-2" dark></v-divider>
          <v-icon color="white" @click="loadingLine.detailDialog.show = false">
            mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <!-- loading -->
          <div
            v-if="
              loadingLine.detailDialog.loading &&
              !loadingLine.detailDialog.model
            "
            class="d-flex flex-column align-center justify-center"
          >
            <v-progress-circular
              indeterminate
              color="green"
              size="72"
              width="7"
              class="mt-10"
            ></v-progress-circular>
            <p class="mt-2 text-center">
              {{ loadingLine.detailDialog.loadingText }}
            </p>
          </div>
          <!-- Loading -->
          <v-overlay
            v-else-if="
              loadingLine.detailDialog.loading && loadingLine.detailDialog.model
            "
            absolute
            :value="loadingLine.detailDialog.loading"
          >
            <div class="d-flex flex-column"></div>
            <v-progress-circular
              :size="80"
              :width="10"
              indeterminate
              color="white"
            >
            </v-progress-circular>
            <p class="mt-2 mb-0">{{ loadingLine.detailDialog.loadingText }}</p>
          </v-overlay>
          <div v-if="loadingLine.detailDialog.model">
            <!-- HOME View -->
            <v-row
              class="py-2"
              v-if="loadingLine.detailDialog.tabs.open == 'all'"
            >
              <v-col cols="12" md="6">
                <v-card
                  v-if="loadingLine.detailDialog.show"
                  @click="loadingLine.detailDialog.tabs.open = 1"
                  data-aos="zoom-in"
                  data-aos-duration="500"
                  color="green pa-5 rounded-xl text-center white--text"
                >
                  <v-icon color="white" x-large>mdi-sprout</v-icon>
                  <h3 class="mb-0 mt-1 font-weight-regular" large>
                    Distribution Details
                  </h3>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card
                  v-if="loadingLine.detailDialog.show"
                  @click="loadingLine.detailDialog.tabs.open = 2"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                  data-aos-duration="500"
                  :color="`${
                    numberFormat(
                      loadingLine.detailDialog.inputs.scanner.values.length
                    ) == numberFormat(loadingLine.detailDialog.model.total_bags)
                      ? 'blue darken-2'
                      : 'blue'
                  } pa-5 rounded-xl text-center white--text`"
                >
                  <v-icon color="white" x-large
                    >mdi-basket{{
                      numberFormat(
                        loadingLine.detailDialog.inputs.scanner.values.length
                      ) ==
                      numberFormat(loadingLine.detailDialog.model.total_bags)
                        ? "-check"
                        : ""
                    }}</v-icon
                  >
                  <h3 class="mb-0 mt-1 font-weight-regular" large>
                    {{
                      numberFormat(
                        loadingLine.detailDialog.inputs.scanner.values.length
                      ) ==
                      numberFormat(loadingLine.detailDialog.model.total_bags)
                        ? "Load Completed"
                        : "Start Scan Bags"
                    }}
                  </h3>
                </v-card>
              </v-col>
            </v-row>
            <!-- Tabs Header -->
            <v-tabs
              v-else
              v-model="loadingLine.detailDialog.tabs.open"
              background-color="transparent"
              icons-and-text
              grow
              show-arrows
              color="green"
              data-aos="fade-down"
              data-aos-delay="0"
              data-aos-duration="500"
            >
              <v-tab href="#all">
                Home
                <v-icon>mdi-view-dashboard</v-icon>
              </v-tab>
              <v-tab>
                Details
                <v-icon>mdi-sprout</v-icon>
              </v-tab>
              <v-tab>
                Scan Bags
                <v-icon
                  >mdi-{{
                    numberFormat(
                      loadingLine.detailDialog.inputs.scanner.values.length
                    ) == numberFormat(loadingLine.detailDialog.model.total_bags)
                      ? "basket-check"
                      : "qrcode-scan"
                  }}</v-icon
                >
              </v-tab>
              <v-tab>
                Bags List
                <v-icon>mdi-text-box-check</v-icon>
              </v-tab>
            </v-tabs>
            <!-- Tabs Items -->
            <v-tabs-items
              v-if="loadingLine.detailDialog.tabs.open != 'all'"
              v-model="loadingLine.detailDialog.tabs.open"
            >
              <!-- Empty -->
              <v-tab-item></v-tab-item>
              <!-- Detail -->
              <v-tab-item class="pt-3">
                <v-simple-table dense>
                  <tbody>
                    <tr v-if="generalSettings.type.model == 'Petani'">
                      <td style="max-width: 100px">Field Facilitator</td>
                      <td>
                        :
                        <strong>{{
                          loadingLine.detailDialog.model.distribution_details[0]
                            .ff_name || "-"
                        }}</strong>
                      </td>
                    </tr>
                    <tr v-else-if="generalSettings.type.model == 'Umum'">
                      <td style="max-width: 100px">PIC T4T</td>
                      <td>
                        :
                        <strong>
                          {{
                            loadingLine.detailDialog.model
                              .distribution_details[0].employee_name || "-"
                          }}</strong
                        >
                      </td>
                    </tr>
                    <tr v-if="generalSettings.type.model == 'Umum'">
                      <td style="max-width: 100px">PIC Lahan</td>
                      <td>
                        :
                        <strong>
                          {{
                            loadingLine.detailDialog.model
                              .distribution_details[0].pic_lahan || "-"
                          }}</strong
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="max-width: 100px">MU</td>
                      <td>
                        :
                        <strong>
                          {{
                            loadingLine.detailDialog.model
                              .distribution_details[0].mu_name || "-"
                          }}</strong
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="max-width: 100px">Seedling Total</td>
                      <td>
                        :
                        <strong>
                          {{
                            numberFormat(
                              loadingLine.detailDialog.model.total_trees_amount
                            )
                          }}</strong
                        >
                        Seeds
                      </td>
                    </tr>
                    <tr>
                      <td style="max-width: 100px">Bags Total</td>
                      <td>
                        :
                        <strong>
                          <strong
                            v-if="loadingLine.detailDialog.differentTotalBags"
                          >
                            {{
                              numberFormat(
                                loadingLine.detailDialog.model.total_bags
                              )
                            }}
                          </strong>
                          <span v-else>
                            {{
                              numberFormat(
                                loadingLine.detailDialog.model.total_bags
                              )
                            }}
                          </span></strong
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="max-width: 100px">Bags Scanned</td>
                      <td>
                        :
                        <strong>
                          {{
                            numberFormat(
                              loadingLine.detailDialog.inputs.scanner.values
                                .length
                            )
                          }}</strong
                        >
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-tab-item>
              <!-- Transport + Scan -->
              <v-tab-item>
                <div class="pb-2 d-flex align-center">
                  <p class="mb-0">
                    <v-icon class="mr-2">mdi-car-pickup</v-icon>Transportations
                  </p>
                  <v-divider class="mx-2"></v-divider>
                  <v-btn
                    rounded
                    small
                    color="green white--text"
                    class="pl-1"
                    :disabled="
                      !loadingLine.detailDialog.transportations[
                        loadingLine.detailDialog.transportations.length - 1
                      ].truck_detail ||
                      !loadingLine.detailDialog.transportations[
                        loadingLine.detailDialog.transportations.length - 1
                      ].driver_detail
                    "
                    @click="addMoreTransportation"
                    ><v-icon class="mr-1">mdi-plus-circle</v-icon> Add</v-btn
                  >
                </div>
                <v-row class="ma-0">
                  <v-card
                    v-for="(trans, transIndex) in loadingLine.detailDialog
                      .transportations"
                    :key="transIndex"
                    data-aos="zoom-in"
                    class="ml-2 rounded-xl pa-3 overflow-hidden mb-2"
                  >
                    <div class="d-flex align-center">
                      <v-btn fab x-small color="grey white--text">{{
                        transIndex + 1
                      }}</v-btn>
                      <p v-if="trans.truck_detail === null" class="mb-0 ml-2">
                        Select Truck & Driver
                      </p>
                      <p v-else class="mb-0 ml-2">
                        Max:
                        {{
                          $store.getters.numberFormat(
                            trans.truck_detail.max_capacity
                          )
                        }}
                        Bibit
                      </p>
                    </div>
                    <v-row class="mx-0 mt-2">
                      <v-col
                        v-if="trans.truck_detail"
                        class="d-flex flex-column align-center position-relative"
                      >
                        <v-avatar
                          v-if="
                            trans.truck_detail &&
                            loadingLine.detailDialog.transportationIndex !=
                              transIndex
                          "
                          data-aos="zoom-in"
                          size="72"
                          :color="getProgressionColor(trans.progression)"
                          class="rounded-circle position-relative overflow-visible"
                        >
                          <v-icon size="42" color="white"
                            >mdi-{{
                              trans.truck_detail.type == "ss" ||
                              trans.truck_detail.type == "l300"
                                ? "car-pickup"
                                : "truck"
                            }}</v-icon
                          >
                        </v-avatar>
                        <v-progress-circular
                          v-else-if="
                            loadingLine.detailDialog.transportationIndex ===
                            transIndex
                          "
                          data-aos="zoom-in"
                          :rotate="360"
                          :size="72"
                          :width="10"
                          :value="trans.progression"
                          :color="getProgressionColor(trans.progression)"
                        >
                          {{ Math.ceil(trans.progression) }}%
                        </v-progress-circular>
                        <!-- <v-chip v-if="trans.truck_detail" data-aos="zoom-in" data-aos-delay="200" color="green white--text" small style="position: absolute;top: 70px">{{ $store.getters.numberFormat(trans.truck_detail.min_capacity) }} - {{ $store.getters.numberFormat(trans.truck_detail.max_capacity) }} Bibit</v-chip> -->
                        <v-chip
                          v-if="trans.truck_detail"
                          data-aos="zoom-in"
                          data-aos-delay="200"
                          color="grey darken-3 white--text"
                          class="rounded-lg mt-1"
                          >{{ trans.truck_detail.plat_no }}</v-chip
                        >
                      </v-col>
                      <v-col
                        v-if="trans.driver_detail"
                        class="d-flex flex-column align-center position-relative"
                      >
                        <v-avatar
                          v-if="trans.driver_detail"
                          data-aos="zoom-in"
                          size="72"
                          color="blue darken-1"
                          class="rounded-circle position-relative overflow-visible"
                        >
                          <v-icon size="42" color="white"
                            >mdi-badge-account</v-icon
                          >
                        </v-avatar>
                        <v-chip
                          v-if="trans.driver_detail"
                          data-aos="zoom-in"
                          data-aos-delay="200"
                          color="grey darken-3 white--text"
                          class="rounded-lg mt-1"
                          >{{ trans.driver_detail.name }}</v-chip
                        >
                      </v-col>
                    </v-row>
                    <v-row
                      v-if="trans.truck_detail && trans.driver_detail"
                      class="mx-0 mb-0 justify-center"
                    >
                      <v-btn
                        rounded
                        small
                        color="green white--text"
                        v-if="
                          loadingLine.detailDialog.transportationIndex !=
                          transIndex
                        "
                        @click="
                          startScanningAfterSelectingTransportation(transIndex)
                        "
                        >Start Loading Bags</v-btn
                      >
                      <v-btn
                        rounded
                        small
                        color="red white--text"
                        class="pl-1"
                        v-else-if="
                          loadingLine.detailDialog.transportationIndex ===
                          transIndex
                        "
                        :disabled="
                          transIndex === 0 || trans.loaded_labels.length > 0
                        "
                        @click="
                          loadingLine.detailDialog.transportations.splice(
                            transIndex,
                            1
                          )
                        "
                        ><v-icon class="mr-1">mdi-delete-circle</v-icon> Remove
                        Truck</v-btn
                      >
                    </v-row>
                    <v-row
                      v-else-if="transIndex > 0"
                      class="mx-0 mb-0 justify-center"
                    >
                      <v-btn
                        rounded
                        small
                        color="red white--text"
                        class="pl-1"
                        @click="
                          loadingLine.detailDialog.transportations.splice(
                            transIndex,
                            1
                          )
                        "
                        ><v-icon class="mr-1">mdi-delete-circle</v-icon> Remove
                        Truck</v-btn
                      >
                    </v-row>
                    <v-text-field
                      v-if="trans.truck_detail === null"
                      dense
                      hide-details
                      outlined
                      rounded
                      label="Plat No"
                      color="green"
                      class="mt-5"
                      clearable
                      v-model="trans.plat_no"
                      @change="
                        getTransportDetail('truck', trans.plat_no, transIndex)
                      "
                    ></v-text-field>
                    <v-text-field
                      v-if="trans.driver_detail === null"
                      dense
                      hide-details
                      outlined
                      rounded
                      label="Driver NIK / Licence"
                      color="green"
                      class="mt-2"
                      clearable
                      v-model="trans.nik"
                      @change="
                        getTransportDetail('driver', trans.nik, transIndex)
                      "
                    ></v-text-field>
                  </v-card>
                </v-row>

                <v-text-field
                  v-if="
                    typeof loadingLine.detailDialog.transportationIndex ==
                    'number'
                  "
                  :disabled="
                    loadingLine.detailDialog.transportationIndex === null ||
                    numberFormat(
                      loadingLine.detailDialog.inputs.scanner.values.length
                    ) == numberFormat(loadingLine.detailDialog.model.total_bags)
                  "
                  ref="scanLabelLoadingInput"
                  data-aos="zoom-in"
                  prepend-inner-icon="mdi-qrcode-scan"
                  v-model="loadingLine.detailDialog.inputs.scanner.model"
                  @change="scannerUpdate"
                  color="green"
                  label="Input Scan Label"
                  placeholder="Input scan here..."
                  class="text-center mt-2"
                  outlined
                  rounded
                  :error-messages="
                    loadingLine.detailDialog.inputs.scanner.alert.color == 'red'
                      ? loadingLine.detailDialog.inputs.scanner.alert.text
                      : ''
                  "
                  :success-messages="
                    loadingLine.detailDialog.inputs.scanner.alert.color ==
                    'green'
                      ? loadingLine.detailDialog.inputs.scanner.alert.text
                      : ''
                  "
                ></v-text-field>
                <!-- :disabled="numberFormat(loadingLine.detailDialog.inputs.scanner.values.length) == numberFormat(loadingLine.detailDialog.model.total_bags)" -->
              </v-tab-item>
              <v-tab-item>
                <v-data-table
                  v-if="loadingLine.detailDialog.inputs.scanner.farmers"
                  :headers="
                    loadingLine.detailDialog.inputs.table[
                      generalSettings.type.model == 'Petani'
                        ? 'headers'
                        : 'headers2'
                    ]
                  "
                  :items="loadingLine.detailDialog.inputs.scanner.farmers"
                >
                  <template v-slot:item.check="{ item }">
                    <v-icon
                      v-if="
                        item.bags_number.length ==
                        item.bags_number_loaded.length
                      "
                      color="green"
                      >mdi-check-circle</v-icon
                    >
                    <v-icon v-else color="red">mdi-close-circle</v-icon>
                  </template>
                  <template v-slot:item.bags_number="{ item }">
                    {{ item.bags_number.length }}
                  </template>
                  <template v-slot:item.bags_number_loaded="{ item }">
                    {{ item.bags_number_loaded.length }}
                  </template>
                  <template v-slot:item.bags_left="{ item }">
                    <v-menu content-class="rounded-xl" scrollable>
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          v-bind="attrs"
                          :disabled="
                            item.bags_number.length -
                              item.bags_number_loaded.length ==
                            0
                          "
                          v-on="on"
                          :color="`${
                            item.bags_number.length -
                              item.bags_number_loaded.length >
                            0
                              ? 'red'
                              : 'green'
                          } white--text`"
                          rounded
                          small
                        >
                          {{
                            item.bags_number.length -
                            item.bags_number_loaded.length
                          }}
                        </v-btn>
                      </template>
                      <v-card
                        v-if="
                          item.bags_number.length -
                            item.bags_number_loaded.length >
                          0
                        "
                      >
                        <v-card-title class="d-flex justify-center pt-2">
                          <small class="gray--text">Labels Left:</small><br />
                        </v-card-title>
                        <v-card-text>
                          <strong>{{
                            getNumberBagsLeft(
                              item.bags_number,
                              item.bags_number_loaded
                            )
                          }}</strong>
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs-items>
          </div>
          <!-- Snackbar -->
          <v-snackbar
            v-model="loadingLine.detailDialog.snackbar.show"
            :color="loadingLine.detailDialog.snackbar.color"
            :timeout="5000"
            rounded="xl"
          >
            <div class="d-flex justify-between">
              <p class="mb-0">
                {{ loadingLine.detailDialog.snackbar.text }}
              </p>
              <v-spacer></v-spacer>
              <v-icon
                small
                class="pl-1"
                @click="loadingLine.detailDialog.snackbar.show = false"
                >mdi-close-circle</v-icon
              >
            </div>
          </v-snackbar>
        </v-card-text>
        <v-card-actions
          v-if="
            loadingLine.detailDialog.loading == false &&
            loadingLine.detailDialog.model &&
            generalSettings.type.model == 'Petani'
          "
          data-aos="fade-up"
          data-aos-delay="600"
          data-aos-duration="500"
        >
          <v-divider class="mx-2"></v-divider>
          <v-btn
            color="green white--text"
            rounded
            class="pr-3"
            :disabled="
              loadingLine.detailDialog.inputs.scanner.values.length == 0 ||
              loadingLine.detailDialog.inputs.disabledSave == true
            "
            @click="
              UpdateLoadedDistributionBagsNumber(
                loadingLine.detailDialog.model.distribution_details[0].ff_no
              )
            "
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Save
          </v-btn>
          <v-btn
            color="info white--text"
            v-if="
              User.role_group == 'IT' ||
              User.role_name == 'NURSERY MANAGER' ||
              User.email == 'faris.ardika@trees4trees.org' ||
              User.email == 'fauzan.timur@trees4trees.org'
            "
            rounded
            class="px-3"
            :disabled="
              loadingLine.detailDialog.inputs.scanner.values.length == 0 ||
              loadingLine.detailDialog.inputs.disabledSave == true
            "
            @click="
              FinishLoadedDistributionBagsNumber(
                loadingLine.detailDialog.model.distribution_details[0].ff_no
              )
            "
          >
            <v-icon class="mr-1">mdi-basket-check</v-icon>
            Finish
          </v-btn>
          <v-divider class="mx-2"></v-divider>
        </v-card-actions>
        <v-card-actions
          v-else-if="
            loadingLine.detailDialog.loading == false &&
            loadingLine.detailDialog.model &&
            generalSettings.type.model == 'Umum'
          "
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <v-divider class="mx-2"></v-divider>
          <v-btn
            color="green white--text"
            rounded
            class="pr-3"
            :disabled="
              loadingLine.detailDialog.inputs.scanner.values.length == 0 ||
              loadingLine.detailDialog.inputs.disabledSave == true
            "
            @click="
              UpdateLoadedDistributionBagsNumber(
                loadingLine.detailDialog.model.distribution_details[0].mou_no
              )
            "
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Save
          </v-btn>
          <v-divider class="mx-2"></v-divider>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirmation -->
    <v-dialog
      v-model="confirmation.show"
      max-width="500px"
      persistent
      content-class="rounded-lg"
      scrollable
    >
      <v-card class="rounded-xl">
        <v-card-title class="mb-1 headermodalstyle">
          <v-icon class="mr-2 white--text">mdi-help-circle</v-icon>
          <span>{{ `${confirmation.type || "Confirmation"}` }}</span>
          <v-divider dark class="mx-2"></v-divider>
          <v-icon color="red" @click="confirmation.show = false"
            >mdi-close-circle</v-icon
          >
        </v-card-title>
        <v-card-text>
          <h2 class="text-center pt-4">{{ confirmation.title }}</h2>
          <v-row class="mt-10 align-center mb-0">
            <v-divider class="mx-2"></v-divider>
            <v-btn
              rounded
              color="red white--text mr-1"
              @click="confirmation.show = false"
            >
              <v-icon class="mr-1">mdi-close-circle</v-icon>
              Close
            </v-btn>
            <v-btn
              rounded
              color="green white--text ml-1"
              @click="confirmationOk(confirmation.okText)"
            >
              <v-icon class="mr-1">mdi-check-circle</v-icon>
              {{ confirmation.okText }}
            </v-btn>
            <v-divider class="mx-2"></v-divider>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Distribution Report Detail Petani -->
    <v-dialog
      content-class="rounded-xl elevation-0 mx-1"
      top
      persistent
      max-width="1000px"
      scrollable
      v-model="distributionReport.dialogs.detail.show"
    >
      <v-card class="elevation-5 rounded-xl">
        <v-card-title
          class="mb-1 headermodalstyle rounded-xl d-flex align-center"
        >
          <span class="d-flex align-center">
            <v-icon color="white" class="mr-1"> mdi-text-box-check </v-icon>
            Distribution Report
          </span>
          <v-divider class="mx-2" dark></v-divider>
          <v-icon
            color="white"
            @click="distributionReport.dialogs.detail.show = false"
          >
            mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <!-- loading -->
          <div
            v-if="distributionReport.dialogs.detail.loading"
            class="d-flex flex-column align-center justify-center"
          >
            <v-progress-circular
              indeterminate
              color="green"
              size="72"
              width="7"
              class="mt-10"
            ></v-progress-circular>
            <p class="mt-2">
              {{ distributionReport.dialogs.detail.loadingText }}
            </p>
          </div>
          <!-- DETAIL CONTENT -->
          <div v-if="distributionReport.dialogs.detail.data">
            <!-- General Data -->
            <v-simple-table>
              <tbody>
                <!-- <tr>
                                        <td>Distribution No</td>
                                        <td>:</td>
                                        <td><strong>{{ distributionReport.dialogs.detail.data.distribution_no }}</strong></td>
                                    </tr> -->
                <tr>
                  <td>Management Unit</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detail.data.mu_name || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-if="generalSettings.type.model == 'Petani'">
                  <td>Field Facilitator</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detail.data.ff_name || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-else-if="generalSettings.type.model == 'Umum'">
                  <td>PIC T4T</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detail.data.pic_t4t || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-if="generalSettings.type.model == 'Petani'">
                  <td>Petani</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detail.data.farmer_name || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-if="generalSettings.type.model == 'Petani'">
                  <td>Tanggal Distribusi</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detail.data
                        .distribution_date || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-else-if="generalSettings.type.model == 'Umum'">
                  <td>PIC Lahan</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detail.data.pic_lahan || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Penerimaan Pupuk</td>
                  <td>:</td>
                  <td>
                    <v-chip
                      v-if="
                        distributionReport.dialogs.detail.data
                          .is_pupuk_distributed == 0
                      "
                      color="orange white--text"
                      class="pl-1 pr-3"
                      ><v-icon class="mr-1">mdi-close-circle</v-icon> Tidak
                      Menerima</v-chip
                    >
                    <!-- <v-chip v-if="distributionReport.dialogs.detail.data.is_pupuk_distributed == 1" color="green white--text" class="pl-1 pr-3"><v-icon class="mr-1">mdi-check-circle</v-icon> Menerima {{ new Intl.NumberFormat().format(distributionReport.dialogs.detail.data.total_pupuk )}} ML</v-chip> -->
                  </td>
                </tr>
                <tr>
                  <td>Persentase Penerimaan Petani</td>
                  <td>:</td>
                  <td>
                    <div>
                      <v-progress-linear
                        :value="
                          percentageFormat(
                            distributionReport.dialogs.detail.totalSeedArrival,
                            distributionReport.dialogs.detail.labels.loaded
                              .length
                          )
                        "
                        color="orange"
                        height="25"
                      >
                        <strong
                          >{{
                            Math.ceil(
                              percentageFormat(
                                distributionReport.dialogs.detail
                                  .totalSeedArrival,
                                distributionReport.dialogs.detail.labels.loaded
                                  .length
                              )
                            )
                          }}%</strong
                        >
                      </v-progress-linear>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <!-- Total Activities Bags -->
            <v-row>
              <v-col cols="6" md="3" lg="3">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-printer</v-icon> Printed Labels
                  <v-divider class="ml-2"></v-divider>
                </v-row>
                <v-menu content-class="rounded-xl white">
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      class="rounded-xl"
                      max-width="150px"
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.detail.labels.printed
                              .length
                          }}
                        </h1>
                        Labels
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-printer</v-icon> Printed Labels
                      <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'label_code',
                            sortable: false,
                          },
                          {
                            text: 'Seedling',
                            value: 'rel_tree_id',
                            sortable: false,
                          },
                        ]"
                        :items="
                          distributionReport.dialogs.detail.labels.printed
                        "
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- Seedling Column -->
                        <template v-slot:item.tree_list="{ item }">
                          <p
                            class="mb-0"
                            v-for="tree in item.tree_list"
                            :key="tree.tree_name"
                          >
                            {{ tree.tree_name }}
                            <strong>{{ tree.tree_amount }}</strong>
                          </p>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col cols="6" md="3" lg="3">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-truck-check</v-icon> Loaded Bags
                  <v-divider class="ml-2"></v-divider>
                </v-row>
                <v-menu content-class="rounded-xl white">
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      v-bind="attrs"
                      v-on="on"
                      class="rounded-xl"
                      max-width="150px"
                      color="warning"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.detail.labels.loaded
                              .length
                          }}
                        </h1>
                        bags
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-truck-check</v-icon> Loaded Bags
                      <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'label_code',
                            sortable: false,
                          },
                          {
                            text: 'Seedling',
                            value: 'rel_tree_id',
                            sortable: false,
                          },
                          {
                            text: 'PIC Load',
                            value: 'rel_implementor_load_id',
                            sortable: false,
                          },
                        ]"
                        :items="distributionReport.dialogs.detail.labels.loaded"
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- Seedling Column -->
                        <template v-slot:item.tree_list="{ item }">
                          <p
                            class="mb-0"
                            v-for="tree in item.tree_list"
                            :key="tree.tree_name"
                          >
                            {{ tree.tree_name }}
                            <strong>{{ tree.tree_amount }}</strong>
                          </p>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col cols="6" md="3" lg="3">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-basket-check</v-icon> Distributed
                  Bags
                  <v-divider class="ml-2 d-none d-md-inline-block"></v-divider>
                </v-row>
                <v-menu content-class="rounded-xl white">
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      v-bind="attrs"
                      v-on="on"
                      class="rounded-xl"
                      max-width="150px"
                      color="green"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.detail.labels.distributed
                              .length
                          }}
                        </h1>
                        bags
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-basket-check</v-icon> Distributed
                      Bags <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <!-- <v-btn v-if="generalSettings.type.model == 'Umum'" color="info white--text" rounded block class="mb-2" @click="openModalScanLahanUmum" :disabled="distributionReport.dialogs.detail.data.status > 0">
                                                    <v-icon class="mr-1">mdi-qrcode-scan</v-icon>
                                                    SCAN
                                                </v-btn> -->
                      <v-data-table
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'label_code',
                            sortable: false,
                          },
                          {
                            text: 'Seedling',
                            value: 'rel_tree_id',
                            sortable: false,
                          },
                          // {text: 'PIC Distribute', value: 'implementor_distribute_id', sortable: false},
                        ]"
                        :items="
                          distributionReport.dialogs.detail.labels.distributed
                        "
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- Seedling Column -->
                        <template v-slot:item.tree_list="{ item }">
                          <p
                            class="mb-0"
                            v-for="tree in item.tree_list"
                            :key="tree.tree_name"
                          >
                            {{ tree.tree_name }}
                            <strong>{{ tree.tree_amount }}</strong>
                          </p>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col cols="6" md="3" lg="3">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-basket-remove</v-icon> Lost Bags
                </v-row>
                <v-menu content-class="rounded-xl white">
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      v-bind="attrs"
                      v-on="on"
                      class="rounded-xl"
                      max-width="150px"
                      color="red"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.detail.labels.lost.length
                          }}
                        </h1>
                        bags
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-basket-remove</v-icon> Lost Bags
                      <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'label_code',
                            sortable: false,
                          },
                          {
                            text: 'Seedling',
                            value: 'rel_tree_id',
                            sortable: false,
                          },
                          // {text: 'PIC Load', value: 'loaded_by', sortable: false},
                        ]"
                        :items="distributionReport.dialogs.detail.labels.lost"
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- Seedling Column -->
                        <template v-slot:item.tree_list="{ item }">
                          <p
                            class="mb-0"
                            v-for="tree in item.tree_list"
                            :key="tree.tree_name"
                          >
                            {{ tree.tree_name }}
                            <strong>{{ tree.tree_amount }}</strong>
                          </p>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <!-- Seedling Adjustment -->
            <v-row class="ma-0 mt-4">
              <v-col cols="12" class="d-flex align-center">
                <v-btn fab x-small color="green white--text" class="mr-2"
                  ><v-icon>mdi-sprout</v-icon></v-btn
                >
                <h3>Jumlah Penerimaan Bibit</h3>
                <v-divider class="mx-2"></v-divider>
              </v-col>
              <v-col cols="12" md="12">
                <!-- <v-col cols="12" md="12" v-for="(adjustmentData, adjIndex) in distributionReport.dialogs.detail.adjustment" :key="adjustmentData.lahan_no">
                                    <v-row class="align-center ma-0">
                                        Lahan {{ adjIndex + 1 }} : <strong class="ml-1">{{ adjustmentData.lahan_no }}</strong> <v-divider class="ml-2"></v-divider>
                                    </v-row> -->
                <v-data-table
                  :headers="[
                    { text: 'No', value: 'no', align: 'center' },
                    { text: 'Kode', value: 'tree_code' },
                    { text: 'Nama', value: 'rel_tree_id', align: 'center' },
                    {
                      text: 'Jumlah Load',
                      value: 'total_load',
                      align: 'center',
                      sortable: false,
                    },
                    {
                      text: 'Jumlah Rusak',
                      value: 'total_damaged',
                      align: 'center',
                      sortable: false,
                    },
                    {
                      text: 'Jumlah Hilang',
                      value: 'total_missing',
                      align: 'center',
                      sortable: false,
                    },
                    {
                      text: 'Jumlah Diterima',
                      value: 'total_received',
                      align: 'center',
                      sortable: false,
                    },
                  ]"
                  :items="distributionReport.dialogs.detail.adjustment"
                  :items-per-page="-1"
                  hide-default-footer
                  class="rounded-xl elevation-5 overflow-hidden mt-2"
                >
                  <template v-slot:item.no="{ index }">
                    {{ index + 1 }}
                  </template>
                  <!-- <template v-slot:item.adjust="{index}">
                                            <v-row class="ma-0 align-center justify-end justify-lg-center">
                                                <v-text-field 
                                                    color="green"
                                                    class="mr-1"
                                                    dense
                                                    readonly
                                                    hide-details
                                                    outlined
                                                    rounded
                                                    style="max-width: 120px;"
                                                    type="number"
                                                    min="0"
                                                    label="All"
                                                    v-model="distributionReport.dialogs.detail.adjustment[adjIndex].items[index].total_distributed"
                                                ></v-text-field>
                                                <v-text-field 
                                                    color="green"
                                                    class="mr-1"
                                                    dense
                                                    :readonly="distributionReport.dialogs.detail.disabledSave"
                                                    hide-details
                                                    outlined
                                                    rounded
                                                    style="max-width: 120px;"
                                                    type="number"
                                                    min="0"
                                                    label="Broken"
                                                    v-model="distributionReport.dialogs.detail.adjustment[adjIndex].items[index].broken_seeds"
                                                    @change="treeAdjustmentChange(adjIndex, index)"
                                                ></v-text-field>
                                                <v-text-field 
                                                    color="green"
                                                    class="mr-1"
                                                    dense
                                                    :readonly="distributionReport.dialogs.detail.disabledSave"
                                                    hide-details
                                                    outlined
                                                    rounded
                                                    style="max-width: 120px;"
                                                    type="number"
                                                    min="0"
                                                    label="Missing"
                                                    v-model="distributionReport.dialogs.detail.adjustment[adjIndex].items[index].missing_seeds"
                                                    @change="treeAdjustmentChange(adjIndex, index)"
                                                ></v-text-field>
                                                <v-text-field 
                                                    readonly
                                                    color="green"
                                                    dense
                                                    hide-details
                                                    outlined
                                                    rounded
                                                    style="max-width: 120px;"
                                                    type="number"
                                                    min="0"
                                                    label="Received"
                                                    v-model="distributionReport.dialogs.detail.adjustment[adjIndex].items[index].total_tree_received"
                                                ></v-text-field>
                                            </v-row>
                                        </template> -->
                </v-data-table>
              </v-col>
            </v-row>
            <!-- Photos -->
            <v-row class="ma-0 mt-4">
              <v-col cols="12" class="d-flex align-center">
                <v-btn fab x-small color="green white--text" class="mr-2"
                  ><v-icon>mdi-image-multiple</v-icon></v-btn
                >
                <h3>Foto Penerimaan Petani</h3>
                <v-divider class="mx-2"></v-divider>
              </v-col>
              <v-col cols="12" lg="6">
                <h4
                  v-if="generalSettings.type.model == 'Petani'"
                  class="text-center"
                >
                  Penerima:
                  {{
                    distributionReport.dialogs.detail.data.user_accepted || "-"
                  }}
                </h4>
                <h4
                  v-else-if="generalSettings.type.model == 'Umum'"
                  class="text-center"
                >
                  Foto
                </h4>
                <v-card
                  v-if="distributionReport.dialogs.detail.distribution_photo"
                  elevation="2"
                  class="rounded-xl"
                  height="300"
                >
                  <v-img
                    height="300"
                    v-bind:src="`${apiConfig.nurseryImageUrl}${distributionReport.dialogs.detail.distribution_photo}`"
                    class="my-2 mb-4 rounded-xl cursor-pointer"
                    id="Distribution Photo"
                    @click="
                      showLightbox(
                        `${apiConfig.nurseryImageUrl}${distributionReport.dialogs.detail.distribution_photo}`
                      )
                    "
                  ></v-img
                ></v-card>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                v-if="generalSettings.type.model == 'Petani'"
              >
                <h4 class="text-center">Tanda Tangan Petani</h4>
                <v-card
                  v-if="
                    distributionReport.dialogs.detail.farmer_signature_photo
                  "
                  elevation="2"
                  class="rounded-xl"
                  height="300"
                >
                  <v-img
                    height="300"
                    v-bind:src="`${apiConfig.nurseryImageUrl}${distributionReport.dialogs.detail.farmer_signature_photo}`"
                    class="my-2 mb-4 rounded-xl cursor-pointer"
                    id="Farmer Signature"
                    @click="
                      showLightbox(
                        `${apiConfig.nurseryImageUrl}${distributionReport.dialogs.detail.farmer_signature_photo}`
                      )
                    "
                  ></v-img
                ></v-card>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="" v-if="distributionReport.dialogs.detail.data">
          <v-btn
            color="red white--text"
            rounded
            @click="distributionReport.dialogs.detail.show = false"
          >
            <v-icon color="white"> mdi-close-circle </v-icon>
            Close
          </v-btn>
          <v-divider class="mx-2"></v-divider>
          <v-btn
            v-if="
              (distributionReport.dialogs.detail.data.verified_by == null ||
                distributionReport.dialogs.detail.data.verified_by == '') &&
              distributionReport.dialogs.detail.labels.printed.length > 0 &&
              distributionReport.dialogs.detail.labels.loaded.length > 0 &&
              distributionReport.dialogs.detail.totalSeedArrival > 0
            "
            @click="updateVerifikasiReportNursery()"
            :disabled="
              User.role_group != 'IT' && User.role_name != 'FIELD COORDINATOR'
            "
            rounded
            color="green white--text"
            class="px-4"
          >
            <v-icon class="mr-1">mdi-check-bold </v-icon> Verifikasi FC
          </v-btn>
          <v-btn
            v-if="
              distributionReport.dialogs.detail.data.verified_by != '' &&
              distributionReport.dialogs.detail.data.verified_by != null
            "
            @click="updateUnverifikasiReportNursery()"
            :disabled="User.role_group != 'IT'"
            rounded
            color="red white--text"
            class="px-4"
          >
            <v-icon class="mr-1">mdi-lock-open-remove </v-icon> Unverifikasi
          </v-btn>
          <!-- <v-btn v-if="generalSettings.type.model == 'Petani' && distributionReport.dialogs.detail.data.status == 0" @click="confirmationShow('Save & Verif')" :disabled="distributionReport.dialogs.detail.disabledSave || (User.role_group != 'IT' && User.role_name != 'FIELD COORDINATOR')" rounded color="green white--text" class="px-4"><v-icon class="mr-1">mdi-content-save-check</v-icon> Verifikasi FC</v-btn> -->
          <!-- <v-btn v-else-if="generalSettings.type.model == 'Umum' && distributionReport.dialogs.detail.data.status == 0" @click="confirmationShow('Save & Verif')" :disabled="distributionReport.dialogs.detail.disabledSave" rounded color="green white--text" class="px-4"><v-icon class="mr-1">mdi-content-save-check</v-icon> Save & Verification</v-btn>
                        <v-btn v-else-if="distributionReport.dialogs.detail.data.status > 0 && generalSettings.type.model == 'Petani'" rounded color="green white--text" class="px-4" @click="confirmationShow('Verified UM')" :disabled="distributionReport.dialogs.detail.data.status == 2 || (User.role_group != 'IT' && User.role_name != 'UNIT MANAGER')"><v-icon class="mr-1">mdi-check-circle</v-icon> Verification by UM</v-btn>
                        <v-btn v-else-if="distributionReport.dialogs.detail.data.status > 0 && generalSettings.type.model == 'Umum'" rounded color="green white--text" class="px-4" @click="confirmationShow('Verified Pak Pandu')" :disabled="distributionReport.dialogs.detail.data.status == 2 || (User.role_group != 'IT' && User.role_name != 'PROGRAM MANAGER' && User.role_name != 'REGIONAL MANAGER')"><v-icon class="mr-1">mdi-check-circle</v-icon> Verification by PM</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Distribution Report Detail Umum -->
    <v-dialog
      content-class="rounded-xl elevation-0 mx-1"
      top
      persistent
      max-width="1000px"
      scrollable
      v-model="distributionReport.dialogs.detailUmum.show"
    >
      <v-card class="elevation-5 rounded-xl">
        <v-card-title
          class="mb-1 headermodalstyle rounded-xl d-flex align-center"
        >
          <span class="d-flex align-center">
            <v-icon color="white" class="mr-1"> mdi-text-box-check </v-icon>
            Distribution Report
          </span>
          <v-divider class="mx-2" dark></v-divider>
          <v-icon color="white" @click="closeDetailUmum()">
            mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <!-- loading -->
          <div
            v-if="distributionReport.dialogs.detailUmum.loading"
            class="d-flex flex-column align-center justify-center"
          >
            <v-progress-circular
              indeterminate
              color="green"
              size="72"
              width="7"
              class="mt-10"
            ></v-progress-circular>
            <p class="mt-2">
              {{ distributionReport.dialogs.detailUmum.loadingText }}
            </p>
          </div>
          <!-- DETAIL CONTENT -->
          <div v-if="distributionReport.dialogs.detailUmum.data">
            <!-- General Data -->
            <v-simple-table>
              <tbody>
                <!-- <tr>
                                        <td>Distribution No</td>
                                        <td>:</td>
                                        <td><strong>{{ distributionReport.dialogs.detail.data.distribution_no }}</strong></td>
                                    </tr> -->
                <tr>
                  <td>Management Unit</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detailUmum.data.mu_name || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-if="generalSettings.type.model == 'Petani'">
                  <td>Field Facilitator</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detailUmum.data.ff_name || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-else-if="generalSettings.type.model == 'Umum'">
                  <td>PIC T4T</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detailUmum.data.pic_t4t || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-if="generalSettings.type.model == 'Petani'">
                  <td>Petani</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detailUmum.data.farmer_name ||
                      "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-if="generalSettings.type.model == 'Petani'">
                  <td>Tanggal Distribusi</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detailUmum.data
                        .distribution_date || "-"
                    }}</strong>
                  </td>
                </tr>
                <tr v-else-if="generalSettings.type.model == 'Umum'">
                  <td>PIC Lahan</td>
                  <td>:</td>
                  <td>
                    <strong>{{
                      distributionReport.dialogs.detailUmum.data.pic_lahan ||
                      "-"
                    }}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Penerimaan Pupuk</td>
                  <td>:</td>
                  <td>
                    <v-chip
                      v-if="
                        distributionReport.dialogs.detailUmum.data
                          .is_pupuk_distributed == 0
                      "
                      color="orange white--text"
                      class="pl-1 pr-3"
                      ><v-icon class="mr-1">mdi-close-circle</v-icon> Tidak
                      Menerima</v-chip
                    >
                    <!-- <v-chip v-if="distributionReport.dialogs.detailUmum.data.is_pupuk_distributed == 1" color="green white--text" class="pl-1 pr-3"><v-icon class="mr-1">mdi-check-circle</v-icon> Menerima {{ new Intl.NumberFormat().format(distributionReport.dialogs.detail.data.total_pupuk )}} ML</v-chip> -->

                    <v-chip
                      v-if="
                        distributionReport.dialogs.detailUmum.data
                          .is_pupuk_distributed == 1
                      "
                      color="green white--text"
                      class="pl-1 pr-3"
                      ><v-icon class="mr-1">mdi-check-circle</v-icon>
                      <!-- {{
                        JSON.stringify(
                          distributionReport.dialogs.detailUmum.data.total_pupuk
                        )
                      }} -->
                        {{distributionReport.dialogs.detailUmum.data.total_pupuk}}
                    </v-chip>
                  </td>
                </tr>
                <tr>
                  <td>Persentase Penerimaan Petani</td>
                  <td>:</td>
                  <td>
                    <div>
                      <v-progress-linear
                        :value="
                          percentageFormat(
                            distributionReport.dialogs.detailUmum
                              .totalSeedArrival,
                            distributionReport.dialogs.detailUmum.labels.loaded
                              .length
                          )
                        "
                        color="orange"
                        height="25"
                      >
                        <strong
                          >{{
                            Math.ceil(
                              percentageFormat(
                                distributionReport.dialogs.detailUmum
                                  .totalSeedArrival,
                                distributionReport.dialogs.detailUmum.labels
                                  .loaded.length
                              )
                            )
                          }}%</strong
                        >
                      </v-progress-linear>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <!-- Total Activities Bags -->
            <v-row>
              <v-col cols="6" md="3" lg="3">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-printer</v-icon> Printed Labels
                  <v-divider class="ml-2"></v-divider>
                </v-row>
                <v-menu content-class="rounded-xl white">
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      class="rounded-xl"
                      max-width="150px"
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.detailUmum.labels.printed
                              .length
                          }}
                        </h1>
                        Labels
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-printer</v-icon> Printed Labels
                      <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'label_code',
                            sortable: false,
                          },
                          {
                            text: 'Seedling',
                            value: 'rel_tree_id',
                            sortable: false,
                          },
                        ]"
                        :items="
                          distributionReport.dialogs.detailUmum.labels.printed
                        "
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- Seedling Column -->
                        <template v-slot:item.tree_list="{ item }">
                          <p
                            class="mb-0"
                            v-for="tree in item.tree_list"
                            :key="tree.tree_name"
                          >
                            {{ tree.tree_name }}
                            <strong>{{ tree.tree_amount }}</strong>
                          </p>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col cols="6" md="3" lg="3">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-truck-check</v-icon> Loaded Bags
                  <v-divider class="ml-2"></v-divider>
                </v-row>
                <v-menu content-class="rounded-xl white">
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      v-bind="attrs"
                      v-on="on"
                      class="rounded-xl"
                      max-width="150px"
                      color="warning"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.detailUmum.labels.loaded
                              .length
                          }}
                        </h1>
                        bags
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-truck-check</v-icon> Loaded Bags
                      <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'label_code',
                            sortable: false,
                          },
                          {
                            text: 'Seedling',
                            value: 'rel_tree_id',
                            sortable: false,
                          },
                          {
                            text: 'PIC Load',
                            value: 'rel_implementor_load_id',
                            sortable: false,
                          },
                        ]"
                        :items="
                          distributionReport.dialogs.detailUmum.labels.loaded
                        "
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- Seedling Column -->
                        <template v-slot:item.tree_list="{ item }">
                          <p
                            class="mb-0"
                            v-for="tree in item.tree_list"
                            :key="tree.tree_name"
                          >
                            {{ tree.tree_name }}
                            <strong>{{ tree.tree_amount }}</strong>
                          </p>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col cols="6" md="3" lg="3">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-basket-check</v-icon> Distributed
                  Bags
                  <v-divider class="ml-2 d-none d-md-inline-block"></v-divider>
                </v-row>
                <v-menu content-class="rounded-xl white">
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      v-bind="attrs"
                      v-on="on"
                      class="rounded-xl"
                      max-width="150px"
                      color="green"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.detailUmum.labels
                              .distributed.length
                          }}
                        </h1>
                        bags
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-basket-check</v-icon> Distributed
                      Bags <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <!-- <v-btn v-if="generalSettings.type.model == 'Umum'" color="info white--text" rounded block class="mb-2" @click="openModalScanLahanUmum" :disabled="distributionReport.dialogs.detailUmum.data.status > 0">
                                                    <v-icon class="mr-1">mdi-qrcode-scan</v-icon>
                                                    SCAN
                                                </v-btn> -->
                      <v-data-table
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'label_code',
                            sortable: false,
                          },
                          {
                            text: 'Seedling',
                            value: 'rel_tree_id',
                            sortable: false,
                          },
                          // {text: 'PIC Distribute', value: 'implementor_distribute_id', sortable: false},
                        ]"
                        :items="
                          distributionReport.dialogs.detailUmum.labels
                            .distributed
                        "
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- Seedling Column -->
                        <template v-slot:item.tree_list="{ item }">
                          <p
                            class="mb-0"
                            v-for="tree in item.tree_list"
                            :key="tree.tree_name"
                          >
                            {{ tree.tree_name }}
                            <strong>{{ tree.tree_amount }}</strong>
                          </p>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col cols="6" md="3" lg="3">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-basket-remove</v-icon> Lost Bags
                </v-row>
                <v-menu content-class="rounded-xl white">
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      v-bind="attrs"
                      v-on="on"
                      class="rounded-xl"
                      max-width="150px"
                      color="red"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.detailUmum.labels.lost
                              .length
                          }}
                        </h1>
                        bags
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-basket-remove</v-icon> Lost Bags
                      <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'label_code',
                            sortable: false,
                          },
                          {
                            text: 'Seedling',
                            value: 'rel_tree_id',
                            sortable: false,
                          },
                          // {text: 'PIC Load', value: 'loaded_by', sortable: false},
                        ]"
                        :items="
                          distributionReport.dialogs.detailUmum.labels.lost
                        "
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- Seedling Column -->
                        <template v-slot:item.tree_list="{ item }">
                          <p
                            class="mb-0"
                            v-for="tree in item.tree_list"
                            :key="tree.tree_name"
                          >
                            {{ tree.tree_name }}
                            <strong>{{ tree.tree_amount }}</strong>
                          </p>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                class="d-flex align-center"
                v-if="
                  distributionReport.dialogs.detailUmum.totalSeedArrival <
                  distributionReport.dialogs.detailUmum.labels.loaded.length
                "
              >
                <h3>Adjust Penerimaan Kantung:</h3>
                <v-col cols="4" sm="4" md="4">
                  <v-select
                    rounded
                    v-model="
                      distributionReport.dialogs.inputAdjustDetailLables
                        .distributedBag
                    "
                    :items="
                      distributionReport.dialogs.inputAdjustDetailLables
                        .menuItem
                    "
                    :item-text="
                      (item) => item.bag_tree_name + '-' + item.amount_in_bag
                    "
                    item-value="bag_id"
                    label="Terdistribusi"
                    outlined
                    clearable
                    multiple
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-select>
                </v-col>
                <v-col cols="4" sm="4" md="4">
                  <v-text-field
                    rounded
                    v-model="
                      distributionReport.dialogs.inputAdjustDetailLables
                        .user_accepted
                    "
                    label="Nama Penerima"
                    outlined
                    clearable
                    :rules="[(v) => !!v || 'Field is required']"
                  ></v-text-field>
                </v-col>
              </v-col>
              <v-col
                cols="3"
                sm="3"
                md="3"
                v-if="
                  distributionReport.dialogs.detailUmum.totalSeedArrival <
                  distributionReport.dialogs.detailUmum.labels.loaded.length
                "
              >
                <v-switch
                  v-model="
                    distributionReport.dialogs.inputAdjustDetailLables
                      .is_pupuk_distributed
                  "
                  label="Menerima Pupuk?"
                  inset
                  color="orange"
                  true-value="1"
                  false-value="0"
                  hide-details
                ></v-switch>
              </v-col>
            </v-row>
            <!-- Seedling Adjustment -->
            <v-row class="ma-0 mt-4">
              <v-col cols="12" class="d-flex align-center">
                <v-btn fab x-small color="green white--text" class="mr-2"
                  ><v-icon>mdi-sprout</v-icon></v-btn
                >
                <h3>Jumlah Penerimaan Bibit</h3>
                <v-divider class="mx-2"></v-divider>
                <h3
                  class="red--text"
                  v-if="
                    distributionReport.dialogs.detailUmum.totalSeedArrival <
                    distributionReport.dialogs.detailUmum.labels.loaded.length
                  "
                >
                  <strong>*Klik Angka Pada Kolom Untuk Mengubah Jumlah!</strong>
                </h3>
              </v-col>
              <v-col cols="12" md="12">
                <!-- <v-col cols="12" md="12" v-for="(adjustmentData, adjIndex) in distributionReport.dialogs.detail.adjustment" :key="adjustmentData.lahan_no">
                                    <v-row class="align-center ma-0">
                                        Lahan {{ adjIndex + 1 }} : <strong class="ml-1">{{ adjustmentData.lahan_no }}</strong> <v-divider class="ml-2"></v-divider>
                                    </v-row> -->
                <v-data-table
                  :headers="[
                    // {text: 'No', value: 'no', align: 'center'},
                    { text: 'Kode', value: 'tree_code' },
                    { text: 'Nama', value: 'rel_tree_id', align: 'center' },
                    {
                      text: 'Jumlah Load',
                      value: 'total_load',
                      align: 'center',
                      sortable: false,
                    },
                    {
                      text: 'Jumlah Rusak',
                      value: 'total_damaged',
                      align: 'center',
                      sortable: false,
                    },
                    {
                      text: 'Jumlah Hilang',
                      value: 'total_missing',
                      align: 'center',
                      sortable: false,
                    },
                    {
                      text: 'Jumlah Diterima',
                      value: 'total_received',
                      align: 'center',
                      sortable: false,
                    },
                  ]"
                  :items="distributionReport.dialogs.detailUmum.adjustment"
                  :items-per-page="-1"
                  hide-default-footer
                  class="rounded-xl elevation-5 overflow-hidden mt-2"
                >
                  <!-- <template v-slot:item.no="{index}">
                                            {{ index + 1 }}
                                        </template> -->
                  <template
                    v-slot:body="{ items, headers }"
                    v-if="
                      distributionReport.dialogs.detailUmum.totalSeedArrival <
                      distributionReport.dialogs.detailUmum.labels.loaded.length
                    "
                  >
                    <tbody>
                      <tr v-for="(item, idx, k) in items" :key="idx">
                        <td v-for="(header, key) in headers" :key="key">
                          <v-edit-dialog
                            :return-value.sync="item[header.value]"
                            @save="simpanJumlah"
                            large
                          >
                            {{ item[header.value] }}
                            <template
                              v-if="
                                header.value == 'total_damaged' ||
                                header.value == 'total_missing' ||
                                header.value == 'total_received'
                              "
                              v-slot:input
                            >
                              <v-text-field
                                v-model="item[header.value]"
                                label="Edit"
                                single-line
                                type="number"
                              ></v-text-field>
                              <!-- Amount Limitation -->
                              <!-- @change="$v=>$v > item.maxAmount? item[header.value]=item.maxAmount:''"
                                                            :rules="[
                                                                v => (!!v && v <= item.maxAmount)|| 'Jumlah Tidak Bisa Lebih!'
                                                            ]" -->
                            </template>
                          </v-edit-dialog>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <!-- Photos -->
            <v-row class="ma-0 mt-4">
              <v-col cols="12" class="d-flex align-center">
                <v-btn fab x-small color="green white--text" class="mr-2"
                  ><v-icon>mdi-image-multiple</v-icon></v-btn
                >
                <h3>Foto Penerimaan Bibit Lahan Umum</h3>
                <v-divider class="mx-2"></v-divider>
              </v-col>
              <v-btn
                :disabled="
                  distributionReport.dialogs.detailUmum.distribution_photo !=
                    null ||
                  distributionReport.dialogs.detailUmum.distribution_photo !=
                    null
                "
                color="green white--text"
                rounded
                class="px-5"
                @click="distributionReport.dialogs.addPhoto.show = true"
              >
                <v-icon small class="mr-1">mdi-camera</v-icon>
                Upload Foto Penerimaan Bibit
              </v-btn>
              <v-file-input
                v-if="distributionReport.dialogs.addPhoto.show == true"
                accept="image/png, image/jpeg, image/bmp"
                @change="
                  (val) => {
                    distributionReport.dialogs.addPhoto.modal_receiver_photo =
                      val;
                  }
                "
                placeholder="Pilih Foto Penerima Bibit"
                prepend-icon="mdi-camera"
                show-size
                label="Pilih Foto Penerima Bibit"
              ></v-file-input>
              <v-file-input
                v-if="distributionReport.dialogs.addPhoto.show == true"
                accept="image/png, image/jpeg, image/bmp"
                @change="
                  (val) => {
                    distributionReport.dialogs.addPhoto.modal_signature_photo =
                      val;
                  }
                "
                placeholder="Pilih Foto Tanda Tangan Penerima"
                prepend-icon="mdi-camera"
                show-size
                label="Pilih Foto Tanda Tangan Penerima"
              ></v-file-input>
              <!-- <v-btn 
                                    v-if="distributionReport.dialogs.addPhoto.show == true"
                                    color="green white--text" 
                                    rounded class="px-5" 
                                    @click="distributionReport.dialogs.addPhoto.show = false"
                                    >
                                        <v-icon small class="mr-1">mdi-content-save-alert</v-icon>
                                        Simpan Foto
                                </v-btn> -->
              <v-col cols="12" class="d-flex align-center">
                <v-divider class="mx-2"></v-divider>
              </v-col>
              <v-col cols="12" lg="6">
                <h4
                  v-if="generalSettings.type.model == 'Petani'"
                  class="text-center"
                >
                  Penerima:
                  {{
                    distributionReport.dialogs.detailUmum.data.user_accepted ||
                    "-"
                  }}
                </h4>
                <h4
                  v-else-if="generalSettings.type.model == 'Umum'"
                  class="text-center"
                >
                  Foto
                </h4>
                <v-card
                  v-if="
                    distributionReport.dialogs.detailUmum.distribution_photo
                  "
                  elevation="2"
                  class="rounded-xl"
                  height="300"
                >
                  <v-img
                    height="300"
                    v-bind:src="`${apiConfig.nurseryImageUrl}${distributionReport.dialogs.detailUmum.distribution_photo}`"
                    class="my-2 mb-4 rounded-xl cursor-pointer"
                    id="Distribution Photo"
                    @click="
                      showLightbox(
                        `${apiConfig.nurseryImageUrl}${distributionReport.dialogs.detailUmum.distribution_photo}`
                      )
                    "
                  ></v-img
                ></v-card>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                v-if="generalSettings.type.model == 'Petani'"
              >
                <h4 class="text-center">Tanda Tangan Penerima</h4>
                <v-card
                  v-if="
                    distributionReport.dialogs.detailUmum.farmer_signature_photo
                  "
                  elevation="2"
                  class="rounded-xl"
                  height="300"
                >
                  <v-img
                    height="300"
                    v-bind:src="`${apiConfig.nurseryImageUrl}${distributionReport.dialogs.detailUmum.farmer_signature_photo}`"
                    class="my-2 mb-4 rounded-xl cursor-pointer"
                    id="Farmer Signature"
                    @click="
                      showLightbox(
                        `${apiConfig.nurseryImageUrl}${distributionReport.dialogs.detailUmum.farmer_signature_photo}`
                      )
                    "
                  ></v-img
                ></v-card>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions
          class=""
          v-if="distributionReport.dialogs.detailUmum.data"
        >
          <v-btn color="red white--text" rounded @click="closeDetailUmum()">
            <v-icon color="white"> mdi-close-circle </v-icon>
            Close
          </v-btn>
          <v-divider class="mx-2"></v-divider>

          <v-btn
            v-if="
              (distributionReport.dialogs.detailUmum.data.verified_by == null ||
                distributionReport.dialogs.detailUmum.data.verified_by == '') &&
              distributionReport.dialogs.detailUmum.labels.printed.length > 0 &&
              distributionReport.dialogs.detailUmum.labels.loaded.length > 0 &&
              distributionReport.dialogs.detailUmum.totalSeedArrival ==
                distributionReport.dialogs.detailUmum.labels.loaded.length
            "
            @click="updateVerifikasiReportNurseryUmum()"
            :disabled="
              User.role_group != 'IT' && User.role_name != 'FIELD COORDINATOR'
            "
            rounded
            color="green white--text"
            class="px-4"
          >
            <v-icon class="mr-1">mdi-check-bold </v-icon> Verifikasi FC
          </v-btn>
          <v-btn
            v-if="
              distributionReport.dialogs.inputAdjustDetailLables.distributedBag
                .length > 0 &&
              distributionReport.dialogs.addPhoto.modal_signature_photo != '' &&
              distributionReport.dialogs.addPhoto.modal_receiver_photo != ''
            "
            @click="saveDataReportAdjustment()"
            :disabled="
              User.role_group != 'IT' && User.role_name != 'FIELD COORDINATOR'
            "
            rounded
            color="green white--text"
            class="px-4"
          >
            <v-icon class="mr-1">mdi-check-bold </v-icon> Simpan Perubahan Data
          </v-btn>
          <v-btn
            v-if="
              distributionReport.dialogs.detailUmum.data.verified_by != '' &&
              distributionReport.dialogs.detailUmum.data.verified_by != null
            "
            @click="updateUnverifikasiReportNursery()"
            :disabled="User.role_group != 'IT'"
            rounded
            color="red white--text"
            class="px-4"
          >
            <v-icon class="mr-1">mdi-lock-open-remove </v-icon> Unverifikasi
          </v-btn>
          <!-- <v-btn v-if="generalSettings.type.model == 'Petani' && distributionReport.dialogs.detail.data.status == 0" @click="confirmationShow('Save & Verif')" :disabled="distributionReport.dialogs.detail.disabledSave || (User.role_group != 'IT' && User.role_name != 'FIELD COORDINATOR')" rounded color="green white--text" class="px-4"><v-icon class="mr-1">mdi-content-save-check</v-icon> Verifikasi FC</v-btn> -->
          <!-- <v-btn v-else-if="generalSettings.type.model == 'Umum' && distributionReport.dialogs.detail.data.status == 0" @click="confirmationShow('Save & Verif')" :disabled="distributionReport.dialogs.detail.disabledSave" rounded color="green white--text" class="px-4"><v-icon class="mr-1">mdi-content-save-check</v-icon> Save & Verification</v-btn>
                        <v-btn v-else-if="distributionReport.dialogs.detail.data.status > 0 && generalSettings.type.model == 'Petani'" rounded color="green white--text" class="px-4" @click="confirmationShow('Verified UM')" :disabled="distributionReport.dialogs.detail.data.status == 2 || (User.role_group != 'IT' && User.role_name != 'UNIT MANAGER')"><v-icon class="mr-1">mdi-check-circle</v-icon> Verification by UM</v-btn>
                        <v-btn v-else-if="distributionReport.dialogs.detail.data.status > 0 && generalSettings.type.model == 'Umum'" rounded color="green white--text" class="px-4" @click="confirmationShow('Verified Pak Pandu')" :disabled="distributionReport.dialogs.detail.data.status == 2 || (User.role_group != 'IT' && User.role_name != 'PROGRAM MANAGER' && User.role_name != 'REGIONAL MANAGER')"><v-icon class="mr-1">mdi-check-circle</v-icon> Verification by PM</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- SCAN Distribution Lahan Umum -->
    <v-dialog
      content-class="rounded-xl elevation-0 mx-1"
      top
      persistent
      max-width="700px"
      scrollable
      v-model="distributionReport.dialogs.scanLahanUmum.show"
    >
      <v-card class="elevation-5 rounded-xl">
        <v-card-title
          class="mb-1 headermodalstyle rounded-xl d-flex align-center"
        >
          <span class="d-flex align-center">
            <v-icon color="white" class="mr-1"> mdi-qrcode-scan </v-icon>
            SCAN Distribution
          </span>
          <v-divider class="mx-2" dark></v-divider>
          <v-icon
            color="white"
            @click="
              () => {
                distributionReport.dialogs.scanLahanUmum.show = false;
                distributionReport.dialogs.detail.show = false;
              }
            "
          >
            mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <div>
            <!-- loading -->
            <v-overlay v-if="distributionReport.dialogs.scanLahanUmum.loading">
              <div class="d-flex flex-column align-center justify-center">
                <v-progress-circular
                  indeterminate
                  color="green"
                  size="72"
                  width="7"
                  class="mt-10"
                ></v-progress-circular>
                <p class="mt-2">
                  {{ distributionReport.dialogs.scanLahanUmum.loadingText }}
                </p>
              </div>
            </v-overlay>
            <v-row class="align-center justify-center ma-0 mb-1">
              <v-btn
                fab
                x-small
                :color="`${
                  distributionReport.dialogs.scanLahanUmum.camera
                    ? 'red'
                    : 'green'
                } white--text`"
                @click="
                  () => {
                    distributionReport.dialogs.scanLahanUmum.camera =
                      !distributionReport.dialogs.scanLahanUmum.camera;
                  }
                "
              >
                <v-icon
                  >mdi-camera{{
                    distributionReport.dialogs.scanLahanUmum.camera
                      ? "-off"
                      : ""
                  }}</v-icon
                >
              </v-btn>
            </v-row>
            <div class="d-flex align-center justify-center">
              <v-card
                class="rounded-xl overflow-hidden"
                v-if="
                  distributionReport.dialogs.scanLahanUmum.show &&
                  distributionReport.dialogs.scanLahanUmum.camera
                "
              >
                <qrcode-stream
                  @decode="onScannedLahanUmumLabel"
                  @init="onInitQRCODEScanner"
                  style="max-width: 250px; max-height: 200px"
                ></qrcode-stream>
              </v-card>
            </div>
            <p class="mt-2">
              Last Scanned:
              <strong>{{
                distributionReport.dialogs.scanLahanUmum.scan.lastScanned || "-"
              }}</strong>
            </p>
            <v-row>
              <v-col cols="6">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-tag-multiple</v-icon> Bags Left
                  <v-divider class="ml-2"></v-divider>
                </v-row>
                <v-menu
                  content-class="rounded-xl white"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      v-bind="attrs"
                      v-on="on"
                      class="rounded-xl"
                      max-width="150px"
                      color="red"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.scanLahanUmum.scan
                              .labelsLeft.length
                          }}
                        </h1>
                        bags
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-tag-multiple</v-icon> Bags Left
                      <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        :loading="
                          distributionReport.dialogs.scanLahanUmum.loading
                        "
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'bag_number',
                            sortable: false,
                          },
                          {
                            text: 'Seedling',
                            value: 'tree_list',
                            sortable: false,
                          },
                          {
                            text: 'PIC Load',
                            value: 'loaded_by',
                            sortable: false,
                          },
                        ]"
                        :items="
                          distributionReport.dialogs.scanLahanUmum.scan
                            .labelsLeft
                        "
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ item }">
                          <v-btn
                            rounded
                            fab
                            x-small
                            color="green white--text"
                            class="my-1"
                            @click="onScannedLahanUmumLabel(item.bag_number)"
                            ><v-icon
                              >mdi-checkbox-marked-circle-outline</v-icon
                            ></v-btn
                          >
                        </template>
                        <!-- Seedling Column -->
                        <template v-slot:item.tree_list="{ item }">
                          <p
                            class="mb-0"
                            v-for="tree in item.tree_list"
                            :key="tree.tree_name"
                          >
                            {{ tree.tree_name }}
                            <strong>{{ tree.tree_amount }}</strong>
                          </p>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-row class="align-center my-2 ml-2">
                  <v-icon class="mr-1">mdi-qrcode</v-icon> Bags Scanned
                </v-row>
                <v-menu content-class="rounded-xl white">
                  <template v-slot:activator="{ attrs, on }">
                    <v-card
                      v-bind="attrs"
                      v-on="on"
                      class="rounded-xl"
                      max-width="150px"
                      color="green"
                    >
                      <v-card-text class="text-center white--text">
                        <h1>
                          {{
                            distributionReport.dialogs.scanLahanUmum.scan
                              .scanned.length
                          }}
                        </h1>
                        bags
                      </v-card-text>
                    </v-card>
                  </template>
                  <v-card max-height="400px" elevation="0">
                    <v-card-title>
                      <v-icon class="mr-1">mdi-qrcode</v-icon> Bags Scanned
                      <v-divider class="ml-2"></v-divider>
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        dense
                        :headers="[
                          {
                            text: 'No',
                            value: 'no',
                            align: 'center',
                            sortable: false,
                          },
                          {
                            text: 'Bag Number',
                            value: 'bag_number',
                            sortable: false,
                          },
                        ]"
                        :items="
                          distributionReport.dialogs.scanLahanUmum.scan.scanned
                        "
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <!-- No Column -->
                        <template v-slot:item.no="{ index }">
                          {{ index + 1 }}
                        </template>
                        <!-- No Column -->
                        <template v-slot:item.bag_number="{ item }">
                          {{ item }}
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <!-- Photo File -->
              <v-col cols="12" sm="12">
                <v-file-input
                  color="success"
                  item-color="success"
                  outlined
                  rounded
                  hide-details
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Photo 1"
                  prepend-icon="mdi-camera"
                  label="Photo (*max 6mb)"
                  v-on:change="distributionPhotoFileChanged"
                  :rules="[(v) => !!v || 'Field is required']"
                ></v-file-input>
                <v-card
                  elevation="2"
                  class="rounded-xl"
                  height="300"
                  v-if="
                    distributionReport.dialogs.scanLahanUmum.photo.preview &&
                    distributionReport.dialogs.scanLahanUmum.photo.preview !==
                      ''
                  "
                >
                  <v-img
                    height="300"
                    v-bind:src="
                      distributionReport.dialogs.scanLahanUmum.photo.preview
                    "
                    class="my-2 mb-4 rounded-xl cursor-pointer"
                    id="photo1"
                    @click="
                      showLightbox(
                        distributionReport.dialogs.scanLahanUmum.photo.preview
                      )
                    "
                  ></v-img
                ></v-card>
              </v-col>
            </v-row>

            <!-- Snackbar -->
            <v-snackbar
              v-model="distributionReport.dialogs.scanLahanUmum.scan.alert.show"
              :color="distributionReport.dialogs.scanLahanUmum.scan.alert.color"
              :timeout="5000"
              rounded="xl"
            >
              <div class="d-flex justify-between">
                <p class="mb-0">
                  {{ distributionReport.dialogs.scanLahanUmum.scan.alert.text }}
                </p>
                <v-spacer></v-spacer>
                <!-- <v-icon small class="pl-1" @click="snackbar.show = false">mdi-close-circle</v-icon> -->
              </div>
            </v-snackbar>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-divider class="mx-2"></v-divider>
          <v-btn
            color="green white--text"
            rounded
            class="pr-3"
            :disabled="
              distributionReport.dialogs.scanLahanUmum.scan.scanned.length ==
                0 || distributionReport.dialogs.scanLahanUmum.loading
            "
            @click="saveScannedDistribution"
          >
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            Save
          </v-btn>
          <v-divider class="mx-2"></v-divider>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END: MODAL -->

    <!-- MAIN Ditribution -->
    <v-container fluid>
      <!-- Other Menus -->
      <v-card
        rounded="xl"
        class="mb-2 d-flex align-center flex-lg-row flex-column py-2"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <v-divider class="mx-2"></v-divider>
        <v-btn
          rounded
          class="mr-2"
          color="green white--text"
          @click="$router.push('LihatTanggalDistribusi')"
        >
          <v-icon class="mr-1">mdi-eye-outline</v-icon>
          Lihat Detail Tanggal Distribusi</v-btn
        >
      </v-card>
      <!-- General Settings -->
      <v-card
        rounded="xl"
        class="mb-2 d-flex align-center flex-lg-row flex-column py-2"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <v-divider class="mx-2"></v-divider>
        <!-- Program Year -->
        <v-select
          color="success"
          item-color="success"
          v-model="generalSettings.programYear"
          :items="['2021', '2022', '2023']"
          :disabled="
            generalSettings.nursery.disabled ||
            calendar.loading ||
            packingLabel.tables.byLahan.loading ||
            packingLabel.loading ||
            loadingLine.loading ||
            loadingLine.table.loading
          "
          outlined
          dense
          hide-details
          :menu-props="{
            bottom: true,
            offsetY: true,
            rounded: 'xl',
            transition: 'slide-y-transition',
          }"
          rounded
          label="Program Year"
          class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
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
          :menu-props="{
            bottom: true,
            offsetY: true,
            rounded: 'xl',
            transition: 'slide-y-transition',
          }"
          rounded
          label="Nursery"
          class="mx-auto mx-lg-2 ml-lg-1 mb-2 mb-lg-0"
          style="max-width: 200px"
          :disabled="
            generalSettings.nursery.disabled ||
            calendar.loading ||
            packingLabel.tables.byLahan.loading ||
            packingLabel.loading ||
            loadingLine.loading ||
            loadingLine.table.loading
          "
        ></v-select>
        <!-- Tipe -->
        <!-- <v-select
                    color="success"
                    item-color="success"
                    v-model="generalSettings.type.model"
                    :items="generalSettings.type.options"
                    outlined
                    dense
                    hide-details
                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                    rounded
                    label="Land Program"
                    class="mx-auto mx-lg-2 ml-lg-1 mb-2 mb-lg-0"
                    style="max-width: 200px"
                    :disabled="generalSettings.type.disabled || calendar.loading || packingLabel.tables.byLahan.loading || packingLabel.loading || loadingLine.loading || loadingLine.table.loading"
                ></v-select> -->
        <v-divider class="mx-2"></v-divider>
        <v-btn
          rounded
          class="mr-2"
          color="red white--text"
          @click="$router.push('SeedlingChangeRequest')"
          ><v-icon class="mr-1">mdi-stack-exchange</v-icon> Seedling Change
          Request</v-btn
        >
      </v-card>
      <!-- Expansions Panels -->
      <v-expansion-panels
        multiple
        v-model="expansions.model"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <!-- Calendar Section -->
        <v-expansion-panel v-if="accessModul.calendar" class="rounded-xl">
          <v-expansion-panel-header>
            <h3 class="dark--text">
              <v-icon class="mr-1">mdi-calendar</v-icon>Kalender Distribusi
            </h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <!-- loading overlay -->
            <v-overlay
              :value="calendar.loading"
              absolute
              class="rounded-xl"
              color="white"
            >
              <div class="d-flex flex-column align-center justify-center">
                <v-progress-circular
                  indeterminate
                  color="green"
                  size="123"
                  width="7"
                ></v-progress-circular>
                <p
                  class="mt-2 mb-0 green--text white rounded-xl px-2 py-1 text-center"
                >
                  Getting distribution datas in
                  <strong>{{ generalSettings.nursery.model }}</strong>
                  Nursery...
                </p>
              </div>
            </v-overlay>
            <v-row class="">
              <v-spacer></v-spacer>
              <!-- set calendar monthly -->
              <v-btn
                v-if="this.calendar.type != 'month'"
                dark
                @click="setCalendarTypeMonthly"
                color="success"
                rounded
                small
                class="mr-4"
              >
                <v-icon small class="mr-1">mdi-calendar-multiselect</v-icon>
                Kalender Per Bulan
              </v-btn>
              <!-- Refresh Button -->
              <v-btn
                dark
                @click="
                  calendarUpdateRange({
                    start: $refs.calendar.renderProps.start,
                    end: $refs.calendar.renderProps.end,
                  })
                "
                color="info"
                rounded
                small
              >
                <v-icon small class="mr-1">mdi-</v-icon> Refresh
              </v-btn>
              <v-spacer></v-spacer>
            </v-row>
            <v-row class="mb-1 align-center">
              <v-divider class="mx-2"></v-divider>
              <v-btn
                fab
                text
                small
                color="green white--text"
                @click="calendarPrev"
              >
                <v-icon> mdi-chevron-left-circle </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-btn
                fab
                text
                small
                color="green white--text"
                @click="calendarNext"
              >
                <v-icon> mdi-chevron-right-circle </v-icon>
              </v-btn>
              <v-divider class="mx-2"></v-divider>
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
                @click:more="calendarGetMoreEvent"
                @click:event="calendarShowEvent"
                @change="calendarUpdateRange"
              >
                <!-- <template v-slot:day-label="{day}">
                                    {{ day }}
                                </template> -->
                <template v-slot:event="{ event }">
                  <h4
                    class="mx-1 text-center"
                    v-if="generalSettings.type.model == 'Petani'"
                  >
                    <v-icon v-if="event.color == 'green'" dark small
                      >mdi-check-circle</v-icon
                    >
                    <v-icon v-else-if="event.color == 'red'" dark small
                      >mdi-close-circle</v-icon
                    >
                    {{ event.name }} ~ {{ event.total_ff }} FF
                  </h4>
                  <h4
                    class="mx-1 text-center"
                    v-else-if="generalSettings.type.model == 'Umum'"
                  >
                    <v-icon v-if="event.color == 'green'" dark small
                      >mdi-check-circle</v-icon
                    >
                    <v-icon v-else-if="event.color == 'red'" dark small
                      >mdi-close-circle</v-icon
                    >
                    <v-icon v-else-if="event.color == 'blue'" dark small
                      >mdi-help-circle</v-icon
                    >
                    {{ event.name == "Tidak Ada" ? "Unallocated" : event.name }}
                    ~ {{ event.total_ff }} PIC
                  </h4>
                </template>
              </v-calendar>
              <v-menu
                v-if="generalSettings.type.model == 'Petani'"
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
                    :dark="
                      calendar.selectedEvent.color == 'yellow' ? false : true
                    "
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
                          <td>
                            {{
                              dateFormat(
                                calendar.selectedEvent.start,
                                "dddd, DD MMMM Y"
                              )
                            }}
                          </td>
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
                                  @click="
                                    calendarShowDetailTotalBibit(
                                      calendar.selectedEvent,
                                      'nursery',
                                      'sostam'
                                    )
                                  "
                                >
                                  {{
                                    numberFormat(
                                      calendar.selectedEvent.total_bibit_sostam
                                    )
                                  }}
                                  Bibit
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
                                  @click="
                                    calendarShowDetailTotalBibit(
                                      calendar.selectedEvent,
                                      'nursery',
                                      'penlub'
                                    )
                                  "
                                >
                                  {{
                                    numberFormat(
                                      calendar.selectedEvent.total_bibit_penlub
                                    )
                                  }}
                                  Bibit
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
                      <template v-slot:item.no="{ index }">
                        {{ index + 1 }}
                      </template>
                      <!-- Total Bibit Sostam Column -->
                      <template v-slot:item.total_bibit_sostam="{ item }">
                        {{ numberFormat(item.total_bibit_sostam) }} Bibit
                      </template>
                      <!-- Progress Penlub Column -->
                      <template v-slot:item.progress_penlub="{ item }">
                        <v-chip
                          :color="`${
                            item.progress_penlub == 100
                              ? 'green'
                              : item.progress_penlub > 0
                              ? 'orange'
                              : 'red'
                          } white--text`"
                        >
                          {{ item.progress_penlub }} %
                        </v-chip>
                      </template>
                      <!-- Total Bibit Penlub Column -->
                      <template v-slot:item.total_bibit_penlub="{ item }">
                        {{ numberFormat(item.total_bibit_penlub) }} Bibit
                      </template>
                      <!-- Action Column -->
                      <template v-slot:item.actions="{ item }">
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
                                block
                                color="blue white--text"
                                rounded
                                @click="calendarShowDetailFFPeriod(item)"
                              >
                                <v-icon class="mr-1">mdi-calendar</v-icon>
                                Period
                              </v-btn>
                            </v-list-item>
                            <v-list-item>
                              <v-btn
                                block
                                color="green white--text"
                                rounded
                                @click="
                                  calendarShowDetailTotalBibit(
                                    item,
                                    'ff',
                                    'sostam'
                                  )
                                "
                              >
                                <v-icon class="mr-1">mdi-seed</v-icon>
                                Sostam Seeds
                              </v-btn>
                            </v-list-item>
                            <v-list-item>
                              <v-btn
                                block
                                color="green white--text"
                                rounded
                                @click="
                                  calendarShowDetailTotalBibit(
                                    item,
                                    'ff',
                                    'penlub'
                                  )
                                "
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
              <v-menu
                v-else-if="generalSettings.type.model == 'Umum'"
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
                    :dark="
                      calendar.selectedEvent.color == 'yellow' ? false : true
                    "
                  >
                    <v-btn icon>
                      <v-icon>mdi-calendar</v-icon>
                    </v-btn>
                    <v-toolbar-title>
                      <strong>{{
                        calendar.selectedEvent.name === "Tidak Ada"
                          ? "Unallocated"
                          : calendar.selectedEvent.name
                      }}</strong>
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
                          <td>
                            {{
                              dateFormat(
                                calendar.selectedEvent.start,
                                "dddd, DD MMMM Y"
                              )
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Total Bibit Lahan</td>
                          <td>:</td>
                          <td>
                            <v-tooltip top>
                              Click for preview detailed seed
                              <template v-slot:activator="{ on, attrs }">
                                <strong
                                  v-bind="attrs"
                                  v-on="on"
                                  class="cursor-pointer"
                                  @click="
                                    calendarShowDetailTotalBibitLahanUmum(
                                      calendar.selectedEvent,
                                      'nursery',
                                      'lahan'
                                    )
                                  "
                                >
                                  {{
                                    numberFormat(
                                      calendar.selectedEvent.total_bibit_sostam
                                    )
                                  }}
                                  Bibit
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
                                  @click="
                                    calendarShowDetailTotalBibitLahanUmum(
                                      calendar.selectedEvent,
                                      'nursery',
                                      'penlub'
                                    )
                                  "
                                >
                                  {{
                                    numberFormat(
                                      calendar.selectedEvent.total_bibit_penlub
                                    )
                                  }}
                                  Bibit
                                </strong>
                              </template>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td>:</td>
                          <td>{{ calendar.selectedEvent.total_ff }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                    <v-data-table
                      hide-default-footer
                      :items-per-page="-1"
                      :headers="calendar.table2.headers"
                      :items="calendar.selectedEvent.details"
                      dense
                    >
                      <!-- No Column -->
                      <template v-slot:item.no="{ index }">
                        {{ index + 1 }}
                      </template>
                      <!-- Total Bibit Sostam Column -->
                      <template v-slot:item.total_bibit_lahan="{ item }">
                        {{ numberFormat(item.total_bibit_lahan) }} Bibit
                      </template>
                      <!-- Total Bibit Penlub Column -->
                      <template v-slot:item.total_bibit_penlub="{ item }">
                        {{ numberFormat(item.total_bibit_penlub) }} Bibit
                      </template>
                      <!-- Action Column -->
                      <template v-slot:item.actions="{ item }">
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
                                block
                                color="blue white--text"
                                rounded
                                @click="calendarShowDetailLahanUmumPeriod(item)"
                              >
                                <v-icon class="mr-1">mdi-calendar</v-icon>
                                Nursery & Period
                              </v-btn>
                            </v-list-item>
                            <v-list-item>
                              <v-btn
                                block
                                color="green white--text"
                                rounded
                                @click="
                                  calendarShowDetailTotalBibitLahanUmum(
                                    item,
                                    'mou_no',
                                    'lahan'
                                  )
                                "
                              >
                                <v-icon class="mr-1">mdi-seed</v-icon>
                                Lahan Seeds
                              </v-btn>
                            </v-list-item>
                            <v-list-item>
                              <v-btn
                                block
                                color="green white--text"
                                rounded
                                @click="
                                  calendarShowDetailTotalBibitLahanUmum(
                                    item,
                                    'mou_no',
                                    'penlub'
                                  )
                                "
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

        <!-- Nursery Calendar Section -->
        <v-expansion-panel
          v-if="false && accessModul.calendar"
          class="rounded-xl"
        >
          <v-expansion-panel-header>
            <h3 class="dark--text">
              <v-icon class="mr-1">mdi-calendar</v-icon>Kalender Distribusi
              Nursery
            </h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <!-- loading overlay -->
            <v-overlay
              :value="calendar.nurseryLoading"
              absolute
              class="rounded-xl"
              color="white"
            >
              <div class="d-flex flex-column align-center justify-center">
                <v-progress-circular
                  indeterminate
                  color="green"
                  size="123"
                  width="7"
                ></v-progress-circular>
                <p
                  class="mt-2 mb-0 green--text white rounded-xl px-2 py-1 text-center"
                >
                  Getting distribution datas in
                  <strong>{{ generalSettings.nursery.model }}</strong>
                  Nursery...
                </p>
              </div>
            </v-overlay>
            <v-row class="">
              <v-spacer></v-spacer>
              <!-- set calendar monthly -->
              <v-btn
                v-if="this.calendar.type != 'month'"
                dark
                @click="setCalendarTypeMonthly"
                color="success"
                rounded
                small
                class="mr-4"
              >
                <v-icon small class="mr-1">mdi-calendar-multiselect</v-icon>
                Kalender Per Bulan
              </v-btn>
              <!-- Refresh Button -->
              <v-btn
                dark
                @click="
                  calendarUpdateRangeNew({
                    start: $refs.calendar.renderProps.start,
                    end: $refs.calendar.renderProps.end,
                  })
                "
                color="info"
                rounded
                small
              >
                <v-icon small class="mr-1">mdi-</v-icon> Refresh
              </v-btn>
              <v-spacer></v-spacer>
            </v-row>
            <v-row class="mb-1 align-center">
              <v-divider class="mx-2"></v-divider>
              <v-btn
                fab
                text
                small
                color="green white--text"
                @click="calendarPrev"
              >
                <v-icon> mdi-chevron-left-circle </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-btn
                fab
                text
                small
                color="green white--text"
                @click="calendarNext"
              >
                <v-icon> mdi-chevron-right-circle </v-icon>
              </v-btn>
              <v-divider class="mx-2"></v-divider>
            </v-row>
            <v-sheet height="750">
              <v-calendar
                ref="calendar"
                v-model="calendar.nurseryFocus"
                color="green"
                :start="calendar.nurseryRange[0]"
                :end="calendar.nurseryRange[1]"
                show-week
                class="rounded-xl overflow-hidden"
                :event-margin-bottom="5"
                :events="calendar.nurseryEvents"
                :event-color="calendarGetEventColor"
                :event-text-color="calendarGetEventTextColor"
                :type="calendar.type"
                @click:more="calendarGetMoreEvent"
                @click:event="calendarShowEvent"
                @change="calendarUpdateRangeNew"
              >
                <!-- <template v-slot:day-label="{day}">
                                    {{ day }}
                                </template> -->
                <template v-slot:event="{ event }">
                  <h4
                    class="mx-1 text-center"
                    v-if="generalSettings.type.model == 'Petani'"
                  >
                    <v-icon v-if="event.color == 'green'" dark small
                      >mdi-check-circle</v-icon
                    >
                    <v-icon v-else-if="event.color == 'red'" dark small
                      >mdi-close-circle</v-icon
                    >
                    {{ event.name }} ~ {{ event.total_ff }} FF
                  </h4>
                  <h4
                    class="mx-1 text-center"
                    v-else-if="generalSettings.type.model == 'Umum'"
                  >
                    <v-icon v-if="event.color == 'green'" dark small
                      >mdi-check-circle</v-icon
                    >
                    <v-icon v-else-if="event.color == 'red'" dark small
                      >mdi-close-circle</v-icon
                    >
                    <v-icon v-else-if="event.color == 'blue'" dark small
                      >mdi-help-circle</v-icon
                    >
                    {{ event.name == "Tidak Ada" ? "Unallocated" : event.name }}
                    ~ {{ event.total_ff }} PIC
                  </h4>
                </template>
              </v-calendar>
              <v-menu
                v-if="generalSettings.type.model == 'Petani'"
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
                    :dark="
                      calendar.selectedEvent.color == 'yellow' ? false : true
                    "
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
                          <td>
                            {{
                              dateFormat(
                                calendar.selectedEvent.start,
                                "dddd, DD MMMM Y"
                              )
                            }}
                          </td>
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
                                  @click="
                                    calendarShowDetailTotalBibit(
                                      calendar.selectedEvent,
                                      'nursery',
                                      'sostam'
                                    )
                                  "
                                >
                                  {{
                                    numberFormat(
                                      calendar.selectedEvent.total_bibit_sostam
                                    )
                                  }}
                                  Bibit
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
                                  @click="
                                    calendarShowDetailTotalBibit(
                                      calendar.selectedEvent,
                                      'nursery',
                                      'penlub'
                                    )
                                  "
                                >
                                  {{
                                    numberFormat(
                                      calendar.selectedEvent.total_bibit_penlub
                                    )
                                  }}
                                  Bibit
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
                      <template v-slot:item.no="{ index }">
                        {{ index + 1 }}
                      </template>
                      <!-- Total Bibit Sostam Column -->
                      <template v-slot:item.total_bibit_sostam="{ item }">
                        {{ numberFormat(item.total_bibit_sostam) }} Bibit
                      </template>
                      <!-- Progress Penlub Column -->
                      <template v-slot:item.progress_penlub="{ item }">
                        <v-chip
                          :color="`${
                            item.progress_penlub == 100
                              ? 'green'
                              : item.progress_penlub > 0
                              ? 'orange'
                              : 'red'
                          } white--text`"
                        >
                          {{ item.progress_penlub }} %
                        </v-chip>
                      </template>
                      <!-- Total Bibit Penlub Column -->
                      <template v-slot:item.total_bibit_penlub="{ item }">
                        {{ numberFormat(item.total_bibit_penlub) }} Bibit
                      </template>
                      <!-- Action Column -->
                      <template v-slot:item.actions="{ item }">
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
                                block
                                color="blue white--text"
                                rounded
                                @click="calendarShowDetailFFPeriod(item)"
                              >
                                <v-icon class="mr-1">mdi-calendar</v-icon>
                                Period
                              </v-btn>
                            </v-list-item>
                            <v-list-item>
                              <v-btn
                                block
                                color="green white--text"
                                rounded
                                @click="
                                  calendarShowDetailTotalBibit(
                                    item,
                                    'ff',
                                    'sostam'
                                  )
                                "
                              >
                                <v-icon class="mr-1">mdi-seed</v-icon>
                                Sostam Seeds
                              </v-btn>
                            </v-list-item>
                            <v-list-item>
                              <v-btn
                                block
                                color="green white--text"
                                rounded
                                @click="
                                  calendarShowDetailTotalBibit(
                                    item,
                                    'ff',
                                    'penlub'
                                  )
                                "
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
              <v-menu
                v-else-if="generalSettings.type.model == 'Umum'"
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
                    :dark="
                      calendar.selectedEvent.color == 'yellow' ? false : true
                    "
                  >
                    <v-btn icon>
                      <v-icon>mdi-calendar</v-icon>
                    </v-btn>
                    <v-toolbar-title>
                      <strong>{{
                        calendar.selectedEvent.name === "Tidak Ada"
                          ? "Unallocated"
                          : calendar.selectedEvent.name
                      }}</strong>
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
                          <td>
                            {{
                              dateFormat(
                                calendar.selectedEvent.start,
                                "dddd, DD MMMM Y"
                              )
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Total Bibit Lahan</td>
                          <td>:</td>
                          <td>
                            <v-tooltip top>
                              Click for preview detailed seed
                              <template v-slot:activator="{ on, attrs }">
                                <strong
                                  v-bind="attrs"
                                  v-on="on"
                                  class="cursor-pointer"
                                  @click="
                                    calendarShowDetailTotalBibitLahanUmum(
                                      calendar.selectedEvent,
                                      'nursery',
                                      'lahan'
                                    )
                                  "
                                >
                                  {{
                                    numberFormat(
                                      calendar.selectedEvent.total_bibit_sostam
                                    )
                                  }}
                                  Bibit
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
                                  @click="
                                    calendarShowDetailTotalBibitLahanUmum(
                                      calendar.selectedEvent,
                                      'nursery',
                                      'penlub'
                                    )
                                  "
                                >
                                  {{
                                    numberFormat(
                                      calendar.selectedEvent.total_bibit_penlub
                                    )
                                  }}
                                  Bibit
                                </strong>
                              </template>
                            </v-tooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td>:</td>
                          <td>{{ calendar.selectedEvent.total_ff }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                    <v-data-table
                      hide-default-footer
                      :items-per-page="-1"
                      :headers="calendar.table2.headers"
                      :items="calendar.selectedEvent.details"
                      dense
                    >
                      <!-- No Column -->
                      <template v-slot:item.no="{ index }">
                        {{ index + 1 }}
                      </template>
                      <!-- Total Bibit Sostam Column -->
                      <template v-slot:item.total_bibit_lahan="{ item }">
                        {{ numberFormat(item.total_bibit_lahan) }} Bibit
                      </template>
                      <!-- Total Bibit Penlub Column -->
                      <template v-slot:item.total_bibit_penlub="{ item }">
                        {{ numberFormat(item.total_bibit_penlub) }} Bibit
                      </template>
                      <!-- Action Column -->
                      <template v-slot:item.actions="{ item }">
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
                                block
                                color="blue white--text"
                                rounded
                                @click="calendarShowDetailLahanUmumPeriod(item)"
                              >
                                <v-icon class="mr-1">mdi-calendar</v-icon>
                                Nursery & Period
                              </v-btn>
                            </v-list-item>
                            <v-list-item>
                              <v-btn
                                block
                                color="green white--text"
                                rounded
                                @click="
                                  calendarShowDetailTotalBibitLahanUmum(
                                    item,
                                    'mou_no',
                                    'lahan'
                                  )
                                "
                              >
                                <v-icon class="mr-1">mdi-seed</v-icon>
                                Lahan Seeds
                              </v-btn>
                            </v-list-item>
                            <v-list-item>
                              <v-btn
                                block
                                color="green white--text"
                                rounded
                                @click="
                                  calendarShowDetailTotalBibitLahanUmum(
                                    item,
                                    'mou_no',
                                    'penlub'
                                  )
                                "
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

        <!-- Print Label & Receipt Section -->
        <v-expansion-panel
          v-if="false && accessModul.packingLabel"
          class="rounded-xl"
        >
          <v-expansion-panel-header>
            <h3 class="dark--text">
              <v-icon class="mr-1">mdi-printer</v-icon> Print Label & Receipt
            </h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <!-- loading overlay -->
            <v-overlay
              :value="packingLabel.loading"
              absolute
              class="rounded-xl"
              color="white"
            >
              <div class="d-flex flex-column align-center justify-center">
                <v-progress-circular
                  indeterminate
                  color="green"
                  size="100"
                  width="7"
                ></v-progress-circular>
                <p
                  v-if="packingLabel.loadingText"
                  class="mt-2 mb-0 green--text white rounded-xl px-2 py-1 text-center"
                >
                  {{ packingLabel.loadingText }}
                </p>
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
                      :footer-props="{ itemsPerPageOptions: [10, 25, 40, -1] }"
                      :headers="
                        generalSettings.type.model == 'Petani'
                          ? packingLabel.tables.byLahan.headers
                          : packingLabel.tables.byLahan.headers2
                      "
                      :items="packingLabel.tables.byLahan.items"
                      :loading="packingLabel.tables.byLahan.loading"
                      :search="packingLabel.tables.byLahan.search.model"
                      multi-sort
                    >
                      <!-- Filter Table -->
                      <template v-slot:top>
                        <v-row class="mx-0 my-2 align-center">
                          <!-- Distribution Date Filter Field -->
                          <v-menu
                            rounded="xl"
                            transition="slide-x-transition"
                            bottom
                            min-width="100"
                            offset-y
                            :close-on-content-click="true"
                            v-model="packingLabel.datePicker.show"
                          >
                            <template v-slot:activator="{ on: menu, attrs }">
                              <v-tooltip top>
                                <template v-slot:activator="{ on: tooltip }">
                                  <v-text-field
                                    dense
                                    color="green"
                                    class="mb-2 mb-lg-0 mr-0 mr-lg-2"
                                    hide-details
                                    outlined
                                    label="Distribution Date"
                                    rounded
                                    v-bind="attrs"
                                    v-on="{ ...menu, ...tooltip }"
                                    readonly
                                    v-model="packingLabel.datePicker.modelShow"
                                    style="max-width: 250px"
                                  ></v-text-field>
                                </template>
                                <span>Klik untuk memunculkan datepicker</span>
                              </v-tooltip>
                            </template>
                            <div class="rounded-xl pb-2 white">
                              <v-overlay
                                :value="packingLabel.datePicker.loading"
                              >
                                <div
                                  class="d-flex flex-column align-center justify-center"
                                >
                                  <v-progress-circular
                                    indeterminate
                                    color="white"
                                    size="64"
                                  ></v-progress-circular>
                                  <p class="mt-2 mb-0">
                                    Updating available dates...
                                  </p>
                                </div>
                              </v-overlay>
                              <div
                                class="d-flex flex-column align-center rounded-xl"
                              >
                                <v-date-picker
                                  color="green lighten-1 rounded-xl"
                                  v-model="packingLabel.datePicker.model"
                                  min="2022-11-24"
                                ></v-date-picker>
                              </div>
                            </div>
                          </v-menu>
                          <!-- Search Field -->
                          <v-autocomplete
                            v-if="generalSettings.type.model == 'Petani'"
                            hide-details
                            dense
                            rounded
                            outlined
                            color="green"
                            item-color="green"
                            :menu-props="{
                              bottom: true,
                              offsetY: true,
                              rounded: 'xl',
                              transition: 'slide-y-transition',
                            }"
                            clearable
                            class="mb-2 mb-lg-0"
                            label="Search FF"
                            placeholder="Search by Field Facilitator name"
                            append-icon="mdi-magnify"
                            :items="packingLabel.tables.byLahan.search.items"
                            v-model="packingLabel.tables.byLahan.search.model"
                            style="max-width: 350px"
                          ></v-autocomplete>
                          <v-divider class="mx-2"></v-divider>
                          <!-- Refresh Button -->
                          <v-btn
                            dark
                            @click="getPackingLabelTableData()"
                            color="info"
                            rounded
                            small
                          >
                            <v-icon small class="mr-1">mdi-refresh</v-icon>
                            Refresh
                          </v-btn>
                        </v-row>
                      </template>
                      <!-- Nama FF Column -->
                      <template v-slot:item.nama_ff="{ item }">
                        <p class="ma-0" style="max-width: 150px">
                          {{ item.nama_ff }}
                        </p>
                      </template>
                      <!-- Nama Petani Column -->
                      <template v-slot:item.nama_petani="{ item }">
                        <p class="ma-0" style="max-width: 150px">
                          {{ item.nama_petani }}
                        </p>
                      </template>
                      <!-- Total Lubang Column -->
                      <template v-slot:item.total_holes="{ item }">
                        <v-icon>mdi-pi-hole</v-icon>
                        {{ numberFormat(item.total_holes) }}
                      </template>
                      <!-- Total Bibit Column -->
                      <template v-slot:item.total_bibit="{ item }">
                        <v-icon
                          :color="`${
                            item.total_holes >= item.total_bibit
                              ? 'green'
                              : 'red'
                          }`"
                          >mdi-sprout</v-icon
                        >
                        {{ numberFormat(item.total_bibit) }}
                      </template>
                      <!-- Check Column -->
                      <template v-slot:item.is_checked="{ item }">
                        <v-checkbox
                          v-if="item.total_holes >= item.total_bibit"
                          v-model="item.is_checked"
                          @click="confirmationShow('Check Label', item)"
                          readonly
                          :background-color="`${
                            item.is_checked ? 'green' : 'grey darken-1'
                          } rounded-xl px-2 pr-3 py-1`"
                          dark
                          color="white"
                          class="mt-0 d-inline-block"
                          hide-details
                          :label="`${item.is_checked ? 'Printed' : 'Nope'}`"
                          off-icon="mdi-printer-off"
                          on-icon="mdi-printer-check"
                        ></v-checkbox>
                        <v-btn
                          v-else
                          color="red white--text"
                          fab
                          small
                          @click="confirmationShow('Alert Penlub', item)"
                        >
                          <v-icon>mdi-pi-hole</v-icon>
                        </v-btn>
                      </template>
                      <!-- Actions Column -->
                      <template v-slot:item.actions="{ item }">
                        <v-row class="justify-end ma-0">
                          <v-btn
                            small
                            rounded
                            color="green white--text"
                            class="ma-1 d-none d-lg-inline-block"
                            @click="
                              printPackingLabelByLahan(
                                `label${
                                  generalSettings.type.model == 'Umum'
                                    ? '_lahan_umum'
                                    : ''
                                }`,
                                generalSettings.type.model == 'Petani'
                                  ? item.ph_form_no
                                  : item.lahan_no
                              )
                            "
                            :disabled="item.total_holes < item.total_bibit"
                          >
                            <v-icon class="mr-1">mdi-label</v-icon>
                            Label
                          </v-btn>
                          <v-btn
                            fab
                            small
                            color="green white--text"
                            class="d-inline-block d-lg-none ma-1"
                            @click="
                              printPackingLabelByLahan(
                                `label${
                                  generalSettings.type.model == 'Umum'
                                    ? '_lahan_umum'
                                    : ''
                                }`,
                                generalSettings.type.model == 'Petani'
                                  ? item.ph_form_no
                                  : item.lahan_no
                              )
                            "
                            :disabled="item.total_holes < item.total_bibit"
                          >
                            <v-icon>mdi-label</v-icon>
                          </v-btn>
                          <v-btn
                            small
                            rounded
                            color="orange white--text"
                            class="ma-1 d-none d-lg-inline-block mr-0"
                            @click="
                              printPackingLabelByLahan(
                                `tanda_terima${
                                  generalSettings.type.model == 'Umum'
                                    ? '_lahan_umum'
                                    : ''
                                }`,
                                generalSettings.type.model == 'Petani'
                                  ? item.ph_form_no
                                  : item.lahan_no
                              )
                            "
                            :disabled="item.total_holes < item.total_bibit"
                          >
                            <v-icon class="mr-1">mdi-receipt-text</v-icon>
                            Receipt
                          </v-btn>
                          <v-btn
                            fab
                            small
                            color="orange white--text"
                            class="d-inline-block d-lg-none ma-1 mr-0"
                            @click="
                              printPackingLabelByLahan(
                                `tanda_terima${
                                  generalSettings.type.model == 'Umum'
                                    ? '_lahan_umum'
                                    : ''
                                }`,
                                generalSettings.type.model == 'Petani'
                                  ? item.ph_form_no
                                  : item.lahan_no
                              )
                            "
                            :disabled="item.total_holes < item.total_bibit"
                          >
                            <v-icon>mdi-receipt-text</v-icon>
                          </v-btn>
                        </v-row>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                  <!-- Packing Label Table 2 ~ Per FF -->
                  <v-tab-item>
                    <v-data-table></v-data-table>
                  </v-tab-item>
                </v-tabs-items>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- Loading Line Section -->
        <v-expansion-panel
          v-if="false && accessModul.loadingLine"
          class="rounded-xl"
        >
          <v-expansion-panel-header>
            <h3 class="dark--text">
              <v-icon class="mr-1">mdi-human-dolly</v-icon> Loading Line
            </h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <!-- loading overlay -->
            <v-overlay
              :value="loadingLine.loading"
              absolute
              class="rounded-xl"
              color="white"
            >
              <div class="d-flex flex-column align-center justify-center">
                <v-progress-circular
                  indeterminate
                  color="green"
                  size="100"
                  width="7"
                ></v-progress-circular>
                <p
                  v-if="loadingLine.loadingText"
                  class="mt-2 mb-0 green--text white rounded-xl px-2 py-1 text-center"
                >
                  {{ loadingLine.loadingText }}
                </p>
              </div>
            </v-overlay>
            <v-row>
              <!-- Select Date Input -->
              <v-col cols="12">
                <v-row class="ma-2 mb-0 align-center">
                  <!-- Distribution Date Filter Field -->
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
                            class="mb-2 mb-lg-0"
                            hide-details
                            outlined
                            label="Distribution Date"
                            rounded
                            v-bind="attrs"
                            v-on="{ ...menu, ...tooltip }"
                            readonly
                            v-model="loadingLine.datePicker.modelShow"
                            style="max-width: 250px"
                          ></v-text-field>
                        </template>
                        <span>Klik untuk memunculkan datepicker</span>
                      </v-tooltip>
                    </template>
                    <div class="rounded-xl pb-2 white">
                      <v-overlay :value="loadingLine.datePicker.loading">
                        <div
                          class="d-flex flex-column align-center justify-center"
                        >
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
                        ></v-date-picker>
                      </div>
                    </div>
                  </v-menu>
                  <v-divider class="mx-2"></v-divider>
                  <!-- Refresh Button -->
                  <v-btn
                    dark
                    @click="getLoadinglineTableData()"
                    color="info"
                    rounded
                    small
                  >
                    <v-icon small class="mr-1">mdi-refresh</v-icon> Refresh
                  </v-btn>
                </v-row>
              </v-col>
              <!-- Loading Line Table -->
              <v-col cols="12">
                <v-data-table
                  :headers="
                    loadingLine.table[
                      generalSettings.type.model == 'Petani'
                        ? 'headers'
                        : 'headers2'
                    ]
                  "
                  :items="loadingLine.table.items"
                  :loading="loadingLine.table.loading"
                  multi-sort
                >
                  <!-- Check Column -->
                  <template v-slot:item.is_loaded="{ item }">
                    <v-checkbox
                      v-model="item.is_loaded"
                      readonly
                      :background-color="`${
                        item.is_loaded ? 'green' : 'grey darken-1'
                      } rounded-xl px-3 py-1`"
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
                  <template v-slot:item.printed_progress="{ item }">
                    {{ `${item.ph_printed}/${item.ph_all}` }}
                    <v-chip
                      :color="`${
                        item.printed_progress == 100
                          ? 'green'
                          : item.printed_progress >= 50
                          ? 'orange'
                          : 'red'
                      } white--text`"
                      class="ml-1"
                    >
                      <v-icon
                        v-if="item.printed_progress == 100"
                        color="white"
                        class="mr-1"
                        >mdi-printer-check</v-icon
                      >
                      <v-icon
                        v-else-if="item.printed_progress > 0"
                        color="white"
                        class="mr-1"
                        >mdi-printer</v-icon
                      >
                      <v-icon v-else color="white" class="mr-1"
                        >mdi-printer-off</v-icon
                      >
                      {{ item.printed_progress }}%
                    </v-chip>
                  </template>
                  <!-- Seeds Total Column -->
                  <template v-slot:item.total_tree_amount="{ item }">
                    {{ numberFormat(item.total_tree_amount) }}
                  </template>
                  <!-- Bags Total Column -->
                  <template v-slot:item.total_bags="{ item }">
                    {{ numberFormat(item.total_bags) }}
                  </template>
                  <!-- Actions Column -->
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      rounded
                      :disabled="item.printed_progress != 100"
                      color="blue white--text"
                      @click="
                        getLoadingLineDetailFFData(item.ff_no || item.mou_no)
                      "
                    >
                      <v-icon class="mr-1">mdi-qrcode-plus</v-icon>
                      Scan Label
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- Distribution Report Section -->
        <!-- <v-expansion-panel v-if="accessModul.distributionReport" class="rounded-xl">
                    <v-expansion-panel-header>
                        <h3 class="dark--text"><v-icon class="mr-1">mdi-notebook-check</v-icon> Distribution Report</h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        
                        <v-overlay :value="distributionReport.loading" absolute class="rounded-xl" color="white">
                            <div class="d-flex flex-column align-center justify-center">
                                <v-progress-circular
                                    indeterminate
                                    color="green"
                                    size="100"
                                    width="7"
                                ></v-progress-circular>
                                <p v-if="distributionReport.loadingText" class="mt-2 mb-0 green--text white rounded-xl px-2 py-1 text-center">{{ distributionReport.loadingText }}</p>
                            </div>
                        </v-overlay>
                        <v-row>
                            <v-col cols="12">
                                <v-data-table
                                    multi-sort
                                    :headers="distributionReport.table.headers3"
                                    :items="distributionReport.table.NurseryItems"
                                    :loading="distributionReport.table.loading"
                                    :options.sync="distributionReport.table.options"
                                    :page="distributionReport.table.page"
                                    :server-items-length="distributionReport.table.totalDatas"
                                    :footer-props="{
                                        itemsPerPageOptions: [10, 25, 50, 100]
                                    }"
                                >
                                    
                                    <template v-slot:top>
                                        <v-row class="ma-2 mb-0 align-center">
                                            <v-menu 
                                                rounded="xl"
                                                transition="slide-x-transition"
                                                bottom
                                                min-width="100"
                                                offset-y
                                                :close-on-content-click="true"
                                                v-model="distributionReport.datePicker.show"
                                                :disabled="distributionReport.table.loading"
                                            >
                                                <template v-slot:activator="{ on: menu, attrs }">
                                                    <v-tooltip top>
                                                        <template v-slot:activator="{ on: tooltip }">
                                                            <v-text-field
                                                                dense
                                                                color="green"
                                                                class="mb-2 mb-lg-0"
                                                                hide-details
                                                                outlined
                                                                label="Distribution Date"
                                                                rounded
                                                                v-bind="attrs"
                                                                v-on="{...menu, ...tooltip}"
                                                                readonly
                                                                v-model="distributionReport.datePicker.modelShow"
                                                                style="max-width: 250px"
                                                            ></v-text-field>
                                                        </template>
                                                        <span>Klik untuk memunculkan datepicker</span>
                                                    </v-tooltip>
                                                </template>
                                                <div class="rounded-xl pb-2 white">
                                                    <v-overlay :value="distributionReport.datePicker.loading">
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
                                                            v-model="distributionReport.datePicker.model"
                                                            min="2022-11-24"
                                                        ></v-date-picker>
                                                    </div>
                                                </div>
                                            </v-menu>
                                            <v-divider class="mx-2"></v-divider>
                                            
                                            <v-col cols="12" lg="6" class="d-flex">
                                                <v-select
                                                    color="success"
                                                    item-color="success"
                                                    v-model="distributionReport.table.search.column"
                                                    :items="distributionReport.table.search.options"
                                                    item-value="value"
                                                    item-text="text"
                                                    hide-details
                                                    outlined
                                                    dense
                                                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                                    rounded
                                                    label="Kolom Pencarian"
                                                    class="centered-select"
                                                    style="width: 50%;max-width: 200px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
                                                    ></v-select>
                                                <v-text-field
                                                    color="success"
                                                    item-color="success"
                                                    v-model="distributionReport.table.search.model"
                                                    placeholder="Pencarian..."
                                                    append-icon="mdi-magnify"
                                                    outlined
                                                    dense
                                                    rounded
                                                    label="Pencarian Nama Petani"
                                                    hide-details
                                                    
                                                ></v-text-field>
                                            </v-col>
                                            
                                            <v-btn
                                                readonly
                                                @click="distributionReport.dialogs.exportFilter.show=true"
                                                color="green white--text"
                                                class="mr-1"
                                                :disabled="distributionReport.table.loading"
                                                rounded
                                                small
                                            >
                                                <v-icon small class="mr-1">mdi-microsoft-excel</v-icon> Export
                                            </v-btn>
                                            
                                            <v-btn
                                                readonly
                                                @click="reportNursery()"
                                                color="info white--text"
                                                rounded
                                                small
                                                :disabled="distributionReport.table.loading"
                                            >
                                                <v-icon small class="mr-1">mdi-refresh</v-icon> Refresh
                                            </v-btn>
                                        </v-row>
                                    </template>
                                    
                                    <template v-slot:item.mu_name="{item}">
                                        {{  item.loading_line[0].mu_name }}
                                    </template>
                                    <template v-slot:item.ff_name="{item}">
                                        {{  item.loading_line[0].ff_name }}
                                    </template>
                                    <template v-slot:item.status="{item}">
                                        <v-chip v-if="item.verified_by == null || item.verified_by == ''" color="red white--text" class="pl-1 pr-3"><v-icon class="mr-1">mdi-close-circle</v-icon> Unverified</v-chip>
                                        <v-chip v-else-if="item.verified_by != null || item.verified_by != ''" color="green white--text" class="pl-1 pr-3"><v-icon class="mr-1">mdi-check-circle</v-icon> Verified</v-chip>
                                        
                                    </template>
                                    
                                    <template v-slot:item.sum_all_bags="{item}">
                                        <div class="d-flex align-center justify-content-between">
                                            <div class="d-flex flex-column align-center mr-1 mr-lg-5">
                                                <v-icon>mdi-printer </v-icon> {{ item.sum_all_bags }}
                                            </div>
                                            <div class="d-flex flex-column align-center mx-1 mx-lg-5">
                                                <v-icon>mdi-truck-check </v-icon> {{ item.sum_loaded_bags }}
                                            </div>
                                            <div class="d-flex flex-column align-center ml-1 ml-lg-5">
                                                <v-icon>mdi-basket-check </v-icon> {{ item.sum_distributed_bags }}
                                            </div>
                                        </div>
                                    </template>
                                    
                                    <template v-slot:item.actions="{item}">
                                        <v-btn color="info white--text" class="pl-1 pr-3" small rounded @click="newDetailDistributionReport(item)">
                                            <v-icon class="mr-1">mdi-information</v-icon>
                                            Detail
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel> -->
        <!-- Distribution Report Section -->
        <v-expansion-panel
          v-if="accessModul.distributionReport"
          class="rounded-xl"
        >
          <v-expansion-panel-header>
            <h3 class="dark--text">
              <v-icon class="mr-1">mdi-notebook-check</v-icon> Distribution
              Report
            </h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <!-- loading overlay -->
            <v-overlay
              :value="distributionReport.loading"
              absolute
              class="rounded-xl"
              color="white"
            >
              <div class="d-flex flex-column align-center justify-center">
                <v-progress-circular
                  indeterminate
                  color="green"
                  size="100"
                  width="7"
                ></v-progress-circular>
                <p
                  v-if="distributionReport.loadingText"
                  class="mt-2 mb-0 green--text white rounded-xl px-2 py-1 text-center"
                >
                  {{ distributionReport.loadingText }}
                </p>
              </div>
            </v-overlay>
            <v-row>
              <!-- Distribution Report Table -->
              <!-- geko report data -->
              <!-- :headers="distributionReport.table[generalSettings.type.model == 'Petani' ? 'headers' : 'headers2']" -->
              <v-col cols="12">
                <v-data-table
                  multi-sort
                  :headers="distributionReport.table.headersReportFF"
                  :items="distributionReport.table.NurseryFFItems"
                  :loading="distributionReport.table.loading"
                  :options.sync="distributionReport.table.options"
                  :page="distributionReport.table.page"
                  :server-items-length="distributionReport.table.totalDatas"
                  :expanded.sync="distributionReport.table.expanded"
                  :show-expand="true"
                  single-expand
                  @item-expanded="expandTableReport"
                  :footer-props="{
                    itemsPerPageOptions: [10, 25, 50, 100],
                  }"
                >
                  <!-- Toolbar -->
                  <template v-slot:top>
                    <v-row class="ma-2 mb-0 align-center">
                      <!-- Distribution Date Filter Field -->
                      <v-menu
                        rounded="xl"
                        transition="slide-x-transition"
                        bottom
                        min-width="100"
                        offset-y
                        :close-on-content-click="true"
                        v-model="distributionReport.datePicker.show"
                        :disabled="distributionReport.table.loading"
                      >
                        <template v-slot:activator="{ on: menu, attrs }">
                          <v-tooltip top>
                            <template v-slot:activator="{ on: tooltip }">
                              <v-text-field
                                dense
                                color="green"
                                class="mb-2 mb-lg-0"
                                hide-details
                                outlined
                                label="Distribution Date"
                                rounded
                                v-bind="attrs"
                                v-on="{ ...menu, ...tooltip }"
                                readonly
                                v-model="
                                  distributionReport.datePicker.modelShow
                                "
                                style="max-width: 250px"
                              ></v-text-field>
                            </template>
                            <span>Klik untuk memunculkan datepicker</span>
                          </v-tooltip>
                        </template>
                        <div class="rounded-xl pb-2 white">
                          <v-overlay
                            :value="distributionReport.datePicker.loading"
                          >
                            <div
                              class="d-flex flex-column align-center justify-center"
                            >
                              <v-progress-circular
                                indeterminate
                                color="white"
                                size="64"
                              ></v-progress-circular>
                              <p class="mt-2 mb-0">
                                Updating available dates...
                              </p>
                            </div>
                          </v-overlay>
                          <div
                            class="d-flex flex-column align-center rounded-xl"
                          >
                            <v-date-picker
                              color="green lighten-1 rounded-xl"
                              v-model="distributionReport.datePicker.model"
                              min="2022-11-24"
                            ></v-date-picker>
                          </div>
                        </div>
                      </v-menu>
                      <v-divider class="mx-2"></v-divider>
                      <!-- search -->
                      <!-- <v-col cols="12" lg="6" class="d-flex">
                                                <v-select
                                                    color="success"
                                                    item-color="success"
                                                    v-model="distributionReport.table.search.column"
                                                    :items="distributionReport.table.search.options"
                                                    item-value="value"
                                                    item-text="text"
                                                    hide-details
                                                    outlined
                                                    dense
                                                    :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                                    rounded
                                                    label="Kolom Pencarian"
                                                    class="centered-select"
                                                    style="width: 50%;max-width: 200px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
                                                    ></v-select>
                                                <v-text-field
                                                    color="success"
                                                    item-color="success"
                                                    v-model="distributionReport.table.search.model"
                                                    placeholder="Pencarian..."
                                                    append-icon="mdi-magnify"
                                                    outlined
                                                    dense
                                                    rounded
                                                    label="Pencarian Nama Petani"
                                                    hide-details
                                                    
                                                ></v-text-field>
                                            </v-col> -->
                      <!-- Export Button -->
                      <v-btn
                        readonly
                        @click="
                          distributionReport.dialogs.exportFilter.show = true
                        "
                        color="green white--text"
                        class="mr-1"
                        :disabled="distributionReport.table.loading"
                        rounded
                        small
                        disabled
                      >
                        <v-icon small class="mr-1">mdi-microsoft-excel</v-icon>
                        Export
                      </v-btn>
                      <!-- Refresh Button -->
                      <v-btn
                        readonly
                        @click="reportNurseryFF()"
                        color="info white--text"
                        rounded
                        small
                        :disabled="distributionReport.table.loading"
                      >
                        <v-icon small class="mr-1">mdi-refresh</v-icon> Refresh
                      </v-btn>
                    </v-row>
                  </template>
                  <!-- mu column -->
                  <template v-slot:item.mu_name="{ item }">
                    {{ item.loading_line[0].mu_name }}
                  </template>
                  <template v-slot:item.ff_name="{ item }">
                    {{ item.loading_line[0].ff_name }}
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      v-if="item.verified_by == null || item.verified_by == ''"
                      color="red white--text"
                      class="pl-1 pr-3"
                      ><v-icon class="mr-1">mdi-close-circle</v-icon>
                      Unverified</v-chip
                    >
                    <v-chip
                      v-else-if="
                        item.verified_by != null || item.verified_by != ''
                      "
                      color="green white--text"
                      class="pl-1 pr-3"
                      ><v-icon class="mr-1">mdi-check-circle</v-icon>
                      Verified</v-chip
                    >
                  </template>
                  <template v-slot:item.sts_bast="{ item }">
                    <!-- {{item.loading_line[0].status_bast}} -->
                    <v-chip
                      v-if="!item.loading_line[0].status_bast"
                      color="orange white--text"
                      class="pl-1 pr-3"
                      ><v-icon class="mr-1">mdi-close-circle</v-icon> Belum
                      Di-Cek</v-chip
                    >
                    <v-chip
                      v-else-if="item.loading_line[0].status_bast == 1"
                      color="red white--text"
                      class="pl-1 pr-3"
                      ><v-icon class="mr-1">mdi-minus-circle-outline</v-icon>
                      Kurang Lengkap</v-chip
                    >
                    <v-chip
                      v-else-if="item.loading_line[0].status_bast == 2"
                      color="red white--text"
                      class="pl-1 pr-3"
                      ><v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
                      Kelebihan</v-chip
                    >
                    <v-chip
                      v-else-if="item.loading_line[0].status_bast == 3"
                      color="green white--text"
                      class="pl-1 pr-3"
                      ><v-icon class="mr-1">mdi-check-circle</v-icon> Lengkap /
                      Selesai</v-chip
                    >
                  </template>
                  <!-- Status Column -->
                  <!-- <template v-slot:item.status="{item}">
                                        
                                    </template> -->
                  <!-- Actions Column -->
                  <template v-slot:item.actions="{ item }">
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
                            vi
                            dark
                            class="px-7"
                            rounded
                            @click="exportReportFromDetail(item)"
                            color="green"
                            block
                          >
                            <v-icon class="mr-1" small color="white">
                              mdi-download-box
                            </v-icon>
                            Export
                          </v-btn>
                        </v-list-item>
                        <v-list-item
                          v-if="
                            item.loading_line[0].status_bast == 0 ||
                            item.loading_line[0].status_bast == null
                          "
                        >
                          <v-btn
                            dark
                            class="px-7"
                            rounded
                            @click="cekReportStatusBAST(item)"
                            color="blue"
                            block
                          >
                            <v-icon class="mr-1" small color="white">
                              mdi-folder-search
                            </v-icon>
                            CEk Status BAST
                          </v-btn>
                        </v-list-item>
                        <v-list-item
                          v-if="item.loading_line[0].status_bast == 1"
                        >
                          <v-btn
                            dark
                            class="px-7"
                            rounded
                            @click="lackOfSeedForm(item)"
                            color="red"
                            block
                          >
                            <v-icon class="mr-1" small color="white">
                              mdi-magnify-minus
                            </v-icon>
                            Lapor Bibit Kurang
                          </v-btn>
                        </v-list-item>
                        <v-list-item
                          v-if="item.loading_line[0].status_bast == 2"
                        >
                          <v-btn
                            dark
                            class="px-7"
                            rounded
                            @click="excessOfSeedForm(item)"
                            color="orange"
                            block
                          >
                            <v-icon class="mr-1" small color="white">
                              mdi-magnify-plus
                            </v-icon>
                            Lapor Bibit Lebih
                          </v-btn>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                  <!-- Expand Main Table -->
                  <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length" class="py-6">
                      <v-data-table
                        data-aos="fade-up"
                        data-aos-delay="200"
                        class="rounded-xl elevation-6 mx-3 pa-1 mb-2"
                        :headers="distributionReport.table.headersReportFarmer"
                        :items="
                          distributionReport.table.NurseryFarmerItems
                            .detail_farmers
                        "
                        :loading="distributionReport.table.loading"
                        :key="`PetaniPerFF-${distributionReport.table.loading}`"
                      >
                        <!-- SubToolBar -->
                        <template v-slot:top>
                          <v-row class="ma-2 mb-0 align-center">
                            <v-col cols="12" lg="6" class="d-flex">
                              <!-- <v-select
                                                                color="success"
                                                                item-color="success"
                                                                v-model="distributionReport.table.search.column"
                                                                :items="distributionReport.table.search.options"
                                                                item-value="value"
                                                                item-text="text"
                                                                hide-details
                                                                outlined
                                                                dense
                                                                :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                                                                rounded
                                                                label="Kolom Pencarian"
                                                                class="centered-select"
                                                                style="width: 50%;max-width: 200px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
                                                                ></v-select> -->
                              <!-- <v-text-field
                                                                color="success"
                                                                item-color="success"
                                                                v-model="distributionReport.table.search.model"
                                                                placeholder="Pencarian..."
                                                                append-icon="mdi-magnify"
                                                                outlined
                                                                dense
                                                                rounded
                                                                label="Pencarian Nama Petani"
                                                                hide-details
                                                                
                                                            ></v-text-field> -->
                            </v-col>
                          </v-row>
                        </template>
                        <template v-slot:item.status="{ item }">
                          <v-chip
                            v-if="
                              item.verified_by == null || item.verified_by == ''
                            "
                            color="red white--text"
                            class="pl-1 pr-3"
                            ><v-icon class="mr-1">mdi-close-circle</v-icon>
                            Unverified</v-chip
                          >
                          <v-chip
                            v-else-if="
                              item.verified_by != null || item.verified_by != ''
                            "
                            color="green white--text"
                            class="pl-1 pr-3"
                            ><v-icon class="mr-1">mdi-check-circle</v-icon>
                            Verified</v-chip
                          >
                        </template>

                        <!-- All Bags Column -->
                        <!-- <template v-slot:item.sum_all_bags="{item}">
                                                    <div class="d-flex align-center justify-content-between">
                                                        <div class="d-flex flex-column align-center mr-1 mr-lg-5">
                                                            <v-icon>mdi-printer </v-icon> {{ item.sum_all_bags }}
                                                        </div>
                                                        <div class="d-flex flex-column align-center mx-1 mx-lg-5">
                                                            <v-icon>mdi-truck-check </v-icon> {{ item.sum_loaded_bags }}
                                                        </div>
                                                        <div class="d-flex flex-column align-center ml-1 ml-lg-5">
                                                            <v-icon>mdi-basket-check </v-icon> {{ item.sum_distributed_bags }}
                                                        </div>
                                                    </div>
                                                </template> -->

                        <!-- Status Column -->
                        <!-- <template v-slot:item.status="{item}">
                                                    
                                                </template> -->
                        <!-- Actions Column -->
                        <template v-slot:item.actions="{ item }">
                          <v-btn
                            color="info white--text"
                            class="pl-1 pr-3"
                            small
                            rounded
                            @click="DetailDistributionReportFarmer(item)"
                          >
                            <v-icon class="mr-1">mdi-information</v-icon>
                            Details
                          </v-btn>
                        </template>
                      </v-data-table>
                    </td>
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
        <v-icon small class="pl-1" @click="snackbar.show = false"
          >mdi-close-circle</v-icon
        >
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import { QrcodeStream } from "vue-qrcode-reader";
import trucksJSON from "@/utils/trucks";
import exportReportDistribusi from "@/views/Activity/distribusi/exportReportDistribusi";

export default {
  components: {
    QrcodeStream,
    exportReportDistribusi,
  },
  data: () => ({
    accessModul: {
      calendar: true,
      packingLabel: true,
      loadingLine: true,
      distributionReport: true,
    },
    apiConfig: {
      config: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
      nurseryImageUrl: "",
      imageUrl: localStorage.getItem("BaseUrl"),
      baseUrl: localStorage.getItem("BaseUrlGet"),

      token: localStorage.getItem("token"),
      nurseryToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTY5NjMxNzExMiwiZXhwIjoxNzI3NDIxMTEyLCJuYmYiOjE2OTYzMTcxMTIsImp0aSI6IkNzSHRmb0ltOFMzdnNKRUgiLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.5yw7p18qzA4VLVi6Ea0ToA5NO90vgUOsE46uZrHhdBw",
    },
    dataJSON: {
      trucks: trucksJSON,
    },
    calendar: {
      colors: ["green", "teal"],
      detailBibit: {
        show: false,
        loading: false,
        datas: null,
      },
      detailPeriodFF: {
        show: false,
        loading: false,
        loadingText: "",
        datas: null,
        newPeriod: {
          nursery: "",
          distribution_time: "",
          hole_time: "",
          planting_time: "",
          distribution_location: "",
        },
      },
      events: [],
      nurseryEvents: [],
      focus: "",
      nurseryFocus: "",
      loading: false,
      nurseryLoading: false,
      names: ["Soreang", "Ciminyak"],
      range: [moment().format("Y-MM-DD"), "2023-01-31"],
      nurseryRange: [moment().format("Y-MM-DD"), "2023-01-31"],
      selectedElement: null,
      selectedEvent: {},
      selectedOpen: false,
      table: {
        headers: [
          { text: "No", value: "no", align: "center" },
          { text: "MU", value: "mu_name", align: "left" },
          { text: "FF", value: "ff_name", align: "left" },
          {
            text: "Total Bibit Sostam",
            value: "total_bibit_sostam",
            align: "left",
          },
          {
            text: "Progress PenLub",
            value: "progress_penlub",
            align: "center",
          },
          {
            text: "Total Bibit PenLub",
            value: "total_bibit_penlub",
            align: "center",
          },
          { text: "Actions", value: "actions", align: "right" },
        ],
      },
      table2: {
        headers: [
          { text: "No", value: "no", align: "center" },
          { text: "MU", value: "mu_name", align: "left" },
          { text: "PIC T4T", value: "employee_name", align: "left" },
          { text: "PIC Lahan", value: "pic_lahan", align: "left" },
          {
            text: "Total Bibit Lahan",
            value: "total_bibit_lahan",
            align: "left",
          },
          {
            text: "Total Bibit PenLub",
            value: "total_bibit_penlub",
            align: "left",
          },
          { text: "Actions", value: "actions", align: "right" },
        ],
      },
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
    },
    confirmation: {
      model: null,
      okText: "",
      show: false,
      title: "Confirmation",
      type: null,
    },
    distributionReport: {
      dialogExportDistributionReport: {
        show: false,
        ff_model: "",
      },
      datePicker: {
        loading: false,
        model: moment().format("Y-MM-DD"),
        modelShow: moment().format("DD MMMM Y"),
        show: false,
      },
      dialogs: {
        exportFilter: {
          show: false,
          user_ff_list: "",
          ff_item: [],
          ff_model: "",
          fc_name: "",
          mu_no: "",
          farmerData: [],
        },
        detail: {
          distribution_photo: "",
          farmer_signature_photo: "",
          farmerNo: "",
          adjustment: [],
          totalSeedArrival: 0,
          data: null,
          disabledSave: true,
          labels: {
            printed: [],
            loaded: [],
            distributed: [],
            lost: [],
          },
          loading: false,
          loadingText: null,
          show: false,
        },
        detailUmum: {
          distribution_photo: "",
          farmer_signature_photo: "",
          farmerNo: "",
          adjustment: [],
          totalSeedArrival: 0,
          data: null,
          disabledSave: true,
          labels: {
            printed: [],
            loaded: [],
            distributed: [],
            lost: [],
          },
          loading: false,
          loadingText: null,
          show: false,
        },
        inputAdjustDetailLables: {
          menuItem: [],
          distributedBag: [],
          is_pupuk_distributed: 0,
          distribution_time: "",
          user_accepted: "",
          id: "",
        },
        addPhoto: {
          button: true,
          show: false,
          modal_signature_photo: "",
          modal_receiver_photo: "",
        },
        scanLahanUmum: {
          camera: false,
          data: null,
          disabledSave: true,
          labels: {
            printed: [],
            loaded: [],
            distributed: [],
            lost: [],
          },
          loading: false,
          loadingText: null,
          photo: {
            model: null,
            preview: null,
          },
          scan: {
            alert: {
              color: "",
              show: false,
              text: "",
            },
            labels: [],
            labelsLeft: [],
            lastScanned: null,
            scanned: [],
          },
          show: false,
        },
      },
      loading: false,
      loadingText: "",
      table: {
        headers: [
          { text: "Management Unit", value: "mu_name" },
          { text: "FF Name", value: "ff_name" },
          { text: "Farmer Name", value: "farmer_name" },
          { text: "Bags", value: "sum_all_bags", align: "center" },
          { text: "KAYU", value: "adj_kayu", align: "center" },
          { text: "MPTS", value: "adj_mpts", align: "center" },
          { text: "CROPS", value: "adj_crops", align: "center" },
          { text: "Status", value: "status", align: "center" },
          {
            text: "Actions",
            value: "actions",
            align: "right",
            sortable: false,
          },
        ],
        headers2: [
          { text: "Management Unit", value: "mu_name" },
          { text: "PIC T4T", value: "pic_t4t" },
          { text: "PIC Lahan", value: "pic_lahan" },
          { text: "Bags", value: "sum_all_bags", align: "center" },
          { text: "KAYU", value: "adj_kayu", align: "center" },
          { text: "MPTS", value: "adj_mpts", align: "center" },
          { text: "CROPS", value: "adj_crops", align: "center" },
          { text: "Status", value: "status", align: "center" },
          {
            text: "Actions",
            value: "actions",
            align: "right",
            sortable: false,
          },
        ],
        headersReportFF: [
          { text: "Managemgent Unit", value: "mu_name", sortable: false },
          { text: "Nama FF", value: "ff_no" },
          { text: "Nama FF", value: "ff_name" },
          { text: "Status BAST", value: "sts_bast" },
          { text: "Menu Lainnya", value: "actions" },
          {
            text: "Detail Petani",
            value: "data-table-expand",
            align: "right",
            sortable: false,
          },
        ],
        headersReportFarmer: [
          { text: "Kode Petani", value: "farmer_no" },
          { text: "Nama Petani", value: "farmer_name" },
          {
            text: "Status Penerimaan Petani",
            value: "status",
            align: "center",
          },
          { text: "Diverifikasi Oleh", value: "verified_by", align: "center" },
          {
            text: "Actions",
            value: "actions",
            align: "right",
            sortable: false,
          },
        ],
        headers3: [
          { text: "Management Unit", value: "mu_name", sortable: false },
          { text: "Nama FF", value: "ff_name" },
          { text: "Nama Petani", value: "farmer_name" },
          {
            text: "Status Penerimaan Petani",
            value: "status",
            align: "center",
          },
          { text: "Diverifikasi Oleh", value: "verified_by", align: "center" },
          {
            text: "Actions",
            value: "actions",
            align: "right",
            sortable: false,
          },
        ],
        expanded: [],
        items: [],
        NurseryItems: [],
        NurseryFFItems: [],
        NurseryFarmerItems: [],
        options: {},
        totalDatas: 0,
        total_page: 0,
        per_page_options: [10, 25, 50, 100],
        per_page: 10,
        page: 1,
        loading: false,
        search: {
          options: [
            { text: "Nama FF", value: "ff_name" },
            { text: "Nama Petani", value: "farmer_name" },
          ],
          column: "ff_name",
          model: "",
        },
      },
    },
    expansions: {
      model: [0, 1, 2, 3],
    },
    generalSettings: {
      nursery: {
        model: "All",
        options: ["All", "Cirasea", "Ciminyak", "Soreang", "Kebumen", "Pati"],
        disabled: false,
      },
      type: {
        model: "Petani",
        options: ["Petani", "Umum"],
        disabled: false,
      },
      programYear: "2022",
    },
    loadingLine: {
      datePicker: {
        loading: false,
        model: moment().format("Y-MM-DD"),
        modelShow: moment().format("DD MMMM Y"),
        show: false,
      },
      detailDialog: {
        tabs: {
          open: "all",
        },
        differentTotalBags: false,
        inputs: {
          disabledSave: false,
          scanner: {
            alert: {
              color: "",
              show: false,
              text: "",
            },
            farmers: [],
            labels: [],
            model: "",
            values: [],
          },
          table: {
            headers: [
              { text: "", value: "check", align: "center", sortable: false },
              { text: "Farmer", value: "farmer_name" },
              { text: "Bags", value: "bags_number", sortable: false },
              {
                text: "Bags Loaded",
                value: "bags_number_loaded",
                sortable: false,
              },
              { text: "Bags Left", value: "bags_left", sortable: false },
            ],
            headers2: [
              { text: "", value: "check", align: "center", sortable: false },
              { text: "PIC Lahan", value: "pic_lahan" },
              { text: "Bags", value: "bags_number", sortable: false },
              {
                text: "Bags Loaded",
                value: "bags_number_loaded",
                sortable: false,
              },
              { text: "Bags Left", value: "bags_left", sortable: false },
            ],
          },
        },
        leftLabelsDialog: false,
        listLabelDetail: [],
        loading: false,
        loadingText: "Loading...",
        model: null,
        show: false,
        snackbar: {
          color: "",
          show: false,
          text: "",
          timeout: 10000,
        },
        transportationIndex: null,
        transportations: [
          {
            driver_detail: null,
            loaded_labels: [],
            truck_detail: null,
            progression: 0,
            plat_no: "",
            nik: "",
            total_loaded: 0,
          },
        ],
      },
      loading: false,
      loadingText: null,
      table: {
        headers: [
          { text: "Status", value: "is_loaded", align: "center", width: "100" },
          { text: "Management Unit", value: "mu_name" },
          { text: "Field Facilitator", value: "ff_name" },
          { text: "Printed (%)", value: "printed_progress", align: "center" },
          { text: "Seeds Total", value: "total_tree_amount", align: "center" },
          { text: "Bags Total", value: "total_bags", align: "center" },
          {
            text: "Actions",
            value: "actions",
            align: "right",
            sortable: false,
          },
        ],
        headers2: [
          { text: "Status", value: "is_loaded", align: "center", width: "100" },
          { text: "Management Unit", value: "mu_name" },
          { text: "PIC T4T", value: "employee_name" },
          { text: "PIC Lahan", value: "pic_lahan" },
          { text: "Printed (%)", value: "printed_progress", align: "center" },
          { text: "Seeds Total", value: "total_tree_amount", align: "center" },
          { text: "Bags Total", value: "total_bags", align: "center" },
          {
            text: "Actions",
            value: "actions",
            align: "right",
            sortable: false,
          },
        ],
        items: [],
        loading: false,
      },
    },
    packingLabel: {
      datePicker: {
        loading: false,
        model: moment().format("Y-MM-DD"),
        modelShow: moment().format("DD MMMM Y"),
        show: false,
      },
      dialogs: {
        checkedConfirmation: {
          show: false,
          model: {
            ph_form_no: null,
            status: 0,
          },
        },
      },
      loading: false,
      loadingText: null,
      tables: {
        byLahan: {
          headers: [
            { text: "MU", value: "mu_name" },
            { text: "FF", value: "nama_ff" },
            { text: "Farmer", value: "nama_petani" },
            { text: "No Lahan", align: "start", value: "lahan_no" },
            { text: "Holes", value: "total_holes" },
            { text: "Seeds", value: "total_bibit" },
            {
              text: "Check",
              value: "is_checked",
              align: "center",
              width: "100",
            },
            {
              text: "Actions",
              value: "actions",
              sortable: false,
              align: "right",
            },
          ],
          headers2: [
            { text: "MU", value: "mu_name" },
            { text: "PIC T4T", value: "employee_name" },
            { text: "PIC Lahan", value: "pic_lahan" },
            { text: "No Lahan", align: "start", value: "lahan_no" },
            { text: "Holes", value: "total_holes" },
            { text: "Seeds", value: "total_bibit" },
            {
              text: "Status",
              value: "is_checked",
              align: "center",
              width: "100",
            },
            {
              text: "Actions",
              value: "actions",
              sortable: false,
              align: "right",
            },
          ],
          items: [],
          loading: false,
          search: {
            items: [],
            model: "",
          },
        },
      },
      tabs: {
        model: 0,
      },
    },
    snackbar: {
      color: "",
      show: false,
      text: "",
      timeout: 10000,
    },
    User: JSON.parse(localStorage.getItem("User")),
    UserLogin: [],
  }),
  async mounted() {
    // set program year
    this.UserLogin = this.User.ff.ff;
    this.generalSettings.programYear = this.$store.state.programYear.model;

    await this.getUserException();
    if (this.User.ff.value_data == "-") this.User.ff.value_data = "all";
    await this.firstAccessPage();
  },
  destroyed() {
    this.$store.state.loadingOverlay = false;
  },
  watch: {
    "distributionReport.table.search.model": {
      handler() {
        setTimeout(() => {
          // this.reportNursery()
          this.reportNurseryFF();
        }, 1000);
      },
      deep: true,
    },
    "distributionReport.table.options": {
      handler(newValue) {
        let { page, itemsPerPage } = newValue;
        this.distributionReport.table.page = page;
        this.distributionReport.table.per_page = itemsPerPage;
        console.log(this.distributionReport.table.per_page, page);
        // this.reportNursery()
        this.reportNurseryFF();
      },
    },
    "calendar.detailPeriodFF.newPeriod.distribution_time": {
      handler(newValue) {
        this.calendar.detailPeriodFF.newPeriod.hole_time = moment(newValue)
          .subtract(14, "days")
          .format("Y-MM-DD");
        this.calendar.detailPeriodFF.newPeriod.planting_time = moment(newValue)
          .add(7, "days")
          .format("Y-MM-DD");
      },
    },
    "calendar.events": {
      handler(newValue) {
        // console.log(newValue)
      },
    },
    "calendar.nurseryEvents": {
      handler(newValue) {
        // console.log(newValue)
      },
    },
    "distributionReport.datePicker.model": {
      async handler(newVal) {
        this.distributionReport.datePicker.modelShow = this.dateFormat(
          newVal,
          "DD MMMM Y"
        );
        // await this.reportNursery()
        await this.reportNurseryFF();
        // await this.getDistributionReportTable()
      },
    },
    "expansions.model": {
      handler(val) {
        // console.log(val)
      },
    },
    "generalSettings.nursery.model": {
      async handler(newValue, oldValue) {
        if (newValue != oldValue) {
          const calendar = {
            start: this.$refs.calendar.renderProps.start,
            end: this.$refs.calendar.renderProps.end,
          };
          this.packingLabel.loadingText =
            "Waiting for completed get distribution calendar data...";
          this.packingLabel.loading = true;
          this.loadingLine.loadingText =
            "Waiting for completed get distribution calendar data...";
          this.loadingLine.loading = true;
          // this.distributionReport.loadingText = 'Waiting for completed get distribution calendar data...'
          // this.distributionReport.loading = true
          // refresh calendar
          await this.calendarUpdateRange({
            start: calendar.start,
            end: calendar.end,
          });
          await this.calendarUpdateRangeNew({
            start: calendar.start,
            end: calendar.end,
          });
          this.packingLabel.loadingText = "Getting packing label data...";
          this.loadingLine.loadingText =
            "Waiting for completed get packing label data...";
          // this.distributionReport.loadingText = 'Waiting for completed get packing label data...'
          // refresh packing label table
          await this.getPackingLabelTableData();
          this.packingLabel.loading = false;
          this.loadingLine.loadingText = "Getting loading line data...";
          // this.distributionReport.loadingText = 'Waiting for completed get loading line data...'
          // refresh loading line table
          await this.getLoadinglineTableData();
          this.loadingLine.loading = false;
          this.distributionReport.loadingText =
            "Getting distribution report data...";
          // refresh distribution report table
          // await this.getDistributionReportTable()
          // await this.reportNursery()
          this.distributionReport.loading = false;
        }
      },
    },
    "generalSettings.programYear": {
      async handler(newValue) {
        this.calendar.range = [
          moment().format("Y-MM-DD"),
          `${newValue + 1}-01-31`,
        ];
        this.calendar.nurseryRange = [
          moment().format("Y-MM-DD"),
          `${newValue + 1}-01-31`,
        ];
        this.packingLabel.loadingText =
          "Waiting for completed get distribution calendar data...";
        this.packingLabel.loading = true;
        this.loadingLine.loadingText =
          "Waiting for completed get distribution calendar data...";
        this.loadingLine.loading = true;
        this.distributionReport.loadingText =
          "Waiting for completed get distribution calendar data...";
        this.distributionReport.loading = true;
        // refresh calendar
        this.calendar.focus = this.calendar.range[0];
        this.calendar.nurseryFocus = this.calendar.nurseryRange[0];
        this.packingLabel.loadingText = "Getting packing label data...";
        this.loadingLine.loadingText =
          "Waiting for completed get packing label data...";
        this.distributionReport.loadingText =
          "Waiting for completed get packing label data...";
        // refresh packing label table
        await this.getPackingLabelTableData();
        this.packingLabel.loading = false;
        this.loadingLine.loadingText = "Getting loading line data...";
        this.distributionReport.loadingText =
          "Waiting for completed get loading line data...";
        // refresh loading line table
        await this.getLoadinglineTableData();
        this.loadingLine.loading = false;
        this.distributionReport.loadingText =
          "Getting distribution report data...";
        // refresh distribution report table
        // await this.getDistributionReportTable()
        // await this.reportNursery()
        this.distributionReport.loading = false;
      },
    },
    "generalSettings.type.model": {
      async handler(newValue, oldValue) {
        if (newValue != oldValue) {
          this.packingLabel.loadingText =
            "Waiting for completed get distribution calendar data...";
          this.packingLabel.loading = true;
          this.loadingLine.loadingText =
            "Waiting for completed get distribution calendar data...";
          this.loadingLine.loading = true;
          this.distributionReport.loadingText =
            "Waiting for completed get distribution calendar data...";
          this.distributionReport.loading = true;
          // refresh calendar
          if (this.$refs.calendar) {
            const calendar = {
              start: this.$refs.calendar.renderProps.start,
              end: this.$refs.calendar.renderProps.end,
            };
            await this.calendarUpdateRange({
              start: calendar.start,
              end: calendar.end,
            });
            await this.calendarUpdateRangeNew({
              start: calendar.start,
              end: calendar.end,
            });
          }
          this.packingLabel.loadingText = "Getting packing label data...";
          this.loadingLine.loadingText =
            "Waiting for completed get packing label data...";
          this.distributionReport.loadingText =
            "Waiting for completed get packing label data...";
          // refresh packing label table
          await this.getPackingLabelTableData();
          this.packingLabel.loading = false;
          this.loadingLine.loadingText = "Getting loading line data...";
          this.distributionReport.loadingText =
            "Waiting for completed get loading line data...";
          // refresh loading line table
          await this.getLoadinglineTableData();
          this.loadingLine.loading = false;
          this.distributionReport.loadingText =
            "Getting distribution report data...";
          // refresh distribution report table
          // await this.getDistributionReportTable()
          // await this.reportNursery()
          this.distributionReport.loading = false;
        }
      },
    },
    "loadingLine.datePicker.model": {
      async handler(newVal) {
        this.loadingLine.datePicker.modelShow = this.dateFormat(
          newVal,
          "DD MMMM Y"
        );
        await this.getLoadinglineTableData();
      },
    },
    "packingLabel.datePicker.model": {
      async handler(newVal) {
        this.packingLabel.datePicker.modelShow = this.dateFormat(
          newVal,
          "DD MMMM Y"
        );
        await this.getPackingLabelTableData();
      },
    },
    "packingLabel.tabs.model": {
      async handler(newValue) {
        if (
          newValue == 0 &&
          this.packingLabel.tables.byLahan.items.length == 0
        ) {
          await this.getPackingLabelTableData();
        }
      },
    },
  },
  methods: {
    // CALENDAR
    calendarGetEventColor(event) {
      return event.color;
    },
    expandTableReport(item) {
      this.distributionReport.table.NurseryFarmerItems = item.item;
    },
    // async reportNursery(){
    //     // await this.getUserException()
    //     if (this.accessModul.calendar) {
    //         this.distributionReport.table.loading = true

    //         const params ={
    //             ff_no: this.UserLogin.toString(),
    //             program_year: this.generalSettings.programYear,
    //             distribution_date: this.distributionReport.datePicker.model,
    //             status_data: "custom",
    //             page: this.distributionReport.table.page,
    //             limit: this.distributionReport.table.per_page,
    //             search: this.distributionReport.table.search.model
    //         }

    //         let url = 'https://api-nursery.t4t-api.org/api/custom/reportDetailFarmer?'
    //         const res = await axios.get(
    //             url,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ` + this.apiConfig.nurseryToken
    //                 },
    //                 params: params
    //             }
    //         ).catch(err => {
    //             this.sessionEnd(err)
    //             this.distributionReport.table.loading = false
    //         })
    //         const resData = res.data.data
    //         this.distributionReport.table.NurseryItems = resData
    //         this.distributionReport.table.totalDatas = res.data.total
    //         this.distributionReport.table.total_page = res.data.totalPage
    //         this.distributionReport.table.loading = false
    //     }
    // },
    async reportNurseryFF() {
      // await this.getUserException()
      this.distributionReport.table.NurseryFFItems = [];
      this.distributionReport.table.totalDatas = 0;
      this.distributionReport.table.total_page = 0;
      // this.distributionReport.table.loading = true

      if (this.accessModul.calendar) {
        this.distributionReport.table.loading = true;
        const params = {
          ff_no: this.UserLogin.toString(),
          program_year: this.generalSettings.programYear,
          distribution_date: this.distributionReport.datePicker.model,
          status_data: "custom",
          page: this.distributionReport.table.page,
          limit: this.distributionReport.table.per_page,
          search: this.distributionReport.table.search.model,
        };

        let url = "https://api-nursery.t4t-api.org/api/custom/reportDetailFF?";
        const res = await axios
          .get(url, {
            headers: {
              Authorization: `Bearer ` + this.apiConfig.nurseryToken,
            },
            params: params,
          })
          .catch((err) => {
            this.sessionEnd(err);
            this.distributionReport.table.loading = false;
          });
        const resData = res.data.data;
        this.distributionReport.table.NurseryFFItems = resData;
        this.distributionReport.table.totalDatas = res.data.total;
        this.distributionReport.table.total_page = res.data.totalPage;
        this.distributionReport.table.loading = false;
      }
    },
    calendarGetEventTextColor(event) {
      const color = event.color;
      const light = ["yellow"];
      if (light.includes(color)) {
        return "black";
      } else return "white";
    },
    calendarPrev() {
      this.$refs.calendar.prev();
    },
    calendarNext() {
      this.$refs.calendar.next();
    },
    async calendarShowDetailFFPeriod(data) {
      const params = {
        ff_no: data.ff_no,
        program_year: data.planting_year,
      };
      this.calendar.detailPeriodFF.show = true;
      this.calendar.detailPeriodFF.loading = true;
      this.calendar.detailPeriodFF.loadingText =
        "Getting Distribution Period Data...";
      axios
        .get(
          `${
            this.apiConfig.baseUrl
          }DistributionPeriodDetail?${new URLSearchParams(params)}`,
          {
            headers: {
              Authorization: `Bearer ` + this.apiConfig.token,
            },
          }
        )
        .then((res) => {
          const response = res.data.data.result;
          // console.log(response)
          this.calendar.detailPeriodFF.datas = response;
          this.calendar.detailPeriodFF.newPeriod.distribution_time =
            this.dateFormat(response.period.distribution_time, "Y-MM-DD");
          this.calendar.detailPeriodFF.newPeriod.distribution_location =
            response.period.distribution_location;
          this.calendar.detailPeriodFF.newPeriod.hole_time =
            response.period.pembuatan_lubang_tanam;
          this.calendar.detailPeriodFF.newPeriod.planting_time =
            response.period.planting_time;
        })
        .catch((err) => {
          this.sessionEnd(err);
        })
        .finally(() => {
          this.calendar.detailPeriodFF.loading = false;
          this.calendar.detailPeriodFF.loadingText = "";
        });
    },
    async calendarShowDetailLahanUmumPeriod(data) {
      // console.log(data)
      const params = {
        mou_no: data.mou_no,
        lahan_no: data.lahan_no,
        program_year: data.program_year,
      };
      this.calendar.detailPeriodFF.show = true;
      this.calendar.detailPeriodFF.loading = true;
      this.calendar.detailPeriodFF.loadingText =
        "Getting Distribution Period Data...";
      axios
        .get(
          `${
            this.apiConfig.baseUrl
          }DistributionPeriodLahanUmumDetail?${new URLSearchParams(params)}`,
          {
            headers: {
              Authorization: `Bearer ` + this.apiConfig.token,
            },
          }
        )
        .then((res) => {
          const response = res.data.data.result;
          // console.log(response)
          this.calendar.detailPeriodFF.datas = response;
          this.calendar.detailPeriodFF.newPeriod.distribution_time =
            this.dateFormat(response.period.distribution_time, "Y-MM-DD");
          this.calendar.detailPeriodFF.newPeriod.distribution_location = "-";
          this.calendar.detailPeriodFF.newPeriod.nursery = response.nursery;
          this.calendar.detailPeriodFF.newPeriod.hole_time =
            response.period.planting_hole_date;
          this.calendar.detailPeriodFF.newPeriod.planting_time =
            response.period.planting_realization_date;
        })
        .catch((err) => {
          this.sessionEnd(err);
        })
        .finally(() => {
          this.calendar.detailPeriodFF.loading = false;
          this.calendar.detailPeriodFF.loadingText = "";
        });
    },
    async calendarUpdateDetailFFPeriod() {
      const datapost = {
        form_no: this.calendar.detailPeriodFF.datas.sostam.form_no,
        ff_no: this.calendar.detailPeriodFF.datas.sostam.ff_no,
        farmer_no: this.calendar.detailPeriodFF.datas.sostam.farmer_no,
        no_lahan: this.calendar.detailPeriodFF.datas.sostam.no_lahan,
        program_year: this.calendar.detailPeriodFF.datas.sostam.planting_year,
        pembuatan_lubang_tanam:
          this.calendar.detailPeriodFF.newPeriod.hole_time,
        distribution_time:
          this.calendar.detailPeriodFF.newPeriod.distribution_time,
        planting_time: this.calendar.detailPeriodFF.newPeriod.planting_time,
        distribution_location:
          this.calendar.detailPeriodFF.newPeriod.distribution_location,
      };
      // console.log(datapost)
      try {
        this.calendar.detailPeriodFF.loading = true;
        this.calendar.detailPeriodFF.loadingText =
          "Updating Distribution Period...";

        await axios
          .post(
            this.apiConfig.baseUrl + "UpdateSosialisasiTanamPeriod",
            datapost,
            {
              headers: {
                Authorization: `Bearer ` + this.apiConfig.token,
              },
            }
          )
          .then((response) => {
            if (response.data.data.result == "success") {
              this.snackbar.show = true;
              this.snackbar.color = "green";
              this.snackbar.text = "Update distribution period success!";

              this.calendar.detailPeriodFF.show = false;
              this.calendar.selectedOpen = false;

              const calendar = {
                start: this.$refs.calendar.renderProps.start,
                end: this.$refs.calendar.renderProps.end,
              };
              // refresh calendar
              this.calendarUpdateRange({
                start: calendar.start,
                end: calendar.end,
              });
              this.calendarUpdateRangeNew({
                start: calendar.start,
                end: calendar.end,
              });
              // refresh packing label table
              this.getPackingLabelTableData();
            } else {
              this.snackbar.show = true;
              this.snackbar.color = "red";
              this.snackbar.text = "Update distribution period failed!";
            }
          })
          .catch((err) => {
            this.sessionEnd(err);
          });
      } catch (error) {
        console.log(error);
      } finally {
        this.calendar.detailPeriodFF.loading = false;
        this.calendar.detailPeriodFF.loadingText = "";
      }
    },
    async updateUnverifikasiReportNursery() {
      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda Yakin Untuk Unverifikasi Penerimaan Bibit Oleh Petani?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        this.distributionReport.dialogs.detail.show = false;
        const params = {
          farmer_no: this.distributionReport.dialogs.detail.farmerNo,
          verified_by: null,
        };

        try {
          const sendData = await axios.post(
            "https://api-nursery.t4t-api.org/api/custom/received-verification-geko",
            params,
            {
              headers: {
                Authorization: `Bearer ` + this.apiConfig.nurseryToken,
              },
            }
          );
          //  reset form create value
          Swal.fire({
            title: "Berhasil Unverifikasi Data Penerimaan Bibit Petani!",
            icon: "success",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "OK",
          });
          await this.reportNurseryFF();
          this.distributionReport.table.expanded = [];
          // if(notif.isConfirmed){
          // }
        } catch (error) {
          console.error(error.response);
        }
        // await this.reportNurseryFF()
      }
    },
    closeDetailUmum() {
      this.distributionReport.dialogs.addPhoto.show = false;
      this.distributionReport.dialogs.detailUmum.show = false;
    },
    simpanJumlah() {
      // console.log(this.distributionReport.dialogs.detailUmum.adjustment)
    },
    async saveDataReportAdjustment() {
      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda Yakin Untuk Menyimpan Penerimaan Bibit?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        const params = {
          farmer_no: this.distributionReport.dialogs.detailUmum.farmerNo,
          detail: this.distributionReport.dialogs.detailUmum.adjustment,
          bag: this.distributionReport.dialogs.inputAdjustDetailLables
            .distributedBag,
          is_pupuk_distributed:
            this.distributionReport.dialogs.inputAdjustDetailLables
              .is_pupuk_distributed,
          id: this.distributionReport.dialogs.inputAdjustDetailLables.id,
          distribution_time:
            this.distributionReport.dialogs.inputAdjustDetailLables
              .distribution_date,
          user_accepted:
            this.distributionReport.dialogs.inputAdjustDetailLables
              .user_accepted,
          file_accept: {},
          file_signature: {},
        };
        if (this.distributionReport.dialogs.addPhoto.modal_receiver_photo) {
          params.file_accept = await this.uploadPhotosNursery(
            this.distributionReport.dialogs.addPhoto.modal_receiver_photo
          );
        }
        if (this.distributionReport.dialogs.addPhoto.modal_signature_photo) {
          params.file_signature = await this.uploadPhotosNursery(
            this.distributionReport.dialogs.addPhoto.modal_signature_photo
          );
        }

        try {
          const sendData = await axios.post(
            "https://api-nursery.t4t-api.org/api/custom/received-mobile-distribution",
            params,
            {
              headers: {
                Authorization: `Bearer ` + this.apiConfig.nurseryToken,
              },
            }
          );
          //  reset form create value
          Swal.fire({
            title: "Berhasil Adjustment Data Penerimaan Bibit!",
            icon: "success",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "OK",
          });
          await this.reportNurseryFF();
          this.distributionReport.table.expanded = [];
          // if(notif.isConfirmed){
          // }
        } catch (error) {
          console.error(error.response);
        }
        this.distributionReport.dialogs.addPhoto.show = false;
        this.distributionReport.dialogs.detailUmum.show = false;
        this.distributionReport.dialogs.inputAdjustDetailLables.distributedBag =
          [];
        this.distributionReport.dialogs.inputAdjustDetailLables.user_accepted =
          "";
      }
    },
    async updateVerifikasiReportNursery() {
      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda Yakin Untuk Verifikasi Penerimaan Bibit Oleh Petani?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        this.distributionReport.dialogs.detail.show = false;
        const params = {
          farmer_no: this.distributionReport.dialogs.detail.farmerNo,
          verified_by: this.User.email,
        };

        try {
          const sendData = await axios.post(
            "https://api-nursery.t4t-api.org/api/custom/received-verification-geko",
            params,
            {
              headers: {
                Authorization: `Bearer ` + this.apiConfig.nurseryToken,
              },
            }
          );
          //  reset form create value
          Swal.fire({
            title: "Berhasil Verifikasi Data Penerimaan Bibit Petani!",
            icon: "success",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "OK",
          });
          await this.reportNurseryFF();
          this.distributionReport.table.expanded = [];
          // if(notif.isConfirmed){
          // }
        } catch (error) {
          console.error(error.response);
        }
      }
    },
    async updateVerifikasiReportNurseryUmum() {
      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda Yakin Untuk Verifikasi Penerimaan Bibit Oleh Petani?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        this.distributionReport.dialogs.detailUmum.show = false;
        const params = {
          farmer_no: this.distributionReport.dialogs.detailUmum.farmerNo,
          verified_by: this.User.email,
        };

        try {
          const sendData = await axios.post(
            "https://api-nursery.t4t-api.org/api/custom/received-verification-geko",
            params,
            {
              headers: {
                Authorization: `Bearer ` + this.apiConfig.nurseryToken,
              },
            }
          );
          //  reset form create value
          Swal.fire({
            title: "Berhasil Verifikasi Data Penerimaan Bibit Petani!",
            icon: "success",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "OK",
          });
          await this.reportNurseryFF();
          this.distributionReport.table.expanded = [];
          // if(notif.isConfirmed){
          // }
        } catch (error) {
          console.error(error.response);
        }
      }
    },
    async calendarUpdateDetailLahanUmumPeriod() {
      const datapost = {
        mou_no: this.calendar.detailPeriodFF.datas.data.mou_no,
        lahan_no: this.calendar.detailPeriodFF.datas.data.lahan_no,
        program_year: this.calendar.detailPeriodFF.datas.data.program_year,
        planting_hole_date: this.calendar.detailPeriodFF.newPeriod.hole_time,
        distribution_date:
          this.calendar.detailPeriodFF.newPeriod.distribution_time,
        planting_realization_date:
          this.calendar.detailPeriodFF.newPeriod.planting_time,
        nursery: this.calendar.detailPeriodFF.newPeriod.nursery,
      };
      // console.log(datapost)
      try {
        this.calendar.detailPeriodFF.loading = true;
        this.calendar.detailPeriodFF.loadingText =
          "Updating Distribution Period...";

        await axios
          .post(this.apiConfig.baseUrl + "UpdateLahanUmumPeriod", datapost, {
            headers: {
              Authorization: `Bearer ` + this.apiConfig.token,
            },
          })
          .then((response) => {
            this.snackbar.show = true;
            this.snackbar.color = "green";
            this.snackbar.text = "Update distribution period success!";

            this.calendar.detailPeriodFF.show = false;

            this.calendar.selectedElement = null;
            this.calendar.selectedEvent = {};
            this.calendar.selectedOpen = false;

            const calendar = {
              start: this.$refs.calendar.renderProps.start,
              end: this.$refs.calendar.renderProps.end,
            };
            // refresh calendar
            this.calendarUpdateRange({
              start: calendar.start,
              end: calendar.end,
            });
            this.calendarUpdateRangeNew({
              start: calendar.start,
              end: calendar.end,
            });
            // refresh packing label table
            this.getPackingLabelTableData();
          })
          .catch((err) => {
            this.snackbar.show = true;
            this.snackbar.color = "red";
            this.snackbar.text = "Update distribution period failed!";
            this.sessionEnd(err);
          });
      } catch (error) {
        console.log(error);
      } finally {
        if (
          this.calendar.detailPeriodFF.newPeriod.nursery !=
          this.calendar.detailPeriodFF.datas.nursery
        ) {
          await this.calendarNext();
          await this.calendarPrev();
        }
        this.calendar.detailPeriodFF.loading = false;
        this.calendar.detailPeriodFF.loadingText = "";
      }
    },
    async calendarShowDetailTotalBibit(datas, type, activity) {
      let ff_no = [];
      let program_year = "";
      if (type == "nursery") {
        await datas.details.forEach((val) => {
          ff_no.push(val.ff_no);
          if (program_year == "") {
            program_year = val.planting_year;
          }
        });
      } else if (type == "ff") {
        ff_no.push(datas.ff_no);
        program_year = datas.planting_year;
      }
      this.calendar.detailBibit.show = true;
      this.calendar.detailBibit.loading = true;

      let url =
        this.apiConfig.baseUrl +
        "DistributionSeedDetail?" +
        new URLSearchParams({
          ff_no: ff_no.toString(),
          program_year: program_year,
          activity: activity,
        });
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ` + this.apiConfig.token,
          },
        })
        .then((res) => {
          this.calendar.detailBibit.datas = res.data.data.result;
        })
        .catch((err) => {
          console.log(err.response);
          this.sessionEnd(err);
        })
        .finally(() => {
          this.calendar.detailBibit.loading = false;
        });
    },
    async calendarShowDetailTotalBibitLahanUmum(datas, type, activity) {
      let ff_no = [];
      let mou_no = [];
      let program_year = "";
      if (type == "nursery") {
        await datas.details.forEach((val) => {
          if (this.generalSettings.type.model == "Petani")
            ff_no.push(val.ff_no);
          else if (this.generalSettings.type.model == "Umum")
            mou_no.push(val.mou_no);

          if (program_year == "") {
            if (this.generalSettings.type.model == "Petani")
              program_year = val.planting_year;
            else if (this.generalSettings.type.model == "Umum")
              program_year = val.program_year;
          }
        });
      } else if (type == "ff") {
        ff_no.push(datas.ff_no);
        program_year = datas.planting_year;
      } else if (type == "mou_no") {
        mou_no.push(datas.mou_no);
        program_year = datas.program_year;
      }
      this.calendar.detailBibit.show = true;
      this.calendar.detailBibit.loading = true;

      let url =
        this.apiConfig.baseUrl +
        "DistributionSeedDetail?" +
        new URLSearchParams({
          ff_no: ff_no.toString(),
          mou_no: mou_no.toString(),
          program_year: program_year,
          activity: activity,
        });
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ` + this.apiConfig.token,
          },
        })
        .then((res) => {
          this.calendar.detailBibit.datas = res.data.data.result;
        })
        .catch((err) => {
          console.log(err.response);
          this.sessionEnd(err);
        })
        .finally(() => {
          this.calendar.detailBibit.loading = false;
        });
    },
    async getFCbyFF(params) {
      let url =
        this.apiConfig.baseUrl +
        "GetEmployeebyFF?ff_no=" +
        params +
        "&program_year=" +
        this.generalSettings.programYear;

      const FC = await axios.get(url, {
        headers: {
          Authorization: `Bearer ` + this.apiConfig.token,
        },
      });

      console.log(FC.data);
      this.distributionReport.dialogs.exportFilter.fc_name =
        FC.data.data.result[0].name;
      // console.log(this.distributionReport.dialogs.exportFilter.fc_name)
      // return FC.data.data.result[0].name
    },
    lackOfSeedForm(item) {
      window.open(
        `https://nursery.trees4trees.org/#/forms/request-distribution-addendum?loading_line_id=${item.loading_line[0].id}&request_by=${this.User.name}`
      );
    },
    excessOfSeedForm(item) {
      window.open(
        `https://nursery.trees4trees.org/#/forms/request-distribution-addendum?loading_line_id=${item.loading_line[0].id}&request_by=${this.User.name}`
      );
    },
    async cekReportStatusBAST(item) {
      console.log(item);
      const confirm = await Swal.fire({
        title: "Konfirmasi",
        text: "Cek Data Status BAST?",
        icon: "warning",
        confirmButtonColor: "#2e7d32",
        confirmButtonText: "Ya!",
        showCancelButton: true,
        cancelButtonColor: "#d33",
      });
      if (confirm.isConfirmed) {
        try {
          const sendData = await axios.get(
            this.apiConfig.baseUrl +
              "NurseryCheckDistributionBAST?loading_line_id=" +
              item.loading_line[0].id,
            {
              headers: {
                Authorization: `Bearer ` + this.apiConfig.token,
              },
            }
          );
          Swal.fire({
            title: "Berhasil Update Data Status BAST!",
            icon: "success",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "OK",
          });
          await this.reportNurseryFF();
          this.distributionReport.table.expanded = [];
        } catch (error) {
          console.error(error.response);
        }
      }
    },

    exportReportFromDetail(item) {
      this.distributionReport.dialogs.exportFilter.ff_model = item.ff_no;
      this.distributionReport.dialogExportDistributionReport.show = true;
      this.distributionReport.dialogs.exportFilter.mu_no =
        item.loading_line[0].mu_no;
      this.distributionReport.dialogs.exportFilter.farmerData =
        item.detail_farmers;
      // this.distributionReport.dialogs.exportFilter.fc_name = this.getFCbyFF(item.ff_no)
      this.getFCbyFF(item.ff_no);

      console.log(item);
    },
    calendarGetMoreEvent(date) {
      console.log(date.date);
      // this.calendar.selectedEvent = event
      this.calendar.focus = date.date;
      this.calendar.type = "day";
    },
    setCalendarTypeMonthly() {
      this.calendar.type = "month";
    },
    calendarShowEvent({ nativeEvent, event }) {
      // console.log(event)
      const open = () => {
        this.calendar.selectedEvent = event;
        this.calendar.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.calendar.selectedOpen = true))
        );
      };

      if (this.calendar.selectedOpen) {
        this.calendar.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async calendarUpdateRange({ start, end }) {
      // this.generalSettings.nursery.model = 'Kebumen'
      await this.getUserException();
      if (this.accessModul.calendar) {
        this.calendar.loading = true;

        const params = new URLSearchParams({
          month: this.dateFormat(start.date, "MM"),
          year: this.dateFormat(start.date, "Y"),
          program_year: this.generalSettings.programYear,
          nursery: this.generalSettings.nursery.model,
        });
        let url = "DistributionCalendar?";
        if (this.generalSettings.type.model == "Umum")
          url = "DistributionCalendarLahanUmum?";
        const res = await axios
          .get(this.apiConfig.baseUrl + url + params, {
            headers: {
              Authorization: `Bearer ` + this.apiConfig.token,
            },
          })
          .catch((err) => {
            this.sessionEnd(err);
          });
        const resData = res.data.data.result.datas;
        const events = [];

        await resData.forEach((evData, evIndex) => {
          events.push({
            name: evData.nursery,
            start: this.dateFormat(evData.date, "YYYY-MM-DD"),
            total_ff: evData.total,
            total_bibit_sostam: evData.total_bibit_sostam,
            total_bibit_penlub: evData.total_bibit_penlub,
            color:
              evData.nursery == "Tidak Ada"
                ? "blue"
                : this.calendarGetNurseryColor(
                    evData.nursery,
                    evData.total,
                    evData.date,
                    evData.total_bibit_sostam
                  ),
            details: evData.details,
          });
        });
        console.log(events);
        this.calendar.events = events;
        this.calendar.loading = false;
      }
    },
    async calendarUpdateRangeNew({ start, end }) {
      await this.getUserException();
      if (this.accessModul.calendar) {
        this.calendar.nurseryLoading = true;

        const params = new URLSearchParams({
          month: this.dateFormat(start.date, "MM"),
          year: this.dateFormat(start.date, "Y"),
          program_year: this.generalSettings.programYear,
        });
        let url =
          "https://backend.geninelabs.live/api/custom/data-calendar-distribution?";
        const res = await axios
          .get(url + params, {
            headers: {
              Authorization: `Bearer ` + this.apiConfig.nurseryToken,
            },
          })
          .catch((err) => {
            this.sessionEnd(err);
          });
        const resData = res.data.data;
        const events = [];

        await resData.forEach((evData, evIndex) => {
          events.push({
            mu_no: evData.mu_no,
            start: evData.distribution_date,
            ff_no: evData.ff_no,
            nurseryProgress: evData.progress,
            nurseryTotalSeed: evData.total_seed,
            created_at: evData.created_at,
            color: evData.color,
          });
        });
        // console.log(events)
        this.calendar.nurseryEvents = events;
        this.calendar.nurseryLoading = false;
      }
    },
    // FF
    async getFFMUNo(ff_no) {
      let mu_no = "";
      await axios
        .get(
          this.apiConfig.baseUrl +
            "GetFieldFacilitatorDetail?id=999&ff_no=" +
            ff_no,
          {
            headers: {
              Authorization: `Bearer ` + this.apiConfig.token,
            },
          }
        )
        .then((result) => {
          const res = result.data.data.result;
          if (typeof res.mu_no != "undefined") {
            mu_no = res.mu_no;
          }
        })
        .catch((err) => {
          console.error(err);
        });
      return mu_no;
    },
    // PACKING LABEL
    async getPackingLabelTableData() {
      if (this.accessModul.packingLabel) {
        // reset search by FF input
        this.packingLabel.tables.byLahan.search.items = [];
        this.packingLabel.tables.byLahan.search.model = "";

        let url = "";
        let params = {
          typegetdata: this.User.ff.value_data,
          ff: this.User.ff.ff,
          program_year: this.generalSettings.programYear,
          nursery: this.generalSettings.nursery.model,
          distribution_date: this.packingLabel.datePicker.model,
        };
        if (this.packingLabel.tabs.model == 0) {
          this.packingLabel.tables.byLahan.loading = true;
          url = "GetPackingLabelByLahan?";
          if (this.generalSettings.type.model == "Umum") {
            const nurseryEmails = this.$store.state.nurseryTeam.emails;
            url = "GetPackingLabelLahanUmum?";
            if (
              this.User.role_group == "IT" ||
              this.User.role_name == "REGIONAL MANAGER" ||
              this.User.role_name == "PLANNING MANAGER" ||
              nurseryEmails.Cirasea.includes(this.User.email) ||
              nurseryEmails.Ciminyak.includes(this.User.email) ||
              nurseryEmails.Soreang.includes(this.User.email) ||
              nurseryEmails.Kebumen.includes(this.User.email) ||
              nurseryEmails.Pati.includes(this.User.email)
            ) {
            } else params.created_by = this.User.email;
          }
        }

        if (url && params) {
          const urlParams = new URLSearchParams(params);
          // call api
          await axios
            .get(this.apiConfig.baseUrl + url + urlParams, {
              headers: {
                Authorization: `Bearer ` + this.apiConfig.token,
              },
            })
            .then((res) => {
              const result = res.data.data.result.data;
              this.packingLabel.tables.byLahan.items = result;
              result.forEach((val) => {
                this.packingLabel.tables.byLahan.search.items.push(val.nama_ff);
              });
            })
            .catch((err) => {
              if (err.response.status == 404) {
                this.packingLabel.tables.byLahan.items = [];
              }
              this.sessionEnd(err);
            })
            .finally(() => {
              this.packingLabel.tables.byLahan.loading = false;
            });
        }
      }
    },
    printPackingLabelByLahan(type, id) {
      if (type == "label") {
        window.open(
          this.apiConfig.baseUrl.substring(
            0,
            this.apiConfig.baseUrl.length - 4
          ) +
            "CetakLabelLubangTanam?ph_form_no=" +
            id
        );
      } else if (type == "tanda_terima") {
        window.open(
          this.apiConfig.baseUrl.substring(
            0,
            this.apiConfig.baseUrl.length - 4
          ) +
            "CetakBuktiPenyerahan?ph_form_no=" +
            id
        );
      } else if (type == "label_lahan_umum") {
        window.open(
          this.apiConfig.baseUrl.substring(
            0,
            this.apiConfig.baseUrl.length - 4
          ) +
            "CetakLabelUmumLubangTanam?lahan_no=" +
            id
        );
      } else if (type == "tanda_terima_lahan_umum") {
        window.open(
          this.apiConfig.baseUrl.substring(
            0,
            this.apiConfig.baseUrl.length - 4
          ) +
            "CetakUmumBuktiPenyerahan?lahan_no=" +
            id
        );
      }
    },
    async updateCheckedPlantingHoles(id, status) {
      const nurseryEmails = this.$store.state.nurseryTeam.emails;
      if (
        status == 0 &&
        (this.User.role_group == "IT" ||
          this.User.role_name == "REGIONAL MANAGER" ||
          this.User.role_name == "PLANNING MANAGER" ||
          nurseryEmails.Cirasea.includes(this.User.email) ||
          nurseryEmails.Ciminyak.includes(this.User.email) ||
          nurseryEmails.Soreang.includes(this.User.email) ||
          nurseryEmails.Kebumen.includes(this.User.email) ||
          nurseryEmails.Pati.includes(this.User.email))
      ) {
        this.packingLabel.loadingText =
          "Updating status packing label & creating loading line data...";
        this.packingLabel.loading = true;

        let url = this.apiConfig.baseUrl;
        if (this.generalSettings.type.model == "Petani")
          url += "CheckedPlantingHole?";
        else if (this.generalSettings.type.model == "Umum")
          url += "CreateDistributionLahanUmum";

        let params = {
          program_year: this.generalSettings.programYear,
          ph_form_no: id,
        };
        if (this.generalSettings.type.model == "Umum") {
          params.lahan_no = id;
          const LUData = await axios.get(
            `${this.apiConfig.baseUrl}GetDetailLahanUmum?lahan_no=${id}`,
            {
              headers: {
                Authorization: `Bearer ` + this.apiConfig.token,
              },
            }
          );
          params.mou_no = LUData.data.data.result.mou_no;
        }

        let success = 0;
        try {
          let callApi;
          if (this.generalSettings.type.model == "Petani") {
            callApi = await axios.get(`${url}${new URLSearchParams(params)}`, {
              headers: {
                Authorization: `Bearer ${this.apiConfig.token}`,
              },
            });
          } else if (this.generalSettings.type.model == "Umum") {
            callApi = await axios.post(`${url}`, params, {
              headers: {
                Authorization: `Bearer ${this.apiConfig.token}`,
              },
            });
          }
          if (callApi) success = 1;
        } catch (err) {
          console.log(err.response);
          if (err.response.status == 404 || err.response.status == 400) {
            this.snackbar.text = err.response.data.data.result;
            this.snackbar.color = "red";
            this.snackbar.show = true;
          }
          this.sessionEnd(err);
        } finally {
          this.packingLabel.loading = false;
          this.packingLabel.loadingText = null;
        }

        if (success == 1) {
          this.snackbar.text = `Checked label success.`;
          this.snackbar.color = "green";
          this.snackbar.show = true;
          this.packingLabel.loadingText = "Updating packing label data...";
          this.loadingLine.loadingText = "Waiting...";
          this.loadingLine.loading = true;
          const searchExist = this.packingLabel.tables.byLahan.search.model;
          await this.getPackingLabelTableData();
          this.packingLabel.tables.byLahan.search.model = searchExist;
          this.packingLabel.loadingText = null;

          this.loadingLine.loadingText = "Updating loading line data...";
          await this.getLoadinglineTableData();
          this.loadingLine.loading = false;
          this.loadingLine.loadingText = null;
          // await this.getDistributionReportTable()
          // await this.reportNursery()
          await this.reportNurseryFF();
        }
      } else if (
        this.User.role_group != "IT" ||
        this.User.role_name != "NURSERY" ||
        this.User.role_name != "NURSERY MANAGER"
      ) {
        this.snackbar.text = `Can't use this modul from this user.`;
        this.snackbar.color = "red";
        this.snackbar.show = true;
      } else {
        this.snackbar.text = "Already been checked!";
        this.snackbar.color = "red";
        this.snackbar.show = true;
      }
    },
    // LOADING LINE
    addMoreTransportation() {
      this.loadingLine.detailDialog.transportations.push({
        driver_detail: null,
        loaded_labels: [],
        truck_detail: null,
        progression: 0,
        plat_no: "",
        nik: "",
        total_loaded: 0,
      });
      this.loadingLine.detailDialog.transportationIndex = null;
    },
    async getLoadingLineDetailFFData(id) {
      try {
        this.loadingLine.detailDialog.loadingText =
          "Getting All Labels data...";
        this.loadingLine.detailDialog.loading = true;
        this.loadingLine.detailDialog.show = true;

        // reset
        this.loadingLine.detailDialog.inputs.scanner.farmers = [];
        this.loadingLine.detailDialog.inputs.scanner.values = [];
        this.loadingLine.detailDialog.inputs.scanner.labels = [];
        this.loadingLine.detailDialog.inputs.scanner.alert.show = false;
        this.loadingLine.detailDialog.inputs.scanner.alert.text = ``;
        this.loadingLine.detailDialog.inputs.scanner.alert.color = "";
        this.loadingLine.detailDialog.differentTotalBags = false;
        this.loadingLine.detailDialog.tabs.open = "all";
        this.loadingLine.detailDialog.transportationIndex = null;
        this.loadingLine.detailDialog.transportations = [
          {
            driver_detail: null,
            loaded_labels: [],
            truck_detail: null,
            progression: 0,
            plat_no: "",
            nik: "",
            total_loaded: 0,
          },
        ];

        let url = `${this.apiConfig.baseUrl}GetLoadingLineDetailFF?`;
        const params = {
          ff_no: id,
          program_year: this.generalSettings.programYear,
        };
        if (this.generalSettings.type.model == "Umum") {
          delete params.ff_no;
          params.mou_no = id;
          url = `${this.apiConfig.baseUrl}GetLoadingLineDetailLahanUmum?`;
        }

        const res = await axios.get(`${url + new URLSearchParams(params)}`, {
          headers: {
            Authorization: `Bearer ${this.apiConfig.token}`,
          },
        });

        this.loadingLine.detailDialog.model = res.data;

        const total_farmer = res.data.distribution_details.length;
        let total_farmer_loaded = 0;
        let listLabelDetail = [];
        await res.data.distribution_details.forEach((val) => {
          this.loadingLine.detailDialog.inputs.scanner.labels.push(
            ...val.bags_number
          );
          this.loadingLine.detailDialog.inputs.scanner.values.push(
            ...val.bags_number_loaded
          );
          this.loadingLine.detailDialog.inputs.scanner.farmers.push(val);
          listLabelDetail.push(...val.labels_list);

          if (val.is_loaded == 1) total_farmer_loaded += 1;
        });
        this.loadingLine.detailDialog.listLabelDetail = await listLabelDetail;
        // console.log(listLabelDetail)
        if (total_farmer == total_farmer_loaded)
          this.loadingLine.detailDialog.inputs.disabledSave = true;
        else this.loadingLine.detailDialog.inputs.disabledSave = false;

        // check total_bags doesn't match
        if (
          this.loadingLine.detailDialog.model.total_bags !=
          this.loadingLine.detailDialog.inputs.scanner.labels.length
        ) {
          this.loadingLine.detailDialog.model.total_bags =
            this.loadingLine.detailDialog.inputs.scanner.labels.length;
          this.loadingLine.detailDialog.differentTotalBags = true;
        }
      } catch (err) {
        console.error(err);
        this.sessionEnd(err);
      } finally {
        this.loadingLine.detailDialog.loading = false;
        this.loadingLine.detailDialog.loadingText = null;
      }
    },
    async getLoadinglineTableData() {
      if (this.accessModul.loadingLine) {
        this.loadingLine.table.loading = true;
        let url = "GetLoadingLine?";
        if (this.generalSettings.type.model == "Umum")
          url = "GetLoadingLineLahanUmum?";
        let params = {
          typegetdata: this.User.ff.value_data,
          ff: this.User.ff.ff,
          program_year: this.generalSettings.programYear,
          nursery: this.generalSettings.nursery.model,
          distribution_date: this.loadingLine.datePicker.model,
        };
        await axios
          .get(
            `${this.apiConfig.baseUrl + url + new URLSearchParams(params)}`,
            {
              headers: {
                Authorization: `Bearer ${this.apiConfig.token}`,
              },
            }
          )
          .then((result) => {
            const res = result.data.data.result;
            this.loadingLine.table.items = res;
          })
          .catch((err) => {
            console.error(err);
            this.loadingLine.table.items = [];
            this.sessionEnd(err);
          })
          .finally(() => {
            this.loadingLine.table.loading = false;
          });
      }
    },
    getProgressionColor(progress) {
      if (progress >= 0 && progress < 50) return "orange";
      else if (progress >= 50 && progress < 90) return "blue";
      else if (progress <= 100) return "green";
      else if (progress > 100) return "red";
    },
    async getTransportDetail(type, id, transIndex) {
      if (type && id) {
        try {
          let checkExisting = await this.checkExistingTruckDriver(type, id);
          if (checkExisting === false) {
            this.loadingLine.detailDialog.loading = true;
            this.loadingLine.detailDialog.loadingText = `Getting ${type.toUpperCase()} data...`;
            let url =
              type == "truck"
                ? `GetDetailTruck?plat_no=${id}`
                : type == "driver"
                ? `GetDetailDriver?nik=${id}`
                : null;
            if (url) {
              const res = await this.$_api.get('url')
              if (type == "truck")
                this.loadingLine.detailDialog.transportations[
                  transIndex
                ].truck_detail = res.data.result;
              else if (type == "driver")
                this.loadingLine.detailDialog.transportations[
                  transIndex
                ].driver_detail = res.data.result;
              this.loadingLine.detailDialog.snackbar.color = "green";
              this.loadingLine.detailDialog.snackbar.text = `${type.toUpperCase()} data selected`;
            } else {
              this.loadingLine.detailDialog.snackbar.color = "red";
              this.loadingLine.detailDialog.snackbar.text =
                "Failed to get data!";
            }
          } else {
            this.loadingLine.detailDialog.transportations[transIndex][
              type == "driver" ? "nik" : "plat_no"
            ] = "";
            this.loadingLine.detailDialog.snackbar.color = "orange";
            this.loadingLine.detailDialog.snackbar.text = `Data ${type.toUpperCase()} exist!`;
          }
        } catch (err) {
          this.loadingLine.detailDialog.snackbar.color = "red";
          this.loadingLine.detailDialog.snackbar.text = `Failed to get data ${type.toUpperCase()}!`;

          if (err.response != undefined) this.sessionEnd(err);
          else console.error(err);
        } finally {
          this.loadingLine.detailDialog.snackbar.show = true;
          this.loadingLine.detailDialog.loading = false;
        }
      }
    },
    async checkExistingTruckDriver(type, id) {
      let dataExist =
        await this.loadingLine.detailDialog.transportations.filter(
          (val) => val[type == "driver" ? "nik" : "plat_no"] === id
        );
      if (dataExist.length > 1) return true;
      else return false;
    },
    async FinishLoadedDistributionBagsNumber(ff_no) {
      this.loadingLine.detailDialog.show = false;
      this.$store.state.loadingOverlayText = "Finishing loading bags data...";
      this.$store.state.loadingOverlay = true;

      const url = `${this.apiConfig.baseUrl}FinishLoadingBagsDistributions`;

      await axios
        .post(
          url,
          {
            ff_no: ff_no,
            program_year: this.generalSettings.programYear,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiConfig.token}`,
            },
          }
        )
        .then((res) => {
          this.snackbar.color = "green";
          this.snackbar.text = "Finishing loading bags succeed!";
          this.loadingLine.detailDialog.inputs.scanner.values = [];
          this.getLoadinglineTableData();
        })
        .catch((err) => {
          this.snackbar.color = "red";
          this.snackbar.text = err.response.data;
          console.error(err);
          this.sessionEnd(err);
        })
        .finally(() => {
          this.$store.state.loadingOverlay = false;
          this.$store.state.loadingOverlayText = null;
          this.snackbar.show = true;
        });
    },
    async startScanningAfterSelectingTransportation(transIndex) {
      this.loadingLine.detailDialog.transportationIndex = await transIndex;
      setTimeout(() => {
        this.$refs.scanLabelLoadingInput.focus();
      }, 100);
    },
    async UpdateLoadedDistributionBagsNumber(id) {
      this.loadingLine.detailDialog.show = false;
      this.$store.state.loadingOverlayText = "Updating loaded labels data...";
      this.$store.state.loadingOverlay = true;

      let url = `${this.apiConfig.baseUrl}LoadedDistributionBagsNumber`;
      let dataToPost = {
        bags_number: this.loadingLine.detailDialog.inputs.scanner.values,
        ff_no: id,
        transportation: this.loadingLine.detailDialog.transportations,
        program_year: this.generalSettings.programYear,
      };
      if (this.generalSettings.type.model == "Umum") {
        url = `${this.apiConfig.baseUrl}UpdatedLoadingLahanUmum`;
        delete dataToPost.ff_no;
        dataToPost.mou_no = id;
      }

      await this.$_api
        .post(url, dataToPost)
        .then((res) => {
          this.snackbar.color = "green";
          this.snackbar.text = "Updating labels loaded succeed!";
          this.loadingLine.detailDialog.inputs.scanner.values = [];
          this.getLoadinglineTableData();
        })
        .catch((err) => {
          this.snackbar.color = "red";
          this.snackbar.text = err.response.data;
          console.error(err);
          this.sessionEnd(err);
        })
        .finally(() => {
          this.$store.state.loadingOverlay = false;
          this.$store.state.loadingOverlayText = null;
          this.snackbar.show = true;
        });
    },
    // DISTRIBUTION REPORT
    async getDistributionReportTable() {
      if (this.accessModul.distributionReport == true) {
        // this.distributionReport.table.loading = true
        let url = "GetDistributionReport?";
        if (this.generalSettings.type.model == "Umum")
          url = "GetUmumDistributionReport?";
        let params = {
          typegetdata: this.User.ff.value_data,
          ff: this.User.ff.ff,
          program_year: this.generalSettings.programYear,
          nursery: this.generalSettings.nursery.model,
          distribution_date: this.distributionReport.datePicker.model,
        };
        if (this.generalSettings.type.model == "Umum") {
          if (
            this.User.role_group != "IT" &&
            this.User.role_name != "PROGRAM MANAGER" &&
            this.User.role_name != "REGIONAL MANAGER"
          )
            params.created_by = this.User.email;
        }
        await axios
          .get(
            `${this.apiConfig.baseUrl + url + new URLSearchParams(params)}`,
            {
              headers: {
                Authorization: `Bearer ${this.apiConfig.token}`,
              },
            }
          )
          .then((result) => {
            const res = result.data.data.result;
            this.distributionReport.table.items = res;
          })
          .catch((err) => {
            console.error(err);
            this.distributionReport.table.items = [];
            this.sessionEnd(err);
          })
          .finally(() => {
            // this.distributionReport.table.loading = false
          });
      }
    },
    // async newDetailDistributionReport(item){
    //     this.distributionReport.dialogs.detail  = {
    //             farmer_signature_photo: item.file_signature.url,
    //             distribution_photo: item.file_accept.url,
    //             farmerNo: item.farmer_no,
    //             adjustment: item.detail_seed_farmers,
    //             data: item,
    //             disabledSave: true,
    //             labels: {
    //                 printed: item.detail_labels,
    //                 loaded: item.detail_labels.filter(v => v.is_loaded == 1),
    //                 distributed: item.detail_labels.filter(v => v.is_distributed == 1),
    //                 lost: item.detail_labels.filter(v => v.is_loaded == 1 && v.is_distributed == 0),
    //             },
    //             loading: false,
    //             loadingText: null,
    //             show: true
    //         }
    //     this.distributionReport.dialogs.detail.totalSeedArrival = this.distributionReport.dialogs.detail.labels.distributed.length + this.distributionReport.dialogs.detail.labels.lost.length
    // },
    async DetailDistributionReportFarmer(item) {
      console.log(item);
      this.distributionReport.dialogs.detailUmum.farmer_signature_photo = null;
      this.distributionReport.dialogs.detailUmum.distribution_photo = null;
      if (item.farmer_no.includes("F")) {
        console.log("if condition");
        this.distributionReport.dialogs.detail = {
          farmer_signature_photo: item.file_signature.url,
          distribution_photo: item.file_accept.url,
          farmerNo: item.farmer_no,
          adjustment: item.detail_seed_farmers,
          data: item,
          disabledSave: true,
          labels: {
            printed: item.detail_labels,
            loaded: item.detail_labels.filter((v) => v.is_loaded == 1),
            distributed: item.detail_labels.filter(
              (v) => v.is_distributed == 1
            ),
            lost: item.detail_labels.filter(
              (v) => v.is_loaded == 1 && v.is_distributed == 0
            ),
          },
          loading: false,
          loadingText: null,
          show: true,
        };
        this.distributionReport.dialogs.detail.totalSeedArrival =
          this.distributionReport.dialogs.detail.labels.distributed.length +
          this.distributionReport.dialogs.detail.labels.lost.length;
      } else {
        console.log("else condition");
        this.distributionReport.dialogs.detailUmum = {
          farmerNo: item.farmer_no,
          adjustment: item.detail_seed_farmers,
          data: item,
          disabledSave: true,
          labels: {
            printed: item.detail_labels,
            loaded: item.detail_labels.filter((v) => v.is_loaded == 1),
            distributed: item.detail_labels.filter(
              (v) => v.is_distributed == 1
            ),
            lost: item.detail_labels.filter(
              (v) => v.is_loaded == 1 && v.is_distributed == 0
            ),
          },
          loading: false,
          loadingText: null,
          show: true,
        };
        this.distributionReport.dialogs.detailUmum.totalSeedArrival =
          this.distributionReport.dialogs.detailUmum.labels.distributed.length +
          this.distributionReport.dialogs.detailUmum.labels.lost.length;
        if (item.file_signature == null && item.file_accept == null) {
          this.distributionReport.dialogs.detailUmum.farmer_signature_photo =
            null;
          this.distributionReport.dialogs.detailUmum.distribution_photo = null;
        } else {
          this.distributionReport.dialogs.detailUmum.farmer_signature_photo =
            item.file_signature.url;
          this.distributionReport.dialogs.detailUmum.distribution_photo =
            item.file_accept.url;
        }
        this.distributionReport.dialogs.inputAdjustDetailLables.menuItem =
          this.distributionReport.dialogs.detailUmum.labels.loaded.map(
            (val) => {
              return {
                bag_id: val.id,
                bag_tree_name: val.rel_tree_id,
                amount_in_bag: val.amount,
              };
            }
          );
        this.distributionReport.dialogs.inputAdjustDetailLables.distribution_date =
          item.distribution_date;
        this.distributionReport.dialogs.inputAdjustDetailLables.id = item.id;
        console.log(
          this.distributionReport.dialogs.inputAdjustDetailLables.menuItem
        );
      }
    },
    async getDistributionReportDetail(distribution_no) {
      let url = `${this.apiConfig.baseUrl}`;
      if (this.generalSettings.type.model == "Petani")
        url += `GetDetailDistributionReport?distribution_no=${distribution_no}`;
      else if (this.generalSettings.type.model == "Umum")
        url += `GetUmumDistributionDetailReport?distribution_no=${distribution_no}`;
      this.$store.state.loadingOverlayText =
        "Getting distribution report detail...";
      this.$store.state.loadingOverlay = true;

      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${this.apiConfig.token}`,
          },
        })
        .then((res) => {
          const datas = res.data.data.result;
          // console.log(datas)

          // reset data ???????????????????????????? its weird T_T __________________________________________ IT'S SOLVED! WKWKWK :)
          this.distributionReport.dialogs.detail = {
            adjustment: [],
            data: datas,
            disabledSave: true,
            labels: {
              printed: [],
              loaded: [],
              distributed: [],
              lost: [],
            },
            loading: false,
            loadingText: null,
            show: false,
          };

          // get list lahan with label
          let labelLahan = [];
          datas.distributionDetail.forEach((label, labelIndex) => {
            // push labelLahan
            const labelSplit = label.bag_number.split("-");
            let checkExistLahanNo = labelLahan.find(
              (lblLhn) => lblLhn.lahan_no === labelSplit[1]
            );
            const dataLabel = {
              lahan_no: labelSplit[1],
              bag_numbers: [
                {
                  bag_number: label.bag_number,
                  tree_category: label.tree_category,
                  tree_name: label.tree_name,
                  tree_amount: label.tree_amount,
                  is_distributed: label.is_distributed,
                },
              ],
            };
            if (!checkExistLahanNo) {
              // create new lahan
              labelLahan.push(dataLabel);
            } else {
              // update exist lahan
              labelLahan[labelLahan.length - 1].bag_numbers.push(
                dataLabel.bag_numbers[0]
              );
            }

            // push printed Label
            this.getPrintedLabelsPerActivities(label, "printed");
            this.getPrintedLabelsPerActivities(label, "loaded");
            this.getPrintedLabelsPerActivities(label, "distributed");
            this.getPrintedLabelsPerActivities(label, "lost");
          });
          // set to tree adjustment data
          if (datas.distributionAdjustment.length < 1) {
            this.getTreeAdjustmentData(labelLahan);
          } else {
            datas.distributionAdjustment.forEach((adj, adjIndex) => {
              let checkExistLahanNo =
                this.distributionReport.dialogs.detail.adjustment.findIndex(
                  (lblLhn) => lblLhn.lahan_no === adj.lahan_no
                );
              const pushData = {
                lahan_no: adj.lahan_no,
                items: [
                  {
                    tree_category: adj.tree_category,
                    tree_name: adj.tree_name,
                    total_distributed: parseInt(adj.total_distributed),
                    broken_seeds: parseInt(adj.broken_seeds),
                    missing_seeds: parseInt(adj.missing_seeds),
                    total_tree_received: parseInt(adj.total_tree_received),
                  },
                ],
              };
              if (checkExistLahanNo > -1)
                this.distributionReport.dialogs.detail.adjustment[
                  checkExistLahanNo
                ].items.push(pushData.items[0]);
              else
                this.distributionReport.dialogs.detail.adjustment.push(
                  pushData
                );
            });
          }
          // get total received
          const total_received = this.getTotalReceived();
          if (total_received > 0)
            this.distributionReport.dialogs.detail.disabledSave = false;
          else this.distributionReport.dialogs.detail.disabledSave = true;

          if (
            datas.status == 1 &&
            this.User.role_group != "IT" &&
            this.User.role_name != "UNIT MANAGER"
          )
            this.distributionReport.dialogs.detail.disabledSave = true;

          if (datas.status > 1)
            this.distributionReport.dialogs.detail.disabledSave = true;

          this.distributionReport.dialogs.detail.show = true;
        })
        .catch((err) => {
          console.error(err);
          this.sessionEnd(err);
        })
        .finally(() => {
          this.$store.state.loadingOverlay = false;
          this.$store.state.loadingOverlayText = null;
        });
    },
    async onScannedLahanUmumLabel(newLabel) {
      let audio = null;
      try {
        this.distributionReport.dialogs.scanLahanUmum.scan.lastScanned =
          newLabel;
        const existsScannedLabel =
          this.distributionReport.dialogs.scanLahanUmum.scan.scanned;
        const labels =
          this.distributionReport.dialogs.scanLahanUmum.scan.labels;
        if (
          existsScannedLabel.includes(newLabel) == false &&
          labels.includes(newLabel) == true
        ) {
          this.distributionReport.dialogs.scanLahanUmum.scan.scanned.push(
            newLabel
          );

          this.distributionReport.dialogs.scanLahanUmum.loading = true;
          this.distributionReport.dialogs.scanLahanUmum.loadingText = `Saving label "${newLabel}"...`;
          const updated = await axios.post(
            `${this.apiConfig.baseUrl}UpdatedDistributionLahanUmum`,
            {
              mou_no: this.distributionReport.dialogs.detail.data.mou_no,
              bags_number:
                this.distributionReport.dialogs.scanLahanUmum.scan.scanned,
              program_year: this.generalSettings.programYear,
            },
            {
              headers: {
                Authorization: `Bearer ${this.apiConfig.token}`,
              },
            }
          );

          if (updated) {
            this.distributionReport.dialogs.scanLahanUmum.scan.alert.text = `Label "${newLabel}" scaned & saved!`;
            this.distributionReport.dialogs.scanLahanUmum.scan.alert.color =
              "green";

            // update labels left
            await this.distributionReport.dialogs.scanLahanUmum.scan.labelsLeft.forEach(
              (val, index) => {
                if (val.bag_number == newLabel)
                  this.distributionReport.dialogs.scanLahanUmum.scan.labelsLeft.splice(
                    index,
                    1
                  );
              }
            );
            audio = new Audio(require("@/assets/audio/success.mp3"));
          } else {
            this.distributionReport.dialogs.scanLahanUmum.scan.alert.text = `Label "${newLabel}" FAILED to save!`;
            this.distributionReport.dialogs.scanLahanUmum.scan.alert.color =
              "red";
            audio = new Audio(require("@/assets/audio/error.mp3"));
          }
          this.distributionReport.dialogs.scanLahanUmum.loadingText = null;
          this.distributionReport.dialogs.scanLahanUmum.loading = false;

          // console.log(this.distributionReport.dialogs.scanLahanUmum.scan.labelsLeft.length)
          // console.log(this.distributionReport.dialogs.detail.labels.lost.length)
        } else if (existsScannedLabel.includes(newLabel) == true) {
          audio = new Audio(require("@/assets/audio/error.mp3"));

          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text = `Label "${newLabel}" has been already scaned!`;
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.color =
            "red";
        } else if (labels.includes(newLabel) == false) {
          audio = new Audio(require("@/assets/audio/error.mp3"));

          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text = `Label "${newLabel}" not included in this FF!`;
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.color =
            "red";
        }
      } catch (err) {
        this.sessionEnd(err);
      } finally {
        await audio.play();
        this.distributionReport.dialogs.scanLahanUmum.scan.alert.show = true;
        this.distributionReport.dialogs.scanLahanUmum.scan.model = "";
      }
    },
    async openModalScanLahanUmum() {
      // set Labels Left
      this.distributionReport.dialogs.scanLahanUmum.scan.labelsLeft = [];
      await this.distributionReport.dialogs.detail.labels.lost.forEach(
        (val) => {
          this.distributionReport.dialogs.scanLahanUmum.scan.labelsLeft.push(
            val
          );
        }
      );
      // get array labels
      this.distributionReport.dialogs.scanLahanUmum.scan.labels = [];
      await this.distributionReport.dialogs.detail.labels.loaded.forEach(
        (val) => {
          this.distributionReport.dialogs.scanLahanUmum.scan.labels.push(
            val.bag_number
          );
        }
      );
      // get array scanned
      this.distributionReport.dialogs.scanLahanUmum.scan.scanned = [];
      await this.distributionReport.dialogs.detail.labels.distributed.forEach(
        (val) => {
          this.distributionReport.dialogs.scanLahanUmum.scan.scanned.push(
            val.bag_number
          );
        }
      );
      // set exist photo
      this.distributionReport.dialogs.scanLahanUmum.photo.model = null;
      if (this.distributionReport.dialogs.detail.data.distribution_photo) {
        this.distributionReport.dialogs.scanLahanUmum.photo.preview = `${this.apiConfig.imageUrl}${this.distributionReport.dialogs.detail.data.distribution_photo}`;
      }
      // console.log(this.distributionReport.dialogs.detail.data)
      this.distributionReport.dialogs.scanLahanUmum.show = true;
      this.distributionReport.dialogs.scanLahanUmum.scan.lastScanned = null;
    },
    async saveAdjustmentAndVerification() {
      let url = `${this.apiConfig.baseUrl}CreateAdjustment`;

      const distributionData = this.distributionReport.dialogs.detail.data;
      const distributionNoSplit = distributionData.distribution_no.split("-");

      let listSeedling = [];
      this.distributionReport.dialogs.detail.adjustment.forEach((lahan) => {
        lahan.items.forEach((item) => {
          listSeedling.push({
            lahan_no: lahan.lahan_no,
            ...item,
          });
        });
      });
      let postData = {
        program_year: distributionNoSplit[1],
        distribution_no: distributionData.distribution_no,
        approved_by: this.User.email,
        ff_no: distributionData.ff_no,
        farmer_no: distributionData.farmer_no,
        list_trees: listSeedling,
        adjust_date: moment().format("Y-MM-DD"),
      };
      if (this.generalSettings.type.model == "Umum") {
        delete postData.ff_no;
        delete postData.farmer_no;

        url = `${this.apiConfig.baseUrl}CreateLahanUmumAdjustment`;
      }
      // console.log(postData)
      this.distributionReport.dialogs.detail.show = false;
      this.$store.state.loadingOverlayText =
        "Saving & creating adjustment data...";
      this.$store.state.loadingOverlay = true;

      await axios
        .post(url, postData, {
          headers: {
            Authorization: `Bearer ${this.apiConfig.token}`,
          },
        })
        .then((res) => {
          this.snackbar.text = "Success!";
          this.snackbar.color = "green";
          this.getDistributionReportTable();
        })
        .catch((err) => {
          this.snackbar.text = "Failed!";
          this.snackbar.color = "red";
          this.sessionEnd(err);
          this.distributionReport.dialogs.detail.show = true;
        })
        .finally(() => {
          this.snackbar.show = true;
          this.$store.state.loadingOverlay = false;
          this.$store.state.loadingOverlayText = null;
        });
    },
    percentageFormat(partial, total) {
      return ((partial * 100) / total).toFixed(2);
    },
    async saveScannedDistribution() {
      let url = this.apiConfig.baseUrl + "UpdatedDistributionLahanUmum";
      const luData = this.distributionReport.dialogs.detail.data;
      // console.log(luData)
      let data = {
        mou_no: luData.mou_no,
        bags_number: this.distributionReport.dialogs.scanLahanUmum.scan.scanned,
        program_year: this.generalSettings.programYear,
      };
      this.distributionReport.dialogs.scanLahanUmum.show = false;
      this.distributionReport.dialogs.detail.show = false;
      this.$store.state.loadingOverlay = true;
      if (this.distributionReport.dialogs.scanLahanUmum.photo.model) {
        data.distribution_photo = await this.uploadPhotos(
          `${luData.mou_no
            .replace(/\s/g, "")
            .replaceAll("/", "_")}-${moment().valueOf()}`,
          this.distributionReport.dialogs.scanLahanUmum.photo.model
        );
      }
      this.$store.state.loadingOverlayText = "Saving distributed labels...";
      // console.log(data)
      await axios
        .post(url, data, this.apiConfig.config)
        .then((res) => {
          this.snackbar.text = res.data;
          this.snackbar.color = "green";
          this.getDistributionReportTable();
        })
        .catch((err) => {
          this.snackbar.text = err.response.data;
          this.snackbar.color = "red";
          this.sessionEnd(err);
        })
        .finally(() => {
          this.snackbar.show = true;
          this.$store.state.loadingOverlayText = null;
          this.$store.state.loadingOverlay = false;
        });
    },
    async verificationDistributionByUM() {
      const url = `${this.apiConfig.baseUrl}DistributionVerificationUM`;
      const distributionData = this.distributionReport.dialogs.detail.data;

      let listSeedling = [];
      await this.distributionReport.dialogs.detail.adjustment.forEach(
        (lahan) => {
          lahan.items.forEach((item) => {
            listSeedling.push({
              lahan_no: lahan.lahan_no,
              ...item,
            });
          });
        }
      );

      const postData = {
        distribution_no: distributionData.distribution_no,
        approved_by: this.User.email,
        list_trees: listSeedling,
      };

      this.distributionReport.dialogs.detail.show = false;
      this.$store.state.loadingOverlayText = `Verifying distribution report...`;
      this.$store.state.loadingOverlay = true;

      await axios
        .post(url, postData, {
          headers: {
            Authorization: `Bearer ${this.apiConfig.token}`,
          },
        })
        .then((res) => {
          this.snackbar.text = `Verification success!`;
          this.snackbar.color = "green";
          this.getDistributionReportTable();
        })
        .catch((err) => {
          console.error(err);
          this.snackbar.text = `Verification failed!`;
          this.snackbar.color = "red";
          this.distributionReport.dialogs.detail.show = true;
          this.sessionEnd(err);
        })
        .finally(() => {
          this.snackbar.show = true;
          this.$store.state.loadingOverlay = false;
          this.$store.state.loadingOverlayText = null;
        });
    },
    async verificationDistributionByPM() {
      const url = `${this.apiConfig.baseUrl}DistributionVerificationPM`;
      const distributionData = this.distributionReport.dialogs.detail.data;

      let listSeedling = [];
      await this.distributionReport.dialogs.detail.adjustment.forEach(
        (lahan) => {
          lahan.items.forEach((item) => {
            listSeedling.push({
              lahan_no: lahan.lahan_no,
              ...item,
            });
          });
        }
      );

      const postData = {
        distribution_no: distributionData.distribution_no,
        approved_by: this.User.email,
        list_trees: listSeedling,
      };

      this.distributionReport.dialogs.detail.show = false;
      this.$store.state.loadingOverlayText = `Verifying distribution report...`;
      this.$store.state.loadingOverlay = true;

      await axios
        .post(url, postData, {
          headers: {
            Authorization: `Bearer ${this.apiConfig.token}`,
          },
        })
        .then((res) => {
          this.snackbar.text = `Verification success!`;
          this.snackbar.color = "green";
          this.getDistributionReportTable();
        })
        .catch((err) => {
          console.error(err);
          this.snackbar.text = `Verification failed!`;
          this.snackbar.color = "red";
          this.distributionReport.dialogs.detail.show = true;
          this.sessionEnd(err);
        })
        .finally(() => {
          this.snackbar.show = true;
          this.$store.state.loadingOverlay = false;
          this.$store.state.loadingOverlayText = null;
        });
    },
    // UTILITIES
    calendarGetNurseryColor(n, total, date, totalSeed) {
      let maxFF = this.calendarGetMaxFF(n, date);
      let maxSeed = this.calendarGetMaxSeed(n);

      if (total > maxFF || maxSeed < totalSeed) {
        return "red";
      } else if (total === maxFF || maxSeed === totalSeed) {
        return "green";
      } else {
        return "yellow";
      }
    },
    calendarGetMaxSeed(n) {
      if (["Cirasea", "Soreang"].includes(n)) {
        return 40000;
      } else if ("Ciminyak") {
        return 50000;
      } else if (["Pati", "Kebumen"]) {
        return 25000;
      }
    },
    calendarGetMaxFF(n, date) {
      if (this.generalSettings.programYear == "2022") {
        if (n == "Arjasari") {
          if (date >= "2022-12-21" && date <= "2022-12-31") {
            return 8;
          } else if (date >= "2023-01-01" && date <= "2023-01-31") {
            return 5;
          } else return 4;
        } else if (n == "Ciminyak") {
          if (date >= "2022-12-21" && date <= "2022-12-31") {
            return 8;
          } else return 4;
        } else if (n == "Kebumen" || n == "Pati") {
          return 2;
        } else if (n == "Cirasea") {
          return 7;
        } else return 4;
      } else if (this.generalSettings.programYear == "2023") {
        if (["Ciminyak", "Cirasea", "Soreang", "Pati"]) {
          return 7;
        } else {
          return 4;
        }
      }
    },
    async confirmationOk(okText) {
      this.confirmation.show = false;
      if (okText == "Check Label") {
        await this.updateCheckedPlantingHoles(
          this.confirmation.model.id,
          this.confirmation.model.status
        );
      } else if (okText == "Save & Verif") {
        await this.saveAdjustmentAndVerification();
      } else if (okText == "Verification") {
        await this.verificationDistributionByUM();
      } else if (okText == "Verification PM") {
        await this.verificationDistributionByPM();
      }
    },
    confirmationShow(type, data) {
      this.confirmation.type = null;
      if (type == "Check Label") {
        if (data.is_checked == 0) {
          this.confirmation.title = `Do u want to check this label? This can't be undone!`;
          this.confirmation.okText = "Check Label";
          this.confirmation.show = true;
          this.confirmation.model = {
            id:
              this.generalSettings.type.model == "Petani"
                ? data.ph_form_no
                : data.lahan_no,
            status: data.is_checked,
          };
        } else {
          this.snackbar.text = "Already been checked!";
          this.snackbar.color = "red";
          this.snackbar.show = true;
        }
      } else if (type == "Alert Penlub") {
        this.confirmation.type = "Alert";
        this.confirmation.title = `Please check ur data "Lubang Tanam" in ${data.lahan_no}! Total SEEDLING > HOLES`;
        this.confirmation.okText = "Ok Syap";
        this.confirmation.show = true;
      } else if (type == "Save & Verif") {
        this.confirmation.title = `Do u want to SAVE & VERIFICATION this distribution? This can't be undone!`;
        this.confirmation.okText = "Save & Verif";
        this.confirmation.show = true;
      } else if (type == "Verified UM") {
        this.confirmation.title = `Do u want to VERIFICATION this distribution? This can't be undone!`;
        this.confirmation.okText = "Verification";
        this.confirmation.show = true;
      } else if (type == "Verified Pak Pandu") {
        this.confirmation.title = `Do u want to VERIFICATION this distribution? This can't be undone!`;
        this.confirmation.okText = "Verification PM";
        this.confirmation.show = true;
      }
    },
    dateFormat(date, format) {
      return moment(date).format(format);
    },
    exportExcel(type, data = null) {
      let url = null;
      if (type == "bibit_by_ff") {
        const params = new URLSearchParams({
          ff_no: data.datas.FF.toString(),
          program_year: data.datas.program_year,
          activity: data.datas.activity,
          distribution_date: data.distribution_date,
        });
        url =
          this.$store.state.apiUrl.replace("/api/", "/") +
          "ExportBibitExcel?" +
          params;
      } else if (type == "bibit_by_lahan") {
        const params = new URLSearchParams({
          lahan_no: data.datas.lahan_no.toString(),
          program_year: data.datas.program_year,
          activity: data.datas.activity,
          distribution_date: data.distribution_date,
        });
        url =
          this.$store.state.apiUrl.replace("/api/", "/") +
          "ExportBibitLahanUmumExcel?" +
          params;
      } else if (type == "distribution_report") {
        const params = new URLSearchParams({
          program_year: this.generalSettings.programYear,
          distribution_date: this.distributionReport.datePicker.model,
          nursery: this.generalSettings.nursery.model,
        });
        const role_name = this.User.role_name;
        const role_group = this.User.role_group;
        if (this.generalSettings.type.model == "Umum") {
          const managers = [
            "PROGRAM MANAGER",
            "REGIONAL MANAGER",
            "NURSERY MANAGER",
            "NURSERY",
          ];
          if (!managers.includes(role_name) && role_group != "IT")
            params.set("created_by", this.User.email);
        } else {
          const ff = this.User.ff.ff;
          if (ff) if (ff != "-") params.set("ff", ff.toString());
        }
        url =
          this.$store.state.apiUrl.replace("/api/", "/") +
          `ExportDistributionReport?${params}`;
        if (this.generalSettings.type.model == "Umum")
          url = url.replace("Report?", "ReportLahanUmum?");
        // console.log(this.generalSettings.type.model)
        // console.log(url)
      }

      if (url) window.open(url, "blank");
    },
    async firstAccessPage() {
      this.packingLabel.loadingText = "Getting packing label data...";
      this.packingLabel.loading = true;
      this.loadingLine.loadingText =
        "Waiting for completed get packing label data...";
      this.loadingLine.loading = true;
      this.distributionReport.loadingText =
        "Waiting for completed get packing label data...";
      this.distributionReport.loading = true;

      this.distributionReport.dialogs.exportFilter.user_ff_list =
        this.User.ff.ff;
      await this.getFFOptions();

      // await this.reportNursery()
      await this.reportNurseryFF();

      await this.getPackingLabelTableData();
      this.packingLabel.loading = false;
      this.packingLabel.loadingText = null;
      this.loadingLine.loadingText = "Getting loading line data...";
      this.distributionReport.loadingText =
        "Waiting for completed get loading line data...";
      await this.getLoadinglineTableData();
      this.loadingLine.loading = false;
      this.loadingLine.loadingText = null;
      this.distributionReport.loadingText =
        "Getting distribution report data...";
      await this.getDistributionReportTable();
      this.distributionReport.loading = false;
      this.distributionReport.loadingText = null;
    },
    async getFFOptions() {
      try {
        const params = new URLSearchParams({
          typegetdata: "several",
          ff: this.distributionReport.dialogs.exportFilter.user_ff_list.join(),
          program_year: this.generalSettings.programYear,
        });

        const res = await axios.get(
          this.apiConfig.baseUrl + `getFFOptionsSostam?${params}`,
          {
            headers: {
              Authorization: `Bearer ${this.apiConfig.token}`,
            },
          }
        );
        this.distributionReport.dialogs.exportFilter.ff_item =
          res.data.data.result;
      } catch (err) {
        console.log(err.response);
      } finally {
      }
    },
    generateFormData(data) {
      let formData = new FormData();

      const objectArray = Object.entries(data);

      objectArray.forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.map((item) => {
            formData.append(key + "[]", item);
          });
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    },
    getNumberBagsLeft(all, loaded) {
      let leftData = [];
      all.forEach((val) => {
        if (loaded.includes(val) == false) {
          leftData.push(val);
        }
      });
      return leftData;
    },
    getNurseryAlocation(mu_no) {
      const soreang = ["020", "021"];
      const ciminyak = ["023", "026", "027"];
      const cirasea = ["022", "024", "025", "029"];
      const kebumen = ["019"];
      const pati = ["015", "016", "028"];

      let nursery = "All";
      console.log(mu_no);

      if (ciminyak.includes(mu_no)) {
        nursery = "Ciminyak";
      } else if (cirasea.includes(mu_no)) {
        nursery = "Cirasea";
      } else if (kebumen.includes(mu_no)) {
        nursery = "Kebumen";
      } else if (pati.includes(mu_no)) {
        nursery = "Pati";
      } else if (soreang.includes(mu_no)) {
        nursery = "Soreang";
      }

      return nursery;
    },
    getPrintedLabelsPerActivities(label, type) {
      try {
        // printed label
        const dataLabelPush = {
          bag_number: label.bag_number,
          tree_category: label.tree_category,
          tree_list: [
            {
              tree_name: label.tree_name,
              tree_amount: label.tree_amount,
            },
          ],
          is_loaded: label.is_loaded,
          loaded_by: label.loaded_by,
          is_distributed: label.is_distributed,
          distributed_by: label.distributed_by,
        };
        if (type == "printed") {
          // push to printed label data
          const existPrintedLabel =
            this.distributionReport.dialogs.detail.labels.printed.find(
              (lbl) => lbl.bag_number == label.bag_number
            );
          if (!existPrintedLabel)
            this.distributionReport.dialogs.detail.labels.printed.push(
              dataLabelPush
            );
          else {
            this.distributionReport.dialogs.detail.labels.printed[
              this.distributionReport.dialogs.detail.labels.printed.length - 1
            ].tree_list.push(dataLabelPush.tree_list[0]);
          }
        } else if (type == "loaded") {
          // push to loaded bags
          if (dataLabelPush.is_loaded == 1) {
            const existLoadedLabel =
              this.distributionReport.dialogs.detail.labels.loaded.find(
                (lbl) => lbl.bag_number == label.bag_number
              );
            if (!existLoadedLabel)
              this.distributionReport.dialogs.detail.labels.loaded.push(
                dataLabelPush
              );
            else {
              this.distributionReport.dialogs.detail.labels.loaded[
                this.distributionReport.dialogs.detail.labels.loaded.length - 1
              ].tree_list.push(dataLabelPush.tree_list[0]);
            }
          }
        } else if (type == "distributed") {
          // push to distributed bags
          if (dataLabelPush.is_distributed == 1) {
            const existDistributedLabel =
              this.distributionReport.dialogs.detail.labels.distributed.find(
                (lbl) => lbl.bag_number == label.bag_number
              );
            if (!existDistributedLabel)
              this.distributionReport.dialogs.detail.labels.distributed.push(
                dataLabelPush
              );
            else {
              this.distributionReport.dialogs.detail.labels.distributed[
                this.distributionReport.dialogs.detail.labels.distributed
                  .length - 1
              ].tree_list.push(dataLabelPush.tree_list[0]);
            }
          }
        } else if (type == "lost") {
          // push to lost bags
          if (
            dataLabelPush.is_loaded == 1 &&
            dataLabelPush.is_distributed == 0
          ) {
            const existLostLabel =
              this.distributionReport.dialogs.detail.labels.lost.find(
                (lbl) => lbl.bag_number == label.bag_number
              );
            if (!existLostLabel)
              this.distributionReport.dialogs.detail.labels.lost.push(
                dataLabelPush
              );
            else {
              this.distributionReport.dialogs.detail.labels.lost[
                this.distributionReport.dialogs.detail.labels.lost.length - 1
              ].tree_list.push(dataLabelPush.tree_list[0]);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    getTotalReceived() {
      let received = 0;
      this.distributionReport.dialogs.detail.adjustment.forEach((adj) => {
        adj.items.forEach((item) => {
          received += parseInt(item.total_tree_received);
        });
      });
      // console.log(received)
      return received;
    },
    getTreeAdjustmentData(data) {
      // this.distributionReport.dialogs.detail.adjustment
      // console.log(data)
      data.forEach((lahan, lahanIndex) => {
        this.distributionReport.dialogs.detail.adjustment[lahanIndex] = {
          lahan_no: lahan.lahan_no,
          items: [],
        };
        lahan.bag_numbers.forEach((bag, bagIndex) => {
          if (bag.is_distributed == 1) {
            const pushData = {
              tree_category: bag.tree_category,
              tree_name: bag.tree_name,
              total_distributed: parseInt(bag.tree_amount),
              broken_seeds: 0,
              missing_seeds: 0,
              total_tree_received: parseInt(bag.tree_amount),
            };
            const existingTreeIndex =
              this.distributionReport.dialogs.detail.adjustment[
                lahanIndex
              ].items.findIndex(
                (existAdjTree) => existAdjTree.tree_name == bag.tree_name
              );
            if (existingTreeIndex > -1) {
              this.distributionReport.dialogs.detail.adjustment[
                lahanIndex
              ].items[existingTreeIndex].total_distributed += parseInt(
                bag.tree_amount
              );
              this.distributionReport.dialogs.detail.adjustment[
                lahanIndex
              ].items[existingTreeIndex].total_tree_received += parseInt(
                bag.tree_amount
              );
            } else {
              this.distributionReport.dialogs.detail.adjustment[
                lahanIndex
              ].items.push(pushData);
            }
          }
        });
      });
      // console.log(this.distributionReport.dialogs.detail.adjustment)
    },
    async getUserException() {
      if (
        this.User.role_name == "UNIT MANAGER" ||
        this.User.role_name == "FIELD COORDINATOR"
      ) {
        if (typeof this.User.ff.ff[0] != "undefined") {
          this.$store.state.loadingOverlayText = "Nursery Alocation...";
          this.$store.state.loadingOverlay = true;
          const mu_no = await this.getFFMUNo(this.User.ff.ff[0]);
          this.generalSettings.nursery.model = this.getNurseryAlocation(mu_no);
          this.generalSettings.nursery.disabled = true;

          // access modul: Field Coordinator
          // if (this.User.role_name == 'FIELD COORDINATOR') {
          //     this.accessModul = {
          //         calendar: false,
          //         packingLabel: false,
          //         loadingLine: false,
          //         distributionReport: true
          //     }
          //     this.expansions.model = [0]
          // }

          this.$store.state.loadingOverlay = false;
          this.$store.state.loadingOverlayText = null;
        }
      } else {
        const nurserySite = [
          "Cirasea",
          "Soreang",
          "Ciminyak",
          "Kebumen",
          "Pati",
        ];
        console.log("nursery site ", this.$store.state.nurseryTeam.emails);
        await nurserySite.forEach((val) => {
          if (
            this.$store.state.nurseryTeam.emails[val].includes(this.User.email)
          ) {
            this.generalSettings.nursery.model = val;
            this.generalSettings.nursery.disabled = true;
          }
        });
      }

      // access modul: just loading line
      const JustLoadingLine =
        this.$store.state.nurseryTeam.emails.JustLoadingLineModul;
      // console.log(JustLoadingLine)
      if (JustLoadingLine.includes(this.User.email)) {
        this.generalSettings.type.model = "Petani";
        this.accessModul = {
          calendar: false,
          packingLabel: false,
          loadingLine: true,
          distributionReport: false,
        };
      }
    },
    numberFormat(num) {
      return new Intl.NumberFormat("id-ID").format(num);
    },
    async onInitQRCODEScanner(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text =
            "ERROR: you need to grant camera access permission";
        } else if (error.name === "NotFoundError") {
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text =
            "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text =
            "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text =
            "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text =
            "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text =
            "ERROR: Stream API is not supported in this browser";
        } else if (error.name === "InsecureContextError") {
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text =
            "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
        } else {
          this.distributionReport.dialogs.scanLahanUmum.scan.alert.text = `ERROR: Camera error (${error.name})`;
        }
        this.distributionReport.dialogs.scanLahanUmum.scan.alert.color = "red";
        this.distributionReport.dialogs.scanLahanUmum.scan.alert.show = true;
      }
    },
    distributionPhotoFileChanged(event) {
      if (event) {
        let fileSize = event.size / 1000000;
        console.log(fileSize);
        if (fileSize < 6) {
          this.distributionReport.dialogs.scanLahanUmum.photo.model = event;
          this.distributionReport.dialogs.scanLahanUmum.photo.preview =
            URL.createObjectURL(event);
        } else {
          alert(`Please change your photo file, it's too big. Max 6mb.`);
        }
      } else {
        this.distributionReport.dialogs.scanLahanUmum.photo.model = null;
        this.distributionReport.dialogs.scanLahanUmum.photo.preview = "";
      }
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    async scannerUpdate() {
      const existsScannedLabel =
        this.loadingLine.detailDialog.inputs.scanner.values;
      const newLabel = this.loadingLine.detailDialog.inputs.scanner.model;

      // Try to do split from double input
      // if (newLabel.length > 21) {
      //     let newLabelSplit = newLabel.split('-')
      //     newLabelSplit.forEach((val, index) => {
      //         if (val.length > 13) {
      //             const lahanNo = val.slice(0,12)
      //             const bagNo = val.slice(12,val.length)
      //             newLabelSplit[index] = [lahanNo, bagNo]
      //         }
      //     })
      //     alert(JSON.stringify(newLabelSplit))
      // }

      let audio = null;
      const labels = this.loadingLine.detailDialog.inputs.scanner.labels;
      // console.log(labels)
      if (
        existsScannedLabel.includes(newLabel) == false &&
        labels.includes(newLabel) == true
      ) {
        this.loadingLine.detailDialog.inputs.scanner.values.push(newLabel);
        audio = new Audio(require("@/assets/audio/success.mp3"));

        this.loadingLine.detailDialog.inputs.scanner.alert.text = `Label "${newLabel}" scaned!`;
        this.loadingLine.detailDialog.inputs.scanner.alert.color = "green";

        // update table per farmer data table
        // console.log(this.loadingLine.detailDialog.inputs.scanner.farmers)
        await this.loadingLine.detailDialog.inputs.scanner.farmers.map(
          (farmer, fIndex) => {
            if (farmer.bags_number.includes(newLabel)) {
              this.loadingLine.detailDialog.inputs.scanner.farmers[
                fIndex
              ].bags_number_loaded.push(newLabel);
              this.loadingLine.detailDialog.transportations[
                this.loadingLine.detailDialog.transportationIndex
              ].loaded_labels.push(newLabel);
            }
          }
        );

        // update progression in truck
        // const transIndex = await this.loadingLine.detailDialog.transportationIndex
        // const maxCap = await this.loadingLine.detailDialog.transportations[transIndex].truck_detail.max_capacity || 1
        // let loadedTruck = 0
        // await this.loadingLine.detailDialog.transportations[transIndex].loaded_labels.push(newLabel)
        // await this.loadingLine.detailDialog.transportations[transIndex].loaded_labels.forEach(transLabel => {
        //     const newLabelDetail = this.loadingLine.detailDialog.listLabelDetail.filter(lld => lld.bag_number == transLabel)
        //     newLabelDetail.forEach(nld => {
        //         loadedTruck += parseInt(nld.tree_amount)
        //     })
        // })
        // this.loadingLine.detailDialog.transportations[transIndex].progression = parseInt(loadedTruck) / parseInt(maxCap) * 100
      } else if (existsScannedLabel.includes(newLabel) == true) {
        audio = new Audio(require("@/assets/audio/error.mp3"));

        this.loadingLine.detailDialog.inputs.scanner.alert.text = `Label "${newLabel}" has been already scaned!`;
        this.loadingLine.detailDialog.inputs.scanner.alert.color = "red";
      } else if (labels.includes(newLabel) == false) {
        audio = new Audio(require("@/assets/audio/error.mp3"));

        this.loadingLine.detailDialog.inputs.scanner.alert.text = `Label "${newLabel}" not included in this FF!`;
        this.loadingLine.detailDialog.inputs.scanner.alert.color = "red";
      }

      await audio.play();
      this.loadingLine.detailDialog.inputs.scanner.alert.show = true;
      this.loadingLine.detailDialog.inputs.scanner.model = "";
    },
    sessionEnd(error) {
      if (typeof error.response.status != "undefined") {
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          this.$router.push("/");
        }
      }
    },
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    treeAdjustmentChange(adjIndex, treeIndex) {
      const distributed = parseInt(
        this.distributionReport.dialogs.detail.adjustment[adjIndex].items[
          treeIndex
        ].total_distributed
      );
      let broken = parseInt(
        this.distributionReport.dialogs.detail.adjustment[adjIndex].items[
          treeIndex
        ].broken_seeds
      );
      if (!broken) {
        this.distributionReport.dialogs.detail.adjustment[adjIndex].items[
          treeIndex
        ].broken_seeds = 0;
        broken = 0;
      }
      let missing = parseInt(
        this.distributionReport.dialogs.detail.adjustment[adjIndex].items[
          treeIndex
        ].missing_seeds
      );
      if (!missing) {
        this.distributionReport.dialogs.detail.adjustment[adjIndex].items[
          treeIndex
        ].missing_seeds = 0;
        missing = 0;
      }
      if (broken + missing > distributed) {
        alert(`Total broken + missing ">" from total distributed!`);
        this.distributionReport.dialogs.detail.adjustment[adjIndex].items[
          treeIndex
        ].broken_seeds = 0;
        this.distributionReport.dialogs.detail.adjustment[adjIndex].items[
          treeIndex
        ].missing_seeds = 0;
        broken = 0;
        missing = 0;
      }
      this.distributionReport.dialogs.detail.adjustment[adjIndex].items[
        treeIndex
      ].total_tree_received = distributed - broken - missing;

      const total_received = this.getTotalReceived();
      if (total_received > 0)
        this.distributionReport.dialogs.detail.disabledSave = false;
      else this.distributionReport.dialogs.detail.disabledSave = true;
    },
    async uploadPhotos(newName, file) {
      this.$store.state.loadingOverlayText = `Saving photo...`;
      const url = `${localStorage.getItem("BaseUrl")}general-lands/upload.php`;
      const data = this.generateFormData({
        dir: "distribution-photos",
        nama: newName,
        image: file,
      });
      let responseName = null;
      await axios
        .post(url, data)
        .then((res) => {
          responseName = res.data.data.new_name;
        })
        .catch((err) => {
          console.error(err);
        });
      return "general-lands/" + responseName;
    },
    async uploadPhotosNursery(itemFile) {
      this.$store.state.loadingOverlayText = `Saving photo...`;
      const url = `https://api-nursery.t4t-api.org/api/upload`;
      const data = this.generateFormData({
        file: itemFile,
      });
      let responseName = null;
      console.log(data);
      await axios
        .post(url, data, {
          headers: {
            Authorization: `Bearer ` + this.apiConfig.nurseryToken,
          },
        })
        .then((res) => {
          responseName = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
      return responseName;
    },
  },
};
</script>
