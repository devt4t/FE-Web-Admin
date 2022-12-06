<template>
    <div>
        <!-- BreadCrumbs -->
        <v-breadcrumbs
            class="breadcrumbsmain"
            :items="breadcrumbs"
            divider=">"
            large
        ></v-breadcrumbs>

        <!-- DIALOG MODAL -->
        <!-- Create Data Modal -->
        <v-dialog
            v-model="dialogs.createData.show"
            content-class="rounded-xl"
            max-width="1200px"
            scrollable
            persistent
        >
            <v-card>
                <v-card-title class="mb-1 headermodalstyle rounded-xl">
                    <span class="">{{ dialogs.createData.title }}</span>
                    <v-icon color="red lighten-1" class="ml-auto" @click="dialogActions('createData', false)">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text class="pa-0">

                    <!-- Snackbar -->
                    <v-snackbar
                    v-model="dialogs.createData.snackbar.show"
                    :color="dialogs.createData.snackbar.color"
                    :timeout="dialogs.createData.snackbar.timeout"
                    rounded="xl"
                    >
                        <div class="d-flex justify-between">
                            <p class="mb-0">
                                {{ dialogs.createData.snackbar.text }}
                            </p>
                            <v-spacer></v-spacer>
                            <v-icon small class="pl-1" @click="dialogs.createData.snackbar.show = false">mdi-close-circle</v-icon>
                        </div>
                    </v-snackbar>
                    <v-stepper v-model="dialogs.createData.step">
                        <!-- Stepper Header -->
                        <v-stepper-header class="rounded-xl mx-2 my-2">
                            <v-stepper-step editable :complete="dialogs.createData.step > 1" step="1" color="success" class="rounded-xl">
                                Main Data
                            </v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step :editable="!inputs.mou.model == false && !inputs.employee.model == false && !inputs.pic.model == false && !inputs.picKtp.model == false && !inputs.landArea.model == false && !inputs.plantingArea.model == false && !inputs.croppingPattern.model == false && !inputs.landStatus.model == false && !inputs.landDistance.model == false && !inputs.landAccess.model == false && !inputs.mu.model == false && !inputs.province.model == false && !inputs.regency.model == false && !inputs.district.model == false && !inputs.village.model == false && !inputs.address.model == false" :complete="dialogs.createData.step > 2" step="2" color="success" class="rounded-xl">
                                Seeds
                            </v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step :editable="(!inputs.mou.model == false && !inputs.employee.model == false && !inputs.pic.model == false && !inputs.picKtp.model == false && !inputs.landArea.model == false && !inputs.plantingArea.model == false && !inputs.croppingPattern.model == false && !inputs.landStatus.model == false && !inputs.landDistance.model == false && !inputs.landAccess.model == false && !inputs.mu.model == false && !inputs.province.model == false && !inputs.regency.model == false && !inputs.district.model == false && !inputs.village.model == false && !inputs.address.model == false && inputs.seeds.table.items.length > 0)" :complete="dialogs.createData.step > 3" step="3" color="success" class="rounded-xl">
                                Coordinates & Period
                            </v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step :editable="(!inputs.mou.model == false && !inputs.employee.model == false && !inputs.pic.model == false && !inputs.picKtp.model == false && !inputs.landArea.model == false && !inputs.plantingArea.model == false && !inputs.croppingPattern.model == false && !inputs.landStatus.model == false && !inputs.landDistance.model == false && !inputs.landAccess.model == false && !inputs.mu.model == false && !inputs.province.model == false && !inputs.regency.model == false && !inputs.district.model == false && !inputs.village.model == false && !inputs.address.model == false && inputs.seeds.table.items.length > 0 && !inputs.longitude.model == false && !inputs.latitude.model == false && !inputs.dateDistribution.model == false)" :complete="dialogs.createData.step > 4" step="4" color="success" class="rounded-xl">
                                Photos
                            </v-stepper-step>
                        </v-stepper-header>
                        <!-- Stepper Content -->
                        <v-stepper-items>
                            <!-- Main Data -->
                            <v-stepper-content step="1" class="pt-0">
                                <v-row class="my-0">
                                    <!-- Program Year -->
                                    <v-col cols="12" sm="12" md="6" lg="3">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="nik"
                                            :items="inputs.programYear.items"
                                            :label="inputs.programYear.label"
                                            :loading="inputs.programYear.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.programYear.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.programYear.model"
                                            disabled
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- MOU -->
                                    <v-col cols="12" sm="12" md="12" lg="5">
                                        <v-text-field
                                            :class="`${inputs.mou.model ? (inputs.mou.exist ? 'red--text' : 'green-text') : ''}`"   
                                            :color="`success`"
                                            hide-details
                                            :label="inputs.mou.label"
                                            :loading="inputs.mou.loading"
                                            :no-data-text="inputs.mou.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            :append-icon="inputs.mou.model ? (inputs.mou.exist ? 'mdi-close' : 'mdi-check') : ''"
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.mou.model"
                                            @change="checkMoUNoExisting"
                                        ></v-text-field>
                                    </v-col>
                                    <!-- Employee -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="nik"
                                            :items="inputs.employee.items"
                                            :label="inputs.employee.label"
                                            :loading="inputs.employee.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.employee.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.employee.model"
                                            :disabled="User.role_group != 'IT'"
                                        ></v-autocomplete>
                                    </v-col>
                                </v-row>
                                <div class="pb-2 d-flex align-center">
                                    <p class="mb-0"><v-icon class="mr-2">mdi-clipboard-account</v-icon>PIC</p>
                                    <v-divider class="mx-2"></v-divider>
                                </div>
                                <v-row class="my-0">
                                    <!-- PIC -->
                                    <v-col cols="12" sm="12" md="12" lg="6">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.pic.label"
                                            :loading="inputs.pic.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.pic.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.pic.model"
                                        ></v-text-field>
                                    </v-col>
                                    <!-- PIC KTP -->
                                    <v-col cols="12" sm="12" md="12" lg="6">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.picKtp.label"
                                            :loading="inputs.picKtp.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.picKtp.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.picKtp.model"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <div class="pb-2 d-flex align-center">
                                    <p class="mb-0"><v-icon class="mr-2">mdi-island</v-icon>Land</p>
                                    <v-divider class="mx-2"></v-divider>
                                </div>
                                <v-row class="my-0">
                                    <!-- Land Area -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.landArea.label"
                                            :loading="inputs.landArea.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.landArea.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.landArea.model"
                                            type="number"
                                        >
                                            <v-btn slot="append" text class="text-lowercase" rounded>
                                                m<sup>2</sup>
                                            </v-btn>
                                        </v-text-field>
                                    </v-col>
                                    <!-- Land Coverage -->
                                    <v-col cols="12" sm="12" md="6" lg="3">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="text"
                                            item-value="value"
                                            :items="inputs.landCoverage.items"
                                            :label="inputs.landCoverage.label"
                                            :loading="inputs.landCoverage.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.landCoverage.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            v-model="inputs.landCoverage.model"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- Planting Area -->
                                    <v-col cols="12" sm="12" md="6" lg="5">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.plantingArea.label"
                                            :loading="inputs.plantingArea.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.plantingArea.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.plantingArea.model"
                                            type="number"
                                            readonly
                                        >
                                            <v-btn slot="append" text class="text-lowercase" rounded>
                                                m<sup>2</sup>
                                            </v-btn>
                                        </v-text-field>
                                    </v-col>
                                    <!-- Cropping Pattern -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="province_code"
                                            :items="inputs.croppingPattern.items"
                                            :label="inputs.croppingPattern.label"
                                            :loading="inputs.croppingPattern.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.croppingPattern.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.croppingPattern.model"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- Land Status -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.landStatus.label"
                                            :loading="inputs.landStatus.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.landStatus.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.landStatus.model"
                                        ></v-text-field>
                                    </v-col>
                                    <!-- Land Distance -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.landDistance.label"
                                            :loading="inputs.landDistance.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.landDistance.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.landDistance.model"
                                            type="number"
                                        >
                                            <v-btn slot="append" text class="text-lowercase" rounded>
                                                m
                                            </v-btn>
                                        </v-text-field>
                                    </v-col>
                                    <!-- Land Access -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="province_code"
                                            :items="inputs.landAccess.items"
                                            :label="inputs.landAccess.label"
                                            :loading="inputs.landAccess.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.landAccess.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.landAccess.model"
                                        ></v-autocomplete>
                                    </v-col>
                                </v-row>
                                <div class="pb-2 d-flex align-center">
                                    <p class="mb-0"><v-icon class="mr-2">mdi-map-marker</v-icon>Location</p>
                                    <v-divider class="mx-2"></v-divider>
                                </div>
                                <v-row class="">
                                    <!-- Management Unit -->
                                    <v-col cols="12" sm="12">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="mu_no"
                                            :items="inputs.mu.items"
                                            :label="inputs.mu.label"
                                            :loading="inputs.mu.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.mu.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.mu.model"
                                            style="max-width: 500px"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- Province -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="province_code"
                                            :items="inputs.province.items"
                                            :label="inputs.province.label"
                                            :loading="inputs.province.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.province.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.province.model"
                                            v-on:change="getOptionsData({type: 'regency'})"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- Regency -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="kabupaten_no"
                                            :items="inputs.regency.items"
                                            :label="inputs.regency.label"
                                            :loading="inputs.regency.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.regency.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.regency.model"
                                            v-on:change="getOptionsData({type: 'district'})"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- District -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="kode_kecamatan"
                                            :items="inputs.district.items"
                                            :label="inputs.district.label"
                                            :loading="inputs.district.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.district.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.district.model"
                                            v-on:change="getOptionsData({type: 'village'})"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- Village -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-autocomplete
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            item-text="name"
                                            item-value="kode_desa"
                                            :items="inputs.village.items"
                                            :label="inputs.village.label"
                                            :loading="inputs.village.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.village.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.village.model"
                                        ></v-autocomplete>
                                    </v-col>
                                    <!-- Address -->
                                    <v-col cols="12" sm="12" md="12" lg="8">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.address.label"
                                            :loading="inputs.address.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.address.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.address.model"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="pt-2">
                                </v-row>
                            </v-stepper-content>
                            <!-- Seeds Data -->
                            <v-stepper-content step="2" class="pt-0">
                                <v-row class="my-2 mx-0 align-center">
                                    <v-divider class="mx-2"></v-divider>
                                    <!-- Trees Input -->
                                    <v-select
                                        color="success"
                                        class="mr-0 mr-lg-2"
                                        hide-details
                                        item-color="success"
                                        :items="['KAYU', 'MPTS', 'CROPS']"
                                        :label="'Category'"
                                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                        outlined
                                        rounded
                                        :disabled="inputs.seeds.category.disabled"
                                        v-model="inputs.seeds.category.model"
                                        style="max-width: 150px;"
                                    ></v-select>
                                    <!-- Trees Input -->
                                    <v-autocomplete
                                        color="success"
                                        class="mr-0 mr-lg-2"
                                        hide-details
                                        item-color="success"
                                        item-text="tree_name"
                                        item-value="tree_code"
                                        return-object
                                        :items="inputs.seeds[inputs.seeds.category.model]"
                                        :label="'Seedling'"
                                        placeholder="Pick ur tree..."
                                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                        outlined
                                        rounded
                                        v-model="inputs.seeds.model"
                                    >
                                        <template v-slot:item="data">
                                        <v-list-item-content>
                                            <v-list-item-title v-html="data.item.tree_name"></v-list-item-title>
                                            <!-- <v-list-item-subtitle>{{ data.item.tree_code }}</v-list-item-subtitle> -->
                                        </v-list-item-content>
                                        </template>
                                    </v-autocomplete>
                                    <!-- Trees Amount -->
                                    <v-text-field 
                                        color="green"
                                        hide-details
                                        type="number"
                                        prepend-inner-icon="mdi-sprout"
                                        rounded
                                        outlined
                                        min="0"
                                        label="Amount"
                                        placeholder="Set amount..."
                                        v-model="inputs.seeds.amount"
                                        style="max-width: 200px;"
                                    ></v-text-field>
                                    <!-- Add Button -->
                                    <v-btn color="green white--text" fab icon @click="seedlingAdd()"
                                        :disabled="(inputs.seeds.amount <= 0) || !inputs.seeds.model"
                                    >
                                        <v-icon>mdi-plus-circle</v-icon>
                                    </v-btn>
                                    <v-divider class="mx-2"></v-divider>
                                </v-row>
                                <v-data-table
                                    multi-sort
                                    :headers="inputs.seeds.table.headers"
                                    :items="inputs.seeds.table.items"
                                    hide-default-footer
                                    :items-per-page="-1"
                                >
                                    <!-- Index Column -->
                                    <template v-slot:item.index="{index}">{{ index+1 }}</template>
                                    <!-- Amount Column -->
                                    <template v-slot:item.tree_amount="{item, index}">
                                        <v-row class="ma-0 align-center">
                                            <v-divider class="mr-2"></v-divider>
                                            <v-text-field 
                                                color="green"
                                                dense
                                                hide-details
                                                outlined
                                                prepend-inner-icon="mdi-sprout"
                                                rounded
                                                style="max-width: 200px;"
                                                type="number"
                                                min="0"
                                                v-model="inputs.seeds.table.items[index].tree_amount"
                                            ></v-text-field>
                                        </v-row>
                                    </template>
                                    <!-- Remove Column -->
                                    <template v-slot:item.remove="{index}">
                                        <v-btn fab color="red" icon small @click="seedlingRemove(index)">
                                            <v-icon>mdi-delete-circle</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-stepper-content>
                            <!-- Coordinates + Period -->
                            <v-stepper-content step="3" class="pt-0">
                                <div class="py-2 d-flex align-center">
                                    <p class="mb-0"><v-icon class="mr-2">mdi-crosshairs-gps</v-icon>Coordinates</p>
                                    <v-divider class="mx-2"></v-divider>
                                </div>
                                <v-row class="my-0">
                                    <!-- Latitude -->
                                    <v-col cols="12" sm="12" md="6" lg="6">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.latitude.label"
                                            :loading="inputs.latitude.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.latitude.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.latitude.model"
                                        ></v-text-field>
                                    </v-col>
                                    <!-- Longitude -->
                                    <v-col cols="12" sm="12" md="6" lg="6">
                                        <v-text-field
                                            color="success"
                                            hide-details
                                            item-color="success"
                                            :label="inputs.longitude.label"
                                            :loading="inputs.longitude.loading"
                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                            :no-data-text="inputs.longitude.loading ? 'Loading...' : 'No Data'"
                                            outlined
                                            rounded
                                            :rules="[(v) => !!v || 'Field is required']"
                                            v-model="inputs.longitude.model"
                                        ></v-text-field>
                                    </v-col>
                                    <!-- Check Location -->
                                    <v-col cols="12" class="px-10">
                                        <v-tooltip top class="rounded-xl" color="rounded-xl">
                                            Click for check coordinates in GoogleMaps
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn v-bind="attrs" v-on="on" color="info" rounded block :disabled="!inputs.longitude.model || !inputs.longitude.model" @click="openGoogleMap"> 
                                                    <v-icon class="mr-2">mdi-map-marker</v-icon>
                                                    Check Location
                                                </v-btn>
                                            </template>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                                <div class="py-2 d-flex align-center">
                                    <p class="mb-0"><v-icon class="mr-2">mdi-timeline-clock</v-icon>Period</p>
                                    <v-divider class="mx-2"></v-divider>
                                </div>
                                <v-row class="my-0">
                                    <!-- Hole Surveillance Date -->
                                    <v-col cols="12" lg="4" class="text-center">
                                        <p class="mb-0"><strong>{{ inputs.dateHoleSurveillance.label }}</strong></p>
                                        <v-btn 
                                            disabled
                                            rounded class=""
                                            color="green white--text"
                                        >
                                            {{ dateFormat(inputs.dateHoleSurveillance.model, 'ddd, DD MMMM Y') }}
                                        </v-btn>
                                    </v-col>
                                    <!-- Distribution Date -->
                                    <v-col cols="12" lg="4" class="text-center">
                                        <v-menu v-model="inputs.dateDistribution.datepicker.show" offset-x transition="slide-x-transition" rounded="xl">
                                            <template v-slot:activator="{ on, attrs }">
                                                <p class="mb-0"><strong>{{ inputs.dateDistribution.label }}</strong></p>
                                                <v-btn 
                                                    dark
                                                    rounded class=""
                                                    color="green"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    {{ dateFormat(inputs.dateDistribution.model, 'ddd, DD MMMM Y') }}
                                                </v-btn>
                                            </template>
                                            <div>
                                                <v-overlay :value="inputs.dateDistribution.loading">
                                                    <div class="d-flex flex-column align-center justify-center">
                                                    <v-progress-circular
                                                        indeterminate
                                                        color="white"
                                                        size="64"
                                                    ></v-progress-circular>
                                                    <p class="mt-2 mb-0">Updating dates...</p>
                                                    </div>
                                                </v-overlay>
                                                <v-date-picker
                                                    v-model="inputs.dateDistribution.model"
                                                    min="2022-11-24"
                                                    max="2023-01-31"
                                                    @input="inputs.dateDistribution.datepicker.show = false"
                                                    color="green"
                                                    class="rounded-xl"
                                                    :key="inputs.dateDistribution.datepicker.key"
                                                ></v-date-picker>
                                            </div>
                                        </v-menu>
                                    </v-col>
                                    <!-- Planting Realization Date -->
                                    <v-col cols="12" lg="4" class="text-center">
                                        <p class="mb-0"><strong>{{ inputs.dateRealization.label }}</strong></p>
                                        <v-btn 
                                            rounded class=""
                                            color="green white--text"
                                            disabled
                                        >
                                            {{ dateFormat(inputs.dateRealization.model, 'ddd, DD MMMM Y') }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-stepper-content>
                            <v-stepper-content step="4" class="pt-0">
                                <v-row class="ma-0">
                                    <!-- Photo 1 File -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-file-input
                                        color="success"
                                        item-color="success"
                                        outlined
                                        rounded
                                        hide-details
                                        accept="image/png, image/jpeg, image/bmp"
                                        placeholder="Photo 1"
                                        prepend-icon="mdi-camera"
                                        label="Photo 1"
                                        v-on:change="photo1FileChanged"
                                        :rules="[(v) => !!v || 'Field is required']"
                                        ></v-file-input>
                                        <v-card elevation="2" class="rounded-xl" height="300" v-if="inputs.photos.photo1.preview && inputs.photos.photo1.preview !== ''">
                                            <v-img
                                                height="300"
                                                v-bind:src="inputs.photos.photo1.preview"
                                                class="my-2 mb-4 rounded-xl cursor-pointer"
                                                id="photo1"
                                                @click="showLightbox(inputs.photos.photo1.preview)"
                                            ></v-img
                                        ></v-card>
                                    </v-col>
                                    <!-- Photo 2 File -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-file-input
                                        color="success"
                                        item-color="success"
                                        outlined
                                        rounded
                                        hide-details
                                        accept="image/png, image/jpeg, image/bmp"
                                        placeholder="Photo 2"
                                        prepend-icon="mdi-camera"
                                        label="Photo 2"
                                        v-on:change="photo2FileChanged"
                                        :rules="[(v) => !!v || 'Field is required']"
                                        ></v-file-input>
                                        <v-card elevation="2" class="rounded-xl" height="300" v-if="inputs.photos.photo2.preview && inputs.photos.photo2.preview !== ''">
                                            <v-img
                                                height="300"
                                                v-bind:src="inputs.photos.photo2.preview"
                                                class="my-2 mb-4 rounded-xl cursor-pointer"
                                                id="photo2"
                                                @click="showLightbox(inputs.photos.photo2.preview)"
                                            ></v-img
                                        ></v-card>
                                    </v-col>
                                    <!-- Photo 3 File -->
                                    <v-col cols="12" sm="12" md="6" lg="4">
                                        <v-file-input
                                        color="success"
                                        item-color="success"
                                        outlined
                                        rounded
                                        hide-details
                                        accept="image/png, image/jpeg, image/bmp"
                                        placeholder="Photo 3"
                                        prepend-icon="mdi-camera"
                                        label="Photo 3"
                                        v-on:change="photo3FileChanged"
                                        :rules="[(v) => !!v || 'Field is required']"
                                        ></v-file-input>
                                        <v-card elevation="2" class="rounded-xl" height="300" v-if="inputs.photos.photo3.preview && inputs.photos.photo3.preview !== ''">
                                            <v-img
                                                height="300"
                                                v-bind:src="inputs.photos.photo3.preview"
                                                class="my-2 mb-4 rounded-xl cursor-pointer"
                                                id="photo3"
                                                @click="showLightbox(inputs.photos.photo3.preview)"
                                            ></v-img
                                        ></v-card>
                                    </v-col>
                                    <!-- Photo 4 File -->
                                    <v-col cols="12" sm="12" md="6" lg="6">
                                        <v-file-input
                                        color="success"
                                        item-color="success"
                                        outlined
                                        rounded
                                        hide-details
                                        accept="image/png, image/jpeg, image/bmp"
                                        placeholder="MoU Photo"
                                        prepend-icon="mdi-camera"
                                        label="MoU Photo"
                                        v-on:change="photo4FileChanged"
                                        :rules="[(v) => !!v || 'Field is required']"
                                        ></v-file-input>
                                        <v-card elevation="2" class="rounded-xl" height="300" v-if="inputs.photos.photo4.preview && inputs.photos.photo4.preview !== ''">
                                            <v-img
                                                height="300"
                                                v-bind:src="inputs.photos.photo4.preview"
                                                class="my-2 mb-4 rounded-xl cursor-pointer"
                                                id="photo4"
                                                @click="showLightbox(inputs.photos.photo4.preview)"
                                            ></v-img
                                        ></v-card>
                                    </v-col>
                                </v-row>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-card-text>
                <!-- Footer Button -->
                <v-card-actions class="ma-2 elevation-5 rounded-xl">
                    <v-row>
                        <v-col cols="3">
                            <v-btn
                                class="mr-0 mr-md-1"
                                color="red"
                                rounded
                                elevation="1"
                                @click="closeActions('dialogs', 'createData')"
                                outlined
                            >
                                <v-icon class="d-none d-md-inline" left> mdi-close-circle-outline </v-icon>
                                <v-icon class="d-inline d-md-none" center> mdi-close-circle-outline </v-icon>
                                <span class="d-none d-md-inline-block"> 
                                    Cancel
                                </span>
                            </v-btn>
                        </v-col>
                        <v-col cols="6" align="center">
                            <v-btn
                                :disabled="dialogs.createData.step == 1"
                                elevation="1"
                                outlined
                                color="primary"
                                class="mr-1"
                                rounded
                                @click="stepperMove('-')"
                            >
                                <v-icon class="d-none d-md-inline" left> mdi-chevron-left-circle-outline </v-icon>
                                <v-icon class="d-inline d-md-none" center> mdi-chevron-left-circle-outline </v-icon>
                                <span class="d-none d-md-inline-block"> 
                                    Back
                                </span>
                            </v-btn>
                            <v-btn
                                class="ml-1"
                                elevation="1"
                                rounded
                                outlined
                                color="primary"
                                @click="stepperMove('+')"
                                :disabled="
                                    (dialogs.createData.step < 4 && (!inputs.mou.model || !inputs.employee.model || !inputs.pic.model || !inputs.picKtp.model || !inputs.landArea.model || !inputs.plantingArea.model || !inputs.croppingPattern.model || !inputs.landStatus.model || !inputs.landDistance.model || !inputs.landAccess.model || !inputs.mu.model || !inputs.province.model || !inputs.regency.model || !inputs.district.model || !inputs.village.model || !inputs.address.model)) ||
                                    (dialogs.createData.step == 2 && inputs.seeds.table.items.length < 1) ||
                                    (dialogs.createData.step == 3 && (!inputs.longitude.model || !inputs.latitude.model || !inputs.dateDistribution.model)) ||
                                    dialogs.createData.step == 4
                                "
                            >
                                <span class="d-none d-md-inline-block"> 
                                    Next
                                </span>
                                <v-icon class="d-none d-md-inline" right> mdi-chevron-right-circle-outline </v-icon>
                                <v-icon class="d-inline d-md-none" center> mdi-chevron-right-circle-outline </v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="3" align="end">
                            <v-btn
                                color="success white--text"
                                elevation="1"
                                rounded
                                @click="() => {saveLahanUmum()}"
                                :disabled="
                                    !inputs.mou.model || !inputs.employee.model || !inputs.pic.model || !inputs.picKtp.model || !inputs.landArea.model || !inputs.plantingArea.model || !inputs.croppingPattern.model || !inputs.landStatus.model || !inputs.landDistance.model || !inputs.landAccess.model || !inputs.mu.model || !inputs.province.model || !inputs.regency.model || !inputs.district.model || !inputs.village.model || !inputs.address.model || inputs.seeds.table.items.length < 1 || !inputs.longitude.model || !inputs.latitude.model || !inputs.dateDistribution.model || !inputs.photos.photo4.model || inputs.mou.exist
                                "
                            >
                                <span class="d-none d-md-inline-block"> 
                                    Save
                                </span>
                                <v-icon class="d-none d-md-inline" right> mdi-checkbox-marked-circle-outline </v-icon>
                                <v-icon class="d-inline d-md-none" center> mdi-checkbox-marked-circle-outline </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- END: DIALOG MODAL -->
        <!-- Main Table -->
        <v-data-table
            multi-sort
            class="rounded-xl elevation-6 mx-3 pa-1 mb-5"
            :headers="tables.lahan.headers"
            :items="tables.lahan.items"
            :loading="tables.lahan.loading"
        >
            <!-- Slot: Top -->
            <template v-slot:top>
                <v-row class="mb-1 mt-2 mx-2 align-center">
                    <!-- Program Year -->
                    <v-select
                        color="success"
                        item-color="success"
                        v-model="tables.lahan.programYear.model"
                        :items="tables.lahan.programYear.items"
                        outlined
                        dense
                        hide-details
                        :menu-props="{ bottom: true, offsetY: true, rounded: 'xl', transition: 'slide-y-transition' }"
                        rounded
                        label="Program Year"
                        class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
                        style="max-width: 200px"
                    ></v-select>
                    <v-divider class="mx-2"></v-divider>
                    <v-btn color="info" rounded @click="dialogActions('createData', true)" class="pl-2">
                        <v-icon class="mr-1">mdi-plus-circle</v-icon>
                        Create Data
                    </v-btn>
                </v-row>
            </template>
            <!-- Slot: luas_lahan Column -->
            <template v-slot:item.luas_lahan="{item}">
                {{ numberFormat(item.luas_lahan) }} m<sup>2</sup>
            </template>
            <!-- Slot: Status Column -->
            <template v-slot:item.is_verified="{item}">
                <v-chip :color="item.is_verified ? 'green' : 'red'" class="white--text pl-1">
                    <v-icon class="mr-1">mdi-{{ item.is_verified ? 'check' : 'close' }}-circle</v-icon>
                    {{ item.is_verified ? 'Verified' : 'Unverified' }}
                </v-chip>
            </template>
            <!-- Slot: Action Column -->
            <template v-slot:item.action="{item}">
                <v-menu
                    rounded="xl"
                    bottom
                    left
                    offset-y
                    transition="slide-y-transition"
                    :close-on-content-click="false"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" color="dark">mdi-arrow-down-drop-circle</v-icon>
                    </template>
                    <v-list class="d-flex flex-column align-center">
                        <v-list-item>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind="attrs" v-on="on" rounded @click="showDetailFarmerTraining(item.training_no)" color="info">
                                    <v-icon class="mr-1">
                                    mdi-information-outline
                                    </v-icon>
                                    Detail
                                </v-btn>
                                </template>
                                <span>Detail</span>
                            </v-tooltip>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-data-table>

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
            imageUrl: localStorage.getItem('BaseUrl'),
            token: localStorage.getItem('token')
        },
        breadcrumbs: [
            {
                text: "Main Data",
                disabled: true,
                href: "breadcrumbs_dashboard",
            },
            {
                text: "Lahan Umum",
                disabled: true,
                href: "breadcrumbs_link_1",
            },
        ],
        dialogs: {
            createData: {
                show: false,
                title: 'Create Lahan Umum',
                step: 1,
                snackbar: {
                    color: '',
                    show: false,
                    text: '',
                    timeout: 10000,
                },
            }
        },
        inputs: {
            address: {
                label: 'Address',
                model: '',
                loading: false
            },
            croppingPattern: {
                label: 'Cropping Pattern',
                model: '',
                items: [
                    'Pola Agroforestry Acak',
                    'Pola Agroforestry Lajur',
                    'Pola Agroforestry Tepi',
                    'Pola Konservasi Pohon Kayu',
                    'Pola Konservasi Pohon Kayu + MPTS',
                ],
                loading: false
            },
            dateDistribution: {
                datepicker: {
                    show: false,
                    key: 1315432
                },
                label: 'Distribution Date',
                loading: false,
                model: ''
            },
            dateHoleSurveillance: {
                label: 'Hole Surveillance Date',
                loading: false,
                model: ''
            },
            dateRealization: {
                label: 'Planting Realization Date',
                loading: false,
                model: ''
            },
            district: {
                label: 'District',
                model: '',
                items: [],
                loading: false
            },
            employee: {
                label: 'T4T Employee',
                model: '',
                items: [],
                loading: false
            },
            landAccess: {
                label: 'Land Access',
                model: '',
                items: [
                    'Jalan Kaki',
                    'Motor',
                    'Mobil',
                ],
                loading: false
            },
            landArea: {
                label: 'Land Area',
                model: 0,
                loading: false
            },
            landCoverage: {
                label: 'Land Coverage(%)',
                items: [
                    {text: '0%', value: 0},
                    {text: '25%', value: 25},
                    {text: '50%', value: 50},
                    {text: '75%', value: 75},
                ],
                model: 0,
                loading: false
            },
            landDistance: {
                label: 'Land Distance from Home',
                model: 0,
                loading: false
            },
            landStatus: {
                label: 'Land Status',
                model: '',
                loading: false
            },
            latitude: {
                label: 'Latitude',
                model: '',
                loading: false
            },
            longitude: {
                label: 'Longitude',
                model: '',
                loading: false
            },
            mou: {
                exist: false,
                label: 'MoU Number',
                model: '',
                loading: false,
            },
            mu: {
                label: 'Management Unit',
                model: '',
                items: [],
                loading: false
            },
            photos: {
                photo1: {
                    preview: '',
                    model: null
                },
                photo2: {
                    preview: '',
                    model: null
                },
                photo3: {
                    preview: '',
                    model: null
                },
                photo4: {
                    preview: '',
                    model: null
                },
            },
            pic: {
                label: 'PIC Name',
                model: '',
                loading: false
            },
            picKtp: {
                label: 'PIC NIK / Ktp No',
                model: '',
                loading: false
            },
            plantingArea: {
                label: 'Planting Area',
                model: 0,
                loading: false
            },
            programYear: {
                label: 'Program Year',
                model: null,
                items: [],
                loading: false
            },
            province: {
                label: 'Province',
                model: '',
                items: [],
                loading: false
            },
            regency: {
                label: 'Regency',
                model: '',
                items: [],
                loading: false
            },
            seeds: {
                category: {
                    model: 'KAYU',
                    items: ['KAYU', 'MPTS', 'CROPS'],
                    disabled: false
                },
                CROPS: [],
                items: [],
                KAYU: [],
                model: null,
                amount: 0,
                MPTS: [],
                table: {
                    headers: [
                        { text: 'No', value: 'index', align: 'center' },
                        { text: 'Category', value: 'tree_category', align: 'center' },
                        { text: 'Name', value: 'tree_name' },
                        { text: 'Amount', value: 'tree_amount', align: 'right' },
                        { text: 'Remove', value: 'remove', sortable: false, align: 'right' },
                    ],
                    items: []
                },
            },
            village: {
                items: [],
                label: 'Village',
                model: '',
                loading: false
            },
        },
        snackbar: {
            color: '',
            show: false,
            text: '',
            timeout: 10000,
        },
        tables: {
            lahan: {
                headers: [
                    {text: 'Lahan No', value: 'lahanNo'},
                    {text: 'PIC T4T', value: 'employee'},
                    {text: 'MU', value: 'mu'},
                    {text: 'Desa', value: 'namaDesa'},
                    {text: 'PIC Lahan', value: 'pic_lahan'},
                    {text: 'Luas Lahan', value: 'luas_lahan'},
                    {text: 'Pola Tanam', value: 'pattern_planting'},
                    {text: 'Status', value: 'is_verified'},
                    {text: 'Action', value: 'action', align: 'right'},
                ],
                items: [],
                loading: false,
                programYear: {
                    items: [],
                    model: ''
                }
            }
        },
        User: {}
    }),
    watch: {
        'dialogs.createData.step': {
            handler(newVal) {
                // console.log(newVal)
            }
        },
        'inputs.dateDistribution.model': {
            handler(newVal) {
                if (newVal) {
                    this.inputs.dateHoleSurveillance.model = moment(newVal).subtract(14, 'days')
                    this.inputs.dateRealization.model = moment(newVal).add(7, 'days')
                }
            }
        },
        'inputs.landArea.model': {
            handler(val) {
                this.inputs.plantingArea.model = Math.round(val * ((100 - this.inputs.landCoverage.model) / 100))
            }
        },
        'inputs.landCoverage.model': {
            handler(val) {
                this.inputs.plantingArea.model = Math.round(this.inputs.landArea.model * ((100 - val) / 100))
            }
        },
        'tables.lahan.programYear.model': {
            handler(val) {
                this.getGeneralLandData()
            }
        },
    },
    async mounted() {
        this.User = JSON.parse(localStorage.getItem('User'))
        this.inputs.programYear.model = this.$store.state.programYear.model
        this.inputs.programYear.items = this.$store.state.programYear.options
        this.tables.lahan.programYear.model = this.$store.state.programYear.model
        this.tables.lahan.programYear.items = this.$store.state.programYear.options
        await this.getGeneralLandData()
    },
    methods: {
        async dialogActions(dialog, show) {
            if (dialog == 'createData' && show == true) {
                this.$store.state.loadingOverlay = true
                await this.getOptionsData({type: 'mu'})
                await this.getOptionsData({type: 'province'})
                await this.getOptionsData({type: 'employee'})
                await this.getOptionsData({type: 'seeds'})
                this.$store.state.loadingOverlay = false

                this.inputs.employee.model = this.User.employee_no
            } 

            this.dialogs[dialog].show = show
            // await this.setDummyData()
        },
        async getGeneralLandData() {
            this.tables.lahan.loading = true

            const url = this.apiConfig.baseUrl + 'GetLahanUmumAllAdmin?'
            const params ={
                program_year: this.tables.lahan.programYear.model
            }
            if (this.User.role_group != 'IT' && this.User.role_name != 'PROGAM MANAGER') {
                params.created_by = this.User.email
            }
            await axios.get(`${url}${new URLSearchParams(params)}`,{
                headers: {
                    Authorization: `Bearer ${this.apiConfig.token}`
                }
            }).then(res => {
                this.tables.lahan.items = res.data.data.result
            }).catch(err => {

            }).finally(() => {
                this.tables.lahan.loading = false
            })
        },
        async getOptionsData(inputs) {
            // prepare for calling api
            let url = ''
            
            // set url
            if (inputs.type == 'province') {
                url = 'GetProvince'
                this.$store.state.loadingOverlayText = 'Getting Province datas...'
            } else if (inputs.type == 'regency') {
                url = 'GetKabupaten?province_code=' + this.inputs.province.model
                this.$store.state.loadingOverlayText = 'Getting Regency datas...'
                this.inputs.district.model = ''
                this.inputs.district.items = []
                this.inputs.village.model = ''
                this.inputs.village.items = []
            } else if (inputs.type == 'district') {
                url = 'GetKecamatan?kabupaten_no=' + this.inputs.regency.model
                this.$store.state.loadingOverlayText = 'Getting District datas...'
                this.inputs.village.model = ''
                this.inputs.village.items = []
            } else if (inputs.type == 'village') {
                url = 'GetDesa?&kode_kecamatan=' + this.inputs.district.model
                this.$store.state.loadingOverlayText = 'Getting Village datas...'
            } else if (inputs.type == 'employee') {
                url = 'GetEmployeeAll'
                this.$store.state.loadingOverlayText = 'Getting Employee datas...'
            } else if (inputs.type == 'seeds') {
                url = 'GetTreesAll'
                this.$store.state.loadingOverlayText = 'Getting Trees datas...'
            } else if (inputs.type == 'mu') {
                url = 'GetManagementUnit'
                this.$store.state.loadingOverlayText = 'Getting Management Unit datas...'
            }

            
            if (url != '') {
                url = this.apiConfig.baseUrl + url

                this.inputs[inputs.type].model = ''
                this.inputs[inputs.type].loading = true
                
                // calling api
                await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ` + this.apiConfig.token,
                    },
                }).then(res => {
                    if (inputs.type == 'employee') {
                        this.inputs[inputs.type].items = res.data.data.result.data
                    } else if ( inputs.type == 'seeds') {
                        const response = res.data.data.result.data
                        response.forEach(val => {
                            let category = null
                            if (val.tree_category == 'Pohon_Kayu') category = 'KAYU' 
                            else if (val.tree_category == 'Pohon_Buah') category = 'MPTS'
                            else if (val.tree_category == 'Tanaman_Bawah_Empon') category = 'CROPS'
                            if (category) this.inputs[inputs.type][category].push(val)
                        })
                    } else {
                        this.inputs[inputs.type].items = res.data.data.result
                    }
                }).catch(err => {
                    console.log(err.response)
                    this.forceLogout(err.response)
                    if (inputs.type == 'seeds') { 
                        this.options[inputs.type].items = []
                    } else {
                        this.inputs[inputs.type].items = []
                    }
                }).finally(() => {
                    this.$store.state.loadingOverlayText = null
                    this.inputs[inputs.type].loading = false
                })
            }
        },
        async saveLahanUmum() {
            this.dialogs.createData.show = false
            this.$store.state.loadingOverlayText = `Start saving "lahan umum" data...`
            this.$store.state.loadingOverlay = true
            const url = `${this.apiConfig.baseUrl}AddMandatoryLahanUmum`
            const postData = {
                // main data
                program_year: this.inputs.programYear.model,
                mou_no: this.inputs.mou.model,
                employee_no: this.inputs.employee.model,
                pic_lahan: this.inputs.pic.model,
                ktp_no: this.inputs.picKtp.model,
                luas_lahan: this.inputs.landArea.model,
                tutupan_lahan: this.inputs.landCoverage.model,
                luas_tanam: this.inputs.plantingArea.model,
                pattern_planting: this.inputs.croppingPattern.model,
                status: this.inputs.landStatus.model,
                jarak_lahan: this.inputs.landDistance.model,
                access_lahan: this.inputs.landAccess.model,
                mu_no: this.inputs.mu.model,
                province: this.inputs.province.model,
                regency: this.inputs.regency.model,
                district: this.inputs.district.model,
                village: this.inputs.village.model,
                address: this.inputs.address.model,
                // coordinates & period
                longitude: this.inputs.longitude.model,
                latitude: this.inputs.latitude.model,
                planting_hole_date: this.inputs.dateHoleSurveillance.model,
                distribution_date: this.inputs.dateDistribution.model,
                planting_realization_date: this.inputs.dateRealization.model,
                // tree
                list_trees: this.inputs.seeds.table.items,
                // photos
                photo1: '',
                photo2: '',
                photo3: '',
                photo4: '',
                // user
                created_by: this.User.email
            }
            if (this.inputs.photos.photo1.model) {
                const uploadPhoto1 = await this.uploadPhotos('photo1', this.inputs.photos.photo1.model)
                if (uploadPhoto1) {
                    postData.photo1 = `general-lands/${uploadPhoto1}`
                }
            }
            if (this.inputs.photos.photo2.model) {
                const uploadPhoto2 = await this.uploadPhotos('photo2', this.inputs.photos.photo2.model)
                if (uploadPhoto2) {
                    postData.photo2 = `general-lands/${uploadPhoto2}`
                }
            }
            if (this.inputs.photos.photo3.model) {
                const uploadPhoto3 = await this.uploadPhotos('photo3', this.inputs.photos.photo3.model)
                if (uploadPhoto3) {
                    postData.photo3 = `general-lands/${uploadPhoto3}`
                }
            }
            if (this.inputs.photos.photo4.model) {
                const uploadPhoto4 = await this.uploadPhotos('mou', this.inputs.photos.photo4.model)
                if (uploadPhoto4) {
                    postData.photo4 = `general-lands/${uploadPhoto4}`
                }
            }
            console.log(postData)
            await axios.post(url, postData, {
                headers: {
                    Authorization: `Bearer ` + this.apiConfig.token,
                },
            }).then(res => {
                console.log(res.data)
                this.resetInputData()
                this.getGeneralLandData()
            }).catch(err => {
                console.error(err.response)
                this.forceLogout(err.response)
            }).finally(() => {
                this.$store.state.loadingOverlay = false
                this.$store.state.loadingOverlayText = null
            })
        },
        async seedlingAdd() {
            // set data
            const data = {
                tree_category: this.inputs.seeds.category.model,
                tree_code: this.inputs.seeds.model.tree_code,
                tree_name: this.inputs.seeds.model.tree_name,
                tree_amount: this.inputs.seeds.amount
            }
            // push data to table
            await this.inputs.seeds.table.items.push(data)
            // find index
            const index = await this.inputs.seeds[data.tree_category].findIndex(val => val.tree_code == data.tree_code)
            // remove from options
            await this.inputs.seeds[data.tree_category].splice(index, 1)
            // reset inputs
            this.inputs.seeds.model = null
            this.inputs.seeds.amount = 0
        },
        async seedlingRemove(index) {
            const data = this.inputs.seeds.table.items[index]
            await this.inputs.seeds[data.tree_category].push(data)

            await this.inputs.seeds.table.items.splice(index, 1)
        },
        // Utilities
        async checkMoUNoExisting(data) {
            const url = `${this.apiConfig.baseUrl}AddMandatoryLahanUmum`
            this.inputs.mou.loading = true
            await axios.post(url, {
                mou_no: data
            }, {
                headers: {
                    Authorization: `Bearer ` + this.apiConfig.token,
                },
            }).catch(err => {
                this.forceLogout(err.response)
                const res = err.response.data.data.result
                if (res == 'The mou no has already been taken.') {
                    this.dialogs.createData.snackbar.color = 'red'
                    this.dialogs.createData.snackbar.text = 'MoU Number has already been taken! 😱'
                    this.inputs.mou.exist = true
                } else if (data) {
                    this.dialogs.createData.snackbar.color = 'green'
                    this.dialogs.createData.snackbar.text = 'MoU Number available 👍🏻'
                    this.inputs.mou.exist = false
                } else {
                    this.dialogs.createData.snackbar.color = 'red'
                    this.dialogs.createData.snackbar.text = 'MoU Number required! 😪'
                    this.inputs.mou.exist = true
                }
            }).finally(() => {
                this.dialogs.createData.snackbar.show = true
                this.inputs.mou.loading = false
            })
        },
        closeActions(type, name) {
            this[type][name].show = false
        },
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
        numberFormat(num) {
            return new Intl.NumberFormat('id-ID').format(num)
        },
        openGoogleMap() {
            window.open(`http://maps.google.co.id/maps?q=${this.inputs.latitude.model},${this.inputs.longitude.model}`)
        },
        photo1FileChanged (event) {
            if (event) {
                this.inputs.photos.photo1.model = event
                this.inputs.photos.photo1.preview = URL.createObjectURL(event)
            } else {
                this.inputs.photos.photo1.model = null
                this.inputs.photos.photo1.preview = ""
            }
        },
        photo2FileChanged (event) {
            if (event) {
                this.inputs.photos.photo2.model = event
                this.inputs.photos.photo2.preview = URL.createObjectURL(event)
            } else {
                this.inputs.photos.photo2.model = null
                this.inputs.photos.photo2.preview = ""
            }
        },
        photo3FileChanged (event) {
            if (event) {
                this.inputs.photos.photo3.model = event
                this.inputs.photos.photo3.preview = URL.createObjectURL(event)
            } else {
                this.inputs.photos.photo3.model = null
                this.inputs.photos.photo3.preview = ""
            }
        },
        photo4FileChanged (event) {
            if (event) {
                this.inputs.photos.photo4.model = event
                this.inputs.photos.photo4.preview = URL.createObjectURL(event)
            } else {
                this.inputs.photos.photo4.model = null
                this.inputs.photos.photo4.preview = ""
            }
        },
        resetInputData() {
            // main data
            this.inputs.mou.model = ''
            this.inputs.mou.exist = false
            this.inputs.employee.model = ''
            this.inputs.pic.model = ''
            this.inputs.picKtp.model = ''
            this.inputs.landArea.model = 0
            this.inputs.landCoverage.model = 0
            this.inputs.croppingPattern.model = ''
            this.inputs.landStatus.model = ''
            this.inputs.landDistance.model = 0
            this.inputs.landAccess.model = ''
            this.inputs.mu.model = ''
            this.inputs.province.model = ''
            this.inputs.regency.model = ''
            this.inputs.regency.items = []
            this.inputs.district.model = ''
            this.inputs.district.items = []
            this.inputs.village.model = ''
            this.inputs.village.items = []
            this.inputs.address.model = ''
            // seeds
            this.inputs.seeds.table.items = []
            // coordinates
            this.inputs.latitude.model = ''
            this.inputs.longitude.model = ''
            this.inputs.dateDistribution.model = ''
            this.inputs.dateHoleSurveillance.model = ''
            this.inputs.dateRealization.model = ''
            // photos
            this.inputs.photos.photo1.model = ''
            this.inputs.photos.photo1.preview = ''
            this.inputs.photos.photo2.model = ''
            this.inputs.photos.photo2.preview = ''
            this.inputs.photos.photo3.model = ''
            this.inputs.photos.photo3.preview = ''
            this.inputs.photos.photo4.model = ''
            this.inputs.photos.photo4.preview = ''
        },
        async setDummyData() {
            // main data
            this.inputs.mou.model = "TESTGENERALLAND001"
            this.checkMoUNoExisting(this.inputs.mou.model)
            this.inputs.employee.model = '1110'
            this.inputs.pic.model = 'Qwerty'
            this.inputs.picKtp.model = '3322022107010001'
            this.inputs.landArea.model = 20000
            this.inputs.croppingPattern.model = 'Pola Konservasi Pohon Kayu'
            this.inputs.landStatus.model = 'Lapangan'
            this.inputs.landDistance.model = 100
            this.inputs.landAccess.model = 'Mobil'
            this.inputs.mu.model = '021'
            this.inputs.province.model = 'JB'
            await this.getOptionsData({type: 'regency'})
            this.inputs.regency.model = '39'
            await this.getOptionsData({type: 'district'})
            this.inputs.district.model = '32.04.16'
            await this.getOptionsData({type: 'village'})
            this.inputs.village.model = '32.04.16.06'
            this.inputs.address.model = 'Jalan'
            // seeds
            this.inputs.seeds.table.items = [
                {
                    tree_category: 'KAYU',
                    tree_name: 'Jabon',
                    tree_code: 'T0067',
                    tree_amount: 400
                },
                {
                    tree_category: 'MPTS',
                    tree_name: 'Alpukat',
                    tree_code: 'T0039',
                    tree_amount: 100
                }
            ]
            // coordinates
            this.inputs.latitude.model = '-7.026434'
            this.inputs.longitude.model = '110.424260'
            this.inputs.dateDistribution.model = '2022-01-31'
            // forward step
            this.dialogs.createData.step = 4
        },
        showLightbox(imgs, index) {
            if (imgs) this.$store.state.lightbox.imgs = imgs
            
            if (index) this.$store.state.lightbox.index = index
            else this.$store.state.lightbox.index = 0

            this.$store.state.lightbox.show = true
        },
        stepperMove(type) {
            let step = parseInt(this.dialogs.createData.step)
            if (type == '+') {
                step += 1
            } else if (type == '-') {
                step -= 1
            }
            this.dialogs.createData.step = step
        },
        async uploadPhotos(type, file) {
            this.$store.state.loadingOverlayText = `Saving photo "${type}"...`
            const url = `${this.apiConfig.imageUrl}general-lands/upload.php`
            const newName = `${this.inputs.mou.model.replace(/\s/g, '')}_${type}`
            const data = this.generateFormData({
                dir: type == 'mou' ? 'mou' : 'photos',
                nama: newName,
                image: file
            })
            let responseName = null
            await axios.post(url,data).then(res => {
                responseName = res.data.data.new_name
            }).catch(err => {
                console.error(err)
            })
            return responseName
        }
    }
}
</script>