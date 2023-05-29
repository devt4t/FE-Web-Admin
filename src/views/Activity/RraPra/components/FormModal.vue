<template>
    <v-dialog v-model="showModal"
        content-class="rounded-xl mx-1"
        max-width="1200"
        scrollable
        persistent
    >
        <v-card>
            <v-card-title class="rounded-xl green darken-3 ma-1 pa-2">
                <span class="white--text"><v-btn class="white dark--text mr-1" fab x-small><v-icon color="grey darken-3">mdi-file-document-edit</v-icon></v-btn> RRA PRA Form</span>
                <v-icon color="white" class="ml-auto" @click="showModal = false">mdi-close-circle</v-icon>
            </v-card-title>
            <v-card-text class="pa-0">
                <!-- Loading -->
                <v-overlay absolute :value="loading.show">
                    <div class="d-flex flex-column"></div>
                    <v-progress-circular
                        :size="80"
                        :width="10"
                        indeterminate
                        color="white"
                    >
                    </v-progress-circular>
                    <p class="mt-2 mb-0">{{ loading.text }}</p>
                </v-overlay>
                <!-- SELECT VILLAGE -->
                <v-row class="ma-0 mx-5">
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-city</v-icon>Lokasi Desa</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- Village -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
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
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.village.model"
                        ></v-autocomplete>
                    </v-col>
                </v-row>
                <!-- Stepper -->
                <v-stepper :vertical="localConfig.windowWidth < localConfig.breakLayoutFrom" v-model="stepper.model" class="rounded-xl mt-2 elevation-0">
                    <!-- Stepper Header -->
                    <v-stepper-header v-if="localConfig.windowWidth >= localConfig.breakLayoutFrom" class="elevation-0 mx-5">
                        <template v-for="(stepperName, stepperIndex) in stepper.steps">
                            <v-stepper-step
                                data-aos="zoom-in"
                                :data-aos-delay="200 * stepperIndex"
                                :key="`${stepperIndex + 1}-step`"
                                :complete="stepper.model > stepperIndex + 1"
                                :step="stepperIndex + 1"
                                editable
                                color="green"
                                class="rounded-pill"
                            >
                                <v-icon :color="stepper.model > stepperIndex + 1 ? 'green' : ''">mdi-{{ stepper.steps_icon[stepperIndex] }}</v-icon>
                            </v-stepper-step>

                            <v-divider
                                v-if="(stepperIndex + 1) !== stepper.steps.length"
                                data-aos="fade-right"
                                :data-aos-delay="200 * stepperIndex + 100"
                                :key="(stepperIndex + 1)"
                            ></v-divider>
                        </template>
                    </v-stepper-header>

                    <!-- Stepper Content -->
                    <v-stepper-items>
                        <!-- RRA -->
                        <v-stepper-step v-if="localConfig.windowWidth < localConfig.breakLayoutFrom && stepper.steps.length >= 1" color="green" :complete="stepper.model > 1" :step="1" editable class="rounded-xl py-3 ma-1">
                            <span><v-icon :color="stepper.model > 1 ? 'green' : ''" class="mr-1">mdi-{{ stepper.steps_icon[0] }}</v-icon>{{ stepper.steps[0] }}</span>
                        </v-stepper-step>
                        <v-stepper-content
                            v-if="stepper.steps.length >= 1"
                            class="pt-0"
                            :step="1"
                        >
                            <v-card
                                class="ma-1 rounded-xl"
                                min-height="250px"
                            >
                                <v-card-title v-if="localConfig.windowWidth >= localConfig.breakLayoutFrom">
                                    <span class="grey--text text--darken-2"><v-icon class="mr-2" size="27" style="transform: translateY(-2px);">mdi-{{ stepper.steps_icon[0] }}</v-icon>{{ stepper.steps[0] }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <!-- Villagers Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-account-group</v-icon>Penduduk</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <!-- number_of_families -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.number_of_families.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.number_of_families.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- number_of_souls -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.number_of_souls.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.number_of_souls.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- avg_family_member -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.avg_family_member.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.avg_family_member.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- Education Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-book-education</v-icon>Pendidikan</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <!-- SD - SMP -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.percentage_of_jr_highschool.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                suffix="%"
                                                max="100"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.percentage_of_jr_highschool.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- SMA -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.percentage_of_sr_highschool.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                suffix="%"
                                                max="100"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.percentage_of_sr_highschool.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- Univ -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.percentage_of_university.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                suffix="%"
                                                max="100"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.percentage_of_university.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- Age Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-account-arrow-up</v-icon>Umur Produktivitas</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <!-- Productive -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.percentage_of_productive.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                suffix="%"
                                                max="100"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.percentage_of_productive.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- Not Productive -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.percentage_of_not_productive.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                suffix="%"
                                                max="100"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.percentage_of_not_productive.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- Job Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-hand-coin</v-icon>Pekerjaan</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <!-- Farmer -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.percentage_of_farmers.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                suffix="%"
                                                max="100"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.percentage_of_farmers.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- Farmer Workers -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.percentage_of_farmer_workers.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                suffix="%"
                                                max="100"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.percentage_of_farmer_workers.model"
                                            ></v-text-field>
                                        </v-col>
                                        <!-- Other Jobs -->
                                        <v-col cols="12" sm="12" md="6" lg="4">
                                            <v-text-field
                                                dense
                                                color="success"
                                                hide-details
                                                :label="inputs.percentage_of_other_profession.label"
                                                :disabled="false"
                                                outlined
                                                rounded
                                                type="number"
                                                suffix="%"
                                                max="100"
                                                :rules="[(v) => !!v || 'Field is required']"
                                                v-model="inputs.percentage_of_other_profession.model"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-stepper-content>
                        <!-- PRA -->
                        <v-stepper-step v-if="localConfig.windowWidth < localConfig.breakLayoutFrom && stepper.steps.length >= 2" color="green" :complete="stepper.model > 2" :step="2" editable class="rounded-xl py-3 ma-1">
                            <span><v-icon :color="stepper.model > 2 ? 'green' : ''" class="mr-1">mdi-{{ stepper.steps_icon[1] }}</v-icon>{{ stepper.steps[1] }}</span>
                        </v-stepper-step>
                        <v-stepper-content
                            v-if="stepper.steps.length >= 2"
                            class="pt-0"
                            :step="2"
                        >
                            <v-card
                                class="ma-1 rounded-xl"
                                min-height="250px"
                            >
                                <v-card-title v-if="localConfig.windowWidth >= localConfig.breakLayoutFrom">
                                    <span class="grey--text text--darken-2"><v-icon class="mr-2" size="27" style="transform: translateY(-2px);">mdi-{{ stepper.steps_icon[1] }}</v-icon>{{ stepper.steps[1] }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <!-- Land Tenure Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-land-plots</v-icon>Penguasaan Lahan</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(land_tenure, land_tenure_index) in inputs.land_tenure.model" 
                                                :key="`land_tenure_${land_tenure_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ land_tenure_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- land tenure type -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.land_tenure.options.type.items"
                                                                :label="inputs.land_tenure.options.type.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="land_tenure.type"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- land tenure function -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.land_tenure.options.func.items"
                                                                :label="inputs.land_tenure.options.func.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="land_tenure.func"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- land tenure land type -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.land_tenure.options.land_type.items"
                                                                :label="inputs.land_tenure.options.land_type.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="land_tenure.land_type"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- Unit -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Unit"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                suffix="Ha"
                                                                max="100"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="land_tenure.percentage"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- land tenure status -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.land_tenure.options.status.items"
                                                                :label="inputs.land_tenure.options.status.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="land_tenure.status"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.land_tenure.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`land_tenure_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'land_tenure')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.land_tenure.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`land_tenure_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'land_tenure')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Disaster Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-heart-broken</v-icon>Riwayat Bencana</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(disaster_data, disaster_data_index) in inputs.disaster_data.model" 
                                                :key="`disaster_data_${disaster_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ disaster_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- disaster_data name -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nama"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="disaster_data.name"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- disaster_data categories -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.disaster_data.options.categories.items"
                                                                :label="inputs.disaster_data.options.categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="disaster_data.categories"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- disaster_data year -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Tahun"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="disaster_data.year"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- disaster_data fatalities -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Korban Jiwa"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                suffix="jiwa"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="disaster_data.fatalities"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- disaster_data details -->
                                                        <v-col cols="12" sm="12" md="6" lg="8">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Detail"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="disaster_data.details"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.disaster_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`disaster_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'disaster_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.disaster_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`disaster_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'disaster_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Problem Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-book-alert</v-icon>Permasalahan Yang Ada</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(problem_data, problem_data_index) in inputs.problem_data.model" 
                                                :key="`problem_data_${problem_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ problem_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- problem_data name -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nama Masalah"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- problem_data categories -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.problem_data.options.categories.items"
                                                                :label="inputs.problem_data.options.categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="problem_data.categories"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- problem_data types -->
                                                        <!-- <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.problem_data.options.types.items"
                                                                :label="inputs.problem_data.options.types.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="problem_data.types"
                                                            ></v-autocomplete>
                                                        </v-col> -->
                                                        <!-- problem_data date -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Tanggal"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="problem_data.date"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- problem_data rank -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.problem_data.options.rank.items"
                                                                :label="inputs.problem_data.options.rank.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="problem_data.rank"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- problem_data source -->
                                                        <v-col cols="12" sm="12" md="12" lg="12">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Sumber"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="problem_data.source"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- problem_data solution -->
                                                        <v-col cols="12" sm="12" md="12" lg="12">
                                                            <label for="">Solusi</label>
                                                            <VueEditor />
                                                            <!-- <v-textarea
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Solusi"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="problem_data.solution"
                                                            ></v-textarea> -->
                                                        </v-col>
                                                        <!-- problem_data stakeholder -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.problem_data.options.stakeholder.items"
                                                                :label="inputs.problem_data.options.stakeholder.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="problem_data.stakeholder"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- problem_data status -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.problem_data.options.status.items"
                                                                :label="inputs.problem_data.options.status.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="problem_data.status"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- problem_data ownership -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.problem_data.options.ownership.items"
                                                                :label="inputs.problem_data.options.ownership.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="problem_data.ownership"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.problem_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`problem_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'problem_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.problem_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`problem_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'problem_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Fertilizer Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-beer</v-icon>Data Pupuk</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(fertilizer_data, fertilizer_data_index) in inputs.fertilizer_data.model" 
                                                :key="`fertilizer_data_${fertilizer_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ fertilizer_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- fertilizer_data name -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nama"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fertilizer_data.name"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- fertilizer_data categories -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.fertilizer_data.options.categories.items"
                                                                :label="inputs.fertilizer_data.options.categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fertilizer_data.categories"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- fertilizer_data types -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.fertilizer_data.options.types.items"
                                                                :label="inputs.fertilizer_data.options.types.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fertilizer_data.types"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- fertilizer_data sources -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.fertilizer_data.options.sources.items"
                                                                :label="inputs.fertilizer_data.options.sources.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fertilizer_data.sources"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.fertilizer_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`fertilizer_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'fertilizer_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.fertilizer_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`fertilizer_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'fertilizer_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Pesticide Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-heat-wave</v-icon>Data Pestisida</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(pesticide_data, pesticide_data_index) in inputs.pesticide_data.model" 
                                                :key="`pesticide_data_${pesticide_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ pesticide_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- pesticide_data name -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nama"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="pesticide_data.name"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- pesticide_data categories -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.pesticide_data.options.categories.items"
                                                                :label="inputs.pesticide_data.options.categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="pesticide_data.categories"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- pesticide_data types -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.pesticide_data.options.types.items"
                                                                :label="inputs.pesticide_data.options.types.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="pesticide_data.types"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- pesticide_data sources -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.pesticide_data.options.sources.items"
                                                                :label="inputs.pesticide_data.options.sources.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="pesticide_data.sources"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.pesticide_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`pesticide_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'pesticide_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.pesticide_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`pesticide_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'pesticide_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Income Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-cash-multiple</v-icon>Data Penghasilan</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(income_data, income_data_index) in inputs.income_data.model" 
                                                :key="`income_data_${income_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ income_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- income_data employment -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.income_data.options.employment.items"
                                                                :label="inputs.income_data.options.employment.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="income_data.employment"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- income_data percentage -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Penghasilan (Per-Bulan)"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                prefix="Rp"
                                                                suffix=""
                                                                max="100"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="income_data.percentage"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.income_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`income_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'income_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.income_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`income_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'income_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Marketing Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-store</v-icon>Data Pemasaran Komoditas</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(marketing_data, marketing_data_index) in inputs.marketing_data.model" 
                                                :key="`marketing_data_${marketing_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ marketing_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- marketing_data trade_method -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.marketing_data.options.trade_method.items"
                                                                :label="inputs.marketing_data.options.trade_method.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="marketing_data.trade_method"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- marketing_data start_period -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Periode"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="marketing_data.start_period"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- marketing_data contact_name -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nama Kontak"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="marketing_data.contact_name"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- marketing_data contact_number -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nomor Kontak"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="marketing_data.contact_number"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- marketing_data contract_details -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.marketing_data.options.contract_details.items"
                                                                :label="inputs.marketing_data.options.contract_details.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="marketing_data.contract_details"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- marketing_data details -->
                                                        <v-col cols="12" sm="12" md="12" lg="12">
                                                            <v-textarea
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Marketing Details"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="marketing_data.details"
                                                            ></v-textarea>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.marketing_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`marketing_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'marketing_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.marketing_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`marketing_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'marketing_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Water Source Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-waves</v-icon>Sumber Air</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(water_source_data, water_source_data_index) in inputs.water_source_data.model" 
                                                :key="`water_source_data_${water_source_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ water_source_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- water_source_data consumptions -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.water_source_data.options.consumptions.items"
                                                                :label="inputs.water_source_data.options.consumptions.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="water_source_data.consumptions"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- water_source_data categories -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.water_source_data.options.categories.items"
                                                                :label="inputs.water_source_data.options.categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="water_source_data.categories"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- water_source_data types -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.water_source_data.options.types.items"
                                                                :label="inputs.water_source_data.options.types.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="water_source_data.types"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- water_source_data name -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nama"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="water_source_data.name"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- water_source_data total -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Total Unit"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="water_source_data.total"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- water_source_data seasonal -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                multiple
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.water_source_data.options.seasonal.items"
                                                                :label="inputs.water_source_data.options.seasonal.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="water_source_data.seasonal"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.water_source_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`water_source_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'water_source_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.water_source_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`water_source_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'water_source_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Planting Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-forest</v-icon>Data Penanaman Yang Sudah Ada</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(planting_data, planting_data_index) in inputs.planting_data.model" 
                                                :key="`planting_data_${planting_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ planting_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- planting_data categories -->
                                                        <v-col cols="12" sm="12" md="6" lg="3">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.planting_data.options.categories.items"
                                                                :label="inputs.planting_data.options.categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="planting_data.categories"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- planting_data types -->
                                                        <v-col cols="12" sm="12" md="6" lg="3">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.planting_data.options.types.items"
                                                                :label="inputs.planting_data.options.types.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="planting_data.types"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- marketing_data start_period -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Periode"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="planting_data.start_period"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.planting_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`planting_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'planting_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.planting_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`planting_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'planting_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-stepper-content>
                        <!-- Social Impact -->
                        <v-stepper-step v-if="localConfig.windowWidth < localConfig.breakLayoutFrom && stepper.steps.length >= 3" color="green" :complete="stepper.model > 3" :step="3" editable class="rounded-xl py-3 ma-1">
                            <span><v-icon :color="stepper.model > 3 ? 'green' : ''" class="mr-1">mdi-{{ stepper.steps_icon[2] }}</v-icon>{{ stepper.steps[2] }}</span>
                        </v-stepper-step>
                        <v-stepper-content
                            v-if="stepper.steps.length >= 3"
                            class="pt-0"
                            :step="3"
                        >
                            <v-card
                                class="ma-1 rounded-xl"
                                min-height="250px"
                            >
                                <v-card-title v-if="localConfig.windowWidth >= localConfig.breakLayoutFrom">
                                    <span class="grey--text text--darken-2"><v-icon class="mr-2" size="27" style="transform: translateY(-2px);">mdi-{{ stepper.steps_icon[2] }}</v-icon>{{ stepper.steps[2] }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <!-- Flora Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-flower</v-icon>Data Flora Endemik</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(flora_data, flora_data_index) in inputs.flora_data.model" 
                                                :key="`flora_data_${flora_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ flora_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- flora_data categories -->
                                                        <!-- <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.flora_data.options.categories.items"
                                                                :label="inputs.flora_data.options.categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="flora_data.categories"
                                                            ></v-autocomplete>
                                                        </v-col> -->
                                                        <!-- flora_data types -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.flora_data.options.types.items"
                                                                :label="inputs.flora_data.options.types.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="flora_data.types"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- flora_data name -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nama"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="flora_data.name"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- flora_data population -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Populasi"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="flora_data.population"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- flora_data water_source -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.flora_data.options.water_source.items"
                                                                :label="inputs.flora_data.options.water_source.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="flora_data.water_source"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- flora_data status -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.flora_data.options.status.items"
                                                                :label="inputs.flora_data.options.status.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="flora_data.status"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- flora_data habitat -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Habitat"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="flora_data.habitat"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.flora_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`flora_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'flora_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.flora_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`flora_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'flora_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Fauna Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-cat</v-icon>Data Satwa Endemik</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(fauna_data, fauna_data_index) in inputs.fauna_data.model" 
                                                :key="`fauna_data_${fauna_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ fauna_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- fauna_data categories -->
                                                        <!-- <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.fauna_data.options.categories.items"
                                                                :label="inputs.fauna_data.options.categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fauna_data.categories"
                                                            ></v-autocomplete>
                                                        </v-col> -->
                                                        <!-- fauna_data types -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.fauna_data.options.types.items"
                                                                :label="inputs.fauna_data.options.types.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fauna_data.types"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- fauna_data name -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nama"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fauna_data.name"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- fauna_data population -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Populasi"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fauna_data.population"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- fauna_data food_source -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.fauna_data.options.food_source.items"
                                                                :label="inputs.fauna_data.options.food_source.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fauna_data.food_source"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- fauna_data status -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.fauna_data.options.status.items"
                                                                :label="inputs.fauna_data.options.status.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fauna_data.status"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- fauna_data habitat -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Habitat"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="fauna_data.habitat"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.fauna_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`fauna_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'fauna_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.fauna_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`fauna_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'fauna_data')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Income Data Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-hand-coin</v-icon>Data Income</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(income_data_si, income_data_si_index) in inputs.income_data_si.model" 
                                                :key="`income_data_si_${income_data_si_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ income_data_si_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- income_data_si categories -->
                                                        <!-- <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.income_data_si.options.categories.items"
                                                                :label="inputs.income_data_si.options.categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="income_data_si.categories"
                                                            ></v-autocomplete>
                                                        </v-col> -->
                                                        <!-- income_data_si crops_categories -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.income_data_si.options.crops_categories.items"
                                                                :label="inputs.income_data_si.options.crops_categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="income_data_si.crops_categories"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- income_data_si crops_types -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.income_data_si.options.crops_types.items"
                                                                :label="inputs.income_data_si.options.crops_types.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="income_data_si.crops_types"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- income_data_si crops_name -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.income_data_si.options.crops_name.items"
                                                                :label="inputs.income_data_si.options.crops_name.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="income_data_si.crops_name"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- income_data_si production_capacity -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Kapasitas Produksi"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                suffix="kg"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="income_data_si.production_capacity"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- income_data_si total_farming_family -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Jumlah Keluarga Petani"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                suffix="Keluarga"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="income_data_si.total_farming_family"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.income_data_si.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`income_data_si_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'income_data_si')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.income_data_si.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`income_data_si_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'income_data_si')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <!-- Economic Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-cash-multiple</v-icon>Data Ekonomi</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(economic_data_si, economic_data_si_index) in inputs.economic_data_si.model" 
                                                :key="`economic_data_si_${economic_data_si_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ economic_data_si_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- economic_data_si trade_method -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.economic_data_si.options.trade_method.items"
                                                                :label="inputs.economic_data_si.options.trade_method.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="economic_data_si.trade_method"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- economic_data_si start_period -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Periode"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="economic_data_si.start_period"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- economic_data_si distribution -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.economic_data_si.options.distribution.items"
                                                                :label="inputs.economic_data_si.options.distribution.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="economic_data_si.distribution"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- economic_data_si revenue -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Pendapatan"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                prefix="Rp"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="economic_data_si.revenue"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.economic_data_si.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`economic_data_si_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'economic_data_si')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.economic_data_si.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`economic_data_si_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'economic_data_si')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-card-text>
            <v-card-actions>
                <v-btn 
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-200" 
                    text rounded color="red" class="pl-2">
                    <v-icon class="mr-1">mdi-close-circle</v-icon>
                    Close
                </v-btn>
                <v-divider class="mx-2"></v-divider>
                <v-btn
                    data-aos="fade-left"
                    data-aos-duration="300"
                    data-aos-offset="-200" 
                    color="orange"
                    class="mr-2 pl-2"
                    rounded
                    outlined
                    :key="`back-${stepper.model}`"
                    v-if="stepper.model > 1"
                    @click="() => stepper.model -= 1"
                >
                    <v-icon>mdi-chevron-left</v-icon>
                    {{ stepper.steps[stepper.model - 2] || 'Back' }}
                    <v-icon class="mx-1">mdi-{{ stepper.steps_icon[stepper.model - 2] }}</v-icon>
                </v-btn>
                <v-btn
                    data-aos="fade-right"
                    data-aos-duration="300"
                    data-aos-offset="-200" 
                    color="green white--text"
                    class="pr-2"
                    rounded
                    v-if="stepper.model < stepper.steps.length"
                    @click="() => stepper.model += 1"
                    :key="`next-${stepper.model}`"
                >
                    <v-icon class="mx-1">mdi-{{ stepper.steps_icon[stepper.model] }}</v-icon>
                    {{ stepper.steps[stepper.model] || 'Next' }}
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn
                    data-aos="zoom-in"
                    data-aos-duration="300"
                    data-aos-offset="-200" 
                    color="primary white--text"
                    class=""
                    rounded
                    :key="`saveButton`"
                    v-else
                >
                    <v-icon class="mr-1">mdi-content-save</v-icon>
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import formOptions from '@/assets/json/rraPraOptions.json'

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: '0'
        },
        programYear: {
            type: String,
            default: '0'
        }
    },
    data: () => ({
        inputs: {
            program_year: {
                model: '',
                required: true
            },
            // village location inputs
            province: {
                label: 'Provinsi',
                model: '',
                items: [],
                loading: false
            },
            regency: {
                label: 'Kabupaten / Kota',
                model: '',
                items: [],
                loading: false
            },
            district: {
                label: 'Kecamatan',
                model: '',
                items: [],
                loading: false
            },
            village: {
                items: [],
                label: 'Desa',
                model: '',
                loading: false
            },
            address: {
                label: 'Address',
                model: '',
                loading: false
            },
            // RRA
            number_of_families: {
                label: 'Jumlah KK',
                model: '',
                loading: false
            },
            number_of_souls: {
                label: 'Jumlah Jiwa',
                model: '',
                loading: false
            },
            avg_family_member: {
                label: 'Rata - Rata Anggota Keluarga',
                model: '',
                loading: false
            },
            percentage_of_jr_highschool: {
                label: 'SD - SMP',
                model: '',
                loading: false
            },
            percentage_of_sr_highschool: {
                label: 'SMA',
                model: '',
                loading: false
            },
            percentage_of_university: {
                label: 'Kuliah',
                model: '',
                loading: false
            },
            percentage_of_productive: {
                label: 'Produktif',
                model: '',
                loading: false
            },
            percentage_of_not_productive: {
                label: 'Tidak Produktif',
                model: '',
                loading: false
            },
            percentage_of_farmers: {
                label: 'Petani',
                model: '',
                loading: false
            },
            percentage_of_farmer_workers: {
                label: 'Buruh Tani',
                model: '',
                loading: false
            },
            percentage_of_other_profession: {
                label: 'Profesi Lain',
                model: '',
                loading: false
            },
            // PRA
            land_tenure: {
                options: {
                    type: {
                        label: 'Tipe Penguasaan Lahan',
                        items: formOptions.land_tenure_type
                    },
                    func: {
                        label: 'Fungsi Lahan',
                        items: formOptions.land_tenure_func
                    },
                    land_type: {
                        label: 'Tipe Lahan',
                        items: formOptions.land_type
                    },
                    status: {
                        label: 'Status Lahan',
                        items: formOptions.land_tenure_status
                    }
                },
                model: [
                    {
                        type: '',
                        func: '',
                        land_type: '',
                        percentage: 0,
                        status: ''
                    }
                ]
            },
            innovative_data: {
                options: {
                    farmer_speciality: {
                        label: 'Spesialisasi Petani',
                        items: formOptions.farmer_speciality
                    },
                    potential_categories: {
                        label: 'Potensial',
                        items: formOptions.potential_categories
                    },
                    organic_categories: {
                        label: 'Kategori Organik',
                        items: formOptions.organic_categories
                    },
                    organic_types: {
                        label: 'Jenis Organik',
                        items: formOptions.organic_types
                    }
                },
                model: [
                    {
                        farmer_speciality: '',
                        potential_categories: '',
                        organic_categories: '',
                        organic_types: '',
                        organic_name: '',
                        production_capacity: 0,
                        innovative_rating: ''
                    }
                ]
            },
            disaster_data: {
                options: {
                    categories: {
                        label: 'Kategori',
                        items: formOptions.disaster_categories
                    },
                },
                model: [
                    {
                        name: '',
                        categories: '',
                        year: moment().format('Y'),
                        fatalities: 0,
                        details: '',
                    }
                ]
            },
            problem_data: {
                options: {
                    categories: {
                        label: 'Kategori',
                        items: formOptions.problemCategories
                    },
                    types: {
                        label: 'Jenis',
                        items: formOptions.problemTypes
                    },
                    rank: {
                        label: 'Tingkat',
                        items: formOptions.problemRank
                    },
                    stakeholder: {
                        label: 'Stakeholder',
                        items: formOptions.problemStakeholder
                    },
                    status: {
                        label: 'Status',
                        items: formOptions.problemStatus
                    },
                    ownership: {
                        label: 'Ownership',
                        items: formOptions.problemOwnership
                    },
                },
                model: [
                    {
                        categories: '',
                        types: '',
                        date: moment().format('YYYY-MM-DD'),
                        rank: '',
                        source: '',
                        solution: '',
                        stakeholder: '',
                        status: '',
                        ownership: '',
                    }
                ]
            },
            fertilizer_data: {
                options: {
                    categories: {
                        label: 'Kategori',
                        items: formOptions.fertilizer_categories
                    },
                    types: {
                        label: 'Tipe',
                        items: formOptions.fertilizer_types
                    },
                    sources: {
                        label: 'Sumber',
                        items: formOptions.fertilizer_sources
                    },
                },
                model: [
                    {
                        name: '',
                        categories: '',
                        types: '',
                        sources: '',
                    }
                ]
            },
            pesticide_data: {
                options: {
                    categories: {
                        label: 'Kategori',
                        items: formOptions.pesticide_categories
                    },
                    types: {
                        label: 'Tipe',
                        items: formOptions.pesticide_types
                    },
                    sources: {
                        label: 'Sumber',
                        items: formOptions.pesticide_sources
                    },
                },
                model: [
                    {
                        name: '',
                        categories: '',
                        types: '',
                        sources: '',
                    }
                ]
            },
            income_data: {
                options: {
                    employment: {
                        label: 'Pekerjaan',
                        items: formOptions.income_employment
                    },
                },
                model: [
                    {
                        employment: '',
                        percentage: 0,
                    }
                ]
            },
            marketing_data: {
                options: {
                    trade_method: {
                        label: 'Metode',
                        items: formOptions.marketingTradeMethod
                    },
                    contract_details: {
                        label: 'Contract Detail',
                        items: formOptions.marketingContractDetails
                    },
                },
                model: [
                    {
                        trade_method: '',
                        start_period: '',
                        end_period: '',
                        contact_name: '',
                        contact_number: '',
                        contract_details: '',
                        details: ''
                    }
                ]
            },
            water_source_data: {
                options: {
                    consumptions: {
                        label: 'Consumptions',
                        items: formOptions.wsConsumptions
                    },
                    categories: {
                        label: 'Kategori',
                        items: formOptions.wsCategories
                    },
                    types: {
                        label: 'Tipe',
                        items: formOptions.wsTypes
                    },
                    seasonal: {
                        label: 'Seasonal',
                        items: formOptions.wsSeasonal
                    },
                },
                model: [
                    {
                        consumptions: '',
                        categories: '',
                        types: '',
                        name: '',
                        total: '',
                        seasonal: '',
                    }
                ]
            },
            planting_data: {
                options: {
                    types: {
                        label: 'Jenis',
                        items: []
                    },
                    categories: {
                        label: 'Kategori',
                        items: ['Kayu', 'MPTS', 'Crops']
                    }
                },
                model: [
                    {
                        types: '',
                        categories: '',
                        start_period: '',
                        end_period: ''
                    }
                ]
            },
            // social impact
            flora_data: {
                options: {
                    categories: {
                        label: 'Kategori',
                        items: formOptions.floraCategories
                    },
                    types: {
                        label: 'Jenis',
                        items: formOptions.floraTypes
                    },
                    status: {
                        label: 'Status',
                        items: formOptions.floraStatus
                    },
                    water_source: {
                        label: 'Sumber Air',
                        items: formOptions.wsCategories
                    },
                },
                model: [
                    {
                        categories: '',
                        types: '',
                        name: '',
                        population: 0,
                        water_source: '',
                        status: '',
                        habitat: ''
                    }
                ]
            },
            fauna_data: {
                options: {
                    categories: {
                        label: 'Kategori',
                        items: formOptions.faunaCategories
                    },
                    types: {
                        label: 'Jenis',
                        items: formOptions.faunaTypes
                    },
                    status: {
                        label: 'Status',
                        items: formOptions.faunaStatus
                    },
                    food_source: {
                        label: 'Sumber Makanan',
                        items: formOptions.faunaFoodSource
                    },
                },
                model: [
                    {
                        categories: '',
                        types: '',
                        name: '',
                        population: 0,
                        food_source: '',
                        status: '',
                        habitat: ''
                    }
                ]
            },
            income_data_si: {
                options: {
                    categories: {
                        label: 'Kategori',
                        items: formOptions.incomeCategories
                    },
                    crops_categories: {
                        label: 'Kategori Crops',
                        items: formOptions.incomeCropsCategories
                    },
                    crops_types: {
                        label: 'Jenis Crops',
                        items: formOptions.incomeCropsTypes
                    },
                    crops_name: {
                        label: 'Nama Crops',
                        items: []
                    },
                },
                model: [
                    {
                        categories: '',
                        crops_categories: '',
                        crops_types: '',
                        crops_name: '',
                        crops_production_capacity: 0,
                        total_farming_families: 0,
                    }
                ]
            },
            economic_data_si: {
                options: {
                    trade_method: {
                        label: 'Metode',
                        items: formOptions.marketingTradeMethod
                    },
                    distribution: {
                        label: 'Jenis',
                        items: formOptions.economicDistribution
                    },
                },
                model: [
                    {
                        trade_method: '',
                        start_period: '',
                        end_period: '',
                        distribution: '',
                        revenue: 0
                    }
                ]
            },
        },
        loading: {
            show: false,
            text: 'Loading...'
        },
        localConfig: {
            windowWidth: window.innerWidth,
            breakLayoutFrom: 1140,
            maxSubDataTotal: 5
        },
        stepper: {
            model: 1,
            steps: ['RRA', 'PRA', 'Social Impact'],
            steps_icon: ['home-analytics', 'home-group', 'home-alert']
        }
    }),
    watch: {
    },
    computed: {
        showModal: {
            get: function () {
                return this.show
            },
            set: function(newVal) {
                if (newVal) {
                    this.inputs.program_year.model = this.programYear
                    if (this.id) {
                        this.getDetailData(this.id)
                    }
                } else this.$emit('action', {type: 'close', name: 'form'})
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
    },
    methods: {
        errorResponse(error) {
            console.log(error)
            if (error.response) {
                if (error.response.status) {
                if (error.response.status == 401) {
                    localStorage.removeItem("token");
                    this.$router.push("/");
                }
                }
            }
        },
        async getOptionsData(inputs) {
            try {
                // prepare for calling api
                let url = ''
                
                // set url
                if (inputs.type == 'province') url = 'GetProvince'
                else if (inputs.type == 'regency') url = 'GetKabupaten?province_code=' + this.inputs.province.model
                else if (inputs.type == 'district') url = 'GetKecamatan?kabupaten_no=' + this.inputs.regency.model
                else if (inputs.type == 'village') url = 'GetDesa?&kode_kecamatan=' + this.inputs.district.model

                this.$store.state.loadingOverlayText = `Getting ${inputs.type} datas...`

                // reset data 
                if (inputs.type == 'regency') {
                    this.inputs.district.model = ''
                    this.inputs.district.items = []
                } if (['regency', 'district'].includes(inputs.type)) { 
                    this.inputs.village.model = ''
                    this.inputs.village.items = []
                }
                if (url != '') {
                    url = this.$store.getters.getApiUrl(url) 

                    this.inputs[inputs.type].model = ''
                    this.inputs[inputs.type].loading = true
                    
                    // calling api
                    const res = await axios.get(url, this.$store.state.apiConfig)
                    this.inputs[inputs.type].items = res.data.data.result.sort((a, b) => a.name.localeCompare(b.name))
                }
            } catch (err) {
                this.errorResponse(err)
                this.inputs[inputs.type].items = []
            } finally {
                this.$store.state.loadingOverlayText = null
                this.inputs[inputs.type].loading = false
            }
        },
        modifyTotalSubData(type, name) {
            if (type == '+') {
                let inputs = {}
                if (name == 'land_tenure') {
                    inputs = {
                        type: '',
                        func: '',
                        land_type: '',
                        percentage: 0,
                        status: ''
                    }
                } else if (name == 'innovative_data') {
                    inputs = {
                        farmer_speciality: '',
                        potential_categories: '',
                        organic_categories: '',
                        organic_types: '',
                        organic_name: '',
                        production_capacity: 0,
                        innovative_rating: ''
                    }
                } else if (name == 'disaster_data') {
                    inputs = {
                        name: '',
                        categories: '',
                        year: moment().format('Y'),
                        fatalities: 0,
                        details: '',
                    }
                } else if (name == 'problem_data') {
                    inputs = {
                        categories: '',
                        types: '',
                        date: moment().format('YYYY-MM-DD'),
                        rank: '',
                        source: '',
                        solution: '',
                        stakeholder: '',
                        status: '',
                        ownership: '',
                    }
                } else if (['fertilizer_data', 'pesticide_data'].includes(name)) {
                    inputs = {
                        name: '',
                        categories: '',
                        types: '',
                        sources: '',
                    }
                } else if (name == 'income_data') {
                    inputs = {
                        employment: '',
                        percentage: 0,
                    }
                } else if (name == 'marketing_data') {
                    inputs = {
                        trade_method: '',
                        start_period: '',
                        end_period: '',
                        contact_name: '',
                        contact_number: '',
                        contract_details: '',
                        details: ''
                    }
                } else if (name == 'water_source_data') {
                    inputs = {
                        consumptions: '',
                        categories: '',
                        types: '',
                        name: '',
                        total: '',
                        seasonal: '',
                    }
                } else if (name == 'planting_data') {
                    inputs = {
                        types: '',
                        categories: '',
                        start_period: '',
                        end_period: ''
                    }
                } else if (['flora_data', 'fauna_data'].includes(name)) {
                    inputs = {
                        categories: '',
                        types: '',
                        name: '',
                        population: 0,
                        status: '',
                        habitat: ''
                    }
                    if (name == 'flora_data') inputs.water_source = ''
                    else inputs.food_source = ''
                } else if (name == 'income_data_si') {
                    inputs = {
                        categories: '',
                        crops_categories: '',
                        crops_types: '',
                        crops_name: '',
                        crops_production_capacity: 0,
                        total_farming_families: 0,
                    }
                } else if (name == 'economic_data_si') {
                    inputs = {
                        trade_method: '',
                        start_period: '',
                        end_period: '',
                        distribution: '',
                        revenue: 0
                    }
                }
                
                this.inputs[name].model.push(inputs)
            } else if (type == '-') this.inputs[name].model.pop()
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        }
    }
}
</script>