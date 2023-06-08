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
                    <div class="d-flex flex-column justify-center align-center">
                        <v-progress-circular
                            :size="80"
                            :width="10"
                            indeterminate
                            color="white"
                        >
                        </v-progress-circular>
                        <p class="mt-2 mb-0">{{ loading.text }}</p>
                    </div>
                </v-overlay>
                <!-- SELECT Scooping Data -->
                <v-row class="ma-0 mx-5">
                    <v-col cols="12" class="d-flex justify-end">
                        <p class="mb-0 red--text">Tanda "<v-icon color="red" class="">{{ localConfig.requiredInputIcon }}</v-icon>" menandakan WAJIB DIISI.</p>
                    </v-col>
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <p class="mb-0"><v-icon class="mr-2">mdi-form-select</v-icon>Data Scooping Visit</p>
                            <v-divider class="mx-2"></v-divider>
                        </div>
                    </v-col>
                    <!-- Scooping Data -->
                    <v-col cols="12" sm="12" md="6" lg="4">
                        <v-autocomplete
                            dense
                            color="success"
                            hide-details
                            item-color="success"
                            item-text="data_no"
                            item-value="data_no"
                            :items="inputs.scooping_form_no.items"
                            :label="inputs.scooping_form_no.label"
                            :loading="inputs.scooping_form_no.loading"
                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                            :no-data-text="inputs.scooping_form_no.loading ? 'Loading...' : 'No Data'"
                            :disabled="false"
                            outlined
                            rounded
                            :rules="[(v) => !!v || 'Field is required']"
                            v-model="inputs.scooping_form_no.model"
                        >
                            <template v-slot:label>
                                {{ inputs.scooping_form_no.label }} 
                                <sup><v-icon v-if="inputs.scooping_form_no.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                            </template>
                            <template v-slot:item="data">
                              <v-list-item-content>
                                <v-list-item-title v-html="data.item.data_no"></v-list-item-title>
                                <v-list-item-subtitle>Desa: {{ data.item.village_name }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <!-- Date Range Data -->
                    <v-col cols="12" sm="12" md="6" lg="6">
                        <!-- datepicker -->
                        <v-menu 
                            rounded="xl"
                            transition="slide-x-transition"
                            bottom
                            min-width="100"
                            offset-y
                            :close-on-content-click="false"
                            v-model="inputs.rra_pra_date_range.show"
                        >
                            <template v-slot:activator="{ on: menu, attrs }">
                                <v-tooltip top content-class="rounded-xl">
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-text-field
                                            dense
                                            color="green"
                                            class="mb-2 mb-lg-0 mr-0 mr-lg-2"
                                            hide-details
                                            outlined
                                            rounded
                                            v-bind="attrs"
                                            v-on="{...menu, ...tooltip}"
                                            readonly
                                            v-model="inputs.rra_pra_date_range.modelShow"
                                        >
                                            <template v-slot:label>
                                                {{ inputs.rra_pra_date_range.label }} 
                                                <sup><v-icon v-if="inputs.rra_pra_date_range.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                            </template>
                                        </v-text-field>
                                    </template>
                                    <span>Klik untuk memunculkan datepicker</span>
                                </v-tooltip>
                            </template>
                            <div class="rounded-xl pb-2 white">
                                <div class="d-flex flex-column align-center rounded-xl">
                                    <v-date-picker 
                                        :range="inputs.rra_pra_date_range.dateType === 'range'"
                                        color="green lighten-1 rounded-xl" 
                                        v-model="inputs.rra_pra_date_range.model"
                                        min="2022-11-24"
                                    ></v-date-picker>
                                </div>
                            </div>
                        </v-menu>
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
                                    <div  v-for="(rraInput, rraInputIndex) in groupingInputs.rra" :key="`RRAInputSection-${rraInputIndex}`">
                                        <!-- Title -->
                                        <div class="d-flex align-center my-8">
                                            <p class="mb-0" style="font-size: 17px"><v-icon class="mr-2">{{ rraInput.icon }}</v-icon>{{ rraInput.title }}</p>
                                            <v-divider class="mx-2"></v-divider>
                                            <v-switch
                                                v-if="rraInput.required === false"
                                                color="green"
                                                v-model="rraInput.optional"
                                                inset
                                                :label="`${rraInput.optional ? 'Ada' : 'Tidak Ada'}`"
                                            ></v-switch>
                                        </div>
                                        <div v-if="(rraInput.required === false && rraInput.optional === true) || rraInput.required">
                                            <!-- column type -->
                                            <v-row v-if="rraInput.type === 'column'">
                                                <!-- Inputs -->
                                                <v-col v-for="(itemKey, iKIndex) in rraInput.items" :key="`Inputs-${itemKey}-${iKIndex}`" 
                                                    cols="12" sm="12" :md="inputs[itemKey].lgView == 12 ? 12 : 6" :lg="inputs[itemKey].lgView" >
                                                    <!-- text-field -->
                                                    <v-text-field
                                                        v-if="inputs[itemKey].inputType == 'text-field'"
                                                        dense
                                                        color="success"
                                                        hide-details
                                                        :label="inputs[itemKey].label"
                                                        outlined
                                                        rounded
                                                        :placeholder="inputs[itemKey].placeholder"
                                                        :readonly="inputs[itemKey].readonly"
                                                        :suffix="inputs[itemKey].suffix"
                                                        :type="inputs[itemKey].type"
                                                        v-model="inputs[itemKey].model"
                                                    >
                                                        <template v-slot:label>
                                                            <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                                            {{ inputs[itemKey].label }} 
                                                            <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                        </template>
                                                        <template v-slot:append>
                                                            <div class="mt-1 ml-1" v-html="inputs[itemKey].append"></div>
                                                        </template>
                                                    </v-text-field>
                                                    <!-- textarea -->
                                                    <v-textarea
                                                        v-else-if="inputs[itemKey].inputType == 'textarea'"
                                                        dense
                                                        color="success"
                                                        hide-details
                                                        :label="inputs[itemKey].label"
                                                        outlined
                                                        rounded
                                                        :placeholder="inputs[itemKey].placeholder"
                                                        :readonly="inputs[itemKey].readonly"
                                                        :suffix="inputs[itemKey].suffix"
                                                        :type="inputs[itemKey].type"
                                                        v-model="inputs[itemKey].model"
                                                    >
                                                        <template v-slot:label>
                                                            <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                                            {{ inputs[itemKey].label }} 
                                                            <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                        </template>
                                                        <template v-slot:append>
                                                            <div class="mt-1 ml-1" v-html="inputs[itemKey].append"></div>
                                                        </template>
                                                    </v-textarea>
                                                </v-col>
                                            </v-row>
                                            <!-- multiple-input type -->
                                            <div v-else-if="rraInput.type === 'multiple-input'">
                                                <div v-for="(multipleInputHead, multipleInputHeadIndex) in rraInput.items" :key="`multipleInputHead-${multipleInputHead}`">
                                                    <v-row v-for="(multipleInputItem, multipleInputItemIndex) in inputs[multipleInputHead].model" 
                                                        :key="`MultipleInputs-${multipleInputHead}-${multipleInputItemIndex}`"
                                                        data-aos="fade-right"
                                                        data-aos-offset="-10000000"
                                                    >
                                                        <v-col cols="auto" class="d-flex align-start">
                                                            <v-btn fab x-small color="green white--text" class="elevation-0"><v-icon>mdi-numeric-{{ multipleInputItemIndex + 1 }}</v-icon></v-btn>
                                                        </v-col>
                                                        <v-col cols="12" lg="11">
                                                            <v-row>
                                                                <!-- Inputs -->
                                                                <v-col
                                                                    v-for="(multipleInputForm, multipleInputFormIndex) in Object.entries(inputs[multipleInputHead].form)"
                                                                    :key="`MultipleInputForm-${multipleInputForm[0]}-${multipleInputFormIndex}`"
                                                                    cols="11" sm="11" :md="multipleInputForm[1].lgView == 12 ? 11 : 6" :lg="multipleInputForm[1].lgView" >
                                                                        <!-- combobox -->
                                                                        <v-combobox
                                                                            v-if="multipleInputForm[1].inputType == 'combobox'"
                                                                            dense
                                                                            :multiple="multipleInputForm[1].multiple"
                                                                            color="success"
                                                                            hide-details
                                                                            :small-chips="multipleInputForm[1].chip"
                                                                            :hide-selected="multipleInputForm[1].hideSelected"
                                                                            item-color="success"
                                                                            :items="multipleInputForm[1].items"
                                                                            :label="multipleInputForm[1].label"
                                                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                            outlined
                                                                            rounded
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:no-data>
                                                                                <v-list-item>
                                                                                <v-list-item-content>
                                                                                    <v-list-item-title>
                                                                                    No results matching. Press <kbd>enter</kbd> to create a new one
                                                                                    </v-list-item-title>
                                                                                </v-list-item-content>
                                                                                </v-list-item>
                                                                            </template>
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                            <template v-slot:selection="{ attrs, item, parent, selected }">
                                                                                <v-chip
                                                                                    v-bind="attrs"
                                                                                    :input-value="selected"
                                                                                    label
                                                                                    small
                                                                                    class="rounded-pill"
                                                                                    v-if="multipleInputForm[1].chip"
                                                                                >
                                                                                    <span class="pr-2">
                                                                                        {{ item }}
                                                                                    </span>
                                                                                    <v-icon
                                                                                        small
                                                                                        @click="parent.selectItem(item)"
                                                                                    >
                                                                                        mdi-close-circle
                                                                                    </v-icon>
                                                                                </v-chip>
                                                                                <span v-else>
                                                                                    {{ item }}
                                                                                </span>
                                                                            </template>
                                                                        </v-combobox>
                                                                        <!-- autocomplete -->
                                                                        <v-autocomplete
                                                                            v-else-if="multipleInputForm[1].inputType == 'autocomplete'"
                                                                            dense
                                                                            :multiple="multipleInputForm[1].multiple"
                                                                            color="success"
                                                                            hide-details
                                                                            item-color="success"
                                                                            :item-text="multipleInputForm[1].itemText"
                                                                            :item-value="multipleInputForm[1].itemValue"
                                                                            :items="multipleInputForm[1].items"
                                                                            :label="multipleInputForm[1].label"
                                                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                            outlined
                                                                            rounded
                                                                            :readonly="multipleInputForm[1].readonly"
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                        </v-autocomplete>
                                                                        <!-- text-field -->
                                                                        <v-text-field
                                                                            v-else-if="multipleInputForm[1].inputType == 'text-field'"
                                                                            dense
                                                                            color="success"
                                                                            hide-details
                                                                            :label="multipleInputForm[1].label"
                                                                            outlined
                                                                            rounded
                                                                            :placeholder="multipleInputForm[1].placeholder"
                                                                            :readonly="multipleInputForm[1].readonly"
                                                                            :suffix="multipleInputForm[1].suffix"
                                                                            :type="multipleInputForm[1].type"
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                            <template v-slot:append>
                                                                                <div class="mt-1 ml-1" v-html="multipleInputForm[1].append"></div>
                                                                            </template>
                                                                        </v-text-field>
                                                                        <!-- textarea -->
                                                                        <v-textarea
                                                                            v-else-if="multipleInputForm[1].inputType == 'textarea'"
                                                                            dense
                                                                            color="success"
                                                                            hide-details
                                                                            :label="multipleInputForm[1].label"
                                                                            outlined
                                                                            rounded
                                                                            :placeholder="multipleInputForm[1].placeholder"
                                                                            :readonly="multipleInputForm[1].readonly"
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                        </v-textarea>
                                                                </v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row v-if="inputs[multipleInputHead].totalCanChange === true" class="justify-center">
                                                        <v-btn v-if="inputs[multipleInputHead].model.length < localConfig.maxSubDataTotal" 
                                                            data-aos="fade-right" data-aos-offset="-10000" 
                                                            :key="`${multipleInputHead}_plus_btn`" 
                                                            fab small color="green white--text" class="mx-1" 
                                                            @click="() => modifyTotalSubData('+', multipleInputHead)"
                                                        >
                                                            <v-icon>mdi-plus</v-icon>
                                                        </v-btn>
                                                        <v-btn v-if="inputs[multipleInputHead].model.length > 1" 
                                                            data-aos="fade-left" data-aos-offset="-10000" 
                                                            :key="`${multipleInputHead}_minus_btn`" 
                                                            fab small color="red" outlined class="mx-1"
                                                            @click="() => modifyTotalSubData('-', multipleInputHead)"
                                                        >
                                                            <v-icon>mdi-minus</v-icon>
                                                        </v-btn>
                                                    </v-row>
                                                </div>
                                            </div>
                                            <!-- khususon: village-border -->
                                            <div v-else-if="rraInput.type === 'village-border'">
                                                <v-row v-for="(point, pointIndex) in rraInput.items" :key="`village-border-${pointIndex}`">
                                                    <v-col cols="auto">
                                                        <v-btn rounded color="green white--text" class="elevation-0" style="width: 100px;">
                                                            {{ inputs.village_border[point].label }}
                                                        </v-btn>
                                                    </v-col>
                                                    <v-col cols="12" md="10">
                                                        <v-row>
                                                            <v-col cols="12" md="6" :lg="inputs.village_border[point].border_type.lgView">
                                                                <v-select
                                                                    dense
                                                                    color="success"
                                                                    hide-details
                                                                    item-color="success"
                                                                    :items="inputs.village_border[point].border_type.items"
                                                                    :label="inputs.village_border[point].border_type.label"
                                                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                    outlined
                                                                    rounded
                                                                    v-model="inputs.village_border[point].border_type.model"
                                                                ></v-select>
                                                            </v-col>
                                                            <v-col cols="12" :lg="inputs.village_border[point].kabupaten.lgView">
                                                                <v-autocomplete
                                                                    dense
                                                                    color="success"
                                                                    hide-details
                                                                    item-color="success"
                                                                    item-text="name"
                                                                    item-value="kabupaten_no"
                                                                    :items="inputs.village_border[point].kabupaten.items"
                                                                    :label="inputs.village_border[point].kabupaten.label"
                                                                    :loading="inputs.village_border[point].kabupaten.loading"
                                                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                    :no-data-text="inputs.village_border[point].kabupaten.loading ? 'Loading...' : 'No Data'"
                                                                    outlined
                                                                    rounded
                                                                    v-model="inputs.village_border[point].kabupaten.model"
                                                                >
                                                                </v-autocomplete>
                                                            </v-col>
                                                            <v-col cols="12" :lg="inputs.village_border[point].kecamatan.lgView" v-if="inputs.village_border[point].border_type.model == 'Kecamatan' || inputs.village_border[point].border_type.model == 'Desa'">
                                                                <v-autocomplete
                                                                    dense
                                                                    color="success"
                                                                    hide-details
                                                                    item-color="success"
                                                                    item-text="name"
                                                                    item-value="kode_kecamatan"
                                                                    :items="inputs.village_border[point].kecamatan.items"
                                                                    :label="inputs.village_border[point].kecamatan.label"
                                                                    :loading="inputs.village_border[point].kecamatan.loading"
                                                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                    :no-data-text="inputs.village_border[point].kecamatan.loading ? 'Loading...' : 'No Data'"
                                                                    outlined
                                                                    rounded
                                                                    v-model="inputs.village_border[point].kecamatan.model"
                                                                >
                                                                </v-autocomplete>
                                                            </v-col>
                                                            <v-col cols="12" :lg="inputs.village_border[point].desa.lgView" v-if="inputs.village_border[point].border_type.model == 'Desa'">
                                                                <v-autocomplete
                                                                    dense
                                                                    color="success"
                                                                    hide-details
                                                                    item-color="success"
                                                                    item-text="name"
                                                                    item-value="kode_desa"
                                                                    :items="inputs.village_border[point].desa.items"
                                                                    :label="inputs.village_border[point].desa.label"
                                                                    :loading="inputs.village_border[point].desa.loading"
                                                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                    :no-data-text="inputs.village_border[point].desa.loading ? 'Loading...' : 'No Data'"
                                                                    outlined
                                                                    rounded
                                                                    v-model="inputs.village_border[point].desa.model"
                                                                >
                                                                </v-autocomplete>
                                                            </v-col>
                                                        </v-row>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Dusun Data -->
                                    <div class="d-flex align-center mt-8 mb-2">
                                        <p class="mb-0" style="font-size: 17px"><v-icon class="mr-2">mdi-home-group</v-icon>Data Dusun</p>
                                        <v-divider class="mx-2"></v-divider>
                                    </div>
                                    <v-row class="ma-0 mx-2">
                                        <v-col cols="12">
                                            <v-expansion-panels class="rounded-xl" v-model="inputs.hamlets.expansionModel">
                                                <v-expansion-panel v-for="(hm, hmIndex) in inputs.hamlets.model" :key="`hamlet-${hmIndex}`" class="rounded-xl">
                                                    <v-expansion-panel-header>
                                                        <template v-slot:default="{ open }">
                                                            <v-row no-gutters>
                                                                <v-col cols="6">
                                                                    <span v-if="hm.dusun_name && !open">
                                                                        <v-icon>mdi-numeric-{{ hmIndex+1 }}-circle</v-icon>
                                                                        {{ hm.dusun_name }}
                                                                    </span>
                                                                    <span v-else>
                                                                        Dusun {{ hmIndex + 1 }}
                                                                    </span>
                                                                </v-col>
                                                                <v-col
                                                                    cols="6"
                                                                    class="text--secondary text-right"
                                                                >
                                                                    <v-fade-transition leave-absolute>
                                                                        <!-- <span
                                                                            key="0"
                                                                            class="mr-2"
                                                                        >
                                                                            Kelengkapan Data: {{ Object.entries(hm).filter(val => val[1] !== null && val[1] !== 0).length }} / {{ Object.entries(inputs.hamlets.form).filter(val => val[1].type !== 'divider').length }}
                                                                        </span> -->
                                                                    </v-fade-transition>
                                                                </v-col>
                                                            </v-row>
                                                        </template>
                                                    </v-expansion-panel-header>
                                                    <v-expansion-panel-content>
                                                        <v-row>
                                                            <!-- Inputs -->
                                                            <v-col v-if="(hmInputs[1].potentialRequirement === true && hm.potential) || hmInputs[1].potentialRequirement === false" v-for="(hmInputs, hmInputIndex) in Object.entries(inputs.hamlets.form)" :key="`Inputs-${hmInputs[0]}-${hmIndex}-${hmInputIndex}`" cols="12" sm="12" md="6" :lg="hmInputs[1].lgView" >
                                                                <div v-if="hmInputs[1].type === 'divider'" class="d-flex align-center">
                                                                    <p class="mb-0"><v-icon class="mr-2">{{ hmInputs[1].labelIcon }}</v-icon>{{ hmInputs[1].label }}</p>
                                                                    <v-divider class="mx-2"></v-divider>
                                                                    <div v-if="hmInputs[1].label === 'General Data'">
                                                                        <v-switch    
                                                                            color="green"
                                                                            v-model="hm.potential"
                                                                            inset
                                                                            :label="`Dusun ini ${hm.potential ? 'berpotensi' : 'tidak berpotensi'}.`"
                                                                        ></v-switch>
                                                                    </div>
                                                                </div>
                                                                <!-- text-field -->
                                                                <v-text-field
                                                                    v-else-if="hmInputs[1].type === 'number' || hmInputs[1].type === 'text'"
                                                                    dense
                                                                    color="success"
                                                                    hide-details
                                                                    :label="hmInputs[1].label"
                                                                    :prepend-icon="hmInputs[1].prependIcon"
                                                                    outlined
                                                                    rounded
                                                                    :suffix="hmInputs[1].suffix"
                                                                    :type="hmInputs[1].type"
                                                                    v-model="hm[hmInputs[0]]"
                                                                >
                                                                    <template v-slot:label>
                                                                        <v-icon v-if="hmInputs[1].labelIcon" class="mr-1">{{ hmInputs[1].labelIcon }}</v-icon>
                                                                        {{ hmInputs[1].label }} 
                                                                        <sup><v-icon v-if="hmInputs[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                    </template>
                                                                    <template v-slot:append>
                                                                        <div class="mt-1 ml-1" v-html="hmInputs[1].append"></div>
                                                                    </template>
                                                                </v-text-field>
                                                                <!-- autocomplete -->
                                                                <v-autocomplete
                                                                    v-else-if="hmInputs[1].inputType == 'autocomplete'"
                                                                    dense
                                                                    :multiple="hmInputs[1].type == 'Multiple'"
                                                                    color="success"
                                                                    hide-details
                                                                    item-color="success"
                                                                    :item-text="hmInputs[1].itemText"
                                                                    :item-value="hmInputs[1].itemValue"
                                                                    :items="hmInputs[1].items"
                                                                    :label="hmInputs[1].label"
                                                                    :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                    outlined
                                                                    rounded
                                                                    v-model="hm[hmInputs[0]]"
                                                                >
                                                                    <template v-slot:label>
                                                                        {{ hmInputs[1].label }} 
                                                                        <sup><v-icon v-if="hmInputs[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                    </template>
                                                                </v-autocomplete>
                                                            </v-col>
                                                        </v-row>
                                                    </v-expansion-panel-content>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
                                            <v-row class="justify-center my-2">
                                                <v-btn v-if="inputs.hamlets.model.length < 5" 
                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                    :key="`hamlets_plus_btn`" 
                                                    fab small color="green white--text" class="mx-1" 
                                                    @click="() => modifyTotalSubData('+', 'hamlets')"
                                                >
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                                <v-btn v-if="inputs.hamlets.model.length > 1" 
                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                    :key="`hamlets_minus_btn`" 
                                                    fab small color="red" outlined class="mx-1"
                                                    @click="() => modifyTotalSubData('-', 'hamlets')"
                                                >
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                                            </v-row>
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
                                    <div  v-for="(praInput, praInputIndex) in groupingInputs.pra" :key="`pRAInputSection-${praInputIndex}`">
                                        <!-- Title -->
                                        <div class="d-flex align-center my-8">
                                            <p class="mb-0" style="font-size: 17px"><v-icon class="mr-2">{{ praInput.icon }}</v-icon>{{ praInput.title }}</p>
                                            <v-divider class="mx-2"></v-divider>
                                            <v-switch
                                                v-if="praInput.required === false"
                                                color="green"
                                                v-model="praInput.optional"
                                                inset
                                                :label="`${praInput.optional ? 'Ada' : 'Tidak Ada'}`"
                                            ></v-switch>
                                        </div>
                                        <div v-if="(praInput.required === false && praInput.optional === true) || praInput.required">
                                            <!-- multiple-input type -->
                                            <div v-if="praInput.type === 'multiple-input'">
                                                <div v-for="(multipleInputHead, multipleInputHeadIndex) in praInput.items" :key="`multipleInputHead-${multipleInputHead}`">
                                                    <v-row v-for="(multipleInputItem, multipleInputItemIndex) in inputs[multipleInputHead].model" :key="`MultipleInputs-${multipleInputHead}-${multipleInputItemIndex}`">
                                                        <v-col cols="auto" class="d-flex align-start">
                                                            <v-btn fab x-small color="green white--text" class="elevation-0"><v-icon>mdi-numeric-{{ multipleInputItemIndex + 1 }}</v-icon></v-btn>
                                                        </v-col>
                                                        <v-col cols="12" lg="11">
                                                            <v-row>
                                                                <!-- Inputs -->
                                                                <v-col
                                                                    v-for="(multipleInputForm, multipleInputFormIndex) in Object.entries(inputs[multipleInputHead].form)"
                                                                    v-if="(multipleInputForm[1].label === 'Jenis Kepemilikan' && multipleInputItem.type_ownership === 'Diluar Milik Petani') || multipleInputForm[1].label !== 'Jenis Kepemilikan'"
                                                                    :key="`MultipleInputForm-${multipleInputForm[0]}-${multipleInputFormIndex}`"
                                                                    cols="11" sm="11" :md="multipleInputForm[1].lgView == 12 ? 11 : 6" :lg="multipleInputForm[1].lgView" 
                                                                >
                                                                    <div>
                                                                        <!-- combobox -->
                                                                        <v-combobox
                                                                            v-if="multipleInputForm[1].inputType == 'combobox'"
                                                                            dense
                                                                            :multiple="multipleInputForm[1].multiple"
                                                                            color="success"
                                                                            hide-details
                                                                            :small-chips="multipleInputForm[1].chip"
                                                                            :hide-selected="multipleInputForm[1].hideSelected"
                                                                            item-color="success"
                                                                            :items="multipleInputForm[1].items"
                                                                            :label="multipleInputForm[1].label"
                                                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                            outlined
                                                                            rounded
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:no-data>
                                                                                <v-list-item>
                                                                                <v-list-item-content>
                                                                                    <v-list-item-title>
                                                                                    No results matching. Press <kbd>enter</kbd> to create a new one
                                                                                    </v-list-item-title>
                                                                                </v-list-item-content>
                                                                                </v-list-item>
                                                                            </template>
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                            <template v-slot:selection="{ attrs, item, parent, selected }">
                                                                                <v-chip
                                                                                    v-bind="attrs"
                                                                                    :input-value="selected"
                                                                                    label
                                                                                    small
                                                                                    class="rounded-pill"
                                                                                    v-if="multipleInputForm[1].chip"
                                                                                >
                                                                                    <span class="pr-2">
                                                                                        {{ item }}
                                                                                    </span>
                                                                                    <v-icon
                                                                                        small
                                                                                        @click="parent.selectItem(item)"
                                                                                    >
                                                                                        mdi-close-circle
                                                                                    </v-icon>
                                                                                </v-chip>
                                                                                <span v-else>
                                                                                    {{ item }}
                                                                                </span>
                                                                            </template>
                                                                        </v-combobox>
                                                                        <!-- autocomplete -->
                                                                        <v-autocomplete
                                                                            v-else-if="multipleInputForm[1].inputType == 'autocomplete'"
                                                                            dense
                                                                            :multiple="multipleInputForm[1].multiple"
                                                                            color="success"
                                                                            hide-details
                                                                            item-color="success"
                                                                            :item-text="multipleInputForm[1].itemText"
                                                                            :item-value="multipleInputForm[1].itemValue"
                                                                            :items="multipleInputForm[1].items"
                                                                            :label="multipleInputForm[1].label"
                                                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                            outlined
                                                                            rounded
                                                                            :readonly="multipleInputForm[1].readonly"
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                        </v-autocomplete>
                                                                        <!-- text-field -->
                                                                        <v-text-field
                                                                            v-else-if="multipleInputForm[1].inputType == 'text-field'"
                                                                            dense
                                                                            color="success"
                                                                            hide-details
                                                                            :label="multipleInputForm[1].label"
                                                                            outlined
                                                                            rounded
                                                                            :placeholder="multipleInputForm[1].placeholder"
                                                                            :readonly="multipleInputForm[1].readonly"
                                                                            :suffix="multipleInputForm[1].suffix"
                                                                            :type="multipleInputForm[1].type"
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                            <template v-slot:append>
                                                                                <div class="mt-1 ml-1" v-html="multipleInputForm[1].append"></div>
                                                                            </template>
                                                                        </v-text-field>
                                                                        <!-- textarea -->
                                                                        <v-textarea
                                                                            v-else-if="multipleInputForm[1].inputType == 'textarea'"
                                                                            dense
                                                                            color="success"
                                                                            hide-details
                                                                            :label="multipleInputForm[1].label"
                                                                            outlined
                                                                            rounded
                                                                            :placeholder="multipleInputForm[1].placeholder"
                                                                            :readonly="multipleInputForm[1].readonly"
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                        </v-textarea>
                                                                        <!-- datepicker -->
                                                                        <v-menu 
                                                                            v-else-if="multipleInputForm[1].inputType == 'datepicker'"
                                                                            rounded="xl"
                                                                            transition="slide-x-transition"
                                                                            bottom
                                                                            min-width="100"
                                                                            offset-y
                                                                            :close-on-content-click="false"
                                                                            v-model="multipleInputForm[1].show"
                                                                        >
                                                                            <template v-slot:activator="{ on: menu, attrs }">
                                                                                <v-tooltip top content-class="rounded-xl">
                                                                                    <template v-slot:activator="{ on: tooltip }">
                                                                                        <v-text-field
                                                                                            dense
                                                                                            color="green"
                                                                                            class="mb-2 mb-lg-0 mr-0 mr-lg-2"
                                                                                            hide-details
                                                                                            outlined
                                                                                            rounded
                                                                                            v-bind="attrs"
                                                                                            v-on="{...menu, ...tooltip}"
                                                                                            readonly
                                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                                        >
                                                                                            <template v-slot:label>
                                                                                                {{ multipleInputForm[1].label }} 
                                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                                            </template>
                                                                                        </v-text-field>
                                                                                    </template>
                                                                                    <span>Klik untuk memunculkan datepicker</span>
                                                                                </v-tooltip>
                                                                            </template>
                                                                            <div class="rounded-xl pb-2 white">
                                                                                <div class="d-flex flex-column align-center rounded-xl">
                                                                                    <v-date-picker 
                                                                                        :range="multipleInputForm[1].dateType === 'range'"
                                                                                        color="green lighten-1 rounded-xl" 
                                                                                        v-model="multipleInputItem[multipleInputForm[0]]"
                                                                                    ></v-date-picker>
                                                                                </div>
                                                                            </div>
                                                                        </v-menu>
                                                                    </div>
                                                                </v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row v-if="inputs[multipleInputHead].totalCanChange === true" class="justify-center">
                                                        <v-btn v-if="inputs[multipleInputHead].model.length < localConfig.maxSubDataTotal" 
                                                            data-aos="fade-right" data-aos-offset="-10000" 
                                                            :key="`${multipleInputHead}_plus_btn`" 
                                                            fab small color="green white--text" class="mx-1" 
                                                            @click="() => modifyTotalSubData('+', multipleInputHead)"
                                                        >
                                                            <v-icon>mdi-plus</v-icon>
                                                        </v-btn>
                                                        <v-btn v-if="inputs[multipleInputHead].model.length > 1" 
                                                            data-aos="fade-left" data-aos-offset="-10000" 
                                                            :key="`${multipleInputHead}_minus_btn`" 
                                                            fab small color="red" outlined class="mx-1"
                                                            @click="() => modifyTotalSubData('-', multipleInputHead)"
                                                        >
                                                            <v-icon>mdi-minus</v-icon>
                                                        </v-btn>
                                                    </v-row>
                                                    <v-row v-if="praInput.description === true">
                                                        <v-col cols="12">
                                                            <!-- textarea -->
                                                            <v-textarea
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                :label="inputs[multipleInputHead].description.label"
                                                                outlined
                                                                rounded
                                                                :placeholder="inputs[multipleInputHead].description.placeholder"
                                                                :readonly="inputs[multipleInputHead].description.readonly"
                                                                v-model="inputs[multipleInputHead].description.model"
                                                            >
                                                                <template v-slot:label>
                                                                    <v-icon v-if="inputs[multipleInputHead].description.labelIcon" class="mr-1">{{ inputs[multipleInputHead].description.labelIcon }}</v-icon>
                                                                    {{ inputs[multipleInputHead].description.label }} 
                                                                    <sup><v-icon v-if="inputs[multipleInputHead].description.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                </template>
                                                            </v-textarea>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </div>
                                            <!-- column type -->
                                            <v-row v-else-if="praInput.type === 'column'">
                                                <!-- Inputs -->
                                                <v-col v-for="(itemKey, iKIndex) in praInput.items" :key="`Inputs-${itemKey}-${iKIndex}`" 
                                                    cols="12" sm="12" :md="inputs[itemKey].lgView == 12 ? 12 : 6" :lg="inputs[itemKey].lgView" >
                                                    <!-- text-field -->
                                                    <v-text-field
                                                        v-if="inputs[itemKey].inputType == 'text-field'"
                                                        dense
                                                        color="success"
                                                        hide-details
                                                        :label="inputs[itemKey].label"
                                                        outlined
                                                        rounded
                                                        :placeholder="inputs[itemKey].placeholder"
                                                        :readonly="inputs[itemKey].readonly"
                                                        :suffix="inputs[itemKey].suffix"
                                                        :type="inputs[itemKey].type"
                                                        v-model="inputs[itemKey].model"
                                                    >
                                                        <template v-slot:label>
                                                            <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                                            {{ inputs[itemKey].label }} 
                                                            <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                        </template>
                                                        <template v-slot:append>
                                                            <div class="mt-1 ml-1" v-html="inputs[itemKey].append"></div>
                                                        </template>
                                                    </v-text-field>
                                                    <!-- textarea -->
                                                    <v-textarea
                                                        v-else-if="inputs[itemKey].inputType == 'textarea'"
                                                        dense
                                                        color="success"
                                                        hide-details
                                                        :label="inputs[itemKey].label"
                                                        outlined
                                                        rounded
                                                        :placeholder="inputs[itemKey].placeholder"
                                                        :readonly="inputs[itemKey].readonly"
                                                        :suffix="inputs[itemKey].suffix"
                                                        :type="inputs[itemKey].type"
                                                        v-model="inputs[itemKey].model"
                                                    >
                                                        <template v-slot:label>
                                                            <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                                            {{ inputs[itemKey].label }} 
                                                            <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                        </template>
                                                        <template v-slot:append>
                                                            <div class="mt-1 ml-1" v-html="inputs[itemKey].append"></div>
                                                        </template>
                                                    </v-textarea>
                                                    <!-- combobox -->
                                                    <v-combobox
                                                        v-if="inputs[itemKey].inputType == 'combobox'"
                                                        dense
                                                        :multiple="inputs[itemKey].multiple"
                                                        color="success"
                                                        hide-details
                                                        :small-chips="inputs[itemKey].chip"
                                                        :hide-selected="inputs[itemKey].hideSelected"
                                                        item-color="success"
                                                        :items="inputs[itemKey].items"
                                                        :label="inputs[itemKey].label"
                                                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                        outlined
                                                        rounded
                                                        v-model="inputs[itemKey].model"
                                                    >
                                                        <template v-slot:no-data>
                                                            <v-list-item>
                                                            <v-list-item-content>
                                                                <v-list-item-title>
                                                                No results matching. Press <kbd>enter</kbd> to create a new one
                                                                </v-list-item-title>
                                                            </v-list-item-content>
                                                            </v-list-item>
                                                        </template>
                                                        <template v-slot:label>
                                                            <v-icon v-if="inputs[itemKey].labelIcon" class="mr-1">{{ inputs[itemKey].labelIcon }}</v-icon>
                                                            {{ inputs[itemKey].label }} 
                                                            <sup><v-icon v-if="inputs[itemKey].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                        </template>
                                                        <template v-slot:selection="{ attrs, item, parent, selected }">
                                                            <v-chip
                                                                v-bind="attrs"
                                                                :input-value="selected"
                                                                label
                                                                small
                                                                class="rounded-pill"
                                                            >
                                                            <span class="pr-2">
                                                                {{ item }}
                                                            </span>
                                                            <v-icon
                                                                small
                                                                @click="parent.selectItem(item)"
                                                            >
                                                                mdi-close-circle
                                                            </v-icon>
                                                            </v-chip>
                                                        </template>
                                                    </v-combobox>
                                                </v-col>
                                            </v-row>
                                            <!-- custom -->
                                            <div v-else> 
                                                <div v-if="praInput.type === 'custom-farmer_income'">
                                                    <v-row>
                                                        <v-col cols="12" md="6" :lg="inputs.farmer_income.collection_type.lgView">
                                                            <!-- autocomplete -->
                                                            <v-autocomplete
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                item-color="success"
                                                                :items="inputs.farmer_income.collection_type.items"
                                                                :label="inputs.farmer_income.collection_type.label"
                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                outlined
                                                                rounded
                                                                :readonly="inputs.farmer_income.collection_type.readonly"
                                                                v-model="inputs.farmer_income.collection_type.model"
                                                            >
                                                                <template v-slot:label>
                                                                    <v-icon v-if="inputs.farmer_income.collection_type.labelIcon" class="mr-1">{{ inputs.farmer_income.collection_type.labelIcon }}</v-icon>
                                                                    {{ inputs.farmer_income.collection_type.label }} 
                                                                    <sup><v-icon v-if="inputs.farmer_income.collection_type.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                </template>
                                                            </v-autocomplete>
                                                        </v-col>
                                                    </v-row>
                                                    <div>
                                                        <div v-for="(genderIncome, genderIncomeIndex) in ['male', 'female']" :key="`farmer_income-${genderIncomeIndex}`">
                                                            <v-chip color="grey darken-1 white--text" class="my-4">
                                                                <v-icon class="mr-1">mdi-human-{{ genderIncome }}</v-icon>
                                                                {{ genderIncome == 'male' ? 'Laki - Laki' : 'Perempuan' }}
                                                            </v-chip>
                                                            <!-- IF not selected -->
                                                            <div v-if="!inputs.farmer_income.collection_type.model" class="d-flex align-center">
                                                                Silahkan pilih terlebih dahulu cara pengumpulan data!
                                                            </div>
                                                            <!-- IF Sampling -->
                                                            <v-row v-if="inputs.farmer_income.collection_type.model == 'Sampling'" 
                                                                v-for="(genderInput, genderInputIndex) in inputs.farmer_income[`${genderIncome}_data`]" 
                                                                :key="genderInputIndex"
                                                            >
                                                                <v-col cols="auto" class="d-flex align-start">
                                                                    <v-btn fab x-small color="green white--text" class="elevation-0"><v-icon>mdi-numeric-{{ genderInputIndex + 1 }}</v-icon></v-btn>
                                                                </v-col>
                                                                <v-col cols="12" lg="11">
                                                                    <v-row>
                                                                        <v-col v-for="(praFiForm, praFiFormIndex) in Object.entries(inputs.farmer_income.sampling_form)" 
                                                                            v-if="(praFiForm[0] === 'indirect_method' && genderInput.method === 'Indirect') || (praFiForm[0] === 'job' && genderInput.family_type === 'Keluarga Non-Petani') || (praFiForm[0] !== 'job' && praFiForm[0] !== 'indirect_method')"
                                                                            :key="`praFiForm-${genderIncomeIndex}-${genderInputIndex}-${praFiFormIndex}`"
                                                                            cols="12"
                                                                            md="6"
                                                                            :lg="praFiForm[1].lgView"
                                                                        >
                                                                            <!-- text-field -->
                                                                            <v-text-field
                                                                                v-if="praFiForm[1].inputType == 'text-field'"
                                                                                dense
                                                                                color="success"
                                                                                hide-details
                                                                                :label="praFiForm[1].label"
                                                                                outlined
                                                                                rounded
                                                                                :placeholder="praFiForm[1].placeholder"
                                                                                :readonly="praFiForm[1].readonly"
                                                                                :prefix="praFiForm[1].prefix"
                                                                                :suffix="praFiForm[1].suffix"
                                                                                :type="praFiForm[1].type"
                                                                                v-model="genderInput[praFiForm[0]]"
                                                                                :disabled="praFiForm[0] === 'amount' && (genderInput.method === 'Konsumsi Sendiri' || !genderInput.method)"
                                                                            >
                                                                                <template v-slot:label>
                                                                                    <v-icon v-if="praFiForm[1].labelIcon" class="mr-1">{{ praFiForm[1].labelIcon }}</v-icon>
                                                                                    {{ praFiForm[1].label }} 
                                                                                    <sup><v-icon v-if="praFiForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                                </template>
                                                                                <template v-slot:append>
                                                                                    <div class="mt-1 ml-1" v-html="praFiForm[1].append"></div>
                                                                                </template>
                                                                            </v-text-field>
                                                                            <!-- combobox -->
                                                                            <v-combobox
                                                                                v-if="praFiForm[1].inputType == 'combobox'"
                                                                                dense
                                                                                :multiple="praFiForm[1].multiple"
                                                                                color="success"
                                                                                hide-details
                                                                                :small-chips="praFiForm[1].chip"
                                                                                :hide-selected="praFiForm[1].hideSelected"
                                                                                item-color="success"
                                                                                :items="praFiForm[1].items"
                                                                                :label="praFiForm[1].label"
                                                                                :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                                outlined
                                                                                rounded
                                                                                v-model="genderInput[praFiForm[0]]"
                                                                            >
                                                                                <template v-slot:no-data>
                                                                                    <v-list-item>
                                                                                    <v-list-item-content>
                                                                                        <v-list-item-title>
                                                                                        No results matching. Press <kbd>enter</kbd> to create a new one
                                                                                        </v-list-item-title>
                                                                                    </v-list-item-content>
                                                                                    </v-list-item>
                                                                                </template>
                                                                                <template v-slot:label>
                                                                                    <v-icon v-if="praFiForm[1].labelIcon" class="mr-1">{{ praFiForm[1].labelIcon }}</v-icon>
                                                                                    {{ praFiForm[1].label }} 
                                                                                    <sup><v-icon v-if="praFiForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                                </template>
                                                                                <template v-slot:selection="{ attrs, item, parent, selected }">
                                                                                    <v-chip
                                                                                        v-bind="attrs"
                                                                                        :input-value="selected"
                                                                                        label
                                                                                        small
                                                                                        class="rounded-pill"
                                                                                    >
                                                                                    <span class="pr-2">
                                                                                        {{ item }}
                                                                                    </span>
                                                                                    <v-icon
                                                                                        small
                                                                                        @click="parent.selectItem(item)"
                                                                                    >
                                                                                        mdi-close-circle
                                                                                    </v-icon>
                                                                                    </v-chip>
                                                                                </template>
                                                                            </v-combobox>
                                                                            <!-- autocomplete -->
                                                                            <div
                                                                                v-else-if="praFiForm[1].inputType == 'autocomplete'"
                                                                            >
                                                                                <div>
                                                                                    <v-autocomplete
                                                                                        dense
                                                                                        :multiple="praFiForm[1].multiple"
                                                                                        color="success"
                                                                                        hide-details
                                                                                        item-color="success"
                                                                                        :item-text="praFiForm[1].itemText"
                                                                                        :item-value="praFiForm[1].itemValue"
                                                                                        :items="praFiForm[1].items"
                                                                                        :label="praFiForm[1].label"
                                                                                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                                        outlined
                                                                                        rounded
                                                                                        :readonly="praFiForm[1].readonly"
                                                                                        v-model="genderInput[praFiForm[0]]"
                                                                                    >
                                                                                        <template v-slot:label>
                                                                                            <v-icon v-if="praFiForm[1].labelIcon" class="mr-1">{{ praFiForm[1].labelIcon }}</v-icon>
                                                                                            {{ praFiForm[1].label }} 
                                                                                            <sup><v-icon v-if="praFiForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                                        </template>
                                                                                    </v-autocomplete>
                                                                                </div>
                                                                            </div>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row v-if="inputs.farmer_income.collection_type.model == 'Sampling'" class="justify-center">
                                                                <v-btn v-if="inputs.farmer_income[`${genderIncome}_data`].length < localConfig.maxSubDataTotal" 
                                                                    data-aos="fade-right" data-aos-offset="-10000" 
                                                                    :key="`farmer_income-${genderIncome}-plus_btn`" 
                                                                    fab small color="green white--text" class="mx-1" 
                                                                    @click="() => modifyTotalSubData('+', `farmer_income-${genderIncome}`)"
                                                                >
                                                                    <v-icon>mdi-plus</v-icon>
                                                                </v-btn>
                                                                <v-btn v-if="inputs.farmer_income[`${genderIncome}_data`].length > 2" 
                                                                    data-aos="fade-left" data-aos-offset="-10000" 
                                                                    :key="`farmer_income-${genderIncome}-minus_btn`" 
                                                                    fab small color="red" outlined class="mx-1"
                                                                    @click="() => modifyTotalSubData('-', `farmer_income-${genderIncome}`)"
                                                                >
                                                                    <v-icon>mdi-minus</v-icon>
                                                                </v-btn>
                                                            </v-row>
                                                            <!-- IF Bukan Sampling -->
                                                            <v-row v-if="inputs.farmer_income.collection_type.model == 'Bukan Sampling'">
                                                                <v-col v-for="(praFiForm, praFiFormIndex) in Object.entries(inputs.farmer_income.static_form)" 
                                                                    :key="`praFiForm-${genderIncomeIndex}-${praFiFormIndex}`"
                                                                    cols="12"
                                                                    md="6"
                                                                    :lg="praFiForm[1].lgView"    
                                                                >
                                                                    <!-- text-field -->
                                                                    <v-text-field
                                                                        v-if="praFiForm[1].inputType == 'text-field'"
                                                                        dense
                                                                        color="success"
                                                                        hide-details
                                                                        :label="praFiForm[1].label"
                                                                        outlined
                                                                        rounded
                                                                        :placeholder="praFiForm[1].placeholder"
                                                                        :readonly="praFiForm[1].readonly"
                                                                        :prefix="praFiForm[1].prefix"
                                                                        :suffix="praFiForm[1].suffix"
                                                                        :type="praFiForm[1].type"
                                                                        v-model="praFiForm[1][`${genderIncome}_model`]"
                                                                    >
                                                                        <template v-slot:label>
                                                                            <v-icon v-if="praFiForm[1].labelIcon" class="mr-1">{{ praFiForm[1].labelIcon }}</v-icon>
                                                                            {{ praFiForm[1].label }} 
                                                                            <sup><v-icon v-if="praFiForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                        </template>
                                                                        <template v-slot:append>
                                                                            <div class="mt-1 ml-1" v-html="praFiForm[1].append"></div>
                                                                        </template>
                                                                    </v-text-field>
                                                                    <!-- combobox -->
                                                                    <v-combobox
                                                                        v-if="praFiForm[1].inputType == 'combobox'"
                                                                        dense
                                                                        :multiple="praFiForm[1].multiple"
                                                                        color="success"
                                                                        hide-details
                                                                        :small-chips="praFiForm[1].chip"
                                                                        :hide-selected="praFiForm[1].hideSelected"
                                                                        item-color="success"
                                                                        :items="praFiForm[1].items"
                                                                        :label="praFiForm[1].label"
                                                                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                        outlined
                                                                        rounded
                                                                        v-model="praFiForm[1][`${genderIncome}_model`]"
                                                                    >
                                                                        <template v-slot:no-data>
                                                                            <v-list-item>
                                                                            <v-list-item-content>
                                                                                <v-list-item-title>
                                                                                No results matching. Press <kbd>enter</kbd> to create a new one
                                                                                </v-list-item-title>
                                                                            </v-list-item-content>
                                                                            </v-list-item>
                                                                        </template>
                                                                        <template v-slot:label>
                                                                            <v-icon v-if="praFiForm[1].labelIcon" class="mr-1">{{ praFiForm[1].labelIcon }}</v-icon>
                                                                            {{ praFiForm[1].label }} 
                                                                            <sup><v-icon v-if="praFiForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                        </template>
                                                                        <template v-slot:selection="{ attrs, item, parent, selected }">
                                                                            <v-chip
                                                                                v-bind="attrs"
                                                                                :input-value="selected"
                                                                                label
                                                                                small
                                                                                class="rounded-pill"
                                                                            >
                                                                            <span class="pr-2">
                                                                                {{ item }}
                                                                            </span>
                                                                            <v-icon
                                                                                small
                                                                                @click="parent.selectItem(item)"
                                                                            >
                                                                                mdi-close-circle
                                                                            </v-icon>
                                                                            </v-chip>
                                                                        </template>
                                                                    </v-combobox>
                                                                    <!-- autocomplete -->
                                                                    <v-autocomplete
                                                                        v-else-if="praFiForm[1].inputType == 'autocomplete'"
                                                                        dense
                                                                        :multiple="praFiForm[1].multiple"
                                                                        color="success"
                                                                        hide-details
                                                                        item-color="success"
                                                                        :item-text="praFiForm[1].itemText"
                                                                        :item-value="praFiForm[1].itemValue"
                                                                        :items="praFiForm[1].items"
                                                                        :label="praFiForm[1].label"
                                                                        :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                        outlined
                                                                        rounded
                                                                        :readonly="praFiForm[1].readonly"
                                                                        v-model="praFiForm[1][`${genderIncome}_model`]"
                                                                    >
                                                                        <template v-slot:label>
                                                                            <v-icon v-if="praFiForm[1].labelIcon" class="mr-1">{{ praFiForm[1].labelIcon }}</v-icon>
                                                                            {{ praFiForm[1].label }} 
                                                                            <sup><v-icon v-if="praFiForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                        </template>
                                                                    </v-autocomplete>
                                                                </v-col>
                                                            </v-row>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-stepper-content>
                        <!-- Flora & Fauna -->
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
                                    <div  v-for="(socImpInput, socImpInputIndex) in groupingInputs.socImp" :key="`socImpInputSection-${socImpInputIndex}`">
                                        <!-- Title -->
                                        <div class="d-flex align-center my-8">
                                            <p class="mb-0" style="font-size: 17px"><v-icon class="mr-2">{{ socImpInput.icon }}</v-icon>{{ socImpInput.title }}</p>
                                            <v-divider class="mx-2"></v-divider>
                                            <v-switch
                                                v-if="socImpInput.required === false"
                                                color="green"
                                                v-model="socImpInput.optional"
                                                inset
                                                :label="`${socImpInput.optional ? 'Ada' : 'Tidak Ada'}`"
                                            ></v-switch>
                                        </div>
                                        <div v-if="(socImpInput.required === false && socImpInput.optional === true) || socImpInput.required">
                                            <!-- multiple-input type -->
                                            <div v-if="socImpInput.type === 'multiple-input'">
                                                <div v-for="(multipleInputHead, multipleInputHeadIndex) in socImpInput.items" :key="`multipleInputHead-${multipleInputHead}`">
                                                    <v-row v-for="(multipleInputItem, multipleInputItemIndex) in inputs[multipleInputHead].model" :key="`MultipleInputs-${multipleInputHead}-${multipleInputItemIndex}`">
                                                        <v-col cols="auto" class="d-flex align-start justify-center">
                                                            <v-btn fab x-small color="green white--text" class="elevation-0"><v-icon>mdi-numeric-{{ multipleInputItemIndex + 1 }}</v-icon></v-btn>
                                                        </v-col>
                                                        <v-col cols="12" lg="11">
                                                            <v-row>
                                                                <!-- Inputs -->
                                                                <v-col
                                                                    v-for="(multipleInputForm, multipleInputFormIndex) in Object.entries(inputs[multipleInputHead].form)"
                                                                    v-if="(multipleInputForm[1].label === 'Jenis Kepemilikan' && multipleInputItem.category === 'Diluar Milik Petani') || multipleInputForm[1].label !== 'Jenis Kepemilikan'"
                                                                    :key="`MultipleInputForm-${multipleInputForm[0]}-${multipleInputFormIndex}`"
                                                                    cols="11" sm="11" :md="multipleInputForm[1].lgView == 12 ? 11 : 6" :lg="multipleInputForm[1].lgView" 
                                                                >
                                                                    <div>
                                                                        <!-- combobox -->
                                                                        <v-combobox
                                                                            v-if="multipleInputForm[1].inputType == 'combobox'"
                                                                            dense
                                                                            :multiple="multipleInputForm[1].multiple"
                                                                            color="success"
                                                                            hide-details
                                                                            :small-chips="multipleInputForm[1].chip"
                                                                            :hide-selected="multipleInputForm[1].hideSelected"
                                                                            item-color="success"
                                                                            :items="multipleInputForm[1].items"
                                                                            :label="multipleInputForm[1].label"
                                                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                            outlined
                                                                            rounded
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:no-data>
                                                                                <v-list-item>
                                                                                <v-list-item-content>
                                                                                    <v-list-item-title>
                                                                                    No results matching. Press <kbd>enter</kbd> to create a new one
                                                                                    </v-list-item-title>
                                                                                </v-list-item-content>
                                                                                </v-list-item>
                                                                            </template>
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                            <template v-slot:selection="{ attrs, item, parent, selected }">
                                                                                <v-chip
                                                                                    v-bind="attrs"
                                                                                    :input-value="selected"
                                                                                    label
                                                                                    small
                                                                                    class="rounded-pill"
                                                                                >
                                                                                <span class="pr-2">
                                                                                    {{ item }}
                                                                                </span>
                                                                                <v-icon
                                                                                    small
                                                                                    @click="parent.selectItem(item)"
                                                                                >
                                                                                    mdi-close-circle
                                                                                </v-icon>
                                                                                </v-chip>
                                                                            </template>
                                                                        </v-combobox>
                                                                        <!-- autocomplete -->
                                                                        <v-autocomplete
                                                                            v-else-if="multipleInputForm[1].inputType == 'autocomplete'"
                                                                            dense
                                                                            :multiple="multipleInputForm[1].multiple"
                                                                            color="success"
                                                                            hide-details
                                                                            item-color="success"
                                                                            :item-text="multipleInputForm[1].itemText"
                                                                            :item-value="multipleInputForm[1].itemValue"
                                                                            :items="multipleInputForm[1].items"
                                                                            :label="multipleInputForm[1].label"
                                                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                                            outlined
                                                                            rounded
                                                                            :readonly="multipleInputForm[1].readonly"
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                        </v-autocomplete>
                                                                        <!-- text-field -->
                                                                        <v-text-field
                                                                            v-else-if="multipleInputForm[1].inputType == 'text-field'"
                                                                            dense
                                                                            color="success"
                                                                            hide-details
                                                                            :label="multipleInputForm[1].label"
                                                                            outlined
                                                                            rounded
                                                                            :placeholder="multipleInputForm[1].placeholder"
                                                                            :readonly="multipleInputForm[1].readonly"
                                                                            :suffix="multipleInputForm[1].suffix"
                                                                            :type="multipleInputForm[1].type"
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                            <template v-slot:append>
                                                                                <div class="mt-1 ml-1" v-html="multipleInputForm[1].append"></div>
                                                                            </template>
                                                                        </v-text-field>
                                                                        <!-- textarea -->
                                                                        <v-textarea
                                                                            v-else-if="multipleInputForm[1].inputType == 'textarea'"
                                                                            dense
                                                                            color="success"
                                                                            hide-details
                                                                            :label="multipleInputForm[1].label"
                                                                            outlined
                                                                            rounded
                                                                            :placeholder="multipleInputForm[1].placeholder"
                                                                            :readonly="multipleInputForm[1].readonly"
                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                        >
                                                                            <template v-slot:label>
                                                                                <v-icon v-if="multipleInputForm[1].labelIcon" class="mr-1">{{ multipleInputForm[1].labelIcon }}</v-icon>
                                                                                {{ multipleInputForm[1].label }} 
                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                            </template>
                                                                        </v-textarea>
                                                                        <!-- datepicker -->
                                                                        <v-menu 
                                                                            v-else-if="multipleInputForm[1].inputType == 'datepicker'"
                                                                            rounded="xl"
                                                                            transition="slide-x-transition"
                                                                            bottom
                                                                            min-width="100"
                                                                            offset-y
                                                                            :close-on-content-click="false"
                                                                            v-model="multipleInputForm[1].show"
                                                                        >
                                                                            <template v-slot:activator="{ on: menu, attrs }">
                                                                                <v-tooltip top content-class="rounded-xl">
                                                                                    <template v-slot:activator="{ on: tooltip }">
                                                                                        <v-text-field
                                                                                            dense
                                                                                            color="green"
                                                                                            class="mb-2 mb-lg-0 mr-0 mr-lg-2"
                                                                                            hide-details
                                                                                            outlined
                                                                                            rounded
                                                                                            v-bind="attrs"
                                                                                            v-on="{...menu, ...tooltip}"
                                                                                            readonly
                                                                                            v-model="multipleInputItem[multipleInputForm[0]]"
                                                                                        >
                                                                                            <template v-slot:label>
                                                                                                {{ multipleInputForm[1].label }} 
                                                                                                <sup><v-icon v-if="multipleInputForm[1].required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                                            </template>
                                                                                        </v-text-field>
                                                                                    </template>
                                                                                    <span>Klik untuk memunculkan datepicker</span>
                                                                                </v-tooltip>
                                                                            </template>
                                                                            <div class="rounded-xl pb-2 white">
                                                                                <div class="d-flex flex-column align-center rounded-xl">
                                                                                    <v-date-picker 
                                                                                        :range="multipleInputForm[1].dateType === 'range'"
                                                                                        color="green lighten-1 rounded-xl" 
                                                                                        v-model="multipleInputItem[multipleInputForm[0]]"
                                                                                    ></v-date-picker>
                                                                                </div>
                                                                            </div>
                                                                        </v-menu>
                                                                    </div>
                                                                </v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row v-if="inputs[multipleInputHead].totalCanChange === true" class="justify-center">
                                                        <v-btn v-if="inputs[multipleInputHead].model.length < localConfig.maxSubDataTotal" 
                                                            data-aos="fade-right" data-aos-offset="-10000" 
                                                            :key="`${multipleInputHead}_plus_btn`" 
                                                            fab small color="green white--text" class="mx-1" 
                                                            @click="() => modifyTotalSubData('+', multipleInputHead)"
                                                        >
                                                            <v-icon>mdi-plus</v-icon>
                                                        </v-btn>
                                                        <v-btn v-if="inputs[multipleInputHead].model.length > 1" 
                                                            data-aos="fade-left" data-aos-offset="-10000" 
                                                            :key="`${multipleInputHead}_minus_btn`" 
                                                            fab small color="red" outlined class="mx-1"
                                                            @click="() => modifyTotalSubData('-', multipleInputHead)"
                                                        >
                                                            <v-icon>mdi-minus</v-icon>
                                                        </v-btn>
                                                    </v-row>
                                                    <v-row v-if="socImpInput.description === true">
                                                        <v-col cols="12">
                                                            <!-- textarea -->
                                                            <v-textarea
                                                                dense
                                                                color="success"
                                                                hide-details
                                                                :label="inputs[multipleInputHead].description.label"
                                                                outlined
                                                                rounded
                                                                :placeholder="inputs[multipleInputHead].description.placeholder"
                                                                :readonly="inputs[multipleInputHead].description.readonly"
                                                                v-model="inputs[multipleInputHead].description.model"
                                                            >
                                                                <template v-slot:label>
                                                                    <v-icon v-if="inputs[multipleInputHead].description.labelIcon" class="mr-1">{{ inputs[multipleInputHead].description.labelIcon }}</v-icon>
                                                                    {{ inputs[multipleInputHead].description.label }} 
                                                                    <sup><v-icon v-if="inputs[multipleInputHead].description.required" small style="vertical-align: middle;">{{ localConfig.requiredInputIcon }}</v-icon></sup>
                                                                </template>
                                                            </v-textarea>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                    :disabled="disabledSave"
                    @click="() => save()"
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
import Swal from 'sweetalert2'

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
        groupingInputs: {
            rra: [
                {
                    title: 'Batas Wilayah',
                    icon: 'mdi-compass-rose',        
                    type: 'village-border',
                    items: ["north", "east", "south", "west"],
                    required: true,
                    optional: false,
                },
                {
                    title: 'Landscape Desa',
                    icon: 'mdi-panorama',        
                    type: 'column',
                    required: true,
                    optional: false,
                    items: [
                        'land_area', 
                        'paddy_land', 
                        'field', 
                        'resident', 
                        'yard', 
                        'marshland', 
                        'lake', 
                        'people_plantation_land', 
                        'state_plantation_land', 
                        'private_plantation_land', 
                        'protected_forest', 
                        'people_forest', 
                        'public_facilities', 
                        'types_of_land_by_people'
                    ] 
                },
                {
                    title: 'Pola Pemanfaatan Lahan',
                    icon: 'mdi-land-fields',        
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    items: [
                        'land_use_patterns',
                    ] 
                },
                {
                    title: 'Tanaman Yang Sudah Ada',
                    icon: 'mdi-flower',        
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    items: [
                        'existing_plants',
                    ] 
                },
                {
                    title: 'Kelembagaan Masyarakat',
                    icon: 'mdi-account-cowboy-hat',        
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    items: [
                        'community_institutions',
                    ] 
                },
                {
                    title: 'Potensi Pertanian Organik',
                    icon: 'mdi-barn',        
                    type: 'multiple-input',
                    required: false,
                    optional: false,
                    items: [
                        'organic_farming_potential',
                    ] 
                },
                {
                    title: 'Pemasaran Hasil Produksi',
                    icon: 'mdi-store',        
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    items: [
                        'production_marketing',
                    ] 
                },
                {
                    title: 'Identifikasi Petani Inovatif',
                    icon: 'mdi-account-star',        
                    type: 'multiple-input',
                    required: false,
                    optional: false,
                    items: [
                        'identification_of_innovative_farmers',
                    ] 
                }
            ],
            pra: [
                {
                    title: 'Kepemilikan Lahan',
                    icon: 'mdi-account-tag',       
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    description: true,
                    items: [
                        'land_ownership',
                    ] 
                },
                {
                    title: 'Penyebaran Lokasi Lahan Kering / Kritis',
                    icon: 'mdi-land-fields',       
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    description: true,
                    items: [
                        'distribution_of_critical_land_locations',
                    ] 
                },
                {
                    title: 'Pendapatan dan Pemasaran Komoditas (Ekonomi)',
                    icon: 'mdi-hand-coin',       
                    type: 'custom-farmer_income',
                    required: true,
                    optional: false,
                    description: true,
                    items: [] 
                },
                {
                    title: 'Hasil Ekonomi Pemanfaatan Lahan',
                    icon: 'mdi-store',
                    type: 'column',
                    required: true,
                    optional: false,
                    description: true,
                    items: [
                        "land_utilization_source",
                        "land_utilization_plant_type",
                        "land_utilization_description",
                    ] 
                },
                {
                    title: 'Pupuk Dalam Pemanfaatan Lahan',
                    icon: 'mdi-beer',
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    description: false,
                    items: [
                        "pra_fertilizer",
                    ] 
                },
                {
                    title: 'Pestisida Dalam Pemanfaatan Lahan',
                    icon: 'mdi-weather-windy',       
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    description: false,
                    items: [
                        "pra_pesticide",
                    ] 
                },
                {
                    title: 'Bencana',
                    icon: 'mdi-heart-broken',       
                    type: 'multiple-input',
                    required: false,
                    optional: false,
                    description: false,
                    items: [
                        "disaster_history"
                    ] 
                },
                {
                    title: 'Permasalahan Yang Ada',
                    icon: 'mdi-book-alert',       
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    description: false,
                    items: [
                        "problem_existing"
                    ] 
                },
                {
                    title: 'Sumber Air',
                    icon: 'mdi-water-pump',       
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    description: true,
                    items: [
                        'water_source',
                    ] 
                },
            ],
            socImp: [
                {
                    title: 'Data Flora Endemik',
                    icon: 'mdi-flower',       
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    description: false,
                    items: [
                        "flora_data"
                    ] 
                },
                {
                    title: 'Data Fauna Endemik',
                    icon: 'mdi-bird',       
                    type: 'multiple-input',
                    required: true,
                    optional: false,
                    description: false,
                    items: [
                        "fauna_data"
                    ] 
                },
            ]
        },
        inputs: {
            program_year: {
                inputType: 'hidden',
                model: '',
                required: true
            },
            scooping_form_no: {
                inputType: 'autocomplete',
                items: [],
                label: 'Scooping Form No',
                required: true,
                model: '',
                loading: false
            },
            village: {
                model: null,
            },
            rra_pra_date_range: {
                loading: false,
                label: 'Tanggal RRA - PRA',
                model: [],
                modelShow: '',
                inputType: 'datepicker',
                dateType: 'range',
                lgView: 8,
                show: false,
                required: true,
                type: 'Date'
            },
            // RRA
            // village borderline
            village_border: {
                inputType: 'custom',
                north: {
                    label: 'Utara',
                    border_type: {
                        label: 'Tipe',
                        items: ['Kabupaten', 'Kecamatan', 'Desa'],
                        model: 'Desa',
                        lgView: 4
                    },
                    kabupaten: {
                        label: 'Kabupaten',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    },
                    kecamatan: {
                        label: 'Kecamatan',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    },
                    desa: {
                        label: 'Desa',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    }
                },
                east: {
                    label: 'Timur',
                    border_type: {
                        label: 'Tipe',
                        items: ['Kabupaten', 'Kecamatan', 'Desa'],
                        model: 'Desa',
                        lgView: 4
                    },
                    kabupaten: {
                        label: 'Kabupaten',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    },
                    kecamatan: {
                        label: 'Kecamatan',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    },
                    desa: {
                        label: 'Desa',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    }
                },
                south: {
                    label: 'Selatan',
                    border_type: {
                        label: 'Tipe',
                        items: ['Kabupaten', 'Kecamatan', 'Desa'],
                        model: 'Desa',
                        lgView: 4
                    },
                    kabupaten: {
                        label: 'Kabupaten',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    },
                    kecamatan: {
                        label: 'Kecamatan',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    },
                    desa: {
                        label: 'Desa',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    }
                },
                west: {
                    label: 'Barat',
                    border_type: {
                        label: 'Tipe',
                        items: ['Kabupaten', 'Kecamatan', 'Desa'],
                        model: 'Desa',
                        lgView: 4
                    },
                    kabupaten: {
                        label: 'Kabupaten',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    },
                    kecamatan: {
                        label: 'Kecamatan',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    },
                    desa: {
                        label: 'Desa',
                        items: [],
                        loading: false,
                        model: null,
                        lgView: 4
                    }
                },
            },
            // landscape desa
            land_area: {
                label: 'Luas Wilayah',
                model: 0,
                itemText: 'value',
                placeholder: `Pilih terlebih dahulu "Scooping Form No" diatas!`,
                itemValue: 'value',
                inputType: 'text-field',
                lgView: 12,
                suffix: 'Ha',
                loading: false,
                required: true,
                readonly: true,
                type: 'number'
            },
            paddy_land: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Tanah Sawah',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            field: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Tegal / Ladang',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            resident: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Pemukiman',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            yard: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Pekarangan',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            marshland: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Tanah Rawa',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            lake: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Situ / Waduk / Danau',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            people_plantation_land: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Tanah Perkebunan Rakyat',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            state_plantation_land: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Tanah Perkebunan Negara',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            private_plantation_land: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Tanah Perkebunan Swasta',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            protected_forest: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Hutan Lindung',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            people_forest: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Hutan Rakyat',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            public_facilities: {
                inputType: 'text-field',
                itemText: 'value',
                itemValue: 'value',
                label: 'Fasilitas Umum',
                lgView: 6,
                loading: false,
                model: 0,
                placeholder: `0`,
                readonly: false,
                required: true,
                suffix: 'Ha',
                type: 'number'
            },
            types_of_land_by_people: {
                inputType: 'textarea',
                itemText: 'value',
                itemValue: 'value',
                label: 'Jenis Lahan Menurut Masyarakat',
                lgView: 12,
                loading: false,
                model: '',
                placeholder: ``,
                readonly: false,
                required: true,
                suffix: '',
                type: 'text'
            },
            // pola pemanfaatan lahan
            land_use_patterns: {
                inputType: 'multiple-input',
                form: {
                    pattern: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Pola',
                        multiple: false,
                        required: true,
                        lgView: 4
                    },
                    plant: {
                        inputType: 'combobox',
                        chip: true,
                        items: [],
                        hideSelected: true,
                        label: 'Tanaman',
                        multiple: true,
                        chip: true,
                        required: true,
                        lgView: 8
                    }
                },
                model: [],
                default: [{
                    pattern: null,
                    plant: []
                }],
                totalCanChange: true
            },
            // tanaman yang sudah ada
            existing_plants: {
                inputType: 'multiple-input',
                form: {
                    plant_type: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [
                            'KAYU',
                            'MPTS',
                            'CROPS',
                        ],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Kategori',
                        multiple: false,
                        required: true,
                        readonly: true,
                        lgView: 4
                    },
                    plant: {
                        inputType: 'combobox',
                        chip: true,
                        items: [],
                        hideSelected: true,
                        label: 'Tanaman',
                        multiple: true,
                        chip: true,
                        required: true,
                        lgView: 8
                    }
                },
                model: [],
                default: [{
                    plant_type: 'KAYU',
                    plant: []
                },{
                    plant_type: 'MPTS',
                    plant: []
                },{
                    plant_type: 'CROPS',
                    plant: []
                }],
                totalCanChange: false
            },
            // kelembagaan masyarakat
            community_institutions: {
                inputType: 'multiple-input',
                form: {
                    institution_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Lembaga',
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    role: {
                        inputType: 'combobox',
                        chip: true,
                        items: [],
                        hideSelected: true,
                        label: 'Peran',
                        multiple: true,
                        chip: true,
                        required: true,
                        lgView: 6
                    },
                    description: {
                        inputType: 'textarea',
                        type: 'text',
                        label: 'Deskripsi',
                        required: true,
                        readonly: false,
                        lgView: 12
                    },
                },
                model: [],
                default: [{
                    institution_name: null,
                    role: [],
                    description: null
                }],
                totalCanChange: true
            },
            // potensi pertanian organik
            organic_farming_potential: {
                inputType: 'multiple-input',
                form: {
                    name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama',
                        required: true,
                        readonly: false,
                        lgView: 7
                    },
                    potential_category: {
                        inputType: 'combobox',
                        chip: true,
                        items: formOptions.potential_categories,
                        hideSelected: true,
                        label: 'Kategori Potensi',
                        multiple: false,
                        chip: true,
                        required: true,
                        lgView: 5
                    },
                    source: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Sumber',
                        required: true,
                        readonly: false,
                        lgView: 12
                    },
                    description: {
                        inputType: 'textarea',
                        type: 'text',
                        label: 'Deskripsi',
                        required: true,
                        readonly: false,
                        lgView: 12
                    },
                },
                model: [],
                default: [{
                    name: null,
                    potential_category: null,
                    source: null,
                    description: null
                }],
                totalCanChange: true
            },
            // pemasaran hasil produksi
            production_marketing: {
                inputType: 'multiple-input',
                form: {
                    commodity_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Komoditas',
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    capacity: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Kapasitas Komoditas',
                        required: true,
                        readonly: false,
                        suffix: 'kg',
                        lgView: 6
                    },
                    method: {
                        inputType: 'combobox',
                        chip: true,
                        items: ['Direct', 'Indirect'],
                        hideSelected: true,
                        label: 'Metode',
                        multiple: false,
                        chip: false,
                        required: true,
                        lgView: 4
                    },
                    period: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Periode Pemasaran Komoditas',
                        required: true,
                        readonly: false,
                        lgView: 8
                    },
                    description: {
                        inputType: 'textarea',
                        type: 'text',
                        label: 'Deskripsi',
                        required: true,
                        readonly: false,
                        lgView: 12
                    },
                    customer: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Pembeli',
                        required: false,
                        readonly: false,
                        lgView: 4
                    },
                    phone: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'No Telp',
                        required: false,
                        readonly: false,
                        lgView: 4
                    },
                    email: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Email',
                        required: false,
                        readonly: false,
                        lgView: 4
                    },
                },
                model: [],
                default: [{
                    commodity_name: null,
                    capacity: 0,
                    method: null,
                    period: null,
                    description: null,
                    customer: null,
                    phone: null,
                    email: null,
                }],
                totalCanChange: true
            },
            // identifikasi petani inovatif
            identification_of_innovative_farmers: {
                inputType: 'multiple-input',
                form: {
                    farmer_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Petani',
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    specialitation: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Spesialisasi Petani',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    potential: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Potensial',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 12
                    },
                    description: {
                        inputType: 'textarea',
                        type: 'text',
                        label: 'Deskripsi',
                        required: false,
                        readonly: false,
                        lgView: 12
                    },
                },
                model: [],
                default: [{
                    farmer_name: null,
                    specialitation: null,
                    potential: null,
                    description: null,
                }],
                totalCanChange: true
            },
            // Dusun Data
            hamlets: {
                expansionModel: 0,
                loading: false,
                required: true,
                inputType: 'multiple-input',
                type: 'MultipleInput',
                label: 'Data Dusun',
                form: {
                    divider5: {
                        label: 'General Data',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-list-box',
                        potentialRequirement: false
                    },
                    dusun_name: {
                        label: 'Nama Dusun',
                        type: 'text',
                        suffix: '',
                        lgView: 6,
                        labelIcon: 'mdi-tag',
                        required: true,
                        potentialRequirement: false,
                    },
                    land_area: {
                        label: 'Luas Dusun',
                        model: '',
                        inputType: 'text-field',
                        lgView: 6,
                        suffix: '',
                        append: 'm<sup>2</sup>',
                        loading: false,
                        required: true,
                        type: 'number',
                        potentialRequirement: true,
                    },
                    accessibility: {
                        items: formOptions.accessibility,
                        label: 'Aksesibilitas',
                        model: '',
                        itemText: 'value',
                        itemValue: 'value',
                        inputType: 'autocomplete',
                        lgView: 6,
                        loading: false,
                        required: true,
                        type: 'Select',
                        potentialRequirement: true,
                    },
                    dry_land_area: {
                        label: 'Luas Lahan Kering / Kritis',
                        model: '',
                        inputType: 'text-field',
                        lgView: 6,
                        append: 'm<sup>2</sup>',
                        loading: false,
                        required: true,
                        type: 'number',
                        potentialRequirement: true,
                    },
                    divider6: {
                        label: 'PIC Dusun',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-account-tag',
                        potentialRequirement: true,
                    },
                    pic_dusun: {
                        label: 'Nama',
                        type: 'text',
                        suffix: '',
                        lgView: 6,
                        labelIcon: '',
                        required: true,
                        potentialRequirement: true,
                    },
                    position: {
                        label: 'Jabatan',
                        type: 'text',
                        suffix: '',
                        lgView: 6,
                        labelIcon: '',
                        required: true,
                        potentialRequirement: true,
                    },
                    phone: {
                        label: 'No HP',
                        type: 'number',
                        suffix: '',
                        prependIcon: 'mdi-phone',
                        lgView: 6,
                        labelIcon: '',
                        required: true,
                        potentialRequirement: true,
                    },
                    whatsapp: {
                        label: 'Whatsapp',
                        type: 'number',
                        suffix: '',
                        prependIcon: 'mdi-whatsapp',
                        lgView: 6,
                        labelIcon: '',
                        required: false,
                        potentialRequirement: true,
                    },
                    divider1: {
                        label: 'Data Populasi',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-human-male-female-child',
                        potentialRequirement: true,
                    },
                    total_rw: {
                        label: 'RW',
                        type: 'number',
                        suffix: 'RW',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_rt: {
                        label: 'RT',
                        type: 'number',
                        suffix: 'RT',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_male: {
                        label: 'Jumlah Laki - Laki',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-human-male',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_female: {
                        label: 'Jumlah Perempuan',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-human-female',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_kk: {
                        label: 'Jumlah Keluarga (KK)',
                        type: 'number',
                        suffix: 'KK',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: false,
                    },
                    total_farmer_family: {
                        label: 'Jumlah Keluarga Petani (KK)',
                        type: 'number',
                        suffix: 'KK',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: true,
                    },
                    average_family_member: {
                        label: 'Rata - Rata Anggota Keluarga',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: true,
                    },
                    average_farmer_family_member: {
                        label: 'Rata - Rata Anggota Keluarga Petani',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: true,
                    },
                    divider2: {
                        label: 'Data Edukasi',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-book-education',
                        potentialRequirement: true,
                    },
                    education_elementary_junior_hs: {
                        label: 'SD - SMP',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-bus-school',
                        required: true,
                        potentialRequirement: true,
                    },
                    education_senior_hs: {
                        label: 'SMA',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-school',
                        required: true,
                        potentialRequirement: true,
                    },
                    education_college: {
                        label: 'Kuliah',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-school',
                        required: true,
                        potentialRequirement: true,
                    },
                    divider3: {
                        label: 'Produktifitas',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-face-man-shimmer',
                        potentialRequirement: true,
                    },
                    age_productive: {
                        label: 'Produktif',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-cash-check',
                        required: true,
                        potentialRequirement: true,
                    },
                    age_non_productive: {
                        label: 'Tidak Produktif',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-cash-off',
                        required: true,
                        potentialRequirement: true,
                    },
                    divider4: {
                        label: 'Mata Pencaharian Masyarakat',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-hand-coin',
                        potentialRequirement: true,
                    },
                    job_farmer: {
                        label: 'Petani',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-beekeeper',
                        required: true,
                        potentialRequirement: true,
                    },
                    job_farm_workers: {
                        label: 'Buruh Tani',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-beekeeper',
                        required: true,
                        potentialRequirement: true,
                    },
                    job_private_employee: {
                        label: 'Karyawan Swasta',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-supervisor',
                        required: true,
                        potentialRequirement: true,
                    },
                    job_state_employee: {
                        label: 'ASN (Guru, TNI, Polri)',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-tie',
                        required: true,
                        potentialRequirement: true,
                    },
                    job_enterpreneur: {
                        label: 'Wiraswasta',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-cash',
                        required: true,
                        potentialRequirement: true,
                    },
                    job_others: {
                        label: 'Profesi Lain (Peternakan, Buruh Peternakan, Pensiunan)',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-question',
                        required: true,
                        potentialRequirement: true,
                    },
                },
                model: [],
                default: [{
                    dusun_name: null,
                    potential: false,
                    land_area: 0,
                    accessibility: null,
                    dry_land_area: 0,
                    pic_dusun: null,
                    position: null,
                    phone: null,
                    whatsapp: null,
                    total_rw: 0,
                    total_rt: 0,
                    total_male: 0,
                    total_female: 0,
                    total_kk: 0,
                    total_farmer_family: 0,
                    average_family_member: 0,
                    average_farmer_family_member: 0,
                    education_elementary_junior_hs: 0,
                    education_senior_hs: 0,
                    education_college: 0,
                    age_productive: 0,
                    age_non_productive: 0,
                    job_farmer: 0,
                    job_farm_workers: 0,
                    job_private_employee: 0,
                    job_state_employee: 0,
                    job_enterpreneur: 0,
                    job_others: 0,
                }],
            },
            // PRA
            // kepemilikan lahan
            land_ownership: {
                inputType: 'multiple-input',
                form: {
                    type_ownership: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [
                            'Milik Petani',
                            'Diluar Milik Petani'
                        ],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Kategori Kepemilikan',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 4
                    },
                    land_ownership: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [
                            'Orang Luar Desa (Perorangan)',
                            'Lahan Desa',
                            'Negara'
                        ],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Jenis Kepemilikan',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 4
                    },
                    percentage: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Presentase',
                        required: true,
                        readonly: false,
                        suffix: '%',
                        lgView: 3
                    }
                },
                model: [],
                default: [{
                    type_ownership: null,
                    land_ownership: null,
                    percentage: 0,
                }],
                description: {
                    inputType: 'textarea',
                    type: 'text',
                    label: 'Deskripsi Kepemilikan Lahan',
                    model: null,
                    required: false,
                    readonly: false,
                    lgView: 12
                },
                totalCanChange: true,
            },
            // penyebaran lokasi lahan kritis
            distribution_of_critical_land_locations: {
                inputType: 'multiple-input',
                form: {
                    dusun_name: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [],
                        itemText: 'dusun_name',
                        itemValue: 'dusun_name',
                        hideSelected: false,
                        label: 'Nama Dusun',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    type_utilization: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Pola Pemanfaatan Lahan',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                },
                model: [],
                default: [{
                    dusun_name: null,
                    type_utilization: null,
                }],
                description: {
                    inputType: 'textarea',
                    type: 'text',
                    label: 'Deskripsi Penyebaran Lokasi Lahan Kering / Kritis',
                    model: null,
                    required: false,
                    readonly: false,
                    lgView: 12
                },
                totalCanChange: true,
            },
            // Pendapatan keluarga petani
            farmer_income: {
                collection_type: {
                    items: ['Sampling', 'Bukan Sampling'],
                    label: 'Cara Pengumpulan Data',
                    model: null,
                    multiple: false,
                    required: true,
                    lgView: 4
                },
                sampling_form: {
                    family_type: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: ['Keluarga Petani', 'Keluarga Non-Petani'],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Jenis Keluarga',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    job: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Pekerjaan',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    commodity_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Komoditas',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    method: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: ['Direct', 'Indirect', 'Konsumsi Sendiri'],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Metode Pemasaran Komoditas',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    indirect_method: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.economicDistribution,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Metode Indirect Selling',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    period: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Periode Pemasaran',
                        placeholder: 'Mingguan, Bulanan, Musiman, Tahunan, dll',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    capacity: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Kapasitas',
                        placeholder: '0',
                        required: true,
                        readonly: false,
                        suffix: 'kg',
                        lgView: 6
                    },
                    family_member: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Jumlah Keluarga',
                        placeholder: '',
                        required: true,
                        readonly: false,
                        suffix: 'orang',
                        lgView: 6
                    },
                    name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Peserta',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    source_income: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Pendapatan (Perbulan)',
                        required: true,
                        readonly: false,
                        prefix: 'Rp',
                        lgView: 6
                    },
                    source: {
                        inputType: 'combobox',
                        chip: true,
                        items: [],
                        hideSelected: true,
                        label: 'Sumber (Tanaman & Yang lainnya)',
                        multiple: true,
                        chip: true,
                        required: true,
                        lgView: 12
                    },
                },
                static_form: {
                    source: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Sumber',
                        placeholder: 'Pertanian, Ternak, dll',
                        required: true,
                        readonly: false,
                        prefix: '',
                        male_model: null,
                        female_model: null,
                        lgView: 12
                    },
                    comodity_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Komoditas',
                        placeholder: '',
                        required: true,
                        readonly: false,
                        prefix: '',
                        male_model: null,
                        female_model: null,
                        lgView: 6
                    },
                    method: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: ['Direct', 'Indirect'],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Metode Pemasaran Komoditas',
                        multiple: true,
                        required: true,
                        readonly: false,
                        lgView: 6,
                        male_model: null,
                        female_model: null,
                    },
                    indirect_method: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.economicDistribution,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Metode Indirect Selling',
                        multiple: true,
                        required: true,
                        readonly: false,
                        lgView: 6,
                        male_model: null,
                        female_model: null,
                    },
                    avg_period: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Rata - Rata Periode Pemasaran',
                        placeholder: '',
                        required: true,
                        readonly: false,
                        prefix: '',
                        male_model: null,
                        female_model: null,
                        lgView: 6
                    },
                    avg_capacity: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Rata - Rata Kapasitas Komoditas',
                        placeholder: '',
                        required: true,
                        readonly: false,
                        prefix: '',
                        suffix: 'kg',
                        male_model: null,
                        female_model: null,
                        lgView: 6
                    },
                    min_amount: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Pendapatan Terendah (Perbulan)',
                        required: true,
                        readonly: false,
                        prefix: 'Rp',
                        male_model: 0,
                        female_model: 0,
                        lgView: 6
                    },
                    max_amount: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Pendapatan Tertinggi (Perbulan)',
                        required: true,
                        readonly: false,
                        prefix: 'Rp',
                        male_model: 0,
                        female_model: 0,
                        lgView: 6
                    },
                },
                default: [{
                    family_type: null,
                    job: null,
                    commodity_name: null,
                    method: null,
                    indirect_method: null,
                    period: null,
                    capacity: 0,
                    family_member: null,
                    name: null,
                    source_income: 0,
                    source: []
                },{
                    family_type: null,
                    job: null,
                    commodity_name: null,
                    method: null,
                    indirect_method: null,
                    period: null,
                    capacity: 0,
                    family_member: null,
                    name: null,
                    source_income: 0,
                    source: []
                }],
                male_data: [],
                female_data: []
            },
            // Hasil Ekonomi Pemanfaatan Lahan
            land_utilization_source: {
                label: 'Sumber',
                model: '',
                itemText: 'value',
                placeholder: ``,
                itemValue: 'value',
                inputType: 'text-field',
                lgView: 4,
                suffix: '',
                loading: false,
                required: true,
                readonly: false,
                type: 'text'
            },
            land_utilization_plant_type: {
                inputType: 'combobox',
                chip: true,
                items: [],
                hideSelected: true,
                label: 'Jenis Tanaman',
                multiple: true,
                model: null,
                chip: false,
                required: true,
                lgView: 8
            },
            land_utilization_description: {
                label: 'Deskripsi',
                model: '',
                itemText: 'value',
                placeholder: ``,
                itemValue: 'value',
                inputType: 'textarea',
                lgView: 12,
                suffix: '',
                loading: false,
                required: false,
                readonly: false,
                type: 'text'
            },
            // pupuk dalam pemanfaatan lahan
            pra_fertilizer: {
                inputType: 'multiple-input',
                form: {
                    fertilizer_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    fertilizer_categories: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.fertilizer_categories,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Kategori Pupuk',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    fertilizer_type: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.fertilizer_types,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Jenis',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    fertilizer_source: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.fertilizer_sources,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Sumber',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    fertilizer_description: {
                        inputType: 'textarea',
                        hideSelected: false,
                        label: 'Deskripsi',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 12
                    },
                },
                model: [],
                default: [{
                    fertilizer_name: null,
                    fertilizer_categories: null,
                    fertilizer_type: null,
                    fertilizer_source: null,
                    fertilizer_description: null,
                }],
                description: {
                    inputType: 'textarea',
                    type: 'text',
                    label: 'Deskripsi Pupuk',
                    model: null,
                    required: false,
                    readonly: false,
                    lgView: 12
                },
                totalCanChange: true,
            },
            // pestisida dalam pemanfaatan lahan
            pra_pesticide: {
                inputType: 'multiple-input',
                form: {
                    pesticide_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    pesticide_categories: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.pesticide_categories,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Kategori Pestisida',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    pesticide_type: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.pesticide_types,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Tipe',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    pesticide_source: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.pesticide_sources,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Sumber',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    pesticide_description: {
                        inputType: 'textarea',
                        hideSelected: false,
                        label: 'Deskripsi',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 12
                    },
                },
                model: [],
                default: [{
                    pesticide_name: null,
                    pesticide_categories: null,
                    pesticide_type: null,
                    pesticide_source: null,
                    pesticide_description: null,
                }],
                description: {
                    inputType: 'textarea',
                    type: 'text',
                    label: 'Deskripsi Pestisida',
                    model: null,
                    required: false,
                    readonly: false,
                    lgView: 12
                },
                totalCanChange: true,
            },
            // bencana
            disaster_history: {
                inputType: 'multiple-input',
                form: {
                    disaster_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    disaster_categories: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.disaster_categories,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Kategori Bencana',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    year: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Tahun',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    fatalities: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Korban Jiwa',
                        required: true,
                        readonly: false,
                        suffix: 'orang',
                        lgView: 6
                    },
                    detail: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Detail',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 12
                    },
                },
                model: [],
                default: [{
                    disaster_name: null,
                    disaster_categories: null,
                    year: null,
                    fatalities: null,
                    detail: null,
                }],
                description: {
                    inputType: 'textarea',
                    type: 'text',
                    label: 'Deskripsi Pestisida',
                    model: null,
                    required: false,
                    readonly: false,
                    lgView: 12
                },
                totalCanChange: true,
            },
            // permasalahan yang ada
            problem_existing: {
                inputType: 'multiple-input',
                form: {
                    problem_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Masalah',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    problem_categories: {
                        inputType: 'combobox',
                        chip: false,
                        items: formOptions.problemCategories,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Kategori Masalah',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    date: {
                        inputType: 'datepicker',
                        dateType: 'range',
                        type: 'Date',
                        label: 'Tanggal',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 4
                    },
                    problem_source: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Sumber',
                        required: true,
                        readonly: false,
                        suffix: '',
                        lgView: 8
                    },
                    impact_to_people: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Yang Dirasakan Banyak Orang',
                        required: true,
                        readonly: false,
                        suffix: '1 - 10',
                        lgView: 3
                    },
                    interval_problem: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Sering Terjadi',
                        required: true,
                        readonly: false,
                        suffix: '1 - 10',
                        lgView: 3
                    },
                    priority: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Prioritas',
                        required: true,
                        readonly: false,
                        suffix: '1 - 10',
                        lgView: 3
                    },
                    potential: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Potensi',
                        required: true,
                        readonly: false,
                        suffix: '1 - 10',
                        lgView: 3
                    },
                    problem_solution: {
                        inputType: 'textarea',
                        type: 'text',
                        label: 'Solusi',
                        required: false,
                        readonly: false,
                        lgView: 12
                    },
                },
                model: [],
                default: [{
                    problem_name: null,
                    problem_categories: null,
                    date: [moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
                    problem_source: null,
                    impact_to_people: 0,
                    interval_problem: 0,
                    priority: 0,
                    potential: 0,
                    problem_solution: null,
                }],
                description: {
                    inputType: 'textarea',
                    type: 'text',
                    label: 'Deskripsi Permasalahan',
                    model: null,
                    required: false,
                    readonly: false,
                    lgView: 12
                },
                totalCanChange: true,
            },
            // Water Source
            water_source: {
                inputType: 'multiple-input',
                form: {
                    watersource_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama',
                        required: true,
                        readonly: false,
                        lgView: 6
                    },
                    watersource_type: {
                        inputType: 'combobox',
                        chip: true,
                        items: ['Sungai', 'Mata Air', 'Danau', 'Waduk'],
                        hideSelected: true,
                        label: 'Jenis',
                        multiple: false,
                        chip: false,
                        required: true,
                        lgView: 6
                    },
                    watersource_condition: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: ['Jernih', 'Keruh'],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Kondisi',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 3
                    },
                    consumption: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: ['Ya', 'Tidak'],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Pemanfaatan Oleh Masyarakat',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 3
                    },
                    watersource_utilization: {
                        inputType: 'combobox',
                        chip: true,
                        items: ['Domestik', 'Irigasi'],
                        hideSelected: true,
                        label: 'Pemanfaatan',
                        multiple: false,
                        chip: false,
                        required: true,
                        lgView: 6
                    },
                },
                model: [],
                default: [{
                    watersource_name: null,
                    watersource_type: null,
                    watersource_condition: null,
                    consumption: null,
                    watersource_utilization: null,
                }],
                description: {
                    inputType: 'textarea',
                    type: 'text',
                    label: 'Deskripsi Sumber Air',
                    model: null,
                    required: false,
                    readonly: false,
                    lgView: 12
                },
                totalCanChange: true
            },
            // Flora & Fauna
            flora_data: {
                inputType: 'multiple-input',
                form: {
                    flora_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama',
                        required: false,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    flora_categories: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [...formOptions.floraCategories, ...formOptions.floraTypes],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Jenis',
                        multiple: false,
                        required: false,
                        readonly: false,
                        lgView: 6
                    },
                    flora_population: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Populasi',
                        required: false,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    flora_foodsource: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.wsCategories,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Sumber Air',
                        multiple: false,
                        required: false,
                        readonly: false,
                        lgView: 6
                    },
                    flora_status: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.floraStatus,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Status',
                        multiple: false,
                        required: false,
                        readonly: false,
                        lgView: 6
                    },
                    flora_habitat: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Habitat',
                        required: false,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                },
                model: [],
                default: [{
                    flora_categories: null,
                    flora_name: null,
                    flora_population: 0,
                    flora_foodsource: null,
                    flora_status: null,
                    flora_habitat: null,
                }],
                description: {
                    inputType: 'textarea',
                    type: 'text',
                    label: 'Deskripsi Kepemilikan Lahan',
                    model: null,
                    required: false,
                    readonly: false,
                    lgView: 12
                },
                totalCanChange: true,
            },
            fauna_data: {
                inputType: 'multiple-input',
                form: {
                    fauna_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama',
                        required: false,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    fauna_categories: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [...formOptions.faunaCategories, ...formOptions.faunaTypes],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Jenis',
                        multiple: false,
                        required: false,
                        readonly: false,
                        lgView: 6
                    },
                    fauna_population: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'Populasi',
                        required: false,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                    fauna_foodsource: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.faunaFoodSource,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Sumber Makanan',
                        multiple: false,
                        required: false,
                        readonly: false,
                        lgView: 6
                    },
                    fauna_status: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: formOptions.faunaStatus,
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Status',
                        multiple: false,
                        required: false,
                        readonly: false,
                        lgView: 6
                    },
                    fauna_habitat: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Habitat',
                        required: false,
                        readonly: false,
                        suffix: '',
                        lgView: 6
                    },
                },
                model: [],
                default: [{
                    fauna_categories: null,
                    fauna_name: null,
                    fauna_population: 0,
                    fauna_foodsource: null,
                    fauna_status: null,
                    fauna_habitat: null,
                }],
                description: {
                    inputType: 'textarea',
                    type: 'text',
                    label: 'Deskripsi Kepemilikan Lahan',
                    model: null,
                    required: false,
                    readonly: false,
                    lgView: 12
                },
                totalCanChange: true,
            },
        },
        loading: {
            show: false,
            text: 'Loading...'
        },
        localConfig: {
            windowWidth: window.innerWidth,
            breakLayoutFrom: 1140,
            maxSubDataTotal: 5,
            requiredInputIcon: 'mdi-star'
        },
        stepper: {
            model: 1,
            steps: ['RRA', 'PRA', 'Flora & Fauna'],
            steps_icon: ['home-group', 'home-analytics', 'cat']
        },
    }),
    watch: {
        'inputs.rra_pra_date_range.model': {
            async handler(newVal) {
                // console.log(newVal[0])
                let range = JSON.parse(JSON.stringify(newVal))
                range.sort()
                // console.log(range)
                this.inputs.rra_pra_date_range.modelShow = this._utils.dateFormat(range[0], 'DD MMMM Y') + ' ~ ' + this._utils.dateFormat(range[1], 'DD MMMM Y')
            }
        },
        'inputs.scooping_form_no.model': {
            async handler(val) {
                try {
                    this.loading.show = true
                    // get scooping data + set land_area
                    this.loading.text = 'Get scooping data...'
                    const params = new URLSearchParams({
                        data_no: val
                    })
                    const scoopingData = await this.callApiGet(`GetDetailScooping`, `?${params}` )
                    this.inputs.land_area.model = scoopingData.land_area
                    // set village
                    this.inputs.village.model = scoopingData.village
                    // set list kabupaten & reset data
                    this.loading.text = 'Get list kabupaten...'
                    const list_kabupaten = await this.callApiGet(`GetKabupaten`, `?province_code=${scoopingData.province}`)
                    const points = ['north', 'east', 'south', 'west']
                    points.map(point => {
                        this.inputs.village_border[point].kabupaten.items = list_kabupaten
                        this.inputs.village_border[point].kecamatan.items = []
                        this.inputs.village_border[point].kecamatan.model = null
                        this.inputs.village_border[point].desa.items = []
                        this.inputs.village_border[point].desa.model = null
                    })
                } catch (err) {this.errorResponse(err)} finally {
                    this.loading.show = false
                }
            }
        },
        'inputs.village_border.north.kabupaten.model': {
            async handler(val) {
                let north = this.inputs.village_border.north
                try {
                    north.kecamatan.loading = true
                    if (north.border_type.model != 'Kabupaten') {
                        north.kecamatan.loading = true
                        const list_kecamatan = await this.callApiGet(`GetKecamatan?kabupaten_no=${val}`)
                        north.kecamatan.items = list_kecamatan
                        north.kecamatan.model = null
                        north.desa.items = []
                        north.desa.model = null
                    }
                } catch (err) {this.errorResponse(err)} finally {
                    north.kecamatan.loading = false
                }
            }
        },
        'inputs.village_border.north.kecamatan.model': {
            async handler(val) {
                let north = this.inputs.village_border.north
                try {
                    north.desa.loading = true
                    if (north.border_type.model == 'Desa') {
                        north.desa.loading = true
                        const list_desa = await this.callApiGet(`GetDesa?kode_kecamatan=${val}`)
                        north.desa.items = list_desa
                        north.desa.model = null
                    }
                } catch (err) {this.errorResponse(err)} finally {
                    north.desa.loading = false
                }
            }
        },
        'inputs.village_border.east.kabupaten.model': {
            async handler(val) {
                let east = this.inputs.village_border.east
                try {
                    east.kecamatan.loading = true
                    if (east.border_type.model != 'Kabupaten') {
                        east.kecamatan.loading = true
                        const list_kecamatan = await this.callApiGet(`GetKecamatan?kabupaten_no=${val}`)
                        east.kecamatan.items = list_kecamatan
                        east.kecamatan.model = null
                        east.desa.items = []
                        east.desa.model = null
                    }
                } catch (err) {this.errorResponse(err)} finally {
                    east.kecamatan.loading = false
                }
            }
        },
        'inputs.village_border.east.kecamatan.model': {
            async handler(val) {
                let east = this.inputs.village_border.east
                try {
                    east.desa.loading = true
                    if (east.border_type.model == 'Desa') {
                        east.desa.loading = true
                        const list_desa = await this.callApiGet(`GetDesa?kode_kecamatan=${val}`)
                        east.desa.items = list_desa
                        east.desa.model = null
                    }
                } catch (err) {this.errorResponse(err)} finally {
                    east.desa.loading = false
                }
            }
        },
        'inputs.village_border.south.kabupaten.model': {
            async handler(val) {
                let south = this.inputs.village_border.south
                try {
                    south.kecamatan.loading = true
                    if (south.border_type.model != 'Kabupaten') {
                        south.kecamatan.loading = true
                        const list_kecamatan = await this.callApiGet(`GetKecamatan?kabupaten_no=${val}`)
                        south.kecamatan.items = list_kecamatan
                        south.kecamatan.model = null
                        south.desa.items = []
                        south.desa.model = null
                    }
                } catch (err) {this.errorResponse(err)} finally {
                    south.kecamatan.loading = false
                }
            }
        },
        'inputs.village_border.south.kecamatan.model': {
            async handler(val) {
                let south = this.inputs.village_border.south
                try {
                    south.desa.loading = true
                    if (south.border_type.model == 'Desa') {
                        south.desa.loading = true
                        const list_desa = await this.callApiGet(`GetDesa?kode_kecamatan=${val}`)
                        south.desa.items = list_desa
                        south.desa.model = null
                    }
                } catch (err) {this.errorResponse(err)} finally {
                    south.desa.loading = false
                }
            }
        },
        'inputs.village_border.west.kabupaten.model': {
            async handler(val) {
                let west = this.inputs.village_border.west
                try {
                    west.kecamatan.loading = true
                    if (west.border_type.model != 'Kabupaten') {
                        west.kecamatan.loading = true
                        const list_kecamatan = await this.callApiGet(`GetKecamatan?kabupaten_no=${val}`)
                        west.kecamatan.items = list_kecamatan
                        west.kecamatan.model = null
                        west.desa.items = []
                        west.desa.model = null
                    }
                } catch (err) {this.errorResponse(err)} finally {
                    west.kecamatan.loading = false
                }
            }
        },
        'inputs.village_border.west.kecamatan.model': {
            async handler(val) {
                let west = this.inputs.village_border.west
                try {
                    west.desa.loading = true
                    if (west.border_type.model == 'Desa') {
                        west.desa.loading = true
                        const list_desa = await this.callApiGet(`GetDesa?kode_kecamatan=${val}`)
                        west.desa.items = list_desa
                        west.desa.model = null
                    }
                } catch (err) {this.errorResponse(err)} finally {
                    west.desa.loading = false
                }
            }
        },
    },
    computed: {
        showModal: {
            get: function () {
                if (this.show) {
                    this.inputs.program_year.model = this.programYear
                    if (this.id) {
                        // this.getDetailData(this.id)
                    } else {
                        this.setDefaultData()
                    }
                }
                return this.show
            },
            set: function(newVal) {
                if (newVal) {
                } else this.$emit('action', {type: 'close', name: 'form'})
            }
        },
        disabledSave() {
            return false
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize)
        })
    },
    methods: {
        async callApiGet(route, params = '') {
            try {
                const url = this.$store.getters.getApiUrl(`${route}${params}`)
                const response = await axios.get(url, this.$store.state.apiConfig)
                const res = response.data.data.result
                return res
            } catch (err) {this.errorResponse(err)}
        },
        async errorResponse(error) {
            console.log(error)
            if (error.response) {
                if (error.response.status) {
                    if (error.response.status == 401) {
                        const confirm = await Swal.fire({
                            title: 'Session Ended!',
                            text: "Please login again.",
                            icon: 'warning',
                            confirmButtonColor: '#2e7d32',
                            confirmButtonText: 'Okay'
                        })
                        if (confirm) {
                            localStorage.removeItem("token");
                            this.$router.push("/");
                        }
                    }
                    if (error.response.status === 500 || error.response.status === 400) {
                        let errMessage = error.response.data.message
                        if (errMessage) if (errMessage.includes("Duplicate entry")) errMessage = 'Data sudah ada!' 
                        Swal.fire({
                            title: 'Error!',
                            text: `${errMessage || error.message}`,
                            icon: 'error',
                            confirmButtonColor: '#f44336',
                        })
                    }
                }
            }
        },
        async getOptionsDataReturn(name, urlSuffix) {
            try {
                this.loading.text = `Get ${name}...`
                const url = this.$store.getters.getApiUrl(urlSuffix)
                const res = await axios.get(url, this.$store.state.apiConfig)
                const data = res.data.data.result
                return data
            } catch (err) {this.errorResponse(err)}
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
        async getScoopingListItems() {
            try {
                this.loading.text = 'Get list scooping user...'
                // get rra pra list
                const res1 = await this.callApiGet(`GetRraPraAll`)
                const data1 = res1.map(val => {return val.form_no})
                // get scooping list
                const res2 = await this.callApiGet(`GetScoopingAll`)
                const data2 = res2.filter(val => val.is_verify === 1 && !data1.includes(val.data_no))
                this.inputs.scooping_form_no.items = data2
            } catch (err) {this.errorResponse(err)}
        },
        modifyTotalSubData(type, name) {
            if (type == '+') {
                let inputs = null

                if (name.includes('farmer_income')) {
                    const splitName = name.split('-')
                    const defaultData = JSON.parse(JSON.stringify(this.inputs[splitName[0]].default[0]))
                    this.inputs[splitName[0]][`${splitName[1]}_data`].push(defaultData)
                    console.log(splitName)
                } else if (inputs) {
                    this.inputs[name].model.push(inputs)
                } else {
                    const defaultData = JSON.parse(JSON.stringify(this.inputs[name].default[0]))
                    this.inputs[name].model.push(defaultData)
                }
            } else if (type == '-') {
                if (name.includes('farmer_income')) {
                    const splitName = name.split('-')
                    this.inputs[splitName[0]][`${splitName[1]}_data`].pop()
                } else this.inputs[name].model.pop()
            }

            if (name == 'hamlets') this.inputs.hamlets.expansionModel = this.inputs.hamlets.model.length - 1
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        },
        async save() {
            try {
                const confirm = await Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#2e7d32',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Tidak Jadi',
                    confirmButtonText: 'Ya, Lanjutkan!'
                })
                if (confirm.isConfirmed) {
                    this.loading.show = true
                    this.loading.text = 'Saving data...'
                    const url = this.$store.getters.getApiUrl('AddRraPra')
                    let inputs = Object.entries(this.inputs)
                    let data = {}
                    const database_adj_name = await this.zwitchKeyName()
                    for (const [key, value] of inputs) {
                        if (value.model !== undefined) {
                            if (database_adj_name[key]) data[database_adj_name[key]] = await value.model
                            else if (key === 'rra_pra_date_range') {
                                data.rra_pra_date_start = await value.model[0]
                                if (value.model[1]) data.rra_pra_date_end = await value.model[1]
                            } else {
                                data[key] = await value.model
                                if (value.description) data[`${key}_description`] = value.description.model
                            }
                        } else if (key === 'village_border') {
                            const points = ['north', 'east', 'south', 'west']
                            data.village_border = await []
                            points.map(async function (point) {
                                await data.village_border.push({
                                    point: point,
                                    border_type: value[point].border_type.model,
                                    kabupaten_no: value[point].kabupaten.model,
                                    kode_kecamatan: value[point].kecamatan.model,
                                    kode_desa: value[point].desa.model,
                                })
                            })
                        } else if (key === 'farmer_income') {
                            data.collection_type = value.collection_type.model
                            if (value.collection_type.model === 'Bukan Sampling') {
                                data.farmer_income = []
                                data.man_source = value.static_form.source.male_model
                                data.man_commodity_name = value.static_form.comodity_name.male_model
                                data.man_method = value.static_form.method.male_model.toString()
                                data.man_marketing = value.static_form.indirect_method.male_model.toString()
                                data.man_period = value.static_form.avg_period.male_model
                                data.man_average_capacity = value.static_form.avg_capacity.male_model
                                data.man_min_income = value.static_form.min_amount.male_model
                                data.man_max_income = value.static_form.max_amount.male_model
                                data.woman_source = value.static_form.source.female_model
                                data.woman_commodity_name = value.static_form.comodity_name.female_model
                                data.woman_method = value.static_form.method.female_model.toString()
                                data.woman_marketing = value.static_form.indirect_method.female_model.toString()
                                data.woman_period = value.static_form.avg_period.female_model
                                data.woman_average_capacity = value.static_form.avg_capacity.female_model
                                data.woman_min_income = value.static_form.min_amount.female_model
                                data.woman_max_income = value.static_form.max_amount.female_model
                            } else {
                                let male_source = []
                                let male_total_capacity = 0
                                let male_min_income = 0
                                let male_max_income = 0
                                const male_data = value.male_data.map((fimdm, fimdmIndex) => {
                                    const source_income = parseInt(fimdm.source_income || 0)
                                    if (fimdm.source) fimdm.source.map(fimdms => {
                                        if (!male_source.includes(fimdms)) male_source.push(fimdms)
                                    })
                                    male_total_capacity += parseInt(fimdm.capacity || 0)
                                    if (fimdmIndex === 0) male_min_income = source_income
                                    else if (male_min_income > source_income) male_min_income = source_income
                                    if (male_max_income < source_income) male_max_income = source_income
                                    
                                    return {
                                        ...fimdm,
                                        gender: 'male',
                                        source: fimdm.source ? fimdm.source.toString() : '',
                                        capacity: parseInt(fimdm.capacity || 0),
                                        source_income: source_income,
                                    }
                                })
                                let female_source = []
                                let female_total_capacity = 0
                                let female_min_income = 0
                                let female_max_income = 0
                                const female_data = value.female_data.map((fimdf, fimdfIndex) => {
                                    const source_income = parseInt(fimdf.source_income || 0)
                                    if (fimdf.source) fimdf.source.map(fimdfs => {
                                        if (!female_source.includes(fimdfs)) female_source.push(fimdfs)
                                    })
                                    female_total_capacity += parseInt(fimdf.capacity || 0)
                                    if (fimdfIndex === 0) female_min_income = source_income
                                    else if (female_min_income > source_income) female_min_income = source_income
                                    if (female_max_income < source_income) female_max_income = source_income
                                    return {
                                        ...fimdf,
                                        gender: 'female',
                                        source: fimdf.source ? fimdf.source.toString() : '',
                                        capacity: fimdf.capacity || 0,
                                        source_income: source_income,
                                    }
                                })
                                data.farmer_income = [...male_data, ...female_data]
                                data.man_source = male_source.toString()
                                data.man_commodity_name = null
                                data.man_method = null
                                data.man_marketing = null
                                data.man_period = null
                                data.man_average_capacity = Math.round(male_total_capacity / male_data.length)
                                data.man_min_income = male_min_income
                                data.man_max_income = male_max_income
                                data.woman_source = female_source.toString()
                                data.woman_commodity_name = null
                                data.woman_method = null
                                data.woman_marketing = null
                                data.woman_period = null
                                data.woman_average_capacity = Math.round(female_total_capacity / female_data.length)
                                data.woman_min_income = female_min_income
                                data.woman_max_income = female_max_income
                            }
                        } 
                    }
                    // console.log(data)
                    const res = await axios.post(url, data, this.$store.state.apiConfig)
                    if (res) {
                        this.showModal = false
                        this.$emit('swal', {type: 'success', message: 'Yey! Data RRA-PRA saved!'})
                    }
                }
            } catch(err) {
                this.errorResponse(err)
            } finally {
                this.loading.show = false
            }
        },
        async setDefaultData() {
            try {
                this.loading.show = true
                // set rra pra date range
                this.inputs.rra_pra_date_range.model =[ moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                // set default data for multiple inputs
                this.loading.text = 'Setting default data...'
                for (const [key, value] of Object.entries(this.inputs)) {
                    if (key == 'farmer_income') {
                        value.male_data = await JSON.parse(JSON.stringify(value.default))
                        value.female_data = await JSON.parse(JSON.stringify(value.default))
                    } else {
                        if (value.inputType) if (value.inputType === 'multiple-input') {
                            const defaultData = await JSON.parse(JSON.stringify(value.default))
                            value.model = await defaultData
                        }            
                    }
                }
                // set list dusun di penyebaran lokasi lahan kering / kritis
                this.inputs.distribution_of_critical_land_locations.form.dusun_name.items = this.inputs.hamlets.model
                // set sampling job list
                const jobs = [
                    'Karyawan Swasta',
                    'ASN',
                    'Wiraswasta',
                    'Profesi Lain'
                ]
                this.inputs.farmer_income.sampling_form.job.items = jobs
                // get scooping list item
                await this.getScoopingListItems()
                // get pola tanam options
                // const polaTanam = await this.getOptionsDataReturn('List Opsi Tanam', 'GetOpsiPolaTanamOptions')
                const polaTanam = [
                    'Agroforestry Intensitas Tinggi',
                    'Agroforestry Intensitas Rendah',
                    'Konservasi',
                ]
                this.inputs.land_use_patterns.form.pattern.items = polaTanam
                this.inputs.distribution_of_critical_land_locations.form.type_utilization.items = polaTanam
                // get list nama pohon
                const resTrees = await this.getOptionsDataReturn('Pohon Data', 'GetTreesAll')
                const listTrees = await resTrees.data.map(tree => {return tree.tree_name})
                this.inputs.land_use_patterns.form.plant.items = listTrees
                this.inputs.existing_plants.form.plant.items = listTrees
                this.inputs.land_utilization_plant_type.items = listTrees
                this.inputs.farmer_income.sampling_form.source.items = listTrees
                this.inputs.farmer_income.static_form.source.items = listTrees

                await this.setDummyData()
            } catch (err) {this.errorResponse(err)} finally {
                this.loading.show = false
            }
        },
        async setDummyData() {
            try {
                this.loading.text = 'Set dummies data...'
                // setting optional data to TRUE
                for (const [key, value] of Object.entries(this.groupingInputs)) {
                    value.map(async function (val) {
                        if (val.required == false) val.optional = true
                    })
                }
                let inputs = this.inputs
                // set scooping form
                inputs.scooping_form_no.model = 'SCP-0015'
                inputs.land_area.model = 0 // get from scooping data
                inputs.paddy_land.model = 100
                inputs.field.model = 100
                inputs.resident.model = 100
                inputs.yard.model = 100
                inputs.marshland.model = 100
                inputs.lake.model = 100
                inputs.people_plantation_land.model = 100
                inputs.state_plantation_land.model = 100
                inputs.private_plantation_land.model = 100
                inputs.protected_forest.model = 100
                inputs.people_forest.model = 100
                inputs.public_facilities.model = 100
                inputs.types_of_land_by_people.model = 'Lahan masih banyak yang kosong.'
                inputs.land_use_patterns.model = [{
                    pattern: 'Konservasi',
                    plant: ['Jabon', 'Sengon', 'Jati']
                },{
                    pattern: 'Agroforestry Intensitas Tinggi',
                    plant: ['Api Api']
                }]
                inputs.existing_plants.model = [{
                    plant_type: 'KAYU',
                    plant: ['Jabon', 'Jati', 'Sengon']
                },{
                    plant_type: 'MPTS',
                    plant: ['Alpukat', 'Durian']
                },{
                    plant_type: 'CROPS',
                    plant: ['Jahe Merah']
                }]
                inputs.community_institutions.model = [{
                    institution_name: 'SSB Desa',
                    role: ['Olahraga', 'Sepak Bola'],
                    description: 'Pelatihan sepak bola untuk mempersiapkan turnamen - turnamen antar desa.'
                }]
                inputs.organic_farming_potential.model = [{
                    name: 'Asep',
                    potential_category: 'Profitable',
                    source: 'Penananman jagung',
                    description: 'Jagung yang ditanam oleh kang asep selalu berkwalitas tinggi'
                }]
                inputs.production_marketing.model = [{
                    commodity_name: 'Kopi',
                    capacity: 100,
                    method: 'Direct',
                    period: 'Bulanan',
                    description: null,
                    customer: 'Fulanah',
                    phone: '0823123894329',
                    email: 'fulanah@email',
                }]
                inputs.identification_of_innovative_farmers.model = [{
                    farmer_name: 'Asep 2',
                    specialitation: 'Nyangkul',
                    potential: 'Penyangkul tercepat di desa',
                    description: 'Nyangkulnya cepet bangeet!',
                }]
                inputs.hamlets.model = [{
                    dusun_name: 'Dusun 1',
                    potential: true,
                    land_area: 50,
                    accessibility: 'Mudah',
                    dry_land_area: 50,
                    pic_dusun: 'Asep 3',
                    position: 'Top 1 Farmer',
                    phone: '082233132849',
                    whatsapp: '082233132849',
                    total_rw: 2,
                    total_rt: 9,
                    total_male: 100,
                    total_female: 200,
                    total_kk: 20,
                    total_farmer_family: 15,
                    average_family_member: 4,
                    average_farmer_family_member: 3,
                    education_elementary_junior_hs: 30,
                    education_senior_hs: 30,
                    education_college: 20,
                    age_productive: 60,
                    age_non_productive: 20,
                    job_farmer: 70,
                    job_farm_workers: 30,
                    job_private_employee: 10,
                    job_state_employee: 10,
                    job_enterpreneur: 10,
                    job_others: 30,
                }]
                
                this.stepper.model = 2
                inputs.land_ownership.model = [{
                    type_ownership: 'Milik Petani',
                    land_ownership: null,
                    percentage: 40,
                },{
                    type_ownership: 'Diluar Milik Petani',
                    land_ownership: 'Lahan Desa',
                    percentage: 60,
                }]
                inputs.land_ownership.description.model = 'Lahan petani kebanyakan masih kosong'
                inputs.distribution_of_critical_land_locations.form.dusun_name.items = this.inputs.hamlets.model
                inputs.distribution_of_critical_land_locations.model = [{
                    dusun_name: 'Dusun 1',
                    type_utilization: 'Konservasi'
                }]
                inputs.distribution_of_critical_land_locations.description.model = 'Di dusun 1 masih banyak lahan kering yang memungkinkan untuk ditanami dengan pola Konservasi'
                // Farmer Income Sampling
                inputs.farmer_income.collection_type.model = 'Sampling'
                inputs.farmer_income.male_data = [{
                    family_type: 'Keluarga Petani',
                    job: null,
                    commodity_name: 'Kopi',
                    method: 'Direct',
                    indirect_method: null,
                    period: 'Musiman',
                    capacity: 1000,
                    family_member: 5,
                    name: 'Asep',
                    source_income: 10000000,
                    source: ['Kopi']
                },{
                    family_type: 'Keluarga Non-Petani',
                    job: 'ASN',
                    commodity_name: 'Mangga',
                    method: 'Indirect',
                    indirect_method: 'UMKM',
                    period: 'Harian',
                    capacity: 10,
                    family_member: 6,
                    name: 'Rambo',
                    source_income: 12000000,
                    source: ['Mangga']
                }]
                inputs.farmer_income.female_data = [{
                    family_type: 'Keluarga Petani',
                    job: null,
                    commodity_name: 'Kopi',
                    method: 'Direct',
                    indirect_method: null,
                    period: 'Musiman',
                    capacity: 1000,
                    family_member: 5,
                    name: 'Asepah',
                    source_income: 10000000,
                    source: ['Kopi']
                },{
                    family_type: 'Keluarga Non-Petani',
                    job: 'ASN',
                    commodity_name: 'Mangga',
                    method: 'Indirect',
                    indirect_method: 'UMKM',
                    period: 'Harian',
                    capacity: 10,
                    family_member: 6,
                    name: 'Teh Rambo',
                    source_income: 12000000,
                    source: ['Mangga']
                }]
                // Farmer Income Not Sampling
                // inputs.farmer_income.collection_type.model = 'Bukan Sampling'
                // inputs.farmer_income.static_form.source.male_model = 'Penjualan hasil tanaman'
                // inputs.farmer_income.static_form.comodity_name.male_model = 'Beras, Kopi'
                // inputs.farmer_income.static_form.method.male_model = ['Direct', 'Indirect']
                // inputs.farmer_income.static_form.indirect_method.male_model = ['UMKM']
                // inputs.farmer_income.static_form.avg_period.male_model = 'Musiman'
                // inputs.farmer_income.static_form.avg_capacity.male_model = 200
                // inputs.farmer_income.static_form.min_amount.male_model = 3000000
                // inputs.farmer_income.static_form.max_amount.male_model = 9000000
                // inputs.farmer_income.static_form.source.female_model = 'Penjualan hasil tanaman'
                // inputs.farmer_income.static_form.comodity_name.female_model = 'Sayur, Jagung, Kopi'
                // inputs.farmer_income.static_form.method.female_model = ['Direct', 'Indirect']
                // inputs.farmer_income.static_form.indirect_method.female_model = ['UMKM']
                // inputs.farmer_income.static_form.avg_period.female_model = 'Bulanan'
                // inputs.farmer_income.static_form.avg_capacity.female_model = 200
                // inputs.farmer_income.static_form.min_amount.female_model = 2000000
                // inputs.farmer_income.static_form.max_amount.female_model = 7000000
                inputs.land_utilization_source.model = 'Sawah'
                inputs.land_utilization_plant_type.model = ['Padi', 'Jagung']
                inputs.land_utilization_description.model = 'Jual padi dan jagung'
                inputs.pra_fertilizer.model = [
                    {
                        fertilizer_name: 'Pupuk 1',
                        fertilizer_categories: 'Natural',
                        fertilizer_type: 'Urea',
                        fertilizer_source: 'Self Production',
                        fertilizer_description: 'Puup puk'
                    }
                ]
                inputs.pra_pesticide.model = [
                    {
                        pesticide_name: 'Pestisida 1',
                        pesticide_categories: 'Natural',
                        pesticide_type: 'Akarisida',
                        pesticide_source: 'Procurement',
                        pesticide_description: 'Pestisidaaaa'
                    }
                ]
                inputs.disaster_history.model = [{
                    disaster_name: 'Banjir',
                    disaster_categories: 'Water related',
                    year: 2022,
                    fatalities: 10,
                    detail: 'Astaga banjir'
                }]
                inputs.problem_existing.model = [{
                    problem_name: 'Masalah Masalah',
                    problem_categories: 'Birokrasi',
                    date: [moment().format('YYYY-MM-DD')],
                    problem_source: 'Sumber Masalah',
                    impact_to_people: 3,
                    interval_problem: 4,
                    priority: 6,
                    potential: 3,
                    problem_solution: `Solusi - solusiiiiiiiiiii`,
                }]
                inputs.water_source.model = [{
                    watersource_name: 'Sungai A',
                    watersource_type: 'Sungai',
                    watersource_condition: 'Jernih',
                    consumption: 'Ya',
                    watersource_utilization: 'Buat apa aja bisa',
                }]
                inputs.water_source.description.model = 'Air banyak'

                this.stepper.model = 3
                inputs.flora_data.model = [{
                    flora_name: 'Flora A',
                    flora_categories: 'Flora Asli',
                    flora_population: 230,
                    flora_foodsource: 'Mata Air',
                    flora_status: 'Pest',
                    flora_habitat: ``,
                }]
                inputs.fauna_data.model = [{
                    fauna_name: 'Fauna A',
                    fauna_categories: 'Peralihan',
                    fauna_population: 230,
                    fauna_foodsource: 'Nabati',
                    fauna_status: 'Pest',
                    fauna_habitat: ``,
                }]
            } catch (err) {this.errorResponse(err)}
        },
        async zwitchKeyName() {
            const rename = {
                scooping_form_no: 'form_no',
                paddy_land: 'tanah_sawah',
                field: 'tegal_ladang',
                resident: 'pemukiman',
                yard: 'pekarangan',
                marshland: 'tanah_rawa',
                lake: 'waduk_danau',
                people_plantation_land: 'tanah_perkebunan_rakyat',
                state_plantation_land: 'tanah_perkebunan_negara',
                private_plantation_land: 'tanah_perkebunan_swasta',
                protected_forest: 'hutan_lindung',
                people_forest: 'hutan_rakyat',
                public_facilities: 'fasilitas_umum',
                types_of_land_by_people: 'lahan_menurut_masyarakat',
                hamlets: 'dusuns',
                water_source: 'pra_watersource',
            }
            return rename
        }
    }
}
</script>