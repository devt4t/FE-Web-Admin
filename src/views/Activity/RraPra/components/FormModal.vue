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
                                                                suffix="%"
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
                                        <!-- Innovative Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-star-four-points-circle</v-icon>Data Inovasi</p>
                                                <v-divider class="mx-2"></v-divider>
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row 
                                                v-for="(innovative_data, innovative_data_index) in inputs.innovative_data.model" 
                                                :key="`innovative_data_${innovative_data_index}`"
                                                data-aos="fade-right"
                                                data-aos-offset="-10000"
                                            >
                                                <v-col cols="auto">
                                                    <v-btn fab class="mr-2 elevation-0" color="green white--text" small >{{ innovative_data_index + 1 }}</v-btn>
                                                </v-col>
                                                <v-col cols="11">
                                                    <v-row>
                                                        <!-- innovative_data farmer_speciality -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.innovative_data.options.farmer_speciality.items"
                                                                :label="inputs.innovative_data.options.farmer_speciality.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="innovative_data.farmer_speciality"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- innovative_data potential_categories -->
                                                        <v-col cols="12" sm="12" md="6" lg="6">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.innovative_data.options.potential_categories.items"
                                                                :label="inputs.innovative_data.options.potential_categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="innovative_data.potential_categories"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- innovative_data organic_categories -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.innovative_data.options.organic_categories.items"
                                                                :label="inputs.innovative_data.options.organic_categories.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="innovative_data.organic_categories"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- innovative_data organic_types -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.innovative_data.options.organic_types.items"
                                                                :label="inputs.innovative_data.options.organic_types.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="innovative_data.organic_types"
                                                            ></v-autocomplete>
                                                        </v-col>
                                                        <!-- innovative_data organic_name -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Nama Organik"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="innovative_data.organic_name"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- innovative_data production_capacity -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Kapasitas Produksi"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                suffix="kg"
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="innovative_data.production_capacity"
                                                            ></v-text-field>
                                                        </v-col>
                                                        <!-- innovative_data innovative_rating -->
                                                        <v-col cols="12" sm="12" md="6" lg="4">
                                                            <v-text-field
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                label="Kapasitas Produksi"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                :rules="[(v) => !!v || 'Field is required']"
                                                                v-model="innovative_data.innovative_rating"
                                                            ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <v-btn v-if="inputs.innovative_data.model.length < localConfig.maxSubDataTotal" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`innovative_data_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'innovative_data')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.innovative_data.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`innovative_data_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'innovative_data')"
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
                                                        <!-- disaster_data year -->
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
                                                        <!-- disaster_data year -->
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
                                        <!-- Fertilizer Section -->
                                        <v-col cols="12">
                                            <div class="d-flex align-center">
                                                <p class="mb-0"><v-icon class="mr-2">mdi-land-plots-circle-variant</v-icon>Data Pupuk</p>
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
                                                                label="Percentage"
                                                                :disabled="false"
                                                                outlined
                                                                rounded
                                                                type="number"
                                                                suffix="%"
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
                                                <p class="mb-0"><v-icon class="mr-2">mdi-store</v-icon>Data Marketing</p>
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
                                                                v-model="marketing_data.details"
                                                            ></v-text-field>
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
                        label: 'Tipe',
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
                        label: 'Metode',
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

        for (let index = 0; index < 1; index++) {
            setTimeout(() => {
                this.stepper.model += 1
            }, 1000 * index);
        }
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
                } else if (name == 'fertilizer_data') {
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