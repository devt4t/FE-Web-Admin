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
                            <template v-slot:item="data">
                              <v-list-item-content>
                                <v-list-item-title v-html="data.item.data_no"></v-list-item-title>
                                <v-list-item-subtitle>Desa: {{ data.item.village_name }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </template>
                        </v-autocomplete>
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
                                        <div class="d-flex align-center my-2">
                                            <p class="mb-0"><v-icon class="mr-2">{{ rraInput.icon }}</v-icon>{{ rraInput.title }}</p>
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
                                                    <v-row v-for="(multipleInputItem, multipleInputItemIndex) in inputs[multipleInputHead].model" :key="`MultipleInputs-${multipleInputHead}-${multipleInputItemIndex}`">
                                                        <v-col cols="auto" class="d-flex align-center">
                                                            <v-btn fab x-small color="green white--text" class="elevation-0"><v-icon>mdi-numeric-{{ multipleInputItemIndex + 1 }}</v-icon></v-btn>
                                                        </v-col>
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
                                                        <v-btn fab class="mr-2 elevation-0" color="green white--text" x-small >{{ pointIndex + 1 }}</v-btn>
                                                    </v-col>
                                                    <v-col cols="auto">
                                                        <v-btn rounded color="green white--text" class="elevation-0" style="width: 100px;">
                                                            {{ inputs.village_border[point].label }}
                                                        </v-btn>
                                                    </v-col>
                                                    <v-col cols="12" md="6" :lg="inputs.village_border[point].type.lgView">
                                                        <v-select
                                                            dense
                                                            color="success"
                                                            hide-details
                                                            item-color="success"
                                                            :items="inputs.village_border[point].type.items"
                                                            :label="inputs.village_border[point].type.label"
                                                            :menu-props="{rounded: 'xl',transition: 'slide-y-transition'}"
                                                            outlined
                                                            rounded
                                                            v-model="inputs.village_border[point].type.model"
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
                                                    <v-col cols="12" :lg="inputs.village_border[point].kecamatan.lgView" v-if="inputs.village_border[point].type.model == 'Kecamatan' || inputs.village_border[point].type.model == 'Desa'">
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
                                                    <v-col cols="12" :lg="inputs.village_border[point].desa.lgView" v-if="inputs.village_border[point].type.model == 'Desa'">
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
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Dusun Data -->
                                    <div class="d-flex align-center">
                                        <p class="mb-0"><v-icon class="mr-2">mdi-home-group</v-icon>Data Dusun</p>
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
                                                                    <span v-if="hm.hamlet_name && !open">
                                                                        <v-icon>mdi-numeric-{{ hmIndex+1 }}-circle</v-icon>
                                                                        {{ hm.hamlet_name }}
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
                model: '',
                loading: false
            },
            // village borderline
            village_border: {
                inputType: 'custom',
                north: {
                    label: 'Utara',
                    type: {
                        label: 'Tipe',
                        items: ['Kabupaten', 'Kecamatan', 'Desa'],
                        model: 'Kabupaten',
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
                    type: {
                        label: 'Tipe',
                        items: ['Kabupaten', 'Kecamatan', 'Desa'],
                        model: 'Kabupaten',
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
                    type: {
                        label: 'Tipe',
                        items: ['Kabupaten', 'Kecamatan', 'Desa'],
                        model: 'Kabupaten',
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
                    type: {
                        label: 'Tipe',
                        items: ['Kabupaten', 'Kecamatan', 'Desa'],
                        model: 'Kabupaten',
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
                model: '',
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
                        items: [
                            'Agroforestry Intensitas Tinggi',
                            'Agroforestry Intensitas Rendah',
                            'Konservasi',
                        ],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Pola',
                        multiple: false,
                        required: true,
                        lgView: 4
                    },
                    plants: {
                        inputType: 'combobox',
                        chip: true,
                        items: [],
                        hideSelected: true,
                        label: 'Tanaman',
                        multiple: true,
                        chip: true,
                        required: true,
                        lgView: 7
                    }
                },
                model: [],
                default: [{
                    pattern: null,
                    plants: []
                }],
                totalCanChange: true
            },
            // pola pemanfaatan lahan
            existing_plants: {
                inputType: 'multiple-input',
                form: {
                    category: {
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
                    plants: {
                        inputType: 'combobox',
                        chip: true,
                        items: [],
                        hideSelected: true,
                        label: 'Tanaman',
                        multiple: true,
                        chip: true,
                        required: true,
                        lgView: 7
                    }
                },
                model: [],
                default: [{
                    category: 'KAYU',
                    plants: []
                },{
                    category: 'MPTS',
                    plants: []
                },{
                    category: 'CROPS',
                    plants: []
                }],
                totalCanChange: false
            },
            // kelembagaan masyarakat
            community_institutions: {
                inputType: 'multiple-input',
                form: {
                    name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Lembaga',
                        required: true,
                        readonly: false,
                        lgView: 5
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
                    name: null,
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
                    category: {
                        inputType: 'autocomplete',
                        chip: false,
                        items: [],
                        itemText: 'value',
                        itemValue: 'value',
                        hideSelected: false,
                        label: 'Kategori Potensi',
                        multiple: false,
                        required: true,
                        readonly: false,
                        lgView: 4
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
                    category: null,
                    source: null,
                    description: null
                }],
                totalCanChange: true
            },
            // pemasaran hasil produksi
            production_marketing: {
                inputType: 'multiple-input',
                form: {
                    name: {
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
                        lgView: 5
                    },
                    method: {
                        inputType: 'combobox',
                        chip: true,
                        items: [],
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
                    buyer_name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Pembeli',
                        required: false,
                        readonly: false,
                        lgView: 4
                    },
                    buyer_phone: {
                        inputType: 'text-field',
                        type: 'number',
                        label: 'No Telp',
                        required: false,
                        readonly: false,
                        lgView: 4
                    },
                    buyer_email: {
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
                    name: null,
                    capacity: 0,
                    method: null,
                    period: null,
                    description: null,
                    buyer_name: null,
                    buyer_phone: null,
                    buyer_email: null,
                }],
                totalCanChange: true
            },
            // pemasaran hasil produksi
            identification_of_innovative_farmers: {
                inputType: 'multiple-input',
                form: {
                    name: {
                        inputType: 'text-field',
                        type: 'text',
                        label: 'Nama Petani',
                        required: true,
                        readonly: false,
                        lgView: 5
                    },
                    speciality: {
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
                    name: null,
                    speciality: null,
                    potential: null,
                    description: null,
                }],
                totalCanChange: true
            },// Dusun Data
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
                    hamlet_name: {
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
                        labelIcon: 'mdi-account-star',
                        potentialRequirement: true,
                    },
                    hamlet_pic_name: {
                        label: 'Nama',
                        type: 'text',
                        suffix: '',
                        lgView: 6,
                        labelIcon: '',
                        required: true,
                        potentialRequirement: true,
                    },
                    hamlet_pic_position: {
                        label: 'Jabatan',
                        type: 'text',
                        suffix: '',
                        lgView: 6,
                        labelIcon: '',
                        required: true,
                        potentialRequirement: true,
                    },
                    hamlet_pic_phone: {
                        label: 'No HP',
                        type: 'number',
                        suffix: '',
                        prependIcon: 'mdi-phone',
                        lgView: 6,
                        labelIcon: '',
                        required: true,
                        potentialRequirement: true,
                    },
                    hamlet_pic_whatsapp: {
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
                        label: 'Data Jumlah Keluarga',
                        type: 'divider',
                        lgView: 12,
                        labelIcon: 'mdi-human-male-female-child',
                        potentialRequirement: true,
                    },
                    number_of_rw: {
                        label: 'RW',
                        type: 'number',
                        suffix: 'RW',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: true,
                    },
                    number_of_rt: {
                        label: 'RT',
                        type: 'number',
                        suffix: 'RT',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: true,
                    },
                    number_of_male: {
                        label: 'Jumlah Laki - Laki',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-human-male',
                        required: true,
                        potentialRequirement: true,
                    },
                    number_of_female: {
                        label: 'Jumlah Perempuan',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-human-female',
                        required: true,
                        potentialRequirement: true,
                    },
                    number_of_families: {
                        label: 'Jumlah Keluarga (KK)',
                        type: 'number',
                        suffix: 'KK',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: false,
                    },
                    number_of_farmer_families: {
                        label: 'Jumlah Keluarga Petani (KK)',
                        type: 'number',
                        suffix: 'KK',
                        lgView: 6,
                        labelIcon: 'mdi-sigma',
                        required: true,
                        potentialRequirement: true,
                    },
                    avg_family_member: {
                        label: 'Rata - Rata Anggota Keluarga',
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
                    total_of_jr_highschool: {
                        label: 'SD - SMP',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-bus-school',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_of_sr_highschool: {
                        label: 'SMA',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-school',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_of_university: {
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
                    total_of_productive: {
                        label: 'Produktif',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-cash-check',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_of_not_productive: {
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
                    total_of_farmers: {
                        label: 'Petani',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-beekeeper',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_of_farmer_workers: {
                        label: 'Buruh Tani',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-beekeeper',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_of_priv_employee: {
                        label: 'Karyawan Swasta',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-supervisor',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_of_gov_employee: {
                        label: 'ASN (Guru, TNI, Polri)',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-tie',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_of_entrepreneur: {
                        label: 'Wiraswasta',
                        type: 'number',
                        suffix: 'orang',
                        lgView: 6,
                        labelIcon: 'mdi-account-cash',
                        required: true,
                        potentialRequirement: true,
                    },
                    total_of_other_profession: {
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
                    hamlet_name: null,
                    potential: false,
                    land_area: 0,
                    accessibility: null,
                    dry_land_area: 0,
                    hamlet_pic_name: 0,
                    hamlet_pic_position: 0,
                    hamlet_pic_phone: 0,
                    hamlet_pic_whatsapp: 0,
                    number_of_rw: 0,
                    number_of_rt: 0,
                    number_of_male: 0,
                    number_of_female: 0,
                    number_of_families: 0,
                    number_of_farmer_families: 0,
                    avg_family_member: 0,
                    total_of_jr_highschool: 0,
                    total_of_sr_highschool: 0,
                    total_of_university: 0,
                    total_of_productive: 0,
                    total_of_not_productive: 0,
                    total_of_farmers: 0,
                    total_of_farmer_workers: 0,
                    total_of_priv_employee: 0,
                    total_of_gov_employee: 0,
                    total_of_entrepreneur: 0,
                    total_of_other_profession: 0,
                }],
            },
            // village location inputs
            province: {
                inputType: 'autocomplete',
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
            maxSubDataTotal: 5,
            requiredInputIcon: 'mdi-alert-decagram'
        },
        stepper: {
            model: 1,
            steps: ['RRA', 'PRA', 'Social Impact'],
            steps_icon: ['home-analytics', 'home-group', 'home-alert']
        },
    }),
    watch: {
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
                const url = this.$store.getters.getApiUrl('GetScoopingAll')
                const res = await axios.get(url, this.$store.state.apiConfig)
                const data = res.data.data.result.filter(val => val.is_verify === 1)
                // console.log(data)
                this.inputs.scooping_form_no.items = data
            } catch (err) {this.errorResponse(err)}
        },
        modifyTotalSubData(type, name) {
            if (type == '+') {
                let inputs = null
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
                if (inputs) this.inputs[name].model.push(inputs)
                else {
                    const defaultData = JSON.parse(JSON.stringify(this.inputs[name].default[0]))
                    this.inputs[name].model.push(defaultData)
                }
            } else if (type == '-') this.inputs[name].model.pop()

            if (name == 'hamlets') this.inputs.hamlets.expansionModel = this.inputs.hamlets.model.length - 1
        },
        onResize() {
            this.localConfig.windowWidth = window.innerWidth
            // console.log(this.localConfig.windowWidth)
        },
        async setDefaultData() {
            try {
                this.loading.show = true
                // set default data for multiple inputs
                this.loading.text = 'Setting default data...'
                for (const [key, value] of Object.entries(this.inputs)) {
                    if (value.inputType) if (value.inputType === 'multiple-input') {
                        const defaultData = await JSON.parse(JSON.stringify(value.default))
                        value.model = defaultData
                    }            
                }
                // get scooping list item
                await this.getScoopingListItems()
                // get pola tanam options
                // this.inputs.land_use_patterns.form.pattern.items = await this.getOptionsDataReturn('List Opsi Tanam', 'GetOpsiPolaTanamOptions')
                // get list nama pohon
                const resTrees = await this.getOptionsDataReturn('Pohon Data', 'GetTreesAll')
                const listTrees = await resTrees.data.map(tree => {return tree.tree_name})
                this.inputs.land_use_patterns.form.plants.items = listTrees
                this.inputs.existing_plants.form.plants.items = listTrees
            } catch (err) {this.errorResponse(err)} finally {
                this.loading.show = false
            }
        }
    }
}
</script>